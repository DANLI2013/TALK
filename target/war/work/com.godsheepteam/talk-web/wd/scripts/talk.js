/**
 * Talk应用主类
 * @param socket
 * @param logonUser[uid,name,avatar] 当前登录用户 必须属性
 * @return
 */
function Talk(socket,logonUser){
	//当前登录用户
	this.logonUser = logonUser;
	//talk是否是激活状态
	this.actived = true;
	//遮罩层
	this.bgLayer = $("<div class=\"blackBg\" style=\"display:none;\"></div>");
	//socket通信对象
	this.socket = socket;
	//是否已经连接上服务器
	this.connected = false;
	//请求创建器
	this.request = new Request();
	//两大面板，关系面板和消息阅读面板
	this.relationPlane = new RelationPlane(this);
	this.msgReadPlane = new MsgReadPlane(this);
	//未读消息通知系统 包含系统消息
	this.msgNoticeSystem = new MsgNoticeSystem(this);
	//讨论组用户选择器
	this.discussionGroupMemberChooser = new DiscussionGroupMemberChooser(this);
	//未读消息分类集合
	this.msgCategories = [];
	//打开的消息对话框集合
	this.msgDialogs = [];
	
	this.build();
};

Talk.prototype.build = function(){
	$("#godContainer").append(this.bgLayer);
	this.addListener();
};

/**
 * 添加监听器
 * @return
 */
Talk.prototype.addListener = function(){
	var talk = this;
	$(window).bind("focus",function(event){
		talk.actived = true;
		SheepUtil.clearBlinkTitle();
	});
	
	$(window).bind("blur",function(event){
		talk.actived = false;
	});
	this.socketListener();
};

/**
 * 添加socket系列监听器
 * @return
 */
Talk.prototype.socketListener = function(){
	var talk = this;
	// 处理服务器返回信息
	this.socket.onmessage = function(msg){
		var data = eval('('+msg.data+')');
		//获取处理函数的名称
		var functionName = data.functionName;
		talk[functionName](data);
	};
	
	// 连接上websocket
	this.socket.onopen = function(){
		talk.connected = true;
		var requestMsg = talk.request.register(talk.logonUser.uid);
		talk.sendRequest(requestMsg)
	};
	
	//错误处理
	this.socket.onerror = function(msg){
		alert("应用出现致命错误:" + msg);
	};
	
	//断开处理
	this.socket.onclose = function(){
		alert("与服务器的连接已断开，本页面失效！");
	}
};

/**
 * 接收到聊天消息
 * @param data
 * @return
 */
Talk.prototype.receiveChatMsg = function(data){
	var isRead = false;
	var dialogId = data.dstId;
	
	//如果发现是被屏蔽的群消息,或是黑名单中的人发来的消息，直接丢弃
	if("PrivateChat"==data.type){
		var chater = this.relationPlane.blackListGroup.getChater(data.senderId);
		if(chater!=null){
			return;
		}
	}else if("GroupChat"==data.type){
		var joinedChatGroup = this.relationPlane.getJoinedChatGroup(data.dstId);
		if(joinedChatGroup.msgOption=="shield"){
			return;
		}
	}else if("DiscussionGroupChat"==data.type){
		var joinedDiscussionGroup = this.relationPlane.getJoinedDiscussionGroup(data.dstId);
		if(joinedDiscussionGroup.msgOption=="shield"){
			return;
		}
	}
	
	//私聊时接收他人的信息，需要发信人的ID找dialog
	if("PrivateChat"==data.type && data.senderId!=this.logonUser.uid){
		dialogId = data.senderId;
	}
	
	var dialog = this.getDialog(dialogId);
	if(dialog!=null){
		if(dialog.container.is(':visible')){
			dialog.addMsg(data);
			isRead = true;
		}else{
			//如果窗口已存在，但未显示，需要闪烁其对应的tab页
			var tab = this.msgReadPlane.footer.getDialogTab(dialogId);
			tab.blink();
		}
	}
	
	//是否闪烁标题
	if(!this.actived){
		if("PrivateChat"==data.type){
			SheepUtil.blinkTitle("你有新的私人信息！");
		}else if("GroupChat"==data.type){
			var joinedChatGroup = this.relationPlane.getJoinedChatGroup(data.dstId);
			if(joinedChatGroup.msgOption=="normal"){
				SheepUtil.blinkTitle("你有新的群信息！");
			}
		}else if("DiscussionGroupChat"==data.type){
			var joinedDiscussionGroup = this.relationPlane.getJoinedDiscussionGroup(data.dstId);
			if(joinedDiscussionGroup.msgOption=="normal"){
				SheepUtil.blinkTitle("你有新的讨论组信息！");
			}
		}
	}
	
	if(!isRead){
		//添加消息到消息分类
		var msgCategory = this.getMsgCategory(dialogId);
		if(msgCategory==null){
			msgCategory = this.relationPlane.createChatMsgCategory(data);
			this.msgCategories.push(msgCategory);
		}
		msgCategory.addChatMsg(data);
		
		//更新系统未读消息状态
		this.updateUnReadMsgStatus();
	}
};

/**
 * 获取聊天对话框
 * @param id
 * @return
 */
Talk.prototype.getDialog = function(id){
	for(var i=0;i<this.msgDialogs.length;i++){
		if(this.msgDialogs[i].id==id){
			return this.msgDialogs[i];
		}
	}
	return null;
};

/**
 * 获取指定的消息分类
 * @param id
 * @return
 */
Talk.prototype.getMsgCategory = function(id){
	for(var i=0;i<this.msgCategories.length;i++){
		if(this.msgCategories[i].id==id){
			return this.msgCategories[i];
		}
	}
	return null;
};

/**
 * 发送请求
 * @param requestMsg 请求字符串 目前只支持字符串
 * @return 发送成功返回true
 */
Talk.prototype.sendRequest = function(requestMsg){
	if(this.connected){
		this.socket.send(requestMsg);
		return true;
	}else{
		alert("socket连接未打开。请检查浏览器版本或刷新页面！");
		return false;
	}
};

/**
 * 打开一个窗体
 * @param owner
 * @param type
 * @return
 */
Talk.prototype.openDialog = function(owner,type){
	var dialog = null;
	if(type=="GroupChat"){
		dialog = this.openChatGroupDialog(owner.uid);
		if(dialog==null){
			//向服务器请求群信息
			var requestMsg = this.request.getChatGroupDetail(owner.uid);
			this.sendRequest(requestMsg);
		}
	}else if(type=="DiscussionGroupChat"){
		dialog = this.openDiscussionGroupDialog(owner.uid);
		if(dialog==null){
			//向服务器请求讨论组信息
			var requestMsg = this.request.getDiscussionGroupDetail(owner.uid);
			this.sendRequest(requestMsg);
		}
	}else{
		dialog = this.openPrivateDialog(owner);
	}
	//如果正常打开窗口，则消费掉分类中存储的所有未读消息
	if(dialog!=null){
		this.consumeUnReadMsg(owner.uid, dialog);
	}
};

/**
 * 打开私人聊天窗口
 * @param owner[uid,name,avatar]
 * @return 窗口对象
 */
Talk.prototype.openPrivateDialog = function(owner){
	//创建/显示窗口
	var dialog = this.getDialog(owner.uid);
	if(dialog==null){
		dialog = new ChatDialog(this,owner);
		this.msgDialogs.push(dialog);
	}else{
		dialog.focus();
	}
	//创建/显示TAB页
	var tab = this.msgReadPlane.footer.getDialogTab(owner.uid);
	if(tab==null){
		tab = this.msgReadPlane.footer.createDialogTab(owner.uid, owner.name);
	}else{
		tab.focus();
		//取消闪烁提示
		tab.cancelBlink();
	}
	//创建完毕，显示阅读消息面板
	this.showMsgReadPlane();
	return dialog;
};

/**
 * 打开群组聊天窗口
 * @param uid
 * @return 返回null证明该窗口不存在
 */
Talk.prototype.openChatGroupDialog = function(uid){
	//显示窗口
	var dialog = this.getDialog(uid);
	if(dialog!=null){
		dialog.focus();
		//显示TAB页
		var tab = this.msgReadPlane.footer.getDialogTab(uid);
		tab.focus();
		//取消闪烁提示
		tab.cancelBlink();
		//创建完毕，显示阅读消息面板
		this.showMsgReadPlane();
	}
	return dialog;
};

/**
 * 打开讨论组聊天窗口
 * @param uid
 * @return 返回null证明该窗口不存在
 */
Talk.prototype.openDiscussionGroupDialog = function(uid){
	//显示窗口
	var dialog = this.getDialog(uid);
	if(dialog!=null){
		dialog.focus();
		//显示TAB页
		var tab = this.msgReadPlane.footer.getDialogTab(uid);
		tab.focus();
		//取消闪烁提示
		tab.cancelBlink();
		//创建完毕，显示阅读消息面板
		this.showMsgReadPlane();
	}
	return dialog;
};

/**
 * 创建群聊天窗口
 * @param chatGroupData
 * @return 窗口对象
 */
Talk.prototype.createChatGroupDialog = function(chatGroupData){
	var dialog = this.getDialog(chatGroupData.uid);
	//当dialog不存在的情况下，创建窗口套件
	if(dialog==null){
		//创建/显示窗口
		dialog = new ChatGroupDialog(this,chatGroupData);
		this.msgDialogs.push(dialog);
		//创建/显示TAB页
		var tab = this.msgReadPlane.footer.createDialogTab(chatGroupData.uid, chatGroupData.name);
	}
	
	//显示阅读消息面板
	this.showMsgReadPlane();
	
	//消费掉分类中存储的所有未读消息
	this.consumeUnReadMsg(chatGroupData.uid, dialog);
	return dialog;
};

/**
 * 创建讨论组聊天窗口
 * @param discussionGroupData
 * @return 窗口对象
 */
Talk.prototype.createDiscussionGroupDialog = function(discussionGroupData){
	var dialog = this.getDialog(discussionGroupData.uid);
	//当dialog不存在的情况下，创建窗口套件
	if(dialog==null){
		//创建/显示窗口
		dialog = new DiscussionGroupDialog(this,discussionGroupData);
		this.msgDialogs.push(dialog);
		//创建/显示TAB页
		var tab = this.msgReadPlane.footer.createDialogTab(discussionGroupData.uid, discussionGroupData.name);
	}
	
	//显示阅读消息面板
	this.showMsgReadPlane();
	
	//消费掉分类中存储的所有未读消息
	this.consumeUnReadMsg(discussionGroupData.uid, dialog);
	return dialog;
};

/**
 * 消费未读消息
 * @param categoryId 消息分类ID
 * @param dialog 窗体
 * @return
 */
Talk.prototype.consumeUnReadMsg = function(categoryId,dialog){
	var msgCategory = this.getMsgCategory(categoryId);
	//如果有未读消息，加入未读消息
	if(dialog!=null&&msgCategory!=null){
		$(msgCategory.consumeMsg()).each(function(i,msg){
			dialog.addMsg(msg);
		});
	}
};

/**
 * 显示阅读消息面板
 * @return
 */
Talk.prototype.showMsgReadPlane = function(){
	this.msgReadPlane.plane.stop();
	this.msgReadPlane.plane.css({"left":"100px",opacity:0});
	this.msgReadPlane.plane.show();
	this.msgReadPlane.plane.animate({
	left:"0px",
	opacity:1
	},500);
};

/**
 * 隐藏阅读消息面板
 * @return
 */
Talk.prototype.hideMsgReadPlane = function(){
	var talk = this;
	this.msgReadPlane.plane.stop();
	this.msgReadPlane.plane.animate({
	left:"-100px",
	opacity:0
	},500,function(){
		talk.msgReadPlane.plane.hide();
	});
};

/**
 * 更新未读消息状态
 * @return
 */
Talk.prototype.updateUnReadMsgStatus = function(){
	var unReadMsgNum = 0;
	$(this.msgCategories).each(function(i,category){
		unReadMsgNum+=category.msgs.length;
	});
	this.msgNoticeSystem.setChatMsgNoticeStatus(unReadMsgNum);
};

/**
 * 新用户分组
 * @param userGroupData
 * @return
 */
Talk.prototype.newUserGroup = function(data){
	this.relationPlane.createUserGroup(data);
};

/**
 * 移除指定用户分组
 * @param data
 * @return
 */
Talk.prototype.removeUserGroup = function(data){
	this.relationPlane.removeUserGroup(data.uid);
};

/**
 * 出现新用户
 * @param data
 * @return
 */
Talk.prototype.newChater = function(data){
	//添加到默认用户组
	this.relationPlane.commonGroup.addChater(data);
};

/**
 * 新的群成员
 * @param data
 * @return
 */
Talk.prototype.newChatGroupMember = function(data){
	var dialog = this.getDialog(data.chatGroupId);
	//更新到群成员列表里
	if(dialog!=null){
		data.identity=3;
		dialog.addMember(data);
	}
};

/**
 * 新的讨论组成员
 * @param data
 * @return
 */
Talk.prototype.newDiscussionGroupMember = function(data){
	var dialog = this.getDialog(data.discussionGroupId);
	//更新到群成员列表里
	if(dialog!=null){
		data.identity=3;
		dialog.addMember(data);
	}
};

/**
 * 移除指定的群成员
 * @param data
 * @return
 */
Talk.prototype.removeChatGroupMember = function(data){
	var dialog = this.getDialog(data.chatGroupId);
	//从群成员列表里移除
	if(dialog!=null){
		dialog.removeMember(data.memberId);
	}
};

/**
 * 移除指定的群管理员
 * @param data
 * @return
 */
Talk.prototype.removeChatGroupManager = function(data){
	var dialog = this.getDialog(data.chatGroupId);
	if(dialog!=null){
		dialog.removeManagerIdentity(data.memberId);
	}
};

/**
 * 添加指定的群管理员
 * @param data
 * @return
 */
Talk.prototype.becomeChatGroupManager = function(data){
	var dialog = this.getDialog(data.chatGroupId);
	if(dialog!=null){
		dialog.addManagerIdentity(data.memberId);
	}
};

/**
 * 移除指定的群成员
 * @param data
 * @return
 */
Talk.prototype.removeDiscussionGroupMember = function(data){
	var dialog = this.getDialog(data.discussionGroupId);
	//从群成员列表里移除
	if(dialog!=null){
		dialog.removeMember(data.memberId);
	}
};

/**
 * 设置某群组消息设置
 * @param data
 * @return
 */
Talk.prototype.chatGroupMsgOptionChange = function(data){
	//添加到默认用户组
	var joinedChatGroup = this.relationPlane.getJoinedChatGroup(data.chatGroupId);
	joinedChatGroup.setMsgOption(data.msgOption);
};

/**
 * 设置某讨论组消息设置
 * @param data
 * @return
 */
Talk.prototype.discussionGroupMsgOptionChange = function(data){
	//添加到默认用户组
	var joinedDiscussionGroup = this.relationPlane.getJoinedDiscussionGroup(data.discussionGroupId);
	joinedDiscussionGroup.setMsgOption(data.msgOption);
};

/**
 * 成员上线
 * @param data
 * @return
 */
Talk.prototype.chaterOnline = function(data){
	var chater = this.relationPlane.getChater(data.uid);
	if(chater!=null){
		chater.online();
	}
};

/**
 * 成员离线
 * @param data
 * @return
 */
Talk.prototype.chaterLeave = function(data){
	var chater = null;
	for(var i = 0;i<this.relationPlane.userGroups.length;i++){
		if(chater==null){
			chater = this.relationPlane.userGroups[i].getChater(data.uid);
		}else{
			break;
		}
	}
	if(chater!=null){
		//离线
		chater.leave();
	}
	
	//使打开的群中的该成员也处于离线状态
	for(var i = 0;i<this.msgDialogs;i++){
		if(this.msgDialogs[i].type=="GroupChat"||this.msgDialogs[i].type=="DiscussionGroupChat"){
			var member = this.msgDialogs[i].getMember(data.uid);
			if(member!=null){
				member.leave();
			}
		}
	}
};

/**
 * 添加一个聊天群组
 * @param data
 * @return
 */
Talk.prototype.newChatGroup = function(data){
	this.relationPlane.addJoinedChatGroup(data);
};

/**
 * 添加一个讨论组
 * @param data
 * @return
 */
Talk.prototype.newDiscussionGroup = function(data){
	this.relationPlane.addJoinedDiscussionGroup(data);
};

/**
 * 接收系统信息
 * @param data
 * @return
 */
Talk.prototype.receiveNotice = function(data){
	this.msgNoticeSystem.sysMsgNoticeSystem.addCommonNotice(data);
};

/**
 * 接收申请加入群组通知
 * @param data
 * @return
 */
Talk.prototype.receiveApp2JoinGroupNotice = function(data){
	this.msgNoticeSystem.sysMsgNoticeSystem.addApp2JoinGroupNotice(data);
};

/**
 * 接收管理群组邀请的通知
 * @param data
 * @return
 */
Talk.prototype.receiveManageChatGroupInvitationNotice = function(data){
	this.msgNoticeSystem.sysMsgNoticeSystem.addManageChatGroupInvitationNotice(data);
};

/**
 * 接收加入讨论组邀请的通知
 * @param data
 * @return
 */
Talk.prototype.receiveJoinDiscussionGroupInvitationNotice = function(data){
	this.msgNoticeSystem.sysMsgNoticeSystem.addJoinDiscussionGroupInvitationNotice(data);
};

/**
 * 更改讨论组信息
 * @param data
 * @return
 */
Talk.prototype.discussionGroupInfoChange = function(data){
	//设置讨论组列表信息
	var joinedDiscussionGroup = this.relationPlane.getJoinedDiscussionGroup(data.discussionGroupId);
	if(joinedDiscussionGroup!=null){
		joinedDiscussionGroup.settingInfo(data.name,data.description);
	}
	//设置讨论组对话框信息
	var dialog = this.getDialog(data.discussionGroupId);
	if(dialog!=null){
		dialog.settingInfo(data.name,data.description);
	}
};

/**
 * 移除某用户
 * @param data
 * @return
 */
Talk.prototype.removeChater = function(data){
	var userGroup = this.relationPlane.getUserGroup(data.userGroupId);
	if(userGroup!=null){
		userGroup.removeChater(data.uid);
	}
};

/**
 * 切换用户组
 * @param data
 * @return
 */
Talk.prototype.changeChaterGroup = function(data){
	var prevUserGroup = this.relationPlane.getUserGroup(data.prevUserGroupId);
	var toUserGroup = this.relationPlane.getUserGroup(data.toUserGroupId);
	if(prevUserGroup!=null&&toUserGroup!=null){
		var chater = prevUserGroup.removeChater(data.chaterId);
		toUserGroup.addChater(chater.chaterData);
	}
};

/**
 * 添加用户到指定用户组（初始化专用）
 * @param userGroupId
 * @param data
 * @return
 */
Talk.prototype.addChater2UserGroup = function(userGroupId,data){
	var ug = this.relationPlane.getUserGroup(userGroupId);
	if(ug!=null){
		ug.addChater(data);
	}
};

/**
 * 移除一个群
 * @param data
 * @return
 */
Talk.prototype.removeChatGroup = function(data){
	this.relationPlane.removeJoinedChatGroup(data.uid)
};

/**
 * 移除一个讨论组
 * @param data
 * @return
 */
Talk.prototype.removeDiscussionGroup = function(data){
	this.relationPlane.removeJoinedDiscussionGroup(data.uid);
};

/**
 * 显示错误信息
 * @param data
 * @return
 */
Talk.prototype.err = function(data){
	alert(data.errMsg);
};

/**
 * 添加用户到默认组（初始化专用）
 * @param data
 * @return
 */
Talk.prototype.addChater2CommonGroup = function(data){
	this.relationPlane.commonGroup.addChater(data);
};

/**
 * 添加用户到黑名单（初始化专用）
 * @param data
 * @return
 */
Talk.prototype.addChater2BlacklistGroup = function(data){
	this.relationPlane.blackListGroup.addChater(data);
};

/**
 * 关系面板
 * @return
 */
function RelationPlane(talk){
	this.talk =talk;
	//主面板
	this.plane = $("#relationPlane");
	//表情选择面板
	this.smileChoosePlane = $("#smileChoosePlane");
	//关闭表情选择面板
	this.closeSmileChoosePlaneBtn = $("#closeSmileChoosePlaneBtn");
	//当前的表情输入框
	this.currentSmileInput = null;
	//关系信息面板
	this.relationTab = $("#relationTab");
	//未读信息列表面板
	this.msgListTab = $("#msgListTab");
	//关系面板头部
	this.header = new RelationPlaneHeader(this);
	//讨论组头部
	this.discussionGroupHeader = $("#discussionGroupHeader");
	// 用户组容器
	this.userGroupContainer = $("#userGroupContainer");
	//用户搜索结果层
	this.userSearchResultContainer = $("#userSearchResultContainer");
	//选择组菜单
	this.chooseGroupsMenu = $("#chooseGroupsMenu");
	//创建新组FORM
	this.newGroupForm = $("#newGroupForm");
	//新分组名称
	this.newGroupName = $("#newGroupName");
	//创建新分组按钮
	this.createNewGroupBtn = $("#createNewGroupBtn");
	//加入的群组集合
	this.joinedChatGroups = [];
	//加入的讨论组集合
	this.joinedDiscussionGroups = [];
	//用户组集合
	this.userGroups = [];
	//默认用户组
	this.commonGroup = new UserGroup(this,{uid:"commonGroup",name:"默认用户组"});
	//黑名单
	this.blackListGroup = new UserGroup(this,{uid:"blackListGroup",name:"黑名单"});
	//初始化DOM树
	this.build();
};

/**
 * 初始化关系面板
 * @return
 */
RelationPlane.prototype.build = function(){
	//添加默认用户组和黑名单
	this.userGroups.push(this.commonGroup);
	this.userGroups.push(this.blackListGroup);
	
	//开启验证
	new Validator(this.chooseGroupsMenu);
	this.addListener();
};

/**
 * 绑定事件
 * @return
 */
RelationPlane.prototype.addListener = function(){
	var relationPlane = this;
	
	//发送创建群组的请求
	this.createNewGroupBtn.bind("click",function(event){
		var groupName = relationPlane.newGroupName.val();
		var requestMsg = relationPlane.talk.request.createUserGroup(groupName);
		relationPlane.talk.sendRequest(requestMsg);
		relationPlane.newGroupName.val("");
	});
	
	//阻止事件冒泡
	this.newGroupName.bind("click",function(event){
		event.stopPropagation();
	});
	
	//隐藏切换用户分组菜单
	$("body").bind("click",function(event){
		relationPlane.hideChangeGroupMenu();
		relationPlane.userSearchResultContainer.hide();
	});
	
	//表情切换
	var layerTab_title= this.smileChoosePlane.find(".layerTab_title");
	var layerTab_list= this.smileChoosePlane.find(".layerTab_list");
	layerTab_title.click(function(){
		layerTab_title.removeClass("layerTab_titleAfter");	
		$(this).addClass("layerTab_titleAfter");
		layerTab_list.hide();
		$(this).next().show();
	});
	
	//关闭表情层
	this.closeSmileChoosePlaneBtn.bind("click",function(event){
		relationPlane.smileChoosePlane.hide();
		relationPlane.talk.bgLayer.hide();
		relationPlane.currentSmileInput.focus();
		relationPlane.currentSmileInput = null;
	});
	
	//选择某个表情
	this.smileChoosePlane.find("[smileSign]").bind("click",function(event){
		var smileSign = $(this).attr("smileSign");
		relationPlane.currentSmileInput.val(relationPlane.currentSmileInput.val()+smileSign);
		relationPlane.closeSmileChoosePlaneBtn.click();
	});
	
	//绑定人员搜索
	this.userGroupContainer.find(".gsttText1").bind("keyup",function(){
		var val = $(this).val();
		var hitNum = 0;
		relationPlane.userSearchResultContainer.empty();
		for(var i=0;i<relationPlane.userGroups.length;i++){
			for(var j=0;j<relationPlane.userGroups[i].chaters.length;j++){
				if(val!=""&&relationPlane.userGroups[i].chaters[j].name.html().indexOf(val)!=-1){
					var nameObj = relationPlane.userGroups[i].chaters[j].name;
					var resultObj = $("<li class=\"peoleSearchLi\"><a href=\"javascript:;\">"+nameObj.html()+"</a></li>");
					relationPlane.userSearchResultContainer.append(resultObj);
					resultObj.bind("click",function(event){
						nameObj.click();
						relationPlane.userSearchResultContainer.empty();
					});
					hitNum++;
				}
			}
		}
		
		//有结果则显示，无结果则隐藏
		if(hitNum>0){
			relationPlane.userSearchResultContainer.show();
		}else{
			relationPlane.userSearchResultContainer.hide();
			relationPlane.userSearchResultContainer.empty();
		}
	});
	
	//显示/隐藏用户组
	this.discussionGroupHeader.bind("click",function(event){
		$(this).toggleClass("ind_talkGroup_h3Open");
		$(this).next().toggle();
	});
	
	//创建新讨论组
	this.discussionGroupHeader.find("a").bind("click",function(event){
		event.stopPropagation();
		relationPlane.talk.discussionGroupMemberChooser.show();
	});
};

/**
 * 创建一个聊天消息分类
 * @param data
 * @return
 */
RelationPlane.prototype.createChatMsgCategory = function(data){
	return new ChatMsgCategory(data,this);
};

/**
 * 创建一个用户分组
 * @param data
 * @return
 */
RelationPlane.prototype.createUserGroup = function(data){
	var ug = new UserGroup(this,data);
	this.userGroups.push(ug);
	return ug;
};

/**
 * 删除一个用户组，并把其下所有的用户移到默认用户组
 * @param data
 * @return
 */
RelationPlane.prototype.removeUserGroup = function(uid){
	var userGroup = this.getUserGroup(uid);
	if(userGroup!=null){
		userGroup.destroy();
	}
};

/**
 * 显示切换用户组菜单
 * @param chaterId
 * @param prevUserGroupId
 * @return
 */
RelationPlane.prototype.showChangeGroupMenu = function(chaterId,prevUserGroupId,offsetTop){
	this.chooseGroupsMenu.find(".addPeopleGroup_li").remove();
	//生成菜单条目
	for(var i = 0;i<this.userGroups.length;i++){
		//不显示黑名单
		if(this.userGroups[i].id!="blackListGroup"){
			this.createChangeGroupMenuItem(this.userGroups[i], chaterId, prevUserGroupId);
		}
	};
	//位置控制
	if(offsetTop+this.chooseGroupsMenu.height()>375){
		offsetTop=375-this.chooseGroupsMenu.height();
	}
	this.chooseGroupsMenu.css("top",offsetTop);
	//显示菜单
	this.chooseGroupsMenu.show();
};

/**
 * 隐藏切换用户组菜单
 * @return
 */
RelationPlane.prototype.hideChangeGroupMenu = function(){
	this.chooseGroupsMenu.hide();
	this.chooseGroupsMenu.find("li .addPeopleGroup_li").remove();
}

/**
 * 创建一个选择分组菜单条目
 * @param userGroup 用户组
 * @param chaterId 当前用户
 * @param prevUserGroupId 当前用户现在所属的分组
 * @return
 */
RelationPlane.prototype.createChangeGroupMenuItem = function(userGroup,chaterId,prevUserGroupId){
	var groupItem = $("<li class=\"addPeopleGroup_li\"><a href=\"javascript:;\">"+userGroup.userGroupData.name+"</a></li>");
	this.newGroupForm.before(groupItem);
	var relationPlane = this;
	//绑定更换用户组的事件
	groupItem.bind("click",function(event){
		var requestMsg = relationPlane.talk.request.changeUserGroup(chaterId,prevUserGroupId,userGroup.id);
		relationPlane.talk.sendRequest(requestMsg);
	});
};

/**
 * 添加一个已加入的群组
 * @param data
 * @return
 */
RelationPlane.prototype.addJoinedChatGroup = function(data){
	this.joinedChatGroups.push(new JoinedChatGroup(data,this));
};

/**
 * 添加一个已加入的讨论组
 * @param data
 * @return
 */
RelationPlane.prototype.addJoinedDiscussionGroup = function(data){
	this.joinedDiscussionGroups.push(new JoinedDiscussionGroup(data,this));
};

/**
 * 移除一个已加入的群组
 * @param uid
 * @return
 */
RelationPlane.prototype.removeJoinedChatGroup = function(uid){
	for(var i = this.joinedChatGroups.length-1; i>-1; i--){
		if(this.joinedChatGroups[i].id==uid){
			this.joinedChatGroups[i].remove();
			//缩短数组
			this.joinedChatGroups.splice(i,1);
		}
	}
};

/**
 * 移除一个已加入的讨论组
 * @param uid
 * @return
 */
RelationPlane.prototype.removeJoinedDiscussionGroup = function(uid){
	for(var i = this.joinedDiscussionGroups.length-1; i>-1; i--){
		if(this.joinedDiscussionGroups[i].id==uid){
			this.joinedDiscussionGroups[i].remove();
			//缩短数组
			this.joinedDiscussionGroups.splice(i,1);
		}
	}
};

/**
 * 获取存在的用户分组
 * @param uid
 * @return
 */
RelationPlane.prototype.getUserGroup = function(uid){
	for(var i = 0;i<this.userGroups.length; i++){
		if(this.userGroups[i].id==uid){
			return this.userGroups[i];
		}
	}
	return null;
};

/**
 * 获取用户组中指定的用户
 * @param uid
 * @return
 */
RelationPlane.prototype.getChater = function(uid){
	var chater = null;
	for(var i = 0;i<this.userGroups.length; i++){
		if((chater=this.userGroups[i].getChater(uid))!=null){
			break;
		}
	}
	return chater;
};

/**
 * 获取存在的群组
 * @param uid
 * @return
 */
RelationPlane.prototype.getJoinedChatGroup = function(uid){
	for(var i = 0;i<this.joinedChatGroups.length; i++){
		if(this.joinedChatGroups[i].id==uid){
			return this.joinedChatGroups[i];
		}
	}
	return null;
};

/**
 * 获取存在的讨论组
 * @param uid
 * @return
 */
RelationPlane.prototype.getJoinedDiscussionGroup = function(uid){
	for(var i = 0;i<this.joinedDiscussionGroups.length; i++){
		if(this.joinedDiscussionGroups[i].id==uid){
			return this.joinedDiscussionGroups[i];
		}
	}
	return null;
};

/**
 * 显示表情选择面板
 * @param currentSmileInput
 * @return
 */
RelationPlane.prototype.openSmilePlane = function(currentSmileInput){
	this.currentSmileInput = currentSmileInput;
	this.talk.bgLayer.show();
	this.smileChoosePlane.show();
}

/**
 * 关系面板头部
 * @param mainPlane
 * @return
 */
function RelationPlaneHeader(mainPlane){
	this.mainPlane = mainPlane;
	this.relationTabHandler = $("#relationTabHandler");
	this.msgListTabHandler = $("#msgListTabHandler");
	
	this.init();
};

/**
 * 初始化头部对象
 * @return
 */
RelationPlaneHeader.prototype.init = function(){
	var header = this;
	//绑定面板切换事件
	this.relationTabHandler.bind("click",function(event){
		header.showRelationTab();
	});
	
	this.msgListTabHandler.bind("click",function(event){
		header.showMsgListTab()
	});
};

/**
 * 显示关系面板
 * @return
 */
RelationPlaneHeader.prototype.showRelationTab = function(){
	this.msgListTabHandler.removeClass("gsttNav_after");
	this.relationTabHandler.addClass("gsttNav_after");
	this.mainPlane.relationTab.show();
	this.mainPlane.msgListTab.hide();
};

/**
 * 显示消息列表面板
 * @return
 */
RelationPlaneHeader.prototype.showMsgListTab = function(){
	this.relationTabHandler.removeClass("gsttNav_after");
	this.msgListTabHandler.addClass("gsttNav_after");
	this.mainPlane.relationTab.hide();
	this.mainPlane.msgListTab.show();
};

/**
 * 用户组
 * @param relationPlane 关系面板引用
 * @param userGroupData 用户组数据[uid,name]
 * @return
 */
function UserGroup(relationPlane,userGroupData){
	this.parent = relationPlane;
	//标志
	this.id = userGroupData.uid;
	//用户组数据
	this.userGroupData = userGroupData;
	//用户组头部
	this.header = $("<h5 class=\"main_bbRight_h5 main_bbRight_h5Open\">"+userGroupData.name+" <span class=\"onlineNum\">0</span>/<span class=\"totalNum\">0</span></h5>");
	//删除本组的按钮
	this.delBtn = $("<span class=\"main_bbRight_h5Remove\" title=\"删除本组\">x</span>");
	//用户组成员容器
	this.chaterContainer = $("<ul class=\"myPeopleList\"></ul>");
	//所持有的用户
	this.chaters = [];
	
	this.build();
};

/**
 * 初始化用户组，构建DOM树
 * @return
 */
UserGroup.prototype.build = function(){
	if(this.id=="commonGroup"||this.id=="blackListGroup"){
		this.parent.userGroupContainer.append(this.header);
		this.parent.userGroupContainer.append(this.chaterContainer);
	}else{
		this.parent.blackListGroup.header.before(this.chaterContainer);
		this.chaterContainer.before(this.header);
		this.header.append(this.delBtn);
	};
	
	this.addListener();
};

/**
 * 总人数
 * @return
 */
UserGroup.prototype.getTotalNum = function(){
	return parseInt(this.header.find(".totalNum").html());
};

/**
 * 在线人数
 * @return
 */
UserGroup.prototype.getOnlineNum = function(){
	return parseInt(this.header.find(".onlineNum").html());
};

/**
 * 设置总人数
 * @param totalNum
 * @return
 */
UserGroup.prototype.setTotalNum = function(totalNum){
	this.header.find(".totalNum").html(totalNum);
};

/**
 * 设置在线人数
 * @param onlineNum
 * @return
 */
UserGroup.prototype.setOnlineNum = function(onlineNum){
	this.header.find(".onlineNum").html(onlineNum);
};

/**
 * 添加监听器
 * @return
 */
UserGroup.prototype.addListener = function(){
	var ug = this;
	this.header.bind("click",function(event){
		ug.chaterContainer.toggle();
		ug.header.toggleClass("main_bbRight_h5Open");
		ug.header.toggleClass("main_bbRight_h5Close");
	});
	
	//绑定删除事件
	this.delBtn.bind("click",function(event){
		event.stopPropagation();
		if(confirm("确认要删除本分组吗？")){
			var requestMsg = ug.parent.talk.request.removeUserGroup(ug.id);
			ug.parent.talk.sendRequest(requestMsg);
		}
	});
};

/**
 * 添加一个用户到组内
 * @param chaterData
 * @return
 */
UserGroup.prototype.addChater = function(chaterData){
	this.chaters.push(new Chater(this,chaterData));
	this.setTotalNum(this.getTotalNum()+1);
	if(chaterData.online){
		this.setOnlineNum(this.getOnlineNum()+1);
	}
};

/**
 * 组内移除一个用户
 * @param uid
 * @return
 */
UserGroup.prototype.removeChater = function(id){
	var chater = null;
	for(var i = this.chaters.length-1; i>-1; i--){
		if(this.chaters[i].id==id){
			chater = this.chaters[i];
			//缩短数组
			this.chaters.splice(i,1);
		}
	}
	//从domain树移除
	if(chater!=null){
		chater.destroy();
	}
	this.setTotalNum(this.getTotalNum()-1);
	if(chater.chaterData.online){
		this.setOnlineNum(this.getOnlineNum()-1);
	}
	return chater;
};

/**
 * 获取指定聊天者
 * @param uid
 * @return
 */
UserGroup.prototype.getChater = function(uid){
	for(var i = 0; i < this.chaters.length; i++){
		if(this.chaters[i].id==uid){
			return this.chaters[i];
		}
	}
	return null;
};

/**
 * 销毁本组，将本组成员都添加到默认组里
 * @return
 */
UserGroup.prototype.destroy = function(){
	for(var i=0;i<this.chaters.length;i++){
		this.parent.commonGroup.addChater(this.chaters[i].chaterData);
	}
	for(var i = this.parent.userGroups.length-1; i>-1; i--){
		if(this.parent.userGroups[i].id==this.id){
			//删除本组
			this.parent.userGroups.splice(i,1);
			break;
		}
	}
	//从DOM树移除
	this.header.remove();
	this.chaterContainer.remove();
};

/**
 * 聊天者 
 * @param userGroup 所属用户组
 * @param chaterData 用户数据 [uid,nickname,avatar,online]
 * @return
 */
function Chater(userGroup,chaterData){
	this.id = chaterData.uid;
	this.chaterData = chaterData;
	this.parent = userGroup;
	this.container = $("<li class=\"myPeopleLi noline\"></li>");
	this.avatar = $("<a href=\"javascript:;\" class=\"miniPhoto\"><img src=\""+baseUrl+chaterData.avatar+"\" /></a>");
	this.name = $("<a href=\"javascript:;\" class=\"myPeopleLi_name\">"+chaterData.nickname+"</a>");
	this.setting = $("<a href=\"javascript:;\" class=\"myPeopleLi_toolA\">设置</a>");
	
	//设置选项容器
	this.settingContainer = $("<ul class=\"index_moreList\"></ul>");
	this.settingSign = $("<li class=\"index_moreLi\" ><a href=\"javascript:;\" class=\"index_moreTitle\">设置</a></li>");
	this.setGroupBtn = $("<li class=\"index_moreLi index_moreLi_child\"><a href=\"javascript:;\">分组</a></li>");
	this.move2BlacklistBtn = $("<li class=\"index_moreLi\"><a href=\"javascript:;\">加入黑名单</a></li>");
	//解除黑名单
	this.moveOutBlacklistBtn = $("<li class=\"index_moreLi\"><a href=\"javascript:;\">解除黑名单</a></li>");
	//是否是当前用户自己
	this.isSelf = (this.parent.parent.talk.logonUser.uid==chaterData.uid);
	
	this.build();
};

/**
 * 创建DOM树
 * @return
 */
Chater.prototype.build = function(){
	this.parent.chaterContainer.prepend(this.container);
	this.container.append(this.avatar);
	this.container.append(this.name);
	this.container.append(this.setting);
	
	this.container.append(this.settingContainer);
	this.settingContainer.append(this.settingSign);
	
	//不是黑名单
	if(this.parent.id!="blackListGroup"){
		this.settingContainer.append(this.setGroupBtn);
		this.settingContainer.append(this.move2BlacklistBtn);
	}else{
		//是黑名单的话，给移出按钮
		this.settingContainer.append(this.moveOutBlacklistBtn);
	}
	
	//标记是否在线
	if(this.isSelf||this.chaterData.online){
		this.container.removeClass("noline");
	}
	
	this.addListener();
};

/**
 * 绑定事件
 * @return
 */
Chater.prototype.addListener = function(){
	var chater = this;
	
	if(!this.isSelf){
		//显示设置菜单
		this.setting.bind("click",function(event){
			chater.settingContainer.show();
			event.stopPropagation();
		});
		
		//不是黑名单
		if(this.parent.id!="blackListGroup"){
			//显示分组选择菜单
			this.setGroupBtn.bind("mouseover",function(event){
				chater.parent.parent.showChangeGroupMenu(chater.id,chater.parent.id,$(this).offset().top);
				$(this).addClass("index_moreLi_childOpen");
			}).bind("mouseout",function(event){
				$(this).removeClass("index_moreLi_childOpen");
			}).bind("click",function(event){
				event.stopPropagation();
			});
			
			//加入黑名单
			this.move2BlacklistBtn.bind("click",function(event){
				var requestMsg = chater.parent.parent.talk.request.dragIntoBlacklist(chater.id,chater.parent.id);
				chater.parent.parent.talk.sendRequest(requestMsg);
			});
		}else{
			//移出黑名单
			this.moveOutBlacklistBtn.bind("click",function(event){
				var requestMsg = chater.parent.parent.talk.request.moveOutBlacklist(chater.id);
				chater.parent.parent.talk.sendRequest(requestMsg);
			});
		}
		
		//关闭
		$("body").bind("click",function(event){
			chater.settingContainer.hide();
		});
		
		//打开对话窗口
		this.name.bind("click",function(event){
			chater.parent.parent.talk.openDialog({uid:chater.chaterData.uid,name:chater.chaterData.nickname,avatar:chater.chaterData.avatar},"PrivateChat");
		});
		
		this.avatar.bind("click",function(event){
			chater.parent.parent.talk.openDialog({uid:chater.chaterData.uid,name:chater.chaterData.nickname,avatar:chater.chaterData.avatar},"PrivateChat");
		});
	}
};

/**
 * 离线
 * @return
 */
Chater.prototype.leave = function(){
	this.container.addClass("noline");
	this.parent.chaterContainer.append(this.container);
	this.parent.setOnlineNum(this.parent.getOnlineNum()-1);
};

/**
 * 上线
 * @return
 */
Chater.prototype.online = function(){
	this.container.removeClass("noline");
	this.parent.chaterContainer.prepend(this.container);
	this.parent.setOnlineNum(this.parent.getOnlineNum()+1);
};

/**
 * 销毁本用户
 * @return
 */
Chater.prototype.destroy = function(){
	this.container.empty();
	this.container.remove();
};

/**
 * 消息阅读面板
 * @return
 */
function MsgReadPlane(talk){
	this.talk = talk;
	//主面板
	this.plane = $("#msgReadPlane");
	//底部
	this.footer = new MsgReadPlaneFooter(this);
};

/**
 * 消息阅读面板底部对象
 * @param msgReadPlane 消息阅读面板
 * @return
 */
function MsgReadPlaneFooter(msgReadPlane){
	this.msgReadPlane = msgReadPlane;
	this.container = $("#msgReadPlaneFooter");
	this.tabContainer = $("#msgDialogTabs");
	this.tabs = [];
};

/**
 * 创建一个Tab
 * @param uid tab对应的ID
 * @param name TAB name
 * @return
 */
MsgReadPlaneFooter.prototype.createDialogTab = function(uid,name){
	var tab = new MsgDialogTab(uid,name,this);
	//放入
	this.tabs.push(tab);
};

/**
 * 移除一个Tab
 * @param id
 * @return
 */
MsgReadPlaneFooter.prototype.removeDialogTab = function(id){
	for(var i = this.tabs.length-1; i>-1; i--){
		if(this.tabs[i].id==id){
			this.tabs[i].remove();
			//缩短数组
			this.tabs.splice(i,1);
		}
	}
};

/**
 * 获取指定tab
 * @param id
 * @return
 */
MsgReadPlaneFooter.prototype.getDialogTab = function(id){
	for(var i = 0;i<this.tabs.length;i++){
		if(this.tabs[i].id==id){
			return this.tabs[i];
		}
	}
	return null;
};

/**
 * 聊天窗体TAB对象
 * @param chatMsgData
 * @return
 */
function MsgDialogTab(uid,name,footer){
	this.id = uid;
	this.footer = footer;
	this.container = $("<li class=\"talkTab_li talkTab_liNow\"></li>");
	this.tab = $("<a href=\"javascript:;\" class=\"talkTabName\">"+name+"</a>");
	
	this.build();
};

/**
 * 初始化
 * @return
 */
MsgDialogTab.prototype.build = function(){
	this.footer.tabContainer.append(this.container);
	this.container.append(this.tab);
	
	this.addListener();
	
	//获取焦点
	this.focus();
};

/**
 * 相关事件
 * @return
 */
MsgDialogTab.prototype.addListener = function(){
	var tab = this;
	
	//显示对应dialog
	this.tab.bind("click",function(){
		var dialog = tab.footer.msgReadPlane.talk.getDialog(tab.id);
		dialog.focus();
		tab.focus();
	});
};

/**
 * 移除本对象
 * @return
 */
MsgDialogTab.prototype.remove = function(){
	this.container.remove();
};

/**
 * TAB闪烁
 * @return
 */
MsgDialogTab.prototype.blink = function(){
	this.container.addClass("talkTab_liAction");
};

/**
 * 取消闪烁
 * @return
 */
MsgDialogTab.prototype.cancelBlink = function(){
	this.container.removeClass("talkTab_liAction");
};

/**
 * 移除焦点
 * @return
 */
MsgDialogTab.prototype.blur = function(){
	this.container.removeClass("talkTab_liNow");
}

/**
 * 获取焦点
 * @return
 */
MsgDialogTab.prototype.focus = function(){
	for(var i = 0;i<this.footer.tabs.length;i++){
		this.footer.tabs[i].blur();
	}
	this.container.addClass("talkTab_liNow");
	this.cancelBlink();
};

/**
 * 聊天对话框
 * @param talk
 * @param owner
 * @param type
 * @return
 */
function ChatDialog(talk,owner){
	this.talk = talk;
	//类型
	this.type= "PrivateChat";
	//唯一标识
	this.id = owner.uid;
	//窗口所有者信息
	this.owner = owner;
	//最外部容器
	this.container = $("<div class=\"talkBox\"></div>");
	//消息框头部
	this.header = $("<div class=\"baseBox_talkTop\"></div>");
	//返回按钮
	this.backBtn = $("<a href=\"javascript:;\" class=\"talkTop_return\"><b class=\"gstIco20 gstIco20_return\"></b>返回</a>");
	//发送者信息容器
	this.senderContainer = $("<div class=\"talkTopCenter\"></div>");
	//发送者头像
	this.senderAvatar = $("<a href=\"javascript:;\" class=\"talkTop_photo\"><img src=\""+baseUrl+owner.avatar+"\" /></a>");
	//发送者名称
	this.senderName = $("<a href=\"javascript:;\" class=\"talkTop_userName\">"+owner.name+"</a>");
	
	//关闭按钮
	this.closeBtn = $("<a href=\"javascript:;\" class=\"talkTop_del\" title=\"关闭当前聊天窗口\"><b class=\"gstIco20 gstIco20_del\"></b></a>");
	//消息容器
	this.msgContainer = $("<ul class=\"talkList\"></ul>");
	//发送消息容器
	this.sendContainer = $("<div class=\"talkFormBox\"></div>");
	
	//工具外部容器
	this.toolsOutsideContainer = $("<div class=\"talkForm_moreBox\"></div>");
	//更多工具的按钮
	this.moreToolsBtn = $("<a href=\"javascript:;\" class=\"talkForm_moreBut\" title=\"更多\"></a>");
	//发送图片容器
	this.imgsContainer = $("<ul class=\"upImage_list\" style=\"display:none\"></ul>");
	//工具容器
	this.toolsContainer = $("<ul class=\"talkForm_more\"></ul>");
	//上传图片
	this.uploadImgTool = $("<li><a class=\"gstIco16 gstIco16_image\" href=\"javascript:;\" title=\"上传图片，可以直接拖放\"><input title=\"添加图片，可以直接拖放\" class=\"talkForm_moreFile\" type=\"file\" /></a></li>");
	//传文件
	this.uploadFileTool = $("<li><a class=\"gstIco16 gstIco16_upload\" href=\"javascript:;\" title=\"上传文件\"><div class=\"talkForm_moreFile\"><input id=\""+this.id+"_uploadify\" name=\"uploads\" title=\"上传文件\" class=\"talkForm_moreFile\" type=\"file\" /></div></a></li>");
	
	//文件上传进度相关
	this.uploadProccessBox = $("<div class=\"uploadBox\" style=\"display:none\"></div>");
	this.uploadProccessBg = $("<b class=\"uploadBox_bg\"></b>");
	this.uploadProccessContainer = $("<p id=\""+this.id+"_uploadContainer\" class=\"uploadBox_flash\"></p>");
	this.uploadProccessBtn = $("<a href=\"javascript:;\" title=\"显示/隐藏\" class=\"uploadBox_butOC gstIco16 gstIco16_remove\"></a>");
	this.uploadProccessTxt = $("<p class=\"uploadBox_txt\">上传中...</p>")
	
	//输入表单
	this.inputForm = $("<div class=\"talkForm_main\"></div>");
	//表情工具
	this.smileTool = $("<a href=\"javascript:;\" class=\"talkform_expr\"></a>");
	//消息输入框
	this.input = $("<textarea class=\"talkform_txt\" validateType=\"lengthRange-1-2000\"></textarea>");
	//提交按钮
	this.submitBtn = $("<input class=\"talkform_button\" type=\"button\" value=\"发送\" submit=\"true\" />");
	
	//打开聊天记录的按钮
	this.openRecordPlaneBtn = $("<a href=\"javascript:;\" title=\"聊天记录\" class=\"gstIco16 gstIco16_talk\"></a>");
	//组建讨论组
	this.buildDiscussionGroupBtn = $("<a href=\"javascript:;\" title=\"邀请多人会话\" class=\"gstIco16 gstIco16_addPeople\"></a>");
	
	//消息记录面板
	this.recordsPlane = $("<div class=\"gstLayer\" style=\"display:none\"></div>");
	//消息记录面板关闭按钮
	this.recordsPlaneCloseBtn = $("<a href=\"javaascript:;\" class=\"gstLayer_close\"></a>");
	//消息记录容器
	this.recordsContainer = $("<ul class=\"talkList\"></ul>");
	//消息记录标题
	this.recordsTitle = $("<li class=\"talkLi2\"><span href=\"javaascript:;\" class=\"oldTalkBut\">"+new Date().format("yyyy-MM-dd")+"</span></li>");
	//消息记录工具容器
	this.recordsToolsContainer = $("<div class=\"oldTalkList_tool\"></div>");
	//选择消息记录的时间
	this.recordsDateInput = $("<input class=\"gsttText1\" type=\"text\" value=\""+new Date().format("yyyy-MM-dd")+"\" />");
	//消息记录工具
	this.msgRecordTool = null;
	
	//是否允许自动滚动
	this.autoScroll = true;
	
	this.build();
};

/**
 * 初始化对话窗口
 * @return
 */
ChatDialog.prototype.build = function(){
	var dialog = this;
	
	this.talk.msgReadPlane.plane.prepend(this.container);
	
	this.container.append(this.header);
	this.header.append(this.backBtn);
	this.header.append(this.senderContainer);
	
	this.senderContainer.append(this.senderAvatar);
	this.senderContainer.append(this.senderName);
	this.senderContainer.append(this.buildDiscussionGroupBtn);
	this.senderContainer.append(" ");
	
	this.header.append(this.closeBtn);
	
	this.container.append(this.msgContainer);
	this.container.append(this.sendContainer);
	
	this.sendContainer.append(this.toolsOutsideContainer);
	this.toolsOutsideContainer.append(this.moreToolsBtn);
	this.toolsOutsideContainer.append(this.imgsContainer);
	this.toolsOutsideContainer.append(this.toolsContainer);
	this.toolsContainer.append(this.uploadImgTool);
	this.toolsContainer.append(this.uploadFileTool);
	
	this.toolsOutsideContainer.append(this.uploadProccessBox);
	this.uploadProccessBox.append(this.uploadProccessBg);
	this.uploadProccessBox.append(this.uploadProccessContainer);
	this.uploadProccessBox.append(this.uploadProccessBtn);
	this.uploadProccessBox.append(this.uploadProccessTxt);
	
	//绑定上传进度显示事件
	this.uploadProccessBtn.bind("click",function(event){
		$(this).toggleClass("gstIco16_add");
		$(this).toggleClass("gstIco16_remove");
		dialog.uploadProccessBox.toggleClass("uploadBoxHide");
	});
	
	this.sendContainer.append(this.inputForm);
	this.inputForm.append(this.smileTool);
	this.inputForm.append(this.input);
	this.inputForm.append(this.submitBtn);
	
	//绑定事件创建讨论组
	this.buildDiscussionGroupBtn.bind("click",function(event){
		dialog.talk.discussionGroupMemberChooser.show();
	});
	//绑定相关事件
	this.bindCommonEvent();
	this.bindSendMsgEvent();
	this.buildRecordsSystem();
	
	//获取焦点
	this.focus();
};

/**
 * 创建消息记录系统
 * @return
 */
ChatDialog.prototype.buildRecordsSystem = function(){
	if(MsgRecordTool.useable){
		var dialog = this;
		this.msgRecordTool = new MsgRecordTool();
		
		this.senderContainer.append(this.openRecordPlaneBtn);
		this.container.prepend(this.recordsPlane);
		this.recordsPlane.append(this.recordsPlaneCloseBtn);
		this.recordsPlane.append(this.recordsContainer);
		this.recordsContainer.append(this.recordsTitle);
		this.recordsPlane.append(this.recordsToolsContainer);
		this.recordsToolsContainer.append(this.recordsDateInput);
		
		DateCreator.createDatePicker(this.recordsDateInput,"yyyy-MM-dd");
		
		//打开消息记录面板
		this.openRecordPlaneBtn.bind("click",function(event){
			dialog.talk.bgLayer.show();
			dialog.recordsPlane.show();
			dialog.requestDayRecords();
		});
		
		//关闭消息记录面板
		this.recordsPlaneCloseBtn.bind("click",function(event){
			dialog.talk.bgLayer.hide();
			dialog.recordsPlane.hide();
		});
		
		//绑定日期选择事件
		this.recordsDateInput.bind("onpicked",function(event){
			dialog.requestDayRecords();
		});
	}
};

/**
 * 添加一条历史聊天记录
 * @param recordObj
 * @return
 */
ChatDialog.prototype.appendRecord = function(recordObj){
	this.recordsContainer.append("<li class=\"talkLi\">" +
			"<p class=\"talkP\"><span class=\"talk_heName\">"+recordObj.senderName+" "+recordObj.time+"</span></p>" +
			"<p class=\"talkTxt\">"+recordObj.message+"</p></li>");
	
	this.recordsPlane.get(0).scrollTop = this.recordsPlane.get(0).scrollHeight;
};

/**
 * 请求某日的消息记录
 * @return
 */
ChatDialog.prototype.requestDayRecords = function(){
	var dateValue = this.recordsDateInput.val();
	this.recordsContainer.empty();
	//请求消息记录
	this.msgRecordTool.getRecords(this.id,dateValue,this);
	this.recordsTitle.find("span").html(dateValue);
};

/**
 * 追加某日的消息记录
 * @param date
 * @return
 */
ChatDialog.prototype.appendDayRecords = function(records){
	for(var i=0;i<records.length;i++){
		this.appendRecord(records[i]);
	}
};

/**
 * 绑定公用事件
 * @return
 */
ChatDialog.prototype.bindCommonEvent = function(){
	var chatDialog = this;
	
	//用户有意查看某消息时取消自动滚动
	this.msgContainer.bind("mousedown",function(event){
		chatDialog.autoScroll = false;
	}).bind("mouseup",function(event){
		chatDialog.autoScroll = true;
	}).bind("mouseout",function(event){
		chatDialog.autoScroll = true;
	});
	
	//关闭本对话框
	this.closeBtn.bind("click",function(event){
		chatDialog.close();
	});
	
	//隐藏消息框
	this.backBtn.bind("click",function(event){
		chatDialog.talk.hideMsgReadPlane();
	});
	
	//绑定快捷键提交事件
	this.container.bind("keydown",function(event){
		if(event.ctrlKey && event.keyCode=='13'){
			if(!chatDialog.submitBtn.attr("disabled")){
				chatDialog.submitBtn.click();
			}
		}
	});
	
	try{
		//阻止其他拖动默认事件
		this.container.get(0).addEventListener("dragenter", function(event){
			event.stopPropagation();  
			event.preventDefault();  
		}, false);
		
		this.container.get(0).addEventListener("dragover", function(event){
			event.stopPropagation();  
			event.preventDefault();  
		}, false);
		
		this.container.get(0).addEventListener("drop", function(event){
			event.stopPropagation();  
			event.preventDefault();
			alert("请将图片拖放到输入框内！");
		}, false);
		
		this.input.get(0).addEventListener("dragenter", function(event){
			event.stopPropagation();  
			event.preventDefault();  
		}, false);
		
		this.input.get(0).addEventListener("dragover", function(event){
			event.stopPropagation();  
			event.preventDefault();  
		}, false);
		
		this.input.get(0).addEventListener("drop", function(event){
			event.stopPropagation();  
			event.preventDefault();
			chatDialog.readyTransferImg(event.dataTransfer.files);
		}, false);
		
		//绑定选择图片
		this.uploadImgTool.find("input").get(0).addEventListener("change", function(event){
			chatDialog.readyTransferImg(this.files)
		}, false);
		
		//图片上传面板显示
		this.moreToolsBtn.bind("click",function(event){
			chatDialog.imgsContainer.toggle();
			chatDialog.moreToolsBtn.toggleClass("talkForm_moreButOpen");
		});
	}catch(e){
		
	}
	
	//绑定打开表情面板事件
	this.smileTool.bind("click",function(event){
		chatDialog.talk.relationPlane.openSmilePlane(chatDialog.input);
	});
	
	if(this.type=="PrivateChat"){
		this.uploadFileTool.find("input").uploadify({
		    "uploader"       : baseUrl+"wd/components/upload/uploadify.swf",
		    "script"         : baseUrl+"chat/transferFile.htm",
		    "scriptData"     : {senderId:chatDialog.talk.logonUser.uid,receiverId:chatDialog.id},
		    "cancelImg"      : baseUrl+"wd/components/upload/style/cancel.png",
		    "fileDataName"   : "uploads",
		    "queueID"        : chatDialog.id+"_uploadContainer",
		    "auto"           : true,
		    "multi"          : false,
		    "simUploadLimit" : 1,
		    "queueSizeLimit" : 1,
		    "sizeLimit"      : 300*1024*1024,
		    "buttonText"     : "",
		    "width"          : 16,
		    "height"         : 16,
		    'fileDesc'       : "压缩文件",
			'fileExt'        : "*.tar;*.TAR;*.gz;*.GZ;*.zip;*.ZIP;*.rar;*.RAR;*.7z;*.7Z",
		    "onSelectOnce"   : function(){
		    	chatDialog.uploadProccessBox.show();
			},
		    'onComplete': function(event,queueID,fileObj,response,data) {
			    if(response=="error"){
			        alert("文件发送失败，请重试！")
			        }else{
			        	if(data.fileCount<=0){
				        	alert("文件发送完毕！");
				        	}
			            }
			    chatDialog.uploadProccessBox.hide();
			    },
		    'onError':function(event,queueID,fileObj,errorObj){
				alert(errorObj.info);
			}
		});
	}
};

/**
 * 准备传送图片
 * @param files
 * @return
 */
ChatDialog.prototype.readyTransferImg = function(files){
	var chatDialog = this;
	for( var i = 0 ; i < files.length ; i++ ){
		if(files[i].type.indexOf("image")!=-1&&files[i].size<1000000){
			var reader = new FileReader();
			 reader.onload = function(e){
				 chatDialog.imgsContainer.show();
				 var imgObj = $("<li class=\"upImage_li\"><span class=\"imgBox_45\"><img src=\""+e.target.result+"\" /></span><b class=\"gstIco16 gstIco16_delBlack\"></b></li>");
				 chatDialog.imgsContainer.append(imgObj);
				 imgObj.find(".gstIco16_delBlack").bind("click",function(event){
					 imgObj.remove();
				 });
			 };
	         reader.readAsDataURL(files[i]);
		}else{
			alert("必须为图片类型，且大小必须小于1MB！");
		}
	}
};

/**
 * 绑定发送消息事件
 * @return
 */
ChatDialog.prototype.bindSendMsgEvent = function(){
	var chatDialog = this;
	//绑定消息发送事件
	this.submitBtn.bind("click",function(event){
		var senderId = chatDialog.talk.logonUser.uid;
		var senderName = chatDialog.talk.logonUser.name;
		var msg = chatDialog.input.val();
		
		if(chatDialog.imgsContainer.html()!=""){
			chatDialog.imgsContainer.find("img").each(function(i,imgObj){
				msg = msg+"<img src=\""+$(imgObj).attr("src")+"\"/>";
			});
		}else{
			if(!checkChatInput(msg)){
				alert("消息内容的长度必须在1到2000之间");
				return false;
			}
		}
		
		var requestMsg = chatDialog.talk.request.chatMsg(senderId,senderName,msg,chatDialog.id,chatDialog.type);
		var result = chatDialog.talk.sendRequest(requestMsg);
		//发送成功后为下一次发送做准备
		if(result){
			chatDialog.uploadImgTool.find("input").val("");
			chatDialog.input.val("");
			chatDialog.imgsContainer.html("");
			chatDialog.imgsContainer.hide();
			chatDialog.moreToolsBtn.removeClass("talkForm_moreButOpen");
			chatDialog.input.focus();
		}
	});
};

/**
 * 添加一条消息
 * @param msgData
 * @return
 */
ChatDialog.prototype.addMsg = function(msgData){
	this.msgContainer.append("<li class=\"talkLi\">" +
							"<p class=\"talkP\"><span class=\"talk_heName\">"+msgData.senderName+" "+msgData.time+"</span></p>" +
							"<p class=\"talkTxt\">"+msgData.message+"</p></li>");
	
	if(this.msgRecordTool!=null){
		this.msgRecordTool.addMsgRecord(this.id, msgData);
	}
	
	//允许自动滚动的情况下才滚动
	if(this.autoScroll){
		this.msgContainer.get(0).scrollTop = this.msgContainer.get(0).scrollHeight;
	}
};

/**
 * 对话窗口获取焦点
 */
ChatDialog.prototype.focus = function(){
	this.container.show();
	this.talk.consumeUnReadMsg(this.id, this);
	for(var i = 0;i<this.talk.msgDialogs.length;i++){
		//使其他窗口失去焦点
		if(this.talk.msgDialogs[i].id!=this.id){
			this.talk.msgDialogs[i].blur();
		}
	}
	
	//定位滚动条
	this.msgContainer.get(0).scrollTop = this.msgContainer.get(0).scrollHeight;
};

/**
 * 失去焦点
 * @return
 */
ChatDialog.prototype.blur = function(){
	this.container.hide();
};

/**
 * 关闭本dialog
 * @return
 */
ChatDialog.prototype.close = function(){
	//从talk维持的打开的dialog队列中移除本对话框
	for(var i = this.talk.msgDialogs.length-1;i>-1;i--){
		if(this.id==this.talk.msgDialogs[i].id){
			this.talk.msgDialogs.splice(i,1);
		}
	}
	//dom树中移除
	this.container.remove();
	//移除tab页
	this.talk.msgReadPlane.footer.removeDialogTab(this.id);
	
	//如果当前对话框为最后一个对话框，则关闭消息阅读面板，否则让下一个对话框获取焦点
	if(this.talk.msgReadPlane.footer.tabs.length<=0){
		this.talk.hideMsgReadPlane();
	}else{
		for(var i = 0;i<this.talk.msgReadPlane.footer.tabs.length;i++){
			if(this.talk.msgReadPlane.footer.tabs[i]!=null&&this.talk.msgReadPlane.footer.tabs[i]!=undefined){
				this.talk.msgReadPlane.footer.tabs[i].focus();
				this.talk.getDialog(this.talk.msgReadPlane.footer.tabs[i].id).focus();
				break;
			}
		}
	}
};

/**
 * 群组聊天对话框
 * 
 * @param talk
 * @param chatGroupInfo [uid,name,avatar,currentUserIdentity]
 * 
 */
function ChatGroupDialog(talk,chatGroupInfo){
	this.talk = talk;
	//类型
	this.type= "GroupChat";
	//唯一标识
	this.id = chatGroupInfo.uid;
	this.chatGroupInfo = chatGroupInfo;
	//最外部容器
	this.container = $("<div class=\"talkBox\"></div>");
	//消息框头部
	this.header = $("<div class=\"baseBox_talkTop\"></div>");
	//返回按钮
	this.backBtn = $("<a href=\"javascript:;\" class=\"talkTop_return\"><b class=\"gstIco20 gstIco20_return\"></b>返回</a>");
	//发送者信息容器
	this.senderContainer = $("<div class=\"talkTopCenter\"></div>");
	//发送者头像
	this.senderAvatar = $("<a href=\"javascript:;\" class=\"talkTop_photo\"><img src=\""+baseUrl+chatGroupInfo.avatar+"\" /></a>");
	//发送者名称
	this.senderName = $("<a href=\"javascript:;\" class=\"talkTop_userName\">"+chatGroupInfo.name+"</a>");
	
	//群成员状态按钮
	this.memberStatusBtn = $("<a href=\"javascript:;\" class=\"gstIco16 gstIco16_usersGray\"></a>");
	//群成员数目容器
	this.memberNumContainer = $("<span class=\"talkTopCenter_text\"></span>");
	//在线成员数目
	this.memberOnlineNum = $("<span class=\"ttcPeoOnlineNub\"></span>");
	//成员总数
	this.memberNum = $("<span class=\"ttcPeoAllNub\"></span>");
	//群设置按钮
	this.groupSettingBtn = $("<a href=\""+baseUrl+"chatGroup/show/"+this.id+".htm\" target=\"_blank\" class=\"gstIco16 gstIco16_controlGray\"></a>");
	
	//群成员外部容器
	this.memberOuterContainer = $("<div class=\"gstLayer\" style=\"display:none\"></div>");
	//群成员面板关闭按钮
	this.memberPlaneCloseBtn = $("<a href=\"javascript:;\" class=\"gstLayer_close\"></a>");
	//群成员内部容器
	this.memberInsideContainer = $("<div class=\"groupPeopleList_div\" style=\"height:300px;\"></div>");
	//群成员容器
	this.memberContainer = $("<ul class=\"groupPeopleList\"></ul>");
	
	//关闭按钮
	this.closeBtn = $("<a href=\"javascript:;\" class=\"talkTop_del\" title=\"关闭当前聊天窗口\"><b class=\"gstIco20 gstIco20_del\"></b></a>");
	//消息容器
	this.msgContainer = $("<ul class=\"talkList\"></ul>");
	//发送消息容器
	this.sendContainer = $("<div class=\"talkFormBox\"></div>");
	
	//工具外部容器
	this.toolsOutsideContainer = $("<div class=\"talkForm_moreBox\"></div>");
	//更多工具的按钮
	this.moreToolsBtn = $("<a href=\"javascript:;\" class=\"talkForm_moreBut\" title=\"更多\"></a>");
	//发送图片容器
	this.imgsContainer = $("<ul class=\"upImage_list\" style=\"display:none\"></ul>");
	//工具容器
	this.toolsContainer = $("<ul class=\"talkForm_more\"></ul>");
	//上传图片
	this.uploadImgTool = $("<li><a class=\"gstIco16 gstIco16_image\" href=\"javascript:;\" title=\"上传图片，可以直接拖放\"><input title=\"添加图片，可以直接拖放\" class=\"talkForm_moreFile\" type=\"file\" /></a></li>");
	//传文件
	this.uploadFileTool = $("<li><a class=\"gstIco16 gstIco16_upload\" href=\"javascript:;\" title=\"上传文件\"><input title=\"上传文件\" class=\"talkForm_moreFile\" type=\"file\" /></a></li>");
	
	//输入表单
	this.inputForm = $("<div class=\"talkForm_main\"></div>");
	//表情工具
	this.smileTool = $("<a href=\"javascript:;\" class=\"talkform_expr\"></a>");
	//消息输入框
	this.input = $("<textarea class=\"talkform_txt\" validateType=\"lengthRange-1-2000\"></textarea>");
	//提交按钮
	this.submitBtn = $("<input class=\"talkform_button\" type=\"button\" value=\"发送\" submit=\"true\" />");
	//是否允许自动滚动
	this.autoScroll = true;
	//所有群成员对象[ChatGroupMember]
	this.members = [];
	
	//打开聊天记录的按钮
	this.openRecordPlaneBtn = $("<a href=\"javascript:;\" title=\"聊天记录\" class=\"gstIco16 gstIco16_talk\"></a>");
	//消息记录面板
	this.recordsPlane = $("<div class=\"gstLayer\" style=\"display:none\"></div>");
	//消息记录面板关闭按钮
	this.recordsPlaneCloseBtn = $("<a href=\"javaascript:;\" class=\"gstLayer_close\"></a>");
	//消息记录容器
	this.recordsContainer = $("<ul class=\"talkList\"></ul>");
	//消息记录标题
	this.recordsTitle = $("<li class=\"talkLi2\"><span href=\"javaascript:;\" class=\"oldTalkBut\">"+new Date().format("yyyy-MM-dd")+"</span></li>");
	//消息记录工具容器
	this.recordsToolsContainer = $("<div class=\"oldTalkList_tool\"></div>");
	//选择消息记录的时间
	this.recordsDateInput = $("<input class=\"gsttText1\" type=\"text\" value=\""+new Date().format("yyyy-MM-dd")+"\" />");
	//消息记录工具
	this.msgRecordTool = null;
	
	this.build();
};

//继承自ChatDialog
ChatGroupDialog.inherit(ChatDialog);

/**
 * 创建群对话窗口
 * @return
 */
ChatGroupDialog.prototype.build = function(){
	
	this.talk.msgReadPlane.plane.prepend(this.container);
	
	//组建群成员容器
	this.container.append(this.memberOuterContainer);
	this.memberOuterContainer.append(this.memberPlaneCloseBtn);
	this.memberOuterContainer.append(this.memberInsideContainer);
	this.memberInsideContainer.append(this.memberContainer);
	
	this.container.append(this.header);
	this.header.append(this.backBtn);
	this.header.append(this.senderContainer);
	
	this.senderContainer.append(this.senderAvatar);
	this.senderContainer.append(this.senderName);
	
	//群窗口的特殊设置
	this.senderContainer.addClass("talkTopCenter_border");
	this.senderContainer.append(this.memberStatusBtn);
	this.senderContainer.append(this.memberNumContainer);
	this.memberNumContainer.append(this.memberOnlineNum);
	this.memberNumContainer.append("/");
	this.memberNumContainer.append(this.memberNum);
	this.senderContainer.append(this.groupSettingBtn);
	
	this.header.append(this.closeBtn);
	
	this.container.append(this.msgContainer);
	this.container.append(this.sendContainer);
	
	this.sendContainer.append(this.toolsOutsideContainer);
	this.toolsOutsideContainer.append(this.moreToolsBtn);
	this.toolsOutsideContainer.append(this.imgsContainer);
	this.toolsOutsideContainer.append(this.toolsContainer);
	this.toolsContainer.append(this.uploadImgTool);
	//this.toolsContainer.append(this.uploadFileTool);
	
	this.sendContainer.append(this.inputForm);
	this.inputForm.append(this.smileTool);
	this.inputForm.append(this.input);
	this.inputForm.append(this.submitBtn);
	
	//添加所有群成员
	for(var i = 0;i<this.chatGroupInfo.members.length;i++){
		this.addMember(this.chatGroupInfo.members[i]);
	}
	
	//绑定相关事件
	this.bindCommonEvent();
	this.bindSendMsgEvent();
	this.addListener();
	this.buildRecordsSystem();
	
	//获取焦点
	this.focus();
};

/**
 * 添加监听器
 * @return
 */
ChatGroupDialog.prototype.addListener = function(){
	var chatGroupDialog = this;
	
	//绑定打开群成员面板事件
	this.memberStatusBtn.bind("click",function(event){
		chatGroupDialog.talk.bgLayer.toggle();
		chatGroupDialog.memberOuterContainer.toggle();
	});
	
	//绑定关闭按钮
	this.memberPlaneCloseBtn.bind("click",function(event){
		chatGroupDialog.talk.bgLayer.toggle();
		chatGroupDialog.memberOuterContainer.toggle();
	});
};

/**
 * 获取指定成员
 * @param uid
 * @return
 */
ChatGroupDialog.prototype.getMember = function(uid){
	for(var i=0;i<this.members.length;i++){
		if(this.members[i].id==uid){
			return this.members[i];
		}
	}
	
	return null;
};

/**
 * 移除一个成员
 * @param uid
 * @return
 */
ChatGroupDialog.prototype.removeMember = function(uid){
	for(var i = this.members.length-1; i>-1; i--){
		if(this.members[i].id==uid){
			this.members[i].remove();
			//缩短数组
			this.members.splice(i,1);
		}
	}
};

/**
 * 移除管理员权限
 * @param uid
 * @return
 */
ChatGroupDialog.prototype.removeManagerIdentity = function(uid){
	var member = this.getMember(uid);
	if(member!=null){
		member.removeManagerIdentity();
	}
};

/**
 * 添加管理员权限
 * @param uid
 * @return
 */
ChatGroupDialog.prototype.addManagerIdentity = function(uid){
	var member = this.getMember(uid);
	if(member!=null){
		member.addManagerIdentity();
	}
	
	for(var i = 0;i<this.members.length;i++){
		//如果是用户身份，就允许被管理
		if(this.members[i].memberData.identity==3){
			this.members[i].addManagerPermission();
		}
	}
};

/**
 * 添加一个成员
 * @param memberData
 * @return
 */
ChatGroupDialog.prototype.addMember = function(memberData){
	var member = new ChatGroupMember(memberData,this);
	this.members.push(member);
};

/**
 * 群成员
 * @param memberData[uid,name,avatar,online,identity]
 * @param dialog
 * @return
 */
function ChatGroupMember(memberData,dialog){
	this.id = memberData.uid;
	this.memberData = memberData;
	this.parent = dialog;
	this.container = $("<li class=\"groupPeopleLi noline\"></li>");
	this.avatar = $("<a href=\""+baseUrl+"chater/show/"+this.id+".htm\" target=\"_blank\" class=\"groupPeopleLi_photo\"><img src=\""+baseUrl+memberData.avatar+"\" /></a>");
	this.infoContiner = $("<p class=\"groupPeopleLi_p\"></p>");
	this.name = $("<a href=\"javascript:;\" class=\"groupPeopleLi_name\">"+memberData.name+"</a>");
	this.identitySign = $("<b title=\"\" class=\"gstIco12\"></b>");
	this.identity = $("<span class=\"gray\"></span>");
	//邀请成为管理员
	this.invite2ManageBtn = $("<a href=\"javascript:;\" class=\"aBlue\">升级</a>");
	//取消管理身份
	this.cancelManageBtn = $("<a href=\"javascript:;\" class=\"aBlue\">降级</a>");
	//封禁成员
	this.gagBtn = $("<a href=\"javascript:;\" class=\"aBlue\">封禁</a>");
	//T掉一个成员
	this.removeBtn = $("<a href=\"javascript:;\" class=\"aBlue\">踢除</a>");
	
	//封禁用户外部容器
	this.gagContainer = $("<div class=\"gstLayer_min\"><b class=\"gstLayer_minBg\"></b></div>");
	this.gagFormContainer = $("<ul class=\"gstLayer_minForm\"></ul>");
	this.gagDays = $("<li class=\"gstLayer_minLi\"><label class=\"gstLayer_minLabel\">封禁天数：</label><input class=\"gstLayer_minTxt\" validateType=\"lengthRange-1-3|beDigits\" type=\"text\" /> 天</li>");
	this.gagWords = $("<li class=\"gstLayer_minLi\"><label class=\"gstLayer_minLabel\">理由：</label><textarea class=\"gstLayer_minTextarea\" validateType=\"lengthRange-5-200\"></textarea></li>");
	this.gagBtnContainer = $("<li class=\"gstLayer_minLi\"><input type=\"button\" class=\"gstLayer_minBut\" value=\"确认\" submit=\"true\" /></li>");
	//封禁用户面板关闭按钮
	this.gagPlaneCloseBtn = $("<a href=\"javascript:;\" class=\"gstLayer_close\"></a>");
	
	//邀请用户管理外部容器
	this.invite2ManageContainer = $("<div class=\"gstLayer_min\"><b class=\"gstLayer_minBg\"></b></div>");
	this.invite2ManageFormContainer = $("<ul class=\"gstLayer_minForm\"></ul>");
	this.invite2ManageWords = $("<li class=\"gstLayer_minLi\"><label class=\"gstLayer_minLabel\">理由：</label><textarea class=\"gstLayer_minTextarea\" validateType=\"lengthRange-5-200\"></textarea></li>");
	this.invite2ManageBtnContainer = $("<li class=\"gstLayer_minLi\"><input type=\"button\" class=\"gstLayer_minBut\" value=\"确认\" submit=\"true\" /></li>");
	//邀请用户管理面板关闭按钮
	this.invite2ManagePlaneCloseBtn = $("<a href=\"javascript:;\" class=\"gstLayer_close\"></a>");
	
	//移除管理权限外部容器
	this.kickoutManagerContainer = $("<div class=\"gstLayer_min\"><b class=\"gstLayer_minBg\"></b></div>");
	this.kickoutManagerFormContainer = $("<ul class=\"gstLayer_minForm\"></ul>");
	this.kickoutManagerWords = $("<li class=\"gstLayer_minLi\"><label class=\"gstLayer_minLabel\">理由：</label><textarea class=\"gstLayer_minTextarea\" validateType=\"lengthRange-5-200\"></textarea></li>");
	this.kickoutManagerBtnContainer = $("<li class=\"gstLayer_minLi\"><input type=\"button\" class=\"gstLayer_minBut\" value=\"确认\" submit=\"true\" /></li>");
	//移除管理面板关闭按钮
	this.kickoutManagerPlaneCloseBtn = $("<a href=\"javascript:;\" class=\"gstLayer_close\"></a>");
	
	//T除一个成员外部容器
	this.kickoutMemberContainer = $("<div class=\"gstLayer_min\"><b class=\"gstLayer_minBg\"></b></div>");
	this.kickoutMemberFormContainer = $("<ul class=\"gstLayer_minForm\"></ul>");
	this.kickoutMemberWords = $("<li class=\"gstLayer_minLi\"><label class=\"gstLayer_minLabel\">理由：</label><textarea class=\"gstLayer_minTextarea\" validateType=\"lengthRange-5-200\"></textarea></li>");
	this.kickoutMemberBtnContainer = $("<li class=\"gstLayer_minLi\"><input type=\"button\" class=\"gstLayer_minBut\" value=\"确认\" submit=\"true\" /></li>");
	//T除一个成员面板关闭按钮
	this.kickoutMemberPlaneCloseBtn = $("<a href=\"javascript:;\" class=\"gstLayer_close\"></a>");
	
	this.build();
};

/**
 * 创建一个群成员
 * @return
 */
ChatGroupMember.prototype.build = function(){
	
	var cgm = this;
	
	this.parent.memberContainer.prepend(this.container);
	this.container.append(this.avatar);
	this.container.append(this.infoContiner);
	this.infoContiner.append(this.name);
	this.infoContiner.append("<br/>");
	
	//创建者
	if(this.memberData.identity==1){
		this.infoContiner.append(this.identitySign);
		this.identitySign.addClass("gstIco12_starRed");
		this.infoContiner.append(this.identity);
		this.identity.html("创建者");
	}
	
	//管理员
	if(this.memberData.identity==2){
		this.addManagerIdentity();
	}
	
	//用户
	if(this.memberData.identity==3){
		//判断当前用户是否是管理员身份
		if(this.parent.chatGroupInfo.currentUserIdentity==1||this.parent.chatGroupInfo.currentUserIdentity==2){
			this.addManagerPermission();
		}
		
		//创始人可以邀请其他用户管理群
		if(this.parent.chatGroupInfo.currentUserIdentity==1){
			this.infoContiner.append(this.invite2ManageBtn);
			//绑定准备邀请成员管理群的事件
			this.invite2ManageBtn.bind("click",function(event){
				cgm.invite2ManageReady();
			});
		}
	}
	
	//标记是否在线
	if(this.memberData.online){
		this.container.removeClass("noline");
	}
};

/**
 * 移去管理员身份
 * @return
 */
ChatGroupMember.prototype.removeManagerIdentity = function(){
	this.memberData.identity = 3;
	this.identitySign.remove();
	this.identity.remove();
	this.cancelManageBtn.remove();
};

/**
 * 添加管理员身份
 * @return
 */
ChatGroupMember.prototype.addManagerIdentity = function(){
	var cgm = this;
	this.infoContiner.append(this.identitySign);
	this.identitySign.addClass("gstIco12_starOrange");
	this.infoContiner.append(this.identity);
	this.identity.html("管理员");
	//判断当前用户是否是创始人身份
	if(this.parent.chatGroupInfo.currentUserIdentity==1){
		this.infoContiner.append(this.cancelManageBtn);
		//绑定移除管理权限相关
		this.cancelManageBtn.bind("click",function(event){
			cgm.kickoutManagerReady();
		});
	}
};

/**
 * 允许当前用户管理本组员
 * @return
 */
ChatGroupMember.prototype.addManagerPermission = function(){
	var cgm = this;
	
	this.infoContiner.append(this.removeBtn);
	this.infoContiner.append(this.gagBtn);
	
	//绑定准备移除群人员事件
	this.removeBtn.bind("click",function(event){
		cgm.kickoutMemberReady();
	});
	//绑定准备封禁群成员事件
	this.gagBtn.bind("click",function(event){
		cgm.gagReady();
	});
};

/**
 * 封禁准备
 * @return
 */
ChatGroupMember.prototype.gagReady = function(){
	var cgm = this;
	
	this.container.prepend(this.gagContainer);
	this.gagContainer.append(this.gagFormContainer);
	this.gagFormContainer.append(this.gagDays);
	this.gagFormContainer.append(this.gagWords);
	this.gagFormContainer.append(this.gagBtnContainer);
	this.gagFormContainer.append(this.gagPlaneCloseBtn);
	
	//绑定封禁动作
	this.gagBtnContainer.find(".gstLayer_minBut").bind("click",function(event){
		var days = parseInt(cgm.gagDays.find("input").val());
		var words = cgm.gagWords.find("textarea").val();
		var requestMsg = cgm.parent.talk.request.gagChatGroupMember(cgm.parent.id,cgm.id,days,words);
		cgm.parent.talk.sendRequest(requestMsg);
		//关闭对话框
		cgm.gagPlaneCloseBtn.click();
	});
	
	//关闭对话框
	this.gagPlaneCloseBtn.bind("click",function(event){
		cgm.gagContainer.remove();
	});
};

/**
 * 邀请管理准备
 * @return
 */
ChatGroupMember.prototype.invite2ManageReady = function(){
	var cgm = this;
	
	this.container.prepend(this.invite2ManageContainer);
	this.invite2ManageContainer.append(this.invite2ManageFormContainer);
	this.invite2ManageFormContainer.append(this.invite2ManageWords);
	this.invite2ManageFormContainer.append(this.invite2ManageBtnContainer);
	this.invite2ManageFormContainer.append(this.invite2ManagePlaneCloseBtn);
	
	//绑定邀请管理动作
	this.invite2ManageBtnContainer.find(".gstLayer_minBut").bind("click",function(event){
		var words = cgm.invite2ManageWords.find("textarea").val();
		var requestMsg = cgm.parent.talk.request.invite2ManageChatGroup(cgm.id,cgm.parent.id,words);
		cgm.parent.talk.sendRequest(requestMsg);
		//关闭对话框
		cgm.invite2ManagePlaneCloseBtn.click();
	});
	
	//关闭对话框
	this.invite2ManagePlaneCloseBtn.bind("click",function(event){
		cgm.invite2ManageContainer.remove();
	});
};

/**
 * 移除管理员管理权限准备
 * @return
 */
ChatGroupMember.prototype.kickoutManagerReady = function(){
	var cgm = this;
	
	this.container.prepend(this.kickoutManagerContainer);
	this.kickoutManagerContainer.append(this.kickoutManagerFormContainer);
	this.kickoutManagerFormContainer.append(this.kickoutManagerWords);
	this.kickoutManagerFormContainer.append(this.kickoutManagerBtnContainer);
	this.kickoutManagerFormContainer.append(this.kickoutManagerPlaneCloseBtn);
	
	//绑定移除管理员管理权限动作
	this.kickoutManagerBtnContainer.find(".gstLayer_minBut").bind("click",function(event){
		var words = cgm.kickoutManagerWords.find("textarea").val();
		var requestMsg = cgm.parent.talk.request.kickoutChatGroupManger(cgm.parent.id,cgm.id,words);
		cgm.parent.talk.sendRequest(requestMsg);
		//关闭对话框
		cgm.kickoutManagerPlaneCloseBtn.click();
	});
	
	//关闭对话框
	this.kickoutManagerPlaneCloseBtn.bind("click",function(event){
		cgm.kickoutManagerContainer.remove();
	});
};

/**
 * 踢出用户准备准备
 * @return
 */
ChatGroupMember.prototype.kickoutMemberReady = function(){
	var cgm = this;
	
	this.container.prepend(this.kickoutMemberContainer);
	this.kickoutMemberContainer.append(this.kickoutMemberFormContainer);
	this.kickoutMemberFormContainer.append(this.kickoutMemberWords);
	this.kickoutMemberFormContainer.append(this.kickoutMemberBtnContainer);
	this.kickoutMemberFormContainer.append(this.kickoutMemberPlaneCloseBtn);
	
	//绑定踢出用户准备动作
	this.kickoutMemberBtnContainer.find(".gstLayer_minBut").bind("click",function(event){
		var words = cgm.kickoutMemberWords.find("textarea").val();
		var requestMsg = cgm.parent.talk.request.kickoutChatGroupMember(cgm.parent.id,cgm.id,words);
		cgm.parent.talk.sendRequest(requestMsg);
		//关闭对话框
		cgm.kickoutMemberPlaneCloseBtn.click();
	});
	
	//关闭对话框
	this.kickoutMemberPlaneCloseBtn.bind("click",function(event){
		cgm.kickoutMemberContainer.remove();
	});
};

/**
 * 移除本成员
 * @return
 */
ChatGroupMember.prototype.remove = function(){
	this.container.remove();
};

/**
 * 离线
 * @return
 */
ChatGroupMember.prototype.leave = function(){
	this.container.addClass("noline");
}

/**
 * 讨论组聊天对话框
 * 
 * @param talk
 * @param discussionGroupInfo [uid,name,avatar,currentUserIdentity]
 * 
 */
function DiscussionGroupDialog(talk,discussionGroupInfo){
	this.talk = talk;
	//类型
	this.type= "DiscussionGroupChat";
	//唯一标识
	this.id = discussionGroupInfo.uid;
	this.discussionGroupInfo = discussionGroupInfo;
	//最外部容器
	this.container = $("<div class=\"talkBox\"></div>");
	//消息框头部
	this.header = $("<div class=\"baseBox_talkTop\"></div>");
	//返回按钮
	this.backBtn = $("<a href=\"javascript:;\" class=\"talkTop_return\"><b class=\"gstIco20 gstIco20_return\"></b>返回</a>");
	//发送者信息容器
	this.senderContainer = $("<div class=\"talkTopCenter\"></div>");
	//发送者头像
	this.senderAvatar = $("<a href=\"javascript:;\" class=\"talkTop_photo\"><img src=\""+baseUrl+"wd/img/talkGroup_ico.png\" /></a>");
	//发送者名称
	this.senderName = $("<a href=\"javascript:;\" class=\"talkTop_userName\">"+discussionGroupInfo.name+"</a>");
	
	//讨论组成员状态按钮
	this.memberStatusBtn = $("<a href=\"javascript:;\" class=\"gstIco16 gstIco16_usersGray\"></a>");
	//讨论组成员数目容器
	this.memberNumContainer = $("<span class=\"talkTopCenter_text\"></span>");
	//在线成员数目
	this.memberOnlineNum = $("<span class=\"ttcPeoOnlineNub\"></span>");
	//成员总数
	this.memberNum = $("<span class=\"ttcPeoAllNub\"></span>");
	//组设置按钮
	this.settingBtn = $("<a href=\"javascript:;\" target=\"_blank\" class=\"gstIco16 gstIco16_controlGray\"></a>");
	
	//讨论组成员外部容器
	this.memberOuterContainer = $("<div class=\"gstLayer\" style=\"display:none\"></div>");
	//讨论组成员面板关闭按钮
	this.memberPlaneCloseBtn = $("<a href=\"javascript:;\" class=\"gstLayer_close\"></a>");
	//讨论组成员内部容器
	this.memberInsideContainer = $("<div class=\"groupPeopleList_div\" style=\"height:300px;\"></div>");
	//讨论组成员容器
	this.memberContainer = $("<ul class=\"groupPeopleList\"></ul>");
	
	//关闭按钮
	this.closeBtn = $("<a href=\"javascript:;\" class=\"talkTop_del\" title=\"关闭当前聊天窗口\"><b class=\"gstIco20 gstIco20_del\"></b></a>");
	//消息容器
	this.msgContainer = $("<ul class=\"talkList\"></ul>");
	//发送消息容器
	this.sendContainer = $("<div class=\"talkFormBox\"></div>");
	
	//工具外部容器
	this.toolsOutsideContainer = $("<div class=\"talkForm_moreBox\"></div>");
	//更多工具的按钮
	this.moreToolsBtn = $("<a href=\"javascript:;\" class=\"talkForm_moreBut\" title=\"更多\"></a>");
	//发送图片容器
	this.imgsContainer = $("<ul class=\"upImage_list\" style=\"display:none\"></ul>");
	//工具容器
	this.toolsContainer = $("<ul class=\"talkForm_more\"></ul>");
	//上传图片
	this.uploadImgTool = $("<li><a class=\"gstIco16 gstIco16_image\" href=\"javascript:;\" title=\"上传图片，可以直接拖放\"><input title=\"添加图片，可以直接拖放\" class=\"talkForm_moreFile\" type=\"file\" /></a></li>");
	//传文件
	this.uploadFileTool = $("<li><a class=\"gstIco16 gstIco16_upload\" href=\"javascript:;\" title=\"上传文件\"><input title=\"上传文件\" class=\"talkForm_moreFile\" type=\"file\" /></a></li>");
	
	//输入表单
	this.inputForm = $("<div class=\"talkForm_main\"></div>");
	//表情工具
	this.smileTool = $("<a href=\"javascript:;\" class=\"talkform_expr\"></a>");
	//消息输入框
	this.input = $("<textarea class=\"talkform_txt\" validateType=\"lengthRange-1-2000\"></textarea>");
	//提交按钮
	this.submitBtn = $("<input class=\"talkform_button\" type=\"button\" value=\"发送\" submit=\"true\" />");
	//是否允许自动滚动
	this.autoScroll = true;
	//所有讨论组成员对象[DiscussionGroupMember]
	this.members = [];
	
	//打开聊天记录的按钮
	this.openRecordPlaneBtn = $("<a href=\"javascript:;\" title=\"聊天记录\" class=\"gstIco16 gstIco16_talk\"></a>");
	//组建讨论组
	this.buildDiscussionGroupBtn = $("<a href=\"javascript:;\" title=\"邀请多人会话\" class=\"gstIco16 gstIco16_addPeople\"></a>");
	
	//修改讨论组信息外部容器
	this.updateInfoContainer = $("<div class=\"gstLayer\"></div>");
	//修改讨论组面板关闭按钮
	this.updateInfoPlaneCloseBtn = $("<a href=\"javascript:;\" class=\"gstLayer_close\"></a>");
	this.updateInfoTitle = $("<h5 class=\"orange\">设置讨论组信息</h5>");
	this.updateInfoNameLabel = $("<label class=\"layerLabel\">讨论组名称：</label>");
	this.updateInfoName = $("<input class=\"layerFormTxt\" validateType=\"lengthRange-1-20\"/>");
	this.updateInfoBtnContainer = $("<p class=\"leyear_butBox\"><input class=\"button_black\" type=\"button\" value=\"确认\" /><input class=\"button_white\" type=\"button\" value=\"取消\" /></p>");
	
	//消息记录面板
	this.recordsPlane = $("<div class=\"gstLayer\" style=\"display:none\"></div>");
	//消息记录面板关闭按钮
	this.recordsPlaneCloseBtn = $("<a href=\"javaascript:;\" class=\"gstLayer_close\"></a>");
	//消息记录容器
	this.recordsContainer = $("<ul class=\"talkList\"></ul>");
	//消息记录标题
	this.recordsTitle = $("<li class=\"talkLi2\"><span href=\"javaascript:;\" class=\"oldTalkBut\">"+new Date().format("yyyy-MM-dd")+"</span></li>");
	//消息记录工具容器
	this.recordsToolsContainer = $("<div class=\"oldTalkList_tool\"></div>");
	//选择消息记录的时间
	this.recordsDateInput = $("<input class=\"gsttText1\" type=\"text\" value=\""+new Date().format("yyyy-MM-dd")+"\" />");
	//消息记录工具
	this.msgRecordTool = null;
	
	this.build();
};

//继承自ChatGroupDialog
DiscussionGroupDialog.inherit(ChatGroupDialog);

/**
 * 创建讨论组对话窗口
 * @return
 */
DiscussionGroupDialog.prototype.build = function(){
	var dialog = this;
	
	this.talk.msgReadPlane.plane.prepend(this.container);
	
	//组建讨论组成员容器
	this.container.append(this.memberOuterContainer);
	this.memberOuterContainer.append(this.memberPlaneCloseBtn);
	this.memberOuterContainer.append(this.memberInsideContainer);
	this.memberInsideContainer.append(this.memberContainer);
	
	this.container.append(this.header);
	this.header.append(this.backBtn);
	this.header.append(this.senderContainer);
	
	this.senderContainer.append(this.senderAvatar);
	this.senderContainer.append(this.senderName);
	
	//显示修改组按钮
	if(this.discussionGroupInfo.currentUserIdentity==1||this.discussionGroupInfo.currentUserIdentity==2){
		this.senderContainer.append(this.buildDiscussionGroupBtn);
		this.senderContainer.append(" ");
	}
	
	//讨论组窗口的特殊设置
	this.senderContainer.addClass("talkTopCenter_border");
	this.senderContainer.append(this.memberStatusBtn);
	this.senderContainer.append(this.memberNumContainer);
	this.memberNumContainer.append(this.memberOnlineNum);
	this.memberNumContainer.append("/");
	this.memberNumContainer.append(this.memberNum);
	
	this.header.append(this.closeBtn);
	
	this.container.append(this.msgContainer);
	this.container.append(this.sendContainer);
	
	this.sendContainer.append(this.toolsOutsideContainer);
	this.toolsOutsideContainer.append(this.moreToolsBtn);
	this.toolsOutsideContainer.append(this.imgsContainer);
	this.toolsOutsideContainer.append(this.toolsContainer);
	this.toolsContainer.append(this.uploadImgTool);
	//this.toolsContainer.append(this.uploadFileTool);
	
	this.sendContainer.append(this.inputForm);
	this.inputForm.append(this.smileTool);
	this.inputForm.append(this.input);
	this.inputForm.append(this.submitBtn);
	
	//添加所有讨论组成员
	for(var i = 0;i<this.discussionGroupInfo.members.length;i++){
		this.addMember(this.discussionGroupInfo.members[i]);
	}
	
	//绑定事件创建讨论组
	this.buildDiscussionGroupBtn.bind("click",function(event){
		dialog.talk.discussionGroupMemberChooser.show(dialog);
	});
	
	//绑定相关事件
	this.bindCommonEvent();
	this.bindSendMsgEvent();
	this.addListener();
	this.buildRecordsSystem();
	
	//获取焦点
	this.focus();
	
	//准备更新组信息
	if(this.discussionGroupInfo.currentUserIdentity==1||this.discussionGroupInfo.currentUserIdentity==2){
		this.senderContainer.append(this.settingBtn);
		this.settingBtn.bind("click",function(event){
			dialog.updateInfoReady();
		});
		
		//如果是首次打开，则要求修改讨论组名称
		if(this.discussionGroupInfo.beFirst){
			this.settingBtn.click();
		}
	};
};

/**
 * 添加一个成员
 * @param memberData
 * @return
 */
DiscussionGroupDialog.prototype.addMember = function(memberData){
	var member = new DiscussionGroupMember(memberData,this);
	this.members.push(member);
};

/**
 * 设置讨论组信息
 * @return
 */
DiscussionGroupDialog.prototype.updateInfoReady = function(){
	var dialog = this;
	
	this.container.prepend(this.updateInfoContainer);
	this.updateInfoContainer.append(this.updateInfoPlaneCloseBtn);
	this.updateInfoContainer.append(this.updateInfoTitle);
	this.updateInfoContainer.append(this.updateInfoNameLabel);
	this.updateInfoContainer.append(this.updateInfoName);
	this.updateInfoContainer.append(this.updateInfoBtnContainer);
	
	//绑定解散动作
	this.updateInfoBtnContainer.find(".button_black").bind("click",function(event){
		var requestMsg = dialog.talk.request.settingDiscussionGroupInfo(dialog.id,dialog.updateInfoName.val(),dialog.updateInfoName.val());
		dialog.talk.sendRequest(requestMsg);
		dialog.updateInfoPlaneCloseBtn.click();
	});
	
	//取消
	this.updateInfoBtnContainer.find(".button_white").bind("click",function(event){
		dialog.talk.bgLayer.hide();
		dialog.updateInfoContainer.remove();
	});
	
	//关闭对话框
	this.updateInfoPlaneCloseBtn.bind("click",function(event){
		dialog.talk.bgLayer.hide();
		dialog.updateInfoContainer.remove();
	});
	
	//显示背景层
	dialog.talk.bgLayer.show();
};

/**
 * 设置讨论组信息
 * @param name
 * @param description
 * @return
 */
DiscussionGroupDialog.prototype.settingInfo = function(name,description){
	this.discussionGroupInfo.name = name;
	this.senderName.html(name);
};

/**
 * 讨论组成员
 * @param memberData[uid,name,avatar,online,identity]
 * @param dialog
 * @return
 */
function DiscussionGroupMember(memberData,dialog){
	this.id = memberData.uid;
	this.memberData = memberData;
	this.parent = dialog;
	this.container = $("<li class=\"groupPeopleLi noline\"></li>");
	this.avatar = $("<a href=\""+baseUrl+"chater/show/"+this.id+".htm\" target=\"_blank\" class=\"groupPeopleLi_photo\"><img src=\""+baseUrl+memberData.avatar+"\" /></a>");
	this.infoContiner = $("<p class=\"groupPeopleLi_p\"></p>");
	this.name = $("<a href=\"javascript:;\" class=\"groupPeopleLi_name\">"+memberData.name+"</a>");
	this.identitySign = $("<b title=\"\" class=\"gstIco12\"></b>");
	this.identity = $("<span class=\"gray\"></span>");
	//封禁成员
	this.gagBtn = $("<a href=\"javascript:;\" class=\"aBlue\">封禁</a>");
	//T掉一个成员
	this.removeBtn = $("<a href=\"javascript:;\" class=\"aBlue\">踢除</a>");
	
	//封禁用户外部容器
	this.gagContainer = $("<div class=\"gstLayer_min\"><b class=\"gstLayer_minBg\"></b></div>");
	this.gagFormContainer = $("<ul class=\"gstLayer_minForm\"></ul>");
	this.gagDays = $("<li class=\"gstLayer_minLi\"><label class=\"gstLayer_minLabel\">封禁天数：</label><input class=\"gstLayer_minTxt\" validateType=\"lengthRange-1-3|beDigits\" type=\"text\" /> 天</li>");
	this.gagWords = $("<li class=\"gstLayer_minLi\"><label class=\"gstLayer_minLabel\">理由：</label><textarea class=\"gstLayer_minTextarea\" validateType=\"lengthRange-5-200\"></textarea></li>");
	this.gagBtnContainer = $("<li class=\"gstLayer_minLi\"><input type=\"button\" class=\"gstLayer_minBut\" value=\"确认\" submit=\"true\" /></li>");
	//封禁用户面板关闭按钮
	this.gagPlaneCloseBtn = $("<a href=\"javascript:;\" class=\"gstLayer_close\"></a>");
	
	//T除一个成员外部容器
	this.kickoutMemberContainer = $("<div class=\"gstLayer_min\"><b class=\"gstLayer_minBg\"></b></div>");
	this.kickoutMemberFormContainer = $("<ul class=\"gstLayer_minForm\"></ul>");
	this.kickoutMemberWords = $("<li class=\"gstLayer_minLi\"><label class=\"gstLayer_minLabel\">理由：</label><textarea class=\"gstLayer_minTextarea\" validateType=\"lengthRange-5-200\"></textarea></li>");
	this.kickoutMemberBtnContainer = $("<li class=\"gstLayer_minLi\"><input type=\"button\" class=\"gstLayer_minBut\" value=\"确认\" submit=\"true\" /></li>");
	//T除一个成员面板关闭按钮
	this.kickoutMemberPlaneCloseBtn = $("<a href=\"javascript:;\" class=\"gstLayer_close\"></a>");
	
	this.build();
};

//继承自ChatGroupMember
DiscussionGroupMember.inherit(ChatGroupMember);

/**
 * 创建一个讨论组成员
 * @return
 */
DiscussionGroupMember.prototype.build = function(){
	
	var cgm = this;
	
	this.parent.memberContainer.prepend(this.container);
	this.container.append(this.avatar);
	this.container.append(this.infoContiner);
	this.infoContiner.append(this.name);
	this.infoContiner.append("<br/>");
	
	//创建者
	if(this.memberData.identity==1){
		this.infoContiner.append(this.identitySign);
		this.identitySign.addClass("gstIco12_starRed");
		this.infoContiner.append(this.identity);
		this.identity.html("创建者");
	}
	
	//用户
	if(this.memberData.identity==3){
		//判断当前用户是否是管理员身份
		if(this.parent.discussionGroupInfo.currentUserIdentity==1||this.parent.discussionGroupInfo.currentUserIdentity==2){
			this.addManagerPermission();
		}
	}
	
	//标记是否在线
	if(this.memberData.online){
		this.container.removeClass("noline");
	}
};

/**
 * 封禁准备
 * @return
 */
DiscussionGroupMember.prototype.gagReady = function(){
	var cgm = this;
	
	this.container.prepend(this.gagContainer);
	this.gagContainer.append(this.gagFormContainer);
	this.gagFormContainer.append(this.gagDays);
	this.gagFormContainer.append(this.gagWords);
	this.gagFormContainer.append(this.gagBtnContainer);
	this.gagFormContainer.append(this.gagPlaneCloseBtn);
	
	//绑定封禁动作
	this.gagBtnContainer.find(".gstLayer_minBut").bind("click",function(event){
		var days = parseInt(cgm.gagDays.find("input").val());
		var words = cgm.gagWords.find("textarea").val();
		var requestMsg = cgm.parent.talk.request.gagDiscussionGroupMember(cgm.parent.id,cgm.id,days,words);
		cgm.parent.talk.sendRequest(requestMsg);
		//关闭对话框
		cgm.gagPlaneCloseBtn.click();
	});
	
	//关闭对话框
	this.gagPlaneCloseBtn.bind("click",function(event){
		cgm.gagContainer.remove();
	});
};

/**
 * 踢出用户准备准备
 * @return
 */
DiscussionGroupMember.prototype.kickoutMemberReady = function(){
	var cgm = this;
	
	this.container.prepend(this.kickoutMemberContainer);
	this.kickoutMemberContainer.append(this.kickoutMemberFormContainer);
	this.kickoutMemberFormContainer.append(this.kickoutMemberWords);
	this.kickoutMemberFormContainer.append(this.kickoutMemberBtnContainer);
	this.kickoutMemberFormContainer.append(this.kickoutMemberPlaneCloseBtn);
	
	//绑定踢出用户准备动作
	this.kickoutMemberBtnContainer.find(".gstLayer_minBut").bind("click",function(event){
		var words = cgm.kickoutMemberWords.find("textarea").val();
		var requestMsg = cgm.parent.talk.request.kickoutDiscussionGroupMember(cgm.parent.id,cgm.id,words);
		cgm.parent.talk.sendRequest(requestMsg);
		//关闭对话框
		cgm.kickoutMemberPlaneCloseBtn.click();
	});
	
	//关闭对话框
	this.kickoutMemberPlaneCloseBtn.bind("click",function(event){
		cgm.kickoutMemberContainer.remove();
	});
};

/**
 * 消息通知对象
 * @return
 */
function MsgNoticeSystem(talk){
	this.talk = talk;
	//关系面板上的通知
	this.onRePlaneNotice = $("#msgNoticeBox_relation");
	//消息面板上的通知
	this.onMsgPlaneNotice = $("#msgNoticeBox_msg");
	//系统消息通知
	this.sysMsgNoticeSystem = new SysMsgNoticeSystem(this);
};

/**
 * 设置聊天消息通知状态
 * @param unreadNum 未读消息数目
 * @return
 */
MsgNoticeSystem.prototype.setChatMsgNoticeStatus = function(unreadNum){
	this.onRePlaneNotice.html(unreadNum);
	this.onMsgPlaneNotice.html(unreadNum);
	
	if(unreadNum>0){
		this.onRePlaneNotice.show();
		this.onMsgPlaneNotice.show();
	}else{
		this.onRePlaneNotice.hide();
		this.onMsgPlaneNotice.hide();
	}
};

/**
 * 系统消息通知系统
 */
function SysMsgNoticeSystem(msgNoticeSystem){
	this.parent = msgNoticeSystem;
	this.box = $("#sysMsgNoticeBox");
	this.sign = $("#sysMsgNoticeSign");
	this.num = $("#sysMsgNoticeNum");
	this.blink = new Blink(this.sign,"normal");
	//存放系统通知的集合
	this.notices = [];
	
	this.addListener();
};

/**
 * 绑定事件
 * @return
 */
SysMsgNoticeSystem.prototype.addListener = function(){
	var sysMsgNoticeSystem = this;
	this.box.bind("click",function(event){
		sysMsgNoticeSystem.readNotice();
	});
};

/**
 * 设置系统消息通知状态
 * @param unreadNum
 * @return
 */
SysMsgNoticeSystem.prototype.updateNoticeStatus = function(){
	var unreadNum = this.notices.length;
	this.num.html(unreadNum);
	if(unreadNum>0){
		this.blink.stop();
		this.sign.addClass("gstIco16_hornWhite");
		this.sign.removeClass("gstIco16_hornGray");
		this.blink.start();
	}else{
		this.sign.addClass("gstIco16_hornGray");
		this.sign.removeClass("gstIco16_hornWhite");
		this.blink.stop();
	}
};

/**
 * 接收一条普通的系统消息
 * @param data
 * @return
 */
SysMsgNoticeSystem.prototype.addCommonNotice = function(data){
	this.notices.push(new SysMsgNotice(data,this));
	this.updateNoticeStatus();
};

/**
 * 接收一条申请加入群组的系统消息
 * @param data
 * @return
 */
SysMsgNoticeSystem.prototype.addApp2JoinGroupNotice = function(data){
	this.notices.push(new App2JoinGroupNotice(data,this));
	this.updateNoticeStatus();
};

/**
 * 接收一条管理群组邀请的系统信息
 * @param data
 * @return
 */
SysMsgNoticeSystem.prototype.addManageChatGroupInvitationNotice = function(data){
	this.notices.push(new ManageChatGroupInvitationNotice(data,this));
	this.updateNoticeStatus();
};

/**
 * 接收一条邀请加入讨论组的系统信息
 * @param data
 * @return
 */
SysMsgNoticeSystem.prototype.addJoinDiscussionGroupInvitationNotice = function(data){
	this.notices.push(new JoinDiscussionGroupInvitationNotice(data,this));
	this.updateNoticeStatus();
};

/**
 * 读取一条消息
 * @return
 */
SysMsgNoticeSystem.prototype.readNotice = function(){
	if(this.notices.length>0){
		var notice = this.notices.pop();
		notice.show();
		//更新通知状态
		this.updateNoticeStatus();
	}
};

/**
 * 创建一个系统通知
 * @param data[title,content]
 * @param sysMsgNoticeSystem
 * @return
 */
function SysMsgNotice(data,sysMsgNoticeSystem){
	this.parent = sysMsgNoticeSystem;
	this.id = data.uid;
	this.data = data;
	this.type = "common";
	this.container = $("<div class=\"gstLayer\" style=\"display:none\"></div>");
	this.title = $("<h5 class=\"orange\">"+data.title+"</h5>");
	this.content = $("<p>"+data.content+"</p>");
	this.btnContainer = $("<p class=\"leyear_butBox\"></p>");
	this.confirmBtn = $("<input class=\"button_black\" type=\"button\" value=\"确认\" />");
	
	this.build();
};

/**
 * 构建DOM树
 * @return
 */
SysMsgNotice.prototype.build = function(){
	this.parent.parent.talk.relationPlane.plane.append(this.container);
	this.container.append(this.title);
	this.container.append(this.content);
	this.container.append(this.btnContainer);
	this.btnContainer.append(this.confirmBtn);
	
	this.addListener();
};

/**
 * 添加监听器
 * @return
 */
SysMsgNotice.prototype.addListener = function(){
	var sysMsgNotice = this;
	
	//点击确定，销毁
	this.confirmBtn.bind("click",function(event){
		sysMsgNotice.destroy();
	});
};

/**
 * 显示一条系统消息
 * @return
 */
SysMsgNotice.prototype.show = function(){
	this.parent.parent.talk.bgLayer.show();
	this.container.show();
};

/**
 * 销毁一条系统通知
 * @return
 */
SysMsgNotice.prototype.destroy = function(){
	for(var i = this.parent.notices.length-1;i>-1;i--){
		if(this.id==this.parent.notices[i].id){
			this.parent.notices.splice(i,1);
			break;
		}
	}
	this.parent.parent.talk.bgLayer.hide();
	this.container.remove();
};

/**
 * 申请加入群组的系统通知
 * @param data
 * @param sysMsgNoticeSystem
 * @return
 */
function App2JoinGroupNotice(data,sysMsgNoticeSystem){
	this.parent = sysMsgNoticeSystem;
	this.id = data.uid;
	this.data = data;
	this.type = "app2JoinGroup";
	this.container = $("<div class=\"gstLayer\" style=\"display:none\"></div>");
	this.title = $("<h5 class=\"orange\">"+data.title+"</h5>");
	this.content = $("<p>"+data.content+"</p>");
	this.formContainer = $("<ul class=\"layerForm\"></ul>");
	this.passingContainer = $("<li class=\"layerFormLi\">" +
			"<label class=\"layerFormLabel\">是否通过：</label>" +
			"<label class=\"layerFormLabel2\"><input type=\"radio\" name=\"passing\" value=\"1\" checked/>通过</label>" +
			"<label class=\"layerFormLabel2\"><input type=\"radio\" name=\"passing\" value=\"2\" />拒绝</label>" +
			"</li>");
	this.wordsContainer = $("<li class=\"layerFormLi\">" +
			"<label class=\"layerFormLabel\">附言：</label>" +
			"<textarea class=\"layerFormTextarea\" validateType=\"lengthRange-0-200\"></textarea>" +
			"</li>");
	this.btnContainer = $("<p class=\"leyear_butBox\"></p>");
	this.confirmBtn = $("<input class=\"button_black\" type=\"button\" value=\"确认\" submit=\"true\" />");
	
	this.build();
};

//继承自SysMsgNotice
App2JoinGroupNotice.inherit(SysMsgNotice);

/**
 * 构建DOM树
 * @return
 */
App2JoinGroupNotice.prototype.build = function(){
	this.parent.parent.talk.relationPlane.plane.append(this.container);
	this.container.append(this.title);
	this.container.append(this.content);
	this.container.append(this.formContainer);
	this.formContainer.append(this.passingContainer);
	this.formContainer.append(this.wordsContainer);
	this.container.append(this.btnContainer);
	this.btnContainer.append(this.confirmBtn);
	
	new Validator(this.container);
	this.addListener();
};

/**
 * 添加事件
 * @return
 */
App2JoinGroupNotice.prototype.addListener = function(){
	var app2JoinGroupNotice = this;
	
	//点击确定，销毁
	this.confirmBtn.bind("click",function(event){
		var chatGroupId = app2JoinGroupNotice.data.chatGroupId;
		var appId = app2JoinGroupNotice.data.appId;
		var passStr = app2JoinGroupNotice.passingContainer.find(":checked").val();
		var pass = false;
		if(passStr=="1"){
			pass = true;
		}
		var words = app2JoinGroupNotice.wordsContainer.find("textarea").val();
		var requestMsg = app2JoinGroupNotice.parent.parent.talk.request.dealWithChatGroupApp(chatGroupId,appId,pass,words);
		app2JoinGroupNotice.parent.parent.talk.sendRequest(requestMsg);
		app2JoinGroupNotice.destroy();
	});
};

/**
 * 邀请管理群组的系统通知
 * @param data
 * @param sysMsgNoticeSystem
 * @return
 */
function ManageChatGroupInvitationNotice(data,sysMsgNoticeSystem){
	this.parent = sysMsgNoticeSystem;
	this.id = data.uid;
	this.data = data;
	this.type = "manageChatGroupInvitation";
	this.container = $("<div class=\"gstLayer\" style=\"display:none\"></div>");
	this.title = $("<h5 class=\"orange\">"+data.title+"</h5>");
	this.content = $("<p>"+data.content+"</p>");
	this.formContainer = $("<ul class=\"layerForm\"></ul>");
	this.passingContainer = $("<li class=\"layerFormLi\">" +
			"<label class=\"layerFormLabel\">是否同意：</label>" +
			"<label class=\"layerFormLabel2\"><input type=\"radio\" name=\"passing\" value=\"1\" checked/>同意</label>" +
			"<label class=\"layerFormLabel2\"><input type=\"radio\" name=\"passing\" value=\"2\"/>拒绝</label>" +
			"</li>");
	this.btnContainer = $("<p class=\"leyear_butBox\"></p>");
	this.confirmBtn = $("<input class=\"button_black\" type=\"button\" value=\"确认\" />");
	
	this.build();
};

//继承自SysMsgNotice
ManageChatGroupInvitationNotice.inherit(SysMsgNotice);

/**
 * 构建DOM树
 * @return
 */
ManageChatGroupInvitationNotice.prototype.build = function(){
	this.parent.parent.talk.relationPlane.plane.append(this.container);
	this.container.append(this.title);
	this.container.append(this.content);
	this.container.append(this.formContainer);
	this.formContainer.append(this.passingContainer);
	this.container.append(this.btnContainer);
	this.btnContainer.append(this.confirmBtn);
	
	this.addListener();
};

/**
 * 添加事件
 * @return
 */
ManageChatGroupInvitationNotice.prototype.addListener = function(){
	var manageChatGroupInvitationNotice = this;
	
	//点击确定，销毁
	this.confirmBtn.bind("click",function(event){
		var chatGroupId = manageChatGroupInvitationNotice.data.chatGroupId;
		var invitationId = manageChatGroupInvitationNotice.data.invitationId;
		var passStr = manageChatGroupInvitationNotice.passingContainer.find(":checked").val();
		var pass = false;
		if(passStr=="1"){
			pass = true;
		}
		var requestMsg = manageChatGroupInvitationNotice.parent.parent.talk.request.addChatGroupManger(chatGroupId,invitationId,pass);
		manageChatGroupInvitationNotice.parent.parent.talk.sendRequest(requestMsg);
		manageChatGroupInvitationNotice.destroy();
	});
};

/**
 * 邀请加入讨论组的系统通知
 * @param data
 * @param sysMsgNoticeSystem
 * @return
 */
function JoinDiscussionGroupInvitationNotice(data,sysMsgNoticeSystem){
	this.parent = sysMsgNoticeSystem;
	this.id = data.uid;
	this.data = data;
	this.type = "joinDiscussionGroupInvitation";
	this.container = $("<div class=\"gstLayer\" style=\"display:none\"></div>");
	this.title = $("<h5 class=\"orange\">"+data.title+"</h5>");
	this.content = $("<p>"+data.content+"</p>");
	this.formContainer = $("<ul class=\"layerForm\"></ul>");
	this.passingContainer = $("<li class=\"layerFormLi\">" +
			"<label class=\"layerFormLabel\">是否同意：</label>" +
			"<label class=\"layerFormLabel2\"><input type=\"radio\" name=\"passing\" value=\"1\" checked/>同意</label>" +
			"<label class=\"layerFormLabel2\"><input type=\"radio\" name=\"passing\" value=\"2\"/>拒绝</label>" +
			"</li>");
	this.btnContainer = $("<p class=\"leyear_butBox\"></p>");
	this.confirmBtn = $("<input class=\"button_black\" type=\"button\" value=\"确认\" />");
	
	this.build();
};

//继承自SysMsgNotice
JoinDiscussionGroupInvitationNotice.inherit(SysMsgNotice);

/**
 * 构建DOM树
 * @return
 */
JoinDiscussionGroupInvitationNotice.prototype.build = function(){
	this.parent.parent.talk.relationPlane.plane.append(this.container);
	this.container.append(this.title);
	this.container.append(this.content);
	this.container.append(this.formContainer);
	this.formContainer.append(this.passingContainer);
	this.container.append(this.btnContainer);
	this.btnContainer.append(this.confirmBtn);
	
	this.addListener();
};

/**
 * 添加事件
 * @return
 */
JoinDiscussionGroupInvitationNotice.prototype.addListener = function(){
	var joinDiscussionGroupInvitationNotice = this;
	
	//点击确定，销毁
	this.confirmBtn.bind("click",function(event){
		var discussionGroupId = joinDiscussionGroupInvitationNotice.data.discussionGroupId;
		var invitationId = joinDiscussionGroupInvitationNotice.data.invitationId;
		var passStr = joinDiscussionGroupInvitationNotice.passingContainer.find(":checked").val();
		var pass = false;
		if(passStr=="1"){
			pass = true;
		}
		var requestMsg = joinDiscussionGroupInvitationNotice.parent.parent.talk.request.joinDiscussionGroup(discussionGroupId,invitationId,pass);
		joinDiscussionGroupInvitationNotice.parent.parent.talk.sendRequest(requestMsg);
		joinDiscussionGroupInvitationNotice.destroy();
	});
};

/**
 * 群组对象
 * @param chatGroupInfo 『uid,name,avatar,description,msgOption,currentUserIdentity』
 * @return
 */
function JoinedChatGroup(chatGroupInfo,relationPlane){
	this.id = chatGroupInfo.uid;
	this.chatGroupInfo = chatGroupInfo;
	this.parent = relationPlane;
	//父容器
	this.container = $("#chatGroupContainer");
	this.outerContainer = $("<li class=\"groupLi\"></li>")
	this.avatarContainer = $("<a href=\"javascript:;\" class=\"groupLi_img\"></a>");
	this.avatar = $("<img src=\""+baseUrl+this.chatGroupInfo.avatar+"\" />");
	this.name = $("<a href=\"javascript:;\">"+this.chatGroupInfo.name+"</a>");
	this.unreadMsg = $("<span></span>");
	
	//解散群外部容器
	this.dissolveContainer = $("<div class=\"gstLayer\"></div>");
	//解散群面板关闭按钮
	this.dissolvePlaneCloseBtn = $("<a href=\"javascript:;\" class=\"gstLayer_close\"></a>");
	this.dissolveTitle = $("<h5 class=\"orange\">解散群</h5>");
	this.dissolveWordsLabel = $("<label class=\"layerLabel\">给成员的话：</label>");
	this.dissolveWords = $("<textarea class=\"layerTextarea\" validateType=\"lengthRange-5-200\"></textarea>");
	this.dissolveBtnContainer = $("<p class=\"leyear_butBox\"><input class=\"button_black\" type=\"button\" value=\"确认\" /><input class=\"button_white\" type=\"button\" value=\"取消\" /></p>");
	
	//菜单容器
	this.menuContainer = $("<div class=\"groupLi_right\"></div>");
	this.msgOptionBtn = $("<a href=\"javascript:;\" class=\"indGroup_say\">"+this.showMsgOption(this.chatGroupInfo.msgOption)+"</a>");
	this.settingBtn = $("<a href=\"javascript:;\" class=\"indGroup_shezhi\">设置</a>");
	this.menu = $("<ul class=\"index_moreList\"></ul>");
	this.exitItem = $("<li class=\"index_moreLi\"><a href=\"javascript:;\">退出群</a></li>");
	this.dissolveItem = $("<li class=\"index_moreLi\"><a href=\"javascript:;\">解散群</a></li>");
	this.exitManagerItem = $("<li class=\"index_moreLi\"><a href=\"javascript:;\">取消管理</a></li>");
	//当前消息设置值
	this.msgOption = this.chatGroupInfo.msgOption;
	
	this.build();
};

/**
 * 初始化群对象
 * @return
 */
JoinedChatGroup.prototype.build = function(){
	this.container.append(this.outerContainer);
	this.outerContainer.append(this.avatarContainer);
	this.avatarContainer.append(this.avatar);
	this.outerContainer.append(this.name);
	this.outerContainer.append("<br/>");
	this.outerContainer.append(this.unreadMsg);
	this.outerContainer.append(this.menuContainer);
	
	this.menuContainer.append(this.msgOptionBtn);
	this.menuContainer.append(this.settingBtn);
	this.menuContainer.append(this.menu);
	
	this.menu.append(this.exitItem);
	
	if(this.chatGroupInfo.currentUserIdentity==2){
		this.menu.append(this.exitManagerItem);
	}
	
	if(this.chatGroupInfo.currentUserIdentity==1){
		this.menu.append(this.dissolveItem);
	}
	
	this.addListener();
};

/**
 * 绑定事件
 * @return
 */
JoinedChatGroup.prototype.addListener = function(){
	
	var joinedChatGroup = this;
	
	this.name.bind("click",function(event){
		joinedChatGroup.parent.talk.openDialog({uid:joinedChatGroup.chatGroupInfo.uid,name:joinedChatGroup.chatGroupInfo.name,avatar:joinedChatGroup.chatGroupInfo.avatar},"GroupChat");
	});
	
	this.avatarContainer.bind("click",function(event){
		joinedChatGroup.parent.talk.openDialog({uid:joinedChatGroup.chatGroupInfo.uid,name:joinedChatGroup.chatGroupInfo.name,avatar:joinedChatGroup.chatGroupInfo.avatar},"GroupChat");
	});
	
	//显示设置菜单
	this.settingBtn.bind("click",function(event){
		joinedChatGroup.menu.show();
		event.stopPropagation();
	});
	
	//退出群
	this.exitItem.bind("click",function(event){
		var requestMsg = joinedChatGroup.parent.talk.request.exitChatGroup(joinedChatGroup.id);
		joinedChatGroup.parent.talk.sendRequest(requestMsg);
	});
	
	//解散群
	if(this.chatGroupInfo.currentUserIdentity==1){
		this.dissolveItem.bind("click",function(event){
			joinedChatGroup.dissolveReady();
		});
	};
	
	//退出群管理权限
	if(this.chatGroupInfo.currentUserIdentity==2){
		this.exitManagerItem.bind("click",function(event){
			var requestMsg = joinedChatGroup.parent.talk.request.removeChatGroupManger(joinedChatGroup.id);
			joinedChatGroup.parent.talk.sendRequest(requestMsg);
		});
	};
	
	//设置消息机制
	this.msgOptionBtn.bind("click",function(event){
		var option = "normal";
		if(joinedChatGroup.msgOption=="normal"){
			option = "no_reminder";
		}else if(joinedChatGroup.msgOption=="no_reminder"){
			option = "shield";
		}
		
		var requestMsg = joinedChatGroup.parent.talk.request.setChatGroupMsgOption(joinedChatGroup.id,option);
		joinedChatGroup.parent.talk.sendRequest(requestMsg);
	});
	
	//关闭设置菜单
	$("body").bind("click",function(event){
		joinedChatGroup.menu.hide();
	});
};

/**
 * 解散群准备
 * @return
 */
JoinedChatGroup.prototype.dissolveReady = function(){
	var joinedChatGroup = this;
	
	this.outerContainer.prepend(this.dissolveContainer);
	this.dissolveContainer.append(this.dissolvePlaneCloseBtn);
	this.dissolveContainer.append(this.dissolveTitle);
	this.dissolveContainer.append(this.dissolveWordsLabel);
	this.dissolveContainer.append(this.dissolveWords);
	this.dissolveContainer.append(this.dissolveBtnContainer);
	
	//绑定解散动作
	this.dissolveBtnContainer.find(".button_black").bind("click",function(event){
		var requestMsg = joinedChatGroup.parent.talk.request.dissolveChatGroup(joinedChatGroup.id,joinedChatGroup.dissolveWords.val());
		joinedChatGroup.parent.talk.sendRequest(requestMsg);
		joinedChatGroup.dissolvePlaneCloseBtn.click();
	});
	
	//取消
	this.dissolveBtnContainer.find(".button_white").bind("click",function(event){
		joinedChatGroup.parent.talk.bgLayer.hide();
		joinedChatGroup.dissolveContainer.remove();
	});
	
	//关闭对话框
	this.dissolvePlaneCloseBtn.bind("click",function(event){
		joinedChatGroup.parent.talk.bgLayer.hide();
		joinedChatGroup.dissolveContainer.remove();
	});
	
	//显示背景层
	joinedChatGroup.parent.talk.bgLayer.show();
};

/**
 * 设置当前群组消息设置
 * @param option
 * @return
 */
JoinedChatGroup.prototype.setMsgOption = function(option){
	this.msgOption = option;
	this.msgOptionBtn.html(this.showMsgOption(option));
};

/**
 * 显示群消息设置
 * @param msgOption
 * @return
 */
JoinedChatGroup.prototype.showMsgOption= function(msgOption){
	if(msgOption=="shield"){
		return "不接收";
	}else if(msgOption=="no_reminder"){
		return "不提示";
	}else{
		return "正常";
	}
};

/**
 * 移去一个加入的群组
 * @return
 */
JoinedChatGroup.prototype.remove = function(){
	this.outerContainer.remove();
};

/**
 * 讨论组对象
 * @param discussionGroupInfo 『uid,name,description,msgOption,currentUserIdentity』
 * @return
 */
function JoinedDiscussionGroup(discussionGroupInfo,relationPlane){
	this.id = discussionGroupInfo.uid;
	this.discussionGroupInfo = discussionGroupInfo;
	this.parent = relationPlane;
	//父容器
	this.container = $("#discussionGroupContainer");
	this.outerContainer = $("<li class=\"groupLi\"></li>")
	this.avatarContainer = $("<a href=\"javascript:;\" class=\"groupLi_img\"></a>");
	this.avatar = $("<img src=\""+baseUrl+"wd/img/talkGroup_ico.png\" />");
	this.name = $("<a href=\"javascript:;\">"+this.discussionGroupInfo.name+"</a>");
	this.unreadMsg = $("<span></span>");
	
	//解散讨论组外部容器
	this.dissolveContainer = $("<div class=\"gstLayer\"></div>");
	//解散讨论组面板关闭按钮
	this.dissolvePlaneCloseBtn = $("<a href=\"javascript:;\" class=\"gstLayer_close\"></a>");
	this.dissolveTitle = $("<h5 class=\"orange\">解散讨论组</h5>");
	this.dissolveWordsLabel = $("<label class=\"layerLabel\">给成员的话：</label>");
	this.dissolveWords = $("<textarea class=\"layerTextarea\" validateType=\"lengthRange-5-200\"></textarea>");
	this.dissolveBtnContainer = $("<p class=\"leyear_butBox\"><input class=\"button_black\" type=\"button\" value=\"确认\" /><input class=\"button_white\" type=\"button\" value=\"取消\" /></p>");
	
	//菜单容器
	this.menuContainer = $("<div class=\"groupLi_right\"></div>");
	this.msgOptionBtn = $("<a href=\"javascript:;\" class=\"indGroup_say\">"+this.showMsgOption(this.discussionGroupInfo.msgOption)+"</a>");
	this.settingBtn = $("<a href=\"javascript:;\" class=\"indGroup_shezhi\">设置</a>");
	this.menu = $("<ul class=\"index_moreList\"></ul>");
	this.exitItem = $("<li class=\"index_moreLi\"><a href=\"javascript:;\">退出讨论组</a></li>");
	this.dissolveItem = $("<li class=\"index_moreLi\"><a href=\"javascript:;\">解散讨论组</a></li>");
	//当前消息设置值
	this.msgOption = this.discussionGroupInfo.msgOption;
	
	this.build();
};

/**
 * 初始化讨论组对象
 * @return
 */
JoinedDiscussionGroup.prototype.build = function(){
	this.container.append(this.outerContainer);
	this.outerContainer.append(this.avatarContainer);
	this.avatarContainer.append(this.avatar);
	this.outerContainer.append(this.name);
	this.outerContainer.append("<br/>");
	this.outerContainer.append(this.unreadMsg);
	this.outerContainer.append(this.menuContainer);
	
	this.menuContainer.append(this.msgOptionBtn);
	this.menuContainer.append(this.settingBtn);
	this.menuContainer.append(this.menu);
	
	this.menu.append(this.exitItem);
	
	if(this.discussionGroupInfo.currentUserIdentity==1){
		this.menu.append(this.dissolveItem);
	}
	
	this.addListener();
};

/**
 * 绑定事件
 * @return
 */
JoinedDiscussionGroup.prototype.addListener = function(){
	
	var joinedDiscussionGroup = this;
	
	this.name.bind("click",function(event){
		joinedDiscussionGroup.parent.talk.openDialog({uid:joinedDiscussionGroup.discussionGroupInfo.uid,name:joinedDiscussionGroup.discussionGroupInfo.name},"DiscussionGroupChat");
	});
	
	this.avatarContainer.bind("click",function(event){
		joinedDiscussionGroup.parent.talk.openDialog({uid:joinedDiscussionGroup.discussionGroupInfo.uid,name:joinedDiscussionGroup.discussionGroupInfo.name},"DiscussionGroupChat");
	});
	
	//显示设置菜单
	this.settingBtn.bind("click",function(event){
		joinedDiscussionGroup.menu.show();
		event.stopPropagation();
	});
	
	//退出讨论组
	this.exitItem.bind("click",function(event){
		var requestMsg = joinedDiscussionGroup.parent.talk.request.exitDiscussionGroup(joinedDiscussionGroup.id);
		joinedDiscussionGroup.parent.talk.sendRequest(requestMsg);
	});
	
	//解散讨论组
	if(this.discussionGroupInfo.currentUserIdentity==1){
		this.dissolveItem.bind("click",function(event){
			joinedDiscussionGroup.dissolveReady();
		});
	};
	
	//设置消息机制
	this.msgOptionBtn.bind("click",function(event){
		var option = "normal";
		if(joinedDiscussionGroup.msgOption=="normal"){
			option = "no_reminder";
		}else if(joinedDiscussionGroup.msgOption=="no_reminder"){
			option = "shield";
		}
		
		var requestMsg = joinedDiscussionGroup.parent.talk.request.setDiscussionGroupMsgOption(joinedDiscussionGroup.id,option);
		joinedDiscussionGroup.parent.talk.sendRequest(requestMsg);
	});
	
	//关闭设置菜单
	$("body").bind("click",function(event){
		joinedDiscussionGroup.menu.hide();
	});
};

/**
 * 解散讨论组准备
 * @return
 */
JoinedDiscussionGroup.prototype.dissolveReady = function(){
	var joinedDiscussionGroup = this;
	
	this.outerContainer.prepend(this.dissolveContainer);
	this.dissolveContainer.append(this.dissolvePlaneCloseBtn);
	this.dissolveContainer.append(this.dissolveTitle);
	this.dissolveContainer.append(this.dissolveWordsLabel);
	this.dissolveContainer.append(this.dissolveWords);
	this.dissolveContainer.append(this.dissolveBtnContainer);
	
	//绑定解散动作
	this.dissolveBtnContainer.find(".button_black").bind("click",function(event){
		var requestMsg = joinedDiscussionGroup.parent.talk.request.dissolveDiscussionGroup(joinedDiscussionGroup.id,joinedDiscussionGroup.dissolveWords.val());
		joinedDiscussionGroup.parent.talk.sendRequest(requestMsg);
		joinedDiscussionGroup.dissolvePlaneCloseBtn.click();
	});
	
	//取消
	this.dissolveBtnContainer.find(".button_white").bind("click",function(event){
		joinedDiscussionGroup.parent.talk.bgLayer.hide();
		joinedDiscussionGroup.dissolveContainer.remove();
	});
	
	//关闭对话框
	this.dissolvePlaneCloseBtn.bind("click",function(event){
		joinedDiscussionGroup.parent.talk.bgLayer.hide();
		joinedDiscussionGroup.dissolveContainer.remove();
	});
	
	//显示背景层
	joinedDiscussionGroup.parent.talk.bgLayer.show();
};

/**
 * 设置当前讨论组消息设置
 * @param option
 * @return
 */
JoinedDiscussionGroup.prototype.setMsgOption = function(option){
	this.msgOption = option;
	this.msgOptionBtn.html(this.showMsgOption(option));
};

/**
 * 显示讨论组消息设置
 * @param msgOption
 * @return
 */
JoinedDiscussionGroup.prototype.showMsgOption= function(msgOption){
	if(msgOption=="shield"){
		return "不接收";
	}else if(msgOption=="no_reminder"){
		return "不提示";
	}else{
		return "正常";
	}
};

/**
 * 移去一个加入的讨论组
 * @return
 */
JoinedDiscussionGroup.prototype.remove = function(){
	this.outerContainer.remove();
};

/**
 * 设置信息
 * @param name
 * @param description
 * @return
 */
JoinedDiscussionGroup.prototype.settingInfo = function(name,description){
	this.discussionGroupInfo.name = name;
	this.name.html(name);
};

/**
 * 消息分类
 * @param data
 * @return
 */
function ChatMsgCategory(data,mainPlane){
	//消息列表面板
	this.mainPlane = mainPlane;
	if(data.type == "PrivateChat"){
		//消息分类ID
		this.id = data.senderId;
	}else{
		this.id = data.dstId;
	}
	//分类类型
	this.type = data.type;
	//消息发送者
	this.sender = {uid:data.senderId,avatar:data.senderAvatar,name:data.senderName};
	this.data = data;
	this.msgContainer = $("<li class=\"newsLi\"></li>");
	this.avatarContainer = $("<a href=\"javascript:;\" class=\"newsUserPhoto\"></a>");
	this.avatar = $("<img src=\""+baseUrl+data.senderAvatar+"\" />");
	this.msgItemContainer = $("<div class=\"newsLi_main\"></div>");
	this.senderContainer = $("<p></p>");
	this.senderName = $("<a class=\"newsUserName\" href=\"javascript:;\">"+data.senderName+"</a>")
	this.time = $("<span class=\"newsTime\">"+data.time+"</span>");
	this.summary = $("<a href=\"javascript:;\" class=\"newsUserSay\">"+data.message+"</a>");
	this.ignoreContainer = $("<p class=\"newsLi_right\"></p>");
	this.ignoreBtn = $("<a href=\"javascript:;\" class=\"gstIco16 gstIco16_delGray\"></a>");
	//其下的消息集合
	this.msgs = [];
	//创建DOM树
	this.build();
};

/**
 * 初始化
 * @return
 */
ChatMsgCategory.prototype.build = function(){
	this.mainPlane.msgListTab.append(this.msgContainer);
	this.msgContainer.append(this.avatarContainer);
	this.avatarContainer.append(this.avatar);
	this.msgContainer.append(this.msgItemContainer);
	this.msgItemContainer.append(this.senderContainer);
	
	this.senderContainer.append(this.senderName);
	this.senderContainer.append(this.time);
	
	this.msgItemContainer.append(this.summary);
	this.msgItemContainer.append(this.ignoreContainer);
	this.ignoreContainer.append(this.ignoreBtn);
	
	this.addListener();
};

/**
 * 绑定事件
 * @return
 */
ChatMsgCategory.prototype.addListener = function(){
	
	var chatMsgCategory = this;
	
	//绑定打开对话框
	this.msgContainer.bind("click",function(event){
		chatMsgCategory.mainPlane.talk.openDialog({uid:chatMsgCategory.id,name:chatMsgCategory.sender.name,avatar:chatMsgCategory.sender.avatar},chatMsgCategory.type);
	});
};

/**
 * 增加一条聊天信息到消息分类
 * @param chatMsgData
 * @return
 */
ChatMsgCategory.prototype.addChatMsg = function(chatMsgData){
	this.avatar.attr("src",baseUrl+chatMsgData.senderAvatar);
	this.senderName.html(chatMsgData.senderName);
	this.time.html(chatMsgData.time);
	this.summary.html(chatMsgData.message);
	this.msgs.push(chatMsgData);
};

/**
 * 消费掉所有消息
 * @return
 */
ChatMsgCategory.prototype.consumeMsg = function(){
	this.destroy();
	return this.msgs;
};

/**
 * 销毁本分类
 * @return
 */
ChatMsgCategory.prototype.destroy = function(){
	//移除掉talk持有的本分类的引用
	for(var i = this.mainPlane.talk.msgCategories.length-1;i>-1;i--){
		if(this.id==this.mainPlane.talk.msgCategories[i].id){
			this.mainPlane.talk.msgCategories.splice(i,1);
			break;
		}
	}
	//重新更新系统未读消息状态
	this.mainPlane.talk.updateUnReadMsgStatus();
	//DOM树中移除
	this.msgContainer.remove();
};

/**
 * 讨论组选择器
 * @param talk
 * @return
 */
function DiscussionGroupMemberChooser(talk){
	this.talk = talk;
	this.container = $("#discussionGroupChooser");
	/** 关闭层按钮 **/
	this.closeBtn = this.container.find(".gstLayer_close");
	/** 过滤输入框 **/
	this.searchInput = $("#discussionGroupChooser_search");
	/** 待选人员容器 **/
	this.readyChooseContainer = $("#readyChoose");
	/** 右移 **/
	this.chooseBtn = $("#chooseBtn");
	/** 左移 **/
	this.cancelBtn = $("#cancelBtn")
	/** 确定 **/
	this.confirmBtn = $("#confirmBtn");
	/** 已选择容器 **/
	this.choosenContainer = $("#choosenContainer");
	
	/** 当前关联的组ID **/
	this.groupId = null;
	
	this.addListener();
};

/**
 * 附加监听器
 * @return
 */
DiscussionGroupMemberChooser.prototype.addListener = function(){
	var chooser = this;
	//关闭选择框
	this.closeBtn.bind("click",function(event){
		chooser.close();
	});
	
	//右移选中
	this.chooseBtn.bind("click",function(event){
		var markedObjs = chooser.readyChooseContainer.find(".choPeo_liLight");
		if(markedObjs.size()>0){
			chooser.choosenContainer.append(markedObjs);
			markedObjs.show();
		}
	});
	
	//左移取消
	this.cancelBtn.bind("click",function(event){
		var markedObjs = chooser.choosenContainer.find(".choPeo_liLight");
		
		//放回到原先所属的分组
		if(markedObjs.size()>0){
			markedObjs.each(function(j,markObj){
				if(markObj){
					var userId = $(markObj).attr("userId");
					for(var i=0;i<chooser.talk.relationPlane.userGroups.length;i++){
						if(chooser.talk.relationPlane.userGroups[i].getChater(userId)!=null){
							chooser.readyChooseContainer.find("[groupId='"+chooser.talk.relationPlane.userGroups[i].id+"']").append($(markObj));
							continue;
						}
					}
				}
			});
		}
	});
	
	//搜索人员
	this.searchInput.bind("keyup",function(){
		var val = $(this).val();
		chooser.readyChooseContainer.find("li").each(function(i,userObj){
			var userElem = $(userObj);
			var name = userElem.text();
			if(val==""||name.indexOf(val)!=-1){
				userElem.show();
			}else{
				userElem.hide();
			}
		});
	});
	
	//提交
	this.confirmBtn.bind("click",function(event){
		var inviteeIds = [];
		var requestMsg = null;
		//填充邀请者数组
		chooser.choosenContainer.find("li").each(function(i,userObj){
			var inviteeId = $(userObj).attr("userId");
			inviteeIds.push(inviteeId);
		});
		
		//绑定提交事件
		if(chooser.groupId==null){
			requestMsg = chooser.talk.request.createDiscussionGroup("默认讨论组","默认讨论组",inviteeIds,"一起讨论");
		}else{
			requestMsg = chooser.talk.request.inviteJoinDiscussionGroup(chooser.groupId,inviteeIds,"一起讨论");
		}
		chooser.talk.sendRequest(requestMsg);
		chooser.close();
	});
};

/**
 * 显示讨论组成员选择器
 * @return
 */
DiscussionGroupMemberChooser.prototype.show = function(discussionGroupDialog){
	this.readyChooseContainer.empty();
	this.choosenContainer.empty();
	
	//如果是修改讨论组成员则加入原成员，否则仅加入发起人自己
	if(discussionGroupDialog){
		this.groupId = discussionGroupDialog.id;
		for(var i=0;i<discussionGroupDialog.members.length;i++){
			this.fillChoosenUser(discussionGroupDialog.members[i].memberData);
		}
	}else{
		this.groupId = null;
		this.fillChoosenUser({uid:this.talk.logonUser.uid,name:this.talk.logonUser.name,avatar:this.talk.logonUser.avatar,online:true});
	}
	
	//加入待选者
	for(var i=0;i<this.talk.relationPlane.userGroups.length;i++){
		this.fillUserGroup(this.talk.relationPlane.userGroups[i]);
	}
	
	this.talk.bgLayer.show();
	this.container.show();
};

/**
 * 关闭讨论组成员邀请选择器
 * @return
 */
DiscussionGroupMemberChooser.prototype.close = function(){
	this.talk.bgLayer.hide();
	this.container.hide();
	this.readyChooseContainer.empty();
	this.choosenContainer.empty();
};

/**
 * 填充一个用户组
 * @param userGroup
 * @return
 */
DiscussionGroupMemberChooser.prototype.fillUserGroup = function(userGroup){
	var header = $("<h3 class=\"choPeo_groupName\">"+userGroup.userGroupData.name+"</h3>");
	var userContainer = $("<ul groupId=\""+userGroup.id+"\" class=\"choPeo_list\"></ul>");
	this.readyChooseContainer.append(header);
	this.readyChooseContainer.append(userContainer);
	
	//打开或关闭用户组
	header.bind("click",function(event){
		header.toggleClass("choPeo_groupName_open");
		userContainer.toggle();
	});
	
	for(var i =0;i<userGroup.chaters.length;i++){
		//如果已经选中了，则不加入待选区
		if(this.beChoosen(userGroup.chaters[i].chaterData.uid)){
			continue;
		}
		var userObj = $("<li userId=\""+userGroup.chaters[i].chaterData.uid+"\" class=\"choPeo_li\"><span class=\"choPeo_img\"><img src=\""+baseUrl+userGroup.chaters[i].chaterData.avatar+"\" /></span> "+userGroup.chaters[i].chaterData.nickname+"</li>");
		userContainer.append(userObj);
		//标志不在线
		if(!userGroup.chaters[i].chaterData.online){
			userObj.addClass("choPeo_liNoline");
		}
		//做选中标志
		userObj.bind("click",function(event){
			$(this).toggleClass("choPeo_liLight");
		});
	}
};

/**
 * 填充已选中的（不允许移除）
 * @param memberData
 * @return
 */
DiscussionGroupMemberChooser.prototype.fillChoosenUser = function(memberData){
	var userObj = $("<li userId=\""+memberData.uid+"\" class=\"choPeo_li\"><span class=\"choPeo_img\"><img src=\""+baseUrl+memberData.avatar+"\" /></span> "+memberData.name+"</li>");
	this.choosenContainer.append(userObj);
	//标志不在线
	if(!memberData.online){
		userObj.addClass("choPeo_liNoline");
	}
};

/**
 * 是否已经选中
 * @param uid
 * @return
 */
DiscussionGroupMemberChooser.prototype.beChoosen = function(uid){
	return (this.choosenContainer.find("[userId='"+uid+"']").size()>0);
};

/**
 * @param elem 需要设置闪动的元素
 * @param speed 闪动速度 slow ,normal, fast
 * 
 * 闪动一个元素
 */
function Blink(elem,speedStr){
	this.elem = elem;
	this.timer = null;
	if(speedStr=="slow"){
		this.speed = 1000;
	}else if(speedStr=="fast"){
		this.speed = 200;
	}else{
		this.speed = 500;
	}
};

/**
 * 开始闪动
 * @return
 */
Blink.prototype.start = function(){
	this.stop();
	var blink = this;
	this.timer = window.setInterval(function(){
		blink.elem.toggleClass("elemMove");
	},this.speed);  
};

/**
 * 停止闪动
 * @return
 */
Blink.prototype.stop = function(){
	if(this.timer!=null){
		clearInterval(this.timer);
	}
	this.elem.removeClass("elemMove");
};

/**
 * websocket功能支持检测
 * @param url
 * @return
 */
function createWebsocket(url){
	if(window.MozWebSocket){
		return new MozWebSocket(url);
	}else if(window.WebSocket){
		return new WebSocket(url);
	}else{
		if(-[1,]){
			alert("您的浏览器flash版本不足，至少升级一下flash版本吧。下面将为你跳转到flash安装页面");
			location.href = baseUrl+"install/install_flash_player_ff.exe";
		}else{
			alert("您在使用IE系列浏览器！您的浏览器flash版本不足，至少升级一下flash版本吧！下面将为你跳转到flash安装页面");
			location.href = baseUrl+"install/flashplayer11_rc1_install_win_ax32_090611.exe";
		}
	}
};

/**
 * 验证聊天输入框
 * @param value
 * @return
 */
function checkChatInput(value){
	value = $.trim(value);
	return (value.length >= 1 && value.length <= 2000);
}

var talkObj = null;

$(function(){
	var socket = createWebsocket(wspath);
	talkObj = new Talk(socket,logonUser);
});
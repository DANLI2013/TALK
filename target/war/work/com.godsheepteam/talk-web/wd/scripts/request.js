/**
 * 所有请求的合集
 */
function Request(){};

/**
 * 创建用户分组
 * @param name
 * @return
 */
Request.prototype.createUserGroup = function(name){
	return $.toJSON({handlerName:"chaterHandler.createUserGroup",name:name});
};

/**
 * 移除用户分组
 * @param uid
 * @return
 */
Request.prototype.removeUserGroup = function(uid){
	return $.toJSON({handlerName:"chaterHandler.removeUserGroup",uid:uid});
};

/**
 * 改变用户分组
 * @param chaterId
 * @param prevUserGroupId
 * @param toUserGroupId
 * @return
 */
Request.prototype.changeUserGroup = function(chaterId,prevUserGroupId,toUserGroupId){
	return $.toJSON({handlerName:"chaterHandler.changeUserGroup",chaterId:chaterId,prevUserGroupId:prevUserGroupId,toUserGroupId:toUserGroupId});
};

/**
 * 拖用户进黑名单
 * @param chaterId
 * @param prevUserGroupId
 * @return
 */
Request.prototype.dragIntoBlacklist = function(chaterId,prevUserGroupId){
	return $.toJSON({handlerName:"chaterHandler.dragIntoBlacklist",chaterId:chaterId,prevUserGroupId:prevUserGroupId});
};

/**
 * 从黑名单移出用户
 * @param chaterId
 * @return
 */
Request.prototype.moveOutBlacklist = function(chaterId){
	return $.toJSON({handlerName:"chaterHandler.moveOutBlacklist",chaterId:chaterId});
};

/**
 * 群消息设置
 * @param chatGroupId
 * @param msgOption
 * @return
 */
Request.prototype.setChatGroupMsgOption = function(chatGroupId,msgOption){
	return $.toJSON({handlerName:"chaterHandler.setChatGroupMsgOption",chatGroupId:chatGroupId,msgOption:msgOption});
};

/**
 * 解散群
 * @param chatGroupId
 * @param words
 * @return
 */
Request.prototype.dissolveChatGroup = function(chatGroupId,words){
	return $.toJSON({handlerName:"chatGroupHandler.dissolve",chatGroupId:chatGroupId,words:words});
};

/**
 * 退出群
 * @param chatGroupId
 * @return
 */
Request.prototype.exitChatGroup = function(chatGroupId){
	return $.toJSON({handlerName:"chatGroupHandler.exit",chatGroupId:chatGroupId});
};

/**
 * T掉指定群成员
 * @param chatGroupId
 * @param memberId
 * @param words
 * @return
 */
Request.prototype.kickoutChatGroupMember = function(chatGroupId,memberId,words){
	return $.toJSON({handlerName:"chatGroupHandler.kickout",chatGroupId:chatGroupId,memberId:memberId,words:words});
};

/**
 * 授予用户群管理员权限
 * @param chatGroupId
 * @param invitationId
 * @return
 */
Request.prototype.addChatGroupManger = function(chatGroupId,invitationId,pass){
	return $.toJSON({handlerName:"chatGroupHandler.addManger",chatGroupId:chatGroupId,invitationId:invitationId,pass:pass});
};

/**
 * 移除用户群管理员权限
 * @param chatGroupId
 * @param managerId
 * @param words
 * @return
 */
Request.prototype.kickoutChatGroupManger = function(chatGroupId,managerId,words){
	return $.toJSON({handlerName:"chatGroupHandler.kickoutManager",chatGroupId:chatGroupId,managerId:managerId,words:words});
};

/**
 * 主动退出群管理员
 * @param chatGroupId
 * @return
 */
Request.prototype.removeChatGroupManger = function(chatGroupId){
	return $.toJSON({handlerName:"chatGroupHandler.removeManager",chatGroupId:chatGroupId});
};

/**
 * 邀请用户管理群
 * @param inviteeId
 * @param chatGroupId
 * @param words
 * @return
 */
Request.prototype.invite2ManageChatGroup = function(inviteeId,chatGroupId,words){
	return $.toJSON({handlerName:"chatGroupHandler.invite2Manage",inviteeId:inviteeId,chatGroupId:chatGroupId,words:words});
};

/**
 * 封禁群成员一定天数
 * @param chatGroupId
 * @param memberId
 * @param days
 * @param words
 * @return
 */
Request.prototype.gagChatGroupMember = function(chatGroupId,memberId,days,words){
	return $.toJSON({handlerName:"chatGroupHandler.gag",chatGroupId:chatGroupId,memberId:memberId,days:days,words:words});
};

/**
 * 处理群申请
 * @param chatGroupId
 * @param appId
 * @param pass
 * @param words
 * @return
 */
Request.prototype.dealWithChatGroupApp = function(chatGroupId,appId,pass,words){
	return $.toJSON({handlerName:"chatGroupHandler.dealWithApp",chatGroupId:chatGroupId,appId:appId,pass:pass,words:words});
};

/**
 * 获取指定群组详情
 * @param chatGroupId
 * @return
 */
Request.prototype.getChatGroupDetail = function(chatGroupId){
	return $.toJSON({handlerName:"chatGroupHandler.detail",chatGroupId:chatGroupId});
};

/**
 * 创建聊天信息
 * @param uid
 * @param nickname
 * @param message
 * @param dstId
 * @param type
 * @return
 */
Request.prototype.chatMsg = function(senderId,senderName,message,dstId,type){
	return $.toJSON({handlerName:"chatHandler.service",senderId:senderId,senderName:senderName,message:message,dstId:dstId,type:type});
};

/**
 * 注册到服务器
 * @param uid
 * @return
 */
Request.prototype.register = function(uid){
	return $.toJSON({handlerName:"registerHandler",uid:uid});
};

/**
 * 创建讨论组
 * @param name 讨论组名
 * @param description 讨论组说明
 * @param inviteeIds 邀请人ID集合
 * @param words 附言
 * @return
 */
Request.prototype.createDiscussionGroup = function(name,description,inviteeIds,words){
	return $.toJSON({handlerName:"discussionGroupHandler.create",name:name,description:description,inviteeIds:inviteeIds,words:words});
};

/**
 * 修改讨论组信息
 * @param discussionGroupId
 * @param name
 * @param description
 * @return
 */
Request.prototype.settingDiscussionGroupInfo = function(discussionGroupId,name,description){
	return $.toJSON({handlerName:"discussionGroupHandler.settingGroupInfo",discussionGroupId:discussionGroupId,name:name,description:description});
};

/**
 * 邀请加入讨论组
 * @param discussionGroupId 讨论组ID
 * @param inviteeIds 邀请人ID集合
 * @param words 附言
 * @return
 */
Request.prototype.inviteJoinDiscussionGroup = function(discussionGroupId,inviteeIds,words){
	return $.toJSON({handlerName:"discussionGroupHandler.invite2Join",discussionGroupId:discussionGroupId,inviteeIds:inviteeIds,words:words});
};

/**
 * 加入讨论组
 * @param discussionGroupId 讨论组ID
 * @param invitationId 邀请ID
 * @return
 */
Request.prototype.joinDiscussionGroup = function(discussionGroupId,invitationId,pass){
	return $.toJSON({handlerName:"discussionGroupHandler.join",discussionGroupId:discussionGroupId,invitationId:invitationId,pass:pass});
};

/**
 * 解散讨论组
 * @param discussionGroupId
 * @param words
 * @return
 */
Request.prototype.dissolveDiscussionGroup = function(discussionGroupId,words){
	return $.toJSON({handlerName:"discussionGroupHandler.dissolve",discussionGroupId:discussionGroupId,words:words});
};

/**
 * 退出讨论组
 * @param discussionGroupId
 * @return
 */
Request.prototype.exitDiscussionGroup = function(discussionGroupId){
	return $.toJSON({handlerName:"discussionGroupHandler.exit",discussionGroupId:discussionGroupId});
};

/**
 * T掉指定讨论组成员
 * @param discussionGroupId
 * @param memberId
 * @param words
 * @return
 */
Request.prototype.kickoutDiscussionGroupMember = function(discussionGroupId,memberId,words){
	return $.toJSON({handlerName:"discussionGroupHandler.kickout",discussionGroupId:discussionGroupId,memberId:memberId,words:words});
};

/**
 * 封禁讨论组成员一定天数
 * @param discussionGroupId
 * @param memberId
 * @param days
 * @param words
 * @return
 */
Request.prototype.gagDiscussionGroupMember = function(discussionGroupId,memberId,days,words){
	return $.toJSON({handlerName:"discussionGroupHandler.gag",discussionGroupId:discussionGroupId,memberId:memberId,days:days,words:words});
};

/**
 * 获取指定讨论组详情
 * @param discussionGroupId
 * @return
 */
Request.prototype.getDiscussionGroupDetail = function(discussionGroupId){
	return $.toJSON({handlerName:"discussionGroupHandler.detail",discussionGroupId:discussionGroupId});
};

/**
 * 讨论组消息设置
 * @param discussionGroupId
 * @param msgOption
 * @return
 */
Request.prototype.setDiscussionGroupMsgOption = function(discussionGroupId,msgOption){
	return $.toJSON({handlerName:"chaterHandler.setDiscussionGroupMsgOption",discussionGroupId:discussionGroupId,msgOption:msgOption});
};
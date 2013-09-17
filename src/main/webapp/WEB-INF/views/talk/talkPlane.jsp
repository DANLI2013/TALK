<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><%=application.getServletContextName()%></title>
<%@ include file="../common/base_scripts.inc"%>
<link href="${pageContext.request.contextPath}/wd/css/gstTalk2.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="${pageContext.request.contextPath}/wd/components/lib/jquery.json-2.3.min.js"></script>
<link href="${pageContext.request.contextPath}/wd/components/validation/style/err.css" rel="stylesheet" type="text/css" />
<link type="text/css" rel="stylesheet" href="${pageContext.request.contextPath}/wd/components/upload/style/default.css" />
<link type="text/css" rel="stylesheet" href="${pageContext.request.contextPath}/wd/components/upload/style/uploadify.css" />
<script type="text/javascript" src="${pageContext.request.contextPath}/wd/components/validation/validation.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/wd/scripts/request.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/wd/components/websocket/swfobject.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/wd/components/websocket/web_socket.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/wd/components/dateJs/WdatePicker.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/wd/components/upload/uploadify.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/wd/scripts/msg_record.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/wd/scripts/talk.js"></script>
<script type="text/javascript">
	var WEB_SOCKET_SWF_LOCATION = "${pageContext.request.contextPath}/wd/components/websocket/WebSocketMain.swf";
	var logonUser = {uid:"${logonUser.id}",name:"${logonUser.nickname}",avatar:"${logonUser.avatar.smallShowPath}"};
	var wspath = "${wspath}";
	
	$(function(){
	<c:forEach var="joinedChatGroup" items="${logonUser.joinedChatGroups}">
		talkObj.newChatGroup({uid:"${joinedChatGroup.joined.id}",name:"${joinedChatGroup.joined.name}",avatar:"${joinedChatGroup.joined.avatar}",description:"",msgOption:"${joinedChatGroup.msgOption}",currentUserIdentity:${joinedChatGroup.currentUserIdentity}})
	</c:forEach>
	<c:forEach var="joinedDiscussionGroup" items="${logonUser.joinedDiscussionGroups}">
		talkObj.newDiscussionGroup({uid:"${joinedDiscussionGroup.joined.id}",name:"${joinedDiscussionGroup.joined.name}",description:"",msgOption:"${joinedDiscussionGroup.msgOption}",currentUserIdentity:${joinedDiscussionGroup.currentUserIdentity}})
	</c:forEach>
	<c:forEach var="userGroup" items="${logonUser.userGroups}">
		talkObj.newUserGroup({uid:"${userGroup.id}",name:"${userGroup.name}"});
		<c:forEach var="member" items="${userGroup.members}">
			talkObj.addChater2UserGroup("${userGroup.id}",{uid:"${member.id}",nickname:"${member.name}",avatar:"${member.avatar}",online:${member.online}});
		</c:forEach>
	</c:forEach>
	<c:forEach var="ungroupChater" items="${clientBuildData.ungroupChaters}">
		talkObj.addChater2CommonGroup({uid:"${ungroupChater.id}",nickname:"${ungroupChater.name}",avatar:"${ungroupChater.avatar}",online:${ungroupChater.online}})
	</c:forEach>
		<c:forEach var="blacklistChater" items="${clientBuildData.blacklistChaters}">
		talkObj.addChater2BlacklistGroup({uid:"${blacklistChater.id}",nickname:"${blacklistChater.name}",avatar:"${blacklistChater.avatar}",online:${blacklistChater.online}})
	</c:forEach>
		});
	<c:if test="${param.flushParent=='1'}">
	if(window.opener){
		window.opener.location.href="${pageContext.request.contextPath}/";
		}
	</c:if>
</script>
</head>
<body>
	<div id="godContainer" class="gstTalk_gxz">
	<div id="relationPlane" class="gstTalk_baseBox">
		<!-- 头部 -->
   	  	<div class="baseBox_top">
        	<a href="javascript:;" class="topPhoto">
        		<img src="${pageContext.request.contextPath}/${logonUser.avatar.smallShowPath}" />
        	</a>
        	<span class="userName">${logonUser.nickname}</span>
        	<a href="${pageContext.request.contextPath}/chater/update.htm" target="_blank" class="userEdit">[设置]</a>
            <p class="baseBox_topRight">
            	<a id="sysMsgNoticeBox" href="javascript:;" class="gstBorn">
            		<b id="sysMsgNoticeSign" class="gstIco16 gstIco16_hornGray"></b>
            		<span id="sysMsgNoticeNum">0</span>
            	</a>
            	<a id="relationTabHandler" href="javascript:;" class="gsttNav gsttNav_after">
					<b class="gstIco20 gstIco20_nexus"></b> 关系
				</a>
            	<a id="msgListTabHandler" href="javascript:;" class="gsttNav" tabId="gstTalkMod_news">
					<b class="gstIco20 gstIco20_news"></b> 消息 <span id="msgNoticeBox_relation" style="display:none" class="newsNumber newsNumber_nav"></span>
				</a>
            </p>
    	</div>
        <!-- 内容 -->
        <div id="relationTab" class="gstTalk_tabMain" >
		<div class="nexus_title">
        	<p class="nexus_titleLeft">群组 <span class="groupA">[<a href="${pageContext.request.contextPath}/chatGroup/searchChatGroup.htm" target="_blank">查找群</a> | <a href="${pageContext.request.contextPath}/buildChatGroupApp/create.htm" target="_blank">创建群</a>]</span></p>
        	<p>全部用户</p>
        </div>
		<div class="main_baseBox">
        <!-- 内容左  -->
        <div class="main_bbLeft">
        <ul id="chatGroupContainer" class="groupList">
		</ul>
		
		<h3 id="discussionGroupHeader" class="ind_talkGroup_h3">讨论组  <a href="javascript:;" class="ind_talkGroup_h3Right">+ 新增</a></h3>
        <ul id="discussionGroupContainer" class="groupList">
         </ul>   
		</div>
		<!-- 内容右 -->
 		<div id="userGroupContainer" class="main_bbRight">
 			<ul id="userSearchResultContainer" class="peoleSearchList" style="display:none">
            </ul>
			<div class="main_bbRight_top">
        	<input class="gsttText1" type="text" />
        	</div>
 		</div>
 			<ul id="chooseGroupsMenu" class="addPeopleGroup_list"  >
                <li id="newGroupForm" class="addPeopleGroup_addBox">
                <input id="newGroupName" class="gsttText1" type="text" value="新分组"  style="width:60px;" validateType="lengthRange-1-10"/>
        		<input id="createNewGroupBtn" submit="true" class="gsttButton1" type="button" value="创建" />
                </li>
            </ul>
		<p class="qin"></p>
		</div>
		</div>
		<ul id="msgListTab" class="newsList gstTalk_tabMain">
        </ul>
	</div>
       
	<div id="msgReadPlane" class="gstTalk_baseBox talkMod">
		<div id="smileChoosePlane" class="gstLayer gstLayer_noPadding" style="display:none">
        	<a id="closeSmileChoosePlaneBtn" href="javascript:;" class="gstLayer_close"></a>
          	<div class="layerTab_bg"></div>
          	<c:forEach var="emoticonMap" items="${emoticons}" varStatus="status">
			<h3 class="layerTab_title layerTab_title${status.count} <c:if test='${status.count==1}'>layerTab_titleAfter</c:if>">表情${status.count}</h3>
   			<ul class="layerTab_list" <c:if test='${status.count==1}'>style="display:block;"</c:if>>
   	    		<c:forEach var="entry" items="${emoticonMap}" varStatus="status">
   	    		<li class="layerTab_li"><a smileSign="${entry.key}" class="layerTab_photo" href="javascript:;"><img src="${pageContext.request.contextPath}/wd/images/smile/${entry.value}" /></a></li>
   	    		</c:forEach>
       	 	</ul>
       	 	</c:forEach>
        </div>
    <!-- tab 切换 --> 
	<div id="msgReadPlaneFooter" class="talkTab_mod">
    	<div class="talkTab_box">
        <ul id="msgDialogTabs" class="talkTab_list">
        </ul>
        <div class="talkTab_modRight"><a href="javascript:;"></a><a href="javascript:;"></a><span id="msgNoticeBox_msg" style="display:none" class="newsNumber"></span></div>
        </div>
    </div>
    </div>
    <div id="discussionGroupChooser" class="gstLayer nopadding" style="display:none">
   		<a href="javascript:;" class="gstLayer_close"></a>
   		<div class="choosePeople" style="height:300px;">
        	<!-- 左 -->
            <div class="choPeo_left">
            	<p class="choPeo_search"><input id="discussionGroupChooser_search" class="choPeo_searchTxt" type="text" /></p>
                <div id="readyChoose" class="choPeo_listBox">
                </div>
            </div>
            <!-- 中 -->
            <div class="choPeo_middle">
            	<a id="chooseBtn" href="javascript:;" class="choPeo_button">添加<b class="gstIco16 gstIco16_whiteRight"></b></a>
            	<a id="cancelBtn" href="javascript:;" class="choPeo_button"><b class="gstIco16 gstIco16_whiteLeft"></b>删除</a>
                <a id="confirmBtn" href="javascript:;" class="choPeo_ok">确认</a>
            </div>
            <!-- 右 -->
          <div class="choPeo_right">
            	<h3>已选择</h3>
                <ul id="choosenContainer" class="choPeo_listOK">
                </ul>
            </div>
 	 	</div>
    </div>
	</div>  
</body>
</html>

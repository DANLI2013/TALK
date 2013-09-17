<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://gstTalk.com/businessel" prefix="be"%>
<%
double random = Math.random();
request.setAttribute("random",random);
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><%=application.getServletContextName()%>——${entity.name}群</title>
<%@ include file="../../common/base_scripts.inc"%>
<link href="${pageContext.request.contextPath}/wd/css/gstTalk_out.css" rel="stylesheet" type="text/css" />
<link type="text/css" rel="stylesheet"  href="${pageContext.request.contextPath}/wd/components/popup/layerStyle.css"/>
<script type="text/javascript" language="javascript" src="${pageContext.request.contextPath}/wd/components/popup/Popup.js"></script>
<link href="${pageContext.request.contextPath}/wd/components/validation/style/err.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="${pageContext.request.contextPath}/wd/components/validation/validation.js"></script>
<script language="Javascript" type="text/javascript">
	$(function(){
		var formValidator = new Validator("joinForm");
		new Popup({"width":"390","height":"200","title":"申请加入群组","targetId":"joinGroup","tigger":$("#joinBtn")});
	});
	</script>
</head>

<body>
<div class="gxz">
    <!-- 左列  -->
  <div class="GTOut_left">
    <%@ include file="../../common/logo.inc"%>
    </div>
    <!-- 下列 -->
    <div class="GT_loginDiv">
    	<div class="login_okInfo">
        	<p class="GT_photo100"><a href="javascript:;"><img src="${pageContext.request.contextPath}/${entity.avatar.showPath}?${random}" /></a></p>
            <span class="login_okInfoName">${entity.name}</span>
            <p class="login_okInfoTool">
            <c:choose>
            	<c:when test="${be:beChatGroupMember(entity,logonUser)}">
            	<a href="javascript:;" class="GTOut_groupLiAdd_gray">已加入</a>
            	</c:when>
            	<c:otherwise>
            	<a id="joinBtn" href="javascript:;" class="green">加入群组</a>
            	</c:otherwise>
            </c:choose>
            <c:if test="${be:beChatGroupManager(entity,logonUser)}">
            	<br />
            	<a href="${pageContext.request.contextPath}/chatGroup/update/${entity.id}.htm" class="green">群设置</a>
            </c:if>
            	<br />
            	${entity.description}
            </p>
        </div>
    </div>
</div>

<div id="joinGroup">
<form id="joinForm" action="${pageContext.request.contextPath}/chatGroup/app2Join.htm" method="post">
  <ul class="lsOne_list01">
    <li class="lsOne_li01">
      <label>附言：</label>
      <input type="hidden" name="chatGroupId" value="${entity.id}"/>
      <textarea cols="55" rows="6" name="words2Admin" validateType="required"></textarea>
    </li>
  </ul>
  <div class="buttonBox">
    <button submit="true" type="submit" class="lsOne_button">确认</button>
  </div>
</form>
</div>
<c:if test="${param.appSuccess}">
<script>
alert("申请已提交给群组管理员，请等待审核");
</script>
</c:if>
</body>
</html>

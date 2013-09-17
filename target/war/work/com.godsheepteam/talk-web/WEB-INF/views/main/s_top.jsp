<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
<link href="${pageContext.request.contextPath}/wd/backstage/css/base.css" rel="stylesheet" type="text/css" />
<%@ include file="../common/base_scripts.inc"%>
<link href="${pageContext.request.contextPath}/wd/backstage/css/s_top.css" rel="stylesheet" type="text/css" />
<script language="JavaScript" type="text/javascript" src="${pageContext.request.contextPath}/wd/scripts/s_top.js"></script>
</head>
<body>
<div class="gxz">
  <h1>》上帝的小绵羊工作室</h1>
  <div id="sddxmy_say">
      <!-- 小绵羊的说话内容 不超过60字 -->
      <blockquote>	  
	  ${logonUser.userName}，欢迎您的到来！
	  </blockquote>
	  <span></span>
  </div>
  <span class="top_tool"> 
     <a id="loginout"  href="${pageContext.request.contextPath}/logout" target="_parent" title="安全退出系统">退出</a> 
     <a id="help" href="help.html" target="_blank">帮助</a> 
  </span>
  <ul id="top_nav">
  <c:forEach var="topMenu" items="${menuStructure.topMenues}" varStatus="status">
  <c:choose>
  <c:when test="${status.index==0}">
   <li class="nav_this"><a href="${pageContext.request.contextPath}/layout/left.htm?menuId=${topMenu.id}" title="${topMenu.description}" target="left"><span>${topMenu.menuName}</span></a></li>
  </c:when>
  <c:otherwise>
   <li class="nav_other"><a href="${pageContext.request.contextPath}/layout/left.htm?menuId=${topMenu.id}" title="${topMenu.description}" target="left"><span>${topMenu.menuName}</span></a></li>
  </c:otherwise>
  </c:choose>
  </c:forEach>
  </ul>
</div>
</body>
</html>

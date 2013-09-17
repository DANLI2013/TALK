<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/functions" prefix="fn"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title> 
<link href="${pageContext.request.contextPath}/wd/backstage/css/base.css" rel="stylesheet" type="text/css" />
<%@ include file="../common/base_scripts.inc"%>
<script src="${pageContext.request.contextPath}/wd/backstage/scripts/base.js" type="text/javascript"></script>
<link href="${pageContext.request.contextPath}/wd/backstage/css/s_top.css" rel="stylesheet" type="text/css" />
<link href="${pageContext.request.contextPath}/wd/backstage/css/s_left.css" rel="stylesheet" type="text/css" />
<script language="JavaScript" type="text/javascript" src="${pageContext.request.contextPath}/wd/scripts/s_left.js"></script>
</head>
<body>
<div  class="protected" id="gxz">
 <c:forEach var="secondMenu" items="${currentMenu.childrenMenus}" varStatus="status">
  <h3 class="h3_before"><a href="javaScript:;">${secondMenu.menuName}</a></h3> 
  <ul>
  <c:forEach var="childMenu" items="${secondMenu.childrenMenus}" varStatus="secondStatus">
  <c:choose>
  <c:when test="${fn:contains(firstUrl,childMenu.linkUrl)}">
  <li class="link_after"><a href="${childMenu.linkUrl}" target="${childMenu.target}">${childMenu.menuName}</a></li>
  </c:when>
  <c:otherwise>
   <li class="link_before"><a href="${childMenu.linkUrl}" target="${childMenu.target}">${childMenu.menuName}</a></li>
  </c:otherwise>
  </c:choose>
  </c:forEach>
	<li class="link_footer"></li>
  </ul>
  </c:forEach>
  <div class="gss_box">
   <blockquote class="gs_say">
   您好，顶部的<a class="link_s" href="#">小绵羊</a>，
   会告诉您每次操作的结果，请多留意哦~
   </blockquote>
   <span class="gss_footer"></span>
 </div> 
</div>
</body>
</html>


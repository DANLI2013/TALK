<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>无标题文档</title>
<link href="${pageContext.request.contextPath}/wd/backstage/css/base.css" rel="stylesheet" type="text/css" />
<link href="${pageContext.request.contextPath}/wd/backstage/css/s_right.css" rel="stylesheet" type="text/css" />
<link href="${pageContext.request.contextPath}/wd/backstage/css/s_right_one.css" rel="stylesheet" type="text/css" />
<%@ include file="../common/base_scripts.inc"%>
<script src="${pageContext.request.contextPath}/wd/backstage/scripts/base.js" type="text/javascript"></script>
<script>
 $(document).ready(function(){
	$(".nav_box > li:even").addClass("nav_even");	
	$(".nav_box > li:odd").addClass("nav_odd");	
	$(".nav_box > li:last").css("margin-right","0");
	$(".nav_box > li:eq(0)").prepend("<span class='nav_NO'>1</span>");
	$(".nav_box > li:eq(1)").prepend("<span class='nav_NO'>2</span>");
	$(".nav_box > li:eq(2)").prepend("<span class='nav_NO'>3</span>");
	$(".nav_box > li:eq(3)").prepend("<span class='nav_NO'>4</span>");
	$(".nav_box > li:eq(4)").prepend("<span class='nav_NO'>5</span>");
 });
</script>
</head>
<body>

<div id="gxz">
    <div id="top">
	    <h1>快捷导航</h1>
		<span class="us">上帝的小绵羊工作室</span>
        </div>
    <!-- mind start -->
    <div class="fast_nav" >
      <ul class="nav_box">
      <c:forEach var="fastNavs" items="${customer.fastNavs}">
        <li><a href="${fastNavs.value}">${fastNavs.key}</a></li>
      </c:forEach>
      </ul>
      <ul class="link_box">
         <li><a href="help.html" target="_blank">?如何设置快捷导航</a></li>
         <li><a href="help.html" target="_blank">关于设置键</a></li>
         <li><a href="help.html" target="_blank">上帝的小绵羊</a></li>
      </ul>
      <!-- 华丽的分割线 -->
    <div class="qin"></div>
    <!-- 华丽的分割线 -->
    </div>
</div>

</body>
</html> 
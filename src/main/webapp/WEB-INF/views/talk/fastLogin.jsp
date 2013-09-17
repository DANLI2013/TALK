<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><%=application.getServletContextName()%></title>
<%@ include file="../common/base_scripts.inc"%>
<link href="${pageContext.request.contextPath}/wd/css/gstTalk2.css" rel="stylesheet" type="text/css" />
</head>

<body>
<div class="gstTalk_gxz">	
	<div class="gstTalk_baseBox">
	<h1 class="logo"><%=application.getServletContextName()%></h1>
	<form id="loginForm" action="${pageContext.request.contextPath}/chat/login.htm" target="chatPlane" method="post">
    <ul class="loginForm">
    	<li class="loginForm_li"><label class="loginForm_label">用户名：</label><input name="userName"  class="loginForm_txt" type="text" /></li>
        <li class="loginForm_li"><label class="loginForm_label">密码:</label><input name="password" class="loginForm_txt" type="password" /></li>
   	  	<li class="loginForm_li"><input class="button_black" type="submit" value="确认" /></li>
    </ul>
    </form>
    <!--  -->
    <div class="login_footer">
    <p>下列浏览器提供更华丽的效果</p>
    <a href="http://www.google.com/chrome?hl=zh-cn" target="_blank" class="browser browser_webkitC"></a>
    <a href="http://firefox.com.cn" target="_blank" class="browser browser_moz"></a>
    <a href="http://www.apple.com.cn/safari" target="_blank" class="browser browser_webkitS"></a>
    <a href="http://cn.opera.com" target="_blank" class="browser browser_o"></a>
    <a href="" target="_blank" class="copryRight">© godsheepteam</a>
    </div>
  </div>
</div>  
</body>
</html>

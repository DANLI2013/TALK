<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>欢迎使用酷毙的 <%=application.getServletContextName()%>！</title>
<%@ include file="common/base_scripts.inc"%>
<link href="${pageContext.request.contextPath}/wd/css/gstTalk_out.css" rel="stylesheet" type="text/css" />
<script>
$(function(){
	$("#loginForm").bind("submit",function(event){
		var chatWindow = window.open('','chatPlane','height=375,width=460,toolbar=no,menubar=no,scrollbars=no,location=no,status=no');
	});
});
</script>
</head>

<body>
<div class="gxz">
    <!-- 左列  -->
  <div class="GTOut_left">
	<%@ include file="common/logo.inc"%>
  </div>
    <!-- 下列 -->
    <div class="GT_loginDiv">
    	<!-- 登录 -->
    	<div class="GT_loginBox">
        <form id="loginForm" action="${pageContext.request.contextPath}/chat/login.htm" target="chatPlane" method="post">
        <h3 class="GT_loginBoxH3">登录</h3>
        <ul class="GT_loginFormList">
        	<li class="GT_loginFormLi"><label class="GT_loginFormLabel">\a用户名：</label>
        		<input name="userName" class="GT_loginFormText" type="text" />
        		<input name="flushParent" type="hidden" value="1"/>
        	</li>
        	<li class="GT_loginFormLi"><label class="GT_loginFormLabel">密码：</label><input name="password" class="GT_loginFormText" type="password" /></li>
        	<li class="GT_loginFormLiEnd"><input class="GT_buttonBlack" type="submit" value="登录" /></li>
        </ul>
        </form>
        </div>
        <!-- 注册 -->
        <div class="GT_zhuceDiv">
        	<span class="GT_zhuceBut"><a href="${pageContext.request.contextPath}/chater/register.htm">注册</a></span>
        	<p class="GT_zhuceSay gray">chat in any place.</p>
        </div>
    </div>
</div>
</body>
</html>

<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><%=application.getServletContextName()%>——我的主页</title>
<%@ include file="../../common/base_scripts.inc"%>
<link href="${pageContext.request.contextPath}/wd/css/gstTalk_out.css" rel="stylesheet" type="text/css" />
<script>
var chatWindow = null;
$(function(){
	$("#talkOpenBtn").bind("click",function(event){
		chatWindow = window.open('${pageContext.request.contextPath}/chat.htm','chatPlane','height=375,width=460,toolbar=no,menubar=no,scrollbars=no,location=no,status=no');
	});

	$("#logoutBtn").bind("click",function(event){
		chatWindow = window.open('','chatPlane','height=375,width=460,toolbar=no,menubar=no,scrollbars=no,location=no,status=no');
		chatWindow.close();
		window.location.href="${pageContext.request.contextPath}/logout";
	});
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
        	<p class="GT_photo100"><a href="javascript:;"><img src="${pageContext.request.contextPath}/${logonUser.avatar.showPath}" /></a></p>
            <span class="login_okInfoName">${logonUser.nickname}</span>
            <p class="login_okInfoTool">
            	<a id="talkOpenBtn" href="javascript:;" class="green">打开talk窗口</a> 
            	<br /> 
            	<a id="logoutBtn" href="javascript:;"  class="green">安全退出</a>
            </p>
        </div>

    </div>
</div>
</body>
</html>

<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>验证失败</title>
<%@ include file="common/base_scripts.inc"%>
<link href="${pageContext.request.contextPath}/wd/backstage/css/base.css" rel="stylesheet" type="text/css" />
<link href="${pageContext.request.contextPath}/wd/backstage/css/warning.css" rel="stylesheet" type="text/css" />
<script>
$(function(){
	$("#relogin").click(function(){
			window.opener.location.href="${pageContext.request.contextPath}/";
			window.close();
		});
});
</script>
</head>
<body>
<div id="gxz">
   <div id="warning"></div>
   <div id="warning_text">
   <h1>友情提示</h1>
      <p>
      验证失败，请检查你的用户名和密码是否输入正确
      </p>
      <ol>
        <li><a id="relogin" href="javascript:;">重新登录</a></li>
     </ol>
   </div>
</div>
</body>
</html>

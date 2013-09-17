<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%
double random = Math.random();
request.setAttribute("random",random);
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><%=application.getServletContextName()%>——我的主页</title>
<%@ include file="../../common/base_scripts.inc"%>
<link href="${pageContext.request.contextPath}/wd/css/gstTalk_out.css" rel="stylesheet" type="text/css" />
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
            <span class="login_okInfoName">${entity.nickname}</span>
            <p class="login_okInfoTool">
            	<a href="javascript:;" class="green">${entity.sex}</a> 
            	<br />
            	${entity.description}
            </p>
        </div>

    </div>
</div>
</body>
</html>

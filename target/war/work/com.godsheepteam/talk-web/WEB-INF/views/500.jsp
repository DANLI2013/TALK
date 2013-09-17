<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>錯誤</title>
<%@ include file="common/base_scripts.inc"%>
<link href="${pageContext.request.contextPath}/wd/backstage/css/base.css" rel="stylesheet" type="text/css" />
<link href="${pageContext.request.contextPath}/wd/backstage/css/warning.css" rel="stylesheet" type="text/css" />
</head>

<body>

<div id="gxz">

   <div id="warning">
   </div>
   
   <div id="warning_text">
   <h1>友情提示</h1>
      <p>
      ${message}
      <c:if test="${empty message}">
				( ˇˍˇ )出错了，很遗憾...<br/>
			服务器脆弱的心脏没能承受起您猛烈的点击！<br/>
			</c:if>
      </p>
      <ol>
         <li><a href="logout">注销重登陆</a></li>
     </ol>
     <p id="close"><a href="JavaScript:history.go(-1);">返回上页</a></p>
   </div>
   
</div>
</body>
</html>

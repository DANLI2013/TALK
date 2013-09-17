<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><%=application.getServletContextName()%>——申请创建新群组</title>
<%@ include file="../../common/base_scripts.inc"%>
<link href="${pageContext.request.contextPath}/wd/css/gstTalk_out.css" rel="stylesheet" type="text/css" />
<link href="${pageContext.request.contextPath}/wd/components/validation/style/err.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="${pageContext.request.contextPath}/wd/components/validation/validation.js"></script>
<script type="text/javascript">
$(function(){
	new Validator("buildChatGroupApp");
});
</script>
</head>

<body>
<div class="gxz">
    <!-- 左列  -->
  	<div class="GTOut_left">
    	<%@ include file="../../common/logo.inc"%>
    </div>
    <!-- 右列 -->
    <div class="GTOut_right">
    <h3 class="GTOut_rightH3">创建组</h3>
    <div class="GTOut_rightStepDiv">
    	<span class="GTOut_rightStep GTOut_rightStepNow">1.基本信息</span>
        <span class="GTOut_rightStep">2.上传头像</span>
        <span class="GTOut_rightStep GTOut_rightStepEnd">3.完成</span>
    </div>
    <form id="buildChatGroupApp" action="${pageContext.request.contextPath}/buildChatGroupApp/create.htm" method="post">
    <ul class="GTOut_formList">
    <spring:bind path="buildChatGroupApp.title">
    	<li class="GTOut_formLi"><label class="GTOut_formLabel">群组名称：</label>
    	  <input name="${status.expression}" class="GTOut_formText" type="text" validateType="lengthRange-1-100" value="${status.value}"/>
    	</li>
    </spring:bind>
    <spring:bind path="buildChatGroupApp.description">
        <li class="GTOut_formLi">
        	<label class="GTOut_formLabel">群组介绍：</label>
        	<textarea name="${status.expression}" validateType="lengthRange-1-500" class="GTOut_formTextarea">${status.value}</textarea>
        </li>
    </spring:bind>
    <spring:bind path="buildChatGroupApp.words2Admin">
        <li class="GTOut_formLi">
        	<label class="GTOut_formLabel">申请理由：</label>
        	<textarea name="${status.expression}" validateType="lengthRange-1-500" class="GTOut_formTextarea">${status.value}</textarea>
        </li>
    </spring:bind>
        <li class="GTOut_formLi"><input class="GT_buttonBlack" value="确 认" type="submit" submit="true"/></li>
    </ul>
    </form>
    </div>
</div>
</body>
</html>

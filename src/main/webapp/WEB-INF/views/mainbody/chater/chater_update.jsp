<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><%=application.getServletContextName()%>——修改个人设置</title>
<%@ include file="../../common/base_scripts.inc"%>
<link href="${pageContext.request.contextPath}/wd/css/gstTalk_out.css" rel="stylesheet" type="text/css" />
<link href="${pageContext.request.contextPath}/wd/components/validation/style/err.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="${pageContext.request.contextPath}/wd/components/validation/validation.js"></script>
<script type="text/javascript">
$(function(){
	new Validator("chater");
	$("input[name='sex'][value='${logonUser.sex}']").attr("checked",true);
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
    <h3 class="GTOut_rightH3">个人设置</h3>
    <div class="GTOut_rightTabDiv">
    	<a href="javascript:;" class="GTOut_rightTab GTOut_rightTabNow">基本信息</a><b class="GTOut_rightTabLine">|</b>
        <a href="${pageContext.request.contextPath}/chater/goUploadAvatar.htm" class="GTOut_rightTab ">修改头像</a><b class="GTOut_rightTabLine">|</b>
        <a href="${pageContext.request.contextPath}/chater/changePwd.htm" class="GTOut_rightTab ">修改密码</a>
    </div>
    <form id="chater" action="${pageContext.request.contextPath}/chater/update.htm" method="post">
    <ul class="GTOut_formList">
    	<li class="GTOut_formLi">
        	<label class="GTOut_formLabel">呢称(暂不能修改)：</label>
    	  	<input class="GTOut_formText" type="text" readonly value="${chater.nickname}"/>
    	</li>
    	<spring:bind path="chater.sex">
        <li class="GTOut_formLi">
        	<label class="GTOut_formLabel">性别：</label> 
        	<label class="GTOut_formLabeRadio"><input name="${status.expression}" type="radio" checked value="男"/>男</label>
            <label class="GTOut_formLabeRadio"><input name="${status.expression}" type="radio" value="女"/>女</label>
            <label class="GTOut_formLabeRadio"><input name="${status.expression}" type="radio" value="保密"/>保密</label>
        </li>
        </spring:bind>
        <spring:bind path="chater.description">
        <li class="GTOut_formLi">
        	<label class="GTOut_formLabel">个人介绍：</label>
    	  	<textarea name="${status.expression}" class="GTOut_formTextarea" validateType="lengthRange-0-500">${status.value}</textarea>
    	</li>
    	</spring:bind>
        <li class="GTOut_formLi"><input class="GT_buttonBlack" value="确 认" type="submit" submit="true"/></li>
    </ul>
    </form>
    </div>
</div>
</body>
</html>

<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><%=application.getServletContextName()%>——开始注册</title>
<%@ include file="../../common/base_scripts.inc"%>
<link href="${pageContext.request.contextPath}/wd/css/gstTalk_out.css" rel="stylesheet" type="text/css" />
<script language="JavaScript" type="text/javascript" src="${pageContext.request.contextPath}/dwr/engine.js"></script>
    <script language="JavaScript" type="text/javascript" src="${pageContext.request.contextPath}/dwr/interface/securityAjaxService.js"></script>
<link href="${pageContext.request.contextPath}/wd/components/validation/style/err.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="${pageContext.request.contextPath}/wd/components/validation/validation.js"></script>
<script type="text/javascript">
function checkUserNameUnique() {
	var isExist = true;
	securityAjaxService.userNameIsExist($("#userName").val(), function(data) {
		isExist = data;
	});
	var result = new ValidateResult();
	result.isPass = !isExist;
	result.message = "您的用户名已被注册过，请更换！";
	return result;
}

$(function(){
	dwr.engine.setAsync(false);
	new Validator("chater");
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
    <h3 class="GTOut_rightH3">注册</h3>
    <div class="GTOut_rightStepDiv">
    	<span class="GTOut_rightStep GTOut_rightStepNow">1.创建用户</span>
        <span class="GTOut_rightStep">2.上传头像</span>
        <span class="GTOut_rightStep GTOut_rightStepEnd">3.完成</span>
    </div>
    <form id="chater" action="${pageContext.request.contextPath}/chater/register.htm" method="post">
    <ul class="GTOut_formList">
    <spring:bind path="chater.userName">
    	<li class="GTOut_formLi"><label class="GTOut_formLabel">用户名：</label>
    	  <input id="userName" class="GTOut_formText" type="text" name="${status.expression}" method="blur" noRepeatCheck="checkUserNameUnique"  validateType="lengthRange-1-10|checkUserNameUnique" value="${status.value}"/>
    	</li>
    </spring:bind>
    <spring:bind path="chater.password">
        <li class="GTOut_formLi"><label class="GTOut_formLabel">密码：</label>
    	  <input id="pwd" class="GTOut_formText" type="password" name="${status.expression}" validateType="lengthRange-5-10"/>
    	</li>
    </spring:bind>
        <li class="GTOut_formLi"><label class="GTOut_formLabel">重复密码：</label>
    	  <input id="rePwd" class="GTOut_formText" type="password" validateType="equals-pwd|lengthRange-5-10"/>
    	</li>
    <spring:bind path="chater.sex">
        <li class="GTOut_formLi">
        	<label class="GTOut_formLabel">性别：</label> 
        	<label class="GTOut_formLabeRadio"><input type="radio" name="${status.expression}" value="男" checked/>男</label>
            <label class="GTOut_formLabeRadio"><input type="radio" name="${status.expression}" value="女"/>女</label>
            <label class="GTOut_formLabeRadio"><input type="radio" name="${status.expression}" value="保密"/>保密</label>
        </li>
	</spring:bind>
	<spring:bind path="chater.description">
        <li class="GTOut_formLi">
        	<label class="GTOut_formLabel">个人说明：</label>
        	<textarea name="${status.expression}" validateType="lengthRange-1-500" class="GTOut_formTextarea">${status.value}</textarea>
        </li>
    </spring:bind>
        <li class="GTOut_formLi"><input class="GT_buttonBlack" value="确 认" type="submit" submit="true" /></li>
    </ul>
    </form>
    </div>
</div>
</body>
</html>

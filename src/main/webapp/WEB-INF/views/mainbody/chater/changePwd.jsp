<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><%=application.getServletContextName()%>——修改个人密码</title>
<%@ include file="../../common/base_scripts.inc"%>
<link href="${pageContext.request.contextPath}/wd/css/gstTalk_out.css" rel="stylesheet" type="text/css" />
<link href="${pageContext.request.contextPath}/wd/components/validation/style/err.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="${pageContext.request.contextPath}/wd/components/validation/validation.js"></script>
<script language="JavaScript" type="text/javascript" src="${pageContext.request.contextPath}/dwr/engine.js"></script>
<script language="JavaScript" type="text/javascript" src="${pageContext.request.contextPath}/dwr/interface/securityAjaxService.js"></script>
<script type="text/javascript">

function checkPwdCorrect(){
	var isExist = true;
	securityAjaxService.passwordIsExist($("#oldPwd").val(), function(data) {
		isExist = data;
	});
	var result = new ValidateResult();
	result.isPass = isExist;
	result.message = "原始密码不正确！";
	return result;
}

$(function() {
	dwr.engine.setAsync(false);
	var formValidator = new Validator("pwdForm");
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
    	<a href="${pageContext.request.contextPath}/chater/update.htm" class="GTOut_rightTab">基本信息</a><b class="GTOut_rightTabLine">|</b>
        <a href="${pageContext.request.contextPath}/chater/goUploadAvatar.htm" class="GTOut_rightTab ">修改头像</a><b class="GTOut_rightTabLine">|</b>
        <a href="javascript:;" class="GTOut_rightTab GTOut_rightTabNow">修改密码</a>
    </div>
    <form id="pwdForm" action="${pageContext.request.contextPath}/chater/changePwd.htm" method="post">
    <ul class="GTOut_formList">
    	<li class="GTOut_formLi">
        	<label class="GTOut_formLabel">旧密码：</label>
    	  	<input class="GTOut_formText" type="text" id="oldPwd" keyup="false" validateType="lengthRange-5-10|checkPwdCorrect"/>
    	</li>
        <li class="GTOut_formLi">
        	<label class="GTOut_formLabel">新密码：</label>
    	  	<input class="GTOut_formText" type="text" id="newPwd" name="newPwd" validateType="lengthRange-5-10"/>
    	</li>
        <li class="GTOut_formLi">
        	<label class="GTOut_formLabel">重复新密码：</label>
    	  	<input class="GTOut_formText" type="text" id="reNewPwd" validateType="equals-newPwd|lengthRange-5-10"/>
    	</li>
        <li class="GTOut_formLi"><input class="GT_buttonBlack" value="确 认" type="submit" submit="true" /></li>
    </ul>
    </form>
    </div>
</div>
</body>
</html>

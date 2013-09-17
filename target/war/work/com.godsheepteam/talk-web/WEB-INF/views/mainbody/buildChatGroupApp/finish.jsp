<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><%=application.getServletContextName()%>——申请完成！</title>
<%@ include file="../../common/base_scripts.inc"%>
<link href="${pageContext.request.contextPath}/wd/css/gstTalk_out.css" rel="stylesheet" type="text/css" />
</head>

<body>
<div class="gxz">
    <!-- 左列  -->
  	<div class="GTOut_left">
    	<%@ include file="../../common/logo.inc"%>
    </div>
    <!-- 右列 -->
    <div class="GTOut_right">
    <h3 class="GTOut_rightH3">创建群组</h3>
    <div class="GTOut_rightStepDiv">
    	<span class="GTOut_rightStep ">1.基本信息</span>
        <span class="GTOut_rightStep">2.上传头像</span>
        <span class="GTOut_rightStep GTOut_rightStepEnd GTOut_rightStepNow">3.完成</span>
    </div>
    <div class="okTextBox">${logonUser.nickname}：<br /> 你<span class="orange">创建群组</span>的申请 已经提交成功，请耐心等待管理员审核。</div>
    <a href="${pageContext.request.contextPath}/" class="gray">返回首页 < </a>
    </div>
</div>
</body>
</html>

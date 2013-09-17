<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><%=application.getServletContextName()%>——群组设置</title>
<%@ include file="../../common/base_scripts.inc"%>
<link href="${pageContext.request.contextPath}/wd/css/gstTalk_out.css" rel="stylesheet" type="text/css" />
<link href="${pageContext.request.contextPath}/wd/components/validation/style/err.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="${pageContext.request.contextPath}/wd/components/validation/validation.js"></script>
<script type="text/javascript">
$(function(){
	new Validator("chatGroup");
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
    <h3 class="GTOut_rightH3">群组设置</h3>
    <div class="GTOut_rightTabDiv">
    	<a href="javascript:;" class="GTOut_rightTab GTOut_rightTabNow">基本信息</a><b class="GTOut_rightTabLine">|</b>
        <a href="${pageContext.request.contextPath}/chatGroup/goUploadCover/${chatGroup.id}.htm" class="GTOut_rightTab ">修改头像</a>
    </div>
    <form id="chatGroup" action="${pageContext.request.contextPath}/chatGroup/update.htm" method="post">
    <ul class="GTOut_formList">
    	<li class="GTOut_formLi"><label class="GTOut_formLabel">群组名称(暂不可修改)：</label>
    	  <input class="GTOut_formText" type="text" value="${chatGroup.name}" readonly/>
    	</li>
    <spring:bind path="chatGroup.description">
        <li class="GTOut_formLi">
        	<label class="GTOut_formLabel">群组介绍：</label>
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

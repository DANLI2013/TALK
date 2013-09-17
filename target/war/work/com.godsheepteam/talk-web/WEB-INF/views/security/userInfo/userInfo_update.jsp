<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>修改用户信息</title>
<%@ include file="../../common/base_scripts.inc"%>
<link href="${pageContext.request.contextPath}/wd/backstage/css/base.css" rel="stylesheet" type="text/css" />
<link href="${pageContext.request.contextPath}/wd/components/validation/style/err.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="${pageContext.request.contextPath}/wd/components/validation/validation.js"></script>
<link href="${pageContext.request.contextPath}/wd/backstage/css/s_right.css" rel="stylesheet" type="text/css" />
<link href="${pageContext.request.contextPath}/wd/backstage/css/xfy_form.css" rel="stylesheet" type="text/css" />
<link href="${pageContext.request.contextPath}/wd/components/transfer_selects/transfer_selects.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="${pageContext.request.contextPath}/wd/components/transfer_selects/TransferSelects.js"></script>
<script type="text/javascript">
	var roles = [];
	$(function(){
		<c:forEach var="role" items="${roleInfos}">
	    roles.push(["${role.id}","${role.roleName}"]);
    	</c:forEach>
    	var transferSelect = new TransferSelects("roleIds",roles);
    	$("input[name='isEnabled'][value='${sessionScope.userInfo.isEnabled}']").attr("checked",true);
		new Validator("userInfo");
	});
</script>
</head>
	<body>
		<div id="gxz">
			<div id="top">
				<h1>修改用户信息</h1>
			</div>
			<span class="toUser"> <b>用户说明:请输入注册用户的详细信息。</b> <br />
				1、请按照本页面输入信息的格式提示，规范输入。 <br />
			</span>	
			<!-- form start -->
			<form id="userInfo" action="${pageContext.request.contextPath}/userInfo/create.htm" method="post">
			<fieldset class="xfy_form">
				<legend>填写用户信息</legend>
			<ul>
			<spring:bind path="userInfo.userName">
				<li>
					<label>用户名<b class="nan">*</b></label>
					<input class="xfy_text_before" name="${status.expression}" type="text" validateType="lengthRange-1-20" value="${status.value}"/>
					<span class="hlight">${status.errorMessage}</span>
				</li>
			</spring:bind>
			<spring:bind path="userInfo.email">
				<li>
					<label>Email</label>
					<input type="text" name="${status.expression}" class="xfy_text_before" validateType="email" value="${status.value}"/>
					<span class="hlight">${status.errorMessage}</span>
				</li>
			</spring:bind>
				<li>
					<label>角色<b class="nan">*</b></label>
					<select id="roleIds" name="roleIds" multiple="multiple" class="formStyleOne_selectM" validateType="required" method="transfer">
          			<c:forEach var="role" items="${userInfo.roles}">
               		<option value="${role.id}" selected="selected">${role.roleName}</option>
           			</c:forEach>
          			</select>
          			<p class="qin"></p>
				</li>
			<spring:bind path="userInfo.isEnabled">
				<li>
					<label>是否启用</label>
					<input name="${status.expression}" type="radio" value="true" checked="checked"/>启用
     				<input name="${status.expression}" type="radio" value="false"/>禁用
					<span class="hlight">${status.errorMessage}</span>
				</li>
			</spring:bind>
				<li>
					<label>&nbsp;</label>
					<input type="submit" class="xfy_button_before" submit="true" linkOut="true" value="提交" />
					<input type="button" class="xfy_button_before" linkOut="true" onclick="location.href='${pageContext.request.contextPath}/roleAndUrl/list.htm'" value="返回列表" />
				</li>
			</ul>
				</fieldset>
				</form>
		</div>
	</body>
</html>

<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>角色资源映射</title>
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
	    roles.push(["${role.authority}","${role.roleName}"]);
    	</c:forEach>
    	var transferSelect = new TransferSelects("roleIds",roles);
		new Validator("roleAndUrl");
		$("#roleAndUrl").submit(function () {
			var roles = "";
			var roleNames = "";
			$("#roleIds").find("option").each(function(i,option){
				roles +=option.value+",";
				roleNames +=$(option).html()+",";
				})
			if(roles!=""){
				$("#roles").val(roles.substring(0,roles.length-1));
				}
			if(roleNames!=""){
				$("#rolesDescription").val(roleNames.substring(0,roleNames.length-1)+"拥有访问权限");
				}
		});
	});
</script>
</head>
	<body>
		<div id="gxz">
			<div id="top">
				<h1>创建角色资源映射</h1>
			</div>
			<span class="toUser"> <b>用户说明:请定义新的权限和资源关系。</b> <br />
				1、请按照本页面输入信息的格式提示，规范输入。 <br /> 2、您可以为当前角色定义该角色可浏览的URL，支持正则表达式。 <br />
			</span>	
			<!-- form start -->
			<form id="roleAndUrl" action="${pageContext.request.contextPath}/roleAndUrl/create.htm" method="post">
			<fieldset class="xfy_form">
				<legend>填写角色资源映射信息</legend>
			<ul>
			<spring:bind path="roleAndUrl.url">
				<li>
					<label>url<b class="nan">*</b></label>
					<input class="xfy_text_before" name="${status.expression}" type="text" validateType="required" value="${status.value}"/>
					<span class="hlight">${status.errorMessage}</span>
				</li>
			</spring:bind>
			<spring:bind path="roleAndUrl.urlDescription">
				<li>
					<label>URL描述<b class="nan">*</b></label>
					<input class="xfy_text_before" name="${status.expression}" type="text" validateType="required" value="${status.value}"/>
					<span class="hlight">${status.errorMessage}</span>
				</li>
			</spring:bind>
			<spring:bind path="roleAndUrl.sequence">
				<li>
					<label>优先级</label>
					<input type="text" name="${status.expression}" class="xfy_text_before" validateType="beDigits" value="${status.value}"/>
					<span class="hlight">${status.errorMessage}</span>
				</li>
			</spring:bind>
				<li>
					<label>允许访问该url的角色<b class="nan">*</b></label>
					<select id="roleIds" multiple="multiple" class="formStyleOne_selectM" validateType="required" method="transfer">
          			</select>
          			<spring:bind path="roleAndUrl.roles">
					<input id="roles" name="${status.expression}" type="hidden" value="${status.value}"/>
					</spring:bind>
					<spring:bind path="roleAndUrl.rolesDescription">
          			<input id="rolesDescription" name="${status.expression}" type="hidden" value="${status.value}"/>
          			</spring:bind>
          			<p class="qin"></p>
				</li>
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

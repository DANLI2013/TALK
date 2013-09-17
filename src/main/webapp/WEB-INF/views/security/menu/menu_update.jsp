<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>修改菜单</title>
<%@ include file="../../common/base_scripts.inc"%>
<link href="${pageContext.request.contextPath}/wd/backstage/css/base.css" rel="stylesheet" type="text/css" />
<link href="${pageContext.request.contextPath}/wd/components/validation/style/err.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="${pageContext.request.contextPath}/wd/components/validation/validation.js"></script>
<link href="${pageContext.request.contextPath}/wd/backstage/css/s_right.css" rel="stylesheet" type="text/css" />
<link href="${pageContext.request.contextPath}/wd/backstage/css/xfy_form.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="${pageContext.request.contextPath}/wd/components/select/SheepSelect.js"></script>
<script type="text/javascript">
	var parentMenus = [];
	<c:forEach var="parentMenu" items="${parentMenus}">
	parentMenus.push(["${parentMenu.menuName}","${parentMenu.id}"]);
	</c:forEach>
	$(function(){
	SheepSelect.createAll();
	new Validator("menu");
});
</script>
</head>
	<body>
		<div id="gxz">
			<div id="top">
				<h1>修改菜单</h1>
			</div>
			<span class="toUser"> <b>用户说明:请输入菜单的详细信息。</b> <br />
				1、请按照本页面输入信息的格式提示，规范输入。 <br /> 2、您可以为当前菜单选择父菜单，不选择将默认当前菜单为顶级菜单。 <br />
			</span>	
			<!-- form start -->
			<form id="menu" action="${pageContext.request.contextPath}/menu/create.htm" method="post">
			<fieldset class="xfy_form">
				<legend>填写菜单信息</legend>
			<ul>
			<spring:bind path="menu.menuName">
				<li>
					<label>菜单名称<b class="nan">*</b></label>
					<input class="xfy_text_before" name="${status.expression}" type="text" validateType="required" value="${status.value}"/>
					<span class="hlight">${status.errorMessage}</span>
				</li>
			</spring:bind>
			<spring:bind path="menu.linkUrl">
				<li>
					<label>菜单对应的URL<b class="nan">*</b></label>
					<input class="xfy_text_before" name="${status.expression}" type="text" validateType="required" value="${status.value}"/>
					<span class="hlight">${status.errorMessage}</span>
				</li>
			</spring:bind>
				<li>
					<label>父菜单：<b class="nan">*</b></label>
					<input id="parentMenuId" name="parentMenuId" class="xfy_text_before" SheepType="select" method="sheepselect" optionarray="parentMenus" type="text" realValue="${menu.parentMenu.id}"/>
					<span class="hlight">${status.errorMessage}</span>
				</li>
			<spring:bind path="menu.showOrder">
				<li>
					<label>菜单序号：</label>
					<input type="text" name="${status.expression}" class="xfy_text_before" validateType="beDigits" value="${status.value}"/>
					<span class="hlight">${status.errorMessage}</span>
				</li>
			</spring:bind>
			<spring:bind path="menu.target">
				<li>
					<label>目标：</label>
					<input type="text" name="${status.expression}" class="xfy_text_before" value="${status.value}"/>
					<span class="hlight">${status.errorMessage}</span>
				</li>
			</spring:bind>
			<spring:bind path="menu.description">
				<li>
					<label>菜单描述：</label>
					<textarea class="xfy_textarea_before" name="${status.expression}">${status.value}</textarea>
					<span class="hlight">${status.errorMessage}</span>
				</li>
			</spring:bind>
				<li>
					<label>&nbsp;</label>
					<input type="submit" class="xfy_button_before" submit="true" linkOut="true" value="提交" />
					<input type="button" class="xfy_button_before" linkOut="true" onclick="location.href='${pageContext.request.contextPath}/menu/list.htm'" value="返回列表" />
				</li>
			</ul>
				</fieldset>
				</form>
		</div>
	</body>
</html>

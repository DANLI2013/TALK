<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@taglib prefix="spring" uri="http://www.springframework.org/tags"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>创建新角色</title>
<%@ include file="../../common/base_scripts.inc"%>
<link href="${pageContext.request.contextPath}/wd/backstage/css/base.css" rel="stylesheet" type="text/css" />
<link href="${pageContext.request.contextPath}/wd/components/validation/style/err.css" rel="stylesheet" type="text/css" />
<script type="text/javascript" src="${pageContext.request.contextPath}/wd/components/validation/validation.js"></script>
<link href="${pageContext.request.contextPath}/wd/backstage/css/s_right.css" rel="stylesheet" type="text/css" />
<link href="${pageContext.request.contextPath}/wd/backstage/css/xfy_form.css" rel="stylesheet" type="text/css" />
<script language="javaScript" src="${pageContext.request.contextPath}/wd/components/tree/MzTreeView12-pack.js"></script>
<script type="text/javascript">
$(function(){
new Validator("roleInfo");
});
</script>
</head>
	<body>
		<div id="gxz">
			<div id="top">
				<h1>创建新角色</h1>
			</div>
			<span class="toUser"> <b>用户说明:请输入角色的详细信息。</b> <br />
				1、请按照本页面输入信息的格式提示，规范输入。 <br /> 2、您可以为当前角色选择该角色可浏览的菜单列表。 <br />
			</span>	
			<!-- form start -->
			<form id="roleInfo" action="${pageContext.request.contextPath}/roleInfo/create.htm" method="post">
			<fieldset class="xfy_form">
				<legend>填写角色信息</legend>
			<ul>
			<spring:bind path="roleInfo.roleName">
				<li>
					<label>角色名<b class="nan">*</b></label>
					<input class="xfy_text_before" name="${status.expression}" type="text" validateType="lengthRange-1-20" value="${status.value}"/>
				</li>
			</spring:bind>
			<spring:bind path="roleInfo.authority">
				<li>
					<label>角色英文名<b class="nan">*</b></label>
					<input class="xfy_text_before" name="${status.expression}" type="text" validateType="lengthRange-5-20" value="${status.value}"/>
				</li>
			</spring:bind>
				<li>
					<label>角色菜单授权：<b class="nan">*</b></label>
					<div class="menuTree">
					<script type="text/javascript">
					window.tree = new MzTreeView("tree");
					tree.setIconPath("${pageContext.request.contextPath}/wd/components/tree/images/");
					tree.N["0_1"] = "T:菜单树状结构;ctrl:root;checked:1";
					<c:forEach var="menu" items="${allMenus}" varStatus="status">
					tree.N['<c:choose><c:when test="${menu.parentMenu==null}">1</c:when><c:otherwise>${menu.parentMenu.id}</c:otherwise></c:choose>_${menu.id}'] = "ctrl:menuIds;checked:0;T:${menu.menuName}";
					</c:forEach>
					tree.wordLine = false;
					document.write(tree.toString()); 
					tree.expandAll();
 					</script>
					</div>
					<p class="qin"></p>
				</li>
			<spring:bind path="roleInfo.description">
				<li>
					<label>角色描述：</label>
					<textarea class="xfy_textarea_before" name="${status.expression}">${status.value}</textarea>
				</li>
			</spring:bind>
				<li>
					<label>&nbsp;</label>
					<input type="submit" class="xfy_button_before" submit="true" linkOut="true" value="提交" />
					<input type="button" class="xfy_button_before" linkOut="true" onclick="location.href='${pageContext.request.contextPath}/roleInfo/list.htm'" value="返回列表" />
				</li>
			</ul>
				</fieldset>
				</form>
		</div>
	</body>
</html>

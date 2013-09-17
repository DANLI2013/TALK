<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>${entity.roleName}</title>
<%@ include file="../../common/base_scripts.inc"%>
<link href="${pageContext.request.contextPath}/wd/backstage/css/base.css" rel="stylesheet" type="text/css" />
<link href="${pageContext.request.contextPath}/wd/backstage/css/s_right.css" rel="stylesheet" type="text/css" />
<script language="javaScript" src="${pageContext.request.contextPath}/wd/components/tree/MzTreeView12-pack.js"></script>
</head>
	<body>
		<div id="gxz">
			<div id="top">
				<h1>角色信息</h1>
			</div>
			<span class="toUser"> 您好！本页用于展示菜单的详细信息。<br />
				小绵羊工作室温馨提示：避免直视电脑屏幕大于30分钟，请注意视力保健 </span>
			<!-- 华丽的分割线 -->
			<ul class="xfy_show_one">
				<li>
					<span class="xs_one_box"> 角色名： <span id="title"
						class="xs_one_content">${entity.roleName}</span> </span>
					<span class="xs_one_box"> 角色权限： <span class="xs_one_content">${entity.authority}</span>
					</span>
				</li>
				<li>
					可操作的菜单：
					<span class="xs_one_content">
						<div class="dtree">
						<script type="text/javascript">
						window.tree = new MzTreeView("tree");
						tree.setIconPath("${pageContext.request.contextPath}/wd/components/tree/images/");
						tree.N["0_1"] = "T:菜单树状结构;";
						<c:forEach var="menu" items="${entity.menus}" varStatus="status">
						tree.N['<c:choose><c:when test="${menu.parentMenu==null}">1</c:when><c:otherwise>${menu.parentMenu.id}</c:otherwise></c:choose>_${menu.id}'] = "T:${menu.menuName}";
						</c:forEach>
						tree.wordLine = false;
						document.write(tree.toString()); 
 						</script>
						</div> 
					</span>
				</li>

			</ul>
			<div class="qin"></div>
			<!-- 华丽的分割线 -->
			<span class="xs_one_text" id="content">
				<h5>角色描述：</h5> 
			${entity.description}
			</span>
			<!-- 华丽的分割线 -->
			<a id="xfy_return" href="javascript:history.go(-1);"></a>
		</div>
	</body>
</html>

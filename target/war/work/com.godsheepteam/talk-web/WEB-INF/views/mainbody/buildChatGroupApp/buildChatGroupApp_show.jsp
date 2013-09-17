<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>${entity.title}</title>
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
				温馨提示：避免直视电脑屏幕大于30分钟，请注意视力保健 </span>
			<!-- 华丽的分割线 -->
			<ul class="xfy_show_one">
				<li>
					<span class="xs_one_box"> 群组名： <span id="title" class="xs_one_content">${entity.title}</span> </span>
					<span class="xs_one_box"> 申请人： <span class="xs_one_content">${entity.applicant.name}</span>
					</span>
				</li>
			</ul>
			<div class="qin"></div>
			<!-- 华丽的分割线 -->
			<span class="xs_one_text" id="content">
			<h5>群组描述：</h5> 
			${entity.description}
			</span>
			<span class="xs_one_text" id="content">
			<h5>申请人附言：</h5> 
			${entity.words2Admin}
			</span>
			<form id="dealWithForm" action="${pageContext.request.contextPath}/buildChatGroupApp/dealWith.htm" method="post">
			<fieldset class="xfy_form">
				<legend>处理本申请</legend>
			<ul>
				<li>
					<label>是否同意<b class="nan">*</b></label>
					<input type="hidden" name="appId" value="${entity.id}"/>
					<input type="radio" name="passing" value="true"/>同意
					<input type="radio" name="passing" value="false" checked/>拒绝
				</li>
				<li>
					<label>处理意见：</label>
					<textarea class="xfy_textarea_before" name="words"></textarea>
				</li>
				<li>
					<label>&nbsp;</label>
					<input type="submit" class="xfy_button_before" submit="true" linkOut="true" value="提交" />
					<input type="button" class="xfy_button_before" onclick="location.href='${pageContext.request.contextPath}/buildChatGroupApp/list.htm'" value="返回列表" />
				</li>
				</ul>
			</fieldset>
			</form>
		</div>
	</body>
</html>

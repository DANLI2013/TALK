<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<%@ include file="../../management_common/ListHeader.inc"%>
    <c:forEach var="obj" items="${page.objectList}">
     <tr>
	   <td><input title="选择本行" type="checkbox" name="entityIds" value="${obj.id}"/></td>
	   <td>${obj.sequence}</td>
	   <td>${obj.url}</td>
	   <td>${obj.urlDescription}</td>
	   <td>${obj.rolesDescription}</td>
	   <td>
	   <a href="javascript:SheepUtil.submitUrl('ListForm','${pageContext.request.contextPath}/roleAndUrl/update.htm?entityId=${obj.id}')" class="xfy_tt_make" linkOut="true"></a>
	   <a onclick="return CommonList.deleteColumn('${pageContext.request.contextPath}/roleAndUrl/delete.htm?entityId=${obj.id}',true)" href="javascript:;" class="xfy_tt_delete"></a>
	   </td>
	 </tr>
	</c:forEach>
<%@ include file="../../management_common/ListFooter.inc"%>

<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<%@ include file="../../management_common/ListHeader.inc"%>
    <c:forEach var="obj" items="${page.objectList}">
     <tr>
	   <td><input title="选择本行" type="checkbox" name="entityIds" value="${obj.id}"/></td>
	   <td>${obj.title}</td>
	   <td>${obj.description}</td>
	   <td>${obj.words2Admin}</td>
	   <td>${obj.applicant.name}</td>
	   <td>
	   <a href="javascript:SheepUtil.submitUrl('ListForm','${pageContext.request.contextPath}/buildChatGroupApp/show/${obj.id}.htm')" class="a_orange">我来处理</a>
	   </td>
	 </tr>
	</c:forEach>
<%@ include file="../../management_common/ListFooter.inc"%>

<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
	<h1 class="GT_logo">
    	<a href="${pageContext.request.contextPath}/">
    		<!-- <img src="img/gstTalk_out01.gif" /> -->
    		<%=application.getServletContextName()%>
    	</a>
    </h1>
    <p class="GT_leftP"><a href="${pageContext.request.contextPath}/" class="gray">© godsheepteam</a></p>
	<c:if test="${not empty logonUser}">
	<ul class="GTleftNav_list">
    	<li class="GTleftNav_li"><a href="${pageContext.request.contextPath}/chatGroup/searchChatGroup.htm">群组</a></li>
        <li class="GTleftNav_li"><a href="${pageContext.request.contextPath}/chater/update.htm">个人设置</a></li>
    </ul>
	</c:if>
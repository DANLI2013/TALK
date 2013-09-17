<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<!-- 信息与工具按钮 -->
      <div class="table_tool">
	    <span class="tt_left">
	     共有<strong>${page.maxPage}</strong>页<strong>${page.maxCount}</strong>条数据，每页
		 <select name="pageSize">
		 <option value="10">10</option>
		 <option value="20">20</option>
		 <option value="30">30</option>
		 <option value="40">40</option>
		 <option value="50">50</option>
		 <option value="70">70</option>
		 <option value="100">100</option>
		 </select>
		 <c:if test="${pageConfig.showDel}">
          <a href="javascript:;" class="deleteSelected">删除所选</a>
          </c:if>
          <c:if test="${pageConfig.showAdd}">
		  <a href="${pageContext.request.contextPath}/${pageConfig.pageUrl}/create.htm" linkOut="true">添加记录</a>
		 </c:if>
		</span>
	    
          <!-- 翻页 开始 -->
	    <ul class="page_box">
	     <li class="pb_button">
	   <c:if test="${page.intPage>1}">
	     <a href="javascript:SheepUtil.submitUrl('ListForm','${pageContext.request.contextPath}/${pageConfig.queryUrl}?intPage=1')" linkOut="true">首页</a>
	   </c:if>
	   <c:if test="${page.intPage<=1}">
	     <a href="javascript:;">首页</a>
	   </c:if>
	     </li>
	    
         <li class="pb_button">
         <c:if test="${page.intPage<page.maxPage}">
            <a href="javascript:SheepUtil.submitUrl('ListForm','${pageContext.request.contextPath}/${pageConfig.queryUrl}?intPage=${page.maxPage}')" linkOut="true">末页</a>
		 </c:if>
		<c:if test="${page.intPage>=page.maxPage}">
		    <a href="javascript:;">末页</a>
		</c:if>
         </li>
         
        <c:forEach var="pageRow" items="${page.pageRow}">
         <c:choose>
            <c:when test="${pageRow==page.intPage}">
              <li><span>${pageRow}</span></li>
            </c:when>
         <c:otherwise>
            <li><a href="javascript:SheepUtil.submitUrl('ListForm','${pageContext.request.contextPath}/${pageConfig.queryUrl}?intPage=${pageRow}')" linkOut="true">${pageRow}</a></li>
         </c:otherwise>
         </c:choose>
        </c:forEach>
	  </ul>
	  <!-- 翻页 开始 -->
  </div>
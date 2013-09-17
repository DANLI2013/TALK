<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://godsheepteam.com/function" prefix="sf"%>
<%@ taglib uri="http://tag.godsheepteam.com/jsp/core" prefix="sheep"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><%=application.getServletContextName()%>——寻找群组</title>
<%@ include file="../../common/base_scripts.inc"%>
<link href="${pageContext.request.contextPath}/wd/css/gstTalk_out.css" rel="stylesheet" type="text/css" />
</head>

<body>
<div class="gxz">
    <!-- 左列  -->
  	<div class="GTOut_left">
    	<%@ include file="../../common/logo.inc"%>
    </div>
    <!-- 右列 -->
    <div class="GTOut_right">
   	  <h3 class="GTOut_rightH3">群组</h3>
    	<div class="GTOut_groupTop">
    	<form id="searchForm" action="${pageContext.request.contextPath}/chatGroup/searchChatGroup.htm" method="post">
        	<input class="GTOut_groupSearchText" type="text" name="keyWords" value="${keyWords}"/>
        	<input class="GTOut_groupSearchBut" type="submit" value=" 搜 索 "/> 
        </form>
        	<a class="GTOut_groupCreate" href="${pageContext.request.contextPath}/buildChatGroupApp/create.htm">+创建组</a>
        	<p class="GTOut_groupSearchInfo">共找到 <b class="green">${searchResults.pageBean.maxCount}</b> 个群</p>
    	</div>
        
        <ul class="GTOut_groupList">
        <c:forEach var="hit" items="${searchResults.pageBean.objectList}" varStatus="status">
        	<li class="GTOut_groupLi">
            <p class="GTOut_groupLiPhoto">
            	<a href="${pageContext.request.contextPath}/chatGroup/show/${hit.data.id}.htm"><img src="${pageContext.request.contextPath}/${hit.data.avatar.showPath}" /></a>
            </p>
            <h5 class="GTOut_groupLiName">${hit.data.name}</h5>
            <p class="GTOut_groupLiTxt">
            ${sf:subStr(hit.data.description,30)}
            </p>
            </li>
         </c:forEach>
        </ul>
        
        <!-- 翻页 -->
        <sheep:pager linkUrl="${pageContext.request.contextPath}/chatGroup/searchChatGroup.htm?keyWords=${keyWords}" page="${searchResults.pageBean}"/>
  </div>
</div>
</body>
</html>

<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>${pageConfig.pageTitle}</title>
<%@ include file="../common/base_scripts.inc"%>
<link href="${pageContext.request.contextPath}/wd/backstage/css/base.css" rel="stylesheet" type="text/css" />
<link rel="stylesheet" type="text/css" href="${pageContext.request.contextPath}/wd/components/list/listStyleOne/css/listStyleOne.css"/>
<script language="JavaScript" type="text/javascript" src="${pageContext.request.contextPath}/wd/components/list/listStyleOne/js/listStyleOne.js"></script>
<script language="JavaScript" type="text/javascript" src="${pageContext.request.contextPath}/wd/components/list/listStyleOne/js/commonList.js"></script>
<script language="Javascript" type="text/javascript" src="${pageContext.request.contextPath}/wd/components/dateJs/WdatePicker.js"></script>

<script language="JavaScript" type="text/javascript">
var tableObj;
var commListObj;

$(function() {
	tableObj = new Table("${pageConfig.pageUrl}");
	commListObj = new CommonList("${pageContext.request.contextPath}","${pageConfig.pageUrl}");
	commListObj.pageSizeSelect.val("${page.pageSize}");
	commListObj.revertBack("${conditionInfo}");
});
</script>
</head>

<body>
<form id="ListForm" name="${pageContext.request.contextPath}/${pageConfig.queryUrl}" action="${pageContext.request.contextPath}/${pageConfig.queryUrl}" method="post">
<!-- 翻页所需参数 -->
<input id="caseHql" type="hidden" name="caseHql" value="${caseHql}" />
<input id="conditionInfo" type="hidden" name="conditionInfo" value="${conditionInfo}"/>
<input id="googleSize" type="hidden" name="googleSize" value="${googleSize}"/>
<input id="queryStatus" type="hidden" name="queryStatus" value="${queryStatus}"/>
<input id="taxisStatus" type="hidden" name="taxisStatus" value="${taxisStatus}"/>
<input id="taxisFieldName" type="hidden" name="taxisFieldName" value="${taxisFieldName}"/>

<div class="listStyleOne_box" id="gxz">
  <h1 class="formStyleTwo_h1">
    <p class="fstb_h1">${pageConfig.pageTitle}</p>
    <b class="fstb_left"></b><b class="fstb_right"></b></h1>
  <dl id="form_box" class="form_box">
	<dt class="dt_before"><a href="javascript:;">条件过滤( <input type="button" value=" " class="search_img"  /> 精确查找 )</a></dt>
	<dd>
	   <ul>
	   <c:forEach var="formList" items="${pageConfig.pageHeaderList}">
	       <c:if test="${formList.isJoined}">
	       <li class="table_form_box_li">
	        <label>${formList.showTitle}：<input group="${formList.fieldName}" type="hidden" value="${formList.fieldName}" condition="yes"/></label>
	          <select group="${formList.fieldName}" condition="yes">
				<option value="like">包含</option>
				<option value="=">=</option>
			<c:if test="${formList.comparable}">
				<option value="&gt">大于</option>
				<option value="&lt">小于</option>
			</c:if>
				</select>
	          <c:choose>
				<c:when test="${formList.isDate}">
					<input type="text" group="${formList.fieldName}" class="xfy_text_before date" condition="yes"/>
				</c:when>
				<c:otherwise>
					<input group="${formList.fieldName}" type="text" class="xfy_text_before" condition="yes"/>
				</c:otherwise>
			  </c:choose>
	      </li>
	      </c:if>
	    </c:forEach>
	    <div class="qin"></div> 
	   </ul>
	   <input id="xfy_serach" type="submit" class="xfy_button_before" value="开始查找" />
	   <input class="xfy_button_before" type="reset" value="重填" />
	   <input id="searchAll" type="button" class="xfy_button_before" value="查询全部" />
	   <div class="qin"></div> 
	</dd>
	</dl>
	 <%@ include file="ListTool.inc"%>
      <table  cellpadding="0" id="xfy_table" cellspacing="0" class="xfy_table">
      <tr>
	   <th width="16px"><input title="选择全部" type="checkbox" id="total"/></th>
       <c:forEach var="headerList" items="${pageConfig.pageHeaderList}">
			<th width="${headerList.tbWidth}">
			<c:choose>
			<c:when test="${taxisStatus&&headerList.isTaxis}">
			<a href="javascript:CommonList.sort('${pageContext.request.contextPath}/${pageConfig.queryUrl}?isTaxis=true','${headerList.fieldName}');" title="向上排序">
			<div class="xt_list_down">
			${headerList.showTitle}
			</div>
			</a>
			</c:when>
			<c:when test="${!taxisStatus&&headerList.isTaxis}">
			<a href="javascript:CommonList.sort('${pageContext.request.contextPath}/${pageConfig.queryUrl}?isTaxis=true','${headerList.fieldName}');" title="向下排序">
			<div class="xt_list_up">
			${headerList.showTitle}
			</div>
			</a>
			</c:when>
			<c:when test="${taxisStatus==null&&headerList.isTaxis}">
			<a href="javascript:CommonList.sort('${pageContext.request.contextPath}/${pageConfig.queryUrl}?isTaxis=true','${headerList.fieldName}');" title="向上排序">
			<div>
			${headerList.showTitle}
			</div>
			</a>
			</c:when>
			<c:otherwise>
			<div>
			${headerList.showTitle}
			</div>
			</c:otherwise>
			</c:choose>
			</th>
		</c:forEach>
     </tr>
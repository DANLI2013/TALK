<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title></title>
<link href="${pageContext.request.contextPath}/wd/backstage/css/base.css" rel="stylesheet" type="text/css" />
<%@ include file="../common/base_scripts.inc"%>
<link href="${pageContext.request.contextPath}/wd/backstage/css/s_top.css" rel="stylesheet" type="text/css" />
<link href="${pageContext.request.contextPath}/wd/backstage/css/s_button.css" rel="stylesheet" type="text/css" />
<script>
  var a = true
  function oc_left(){
  var cols = parent.document.getElementById("mind_box")
  var oc_button = document.getElementById("oc_button")
  if(a){
        cols.cols = "0,15px,*"
        oc_button.className = "open"
		a = false
  }
  else{
       cols.cols = "163px,15px,*"
       oc_button.className = "close"
	   a = true
  }
  }
</script>
</head>

<body>
<div id="oc_box">
  <span title="关闭/打开左栏" id="oc_button" class="close" onclick="oc_left()" >
  </span>
 </div>
</body>
</html>

<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%
double random = Math.random();
request.setAttribute("random",random);
%>

<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><%=application.getServletContextName()%>——更新个人头像</title>
<%@ include file="../../common/base_scripts.inc"%>
<link href="${pageContext.request.contextPath}/wd/css/gstTalk_out.css" rel="stylesheet" type="text/css" />
<link type="text/css" rel="stylesheet" href="${pageContext.request.contextPath}/wd/components/upload/style/default.css" />
<link type="text/css" rel="stylesheet" href="${pageContext.request.contextPath}/wd/components/upload/style/uploadify.css" />
<script type="text/javascript" src="${pageContext.request.contextPath}/wd/components/upload/swfobject.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/wd/components/upload/uploadify.min.js"></script>
<script type="text/javascript" src="${pageContext.request.contextPath}/wd/components/upload/upload.js"></script>
<script type="text/javascript">
	$(function(){
		var config = {
				"path" : "${pageContext.request.contextPath}/wd/components",
				"url" : "${pageContext.request.contextPath}/chater/uploadAvatar.htm;jsessionid=<%=session.getId()%>",
				"multi" : false,
				"num" : 1,
				"size" : 204800,
				"fileDesc" : "图片文件",
				"fileExt" : "*.jpg;*.JPG;*.png;*.PNG;*.bmp;*.BMP"
		};
		
		var uploadObj = bindingUpload(config,function(event,queueID,fileObj,response,data) {
		    if(response=="error"){
		        alert("文件上传失败，请重试！")
		        }else{
		        	if(data.fileCount<=0){
			        	alert("文件上传完毕！");
			        	location.href="${pageContext.request.contextPath}/chater/show/${logonUser.id}.htm";
			        	}
		            }
		    });
		});
	</script>
</head>

<body>
<div class="gxz">
    <!-- 左列  -->
  	<div class="GTOut_left">
        <%@ include file="../../common/logo.inc"%>
    </div>
    <!-- 右列 -->
    <div class="GTOut_right">
    <h3 class="GTOut_rightH3">个人设置</h3>
    <div class="GTOut_rightTabDiv">
    	<a href="${pageContext.request.contextPath}/chater/update.htm" class="GTOut_rightTab">基本信息</a><b class="GTOut_rightTabLine">|</b>
        <a href="javascript:;" class="GTOut_rightTab GTOut_rightTabNow">修改头像</a><b class="GTOut_rightTabLine">|</b>
        <a href="${pageContext.request.contextPath}/chater/changePwd.htm" class="GTOut_rightTab ">修改密码</a>
    </div>
    <form>
    <p class="GT_photo100"><a href="javascript:;"><img src="${pageContext.request.contextPath}/${logonUser.avatar.showPath}?${random}" /></a></p>
   	<div class="addPhoto_div"><input id="uploadify" name="uploads" type="file" /></div>
    <div id="uploadContainer" class="addPhoto_flash"></div>
    </form>
    </div>
</div>
</body>
</html>

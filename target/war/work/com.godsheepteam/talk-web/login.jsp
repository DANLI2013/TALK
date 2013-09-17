<%@ page contentType="text/html; charset=utf-8" language="java"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>GodSheepTeam</title>
<%@ include file="WEB-INF/views/common/base_scripts.inc"%>
<link href="${pageContext.request.contextPath}/wd/backstage/css/base.css" rel="stylesheet" type="text/css" />
<link href="${pageContext.request.contextPath}/wd/backstage/css/land.css" rel="stylesheet" type="text/css" />
<script>
$(function(){
  var w_width = $(window).width();
  var w_height = $(window).height();
  var m_width = $("#mind").width();
  var m_height = $("#mind").height();
  var left = (w_width-m_width)/2;
  var top = (w_height-m_height)/2;
  $("#mind").css({"top":top,"left":left});
  $("#footer").css("top",w_height-12);
  
  $(window).resize(function(){
  var w_width = $(window).width();
  var w_height = $(window).height();
  var m_width = $("#mind").width();
  var m_height = $("#mind").height();
  var left = (w_width-m_width)/2;
  var top = (w_height-m_height)/2;
  $("#mind").css({"top":top,"left":left});
  $("#footer").css("top",w_height-12);						
  });
});
</script>
	</head>
	<body>
		<h1>
			GodSheepTeam
		</h1>
		<div id="mind">
			<blockquote>
				<c:choose>
					<c:when test="${param.login_error==1}">
						<span style="color: #ff0000">用户名或密码错误！</span>
					</c:when>
					<c:otherwise>
     技术改变生活！
     </c:otherwise>
				</c:choose>
			</blockquote>
			<form action="${pageContext.request.contextPath}/login" method="post">
				<ul class="text_mind">
					<li>
						<label>
							账号：
						</label>
						<input name="j_username" class="xfy_text_before" type="text" />
					</li>
					<li>
						<label>
							密码：
						</label>
						<input name="j_password" class="xfy_text_before" type="password" />
					</li>
					<li>
						<label>
						 　
						</label>
						<input id="land_button" value="登陆" type="submit" linkOut="true" />
						<input id="land_find" value="重置" type="reset" />
					</li>
				</ul>
			</form>
		</div>
		<span id="footer"> <span id="footer_right"></span> </span>
	</body>
</html>

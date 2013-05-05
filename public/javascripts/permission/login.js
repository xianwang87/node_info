$(function() {
	$("#login-submit").click(function(e) {
		var pwd = CryptoJS.MD5($("#login-pwd").val()).toString(CryptoJS.enc.Base64);
		$("#login-pwd").val(pwd);
		$("#md5-value").html(pwd);
		$("#login-form")[0].submit();
	});
});
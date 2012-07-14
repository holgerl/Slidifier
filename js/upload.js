$(document).ready(function() {
	$("#uploadfailed").hide();

	var uploadresult = $.url().param('uploadresult');
	var errormsg = $.url().param('errormsg');
	var filelocation = $.url().param('filelocation');
	var admin_key = $.url().param('key');

	if (uploadresult === "true") {
		$("#picturesrc", window.parent.document).attr("value", filelocation);
		$("#insertpicturebutton", window.parent.document).click();
		if (admin_key === undefined) {
			$("#saveButton", window.parent.document).click();
		}
	} else if (uploadresult !== undefined) {
		$("#uploadfailed").text(errormsg);
		$("#uploadfailed").show();
	}

	$("#uploadpicturebutton").click(function(event) {
		event.preventDefault();
		if ($.trim($("#picturefile").attr("value")).length > 0) {
			$("#uploadform form").submit();
		}
	});
});
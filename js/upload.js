$(document).ready(function() {
	$("#uploadfailed").hide();
	$("#uploadspinner").hide();

	var uploadresult = $.url().param('uploadresult');
	var errormsg = $.url().param('errormsg');
	var filelocation = $.url().param('filelocation');
	var hasSaved = /key=.+/.test(window.parent.location.href);

	if (uploadresult === "true") {
		$("#picturesrc", window.parent.document).attr("value", filelocation);
		$("#insertpicturebutton", window.parent.document).click();
		if (!hasSaved) {
			$("#saveButton", window.parent.document).click();
		}
	} else if (uploadresult !== undefined) {
		$("#uploadfailed").text(errormsg);
		$("#uploadfailed").show();
	}

	$("#uploadpicturebutton").click(function(event) {
		event.preventDefault();
		if ($.trim($("#picturefile").attr("value")).length > 0) {
			$("#uploadspinner").show();
			$("#uploadform form").submit();
		}
	});
});
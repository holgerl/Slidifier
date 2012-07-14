$(document).ready(function() {
	$("#uploadfailed").hide();

	var uploadresult = $.url().param('uploadresult');
	var filelocation = $.url().param('filelocation');
	var admin_key = $.url().param('key');

	 if (uploadresult === "1") {
		$("#picturesrc", window.parent.document).attr("value", filelocation);
		$("#insertpicturebutton", window.parent.document).click();
		if (admin_key === undefined) {
			$("#saveButton", window.parent.document).click();
		}
	} else if (uploadresult !== undefined) {
		$("#uploadfailed").show();
	}

	$("#uploadpicturebutton").click(function(event) {
		event.preventDefault();
		if ($.trim($("#picturefile").attr("value")).length > 0) {
			$("#uploadform form").submit();
		}
	});
});
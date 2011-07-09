var slideshowId;
var slideshowKey;

function readSlideshowIntoForm(id) {
	$.getJSON('php/io.php', {id: id}, function(data) {
		$('textarea[name=slides_src]').val(data.src)
	});
}

function updateSlidshowInDB(id, admin_key, src) {
	$.post('php/io.php', {id: id, admin_key: admin_key, src: src}, function(data) {
		$(window.location).attr('href', '?id='+slideshowId+"&admin_key="+slideshowKey);
	}, 'json');
}

function createEmptySlideshowAndSaveInDB() {
	$.post('php/io.php', {create: ""}, function(data) {
		slideshowId = data.id;
		slideshowKey = data.admin_key;
		updateSlidshowInDB(slideshowId, slideshowKey, $('textarea[name=slides_src]').val());
	}, 'json');
}

$(function(){
	slideshowId = $.url().param('id');
	slideshowKey = $.url().param('admin_key');

	if (slideshowId != undefined) {
		readSlideshowIntoForm(slideshowId);
	}
	
	if (slideshowId != undefined && slideshowKey == undefined) {
		$('textarea[name=slides_src]').attr('readonly', 'readonly');
		$('textarea[name=slides_src]').addClass('readonly');
		$('#saveButton').addClass('readonly');
	} else if (slideshowId != undefined && slideshowKey != undefined || slideshowId == undefined && slideshowKey == undefined) {
		$('textarea[name=slides_src]').removeAttr('readonly');
		$('textarea[name=slides_src]').removeClass('readonly');
		$('#saveButton').removeClass('readonly');
	}
	
	$('#saveButton').click(function(e) {
		if (slideshowId == undefined) {
			createEmptySlideshowAndSaveInDB();
		} else if (slideshowId != undefined && slideshowKey != undefined){
			updateSlidshowInDB(slideshowId, slideshowKey, $('textarea[name=slides_src]').val());
		}
	});
});


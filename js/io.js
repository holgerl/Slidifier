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
		$('#saveButton').hide();
	} else if (slideshowId != undefined && slideshowKey != undefined || slideshowId == undefined && slideshowKey == undefined) {
		$('textarea[name=slides_src]').removeAttr('readonly');
		$('textarea[name=slides_src]').removeClass('readonly');
		$('#saveButton').show();
	}
	
	if (slideshowId != undefined && slideshowKey != undefined) {
		var fullBaseUrl = "http://" + $.url().attr('host') + $.url().attr('path')
		var fullAdminUrl = fullBaseUrl + "?id="+slideshowId+"&admin_key="+slideshowKey;
		var fullShareUrl = fullBaseUrl + "?id="+slideshowId;
		var shortBaseUrl = $.url().attr('host') + $.url().attr('path')
		var shortAdminUrl = shortBaseUrl + "?id="+slideshowId+"&admin_key="+slideshowKey;
		var shortShareUrl = shortBaseUrl + "?id="+slideshowId;
		$('#admin-url').html(shortAdminUrl);
		$('#admin-url').attr("href", fullAdminUrl);
		$('#share-url').html(shortShareUrl);
		$('#share-url').attr("href", fullShareUrl);
		$('#urls').show();
	} else {
		$('#urls').hide();
	}
	
	$('#saveButton').click(function(e) {
		if (slideshowId == undefined) {
			createEmptySlideshowAndSaveInDB();
		} else if (slideshowId != undefined && slideshowKey != undefined){
			updateSlidshowInDB(slideshowId, slideshowKey, $('textarea[name=slides_src]').val());
		}
	});
});


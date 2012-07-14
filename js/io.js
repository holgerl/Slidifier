var io = (function() {
	var slideshowId;
	var slideshowKey;
	
	function readSlideshowIntoForm(id) {
		$.getJSON('php/io.php', {id: id}, function(data) {
			$('textarea[name=slides_src]').val(data.src)
		});
	}
	
	function updateSlidshowInDB(id, key, src) {
		$.post('php/io.php', {id: id, key: key, src: src}, function(data) {
			$(window.location).attr('href', '?id='+slideshowId+"&key="+slideshowKey);
		}, 'json');
	}
	
	function createEmptySlideshowAndSaveInDB() {
		$.post('php/io.php', {create: ""}, function(data) {
			slideshowId = data.id;
			slideshowKey = data.key;
			updateSlidshowInDB(slideshowId, slideshowKey, $('textarea[name=slides_src]').val());
		}, 'json');
	}
	
	function init() {
		slideshowId = $.url().param('id');
		slideshowKey = $.url().param('key');

		// This is only for backwards compatability with old urls:
		if ($.url().param('admin_key') !== undefined) {
			slideshowKey = $.url().param('admin_key');
		}
	
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
			var fullBaseUrl = "http://" + $.url().attr('host') + $.url().attr('path');
			var fullAdminUrl = fullBaseUrl + "?id="+slideshowId+"&key="+slideshowKey;
			var fullShareUrl = fullBaseUrl + "?id="+slideshowId;
			var shortBaseUrl = $.url().attr('host') + $.url().attr('path')
			var shortAdminUrl = shortBaseUrl + "?id="+slideshowId+"&key="+slideshowKey;
			var shortShareUrl = shortBaseUrl + "?id="+slideshowId;
			$('#admin-url').html(shortAdminUrl);
			$('#admin-url').attr("href", fullAdminUrl);
			$('#share-url').html(shortShareUrl);
			$('#share-url').attr("href", fullShareUrl);
			$('#urls').show();
			$('#newButton').show();
		} else {
			$('#urls').hide();
			$('#newButton').hide();
		}

		if (slideshowId !== undefined && slideshowKey === undefined) {
			$('.editorbutton').hide();
			$("#readonlyMsg").show();
		}
		
		$('#saveButton').click(function(event) {
			event.preventDefault();
			if (slideshowId == undefined) {
				createEmptySlideshowAndSaveInDB();
			} else if (slideshowId != undefined && slideshowKey != undefined){
				updateSlidshowInDB(slideshowId, slideshowKey, $('textarea[name=slides_src]').val());
			}
		});
		
		$('#newButton').click(function(event) {
			event.preventDefault();
			var fullBaseUrl = "http://" + $.url().attr('host') + $.url().attr('path')
			$(window.location).attr('href', fullBaseUrl);
		});
	};
	
	return {
		init: init
	};
}());


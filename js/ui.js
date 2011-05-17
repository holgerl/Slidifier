refreshed = true;
var themeDom;

function refresh() {
	refreshed = false;
	slideCounter = Math.max(slideCounter, 0);
	slideCounter = Math.min(slideCounter, slides.length-1);
	$('#slidecounter').html(parseInt(slideCounter+1) + "/" + slides.length);
	$('#slidecontent').fadeOut(10, function() {
		$('#slidecontent').html(slides[slideCounter]);
		prettyPrint();
		$('#slidecontent').fadeIn(300, function() {
			refreshed = true;
		});
	});
}

$(document).keydown(function(e) {
	if (refreshed && $("#slide").is(':visible')) {
		if (e.keyCode == 37) {
			slideCounter--;
			refresh();
			return false;
		}
		if (e.keyCode == 39) {
			slideCounter++;
			refresh();
			return false;
		}
		if (e.keyCode == 27) {
			$("#slide").hide();
			$("#srcForm").show();
		}
	}
});

$(document).mousedown(function(e) {
	if (e.which == 1 && $("#slide").is(':visible')) {
		slideCounter++;
		refresh();
	}
});

function loadTheme() {
	if(themeDom !== undefined) {
		themeDom.remove();
	}
	themeName = $("input[@name='theme']:checked").val();
	themeDom = $('<link rel="stylesheet" type="text/css" />').attr('href', 'css/themes/' + themeName + '/theme.css');
	$('head').append(themeDom);
}
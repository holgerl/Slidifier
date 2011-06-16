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

function updateClock() {
	var time = new Date();
	var hours = time.getHours();
	var minutes = time.getMinutes();
	hours = (hours < 10 ? "0" : "") + hours;
	minutes = (minutes < 10 ? "0" : "") + minutes;
	$('#clock').html(hours + ":" + minutes);
}

function slideForward() {
	if (slideCounter < slides.length-1) {
		slideCounter++;
		refresh();
	}
}

function slideBackward() {
	if (slideCounter > 0) {
		slideCounter--;
		refresh();
	}
}

$(document).keydown(function(e) {
	if (refreshed && $("#slide").is(':visible')) {
		if (e.keyCode == 37) {
			slideBackward();
			return false;
		}
		if (e.keyCode == 39) {
			slideForward();
			return false;
		}
		if (e.keyCode == 27) {
			$("#slide").hide();
			$("#slideEdit").show();
		}
	}
});

$(document).mousedown(function(e) {
	if (e.which == 1 && $("#slide").is(':visible')) {
		slideForward();
	}
});

function loadTheme() {
	themeName = $("input[@name='theme']:checked").val();	
	var head = document.getElementsByTagName('head')[0];
	
	if(themeDom !== undefined) {
		head.removeChild(themeDom);
	}
	
	themeDom = document.createElement('link');
	themeDom.setAttribute("rel", "stylesheet");
	themeDom.setAttribute("type", "text/css");
	themeDom.setAttribute("href", "css/themes/" + themeName + "/theme.css");
	head.appendChild(themeDom);
}
var slides;
var slideCounter;

var submitHandler = function(event) {
	event.preventDefault();
	
	var slidesSrc = $('textarea[name=slides_src]').val();
	slides = processSlideSource(slidesSrc);
	
	if (isIE()) {
		for (var i in slides) {
			slides[i] = slides[i].replace(/\n/g, "<br/>");
		}
	}
	
	slideCounter = 0;
	
	refresh();
	
	loadTheme();
	
	showSlideShow();
};

var showSlideShow = function() {
	$("#slideEdit").fadeOut(10, function() {
		$("#slide").fadeIn(1000, function() {
			$("#help").slideDown("slow", function() {
				setTimeout(function() {
					$("#help").slideUp("slow");
				}, 3000);
			});
		});
	});
};

var isIE = function() {
	return navigator.userAgent.indexOf('MSIE') != -1;
};

$(document).ready(function() {
	$("#slide").hide();
	$("#urls").hide();
	$("#help").hide();
	
	$('#srcForm textarea').TextAreaResizer();
	
	updateClock();
	setInterval('updateClock()', 1000*60);
	
	$("#srcForm").submit(submitHandler);
});
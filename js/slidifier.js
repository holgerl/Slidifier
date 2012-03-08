var slidifier = (function() {
	this.slides;
	this.slideCounter;
	
	function submitHandler(event) {
		event.preventDefault();
		
		var slidesSrc = $('textarea[name=slides_src]').val();
		slides = slideparser.processSlideSource(slidesSrc);
		
		if (isIE()) {
			for (var i in slides) {
				slides[i] = slides[i].replace(/\n/g, "<br/>");
			}
		}
		
		slideCounter = 0;
		
		refresh();
		
		loadTheme();
		
		showSlideShow();
	}
	
	function showSlideShow() {
		$("#slideEdit").fadeOut(10, function() {
			$("#slide").fadeIn(1000, function() {
				$("#help").slideDown("slow", function() {
					setTimeout(function() {
						$("#help").slideUp("slow");
					}, 3000);
				});
			});
		});
	}
	
	function isIE() {
		return navigator.userAgent.indexOf('MSIE') != -1;
	}
	
	this.init = function() {
		$("#slide").hide();
		$("#urls").hide();
		$("#help").hide();
		
		$('#srcForm textarea').TextAreaResizer();
		
		updateClock();
		setInterval('updateClock()', 1000*60);
		
		$("#srcForm").submit(submitHandler);
	};
	
	return this;
})();

$(document).ready(function() {
	slidifier.init();
	io.initIO();
});
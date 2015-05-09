var slidifier = (function() {
	
	function submitHandler(event) {
		event.preventDefault();
		
		var slidesSrc = $('textarea[name=slides_src]').val();
		ui.slides = slideparser.processSlideSource(slidesSrc);
		
		if (isIE()) {
			for (var i in ui.slides) {
				ui.slides[i] = ui.slides[i].replace(/\n/g, "<br/>");
			}
		}
		
		ui.slideCounter = 0;
		
		ui.refresh();
		
		ui.loadTheme();
		
		window.history.pushState({}, "");
		window.onpopstate = function(event) {
			$("#slide").hide();
			$("#slideEdit").show();
		};
		
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
	
	function init() {
		$("#slide").hide();
		$("#urls").hide();
		$("#help").hide();
		$("#readonlyMsg").hide();
		$("#picturesrcForm").hide();
		
		$('#srcForm textarea').TextAreaResizer();
		
		ui.updateClock();
		setInterval(ui.updateClock, 1000*60);
		
		$("#srcForm").submit(submitHandler);
	};
	
	return {
		init: init
	};
})();

$(document).ready(function() {
	slidifier.init();
	io.init();
	ui.init();
});
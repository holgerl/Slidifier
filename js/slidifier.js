var slides;
var slideCounter;

$(document).ready(function() {
	$("#slide").hide();
	
	// for debugging only:
	slides = $('textarea[name=slides_src]').val();
	slides = processSlideSource(slides);
	// end 
	
	$("#srcForm").submit(function() {
		slides = $('textarea[name=slides_src]').val();
		slides = processSlideSource(slides);
		
		slideCounter = 0;
		
		refresh();
		
		loadTheme();
		
		$("#srcForm").fadeOut("fast", function() {
			$("#slide").fadeIn("fast");
		});
		
		setTimeout(function() {
				$("#help").slideDown("slow", function() {
					setTimeout(function() {
						$("#help").slideUp("slow");
					}, 2000);
				});
			}, 500);
		
		return false;
	});

});

//slide = slide.replace(/-\s*([^\n]*)\n/g,"<li>$1</h1>");
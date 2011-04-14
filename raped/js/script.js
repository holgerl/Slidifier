var slides;
var slideCounter;

function escapeTags(str) {
	return String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function unescapeWhitelist(str) {
	var whitelist = new Array("strong", "img", "em", "span", "h1", "h2", "h3", "h4", "h5", "h6", "a");
	for (var i in whitelist) {
		var white = new RegExp("&lt;(\s*\\/?[^&]*"+whitelist[i]+"[^&]*)&gt;", "g");
		str = str.replace(white, "<$1>");
	}
	return str;
}

function refresh() {
	$("#slide").fadeOut("fast", function() {
		slideCounter = Math.max(slideCounter, 0);
		slideCounter = Math.min(slideCounter, slides.length-1);
		$('#slidecounter').html(parseInt(slideCounter+1) + "/" + slides.length);
		$('#slidecontent').html(slides[slideCounter]);
		prettyPrint();
		$("#slide").fadeIn("fast");
	});
	
}

$(document).keydown(function(e) {
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
		$("#slide").fadeOut("fast", function() {
			$('#slidecounter').html("");
			$('#slidecontent').html("");
			slides = undefined;
			slideCounter = undefined;
			$("#slideSetup").fadeIn("slow");
		});
	}
});

$(document).mousedown(function(e) {
	if (e.which == 1) {
		slideCounter++;
		refresh();
	}
});

$(document).ready(function() {
	$("#slide").hide();
	
	$("#srcForm").submit(function() {
		slides = $('textarea[name=slides_src]').val();
		slides = processSlideSource(slides);
		
		slideCounter = 0;
		
		
		$("#slideSetup").fadeOut("fast", function() {
			refresh();
			$("#slide").fadeIn("slow", function() {
				setTimeout(function() {
					$("#help").slideDown("slow", function() {
						setTimeout(function() {
							$("#help").slideUp("slow");
						}, 2000);
					});
				}, 500);
			});
		});
		

		
		return false;
	});

});

var processSlideSource = function(slides) {
	slides = escapeTags(slides);
	slides = unescapeWhitelist(slides);
	slides = slides.split(/\s*---\s*\n/);
	
	if (slides.length > 0) {
		slides[0] = processHeaderPage(slides[0]);
	}
	
	for (var i in slides) {
		slides[i] = processSlide(slides[i]);
	}
	
	return slides;
}

var processHeaderPage = function(slide) {
	var headers = slide.split(/\n/);
	var result = "";
	for (var i in headers) {
		var level = parseInt(i)+1;
		result += "<h"+level+">"+headers[i]+"</h"+level+">";
	}
	return result;
}

var processSlide = function(slide) {
	var lines = slide.split(/\n/);
	var result = "";
	var isInCode = false;
	var isInList = false;
	for (var i in lines) {
		console.log(lines[i]);
		if (lines[i].search(/-+.*/) != -1) {
			console.log("a");
			if (isInList == false) {
				result += "<ul>";
			}
			isInList = true;
			var lvl = 0;
			for (var j in lines[i]) {
				if (lines[i][j].search(/-/) != -1) {
					lvl++;
				} else if (lines[i][j].search(/\s/) != -1) {
					continue;
				} else {
					break;
				}
			}
			result += lines[i].replace(/\s*-+\s?(.*)/, "<li class='lvl"+lvl+"'>$1</li>");
		} else {
			if (isInList == true) {
				result += "</ul>";
			}
			isInList = false;
			
		}
		
		if (lines[i].search(/\\code/) != -1) {
			console.log("b");
			isInCode = !isInCode;
			if (isInCode) {
				result += "<pre class='prettyprint'>";
			} else {
				result += "</pre>";
			}
		}
		
		if (lines[i].search(/^\s*[^\s\\-]/) != -1) {
			console.log("c");
			result += lines[i]+"\n";
		}
		
		if (lines[i].search(/^\s*$/) != -1) {
			console.log("d");
			result += lines[i]+"\n";
		}
	}
	return result;
}

//slide = slide.replace(/-\s*([^\n]*)\n/g,"<li>$1</h1>");
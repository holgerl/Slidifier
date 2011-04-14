// Bug: ord med bindestrek tolkes som lister
// Feature request: Første slides fontstørrelse avhenger av mengden tekst

function escapeTags(str) {
	return String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function unescapeWhitelist(str) {
	var whitelist = new Array("strong", "img", "em", "span", "h1", "h2", "h3", "h4", "h5", "h6", "!--.*--");
	for (var i in whitelist) {
		var white = new RegExp("&lt;(\s*\\/?[^&]*"+whitelist[i]+"[^&]*)&gt;", "g");
		str = str.replace(white, "<$1>");
	}
	return str;
}

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
		result += "<h"+level+" class='titleslide'>"+headers[i]+"</h"+level+">";
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
		if (lines[i].search(/^\s*-+.*/) != -1) {
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
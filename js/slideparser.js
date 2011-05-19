var processSlideSource = function(slideSrc) {
	var lines = slideSrc.split(/\n/);
	var tokens = new Array();
	
	for (var i in lines) {
		var token = tokenize(lines[i]);
		tokens.push(token);
	}
	
	tokens = removeEmptyLinesAroundSlidedelimiters(tokens);
	
	for (var i in tokens) {
		console.log(tokens[i]);
	}
	
	var slide = "";
	slides = new Array();
	
	var inCode = false;
	var inList = false;
	for (var i in tokens) {
		if (inCode) {
			if (tokens[i].token != "codemark") {
				slide += escapeTags(tokens[i].line+"\n");
			} else {
				slide += "</pre>\n";
				inCode = false;
			}
			continue;
		}
		
		if (inList) {
			if (tokens[i].token != "bullet") {
				slide += "</ul>\n";
				inList = false;
			}
		}
		
		switch (tokens[i].token) {
			case "slidemark":
				slides.push(slide);
				slide = "";
				break;
			case "bullet":
				if (!inList) slide += "<ul>";
				slide += "<li class='lvl"+countNumberOf("-",tokens[i].keyword)+"'>"+tokens[i].body+"</li>";
				inList = true;
				break;
			case "heading":
				var lvl = countNumberOf("#",tokens[i].keyword);
				slide += "<h"+lvl+">"+tokens[i].body+"</h"+lvl+">";
				break;
			case "codemark":
				slide += "<pre class='prettyprint'>\n";
				inCode = true;
				break;
			case "empty":
				slide += tokens[i].body+"\n";
				break;
			case "catchall":
				slide += tokens[i].body+"\n";
				break;
			default:
				console.log("WARNING!!!");
		}
	}
	
	if (inCode) {
		slide += "</pre>\n";
	}
	if (inList) {
		slide += "</ul>\n";
	}
	
	slides.push(slide);
	
	if (slides.length > 0) {
		slides[0] = processTitleSlide(slides[0]);
	}
	
	for (var i in slides) {
		console.log(slides[i]);
	}
	
	return slides;
}

var tokenize = function(line) {
	var regexes = [
		["slidemark", 	/^\s*(-\s*-\s*-)\s*()$/, 			1, 2],
		["bullet", 		/^\s*((-\s*)*-)\s*(([^-]|\S)+)$/, 	1, 3],
		["heading", 	/^\s*((#\s*)*#)\s*(([^#]|\S)+)$/, 	1, 3],
		["codemark", 	/^\s*(\\\s*\\)\s*()$/, 				1, 2],
		["empty", 		/^(\s*)()$/, 						1, 2],
		["catchall", 	/^()(.*)$/, 						1, 2],
	]
	
	for (var i in regexes) {
		var match = regexes[i][1].exec(line);
		if (match != null) {
			return {
				token: regexes[i][0], 
				keyword: match[regexes[i][2]], 
				body: match[regexes[i][3]],
				line: line
			};
		}
		if (i == regexes.length-1) {
			console.log("DANGER!!!");
		}
	}
}

var processTitleSlide = function(slide) {
	var headers = slide.split(/\n/);
	var result = "";
	for (var i in headers) {
		var level = parseInt(i)+1;
		if (headers[i].length > 0) {
			result += "<h"+level+" class='titleslide'>"+headers[i]+"</h"+level+">";
		}
	}
	return result;
}

var removeEmptyLinesAroundSlidedelimiters = function(tokens) {
	var without = new Array;
	for (var i in tokens) {
		var push = true;
		if (tokens[i].token == "empty") {
			push = i == 0 || tokens[parseInt(i)-1].token != "slidemark";
			push &= i != tokens.length-1 && tokens[parseInt(i)+1].token != "slidemark";
		}
		if (push) without.push(tokens[i]);
	}
	return without;
}

var countNumberOf = function(char, str) {
	return str.match(new RegExp(char, "g")).length;
}

function escapeTags(str) {
	return String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

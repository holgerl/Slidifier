var slideparser = (function() {
	function processSlideSource (slideSrc) {
		var lines = cbSplit(slideSrc, /\n/);
		var tokens = new Array();
		
		for (var i in lines) {
			var token = tokenize(lines[i]);
			tokens.push(token);
		}
		
		tokens = removeEmptyLinesAroundSlidedelimiters(tokens);
		
		tokens = dynamics.applyDynamics(tokens);
		
		var slide = "";
		var slides = new Array();
		
		var inCode = false;
		var inList = false;
		for (var i in tokens) {
			if (inCode) {
				if (tokens[i].token != "codemark") {
					slide += escapeTags(tokens[i].line+"\n");
				} else {
					slide += "</pre>";
					inCode = false;
				}
				continue;
			}
			
			if (inList) {
				if (tokens[i].token != "bullet") {
					slide += "</ul>";
					inList = false;
				}
			}
			
			tokens[i].body = unescapeWhitelist(escapeTags(tokens[i].body));
			
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
					var clazz = tokens[i].addClass != undefined ? " class='"+tokens[i].addClass+"'" : "";
					slide += "<h"+lvl+clazz+">"+tokens[i].body+"</h"+lvl+">";
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
			}
		}
		
		if (inCode) {
			slide += "</pre>\n";
		}
		if (inList) {
			slide += "</ul>\n";
		}
		
		slides.push(slide);
		
		slides.push(endOfShowSlide());
		
		return slides;
	};
	
	function tokenize(line) {
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
		}
	}
	
	function removeEmptyLinesAroundSlidedelimiters(tokens) {
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
	
	function countNumberOf(char, str) {
		return str.match(new RegExp(char, "g")).length;
	}
	
	function escapeTags(str) {
		var escaped = String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;');
		return escaped;
	}
	
	function unescapeWhitelist(str) {
		var whitelist = new Array("strong", "img", "em", "span", "h1", "h2", "h3", "h4", "h5", "h6", "!--");
		
		for (var i in whitelist) {
			var white = new RegExp("&lt;(\s*[^&]*"+whitelist[i]+"[^&]*)&gt;", "g");
			str = str.replace(white, "<$1>");
		}
		
		return str;
	}
	
	function endOfShowSlide() {
		return "<p class='endnote'>End of presentation</p><p class='endtip'>(press <strong>ESC</strong> to exit)</p><p class='endcredit'>Made with Slidifier</p>";
	}
	
	var testObject = {
		countNumberOf: countNumberOf,
		escapeTags: escapeTags,
		endOfShowSlide: endOfShowSlide,
		
	};
	
	return {
		processSlideSource: processSlideSource,
		testObject: testObject
	};
})();

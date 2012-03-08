var dynamics = (function() {
	function applyDynamics(tokens) {
		var tokenSlides = divideIntoSlides(tokens);
		
		for (var i in tokenSlides) {
			applyOnlyHeaders(tokenSlides[i]);
		}
		
		return mergeIntoTokens(tokenSlides);
	}
	
	function divideIntoSlides(tokens) {
		var tokenSlides = new Array();
		tokenSlides.push(new Array());
		var j = 0;
		
		for (var i in tokens) {
			tokenSlides[j].push(tokens[i])
			if (tokens[i].token == "slidemark") {
				tokenSlides.push(new Array());
				j++;
			}
		}
		
		return tokenSlides;
	}
	
	function mergeIntoTokens(tokenSlides) {
		var tokens = new Array();
		
		for (var i in tokenSlides) {
			for (var j in tokenSlides[i]) {
				tokens.push(tokenSlides[i][j]);
			}
		}
		
		return tokens;
	}
	
	function applyOnlyHeaders(tokenSlide) {
		var onlyHeaders = true;
		
		for (var i in tokenSlide) {
			var token = tokenSlide[i];
			if (token.token != "heading" && token.token != "empty" && token.token != "slidemark") {
				onlyHeaders = false;
			}
		}
		
		if (onlyHeaders) {
			for (var i in tokenSlide) {
				var token = tokenSlide[i];
				if (token.token == "heading") {
					addClass(token, "titleslide");
				}
			}
		}
	}
	
	function addClass(token, clazz) {
		if (token.addClass != undefined) {
			token.addClass += " ";
		} else {
			token.addClass = "";
		}
		token.addClass += clazz;
	}
	
	return {
		applyDynamics: applyDynamics
	};
})();
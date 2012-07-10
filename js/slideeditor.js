var editor = (function() {

	function setCaretPosition(textarea, pos){
		if(textarea.setSelectionRange) {
			textarea.focus();
			textarea.setSelectionRange(pos,pos);
		} else if (textarea.createTextRange) {
			var range = textarea.createTextRange();
			range.collapse(true);
			range.moveEnd('character', pos);
			range.moveStart('character', pos);
			range.select();
		}
	}
	
	function getLineAtPosition(allText, positionOnLine) {
		var startPosition = positionOnLine;
		var endPosition = positionOnLine;

		while (startPosition > 0 && allText[startPosition-1] !== '\n') {
			startPosition--;
		}

		while (endPosition <= allText.length-1 && allText[endPosition] !== '\n') {
			endPosition++;
		}

		return {start: startPosition, end: endPosition};
	}
	
	return {
		getLineAtPosition: getLineAtPosition,
		setCaretPosition: setCaretPosition
	};
})();


$(document).ready(function() {
	function insertSymbolAtCurrentLine(symbol, startOrEnd) {
		var currentPosition = $("#slidesSrc").getSelection().start;
		var allText = $("#slidesSrc").attr("value");
		var line = editor.getLineAtPosition(allText, currentPosition);
		if (startOrEnd === "start" && allText[line[startOrEnd]] !== symbol) symbol += ' ';
		var newText = allText.substr(0, line[startOrEnd]) + symbol + allText.substr(line[startOrEnd], allText.length);

		$("#slidesSrc").attr("value", newText);

		editor.setCaretPosition(document.getElementById("slidesSrc"), currentPosition+symbol.length);
	}

	$("#headingbutton").click(function() {
		insertSymbolAtCurrentLine("#", "start");
	});

	$("#listbutton").click(function() {
		insertSymbolAtCurrentLine("-", "start");
	});

	$("#newslidebutton").click(function() {
		insertSymbolAtCurrentLine("\n---\n\n", "end");
	});
});
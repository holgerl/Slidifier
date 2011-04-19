test('countNumberOf()', function() { 
	equals(countNumberOf("o", "foobar"), 2);
	equals(countNumberOf("f", "sof sdifhasdfjh"), 3);
	equals(countNumberOf("/", "//f 77 / ffkkf"), 3);
	equals(countNumberOf(" ", "eo yiho hoi df "), 4);
});

test('escapeTags()', function() { 
	equals(escapeTags("klajfhakljfn"), "klajfhakljfn");
	equals(escapeTags("<test>"), "&lt;test&gt;");
	equals(escapeTags("<test/>"), "&lt;test/&gt;");
	equals(escapeTags("<foo>bar</foo>"), "&lt;foo&gt;bar&lt;/foo&gt;");
	equals(escapeTags("<<"), "&lt;&lt;");
});

var testProcessSlideSource = function(description) {
	test('processSlideSource() '+description, function() { 
		same(processSlideSource(inputString), outputArray);
	});
}

inputString = "test\n---\nfoo\nbar";
outputArray =  ["<h1 class='titleslide'>test</h1>","foo\nbar\n"];
testProcessSlideSource("slidemark");

inputString = "test\n---\n* foo\nbar";
outputArray =  ["<h1 class='titleslide'>test</h1>","<h1>foo</h1>\nbar\n"];
testProcessSlideSource("heading");
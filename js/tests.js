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

var testProcessSlideSource = function(description, inputString, outputArray) {
	test('processSlideSource() '+description, function() { 
		same(processSlideSource(inputString), outputArray);
	});
}

inputString = "test\n---\nfoo\nbar";
outputArray = ["<h1 class='titleslide'>test</h1>","foo\nbar\n"];
testProcessSlideSource("slidemark 1", inputString, outputArray);

inputString = "test\n\n---\n\nfoo\nbar";
outputArray = ["<h1 class='titleslide'>test</h1>","foo\nbar\n"];
testProcessSlideSource("slidemark 2", inputString, outputArray);

inputString = "test\n---\nfoo\nbar\n---\n\nfoobar";
outputArray = ["<h1 class='titleslide'>test</h1>","foo\nbar\n", "foobar\n"];
testProcessSlideSource("slidemark 3", inputString, outputArray);

inputString = "test";
outputArray = ["<h1 class='titleslide'>test</h1>"];
testProcessSlideSource("slidemark 4", inputString, outputArray);

inputString = "test\n---\nfoo --- bar\n- - -\nhey\n-\t --\nho";
outputArray = ["<h1 class='titleslide'>test</h1>","foo --- bar\n","hey\n","ho\n"];
testProcessSlideSource("slidemark 5", inputString, outputArray);



inputString = "test\n---\n*foo\nbar";
outputArray = ["<h1 class='titleslide'>test</h1>","<h1>foo</h1>\nbar\n"];
testProcessSlideSource("heading 1", inputString, outputArray);

inputString = "test\n---\n*   foo\nbar";
outputArray = ["<h1 class='titleslide'>test</h1>","<h1>foo</h1>\nbar\n"];
testProcessSlideSource("heading 2", inputString, outputArray);

inputString = "test\n---\nfoo*bar";
outputArray = ["<h1 class='titleslide'>test</h1>","foo*bar\n"];
testProcessSlideSource("heading 3", inputString, outputArray);

inputString = "test\n---\n** foo";
outputArray = ["<h1 class='titleslide'>test</h1>","<h1>* foo</h1>\n"];
testProcessSlideSource("heading 4", inputString, outputArray);

inputString = "test\n---\n* foo\n* bar";
outputArray = ["<h1 class='titleslide'>test</h1>","<h1>foo</h1>\n<h1>bar</h1>\n"];
testProcessSlideSource("heading 5", inputString, outputArray);



inputString = "test\n---\n- foo\n- bar";
outputArray = ["<h1 class='titleslide'>test</h1>","<ul><li class='lvl1'>foo</li><li class='lvl1'>bar</li></ul>\n"];
testProcessSlideSource("bullet 1", inputString, outputArray);

inputString = "test\n---\nfoo-bar";
outputArray = ["<h1 class='titleslide'>test</h1>","foo-bar\n"];
testProcessSlideSource("bullet 2", inputString, outputArray);

inputString = "test\n---\nfoo - bar";
outputArray = ["<h1 class='titleslide'>test</h1>","foo - bar\n"];
testProcessSlideSource("bullet 3", inputString, outputArray);

inputString = "test\n---\n- foo - bar";
outputArray = ["<h1 class='titleslide'>test</h1>","<ul><li class='lvl1'>foo - bar</li></ul>\n"];
testProcessSlideSource("bullet 4", inputString, outputArray);

inputString = "test\n---\n-  \t  foo";
outputArray = ["<h1 class='titleslide'>test</h1>","<ul><li class='lvl1'>foo</li></ul>\n"];
testProcessSlideSource("bullet 5", inputString, outputArray);

//TODO:
//sub bullets
//code
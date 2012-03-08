module('Small functions');

test('countNumberOf()', function() { 
	equals(slideparser.testObject.countNumberOf("o", "foobar"), 2);
	equals(slideparser.testObject.countNumberOf("f", "sof sdifhasdfjh"), 3);
	equals(slideparser.testObject.countNumberOf("/", "//f 77 / ffkkf"), 3);
	equals(slideparser.testObject.countNumberOf(" ", "eo yiho hoi df "), 4);
});

test('escapeTags()', function() { 
	equals(slideparser.testObject.escapeTags("klajfhakljfn"), "klajfhakljfn");
	equals(slideparser.testObject.escapeTags("<test>"), "&lt;test&gt;");
	equals(slideparser.testObject.escapeTags("<test/>"), "&lt;test/&gt;");
	equals(slideparser.testObject.escapeTags("<foo>bar</foo>"), "&lt;foo&gt;bar&lt;/foo&gt;");
	equals(slideparser.testObject.escapeTags("<<"), "&lt;&lt;");
});

var testProcessSlideSource = function(description, inputString, outputArray) {
	test('processSlideSource() '+description, function() { 
		outputArray.push(slideparser.testObject.endOfShowSlide());
		same(slideparser.processSlideSource(inputString), outputArray);
	});
}

module('Slidemark');

inputString = "test\n---\nfoo\nbar";
outputArray = ["test\n","foo\nbar\n"];
testProcessSlideSource("slidemark 1", inputString, outputArray);

inputString = "test\n\n---\n\nfoo\nbar";
outputArray = ["test\n","foo\nbar\n"];
testProcessSlideSource("slidemark 2", inputString, outputArray);

inputString = "test\n---\nfoo\nbar\n---\n\nfoobar";
outputArray = ["test\n","foo\nbar\n", "foobar\n"];
testProcessSlideSource("slidemark 3", inputString, outputArray);

inputString = "test";
outputArray = ["test\n"];
testProcessSlideSource("slidemark 4", inputString, outputArray);

inputString = "test\n---\nfoo --- bar\n- - -\nhey\n-\t --\nho";
outputArray = ["test\n","foo --- bar\n","hey\n","ho\n"];
testProcessSlideSource("slidemark 5", inputString, outputArray);


module('Heading');

inputString = "# test\n---\n#foo\nbar";
outputArray = ["<h1 class='titleslide'>test</h1>","<h1>foo</h1>bar\n"];
testProcessSlideSource("heading 1", inputString, outputArray);

inputString = "test\n---\n#   foo\nbar";
outputArray = ["test\n","<h1>foo</h1>bar\n"];
testProcessSlideSource("heading 2", inputString, outputArray);

inputString = "foo#bar";
outputArray = ["foo#bar\n"];
testProcessSlideSource("heading 3", inputString, outputArray);

inputString = "test\n---\n# # foo\nbar";
outputArray = ["test\n","<h2>foo</h2>bar\n"];
testProcessSlideSource("heading 4", inputString, outputArray);

inputString = "test\n---\n# foo\n# bar\nfoobar";
outputArray = ["test\n","<h1>foo</h1><h1>bar</h1>foobar\n"];
testProcessSlideSource("heading 5", inputString, outputArray);


module('Bullet');

inputString = "- foo\n- bar";
outputArray = ["<ul><li class='lvl1'>foo</li><li class='lvl1'>bar</li></ul>\n"];
testProcessSlideSource("bullet 1", inputString, outputArray);

inputString = "foo-bar";
outputArray = ["foo-bar\n"];
testProcessSlideSource("bullet 2", inputString, outputArray);

inputString = "foo - bar";
outputArray = ["foo - bar\n"];
testProcessSlideSource("bullet 3", inputString, outputArray);

inputString = "- foo - bar";
outputArray = ["<ul><li class='lvl1'>foo - bar</li></ul>\n"];
testProcessSlideSource("bullet 4", inputString, outputArray);

inputString = "-  \t  foo";
outputArray = ["<ul><li class='lvl1'>foo</li></ul>\n"];
testProcessSlideSource("bullet 5", inputString, outputArray);

inputString = "- foo\n-- bar\n--- foobar\n- barfoo\n- - boo\n    -\t  - far";
outputArray = ["<ul><li class='lvl1'>foo</li><li class='lvl2'>bar</li><li class='lvl3'>foobar</li><li class='lvl1'>barfoo</li><li class='lvl2'>boo</li><li class='lvl2'>far</li></ul>\n"];
testProcessSlideSource("bullet 6", inputString, outputArray);

inputString = "- foo\n- bar\nfoobar\n- barfoo\n- barbar";
outputArray = ["<ul><li class='lvl1'>foo</li><li class='lvl1'>bar</li></ul>foobar\n<ul><li class='lvl1'>barfoo</li><li class='lvl1'>barbar</li></ul>\n"];
testProcessSlideSource("bullet 7", inputString, outputArray);


module('Code');

inputString = "foobar\n\\\\\npublic class Foo {private int bar;}\n\\\\\nbarfoo";
outputArray = ["foobar\n<pre class='prettyprint'>\npublic class Foo {private int bar;}\n</pre>barfoo\n"];
testProcessSlideSource("code 1", inputString, outputArray);

inputString = "\\\\\n<html><em>foobar</em></html>\n\\\\";
outputArray = ["<pre class='prettyprint'>\n&lt;html&gt;&lt;em&gt;foobar&lt;/em&gt;&lt;/html&gt;\n</pre>"];
testProcessSlideSource("code 2", inputString, outputArray);


module('Markup');

inputString = "<strong>foo</strong> bar <em>foobar</em>\n5y < 4\n4x > 3\n<barfoo>barbar</barfoo>";
outputArray = ["<strong>foo</strong> bar <em>foobar</em>\n5y &lt; 4\n4x &gt; 3\n&lt;barfoo&gt;barbar&lt;/barfoo&gt;\n"];
testProcessSlideSource("markup 1", inputString, outputArray);
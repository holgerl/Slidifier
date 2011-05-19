module('Small functions');

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

module('Slidemark');

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


module('Heading');

inputString = "test\n---\n#foo\nbar";
outputArray = ["<h1 class='titleslide'>test</h1>","<h1>foo</h1>bar\n"];
testProcessSlideSource("heading 1", inputString, outputArray);

inputString = "test\n---\n#   foo\nbar";
outputArray = ["<h1 class='titleslide'>test</h1>","<h1>foo</h1>bar\n"];
testProcessSlideSource("heading 2", inputString, outputArray);

inputString = "test\n---\nfoo#bar";
outputArray = ["<h1 class='titleslide'>test</h1>","foo#bar\n"];
testProcessSlideSource("heading 3", inputString, outputArray);

inputString = "test\n---\n# # foo";
outputArray = ["<h1 class='titleslide'>test</h1>","<h2>foo</h2>"];
testProcessSlideSource("heading 4", inputString, outputArray);

inputString = "test\n---\n# foo\n# bar";
outputArray = ["<h1 class='titleslide'>test</h1>","<h1>foo</h1><h1>bar</h1>"];
testProcessSlideSource("heading 5", inputString, outputArray);


module('Bullet');

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

inputString = "test\n---\n- foo\n-- bar\n--- foobar\n- barfoo\n- - boo\n    -\t  - far";
outputArray = ["<h1 class='titleslide'>test</h1>","<ul><li class='lvl1'>foo</li><li class='lvl2'>bar</li><li class='lvl3'>foobar</li><li class='lvl1'>barfoo</li><li class='lvl2'>boo</li><li class='lvl2'>far</li></ul>\n"];
testProcessSlideSource("bullet 6", inputString, outputArray);

inputString = "test\n---\n- foo\n- bar\nfoobar\n- barfoo\n- barbar";
outputArray = ["<h1 class='titleslide'>test</h1>","<ul><li class='lvl1'>foo</li><li class='lvl1'>bar</li></ul>\nfoobar\n<ul><li class='lvl1'>barfoo</li><li class='lvl1'>barbar</li></ul>\n"];
testProcessSlideSource("bullet 7", inputString, outputArray);


module('Code');

inputString = "test\n---\nfoobar\n\\\\\npublic class Foo {private int bar;}\n\\\\\nbarfoo";
outputArray = ["<h1 class='titleslide'>test</h1>","foobar\n<pre class='prettyprint'>\npublic class Foo {private int bar;}\n</pre>\nbarfoo\n"];
testProcessSlideSource("code 1", inputString, outputArray);

inputString = "test\n---\n\\\\\n<html><em>foobar</em></html>\n\\\\";
outputArray = ["<h1 class='titleslide'>test</h1>","<pre class='prettyprint'>\n&lt;html&gt;&lt;em&gt;foobar&lt;/em&gt;&lt;/html&gt;\n</pre>\n"];
testProcessSlideSource("code 2", inputString, outputArray);


module('Markup');

inputString = "test\n---\n<strong>foo</strong> bar <em>foobar</em>\n5y < 4\n4x > 3\n<barfoo>barbar</barfoo>";
outputArray = ["<h1 class='titleslide'>test</h1>","<strong>foo</strong> bar <em>foobar</em>\n5y &lt; 4\n4x &gt; 3\n&lt;barfoo&gt;barbar&lt;/barfoo&gt;\n"];
testProcessSlideSource("markup 1", inputString, outputArray);
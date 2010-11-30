<?php

// HTML Content Type
header("Content-type: text/html");

$tests = "core, dropdown, layer, modal, tabNavigator, tooltip";

$files = explode(", ", $tests);

$out .= "<!doctype html>\n<html>\n<head>\n<title>Tests</title>\n";
$out .= "<link rel=\"stylesheet\" type=\"text/css\" href=\"../php/css.php?q=base,forms,dropdown,layer,modal,tabNavigator,tooltip,carousel,validator\">\n";
$out .=	"<link href=\"../src/css/qunit.css\" rel=\"stylesheet\">\n";
$out .= "<script src=\"../src/js/jquery.js\"></script>\n";
$out .= "<script src=\"../src/js/qunit.js\"></script>\n";
$out .= "<script src=\"../php/chico.php\"></script>\n";
$out .= "<script src=\"functions.js\"></script>\n";
$out .= "</head>\n";
$out .= "<body>\n";
$out .= "<h1>Chico Test Cases</h1>\n";
$out .= "<hr />\n";
$out .= "<h1 id=\"qunit-header\">QUnit Test Suite</h1>\n<h2 id=\"qunit-banner\"></h2>\n<div id=\"qunit-testrunner-toolbar\"></div>\n<h2 id=\"qunit-userAgent\"></h2>\n<ol id=\"qunit-tests\"></ol>\n<div id=\"qunit-fixture\">test markup</div>\n";

foreach ($files as $file) {
    	
	$html = file_get_contents("../tests/".$file.".html");

	$html = explode("<!-- #body -->", $html);
	$body = explode("<!-- #script -->", $html[1]);	
    $script = explode("<!-- #script -->", $html[2]);
    $script = explode("</body>", $script[1]);
    
    $out .= "<!-- ". $file ." -->";
	$out .= $body[0];
	$outScript .= $script[0];
}

$out .= $outScript;
$out .= "</body>\n</html>";

echo $out;



?>

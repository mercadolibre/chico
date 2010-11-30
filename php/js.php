<?php

// JS Min
require("jsmin.php");

// JS Content Type
header("Content-type: text/javascript");

// GET Files to minimize
$q = $_GET["q"];

$files = explode(",", $q);

if (!$files) return;

foreach ($files as $file) {

	$js = file_get_contents("../src/js/".$file.".js");
	
	if ($file=="mlui") {
        $js = explode("ui.init();", $js);	   
	    $js = $js[0];  
	}
	
	$jsout.=$js;
}

if ($files[0]=="mlui"){
    $jsout .= "\nui.init();\n";
}
	$jsout = JSMin::minify($jsout);

echo $jsout;

?>
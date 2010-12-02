<?php

$version = "0.1";

// Query string data

if (isset($_GET["debug"])){ $debug = $_GET["debug"]; }
if (isset($_GET["get"])){ $get = $_GET["get"]; }

// JS Min
require("jsmin.php");

// JS Content Type
header("Content-type: text/javascript");


//if (!$get) { echo "No hay get"; }
//if (!$debug) { echo "No hay debug"; }


// Static componentes avaible
$components = "core, position, object, floats, navs, carousel, dropdown, layer, modal, tabNavigator, tooltip, validator";

$files = explode(", ", $components);

foreach ($files as $file) {
    
	$js = file_get_contents("../src/js/".$file.".js");
	
	if ($file=="core") {
        $js = explode("ui.init();", $js);	   
	    $js = $js[0];  
	}

	$jsmin.=$js;
}

$jsout = JSMin::minify($jsmin);

echo "/**\n";
echo " *    Chico-UI\n";
echo " *    Packer-o-matic\n";
echo " *    version ".$version."\n";
echo " */\n";
echo ";(function($){".$jsout."\nui.init();\n})(jQuery);";

?>
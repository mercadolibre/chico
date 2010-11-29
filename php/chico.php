<?php

$version = "0.1";

// JS Min
require("jsmin.php");

// JS Content Type
header("Content-type: text/javascript");

// Static componentes avaible
$components = "mlui, position, object, floats, navs, carousel, dropdown, layer, modal, tabNavigator, tooltip, validator";

$files = explode(", ", $components);

foreach ($files as $file) {
    
	$js = file_get_contents("../src/js/".$file.".js");
	
	if ($file=="mlui") {
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
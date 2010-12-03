<?php

/**
 *    Chico-UI 
 *    Packer-o-matic
 *    Like the pizza delivery service: "Les than 100 milisecons delivery guarantee!"
 */
       $version = "0.2";
       $autor = "Natan Santolo <natan.santolo@mercadolibre.com>";
/**
 * Based on:
 * @package JSMin
 * @author Ryan Grove <ryan@wonko.com>
 * @copyright 2002 Douglas Crockford <douglas@crockford.com> (jsmin.c)
 * @copyright 2008 Ryan Grove <ryan@wonko.com> (PHP port)
 * @license http://opensource.org/licenses/mit-license.php MIT License
 * @version 1.1.1 (2008-03-02)
 * @link http://code.google.com/p/jsmin-php/
 */

// JS Min
require("jsmin.php");

// JS Content Type
header("Content-type: text/javascript");
  
// Get query string data
$debug = ( isset($_GET["debug"]) ) ? $_GET["debug"] : false ;
$get = ( isset($_GET["get"]) ) ? $_GET["get"] : false ;

// Components to delivery
$components = "";
// Necesary internals components
$internals = "position,object,floats,navs";

if (!$get) { 
    // If no get defined, delivery everything
    $components = "carousel,dropdown,layer,modal,tabNavigator,tooltip,validator";
    $files = "core,".$internals.",".$components;
} else {
    // If a get is defined remove "core" from it, will added later.
    //$components = (stripos($get,"core")===false) ? "core,".$internals.",".$get : $get;
    $get = str_replace("core","",$get);
    $files = "core,".$internals.",".$get;
    $components = $get;
}

// Remove "," from left or right
$components = trim($components,",");

// Translate the components string to an array
$files = explode(",", $files);

// For each component
foreach ($files as $file) {
    
    // avoid errors
    if ($file==""||$file==" ") continue;
    
    // get a file from source folder
	$js = file_get_contents("../src/js/".$file.".js");
	
	// if the file is the core
	if ($file=="core") {
	    // configure components on the core
	    $js = str_replace("internals: \"\",", "internals: \"".$internals."\",", $js);
	    $js = str_replace("components: \"\",", "components: \"".$components."\",", $js);
	}

    // save the file
	$jsmin.=$js;
}

// If mode debug is on, avoid minimification
$jsout = ($debug) ? $jsmin : JSMin::minify($jsmin);

// Make the deliver ;)
echo "/**\n";
echo "  * Chico-UI\n";
echo "  * Packer-o-matic\n";
echo "  * Like the pizza delivery service: \"Les than 100 milisecons delivery guarantee!\"\n";
echo "  * @components: ".implode(", ",$files)."\n";
echo "  * @version ".$version."\n";
echo "  * @autor ".$autor."\n";
echo "  *\n";
echo "  * Based on:\n";
echo "  * @package JSMin\n";
echo "  * @author Ryan Grove <ryan@wonko.com>\n";
echo "  * @copyright 2002 Douglas Crockford <douglas@crockford.com> (jsmin.c)\n";
echo "  * @copyright 2008 Ryan Grove <ryan@wonko.com> (PHP port)\n";
echo "  * @license http://opensource.org/licenses/mit-license.php MIT License\n";
echo "  * @version 1.1.1 (2008-03-02)\n";
echo "  * @link http://code.google.com/p/jsmin-php/\n";
echo "  */\n";
echo ";(function($){\n".$jsout."\nui.init();\n})(jQuery);"; // Add ui.init() instruction to the end

?>
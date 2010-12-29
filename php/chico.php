<?php

/**
 *    Chico-UI 
 *    Packer-o-matic
 *    Like the pizza delivery service: "Les than 100 milisecons delivery guarantee!"
 */
       $version = "0.3";
       $autor = "Natan Santolo <natan.santolo@mercadolibre.com>";
/**
 * Based on:
 *
 * @package JSMin
 * @author Ryan Grove <ryan@wonko.com>
 * @copyright 2002 Douglas Crockford <douglas@crockford.com> (jsmin.c)
 * @copyright 2008 Ryan Grove <ryan@wonko.com> (PHP port)
 * @license http://opensource.org/licenses/mit-license.php MIT License
 * @version 1.1.1 (2008-03-02)
 * @link http://code.google.com/p/jsmin-php/
 *
 * and 
 *
 * @package		CssMin
 * @author		Joe Scylla <joe.scylla@gmail.com>
 * @copyright	2008 - 2010 Joe Scylla <joe.scylla@gmail.com>
 * @license		http://opensource.org/licenses/mit-license.php MIT License
 * @version		2.0.1.0061 (2010-08-13)
 */
 

// Get query string data
$css = ( isset($_GET["css"]) ) ? $_GET["css"] : false ;
$debug = ( isset($_GET["debug"]) ) ? $_GET["debug"] : false ;
$get = ( isset($_GET["get"]) ) ? $_GET["get"] : false ;

// JS and CSS Min
if ($css) {
    require("cssmin.php");
    // Content Type
    header("Content-type: text/css");
} else {
    require("jsmin.php");
    // Content Type
    header("Content-type: text/javascript");
}
  
// Components to delivery
$components = "";
// Necesary internals components
$internals = "position,positioner,object,floats,navs,controllers";

if (!$get) { 
    // If no get defined, delivery everything
    $components = "carousel,dropdown,layer,modal,tabNavigator,tooltip,validator";
    $files = ($css) ? "core,forms,".$components : "core,".$internals.",".$components ;

} else {
    // If a get is defined remove "core" from it, will added later.
    //$components = (stripos($get,"core")===false) ? "core,".$internals.",".$get : $get;
    $get = str_replace("core","",$get);
    $files = ($css) ? "core,forms,".$get : "core,".$internals.",".$get ;
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
//  $js = file_get_contents("../src/js/".$file.".js");
//	$css = file_get_contents("../src/css/".$file.".css");
	$type = ($css) ? "css" : "js" ;
	$uri = "../src/".$type."/".$file.".".$type;
	$src = file_get_contents($uri);
	
	// if the file is the core
	if (($css==false) && ($file=="core")) {
	    // configure components on the core
	    $src = str_replace("internals: \"\",", "internals: \"".$internals."\",", $src);
	    $src = str_replace("components: \"\",", "components: \"".$components."\",", $src);
	}

    // save the file
//	$jsmin.=$js;
//	$cssmin.=$css;
	$outmin.=$src;
}

// If mode debug is on, avoid minimification
if ($css) {
    $print = ($debug) ? $outmin : CssMin::minify($outmin);
} else {
    $print = ($debug) ? $outmin : JSMin::minify($outmin);    
}

// Make the deliver ;)
echo "/**\n";
echo "  * Chico-UI\n";
echo "  * Packer-o-matic\n";
echo "  * Like the pizza delivery service: \"Les than 100 milisecons delivery guarantee!\"\n";
echo "  * @components: ".( ($css) ? $components : implode(", ",$files) )."\n";
echo "  * @version ".$version."\n";
echo "  * @autor ".$autor."\n";
echo "  *\n";
echo "  * based on:\n";
echo "  * @package JSMin\n";
echo "  * @package CssMin\n";
echo "  * @license http://opensource.org/licenses/mit-license.php MIT License\n";
echo "  */\n";

if ($css) {
    echo $print;
} else {
    echo ";(function($){\n".$print."\nui.init();\n})(jQuery);"; // Add ui.init() instruction to the end
}

?>
<?php

require("cssmin.php");
require("jsmin.php");

class Packer {
    
/**
 * Chico-UI 
 * Packer-o-matic
 * Like the pizza delivery service: "Les than 100 milisecons delivery guarantee!"
 */   
    public $version = "0.4";
    public $autor = "Natan Santolo <natan.santolo@mercadolibre.com>";
    
    // querystring data
    private $css;
    private $jquery;
    private $debug;
    private $get;
    
    // files to load
    private $files;    
    private $components = "carousel,dropdown,layer,modal,tabNavigator,tooltip,validator";
    private $internals = "position,positioner,object,floats,navs";

    /**
     * Constructor
     */

    function __construct() {

        $this->getQueryStringData();
        
    }
    
    /**
     * @method getQueryStringData get all the data to proceess
     */
    private function getQueryStringData() {
                
        $this->css = ( isset($_GET["css"]) ) ? $_GET["css"] : false ;
        $this->jquery = ( isset($_GET["jquery"]) ) ? $_GET["jquery"] : false ;
        $this->debug = ( isset($_GET["debug"]) ) ? $_GET["debug"] : false ;

        // If a "get" is defined remove "core" from it, will added later.
        $this->get = ( isset($_GET["get"]) ) ? str_replace("core","", $_GET["get"] ) : false ;

        // If no "get" defined, deliver everything
        $this->components = (!$this->get) ? $this->components : $this->get;
        $this->components = trim($this->components,",");

        // Set files to process, for JS: "core, internals, components" CSS: "core, forms, components"
        $this->files = (!$this->css) ? "core,".$this->internals.",".$this->components : "core,forms,".$this->components;
        $this->files = trim($this->files,",");
        
        // Convert files to an array
        $this->files = explode(",", $this->files); 
        
    }
    
    /**
     * @method getFile
     * @return content of $file
     */
    private function getFile($file) {
        $type = (!$this->css) ? "js" : "css" ;
        $uri = "../src/".$type."/".$file.".".$type;
        return file_get_contents($uri);
    }
    
    /**
     * @method minSource
     * @return minified content
     */    
    private function minSource($source) {
        return (!$this->css) ? JSMin::minify($source) : CssMin::minify($source) ;
    }

    /**
     * @method deliver print all the packed stuff
     */
    public function deliver() {
   
        // For each component
        foreach ($this->files as $file) {
        
            // avoid errors
            if ($file==""||$file==" ") continue;
            
            // Get file content
           // $src = $this->getFile($file);
                    $type = (!$this->css) ? "js" : "css" ;
                    $uri = "../src/".$type."/".$file.".".$type;
                    $src = file_get_contents($uri);
                    
            // if the file is the js core
            if ((!$this->css) && ($file=="core")) {
                // configure components on the core js
                $src = str_replace("internals: \"\",", "internals: \"".$this->internals."\",", $src);
                $src = str_replace("components: \"\",", "components: \"".$this->components."\",", $src);
            }
        
            // save the file
            $source.=$src;
        }
        
         // If mode debug is on, avoid minimification
        $print = (!$this->debug) ? $this->minSource($source) : $source ;


        // Headers
        if ($this->css) {
            header("Content-type: text/css");
        } else {
            header("Content-type: text/javascript");
        }
        // Make the deliver ;)
        echo "/**\n";
        echo "  * Chico-UI\n";
        echo "  * Packer-o-matic\n";
        echo "  * Like the pizza delivery service: \"Les than 100 milisecons delivery guarantee!\"\n";
        echo "  * @components: ".( ($this->css) ? $this->components : implode(", ",$this->files) )."\n";
        echo "  * @version ".$this->version."\n";
        echo "  * @autor ".$this->autor."\n";
        echo "  *\n";
        echo "  * based on:\n";
        echo "  * @package JSMin\n";
        echo "  * @package CssMin\n";
        echo "  * @license http://opensource.org/licenses/mit-license.php MIT License\n";
        echo "  */\n";
        
        if ($this->css) {
            echo $print;
        } else {
            echo ";(function($){\n".$print."\nui.init();\n})(jQuery);"; // Add ui.init() instruction to the end
        }
    }
}

$packer = new Packer();
$packer->deliver();
?>
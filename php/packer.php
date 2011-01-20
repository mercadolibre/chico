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
	public $autor = "Chico Team <chico@mercadolibre.com>";
    
    // querystring data
    private $type;
    private $jquery;
    private $debug;
    private $get;
    private $datauri;
    
    // files to load
    private $files;    
    private $components = "carousel,dropdown,layer,modal,tabNavigator,tooltip,string,number,required,helper,forms,viewer,chat,expando";
    private $internals = "positioner,object,floats,navs,controllers,watcher";

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
                
        $this->type = ( isset($_GET["type"]) ) ? $_GET["type"] : "js" ; // default type "js" 
        $this->jquery = ( isset($_GET["jquery"]) ) ? $_GET["jquery"] : true ; // default jquery true
        $this->debug = ( isset($_GET["debug"]) ) ? $_GET["debug"] : false ; // default debug false 
        $this->datauri = ( isset($_GET["datauri"]) ) ? $_GET["datauri"] : true ; // default dataURI true

        // If a "get" is defined remove "core" from it, will added later.
        $this->get = ( isset($_GET["get"]) ) ? str_replace("core","", $_GET["get"] ) : false ;

        // If no "get" defined, deliver everything
        $this->components = (!$this->get) ? $this->components : $this->get;
        $this->components = trim($this->components,",");

        // Set files to process, for JS: "core, internals, components" CSS: "core, forms, components"
        $this->files = ($this->type=="js") ? "core,".$this->internals.",".$this->components : "core,forms,".$this->components;
        $this->files = trim($this->files,",");
        
        // Convert files to an array
        $this->files = explode(",", $this->files); 
        
    }
    
    /**
     * @method getFile
     * @return content of $file
     */
    private function getFile($file) {
        $uri = "../src/".$this->type."/".$file.".".$this->type;
        return @file_get_contents($uri);
    }
    
    /**
     * @method minSource
     * @return minified content
     */    
    private function minSource($source) {
        return ($this->type=="js") ? JSMin::minify($source) : CssMin::minify($source) ;
    }
    
     /**
     * @method encodeDataURI4IE
     * @return content with data uri for IE Browsers
     */    
    private function encodeDataURI4IE($file, $src64) {
      
        $chunk .= "--_OYE_CHICO \n";
        $chunk .= "Content-Location:$file \n";
        $chunk .= "Content-Transfer-Encoding:base64 \n";        
        $chunk .= "$src64 \n";
        
        return $chunk; 
    
    }
    
     /**
     * @method encodeDataURI
     * @return content with data uri
     */    
    private function encodeDataURI($source) {
        $data = ""; 
        $return = "";
        $url = "http://" . $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI'];        
        // Split the urls 
        $exploded = explode("url('",$source);
        $begining = array_shift($exploded);
        /*
        // you know why        
        $ieQuirks .= "/* \n";
        $ieQuirks .= "Content-Type: multipart/related; boundary=\"_OYE_CHICO\" \n";
        */
        // for each URL        
        foreach ($exploded as $value) {
            // chunk the URL
            $chunk = explode("');", $value);
            // detect the file
            $uri = $chunk[0];
            // get the file
            $src =  file_get_contents($uri);
            $file = explode("/assets/",$uri);
            $file = explode(".",$file[1]);
            $file = $file[0];
            // if fails avoid DataURI
            $src64 = base64_encode($src);
            // Return $data with DataURI or Sprites fallback
            $data .= (!$src) ? "url('$file');" : "url('data:image/png;base64,$src64');\n/*$file*/";
            /* 
                Create a IE workaround for this magic! ;)
                TODO: Debug MHTML DataURI for IE
            */
            //$data .= "*background-image: url(mhtml:$url!$file);"; // this is for translate DataURI with MHTML
            $data .= "*background-image: url('$uri');"; // Sorry Grade-C, make the request anyway
            // add everything else
            $data .= $chunk[1];
            //$ieQuirks .= $this->encodeDataURI4IE($file, $src64);

        }
        // Compile the ieQuirks for the MHTML DataURI workaround
        //$ieQuirks .= "--_OYE_CHICO-- \n";
        //$ieQuirks .= "*/ \n";
        //$source .= $ieQuirks;

        $return .= $begining.$data;
                
        return $return;
    }
    
    /**
     * @method removeConsoles, is a method that removes all the "console.log" commands, is for Lean.
     */
    private function removeConsoles($print) {
        
        $print = str_replace("console.log", "//console.log", $print);
        
        return $print;
    }

    /**
     * @method deliver return all the packed stuff
     */
    public function deliver() {
   
        $source = "";
        
        // For each component
        foreach ($this->files as $file) {
        
            // avoid errors
            if ($file==""||$file==" ") continue;
            
            // Get file content
            $src = $this->getFile($file);
                    
            // if the file is the js core
            if (($this->type=="js") && ($file=="core")) {
                // configure components on the core js
                $src = str_replace("internals: \"\",", "internals: \"".$this->internals."\",", $src);
                $src = str_replace("components: \"\",", "components: \"".$this->components."\",", $src);
            }

            // if debug mode is off avoid console.logs
            if (!$this->debug) {
                $src = str_replace("console.log", "//console.log", $src);
            }

            // save the file
            $source.=$src;
        }
        
         // If mode debug is on, avoid minimification
        $print = (!$this->debug) ? $this->minSource($source) : $source ;
        
        // Headers
        if ($this->type=="css") {
            // Convert Sprites into DataURI!!!
            $print = ($this->datauri=="false") ? $this->encodeDataURI($print) : $print ;
            header("Content-type: text/css");
        } else {
            header("Content-type: text/javascript");
        }
        
        // Make the deliver ;)
        $deliver = "";
        $deliver .= "/**\n";
        $deliver .= "  * Chico-UI\n";
        $deliver .= "  * Packer-o-matic\n";
        $deliver .= "  * Like the pizza delivery service: \"Les than 100 milisecons delivery guarantee!\"\n";
        $deliver .= "  * @components: ".( ($this->type=="css") ? $this->components : implode(", ",$this->files) )."\n";
        $deliver .= "  * @version ".$this->version."\n";
        $deliver .= "  * @autor ".$this->autor."\n";
        $deliver .= "  *\n";
        $deliver .= "  * @based on:\n";
        
        if ($this->type=="css") {
            $deliver .= "  * CssMin\n";
            $deliver .= "  * @copyright Stoyan Stefanov on DataURI: \n";
            $deliver .= "  * @link http://www.phpied.com/data-urls-what-are-they-and-how-to-use/ \n";
            $deliver .= "  */\n";
            $deliver .= $print;
        } else {
            $deliver .= "  * JSMin\n";
            $deliver .= "  * @author Ryan Grove <ryan@wonko.com> \n";
            $deliver .= "  * @copyright 2002 Douglas Crockford <douglas@crockford.com> (jsmin.c) \n";
            $deliver .= "  * @copyright 2008 Ryan Grove <ryan@wonko.com> (PHP port) \n";
            $deliver .= "  * @link http://code.google.com/p/jsmin-php/ \n";
            $deliver .= "  */\n";
            $deliver .= ";(function($){\n".$print."\nui.init();\n})(jQuery);"; // Add ui.init() instruction to the end
        }
        
        return $deliver;
    }
}

$packer = new Packer();
echo $packer->deliver();

?>

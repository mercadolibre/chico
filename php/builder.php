<?php

class Builder {
    
/**
 * Chico-UI 
 * Builder
 */   
    public $version = "0.2";
	public $autor = "Chico Team <chico@mercadolibre.com>";
	    
    private $src = "../build/";
    //private $doc = "../docs/build/";
        
    /**
     * Constructor
     */

    function __construct() {

        // Define URL
		$url = $this->getURL();
        $url = str_replace("builder","packer",$url);
        // Get version to build
   		$content = file_get_contents("../src/js/core.js");
		$content = explode("version: ", $content);
		$content = explode("components", $content[1]);
        $version = str_replace(",","",$content[0]);
        $version = str_replace("\"","",$version);
        $version = str_replace(" ","",$version);
        $version = str_replace("\n","",$version);
        $version = str_replace("\t","",$version);

        echo "<h1>Chico-UI Builder</h1>\n";
        echo "<h3>Building files from version ".$version." ...</h3>\n";
        echo "<ul>\n";
        // Build JavaScript Source
        $this->build( $url , $this->src."chico.js" );
        $this->build( $url , $this->src."chico-min-".$version.".js" );
        $this->build( $url."?debug=true", $this->src."chico-".$version.".js" );        
        // Build StyleSheet Source
        $this->build( $url."?type=css", $this->src."chico.css" );
        $this->build( $url."?type=css", $this->src."chico-min-".$version.".css" );
        $this->build( $url."?type=css&debug=true", $this->src."chico-".$version.".css" );       
        echo "</ul>\n";   
        /*echo "<ul>\n";           
        // For Docs
        $this->build( $url , $this->doc."chico.js" );
        $this->build( $url , $this->doc."chico-min-".$version.".js" );
        $this->build( $url."?debug=true", $this->doc."chico-".$version.".js" );        
        $this->build( $url."?type=css", $this->doc."chico.css" );
        $this->build( $url."?type=css", $this->doc."chico-min-".$version.".css" );
        $this->build( $url."?type=css&debug=true", $this->doc."chico-".$version.".css" );       
        echo "</ul>\n";*/
        
        //docs.
    }
    
    private function getURL() {
		
		$pageURL = (@$_SERVER["HTTPS"] == "on") ? "https://" : "http://";
		if ($_SERVER["SERVER_PORT"] != "80") {
		    $pageURL .= $_SERVER["SERVER_NAME"].":".$_SERVER["SERVER_PORT"].$_SERVER["REQUEST_URI"];
		} else {
		    $pageURL .= $_SERVER["SERVER_NAME"].$_SERVER["REQUEST_URI"];
		}
		return $pageURL;
    }
    
    private function build( $url, $file ) {
        
         // Get content from $url
         $curl = curl_init( $url );
         // Create the file name
         $output_file = FOpen( $file, 'w' );
         // Set some headers
         curl_setopt( $curl, CURLOPT_FILE, $output_file );
         curl_setopt( $curl, CURLOPT_HEADER, 0 );
         // Exec the request
         curl_exec( $curl );
         // Print results
         echo "<li><a href=\"$file\">".$file."</a></li>";
         /*echo "<pre>";
         print_r( curl_getInfo( $curl ) );
         echo "</pre>";*/
         // Close conection
         curl_close(  $curl );
         // Close file
         FClose(  $output_file );
         
    }
}

new Builder();

?>

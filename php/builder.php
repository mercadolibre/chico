<?php

class Builder {
    
/**
 * Chico-UI 
 * Builder
 */   
    public $version = "0.1";
	public $autor = "Chico Team <chico@mercadolibre.com>";
	    
    private $src = "../build/";
    
    /**
     * Constructor
     */

    function __construct() {
        // Define URL
		$url = $this->getURL();
        $url = str_replace("builder","packer",$url);
        // Build JavaScript Source
        $this->build( $url , $this->src.'chico-min.js' );
        $this->build( $url.'?debug=true', $this->src.'chico.js' );
        // Build StyleSheet Source
        $this->build( $url.'?type=css', $this->src.'chico-min.css' );
        $this->build( $url.'?type=css&debug=true', $this->src.'chico.css' );

        
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
        
         echo "<h2><a href=\"$file\">".$file."</a></h2>";
         echo "<p>from: ".$url."</p>";
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
         echo "<pre>";
         print_r( curl_getInfo( $curl ) );
         echo "</pre>";
         // Close conection
         curl_close(  $curl );
         // Close file
         FClose(  $output_file );
         
    }
}

new Builder();

?>

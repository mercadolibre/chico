<?php

class Builder {
    
/**
 * Chico-UI 
 * Builder
 */   
    public $version = "0.1";
    public $autor = "Natan Santolo <natan.santolo@mercadolibre.com>";
    
    private $src = "../build";
    
    /**
     * Constructor
     */

    function __construct() {
        // Define URL
        $url = "http://".$_SERVER["HTTP_HOST"]."/php/packer.php";
        // Build JavaScript Source
        $this->build( $url , '../build/chico-min.js' );
        $this->build( $url.'?debug=true', '../build/chico.js' );
        // Build StyleSheet Source
        $this->build( $url.'?type=css', '../build/chico-min.css' );
        $this->build( $url.'?type=css&debug=true', '../build/chico.css' );

        
    }
    
    private function build( $url, $file ) {
        
         echo "<h2>".$file."</h2>";
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

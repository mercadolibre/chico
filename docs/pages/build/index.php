<?php

/**
 *    Chico-UI 
 *    Documentation Packer-o-matic "Automatic papá"
 */

class DocBuilder {
	private $version = "0.3";
	private $autor = "Chico Team <chico@mercadolibre.com>";
	
	private $pages = "carousel, core, css, dropdown, expando, factory, forms, get, grid, install, layer, modal, number, positioner, required, string, tabnavigator, tooltip, viewer, watchers";
	private $files;
	
	private $template;
	private $scripts;
	private $globalMenu = "";
	
	
	private function createUse($html, $file) {
		$use = $this->getUse($file);
		
		$html = str_replace("<!-- #name -->", $use[0], $this->template);
		$html = str_replace("<!-- #use -->", $use[1], $html);
		
		// Remove link of nav bar
		$html = str_replace("<a href=\"../".$file."\">".$use[0]."</a>", "<strong>".$use[0]."</strong>", $html);
		
		return $html;
	}
	
	private function getUse($file) {
		$content = file_get_contents("../".$file."/use.html");
		$content = explode("<h1>", $content);
		$name = explode("</h1>", $content[1]);
		$use = explode("</body>", $name[1]);
		
		$data[0] = $name[0];
		$data[1] = $use[0];
		
		return $data;
	}
	
	private function createDemo($html, $demo) {
    	$out = "<div class=\"docTabs\">";
    	$out.= "<ul><li><a href=\"#demo\">Demo</a></li> <li><a href=\"#sintax\">Código fuente</a></li></ul>";
    	$out.= "<div><div id=\"demo\"><h3>Demo</h3>".$demo[0]."</div>";
    	$out.= "<div id=\"sintax\"><h3>Código fuente</h3><p>El marcado de este ejemplo es:</p><code><pre name=\"code\" class=\"xml\">".$demo[0]."</pre></code>";
    	$out.= "<p>Para iniciar este ejemplo se utilizó:</p><code><pre name=\"code\" class=\"js\">".$demo[1]."</pre></code></div></div></div>";
    	
    	$html = str_replace("<!-- #demo -->", $out, $html);
    	
    	$this->scripts .= "\n\t\t/* Demo */\n".$demo[1];
				
		return $html;
    }
    
    
    private function getDemo($file) {
    	// File validation
    	if(!file_exists("../".$file."/demo.html")) {
    		return false;
    	};
    	
    	$content = file_get_contents("../".$file."/demo.html");
		$content = explode("<body>", $content);
		$content_html = explode("<script>", $content[1]);
		$content_js = explode("</script>", $content_html[1]);
		
		$data = array();
		$data[0] = $content_html[0];
		$data[1] = $content_js[0];
		
		return $data;
    }
    
    
    private function createCases($html, $cases, $file){
    	$out = array();
		
		for($i = 0; $i < $cases; $i += 1){
			$data = $this->getCases($file, $i);
			
			$self = "<div class=\"ch-g2-3\"><div class=\"leftcolumn cases\">".$data[0]."</div></div>";
			$self.= "<div class=\"ch-g1-3\"><div class=\"rightcolumn\"><p>El Javascript para iniciarlo es:</p>";
			$self.= "<code><pre name=\"code\" class=\"js\">".$data[1]."</pre></code></div></div>";
			
			$this->scripts .= "\n\n\t\t/* Case ".($i + 1)." */\n".$data[1];
			
			array_push($out, $self);
		};
		
		$out = "<div class=\"box cases\"><h3>Casos de uso</h3>".implode("", $out)."</div>";
		$html = str_replace("<!-- #cases -->", $out, $html);
		
		return $html;
    }
    
    private function getCases($file, $index){
    	$content = file_get_contents("../".$file."/cases/case".($index + 1).".html");
		$content = explode("<body>", $content);
		$content_html = explode("<script>", $content[1]);	
		$content_js = explode("</script>", $content_html[1]);
		
		$data = array();
		$data[0] = $content_html[0];
		$data[1] = $content_js[0];
		
		return $data;
    }

	
	private function createFile($file) {
		$this->scripts = ""; // All scripts that will be executed at end of page
		$html = $this->template;
		
		// Name + Uses
		$html = $this->createUse($html, $file);
		
		// Demo + Sintax
		$demo = $this->getDemo($file);
		if($demo) $html = $this->createDemo($html, $demo);
		
		// Cases
		$cases = count(glob("../".$file."/cases/case*.html"));
		if($cases > 0) $html = $this->createCases($html, $cases, $file);
		
		// Scripts
		$html = str_replace("<!-- #scripts -->", "<script>".$this->scripts."</script>", $html);
		
		// File creation
		$filename = "../".$file."/index.html";
		if(file_exists($filename)) { // Delete file if exists
    		unlink($filename);
    	};
		$chars = file_put_contents($filename, $html); // File size
		
		return "<li><a href=\"../".$file."\">".ucfirst($file)."</a> <small>(".$chars." bytes)</small></li>";
	}
	
	
	/**
     * Constructor
     */
     
    function __construct() {
        
    	$this->files = explode(", ", $this->pages);
    	$this->template = file_get_contents("template.html");
    	
    	// Out source
    	$out_source = "<!doctype html><html><head><meta charset=\"utf-8\"><title>Doc Builder v".$this->version."</title><link rel=\"stylesheet\" href=\"../../src/css/chico.css\"></head><body>";
    	$out_source.= "<div class=\"box\"><h1>Doc Builder v".$this->version."</h1><h4>Build: ".strftime("%c")."</h4><ul>";
    	
    	// Each file
    	foreach ($this->files as $file) {
			$out_source.= $this->createFile($file);
    	};
    	
    	$out_source.= "</ul></div></body></html>";
    	echo $out_source;
    }
};

// Execution
new DocBuilder();

?>

/**
 *	@Codelighter
 * 
 * ui.codelighter();
 * $(".xml").xml();
 */

ui.codelighter = function() {
	
/**
 *  Inheritance: Create a symbolic link to myself and my direct parent
 */
	
	var self = this;
	var that = ui.controllers();
	
/**
 *  Private Members
 */
	
	$("pre").each(function(i, e){
		
		var child = {
			snippet: e.innerHTML,
			element: e,
			uid: ui.utils.index += 1
		};
		
		that.children.push( ui[e.className](child) );
	});
	

/**
 *  Expose propierties and methods
 */
	
	//ui.instances.codelighter = that.children; // Create codeligther instance
	
	return that.children;
};


/**
 *	@Codesnippet
 */
 
ui.codesnippet = function(conf){

/** 
 *  Constructor: Redefine or preset component's settings
 */
	
	conf.paintedSnippet = conf.snippet;

/**
 *  Inheritance: Create a symbolic link to myself and my direct parent
 */

	var self = this;
	var that = ui.object(); // TODO: that should be an Abstract Object

/**
 *  Private Members
 */
 
	conf.element.innerHTML = function() {
		for (var x in conf.brush){
			if (conf.brush[ x ].test(conf.paintedSnippet)) {
				conf.paintedSnippet = conf.paintedSnippet.replace(conf.brush[ x ], x);
			};
		};
		
		return conf.paintedSnippet;

	}();
	
	
/**
 *  Expose propierties and methods
 */

	that.publish = {
	
	/**
	 *  @ Public Properties
	 */

		uid: conf.uid,
		type: conf.type,
		snippet: conf.snippet,
		paintedSnippet: conf.paintedSnippet
	};
	
	return that.publish;
};


/**
 *	@Interface xml
 *	@return An interface object
 */

ui.xml = function(conf) {
    
/** 
 *  Constructor: Redefine or preset component's settings
 */
	
	conf = conf || {};
	
	conf.type = "xml";

	conf.brush = {
		"&lt;": /</g, // Menor
		"&gt;": />/g , // Mayor
		"<span class='comments'>$&</span>": /(\&lt;|&lt;)!--\s*.*?\s*--(\&gt;|&gt;)/g, // comments		
		"<span class='attrName'>$&</span>": /(id|name|class|title|alt|value|type)=".*"/g, // Attributes name
		"<span class='attrValue'>$&</span>": /".+?"/g, // Attributes
		"<span class='tag'>$&</span>": /(&lt;([a-z]|\/).*?&gt;)/g // Tag		
	};
	
	conf.snippet = conf.snippet || conf.element.innerHTML;
    
    return ui.codesnippet(conf);   
    
}

ui.factory({ component: 'xml' });



/**
 *	@Interface js
 *	@return An interface object
 */

ui.js = function(conf) {
    
/** 
 *  Constructor: Redefine or preset component's settings
 */
	
	conf = conf || {};
	
	conf.type = "js";
	
	conf.brush = {
		"<span class='operators'>$&</span>": /(\+|\-|=|\*|&|\||\%|\!|\?)/g,
		">": />amp;/g,
		"<span class='atom'>$&</span>": /(false|null|true|undefined)/g,
		"$1<span class='keywords'>$2</span>$3": /(\s)(return|new|delete|throw|else|case|break|case|catch|const|continue|default|delete|do|else|finally|for|function|if|in|instanceof|new|switch|throw|try|typeof|var|void|while|with)(\s*)/g,
		"<span class='attrValue'>$&</span>": /".+?"/g // Attributes
	};
	
	conf.snippet = conf.snippet || conf.element.innerHTML;
    
    return ui.codesnippet(conf);
    
}

ui.factory({ component: 'js' });


/**
 *	@Interface css
 *	@return An interface object
 */

ui.css = function(conf) {
    
/** 
 *  Constructor: Redefine or preset component's settings
 */
	
	conf = conf || {};
	
	conf.type = "css";
	
	conf.brush = {
		"<span class='comments'>$&</span>": /(\/\*)\s*.*\s*(\*\/)/g, // Comments
		"<span class='attrName'>$&</span>": /(\w)\s*:".*"/g, // Attributes name
		"<span class='selector'>$1$2</span>$3": /(#|\.)(\w+)({)/g, // Selectors
		"$1<span class='properties'>$2</span>$3": /({|;|\s)(\w*-*\w*)(\s*:)/g, // Properties
		"$1<span class='attrValue'>$2</span>$3": /(:)(.+?)(;)/g // Attributes
	};
	
	conf.snippet = conf.snippet || conf.element.innerHTML;
    
    return ui.codesnippet(conf);
    
}

ui.factory({ component: 'css' });
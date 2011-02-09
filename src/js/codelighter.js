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
	
	$("pre[name=code]").each(function(i, e){
		
		var child = {
			snippet: e.innerHTML,
			element: e,
			uid: ui.utils.index += 1
		};
		that.children.push( ui["code" + e.className.toUpperCase()](child) );
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
	//$(conf.element).addClass("ch-codelighter");

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

ui.codeXML = function(conf) {
    
/** 
 *  Constructor: Redefine or preset component's settings
 */
	
	conf = conf || {};
	
	conf.type = "codeXML";

	conf.brush = {
		"&lt;": /</g, // Menor
		"&gt;": />/g , // Mayor
		"<span class='ch-comment'>$&</span>": /(\&lt;|&lt;)!--\s*.*?\s*--(\&gt;|&gt;)/g, // comments		
		"<span class='ch-attrName'>$&</span>": /(id|name|class|title|alt|value|type|style|method|href|action|lang|dir|src|tabindex|usemap|data|rel|charset|encoding|size|selected|checked|placeholder|target|required|disabled|max|min|maxlength|accesskey)=".*"/g, // Attributes name
		"<span class='ch-attrValue'>$&</span>": /".+?"/g, // Attributes
		"<span class='ch-tag'>$&</span>": /(&lt;([a-z]|\/).*?&gt;)/g, // Tag
		"    ": /\t/g // Tab
	};
	
	conf.snippet = conf.snippet || conf.element.innerHTML;
    
    return ui.codesnippet(conf);   
    
};

ui.factory({ component: 'codeXML' });



/**
 *	@Interface js
 *	@return An interface object
 */

ui.codeJS = function(conf) {
    
/** 
 *  Constructor: Redefine or preset component's settings
 */
	
	conf = conf || {};
	
	conf.type = "codeJS";
	
	conf.brush = {
		"$1 $2 $3": /(<)([a-z]|\/|.*?)(>)/g,
		"<span class='ch-operator'>$&</span>": /(\+|\-|=|\*|&|\||\%|\!|\?)/g,
		">": />amp;/g,
		"<span class='ch-atom'>$&</span>": /(false|null|true|undefined)/g,		
		"$1<span class='ch-keywords'>$2</span>$3": /(^|\s|\(|\{)(return|new|delete|throw|else|case|break|case|catch|const|continue|default|delete|do|else|finally|for|function|if|in|instanceof|new|switch|throw|try|typeof|var|void|while|with)(\s*)/g,
		"<span class='ch-attrValue'>$&</span>": /(".+?")|[0-9]/g, // Attributes & numbers
		"    ": /\t/g, // Tab
		"<span class='ch-comment'>$&</span>": /(\/\*)\s*.*\s*(\*\/)/g, // Comments
		"<span class='ch-comment'>$&</span>": /(\/\/)\s*.*\s*\n*/g // Comments
		
	};
	
	conf.snippet = conf.snippet || conf.element.innerHTML;
    
    return ui.codesnippet(conf);
    
};

ui.factory({ component: 'codeJS' });


/**
 *	@Interface css
 *	@return An interface object
 */

ui.codeCSS = function(conf) {
    
/** 
 *  Constructor: Redefine or preset component's settings
 */
	
	conf = conf || {};
	
	conf.type = "codeCSS";
	
	conf.brush = {
		//"<span class='ch-selector'>$&</span>": /(a|abbr|acronym|address|applet|area|article|aside|audio|b|base|basefont|bdo|big|blockquote|body|br|button|canvas|caption|center|cite|code|col|colgroup|command|datalist|dd|del|details|dfn|dir|div|dl|dt|em|embed|fieldset|figcaption|figure|font|footer|form|frame|frameset|h1> - <h6|head|header|hgroup|hr|html|i|iframe|img|input|ins|keygen|kbd|label|legend|li|link|map|mark|menu|meta|meter|nav|noframes|noscript|object|ol|optgroup|option|output|p|param|pre|progress|q|rp|rt|ruby|s|samp|script|section|select|small|source|span|strike|strong|style|sub|summary|sup|table|tbody|td|textarea|tfoot|th|thead|time|title|tr|tt|u|ul|var|video|wbr|xmp)(\{*)/g, // Selectors
		"<span class='ch-comment'>$&</span>": /(\/\*)\s*.*\s*(\*\/)/g, // Comments
		"<span class='ch-attrName'>$&</span>": /(\w)\s*:".*"/g, // Attributes name
		"<span class='ch-selector'>$1$2</span>$3": /(#|\.)(\w+)({)/g, // Selectors
		"$1<span class='ch-property'>$2</span>$3": /({|;|\s)(\w*-*\w*)(\s*:)/g, // Properties
		"$1<span class='ch-attrValue'>$2</span>$3": /(:)(.+?)(;)/g, // Attributes
		"    ": /\t/g // Tab
	};
	
	conf.snippet = conf.snippet || conf.element.innerHTML;
    
    return ui.codesnippet(conf);
    
};

ui.factory({ component: 'codeCSS' });
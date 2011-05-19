

/** 
 * A simple utility to highlight code snippets in the HTML.
 * @name Codelighter
 * @class Codelighter 
 * @return {Object}
 * @memberOf ch 
 * @example
 * ch.codelighter();
 * $(".xml").codeXML();
 */

ch.codelighter = function() {
/**
 *  Constructor
 */
	var that = this;
		
/**
 *  Inheritance
 */

    that = ch.controllers.call(that);
    that.parent = ch.clon(that);
	
	
/**
 *  Private Members
 */

/**
 *  Protected Members
 */ 

/**
 *  Public Members
 */
	
	that["public"].uid = that.uid;
	that["public"].element = that.element;
	that["public"].type = that.type;	
	that["public"].children = that.children;	


/**
 *  Default event delegation
 */	

	$("pre[name=code]").each(function(i, e){
		
		var codesnippet = {};
			codesnippet.uid = ch.utils.index += 1;
			codesnippet.type = "codesnippet";
			codesnippet.element = e;
			codesnippet.snippet = e.innerHTML;			

		that.children.push( ch["code" + e.className.toUpperCase()].call(codesnippet) );

	});

	ch.instances.codelighter = that.children; // Create codeligther instance
	
	return that;
};



/**
 *	@Codesnippet
 */
 
ch.codesnippet = function(conf){
/**
 *  Constructor
 */
	
	var that = this;	
	
	conf = ch.clon(conf);
	that.conf = conf;
	
		
/**
 *  Inheritance
 */

    that = ch.object.call(that);
    that.parent = ch.clon(that);
	
/**
 *  Private Members
 */

	var paint = function() {
		for (var x in conf.brush){
			if (conf.brush[ x ].test(that.paintedSnippet)) {
				that.paintedSnippet = that.paintedSnippet.replace(conf.brush[ x ], x);
			};
		};

		return that.paintedSnippet;
	};
 
/**
 *  Protected Members
 */ 

	that.paintedSnippet = that.snippet;	
			
/**
 *  Public Members
 */	

	that["public"] = {};
	that["public"].uid = that.uid;
	that["public"].type = conf.type;
	that["public"].element = that.element;
	that["public"].snippet = that.snippet;
	that["public"].paintedSnippet = that.paintedSnippet;	

/**
 *  Default event delegation
 */		 	
	
	that.element.innerHTML = paint();
	
	return that;
};


/**
 *	@Interface xml
 *	@return An interface object
 */

ch.codeXML = function(conf) {
    
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
    
    this.snippet = this.snippet || this.element.innerHTML;
    
    return ch.codesnippet.call(this, conf);
    
};

ch.factory({ component: 'codeXML' });



/**
 *	@Interface js
 *	@return An interface object
 */

ch.codeJS = function(conf) {
    
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
	    
    this.snippet = this.snippet || this.element.innerHTML;
    
    return ch.codesnippet.call(this, conf);
    
};

ch.factory({ component: 'codeJS' });


/**
 *	@Interface css
 *	@return An interface object
 */

ch.codeCSS = function(conf) {
    
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
	
	this.snippet = this.snippet || this.element.innerHTML;
	
    return ch.codesnippet.call(this, conf);
    
};

ch.factory({ component: 'codeCSS' });
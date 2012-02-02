
/**
* AutoComplete is a UI-Component.
* @name AutoComplete
* @class AutoComplete
* @augments ch.Controls
* @standalone
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {String} [conf.url] The url pointing to the suggestions's service.
* @param {String} [conf.message] It represent the text when no options are shown.
* @param {Array} [conf.suggestions] The list of suggestions. Use it when you don't have server side suggestions service. Don't use conf.url with this option.
* @returns itself
* @example
* // Create a new autoComplete with configuration.
* var me = $(".example").autoComplete({
*     "url": "http://site.com/mySuggestions?q=",
*     "message": "Write..."
* });
*/
 
ch.autoComplete = function(conf){

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @private
	* @name ch.AutoComplete#that
	* @type object
	*/
	var that = this;
		
	conf = ch.clon(conf);
	
	that.conf = conf;
	that.conf.icon = false;
	that.conf.type = "autoComplete";
	that.conf.message = conf.message || "Please write to be suggested";
	that.conf.suggestions = conf.suggestions;
	that.conf.jsonpCallback = conf.jsonpCallback || "autoComplete";
	
/**
*	Inheritance
*/
	
	that = ch.controls.call(that);
	that.parent = ch.clon(that);
	
/**
*  Private Members
*/

	/**
	* Adds keyboard events.
	* @private
	* @type Function
	* @name ch.AutoComplete#shortcuts
	*/
	var shortcuts = function (items) {
		$.each(items, function (i, e) {
			$(e).bind("mouseenter", function () {
				items.eq(that.selected).removeClass("ch-autoComplete-selected");
				that.selected = i;
				items.eq(that.selected).addClass("ch-autoComplete-selected");
			}).bind("mousedown",function () {
				that.$trigger.val(items.eq(that.selected).text());
				that.$trigger.blur();
			});
		});
	};

	/**
	* Select an item.
	* @private
	* @type Function
	* @name ch.AutoComplete#selectItem
	*/
	var selectItem = function (arrow, event) {
		that.prevent(event);
		if (that.selected === (arrow === "bottom" ? that.items.length - 1 : 0)) { return; }
		that.items.eq(that.selected).removeClass("ch-autoComplete-selected");
		
		if (arrow === "bottom") { that.selected += 1; } else { that.selected -= 1; }
		that.items.eq(that.selected).addClass("ch-autoComplete-selected");
		
		
	};

/**
*  Protected Members
*/

	/**
	* The number of the selected item.
	* @protected
	* @type Number
	* @name ch.AutoComplete#selected
	*/
	that.selected = -1;

	/**
	* List of the shown suggestions.
	* @protected
	* @type Array
	* @name ch.AutoComplete#suggestions
	*/
	that.suggestions = that.conf.suggestions;

	/**
	* The input where the AutoComplete works.
	* @protected
	* @type jQuery
	* @name ch.AutoComplete#$trigger
	*/
	that.$trigger = that.$element.addClass("ch-" + that.type + "-trigger");

	/**
	* Inner reference to content container. Here is where the content will be added.
	* @protected
	* @type jQuery
	* @name ch.AutoComplete#$content
	*/
	that.$content = $("<ul class=\"ch-" + that.type + "-content\">");

	/**
	* The Float that show the suggestions's list.
	* @protected
	* @type ch.Layer
	* @name ch.AutoComplete#float
	*/
	that.float = that.$trigger.attr("autocomplete","off")
		// Initialize Layer component
		.layer({
			"event": "click",
			"content": that.$content,
			"points": conf.points,
			"classes": "ch-autoComplete",
			"closeButton": false,
			"offset": "0 0",
			"cache": false,
			"closeHandler": "button"
		})
		.on("ready", function () {
			that.float.width((that.$trigger.outerWidth()));
		});

	/**
	* It fills the content inside the element represented by the float.
	* @protected
	* @type Function
	* @name ch.AutoComplete#populateContent
	*/
	that.populateContent = function(result){
		that.$content = $("<ul class=\"ch-" + that.type + "-content\"><li>"+result.join("</li><li>")+"</li></ul>");
		that.items = that.$content.find("li");
		that.selected = -1;
		shortcuts(that.items);
		that.float.content(that.$content);
		return that;
	}

	/**
	* It does the query to the server if configured an URL, or it does the query inside the array given.
	* @protected
	* @type Function
	* @name ch.AutoComplete#doQuery
	*/
	that.doQuery = function(event){
		var q = that.$trigger.val().toLowerCase();
		// When URL is configured it will execute an ajax request.
		if(that.conf.url!==undefined && q!==""){
			var result = $.ajax({
				url: that.conf.url + q,
				dataType:"jsonp",
				jsonpCallback:that.conf.jsonpCallback,
				crossDomain:true,
				success: function(data){}
			});
		// When not URL configured and suggestions array were configured it search inside the suggestions array.
		} else if(that.conf.url===undefined && q!=="") {
			var result = [];
			for(var a=(that.suggestions.length-1);(a+1);a--){
				var word = that.suggestions[a].toLowerCase();
				var exist = word.search(q);
				if(!exist){
					result.push(that.suggestions[a]);
				}
			}
			that.populateContent(result);
		}
		return that;
	}

	/**
	* It gives the main behavior(focus and blur) to the $trigger.
	* @protected
	* @type Function
	* @name ch.AutoComplete#configBehavior
	*/
	that.configBehavior = function () {
		that.$trigger
			.bind("focus", function (event) { 
				  that.show(event);
			})
			.bind("blur", function (event) { 
				 that.hide(event);
			});
		return that;
	};

	/**
	* Internal show method. It adds the behavior.
	* @protected
	* @type Function
	* @name ch.AutoComplete#show
	*/
	that.show = function(event){
		// BACKSPACE key bheavior. When backspace go to the start show the message
		ch.utils.document.bind(ch.events.KEY.BACKSPACE, function (x, event) { if( event.target.value.length<=1 ){ that.populateContent([that.conf.message]); }});
		// UP ARROW key behavior
		ch.utils.document.bind(ch.events.KEY.UP_ARROW, function (x, event) { selectItem("up", event); });
		// DOWN ARROW key behavior
		ch.utils.document.bind(ch.events.KEY.DOWN_ARROW, function (x, event) { selectItem("bottom", event); });
		// ESC key behavior
		ch.utils.document.bind(ch.events.KEY.ESC, function (x, event) { that.$trigger.trigger("blur"); });
		// ENTER key behavior
		ch.utils.document.bind(ch.events.KEY.ENTER, function (x, event) {  that.$trigger.val(that.items.eq(that.selected).text()); that.$trigger.trigger("blur"); });
		// Global keyup behavior
		ch.utils.document.bind("keyup", function (event) { 
			if(event.keyCode!==38 && event.keyCode!==40  && event.keyCode!==13  && event.keyCode!==27){that.doQuery(event);}
		});
		that.doQuery(event);
		return that;
	}

	/**
	* Internal hide method. It removes the behavior.
	* @protected
	* @type Function
	* @name ch.AutoComplete#hide
	*/
	that.hide = function(event){
		ch.utils.document.unbind("keyup " + ch.events.KEY.ENTER + " " + ch.events.KEY.ESC + " " + ch.events.KEY.UP_ARROW + " " + ch.events.KEY.DOWN_ARROW + " " + ch.events.KEY.BACKSPACE);
		that.float.hide();
		return that;
	}
/**
*  Public Members
*/
 
	/**
	* The component's instance unique identifier.
	* @public
	* @name ch.AutoComplete#uid
	* @type number
	*/
	
	/**
	* The element reference.
	* @public
	* @name ch.AutoComplete#element
	* @type HTMLElement
	*/
	
	/**
	* The component's type.
	* @public
	* @name ch.AutoComplete#type
	* @type string
	*/
	
	/**
	* Shows component's content.
	* @public
	* @function
	* @name ch.AutoComplete#show
	* @returns itself
	*/
	that["public"].show = function(){
		that.show();
		return that["public"];
	};

	/**
	* Hides component's content.
	* @public
	* @function
	* @name ch.AutoComplete#hide
	* @returns itself
	*/	
	that["public"].hide = function(){
		that.hide(ch.events.KEY.ESC);
		return that["public"];
	};

	/**
	* Add suggestions to be shown.
	* @public
	* @function
	* @name ch.AutoComplete#suggest
	* @returns itself
	*/	
	that["public"].suggest = function(data){
		that.suggestions = data;
		that.populateContent(that.suggestions);
		return that["public"];
	};

	
	//Fills the Float with the message.
	that.populateContent([that.conf.message]);

/**
*  Default event delegation
*/	
	that.configBehavior();
	
	/**
	* Triggers when the component is ready to use (Since 0.8.0).
	* @name ch.AutoComplete#ready
	* @event
	* @public
	* @example
	* // Following the first example, using 'me' as autoComplete's instance controller:
	* me.on("ready",function () {
	*	this.show();
	* });
	*/
	setTimeout(function(){ that.trigger("ready")}, 50);

	return that;
};

ch.factory("autoComplete");
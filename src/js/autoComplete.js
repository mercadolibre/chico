
/**
* AutoComplete is a UI-Component.
* @name AutoComplete
* @class AutoComplete
* @augments ch.Navs
* @standalone
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {Boolean} [conf.open] Shows the autoComplete open when component was loaded. By default, the value is false.
* @param {Boolean} [conf.fx] Enable or disable UI effects. By default, the effects are disable.
* @returns itself
* @example
* // Create a new autoComplete with configuration.
* var me = $(".example").autoComplete({
*     "open": true,
*     "fx": true
* });
* @example
* // Create a new autoComplete without configuration.
* var me = $(".example").autoComplete();
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
	
/**
*	Inheritance
*/

	that = ch.navs.call(that);
	that.parent = ch.clon(that);
	
	that.$element.parent("form").bind("submit",function(e){e.preventDefault()});
	
/**
*  Private Members
*/

	that.selected = -1;

	/**
	* Adds keyboard events.
	* @private
	* @function
	* @name ch.AutoComplete#shortcuts
	*/
	
	var shortcuts = function (items) {
		$.each(items, function (i, e) {
			$(e).bind("mouseenter", function () {
				items.eq(that.selected).removeClass("ch-autoComplete-selected");
				that.selected = i;
				items.eq(that.selected).addClass("ch-autoComplete-selected");
				
				
			}).bind("mouseleave",function () {
				
			}).bind("mousedown",function () {
				that.$trigger.val(items.eq(that.selected).text());
				that.$trigger.blur();
			});
		});
	};
	
	// move out of shortcuts
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
	
	var $nav = that.$element.children();
		that.$trigger = $nav.eq(0).attr("autocomplete","off");
		that.$content = $nav.eq(1);

	that.populateContent = function(result){
		that.$content.html("");
		var content = "<li>"+result.join("</li><li>")+"</li>";
		that.$content = $nav.eq(1).append(content);
		that.items = that.$content.find("li");
		that.selected = -1;
		shortcuts(that.items);
	}
	
	that.doQuery = function(event){
		if(event.keyCode!==38 && event.keyCode!==40  && event.keyCode!==13  && event.keyCode!==27){
			var q = that.$trigger.val(); 
			var result = $.ajax({
				url: that.conf.url + q,
				dataType:"jsonp",
				jsonp:conf.doQuery,
				crossDomain:true,
				success: function(data){}
			});
		}
	}
	
	that.configBehavior = function () {
		that.$trigger
			.addClass("ch-" + that.type + "-trigger")
			.bind("focus", function (event) { 
				  that.show(event);
			})
			.bind("blur", function (event) { 
				 that.hide(event);
			});
		that.$content.addClass("ch-" + that.type + "-content ch-hide");
		that.position = ch.positioner({element:that.$content,context:that.$trigger,points:"lt lb"});
	};
	
	that.show = function(event){
		that.parent.show();
		ch.utils.document.bind(ch.events.KEY.UP_ARROW, function (x, event) { selectItem("up", event); });
		ch.utils.document.bind(ch.events.KEY.DOWN_ARROW, function (x, event) { selectItem("bottom", event); });
		ch.utils.document.bind(ch.events.KEY.ESC, function (x, event) { that.$trigger.trigger("blur"); });
		ch.utils.document.bind(ch.events.KEY.ENTER, function (x, event) {  that.$trigger.val(that.items.eq(that.selected).text()); that.$trigger.trigger("blur"); });
		if(that.conf.url){
			ch.utils.document.bind("keyup", function (event) { that.doQuery(event); });
		}
		return that;
	}
	
	that.hide = function(event){
		that.doQuery(event);
		
		that.parent.hide(event);
		ch.utils.document.unbind("keyup " + ch.events.KEY.ENTER + " " + ch.events.KEY.ESC + " " + ch.events.KEY.UP_ARROW + " " + ch.events.KEY.DOWN_ARROW);
		return that;
	}
	
	that.populateContent(["Please write to be suggested"]);
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
	* Hides component's content.
	* @public
	* @function
	* @name ch.AutoComplete#hide
	* @returns itself
	*/	
	that["public"].suggest = function(data){
		that.populateContent(data);
		return that["public"];
	};

/**
*  Default event delegation
*/	
	
	that.configBehavior();
	
	/**
	* Triggers when the component is ready to use (Since 0.8.0).
	* @name ch.AutoComplete#ready
	* @event
	* @public
	* @since 0.8.0
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
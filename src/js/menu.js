
/**
 * Menu is a UI-Component.
 * @name Menu
 * @class Menu
 * @augments ch.Controllers
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @return {Chico-UI Object}
 */
 
ch.menu = function(conf){

    /**
     * Reference to a internal component instance, saves all the information and configuration properties.
     * @private
     * @name that
     * @type {Object}
     * @memberOf ch.Menu
     */	
	var that = this;
	
	conf = ch.clon(conf);
	that.conf = conf;
	
/**
 *	Inheritance
 */
    that = ch.controllers.call(that);
    that.parent = ch.clon(that);

/**
 *  Private Members
 */

	var selected = conf.selected - 1;

	var createLayout = function(){

		// Children
		that.$element.children().each(function(i, e){
		
			var $child = $(e).children();
		
			// Link
			if($child.eq(0).prop("tagName") == "A") {
				$(e).addClass("ch-bellows").children().addClass("ch-bellows-trigger");
				that.children.push( $child[0] );
				return;
			};
		
			// Expando
			var expando = $(e).expando({
				 fx: true,
				 onShow: function(){
					selected = i;
				 }
			});

			that.children.push( expando );

		});
	};
	
	var select = function(item){

		var child, grandson;
				
		if (typeof item == "string") {
			var sliced = item.split("#");
			child = sliced[0] - 1;
			grandson = sliced[1];
		} else {
			child = item - 1;
		};

		if (that.children[ child ].hasOwnProperty("uid")){
			that.children[ child ].show();
			if (grandson) $(that.children[ child ].element).find("a").eq(grandson - 1).addClass("ch-bellows-on");

			if (conf.accordion) {
				$.each(that.children, function(i, e){
					if ( (e.tagName != "A") && e.hasOwnProperty("uid") && (that.children[ child ].uid != that.children[i].uid) ) {
						e.hide();
					};
				});
			};

		} else{
			that.children[ child ].addClass("ch-bellows-on");
		};

		that.callbacks("onSelect");

		return that;
	};

	var configureAccordion = function(){

		$.each(that.children, function(i, e){
			$(e.element).find(".ch-expando-trigger").unbind("click").bind("click", function(){
				select(i + 1);
			});
		});

	};

/**
 *  Protected Members
 */

/**
 *  Public Members
 */
    /**
     * The component's instance unique identifier.
     * @public
     * @name uid
     * @type {Number}
     * @memberOf ch.Menu
     */ 	
	that["public"].uid = that.uid;
	
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Menu
     */
	that["public"].element = that.element;
	
    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Menu
     */
	that["public"].type = that.type;
	
    /**
     * Select a specific children.
     * @public
     * @name select
     * @function
     * @memberOf ch.Menu
     */
	that["public"].select = function(item){
		select(item);

		return that["public"];
	};	

/**
 *  Default event delegation
 */	

	that.$element.addClass('ch-menu');
	
	createLayout();

	if (conf.accordion) configureAccordion();

    if (conf.hasOwnProperty("selected")) select(conf.selected);
    
	return that;
	
};


/**
 * Accordion is a UI-Component.
 * @name Accordion
 * @class Accordion
 * @augments ch.Accordion
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @return {Chico-UI Object}
 */

ch.accordion = function(conf) {
    
    conf = conf || {};
	
	conf.accordion = true;

	return ch.menu.call(this, conf);

    /**
     * The component's instance unique identifier.
     * @public
     * @name uid
     * @type {Number}
     * @memberOf ch.Accordion
     */     
    
    /**
     * The element reference.
     * @public
     * @name element
     * @type {HTMLElement}
     * @memberOf ch.Accordion
     */
    
    /**
     * The component's type.
     * @public
     * @name type
     * @type {String}
     * @memberOf ch.Accordion
     */
    
    /**
     * Select a specific children.
     * @public
     * @name select
     * @function
     * @memberOf ch.Accordion
     */
    
};

ch.factory({ component: 'accordion' });

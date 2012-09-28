/**
* Floats brings the functionality of all Floats elements.
* @abstract
* @name ch.Floats
* @class Floats
* @augments ch.Uiobject
* @requires ch.Positioner
* @returns itself
* @see ch.Tooltip
* @see ch.Layer
* @see ch.Modal
* @see ch.Controls
* @see ch.Transition
* @see ch.Zoom
* @see ch.Uiobject
* @see ch.Positioner
*/

ch.floats = function () {

	/**
	* Reference to a internal component instance, saves all the information and configuration properties.
	* @protected
	* @name ch.Floats#that
	* @type object
	*/
	var that = this,
		conf = that.conf;
/**
* Inheritance
*/

	that = ch.uiobject.call(that);
	that.parent = ch.clon(that);

/**
* Private Members
*/

	/**
	* Creates a 'cone', is a visual asset for floats.
	* @private
	* @function
	* @deprecated
	* @name ch.Floats#createCone
	*/

	/**
	* Creates close button.
	* @private
	* @function
	* @deprecated
	* @name ch.Floats#createClose
	*/

	/**
	* Closable behavior.
	* @private
	* @function
	* @name ch.Floats-closable
	*/
	// TODO: Create "closable" interface
	var closable = (function () {
		/**
		* Returns any if the component closes automatic.
		* @public
		* @function
		* @methodOf ch.Floats#closabe
		* @exampleDescription to get the height
		* @example
		* widget.closable() // true | false | "button"
		* @returns boolean | string
		*/
		that["public"].closable = function () {
			return that.closable;
		};


		return function () {

			// Closable Off: don't anything
			if (!that.closable) { return; }

			// Closable On
			if (ch.utils.hasOwn(conf, "closeButton") && conf.closeButton || ch.utils.hasOwn(conf, "event") && conf.event === "click") {
				// Append close buttons
				// It will close with close button
				that.$container
					.prepend("<a class=\"ch-close\" role=\"button\" style=\"z-index:" + (ch.utils.zIndex += 1) + "\"></a>")
					.on("click", function (event) {
						if ($(event.target || event.srcElement).hasClass("ch-close")) {
							that.innerHide(event);
						}
					});
			}

			// ESC key support
			ch.utils.document.on(ch.events.KEY.ESC, function () {
				that.innerHide();
			});

			// It will close only with close button
			if (that.closable === "button") {
				return;
			}

			// Default Closable behavior
			// It will close with click on document, too
			that.on("show", function () {
				ch.utils.document.one("click", that.innerHide);
			});

			// Stop event propatation, if click container.
			that.$container.on("click", function (event) {
				event.stopPropagation();
			});
		};

	})();

/**
* Protected Members
*/
	/**
	* Flag that indicates if the float is active and rendered on the DOM tree.
	* @protected
	* @name ch.Floats#active
	* @type boolean
	*/
	that.active = false;

	/**
	* It sets the hablity of auto close the component or indicate who closes the component.
	* @protected
	* @function
	* @name ch.Floats#closable
	* @type boolean | string
	*/
	that.closable = ch.utils.hasOwn(conf, "closable") ? conf.closable: true;

	/**
	* Content configuration property.
	* @protected
	* @name ch.Floats#source
	* @type string
	*/
	that.source = conf.content || conf.msg || conf.ajax || that.element.href || that.$element.parents("form").attr("action");

	/**
	* Inner function that resolves the component's layout and returns a static reference.
	* @protected
	* @name ch.Floats#$container
	* @type jQuery
	*/
	that.$container = (function () { // Create Layout

		// Final jQuery Object
		var $container,

		// HTML Div Element with role for WAI-ARIA
			container = ["<div role=\"" + conf.aria.role + "\""];

		// ID for WAI-ARIA
		if (ch.utils.hasOwn(conf.aria, "identifier")) {

			// Generated ID using component name and its instance order
			var id = "ch-" + that.type + "-" + (ch.utils.hasOwn(ch.instances, that.type) ? ch.instances[that.type].length + 1 : "1");

			// Add ID to container element
			container.push(" id=\"" + id + "\"");

			// Add aria attribute to trigger element
			that.$element.attr(conf.aria.identifier, id);
		}

		// Classname with component type and extra classes from conf.classes
		container.push(" class=\"ch-hide ch-" + that.type + (ch.utils.hasOwn(conf, "classes") ? " " + conf.classes : "") + "\"");

		// Z-index
		container.push(" style=\"z-index:" + (ch.utils.zIndex += 1) + ";");

		// Width
		if (ch.utils.hasOwn(conf, "width")) {
			container.push("width:" + conf.width + ((typeof conf.width === "number") ? "px;" : ";"));
		}

		// Height
		if (ch.utils.hasOwn(conf, "height")) {
			container.push("height:" + conf.height + ((typeof conf.height === "number") ? "px;" : ";"));
		}

		// Style and tag close
		container.push("\">");

		// Create cone
		if (ch.utils.html.hasClass("lt-ie8") && ch.utils.hasOwn(conf, "cone")) {
			container.push("<div class=\"ch-" + that.type + "-cone\"></div>");
		}

		// Tag close
		container.push("</div>");

		// jQuery Object generated from string
		$container = $(container.join(""));

		// Create cone
		if (ch.utils.hasOwn(conf, "cone")) { $container.addClass("ch-cone"); }

		// Efects configuration
		conf.fx = ch.utils.hasOwn(conf, "fx") ? conf.fx : true;

		// Position component configuration
		conf.position = conf.position || {};
		conf.position.element = $container;
		conf.position.reposition = ch.utils.hasOwn(conf, "reposition") ? conf.reposition : true;

		// Initialize positioner component
		that.position = ch.positioner(conf.position);

		// Return the entire Layout
		return $container;
	})();

	/**
	* Inner reference to content container. Here is where the content will be added.
	* @protected
	* @name ch.Floats#$content
	* @type jQuery
	* @see ch.Object#content
	*/
	that.$content = $("<div class=\"ch-" + that.type + "-content\">").appendTo(that.$container);

	/**
	* This callback is triggered when async data is loaded into component's content, when ajax content comes back.
	* @protected
	* @function
	* @name ch.Floats#contentCallback
	* @returns itself
	*/
	that["public"].on("contentLoad", function (event, context) {
		that.$content.html(that.staticContent);

		if (ch.utils.hasOwn(conf, "onContentLoad")) {
			conf.onContentLoad.call(context, that.staticContent);
		}

		that.position("refresh");
	});

	/**
	* This callback is triggered when async request fails.
	* @protected
	* @name ch.Floats#contentError
	* @function
	* @returns {this}
	*/
	that["public"].on("contentError", function (event, data) {

		that.$content.html(that.staticContent);

		// Get the original that.source
		var originalSource = that.source;

		if (ch.utils.hasOwn(conf, "onContentError")) {
			conf.onContentError.call(data.context, data.jqXHR, data.textStatus, data.errorThrown);
		}

		// Reset content configuration
		that.source = originalSource;
		that.staticContent = undefined;

		if (ch.utils.hasOwn(conf, "position")) {
		   ch.positioner(conf.position);
		}

	});

	/**
	* Inner show method. Attach the component layout to the DOM tree.
	* @protected
	* @function
	* @name ch.Floats#innerShow
	* @returns itself
	*/
	that.innerShow = function (event) {
		if (event) {
			that.prevent(event);
		}

		// Avoid showing things that are already shown
		if (that.active) return;

		// Add layout to DOM tree
		// Increment zIndex
		that.$container
			.appendTo("body")
			.css("z-index", ch.utils.zIndex++);

		// This make a reflow, but we need that the static content appends to DOM
		// Get content
		that.content();

		/**
		* Triggers when component is visible.
		* @name ch.Floats#show
		* @event
		* @public
		* @exampleDescription It change the content when the component was shown.
		* @example
		* widget.on("show",function () {
		*	this.content("Some new content");
		* });
		* @see ch.Floats#show
		*/
		// Show component with effects
		if (conf.fx) {
			that.$container.fadeIn("fast", function () {

				that.$container.removeClass("ch-hide");
				// new callbacks
				that.trigger("show");
				// Old callback system
				that.callbacks('onShow');

			});
		} else {
		// Show component without effects
			that.$container.removeClass("ch-hide");
			// new callbacks
			that.trigger("show");
			// Old callback system
			that.callbacks('onShow');
		}

		that.position("refresh");

		that.active = true;

		return that;
	};

	/**
	* Inner hide method. Hides the component and detach it from DOM tree.
	* @protected
	* @function
	* @name ch.Floats#innerHide
	* @returns itself
	*/
	that.innerHide = function (event) {

		if (event) {
			event.stopPropagation();
		}

		if (!that.active) {
			return;
		}

		var afterHide = function () {

			that.active = false;

		/**
		* Triggers when component is not longer visible.
		* @name ch.Floats#hide
		* @event
		* @public
		* @exampleDescription When the component hides show other component.
		* @example
		* widget.on("hide",function () {
		*	otherComponent.show();
		* });
		*/
			// new callbacks
			that.trigger("hide");
			// Old callback system
			that.callbacks('onHide');

			that.$container.detach();

		};

		// Show component with effects
		if (conf.fx) {
			that.$container.fadeOut("fast", afterHide);

		// Show component without effects
		} else {
			that.$container.addClass("ch-hide");
			afterHide();
		}

		// Removes the innerHide listener
		// #708 Modal: The widget closes by itself when It's showing the second time
		ch.utils.document.off("click", that.innerHide);

		return that;

	};

	/**
	* Getter and setter for size attributes on any float component.
	* @protected
	* @function
	* @name ch.Floats#size
	* @param {String} prop Property that will be setted or getted, like "width" or "height".
	* @param {String} [data] Only for setter. It's the new value of defined property.
	* @returns itself
	*/
	that.size = function (prop, data) {
		// Getter
		if (!data) { return that.conf[prop]; }

		// Setter
		that.conf[prop] = data;

		// Container size
		that.$container[prop](data);

		// Refresh position
		that.position("refresh");

		return that["public"];
	};


/**
* Public Members
*/

	/**
	* @borrows ch.Object#on as ch.Floats#on
	*/

	/**
	* @borrows ch.Object#once as ch.Floats#once
	*/

	/**
	* @borrows ch.Object#off as ch.Floats#off
	*/

	//Documented again because the method works in this class
	/**
	* Sets and gets component content. To get the defined content just use the method without arguments, like 'widget.content()'. To define a new content pass an argument to it, like 'widget.content("new content")'. Use a valid URL to get content using AJAX. Use a CSS selector to get content from a DOM Element. Or just use a String with HTML code.
	* @public
	* @name ch.Uiobject#content
	* @function
	* @param {string} content Static content, DOM selector or URL. If argument is empty then will return the content.
	* @exampleDescription Get the defined content
	* @example
	* widget.content();
	* @exampleDescription Set static content
	* @example
	* widget.content("Some static content");
	* @exampleDescription Set DOM content
	* @example
	* widget.content("#hiddenContent");
	* @exampleDescription Set AJAX content
	* @example
	* widget.content("http://chico.com/some/content.html");
	*/

	/**
	* Triggers the innerShow method, returns the public scope to keep method chaining and sets new content if receive a parameter.
	* @public
	* @function
	* @name ch.Floats#show
	* @returns itself
	* @see ch.Floats#content
	*/
	that["public"].show = function (content) {
		if (content !== undefined) { that["public"].content(content); }
		that.innerShow();
		return that["public"];
	};

	/**
	* Triggers the innerHide method and returns the public scope to keep method chaining.
	* @public
	* @function
	* @name ch.Floats#hide
	* @returns itself
	*/
	that["public"].hide = function () {
		that.innerHide();
		return that["public"];
	};

	/**
	* Sets or gets positioning configuration. Use it without arguments to get actual configuration. Pass an argument to define a new positioning configuration.
	* @public
	* @function
	* @name ch.Floats#position
	* @exampleDescription Change component's position.
	* @example
	* widget.position({
	*	  offset: "0 10",
	*	  points: "lt lb"
	* });
	* @exampleDescription Refresh position.
	* @example
	* widget.position("refresh");
	* @see ch.Floats#position
	*/
	// Create a custom Positioner object to update conf.position data of Float family
	that["public"].position = function (o) {

		var r = that["public"];

		switch (typeof o) {
		// Custom Setter: It updates conf.position data
		case "object":
			// New points
			if (ch.utils.hasOwn(o, "points")) { conf.position.points = o.points; }

			// New reposition
			if (ch.utils.hasOwn(o, "reposition")) { conf.position.reposition = o.reposition; }

			// New offset (splitted)
			if (ch.utils.hasOwn(o, "offset")) { conf.position.offset = o.offset; }

			// New context
			if (ch.utils.hasOwn(o, "context")) { conf.position.context = o.context; }

			// Original Positioner
			that.position(conf.position);

			break;

		// Refresh
		case "string":
			that.position("refresh");

			break;

		// Getter
		case "undefined":
		default:
			r = that.position();

			break;
		}

		return r;
	};

	/**
	* Sets or gets the width property of the component's layout. Use it without arguments to get the value. To set a new value pass an argument, could be a Number or CSS value like '300' or '300px'.
	* @public
	* @function
	* @name ch.Floats#width
	* @param {Number|String} [width]
	* @returns itself
	* @see ch.Zarasa#size
	* @see ch.Floats#size
	* @exampleDescription to set the width
	* @example
	* widget.width(700);
	* @exampleDescription to get the width
	* @example
	* widget.width() // 700
	*/
	that["public"].width = function (data) {
		return that.size("width", data) || that["public"];
	};

	/**
	* Sets or gets the height of the Float element.
	* @public
	* @function
	* @name ch.Floats#height
	* @returns itself
	* @see ch.Floats#size
	* @exampleDescription to set the height
	* @example
	* widget.height(300);
	* @exampleDescription to get the height
	* @example
	* widget.height // 300
	*/
	that["public"].height = function (data) {
		return that.size("height", data) || that["public"];
	};

	/**
	* Returns a Boolean if the component's core behavior is active. That means it will return 'true' if the component is on and it will return false otherwise.
	* @public
	* @function
	* @name ch.Floats#isActive
	* @returns boolean
	*/
	that["public"].isActive = function () {
		return that.active;
	};

	/**
	* Triggers when the component is ready to use.
	* @name ch.Floats#ready
	* @event
	* @public
	* @exampleDescription Following the first example, using <code>widget</code> as modal's instance controller:
	* @example
	* widget.on("ready",function () {
	*	this.show();
	* });
	*/
	that.trigger("ready");

	/**
	*	Default behavior
	*/

	// Add Closable behavior
	closable();


	return that;

};
/**
* Creates required validations.
* @name Required
* @class Required
* @interface
* @augments ch.Controls
* @memberOf ch
* @param {Object} [conf] Object with configuration properties.
* @param {String} [conf.message] Validation message.
* @param {String} [conf.points] Sets the points where validation-bubble will be positioned.
* @param {String} [conf.offset] Sets the offset in pixels that validation-bubble will be displaced from original position determined by points. It's specified by configuration or zero by default: "0 0".
* @param {String} [conf.context] It's a reference to position the validation-bubble
* @returns itself
* @see ch.Validation
* @see ch.Custom
* @see ch.Number
* @see ch.String
* @see ch.Validator
* @see ch.Condition
* @example
* // Simple validation
* $("input").required("This field is required");
*/
ch.extend("validation").as("required", function(conf) {

	conf.condition = {
		name: "required",
		expr: function(e) {

			var $e = $(e);

			var tag = ( $e.hasClass("options") || $e.hasClass("ch-form-options")) ? "OPTIONS" : e.tagName;
			switch (tag) {
				case 'OPTIONS':
					return $e.find('input:checked').length !== 0;
				break;

				case 'SELECT':
					var val = $e.val();
					return (val != "-1" && val != "");
				break;

				case 'INPUT':
				case 'TEXTAREA':
					return $.trim($e.val()).length !== 0;
				break;
			};
		},
		message: conf.msg || conf.message,
		value: conf.value
	};

	return conf;

});
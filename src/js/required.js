/**
* Creates required validations.
* @name Required
* @class Required
* @interface
* @augments ch.Validator
* @memberOf ch
* @param {object} conf Object with configuration properties
* @returns itself
* @see ch.Validator
* @see ch.Custom
* @see ch.Number
* @see ch.String
* @example
* // Simple validation
* $("input").required("This field is required");
*/
ch.extend("watcher").as("required", function(conf) {

	conf.condition = {
		name: "required",
		expr: function(e) {

			var $e = $(e);

			var tag = ( $e.hasClass("options")) ? "OPTIONS" : e.tagName;
			switch (tag) {
				case 'OPTIONS':
					return $e.find('input:checked').length !== 0;
				break;

				case 'SELECT':
					var val = $e.val();
					return (val != "-1");
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
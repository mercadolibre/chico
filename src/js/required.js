
/**
 * Required interface for Watcher.
 * @name Required
 * @class
 * @interface
 * @augments ch.Watcher
 * @memberOf ch
 * @param {Configuration Object} conf Object with configuration properties
 * @returns {Chico-UI Object}
 * @see ch.Number
 * @see ch.String
 * @see ch.Custom
 * @example
 * // Simple validation
 * $("input").required("This field is required");
 * @see ch.Watcher
 */

ch.extend("watcher").as("required", function(conf) {
    
    // Define the validation interface    
    conf.required = true;
    // Define the conditions of this interface
    conf.conditions = [{
        name: "required"
    }];
    
    return conf;
    
});
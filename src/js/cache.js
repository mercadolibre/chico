
/**
* Cache control utility.
* @abstract
* @name Cache
* @class Cache
* @memberOf ch
*/

ch.cache = {

	/**
	* Map of resources cached
	* @name map 
	* @type {Object}
	* @memberOf ch.Cache
	*/
	map: {},
	
	/**
	* Set a resource to the cache control
	* @function 
	* @name set
	* @param {String} url Resource location
	* @param {String} data Resource information
	* @memberOf ch.Cache
	*/
	set: function(url, data) {
		ch.cache.map[url] = data;
	},
	
	/**
	* Get a resource from the cache
	* @function
	* @name get
	* @param {String} url Resource location
	* @returns {String} data Resource information
	* @memberOf ch.Cache
	*/
	get: function(url) {
		return ch.cache.map[url];
	},
	
	/**
	* Remove a resource from the cache
	* @function
	* @name rem
	* @param {String} url Resource location
	* @memberOf ch.Cache
	*/
	rem: function(url) {
		ch.cache.map[url] = null;
		delete ch.cache.map[url];
	},
	
	/**
	* Clears the cache map
	* @function
	* @name flush
	* @memberOf ch.Cache
	*/
	flush: function() {
		delete ch.cache.map;
		ch.cache.map = {};
	}
};
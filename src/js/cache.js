
/**
* Cache control utility.
* @abstract
* @name Cache
* @class Cache
* @memberOf ch
*/

ch.cache = {

	/**
	* Map of cached resources
	* @public
	* @name ch.Cache#map 
	* @type object
	*/
	map: {},
	
	/**
	* Set a resource to the cache control
	* @public
	* @function 
	* @name ch.Cache#set
	* @param {string} url Resource location
	* @param {string} data Resource information
	*/
	set: function(url, data) {
		ch.cache.map[url] = data;
	},
	
	/**
	* Get a resource from the cache
	* @public
	* @function
	* @name ch.Cache#get
	* @param {string} url Resource location
	* @returns data Resource information
	*/
	get: function(url) {
		return ch.cache.map[url];
	},
	
	/**
	* Remove a resource from the cache
	* @public
	* @function
	* @name ch.Cache#rem
	* @param {string} url Resource location
	*/
	rem: function(url) {
		ch.cache.map[url] = null;
		delete ch.cache.map[url];
	},
	
	/**
	* Clears the cache map
	* @public
	* @function
	* @name ch.Cache#flush
	*/
	flush: function() {
		delete ch.cache.map;
		ch.cache.map = {};
	}
};
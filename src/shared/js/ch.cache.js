/**
 * Cache control utility.
 * @name Cache
 * @class Cache
 * @memberOf ch
 */
(function (window, ch) {
	'use strict';

	if (ch === undefined) {
		throw new window.Error('Expected ch namespace defined.');
	}

	// Cache control utility.
	var cache = {};

	/**
	 * Map of cached resources
	 * @public
	 * @name ch.Cache#map
	 * @type object
	 */
	cache.map = {};

	/**
	 * Set a resource to the cache control
	 * @public
	 * @function
	 * @name ch.Cache#set
	 * @param {string} url Resource location
	 * @param {string} data Resource information
	 */
	cache.set = function (url, data) {
		cache.map[url] = data;
	};

	/**
	 * Get a resource from the cache
	 * @public
	 * @function
	 * @name ch.Cache#get
	 * @param {string} url Resource location
	 * @returns data Resource information
	 */
	cache.get = function (url) {
		return cache.map[url];
	};

	/**
	 * Remove a resource from the cache
	 * @public
	 * @function
	 * @name ch.Cache#rem
	 * @param {string} url Resource location
	 */
	cache.rem = function (url) {
		cache.map[url] = null;
		delete cache.map[url];
	};

	/**
	 * Clears the cache map
	 * @public
	 * @function
	 * @name ch.Cache#flush
	 */
	cache.flush = function () {
		delete cache.map;
		cache.map = {};
	};

	ch.cache = cache;

}(this, this.ch));
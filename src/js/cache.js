/**
 *  @class Cache
 */

ch.cache = {
    map: {},
    add: function(url, data) {
        ch.cache.map[url] = data;
    },
    get: function(url) {
        return ch.cache.map[url];
    },
    rem: function(url) {
        ch.cache.map[url] = null;
        delete ch.cache.map[url];
    },
    flush: function() {
        delete ch.cache.map;
        ch.cache.map = {};
    }
};
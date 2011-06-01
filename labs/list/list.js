/**
 * Manage collections with abstract lists. Create a list of objects, add, remove or render.
 * @abstract
 * @name List || Collection
 * @class List || Collection
 * @memberOf ch
 */

ch.List = ch.Collection = function() {


    var that = this;

    /**
     * @public
     * @name children
     * @type {Collection}
     * @memberOf ch.List
     */
    var _children = [];

    /**
     * @private
     * @function
     * @name _find
     * @param {Number} [q]
     * @param {String} [q]
     * @param {Object} [q]
     * @param {Function} [a]
     * @return {Object} Returns the finded element
     * @memberOf ch.List
     */
    var _find = function(q, a) {
        // null search return the entire collection
        if ( !q ) {
            return _children;
        }

        var c = typeof q;
        // number? return a specific position
        if ( c === "number" ) {
            q--; // _children is a Zero-index based collection
            return (a) ? a.call( that , q ) : _children[q] ;
        }
        
        // string? ok, let's find it
        var t = size(), _prop, child;
        if ( c === "string" || c === "object" ) {
            while ( t-- ) {
                child = _children[t];
                if ( c === "object" && child === q ) {
                    return (a) ? a.call( that , t ) : child ;
                }
                for ( _prop in child ) {
                    if ( _prop === q || child[_prop] === q ) {
                        return (a) ? a.call( that , t ) : child ;
                    }
                } // end for
            } // end while
        }
    };

    /**
     * Adds a new child to the collection 
     * @public
     * @function
     * @name add
     * @param {Object} child
     * @memberOf ch.List
     */
    var add = function(child) {
        return _children.push(child);
    };
    
    /**
     * Removes a child from the collection.
     * @public
     * @function
     * @name rem
     * @param {Number} [q]
     * @param {String} [q]
     * @param {Object} [q]
     * @return {Object} Returns the removed element
     * @memberOf ch.List
     */
    var rem = function(q) {
        // null search return
        if ( !q ) {
            return;
        }
        
        var remove = function( t ) {
            console.log(this);
            console.log(arguments);
            return _children.splice( t , 1 )[0];
        }

        return _find( q , remove );

    };

    /**
     * Get a child from the collection.
     * @public
     * @function
     * @name get
     * @param {Number} [q]
     * @param {String} [q]
     * @param {Object} [q]
     * @memberOf ch.List
     */
    var get = function(q) {
        return _find(q);  
    };

    /**
     * Get the amount of child from the collection.
     * @public
     * @function
     * @name size
     * @return {Number}
     * @memberOf ch.List
     */

    var size = function() {
        return _children.length;    
    };

    /**
     * @public
     */
    var that = {
        children: _children,
        add: add,
        rem: rem,
        get: get,
        size: size
    };
    
    return that;
    
};
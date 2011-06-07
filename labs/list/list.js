/**
 * Manage collections with abstract lists. Create a list of objects, add, get and remove.
 * @abstract
 * @name List
 * @class List
 * @memberOf ch
 * @param {Array} [collection] Constructs a List with an optional initial collection
 */

ch.List = function( collection ) {

    var that = this;


    var that = this;

    /**
     * @public
     * @name children
     * @type {Collection}
     * @memberOf ch.List
     */

    var _children = ( collection && ch.utils.isArray( collection ) ) ? collection : [] ;

    /**
     * Seek members inside the collection by index, query string or object comparison.
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
            return ( a ) ? a.call( that , q ) : _children[q] ;
        };
        
        // string? ok, let's find it
        var t = size(), _prop, child;
        if ( c === "string" || c === "object" ) {
            while ( t-- ) {
                child = _children[t];
                // object or string strict equal
                if ( child === q ) {
                    return ( a ) ? a.call( that , t ) : child ;
                }
                // if isn't finded yet
                // search inside an object for a string
                for ( _prop in child ) {
                    if ( _prop === q || child[_prop] === q ) {
                        return ( a ) ? a.call( that , t ) : child ;
                    }
                } // end for
            } // end while
        }
    };

    /**
     * Adds a new child (or more) to the collection.
     * @public
     * @function
     * @name add
     * @param {String} [child]
     * @param {Object} [child]
     * @param {Array} [child]
     * @memberOf ch.List
     * @returns {Number} The index of the added child.
     * @returns {Collection} Returns the entire collecction if the input is an array.
     */
    var add = function( child ) {
        
        if ( ch.utils.isArray( child ) ) {
            var i = 0, t = child.length;
            for ( i; i < t; i++ ) {
                _children.push( child[i] );
            }            
            return _children;
        }
        return _children.push( child );
    };
    
    /**
     * Removes a child from the collection by index, query string or object comparison.
     * @public
     * @function
     * @name rem
     * @param {Number} [q]
     * @param {String} [q]
     * @param {Object} [q]
     * @return {Object} Returns the removed element
     * @memberOf ch.List
     */
    var rem = function( q ) {
        // null search return
        if ( !q ) {
            return that;
        }
        
        var remove = function( t ) {
            return _children.splice( t , 1 )[0];
        }

        return _find( q , remove );

    };

    /**
     * Get a child from the collection by index, query string or object comparison.
     * @public
     * @function
     * @name get
     * @param {Number} [q] Get a child from the collection by index number.
     * @param {String} [q] Get a child from the collection by a query string.
     * @param {Object} [q] Get a child from the collection by comparing objects.
     * @memberOf ch.List
     */
    var get = function( q ) {

        return _find( q );  

    };

    /**
     * Get the amount of children from the collection.
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

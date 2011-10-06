
/**
* Manage collections with abstract lists. Create a list of objects, add, get and remove.
* @abstract
* @name List
* @class List
* @standalone
* @memberOf ch
* @param {array} [collection] Constructs a List with an optional initial collection
*/

ch.list = function( collection ) {

	var that = this;

	/**
	* @public
	* @name ch.List#children
	* @type collection
	*/
	var _children = ( collection && ch.utils.isArray( collection ) ) ? collection : [] ;

	/**
	* Seek members inside the collection by index, query string or object comparison.
	* @private
	* @function
	* @name ch.List#_find
	* @param {number} [q]
	* @param {string} [q]
	* @param {object} [q]
	* @param {function} [a]
	* @return object
	*/
	var _find = function(q, a) {
		// null search return the entire collection
		if ( !q ) {
			return _children;
		}

		var c = typeof q;
		// number? return a specific position
		if ( c === "number" ) {
			q--; // _children is a Zero-index based collection
			return ( a ) ? a.call( that , q ) : _children[q] ;
		}
		
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
					if ( _prop === q || child[_prop] === q ) {
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
	* @name ch.List#add
	* @param {string} [child]
	* @param {object} [child]
	* @param {array} [child]
	* @returns number The index of the added child.
	* @returns collection Returns the entire collecction if the input is an array.
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
	* @name ch.List#rem
	* @param {number} [q]
	* @param {string} [q]
	* @param {object} [q]
	* @return {object} Returns the removed element
	*/
	var rem = function( q ) {
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
	* @name ch.List#get
	* @param {number} [q] Get a child from the collection by index number.
	* @param {string} [q] Get a child from the collection by a query string.
	* @param {object} [q] Get a child from the collection by comparing objects.
	* @return object
	*/
	var get = function( q ) {

		return _find( q );

	};

	/**
	* Get the amount of children from the collection.
	* @public
	* @function
	* @name ch.List#size
	* @return number
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
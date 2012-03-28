/**
 * Creates a Class.
 */
var define = function (obj) {

    'use strict'

	// Class model
    var Class = function() {

		this.name = obj.name;

		obj.initialize && obj.initialize.apply(this, arguments);

		return this;

	}

	for (var key in obj) {

		if (key === 'inherits') {
			var F = function(){}, parent = obj[key];
				F.prototype  = new parent();
			Class.prototype = new F();
			Class.prototype.parent = parent;
			continue;
		}

		Class.prototype[key] = obj[key];

	}

    return Class;
    
};



var Person = define({

	name: 'Person'

,	inherits: Object

,	initialize: function() 
	{
		return this;
	}

,	destroy: function() 
	{
		console.log('Destroying ' + this.name);
		return this;
	}

,	sayhi: function() 
	{
		console.log('Hi my name is ' + this.name);
		return this;
	}
});


var Player = define({

	inherits: Person

,	initialize: function(name) 
	{
		this.name = name;
		return this;
	}

,	destroy: function() 
	{
		console.log('Destroying ' + this.name);
	}

,	saybye: function() 
	{
		console.log('Bye bye!');
		return this;
	}
})

var natan = new Player('Natan');
var ninja = new Player('Chico');

console.log(natan)
console.log(ninja)
/**
 * Creates a Class.
 */
var define = function (obj) {

    'use strict'

	// Class model
    var Class = function() {

		this.name = obj.name;

		obj.initialize.apply(this, arguments);

	}

	for (var key in obj) {

		if (key === 'inherits') {
			var F = function(){}, parent = obj[key];
				F.prototype  = new parent();
			Class.prototype = new F();
			Class.prototype.parent = parent;
			continue;
		}

		if (key === 'name') {
			continue;
		}

		Class.prototype[key] = obj[key];

	}

    var _helper = {
        init: function(_constructor){
            Class.prototype.constructor = Class;
            return _helper;
        },
        inherits: function(parent){ 
           var F = function(){};
               F.prototype  = new parent();
               Class.prototype = new parent();
               Class.prototype.parent = parent; 
           return _helper; 
        },
        method: function (name, func) {
            Class.prototype[name] = func;
            return _helper;
        },
        create: function(){
            return Class;
        }
    };

    return Class;
    
};



var Person = define({

	name: 'Person'

,	inherits: Object

,	initialize: function() 
	{
		console.log('Initializating ' + this.name);
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

	name: 'Player'

,	inherits: Person

,	initialize: function() 
	{
		console.log('Initializating ' + this.name);
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


var natan = new Player();

console.log(natan)
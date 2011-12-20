
/**
 * Creates a new instance of an object.
 * @author Douglas Crockford
 * @url http://javascript.crockford.com/prototypal.html
 * @url http://www.crockford.com/javascript/inheritance.html
 */
if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}

/**
 * Creates a new Chico UI component.
 * @name create
 * @function
 * @param {Object} o Configuration Object.
 * @returns {Chico UI Component} that
 * @memberOf ch
 */
ch.define = function (_name) {
    
    var Class = function(){
        this.name = _name;
    };

    Class.prototype.toString = function(){
        return this.name;    
    };

    var _helper = {
        init: function(_constructor){
            Class.prototype.constructor = _constructor;
            return _helper;
        },
        inherits: function(parent){ 
           var F = function(){};
               F.prototype  = new parent();
               Class.prototype = new F();
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

    return _helper;
    
};

ch.Object = ch.define("Object").create();

var UIObject = ch.define('UIObject')
                 .inherits(ch.Object)
                 .init(function(){ console.log("Constructing "+this.name); })
                 .method('active', true)
                 .method('prevent', function() {})
                 .method('content', function() {})
                 .method('callback', function() {})
                 .method('position', function() {})
                 .create();


var Floats = ch.define('Floats')
               .inherits(UIObject)
               .method('show',function(){
                  console.log("Showing "+this.name); 
                  return this;   
               })
               .method('hide',function(){
                  console.log("Hiding "+this.name);
                  return this;
               })
               .create();

var Modal = ch.define('Modal')
              .inherits(Floats)
              .method('show',function(){
                console.log("Methodo del Modal");
                this.parent.show();  
              })
              .create();
    
var Natan = ch.define('Natan')
              .inherits(Modal)
              .create();


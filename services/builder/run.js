/**
 *  Builder, run.js
 *  Proccess the source files and returns packed versions of Chico-UI
 * 
 *  Output:
 *  chico-x.x.x.js
 *  chico-min.x.x.x.js
 * 
 *  Arma un paquete con componentes
 * 
 * Idea para checkear dependencias:
 * Escribir en jsdocs en el header del archivo @depends o @require
 * para que el Core entienda las dependencias del archivo.
 * 
 * */

var sys = require("sys"),
    fs = require("fs"),
    builder = require("./builder.js");

var temp = {
    "name": "Chico-UI",
    "version": "v0.5.8 RC",
    "build": 0,
    "packages": [
        {
            "name": "Chico JS",
            "input": "../../src/js/",
            "extension": "js",
            "upload": ["A3"],
            "min": true
        },
        {
            "name": "Chico CSS",
            "input": "../../src/css/",
            "extension": "css",
            "upload": ["A3"],
            "min": true
        }
    ],
    
    "output": {
        "uri": "../../build/",
        "template": "/* Chico UI */"
    },
    
    "locations": {
        "A3": {
            "key": "-i ~/chicoui.pem",
            "host": "ubuntu@chico-ui.com.ar",
            "uri": "/chico/downloads/lastest/"
        }
    }
};

//builder.process("../../src/js/");



fs.readFile( 'build.json', function( err , data ) { 

    if (err) {
        sys.puts(err); 
        return;
    }
    
    // Parse JSON data
    var build = JSON.parse(data);
    
    // for each Package
    for (var i in build.packages) {
    
        var _package = build.packages[i];
            _package.version = build.version;
        
        sys.puts(_package.name + " " + _package.input);
        
        var packer = new builder.Packer(_package);        
        
            packer.on("ready",function(a){
                sys.puts(a.raw);
            })
            
            packer.run();        
            
    }
    
});
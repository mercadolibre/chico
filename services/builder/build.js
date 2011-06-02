/**
 *  Builder, run.js
 *  Proccess the source files and returns packed versions of Chico-UI
 * 
 *  Output:
 *  chico-x.x.x.js
 *  chico-min.x.x.x.js
 *
 * */

var sys = require("sys"),
    fs = require("fs"),
    builder = require("./builder"),
    deployer = require("./deployer"),
    packages = { size: 0, map: [] };

var deploy = function( package ) {

    packages.map.push( package );
    
    if ( packages.map.length === packages.size ) {
        console.log( packages );
    }
}

fs.readFile( 'builder.conf', function( err , data ) { 

    if (err) {
        sys.puts(err); 
        return;
    }
    
    // Parse JSON data
    var build = JSON.parse(data);
        // increment build number
        build.build++;
        // save the amount of packages configured
        packages.size = build.packages.length;
        
    sys.puts( "Building version " + build.version + " build nº " + build.build );
    sys.puts( "Preparing " + packages.size + " packages." );
    
    // for each build.packages
    for (var i in build.packages) {
        
        var _package = build.packages[i];
            _package.version = build.version;
            _package.output = build.output;
            _package.build = build.build;
            _package.upload = build.locations[_package.upload];
            _package.template = build.templates[_package.type];

        var packer = new builder.Packer( _package );        

            packer.on( "done" , function( package ) {
               
               //TODO: deploy( package );
               
            });

    } // end for build.packages

    // save conf file  with incremented build number
    var new_build = JSON.stringify(build);
    
    // write conf file
    fs.writeFile( 'builder.conf' , new_build , function( err ) {
        if(err) {
            sys.puts(err);
        }
        
    });
    
});
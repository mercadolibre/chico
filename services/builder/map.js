/**
 *
 *  Inheritances Cartographer, map.js
 *  Proccess the source files and returns a JSON Object with a Inheritance Map
 * 
 * */

var sys = require("sys"),
    fs = require("fs"),
    child = require("child_process"),
    exec  = child.exec,
    map = {};


var trim = function(str) {
    return str.replace(/^\s+|\s+$/g, '');
}

sys.puts( " )   ___                                            " );
sys.puts( "(__/_____)                              /)          " );
sys.puts( "  /       _   __ _/_ ____   __  _  __  (/    _  __  " );
sys.puts( " /       (_(_/ (_(__(_)(_/_/ (_(_(_/_)_/ )__(/_/ (_ " );
sys.puts( "(______)              .-/       .-/                 " );
sys.puts( "                     (_/       (_/             1.1  " );
sys.puts( " " );
sys.puts( "Starting Cartographer..." );
// Create a temporal map of all classes
var child = exec("cat ../../src/js/* > tmp_map.js", function (err) {
    
    if (err) {
        sys.puts( err );
        return;
    }

    // Read temporal map of classes
    fs.readFile( "tmp_map.js" , function( err , data ) { 
        
        sys.puts( "Processing Classes." );
        
        var raw = data.toString().split("/**").join("><><").split(" */").join("><><").split("><><");
        var tmp = [];
        var i = 0;
        var t = raw.length;
        var tags = 0;
        
        for ( i; i < t; i++ ) {
            if ( raw[i].indexOf("@class") > -1 ) {
                var chunk = raw[i].split("\n").join("").split(" * ");
                tmp.push(chunk);
            }
        }
        
        i = 0;
        t = tmp.length;
                
        var m; // output object
        
        for ( i; i < t; i++ ) {
            // This chunk should be all the tags from one class
            var chunk = tmp[i];
            var tt = chunk.length;
            var className = "";
            var classDesc = "";
            
            tags += tt;

            var chunk = tmp[i].join(" ");

            var className = chunk.match( /@class(\s+)(\w)+/g ).toString().split("@class ").join("");
            var classDesc = trim( chunk.split("@")[0] );
            
            m = map[className] = { description: classDesc, type: "class" };

            // @aguments
            var augments = chunk.match( /@augments(\s+)(ch.)(\w)+/g );

                if ( augments ) {
                    m["augments"] = trim( augments.toString().split("@augments ch.").join("") );
                };            

            // @requires
            var requires = chunk.match( /@requires(\s+)(ch.)(\w)+/g );

                if ( requires ) {
                    if (!map[className].requires) map[className].requires = [];
                    var r = requires.length;
                    while ( r-- ) {
                        m["requires"].push( trim( requires[r].toString().split("@requires ch.").join("") ) );
                    }
                };

            // @abstract @util            
                if ( /@abstract/.test(chunk) ) {               
                    m["type"] = "abstract";
                    if ( !augments ) {
                        m["type"] = "util";
                    }
                };

        }
             
        sys.puts( "  - " + t + " Classes processed." );
        sys.puts( "  - " + tags + " Tags processed." );
        sys.puts( "Building the map." );
        sys.puts( " " );                
        sys.puts( "Creating file \"inheritanceMap.js\"" );
        
        var mapData = JSON.stringify(map)
        // Write the map to a file
        fs.writeFile( "inheritanceMap.js" , mapData , function( err ) {
            if(err) {
                sys.puts(err);
            } else {
                sys.puts( "Done!" )
                //upload(file);
            }
        });

        // Erase temporal map of classes
        fs.unlink( "tmp_map.js" , function(){
            sys.puts( "Deleting temporary files." )
            //sys.puts(mapData);
        });


    });
});
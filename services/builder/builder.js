var sys = require("sys"),
    fs = require("fs"),
    events = require('events'),
    child = require("child_process"),
    pro = require("../lib/process"),
    jsp = require("../lib/parse-js"),
    cssmin = require('../lib/cssmin').cssmin,
    exec  = child.exec,
    spawn = child.spawn;

sys.puts("\n######################################\n           Chico-UI Builder         \n######################################\n");

var version = 0.1;

var template = function(data) { return "(function($){"+data+"ui.init();})(jQuery);"; };

var kbs = function(data) { return (Math.ceil(data/1024)); };

var get_file_name = function(file) { return "chico"+file.split("chico")[1]; };


var upload = function(file) {

    var file_name = get_file_name(file);

    var child = exec("scp -i ~/chicoui.pem "+file+" ubuntu@chico-ui.com.ar:/chico/downloads/lastest/"+file_name, function (err) {
    
        if (err) {
            sys.puts( file_name + "          > " + err);
            return;
        }
    
        sys.puts( file_name + "          > Uploaded to A3 Cloud!" );
               
    });
 
};


var Packer = function(o) {
    
    var self = this;

    self.name = o.name;
    self.version = o.version;
    self.input = o.input;
    self.type = o.type;
    self.min = o.min;
    self.upload = o.upload;                
    self._files = {
        raw: [], // name of the files
        data: [], // content of the files
        total: 0,
        loaded: 0,
        bytesLoaded: 0
    };
    
    self._files.ready = function() { return self._files.total === self._files.loaded; };
        
};

Packer.prototype = new events.EventEmitter();

Packer.prototype.run = function() {
    
    var self = this; 

    var child = exec("cat "+self.input+"*."+self.type+"  > ../../build/tmp."+self.type, function (err) {
    
        if (err) {
            sys.puts( err );
            return;
        }
    
        fs.readFile( '../../build/tmp.'+self.type , function( err , data ) { 
        
            if (err) {
                sys.puts(err); 
                return;
            }
            
            var output = data;
            var output_min = "";
            
            if ( self.type == "js" ) {

                var ast = jsp.parse( output ); // parse code and get the initial AST
                    ast = pro.ast_mangle( ast ); // get a new AST with mangled names
                    ast = pro.ast_squeeze( ast ); // get an AST with compression optimizations
                    
                output_min = pro.gen_code( ast ); // compressed code here

            } else if ( self.type === "css" ) {
                
                output_min = cssmin(output);
                
            }
                                       
        });
    });
}

Packer.prototype.write = function(file, data) {
        
    fs.writeFile(file, data, function( err ) {
        if(err) {
            sys.puts(err);
        } else {
            sys.puts( file + "          > Saved file!" );
            //upload(file);
        }
    });

}

/* -----[ Exports ]----- */
exports.version = version;
exports.Packer = Packer;

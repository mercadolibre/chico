var sys = require("sys"),
    fs = require("fs"),
    events = require('events'),
    child = require("child_process"),
    exec  = child.exec,
    spawn = child.spawn,
    version = 0.2;


var Deployer = function( pacakges ) {
    
    sys.puts( "   ___           __                   " );
    sys.puts( "  / _ \\___ ___  / /__  __ _____ ____ " );
    sys.puts( " / // / -_) _ \\/ / _ \\/ // / -_) __/" );
    sys.puts( "/____/\\__/ .__/_/\\___/\\_, /\\__/_/ "+version );
    sys.puts( "        /_/          /___/            ");
    sys.puts("  ");

    var self = this;
        
};

Deployer.prototype = new events.EventEmitter();

Deployer.prototype.upload = function( file ) {

    var child = exec("scp -i ~/chicoui.pem "+file+" ubuntu@chico-ui.com.ar:/chico/downloads/lastest/"+file_name, function (err) {
    
        if (err) {
            sys.puts( file_name + "          > " + err);
            return;
        }
    
        sys.puts( file_name + "          > Uploaded to A3 Cloud!" );
               
    });    
    
}


/* -----[ Exports ]----- */
exports.version = version;
exports.Deployer = Deployer;

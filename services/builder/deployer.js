var sys = require("sys"),
    fs = require("fs"),
    events = require('events'),
    child = require("child_process"),
    exec  = child.exec,
    spawn = child.spawn,
    version = 0.2;


var Deployer = function( packages ) {
    
    sys.puts( "   ___           __                   " );
    sys.puts( "  / _ \\___ ___  / /__  __ _____ ____ " );
    sys.puts( " / // / -_) _ \\/ / _ \\/ // / -_) __/" );
    sys.puts( "/____/\\__/ .__/_/\\___/\\_, /\\__/_/ "+version );
    sys.puts( "        /_/          /___/            ");
    sys.puts("  ");

    var self = this;
        self.packages = packages.map;
        
    sys.puts( "Preparing " + self.packages.length + " packages to deploy." );
    
    self.process();
};

Deployer.prototype = new events.EventEmitter();

Deployer.prototype.process = function() {

    var self = this;
    var packages = self.packages;
    
    for ( var i in packages ) {
        
        var package = packages[i];

        sys.puts(" > Processing " + package.filename );
            
        self.upload( package );
        
    }    
    
}

Deployer.prototype.upload = function( package ) {

    sys.puts( " > Uploading " + package.filename );
    
    var o = package.upload;
    
    var cmd = "scp " + ( (o.key) ? o.key + " " : "" ) + package.filename + " " + o.host + ":" + o.uri;

    var child = exec( cmd , function( err ) {
    
        if ( err ) {
            sys.puts( "Error: <Uploading file> " + err );
            return;
        }
    
        sys.puts( "   Uploaded to " + o.host + "!" );
               
    });
    
}


/* -----[ Exports ]----- */
exports.version = version;
exports.Deployer = Deployer;

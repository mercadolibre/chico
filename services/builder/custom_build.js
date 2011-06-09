/**
 *  Custom Builder
 *  Proccess the source files and returns packed versions of Chico-UI
 * 
 *  Output:
 *  tempxxxxx/name-x.x.x-x.zip
 *
 * */

var sys = require("sys"),
    fs = require("fs"),
    events = require('events'),
    Packer = require("./builder").Packer,
    packages = { size: 0, map: [] },
    exec  = require("child_process").exec;


var CustomBuild = function(_packages) {
	
	var self = this;
    
    self.folder = "temp" + ~~(Math.random() * 99999) + "/";
    
    self._packages = _packages;

    self.run();
    
};

// Inherit from EventEmitter
CustomBuild.prototype = new events.EventEmitter();


CustomBuild.prototype.run = function() {
	
	var self = this;
	
	fs.readFile("builder.conf", function(err, data) {

	    if (err) {
	        sys.puts(err);
	        return;
	    }
	    
	    // Parse JSON data
	    self.build = JSON.parse(data);
	    self.build.output.uri = self.folder;
		
		// Save the amount of packages configured
		packages.size = self._packages.length;
	        
	    // Create temporary folder
		exec("mkdir " + self.folder, function(err) {
		
			if ( err ) {
				sys.puts( "Error: <Creating folder> " + err );
				return;
			}
		
		});
	        
	    sys.puts( "Building version " + self.build.version + " build nº " + self.build.build );
	    sys.puts( "Preparing " + packages.size + " packages." );
	    
		for (var i in self._packages) {
			
			self.pack( self._packages[i] );
			
		};
	});
}


CustomBuild.prototype.pack = function( package ) {
	
	var self = this;
	
	var _package = Object.create(package);
		_package.version = self.build.version;
		_package.output = self.build.output;
		_package.build = self.build.build;
		//_package.upload = build.locations[_package.upload];
		_package.template = self.build.templates[_package.type];
		
	var packer = new Packer( _package );
		/*packer.on("done", function( pack ) {
			self.compress( pack );
		}*/
	
}


CustomBuild.prototype.compress = function( package ) {
	
	var self = this;
	
	if ( !package.upload ) {
        packages.size -= 1;    
    } else {
        packages.map.push( package );
    }
    
    if ( packages.map.length !== packages.size ) {
    	return;
    };
		
	sys.puts( "Compressing files..." );
	
	var zipName = build.name + "-" + package.version + "-" + package.build + ".zip";
	
	exec("cd ./" + folder + " && tar -cvf " + zipName + " * && rm *.js *.css", function(err) {
	   
        if ( err ) {
            sys.puts( "Error: <Creating folder> " + err );
            return;
        }
		
		sys.puts("Package builded at " + folder + packageName);
		
		self.emit("done", folder + packageName);
    });
	
}

/*


var CustomBuild = function(_packages) {
	
	fs.readFile( 'builder.conf', function( err , data ) { 

	    if (err) {
	        sys.puts(err);
	        return;
	    }
	    
	    // Parse JSON data
	    var build = JSON.parse(data);
	        // save the amount of packages configured
	        packages.size = _packages.length;
	        // 
	        build.output.uri = folder;
	        exec("mkdir " + folder, function(err) {
		   
		        if ( err ) {
		            sys.puts( "Error: <Creating folder> " + err );
		            return;
		        }
		        
		    });
	        
	    sys.puts( "Building version " + build.version + " build nº " + build.build );
	    sys.puts( "Preparing " + packages.size + " packages." );
	    
	    // for each build.packages
	    for (var i in _packages) {
	        
	        var _package = Object.create(_packages[i]);
	            _package.version = build.version;
	            _package.output = build.output;
	            _package.build = build.build;
	            //_package.upload = build.locations[_package.upload];
	            _package.template = build.templates[_package.type];
	
	        var packer = new Packer( _package );        
	
            packer.on( "done" , function( package ) {
				if ( !package.upload ) {
			        packages.size -= 1;    
			    } else {
			        packages.map.push( package );
			    }
			    
			    if ( packages.map.length === packages.size ) {
			        //new Deployer( packages );
					
					sys.puts( "Compressing files..." );
					
					var packageName = build.name + "-" + _package.version + "-" + _package.build + ".zip";
					
					var compress = "cd ./" + folder + " && tar -cvf " + packageName + " * && rm *.js *.css";
					
					exec( compress , function(err) {
					   
				        if ( err ) {
				            sys.puts( "Error: <Creating folder> " + err );
				            return;
				        }
						
						sys.puts("Package builded at " + folder + packageName);
						
						CustomBuild.emit("done", folder + packageName);
				    });
			    }
            });
	    }
	})
};



*/

// --------------------------------------------------

new CustomBuild([ { name: 'chico',
    input: '../../src/js/',
    components: 'controllers,navs,object,watcher,events,factory,get,positioner,expando,form,menu,accordion,required',
    type: 'js',
    min: true },
  { name: 'chico',
    input: '../../src/css/',
    components: 'expando,form,menu,accordion,required,mesh',
    type: 'css',
    min: true,
    embed: true } ]);
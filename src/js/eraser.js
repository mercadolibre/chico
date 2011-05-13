/**
 *  Eraser
 */
 
ch.eraser = function(data) {
    
    if(typeof data == "number"){
        
        // By UID
        for(var x in ch.instances){
            
            var component = ch.instances[x];
            
            for(var i = 0, j = component.length; i < j; i += 1){
                if(component[i].uid == data){
                    // TODO: component.delete()
                    delete component[i];
                    component.splice(i, 1);
                    
                    return;
                };
            };
        };
    
    } else {
        
        // All
        if(data === "meltdown"){
            // TODO: component.delete()
            /*for(var x in ch.instances){
                var component = ch.instances[x];
                for(var i = 0, j = component.length; i < j; i += 1){
                    component.delete();
                };
            };*/
            
            delete ch.instances;
            ch.instances = {};
            
        // By component name    
        } else {
            
            for(var x in ch.instances){
            
                if(x == data){
                    
                    var component = ch.instances[x];
                    
                    // TODO: component.delete()
                    /*for(var i = 0; i < component.length; i += 1){
                        component.delete()
                    };*/
                    
                    delete ch.instances[x];
                };
            };
            
        };
        
    };
    
};

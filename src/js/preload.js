/**
 *  Pre-Load function
 */ 

ch.preload = function(arr) {

    if (typeof arr === "string") {
        arr = (arr.indexOf(",") > 0) ? arr.split(",") : [arr] ;
    }

    for (var i=0;i<arr.length;i++) {
                
        var o = document.createElement("object");
            o.data = arr[i]; // URL
            
        var h = document.getElementsByTagName("head")[0];
            h.appendChild(o);
            h.removeChild(o); 
    }       
};
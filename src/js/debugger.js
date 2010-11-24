
/**
 *	JS Debugger
 *  para Firefox
 *
 * 	@autor: Natan Santolo
 *  @version: 1.1
 *  @revision: 22/12/09
 */

 var debug = {
	element:0,
	windowStyle:"padding:0;margin:0;border:solid 1px #000000;width:300px;height:500px;overflow:scroll;background-color:#eeeeee;display:block;position:fixed;top:5px;right:5px;z-index:999999;opacity:.9;",
	textStyle:"font-family:Arial;font-size:.8em;margin:0 2px;padding:0 2px;",
	init:function() {
		
		var div = document.createElement("div");
			div.setAttribute("id","console");
			
		debug.element = document.createElement("div");
		debug.element.setAttribute("style",debug.windowStyle);
		debug.element.setAttribute("title","clic para mover");
		debug.element.setAttribute("id","debug");
		debug.element.onmouseup = debug.toggleMove;
		debug.element.appendChild(div);
	
		document.body.appendChild(debug.element);
		
	},
	/**
	 * debug.write(mensaje) escribe un mensaje en la ventana de debug
	 */
	write:function(s,c) {
		if (debug.element==0) { debug.init(); }
		var p = document.createElement("p");
		var t = document.createTextNode(s);
		p.setAttribute("style",debug.textStyle+((c)?"color:"+c+";":"color:#333333;"));
		p.appendChild(t);
		var console = document.getElementById("console");
			console.insertBefore(p,console.firstChild);
	},
	/**
	 * debug.toggleMove() mueve la ventana 
	 */
	toggleMove:function(){
		if (debug.element==0) { debug.init(); }
		if (debug.windowStyle.indexOf('right:5px;')>=0){
			debug.windowStyle=debug.windowStyle.split('right:5px;').join('')+'left:5px;';
		}else if (debug.windowStyle.indexOf('left:5px;')>=0) {
			debug.windowStyle=debug.windowStyle.split('left:5px;').join('')+'right:5px;';
		}
		debug.element.setAttribute("style",debug.windowStyle);
	},
	/**
	 * debug.end() apaga la ventana de debug
	 */
	end:function() {
		debug.element=0; document.body.removeChild(document.getElementById("debug"));
	}
}

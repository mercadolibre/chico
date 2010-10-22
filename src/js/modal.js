/**
*	Modal Window Constructor
*/

ui.Modal = function(e) {
	
	var t = $(e.trigger);
	
	// Need to know if the trigger is a link or a form
	var uri = (t.attr("href"))?t.attr("href"):t.parents("form").attr('action');
	var setPosition = function(w) {
		return {left:parseInt(ui.utils.window.width())/2-parseInt(w.css("width"))/2,
				top:parseInt(ui.utils.window.height())/2-parseInt(w.css("height"))/2};			
	};
	
	var setSize = function() {
		return {width:((!e.width)|(parseInt(e.width)>=parseInt(ui.utils.window.width())))?parseInt(ui.utils.window.width())/1.5+"px":e.width,
				height:((!e.height)|(parseInt(e.height)>=parseInt(ui.utils.window.height())))?parseInt(ui.utils.window.height())/2+"px":e.height};
	};

	var create = function(event) {	
		event.preventDefault();			
		event.stopPropagation();			
		ui.utils.dimmer.on();			
	// Creating stuff
		var w = $("<div>").addClass("modal box");
		var close = $("<p>x</p>").addClass("btn").addClass("close").appendTo(w).bind("click",remove);
	// Cheking properties
		if (e.title) w.append("<h2>"+e.title+"</h2>");
		if (e.content) w.append(e.content);
	// Setting some attributes
		w.css(setSize());
		w.css(setPosition(w));			
	// Getting content 
		if (e.ajax) {
			w.append( $("<div><div class=\"loading\"></div>").addClass("content").css("height", (e.title)?"90%":"100%") );
			w.find(".loading").css("margin-top",(parseInt(w.css("height"))/2-25));
			w.find(".content").load(uri,{"x":"x"},function(){ $("div.loading").remove(); });						
		}

	// FIX: when the windows resize, need to rethink the position of the window and his size
		ui.utils.window.bind("resize",function(){ 
			w.css(setSize());
			w.css(setPosition(w));
		}); 

	// Placing modal window in the <body> ;)
		w.appendTo("body").fadeIn("slow");
	}

	var remove = function(event) {
		$("div.modal").fadeOut("fast",function(){ $(this).remove(); });
		ui.utils.window.unbind("resize");
		ui.utils.dimmer.off();
	}
	
	t.bind("click",create);
	
	return {create:create, remove:remove};
}
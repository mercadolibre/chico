/**
*  Dropdown Constructor
*/

ui.Drop = function(e) {

	var status = false;

	var upAll = function(event,element) { $(dropdown.triggers).each(function(i,e){ if (element!=e) e.dropdown.up(event); }) };

	// Wrap drops
	$(e).children(":first").wrap("<div class=\"dropWraper\">");
	var w = $(e).find(".dropWraper");
		w.append("<span class=\"ico down\">&raquo;</span>");

	var u = $(e).children(":first").next();
		u.addClass("dropContent");

	var drop = function(event){
		event.stopPropagation();
		 // no permite seleccionar el texto
		/*$.extend($.fn.disableTextSelect = function() {
				return this.each(function(){
				if($.browser.mozilla){//Firefox
					$(this).css('MozUserSelect','none');
				}else if($.browser.msie){//IE
					$(this).bind('selectstart',function(){return false;});
				}else{//Opera, etc.
					$(this).mousedown(function(){return false;});
				}
			});
		});
		$('.dropWraper, .dropContent').disableTextSelect();*/
		if (status) { up(event); return; }
		
	//	upAll(event,e);
		
		if ((u.width()+event.pageX) > parseInt(ui.utils.window.width())) { u.addClass("move"); } else { u.removeClass("move"); }
		$(e).addClass("on");
		status = true;		
		
		u.bind("scroll",function(){ status = false; });
		
	};

	var up = function(event){ 
		event.stopPropagation();
		ui.utils.document.unbind("click");
		$(e).removeClass("on"); 
		status = false;
	};

	$(e).bind("mouseup",drop);
		
	ui.utils.document.bind("mouseup",up);
	
	return {drop:drop,up:up}
}
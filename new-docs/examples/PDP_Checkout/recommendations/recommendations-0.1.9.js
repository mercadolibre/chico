/**
 *	Carousel component
 *
 *  @autor: Nicolas Brizuela
 *  @version: 0.1
 *  @revision: 8/11/10
 *
 */
var carousel = {
/**
 *	Configuration
 */
 
 	init: function(c) {	
 		
		if (!$.isArray(c)) { 
			throw("Carousel: Can't start without a configuration."); return;
		} else { // each configuration
			$(c).each(function(i,e){ carousel.make(e); });
		}
		
	},
	
/**
 *	Build a reference of triggers and for each one of them construct a new Carousel()
 */	
	make: function(e){ // each configuration
		var pushedIndex = carousel.triggers.push(e);		
		carousel.triggers[pushedIndex-1].carousel = new carousel.Carr(e);		
	},

	triggers: [],
	
/**
 *	Arrow yes or no?
 */		
	calculate: function(selector){
			//Calculo la posicion "Left" de la lista
			var getPosition = function() { return ($(selector+' .list').css('left')=='auto')?0:$(selector+' .list').css('left'); }
			
			if( $(selector+' .list').width()-2 <= $(selector+' .mask').width() ){
				$(selector+' .next').hide();
				$(selector+' .prev').hide();
			}else if( ($(selector+' .list').width()-2) + parseInt(getPosition()) <= $(selector+' .mask').width()){
				$(selector+' .next').hide();
				$(selector+' .prev').show();
			}else if (parseInt($(selector+' .list').css('left')) < 0){
				$(selector+' .next').show();
				$(selector+' .prev').show();
			}else{
				$(selector+' .next').show();
				$(selector+' .prev').hide();
			}
	
	},

/**
 *  Carr Constructor
 */	
	Carr: function(e){

		//Cargo las variables globale
		var loading = $('<div class="loading">'),
			list = $('<ul class="list">'),
			mask = $('<div class="mask">'),
			prev = $('<span class="prev">&laquo;</span>'),
			next = $('<span class="next">&raquo;</span>'),
			selector = e.trigger,
			data = e.data,
			size = $(data).size();//valor que me envian en la configuracion
			
		
		//Construyo un item si pasan data
		if(data){
		
	 		$(data).each(function(i,product){
				var render = $('<li class="'+product.id+'">');
					render.append('<div class="article"></div>');
					if(recommend.valItemSite == 'MLB' || recommend.valItemSite == 'MPT'){
						render.children('.article').append('<p class="percentage">'+product.percentage+'% visitou:</p>');
					}else {
						render.children('.article').append('<p class="percentage">Un '+product.percentage+'% visit&oacute;:</p>');
					}
					render.children('.article').append('<h3><a href="'+product.items_url_search+'">'+product.title+'</a></h3>');
					render.children('.article').append('<a href="'+product.items_url_search+'"><img src="'+product.thumbnail+'"></a>');
					render.find('a').click(function(){ trackEventAndFollowLink(this.href, "VIP", "Click", "Recommendation") });

				$(list).append(render);
	 		});
	
	 	}
	 	
	 	//Agrego los elementos al dom
		$(mask).append(list);
		$(selector).append(mask).append(prev).append(next).addClass('carousel');
		
		//Le saco el marign-right al ultimo item
		$('.list li:last-child').css('margin-right','0');
		//Width de la lista
		$(list).css('width',(($('.list li').width()+20) * size)-10);
		
		//Calculo la posicion "Left" de la lista
		var getPosition = function() { return (list.css('left')=='auto')?0:list.css('left'); }
		
		//Muevo el carousel a la izquierda
		function moveRight(){

			if ($(":animated").length) return;
			var move = parseInt(getPosition()) + mask.width();
			$(list).animate({'left': move },'slow',function(){ carousel.calculate(selector) });	

		}
		
		//Muevo el carousel a la derecha
		function moveLeft(){

			if ($(":animated").length) return;
			var move = parseInt(getPosition()) - mask.width();
			$(list).animate({'left': move },'slow',function(){ carousel.calculate(selector) });
			
		}
		
		//Le agrego funcionalidad a los botones y a la ventana
		$(next).click(function(){ moveLeft(); });
		$(prev).click(function(){ moveRight(); });
		//$(window).bind('resize',carousel.calculate);	
		
		// Calculo para ver si agrego las flechas en la primer carga
		carousel.calculate(selector);
	
	 }
};

/**
 *	Recommendation widget
 *
 *  @autor: Nicolas Brizuela
 *  @version: 0.1
 *  @revision: 8/11/10
 *
 */
var recommend = {
	
	carousels: [],
	
	init: function(productId, valItemSite, callback) {

		recommend.callback = callback;
		recommend.valItemSite = valItemSite;
		
		
		
		if(productId && productId != 0){
			//Mapeo old ID
			/*$.getJSON('https://api.mercadolibre.com/catalog_products/'+valItemSite+productId+'/mapping?callback=?',function(data){
					//Pido las recomendaciones
					if(data.product_id){*/
						//$('#recommendations').append('<div class="loading">');
						var uri = "https://api.mercadolibre.com/catalog_products/"+productId+"/recommendations/VISTOVIS?site="+valItemSite;
						$.getJSON(uri+'&callback=?',recommend.iterateDomains);
					//}
			//});
		}

	},
	
	iterateDomains: function(data) {
		//Saco el loading
		$('#recommendations').html('');
		var a = data[2];
		//Pregunto si hay recomendaciones
		if (a.recommendations.length) {
	
			//Trackeo la impresion
			try {
				if (pageTracker) pageTracker._trackEvent('VIP', 'Print', 'Recommendation');
			}catch(e){};
			
			//Movidas para el box recommendations
			var recom = $('#recommendations');
			var box = $('<div class="box gradient allRounded">');
			var wraper = $('<div class="wraperTabs">');
			if(a.title==''){a.title='producto'}
			if(recommend.valItemSite == 'MLB' || recommend.valItemSite == 'MPT'){
				var tit = $('<h2 class="typo">Quem viu '+a.title+', viu tamb&eacute;m:</h2>');
			}else{
				var tit = $('<h2 class="typo">Los que vieron '+a.title+', tambi&eacute;n vieron:</h2>');
			}
			
			var ul = $('<ul class="tabs vertical">');
			var carousels = $('<div id="carousels">');
			
			$(wraper).append(ul).append(carousels);
			$(box).append(tit).append(wraper).appendTo(recom);

			// Recorro los dominios
			var total = a.recommendations.length;
			var totalDomains = [];
			var cantDomain = 0;
		
			$(a.recommendations).each(function(i,domain){
				if (i < 5) {
				
					//Saco los productos que no tienen titulo o thumbnail
					domain.catalog_product = $.grep(domain.catalog_product, function(o, i){
						return(o.title != '' && o.thumbnail != '');
					});
					
					//Ok, el las recomendaciones tienen productos?
					if(domain.catalog_product.length != 0){
						//Creo un tab
						new recommend.Tab (domain.domain_name, domain.domain_percentage, domain.domain);
						//Creo una config de carrusel
						new recommend.Carousel (domain.catalog_product, domain.domain);
						if ((i+1)==total) { recommend.callback(); }
					}else {
						//Vacio el widget
						//$('#recommendations').html(''); 
						// Esto no esta bien, si uno no trae información borras TODO!
					}
				}
				
			});
			
			$('#carousels div').hide();
			$('#carousels div:first-child').show();
		}
		
		return
	},
	
	Tab: function(name, percentage, id) {
		// Creo el tab
		$("<li><span>"+name+"</span></li>")
			.bind("click",function(event){
				$(".carousel").hide();
				$("#c"+id).fadeIn('slow',function(){
					carousel.calculate('#'+$(this).attr('id'));
				});
				$(this).siblings().removeClass('selectedTab');
				$(this).addClass('selectedTab');
			})
			.attr('title',name)
			.hover(function(){$(this).addClass('hoverTab');},function(){$(this).removeClass('hoverTab');})
			.appendTo("#recommendations .tabs");
					
		// Pre-selecciono el primer tab
		if(!$('.tabs li').siblings().hasClass('selectedTab')) $('.tabs li').addClass('selectedTab');
				
	},
	
	Carousel: function(products, id) {
		// va un carousel
		$("#carousels").append("<div id=\"c"+id+"\"></div>");
	
		// agrego a la configuracion
		recommend.carousels.push({trigger:"#c"+id, data: products});
		
	}

}
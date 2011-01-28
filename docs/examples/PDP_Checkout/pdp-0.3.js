/**
 *	PDP
 *
 *  @autor: Nicolas Brizuela
 *  @version: 0.1
 *  @revision: 29/12/10
 *
 */

var pdp = {
	
	init: function(valItemSite, productId) {
		
		//LLamado a la api de catalogo
		var catalog = "https://sandbox.mercadolibre.com/catalog_products/"+productId;
		$.getJSON(catalog+'?callback=?',pdp.generateCatalog);
		
	},
	
	generateCatalog: function(data) {
		if (data[0] == 200){
			var title = $('h1').html(data[2].title);
			if(data[2].pictures.length > 0){
				var image = $('.gallery .slider img').attr({'src':data[2].pictures[0].url, 'alt': data[2].title});
			}else{
				var image = $('.gallery .slider img').attr({'src': 'http://www.mercadolibre.com.ar/jm/img?s=MLA&f=artsinfoto.gif&v=E', 'alt': 'Sin foto'});
			}
			$('#errorSearchProd').html('');
			
			//LLamado a la api de search con productos NUEVOS
			var search = "https://api.mercadolibre.com/sites/"+$('#conuntryProduct').val()+"/search?product="+ data[2].id +"&condition=new";
			$.getJSON(search+'&callback=?',pdp.generateItems);
			//LLamado a la api de search con productos USADOS
			var search = "https://api.mercadolibre.com/sites/"+$('#conuntryProduct').val()+"/search?product="+ data[2].id +"&condition=used";
			$.getJSON(search+'&callback=?',pdp.generateUsedItems);
			$('.tabs .article ol').html("");
			
		}else{
			$('#errorSearchProd').html('El producto no existe');
			$('#conteiner').css('display', 'none');
			$('.loading').css('display', 'none');
		}
	},
	
	convertCurrency: function(c){
		if(c == "ARS"){
			return "$";
		}else if(c == "USD"){
			return "U$S";
		}else if(c == "BRL"){
			return "R$";
		}else if(c == 'MXN'){
			return "$";
		}else {
			console.log("Currency invalid");
		}
	},
	
	getClassRep: function(r){
		if(r == '5_green'){
			return "rep5";
		}else if(r == '4_light_green'){
			return "rep4";
		}else if(r == '3_yellow'){
			return "rep3";
		}else if(r == '2_orange'){
			return "rep2";
		}else if(r == '1_red' ){
			return "rep1";
		}else {
			return "rep0";
		}
	},
	
	getClassMedal: function(m){
		if(m == 'platinum'){
			return '<span class="medal mlP" title="MercadoLíder Platinum">MercadoLíder Platinum</span>';
		}else if(m == 'gold'){
			return '<span class="medal mlG" title="MercadoLíder Gold">MercadoLíder Gold</span>';
		}else if(m == 'silver'){
			return '<span class="medal mlL" title="MercadoLíder">MercadoLíder</span>';
		}
	},
	
	userData: function(user, rep, permalink){
	
		if(user == 'platinum'){
			return '<span class="medal mlP" title="MercadoLíder Platinum">MercadoLíder Platinum</span><a href="'+ permalink +'">MercadoLíder Platinum</a> <p class="meter '+ pdp.getClassRep(rep) +'"><span class="valueRep"></span></p>';
		}else if(user == 'gold'){
			return '<span class="medal mlG" title="MercadoLíder Gold">MercadoLíder Gold</span><a href="'+ permalink +'">MercadoLíder Gold</a> <p class="meter '+ pdp.getClassRep(rep) +'"><span class="valueRep"></span></p>';
		}else if(user == 'silver'){
			return '<span class="medal mlL" title="MercadoLíder">MercadoLíder</span><a href="'+ permalink +'">MercadoLíder</a> <p class="meter '+ pdp.getClassRep(rep) +'"><span class="valueRep"></span></p>';
		}else if(user == null && rep != null) {
			return '<a href="'+ permalink +'">Vendedor frecuente</a> <p class="meter '+ pdp.getClassRep(rep) +'"><span class="valueRep"></span></p>';
		}else {
			return '<a href="'+ permalink +'">Vendedor nuevo</a>';
		}
	
	},
	
	getTotal: function(c, p, s){
		if(c == 'USD'){
			if ($('#conuntryProduct').val() == 'MLA'){
				return (p*4) + s;
			}else if($('#conuntryProduct').val() == 'MLB'){
				return (p*2.4) + s;
			}else {
				return;
			}
		}else{
			return p + s; 
		}
	},
	
	getCuotes: function(price, quanty, target){
		
		$.getJSON("https://api.mercadolibre.com/sites/"+ $('#conuntryProduct').val() +"/payment_methods/"+ target +"?callback=?",function(data){
			
			$(data[2].sender_costs).each(function(i,payments){
				if(payments.installments == quanty){
					
					var cuotes = (((price*payments.installment_rate)/100) + price) / quanty;
					
					$('#principal .cuotes').html(quanty + " cuotas de " + cuotes.toFixed(2));
				}
			});
			
		});
	},
	
	getSite: function(type){
		var site = $('#conuntryProduct').val();
		if(type == 'list'){
			if(site == 'MLA'){
				return 'listado.mercadolibre.com.ar';
			}else if( site == 'MLB'){
				return 'lista.mercadolivre.com.br';
			}else if( site == 'MLM' ){
				return 'listado.mercadolibre.com.mx';
			}
		}else{
			if(site == 'MLA'){
				return 'www.mercadolibre.com.ar';
			}else if( site == 'MLB'){
				return 'www.mercadolivre.com.br';
			}else if( site == 'MLM' ){
				return 'www.mercadolibre.com.mx';
			}
		}
	},
	
	generateItems: function(data){
		
		var shipping =  $('#principal .shipping').text();
		
		
		var items = data[2];
		if (data[0] == 200){
			if(items.results.length > 0){
				
				if(items.results.length == 1){
					$('#news ol .loading').remove();
					$('#news ol').html("<li>No se encontraron vendedores</li>");
					$('#news .search-link').html('');
				}
				
				//Obtenemos los items
				$(items.results).each(function(i, item){
					
					//Tomo el primer item y lo creo como el principal
					if(i == 0){
						
						var total =  pdp.getTotal(item.currency_id, item.price, parseInt(shipping));
						
						$('#principalPrice').html(pdp.convertCurrency(item.currency_id) + ' ' + item.price);
						$('#total').html(($('#conuntryProduct').val() == 'MLB')?'R$ ' + total:'$ ' + total);
						pdp.getCuotes(total, 6, "visa");
						$('#principalVip').attr('href', item.permalink);
						$('#conditionsBpp').attr('href', 'http://'+ pdp.getSite() +'/jm/ml.faqs.framework.main.FaqsController?pageId=TUT&faqId=2732&categId=SEGPC');
						$('#publicItem').attr('href', 'http://'+ pdp.getSite() +'/jm/sell');
						
						if(item.condition == 'new'){
							$('#principalCondition').html('Nuevo');	
						}else{
							$('#principalCondition').html('Usado');	
						}
						
						//Para generar la reputacion
						$.getJSON("https://api.mercadolibre.com/items/"+ item.id +"?callback=?",function(data){
							
							var stock = data[2].available_quantity;
							for( var i=0; i < stock; i++){
								$('#stock').append('<option value="'+i+'">'+i+'</option>');
							};
							
							$.getJSON("https://api.mercadolibre.com/users/"+data[2].seller_id+"?callback=?", function(user){
							
								$('.repDescrip').html(pdp.getClassMedal(user[2].seller_reputation.power_seller_status));
								$('.sidebar .termometer').addClass(pdp.getClassRep(user[2].seller_reputation.level_id));
								$('#percCalif').html(user[2].seller_reputation.transactions.ratings.positive *100+'%');
								$('#quatyCalif').html(user[2].seller_reputation.transactions.total);
								
								$('#conteiner').css('display', 'block');
								$('.loading').css('display', 'none');
								
							});
							
						});
							
						var principalItem_id = "https://api.mercadolibre.com/items/"+item.id ;
						$.getJSON(principalItem_id+'?callback=?',function(data){
							$('#principalWarranty').html(data[2].warranty);
						});
						
					}else if(i <= 5){
						
						$.getJSON("https://api.mercadolibre.com/items/"+ item.id +"?callback=?",function(data){
							$.getJSON("https://api.mercadolibre.com/users/"+data[2].seller_id+"?callback=?", function(user){
								
								$('#news ol').append('<li><dl><dt>Usuario:</dt><dd class="user">'+pdp.userData(user[2].seller_reputation.power_seller_status, user[2].seller_reputation.level_id, item.permalink)+'</dd><dt>Precio:</dt><dd class="price">'+ pdp.convertCurrency(item.currency_id)+ ' ' + item.price +'</dd><dt>Ubicación:</dt><dd class="location">'+ item.address.state_name +'</dd><dt>Vendidos:</dt><dd class="reputation">'+ item.sold_quantity +' vendidos</dd></dl></li>');
								$('#news .search-link').html('<a href="http://'+ pdp.getSite("list") +'/'+ $('h1').text() +'_ItemTypeID_N" title="Ver todo el listado">Ver todo el listado</a>');
								$('#news ol .loading').remove();
							});
							
						});
						
					}
					
				});
			}else{
				$('#news ol .loading').remove();
				$('#news ol').html("<li>No se encontraron vendedores</li>");
				$('#news .search-link').html('');
				$('#errorSearchProd').html('No se encontraron vendedores');
				$('#conteiner').css('display', 'none');
				$('.loading').css('display', 'none');
			}
		}
		
	},
	
	generateUsedItems: function(data){
		
		var items = data[2];
		if (data[0] == 200){
			
			if(items.results.length > 0){
				//Obtenemos los items
				$(items.results).each(function(i, item){
				
					if(i <= 5){
						
						$.getJSON("https://api.mercadolibre.com/items/"+ item.id +"?callback=?",function(data){
							$.getJSON("https://api.mercadolibre.com/users/"+data[2].seller_id+"?callback=?", function(user){
							
								$('#used ol').append('<li><dl><dt>Usuario:</dt><dd class="user">'+pdp.userData(user[2].seller_reputation.power_seller_status, user[2].seller_reputation.level_id, item.permalink)+'</dd><dt>Precio:</dt><dd class="price">'+ pdp.convertCurrency(item.currency_id)+ ' ' + item.price +'</dd><dt>Ubicación:</dt><dd class="location">'+ item.address.state_name +'</dd><dt>Vendidos:</dt><dd class="reputation">'+ item.sold_quantity +' vendidos</dd></dl></li>');
								
								$('#used .search-link').html('<a href="http://listado.mercadolibre.com.ar/'+ $('h1').text() +'_ItemTypeID_U" title="Ver todo el listado">Ver todo el listado</a>');
								$('#used ol .loading').remove();
							});
							
						});
						
					}
				
				});
			}else{
					$('#used ol .loading').remove();
					$('#used ol').html("<li>No se encontraron vendedores</li>");
					$('#used .search-link').html('');
			}
		}
		
	},

	generateSendFree: function(data){
		
		
		
	},	
	
}
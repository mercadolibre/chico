/**
 *	Viewer
 *	@author
 *	@Contructor
 *	@return An interface object
 */
/*
<h1>Viewer</h1>	
<div class="galeria">
	<ul>
		<li>
			<a href="http://www.mercadolibre.com.ar/jm/img?s=MLA&f=62634838_9736.jpg&v=O" target="_blanc">
				<img src="http://www.mercadolibre.com.ar/jm/img?s=MLA&f=62634838_9736.jpg&v=V">
			</a>
		</li>
		<li>
			<a href="http://www.mercadolibre.com.ar/jm/img?s=MLA&f=62634838_3135.jpg&v=O" target="_blanc">
				<img src="http://www.mercadolibre.com.ar/jm/img?s=MLA&f=62634838_3135.jpg&v=V">
			</a>
		</li>
		<li>
			<a href="http://www.mercadolibre.com.ar/jm/img?s=MLA&f=62634838_2534.jpg&v=O" target="_blanc">
				<img src="http://www.mercadolibre.com.ar/jm/img?s=MLA&f=62634838_2534.jpg&v=V">
			</a>
		</li>
		<li>
			<a href="http://www.mercadolibre.com.ar/jm/img?s=MLA&f=62634838_6784.jpg&v=O" target="_blanc">
				<img src="http://www.mercadolibre.com.ar/jm/img?s=MLA&f=62634838_6784.jpg&v=V">
			</a>
		</li>
		<li>
			<a href="http://www.mercadolibre.com.ar/jm/img?s=MLA&f=65213880_2657.jpg&v=O" target="_blanc">
				<img src="http://www.mercadolibre.com.ar/jm/img?s=MLA&f=65213880_2657.jpg&v=V">
			</a>
		</li>
		<li>
			<a href="http://www.mercadolibre.com.ar/jm/img?s=MLA&f=93080365_1290.jpg&v=O" target="_blanc">
				<img src="http://www.mercadolibre.com.ar/jm/img?s=MLA&f=93080365_1290.jpg&v=V">
			</a>
		</li>			
	</ul>
	
</div>

<hr>


//Viewer
$('.galeria').viewer();
*/
ui.Viewer = function(conf){
	$(conf.element).addClass('uiViewer');
	// Current image
	var currentImage;

	// Triggers
	var $wrapper = $('<div>').addClass('thumbnails'); //Create the wrapper for the thumbnails
	$(conf.element).append( $wrapper.append( $(conf.element).children(':first').clone().addClass('carousel') ) ); // clone the first ul to create the tumbnails accordion
	var $triggers = $(conf.element).find('.thumbnails a'); // find the triggers
	var thumbnails = []; // create array to save the triggers
	
	// Create the thumbnails
	$.each($triggers, function(i, e){		
		$(e).addClass('uiTrigger');
			.data('index',i); // save index data as identificator
			.bind('click', function(event){ move(event, $(e).data('index')) });  // bind the method to move
			.children()
				.attr('src', $(e).children().attr('src').replace('v=V','v=M')); // change the url for thumbnails
				
		if(i==0){ $(e).addClass('on'); currentImage = $(e).attr('href') }; // select the first trigger (default)
		
		thumbnails.push(e);
	});
	
	
	// Content
	$(conf.element).children(':first').addClass('carousel').wrap( $('<div>').addClass('uiContent'));
	
	// Global configuration
	conf.$triggers = $(conf.element).find('.thumbnails');
	conf.$htmlContent = $(conf.element).find('.uiContent');
	
	var move = function(event, index){
		// Validation
		var actived = $('.uiTrigger.on').data('index');
		var current = $element.data('index'); //save current
		if(current == actived) return;
		
		// Movement
		currentImage = $element.attr('href'); //save current big img
		conf.$trigger.find('a').removeClass('on');
		$element.addClass('on');
		var left = -(conf.$htmlContent.find('.carousel').children().outerWidth()+20) * current;
		conf.$htmlContent.find('.carousel').animate({'left': left});
	};
	
	// Create components for viewer and instance these
	var instances = [];
	
	var createComp = function(x, element, conf, id){
    	var name = ui.utils.ucfirst(x);
		var component = ui[name];        
		conf = conf || {};
		conf.name = x;
    	conf.element = element;
    	conf.id = id;
    	instances.push(ui[name](conf));
	};
	
	
	createComp('carousel', conf.$triggers, {resizable: false}, 0);
	createComp('carousel', conf.$htmlContent, {arrows: false,resizable: false}, 1);
	
	/*//callback show for modal
	var executeModal = function(){
		//alert(currentImage);
		$('.modalView').find('img').attr('src', currentImage);		
	}
	createComp('modal', conf.$htmlContent, { content: {type: 'param', data:'<div class="modalView"><img src=""/></div>' }, callbacks: { show: executeModal } }, 0);*/
	
		
	return { move: function(event, index){ move(event, index) }, carousels: instances, thumbs: thumbnails };
};

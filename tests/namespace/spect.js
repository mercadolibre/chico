
describe('ch', function () {
	var namespace = ch;

	describe('Namespace', function () {
		it('Shoud be defined', function (){
			expect(namespace).toBeDefined();
			expect(typeof namespace).toEqual('object');
		});

	});

	describe('The namespace ch shoud be defined these static members:', function () {

		it('cache', function (){
			expect(namespace.cache).toBeDefined();
		});

		it('debug', function (){
			expect(namespace.debug).toBeDefined();
		});

		it('eraser', function (){
			expect(namespace.eraser).toBeDefined();
		});

		it('events', function (){
			expect(namespace.events).toBeDefined();
		});

		it('factory', function (){
			expect(namespace.factory).toBeDefined();
		});

		it('instances', function (){
			ch.debug();
			expect(namespace.instances).toBeDefined();
			expect(typeof namespace.instances).toEqual('object');
		});

		it('keyboard', function (){
			expect(namespace.keyboard).toBeDefined();
		});

		it('preload', function (){
			expect(namespace.preload).toBeDefined();
		});

		it('support', function (){
			expect(namespace.support).toBeDefined();
		});

		it('util', function (){
			expect(namespace.util).toBeDefined();
		});

		it('version', function (){
			expect(namespace.version).toBeDefined();
			expect(typeof namespace.version).toEqual('string');
		});

		it('viewport', function (){
			expect(namespace.viewport).toBeDefined();
		});

	});

	describe('The namespace ch shoud be defined these contructors:', function () {

		it('Accordion', function (){
			expect(namespace.Accordion).toBeDefined();
		});

		it('Blink', function (){
			expect(namespace.Blink).toBeDefined();
		});

		it('Calendar', function (){
			expect(namespace.Calendar).toBeDefined();
		});

		it('Carousel', function (){
			expect(namespace.Carousel).toBeDefined();
		});

		it('Condition', function (){
			expect(namespace.Condition).toBeDefined();
		});

		it('Countdown', function (){
			expect(namespace.Countdown).toBeDefined();
		});

		it('Custom', function (){
			expect(namespace.Custom).toBeDefined();
		});

		it('DatePicker', function (){
			expect(namespace.DatePicker).toBeDefined();
		});

		it('Modal', function (){
			expect(namespace.Modal).toBeDefined();
		});

		it('Suggest', function (){
			expect(namespace.Suggest).toBeDefined();
		});

		it('Widget', function (){
			expect(namespace.Widget).toBeDefined();
		});

	});

});
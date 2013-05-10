var namespace = ch;

describe('The Namespace ch', function () {
    it('shoud be defined', function (){
        expect(namespace).toBeDefined();
        expect(typeof namespace).toEqual('object');
    });
});

describe('The namespace ch shoud have these static members:', function () {

    it('$', function (){
        expect(namespace.$).toBeDefined();
    });

    it('blink', function (){
        expect(namespace.blink).toBeDefined();
    });

    it('cache', function (){
        expect(namespace.cache).toBeDefined();
    });

    it('events', function (){
        expect(namespace.events).toBeDefined();
    });

    it('factory', function (){
        expect(namespace.factory).toBeDefined();
    });

    it('instances', function (){
        expect(namespace.instances).toBeDefined();
        expect(typeof namespace.instances).toEqual('object');
    });

    it('onImagesLoads', function (){
        expect(namespace.onImagesLoads).toBeDefined();
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

describe('The namespace ch shoud have these contructors:', function () {

    it('AutoComplete', function (){
        expect(namespace.AutoComplete).toBeDefined();
    });

    it('Bubble', function (){
        expect(namespace.Bubble).toBeDefined();
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

    it('Content', function (){
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

    it('Dropdown', function (){
        expect(namespace.Dropdown).toBeDefined();
    });

    it('Email', function (){
        expect(namespace.Email).toBeDefined();
    });

    it('Expandable', function (){
        expect(namespace.Expandable).toBeDefined();
    });

    it('Form', function (){
        expect(namespace.Form).toBeDefined();
    });

    it('Layer', function (){
        expect(namespace.Layer).toBeDefined();
    });

    it('Max', function (){
        expect(namespace.Max).toBeDefined();
    });

    it('MaxLength', function (){
        expect(namespace.MaxLength).toBeDefined();
    });

    it('Menu', function (){
        expect(namespace.Menu).toBeDefined();
    });

    it('Min', function (){
        expect(namespace.Min).toBeDefined();
    });

    it('MinLength', function (){
        expect(namespace.MinLength).toBeDefined();
    });

    it('MinLength', function (){
        expect(namespace.MinLength).toBeDefined();
    });

    it('Modal', function (){
        expect(namespace.Modal).toBeDefined();
    });

    it('Number', function (){
        expect(namespace.Number).toBeDefined();
    });

    it('Popover', function (){
        expect(namespace.Popover).toBeDefined();
    });

    it('Positioner', function (){
        expect(namespace.Positioner).toBeDefined();
    });

    it('Price', function (){
        expect(namespace.Price).toBeDefined();
    });

    it('Required', function (){
        expect(namespace.Required).toBeDefined();
    });

    it('Shortcuts', function (){
        expect(namespace.Shortcuts).toBeDefined();
    });

    it('String', function (){
        expect(namespace.String).toBeDefined();
    });

    it('Tabs', function (){
        expect(namespace.Tabs).toBeDefined();
    });

    it('Tooltip', function (){
        expect(namespace.Tooltip).toBeDefined();
    });

    it('Transition', function (){
        expect(namespace.Transition).toBeDefined();
    });

    it('Url', function (){
        expect(namespace.Url).toBeDefined();
    });

    it('Validation', function (){
        expect(namespace.Validation).toBeDefined();
    });

    it('Widget', function (){
        expect(namespace.Widget).toBeDefined();
    });

    it('Zoom', function (){
        expect(namespace.Zoom).toBeDefined();
    });

});
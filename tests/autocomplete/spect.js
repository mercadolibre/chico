var template = '<form id="form{ID}" action="./" class="ch-form"><div class="ch-form-row"><label>Test {ID}</label><input id="autoComplete{ID}" type="text"></div><div class="ch-form-actions"><input type="submit" class="ch-btn"></div></form>',
    idGenerator = (function(){
        var count = 0;

        return function(){
            return count++;
        }
    }()),
    getSnippet = function(selector){
        var n = idGenerator();
        var f = $(template.replace(/{ID}/g, n));
        var snippet = f.find(selector + n);
        $('body').prepend(f);
        return snippet;
    },
    suggestions = ['Aruba', 'Armenia', 'Argentina'],
    suggestionsHTML = ['<span class="HTMLAdded">Argentina</span>', '<span class="HTMLAdded">Armenia</span>', '<span class="HTMLAdded">Aruba</span>'],
    autoComplete = getSnippet('#autoComplete').autocomplete({'fx': 'none'}),
    autoCompleteHTML = getSnippet('#autoComplete').autocomplete({'html': true}),
    readyEvent = jasmine.createSpy('readyEvent'),
    hideEvent = jasmine.createSpy('hideEvent'),
    typingEvent = jasmine.createSpy('typingEvent');

    autoComplete
        .on('type', function () {
            typingEvent();
            autoComplete.suggest(suggestions);
        })
        .on('ready', function () { readyEvent(); })
        ._el.value = 'ar';

    autoCompleteHTML
        .on('type', function () {
            autoCompleteHTML.suggest(suggestionsHTML);
        })
        ._el.value = 'ar';


describe('ch.Autocomplete', function () {

    it('should be defined in ch object', function () {
        expect(ch.hasOwnProperty('Autocomplete')).toBeTruthy();
        expect(typeof ch.Autocomplete).toEqual('function');
    });

    it('should be defined in $ object', function () {
        expect($.fn.hasOwnProperty('autocomplete')).toBeTruthy();
        expect(typeof ch.Autocomplete).toEqual('function');
    });

    it('should be return a new instance', function () {
        expect(autoComplete instanceof ch.Autocomplete).toBeTruthy();
    });

    it('should emit the "ready" event when it\'s created', function () {
        waits(50);
        runs(function () {
            expect(readyEvent).toHaveBeenCalled();
        });
    });

    describe('should use the following abilities:', function () {
        it('EventEmitter', function () {
            expect(autoComplete.on).not.toEqual(undefined);
            expect(typeof autoComplete.on).toEqual('function');
        });

        it('Popover', function () {
            expect(autoComplete._popover).not.toEqual(undefined);
            expect(autoComplete._popover instanceof ch.Popover).toBeTruthy();
        });
    });

});

describe('It should have the following public properties:', function () {

    it('._el', function () {
        expect(autoComplete._el).not.toEqual(undefined);
        expect(autoComplete._el.nodeType).toEqual(1);
        expect(autoComplete._el instanceof HTMLInputElement).toBeTruthy();
    });

    it('.$trigger', function () {
        expect(autoComplete.$trigger).not.toEqual(undefined);
        expect(autoComplete.$trigger instanceof $).toBeTruthy();
    });

    it('.name', function () {
        expect(autoComplete.name).not.toEqual(undefined);
        expect(typeof autoComplete.name).toEqual('string');
        expect(autoComplete.name).toEqual('autocomplete');
    });

    it('.constructor', function () {
        expect(autoComplete.constructor).not.toEqual(undefined);
        expect(typeof autoComplete.constructor).toEqual('function');
    });

    it('.uid', function () {
        expect(autoComplete.uid).not.toEqual(undefined);
        expect(typeof autoComplete.uid).toEqual('number');
    });

});

describe('It should have the following public methods:', function () {
    var methods = ['destroy', 'suggest', 'hide', 'isShown', 'enable', 'disable'],
        i = 0,
        len = methods.length;

    for (i; i < len; i += 1) {
        (function (i){
            it('.' + methods[i] + '()', function () {
                expect(autoComplete[methods[i]]).not.toEqual(undefined);
                expect(typeof autoComplete[methods[i]]).toEqual('function');
            });
        }(i));
    }
});

describe('The input element should have the following WAI-ARIA attributes', function () {
    var $input = autoComplete.$trigger,
        inputID = autoComplete.$container[0].id;

    it('"aria-haspopup" in "true"', function () {
       expect($input.attr('aria-haspopup')).toEqual('true');
    });

    it('"aria-autocomplete" in "list"', function () {
       expect($input.attr('aria-autocomplete')).toEqual('list');
    });

    it('"aria-owns" in "' + inputID + '"', function () {
       expect($input.attr('aria-owns')).toEqual(inputID);
    });

});

describe('It should have a "$container" property and', function () {
    var $container = autoComplete.$container;

    it('should exist', function () {
        expect($container).not.toEqual(undefined);
        expect($container[0].nodeType).toEqual(1);
        expect($container instanceof $).toBeTruthy();
    });

    it('should have the ".ch-autocomplete" class name ', function () {
        expect($container.hasClass('ch-autocomplete')).toBeTruthy();
    });

    it('should be hidden', function () {
        expect($container.hasClass('ch-hide')).toBeTruthy();
        expect($container[0].getAttribute('aria-hidden')).toBeTruthy('true');
    });

    it('should have the WAI-ARIA attribute "role" in "dialog"', function () {
        expect($container.attr('role')).toEqual('dialog');
    });

});



describe('It should emits typing event and',function(){
    autoComplete._el.focus();

    autoComplete.emit('type', autoComplete._el.value);

    it('should trigger the callback function', function () {
        expect(typingEvent).toHaveBeenCalled();
    });

});

describe('Its suggest() method', function () {

    describe('shows the suggetion list', function () {
        var itemsHighilighted,
            $suggestionList;

        it('open when suggestions are given', function () {
            autoComplete._el.focus();
            autoComplete.emit('type', autoComplete._el.value);
            expect(autoComplete.isShown()).toBeTruthy();
        });

        it('should have hightlighted keywords', function () {
            autoComplete._el.focus();
            autoComplete._currentQuery = 'ar';
            autoComplete.suggest(suggestions);
            itemsHighilighted = autoComplete.$container.find('strong').length;
            expect(itemsHighilighted).toEqual(3);
        });

        it('should show the same number of items as suggestions array have', function () {
            itemsHighilighted = autoComplete.$container.find('.ch-autocomplete-item').length;
            expect(suggestions.length).toEqual(3);
        });

        it('should close the suggestion list if there is no results', function () {
            autoComplete.suggest([]);
            expect(autoComplete.isShown()).toBeFalsy();
        });

    });

});

describe('Its hide() method', function () {
    var $container = autoComplete.$container,
        instance;

        autoComplete.on('hide', function () { hideEvent(); })

    it('should add "ch-hide" class name to container', function () {
        instance = autoComplete.hide();
        expect($container.hasClass('ch-hide')).toBeTruthy();
    });

    it('should update the WAI-ARIA attribute "aria-hidden" to "true" on container', function () {
        expect($container.attr('aria-hidden')).toEqual('true');
    });

    it('should emit the "hide" event', function () {
        expect(hideEvent).toHaveBeenCalled();
    });

    it('should return the same instance than initialized component', function () {
        expect(instance).toEqual(autoComplete);
    });

});

describe('Its isShown() method', function () {
    var isShown;

    it('should return "true" when the component is shown', function () {
        autoComplete._el.focus();
        autoComplete.emit('type', autoComplete._el.value);
        isShown = autoComplete.isShown();

        expect(typeof isShown).toEqual('boolean');
        expect(isShown).toBeTruthy();
    });

    it('should return "false" when the component is hidden', function () {
        autoComplete.hide();
        isShown = autoComplete.isShown();

        expect(typeof isShown).toEqual('boolean');
        expect(isShown).toBeFalsy();
    });

    autoComplete.hide();
});

describe('Its disable() method', function () {
    var instance,
        isShown;

    it('should prevent to suggest', function () {
        autoComplete._el.focus();
        autoComplete.emit('type', autoComplete._el.value);
        instance = autoComplete.disable();
        expect(autoComplete.isShown()).toBeFalsy();
    });

    it('should return the same instance than initialized component', function () {
        expect(instance).toEqual(autoComplete);
    });
});

describe('Its enable() method', function () {
    var instance,
        isShown;

    it('should suggest', function () {
        instance = autoComplete.enable();
        autoComplete._el.focus();
        autoComplete.emit('type', autoComplete._el.value);
        expect(autoComplete.isShown()).toBeTruthy();
    });

    it('should return the same instance than initialized component', function () {
        expect(instance).toEqual(autoComplete);
    });

});

describe('Instance an AutoComplete configured to show HTML', function () {

    it('should return the items with the HTML sent', function () {

        autoCompleteHTML._el.focus();
        autoCompleteHTML.emit('type', autoCompleteHTML._el.value);

        // this wait is for the focu
        waits(300);
        runs(function () {
            var itemAdded = autoCompleteHTML.$container[0].querySelector('.ch-autocomplete-item .HTMLAdded');
            expect(itemAdded.nodeType).toEqual(1);
        });

    });

});

describe('Its destroy() method', function () {

    it('should reset the $trigger', function () {
        autoComplete.destroy();
        expect(autoComplete.$trigger.attr('aria-haspopup')).toBeUndefined();
        expect(autoComplete.$trigger.attr('aria-owns')).toBeUndefined();
        expect(autoComplete.$trigger.attr('aria-autocomplete')).toBeUndefined();
    });

    it('should remove ".autocomplete" events', function () {
        expect($._data(autoComplete.$trigger[0], 'events')).toBeUndefined();
    });

    it('should remove the instance from the element', function () {
        expect(autoComplete._$el.data('autoComplete')).toBeUndefined();
    });

});

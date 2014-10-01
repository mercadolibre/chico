var suggestions = ['Aruba', 'Armenia', 'Argentina'],
    suggestionsHTML = ['<span class="HTMLAdded">Argentina</span>', '<span class="HTMLAdded">Armenia</span>', '<span class="HTMLAdded">Aruba</span>'],
    autocomplete = new ch.Autocomplete(document.querySelector('#autocomplete-1'), {'fx': 'none'}),
    autocompleteHTML = new ch.Autocomplete(document.querySelector('#autocomplete-2'), {'html': true}),
    readyEvent = jasmine.createSpy('readyEvent'),
    hideEvent = jasmine.createSpy('hideEvent'),
    typingEvent = jasmine.createSpy('typingEvent');

    autocomplete
        .on('type', function () {
            typingEvent();
            autocomplete.suggest(suggestions);
        })
        .on('ready', function () { readyEvent(); })
        ._el.value = 'ar';

    autocompleteHTML
        .on('type', function () {
            autocompleteHTML.suggest(suggestionsHTML);
        })
        ._el.value = 'ar';


describe('ch.Autocomplete', function () {

    it('should be defined in ch object', function () {
        expect(ch.hasOwnProperty('Autocomplete')).toBeTruthy();
        expect(typeof ch.Autocomplete).toEqual('function');
    });

    it('should be defined in $ object', function () {
        expect(ch.hasOwnProperty('Autocomplete')).toBeTruthy();
        expect(typeof ch.Autocomplete).toEqual('function');
    });

    it('should be return a new instance', function () {
        expect(autocomplete instanceof ch.Autocomplete).toBeTruthy();
    });

    it('should emit the "ready" event when it\'s created', function () {
        waits(50);
        runs(function () {
            expect(readyEvent).toHaveBeenCalled();
        });
    });

    describe('should use the following abilities:', function () {
        it('EventEmitter', function () {
            expect(autocomplete.on).not.toEqual(undefined);
            expect(typeof autocomplete.on).toEqual('function');
        });

        it('Popover', function () {
            expect(autocomplete._popover).not.toEqual(undefined);
            expect(autocomplete._popover instanceof ch.Popover).toBeTruthy();
        });
    });

});

describe('It should have the following public properties:', function () {

    it('._el', function () {
        expect(autocomplete._el).not.toEqual(undefined);
        expect(autocomplete._el.nodeType).toEqual(1);
        expect(autocomplete._el instanceof HTMLInputElement).toBeTruthy();
    });

    it('.$trigger', function () {
        expect(autocomplete.trigger).not.toEqual(undefined);
        expect(autocomplete.trigger instanceof HTMLElement).toBeTruthy();
    });

    it('.name', function () {
        expect(autocomplete.name).not.toEqual(undefined);
        expect(typeof autocomplete.name).toEqual('string');
        expect(autocomplete.name).toEqual('autocomplete');
    });

    it('.constructor', function () {
        expect(autocomplete.constructor).not.toEqual(undefined);
        expect(typeof autocomplete.constructor).toEqual('function');
    });

    it('.uid', function () {
        expect(autocomplete.uid).not.toEqual(undefined);
        expect(typeof autocomplete.uid).toEqual('number');
    });

});

describe('It should have the following public methods:', function () {
    var methods = ['destroy', 'suggest', 'hide', 'isShown', 'enable', 'disable'],
        i = 0,
        len = methods.length;

    for (i; i < len; i += 1) {
        (function (i){
            it('.' + methods[i] + '()', function () {
                expect(autocomplete[methods[i]]).not.toEqual(undefined);
                expect(typeof autocomplete[methods[i]]).toEqual('function');
            });
        }(i));
    }
});

describe('The input element should have the following WAI-ARIA attributes', function () {
    var input = autocomplete.trigger,
        inputID = autocomplete.container.getAttribute('id');

    it('"aria-haspopup" in "true"', function () {
       expect(input.getAttribute('aria-haspopup')).toEqual('true');
    });

    it('"aria-autocomplete" in "list"', function () {
       expect(input.getAttribute('aria-autocomplete')).toEqual('list');
    });

    it('"aria-owns" in "' + inputID + '"', function () {
       expect(input.getAttribute('aria-owns')).toEqual(inputID);
    });

});

describe('It should have a "container" property and', function () {
    var container = autocomplete.container;

    it('should exist', function () {
        expect(container).not.toEqual(undefined);
        expect(container.nodeType).toEqual(1);
        expect(container instanceof HTMLElement).toBeTruthy();
    });

    it('should have the ".ch-autocomplete" class name ', function () {
        expect(container.classList.contains('ch-autocomplete')).toBeTruthy();
    });

    it('should be hidden', function () {
        expect(container.classList.contains('ch-hide')).toBeTruthy();
        expect(container.getAttribute('aria-hidden')).toBeTruthy('true');
    });

    it('should have the WAI-ARIA attribute "role" in "dialog"', function () {
        expect(container.getAttribute('role')).toEqual('dialog');
    });

});



describe('It should emits typing event and',function(){
    autocomplete._el.focus();

    autocomplete.emit('type', autocomplete._el.value);

    it('should trigger the callback function', function () {
        expect(typingEvent).toHaveBeenCalled();
    });

});

describe('Its suggest() method', function () {

    describe('shows the suggetion list', function () {
        var itemsHighilighted,
            $suggestionList;

        it('open when suggestions are given', function () {
            autocomplete._el.focus();
            autocomplete.emit('type', autocomplete._el.value);
            expect(autocomplete.isShown()).toBeTruthy();
        });

        it('should have hightlighted keywords', function () {
            autocomplete._el.focus();
            autocomplete._currentQuery = 'ar';
            autocomplete.suggest(suggestions);
            itemsHighilighted = autocomplete.container.getElementsByTagName('strong').length;
            expect(itemsHighilighted).toEqual(3);
        });

        it('should show the same number of items as suggestions array have', function () {
            itemsHighilighted = autocomplete.container.querySelectorAll('.ch-autocomplete-item').length;
            expect(suggestions.length).toEqual(3);
        });

        it('should close the suggestion list if there is no results', function () {
            autocomplete.suggest([]);
            expect(autocomplete.isShown()).toBeFalsy();
        });

    });

});

describe('Its hide() method', function () {
    var container = autocomplete.container,
        instance;

        autocomplete.on('hide', function () { hideEvent(); })

    it('should add "ch-hide" class name to container', function () {
        instance = autocomplete.hide();
        expect(container.classList.contains('ch-hide')).toBeTruthy();
    });

    it('should update the WAI-ARIA attribute "aria-hidden" to "true" on container', function () {
        expect(container.getAttribute('aria-hidden')).toEqual('true');
    });

    it('should emit the "hide" event', function () {
        expect(hideEvent).toHaveBeenCalled();
    });

    it('should return the same instance than initialized component', function () {
        expect(instance).toEqual(autocomplete);
    });

});

describe('Its isShown() method', function () {
    var isShown;

    it('should return "true" when the component is shown', function () {
        autocomplete._el.focus();
        autocomplete.emit('type', autocomplete._el.value);
        isShown = autocomplete.isShown();

        expect(typeof isShown).toEqual('boolean');
        expect(isShown).toBeTruthy();
    });

    it('should return "false" when the component is hidden', function () {
        autocomplete.hide();
        isShown = autocomplete.isShown();

        expect(typeof isShown).toEqual('boolean');
        expect(isShown).toBeFalsy();
    });

    autocomplete.hide();
});

describe('Its disable() method', function () {
    var instance,
        isShown;

    it('should prevent to suggest', function () {
        autocomplete._el.focus();
        autocomplete.emit('type', autocomplete._el.value);
        instance = autocomplete.disable();
        expect(autocomplete.isShown()).toBeFalsy();
    });

    it('should return the same instance than initialized component', function () {
        expect(instance).toEqual(autocomplete);
    });
});

describe('Its enable() method', function () {
    var instance,
        isShown;

    it('should suggest', function () {
        instance = autocomplete.enable();
        autocomplete._el.focus();
        autocomplete.emit('type', autocomplete._el.value);
        expect(autocomplete.isShown()).toBeTruthy();
    });

    it('should return the same instance than initialized component', function () {
        expect(instance).toEqual(autocomplete);
    });

});

describe('Instance an AutoComplete configured to show HTML', function () {

    it('should return the items with the HTML sent', function () {

        autocompleteHTML._el.focus();
        autocompleteHTML.emit('type', autocompleteHTML._el.value);

        // this wait is for the focu
        waits(300);
        runs(function () {
            var itemAdded = autocompleteHTML.container.querySelector('.ch-autocomplete-item .HTMLAdded');
            expect(itemAdded.nodeType).toEqual(1);
        });

    });

});

describe('Its destroy() method', function () {

    it('should reset the "trigger"', function () {
        autocomplete.destroy();
        expect(autocomplete.trigger.getAttribute('aria-haspopup')).toBeUndefined();
        expect(autocomplete.trigger.getAttribute('aria-owns')).toBeUndefined();
        expect(autocomplete.trigger.getAttribute('aria-autocomplete')).toBeUndefined();
    });

    it('should remove ".autocomplete" events', function () {
        // expect($._data(autocomplete.$trigger[0], 'events')).toBeUndefined();
    });

    it('should remove the instance from the element', function () {
        expect(ch.Component.instances[autocomplete._el.uid]).toBeUndefined();
    });

});

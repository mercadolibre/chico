describe('ch.Autocomplete', function () {
    var container = document.createElement('div');
    var suggestions = ['Aruba', 'Armenia', 'Argentina'];
    var suggestionsHTML = ['<span class="HTMLAdded">Argentina</span>', '<span class="HTMLAdded">Armenia</span>', '<span class="HTMLAdded">Aruba</span>'];
    var autocomplete;
    var autocompleteHTML;

    var readyEvent = chai.spy();
    var hideEvent = chai.spy();
    var typingEvent = chai.spy();

    before(function(){
        container.innerHTML = '<form id="form-1" action="./" class="ch-form">'+
                                '<div class="ch-form-row">'+
                                    '<label>Test {ID}</label>'+
                                    '<input id="autocomplete-1" type="text">'+
                                '</div>'+
                                '<div class="ch-form-actions">'+
                                    '<input type="submit" class="ch-btn">'+
                                '</div>'+
                            '</form>'+
                            '<form id="form-2" action="./" class="ch-form">'+
                                '<div class="ch-form-row">'+
                                    '<label>Test {ID}</label>'+
                                    '<input id="autocomplete-2" type="text">'+
                                '</div>'+
                                '<div class="ch-form-actions">'+
                                    '<input type="submit" class="ch-btn">'+
                                '</div>'+
                            '</form>'
        document.body.appendChild(container);

        autocomplete = new ch.Autocomplete(document.querySelector('#autocomplete-1'), {'fx': 'none'});
        autocompleteHTML = new ch.Autocomplete(document.querySelector('#autocomplete-2'), {'html': true});

        autocomplete
            .on('type', function () {
                typingEvent();
                autocomplete.suggest(suggestions);
            })
            .on('ready', readyEvent)
            ._el.value = 'ar';

        autocompleteHTML
            .on('type', function () {
                autocompleteHTML.suggest(suggestionsHTML);
            })
            ._el.value = 'ar';

    });

    after(function () {
        document.body.removeChild(container);
    });


    it('should be defined in ch object', function () {
        expect(ch.Autocomplete).to.exist;
        expect(ch.Autocomplete).to.be.a('function');
    });

    it('should be return a new instance', function () {
        expect(autocomplete).to.be.an.instanceof(ch.Autocomplete);
    });

    it('should emit the "ready" event when it\'s created', function (done) {
        setTimeout(function () {
            expect(readyEvent).to.have.been.called();
            done();
        }, 50);
    });

    describe('should use the following abilities:', function () {
        it('EventEmitter', function () {
            expect(autocomplete.on).to.exist;
            expect(autocomplete.on).to.be.a('function');
        });

        it('Popover', function () {
            expect(autocomplete._popover).to.exist;
            expect(autocomplete._popover).to.be.an.instanceof(ch.Popover);
        });
    });

    describe('It should have the following public properties:', function () {
        it('._el', function () {
            expect(autocomplete._el).to.exist;
            expect(autocomplete._el.nodeType).to.equal(1);
            expect(autocomplete._el).to.be.an.instanceof(HTMLInputElement);
        });

        it('.trigger', function () {
            expect(autocomplete.trigger).to.exist;
            expect(autocomplete.trigger).to.be.an.instanceof(HTMLElement);
        });

        it('.name', function () {
            expect(autocomplete.name).to.exist;
            expect(autocomplete.name).to.be.a('string');
            expect(autocomplete.name).to.equal('autocomplete');
        });

        it('.constructor', function () {
            expect(autocomplete.constructor).to.exist;
            expect(autocomplete.constructor).to.be.a('function');
        });

        it('.uid', function () {
            expect(autocomplete.uid).to.exist;
            expect(autocomplete.uid).to.be.a('number');
        });

    });

    describe('It should have the following public methods:', function () {
        var methods = ['destroy', 'suggest', 'hide', 'isShown', 'enable', 'disable'],
            i = 0,
            len = methods.length;

        for (i; i < len; i += 1) {
            (function (i) {
                it('.' + methods[i] + '()', function () {
                    expect(autocomplete[methods[i]]).to.exist;
                    expect(autocomplete[methods[i]]).to.be.a('function');
                });
            }(i));
        }
    });

    describe('The input element should have the following WAI-ARIA attributes', function () {
        var input,
            inputID;

        before(function () {
            input = autocomplete.trigger;
            inputID = autocomplete.container.getAttribute('id');
        });

        it('"aria-haspopup" in "true"', function () {
            expect(input.getAttribute('aria-haspopup')).to.equal('true');
        });

        it('"aria-autocomplete" in "list"', function () {
            expect(input.getAttribute('aria-autocomplete')).to.equal('list');
        });

        it('"aria-owns" in "' + inputID + '"', function () {
            expect(input.getAttribute('aria-owns')).to.equal(inputID);
        });

    });

    describe('It should have a "container" property and', function () {
        var container;

        before(function () {
            container = autocomplete.container;
        });

        it('should exist', function () {
            expect(container).to.exist;
            expect(container.nodeType).to.equal(1);
            expect(container).to.be.an.instanceof(HTMLElement);
        });

        it('should have the ".ch-autocomplete" class name ', function () {
            expect(tiny.hasClass(container, 'ch-autocomplete')).to.be.true;
        });

        it('should be hidden', function () {
            expect(tiny.hasClass(container, 'ch-hide')).to.be.true;
            expect(container.getAttribute('aria-hidden')).to.equal('true');
        });

        it('should have the WAI-ARIA attribute "role" in "dialog"', function () {
            expect(container.getAttribute('role')).to.equal('dialog');
        });
    });

    describe('It should emits typing event and', function () {
        before(function () {
            autocomplete._el.focus();
            autocomplete.emit('type', autocomplete._el.value);
        });

        it('should trigger the callback function', function () {
            expect(typingEvent).to.have.been.called();
        });

    });

    describe('Its suggest() method', function () {

        describe('shows the suggetion list', function () {
            var itemsHighlighted;

            it('open when suggestions are given', function () {
                autocomplete._el.focus();
                autocomplete.emit('type', autocomplete._el.value);
                expect(autocomplete.isShown()).to.be.true;
            });

            it('should have hightlighted keywords', function () {
                autocomplete._el.focus();
                autocomplete._currentQuery = 'ar';
                autocomplete.suggest(suggestions);
                itemsHighlighted = autocomplete.container.getElementsByTagName('strong').length;
                expect(itemsHighlighted).to.equal(3);
            });

            it('should show the same number of items as suggestions array have', function () {
                itemsHighlighted = autocomplete.container.querySelectorAll('.ch-autocomplete-item').length;
                expect(suggestions.length).to.equal(3);
            });

            it('should close the suggestion list if there is no results', function () {
                autocomplete.suggest([]);
                expect(autocomplete.isShown()).to.be.false;
            });

        });

    });

    describe('Its hide() method', function () {
        var container,
            instance;

        before(function () {
            container = autocomplete.container;
            autocomplete.on('hide', hideEvent);
        });

        it('should add "ch-hide" class name to container', function () {
            instance = autocomplete.hide();
            expect(tiny.hasClass(container, 'ch-hide')).to.be.true;
        });

        it('should update the WAI-ARIA attribute "aria-hidden" to "true" on container', function () {
            expect(container.getAttribute('aria-hidden')).to.equal('true');
        });

        it('should emit the "hide" event', function () {
            expect(hideEvent).to.have.been.called();
        });

        it('should return the same instance than initialized component', function () {
            expect(instance).to.eql(autocomplete);
        });

    });

    describe('Its isShown() method', function () {
        var isShown;

        after(function () {
            autocomplete.hide();
        });

        it('should return "true" when the component is shown', function () {
            autocomplete._el.focus();
            autocomplete.emit('type', autocomplete._el.value);
            isShown = autocomplete.isShown();

            expect(isShown).to.be.a('boolean');
            expect(isShown).to.be.true;
        });

        it('should return "false" when the component is hidden', function () {
            autocomplete.hide();
            isShown = autocomplete.isShown();

            expect(isShown).to.be.a('boolean');
            expect(isShown).to.be.false;
        });
    });

    describe('Its disable() method', function () {
        var instance;

        it('should prevent to suggest', function () {
            autocomplete._el.focus();
            autocomplete.emit('type', autocomplete._el.value);
            instance = autocomplete.disable();
            expect(autocomplete.isShown()).to.be.false;
        });

        it('should return the same instance than initialized component', function () {
            expect(instance).to.eql(autocomplete);
        });
    });

    describe('Its enable() method', function () {
        var instance;

        it('should suggest', function () {
            instance = autocomplete.enable();
            autocomplete._el.focus();
            autocomplete.emit('type', autocomplete._el.value);
            expect(autocomplete.isShown()).to.be.true;
        });

        it('should return the same instance than initialized component', function () {
            expect(instance).to.eql(autocomplete);
        });

    });

    describe('Instance an AutoComplete configured to show HTML', function () {

        it('should return the items with the HTML sent', function (done) {
            autocompleteHTML._el.focus();
            autocompleteHTML.emit('type', autocompleteHTML._el.value);

            // this wait is for the focus
            setTimeout(function () {
                var itemAdded = autocompleteHTML.container.querySelector('.ch-autocomplete-item .HTMLAdded');
                expect(itemAdded.nodeType).to.equal(1);
                done();
            }, 300);
        });

    });

    describe('Its destroy() method', function () {
        it('should reset the "trigger"', function () {
            autocomplete.destroy();
            expect(autocomplete.trigger.getAttribute('aria-haspopup')).to.be.null;
            expect(autocomplete.trigger.getAttribute('aria-owns')).to.be.null;
            expect(autocomplete.trigger.getAttribute('aria-autocomplete')).to.be.null;
        });

        it('should remove the instance from the element', function () {
            expect(ch.instances[autocomplete._el.uid]).to.not.exist;
        });
    });

});


var dropdown1 = $('#dropdown1').dropdown(),
    $t = dropdown1.$trigger,
    $c = dropdown1.$container,
    dropdown2 = $('#dropdown2').dropdown({
        'skin': true
    });

describe('Dropdown', function () {

    it('should be defined on ch object', function () {
        expect(ch.hasOwnProperty('Dropdown')).toBeTruthy();
        expect(typeof ch.Dropdown).toEqual('function');
    });

    it('should be defined on $ object', function () {
        expect($.fn.hasOwnProperty('dropdown')).toBeTruthy();
        expect(typeof $.fn.dropdown).toEqual('function');
    });

    it('should return a new instance of Dropdown', function () {
        expect(dropdown1 instanceof ch.Dropdown).toBeTruthy();
    });
});

describe('It should have a container with', function () {

    it('role combobox', function () {
        expect($c.attr('role')).toEqual('combobox');
    });

    it('specific CSS class names', function () {
        expect($c.hasClass('ch-dropdown')).toBeTruthy();
        expect($c.hasClass('ch-box-lite')).toBeTruthy();
    });
});

describe('By default', function () {
    it('should have class names like a button', function () {
        expect($t.hasClass('ch-btn-skin')).toBeTruthy();
        expect($t.hasClass('ch-btn-small')).toBeTruthy();
    });
});

describe('An intance configured with skin', function () {
    it('should have a specific class name on trigger', function () {
        expect(dropdown2.$trigger.hasClass('ch-dropdown-trigger-skin')).toBeTruthy();
    });

    it('shouldn\'t have class names like a button', function () {
        expect(dropdown2.$trigger.hasClass('ch-btn-skin')).toBeFalsy();
        expect(dropdown2.$trigger.hasClass('ch-btn-small')).toBeFalsy();
    });
});

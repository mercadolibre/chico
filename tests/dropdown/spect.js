var dropdown1 = new ch.Dropdown(document.getElementById('dropdown1')),
    t = dropdown1.trigger,
    c = dropdown1.container,
    dropdown2 = new ch.Dropdown(document.getElementById('dropdown2'), {
        'skin': true
    });

describe('Dropdown', function () {

    it('should be defined on ch object', function () {
        expect(ch.hasOwnProperty('Dropdown')).toBeTruthy();
        expect(typeof ch.Dropdown).toEqual('function');
    });

    it('should return a new instance of Dropdown', function () {
        expect(dropdown1 instanceof ch.Dropdown).toBeTruthy();
    });
});

describe('It should have a container with', function () {

    it('role combobox', function () {
        expect(c.getAttribute('role')).toEqual('combobox');
    });

    it('specific CSS class names', function () {
        expect(ch.util.classList(c).contains('ch-dropdown')).toBeTruthy();
        expect(ch.util.classList(c).contains('ch-box-lite')).toBeTruthy();
    });
});

describe('By default', function () {
    it('should have class names like a button', function () {
        expect(ch.util.classList(t).contains('ch-btn-skin')).toBeTruthy();
        expect(ch.util.classList(t).contains('ch-btn-small')).toBeTruthy();
    });
});

describe('An intance configured with skin', function () {
    it('should have a specific class name on trigger', function () {
        expect(ch.util.classList(dropdown2.trigger).contains('ch-dropdown-trigger-skin')).toBeTruthy();
    });

    it('shouldn\'t have class names like a button', function () {
        expect(ch.util.classList(dropdown2.trigger).contains('ch-btn-skin')).toBeFalsy();
        expect(ch.util.classList(dropdown2.trigger).contains('ch-btn-small')).toBeFalsy();
    });
});

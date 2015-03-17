var bubble = new ch.Bubble(document.querySelector('#bubble')).show(),
    c = bubble.container;

describe('Bubble', function () {

    it('should be defined on ch object', function () {
        expect(ch.hasOwnProperty('Bubble')).toBeTruthy();
        expect(typeof ch.Bubble).toEqual('function');
    });

    it('should return a new instance of Bubble', function () {
        expect(bubble instanceof ch.Bubble).toBeTruthy();
    });
});

describe('It should have a container with', function () {

    it('role alert', function () {
        expect(c.getAttribute('role')).toEqual('alert');
    });

    it('specific CSS class names', function () {
        expect(c.classList.contains('ch-bubble')).toBeTruthy();
        expect(c.classList.contains('ch-box-error')).toBeTruthy();
        expect(c.classList.contains('ch-cone')).toBeTruthy();
    });

    it('alignment', function () {
        waits(450);
        runs(function () {
            expect(c.getAttribute('data-side')).toEqual('right');
            expect(c.getAttribute('data-align')).toEqual('center');
        });
    });
});
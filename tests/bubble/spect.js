var bubble = $('#bubble').bubble().show(),
    $c = bubble.$container;

describe('Bubble', function () {

    it('should be defined on ch object', function () {
        expect(ch.hasOwnProperty('Bubble')).toBeTruthy();
        expect(typeof ch.Bubble).toEqual('function');
    });

    it('should be defined on $ object', function () {
        expect($.fn.hasOwnProperty('bubble')).toBeTruthy();
        expect(typeof $.fn.bubble).toEqual('function');
    });

    it('should return a new instance of Bubble', function () {
        expect(bubble instanceof ch.Bubble).toBeTruthy();
    });
});

describe('It should have a container with', function () {

    it('role alert', function () {
        expect($c.attr('role')).toEqual('alert');
    });

    it('specific CSS class names', function () {
        expect($c.hasClass('ch-bubble')).toBeTruthy();
        expect($c.hasClass('ch-box-error')).toBeTruthy();
        expect($c.hasClass('ch-cone')).toBeTruthy();
    });

    it('alignment', function () {
        waits(450);
        runs(function () {
            expect($c.attr('data-side')).toEqual('right');
            expect($c.attr('data-align')).toEqual('top');
        });
    });
});
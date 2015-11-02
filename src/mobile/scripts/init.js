    // Remove no-js classname
    tiny.removeClass(document.documentElement, 'no-js');

    // Expose event names
    for (var m in tiny) {
        if (/^on\w+/.test(m) && typeof tiny[m] === 'string') {
            ch[m] = tiny[m];
        }
    }

    // Iphone scale fix
    scaleFix();

    // Prevent zoom onfocus
    preventZoom();

    // Fix the broken iPad/iPhone form label click issue
    fixLabels();

    // Cancel pointers if the user scroll.
    cancelPointerOnScroll();

    var viewportmeta = document.querySelector('meta[name=viewport]');

    /**
     * Fixes the broken iPad/iPhone form label click issue.
     * @name fixLabels
     * @see Based on: <a href="http://www.quirksmode.org/dom/getstyles.html" target="_blank">http://www.quirksmode.org/dom/getstyles.html</a>
     */
    function fixLabels() {
        var labels = document.getElementsByTagName('label'),
            el,
            i = 0;

        function labelTap() {
            el = document.getElementById(this.getAttribute('for'));
            if (['radio', 'checkbox'].indexOf(el.getAttribute('type')) !== -1) {
                el.setAttribute('selected', !el.getAttribute('selected'));
            } else {
                el.focus();
            }
        }

        for (; labels[i]; i += 1) {
            if (labels[i].getAttribute('for')) {
                tiny.on(labels[i], ch.onpointertap, labelTap);
            }
        }
    }

    /**
     * Cancel pointers if the user scroll.
     * @name cancelPointerOnScroll
     */
    function cancelPointerOnScroll() {

        function blockPointer() {
            ch.pointerCanceled = true;

            function unblockPointer() {
                ch.pointerCanceled = false;
            }

            tiny.once(document, 'touchend', unblockPointer);
        }

        tiny.on(document, 'touchmove', blockPointer);
    }

    function gestureStart() {
        viewportmeta.setAttribute('content', 'width=device-width, minimum-scale=0.25, maximum-scale=1.6');
    }

    // Fix for iPhone viewport scale bug
    // http://www.blog.highub.com/mobile-2/a-fix-for-iphone-viewport-scale-bug/
    // @see View on <a href="https://github.com/h5bp/mobile-boilerplate" target="_blank">https://github.com/h5bp/mobile-boilerplate</a>
    function scaleFix() {
        var ua = navigator.userAgent;
        if (viewportmeta && /iPhone|iPad|iPod/.test(ua) && !/Opera Mini/.test(ua)) {
            viewportmeta.setAttribute('content', 'width=device-width, minimum-scale=1.0, maximum-scale=1.0');
            document.addEventListener('gesturestart', gestureStart, false);
        }
    }

    // Prevent iOS from zooming onfocus
    // https://github.com/h5bp/mobile-boilerplate/pull/108
    // @see View on <a href="https://github.com/h5bp/mobile-boilerplate" target="_blank">https://github.com/h5bp/mobile-boilerplate</a>
    function preventZoom() {
        var formFields = document.querySelectorAll('input, select, textarea'),
            contentString = 'width=device-width,initial-scale=1,maximum-scale=',
            i = 0;

        if (!viewportmeta) {
            return;
        }

        for (; i < formFields.length; i += 1) {
            formFields[i].onfocus = function() {
                viewportmeta.setAttribute('content', contentString + '1');
            };

            formFields[i].onblur = function () {
                viewportmeta.setAttribute('content', contentString + '10');
            };
        }
    }

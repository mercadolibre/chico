    /**
     * Core constructor function.
     * @private
     */
    // Remove no-js classname
    $html.removeClass('no-js');
    // Iphone scale fix
    ch.util.MBP.scaleFix();
    // Hide navigation url bar
    ch.util.MBP.hideUrlBarOnLoad();
    // Prevent zoom onfocus
    ch.util.MBP.preventZoom();
    // Fix the broken iPad/iPhone form label click issue
    ch.util.fixLabels();

    // Exposse private $ (Zepto) into ch.$
    ch.$ = $;

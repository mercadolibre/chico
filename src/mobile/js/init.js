    // Remove no-js classname
    ch.util.classList(html).remove('no-js');

    // Iphone scale fix
    ch.util.MBP.scaleFix();

    // Hide navigation url bar
    ch.util.MBP.hideUrlBarOnLoad();

    // Prevent zoom onfocus
    ch.util.MBP.preventZoom();

    // Fix the broken iPad/iPhone form label click issue
    ch.util.fixLabels();

    // Cancel pointers if the user scroll.
    ch.util.cancelPointerOnScroll();

    // Exposse private $ (Zepto) into ch.$
    ch.$ = $;
    // Remove no-js classname
    tiny.removeClass(document.documentElement, 'no-js');

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

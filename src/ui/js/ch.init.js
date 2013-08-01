    // Remove the no-js classname from html tag
    $html.removeClass('no-js');

    // Initialize shortcuts
    ch.shortcuts.init();

    // Exposse private $ (jQuery) into ch.$
    ch.$ = $;
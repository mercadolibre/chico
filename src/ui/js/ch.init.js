    /**
     * Core constructor function.
     * @private
     */
    // unmark the no-js flag on html tag
    $html.removeClass('no-js');

    ch.shortcuts.init();

    // Exposse private $ (jQuery) into ch.$
    ch.$ = $;

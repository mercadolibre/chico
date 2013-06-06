    /**
     * Core constructor function.
     * @private
     */
    ch.instances = instances;
    // unmark the no-js flag on html tag
    $html.removeClass('no-js');

    ch.shortcuts.init();

    // Exposse private $ (jQuery) into ch.$
    ch.$ = $;

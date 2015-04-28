    // Remove the no-js classname from html tag
    ch.util.classList(html).remove('no-js');

    // Create a non native browser event before it can be called
    ch.util.Event.createCustom(ch.onlayoutchange);

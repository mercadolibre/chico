// Remove the no-js classname from html tag
tiny.removeClass(document.documentElement, 'no-js');

// Expose event names
for (var m in tiny) {
    if (/^on\w+/.test(m) && typeof tiny[m] === 'string') {
        ch[m] = tiny[m];
    }
}

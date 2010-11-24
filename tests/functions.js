function exists(selector) {
	ok($(selector).length > 0, "Expected to find " + selector);
}

function notExists(selector) {
	ok($(selector).length == 0, "Expected not to find " + selector);
}

function isVisible(selector) {
	ok($(selector).is(":visible"), "Expected " + selector + " to be visible")
}

function isNotVisible(selector) {
	ok(!$(selector).is(":visible"), "Expected " + selector + " to be not visible")
}

function hasContent(selector, content) {
	ok($(selector).is(":contains('" + content + "')"), "Expected " + selector + " to contain " + content)
}

function hasNotContent(selector, content) {
	ok(!$(selector).is(":contains('" + content + "')"), "Expected " + selector + " to not contain " + content)
}

function hasClass(selector, classes) {
	ok($(selector).hasClass(classes), 'Expected ' + selector + ' to has "' + classes + '" class');
}

function hasNotClass(selector, classes) {
	ok(!$(selector).hasClass(classes), 'Expected ' + selector + ' to hasn\'t "' + classes + '" class');
}

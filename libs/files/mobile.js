/*
 * Files routes objects
 */
var JS = {},
	CSS = {};

/*
 * JS: Core
 */
JS.core = [
    "src/shared/js/ch.helpers.js",
    "src/shared/js/ch.util.js",
    "src/mobile/js/ch.util.js",
    "src/shared/js/ch.support.js",
    "src/shared/js/ch.events.js",
    "src/mobile/js/ch.events.js",
    "src/ui/js/ch.events.js",
    "src/shared/js/ch.factory.js",
    "src/ui/js/ch.shortcuts.js",
    "src/mobile/js/ch.init.js"
];

/*
 * JS: Abilities
 */
JS.abilities = [
    "src/shared/js/ch.EventEmitter.js",
    "src/mobile/js/ch.routes.js",
    "src/shared/js/ch.Content.js",
    "src/shared/js/ch.Closable.js",
    "src/shared/js/ch.Collapsible.js",
    "src/shared/js/ch.Viewport.js",
    "src/shared/js/ch.Positioner.js"
];

/*
 * JS: Widgets
 */
JS.widgets = [
    "src/shared/js/ch.Widget.js",
    "src/shared/js/ch.Expandable.js",
    "src/shared/js/ch.Menu.js",
    "src/shared/js/ch.Popover.js",
    "src/shared/js/ch.Layer.js",
    "src/shared/js/ch.Tooltip.js",
    "src/shared/js/ch.Bubble.js",
    "src/shared/js/ch.Modal.js",
    "src/shared/js/ch.Transition.js",
    "src/shared/js/ch.Dropdown.js",
    "src/shared/js/ch.Form.js",
    "src/shared/js/ch.Condition.js",
    "src/shared/js/ch.Validation.js",
    "src/shared/js/ch.String.js",
    "src/shared/js/ch.MaxLength.js",
    "src/shared/js/ch.MinLength.js",
    "src/shared/js/ch.Email.js",
    "src/shared/js/ch.URL.js",
    "src/shared/js/ch.Number.js",
    "src/shared/js/ch.Min.js",
    "src/shared/js/ch.Max.js",
    "src/shared/js/ch.Price.js",
    "src/shared/js/ch.Custom.js",
    "src/shared/js/ch.Required.js",
    "src/shared/js/ch.Countdown.js",
    "src/shared/js/ch.Calendar.js",
    "src/shared/js/ch.AutoComplete.js"
];


/*
 * CSS routes
 */

/*
 * CSS: Reset
 */
CSS.resetML = [
    "src/shared/css/ch.reset.css",
    "src/mobile/css/ch.reset.css",
    "src/shared/css/ch.typography.css"
];

/*
 * CSS: Core
 */
CSS.core = [
    "src/shared/css/ch.base.css",
    "src/mobile/css/ch.base.css",
    "src/shared/css/ch.icons.css",
    "src/shared/css/ch.boxes.css",
    "src/mobile/css/ch.boxes.css",
    "src/shared/css/ch.loading.css",
    "src/mobile/css/ch.loading.css"
];

/*
 * CSS: Widgets
 */
CSS.widgets = [
    "src/shared/css/ch.buttons.css",
    "src/mobile/css/ch.buttons.css",
    "src/shared/css/ch.datagrid.css",
    "src/shared/css/ch.lists.css",
    "src/shared/css/ch.pagination.css",
    "src/mobile/css/ch.pagination.css",
    "src/mobile/css/ch.list-options.css",
    "src/mobile/css/ch.tags.css",
    "src/mobile/css/ch.header.css",
    "src/mobile/css/ch.Expandable.css",
    "src/mobile/css/ch.Menu.css",
    "src/shared/css/ch.Form.css",
    "src/mobile/css/ch.Form.css",
    "src/shared/css/ch.Popover.css",
    "src/shared/css/ch.Tooltip.css",
    "src/shared/css/ch.Bubble.css",
    "src/shared/css/ch.Modal.css",
    "src/shared/css/ch.Transition.css",
    "src/mobile/css/ch.AutoComplete.css",
    "src/shared/css/ch.Dropdown.css",
    "src/shared/css/ch.Calendar.css"
];

CSS.compatible = [
    "src/mobile/css/ch.compatible.css"
];

/*
 * Expose both objects
 */
exports.JS = JS;
exports.CSS = CSS;
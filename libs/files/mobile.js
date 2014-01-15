/*
 * Files routes objects
 */
var JS = {},
	CSS = {};

/*
 * JS: Core
 */
JS.core = [
    "src/shared/js/helpers.js",
    "src/shared/js/util.js",
    "src/mobile/js/util.js",
    "src/shared/js/support.js",
    "src/shared/js/events.js",
    "src/shared/js/factory.js",
    "src/mobile/js/init.js"
];

/*
 * JS: Abilities
 */
JS.abilities = [
    "src/shared/js/EventEmitter.js",
    "src/shared/js/Content.js",
    "src/shared/js/Collapsible.js",
    "src/shared/js/Viewport.js",
    "src/shared/js/Positioner.js"
];

/*
 * JS: Components
 */
JS.components = [
    "src/shared/js/Component.js",
    "src/shared/js/Expandable.js",
    "src/shared/js/Menu.js",
    "src/shared/js/Popover.js",
    // "src/shared/js/Layer.js",
    // "src/shared/js/Tooltip.js",
    // "src/shared/js/Bubble.js",
    // "src/shared/js/Modal.js",
    // "src/shared/js/Transition.js",
    // "src/shared/js/Dropdown.js",
    "src/shared/js/Form.js",
    "src/shared/js/Condition.js",
    "src/shared/js/Validation.js",
    "src/mobile/js/Validation.js",
    "src/shared/js/String.js",
    "src/shared/js/MaxLength.js",
    "src/shared/js/MinLength.js",
    "src/shared/js/Email.js",
    "src/shared/js/URL.js",
    "src/shared/js/Number.js",
    "src/shared/js/Min.js",
    "src/shared/js/Max.js",
    "src/shared/js/Custom.js",
    "src/shared/js/Required.js",
    "src/shared/js/Countdown.js",
    "src/shared/js/Carousel.js",
    // "src/shared/js/Calendar.js",
    "src/shared/js/Autocomplete.js"
];


/*
 * CSS routes
 */

/*
 * CSS: Reset
 */
CSS.resetML = [
    "src/shared/css/reset.css",
    "src/mobile/css/reset.css",
    "src/shared/css/typography.css"
];

/*
 * CSS: Core
 */
CSS.core = [
    "src/shared/css/base.css",
    "src/mobile/css/base.css",
    "src/shared/css/icons.css",
    "src/shared/css/boxes.css",
    "src/mobile/css/boxes.css",
    "src/shared/css/loading.css",
    "src/mobile/css/loading.css"
];

/*
 * CSS: Components
 */
CSS.components = [
    "src/shared/css/buttons.css",
    "src/mobile/css/buttons.css",
    "src/shared/css/datagrid.css",
    "src/shared/css/lists.css",
    "src/shared/css/pagination.css",
    "src/mobile/css/pagination.css",
    // "src/mobile/css/list-options.css",
    "src/mobile/css/tags.css",
    "src/mobile/css/header.css",
    "src/mobile/css/Expandable.css",
    "src/mobile/css/Menu.css",
    "src/shared/css/Form.css",
    "src/mobile/css/Form.css",
    "src/shared/css/Popover.css",
    // "src/shared/css/Tooltip.css",
    // "src/shared/css/Bubble.css",
    // "src/shared/css/Modal.css",
    // "src/shared/css/Transition.css",
    // "src/shared/css/Dropdown.css",
    "src/shared/css/Carousel.css",
    // "src/shared/css/Calendar.css",
    "src/shared/css/Autocomplete.css",
    "src/mobile/css/Autocomplete.css"

];

CSS.compatible = [
    "src/mobile/css/compatible.css"
];

/*
 * Expose both objects
 */
exports.JS = JS;
exports.CSS = CSS;
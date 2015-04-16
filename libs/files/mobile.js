/*
 * Files routes objects
 */
var JS = {},
	CSS = {};

/*
 * JS: Core
 */
JS.core = [
    "src/shared/scripts/helpers.js",
    "src/shared/scripts/util.js",
    "src/mobile/scripts/util.js",
    "src/shared/scripts/support.js",
    "src/shared/scripts/events.js",
    "src/shared/scripts/factory.js",
    "src/mobile/scripts/init.js"
];

/*
 * JS: Abilities
 */
JS.abilities = [
    "src/shared/scripts/EventEmitter.js",
    "src/shared/scripts/Content.js",
    "src/shared/scripts/Collapsible.js",
    "src/shared/scripts/Viewport.js",
    "src/shared/scripts/Positioner.js"
];

/*
 * JS: Components
 */
JS.components = [
    "src/shared/scripts/Component.js",
    "src/shared/scripts/Expandable.js",
    "src/shared/scripts/Menu.js",
    "src/shared/scripts/Popover.js",
    // "src/shared/scripts/Layer.js",
    // "src/shared/scripts/Tooltip.js",
    // "src/shared/scripts/Bubble.js",
    "src/shared/scripts/Modal.js",
    "src/shared/scripts/Transition.js",
    // "src/shared/scripts/Dropdown.js",
    "src/shared/scripts/Form.js",
    "src/shared/scripts/Condition.js",
    "src/shared/scripts/Validation.js",
    "src/mobile/scripts/Validation.js",
    "src/shared/scripts/String.js",
    "src/shared/scripts/MaxLength.js",
    "src/shared/scripts/MinLength.js",
    "src/shared/scripts/Email.js",
    "src/shared/scripts/URL.js",
    "src/shared/scripts/Number.js",
    "src/shared/scripts/Min.js",
    "src/shared/scripts/Max.js",
    "src/shared/scripts/Custom.js",
    "src/shared/scripts/Required.js",
    "src/shared/scripts/Countdown.js",
    "src/shared/scripts/Carousel.js",
    // "src/shared/scripts/Calendar.js",
    "src/shared/scripts/Autocomplete.js"
];


/*
 * CSS routes
 */

/*
 * CSS: Reset
 */
CSS.resetML = [
    "src/shared/styles/reset.css",
    "src/mobile/styles/reset.css",
    "src/shared/styles/typography.css",
    "src/mobile/styles/typography.css"
];

/*
 * CSS: Core
 */
CSS.core = [
    "src/shared/styles/base.css",
    "src/mobile/styles/base.css",
    "src/shared/styles/icons.css",
    "src/shared/styles/boxes.css",
    "src/mobile/styles/boxes.css",
    "src/shared/styles/loading.css",
    "src/mobile/styles/loading.css"
];

/*
 * CSS: Components
 */
CSS.components = [
    "src/shared/styles/buttons.css",
    "src/mobile/styles/buttons.css",
    "src/shared/styles/datagrid.css",
    "src/shared/styles/lists.css",
    "src/shared/styles/pagination.css",
    "src/mobile/styles/pagination.css",
    // "src/mobile/styles/list-options.css",
    "src/mobile/styles/tags.css",
    "src/mobile/styles/header.css",
    "src/mobile/styles/Expandable.css",
    "src/mobile/styles/Menu.css",
    "src/shared/styles/Form.css",
    "src/mobile/styles/Form.css",
    "src/shared/styles/Popover.css",
    // "src/shared/styles/Tooltip.css",
    // "src/shared/styles/Bubble.css",
    "src/shared/styles/Modal.css",
    "src/mobile/styles/Modal.css",
    "src/shared/styles/Transition.css",
    // "src/shared/styles/Dropdown.css",
    "src/shared/styles/Carousel.css",
    // "src/shared/styles/Calendar.css",
    "src/shared/styles/Autocomplete.css",
    "src/mobile/styles/Autocomplete.css"

];

CSS.compatible = [
    "src/mobile/styles/compatible.css"
];

/*
 * Expose both objects
 */
exports.JS = JS;
exports.CSS = CSS;
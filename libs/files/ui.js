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
    "src/shared/scripts/support.js",
    "src/shared/scripts/events.js",
    "src/ui/scripts/events.js",
    "src/shared/scripts/factory.js",
    "src/ui/scripts/init.js"
];

/*
 * JS: Abilities
 */
JS.abilities = [
    "src/shared/scripts/EventEmitter.js",
    "src/shared/scripts/Content.js",
    "src/shared/scripts/Collapsible.js",
    "src/shared/scripts/Viewport.js",
    "src/shared/scripts/Positioner.js",
    "src/ui/scripts/shortcuts.js"
];

/*
 * JS: Components
 */
JS.components = [
    "src/shared/scripts/onImagesLoads.js",
    "src/shared/scripts/Component.js",
    "src/shared/scripts/Form.js",
    "src/shared/scripts/Condition.js",
    "src/shared/scripts/Validation.js",
    "src/ui/scripts/Validation.js",
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
    "src/shared/scripts/Expandable.js",
    "src/shared/scripts/Menu.js",
    "src/shared/scripts/Popover.js",
    "src/ui/scripts/Popover.js",
    "src/shared/scripts/Layer.js",
    "src/shared/scripts/Tooltip.js",
    "src/shared/scripts/Bubble.js",
    "src/shared/scripts/Modal.js",
    "src/shared/scripts/Transition.js",
    "src/ui/scripts/Zoom.js",
    "src/shared/scripts/Calendar.js",
    "src/shared/scripts/Dropdown.js",
    "src/ui/scripts/Dropdown.js",
    "src/ui/scripts/Tabs.js",
    "src/shared/scripts/Carousel.js",
    "src/shared/scripts/Countdown.js",
    "src/ui/scripts/Datepicker.js",
    "src/shared/scripts/Autocomplete.js",
    "src/ui/scripts/Autocomplete.js"
];


/*
 * CSS routes
 */

/*
 * CSS: Reset
 */
CSS.resetML = [
    "src/shared/styles/reset.css",
    "src/ui/styles/reset.css",
    "src/shared/styles/typography.css"
];

/*
 * CSS: Core
 */
CSS.core = [
    "src/shared/styles/base.css",
    "src/ui/styles/base.css",
    "src/shared/styles/icons.css",
    "src/ui/styles/badges.css",
    "src/shared/styles/boxes.css",
    "src/ui/styles/boxes.css",
    "src/shared/styles/loading.css"
];

/*
 * CSS: Components
 */
CSS.components = [
    "src/shared/styles/buttons.css",
    "src/ui/styles/buttons.css",
    "src/shared/styles/datagrid.css",
    "src/shared/styles/lists.css",
    "src/shared/styles/pagination.css",
    "src/ui/styles/pagination.css",
    "src/shared/styles/Form.css",
    "src/ui/styles/Form.css",
    "src/shared/styles/Popover.css",
    "src/shared/styles/Tooltip.css",
    "src/shared/styles/Bubble.css",
    "src/shared/styles/Modal.css",
    "src/shared/styles/Transition.css",
    "src/ui/styles/Zoom.css",
    "src/ui/styles/wizard.css",
    "src/shared/styles/Calendar.css",
    "src/shared/styles/Carousel.css",
    "src/shared/styles/Dropdown.css",
    "src/ui/styles/Expandable.css",
    "src/ui/styles/Menu.css",
    "src/ui/styles/Tabs.css",
    "src/ui/styles/Datepicker.css",
    "src/shared/styles/Autocomplete.css",
    "src/ui/styles/Autocomplete.css"
];

/*
 * Expose both objects
 */
exports.JS = JS;
exports.CSS = CSS;
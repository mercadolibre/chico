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
    "src/shared/js/support.js",
    "src/shared/js/events.js",
    "src/ui/js/events.js",
    "src/shared/js/factory.js",
    "src/ui/js/init.js"
];

/*
 * JS: Abilities
 */
JS.abilities = [
    "src/shared/js/EventEmitter.js",
    "src/shared/js/Content.js",
    "src/shared/js/Collapsible.js",
    "src/shared/js/Viewport.js",
    "src/shared/js/Positioner.js",
    "src/ui/js/shortcuts.js"
];

/*
 * JS: Components
 */
JS.components = [
    "src/shared/js/onImagesLoads.js",
    "src/shared/js/Component.js",
    "src/shared/js/Form.js",
    "src/shared/js/Condition.js",
    "src/shared/js/Validation.js",
    "src/ui/js/Validation.js",
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
    "src/shared/js/Expandable.js",
    "src/shared/js/Menu.js",
    "src/shared/js/Popover.js",
    "src/ui/js/Popover.js",
    "src/shared/js/Layer.js",
    "src/shared/js/Tooltip.js",
    "src/shared/js/Bubble.js",
    "src/shared/js/Modal.js",
    "src/shared/js/Transition.js",
    "src/ui/js/Zoom.js",
    "src/shared/js/Calendar.js",
    "src/shared/js/Dropdown.js",
    "src/ui/js/Dropdown.js",
    "src/ui/js/Tabs.js",
    "src/shared/js/Carousel.js",
    "src/shared/js/Countdown.js",
    "src/ui/js/Datepicker.js",
    "src/shared/js/Autocomplete.js",
    "src/ui/js/Autocomplete.js"
];


/*
 * CSS routes
 */

/*
 * CSS: Reset
 */
CSS.resetML = [
    "src/shared/css/reset.css",
    "src/ui/css/reset.css",
    "src/shared/css/typography.css",
    "src/shared/css/mp/typography.css"
];

/*
 * CSS: Core
 */
CSS.core = [
    "src/shared/css/base.css",
    "src/ui/css/base.css",
    "src/shared/css/icons.css",
    "src/ui/css/badges.css",
    "src/shared/css/boxes.css",
    "src/ui/css/boxes.css",
    "src/shared/css/loading.css"
];

/*
 * CSS: Components
 */
CSS.components = [
    "src/shared/css/buttons.css",
    "src/shared/css/mp/buttons.css",
    "src/ui/css/buttons.css",
    "src/shared/css/datagrid.css",
    "src/shared/css/lists.css",
    "src/shared/css/pagination.css",
    "src/ui/css/pagination.css",
    "src/shared/css/Form.css",
    "src/ui/css/Form.css",
    "src/shared/css/Popover.css",
    "src/shared/css/Tooltip.css",
    "src/shared/css/Bubble.css",
    "src/shared/css/Modal.css",
    "src/shared/css/Transition.css",
    "src/ui/css/Zoom.css",
    "src/ui/css/wizard.css",
    "src/shared/css/Calendar.css",
    "src/shared/css/Carousel.css",
    "src/shared/css/Dropdown.css",
    "src/shared/css/mp/Dropdown.css",
    "src/ui/css/Expandable.css",
    "src/ui/css/Menu.css",
    "src/ui/css/Tabs.css",
    "src/ui/css/Datepicker.css",
    "src/shared/css/Autocomplete.css",
    "src/ui/css/Autocomplete.css"
];

/*
 * Expose both objects
 */
exports.JS = JS;
exports.CSS = CSS;
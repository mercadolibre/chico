(function ($, ch) {
    'use strict';

    /**
     * Add a function to manage components content.
     * @memberOf ch
     * @mixin
     * @returns {Function}
     */
    function Content() {

        /**
         * Reference to context of an instance.
         * @type {Object}
         * @private
         */
        var that = this,
            defaults = {
                'method': this._options.method,
                'params': this._options.params,
                'cache': this._options.cache,
                'async': this._options.async,
                'waiting': this._options.waiting
            };

        /**
         * Set async content into component's container and emits the current event.
         * @private
         */
        function setAsyncContent(event) {

            that._$content.html(event.response);

            /**
             * Event emitted when the content change.
             * @event ch.Content#contentchange
             * @private
             */
            that.emit('_contentchange');

            /**
             * Event emitted if the content is loaded successfully.
             * @event ch.Content#contentdone
             * @ignore
             */

            /**
             * Event emitted when the content is loading.
             * @event ch.Content#contentwaiting
             * @example
             * // Subscribe to "contentwaiting" event.
             * component.on('contentwaiting', function (event) {
             *     // Some code here!
             * });
             */

            /**
             * Event emitted if the content isn't loaded successfully.
             * @event ch.Content#contenterror
             * @example
             * // Subscribe to "contenterror" event.
             * component.on('contenterror', function (event) {
             *     // Some code here!
             * });
             */

            that.emit('content' + event.status, event);
        }

        /**
         * Set content into component's container and emits the contentdone event.
         * @private
         */
        function setContent(content) {

            that._$content.html(content);

            that._options.cache = true;

            /**
             * Event emitted when the content change.
             * @event ch.Content#contentchange
             * @private
             */
            that.emit('_contentchange');

            /**
             * Event emitted if the content is loaded successfully.
             * @event ch.Content#contentdone
             * @example
             * // Subscribe to "contentdone" event.
             * component.on('contentdone', function (event) {
             *     // Some code here!
             * });
             */
            that.emit('contentdone');
        }

        /**
         * Get async content with given URL.
         * @private
         */
        function getAsyncContent(url, options) {
            // Initial options to be merged with the user's options
            options = $.extend({
                'method': 'GET',
                'params': '',
                'async': true,
                'waiting': '<div class="ch-loading-large"></div>'
            }, options || defaults);

            if (options.cache !== undefined) {
                that._options.cache = options.cache;
            }

            // Set loading
            setAsyncContent({
                'status': 'waiting',
                'response': options.waiting
            });

            // Make async request
            $.ajax({
                'url': url,
                'type': options.method,
                'data': 'x=x' + ((options.params !== '') ? '&' + options.params : ''),
                'cache': that._options.cache,
                'async': options.async,
                'beforeSend': function (jqXHR) {
                    // Set the AJAX default HTTP headers
                    jqXHR.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
                },
                'success': function (data) {
                    // Send the result data to the client
                    setAsyncContent({
                        'status': 'done',
                        'response': data
                    });
                },
                'error': function (jqXHR, textStatus, errorThrown) {
                    // Send a defined error message
                    setAsyncContent({
                        'status': 'error',
                        'response': '<p>Error on ajax call.</p>',

                         // Grab all the parameters into a JSON to send to the client
                        'data': {
                            'jqXHR': jqXHR,
                            'textStatus': textStatus,
                            'errorThrown': errorThrown
                        }
                    });
                }
            });
        }

        /**
         * Allows to manage the components content.
         * @function
         * @memberof! ch.Content#
         * @param {(String | jQuerySelector | ZeptoSelector)} content The content that will be used by a component.
         * @param {Object} [options] A custom options to be used with content loaded by ajax.
         * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
         * @param {String} [options.params] Params like query string to be sent to the server.
         * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true.
         * @param {Boolean} [options.async] Force to sent request asynchronously. Default: true.
         * @param {(String | jQuerySelector | ZeptoSelector)} [options.waiting] Temporary content to use while the ajax request is loading.
         * @example
         * // Update content with some string.
         * component.content('Some new content here!');
         * @example
         * // Update content that will be loaded by ajax with custom options.
         * component.content('http://chico-ui.com.ar/ajax', {
         *     'cache': false,
         *     'params': 'x-request=true'
         * });
         */
        this.content = function (content, options) {

            // Returns the last updated content.
            if (content === undefined) {
                return that._$content.html();
            }

            that._options.content = content;

            if (that._options.cache === undefined) {
                that._options.cache = true;
            }

            if (typeof content === 'string') {
                // Case 1: AJAX call
                if (ch.util.isUrl(content)) {
                    getAsyncContent(content, options);
                // Case 2: Plain text
                } else {
                    setContent(content);
                }
            // Case 3: jQuery/Zepto/HTML Element
            } else if (ch.util.is$(content) || content.nodeType !== undefined) {
                setContent($(content).remove(null, true).removeClass('ch-hide'));
            }

            return that;
        };

        // Loads content once. If the cache is disabled the content loads in each show.
        this.once('_show', function () {

            that.content(that._options.content);

            that.on('show', function () {
                if (!that._options.cache) {
                    that.content(that._options.content);
                }
            });
        });
    }

    ch.Content = Content;

}(this.ch.$, this.ch));
(function ($, ch) {
    'use strict';

    /**
     * Creates a component to manage content through 3 ways: plain text, DOM elements, AJAX requests.
     * @memberOf ch
     * @class ch.Content
     * @require ch.cache
     * @returns {Object}
     */
    function Content() {

        var that = this,
            defaults = {
                'method': this._options.method,
                'params': this._options.params,
                'cache': this._options.cache,
                'async': this._options.async,
                'waiting': this._options.waiting
            };

        /**
         * Allows to manage the widgets content.
         * @namespace
         */
        function content(content, options) {

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
                    that._$content.html(content);

                    that._options.cache = true;

                    that.emit('_contentchange');
                    that.emit('contentdone');

                }
            // Case 3: DOM element
            } else if (ch.util.is$(content)) {

                that._$content.html(content.remove(null, true).removeClass('ch-hide'));

                that._options.cache = true;

                that.emit('_contentchange');
                that.emit('contentdone');

            }

            return that;
        }

        that.content = content;

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
                'waiting': '<div class="ch-loading-big"></div>'
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
         * Set async content into widget's container and emits the current event.
         * @private
         */
        function setAsyncContent(event) {

            var status = 'content' + event.status;

            that._$content.html(event.response);

            that.emit('_contentchange');

            that.emit(status, event);
        }

        /**
         * Loads content once. If the cache is disabled the content loads in each show.
         * @private
         */
        function showContent() {
            that.content(that._options.content);

            that.on('show', function () {
                if (!that._options.cache) {
                    that.content(that._options.content);
                }
            });
        }

        that.once('show', showContent);
    }

    ch.Content = Content;

}(this.ch.$, this.ch));
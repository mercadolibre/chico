(function (ch) {
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
                'waiting': this._options.waiting
            };

        /**
         * Set async content into component's container and emits the current event.
         * @private
         */
        function setAsyncContent(event) {

            that._content.innerHTML = event.response;

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

            if (content.nodeType !== undefined) {
                that._content.innerHTML = '';
                that._content.appendChild(content);
            } else {
                that._content.innerHTML = content;
            }


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
            var requestCfg;
            // Initial options to be merged with the user's options
            options = tiny.extend({
                'method': 'GET',
                'params': '',
                'waiting': '<div class="ch-loading-large"></div>'
            }, defaults, options);

            // Set loading
            setAsyncContent({
                'status': 'waiting',
                'response': options.waiting
            });

            requestCfg = {
                method: options.method,
                success: function(resp) {
                    setAsyncContent({
                        'status': 'done',
                        'response': resp
                    });
                },
                error: function(err) {
                    setAsyncContent({
                        'status': 'error',
                        'response': '<p>Error on ajax call.</p>',
                        'data': err.message || JSON.stringify(err)
                    });
                }
            };

            if (options.cache !== undefined) {
                that._options.cache = options.cache;
            }

            if (options.cache === false && ['GET', 'HEAD'].indexOf(options.method.toUpperCase()) !== -1) {
                requestCfg.cache = false;
            }

            if (options.params) {
                if (['GET', 'HEAD'].indexOf(options.method.toUpperCase()) !== -1) {
                    url += (url.indexOf('?') !== -1 || options.params[0] === '?' ? '' : '?') + options.params;
                } else {
                    requestCfg.data = options.params;
                }
            }

            // Make a request
            tiny.ajax(url, requestCfg);
        }

        /**
         * Allows to manage the components content.
         * @function
         * @memberof! ch.Content#
         * @param {(String | HTMLElement)} content The content that will be used by a component.
         * @param {Object} [options] A custom options to be used with content loaded by ajax.
         * @param {String} [options.method] The type of request ("POST" or "GET") to load content by ajax. Default: "GET".
         * @param {String} [options.params] Params like query string to be sent to the server.
         * @param {Boolean} [options.cache] Force to cache the request by the browser. Default: true. false value will work only with HEAD and GET requests
         * @param {(String | HTMLElement)} [options.waiting] Temporary content to use while the ajax request is loading.
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
            var parent;

            // Returns the last updated content.
            if (content === undefined) {
                return that._content.innerHTML;
            }

            that._options.content = content;

            if (that._options.cache === undefined) {
                that._options.cache = true;
            }

            if (typeof content === 'string') {
                // Case 1: AJAX call
                if ((/^(((https|http|ftp|file):\/\/)|www\.|\.\/|(\.\.\/)+|(\/{1,2})|(\d{1,3}\.){3}\d{1,3})(((\w+|-)(\.?)(\/?))+)(\:\d{1,5}){0,1}(((\w+|-)(\.?)(\/?)(#?))+)((\?)(\w+=(\w?)+(&?))+)?(\w+#\w+)?$/).test(content)) {
                    getAsyncContent(content.replace(/#.+/, ''), options);
                // Case 2: Plain text
                } else {
                    setContent(content);
                }
            // Case 3: HTML Element
            } else if (content.nodeType !== undefined) {

                tiny.removeClass(content, 'ch-hide');
                parent = tiny.parent(content);

                setContent(content);

                if (!that._options.cache) {
                    parent.removeChild(content);
                }

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

}(this.ch));

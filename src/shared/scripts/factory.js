    /**
     * Method in change of expose a friendly interface of the Chico constructors.
     *
     * @memberof ch
     * @param {Object} Klass Direct reference to the constructor from where the $-plugin will be created.
     * @link http://docs.jquery.com/Plugins/Authoring | Authoring
     */
    ch.factory = function (Klass) {
        /**
         * Identification of the constructor, in lowercases.
         * @type {String}
         */
        var name = Klass.prototype.name;

        // Uses the function.name property (non-standard) on the newest browsers OR
        // uppercases the first letter from the identification name of the constructor
        ch[(name.charAt(0).toUpperCase() + name.substr(1))] = Klass;
    };

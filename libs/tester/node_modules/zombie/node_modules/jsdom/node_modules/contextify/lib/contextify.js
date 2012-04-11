try {
    module.exports = require('../build/Release/contextify').wrap;
} catch (e) {
    console.log("Internal Contextify ERROR: Make sure Contextify is built " +
                "with your current Node version.\nTo rebuild, go to the " +
                "Contextify root folder and run 'node-waf distclean && " +
                "node-waf configure build'.");
    throw e;
}

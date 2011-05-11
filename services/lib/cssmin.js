/*
 node-cssmin - a simple css minifier
*/

exports.cssmin = cssmin;

function cssmin(data, linebreak) {

    if(linebreak == null){
        linebreak = 0;
    }

    var input = String(data);

    /*
     * Normalize whitespace by removing \t, \n, ... 
     */
    var output = input.replace(/\s+/g, " ");

    /**
     * Remove comments from source
     * Comments starting with ! are preserved 
     */
    output = output.replace(/\/\*[^!](.*?)\*\//g, "");

    /**
     * Remove extra whitespace on blocks
     */
    output = output.replace(/([!{}:;>+\(\[,])\s+/g, "$1");

    /**
     * Restore certain space for @webkit that would fail
     * 
     */
    output = output.replace(/(@media[^{]*[^\s])\(/, "$1 (");

    /**
     * Remove unnecessary 0px, 0em,... Turning them into 0
     */
    output = output.replace(/([\s:])(0)(px|em|%|in|cm|mm|pc|pt|ex)/g, "$1$2");

    /** 
     * Combine multiple 0 into one
     */
    output = output.replace(/:0 0 0 0(;|})/, ":0$1");
    output = output.replace(/:0 0 0(;|})/, ":0$1");
    output = output.replace(/:0 0(;|})/, ":0$1");
    /* Restore background-position:0; with background-position:0 0; */
    output =output.replace(/background-position:0(;|})/, "background-position:0 0$1");

    /**
     * Remove multiple semi-colon in a row
     */
    output = output.replace(/;;+/g,";")

    /**
     * Remove the final semi-colon of block
     */
    output = output.replace(/;(})/g, "}");

    /**
     * Remove empty rules
     */
    output = output.replace(/[^}{;]+{}/, "");

    /**
     * Removing first white if exist
     */
    output = output.replace(/^ /, "");

    /**
     * Removing last white space if exist
     */
    output = output.replace(/ /, "");

    /**
     * Linebreak is an option that generate one block per line.
     * Could be useful for debug.
     */
    if(linebreak == 1){
        // Option for debug, that adds a linebreak after each rule
        output = output.replace(/(\*\/|})( ?)/g, "$1\n");
    }

    return output;
}
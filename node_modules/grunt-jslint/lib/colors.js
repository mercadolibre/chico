/*jslint node:true*/

'use strict';

/**
 * Add a color getter to the String prototype
 *
 * @param {Stirng} color The color's name: red, blue, etc.
 * @param {Array}  style The color styles; may not be octal
 */
function addColor(color, style) {
  Object.defineProperty(String.prototype, color, {
    get: function () {
      return style[0] + this + style[1];
    }
  });
}

addColor('black', ['\x1B[30m', '\x1B[39m']);
addColor('blue', ['\x1B[34m', '\x1B[39m']);
addColor('cyan', ['\x1B[36m', '\x1B[39m']);
addColor('green', ['\x1B[32m', '\x1B[39m']);
addColor('grey', ['\x1B[90m', '\x1B[39m']);
addColor('magenta', ['\x1B[35m', '\x1B[39m']);
addColor('red', ['\x1B[31m', '\x1B[39m']);
addColor('white', ['\x1B[37m', '\x1B[39m']);
addColor('yellow', ['\x1B[33m', '\x1B[39m']);


var _Promise
try {
  _Promise = require('bluebird')
} catch (_) {
  _Promise = global.Promise
}

if (!_Promise) {
  console.error('Neither `bluebird` nor the native `Promise` functions were found.')
  console.error('Please install `bluebird` yourself.')
  process.exit(1)
}

module.exports = _Promise

'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.xattr = exports.fs = exports.rimrafAsync = exports.mkdirpAsync = undefined;

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _fsXattr = require('fs-xattr');

var _fsXattr2 = _interopRequireDefault(_fsXattr);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_bluebird2.default.promisifyAll(_fs2.default);
_bluebird2.default.promisifyAll(_fsXattr2.default);

var mkdirpAsync = exports.mkdirpAsync = _bluebird2.default.promisify(_mkdirp2.default);
var rimrafAsync = exports.rimrafAsync = _bluebird2.default.promisify(_rimraf2.default);

exports.fs = _fs2.default;
exports.xattr = _fsXattr2.default;
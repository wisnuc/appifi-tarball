'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createDocumentStore = undefined;

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _crypto = require('crypto');

var _crypto2 = _interopRequireDefault(_crypto);

var _rimraf = require('rimraf');

var _rimraf2 = _interopRequireDefault(_rimraf);

var _mkdirp = require('mkdirp');

var _mkdirp2 = _interopRequireDefault(_mkdirp);

var _canonicalJson = require('canonical-json');

var _canonicalJson2 = _interopRequireDefault(_canonicalJson);

var _util = require('./util');

var _paths = require('./paths');

var _paths2 = _interopRequireDefault(_paths);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DocumentStore = function () {

  // the factory must assure the tmp folder exists !
  function DocumentStore(dir, tmpdir) {
    (0, _classCallCheck3.default)(this, DocumentStore);

    this.rootdir = dir;
    this.tmpdir = tmpdir;
  }

  (0, _createClass3.default)(DocumentStore, [{
    key: 'store',
    value: function store(object, callback) {

      var text = void 0,
          hash = void 0,
          digest = void 0,
          dirpath = void 0,
          filepath = void 0,
          tmppath = void 0;

      // text = JSON.stringify(object)
      try {
        text = (0, _canonicalJson2.default)(object);
      } catch (e) {
        return callback(e);
      }

      hash = _crypto2.default.createHash('sha256');
      hash.update(text);
      digest = hash.digest().toString('hex');

      // src is in tmp folder
      dirpath = _path2.default.join(this.rootdir, digest.slice(0, 2));
      filepath = _path2.default.join(dirpath, digest.slice(2));
      tmppath = _path2.default.join(this.tmpdir, digest);

      (0, _mkdirp2.default)(dirpath, function (err) {
        // create head dir
        if (err) return callback(err);
        (0, _util.writeFileToDisk)(tmppath, text, function (err) {
          // stream to file
          if (err) return callback(err);
          _fs2.default.rename(tmppath, filepath, function (err) {
            if (err) return callback(err);
            callback(null, digest);
          });
        });
      });
    }
  }, {
    key: 'retrieve',
    value: function retrieve(digest, callback) {
      var filepath = void 0;

      if (/[0-9a-f]{64}/.test(digest) === false) {
        var error = new Error('digest invalid');
        error.code = 'EINVAL';
        return process.nextTick(callback, error);
      }

      filepath = _path2.default.join(this.rootdir, digest.slice(0, 2), digest.slice(2));

      _fs2.default.readFile(filepath, function (err, data) {

        if (err) return callback(err);
        try {
          callback(null, JSON.parse(data.toString()));
        } catch (e) {
          callback(e);
        }
      });
    }
  }]);
  return DocumentStore;
}();

var createDocumentStore = function createDocumentStore(callback) {

  var dir = _paths2.default.get('documents');
  var tmpdir = _paths2.default.get('tmp');

  _fs2.default.stat(dir, function (err, stats) {

    if (err) return callback(err);
    if (!stats.isDirectory()) return callback(new Error('path must be folder'));

    // no clean
    return callback(null, new DocumentStore(dir, tmpdir));
  });
};

exports.createDocumentStore = createDocumentStore;
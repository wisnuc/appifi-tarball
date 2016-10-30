'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createFruitmix = undefined;

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _bluebird = require('bluebird');

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _child_process = require('child_process');

var _child_process2 = _interopRequireDefault(_child_process);

var _http = require('http');

var _http2 = _interopRequireDefault(_http);

var _dgram = require('dgram');

var _dgram2 = _interopRequireDefault(_dgram);

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _debug = require('debug');

var _debug2 = _interopRequireDefault(_debug);

var _reducers = require('../appifi/lib/reducers');

var _system = require('./lib/system');

var _system2 = _interopRequireDefault(_system);

var _models = require('./models/models');

var _models2 = _interopRequireDefault(_models);

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

var _samba = require('./lib/samba');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var debug = (0, _debug2.default)('fruitmix:fruitmix');

(0, _bluebird.promisifyAll)(_child_process2.default);

var startSamba = function () {
  var _ref = (0, _bluebird.method)(function () {
    _child_process2.default.execAsync('systemctl start nmbd'), _child_process2.default.execAsync('systemctl start smbd');
  });

  return function startSamba() {
    return _ref.apply(this, arguments);
  };
}();

var Fruitmix = function (_EventEmitter) {
  (0, _inherits3.default)(Fruitmix, _EventEmitter);

  function Fruitmix(system, app, server, smbAudit) {
    (0, _classCallCheck3.default)(this, Fruitmix);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Fruitmix.__proto__ || (0, _getPrototypeOf2.default)(Fruitmix)).call(this));

    _this.system = system;
    _this.app = app;
    _this.server = server;
    _this.smbAudit = smbAudit;
    return _this;
  }

  return Fruitmix;
}(_events2.default);

var createFruitmix = function createFruitmix(sysroot) {

  var server = void 0,
      port = 3721;

  _system2.default.init(sysroot);

  _app2.default.set('port', port);

  server = _http2.default.createServer(_app2.default);
  server.timeout = 24 * 3600 * 1000; // 24 hours

  server.on('error', function (error) {

    if (error.syscall !== 'listen') {
      throw error;
    }

    // handle specific listen errors with friendly messages
    switch (error.code) {
      case 'EACCES':
        console.error('Port ' + port + ' requires elevated privileges');
        process.exit(1);
        break;
      case 'EADDRINUSE':
        console.error('Port ' + port + ' is already in use');
        process.exit(1);
        break;
      default:
        throw error;
    }
  });

  server.on('listening', function () {
    return console.log('[fruitmix] Http Server Listening on Port ' + port);
  });
  server.on('close', function () {
    return console.log('[fruitmix] Http Server Closed');
  });

  server.listen(port);

  var smbaudit = (0, _samba.createSmbAudit)(function (err) {
    console.log('smb audit created');
  });

  return new Fruitmix(_system2.default, _app2.default, server, smbaudit);
};

exports.createFruitmix = createFruitmix;
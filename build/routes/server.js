'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _server = require('../lib/server');

var _server2 = _interopRequireDefault(_server);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.get('/', function (req, res) {
  return res.status(200).json(_server2.default.get());
});
router.get('/status', function (req, res) {
  return res.status(200).json(_server2.default.status());
});
router.post('/', function (req, res) {
  return _server2.default.operation(req.body, function (err, result) {
    return err ? res.status(500).json(err) : res.status(200).json(result);
  });
});

module.exports = router;
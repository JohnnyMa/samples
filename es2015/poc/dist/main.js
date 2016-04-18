define(['exports', 'hello'], function (exports, _hello) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _hello2 = _interopRequireDefault(_hello);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var Main = function Main() {
        _classCallCheck(this, Main);

        var hello = new _hello2.default();
        hello.world();
    };

    exports.default = Main;
});
//# sourceMappingURL=main.js.map

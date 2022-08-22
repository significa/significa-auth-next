var ClientCookies = /** @class */ (function () {
    function ClientCookies(config) {
        var _this = this;
        // Auth related methods
        this.getAccessToken = function () {
            return _this.getCookie(_this.accessTokenKey);
        };
        this.getSessionIndicator = function () {
            return _this.getCookie(_this.sessionIndicatorKey);
        };
        this.clearAccessToken = function () {
            return _this.clearCookie(_this.accessTokenKey);
        };
        this.clearSessionIndicator = function () {
            return _this.clearCookie(_this.sessionIndicatorKey);
        };
        this.accessTokenKey = config.accessTokenKey;
        this.sessionIndicatorKey = config.sessionIndicatorKey;
    }
    ClientCookies.prototype.buildCookie = function (key, value, expires) {
        var cookie = "".concat(key, "=").concat(value);
        if (expires) {
            cookie += "; expires=".concat(new Date(Date.now() + expires).toUTCString());
        }
        return cookie;
    };
    ClientCookies.prototype.setCookie = function (key, value, expires) {
        if (typeof document !== 'undefined') {
            document.cookie = this.buildCookie(key, value, expires);
        }
    };
    ClientCookies.prototype.getCookie = function (key) {
        if (typeof document !== 'undefined') {
            for (var _i = 0, _a = document.cookie.split(';'); _i < _a.length; _i++) {
                var cookie = _a[_i];
                var _b = cookie.split('='), cookieKey = _b[0], value = _b[1];
                if (cookieKey.trim().toLowerCase() === key.trim().toLowerCase()) {
                    return value;
                }
            }
            return null;
        }
        return null;
    };
    ClientCookies.prototype.clearCookie = function (key) {
        this.setCookie(key, '', -1);
    };
    return ClientCookies;
}());
export { ClientCookies };

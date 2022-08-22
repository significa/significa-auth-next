"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServerAuth = void 0;
var PATHS = {
    login: '/login',
    refresh: '/refresh',
    logout: '/logout',
};
var ServerAuth = /** @class */ (function () {
    function ServerAuth(config) {
        var _this = this;
        /**
         * Builds the cookie string
         */
        this.buildCookie = function (key, value, config) {
            if (config === void 0) { config = {}; }
            return "".concat(key, "=").concat(value, "; Path=/; Secure").concat(config.expires
                ? "; Expires=".concat(new Date(Date.now() + config.expires).toUTCString(), ";")
                : '').concat(config.httpOnly ? '; HttpOnly' : '');
        };
        /**
         * Given a session payload, sets the cookies headers on the ServerResponse
         */
        this.setSessionCookies = function (res, _a) {
            var accessToken = _a.accessToken, expires = _a.expires, refreshToken = _a.refreshToken;
            res.setHeader('Set-Cookie', [
                _this.buildCookie(_this.accessTokenKey, accessToken, { expires: expires }),
                _this.buildCookie(_this.refreshTokenKey, refreshToken, {
                    httpOnly: true,
                }),
                _this.buildCookie(_this.sessionIndicatorKey, new Date(Date.now() + expires).toUTCString()),
            ]);
        };
        /**
         * Clears the cookies on the ServerResponse.
         */
        this.clearSessionCookies = function (res) {
            res.setHeader('Set-Cookie', [
                _this.buildCookie(_this.accessTokenKey, '', { expires: -1 }),
                _this.buildCookie(_this.refreshTokenKey, '', {
                    httpOnly: true,
                    expires: -1,
                }),
                _this.buildCookie(_this.sessionIndicatorKey, '', { expires: -1 }),
            ]);
            res.setHeader('Clear-Site-Data', ['cookies']);
        };
        this.startSession = function (res, email, password) { return __awaiter(_this, void 0, void 0, function () {
            var response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.handlers.login.fetch(email, password)];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error();
                        return [4 /*yield*/, this.handlers.login.parseResponse(response)];
                    case 2:
                        data = _a.sent();
                        if (!data.accessToken || !data.expires || !data.refreshToken) {
                            throw new Error();
                        }
                        // set cookies
                        this.setSessionCookies(res, data);
                        return [2 /*return*/];
                }
            });
        }); };
        /**
         * Uses the provided refresh token to get a new session.
         */
        this.refreshSession = function (res, refreshToken) { return __awaiter(_this, void 0, void 0, function () {
            var response, data;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.handlers.refresh.fetch(refreshToken)];
                    case 1:
                        response = _a.sent();
                        if (!response.ok)
                            throw new Error();
                        return [4 /*yield*/, this.handlers.refresh.parseResponse(response)];
                    case 2:
                        data = _a.sent();
                        if (!data.accessToken || !data.refreshToken || !data.expires) {
                            throw new Error();
                        }
                        this.setSessionCookies(res, data);
                        return [2 /*return*/, data];
                }
            });
        }); };
        this.accessTokenKey = config.accessTokenKey;
        this.refreshTokenKey = config.refreshTokenKey;
        this.sessionIndicatorKey = config.sessionIndicatorKey;
        this.handlers = config.handlers;
        this.handlersBasePath = this.handlers.basePath || '/api/auth';
        // context is important
        this.handler = this.handler.bind(this);
    }
    /**
     * This method is meant to be the default export of a dynamic Next's api route (e.g.: pages/api/auth/[path].ts)
     * It will handle the login, refresh and logout requests.
     */
    ServerAuth.prototype.handler = function (req, res) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, _b, email, password, data, error_1, refreshToken, data, error_2, refreshToken, response, error_3;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        _a = req.url;
                        switch (_a) {
                            case "".concat(this.handlersBasePath).concat(PATHS.login): return [3 /*break*/, 1];
                            case "".concat(this.handlersBasePath).concat(PATHS.refresh): return [3 /*break*/, 5];
                            case "".concat(this.handlersBasePath).concat(PATHS.logout): return [3 /*break*/, 9];
                        }
                        return [3 /*break*/, 13];
                    case 1:
                        _b = req.body, email = _b.email, password = _b.password;
                        if (req.method !== 'POST' || !email || !password) {
                            res.status(400).json({ message: 'Wrong payload' });
                            return [2 /*return*/];
                        }
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 4, , 5]);
                        return [4 /*yield*/, this.startSession(res, email, password)];
                    case 3:
                        data = _c.sent();
                        return [2 /*return*/, res.status(200).json(data)];
                    case 4:
                        error_1 = _c.sent();
                        return [2 /*return*/, res.status(401).json({ message: 'Not authorized' })];
                    case 5:
                        if (req.method !== 'GET') {
                            res.status(400).json({ message: 'Invalid request' });
                            return [2 /*return*/];
                        }
                        _c.label = 6;
                    case 6:
                        _c.trys.push([6, 8, , 9]);
                        refreshToken = req.cookies[this.refreshTokenKey];
                        if (!refreshToken) {
                            this.clearSessionCookies(res);
                            throw new Error();
                        }
                        return [4 /*yield*/, this.refreshSession(res, refreshToken)];
                    case 7:
                        data = _c.sent();
                        return [2 /*return*/, res.status(200).json(data)];
                    case 8:
                        error_2 = _c.sent();
                        this.clearSessionCookies(res);
                        return [2 /*return*/, res.status(401).json({ message: 'Not authorized' })];
                    case 9:
                        if (req.method !== 'GET') {
                            res.status(400).json({ message: 'Invalid request' });
                            return [2 /*return*/];
                        }
                        _c.label = 10;
                    case 10:
                        _c.trys.push([10, 12, , 13]);
                        refreshToken = req.cookies[this.refreshTokenKey];
                        if (!refreshToken) {
                            this.clearSessionCookies(res);
                            throw new Error();
                        }
                        return [4 /*yield*/, this.handlers.logout.fetch(refreshToken)
                            // Failed to refresh
                        ];
                    case 11:
                        response = _c.sent();
                        // Failed to refresh
                        if (!response.ok)
                            throw new Error();
                        this.clearSessionCookies(res);
                        return [2 /*return*/, res.status(200).json({ message: 'OK' })];
                    case 12:
                        error_3 = _c.sent();
                        this.clearSessionCookies(res);
                        return [2 /*return*/, res.status(401).json({ message: 'Not authorized' })];
                    case 13: return [2 /*return*/, res.status(404).json({ message: 'Not found' })];
                }
            });
        });
    };
    Object.defineProperty(ServerAuth.prototype, "paths", {
        get: function () {
            return {
                login: "".concat(this.handlersBasePath).concat(PATHS.login),
                refresh: "".concat(this.handlersBasePath).concat(PATHS.refresh),
                logout: "".concat(this.handlersBasePath).concat(PATHS.logout),
            };
        },
        enumerable: false,
        configurable: true
    });
    return ServerAuth;
}());
exports.ServerAuth = ServerAuth;

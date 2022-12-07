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
var PagesRestrictions = /** @class */ (function () {
    function PagesRestrictions(config) {
        var _this = this;
        this.checkSession = function (context) { return __awaiter(_this, void 0, void 0, function () {
            var accessToken, refreshToken, error_1;
            var _a, _b, _c, _d;
            return __generator(this, function (_e) {
                switch (_e.label) {
                    case 0:
                        accessToken = (_b = (_a = context.req) === null || _a === void 0 ? void 0 : _a.cookies) === null || _b === void 0 ? void 0 : _b[this.accessTokenKey];
                        refreshToken = (_d = (_c = context.req) === null || _c === void 0 ? void 0 : _c.cookies) === null || _d === void 0 ? void 0 : _d[this.refreshTokenKey];
                        if (!refreshToken)
                            return [2 /*return*/, false
                                /**
                                 * Refresh token!
                                 */
                            ];
                        if (!!accessToken) return [3 /*break*/, 4];
                        _e.label = 1;
                    case 1:
                        _e.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.handleRefresh(context.res, refreshToken)];
                    case 2:
                        _e.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        error_1 = _e.sent();
                        return [2 /*return*/, false];
                    case 4: return [2 /*return*/, !!accessToken && !!refreshToken];
                }
            });
        }); };
        this.withSessionRefresh = function (getServerSideProps) {
            if (getServerSideProps === void 0) { getServerSideProps = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, ({ props: {} })];
            }); }); }; }
            return function (context) { return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.checkSession(context)];
                        case 1:
                            _a.sent();
                            return [4 /*yield*/, getServerSideProps(context)];
                        case 2: return [2 /*return*/, _a.sent()];
                    }
                });
            }); };
        };
        this.withRestriction = function (shouldRedirect, getServerSideProps) {
            if (getServerSideProps === void 0) { getServerSideProps = function () { return __awaiter(_this, void 0, void 0, function () { return __generator(this, function (_a) {
                return [2 /*return*/, ({ props: {} })];
            }); }); }; }
            return function (context) { return __awaiter(_this, void 0, void 0, function () {
                var hasSession, destination;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.checkSession(context)];
                        case 1:
                            hasSession = _a.sent();
                            destination = shouldRedirect(hasSession);
                            // will redirect because there was no session
                            if (!hasSession && destination) {
                                destination = destination.includes('?')
                                    ? "".concat(destination, "&returnTo=").concat(context.resolvedUrl)
                                    : "".concat(destination, "?returnTo=").concat(context.resolvedUrl);
                            }
                            if (destination) {
                                return [2 /*return*/, {
                                        redirect: {
                                            destination: destination,
                                            permanent: false,
                                        },
                                    }];
                            }
                            return [4 /*yield*/, getServerSideProps(context)];
                        case 2: return [2 /*return*/, _a.sent()];
                    }
                });
            }); };
        };
        this.accessTokenKey = config.accessTokenKey;
        this.refreshTokenKey = config.refreshTokenKey;
        this.handleRefresh = config.handleRefresh;
    }
    return PagesRestrictions;
}());
export { PagesRestrictions };
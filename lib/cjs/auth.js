"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Auth = void 0;
var client_1 = require("./client");
var defaults_1 = require("./defaults");
var pages_1 = require("./pages");
var server_1 = require("./server");
var Auth = /** @class */ (function () {
    function Auth(config) {
        this.keys = {
            accessTokenKey: config.accessTokenKey || defaults_1.DEFAULTS.ACCESS_TOKEN_KEY,
            refreshTokenKey: config.refreshTokenKey || defaults_1.DEFAULTS.REFRESH_TOKEN_KEY,
            sessionIndicatorKey: config.sessionIndicatorKey || defaults_1.DEFAULTS.SESSION_INDICATOR_KEY,
        };
        this.server = new server_1.ServerAuth({
            accessTokenKey: this.keys.accessTokenKey,
            refreshTokenKey: this.keys.refreshTokenKey,
            sessionIndicatorKey: this.keys.sessionIndicatorKey,
            handlers: config.serverHandlers,
        });
        this.client = new client_1.ClientCookies({
            accessTokenKey: this.keys.accessTokenKey,
            sessionIndicatorKey: this.keys.sessionIndicatorKey,
        });
        this.restrictions = new pages_1.PagesRestrictions({
            accessTokenKey: this.keys.accessTokenKey,
            refreshTokenKey: this.keys.refreshTokenKey,
            handleRefresh: this.server.refreshSession,
        });
    }
    return Auth;
}());
exports.Auth = Auth;

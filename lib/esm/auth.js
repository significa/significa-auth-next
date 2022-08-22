import { ClientCookies } from './client';
import { DEFAULTS } from './defaults';
import { PagesRestrictions } from './pages';
import { ServerAuth } from './server';
var Auth = /** @class */ (function () {
    function Auth(config) {
        this.keys = {
            accessTokenKey: config.accessTokenKey || DEFAULTS.ACCESS_TOKEN_KEY,
            refreshTokenKey: config.refreshTokenKey || DEFAULTS.REFRESH_TOKEN_KEY,
            sessionIndicatorKey: config.sessionIndicatorKey || DEFAULTS.SESSION_INDICATOR_KEY,
        };
        this.server = new ServerAuth({
            accessTokenKey: this.keys.accessTokenKey,
            refreshTokenKey: this.keys.refreshTokenKey,
            sessionIndicatorKey: this.keys.sessionIndicatorKey,
            handlers: config.serverHandlers,
        });
        this.client = new ClientCookies({
            accessTokenKey: this.keys.accessTokenKey,
            sessionIndicatorKey: this.keys.sessionIndicatorKey,
        });
        this.restrictions = new PagesRestrictions({
            accessTokenKey: this.keys.accessTokenKey,
            refreshTokenKey: this.keys.refreshTokenKey,
            handleRefresh: this.server.refreshSession,
        });
    }
    return Auth;
}());
export { Auth };

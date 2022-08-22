import { ClientCookies } from './client';
import { PagesRestrictions } from './pages';
import { ServerAuth, ServerAuthConfig } from './server';
declare type AuthConfig = {
    accessTokenKey?: string;
    refreshTokenKey?: string;
    sessionIndicatorKey?: string;
    serverHandlers: ServerAuthConfig['handlers'];
};
export declare class Auth {
    keys: {
        accessTokenKey: string;
        refreshTokenKey: string;
        sessionIndicatorKey: string;
    };
    server: ServerAuth;
    client: ClientCookies;
    restrictions: PagesRestrictions;
    constructor(config: AuthConfig);
}
export {};

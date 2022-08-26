import { ServerResponse } from 'http';
import { NextApiRequest, NextApiResponse } from 'next';
export declare type SessionPayload = {
    accessToken: string;
    expires: number;
    refreshToken: string;
};
export declare type AuthServerHandlers = {
    basePath?: string;
    login: {
        fetch: (email: string, password: string) => Promise<Response>;
        parseResponse: (res: Response) => Promise<SessionPayload>;
    };
    refresh: {
        fetch: (refreshToken: string) => Promise<Response>;
        parseResponse: (res: Response) => Promise<SessionPayload>;
    };
    logout: {
        fetch: (refreshToken: string) => Promise<Response>;
    };
};
export declare type ServerAuthConfig = {
    accessTokenKey: string;
    refreshTokenKey: string;
    sessionIndicatorKey: string;
    handlers: AuthServerHandlers;
};
export declare class ServerAuth {
    private isRefreshing;
    private accessTokenKey;
    private refreshTokenKey;
    private sessionIndicatorKey;
    private handlers;
    private handlersBasePath;
    constructor(config: ServerAuthConfig);
    /**
     * Builds the cookie string
     */
    private buildCookie;
    /**
     * Given a session payload, sets the cookies headers on the ServerResponse
     */
    private setSessionCookies;
    /**
     * Clears the cookies on the ServerResponse.
     */
    private clearSessionCookies;
    startSession: (res: ServerResponse, email: string, password: string) => Promise<void>;
    /**
     * Uses the provided refresh token to get a new session.
     */
    refreshSession: (res: ServerResponse, refreshToken: string, shouldRetry?: boolean) => Promise<SessionPayload | undefined>;
    /**
     * This method is meant to be the default export of a dynamic Next's api route (e.g.: pages/api/auth/[path].ts)
     * It will handle the login, refresh and logout requests.
     */
    handler(req: NextApiRequest, res: NextApiResponse): Promise<void>;
    get paths(): {
        login: string;
        refresh: string;
        logout: string;
    };
}

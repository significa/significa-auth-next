export declare type ClientCookiesConfig = {
    accessTokenKey: string;
    sessionIndicatorKey: string;
};
export declare class ClientCookies {
    private accessTokenKey;
    private sessionIndicatorKey;
    constructor(config: ClientCookiesConfig);
    private buildCookie;
    setCookie(key: string, value: string, expires?: number): void;
    getCookie(key: string): string | null;
    clearCookie(key: string): void;
    getAccessToken: () => string | null;
    getSessionIndicator: () => string | null;
    clearAccessToken: () => void;
    clearSessionIndicator: () => void;
}

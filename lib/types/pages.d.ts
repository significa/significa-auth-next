/// <reference types="node" />
/// <reference types="node" />
import { ServerResponse } from 'http';
import { GetServerSideProps } from 'next';
export declare type PagesRestrictionsConfig = {
    accessTokenKey: string;
    refreshTokenKey: string;
    handleRefresh: (res: ServerResponse, refreshToken: string) => any;
};
export declare class PagesRestrictions {
    private accessTokenKey;
    private refreshTokenKey;
    private handleRefresh;
    constructor(config: PagesRestrictionsConfig);
    private checkSession;
    withSessionRefresh: <P = any>(getServerSideProps?: GetServerSideProps<P, import("querystring").ParsedUrlQuery, import("next").PreviewData>) => GetServerSideProps<P, import("querystring").ParsedUrlQuery, import("next").PreviewData>;
    withRestriction: <P = any>(shouldRedirect: (hasSession: boolean) => string | false, getServerSideProps?: GetServerSideProps<P, import("querystring").ParsedUrlQuery, import("next").PreviewData>) => GetServerSideProps<P, import("querystring").ParsedUrlQuery, import("next").PreviewData>;
}

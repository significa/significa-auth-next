declare type RefreshManagerConfig = {
    getSessionExpiryDate: () => string | null;
    refreshPath: string;
    shouldRefresh?: (sessionExpirationDate: Date) => boolean;
    interval?: number | null;
};
export declare const useRefreshSession: ({ getSessionExpiryDate, refreshPath, shouldRefresh, interval, }: RefreshManagerConfig) => void;
export {};

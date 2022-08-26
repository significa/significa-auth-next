declare type RefreshManagerConfig = {
    refreshPath: string;
    shouldRefresh: () => boolean;
    interval?: number | null;
};
export declare const isLessThan30Seconds: (date: Date | null) => boolean;
export declare const useRefreshSession: ({ refreshPath, shouldRefresh, interval, }: RefreshManagerConfig) => void;
export {};

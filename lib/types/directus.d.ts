import { AuthServerHandlers } from './server';
export declare const createDirectusHandlers: (config: {
    url: string;
    basePath?: string;
}) => AuthServerHandlers;

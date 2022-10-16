export type Notification = {
    id?: string;
    level?: 'info' | 'pending' | 'warning' | 'prompt' | 'error' | 'debug';
    message: string;
    actions?: {
        label: string;
        payload?: {[key: string]: any};
        globalFnName: string;
    }[];
    clearable?: boolean;
    timeout?: number;
    timestamp?: EpochTimeStamp;
}
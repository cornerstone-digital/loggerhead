declare type MaskingRuleTypes = 'Key' | 'KeyIncludes' | 'RegEx';
export interface DataMaskingRule {
    name: string;
    type: MaskingRuleTypes;
    matchValue: any;
    replaceWith: string;
}
export interface DataMaskingConfig {
    enabled: boolean;
    enableDefaults?: {
        [key: string]: boolean | undefined;
        email?: boolean;
        phone?: boolean;
        password?: boolean;
        postcode?: boolean;
    };
    rules: DataMaskingRule[];
}
export interface LoggerheadConfig {
    namespace: string;
    enabled: boolean;
    level: LogLevels;
    timeStamp?: boolean;
    timeStampFormat?: string;
    masking: DataMaskingConfig;
}
export declare enum LogLevels {
    OFF = 0,
    FATAL = 1,
    ERROR = 2,
    WARN = 3,
    INFO = 4,
    DEBUG = 5,
    TRACE = 6,
    ALL = 7
}
export {};
//# sourceMappingURL=index.types.d.ts.map
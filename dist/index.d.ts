import { IDebugger } from 'debug';
import { LoggerheadConfig, LogLevels } from './types/index.types';
export * from './types/index.types';
export default class Loggerhead {
    private _config;
    instance: IDebugger;
    private level;
    private timestamp;
    private timestampFormat;
    private masker;
    constructor(config: LoggerheadConfig);
    getConfig(): LoggerheadConfig;
    loggingEnabled(): boolean;
    log(level: LogLevels, ...args: any | any[]): void;
    trace(...args: any | any[]): void;
    info(...args: any | any[]): void;
    debug(...args: any | any[]): void;
    warn(...args: any | any[]): void;
    error(...args: any | any[]): void;
    fatal(...args: any | any[]): void;
    private cleanArgs;
    private getTimestamp;
}
//# sourceMappingURL=index.d.ts.map
import debug, { IDebugger } from 'debug'
import * as dayjs from 'dayjs'

export interface LoggerheadConfig {
  namespace: string
  enabled: boolean
  level: LogLevels
  timeStamp?: boolean
  timeStampFormat?: string
}

export enum LogLevels {
  OFF = 0,
  FATAL = 1,
  ERROR = 2,
  WARN = 3,
  INFO = 4,
  DEBUG = 5,
  TRACE = 6,
  ALL = 7
}

export default class Loggerhead {
  private _config: LoggerheadConfig
  public instance: IDebugger
  private level: LogLevels
  private timestamp: boolean
  private timestampFormat: string

  constructor(config: LoggerheadConfig) {
    this._config = config
    this.instance = debug(config.namespace)
    this.instance.enabled = config.enabled
    this.level = config.level
    this.timestamp = config.timeStamp ? config.timeStamp : false
    this.timestampFormat = config.timeStampFormat ? config.timeStampFormat : 'YYYY-MM-DD HH:mm:ss'
    return this
  }

  public loggingEnabled() {
    return this._config.enabled
  }

  public trace(...args: any | any[]): void {
    if (this.loggingEnabled() && this.level >= LogLevels.TRACE) {
      args.unshift(LogLevels[LogLevels.INFO])
      this.timestamp && args.unshift(this.getTimestamp())
      this.instance.apply(this, args)
    }
  }

  public info(...args: any | any[]): void {
    if (this.loggingEnabled() && this.level >= LogLevels.INFO) {
      args.unshift(LogLevels[LogLevels.INFO])
      this.timestamp && args.unshift(this.getTimestamp())
      this.instance.apply(this, args)
    }
  }

  public debug(...args: any | any[]): void {
    if (this.loggingEnabled() && this.level >= LogLevels.DEBUG) {
      args.unshift(LogLevels[LogLevels.INFO])
      this.timestamp && args.unshift(this.getTimestamp())
      this.instance.apply(this, args)
    }
  }

  public warn(...args: any | any[]): void {
    if (this.loggingEnabled() && this.level >= LogLevels.WARN) {
      args.unshift(LogLevels[LogLevels.INFO])
      this.timestamp && args.unshift(this.getTimestamp())
      this.instance.apply(this, args)
    }
  }

  public error(...args: any | any[]): void {
    if (this.loggingEnabled() && this.level >= LogLevels.ERROR) {
      args.unshift(LogLevels[LogLevels.INFO])
      this.timestamp && args.unshift(this.getTimestamp())
      this.instance.apply(this, args)
    }
  }

  public fatal(...args: any | any[]): void {
    if (this.loggingEnabled() && this.level >= LogLevels.FATAL) {
      args.unshift(LogLevels[LogLevels.INFO])
      this.timestamp && args.unshift(this.getTimestamp())
      this.instance.apply(this, args)
    }
  }

  private getTimestamp() {
    return dayjs().format(this.timestampFormat)
  }
}

import debug, { IDebugger } from 'debug'
import { LoggerheadConfig, LogLevels } from './types/loggerhead.types'
import getConfig from './config/validator'
import { ErrorObject } from 'ajv'
import DataMaskingUtils from './helpers/DataMaskingUtils'
const dayjs = require('dayjs')

interface ConfigErrorObj {
  obj: any
  errors: ErrorObject[] | null | undefined
}

export default class Loggerhead {
  private _config: LoggerheadConfig
  public instance: IDebugger
  private level: LogLevels
  private timestamp: boolean
  private timestampFormat: string
  private masker: DataMaskingUtils | null = null

  constructor(config: object) {
    const configObj: any | ConfigErrorObj | LoggerheadConfig = getConfig(config)

    if (configObj.errors && Array.isArray(configObj.errors)) {
      console.error(configObj.errors)
      process.exit()
    }

    this._config = configObj
    this.instance = debug(configObj.namespace)
    this.instance.enabled = configObj.enabled
    this.level = configObj.level
    this.timestamp = configObj.timeStamp ? configObj.timeStamp : false
    this.timestampFormat = configObj.timeStampFormat

    if (this._config.masking && this._config.masking.enabled) {
      this.masker = new DataMaskingUtils(this._config.masking)
    }

    return this
  }

  public loggingEnabled() {
    return this._config.enabled
  }

  public log(level: LogLevels, ...args: any | any[]) {
    if (this.loggingEnabled() && this.level >= level) {
      args = this.cleanArgs(...args)
      args.unshift(LogLevels[level])
      this.timestamp && args.unshift(this.getTimestamp())
      this.instance('%j', ...args)
    }
  }

  public trace(...args: any | any[]): void {
    this.log(LogLevels.TRACE, ...args)
  }

  public info(...args: any | any[]): void {
    this.log(LogLevels.INFO, ...args)
  }

  public debug(...args: any | any[]): void {
    this.log(LogLevels.DEBUG, ...args)
  }

  public warn(...args: any | any[]): void {
    this.log(LogLevels.WARN, ...args)
  }

  public error(...args: any | any[]): void {
    this.log(LogLevels.ERROR, ...args)
  }

  public fatal(...args: any | any[]): void {
    this.log(LogLevels.FATAL, ...args)
  }

  private cleanArgs(...args: any | any[]) {
    if (this._config.masking.enabled && this.masker) {
      args = args.map((arg: any) => {
        return this.masker ? this.masker.cleanseData(arg) : arg
      })

      return args
    } else {
      return args
    }
  }

  private getTimestamp() {
    return dayjs().format(this.timestampFormat)
  }
}

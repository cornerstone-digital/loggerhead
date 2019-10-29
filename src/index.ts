import debug, { IDebugger } from 'debug'
import dayjs from 'dayjs'
import fs from 'fs'
import util from 'util'
import { LoggerheadConfig, LogLevels } from './types/index.types'
import getConfig from './config/validator'
import DataMaskingUtils from './helpers/DataMaskingUtils/DataMaskingUtils'

export * from './types/index.types'
export default class Loggerhead {
  private _config: LoggerheadConfig
  public instance: IDebugger
  private level: LogLevels
  private timestamp?: boolean
  private timestampFormat?: string
  private masker: DataMaskingUtils | null = null
  private fileLogger: any

  constructor(config: LoggerheadConfig) {
    const configObj: LoggerheadConfig = getConfig(config)

    this._config = configObj
    this.instance = debug(configObj.namespace)
    this.instance.enabled = configObj.enabled
    this.level = configObj.level
    this.timestamp = configObj.timeStamp
    this.timestampFormat = configObj.timeStampFormat

    if (!fs.existsSync(this._config.logDir)) {
      fs.mkdirSync(this._config.logDir)
    }

    this.fileLogger = fs.createWriteStream(this._config.logDir + '/debug.log', { flags: 'a' })

    if (this._config.masking && this._config.masking.enabled) {
      this.masker = new DataMaskingUtils(this._config.masking)
    }

    return this
  }

  public getConfig() {
    return this._config
  }

  public loggingEnabled() {
    return this._config.enabled
  }

  public buildLogEntry(args: any | any[]) {
    return `${args[0]}:${args[1]} ${JSON.stringify(args[2], null, 2)}`
  }

  public log(level: LogLevels, ...args: any | any[]) {
    if (this.loggingEnabled() && this.level >= level) {
      args = this.cleanArgs(...args)
      args.unshift(LogLevels[level])
      this.timestamp && args.unshift(this.getTimestamp())
      this.fileLogger.write(util.format(this.buildLogEntry(args)) + '\n')
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
    if (this.masker) {
      args = args.map((arg: any) => {
        return this.masker && this.masker.cleanseData(arg)
      })

      return args
    } else {
      return args
    }
  }

  public getTimestamp() {
    return dayjs().format(this.timestampFormat)
  }
}

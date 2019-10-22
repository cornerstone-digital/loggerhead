import Loggerhead from '../src/loggerhead'
import * as dayjs from 'dayjs'
import { LogLevels, LoggerheadConfig } from '../src/types/loggerhead.types'
import getConfig from '../src/config/validator'

jest.mock('debug', () => ({
  default: () => () => ({
    log: jest.fn(),
    enabled: true
  })
}))

const defaultConfig: LoggerheadConfig = getConfig({
  namespace: 'test',
  enabled: true,
  level: LogLevels.ALL,
  timeStampFormat: 'YYYY-MM-DD HH:mm',
  masking: {
    enabled: true,
    enableDefaults: {
      email: true,
      phone: true
    }
  }
})

const logMessage = 'Test log message'

const callDebugLevels = (logger: Loggerhead) => {
  logger.fatal(logMessage)
  logger.error(logMessage)
  logger.warn(logMessage)
  logger.info(logMessage)
  logger.debug(logMessage)
  logger.trace(logMessage)
}

const createLogger = (config?: LoggerheadConfig) => {
  const loggerConfig: LoggerheadConfig = {
    ...defaultConfig,
    ...config
  }

  return new Loggerhead(loggerConfig)
}

const logger = createLogger()

describe('Loggerhead', () => {
  it('Should return a new Loggerhead instance', () => {
    const loggerConfig = {
      ...defaultConfig
    }
    const logger = createLogger(loggerConfig)
    expect(logger).toBeInstanceOf(Loggerhead)
  })
  describe('logginEnabled()', () => {
    it('Should be enabled by default', () => {
      const loggerConfig = {
        ...defaultConfig
      }
      const logger = createLogger(loggerConfig)
      expect(logger.loggingEnabled()).toBe(true)
    })

    it('Should return false if disabled', () => {
      const loggerConfig = { ...defaultConfig, enabled: false }
      const logger = createLogger(loggerConfig)
      expect(logger.loggingEnabled()).toBe(false)
    })
  })

  describe('OFF mode', () => {
    it('should not call debugger for any level', () => {
      const loggerConfig = { ...defaultConfig, level: LogLevels.OFF }
      const logger = createLogger(loggerConfig)
      const spy = jest.spyOn(logger, 'instance')
      callDebugLevels(logger)
      expect(spy).toBeCalledTimes(0)
    })
  })

  describe('logLevels', () => {
    it('Fatal', () => {
      const loggerConfig = { ...defaultConfig, level: LogLevels.FATAL }
      const logger = createLogger(loggerConfig)
      const spy = jest.spyOn(logger, 'instance')
      callDebugLevels(logger)
      expect(spy).toBeCalledTimes(1)
    })

    it('Error', () => {
      const loggerConfig = { ...defaultConfig, level: LogLevels.ERROR }
      const logger = createLogger(loggerConfig)
      const spy = jest.spyOn(logger, 'instance')
      callDebugLevels(logger)
      expect(spy).toBeCalledTimes(2)
    })

    it('Warn', () => {
      const loggerConfig = { ...defaultConfig, level: LogLevels.WARN }
      const logger = createLogger(loggerConfig)
      const spy = jest.spyOn(logger, 'instance')
      callDebugLevels(logger)
      expect(spy).toBeCalledTimes(3)
    })

    it('Info', () => {
      const loggerConfig = { ...defaultConfig, level: LogLevels.INFO }
      const logger = createLogger(loggerConfig)
      const spy = jest.spyOn(logger, 'instance')
      callDebugLevels(logger)
      expect(spy).toBeCalledTimes(4)
    })

    it('Debug', () => {
      const loggerConfig = { ...defaultConfig, level: LogLevels.DEBUG }
      const logger = createLogger(loggerConfig)
      const spy = jest.spyOn(logger, 'instance')
      callDebugLevels(logger)
      expect(spy).toBeCalledTimes(5)
    })

    it('Trace', () => {
      const loggerConfig = { ...defaultConfig, level: LogLevels.TRACE }
      const logger = createLogger(loggerConfig)
      const spy = jest.spyOn(logger, 'instance')
      callDebugLevels(logger)
      expect(spy).toBeCalledTimes(6)
    })

    it('All', () => {
      const loggerConfig = { ...defaultConfig, level: LogLevels.ALL }
      const logger = createLogger(loggerConfig)
      const spy = jest.spyOn(logger, 'instance')
      callDebugLevels(logger)
      expect(spy).toBeCalledTimes(6)
    })
  })

  describe('getTimeStamp()', () => {
    it('Should return timestamp correctly', () => {
      const loggerConfig = {
        ...defaultConfig,
        level: LogLevels.ALL
      }
      const logger = createLogger(loggerConfig)
      const spy = jest.spyOn(logger, 'instance')
      logger.info(logMessage)

      expect(spy).toHaveBeenCalledWith(
        '%j',
        dayjs()
          .format(defaultConfig.timeStampFormat)
          .toString(),
        'INFO',
        logMessage
      )
    })
  })
})

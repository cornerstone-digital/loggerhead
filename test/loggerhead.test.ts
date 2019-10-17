import Loggerhead, { LoggerheadConfig, LogLevels } from '../src/loggerhead'
import * as dayjs from 'dayjs'

// jest.mock('dayjs')

const defaultConfig: LoggerheadConfig = {
  namespace: 'test',
  enabled: true,
  level: 0,
  timeStampFormat: 'YYYY-MM-DD HH:mm'
}

const callDebugLevels = (logger: Loggerhead) => {
  logger.fatal('FATAL')
  logger.error('ERROR')
  logger.warn('WARN')
  logger.info('INFO')
  logger.debug('DEBUG')
  logger.trace('TRACE')
}

const createLogger = (level: LogLevels, timeStamp: boolean = false) => {
  const loggerConfig: LoggerheadConfig = {
    ...defaultConfig,
    level,
    timeStamp
  }

  return new Loggerhead(loggerConfig)
}

/**
 * Dummy test
 */
describe('Functionallity test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy()
  })

  it('DummyClass is instantiable', () => {
    const loggerConfig = {
      ...defaultConfig,
      level: 1
    }

    expect(new Loggerhead(loggerConfig)).toBeInstanceOf(Loggerhead)
  })
})

describe('Loggerhead', () => {
  describe('logginEnabled()', () => {
    it('Should be enabled by default', () => {
      const LoggerheadConfig = { ...defaultConfig }
      const instance = new Loggerhead(LoggerheadConfig)

      expect(instance.loggingEnabled()).toBe(true)
    })

    it('Should return false if disabled', () => {
      const LoggerheadConfig = { ...defaultConfig, enabled: false }
      const instance = new Loggerhead(LoggerheadConfig)

      expect(instance.loggingEnabled()).toBe(false)
    })
  })

  describe('OFF mode', () => {
    it('should not call debugger for any level', () => {
      const logger = createLogger(LogLevels.OFF)
      const spy = jest.spyOn(logger, 'instance')

      callDebugLevels(logger)
      expect(spy).toBeCalledTimes(0)
    })
  })

  describe('logLevels', () => {
    it('Fatal', () => {
      const logger = createLogger(LogLevels.FATAL)
      const spy = jest.spyOn(logger, 'instance')

      callDebugLevels(logger)
      expect(spy).toBeCalledTimes(1)
    })
    it('Error', () => {
      const logger = createLogger(LogLevels.ERROR)
      const spy = jest.spyOn(logger, 'instance')

      callDebugLevels(logger)
      expect(spy).toBeCalledTimes(2)
    })
    it('Warn', () => {
      const logger = createLogger(LogLevels.WARN)
      const spy = jest.spyOn(logger, 'instance')

      callDebugLevels(logger)
      expect(spy).toBeCalledTimes(3)
    })
    it('Info', () => {
      const logger = createLogger(LogLevels.INFO)
      const spy = jest.spyOn(logger, 'instance')

      callDebugLevels(logger)
      expect(spy).toBeCalledTimes(4)
    })
    it('Debug', () => {
      const logger = createLogger(LogLevels.DEBUG)
      const spy = jest.spyOn(logger, 'instance')

      callDebugLevels(logger)
      expect(spy).toBeCalledTimes(5)
    })
    it('Trace', () => {
      const logger = createLogger(LogLevels.TRACE)
      const spy = jest.spyOn(logger, 'instance')

      callDebugLevels(logger)
      expect(spy).toBeCalledTimes(6)
    })
    it('All', () => {
      const logger = createLogger(LogLevels.ALL)
      const spy = jest.spyOn(logger, 'instance')

      callDebugLevels(logger)
      expect(spy).toBeCalledTimes(6)
    })
  })
  describe('getTimeStamp()', () => {
    it('Should return time stamp correctly formated by default', () => {
      const logger = createLogger(LogLevels.INFO, true)
      const spy = jest.spyOn(logger, 'instance')
      logger.info('test')
      expect(spy).toBeCalledWith(
        dayjs()
          .format(defaultConfig.timeStampFormat)
          .toString(),
        'INFO',
        'test'
      )
    })
  })
})

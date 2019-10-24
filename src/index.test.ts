import Loggerhead from './index'
import { LoggerheadConfig, LogLevels } from './types/index.types'
import getConfig from './config/validator'

// jest.mock('debug', () => ({
//   default: () => ({
//     log: jest.fn(),
//     enabled: true
//   })
// }))

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
    },
    rules: []
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

  const logger = new Loggerhead(loggerConfig)
  return logger
}

describe('Loggerhead', () => {
  it('Should be an instance of function', () => {
    expect(Loggerhead).toBeInstanceOf(Function)
  })

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

  describe('Logging Levels', () => {
    describe('OFF mode (Level 0)', () => {
      it('should not call debugger for any level', () => {
        const loggerConfig = { ...defaultConfig, level: LogLevels.OFF }
        const logger = createLogger(loggerConfig)
        const spy = jest.spyOn(logger, 'instance').mockImplementation()
        callDebugLevels(logger)
        expect(spy).toBeCalledTimes(0)
      })
    })

    describe('FATAL mode (Level 1)', () => {
      it('should call debugger for FATAL level only', () => {
        const loggerConfig = { ...defaultConfig, level: LogLevels.FATAL }
        const logger = createLogger(loggerConfig)
        const spy = jest.spyOn(logger, 'instance').mockImplementation()
        callDebugLevels(logger)
        expect(spy).toBeCalledTimes(1)
      })
    })

    describe('ERROR mode (Level 2)', () => {
      it('should call debugger for ERROR level and lower', () => {
        const loggerConfig = { ...defaultConfig, level: LogLevels.ERROR }
        const logger = createLogger(loggerConfig)
        const spy = jest.spyOn(logger, 'instance').mockImplementation()
        callDebugLevels(logger)
        expect(spy).toBeCalledTimes(2)
      })
    })

    describe('WARN mode (Level 3)', () => {
      it('should call debugger for WARN level and lower', () => {
        const loggerConfig = { ...defaultConfig, level: LogLevels.WARN }
        const logger = createLogger(loggerConfig)
        const spy = jest.spyOn(logger, 'instance').mockImplementation()
        callDebugLevels(logger)
        expect(spy).toBeCalledTimes(3)
      })
    })

    describe('INFO mode (Level 4)', () => {
      it('should call debugger for INFO level and lower', () => {
        const loggerConfig = { ...defaultConfig, level: LogLevels.INFO }
        const logger = createLogger(loggerConfig)
        const spy = jest.spyOn(logger, 'instance').mockImplementation()
        callDebugLevels(logger)
        expect(spy).toBeCalledTimes(4)
      })
    })

    describe('DEBUG mode (Level 5)', () => {
      it('should call debugger for DEBUG level and lower', () => {
        const loggerConfig = { ...defaultConfig, level: LogLevels.DEBUG }
        const logger = createLogger(loggerConfig)
        const spy = jest.spyOn(logger, 'instance').mockImplementation()
        callDebugLevels(logger)
        expect(spy).toBeCalledTimes(5)
      })
    })

    describe('TRACE mode (Level 6)', () => {
      it('should call debugger for TRACE level and lower', () => {
        const loggerConfig = { ...defaultConfig, level: LogLevels.TRACE }
        const logger = createLogger(loggerConfig)
        const spy = jest.spyOn(logger, 'instance').mockImplementation()
        callDebugLevels(logger)
        expect(spy).toBeCalledTimes(6)
      })
    })

    describe('ALL mode (Level 7)', () => {
      it('should call debugger for all levels', () => {
        const loggerConfig = { ...defaultConfig, level: LogLevels.ALL }
        const logger = createLogger(loggerConfig)
        const spy = jest.spyOn(logger, 'instance').mockImplementation()
        callDebugLevels(logger)
        expect(spy).toBeCalledTimes(6)
      })
    })
  })

  describe('Data masking', () => {
    describe('Email addresses', () => {
      it('Should not be masked if masking is disbled', () => {
        const loggerConfig = {
          ...defaultConfig,
          level: LogLevels.ALL,
          masking: { enabled: false, rules: [] }
        }
        const logger = createLogger(loggerConfig)
        console.log(logger)
        // const spy = jest.spyOn(logger, 'instance').mockImplementation()
      })

      // it('Should should be masked when it is enabled in confifg', () => {
      //   const loggerConfig = { ...defaultConfig, level: LogLevels.ALL }
      //   const logger = createLogger(loggerConfig)
      //   const spy = jest.spyOn(logger, 'instance').mockImplementation()
      // })
    })
  })
})

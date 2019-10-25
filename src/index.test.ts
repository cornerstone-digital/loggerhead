import Loggerhead from './index'
import { LoggerheadConfig, LogLevels } from './types/index.types'
import MockDate from 'mockdate'

const timestamp = '2019-10-25 06:41'
beforeEach(() => {
  MockDate.set(new Date(timestamp))
})

afterEach(() => {
  MockDate.reset()
})

const defaultConfig: LoggerheadConfig = {
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
}

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

  describe('getTimestamp()', () => {
    it('Should return a formatted date string', () => {
      const loggerConfig = {
        ...defaultConfig
      }

      const logger = createLogger(loggerConfig)
      expect(logger.getTimestamp()).toEqual(timestamp)
    })
  })

  describe('getConfig()', () => {
    it('Should return the current configuration', () => {
      const loggerConfig = {
        ...defaultConfig
      }

      const logger = createLogger(loggerConfig)
      expect(logger.getConfig()).toMatchObject(defaultConfig)
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
        logger.getTimestamp = jest.fn(() => timestamp)
        const spy = jest.spyOn(logger, 'instance').mockImplementation()
        logger.info('test with email: martingegan@gmail.com')
        expect(spy).toHaveBeenCalledWith(
          '%j',
          timestamp,
          'INFO',
          'test with email: martingegan@gmail.com'
        )
      })

      it('Should be masked if masking is enabled', () => {
        const loggerConfig = {
          ...defaultConfig,
          level: LogLevels.ALL,
          masking: { enableDefaults: { email: true }, enabled: true, rules: [] }
        }
        const logger = createLogger(loggerConfig)
        logger.getTimestamp = jest.fn(() => timestamp)
        const spy = jest.spyOn(logger, 'instance').mockImplementation()
        logger.info('test with email: martingegan@gmail.com')
        expect(spy).toHaveBeenCalledWith('%j', timestamp, 'INFO', 'test with email: ***@****.***')
      })
    })

    describe('Phone numbers', () => {
      it('Should not be masked if masking is disabled', () => {
        const loggerConfig = {
          ...defaultConfig,
          level: LogLevels.ALL,
          masking: { enabled: false, rules: [] }
        }
        const logger = createLogger(loggerConfig)
        logger.getTimestamp = jest.fn(() => timestamp)
        const spy = jest.spyOn(logger, 'instance').mockImplementation()
        logger.info('test with phone: 07748 443124')
        expect(spy).toHaveBeenCalledWith('%j', timestamp, 'INFO', 'test with phone: 07748 443124')
      })

      it('Should be masked if masking is enabled', () => {
        const loggerConfig = {
          ...defaultConfig,
          level: LogLevels.ALL,
          masking: { enableDefaults: { phone: true }, enabled: true, rules: [] }
        }
        const logger = createLogger(loggerConfig)
        logger.getTimestamp = jest.fn(() => timestamp)
        const spy = jest.spyOn(logger, 'instance').mockImplementation()
        logger.info('test with phone: 07748 443124')
        expect(spy).toHaveBeenCalledWith('%j', timestamp, 'INFO', 'test with phone: ***** ******')
      })
    })

    describe('Postcodes', () => {
      it('Should not be masked if masking is disbled', () => {
        const loggerConfig = {
          ...defaultConfig,
          level: LogLevels.ALL,
          masking: { enabled: false, rules: [] }
        }
        const logger = createLogger(loggerConfig)
        logger.getTimestamp = jest.fn(() => timestamp)
        const spy = jest.spyOn(logger, 'instance').mockImplementation()
        logger.info('test with postcode: GU21 1GQ')
        expect(spy).toHaveBeenCalledWith('%j', timestamp, 'INFO', 'test with postcode: GU21 1GQ')
      })

      it('Should be masked if masking is enabled', () => {
        const loggerConfig = {
          ...defaultConfig,
          level: LogLevels.ALL,
          masking: { enableDefaults: { postcode: true }, enabled: true, rules: [] }
        }
        const logger = createLogger(loggerConfig)
        logger.getTimestamp = jest.fn(() => timestamp)
        const spy = jest.spyOn(logger, 'instance').mockImplementation()
        logger.info('test with postcode: GU21 1GQ')
        expect(spy).toHaveBeenCalledWith('%j', timestamp, 'INFO', 'test with postcode: **** ***')
      })
    })

    describe('Passwords', () => {
      it('Should not be masked if masking is disbled', () => {
        const loggerConfig = {
          ...defaultConfig,
          level: LogLevels.ALL,
          masking: { enabled: false, rules: [] }
        }
        const logger = createLogger(loggerConfig)
        logger.getTimestamp = jest.fn(() => timestamp)
        const spy = jest.spyOn(logger, 'instance').mockImplementation()
        logger.info({
          password: 'somepassword',
          secret: 'somesecret',
          myPassword: 'myPassword',
          mySecret: 'mySecret'
        })
        expect(spy).toHaveBeenCalledWith('%j', timestamp, 'INFO', {
          myPassword: 'myPassword',
          mySecret: 'mySecret',
          password: 'somepassword',
          secret: 'somesecret'
        })
      })

      it('Should be masked if masking is enabled', () => {
        const loggerConfig = {
          ...defaultConfig,
          level: LogLevels.ALL,
          masking: { enableDefaults: { password: true }, enabled: true, rules: [] }
        }
        const logger = createLogger(loggerConfig)
        logger.getTimestamp = jest.fn(() => timestamp)
        const spy = jest.spyOn(logger, 'instance').mockImplementation()
        logger.info({
          password: 'somepassword',
          secret: 'somesecret',
          myPassword: 'myPassword',
          mySecret: 'mySecret'
        })
        expect(spy).toHaveBeenCalledWith('%j', timestamp, 'INFO', {
          myPassword: '***********',
          mySecret: '***********',
          password: '***********',
          secret: '***********'
        })
      })
    })
  })
})

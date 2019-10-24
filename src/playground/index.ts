import Loggerhead from '../index'
import { LoggerheadConfig, LogLevels } from '../types/index.types'

const config: LoggerheadConfig = {
  namespace: 'Loggerhead',
  enabled: true,
  level: LogLevels.ALL,
  timeStamp: true,
  masking: {
    enabled: true,
    enableDefaults: {
      phone: true,
      email: true,
      postcode: true,
      password: true
    },
    rules: [
      {
        name: 'id',
        type: 'KeyIncludes',
        matchValue: 'id',
        replaceWith: '*********'
      }
    ]
  }
}

const logger: Loggerhead = new Loggerhead(config)

logger.info({
  someId: '121212121212',
  email: 'martingegan@gmail.com',
  phone: '01234 567890',
  postcode: 'GU12 1GY',
  password: 'dsdasdsadas',
  secretPassword: 'sasasa',
  deep: {
    nested: {
      email: 'martingegan@gmail.com',
      phone: '01234 567890',
      postcode: 'GU12 1GY'
    }
  }
})

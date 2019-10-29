import Loggerhead from '../index'
import { LoggerheadConfig, LogLevels } from '../types/index.types'
import getConfig from '../config/validator'

const config: LoggerheadConfig = getConfig({
  namespace: 'Loggerhead',
  enabled: true,
  level: LogLevels.ALL,
  timeStamp: true,
  logDir: process.cwd() + '/.logs',
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
      },
      {
        name: 'jwt',
        type: 'RegEx',
        matchValue: new RegExp(/[A-Za-z0-9-_=]+\.[A-Za-z0-9-_=]+\.?[A-Za-z0-9-_.+/=]*$/gi),
        replaceWith: '*********'
      }
    ]
  }
})

const logger: Loggerhead = new Loggerhead(config)

logger.info(
  '"decryptedToken eyJhbGciOiJIUzI1NiJ9.eyJwbGF0Zm9ybV9zZXNzaW9uX2lkIjoiNzYxZjRlMjAtZDkwNC00MmZhLTlhYjktNzA3MmUwMDAwZDZmIiwiYXNzdXJhbmNlX2xldmVsIjoiMCIsImp0aSI6IkVTSE9QIiwiaWF0IjoxNTcxOTg3MTI4LCJzdWIiOiJhdXRob3JpemF0aW9uIiwiaXNzIjoiREFMIiwiZXhwIjoxNTcyMDczNTI4fQ.H7H3mkUmp-99DXSmht6Eu7-3a7Oq2OYtL_CHqQ8g_z8'
)

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

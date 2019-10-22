import * as AJV from 'ajv'
import { LoggerheadConfig } from '../types/loggerhead.types'

const configSchema = {
  type: 'object',
  properties: {
    additionalProperties: true,
    namespace: { type: 'string', default: '' },
    enabled: { type: 'boolean', default: true },
    level: { enum: [0, 1, 2, 3, 4, 5, 6, 7], default: 2 },
    timeStamp: { type: 'boolean', default: true },
    timeStampFormat: { type: 'string', default: 'YYYY-MM-DD HH:mm:ss' },
    masking: {
      default: {},
      properties: {
        enabled: { type: 'boolean', default: false },
        rules: {
          type: 'array',
          default: [],
          items: [
            {
              type: 'object',
              if: { properties: { name: { const: 'RegEx' } } },
              then: { properties: { matchValue: { format: 'regex' } } },
              properties: {
                name: { type: 'string' },
                type: { enum: ['Key', 'KeyIncludes', 'RegEx'] },
                matchValue: { type: 'string' },
                replaceWith: { type: 'string' }
              }
            }
          ]
        }
      }
    }
  }
}

const configValidator = new AJV({ allErrors: true, useDefaults: true })

const getConfig = (
  config: any
): any | { obj: any; errors: AJV.ErrorObject[] | null | undefined } => {
  const isValid: boolean | PromiseLike<any> = configValidator.validate(configSchema, config)
  return isValid ? config : { obj: config, errors: configValidator.errors }
}

export default getConfig

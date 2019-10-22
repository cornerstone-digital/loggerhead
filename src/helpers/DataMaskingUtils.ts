import * as flat from 'flat'
import { DataMaskingRule, DataMaskingConfig } from '../types/loggerhead.types'

const defaultRules: DataMaskingRule[] = [
  {
    name: 'password',
    type: 'KeyIncludes',
    matchValue: 'password',
    replaceWith: '***********'
  },
  {
    name: 'email',
    type: 'RegEx',
    matchValue: new RegExp(/\b[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2}\b/gi),
    replaceWith: '***@****.***'
  },
  {
    name: 'phone',
    type: 'RegEx',
    matchValue: new RegExp(
      /s*(([+](s?d)([-s]?d)|0)?(s?d)([-s]?d){9}|[(](s?d)([-s]?d)+s*[)]([-s]?d)+)s*/gi
    ),
    replaceWith: '***********'
  }
]

const defaultConfig: DataMaskingConfig = {
  enabled: false,
  enableDefaults: {
    email: false,
    phone: false,
    password: false,
    postcode: false
  },
  rules: []
}

class DataMaskingUtils {
  private config: DataMaskingConfig = defaultConfig
  constructor(config?: DataMaskingConfig) {
    if (config && Array.isArray(config.rules)) {
      this.config = {
        enabled: config.enabled,
        rules: [...config.rules]
      }
    }

    if (config && config.enableDefaults) {
      this.config.enableDefaults = {
        ...defaultConfig.enableDefaults,
        ...config.enableDefaults
      }
      defaultRules.forEach((defaultRule: DataMaskingRule) => {
        const enableRule = config.enableDefaults && config.enableDefaults[defaultRule.name]
        if (enableRule) {
          this.config.rules = [...this.config.rules, defaultRule]
        }
      })
    }
  }

  private isJson(str: any) {
    if (['string', 'number', 'boolean'].includes(typeof str)) {
      return false
    }

    try {
      JSON.parse(str)
    } catch (e) {
      return false
    }

    return true
  }

  private replaceKeyValues(input: string, maskingRule: DataMaskingRule) {
    const flattened: any = flat(JSON.parse(input))

    Object.keys(flattened).forEach(key => {
      const endKey = key.split('.').pop()
      if (endKey) {
        if (maskingRule.type === 'keyName' && endKey === maskingRule.matchValue) {
          flattened[key] = maskingRule.replaceWith
        }

        if (
          maskingRule.type === 'keyNameIncludes' &&
          endKey.toLowerCase().includes(maskingRule.matchValue)
        ) {
          flattened[key] = maskingRule.replaceWith
        }
      }
    })

    const parsed = flat.unflatten(flattened)

    return JSON.stringify(parsed)
  }

  private applyMaskingRules(input: string) {
    let cleaned = input
    this.config.rules.forEach((maskingRule: any) => {
      if (['Key', 'KeyIncludes'].includes(maskingRule.type)) {
        cleaned = this.replaceKeyValues(cleaned, maskingRule)
      }

      if (maskingRule.type === 'RegEx') {
        cleaned = cleaned.replace(maskingRule.matchValue, maskingRule.replaceWith)
      }
    })

    return this.isJson(cleaned) ? JSON.parse(cleaned) : cleaned
  }

  public getConfig() {
    return this.config
  }

  public cleanseData(input: any) {
    if (!input) {
      return
    }

    let data = this.isJson(input) ? JSON.parse(input) : input
    const dataString = this.isJson(data) ? JSON.stringify(data) : data
    data = this.applyMaskingRules(dataString)

    return data
  }
}

export default DataMaskingUtils

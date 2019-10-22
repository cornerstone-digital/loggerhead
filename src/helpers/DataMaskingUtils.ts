const flatUtil = require('flat')
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
    matchValue: new RegExp(/\b(?:0|\+?44|\+?44\s)(?:\d\s?){9,12}\b/gi),
    replaceWith: '***** ******'
  },
  {
    name: 'postcode',
    type: 'RegEx',
    matchValue: new RegExp(
      /\b([A-PR-UWYZ][A-HK-Y0-9](?:[A-HJKS-UW0-9][ABEHMNPRV-Y0-9]?)?\s*[0-9][ABD-HJLNP-UW-Z]{2}|GIR\s*0AA)\b/gi
    ),
    replaceWith: '**** ***'
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
    // if (['string', 'number', 'boolean'].includes(typeof str)) {
    //   return false
    // }

    try {
      JSON.parse(str)
    } catch (e) {
      return false
    }

    return true
  }

  private replaceKeyValues(input: string, maskingRule: DataMaskingRule) {
    const flattened: any = flatUtil(JSON.parse(input))

    Object.keys(flattened).forEach(key => {
      const endKey = key.split('.').pop()
      if (endKey) {
        if (maskingRule.type === 'Key' && endKey === maskingRule.matchValue) {
          flattened[key] = maskingRule.replaceWith
        }

        if (
          maskingRule.type === 'KeyIncludes' &&
          endKey.toLowerCase().includes(maskingRule.matchValue)
        ) {
          flattened[key] = maskingRule.replaceWith
        }
      }
    })

    const parsed = flatUtil.unflatten(flattened)

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

    let data = this.isJson(input) ? input : JSON.stringify(input)
    data = this.applyMaskingRules(data)

    return data
  }
}

export default DataMaskingUtils

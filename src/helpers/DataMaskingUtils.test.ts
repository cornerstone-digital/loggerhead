import DataMaskingUtils from './DataMaskingUtils'
import { DataMaskingConfig } from '../types/loggerhead.types'

const dataMaskingUtils = new DataMaskingUtils({
  enabled: false,
  enableDefaults: {
    email: true,
    phone: true,
    password: true,
    postcode: true
  },
  rules: [
    {
      name: 'name',
      type: 'keyName',
      matchValue: 'name',
      replaceWith: '***********'
    }
  ]
})

const createMaskingUtils = (config: DataMaskingConfig) => {}

console.log(dataMaskingUtils.getConfig().rules)

describe('DataMaskingUtils', () => {
  describe('cleanData()', () => {
    it('should be a function', () => {
      expect(dataMaskingUtils.cleanseData).toBeInstanceOf(Function)
    })

    describe('By default', () => {
      it('Should not mask data', () => {
        //
      })
    })

    describe('Email addresses', () => {
      beforeAll(() => {
        it('Should be correctly masked', () => {
          const originalData = {
            profile: {
              name: 'Joe Bloggs',
              email: 'joe@test.com'
            },
            nestedProfile: {
              name: 'Joe Bloggs',
              emails: ['joe@test.com', 'joe+1@test.com', 'joe.bloggs@test.com']
            }
          }
          const cleanedData = dataMaskingUtils.cleanseData(originalData)
          expect(JSON.stringify(cleanedData)).not.toContain('joe@test.com')
          expect(JSON.stringify(cleanedData)).not.toContain('joe+1@test.com')
          expect(JSON.stringify(cleanedData)).not.toContain('joe.bloggs@test.com')
        })
      })
    })

    it('Should correctly mask phone numbers', () => {
      const originalData = {
        profile: {
          phone: '07901980696',
          homePhone: '01234567890'
        },
        nestedProfile: {
          phones: ['07777015210', '01234567890', '+44 7777 015210', '+44 1234 567890']
        }
      }
      const cleanedData = dataMaskingUtils.cleanseData(originalData)
      expect(JSON.stringify(cleanedData)).not.toContain('07901980696')
      expect(JSON.stringify(cleanedData)).not.toContain('01234567890')
      expect(JSON.stringify(cleanedData)).not.toContain('+44 7777 015210')
      expect(JSON.stringify(cleanedData)).not.toContain('+44 1234 567890')
    })

    it('Should correctly mask based on key name', () => {
      const originalData = {
        profile: {
          name: 'Joe Bloggs',
          firstName: 'Joe'
        },
        nestedProfile: {
          name: 'Joe Bloggs'
        }
      }
      const cleanedData = dataMaskingUtils.cleanseData(originalData)
      expect(JSON.stringify(cleanedData)).not.toContain('07901980696')
      expect(JSON.stringify(cleanedData)).not.toContain('01234567890')
      expect(JSON.stringify(cleanedData)).not.toContain('+44 7777 015210')
      expect(JSON.stringify(cleanedData)).not.toContain('+44 1234 567890')
    })
  })
})

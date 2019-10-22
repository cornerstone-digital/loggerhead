import DataMaskingUtils from './DataMaskingUtils'

const dataMaskingUtils = new DataMaskingUtils({
  enabled: true,
  enableDefaults: {
    email: true,
    phone: true,
    password: true,
    postcode: true
  },
  rules: [
    {
      name: 'name',
      type: 'Key',
      matchValue: 'name',
      replaceWith: '***********'
    }
  ]
})

// console.log(dataMaskingUtils.getConfig())

describe('DataMaskingUtils', () => {
  describe('cleanData()', () => {
    it('should be a function', () => {
      expect(dataMaskingUtils.cleanseData).toBeInstanceOf(Function)
    })

    describe('By default', () => {
      // it('Should not mask data', () => {
      //   //
      // })
    })

    describe('Email addresses', () => {
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

    it('Should correctly mask phone numbers', () => {
      const originalData = {
        profile: {
          email: 'martingegan@gmail.com',
          phone: '07901980696',
          homePhone: '01234567890',
          postcode: 'GU2 9GS'
        },
        nestedProfile: {
          phones: ['07777015210', '01234567890', '+44 07777 015210', '+44 01234 567890']
        }
      }
      const cleanedData = dataMaskingUtils.cleanseData(originalData)
      // console.log(cleanedData)
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
      expect(JSON.stringify(cleanedData)).not.toContain('Joe Bloggs')
    })
  })
})

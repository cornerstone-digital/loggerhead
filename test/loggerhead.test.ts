import Loggerhead from '../src/loggerhead'

/**
 * Dummy test
 */
describe('Dummy test', () => {
  it('works if true is truthy', () => {
    expect(true).toBeTruthy()
  })

  it('DummyClass is instantiable', () => {
    expect(new Loggerhead()).toBeInstanceOf(Loggerhead)
  })
})

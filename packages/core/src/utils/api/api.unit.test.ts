/**
 * @jest-environment jsdom
 */
import 'babel-polyfill'

const id = '1234'

describe('API', () => {
  beforeEach(async () => {
    jest.resetModules()
    jest.resetAllMocks()
  })

  it('should set the exposed API method to the imported API method', async function () {
    const { Api } = await import('./api')
    const { initializeFeatures } = await import('../features/initialize')
    const { Features } = await import('../features/features')
    const { Aggregator } = await import('../../../../../modules/common/aggregate/aggregator')
    jest.mock('../../../../../modules/features/js-errors/aggregate', () => {
      return {
        Aggregate: jest.fn().mockImplementation(() => {
          return { storeError: jest.fn() }
        })
      }
    })
    const spy = jest.spyOn(console, 'warn').mockImplementation()
    const api = new Api(id)
    await initializeFeatures('1234', api, new Aggregator({ agentIdentifier: id }), new Features())
    expect(api.importedMethods.storeError).not.toEqual(null)
    api.noticeError('test')
    expect(spy).not.toHaveBeenCalled()
  })

  it('should warn if feature is disabled', async function () {
    const { Api } = await import('./api')
    const api = new Api(id)
    api.importedMethods.storeError = null
    const spy = jest.spyOn(console, 'warn').mockImplementation()
    api.noticeError('test')
    expect(spy).toHaveBeenCalled()
  })

  it('should warn if error is invalid', async function () {
    const { Api } = await import('./api')
    const api = new Api(id)
    api.importedMethods.storeError = jest.fn()
    const spy = jest.spyOn(console, 'warn').mockImplementation()
    // @ts-expect-error
    api.noticeError(1)
    expect(spy).toHaveBeenCalled()
    expect(api.importedMethods.storeError).not.toHaveBeenCalled()
  })

  it('should not warn  if initialized, not disabled, and has valid error', async function () {
    const { Api } = await import('./api')
    const api = new Api(id)
    api.importedMethods.storeError = jest.fn()
    const spy = jest.spyOn(console, 'warn').mockImplementation()
    api.noticeError(new Error("test"))
    expect(spy).not.toHaveBeenCalled()
    expect(api.importedMethods.storeError).toHaveBeenCalled()
  })

  it('should pass Error Object and custom attr args successfully to jsErrors.storeError', async function () {
    const { Api } = await import('./api')
    const api = new Api(id)
    const mockFn = jest.fn()
    api.importedMethods.storeError = mockFn
    const err = new Error("test")
    const customAttr = { test: 1 }
    api.noticeError(err, customAttr)
    const { 0: errArg, 3: customAttrArg } = mockFn.mock.calls[0]
    expect(errArg).toEqual(err)
    expect(customAttrArg).toEqual(customAttr)
  })

  it('should convert string to Error() and pass custom attr args successfully to jsErrors.storeError', async function () {
    const { Api } = await import('./api')
    const api = new Api(id)
    const mockFn = jest.fn()
    api.importedMethods.storeError = mockFn
    const err = "test"
    const customAttr = { test: 1 }
    api.noticeError(err, customAttr)
    const { 0: errArg, 3: customAttrArg } = mockFn.mock.calls[0]
    expect(errArg).toEqual(new Error(err))
    expect(customAttrArg).toEqual(customAttr)
  })

  it('should not pass invalid error args to jsErrors.storeError', async function () {
    const { Api } = await import('./api')
    const api = new Api(id)
    const mockFn = jest.fn()
    api.importedMethods.storeError = mockFn

    const invalidErrors = [1234, { test: 1234 }, [1234], true, false, new Set([1234]), null, undefined]
    const customAttributes = { test: 1 }
    invalidErrors.forEach((err) => {
      // @ts-expect-error
      api.noticeError(err, customAttributes)
      expect(mockFn).not.toHaveBeenCalled()

    })
  })
})

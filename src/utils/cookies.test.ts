import { getCookieString } from './cookies'

const key = 'jest_cookie'
const value = 'value'

describe('getCookieString', () => {
  it('handles a basic cookie', () => {
    expect(getCookieString({ [key]: value })).toBe(`${key}=${value}`)
  })

  it('handles string parameters', () => {
    expect(
      getCookieString({
        [key]: value,
        foo: 'bar',
      })
    ).toBe(`${key}=${value}; foo=bar`)
  })

  it('handles boolean parameters', () => {
    expect(
      getCookieString({
        [key]: value,
        foo: 'bar',
        HttpOnly: true,
      })
    ).toBe(`${key}=${value}; foo=bar; HttpOnly`)
  })

  it('handles false boolean parameters', () => {
    expect(
      getCookieString({
        [key]: value,
        foo: 'bar',
        HttpOnly: false,
      })
    ).toBe(`${key}=${value}; foo=bar`)
  })
})

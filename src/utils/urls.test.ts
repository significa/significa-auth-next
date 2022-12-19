import { sanitizeUrl } from './urls'

describe('sanitizeUrls', () => {
  it('does not remove leading slashes', () => {
    expect(sanitizeUrl('/hello/world')).toBe('/hello/world')
  })

  it('removes trailing slashes', () => {
    expect(sanitizeUrl('/hello/world/')).toBe('/hello/world')
  })

  it('removes double slashes', () => {
    expect(sanitizeUrl('/hello//world/')).toBe('/hello/world')
  })

  it('removes multiple slashes', () => {
    expect(sanitizeUrl('/hello/////world/')).toBe('/hello/world')
  })

  it('removes multiple slashes, multiple times', () => {
    expect(sanitizeUrl('/hello////world////')).toBe('/hello/world')
  })
})

import { getDateDistance } from './date'

describe('getDateDistance', () => {
  beforeEach(() => {
    jest.useFakeTimers().setSystemTime(new Date('2022-01-01T20:00:00'))
  })

  afterEach(() => {
    jest.useRealTimers()
  })

  it('returns 0 for same date', () => {
    expect(getDateDistance(new Date('2022-01-01T20:00:00'))).toBe(0)
  })

  it('returns future time in positive seconds', () => {
    expect(getDateDistance(new Date('2022-01-01T20:00:30'))).toBe(30)
  })

  it('returns past time in negative seconds', () => {
    expect(getDateDistance(new Date('2022-01-01T19:45:00'))).toBe(15 * 60 * -1)
  })
})

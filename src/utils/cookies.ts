export const getCookieString = (
  cookie: Record<string, string | boolean> = {}
) => {
  return Object.entries(cookie)
    .map(([key, value]) => {
      if (typeof value === 'boolean') {
        return value === true ? key : ''
      }

      return `${key}=${value}`
    })
    .filter(Boolean)
    .join('; ')
}

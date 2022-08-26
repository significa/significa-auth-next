export const sanitizeUrl = (url: string) => {
  // remove consecutive slashes and trailing slashes
  return url.replace(/\/+/g, '/').replace(/\/+$/, '')
}

export type ClientCookiesConfig = {
  accessTokenKey: string
  sessionIndicatorKey: string
}

export class ClientCookies {
  private accessTokenKey: string
  private sessionIndicatorKey: string

  constructor(config: ClientCookiesConfig) {
    this.accessTokenKey = config.accessTokenKey
    this.sessionIndicatorKey = config.sessionIndicatorKey
  }

  private buildCookie(key: string, value: string, expires?: number) {
    let cookie = `${key}=${value}`

    if (expires) {
      cookie += `; expires=${new Date(Date.now() + expires).toUTCString()}`
    }

    return cookie
  }

  public setCookie(key: string, value: string, expires?: number) {
    if (typeof document !== 'undefined') {
      document.cookie = this.buildCookie(key, value, expires)
    }
  }

  public getCookie(key: string) {
    if (typeof document !== 'undefined') {
      for (const cookie of document.cookie.split(';')) {
        const [cookieKey, value] = cookie.split('=')

        if (cookieKey.trim().toLowerCase() === key.trim().toLowerCase()) {
          return value
        }
      }

      return null
    }

    return null
  }

  public clearCookie(key: string) {
    this.setCookie(key, '', -1)
  }

  // Auth related methods
  public getAccessToken = () => {
    return this.getCookie(this.accessTokenKey)
  }

  public getSessionIndicator = () => {
    return this.getCookie(this.sessionIndicatorKey)
  }

  public clearAccessToken = () => {
    return this.clearCookie(this.accessTokenKey)
  }

  public clearSessionIndicator = () => {
    return this.clearCookie(this.sessionIndicatorKey)
  }
}

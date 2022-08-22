import { ClientCookies } from './client'
import { DEFAULTS } from './defaults'
import { PagesRestrictions } from './pages'
import { ServerAuth, ServerAuthConfig } from './server'

type AuthConfig = {
  /* The access token cookie name. */
  accessTokenKey?: string
  /* The refresh token cookie name. */
  refreshTokenKey?: string
  /* 
  Given the refresh token is http-only, we need a way for the browser to know if we have a session.
  We also use this cookie to save the access token expiration date so the client can refresh pro-actively.
  */
  sessionIndicatorKey?: string
  // Server
  serverHandlers: ServerAuthConfig['handlers']
}

export class Auth {
  public keys: {
    accessTokenKey: string
    refreshTokenKey: string
    sessionIndicatorKey: string
  }

  public server: ServerAuth
  public client: ClientCookies
  public restrictions: PagesRestrictions

  constructor(config: AuthConfig) {
    this.keys = {
      accessTokenKey: config.accessTokenKey || DEFAULTS.ACCESS_TOKEN_KEY,
      refreshTokenKey: config.refreshTokenKey || DEFAULTS.REFRESH_TOKEN_KEY,
      sessionIndicatorKey:
        config.sessionIndicatorKey || DEFAULTS.SESSION_INDICATOR_KEY,
    }

    this.server = new ServerAuth({
      accessTokenKey: this.keys.accessTokenKey,
      refreshTokenKey: this.keys.refreshTokenKey,
      sessionIndicatorKey: this.keys.sessionIndicatorKey,
      handlers: config.serverHandlers,
    })

    this.client = new ClientCookies({
      accessTokenKey: this.keys.accessTokenKey,
      sessionIndicatorKey: this.keys.sessionIndicatorKey,
    })

    this.restrictions = new PagesRestrictions({
      accessTokenKey: this.keys.accessTokenKey,
      refreshTokenKey: this.keys.refreshTokenKey,
      handleRefresh: this.server.refreshSession,
    })
  }
}

import { ServerResponse } from 'http'

import { NextApiRequest, NextApiResponse } from 'next'

import { getCookieString } from './utils/cookies'

const PATHS = {
  login: '/login',
  refresh: '/refresh',
  logout: '/logout',
}

export type SessionPayload = {
  accessToken: string
  expires: number
  refreshToken: string
}

export type AuthServerHandlers = {
  basePath?: string
  login: {
    fetch: (email: string, password: string) => Promise<Response>
    parseResponse: (res: Response) => Promise<SessionPayload>
  }
  refresh: {
    fetch: (refreshToken: string) => Promise<Response>
    parseResponse: (res: Response) => Promise<SessionPayload>
  }
  logout: {
    fetch: (refreshToken: string) => Promise<Response>
  }
}

export type ServerAuthConfig = {
  /* The access token cookie name. */
  accessTokenKey: string
  /* The refresh token cookie name. */
  refreshTokenKey: string
  /* 
  Given the refresh token is http-only, we need a way for the browser to know if we have a session.
  We also use this cookie to save the access token expiration date so the client can refresh pro-actively.
  */
  sessionIndicatorKey: string
  handlers: AuthServerHandlers
}

export class ServerAuth {
  private accessTokenKey: string
  private refreshTokenKey: string
  private sessionIndicatorKey: string

  private handlers: ServerAuthConfig['handlers']
  private handlersBasePath: string

  constructor(config: ServerAuthConfig) {
    this.accessTokenKey = config.accessTokenKey
    this.refreshTokenKey = config.refreshTokenKey
    this.sessionIndicatorKey = config.sessionIndicatorKey
    this.handlers = config.handlers
    this.handlersBasePath = this.handlers.basePath || '/api/auth'

    // context is important
    this.handler = this.handler.bind(this)
  }

  /**
   * Builds the cookie string
   */
  private buildCookie = (
    key: string,
    value: string,
    cookie: Record<string, string | boolean> = {}
  ) => {
    return getCookieString({
      [key]: value,
      Path: '/',
      Secure: true,
      ...cookie,
    })
  }

  /**
   * Given a session payload, sets the cookies headers on the ServerResponse
   */
  private setSessionCookies = (
    res: ServerResponse,
    { accessToken, expires, refreshToken }: SessionPayload
  ) => {
    res.setHeader('Set-Cookie', [
      this.buildCookie(this.accessTokenKey, accessToken, {
        Expires: new Date(Date.now() + expires).toUTCString(),
      }),
      this.buildCookie(this.refreshTokenKey, refreshToken, { HttpOnly: true }),
      this.buildCookie(
        this.sessionIndicatorKey,
        new Date(Date.now() + expires).toUTCString()
      ),
    ])
  }

  /**
   * Clears the cookies on the ServerResponse.
   */
  private clearSessionCookies = (res: ServerResponse) => {
    res.setHeader('Set-Cookie', [
      this.buildCookie(this.accessTokenKey, '', {
        Expires: new Date(Date.now() - 1).toUTCString(),
      }),
      this.buildCookie(this.refreshTokenKey, '', {
        HttpOnly: true,
        Expires: new Date(Date.now() - 1).toUTCString(),
      }),
      this.buildCookie(this.sessionIndicatorKey, '', {
        Expires: new Date(Date.now() - 1).toUTCString(),
      }),
    ])
    res.setHeader('Clear-Site-Data', ['"cookies"'])
  }

  public startSession = async (
    res: ServerResponse,
    email: string,
    password: string
  ) => {
    const response = await this.handlers.login.fetch(email, password)

    if (!response.ok) throw new Error()

    const data = await this.handlers.login.parseResponse(response)

    if (!data.accessToken || !data.expires || !data.refreshToken) {
      throw new Error()
    }

    // set cookies
    this.setSessionCookies(res, data)
  }

  /**
   * Uses the provided refresh token to get a new session.
   */
  public refreshSession = async (res: ServerResponse, refreshToken: string) => {
    const response = await this.handlers.refresh.fetch(refreshToken)

    if (!response.ok) {
      throw new Error('Failed to refresh token')
    }

    const data = await this.handlers.refresh.parseResponse(response)

    if (!data.accessToken || !data.refreshToken || !data.expires) {
      throw new Error(
        'parsed refresh data needs to contain `accessToken`, `refreshToken` and `expires`'
      )
    }

    this.setSessionCookies(res, data)

    return data
  }

  /**
   * This method is meant to be the default export of a dynamic Next's api route (e.g.: pages/api/auth/[path].ts)
   * It will handle the login, refresh and logout requests.
   */
  async handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.url) {
      /*
       * Starting sessions (POST)
       */
      case `${this.handlersBasePath}${PATHS.login}`: {
        const { email, password } = req.body

        if (req.method !== 'POST' || !email || !password) {
          res.status(400).json({ message: 'Wrong payload' })
          return
        }

        try {
          // Go to backend and get a new session
          const data = await this.startSession(res, email, password)

          return res.status(200).json(data)
        } catch (error) {
          return res.status(401).json({ message: 'Not authorized' })
        }
      }

      /*
       * Refreshing sessions (GET)
       */
      case `${this.handlersBasePath}${PATHS.refresh}`: {
        if (req.method !== 'GET') {
          res.status(400).json({ message: 'Invalid request' })
          return
        }

        try {
          const refreshToken = req.cookies[this.refreshTokenKey]

          if (!refreshToken) {
            throw new Error()
          }

          const data = await this.refreshSession(res, refreshToken)

          return res.status(200).json(data)
        } catch (error) {
          this.clearSessionCookies(res)
          return res.status(401).json({ message: 'Not authorized' })
        }
      }

      /*
       * Ending sessions (GET)
       */
      case `${this.handlersBasePath}${PATHS.logout}`: {
        if (req.method !== 'GET') {
          res.status(400).json({ message: 'Invalid request' })
          return
        }

        try {
          const refreshToken = req.cookies[this.refreshTokenKey]

          if (!refreshToken) {
            this.clearSessionCookies(res)

            throw new Error()
          }

          const response = await this.handlers.logout.fetch(refreshToken)

          // Failed to refresh
          if (!response.ok) throw new Error()

          this.clearSessionCookies(res)

          return res.status(200).json({ message: 'OK' })
        } catch (error) {
          this.clearSessionCookies(res)
          return res.status(401).json({ message: 'Not authorized' })
        }
      }

      /*
       * 404
       */
      default:
        return res.status(404).json({ message: 'Not found' })
    }
  }

  get paths() {
    return {
      login: `${this.handlersBasePath}${PATHS.login}`,
      refresh: `${this.handlersBasePath}${PATHS.refresh}`,
      logout: `${this.handlersBasePath}${PATHS.logout}`,
    }
  }
}

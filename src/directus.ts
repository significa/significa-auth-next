import { AuthServerHandlers } from './server'
import { sanitizeUrl } from './utils/urls'

export const createDirectusHandlers = (config: {
  /* The directus instance URL. */
  url: string
  /* The api handler basePath. e.g.: /api/auth/ */
  basePath?: string
}): AuthServerHandlers => {
  return {
    basePath: config.basePath,
    login: {
      fetch: (email, password) => {
        return fetch(sanitizeUrl(`${config.url}/auth/login`), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email,
            password,
          }),
        })
      },
      parseResponse: async (res) => {
        const { data } = await res.json()

        return {
          accessToken: data.access_token,
          expires: data.expires,
          refreshToken: data.refresh_token,
        }
      },
    },
    refresh: {
      fetch: async (refreshToken: string) => {
        return fetch(sanitizeUrl(`${config.url}/auth/refresh`), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        })
      },
      parseResponse: async (res) => {
        const { data } = await res.json()

        return {
          accessToken: data.access_token,
          expires: data.expires,
          refreshToken: data.refresh_token,
        }
      },
    },
    logout: {
      fetch: async (refreshToken: string) => {
        return fetch(sanitizeUrl(`${config.url}/auth/logout`), {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        })
      },
    },
  }
}

# Significa's auth methods to handle JWT sessions on NextJS projects

This is work in progress and only suitable for internal use.

## Description

This package solves JWT-based authentication by saving the refresh token in an http-only cookie (accessible only server-side) and the access-token + a session indicator with the expiration date in client-acessible cookies.

- server-side api routes that handles all session cookies
- server-side route restrictions
- server-side token refresh
- client-side token refresh (interval + window focus)
- client-side access token access (e.g.: for client-side API calls)

## Using the package

1. Generate a new github PAT (Classic Personal Access Token).
   Grant `read:packages` _Download packages from GitHub Package Registry_.

2. Run `npm login --scope=@significa --registry=https://npm.pkg.github.com`.
   In the interactive CLI set your GitHub handle as the username and the newly generated PAT as the password (email can be anything).

3. `npm install @significa/auth-next`

More info: [Working with the GitHub npm registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry).

## Configuration

Create a `lib/auth.ts` file to create your auth's config.

This package exposes a main `Auth` class that should be initialized with your project's configuration:

```tsx
// lib/auth.ts

import { Auth } from '@significa/auth-next'

import { API_URL } from 'common/constants'

export const auth = new Auth({
  accessTokenKey: 'project_token',
  sessionIndicatorKey: 'project_session',
  refreshTokenKey: 'project_refresh_token',
  /* configuration for the handler in Next's API Routes */
  serverHandlers: {
    login: {
      fetch: (email, password) => {
        return fetch(`${API_URL}/auth/login`, {
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
        return fetch(`${API_URL}/auth/refresh`, {
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
        return fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        })
      },
    },
  },
})
```

If you're using [Directus](https://directus.io/), you can use `createDirectusHandlers` instead:

```tsx
// lib/auth.ts

import { Auth, createDirectusHandlers } from '@significa/auth-next'

import { API_URL } from 'common/constants'

export const auth = new Auth({
  accessTokenKey: 'project_token',
  sessionIndicatorKey: 'project_session',
  refreshTokenKey: 'project_refresh_token',
  serverHandlers: createDirectusHandlers({
    url: API_URL,
  }),
})
```

Finally, you can create some aliases for page restrictions:

```tsx
// still in lib/auth.ts

export const withRestriction = auth.restrictions.withRestriction
export const withSessionRefresh = auth.restrictions.withSessionRefresh
export const withGuestRestriction = withRestriction.bind(null, (isAuthed) =>
  isAuthed ? '/app' : false
)
export const withAuthRestriction = withRestriction.bind(null, (isAuthed) =>
  isAuthed ? false : '/login'
)
```

## Use

### 1. Create API Routes

Create a `pages/api/auth/[path].ts` file.

_If you passed `basePath` in your `serverHandlers` config, make sure you create the file in the appropriate path_

```ts
import { auth } from 'lib/auth'

export default auth.server.handler
```

### 2. Login / Logout

- To login, just do a POST request to `auth.server.paths.login`.
- To logout, do a GET request to `auth.server.paths.logout`.

#### Example `useLogin` and `useLogout` hooks

You can create some hooks to centralize all the login/logout logic:

```tsx
// useLogin.tsx

import { useRouter } from 'next/router'
import { useState } from 'react'

import { auth } from 'lib/auth'

export const useLogin = ({
  onSuccess,
  onError,
}: {
  onSuccess?: () => void
  onError?: () => void
} = {}) => {
  const { push, query } = useRouter()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  const login = async ({
    email,
    password,
  }: {
    email: string
    password: string
  }) => {
    setLoading(true)

    try {
      const res = await fetch(auth.server.paths.login, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) throw new Error()

      if (typeof onSuccess === 'function') {
        onSuccess()
      } else {
        // push to app by default
        push(typeof query.returnTo === 'string' ? query.returnTo : '/app')
      }
    } catch (error) {
      setError(true)
      onError?.()
    } finally {
      setLoading(false)
    }
  }

  const resetError = () => {
    if (error) setError(false)
  }

  return { login, loading, error, resetError }
}
```

```tsx
// useLogout.tsx

import { useRouter } from 'next/router'
import { useState } from 'react'

import { auth } from 'lib/auth'

export const useLogout = () => {
  const { push } = useRouter()

  const [loading, setLoading] = useState(false)

  const logout = async () => {
    setLoading(true)

    try {
      const res = await fetch(auth.server.paths.logout)

      if (!res.ok) throw new Error()
    } catch (error) {
      // at least clear client-side cookies
      auth.client.clearAccessToken()
      auth.client.clearSessionIndicator()
    } finally {
      // redirect anyway
      push('/')
      setLoading(false)
    }
  }

  return { logout, loading }
}
```

### 3. Page restrictions / Session refresh

Finally, you can use the aliases in 'lib/auth' to lock routes:

```tsx
// pages/app/index.tsx
import { withAuthRestriction } from 'lib/auth'

const AppHomepage = () => <div>Hello from App</div>

export const getServerSideProps = withAuthRestriction()

export default AppHomepage
```

`withRestriction` already refreshes the session if necessary but, if you need, you can trigger a session refresh server-side by using `withSessionRefresh`:

```tsx
// pages/index.tsx
import { withSessionRefresh } from 'lib/auth'
...

export const getServerSideProps = withSessionRefresh()
```

## `useRefreshSession`

This package also exports a `useRefreshSession` hook that can be used to make client-side refreshes at a certain interval or whenever the window gains focus:

```tsx
// _app.tsx

import { useRefreshSession, getDateDistance } from '@significa/auth-next'

import { auth } from 'lib/auth'

function MyApp({ Component, pageProps }: AppProps) {
  useRefreshSession({
    refreshPath: auth.server.paths.refresh,
    shouldRefresh: () => {
      const expiryDate = auth.client.getSessionIndicator()

      if (!expiryDate) return false

      return getDateDistance(new Date(expiryDate)) <= 30
    },
    onRefresh: () => {
      queryClient.invalidateQueries(useMeQuery.getKey())
    },
  })
  })

  return ...
}
```

import { useEffect, useCallback } from 'react'

import { useInterval } from './utils/useInterval'

type RefreshManagerConfig = {
  getSessionExpiryDate: () => string | null
  refreshPath: string
  shouldRefresh?: (sessionExpirationDate: Date) => boolean
  interval?: number | null
}

const defaultShouldRefresh = (sessionExpirationDate: Date) => {
  const expiryDate = sessionExpirationDate.getTime()
  const nowMinus30Seconds = new Date().getTime() + 30000

  return expiryDate < nowMinus30Seconds
}

export const useRefreshSession = ({
  getSessionExpiryDate,
  refreshPath,
  shouldRefresh = defaultShouldRefresh,
  interval = 30000,
}: RefreshManagerConfig) => {
  const checkSession = useCallback(() => {
    const sessionIndicator = getSessionExpiryDate()

    if (!sessionIndicator) return false

    return shouldRefresh(new Date(sessionIndicator))
  }, [getSessionExpiryDate, shouldRefresh])

  const refreshToken = useCallback(async () => {
    if (!checkSession()) return

    await fetch(refreshPath, {
      credentials: 'include',
    })
  }, [refreshPath, checkSession])

  useEffect(
    function refresh() {
      window.addEventListener('focus', refreshToken)

      return () => {
        window.removeEventListener('focus', refreshToken)
      }
    },
    [refreshToken]
  )

  useInterval(refreshToken, interval)
}

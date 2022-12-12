import { useEffect, useCallback } from 'react'

import { useInterval } from './utils/useInterval'

type RefreshManagerConfig = {
  refreshPath: string
  shouldRefresh: () => boolean
  interval?: number | null
}

export const isLessThan30Seconds = (date: Date | null) => {
  if (!date || !(date instanceof Date)) return false

  return new Date().getTime() > date.getTime() - 30000
}

export const useRefreshSession = ({
  refreshPath,
  shouldRefresh,
  interval = 30000,
}: RefreshManagerConfig) => {
  const refreshToken = useCallback(async () => {
    if (shouldRefresh()) await fetch(refreshPath, { credentials: 'include' })
  }, [refreshPath, shouldRefresh])

  useEffect(
    function refresh() {
      window.addEventListener('visibilitychange', refreshToken, false)
      window.addEventListener('focus', refreshToken, false)

      return () => {
        window.removeEventListener('visibilitychange', refreshToken)
        window.removeEventListener('focus', refreshToken)
      }
    },
    [refreshToken]
  )

  useInterval(refreshToken, interval)
}

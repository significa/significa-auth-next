import { useEffect, useCallback } from 'react'

import { useInterval } from './utils/useInterval'
import { useStableCallback } from './utils/useStableCallback'

type RefreshManagerConfig = {
  refreshPath: string
  shouldRefresh: () => boolean
  onRefresh?: () => void
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
  onRefresh = () => {
    // noop
  },
}: RefreshManagerConfig) => {
  const stableOnRefresh = useStableCallback(onRefresh)

  const refreshToken = useCallback(async () => {
    try {
      if (shouldRefresh()) {
        const res = await fetch(refreshPath, { credentials: 'include' })

        res.ok && stableOnRefresh?.()
      }
    } catch (error) {
      // noop. no refresh
    }
  }, [refreshPath, shouldRefresh, stableOnRefresh])

  useEffect(
    function refresh() {
      window.addEventListener('visibilitychange', refreshToken, false)
      window.addEventListener('focus', refreshToken, false)

      refreshToken()

      return () => {
        window.removeEventListener('visibilitychange', refreshToken)
        window.removeEventListener('focus', refreshToken)
      }
    },
    [refreshToken]
  )

  useInterval(refreshToken, interval)
}

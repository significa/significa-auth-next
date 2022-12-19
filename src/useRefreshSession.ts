import { useEffect, useCallback, useRef } from 'react'

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

const REFRESH_GRACE_PERIOD_SECONDS = 10

export const useRefreshSession = ({
  refreshPath,
  shouldRefresh,
  interval = 30000,
  onRefresh = () => {
    // noop
  },
}: RefreshManagerConfig) => {
  const stableOnRefresh = useStableCallback(onRefresh)
  const lastRefresh = useRef<number | null>(null)

  const refreshToken = useCallback(async () => {
    try {
      if (
        lastRefresh.current &&
        lastRefresh.current >= Date.now() - REFRESH_GRACE_PERIOD_SECONDS * 1000
      ) {
        throw new Error(
          `Already refreshed session within the last ${REFRESH_GRACE_PERIOD_SECONDS} seconds`
        )
      }

      lastRefresh.current = Date.now()

      if (shouldRefresh()) {
        const res = await fetch(refreshPath, { credentials: 'include' })

        res.ok && stableOnRefresh?.()
      }
    } catch (error) {
      // TODO: logger
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

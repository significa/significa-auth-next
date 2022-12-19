import { useEffect, useCallback, useRef } from 'react'

import { getDateDistance } from './utils/date'
import { useInterval } from './utils/useInterval'
import { useStableCallback } from './utils/useStableCallback'

type RefreshManagerConfig = {
  refreshPath: string
  shouldRefresh: () => boolean
  onRefresh?: () => void
  interval?: number | null
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
  const lastRefresh = useRef<Date | null>(null)

  const refreshToken = useCallback(async () => {
    try {
      if (shouldRefresh()) {
        if (
          lastRefresh.current &&
          getDateDistance(lastRefresh.current) >= -REFRESH_GRACE_PERIOD_SECONDS
        ) {
          throw new Error(
            `Already refreshed session within the last ${REFRESH_GRACE_PERIOD_SECONDS} seconds`
          )
        }

        lastRefresh.current = new Date()

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

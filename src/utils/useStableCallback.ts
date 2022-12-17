import { useCallback, useEffect, useRef } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useStableCallback<Args extends any[], T>(
  callback: (...args: Args) => T
) {
  const callbackContainer = useRef(callback)
  useEffect(() => {
    callbackContainer.current = callback
  })
  return useCallback(
    (...args: Args) => callbackContainer.current(...args),
    [callbackContainer]
  )
}

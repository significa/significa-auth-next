import { useRef } from 'react';
import { useIsomorphicLayoutEffect } from './useIsomorphicLayoutEffect';
export function useInterval(callback, delay) {
    var savedCallback = useRef(callback);
    useIsomorphicLayoutEffect(function () {
        savedCallback.current = callback;
    }, [callback]);
    useIsomorphicLayoutEffect(function () {
        if (!delay && delay !== 0)
            return;
        var id = setInterval(function () { return savedCallback.current(); }, delay);
        return function () { return clearInterval(id); };
    }, [delay]);
}

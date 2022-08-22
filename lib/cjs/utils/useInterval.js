"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useInterval = void 0;
var react_1 = require("react");
var useIsomorphicLayoutEffect_1 = require("./useIsomorphicLayoutEffect");
function useInterval(callback, delay) {
    var savedCallback = (0, react_1.useRef)(callback);
    (0, useIsomorphicLayoutEffect_1.useIsomorphicLayoutEffect)(function () {
        savedCallback.current = callback;
    }, [callback]);
    (0, useIsomorphicLayoutEffect_1.useIsomorphicLayoutEffect)(function () {
        if (!delay && delay !== 0)
            return;
        var id = setInterval(function () { return savedCallback.current(); }, delay);
        return function () { return clearInterval(id); };
    }, [delay]);
}
exports.useInterval = useInterval;

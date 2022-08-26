"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeUrl = void 0;
var sanitizeUrl = function (url) {
    // remove consecutive slashes and trailing slashes
    return url.replace(/\/+/g, '/').replace(/\/+$/, '');
};
exports.sanitizeUrl = sanitizeUrl;

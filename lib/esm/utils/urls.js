export var sanitizeUrl = function (url) {
    // remove consecutive slashes and trailing slashes
    return url.replace(/\/+/g, '/').replace(/\/+$/, '');
};

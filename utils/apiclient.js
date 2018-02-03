const _api = {
    //host: 'http://www.75cents.cn:10010'
    host: 'http://localhost:28692'
}

const Request = function (method, action, param, callback) {
    var apiUrl = _api.host + action;
    var contentType = 'application/x-www-form-urlencoded';
    wx.request({
        url: apiUrl,
        data: param,
        method: method.toUpperCase(),
        header: {
            'content-type': contentType
        },
        success: function (res) {
            callback && callback(res.data);
        }
    })
}

const ApiGet = function (action, param, callback) {
    return Request('GET', action, param, callback);
}

const ApiPost = function (action, param, callback) {
    return Request('POST', action, param, callback);
}

module.exports = {
    Request: Request,
    Get: ApiGet,
    Post: ApiPost
}

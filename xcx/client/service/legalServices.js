
const { get, post, postJson, putJson } = require('../utils/ajax.js')

module.exports = {
    /**
     * 法律服务详情
    */
    getById: params => get('/applets/user/service/details/' + params.id),
    /**
     * 法律服务列表
    */
    query: params => get(params.url, params),
}
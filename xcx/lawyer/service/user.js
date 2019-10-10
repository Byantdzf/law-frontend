
const { get, post, postJson, putJson } = require('../utils/ajax.js')

module.exports = {
    /**
     * 领取优惠券
    */
    couponAdd: params => postJson('/applets/user/coupon/add', params),

    /**
     * 提交问题
    */
    postVoice: params => putJson('/applets/user/consult/publish/1', params),
    postOneByOne: params => putJson('/applets/user/consult/publish/2', params),
    postLegalServices: params => putJson('/applets/user/consult/publish/3', params),
    postMandatoryLawyer: params => putJson('/applets/user/consult/publish/4', params),
    postTemplate: params => putJson('/applets/user/consult/publish/5', params),

    /**
     * 我的优惠券列表
    */
    couponList: params =>get('/applets/user/coupon/list/', params),
}
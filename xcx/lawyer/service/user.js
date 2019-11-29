
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

    /**
     * 我的
    */
    getUser: params => get('/applets/lawyer/my/myInfo', params),

    /**
     * 我的数据
    */
    getMyData: params => get('/applets/lawyer/my/myData', params),

    /**
     * 我的余额
    */
    getMyBalance: params => get('/applets/lawyer/my/myMoney', params),

    /**
     * 提现
    */
    withDraw: params => post('/applets/lawyer/pay/cashOut', params),
    /**
     * 用户反馈
    */
    userFeedback: params => post('/applets/user/feedback', params),
}
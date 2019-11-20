
const { get, post, postJson, putJson } = require('../utils/ajax.js')

module.exports = {
    /**
     * 领取优惠券
    */
    couponAdd: params => postJson('/applets/user/coupon/add', params),

    /**
     * 提交问题
    */
    // postVoice: params => putJson('/applets/user/consult/publish/1', params),          
    // postOneByOne: params => putJson('/applets/user/consult/publish/2', params),       
    // postLegalServices: params => putJson('/applets/user/consult/publish/3', params),  
    // postMandatoryLawyer: params => putJson('/applets/user/consult/publish/4', params),
    // postTemplate: params => putJson('/applets/user/consult/publish/5', params),

    postIssue: params => putJson('/applets/user/consult/publish/1', params),                // 咨询订单
    postLegals: params => putJson('/applets/user/consult/publish/2', params),               // 分块法律
    postMandatoryLawyer: params => putJson('/applets/user/consult/publish/3', params),      // 代理律师服务
    postTemplate: params => putJson('/applets/user/consult/publish/4', params),             // 法律文件购买

    /**
     * 我的优惠券列表
    */
    couponList: params =>get('/applets/user/coupon/list/', params),

    /**
     * 用户邀请律师-指定律师
    */
    orderModifyDispatchWayByUser: params =>get('/applets/user/order/modifyDispatchWayByUser', params),
}
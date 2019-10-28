
const { get, post, postJson, put } = require('../utils/ajax.js')

module.exports = {
  /**
   * 订单列表
  */
  orderList: params => get('/applets/lawyer/order/orderList', params),
  /**
   * 订单详情
  */
  orderDetails: orderId => get('/applets/lawyer/order/orderDetail', { orderId }),
  /**
   * 查询订单回复列表
  */
  orderMsglist: params => get('/applets/lawyer/msg/orderMsglist', params),
  /**
   * 查询用户评价
  */
  queryOrderScoreByOrderId: params => get('/applets/lawyer/orderScore/queryOrderScoreByOrderId', params),
  /**
   * 订单取消
  */
  orderCancel: id => put(`/applets/user/order/cancel/${id}`),
  /**
   * 订单追问
  */
  orderAskSecond: ({ id, content }) => post(`/applets/user/order/askSecond/${id}`, { content }),
  /**
   * 确认订单完成
  */
  orderConfirm: id => put(`/applets/user/order/confirm/${id}`),
  /**
   * 用户评价
  */
  orderEvaluate: params => {
    const { id } = params
    delete params.id
    return post(`/applets/user/order/evaluate/${id}`, params)
  },
  /**
   * 订单申诉
  */
  orderAppeal: params => {
    const { id } = params
    delete params.id
    return post(`/applets/user/order/appeal/${id}`, params)
  },
  /**
   * 订单支付
  */
  pay: params => get('/applets/lawyer/pay/getPrepayInfoByOrderNo', params),

  /**
   * 转发
  */
  orderForward: params => get(`/applets/lawyer/order/operateOrder`, params),
  // 关注
  orderFocused: function (businessId) {
    const params = {
      businessId,
      operateBusiness: 1,  // 操作对象1-订单 2-律师 3-文章 4-系统
      operateType: 4      // 1-阅读 2-转发 3-点赞 4-关注 10-取消阅读 20-取消转发 30-取消点赞 40-取消关注
    }          
    return get('/applets/lawyer/order/operateOrder', params)
  },

  // 取消关注
  orderCancelFocused: function (businessId) {
    const params = {
      businessId,
      operateBusiness: 1,  // 操作对象1-订单 2-律师 3-文章 4-系统
      operateType: 40      // 1-阅读 2-转发 3-点赞 4-关注 10-取消阅读 20-取消转发 30-取消点赞 40-取消关注
    }          
    return get('/applets/lawyer/order/operateOrder', params)
  },
  /**
   * 拒绝接单
  */
  orderRefuse: params => get(`/applets/lawyer/order/rejectOrder`, params),
  /**
   * 接单
  */
  orderReceive: params => get(`/applets/lawyer/order/acceptOrder`, params),
  /**
   * 律师回复
  */
  orderReply: params => postJson(`/applets/lawyer/order/orderReply`, params),
  /**
   * 律师订单回复-多个附件
  */
  orderReplyForManyAttachment: params => postJson(`/applets/lawyer/order/orderReplyForManyAttachment`, params),
}

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
  /**
   * 拒绝接单
  */
  orderRefuse: params => get(`/applets/lawyer/order/rejectOrder`, params),
  /**
   * 接单
  */
  orderReceive: params => put(`/applets/lawyer/order/acceptOrder`, params),
}
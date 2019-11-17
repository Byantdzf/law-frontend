import { get, post, del, put } from '@/utils/xhr.js'

const order = {
  namespaced: true,
  actions: {
    /* 订单 -- 详情
     * orderId
    */
    orderView: (context, params) => get(`/mng/order/orderDetail`, params),
    /* 订单 -- 修改派单规则
     * orderId
     * dispatchWay 1-自动派单（系统自动或用户指定） 2-人工派单（系统后台指定）
    */
    orderModifyDispatchWay: (context, params) => get(`/mng/order/modifyDispatchWay`, params),
    /* 订单 -- 暂停/继续订单
     * orderId
     * orderHealthyStatus 订单健康状态 1、暂停 2、正常
    */
    orderModifyHealthyStatus: (context, params) => get(`/mng/order/modifyOrderHealthyStatus`, params),
    /* 订单 -- 重新派单
     * orderId
    */
    orderReDispatchOrder: (context, params) => get(`/mng/order/reDispatchOrder`, params),
    /* 订单 -- 订单置顶
     * orderId
    */
    orderUpdateOrderToTop: (context, params) => get(`/mng/order/updateOrderToTop`, params),
    /* 订单 -- 设置为推荐
     * orderId
     * recommend  1-未推荐 2-推荐
    */
    orderUpdateOrderRecommend: (context, params) => get(`/mng/order/updateOrderRecommend`, params),
    /* 订单 -- 确认订单金额
     * orderId
     * fee  
    */
    orderComfirmOrderAmount: (context, params) => get(`/mng/order/comfirmOrderAmount`, params),
    /* 订单 -- 修改订单状态
     * orderId
     * orderStatus  10 待支付 20 待接单 30 已接单 40 完成确认 50 待评价 60 完成
    */
    orderUpdateOrderStatus: (context, params) => get(`/mng/order/updateOrderStatus`, params),
    /* 订单 -- 取消订单
     * orderId
    */
    orderCancel: (context, params) => get(`/mng/order/cancel`, params),

    /* 删除评论
     * orderScoreId
    */
    orderScoreDel: (context, params) => get(`/mng/orderScore/delOrderScore`, params),
    /* 隐藏评论
     * orderScoreId
    */
    orderScoreHide: (context, params) => get(`/mng/orderScore/hideOrderScore`, params),
    /* 评论置顶
     * orderScoreId
    */
    orderScoreToTop: (context, params) => get(`/mng/orderScore/toTopOrderScore`, params),

    // 派单规则 -- 添加
    orderRuleAdd: (context, params) => post(`/order/rule`, params),
    // 派单规则 -- 修改
    orderRuleUpdate: (context, params) => put(`/order/rule`, params),
    // 派单规则 -- 删除
    orderRuleDel: (context, ids) => del(`/order/rule/${ids}`),

  }
}
  
export default order

import { get } from '@/utils/xhr.js'

const data = {
  namespaced: true,
  actions: {
    // 首页交易数据统计
    summaryBusiness: (context, payload) => get('/mng/homePage/summaryBusiness', payload),
    // 订单信息显示 - 汇总
    summaryOrder: (context, payload) => get('/mng/homePage/summaryOrder', payload),
    // 订单信息显示 - 订单类型维度列表
    summaryOrderByOrderTypeAndOrderCategory: (context, payload) => get('/mng/homePage/summaryOrderByOrderTypeAndOrderCategory', payload),
    // 会员注册信息统计
    summaryMember: (context, payload) => get('/mng/homePage/summaryMember', payload),
    // 待办数据统计
    summaryNeedToDeal: (context, payload) => get('/mng/homePage/summaryNeedToDeal', payload),
  }
}
  
export default data

//  全局配置
module.exports = {
  tokenName: 'token',
  appName: '虎甲律师问答',
  PAGE_KEY: 'pageNo',
  SIZE_KEY: 'pageSize',
  // 订单类型
  orderType: {
    1: '咨询订单',
    2: '分块法律服务订单',
    3: '代理律师服务订单',
    4: '法律文件订单'
  },
  // 订单订单种类
  orderCategory: {
    11: '在线律师咨询',
    12: '指定律师咨询',
    21: '日常法律服务',
    22: '分块法律服务',
    31: '收费代理',
    32: '风险代理'
  },
  // 订单状态
  orderStatus: {
    5: '待接入',
    10: '待支付',
    20: '待接单',
    30: '已接单',
    40: '完成待确认',
    50: '待评价',
    60: '已完成',
    70: '已取消'
  },
  // 订单是否紧急
  orderEmergency: {
    0: '否',
    1: '是'
  },
  couponStatus: {
    0: '待使用',
    1: '已使用',
    2: '已过期'
  },
}
//  全局配置
module.exports = {
  tokenName: 'token',
  appName: '虎甲问答',
  PAGE_KEY: 'pageNo',
  SIZE_KEY: 'pageSize',
  // 订单类型
  orderType: {
    1: '咨询订单',
    2: '分块法律服务订单',
    3: '代理律师订单',
    4: '法律文件订单'
  },
  // 订单订单种类
  orderCategory: {
    11: '语音订单',
    12: '指定律师咨询',
    21: '日常法律服务',
    22: '分块法律服务',
    31: '收费代理',
    32: '纯风险代理'
  },
  orderStatus: {
    10: '待支付',
    20: '待接单',
    30: '已接单',
    40: '完成待确认',
    50: '待评价',
    60: '已完成',
    70: '已取消'
  },
  orderEmergency: {
    0: '否',
    1: '是'
  },
}
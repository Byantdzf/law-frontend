//  全局配置
module.exports = {
  tokenName: 'token',
  appName: '虎甲律师问答',
  PAGE_KEY: 'pageNo',
  SIZE_KEY: 'pageSize',
  orderType: {
    1: '咨询订单',
    2: '分块法律服务订单',
    3: '代理律师订单',
    4: '法律文件订单'
  },
  orderCategory: {
    11: '语音订单',
    12: '一对一咨询',
    21: '非诉讼法律服务',
    22: '诉讼法律服务',
    31: '收费委托',
    32: '纯风险委托'
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
  couponStatus: {
    0: '待使用',
    1: '已使用',
    2: '已过期'
  },
}
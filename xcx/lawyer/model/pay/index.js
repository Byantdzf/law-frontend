
const { get, post, postJson } = require('../../utils/ajax.js')

module.exports = {
  /**
   * 获取在线支付方式
   * @param[Number]  type   1 订单支付   2 充值
  */
  getMethods: params => post('/payment/methods', params),
  /**
   * 使用预付款支付
   * @param[String]  sn              支付流水
   * @param[String]  tradePassword   交易密码
  */
  balancePay: params => post('/payment/balance/pay', params),
  /**
   * 在线支付、充值提交
   * @param[Number]  type              1 订单支付   2 充值
   * @param[String]  orderId           支付订单号  type为1时使用
   * @param[Number]  paymentPluginId   支付方式ID
   * @param[Number]  amount            充值金额  type为2时使用
  */ 
  paymentSubmit: params => post('/payment/submit', params),
  /**
   * 订单支付
   * orderId          id
  */
  payment: params => post('/order/payment', params),
  /**
   * 创建订单
   * "companyName": "string", //发票公司名称
	 * "contentType": 1,       //1 商品明细  2 商品分类
	 * "isInvoice": true,       //是否开发票
   * "taxCode": "",       //税号
   * "memo": "string",         //留言
   * "method": "ONLINE",       //1 在线 2 线下 支付方式
   * "receiverId": 0,         //收货地址ID
   * "title": "string",  //发票抬头 电子发票
   * "shippingTime": 1  //配送时间
   * 收货地址，支付方式必填 
  */ 
  create: params => post('/order/create', params),
  /**
   * 订单再次购买
   * orderId          id
  */
  rebuild: params => post('/order/rebuild', params),
}
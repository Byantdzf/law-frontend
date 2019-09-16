
const { get, post, postJson } = require('../../utils/ajax.js')

module.exports = {
  /**
   * 订单列表查询
   * @param[Number]  page   页数
   * @param[Number]  rows   条数
   * @param[String]  keyword   
  */
  query: params => get('/api/order/query', params),
  /**
   * 订单创建  
  */
  create: params => postJson('/api/order/create', params),
  /**
   * 订单删除 
  */
  delete: params => post('/api/order/delete', params)
  
}
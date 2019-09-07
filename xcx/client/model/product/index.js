
const { get, post, postJson } = require('../../utils/ajax.js')

module.exports = {
  /**
   * 产品列表查询
   * @param[Number]  page   页数
   * @param[Number]  rows   条数
   * @param[String]  keyword   
  */
  query: params => get('/api/product/query', params),
  /**
   * 产品创建  
  */
  create: params => postJson('/api/product/create', params),
  /**
   * 产品删除 
  */
  delete: params => post('/api/product/delete', params)
  
}
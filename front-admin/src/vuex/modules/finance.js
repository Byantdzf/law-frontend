import { get, post, postJson } from '@/utils/xhr.js'

const tenant = {
  namespaced: true,
  actions: {
    // 交易数据统计
    statics: (context, payload) => get('/mng/financialManage/queryPlatFormSummaryInfo', payload),
  }
}
  
export default tenant

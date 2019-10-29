import { get } from '@/utils/xhr.js'

const data = {
  namespaced: true,
  actions: {
    // 商户成交数据（统计） -- 导出
    salesExportCount: (context, payload) => get('/salesCount/exportCount', payload),
    // 商户成交数据（详情） -- 导出
    salesExportDetail: (context, payload) => get('/salesCount/exportDetail', payload),

    // 同步数据
    syncOrdeData: (context, payload) => get('/salesCount/synchOrderDistStatusToPt', payload),
  }
}
  
export default data

import { get, postJson } from '@/utils/xhr.js'

const data = {
  namespaced: true,
  actions: {
    // 国家城市 -- kv
    queryTreeChina: () => get('ptDataCountryCity/queryTreeChina'),
    queryChinaId: () => get('ptDataCountryCity/queryChinaId'),
    queryTreeForeign: () => get('ptDataCountryCity/queryTreeForeign'),
    queryAreaBlurry: (context, payload) => get('ptDataCountryCity/queryBlurry', payload),
    // 国家城市 -- 添加
    countryCityAdd: (context, payload) => postJson('ptDataCountryCity/add', payload),
    // 国家城市 -- 修改
    countryCityUpdate: (context, payload) => postJson('ptDataCountryCity/update', payload),

    // 目的地 -- kv
    destKV: (context, payload) => get('ptDataDestination/queryListKv', payload),
    // 目的地 -- 添加
    destAdd: (context, payload) => postJson('ptDataDestination/add', payload),
    // 目的地 -- 修改
    destUpdate: (context, payload) => postJson('ptDataDestination/update', payload)
  }
}
  
export default data

import { get, post, postJson } from '@/utils/xhr.js'

const tenant = {
  namespaced: true,
  actions: {
    // 商户 -- 详情
    tenantView: (context, payload) => get('ptTenant/selectOne', payload),
    // 商户 -- kv
    tenantGetKV: (context, payload) => get('ptTenant/queryKvList', payload),
    // 商户 -- 添加
    tenantAdd: (context, payload) => postJson('ptTenant/add', payload),
    // 商户 -- 修改
    tenantUpdate: (context, payload) => postJson('ptTenant/update', payload),
    // 商户 -- 总部划分
    tenantDivideHq: (context, payload) => post('ptTenant/divideHq', payload),

    // 商户 -- 详情
    tenantLevelView: (context, payload) => get('ptTenantLevel/selectOne', payload),
    // 商户等级 -- 添加
    tenantLevelAdd: (context, payload) => postJson('ptTenantLevel/add', payload),
    // 商户等级 -- kv
    tenantLevelGetKV: () => get('ptTenantLevel/queryKvList'),
    // 商户等级 -- 修改
    tenantLevelUpdate: (context, payload) => postJson('ptTenantLevel/update', payload),

    tenantLevelSetDefault: (context, payload) => post('ptTenantLevel/setDefault', payload),
  }
}
  
export default tenant

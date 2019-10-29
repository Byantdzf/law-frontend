import { get, post, postJson } from '@/utils/xhr.js'

const user = {
  namespaced: true,
  actions: {
    // 平台用户 -- 添加
    userAdd: (context, payload) => postJson('/ptUser/add', payload),
    // 平台用户 -- 修改
    userUpdate: (context, payload) => postJson('/ptUser/update', payload),
    // 平台用户 -- 添加
    userDelete: (context, id) => post('/ptUser/delete', { id }),
    // 平台用户 -- 启用
    userEnable: (context, id) => post('/ptUser/enable', { id }),
    // 平台用户 -- 禁用
    userDisable: (context, id) => post('/ptUser/disable', { id }),
    // 平台用户 -- kv
    userGetKV: (context, payload) => get('/ptUser/queryKvList', payload),
    // 平台用户 -- 添加
    userAuthMenus: (context, payload) => post('/ptUser/authorization', payload)
  }
}
  
export default user

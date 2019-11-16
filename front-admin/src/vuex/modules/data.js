import { get } from '@/utils/xhr.js'

const data = {
  namespaced: true,
  actions: {
    // 角色 -- kv
    roleKV: (context, payload) => get('/role/kv', payload),
    // 律师 -- kv
    memberKV: (context, payload) => get('/member/kv', payload),
  }
}
  
export default data

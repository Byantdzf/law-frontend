import { get, post, put } from '@/utils/xhr.js'

const member = {
  namespaced: true,
  actions: {
    // 会员 -- 详情
    memberView: (context, id) => get(`/member/user/${id}`),
    // 会员 -- 修改状态
    memberUpdateStatus: (context, id) => put(`/member/user/${id}`),
    // 会员 -- 分配销售
    memberDivideSell: (context, payload) => post('/ptmember/divideSell', payload),
  }
}
  
export default member

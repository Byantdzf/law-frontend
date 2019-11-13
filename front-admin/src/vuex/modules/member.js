import { get, post, postJson } from '@/utils/xhr.js'

const member = {
  namespaced: true,
  actions: {
    // 会员 -- 详情
    memberView: (context, id) => get(`/member/user/${id}`),
    // 会员 -- 添加
    memberAdd: (context, payload) => postJson('ptmember/add', payload),
    // 会员 -- 修改
    memberUpdate: (context, payload) => postJson('ptmember/update', payload),
    // 会员 -- 总部划分
    memberDivideHq: (context, payload) => post('ptmember/divideHq', payload),
    // 会员 -- 分配销售
    memberDivideSell: (context, payload) => post('/ptmember/divideSell', payload),
  }
}
  
export default member

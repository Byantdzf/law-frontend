import { get, put, del, post } from '@/utils/xhr.js'

const message = {
  namespaced: true,
  actions: {
    // 咨询者会员 -- 详情
    addMessage: (context, params) => post(`/mng/message/add`, params),
    // getMemberlist: (context, params) => get(`/mng/message/queryMemberlist`, params)
  }
}
  
export default message

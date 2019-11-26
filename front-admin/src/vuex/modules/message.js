import { get, del, post } from '@/utils/xhr.js'

const message = {
  namespaced: true,
  actions: {
    // 咨询者会员 -- 详情
    addMessage: (context, params) => post(`/mng/message/add`, params),
    getMemberlist: (context, params) => get(`/mng/message/member/list`, params),
    removeMessage: (context, ids) => del(`/mng/message/delete/${ids}`),
    updateMessage: (context, params) => post(`/mng/message/update`, params),
    getMessageDetail: (context, id) => get(`/mng/message/details/${id}`)
  }
}
  
export default message

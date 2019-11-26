import { get, del, post } from '@/utils/xhr.js'

const message = {
  namespaced: true,
  actions: {
    // 咨询者会员 -- 详情
    addMessage: (context, params) => post(`/mng/message/add`, params, {contentType: 'application/json; charset=utf-8'}),
    getMemberlist: (context, params) => get(`/mng/message/member/list`, params),
    removeMessage: (context, ids) => del(`/mng/message/delete/${ids}`,{},{contentType: 'application/json; charset=utf-8'}),
    updateMessage: (context, params) => post(`/mng/message/update`, params,{contentType: 'application/json; charset=utf-8'}),
    getMessageDetail: (context, id) => get(`/mng/message/details/${id}`)
  }
}
  
export default message

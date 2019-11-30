import { get, put, del } from '@/utils/xhr.js'

const member = {
  namespaced: true,
  actions: {
    // 咨询者会员 -- 详情
    memberView: (context, id) => get(`/member/user/${id}`),
    // 咨询者会员 -- 修改状态
    memberUpdateStatus: (context, payload) => {
      return put(`/member/user/${payload.ids}`,payload.params)
    },
    memberDel: (context, ids ) => del(`/member/user/${ids}`),

    // 律师 -- 详情
    lawyerView: (context, id) => get(`/member/lawyer/pending/${id}`),
    // 律师 -- 修改状态
    lawyerUpdateStatus: (context, payload) => put(`/member/lawyer/${payload.ids}`,payload.params),
    // 审核律师 -- 详情
    lawyerAuditView: (context, id) => get(`/member/lawyer/audit/${id}`),
    // 审核律师
    lawyerAudit: (context, { id, ...rest }) => put(`/member/lawyer/audit/result/${id}`, { ...rest }),

    // 律师 -- 删除
    lawyerDel: (context, ids) => del(`/member/lawyer/${ids}`),
    userListexport: (context, params) => get(`/member/user/list/export`, params),

    getCouponDetail: (context, id) => get(`/pc/coupon/pool/${id}`)
  }
}
  
export default member

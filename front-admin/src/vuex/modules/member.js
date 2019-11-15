import { get, put } from '@/utils/xhr.js'

const member = {
  namespaced: true,
  actions: {
    // 咨询者会员 -- 详情
    memberView: (context, id) => get(`/member/user/${id}`),
    // 咨询者会员 -- 修改状态
    memberUpdateStatus: (context, id) => put(`/member/user/${id}`),

    // 律师 -- 详情
    lawyerView: (context, id) => get(`/member/lawyer/pending/${id}`),
    // 律师 -- 修改状态
    lawyerUpdateStatus: (context, id) => put(`/member/lawyer/pending/${id}`),
    // 审核律师 -- 详情
    lawyerAuditView: (context, id) => get(`/member/lawyer/audit/${id}`),
    // 审核律师
    lawyerAudit: (context, { id, ...rest }) => put(`/member/lawyer/audit/result/${id}`, { ...rest }),
  }
}
  
export default member

import { get, post, postJson } from '@/utils/xhr.js'

const tenant = {
  namespaced: true,
  actions: {
    // 交易数据统计
    statics: (context, payload) => get('/mng/financialManage/queryPlatFormSummaryInfo', payload),

    // 修改备注
    updateRemark: (context, payload) => get('/mng/financialManage/updateCashDetailRecord', payload),

    // 修改备注
    withDrawStatics: (context, payload) => get('/mng/financialManage/updateCapitalApprovalInfoRemark', payload),

    // 提现审核通过
    withDrawAuthSubmit: (context, payload) => get('/mng/financialManage/updateCapitalApprovalInfoPass', payload),

    // 提现审核拒绝
    withDrawAuthRefuse: (context, payload) => get('/mng/financialManage/updateCapitalApprovalInfoNotPass', payload),

    // 确认转帐
    withDrawTransfer: (context, payload) => get('/mng/financialManage/updateCashDetailRecordPayed', payload),

    commissionUpdate: function () {
      
    }
  }
}

export default tenant

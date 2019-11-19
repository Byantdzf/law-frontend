import { get } from '@/utils/xhr.js'

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

    // 平台收入图（按天、周、月、年汇总）
    summaryReceipts: (context, payload) => get('/mng/financialManage/summaryReceipts', payload),

    // 平台利润图（按天、周、月、年汇总）
    summaryProfit: (context, payload) => get('/mng/financialManage/summaryProfit', payload),

    commissionUpdate: function () {
      
    }
  }
}

export default tenant

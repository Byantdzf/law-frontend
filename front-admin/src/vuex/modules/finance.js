import { get, post, postJson } from '@/utils/xhr.js'

const tenant = {
  namespaced: true,
  actions: {
    // 商户授信 -- 详情
    tenantCreditView: (context, payload) => get('ptFinanceTenantCredit/selectOne', payload),
    // 商户授信 -- 调整
    tenantCreditAdjust: (context, payload) => post('/ptFinanceTenantCredit/adjust', payload),
    // 商户授信 -- 开启
    tenantCreditEnable: (context, tenantId) => post('ptFinanceTenantCredit/enable', { tenantId }),
    // 商户授信 -- 关闭
    tenantCreditDisable: (context, tenantId) => post('ptFinanceTenantCredit/disable', { tenantId }),

    // 商户授信 -- 详情
    bankAccountView: (context, payload) => get('/ptBankAccount/selectOne', payload),
    // 平台银行账户 -- 添加
    bankAccountAdd: (context, payload) => postJson('/ptBankAccount/add', payload),
    // 平台银行账户 -- 编辑
    bankAccountUpdate: (context, payload) => postJson('/ptBankAccount/update', payload),
    // 平台银行账户 -- 开启
    bankAccountEnable: (context, id) => post('ptBankAccount/enable', { id }),
    // 平台银行账户 -- 关闭
    bankAccountDisable: (context, id) => post('ptBankAccount/disable', { id }),

    // 授信收款-确认到账
    paymentConfirmReceipt: (context, payload) => post('/ptFinanceTenantCredit/payment/confirmReceipt', payload),
    // 授信收款-驳回
    paymentRejection: (context, payload) => post('/ptFinanceTenantCredit/payment/rejection', payload),
    // 授信收款 -- 详情
    queryPaymentDetailById: (context, payload) => get('/ptFinanceTenantCredit/queryPaymentDetailById', payload),
    // 未结订单-订单总额
    queryOrderAmount: (context, payload) => get('/ptFinanceTenantCredit/creditOrder/queryOrderAmount', payload),
  }
}
  
export default tenant

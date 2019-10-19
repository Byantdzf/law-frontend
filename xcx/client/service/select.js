
const { get, put } = require('../utils/ajax.js')

module.exports = {
  /**
   * 问题类型
  */
  getQuestionType: params => get('/applets/lawyer/questionType', params),

  /**
   * 获取验证码
  */
  getSmsCode: params => get('/applets/lawyer/getPhoneVerificationCode', params),

  /**
   * 新闻列表
  */
  newsList: params => get('/applets/user/article/list', params),

  /**
   * 律师列表
  */
 lawyerList: params => get('/applets/user/lawyer/list', params),

 /**
  * 律师详情
 */
  lawyerDetail: params => get('/applets/user/lawyer/details/' + params.id),

  /**
   * 新闻详细
  */
  newsDetails: params => get('/applets/user/article/details/' + params.id),

  /**
   * 模板详细
  */
  templateDetails: params => get('/applets/user/template/list/' + params.id),

  /**
   * 获取下载路径
  */
  getFileUrl: params => get('/applets/lawyer/downloadFile', params),

  /**
   * 上传文件
  */
  uploadFile: params => post('/applets/lawyer/uploadFile', params, {requestType: 'uploadFile'}),

  /**
   * 数据字典
  */
  data: params => get('/applets/lawyer/getDictData', params),

  // 关注律师
  attentionLawyer: function (params) {
    params = params || {}
    params.operateBusiness = 2        // 操作对象1-订单 2-律师 3-文章 4-系统
    params.operateType = 4            // 1-阅读 2-转发 3-点赞 4-关注 10-取消阅读 20-取消转发 30-取消点赞 40-取消关注
    return get('/applets/lawyer/order/operateOrder', params)
  },

  // 取消关注律师
  cancelAttentionLawyer: function (params) {
    params = params || {}
    params.operateBusiness = 2        // 操作对象1-订单 2-律师 3-文章 4-系统
    params.operateType = 40            // 1-阅读 2-转发 3-点赞 4-关注 10-取消阅读 20-取消转发 30-取消点赞 40-取消关注
    return get('/applets/lawyer/order/operateOrder', params)
  },
}
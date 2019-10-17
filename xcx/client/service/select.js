
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
  data: params => get('/applets/lawyer/getDictData', params)
}
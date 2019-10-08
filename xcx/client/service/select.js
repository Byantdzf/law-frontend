
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
   * 新闻详细
  */
  newsDetails: params => get('/applets/user/article/details/' + params.id),
}
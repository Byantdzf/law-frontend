
const { get } = require('../utils/ajax.js')

module.exports = {
  /**
   * 问题类型
  */
  getQuestionType: params => get('/applets/lawyer/questionType', params),

  /**
   * 获取验证码
  */
 getSmsCode: params => get('/applets/lawyer/getPhoneVerificationCode', params),

}
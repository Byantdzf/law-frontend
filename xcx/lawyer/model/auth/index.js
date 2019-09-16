
const { post } = require('../../utils/ajax.js')

module.exports = {
  /**
   * 登录
   * @param[String]  username   账号
   * @param[String]  password   密码
   * @param[String]  code       小程序登录code
  */
  login: params => post('/api/login', params, { auth: false, loading: false }),

  getUserInfo: params => post('/api/getUserInfo', params),

  save: params => post('/api/saveUserInfo', params)
}
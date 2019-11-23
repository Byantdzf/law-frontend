
const { post, postJson, get } = require('../utils/ajax.js')

module.exports = {
  /**
   * 登录
   * @param[String]  code  小程序登录code
  */
  login: params => get('/applets/lawyer/login/user', params, { auth: false, loading: false }),

  /**
   * 保存用户信息
   */
  getUserInfo: params => postJson('/applets/lawyer/updateLoginInfo/1', params),

  /**
   * 查询用户注册状态
   */
  getRegisterStatus: params => get('/applets/user/consult/publish/page', params)
}

const { post, postJson, get } = require('../utils/ajax.js')

module.exports = {
  /**
   * 登录
   * @param[String]  code       小程序登录code
  */
  login: params => get('/applets/lawyer/wechatGetSession', params, { auth: false, loading: false }),
  /**
   * updateLoginInfoLawyer
   * @param[String]  code       小程序登录code
  */
  updateLoginInfoLawyer: params => get('/applets/lawyer/updateLoginInfoLawyer', params, { auth: false }),

  /**
   * 微信登录
   */
  wechatLogin: params => get('/applets/lawyer/login', params),

  /**
   * 保存用户信息
   */
  getUserInfo: params => postJson('/applets/lawyer/updateLoginInfo/1', params),

  /**
   * 查询用户注册状态
   */
  getRegisterStatus: params => get('/applets/user/consult/publish/page', params),
  
  /**
   * 帐号登录
   */
  accountLogin: params => get('/applets/lawyer/loginByAccount', params),
  
  /**
   * 注册
   */
  register: params => postJson('/applets/lawyer/register', params),

  /**
   * 修改用户资料
   */
  updateInfo: params => postJson('/applets/lawyer/updateLawyerInfo', params),
}
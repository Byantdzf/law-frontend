
const { get, put, post } = require('../utils/ajax.js')

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
  uploadFile: params => post('/applets/lawyer/multiUpload', params, {requestType: 'uploadFile'}),

  /**
   * 上传文件
  */
  uploadFile1: params => post('/applets/lawyer/uploadFile', params, {requestType: 'uploadFile'}),

  /**
   * 数据字典
  */
  // data: params => get('/applets/lawyer/getDictData', params),
  data: params => get('/getDictData', params),
  /**
   * 广告列表
   * terminal 所属广告位:1.用户端PCWEB广告位 2.用户端小程序广告位\r\n3.律师端PCWEB广告位 4.律师端小程序广告位
   * location 1-首页Banner图3～5张; 2-律师详情页下方1张
  */
  advertisementList: params => get('/applets/user/homePage/advertisementList', params),

}
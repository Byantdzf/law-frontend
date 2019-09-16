/**
 * 公共方法ajax
 * @method ajax
 * @param[String] url 请求api baseUrl
 * @param[String] path 请求路径
 * @param[String] method 请求方法 默认GET
 * @param[Object] header 请求头
 * @param[Boolean] loading 是否需要loading 默认true
 * @param[Boolean] auth 是否需要token验证 默认true
 * @param[String] contentType 默认application/x-www-form-urlencoded
 * @param[String] requestType 微信请求类型 默认request
*/

const { baseUrl } = require('../config/url')
const { tokenName } = require('../config/global')
const pages = require('../plugins/pages')
// const { absolutePath } = require('./path')

let requests = []

const ajax = (_options = {}) => {
  return new Promise((resolve, reject) => {

    const appPage = pages.get('appPage')

    // 本地调试代码
    if (!!~_options.path.indexOf('.js')) {
      const res = require('..' + _options.path);
      resolve(res)
      return false
    }
    // 本地调试代码结束

    let {
      url = baseUrl,
      path = '',
      method = 'GET',
      header,
      params = {},
      loading = true,
      toast = true,
      auth = true,
      contentType = 'application/x-www-form-urlencoded',
      requestType = 'request'
    } = _options

    header = Object.assign({}, {
      "content-type": contentType
    }, header)

    auth && (params.token = wx.getStorageSync(tokenName))

    if (path.indexOf('http:') > -1 || path.indexOf('https:') > -1) {
      url = path;
    } else {
      url = url + path;
    }

    let options = {
      url,
      header,
      success: response => {
        let data = response.data || {};
        if (response.statusCode == 200) {
          switch (data.code) {
            case 2:
              resolve(data);
              break;
            default:
            toast &&
              wx.showToast({
                title: data.msg || data.dataList.errorMsg || '加载失败',
                icon: 'none',
                duration: 2000
              })
              reject(response)
              break;
          }
        } else {
          reject()
        }
      },
      fail: error => {
        //   console.log(error);
        //   toast && wx.showToast({
        //     title: error,
        //     icon: 'none',
        //     duration: 2000
        //   });
        reject(error)
      },
      complete: () => {
        if(loading && appPage) {
          // 关闭自定义loading

          requests = requests.filter(req => req !== path)

          if(requests.length == 0) {
            appPage.setData({ isLoading: false })
          }
        }
        wx.hideNavigationBarLoading()
        // wx.stopPullDownRefresh();
      }
    }
    
    if(loading && appPage && !appPage.data.isLoading) {
      // 打开自定义loading
      appPage.setData({ isLoading: true })
      requests.push(path)
    }

    switch (options.requestType) {
      case 'uploadFile':
        if (params) {
          options.filePath = params.filePath;
          options.name = params.name || 'fileName';
          params.formData && (options.formData = params.formData);
        }
        return wx.uploadFile(options);
        break;
      case 'downloadFile':
        return wx.downloadFile(options);
        break;
      case 'request':
      default:
        options.method = method.toUpperCase();
        params && (options.data = params);
        wx.request(options);
        break;
    }
  });
} 

const get = (path, params, options) => ajax({
  path,
  params,
  ...options
})

const post = (path, params, options) => ajax({
  path,
  params,
  ...options,
  method: 'post'
})

const postJson = (path, params, options) => ajax({
  path,
  params,
  ...options,
  method: 'post',
  contentType: 'application/json'
})

module.exports = {
  ajax,
  get,
  post,
  postJson
}
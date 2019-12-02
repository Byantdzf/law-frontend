
const test = require('utils/test.js')
const pages = require('plugins/pages.js')
const QQMapWX = require('plugins/qqmap-wx-jssdk.min.js')
const api = require('service/auth')
const { tokenName } = require('config/global')
const qqmapsdk = new QQMapWX({
  key: 'LW5BZ-ZTFA4-QXNUJ-XWKTM-5VAB5-J6BTM'
})

let primaryColor = '#CF443D'
let reverseColor = '#ffffff'

App({
  globalData: {
    defaultLocation: {
      latitude: 22.55,
      longitude: 114.05
    },
    maxScore: 5,    // 律师评分为5分制
    userInfo: null, // 用户信息
    adInfo: null, // 用户位置信息,
    smsCount: 60, // 再次发短信间隔时间
    scene: ''
  },
  onLaunch(e) {
    this.test = test
    this.pages = pages
    this.globalData.scene = e.scene
    this.qqmapsdk = qqmapsdk
    this.overShare()
    wx.login({
      success:({ code }) => {
        if(!code) return
        api.login({ code }).then(res => {
          const data = res.data || {}
          // 保存token
          wx.setStorageSync('wechatLoginCode', data.sessionId)
          if (data.unionid) {
            // 保存unionId
            wx.setStorageSync('unionid', data.unionid)
          }
        })
      }
    })
  },
  onShow(o) {
    // console.log(o)
  },
  // 设置导航栏标题
  setNavTitle(title) {
    wx.setNavigationBarTitle({ title })
  },
  // 设置导航栏文字颜色，背景色
  setNavColor(o) {
    let options = {
      frontColor: reverseColor,
      backgroundColor: primaryColor,
      animation: {
        duration: 10,
        timingFunc: 'easeIn'
      }
    }
    let obj = Object.assign(options, o)
    // console.log(obj)
    wx.setNavigationBarColor(obj)
  },
  getCurrentPageUrlWithArgs(){
    let pages = getCurrentPages()    // 获取加载的页面
    let currentPage = pages[pages.length - 1]    // 获取当前页面的对象
    let url = currentPage.route    // 当前页面url
    let options = currentPage.options    // 如果要获取url中所带的参数可以查看options
    // 拼接url的参数
    let urlWithArgs = url + '?from_openid=' + this.from_openid
    for (let key in options) {
      var value = options[key]
      if (key !== 'from_openid') {
        urlWithArgs = url + '?' + key + '=' + value + '&from_openid=' + this.from_openid
      }
    }
    // urlWithArgs = urlWithArgs.substring(0, urlWithArgs.length - 1)
    return urlWithArgs
  },
  //重写分享方法
  overShare() {
    //监听路由切换
    wx.onAppRoute(res=>{
      let view = getCurrentPages();
      wx.showShareMenu({
        withShareTicket: true
      });
      let URL = this.getCurrentPageUrlWithArgs();
      console.log(URL)
      view.onShareAppMessage = function(){
        return {
          title:'分享',
          path: URL
        }
      }
    })
  },
  // 确认操作提示
  confirm(o) {
    let options = {
      title: '温馨提示',
      content: '',
      showCancel: true,
      cancelText: '取消',
      confirmText: '确认',
      confirmColor: primaryColor
    }
    let obj = Object.assign(options, o)

    return new Promise((resolve, reject) => {
      wx.showModal({
        ...obj,
        success(res) {
          let { confirm } = res
          confirm ? resolve(res) : reject(res)
        },
        fail(error) {
          reject(error)
        }
      })
    })
  },
  // 警告提示
  alert(o) {
    typeof o == 'string' && (o = { content: o })
    return this.confirm(Object.assign(o, {
      showCancel: false
    }))
  },
  // 显示成功信息
  toastSuccess(title) {
    wx.showToast({
      title,
      icon: 'success',
      duration: 2000
    })
  },
  // 显示错误信息
  toastError(title) {
    wx.showToast({
      title,
      icon: 'none',
      duration: 2000
    })
  },
  // 打电话
  makePhoneCall(phoneNumber) {
    wx.makePhoneCall({ phoneNumber })
  },
  // 获取用户经纬度
  getUserLocation(cb) {
    let _t = this
    wx.getLocation({
      type: 'wgs84',
      success: res => {
        this.reverseGeocoder({
          latitude: res.latitude,
          longitude: res.longitude
        }, cb)
      },
      fail: () => {
        this.confirm({
          "content": '需要获取您的地理位置，请确认授权，否则将无法找到您附近的律师',
        }).then(res => {
          if (res.confirm) {
            wx.openSetting({
              success() {
                _t.getUserLocation(cb)
              },
              fail() {
                _t.reverseGeocoder(this.globalData.defaultLocation, cb)
              }
            });
          }
        }, reject => {
          _t.reverseGeocoder(this.globalData.defaultLocation, cb)
        })
      }
      // fail: () => {
      //   this.reverseGeocoder(this.globalData.defaultLocation, cb)
      // }
    })
  },
  // 通过经纬度获取具体的位置信息
  reverseGeocoder(location, cb) {
    this.qqmapsdk &&
      this.qqmapsdk.reverseGeocoder({
        location,
        success: res => {
          const { status, result } = res
          if (status == 0) {
            let adInfo = {}
            adInfo.province = result.ad_info.province
            adInfo.city = result.ad_info.city
            adInfo.location = result.ad_info.location
            this.globalData.adInfo = adInfo
          }
          typeof cb === 'function' && cb(this.globalData)
        },
        fail: () => {
          typeof cb === 'function' && cb(this.globalData)
        }
      })
  },
  getCityLocation(provice, city) {
    this.qqmapsdk &&
      this.qqmapsdk.geocoder({
        address: city,
        complete: res => {
          if (res.result && res.result.length) {
            let adInfo = {}
            adInfo.province = res.result.address_components.province
            adInfo.city = res.result.address_components.city
            adInfo.location = res.result.location
            this.globalData.adInfo = adInfo
          } else {
            this.qqmapsdk.geocoder({
              address: provice,
              complete: res => {
                if (res.result && res.result.length) {
                  let adInfo = {}
                  adInfo.province = res.result.address_components.province
                  adInfo.city = res.result.address_components.city
                  adInfo.location = res.result.location
                  this.globalData.adInfo = adInfo
                } else {

                }
              }
            })
          }
        }
      })
  },
  // js跳转页面，分tab和普通链接
  gotoPage(url, type) {
    let op = {
      url: url
    }
    if (type == 'tab') {
      wx.switchTab(op)
    } else {
      wx.navigateTo(op)
    }
  },
  wechatPay(data, successCB, failCB) {
    wx.requestPayment({
        timeStamp: data.timeStamp,
        nonceStr: data.nonceStr,
        package: data.package,
        signType: data.signType,
        paySign: data.paySign,
        success(res) {
          successCB && successCB(res)
        },
        fail(res) {
          failCB && failCB(res)
        }
    })
  },
  // 通用下载接口
  downloadFile(url, successCB) {
    if (!url) {
      this.toastError('文件地址为空');
      return false;
    }
    wx.showLoading({ mask: true });
    wx.downloadFile({
      url,
      header: {},
      success: ({ statusCode, tempFilePath}) => {
        wx.hideLoading();
        if (statusCode == 200) {
          typeof successCB === 'function' && successCB(tempFilePath);
        } else {
          this.toastError(`下载失败！(code: ${ statusCode })`);
        }
      },
      fail: err => {
        wx.hideLoading();
        this.toastError('文件下载失败！');
      }
    });
  },
  // 下载文件并打开文件
  handleOpenDoc(url) {
    this.downloadFile(url, (tempFilePath) => {
      wx.showLoading({ mask: true });
      wx.openDocument({
        filePath: tempFilePath,
        success: () => {
          wx.hideLoading();
          console.log('打开文档成功')
        },
        fail: err => {
          wx.hideLoading();
          console.log('打开文档失败：', err)
        }
      })
    });
  },
  // 下载文件并保存
  handleSaveFile(url) {
    this.downloadFile(url, (tempFilePath) => {
      wx.showLoading({ mask: true, title: '正在保存文件' });
      wx.saveFile({
        tempFilePath,
        success: () => {
          wx.hideLoading();
          this.toastSuccess(`保存成功！`);
        },
        fail: err => {
          console.log(err)
          wx.hideLoading();
          this.toastError(`保存失败！`);
        }
      })
    });
  },
  // 检查/唤起用户授权使用录音功能
  checkAndTriggerRecordAuth(successCallback, errorCallback) {
    // 可以通过 wx.getSetting 先查询一下用户是否授权了 "scope.record" 这个 scope
    wx.getSetting({
      success: (res) => {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success: () => {
              typeof successCallback === 'function' && successCallback({ fromAuthorize: true });
            },
            fail: () => {
              typeof errorCallback === 'function' && errorCallback();
            }
          })
        } else {
          typeof successCallback === 'function' && successCallback({ fromAuthorize: false });
        }
      }
    });
  }
})

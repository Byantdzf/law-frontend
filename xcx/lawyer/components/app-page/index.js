const app = getApp()
const api = require('../../service/auth')
const { tokenName, appName } = require('../../config/global')
const pages = require('../../plugins/pages')
Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true 
  },
  properties: {
    hideTabBar: {
      type: Boolean,
      value: true
    }
  },
  data: {
    appName,
    authVisible: false,
    authStyles: 'bottom:0rpx;left:0;width:100%;margin:0;',
    hasNetwork: true,
    authResolve: null,
    authReject: null,
    isLoading: false
  },
  methods: {
    userLogin() {
      wx.login({
        success:({ code }) => {
          if(!code) return
          // 请求后端，用code 换取openid，然后根据后端逻辑，看是返回token还是什么进行处理
          let params = {}
          params.code = code
          if (app.globalData.adInfo) {
            params.locationX = app.globalData.adInfo.location.lng
            params.locationY = app.globalData.adInfo.location.lat
          }
          api.login(params).then(res => {
            // 保存token
            wx.setStorageSync(tokenName, res.data.sessionId)

            // 如果没有返回用户信息，从微信获取
            this.getAuthSetting()
          }).catch(() =>{
            // 后端接口异常情况下，本地继续走流程，从微信获取
            this.getAuthSetting()
          })
        }
      })
    },
    // 打开用户授权modal
    showAuth() {
      this.setData({
        authVisible: true,
      })
    },
    // 关闭用户授权modal
    hideAuth() {
      this.setData({ authVisible: false })
    },
    // 检查用户是否有授权
    checkAuth() {
      let userInfo = wx.getStorageSync('userInfo')

      return new Promise((resolve, reject) => {
        this.setData({ authResolve:resolve, authReject: reject })
        if(userInfo) {
          resolve(userInfo)
        }else {
          this.userLogin()
        }
      })
    },
    // 检查网络环境
    checNetwork(cb) {
      wx.getNetworkType({
        success: res => {
          cb && cb(res.networkType)
        }
      })
      wx.onNetworkStatusChange(res => {
        cb && cb(res.networkType)
      })
    },
    getAuthSetting() {
      wx.getSetting({
        success: ({ authSetting }) => {
          if(authSetting['scope.userInfo']) {
            this.getUserInfo()
          } else {
            // 唤起授权对话框
            this.showAuth()
          }
        },
        fail(err) {
          // 唤起授权对话框
          this.showAuth()
        }
      })
    },
    // 获取用户信息
    getUserInfo() {
      wx.getUserInfo({
        lang: "zh_CN",
        success: (detail) => {
          console.log(detail)
          if (detail.errMsg == "getUserInfo:ok") {
            this.data.authResolve(detail.userInfo)
            wx.setStorageSync('userInfo', detail.userInfo)
          } else {
            this.data.authReject()
          }

          // 看情况是否需要提交到后端
        }
      })
    },
    bindGetUserInfo({detail}) {
      // 保存用户信息到服务器，相当于注册用户，需要提交 iv, encryptedData, rawData, signature, userInfo
      // ……
      if (detail.errMsg == "getUserInfo:ok") {
        let params = detail.userInfo
        if (app.globalData.adInfo) {
          params.locationX = app.globalData.adInfo.location.lng
          params.locationY = app.globalData.adInfo.location.lat
        }
        api.getUserInfo(params).then(res => {
          this.data.authResolve(detail.userInfo)
          app.globalData.userInfo = params
          wx.setStorageSync('userInfo', params)
        })
      } else {
        this.data.authReject()
      }
      this.hideAuth()
    },
  },
  ready() {
    this.checNetwork(type => {
      if(type == 'none') {
        this.setData({ hasNetwork: false })
        wx.hideTabBar({})
      }else {
        this.setData({ hasNetwork: true })
        wx.showTabBar({})
      }
    })
  },
  pageLifetimes: {
    // 进入页面触发，在ready之前执行
    show() {
      !pages.get('appPage') && pages.add(this, 'appPage')
    },
    // 离开页面触发
    hide() {
    }
  }
})
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
    userLogin(payload = {}) {
      return new Promise((resolve, reject) => {
        wx.login({
          success:({ code }) => {
            if(!code) return
            // 请求后端，用code 换取openid，然后根据后端逻辑，看是返回token还是什么进行处理
            api.login({ code }).then(res => {
              // 保存token
              const data = res.data || {}
              const token = data.sessionId
              wx.setStorageSync(tokenName, token)
              api.updateLoginInfoUser(payload).then(res => {
                resolve(res)
              }).catch((err) => {
                reject(err)
              });
            })
          }
        })
      });
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
      return new Promise((resolve, reject) => {
        this.setData({ authResolve: resolve, authReject: reject })
        this.getAuthSetting()
      })
    },
    // 获取用户的授权设置
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
        fail() {
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
          if (detail.errMsg == "getUserInfo:ok") {
            app.globalData.userInfo = detail.userInfo
            wx.setStorageSync('userInfo', detail.userInfo)
            this.data.authResolve(detail)
          } else {
            this.data.authReject()
          }
        }
      })
    },
    // 用户授权回调结果
    bindGetUserInfo({detail}) {
      // 保存用户信息到服务器，相当于注册用户，需要提交 iv, encryptedData, rawData, signature, userInfo
      // ……
      if (detail.errMsg == "getUserInfo:ok") {
        this.getUserInfo()
      } else {
        this.data.authReject()
      }
      this.hideAuth()
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
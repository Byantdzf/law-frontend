const api = require('../../service/auth')
const { tokenName } = require('../../config/global')
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
          api.login({ code }).then(res => {
            // 保存token
            wx.setStorageSync(tokenName, res.data.token)
            
            // 如果有返回用户信息
            if (res.data.userInfo) {
              this.data.authResolve(res.data.userInfo)
            } else {
              // 如果没有返回用户信息，从微信获取
              this.getAuthSetting()
            }
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
        this.data.authResolve(detail.userInfo)
        wx.setStorageSync('userInfo', detail.userInfo)
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
      console.log('app page show')
      !pages.get('appPage') && pages.add(this, 'appPage')
    },
    // 离开页面触发
    hide() {
    }
  }
})
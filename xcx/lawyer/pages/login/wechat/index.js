// pages/login/wechat/index.js
const app = getApp()
const api = require('../../../service/auth')
Page({

    /**
     * 页面的初始数据
     */
    data: {

    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        wx.login({
          success:({ code }) => {
            if(!code) return
            api.login({ code }).then(res => {
                console.log(res);
            //   // 保存token
            //   wx.setStorageSync(tokenName, res.data.sessionId)
            })
          }
        })
    },
    bindGetUserInfo({ detail }) {
        if (detail.errMsg == "getUserInfo:ok") {
            let params = detail.userInfo
            api.getUserInfo(params).then(res => {
                console.log(res)
                // app.globalData.userInfo = params
                // wx.setStorageSync('userInfo', params)
                // app.gotoPage('/pages/reg/index')
            })
        }
    },
    showAgreement() {
        app.gotoPage('/pages/user/setting/agreement/index')
    },
    showPrivacy() {
        app.gotoPage('/pages/user/setting/privacy/index')
    },
})
// pages/login/index.js
const app = getApp()
const api = require('../../../service/auth')
const userApi = require('../../../service/user')
const { tokenName } = require('../../../config/global')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        aggreement: false,
        wxToken: null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // this.wxLogin()
    },
    wxLogin() {
        wx.login({
            success: ({ code }) => {
                if (!code) return
                // 请求后端，用code 换取openid，然后根据后端逻辑，看是返回token还是什么进行处理
                let params = {}
                params.code = code
                api.login({ code }).then(res => {
                    // 保存token
                    this.setData({
                        wxToken: res.data.sessionId
                    })
                    // wx.setStorageSync(tokenName, res.data.sessionId)
                })
            }
        })
    },
    gotoReg() {
        app.gotoPage('/pages/reg/index')
    },
    findPassword() {
        app.gotoPage('/pages/findPassword/index')
    },
    checkboxChange() {
        this.setData({
            aggreement: !this.data.aggreement
        })
        this.setData({ btnDisable: !this.data.aggreement })
    },
    showAgreement() {
        app.gotoPage('/pages/news/agreement/index')
    },
    showPrivacy() {
        app.gotoPage('/pages/news/privacy/index')
    },
    gotoWechatLogin() {
        app.gotoPage('/pages/login/wechat/index')
    },
    formSubmit(e) {
        let params = e.detail.value
        if (!params.account) {
            app.toastError('请输入手机号')
            return
        }
        if (!params.pwd) {
            app.toastError('请输入密码');
            return;
        }
        if (!this.data.aggreement) {
            app.toastError('您还未同意用户协议，隐私协议');
            return;
        }
        params.from = 2
        api.accountLogin(params).then(res => {
            wx.setStorageSync(tokenName, res.data.sessionId)
            if (res.data.isOpenIdEmpty) {
                app.confirm({ content: '您的帐号还未绑定微信，是否绑定？' }), then(res => {

                    // wx.login({
                    //     success: ({ code }) => {
                    //         if (!code) return
                    //         api.login({ code }).then(res => {
                    //             // 保存token
                    //             wx.setStorageSync(tokenName, res.data.sessionId)

                    //             api.getUserInfo(params).then(res => {
                    //                 console.log(res)
                    //             })
                    //         })
                    //     }
                    // })
                })
            } else {
                userApi.getUser().then(res => {
                    if (res.data.applyStatus == 2) {
                        app.gotoPage('/pages/tabBar/order/index', 'tab')
                    } else {
                        app.gotoPage('/pages/waitAuth/index')
                    }
                })
            }
        })
    },
})
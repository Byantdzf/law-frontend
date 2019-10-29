// pages/waitAuth/index.js
const app = getApp();
const userModel = require('../../service/user.js')
const { userInfoTokanName } = require('../../config/global')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        areas: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      this.getUserInfo()
    },

    getUserInfo() {
        userModel.getUser().then(res => {
            if (res.data.auditStatus == 1) {
                app.gotoPage('/pages/tabBar/order/index', 'tab')
            } else if (res.data.auditStatus == 2) {
              app.gotoPage('/pages/reg/index')
            }
        })
    }
})
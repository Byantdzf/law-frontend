// pages/login/wechat/index.js
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

  },
  bindGetUserInfo({detail}) {
    if (detail.errMsg == "getUserInfo:ok") {
      let params = detail.userInfo
      console.log(params)
      // api.getUserInfo(params).then(res => {
      //   this.data.authResolve(detail.userInfo)
      //   app.globalData.userInfo = params
      //   wx.setStorageSync('userInfo', params)
      // })
    }
  },
})
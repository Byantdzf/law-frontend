// pages/tabBar/user/index.js

const authModel = require('../../../model/auth/index.js');
let app = getApp();
Page({
  ...app.loadMoreMethods,
  /**
   * 页面的初始数据
   */
  data: {
    userInfos: {
      userName: '',     //用户名
      photo: '',        //头像
      id: 0
    },
    menus: [
      {
        url: '',
        label: '我的关注'
      }, {
        url: '',
        label: '我的优惠券'
      }, {
        url: '',
        label: '我的订单'
      }, {
        url: '',
        label: '设置'
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfos = wx.getStorageSync('userInfo');
    this.setData({
      userInfos
    });
    app.setNavTitle(' ')
    app.setNavColor()
      
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
   
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
})
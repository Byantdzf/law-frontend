// pages/tabBar/user/index.js

// const authModel = require('../../../model/auth/index.js');
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
        label: '我的数据',
        code: 'myData',
        icon: 'iconfont icon-attention-fill'
      }, {
        url: '',
        label: '个人资料',
        code: 'myInfo',
        icon: 'iconfont icon-coupon'
      }, {
        url: '',
        label: '我的关注',
        code: 'myCollect',
        icon: 'iconfont icon-order-fill'
      }, {
        url: '',
        label: '我的钱包',
        code: 'myWallet',
        icon: 'iconfont icon-order-fill'
      }, {
        url: '',
        label: '设置',
        code: 'mySetting',
        icon: 'iconfont icon-setting-fill'
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
  tapTools(e) {
    let { code } = e.currentTarget.dataset;
    switch (code) {
      case 'myData':
        app.gotoPage('/pages/user/myData/index')
        break;
      case 'myInfo':
        app.gotoPage('/pages/user/myInfo/index')
        break;
      case 'myCollect':
        app.gotoPage('/pages/user/myCollect/index')
        break;
      case 'myWallet':
        app.gotoPage('/pages/user/myWallet/home/index')
        break;
      case 'mySetting':
        app.gotoPage('/pages/user/setting/home/index')
        break;
    }
  },
})
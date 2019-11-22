// pages/user/collect/index.js
let app = getApp();
const userApi = require('../../../service/user')
Page({
  data: {
    data: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.pages.add(this)
    app.setNavColor()
  },
  onShow() {
    this.loadData()
  },
  loadData() {
    userApi.getMyData().then(res => {
      let data = res.data
      this.setData({ data })
    })
  }
})
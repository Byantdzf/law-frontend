// pages/user/collect/index.js
let app = getApp();
const userApi = require('../../../../service/user')
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
    this.loadData()
  },
  loadData() {
    userApi.getMyBalance().then(res => {
      let data = res.data
      this.setData({ data })
    })
  },
  withDraw() {
    app.gotoPage('../withDraw/index')
  },
  viewList() {
    app.gotoPage('../list/index')
  }
})
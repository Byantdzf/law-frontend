// pages/user/collect/index.js
let app = getApp();
const userApi = require('../../../service/user')
Page({
  data: {
    data: [],
    idCard1: {},
    idCard2: {},
    idCard3: {}
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
    userApi.getUser().then(res => {
      let data = res.data
      let files = data.files || []
      let idCard1 = {}
      let idCard2 = {}
      let idCard3 = {}
      files.forEach(item => {
        if (item.businessType == 1) {
          idCard1 = item
        } else if (item.businessType == 10) {
          idCard2 = item
        } else if (item.businessType == 2) {
          idCard3 = item
        }
      })
      this.setData({ data, idCard1, idCard2, idCard3 })
    })
  }
})
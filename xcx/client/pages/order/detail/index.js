const orderApi = require('../../../service/order');
const { orderType, orderCategory, orderStatus, orderEmergency } = require('../../../config/global')
const app = getApp();
Page({
  data: {
    orderType,
    orderCategory,
    orderStatus,
    orderEmergency,
    item: {}
  },
  onLoad(e) {
    app.pages.add(this)
    app.setNavColor()
    this.loadData(e.id)
  },
  loadData(id) {
    orderApi.orderDetails(id).then(res => {
      console.log(res)
      const item = res.data || {}
      this.setData({ item })
    })
  }
})
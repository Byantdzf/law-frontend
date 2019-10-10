// const orderModel = require('../../../model/order/index.js');
const app = getApp();
Page({
  data: {
    info: {}
  },
  onLoad() {
    app.pages.add(this)
    app.setNavColor()
  }
})
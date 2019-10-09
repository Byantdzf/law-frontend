// const orderModel = require('../../../model/order/index.js');
const app = getApp();
Page({
  data: {
    types: [
      {
        id: 1,
        name: '咨询订单'
      },
      {
        id: 2,
        name: '分块法律服务订单'
      },
      {
        id: 3,
        name: '代理律师订单'
      },
      {
        id: 4,
        name: '法律文件订单'
      }
    ]
  },
  onLoad() {
    app.pages.add(this)
    app.setNavColor()
  }
})
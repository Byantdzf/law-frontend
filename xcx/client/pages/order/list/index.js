// const orderModel = require('../../../model/order/index.js');
const app = getApp();
Page({
  data: {
    listUrl: '/applets/user/order/list',
    statusItems: [
      {
        id: -1,
        name: '全部'
      },
      {
        id: 1,
        name: '待接单'
      },
      {
        id: 2,
        name: '已接单'
      },
      {
        id: 3,
        name: '完成待确认'
      },
      {
        id: 4,
        name: '待评价'
      },
      {
        id: 5,
        name: '已完成'
      }
    ],
    list: [
      {
        orderType: '语音咨询订单',
        name: '陆先生',
        phone: '181******01',
        score: 4.9,
        helpers: 249,
        followers: 249
      }, {
        orderType: '语音咨询订单',
        name: '陆先生',
        phone: '181******01',
        score: 4.9,
        helpers: 249,
        followers: 249
      }, {
        orderType: '语音咨询订单',
        name: '陆先生',
        phone: '181******01',
        score: 4.9,
        helpers: 249,
        followers: 249
      }
    ],
  },
  onLoad() {
    app.pages.add(this)
    app.setNavColor()
  },
  updateList(e) {
    this.setData({ list: e.detail })
  },
})
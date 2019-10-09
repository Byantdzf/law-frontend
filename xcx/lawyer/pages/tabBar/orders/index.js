// const orderModel = require('../../../model/order/index.js');
const app = getApp();
Page({
  data: {
    types: [
      {
        id: 1,
        name: '推荐订单'
      },
      {
        id: 2,
        name: '订单池'
      },
      {
        id: 3,
        name: '找到我的'
      }
    ],
    sorts: [
      {
        id: 1,
        name: '默认排序'
      },
      {
        id: 2,
        name: '评分高低'
      },
      {
        id: 3,
        name: '帮助人数'
      },
      {
        id: 4,
        name: '关注人数'
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
  }
})
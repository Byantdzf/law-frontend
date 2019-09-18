// const orderModel = require('../../../model/order/index.js');
const app = getApp();
Page({
  data: {
    types: [
      {
        id: -1,
        name: '全部'
      },
      {
        id: 1,
        name: '婚姻家庭'
      },
      {
        id: 2,
        name: '劳动工伤'
      },
      {
        id: 3,
        name: '交通事故'
      },
      {
        id: 4,
        name: '劳动工伤'
      },
      {
        id: 5,
        name: '交通事故'
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
        name: '何金宝律师',
        imgUrl: '../../../static/images/demo/wakaka.png',
        score: 4.9,
        desc: '1995年吉林大学法学研究生院毕业后在深圳从事，林大学法学研究生院......',
        helpers: 249,
        followers: 249
      }, {
        name: '何金宝律师',
        imgUrl: '../../../static/images/demo/wakaka.png',
        score: 4.9,
        desc: '1995年吉林大学法学研究生院毕业后在深圳从事，林大学法学研究生院......',
        helpers: 249,
        followers: 249
      }, {
        name: '何金宝律师',
        imgUrl: '../../../static/images/demo/wakaka.png',
        score: 4.9,
        desc: '1995年吉林大学法学研究生院毕业后在深圳从事，林大学法学研究生院......',
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
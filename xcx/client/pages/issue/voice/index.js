// pages/lawyer/voice/index.js
const app = getApp()
const api = require('../../../service/auth')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    regStatus: 1,
    isEmergency: [
      {id: 1, name: "一般", checked: true},
      {id: 2, name: "紧急"}
    ],
    range: [],
    selectRange: '',
    selectAmount: '',
    region: [],
    details: {
      id: 1,
      name: '何金宝律师',
      area: '广东-深圳',
      imgUrl: '../../../static/images/demo/wakaka.png',
      score: 4.9,
      content: '<p>1995年吉林大学法学研究生院毕业后在深圳从事专职律师至今，创晖律师所主任，深圳仲裁委员会仲裁员，安师大法学院校外硕导。诉讼纠纷代理、刑事辩护、公司法律顾问及金融法律服务。出具尽调报告和法律意见书。</p>',
      helpers: 249,
      followers: 249,
      amountList: [
        {id: 1, name: "50元", value: "50"},
        {id: 2, name: "100元", value: "100"},
        {id: 3, name: "200元", value: "200"}
      ],
      listData:[
        {"name": "语音咨询", "orderNums":"20","score":"2.9"},
        {"name": "1对1咨询", "orderNums":"20","score":"2.9"},
        {"name": "非诉讼法律服务", "orderNums":"20","score":"2.9"},
        {"name": "诉讼法律服务", "orderNums":"20","score":"2.9"},
        {"name": "收费代理", "orderNums":"20","score":"2.9"}
      ]
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户注册状态
    api.getRegisterStatus().then(res => {
      this.setData({
        regStatus: res.data
      })
    })
    this.setData({
      range: app.globalData.questionCatetory
    })
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
  regionChange(e) {
    this.setData({
      region: e.detail.value
    })
  },
  questionChange(e) {
    this.setData({
      selectRange: this.data.range[e.detail.value]
    })
  },
  amountChange(e) {
    this.setData({
      selectAmount: this.data.details.amountList[e.detail.value]
    })
  },
  submitForm(e) {
    app.gotoPage('/pages/lawyer/success/index')
  }
})
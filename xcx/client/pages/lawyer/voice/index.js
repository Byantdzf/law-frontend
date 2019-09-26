// pages/lawyer/voice/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showType: 1,
    isEmergency: [
      {id: 1, name: "一般", checked: true},
      {id: 2, name: "紧急"}
    ],
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
      range: [
        {id: 1, name: "婚姻家庭"},
        {id: 2, name: "劳动工伤"},
        {id: 3, name: "交通事故"},
        {id: 4, name: "征地拆迁"},
        {id: 5, name: "合同纠纷"}
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
    let { id } = options
    this.setData({
      id
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
  changeTab() {
    this.setData({
      showType: this.data.showType == 1 ? 2 : 1
    })
  },
  voiceTap() {
    app.gotoPage('/pages/lawyer/voice/index?id=' + this.data.id)
  },
  regionChange(e) {
    this.setData({
      region: e.detail.value
    })
  },
  questionChange(e) {
    this.setData({
      selectRange: this.data.details.range[e.detail.value]
    })
  },
  amountChange(e) {
    this.setData({
      selectAmount: this.data.details.amountList[e.detail.value]
    })
  }
})
// pages/lawyer/detail/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showType: 1,
    details: {
      id: 1,
      name: '何金宝律师',
      area: '广东-深圳',
      imgUrl: '../../../static/images/demo/wakaka.png',
      score: 4.9,
      content: '<p>1995年吉林大学法学研究生院毕业后在深圳从事专职律师至今，创晖律师所主任，深圳仲裁委员会仲裁员，安师大法学院校外硕导。诉讼纠纷代理、刑事辩护、公司法律顾问及金融法律服务。出具尽调报告和法律意见书。</p>',
      helpers: 249,
      followers: 249,
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
    },
    comments: [
      {
        id: 1,
        name: 'Silent Li',
        area: '广东-深圳',
        imgUrl: '../../../static/images/demo/wakaka.png',
        type: '风险代理律师',
        servicesScore: '5',
        servicesTime: '2019年8月8日',
        Professional: '5',
        remark: '这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情',
      },
      {
        id: 2,
        name: '泼辣丸子',
        area: '广东-深圳',
        imgUrl: '../../../static/images/demo/wakaka.png',
        type: '风险代理律师',
        servicesScore: '5',
        servicesTime: '2019年8月8日',
        Professional: '5',
        remark: '这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情',
      },
      {
        id: 3,
        name: '我在旧城等待花开',
        area: '广东-深圳',
        imgUrl: '../../../static/images/demo/wakaka.png',
        type: '风险代理律师',
        servicesScore: '5',
        servicesTime: '2019年8月8日',
        Professional: '5',
        remark: '这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情',
      }
    ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { id } = options
    this.setData({
      id 
    })
    console.log(this.data.id)
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
  onByOneTap() {
    app.gotoPage('/pages/lawyer/oneByOne/index?id=' + this.data.id)
  },
})
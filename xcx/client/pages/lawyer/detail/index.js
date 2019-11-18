// pages/lawyer/detail/index.js
const app = getApp()
const selectApi = require('../../../service/select')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showType: 1,
    persent: 0,
    gender: ['', '男', '女'],
    defaultPic: '/static/images/demo/img_lawyer.png',
    details: {},
    comments: [
      // {
      //   id: 1,
      //   name: 'Silent Li',
      //   area: '广东-深圳',
      //   imgUrl: '../../../static/images/demo/wakaka.png',
      //   type: '风险代理律师',
      //   servicesScore: '5',
      //   servicesTime: '2019年8月8日',
      //   Professional: '5',
      //   remark: '这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情',
      // },
      // {
      //   id: 2,
      //   name: '泼辣丸子',
      //   area: '广东-深圳',
      //   imgUrl: '../../../static/images/demo/wakaka.png',
      //   type: '风险代理律师',
      //   servicesScore: '5',
      //   servicesTime: '2019年8月8日',
      //   Professional: '5',
      //   remark: '这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情',
      // },
      // {
      //   id: 3,
      //   name: '我在旧城等待花开',
      //   area: '广东-深圳',
      //   imgUrl: '../../../static/images/demo/wakaka.png',
      //   type: '风险代理律师',
      //   servicesScore: '5',
      //   servicesTime: '2019年8月8日',
      //   Professional: '5',
      //   remark: '这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情，这是用户的评论详情',
      // }
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

    this.loadData()
  },

  loadData() {
    selectApi.lawyerDetail({ id: this.data.id }).then(res => {
      let details = res.data
      details.joinDate = details.joinDate && details.joinDate.split(' ')[0]
      details.goodAt = details.goodAt && details.goodAt.split(',')

      let score = details.score > 5 ? 5 : details.score < 0 ? 0 : details.score
      let persent = Math.floor(score / app.globalData.maxScore * 100)

      this.setData({
        persent,
        details
      })
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
  changeTab(e) {
    let { type } = e.currentTarget.dataset
    this.setData({
      showType: type
    })
  },
  voiceTap() {
    app.gotoPage('/pages/lawyer/voice/index?id=' + this.data.id)
  },
  onByOneTap() {
    app.gotoPage('/pages/lawyer/oneByOne/index?id=' + this.data.id)
  },
  imageError(e) {
    var _errImg = e.target.dataset.img
    var _errObj = {}
    _errObj[_errImg] = this.data.defaultPic
    this.setData(_errObj)
  },
  collect() {
    selectApi.attentionLawyer({ businessId: this.data.id }).then(res => {
      this.loadData()
    })
  },
  cancelCollect() {
    let details = this.data.details
    selectApi.attentionLawyer({ businessId: this.data.id }).then(res => {
      this.loadData()
    })
  },
})
// pages/lawyer/detail/index.js
const app = getApp()
const selectApi = require('../../../service/select')
const userApi = require('../../../service/user')
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
    comments: [],
    active: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { id } = options
    this.setData({
      id
    })
    app.pages.add(this)
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
  activeFn() {
    this.setData({
      active: !this.data.active
    })
  },
  inviteTap() {
    app.gotoPage('/pages/order/waiting/index?lawyerId=' + this.data.id)
  },
  triggerInvite({ lawyerId, orderId }) {
    userApi.orderModifyDispatchWayByUser({ lawyerId, orderId }).then(res => {
      app.toastSuccess('邀请律师请求成功！')
      this.loadData()
    })
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
    // let details = this.data.details
    selectApi.cancelAttentionLawyer({ businessId: this.data.id }).then(res => {
      this.loadData()
    })
  },
})

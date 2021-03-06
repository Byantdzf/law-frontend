// pages/user/collect/index.js
let app = getApp();
const selectApi = require('../../../service/select')
Page({
  data: {
    listUrl: '/applets/user/focused',
    defaultImg: '/static/images/demo/img_lawyer.png',
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.pages.add(this)
    app.setNavColor()
    this.loadList()
  },
  loadList() {
    const appList = this.selectComponent('#app-list')
    appList.setParams(params => {
      params.operateBusiness = 2
      params.operateType = 4
      return params
    })
  },
  updateList(e) {
      this.setData({ list: e.detail })
  },
  imageError(e) {
    var _errImg = e.target.dataset.img
    var _errObj = {}
    _errObj[_errImg] = this.data.defaultImg
    this.setData(_errObj)
  },
  gotoLawyerDetail(e) {
    let { id } = e.currentTarget.dataset
    app.gotoPage('/pages/lawyer/detail/index?id=' + id)
  },
  voiceTap(e) {
    let { id } = e.currentTarget.dataset
    app.gotoPage('/pages/lawyer/voice/index?id=' + id)
  },
  onByOneTap(e) {
    let { id } = e.currentTarget.dataset
    app.gotoPage('/pages/lawyer/oneByOne/index?id=' + id)
  },
  cancelCollect(e) {
    let { id } = e.currentTarget.dataset
    selectApi.cancelAttentionLawyer({ businessId: id }).then(res => {
      let list = this.data.list
      let index = list.findIndex(item => {
        return item.id == id
      })
      list.splice(index, 1)
      this.setData({
        list
      })
    })
  }
})
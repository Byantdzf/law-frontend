// pages/user/collect/index.js
let app = getApp();
Page({
  data: {
    list: [
      {
        id: 1,
        name: '何金宝律师',
        imgUrl: '../../../static/images/demo/wakaka.png',
        score: 4.9,
        desc: '1995年吉林大学法学研究生院毕业后在深圳从事，林大学法学研究生院1995年吉林大学法学研究生院毕业后在深圳从事，林大学法学研究生院......',
        helpers: 249,
        followers: 249
      }, {
        id: 2,
        name: '何金宝律师',
        imgUrl: '../../../static/images/demo/wakaka.png',
        score: 4.9,
        desc: '1995年吉林大学法学研究生院毕业后在深圳从事，林大学法学研究生院......',
        helpers: 249,
        followers: 249
      }, {
        id: 3,
        name: '何金宝律师',
        imgUrl: '../../../static/images/demo/wakaka.png',
        score: 4.9,
        desc: '1995年吉林大学法学研究生院毕业后在深圳从事，林大学法学研究生院......',
        helpers: 249,
        followers: 249
      }
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    let list = this.data.list
    let index = list.findIndex(item => {
      return item.id == id
    })
    list.splice(index, 1)
    this.setData({
      list
    })
  }
})
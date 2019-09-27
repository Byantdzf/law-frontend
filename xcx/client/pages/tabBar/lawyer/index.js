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
    list: [],
    queryParams: {}
  },
  onLoad() {
    app.pages.add(this)
    app.setNavColor()
  },
  updateList(e) {
    this.setData({ list: e.detail })
  },
  keyWordChange({ detail }) {
    this.keyWord = detail.value
  },
  handleSearch() {
    let queryParams = this.data.queryParams
    if (this.keyWord || this.keyWord === 0) {
      this.setData({
        queryParams: Object.assign(queryParams, { keyWord: this.keyWord })
      })
    } else {
      delete queryParams.keyWord
      this.setData({ queryParams })
    }
  },
  gotoLawyerDetail(e) {
    let { id } = e.currentTarget.dataset
    app.gotoPage('/pages/lawyer/detail/index?id=' + id)
  },
  ask(){
    
  },
  voiceTap(e) {
    let { id } = e.currentTarget.dataset
    app.gotoPage('/pages/lawyer/voice/index?id=' + id)
  },
  onByOneTap(e) {
    let { id } = e.currentTarget.dataset
    app.gotoPage('/pages/lawyer/oneByOne/index?id=' + id)
  },
})
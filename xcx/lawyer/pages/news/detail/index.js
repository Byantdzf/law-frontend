
const app = getApp();
const selectApi = require('../../../service/select')

Page({
  data: {
    id: null,
    item: {},
  },
  onLoad(e) {
    app.pages.add(this)
    app.setNavColor()
    this.setData({ id: e.id })
  },
  onShow() {
    this.loadData()
  },
  loadData() {
    let id = this.data.id
    selectApi.newsDetails({id: id}).then(res => {
      let item = res.data || {};
      this.setData({ item })
    })
  }
})
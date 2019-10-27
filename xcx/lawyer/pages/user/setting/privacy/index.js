
const app = getApp();
Page({
  data: {
    id: null,
    item: {},
  },
  onLoad(e) {
    app.pages.add(this)
    app.setNavColor()

    this.setData({ id: e.id })
    this.loadData()
  },
  loadData() {
    let id = this.data.id

    let item = {
      name: '',
      content: '',
      updateTime: ''
    }

    this.setData({
      item
    })
  }
})
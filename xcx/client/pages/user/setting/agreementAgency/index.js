const app = getApp();
import {agreement} from './agreement'

Page({
  data: {
    item: {},
  },
  onLoad() {
    app.pages.add(this)
    app.setNavColor()
    this.loadData()
  },
  loadData() {
    this.setData({
      item: agreement
    })
  }
})

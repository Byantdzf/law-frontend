const app = getApp();
import {agreement} from '../../../../utils/agreement'

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
    console.log(agreement)
  },
  loadData() {
    let id = this.data.id
    let item = {
      name: '',
      content: agreement,
      updateTime: ''
    }
    this.setData({
      item: agreement
    })
  }
})

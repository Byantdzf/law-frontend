
const app = getApp();
Page({
  data: {
    list: [],
    queryParams: '',
    listUrl: '/applets/user/article/list',
    defaultPic: '/static/images/errorImage.jpg'
  },
  onLoad() {
    app.pages.add(this)
    app.setNavColor()
    
    this.loadData()
  },
  loadData() {
      const appList = this.selectComponent('#app-list')
      appList.setParams(params => {
        if (this.keyWord) {
          params.keyWord = this.keyWord
        } else {
          delete params.keyWord
        }
          return params
      })
  },
  imageError(e) {
      var _errImg = e.target.dataset.img
      var _errObj = {}
      _errObj[_errImg] = this.data.defaultPic
      this.setData(_errObj)
  },
  updateList(e) {
      this.setData({ list: e.detail })
  },
  gotoDetail(e) {
    let { id } = e.currentTarget.dataset
    app.gotoPage('/pages/news/detail/index?id=' + id)
  },
  gotoSearch() {
    app.gotoPage('/pages/search/index/index')
  },
  handleKeyWordChange(e) {
    this.keyWord = e.detail.value
  },
  handleSearch(e) {
    this.loadList()
  }
})
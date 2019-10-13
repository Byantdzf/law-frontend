const app = getApp();
Page({
    data: {
        listUrl: '/applets/user/msg/list',
        list: [],
    },
    onLoad() {
        app.pages.add(this)
        app.setNavColor()

        const appList = this.selectComponent('#app-list')
        appList.setParams()
    },
    updateList(e) {
        this.setData({ list: e.detail })
    },
    imageError(e) {
        var _errImg = e.target.dataset.img
        var _errObj = {}
        _errObj[_errImg] = "/static/images/errorImage.jpg"
        this.setData(_errObj)
    },
    gotoDetail(e) {
        let { id } = e.currentTarget.dataset
        app.gotoPage('/pages/message/detail/index?id=' + id)
    },
})
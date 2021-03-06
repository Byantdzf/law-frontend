const app = getApp();
Page({
    data: {
        defaultImg: '/static/images/demo/img_lawyer.png',
        listUrl: '',
        list: [],
    },
    onLoad(e) {
        let { id } = e
        app.pages.add(this)
        app.setNavColor()
        let listUrl = '/applets/user/msg/details/' + id
        this.setData({ listUrl })
    },
    onShow() {
        const appList = this.selectComponent('#app-list')
        appList.setParams()
    },
    updateList(e) {
        this.setData({ list: e.detail })
    },
    imageError(e) {
        var _errImg = e.target.dataset.img
        var _errObj = {}
        _errObj[_errImg] = "/static/images/demo/default.jpg"
        this.setData(_errObj)
    },
})
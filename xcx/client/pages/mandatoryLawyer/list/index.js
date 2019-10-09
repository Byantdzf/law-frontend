// pages/mandatoryLawyer/list/index.js
const app = getApp();
const legalServices = require('../../../service/legalServices')
const { PAGE_KEY, SIZE_KEY } = require('../../../config/global')
Page({
    data: {
        type: 1,
        listUrl: '/applets/user/service/info/1/1',
        intro: {},
        list: []
    },
    onLoad(e) {
        let { type } = e
        app.pages.add(this)

        this.setData({
            type
        })
        this.loadList()
    },
    loadList() {
        const appList = this.selectComponent('#app-list')
        appList.setParams(params => {
            return params
        })
    },
    imageError(e) {
        var _errImg = e.target.dataset.img
        var _errObj = {}
        _errObj[_errImg] = "/static/images/errorImage.jpg"
        this.setData(_errObj)
    },
    updateList(e) {
        this.setData({ list: e.detail })
    },
    showDetails(e) {
        let { id } = e.currentTarget.dataset
        app.gotoPage('/pages/mandatoryLawyer/detail/index?id=' + id)
    },
    buyNow(e) {
        let { id } = e.currentTarget.dataset
        app.gotoPage('/pages/issue/mandatoryLawyer/index?id=' + id)
    }
})
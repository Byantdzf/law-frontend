// pages/mandatoryLawyer/list/index.js
const app = getApp();
// const legalServices = require('../../../service/legalServices')
// const { PAGE_KEY, SIZE_KEY } = require('../../../config/global')
const selectApi = require('../../../service/select')
Page({
    data: {
        type: 31,
        baseUrl: '/applets/user/service/info/3',
        intro: {},
        list: []
    },
    onLoad(e) {
        let { type } = e
        app.pages.add(this)

        this.setData({
            type
        })
        this.loadData()
        this.loadList()
    },
    loadData() {
        selectApi.platformService({ dictCode: this.data.type }).then(res => {
            let intro = res.data || {}
            this.setData({ intro })
        })
    },
    loadList() {
        const appList = this.selectComponent('#app-list')
        appList.setParams(params => {
            params.serviceType = this.data.type
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
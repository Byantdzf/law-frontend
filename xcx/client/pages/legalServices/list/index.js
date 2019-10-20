// pages/legalServices/list/index.js
const app = getApp();
const legalServices = require('../../../service/legalServices')
const { PAGE_KEY, SIZE_KEY } = require('../../../config/global')
Page({
    data: {
        type: 21,
        baseUrl: '/applets/user/service/info/2/',
        listUrl: '',
        types: [
            {
                id: 21,
                name: '日常法律服务'
            },
            {
                id: 22,
                name: '分块法律服务'
            }
        ],
        intro: {},
        list: []
    },
    onLoad(e) {
        let { type } = e
        app.pages.add(this)

        let listUrl = this.data.baseUrl + type

        this.setData({
            type,
            listUrl
        })

        this.loadData()
    },
    loadData() {
        let params = {}
        params[PAGE_KEY] = 1
        params[SIZE_KEY] = 1
        params.url = this.data.listUrl
        legalServices.query(params).then(res => {
            let intro = res.data.list[0] || {}
            this.setData({ intro })
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
    changeType(e) {
        let type = e.detail
        let listUrl = this.data.baseUrl + type
        this.setData({
            type,
            listUrl
        })
        this.loadList()
    },
    updateList(e) {
        this.setData({ list: e.detail })
    },
    showDetails(e) {
        let { id } = e.currentTarget.dataset
        app.gotoPage('/pages/legalServices/detail/index?id=' + id)
    },
    buyNow(e) {
        let { id } = e.currentTarget.dataset
        app.gotoPage('/pages/issue/legalServices/index?id=' + id)
    }
})
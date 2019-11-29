// pages/legalServices/list/index.js
const app = getApp();
const legalServices = require('../../../service/legalServices')
const { PAGE_KEY, SIZE_KEY } = require('../../../config/global')
const selectApi = require('../../../service/select')
Page({
    data: {
        type: 21,
        baseUrl: '/applets/user/service/info/2',
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

        this.setData({
            type
        })

        this.loadData()
    },
    loadData() {
        // let params = {}
        // params[PAGE_KEY] = 1
        // params[SIZE_KEY] = 1
        // params.url = this.data.baseUrl
        // params.serviceType = this.data.type
        // legalServices.query(params).then(res => {
        //     let intro = res.data.list[0] || {}
        //     this.setData({ intro })
        // })
        selectApi.platformService({ dictCode: this.data.type }).then(res => {
            let intro = res.data || {}
            this.setData({ intro })
        })
        this.loadList()
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
    changeType(e) {
        let type = e.detail
        this.setData({
            type
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
        app.gotoPage('/pages/issue/legalServices/index?id=' + id + '&t=1')
    }
})
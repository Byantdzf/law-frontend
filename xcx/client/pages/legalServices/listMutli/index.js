// pages/legalServices/list/index.js
const app = getApp();
const legalServices = require('../../../service/legalServices')
const selectApi = require('../../../service/select')
const { PAGE_KEY, SIZE_KEY } = require('../../../config/global')
Page({
    data: {
        type: 22,
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
        list: [],
        cartList: [],
        cartNameList: []
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
        app.gotoPage('/pages/issue/legalServices/index?ids=' + id)
    },
    addCart(e) {
        let { id } = e.currentTarget.dataset
        let cartList = this.data.cartList
        let cartNameList = this.data.cartNameList
        let dataList = this.data.list
        let total = this.data.total || 0
        let index = cartList.findIndex(item => {
            return id == item
        })
        if (index == -1) {
            cartList.push(id)
            let dataIndex = dataList.findIndex(item => {
                return id == item.id
            })
            dataList[dataIndex].addCart = 1
            cartNameList.push(dataList[dataIndex].title)
            total += dataList[dataIndex].price
        }
        this.setData({
            total,
            cartList,
            list: dataList,
            cartNameStr: cartNameList.join(',')
        })
    },
    removeCart(e) {
        let { id } = e.currentTarget.dataset
        let cartList = this.data.cartList
        let cartNameList = this.data.cartNameList
        let dataList = this.data.list
        let total = this.data.total || 0
        let index = cartList.findIndex(item => {
            return id == item
        })
        if (index != -1) {
            cartList.splice(index, 1)
            cartNameList.splice(index, 1)
            let dataIndex = dataList.findIndex(item => {
                return id == item.id
            })
            dataList[dataIndex].addCart = 0
            total -= dataList[dataIndex].price
        }
        this.setData({
            total,
            cartList,
            list: dataList,
            cartNameStr: cartNameList.join(',')
        })
    },
    buyMutliNow() {
        let ids = this.data.cartList.join(',')
        app.gotoPage('/pages/issue/legalServices/index?ids=' + ids)
    }
})
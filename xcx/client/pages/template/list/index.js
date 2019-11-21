// pages/template/list/index.js
const app = getApp();
const selectApi = require('../../../service/select')
const userApi = require('../../../service/user')
Page({
    data: {
        type: '',
        listUrl: '/applets/user/template/list',
        list: [],
        types: [{
            key: '',
            value: '全部'
        }],
        queryParams: {},
        defaultImg: '/static/images/errorImage.jpg'
    },
    onLoad(e) {
        let { type } = e
        app.pages.add(this)

        // 获取问题类型
        selectApi.getQuestionType().then(res => {
            let types = [...this.data.types, ...res.data]
            types.forEach(item => {
                item.id = item.key
                item.name = item.value
            })
            this.setData({
                types
            })
        })
        this.loadList()
    },
    loadList() {
        const appList = this.selectComponent('#app-list')
        appList.setParams(params => {
            params.businessTypes = this.data.type
            return params
        })
    },
    updateList(e) {
        this.setData({ list: e.detail })
    },
    imageError(e) {
        var _errImg = e.target.dataset.img
        var _errObj = {}
        _errObj[_errImg] = this.data.defaultImg
        this.setData(_errObj)
    },
    changeType(e) {
        let type = e.detail
        this.setData({
            type
        })
        this.loadList()
    },
    showDetails(e) {
        let { id } = e.currentTarget.dataset
        app.gotoPage('/pages/template/detail/index?id=' + id)
    },
    buyNow(e) {
        let { id } = e.currentTarget.dataset

        // 获取地址完成以后再判断授权
        let page = this.selectComponent('#app-page')
        page.checkAuth().then((data) => {
            // 授权成功
            let index = this.data.list.findIndex(items => {
                return items.id == id
            })
            let params = {}
            params.chooseService = id
            params.fileType = this.data.list[index].businessTypeName
            params.form = 1
            params.orderCategory = 41
            params.amount = this.data.list[index].price
            userApi.postTemplate(params).then(res => {
                app.wechatPay(res.data, function (res) {
                    app.gotoPage('/pages/issue/success/index?type=5&id=' + id)
                }, function (res) {
                    app.alert('支付失败，请到我的订单再次发起支付')
                })
            })
        }).catch((e) => {
            // 授权失败
            console.log('auth reject')
            console.log(e)
        });
    }
})
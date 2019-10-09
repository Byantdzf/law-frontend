// pages/template/list/index.js
const app = getApp();
const selectApi = require('../../../service/select')
Page({
    data: {
        type: 0,
        listUrl: '/applets/user/template/list',
        list: [],
        types: [{
            key: 0,
            value: '全部'
        }],
        queryParams: {},
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
            return params
        })
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
        app.gotoPage('/pages/issue/success/index?type=5')
    }
})
// pages/template/list/index.js
const app = getApp();
const template = require('../../../static/data/template')
const selectApi = require('../../../service/select')
Page({
    data: {
        type: 1,
        list: [],
        types: [{
            key: 0,
            value: '全部'
        }],
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

        this.setData({
            list: template.default.list,
            type
        })
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
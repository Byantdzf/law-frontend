// pages/legalServices/list/index.js
const app = getApp();
const legalServices = require('../../../static/data/legalServices')
Page({
    data: {
        type: 1,
        types: [
            {
                id: 1,
                name: '非诉讼法律服务'
            },
            {
                id: 2,
                name: '诉讼法律服务'
            }
        ],
        intro: {},
        list: [],
    },
    onLoad(e) {
        let { type } = e
        app.pages.add(this)

        this.setData({
            intro: legalServices.default.intro,
            list: legalServices.default.list,
            type
        })
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
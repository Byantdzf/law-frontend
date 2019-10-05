// pages/lawyer/detail/index.js
const app = getApp();
const legalServices = require('../../../static/data/legalServices')
Page({
    data: {
        details: {}
    },
    onLoad(e) {
        let { id } = e
        app.pages.add(this)

        this.setData({
            details: legalServices.default.details,
            id
        })
    },
    buyNow() {
        app.gotoPage('/pages/issue/legalServices/index?id=' + this.data.id)
    }
})
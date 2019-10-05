// pages/lawyer/detail/index.js
const app = getApp();
const template = require('../../../static/data/template')
Page({
    data: {
        details: {}
    },
    onLoad(e) {
        let { id } = e
        app.pages.add(this)

        this.setData({
            details: template.default.details,
            id
        })
    },
    buyNow() {
        app.gotoPage('/pages/issue/success/index?type=5')
    }
})
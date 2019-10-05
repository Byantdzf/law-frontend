// pages/mandatoryLawyer/list/index.js
const app = getApp();
const mandatoryLawyer = require('../../../static/data/mandatoryLawyer')
Page({
    data: {
        intro: {},
        list: [],
    },
    onLoad(e) {
        app.pages.add(this)

        this.setData({
            list: mandatoryLawyer.default.list
        })
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
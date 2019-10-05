// pages/mandatoryLawyer/detail/index.js
const app = getApp();
const mandatoryLawyer = require('../../../static/data/mandatoryLawyer')
Page({
    data: {
        list: [],
        id: null,
        details: {}
    },
    onLoad(e) {
        let { id } = e
        app.pages.add(this)

        let list = mandatoryLawyer.default.list
        let index = list.findIndex(item => {
            return item.id == id
        })

        this.setData({
            list,
            details: list[index],
            id
        })
    },
    buyNow() {
        app.gotoPage('/pages/issue/mandatoryLawyer/index?id=' + this.data.id)
    }
})
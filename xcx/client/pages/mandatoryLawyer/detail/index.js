// pages/mandatoryLawyer/detail/index.js
const app = getApp();
const legalServices = require('../../../service/legalServices')
Page({
    data: {
        details: {}
    },
    onLoad(e) {
        let { id } = e
        app.pages.add(this)

        legalServices.getById({id: id}).then(res => {
            this.setData({
                details: res.data,
                id
            })
        })
    },
    buyNow() {
        app.gotoPage('/pages/issue/mandatoryLawyer/index?id=' + this.data.id)
    }
})
// pages/mandatoryLawyer/list/index.js
const app = getApp();
const selectApi = require('../../../service/select')
Page({
    data: {
        listUrl: '/applets/user/global/search',
        lawyerImg: '/static/images/demo/img_lawyer.png',
        newsImg: '/static/images/errorImage.jpg',
        keywords: '',
        list: []
    },
    onLoad(e) {
        let { t } = e
        app.pages.add(this)

        this.setData({
            keywords: t
        })
        this.loadList()
    },
    loadList() {
        const appList = this.selectComponent('#app-list')
        appList.setParams(params => {
            params.keyWord = this.data.keywords
            params.isSearch = 1
            return params
        })
    },
    gotoSearch(e) {
        let name = e.detail.value
        let history = wx.getStorageSync('history') || []
        history = [...history, name]
        history.length > 10 && history.splice(0, 1)
        wx.setStorageSync('history', history)
        this.setData({
            keywords: name
        })
        this.loadList()
    },
    imageError(e) {
        var _errImg = e.target.dataset.img
        var _errObj = {}
        _errObj[_errImg] = this.data.lawyerImg
        this.setData(_errObj)
    },
    newsImageError(e) {
        var _errImg = e.target.dataset.img
        var _errObj = {}
        _errObj[_errImg] = this.data.newsImg
        this.setData(_errObj)
    },
    updateList(e) {
        console.log(e.detail)
        this.setData({ list: e.detail })
    },
    gotoNewsDetails(e) {
        let { id } = e.currentTarget.dataset
        app.gotoPage('/pages/news/detail/index?id=' + id)
    },
    gotoLawyerDetails(e) {
        let { id } = e.currentTarget.dataset
        app.gotoPage('/pages/lawyer/detail/index?id=' + id)
    },
    collect(e) {
        let { id } = e.currentTarget.dataset
        let list = this.data.list
        let index = list.findIndex(item => {
            return id == item.id
        })
        let items = list[index]
        selectApi.attentionLawyer({businessId: id}).then(res => {
            this.getLawyerList()
        })
    },
    voiceTap(e) {
        let { id } = e.currentTarget.dataset
        app.gotoPage('/pages/lawyer/voice/index?id=' + id)
    },
    onByOneTap(e) {
        let { id } = e.currentTarget.dataset
        app.gotoPage('/pages/lawyer/oneByOne/index?id=' + id)
    },
})

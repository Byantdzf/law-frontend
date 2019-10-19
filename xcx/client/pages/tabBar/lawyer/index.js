// const orderModel = require('../../../model/order/index.js');
const app = getApp();
const selectApi = require('../../../service/select')
Page({
    data: {
        currArea: [],
        types: [{
            key: '',
            value: '全部'
        }],
        sorts: [
            {
                id: 1,
                name: '默认排序',
                code: '',
                value: '',
                curr: true
            },
            {
                id: 2,
                name: '评分高低',
                code: 'score',
                value: ''
            },
            {
                id: 3,
                name: '帮助人数',
                code: 'helps',
                value: ''
            },
            {
                id: 4,
                name: '关注人数',
                code: 'concerns',
                value: ''
            }
        ],
        list: [],
        type: '',
    },
    onLoad() {
        const currArea = app.globalData.adInfo ? [app.globalData.adInfo.province.replace('省', ''), app.globalData.adInfo.city.replace('市', '')] : []
        app.pages.add(this)
        app.setNavColor()
        this.setData({ currArea })
        
        let cityPicker = this.selectComponent('#app-cityPicker')
        cityPicker.init(currArea)

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
            params.city = this.data.currArea[1] || ''
            params.goodAt = this.data.type
            this.data.sorts.forEach((item, i) => {
                if (item.curr && item.code) {
                    params.orderBy = item.code + ' desc'
                }
            })
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
    changeOrder(e) {
        let { index } = e.currentTarget.dataset
        let sorts = this.data.sorts
        sorts.forEach((item, i) => {
            if (index == i) {
                item.curr = true
                i > 0 && (item.value = '0')
            } else {
                item.curr = false
                item.value = ''
            }
        })
        this.setData({
            sorts
        })
        this.loadList()
    },
    updateList(e) {
        this.setData({ list: e.detail })
    },
    gotoSearch() {
        app.gotoPage('/pages/search/index/index')
    },
    gotoLawyerDetail(e) {
        let { id } = e.currentTarget.dataset
        app.gotoPage('/pages/lawyer/detail/index?id=' + id)
    },
    collect() {

    },
    voiceTap(e) {
        let { id } = e.currentTarget.dataset
        app.gotoPage('/pages/lawyer/voice/index?id=' + id)
    },
    onByOneTap(e) {
        let { id } = e.currentTarget.dataset
        app.gotoPage('/pages/lawyer/oneByOne/index?id=' + id)
    },
    getCityResult(e) {
        let city = e.detail[1].name
        this.setData({
            currArea: [e.detail[0].name.replace('省', ''), e.detail[1].name.replace('市', '')]
        })
        app.getCityLocation(e.detail[0].name, e.detail[1].name)
        this.loadList()
    },
    imageError(e) {
        var _errImg = e.target.dataset.img
        var _errObj = {}
        _errObj[_errImg] = "/static/images/demo/img_lawyer.png"
        this.setData(_errObj)
    }
})
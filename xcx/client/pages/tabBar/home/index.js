const app = getApp()
const selectApi = require('../../../service/select')
const { appName, PAGE_KEY, SIZE_KEY } = require('../../../config/global')
let page = null
Page({
    data: {
        currArea: [],
        //图片地址
        banners: [
            '/static/images/demo/banner1.png',
            '/static/images/demo/banner2.png',
            '/static/images/demo/banner3.png'
        ],
        list: [],
        hotNews: [],
        tools: [
            {
                name: '在线律师咨询',
                url: '/pages/issue/voice/index',
                icon: '/static/images/icon-menu01.png'
            }, {
                name: '指定律师咨询',
                url: '/pages/issue/oneByOne/index',
                icon: '/static/images/icon-menu02.png'
            }, {
                name: '日常法律服务',
                url: '/pages/legalServices/list/index?type=21',
                icon: '/static/images/icon-menu03.png'
            }, {
                name: '分块法律服务',
                url: '/pages/legalServices/list/index?type=22',
                icon: '/static/images/icon-menu04.png'
            }, {
                name: '收费代理',
                url: '/pages/mandatoryLawyer/list/index?type=31',
                icon: '/static/images/icon-menu05.png'
            }, {
                name: '风险代理',
                url: '/pages/mandatoryLawyer/list/index?type=32',
                icon: '/static/images/icon-menu06.png'
            }, {
                name: '协议文本',
                url: '/pages/template/list/index',
                icon: '/static/images/icon-menu07.png'
            }, {
                name: '律师精选',
                type: 'tab',
                url: '/pages/tabBar/lawyer/index',
                icon: '/static/images/icon-menu08.png'
            }
        ],
        showTools: false
    },
    onLoad() {
        app.pages.add(this)
        app.setNavColor()
        app.setNavTitle(appName)

        app.getUserLocation(data => {
            const adInfo = data.adInfo || {}
            this.setData({
                currArea: [adInfo.province.replace('省', ''), adInfo.city.replace('市', '')]
            })
            this.initHome()

            // 获取地址完成以后再判断授权
            page = this.selectComponent('#app-page')
            page.checkAuth().then((data) => {
                // 授权成功
                console.log('index auth')
                console.log(data)
            }).catch((e) => {
                // 授权失败
                console.log('index auth reject')
                console.log(e)
            });
        })

        // 获取热门新闻
        let params = {}
        params[PAGE_KEY] = 1
        params[SIZE_KEY] = 5
        selectApi.newsList(params).then(res => {
            let hotNews = res.data.list
            this.setData({ hotNews })
        })
    },
    onShow() {
        
    },
    initHome() {
        let cityPicker = this.selectComponent('#app-cityPicker')
        cityPicker.init(this.data.currArea)
        this.getLawyerList()
    },
    getLawyerList() {
        // 获取本地律师
        let lawyerParams = {}
        lawyerParams[PAGE_KEY] = 1
        lawyerParams[SIZE_KEY] = 5
        lawyerParams.city = this.data.currArea[1] || ''
        // lawyerParams.city = 'shenzhen'
        selectApi.lawyerList(lawyerParams).then(res => {
            let list = res.data.list
            this.setData({ list })
        })
    },
    handleToolBtnTap(e) {
        this.setData({
            showTools: !this.data.showTools
        })
    },
    handleClosePop() {
      this.setData({
        showTools: false
      })
    },
    gotoLawyerDetail(e) {
        let { id } = e.currentTarget.dataset
        app.gotoPage('/pages/lawyer/detail/index?id=' + id)
    },
    imageError(e) {
        var _errImg = e.target.dataset.img
        var _errObj = {}
        _errObj[_errImg] = "/static/images/demo/img_lawyer.png"
        this.setData(_errObj)
    },
    collect(e) {
        let { id } = e.currentTarget.dataset
        let list = this.data.list
        let index = list.findIndex(item => {
            return id == item.id
        })
        let items = list[index]
        selectApi.attentionLawyer({businessId: id}).then(res => {
            console.log(res)
        })
        // if (items.concerns)
    },
    voiceTap(e) {
        let { id } = e.currentTarget.dataset
        app.gotoPage('/pages/lawyer/voice/index?id=' + id)
    },
    onByOneTap(e) {
        let { id } = e.currentTarget.dataset
        app.gotoPage('/pages/lawyer/oneByOne/index?id=' + id)
    },
    tapTools(e) {
        let { url, type } = e.currentTarget.dataset
        this.handleClosePop()
        app.gotoPage(url, type)
    },
    gotoSearch() {
        app.gotoPage('/pages/search/index/index')
    },
    getCityResult(e) {
        this.setData({
            currArea: [e.detail[0].name.replace('省', ''), e.detail[1].name.replace('市', '')]
        })
        app.getCityLocation(e.detail[0].name, e.detail[1].name)
        this.initHome()
    }
})

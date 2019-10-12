const app = getApp()
const selectApi = require('../../../service/select')
const { PAGE_KEY, SIZE_KEY } = require('../../../config/global')
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
        list: [
            // {
            //     id: 1,
            //     name: '何金宝律师',
            //     imgUrl: '../../../static/images/demo/wakaka.png',
            //     score: 4.9,
            //     desc: '1995年吉林大学法学研究生院毕业后在深圳从事，林大学法学研究生院1995年吉林大学法学研究生院毕业后在深圳从事，林大学法学研究生院......',
            //     helpers: 249,
            //     followers: 249
            // }, {
            //     id: 2,
            //     name: '何金宝律师',
            //     imgUrl: '../../../static/images/demo/wakaka.png',
            //     score: 4.9,
            //     desc: '1995年吉林大学法学研究生院毕业后在深圳从事，林大学法学研究生院......',
            //     helpers: 249,
            //     followers: 249
            // }, {
            //     id: 3,
            //     name: '何金宝律师',
            //     imgUrl: '../../../static/images/demo/wakaka.png',
            //     score: 4.9,
            //     desc: '1995年吉林大学法学研究生院毕业后在深圳从事，林大学法学研究生院......',
            //     helpers: 249,
            //     followers: 249
            // }
        ],
        hotNews: [
            // {
            //   id: 1,
            //   imgUrl: '/static/images/demo/banner1.png',
            //   title: '劳务合同纠纷风起云涌',
            //   content: '劳务合同纠纷风起云涌'
            // }, {
            //   id: 2,
            //   imgUrl: '/static/images/demo/banner2.png',
            //   title: '劳务合同纠纷风起云涌',
            //   content: '劳务合同纠纷风起云涌'
            // }, {
            //   id: 3,
            //   imgUrl: '/static/images/demo/banner3.png',
            //   title: '劳务合同纠纷风起云涌',
            //   content: '劳务合同纠纷风起云涌'
            // }, {
            //   id: 4,
            //   imgUrl: '/static/images/demo/banner1.png',
            //   title: '劳务合同纠纷风起云涌',
            //   content: '劳务合同纠纷风起云涌'
            // }
        ],
        tools: [
            {
                name1: '语音',
                name2: '咨询',
                url: '/pages/issue/voice/index',
                icon: 'icon-yuyin',
                iconBg: '#00b0ab'
            }, {
                name1: '1对1',
                name2: '咨询',
                url: '/pages/issue/oneByOne/index',
                icon: 'icon-feature',
                iconBg: '#00A2FF'
            }, {
                name1: '非诉讼',
                name2: '服务',
                url: '/pages/legalServices/list/index?type=1',
                icon: 'icon-feisusongzhuanxiang',
                iconBg: '#00b0ab'
            }, {
                name1: '诉讼',
                name2: '服务',
                url: '/pages/legalServices/list/index?type=2',
                icon: 'icon-susong',
                iconBg: '#F64335'
            }, {
                name1: '收费',
                name2: '委托',
                url: '/pages/mandatoryLawyer/list/index?type=1',
                icon: 'icon-shoufei',
                iconBg: '#FFD200'
            }, {
                name1: '风险',
                name2: '委托',
                url: '/pages/mandatoryLawyer/list/index?type=2',
                icon: 'icon-fengxian',
                iconBg: '#F9879A'
            }, {
                name1: '协议',
                name2: '模版',
                url: '/pages/template/list/index',
                icon: 'icon-xieyi',
                iconBg: '#15B774'
            }
        ],
        showTools: false
    },
    onLoad() {
        app.pages.add(this)
        app.setNavColor()
        app.setNavTitle('虎甲律师咨询平台')

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
            console.log(hotNews)
            this.setData({ hotNews })
        })
        console.log('adInfo:')
        console.log(app.globalData.adInfo)
    },
    onShow() {
        console.log('home show')
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
            console.log(list)
            this.setData({ list })
        })
    },
    handleToolBtnTap(e) {
        this.setData({
            showTools: !this.data.showTools
        })
    },
    gotoLawyerDetail(e) {
        let { id } = e.currentTarget.dataset
        app.gotoPage('/pages/lawyer/detail/index?id=' + id)
    },
    imageError(e) {
        var _errImg = e.target.dataset.img
        var _errObj = {}
        _errObj[_errImg] = "/static/images/errorImage.jpg"
        this.setData(_errObj)
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
    tapTools(e) {
        let { url } = e.currentTarget.dataset
        app.gotoPage(url)
    },
    gotoSearch() {
        app.gotoPage('/pages/search/index/index')
    },
    getCityResult(e) {
        let city = e.detail[1].name
        this.setData({
            currArea: [e.detail[0].name.replace('省', ''), e.detail[1].name.replace('市', '')]
        })
        app.getCityLocation(city)
        this.initHome()
    }
})

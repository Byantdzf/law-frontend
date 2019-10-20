const app = getApp()
const selectApi = require('../../../service/select')
const orderApi = require('../../../service/order')
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
      }
    ],
    showTools: false,
    orderTypeMap: {},
    orderCategoryMap: {},
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
            console.log(data)
        }).catch((e) => {
            // 授权失败
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
    this.getOrderList()
  },
  getOrderList() {
    // 获取本地律师
    let params = {}
    params[PAGE_KEY] = 1
    params[SIZE_KEY] = 5
    params.city = this.data.currArea[1] || ''
    // params.city = 'shenzhen'
    orderApi.orderList(params).then(res => {
        let list = res.data.list || []
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

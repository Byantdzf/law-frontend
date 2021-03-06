const app = getApp()
const selectApi = require('../../../service/select')
const orderApi = require('../../../service/order')
const { appName, PAGE_KEY, SIZE_KEY } = require('../../../config/global')
let page = null
Page({
  data: {
    currArea: [],
    //图片地址
    banners: [],
    list1: [],
    list2: [],
    list4: [],
    hotNews1: [],
    hotNews2: [],
    hotNews3: [],
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
    questionTypeMap: {}
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

      // this.getNewsData()
      // this.initHome()
      
      // 获取地址完成以后再判断授权
			page = this.selectComponent('#app-page')
			page.checkAuth().then((data) => {
				// 授权成功
				console.log(data)
				let { encryptedData, iv, userInfo } = data;
				page.userLogin({ encryptedData, iv, userInfo }).then(res => {
					this.getNewsData()
					this.initHome()
				})
			}).catch((e) => {
				// 授权失败
				page.userLogin({ encryptedData, iv, userInfo }).then(res => {
					this.getNewsData()
					this.initHome()
				})
			})
    })
  },

  initHome() {
    let cityPicker = this.selectComponent('#app-cityPicker')
    cityPicker.init(this.data.currArea)

    selectApi.data({ dictCode: 'QuestionType' }).then(res => {
      const items = res.data || []
      let questionTypeMap = {}

      items.forEach(v => {
        questionTypeMap[v.code] = v.name
      })

      this.setData({ questionTypeMap })

      this.getOrderList(1)
      this.getOrderList(2)
      this.getOrderList(4)
    });

    this.getBanners();
  },
  // 获取banners
  getBanners() {
    selectApi.advertisementList({ terminal: 4, location: 1 }).then(res => {
      let banners = (res.data || []).map(v => v.coverPhoto)
      this.setData({ banners })
    })
  },
  // 获取热门新闻
  getNewsData() {
    let params = {}
    params[PAGE_KEY] = 1
    params[SIZE_KEY] = 5

    selectApi.newsList({ ...params, type: 1 }).then(res => {
      let hotNews1 = res.data.list
      this.setData({ hotNews1 })
    })
    selectApi.newsList({ ...params, type: 2 }).then(res => {
      let hotNews2 = res.data.list
      this.setData({ hotNews2 })
    })
    selectApi.newsList({ ...params, type: 3 }).then(res => {
      let hotNews3 = res.data.list
      this.setData({ hotNews3 })
    })
  },
  getOrderList(orderSource) {
    // 获取本地律师
    let params = {}
    params[PAGE_KEY] = 1
    params[SIZE_KEY] = 10
    params.orderStatus = 20
    params.orderSource = orderSource
    params.city = this.data.currArea[1] || ''
    // params.city = 'shenzhen'
    orderApi.orderList(params).then(res => {
      let list = res.data.list || []
      let listName = 'list' + orderSource
      this.setData({ [listName]: list })
    })
  },
  handleRefreshOrderList(e) {
    const { key } = e.detail
    switch (key) {
      case 'isSystem':
        this.getOrderList(1)
        break;
      case 'isOrders':
        this.getOrderList(2)
        break;
      case 'isFindMe':
        this.getOrderList(4)
        break;
    }
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
  getCityResult(e) {
    this.setData({
      currArea: [e.detail[0].name.replace('省', ''), e.detail[1].name.replace('市', '')]
    })
    app.getCityLocation(e.detail[0].name, e.detail[1].name)
    this.initHome()
  },
  gotoSearch() {
    wx.setStorageSync('searchFocus', 'true')
    app.gotoPage('/pages/tabBar/orders/index', 'tab')
  },
  gotoMsg() {
    app.gotoPage('/pages/message/list/index')
  },
  gotoMoreOrders(e) {
    const { type } = e.currentTarget.dataset
    console.log(type)
    wx.setStorageSync('orderSource', +type)
    app.gotoPage('/pages/tabBar/orders/index', 'tab')
  }
})

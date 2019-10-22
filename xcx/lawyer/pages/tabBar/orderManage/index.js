const app = getApp()
const selectApi = require('../../../service/select')
const { orderType, orderCategory, orderStatus } = require('../../../config/global')
Page({
  data: {
    orderType,
    orderCategory,
    orderStatus,
    questionTypeMap: {},
    curOrderType: -1,
    orderTypes: [
      {
        id: -1,
        name: '全部'
      }
    ],
    listUrl: '/applets/lawyer/order/orderList',
    list: [],
    orderSource: -1,
    orderSources: [
      {
        id: -1,
        name: '全部'
      },
      {
        id: 1,
        name: '系统推送订单'
      },
      {
        id: 2,
        name: '订单池订单'
      },
      {
        id: 4,
        name: '委托我的订单'
      }
    ],
  },
  onLoad() {
    const currArea = app.globalData.adInfo ? [app.globalData.adInfo.province.replace('省', ''), app.globalData.adInfo.city.replace('市', '')] : []

    this.currArea = currArea || []
    
    app.pages.add(this)
    app.setNavColor()
    
    selectApi.data({ dictCode: 'QuestionType' }).then(res => {
      const items = res.data || []
      let questionTypeMap = {}

      items.forEach(v => {
        v.id = v.code
        questionTypeMap[v.code] = v.name
      })

      this.setData({
        questionTypeMap
      })
      this.loadList()
    });

  },
  loadList() {

    let orderSource = this.data.orderSource || -1
    let curOrderType = this.data.curOrderType || -1

    if (!this.appList) {
      this.appList = this.selectComponent('#app-list')
    }

    this.appList.setParams(params => {
      params.onlyLawyerOwner = 'Y'

      if (this.currArea && this.currArea.length) {
        params.city = this.currArea[1] || ''
      }

      if (orderSource != -1) {
        params.orderSource = orderSource
      } else {
        delete params.orderSource
      }
      if (curOrderType != -1) {
        params.orderType = curOrderType
      } else {
        delete params.orderType
      }

      return params;
    });
  },
  handleOrderSourceChange(e) {
    this.setData({ orderSource: e.detail })
    this.loadList()
  },
  handleOrderTypeChange(e) {
    this.data.curOrderType = e.detail
    this.loadList()
  },
  updateList(e) {
    this.setData({ list: e.detail })
  }
})
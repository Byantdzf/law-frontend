const app = getApp()
const selectApi = require('../../../service/select')
const { orderType, orderCategory, orderStatus } = require('../../../config/global')
Page({
  data: {
    currArea: [],
    orderType,
    orderCategory,
    orderStatus,
    questionTypes: [],
    questionTypeMap: {},
    currQuestionType: -1,
    selectAllObj: {id: '', name: '全部', checked: true},
    listUrl: '/applets/user/order/orderList',
    list: [],
    orderSource: 2,
    orderSources: [
      {
        id: 1,
        name: '推荐订单'
      },
      {
        id: 2,
        name: '订单池'
      },
      {
        id: 4,
        name: '找到我的'
      }
    ],
    sorts: [
      {
        id: 1,
        name: '默认排序'
      },
      {
        id: 2,
        name: '发布时间'
      },
      {
        id: 3,
        name: '金额'
      },
      {
        id: 4,
        name: '距离'
      }
    ],
  },
  onLoad({ orderSource = 2 }) {
    const currArea = app.globalData.adInfo ? [app.globalData.adInfo.province.replace('省', ''), app.globalData.adInfo.city.replace('市', '')] : []
    let cityPicker = this.selectComponent('#app-cityPicker')

    cityPicker.init(currArea)
    app.pages.add(this)
    app.setNavColor()
    this.setData({ currArea, orderSource })

    selectApi.data({ dictCode: 'QuestionType' }).then(res => {
      const items = res.data || []
      let questionTypeMap = {}

      items.forEach(v => {
        v.id = v.code
        questionTypeMap[v.code] = v.name
      })

      this.setData({
        questionTypeMap,
        questionTypes: [{id: -1, name: '全部'}].concat(items)
      })
      this.loadList()
    });

  },
  loadList() {
    if (!this.appList) {
      this.appList = this.selectComponent('#app-list');
    }
    let currQuestionType = this.data.currQuestionType || -1

    this.appList.setParams(params => {
      params.orderSource = this.data.orderSource

      if (currQuestionType != -1) {
        params.questionType = currQuestionType
      } else {
        delete params.questionType
      }

      return params;
    });
  },
  handleOrderSourceChange(e) {
    this.setData({ orderSource: e.detail })
    this.loadList()
  },
  handleQuestionTypeChange(e) {
    this.data.currQuestionType = e.detail
    this.loadList()
  },
  updateList(e) {
    this.setData({ list: e.detail })
  },
  getCityResult(e) {
    this.setData({
        currArea: [e.detail[0].name.replace('省', ''), e.detail[1].name.replace('市', '')]
    })
    app.getCityLocation(e.detail[0].name, e.detail[1].name)
    this.loadList()
  },
  handleRefreshOrderList({ index, type }) {
    switch(type) {
      case 'Forward':
        
        break;
      case 'Refuse':
        
        break;
      case 'Receive':
        
        break;
    }
  }
})
const app = getApp()
const selectApi = require('../../../service/select')
const { PAGE_KEY, orderType, orderCategory, orderStatus } = require('../../../config/global')
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
    listUrl: '/applets/lawyer/my/myFollow',
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
      }
    ],
    curSortIndex: 0,
    curSortBy: '',
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
    searchFocus: false
  },
  onLoad({ orderSource = 2 }) {
    const currArea = app.globalData.adInfo ? [app.globalData.adInfo.province.replace('省', ''), app.globalData.adInfo.city.replace('市', '')] : []
    // let cityPicker = this.selectComponent('#app-cityPicker')

    // cityPicker.init(currArea)
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
  onShow() {
    const searchFocus = wx.getStorageSync('searchFocus')
    this.setData({ searchFocus })
    wx.removeStorageSync('searchFocus')
  },
  loadList() {
    if (!this.appList) {
      this.appList = this.selectComponent('#app-list');
    }
    let currQuestionType = this.data.currQuestionType || -1
    let currArea = this.data.currArea || []

    this.appList.setParams(params => {
      params.orderSource = this.data.orderSource

      if (currArea.length) {
        params.city = currArea[1] || ''
      }

      if (currQuestionType != -1) {
        params.questionType = currQuestionType
      } else {
        delete params.questionType
      }

      if (this.keyWord) {
        params.keyWord = this.keyWord
      } else {
        delete params.keyWord
      }

      let curSortIndex = this.data.curSortIndex
      let curSortBy = this.data.curSortBy

      if (curSortIndex > 0 && curSortBy) {
        let orderBy = {
          1: [10, 11],
          2: [40, 41],
          3: [30, 31],
        }[curSortIndex][curSortBy - 1];

        params.orderBy = orderBy
      } else {
        delete params.orderBy
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
  handleRefreshOrderList(e) {
    const { index, type } = e.detail
    let { list } = this.data
    switch(type) {
      // case 'Focused':
      //   this.setData({
      //     [`list[${ index }].focused`]: 1
      //   })
      //   break;
      // case 'CancelFocused':
      //   this.setData({
      //     [`list[${ index }].focused`]: 0
      //   })
      //   break;
      case 'CancelFocused':
      case 'Refuse':
      case 'Receive':
        list.splice(index, 1)
        this.setData({ list })
        break;
    }
    // this.appList.setParams(params => {
    //   params[PAGE_KEY] = 1
    //   return params
    // })
  },
  handleKeyWordChange(e) {
    this.keyWord = e.detail.value
  },
  handleSearch(e) {
    this.loadList()
  },
  handleSortChange(e) {
    const { index } = e.currentTarget.dataset
    let curSortIndex = this.data.curSortIndex
    let curSortBy = this.data.curSortBy
    if (index > 0) {
      if (curSortIndex == index) {
        if (!curSortBy) {
          curSortBy = 1
        } else if (curSortBy == 1) {
          curSortBy = 2
        } else {
          curSortBy = ''
        }
      } else {
        curSortBy = 1
      }
      this.setData({
        curSortIndex: index,
        curSortBy
      })
    } else {
      this.setData({
        curSortIndex: 0,
        curSortBy: ''
      })
    }

    this.loadList()
  }
})
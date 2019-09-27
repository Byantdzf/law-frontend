const { get } = require('../../utils/ajax.js')
const PAGE_KEY = 'pageNo'
const SIZE_KEY = 'pageSize'

Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  properties: {
    url: String,
    params: Object,
    threshold: {
      type: Number,
      value: 20
    }
  },
  data: {
    list: [],
    hasNextPage: false,
    isLoadMoreLoading: false,
    isPageLoading: true,
    defaultParams: {
      [PAGE_KEY]: 1,
      [SIZE_KEY]: 10,
    }
  },
  observers: {
    list(e) {
      this.triggerEvent('change', e)
    },
    params(e) {
      // 计数，用于避免页面第一次初始化时，在onShow重复调用getList方法
      this.xhrCount = 1
      const { defaultParams } = this.data
      // 传入参数发生改变时
      // 重置为第一页
      defaultParams[[PAGE_KEY]] = 1
      // 清空list
      this.data.list = []
      this.data.isPageLoading = true
      this.getList()
    }
  },

  methods: {
    getList() {
      let { url, defaultParams, params, list, isPageLoading } = this.data
      const queryParams = Object.assign({}, defaultParams, params)
      
      get(url, queryParams, { loading: isPageLoading }).then(res => {
        let { curPage, totalPage, list } = res.data || {}
        list = this.data.list.concat(list)
        // 更新视图不需要的数据，不要用setDate，减少性能消耗
        this.data.hasNextPage = totalPage > curPage
        this.data.isPageLoading = false
        // 更新视图需要的数据
        this.setData({
          list,
          isLoadMoreLoading: false
        })
        this.xhrCount = 0
      }).catch(() => {
        this.setData({ isLoadMoreLoading: false })
        this.data.isPageLoading = false
        this.xhrCount = 0
      })
    },
    loadMore(e) {
      const { hasNextPage, defaultParams, isLoadMoreLoading } = this.data
      if (hasNextPage && !isLoadMoreLoading) {
        defaultParams[[PAGE_KEY]] ++
        this.setData({ isLoadMoreLoading: true })
        this.getList()
      }
    }
  },
  pageLifetimes: {
    show() {
      if (!this.xhrCount) {
        this.data.isPageLoading = true
        this.getList()
      }
    }
  }
})
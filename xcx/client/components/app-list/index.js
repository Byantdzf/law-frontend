const { get } = require('../../utils/ajax.js')
const { isPlainObject } = require('../../utils/tools.js')
const { PAGE_KEY, SIZE_KEY } = require('../../config/global')

Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  properties: {
    // 请求地址
    url: String,
    // 是否进入页面就请求数据
    immediate: Boolean,
    // 距离底部多少触发加载更多
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
    },
    params: {}
  },
  observers: {
    list(e) {
      this.triggerEvent('change', e)
    }
  },

  methods: {
    // 设置请求的额外参数
    setParams(fn, readyToRequest = true) {
      // 第一个参数是一个返回Object的方法
      if (typeof fn !== 'function') return
      let { params, defaultParams } = this.data
      const res = fn(params)

      if (isPlainObject(res)) {
        params = res
      }
      
      if (readyToRequest) {
        // 重置为第一页
        defaultParams[[PAGE_KEY]] = 1
        // 清空list
        this.data.list = []
        this.data.isPageLoading = true
        this.getList(params)
      }
    },
    // 获取列表数据
    getList(params) {
      let { url, defaultParams, list, isPageLoading } = this.data
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
    // 加载更多
    loadMore(e) {
      const { hasNextPage, defaultParams, isLoadMoreLoading } = this.data
      if (hasNextPage && !isLoadMoreLoading) {
        defaultParams[[PAGE_KEY]] ++
        this.setData({ isLoadMoreLoading: true })
        this.getList(this.data.params)
      }
    }
  },
  pageLifetimes: {
    show() {
      if (this.data.immediate) {
        this.data.isPageLoading = true
        this.getList(this.data.params)
      }
    }
  }
})
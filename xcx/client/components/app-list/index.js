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
      value: 50
    }
  },
  data: {
    list: [],
    defaultParams: {
      [PAGE_KEY]: 1,
      [SIZE_KEY]: 15,
    }
  },
  observers: {
    list(e) {
      this.triggerEvent('change', e)
    }
  },

  methods: {
    getList() {
      let { url, defaultParams, params, list } = this.data
      params = Object.assign(defaultParams, params)
      get(url, params).then(res => {
        
      }).catch(err => {

      })
    },
    loadMore(e) {
      
    }
  },
  pageLifetimes: {
    show() {
      this.getList()
    }
  }
})
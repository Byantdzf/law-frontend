Component({
  properties: {
    dataPage: {
      type: Number,
      observer: function (pages) {
        this.getdata(pages)
      }
    },
    url: {
      type: String,
      value: ''
    },

    threshold: {
      type: Number,
      value: 50
    },
    height: {
      type: Number,
      value: 300
    },
    hintcolor: {
      type: String,
      value: '#777'
    },
    bjcolor: {
      type: String,
      value: '#fff'
    },
    datalist: {
      type: Object,
      observer: function (obj) {
        this.triggerEvent('devicePageChange', obj)
      }
    }
  },
  data: {
    datalist: '',
    isshow: '',//0加载中，1暂无数据，2已加载全部
  },
  observers: {

  },

  methods: {
    loadMore: function (e) {
      var pages = this.data.dataPage;
      pages++
      this.setData({
        dataPage: pages
      })
    },
    getdata: function (page) {
      var that = this
      wx.request({
        url: this.properties.url,
        data: { page, pagesize: 90 },
        method: 'GET',
        dataType: 'json',
        responseType: 'text',
        success: function (res) {
          var newdata = res.data.data.info
          that.setData({ datalist: newdata })
          if (newdata.length > 0) {
            that.setData({ isshow: 0 })
          } else {
            if (page == 1) {
              that.setData({ isshow: 1 })
            } else (
              that.setData({ isshow: 2 })
            )
          }
        }
      })
    }
  }
})
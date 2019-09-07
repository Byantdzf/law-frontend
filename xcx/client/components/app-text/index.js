var WxParse = require('/wxParse/wxParse.js')
Component({
  properties: {
    datatext: {
      type: String,
      observer: function (data) {
        WxParse.wxParse('article', 'html', data, this, 8)
      }
    }
  },
  data: {
  },
  observers: {
  },
  methods: {

  }
})
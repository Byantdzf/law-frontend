Component({
  properties: {
    shareinfo: {
      type: Object,
      observer: function (data) {
        this.share(data)
      }
    }
  },
  data: {
    canvasHidden: true,
    ratio: '',
  },
  observers: {

  },
  ready: function (e) {
    // 获取系统信息
    wx.getSystemInfo({
      success: res => {
        this.setData({
          ratio: 750 / res.windowWidth
        });
      }
    });
  },
  methods: {
    dianjia: function () {
      this.createdCode()
    },
    getImage: function (url) {
      return new Promise(function (resolve, reject) {
        wx.getImageInfo({
          src: url,
          success: function (res) {
            resolve(res);
          },
        })
      })
    },
    getImageAll: function (image_src) {
      let that = this;
      var all = [];
      image_src.map(function (item) {
        all.push(that.getImage(item))
      })
      return Promise.all(all)
    },
    share: function (obj) {
      this.getImageAll([obj.surface.url, obj.qrcode.url]).then((res) => {
        this.canvasdata(res, obj)
      })

    },
    canvasdata: function (data, obj) {
      this.setData({
        canvasHidden: false,
        canvas: obj.surface
      })
      const ctx = wx.createCanvasContext('myCanvas', this)
      let canvasWidth = obj.surface.w / this.data.ratio;
      let canvasHeight = obj.surface.h / this.data.ratio;
      let textwidth = ctx.measureText(obj.textinfo.conten).width
      //主要就是计算好各个图文的位置
      ctx.drawImage(data[0].path, obj.surface.z, obj.surface.y, canvasWidth, canvasHeight)
      ctx.drawImage(data[1].path, obj.qrcode.z, obj.qrcode.y, obj.qrcode.w / this.data.ratio, obj.qrcode.h / this.data.ratio)
      ctx.font = obj.textinfo.font
      ctx.setTextAlign('center')
      ctx.setFillStyle(obj.textinfo.colour)
      ctx.fillText(obj.textinfo.conten, canvasWidth / 2, obj.textinfo.top)
      ctx.stroke()
      ctx.draw()
    },
    //保存
    saveImage: function () {
      var _t = this
      wx.showLoading({
        title: '图片保存中...',
      })
      wx.authorize({
        scope: 'scope.writePhotosAlbum',
        success() {
          _t.canvasPath()
        }
      })
      wx.getSetting({
        success: function (res) {
          console.log(res)
          if (!res.authSetting['scope.writePhotosAlbum']) {
            wx.openSetting({
              success: function (res) { }
            })
          } else (
            _t.canvasPath()
          )
        }
      })
    },
    canvasPath: function () {
      var _t = this
      wx.canvasToTempFilePath({
        canvasId: 'myCanvas',
        success: function (res) {
          wx.saveImageToPhotosAlbum({ //下载图片
            filePath: res.tempFilePath,
            success: function () {
              _t.setData({ canvasHidden: true })
              wx.showToast({
                title: "保存成功",
                icon: "success",
              })
            }
          })
        }
      }, this)
    }
  }

})
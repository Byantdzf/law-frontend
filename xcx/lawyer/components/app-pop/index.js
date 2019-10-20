Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true
  },
  properties: { 
    styles: {
      type: String,
      value: ''
    },
    direction: {
      type: String,
      value: 'bottom'
    },
    visible: {
      type: Boolean,
      value: false
    },
    transparentMask: {
      type: Boolean,
      value: false
    },
    maskClose: {
      type: Boolean,
      value: true
    },
    hideTabBar: {
      type: Boolean,
      value: false
    }
  },
  data: {
    classNames: {
      top: {
        0: 'slideOutUp',
        1: 'slideInDown'
      },
      right: {
        0: 'slideOutRight',
        1: 'slideInRight'
      },
      bottom: {
        0: 'slideOutDown',
        1: 'slideInUp'
      },
      left: {
        0: 'slideOutLeft',
        1: 'slideInLeft'
      }
    },
    isInit: true
  },
  observers: {
    visible (visible) {
      if(visible) {
        this.setData({ isInit: false })
        this.properties.hideTabBar && wx.hideTabBar({ animation: true })
      }else {
        if (!this.data.isInit) {
          this.properties.hideTabBar && wx.showTabBar({ animation: true })
        }
      }
    }
  },
  methods: {
    closePop() {
      if(!this.properties.maskClose) return
      this.setData({ visible: false })
      this.triggerEvent('close', {})
      this.properties.hideTabBar && wx.showTabBar({ animation: true })
    }
  }
})
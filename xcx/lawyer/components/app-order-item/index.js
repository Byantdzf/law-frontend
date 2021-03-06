
const orderApi = require('../../service/order.js')
const { orderType, orderCategory, orderStatus, orderSource, orderEmergency } = require('../../config/global');
const app = getApp()
Component({
  options: {
    addGlobalClass: true,
    multipleSlots: true
  },
  properties: {
    item: {
      type: Object,
      value: {}
    },
    questionTypeMap: {
      type: Object,
      value: {}
    },
    // 用于做标记
    key: String,
    // 索引
    index: {
      type: [String, Number]
    },
    // 1为订单池订单，2为订单管理订单
    type: {
      type: [String, Number],
      value: 1
    }
  },
  data: {
    orderType,
    orderCategory,
    orderSource,
    orderStatus,
    orderEmergency
  },

  methods: {
    gotoDetail() {
      let path = '/pages/order/mandatoryDetail/index';
      let item = this.data.item;

      // 在线咨询
      if (item.orderCategory == 11) {
        path = '/pages/order/onlineDetail/index';
      }

      // 指定律师
      if (item.orderCategory == 12) {
        path = '/pages/order/oneByOneDetail/index';
      }
      
      // 分块法律服务订单
      if (item.orderType == 2) {
        path = '/pages/order/legalDetail/index';
      }
      
      app.gotoPage(`${path}?id=${item.id}`)
    },
    handleForward() {
      app.confirm({ content: '确认转发此订单吗？' }).then(() => {
        const params = {
          operateType: 2,
          operateBusiness: 1,
          businessId: this.data.item.id
        }
        orderApi.orderForward(params).then(() => {
          app.toastSuccess('操作成功')
          this.triggerEvent('refresh', {
            key: this.data.key,
            index: this.data.index,
            type: 'Forward'
          })
        })
      })
    },
    // 关注
    handleFocused() {
      app.confirm({ content: '确认关注此订单吗？' }).then(() => {
        orderApi.orderFocused(this.data.item.id).then(() => {
          app.toastSuccess('操作成功')
          this.triggerEvent('refresh', {
            key: this.data.key,
            index: this.data.index,
            type: 'Focused'
          })
        })
      })
    },
    // 取消关注
    handleCancelFocused() {
      app.confirm({ content: '确认取消关注此订单吗？' }).then(() => {
        orderApi.orderCancelFocused(this.data.item.id).then(() => {
          app.toastSuccess('操作成功')
          this.triggerEvent('refresh', {
            key: this.data.key,
            index: this.data.index,
            type: 'CancelFocused'
          })
        })
      })
    },
    // 拒绝接单
    handleRefuse() {
      app.confirm({ content: '确认拒绝此订单吗？' }).then(() => {
        const params = {
          orderId: this.data.item.id
        }
        orderApi.orderRefuse(params).then(() => {
          app.toastSuccess('操作成功')
          this.triggerEvent('refresh', {
            key: this.data.key,
            index: this.data.index,
            type: 'Refuse'
          })
        })
      })
    },
    // 接受订单
    handleReceive() {
      app.confirm({ content: '确认接此订单吗？' }).then(() => {
        const params = {
          orderId: this.data.item.id
        }
        orderApi.orderReceive(params).then(() => {
          app.toastSuccess('操作成功')
          this.triggerEvent('refresh', {
            key: this.data.key,
            index: this.data.index,
            type: 'Receive'
          })
        })
      })
    },
  },
  pageLifetimes: {
    show() {
      
    }
  }
})
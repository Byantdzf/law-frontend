
const orderApi = require('../../service/order.js')
const { orderStatus, orderEmergency } = require('../../config/global')
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
    orderTypeMap: {
      type: Object,
      value: {}
    },
    orderCategoryMap: {
      type: Object,
      value: {}
    },
    questionTypeMap: {
      type: Object,
      value: {}
    },
    key: String,
    index: {
      type: [String, Number]
    }
  },
  data: {
    orderStatus,
    orderEmergency
  },

  methods: {
    gotoDetail() {
      app.gotoPage('/pages/order/detail/index?id=' + this.data.item.id)
    },
    handleForward() {
      app.confirm({ content: '确认转发此订单吗？' }),then(res => {
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
    handleRefuse() {
      app.confirm({ content: '确认拒绝此订单吗？' }),then(res => {
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
    handleReceive() {
      app.confirm({ content: '确认接此订单吗？' }),then(res => {
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
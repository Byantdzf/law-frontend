// pages/template/detail/index.js
const app = getApp();
const selectApi = require('../../../service/select')
const userApi = require('../../../service/user')

Page({
  data: {
    id: null,
    details: {},
  },
  onLoad(e) {
    app.pages.add(this)
    app.setNavColor()

    this.setData({ id: e.id })
    this.loadData()
  },
  loadData() {
    let id = this.data.id

    selectApi.templateDetails({ id: id }).then(res => {
      let details = res.data
      this.setData({ details })
    })
  },
  buyNow() {
    // 获取地址完成以后再判断授权
    let page = this.selectComponent('#app-page')
    page.checkAuth().then((data) => {
      // 授权成功
      let params = {}
      params.chooseService = this.data.id
      params.fileType = this.data.details.businessTypeName
      params.from = 1
      params.orderCategory = 41
      params.amount = this.data.details.price
      userApi.postTemplate(params).then(res => {
        app.wechatPay(res.data, function (res) {
          app.gotoPage('/pages/issue/success/index?type=5&id=' + this.data.id)
        }, function (res) {
          app.alert('支付失败，请到我的订单再次发起支付')
        })
      })
    }).catch((e) => {
      // 授权失败
      console.log('auth reject')
      console.log(e)
    });
  }
})
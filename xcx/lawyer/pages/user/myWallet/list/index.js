// pages/user/collect/index.js
let app = getApp();
Page({
  data: {
    listUrl: '/applets/lawyer/my/balanceAmountDetail',
    // 1-提现 2-用户订单充值 3-接订单收入 4-系统拨款 5-系统扣款
    types: {
      1: '提现',
      2: '用户订单充值',
      3: '接订单收入',
      4: '系统拨款',
      5: '系统扣款'
    },
    list: [],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.pages.add(this)
    app.setNavColor()
    this.loadList()
  },
  loadList() {
    const appList = this.selectComponent('#app-list')
    appList.setParams(params => {
      return params
    })
  },
})

const app = getApp();
const { orderType, orderCategory, orderStatus } = require('../../../config/global');
const orderApi = require('../../../service/order');
Page({
  data: {
    orderType,
    orderCategory,
    orderStatus,
    listUrl: '/applets/user/order/orderList',
    list: [],
    curOrderStatus: -1,
  },
  onLoad({ lawyerId }) {
    app.pages.add(this);
    app.setNavColor();
    this.lawyerId = lawyerId
    this.loadData()
  },
  loadData() {
    if (!this.appList) {
      this.appList = this.selectComponent('#app-list');
    }
    this.appList.setParams(params => {
      params.onlyUserOwner = 'Y'
      params.orderStatus = '20'
      return params;
    });
  },
  updateList(e) {
    let list = (e.detail || []).map(v => {
      let msgList = v.msgList || [];
      v.askSecondContent = '';
      msgList.forEach(vv => {
        if (vv.isUser === 'Y') {
          v.askSecondContent = vv.content || ''
        }
      });
      msgList = msgList.filter(vv => vv.isUser !== 'Y');
      return v;
    });
    this.setData({ list })
  },
  handleConfirm(e) {
    const { index } = e.currentTarget.dataset;
    const { id } = this.data.list[index];
    const page = app.pages.get('pages/lawyer/detail/index')
    if (page) {
      page.triggerInvite({ orderId: id, lawyerId: this.lawyerId })
      wx.navigateBack()
    }
  }
})
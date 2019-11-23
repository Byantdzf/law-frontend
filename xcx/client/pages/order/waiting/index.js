
const app = getApp();
const { orderType, orderCategory, orderStatus } = require('../../../config/global');

Page({
  data: {
    orderType,
    orderCategory,
    orderStatus,
    listUrl: '/applets/user/order/orderList/choose',
    list: [],
    curOrderStatus: -1,
    selectedIds: []
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
      params.lawyerId = this.lawyerId
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
  handleChooseItem(e) {
    const { id, choosed } = e.currentTarget.dataset;
    let { selectedIds, list } = this.data;
    
    if (choosed == 1) {
      return false
    }

    if (selectedIds.includes(id)) {
      selectedIds = selectedIds.filter(v => v !== id);
    } else {
      selectedIds.push(id);
    }

    list.forEach(v => {
      if (selectedIds.includes(v.id)) {
        v.checked = true;
      } else {
        v.checked = false;
      }
    });
    this.setData({ selectedIds, list });
  },
  handleConfirm() {
    let { selectedIds } = this.data;
    if (!selectedIds.length) {
      wx.showToast({
        title: '请选择订单',
        icon: 'none'
      })
      return false;
    }
    const page = app.pages.get('pages/lawyer/detail/index')
    if (page) {
      page.triggerInvite({ orderId: selectedIds.join(','), lawyerId: this.lawyerId })
      wx.navigateBack()
    }
  }
})
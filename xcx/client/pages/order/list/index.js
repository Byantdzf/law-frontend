
const app = getApp();
const { orderType, orderCategory, orderStatus } = require('../../../config/global')
Page({
  data: {
    orderType,
    orderCategory,
    orderStatus,
    listUrl: '/applets/user/order/orderList',
    statusItems: [
      {
        id: -1,
        name: '全部'
      },
      {
        id: 1,
        name: '待接单'
      },
      {
        id: 2,
        name: '已接单'
      },
      {
        id: 3,
        name: '完成待确认'
      },
      {
        id: 4,
        name: '待评价'
      },
      {
        id: 5,
        name: '已完成'
      }
    ],
    list: [
      {
        orderNo: '201910120004',
        lawyer: '陆先生',
        status: 0,
        orderType: 1,
        orderCategory: 11
      }, {
        orderNo: '201910120004',
        lawyer: '陆先生',
        status: 1,
        orderType: 2,
        orderCategory: 21
      }, {
        orderNo: '201910120004',
        lawyer: '陆先生',
        time: 20,
        status: 2,
        orderType: 2,
        orderCategory: 22
      }
    ],
  },
  onLoad() {
    app.pages.add(this);
    app.setNavColor();
    if (!this.appList) {
      this.appList = this.selectComponent('#app-list');
    }
    // this.appList.setParams();
  },
  updateList(e) {
    this.setData({ list: e.detail })
  },
  handleItemTimeup(e) {
    const { index } = e.currentTarget.dataset
    this.setData({
      [`list[${ index }].time`]: 0
    })
  }
})
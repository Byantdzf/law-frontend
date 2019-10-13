
const app = getApp();
const { orderType, orderCategory, orderStatus } = require('../../../config/global')
Page({
  data: {
    orderType,
    orderCategory,
    orderStatus,
    listUrl: '/applets/user/order/orderList',
    statusItems: [],
    list: [],
  },
  onLoad() {
    app.pages.add(this);
    app.setNavColor();
    let statusItems = [
      {
        id: -1,
        name: '全部'
      }
    ];
    for (let k in orderStatus) {
      statusItems.push({
        id: k,
        name: orderStatus[k]
      })
    }

    this.setData({ statusItems });
    
    if (!this.appList) {
      this.appList = this.selectComponent('#app-list');
    }
    this.appList.setParams();
  },
  updateList(e) {
    this.setData({ list: e.detail })
  },
  // handleItemTimeup(e) {
  //   const { index } = e.currentTarget.dataset
  //   this.setData({
  //     [`list[${ index }].time`]: 0
  //   })
  // },
  gotoDetail(e) {
    const { id } = e.currentTarget.dataset
    app.gotoPage('/pages/order/detail/index?id=' + id)
  },
  handleCancel(e) {

  },
  handlePay(e) {

  },
  handleComment(e) {
    const { index } = e.currentTarget.dataset;
    const { id, lawyer, lawyerPic } = this.data.list[index];
    app.gotoPage(`/pages/order/evaluate/index?id=${id}&lawyer=${lawyer}&lawyerPic=${lawyerPic || ''}`);
  }
})
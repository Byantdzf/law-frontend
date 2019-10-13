
const app = getApp();
const { orderType, orderCategory, orderStatus } = require('../../../config/global');
const orderApi = require('../../../service/order');
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
    const { index } = e.currentTarget.dataset;
    const id = this.data.list[index].id;
    app.confirm({
      content: '系统正在积极为您指派律师，您确定要取消订单？'
    }).then(() => {
      orderApi.orderCancel(id).then(() => {
        wx.showToast({
          title: '订单已取消',
          icon: 'success'
        });
        this.setData({
          [`list[${index}].orderStatus`]: 70
        });
      });
    }).catch(e => {});
  },
  handlePay(e) {
    const { index } = e.currentTarget.dataset;
    const id = this.data.list[index].id;
  },
  handleComment(e) {
    const { index } = e.currentTarget.dataset;
    const { id, lawyer, lawyerPic } = this.data.list[index];
    app.gotoPage(`/pages/order/evaluate/index?id=${id}&lawyer=${lawyer}&lawyerPic=${lawyerPic || ''}`);
  }
})
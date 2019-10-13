const orderApi = require('../../../service/order');
const { orderType, orderCategory, orderStatus, orderEmergency } = require('../../../config/global')
const app = getApp();
Page({
  data: {
    orderType,
    orderCategory,
    orderStatus,
    orderEmergency,
    item: {},
    showAskWrapper: false
  },
  onLoad(e) {
    app.pages.add(this);
    app.setNavColor();
    this.orderId = e.id;
  },
  onShow() {
    this.loadData(this.orderId);
  },
  loadData(id) {
    orderApi.orderDetails(id).then(res => {
      const item = res.data || {}
      this.setData({ item })
    })
  },
  handleCancel() {
    const id = this.orderId;
    app.confirm({
      content: '系统正在积极为您指派律师，您确定要取消订单？'
    }).then(() => {
      orderApi.orderCancel(id).then(() => {
        wx.showToast({
          title: '订单已取消',
          icon: 'success'
        });
        this.setData({
          [`item.orderStatus`]: 70
        });
      });
    }).catch(e => {});
  },
  handleComment() {
    const { id, lawyer, lawyerPic } = this.data.item;
    app.gotoPage(`/pages/order/evaluate/index?id=${id}&lawyer=${lawyer}&lawyerPic=${lawyerPic || ''}`);
  },
  handleConfirm() {
    const { id, lawyer, lawyerPic } = this.data.item;
    app.confirm({
      content: '您确定要完成此订单吗？'
    }).then(() => {
      orderApi.orderConfirm(id).then(() => {
        wx.showToast({
          title: '操作成功',
          icon: 'success'
        });
        app.gotoPage(`/pages/order/evaluate/index?id=${id}&lawyer=${lawyer}&lawyerPic=${lawyerPic || ''}`);
      });
    }).catch(e => {});
  },
  handleAsk() {
    this.setData({ showAskWrapper: true });
  },
  handleAskContentChange(e) {
    this.askContent = e.detail.value;
  },
  handleCancelAsk() {
    this.setData({ showAskWrapper: false });
  },
  handleConfirmAsk() {
    if (!this.askContent) {
      wx.showToast({
        title: '请输入要追问的问题'
      });
      return false;
    }
    orderApi.orderAskSecond({
      id: this.orderId,
      content: this.askContent
    }).then(() => {
      wx.showToast({
        title: '您的追问已提交'
      });
      this.loadData(this.orderId);
      this.setData({ showAskWrapper: false });
    })
  },
  gotoAppeal() {
    app.gotoPage(`/pages/order/appeal/index?id=${this.orderId}`);
  }
})
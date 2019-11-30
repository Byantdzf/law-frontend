const orderApi = require('../../../../service/order');
const selectApi = require('../../../../service/select');
const { orderType, orderCategory, orderStatus, orderEmergency, tokenName } = require('../../../../config/global');
const app = getApp();
Page({
  data: {
    // 存放订单信息
    item: {},
    files: []
  },
  onLoad(e) {
    app.pages.add(this);
    app.setNavColor();
    this.orderId = e.id;
  },
  onShow() {
    this.loadData(this.orderId);
  },
  // 加载订单详情数据
  loadData(id) {
    orderApi.orderDetails(id).then(res => {
      const item = res.data || {};
      item.questionTypeName = '';
      item.emergencyName = orderEmergency[item.emergency];
      this.setData({
        item: {
          ...item,
          orderTypeMap: orderType,
          orderCategoryMap: orderCategory,
          orderStatusMap: orderStatus,
          emergencyMap: orderEmergency,
        }
      });

      selectApi.data({ dictCode: 'QuestionType' }).then(res => {
        const items = res.data || [];
        items.forEach(v => {
          if (item.questionType == v.code) {
            item.questionTypeName = v.name
          }
        });
        this.setData({
          ['item.questionTypeName']: item.questionTypeName
        });
      });
      // 如果订单不是待支付，待接单，已取消状态，则查询回复列表
      if (item.orderStatus == 60) {
        this.loadLawDocument(id);
      }
    });
  },
  // 法律文件购买展示文件信息
  loadLawDocument(orderId) {
    orderApi.lawDocument(orderId).then(res => {
      const files = res.data || [];
      this.setData({ files });
    });
  },
  // 打开文件
  handleOpenDoc(e) {
    const { filepath } = e.currentTarget.dataset;
    app.handleOpenDoc(filepath);
  },
  // 下载操作
  handleDownload(e) {
    const { filepath } = e.currentTarget.dataset;
    app.handleSaveFile(filepath);
  },
  handlePay(e) {
    const orderNo = this.data.item.orderNo;
    if (this.isAjaxLoading) {
      return false;
    }
    this.isAjaxLoading = true;
    orderApi.pay({orderNo: orderNo}).then(res => {
      this.isAjaxLoading = false;
      app.wechatPay(res.data, function (res) {
          app.gotoPage('/pages/issue/success/index?type=1')
      }, function (res) {
          app.alert('支付失败，请到我的订单再次发起支付')
      })
    }).catch(e => {
      this.isAjaxLoading = false;
    });
    
  },
})
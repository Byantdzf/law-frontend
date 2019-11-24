const orderApi = require('../../../../service/order');
const selectApi = require('../../../../service/select');
const { orderType, orderCategory, orderStatus, orderEmergency, PAGE_KEY, SIZE_KEY } = require('../../../../config/global');
const app = getApp();
Page({
  data: {
    // 存放订单信息
    item: {
      orderTypeMap: orderType,
      orderCategoryMap: orderCategory,
      orderStatusMap: orderStatus,
      emergencyMap: orderEmergency,
    },
    // 评价列表
    orderScoreList: [],
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
      let { item } = this.data;
      const resData = res.data || {};
      item = { ...item, ...resData };
      item.questionTypeName = '';
      item.emergencyName = orderEmergency[item.emergency];
      this.setData({ item });

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
      
      // 如果订单是完成状态，则查询用户评价列表
      if (item.orderStatus == 60) {
        this.loadOrderScoreList(id);
      }
    });
  },
  // 查询用户评价
  loadOrderScoreList(orderId) {
    const params = {
      orderId,
      [PAGE_KEY]: 1,
      [SIZE_KEY]: 10
    };
    orderApi.queryOrderScoreByOrderId(params).then(res => {
      const data = res.data || {};
      const orderScoreList = data.list || [];
      this.setData({ orderScoreList });
    });
  },

  // 处理取消订单操作
  handleCancel() {
    const id = this.orderId;
    if (this.isAjaxLoading) {
      return false;
    }
    app.confirm({
      content: '系统正在积极为您指派律师，您确定要取消订单？'
    }).then(() => {
      this.isAjaxLoading = true;
      orderApi.orderCancel(id).then(() => {
        wx.showToast({
          title: '订单已取消',
          icon: 'success'
        });
        this.setData({
          [`item.orderStatus`]: 70
        });
        this.isAjaxLoading = false;
      }).catch(e => {
        this.isAjaxLoading = false;
      });
    }).catch(e => {
      this.isAjaxLoading = false;
    });
  },
  // 点击评价按钮
  handleComment() {
    const { id, lawyer, lawyerPic } = this.data.item;
    app.gotoPage(`/pages/order/evaluate/index?id=${id}&lawyer=${lawyer}&lawyerPic=${lawyerPic || ''}`);
  },
  // 处理确认完成订单操作
  handleConfirm() {
    const { id, lawyer, lawyerPic } = this.data.item;
    if (this.isAjaxLoading) {
      return false;
    }
    app.confirm({
      content: '您确定要完成此订单吗？'
    }).then(() => {
      this.isAjaxLoading = true;
      orderApi.orderConfirm(id).then(() => {
        this.isAjaxLoading = false;
        wx.showToast({
          title: '操作成功',
          icon: 'success'
        });
        app.gotoPage(`/pages/order/evaluate/index?id=${id}&lawyer=${lawyer}&lawyerPic=${lawyerPic || ''}`);
      }).catch(e => {
        this.isAjaxLoading = false;
      });
    }).catch(e => {
      this.isAjaxLoading = false;
    });
  },
  // 点击取消评价
  handleCancelAsk() {
    this.setData({ showAskWrapper: false });
  },
  // 点击申诉
  gotoAppeal() {
    app.gotoPage(`/pages/order/appeal/index?id=${this.orderId}`);
  },
})
const orderApi = require('../../../service/order');
const selectApi = require('../../../service/select');
const { orderType, orderCategory, orderStatus, orderSource, orderEmergency, PAGE_KEY, SIZE_KEY } = require('../../../config/global');
const app = getApp();
Page({
  data: {
    // 存放订单信息
    item: {
      orderTypeMap: orderType,
      orderCategoryMap: orderCategory,
      orderStatusMap: orderStatus,
      orderSourceMap: orderSource,
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
  // 处理确认完成订单操作
  handleConfirm() {
    app.confirm({
      content: '您确定要完成此订单吗？'
    }).then(() => {
      // 指定律师
      let params = {
        orderId: this.orderId,
        // 操作类型 1-回复 2回复并确认
        operateType: 2,
        msgType: 7
      };
      orderApi.orderReply(params).then(() => {
        app.toastSuccess('操作成功');
        this.loadData(this.orderId);
      });
    }).catch(e => {});
  },
  makePhone() {
    app.makePhoneCall(this.data.item.contactMobile)
  }
})
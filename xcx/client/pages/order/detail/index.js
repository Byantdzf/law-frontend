const orderApi = require('../../../service/order');
const selectApi = require('../../../service/select');
const { orderType, orderCategory, orderStatus, orderEmergency, PAGE_KEY, SIZE_KEY } = require('../../../config/global');
const app = getApp();
Page({
  data: {
    orderType,
    orderCategory,
    orderStatus,
    orderEmergency,
    // 存放订单信息
    item: {},
    // 回复列表
    msglist: [],
    // 评价列表
    orderScoreList: [],
    // 追问内容
    askSecondContent: '',
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
  // 加载订单详情数据
  loadData(id) {
    orderApi.orderDetails(id).then(res => {
      const item = res.data || {};
      item.questionTypeName = '';
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
      
      // 如果订单不是待支付，待接单，已取消状态，则查询回复列表
      if (!(item.orderStatus == 10 || item.orderStatus == 20 || item.orderStatus == 70)) {
        this.loadReplyList(id);
      }
      // 如果订单是完成状态，则查询用户评价列表
      if (item.orderStatus == 60) {
        this.loadOrderScoreList(id);
      }
    });
  },
  // 加载订单回复列表
  loadReplyList(orderId) {
    const params = {
      orderId,
      [PAGE_KEY]: 1,
      [SIZE_KEY]: 10
    };
    orderApi.orderMsglist(params).then(res => {
      const data = res.data || {};
      const msglist = data.list || [];
      msglist.forEach(v => {
        if (v.isUser) {
          // 找出用户追问的内容
          this.setData({ askSecondContent: v.content || '' });
        }
      });
      this.setData({ msglist: msglist.filter(v => !v.isUser) });
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
  // 点击评价按钮
  handleComment() {
    const { id, lawyer, lawyerPic } = this.data.item;
    app.gotoPage(`/pages/order/evaluate/index?id=${id}&lawyer=${lawyer}&lawyerPic=${lawyerPic || ''}`);
  },
  // 处理确认完成订单操作
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
  // 点击追问按钮
  handleAsk() {
    this.setData({ showAskWrapper: true });
  },
  // 处理追问文本域值改变
  handleAskContentChange(e) {
    this.askContent = e.detail.value;
  },
  // 点击取消评价
  handleCancelAsk() {
    this.setData({ showAskWrapper: false });
  },
  // 确认提交追问
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
  // 点击申诉
  gotoAppeal() {
    app.gotoPage(`/pages/order/appeal/index?id=${this.orderId}`);
  },
  // 播放音频
  handleOpenAudio(e) {
    const { filepath: filePath } = e.currentTarget.dataset;
    wx.playVoice({filePath});
    // TODO：暂停功能
  },
  // 打开文件
  handleOpenDoc(e) {
    const { filepath: filePath } = e.currentTarget.dataset;
    wx.openDocument({ filePath });
  }
})
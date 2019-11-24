const orderApi = require('../../../../service/order');
const selectApi = require('../../../../service/select');
const { orderType, orderCategory, orderStatus, orderEmergency, PAGE_KEY, SIZE_KEY, tokenName } = require('../../../../config/global');
const app = getApp();
Page({
  data: {
    // 存放订单信息
    item: {},
    // 回复列表
    msglist: [],
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
      if (!(item.orderStatus == 10 || item.orderStatus == 20 || item.orderStatus == 70)) {
        this.loadReplyList(id);
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
        if (v.isUser === 'true') {
          // 找出用户追问的内容
          this.setData({ askSecondContent: v.content || '' });
        }
      });
      this.setData({ msglist: msglist.filter(v => v.isUser === 'false') });
    });
  },
  // 打开文件
  handleOpenDoc(e) {
    const { item } = this.data;
    const token = wx.getStorageSync(tokenName);
    wx.downloadFile({
      url: item.filePath,
      header: {
        "Authorization": "Bearer " + token
      },
      success: (res) => {
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('打开文档成功')
          }
        })
      }
    });
  },
  handleDownload() {
    const { item } = this.data;
    const token = wx.getStorageSync(tokenName)
    wx.downloadFile({
      url: item.filePath,
      header: {
        "Authorization": "Bearer " + token
      },
      success: (res) => {
        wx.showToast({
          title: '下载成功！',
          icon: 'none'
        })
      }
    });
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
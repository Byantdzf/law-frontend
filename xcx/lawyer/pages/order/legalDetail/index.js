const orderApi = require('../../../service/order');
const selectApi = require('../../../service/select');
const { orderType, orderCategory, orderStatus, orderSource, orderEmergency, PAGE_KEY, SIZE_KEY, tokenName } = require('../../../config/global');
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
    // 回复列表
    msgList: [],
    // 评价列表
    orderScoreList: [],
    filePath: '',
    // 是否正在上传文件
    isUpload: false,
    // 选择的文件
    files: [],
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
    this.setData({
      isUpload: false,
      filePath: '',
    });
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
      const msgList = data.list || [];
      this.setData({ msgList });
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
  
  // 打开文件
  handleOpenDoc(e) {
    const { filepath } = e.currentTarget.dataset;
    app.handleOpenDoc(filepath);
  },
  // 选择文件上传
  handleUpload() {
    wx.chooseMessageFile({
      count: 10,
      type: 'file',
      success: (res) => {
        const items = res.tempFiles || [];
        const paths = items.map(v => v.path);
        const names = items.map(v => v.name);
        // console.log(paths)
        for(let i = 0; i < paths.length; i ++) {
          selectApi.uploadFile({ filePath: paths[i] }).then(res1 => {
            const data = res1.data || '';
            let files = this.data.files;
            this.setData({
              files: files.concat([{
                filePath: data,
                fileName: names[i],
                // 类型 1：文字；2：音频；3：红包；4：文件；5：位置；6：图片
                fileType: 4
              }])
            })
          })
        }
      }
    })
  },

  // 处理确认完成订单操作
  handleConfirm() {
    const { orderStatus } = this.data.item;
    app.confirm({
      content: '您确定要完成此订单吗？'
    }).then(() => {
      let params = {
        orderId: this.orderId,
        // 操作类型 1-回复 2回复并确认
        operateType: 2
      };
      
      // 分块法律服务订单, 代理律师订单, 法律文件订单
      if (!this.data.files.length) {
        wx.showToast({
          title: '请上传文件',
          icon: 'none',
          duration: 3000
        });
        return false;
      }

      params.curOrderStatus = orderStatus;
      params.attachmentList = this.data.files;

      orderApi.orderReplyForManyAttachment(params).then(() => {
        app.toastSuccess('操作成功');
        this.setData({ files: [] });
        this.loadData(this.orderId);
      });
    }).catch(e => {});
  },

  // 关注
  handleFocused() {
    app.confirm({ content: '确认关注此订单吗？' }).then(() => {
      orderApi.orderFocused(this.orderId).then(() => {
        app.toastSuccess('操作成功')
        this.loadData(this.orderId);
      })
    })
  },
  // 取消关注
  handleCancelFocused() {
    app.confirm({ content: '确认取消关注此订单吗？' }).then(() => {
      orderApi.orderCancelFocused(this.orderId).then(() => {
        app.toastSuccess('操作成功')
        this.loadData(this.orderId);
      })
    })
  },
  // 拒绝接单
  handleRefuse() {
    app.confirm({ content: '确认拒绝此订单吗？' }).then(() => {
      const params = {
        orderId: this.orderId
      }
      orderApi.orderRefuse(params).then(() => {
        app.toastSuccess('操作成功');
        wx.navigateBack();
      })
    })
  },
  // 接受订单
  handleReceive() {
    app.confirm({ content: '确认接此订单吗？' }).then(() => {
      const params = {
        orderId: this.orderId
      }
      orderApi.orderReceive(params).then(() => {
        app.toastSuccess('操作成功')
        this.loadData(this.orderId);
      })
    })
  },

  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '虎甲问答',
      path: `pages/order/legalDetail/index?id=${ this.orderId }`,  // 路径，传递参数到指定页面。
      imageUrl: '../../../static/images/logo.png',
      success: function (res) {
        // 转发成功
        console.log("转发成功:" + JSON.stringify(res));
        app.toastSuccess('转发成功')
      },
      fail: function (res) {
        // 转发失败
        console.log("转发失败:" + JSON.stringify(res));
        app.toastError('转发失败')
      }
    }
 
  }
})
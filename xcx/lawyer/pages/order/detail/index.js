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
    msgList: [],
    // 评价列表
    orderScoreList: [],
    // 律师回复的内容
    content: '',
    // 咨询订单是回复语音还是文本内容
    replyIscontent: false,
    // 是否正在录音
    isRecording: false,
    filePath: '',
    recordTime: 0,
    // 是否正在上传文件
    isUpload: false,
    // 选择的文件
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
    this.setData({
      isRecording: false,
      filePath: '',
      recordTime: 0
    });
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
  
  // 处理追问文本域值改变
  handleContentChange(e) {
    this.content = e.detail.value;
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
  },
  // 回复方式改变，语音回复还是内容回复
  replyRadioChange(e) {
    const { value } = e.detail;
    this.setData({
      replyIscontent: value === 'content'
    })
  },
  // 开始录音，结束录音
  toggleRecording() {
    const isRecording = this.data.isRecording;
    if (isRecording) {
      if (this.RecorderManager) {
        this.RecorderManager.stop();
        this.RecorderManager.onStop((res) => {
          const { tempFilePath, duration } = res || {};
          this.setData({
            isRecording: false,
            filePath: tempFilePath,
            recordTime: Math.round(duration/1000),
            isUpload: true
          });
          selectApi.uploadFile({ filePath: tempFilePath }).then(res => {
            this.setData({
              filePath: res.data || '',
              isUpload: false
            });
          }).catch(() => {
            this.setData({
              filePath: '',
              recordTime: 0,
              isUpload: false
            });
          })
        });
      } else {
        this.setData({
          isRecording: false
        })
      }
    } else {
      this.RecorderManager = wx.getRecorderManager();
      this.RecorderManager.start({
        duration: 180000
      });
      this.RecorderManager.onStart(() => {
        this.setData({
          isRecording: true
        })
      });
    }
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
    const { id, orderType, orderStatus } = this.data.item;
    app.confirm({
      content: '您确定要完成此订单吗？'
    }).then(() => {
      let params = {
        orderId: this.orderId,
        // 操作类型 1-回复 2回复并确认
        operateType: 2
      };
      if (orderType == 1) {
        // 咨询类订单
        if (this.data.replyIscontent) {
          // 回复文字内容
          if (!this.data.content) {
            wx.showToast({
              title: '请输入回复的内容',
              icon: 'none',
              duration: 3000
            });
            return false;
          }
          params.msgType = 1;
          params.content = this.data.content;
        } else {
          if (this.data.recordTime < 30 || this.data.recordTime > 180) {
            wx.showToast({
              title: '语音时长不能小于30s，且不大于180s',
              icon: 'none',
              duration: 3500
            });
            return false;
          }
          // 回复语音
          params.msgType = 2;
          params.filePath = this.data.filePath;
          params.recordTime = this.data.recordTime;
        }

        orderApi.orderConfirm(params).then(() => {
          app.toastSuccess('操作成功');
          this.loadData(this.orderId);
        });
      } else {
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
          this.loadData(this.orderId);
        });
      }
      
    }).catch(e => {});
  },

  onShareAppMessage: function (ops) {
    if (ops.from === 'button') {
      // 来自页面内转发按钮
      console.log(ops.target)
    }
    return {
      title: '虎甲问答',
      path: `pages/order/detail/index?id=${ this.orderId }`,  // 路径，传递参数到指定页面。
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

const app = getApp();
const { orderType, orderCategory, orderStatus } = require('../../../config/global');
const orderApi = require('../../../service/order');
Page({
  data: {
    selectAllObj: {id: '', name: '全部', checked: true},
    orderStatus,
    listUrl: '/applets/user/order/orderList',
    list: [],
    statusItems: [],
    curOrderStatus: -1,
    orderTypeList: [],
    orderCategoryList: [],
    dropVisable: false,
    dropList: [{id: '', name: '全部', checked: true}],
    currType: 1,
    currOrderType: {},
    currOrderCategory: {},
  },
  onLoad({ curOrderStatus = '' }) {
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
    curOrderStatus && this.setData({ curOrderStatus });

    let orderTypeList = [this.data.selectAllObj]
    for (let i in orderType) {
      let item = {}
      item.id = i
      item.name = orderType[i]
      orderTypeList.push(item)
    }
    let orderCategoryList = [this.data.selectAllObj]
    this.setData({ 
      orderTypeList, 
      orderCategoryList,
      currOrderType: orderTypeList[0],
      currOrderCategory: orderCategoryList[0]
    })

    this.loadData()
  },
  loadData() {
    if (!this.appList) {
      this.appList = this.selectComponent('#app-list');
    }
    let curOrderStatus = this.data.curOrderStatus
    let currOrderType = this.data.currOrderType || {}
    let currOrderCategory = this.data.currOrderCategory || {}
    this.appList.setParams(params => {
      if (curOrderStatus != -1) {
        params.orderStatus = curOrderStatus;
      } else {
        delete params.curOrderStatus;
      }
      if (currOrderType.id) {
        params.orderType = currOrderType.id;
      } else {
        delete params.orderType;
      }
      if (currOrderCategory.id) {
        params.orderCategory = currOrderCategory.id;
      } else {
        delete params.orderCategory;
      }
      console.log('--------123')
      return params;
    });
  },
  updateList(e) {
    let list = e.detail || [];
    list = list.map(v => {
      let msgList = v.msgList || [];
      msgList.forEach(vv => {
        if (vv.isUser) {
          // 找出用户追问的内容
          v.askSecondContent = v.content || '';
        }
      });
      v.msgList = msgList.filter(vv => !vv.isUser);
      return v;
    });
    this.setData({ list: e.detail })
  },
  handleStatusChange(e) {
    const curOrderStatus = e.detail;
    this.setData({ curOrderStatus });
    this.loadData();
  },
  changType(e) {
    const currType = e.currentTarget.dataset.type
    let dropList = [this.data.selectAllObj]

    if (currType == 1) {
      dropList = [...this.data.orderTypeList]
    } else {
      for (let k in orderCategory) {
        if (k[0] == this.data.currOrderType.id) {
          dropList.push({id: k, name: orderCategory[k]})
        }
      }
    }
    this.setData({
      dropList,
      currType,
      dropVisable: true
    })
  },
  changeThis(e) {
    const { id } = e.currentTarget.dataset
    let index = this.data.dropList.findIndex(item => {
      return item.id == id
    })
    if (this.data.currType == 1) {
      let currOrderType = this.data.dropList[index]
      this.setData({
        currOrderType,
        currOrderCategory: this.data.selectAllObj
      })
    } else {
      let currOrderCategory = this.data.dropList[index]
      this.setData({
        currOrderCategory
      })
    }
    this.dropHide()
    this.loadData()
  },
  dropHide() {
    this.setData({
      dropVisable: false,
    })
  },
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
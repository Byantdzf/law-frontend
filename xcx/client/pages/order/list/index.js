
const app = getApp();
const { orderType, orderCategory, orderStatus } = require('../../../config/global');
const orderApi = require('../../../service/order');
Page({
  data: {
    orderType,
    orderCategory,
    orderStatus,
    selectAllObj: {id: '', name: '全部', checked: true},
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
  },
  onShow() {
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
        delete params.orderStatus;
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
      params.onlyUserOwner = 'Y';
      return params;
    });
  },
  updateList(e) {
    let list = (e.detail || []).map(v => {
      let msgList = v.msgList || [];
      v.askSecondContent = '';
      msgList.forEach(vv => {
        if (vv.isUser === 'Y') {
          v.askSecondContent = vv.content || ''
        }
      });
      msgList = msgList.filter(vv => vv.isUser !== 'Y');
      return v;
    });
    this.setData({ list })
  },
  handleStatusChange(e) {
    const curOrderStatus = e.detail;
    this.setData({ curOrderStatus })
    this.loadData()
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
    const { id, index } = e.currentTarget.dataset;
    let item = this.data.list[index];
    let path = '/pages/order/detail/template/index';

    // 在线咨询
    if (item.orderCategory == 11) {
      path = '/pages/order/detail/online/index';
    }

    // 指定律师
    if (item.orderCategory == 12) {
      path = '/pages/order/detail/oneByOne/index';
    }
    
    // 分块法律服务订单
    if (item.orderType == 2) {
      path = '/pages/order/detail/legal/index';
    }

    if (item.orderType == 3) {
      path = '/pages/order/detail/mandatory/index';
    }
    
    app.gotoPage(`${path}?id=${id}`)
  },
  handleCancel(e) {
    const { index } = e.currentTarget.dataset;
    const id = this.data.list[index].id;
    if (this.isAjaxLoading) {
      return false;
    }
    app.confirm({
      content: '系统正在积极为您指派律师，您确定要取消订单？'
    }).then(() => {
      this.isAjaxLoading = true;
      orderApi.orderCancel(id).then(() => {
        this.isAjaxLoading = false;
        wx.showToast({
          title: '订单已取消',
          icon: 'success'
        });
        this.setData({
          [`list[${index}].orderStatus`]: 70
        });
      }).catch(e => {
        this.isAjaxLoading = false;
      });
    }).catch(e => {
      this.isAjaxLoading = false;
    });
  },
  handlePay(e) {
    const { index } = e.currentTarget.dataset;
    const orderNo = this.data.list[index].orderNo;
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
  handleComment(e) {
    const { index } = e.currentTarget.dataset;
    const { id, lawyer, lawyerPic } = this.data.list[index];
    app.gotoPage(`/pages/order/evaluate/index?id=${id}&lawyer=${lawyer}&lawyerPic=${lawyerPic || ''}`);
  },
  // 打开文件
  handleOpenDoc(e) {
    const { filepath } = e.currentTarget.dataset;
    app.handleOpenDoc(filepath);
  },
})

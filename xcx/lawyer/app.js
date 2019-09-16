
const test = require('utils/test.js')
const pages = require('plugins/pages.js')

let primaryColor = '#CF443D'
let reverseColor = '#ffffff'

App({
  globalData: {
    userInfo: null, // 用户信息
    scene: ''
  },
  onLaunch(e) {
    this.test = test
    this.pages = pages
    this.globalData.scene = e.scene
  },
  onShow(o) {
    // console.log(o)
  },
  // 设置导航栏标题
  setNavTitle(title) {
    wx.setNavigationBarTitle({ title })
  },
  // 设置导航栏文字颜色，背景色
  setNavColor(o) {
    let options = {
          frontColor: reverseColor,
          backgroundColor: primaryColor,
          animation: {
            duration: 10,
            timingFunc: 'easeIn'
          }
        }
    let obj = Object.assign(options, o)
    // console.log(obj)
    wx.setNavigationBarColor(obj)
  },
  // 确认操作提示
  confirm(o) {
    let options = {
          title: '温馨提示',
          content: '',
          showCancel: true,
          cancelText: '取消',
          confirmText: '确认',
          confirmColor: primaryColor
        }
    let obj = Object.assign(options, o)

    return new Promise((resolve, reject) => {
      wx.showModal({
        ...obj,
        success(res) {
          let { confirm } = res
          confirm ? resolve(res) : reject(res)
        },
        fail(error) {
          reject(error)
        }
      })
    })
  },
  // 警告提示
  alert(o) {
      typeof o == 'string' && (o = { content: o })
    return this.confirm(Object.assign(o, {
      showCancel: false
    }))
  },
  // 显示成功信息
  toastSuccess(title) {
    wx.showToast({
      title,
      icon: 'success',
      duration: 2000
    })
  },
  // 显示错误信息
  toastError(title) {
    wx.showToast({
      title,
      icon: 'none',
      duration: 2000
    })
  },
  // 打电话
  makePhoneCall(phoneNumber) {
    wx.makePhoneCall({ phoneNumber })
  },
  // 获取地理位置
  getUserLocation() {
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        console.log(res)
      }
    })
  },
  //分页
  loadMoreMethods: {
    _data: {
      page: 1,
      rows: 10,
      list: [],
      hasNextPage: false,
      request: null,
      callback: null,
      params: null
    },
    _initLoadMore(params = {}) {
      let {
        page = 1,
        page_size = 10,
        list = [],
        hasNextPage = false
      } = params;
      this._data.page = page;
      this._data.page_size = page_size;
      this._data.list = list;
      this._data.hasNextPage = hasNextPage;
    },
    _getList({
      request,
      params
    }, callback = function () { }) {
      let { page, page_size } = this._data;
      let _params = {
        page: page,
        page_size: page_size
      };
      params && (_params = Object.assign({}, _params, params));
      this._data.request = request;
      this._data.params = params;
      this._data.callback = callback;
      request(_params).then(response => {
        //let { page, totalPages, list = [] } = response.dataList || {};
        let totalRows = response.dataList.total;
        let page = _params.page;
        let totalPages = Math.ceil(totalRows / params.page_size);
        let baseData = response.dataList;
        let list = baseData.productList || baseData.orderList || baseData.waitServiceScheduleList || baseData.technicianList || baseData.technicianScheduleList || [];
        this._data.hasNextPage = totalPages > page ? true : false;
        this._data.list = page == 1 ? list : [...this._data.list, ...list];
        typeof callback == 'function' && callback({
          list: this._data.list,
          hasNextPage: this._data.hasNextPage
        });
      }).catch(e => { });
    },
    _loadMore() {
      if (this._data.hasNextPage) {
        this._data.page += 1;
        this._getList({
          request: this._data.request,
          params: this._data.params
        }, this._data.callback);
      }
    }
  }
})
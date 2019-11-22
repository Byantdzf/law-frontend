// pages/user/collect/index.js
let app = getApp();
const userApi = require('../../../../service/user')
Page({
  data: {
    data: {},
    type: 1,
    inputVal: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    app.pages.add(this)
    app.setNavColor()
  },
  onShow() {
    this.loadData()
  },
  loadData() {
    userApi.getMyBalance().then(res => {
      let data = res.data
      this.setData({ data })
    })
  },
  changeType(e) {
    let { id } = e.currentTarget.dataset
    this.setData({ type: id })
  },
  clearInput() {
    this.setData({ inputVal: '' }) 
  },
  checkAmount(e) {
    let val = e.detail.value
    let balance = this.data.data.balanceAmount
    if (val > balance) {
      app.alert('输入金额超过余额')
      this.setData({ inputVal: balance }) 
    } else {
      if (val < 1) {
        app.alert('最低提现金额为 1.00 元')
        this.setData({ inputVal: 1 }) 
      }
    }
  },
  formSubmit(e) {
    let params = e.detail.value
    if (!params.cashOutAmount) {
      app.toastError('请输入提现金额');
      return;
    }
    if (this.data.type == 2) {
      if (!params.cashOutAccount) {
        app.toastError('请输入提现帐户');
        return;
      }
      if (!params.cashOutAccountName) {
        app.toastError('请输入提现账号真实姓名');
        return;
      }
    }

    params.operateType = 1
    params.cashOutWay = this.data.type
    userApi.withDraw(params).then(res => {
      console.log(res)
    })
  }
})
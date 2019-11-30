// pages/findPassword/index.js
const app = getApp()
const selectApi = require('../../service/select')
const authtApi = require('../../service/auth')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    validateCode: null,
    validateMobile: null,
    waitValidateCode: null,
    countVal: app.globalData.smsCount,
    xhrLoading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad({ phone }) {
    this.setData({ validateMobile: phone })
    app.pages.add(this)
    app.setNavColor()
  },
  setValidateMobie(e) {
    let { value } = e.detail

    this.setData({
        validateMobile: value
    })
  },
  getValidateCode() {
    if (!/(^1[3|4|5|7|8][0-9]{9}$)/.test(this.data.validateMobile)) {
        app.toastError('请输入正确的手机号码');
        return;
    }
    // 发送短信验证码
    selectApi.getSmsCode({ phone: this.data.validateMobile }).then(res => {
        this.countTimes('countVal', 'waitValidateCode')
    })
  },
  countTimes(field, statusField) {
    let _t = this
    // 显示倒计时
    let data = _t.data
    data[statusField] = 1
    _t.setData(data)
    let timer = null;
    let t = _t.data[field]
    timer = setInterval(function () {
        t--;
        if (t == 0) {
            clearInterval(timer);
            let data = _t.data
            data[statusField] = ''
            data[field] = app.globalData.smsCount
            _t.setData(data)
        } else {
            let data = _t.data
            data[field] = t
            _t.setData(data)
        }
    }, 1000);
  },
  formSubmit(e) {
    const params = e.detail.value;
    const { phone, phoneVerificationCode, pwd } = params;
    if (!phone) {
      app.toastError('请输入手机号码');
      return;
    }
    if (!phoneVerificationCode) {
      app.toastError('请输入手机验证码');
      return;
    }
    if (!pwd) {
      app.toastError('请输入新密码');
      return;
    }
    this.setData({ xhrLoading: true })
    authtApi.resetPassword(params).then(() => {
      this.setData({ xhrLoading: false })
      wx.navigateBack();
      app.toastSuccess('密码已重置');
    }).catch(err => {
      this.setData({ xhrLoading: false })
    })
  }
})
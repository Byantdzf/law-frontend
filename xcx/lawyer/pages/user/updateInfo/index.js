// pages/user/updateInfo/index.js
const app = getApp()
const api = require('../../../service/auth')
const selectApi = require('../../../service/select')
let page = null

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    updateType: null, // name, area, goodAt, brief
    region: '',
    questionType: [],
    region: [],
    regionStr: '',
    focus:true,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let { type } = options
    let userInfo = wx.getStorageSync('updateUserInfo')
    let goodAt = userInfo.goodAt || ''

    let region = []
    userInfo.province && region.push(userInfo.province)
    userInfo.city && region.push(userInfo.city)
    userInfo.zone && region.push(userInfo.zone)
    this.setData({
      updateType: type,
      userInfo,
      region,
      regionStr: region.join('，')
    })

    // 获取问题类型
    selectApi.getQuestionType().then(res => {
      res.data.forEach(item => {
        if (goodAt.indexOf(item.value) > -1) {
          item.selected = true
        }
      })
      this.setData({
        questionType: res.data
      })
    })
  },
  onShow () {
      this.setData({
          focus: true
      })
  },
  selectAt(e) {
    let { index } = e.currentTarget.dataset
    let showConObj = 'questionType[' + index + '].selected';
    this.setData({
      [showConObj]: !this.data.questionType[index].selected
    })
  },
  formSubmit(e) {
    // 测试流程
    // app.gotoPage('/pages/issue/success/index?type=1')
    // return 
    let params = e.detail.value
    let updateType = this.data.updateType
    if (updateType == 'name' && !params.name) {
      app.toastError('请输入您的姓名')
      return
    }
    if (updateType == 'area') {
      if (!this.data.region) {
        app.toastError('请选择所在地区');
        return;
      }
      params.provice = this.data.region[0]
      params.city = this.data.region[1]
      params.zone = this.data.region[2]
    }


    if (updateType == 'goodAt') {
      let arr = []
      this.data.questionType.forEach(item => {
        item.selected == true && arr.push(item.value)
      })
      params.goodAt = arr.join(',')
      if (!params.goodAt) {
        app.toastError('请选择擅长领域');
        return;
      }
    }
    params.id = this.data.userInfo.id

    console.log(params)
    api.updateInfo(params).then(res => {
      app.gotoPage('/pages/user/myInfo/index')
    })
  },
  bindRegionChange(e) {
    this.setData({
      region: e.detail.value
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
  }
})
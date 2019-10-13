// pages/lawyer/voice/index.js
const app = getApp()
const api = require('../../../service/auth')
const selectApi = require('../../../service/select')
const userApi = require('../../../service/user')
let page = null

Page({
    /**
     * 页面的初始数据
     */
    data: {
      regStatus: 1,
      btnDisable: true,
      emergencyRadio: [
          { id: 1, name: "是", checked: true },
          { id: 0, name: "否" }
      ],
      regRadio: [
          { id: 1, name: "是", checked: true },
          { id: 0, name: "否" }
      ],
      emergency: 1,
      questionType: [],
      selectQuestionType: '',
      selectAmount: '',
      useCurrentPhone: null,  // 是否使用当前手机号进行注册 1-是，0 -否，不填表示当前用户已经注册
      selectArea: [],
      validateCode: null,
      validateMobile: null,
      registerValidateCode: null,
      registerMobile: null,
      waitValidateCode: null,
      waitRegisterCode: null,
      countVal: app.globalData.smsCount,
      countReg: app.globalData.smsCount,
      amountList: [
          { id: 1, name: "30元", value: "30" },
          { id: 2, name: "50元", value: "50" },
          { id: 3, name: "100元", value: "100" }
      ],
      persent: 0,
      defaultPic: '/static/images/demo/img_lawyer.png',
      details: {}
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      page = this.selectComponent('#app-page')
      page.checkAuth().then((data) => {
        // 授权成功
        this.setData({btnDisable: false})

        // 获得律师详情
        let { id } = options
        this.setData({
          id 
        })
        selectApi.lawyerDetail({id: id}).then(res => {
          let details = res.data
          details.joinDate = details.joinDate && details.joinDate.split(' ')[0]
          details.goodAt = details.goodAt && details.goodAt.split('，')
      
          let score = details.score > 5 ? 5 : details.score < 0 ? 0 : details.score
          let persent = Math.floor(score / app.globalData.maxScore * 100)

          this.setData({
            persent,
            details
          })
        })

        selectApi.data({dictCode: 'PayMoney'}).then(res => {
          console.log(res)
        })

        // 获取用户注册状态  1-用户未注册，需要用户注册；2-用户已注册，不需要提示
        api.getRegisterStatus().then(res => {
            let useCurrentPhone = null
            if (res.data == 1) {
                useCurrentPhone = 1
            }
            this.setData({
                useCurrentPhone,
                regStatus: res.data
            })
        })
        // 获取问题类型
        selectApi.getQuestionType().then(res => {
            this.setData({
                questionType: res.data
            })
        })
      }).catch((e) => {
        // 授权失败
        this.setData({btnDisable: true})
      });
    },
    imageError(e) {
        var _errImg = e.target.dataset.img
        var _errObj = {}
        _errObj[_errImg] = this.data.defaultPic
        this.setData(_errObj)
    },
    questionChange(e) {
        this.setData({
            selectQuestionType: this.data.questionType[e.detail.value]
        })
    },
    amountChange(e) {
        this.setData({
            selectAmount: this.data.amountList[e.detail.value]
        })
    },
    radioChange(e) {
        let { value } = e.detail
        let emergencyRadio = this.data.emergencyRadio
        emergencyRadio.forEach(item => {
            item.checked = item.id == value ? true : false
        })
        this.setData({
            emergencyRadio,
            emergency: value
        })
    },
    regMobileChange(e) {
        let { value } = e.detail
        
        let regRadio = this.data.regRadio
        regRadio.forEach(item => {
            item.checked = item.id == value ? true : false
        })

        this.setData({
            regRadio,
            useCurrentPhone: value
        })
    },
    setValidateMobie(e) {
        let { value } = e.detail

        this.setData({
            validateMobile: value
        })
    },
    setRegisterMobile(e) {
        let { value } = e.detail

        this.setData({
            registerMobile: value
        })
    },
    getValidateCode() {
        if(!/(^1[3|4|5|7|8][0-9]{9}$)/.test(this.data.validateMobile)){
            app.toastError('请输入正确的手机号码');
            return;
        }
        // 发送短信验证码
        selectApi.getSmsCode({phone: this.data.validateMobile}).then(res => {
            this.countTimes('countVal', 'waitValidateCode')
        })
    },
    getRegisterValidateCode() {
        if(!/(^1[3|4|5|7|8][0-9]{9}$)/.test(this.data.registerMobile)){
            app.toastError('请输入正确的手机号码');
            return;
        }
        // 发送短信验证码
        selectApi.getSmsCode({phone: this.data.registerMobile}).then(res => {
            this.countTimes('countReg', 'waitRegisterCode')
        })
    },
    formSubmit(e) {
        // 测试流程
        // app.gotoPage('/pages/issue/success/index?type=1')
        // return 
        let params = e.detail.value
        if (!params.customerRequirement || params.customerRequirement.length < 10) {
            app.toastError('问题不能少于10个字')
            return
        }
        if(!this.data.selectQuestionType){
            app.toastError('请选择所属问题');
            return;
        }
        if(!this.data.selectArea.length){
            app.toastError('请选择地区');
            return;
        }
        if(!/(^1[3|4|5|7|8][0-9]{9}$)/.test(params.contactMobile)){
            app.toastError('请输入正确的手机号码');
            return;
        }
        if(!params.validateCode){
            app.toastError('请输入验证码');
            return;
        }
        if(!this.data.selectAmount){
            app.toastError('请选择支付金额');
            return;
        }
        if(this.data.useCurrentPhone === '0'){
            if(!/(^1[3|4|5|7|8][0-9]{9}$)/.test(params.registerPhone)){
                app.toastError('请输入正确的手机号码');
                return;
            }
            if(!params.registerValidateCode){
                app.toastError('请输入验证码');
                return;
            }
        }
        params.lawyerId = this.data.id
        params.questionType = this.data.selectQuestionType.key
        params.amount = this.data.selectAmount.value
        params.emergency = this.data.emergency
        params.useCurrentPhone = this.data.useCurrentPhone
        params.provice = this.data.selectArea[0]
        params.city = this.data.selectArea[1]
        if (app.globalData.adInfo) {
          params.locationX = app.globalData.adInfo.location.lng
          params.locationY = app.globalData.adInfo.location.lat
        }
        console.log(params)
        userApi.postVoice(params).then(res => {
            console.log(res)
            app.gotoPage('/pages/lawyer/success/index')
        })
    },
    getCityResult(e) {
        let arr = e.detail
        this.setData({
            selectArea: [arr[0].name, arr[1].name]
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
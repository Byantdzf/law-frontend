// pages/issue/legalServices/index.js
const app = getApp()
const api = require('../../../service/auth')
const { formatTime } = require('../../../utils/tools')
const selectApi = require('../../../service/select')
const userApi = require('../../../service/user')
const legalServices = require('../../../service/legalServices')
const { PAGE_KEY, SIZE_KEY } = require('../../../config/global')
let page = null

Page({

    /**
     * 页面的初始数据
     */
    data: {
        regStatus: 1,
        btnDisable: true,
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
        details: {},
        selectDate: '',
        selectCoupon: '',
        regRadio: [
            { id: 1, name: "是", checked: true },
            { id: 0, name: "否" }
        ],
        couponList: [],
        startDate: '',
        aggreement: false,
        showInputNumber: false,
        selectNums: 1,
        list: []
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let { id, ids, t } = options
        this.setData({id, ids})
        
        page = this.selectComponent('#app-page')
        page.checkAuth().then((data) => {
            // 授权成功
            // this.setData({ btnDisable: false })

            let startDate = formatTime(new Date())
            startDate = startDate.split(' ')[0]
            this.setData({startDate})

            this.loadData()

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

            let params = {}
            params[PAGE_KEY] = 1
            params[SIZE_KEY] = 100
            userApi.couponList(params).then(res => {
                let couponList = res.data.list || []
                this.setData({ couponList })
            })
        }).catch((e) => {
            // 授权失败
            this.setData({ btnDisable: true })
        });
    },
    loadData() {
        if (this.data.id) {
            legalServices.getById({id: this.data.id}).then(res => {
                this.setData({
                    selectAmount: res.data.price,
                    list: [{id: res.data.id, name: res.data.title}],
                    showInputNumber: t ? true : false
                })
            })
        } else {
            let idsArr = this.data.ids.split(',')
            let list = []
            let total = 0
            idsArr.forEach(item => {
                legalServices.getById({id: item}).then(res => {
                    list.push({id: res.data.id, name: res.data.title})
                    total += res.data.price
                    this.setData({
                        list,
                        selectAmount: total
                    })
                })
            })
        }
    },
    onShow() {
        let selectArea = app.globalData.adInfo ? [app.globalData.adInfo.province.replace('省', ''), app.globalData.adInfo.city.replace('市', '')] : []
        this.setData({selectArea})
    },
    removeItem(e) {
        let { id } = e.currentTarget.dataset
        let idsArr = this.data.ids.split(',')
        let newArr = []
        idsArr.forEach(item => {
            if (item != id) {
                newArr.push(item)
            }
        })
        this.setData({ids: newArr.join(',')})
        this.loadData()
    },
    // 改变商品数量
    changeCount(e) {
        let { value } = e.detail;
        this.setData({ selectNums: value })
    },
    setValidateMobie(e) {
        let { value } = e.detail

        this.setData({
            validateMobile: value
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
    setRegisterMobile(e) {
        let { value } = e.detail

        this.setData({
            registerMobile: value
        })
    },
    getValidateCode() {
        if (!/(^1[3|4|5|7|8][0-9]{9}$)/.test(this.data.validateMobile)) {
            app.toastError('请输入正确的手机号码');
            return;
        }
        // 获取用户注册状态
        selectApi.getSmsCode({ phone: this.data.validateMobile }).then(res => {
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
    bindDateChange(e) {
        let { value } = e.detail
        this.setData({
            selectDate: value
        })
    },
    couponChange(e) {
        if (this.data.couponList.length) {
            this.setData({
                selectCoupon: this.data.couponList[e.detail.value]
            })
        }
    },
    checkboxChange(e) {
        this.setData({
            aggreement: !this.data.aggreement
        })
        this.setData({ btnDisable: !this.data.aggreement })
    },
    formSubmit(e) {
        // 测试流程
        // app.gotoPage('/pages/issue/success/index?type=3')
        // return 
        let params = e.detail.value
        if (!params.customerRequirement || params.customerRequirement.length < 10) {
            app.toastError('我的要求不能少于10个字')
            return
        }
        if (!this.data.selectDate) {
            app.toastError('请选择交付期限');
            return;
        }
        if (!this.data.selectArea.length) {
            app.toastError('请选择地区');
            return;
        }
        if (!/(^1[3|4|5|7|8][0-9]{9}$)/.test(params.contactMobile)) {
            app.toastError('请输入正确的手机号码');
            return;
        }
        if (!params.validateCode) {
            app.toastError('请输入验证码');
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
        if (this.data.showInputNumber) {
            params.serviceSum = selectNums
        }
        if (this.data.id) {
            params.chooseService = this.data.id
            params.orderCategory = 21
        } else {
            params.chooseService = this.data.ids
            params.orderCategory = 22
        }
        params.deliveryDeadDate = this.data.selectDate
        params.amount = this.data.selectAmount
        params.province = this.data.selectArea[0]
        params.city = this.data.selectArea[1]
        params.useCurrentPhone = this.data.useCurrentPhone
        params.from = 1
        if (app.globalData.adInfo) {
            params.locationX = app.globalData.adInfo.location.lng
            params.locationY = app.globalData.adInfo.location.lat
        }
        if (this.data.selectCoupon) {
            params.couponId = this.data.selectCoupon.id
        }
        
        userApi.postLegals(params).then(res => {
            app.wechatPay(res.data, function (res) {
                app.gotoPage('/pages/issue/success/index?type=3')
            }, function (res) {
                app.alert('支付失败，请到我的订单再次发起支付')
            })
        })
    },
    getCityResult(e) {
        let arr = e.detail
        this.setData({
            selectArea: [arr[0].name, arr[1].name]
        })
    },
    showAgreement() {
        app.gotoPage('/pages/user/setting/agreement/index')
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
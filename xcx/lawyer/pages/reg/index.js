// pages/lawyer/voice/index.js
const app = getApp()
const api = require('../../service/auth')
const selectApi = require('../../service/select')
let page = null

Page({

    /**
     * 页面的初始数据
     */
    data: {
        region: '',
        validateCode: null,
        validateMobile: null,
        waitValidateCode: null,
        countVal: app.globalData.smsCount,
        questionType: [],
        idCard1: '/static/images/idcard1.jpg',
        idCard2: '/static/images/idcard2.jpg',
        idCard3: '/static/images/businessCard.jpg',
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 获取问题类型
        selectApi.getQuestionType().then(res => {
            this.setData({
                questionType: res.data
            })
        })
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
    selectAt(e) {
        let { index } = e.currentTarget.dataset
        let showConObj = 'questionType[' + index + '].selected';
        this.setData({
            [showConObj]: !this.data.questionType[index].selected
        })
    },
    uploadImage(e) {
        let { img } = e.currentTarget.dataset

        var that = this;
        wx.chooseImage({
            count: 1, // 默认9
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                var tempFilePaths = res.tempFilePaths;
                console.log('本地图片的路径:', tempFilePaths)
                that.upload(tempFilePaths, img)
            }
        })
    },
    upload(path, imgId) {
        // 获取问题类型
        let params = {}
        params.filePath = path[0]
        params.requestType = 'uploadFile'
        selectApi.uploadFile(params).then(res => {
            let data = this.data
            data[imgId] = res.data
            this.setData(data)
        })
    },
    formSubmit(e) {
        // 测试流程
        // app.gotoPage('/pages/issue/success/index?type=1')
        // return 
        let params = e.detail.value
        if (!params.name) {
            app.toastError('请输入您的姓名')
            return
        }
        if (!/(^1[3|4|5|7|8][0-9]{9}$)/.test(params.phone)) {
            app.toastError('请输入正确的手机号码');
            return;
        }
        if (!params.phoneVerificationCode) {
            app.toastError('请输入验证码');
            return;
        }
        if (!params.pwd) {
            app.toastError('请输入密码');
            return;
        }
        if (!params.rePwd) {
            app.toastError('请重复输入密码');
            return;
        }
        if (params.pwd != params.rePwd) {
            app.toastError('两次密码输入不一致，请重试');
            return;
        }
        if (!params.identityCard) {
            app.toastError('请输入身份证号码');
            return;
        }
        if (!params.lawerLicenseNo) {
            app.toastError('请输入执业证号码');
            return;
        }
        if (!params.belongs) {
            app.toastError('请输入执业律所');
            return;
        }
        if (!this.data.region) {
            app.toastError('请选择所在地区');
            return;
        }
        
        if (!this.data.idCard1 == '/static/images/idcard1.jpg') {
            app.toastError('请上传身份证（人像面）');
            return;
        }
        if (!this.data.idCard2 == '/static/images/idcard2.jpg') {
            app.toastError('请上传身份证（国徽面）');
            return;
        }
        if (!this.data.idCard3 == '/static/images/businessCard.jpg') {
            app.toastError('请上传执业证书');
            return;
        }

        params.provice = this.data.region[0]
        params.city = this.data.region[1]
        params.zone = this.data.region[2]

        let arr = []
        this.data.questionType.forEach(item => {
            item.selected == true && arr.push(item.value)
        })
        params.goodAt = arr.join(',')
        if (!params.goodAt) {
            app.toastError('请选择擅长领域');
            return;
        }

        var imgArr = [
            {
                businessType: 1,
                fileName: this.data.idCard1
            },
            {
                businessType: 1,
                fileName: this.data.idCard2
            },
            {
                businessType: 2,
                fileName: this.data.idCard3
            }
        ]
        params.uploadFiles = imgArr

        api.register(params).then(res => {
            app.confirm({
                "content": '恭喜您' + params.name + '，注册成功',
                showCancel: false,
            }).then(res => {
                if (res.confirm) {
                    app.gotoPage('/pages/tabBar/home/index', 'tab')
                }
            })
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
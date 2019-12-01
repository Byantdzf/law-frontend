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
        imageWidth: 0,
        imageHeight: 0,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 获取问题类型
        selectApi.data({ dictCode: 'QuestionType' }).then(res => {
            this.setData({
                questionType: res.data || []
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
    createImg(tempFilePaths, res, cb) {
        let that = this;
        let width = res.width;
        let height = res.height;
        let ctx = wx.createCanvasContext('canvas')
        ctx.translate(height / 2, width / 2)
        that.setData({
            imageWidth: height,
            imageHeight: width,
        })
        //顺时针旋转270度
        ctx.rotate(270 * Math.PI / 180)
        ctx.drawImage(tempFilePaths[0], - width / 2, - height / 2, width, height);

        ctx.draw(false, function () {
            wx.canvasToTempFilePath({
                canvasId: 'canvas',
                fileType: 'jpg',
                quality: 0.6,
                success: function (res) {
                    // ctx = null
                    // if (that.data.showFlag) {
                    //     console.log('aaaaaa')
                        // that.createImg(tempFilePaths, res, cb)
                        // that.setData({ showFlag: false })
                    // } else {
                    //     console.log('bbbbbbbbbb')
                        cb && cb(res.tempFilePath)
                    // }
                }
            })
        })
    },
    uploadImage(e) {
        let { img } = e.currentTarget.dataset

        let that = this;
        this.setData({showFlag: true})
        wx.chooseImage({
            count: 1, // 默认9
            success: function (response) {
                let tempFilePaths = response.tempFilePaths;
                
                wx.getImageInfo({
                    src: tempFilePaths[0],
                    success: (res) => {
                        let width = res.width
                        let height = res.height
                        that.setData({
                            imageWidth: width,
                            imageHeight: height,
                        })
                        if (height <= width) {
                            that.upload(tempFilePaths, img)
                        } else {
                            that.createImg(tempFilePaths, res, function (url) {
                                // that.setData({idCard1: url})
                                that.upload([url], img)
                                
                                // wx.saveImageToPhotosAlbum({
                                //     filePath: url,
                                //     success: function (res) {
                                //     wx.showToast({
                                //         title: '保存图片成功',
                                //     })
                                //     }, fail: function (err) {
                                //     wx.showToast({
                                //         title: '保存图片失败',
                                //     })
                                //     }
                                // })
                            })
                        }
                    }
                })
                // wx.getImageInfo({
                //     src: tempFilePaths[0],
                //     success: (res) => {
                //         console.log(res)
                //         //获得exif中的orientation信息   
                //         if (res.orientation == "up") {
                //             that.setData({
                //                 chosenImage: tempFilePaths[0],
                //             })
                //         } else {
                //             let canvasContext = wx.createCanvasContext('canvas')
                //             console.log(res)
                //             switch (res.orientation) {
                //                 case ("down"):
                //                     let width = res.width;
                //                     let height = res.height
                //                     //需要旋转180度
                //                     that.setData({
                //                         imageWidth: width,
                //                         imageHeight: height,
                //                     })
                //                     canvasContext.translate(width / 2, height / 2)
                //                     canvasContext.rotate(180 * Math.PI / 180)
                //                     canvasContext.drawImage(tempFilePaths[0], -width / 2, -height / 2, width, height);
                //                     break;
                //                 case ("left"):
                //                     let width = res.width;
                //                     let height = res.height;
                //                     canvasContext.translate(height / 2, width / 2)
                //                     that.setData({
                //                         imageWidth: height,
                //                         imageHeight: width,
                //                     })
                //                     //顺时针旋转270度
                //                     canvasContext.rotate(270 * Math.PI / 180)
                //                     canvasContext.drawImage(tempFilePaths[0], - width / 2, - height / 2, width, height);
                //                     break;
                //                 case ("right"):
                //                     let width = res.width;
                //                     let height = res.height;
                //                     that.setData({
                //                         imageWidth: height,
                //                         imageHeight: width,
                //                     })
                //                     canvasContext.translate(height / 2, width / 2)
                //                     //顺时针旋转90度
                //                     canvasContext.rotate(90 * Math.PI / 180)
                //                     canvasContext.drawImage(tempFilePaths[0], - width / 2, - height / 2, width, height);
                //                     break;
                //             }
                //             canvasContext.draw()
                //             that.drawImage()
                //         }
                //     }
                // })
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                // console.log('本地图片的路径:', tempFilePaths)
                // that.upload(tempFilePaths, img)
            }
        })
    },
    drawImage:function() {
        let that = this;
        // 将生成的canvas图片，转为真实图片
        wx.canvasToTempFilePath({
            x: 0,
            y: 0,
            canvasId: 'canvas',
            success(res) {
                that.setData({
                    idCard1: res.tempFilePath,
                })
            },
            fail: function (res) {
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
        if (!params.lawyerLicenseNo) {
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

      params.province = this.data.region[0] ? this.data.region[0].replace('省', '') : ''
        params.city = this.data.region[1] ? this.data.region[1].replace('市', '') : ''
        params.zone = this.data.region[2] ? this.data.region[2].replace('区', '') : ''

        let arr = []
        this.data.questionType.forEach(item => {
            item.selected == true && arr.push(item.code)
        })
        params.goodAt = arr.join(',')
        if (!params.goodAt) {
            app.toastError('请选择擅长领域');
            return;
        }

        let imgArr = [
            {
                businessType: 1,
                filePath: this.data.idCard1
            },
            {
                businessType: 10,
                filePath: this.data.idCard2
            },
            {
                businessType: 2,
                filePath: this.data.idCard3
            }
        ]
        params.uploadFiles = imgArr

        api.register(params).then(res => {
            app.confirm({
                "content": '恭喜您' + params.name + '，注册成功',
                showCancel: false,
            }).then(res => {
                if (res.confirm) {
                    app.gotoPage('/pages/login/account/index')
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
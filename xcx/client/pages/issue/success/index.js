// pages/lawyer/success/index.js
const app = getApp()
Page({

    /**
     * 页面的初始数据
     */
    data: {
        type: null,
        downloadDisabled: false,
        progress: 0,
        written: 0,
        expected: '',
        filePath: null,
        dowloadFailed: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let { type } = options
        this.setData({
            type
        })
    },
    downloadFiles() {
        let _t = this
        _t.setData({ downloadDisabled: true })
        const downloadTask = wx.downloadFile({
            // 示例 url
            url: 'http://www.idec.com/language/chinese_s/AO/B-1944(2)_C.pdf',
            success (res) {
                _t.setData({
                    filePath: res.tempFilePath
                })
            },
            fail (e) {
                _t.setData({
                    dowloadFailed: true,
                    downloadDisabled: false,
                    progress: 0,
                    written: 0,
                    expected: '',
                    filePath: null,
                })
            }
        })

        downloadTask.onProgressUpdate((res) => {
            let progress = res.progress
            let written = this.biteChange(res.totalBytesWritten)
            let expected = this.biteChange(res.totalBytesExpectedToWrite)
            this.setData({
                progress,
                written,
                expected
            })
        })
    },
    viewFiles() {
        wx.openDocument({
            filePath: this.data.filePath,
            success: function (res) {
                console.log('打开文档成功')
            }
        })
    },
    biteChange(size) {
        const scale = 1024
        const digitList = ['KB', 'MB', 'GB', 'TB']
        let _integer = size / scale //最小单位kb
        let digit = 0
        while (_integer > scale) {
            _integer = Math.round(_integer / scale)
            digit++
        }
        _integer = Math.round(_integer)
        return `${_integer}${digitList[digit]}`
    },
    gotoFileList() {

    },
    goHome() {
        app.gotoPage('/pages/tabBar/home/index', 'tab')
    }
})
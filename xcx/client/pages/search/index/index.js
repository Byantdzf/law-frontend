
const app = getApp();

Page({
    data: {
        focus: true,
        history: []
    },
    onLoad() {
        // wx.setStorageSync('history', '')
    },

    onShow: function () {
        let history = wx.getStorageSync('history') || []
        this.setData({
            history,
            focus: true
        })
    },
    gotoSearch(e) {
        let name = e.detail.value
        let history = this.data.history
        history = [...history, name]
        history.length > 10 && history.splice(0, 1)
        wx.setStorageSync('history', history)
        app.gotoPage('/pages/search/list/index?t=' + name)
    },
})



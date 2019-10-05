// pages/user/suggestion/index.js
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        focus:true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
    },

    onShow () {
        this.setData({
            focus: true
        })
    },

    //提交
    formSubmit(e) {
        let data = e.detail.value;
        if (!data.content) {
            app.toastError('请填写内容');
            return;
        }

        app.toastSuccess(`保存成功`);
        setTimeout(() => {
            wx.navigateBack()
        }, 800)
    },
})
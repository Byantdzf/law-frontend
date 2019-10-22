// pages/user/setting/home/index.js
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: [
            {
                code: 'about',
                title: '关于我们'
            }, {
                code: 'help',
                title: '帮助中心'
            }, {
                code: 'agreement',
                title: '用户协议'
            }, {
                code: 'feedback',
                title: '意见反馈'
            }
        ]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
    },
    tapTools(e) {
        let { code } = e.currentTarget.dataset
        switch (code) {
            case 'about':
                app.gotoPage('/pages/user/setting/about/index')
                break;
            case 'help':
                app.gotoPage('/pages/user/setting/help/index')
                break;
            case 'agreement':
                app.gotoPage('/pages/user/setting/agreement/index')
                break;
            case 'feedback':
                app.gotoPage('/pages/user/setting/feedback/index')
                break;
        }
    },
    handleContact (e) {
        console.log(e.detail.path)
        console.log(e.detail.query)
    }
})
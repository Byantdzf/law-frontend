// pages/tabBar/user/index.js

let startY = 0, moveY = 0, pageAtTop = true;
let app = getApp();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        coverTransform: 'translateY(0px)',
        coverTransition: '0s',
        moving: false,
        userInfos: {
            id: 1,
            mobile: 18888888888,
            name: 'Leo yo',
            portrait: '/static/images/demo/1.jpg'
        },
        tools: [
            {
                code: 'collect',
                title: '我的关注',
                icon: 'iconfont icon-attention-fill'
            }, {
                code: 'coupon',
                title: '我的优惠券',
                icon: 'iconfont icon-coupon'
            }, {
                code: 'setting',
                title: '设置',
                icon: 'iconfont icon-setting-fill'
            }
        ],
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // let userInfos = wx.getStorageSync('userInfo');
        // this.setData({
        //     userInfos
        // });
    },
    tapTools(e) {
        let { code } = e.currentTarget.dataset
        console.log(code)
        switch (code) {
            case 'collect':
                app.gotoPage('/pages/user/collect/index')
                break;
            case 'coupon':
                app.gotoPage('/pages/user/coupon/index')
                break;
            case 'setting':
                app.gotoPage('/pages/user/setting/home/index')
                break;
        }
    },
    gotoOrder(e) {
        let { state } = e.currentTarget.dataset
        let params = '';
        state && (params = '?state=' + state)
        app.gotoPage('/pages/order/list/index' + params)
    }
})

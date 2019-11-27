// pages/tabBar/user/index.js
let app = getApp();
Page({
    data: {
        userInfos: {
            id: 1,
            mobile: '',
            name: '',
            avatar: ''
        },
        active: false,
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
    onLoad() {

    },
    tapTools(e) {
        let { code } = e.currentTarget.dataset;
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
    activeFn() {
        this.setData({
            active: !this.data.active
        })
    },
    gotoOrder(e) {
      let { state } = e.currentTarget.dataset;
      app.gotoPage(`/pages/order/list/index?curOrderStatus=${state}`);
    }
})

// pages/user/collect/index.js
const { couponStatus } = require('../../../config/global');
let app = getApp();
Page({
  data: {
    couponStatus,
    statusItems: [],
    listUrl: '/applets/user/coupon/list',
    list: [],
  },
  onLoad() {
    app.pages.add(this);
    app.setNavColor();
    let statusItems = [
      {
        id: -1,
        name: '全部'
      }
    ];
    for (let k in couponStatus) {
      statusItems.push({
        id: k,
        name: couponStatus[k]
      })
    }

    this.setData({ statusItems });
    this.appList = this.selectComponent('#app-list');
    
    this.loadList()
  },
  loadList() {
    this.appList = this.selectComponent('#app-list')
    this.appList.setParams()
  },
  updateList(e) {
    this.setData({ list: e.detail })
  },
  handleStatusChange(e) {
    const useStatus = e.detail;
    this.appList.setParams(params => {
      if (useStatus != -1) {
        params.useStatus = useStatus;
      } else {
        delete params.useStatus;
      }
      return params;
    });
  },
})
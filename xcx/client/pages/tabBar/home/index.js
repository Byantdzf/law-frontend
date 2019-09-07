const app = getApp()
const productModel = require('../../../model/product/index.js')
let page = null
Page({
  data: {
    //图片地址
    banners: [
      '/static/images/demo/banner1.png',
      '/static/images/demo/banner2.png',
      '/static/images/demo/banner3.png'
    ],
    serviceTypes: [
      {
        name: '语音咨询',
        icon: 'icon-yuyin',
        iconBg: '#00b0ab'
      }, {
        name: '1对1咨询',
        icon: 'icon-feature',
        iconBg: '#00A2FF'
      }, {
        name: '非诉讼服务',
        icon: 'icon-feisusongzhuanxiang',
        iconBg: '#00b0ab'
      }, {
        name: '诉讼服务',
        icon: 'icon-susong',
        iconBg: '#F64335'
      }, {
        name: '收费委托',
        icon: 'icon-shoufei',
        iconBg: '#FFD200'
      }, {
        name: '风险委托',
        icon: 'icon-fengxian',
        iconBg: '#F9879A'
      }, {
        name: '协议模版',
        icon: 'icon-xieyi',
        iconBg: '#15B774'
      }
    ],
    list: [
      {
        name: '何金宝律师',
        imgUrl: '../../../static/images/demo/wakaka.png',
        score: 4.9,
        desc: '1995年吉林大学法学研究生院毕业后在深圳从事，林大学法学研究生院......',
        helpers: 249,
        followers: 249
      }, {
        name: '何金宝律师',
        imgUrl: '../../../static/images/demo/wakaka.png',
        score: 4.9,
        desc: '1995年吉林大学法学研究生院毕业后在深圳从事，林大学法学研究生院......',
        helpers: 249,
        followers: 249
      }, {
        name: '何金宝律师',
        imgUrl: '../../../static/images/demo/wakaka.png',
        score: 4.9,
        desc: '1995年吉林大学法学研究生院毕业后在深圳从事，林大学法学研究生院......',
        helpers: 249,
        followers: 249
      }
    ]
  },
  onLoad() {
    app.pages.add(this)
    app.setNavColor()
    app.setNavTitle('虎甲律师咨询平台')
  },

  onShow() {
    console.log('home show')
    page = this.selectComponent('#app-page')
    // productModel.query().then(data => {})
    // page.checkAuth().then((data) =>{
    //   // 授权成功
    //   console.log('index auth')
    //   console.log(data)
    // }).catch((e) =>{
    //   // 授权失败
    //   console.log('index auth reject')
    //   console.log(e)
    // });
  }
})

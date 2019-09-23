
const app = getApp();
Page({
  data: {
    list: [
      {
        name: '复仇者联盟',
        imgUrl: '../../../static/images/demo/img_lawyer.png',
        desc: '1995年吉林大学法学研究生院毕业后在深圳从事，林大学法学研究生院......',
        updateTime: '2019-08-09 11:00:00'
      }, {
        name: '系统消息',
        imgUrl: '../../../static/images/demo/wakaka.png',
        desc: 'hello，您好，xxx请求加您为好友',
        updateTime: '2019-08-09 11:00:00'
      }, {
        name: '18110868606',
        imgUrl: '../../../static/images/demo/wakaka.png',
        desc: '1995年吉林大学法学研究生院毕业后在深圳从事，林大学法学研究生院......',
        updateTime: '2019-08-09 11:00:00'
      }
    ],
  },
  onLoad() {
    app.pages.add(this)
    app.setNavColor()
  },
  gotoDetail(e) {
    let { id } = e.currentTarget.dataset
    app.gotoPage('/pages/message/detail/index?id=' + id)
  },
})
const api = require('../../../service/order');
let app = getApp();
Page({
  data: {
    lawyer: {},
    professionalAttitudeScore: 0,
    serviceAttitudeScore: 0,
    content: '',
  },
  onLoad({ id, lawyer, lawyerPic }) {
    this.setData({
      lawyer: {
        name: lawyer,
        pic: lawyerPic
      }
    });
    this.orderId = id;
  },
  handleScoreChange(e) {
    const { key } = e.currentTarget.dataset;
    const value = e.detail
    this.data[key] = value;
  },
  handleContentChange(e) {
    this.data.content = e.detail.value;
  },
  submit() {
    const { professionalAttitudeScore, serviceAttitudeScore, content } = this.data
    const params = {
      professionalAttitudeScore,
      serviceAttitudeScore,
      content,
      id: this.orderId
    };
    api.orderEvaluate(params).then(res => {
      wx.navigateBack();
      wx.showToast({
        title: '评价已提交',
        icon: 'success'
      });
    })
  }
})

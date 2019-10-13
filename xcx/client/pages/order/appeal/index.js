const api = require('../../../service/order');
let app = getApp();
Page({
  data: {
    items: [
      { name: '言语辱骂', value: 1, checked: 'true' },
      { name: '答非所问', value: 2 },
      { name: '其他', value: 3 }
    ],
    appealType: 1,
    remark: '',
  },
  onLoad({ id }) {
    this.orderId = id;
  },
  radioChange(e) {
    const { value } = e.detail
    this.appealType = value;
  },
  handleContentChange(e) {
    this.data.remark = e.detail.value;
  },
  submit() {
    const { appealType, remark } = this.data
    const params = {
      appealType,
      remark,
      id: this.orderId
    };
    api.orderAppeal(params).then(res => {
      wx.navigateBack();
      wx.showToast({
        title: '申诉已提交',
        icon: 'success'
      });
    })
  }
})

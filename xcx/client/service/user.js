
const { get, post, postJson } = require('../utils/ajax.js')

module.exports = {
  /**
   * 领取优惠券
  */
  couponAdd: params => postJson('/applets/user/coupon/add', params),
}
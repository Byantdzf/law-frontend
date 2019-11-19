import { get, postJson, del, put, putJson } from '@/utils/xhr.js'

const system = {
  namespaced: true,
  actions: {
    // 优惠券 -- 详情
    couponView: (context, id) => get(`/pc/coupon/${id}`),
    // 优惠券 -- 添加
    couponAdd: (context, params) => postJson(`/pc/coupon/pool`, params),
    // 优惠券 -- 修改
    couponUpdate: (context, params) => putJson(`/pc/coupon/pool`, params),
    // 优惠券 -- 删除
    couponDel: (context, ids) => del(`/pc/coupon/pool/${ids}`),

    servicePhoneQuery: () => get('/platform/phone'),
    servicePhoneSetting: (context, params) => put('/platform/phone', params),
  }
}
  
export default system

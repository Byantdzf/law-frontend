import { get } from '@/utils/xhr.js'

const order = {
  namespaced: true,
  actions: {
    // 订单详情
    orderView: (context, orderId) => get('orderTrip/getOrderTripByOrderId', { orderId })
  }
}
  
export default order;

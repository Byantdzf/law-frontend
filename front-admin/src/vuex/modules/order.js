import { get,post } from '@/utils/xhr.js'

const order = {
  namespaced: true,
  actions: {
    // 订单详情
    orderView: (context, orderId) => get('orderTrip/getOrderTripByOrderId', { orderId }),
    //获取确认函id
    getOrderTripByOrderId: (context, data) => get('/orderTrip/getOrderTripByOrderId',  data,  { loading: false }),
    //获取确认函内容
    getSendTravelConfirmLetterHtml: (context, data) => get('/orderTaili/getSendTravelConfirmLetterHtml',  data,  { loading: false }),
    // 发送邮件
    sendTravelConfirmLetter: (context, orderId) => post('/orderTaili/sendTravelConfirmLetter', orderId),
    //获取订单日记
    orderLog: (context, data) => get('/orderLog/queryOrderLogPage',  data,  { loading: false }),
    // 导出出行人
    exportTravelList: (context, orderId) => get('/pt/order/exportTravelList', orderId),


  }
}
  
export default order;

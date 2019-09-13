
/** 
 * app-date-picker
 * 日期组件（编辑、只读模式）
 * 带 * 为必填字段
 * @prop {String, Number, Array} value 输入框绑定值
 * @prop {String} field *form表单属性字段
 * @prop {String} type  *year/month/date/dates/week/datetime/datetimerange/daterange 
 * @prop {String} placeholder 
 * @prop {String} startPlaceholder 
 * @prop {String} endPlaceholder 
 * @prop {String} format 显示在输入框中的格式 默认yyyy-MM-dd
 * @prop {String} valueFormat 绑定值的格式 默认yyyy-MM-dd
 * @prop {String} size  输入框大小
 * @prop {Boolean} readonly  是否只读 默认false
 * @prop {Object} row  table列表的行
 * @prop {Object} col  table列表的列
 * @method change  value变化触发事件 { field, value, row, col }
 * @method focus  获得焦点事件
 * @method blur  失去焦点事件
*/

import AppDatePicker from './src/main.vue'

export default AppDatePicker;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component(AppDatePicker.name, AppDatePicker);
}
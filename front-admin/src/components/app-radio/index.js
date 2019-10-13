
/** 
 * app-radio
 * 单选组件（编辑、只读模式）
 * 带 * 为必填字段
 * @prop {String, Number} value 绑定值
 * @prop {String} field *form表单属性字段
 * @prop {String} size  大小
 * @prop {Boolean} readonly  是否只读 默认false
 * @prop {Array} options 单选选项[String, Number, Object]
 * @prop {Function} labelFormater 下拉选项内容自定义
 * @prop {Object} row  table列表的行
 * @prop {Object} col  table列表的列
 * @method change  value变化触发事件 { field, value, row, col }
*/

import AppRadio from './src/main.vue'

export default AppRadio;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component(AppRadio.name, AppRadio);
}
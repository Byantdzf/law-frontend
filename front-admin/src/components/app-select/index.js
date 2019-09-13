
/** 
 * app-select
 * 下拉框组件（编辑、只读模式，有单位/无单位）
 * 带 * 为必填字段
 * @prop {String, Number} value 下拉框绑定值
 * @prop {String} field *form表单属性字段
 * @prop {String} placeholder 
 * @prop {String} size  大小
 * @prop {Boolean} readonly  是否只读 默认false
 * @prop {Array} options 下拉选项[String, Number, Object]
 * @prop {Function} labelFormater 下拉选项内容自定义
 * @prop {Object} row  table列表的行
 * @prop {Object} col  table列表的列
 * @method change  value变化触发事件 { field, value, row, col }
*/

import AppSelect from './src/main.vue'

export default AppSelect;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component(AppSelect.name, AppSelect);
}
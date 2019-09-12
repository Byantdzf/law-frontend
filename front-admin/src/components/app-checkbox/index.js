
/** 
 * app-checkbox
 * 多选框组件（编辑、只读模式）
 * 带 * 为必填字段
 * @prop {String, Number, Array} value 绑定值
 * @prop {String} field *form表单属性字段
 * @prop {String} size  大小
 * @prop {Boolean} readonly  是否只读 默认false
 * @prop {Array} options 多选框选项[String, Number, Object]
 * @prop {Function} optionsFormater 下拉选项内容自定义
 * @prop {Object} row  table列表的行
 * @prop {Object} col  table列表的列
 * @method change  value变化触发事件 { field, value, row, col }
*/

import AppCheckbox from './src/main.vue'

export default AppCheckbox;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component(AppCheckbox.name, AppCheckbox);
}
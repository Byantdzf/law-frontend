
/** 
 * app-input
 * 输入框组件（编辑、只读模式，有单位/无单位，是否数字类型）
 * 带 * 为必填字段
 * @prop {String, Number, Object} value *输入框绑定值  模糊搜索时，需要传入Object
 * @prop {String, Array} field *form表单属性字段
 * @prop {String} type  *text或者textarea ，password
 * @prop {String} placeholder 
 * @prop {String} size  输入框大小
 * @prop {Boolean} password  是否为密码输入框 默认false 或者type = 6
 * @prop {Boolean} number  是否只能输入数字类型 默认false
 * @prop {Boolean} autocomplete  自动补齐 默认off
 * @prop {Boolean} readonly  是否只读 默认false
 * @prop {Object, String, Number} prepend(prepend)  Object{ value: '绑定值', field: '单位form表单字段', options: ['下拉选项'], optionsFormater: function(){ 自定义下拉内容  return String或Number } }
  * @prop {Object, String, Number} append(append)  Object{ value: '绑定值', field: '单位form表单字段', options: ['下拉选项'], optionsFormater: function(){ 自定义下拉内容  return String或Number } }
 * @prop {Object} row  table列表的行
 * @prop {Object} col  table列表的列
 * @prop {Function} fetchSuggestions 有该属性，则会使用模糊搜索
 * @prop {String} nameKey 模糊搜索时显示的键名 默认name
 * @prop {String} idKey 模糊搜索时输出的键名 默认id
 * @method change  value变化触发事件 { field, value, row, col }
 * @method focus  获得焦点事件
 * @method blur  失去焦点事件
*/

import AppInput from './src/main.vue'

export default AppInput;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component(AppInput.name, AppInput);
}
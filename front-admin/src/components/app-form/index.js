/** 
 * app-form
 * form表单组件
 * @prop {Object} init 初始化配置
 * @prop {Boolean} init.inline 是否行内 默认true
 * @prop {String} init.size  大小 默认small
 * @prop {String} init.align  对齐方式 left、right center 默认left
 * @prop {String} init.itemWidth  item的宽
 * @prop {String} init.btnItemWidth 按钮item宽
 * @prop {String} init.labelWidth item label宽
 * @prop {Array} items *[item<Object>]
 * @prop {String, Number, Array} item.value  item初始值
 * @prop {String} item.field  *表单字段
 * @prop {String} item.size  设置则覆盖init.size
 * @prop {String} item.type  *类型 { 1: 'input输入框', 2: 'select下拉框', 3: 'radio单选', 4: 'checkbox多选', 5: 'textarea输入框', 6: 'input输入框, 数字类型', 7: 'date日期', 8: 'time时间', 9: 'datetime日期时间', 10: 'daterange日期范围' }
 * @prop {Array} btns *[btn<Object>]
 * @prop {String} btn.label 按钮文字
 * @prop {String} btn.code 按钮唯一标识
 * @prop {String} btn.size 按钮大小
 * @prop {String} btn.type 按钮类型
 * @method btn.code  触发方法根据btn的code决定（code为cancel，clear，reset时会清空表单）
*/


import AppForm from './src/main.vue'

export default AppForm;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component(AppForm.name, AppForm);
}
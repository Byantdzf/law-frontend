/** 
 * app-dialog
 * 弹出框
 * todo 拖拽
 * @prop {String} title 标题
 * @prop {String} width 宽
 * @prop {Boolean} visible 是否展现 默认false
 * @method open  
 * @method close
 * @method closed 
*/
import AppDialog from './src/main.vue'

export default AppDialog;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component(AppDialog.name, AppDialog);
}
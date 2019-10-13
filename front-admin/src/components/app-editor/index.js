
/**
 * 参考：
 * https://www.cnblogs.com/dmcl/p/7152711.html
 */

import AppEditor from './src/main.vue'

export default AppEditor;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component(AppEditor.name, AppEditor);
}
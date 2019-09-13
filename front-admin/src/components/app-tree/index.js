
import AppTree from './src/main.vue'

export default AppTree;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component(AppTree.name, AppTree);
}
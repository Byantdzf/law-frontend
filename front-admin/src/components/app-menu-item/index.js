
import AppMenuItem from './src/main.vue'

export default AppMenuItem;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component(AppMenuItem.name, AppMenuItem);
}

import AppMenu from './src/main.vue'
 
export default AppMenu;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component(AppMenu.name, AppMenu);
}
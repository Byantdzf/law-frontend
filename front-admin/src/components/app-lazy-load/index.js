
import AppLazyLoad from './src/main.vue'
 
export default AppLazyLoad;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component(AppLazyLoad.name, AppLazyLoad);
}

import AppLoading from './src/main.vue'
 
export default AppLoading;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component(AppLoading.name, AppLoading);
}
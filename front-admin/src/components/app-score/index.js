
import AppScore from './src/main.vue'

export default AppScore;

if (typeof window !== 'undefined' && window.Vue) {
  window.Vue.component(AppScore.name, AppScore);
}
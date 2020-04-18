import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import '@/assets/style/style.css';
import axios from 'axios'
import VueAxios from 'vue-axios'
//import pathToRegexp from 'path-to-regexp'
import qs from 'qs';
import Cookies from 'js-cookie';
import moment from 'moment';
import echarts from 'echarts';

Vue.prototype.$moment = moment;//赋值使用
moment.locale('zh-cn');//需要汉化
Vue.config.productionTip = false;
Vue.use(ElementUI)
Vue.use(Cookies)
Vue.prototype.$http=axios;
Vue.prototype.$echarts = echarts;
//Vue.use(VueAxios,axios);
Vue.prototype.$qs=qs;
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount("#app");
/* Vue.prototype.formatWord = function (val) {
  return val.replace(/\n/g, '<br>')

} */
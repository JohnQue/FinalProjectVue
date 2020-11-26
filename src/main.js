import Vue from 'vue';
import App from './App.vue';
import * as VueGoogleMaps from 'vue2-google-maps';

import router from './router/index';
import store from './store';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';

Vue.config.productionTip = false;
// Install BootstrapVue
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCTQIlxBn5AfKGvsfJiormAE1esN3fcCkg',
    libraries: 'places',
  },
});

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');

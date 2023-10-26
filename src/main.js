import Vue from 'vue'
import App from './App.vue'
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import * as VueGoogleMaps from 'vue2-google-maps'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

Vue.use(VueGoogleMaps, {
  load: {
    // key: 'YOUR_API_TOKEN',
    key: process.env.VUE_APP_GOOGLE_MAPS_API_KEY,
    libraries: 'places'
  },
})

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

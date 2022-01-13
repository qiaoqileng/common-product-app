import App from './App'
import uView from 'uview-ui';
// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
//#ifdef H5

import Vconsole from 'vconsole'
 
if (process.env.NODE_ENV === 'development') {
	let vConsole = new Vconsole()
	Vue.use(vConsole)
}
//#endif
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif
Vue.prototype.$EventBus = new Vue();

Vue.use(uView);
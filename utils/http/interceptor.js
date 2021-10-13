/*
 *接口拦截
 *
 * */
// 未登录code
const errorCode = ['-19', '-159', '-201', '-202'];
import {BASE_URL, BASE_DATA_URL} from 'utils/constant';
import util from "utils/fun"

function configFactory(baseUrl) {
  return {
    baseUrl: baseUrl,
    loadingText: '努力加载中~',
    loadingTime: 800,
    // 设置自定义头部content-type
    header: {
      'X-Requested-With': 'XMLHttpRequest',
      'content-type': 'application/x-www-form-urlencoded'
    }
  }
}

let configDic = {
  'api': configFactory(uni.getStorageSync('api') ? uni.getStorageSync('api') : BASE_URL),
  'dataApi': configFactory(uni.getStorageSync('dataApi') ? uni.getStorageSync('dataApi') : BASE_DATA_URL)
}

let defaultConfig = configDic['api']

const install = (Vue) => {

  Vue.prototype.$u.http.setConfig(configDic['api']);

  Vue.prototype.$u.http.interceptor.request = (config) => {

    // console.log('域名')
    // console.log(uni.getStorageSync('api'))

    if (config['url'] && config['url'].startsWith('/api')) {
      Vue.prototype.$u.http.setConfig(configDic['api']);
    } else if (config['url'] && config['url'].startsWith('/dataApi')) {
      Vue.prototype.$u.http.setConfig(configDic['dataApi']);
    }

		// 获取token， 设置用户凭证
    const key = util.getTokenKey()
    const val = util.getToken()
    if (key) config.header[key] = val
    if (config.data && config.data._json) {
      config.header['content-type'] = 'application/json'
    }

	  return config
   }
  Vue.prototype.$u.http.interceptor.response = (response) => {
    if (response) {
      if (response.data.code) {
        // console.log(response.data)
        if (response.data.code == 401 || response.data.code == 203) {
          uni.clearStorageSync()
          util.setTimeout(()=>{
            uni.redirectTo({
              url: '../login/index'
            })
          })
        } else {
          if(response.data.code != 200){
            return Promise.reject(response.data)
          }
          return response.data
        }
      } else {
        util.toast(`服务器错误`)
      }
    }
  }
}

export default {
	install,
}

import Vue from 'vue'
import Cookies from 'js-cookie'
import 'normalize.css/normalize.css' // a modern alternative to CSS resets
import Element from 'element-ui'
import './styles/element-variables.scss'
import '@/styles/index.scss' // global css
import App from './App'
import store from './store'
import router from './router'
import i18n from './lang' // internationalization
import './icons' // icon
import './permission' // permission control
import './utils/error-log' // error log
import * as filters from './filters' // global filters
import './plugins/jquery-1.4.4.min'
import './plugins/ztree/js/jquery.ztree.core'
import './plugins/ztree/js/jquery.ztree.excheck'

// import { VueAxios } from '@/utils/request'
import ApiService from '@/api/api-service'
Vue.prototype.post = (url, params, success, fail) => {
    ApiService.post(url, params, success, fail)
}

//数据字典 下拉框数据字典 表格数据字典
import {getSelectDict , getTableList } from '@/utils/table'
Vue.prototype.getSelectDict = getSelectDict
Vue.prototype.getTableList = getTableList

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */
if (process.env.NODE_ENV === 'production') {
  const { mockXHR } = require('../mock')
  mockXHR()
}


//全局修改默认配置，点击空白处不能关闭弹窗
Element.Dialog.props.closeOnClickModal.default = false
Vue.use(Element, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

// register global utility filters
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})

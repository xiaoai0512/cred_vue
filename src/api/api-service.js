import { axios } from '@/utils/request'
// import message from 'ant-design-vue/es/message'
import Vue from 'vue'
// import { ACCESS_TOKEN } from '@/store/mutation-types'
import { getToken } from '@/utils/auth' // get token from cookie
import { MessageBox, Message } from 'element-ui'

export default {
  name: 'ApiService',
  post,
  get,
  put,
  dele
}




/**
 * 通用post请求方法
 * @param {*} apiUrl
 * @param {*} parameter
 */
function post (apiUrl, parameter, success, error) {
  parameter = parameter || {}
  // parameter.gid = Vue.ls.get(ACCESS_TOKEN)
  parameter.gid = getToken()

  axios({
    url: apiUrl,
    method: 'post',
    data: parameter
  }).then(res => {
    if (res) {
    	// console.log(res)
      if (res.returnCode === '000000') {
        success && success(res || res)
      } else if (res.returnCode === 'CUS-00014') { // 客户新建
        success && success(res || res)
      } else {
       Message.error(res.returnMsg)
        error && error(res)
      }
    } else {
      error && error(res)
    }
  }).catch(err => {
  	console.log(err)
//  console.error('post ' + apiUrl + ', handle error', err)
    // Message.error('业务异常，Error:' + err)
    error && error(err)
  })
}
function get (apiUrl, parameter, success, error) {
  parameter = parameter || {}
  // parameter.gid = Vue.ls.get(ACCESS_TOKEN)
  parameter.gid = getToken()
  axios.get(apiUrl, { params: parameter }).then(res => {
    if (res) {
    //   console.log(res)
      if (res.returnCode === '000000') {
        success && success(res || res)
      } else {
        Message.error(res.message)
        error && error(res)
      }
    } else {
      error && error(res)
    }
  }).catch(err => {
    console.error('get ' + apiUrl + ', handle error', err)
    // Message.error('业务异常，Error:' + err)
    error && error(err)
  })
}
function put (apiUrl, parameter, success, error) {
  parameter = parameter || {}
  // parameter.gid = Vue.ls.get(ACCESS_TOKEN)
  parameter.gid = getToken()
  axios.put(apiUrl, parameter).then(res => {
    if (res) {
      if (res.returnCode === '000000') {
        success && success(res || res)
      } else {
        Message.error(res.message)
        error && error(res)
      }
    } else {
      error && error(res)
    }
  }).catch(err => {
    console.error('get ' + apiUrl + ', handle error', err)
    // Message.error('业务异常，Error:' + err)
    error && error(err)
  })
}
function dele (apiUrl, parameter, success, error) {
  parameter = parameter || {}
  // parameter.gid = Vue.ls.get(ACCESS_TOKEN)
  parameter.gid = getToken()
  axios.delete(aspiUrl, { params: parameter }).then(res => {
    if (res) {
    //   console.log(res)
      if (res.returnCode === '000000') {
        success && success(res || res)
      } else {
        Message.error(res.message)
        error && error(res)
      }
    } else {
      error && error(res)
    }
  }).catch(err => {
    console.error('get ' + apiUrl + ', handle error', err)
    // Message.error('业务异常，Error:' + err)
    error && error(err)
  })
}

import axios from 'axios'
import { MessageBox, Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import router from '@/router'
import { VueAxios } from './axios'
// create an axios instance
const service = axios.create({
    //   baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
    // withCredentials: true, // send cookies when cross-domain requests
    //   timeout: 8000 // request timeout
})

// request interceptor
service.interceptors.request.use(config => {
        // do something before request is sent
        // const clientToken = store.getters.clientToken
        if (store.getters.clientToken) {
            // let each request carry token
            // ['X-Token'] is a custom headers key
            // please modify it according to the actual situation
            // config.headers['Access-Token'] = clientToken
            config.headers['Access-Token'] = getToken()
            config.headers['X-Token'] = getToken()
        }


        //公共传参处理
        let logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))
        let commonParam
        if (logininfo) {
            commonParam = {
                adminFlagUser: logininfo.adminFlagUser,
                clientToken: logininfo.clientToken,
                corporation: logininfo.corporationEntityNo,
                // loginName : logininfo.loginName,
                operatorId: logininfo.loginName,
                // password : logininfo.password,
                userLanguage: logininfo.userLanguage,
                adminFlagUser: logininfo.adminFlag,
            }
        }
        // 修改公共参数 不覆盖
        for (let key1 in commonParam) {
            for (let key2 in config.data) {
                if (key1 == key2) {
                    commonParam[key1] = config.data[key2]
                }
            }
        }
        config.data = {...config.data, ...commonParam }
        return config
    },
    error => {
        // do something with request error
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    /**
     * If you want to get http information such as headers or status
     * Please return  response => response
     */

    /**
     * Determine the request status by custom code
     * Here is just an example
     * You can also judge the status by HTTP Status Code
     */
    response => {
        const res = response.data
        const newCstBuildFlag = sessionStorage.getItem('newCstBuildFlag') // 新客户建立标记
        if (res.returnCode == '000000') {
            if (res.returnCode == '000000') {
                return res
            } else if (res.returnCode == 401) {
                window.sessionStorage.clear()
                router.push({ path: '/login' })
                Message.error('登录已失效，请重新登录')
            } else {
                const ms = res.returnMsg ? res.returnMsg : res.returnData.returnMsg
                Message.error('Error:' + ms)
            }

        } else if (res.returnCode == 'CUS-00054') {
            window.sessionStorage.clear()
            router.push({ path: '/login' })
            Message.error('登录已失效，请重新登录')
        } else if (newCstBuildFlag && res.returnCode == 'CUS-00014') { // 新客户建立
            return {
                returnCode: 'CUS-00014'
            }
        } else {
            console.log(res)
                //    Message.error('服务器通信异常,Error:' + res.returnMsg)
            return res
        }

        // if the custom code is not 20000, it is judged as an error.
        // if (res.returnCode !== '000000') {
        //   sessionStorage.clear()
        //   router.push({ path: '/login' })
        //   Message({
        //     message: res.message || 'Error',
        //     type: 'error',
        //     duration: 5 * 1000
        //   })

        //   // 50008: Illegal token; 50012: Other clients logged in; 50014: Token expired;
        //   if (res.returnCode === 50008 || res.returnCode === 50012 || res.returnCode === 50014 || res.returnCode === 401) {
        //     // to re-login
        //     MessageBox.confirm('You have been logged out, you can cancel to stay on this page, or log in again', 'Confirm logout', {
        //       confirmButtonText: 'Re-Login',
        //       cancelButtonText: 'Cancel',
        //       type: 'warning'
        //     }).then(() => {
        //        store.dispatch('user/resetToken').then(() => {
        //         location.reload()
        //       })
        //     })
        //   }
        //   return Promise.reject(new Error(res.message || 'Error'))
        // } else {
        //   return res
        // }
    },
    error => {
        console.log('err' + error) // for debug
        Message({
            message: error.message,
            type: 'error',
            duration: 5 * 1000
        })
        return Promise.reject(error)
    }
)

// export default service


const installer = {
    vm: {},
    install(Vue) {
        Vue.use(VueAxios, service)
    }
}
export {
    installer as VueAxios,
    service as axios
}
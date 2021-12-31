import Cookies from 'js-cookie'

const TokenKey = 'Admin-Token'

//获取token
export function getClientToken() {
    return window.sessionStorage.getItem('clientToken')
}
export function removeClientToken() {
    return window.sessionStorage.removeItem('clientToken')
}
//获取本地语言
export function getLang() {
    let userLanguage = window.sessionStorage.getItem('language')
    if (!language) {
        return null
    }
    return language
}
// 获取浏览器默认语言
export function getBrowserLang() {
    let browserLang = navigator.language ? navigator.language : navigator.browserLanguage
    let defaultBrowserLang = ''
    if (browserLang.toLowerCase() === 'cn' || browserLang.toLowerCase() === 'zh' || browserLang.toLowerCase() === 'zh-cn') {
        defaultBrowserLang = 'zh-CN'
    } else {
        defaultBrowserLang = 'en-US'
    }
    return defaultBrowserLang
}

// 设置localStorage
export const setLang = function(key, obj) {
    let json = JSON.stringify(obj)
    window.localStorage.setItem(key, json)
}
export function removeLang() {
    return window.sessionStorage.removeItem('language')
}



export function getToken() {
    return Cookies.get(TokenKey)
}

export function setToken(token) {
    return Cookies.set(TokenKey, token)
}

export function removeToken() {
    return Cookies.remove(TokenKey)
}
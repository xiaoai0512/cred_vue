// import { login, logout, getInfo,loginIder } from '@/api/user'
import { getToken, setToken, removeToken, removeClientToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import store from '@/store'

import ApiService from '@/api/api-service'

const state = {
    // token: getToken(),
    // name: '',
    // avatar: '',
    // introduction: '',
    // roles: [],

    logininfo: '',
    clientToken: '',
    language: 'cn'
}

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_INTRODUCTION: (state, introduction) => {
        state.introduction = introduction
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    },
    SET_ROLES: (state, roles) => {
        state.roles = roles
    },

    SET_LOGIN_INFO: (state, logininfo) => {
        window.sessionStorage.setItem('logininfo', JSON.stringify(logininfo))
        state.logininfo = logininfo
    },
    SET_CLIENT_TOKEN: (state, clientToken) => {
        state.clientToken = clientToken
    },

    SET_USER_LANGUAGE: (state, userLanguage) => {
        state.userLanguage = userLanguage
    },
}

const actions = {
    //uer login
    login({ commit }, userInfo) {
        const { loginName, password } = userInfo
        return new Promise((resolve) => {
            ApiService.post('/beta/betaService/COS.CS.01.0018', userInfo, (response) => {
                const { returnData } = response
                //缓存登录数据
                returnData.loginName = loginName
                returnData.password = password
                commit('SET_LOGIN_INFO', returnData)
                commit('SET_CLIENT_TOKEN', returnData.clientToken)
                commit('SET_USER_LANGUAGE', returnData.userLanguage)
                store.dispatch('app/setLanguage', returnData.userLanguage) //设置多语言
                window.sessionStorage.setItem('language', returnData.userLanguage)
                window.sessionStorage.setItem('userLanguage', returnData.userLanguage)
                window.sessionStorage.setItem('clientToken', returnData.clientToken)
                window.sessionStorage.setItem('logininfo', JSON.stringify(returnData))
                resolve()
            })
        })
    },
    // user logout
    logout({ commit, state, dispatch }) {
        return new Promise((resolve, reject) => {
            // logout(state.token).then(() => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            removeToken()
            resetRouter()

            commit('SET_CLIENT_TOKEN', '')
            removeClientToken()

            // reset visited views and cached views
            // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
            dispatch('tagsView/delAllViews', null, { root: true })

            resolve()
                // }).catch(error => {
                //   reject(error)
                // })
        })
    },

    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
            commit('SET_TOKEN', '')
            commit('SET_ROLES', [])
            removeToken()
            resolve()
        })
    },

    // dynamically modify permissions
    async changeRoles({ commit, dispatch }, role) {
        const token = role + '-token'

        commit('SET_TOKEN', token)
        setToken(token)

        const { roles } = await dispatch('getInfo')

        resetRouter()

        // generate accessible routes map based on roles
        const accessRoutes = await dispatch('permission/generateRoutes', roles, { root: true })
            // dynamically add accessible routes
        router.addRoutes(accessRoutes)

        // reset visited views and cached views
        dispatch('tagsView/delAllViews', null, { root: true })
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}
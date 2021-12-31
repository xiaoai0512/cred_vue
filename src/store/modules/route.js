// import { getAllRoutes, getAccessRoutes } from '@/api/route'
import { getToken, setToken, removeToken } from '@/utils/auth'
import router, { resetRouter } from '@/router'
import store from '@/store'

const state = {
  token: getToken(),
  allList: [],
  curFirstList: [],
  module: '',
  menuListInfo: '',
  roles: [],
  menuIndex: ''
}

const mutations = {
  SET_ALL_LIST: (state, allList) => {
    state.allList = allList
  },
  SET_CUR_FIRST_LIST: (state, curFirstList) => {
    state.curFirstList = curFirstList
  },
  SET_MODULE: (state, module) => {
    state.module = module
  },
  SET_MENU_LIST_INFO: (state, menuListInfo) => {
    state.menuListInfo = menuListInfo
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_MENU_INDEX: (state, menuIndex) => {
    state.menuIndex = menuIndex
  }
}

const actions = {
  // get all lists
  getAllRoutes({ commit }) {
    return new Promise((resolve, reject) => {
      // getAllRoutes().then(response => {
      ApiService.post('/beta/betaService/COS.CS.01.0024', (response) => {
        const { returnData } = response
        const { menuList } = returnData
        commit('SET_ALL_LIST', menuList)
        // resolve(returnData)
        resolve(response)
      })
        .catch(error => {
          reject(error)
        })
    })
  },

  // get access lists
  getAccessRoutes({ commit }) {
    return new Promise((resolve, reject) => {
      // getAccessRoutes().then(response => {
      ApiService.post('/beta/betaService/COS.CS.01.0028', (response) => {
        const { returnData } = response
        const { menuList } = returnData
        // commit('SET_ACCESS_LIST', menuList)
        // resolve(returnData)
        resolve(response)
      })
      // .catch(error => {
      //   reject(error)
      // })
    })
  },

  setModule({ commit }, params) {
    return new Promise((resolve, reject) => {
      const data = {
        module : params.module ,
        curFirstList: params.curFirstList,
        menuIndex: params.menuIndex,
        menuNo: params.curFirstList.menuNo
      }

      commit('SET_MENU_INDEX', data.menuIndex)
      commit('SET_CUR_FIRST_LIST', data.curFirstList)
      commit('SET_MENU_LIST_INFO', data)
      commit('SET_MODULE', data.module)
      resolve(data)
    })
  },

  getMudolue({ commit }, menuIndex) {
    return new Promise((resolve, reject) => {
      const data = { }
      let moduleStr
      if (menuIndex == 0) {
        moduleStr = 'beta'// 配置中心
      } else if (menuIndex == 1) {
        moduleStr = 'operate' // 运营中心
      } else if (menuIndex == 2) {
        moduleStr = 'cstSvc' // 客户服务
      } else if (menuIndex == 3) {
        moduleStr = 'auth' // 授权服务
      } else if (menuIndex == 4) {
        moduleStr = 'quotaService' // 额度服务
      } else if (menuIndex == 5) {
        moduleStr = 'stageAndLoan' // 分期及消贷
      } else if (menuIndex == 6) {
        moduleStr = 'clearup' // 清分清算
      } else if (menuIndex == 7) {
        moduleStr = 'disputeService' // 争议服务
      } else if (menuIndex == 8) {
        moduleStr = 'businessCard' // 公务卡服务
      } else if (menuIndex == 9) {
        moduleStr = 'operateAndMaintService' // 运维服务
      }
      data.module = moduleStr
      commit('SET_MODULE', data.module)
      resolve(data)
    })
  },
  // user logout
  logout({ commit, state, dispatch }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken()
        resetRouter()

        // reset visited views and cached views
        // to fixed https://github.com/PanJiaChen/vue-element-admin/issues/2485
        dispatch('tagsView/delAllViews', null, { root: true })

        resolve()
      }).catch(error => {
        reject(error)
      })
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

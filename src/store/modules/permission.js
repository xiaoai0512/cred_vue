import { constantRoutes } from '@/router'
import store from '@/store'
import Layout from '@/layout'
import { uppercaseFirst } from '@/filters/index'
import router from '@/router'


/* /**
 * 根据后端返回的菜单列表构建菜单路由
 * @param data 后端返回数据
 * */
export function handleAsyncRoutes ( routers, data) {
    let module = store.getters.module
  if (data.childMenus && data.childMenus.length > 0) {
    data.childMenus.forEach((route, index) => {
      let pathItem = {}
      if (route.menuLevel == 2 && route.lowerMenuFlag == 0) { // 2级菜单 无3级
        // pathObj例如事件清单
        pathItem.path = route.link
        pathItem.component = Layout
        pathItem.meta = {}
        pathItem.meta.title = route.menuName
        pathItem.meta.icon =  route.icon ? route.icon : 'icon' + index
        pathItem.meta.breadcrumb = false
        pathItem.meta.menuNo = route.menuNo
        pathItem.redirect = route.link
        let lastRouteStr = route.link.split("/")[route.link.split("/").length-1] //name 首字母大写
        pathItem.children = []
        let pathChildItem = {}
        pathChildItem.path = route.link
        //页面路径  例如 @/views/icons/index
        // console.log(`@/views/${module}/${lastRouteStr}/${lastRouteStr}`)
        pathChildItem.component = (resolve) => require([`@/views/${module}/${lastRouteStr}/${lastRouteStr}`], resolve)
        pathChildItem.name = uppercaseFirst(lastRouteStr)//首字母大写
        pathChildItem.meta = {}
        pathChildItem.meta.title = route.menuName
        pathChildItem.meta.menuNo = route.menuNo
        pathItem.children.push(pathChildItem) // 无3级菜单childern只需1个
        routers.push(pathItem)
      } else if (route.menuLevel == 2 && route.lowerMenuFlag == 1) { // 2级菜单 有3级
        // pathObj例如 节假日管理
        pathItem.path = route.childMenus[0].link+'/redirect'
        pathItem.component = Layout
        pathItem.meta = {}
        pathItem.meta.title = route.menuName
        pathItem.meta.menuNo = route.menuNo
        pathItem.meta.icon = route.icon ? route.icon : 'icon' + index
        pathItem.redirect = route.childMenus[0].link
        pathItem.children = []
        route.childMenus.forEach((routeChild, ik) => {
          let pathChildItem = {} //children中的路径
          let lastRouteStr = routeChild.link.split("/")[routeChild.link.split("/").length - 1] //link /最后一个路径字符串
          pathChildItem.path =  routeChild.link
          //页面路径  例如 @/views/icons/index
        //   console.log(`@/views/${module}/${lastRouteStr}/${lastRouteStr}`)
          
          pathChildItem.component = (resolve) => require([`@/views/${module}/${lastRouteStr}/${lastRouteStr}`], resolve)
          pathChildItem.name = uppercaseFirst(lastRouteStr)
          pathChildItem.meta = {}
          pathChildItem.meta.title = routeChild.menuName
          pathChildItem.meta.menuNo = routeChild.menuNo
          pathChildItem.meta.noCache = true
          pathItem.children.push(pathChildItem)
        })
        routers.push(pathItem)
      }
    })
  }
//   return res
}

const state = {
  routers: constantRoutes,
  addRouters: [],
}

const mutations = {
  SET_ROUTERS: (state, routers) => {
    state.addRouters = routers
    state.routers = constantRoutes.concat(routers)
    //这里将动态组装的路由添加到路由里面
    // router.addRoutes(state.routers)
    router.selfaddRoutes(state.routers)
  }
}

const actions = {
    GenerateRoutes ({ commit }, data) {
        return new Promise(resolve => {
            // 获取缓存中的菜单信息
            if (store.getters.module) {
                // console.log(store.getters.curFirstList)
                
                let menu = store.getters.curFirstList
                let routers = []
                handleAsyncRoutes(routers, menu)
                
                commit('SET_ROUTERS', routers)

                resolve()
            }
        })
    }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

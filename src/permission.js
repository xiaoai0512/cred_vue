import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getClientToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login', '/auth-redirect'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getClientToken()

  if (hasToken) {
    if (to.path === '/login' && !to.query.redirect) {
      // if is logged in, redirect to the home page
      next({ path: '/home' })
      NProgress.done()
    } else if (to.path === '/home') {
        // console.log('home')
      next()
      NProgress.done()
    } else {
        // console.log(store.getters.addRouters)
        if (!store.getters.addRouters || store.getters.addRouters.length == 0) {
            const params = {
                roles: ['admin'],
                module: store.getters.module
            }
            store.dispatch('permission/GenerateRoutes', params).then(() => {
                next({ ...to, replace: true })
            })
        } else {
            // console.log('next')
            next()
            NProgress.done()
        }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})

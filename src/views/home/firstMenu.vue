<template>
  <el-container>
    <div class="guide-slider">
      <div class="clearfix" />
      <div id="guideSlider01" class="guide-slider01">
        <ul class="guide-list ul-m">
          <li v-for="(item,index) in menuOneList" :key="index" class="guide guide01Li" :menuid="item.id" @click="layerHandle(item.icon)">
            <div class="display" :class="{iconmenu01:'menuBg01',iconmenu02:'menuBg02'}[item.icon]">
              <div class="icon animated flipInY" :class="{iconmenu01:'icon1',iconmenu02:'icon2'}[item.icon]" />
              <div>
                <div class="title">{{ item.menuName }}</div>
                <div class="introduction">{{ item.menuDesc }}</div>
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="clearfix" />
      <div id="guideSlider02" class="guide-slider02">
        <ul class="guide-list ul-m">
          <li v-for="(item,index) in menuTwoList" :key="index" class="guide guide02Li" :menuid="item.id" @click="layerHandle(item.icon)">
            <div class="display" :class="{iconmenu03:'menuBg03',iconmenu04:'menuBg04',iconmenu06: 'menuBg06',iconmenu09: 'menuBg09'}[item.icon]">
              <div class="icon animated flipInY" :class="{iconmenu03:'icon3',iconmenu04:'icon4',iconmenu06: 'icon6',iconmenu09: 'icon9'}[item.icon]" />
              <div class="title">{{ item.menuName }}</div>
              <div class="introduction">{{ item.menuDesc }}</div>
            </div>
          </li>
        </ul>
      </div>
      <div class="clearfix" />
      <div id="guideSlider03" class="guide-slider03">
        <ul class="guide-list ul-m">
          <li v-for="(item,index) in menuThreeList" :key="index" class="guide guide03Li" :menuid="item.id" @click="layerHandle(item.icon)">
            <div class="display" :class="{iconmenu07:'menuBg07',iconmenu08:'menuBg08',iconmenu05: 'menuBg05',iconmenu10: 'menuBg10'}[item.icon]">
              <div class="icon animated flipInY" :class="{iconmenu05: 'icon5',iconmenu07:'icon7',iconmenu08:'icon8',iconmenu10: 'icon10'}[item.icon]" />
              <div class="title">{{ item.menuName }}</div>
              <div class="introduction">{{ item.menuDesc }}</div>
            </div>
          </li>
        </ul>
      </div>
      <div class="clearfix" />
    </div>
    <el-aside width="26%" style="margin-left: 1%; background: none;">
      <div
        ref="r_menu"
        class="r_menu"
        :class="{iconmenu01:'menuBg01',iconmenu02:'menuBg02',
                 iconmenu03: 'menuBg03',iconmenu04: 'menuBg04',iconmenu05: 'menuBg05',iconmenu06: 'menuBg06',
                 iconmenu07: 'menuBg07',iconmenu08: 'menuBg08',iconmenu09: 'menuBg09',iconmenu10: 'menuBg10'}[menuFisrtObj.icon]"
      >
        <div
          class="r_title"
          :class="{iconmenu01:'menuBg01',iconmenu02:'menuBg02',
                   iconmenu03: 'menuBg03',iconmenu04: 'menuBg04',iconmenu05: 'menuBg05',iconmenu06: 'menuBg06',
                   iconmenu07: 'menuBg07',iconmenu08: 'menuBg08',iconmenu09: 'menuBg09',iconmenu10: 'menuBg10'}[menuFisrtObj.icon]"
        >
          <div
            class="r_img"
            :class="{iconmenu01:'icon01',iconmenu02:'icon02',
                     iconmenu03: 'icon03',iconmenu04: 'icon04',iconmenu05: 'icon05',iconmenu06: 'icon06',
                     iconmenu07: 'icon07',iconmenu08: 'icon08',iconmenu09: 'icon09',iconmenu10: 'icon10'}[menuFisrtObj.icon]"
          />
          <div class="text">{{ menuFisrtObj.menuName }}</div>
        </div>
        <div class="menu-wrap">
          <ul class="function-list">
            <li v-for="(itemSub,index) in menuSecondList" :key="index" @click="goLayout(itemSub)">
              <a
                :class="{iconmenu01:'mbg01',iconmenu02:'mbg02',
                         iconmenu03: 'mbg03',iconmenu04: 'mbg04',iconmenu05:'mbg05',iconmenu06:'mbg06',
                         iconmenu07:'mbg07',iconmenu08:'mbg08',iconmenu09: 'mbg09',iconmenu10: 'mbg10',}[menuFisrtObj.icon]"
                href="javascript:;"
              >{{ itemSub.menuName }}</a>
            </li>
          </ul>
        </div>
      </div>
    </el-aside>
  </el-container>
</template>

<script>
// import { getAllRoutes, getAccessRoutes, getModule  } from '@/api/route'
import store from '@/store'
import { Message } from 'element-ui'
import ApiService from '@/api/api-service'
import { resetRouter } from '@/router'

export default {
  name: 'FirstMenu',
  data() {
    return {
      menuAllList: [],
      menuOneList: [],
      menuTwoList: [],
      menuThreeList: [],
      menuSecondList: [],
      menuFisrtObj: [],
      accessMenuList: [], // 所有权限菜单
      accessMenuStr: '', // 有权限菜单字符串拼接
      firstMenuOrder: 0, // 定位一级菜单
      curAccessFirstMenuList: [], // 当前权限一级菜单

      addRouters: []
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
    this.init()
  },
  mounted() {
    this.getMenuList()
    this.getAccessMenuList()
  },
  methods: {
    init() {
      // 重置标签tagsList
      store.state.tagsView.visitedViews = []
      store.state.permission.addRouters = [] // module变化时，初始化路由 
    },
    // 获取所有菜单遍历
    getMenuList() {
      // this.$store.dispatch('route/getAllRoutes')
      //   .then((res) => {
      ApiService.post('/beta/betaService/COS.CS.01.0024', {}, (response) => {
        const res = response.returnData
        this.menuAllList = res.menuList
        // 循环菜单获取第一行第二行第三行一级菜单
        this.menuAllList.forEach((item, index) => {
          if (index < 2) {
            this.menuOneList.push(item)
          } else if (index > 1 && index < 6) {
            this.menuTwoList.push(item)
          } else if (index > 5) {
            this.menuThreeList.push(item)
          }
        })
        // 右侧默认显示第一个一级菜单下的二级菜单
        this.menuFisrtObj = this.menuAllList[0]
        this.menuSecondList = this.menuAllList[0].childMenus
      })
      // .catch(() => {})
    },
    // 获取权限菜单
    getAccessMenuList() {
      // this.$store.dispatch('route/getAccessRoutes')
      //   .then((res) => {
      let logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))
      console.log(logininfo)
      const menuParam = {
        loginName : logininfo.loginName
      }
      ApiService.post('/beta/betaService/COS.CS.01.0028', menuParam, (response) => {
        console.log(response)
        const res = response.returnData
        this.accessMenuList = res.menuList
        this.curAccessFirstMenuList = this.accessMenuList[this.firstMenuOrder]
      })
      // .catch(() => {})
    },
    // 当前菜单是否有权限
    isHasAccess(itemSub) {
      this.curAccessFirstMenuList.childMenus.forEach((item, index) => {
        this.accessMenuStr += item.menuNo + ' '
      })
      if (this.accessMenuStr.search(itemSub.menuNo) != -1) {
        return true
      } else {
        return false
      }
    },
    // 点击二级菜单，进入菜单页面
    goLayout(itemSub) {
      const accessFlag = itemSub
      this.isHasAccess(itemSub)
      if (accessFlag) {
        const data = this.menuFisrtObj
        let moduleStr
        if (data.menuNo == 'RES101666') {
          moduleStr = 'beta' // 配置中心
        } else if (data.menuNo == 'RES101667') {
          moduleStr = 'operate' // 运营中心
        } else if (data.menuNo == 'RES101668') {
          moduleStr = 'cstSvc' // 客户服务
        } else if (data.menuNo == 'RES101669') {
          moduleStr = 'auth' // 授权服务
        } else if (data.menuNo == 'RES101678') {
          moduleStr = 'quotaService' // 额度服务
        } else if (data.menuNo == 'RES101673') {
          moduleStr = 'stageAndLoan' // 分期及消贷
        } else if (data.menuNo == 'RES101672') {
          moduleStr = 'clearup' // 清分清算
        } else if (data.menuNo == 'RES101670') {
          moduleStr = 'disputeService' // 争议服务
        } else if (data.menuNo == 'RES101674') {
          moduleStr = 'businessCard' // 公务卡服务
        } else if (data.menuNo == 'RES101671') {
          moduleStr = 'operateAndMaintService' // 运维服务
        }
        const params = {
          module: moduleStr,
          curFirstList: this.menuFisrtObj,
          menuIndex: this.firstMenuOrder
        }
        this.$store.dispatch('route/setModule', params)
          .then((res) => {
            if (itemSub.link) { // 二级菜单 无三级菜单
              this.$router.push(this.$route.query.redirect || itemSub.link )
            //   console.log(itemSub.menuNo) 
              window.sessionStorage.setItem('menuNo',itemSub.menuNo)
            } else { // 二级菜单 有三级菜单
              this.$router.push(this.$route.query.redirect || itemSub.childMenus[0].link )
            //   console.log(itemSub.childMenus[0].menuNo) 
              window.sessionStorage.setItem('menuNo',itemSub.childMenus[0].menuNo)
            }
          })
      } else {
        Message({
          showClose: true,
          message: '没有权限',
          type: 'warning'
        })
      }
    },
    // 点击一级菜单显示下面所有的二级菜单
    layerHandle(menuId) {
        resetRouter()
      if (menuId == 'iconmenu01') {
        this.queryMenu('iconmenu01')
      } else if (menuId == 'iconmenu02') {
        this.queryMenu('iconmenu02')
      } else if (menuId == 'iconmenu03') {
        this.queryMenu('iconmenu03')
      } else if (menuId == 'iconmenu04') {
        this.queryMenu('iconmenu04')
      } else if (menuId == 'iconmenu05') {
        this.queryMenu('iconmenu05')
      } else if (menuId == 'iconmenu06') {
        this.queryMenu('iconmenu06')
      } else if (menuId == 'iconmenu07') {
        this.queryMenu('iconmenu07')
      } else if (menuId == 'iconmenu08') {
        this.queryMenu('iconmenu08')
      } else if (menuId == 'iconmenu09') {
        this.queryMenu('iconmenu09')
      } else if (menuId == 'iconmenu10') {
        this.queryMenu('iconmenu10')
      }
    },
    queryMenu(menuIcon) {
      this.menuAllList.forEach((item, index) => {
        if (item.icon == menuIcon) {
          this.menuFisrtObj = item
          this.menuSecondList = item.childMenus
          this.firstMenuOrder = index
            if (item.menuName == 'RES101666') { // 配置中心
                this.$store.getters.module = 'beta'
            } else if (item.menuName == 'RES101667') { //运营中心
                this.$store.getters.module = 'operate'
            } else if (item.menuName == 'RES101668') { // 客户服务
                this.$store.getters.module = 'cstSvc'
            } else if (item.menuName == 'RES101669') { // 授权服务
                this.$store.getters.module = 'auth'
            } else if (item.menuName == 'RES101678') { // 额度服务
                this.$store.getters.module = 'quotaService'
            } else if (item.menuName == 'RES101673') { // 分期及消贷 
                this.$store.getters.module = 'stageAndLoan'
            } else if (item.menuName == 'RES101672') { // 清分清算 
                this.$store.getters.module = 'clearup'
            } else if (item.menuName == 'RES101670') { // 争议服务 
                this.$store.getters.module = 'disputeService'
            } else if (item.menuName == 'RES101674') { // 公务卡服务 
                this.$store.getters.module = 'businessCard'
            } else if (item.menuName == 'RES101671') { // 运维服务 
                this.$store.getters.module = 'operateAndMaintService'
            }
        }
      })
      // 重置当前权限一级菜单
      this.curAccessFirstMenuList = this.accessMenuList[this.firstMenuOrder] // 当前权限一级菜单
    }

  }
}
</script>
<style scoped>
  .guide-slider {
    width: 73%;
    padding-top: 8px;
  }
  .ul-m{
      margin: 0;
    }
  .guide-slider01 .guide {
    width: 50%;
    height: 195px;
    float: left;
    transition: all linear .1s;
    position: relative;
    overflow: hidden;
    margin-bottom: 10px;
  }

  .guide-slider01 .guide01Li,
  .guide-slider02 .guide02Li,
  .guide-slider03 .guide03Li {
    display: block;
    cursor: pointer;
  }

  .guide .menuBg01 {
    background-color: rgba(80, 116, 210, .4);
  }

  .guide .menuBg02 {
    background-color: rgba(43, 178, 66, .4);
  }

  .guide .menuBg03 {
    background: rgb(249, 225, 215);
  }

  .guide .menuBg04 {
    background: rgb(221, 236, 234);
  }

  .guide .menuBg05 {
    background: rgb(221, 236, 234);
  }

  .guide .menuBg08 {
    background: rgb(221, 236, 234);
  }

  .guide .menuBg06 {
    background: rgb(232, 234, 241);
  }

  .guide .menuBg07 {
    background: rgb(232, 234, 241);
  }

  .guide .menuBg08 {
    background: rgb(249, 225, 215);
  }

  .guide .menuBg09 {
    background: rgb(246, 234, 215);
  }

  .guide .menuBg10 {
    background: rgb(246, 234, 215);
  }

  .guide-slider .guide .display {
    width: 100%;
    height: 195px;
    text-align: center;
    float: left;
    position: relative;
    z-index: 2;
  }

  .guide-slider01 .guide .display {
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all linear .2s;
  }

  .guide-slider01 .guide .icon {
    margin-right: 10px;
  }

  .guide-slider .guide .display .icon {
    display: inline-block;
    width: 89px;
    height: 89px;
    margin-top: 10px;
  }

  .guide-slider01 .guide .display .icon.icon1 {
    background-image: url(../../assets/image/menu_01.png);
  }

  .guide-slider01 .guide .display .icon.icon2 {
    background-image: url(../../assets/image/menu_02.png);
  }

  .guide-slider02 .guide .display .icon.icon3 {
    background-image: url(../../assets/image/menu_03.png);
  }

  .guide-slider02 .guide .display .icon.icon4 {
    background-image: url(../../assets/image/menu_04.png);
  }

  .guide-slider02 .guide .display .icon.icon9 {
    background-image: url(../../assets/image/menu_09.png);
  }

  .guide-slider02 .guide .display .icon.icon6 {
    background-image: url(../../assets/image/menu_06.png);
  }

  .guide-slider03 .guide .display .icon.icon7 {
    background-image: url(../../assets/image/menu_07.png);
  }

  .guide-slider03 .guide .display .icon.icon8 {
    background-image: url(../../assets/image/menu_08.png);
  }

  .guide-slider03 .guide .display .icon.icon10 {
    background-image: url(../../assets/image/menu_10.png);
  }

  .guide-slider03 .guide .display .icon.icon5 {
    background-image: url(../../assets/image/menu_05.png);
  }

  .guide-slider01 .guide .display .title {
    font-size: 18px;
    color: #fff;
    height: 25px;
    line-height: 20px;
  }

  .guide-slider02 .guide .display .title,
  .guide-slider03 .guide .display .title {
    font-size: 18px;
    color: #333;
    height: 25px;
    line-height: 20px;
  }

  .guide-slider01 .guide .display .introduction {
    border-top: 1px solid #ddd;
    width: 185px;
    margin: 0 auto;
    font-size: 12px;
    color: #fff;
    text-align: left;
    line-height: 20px;
  }

  .guide-slider02 .guide .display .introduction,
  .guide-slider03 .guide .display .introduction {
    border-top: 1px solid #ddd;
    width: 205px;
    margin: 0 auto;
    font-size: 12px;
    color: #333;
    text-align: center;
    line-height: 20px;
  }

  .guide-slider02 .guide,
  .guide-slider03 .guide {
    width: 25%;
    height: 195px;
    float: left;
    -webkit-transition: all ease-in .3s;
    transition: all ease-in .3s;
    position: relative;
    overflow: hidden;
    margin-bottom: 10px;
  }

  .r_menu {
    width: 100%;
    height: 605px;
  }

  .r_menu.menuBg01 {
    background-color: rgba(80, 116, 210, .4);
  }

  .r_menu.menuBg02 {
    background-color: rgba(43, 178, 66, .4);
  }

  .r_menu.menuBg03 {
    background: rgb(249, 225, 215);
  }

  .r_menu.menuBg04 {
    background: rgb(221, 236, 234);
  }

  .r_menu.menuBg09 {
    background: rgb(246, 234, 215);
  }

  .r_menu.menuBg06 {
    background: rgb(232, 234, 241);
  }

  .r_menu.menuBg07 {
    background: rgb(232, 234, 241);
  }

  .r_menu.menuBg08 {
    background: rgb(249, 225, 215);
  }

  .r_menu.menuBg05 {
    background: rgb(221, 236, 234);
  }

  .r_menu.menuBg10 {
    background: rgb(246, 234, 215);
  }

  .r_title {
    width: 100%;
    height: 70px;
  }

  .r_menu .menuBg01 {
    background-color: rgb(79, 116, 209);
  }

  .r_menu .menuBg02 {
    background-color: rgb(43, 168, 63);
  }

  .r_menu .menuBg03 {
    background-color: rgb(225, 97, 39);
  }

  .r_menu .menuBg04 {
    background-color: rgb(4, 159, 154);
  }

  .r_menu .menuBg09 {
    background-color: rgb(240, 153, 0);
  }

  .r_menu .menuBg06 {
    background-color: rgb(110, 147, 224);
  }

  .r_menu .menuBg07 {
    background-color: rgb(110, 147, 224);
  }

  .r_menu .menuBg08 {
    background-color: rgb(225, 107, 54);
  }

  .r_menu .menuBg05 {
    background-color: rgb(4, 159, 154);
  }

  .r_menu .menuBg10 {
    background-color: rgb(234, 153, 19);
  }

  .r_title .r_img,
  .r_title .text {
    float: left;
  }

  .r_title .r_img {
    width: 65px;
    height: 65px;
    background-size: contain;
    margin-top: 0px;
    margin-left: 10px;
  }

  .r_title .icon01 {
    background-image: url(../../assets/image/menu_01.png);
  }

  .r_title .icon02 {
    background-image: url(../../assets/image/menu_02.png);
  }

  .r_title .icon03 {
    background-image: url(../../assets/image/menu_03.png);
  }

  .r_title .icon04 {
    background-image: url(../../assets/image/menu_04.png);
  }

  .r_title .icon05 {
    background-image: url(../../assets/image/menu_05.png);
  }

  .r_title .icon06 {
    background-image: url(../../assets/image/menu_06.png);
  }

  .r_title .icon07 {
    background-image: url(../../assets/image/menu_07.png);
  }

  .r_title .icon08 {
    background-image: url(../../assets/image/menu_08.png);
  }

  .r_title .icon09 {
    background-image: url(../../assets/image/menu_09.png);
  }

  .r_title .icon10 {
    background-image: url(../../assets/image/menu_10.png);
  }

  .r_title .text {
    height: 70px;
    font-size: 18px;
    line-height: 70px;
    margin-left: 0px;
    color: #fff;
  }

  .r_menu .menu-wrap {
    width: 280px;
    margin: 0 auto;
    margin-top: 10px;
  }

  .menu-wrap ul {
    list-style: none;
  }

  .menu-wrap li {
    float: left;
    padding-right: 10px;
  }

  .menu-wrap .function-list>li>a {
    display: block;
    border: 1px dotted #ddd;
    width: 100px;
    height: 40px;
    font-size: 14px;
    text-align: center;
    line-height: 40px;
    margin-bottom: 12px;
    color: #111;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .menu-wrap .function-list>li:hover a {
    font-size: 14px;
    border: 1px dotted #999;
    text-decoration: none;
    color: #fff;
    z-index: 1;
  }

  .menu-wrap .function-list>li:hover a.mbg01 {
    /* background: -webkit-linear-gradient(rgb(120, 168, 238), rgb(103, 88, 199))
    background: -o-linear-gradient(rgb(120, 168, 238), rgb(103, 88, 199))
    background: -moz-linear-gradient(120, 168, 238), rgb(103, 88, 199) ) */
    background: linear-gradient(rgb(120, 168, 238), rgb(103, 88, 199));
    /* -webkit-box-shadow: 0 2px 1px 0 rgb(120, 168, 238), 0 8px 1px -3px rgb(103, 88, 199, 0.5);
    -moz-box-shadow: 0 2px 1px 0 rgb(120, 168, 238), 0 8px 1px -3px rgb(103, 88, 199, 0.5); */
    box-shadow: 0 2px 1px 0 rgb(120, 168, 238), 0 8px 1px -3px rgb(103, 88, 199, 0.5);
  }

  .menu-wrap .function-list>li:hover a.mbg02 {
    background: -webkit-linear-gradient(rgb(113, 226, 133), rgb(60, 180, 81));
    /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(rgb(113, 226, 133), rgb(60, 180, 81));
    /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(rgb(113, 226, 133), rgb(60, 180, 81));
    /* Firefox 3.6 - 15 */
    background: linear-gradient(rgb(113, 226, 133), rgb(60, 180, 81));
    /* æ ‡å‡†çš„è¯­æ³• */
    -webkit-box-shadow: 0 2px 1px 0 rgb(113, 226, 133), 0 8px 1px -3px rgb(60, 180, 81, 0.5);
    -moz-box-shadow: 0 2px 1px 0 rgb(113, 226, 133), 0 8px 1px -3px rgb(60, 180, 81, 0.5);
    box-shadow: 0 2px 1px 0 rgb(113, 226, 133), 0 8px 1px -3px rgb(60, 180, 81, 0.5);
  }

  .menu-wrap .function-list>li:hover a.mbg03 {
    background: -webkit-linear-gradient(rgb(240, 151, 108), rgb(224, 108, 54));
    /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(rgb(240, 151, 108), rgb(224, 108, 54));
    /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(rgb(240, 151, 108), rgb(224, 108, 54));
    /* Firefox 3.6 - 15 */
    background: linear-gradient(rgb(240, 151, 108), rgb(224, 108, 54));
    /* æ ‡å‡†çš„è¯­æ³• */

    -webkit-box-shadow: 0 2px 1px 0 rgb(240, 151, 108), 0 8px 1px -3px rgb(224, 108, 54, 0.5);
    -moz-box-shadow: 0 2px 1px 0 rgb(240, 151, 108), 0 8px 1px -3px rgb(224, 108, 54, 0.5);
    box-shadow: 0 2px 1px 0 rgb(240, 151, 108), 0 8px 1px -3px rgb(224, 108, 54, 0.5);
  }

  .menu-wrap .function-list>li:hover a.mbg04 {
    background: -webkit-linear-gradient(rgb(58, 203, 199), rgb(4, 159, 154));
    /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(rgb(58, 203, 199), rgb(4, 159, 154));
    /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(rgb(58, 203, 199), rgb(4, 159, 154));
    /* Firefox 3.6 - 15 */
    background: linear-gradient(rgb(58, 203, 199), rgb(4, 159, 154));
    /* æ ‡å‡†çš„è¯­æ³• */
    -webkit-box-shadow: 0 2px 1px 0 rgb(58, 203, 199), 0 8px 1px -3px rgb(4, 159, 154, 0.5);
    -moz-box-shadow: 0 2px 1px 0 rgb(58, 203, 199), 0 8px 1px -3px rgb(4, 159, 154, 0.5);
    box-shadow: 0 2px 1px 0 rgb(58, 203, 199), 0 8px 1px -3px rgb(4, 159, 154, 0.5);
  }

  .menu-wrap .function-list>li:hover a.mbg05 {
    background: -webkit-linear-gradient(rgb(58, 203, 199), rgb(4, 159, 154));
    /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(rgb(58, 203, 199), rgb(4, 159, 154));
    /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(rgb(58, 203, 199), rgb(4, 159, 154));
    /* Firefox 3.6 - 15 */
    background: linear-gradient(rgb(58, 203, 199), rgb(4, 159, 154));
    /* æ ‡å‡†çš„è¯­æ³• */
    -webkit-box-shadow: 0 2px 1px 0 rgb(58, 203, 199), 0 8px 1px -3px rgb(4, 159, 154, 0.5);
    -moz-box-shadow: 0 2px 1px 0 rgb(58, 203, 199), 0 8px 1px -3px rgb(4, 159, 154, 0.5);
    box-shadow: 0 2px 1px 0 rgb(58, 203, 199), 0 8px 1px -3px rgb(4, 159, 154, 0.5);
  }

  .menu-wrap .function-list>li:hover a.mbg06 {
    background: -webkit-linear-gradient(rgb(137, 168, 235), rgb(4, 159, 154));
    /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(rgb(137, 168, 235), rgb(4, 159, 154));
    /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(rgb(137, 168, 235), rgb(4, 159, 154));
    /* Firefox 3.6 - 15 */
    background: linear-gradient(rgb(137, 168, 235), rgb(4, 159, 154));
    /* æ ‡å‡†çš„è¯­æ³• */
    -webkit-box-shadow: 0 2px 1px 0 rgb(137, 168, 235), 0 8px 1px -3px rgb(4, 159, 154, 0.5);
    -moz-box-shadow: 0 2px 1px 0 rgb(137, 168, 235), 0 8px 1px -3px rgb(4, 159, 154, 0.5);
    box-shadow: 0 2px 1px 0 rgb(137, 168, 235), 0 8px 1px -3px rgb(4, 159, 154, 0.5);
  }

  .menu-wrap .function-list>li:hover a.mbg07 {
    background: -webkit-linear-gradient(rgb(137, 168, 235), rgb(4, 159, 154));
    /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(rgb(137, 168, 235), rgb(4, 159, 154));
    /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(rgb(137, 168, 235), rgb(4, 159, 154));
    /* Firefox 3.6 - 15 */
    background: linear-gradient(rgb(137, 168, 235), rgb(4, 159, 154));
    /* æ ‡å‡†çš„è¯­æ³• */
    -webkit-box-shadow: 0 2px 1px 0 rgb(137, 168, 235), 0 8px 1px -3px rgb(4, 159, 154, 0.5);
    -moz-box-shadow: 0 2px 1px 0 rgb(137, 168, 235), 0 8px 1px -3px rgb(4, 159, 154, 0.5);
    box-shadow: 0 2px 1px 0 rgb(137, 168, 235), 0 8px 1px -3px rgb(4, 159, 154, 0.5);
  }

  .menu-wrap .function-list>li:hover a.mbg08 {
    background: -webkit-linear-gradient(rgb(240, 151, 108), rgb(224, 108, 54));
    /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(rgb(240, 151, 108), rgb(224, 108, 54));
    /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(rgb(240, 151, 108), rgb(224, 108, 54));
    /* Firefox 3.6 - 15 */
    background: linear-gradient(rgb(240, 151, 108), rgb(224, 108, 54));
    /* æ ‡å‡†çš„è¯­æ³• */
    -webkit-box-shadow: 0 2px 1px 0 rgb(240, 151, 108), 0 8px 1px -3px rgb(224, 108, 54, 0.5);
    -moz-box-shadow: 0 2px 1px 0 rgb(240, 151, 108), 0 8px 1px -3px rgb(224, 108, 54, 0.5);
    box-shadow: 0 2px 1px 0 rgb(240, 151, 108), 0 8px 1px -3px rgb(224, 108, 54, 0.5);
  }

  .menu-wrap .function-list>li:hover a.mbg09 {
    background: -webkit-linear-gradient(rgb(228, 168, 68), rgb(240, 153, 0));
    /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(rgb(228, 168, 68), rgb(240, 153, 0));
    /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(rgb(228, 168, 68), rgb(240, 153, 0));
    /* Firefox 3.6 - 15 */
    background: linear-gradient(rgb(228, 168, 68), rgb(240, 153, 0));
    /* æ ‡å‡†çš„è¯­æ³• */
    -webkit-box-shadow: 0 2px 1px 0 rgb(228, 168, 68), 0 8px 1px -3px rgb(240, 153, 0, 0.5);
    -moz-box-shadow: 0 2px 1px 0 rgb(228, 168, 68), 0 8px 1px -3px rgb(240, 153, 0, 0.5);
    box-shadow: 0 2px 1px 0 rgb(228, 168, 68), 0 8px 1px -3px rgb(240, 153, 0, 0.5);
  }

  .menu-wrap .function-list>li:hover a.mbg10 {
    background: -webkit-linear-gradient(rgb(228, 168, 68), rgb(240, 153, 0));
    /* Safari 5.1 - 6.0 */
    background: -o-linear-gradient(rgb(228, 168, 68), rgb(240, 153, 0));
    /* Opera 11.1 - 12.0 */
    background: -moz-linear-gradient(rgb(228, 168, 68), rgb(240, 153, 0));
    /* Firefox 3.6 - 15 */
    background: linear-gradient(rgb(228, 168, 68), rgb(240, 153, 0));
    /* æ ‡å‡†çš„è¯­æ³• */
    -webkit-box-shadow: 0 2px 1px 0 rgb(228, 168, 68), 0 8px 1px -3px rgb(240, 153, 0, 0.5);
    -moz-box-shadow: 0 2px 1px 0 rgb(228, 168, 68), 0 8px 1px -3px rgb(240, 153, 0, 0.5);
    box-shadow: 0 2px 1px 0 rgb(228, 168, 68), 0 8px 1px -3px rgb(240, 153, 0, 0.5);
  }
</style>

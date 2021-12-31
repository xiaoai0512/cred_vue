<template>
  <div class="login-container" style="position: relative;">
    <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">

      <div class="title-container">
        <!-- <h3 class="title">IDER creditX</h3> -->
        <img class="" src="../../assets/image/logo.png" alt="">
        <lang-select class="set-language" />
      </div>

      <el-form-item prop="loginName">
        <span class="svg-container">
          <svg-icon icon-class="user" />
        </span>
        <el-input
          ref="loginName"
          v-model="loginForm.loginName"
          placeholder="Username"
          name="loginName"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            placeholder="Password"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
          />
          <!-- @keyup.enter.native="handleLogin" -->
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-form-item prop="verificationCode" style="width:65%">
        <span class="svg-container">
          <svg-icon icon-class="yanzhengma" />
        </span>
        <el-input
          ref="verificationCode"
          v-model="loginForm.verificationCode"
          placeholder="verifyCode"
          name="verificationCode"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>
      <el-button type="primary" style="width:30%;height:46px;position: absolute;top: 60%;right: 5%;" @click="getCode()" :disabled="timer">
          <span v-if="showTimer">{{timerCount}}</span>{{text}}
        </el-button>
      <el-button :loading="loading" type="primary" style="width:100%;margin-bottom:30px;" @click.native.prevent="handleLogin">
        {{ $t('login.logIn') }}
      </el-button>
    </el-form>

    <el-dialog title="Or connect with" :visible.sync="showDialog">
      Can not be simulated on local, so please combine you own business simulation! ! !
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog>
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import SocialSign from './components/SocialSignin'
import LangSelect from '@/components/LangSelect'
import ApiService from '@/api/api-service'
import { mapActions } from 'vuex'
import store from '@/store'
import { CLIENT_TOKEN , USER_LANGUAGE , LOGIN_INFO } from '@/store/const-type'
import { login } from '@/store/modules/user'
import { base64encode } from '@/utils/base-64'


export default {
  name: 'Login',
  components: { SocialSign, LangSelect },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('Please enter the correct user name'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 6) {
        callback(new Error('The password can not be less than 6 digits'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        loginName: '',
        password: '',
        verificationCode: ''
      },
      loginRules: {
        loginName: [{ required: true, trigger: 'blur', validator: validateUsername }],
        password: [{ required: true, trigger: 'blur', validator: validatePassword }],
        verificationCode: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {},
      timer : false,
      showTimer: false,
      timerCount:60,
      text : "获取验证码",
      counter: '',
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  created() {
    this.init ()
    // window.addEventListener('storage', this.afterQRScan)
  },
  mounted() {
    if (this.loginForm.username === '') {
      this.$refs.username.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  destroyed() {
    // window.removeEventListener('storage', this.afterQRScan)
  },
  methods: {
    checkCapslock(e) {
      const { key } = e
      this.capsTooltip = key && key.length === 1 && (key >= 'A' && key <= 'Z')
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    init () {
      window.sessionStorage.clear()
      //重置标签tagsList
      store.state.tagsView.visitedViews = []
    },
    // ...mapActions(['login']),
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.loginForm.password = base64encode(this.loginForm.password)
          this.$store.dispatch('user/login', this.loginForm).then( () => {
            this.$router.push( '/home' )
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = query[cur]
        }
        return acc
      }, {})
    },
    // afterQRScan() {
    //   if (e.key === 'x-admin-oauth-code') {
    //     const code = getQueryObject(e.newValue)
    //     const codeMap = {
    //       wechat: 'code',
    //       tencent: 'code'
    //     }
    //     const type = codeMap[this.auth_type]
    //     const codeName = code[type]
    //     if (codeName) {
    //       this.$store.dispatch('LoginByThirdparty', codeName).then(() => {
    //         this.$router.push({ path: this.redirect || '/' })
    //       })
    //     } else {
    //       alert('第三方登录失败')
    //     }
    //   }
    // }

    getCode () {
            this.showTimer = true;
            this.timer = true;
            this.text = "秒后重新获取";
            this.counter = setInterval(function() {
                this.timerCount -- ;
            }, 1000);
            setTimeout(function() {
                this.text = "重新获取验证码";
                this.timer = false;
                // setInterval.cancel(counter);
                this.showTimer = false;
                this.timerCount = 60;
            }, 60000);
            // 调获取验证码接口
            let date=new Date();
            //年
            let year=date.getFullYear();
            //月
            let month=date.getMonth()+1;
            let month1= month -3
            //日
            let day=date.getDate();
            let time = year+'-'+month1+'-'+day
            this.post("/beta/betaService/COS.IQ.01.0001",{},(res) => {
              if (res.returnCode == "000000") {
                  console.log(res)
                  this.$notify({
                      message: res.returnData.verificationCode,
                      type: "success",
                  });
                  this.loginForm.verificationCode = res.returnData.verificationCode
              }
            });
    },
  },
  beforeDestroy() {
    clearInterval(this.counter);
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#fff;
$cursor: #fff;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  background-image: url(../../assets/image/bg.jpg);
  background-size: cover;
  background-repeat: no-repeat;

  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $bg inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;

.login-container {
  min-height: 100%;
  width: 100%;
  background-color: $bg;
  overflow: hidden;

  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    // padding: 160px 35px 0;
    // margin: 0 auto;
    overflow: hidden;

    margin: 140px auto 0 auto;
    padding: 25px;
    background: rgba($color: #000000, $alpha: .7) ;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    display: flex;
    justify-content: center;
    padding-bottom: 20px;
    // .title {
    //   font-size: 26px;
    //   color: $light_gray;
    //   margin: 0px auto 40px auto;
    //   text-align: center;
    //   font-weight: bold;
    // }

    img {
      width: auto;
      height: 50px;
    }
    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>

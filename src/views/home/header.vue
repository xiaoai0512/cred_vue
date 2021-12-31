<template>
  <header class="headerDiv">
    <div class="logoDiv">
      <img  src="../../assets/image/logo.png"/>
      <div class="environ">
      {{environStr}}
      </div>
    </div>
    <ul class="userDiv">
      <li class="backHome" @click="backHome">
        <i class="el-icon-s-home"></i>
        {{ $t('vheader.home') }}
      </li>
      <li>
        <i class="el-icon-user-solid"></i>
        {{userName}}
      </li>
      <li @click="dialogFormVisible = true">
        <i class="el-icon-s-tools"></i>
        {{$t('vheader.uppasd')}}
      </li>
      <!-- <li>
          <div slot="header" class="clearfix">
                  <svg-icon icon-class="international" />
                  <span style="margin-left:10px;">{{ $t('i18nView.title') }}</span>
                </div>
        <div>
          <el-radio-group v-model="lang" size="small">
            <el-radio label="cn" border>
              简体中文
            </el-radio>
            <el-radio label="en" border>
              English
            </el-radio>
            <el-radio label="es" border>
              Español
            </el-radio>
            <el-radio label="ja" border>
              日本語
            </el-radio>
          </el-radio-group>
          <el-tag style="margin-top:15px;display:block;" type="info">
            {{ $t('i18nView.note') }}
          </el-tag>
        </div>
      </li> -->
      <li>
        <lang-select class="right-menu-item hover-effect" />
      </li>
      <li>
        <span style="margin-right: 5px;">{{$t('vheader.curtime')}}:</span>
        <span>{{currentdate}}</span>
      </li>
      <li @click="outLogin" >
        <i class="el-icon-switch-button"></i>
        {{$t('vheader.exit')}}
      </li>
    </ul>
    <!-- 修改密码 -->
    <el-dialog title="修改密码" :visible.sync="dialogFormVisible" :close-on-click-modal="false" >
      <el-form :model="passform" :rules="passrules" ref="passform" >
        <el-form-item label="用户名" >
          <el-input v-model="passform.loginName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="passform.password" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="passwordConfirm">
          <el-input v-model="passform.passwordConfirm" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
     <div slot="footer" class="dialog-footer">
        <el-button @click ="cancel('passform')">取 消</el-button>
        <el-button type="primary" @click="sure('passform')">确 定</el-button>
      </div>
   </el-dialog>
  </header>
</template>

<script>
  import ApiService from '@/api/api-service'
  import store from '@/store'
  import { getLang , removeLang , getBrowserLang } from '@/utils/auth'
  import { DEFAULT_LANG } from '@/store/const-type'
  import LangSelect from '@/components/LangSelect'
  export default {
    components: {
        LangSelect
    },
    name: 'Vheader',
    data () {
      let isRight = (rule, value, callback) => {
        let pasVal = this.loginData.password
        if(pasVal != value){
          // callback(new Error(i18n.t('header.passwordNoRight')));//密码不正确，请重新输入
          if (!value) {
             callback(new Error('请输入密码'));//请输入密码
          } else {
            callback(new Error('密码不正确，请重新输入'));//密码不正确，请重新输入
          }
        }
        else{
      		callback();
      	}
      };

      let validatePass = (rule, value, callback) => {
      	let pasVal = this.loginData.password
        let reg =  /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;//至少八个字符，至少一个字母和一个数字
        let _this = this;
        if(value == ""){
          // callback(new Error(i18n.t('header.enterNew')));
          callback(new Error('密码不能为空'));
        }
        if (pasVal == value) {
      		// callback(new Error(i18n.t('header.noSame')));//新密码不能与原密码相同！
         callback(new Error('新密码不能与原密码相同！'));//新密码不能与原密码相同！
      	}
        if(!reg.test(value)) {
          // callback(new Error(i18n.t('header.passwordPatterMessage')));
          callback(new Error('密码至少八个字符，至少一个字母和一个数字'));
      	} else {
           callback();
        }
      };
      return {
        imgSrc: '../../assets/image/logo.png',
        environStr : '',
        currentdate: '',
        userName: '',
        loginData: store.getters.logininfo,
        dialogFormVisible: false,
        // dialogVisible: false
        passform: {
          loginName: '',
          password: '',
          passwordConfirm: ''
        },
        options : [],
        userLanguage : store.getters.language,
        passrules: {
          name: [
            // { required: true, message: '请输入活动名称', trigger: 'blur' },
            { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, validator: isRight , trigger: 'blur' }
          ],
          passwordConfirm: [
            {required: true, validator: validatePass , trigger: 'blur' }
          ]
        },
        formLabelWidth:'120px',
        timer: '',
      }
    },
    computed: {
       lang: {
        get() {
          return this.$store.state.app.language
        },
        set(lang) {
          this.$i18n.locale = lang
          this.$store.dispatch('app/setLanguage', lang)
        }
      }
    },
    watch: {
      lang() {
        this.getCurEnviro()
      }
    },
    created () {
      this.$i18n.locale = window.sessionStorage.getItem('language')
    },
    mounted () {
      // this.initLegalPersonNum(); //初始化选择项
      this.getCurEnviro()
      this.getUserInfo()
      this.timer = setInterval( () => {//获取当前时间
        let date = new Date();
        let sign1 = "-"
        let sign2 = ":"
        let year = date.getFullYear()
        let month = date.getMonth() + 1
        let day  = date.getDate()
        let hour = date.getHours()
        let minutes = date.getMinutes()
        let seconds = date.getSeconds()
         if (month >= 1 && month <= 9) {
          month = "0" + month;
         }
         if (day >= 0 && day <= 9) {
          day = "0" + day;
         }
         if (hour >= 0 && hour <= 9) {
          hour = "0" + hour;
         }
         if (minutes >= 0 && minutes <= 9) {
          minutes = "0" + minutes;
         }
         if (seconds >= 0 && seconds <= 9) {
          seconds = "0" + seconds;
         }
        this.currentdate = year + sign1 + month + sign1 + day + " " + hour + sign2 + minutes + sign2 + seconds;
      },300)
    },
    methods : {
      setOptions() {
            this.options = [
              {
                value: '1',
                label: this.$t('i18nView.one')
              },
              {
                value: '2',
                label: this.$t('i18nView.two')
              },
              {
                value: '3',
                label: this.$t('i18nView.three')
              }
            ]
          },
      getCurEnviro () {//获取当前环境
      console.log(this.$i18n.locale)
        let environAdress = window.location.hostname
        if (environAdress == '10.6.90.182') {
          this.environStr = i18n.t('vheader.environment_dev')
        }else if (environAdress == '10.6.70.168') {
          this.environStr = i18n.t('vheader.environment_sit')
        }else if (environAdress == '10.6.70.117') {
          this.environStr = i18n.t('vheader.environment_pro')
        }else {
          this.environStr = this.$t('vheader.environment_local')
        }
      },
      backHome () {
        this.$router.push({path:'/home'})
      },
      getUserInfo () {
        this.userName = this.loginData.loginName
        this.passform.loginName = this.loginData.loginName
      },
      //退出
      outLogin () {
        sessionStorage.clear()
      	this.$router.push('/login')
        this.$i18n.locale =  DEFAULT_LANG
        this.$store.dispatch('app/setLanguage',  DEFAULT_LANG)
      },
      // 修改密码确认
      sure(formName) {
      	let self = this
      	self.$refs[formName].validate((valid) => {
      		if (valid) {
            ApiService.post('/beta/betaService/COS.CS.01.0020', self.passform, (res) => {
                self.dialogFormVisible = false
                this.$session.getObj('logininfo').password = self.passform.passwordConfirm
                this.$message({
                  message: i18n.t('vheader.modify_passWord_success'),
                  type: 'success'
                });
                sessionStorage.clear()
                setTimeout(function(){
                  self.$router.push( '/login')
                },1500)
      					if (self.$refs['passform']!==undefined) {
      						self.$refs['passform'].resetFields();
      					}
      			});
      		} else {
      			return false;
      		}
      	});
      },
      // 修改密码取消
      cancel(formName) {
      	this.dialogFormVisible = false
      	if (this.$refs[formName]!==undefined) {
      		this.$refs[formName].resetFields();
      	}
      	this.errmsg = ''
      },
    },
    beforeDestroy() {
        clearInterval(this.timer);
    },
  }
</script>

<style>
  .headerDiv {
    /* width: 100%; */
    height: 65px;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0 10px;
  }
  .logoDiv {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    width: 40%;
  }
  .logoDiv img {
    width: 50%;
    height: 60px;
  }
  .logoDiv .environ {
    width: 40%;
    height: 60px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    font-size: 24px;
    color: #fff;
  }
  .userDiv {
    width: 70%;
    height: 60px;
    display:flex;
    justify-content: flex-end;
    margin: 0;
  }
  .userDiv li {
    /* width: 20%; */
    height: 60px;
    margin-left: 10px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    color: #fff;
    cursor: pointer;
  }
  .userDiv li i {
    padding-right: 5px;
    cursor: pointer;
  }
  .el-dropdown{
      color: #fff;
  }
</style>

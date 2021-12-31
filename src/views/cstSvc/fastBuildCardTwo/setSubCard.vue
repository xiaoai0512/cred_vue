<!-- 设置附属卡 -->
<template>
    <div class="allContent">
        <div class="text_title">1.客户基本信息建立</div>
        <el-form ref="cstBaseInfoRef" :rules="cstBaseRules" :model="cstBaseInfoForm">
          <el-form-item
            class="cl_td"
            label="机构号"
            prop="institutionId"
            :rules="[ { required: true, message: '请输入机构号', trigger: 'change' } ]"
          >
            <el-select clearable  v-model="cstBaseInfoForm.institutionId" class="wd200">
              <el-option
                v-for="(item, index) in institutionIdOptions"
                :key="index"
                :label="item.organName"
                :value="item.organNo"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            class="cl_td"
            label="客户名称"
            prop="customerName"
            :rules="[ { required: true, message: '请输入客户名称', trigger: 'blur' } ]"
          >
            <el-input v-model="cstBaseInfoForm.customerName" class="wd200" type="text" />
          </el-form-item>
          <el-form-item
            class="cl_td"
            label="证件类型"
            prop="idType"
            :rules="[ { required: true, message: '请输入证件类型', trigger: 'blur' } ]"
          >
            <el-select clearable  v-model="cstBaseInfoForm.idType" class="wd200" disabled>
              <el-option
                v-for="(item, index) in idTypeOptions"
                :key="index"
                :label="item.detailDesc"
                :value="item.codes"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            class="cl_td"
            label="证件号码"
            prop="idNumber"
            :rules="[ { required: true, message: '请输入证件号码', trigger: 'blur' } ]"
          >
            <el-input v-model="cstBaseInfoForm.idNumber" class="wd200" type="text" readonly/>
          </el-form-item>
          <el-form-item
            class="cl_td"
            label="客户类型"
            prop="customerType"
            :rules="[ { required: true, message: '请输入客户类型', trigger: 'change' } ]"
          >
            <el-select clearable  v-model="cstBaseInfoForm.customerType" class="wd200">
              <el-option
                v-for="(item, index) in customerTypeOptions"
                :key="index"
                :label="item.detailDesc"
                :value="item.codes"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            class="cl_td"
            label="账单日"
            prop="billDay"
            :rules="[ { required: true, message: '请输入账单日', trigger: 'change' } ]"
          >
            <el-select clearable  v-model="cstBaseInfoForm.billDay" class="wd200">
              <el-option
                v-for="(item, index) in billDayOptions"
                :key="index"
                :label="item.detailDesc"
                :value="item.codes"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            class="cl_td"
            label="还款选项"
            prop="paymentMark"
            :rules="[ { required: true, message: '请输入还款选项', trigger: 'change' } ]"
          >
            <el-select clearable  v-model="cstBaseInfoForm.paymentMark" class="wd200">
              <el-option
                v-for="(item, index) in paymentMarkOptions"
                :key="index"
                :label="item.detailDesc"
                :value="item.codes"
              />
            </el-select>
          </el-form-item>
          <el-form-item class="cl_td" label="城市" prop="city">
            <el-input v-model="cstBaseInfoForm.city" class="wd200" type="text" />
          </el-form-item>
          <el-form-item v-show="showHKno" class="red cl_td" label="港澳台居民居住证" prop="idNumberHmt">
              <el-input v-model="cstBaseInfoForm.idNumberHmt" class="wd200" type="text" />
          </el-form-item>
  
          <div class="text_title">2.客户个人信息</div>
          <el-form-item class="cl_td" label="分行号 " prop="branchNumber">
            <el-input v-model="cstBaseInfoForm.branchNumber" class="wd200" type="text" />
          </el-form-item>
          <el-form-item class="cl_td" label="生日 " prop="dateOfBirth">
            <el-date-picker
              v-model="cstBaseInfoForm.dateOfBirth"
              class="wd200"
              type="date"
              placeholder="选择日期"
              format="yyyy 年 MM 月 dd 日"
              value-format="yyyyMMdd"
            />
          </el-form-item>
  
          <el-form-item class="cl_td" label="性别 " prop="sexCode">
            <el-select clearable  v-model="cstBaseInfoForm.sexCode" class="wd200">
              <el-option
                v-for="(item, index) in sexCodeOptions"
                :key="index"
                :label="item.detailDesc"
                :value="item.codes"
              />
            </el-select>
          </el-form-item>
          <el-form-item class="cl_td" label="手机号码 " prop="mobilePhone">
            <el-input v-model="cstBaseInfoForm.mobilePhone" class="wd200" type="text" />
          </el-form-item>
          <el-form-item class="cl_td" label="家庭电话 " prop="homePhone">
            <el-input v-model="cstBaseInfoForm.homePhone" class="wd200" type="text" />
          </el-form-item>
          <el-form-item class="cl_td" label="公司电话 " prop="companyPhone">
            <el-input v-model="cstBaseInfoForm.companyPhone" class="wd200" type="text" />
          </el-form-item>
          <el-form-item class="cl_td" label="邮编 " prop="zipCode">
            <el-input v-model="cstBaseInfoForm.zipCode" class="wd200" type="text" />
          </el-form-item>
          <el-form-item class="cl_td" label="联络人姓名 " prop="contactName">
            <el-input v-model="cstBaseInfoForm.contactName" class="wd200" type="text" />
          </el-form-item>
          <el-form-item class="cl_td" label="联络人电话 " prop="contactPhone">
            <el-input v-model="cstBaseInfoForm.contactPhone" class="wd200" type="text" />
          </el-form-item>
          <el-form-item class="cl_td" label="成为会员年份 " prop="branchNumber">
            <el-date-picker
              v-model="cstBaseInfoForm.memberSince"
              class="wd200"
              type="date"
              placeholder="选择会员年份"
              format="yyyy 年 MM 月"
              value-format="yyyyMM"
            />
          </el-form-item>
          <el-form-item class="cl_td" label="客户来源码" prop="customerSource">
            <el-input v-model="cstBaseInfoForm.customerSource" class="wd200" type="text" />
          </el-form-item>
          <el-form-item class="cl_td" label="行为得分" prop="behaviorScore">
            <el-input v-model="cstBaseInfoForm.behaviorScore" class="wd200" type="text" />
          </el-form-item>
          <el-form-item class="cl_td" label="客户等级" prop="customerLevel">
            <el-input v-model="cstBaseInfoForm.customerLevel" class="wd200" type="text" />
          </el-form-item>
          <el-form-item class="cl_td" label="年收入 " prop="annualIncome">
            <el-input v-model="cstBaseInfoForm.annualIncome" class="wd200" type="text" />
          </el-form-item>
          <el-form-item class="cl_td" label="住宅性质 " prop="residencyStatus">
            <el-select clearable  v-model="cstBaseInfoForm.residencyStatus" class="wd200">
              <el-option
                v-for="(item, index) in residencyStatusOptions"
                :key="index"
                :label="item.detailDesc"
                :value="item.codes"
              />
            </el-select>
          </el-form-item>
          <el-form-item class="cl_td" label="婚姻状况 " prop="maritalStatus">
            <el-select clearable  v-model="cstBaseInfoForm.maritalStatus" class="wd200">
              <el-option
                v-for="(item, index) in maritalStatusOptions"
                :key="index"
                :label="item.detailDesc"
                :value="item.codes"
              />
            </el-select>
          </el-form-item>
          <el-form-item class="cl_td" label="工作行业代码" prop="occupationCode">
            <el-input v-model="cstBaseInfoForm.occupationCode" class="wd200" type="text" />
          </el-form-item>
          <el-form-item class="cl_td" label="职务级别代码" prop="postRankCode">
            <el-select clearable  v-model="cstBaseInfoForm.postRankCode" class="wd200">
              <el-option
                v-for="(item, index) in postRankCodeOptions"
                :key="index"
                :label="item.detailDesc"
                :value="item.codes"
              />
            </el-select>
          </el-form-item>
          <el-form-item class="cl_td" label="职称代码" prop="titleCode">
            <el-input v-model="cstBaseInfoForm.titleCode" class="wd200" type="text" />
          </el-form-item>
          <el-form-item class="cl_td" label="工作年限" prop="periodOfOccupation">
            <el-input v-model="cstBaseInfoForm.periodOfOccupation" class="wd200" type="text" />
          </el-form-item>
          <el-form-item class="cl_td" label="兴趣爱好" prop="hobby">
            <el-input v-model="cstBaseInfoForm.hobby" class="wd200" type="text" />
          </el-form-item>
          <el-form-item class="cl_td" label="担保人标识" prop="guarantorFlag">
            <el-select clearable  v-model="cstBaseInfoForm.guarantorFlag" class="wd200">
              <el-option
                v-for="(item, index) in guarantorFlagOptions"
                :key="index"
                :label="item.detailDesc"
                :value="item.codes"
              />
            </el-select>
          </el-form-item>
          <el-form-item class="cl_td" label="营销员代码" prop="marketerCode">
            <el-input v-model="cstBaseInfoForm.marketerCode" class="wd200" type="text" />
          </el-form-item>
          <el-form-item class="cl_td" label="持卡人的社会保障号类型" prop="socialSecurityId">
            <el-input v-model="cstBaseInfoForm.socialSecurityId" class="wd200" type="text" />
          </el-form-item>
          <el-form-item class="cl_td" label="社保账号" prop="socialSecurityNumber">
            <el-input v-model="cstBaseInfoForm.socialSecurityNumber" class="wd200" type="text" />
          </el-form-item>
        </el-form>
  
        <div class="text_title">3.客户地址信息</div>
        <div class="cl_tr text_left">
          <el-button size="small" icon="el-icon-plus" type="primary" @click="addAdress()">新增</el-button>
        </div>
        <el-table
          :data="addressObjList"
          class="mbtm20"
          fit
          highlight-current-row
          style="width: 100%"
          border
        >
          <el-table-column prop="typeDesc" label="地址类型" align="center" />
          <el-table-column prop="contactAddress" label="联系地址" align="center" />
          <el-table-column prop="contactPostCode" label="联系邮编" align="center" />
          <el-table-column prop="contactMobilePhone" label="指定电话" align="center" />
          <el-table-column prop="city" label="所在城市" align="center" />
        </el-table>
        <el-form ref="addressForm" :rule="addressForm" :model="addressForm">
          <div v-show="addressFormDiv">
            <el-form-item
              class="cl_td"
              label="地址类型"
              prop="type"
              :rules="[ { required: true, message: '请输入地址类型', trigger: 'change' } ]"
            >
              <el-select clearable  v-model="addressForm.type" class="wd200">
                <el-option
                  v-for="(item, index) in addressTypeOptions"
                  :key="index"
                  :label="item.detailDesc"
                  :value="item.codes"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              class="cl_td"
              label="联系地址"
              prop="contactAddress"
              :rules="[ { required: true, message: '请输入联系地址', trigger: 'blur' } ]"
            >
              <el-input v-model="addressForm.contactAddress" class="wd200" type="text" />
            </el-form-item>
            <el-form-item
              class="cl_td"
              label="联系邮编"
              prop="contactPostCode"
              :rules="[ { required: true, message: '请输入联系邮编', trigger: 'blur' } ]"
            >
              <el-input v-model="addressForm.contactPostCode" class="wd200" type="text" />
            </el-form-item>
            <el-form-item
              class="cl_td"
              label="指定电话"
              prop="contactMobilePhone"
              :rules="[ { required: true, message: '请输入指定电话', trigger: 'blur' } ]"
            >
              <el-input v-model="addressForm.contactMobilePhone" class="wd200" type="text" />
            </el-form-item>
            <el-form-item
              class="cl_td"
              label="所在城市"
              prop="city"
              :rules="[ { required: true, message: '请输入所在城市', trigger: 'blur' } ]"
            >
              <el-input v-model="addressForm.city" class="wd200" type="text" />
            </el-form-item>
            <div class="cl_tr text_center">
              <el-button
                size="small"
                icon="el-icon-circle-check"
                type="primary"
                @click="saveAddress('addressForm')"
              >保存</el-button>
              <el-button
                size="small"
                icon="el-icon-circle-close"
                type="primary"
                @click="closeAddress()"
              >关闭</el-button>
            </div>
          </div>
        </el-form>
        <div class="text_title">4.客户备注信息</div>
        <div class="cl_tr text_left">
          <el-button size="small" icon="el-icon-plus" type="primary" @click="addRemark()">新增</el-button>
        </div>
        <el-table 
          :data="remarkObjList"
          class="mbtm20"
          fit
          highlight-current-row
          style="width: 100%"
          border
        >
          <el-table-column prop="remarkInfo" label="备注信息" align="center" />
          <el-table-column prop="lastUpdateUserid" label="新增备注人员" align="center" />
        </el-table>
        <el-form ref="remarkForm" :rule="remarkForm" :model="remarkForm">
          <div v-show="remarkFormDiv">
            <el-form-item class="cl_td" label="备注信息" prop="remarkInfo">
              <el-input v-model="remarkForm.remarkInfo" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="新增备注人员" prop="lastUpdateUserid">
              <el-input v-model="remarkForm.lastUpdateUserid" class="wd200" type="text" />
            </el-form-item>
            <div class="cl_tr text_center">
              <el-button
                size="small"
                icon="el-icon-circle-check"
                type="primary"
                @click="saveRemark()"
              >保存</el-button>
              <el-button
                size="small"
                icon="el-icon-circle-close"
                type="primary"
                @click="closeRemark()"
              >关闭</el-button>
            </div>
          </div>
        </el-form>
        <div class="cl_tr text_center">
          <el-button icon="el-icon-check" size="medium" type="primary" @click="submitBtn('cstBaseInfoRef')">
            提交
          </el-button>
        </div>
        
  
    </div>
</template>
  
<script>
import { validPhone, isIdentityId, isIdentityIdTest, isHKCard, isTWCard, passport, isPermanentReside } from "@/utils/validate";

  export default {
    name: "SetSubCard",
    components: {
    },
    data() {
        // 验证手机号
        const checkPhone = (rule, value, callback) => {
            if (!value) {
            return callback(new Error("手机号不能为空"))
            } else if (!validPhone(value)) {
            return callback(new Error("请输入正确格式"))
            } else {
            callback()
            }
        }
  
  
        return {
            longinInfoObj : {},
            systemEnvironmentFlag: '', // 当前环境 TEST / PROD
            tooltipText: '请输入证件号码', // 证件号码提示语
            idTypeOptions: [], // 身份证类型
            institutionIdOptions: [], // 机构号
            customerTypeOptions: [], // 客户类型
            billDayOptions: [], // 账单日
            paymentMarkOptions: [], // 还款选项
            sexCodeOptions: [], // 性别
            residencyStatusOptions: [], // 住宅性质
            maritalStatusOptions: [], // 婚姻状况
            postRankCodeOptions: [], // 职务级别代码
            guarantorFlagOptions: [], // 担保人标识
            addressTypeOptions: [], // 地址类型
            directDebitStatusOptions: [],
            directDebitModeOptions: [],
            exchangePaymentFlagOptions: [],
            isSetPriceOptions: [],
            pricingObjectOptions: [],
            segmentNumberOptions: [],
    
            mainSupplyIndicatorOptions: [],
            mediaObjectCodeOptions: [],
            mediaDispatchMethodOptions: [],
            pinDispatchMethodOptions: [],
            requestCardMakingOptions: [],
            formatCodeOptions: [], //

            addressForm: {}, // 客户地址obj
            addressObjList: [], // 客户地址List
            remarkForm: {}, // 客户备注obj
            remarkObjList: [], // 客户备注List

            cstBaseInfoForm: {},
            cstBaseInfoRef: {},
            cstBaseRules: {
                mobilePhone: [
                    { required: true, validator: checkPhone, trigger: "blur" },
                ]
            },
            showHKno: false, // 港澳台居民居住证
            addressFormDiv: true,
            remarkFormDiv: false,
            
            
          
      };
    },
    created() {
        let subCardId = JSON.parse(window.sessionStorage.getItem('SUBCARDID'))
        console.log(subCardId)
        this.cstBaseInfoForm.idType = subCardId.idType
        this.cstBaseInfoForm.idNumber = subCardId.idNumber

    },
    mounted() {
      // 证件类型
      this.getSelectDict("dic_certificateType").then((res) => {
        this.idTypeOptions = res
      })
      // 客户类型
      this.getSelectDict("dic_personalCompanyType").then((res) => {
        this.customerTypeOptions = res
      })
      // 账单日
      this.getSelectDict("dic_billDay").then((res) => {
        this.billDayOptions = res
      })
      // 还款选项
      this.getSelectDict("dic_paymentMark").then((res) => {
        this.paymentMarkOptions = res
      })
      // 机构号
      this.getSelectDict("/beta/betaService/COS.IQ.02.0005", {}).then((res) => {
          this.institutionIdOptions = res
      })
      // 性别
      this.getSelectDict("dic_gender").then((res) => {
        this.sexCodeOptions = res
      })
      // 住宅性质
      this.getSelectDict("dic_residencyStatus").then((res) => {
        this.residencyStatusOptions = res
      })
      // 婚姻状况
      this.getSelectDict("dic_maritalStatus").then((res) => {
        this.maritalStatusOptions = res
      })
      // 职务级别代码
      this.getSelectDict("dic_postRankCode").then((res) => {
        this.postRankCodeOptions = res
      })
      // 担保人标识
      this.getSelectDict("dic_guarantorFlag").then((res) => {
        this.guarantorFlagOptions = res
      })
      // 地址类型
      this.getSelectDict("dic_addressType").then((res) => {
        this.addressTypeOptions = res
      })
      this.getCorEntityNo() // 查询法人实体
    },
    methods: {
        // 查询法人实体
        getCorEntityNo () {
          let logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))
          this.systemEnvironmentFlag = logininfo.systemEnvironmentFlag
          let params = {
              organNo : logininfo.organization
          }
          this.post('/beta/betaService/COS.IQ.02.0005', params, (res) => {
              if (res.returnCode == '000000') {
                  this.longinInfoObj.corporationEntityNo = res.returnData.rows[0].corporationEntityNo
              }
          })
        },

        // 地址 新增
        addAdress() {
            this.addressFormDiv = true
        },
        // 地址 保存
        saveAddress(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                this.addressTypeOptions.forEach((item, i) => {
                    if (this.addressForm.type == item.codes) {
                    this.addressForm.typeDesc = item.detailDesc
                    }
                })
                this.addressObjList.push(this.addressForm);
                this.addressFormDiv = false; // 客户地址信息
                this.addressForm = {}
                // this.$refs[ formName ].resetFields()
                } else {
                return false;
                }
            });
        },
        // 地址 关闭
        closeAddress() {
            this.addressFormDiv = false // 客户地址信息
        },

        // 备注信息 新增
        addRemark() {
            this.remarkFormDiv = true
        },
        // 备注信息 保存
        saveRemark() {
            if (!this.remarkForm.remarkInfo && !this.remarkForm.lastUpdateUserid) {
                this.$message({
                    message: "请输入备注信息",
                    type: "warning",
                });
            } else {
                this.remarkObjList.push(this.remarkForm)
                this.remarkFormDiv = false; // 客户地址信息
                this.remarkForm = {}
            }
        },
        // 备注信息 关闭
        closeRemark() {
            this.addressFormDiv = false // 客户地址信息
        },

        // 提交
        submitBtn(formName) {
            this.$refs[formName].validate((valid) => {
                if (!valid) {
                return false
                }
                // 判断是否有地址信息
                if (this.addressObjList.lengh == 0) {
                    this.$message({
                        message: "请填写地址信息",
                        type: "warning",
                    })
                    return
                }
                // 验证港澳通行证信息
                if (this.cstBaseInfoForm.idType == 2 || this.cstBaseInfoForm.idType == 3) {
                    if (!this.cstBaseInfoForm.idNumberHmt) {
                        this.$message({
                            message: "请填写港澳台居民居住证",
                            type: "warning",
                        })
                        return
                    }
                }
                let params = {
                    coreCoreCustomerAddrs: this.addressObjList,
                    coreCustomerRemarkss: this.remarkObjList,
                }
                params = Object.assign(params, this.cstBaseInfoForm)
                // 下一步
                this.post('/nonfi/nonfinanceService/BSS.AD.01.0001', params, (res) => {
                    if (res.returnCode == '000000') { // 有产品 新建产品或者卡片
                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                            // 用户基本信息 
                            this.cstInfoObj = res.returnData.rows[0]
                            window.sessionStorage.setItem('subCardFlag', '1')
                            window.sessionStorage.setItem('subCustomerNo', res.returnData.rows[0].customerNo)
                            this.$router.push({ path: '/cstSvc/fastBuildCardTwo' })
                            
                            // 初始化
                            this.cstBaseInfoForm = {}
                            this.addressObjList = [] // 地址信息
                            this.remarkObjList = [] // 标签新
                            
                            
                        }
                    } else {
                        
                    }
                })
            })
        },
    }  
  }
  </script>
  
  <style>
  </style>
  
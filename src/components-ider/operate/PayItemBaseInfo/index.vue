<!-- 收费基本信息组件 -->
<template>
    <div class="" >
        <el-form ref="formRef" :model="formObj" :rules="formRules">
            <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
            :rules="[ { required: true, message: '运营模式不能为空'} ]">
                <el-select v-model="formObj.operationMode" class="wd200" clearable >
                    <el-option
                    v-for="(item, index ) in operationModeOptions"
                    :key="index"
                    :label="item.modeName"
                    :value="item.operationMode"
                    />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="收费项目" prop="feeItemNo"
            :rules="[ { required: true, message: '收费项目代码不能为空'}]">
                 <el-input v-model="formObj.feeItemNo" class="wd200" type="text" />
            </el-form-item>

            <el-form-item class="cl_td red" label="维度取值1" prop="instanDimen1" v-if="showInstanDimen">
                <el-select v-model="formObj.instanDimen1" class="wd200" clearable  disabled>
                    <el-option
                    v-for="(item, index ) in instanceDimenOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.codes"
                    />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="实例代码1" prop="instanCode1">
                <el-input v-model="formObj.instanCode1" class="wd200" type="text" :readonly="isReadonly"/>
                 <div class="search_button" v-if="showChoseBtn">
                    <el-button size="small" icon="el-icon-search" type="primary" @click="choseInstanCodeBtn(1)" :disabled="choseBtnFlag1">
                        选择
                    </el-button>
                </div>
            </el-form-item>
            <el-form-item class="cl_td red" label="维度取值2" prop="instanDimen2" v-if="showInstanDimen">
                <el-select v-model="formObj.instanDimen2" class="wd200" clearable  disabled>
                    <el-option
                    v-for="(item, index ) in instanceDimenOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.codes"
                    />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="实例代码2" prop="instanCode2">
                <el-input v-model="formObj.instanCode2" class="wd200" type="text" :readonly="isReadonly"/>
                 <div class="search_button" v-if="showChoseBtn">
                    <el-button size="small" icon="el-icon-search" type="primary" @click="choseInstanCodeBtn(2)" :disabled="choseBtnFlag2">
                        选择
                    </el-button>
                </div>
            </el-form-item>
            
            <el-form-item class="cl_td red" label="维度取值3" prop="instanDimen3" v-if="showInstanDimen">
                <el-select v-model="formObj.instanDimen3" class="wd200" clearable disabled>
                    <el-option
                    v-for="(item, index ) in instanceDimenOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.codes"
                    />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="实例代码3" prop="instanCode3">
                <el-input v-model="formObj.instanCode3" class="wd200" type="text" :readonly="isReadonly"/>
                 <div class="search_button" v-if="showChoseBtn">
                    <el-button size="small" icon="el-icon-search" type="primary" @click="choseInstanCodeBtn(3)" :disabled="choseBtnFlag3">
                        选择
                    </el-button>
                </div>
            </el-form-item>
            <el-form-item class="cl_td red" label="维度取值4" prop="instanDimen4" v-if="showInstanDimen">
                <el-select v-model="formObj.instanDimen4" class="wd200" clearable disabled>
                    <el-option
                    v-for="(item, index ) in instanceDimenOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.codes"
                    />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="实例代码4" prop="instanCode4">
                <el-input v-model="formObj.instanCode4" class="wd200" type="text" :readonly="isReadonly"/>
                 <div class="search_button" v-if="showChoseBtn">
                    <el-button size="small" icon="el-icon-search" type="primary" @click="choseInstanCodeBtn(4)" :disabled="choseBtnFlag4">
                        选择
                    </el-button>
                </div>
            </el-form-item>
            <el-form-item class="cl_td red" label="维度取值5" prop="instanDimen5" v-if="showInstanDimen">
                <el-select v-model="formObj.instanDimen5" class="wd200" clearable disabled>
                    <el-option
                    v-for="(item, index ) in instanceDimenOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.codes"
                    />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="实例代码5" prop="instanCode5">
                <el-input v-model="formObj.instanCode5" class="wd200" type="text" :readonly="isReadonly"/>
                 <div class="search_button" v-if="showChoseBtn">
                    <el-button size="small" icon="el-icon-search" type="primary" @click="choseInstanCodeBtn(5)" :disabled="choseBtnFlag5">
                        选择
                    </el-button>
                </div>
            </el-form-item>
            <el-form-item class="cl_td" label="计费方式" prop="assessmentMethod">
                <el-select v-model="formObj.assessmentMethod" class="wd200" clearable disabled>
                    <el-option
                    v-for="(item, index ) in assessmentMethodOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.codes"
                    />
                </el-select>
                <!-- <el-input v-model="formObj.assessmentMethod" class="wd200" type="text" /> -->
            </el-form-item>
            <el-form-item class="cl_td"></el-form-item>
            <el-form-item class="cl_td" label="基本费用" prop="baseFee">
                 <el-input v-model="formObj.baseFee" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="附卡基准年费" prop="supplementBaseFee">
                 <el-input v-model="formObj.supplementBaseFee" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="最低收费金额" prop="minFeeAmt">
                 <el-input v-model="formObj.minFeeAmt" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="最高收费金额" prop="maxFeeAmt">
                 <el-input v-model="formObj.maxFeeAmt" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="免除周期" prop="waiveCycle">
                <el-select v-model="formObj.waiveCycle" class="wd200" clearable>
                    <el-option
                    v-for="(item, index ) in waiveCycleOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.codes"
                    />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="免除次数" prop="waiveCount">
                 <el-input v-model="formObj.waiveCount" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="首次费用收取期次" prop="feeStartPeriod">
                 <el-input v-model="formObj.feeStartPeriod" class="wd200" type="text" />
            </el-form-item>

            <el-form-item class="cl_td" label="费用收取方式" prop="feeCollectType">
               
                <el-select v-model="formObj.feeCollectType" class="wd200" clearable disabled>
                    <el-option
                    v-for="(item, index ) in feeCollectTypeOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.codes"
                    />
                </el-select>

           </el-form-item>
        </el-form>
        <!-- 维度实例弹窗 -->
         <el-dialog title="选择实例" :visible.sync="instanDimen_dialogFormVisibl" width="75%" append-to-body :close-on-click-modal="false">
            <search-table
                ref="serchTable"
                :tableLabel="tableLabel"
                :queryObj="queryObj"
                :url="url"
                :params="params"
                @choseCuurRow="handleCuurRow"
                @chooseCurrClick="handleCuurRow"
                :codeStr="codeStr"
            ></search-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelInstanDimenBtn">
                    取消
                </el-button>
                <el-button type="primary" @click="sureIntanData()">
                    确定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>

import SearchTable from "@/components-ider/SearchTable";

export default {
  name: 'PayItemBaseInfo',
  props: {
      // form
    formObj: {
        type: Object,
        default: {} 
    },
    isReadonly: {
        type: Boolean,
        default : true
    },
    showChoseBtn: {
        type: Boolean,
        default : true
    },
    showInstanDimen:{
        type: Boolean,
        default : true
    },
    choseBtnFlag1:{
        type: Boolean,
        default : true
    },
    choseBtnFlag2:{
        type: Boolean,
        default : true
    },
    choseBtnFlag3:{
        type: Boolean,
        default : true
    },
    choseBtnFlag4:{
        type: Boolean,
        default : true
    },
    choseBtnFlag5:{
        type: Boolean,
        default : true
    }

  },
  components: {
      SearchTable
  },
  created() {},
  activated() {},
  mounted() {},
  watch: {
      formObj () {}
  },
  data() {
    return { 
        formRef: {},
        formRules: {},
        instanDimen_dialogFormVisibl: false,

        // 下拉框
        operationModeOptions: [],
        instanceDimenOptions: [],
        assessmentMethodOptions: [],
        waiveCycleOptions: [],
        feeCollectTypeOptions: [{
            detailDesc: '一次性收取',
            codes:'0'
        },{
            detailDesc: '分期收取',
            codes:'1'
        }],
        // 维度组件 
        url: '',
        params: {},
        tableLabel: [],
        queryObj:{},
        codeStr: '',
        currValLabel:'',
        // 选择的当前实例
        instan_currRow: {},
        intan_flag: '',
        intan_type: '',
        code_curChoosedRadio : ''


    }
  },
  created() {
    this.$emit('childByFormObj', this.formObj)
    this.$emit('childByFormRef', this.busProInfoFormRef)
    this.$emit('childByFormRules', this.busProInfoFormRules)
  },
  watch: {
      // 当replaceObj发生变化时，执行
      
  },
  mounted() {
    // 运营模式 
    this.getSelectDict( "/beta/betaService/COS.IQ.02.0006").then(res => {
        this.operationModeOptions = res
    })
    // 维度取值
    this.getSelectDict('dic_instanceDimension').then((res) => {
        this.instanceDimenOptions = res
    })
    // 计费方式
    this.getSelectDict('dic_billingMethod').then((res) => {
        this.assessmentMethodOptions = res
        console.log(res)
    })
    // 免除周期
    this.getSelectDict('dic_waiveCycle').then((res) => {
        this.waiveCycleOptions = res
    })
        
},
  methods: {
    // 表单验证
    submitForm() {
        return this.$refs.formRef.validate()
   },
   choseInstanCodeBtn(index) {
        this.intan_flag = index
        let str = 'instanDimen'+index
        this.intan_type = this.formObj[str]
        this.codeStr = this.intan_type
        this.chosedInstanCode(this.intan_type) 
   },
   chosedInstanCode(code) {
       console.log(code)
       this.queryObj = {}
       if (!this.formObj.operationMode) {
           this.$message({
                message: '请选择运营模式',
                type: 'warning'
            })
            return
       }
       this.instanDimen_dialogFormVisibl = true
       if (code == 'MODT') { // 业务类型
            this.queryObj = {
                label1: '业务类型代码',
                prop1: 'businessTypeCode'
            }
            this.url="/beta/betaService/COS.IQ.02.0020"
            this.params={
                isTrans: true,
                transParams:['dic_businessNature' ],
                transDict : ['businessDebitCreditCode']
            }
            this.tableLabel = [{
                label: '运营模式',
                prop: 'operationMode'
            },{
                label: '业务类型代码',
                prop: 'businessTypeCode'
            },{
                label: '描述',
                prop: 'businessDesc'
            },{
                label: '账户组织形式',
                prop: 'businessForm'
            },{
                label: '业务性质',
                prop: 'businessDebitCreditCodeDesc'
            }]
       } else if (code == 'MODM') { //媒介对象 
    //    COS.IQ.02.0017
            this.queryObj = {
                label1: '媒介对象代码',
                prop1: 'mediaObjectCode'
            }
            this.url="/beta/betaService/COS.IQ.02.0017"
            this.params={
                isTrans: true,
                transParams:['dic_mediaType' ],
                transDict : ['mediaObjectType']
            }
            this.tableLabel = [{
                label: '运营模式',
                prop: 'operationMode'
            },{
                label: '媒介对象代码',
                prop: 'mediaObjectCode'
            },{
                label: '描述',
                prop: 'mediaObjectDesc'
            },{
                label: '媒介类型',
                prop: 'mediaObjectTypeDesc'
            }]
       } else if (code == 'MODP') { // 产品对象
    //    COS.IQ.02.0013
            this.queryObj = {
                label1: '产品对象代码',
                prop1: 'productObjectCode'
            }
            this.url="/beta/betaService/COS.IQ.02.0013"
            this.tableLabel = [{
                label: '运营模式',
                prop: 'operationMode'
            },{
                label: '产品对象代码',
                prop: 'productObjectCode'
            },{
                label: '描述',
                prop: 'productDesc'
            },{
                label: '所属产品线',
                prop: 'productLineCode'
            },{
                label: '发行卡BIN',
                prop: 'binNo'
            },{
                label: '还款优先级',
                prop: 'paymentPriority'
            }]

       } else if (code == 'CURR') { // 币种
    //    COS.IQ.02.0012
            this.queryObj = {
                label1: '货币代码',
                prop1: 'currencyCode'
            }
            this.url="/beta/betaService/COS.IQ.02.0012"
            this.params={
                isTrans: true,
                transParams:['dic_businessNature' ],
                transDict : ['businessDebitCreditCode']
            }
            this.tableLabel = [{
                label: '货币代码',
                prop: 'currencyCode'
            },{
                label: '描述',
                prop: 'currencyDesc'
            },{
                label: '小数位位数',
                prop: 'decimalPosition'
            },{
                label: '货币简称',
                prop: 'referred'
            }]
       } else if (code == 'CHAN') { // 来源目录 
    //    COS.IQ.02.0072
            this.url="/beta/betaService/COS.IQ.02.0072"
            this.params = {
                flag:  'N',
            }
            this.tableLabel = [{
                label: '来源目录',
                prop: 'originList'
            },{
                label: '来源目录描述',
                prop: 'listDesc'
            }]

       }  else if (code == 'TERM') { // 期数 
            this.queryObj = {}
            this.url="/beta/betaService/COS.IQ.02.0020"
            this.params={
                isTrans: true,
                transParams:['dic_businessNature' ],
                transDict : ['businessDebitCreditCode']
            }
            this.tableLabel = [{
                label: '运营模式',
                prop: 'operationMode'
            },{
                label: '业务类型代码',
                prop: 'businessTypeCode'
            },{
                label: '描述',
                prop: 'businessDesc'
            },{
                label: '账户组织形式',
                prop: 'businessForm'
            },{
                label: '业务性质',
                prop: 'businessDebitCreditCodeDesc'
            }]

       } else if (code == 'MODG') { // 业务项目
    //    COS.IQ.02.0018
            this.queryObj = {
                label1: '业务项目代码',
                prop1: 'businessProgramNo',
                label2: '业务项目描述',
                prop2: 'programDesc',
            }
            this.url="/beta/betaService/COS.IQ.02.0018"
            this.params={
                isTrans: true,
                transParams:['dic_businessNature' ],
                transDict : ['businessDebitCreditCode']
            }
            this.tableLabel = [{
                label: '运营模式',
                prop: 'operationMode'
            },{
                label: '业务项目代码',
                prop: 'businessProgramNo'
            },{
                label: '描述',
                prop: 'programDesc'
            },{
                label: '争议业务类型',
                prop: 'disputeBusinessType'
            },{
                label: '费用业务类型',
                prop: 'feeBusinessType'
            },{
                label: '还款优先级',
                prop: 'paymentPriority'
            }]

       }  else if (code == 'INST') { // 分期类型
    //    COS.IQ.02.0175
            this.queryObj = {
                label1: '分期类型码',
                prop1: 'stageTypeCode'
            }
            this.label1 = '分期类型码'
            this.prop1 = 'stageTypeCode'
            this.url="/beta/betaService/COS.IQ.02.0175"
            this.params={
                isTrans: true,
                transParams:['dic_businessNature' ],
                transDict : ['businessDebitCreditCode']
            }
            this.tableLabel = [{
                label: '运营模式',
                prop: 'operationMode'
            },{
                label: '分期类型码',
                prop: 'stageTypeCode'
            },{
                label: '交易识别码',
                prop: 'transIdentificationCode'
            },{
                label: '分期类型描述',
                prop: 'stageTypeDesc'
            }]

       }  else if (code == 'FTYP') { // 费用收取方式
            // COS.IQ.02.0006
            this.url = "#"
            this.tableLabel = [{
                label: '费用收取方式',
                prop: 'feeTpyeDesc'
            },{
                label: '费用收取编号',
                prop: 'feeTpyeCode'
            }]
       }   
   },
   cancelInstanDimenBtn() {
       this.instanDimen_dialogFormVisibl = false
       this.queryObj = {}
   },
   handleCuurRow(val) {
       this.instan_currRow = val
       console.log(this.instan_currRow)
   },
   // 实例弹窗确定
   sureIntanData() {
       let intanStr = 'instanCode'+this.intan_flag
    //    let key = ''
    //    if (this.intan_type == 'MODT') { // 业务类型
    //        key = 'businessTypeCode'
    //    } else if (this.intan_type == 'CHAN') { // 来源目录
    //        key = 'originList'
    //    } else if (this.intan_type == 'CNMD') { // 收取方式
    //        key = ''
    //    } else if (this.intan_type == 'CURR') { // 币种
    //        key = 'currencyCode'
    //    } else if (this.intan_type == 'FTYP') { // 费用收取方式
    //        key = 'feeTpyeCode'
    //    } else if (this.intan_type == 'INST') { // 分期类型
    //        key = 'stageTypeCode'
    //    } else if (this.intan_type == 'MODG') { // 业务项目
    //        key = 'businessProgramNo'
    //    } else if (this.intan_type == 'MODP') { // 产品对象
    //        key = 'productObjectCode'
    //    } else if (this.intan_type == 'TERM') { // 期数
    //        key = ''
    //    } else if (this.intan_type == 'MODM') { // 媒介对象
    //        key = 'mediaObjectCode'
    //    }
        //this.formObj[intanStr] = this.instan_currRow[key]
        this.formObj[intanStr] = this.instan_currRow
        this.params = {}
        this.tableLabel = []
        this.queryObj = {}
        this.codeStr = ''
        this.instanDimen_dialogFormVisibl = false
   },

  }


}
</script>

<style>

</style>

<!-- 业务类型基本信息组件 -->
<template>
    <div class="" >
        <el-form ref="formRef" :model="formObj" :rules="formRules">
            <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
            :rules="[ { required: true, message: '运营模式不能为空'} ]">
                <el-select v-model="formObj.operationMode" class="wd200" clearable :disabled="isDisabled">
                    <el-option
                    v-for="(item, index ) in operationModeOptions"
                    :key="index"
                    :label="item.modeName"
                    :value="item.operationMode"
                    />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="业务类型代码" prop="feeItemNo"
            :rules="[ { required: true, message: '业务类型代码不能为空'}]">
                <span v-show="showCodeStr">MODT</span>
                 <el-input v-model="formObj.feeItemNo" class="wd200" type="text" :readonly="isReadonly"/>
            </el-form-item>

            <el-form-item class="cl_td" label="描述" prop="instanDimen1"
            :rules="[ { required: true, message: '描述不能为空'}]">
               <el-input v-model="tempAdd.programDesc" class="wd200" type="text"  />
            </el-form-item>
            

            <el-form-item class="cl_td" label="业务形态" prop="instanDimen2"
            :rules="[ { required: true, message: '业务形态不能为空'}]">
                <el-select v-model="formObj.instanDimen2" class="wd200" clearable :disabled="isDisabled">
                    <el-option
                    v-for="(item, index ) in instanceDimenOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.codes"
                    />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="业务性质" prop="instanCode2">
                <el-select v-model="formObj.instanDimen2" class="wd200" clearable :disabled="isDisabled">
                    <el-option
                    v-for="(item, index ) in instanceDimenOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.codes"
                    />
                </el-select>
            </el-form-item>
             <el-form-item class="cl_td" label="还款优先级" prop="instanCode3">
                <el-input v-model="formObj.instanCode3" class="wd200" type="text" :readonly="isReadonly"/>
                 <div class="search_button">
                    <el-button size="small" icon="el-icon-search" type="primary" @click="choseInstanCodeBtn(3)" >
                        查询
                    </el-button>
                </div>
            </el-form-item>
            <el-form-item class="cl_td" label="本金余额对象" prop="instanDimen3"
            :rules="[ { required: true, message: '本金余额对象不能为空'}]">
                <el-select v-model="formObj.instanDimen3" class="wd200" clearable :disabled="isDisabled">
                    <el-option
                    v-for="(item, index ) in instanceDimenOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.codes"
                    />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="利息余额对象" prop="instanDimen3"
            :rules="[ { required: true, message: '利息余额对象不能为空'}]">
                <el-select v-model="formObj.instanDimen3" class="wd200" clearable :disabled="isDisabled">
                    <el-option
                    v-for="(item, index ) in instanceDimenOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.codes"
                    />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="费用余额对象" prop="instanDimen3"
            :rules="[ { required: true, message: '费用余额对象不能为空'}]">
                <el-select v-model="formObj.instanDimen3" class="wd200" clearable :disabled="isDisabled">
                    <el-option
                    v-for="(item, index ) in instanceDimenOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.codes"
                    />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="业务用途" prop="instanDimen3">
                <el-select v-model="formObj.instanDimen3" class="wd200" clearable :disabled="isDisabled">
                    <el-option
                    v-for="(item, index ) in instanceDimenOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.codes"
                    />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="默认交易识别" prop="instanCode4">
                <el-input v-model="formObj.instanCode4" class="wd200" type="text" readonly />
            </el-form-item>
            
        </el-form>


        <!-- 维度实例弹窗 -->
         <el-dialog title="选择实例" :visible.sync="instanDimen_dialogFormVisibl" width="75%" append-to-body>
            <search-table
                ref="serchTable"
                :tableLabel="tableLabel"
                :queryObj="queryObj"
                :url="url"
                :params="params"
                @choseCuurRow="handleCuurRow"
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
  name: 'BusTypeBaseInfo',
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
    isDisabled: {
        type: Boolean,
        default : true
    },
    showCodeStr: {
        type: Boolean,
        default : true
    },

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

        // 维度组件 
        url: '',
        params: {},
        tableLabel: [],
        queryObj:{},

        // 选择的当前实例
        instan_currRow: {},
        intan_flag: '',
        intan_type: '',



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
        this.chosedInstanCode(this.intan_type) 
   },
   chosedInstanCode(code) {
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
       } else if (code == 'CHAN') { // 渠道 
    //    COS.IQ.02.0072
            this.url="/beta/betaService/COS.IQ.02.0072"
            this.params={
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
            // this.queryObj={}
            // this.label1 = '费用收取编号'
            // this.prop1 = 'feeTpyeCode'
            // this.params = {}
            this.url=""
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
       let key = ''
       if (this.intan_type == 'MODT') { // 业务类型
           key = 'businessTypeCode'
       } else if (this.intan_type == 'CHAN') { // 来源目录
           key = 'originList'
       } else if (this.intan_type == 'CNMD') { // 收取方式
           key = ''
       } else if (this.intan_type == 'CURR') { // 币种
           key = 'currencyCode'
       } else if (this.intan_type == 'FTYP') { // 费用收取方式
           key = 'feeTpyeCode'
       } else if (this.intan_type == 'INST') { // 分期类型
           key = 'stageTypeCode'
       } else if (this.intan_type == 'MODG') { // 业务项目
           key = 'businessProgramNo'
       } else if (this.intan_type == 'MODP') { // 产品对象
           key = 'productObjectCode'
       } else if (this.intan_type == 'TERM') { // 期数
           key = ''
       } else if (this.intan_type == 'MODM') { // 媒介对象
           key = 'mediaObjectCode'
       } 
       console.log(this.instan_currRow)
       
       this.formObj[intanStr] = this.instan_currRow[key]
        this.instanDimen_dialogFormVisibl = false

       
   },

  }


}
</script>

<style>

</style>

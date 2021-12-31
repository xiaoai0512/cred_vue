<!-- 交易信息组件 -->
<template>
    <div class="allContent" >
        <el-form ref="formRef" :model="formObj" :rules="formRules">
            <!-- <el-form-item  
                class="cl_td bnone" 
                v-for="(item, index ) in formList"
                :key="index"
                :label="item.label"
                :prop="item.prop"
            >
                <el-input v-model="formObj[item.prop]" class="wd200" type="text" readonly />
            </el-form-item> -->


            <el-form-item class="cl_td bnone" label="事件编号" prop="eventNo" >
                <el-input v-model="formObj.eventNo" class="wd200" type="text" readonly />
           </el-form-item>
           <el-form-item class="cl_td bnone" label="活动编号" prop="activityNo" >
                 <el-input v-model="formObj.activityNo" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="外部识别号" prop="externalIdentificationNo">
                <el-input v-model="formObj.externalIdentificationNo" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="账户号/余额单元号" prop="entityKey" >
                 <el-input v-model="formObj.entityKey" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="交易日期" prop="transDate">
                <el-input v-model="formObj.transDate" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="入账日期" prop="occurrDate" >
                 <el-input v-model="formObj.occurrDate" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="交易币种" prop="transCurrCde">
                <el-input v-model="formObj.transCurrCde" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="交易金额" prop="transAmount" >
                 <el-input v-model="formObj.transAmount" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="入账币种" prop="postingCurrencyCode">
                <el-input v-model="formObj.postingCurrencyCode" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="账户分配金额" prop="postingAmount" >
                 <el-input v-model="formObj.postingAmount" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="清算币种" prop="settlementCurrencyCode">
                <el-input v-model="formObj.settlementCurrencyCode" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="清算金额" prop="settlementAmount" >
                 <el-input v-model="formObj.settlementAmount" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="入账转换汇率" prop="postingConvertRate">
                <el-input v-model="formObj.postingConvertRate" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="交易描述" prop="transDesc" >
                 <el-input v-model="formObj.transDesc" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="余额类型" prop="balanceType">
                <el-input v-model="formObj.balanceType" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="客户号" prop="customerNo" >
                 <el-input v-model="formObj.customerNo" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="客户代码" prop="accountId">
                <el-input v-model="formObj.accountId" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="交易状态" prop="transStateDesc" >
                 <el-input v-model="formObj.transStateDesc" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="业务类型代码" prop="businessTypeCodeConcat">
                <el-input v-model="formObj.businessTypeCodeConcat" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="余额对象代码" prop="balanceObjectCodeConcat" >
                 <el-input v-model="formObj.balanceObjectCodeConcat" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="定价区域" prop="priceArea" >
                <el-input v-model="formObj.priceArea" class="wd200" type="text" readonly />
           </el-form-item>
           <el-form-item class="cl_td bnone" label="活动标签" prop="activityTag" >
                    <el-input v-model="formObj.activityTag" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="活动标签生效标志" prop="activityTagValidFlag" >
                <el-input v-model="formObj.activityTagValidFlag" class="wd200" type="text" readonly />
            </el-form-item>

            <el-form-item class="cl_td bnone" label="授权码" prop="authCde">
                <el-input v-model="formObj.authCde" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="来源码" prop="sourceCde" >
                 <el-input v-model="formObj.sourceCde" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="交易国家代码" prop="transCountryCde">
                <el-input v-model="formObj.transCountryCde" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="交易城市代码" prop="transCityCde" >
                 <el-input v-model="formObj.transCityCde" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="收单参考号" prop="acquireReferenceNumbr">
                <el-input v-model="formObj.acquireReferenceNumbr" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="渠道代码" prop="channelCde" >
                 <el-input v-model="formObj.channelCde" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="商户类型码" prop="mcc">
                <el-input v-model="formObj.mcc" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="商户代码" prop="merchantCde" >
                 <el-input v-model="formObj.merchantCde" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone bnone" label="全局流水号" prop="globalSerialNumbr" >
                <el-input v-model="formObj.globalSerialNumbr" class="wd200" type="text" readonly />
            </el-form-item>

            <div class="cl_tr text_center" v-if="showBtn">
                <el-button size="small" type="primary" @click="returnedPurchaseBtn"
                    v-if=" (formObj.eventNo=='ISS.PT.40.0001' || formObj.eventNo=='ISS.PT.40.0002'   || formObj.eventNo=='ISS.XT.00.0006' 
                    || formObj.eventNo=='ILS.XT.00.0001'  || formObj.eventNo=='ILS.XT.00.0003'  || formObj.eventNo=='ILS.XT.00.0004'  || formObj.eventNo=='ILS.XT.00.0005')
                    && (formObj.transState == 'NOR' ) "
                >全部退货</el-button>
                <el-button size="small" type="primary" @click="partReturnedPurchaseBtn"
                    v-if=" (formObj.eventNo=='ISS.PT.40.0001' || formObj.eventNo=='ISS.PT.40.0002'   || formObj.eventNo=='ISS.XT.00.0006' 
                    || formObj.eventNo=='ILS.XT.00.0001'  || formObj.eventNo=='ILS.XT.00.0003'  || formObj.eventNo=='ILS.XT.00.0004'  || formObj.eventNo=='ILS.XT.00.0005')
                    && (formObj.transState == 'NOR' || formObj.transState == 'PRT' ) "
                >部分退货</el-button>
                <el-button size="small" type="primary" @click="transStageDetailBtn"
                    v-if=" formObj.eventNo=='ISS.PT.40.0001' &&(formObj.transState == 'NOR' || formObj.transState == 'PIN')"
                >交易分期</el-button>
                <el-button size="small" type="primary" @click="disputeRegistBtn"
                    v-if=" formObj.disputeFlag === 'Y' && formObj.transState === 'NOR' "
                >争议登记</el-button>
                <el-button size="small" type="primary" @click="disputeReleaseCstBtn"
                    v-if=" formObj.transState == 'DIS' "
                >争议释放（有利于客户）</el-button>
                <el-button size="small" type="primary" @click="disputeReleaseBankBtn"
                    v-if=" formObj.transState == 'DIS' "
                >争议释放（有利于银行）</el-button>
                <el-button size="small" type="primary" @click="disputeAccQueryBtn"
                    v-if=" formObj.transState == 'DIS' "
                >争议账户查询</el-button>
                <el-button size="small" type="primary" @click="stagingAccInfoBtn"
                    v-if=" formObj.transState == 'INS' || formObj.transState == 'PIN' "
                >分期账户信息查询</el-button>
            </div>
        </el-form>
    </div>
</template>

<script>
export default {
  name: 'TransInfo',
  props: {
      // form
    formObj: {
        type: Object,
        default: {} 
    },
    showBtn:{
        type: Boolean,
        default: true
    },

  },
  components: {
      
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
    }
  },
  created() {
      
  },
  watch: {
      // 当replaceObj发生变化时，执行
      
  },
  mounted() {
    
  },
  methods: {
    // 全部退货
    returnedPurchaseBtn() {
        console.log(this.formObj)

        this.$emit('returnedPurchaseBtn', this.formObj)
    },
    // 部分退货
    partReturnedPurchaseBtn() {
        console.log(this.formObj)

        this.$emit('partReturnedPurchaseBtn', this.formObj)
    },
    // 交易分期
    transStageDetailBtn() {
        console.log(this.formObj)

        this.$emit('transStageDetailBtn', this.formObj)
    },
    // 争议登记
    disputeRegistBtn() {
        console.log(this.formObj)
        this.$emit('disputeRegistBtn', this.formObj)
        // this.$emit('disputeRegistBtn')

    },
    // 争议释放（有利于客户）
    disputeReleaseCstBtn() {
        this.$emit('disputeReleaseCstBtn', this.formObj)
    },
    // 争议释放（有利于银行）
    disputeReleaseBankBtn() {
        this.$emit('disputeReleaseBankBtn', this.formObj)
    },
    // 争议账户查询
    disputeAccQueryBtn() {
        console.log(this.formObj)

        // this.$emit('disputeAccQueryBtn', this.formObj)
        this.$emit('disputeAccQueryBtn')

    },
    // 分期账户信息查询
    stagingAccInfoBtn() {
        this.$emit('stagingAccInfoBtn', this.formObj)
    },
    refreshList() {
        this.$emit('stagingAccInfoBtn', this.formObj)
    }

  }


}
</script>

<style>

</style>

<!-- MccInfo 信息组件 -->
<template>
    <div class="allContent" >
        <el-form ref="formRef" :model="formObj" :rules="formRules">
            <el-form-item class="cl_td bnone" label="MTI" prop="mti" >
                <el-input v-model="formObj.mti" class="wd200" type="text" readonly />
           </el-form-item>
           <el-form-item class="cl_td bnone" label="客户号" prop="customerNo" >
                 <el-input v-model="formObj.customerNo" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="外部识别号" prop="externalIdentificationNo">
                <el-input v-model="formObj.externalIdentificationNo" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="处理码" prop="processingCode">
                <el-input v-model="formObj.processingCode" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="日期时间" prop="dateAndTime">
                <el-input v-model="formObj.dateAndTime" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="POS进入模式" prop="posEntryMode">
                <el-input v-model="formObj.posEntryMode" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="功能码" prop="functionCode">
                <el-input v-model="formObj.functionCode" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="消息原因代码" prop="messageReasonCode">
                <el-input v-model="formObj.messageReasonCode" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="MCC" prop="mcc">
                <el-input v-model="formObj.mcc" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="交易金额" prop="transAmt">
                <el-input v-model="formObj.transAmt" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="原始金额" prop="originalAmountReconciliation" >
                 <el-input v-model="formObj.originalAmountReconciliation" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="收单机构参考号" prop="acquireReferenceNumbr">
                <el-input v-model="formObj.acquireReferenceNumbr" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="受理机构标识码" prop="acqId" >
                 <el-input v-model="formObj.acqId" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="转发机构id代码" prop="forwdInstitIdCode" >
                 <el-input v-model="formObj.forwdInstitIdCode" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="检索参考号" prop="retrievalReferNum">
                <el-input v-model="formObj.retrievalReferNum" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="授权成功码" prop="authApprovalCde" >
                 <el-input v-model="formObj.authApprovalCde" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="受卡机终端标识码" prop="terminateIdentNo">
                <el-input v-model="formObj.terminateIdentNo" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="商户代码" prop="merchantCde" >
                 <el-input v-model="formObj.merchantCde" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="持卡人姓名/地址" prop="cardAcceptorName">
                <el-input v-model="formObj.cardAcceptorName" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="附加数据" prop="additionalData" >
                 <el-input v-model="formObj.additionalData" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="终端类型" prop="terminalType">
                <el-input v-model="formObj.terminalType" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone red" label="撤销标志" prop="messageReversalIndicator" >
                 <el-input v-model="formObj.messageReversalIndicator" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="电子商务安全等级指标" prop="electronicCommerceSecurityLevelIndicator">
                <el-input v-model="formObj.electronicCommerceSecurityLevelIndicator" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="币种小数位" prop="currencyExponents" >
                 <el-input v-model="formObj.currencyExponents" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="交易币种" prop="currencyCodesAmountsOriginal">
                <el-input v-model="formObj.currencyCodesAmountsOriginal" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="业务活动" prop="businessActivity" >
                 <el-input v-model="formObj.businessActivity" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="结算指标" prop="settlementIndicator">
                <el-input v-model="formObj.authCde" class="settlementIndicator" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="主卡id" prop="masterCardAssignedId" >
                 <el-input v-model="formObj.masterCardAssignedId" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="检索文档码" prop="retrievalDocumentCode">
                <el-input v-model="formObj.retrievalDocumentCode" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="S1排除请求代码" prop="exclusionRequestCode" >
                <el-input v-model="formObj.exclusionRequestCode" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="文件标识" prop="documentationIndicator">
                <el-input v-model="formObj.documentationIndicator" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="额外金额" prop="amountsAdditional" >
                 <el-input v-model="formObj.amountsAdditional" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="交易生命周期id" prop="transLifeCycleId">
                <el-input v-model="formObj.transLifeCycleId" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="报文编号" prop="messageNumber" >
                 <el-input v-model="formObj.messageNumber" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone bnone" label="交易发起机构" prop="transOriginInstit" >
                <el-input v-model="formObj.transOriginInstit" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone bnone" label="交易发起机构" prop="transOriginInstit" >
                <el-input v-model="formObj.transOriginInstit" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone bnone" label="交易发起机构" prop="transOriginInstit" >
                <el-input v-model="formObj.transOriginInstit" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone bnone" label="发卡机构参考数据" prop="cardIssuerReferenceData" >
                <el-input v-model="formObj.cardIssuerReferenceData" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone bnone" label="原交易全局流水号" prop="oldGlobalSerialNumbr" >
                <el-input v-model="formObj.oldGlobalSerialNumbr" class="wd200" type="text" readonly />
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
  name: 'MccInfo',
  props: {
      // form
    formObj: {
        type: Object,
        default: {} 
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
    

  }


}
</script>

<style>

</style>

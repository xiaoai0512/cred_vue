<!-- VISA 信息组件 -->
<template>
    <div class="allContent" >
        <el-form ref="formRef" :model="formObj" :rules="formRules">
            <el-form-item class="cl_td bnone" label="交易代码" prop="transactionCode" >
                <el-input v-model="formObj.transactionCode" class="wd200" type="text" readonly />
           </el-form-item>
           <el-form-item class="cl_td bnone" label="客户号" prop="customerNo" >
                 <el-input v-model="formObj.customerNo" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="外部识别号" prop="externalIdentificationNo">
                <el-input v-model="formObj.externalIdentificationNo" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="收单参考编号" prop="acquireReferenceNumbr" >
                 <el-input v-model="formObj.acquireReferenceNumbr" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="收单业务编号" prop="acquirerBusinessId">
                <el-input v-model="formObj.acquirerBusinessId" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="购买日期" prop="gmtDate" >
                 <el-input v-model="formObj.gmtDate" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="交易金额" prop="transAmt">
                <el-input v-model="formObj.transAmt" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="交易货币代码" prop="transCurrCode" >
                 <el-input v-model="formObj.transCurrCode" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="商家名称" prop="merchantName">
                <el-input v-model="formObj.merchantName" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="城市" prop="city" >
                 <el-input v-model="formObj.city" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="国家代码" prop="countryCode">
                <el-input v-model="formObj.countryCode" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="MCC" prop="mcc" >
                 <el-input v-model="formObj.mcc" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="邮政编码" prop="merchantZip">
                <el-input v-model="formObj.merchantZip" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="商户国家╱省代码" prop="stateCode" >
                 <el-input v-model="formObj.stateCode" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="发卡机构控制号" prop="issuerControlNumber">
                <el-input v-model="formObj.issuerControlNumber" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone red" label="请求原因代码" prop="requestReasonCode" >
                 <el-input v-model="formObj.requestReasonCode" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="结算标志" prop="settlementFlag">
                <el-input v-model="formObj.settlementFlag" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="国家偿还费" prop="nationalReimburseFee" >
                 <el-input v-model="formObj.nationalReimburseFee" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="账户种类" prop="accountSelection">
                <el-input v-model="formObj.accountSelection" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="调单请求ID" prop="retrievalRequestId" >
                 <el-input v-model="formObj.retrievalRequestId" class="wd200" type="text" readonly />
            </el-form-item>

            <el-form-item class="cl_td bnone" label="中央处理日期" prop="settlementDate">
                <el-input v-model="formObj.authCde" class="settlementDate" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="偿还属性" prop="reimburseAttribute" >
                 <el-input v-model="formObj.reimburseAttribute" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="传真号码" prop="faxNumber">
                <el-input v-model="formObj.faxNumber" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="请求完成方式" prop="requestedFulfllmentMethod" >
                <el-select v-model="queryForm.idType" class="wd200">
                    <el-option
                        v-for="(item, index) in requestedFulfllmentMethodOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                    />
                </el-select>
                <!-- <el-input v-model="formObj.requestedFulfllmentMethod" class="wd200" type="text" readonly /> -->
            </el-form-item>
            <el-form-item class="cl_td bnone" label="已建立的完成方式" prop="establishedFulfllmentMethod">
                <el-select v-model="queryForm.idType" class="wd200">
                    <el-option
                        v-for="(item, index) in requestedFulfllmentMethodOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                    />
                </el-select>
                <!-- <el-input v-model="formObj.establishedFulfllmentMethod" class="wd200" type="text" readonly /> -->
            </el-form-item>
            <el-form-item class="cl_td bnone" label="发卡机构清算币种" prop="clearCurrCode" >
                 <el-input v-model="formObj.clearCurrCode" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="发卡机构清算金额" prop="clearAmount">
                <el-input v-model="formObj.clearAmount" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="交易ID" prop="transIdentifier" >
                 <el-input v-model="formObj.transIdentifier" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone bnone" label="原交易全局流水号" prop="oldGlobalSerialNumbr" >
                <el-input v-model="formObj.oldGlobalSerialNumbr" class="wd200" type="text" readonly />
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
  name: 'VisaInfo',
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
        requestedFulfllmentMethodOptions: [], // 请求完成方式
    }
  },
  created() {
      
  },
  watch: {
      // 当replaceObj发生变化时，执行
      
  },
  mounted() {
    // 请求完成方式
    this.getSelectDict("dic_liquidationMode").then((res) => {
      this.requestedFulfllmentMethodOptions = res;
    });
  },
  methods: {
    

  }


}
</script>

<style>

</style>

<!-- 核算处理详情组件 -->
<template>
    <div class="" >
        <el-form ref="formRef" :model="formObj" :rules="formRules">
            <el-form-item class="cl_td bnone red" label="全局流水号" prop="globalSerialNumber" >
                <el-input v-model="formObj.globalSerialNumber" class="wd200" type="text" readonly />
           </el-form-item>
           <el-form-item class="cl_td bnone" label="记账规则代码" prop="accountingRuleCode" >
                 <el-input v-model="formObj.accountingRuleCode" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="入账日期" prop="postingDate">
                <el-input v-model="formObj.postingDate" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="子表序号" prop="subTableSequence" >
                 <el-input v-model="formObj.subTableSequence" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="账号" prop="accountId">
                <el-input v-model="formObj.accountId" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="核算类型编号" prop="accountingType" >
                <el-input v-model="formObj.accountingType" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="产品对象代码" prop="productObjectCode">
                <el-input v-model="formObj.productObjectCode" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="业务类型代码" prop="businessTypeCode" >
                <el-input v-model="formObj.businessTypeCode" class="wd200" type="text" readonly />
           </el-form-item>
           <el-form-item class="cl_td bnone" label="事件编号" prop="eventNo">
               <el-input v-model="formObj.eventNo" class="wd200" type="text" readonly />
           </el-form-item>
           <el-form-item class="cl_td bnone" label="外部识别号" prop="externalIdentificationNo" >
                <el-input v-model="formObj.externalIdentificationNo" class="wd200" type="text" readonly />
           </el-form-item>
           <el-form-item class="cl_td bnone" label="交易机构" prop="transOrganization">
               <el-input v-model="formObj.transOrganization" class="wd200" type="text" readonly />
           </el-form-item>
           <el-form-item class="cl_td bnone" label="账户机构" prop="accountOrganization" >
               <el-input v-model="formObj.accountOrganization" class="wd200" type="text" readonly />
           </el-form-item>
           <el-form-item class="cl_td bnone" label="交易摘要" prop="transSummary">
               <el-input v-model="formObj.transSummary" class="wd200" type="text" readonly />
           </el-form-item>
           <el-form-item class="cl_td bnone" label="渠道代码" prop="channelCde" >
                    <el-input v-model="formObj.channelCde" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="核算状态码" prop="accountingStatusCode">
                <el-input v-model="formObj.accountingStatusCode" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="记账标识" prop="accountingFlag" >
                    <el-input v-model="formObj.accountingFlag" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="原子动作编号" prop="atomicActionNumber">
                <el-input v-model="formObj.atomicActionNumber" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="金额类型编号" prop="amountTypeNumber" >
                <el-input v-model="formObj.amountTypeNumber" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="内部账号" prop="internalAccountNo">
                <el-input v-model="formObj.internalAccountNo" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="借贷方向" prop="drcrFlag" >
                <el-input v-model="formObj.drcrFlag" class="wd200" type="text" readonly />
           </el-form-item>
           <el-form-item class="cl_td bnone" label="记账币种" prop="postingCurrencyCode">
               <el-input v-model="formObj.postingCurrencyCode" class="wd200" type="text" readonly />
           </el-form-item>
           <el-form-item class="cl_td bnone" label="记账币种小数位" prop="postingCurrencyPoint" >
               <el-input v-model="formObj.postingCurrencyPoint" class="wd200" type="text" readonly />
           </el-form-item>
           <el-form-item class="cl_td bnone" label="记账金额" prop="actualPostingAmount">
               <el-input v-model="formObj.actualPostingAmount" class="wd200" type="text" readonly />
           </el-form-item>
           <el-form-item class="cl_td bnone" label="处理状态" prop="dealStatus" >
                    <el-input v-model="formObj.dealStatus" class="wd200" type="text" readonly />
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
  name: 'AccTreateDetail',
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
  mounted() {},
  methods: {
    handleDetail(row) {
        this.$emit('handleDetail', row)

    }
  }


}
</script>

<style>

</style>

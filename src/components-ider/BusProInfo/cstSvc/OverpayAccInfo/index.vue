<!-- 溢缴款账户信息组件 -->
<template>
    <div class="allContent" >
        <el-form ref="formRef" :model="formObj" :rules="formRules">

            <el-form-item class="cl_td bnone" label="账户代码" prop="accountId" >
                <el-input v-model="formObj.accountId" class="wd200" type="text" readonly />
           </el-form-item>
           <el-form-item class="cl_td bnone" label="币种" prop="currencyCode" >
                 <el-input v-model="formObj.currencyCode" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="当前余额" prop="currBalance">
                <el-input v-model="formObj.currBalance" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="存款利率" prop="depositInterestRate" >
                 <el-input v-model="formObj.depositInterestRate" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="上一结息金额" prop="interestBillingAmt">
                <el-input v-model="formObj.interestBillingAmt" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="冻结余额" prop="frozenBalance" >
                 <el-input v-model="formObj.frozenBalance" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="当前累积积数" prop="currAccumultBalance">
                <el-input v-model="formObj.currAccumultBalance" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="未入账利息" prop="unPostingInterest" >
                 <el-input v-model="formObj.unPostingInterest" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="上一累积日期" prop="prevAccumultDate">
                <el-input v-model="formObj.prevAccumultDate" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="利率生效日期" prop="interestRateEffectiveDate" >
                 <el-input v-model="formObj.interestRateEffectiveDate" class="wd200" type="text" readonly />
            </el-form-item>
            
        </el-form>
    </div>
</template>

<script>
export default {
  name: 'OverpayAccInfo',
  props: {
      // form
    formObj: {
        type: Object,
        default: {} 
    }

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
  methods: {}


}
</script>

<style>

</style>

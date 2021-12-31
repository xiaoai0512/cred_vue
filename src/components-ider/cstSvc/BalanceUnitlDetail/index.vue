<!-- 余额单元明细 信息组件 -->
<template>
    <div class="allContent" >
        <el-form ref="formRef" :model="formObj" :rules="formRules">
            <el-form-item class="cl_td bnone" label="余额单元代码" prop="balanceUnitCode" >
                <el-input v-model="formObj.balanceUnitCode" class="wd200" type="text" readonly />
           </el-form-item>
           <el-form-item class="cl_td bnone" label="账户代码 " prop="accountId" >
                 <el-input v-model="formObj.accountId" class="wd300" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="币种" prop="currencyCode">
                <el-input v-model="formObj.currencyCode" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="余额" prop="balance">
                <el-input v-model="formObj.balance" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="余额对象" prop="balanceObjectCodeTrans">
                <el-input v-model="formObj.balanceObjectCodeTrans" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="余额类型" prop="balanceType">
                <el-select v-model="formObj.balanceType" class="wd200" clearable disabled>
                    <el-option 
                        v-for="(item, index) in balanceTypeOptions" 
                        :key="index" 
                        :label="item.detailDesc" 
                        :value="item.codes" />
                </el-select>
                <!-- <el-input v-model="formObj.balanceType" class="wd200" type="text" readonly /> -->
            </el-form-item>
            <el-form-item class="cl_td bnone" label="周期号" prop="cycleNumber">
                <el-input v-model="formObj.cycleNumber" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="资产属性" prop="assetProperties">
                <el-input v-model="formObj.assetProperties" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="计息年利率" prop="annualInterestRate">
                <el-input v-model="formObj.annualInterestRate" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="上一结息日" prop="prevInterestBillingDate">
                <el-input v-model="formObj.prevInterestBillingDate" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="下一结息日" prop="nextInterestBillingDate">
                <el-input v-model="formObj.nextInterestBillingDate" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="余额建立日期" prop="createDate" >
                 <el-input v-model="formObj.createDate" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="余额结束日期" prop="endDate">
                <el-input v-model="formObj.endDate" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="当期最低还款额比例" prop="currCalculationPercentage" >
                 <el-input v-model="formObj.currCalculationPercentage" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="上一计息年利率" prop="lastInterestRate" >
                 <el-input v-model="formObj.lastInterestRate" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="上一年利率失效日期" prop="lastInterestRateExpirDate">
                <el-input v-model="formObj.lastInterestRateExpirDate" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="首次结息周期号" prop="firstBillingCycle" >
                 <el-input v-model="formObj.firstBillingCycle" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="余额单元核算状态" prop="accountingStatusCodeDesc">
                <el-input v-model="formObj.accountingStatusCodeDesc" class="wd200" type="text" readonly />
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
  name: 'BalanceUnitlDetail',
  props: {
      // form
    formObj: {
        type: Object,
        default: {} 
    },
  },
  components: {
      
  },
  data() {
    return {
        balanceTypeOptions: []
    }

  },
  created() {
      // 余额类型
    this.getSelectDict('dic_balanceType').then((res) => {
        console.log(res)
        this.balanceTypeOptions = res
    })
  },
  activated() {},
  mounted() {
    
    
  },
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
    this.formObj.balanceObjectCodeTrans = this.formObj.balanceObjectCode + this.formObj.balanceObjectDesc
      
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

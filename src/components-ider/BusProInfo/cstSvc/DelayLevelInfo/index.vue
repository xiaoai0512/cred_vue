<!-- 延滞层级信息组件 -->
<template>
    <div class="" >
        <el-form ref="formRef" :model="formObj" :rules="formRules">
            <el-form-item class="cl_td bnone" label="客户号" prop="customerNo" >
                <el-input v-model="formObj.customerNo" class="wd200" type="text" readonly />
           </el-form-item>
           <el-form-item class="cl_td bnone" label="延滞层级" prop="delinquencyLevel" >
                <el-select v-model="formObj.delinquencyLevel" class="wd200" clearable disabled>
                    <el-option
                    v-for="(item, index ) in delinquencyLevelOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.codes"
                    />
                </el-select>
                 <!-- <el-input v-model="formObj.delinquencyLevelInfo" class="wd200" type="text" readonly /> -->
            </el-form-item>
            <el-form-item class="cl_td bnone" label="层级代码" prop="levelCode">
                <el-input v-model="formObj.levelCodeTrans" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="产品代码" prop="productObjectNo" >
                 <el-input v-model="formObj.productObjectNoTrans" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="币种" prop="currencyDesc">
                <el-input v-model="formObj.currencyDesc" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="周期号" prop="cycleNoDesc" >
                <el-input v-model="formObj.cycleNoDesc" class="wd200" type="text" readonly />

                <!-- <el-select v-model="formObj.cycleNo" class="wd200" clearable disabled>
                    <el-option
                    v-for="(item, index ) in overpayFreezeStatusOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.codes"
                    />
                </el-select> -->
            </el-form-item>
            <el-form-item class="cl_td bnone" label="本周期当前最低应缴" prop="currCyclePaymentMin">
                <el-input v-model="formObj.currCyclePaymentMin" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="本周期期初最低应缴" prop="currCycleBeginPaymentMin" >
                 <el-input v-model="formObj.currCycleBeginPaymentMin" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="逾期期数" prop="cycleDueNum">
                <el-input v-model="formObj.cycleDueNum" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="逾期天数" prop="cycleDueDayNum" >
                <el-input v-model="formObj.cycleDueDayNum" class="wd200" type="text" readonly />

                <!-- <el-select v-model="formObj.cycleDueDayNum" class="wd200" clearable disabled>
                    
                    <el-option
                    v-for="(item, index ) in amtOccFlagOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.codes"
                    />
                </el-select> -->
            </el-form-item>
            <el-form-item class="cl_td bnone" label="最后还款日期" prop="currCyclePaymentDate">
                <el-input v-model="formObj.currCyclePaymentDate" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="还清日期" prop="payOffDate" >
                 <el-input v-model="formObj.payOffDate" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="最近一次评估日期" prop="latestEstimateDate">
                <el-input v-model="formObj.latestEstimateDate" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="最低欠款状态" prop="statusInfo" >
                 <el-input v-model="formObj.statusInfo" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="对应管控码" prop="blockCode">
                <el-input v-model="formObj.blockCode" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="管控码设置日期" prop="blockCodeSetDate" >
                <el-input v-model="formObj.blockCodeSetDate" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="当前核算状态" prop="accountingStatusCode" >
                <el-select v-model="formObj.accountingStatusCode" class="wd200" clearable disabled>
                    <el-option
                    v-for="(item, index ) in accountingStatusCodeOptions"
                    :key="index"
                    :label="item.labelDesc"
                    :value="item.accountingStatus"
                    />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td bnone" label="核算状态设置日期" prop="accountingStatusSetDate" >
                <el-input v-model="formObj.accountingStatusSetDate" class="wd200" type="text" readonly />
            </el-form-item>
            
        </el-form>
    </div>
</template>

<script>
export default {
  name: 'DelayLevelInfo',
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

        accountingStatusCodeOptions: [], //核算状态
        delinquencyLevelOptions: [], // 延滞层级
    }
  },
  created() {
  },
  watch: {
      // 当replaceObj发生变化时，执行
      
  },
  mounted() {
    // 核算状态
    this.getSelectDict('/beta/betaService/COS.IQ.02.0051').then((res) => {
        res.forEach(item => {
        item.labelDesc = item.accountingStatus+ ' '+ item.accountingDesc
        })
        this.accountingStatusCodeOptions = res
    })
     // 延滞层级
    this.getSelectDict('dic_delinquencyLevel').then((res) => {
        this.delinquencyLevelOptions = res
    })
  },
  methods: {
    

  }


}
</script>

<style>

</style>

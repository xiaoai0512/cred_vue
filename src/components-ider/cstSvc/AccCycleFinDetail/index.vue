<!-- 账户周期金融明细 组件 -->
<template>
    <div class="allContent" >
        <el-form ref="formRef" :model="formObj" :rules="formRules">
            <el-form-item class="cl_td bnone" label="全额还款容差金额" prop="fullToleranceAmount" >
                <el-input v-model="formObj.fullToleranceAmount" class="wd200" type="text" readonly />
           </el-form-item>
           <el-form-item class="cl_td bnone" label="本周期全额还款标志" prop="fullPaymentFlagDesc" >
                 <el-input v-model="formObj.fullPaymentFlagDesc" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="满足全额还款日期" prop="fullPaymentDate">
                <el-input v-model="formObj.fullPaymentDate" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="本周期宽限日" prop="graceDate">
                <el-input v-model="formObj.graceDate" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="本周期最后还款日" prop="paymentDueDate">
                <el-input v-model="formObj.paymentDueDate" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="已还款比例" prop="repaymRatio">
                <el-input v-model="formObj.repaymRatio" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="满足动态结息日期" prop="dynamicInterestSettlementDate">
                <el-input v-model="formObj.dynamicInterestSettlementDate" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="账单金额" prop="postingAmount">
                <el-input v-model="formObj.postingAmount" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="借方金额" prop="debitAmount">
                <el-input v-model="formObj.debitAmount" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="借方笔数" prop="debitNum">
                <el-input v-model="formObj.debitNum" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="贷方笔数" prop="creditNum">
                <el-input v-model="formObj.creditNum" class="wd200" type="text" readonly />
            </el-form-item>
            
        </el-form>
    </div>
</template>

<script>
export default {
  name: 'AccCycleFinDetail',
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
    if(this.formObj.fullPaymentFlag=='Y'){
        this.formObj.fullPaymentFlagDesc = "已满足";//"已满足";
    }else if(this.formObj.fullPaymentFlag=='N'){
        this.formObj.fullPaymentFlagDesc = "不满足";//"不满足";
    }
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

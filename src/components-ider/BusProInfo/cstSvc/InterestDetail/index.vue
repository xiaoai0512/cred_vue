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


            <el-form-item class="cl_td bnone" label="余额对象" prop="balanceObjectCode" >
                <el-input v-model="formObj.balanceObjectCode" class="wd200" type="text" readonly />
           </el-form-item>
           <el-form-item class="cl_td bnone" label="余额单元" prop="balanceUnitCode" >
                 <el-input v-model="formObj.balanceUnitCode" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="结息周期号" prop="billingCycleNo">
                <el-input v-model="formObj.billingCycleNo" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="结息开始时间" prop="billingStartDate" >
                 <el-input v-model="formObj.billingStartDate" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="结息结束时间" prop="billingEndDate">
                <el-input v-model="formObj.billingEndDate" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="本结息周期利息累计金额" prop="currInterestAmount" >
                 <el-input v-model="formObj.currInterestAmount" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="本周期利息入账标志" prop="currInterestPostFlag">
                <el-input v-model="formObj.currInterestPostFlag" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="利息入账余额对象" prop="interestPostBalanceObj" >
                 <el-input v-model="formObj.interestPostBalanceObj" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="上一周期利息累计转入金额" prop="lastInterestAmount">
                <el-input v-model="formObj.lastInterestAmount" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="发生日期" prop="occurrDate" >
                 <el-input v-model="formObj.occurrDate" class="wd200" type="text" readonly />
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
  name: 'InterestDetail',
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

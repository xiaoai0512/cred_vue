<!-- 分期交易账户明细组件 -->
<template>
    <div class="allContent" >
        <el-form ref="formRef" :model="formObj" :rules="formRules">
            <el-form-item class="cl_td bnone" label="账户代码" prop="accountId" >
                <el-input v-model="formObj.accountId" class="wd200" type="text" readonly />
           </el-form-item>
           <el-form-item class="cl_td bnone" label="信贷交易类型" prop="loanTypeDesc" >
                 <el-input v-model="formObj.loanTypeDesc" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="贷款金额" prop="loanAmount">
                <el-input v-model="formObj.loanAmount" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="币种" prop="currencyCode" >
                 <el-input v-model="formObj.currencyCode" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="利率 %" prop="loanRate">
                <el-input v-model="formObj.loanRate" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="费率" prop="feeRate" >
                 <el-input v-model="formObj.feeRate" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="总费用" prop="feeAmount">
                <el-input v-model="formObj.feeAmount" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="总期数" prop="loanTerm" >
                 <el-input v-model="formObj.loanTerm" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="未抛账费用" prop="remainFeeAmount">
                <el-input v-model="formObj.remainFeeAmount" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="未抛账期数" prop="remainPeriod" >
                 <el-input v-model="formObj.remainPeriod" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="未抛账本金" prop="remainPrincipalAmount">
                <el-input v-model="formObj.remainPrincipalAmount" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="已抛账欠款金额" prop="totalBalance" >
                 <el-input v-model="formObj.totalBalance" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="下次抛账日" prop="nextThrowDate">
                <el-input v-model="formObj.nextThrowDate" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="合同编号" prop="loanNum" >
                 <el-input v-model="formObj.loanNum" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="还款方式" prop="repayModeInfo">
                <el-input v-model="formObj.repayModeInfo" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="贷款开始日期" prop="loanStartDate" >
                 <el-input v-model="formObj.loanStartDate" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="贷款结束日期" prop="loanEndDate">
                <el-input v-model="formObj.loanEndDate" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="起息日期" prop="startIntDate" >
                 <el-input v-model="formObj.startIntDate" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="免息天数" prop="freeDays">
                <el-input v-model="formObj.freeDays" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="还款周期" prop="repayPrincipalCycle" >
                 <el-input v-model="formObj.repayPrincipalCycle" class="wd200" type="text" readonly />
            </el-form-item>

            <el-form-item class="cl_td bnone" label="执行利率%" prop="loanRate">
                <el-input v-model="formObj.loanRate" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="罚息上浮百分比" prop="penaltyUp" >
                 <el-input v-model="formObj.penaltyUp" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="利息合计" prop="interAmount">
                <el-input v-model="formObj.interAmount" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="未抛账利息" prop="remainInterAmount" >
                 <el-input v-model="formObj.remainInterAmount" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="收款账户" prop="directDebitAccountNo">
                <el-input v-model="formObj.directDebitAccountNo" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="收款账户所属行号" prop="directDebitBankNo" >
                 <el-input v-model="formObj.directDebitBankNo" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="状态" prop="statusInfo">
                <el-input v-model="formObj.statusInfo" class="wd200" type="text" readonly />
            </el-form-item>
            
        </el-form>
        <el-table
            v-loading = "config.loading"
            :data="tableData"
            class="mbtm20"
            fit
            highlight-current-row
            style="width: 100%;"
            border
        >
            <el-table-column prop="termNo" label="期数" align="center" />
            <el-table-column prop="throwDate" label="抛账日期" align="center" />
            <el-table-column prop="principalAmount" label="应还本金" align="center" />
            <el-table-column prop="interestAmount" label="应还利息" align="center" />
            <el-table-column prop="feeAmount" label="应还费用" align="center" />
        </el-table>
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
    config: {
        type: Object,
        default: {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0
        }
    },
    tableData: {
        type: Array,
        default: []
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

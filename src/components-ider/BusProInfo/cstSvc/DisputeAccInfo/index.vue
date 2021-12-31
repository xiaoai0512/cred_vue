<!-- 争议账户信息组件 -->
<template>
    <div class="" >
        <el-form ref="formRef" :model="formObj" :rules="formRules">
            <el-form-item class="cl_td bnone" label="账户代码" prop="accountId" >
                <el-input v-model="formObj.accountId" class="wd200" type="text" readonly />
           </el-form-item>
           <el-form-item class="cl_td bnone" label="币种" prop="currencyCode" >
                 <el-input v-model="formObj.currencyCode" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="外部识别号" prop="externalIdentificationNo">
                <el-input v-model="formObj.externalIdentificationNo" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="争议金额" prop="disputeAmount" >
                 <el-input v-model="formObj.disputeAmount" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="溢缴款冻结金额" prop="overpayFreezeAmount">
                <el-input v-model="formObj.overpayFreezeAmount" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="溢缴款冻结状态" prop="overpayFreezeStatus" >
                <el-select v-model="formObj.overpayFreezeStatus" class="wd200" clearable disabled>
                    <el-option
                    v-for="(item, index ) in overpayFreezeStatusOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.codes"
                    />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td bnone" label="释放日期" prop="freeDate">
                <el-input v-model="formObj.freeDate" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="原交易结息截止日" prop="interestExpirationDate" >
                 <el-input v-model="formObj.interestExpirationDate" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="原交易已结记利息金额" prop="interestAmt">
                <el-input v-model="formObj.interestAmt" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="额度占用标识" prop="amtOccFlag" >
                <el-select v-model="formObj.amtOccFlag" class="wd200" clearable disabled>
                    <el-option
                    v-for="(item, index ) in amtOccFlagOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.codes"
                    />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td bnone" label="业务项目" prop="businessProgramNoTrans">
                <el-input v-model="formObj.businessProgramNoTrans" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="所属业务类型" prop="businessTypeCodeTrans" >
                 <el-input v-model="formObj.businessTypeCodeTrans" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="客户代码" prop="customerNo">
                <el-input v-model="formObj.customerNo" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="所属机构" prop="organNoTrans" >
                 <el-input v-model="formObj.organNoTrans" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="状态码" prop="statusCode">
                <el-select v-model="formObj.statusCode" class="wd200" clearable disabled>
                    <el-option
                    v-for="(item, index ) in statusCodeOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.codes"
                    />
                </el-select>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
  name: 'DisputeAccInfo',
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


        overpayFreezeStatusOptions: [],
        amtOccFlagOptions: [],
        statusCodeOptions: [],
    }
  },
  created() {
  },
  watch: {
      // 当replaceObj发生变化时，执行
      
  },
  mounted() {
    // 溢缴款冻结状态
    this.getSelectDict('dic_overpayFreezeStatus').then((res) => {
        this.overpayFreezeStatusOptions = res
    })
     // 额度占用标识
     this.getSelectDict('dic_amtOccFlag').then((res) => {
        this.amtOccFlagOptions = res
    })
     // 状态码
     this.getSelectDict('dic_statusCode').then((res) => {
        this.statusCodeOptions = res
    })
  },
  methods: {
    

  }


}
</script>

<style>

</style>

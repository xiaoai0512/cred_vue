<!-- 核算处理组件 -->
<template>
    <div class="" >
        <el-form ref="formRef" :model="formObj" :rules="formRules">
            <el-form-item class="cl_td bnone red" label="全局流水号" prop="globalSerialNumbr" >
                <el-input v-model="formObj.globalSerialNumbr" class="wd200" type="text" readonly />
           </el-form-item>
           <el-form-item class="cl_td bnone" label="外部识别号" prop="externalIdentificationNo" >
                 <el-input v-model="formObj.externalIdentificationNo" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="账号" prop="accountId">
                <el-input v-model="formObj.accountId" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="业务类型代码" prop="businessTypeCode" >
                 <el-input v-model="formObj.businessTypeCode" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="事件编号" prop="eventNo">
                <el-input v-model="formObj.eventNo" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="记账币种" prop="postingCurrencyCode" >
                <el-input v-model="formObj.postingCurrencyCode" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="记账金额" prop="actualPostingAmount">
                <el-input v-model="formObj.actualPostingAmount" class="wd200" type="text" readonly />
            </el-form-item>
        </el-form>
        <div class="text_title">会计流水信息</div>
        <el-table
            v-loading = "config.loading"
            :data="tableData"
            class="mbtm20"
            fit
            highlight-current-row
            style="width: 100%;"
            border
        >
            <el-table-column prop="transCurrDesc" label="记账规则代码" align="center" >
                <template slot-scope="{row}">
                        {{row.accountingRuleCode}}
                        {{row.accountingRuleDesc}}
                </template>
            </el-table-column>
            <el-table-column prop="actualPostingAmount" label="记账金额" align="center" />
            <el-table-column prop="postingCurrencyCode" label="记账币种" align="center">
                <template slot-scope="{row}">
                    {{row.postingCurrencyCode}}
                    {{row.currencyDesc}}
                </template>
            
            </el-table-column>
            <el-table-column prop="atomicActionNumber" label="原子动作编号" align="center" >
                <template slot-scope="{row}">
                    {{row.atomicActionNumber}}
                    {{row.atomicActionNumberDesc}}
                </template>
            </el-table-column>
            <el-table-column prop="amountTypeNumber" label="金额类型编号" align="center" >
                <template slot-scope="{row}">
                    {{row.amountTypeNumber}}
                    {{row.amountTypeNumberDesc}}
                </template>
            </el-table-column>
            <el-table-column prop="postingDate" label="记账日期" align="center" />
            <el-table-column prop="" label="操作" align="center">
                <template slot-scope="{row}">
                    <el-button size="mini" type="primary" @click="handleDetail(row)">详情</el-button>
                </template> 
            </el-table-column>
        </el-table>

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

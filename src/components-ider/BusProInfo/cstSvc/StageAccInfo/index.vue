<!-- 争议账户信息组件 -->
<template>
    <div class="" >
        <el-table
            v-loading = "config.loading"
            :data="tableData"
            class="mbtm20"
            fit
            highlight-current-row
            style="width: 100%;"
            border
        >
            <el-table-column prop="loanTypeDesc" label="账户类型" align="center" width = "100" />
            <el-table-column prop="accountId" label="账户代码" align="center" />
            <el-table-column prop="loanAmount" label="交易金额" align="center" width = "100" />
            <el-table-column prop="remainPrincipalAmount" label="未抛金额" align="center" />
            <el-table-column prop="currencyCode" label="币种" align="center"  />
            <el-table-column prop="loanTerm" label="期数" align="center" />
            <el-table-column prop="statusDesc" label="起始日" align="center"  width = "100" />
            <el-table-column prop="transDesc" label="账户状态" align="center" />
            <el-table-column prop="" label="操作" align="center" >
                <template slot-scope="{row}">
                    <el-button size="mini" type="primary" @click="rowClick(row)">详情</el-button>
                </template> 
            </el-table-column>
        </el-table>
        <pagination v-show="config.total>0" :total="config.total" :page.sync="config.pageNum" :limit.sync="config.pageSize" @pagination="refreshList" />
        
    </div>
</template>

<script>
export default {
  name: 'StageAccInfo',
  props: {
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
    tableData () {}
  },
  data() {
    return { 

    }
  },
  created() {
      
  },
  watch: {
      // 当replaceObj发生变化时，执行
      
  },
  mounted() {},
  methods: {
    rowClick(row) {
        this.$emit('rowClick', row)
    },
    refreshList(e) {
        this.$emit('refreshList', e)
    }

  }


}
</script>

<style>

</style>

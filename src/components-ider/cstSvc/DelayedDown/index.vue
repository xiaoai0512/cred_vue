<!-- 延滞冲减组件 -->
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
            <el-table-column prop="delinquencyLevel" label="延滞层级" align="center" >
                <template slot-scope="{row}">
                    <span v-if="row.delinquencyLevel=='A'">业务类型级</span>
                    <span v-if="row.delinquencyLevel=='P'">业务项目级</span>
                    <span v-if="row.delinquencyLevel=='G'">业务项目级</span>
                </template>
            </el-table-column>
            <el-table-column prop="levelCode" label="层级代码" align="center" >
                <template slot-scope="{row}">
                    <span v-if="row.delinquencyLevel=='A'">{{row.levelCode}}{{row.businessDesc}}</span>
                    <span v-if="row.delinquencyLevel=='P'">{{row.levelCode}}{{row.productLevelCodeDesc}}</span>
                    <span v-if="row.delinquencyLevel=='G'">{{row.levelCode}}{{row.programDesc}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="productObjectNo" label="产品对象代码" align="center">
                <template slot-scope="{row}">
                    {{row.productObjectNo}}
                    {{row.productDesc}}
                </template>
            
            </el-table-column>
            <el-table-column prop="currencyCode" label="币种" align="center" >
                <template slot-scope="{row}">
                    {{row.currencyCode}}
                    {{row.currencyDesc}}
                </template>
            </el-table-column>
            <el-table-column prop="cycleNo" label="周期号" align="center" />
            <el-table-column prop="cycleDueNum" label="逾期期数" align="center" />
            <el-table-column prop="cycleDueDayNum" label="逾期天数" align="center" />
            <el-table-column prop="minPaymentChange" label="冲减金额" align="center" />
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
  name: 'DelayedDown',
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
  watch: {},
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
    handleDetail(row) {
        this.$emit('handleDetail', row)
    }
  }


}
</script>

<style>

</style>

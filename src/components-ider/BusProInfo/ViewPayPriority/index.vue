<!-- 查看参数 -->
<template>
    <div class="">
        <el-form :inline="true" ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules" class="demo-form-inline">
            <el-form-item label="业务项目代码" prop="businessProgramNo">
                <el-input v-model="queryFormObj.businessProgramNo" type="text"/>
            </el-form-item>
            <el-form-item label="业务项目描述" prop="programDesc">
                <el-input v-model="queryFormObj.programDesc" type="text"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSearch">查询</el-button>
            </el-form-item>
             <el-form-item>
                <el-button type="primary" @click="reset">重置</el-button>
            </el-form-item>
        </el-form>
        <el-table
            :data="tableList"
            class="mbtm20"
            fit
            highlight-current-row
            style="width: 100%;"
            border
        >
            <el-table-column prop="businessProgramNo" label="业务项目代码" align="center" />
            <el-table-column prop="programDesc" label="业务项目描述" align="center" />
            <el-table-column prop="paymentPriority" label="优先级" align="center" />
        </el-table>
        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />

    </div>
</template>

<script>
import Pagination from "@/components/Pagination";

export default {
  name: 'ViewPayPriority',
  props: {

  },
  components: {
      Pagination,
  },
  data() {
    return { 
        queryFormRef: {},
        queryFormRules: {},

        tableList: [],
        tableTotal: 0,
        queryFormObj: {
            pageSize: 10,
            pageMun: 1
        }
    }
  },
  watch: {
      
  },
  mounted() {
    this.getList()	
  },
  methods: {
    getList(){
        this.getTableList('/beta/betaService/COS.IQ.02.0018', this.queryFormObj ,(res) => {
            this.listLoading1 = false
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.tableList = res.returnData.rows
                    this.tableTotal = res.returnData.totalCount
                } else {
                    this.tableList = []
                    this.tableTotal = 0
                }
            }
        })
    },
    handleSearch(){
        this.getList()
    },
    reset() {
        this.queryFormObj.businessProgramNo = ''
        this.queryFormObj.programDesc = ''

    },
  }
}
</script>

<style>

</style>

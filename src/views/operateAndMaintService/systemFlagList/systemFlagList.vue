<!-- 系统单元号 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
           	<el-form-item class="cl_td" label="系统单元编号" prop="systemUnitNo">
                <el-input v-model="queryFormObj.systemUnitNo" class="wd200" type="text"/>
            </el-form-item>
            <el-form-item class="cl_td" label="系统单元名称" prop="systemUnitName">
                <el-input v-model="queryFormObj.systemUnitName" class="wd200" type="text"/>
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()">查询</el-button>
            </div>
        </el-form>
        <el-table v-loading = "listLoading1" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
            <el-table-column prop="systemUnitNo" label="系统单元编号" align="center" />
            <el-table-column prop="systemUnitName" label="系统单元名称" align="center" />
            <el-table-column prop="systemOperateStateDesc" label="系统运行状态" align="center" />
            <el-table-column prop="lastProcessDate" label="上一处理日" align="center" />
            <el-table-column prop="currProcessDate" label="当前处理日期" align="center" />
            <el-table-column prop="nextProcessDate" label="下一处理日" align="center" />
        </el-table>
        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
   </div>
</template>

<script>
import Pagination from "@/components/Pagination";
export default {
      name: 'tableList',
      components: {
        // eslint-disable-next-line vue/no-unused-components
        Pagination,
  	},
  	data() {
        return {
           	logininfo: '',
            // 列表
            queryFormObj: {
                pageNum: 1,
                pageSize:10,
            },
            listLoading1: false,
            queryFormRef: {},
            queryFormRules: {},      
            tableList: [],
            tableTotal: 0,
        }
    },
    created() {
        
    },
    mounted() {
        this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))  //获取用户登录权限
		this.getList()
   	},
    methods: {
       	// 列表
        getList() {
            this.listLoading1 = true
            let params = {
                isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_systemOperation'],//查找数据字典所需参数
				transDict : ['systemOperateState'],//翻译前后key
			}
            params = Object.assign(this.queryFormObj, params)   //合并
           	this.getTableList('/beta/betaService/COS.IQ.02.0038', params,(res) => {
                   this.listLoading1 = false
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.tableList = res.returnData.rows
                        this.tableTotal = res.returnData.totalCount
                    }else{
                        this.tableList = []
                        this.tableTotal = 0
                    }
                }
            })
        },
        //搜索
        handleSearch() {
            this.getList()
        },
    }
}
</script>

<style>
</style>

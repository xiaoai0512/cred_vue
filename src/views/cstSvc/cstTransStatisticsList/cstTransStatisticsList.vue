<!-- 客户交易统计查询 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form :model="queryForm">
            <el-form-item class="cl_td" label="证件类型" prop="idType">
                <el-select v-model="queryForm.idType" class="wd200">
                <el-option v-for="(item, index) in idTypeList" :key="index" :label="item.detailDesc" :value="item.codes" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="证件号码" prop="idNumber">
                <el-input v-model="queryForm.idNumber" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                <el-input v-model="queryForm.externalIdentificationNo" class="wd200" type="text" />
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()">查询</el-button>
                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="reset()">重置</el-button>
            </div>
        </el-form>
        <div v-if="showDiv">
        	<el-table v-loading = "listLoading" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
	           	<el-table-column prop="customerNo" label="客户号" align="center" />
	            <el-table-column prop="productObjectCodeDesc" label="产品对象代码" align="center" />
	            <el-table-column prop="cycleNo" label="周期号" align="center" />
	            <el-table-column prop="transIdentifiNo" label="交易识别代码" align="center"/>
	            <el-table-column prop="accumultTransNumDebit" label="累计借记交易笔数" align="center" />
	            <el-table-column prop="accumultTransAmtDebit" label="累计借记交易金额" align="center"/>
             	<el-table-column prop="accumultTransNumCredit" label="累计贷记交易笔数" align="center"/>
              	<el-table-column prop="accumultTransAmtCredit" label="累计贷记交易金额" align="center"/>
         	</el-table>
	        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="getList" />
    	</div>
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
	           	// 列表
	            showDiv: false,
	            queryForm: {
	                pageNum: 1,
	                pageSize:10,
	            },
	            listLoading: false,
	            tableList: [],
	            tableTotal: 0,
	            //下拉
	            idTypeList: [],//证件类型
    		}
        },
        created() {
            //this.getBtnAuth()
        },
        mounted() {
            this.getSelectDict('dic_certificateType').then((res) => {
		        this.idTypeList = res
	      	})
            
            this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))  //获取用户登录权限
        },
      methods: {
        init() {
            this.queryForm = {
                idType: '',
                idNumber: '',
                externalIdentificationNo: '',
            }
            this.showDiv  = false
        },
      // 重置
      reset() {
        this.init()
      },
      // 点击查询按钮
      handleSearch() {
        if (!this.queryForm.externalIdentificationNo && !this.queryForm.idType && !this.queryForm.idNumber) {
          	this.$message({
	            message: '请输入查询信息',
	            type: 'warning'
          	})
          	this.init()
        } else {
          	if (this.queryForm.idType) {
	            if (!this.queryForm.idNumber) {
	              	this.$message({
	                message: '请输入证件号码',
	                type: 'warning'
	            })
            } else {
	              	this.getList()
	            }
          	} else if (this.queryForm.idNumber) {
	            if (!this.queryForm.idType) {
	              this.$message({
	                message: '请输入证件类型',
	                type: 'warning'
	              })
	            } else {
	              this.getList()
              	}
          	} else {
	            this.getList()
	        }
        }
      },
        // 列表
        getList() {
            this.listLoading = true
            this.showDiv = true
           	this.getTableList('/nonfi/nonfinanceService/BSS.IQ.03.0015', this.queryForm,(res) => {
           		this.listLoading = false
           		if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                		this.tableList = res.returnData.rows;
                		this.tableTotal = res.returnData.totalCount;
                		this.tableList.forEach(item=>{
                			item.productObjectCodeDesc = item.productObjectCode+ ''+item.productDesc
                		})
						
                    }
                }
            })
        },
    }
}
</script>

<style>
</style>

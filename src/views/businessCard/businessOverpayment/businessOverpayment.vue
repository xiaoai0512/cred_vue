<!-- 预算单位溢缴款转出 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
    	<el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
	       	<el-form-item class="cl_td" label="预算单位编码" prop="idNumber">
            	<el-input v-model="queryFormObj.idNumber" class="wd200" type="text"/>
        	</el-form-item>
    		<div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()">查询</el-button>
                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="reset(queryFormObj)">重置</el-button>
            </div>
    	</el-form>  
    	<div v-if="showList">
    		<div class="mainname">公务卡溢缴款转出</div>
	       	<el-table v-loading = "listLoading" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
	            <el-table-column prop="accountId" label="账户代码" align="center" />
	            <el-table-column prop="currencyCode" label="币种" align="center" />
	            <el-table-column prop="currBalance" label="当前余额" align="center" />
	            <el-table-column prop="depositInterestRate" label="存款利率" align="center" />
	            <el-table-column prop="interestBillingAmt" label="上一年结息金额" align="center" />
	           	<el-table-column prop="" label="操作" align="center" width="200px">
	                <template slot-scope="{row}">
		                <el-button size="mini" icon="el-icon-more" type="primary" @click="handleUp(row)">溢缴款转出</el-button>
		            </template >   
	            </el-table-column>
        	</el-table>
        	<pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
	    </div>
	    <el-dialog title="溢缴款转出" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp" >
                <el-form-item class="cl_td" label="转出金额" prop="ecommOverflowTransAmount">
                    <el-input v-model="tempUp.ecommOverflowTransAmount" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="所在行" prop="activityNo">
                    <el-input v-model="tempUp.activityNo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="转入账户" prop="externalIdentificationNo">
                    <el-input v-model="tempUp.externalIdentificationNo" class="wd200" type="text" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleUp = false">取消</el-button>
                <el-button type="primary" @click="subUpData()">确定</el-button>
            </div>
        </el-dialog>
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
                // form
                cancelBtnFlag: false,
                showDiv: false,
                showList: false,
                queryFormObj: {
                	pageNum: 1,
                	pageSize:10,
                },
                queryFormRules: {},
                queryFormRef: {}, 
                //基本信息
               	detailRef: {},
               	detailInfo: {},
               	detailRules: {},
               	//列表
               	tableTotal: 0,
               	listLoading: false,
               	tableList: [],
               	queryInfo: {},
               	//溢缴款转出
               	dialogFormVisibleUp: false,
               	tempUp: {},
                dataFormUp: {},
                rulesUp: {},
           }
        },
    	created() {
        
    	},
	    mounted() {
	        this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))  //获取用户登录权限
	       	
	    },
		methods: {
	      	reset(){
	      		this.queryFormObj = {}
	      	},
	      	handleSearch(){
	      		if(!this.queryFormObj.idNumber){
	        		this.$message('请输入查询条件！')
				 	return;
	       		}
	        	this.getList()
	  		},
      	//溢缴款信息列表
      	getList(){
      		this.listLoading = true  
      		this.showList = true
      		this.queryFormObj.idType = '7'
      		this.post('/nonfi/nonfinanceService/BSS.IQ.01.0070', this.queryFormObj, (res) => {
   				this.listLoading = false
       			if(res.returnCode == '000000') {
       				this.tableList = res.returnData.rows
                	this.tableTotal = res.returnData.totalCount
					this.showList = true;
       				if (!res.returnData.rows || res.returnData.rows.length == 0) {
						res.returnData.rows = [];
					}else if(res.returnData.obj!= null){
						this.queryInfo.customerNo = res.returnData.obj.customerNo;
						this.queryInfo.operationMode = res.returnData.obj.operationMode;
					}
				}else{
	            	this.showList = false
	            }
        	})
      	},
      	//修改显示的弹框
      	handleUp(row){
        	this.dialogFormVisibleUp = true
            this.tempUp = Object.assign({}, row)
			this.$nextTick(() => {
                this.$refs['dataFormUp'].clearValidate()
            })
        },
      	//转账成功
      	subUpData(){
      		let params = {
      			idType: '7',
      			ecommTransCurr: this.tempUp.currencyCode,
      			ecommCustId: this.queryInfo.customerNo,
      			ecommOperMode: this.queryInfo.operationMode,
      			ecommOverflowAccountNo: this.tempUp.accountId,
      			idNumber: this.tempUp.idNumber,
      			ecommOverflowTransAmount: this.tempUp.ecommOverflowTransAmount,
			  }
      		this.post('/card/cardService/OCS.RT.80.0001', params, (res) => {
				if (res.returnCode == '000000') {
					this.$notify({
						message: '转账成功',
						type: 'success',
					})
					this.dialogFormVisibleUp = false
					this.getList()
				}
            })
      	},
    }
}
</script>
<style>
</style>
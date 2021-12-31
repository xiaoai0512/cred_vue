<!-- 预算单位账单查询 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
    	<el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
	       	<el-form-item class="cl_td" label="预算单位编码" prop="idNumber">
            	<el-input v-model="queryFormObj.idNumber" class="wd200" type="text"/>
        	</el-form-item>
        	<el-form-item class="cl_td" label="账单日期" prop="billDay">
                <el-date-picker class="wd200"
                    v-model="queryFormObj.billDay"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                </el-date-picker>
			</el-form-item>
    		<div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()">查询</el-button>
            </div>
    	</el-form>  
    	<div v-if="showDiv">
	        <div class='mainname'>公务卡账单摘要信息</div>
        	<el-table v-loading = "listLoading" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
	            <el-table-column prop="customerName" label="客户姓名" align="center" />
	            <el-table-column prop="externalIdentificationNo" label="外部识别号" align="center" />
	            <el-table-column prop="currentCycleNumber" label="当前周期号" align="center" />
	            <el-table-column prop="postingAmount" label="账单金额" align="center" />
	            <el-table-column prop="currencyCode" label="币种" align="center" />
	            <el-table-column prop="productDesc" label="产品描述" align="center" />
	       	</el-table>
	        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
		     <div class="mainname titleInfo">个人公务卡账单汇总信息</div>
		    <el-form ref="personalRef" :model="personalInfo" :rules="personalRules">
	            <el-form-item class="cl_td" label="账单金额" prop="postingAmount">
	            	<el-input v-model="personalInfo.postingAmount" class="wd200" type="text" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="本金金额" prop="principalAmount">
            		<el-input v-model="personalInfo.principalAmount" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="利息金额" prop="interestAamount ">
	            	<el-input v-model="personalInfo.interestAamount " class="wd200" type="text" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="费用金额" prop="feeAmount ">
            		<el-input v-model="personalInfo.feeAmount" class="wd200" type="text" readonly/>
				</el-form-item>
	        </el-form>
			<div style="clear: both;"></div>
		    <div class="mainname titleInfo">单位公务卡账单汇总信息</div>
		    <el-form ref="companyRef" :model="companyInfo" :rules="companyRules">
	           <el-form-item class="cl_td" label="账单金额" prop="postingAmount">
	            	<el-input v-model="companyInfo.postingAmount" class="wd200" type="text" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="本金金额" prop="principalAmount">
            		<el-input v-model="companyInfo.principalAmount" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="利息金额" prop="interestAmount">
	            	<el-input v-model="companyInfo.interestAmount " class="wd200" type="text" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="费用金额" prop="feeAmount ">
            		<el-input v-model="companyInfo.feeAmount" class="wd200" type="text" readonly/>
				</el-form-item>
	        </el-form>
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
				personalRules:{},
                //列表
               	tableTotal: 0,
               	listLoading: false,
               	tableList: [],
               	queryInfo: {},
               	unitBillOutList: {},
 				//个人公务卡账单汇总信息
				personalInfo: {},   
				personalRef: {},
               	personalRef: {},
               	//单位公务卡账单汇总信息
               	companyInfo: {},
				companyRules: {},
				companyRef: {},
               	// 下拉框
                activationFlagOptions: [],//激活标识
                activationModeOptions: [],//激活方式
            }
        },
        created() {
            
        },
        mounted() {
            this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))  //获取用户登录权限
           	this.getBtnAuth()
           	//激活标识
           	this.getSelectDict('dic_activationFlag').then((res) => {
        		this.activationFlagOptions = res
    		})
           	//激活标识
           	this.getSelectDict('dic_activationMode').then((res) => {
        		this.activationModeOptions = res
    		})
        },
  	methods: {
      	 // 查询按钮权限
    	getBtnAuth() {
	        //console.log(window.sessionStorage.getItem('menuNo'))
	        let params= {
	            menuNo : window.sessionStorage.getItem('menuNo')
	        }
	        this.getTableList('/beta/betaService/COS.CS.01.0030', params ,(res) => {
	            if (res.returnCode == '000000') {
	                if (res.returnData && res.returnData.length > 0 ) {
	                    res.returnData.forEach(item => {
	                        this.btnAuthStr += item.eventNo+','
	                    })
	                    if (this.btnAuthStr.includes('OCS.OP.01.0002')) { //注销
	                        this.cancelBtnFlag = true;
	                    } else {
	                        this.cancelBtnFlag = false
	                    }
	                   
	                }
	            }
	        })
	    },
      	reset(){
      		this.queryFormObj = {}
      	},
      	handleSearch(){
      		if(this.queryFormObj.idNumber){
				this.queryFormObj.idType = '7';
			}
            if((this.queryFormObj.idNumber == "" || this.queryFormObj.idNumber == null || this.queryFormObj.idNumber == undefined) &&
				(this.queryFormObj.billDay == "" || this.queryFormObj.billDay == null || this.queryFormObj.billDay == undefined)){
				this.showDiv = false;
				this.$message('输入查询条件');//"输入查询条件"
				return;
			}else {
				if(this.queryFormObj.idNumber){
					if(this.queryFormObj.billDay == '' || this.queryFormObj.billDay == null || this.queryFormObj.billDay == undefined){
						this.resultInfo = false;
						this.$message('请输入账单日期'); 
					}else {
						this.showDiv = true;
						this.getList();
					}
				}else if (this.queryFormObj.billDay){
					if(this.queryFormObj.budgetOrgCode == '' || this.queryFormObj.budgetOrgCode == null || this.queryFormObj.budgetOrgCode == undefined){
						this.showDiv = false;
						this.$message('请输入预算单位!');  
						
					}else {
						this.showDiv = true;
						this.getList();
					}
				}else {
					this.showDiv = true;
					this.getList();
					
				}
			}
      	},
      	//公务卡信息列表
      	getList(){
      		this.listLoading = true  
      		let params ={
				idNumber: this.queryFormObj.idNumber,
				idType:'7',
      			billDay: this.queryFormObj.billDay,
	   			pageNum:  this.queryFormObj.pageNum,
	        	pageSize:  this.queryFormObj.pageSize,
	        }
      		this.post('/nonfi/nonfinanceService/OCS.IQ.01.0012', params, (res) => {
   				this.listLoading = false
   				this.showDiv = true
       			if(res.returnCode == '000000') {
	       			if(res.returnData &&res.returnData.rows && res.returnData.rows.length > 0){
	       				this.tableList = res.returnData.rows
	       				
	       			}else{
	       				res.returnData.rows = [];
	       			}
	       			this.personalInfo = res.returnData.queryBudgetOrgBill.peoCollectInfo;
					this.companyInfo = res.returnData.queryBudgetOrgBill.unitCollectInfo;
	                this.tableTotal = res.returnData.totalCount
	            }else{
	            	let returnMsg = res.returnMsg ? res.returnMsg : ('操作失败');//'操作失败！'
					this.$messagel(returnMsg);
					this.showDiv = false;
					this.listLoading = false  
	            }
        	})
      	},
   }
}
</script>
<style>
</style>

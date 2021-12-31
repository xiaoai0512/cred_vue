<!-- 统一利率 -->
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
	            <!--<el-table-column width="80" align="center" label="选择">
                    <template scope="scope">
                        <el-radio v-model="templateRadio" :label="scope.$index" @change.native="getTemplateRow(scope.row)">{{""}}</el-radio>
                    </template>
                </el-table-column>-->
	            <el-table-column prop="accountId" label="账户代码" align="center" />
	            <el-table-column prop="currencyCodeDesc" label="币种" align="center" />
	            <el-table-column prop="businessTypeCode" label="业务类型" align="center" />
	            <el-table-column prop="productObjectCode" label="产品对象代码" align="center"/>
	            <el-table-column prop="productDesc" label="产品对象描述" align="center" />
	            <el-table-column prop="accountOrganFormDesc" label="账户组织形式" align="center"/>
             	<el-table-column prop="businessDebitCreditCodeDesc" label="账户性质" align="center"/>
              	<el-table-column prop="statusCodeDesc" label="状态码" align="center"/>
          	 	<el-table-column prop="" label="操作" align="center" width = "220">
                    <template slot-scope="{row}">
                        <el-button size="mini" type="primary"
                            @click="viewBalanceInf(row)">查询</el-button>
                    </template> 
                </el-table-column>
            </el-table>
	        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="getList" />
    	</div>
    	<div v-if="isShow">
    		<div class="text_title">账户余额对象信息</div>
        	<el-table v-loading = "balanceListLoading" :data="balanceInfo" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
	            <el-table-column prop="accountId" label="账户代码" align="center" />
	            <el-table-column prop="currencyCodeDesc" label="币种" align="center" />
	            <el-table-column prop="balanceObjectCode" label="余额对象代码" align="center" />
	            <el-table-column prop="interestRate" label="生效利率" align="center"/>
	            <el-table-column prop="rateChangeFlagDesc" label="利率变更标志" align="center" />
	            <el-table-column prop="pendingInterestRate" label="pending生效利率" align="center"/>
             	<el-table-column prop="overpayRateChangeFlagDesc" label="溢缴款利率变动标志" align="center"/>
              	<el-table-column prop="" label="操作" align="center" width = "220">
                    <template slot-scope="{row}">
                        <el-button size="mini" type="primary"
                            @click="seeBalanceInf(row)">查看</el-button>
                    </template> 
                </el-table-column>
            </el-table>
            <pagination v-show="balanceTotal>0" :total="balanceTotal" :page.sync="balancePage.pageNum" :limit.sync="balancePage.pageSize" @pagination="viewBalanceInf" />
    		<el-form :model="interestRateInfo" >
	            <el-form-item class="cl_td" label="统一利率 " prop="idType">
	                <el-input v-model="interestRateInfo.interestRate" class="wd200" type="text"/>
	            </el-form-item>
            </el-form>
            <div class="clearboth"></div>
            <div slot="footer" class="cl_tr text_center">
                <el-button type="primary" @click="subInfo()">保存</el-button>
            </div>
	    </div>
    	<el-dialog title="余额对象明细" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail" :rules="rulesDetail" :model="tempDetail" >
              	<el-form-item class="cl_td" label="账户号" prop="accountId">
                    <el-input v-model="tempDetail.accountId" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="币种" prop="currencyCode">
                    <el-input v-model="tempDetail.currencyCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="余额对象代码 " prop="balanceObjectCode">
                    <el-input v-model="tempDetail.balanceObjectCode" class="wd200" type="text" readonly />
                </el-form-item>
               	<el-form-item class="cl_td" label="余额 " prop="balance">
                    <el-input v-model="tempDetail.balance" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="累计利息 " prop="accumulatedInterest">
                    <el-input v-model="tempDetail.accumulatedInterest" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="当期最低还款 " prop="currentDue">
                    <el-input v-model="tempDetail.currentDue" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="生效利率 " prop="interestRate">
                    <el-input v-model="tempDetail.interestRate" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="利率变更标志 " prop="rateChangeFlag">
                    <el-input v-model="tempDetail.rateChangeFlag" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="pending生效利率  " prop="pendingInterestRate">
                    <el-input v-model="tempDetail.pendingInterestRate" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="溢缴款利率变动标志 " prop="overpayRateChangeFlag">
                    <el-input v-model="tempDetail.overpayRateChangeFlag" class="wd200" type="text" readonly />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleDetail = false"> 关闭</el-button>
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
        		isShow: false,
	           	showDiv: false,
	           	showMedium: false,
	            logininfo: '',
	            templateRadio: false,
	            // 列表
	            queryForm: {
	                pageNum: 1,
	                pageSize:10,
	            },
	            cancelInfo: {},
	            mediumInfo: {},
	            listLoading: false,
	            queryFormRef: {},
	            queryFormRules: {},      
	            tableList: [],
	            tableTotal: 0,
	            list_formatCode: '',
	            newCard: '',
	            // 下拉框
	            idTypeList: [],//证件类型
	           	//余额对象信息
	            balancePage:{
	            	pageNum: 1,
	                pageSize:10,
	            }, 
	            balanceTotal: 0,
	            balanceListLoading: false,
	            balanceInfo: [],
	            //查看余额对象信息
	            tempDetail: {},
	            dialogFormVisibleDetail:false,
	            dataFormDetail: {},
	            rulesDetail: {},
	            interestRateInfo: {},
	            
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
        //列表
        getList() {
            this.listLoading = true
            this.showDiv = true
           	let  params = {
            	isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_accountOrganForm','dic_businessDebitCreditCode','dic_accStatusCode'],//查找数据字典所需参数
				transDict : ['accountOrganForm','businessDebitCreditCode','statusCode'],//翻译前后key
            }
            params = Object.assign(params, this.queryForm)
           	this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0003', params	,(res) => {
           		this.listLoading = false
           		if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                		this.tableList = res.returnData.rows;
                		this.tableTotal = res.returnData.totalCount;
                		this.tableList.forEach(item=>{
                			item.currencyCodeDesc = item.currencyCode+ ''+item.currencyDesc
                			item.productObjectCodeDesc = item.productObjectCode+ ''+item.productDesc
                			
                		})
					}
                }
            })
        },
        //账户余额对象信息
        viewBalanceInf(row){
        	this.isShow = true
           	let obj1 = {
           		accountId: row.accountId,
           		currencyCode: row.currencyCode,
           		idNumber: this.queryForm.idNumber,
				idType: this.queryForm.idType,
	    		externalIdentificationNo: this.queryForm.externalIdentificationNo,
	    		isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_rateChangeFlag','dic_overpayRateChangeFlag'],//查找数据字典所需参数
				transDict : ['rateChangeFlag','overpayRateChangeFlag'],//翻译前后key
           	}
           	this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0068',obj1,(res) => {
           		this.balanceListLoading = false
           		if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                		this.balanceInfo = res.returnData.rows;
                		this.balanceTotal = res.returnData.totalCount;
                		this.balanceInfo.forEach(item=>{
                			item.currencyCodeDesc = item.currencyCode+ ''+item.currencyDesc
                		})
         			}
                }
            })
        },
        //查看账户余额信息明细
      	seeBalanceInf(row){
  		 	this.dialogFormVisibleDetail = true
	      	this.tempDetail = Object.assign({}, row) // 
     	 	this.$nextTick(() => {
		        this.$refs['dataFormDetail'].clearValidate()
	      	})
      	},
	   	//保存
	    subInfo(){
	    	if(!this.interestRateInfo.interestRate){
	    		this.$message('请输入统一利率')
	    	}
	    	let  obj2={
	    		accountId: this.balanceInfo[0].accountId,
				currencyCode: this.balanceInfo[0].currencyCode,
				interestRate: this.interestRateInfo.interestRate,
				idNumber: this.queryForm.idNumber,
				idType: this.queryForm.idType,
	    		externalIdentificationNo: this.queryForm.externalIdentificationNo,
	    		interestRate: this.interestRateInfo.interestRate,
	    	}
	    	this.post('/nonfi/nonfinanceService/BSS.OP.01.0030', obj2,(res) => {
	            if (res.returnCode == '000000') {
                 	this.$notify({
                        title: 'Success',
                        message: '保存成功',
                        type: 'success',
                        duration: 2000
                    })
                    this.getList()
                    this.showDiv = false
                    this.isShow = false
	            }
	        })
	       
	    },
    }
}
</script>

<style>
</style>

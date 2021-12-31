<!-- 新增成本中心 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
    	<el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
	       	<el-form-item class="cl_td" label="社会信用代码" prop="socialCreditCode">
            	<el-input v-model="queryFormObj.socialCreditCode" class="wd200" type="text"/>
        	</el-form-item>
    		<div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()">查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="addInfo()">新增</el-button>
            </div>
    	</el-form> 
    	<!--成本中心客户列表-->
	 	<div v-if="showList">
	     	<el-table v-loading = "listLoading" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
	            <el-table-column prop="socialCreditCode" label="证件号码" align="center" />
	            <el-table-column prop="statusCodeDesc" label="状态" align="center" />
	            <el-table-column prop="billDay" label="账单日" align="center" />
	            <el-table-column prop="statementFlagDesc" label="是否出账单" align="center" />
	            <el-table-column prop="corporationVipFlagDesc" label="是否VIP公司" align="center" />
	            <el-table-column prop="registerDate" label="注册时间" align="center" />
	        </el-table>
        	<pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
	    </div>
    	<div v-if="showDiv">
    		<div class="text_title">成本中心基础信息</div>
	        <el-form ref="detaRefAdd" :model="tempAdd" :rules="detaRulesAdd">
	        	<el-form-item class="cl_td" label="所属机构" prop="organNo"
	        		:rules="[ { required: true, message: '所属机构不能为空'}]">
                    <el-select v-model="tempAdd.organNo" class="wd200">
	                    <el-option v-for="(item, index) in institutionIdOptions" 
	                    	:key="index" 
	                    	:label="item.organName" 
	                    	:value="item.codes" />
	                </el-select>
				</el-form-item>
				<el-form-item class="cl_td" label="状态" prop="statusCode">
                    <el-select v-model="tempAdd.statusCode" class="wd200">
	                    <el-option v-for="(item, index) in statusCodeOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
				</el-form-item>
				<el-form-item class="cl_td" label="证件类型" prop="idType"
					:rules="[ { required: true, message: '证件类型不能为空'}]">
                   	<el-select v-model="tempAdd.idType" class="wd200" >
	                    <el-option v-for="(item, index) in idTypeOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
				</el-form-item>
	        	<el-form-item class="cl_td" label="证件号码" prop="socialCreditCode"
	        		:rules="[ { required: true, message: '证件号码不能为空'}]">
	            	<el-input v-model="tempAdd.socialCreditCode" class="wd200" type="text" />
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="是否可发个人承债商务卡" prop="personalDutyFlag">
                   	<el-select v-model="tempAdd.personalDutyFlag" class="wd200" >
	                    <el-option v-for="(item, index) in personalDutyFlagOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
				</el-form-item>
	        	<el-form-item class="cl_td" label="是否可发行公司承债商务卡" prop="corporationDutyFlg">
                   	<el-select v-model="tempAdd.corporationDutyFlg" class="wd200" >
	                    <el-option v-for="(item, index) in corporationDutyFlgOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
				</el-form-item>
	        	<el-form-item class="cl_td" label="基本账户开户银行" prop="baseIssueBank">
	            	<el-input v-model="tempAdd.baseIssueBank" class="wd200" type="text" />
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="基本账户号" prop="baseAccount">
	            	<el-input v-model="tempAdd.baseAccount" class="wd200" type="text" />
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="外汇账户开户银行" prop="fxIssueBank">
	            	<el-input v-model="tempAdd.fxIssueBank" class="wd200" type="text" />
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="外汇账户账号" prop="fxAccount">
	            	<el-input v-model="tempAdd.fxAccount" class="wd200" type="text" />
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="账单日" prop="billDay"
					:rules="[ { required: true, message: '账单日不能为空'}]">
                   	<el-select v-model="tempAdd.billDay" class="wd200" >
	                    <el-option v-for="(item, index) in billDayOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
				</el-form-item>
	        	<el-form-item class="cl_td" label="是否可以出单" prop="statementFlag">
                   	<el-select v-model="tempAdd.statementFlag" class="wd200" >
	                    <el-option v-for="(item, index) in statementFlagOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
				</el-form-item>
	        	<el-form-item class="cl_td" label="是否VIP公司" prop="corporationVipFlag">
                   	<el-select v-model="tempAdd.corporationVipFlag" class="wd200" >
	                    <el-option v-for="(item, index) in corporationVipFlagOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
				</el-form-item>
	        	<el-form-item class="cl_td" label="注册时间" prop="registerDate">
                    <el-date-picker class="wd200"
                        v-model="tempAdd.registerDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期">
                    </el-date-picker>
				</el-form-item>
	        	<el-form-item class="cl_td" label="行业" prop="industry">
                   	<el-select v-model="tempAdd.industry" class="wd200" >
	                    <el-option v-for="(item, index) in industryOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
				</el-form-item>
	        	<el-form-item class="cl_td" label="公司种类" prop="corporationCategory">
                   	<el-select v-model="tempAdd.corporationCategory" class="wd200" >
	                    <el-option v-for="(item, index) in corporationCategoryOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
				</el-form-item>
	        	<el-form-item class="cl_td" label="员工人数" prop="employeeNumber">
	            	<el-input v-model="tempAdd.employeeNumber" class="wd200" type="text" />
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="资金总额" prop="totalAssets">
	            	<el-input v-model="tempAdd.totalAssets" class="wd200" type="text" />
	        	</el-form-item>
	        </el-form>
            <div class="cl_tr text_center">
	            <el-button size="medium" icon="el-icon-plus" type="primary" @click="subDetaInfo()" >保存</el-button>
	        </div>
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
                stBtnFlag: false,
                showDiv: false,
                showList: false,
                queryFormObj: {
                	pageNum: 1,
                	pageSize:10,
                },
                queryFormRules: {},
                queryFormRef: {}, 
                //基本信息
               	detaRefAdd: {},
               	tempAdd: {
               		statusCode: "1",
			        idType : "1",
			        personalDutyFlag : "Y",
			       	corporationDutyFlg : "Y",
			        statementFlag : "Y",
			       	corporationVipFlag :"Y",
               	},
               	detaRulesAdd: {},
               	//列表
               	tableTotal: 0,
               	listLoading: false,
               	tableList: [],
               	queryInfo: {},
               	inforData: {},
                // 下拉框
                institutionIdOptions: [],//所属机构
                statusCodeOptions: [],//状态
                idTypeOptions: [],//证件类型
                personalDutyFlagOptions: [],//是否可发个人承债商务卡
                corporationDutyFlgOptions: [],//是否可发公司承债商务卡
                billDayOptions: [],//账单日
                statementFlagOptions:[],//是否出单
                industryOptions: [],//行业
                activationFlagOptions: [],//激活标识
                activationModeOptions: [],//激活方式
               
            }
        },
        created() {
            
        },
        mounted() {
            this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))  //获取用户登录权限
           	this.getBtnAuth()
           	//所属机构
			this.getSelectDict('/beta/betaService/COS.IQ.02.0005').then((res) => {
        		this.institutionIdOptions = res
    		})
			//状态
			this.getSelectDict('dic_status').then((res) => {
        		this.statusCodeOptions = res
    		})
			//证件类型
			this.getSelectDict('dic_compaIdType').then((res) => {
        		this.idTypeOptions = res
    		})
           	//是否可发个人承债商务卡
           	this.getSelectDict('dic_isYorN').then((res) => {
        		this.personalDutyFlagOptions = res
    		})
           	//是否可发公司承债商务卡
           	this.getSelectDict('dic_isYorN').then((res) => {
        		this.corporationDutyFlgOptions = res
    		})
           	//账单日
       		this.getSelectDict('dic_billDay').then((res) => {
        		this.billDayOptions = res
    		})
           	//是否出单
           	this.getSelectDict('dic_isYorN').then((res) => {
        		this.statementFlagOptions = res
    		})
           	//是否VIP公司
           	this.getSelectDict('dic_isYorN').then((res) => {
        		this.corporationVipFlagOptions = res
    		})
           	//行业
           	this.getSelectDict('dic_industry').then((res) => {
        		this.industryOptions = res
    		})
           	//公司种类
           	this.getSelectDict('dic_corporationCategory').then((res) => {
        		this.corporationCategoryOptions = res
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
	                    if (this.btnAuthStr.includes('OCS.AD.01.0002')) { //停用
	                        this.stBtnFlag = true;
	                    } else {
	                        this.stBtnFlag = false
	                    }
	                   
	                }
	            }
	        })
	    },
      	handleSearch(){
      		if (this.queryFormObj.socialCreditCode == '' || this.queryFormObj.socialCreditCode == undefined 
      			|| this.queryFormObj.socialCreditCode == null) {
				this.$message('请输入查询条件'); 
				return;
			} 
			this.getList()
      	},
      	//成本中心客户列表
      	getList(){
      		this.listLoading = true  
      		this.showList = true
      		this.showDiv = false
      		let params ={
      			socialCreditCode: this.queryFormObj.socialCreditCode,
	   			pageNum:  this.queryFormObj.pageNum,
	        	pageSize:  this.queryFormObj.pageSize,
	        	
	       	}
      		this.post('/nonfi/nonfinanceService/CCS.IQ.01.0001', params, (res) => {
   				this.listLoading = false
       			if(res.returnCode == '000000') {
       			 	if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
						this.tableList = res.returnData.rows
						this.tableTotal = res.returnData.totalCount
						this.tableList.forEach(item=>{
							if(item.statusCode=='1'){
							item.statusCodeDesc='正常'
							}else if(item.statusCode=='0'){
								item.statusCodeDesc='关闭'
							}
							if(item.statementFlag=='Y'){
							item.statementFlagDesc='是'
							}else if(item.statementFlag=='N'){
								item.statementFlagDesc='否'
							}
							if(item.corporationVipFlag=='Y'){
							item.corporationVipFlagDesc='是'
							}else if(item.statementFlag=='N'){
								item.corporationVipFlagDesc='否'
							}
						})
					}
	            }else{
	            	this.showList = false
	            }
        	})
      	},
      	//新增
      	addInfo(){
      		this.showList = false
      		this.showDiv = true
      	},
      	//保存
       	subDetaInfo(){
       		this.tempAdd.institutionId = this.tempAdd.organNo
       		this.post('/nonfi/nonfinanceService/OCS.OP.01.0002', this.tempAdd, (res) => {
				if (res.returnCode == '000000') {
						this.$notify({
						title: 'Success',
						message: '保存成功',
						type: 'success',
						duration: 2000
					}) 
					this.getList() 
					this.showDiv = false
				}
            })
	    },
       
   	}
}
</script>
<style>
</style>

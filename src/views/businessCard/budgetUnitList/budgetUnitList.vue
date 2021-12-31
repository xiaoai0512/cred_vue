<!-- 预算单位维护 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
    	<el-form ref="topParamsRef" :model="topParams" :rules="topParamsRules">
	       	<el-form-item class="cl_td" label="预算单位编码" prop="idNumber">
            	<el-input v-model="topParams.idNumber" class="wd200" type="text"/>
        	</el-form-item>
    		<el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
            	<el-input v-model="topParams.externalIdentificationNo" class="wd200" type="text"/>
        	</el-form-item>
        	 <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()">查询</el-button>
                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="reset(topParams)">重置</el-button>
            </div>
    	</el-form>  
    	<div v-if="showDiv">
	        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
	            <div class="text_title">1. 预算单位基础信息</div>
	        	<el-form-item class="cl_td" label="机构号" prop="institutionId"
	        		:rules="[ { required: true, message: '机构号不能为空'}]">
	                <el-select v-model="queryFormObj.institutionId" class="wd200" disabled   readonly>
	                    <el-option v-for="(item, index) in institutionIdOptions" 
	                    	:key="index" 
	                    	:label="item.organName" 
	                    	:value="item.organNo" />
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="客户名称" prop="customerName"
	            	:rules="[ { required: true, message: '客户名称不能为空'}]">
	            	<el-input v-model="queryFormObj.customerName" class="wd200" type="text" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="证件类型" prop="idType">
	                <el-select v-model="queryFormObj.idType" class="wd200" disabled>
	                    <el-option v-for="(item, index) in idTypeList" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="证件号码" prop="idNumber"
	            	:rules="[ { required: true, message: '证件号码不能为空'}]">
	                <el-input v-model="queryFormObj.idNumber" class="wd200" type="text" readonly/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="客户类型" prop="customerType">
	                <el-select v-model="queryFormObj.customerType" class="wd200">
	                    <el-option v-for="(item, index) in customerTypeOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="账单日" prop="billDay"
	            	:rules="[ { required: true, message: '账单日不能为空'}]">
	                <el-select v-model="queryFormObj.billDay" class="wd200">
	                    <el-option v-for="(item, index) in billDayOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
	            </el-form-item>
				<div class="text_title">2. 预算单位附加信息</div>
	        	<el-form-item class="cl_td" label="预算管理层级" prop="manageLevelCode"
	        		:rules="[ { required: true, message: '预算管理层级不能为空'}]">
	                <el-select v-model="queryFormObj.manageLevelCode" class="wd200" disabled>
	                    <el-option v-for="(item, index) in manageLevelCodeOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="单位公务卡总授信额度" prop="orgAllQuota"
	            	:rules="[ { required: true, message: '单位公务卡总授信额度不能为空'}]">
	            	<el-input v-model="queryFormObj.orgAllQuota" class="wd200" type="text"/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="个人公务卡最大授信额度" prop="personMaxQuota"
	        		:rules="[ { required: true, message: '个人公务卡最大授信额度不能为空'}]">
	               <el-input v-model="queryFormObj.personMaxQuota" class="wd200" type="text"/>
	            </el-form-item>
            </el-form>
            <el-form ref="coreCoreCustomerFormRef" :model="coreCoreCustomerForm" :rules="coreCoreCustomerFormRules">
	            <div class="text_title">3. 预算单位地址</div>
	        	<el-form-item class="cl_td" label="地址类型" prop="type">
	                <el-select v-model="coreCoreCustomerForm.type" class="wd200" disabled>
	                    <el-option v-for="(item, index) in typeOptions"
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes"/>
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="联系地址" prop="contactAddress" 
	            	:rules="[ { required: true, message: '联系地址不能为空'}]">
	            	<el-input v-model="coreCoreCustomerForm.contactAddress" class="wd200" type="text" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="联系邮编" prop="contactPostCode"
	        		:rules="[ { required: true, message: '联系邮编不能为空'}]">
	        		<el-input v-model="coreCoreCustomerForm.contactPostCode" class="wd200" type="text" readonly/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="指定电话" prop="contactMobilePhone"
	            	:rules="[ { required: true, message: '指定电话不能为空'}]">
	            	<el-input v-model="coreCoreCustomerForm.contactMobilePhone" class="wd200" type="text" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="所在城市" prop="city"
	        		:rules="[ { required: true, message: '所在城市不能为空'}]">
	            	<el-input v-model="coreCoreCustomerForm.city" class="wd200" type="text" readonly/>
	        	</el-form-item>
        	</el-form>
	        <div class="cl_tr text_center">
	            <el-button size="medium" icon="el-icon-circle-plus-outline" type="primary" @click="subData()" >保存</el-button>
	            <el-button size="medium" icon="el-icon-d-arrow-left" type="primary" @click="goback()" >返回</el-button>
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
                // 列表
                topParams: {},
                topParamsRules: {},
                topParamsRef: {},
                showDiv: false,
                queryFormObj: {
                    pageNum: 1,
                    pageSize:10,
                },
                coreCoreCustomerForm: {},
                coreCoreCustomerFormRef: {},
                coreCoreCustomerFormRules: {},
               	queryFormRules: {},
                // 下拉框
                institutionIdOptions: [],//机构号
                idTypeList: [],//证件类型
                customerTypeOptions  : [],//客户类型
               	billDayOptions: [],//账单日
                manageLevelCodeOptions: [],//预算管理层级
                typeOptions: [],//地址类型
            }
        },
        created() {
            
        },
        mounted() {
            this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))  //获取用户登录权限
           	//机构号
           	this.getSelectDict( "/beta/betaService/COS.IQ.02.0005").then(res => {
                this.institutionIdOptions = res
            })
           	//证件类型
            this.getSelectDict( "dic_busiCardCertificateType").then(res => {
                this.idTypeList = res
            })
           	//账单日
            this.getSelectDict( "dic_billDay").then(res => {
                this.billDayOptions = res
            })
            //预算管理层级
            this.getSelectDict( "dic_busiCardManageLevel").then(res => {
                this.manageLevelCodeOptions = res
            })
            //地址类型
            this.getSelectDict( "dic_busiCardAddressType").then(res => {
				console.log(res)
                this.typeOptions = res
			})
			//客户类型
			this.getSelectDict( "dic_busiCardCustomerType").then(res => {
				console.log(res)
				this.customerTypeOptions = res
			})
        },
      methods: {
      	reset(){
      		this.topParams = {}
      	},
      	handleSearch(){
			  this.queryFormObj = {}
      		if(this.topParams.idNumber){
				if(this.topParams.externalIdentificationNo == '' ||this.topParams.externalIdentificationNo == undefined || 
						this.topParams.externalIdentificationNo == null || this.topParams.externalIdentificationNo == 'null'	
				){
					this.topParams.idType = '7';//预算单位类型
					
				}else {
					 this.$message('查询条件，输入一个即可！')
					 return;
                }
            }else if(this.topParams.externalIdentificationNo && this.topParams.idNumber){
            	
				 this.$message('查询条件，输入一个即可！')
				 return;
           	}
           	this.post('/nonfi/nonfinanceService/OCS.IQ.01.0001', this.topParams, (res) => {
           		if(res.returnCode == '000000') {
					this.showDiv = true
                    this.queryFormObj = res.returnData.rows[0];
                   	if(res.returnData.customerType == '3'){
                   		this.queryFormObj.customerType = '预算单位'
					   }
					this.coreCoreCustomerForm = res.returnData.rows[0].coreCoreCustomerAddrs[0]
					this.coreCoreCustomerForm.type = '3'
					this.$forceUpdate()
                }else{
					this.showDiv = false
				}
            },(err) => {
				this.showDiv = false
				this.queryFormObj = {}
			})
      	},
      	//监听证件类型
      	// idTypeListChange(row){
      	// 	this.idTypeListData = row
      	// 	this.getCustomerType()
      	// },
      	//  //客户类型
      	//  getCustomerType(){
            
      	// },
      	//保存
       	subData(){
       		this.$refs['queryFormRef'].validate((valid) => {
                if (valid) {
		       		if(this.queryFormObj.idNumber.length <6 || this.queryFormObj.idNumber.length >15){
				 		this.$message({
				            message: '证件号码6~15位',
				            type: 'warning'
			          	})
						return;
					}
		       		let addressList = []
		       		
		       		addressList.push(this.coreCoreCustomerForm);
		       		let obj = {}
		       		obj.coreCoreCustomerAddrs = addressList
		       		obj =  Object.assign(this.queryFormObj,obj)
		       		this.post('/nonfi/nonfinanceService/OCS.UP.01.0001', obj, (res) => {
						if (res.returnCode == '000000') {
							 this.$notify({
								message: '保存成功',
								type: 'success',
							}) 
							this.showDiv = false
						}
		               
		            })
	       		}
       		})
        },
        goback(){
        	this.showDiv = false
        },
   	}
}
</script>
<style>
</style>

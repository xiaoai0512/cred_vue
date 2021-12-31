<!-- 预算单位建立 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <div class="text_title">1. 预算单位基础信息</div>
        	<el-form-item class="cl_td" label="机构号" prop="institutionId"
        		:rules="[ { required: true, message: '机构号不能为空'}]">
                <el-select v-model="queryFormObj.institutionId" class="wd200">
                    <el-option v-for="(item, index) in institutionIdOptions" 
                    	:key="index" 
                    	:label="item.organName" 
                    	:value="item.organNo" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="客户名称" prop="customerName"
            	:rules="[ { required: true, message: '客户名称不能为空'}]">
            	<el-input v-model="queryFormObj.customerName" class="wd200" type="text"/>
        	</el-form-item>
        	<el-form-item class="cl_td" label="证件类型" prop="idType"
        		:rules="[ { required: true, message: '证件类型不能为空'}]">
                <el-select v-model="queryFormObj.idType" class="wd200" @change="idTypeListChange($event)">
                    <el-option v-for="(item, index) in idTypeList" 
                    	:key="index" 
                    	:label="item.detailDesc" 
                    	:value="item.codes" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="证件号码" prop="idNumber"
            	:rules="[ { required: true, message: '证件号码不能为空'}]">
                <el-input v-model="queryFormObj.idNumber" class="wd200" type="text" />
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
                <el-select v-model="queryFormObj.manageLevelCode" class="wd200">
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
            <div class="text_title">3. 预算单位地址</div>
        	<el-form-item class="cl_td" label="地址类型" prop="type"
        		:rules="[ { required: true, message: '地址类型不能为空'}]">
                <el-select v-model="queryFormObj.type" class="wd200">
                    <el-option v-for="(item, index) in typeOptions" 
                    	:key="index" 
                    	:label="item.detailDesc" 
                    	:value="item.codes" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="联系地址" prop="contactAddress" 
            	:rules="[ { required: true, message: '联系地址不能为空'}]">
            	<el-input v-model="queryFormObj.contactAddress" class="wd200" type="text"/>
        	</el-form-item>
        	<el-form-item class="cl_td" label="联系邮编" prop="contactPostCode"
        		:rules="[ { required: true, message: '联系邮编不能为空'}]">
        		<el-input v-model="queryFormObj.contactPostCode" class="wd200" type="text"/>
            </el-form-item>
            <el-form-item class="cl_td" label="指定电话" prop="contactMobilePhone"
            	:rules="[ { required: true, message: '指定电话不能为空'}]">
            	<el-input v-model="queryFormObj.contactMobilePhone" class="wd200" type="text"/>
        	</el-form-item>
        	<el-form-item class="cl_td" label="所在城市" prop="city"
        		:rules="[ { required: true, message: '所在城市不能为空'}]">
            	<el-input v-model="queryFormObj.city" class="wd200" type="text"/>
        	</el-form-item>
	        <div class="cl_tr text_center">
	            <el-button size="medium" icon="el-icon-search" type="primary" @click="subData()" >保存</el-button>
	           <!-- <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate" >新增</el-button>-->
	        </div>
        </el-form>
        
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
                btnAuthStr: '',
                templateRadio: false,
                logininfo: '',
                // 列表
                showDiv: false,
                queryFormObj: {},
                queryFormRef: {},
                queryFormRules: {},      
                tableList: [],
                tableTotal: 0,
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
           /* //客户类型
            this.getSelectDict( "dic_busiCardCustomerType").then(res => {
                this.customerTypeOptions = res
            })*/
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
                this.typeOptions = res
            })
        },
      methods: {
      	idTypeListChange(row){
      		this.idTypeListData = row
      		this.getCustomerType()
      	},
      	 //客户类型
      	 getCustomerType(){
            this.getSelectDict( "dic_busiCardCustomerType").then(res => {
            	if(this.idTypeListData == '7'){
            		this.queryFormObj.customerType = '3'
            		this.customerTypeOptions = res
            	}
            })
      	},
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
		       		let addressObj = {}
		       		let addressList = []
		       		addressObj.type = this.queryFormObj.type   
		       		addressObj.contactAddress = this.queryFormObj.contactAddress
		       		addressObj.contactPostCode = this.queryFormObj.contactPostCode
		       		addressObj.contactMobilePhone = this.queryFormObj.contactMobilePhone
		       		addressObj.city = this.queryFormObj.city
                    addressList.push(addressObj);
                    delete this.queryFormObj.type;
                    delete this.queryFormObj.contactAddress;
                    delete this.queryFormObj.contactPostCode;
                    delete this.queryFormObj.contactMobilePhone;
                    delete this.queryFormObj.city;
		       		let obj = {}
		       		obj.coreCoreCustomerAddrs = addressList
                    obj =  Object.assign(this.queryFormObj,obj)
		       		this.post('/nonfi/nonfinanceService/OCS.AD.01.0001', obj, (res) => {
                           
                        if (res.returnCode == '000000') {
                            this.$notify({
                                message: '保存成功',
                                type: 'success',
                            }) 
                            this.queryFormObj = {}
                        }
		               
		            })
	       		}
       		})
        },
   	}
}
</script>
<style>
</style>

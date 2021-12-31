<!-- 消费验密设置 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
          	<el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                <el-input v-model="queryFormObj.externalIdentificationNo" class="wd200" type="text" />
            </el-form-item>
          	<div class="cl_tr text_center" >
               <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" >确定</el-button>
         	</div>
        </el-form>
        <div v-if="showForm">
            <el-form ref="dataFormAdd" :model="tempAdd" :rules="rulesAdd">
           		<el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
	                <el-input v-model="tempAdd.externalIdentificationNo" class="wd200 " type="text"/>
	            </el-form-item>
	           	<div class="clearboth"></div>
	           	<el-form-item class="cl_td" label="验密开关" prop="verifyPswFlag">
	                <el-select v-model="tempAdd.verifyPswFlag" class="wd200">
	                    <el-option v-for="(item, index) in verifyPswFlagOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes"/>
	                </el-select>
            	</el-form-item>
	            <div class="clearboth"></div>
	            <el-form-item class="cl_td" label="小额免密开关" prop="smallAvoidPswFlag">
	                <el-select v-model="tempAdd.smallAvoidPswFlag" class="wd200">
	                    <el-option v-for="(item, index) in smallAvoidPswFlagOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes"/>
	                </el-select>
            	</el-form-item>
	           	<div class="cl_tr text_center" >
              		<el-button size="medium" icon="el-icon-search" type="primary" @click="subData()" >确定</el-button>
              		<el-button size="medium" icon="el-icon-search" type="primary" @click="closeInfo()" >关闭</el-button>
         		</div>
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
            // 列表
            showForm: false,
            newOperationMode: '',
            queryFormObj: {},
            queryFormRules: {},
            tempForm: {},
           	// 下拉框
            typeOptions: [],//改密类型
            algorithmTypeOptions: [],//算法类型
            verifyPswFlagOptions: [],//验密开关
            smallAvoidPswFlagOptions: [],//小额免密开关
            //修改密码
            dialogFormVisibleDetail: false,
            tempAdd: {},
            rulesAdd: {},
            dataFormAdd: {},
        }
    },
    created() {
       let logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))
        this.operationMode = logininfo.operationMode
        this.corporationEntityNo = logininfo.corporationEntityNo
       
    },
    mounted() {
       	//改密类型
        this.getSelectDict('dic_passType').then((res) => {
            this.typeOptions = res
        })
        //算法类型
        this.getSelectDict('dic_algorithmType').then((res) => {
            this.algorithmTypeOptions = res
        })
        //免密开关
        this.getSelectDict('dic_isYorN').then((res) => {
            this.verifyPswFlagOptions = res
        })
        //小额免密开关
        this.getSelectDict('dic_isYorN').then((res) => {
            this.smallAvoidPswFlagOptions = res
        })
    },
    methods: {
    	//查询
        handleSearch() {
            if(!this.queryFormObj.externalIdentificationNo || !this.queryFormObj.externalIdentificationNo || !this.queryFormObj.externalIdentificationNo) {
                this.$message({
                    message: '请输入查询信息',
                    type: 'warning'
                })
                return
            }else{
            	this.queryFormObj.authDataSynFlag = '1'
            	this.post('/auth/authService/AUS.IQ.01.0002', this.queryFormObj, (res) => {
		           	if (res.returnCode == '000000') {
		                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
		                	this.tempAdd.externalIdentificationNo = this.queryFormObj.externalIdentificationNo
            				this.showForm=true
		                    this.tempForm = res.returnData.rows
		                }
		            }
	        	})
            }
        },
       	closeInfo(){
        	this.showForm=false
        },
       	subData(){
       		this.tempAdd.authDataSynFlag = '1'
       		this.tempForm = Object.assign ( this.tempForm, this.tempAdd ) 
       		this.post('/auth/authService/AUS.OP.01.0008', this.tempForm, (res) => {
                if (res.returnCode == '000000') {
                    this.$notify({
                        title: 'Success',
                        message: '设置成功',
                        type: 'success',
                        duration: 2000
                    })
                    this.queryFormObj = {}
                    this.showForm = false
                }
        	})
       	},
    }
}   
</script>
<style>
.w-input{
    width: 70px !important;
    display: inline-block;
    padding-right: 5px;
}
</style>

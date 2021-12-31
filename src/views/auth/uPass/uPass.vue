<!-- 客户设置密码 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
          	<el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                <el-input v-model="queryFormObj.externalIdentificationNo" class="wd200" type="text" />
            </el-form-item>
          	<el-form-item class="cl_td" label="有效期(MMYY)：" prop="expirationDate">
                <el-input v-model="queryFormObj.expirationDate" class="wd200" type="text" maxlength="4"/>
            </el-form-item>
            <el-form-item class="cl_td" label="改密类型" prop="type">
                <el-select v-model="queryFormObj.type" class="wd200" clearable>
                    <el-option v-for="(item, index) in typeOptions" 
                    	:key="index" 
                    	:label="item.detailDesc" 
                    	:value="item.codes"/>
                </el-select>
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
	            <el-form-item class="cl_td" label="有效期" prop="expirationDate">
	                <el-input v-model="tempAdd.expirationDate" class="wd200 " type="text"/>
	            </el-form-item>
	            <div class="clearboth"></div>
	           	<el-form-item class="cl_td" label="算法类型" prop="algorithmType">
                <el-select v-model="tempAdd.algorithmType" class="wd200">
                    <el-option v-for="(item, index) in algorithmTypeOptions" 
                    	:key="index" 
                    	:label="item.detailDesc" 
                    	:value="item.codes"/>
                </el-select>
            </el-form-item>
	            <div class="clearboth"></div>
	            <el-form-item class="cl_td" label="旧密码" prop="previousPssOff" v-if='queryFormObj.type=="1"'
	            	:rules="[{required: true, message: '旧密码不能为空'},
	            	{ min: 6, max: 6, message: '长度在 6个字符', trigger: 'blur' }]">
	                <el-input v-model="tempAdd.previousPssOff" class="wd200" type="text"/>
	            </el-form-item>
	            <div class="clearboth"></div>
	            <el-form-item class="cl_td" label="新密码" prop="pssOff" 
	            	:rules="[{required: true, message: '新密码不能为空'},
	            	{ min: 6, max: 6, message: '长度在 6个字符', trigger: 'blur'}]">
	                <el-input v-model="tempAdd.pssOff" class="wd200" type="text"/>
	            </el-form-item>
	            <div class="clearboth"></div>
	            <el-form-item class="cl_td" label="新密码确认 " prop="pssOffConfirm" 
	            	:rules="[{required: true, message: '新密码确认 不能为空'},
	            	{ min: 6, max: 6, message: '长度在 6个字符', trigger: 'blur' }]">
	                <el-input v-model="tempAdd.pssOffConfirm" class="wd200" type="text" />
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
           	// 下拉框
            typeOptions: [],//改密类型
            algorithmTypeOptions: [],//算法类型
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
    },
    methods: {
    	//查询
        handleSearch() {
            if(!this.queryFormObj.externalIdentificationNo && !this.queryFormObj.expirationDate && !this.queryFormObj.type) {
                this.$message({
                    message: '请输入查询信息',
                    type: 'warning'
                })
                return
            } else if(!this.queryFormObj.expirationDate) {
                this.$message({
                    message: '请输入有效期(MMYY)',
                    type: 'warning'
                })
                return
            } else if(!this.queryFormObj.type) {
                this.$message({
                    message: '请输入改密类型',
                    type: 'warning'
                })
                return
            }
            this.tempAdd.externalIdentificationNo = this.queryFormObj.externalIdentificationNo
            this.tempAdd.expirationDate = this.queryFormObj.expirationDate
        	this.showForm=true
        },
        closeInfo(){
        	this.showForm=false
        },
       	subData(){
       		this.tempAdd.authDataSynFlag = '1'
       		this.post('/auth/authService/AUS.OP.01.0007', this.tempAdd, (res) => {
                if (res.returnCode == '000000') {
                    this.$notify({
                    title: 'Success',
                    message: '设置成功',
                    type: 'success',
                    duration: 2000
                    })
                    this.showForm = false
                    this.tempAdd = {}
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

<!-- 实时余额平衡查询 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryForm" :rules="queryFormRules">
        	<el-form-item class="cl_td" label="证件类型" prop="idType" >
                <el-select v-model="queryForm.idType" class="wd200">
                <el-option v-for="(item, index) in idTypeList" 
                	:key="index" 
                	:label="item.detailDesc" 
                	:value="item.codes" />
                </el-select>
            </el-form-item>
           	<el-form-item class="cl_td" label="证件号码" prop="idNumber">
                <el-input v-model="queryForm.idNumber" class="wd200" type="text"/>
            </el-form-item>
            <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                <el-input v-model="queryForm.externalIdentificationNo" class="wd200" type="text"/>
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" >查询</el-button>
                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="reset()" >重置</el-button>
            </div>
        </el-form>
        <div v-if="showList"> 
	        <el-table v-loading = "listLoading1" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
	            <el-table-column prop="customerNo" label="客户号" align="center" width="150px"/>
	            <el-table-column prop="occurrDate" label="系统处理日期" align="center" />
	            <el-table-column prop="eventNo" label="事件编号" align="center" />
	            <el-table-column prop="activityNo" label="活动编号" align="center" />
	            <el-table-column prop="relativeTableName" label="表ID" align="center" />
	            <el-table-column prop="relativeTableId" label="记录ID" align="center" />
	            <el-table-column prop="effectFlag" label="处理状态" align="center" />
	        	<el-table-column prop="declineRsn" label="失败原因" align="center" />
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
        	//权限
        	logininfo: '',
            // 列表
            queryForm: {
                pageNum: 1,
                pageSize:10,
            },
            listLoading1: false,
            queryFormRef: {},
            queryFormRules: {},      
            tableList: [],
            tableTotal: 0,
            showList: false,
          	//下拉
            idTypeList: [],
           
        }
    },
    created() {
        
    },
    mounted() {
        this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))  //获取用户登录权限
		//证件类型
		this.getSelectDict('dic_certificateType').then((res) => {
            this.idTypeList = res
        })
		//运营模式
		this.getSelectDict( "/beta/betaService/COS.IQ.02.0006").then(res => {
            this.operationModeOptions = res
        })
	},
    methods: {
    	//重置
        reset(){
        	this.queryForm = {}
        },
       	//搜索
        handleSearch() {
        	if((this.queryForm.idNumber != "" && this.queryForm.idNumber != null && this.queryForm.idNumber != undefined) && 
                (this.queryForm.idType == "" || this.queryForm.idType == null || this.queryForm.idType == undefined) ){
                this.$message('证件类型不能为空！');
                return;
            }
            if((this.queryForm.idType != "" && this.queryForm.idType != null && this.queryForm.idType != undefined)){
                this.queryForm.idTyp = this.idType;
                if(this.queryForm.idNumber != "" && this.queryForm.idNumber != null && this.queryForm.idNumber != undefined){   
                    this.queryForm.idNo = this.queryForm.idNumber;
                }else{
                    this.$message('证件号码不能为空！');
                    return;
                }
            }
            if ((this.queryForm.idNumber == "" || this.queryForm.idNumber == null || this.queryForm.idNumber == undefined) && 
                (this.queryForm.idType == "" || this.queryForm.idType == null || this.queryForm.idType == undefined) &&
                (this.queryForm.externalIdentificationNo == "" || this.queryForm.externalIdentificationNo == null || 
                this.queryForm.externalIdentificationNo == undefined)){
                this.$message('请输入条件进行查询');
                return;
            }else if((this.queryForm.idNumber) && (this.queryForm.externalIdentificationNo)){
                this.$message('证件号和外部识别号只能选择输入一种！');
                return;
            }
            this.getList()
        },
        // 列表
        getList() {
            this.listLoading1 = true
            this.showList = true
            let params = {
            	authDataSynFlag: '1',
			}
            params = Object.assign ( params, this.queryForm )
           	this.getTableList('/auth/authService/AUS.IQ.02.0007', this.queryForm,(res) => {
                if (res.returnCode == '000000') {
                	this.listLoading1 = false
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.tableList = res.returnData.rows
                        this.tableList.forEach(item =>{
                        	if(item.effectFlag=='S'){
                        		item.tableList = '成功'
                        	}else if(item.effectFlag=='F'){
                        		item.tableList = '失败'
                        	}
                        })
                        this.tableTotal = res.returnData.totalCount
                    }else{
                        this.tableList = []
                        this.tableTotal = 0
                    }
                }
            })
        },
    }
}
</script>

<style>
</style>

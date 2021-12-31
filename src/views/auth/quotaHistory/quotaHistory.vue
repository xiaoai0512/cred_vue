<!-- 交易累计历史查询 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="证件类型" prop="idType">
                <el-select v-model="queryFormObj.idType" clearable class="wd200" >
                    <el-option v-for="(item, index) in idTypeList" 
                    	:key="index" 
                    	:label="item.detailDesc" 
                    	:value="item.codes" />
                </el-select>
            </el-form-item>
           	<el-form-item class="cl_td" label="证件号码" prop="idNumber">
                <el-input v-model="queryFormObj.idNumber" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                <el-input v-model="queryFormObj.externalIdentificationNo" class="wd200" type="text" />
            </el-form-item>
            <div class="clearboth"></div>
            <div class="" style="display: inline-block;width: 74%;margin-left: 19px;">
	            <el-form-item class="cl_td" label="开始日期" prop="startDate" style="display: inline-block;width: 31%;
    					margin-left: 13%;">
	                <el-date-picker 
	                    v-model="queryFormObj.startDate"
	                    class="wd200"
	                    type="date"
	                    placeholder="选择日期"
	                    format="yyyy 年 MM 月 dd 日"
	                    value-format="yyyyMMdd"/>
	            </el-form-item>
	           	<span >~</span>
	            <el-form-item class="" prop="endDate" style="width: 30%;display: inline-block;margin-left: 12px;">
	                <el-date-picker
	                    v-model="queryFormObj.endDate"
	                    class="wd200"
	                    type="date"
	                    placeholder="选择日期"
	                    format="yyyy 年 MM 月 dd 日"
	                    value-format="yyyyMMdd"
	                 	/>
	            </el-form-item>
			</div>
             <el-form-item class="cl_td" label="管控场景码" prop="differentType" v-if="showCode">
                <el-select v-model="queryFormObj.differentType" class="wd200">
                    <el-option v-for="(item, index) in contrlSceneTypeOptions" 
                    	:key="index" 
                    	:label="item.label" 
                    	:value="item.value"/>
                </el-select>
            </el-form-item>
            <div class="cl_tr text_center" >
               <el-button v-if="eyer" size="medium" icon="el-icon-arrow-down" type="primary" @click=" getCreditNodeList()" >管控场景码</el-button>
                <el-button v-else size="medium" icon="el-icon-arrow-up" type="primary" @click="getCreditNodeList()" >管控场景码</el-button>
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" >查询</el-button>
         	</div>
        </el-form>
        <div v-if="showList">
            <el-table v-loading = "listLoading" :data="tableList" border stripe style="width: 100%">
               	<el-table-column prop="accumultEndDate" label="累计日期" align="center"/>
                <el-table-column prop="accumultTypDesc" label="限制层级" align="center"/>
                <el-table-column prop="accumultIndentitCde" label="累计识别代码" align="center"/>
                <el-table-column prop="currencyCode" label="币种" align="center"/>
                <el-table-column prop="accumultMonthTrans" label="当月累计金额" align="center"/>
                <el-table-column prop="accumultMonthTransNum" label="当月累计笔数" align="center"/>
            </el-table>
            <pagination v-show="tableTotal>0" class="page-name" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
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
            eyer:true,
            showList: false,
            showCode: false,
            newOperationMode: '',
            queryFormObj: {
                pageNum: 1,
                pageSize:10,
            },
            tableList: [],
            listLoading: false,
            queryFormRef: {},
            queryFormRules: {},      
            tableTotal: 0,
            corporationEntityNo: '',
            // 下拉框
            operationModeOptions: [],
            idTypeList: [],
           	contrlSceneTypeOptions: [],//管控场景码
            //查询详情
            detailListLoading: false,
            detailTableList: [],
           	dialogFormVisibleDetail: false,
            tempDetail: {},
            rulesDetail: {},
            dataFormDetail: {},
        }
    },
    created() {
       	let logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))
        this.operationMode = logininfo.operationMode
        this.corporationEntityNo = logininfo.corporationEntityNo
    },
    mounted() {
       //运营模式
        let objis={
            requestType: '1',
            resultType: '1',
            corporationEntityNo: this.corporationEntityNo,
            adminFlagLogin: '1',
		}
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0037",objis).then(res => {
            this.operationModeOptions = res
        })
        //证件类型
        this.getSelectDict('dic_certificateType').then((res) => {
            this.idTypeList = res
        })
    },
   	methods: {
    	//授权场景码
        /* getCreditNodeList(){
            this.eyer=!this.eyer
            this.showCode=!this.showCode
            this.queryFormObj.authDataSynFlag = "1"
            console.log(this.queryFormObj)
            this.post('/auth/authService/AUS.IQ.01.0001', this.queryFormObj, (res) => {
            	if (res.returnMsg == 'OK') {
	               this.newOperationMode = res.returnData[0].operationMode;
	               	console.log('123')
	               	console.log(this.newOperationMode)
	               let obj = {
	               		authDataSynFlag: '1',
	    				operationMode: this.newOperationMode,
				        differentType: "0"
	               	}
	                this.post('/beta/betaService/AUS.PM.02.0102', obj, (res) => {
			            if (res.returnCode == '000000') {
			            	if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
			            			let arr = []
			                        let rows = res.returnData.rows
			                        rows.forEach((item, index) => {
			                           	arr[index] = {
			                                label: item.contrlSceneDesc,
			                                value: item.contrlSceneCode
			                            }
			                        })
			                        this.contrlSceneTypeOptions = arr
			            	}else{
			            		this.contrlSceneTypeOptions = []
			            	}
			          	}
	        		})
	           	}
	        })
        },*/
        getCreditNodeList(){
        	this.eyer=!this.eyer
            this.showCode=!this.showCode
            this.queryFormObj.authDataSynFlag = "1"
            this.post('/auth/authService/AUS.IQ.01.0001', this.queryFormObj, (res) => {
                if (res.returnCode == '000000') {
                	if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.newOperationMode = res.returnData.rows[0].operationMode;
                    }
                }
            })
        },
       	//查询
        handleSearch() {
            if(!this.queryFormObj.externalIdentificationNo && !this.queryFormObj.idType && !this.queryFormObj.idNumber) {
                    this.$message({
                        message: '请输入查询信息',
                        type: 'warning'
                    })
                    this.init()
            } else {
        		if(this.queryFormObj.idType) {
                    if(!this.queryFormObj.idNumber) {
                        this.$message({
                            message: '请输入证件号码',
                            type: 'warning'
                        })
		            } else {
		                this.getList()
		            }
            	} else if(this.queryFormObj.idNumber) {
                    if(!this.queryFormObj.idType) {
                        this.$message({
                            message: '请输入证件类型',
                            type: 'warning'
                        })
                    } else {
                        this.getList()
                    }
                } 
        	}
            this.showList=true
            this.getList()
        },
        // 列表
        getList() {
            this.listLoading = true
            let obj = {
            	authDataSynFlag:"1",
            	isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_leveList'],//查找数据字典所需参数
				transDict : ['accumultTyp'],//翻译前后key
				
            }
            obj = Object.assign (obj, this.queryFormObj )
            this.getTableList('/auth/authService/AUS.IQ.01.0006', obj,(res) => {
            	this.listLoading = false
                if (res.returnCode == '000000') {
                	if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.tableList = res.returnData.rows
                        this.tableTotal = res.returnData.totalCount
                 	}else {
                    	this.tableList = []
                        this.tableTotal = 0
                    }
                }
            }, (err) => {
            	this.tableList = []
                this.tableTotal = 0
                this.listLoading = false
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

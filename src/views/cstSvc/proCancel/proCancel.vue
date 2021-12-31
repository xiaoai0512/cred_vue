<!-- 客户产品注销 -->
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
        	<div class="text_title">1.客户基本信息</div>
        	<el-form :model="cancelInfo">
	            <el-form-item class="cl_td" label="证件类型" prop="idType">
	                <el-select v-model="cancelInfo.idType" class="wd200" disabled readonly>
	                <el-option v-for="(item, index) in idTypeList" :key="index" :label="item.detailDesc" :value="item.codes" />
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="证件号码" prop="idNumber">
	                <el-input v-model="cancelInfo.idNumber" class="wd200" type="text" readonly/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="客户姓名" prop="customerName">
	                <el-input v-model="cancelInfo.customerName" class="wd200" type="text" readonly/>
	            </el-form-item>
	        </el-form>
	        <div class="clearboth"></div>
	        <div class="text_title">2.客户产品信息</div>   
        	<el-table v-loading = "listLoading" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
	            <el-table-column width="80" align="center" label="选择">
                    <template scope="scope">
                        <el-radio v-model="templateRadio" :label="scope.$index" @change.native="getTemplateRow(scope.row)">{{""}}</el-radio>
                    </template>
                </el-table-column>
	            <el-table-column prop="productObjectCode" label="产品对象代码" align="center" />
	            <el-table-column prop="productDesc" label="产品描述" align="center" />
	            <el-table-column prop="productTypeDesc" label="产品类型" align="center" />
	            <el-table-column prop="coBrandedNo" label="联名代码" align="center"/>
	            <el-table-column prop="budgetOrgCode" label="公务卡预算单位编码" align="center" />
	            <el-table-column prop="statusCodeDesc" label="状态" align="center"/>
             	<el-table-column prop="createDate" label="申请日期" align="center"/>
              	<el-table-column prop="productCancelDate" label="注销日期" align="center"/>
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
	            institutionIdOptions: [],//所属机构
	            operationModeOptions: [],//运营模式
	            pinDispatchMethodOptions: [],//密码函领取标志
	            mediaDispatchMethodOptions: [],//媒介领取标志
	            activationFlagOptions: [],//激活标识
	            activationModeOptions: [],//激活方式
	            //修改
	            tempUp: {},
	            upRef: {},
	            upRules: {},
	            dialogFormVisibleUp: false,
	            newInfo: '',
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
            //所属机构
            this.getSelectDict( "/beta/betaService/COS.IQ.02.0005").then(res => {
                this.institutionIdOptions = res
            })
            // 运营模式
            this.getSelectDict( "/beta/betaService/COS.IQ.02.0006").then(res => {
                this.operationModeOptions = res
            })
            //密码函领取标志
            this.getSelectDict( "dic_isYorN").then(res => {
                this.pinDispatchMethodOptions = res
            })
            //媒介领取标志
            this.getSelectDict( "dic_isYorN").then(res => {
                this.mediaDispatchMethodOptions = res
            })
            //激活标识 
            this.getSelectDict( "dic_activationFlag").then(res => {
                this.activationFlagOptions = res
            })
            //激活方式
             this.getSelectDict( "dic_activationMode").then(res => {
                this.activationModeOptions = res
            })
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
		             	this.getInfo()
		            }
		          	} else if (this.queryForm.idNumber) {
		            if (!this.queryForm.idType) {
		              this.$message({
		                message: '请输入证件类型',
		                type: 'warning'
		              })
		            } else {
		              	this.getList()
		             	this.getInfo()
		            }
		          	} else {
		            	this.getList()
		         		this.getInfo()
		          	}
	    		}
	      	},
	        // 客户产品信息列表
	        getList() {
	            this.listLoading = true
	            this.showDiv = true
	           	let  params = {
	            	flag: '1',
	            	isTrans: true,
					transParams : ['dic_productType','dic_proState'],//查找数据字典所需参数
					transDict : ['productType','statusCode'],//翻译前后key
	            }
	           	 params = Object.assign(params, this.queryForm)
	           	this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0004', params,(res) => {
	           		this.listLoading = false
	           		if (res.returnCode == '000000') {
	                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
	                		this.tableList = res.returnData.rows;
	                		this.tableTotal = res.returnData.totalCount;
	                		this.tableList.forEach(item=>{
	                			item.mediaObjectCodeDesc = item.mediaObjectCode+ ''+item.mediaObjectDesc
	                			item.productObjectCodeDesc = item.productObjectCode+ ''+item.productDesc
	                			
	                		})
						}
	                }
	            })
	        },
	        getInfo() {
	            this.showDiv = true
	            let obj1 = {
	            	falg: "2",
	            }
	            obj1 = Object.assign(this.queryForm, obj1)
	           	this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0001',obj1,(res) => {
	           		this.listLoading = false
	           		if (res.returnCode == '000000') {
	                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
	                		this.cancelInfo = res.returnData.rows[0];
	         			}
	                }
	            })
	        },
	      	//点击单选获取数据
	        getTemplateRow(row){
	        	this.newCard = row
	        },
		   	//注销卡片
		    subCancelInfo(){
		    	if(this.newCard==''){
		    		this.$message('请选中一条记录')
		    		return;
		    	}
		    	let  obj3={
		    		customerNo: this.newCard.customerNo,
					operationMode: this.newCard.operationMode,
					productObjectCode: this.newCard.productObjectCode,
					idNumber: this.queryForm.idNumber,
					idType: this.queryForm.idType,
		    		externalIdentificationNo: this.queryForm.externalIdentificationNo
		    	}
	        	this.post('/nonfi/nonfinanceService/BSS.OP.01.0019', obj3,(res) => {
		            if (res.returnCode == '000000') {
	                 	this.$notify({
	                        title: 'Success',
	                        message: '注销卡片成功',
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

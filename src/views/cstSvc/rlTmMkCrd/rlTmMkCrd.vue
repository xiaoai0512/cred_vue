<!-- 实时制卡 -->
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
        	<div class="mainname">1.客户基本信息</div>
        	<el-form :model="rlTmMkCrdInfo">
	            <el-form-item class="cl_td" label="证件类型" prop="idType">
	                <el-select v-model="rlTmMkCrdInfo.idType" class="wd200" disabled readonly>
	                <el-option v-for="(item, index) in idTypeList" :key="index" :label="item.detailDesc" :value="item.codes" />
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="证件号码" prop="idNumber">
	                <el-input v-model="rlTmMkCrdInfo.idNumber" class="wd200" type="text" readonly/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="客户姓名" prop="customerName">
	                <el-input v-model="rlTmMkCrdInfo.customerName" class="wd200" type="text" readonly/>
	            </el-form-item>
	        </el-form>
	        <div class="clearboth"></div>
	        <div class="mainname">2.客户制卡信息</div>   
        	<el-table v-loading = "listLoading" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
	            <el-table-column width="80" align="center" label="选择">
                    <template scope="scope">
                        <el-radio v-model="templateRadio" :label="scope.$index" @change.native="getTemplateRow(scope.row)">{{""}}</el-radio>
                    </template>
                </el-table-column>
	            <el-table-column prop="mediaObjectCode" label="媒介对象代码" align="center" />
	            <el-table-column prop="externalIdentificationNo" label="外部识别号" align="center" />
	            <el-table-column prop="mainSupplyIndicatorDesc" label="主附卡标识" align="center" />
	            <el-table-column prop="mediaObjectDesc" label="媒介对象描述" align="center"/>
	            <el-table-column prop="productionCodeDesc" label="制卡标识" align="center" />
	            <el-table-column prop="productionDate" label="制卡请求日期" align="center"/>
             	<el-table-column prop="embosserName1" label="刻印名" align="center"/>
              	<el-table-column prop="nextBillDate" label="卡板面" align="center"/>
              	<el-table-column label=""width="180">
			      	<template slot-scope="scope">
				        <el-popover trigger="hover" placement="top">
				          	<p>有效期: {{ scope.row.expirationDate }}</p>
				          	<p>卡组织: {{ scope.row.cardScheme }}</p>
				          	<p>卡版代号: {{ scope.row.formatCode }}</p>
				          	<p>持卡人姓名: {{ scope.row.embosserName1 }}</p>
				          	<div slot="reference" class="name-wrapper">
				            	<el-tag size="medium">{{ scope.row.name }}</el-tag>
				          	</div>
				        </el-popover>
			      	</template>
			    </el-table-column>
            </el-table>
	        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="getList" />
    		<div slot="footer" class="cl_tr text_center">
	            <el-button type="primary" @click="subData()"> 确定</el-button>
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
	           	showDiv: false,
	            logininfo: '',
	            templateRadio: false,
	            // 列表
	            queryForm: {
	                pageNum: 1,
	                pageSize:10,
	            },
	            rlTmMkCrdInfo: {},
	            listLoading: false,
	            queryFormRef: {},
	            queryFormRules: {},      
	            tableList: [],
	            tableTotal: 0,
	            list_formatCode: '',
	            // 下拉框
	            idTypeList: [],//证件类型
	            billDayMonthOptions: [],//账单日
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
            // 运营模式 
            this.getSelectDict( "/beta/betaService/COS.IQ.02.0072").then(res => {
                this.originListOptions = res
            })
            //账单日
            this.getSelectDict( "dic_billDay").then(res => {
                this.billDayMonthOptions = res
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
        // 列表
        getList() {
            this.listLoading = true
            this.showDiv = true
            delete this.queryForm.evnetId  
            this.queryForm.evnetId = 'ISS.IQ.01.0010'
           
           	this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0007', this.queryForm,(res) => {
           		this.listLoading = false
           		if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                		this.tableList = res.returnData.rows;
                		this.tableTotal = res.returnData.totalCount;
						
                    }
                }
            })
        },
        getInfo() {
            this.showDiv = true
            let obj1 = {
            	evnetId:'ISS.OP.01.0012',
            }
            obj1 = Object.assign(this.queryForm, obj1)
           	this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0001',obj1,(res) => {
           		this.listLoading = false
           		if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                		this.rlTmMkCrdInfo = res.returnData.rows[0];
                		console.log(this.rlTmMkCrdInfo)
                		//this.getInfo2()
                    }
                }
            })
        },
        getInfo2() {
            this.showDiv = true
            this.queryForm.customerCode = this.rlTmMkCrdInfo.customerCode
            delete  this.queryForm.evnetId
           	this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0007',this.queryForm,(res) => {
           		this.listLoading = false
           		if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                		this.rlTmMkCrdInfo = res.returnData.rows[0];
                		console.log(this.rlTmMkCrdInfo)
                		
                    }
                }
            })
        },
        //获取单选数据
	    getTemplateRow(row){
	        this.newLegal = row
	    },
	    subData(){
        	let obj2 = {
            	evnetId:'ISS.IQ.01.0010',
            }
        	obj2.mediaUnitCode = this.newLegal.mediaUnitCode
        	obj2 = Object.assign(this.queryForm, obj2)
        	this.post('/nonfi/nonfinanceService/ISS.OP.01.0012', obj2 ,(res) => {
	            if (res.returnCode == '000000') {
                 	this.dialogFormVisibleUp = false
                    this.$notify({
                        title: 'Success',
                        message: '制卡成功',
                        type: 'success',
                        duration: 2000
                    })
                    this.getList()
	            }
	        })
	    },
    }
}
</script>

<style>
</style>

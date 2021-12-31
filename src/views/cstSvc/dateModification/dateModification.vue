<!-- 统一日期修改 -->
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
        	<div class="text_title">1. 客户基本信息</div>
        	<el-form :model="customerInfo">
	            <el-form-item class="cl_td" label="证件类型" prop="idType">
	                <el-select v-model="customerInfo.idType" class="wd200" disabled readonly>
	                <el-option v-for="(item, index) in idTypeList" :key="index" :label="item.detailDesc" :value="item.codes" />
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="证件号码" prop="idNumber">
	                <el-input v-model="customerInfo.idNumber" class="wd200" type="text" readonly/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="客户姓名" prop="customerName">
	                <el-input v-model="customerInfo.customerName" class="wd200" type="text" readonly/>
	            </el-form-item>
	        </el-form>
	        <div class="clearboth"></div>
	        <div class="text_title">2.客户业务项目</div>   
        	<el-table v-loading = "listLoading" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
	            <el-table-column prop="businessProgramNoDesc" label="业务项目" align="center" />
	            <el-table-column prop="cycleModelDesc" label="账单模式" align="center" />
	            <el-table-column prop="billDay" label="账单日" align="center" />
	            <el-table-column prop="nextBillDate" label="下一账单日期" align="center"/>
	            <el-table-column prop="cycleNumber" label="当前周期号" align="center" />
	            <el-table-column prop="directDebitStatusDesc" label="约定扣款状态" align="center"/>
             	<el-table-column prop="directDebitModeDesc" label="约定扣款状态" align="center"/>
              	<el-table-column prop="directDebitBankNo" label="约定还款银行号" align="center"/>
              	<el-table-column prop="directDebitAccountNo" label="约定还款账户号" align="center"/>
              	<el-table-column align="center" width="200px" label="操作" class-name="small-padding fixed-width">
                    <template slot-scope="{row,$index}">
                        <el-button size="medium" icon="el-icon-edit" type="primary" @click="handleUp(row)">统一日期修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
	        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="getList" />
    		<div v-if="showModify">
	    		<div class="text_title">3.统一日期修改</div>
	    		<el-form :model="modifyInfo">
		            <el-form-item class="cl_td" label="业务项目" prop="businessProgramNo">
		                <el-input v-model="modifyInfo.businessProgramNo" class="wd200" type="text" readonly/>
		            </el-form-item>
		            <el-form-item class="cl_td" label="周期号" prop="cycleNumber">
		                <el-input v-model="modifyInfo.cycleNumber" class="wd200" type="text"readonly />
		            </el-form-item>
		            <el-form-item class="cl_td" label="本次账单日期" prop="statementDate">
		                <el-input v-model="modifyInfo.statementDate" class="wd200" type="text" readonly/>
		            </el-form-item>
		           <el-form-item class="cl_td" label="本次最后还款日期" prop="paymentDueDate">
	                    <el-date-picker class="wd200"
	                        v-model="modifyInfo.paymentDueDate"
	                        type="date"
	                        value-format="yyyy-MM-dd"
	                        placeholder="选择日期">
	                    </el-date-picker>
					</el-form-item>
		            <el-form-item class="cl_td" label="本次宽限日期" prop="graceDate">
		                <el-input v-model="modifyInfo.graceDate" class="wd200" type="text" readonly/>
		            </el-form-item>
		            <el-form-item class="cl_td" label="本次迟缴费收取日期" prop="delinquencyDate">
		                <el-input v-model="modifyInfo.delinquencyDate" class="wd200" type="text" readonly/>
		            </el-form-item>
		            <el-form-item class="cl_td" label="约定扣款日期" prop="directDebitDate">
		                <el-input v-model="modifyInfo.directDebitDate" class="wd200" type="text" readonly/>
		            </el-form-item>
		        </el-form>
	        	<div class="clearboth"></div>
	    		<div slot="footer" class="cl_tr text_center">
		            <el-button type="primary" icon="el-icon-plus" @click="subData()"> 确定修改</el-button>
		        </div> 
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
	           	showModify: false,
	            logininfo: '',
	            templateRadio: false,
	            // 列表
	            queryForm: {
	                pageNum: 1,
	                pageSize:10,
	            },
	            customerInfo: {},//客户基本信息
	            modifyInfo: {},//统一日期修改
	            //2.客户业务项目
	            listLoading: false,
	           	tableList: [],
	            tableTotal: 0,
	           	// 下拉框
	            idTypeList: [],//证件类型
	            tempArr: [],
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
        // 业务项目列表
        getList() {
            this.listLoading = true
            this.showDiv = true
            let params = {
            	idNumber: this.queryForm.idNumber,
            	idType: this.queryForm.idType,
            	externalIdentificationNo: this.queryForm.externalIdentificationNo,
            	isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_cycleModel','dic_directDebitStatus','dic_directDebitMode'],//查找数据字典所需参数
				transDict : ['cycleModel','directDebitStatus','directDebitMode'],//翻译前后key
            }
           	this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0020', params,(res) => {
           		this.listLoading = false
           		if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                		this.tableList = res.returnData.rows;
                		this.tableList.cycleNumber=res.returnData.rows.currentCycleNumber
                		this.tableTotal = res.returnData.totalCount;
                		this.tableList.forEach(item=>{
                			item.businessProgramNoDesc = item.businessProgramNo+ ''+item.programDesc
                		})
						
                    }
                }
            })
        },
        //客户基本信息
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
                		this.customerInfo = res.returnData.rows[0];
         			}
                }
            })
        },
        //3.媒介基本信息
        handleUp(items) {
        	this.tempArr=items
        	this.showModify = true
            let obj2= {
            	idNumber: this.queryForm.idNumber,
            	idType: this.queryForm.idType,
            	externalIdentificationNo: this.queryForm.externalIdentificationNo,
            	cycleNumber: this.tempArr.currentCycleNumber,
            }
           	obj2 =  Object.assign(this.tempArr, obj2)
            this.post('/nonfi/nonfinanceService/BSS.IQ.01.0018',obj2,(res) => {
           		if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                		this.modifyInfo = res.returnData.rows[0];
                		
                	}
                }
            })
        },
        //确定修改
	    subData(){
	    	let  obj3={
	    		idNumber: this.queryForm.idNumber,
            	idType: this.queryForm.idType,
            	externalIdentificationNo: this.queryForm.externalIdentificationNo,
	    	}
    		obj3 =  Object.assign(this.tempArr,this.modifyInfo,obj3)
        	this.post('/nonfi/nonfinanceService/BSS.UP.01.0050', obj3,(res) => {
	            if (res.returnCode == '000000') {
                 	this.$notify({
                        title: 'Success',
                        message: '修改成功',
                        type: 'success',
                        duration: 2000
                    })
                 	this.showModify = false
                    this.getList()
	            }
	        })
	    },
    }
}
</script>

<style>
</style>

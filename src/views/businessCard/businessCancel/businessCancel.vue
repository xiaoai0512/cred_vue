<!-- 客户产品注销 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
    	<el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
	       	<el-form-item class="cl_td" label="预算单位编码" prop="idNumber">
            	<el-input v-model="queryFormObj.idNumber" class="wd200" type="text"/>
        	</el-form-item>
    		<el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
            	<el-input v-model="queryFormObj.externalIdentificationNo" class="wd200" type="text"/>
        	</el-form-item>
        	 <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()">查询</el-button>
                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="reset()">重置</el-button>
            </div>
    	</el-form>  
    	<div v-if="showDiv">
	        <el-form ref="detailRef" :model="detailInfo" :rules="detailRules">
	            <el-form-item class="cl_td" label="媒介单元代码" prop="mediaUnitCode">
	            	<el-input v-model="detailInfo.mediaUnitCode" class="wd200" type="text" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="媒介对象代码" prop="mediaObjectCode">
	            	<el-input v-model="detailInfo.mediaObjectCode" class="wd200" type="text" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="产品对象代码" prop="productObjectCode">
	            	<el-input v-model="detailInfo.productObjectCode" class="wd200" type="text" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
	            	<el-input v-model="detailInfo.externalIdentificationNo" class="wd200" type="text" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="主副卡标识" prop="mainAttachmentDesc">
	            	<el-input v-model="detailInfo.mainAttachmentDesc" class="wd200" type="text" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="使用者姓名" prop="mediaUserName">
	            	<el-input v-model="detailInfo.mediaUserName" class="wd200" type="text" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="主客户代码" prop="mainCustomerNo">
	            	<el-input v-model="detailInfo.mainCustomerNo" class="wd200" type="text" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="副客户代码" prop="mediaHolderNo">
	            	<el-input v-model="detailInfo.mediaHolderNo" class="wd200" type="text" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="所属机构" prop="institutionId">
	            	<el-input v-model="detailInfo.institutionId" class="wd200" type="text" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="运营模式" prop="operationMode">
	            	<el-input v-model="detailInfo.operationMode" class="wd200" type="text" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="有效期" prop="expirationDate">
	            	<el-input v-model="detailInfo.expirationDate" class="wd200" type="text" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="上一有效期" prop="previousExpirationDate">
	            	<el-input v-model="detailInfo.previousExpirationDate" class="wd200" type="text" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="新建日期" prop="createDate">
                    <el-date-picker class="wd200"
                        v-model="detailInfo.createDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期" disabled   readonly>
                    </el-date-picker>
				</el-form-item>
	        	<el-form-item class="cl_td" label="刻印名" prop="embosserName1">
	            	<el-input v-model="detailInfo.embosserName1" class="wd200" type="text" />
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="进件人员编号" prop="applicationStaffNo">
	            	<el-input v-model="detailInfo.applicationStaffNo" class="wd200" type="text" />
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="分行号" prop="branchNumber">
	            	<el-input v-model="detailInfo.branchNumber" class="wd200" type="text" />
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="申请书编号" prop="applicationNumber">
	            	<el-input v-model="detailInfo.applicationNumber" class="wd200" type="text"/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="营销人员编号" prop="marketerCode">
	            	<el-input v-model="detailInfo.marketerCode" class="wd200" type="text" />
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="密码函领取标志" prop="pinDispatchMethod">
	            	<el-input v-model="detailInfo.pinDispatchMethod" class="wd200" type="text"/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="媒介领取标志" prop="mediaDispatchMethod">
	            	<el-input v-model="detailInfo.mediaDispatchMethod" class="wd200" type="text"/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="激活标识" prop="activationFlag">
	                <el-select v-model="detailInfo.activationFlag" class="wd200" disabled   readonly>
	                    <el-option v-for="(item, index) in activationFlagOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
	            </el-form-item>
	           <el-form-item class="cl_td" label="激活方式" prop="activationMode">
	                <el-select v-model="detailInfo.activationMode" class="wd200" disabled   readonly>
	                    <el-option v-for="(item, index) in activationModeOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="激活日期" prop="activationDate">
                    <el-date-picker class="wd200"
                        v-model="detailInfo.activationDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期" disabled   readonly>
                    </el-date-picker>
				</el-form-item>
	            <el-form-item class="cl_td" label="年费日期" prop="annualFeeDate">
                    <el-date-picker class="wd200"
                        v-model="detailInfo.annualFeeDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期" disabled   readonly>
                    </el-date-picker>
				</el-form-item>
	            <el-form-item class="cl_td" label="免首年年费日期" prop="waiveFirstAnnualFeeDate">
                    <el-date-picker class="wd200"
                        v-model="detailInfo.waiveFirstAnnualFeeDate"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择日期" disabled   readonly>
                    </el-date-picker>
				</el-form-item>
	            <el-form-item class="cl_td" label="上一年费收取周期号" prop="lastAnnualFeeCycleNo">
	                <el-input v-model="detailInfo.lastAnnualFeeCycleNo" class="wd200" type="text" readonly/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="是否有效标识" prop="invalidFlagStr">
	            	<el-input v-model="detailInfo.invalidFlagStr" class="wd200" type="text" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="失效原因" prop="invalidReasonStr">
	               <el-input v-model="detailInfo.invalidReasonStr" class="wd200" type="text" readonly/>
	            </el-form-item>
            </el-form>
            <div class="cl_tr text_center">
	            <el-button size="medium" icon="el-icon-delete" type="primary" @click="cancelDetailInfo()" v-show="cancelBtnFlag">注销</el-button>
	        </div>
	    </div>
	    <div v-if="showList">
	     	<el-table v-loading = "listLoading" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
	            <el-table-column prop="customerName" label="持卡人姓名" align="center" />
	            <el-table-column prop="externalIdentificationNo" label="外部识别号" align="center" />
	            <el-table-column prop="idTypeDesc" label="证件类型" align="center" />
	            <el-table-column prop="idNumber" label="证件号码" align="center" />
	            <el-table-column prop="officialCardType" label="公务卡类型" align="center" />
	            <el-table-column prop="invalidFlagDesc" label="有效标识" align="center" />
	            <el-table-column prop="" label="操作" align="center" width="200px">
	                <template slot-scope="{row}">
		                <el-button size="mini" icon="el-icon-more" type="primary" @click="cancelList(row)" v-show="cancelBtnFlag">注销</el-button>
		            </template >   
	            </el-table-column>
        	</el-table>
        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
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
                cancelBtnFlag: false,
                showDiv: false,
                showList: false,
                queryFormObj: {
                	pageNum: 1,
                	pageSize:10,
                },
                queryFormRules: {},
                queryFormRef: {}, 
                //基本信息
               	detailRef: {},
               	detailInfo: {},
               	detailRules: {},
               	//列表
               	tableTotal: 0,
               	listLoading: false,
               	tableList: [],
               	queryInfo: {},
                // 下拉框
                activationFlagOptions: [],//激活标识
                activationModeOptions: [],//激活方式
               
            }
        },
        created() {
            
        },
        mounted() {
            this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))  //获取用户登录权限
           	this.getBtnAuth()
           	//激活标识
           	this.getSelectDict('dic_activationFlag').then((res) => {
        		this.activationFlagOptions = res
    		})
           	//激活标识
           	this.getSelectDict('dic_activationMode').then((res) => {
        		this.activationModeOptions = res
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
	                    if (this.btnAuthStr.includes('OCS.OP.01.0002')) { //注销
	                        this.cancelBtnFlag = true;
	                    } else {
	                        this.cancelBtnFlag = false
	                    }
	                   
	                }
	            }
	        })
	    },
      	reset(){
			  this.queryFormObj = {}
			  this.detailInfo = {}
			  this.tableList = []
			  this.showDiv = false
			  this.showList = false
      	},
      	handleSearch(){
      		if(this.queryFormObj.externalIdentificationNo && this.queryFormObj.idNumber){
				 this.$message('查询条件，输入一个即可！')
				 return;
           	}
            if(this.queryFormObj.externalIdentificationNo){
	           	this.post('/nonfi/nonfinanceService/OCS.IQ.01.0010', this.queryFormObj, (res) => {
	           		if(res.returnCode == '000000') {
	           			this.showDiv = true
	           			this.showList = false
	                    this.detailInfo = res.returnData.rows[0]
	                }
	            })
           	}else if(this.queryFormObj.idNumber && (this.queryFormObj.externalIdentificationNo == '' ||this.queryFormObj.externalIdentificationNo == undefined || 
				this.queryFormObj.externalIdentificationNo == null || this.queryFormObj.externalIdentificationNo == 'null')){
           		this.queryInfo.idType = '7',
	   			this.queryInfo.idNumber = this.queryFormObj.idNumber,
	   			this.getList()
           	}
      	},
      	//基本信息注销
      	cancelDetailInfo(){
      		let detailParams = {
				externalIdentificationNo: this.detailInfo.externalIdentificationNo,
				mediaUnitCode: this.detailInfo.mediaUnitCode
			}
       		this.post('/nonfi/nonfinanceService/OCS.OP.01.0002', detailParams, (res) => {
				if (res.returnCode == '000000') {
					this.$notify({
						message: '注销成功',
						type: 'success',
					}) 
				}
            })
      	},
      	//公务卡信息列表
      	getList(){
      		this.listLoading = true  
      		this.showList = true
      		this.showDiv = false
      		let params ={
	   			pageNum:  this.queryFormObj.pageNum,
	        	pageSize:  this.queryFormObj.pageSize,
	        	isTrans: true,
				transParams: ['dic_documentTypeTable','dic_invalidFlagYN'],
				transDict: ['idType','invalidFlag'],
   			}
			  params = Object.assign(this.queryInfo, params)   //合并
			  this.getTableList('/nonfi/nonfinanceService/OCS.IQ.01.0010', params ,(res) => {
   				this.listLoading = false
       			if(res.returnCode == '000000') {
	       			this.tableList = res.returnData.rows
	                this.tableTotal = res.returnData.totalCount
	                if (!res.returnData.rows || res.returnData.rows.length == 0) {
						res.returnData.rows = [];
						this.tableTotal = 0;
					}
	            }else{
	            	this.showDiv = false
	       			this.showList = false
	            }
        	})
      	},
      	//列表信息注销
       	cancelList(row){
       		let listParams = {
       			externalIdentificationNo: row.externalIdentificationNo,
				mediaUnitCode: row.mediaUnitCode
       		}
       		this.post('/nonfi/nonfinanceService/OCS.OP.01.0002', listParams, (res) => {
                    if (res.returnCode == '000000') {
						this.$notify({
							message: '注销成功',
							type: 'success',
						}) 
                    }
            })
	    },
       
   	}
}
</script>
<style>
</style>

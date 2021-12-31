<!-- 贷款试算器 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form :model="queryForm" ref="queryForm" >
        	<el-form-item class="cl_td" label="金额" prop="loanAmt" :rules="[ { required: true, message: '金额不能为空'} ]">
                <el-input v-model="queryForm.loanAmt" class="wd200" type="text" />
            </el-form-item>
        	<el-form-item class="cl_td" label="贷款期限(月)" prop="monthSupplyPeriod" :rules="[ { required: true, message: '贷款期限(月)不能为空'} ]">
                <el-input v-model="queryForm.monthSupplyPeriod" class="wd200" type="text" />
            </el-form-item>
        	<el-form-item class="cl_td" label="还款方式" prop="repayMode" :rules="[ { required: true, message: '还款方式不能为空'} ]">
                <el-select v-model="queryForm.repayMode" class="wd200">
                <el-option v-for="(item, index) in repayModeOptions" 
                	:key="index" 
                	:label="item.detailDesc" 
                	:value="item.codes" />
                </el-select>
            </el-form-item>
        	<el-form-item class="cl_td" label="还款频率" prop="repayPrincipal">
                <el-input v-model="queryForm.repayPrincipal" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="还款频率单位" prop="repayPrincipalUnit" :rules="[ { required: true, message: '还款频率单位不能为空'} ]">
                <el-select v-model="queryForm.repayPrincipalUnit" class="wd200">
                <el-option v-for="(item, index) in repayPrincipalUnitOptions" 
                	:key="index" 
                	:label="item.detailDesc" 
                	:value="item.codes" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="还款日类型" prop="repaymentDateType" :rules="[ { required: true, message: '还款日类型不能为空'} ]">
                <el-select v-model="queryForm.repaymentDateType" class="wd200">
                <el-option v-for="(item, index) in repaymentDateTypeOptions" 
                	:key="index" 
                	:label="item.detailDesc" 
                	:value="item.codes" />
                </el-select>
            </el-form-item>
         	<el-form-item class="cl_td" label="利率类型" prop="RateInd" :rules="[ { required: true, message: '利率类型不能为空'} ]">
                <el-select v-model="queryForm.RateInd" class="wd200">
                <el-option v-for="(item, index) in rateIndOptions"
                	 :key="index" 
                	 :label="item.detailDesc" 
                	 :value="item.codes" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="利率（%）" prop="loanRate" :rules="[ { required: true, message: '利率（%）不能为空'} ]">
                <el-input v-model="queryForm.loanRate" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="计息方式" prop="interestMode" :rules="[ { required: true, message: '计算方式不能为空'} ]">
                <el-select v-model="queryForm.interestMode" class="wd200">
                <el-option v-for="(item, index) in interestModeOptions" 
                	:key="index" 
                	:label="item.detailDesc" 
                	:value="item.codes" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="计息基数" prop="loanRateMode" :rules="[ { required: true, message: '计息基数不能为空'} ]">
                <el-select v-model="queryForm.loanRateMode" class="wd200">
                <el-option v-for="(item, index) in loanRateModeOptions" 
                	:key="index" 
                	:label="item.detailDesc" 
                	:value="item.codes" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="贷款到期日计算方式" prop="calLoanEndDateType"  
            	:rules="[ { required: true, message: '贷款到期日计算方式不能为空'} ]">
                <el-select v-model="queryForm.calLoanEndDateType" class="wd200">
                <el-option v-for="(item, index) in calLoanEndDateTypeOptions" 
                	:key="index" 
                	:label="item.detailDesc" 
                	:value="item.codes" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="免息天数" prop="freeDays" :rules="[ { required: true, message: '免息天数不能为空'} ]">
                <el-input v-model="queryForm.freeDays" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="交易日期" prop="payLoanDate" :rules="[ { required: true, message: '交易日期不能为空'} ]">
                <el-date-picker class="wd200"
                    v-model="queryForm.payLoanDate"
                    type="date"
                    value-format="yyyy-MM-dd"
                    placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
           	<div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleTrial()">试算</el-button>
            </div>
        </el-form>
        <!--试算结果-->
        <div v-if="showTrial">
        	<div class="text_title">试算结果</div>
	        <el-form :model="trialInfo">
	        	<el-form-item class="cl_td" label="金额" prop="loanAmt" >
	                <el-input v-model="trialInfo.loanAmt" class="wd200" type="text" />
	            </el-form-item>
	        	<el-form-item class="cl_td" label="利率 %" prop="loanRate">
	                <el-input v-model="trialInfo.loanRate" class="wd200" type="text" />
	            </el-form-item>
	        	<el-form-item class="cl_td" label="费率 " prop="feeRate" >
	                <el-input v-model="trialInfo.feeRate" class="wd200" type="text" />
	            </el-form-item>
	        	<el-form-item class="cl_td" label="总期数" prop="term" >
	                <el-input v-model="trialInfo.term" class="wd200" type="text" />
	            </el-form-item>
	            <el-form-item class="cl_td" label="总费用" prop="allFeeAmt" >
	                <el-input v-model="trialInfo.allFeeAmt" class="wd200" type="text" />
	            </el-form-item>
	        	<el-form-item class="cl_td" label="总利息" prop="allIntAmt">
	                <el-input v-model="trialInfo.allIntAmt" class="wd200" type="text" />
	            </el-form-item>
	        </el-form>
	        <el-table v-loading = "listLoading" :data="trialList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
	            <el-table-column prop="termNo" label="期次" align="center" />
	            <el-table-column prop="throwDate" label="当期抛账日" align="center" />
	            <el-table-column prop="principalAmount" label="应还本金" align="center"/>
	            <el-table-column prop="interestAmount" label="应还利息" align="center"/>
	            <el-table-column prop="feeAmount" label="应还费用" align="center"/>
	        </el-table>
	        <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleBack()">返回</el-button>
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
	            queryForm: {},
	            // 列表
	            queryFormPage: {
	                pageNum: 1,
	                pageSize:10,
	            },
	            // 下拉框
	            idTypeList: [],//证件类型
	            logLevelOptions: [],
	            repayModeOptions: [],//还款方式
	            repayPrincipalUnitOptions: [],//还款频率单位
	            repaymentDateTypeOptions: [],//还款日类型
	            rateIndOptions: [],//利率类型
	            interestModeOptions: [],//计算方式
	            loanRateModeOptions: [],//计息基数
	            calLoanEndDateTypeOptions: [],//货款到期计算方式
	            //试算
	            showTrial: false,
	            trialInfo: {},
	            trialList: [],
	            listLoading: false,
        	}
        },
        created() {
        	this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))  //获取用户登录权限
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
           	// 维护历史类型 
            this.getSelectDict( "dic_logLevel").then(res => {
                this.logLevelOptions = res
            })
            //还款方式
            this.getSelectDict( "dic_repaymentMethod").then(res => {
                this.repayModeOptions = res
            })
            //还款频率单位
           	this.getSelectDict( "dic_repaymentFrequencyUnit").then(res => {
                this.repayPrincipalUnitOptions = res
            })
            //还款日类型
             this.getSelectDict( "dic_repaymentDateType").then(res => {
                this.repaymentDateTypeOptions = res
            })
             //利率类型
             this.getSelectDict( "dic_interestRateType").then(res => {
                this.rateIndOptions = res
            })
             //计息方式
           this.getSelectDict( "dic_interestBearingMethod").then(res => {
                this.interestModeOptions = res
            })
             //贷款到期日计算方式
            this.getSelectDict( "dic_loanMaturityCalculation").then(res => {
                this.calLoanEndDateTypeOptions = res
            })
              //计息基数
            this.getSelectDict( "dic_interestBase").then(res => {
                this.loanRateModeOptions = res
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
      		//试算
      		handleTrial(){
      			
      			let params = {
      				pageNum:  this.queryFormPage.pageNum,
	                pageSize: this.queryFormPage.pageSize,
      			}
      			params = Object.assign ( this.queryForm, params )
		 	 	this.$refs['queryForm'].validate((valid) => {
            		if (valid) {
            			this.showTrial = true
      					this.listLoading = true
		                this.post('/beta/betaService/ILS.IQ.01.0006',  params, (res) => {
		                	this.listLoading = false
		                    if (res.returnCode == '000000') {
				                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
				                    this.trialInfo = res.returnData.obj
				                    this.trialList = res.returnData.rows
				                } else {
                                    this.trialInfo = {}
				                    this.trialList = []
                                }
				            }
		                }, (err) => {
                            if (err) {
                                this.trialInfo = {}
				                this.trialList = []
                            }
                        })
		            }
		        })
      		},
      		handleBack(){
      			this.showTrial = false
      		},
        
    }
}
</script>

<style>
</style>

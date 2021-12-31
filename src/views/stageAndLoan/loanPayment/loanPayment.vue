'<!-- 贷款支付信息 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                <el-input v-model="queryFormObj.externalIdentificationNo" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="起始时间" prop="startDate">
                <el-date-picker
                    v-model="queryFormObj.startDate"
                    class="wd200"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy 年 MM 月 dd 日"
                    :picker-options="pickerOptionsStart"
                    :clearable="true"
                    @change="changeStart"/>
            </el-form-item>
            <el-form-item class="cl_td" label="结束时间" prop="endDate">
                <el-date-picker
                    v-model="queryFormObj.endDate"
                    class="wd200"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyyMMdd"
             	 	:picker-options="pickerOptionsEnd"
                    :clearable="true"
                    @change="changeEnd"/>
            </el-form-item>
			<div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" >查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="Reset()" >重置</el-button>
            </div>
        </el-form>
        <div v-if="showList">
        <el-table v-loading = "listLoading1" :data="tableList" class="mbtm20" fit highlight-current-row 
        	@selection-change="handleSelectionChange" style="width: 100%;" border>
        	<el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="loanTypeDesc" label="账户类型" align="center" />
            <el-table-column prop="accountId" label="账户代码" align="center" />
            <el-table-column prop="loanAmount" label="交易金额" align="center" />
            <el-table-column prop="remainPrincipalAmount" label="未抛金额" align="center" />
            <el-table-column prop="prepaidAmount" label="已支付金额	" align="center" />
            <el-table-column prop="currencyCode" label="币种" align="center" />
            <el-table-column prop="loanTerm" label="期数" align="center" />
            <el-table-column prop="startIntDate" label="起始日	" align="center" />
             <el-table-column prop="statusDesc" label="账户状态" align="center" />
            <el-table-column prop="" label="操作" align="center" width = "350">
                <template slot-scope="{row}">
	               <el-button size="mini" icon="el-icon-more" type="primary" @click="handleDetail(row)" >详情</el-button>
	                <el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleLoanPayment(row)" >贷款支付</el-button><!--v-show="updBtnFlag"-->
                </template> 
            </el-table-column>
        </el-table>
        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
       	</div>
   		<!--贷款支付信息-->   
        <el-dialog title="贷款支付信息" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp" >
                <el-form-item class="cl_td" label="账户代码" prop="corporationEntityNo">
                    <el-input v-model="tempUp.accountId" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="贷款金额" prop="loanAmount">
                    <el-input v-model="tempUp.loanAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="币种" prop="currencyCode">
                	<el-select v-model="tempUp.currencyCode" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in currencyCodeOptions"
	                        :key="index"
	                        :label="item.currencyCode"
	                        :value="item.currencyCode" disabled/>
	                </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="应支付金额" prop="payableAmount">
                    <el-input v-model="tempUp.payableAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="支付日期" prop="paymentDate">
                    <el-input v-model="tempUp.paymentDate" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="支付金额" prop="paymentAmount"
                	:rules="[ { required: true, message: '支付金额不能为空'}]">
                    <el-input v-model="tempUp.paymentAmount" class="wd200" type="text" />
                </el-form-item>
            </el-form>
         	<div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="subUpData()"> 确认</el-button>
                <el-button type="primary" @click="dialogFormVisibleUp = false"> 关闭</el-button>
            </div>
        </el-dialog>
        <!-- 查询详细信息 -->
        <el-dialog title="修改BIN信息" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail" :rules="rulesDetail" :model="tempDetail" >
               <el-form-item class="cl_td" label="账户代码" prop="corporationEntityNo">
                    <el-input v-model="tempDetail.accountId" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="信贷交易类型" prop="loanTypeTrans">
                    <el-input v-model="tempDetail.loanTypeTrans" class="wd200" type="text" readonly/>
                </el-form-item>
               	<el-form-item class="cl_td" label="贷款金额" prop="loanAmount">
                    <el-input v-model="tempDetail.loanAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="币种" prop="currencyCode">
                	 <el-input v-model="tempDetail.currencyCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="利率 %" prop="loanRate">
                	 <el-input v-model="tempDetail.loanRate" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="费率" prop="feeRate">
                    <el-input v-model="tempDetail.feeRate" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="总费用" prop="feeAmount">
                    <el-input v-model="tempDetail.feeAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="总期数" prop="loanTerm">
                    <el-input v-model="tempDetail.loanTerm" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="未抛账费用" prop="remainFeeAmount">
                    <el-input v-model="tempDetail.remainFeeAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="未抛账期数" prop="remainPeriod">
                    <el-input v-model="tempDetail.remainPeriod" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="未抛账本金" prop="remainPrincipalAmount">
                    <el-input v-model="tempDetail.remainPrincipalAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="下次抛账日" prop="nextThrowDate">
                    <el-input v-model="tempDetail.nextThrowDate" class="wd200" type="text" />
                </el-form-item>
               	<el-form-item class="cl_td" label="合同编号" prop="loanNum">
                    <el-input v-model="tempDetail.loanNum" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="还款方式" prop="repayModeInfo">
                    <el-input v-model="tempDetail.repayModeInfo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="贷款开始日期" prop="loanStartDate">
                    <el-input v-model="tempDetail.loanStartDate" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="未抛账期数" prop="remainPeriod">
                    <el-input v-model="tempDetail.remainPeriod" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="贷款结束日期" prop="loanEndDate">
                    <el-input v-model="tempDetail.loanEndDate" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="起息日期" prop="startIntDate">
                    <el-input v-model="tempDetail.startIntDate" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="免息天数" prop="freeDays">
                    <el-input v-model="tempDetail.freeDays" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="还款周期" prop="repayPrincipalCycle">
                    <el-input v-model="tempDetail.repayPrincipalCycle" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="执行利率%" prop="loanRate">
                    <el-input v-model="tempDetail.loanRate" class="wd200" type="text" />
                </el-form-item>
               <el-form-item class="cl_td" label="罚息上浮百分比" prop="penaltyUp">
                    <el-input v-model="tempDetail.penaltyUp" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="利息合计" prop="interAmount">
                    <el-input v-model="tempDetail.interAmount" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="未抛账利息" prop="remainInterAmount">
                    <el-input v-model="tempDetail.remainInterAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="收款账户" prop="directDebitAccountNo">
                    <el-input v-model="tempDetail.directDebitAccountNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="收款账户所属行号" prop="directDebitBankNo">
                    <el-input v-model="tempDetail.directDebitBankNo" class="wd200" type="text" readonly/>
                </el-form-item>
                 <el-form-item class="cl_td" label="状态" prop="statusInfo">
                    <el-input v-model="tempDetail.statusInfo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="已支付金额" prop="prepaidAmount">
                    <el-input v-model="tempDetail.prepaidAmount" class="wd200" type="text"readonly />
                </el-form-item>
                 <el-form-item class="cl_td" label="支付方式" prop="paymentPlan">
                    <el-input v-model="tempDetail.paymentPlan" class="wd200" type="text" readonly/>
                </el-form-item>
               	<el-form-item class="cl_td" label="支付状态" prop="payStatus">
                    <el-input  v-model="tempDetail.payStatus" class="wd200" type="text" readonly/>
                </el-form-item>
            </el-form>
            <el-table v-loading = "listLoading2" :data="detailList" class="mbtm20" fit highlight-current-row style="width: 100%;" border>
        	<el-table-column prop="accountId" label="账户代码" align="center" />
            <el-table-column prop="paymentModeDesc" label="支付方式" align="center" />
            <el-table-column prop="paymentDate" label="支付日期" align="center" />
            <el-table-column prop="paymentAmount" label="支付金额" align="center" />
            <el-table-column prop="paymentStatusDesc" label="支付状态	" align="center" />
            <el-table-column prop="realPaymentDate" label="实际支付日期" align="center" />
            
        </el-table>
        <pagination v-show="tableTotal2>0" :total="tableTotal2" :page.sync="detailPage.pageNum" :limit.sync="detailPage.pageSize" @pagination="getDetailList" />
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleDetail = false">取消</el-button>
            </div>
        </el-dialog>
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
	        // 权限
	        selBtnFlag: false,
	        addBtnFlag: false,
	        updBtnFlag: false,
	        btnAuthStr: '',
	        templateRadio: false,
	        // 列表
	        showList: false,
	        queryFormObj: {
	            pageNum: 1,
	            pageSize:10,
	        },
	        pickerOptionsEnd: {},
	        pickerOptionsStart: {},
	        listLoading1: false,
	        queryFormRef: {},
	        queryFormRules: {},      
	        tableList: [],
	        tableTotal: 0,
	        newList: {},
	        // 下拉框
	        originListOptions:[],
	        currencyCodeOptions: [],//币种
	       //贷款支付信息
	        tempUp: {},
	        rulesUp: {},
	        dataFormUp: {},
	        dialogFormVisibleUp: false,
	        //详情
	        listLoading2: false,
	        tempDetail: {}, 
	        rulesDetail: {},
	        dialogFormVisibleDetail: false,
	        tableTotal2: 0,
	        detailPage: {
	        	pageNum: 1,
	            pageSize:10,
	        },   
	        detailList: [],
	        listLoading2: false,
    	}
  	},
    created() {},
    mounted() {
    	// 运营模式 
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0072").then(res => {
            this.originListOptions = res
        })
        //卡组织
        this.getSelectDict( "dic_curreny").then(res => {
            this.currencyCodeOptions = res
        })
   	},
  	methods: {
	  	changeStart() {
	        this.pickerOptionsEnd = Object.assign({}, this.pickerOptionsEnd, {
	            disabledDate: (time) => {
	                return time.getTime() < new Date(this.queryFormObj.startDate).getTime()
	            }
	        })
	    },
	    // 生效日期
	    changeEnd() {
	        this.pickerOptionsStart = Object.assign({}, this.pickerOptionsStart, {
	            disabledDate: (time) => {
	                return time.getTime() > new Date(this.queryFormObj.endDate).getTime()
	            }
	        })
	    },
	    //重置
	    Reset(){
	    	this.queryFormObj = {}
	    },
	    handleSearch() {
	    	if(this.queryFormObj.externalIdentificationNo == null || this.queryFormObj.externalIdentificationNo == ""
	    	||this.queryFormObj.externalIdentificationNo == undefined){
			 	this.$message('输入查询条件');
			 	return;
			}
	    	this.showList = true
	        this.getList()
	    },
	     // 列表
	    getList() {
	        this.listLoading1 = true
	        this.queryFormObj.autoQuery = false
	        let objList = {
	            isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_loanType','dic_loanAccStatus'],//查找数据字典所需参数
				transDict : ['loanType','status'],//翻译前后key
	        }
	        objList = Object.assign(this.queryFormObj, objList)
	        this.getTableList('/nonfi/nonfinanceService/ILS.IQ.01.0040', objList,(res) => {
	        	this.listLoading1 = false
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
                if (err) {
	        	    this.listLoading1 = false
                    this.tableList = []
	                this.tableTotal = 0
                }
            })
	    },
	    //多选
	    handleSelectionChange(val) {
	        this.newList  = val
	    },
	    //显示贷款支付弹框
	    handleLoanPayment(row) {
	    	let params ={
				accountId: row.accountId,
				externalIdentificationNo: row.externalIdentificationNo,
				currencyCode: row.currencyCode,
				loanAmount: row.loanAmount
			};
			this.getTableList('/nonfi/nonfinanceService/ILS.IQ.01.0035', params,(res) => {
	            if (res.returnCode == '000000') {
	            	this.dialogFormVisibleUp = true
	               	this.tempUp = res.returnData.rows;
					this.tempUp.loanAmount = row.loanAmount;
					this.tempUp.currencyCode = row.currencyCode;
					this.$nextTick(() => {
				        this.$refs['dataFormUp'].clearValidate()
				    })
				}
	        }) 
		}, 
	   	//确认修改贷款支付数据
	    subUpData() {
	        let upObjData = {
	            ecommPostingAcctNmbr: this.tempUp.accountId,
	            loanAmount: this.tempUp.loanAmount,
				ecommTransPostingCurr: this.tempUp.currencyCode,
				payableAmount: this.tempUp.payableAmount,
				paymentDate: this.tempUp.paymentDate,
				paymentAmount: this.tempUp.paymentAmount
	        }
	        upObjData = Object.assign(this.queryFormObj, upObjData)
	        this.$refs['dataFormUp'].validate((valid) => {
	            if (valid) {
	                this.post('/card/cardService/ILS.RT.10.0025', upObjData, (res) => {
						if (res.returnCode == '000000') {
							this.dialogFormVisibleUp = false
							this.$notify({
							title: 'Success',
							message: '贷款变更成功',
							type: 'success',
							duration: 2000
							})
							this.getList()
						}
	                })
	            }
	        })
	    },
    	//显示查询弹框
	    handleDetail(row) {
	    	this.dialogFormVisibleDetail = true
	       	this.tempDetail = row;
			this.tempDetail.loanAmount = row.loanAmount;
			this.tempDetail.currencyCode = row.currencyCode;
			if(row.payStatus =='1'){
				this.tempDetail.payStatus = '未支付'
			}else if(row.payStatus =='2'){
				this.tempDetail.payStatus = '已支付'
			}else if(row.payStatus =='3'){
				this.tempDetail.payStatus = '部分支付'
			}
			if(row.paymentPlan == '0'){
				this.tempDetail.paymentPlan = '当日实时一次性支付';   
			}else if(row.paymentPlan == '1'){
				this.tempDetail.paymentPlan = '当日批量一次性支付';   
			}else if(row.paymentPlan == '2'){
				this.tempDetail.paymentPlan = '客户电话或在线申请实时支付贷款';   
			}else if(row.paymentPlan == '3'){
				this.tempDetail.paymentPlan = '客户设置支付日期一次或多次批量支付';   
			}
			if(row.status == '0'){
				this.tempDetail.statusInfo = '撤銷';   
			}else if(row.status == '1'){
				this.tempDetail.statusInfo = '正常';  
			}else if(row.status == '2'){
				this.tempDetail.statusInfo = '逾期';   
			}else if(row.status == '3'){
				this.tempDetailpe.statusInfo = '结清';   
			}
			else if(row.status == '4'){
				this.tempDetail.statusInfo = '全额退货';  
			}
			if(row.currencyCode == '156'){
				this.tempDetail.currencyCodeInfo = '人民币';   
			}else if(row.currencyCode == '840'){
				this.tempDetail.currencyCodeInfo = '美元';  
			}
			if(row.repayMode == '0'){
				this.tempDetail.repayModeInfo = '期末本息一次付清';   
			}else if(row.repayMode == '2'){
				this.tempDetail.repayModeInfo = '按固定周期付息、到期还本';  
			}else if(row.repayMode == '3'){
				this.tempDetail.repayModeInfo = '等额本息';  
			}else if(row.repayMode == '4'){
				this.tempDetail.repayModeInfo = '等额本金';   
			}else if(row.repayMode == '5'){
				this.tempDetail.repayModeInfo = '等本等息';   
			}else if(row.repayMode == '13'){
				this.tempDetail.repayModeInfo = '首期一次性付息分期还本';   
			}else if(row.repayMode == '14'){
				this.tempDetail.repayModeInfo = '气球贷(等额本息)';  
			}else if(row.repayMode == '15'){
				this.tempDetail.repayModeInfo = '气球贷(等额本金)';   
			}
			if(row.loanType == 'MERH'){
				this.tempDetail.loanTypeTrans = '商户分期';
			}else if(this.tempDetail.loanType == 'TXAT'){
				this.tempDetail.loanTypeTrans = '自动分期';
			}else if(row.loanType == 'CASH'){
				this.tempDetail.loanTypeTrans = '现金分期';
			}else if(row.loanType == 'STMT'){
				this.tempDetail.loanTypeTrans = '账单分期';
			}else if(row.loanType == 'TRAN'){
				this.tempDetail.loanTypeTrans = '交易分期';
			}else if(row.loanType == 'LOAN'){
				this.tempDetail.loanTypeTrans = '消费信贷';
			}else if(row.loanType == 'APAY'){
				this.tempDetail.loanTypeTrans = '随借随还';
	        }
			this.$nextTick(() => {
		        this.$refs['dataFormDetail'].clearValidate()
		    })
		},
	    getDetailList() {
	        this.listLoading2 = true
	        let objList = {
	           	accountId: this.tempDetail.accountId,
				externalIdentificationNo: this.queryFormObj.externalIdentificationNo,
				currencyCode: $scope.tempDetail.currencyCode,
				isTrans: true,
			transParams: ['dic_paymentDateTable','dic_paymentStatusTable'],
			transDict: ['paymentModeDesc','paymentStatus'],
	        }
	        objList = Object.assign(this.queryFormObj, objList)
	        this.getTableList('/nonfi/nonfinanceService/ILS.IQ.01.0030', objList,(res) => {
	        	this.listLoading2 = false
	            if (res.returnCode == '000000') {
	                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
	                    this.detailList = res.returnData.rows
	                    this.tableTotal2 = res.returnData.totalCount
	                }else {
	                    this.detailList = []
                        this.tableTotal2 = 0
	                }
	            }
	        }, (err) => {
                if (err) {
                    this.listLoading2 = false
                    this.detailList = []
                    this.tableTotal2 = 0
                }
            })
    	},
  	}
}
</script>

<style>
</style>
'
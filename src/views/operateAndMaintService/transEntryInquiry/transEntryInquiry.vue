<!-- 交易入账查询 -->
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
            <el-form-item class="cl_td" label="交易入账状态" prop="transBillingState">
                <el-select v-model="queryForm.transBillingState" class="wd200">
                    <el-option
                        v-for="(item, index ) in transBillingStateOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="开始日期" prop="startDate">
                <el-date-picker
                    v-model="queryForm.startDate"
                    class="wd200"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy 年 MM 月 dd 日"
                    :picker-options="pickerOptionsStart"
                    :clearable="true"
                    @change="changeStart"/>
            </el-form-item>
            <el-form-item class="cl_td" label="结束日期" prop="endDate">
                <el-date-picker
                    v-model="queryForm.endDate"
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
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()">查询</el-button>
                <el-button size="medium" icon="el-icon-search" type="primary" @click="resetChose()">重置</el-button>
                
            </div>
        </el-form>
        <el-table v-loading = "listLoading1" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
            <el-table-column prop="externalIdentificationNo" label="外部识别号/账户号" align="center" width="150px"/>
            <el-table-column prop="transDate" label="交易日期" align="center" />
            <el-table-column prop="transAmount" label="交易金额" align="center" />
            <el-table-column prop="transCurrCode" label="	交易币种" align="center" />
            <el-table-column prop="postingAmt" label="入账金额" align="center" />
            <el-table-column prop="postingCurrCode" label="入账币种" align="center" />
             <el-table-column prop="eventNo" label="证件类型" align="center" />
            <el-table-column prop="transDesc" label="交易描述" align="center" />
            <el-table-column prop="transBillingStateDesc" label="入账状态" align="center" />
			<el-table-column prop="" label="操作" align="center" width="200px">
                <template slot-scope="{row}">
                	<el-button size="mini" icon="el-icon-edit" type="primary" @click="handleDetail(row)" >查询</el-button><!--v-show="updBtnFlag"-->
             	</template> 
            </el-table-column>
        </el-table>
        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="getList" />
  		<el-dialog title="交易入账查询" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail" :rules="rulesDetail" :model="tempDetail" >
	            <el-form-item class="cl_td" label="客户号 " prop="customerNo">
                   <el-input v-model="tempDetail.customerNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="实时余额账户代码" prop="accountId">
                   <el-input v-model="tempDetail.accountId" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="实时余额货币" prop="currencyCode">
                   <el-input v-model="tempDetail.currencyCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="事件编号" prop="eventNo">
                   <el-input v-model="tempDetail.eventNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                   <el-input v-model="tempDetail.externalIdentificationNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易日期" prop="transDate">
                   <el-input v-model="tempDetail.transDate" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易货币小数位" prop="transCurrDecimal">
                   <el-input v-model="tempDetail.transCurrDecimal" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易币种" prop="transCurrCode">
                   <el-input v-model="tempDetail.transCurrCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易金额" prop="transAmount">
                   <el-input v-model="tempDetail.transAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易描述" prop="transDesc">
                   <el-input v-model="tempDetail.transDesc" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="业务类型代码" prop="businessTypeCode">
                   <el-input v-model="tempDetail.businessTypeCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="运营模式" prop="operationMode">
                   <el-input v-model="tempDetail.operationMode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="货币小数位" prop="currDeciaml">
                   <el-input v-model="tempDetail.currDeciaml" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="当期本金入账金额" prop="currPrincipalBalance">
                   <el-input v-model="tempDetail.currPrincipalBalance" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="账单本金入账金额" prop="billPrincipalBalance">
                   <el-input v-model="tempDetail.billPrincipalBalance" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="当期利息入账金额" prop="currInterestBalance">
                   <el-input v-model="tempDetail.currInterestBalance" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="账单利息入账金额" prop="billInterestBalance">
                   <el-input v-model="tempDetail.billInterestBalance" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="当期费用入账金额" prop="billInterestBalance">
                   <el-input v-model="tempDetail.billInterestBalance" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="账单费用入账金额" prop="billCostBalance">
                   <el-input v-model="tempDetail.billCostBalance" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="入账币种小数位" prop="postingCurrCode">
                   <el-input v-model="tempDetail.postingCurrCode" class="wd200" type="text"/>
                </el-form-item>
                <el-form-item class="cl_td" label="入账金额" prop="postingAmt">
                   <el-input v-model="tempDetail.postingAmt" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="入账转换汇率" prop="postingExchangeRate">
                   <el-input v-model="tempDetail.postingExchangeRate" class="wd200" type="text" readonly/>
                </el-form-item>
				<el-form-item class="cl_td" label="清算币种小数位" prop="clearCurrDecimal">
                   <el-input v-model="tempDetail.clearCurrDecimal" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="清算币种" prop="clearCurrCode">
                   <el-input v-model="tempDetail.clearCurrCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="清算金额" prop="clearAmount">
                   <el-input v-model="tempDetail.clearAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="授权码" prop="authCode">
                   <el-input v-model="tempDetail.authCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="MCC" prop="mcc">
                   <el-input v-model="tempDetail.mcc" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易国家代码" prop="transCountryCde">
                   <el-input v-model="tempDetail.postingExchangeRate" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易城市代码" prop="transCityCde">
                   <el-input v-model="tempDetail.transCityCde" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="来源码" prop="sourceCde">
                   <el-input v-model="tempDetail.sourceCde" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="收单参考号" prop="acquireReferenceNumbr">
                   <el-input v-model="tempDetail.acquireReferenceNumbr" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="渠道代码" prop="channelCde">
                   <el-input v-model="tempDetail.channelCde" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="商户代码" prop="merchantCde">
                   <el-input v-model="tempDetail.merchantCde" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="全局交易流水号 " prop="globalTransSerialNo">
                   <el-input v-model="tempDetail.globalTransSerialNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="原交易全局流水号" prop="oriGlobalTransSerialNo">
                   <el-input v-model="tempDetail.oriGlobalTransSerialNo" class="wd200" type="text" readonly />
                </el-form-item>
              	<el-form-item class="cl_td" label="交易入账状态" prop="viewTransStatus">
                   <el-select v-model="tempDetail.viewTransStatus" class="wd200" disabled   readonly>
                    <el-option
                        v-for="(item, index ) in transBillingStateOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                	</el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="入账处理日期" prop="postingDate">
                   <el-input v-model="tempDetail.postingDate" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="入账处理时间" prop="postingTime">
                   <el-input v-model="tempDetail.postingTime" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="重发入账次数" prop="postingRetryNum">
                   <el-input v-model="tempDetail.postingRetryNum" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="重发入账间隔" prop="postingRetryInterval">
                   <el-input v-model="tempDetail.postingRetryInterval" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="清算分配金额" prop="settleDistriAmount">
                   <el-input v-model="tempDetail.settleDistriAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="清算分配币种" prop="settleDistriCurrency">
                   <el-input v-model="tempDetail.settleDistriCurrency" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="清算分配币种小数位" prop="settleDistriCurrPoint">
                   <el-input v-model="tempDetail.settleDistriCurrPoint" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="溢缴款冻结金额" prop="overpayFrzAmount">
                   <el-input v-model="tempDetail.overpayFrzAmount" class="wd200" type="text" readonly/>
                </el-form-item>
               	<el-form-item class="cl_td" label="溢缴款冻结币种" prop="overpayFrzCurrCode">
                   <el-input v-model="tempDetail.overpayFrzCurrCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="溢缴款冻结小数位" prop="overpayFrzCurrPoint">
                   <el-input v-model="tempDetail.overpayFrzCurrPoint" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="溢缴款金额" prop="overpayAmount">
                   <el-input v-model="tempDetail.overpayAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                 <el-form-item class="cl_td" label="产品对象" prop="productObjectCode">
                   <el-input v-model="tempDetail.productObjectCode" class="wd200" type="text" readonly/>
                </el-form-item>
                 <el-form-item class="cl_td" label="分期期数" prop="installmentNum">
                   <el-input v-model="tempDetail.installmentNum" class="wd200" type="text" readonly/>
                </el-form-item>
               	<el-form-item class="cl_td" label="业务项目代码" prop="businessProgramNo">
                   <el-input v-model="tempDetail.businessProgramNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易处理标识" prop="transProcessFlag">
                   <el-input v-model="tempDetail.transProcessFlag" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="原交易入账账户" prop="oriTransPostingAccountId">
                   <el-input v-model="tempDetail.oriTransPostingAccountId" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="原交易入账账户币种" prop="oriTransPostingCurrCode">
                   <el-input v-model="tempDetail.oriTransPostingCurrCode" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="前序来源" prop="preorderSource">
                   <el-input v-model="tempDetail.preorderSource" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="产品形式代码" prop="productForm">
                   <el-input v-model="tempDetail.productForm" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="原交易日期" prop="oriTransDate">
                   <el-input v-model="tempDetail.oriTransDate" class="wd200" type="text" readonly/>
                </el-form-item>
               	<el-form-item class="cl_td" label="原交易入账账户币种" prop="oriTransPostingCurrCode">
                   <el-input v-model="tempDetail.oriTransPostingCurrCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="前序来源" prop="preorderSource">
                   <el-input v-model="tempDetail.preorderSource" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="产品形式代码" prop="productForm">
                   <el-input v-model="tempDetail.productForm" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="原交易日期" prop="oriTransDate">
                   <el-input v-model="tempDetail.oriTransDate" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="借贷记标识" prop="debitCreditFlagTrans">
                   <el-input v-model="tempDetail.debitCreditFlagTrans" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易识别代码" prop="transIdentifiNo">
                   <el-input v-model="tempDetail.transIdentifiNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="余额类型" prop="balanceTypeTrans">
                   <el-input v-model="tempDetail.balanceTypeTrans" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="分期期次" prop="installmentPeriod">
                   <el-input v-model="tempDetail.installmentPeriod" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="信贷参数" prop="loanPara">
                   <el-input v-model="tempDetail.loanPara" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="罚息利率" prop="penaltyInterestRate">
                   <el-input v-model="tempDetail.penaltyInterestRate" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="费用收取方式" prop="feeCollectTypeTrans">
                   <el-input v-model="tempDetail.feeCollectTypeTrans" class="wd200" type="text" readonly/>
                </el-form-item>
            </el-form>
	    	<div slot="footer" class="dialog-footer">
	            <el-button type="primary" @click="dialogFormVisibleDetail = false">取消</el-button>
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
            pickerOptionsEnd: '',
            pickerOptionsStart: '',
            //下拉
            idTypeList: [],
            transBillingStateOptions: [],
            //详情
            dialogFormVisibleDetail: false,
            dataFormDetail: {},
            tempDetail: {},
            rulesDetail: {},
            
        }
    },
    created() {
        
    },
    mounted() {
        this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))  //获取用户登录权限
		this.getList()
		//证件类型
		this.getSelectDict('dic_certificateType').then((res) => {
            this.idTypeList = res
        })
		//交易入账状态
		this.getSelectDict( "dic_transactionEntryStatus").then(res => {
            this.transBillingStateOptions = res
        })
		
   	},
    methods: {
    	changeStart() {
            this.pickerOptionsEnd = Object.assign({}, this.pickerOptionsEnd, {
                disabledDate: (time) => {
                    return time.getTime() < new Date(this.queryForm.startDate).getTime()
                }
            })
        },
        // 生效日期
        changeEnd() {
            this.pickerOptionsStart = Object.assign({}, this.pickerOptionsStart, {
                disabledDate: (time) => {
                    return time.getTime() > new Date(this.queryForm.endDate).getTime()
                }
            })
        },
        //重置
        resetChose(){
        	this.queryForm = {}
        },
       	// 列表
        getList() {
            this.listLoading1 = true
            let params = {
            	_CART: 'A',
                isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_transactionEntryStatus'],//查找数据字典所需参数
				transDict : ['transBillingState'],//翻译前后key
			}
            params = Object.assign(this.queryForm, params)   //合并
           	this.getTableList('/nonfi/nonfinanceService/BSS.IQ.03.0008', params,(res) => {
                 this.listLoading1 = false
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.tableList = res.returnData.rows
                        this.tableTotal = res.returnData.totalCount
                    }else{
                       this.tableList = []
                        this.tableTotal = 0
                    }
                }
            }, (err) => {
               if(err) {
                  this.tableList = []
                  this.tableTotal = 0
                  this.listLoading1 = false
               }
            })
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
        //详情展示的弹框
        handleDetail(row) {
           this.tempDetail = {}
            this.tempDetail = Object.assign({}, row)
            this.tempDetail.viewTransStatus= row.transBillingState 
           
            this.dialogFormVisibleDetail = true
            this.$nextTick(() => {
                this.$refs['dataFormDetail'].clearValidate()
            })
        }, 
    }
}
</script>

<style>
</style>

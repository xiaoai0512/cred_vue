<!-- 普通期消贷申请 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="transForm" :model="tableList">
            <el-form-item class="cl_td" label="外部识别号" prop="ecommEntryId">
                <el-input v-model="tableList.ecommEntryId" class="wd200" type="text" />
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()">查询</el-button>
                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="reset()">重置</el-button>
            </div>
        </el-form>
            
        <!--输入交易详细信息-->
        <div v-if="showInfo">
            <div class="clearboth"></div>
            <div class="mainname">1.客户产品信息</div>
            <el-form ref="dataFormTrans" :rules="formRules" :model="consumerLoan">
                <el-form-item class="cl_td" label="客户姓名 " prop="ecommCustName"  :rules="[ { required: true, message: '客户姓名 外部识别号不能为空'} ]">
                    <el-input v-model="consumerLoan.ecommCustName" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="客户代码" prop="ecommCustId" :rules="[ { required: true, message: '客户代码不能为空'} ]">
                    <el-input v-model="consumerLoan.ecommCustId" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="证件类型" prop="idType" :rules="[ { required: true, message: '证件类型不能为空'} ]">
                    <el-input v-model="consumerLoan.idType" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="证件号码" prop="idNumber" :rules="[ { required: true, message: '证件号码不能为空'} ]">
                    <el-input v-model="consumerLoan.idNumber" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="产品代码" prop="productObjectCode" :rules="[ { required: true, message: '产品代码不能为空'} ]">
                    <el-input v-model="consumerLoan.productObjectCode" class="wd200" type="text" />
                </el-form-item>
                <div class="clearboth"></div>
                <div class="mainname">2. 申请放款信息</div>
                <el-form-item class="cl_td" label="贷款合同号" prop="loanNum" :rules="[ { required: true, message: '贷款合同号不能为空'} ]">
                    <el-input v-model="consumerLoan.loanNum" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="贷款金额" prop="ecommTransAmount" :rules="[ { required: true, message: '贷款金额不能为空'} ]">
                    <el-input v-model="consumerLoan.ecommTransAmount" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="贷款币种" prop="ecommTransPostingCurr" :rules="[ { required: true, message: '交易币种不能为空'} ]">
                    <el-select v-model="consumerLoan.ecommTransPostingCurr" class="wd200">
                        <el-option v-for="(item, index) in ecommTransPostingCurrOptions" 
                        :key="index" 
                        :label="item.detailDesc" 
                        :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="还款方式" prop="repayMode" :rules="[ { required: true, message: '还款方式不能为空'} ]">
                    <el-select v-model="consumerLoan.repayMode" class="wd200">
                        <el-option v-for="(item, index) in repayModeOptions" 
                        :key="index" 
                        :label="item.detailDesc" 
                        :value="item.codes" />
                    </el-select>
                </el-form-item>
                <div class="" v-if="consumerLoan.repayMode==14 || consumerLoan.repayMode==15">
                    <el-form-item class="cl_td" label="参考期数" prop="balloonPeriod" :rules="[ { required: true, message: '参考期数不能为空'} ]">
                        <el-input v-model="consumerLoan.balloonPeriod" class="wd200" type="text" />
                    </el-form-item>
                </div>
                <el-form-item class="cl_td" label="利率类型" prop="rateInd" >
                    <el-select v-model="consumerLoan.rateInd" class="wd200">
                        <el-option v-for="(item, index) in rateIndOptions" 
                        :key="index" 
                        :label="item.detailDesc" 
                        :value="item.codes" />
                    </el-select>
                </el-form-item>
                 <el-form-item class="cl_td" label="利率" prop="loanRate">
                    <el-input v-model="consumerLoan.loanRate" class="wd200" type="text" />
                </el-form-item>
                 <el-form-item class="cl_td" label="期数" prop="monthSupplyPeriod" :rules="[ { required: true, message: '期数不能为空'} ]">
                    <el-input v-model="consumerLoan.monthSupplyPeriod" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="放款日" prop="payLoanDate"  >
                    <el-date-picker class="W200_date"
                      v-model="consumerLoan.payLoanDate"
                      type="date"
                      value-format="yyyy-MM-dd"    
                      placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item class="cl_td" label="还款间隔" prop="repayPrincipal">
                    <el-input v-model="consumerLoan.repayPrincipal" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="还款间隔单位 " prop="repayPrincipalUnit" >
                    <el-select v-model="consumerLoan.repayPrincipalUnit" class="wd200">
                        <el-option v-for="(item, index) in repayPrincipalUnitOptions" 
                        :key="index" 
                        :label="item.detailDesc" 
                        :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="免息天数" prop="freeDays">
                    <el-input v-model="consumerLoan.freeDays" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="还款日类型" prop="repaymentDateType" >
                    <el-select v-model="consumerLoan.repaymentDateType" class="wd200">
                        <el-option v-for="(item, index) in repaymentDateTypeOptions" 
                        :key="index" 
                        :label="item.detailDesc" 
                        :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="还款日" prop="repayDay">
                    <el-input v-model="consumerLoan.repayDay" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="首次还款日" prop="firstRepayDate"  >
                    <el-date-picker class="W200_date"
                      v-model="consumerLoan.firstRepayDate"
                      type="date"
                      value-format="yyyy-MM-dd"    
                      placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>
                <el-form-item class="cl_td" label="交易来源" prop="ecommSourceCde" :rules="[ { required: true, message: '交易来源不能为空'} ]">
                    <el-select v-model="consumerLoan.ecommSourceCde" class="wd200">
                        <el-option v-for="(item, index) in ecommSourceCdeOptions" 
                        :key="index" 
                        :label="item.detailDesc" 
                        :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="收款账号行号" prop="accountBankNo" :rules="[ { required: true, message: '收款账号行号不能为空'} ]">
                    <el-input v-model="consumerLoan.accountBankNo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="收款账户" prop="receiveAccount" :rules="[ { required: true, message: '收款账户不能为空'} ]">
                    <el-input v-model="consumerLoan.receiveAccount" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="放款机构编号" prop="loanInstitutionNo" :rules="[ { required: true, message: '放款机构编号不能为空'} ]">
                    <el-input v-model="consumerLoan.loanInstitutionNo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="法人编号" prop="corporateNo" :rules="[ { required: true, message: '法人编号不能为空'} ]">
                    <el-input v-model="consumerLoan.corporateNo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="支付方式" prop="paymentPlan">
                    <el-select v-model="consumerLoan.paymentPlan" class="wd200">
                        <el-option v-for="(item, index) in paymentPlanOptions" 
                        :key="index" 
                        :label="item.detailDesc" 
                        :value="item.codes" />
                    </el-select>
                </el-form-item>
                
            </el-form>
        </div>
        <div v-if="consumerLoan.paymentPlan=='3'">
            <div>3. 支付计划信息</div>
            <div class="cl_tr text_center" v-if="showInfo">
                <button class="layui-btn"   @click="tradTypeAdd()" type="button" style="float: right;margin-bottom: 8px;">
                                    新增 
                </button>
            </div>
            <table style="width:100%">
            <thead>
                <tr style="background-color: #DCDCDC;">
                    <th align="center" style="width:40%">支付日期</th>
                    <th align="center" style="width:40%">支付金额</th>
                    <th align="center" style="width:10%">操作</th>
                </tr>
            </thead>
            <tbody> 
                <tr v-for="(list,$index) in dateAmount">
                    <td align="center">
                        <div style="display: inline-block;padding: 2px 18px;width:50%;">
                        <el-date-picker
                            v-model="list.paymentDate"
                            type="date"
                            placeholder="选择日期">
                        </el-date-picker>
                        </div>
                    </td>
                    <td align="center">
                        <div style="display: inline-block;padding: 2px 18px;width:50%;"><input class="layui-input paymentAmount" name="paymentAmount"  
                            type="text" v-model="list.paymentAmount" validator="required"></div>
                    </td>
                    <td align="center" style="padding: 2px 18px;">
                        <button class="layui-btn"  @click="dateAmountDel(list,$index)">
                        删除
                        </button>
                    </td>
                </tr>
            </tbody>
            </table>
           
        </div>
        <div class="cl_tr text_center" v-if="showInfo">
            <el-button size="medium" round icon="el-icon-plus" type="primary" @click="getConsumerInfo(consumerLoan)" >试算</el-button>
            <el-button size="medium" round icon="el-icon-plus" type="primary" @click="sureHanle()" >确认</el-button>
        </div>
        <!--试算-->
        <el-dialog title="分期试算" :visible.sync="dialogFormVisiblegetConsumer" width="65%">
            <el-form   :model="consumerItem" class="mbtm20" fit highlight-current-row style="width: 100%;" border>
                <el-form-item class="cl_td" label="金额" prop="loanAmt">
                    <el-input v-model="consumerItem.loanAmt" class="wd200" type="text" readonly/>
                    
                </el-form-item>
                <el-form-item class="cl_td" label="年利率（%）" prop="loanRate" >
                    <el-input v-model="consumerItem.loanRate" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="费率" prop="feeRate" >
                    <el-input v-model="consumerItem.feeRate" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="总期数" prop="term" >
                    <el-input v-model="consumerItem.term" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="总费用" prop="allFeeAmt" >
                    <el-input v-model="consumerItem.allFeeAmt" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="总利息" prop="allIntAmt" >
                    <el-input v-model="consumerItem.allIntAmt" class="wd200" type="text" readonly />
                </el-form-item>
            </el-form >
            <div class="mainname">试算结果</div>
            <el-table  v-loading = "listLoading3" :data="tableConsumerList"  ref="consumerListRef" 
               class="mbtm20" fit  highlight-current-row   style="width: 100%;" border >
                <el-table-column prop="termNo" label="期次" align="center" />
                <el-table-column prop="throwDate" label="当期抛账日" align="center" />
                <el-table-column prop="principalAmount" label="应还本金" align="center" />
                <el-table-column prop="interestAmount" label="应还利息" align="center" />
                <el-table-column prop="feeAmount" label="应还费用" align="center" />
            </el-table>
            <pagination v-show="tableTotal3>0" :total="tableTotal3" :page.sync="consumerPage.pageNum" :limit.sync="consumerPage.pageSize" @pagination="getConsumerList" />
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisiblegetConsumer = false"  type="primary"> 关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import Pagination from "@/components/Pagination";
export default {
  name: 'instalQuery',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Pagination,
  },
  data() {
    return {
        radio: '1',
        // 权限
        selBtnFlag: false,
        addBtnFlag: false,
        updBtnFlag: false,
        btnAuthStr: '',
    
        // 列表
        queryFormObj: {
            pageNum: 1,
            pageSize:10,
        },
        tableId:'',
        templateSelection:'',
        currentRowId: null,
        listLoading: false,
        queryFormRef: {},
        queryFormRules: {},      
        tableList: {},
        consumerLoan: {
            ecommEntryId: '', 
            ecommTransAmount: '',
            ecommTransPostingCurr: '',
            ecommInstallmentPeriod: '',
        },
        tableTotal: 0,
        rulesAdd:{},
        showInfo: false,
        tableList2:[],
        tableListRef2:{},
        dateAmount:[{//支付计划
            paymentDate:'',
            paymentAmount:'',
        }],
        paymentAmountCount: 0,
        //分期试算
        consumerItem:{},
        dialogFormVisiblegetConsumer: false,
        tableTotal3: 0,
        listLoading3:false,
        tableConsumerList: [],//分期试算data
        consumerPage: {
            pageNum: 1,
            pageSize:10,
        },
        
        // 下拉框
        operationModeOptions: [], 
        ecommTransPostingCurrOptions:[],//交易币种
        ecommSourceCdeOptions: [],//交易来源
        ecommFeeCollectTypeOptions: [],//费用收取方式
        ecommInstallmentPeriodOptions: [],//分期期数
        repayModeOptions: [],//还款方式
        rateIndOptions: [],//利率类型
        repayPrincipalUnitOptions: [],//还款间隔单位
        repaymentDateTypeOptions: [],//还款日类型]
        paymentPlanOptions:[],//支付方式
        formRules: {},

    }
  },
  created() {
    this.getBtnAuth()
  },
    mounted() {
        // 运营模式 
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0006").then(res => {
            this.operationModeOptions = res
        })
        //币种
        this.getSelectDict( "dic_curreny").then(res => {
            this.ecommTransPostingCurrOptions = res
        })
        //分期期数
        this.getSelectDict( "dic_stageTerm").then(res => {
            this.ecommInstallmentPeriodOptions = res
        })
         //交易来源
        this.getSelectDict( "dic_transactionApproval").then(res => {
            this.ecommSourceCdeOptions = res
        })
        //费用收取方式
        this.getSelectDict( "dic_ecommFeeCollectType").then(res => {
            this.ecommFeeCollectTypeOptions = res
        })
        //利率类型
        this.getSelectDict( "dic_interestRateType").then(res => {
            this.rateIndOptions = res
        })
        //还款方式
        this.getSelectDict( "dic_repaymentMethod").then(res => {
            this.repayModeOptions = res
        })
        //还款日类型
        this.getSelectDict( "dic_repaymentDateType").then(res => {
            this.repaymentDateTypeOptions = res
        })
        //支付方式
         this.getSelectDict( "dic_paymentMethod").then(res => {
            this.paymentPlanOptions = res
        })
        
    },
  methods: {
    // 查询按钮权限
    getBtnAuth() {
        console.log(window.sessionStorage.getItem('menuNo'))
        let params= {
            menuNo : window.sessionStorage.getItem('menuNo')
        }
        this.getTableList('/beta/betaService/COS.CS.01.0030', params ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.length > 0 ) {
                    res.returnData.forEach(item => {
                        this.btnAuthStr += item.eventNo+','
                    })
                    if (this.btnAuthStr.includes('COS.IQ.02.0018')) { // 查询
                        this.selBtnFlag = true
                    } else {
                        this.selBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.AD.02.0018')) { // 新增
                        this.addBtnFlag = true
                    } else {
                        this.addBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.UP.02.0018')) { // 维护
                        this.updBtnFlag = true
                    } else {
                        this.updBtnFlag = false
                    }
                }
            }
        })
    },
    init() {
        this.tableList = {
            externalIdentificationNo: '',
        }
    },
     // 重置
    reset() {
      this.init()
    },
    // 点击查询按钮
    handleSearch() {
        if (!this.tableList.ecommEntryId ) {
            this.$message({
              message: '请输入查询信息',
              type: 'warning'
            }) 
            this.init()
        }
        this.showInfo=true
        this.getList()
    },
    // 列表
    getList() {
        let obj={
            ecommEntryId: this.tableList.ecommEntryId,
            externalIdentificationNo: this.tableList.ecommEntryId,
            
        }
        this.getTableList('/nonfi/nonfinanceService/ILS.IQ.01.0009', obj ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData !=null ) {
                    this.consumerLoan = res.returnData
                    this.consumerLoan.productObjectCode=res.returnData.ecommProdObjId
                    this.tableTotal = res.returnData.totalCount
                    this.listLoading = false
                } else {
                    this.consumerLoan = {}
                    this.consumerLoan.productObjectCode= ''
                    this.tableTotal = 0
                    this.listLoading = false
                }
            }
        }, (err) => {
            if (err) {
                this.consumerLoan = {}
                this.consumerLoan.productObjectCode= ''
                this.tableTotal = 0
                this.listLoading = false
            }
        })
    },
    //3.支付计划新增
    tradTypeAdd (){
        this.dateAmount.push({paymentDate:'',paymentAmount:''})
    },
    //支付计划 删除
    dateAmountDel(e,$index){
        this.dateAmount.splice($index,1);
    },
    //试算Btn
    getConsumerInfo() {
        if(this.consumerLoan.rateInd=='0' || this.consumerLoan.rateInd =='1' || this.consumerLoan.rateInd =='2'){
            if(this.consumerLoan.loanRate ==undefined){
                this.$message({
                  message: '请输入利率',
                  type: 'warning'
                })
            }
        }
        //还款方式  为 气球贷时，
        if(this.consumerLoan.repayMode == 14 || this.consumerLoan.repayMode == 15){
            if(this.consumerLoan.monthSupplyPeriod == this.consumerLoan.balloonPeriod){
                this.$message({
                  message: '参考期次等于期数/期限',
                  type: 'warning'
                })
            }
            if(Number(this.consumerLoan.monthSupplyPeriod) > Number(this.consumerLoan.balloonPeriod)){
                this.$message({
                  message: '参考期次小于期数/期限',
                  type: 'warning'
                })
            }
            
        }
        this.consumerLoan.ecommEntryId = this.consumerLoan.ecommEntryId;
        this.consumerLoan.repayPrincipalUnit = 'M';
        if(!this.consumerLoan.repayPrincipal){
            delete this.consumerLoan['repayPrincipal'];
        }
        if(!this.consumerLoan.freeDays){
            delete this.consumerLoan['freeDays'];
        }
        if(!this.consumerLoan.repayDay){
            delete this.consumerLoan['repayDay'];
        }
        if(!this.consumerLoan.penaltyUp){
            delete this.consumerLoan['penaltyUp'];
        }
        if(!this.consumerLoan.ecommPenaltyInterestRate){
            delete this.consumerLoan['ecommPenaltyInterestRate'];
        }
        if(this.consumerLoan.paymentPlan=='3'){
            this.consumerLoan.paymentPlanList=this.dateAmount;
            //支付计划为PPL2时，支付方式必须为ONLINE
//          this.paymentAmountCount = 0;
            console.log(this.consumerLoan.paymentPlanList)
            for(let item of this.consumerLoan.paymentPlanList) {
                
                if(JSON.stringify(item) == '{}'){
                    this.$message({
                        message: '请输入支付日期或支付金额',
                        type: 'warning'
                    }) 
                    return
                }
                // 循环检查每组的 日期字段 或 金额字段 必须存在
                if(!item.hasOwnProperty("paymentAmount") || !item.hasOwnProperty("paymentDate"))
                {
                    this.$message({
                        message: '请输入支付日期或支付金额',
                        type: 'warning'
                    })
                    return;
                }
                // 循环检查每组的 日期字段 或 金额字段 不能为空 或 不能为 undefined
                if(item.paymentDate == '' || item.paymentDate == 'undefined'){
                    this.$message({
                        message: '请先输入支付日期',
                        type: 'warning'
                    })
                    return
                }
                if(item.paymentAmount == '' || item.paymentAmount == 'undefined')
                {
                    this.$message({
                        message: '请先输入支付金额',
                        type: 'warning'
                    })
                    return
                }
               // console.log(item.paymentPlanList)
                // console.log(item.paymentAmount)
              //  console.log(item.paymentPlanList.paymentAmount)
             //   this.paymentAmountCount += parseInt(item.paymentPlanList.paymentAmount);
                this.paymentAmountCount += parseInt(item.paymentAmount);
            }
            console.log(this.paymentAmountCount)
            console.log(this.consumerLoan.ecommTransAmount)
            if(this.paymentAmountCount!=this.consumerLoan.ecommTransAmount){
                this.$message({
                    message: '支付金额相加必须等于贷款金额',
                    type: 'warning'
                })
                return;
            }
        }
        this.getConsumerList()
    },
    //试算调接口事件
    getConsumerList(){
        
        let params={
            ecommEntryId: this.consumerLoan.ecommEntryId,
            ecommSourceCde: this.consumerLoan.ecommSourceCde,
            ecommTransAmount: this.consumerLoan.ecommTransAmount,
            ecommTransPostingCurr: this.consumerLoan.ecommTransPostingCurr,
            externalIdentificationNo: this.consumerLoan.externalIdentificationNo,
            firstRepayDate: this.consumerLoan.firstRepayDate,
            freeDays: this.consumerLoan.freeDays,
            loanNum: this.consumerLoan.loanNum,
            loanRate: this.consumerLoan.loanRate,
            monthSupplyPeriod: this.consumerLoan.monthSupplyPeriod,
            payLoanDate: this.consumerLoan.payLoanDate,
            paymentPlan: this.consumerLoan.paymentPlan,
            rateInd: this.consumerLoan.rateInd,
            receiveAccount: this.consumerLoan.receiveAccount,
            repayDay: this.consumerLoan.repayDay,
            repayMode: this.consumerLoan.repayMode,
            repayPrincipal: this.consumerLoan.repayPrincipal,
            repaymentDateType: this.consumerLoan.repaymentDateType,
            externalIdentificationNo: this.consumerLoan.ecommEntryId,
            loanInstitutionNo: this.consumerLoan.loanInstitutionNo,
            //paymentPlanList
            repayPrincipalUnit: this.consumerLoan.repayPrincipalUnit,
            corporateNo: this.consumerLoan.corporateNo,
            accountBankNo :this.consumerLoan.accountBankNo
        }
       
        params = Object.assign(params, this.consumerPage,this.tableConsumerList)
        this.$refs['dataFormTrans'].validate((valid) => {
            if (valid) {
                this.listLoading3 = true
                this.getTableList('/card/cardService/ILS.IQ.01.0011', params ,(res) => {
                    this.listLoading3= false
                    if (res.returnCode == '000000') {
                        this.dialogFormVisiblegetConsumer = true
                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                            this.tableConsumerList = res.returnData.rows
                            this.consumerItem = res.returnData.obj
                            this.tableTotal3 = res.returnData.totalCount
                        }else{
                            this.tableConsumerList = []
                            this.consumerItem = {}
                            this.tableTotal3 = 0
                        }
                    }
                }, (err) => {
                    if (err) {
                        this.tableConsumerList = []
                        this.consumerItem = {}
                        this.tableTotal3 = 0
                    }
                })
            }
        })
    },  
    //确认提交消贷申请
    sureHanle() {
       let params={
            ecommEntryId: this.consumerLoan.ecommEntryId,
            ecommSourceCde: this.consumerLoan.ecommSourceCde,
            ecommTransAmount: this.consumerLoan.ecommTransAmount,
            ecommTransPostingCurr: this.consumerLoan.ecommTransPostingCurr,
            externalIdentificationNo: this.consumerLoan.externalIdentificationNo,
            firstRepayDate: this.consumerLoan.firstRepayDate,
            freeDays: this.consumerLoan.freeDays,
            loanNum: this.consumerLoan.loanNum,
            loanRate: this.consumerLoan.loanRate,
            monthSupplyPeriod: this.consumerLoan.monthSupplyPeriod,
            payLoanDate: this.consumerLoan.payLoanDate,
            paymentPlan: this.consumerLoan.paymentPlan,
            rateInd: this.consumerLoan.rateInd,
            receiveAccount: this.consumerLoan.receiveAccount,
            repayDay: this.consumerLoan.repayDay,
            repayMode: this.consumerLoan.repayMode,
            repayPrincipal: this.consumerLoan.repayPrincipal,
            repaymentDateType: this.consumerLoan.repaymentDateType,
            externalIdentificationNo: this.consumerLoan.ecommEntryId,
            loanInstitutionNo: this.consumerLoan.loanInstitutionNo,
            //paymentPlanList
            repayPrincipalUnit: this.consumerLoan.repayPrincipalUnit,
            corporateNo: this.consumerLoan.corporateNo,
            accountBankNo :this.consumerLoan.accountBankNo
        }
        params = Object.assign(params, this.consumerPage,this.tableConsumerList)
        this.$refs['dataFormTrans'].validate((valid) => {
            if (valid) {
                this.post('/card/cardService/ILS.RT.40.0001',  params, (res) => {
                    if (res.returnCode == '000000') {
                         this.$notify({
                        message: '申请成功',
                        type: 'success',
                        })
                        this.consumerLoan = {}
                        this.showInfo = false
                        this.tableList = {}
                    }
                })
            }
        })
    },
    //公共弹框
    msgDialog(msgTip) {
        const msg = this.$createElement;
        this.$msgbox({
          title: '提示',
          message: msg('p', null, [
            msg('span', {
              style: 'text-align:center;display: block'}, msgTip),
          ]),
          confirmButtonText: '确定',
        }).catch(() => {

        });
    },
  }
}
</script>

<style>
</style>

<!-- 分期管理 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <div class="mainname" style="font-weight: 0;">1.选择交易事件类型</div>
        <el-table  v-loading = "listLoading" :data="tableList"  ref="tableList" 
           class="mbtm20" fit  highlight-current-row   style="width: 100%;" border 
            @current-change="eventChange">
            <el-table-column width="80">
                <template slot-scope="scope">
                <el-radio v-model="curRowRadio" :label="scope.row.eventNo">
                    <span class="el-radio__label"></span>
                </el-radio>
                </template>
            </el-table-column>
            <el-table-column prop="eventNo" label="事件编号" align="center" />
            <el-table-column prop="eventDesc" label="事件描述" align="center" />
        </el-table>
        <pagination v-show="tableTotal1>0" :total="tableTotal1" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
        <!--输入交易详细信息-->
        <div class="mainname" style="font-weight: 0;">2.输入交易详细信息</div>
        <el-form ref="dataFormTrans" :rules="formRules" :model="transactionInfo">
            <!--专项分期-->
            <div v-if="showZx">
               <el-form-item class="cl_td" label="外部识别号" prop="ecommEntryId"  :rules="[ { required: true, message: '外部识别号不能为空'} ]">
                    <el-input v-model="transactionInfo.ecommEntryId" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="交易金额" prop="ecommTransAmount"  :rules="[ { required: true, message: '交易金额不能为空'} ]">
                    <el-input v-model="transactionInfo.ecommTransAmount" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="交易币种" prop="ecommTransPostingCurr">
                    <el-select v-model="transactionInfo.ecommTransPostingCurr" class="wd200">
                        <el-option v-for="(item, index) in ecommTransPostingCurrOptions" 
                        :key="index" 
                        :label="item.detailDesc" 
                        :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="分期期数" prop="ecommInstallmentPeriod" :rules="[ { required: true, message: '分期期数不能为空'} ]">
                    <el-select v-model="transactionInfo.ecommInstallmentPeriod" class="wd200">
                        <el-option v-for="(item, index) in ecommInstallmentPeriodOptions" 
                        :key="index" 
                        :label="item.detailDesc" 
                        :value="item.codes" />
                    </el-select>
                </el-form-item>
                <div v-if="transactionInfo.freeFlag=='FRDM'">
                    <el-form-item class="cl_td" label="参考期数" prop="ecommCalInstallmentPeriod" :rules="[ { required: true, message: '分期期数不能为空'} ]">
                        <el-select v-model="transactionInfo.ecommCalInstallmentPeriod" class="wd200">
                            <el-option v-for="(item, index) in ecommInstallmentPeriodOptions" 
                            :key="index" 
                            :label="item.detailDesc" 
                            :value="item.codes" />
                        </el-select>
                    </el-form-item>
                </div>
                <el-form-item class="cl_td" label="分期方式" prop="freeFlag" :rules="[ { required: true, message: '分期方式不能为空'} ]">
                    <el-select v-model="transactionInfo.freeFlag" class="wd200">
                        <el-option v-for="(item, index) in freeFlagOptions" 
                        :key="index" 
                        :label="item.detailDesc" 
                        :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="入账金额" prop="ecommTransAmount" >
                    <el-input v-model="transactionInfo.ecommTransAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="入账币种" prop="ecommTransPostingCurr">
                    <el-select v-model="transactionInfo.ecommTransPostingCurr" class="wd200" disabled>
                        <el-option v-for="(item, index) in ecommTransPostingCurrOptions" 
                        :key="index" 
                        :label="item.detailDesc" 
                        :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="收款行号" prop="accountBankNo" >
                    <el-input v-model="transactionInfo.accountBankNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="收款账号" prop="receiveAccount" >
                    <el-input v-model="transactionInfo.receiveAccount" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易来源" prop="ecommSourceCde">
                    <el-select v-model="transactionInfo.ecommSourceCde" class="wd200" >
                        <el-option v-for="(item, index) in ecommSourceCdeOptions" 
                        :key="index" 
                        :label="item.detailDesc" 
                        :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="费用收取方式" prop="ecommFeeCollectType">
                    <el-select v-model="transactionInfo.ecommFeeCollectType" class="wd200" >
                        <el-option v-for="(item, index) in ecommFeeCollectTypeOptions" 
                        :key="index" 
                        :label="item.detailDesc" 
                        :value="item.codes" />
                    </el-select>
                </el-form-item>
            </div>    
            <!--现金分期-->
            <div v-if="showXj">
               <el-form-item class="cl_td" label="外部识别号" prop="ecommEntryId"  :rules="[ { required: true, message: '外部识别号不能为空'} ]">
                    <el-input v-model="transactionInfo.ecommEntryId" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="交易金额" prop="ecommTransAmount"  :rules="[ { required: true, message: '交易金额不能为空'} ]">
                    <el-input v-model="transactionInfo.ecommTransAmount" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="交易币种" prop="ecommTransPostingCurr">
                    <el-select v-model="transactionInfo.ecommTransPostingCurr" class="wd200">
                        <el-option v-for="(item, index) in ecommTransPostingCurrOptions" 
                        :key="index" 
                        :label="item.detailDesc" 
                        :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="分期期数" prop="ecommInstallmentPeriod" :rules="[ { required: true, message: '分期期数不能为空'} ]">
                    <el-select v-model="transactionInfo.ecommInstallmentPeriod" class="wd200">
                        <el-option v-for="(item, index) in ecommInstallmentPeriodOptions" 
                        :key="index" 
                        :label="item.detailDesc" 
                        :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="入账金额" prop="ecommTransAmount" >
                    <el-input v-model="transactionInfo.ecommTransAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="入账币种" prop="ecommTransPostingCurr">
                    <el-select v-model="transactionInfo.ecommTransPostingCurr" class="wd200" disabled>
                        <el-option v-for="(item, index) in ecommTransPostingCurrOptions" 
                        :key="index" 
                        :label="item.detailDesc" 
                        :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="收款行号" prop="accountBankNo" >
                    <el-input v-model="transactionInfo.accountBankNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="收款账号" prop="receiveAccount" >
                    <el-input v-model="transactionInfo.receiveAccount" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易来源" prop="ecommSourceCde">
                    <el-select v-model="transactionInfo.ecommSourceCde" class="wd200" >
                        <el-option v-for="(item, index) in ecommSourceCdeOptions" 
                        :key="index" 
                        :label="item.detailDesc" 
                        :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="费用收取方式" prop="ecommFeeCollectType">
                    <el-select v-model="transactionInfo.ecommFeeCollectType" class="wd200" >
                        <el-option v-for="(item, index) in ecommFeeCollectTypeOptions" 
                        :key="index" 
                        :label="item.detailDesc" 
                        :value="item.codes" />
                    </el-select>
                </el-form-item>
            </div> 
            <!--账单分期-->
            <div v-if="showZd">
               <el-form-item class="cl_td" label="外部识别号" prop="ecommEntryId"  :rules="[ { required: true, message: '外部识别号不能为空'} ]">
                    <el-input v-model="transactionInfo.ecommEntryId" class="wd200" type="text" />
                    <el-button size="medium" type="primary" @click="choseAccBtn(transactionInfo)" v-show="showChoseBtn">选择账户</el-button>
                </el-form-item>
                <el-form-item class="cl_td" label="最大可分期金额" prop="billAmt" >
                    <el-input v-model="transactionInfo.billAmt" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="币种" prop="ecommTransPostingCurr">
                    <el-select v-model="transactionInfo.ecommTransPostingCurr" class="wd200" disabled>
                        <el-option v-for="(item, index) in ecommTransPostingCurrOptions" 
                        :key="index" 
                        :label="item.detailDesc" 
                        :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="分期金额" prop="billAmt" >
                    <el-input v-model="transactionInfo.billAmt" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="费用收取方式" prop="ecommFeeCollectType">
                    <el-select v-model="transactionInfo.ecommFeeCollectType" class="wd200" >
                        <el-option v-for="(item, index) in ecommFeeCollectTypeOptions" 
                        :key="index" 
                        :label="item.detailDesc" 
                        :value="item.codes" />
                    </el-select>
                </el-form-item>
            </div> 
            <!--交易分期-->
            <div v-if="showJy">
               <el-form-item class="cl_td" label="外部识别号" prop="ecommEntryId"  :rules="[ { required: true, message: '外部识别号不能为空'} ]">
                    <el-input v-model="transactionInfo.ecommEntryId" class="wd200" type="text" />
                    <el-button size="medium" type="primary" @click="choseAccBtn2(transactionInfo)" v-show="showChoseBtn">选择账户</el-button>
                </el-form-item>
                <el-form-item class="cl_td" label="分期期数" prop="ecommInstallmentPeriod" :rules="[ { required: true, message: '分期期数不能为空'} ]">
                    <el-select v-model="transactionInfo.ecommInstallmentPeriod" class="wd200">
                        <el-option v-for="(item, index) in ecommInstallmentPeriodOptions" 
                        :key="index" 
                        :label="item.detailDesc" 
                        :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="分期金额" prop="billAmt" >
                    <el-input v-model="transactionInfo.billAmt" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="入账币种" prop="ecommTransPostingCurr">
                    <el-select v-model="transactionInfo.ecommTransPostingCurr" class="wd200" disabled>
                        <el-option v-for="(item, index) in ecommTransPostingCurrOptions" 
                        :key="index" 
                        :label="item.detailDesc" 
                        :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="费用收取方式" prop="ecommFeeCollectType">
                    <el-select v-model="transactionInfo.ecommFeeCollectType" class="wd200" >
                        <el-option v-for="(item, index) in ecommFeeCollectTypeOptions" 
                        :key="index" 
                        :label="item.detailDesc" 
                        :value="item.codes" />
                    </el-select>
                </el-form-item>
            </div> 
            <div class="cl_tr text_center">
                <el-button size="medium" round icon="el-icon-plus" type="primary" @click="trialByStagesInfo(transactionInfo)" >分期试算</el-button>
                <el-button size="medium" round icon="el-icon-plus" type="primary" @click="confirmApplicationByStages()" >分期申请</el-button>
            </div>
        </el-form>
        <!--分期试算-->
        <el-dialog title="分期试算" :visible.sync="dialogFormVisibleTrans" width="65%" append-to-body>
            <el-form :data="billTrial" class="mbtm20" fit highlight-current-row style="width: 100%;" border>
                <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                    <el-input v-model="billTrial.externalIdentificationNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="业务类型" prop="ecommBusineseType" >
                    <el-input v-model="billTrial.ecommBusineseType" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="金额" prop="loanAmt" >
                    <el-input v-model="billTrial.loanAmt" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="币种" prop="currencyCode" >
                    <el-input v-model="billTrial.currencyCode" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="利率 %" prop="loanRate" >
                    <el-input v-model="billTrial.loanRate" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="费率" prop="feeRate" >
                    <el-input v-model="billTrial.feeRate" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="总费用" prop="allFeeAmt" >
                    <el-input v-model="billTrial.allFeeAmt" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="总期数" prop="term" >
                    <el-input v-model="billTrial.term" class="wd200" type="text" readonly/>
                </el-form-item>
            </el-form >
        <div class="mainname">分期试算结果</div>
        <el-table  v-loading = "listLoading2" :data="tableTrialList"  ref="tableList" 
           class="mbtm20" fit  highlight-current-row   style="width: 100%;" border >
            
            <el-table-column prop="termNo" label="期次" align="center" />
            <el-table-column prop="throwDate" label="当期抛账日" align="center" />
            <el-table-column prop="principalAmount" label="应还本金" align="center" />
            <el-table-column prop="interestAmount" label="应还利息" align="center" />
            <el-table-column prop="feeAmount" label="应还费用" align="center" />
        </el-table>
        <pagination v-show="tableTotal2>0" :total="tableTotal2" :page.sync="trialPage.pageNum" :limit.sync="trialPage.pageSize" @pagination="getTrialList" />
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleTrans = false"  type="primary"> 关闭</el-button>
        </div> 
        </el-dialog>
       <!--选择账户账单分期交易信息-->
        <el-dialog title="账单分期交易信息" :visible.sync="dialogFormVisibleBillDetail" width="65%">
            <el-form ref="billStagingForm" :model="billStagingData" >
                <el-form-item class="cl_td" label="账户代码" prop="systemUnitNo">
                    <el-input v-model="billStagingData.systemUnitNo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="业务项目" prop="systemUnitName">
                    <el-input v-model="billStagingData.systemUnitName" class="wd200" type="text" />
                </el-form-item>
            </el-form>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleAccountSearch(billStagingData)" >查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleAccountReset()">重置</el-button>
            </div>
            <el-table  v-loading= "listLoading3" :data="tableBillList1"  ref="tableList1" 
                class="mbtm20" fit  highlight-current-row   style="width: 100%;" border >
                <el-table-column ref="Table" type="index" label="选择" align="center" width="80">
                    <template slot-scope="scope">
                        <el-radio v-model="currentRowId2" :label="scope.$index" @change="changeRedio2($event,scope.row)">{{""}}</el-radio>
                    </template>
                </el-table-column>
                <el-table-column prop="businessProgramNoDesc" label="业务项目" align="center" />
                <el-table-column prop="productObjectCodeDesc" label="产品对象代码" align="center" />
                <el-table-column prop="billDate" label="账单日期" align="center" idth="100"/>
                <el-table-column prop="paymentDueDate" label="到期还款日" align="center" idth="100"/>
                <el-table-column prop="currencyCodeDesc" label="币种" align="center" width="70"/>
                <el-table-column prop="currentCycleNumber" label="账单周期号" align="center" width="70"/>
                <el-table-column prop="postingAmount" label="账单金额" align="center" />
                <el-table-column prop="" label="操作" align="center" >
                    <template slot-scope="{row}">
                        <el-button size="mini" icon="el-icon-document-copy"   type="primary" @click="handleInfo(row)">查看</el-button>
                    </template> 
                </el-table-column>
            </el-table>
            <pagination v-show="tableTotal3>0" :total="tableTotal3" :page.sync="billStagesPage1.pageNum" :limit.sync="billStagesPage1.pageSize" @pagination="getTrialList" />
            <div v-if="showList">
                <el-table  v-loading="listLoading4" :data="tableBillList2"  ref="tableList2" 
                   class="mbtm20" fit  highlight-current-row   style="width: 100%;" border >
                    <el-table-column ref="Table" type="index" label="选择" align="center" width="80">
                        <template slot-scope="scope">
                            <el-radio v-model="currentRowId3" :label="scope.$index" @change="changeRedio3($event,scope.row)">{{""}}</el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column prop="businessTypeCodeDesc" label="业务类型" align="center" />
                    <el-table-column prop="businessProgramNoDesc" label="业务项目" align="center" />
                    <el-table-column prop="productObjectCode" label="产品对象" align="center" />
                    <el-table-column prop="billDate" label="账单日期" align="center" />
                    <el-table-column prop="currencyCode" label="币种" align="center" />
                    <el-table-column prop="currentCycleNumber" label="账单周期号" align="center" />
                    <el-table-column prop="postingAmount" label="账单金额" align="center" />
                </el-table>
                <pagination v-show="tableTotal4>0" :total="tableTotal4" :page.sync="billStagesPage2.pageNum" :limit.sync="billStagesPage2.pageSize" @pagination="getTrialList" />
            </div>
            
            <div slot="footer" class="dialog-footer">
                <el-button  type="primary" @click="submitBill()">确定</el-button>
                <el-button  type="primary" @click="dialogFormVisibleBillDetail = false"> 取消</el-button>
            </div> 
        </el-dialog>
        <!--选择账户交易分期-->
        <el-dialog title="交易分期交易信息" :visible.sync="dialogFormVisibleTransactionDetail" width="65%">
            <el-table  v-loading= "listLoading5" :data="tableTransactionList"  ref="tableList1" 
                class="mbtm20" fit  highlight-current-row   style="width: 100%;" border >
                <el-table-column ref="Table" type="index" label="选择" align="center" width="80">
                    <template slot-scope="scope">
                        <el-radio v-model="currentRowId4" :label="scope.$index" @change="changeRedio4($event,scope.row)">{{""}}</el-radio>
                    </template>
                </el-table-column>
                <el-table-column prop="businessProgramNoDesc" label="外部识别号/账户号" align="center" />
                <el-table-column prop="transCurrCdeDesc" label="交易币种" align="center" />
                <el-table-column prop="transAmount" label="交易金额" align="center" idth="100"/>
                <el-table-column prop="transDate" label="交易日期" align="center" idth="100"/>
                <el-table-column prop="postingAmount" label="入账金额" align="center" width="70"/>
                <el-table-column prop="occurrDate" label="入账时间" align="center" width="70"/>
                <el-table-column prop="eventNo" label="事件编号" align="center" />
                <el-table-column prop="transStateDesc" label="交易状态" align="center" width="70"/>
                <el-table-column prop="transDesc" label="交易描述" align="center" />
            </el-table>
            <pagination v-show="tableTotal5>0" :total="tableTotal5" :page.sync="transactionPage.pageNum" :limit.sync="transactionPage.pageSize" @pagination="getTransactionList" />
            <div slot="footer" class="dialog-footer">
                <el-button  type="primary" @click="submitTransaction()">确定</el-button>
                <el-button  type="primary" @click="dialogFormVisibleTransactionDetail = false"> 取消</el-button>
            </div> 
        </el-dialog>
    </div>
</template>

<script>
import Pagination from "@/components/Pagination";
export default {
  name: 'StageBill',
  props: {
    // form
    transactionInfo: {
        type: Object,
        default: function () {
            return {
                ecommEntryId: '', 
                ecommTransAmount: '',
                ecommTransPostingCurr: '',
                ecommInstallmentPeriod: '',
            }
        }
    },
    showChoseBtn:{
        type: Boolean,
        default: true
    },

  },
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
        showZx: true,
        showXj: false,
        showZd: false,
        showJy: false,
        queryFormObj: {
            pageNum: 1,
            pageSize:10,
        },
        templateSelection:'',
        currentRowId: null,
        listLoading: false,
        queryFormRef: {},
        queryFormRules: {},      
        tableList: [],
       
        tableTotal1: 0,
        rulesAdd:{},
        // 选择交易事件类型 当前行
        curRowObj: {},
        curRowRadio: '',
        //分期试算
        trialInfo: [],
        tableTrialList: [],
        dialogFormVisibleTrans: false,
        tableTotal2: 0,
        listLoading2:false,
        dataEvent:{},
        billTrial:[],
        trialPage: {
            pageNum: 1,
            pageSize:10,
        },
      // 下拉框
        operationModeOptions: [], 
        ecommTransPostingCurrOptions:[],//交易币种
        ecommSourceCdeOptions: [],//交易来源
        ecommFeeCollectTypeOptions: [],//费用收取方式
        ecommInstallmentPeriodOptions: [],//分期期数
        freeFlagOptions: [],//分期方式
        
        formRules: {},
        //账单分期交易信息
        currentRowId2:null,
        currentRowId3:null,
        paychoseAccList:[],//
        paychoseAccListRules: {},
        dialogFormVisibleBillDetail: false,
        billStagingData:{},
        tableBillList1: [],
        tableBillList2: [],
        tableTotal3: 0,
        tableTotal4: 0,
        billStagingRules:{},
        listLoading3: false,
        listLoading4: false,
        showList: false,
        externalIdentificationNoNews: '',
        newList:{},
        billStagesPage1:{
            pageNum: 1,
            pageSize:10, 
        },
        billStagesPage2:{
            pageNum: 1,
            pageSize:10, 
        },
        //交易分期
        dialogFormVisibleTransactionDetail: false,
        transactionDetail: {},
        transactionForm: {},
        tableTransactionList: [],
        listLoading5: false,
        currentRowId2: '',
        transactionPage:{
            pageNum: 1,
            pageSize:10, 
        },    
        tableTotal5: 0,
        newTransactionList: '',
    }
  },
  created() {
    this.getBtnAuth()
  },
    mounted() {
        //币种
        this.getSelectDict( "dic_curreny").then(res => {
            this.ecommTransPostingCurrOptions = res
        })
        //分期期数
        this.getSelectDict( "dic_stageTerm").then(res => {
            this.ecommInstallmentPeriodOptions = res
        })
        //分期方式
        this.getSelectDict( "dic_byStages").then(res => {
            this.freeFlagOptions = res
        })
         //交易来源
        this.getSelectDict( "dic_redOriginFlag").then(res => {
            this.ecommSourceCdeOptions = res
        })
        //费用收取方式
        this.getSelectDict( "dic_ecommFeeCollectType").then(res => {
            this.ecommFeeCollectTypeOptions = res
        })
        this.getList()
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
    // 列表
    getList() {
        this.listLoading = true
        let obj={
            queryType: "stage",
           // stageType: 1,
        }
        obj = Object.assign(obj, this.queryFormObj)
        this.getTableList('/beta/betaService/COS.IQ.02.0039', obj ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.tableList = res.returnData.rows
                    this.tableTotal = res.returnData.totalCount
                    this.listLoading = false
                } else {
                    this.tableList =[]
                    this.tableTotal = 0
                    this.listLoading = false
                }
            }
        }, (err) => {
            if (err) {
                this.tableList =[]
                this.tableTotal = 0
                this.listLoading = false
            }
        })
    
    },
    //列表单选
    eventChange(val) {
        this.dataEvent = val
        if(this.dataEvent.eventNo =='ILS.RT.40.0003'){
            this.showZx = true
            this.showXj = false
            this.showZd= false
            this.showJy = false
        }else if(this.dataEvent.eventNo =='ILS.RT.40.0004'){
            this.showZx = false
            this.showXj = true
            this.showZd = false
            this.showJy = false
        }else if(this.dataEvent.eventNo =='ILS.RT.40.0005'){
            this.showZx = false
            this.showXj = false
            this.showZd = true
            this.showJy = false
        }else if(this.dataEvent.eventNo =='ILS.RT.40.0006'){
            this.showZx = false
            this.showXj = false
            this.showZd = false
            this.showJy = true
        }
    },
    //显示分期试算弹框
    trialByStagesInfo(row) {
        if(!this.dataEvent.eventNo){
            this.$message({
                title: '提示',
                message: '请至少选中一条',
                type: 'warning',
                duration: 2000
            })
            return;
        }
        if(this.transactionInfo =='ILS.RT.40.0005'){
            if(!this.transactionInfo.hasOwnProperty("billAmt")){
                this.$message({
                    title: '提示',
                    message: '最大可分期金额不能为空',
                    type: 'warning',
                    duration: 2000
                })
                return;
            }
        }
        if(this.transactionInfo.ecommTransAmount<=0 || !this.transactionInfo.ecommTransAmount){
            this.$message({
                title: '提示',
                message: '分期金额必须大于0',
                type: 'warning',
                duration: 2000
            })
            return;
        }
        if(this.transactionInfo.ecommTransAmount=='' ){
            this.$message({
                title: '提示',
                message: '分期金额不能为空',
                type: 'warning',
                duration: 2000
            })
            return;
        }
        this.trialInfo = Object.assign({}, row) //
        this.getTrialList()
        this.dialogFormVisibleTrans = true
        this.listLoading2 = true
    }, 
    //分期试算
    getTrialList() {
        let params={
           externalIdentificationNo: this.trialInfo.ecommEntryId,//页面输入的外部识别号
           ecommInstallmentBusinessType: this.dataEvent.installType,//分期业务类型
           eventNo: this.dataEvent.eventNo,//事件号
           ecommBusineseType: this.newList.businessTypeCode,//业务类型
           ecommBusinessProgramCode: this.newList.businessProgramNo,//业务项目 
           ecommProdObjId: this.newList.productObjectCode,//产品对象代码
           ecommCustId: this.newList.customerNo,//客户号码
           ecommPostingAcctNmbr: this.newList.accountId, //账户号
          
        }
        params = Object.assign(params, this.trialInfo,this.trialPage)
        this.getTableList('/card/cardService/ILS.IQ.01.0005', params ,(res) => {
            this.listLoading2 = false
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.billTrial = res.returnData.obj
                    this.tableTrialList = res.returnData.rows
                    this.tableTotal2 = res.returnData.totalCount
                } else {
                    this.billTrial = {}
                    this.tableTrialList = []
                    this.tableTotal2 = 0
                }
            }
        }, (err) => {
            if (err) {
                this.listLoading2 = false
                this.billTrial = {}
                this.tableTrialList = []
                this.tableTotal2 = 0
            }
        })
    },  
    //确认提交分期申请
    confirmApplicationByStages() {
        if(!this.dataEvent.eventNo){
            this.msgDialog("请选中一条记录")
            return;
        }
        if(!this.trialInfo.ecommEntryId){
            if(this.showEx == true){
                callback(new Error('请输入外部识别号'))
                return;
            }
        }
        this.eventNoTrends = "";
        this.transactionInfo.eventNo = this.dataEvent.eventNo;
        this.transactionInfo.ecommInstallmentBusinessType = this.dataEvent.installType
        this.transactionInfo.ecommTransPostingAmount = this.transactionInfo.ecommTransAmount;//分期金额
        this.transactionInfo.ecommBillAmt = this.transactionInfo.billAmt;//最大可分期金额
        this.transactionInfo.externalIdentificationNo =  this.transactionInfo.ecommEntryId;//页面输入的外部识别号
        this.transactionInfo.ecommBusineseType = this.newList.businessTypeCode;
        this.transactionInfo.ecommBusinessProgramCode = this.newList.businessProgramNo;
        this.transactionInfo.ecommCustId = this.newList.customerNo;
        this.transactionInfo.ecommProdObjId = this.newList.productObjectCode;
        this.transactionInfo.currBillFlag = '1'; 
        this.transactionInfo.ecommSourceCde = 'L';
        let eventNoTrends = ''
       	eventNoTrends = "/card/cardService/" + this.dataSetForm.eventNo
        this.$refs['dataFormTrans'].validate((valid) => {
            if (valid) {
                this.post(eventNoTrends,  this.transactionInfo, (res) => {
                    if (res.returnCode == '000000') {
                        this.$notify({
                        title: 'Success',
                        message: '分期成功',
                        type: 'success',
                        duration: 2000
                        })
                        this.getList()
                    }   
                })
            }
        })
    },
    //账单分期选择账户
    choseAccBtn(row){
        if(!this.dataEvent.eventNo){
            this.msgDialog("请选中一条记录")
            return;
        }
        this.billStagingData = Object.assign({}, row)
        this.$refs['dataFormTrans'].validate((valid) => {
            if (valid) {
                this.dialogFormVisibleBillDetail=true
                this.getBillStages()
            }
        })
    },
    //账单分期交易信息列表
    getBillStages(){
       let params={
            externalIdentificationNo: this.billStagingData.ecommEntryId, //页面输入的外部识别号
            payFlag: "Y",
        }
        params = Object.assign(params,this.billStagesPage1)
        this.getTableList('/nonfi/nonfinanceService/ILS.IQ.03.0020', params ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.tableBillList1 = res.returnData.rows
                    this.tableTotal3 = res.returnData.totalCount
                    this.tableBillList1.forEach(item => {
                        item.businessProgramNoDesc = item.businessProgramNo+ ' '+ item.programDesc
                        item.productObjectCodeDesc = item.productObjectCode+ ' '+ item.productDesc
                        item.currencyCodeDesc =item.currencyCode
                    })
                } else {
                    this.tableBillList1 = []
                    this.tableTotal3 = 0 
                }
            }
        }, (err) => {
            if (err) {
                this.tableBillList1 = []
                this.tableTotal3 = 0
            }
        })
    },
    //确认账单分期交易信息
    submitBill(){
        let list={
            businessProgramNo: this.newList.businessProgramNo,
            businessTypeCode: this.newList.businessTypeCode,
            currentCycleNumber: this.newList.currentCycleNumber,//
            customerNo: this.newList.customerNo, //客户号码
            externalIdentificationNo: this.billStagingData.ecommEntryId, //页面输入的外部识别号
            postingAmount: this.newList.postingAmount,
            postingCurrencyCode: this.newList.CurrencyCode,
            ecommBusineseType: this.newList.ecommBusineseType,
            ecommBusinessProgramCode: this.newList.ecommBusinessProgramCode,
        }
        this.post( "/nonfi/nonfinanceService/ILS.IQ.01.0001", list ,(res) => {
            this.dialogFormVisibleBillDetail=false
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.transactionInfo.billAmt = res.returnData.rows[0].billAmt
                    this.transactionInfo.ecommTransPostingCurr = res.returnData.rows[0].currencyCode
                    
                    this.getSelectDict( "dic_curreny", this.transactionInfo.ecommTransPostingCurr).then(res => {
                        this.ecommTransPostingCurrOptions = res
                    })
                } 
            }
        })
    },
    //交易分期选择账户
    choseAccBtn2(row){
        if(!this.dataEvent.eventNo){
            this.msgDialog("请选中一条记录")
            return;
        }
        this.transactionDetail = Object.assign({}, row)
        this.$refs['dataFormTrans'].validate((valid) => {
            if (valid) {
                this.dialogFormVisibleTransactionDetail=true
                this.getTransactionList()
            }
        })
    },
    //选择账户的交易分期列表
    getTransactionList(){
        this.listLoading5 = true
        let paramsData = {
            "pageSize" : this.transactionPage.pageNum,
            pageSize:  this.transactionPage.pageSize, 
            activityNo:'X8010',
            logLevel:"A",
            transProperty:"O",
            externalIdentificationNo: this.transactionDetail.ecommEntryId,
            payFlag : 'Y',
            ifTrans: 'true'
        }
        this.getTableList('/nonfi/nonfinanceService/ILS.IQ.03.0015', paramsData ,(res) => {
            this.listLoading5 = false
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.tableTransactionList = res.returnData.rows
                    this.tableTotal5 = res.returnData.totalCount
                    this.tableBillList1.forEach(item => {
                        item.transCurrCdeDesc = item.transCurrCde+ ' '+ item.transCurrDesc
                        
                    })
                } else {
                    this.tableTransactionList =[]
                    this.tableTotal5 = 0
                }
            }
        }, (err) => {
            if (err) {
                this.listLoading5 = false
                this.tableTransactionList =[]
                this.tableTotal5 = 0
            }
        })
    },
    //列表单选
    changeRedio4(event,row){
        this.newTransactionList=row
    },
    //确认
    submitTransaction(){
        let list={
            businessProgramNo: this.newTransactionList.businessProgramNoDesc,
            businessTypeCode: this.newTransactionList.businessTypeCode,
            currentCycleNumber: this.newTransactionList.currentCycleNumber,//
            customerNo: this.newTransactionList.customerNo, //客户号码
            externalIdentificationNo: this.transactionDetail.ecommEntryId, //页面输入的外部识别号
            postingAmount: this.newTransactionList.postingAmount,
            postingCurrencyCode: this.newTransactionList.CurrencyCode,
            ecommBusineseType: this.newTransactionList.ecommBusineseType,
            ecommBusinessProgramCode: this.newTransactionList.ecommBusinessProgramCode,
        }
        this.post( "/nonfi/nonfinanceService/ILS.IQ.01.0001", list ,(res) => {
            this.dialogFormVisibleTransactionDetail=false
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.transactionInfo.postingAmount = this.newTransactionList.postingAmount; //入账金额
                    this.transactionInfo.ecommTransPostingCurr = this.newTransactionList.transCurrCde;//入账币种
                    this.transactionInfo.ecommProdObjId = this.newTransactionList.productObjectCode;//产品对象代码
                    this.transactionInfo.ecommCustId = this.newTransactionList.customerNo;//客户号码
                    this.transactionInfo.ecommPostingAcctNmbr = this.newTransactionList.accountId;//账户号
                    this.transactionInfo.ecommBusineseType = this.newTransactionList.businessTypeCode;//业务类型
                    this.transactionInfo.ecommBusinessProgramCode = this.newTransactionListnf.businessProgramNo;//业务项目  
                    this.transactionInfo.newEcommTransAmount=this.newTransactionList.postingAmount;
                    this.transactionInfo.ecommOrigGlobalSerialNumbr = thisope.newTransactionList.globalSerialNumbr;//全局事件号
                } 
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

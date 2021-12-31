<!-- 交易分期 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <div class="mainname" style="font-weight: 0;">1.选择交易事件类型</div>
        <el-table  v-loading = "listLoading" :data="tableList"  ref="tableList" 
           class="mbtm20" fit  highlight-current-row   style="width: 100%;" border >
            <el-table-column ref="Table" type="index" label="选择" align="center" width="80">
                <template slot-scope="scope">
                    <el-radio v-model="currentRowId" :label="scope.$index" @change="changeRedio($event,scope.row)">{{""}}</el-radio>
                </template>
            </el-table-column>
            <el-table-column prop="eventNo" label="事件编号" align="center" />
            <el-table-column prop="eventDesc" label="事件描述" align="center" />
        </el-table>
        <pagination v-show="tableTotal1>0" :total="tableTotal1" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
        <!--输入交易详细信息-->
        <div class="mainname" style="font-weight: 0;">2.输入交易详细信息</div>
        <el-form ref="dataFormTrans" :rules="formRules" :model="transactionInfo">
            <el-form-item class="cl_td" label="外部识别号" prop="ecommEntryId"  :rules="[ { required: true, message: '外部识别号不能为空'} ]">
                <el-input v-model="transactionInfo.ecommEntryId" class="wd200" type="text" />
                 <el-button size="medium" type="primary" @click="choseAccBtn(transactionInfo.ecommEntryId)">选择账户</el-button>
            </el-form-item>
            <el-form-item class="cl_td" label="分期期数" prop="ecommInstallmentPeriod" :rules="[ { required: true, message: '分期期数不能为空'} ]">
                <el-select v-model="transactionInfo.ecommInstallmentPeriod" class="wd200">
                    <el-option v-for="(item, index) in ecommInstallmentPeriodOptions" 
                    :key="index" 
                    :label="item.detailDesc" 
                    :value="item.codes" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="分期金额" prop="ecommTransAmount">
                <el-input v-model="transactionInfo.ecommTransAmount" class="wd200" type="text" />
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
            <div class="cl_tr text_center">
                <el-button size="medium" round icon="el-icon-plus" type="primary" @click="trialByStagesInfo(transactionInfo)" >分期试算</el-button>
                <el-button size="medium" round icon="el-icon-plus" type="primary" @click="confirmApplicationByStages()" >分期申请</el-button>
            </div>
        </el-form>
        <!--分期试算-->
        <el-dialog title="分期试算" :visible.sync="dialogFormVisibleTrans" width="65%">
         <el-form   :data="billTrial" class="mbtm20" fit highlight-current-row style="width: 100%;" border>
            <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
            	<el-input v-model="billTrial.externalIdentificationNo" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="业务类型" prop="ecommBusineseType" >
                <el-input v-model="billTrial.ecommBusineseType" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="金额" prop="loanAmt" >
                <el-input v-model="billTrial.loanAmt" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="币种" prop="currencyCode" >
                <el-input v-model="billTrial.currencyCode" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="利率 %" prop="loanRate" >
                <el-input v-model="billTrial.loanRate" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="费率" prop="feeRate" >
                <el-input v-model="billTrial.feeRate" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="总费用" prop="allFeeAmt" >
                <el-input v-model="billTrial.allFeeAmt" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="总期数" prop="term" >
                <el-input v-model="billTrial.term" class="wd200" type="text" />
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
       <!--选择账户-->
        <el-dialog title="交易信息" :visible.sync="dialogFormVisibleBillDetail" width="65%">
         	<el-table  v-loading = "listLoading3" :data="tableBillList1"  ref="tableList1" 
               class="mbtm20" fit  highlight-current-row   style="width: 100%;" border >
               <el-table-column ref="Table" type="index" label="选择" align="center" width="80">
                    <template slot-scope="scope">
                        <el-radio v-model="selectRowId" :label="scope.$index" @change="changeRedio2($event,scope.row)">{{""}}</el-radio>
                    </template>
                </el-table-column>
                <el-table-column prop="accountId" label="外部识别号/账户号" align="center" />
                <el-table-column prop="transCurrCdeDesc" label="交易币种" align="center" />
                <el-table-column prop="transAmount" label="交易金额" align="center" />
                <el-table-column prop="transDate" label="交易日期" align="center" />
                <el-table-column prop="postingAmount" label="入账金额 " align="center" idth="100"/>
                <el-table-column prop="occurrDate" label="入账时间" align="center" idth="100"/>
                <el-table-column prop="eventNo" label="事件编号" align="center" width="70"/>
                <el-table-column prop="transStateDesc" label="交易状态" align="center" width="70"/>
                <el-table-column prop="transDesc" label="交易描述" align="center" />
            </el-table>
            <pagination v-show="tableTotal3>0" :total="tableTotal3" :page.sync="billStagesPage1.pageNum" :limit.sync="billStagesPage1.pageSize" @pagination="getBillStages" />
           	<div slot="footer" class="dialog-footer">
                <el-button @click="submitBill()">确定</el-button>
                <el-button @click="dialogFormVisibleBillDetail = false"> 取消</el-button>
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
	        radio: '1',
	     	// 列表
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
	        transactionInfo: {
	           ecommEntryId: '', 
	            ecommTransAmount: '',
	            ecommTransPostingCurr: '',
	            ecommInstallmentPeriod: '',
	        },
	        tableTotal1: 0,
	        rulesAdd:{},
	        //分期试算
	        trialInfo: [],
	        tableTrialList: [],
	        dialogFormVisibleTrans: false,
	        tableTotal2: 0,
	        listLoading2:false,
	        dataSetForm:{},
	        billTrial:[],
	        trialPage: {
	            pageNum: 1,
	            pageSize:10,
	        },
	        listLoading2	: false,
	      	// 下拉框
	        operationModeOptions: [], 
	        ecommTransPostingCurrOptions:[],//交易币种
	        ecommSourceCdeOptions: [],//交易来源
	        ecommFeeCollectTypeOptions: [],//费用收取方式
	        ecommInstallmentPeriodOptions: [],//分期期数
	        freeFlagOptions: [],//分期方式
	        formRules: {},
	        //交易信息
	        paychoseAccList:[],//
	        paychoseAccListRules: {},
	        dialogFormVisibleBillDetail: false,
	        billStagingData:{},
	        billStagingForm:{},
	        billStagingFormRules:{},
	        tableBillList1:[],//xiugai 11
	        tableTotal3: 0,
	        billStagingRules:{},
	        listLoading3: false,
	       	tableListRow: {},
	        showList: false,
	        selectRowId: null,
	        externalIdentificationNoNews: '',
	        newList:{},
	        billStagesPage1:{
	            pageNum: 1,
	            pageSize:10, 
	        },
   		}
  	},
  	created() {},
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
        this.getSelectDict( "dic_ecommSourceCde").then(res => {
            this.ecommSourceCdeOptions = res
        })
        //费用收取方式
        this.getSelectDict( "dic_ecommFeeCollectType").then(res => {
            this.ecommFeeCollectTypeOptions = res
        })
        this.getList()
    },
  	methods: {
	    // 列表
	    getList() {
	        this.listLoading = true
	        let obj={
	            queryType: "stage",
	            stageType: 0,
	        }
	        obj = Object.assign(obj,this.queryFormObj)
	        this.getTableList('/beta/betaService/COS.IQ.02.0001', obj ,(res) => {
	            if (res.returnCode == '000000') {
	                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
	                    this.tableList = res.returnData.rows
	                    this.tableTotal = res.returnData.totalCount
	                    this.listLoading = false
	                } else {
                        this.tableList = []
	                    this.tableTotal = 0
	                    this.listLoading = false
                    }
	            }
	        }, (err) => {
                if (err) {
                    this.tableList = []
                    this.tableTotal = 0
                    this.listLoading = false
                }
            })
	    },
	    //列表单选
	    changeRedio(event,row){
	        this.dataSetForm.eventNo=row.eventNo
	        this.dataSetForm.installType=row.installType
	    },
	    //显示分期试算弹框
	    trialByStagesInfo(row) {
	        if(!this.dataSetForm.eventNo){
	            this.msgDialog("请选中一条记录")
	            return;
	        }
	        if(this.transactionInfo.ecommTransAmount<=0 ){
	            this.msgDialog("分期金额必须大于0")
	            return;
	        }
	        this.dialogFormVisibleTrans = true
	        this.trialInfo = Object.assign({}, row) //
	        this.getTrialList()
	        this.$nextTick(() => {
	            this.$refs['dataFormTrans'].clearValidate()
	        })
	    }, 
	    //分期试算
	    getTrialList() {
	    	this.listLoading2 = true
	        this.dialogFormVisibleTrans = true
	        let params={
	           externalIdentificationNo: this.trialInfo.ecommEntryId,//页面输入的外部识别号
	           ecommInstallmentBusinessType: this.dataSetForm.installType,//分期业务类型
	           eventNo: this.dataSetForm.eventNo,//事件号
	           ecommBusineseType: this.newList.businessTypeCode,//业务类型
	           ecommBusinessProgramCode: this.newList.businessProgramNo,//业务项目 
	           ecommProdObjId: this.newList.productObjectCode,//产品对象代码
	           ecommCustId: this.newList.customerNo,//客户号码
	           ecommPostingAcctNmbr: this.newList.accountId, //账户号
	           
	        }
	        params = Object.assign(params, this.trialInfo,this.trialPage)
	        delete params.billAmt
	        this.$refs['dataFormTrans'].validate((valid) => {
	            if (valid) {
	               this.getTableList('/card/cardService/ILS.IQ.01.0005', params ,(res) => {
	               	 	this.listLoading2 = false
	                    if (res.returnCode == '000000') {
	                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
	                           	this.billTrial = res.returnData.obj
	                            this.tableTrialList = res.returnData.rows
	                            this.tableTotal2 = res.returnData.totalCount
	                        }
	                    } else {
	               	 	    this.listLoading2 = false
                            this.billTrial = {}
                            this.tableTrialList = []
                            this.tableTotal2 = 0
                        }
	                }, (err) => {
                        if (err) {
                            this.listLoading2 = false
                            this.billTrial = {}
                            this.tableTrialList = []
                            this.tableTotal2 = 0
                        }
                    })
	            }
	        })
	    },  
	    //确认提交分期申请
	    confirmApplicationByStages() {
	        if(!this.dataSetForm.eventNo){
	            this.msgDialog("请选中一条记录")
	            return;
	        }
	        if(!this.trialInfo.ecommEntryId){
	            if(this.showEx == true){
	                callback(new Error('请输入外部识别号'))
	                return;
	            }
	        }
	        this.transactionInfo.eventNo = this.dataSetForm.eventNo;
	        this.transactionInfo.ecommInstallmentBusinessType = this.dataSetForm.installType
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
	        delete this.transactionInfo.ecommTranAmount;
			delete this.transactionInfo.postingAmount; //分期金额
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
	    //选择账户信息
	    choseAccBtn(row){
	        if(!this.dataSetForm.eventNo){
	            this.msgDialog("请选中一条记录")
	            return;
	        }
	       	let ecommEntryIdItem=row
	        this.dialogFormVisibleBillDetail=true
	        this.getBillStages(ecommEntryIdItem)
	        
	    },
	    //账单分期交易信息列表
	    getBillStages(ecommEntryIdItem){
	       this.listLoading3 = true
	        let params={
	            externalIdentificationNo: ecommEntryIdItem, //页面输入的外部识别号
	            payFlag: "Y",
	            activityNo:'X8010',
	            logLevel:"A",
	            transProperty:"O",
	            payFlag : 'Y',
	            ifTrans: 'true',
	            isTrans: true,
				transParams: ['dic_ecommTransStatus'],
				transDict: ['transState'],
	        }
	        this.externalIdentificationNoNews = ecommEntryIdItem
	        params = Object.assign(params, this.billStagesPage1)
	        this.getTableList('/nonfi/nonfinanceService/ILS.IQ.03.0015', params ,(res) => {
	        	this.listLoading3 = false
	            if (res.returnCode == '000000') {
	                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
	                   	this.tableBillList1 = res.returnData.rows
	                    this.tableTotal3 = res.returnData.totalCount
	                    this.billStagesPage1 = res.returnData.totalCount
	                    this.tableBillList1.forEach(item => {
	                        item.transCurrCdeDesc = item.transCurrCde+ ' '+ item.transCurrDesc
	                       	if(item.externalIdentificationNo== null){
	                       		item.accountId=item.externalIdentificationNo
	                       	}else if(item.externalIdentificationNo != '' ){
	                       		item.accountId=item.externalIdentificationNo
	                       	}else if(item.externalIdentificationNo == '0000000000000000000' ){
	                       		item.accountId = item.externalIdentificationNo
	                       	}
	                    })
	                } else {
                        this.listLoading3 = false
                        this.tableBillList1 = []
                        this.tableTotal3 = 0
                        this.billStagesPage1 = 0
                    }
	            }else {
	        	    this.listLoading3 = false
                    this.tableBillList1 = []
                    this.tableTotal3 = 0
                    this.billStagesPage1 = 0
                }
	        }, (err) => {
                if (err) {
	        	    this.listLoading3 = false
                    this.tableBillList1 = []
                    this.tableTotal3 = 0
                    this.billStagesPage1 = 0
                }
            })
	    },
    	//列表单选
		changeRedio2(event,row){
	    	this.selectRowId = event;
	    	this.tableListRow = row
	 	},
	   	//交易信息确认保存
	    submitBill(){
	        this.transactionInfo.postingAmount= this.tableListRow.postingAmount//入账金额
	        this.transactionInfo.ecommTransPostingCurr= this.tableListRow.transCurrCdeDesc//入账币种
	        this.transactionInfo.ecommProdObjId= this.tableListRow.productObjectCode//产品对象代码
	        this.transactionInfo.ecommCustId= this.tableListRow.customerNo//客户号码
	        this.transactionInfo.ecommPostingAcctNmbr= this.tableListRow.accountId//账户号
	        this.transactionInfo.ecommBusineseType= this.tableListRow.businessTypeCode//业务类型
	       	this.transactionInfo.ecommBusinessProgramCode=  this.tableListRow.businessProgramNo//业务项目  
	        this.transactionInfo.ecommTransAmount= this.tableListRow.postingAmount
	       	this.transactionInfo.ecommOrigGlobalSerialNumbr=  this.tableListRow.globalSerialNumbr//全局事件号
	       	this.dialogFormVisibleBillDetail=false
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

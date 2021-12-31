<!-- 现金分期 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-table  v-loading = "listLoading" :data="tableList"  ref="tableList" 
           class="mbtm20" fit  highlight-current-row   style="width: 100%;" border >
            <el-table-column ref="Table"type="index" label="选择" align="center" width="80">
                <template slot-scope="scope">
                    <el-radio v-model="currentRowId" :label="scope.$index" @change="changeRedio($event,scope.row)">{{""}}</el-radio>
                </template>
            </el-table-column>
            <el-table-column prop="eventNo" label="事件编号" align="center" />
            <el-table-column prop="eventDesc" label="事件描述" align="center" />
        </el-table>
        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
        <!--输入交易详细信息-->
        <div class="mainname">2.输入交易详细信息</div>
        <el-form ref="dataFormTrans" :rules="formRules" :model="transactionInfo">
            <el-form-item class="cl_td" label="外部识别号" prop="ecommEntryId"  :rules="[ { required: true, message: '外部识别号不能为空'} ]">
                <el-input v-model="transactionInfo.ecommEntryId" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="交易金额" prop="ecommTransAmount" :rules="[ { required: true, message: '交易金额不能为空'} ]">
                <el-input v-model="transactionInfo.ecommTransAmount" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="交易币种" prop="ecommTransPostingCurr" :rules="[ { required: true, message: '交易币种不能为空'} ]">
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
            <el-form-item class="cl_td" label="入账金额" prop="ecommTransAmount">
                <el-input v-model="transactionInfo.ecommTransAmount" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="入账币种" prop="ecommTransPostingCurr">
                <el-select v-model="tableList.ecommTransPostingCurr" class="wd200">
                    <el-option v-for="(item, index) in ecommTransPostingCurrOptions" 
                    :key="index" 
                    :label="item.detailDesc" 
                    :value="item.codes" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="收款行号" prop="accountBankNo">
                <el-input v-model="transactionInfo.accountBankNo" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="收款账号" prop="receiveAccount">
                <el-input v-model="tableList.receiveAccount" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="交易来源" prop="ecommSourceCde">
                <el-select v-model="transactionInfo.ecommSourceCde" class="wd200">
                    <el-option v-for="(item, index) in ecommSourceCdeOptions" 
                    :key="index" 
                    :label="item.detailDesc" 
                    :value="item.codes" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="费用收取方式" prop="ecommFeeCollectType">
                <el-select v-model="transactionInfo.ecommFeeCollectType" class="wd200">
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
         <el-form   :data="tableCashList" class="mbtm20" fit highlight-current-row style="width: 100%;" border>
            <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                <el-input v-model="tableCashList.externalIdentificationNo" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="业务类型" prop="ecommBusineseType" >
                <el-input v-model="tableCashList.ecommBusineseType" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="金额" prop="loanAmt" >
                <el-input v-model="tableCashList.loanAmt" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="币种" prop="currencyCode" >
                <el-input v-model="tableCashList.currencyCode" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="利率 %" prop="loanRate" >
                <el-input v-model="tableCashList.loanRate" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="费率" prop="feeRate" >
                <el-input v-model="tableCashList.feeRate" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="总费用" prop="allFeeAmt" >
                <el-input v-model="tableCashList.allFeeAmt" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="总期数" prop="term" >
                <el-input v-model="tableCashList.term" class="wd200" type="text" />
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
            <el-button @click="dialogFormVisibleTrans = false"> 取消</el-button>
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
        tableTotal: 0,
        rulesAdd:{},
        //分期试算
        trialInfo: [],
        tableTrialList: [],
        dialogFormVisibleTrans: false,
        tableTotal2: 0,
        listLoading2:false,
        dataSetForm:{},
        tableCashList: [],
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
    // 列表
    getList() {
        this.listLoading = true
        let obj={
            queryType: "stage",
            stageType: 3,
            
        }
        obj = Object.assign(obj, this.queryFormObj)
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
        console.log('event,row:',event,row);
        this.dataSetForm.eventNo=row.eventNo
        this.dataSetForm.installType=row.installType
    },
    //显示分期试算弹框
    trialByStagesInfo(row) {
        if(!this.dataSetForm.eventNo){
            this.msgDialog("请选中一条记录")
            return;
        }
        this.trialInfo = Object.assign({}, row) //
        this.$refs['dataFormTrans'].validate((valid) => {
            if (valid) {
                this.dialogFormVisibleTrans = true
                this.listLoading2 = true
                this.getTrialList()
            }
        })
    }, 
    //分期试算
    getTrialList() {
        let params={
           externalIdentificationNo: this.trialInfo.ecommEntryId,
           ecommInstallmentBusinessType: this.dataSetForm.installType,
           eventNo: this.dataSetForm.eventNo,
            pageNum: this.trialPage.pageNum,
            pageSize:this.trialPage.pageSize
        }
        params = Object.assign(params, this.trialInfo)
        this.getTableList('/card/cardService/ILS.IQ.01.0005', params ,(res) => {
             this.listLoading2 = false
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.tableTrialList = res.returnData.rows
                    this.tableCashList = res.returnData.obj
                    this.tableTotal2 = res.returnData.totalCount
                    //this.listLoading2 = false
                } 
            }else {
                this.listLoading2 = false
                this.tableTrialList = []
                this.tableCashList = {}
                this.tableTotal2 = 0
            }
        }, (err) => {
            if (err) {
                this.listLoading2 = false
                this.tableTrialList = []
                this.tableCashList = {}
                this.tableTotal2 = 0
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
        this.eventNoTrends = "";
        this.transactionInfo.eventNo = this.dataSetForm.eventNo;
        this.transactionInfo.ecommInstallmentBusinessType = this.dataSetForm.installType
        this.transactionInfo.ecommTransPostingAmount = this.transactionInfo.ecommTransAmount;//分期金额
        this.transactionInfo.externalIdentificationNo =  this.transactionInfo.ecommEntryId;//页面输入的外部识别号
        this.transactionInfo.currBillFlag = '1'; 
        this.transactionInfo.ecommSourceCde = 'L';
        if(this.transactionInfo.eventNo == "ILS.RT.40.0006"){//交易分期
            this.transactionInfo.ecommTransPostingAmount = this.transactionInfo.newEcommTransAmount;
            delete this.transactionInfo.ecommTranAmount;
            delete this.transactionInfo.postingAmount; //分期金额
        }
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

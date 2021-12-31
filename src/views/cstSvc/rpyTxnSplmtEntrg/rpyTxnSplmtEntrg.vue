<!-- 还款交易补录 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <div class="mainname">1.选择交易事件类型</div>
        <el-table  v-loading = "listLoading" :data="tableList"  ref="tableList" 
           class="mbtm20" fit  highlight-current-row   style="width: 100%;" border >
            <el-table-column ref="Table"type="index" label="选择" align="center" width="80">
                <template slot-scope="scope">
                    <el-radio v-model="currentRowId1" :label="scope.$index" @change="changeRedio($event,scope.row)">{{""}}</el-radio>
                </template>
            </el-table-column>
            <el-table-column prop="eventNo" label="事件编号" align="center" />
            <el-table-column prop="eventDesc" label="事件描述" align="center" />
        </el-table>
        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
        <!--输入交易详细信息-->
        <div class="mainname">2.输入交易详细信息</div>
        <el-form ref="dataForm" :rules="repaymentRules" :model="repayment">
            <el-form-item v-if="showBtn1" class="cl_td" label="外部识别号" prop="ecommEntryId"  :rules="[ { required: true, message: '外部识别号不能为空'} ]">
                <el-input v-model="repayment.ecommEntryId" class="wd200" type="text" />
            </el-form-item>
            <el-form-item v-if="showBtn2" class="cl_td" label="外部识别号" prop="ecommEntryId"  :rules="[ { required: true, message: '外部识别号不能为空'} ]">
                <el-input v-model="repayment.ecommEntryId" class="wd200" type="text" />
                 <el-button size="medium" type="primary" @click="choseAccBtn(repayment)">选择账户</el-button>
            </el-form-item>
            <el-form-item v-if="showOriginList1" class="cl_td" label="账户代码" prop="ecommPostingAcctNmbr" :rules="[ { required: true, message: '账户代码不能为空'} ]">
                <el-input v-model="repayment.ecommPostingAcctNmbr" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="交易币种" prop="currencyCode" :rules="[ { required: true, message: '交易币种不能为空'} ]">
                <el-select v-model="repayment.currencyCode" class="wd200">
                    <el-option v-for="(item, index) in ecommTransCurrOptions" 
                    :key="index" 
                    :label="item.detailDesc" 
                    :value="item.codes" />
                </el-select>
            </el-form-item>
             <el-form-item class="cl_td" label="交易金额" prop="ecommTransAmount" :rules="[ { required: true, message: '交易金额不能为空'} ]">
                <el-input v-model="repayment.ecommTransAmount" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="交易日期" prop="ecommTransDate" width="100" :rules="[ { required: true, message: '交易日期不能为空'} ]">
                <el-date-picker class="W200_date"
                  v-model="repayment.ecommTransDate"
                  type="date"
                  value-format="yyyy-MM-dd"    
                  placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item class="cl_td" label="入账币种" prop="currencyCode" :rules="[ { required: true, message: '入账币种不能为空'} ]">
                <el-select v-model="repayment.currencyCode" class="wd200">
                    <el-option v-for="(item, index) in currencyCodeOptions" 
                    :key="index" 
                    :label="item.detailDesc" 
                    :value="item.codes" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="入账金额" prop="ecommTransAmount" :rules="[ { required: true, message: '入账金额不能为空'} ]">
                <el-input v-model="repayment.ecommTransAmount" class="wd200" type="text" />
            </el-form-item>
           <el-form-item class="cl_td" label="交易描述" prop="ecommTransDesc">
                <el-input v-model="repayment.ecommTransDesc" class="wd200" type="text" />
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" round icon="el-icon-plus" type="primary" @click="getDataInfo(repayment)" >确定</el-button>
           </div>
        </el-form>
         <!--选择账户-->
        <el-dialog title="账单分期交易信息" :visible.sync="dialogFormVisibleBillDetail" width="65%">
            <el-form ref="accountInfoForm" :model="accountInfo" >
                <el-form-item class="cl_td" label="账户代码" prop="accountId">
                    <el-input v-model="accountInfo.accountId" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="业务项目" prop="businessTypeCode">
                    <el-input v-model="accountInfo.businessTypeCode" class="wd200" type="text" />
                </el-form-item>
                <div class="cl_tr text_center">
                    <el-button size="medium" icon="el-icon-search" type="primary" @click="handleAccountSearch()" >查询</el-button>
                    <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleAccountReset()">重置</el-button>
                </div>
            
            <el-table  v-loading = "listLoading2" :data="tableAccountList"  ref="tableListRefs2" 
               class="mbtm20" fit  highlight-current-row   style="width: 100%;" border >
                <el-table-column ref="Table"type="index" label="选择" align="center" width="50">
                    <template slot-scope="scope">
                        <el-radio v-model="currentRowId2" :label="scope.$index" @change="changeRedio2($event,scope.row)">{{""}}</el-radio>
                    </template>
                </el-table-column>
                <el-table-column prop="accountId" label="账户代码" align="center" />
                <el-table-column prop="currencyDesc" label="币种" align="center" width="70"/>
                <el-table-column prop="businessProgramNoDesc" label="业务项目" align="center" idth="100"/>
                <el-table-column prop="businessTypeCodeDesc" label="业务类型" align="center" idth="100"/>
                <el-table-column prop="productObjectCodeDesc" label="产品对象代码" align="center" />
                <el-table-column prop="accountOrganFormDesc" label="组织形式" align="center" width="100"/>
                <el-table-column prop="businessDebitCreditCodeDesc" label="账户性质" align="center" width="70"/>
                <el-table-column prop="statusCodeDesc" label="账户状态码" align="center" width="70"/>
                <el-table-column prop="totalBalance" label="当前总余额" align="center" width="70" />
            </el-table>
            <pagination v-show="tableTotal2>0" :total="tableTotal2" :page.sync="tableAccounPage.pageNum" :limit.sync="tableAccounPage.pageSize" @pagination="getAccounList" />
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="handleSubmit()">确定</el-button>
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
        currentRowId1: null,
        listLoading: false,
        queryFormRef: {},
        queryFormRules: {},      
        tableList: [],
        tableTotal: 0,
        dataSetForm:{},
        /*2.输入交易详细信息*/
        repayment: {},
        dataForm:{},
        repaymentRules:{},
        showOriginList1:false,//账户代码
        showBtn1: true,//外部识别号不带选择账户按钮
        showBtn2: false,//外部识别号不带选择账户按钮
   
        // 下拉框
        ecommTransCurrOptions:[],//交易币种
        currencyCodeOptions: [],//入账币种
        //选择账户
        currentRowId2: null,
        accountInfo:{},
        tableAccountList: {},//列表
        listLoading2: false,
        tableListRefs2: {},
        tableTotal2: 0,
        dialogFormVisibleBillDetail:false,
        accountInfoItem: {},//选择账户回调
        accountIdNews: '', 
        tableAccounPage:{
            pageNum: 1,
            pageSize:10,
        },
        
    }
  },
    created() {
        let logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))
        this.operationMode = logininfo.operationMode
        this.getBtnAuth()
        this.getDateSearch()
    },
    mounted() {
        let obj={
            operationMode: this.operationMode,
            applicationRange: 'A',
            
        }
        let objInfo={
            operationMode: this.operationMode,
        }
        //入账币种
        this.getSelectDict( "dic_curreny",objInfo).then(res => {
            this.currencyCodeOptions = res
        })
        //交易币种
        this.getSelectDict( "dic_curreny").then(res => {
            this.ecommTransCurrOptions = res
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
            queryType: "P",
       }
        this.getTableList('/beta/betaService/COS.IQ.02.0039', obj ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.tableList = res.returnData.rows
                    this.tableTotal = res.returnData.totalCount
                    this.listLoading = false
                }
            }
        })
        
    },
    //交易日期
    getDateSearch() {
        //this.listLoading = true
        let obj={
            systemUnitNo: "100",
        }
        this.getTableList('/beta/betaService/COS.IQ.02.0038', obj ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.$set(this.repayment, "ecommTransDate", new Date());
                    this.repayment.ecommTransDate = res.returnData.rows[0].nextProcessDate;
                }
            }
        })
    },
    //列表单选
    changeRedio(event,row){
        this.dataSetForm.eventNo=row.eventNo
        this.dataSetForm.eventDesc=row.eventDesc
        this.dataSetForm.installType=row.installType
        //实时还款事件（指定账户)=====外部识别号选择账户显示非只显示外部识别号不显示按钮，账户代码显示
        //console.log(this.dataSetForm.eventDesc)
        if(this.dataSetForm.eventDesc == '实时还款事件（指定账户）'){
            this.showOriginList1=true
            this.showBtn1=false
            this.showBtn2=true
            
        }else{
            this.showOriginList1=false
            this.showBtn1=true
            this.showBtn2=false
        }
    },
    //选择账户
    choseAccBtn(row){
        if(!this.dataSetForm.eventNo){
            this.msgDialog("请选中一条记录")
            return;
        }
        this.dialogFormVisibleBillDetail=true
        this.accountInfo = Object.assign({}, row)
        this.getAccounList()
        this.$nextTick(() => {
            this.$refs['accountInfoForm'].clearValidate()
        })
    },
    //选择账户信息列表
    getAccounList(){
        this.listLoading2=true
        this.dialogFormVisibleBillDetail=true
        let params={
           externalIdentificationNo: this.accountInfo.ecommEntryId, //页面输入的外部识别号
            // ecommInstallmentBusinessType: this.dataSetForm.installType,
           //eventNo: this.dataSetForm.eventNo,
           flag: "N",
           payFlag: "Y",
        }
        this.externalIdentificationNoNews =this.accountInfo.ecommEntryId
        this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0118', params ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.listLoading2=false
                    this.tableAccountList = res.returnData.rows
                    this.tableTotal2 = res.returnData.totalCount
                    this.tableAccountList.forEach(item => {
                        item.businessProgramNoDesc = item.businessProgramNo+ ' '+ item.programDesc//业务项目
                        item.businessTypeCodeDesc = item.businessTypeCode+ ' '+ item.businessDesc//业务类型
                        item.productObjectCodeDesc=item.productObjectCode+ ' '+item.productDesc//产品对象代码
                        //item.currencyCodeDesc =item.currencyCode
                    })
                }
            }
        })
    },
    //选择账户单选
    changeRedio2(event,row){
        this.accountIdNews=row.accountId
        this.accountInfoItem=row
    },
    //选择账户确认
    handleSubmit(){
        if(!this.accountIdNews){
            this.msgDialog("请选中一条记录")
            return;
        }
        this.dialogFormVisibleBillDetail=false
        this.repayment.ecommPostingAcctNmbr = this.accountInfoItem.accountId//账户代码
        this.repayment.currencyCode = this.accountInfoItem.currencyCode//交易币种
        //入账币种
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0034",this.repayment.currencyCode).then(res => {
            this.currencyCodeOptions = res
        })
        //交易币种
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0012",this.repayment.currencyCode).then(res => {
            this.ecommTransCurrOptions = res
        })
        this.$nextTick(() => {
            this.$refs['accountInfoForm'].clearValidate()
        })
    },
    //确认提交
    getDataInfo(item) {
        if(!this.dataSetForm.eventNo){
            this.msgDialog("请选中一条记录")
            return;
        }
        let obj={
            ecommTransCurr: this.repayment.currencyCode,  
            ecommTransPostingCurr: this.repayment.currencyCode,
            eventId: this.dataSetForm.eventNo,
            ecommTransPostingAmount:  this.repayment.ecommTransAmount,
        }
        obj = Object.assign(this.repayment, obj)
        this.$refs['dataForm'].validate((valid) => {
            if (valid) {
                this.post('/card/cardService/ISS.RT.20.0002',  obj, (res) => {
                    if (res.returnCode == '000000') {
                        this.$notify({
                        title: 'Success',
                        message: '交易成功',
                        type: 'success',
                        duration: 2000
                        })
                        this.getDateSearch()
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

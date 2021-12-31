<!-- 费用调整补录 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <div class="mainname">1.选择交易事件类型</div>
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
        <el-form ref="dataForm" :rules="manualTransactionRules" :model="manualTransaction">
            <el-form-item class="cl_td" label="外部识别号" prop="ecommEntryId"  :rules="[ { required: true, message: '外部识别号不能为空'} ]">
                <el-input v-model="manualTransaction.ecommEntryId" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="交易币种" prop="ecommTransCurr" :rules="[ { required: true, message: '交易币种不能为空'} ]">
                <el-select v-model="manualTransaction.ecommTransCurr" class="wd200">
                    <el-option v-for="(item, index) in ecommTransCurrOptions" 
                    :key="index" 
                    :label="item.currencyDesc" 
                    :value="item.currencyCode" />
                </el-select>
            </el-form-item>
             <el-form-item class="cl_td" label="交易金额" prop="ecommTransAmount" :rules="[ { required: true, message: '交易金额不能为空'} ]">
                <el-input v-model="manualTransaction.ecommTransAmount" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="交易日期" prop="ecommTransDate" width="100" :rules="[ { required: true, message: '交易日期不能为空'} ]">
                <el-date-picker class="W200_date"
                  v-model="manualTransaction.ecommTransDate"
                  type="date"
                  value-format="yyyy-MM-dd"    
                  placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item class="cl_td" label="入账币种" prop="ecommTransPostingCurr" :rules="[ { required: true, message: '入账币种不能为空'} ]">
                <el-select v-model="manualTransaction.ecommTransPostingCurr" class="wd200" @change="ecommTransPostingCurrChange($event)">
                    <el-option v-for="(item, index) in currencyCodeOptions" 
                    :key="index" 
                    :label="item.currencyDesc" 
                    :value="item.currencyCode" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="入账金额" prop="ecommTransPostingAmount" :rules="[ { required: true, message: '入账金额不能为空'} ]">
                <el-input v-model="manualTransaction.ecommTransPostingAmount" class="wd200" type="text" />
            </el-form-item>
             <el-form-item class="cl_td" label="交易场景" prop="transSceneCode"
             	:rules="[ { required: true, message: '入账金额不能为空'} ]">
                <el-select v-model="manualTransaction.transSceneCode" class="wd200">
                    <el-option v-for="(item, index) in transSceneCodeOptions" 
                    :key="index" 
                    :label="item.concat" 
                    :value="item.transSceneCode" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="交易来源" prop="originList" v-if="showOriginList1">
                <el-select v-model="manualTransaction.originList" class="wd200">
                    <el-option v-for="(item, index) in originListOptions" 
                    :key="index" 
                    :label="item.originDesc" 
                    :value="item.originList" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" v-if="showOriginList2" label="交易来源" prop="originList" :rules="[ { required: true, message: '交易来源不能为空'} ]">
                <el-select v-model="manualTransaction.originList" class="wd200">
                    <el-option v-for="(item, index) in originListOptions" 
                    :key="index" 
                    :label="item.originDesc" 
                    :value="item.originList" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="交易描述" prop="ecommTransDesc">
                <el-input v-model="manualTransaction.ecommTransDesc" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="MCC" prop="ecommMcc">
                <el-input v-model="manualTransaction.ecommMcc" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="交易国家代码" prop="ecommTransCountryCde">
                <el-input v-model="manualTransaction.ecommTransCountryCde" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="交易城市代码" prop="ecommTransCityCde">
                <el-input v-model="manualTransaction.ecommTransCityCde" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="交易机构" prop="organNo">
                <el-select v-model="manualTransaction.organNo" class="wd200">
                    <el-option v-for="(item, index) in organNoOptions" 
                    :key="index" 
                    :label="item.organName" 
                    :value="item.organNo"/>
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="商户编号" prop="ecommMerchantCde">
                <el-input v-model="manualTransaction.ecommMerchantCde" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="收单参考号" prop="ecommAcquireReferenceNumbr">
                <el-input v-model="manualTransaction.ecommAcquireReferenceNumbr" class="wd200" type="text" />
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" round icon="el-icon-plus" type="primary" @click="getDataInfo(manualTransaction)" >确定</el-button>
           </div>
        </el-form>
       
       
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
        currentRowId: null,
        listLoading: false,
        queryFormRef: {},
        queryFormRules: {},      
        tableList: [],
        tableTotal: 0,
        dataSetForm:{},
        /*2.输入交易详细信息*/
        manualTransaction: {},
        dataForm:{},
        manualTransactionRules:{},
        showOriginList1:false,
        showOriginList2: false,
   
      // 下拉框
        transSceneCodeOptions: [], //交易场景
        ecommTransCurrOptions:[],//交易币种
        organNoOptions: [],//交易机构
        currencyCodeOptions: [],//入账币种
        originListOptions: [],//交易来源
        formRules: {},

    }
  },
    created() {
        let logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))
        this.operationMode = logininfo.operationMode
        this.getBtnAuth()
        
    },
    mounted() {
        let obj={
           operationMode: this.operationMode,
            applicationRange: 'A',
             pageSize:10,
                indexNo:0
        }
       
        // 交易场景
        this.getSelectDict( "/beta/betaService/AUS.PM.01.0202",obj).then(res => {
           let rows = res
            rows.forEach(item => {
                item.concat = item.transSceneCode+'-'+item.transSceneDesc;
            })
            this.transSceneCodeOptions = res
        })
        //交易来源
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0069",obj).then(res => {
           let rows = res
            rows.forEach(item => {
                item.concat = item.originList+'-'+item.originDesc;
            })
            this.originListOptions = res
        })
        //入账币种
        let objInfo={
            operationMode: this.operationMode,
        }
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0034",objInfo).then(res => {
            this.currencyCodeOptions = res
        })
        //交易币种
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0012").then(res => {
            this.ecommTransCurrOptions = res
        })
        //交易机构
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0005").then(res => {
            this.organNoOptions = res
        })
        this.getList()
        this.getDateSearch()
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
            queryType: "D",
            pageNum: 0,
            pageSize: 10,
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
     //交易日期&&原始交易日期
    getDateSearch() {
        this.listLoading = true
        let obj={
            systemUnitNo: "100",
            pageNum: 0,
            pageSize: 10,
        }
        this.post('/beta/betaService/COS.IQ.02.0038', obj ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                     //解决赋值后无法编辑，使用$set给定了一个初始值,在赋值
                    this.$set(this.manualTransaction, "ecommTransDate", new Date());
                    this.manualTransaction.ecommTransDate = res.returnData.rows[0].nextProcessDate;
                }
            }
        })
    },
    //列表单选
    changeRedio(event,row){
        //console.log('event,row:',event,row);
        this.dataSetForm.eventNo=row.eventNo
        this.dataSetForm.eventDesc=row.eventDesc
        this.dataSetForm.installType=row.installType
        //交易来源=====取现时必输，消费不必输
        console.log(this.dataSetForm.eventDesc)
        if(this.dataSetForm.eventDesc == '实时取现事件' ){
            this.showOriginList1=false
            this.showOriginList2=true
        }else if(this.dataSetForm.eventDesc == '实时消费事件'){
            this.showOriginList1=true
            this.showOriginList2=false
        }
    },
    //根据入账币种判断交易金额
    ecommTransPostingCurrChange(val){
    	if((this.manualTransaction.ecommTransCurr == null || this.manualTransaction.ecommTransCurr == undefined || this.manualTransaction.ecommTransCurr == "") || 
			(this.manualTransaction.ecommTransAmount == null || this.manualTransaction.ecommTransAmount == undefined || this.manualTransaction.ecommTransAmount == "")){
			this.$message('请先选择交易币种及交易金额');
			this.manualTransaction.ecommTransPostingCurr = "";
		}else{
			if(this.manualTransaction.ecommTransPostingCurr == this.manualTransaction.ecommTransCurr){
				this.manualTransaction.ecommTransPostingAmount = this.manualTransaction.ecommTransAmount;
			}else{
				this.manualTransaction.ecommTransPostingAmount = "";
			}
		}
    },
    //确认提交分期申请
    getDataInfo(item) {
        if(!this.dataSetForm.eventNo){
            this.msgDialog("请选中一条记录")
            return;
        }
       
        let obj={
            ecommTransOrganization: item.organNo,
            ecommTransPostingCurr: item.ecommTransPostingCurr,
            ecommTransCurr: item.ecommTransCurr,
            ecommTransSource: item.originList,
            
        }
        let eventNoTrends = ''
       	eventNoTrends = "/card/cardService/" + this.dataSetForm.eventNo
       	obj = Object.assign(this.manualTransaction, obj)
        this.$refs['dataForm'].validate((valid) => {
            if (valid) {
                this.post(eventNoTrends,  obj,(res) => {
                    if (res.returnCode == '000000') {
                        this.$notify({
                        title: 'Success',
                        message: '交易补录成功',
                        type: 'success',
                        duration: 2000
                        })
                        this.getList()
                    }
                })
            }
        })
    },
    
  }
}
</script>

<style>

</style>

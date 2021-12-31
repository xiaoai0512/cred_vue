<!-- 利息调整补录 -->
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
        <el-form ref="dataForm" :rules="interestInfoRules" :model="interestInfo">
            <el-form-item class="cl_td" label="全局流水号" prop="ecommOrigGlobalSerialNumbr" >
                <el-input v-model="interestInfo.ecommOrigGlobalSerialNumbr" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="外部识别号" prop="ecommEntryId"  :rules="[ { required: true, message: '外部识别号不能为空'} ]">
                <el-input v-model="interestInfo.ecommEntryId" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="交易币种" prop="currencyCode" :rules="[ { required: true, message: '交易币种不能为空'} ]">
                <el-select v-model="interestInfo.currencyCode" class="wd200">
                    <el-option v-for="(item, index) in ecommTransCurrOptions" 
                    :key="index" 
                    :label="item.detailDesc" 
                    :value="item.codes"/>
                </el-select>
            </el-form-item>
             <el-form-item class="cl_td" label="交易金额" prop="ecommTransAmount" :rules="[ { required: true, message: '交易金额不能为空'} ]">
                <el-input v-model="interestInfo.ecommTransAmount" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="交易日期" prop="ecommTransDate"  :rules="[ { required: true, message: '交易日期不能为空'} ]">
                <el-date-picker class="W200_date"
                  v-model="interestInfo.ecommTransDate"
                  type="date"
                  value-format="yyyy-MM-dd"    
                  placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item class="cl_td" label="入账币种" prop="currencyCode" :rules="[ { required: true, message: '入账币种不能为空'} ]">
                <el-select v-model="interestInfo.currencyCode" class="wd200">
                    <el-option v-for="(item, index) in ecommTransPostingCurrOptions" 
                    :key="index" 
                    :label="item.detailDesc" 
                    :value="item.codes" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="入账金额" prop="ecommTransAmount" :rules="[ { required: true, message: '入账金额不能为空'} ]">
                <el-input v-model="interestInfo.ecommTransAmount" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="交易描述" prop="ecommTransDesc">
                <el-input v-model="interestInfo.ecommTransDesc" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="原始交易日期" prop="ecommOriTransDate" width="100">
                <el-date-picker class="W200_date"
                  v-model="interestInfo.ecommOriTransDate"
                  type="date"
                  value-format="yyyy-MM-dd"    
                  placeholder="选择日期">
                </el-date-picker>
            </el-form-item>
            <el-form-item class="cl_td" label="MCC" prop="ecommMcc">
                <el-input v-model="interestInfo.ecommMcc" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="交易国家代码" prop="ecommTransCountryCde">
                <el-input v-model="interestInfo.ecommTransCountryCde" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="交易城市代码" prop="ecommTransCityCde">
                <el-input v-model="interestInfo.ecommTransCityCde" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td"  label="交易来源" prop="originList">
                <el-select v-model="interestInfo.originList" class="wd200">
                    <el-option v-for="(item, index) in originListOptions" 
                    :key="index" 
                    :label="item.concat" 
                    :value="item.originList" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="交易机构" prop="organNo">
                <el-select v-model="interestInfo.organNo" class="wd200">
                    <el-option v-for="(item, index) in organNoOptions" 
                    :key="index" 
                    :label="item.organName" 
                    :value="item.organNo"/>
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="商户编号" prop="ecommMerchantCde">
                <el-input v-model="interestInfo.ecommMerchantCde" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="收单参考号" prop="ecommAcquireReferenceNumbr">
                <el-input v-model="interestInfo.ecommAcquireReferenceNumbr" class="wd200" type="text" />
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" round icon="el-icon-plus" type="primary" @click="getDataInfo(interestInfo)" >确定</el-button>
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
        interestInfo: {},
        dataForm:{},
        interestInfoRules:{},
        showOriginList1:false,
        showOriginList2: false,
   
      // 下拉框
        transSceneCodeOptions: [], //交易场景
        ecommTransCurrOptions:[],//交易币种
        organNoOptions: [],//交易机构
        ecommTransPostingCurrOptions: [],//入账币种
        ecommTransStatusOptions: [],//交易状态
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
        let objInfo={
            operationMode: this.operationMode,
        }
        //交易状态
        this.getSelectDict( "dic_ecommTransStatus").then(res => {
            this.ecommTransStatusOptions = res
        })
//      // 交易场景
//      this.getSelectDict( "/beta/betaService/AUS.PM.01.0202",obj).then(res => {
//         let rows = res
//          rows.forEach(item => {
//              item.concat = item.transSceneCode+'-'+item.transSceneDesc;
//          })
//          this.transSceneCodeOptions = res
//      })
        //交易来源
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0069",obj).then(res => {
           let rows = res
            rows.forEach(item => {
                item.concat = item.originList+'-'+item.originDesc;
            })
            this.originListOptions = res
        })
        //入账币种
        this.getSelectDict( "dic_curreny",objInfo).then(res => {
            this.ecommTransPostingCurrOptions = res
        })
        //交易币种
        this.getSelectDict( "dic_curreny").then(res => {
            this.ecommTransCurrOptions = res
        })
//      //交易机构
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0005").then(res => {
            this.organNoOptions = res
        })
        this.getList()
        this.getDateSearch()
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
            queryType: "I",
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
        this.getTableList('/beta/betaService/COS.IQ.02.0038', obj ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.$set(this.interestInfo, "ecommTransDate", new Date());
                    this.$set(this.interestInfo, "ecommOriTransDate", new Date());
                    this.interestInfo.ecommTransDate = res.returnData.rows[0].nextProcessDate;
                    this.interestInfo.ecommOriTransDate = res.returnData.rows[0].nextProcessDate;
                }
            }
        })
    },
    //列表单选
    changeRedio(event,row){
        this.dataSetForm.eventNo=row.eventNo
        this.dataSetForm.eventDesc=row.eventDesc
        this.dataSetForm.installType=row.installType
        //交易来源=====取现时必输，消费不必输
        if(this.dataSetForm.eventDesc == '实时取现事件' ){
            this.showOriginList1=false
            this.showOriginList2=true
        }else if(this.dataSetForm.eventDesc == '实时消费事件'){
            this.showOriginList1=true
            this.showOriginList2=false
        }
    },
    //确认提交
    getDataInfo(item) {
        if(!this.dataSetForm.eventNo){
            this.msgDialog("请选中一条记录")
            return;
        }
        let obj={
            ecommTransOrganization: item.organNo,
            ecommTransPostingCurr: item.currencyCode,
            ecommTransCurr: item.currencyCode,
            ecommTransSource: item.originList,
            //ecommSourceCde
            ecommSubAccIdentify: 'P',
            ecommTransPostingAmount: item.ecommTransAmount,
            ecommEventId: this.dataSetForm.eventNo,
        }
        let eventNoTrends = ''
       	eventNoTrends = "/card/cardService/" + this.dataSetForm.eventNo
        obj = Object.assign(this.interestInfo, obj)
        this.$refs['dataForm'].validate((valid) => {
            if (valid) {
                this.post(eventNoTrends,  obj, (res) => {
                    if (res.returnCode == '000000') {
                        this.$notify({
                        title: 'Success',
                        message: '交易补录成功',
                        type: 'success',
                        duration: 2000
                        })
                        this.getList()
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

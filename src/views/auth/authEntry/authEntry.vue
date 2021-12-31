<!-- 授权交易录入 -->
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
        <el-form ref="dataFormAuthEntry" :rules="authEntryRules" :model="authEntryInfo">
            <el-form-item class="cl_td" label="外部识别号" prop="ecommEntryId"  :rules="[ { required: true, message: '外部识别号不能为空'} ]">
                <el-input v-model="authEntryInfo.ecommEntryId" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="卡片有效期(MMYY)" prop="ecommField14" :rules="[ { required: true, message: '卡片有效期不能为空'} ]">
                <el-input v-model="authEntryInfo.ecommField14" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="交易币种" prop="currencyDesc" :rules="[ { required: true, message: '交易币种不能为空'} ]">
                <el-select v-model="authEntryInfo.currencyDesc" class="wd200" clearable>
                    <el-option v-for="(item, index) in ecommTransPostingCurrOptions" 
                    :key="index" 
                    :label="item.currencyDesc" 
                    :value="item.currencyCode" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="交易金额" prop="ecommField4" :rules="[ { required: true, message: '交易金额不能为空'} ]">
                 <el-input v-model="authEntryInfo.ecommField4" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="入账币种" prop="ecommField51" :rules="[ { required: true, message: '入账币种不能为空'} ]">
                <el-select v-model="authEntryInfo.ecommField51" class="wd200" clearable>
                    <el-option v-for="(item, index) in ecommField51Options" 
                    :key="index" 
                    :label="item.currencyDesc" 
                    :value="item.currencyCode" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="入账金额" prop="ecommField6" :rules="[ { required: true, message: '入账金额不能为空'} ]">
                 <el-input v-model="authEntryInfo.ecommField6" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="交易日期" prop="beginDate" :rules="[ { required: true, message: '交易日期不能为空'} ]">
                <el-date-picker
                    v-model="authEntryInfo.beginDate"
                    class="wd200"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptionsStart"
                    :clearable="true"
                     />
            </el-form-item>
            <el-form-item class="cl_td" label="交易场景" prop="transSceneCode" :rules="[ { required: true, message: '交易场景不能为空'} ]">
                <el-select v-model="authEntryInfo.transSceneCode" class="wd200">
                    <el-option v-for="(item, index) in ecommTransSceneCodeOptions" 
                    :key="index" 
                    :label="item.transSceneCodeDesc" 
                    :value="item.transSceneCode" />
                </el-select>
            </el-form-item>
            
            <el-form-item class="cl_td" label="国家码" prop="ecommField19" :rules="[ { required: true, message: '国家码不能为空'} ]">
                <el-input v-model="authEntryInfo.ecommField19" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="MCC码" prop="ecommField18" :rules="[ { required: true, message: 'MCC码不能为空'} ]">
                <el-input v-model="authEntryInfo.ecommField18" class="wd200" type="text" />
            </el-form-item>
             <el-form-item class="cl_td" label="交易机构" prop="organNo" :rules="[ { required: true, message: '交易机构不能为空'} ]">
                <el-select v-model="authEntryInfo.organNo" class="wd200" clearable>
                    <el-option v-for="(item, index) in ecommTransOrganizationOptions" 
                    :key="index" 
                    :label="item.organName" 
                    :value="item.organNo" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="商户代码" prop="ecommField42" :rules="[ { required: true, message: '商户代码不能为空'} ]">
                <el-input v-model="authEntryInfo.ecommField42" class="wd200" type="text" />
            </el-form-item>
             <el-form-item class="cl_td" label="城市代码" prop="ecommField43" :rules="[ { required: true, message: '城市代码不能为空'} ]">
                <el-input v-model="authEntryInfo.ecommField43" class="wd200" type="text" />
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" round icon="el-icon-plus" type="primary" @click="saveEntryInfo(authEntryInfo)" >执行</el-button>
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
       	templateSelection:'',
        currentRowId: null,
        listLoading: false,
        queryFormRef: {},
        queryauthEntryRules: {},      
        tableList: [],
        authEntryInfo: {
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
        tableTrialDetail:[],
        dialogFormVisibleTrans: false,
        tableTotal2: 0,
        listLoading2:false,
        dataSetForm:{},
        trialPage: {
            pageNum: 1,
            pageSize:10,
        },
      // 下拉框
        operationModeOptions: [], 
        ecommTransPostingCurrOptions:[],//交易币种
        ecommSourceCdeOptions: [],//交易来源
        ecommInstallmentPeriodOptions: [],//分期期数
        freeFlagOptions: [],//分期方式
        ecommField51Options: [],//入账币种
        ecommTransSceneCodeOptions: [],//交易场景
        pickerOptionsStart: [],
        ecommTransOrganizationOptions: [],
        authEntryRules: {},
        logininfo: {},

    }
  },
  created() {
    this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))  
    //console.log(this.logininfo)
    this.getList()
    this.queryDate()
  },
    mounted() {
        //币种
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0012").then(res => {
            this.ecommTransPostingCurrOptions = res
        })
        //入账币种
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0012").then(res => {
            this.ecommField51Options = res
        })
        //交易场景
        let itemObj={
            operationMode: this.logininfo.operationMode,
            applicationRange: 'A',
            pageNum: this.queryFormObj.pageNum,
            pageSize:this.queryFormObj.pageSize,
        }
        this.getSelectDict( "/beta/betaService/AUS.PM.01.0202",itemObj).then(res => {
            res.forEach(item => {
                 item.transSceneCodeDesc = item.transSceneCode+ ' '+ item.transSceneDesc
            })
            this.ecommTransSceneCodeOptions = res
        })
        //交易机构
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0005").then(res => {
            this.ecommTransOrganizationOptions = res
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
            queryType: "AUTH",
        }
        obj = Object.assign(obj, this.queryFormObj)
        this.getTableList('/beta/betaService/COS.IQ.02.0039', obj ,(res) => {
            if (res.returnCode == '000000') {
                this.listLoading = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.tableList = res.returnData.rows
                    this.tableTotal = res.returnData.totalCount
                }else{
                	this.tableList = []
                  this.tableTotal = 0
                }
            }
        }, (err) => {
        		this.tableList = []
            this.tableTotal = 0
            this.listLoading = false
        })
    },
    queryDate(){
		let systemUnitNoData= {
            systemUnitNo : window.sessionStorage.getItem('systemUnitNo')
        }
    	this.post('/beta/betaService/COS.IQ.02.0038', systemUnitNoData,(res) => {
            if (res.returnCode == '000000') {
                this.listLoading = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                	let arrayObj = {}
					arrayObj = res.returnData.rows[0].nextProcessDate
                    this.$set(this.authEntryInfo,'beginDate',arrayObj);
                }
            }
        })
    },
    //列表单选
    changeRedio(event,row){
        this.dataSetForm.eventNo=row.eventNo
        this.dataSetForm.installType=row.installType
    },
  	//执行
    saveEntryInfo() {
        if(!this.dataSetForm.eventNo){
            this.msgDialog("请选中一条记录")
            return;
        }
        let transArr = []
        let params = {}
        let allInfo ={
            corporationEntityNo:this.logininfo.corporationEntityNo,
            ecommCardAssociations: "L",
            ecommField2: this.authEntryInfo.ecommEntryId,
            ecommField4: this.authEntryInfo.ecommField4,
            ecommField6: this.authEntryInfo.ecommField6,
            ecommField14: this.authEntryInfo.ecommField14,
            ecommField18: this.authEntryInfo.ecommField18,
            ecommField19: this.authEntryInfo.ecommField19,
            ecommField42: this.authEntryInfo.ecommField42,
            ecommField43: this.authEntryInfo.ecommField43,
            ecommField49: "156",
            ecommField51: this.authEntryInfo.ecommField51,
            ecommTransOrganization: this.authEntryInfo.organNo,
            ecommTransSceneCode: this.authEntryInfo.transSceneCode
        }
        let eventNoTrends = ''
		transArr.push(allInfo)
        params.transList = transArr
        eventNoTrends = "/auth/authService/" + this.dataSetForm.eventNo
        this.$refs['dataFormAuthEntry'].validate((valid) => {
            if (valid) {
                this.post(eventNoTrends,  params, (res) => {
                    if (res.returnCode == '000000') {
                        this.$notify({
                        title: 'Success',
                        message: '交易成功',
                        type: 'success',
                        duration: 2000
                        })
                        this.this.authEntryInfo={}
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

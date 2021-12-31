<!--调额历史查询-->
<template>
    <div class="allContent">
        <el-form ref="dataFormCustomer" :rules="formRules" :model="queryForm" >
            <el-form-item class="cl_td" label="证件类型" prop="idType" >
                <el-select v-model="queryForm.idType" class="wd200">
                <el-option v-for="(item, index) in idTypeList" :key="index" :label="item.detailDesc" :value="item.codes" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="证件号码" prop="idNumber">
                <el-input v-model="queryForm.idNumber" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                <el-input v-model="queryForm.externalIdentificationNo" class="wd200" type="text" />
            </el-form-item>
            <div class="cl_tr text_center">
                <div class="search_button">
                    <el-button size="medium" type="primary" @click="getCreditNode()">查询</el-button>
                </div>
            </div>
        </el-form>
        <!--业务节点列表-->
        <div class="clearboth"></div>
        <div class="allcontent" style="margin-top: 20px;" v-if="showInfo">
           <div class="text_title ">业务节点</div>
           <el-table  v-loading="listLoading1" :data="quotaListA" border fit highlight-current-row >
                 <el-table-column  align="center" label="额度节点" prop="creditDesc" />
                <el-table-column  align="center" label="币种" prop="currencyCode" />
                <el-table-column  align="center" label="固定额度" prop="permLimit" />
                <el-table-column  align="center" label="临时额度" prop="tempLimit" />
                <el-table-column  align="center" label="临时额度生效日" prop="tempLimitEffectvDate" />
                <el-table-column  align="center" label="临时额度失效日" prop="tempLimitExpireDate" />
                <el-table-column width="200" label="操作" align="center">
                    <template slot-scope="{row,$index}">
                        <a icon="el-icon-more" type="primary"  @click="historyInfo(row)">[调额历史]</a>
                        <a icon="el-icon-more" type="primary"  @click="checkElmInfo(row)">[应用节点]</a>
                   </template>  
                </el-table-column> 
            </el-table>
        </div>
        <!------应用节点------>
        <div v-if="showList2">
            <div class="text_title " style="margin-top: 20px;">应用节点： {{creditDescName}}</div>
            <el-table  v-loading="listLoading2" :data="list2" border fit highlight-current-row >
                <el-table-column  prop="currencyCode"  label="币种"  align="center"/>
                <el-table-column  prop="productObjectCode" label="应用对象"  align="center"/>
                <el-table-column  prop="permLimit" label="固定额度"  align="center"/>
                <el-table-column  prop="tempLimit"  label="临时额度" align="center" />
                <el-table-column  prop="tempLimitEffectvDate" label="临时额度生效日"  align="center"/>
                <el-table-column  prop="tempLimitExpireDate"  label="临时额度失效日"  align="center"/>
                <el-table-column width="200" label="操作" align="center">
                <template slot-scope="{row,$index}">
                    <a icon="el-icon-more" type="primary"  @click="historyInfo(row)">[调额历史]</a>
                </template>  
            </el-table-column> 
            </el-table>
        </div>
        <!--调额历史节点基本信息-->
        <el-dialog title="节点基本信息" :visible.sync="dialogFormVisibleInfo" width="65%">
            <div class="mainname titleInfo">节点基本信息</div>
            <el-form   :data="itemHinfo" class="mbtm20" fit highlight-current-row style="width: 100%;" border>
                <el-form-item class="cl_td" label="额度类型" prop="creditDesc" >
                    <el-input v-model="itemHinfo.creditDesc" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="节点类型" prop="creditNodeTypInfo">
                    <el-input v-model="itemHinfo.creditNodeTypInfo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="应用对象" prop="productObjectCodeInfo" >
                    <el-input v-model="itemHinfo.productObjectCodeInfo" class="wd200" type="text" readonly/>
                </el-form-item>
            </el-form >
            <!--业务节点-->
            <div class="text_title " style="margin-top: 20px;">业务节点</div>
            <el-table  v-loading="nodeListLoading" :data="nodeList" border fit highlight-current-row >
                <el-table-column  align="center" label="币种" prop="currencyCode" />
                <el-table-column  align="center" label="调额类型" prop="creditAdjustFlagDesc" />
                <el-table-column  align="center" label="调整前额度" prop="adjustForeheadCredit" />
                <el-table-column  align="center" label="调整后额度" prop="adjustAfterCredit" />
                <el-table-column  align="center" label="调整前生效日" prop="adjustBeforeEffectDate" />
                <el-table-column  align="center" label="调整后生效日" prop="adjustAfterEffectDate" />
                <el-table-column  align="center" label="调整前失效日" prop="adjustBeforeExpireDate" />
                <el-table-column  align="center" label="调整后失效日" prop="adjustAfterExpireDate" />
                <el-table-column  align="center" label="操作员ID" prop="operatorId" />
                <el-table-column  align="center" label="操作时间" prop="operatorDate" />
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleInfo = false" type="primary"> 关闭</el-button>
            </div> 
        </el-dialog>
    </div>
</template>

<script>
  export default {
    name: 'businessNode',
    components: {},
    data() {
      return {
        /*----业务节点----*/
        queryForm: {},
        quotaListA: [],
        baseInfoObj: {},
        formRules: {},
        showInfo: false,//客户号
        idTypeList: [],
        creditNodeNoOptions: [],//额度节点
        creditTwocurrencyOptions: [],//授信币种
        adjusClassOptions: [],
        loginInfo: {},
        //业务节点
        listLoading1: false,
        list1: [],//业务节点列表
        businessNode:{},//业务节点form
        //应用节点
        listLoading2: false,
        list2: [],
        showList2: false,
        creditDescName: '',//额度节点
        //调额历史
        dialogFormVisibleInfo: false,
        itemHinfo: {},//form
        nodeList: [],//列表
        nodeListLoading: false,
        productObjectCodeInfo: '',
        creditNodeTypInfo: '',
      }
    },
    created() {
        this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo')) 
    },
    mounted() { 
        //證件类型
        this.getSelectDict('dic_certificateType').then((res) => {
            this.idTypeList = res
        })
        //授信币种
        this.getSelectDict('dic_creditCurrency').then((res) => {
            this.creditTwocurrencyOptions = res
        })
        //调整种类
        this.getSelectDict('dic_adjusType').then((res) => {
            this.adjusClassOptions = res
        })
    },
    methods: {
        getValue: function(){//监听下拉框
            if(this.businessNode.adjustType =='4' ){
                this.businessNode.creditLimit = 0
            }
        },
        getCreditNode() {
            if((this.queryForm.idNumber != "" && this.queryForm.idNumber != null && this.queryForm.idNumber != undefined) && 
                (this.queryForm.idType == "" || this.queryForm.idType == null || this.queryForm.idType == undefined) ){
                this.$message('证件类型不能为空！');
                return;
            }
            if((this.queryForm.idType != "" && this.queryForm.idType != null && this.queryForm.idType != undefined)){
                if(this.queryForm.idNumber == "" && this.queryForm.idNumber == null && this.queryForm.idNumber == undefined){   
                   
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
            this.handleSearch()
        }, 
        //查询
        handleSearch() {
            this.showInfo=true
            this.listLoading=true
            let  obj={
                adjustFlag: "Y",
                authDataSynFlag: "1",
                adjustFlag:'Y',
                
            }
            obj = Object.assign(obj, this.queryForm)
            this.getTableList('/auth/authService/LMS.IQ.01.0001', obj ,(res) => {
                if (res.returnCode == '000000') {
                    this.listLoading1=false
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.list1 = res.returnData.rows
                        this.quotaListA = []
                        this.list1.forEach(item => {   //循环  列表字段拼接
                            if(item.creditNodeTyp =='B' || item.creditNodeTyp =='BN'){
                                this.quotaListA.push(item);
                            }
                        })
                    } else {
                        this.quotaListA = []
                        this.listLoading1=false
                    }
                }
            }, (err) => {
                if (err) {
                    this.quotaListA = []
                    this.listLoading1=false
                }
            })
        },
        //应用节点
        checkElmInfo(isRow){
            this.listLoading2 =true
            this.showList2 = true
            this.creditDescName = isRow.creditDesc
            let itemRow={
                "authDataSynFlag":"1",
                creditNodeNo: isRow.creditNodeNo,
            }
            itemRow = Object.assign(itemRow,this.queryForm)
            this.getTableList('/auth/authService/LMS.IQ.01.0001', itemRow).then((res) => {
                if (res.returnCode =="000000") {
                    this.listLoading2 = false
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.list2 = res.returnData.rows
                      
                    } else{
                        this.list2 = []
                    }
                }
            }, (err) => {
                if (err) {
                    this.listLoading2 = false
                    this.list2 = []
                }
            })
        },
         //调额历史显示的弹框
        historyInfo(row) {
        	console.log('halou')
            let params={
                creditNodeNo:row.creditNodeNo,
                customerNo:row.customerNo,
                productObjectCode: row.productObjectCode,
                currencyCode:row.currencyCode,
                authDataSynFlag:"1",
                 "pageSize":10,
                "indexNo":0
            }
            this.getTableList('/auth/authService/LMS.IQ.01.0010', params).then((res) => {
                if (res.returnMsg == 'OK') {
                    this.itemHinfo = Object.assign({}, row)
                    this.dialogFormVisibleInfo= true
                    this.getHistoryInfo(row)
                }
            })
        }, 
        //调额历史列表
        getHistoryInfo(items){
            if(items.creditNodeTyp == 'B'){
                this.creditNodeTypInfo = '业务节点';
            }else if(items.creditNodeTyp == null){
                this.creditNodeTypInfo = '应用节点';
            }
            if(items.productObjectCode == '999999999'){
                this.productObjectCodeInfo = "";
            }else {
                this.productObjectCodeInfo = items.productObjectCode;
            }
            this.dialogFormVisibleInfo= true
            this.nodeListLoading =true
            let quotaParams={
                creditNodeNo:items.creditNodeNo,
                customerNo:items.customerNo,
                //externalIdentificationNo: this.queryForm.externalIdentificationNo,
                //idType: this.queryForm.idType,
                //idNumber: this.queryForm.idNumber,
                productObjectCode: items.productObjectCode,
                currencyCode: items.currencyCode,
                authDataSynFlag:"1",
            }
            this.getTableList('/auth/authService/LMS.IQ.01.0001', quotaParams).then((res) => {
                if (res.returnCode =="000000") {
                    this.nodeListLoading = false
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.nodeList = res.returnData.rows
                    }
                } else {
                    this.nodeList = []
                    this.nodeListLoading = false
                }
            }, (err) => {
                if (err) {
                    this.nodeList = []
                    this.nodeListLoading = false
                }
            })
        },
    }
  }
</script>

<style>
.cl-span{
    width: 40%;
    float: left;
    text-align: right;
    font-size: 14px;
    padding: 0 12px 0 0;
    line-height: 36px;
    color: #606266;
    font-weight: 500;   
}
</style>
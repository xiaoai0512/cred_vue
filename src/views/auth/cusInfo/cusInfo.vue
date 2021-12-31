<template>
    <div class="allContent">
        <el-form :model="queryForm">
            <el-form-item class="cl_td" label="证件类型" prop="idType">
                <el-select v-model="queryForm.idType" class="wd200" clearable>
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
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()">查询</el-button>
                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="reset()">重置</el-button>
            </div>
        </el-form>
		<div v-if="showInfo">
            <el-form :model="cusInfoObj">
                <div class="mainname titleInfo">客户信息</div>
                <el-form-item class="cl_td bnone" label="客户姓名" prop="customerName">
                    <el-input v-model="cusInfoObj.customerName" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td bnone" label="客户代码" prop="customerNo">
                    <el-input v-model="cusInfoObj.customerNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td bnone" label="手机代码" prop="mobilePhone">
                    <el-input v-model="cusInfoObj.mobilePhone" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td bnone" label="证件类型" prop="idType">
                    <el-select v-model="cusInfoObj.idType" class="wd200" disabled>
                        <el-option 
                        v-for="(item, index) in idTypeList" :key="index" :label="item.detailDesc" :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td bnone" label="证件号码" prop="idNumber">
                    <el-input v-model="cusInfoObj.idNumber" class="wd200" type="text" readonly/>
                </el-form-item>

                <div class="clearboth"></div>
                <div class="mainname titleInfo">基本信息</div>
                <el-form-item class="cl_td bnone" label="机构号" prop="institutionId">
                    <el-input v-model="cusInfoObj.institutionId" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td bnone" label="运营模式" prop="operationMode">
                    <el-select v-model="cusInfoObj.operationMode" class="wd200" disabled>
                        <el-option
                            v-for="(item, index ) in operationModeOptions"
                            :key="index"
                            :label="item.modeName"
                            :value="item.operationMode"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td bnone" label="系统单元" prop="systemUnitNo">
                    <el-input v-model="cusInfoObj.systemUnitNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td bnone" label="生日" prop="dateOfBirth">
                    <el-input v-model="cusInfoObj.dateOfBirth" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td bnone" label="客户状态" prop="customerStatusInfo">
                     <el-input v-model="cusInfoObj.customerStatusInfo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td bnone" label="授权状态" prop="customerAuthStatusInfo">
                    <el-input v-model="cusInfoObj.customerAuthStatusInfo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td bnone" label="个人公司标识" prop="customerTypeInfo">
                    <el-input v-model="cusInfoObj.customerTypeInfo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td bnone" label="实时余额状态" prop="customerBalanceStatusInfo">
                    <el-input v-model="cusInfoObj.customerBalanceStatusInfo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td bnone" label="统一还款标识" prop="paymentMarkInfo">
                    <el-input v-model="cusInfoObj.paymentMarkInfo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td bnone" label="核算状态" prop="customerAccountingStatusInfo">
                    <el-input v-model="cusInfoObj.customerAccountingStatusInfo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td bnone" label="客户风险组别" prop="customerRiskGroup">
                    <el-input v-model="cusInfoObj.customerRiskGroup" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td bnone" label="新建客户日期" prop="createDate">
                    <el-input v-model="cusInfoObj.createDate" class="wd200" type="text" readonly/>
                </el-form-item>
                <div class="clearboth"></div>
                <div class="mainname titleInfo">地址信息</div>
                <el-form-item class="cl_td bnone" label="验证城市" prop="city">
                    <el-input v-model="cusInfoObj.city" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td bnone" label="验证地址" prop="contactAddress">
                    <el-input v-model="cusInfoObj.contactAddress" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td bnone" label="验证邮编" prop="contactPostCode">
                    <el-input v-model="cusInfoObj.contactPostCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td bnone" label="验证电话" prop="contactMobilePhone">
                    <el-input v-model="cusInfoObj.contactMobilePhone" class="wd200" type="text" readonly/>
                </el-form-item>
                <div class="cl_tr text_center">
                    <el-button size="medium" type="primary" @click="reset()">关闭</el-button>
                </div>
            </el-form>
        </div>
   </div>
</template>

<script>
  export default {
    name: 'CusInfo',
    components: {},
    data() {
      return {
        queryForm: {},
        cusInfoObj: {},
        showInfo: false,
        // 证件类型下拉框
        idTypeList: [],
        // 运营模式下拉框
        operationModeOptions: []
      }
    },
    created() { },
    mounted() { 
        // 证件类型
        this.getSelectDict('dic_certificateType').then((res) => {
            this.idTypeList = res
        })
        // 运营模式 
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0006").then(res => {
            this.operationModeOptions = res
        })
    },
    methods: {
        //初始化页面---重置
        reset() {
            this.queryForm = {
                idType: '',
                idNumber: '',
                externalIdentificationNo: '',
            }
            this.showInfo = false // 信息展示面板
            this.cusInfoObj = {}
        },
        getInfo() {
            this.queryForm.authDataSynFlag = '1'
            this.post('/auth/authService/AUS.IQ.01.0001', this.queryForm, (res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows &&  res.returnData.rows.length > 0) {
                        this.showInfo = true
                        this.cusInfoObj = res.returnData.rows[0]
                        // 客户状态
                        if(this.cusInfoObj.customerStatus =='0'){
			    			this.cusInfoObj.customerStatusInfo = '正常';
			    		}else if(this.cusInfoObj.customerStatus =='1'){
			    			 this.cusInfoObj.customerStatusInfo = '关闭';
                        }
                        //授权状态
                        if(this.cusInfoObj.customerAuthStatus != 'N') {
			    			this.cusInfoObj.customerAuthStatusInfo = '正常';
			    		}else {
			    			this.cusInfoObj.customerAuthStatusInfo = '异常';
                        }
                        //个人公司标识
                        if(this.cusInfoObj.customerType =='1'){
			    			this.cusInfoObj.customerTypeInfo = '个人客户';
			    		}else if(this.cusInfoObj.customerType =='2'){
			    			this.cusInfoObj.customerTypeInfo = '公司客户';
                        }
                        //实时余额状态
                        if(this.cusInfoObj.customerBalanceStatus =='Y'){
			    			this.cusInfoObj.customerBalanceStatusInfo = '正常';
			    		}else if(this.cusInfoObj.customerBalanceStatus =='N'){
			    			this.cusInfoObj.customerBalanceStatusInfo = '异常';
                        }
                        //统一还款标识
                        if(this.cusInfoObj.paymentMark =='1'){
			    			this.cusInfoObj.paymentMarkInfo = '统一还款';
			    		}else if(this.cusInfoObj.paymentMark =='2'){
			    			this.cusInfoObj.paymentMarkInfo = '单独还款';
                        }
                        //核算状态
                        if(this.cusInfoObj.customerAccountingStatus == '000'){
			    			this.cusInfoObj.customerAccountingStatusInfo = '正常';
			    		}else if(this.cusInfoObj.customerAccountingStatus == '001'){
			    			this.cusInfoObj.customerAccountingStatusInfo = '非应计';
			    		}else if(this.cusInfoObj.customerAccountingStatus == '002'){
			    			this.cusInfoObj.customerAccountingStatusInfo = '核销';
			    		}
                    }
                }
            })
        },
        // 查询按钮
        handleSearch() {
            if((this.queryForm.idNumber == "" || this.queryForm.idNumber == null || this.queryForm.idNumber == undefined) 
            && (this.queryForm.idType == "" || this.queryForm.idType == null || this.queryForm.idType == undefined) 
            && (this.queryForm.externalIdentificationNo == "" || this.queryForm.externalIdentificationNo == null || this.queryForm.externalIdentificationNo == undefined)){
                this.$message({
                    message: '请输入查询条件',
                    type: 'warning'
                })
                return;
            }else {
                if((this.queryForm.idNumber || this.queryForm.idType) && this.queryForm.externalIdentificationNo){
                    this.$message({
                        message: '请输入某一项进行查询',
                        type: 'warning'
                    })
                    return;
                }else if(this.queryForm.idType && (this.queryForm.idNumber == "" || this.queryForm.idNumber == null || this.queryForm.idNumber == undefined)){
                     this.$message({
                        message: '请输入证件号',
                        type: 'warning'
                    })
                    return;
                }else if(this.queryForm.idNumber && (this.queryForm.idType == "" || this.queryForm.idType == null || this.queryForm.idType == undefined)){
                    this.$message({
                        message: '请输入证件类型',
                        type: 'warning'
                    })
                    return;
                }
            }
            this.getInfo()
        }
    }
  }
</script>

<style>
</style>

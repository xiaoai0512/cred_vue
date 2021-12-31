<template>
    <div class="allContent">
        <el-form :model="queryForm">
            <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                <el-input v-model="queryForm.externalIdentificationNo" class="wd200" type="text" />
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()">查询</el-button>
                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="reset()">重置</el-button>
            </div>
        </el-form>

        <div v-if="showInfo">
            <el-form :model="baseInfoObj">
                <div class="mainname titleInfo">卡片信息</div>
                <el-form-item class="cl_td bnone" label="有效期(MMYY)" prop="expirationDate">
                    <el-input v-model="baseInfoObj.expirationDate" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td bnone" label="产品对象" prop="productObjectCode">
                    <el-input v-model="baseInfoObj.productObjectCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td bnone" label="是否有效" prop="invalidFlag">
                    <el-select v-model="baseInfoObj.invalidFlag" class="wd200" clearable  disabled>
                        <el-option
                            v-for="(item, index ) in invalidFlagOptions"
                            :key="index"
                            :label="item.detailDesc" 
                            :value="item.codes" 
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td bnone" label="失效原因" prop="invalidReason">
                    <el-select v-model="baseInfoObj.invalidReason" class="wd200" placeholder="" disabled>
                        <el-option 
                        v-for="(item, index) in invalidReasonOptions" 
                        :key="index" 
                        :label="item.detailDesc" 
                        :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td bnone" label="激活状态" prop="activationFlag">
                    <el-select v-model="baseInfoObj.activationFlag" class="wd200" disabled>
                        <el-option 
                        v-for="(item, index) in activationFlagOptions" 
                        :key="index" 
                        :label="item.detailDesc" 
                        :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td bnone" label="激活日期" prop="activationDate">
                    <el-input v-model="baseInfoObj.activationDate" class="wd200" type="text" readonly/>
                </el-form-item>

                <div class="clearboth"></div>
                <div class="mainname titleInfo">基本信息</div>
                <el-form-item class="cl_td bnone" label="主客户代码" prop="mainCustomerNo">
                    <el-input v-model="baseInfoObj.mainCustomerNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td bnone" label="主附卡标识" prop="mainSupplyIndicator">
                    <el-select v-model="baseInfoObj.mainSupplyIndicator" class="wd200" disabled>
                        <el-option 
                        v-for="(item, index) in mainSupplyIndicatorOptions" 
                        :key="index" 
                        :label="item.detailDesc" 
                        :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td bnone" label="附客户代码" prop="supplyCustomerNo">
                    <el-input v-model="baseInfoObj.supplyCustomerNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td bnone" label="国家码" prop="countryCode">
                    <el-input v-model="baseInfoObj.countryCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td bnone" label="介质类型" prop="mediaType">
                    <el-select v-model="baseInfoObj.mediaType" class="wd200" clearable  disabled>
                        <el-option
                            v-for="(item, index ) in mediaTypeOptions"
                            :key="index"
                            :label="item.detailDesc" 
                            :value="item.codes" 
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td bnone" label="主产品形式" prop="mainProductForm">
                    <el-input v-model="baseInfoObj.mainProductForm" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td bnone" label="产品形式" prop="productForm">
                    <el-input v-model="baseInfoObj.productForm" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td bnone" label="芯片锁状态" prop="chipLockStatus">
                    <el-input v-model="baseInfoObj.chipLockStatus" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td bnone" label="脚本处理结果" prop="scriptProcessRslt">
                    <el-input v-model="baseInfoObj.scriptProcessRslt" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td bnone" label="预算单位编码" prop="budgetOrgCode">
                    <el-input v-model="baseInfoObj.budgetOrgCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td bnone" label="验密开关" prop="verifyPswFlagInfo">
                    <el-input v-model="baseInfoObj.verifyPswFlagInfo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td bnone" label="小额免密开关" prop="smallAvoidPswFlagInfo">
                    <el-input v-model="baseInfoObj.smallAvoidPswFlagInfo" class="wd200" type="text" readonly/>
                </el-form-item>
                <div class="clearboth"></div>
                <div class="mainname titleInfo">验证信息</div>
                <el-form-item class="cl_td bnone" label="密码当日错误次数" prop="pswErrorNumToday">
                    <el-input v-model="baseInfoObj.pswErrorNumToday" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td bnone" label="密码错误日期" prop="pswErrorDate">
                    <el-input v-model="baseInfoObj.pswErrorDate" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td bnone" label="CVV错误次数" prop="cvvErrorNum">
                    <el-input v-model="baseInfoObj.cvvErrorNum" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td bnone" label="CVV2错误次数" prop="cvv2ErrorNum">
                    <el-input v-model="baseInfoObj.cvv2ErrorNum" class="wd200" type="text" readonly/>
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
    name: 'CardInfo',
    components: {},
    data() {
      return {
        queryForm: {},
        baseInfoObj: {},
        showInfo: false,
        invalidFlagOptions: [],
        invalidReasonOptions: [],
        activationFlagOptions: [],
        mainSupplyIndicatorOptions: [],
        mediaTypeOptions: [],
      }
    },
    created() { },
    mounted() { 
        this.getSelectDict('dic_invalidFlagYN').then((res) => {
            this.invalidFlagOptions = res
        })
        //  无效原因
        this.getSelectDict( "dic_invalidReasonTable").then(res => {
            this.invalidReasonOptions = res
        })
        this.getSelectDict( "dic_activationStateTable").then(res => {
            this.activationFlagOptions = res
        })
        
        this.getSelectDict( "dic_mainCharacterCardTable").then(res => {
            this.mainSupplyIndicatorOptions = res
        })
        this.getSelectDict( "dic_mediaType").then(res => {
            this.mediaTypeOptions = res
        })
    },
    methods: {
        handleSearch() {
            if(this.queryForm.externalIdentificationNo == '' || this.queryForm.externalIdentificationNo == undefined || this.queryForm.externalIdentificationNo == null){
                this.$message({
                    message: '请输入外部识别号进行查询',
                    type: 'warning'
                })
                return;
            }
            this.getInfo()
        },
        getInfo() {
            this.queryForm.authDataSynFlag = '1'
            this.post('/auth/authService/AUS.IQ.01.0002', this.queryForm, (res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows &&  res.returnData.rows.length > 0) {
                        this.showInfo = true
                        this.baseInfoObj = res.returnData.rows[0]
                        // 验密开关
                        if(this.baseInfoObj.verifyPswFlag == 'Y') {
			    			this.baseInfoObj.verifyPswFlagInfo = '打开'
			    		}else if(this.baseInfoObj.verifyPswFlag == 'N') {
			    			this.baseInfoObj.verifyPswFlagInfo = '关闭'
                        }
                        // 小额免密开关
			    		if(this.baseInfoObj.smallAvoidPswFlag == 'Y') {
			    			this.baseInfoObj.smallAvoidPswFlagInfo = '打开'
			    		}else if(this.baseInfoObj.smallAvoidPswFlag == 'N') {
			    			this.baseInfoObj.smallAvoidPswFlagInfo = '关闭'
			    		}
                    }
                }
            })
        },
        reset() {
            this.showInfo = false
            this.queryForm = {}
            this.baseInfoObj = {}
        }
    }
  }
</script>

<style>
</style>

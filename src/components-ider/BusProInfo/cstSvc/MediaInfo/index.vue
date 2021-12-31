<!-- 媒介几班信息组件 -->
<template>
    <div class="" >
        <div class="text_title">{{text_title}}</div>
        <el-form ref="formRef" :model="formObj" :rules="formRules">
            <el-form-item class="cl_td" label="媒介单元代码" prop="mediaUnitCode" >
                <el-input v-model="formObj.mediaUnitCode" class="wd200" type="text" readonly />
           </el-form-item>
           <el-form-item class="cl_td" label="媒介对象代码" prop="mediaObjectCodeTrans" >
                 <el-input v-model="formObj.mediaObjectCodeTrans" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td" label="产品对象代码" prop="productObjectCodeTrans">
                <el-input v-model="formObj.productObjectCodeTrans" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo" >
                 <el-input v-model="formObj.externalIdentificationNo" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td" label="主附标识" prop="mainSupplyIndicator">
                <el-select v-model="formObj.mainSupplyIndicator" class="wd200" disabled>
                    <el-option 
                        v-for="(item, index) in mainSupplyIndicatorOptions" 
                        :key="index" 
                        :label="item.detailDesc" 
                        :value="item.codes" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="媒介使用者姓名" prop="mediaUserName" >
                 <el-input v-model="formObj.mediaUserName" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td" label="主客户代码" prop="mainCustomerNo">
                <el-input v-model="formObj.mainCustomerNo" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td" label="副客户代码" prop="mediaHolderNo" >
                 <el-input v-model="formObj.mediaHolderNo" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td" label="所属机构" prop="institutionId">
                <el-select v-model="formObj.institutionId" class="wd200" disabled>
                    <el-option 
                        v-for="(item, index) in institutionIdOptions" 
                        :key="index" 
                        :label="item.organName" 
                        :value="item.organNo" 
                    />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="运营模式" prop="operationMode" >
                <el-select v-model="formObj.operationMode" class="wd200" disabled>
                    <el-option 
                        v-for="(item, index) in operationModeOptions" 
                        :key="index" 
                        :label="item.modeName"
                        :value="item.operationMode"
                    />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="有效期" prop="expirationDate">
                <el-input v-model="formObj.expirationDate" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td" label="上一有效期" prop="previousExpirationDate" >
                <el-date-picker
                v-model="formObj.previousExpirationDate"
                class="wd200"
                type="date"
                placeholder="选择日期"
                format="yyyy 年 MM 月 dd 日"
                value-format="yyyy-MM-dd"
                :clearable="true"
                disabled
                />
            </el-form-item>
            <el-form-item class="cl_td" label="新建日期" prop="createDate">
                <el-input v-model="formObj.createDate" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td" label="刻印名" prop="embosserName1" >
                 <el-input v-model="formObj.embosserName1" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td" label="进件人员编号" prop="applicationStaffNo">
                <el-input v-model="formObj.applicationStaffNo" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td" label="分行号" prop="branchNumber" >
                 <el-input v-model="formObj.branchNumber" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td" label="申请书编号" prop="applicationNumber">
                <el-input v-model="formObj.applicationNumber" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td" label="营销人员编号" prop="marketerCode" >
                 <el-input v-model="formObj.marketerCode" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td" label="密码函领取标志" prop="pinDispatchMethod">
                <el-select v-model="formObj.pinDispatchMethod" class="wd200" disabled>
                    <el-option 
                        v-for="(item, index) in pinDispatchMethodOptions" 
                        :key="index" 
                        :label="item.detailDesc" 
                        :value="item.codes"
                    />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="媒介领取标志" prop="mediaDispatchMethod" >
                <el-select v-model="formObj.mediaDispatchMethod" class="wd200" disabled>
                    <el-option 
                        v-for="(item, index) in mediaDispatchMethodOptions" 
                        :key="index" 
                        :label="item.detailDesc" 
                        :value="item.codes"
                    />
                </el-select> 
            </el-form-item>

            <el-form-item class="cl_td" label="激活标识" prop="activationFlag">
                <el-select v-model="formObj.activationFlag" class="wd200" disabled>
                    <el-option 
                        v-for="(item, index) in activationFlagOptions" 
                        :key="index" 
                        :label="item.detailDesc" 
                        :value="item.codes"
                    />
                </el-select> 
            </el-form-item>
            <el-form-item class="cl_td" label="激活方式" prop="activationFlag" >
                <el-select v-model="formObj.activationFlag" class="wd200" disabled>
                    <el-option 
                        v-for="(item, index) in activationModeOptions" 
                        :key="index" 
                        :label="item.detailDesc" 
                        :value="item.codes"
                    />
                </el-select> 
            </el-form-item>
            <el-form-item class="cl_td" label="激活时间" prop="activationDate">
                <el-input v-model="formObj.activationDate" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td" label="年费日期" prop="annualFeeDate" >
                 <el-input v-model="formObj.annualFeeDate" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td" label="免首年年费日期" prop="waiveFirstAnnualFeeDate">
                <el-input v-model="formObj.waiveFirstAnnualFeeDate" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td" label="上一年费收取周期号" prop="lastAnnualFeeCycleNo" >
                 <el-input v-model="formObj.lastAnnualFeeCycleNo" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td" label="是否有效标识" prop="invalidFlag">
                <el-select v-model="formObj.invalidFlag" class="wd200" disabled>
                    <el-option 
                        v-for="(item, index) in invalidFlagOptions" 
                        :key="index" 
                        :label="item.detailDesc" 
                        :value="item.codes"
                    />
                </el-select> 
            </el-form-item>
            <el-form-item class="cl_td" label="失效原因" prop="invalidReason" >
                <el-select v-model="formObj.invalidReason" class="wd200" disabled>
                    <el-option 
                        v-for="(item, index) in invalidReasonOptions" 
                        :key="index" 
                        :label="item.detailDesc" 
                        :value="item.codes"
                    />
                </el-select> 
            </el-form-item>
            <el-form-item class="cl_td" label="制卡请求" prop="productionCode" >
                <el-select v-model="formObj.productionCode" class="wd200" disabled>
                    <el-option 
                        v-for="(item, index) in productionCodeOptions" 
                        :key="index" 
                        :label="item.detailDesc" 
                        :value="item.codes"
                    />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="制卡请求日期" prop="productionDate" >
                <el-input v-model="formObj.productionDate" class="wd200" type="text" readonly />
            </el-form-item>


            
        </el-form>
    </div>
</template>

<script>
export default {
  name: 'MediaInfo',
  props: {
      // form
    formObj: {
        type: Object,
        default: {} 
    },
    text_title: {
        type: String,
        default: '' 
    }
  },
  components: {
      
  },
  created() {},
  activated() {},
  mounted() {},
  watch: {
      formObj () {}
  },
  data() {
    return { 
        formRef: {},
        formRules: {},
        mainSupplyIndicatorOptions: [],// 主附标识
        institutionIdOptions: [], // 所属机构
        operationModeOptions: [], // 运营模式
        pinDispatchMethodOptions: [], // 密码函领取标志
        mediaDispatchMethodOptions: [], // 媒介领取标志
        activationFlagOptions: [], // 激活标识
        activationModeOptions: [], // 激活方式
        invalidFlagOptions: [], // 是否有效标识
        invalidReasonOptions: [], // 失效原因
        productionCodeOptions: [], // *制卡请求
    }
  },
  created() {},
  watch: {
      // 当replaceObj发生变化时，执行  
  },
  mounted() {
    // 主附标识
    this.getSelectDict('dic_mainAttachedFlag').then((res) => {
      this.mainSupplyIndicatorOptions = res
    })
    // 所属机构
    this.getSelectDict('/beta/betaService/COS.IQ.02.0005').then((res) => {
      this.institutionIdOptions = res
    })
    // 运营模式 
    this.getSelectDict( "/beta/betaService/COS.IQ.02.0006").then(res => {
        this.operationModeOptions = res
    })
     // 密码函领取标志 
     this.getSelectDict( "dic_isYorN").then(res => {
        this.pinDispatchMethodOptions = res
        this.mediaDispatchMethodOptions = res
    })
    // 激活标识
    this.getSelectDict( "dic_activationFlag").then(res => {
        this.activationFlagOptions = res
    })
    // 激活方式
    this.getSelectDict( "dic_activationMode").then(res => {
        this.activationModeOptions = res
    })
    // 是否有效标识
    this.getSelectDict( "dic_invalidFlagYN").then(res => {
        this.invalidFlagOptions = res
    })
    // 失效原因
    this.getSelectDict( "dic_invalidReasonTable").then(res => {
        this.invalidReasonOptions = res
    })
    // 制卡请求
    this.getSelectDict( "dic_productionCode").then(res => {
        this.productionCodeOptions = res
    })
    
    
    
    this.getTrans()

    
    
    

    

    
  },
  methods: {
      getTrans() {
            //
            // if (this.formObj.invalidFlag == 'Y') {
            //     this.formObj.invalidFlagStr = '有效'
            // } else if (this.formObj.invalidFlag == 'N') {
            //     this.formObj.invalidFlagStr = '无效'
            //     if (this.formObj.invalidReason == 'TRF') {

            //     }

            // }
      }
  }
}
</script>

<style>

</style>

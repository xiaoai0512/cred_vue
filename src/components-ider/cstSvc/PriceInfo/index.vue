<!-- 定价信息组件 -->
<template>
    <div class="allContent" >
        <el-form ref="formRef" :model="formObj" :rules="formRules">
            <el-form-item class="cl_td bnone" label="客户代码" prop="customerNo" >
                <el-input v-model="formObj.customerNo" class="wd200" type="text" readonly />
           </el-form-item>
           <el-form-item class="cl_td bnone" label="定价层级" prop="pricingLevel" >
                 <el-input v-model="formObj.pricingLevel" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="定价层级代码" prop="pricingLevelCode">
                <el-input v-model="formObj.pricingLevelCode" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="币种" prop="pricingScope" >
                <el-select clearable  v-model="formObj.pricingScope" class="wd200" diabled>
                    <el-option
                      v-for="(item, index ) in pricingScopeOptions"
                      :key="index"
                      :label="item.currencyDesc"
                      :value="item.currencyCode"
                    />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td bnone" label="定价类型" prop="pricingObject">
                <el-input v-model="formObj.pricingObject" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="定价对象" prop="pricingObjectCode" >
                <el-input v-model="formObj.pricingObjectCode" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="定价标签" prop="pricingTag">
                <el-input v-model="formObj.pricingTag" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="标签生效日期" prop="custTagEffectiveDate" >
                <el-input v-model="formObj.custTagEffectiveDate" class="wd200" type="text" readonly />
                <!-- <el-date-picker
                    v-model="formObj.custTagEffectiveDate"
                    class="wd200"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyyMMdd"
                /> -->
            </el-form-item>
            <el-form-item class="cl_td bnone" label="标签失效日期" prop="custTagExpirationDate">
                <el-input v-model="formObj.custTagExpirationDate" class="wd200" type="text" readonly />
                <!-- <el-date-picker
                    v-model="formObj.custTagEffectiveDate"
                    class="wd200"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyyMMdd"
                /> -->
                
            </el-form-item>
            <el-form-item class="cl_td bnone" label="设置日期" prop="settingDate" >
                 <el-input v-model="formObj.settingDate" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="设置时间" prop="settingTime">
                <el-input v-model="formObj.settingTime" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="设置人员代码" prop="settingUpUserid" >
                 <el-input v-model="formObj.settingUpUserid" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="解除日期" prop="removeDate" >
                <el-input v-model="formObj.removeDate" class="wd200" type="text" readonly />
           </el-form-item> 
            <el-form-item class="cl_td bnone" label="解除人员代码 " prop="removalUserid" >
                <el-input v-model="formObj.removalUserid" class="wd200" type="text" readonly />
            </el-form-item> 
            <el-form-item class="cl_td bnone" label="状态" prop="state" >
                <el-select clearable  v-model="formObj.state" class="wd200" diabled>
                    <el-option
                      v-for="(item, index ) in stateOptions"
                      :key="index"
                      :label="item.detailDesc"
                      :value="item.codes"
                    />
                </el-select>
            </el-form-item> 
        </el-form>
    </div>
</template>

<script>
export default {
  name: 'PriceInfo',
  props: {
      // form
    formObj: {
        type: Object,
        default: {} 
    },
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
        logininfo: {},
        formRef: {},
        formRules: {},

        pricingScopeOptions: [], // 币种
        stateOptions: [
            {
                detailDesc: '有效',
                codes: 'Y',
            },{
                detailDesc: '已解除',
                codes: 'N',
            },
        ],
    }
  },
  created() {
      
  },
  watch: {
      // 当replaceObj发生变化时，执行
      
  },
  mounted() {
    this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))
    // 币种
    this.getSelectDict("/beta/betaService/COS.IQ.02.0034", {operationMode: this.logininfo.operationMode}).then((res) => {
        this.pricingScopeOptions = res
    })
    
  },
  methods: {

  }


}
</script>

<style>

</style>

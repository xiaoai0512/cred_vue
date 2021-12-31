<!-- 定价标签信息组件 -->
<template>
    <div class="allContent" >
        <el-form ref="formRef" :model="formObj" :rules="formRules">
            <el-form-item class="cl_td bnone" label="运营模式" prop="operationMode" >
                <el-input v-model="formObj.operationMode" class="wd200" type="text" readonly />
           </el-form-item>
           <el-form-item class="cl_td bnone" label="标签号" prop="pricingTag" >
                 <el-input v-model="formObj.pricingTag" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="定价类型" prop="pricingObject">
                <el-input v-model="formObj.pricingObject" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="定价对象" prop="pricingObjectCode" >
                 <el-input v-model="formObj.pricingObjectCode" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="定价描述" prop="pricingDesc">
                <el-input v-model="formObj.pricingDesc" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="定价区域" prop="pricingType" >
                <el-select clearable  v-model="formObj.pricingType" class="wd200" diabled>
                    <el-option
                      v-for="(item, index ) in pricingTypeOptions"
                      :key="index"
                      :label="item.detailDesc"
                      :value="item.codes"
                    />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td bnone" label="优先级" prop="performOrder">
                <el-input v-model="formObj.performOrder" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="定价方式" prop="pricingMethod" >
                <el-select clearable  v-model="formObj.pricingMethod" class="wd200" diabled>
                    <el-option
                      v-for="(item, index ) in pricingMethodOptions"
                      :key="index"
                      :label="item.detailDesc"
                      :value="item.codes"
                    />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td bnone" label="取值类型" prop="pcdType">
                <el-select clearable  v-model="formObj.pcdType" class="wd200" diabled>
                    <el-option
                      v-for="(item, index ) in pcdTypeOptions"
                      :key="index"
                      :label="item.detailDesc"
                      :value="item.codes"
                    />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td bnone" label="取值" prop="pcdValue" >
                 <el-input v-model="formObj.pcdValue" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="小数位" prop="pcdPoint">
                <el-input v-model="formObj.pcdPoint" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="附卡基准年费 " prop="supplementBaseFee" >
                 <el-input v-model="formObj.supplementBaseFee" class="wd200" type="text" readonly />
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
  name: 'PriceLabelInfo',
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
        formRef: {},
        formRules: {},
        pricingTypeOptions: [], // 定价区域
        pricingMethodOptions: [], // 定价方式
        pcdTypeOptions: [], // 取值类型
    }
  },
  created() {
      
  },
  watch: {
      // 当replaceObj发生变化时，执行
      
  },
  mounted() {
    // 定价区域
    this.getSelectDict("dic_priceArea").then((res) => {
      this.pricingTypeOptions = res
    })
    // 定价方式
    this.getSelectDict("dic_priceModel").then((res) => {
      this.pricingMethodOptions = res
    })
    // 取值类型
    this.getSelectDict("dic_valueType").then((res) => {
      this.pcdTypeOptions = res
    })
  },
  methods: {

  }


}
</script>

<style>

</style>

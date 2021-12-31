<!-- 授权例外名单VISA组件 -->
<template>
    <div class="" >
        <el-form ref="formRef" :model="formObj" :rules="formRules">
            <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo" >
                <el-input v-model="formObj.externalIdentificationNo" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="卡组织标识" prop="cardAssociations" >
                <el-input v-model="formObj.cardAssociations" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="报告日期" prop="contrlReportDate" >
                <el-input v-model="formObj.contrlReportDate" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="报告时间" prop="contrlReportTm" >
                <el-input v-model="formObj.contrlReportTm" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="删除日期" prop="contrlDelDate" >
                <el-input v-model="formObj.contrlDelDate" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="说明" prop="contrlDesc" >
                <el-input v-model="formObj.contrlDesc" class="wd200" type="text" />
            </el-form-item>
            <div class="mainname titleInfo">MC详情</div>
            <el-form-item class="cl_td" label="顺序号" prop="cardSerialNo" >
                <el-input v-model="formObj.cardSerialNo" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="有效期" prop="expirationDate" >
                <el-input v-model="formObj.expirationDate" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="控管原因" prop="contrlReason" >
                <el-input v-model="formObj.contrlReason" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="VIP金额" prop="vipAmount" >
                <el-input v-model="formObj.vipAmount" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="币种" prop="currencyCode" >
                <el-input v-model="formObj.currencyCode" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="同步状态" prop="syncFlag" >
                <el-input v-model="formObj.syncFlag" class="wd200" type="text" />
            </el-form-item>
            
            
        </el-form>
    </div>
</template>

<script>
export default {
  name: 'ExceptionMInfo',
  props: {
      // form
    formObj: {
        type: Object,
        default: {} 
    }
  },
  components: {},
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
        
    }
  },
  created() {},
  watch: {
      // 当replaceObj发生变化时，执行  
  },
  mounted() {},
  methods: {}
}
</script>

<style>

</style>

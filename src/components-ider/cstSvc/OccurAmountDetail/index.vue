<!-- 发生额详情组件 -->
<template>
    <div class="" >
        <el-form ref="formRef" :model="formObj" :rules="formRules">
            <!-- <el-form-item  
                class="cl_td bnone" 
                v-for="(item, index ) in formList"
                :key="index"
                :label="item.label"
                :prop="item.prop"
            >
                <el-input v-model="formObj[item.prop]" class="wd200" type="text" readonly />
            </el-form-item> -->


           <el-form-item class="cl_td bnone" label="余额单元" prop="balanceUnitCode" >
                 <el-input v-model="formObj.balanceUnitCode" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="起息日期" prop="interestStartDate">
                <el-input v-model="formObj.interestStartDate" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="节点类别" prop="nodeTyp" >
                <el-select v-model="formObj.nodeTyp" class="wd200">
                    <el-option 
                    v-for="(item, index) in nodeTypOptions" 
                    :key="index" 
                    :label="item.detailDesc" 
                    :value="item.codes" />
                  </el-select> 
                <el-input v-model="formObj.billingStartDate" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="当前发生额（余额）" prop="occurrAmount">
                <el-input v-model="formObj.occurrAmount" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="建立日期" prop="createDate">
                <el-input v-model="formObj.createDate" class="wd200" type="text" readonly />
            </el-form-item>
            <el-form-item class="cl_td bnone" label="周期号" prop="cycleNo">
                <el-input v-model="formObj.cycleNo" class="wd200" type="text" readonly />
            </el-form-item>
            
        </el-form>
    </div>
</template>

<script>
export default {
  name: 'OccurAmountDetail',
  props: {
      // form
    formObj: {
        type: Object,
        default: {} 
    }

  },
  components: {
      
  },
  created() {},
  activated() {},
  mounted() {
      // 节点类别
    this.getSelectDict('dic_nodeType').then((res) => {
        this.nodeTypOptions = res
    })
    
  },
  watch: {
      formObj () {}
  },
  data() {
    return { 
        formRef: {},
        formRules: {},
        nodeTypOptions: [],
    }
  },
  created() {
      
  },
  watch: {
      // 当replaceObj发生变化时，执行
      
  },
  mounted() {
    
  },
  methods: {

  }


}
</script>

<style>

</style>

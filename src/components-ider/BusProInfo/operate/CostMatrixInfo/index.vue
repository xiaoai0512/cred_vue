<!-- 费用矩阵信息组件 -->
<template>
    <div class="" >
        <div class="text_title padLf10">费用矩阵信息</div>
        <el-form class="mtop20" ref="formRef" :model="formObj" :rules="formRules">
            <el-form-item class="cl_td_half" label="费用标识" prop="feeFlag">
                <el-select v-model="formObj.feeFlag" class="wd150" clearable >
                    <el-option
                    v-for="(item, index ) in feeFlagOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.codes"
                    />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td_half" ></el-form-item>
            <el-form-item class="cl_td_half" label="应用方式" prop="matrixAppMode">
                <el-select v-model="formObj.matrixAppMode" class="wd150" clearable >
                    <el-option
                    v-for="(item, index ) in matrixAppModeOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.codes"
                    />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td_half" label="应用维度" prop="feeMatrixApplicationDimension">
                <el-select v-model="formObj.feeMatrixApplicationDimension" class="wd150" clearable>
                    <el-option
                    v-for="(item, index ) in feeMatrixApplicationDimensionOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.codes"
                    />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td_half" label="笔数1" prop="transCount1">
                <el-input v-model="formObj.transCount1" class="wd150" type="text" />
            </el-form-item>
            <el-form-item class="cl_td_half" label="匹配关系1" prop="matchRelation1">
                <el-select v-model="formObj.matchRelation1" class="wd150" clearable>
                    <el-option
                    v-for="(item, index ) in matchRelationOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.codes"
                    />
                </el-select>
            </el-form-item>
             <el-form-item class="cl_td_half" label="金额1" prop="transAmount1">
                <el-input v-model="formObj.transAmount1" class="wd150" type="text" />
            </el-form-item>
             <el-form-item class="cl_td_half" label="费率1" prop="feeRate1">
                <el-input v-model="formObj.feeRate1" class="wd150" type="text" />
            </el-form-item>


            <el-form-item class="cl_td_half" label="笔数2" prop="transCount2">
                <el-input v-model="formObj.transCount2" class="wd150" type="text" />
            </el-form-item>
            <el-form-item class="cl_td_half" label="匹配关系2" prop="matchRelation2">
                <el-select v-model="formObj.matchRelation2" class="wd150" clearable>
                    <el-option
                    v-for="(item, index ) in matchRelationOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.codes"
                    />
                </el-select>
            </el-form-item>
             <el-form-item class="cl_td_half" label="金额2" prop="transAmount2">
                <el-input v-model="formObj.transAmount2" class="wd150" type="text" />
            </el-form-item>
             <el-form-item class="cl_td_half" label="费率2" prop="feeRate2">
                <el-input v-model="formObj.feeRate2" class="wd150" type="text" />
            </el-form-item>


            <el-form-item class="cl_td_half" label="笔数3" prop="transCount3">
                <el-input v-model="formObj.transCount3" class="wd150" type="text" />
            </el-form-item>
            <el-form-item class="cl_td_half" label="匹配关系3" prop="matchRelation3">
                <el-select v-model="formObj.matchRelation3" class="wd150" clearable>
                    <el-option
                    v-for="(item, index ) in matchRelationOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.codes"
                    />
                </el-select>
            </el-form-item>
             <el-form-item class="cl_td_half" label="金额3" prop="transAmount3">
                <el-input v-model="formObj.transAmount3" class="wd150" type="text" />
            </el-form-item>
             <el-form-item class="cl_td_half" label="费率3" prop="feeRate3">
                <el-input v-model="formObj.feeRate3" class="wd150" type="text" />
            </el-form-item>


            <el-form-item class="cl_td_half" label="笔数4" prop="transCount4">
                <el-input v-model="formObj.transCount4" class="wd150" type="text" />
            </el-form-item>
            <el-form-item class="cl_td_half" label="匹配关系4" prop="matchRelation4">
                <el-select v-model="formObj.matchRelation4" class="wd150" clearable>
                    <el-option
                    v-for="(item, index ) in matchRelationOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.codes"
                    />
                </el-select>
            </el-form-item>
             <el-form-item class="cl_td_half" label="金额4" prop="transAmount4">
                <el-input v-model="formObj.transAmount4" class="wd150" type="text" />
            </el-form-item>
             <el-form-item class="cl_td_half" label="费率4" prop="feeRate4">
                <el-input v-model="formObj.feeRate4" class="wd150" type="text" />
            </el-form-item>


            <el-form-item class="cl_td_half" label="笔数5" prop="transCount5">
                <el-input v-model="formObj.transCount5" class="wd150" type="text" />
            </el-form-item>
            <el-form-item class="cl_td_half" label="匹配关系5" prop="matchRelation5">
                <el-select v-model="formObj.matchRelation5" class="wd150" clearable>
                    <el-option
                    v-for="(item, index ) in matchRelationOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.codes"
                    />
                </el-select>
            </el-form-item>
             <el-form-item class="cl_td_half" label="金额5" prop="transAmount5">
                <el-input v-model="formObj.transAmount5" class="wd150" type="text" />
            </el-form-item>
             <el-form-item class="cl_td_half" label="费率5" prop="feeRate5">
                <el-input v-model="formObj.feeRate5" class="wd150" type="text" />
            </el-form-item>
        </el-form>
    </div>
</template>

<script>

export default {
  name: 'CostMatrixInfo',
  props: {
      // form
    formObj: {
        type: Object,
        default: {} 
    },
    isReadonly: {
        type: Boolean,
        default : true
    },

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

        feeFlagOptions: [],
        matrixAppModeOptions: [],
        feeMatrixApplicationDimensionOptions: [],
        matchRelationOptions: [],
    }
  },
  created() {
  },
  watch: {
      // 当replaceObj发生变化时，执行
      
  },
  mounted() {
    // 费用标识
    this.getSelectDict('dic_feeFlag').then((res) => {
        this.feeFlagOptions = res
    })
    // 矩阵应用方式
    this.getSelectDict('dic_matrixAppMode').then((res) => {
        this.matrixAppModeOptions = res
    })
    // 应用维度
    this.getSelectDict('dic_feeMatrixApplicationDimension').then((res) => {
        this.feeMatrixApplicationDimensionOptions = res
        console.log(res)
    })
    // 匹配关系
    this.getSelectDict('dic_matchRelation').then((res) => {
        this.matchRelationOptions = res
    })
  },
  methods: {
    // 表单验证
    submitForm() {
        return this.$refs.formRef.validate()
   }
  }


}
</script>

<style>
.cl_td_half .el-form-item__label {
    width: 35%;
}
</style>

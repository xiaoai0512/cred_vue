<!-- 业务项目基本信息组件 -->
<template>
    <div class="" >
        <el-form ref="busProInfoFormRef" :model="busProInfoFormObj" :rules="busProInfoFormRules">
            <el-form-item class="cl_td" label="运营模式" prop="operationMode" v-if=" action != 'add'  " :hidden="isHidden"
            :rules="[ { required: true, message: '运营模式不能为空'} ]">
                <el-select v-model="busProInfoFormObj.operationMode" class="wd200" clearable  disabled>
                <el-option
                    v-for="(item, index ) in operationModeOptions"
                    :key="index+'aa'"
                    :label="item.modeName"
                    :value="item.operationMode"
                />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="运营模式" prop="operationMode" v-if=" action == 'add'  " :hidden="isHidden"
            :rules="[ { required: true, message: '运营模式不能为空'} ]">
                <el-select v-model="busProInfoFormObj.operationMode" class="wd200" clearable >
                <el-option
                    v-for="(item, index ) in operationModeOptions"
                    :key="index"
                    :label="item.modeName"
                    :value="item.operationMode"
                />
                </el-select>
            </el-form-item>

            <el-form-item class="cl_td" label="业务项目代码" prop="businessProgramNoHalf" v-if=" action == 'add' "
            :rules="[ { required: true, message: '业务项目代码不能为空'},
            {max: 5, min: 5 , message: '长度为 5 个字符'},
            { validator: this.validNumber}
            ]">
                MODG <el-input v-model="busProInfoFormObj.businessProgramNoHalf" class="wd150" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="业务项目代码" prop="businessProgramNo" v-if=" action != 'add' "
            :rules="[ { required: true, message: '业务项目代码不能为空'}]">
                <el-input v-model="busProInfoFormObj.businessProgramNo" class="wd200" type="text"  readonly/>
            </el-form-item>
           
            <el-form-item class="cl_td" label="业务项目描述" prop="programDesc" v-if=" action == 'detail' ">
                <el-input v-model="busProInfoFormObj.programDesc" class="wd200" type="text" readonly/>
            </el-form-item>
            <el-form-item class="cl_td" label="业务项目描述" prop="programDesc" v-if=" action != 'detail' ">
                <el-input v-model="busProInfoFormObj.programDesc" class="wd200" type="text" />
            </el-form-item>

            <el-form-item class="cl_td" label="默认业务类型" prop="feeBusinessType" v-if=" action == 'detail' ">
                <el-input v-model="busProInfoFormObj.feeBusinessType" class="wd200" type="text" readonly />
            </el-form-item>
             <el-form-item class="cl_td" label="默认业务类型" prop="feeBusinessType" v-if=" action != 'detail' ">
                <el-input v-model="busProInfoFormObj.feeBusinessType" class="wd200" type="text" />
            </el-form-item>

            <el-form-item class="cl_td" label="还款优先级" prop="paymentPriority" v-if=" action == 'detail' ">
                <el-input v-model="busProInfoFormObj.paymentPriority" class="wd200" type="text" readonly/>
            </el-form-item>
             <el-form-item class="cl_td" label="还款优先级" prop="paymentPriority" v-if=" action != 'detail' ">
                <el-input v-model="busProInfoFormObj.paymentPriority" class="wd200" type="text" />
            </el-form-item>

            <el-form-item class="cl_td" label="承责属性" prop="responseType"  v-if=" action == 'detail' ">
                <el-select v-model="busProInfoFormObj.responseType" class="wd200" clearable disabled> 
                    <el-option
                    v-for="(item, index ) in responseTypeOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.codes"
                    />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="承责属性" prop="responseType"  v-if=" action != 'detail' ">
                <el-select v-model="busProInfoFormObj.responseType" class="wd200" clearable> 
                    <el-option
                    v-for="(item, index ) in responseTypeOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.codes"
                    />
                </el-select>
            </el-form-item>

             <el-form-item class="cl_td" label="项目类型" prop="programType"
            :rules="[ { required: true, message: '项目类型不能为空'} ]" v-if=" action == 'detail' ">
                <el-select v-model="busProInfoFormObj.programType" class="wd200" clearable disabled>
                    <el-option
                    v-for="(item, index ) in programTypeOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.codes"
                    />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="项目类型" prop="programType"
            :rules="[ { required: true, message: '项目类型不能为空'} ]" v-if=" action != 'detail' ">
                <el-select v-model="busProInfoFormObj.programType" class="wd200" clearable >
                    <el-option
                    v-for="(item, index ) in programTypeOptions"
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
  name: 'BusProInfo',
  props: {
      // form
    busProInfoFormObj: {
        type: Object,
        default: {} 
    },
    busProInfoFormRef: {
        type: Object,
        default: {} 
    },
    busProInfoFormRules: {
        type: Object,
        default: {} 
    },
    action: {
        type: String,
        default: 'add', // add: 新增，detail: 详情， update: 修改， copy: 复制
    },
    isHidden: {
        type: Boolean,
        default : false
    }

  },
  components: {},
  data() {
    return { 
        

        // 下拉框
        operationModeOptions: [],
        feeBusinessTypeOptions: [],
        responseTypeOptions: [],
        programTypeOptions: []

    }
  },
  created() {
    this.$emit('childByFormObj', this.busProInfoFormObj)
    this.$emit('childByFormRef', this.busProInfoFormRef)
    this.$emit('childByFormRules', this.busProInfoFormRules)

    console.log('busProInfoFormObj', this.busProInfoFormObj)
    console.log('busProInfoFormRef', this.busProInfoFormRef)
    console.log('busProInfoFormRules', this.busProInfoFormRules)



      
  },
  watch: {
      // 当replaceObj发生变化时，执行
      
  },
  mounted() {
    //   this.submitForm()
    // 运营模式 
    this.getSelectDict( "/beta/betaService/COS.IQ.02.0006").then(res => {
        this.operationModeOptions = res
    })
    // 业务类型 
    this.getSelectDict( "/beta/betaService/COS.IQ.02.0020").then(res => {
        if (res.length > 0) {
            res.forEach( item => {
                item.labelDesc = item.businessTypeCode + ' ' + item.businessDesc
            })
            this.feeBusinessTypeOptions = res
        }
    })
    // 承责属性
    this.getSelectDict('dic_responseType').then((res) => {
        this.responseTypeOptions = res
    })
    // 项目类型
    this.getSelectDict('dic_productType').then((res) => {
        this.programTypeOptions = res
    })
  },
  methods: {
     // 表单验证数字
    validNumber: (rule, value, callback) => {
        if (!isNumber(value)) {
        callback(new Error('请输入数字'))
        } else {
            callback()
        }
    },
    // 表单验证
    submitForm() {
        return this.$refs.busProInfoFormRef.validate()
        // console.log(this.$refs.busProInfoFormRef.validate())
30   },

  }


}
</script>

<style>

</style>

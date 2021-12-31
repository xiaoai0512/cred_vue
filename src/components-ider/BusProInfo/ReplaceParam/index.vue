<!-- 替换参数 -->
<template>
    <div class="allContent">
        <el-table
            :data="replaceParamList"
            class="mbtm20"
            fit
            highlight-current-row
            style="width: 100%;"
            border
            @current-change="handleCurrParamsChange"
            @row-click="chooseCurrParams"
        >   
            <el-table-column width="55">
                <template slot-scope="scope">
                <el-radio v-model="elementNoRadio" :label="scope.row.elementNo">
                    <span class="el-radio__label"></span>
                </el-radio>
                </template>
            </el-table-column>
            <el-table-column prop="elementNo" label="参数选项" align="center" />
            <el-table-column prop="elementDesc" label="描述" align="center" />
        </el-table>
    </div>
</template>

<script>
export default {
  name: 'ReplaceParam',
  props: {
    replaceObj: {
        type: Object,
        default: {},
    },
    replaceIndex: {
        type: Number,
    },
    defalutVal: {
        type: String, 
    }

  },
  components: {},
  data() {
    return { 
        replaceParamList: [],
        elementNoRadio: '',
        elementDescRadio: '',
        chooseCurrObj : {},
    }
  },
  created() {
        this.getList()
  },
  watch: {
      // 当replaceObj发生变化时，执行
      replaceObj () {
          this.getList()
      }
  },
  mounted() {
    // 分段类型
    this.getSelectDict('dic_segmentationType').then((res) => {
        this.segmentTypeOptions = res
    })
    // 初始化
    // this.init()
  },
  methods: {
    init() {
        this.elementNoRadio = ''
        this.elementDescRadio = ''
    } ,  
     getList(){
        this.elementNoRadio = this.defalutVal
        let obj = {
            artifactNo : this.replaceObj.artifactNo,
		    pcdNo : this.replaceObj.elementNo.substring(0,8),
        }
        this.getTableList('/beta/betaService/COS.IQ.02.0009', obj ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.replaceParamList = res.returnData.rows
                }
            }
        })
    },
    handleCurrParamsChange(val) {
        this.chooseCurrObj = val
    },
    chooseCurrParams(val) {
        this.elementNoRadio = val.elementNo
        this.elementDescRadio = val.elementDesc
        let elementStr = val.elementNo+'_'+ val.elementDesc
        this.$emit("childByElementVal", elementStr)   // 利用$emit的方法把值传递给父组件
    },
  }
}
</script>

<style>

</style>

<!-- 查看参数 -->
<template>
    <div class="allContent">
        <div class="text_title padLf10">PCD实例</div>
        <el-form ref="viewPcdFormRef" :model="viewPcdFormObj" :rules="viewPcdFormObjRules">
            <el-form-item class="cl_td" label="PCD编号" prop="pcdNo"
            :rules="[ { required: true, message: 'PCD编号不能为空'}]">
                <el-input v-model="viewPcdFormObj.pcdNo" class="wd200" type="text" readonly/>
            </el-form-item>
            <el-form-item class="cl_td" label="分段类型" prop="segmentType">
                <el-select v-model="viewPcdFormObj.segmentType" class="wd200" clearable disabled>
                    <el-option
                        v-for="(item, index ) in segmentTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                    />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="基础实例维度" prop="baseInstanDimen">
                <el-input v-model="viewPcdFormObj.baseInstanDimen" class="wd200" type="text" readonly/>
            </el-form-item>
            <el-form-item class="cl_td" label="基础实例代码" prop="baseInstanCode">
                <el-input v-model="viewPcdFormObj.baseInstanCode" class="wd200" type="text" readonly/>
            </el-form-item>
            <el-form-item class="cl_td" label="可选实例维度" prop="optionInstanDimen">
                <el-input v-model="viewPcdFormObj.optionInstanDimen" class="wd200" type="text" readonly/>
            </el-form-item>
            <el-form-item class="cl_td" label="可选实例代码" prop="optionInstanCode">
                <el-input v-model="viewPcdFormObj.optionInstanCode" class="wd200" type="text" readonly/>
            </el-form-item>
        </el-form>
        <el-table
            :data="pcdList"
            class="mbtm20"
            fit
            highlight-current-row
            style="width: 100%;"
            border
        >
            <el-table-column prop="segmentSerialNum" label="分段序号" align="center" />
            <el-table-column prop="pcdType" label="取值类型" align="center" />
            <el-table-column prop="segmentValue" label="分段取值" align="center" />
            <el-table-column prop="pcdValue" label="取值" align="center" />
            <el-table-column prop="pcdPoint" label="取值小数位" align="center" />
        </el-table>
    </div>
</template>

<script>
export default {
  name: 'ViewPcd',
  props: {
    viewPcdFormObj: {
        type: Object,
        default: function() {
            return {
                pcdNo: '',
                segmentType: '',
                baseInstanCode: '',
                optionInstanCode: '',
                pcdInstanList: []
            }
        }
    },

  },
  components: {},
  data() {
    return { 
        segmentTypeOptions: [],
        viewPcdFormRef: {},
        viewPcdFormObjRules: {},
        pcdList: [],

    }
  },
  watch: {
      // 当replaceObj发生变化时，执行
      viewPcdFormObj () {
          this.getList()
      }
  },
  mounted() {
    // 分段类型
    this.getSelectDict('dic_segmentationType').then((res) => {
        this.segmentTypeOptions = res
    })

    this.getList()
    	
  },
  methods: {
    getList(){
        this.pcdList = this.viewPcdFormObj.pcdInstanList
    }
  }
}
</script>

<style>

</style>

<!-- 设置参数 -->
<template>
    <div class="allContent">
        <el-form ref="setPcdFormRef" :model="setPcdObj" :rules="setPcdFormObjRules">
            <el-form-item class="cl_td" label="PCD编号" prop="pcdNo"
            :rules="[ { required: true, message: 'PCD编号不能为空'}]">
                <el-input v-model="setPcdObj.pcdNo" class="wd200" type="text" readonly/>
            </el-form-item>
            <el-form-item class="cl_td" label="分段类型" prop="segmentType">
                <el-select v-model="setPcdObj.segmentType" class="wd200" clearable disabled>
                    <el-option
                        v-for="(item, index ) in segmentTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                    />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="基础实例维度" prop="baseInstanDimenAddD">
                <el-select v-model="setPcdObj.baseInstanDimenAddD" class="wd200" clearable disabled>
                    <el-option
                        v-for="(item, index ) in baseInstanDimenAddDOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                    />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="基础实例代码" prop="baseInstanCode">
                <el-input v-model="setPcdObj.baseInstanCode" class="wd200" type="text" readonly/>
            </el-form-item>
            <el-form-item class="cl_td" label="可选实例维度" prop="optionInstanDimenAddD">
                <el-select v-model="setPcdObj.optionInstanDimenAddD" class="wd200" clearable disabled>
                    <el-option
                        v-for="(item, index ) in optionInstanDimenAddDOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                    />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="可选实例代码" prop="optionInstanCode">
                <el-input v-model="setPcdObj.optionInstanCode" class="wd200" type="text" readonly/>
            </el-form-item>
        </el-form>
        <div class="text_title" style="margin: 20px 0" v-if="setPcdObj.segmentType != null">
            <el-button size="small" icon="el-icon-plus" type="primary" @click="addPcdBtn()">
                新增
            </el-button>
        </div>
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
            <el-table-column prop="" label="操作" align="center" width="200">
                <template slot-scope="{row, $index}">
                    <el-button size="mini" type="primary" @click="handleUpPcd(row, $index)">修改
                    </el-button>
                    <el-button size="mini" type="primary" @click="handleDeletePcd(row, $index)">删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- pcdIntance信息 -->
        <el-form ref="pcdIntanFormRef" :rules="pcdIntanFormRules" :model="pcdIntanFormTempObj" v-show="pcdIntanPart">
                <el-form-item class="cl_td" label="分段序号 " prop="pcdNo">
                    <el-input v-model="pcdIntanFormTempObj.segmentSerialNum" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="取值类型" prop="pcdType">
                    <el-select v-model="pcdIntanFormTempObj.pcdType" class="wd200" clearable>
                        <el-option
                        v-for="(item, index ) in pcdTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="分段取值" prop="segmentValue">
                    <el-input v-model="pcdIntanFormTempObj.segmentValue" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="取值" prop="pcdValue">
                    <el-input v-model="pcdIntanFormTempObj.pcdValue" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="取值小数位" prop="pcdPoint">
                    <el-input v-model="pcdIntanFormTempObj.pcdPoint" class="wd200" type="text" />
                </el-form-item>
                <div class="cl_tr text_center">
                    <el-button size="medium" icon="el-icon-circle-check" type="primary" @click="pcdIntanceSave()">保存</el-button>
                    <el-button size="medium" icon="el-icon-circle-close" type="primary" @click="pcdIntanceClose()">关闭</el-button>
                </div>
            </el-form>
    </div>
</template>

<script>
export default {
  name: 'SetPcd',
  props: {
    setPcdObj: {
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
    }
  },
  components: {},
  data() {
    return { 
        segmentTypeOptions: [],
        setPcdFormRef: {},
        setPcdFormObjRules: {},
        pcdList: [],
        pcdTypeOptions: [],

        // 实例信息
        pcdIntanFormRef: {},
        pcdIntanFormRules: {},
        pcdIntanFormTempObj: {},
        pcdIntanPart: false,
        deletPcdList: [],
        baseInstanDimenAddDOptions: [],
        optionInstanDimenAddDOptions: [],
        isSerialNum:'',
        updateSaveFlag:false

    }
  },
  created() {},
  watch: {
      // 当replaceObj发生变化时，执行
      setPcdObj () {
          this.getList()
      }
  },
  mounted() {
    // 分段类型
    this.getSelectDict('dic_segmentationType').then((res) => {
        this.segmentTypeOptions = res
    })	
     // 取值类型下拉框
    this.getSelectDict('dic_valueType').then((res) => {
        this.pcdTypeOptions = res
    })
    //基础实例维度
     this.getSelectDict('dic_dimensionalValue').then((res) => {
        this.baseInstanDimenAddDOptions = res
    })  
     //可选实例维度
    this.getSelectDict('dic_dimensionalValue').then((res) => {
        this.optionInstanDimenAddDOptions = res
    })
     this.getList()
  },
  methods: {
    getList(){
        if (this.setPcdObj.pcdInitList && Array.isArray(this.setPcdObj.pcdInitList) && this.setPcdObj.pcdInitList.length > 0) {
            this.pcdList = this.setPcdObj.pcdInitList
        }
        if(this.setPcdObj.pcdInstanList && Array.isArray(this.setPcdObj.pcdInstanList) && this.setPcdObj.pcdInstanList.length > 0 ) {
            this.pcdList = this.setPcdObj.pcdInstanList
        }
        if (this.setPcdObj.pcdList && Array.isArray(this.setPcdObj.pcdList) && this.setPcdObj.pcdList.length > 0) {
            this.pcdList = this.setPcdObj.pcdList
        }
        this.$emit("childBySetVal", this.pcdList)   // 利用$emit的方法把值传递给父组件
        this.$emit("childByDeletPcd", this.deletPcdList)   // 利用$emit的方法把值传递给父组件
    },
    addPcdBtn() {
        this.pcdIntanPart = true
        this.isSerialNum = this.pcdList.length
        this.updateSaveFlag = false
        this.pcdIntanFormTempObj.segmentSerialNum = this.isSerialNum++
    },
    // 修改
    handleUpPcd(row,index) {
        this.pcdIndex = index
        this.pcdIntanFormTempObj = row
        this.updateSaveFlag = true
        this.pcdIntanPart = true
    },
    // 删除
    handleDeletePcd(row,index) {
        this.$confirm('此操作将永久删除PCD, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
             if(this.pcdList.length==1){
                this.$message({
                    message: '必须有一条PCD取值！',
                    type: 'warning'
                })
                return;
            }
            this.pcdList.splice(index,1)
            this.deletPcdList.push(row.id)
            this.getList()
        })
    },

    // 业务类型实例化 修改pcd保存
    pcdIntanceSave() {
        if(this.updateSaveFlag){
            this.$set(this.pcdList, this.pcdIndex, this.pcdIntanFormTempObj)
        }else{
            this.pcdIntanFormTempObj.operationMode = this.setPcdObj.operationMode
            this.pcdIntanFormTempObj.pcdNo = this.setPcdObj.pcdNo
            this.pcdIntanFormTempObj.instanCode1 = this.setPcdObj.instanCode1
            this.pcdIntanFormTempObj.instanCode2 = this.setPcdObj.instanCode2
            this.pcdIntanFormTempObj.instanCode3 = this.setPcdObj.instanCode3
            this.pcdIntanFormTempObj.instanCode4 = this.setPcdObj.instanCode4
            this.pcdIntanFormTempObj.instanCode5 = this.setPcdObj.instanCode5
            this.pcdList.push(this.pcdIntanFormTempObj)
        }
        this.pcdIntanPart = false
        this.getList()
    },
    // 业务类型实例化 修改pcd关闭
    pcdIntanceClose() {
        this.pcdIntanPart = false
        this.getList()
    },

  }
}
</script>

<style>

</style>

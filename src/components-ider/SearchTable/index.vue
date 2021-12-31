<!-- 带查询的表格 -->
<template>
    <div class="">
        <div>
            <el-form :inline="true" :model="queryObj" class="demo-form-inline">
                <el-form-item  v-if="queryObj.prop1"
                :label="queryObj.label1" 
                :prop="queryObj.prop1"
                >
                    <el-input v-model="prop1" class="wd200" type="text" />
                </el-form-item>
                <el-form-item v-if="queryObj.prop2"
                :label="queryObj.label2" 
                :prop="queryObj.prop2"
                >
                    <el-input v-model="prop2" class="wd200" type="text" />
                </el-form-item>
                <el-form-item v-if="queryObj.prop1">
                    <el-button type="primary" @click="handleSearch">查询</el-button>
                </el-form-item>
            </el-form>
        </div>
        <el-table
            v-loading="loading"
            :data="tableData"
            class="mbtm20"
            fit
            highlight-current-row
            style="width: 100%;"
            border
            @current-change="handleCurrChange"
            @row-click="chooseCurrClick"   
        >
        <!-- @row-click="chooseCurrClick" -->
            <el-table-column width="55" label="选择">
                <template slot-scope="scope">
                    <el-radio v-model="currValRadio" :label="scope.row[queryObj.prop1]">
                        <span class="el-radio__label"></span>
                    </el-radio>
                </template>
            </el-table-column>
            <el-table-column v-for="(item, index) in tableLabel" :key = index :width="item.width" :label="item.label" align="center" >
                <template slot-scope="scope">
                    <span>{{ scope.row[item.prop] }}</span>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="config.total>0" :total="config.total" :page.sync="config.pageNum" :limit.sync="config.pageSize" @pagination="getList" />
    </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import { elementInside } from 'dropzone';

export default {
  name: 'SearchTable',
  props: {
    tableLabel: Array,
    queryObj: {
        type: Object
    },
    params : {
        type: Object
    },
    url : {
        type: String
    },
    codeStr: {
        type: String,
        default: ''
    },
    // currValLabel:{
    //     type: String,
    //     default: ''
    // }
    
  },
  components: {
      Pagination,
  },
  computed: {

  },
  data() {
    return { 
        loading: false,
        currValRadio: '',
        tableData: [],
        config: {
            total: 0,
            pageNum: 1,
            pageSize: 10
        },
        curRow: {},
        prop1: '',
        prop2: '',
    }
  },
  watch: {
      // 当replaceObj发生变化时，执行
      url () {
          this.init()
          this.getList()
      }
  },
  created() {
        this.init()
        this.getList()
  },
  mounted() {},
  methods: {
    getObjKey(obj) {
    for (var key in obj)
    return obj[key]
    },
    init() {
        this.prop1 =''
        this.prop2 = ''
    },
    getList() {
        this.loading = true
        this.tableData.length = 0
        if(this.url === '#'){ // 走接口
            this.loading = false
            if (this.codeStr === 'FTYP') { // 费用收取方式
                this.tableData = [{
                    "feeTpyeDesc": "一次性收取",
                    "feeTpyeCode": "0"
                },
                {
                    "feeTpyeDesc": "分期收取",
                    "feeTpyeCode": "1"
                }]
                this.config.total = this.tableData.length
            }
        } else { // 不走接口
            let key1, key2, params1
            if (this.queryObj.prop1 || this.queryObj.prop2) {
                key1 = this.queryObj.prop1
                this.queryObj[key1] = this.prop1
                if (this.queryObj.prop2) {
                    key2 = this.queryObj.prop2
                    this.queryObj[key2] = this.prop2
                }
            }
            params1 =  Object.assign(this.params, this.config, this.queryObj)
            this.getTableList(this.url, params1 ,(res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows &&res.returnData.rows.length > 0 ) {
                        this.tableData = res.returnData.rows
                        this.config.total = res.returnData.totalCount
                        this.loading = false
                    }
                }
            })

        }
        
    },
    // 
    handleCurrChange(val) {
        this.currValRadio = val[this.queryObj.prop1]
        this.$emit('choseCuurRow', this.currValRadio)
    },
    chooseCurrClick(row) {
        this.currValRadio = row[this.queryObj.prop1]
        this.$emit('chooseCurrClick', this.currValRadio)
    },
    handleSearch() {
        this.getList()   
    }
  }
}
</script>

<style>

</style>

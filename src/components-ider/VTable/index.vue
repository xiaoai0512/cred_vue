<!-- 带查询和修改表格 -->
<template>
    <div class="">
        <el-table
            v-loading="config.loading"
            :data="tableData"
            class="mbtm20"
            fit
            highlight-current-row
            style="width: 100%;"
            border
            @current-change="currentChange"
            @row-click="rowClick"
        >   
            <el-table-column v-if="radioObj.radio" width="55">
                <template slot-scope="scope">
                <el-radio v-model="radio" :label="scope.row[radioObj.radio]">
                    <span class="el-radio__label"></span>
                </el-radio>
                </template>
            </el-table-column>
            <el-table-column v-for="(item, index) in tableLabel" :key = index :width="item.width" :label="item.label" align="center" >
                <template slot-scope="scope">
                    <span>{{ scope.row[item.prop] }}</span>
                </template>
            </el-table-column>
            <el-table-column v-if="btns.length > 0" label="操作" align="center" :width="btnWidth">
                <template v-if="btns.length > 0" slot-scope="{row}">
                    <el-button size="mini" type="primary" v-if="btns[0]" @click="event1(row)">{{btns[0]}}</el-button>
                    <el-button size="mini" type="primary" v-if="btns[1]" @click="event2(row)">{{btns[1]}}</el-button>
                    <el-button size="mini" type="primary" v-if="btns[2]" @click="event3(row)">{{btns[2]}}</el-button>
                    <el-button size="mini" type="primary" v-if="btns[3]" @click="event4(row)">{{btns[3]}}</el-button>
                    
                </template> 
            </el-table-column>
        </el-table>
        <pagination v-show="config.total>0" :total="config.total" :page.sync="config.pageNum" :limit.sync="config.pageSize" @pagination="changePage" />
    </div>
</template>

<script>
import Pagination from "@/components/Pagination";

export default {
  name: 'VTable',
  props: {
    tableLabel: Array,
    tableData: Array,
    config : {
        type: Object,
        default: {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0
        },
    },
    selBtnFlag : {
        type: Boolean,
        default: false,
    },
    updBtnFlag : {
        type: Boolean,
        default: false,
    },
    btns: {
        type: Array,
        default: [],
    },
    btnWidth: {
        type: Number,
        default: 180,
    },
    radioObj: {
        type: Object,
        default: function(){
			return {
                radio: ''
            };
		}
    },
    radio: {
        type: String,
        default: "",
    },

    // event1: {
    //     type: String,
    //     default: '', 
    // },
    // event2: {
    //     type: String,
    //     default: '', 
    // },
    // event3: {
    //     type: String,
    //     default: '', 
    // },
    
  },
  components: {
      Pagination,
  },
  data() {
    return { 

    }
  },
  watch: {
      // 当replaceObj发生变化时，执行
      
  },
  mounted() {
  },
  methods: {
    changePage(page) {
        this.$emit('changePage', page)
    },
    event1(row) {
        this.$emit('event1', row)
    },
    event2(row) {
        this.$emit('event2', row)
    },
    event3(row) {
        this.$emit('event3', row)
    },
    event4(row) {
        this.$emit('event4', row)
    },
    currentChange(val) {
        this.$emit("currentChange", val)   // 利用$emit的方法把值传递给父组件
    },
    rowClick(val) {
        this.$emit("rowClick", val)   // 利用$emit的方法把值传递给父组件
    },

  }
}
</script>

<style>

</style>

<!-- 查看 各对象参数选项 
如： 产品参数选择
产品差异化pcd
余额对象参数选项

必看：
如果只有‘参数选项编号及描述’ ‘PCD及PCD描述’ colunm不传， clounm，控制此列是否显示
如果前面有‘对象’列，处理list，在row中添加 ‘concat’属性 
-->
<template>
    <div class="">
        <div class="text_title" style="margin: 10px 0" >{{textTitle}}</div>
        <el-table
            :data="list"
            fit
            highlight-current-row
            style="width: 100%;"
            border
        >
            <el-table-column  prop="" :label="labelStr" align="center" v-if = "colunm1">
                <template slot-scope="{row}">
                    {{row.concat}}
                </template> 
            </el-table-column>
            <el-table-column prop="" label="参数选项编号及描述" align="center"  width="500" v-if = "colunm2 ">
                <template slot-scope="{row}">
                    <span class="tdDivL">{{row.artifactDesc}}&nbsp;&nbsp;:&nbsp;&nbsp;</span>
                    <span class="tdDivR">{{row.elementNo}}&nbsp;&nbsp;&nbsp;&nbsp;{{row.elementDesc}}</span>
                </template> 
            </el-table-column>

            <el-table-column prop="" label="PCD及PCD描述" align="center" v-if = "colunm3">
                <template slot-scope="{row}">
                {{row.pcdNo}} {{row.pcdDesc}}
                </template> 
            </el-table-column>
            <el-table-column prop="" label="操作" align="center">
                <template slot-scope="{row, $index}">
                    
                    <el-button size="mini" type="primary" v-show="deleteBtn" @click="handleDel(row, $index)" >删除</el-button>
                    <el-button size="mini" type="primary" @click="replaceParamClick(row, $index)" >替换参数</el-button>
                    <el-button size="mini" type="primary" v-show="row.pcdNo != null && row.pcdDesc == '' && row.supportPcd == 'Y'" @click="setParamClick(row, $index)" >设置参数</el-button>
                    <el-button size="mini" type="primary" v-show="row.pcdNo != null && row.pcdDesc != '' && row.supportPcd == 'Y'" @click="setParamClick(row, $index)" >设置{{row.pcdDesc}}</el-button>

                </template> 
            </el-table-column>
        </el-table>
        <!-- <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="tableFormObj.pageNum" :limit.sync="tableFormObj.pageSize" @pagination="getList2" /> -->

    </div>
</template>

<script>
export default {
  name: 'SetParamOption',
  props: {
    textTitle: {
        type: String,
        default: ''
    },
    list: {
        type: Array,
        default: []
    },
    colunm1: {
        type: Boolean,
        default: false
    },
    colunm2: {
        type: Boolean,
        default: true
    },
    colunm3: {
        type: Boolean,
        default: true
    },
    labelStr: {
        type: String,
    },
    deleteBtn: {
        type: Boolean,
        default: false
    },

  },
  components: {},
  data() {
    
    return { 
    }
  },
  created() {},
  watch: {
      // 当replaceObj发生变化时，执行  
  },
  mounted() {},
  methods: {  
      replaceParamClick(row, index) {
          this.$emit('replaceParamClick', row, index)
      },
      setParamClick(row, index) {
          this.$emit('setParamClick', row, index)
      },
      handleDel(row, index) {
        this.$confirm('此操作将永久删除PCD, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.$emit('handleDel', row, index)
        })
      }


  }
}
</script>

<style>

</style>

<!-- 表格 -->
<template>
    <div class="">
        <el-table
            v-loading = "config.loading"
            :data="tableData"
            class="mbtm20"
            fit
            highlight-current-row
            style="width: 100%;"
            border
        >
            <el-table-column v-for="(item, index) in tableLabel" :key = index :width="item.width" :label="item.label" align="center" >
                <template slot-scope="scope">
                    <span>{{ scope.row[item.prop] }}</span>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="config.total>0" :total="config.total" :page.sync="config.pageNum" :limit.sync="config.pageSize" @pagination="changePage" />
    </div>
</template>

<script>
import Pagination from "@/components/Pagination";

export default {
  name: 'TableView',
  props: {
    tableLabel: Array,
    tableData: Array,
    config: {
        type: Object,
        default: {
            total: 0,
            pageNum: 1,
            pageSize: 10,
            loading: false,
        }
    },
    
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
    }
  }
}
</script>

<style>

</style>

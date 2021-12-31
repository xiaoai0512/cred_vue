<!-- 产品参数维护 -->
<template>
    <div class="allContent">
        
        <el-button type="primary" @click="viewBtn()">
                    查看设置参数按钮
        </el-button>

        <!-- 设置参数 弹窗 -->
        <el-dialog title="设置参数" :visible.sync="setParam_dialog" width="85%">

            <set-param-option 
            :textTitle="textTitle1"
            :list="balanceList"
            :labelStr="labelStr"
            :colunm1 = "colunm1"
            :colunm3 = "colunm3"
            @replaceParamClick="replaceParamClick"
            @setParamClick="setParamClick"
            ></set-param-option>
            <pagination v-show="balanceTotal>0" :total="balanceTotal" :page.sync="tableFormObj.pageNum" :limit.sync="tableFormObj.pageSize" @pagination="getList" />



             <div slot="footer" class="dialog-footer">
                <el-button @click="setParam_dialog = false">
                    关闭
                </el-button>
                <el-button type="primary" @click="sureSetData()">
                    确定
                </el-button>
            </div>
        </el-dialog>

    
    </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import SetParamOption from "@/components-ider/SetParamOption";



export default {
  name: 'ProObjectQuery',
  components: {
    Pagination,
    SetParamOption
  },
  data() {
    return {
       
       
    textTitle1: '余额对象参数选项',
    labelStr: '余额对象',
    colunm1: true,
    colunm3: false,
    balanceList: [],
    balanceTotal: 0,
    tableFormObj: {
        pageSize: 10,
        pageNum:1
    },
    setParam_dialog: false,



    }
  },
  created() {
  },
  watch: {
      
  },
  mounted() {

    	
  },
  methods: {
      
    viewBtn() {
        this.setParam_dialog = true
        this.getList()
    },
    getList() {
        let obj = {
            artifactNo : 8,
			instanCode: 'MODT00002',
			operationMode: 'A01',
        }
        this.tableFormObj = Object.assign(this.tableFormObj, obj)
        this.getTableList('/beta/betaService/COS.IQ.02.0015', this.tableFormObj ,(res) => {
            this.table2Loading = false
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {

                    let rows = res.returnData.rows
                    rows.forEach(item => {
                        item.concat = item.instanCode1 + ' ' +item.instanDesc1
                    })
                     this.balanceList = rows
                     this.balanceTotal = res.returnData.totalCount


                }
            } 
        })
    },
    replaceParamClick(row) {
        console.log('9999',row)
    },
    setParamClick(row) {
        console.log('9999',row)
    },


  }
}
</script>

<style>
.cl-tr label.el-form-item__label {
    width:20% !important;
    float: left;
}
.el-radio__label{
    padding-left: 8px;
}

/* 穿梭框 文字显示完全 */
    .el-transfer-panel__item.el-checkbox .el-checkbox__label {
        overflow: visible;
        white-space: nowrap;
    }
</style>

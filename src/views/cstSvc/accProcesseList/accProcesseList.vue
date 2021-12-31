<!-- 非余额变动核算查询 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="运营模式" prop="operationMode" >
                <el-select v-model="queryFormObj.operationMode" class="wd200" clearable>
                <el-option
                    v-for="(item, index ) in operationModeOptions"
                    :key="index"
                    :label="item.modeName"
                    :value="item.operationMode"
                />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="全局流水号" prop="globalSerialNumber">
                <el-input v-model="queryFormObj.globalSerialNumber" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="证件类型" prop="idType">
                <el-select clearable  v-model="queryFormObj.idType" class="wd200">
                    <el-option v-for="item in idTypeOptions" :key="item.codes" :label="item.detailDesc" :value="item.codes" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="证件号码" prop="idNumber">
                <el-input v-model="queryFormObj.idNumber" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                <el-input v-model="queryFormObj.externalIdentificationNo" class="wd200" type="text" />
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()">查询</el-button>
                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="reset">重置</el-button>
            </div>
        </el-form>
        <div v-show="showTable">
            <el-table
                v-loading = "config.loading"
                :data="tableData"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
            >
                <el-table-column prop="accountId" label="账号" align="center" width="220" />
                <el-table-column prop="accountingRuleCode" label="记账规则代码" align="center" width="210">
                    <template slot-scope="{row}">
                        {{row.accountingRuleCode}}
                        {{row.accountingRuleDesc}}
                    </template>
                </el-table-column>
                <el-table-column prop="actualPostingAmount" label="记账金额" align="center" />
                <el-table-column prop="redAccountingFlag" label="记账币种" align="center" >
                    <template slot-scope="{row}">
                        <span>{{row.postingCurrencyCode}}</span>
                        <span>{{row.currencyDesc}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="atomicActionNumber" label="原子动作编号" align="center" width="120">
                    <template slot-scope="{row}">
                        <span>{{row.atomicActionNumber}}</span>
                        <span>{{row.atomicActionNumberDesc}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="atomicActionNumber" label="金额类型编号" align="center" >
                    <template slot-scope="{row}">
                        <span>{{row.amountTypeNumber}}</span>
                        <span>{{row.amountTypeNumberDesc}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="postingDate" label="记账日期" align="center" />
                <el-table-column prop="" label="操作" align="center">
                    <template slot-scope="{row}">
                        <el-button size="mini" icon="el-icon-more" type="primary" @click="handleDetail(row)">详情</el-button>
                    </template> 
                </el-table-column>
            </el-table>
            <pagination v-show="config.total>0" :total="config.total" :page.sync="config.pageNum" :limit.sync="config.pageSize" @pagination="getList" />
        </div>
        <!-- 核算处理详情 弹窗 -->
        <el-dialog title="核算处理详情" :visible.sync="accTreatDetail_dialog"  width="85%">
            <acc-treate-detail
                :formObj="accTreatDetailObj"
            ></acc-treate-detail>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="accTreatDetail_dialog = false">
                    关闭
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import AccTreateDetail from '@/components-ider/cstSvc/AccTreateDetail'


export default {
  name: 'accProcesseList',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Pagination,
    AccTreateDetail, // 核算处理详情
  },
  data() {
    return {
        // 列表
        queryFormObj: {},
        loading: false,
        queryFormRef: {},
        queryFormRules: {},      
        tableData: [],
        showTable: false,
        config: {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0
        },


        // 下拉框
        operationModeOptions: [], 
        idTypeOptions: [], // 子场景序号


        // 核算处理 详情 弹窗
        accTreatDetail_dialog: false,
        accTreatDetailObj: {},
        
        

       
        

    }
  },
  created() {

  },
  mounted() {
    // 运营模式 
    this.getSelectDict( "/beta/betaService/COS.IQ.02.0006").then(res => {
        this.operationModeOptions = res
    })
    // 证件类型
    this.getSelectDict('dic_certificateType').then((res) => {
        this.idTypeOptions = res
    })

    
  },
  methods: {
    init() {
        this.queryFormObj.idType = ''
        this.queryFormObj.idNumber = ''
        this.queryFormObj.operationMode = ''
        this.queryFormObj.globalSerialNumber = ''
        this.queryFormObj.externalIdentificationNo = ''
        this.showTable = false
    },
    // 列表
    getList() {
        this.config.loading = true
        let params = {
            modifyType: 'PART'
        }
        params = Object.assign( params, this.config, this.queryFormObj)
        this.getTableList('/nonfi/nonfinanceService/COS.IQ.01.0014', params ,(res) => {
            if (res.returnCode == '000000') {
                this.config.loading = false
                this.showTable = true
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    let rows = res.returnData.rows
                    this.tableData = rows
                    this.config.total = res.returnData.totalCount
                } else {
                    this.tableData = []
                    this.config.total = 0
                }
            } else {
                this.showTable = false
            }
        })

    },
    handleSearch() {
        this.getList()
    },

    // 详情 按钮
    handleDetail(row) {
        this.accTreatDetail_dialog = true
        this.accTreatDetailObj = Object.assign({}, row)
    },
    
    reset() {
        this.init()
    },
  }
}
</script>

<style>
    .tdDivL {
        width: 65%;
    }
    .tdDivR {
        width: 30%;
    }
</style>

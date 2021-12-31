<!-- 客户业务项目 -->
<template>
    <div class="allContent">
        <el-form :model="queryForm">
            <el-form-item class="cl_td" label="证件类型" prop="idType">
                <el-select v-model="queryForm.idType" class="wd200">
                <el-option v-for="(item, index) in idTypeList" :key="index" :label="item.detailDesc" :value="item.codes" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="证件号码" prop="idNumber">
                <el-input v-model="queryForm.idNumber" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                <el-input v-model="queryForm.externalIdentificationNo" class="wd200" type="text" />
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()">查询</el-button>
                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="reset()">重置</el-button>
            </div>
        </el-form>
      
        <div v-if="showTable">
            <div class="text_title">客户基本信息</div>
            <el-form :model="baseInfoObj" :inline="true" class="demo-form-inline" style="padding-left: 20px;">
                <el-form-item class="mrgt20" label="证件类型" prop="idType">
                    <el-select v-model="baseInfoObj.idType" class="wd200" disabled>
                        <el-option v-for="(item, index) in idTypeList" 
                            :key="index" 
                            :label="item.detailDesc" 
                            :value="item.codes" 
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="mrgt20" label="证件号码" prop="idNumber">
                    <el-input v-model="baseInfoObj.idNumber" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="" label="客户姓名" prop="customerName">
                    <el-input v-model="baseInfoObj.customerName" class="wd200" type="text" readonly/>
                </el-form-item>
            </el-form>
            <div class="text_title">客户业务项目</div>
            <el-table
                v-loading = "config.loading"
                :data="tableData"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
            >
                <el-table-column prop="externalIdentificationNo" label="业务项目" align="center" width="220">
                    <template slot-scope="{row}">
                        {{row.businessProgramNo}}
                        {{row.programDesc}}
                    </template>
                </el-table-column>
                <el-table-column prop="cycleModelDesc" label="账单模式" align="center"/>
                <el-table-column prop="billDay" label="账单日" align="center"/>
                <el-table-column prop="nextBillDate" label="下一账单日期" align="center" />
                <el-table-column prop="currentCycleNumber" label="当前周期号" align="center"  />
                <el-table-column prop="directDebitStatusDesc" label="约定扣款状态" align="center" />
                <el-table-column prop="directDebitModeDesc" label="约定扣款方式" align="center" />
                <el-table-column prop="directDebitBankNo" label="约定还款银行号" align="center" />
                <el-table-column prop="directDebitAccountNo" label="约定还款账户号" align="center" />
                <el-table-column prop="" label="操作" align="center">
                    <template slot-scope="{row}">
                        <el-button size="mini" type="primary" @click="handleDetail(row)">日期明细</el-button>
                    </template> 
                </el-table-column>
            </el-table>
            <pagination v-show="config.total>0" :total="config.total" :page.sync="config.pageNum" :limit.sync="config.pageSize" @pagination="getList" />
            
            <!--  -->
            <div v-show="showDetailDiv">
                <div class="text_title">客户统一日期信息</div>
                <el-table
                    v-loading = "detail_config.loading"
                    :data="detail_tableData"
                    class="mbtm20"
                    fit
                    highlight-current-row
                    style="width: 100%;"
                    border
                >
                    <el-table-column prop="externalIdentificationNo" label="业务项目" align="center"  width="220">
                        <template slot-scope="{row}">
                            {{row.businessProgramNo}}
                            {{row.programDesc}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="cycleNumber" label="周期号" align="center" />
                    <el-table-column prop="statementDate" label="本次账单日期" align="center"/>
                    <el-table-column prop="paymentDueDate" label="本次最后还款日期" align="center" />
                    <el-table-column prop="graceDate" label="本次宽限日期" align="center"  />
                    <el-table-column prop="delinquencyDate" label="本次迟缴费收取日期" align="center" />
                    <el-table-column prop="directDebitDate" label="约定扣款日期" align="center" />
                </el-table>
                <pagination v-show="detail_config.total>0" :total="detail_config.total" :page.sync="detail_config.pageNum" :limit.sync="detail_config.pageSize" @pagination="getDetailList" />
                
            </div>
        </div>
    </div>
  </template>
  
  <script>
  import Pagination from '@/components/Pagination'
  export default {
    name: 'cstBsnisItemQuery',
    components: {
      Pagination
    },
    data() {
      return {
        queryForm: {
            idType: '',
            idNumber: '',
            externalIdentificationNo: '',
        },
        showTable: false,
        config: {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0
        },
        tableData: [],
        // 下拉框
        idTypeList: [],

        baseInfoObj: {},
        
        // 客户统一日期信息
        showDetailDiv: false,
        detail_config: {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0
        },
        detail_tableData: [],
      }
    },
    created() {
  
    },
    mounted() {
      this.getSelectDict('dic_certificateType').then((res) => {
        this.idTypeList = res
      })
    },
    methods: {
        init() {
            this.queryForm = {
                idType: '',
                idNumber: '',
                externalIdentificationNo: '',
            }
            this.showTable = false
            this.tableData = []
        },
      // 重置
      reset() {
        this.init()
      },
      // 点击查询按钮
      handleSearch() {
        if (!this.queryForm.externalIdentificationNo && !this.queryForm.idType && !this.queryForm.idNumber) {
          this.$message({
            message: '请输入查询信息',
            type: 'warning'
          })
          this.init()
        } else {
          if (this.queryForm.idType) {
            if (!this.queryForm.idNumber) {
              this.$message({
                message: '请输入证件号码',
                type: 'warning'
              })
            } else {
              this.getCustBaseInfo()
            }
          } else if (this.queryForm.idNumber) {
            if (!this.queryForm.idType) {
              this.$message({
                message: '请输入证件类型',
                type: 'warning'
              })
            } else {
              this.getCustBaseInfo()
            }
          } else {
            this.getCustBaseInfo()
          }
        }
      },
      // 查询列表 
      getList() {
        this.config.loading = true
        let params = {
            isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_cycleModel','dic_directDebitStatus','dic_directDebitMode'],//查找数据字典所需参数
			transDict : ['cycleModel','directDebitStatus','directDebitMode'],//翻译前后key
        }
        params = Object.assign(params , this.config, this.queryForm )
        this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0020', params, (res) => {
            if (res.returnCode == '000000') {
                this.showTable = true
                this.config.loading = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.tableData = res.returnData.rows
                    this.config.total = res.returnData.totalCount
                } else {
                    this.tableData = []
                    this.config.total = 0 
                }
            }
        })
      },
      // 获取客户基本信息
      getCustBaseInfo () {
        this.post('/nonfi/nonfinanceService/BSS.IQ.01.0001', this.queryForm, (res) => {
            if (res.returnCode == '000000') {
                this.baseInfoObj.idNumber = res.returnData.rows[0].idNumber
                this.baseInfoObj.idType = res.returnData.rows[0].idType
                this.baseInfoObj.customerName = res.returnData.rows[0].customerName
                this.getList()
            }
        })
      },
      // 日期明细
      handleDetail(row) {
            this.getDetailList(row)
      },
      getDetailList(row) {
        this.detail_config.loading = true
        let params = {
            businessProgramNo: row.businessProgramNo
        }
        params = Object.assign(params , this.detail_config, this.queryForm )
        this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0015', params, (res) => {
            if (res.returnCode == '000000') {
                this.showDetailDiv = true
                this.detail_config.loading = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.detail_tableData = res.returnData.rows
                    this.detail_config.total = res.returnData.totalCount
                } else {
                    this.detail_tableData = []
                    this.detail_config.total = 0 
                }
            } else {
                this.showDetailDiv = false
            }
        })
      },
   
    }
  }
  </script>
  
  <style>
  </style>
  
<!-- 媒介激活 -->
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
            <div class="text_title">客户媒介信息</div>
            <el-table
                v-loading = "config.loading"
                :data="tableData"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
                @current-change="handleCurrRowChange"
                @row-click="chooseCurrRow"
            >
                <el-table-column width="55">
                    <template slot-scope="scope">
                    <el-radio v-model="curRowRadio" :label="scope.row.mediaUnitCode">
                        <span class="el-radio__label"></span>
                    </el-radio>
                    </template>
                </el-table-column>
                <el-table-column prop="externalIdentificationNo" label="外部识别号" align="center" />
                <el-table-column prop="" label="产品对象" align="center" width="200">
                    <template slot-scope="{row}">
                        {{row.productObjectCode}}
                        {{row.productDesc}}
                    </template>
                </el-table-column>
                <el-table-column prop="mainSupplyIndicatorDesc" label="主附卡标识" align="center"/>
                <el-table-column prop="mediaObjectDesc" label="媒介对象描述" align="center" />
                <el-table-column prop="activationFlagDesc" label="激活状态" align="center"  />
                <el-table-column prop="activationDate" label="激活日期" align="center" />
                <el-table-column prop="invalidFlagDesc" label="是否有效标识" align="center" />
                <el-table-column prop="invalidReasonDesc" label="无效原因" align="center" />

            </el-table>
            <pagination v-show="config.total>0" :total="config.total" :page.sync="config.pageNum" :limit.sync="config.pageSize" @pagination="getList" />
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="suerAct()">确定激活</el-button>
            </div>
        </div>
    </div>
  </template>
  
  <script>
  import ApiService from '@/api/api-service'
  import Pagination from '@/components/Pagination'
  export default {
    name: 'InterestQueryNew',
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
        curRowRadio: '',
        curRow: {},
        // 下拉框
        idTypeList: [],
        mainSupplyIndicatorOptions: [],

        baseInfoObj: {},
        

      }
    },
    created() {
  
    },
    mounted() {
      this.getSelectDict('dic_certificateType').then((res) => {
        this.idTypeList = res
      })
      // 主附标识
        this.getSelectDict('dic_mainAttachedFlag').then((res) => {
        this.mainSupplyIndicatorOptions = res
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
            externalIdentificationNo: this.queryForm.externalIdentificationNo,
            idType: this.queryForm.idType,
            idNumber: this.queryForm.idNumber,
            isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_mainAttachedFlag','dic_activationStateTable','dic_invalidFlagYN','dic_invalidReason'],//查找数据字典所需参数
			transDict : ['mainSupplyIndicator','activationFlag', 'invalidFlag','invalidReasonc'],//翻译前后key
        }
        this.config = Object.assign(this.config, this.queryForm, params)
        this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0007', this.config, (res) => {
            if (res.returnCode == '000000') {
                this.showTable = true
                this.config.loading = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.tableData = res.returnData.rows
                    this.config.total = res.returnData.totalCount
                } else {
                    this.tableData = []
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


      // 确定激活
      suerAct() {
        if (!this.curRow) {
            this.$message({
                message: '请至少选择1行',
                type: 'warning'
            })
            return
        }
        if(this.curRow.activationFlag == '1'){
            this.$message({
                message: '该媒介已激活',
                type: 'warning'
            })
            return
        }
        let params = {
            mediaUnitCode : this.curRow.mediaUnitCode,
            externalIdentificationNo : this.curRow.externalIdentificationNo,
            externalIdentificationNoOri : this.curRow.externalIdentificationNo_ori,
            invalidFlag:  this.curRow.invalidFlag,
            invalidReason:  this.curRow.invalidReason,
        }
        this.post('/nonfi/nonfinanceService/BSS.OP.01.0004', params , (res) => {
            if (res.returnCode == '000000') {
                this.$notify({
                    title: 'Success',
                    message: '激活成功',
                    type: 'success',
                    duration: 2000
                })
                this.getCustBaseInfo()
            }
        })
      },

      // 
      handleCurrRowChange(row) {
          this.curRow = row
        // console.log(row)

      },
      chooseCurrRow(row) {
        //   console.log(row)
          this.curRowRadio = row.mediaUnitCode
      }
   
    }
  }
  </script>
  
  <style>
  </style>
  
<!-- 客户产品视图 -->
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
                @current-change="handleCurrRowChange"
                @row-click="chooseCurrRow"
            >
                <el-table-column width="80">
                    <template slot-scope="scope">
                    <el-radio v-model="curRowRadio" :label="scope.row.productObjectCode">
                        <span class="el-radio__label"></span>
                    </el-radio>
                    </template>
                </el-table-column>
                <el-table-column prop="productObjectCode" label="产品代码及描述" align="center" width="220">
                    <template slot-scope="{row}">
                        {{row.productObjectCode}}
                        {{row.productDesc}}
                    </template>
                </el-table-column>
                <el-table-column prop="coBrandedNo" label="联名代码" align="center"/>
                <el-table-column prop="statusCodeDesc" label="状态" align="center" />
                <el-table-column prop="createDate" label="申请日期" align="center"  />
                <el-table-column prop="productCancelDate" label="注销日期" align="center" />
                <el-table-column prop="" label="操作" align="center" width = "220">
                    <template slot-scope="{row}">
                        <el-button size="mini" type="primary"
                            @click="handle1(row)">查看媒介</el-button>
                    </template> 
                </el-table-column>
            </el-table>
            <pagination v-show="config.total>0" :total="config.total" :page.sync="config.pageNum" :limit.sync="config.pageSize" @pagination="getList" />
            

            <div v-show="showMediaDiv">
                <div class="text_title">媒介信息</div>
                <el-table
                    v-loading = "media_config.loading"
                    :data="media_tableData"
                    class="mbtm20"
                    fit
                    highlight-current-row
                    style="width: 100%;"
                    border
                    @current-change="handleCurrRowChange2"
                    @row-click="chooseCurrRow2"
                >
                    <el-table-column width="80">
                        <template slot-scope="scope">
                        <el-radio v-model="curRowRadio2" :label="scope.row.mediaUnitCode">
                            <span class="el-radio__label"></span>
                        </el-radio>
                        </template>
                    </el-table-column>
                    <el-table-column prop="externalIdentificationNo" label="外部识别号" align="center"/>

                    <el-table-column prop="mediaUnitCode" label="媒介单元代码" align="center"/>
                    <el-table-column prop="productObjectCode" label="产品代码及描述" align="center" >
                        <template slot-scope="{row}">
                            {{row.productObjectCode}}
                            {{row.productDesc}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="mainSupplyIndicatorDesc" label="主附卡标识" align="center"  />
                    <el-table-column prop="mediaUserName" label="媒介使用者姓名" align="center" />
                    <el-table-column prop="invalidFlagDesc" label="有效标识" align="center" />

                    <el-table-column prop="" label="操作" align="center" width = "220">
                        <template slot-scope="{row}">
                            <el-button size="mini" type="primary"
                                @click="handle2(row)">详情</el-button>
                        </template> 
                    </el-table-column>
                </el-table>
                <pagination v-show="media_config.total>0" :total="media_config.total" :page.sync="media_config.pageNum" :limit.sync="media_config.pageSize" @pagination="getList2" />
                
            </div>

            <!-- 媒介信息详情 -->
            <div v-show="showMedaiInfoDiv">
                <div class="text_title">媒介详情</div>
                <media-info
                    :formObj="medaiInfoObj"
                ></media-info>
            </div>
        </div>
    </div>
  </template>
  
  <script>
  import Pagination from '@/components/Pagination'
  import MediaInfo from '@/components-ider/cstSvc/MediaInfo'

  export default {
    name: 'productMajView',
    components: {
      Pagination,
      MediaInfo
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

        // 媒介列表
        showMediaDiv: false,
        media_config: {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0
        },
        media_tableData: [],
        curRowRadio2: '',
        curRow2: {},
        // 媒介信息
        showMedaiInfoDiv: false,
        medaiInfoObj: {},
        

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
            isTrans: true,
			transParams: ['dic_proState'],
			transDict: ['statusCode'],
        }
        params = Object.assign(params , this.config, this.queryForm )
        this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0114', params, (res) => {
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
                this.baseInfoObj.idNumber = res.returnData.idNumber
                this.baseInfoObj.idType = res.returnData.idType
                this.baseInfoObj.customerName = res.returnData.customerName
                this.getList()


            }
        })
      },
        // 单选 当前行
        handleCurrRowChange(row) {
            this.curRow = row
            this.curRowRadio = row.productObjectCode
        },
        chooseCurrRow(row) {
            this.curRow = row
            this.curRowRadio = row.productObjectCode
        },
        // 查询媒介
        handle1(row) {
            console.log(row)
            this.showMediaDiv = true
            this.getList2(row)

        },
        // 媒介列表
        getList2(row) {
            this.media_config.loading = true
            let params = {
                isTrans: true,
                transParams: ['dic_mainCharacterCardTable', 'dic_invalidFlagYN'],
                transDict: ['mainSupplyIndicator', 'invalidFlag'],
            }
            params = Object.assign(params , this.media_config, this.queryForm )
            this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0007', params, (res) => {
                if (res.returnCode == '000000') {
                    this.showMediaDiv = true
                    this.showTable = true
                    this.media_config.loading = false
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.media_tableData = res.returnData.rows
                        this.media_config.total = res.returnData.totalCount
                    } else {
                        this.media_tableData = []
                        this.media_config.total = 0
                    }
                } else {
                    this.showMediaDiv = false
                    this.media_tableData = []
                    this.media_config.total = 0
                }
            })
        },
        // 单选 当前行
        handleCurrRowChange2(row) {
            this.curRow2 = row
            this.curRowRadio2 = row.mediaUnitCode
        },
        chooseCurrRow2(row) {
            this.curRow2 = row
            this.curRowRadio2 = row.mediaUnitCode
        },
        // 媒介列表 详情
        handle2(row) {
            this.showMedaiInfoDiv = true
            this.medaiInfoObj = Object.assign({}, row)
        },
    
    }
  }
  </script>
  
  <style>
  </style>
  
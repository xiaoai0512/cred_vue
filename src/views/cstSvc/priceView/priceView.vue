<!-- 客户定价视图 -->
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
            <div class="text_title">定价视图</div>
            <el-table
                v-loading = "config.loading"
                :data="tableData"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
            >
                <el-table-column prop="productObjectCode" label="定价对象" align="center">
                    <template slot-scope="{row}">
                        {{row.pricingObjectCode}}
                        {{row.pricingObjectDesc}}
                    </template>
                </el-table-column>
                <el-table-column prop="pricingObject" label="定价类型" align="center"/>
                <el-table-column prop="" label="操作" align="center">
                    <template slot-scope="{row}">
                        <el-button size="mini" type="primary"
                            @click="handle1(row)">{{row.pricingObject}}实例化详情</el-button>
                        <el-button size="mini" type="primary" v-if="row.isPricing =='1'"
                            @click="handle2(row)">
                            客户定价标签
                        </el-button>
                    </template> 
                </el-table-column>
            </el-table>
            <pagination v-show="config.total>0" :total="config.total" :page.sync="config.pageNum" :limit.sync="config.pageSize" @pagination="getList" />
            
            <!-- 客户定价列表 -->
            <div v-show="showPriceDiv">
                <div class="text_title">客户定价标签</div>
                <el-table
                    v-loading = "price_config.loading"
                    :data="price_tableData"
                    class="mbtm20"
                    fit
                    highlight-current-row
                    style="width: 100%;"
                    border
                >
                    <el-table-column prop="pricingLevelDesc" label="定价层级" align="center"/>
                    <el-table-column prop="pricingLevelCode" label="定价层级代码" align="center" />
                    <el-table-column prop="pricingObject" label="定价类型" align="center" />
                    <el-table-column prop="pricingObjectCode" label="定价对象" align="center" >
                        <template slot-scope="{row}">
                            {{row.pricingObjectCode}}
                            {{row.pricingObjectDesc}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="pricingTag" label="定价标签" align="center" />
                    <el-table-column prop="pricingDesc" label="定价标签描述" align="center"/>
                    <el-table-column prop="custTagEffectiveDate" label="标签生效日期" align="center"/>
                    <el-table-column prop="custTagExpirationDate" label="标签失效日期" align="center"/>
                    <el-table-column prop="stateDesc" label="状态" align="center"/>
                    <el-table-column prop="" label="操作" align="center" width = "220">
                        <template slot-scope="{row}">
                            <el-button size="mini" type="primary"
                                @click="prcie_handleDetail(row)">详情</el-button>
                        </template> 
                    </el-table-column>
                </el-table>
                <pagination v-show="price_config.total>0" :total="price_config.total" :page.sync="price_config.pageNum" :limit.sync="price_config.pageSize" @pagination="price_getList" />
            </div>

            

            <!-- PCD实例列表 -->
            <div v-show="showPCDDiv">
                <div class="text_title">PCD实例列表</div>
                <el-table
                    v-loading = "pcd_config.loading"
                    :data="pcd_tableData"
                    class="mbtm20"
                    fit
                    highlight-current-row
                    style="width: 100%;"
                    border
                >
                    <el-table-column prop="operationMode" label="运营模式" align="center"/>
                    <el-table-column prop="artifactNo" label="参数构件编号" align="center">
                        <template slot-scope="{row}">
                            {{row.artifactNo}}
                            {{row.artifactDesc}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="elementNo" label="元件编号及描述" align="center" >
                        <template slot-scope="{row}">
                            {{row.elementNo}}
                            {{row.elementDesc}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="instanCode1" label="应用维度1" align="center" >
                        <template slot-scope="{row}">
                            {{row.instanCode1}}
                            {{row.instanDesc1}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="mediaUserName" label="应用维度2" align="center" >
                        <template slot-scope="{row}">
                            {{row.instanCode2}}
                            {{row.instanDesc2}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="" label="操作" align="center" width = "220">
                        <template slot-scope="{row}">
                            <el-button size="mini" type="primary"
                                @click="handle11(row)">详情</el-button>
                        </template> 
                    </el-table-column>
                </el-table>
                <pagination v-show="pcd_config.total>0" :total="pcd_config.total" :page.sync="pcd_config.pageNum" :limit.sync="pcd_config.pageSize" @pagination="getList2" />
                
            </div>


            <!-- 收费项目实例列表 -->
            <div v-show="showFeeDiv">
                <div class="text_title">收费项目实例列表</div>
                <el-table
                    v-loading = "feeItem_config.loading"
                    :data="feeItem_tableData"
                    class="mbtm20"
                    fit
                    highlight-current-row
                    style="width: 100%;"
                    border
                >
                    <el-table-column prop="operationMode" label="运营模式" align="center"/>
                    <el-table-column prop="feeItemNo" label="收费项目" align="center" />
                    <el-table-column prop="instanCode1" label="费用收取维度1及描述" align="center" >
                        <template slot-scope="{row}">
                            {{row.instanCode1}}
                            {{row.instanDesc1}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="instanCode2" label="费用收取维度2及描述" align="center" >
                        <template slot-scope="{row}">
                            {{row.instanCode2}}
                            {{row.instanDesc2}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="baseFee" label="基本费用" align="center" />
                    <el-table-column prop="" label="操作" align="center" width = "220">
                        <template slot-scope="{row}">
                            <el-button size="mini" type="primary"
                                @click="handle21(row)">详情</el-button>
                        </template> 
                    </el-table-column>
                </el-table>
                <pagination v-show="feeItem_config.total>0" :total="feeItem_config.total" :page.sync="feeItem_config.pageNum" :limit.sync="feeItem_config.pageSize" @pagination="feeItem_getList" />
                
            </div>

            
            <!-- 详情 -->
            <el-dialog title="构件实例信息" :visible.sync="pcd_dialogDetail" width="65%" :close-on-click-modal="false">
                <el-form :model="pcd_tempDetail" >
                    <el-form-item class="cl_td" label="运营模式" prop="operationMode">
                        <el-select v-model="pcd_tempDetail.operationMode" class="wd200" clearable disabled>
                            <el-option
                            v-for="(item, index ) in operationModeOptions"
                            :key="index"
                            :label="item.modeName"
                            :value="item.operationMode"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="cl_td" label="参数构件编号" prop="artifactNo">
                        <el-input v-model="pcd_tempDetail.artifactNo" class="wd200" type="text" readonly/>
                    </el-form-item>
                    <el-form-item class="cl_td" label="元件编号及描述" prop="elementInfo">
                    <el-input v-model="pcd_tempDetail.elementInfo" class="wd200" type="text"  readonly/>
                    </el-form-item>
                    <el-form-item class="cl_td" label="应用维度1" prop="instanCode1">
                        <el-input v-model="pcd_tempDetail.instanCode1" class="wd200" type="text"  readonly/> 
                    </el-form-item>
                    <el-form-item class="cl_td" label="应用维度2" prop="instanCode2">
                        <el-input v-model="pcd_tempDetail.instanCode2" class="wd200" type="text"  readonly/> 
                    </el-form-item>
                    <el-form-item class="cl_td" label="应用维度3" prop="instanCode3">
                        <el-input v-model="pcd_tempDetail.instanCode3" class="wd200" type="text"  readonly/> 
                    </el-form-item>
                    <el-form-item class="cl_td" label="应用维度4" prop="instanCode4">
                        <el-input v-model="pcd_tempDetail.instanCode4" class="wd200" type="text"  readonly/> 
                    </el-form-item>
                    <el-form-item class="cl_td" label="应用维度5" prop="instanCode5">
                        <el-input v-model="pcd_tempDetail.instanCode5" class="wd200" type="text"  readonly/> 
                    </el-form-item>
                    <el-form-item class="cl_td" label="执行顺序" prop="performOrder">
                        <el-input v-model="pcd_tempDetail.performOrder" class="wd200" type="text"  readonly/> 
                    </el-form-item>

                    <div v-show="part2">
                        <div class="text_title">PCD实例</div>
                        <el-form-item class="cl_td" label="PCD编号" prop="pcdNo">
                            <el-input v-model="pcd_tempDetail.pcdNo" class="wd200" type="text" readonly />
                        </el-form-item>
                        <el-form-item class="cl_td" label="分段类型" prop="segmentType">
                            <el-select v-model="pcd_tempDetail.segmentType" class="wd200" clearable disabled>
                                <el-option
                                v-for="(item, index ) in segmentTypeOptions"
                                :key="index"
                                :label="item.detailDesc"
                                :value="item.codes"
                                />
                            </el-select>
                        </el-form-item>
                        <el-form-item class="cl_td" label="基础实例代码" prop="baseInstanCode">
                            <el-input v-model="pcd_tempDetail.baseInstanCode" class="wd200" type="text" readonly />
                        </el-form-item>
                        <el-form-item class="cl_td" label="可选实例代码" prop="optionInstanCode">
                            <el-input v-model="pcd_tempDetail.optionInstanCode" class="wd200" type="text" readonly />
                        </el-form-item>
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
                            <el-table-column prop="pcdPoint" label="取值小数值" align="center" />
                        </el-table>

                    </div>

                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="pcd_dialogDetail = false">
                        关闭
                    </el-button>
                </div>
            </el-dialog>


            <!-- 收费项目实例详情  -->
            <el-dialog title="收费项目实例详情" :visible.sync="in_dialogDetail" width="75%" :close-on-click-modal="false" >
                <pay-item-base-info ref="" 
                    :formObj="in_tempDetail"
                    :showChoseBtn="showChoseBtn"
                    :showInstanDimen="showInstanDimen"
                ></pay-item-base-info>
                <cost-matrix-info 
                    :formObj="in_tempDetail"
                    :showMethod = "showMethod"
                ></cost-matrix-info>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="in_dialogDetail = false">
                        关闭
                    </el-button>
                </div>
            </el-dialog>


            <!-- 客户定价标签信息   -->
            <el-dialog title="客户定价标签信息" :visible.sync="price_dialogDetail" width="75%">
                <price-info
                    :formObj="priceInfoObj"
                ></price-info>
                <div class="text_title">定价标签参数信息</div>
                <price-label-info
                    :formObj="priceInfoObj"
                ></price-label-info>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="price_dialogDetail = false">
                        关闭
                    </el-button>
                </div>
            </el-dialog>
        </div>
    </div>
  </template>
  
  <script>
  import Pagination from '@/components/Pagination';
  import PayItemBaseInfo from "@/components-ider/operate/PayItemBaseInfo"; // 收费项目实例信息
  import CostMatrixInfo from "@/components-ider/operate/CostMatrixInfo"; // 费用矩阵信息
  import PriceLabelInfo from "@/components-ider/cstSvc/PriceLabelInfo"; // 定价标签信息
  import PriceInfo from "@/components-ider/cstSvc/PriceInfo"; // 定价信息组件


  export default {
    name: 'priceView',
    components: {
      Pagination,
      PayItemBaseInfo, // 收费项目实例信息
      CostMatrixInfo, // 费用矩阵信息
      PriceLabelInfo, // 定价标签查询
      PriceInfo , // 定价信息组件
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
        segmentTypeOptions: [],
        operationModeOptions: [],
        // 基本信息
        baseInfoObj: {},

         // 客户定价标签
        showPriceDiv: false,
        price_config: {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0
        },
        price_tableData: [],
        // pcd列表
        showPCDDiv: false,
        pcd_config: {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0
        },
        pcd_tableData: [],
        // 收费项目实例列表
        showFeeDiv: false,
        feeItem_config: {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0
        },
        feeItem_tableData: [],
        // 收费项目实例详情
        in_dialogDetail: false,
        in_tempDetail : {},
        showChoseBtn: false,
        showInstanDimen: true,
        showMethod: true,
        // pcd实例详情
        pcd_dialogDetail: false,
        pcd_tempDetail : {},
        pcdList: [],
        part2: false,
        // 客户定价标签信息 弹窗
        price_dialogDetail: false,
        priceInfoObj: {},
       
        
        

      }
    },
    created() {
  
    },
    mounted() {
        // 运营模式 
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0006").then(res => {
            this.operationModeOptions = res
        })
      this.getSelectDict('dic_certificateType').then((res) => {
        this.idTypeList = res
      })
      // 主附标识
        this.getSelectDict('dic_mainAttachedFlag').then((res) => {
        this.mainSupplyIndicatorOptions = res
        })
        // 分段类型
        this.getSelectDict('dic_segmentationType').then((res) => {
            this.segmentTypeOptions = res
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
      getList(obj) {
        let params1 = {
            queryFlag: '1'
        }
        params1 = Object.assign(params1, this.queryForm)
        this.post('/nonfi/nonfinanceService/BSS.IQ.01.0096', params1, (res) => {
            if (res.returnCode == '000000') {
                let pricingLevelCodeList = []
                if (res.returnData && res.returnData && res.returnData.length > 0 ) {
                    pricingLevelCodeList =  res.returnData
                    console.log(pricingLevelCodeList)
                } else {
                    pricingLevelCodeList = []
                }
                let params = {
                    flag: 1,
                    pricingLevelCodeList: pricingLevelCodeList,
                    operationMode: this.baseInfoObj.operationMode
                }
                this.config.loading = true
                params = Object.assign(params , this.config, this.queryForm )
                this.getTableList('/beta/betaService/COS.IQ.02.0067', params, (res) => {
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
                this.baseInfoObj = res.returnData
                this.getList(this.baseInfoObj)
            }
        })
      },
        // 查询媒介
        handle1(row) {
            if (row.pricingObject == 'PCD') {
                this.showPCDDiv = true
                this.getList2(row)
            } else if (row.pricingObject == 'FIT') {
                this.showFeeDiv = true
                this.feeItem_getList(row)
            }
        },
        // pcd列表
        getList2(row) {
            this.pcd_config.loading = true
            let params = {
                isTrans: true,
                transParams: ['dic_mainCharacterCardTable', 'dic_invalidFlagYN'],
                transDict: ['mainSupplyIndicator', 'invalidFlag'],
            }
            params = Object.assign(params , this.pcd_config, this.queryForm )
            params = Object.assign(row , params )
            this.getTableList('/beta/betaService/COS.IQ.02.0067', params, (res) => {
                if (res.returnCode == '000000') {
                    this.showPCDDiv = true
                    this.showFeeDiv = false
                    this.showTable = true
                    this.pcd_config.loading = false
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.pcd_tableData = res.returnData.rows
                        this.pcd_config.total = res.returnData.totalCount
                    } else {
                        this.pcd_tableData = []
                        this.pcd_config.total = 0
                    }
                } else {
                    this.showPCDDiv = false
                    this.showFeeDiv = false
                    this.pcd_tableData = []
                    this.pcd_config.total = 0
                }
            })
        },
        // 收费项目实例列表
        feeItem_getList(row) {
            this.feeItem_config.loading = true
            let params = Object.assign({} , this.feeItem_config, this.queryForm )
            params = Object.assign(row , params )
            this.getTableList('/beta/betaService/COS.IQ.02.0067', params, (res) => {
                if (res.returnCode == '000000') {
                    this.showPCDDiv = false
                    this.showFeeDiv = true
                    this.showTable = true
                    this.feeItem_config.loading = false
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.feeItem_tableData = res.returnData.rows
                        this.feeItem_config.total = res.returnData.totalCount
                    } else {
                        this.feeItem_tableData = []
                        this.feeItem_config.total = 0
                    }
                } else {
                    this.showPCDDiv = false
                    this.showFeeDiv = false
                    this.feeItem_tableData = []
                    this.feeItem_config.total = 0
                }
            })
        },
        // 客户定价列表 详情
        handle2(row) {
            this.showPriceDiv = true
            this.price_getList(row)
        },
        // PCD实例列表 详情 按钮 
        handle11(row) {
            // console.log(row)
            this.pcd_dialogDetail = true
            this.pcd_tempDetail = Object.assign({}, row) 
            this.pcd_tempDetail.elementInfo = this.pcd_tempDetail.elementNo + this.pcd_tempDetail.elementDesc
            this.getIsPcd(row)
        },
        getIsPcd(row) {
            let obj = {
                elementNo: row.elementNo
            }
            this.post('/beta/betaService/COS.IQ.02.0010', obj, (res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        this.part2 = true
                        this.getPcsIntance(row)
                    } else {
                        this.part2 = false
                    }
                }
            })
        },
        getPcsIntance(row) {
        let obj = {
            operationMode: row.operationMode,
            pcdNo: row.elementNo.substring(0,8),
            instanCode1: row.instanCode1,
            instanCode2: row.instanCode2,
            instanCode3: row.instanCode3,
            instanCode4: row.instanCode4,
            instanCode5: row.instanCode5,
            addPcdFlag: '2'
        }
        this.post('/beta/betaService/COS.IQ.02.0016', obj, (res) => {
            if (res.returnCode == '000000') {
                if (res.returnData.rows && res.returnData.rows.length > 0) {
                    this.pcdList = res.returnData.rows
                }   
            }
        })
    },
         // 收费项目实例列表 详情 按钮 
        handle21(row) {
            console.log(row)
            this.in_dialogDetail = true
            this.in_tempDetail = Object.assign({}, row)
        },

        // 客户定价标签列表
        price_getList(row) {
            this.price_config.loading = true
            let params = {
                isTrans: true,
                transParams: ['dic_pricingLevel', 'dic_specialEventState'],
                transDict: ['pricingLevel', 'state'],
                idType : this.queryForm.idType,
                idNumber : this.queryForm.idNumber,
                externalIdentificationNo : this.queryForm.externalIdentificationNo,
            }
            params = Object.assign(params, this.price_config)
            params = Object.assign(row , params )
            this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0096', params, (res) => {
                if (res.returnCode == '000000') {
                    this.showTable = true
                    this.showPriceDiv = true
                    this.showPCDDiv = false
                    this.showFeeDiv = false
                    this.price_config.loading = false
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.price_tableData = res.returnData.rows
                        this.price_config.total = res.returnData.totalCount
                    } else {
                        this.price_tableData = []
                        this.price_config.total = 0
                    }
                } else {
                    this.showPCDDiv = false
                    this.showFeeDiv = false
                    this.showPriceDiv = false
                    this.price_tableData = []
                    this.price_config.total = 0
                }
            })
        },
        // 客户定价标签列表 详情 按钮
        prcie_handleDetail(row) {
            this.price_dialogDetail = true
            this.priceInfoObj = Object.assign({}, row)
            // console.log(row)
        },

        
        
    
    }
  }
  </script>
  
  <style>
  </style>
  
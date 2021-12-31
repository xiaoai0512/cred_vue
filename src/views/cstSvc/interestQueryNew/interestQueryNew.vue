<template>
  <div class="allContent">
    <el-form ref="transForm" :model="queryForm">
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
      <!-- <div class="cl_td clearboth"></div> -->
      <div class="cl_tr text_center">
        <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()">查询</el-button>
        <el-button size="medium" icon="el-icon-refresh" type="primary" @click="reset()">重置</el-button>
      </div>
    </el-form>

    <div v-if="isShow" class="text_title">结息交易列表</div>
    <!-- 结息交易列表 -->
    <el-table 
    v-if="isShow" 
    v-loading="config.loading" 
    :data="list" 
    border 
    fit 
    highlight-current-row 
    style="width: 100%;"
    row-key="id"
    lazy
    :load="loadTable"
    :tree-props="{children: 'children', hasChildren: 'haveChild'}"
    >
      <el-table-column align="center" label="账户号" prop="accountId" width="250" />
      <el-table-column align="center" label="产品对象" prop="productObjectCode" width="120"/>
      <el-table-column align="center" label="业务类型" prop="businessTypeCode" width="120"/>
      <el-table-column align="center" label="入账币种" prop="transDate" width="100"/>
      <el-table-column align="center" label="入账金额" prop="postingAmount" >
        <template slot-scope="{row}">
                {{row.postingAmount | money}}
        </template>
      </el-table-column>
      <el-table-column width="100" align="center" label="入账日期" prop="occurrDate" />
      <el-table-column width="200" align="center" label="交易描述" prop="transDesc" />
      <el-table-column width="200" align="center" label="操作" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button icon="" type="primary" size="mini" @click="getDetailList(row)">
            结息明细查询
          </el-button>
          <el-button icon="el-icon-more" type="primary" size="mini" @click="handleDetail(row,$index)">
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-if="isShow"
      v-show="config.total>0"
      :total="config.total"
      :page.sync="config.pageNum"
      :limit.sync="config.pageSize"
      @pagination="getList"
    />

    <div v-if="showDetail" class="text_title">结息明细</div>
    <!-- 结息明细 -->
    <el-table v-if="showDetail" :data="detailList" border fit highlight-current-row style="width: 100%;">
      <el-table-column align="center" label="周期号" prop="cycleNumber" />
      <el-table-column width="150" align="center" label="计息余额" prop="balanceObjectDesc" />
      <el-table-column width="100" align="center" label="利率" prop="annualInterestRate" />
      <el-table-column width="100" align="center" label="核算状态" prop="accountingStatusCodeDesc" />
      <el-table-column width="200" align="center" label="本结息周期利息累计金额" prop="currInterestAmount" />
      <el-table-column width="100" align="center" label="原结息金额" prop="oriInterestAmount" />
      <el-table-column width="200" align="center" label="上一周期利息累计转入金额" prop="lastInterestAmount" />
      <el-table-column width="200" align="center" label="结息开始日期" prop="billingStartDate" />
      <el-table-column width="200" align="center" label="结息结束日期 " prop="billingEndDate" />
      <el-table-column width="200" label="操作" align="center" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button icon="" type="primary" size="mini" @click="getTransUnitDetail(row)">
            结息过程
          </el-button>
          <el-button icon="el-icon-more" type="primary" size="mini" @click="handleDetail2(row,$index)">
            详情
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-if="showDetail"
      v-show="config2.total>0"
      :total="config2.total"
      :page.sync="config2.pageNum"
      :limit.sync="config2.pageSize"
      @pagination="getDetailList"
    />  

    <!-- 交易单元计息明细 @expand-change="rowExpand"-->
    <div v-if="showTransUint" class="text_title">交易单元计息明细</div>
    <el-table
      v-if="showTransUint"
      v-loading="config3.loading"
      class="mtop20"
      :data="transUnitList"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <!-- 二级表格 @expand-change="22"-->
      <el-table-column type="expand" prop="" width="100">
        <template slot-scope="scope">
          <el-table :data="scope.row.occureAmountList" border >
            <!-- 三级表格 -->
            <el-table-column type="expand" prop="" width="100">
              <template slot-scope="scope">
                <el-table :data="scope.row.list" border>
                  <el-table-column label="本金金额" prop="pricipal" />
                  <el-table-column label="利率" prop="rate" />
                  <el-table-column label="DAY-FACTOR" prop="dayFactory" />
                  <el-table-column label="计息开始日期" prop="startDate" />
                  <el-table-column label="计息结束日期" prop="endDate" />
                  <el-table-column label="计息天数" prop="interestDays" />
                  <el-table-column label="利息金额" prop="interest" />
                </el-table>
              </template>
            </el-table-column>
            <el-table-column label="计息节点金额" prop="pricipal" />
            <el-table-column label="节点类型" prop="nodeTyp" />
            <el-table-column label="利息金额" prop="interest" />
            <el-table-column label="余额单元代码" prop="balanceUnitCode" />
            <el-table-column label="操作" prop="venderSku" width="300">
                <template slot-scope="{row}">
                    <el-button type="primary" size="mini" @click="handleFse(row)">发生额详情</el-button>
                    <el-button type="primary" size="mini" @click="handleGljy(row)">关联交易</el-button>
                </template>
            </el-table-column>
          </el-table>
        </template>
      </el-table-column>
      <el-table-column prop="pricipal" label="交易单元起始金额" align="center" width="190" />
      <el-table-column prop="startDate" label="计息开始日期" />
      <el-table-column prop="endDate" label="计息结束日期" min-width="150" />
      <el-table-column prop="interestDays" label="计息天数" width="200" />
      <el-table-column prop="interest" label="利息金额" width="150" />
    </el-table>
    <!-- <pagination
      v-if="showTransUint"
      v-show="config3.total>0"
      :total="config3.total"
      :page.sync="config3.pageNum"
      :limit.sync="config3.pageSize"
      @pagination="getTransUnitDetail"
    /> -->

      <!-- 交易信息弹窗 -->
      <el-dialog title="交易信息" :visible.sync="transInfo_dialog"  width="75%">
        <trans-info
            :formObj="transInfoObj"
            :showBtn="transInfo_showBtn"
        ></trans-info>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="transInfo_dialog = false">
                关闭
            </el-button>
        </div>
    </el-dialog>

    <!-- 结息明细 详情 弹窗 -->
    <el-dialog title="结息明细" :visible.sync="interestDetail_dialog"  width="75%">
        <interest-detail
            :formObj="interestDetailObj"
        ></interest-detail>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="interestDetail_dialog = false">
                关闭
            </el-button>
        </div>
    </el-dialog>

    <!-- 发生额详情 弹窗 -->
    <el-dialog title="发生额详情" :visible.sync="occurAmount_dialog"  width="75%">
        <occur-amount-detail
            :formObj="occurAmountObj"
        ></occur-amount-detail>

        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="occurAmount_dialog = false">
                关闭
            </el-button>
        </div>
    </el-dialog>

    <!-- 关联交易 弹窗 -->
    <el-dialog title="关联交易" :visible.sync="relatedTrans_dialog"  width="75%">
        <el-table
            v-loading = "relatedTrans_config.loading"
            :data="relatedTrans_tableData"
            class="mbtm20"
            fit
            highlight-current-row
            style="width: 100%;"
            border
        >
            <el-table-column prop="accountId" label="账户号" align="center" width="210"/>
            <el-table-column prop="transDate" label="交易日期" align="center"  />
            <el-table-column prop="transAmount" label="交易金额" align="center" />
            <el-table-column prop="transCurrCde" label="入账币种" align="center" />
            <el-table-column prop="occurrDate" label="入账日期" align="center"  />
            <el-table-column prop="postingAmount" label="入账金额" align="center" />
            <el-table-column prop="transDesc" label="交易描述" align="center" />
            <el-table-column prop="" label="操作" align="center">
                <template slot-scope="{row}">
                    <el-button size="mini" type="primary" @click="handleDetail(row)">详情</el-button>
                </template> 
            </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="relatedTrans_dialog = false">
                关闭
            </el-button>
        </div>
    </el-dialog>

  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
import TransInfo from '@/components-ider/cstSvc/TransInfo'
import InterestDetail from '@/components-ider/cstSvc/InterestDetail'
import OccurAmountDetail from '@/components-ider/cstSvc/OccurAmountDetail'

export default {
  name: 'InterestQueryNew',
  components: {
    Pagination,
    TransInfo,
    InterestDetail, // 结息明细详情
    OccurAmountDetail, // 发生额详情
  },
  data() {
    return {
      listLoading: true,
      list: null, // 结息交易
      detailList: null, // 结息明细
      transUnitList: null, // 交易单元计息明细
    //   total: 0,
    //   detailTotal: 0,
    //   uintTotal: 0,
      queryForm: {
        idType: '',
        idNumber: '',
        externalIdentificationNo: ''
      },
      config: {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0
      },
      config2: {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0
      },
      config3: {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0
      },
      idTypeList: [],
      ecommTransStatusOptions: [],
        ecommInstallmentPeriodOptions: [],
        currencyCodeOptions: [],
        ecommFeeCollectTypeOptions: [], // 费用收取方式

      isShow: false, // 结息交易列表
      showDetail: false, // 结息明细
      showTransUint: false, // 交易单元计息明细 三级表格
      interestObj: { // 结息交易表对象
        pageNum: 1,
        pageSize: 10
      },
      detailObj: { // 结息交易表对象
        pageNum: 1,
        pageSize: 10
      },
      transUintObj: { // 结息交易表对象
        pageNum: 1,
        pageSize: 10
      },

      // 交易信息
      transInfo_dialog:false,
      transInfoObj: {},
      transInfo_showBtn: false,
      //结息明细 详情 弹窗
      interestDetail_dialog: false,
      interestDetailObj: {},
      // 发生额详情 弹窗
      occurAmount_dialog: false,
        occurAmountObj: {},
        // 关联交易
        relatedTrans_dialog: false,
        relatedTrans_config: {
                loading: false,
                pageNum: 1,
                pageSize: 10,
                total: 0
            },
        relatedTrans_tableData: [],

    }
  },
  created() {

  },
  mounted() {
    this.getSelectDict('dic_certificateType').then((res) => {
      this.idTypeList = res
    })
    // 交易状态
    this.getSelectDict('dic_ecommTransStatus').then((res) => {
        this.ecommTransStatusOptions = res
    })
    // 分期期数
    this.getSelectDict('dic_stageTerm').then((res) => {
        this.ecommInstallmentPeriodOptions = res
    })
     // 币种
     this.getSelectDict('dic_curreny').then((res) => {
        this.currencyCodeOptions = res
    })

     // 费用收取方式
     this.getSelectDict('dic_ecommFeeCollectType').then((res) => {
        this.ecommFeeCollectTypeOptions = res
    })
  },
  methods: {
    init() {
      this.queryForm = {
        idType: '',
        idNumber: '',
        externalIdentificationNo: '',
        pageNum: 1,
        pageSize: 10
      }
      this.isShow = false // 结息交易列表
      this.showDetail = false // 结息明细
      this.showTransUint = false // 交易单元计息明细 三级表格
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
            this.getList()
          }
        } else if (this.queryForm.idNumber) {
          if (!this.queryForm.idType) {
            this.$message({
              message: '请输入证件类型',
              type: 'warning'
            })
          } else {
            this.getList()
          }
        } else {
          this.getList()
        }
      }
    },
    // 查询列表 结息交易
    getList() {
      this.config.loading = true
      const obj = {
        pageFlag: 'mainPage',
        queryType: '7'
      }
      this.config = Object.assign(this.config, this.queryForm, obj)
      this.getTableList('/nonfi/nonfinanceService/BSS.IQ.03.0013', this.config, (res) => {
        if (res.returnCode == '000000') {
            this.config.loading = false
            this.list = res.returnData.rows
            this.config.total = res.returnData.totalCount
            this.isShow = true // 结息交易列表
            this.showDetail = false // 结息明细
            this.showTransUint = false // 交易单元计息明细 三级表格
        } else {
            this.list = []
        }
      })
    },
    // 查询子账户 懒加载
    loadTable(tree, treeNode, resolve) {
        // console.log(tree)
        // console.log(treeNode)
        // console.log(resolve)
        setTimeout(() => {
            let params1 = {
                accFlag : "mainAcc",
                globalSerialNumbr : tree.globalSerialNumbr,
                customerNo : tree.customerNo,
                currencyCode : tree.currencyCode,
                queryType : '7',//结息查询主子账户标识
            }
            this.config = Object.assign(this.config , this.queryForm, params1)
            let childList = []
            this.getTableList('/nonfi/nonfinanceService/BSS.IQ.03.0013', this.config ,(res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        childList = res.returnData.rows
                    } else {
                        childList = []
                    }
                    resolve(childList)
                }
            })
        }, 1000)
    },
    // 查询列表 结息明细表
    getDetailList(row) {
        this.config2.loading = true
      const params = {
        flag: 1,
        accountId: row.accountId,
        balanceObjectCode: row.balanceObjectCode,
        currencyCode: row.currencyCode,
        balanceUnitCode: row.entityKey,
        cycleNumber: row.cycleNumber,
      }
      this.config2 = Object.assign(this.config2,  this.queryForm , params)
      this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0060', this.config2, (res) => {
          if (res.returnCode == '000000') {
            this.isShow = true // 结息交易列表
            this.showDetail = true // 结息明细
            this.showTransUint = false // 交易单元计息明细 三级表格
            this.config2.loading = false
            this.detailList = res.returnData.rows
            this.config2.total = res.returnData.totalCount
          } else {
            this.detailList = []
          }
      })
    },
    //  结息交易列表  详情
    handleDetail(row) {
        this.transInfo_dialog = true
        if ( row.transState) {
            this.ecommTransStatusOptions.forEach(item => {
                if (row.transState == item.codes) {
                    row.transStateDesc = item.detailDesc
                }
            })
        }
        if (row.businessTypeCode) {
            row.businessTypeCodeConcat = row.businessTypeCode+ row.businessDesc
        }
        if (row.balanceObjectCode) {
            row.balanceObjectCodeConcat = row.balanceObjectCode+ row.objectDesc
        }
        this.transInfoObj = row
    },
    // 结息明细 详情
    handleDetail2(row) {
        this.interestDetail_dialog = true
        this.interestDetailObj = row
    },
    // 查询列表 交易单元计息明细
    getTransUnitDetail(row) {
        this.config3.loading = true
      let params = {
        interestStartDate: row.billingStartDate
      }
      this.config3 = Object.assign(this.config3, this.queryForm, params, row)
      this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0080', this.config3, (res) => {
        if (res.returnCode == '000000') {
            this.config3.loading = false
            this.transUnitList = res.returnData.rows
            // this.config3.total = res.returnData.totalCount
            this.isShow = true // 结息交易列表
            this.showDetail = true // 结息明细
            this.showTransUint = true // 交易单元计息明细 三级表格
        } else {
            this.transUnitList = []
        }
      })
    },

    // 发生额详情
    handleFse(row) {
        console.log('发生额详情')
        this.occurAmount_dialog =true
        let params = Object(row, this.queryForm)
        this.post('/nonfi/nonfinanceService/BSS.IQ.01.0050', params, (res) => {
            if (res.returnCode == '000000') {
                this.occurAmountObj = res.returnData.rows[0]
            }
        })
    },
    // 关联交易
    handleGljy(row) {
        console.log('关联交易')
        this.relatedTrans_dialog = true
        this.getRelatedTransList(row)
    },
    getRelatedTransList(row) {
        this.relatedTrans_config.loading = true
        let params = {
            balanceUnitCode: row.balanceUnitCode, // 余额单元代码
            interestStartDate: row.interestStartDate, // 起息日期 yyyy-MM-dd
            nodeTyp: row.nodeTyp, // 节点类别 DR-借方节点 CR-贷方节点 PY-还款节点 NI-NETIN节点RV-还款还原节点NO-NETOUT节点
            serialNumber : row.serialNo 
        }
        this.relatedTrans_config = Object.assign(this.relatedTrans_config, params, this.queryForm)
        this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0090', this.relatedTrans_config ,(res) => {
            if (res.returnCode == '000000') {
                this.relatedTrans_config.loading = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.relatedTrans_tableData = res.returnData.rows
                    this.relatedTrans_config.total = res.returnData.totalCount
                } else {
                    this.relatedTrans_tableData = []
                }
            }
        })
    },

  }
}
</script>

<style>
</style>

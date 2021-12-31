<!-- ：客户账户视图 -->
<template>
  <div class="allContent">
    <el-form :model="queryForm">
      <el-form-item class="cl_td" label="证件类型" prop="idType">
        <el-select v-model="queryForm.idType" class="wd200">
          <el-option
            v-for="(item, index) in idTypeList"
            :key="index"
            :label="item.detailDesc"
            :value="item.codes"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="cl_td" label="证件号码" prop="idNumber">
        <el-input v-model="queryForm.idNumber" class="wd200" type="text" />
      </el-form-item>
      <el-form-item
        class="cl_td"
        label="外部识别号"
        prop="externalIdentificationNo"
      >
        <el-input
          v-model="queryForm.externalIdentificationNo"
          class="wd200"
          type="text"
        />
      </el-form-item>
      <div class="cl_tr text_center">
        <el-button
          size="medium"
          icon="el-icon-search"
          type="primary"
          @click="handleSearch()"
          >查询</el-button
        >
        <el-button
          size="medium"
          icon="el-icon-refresh"
          type="primary"
          @click="reset()"
          >重置</el-button
        >
      </div>
    </el-form>

    <div v-if="showTable">
      <div class="text_title">客户基本信息</div>
      <el-form
        :model="baseInfoObj"
        :inline="true"
        class="demo-form-inline"
        style="padding-left: 20px"
      >
        <el-form-item class="mrgt20" label="证件类型" prop="idType">
          <el-select v-model="baseInfoObj.idType" class="wd200" disabled>
            <el-option
              v-for="(item, index) in idTypeList"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="mrgt20" label="证件号码" prop="idNumber">
          <el-input
            v-model="baseInfoObj.idNumber"
            class="wd200"
            type="text"
            readonly
          />
        </el-form-item>
        <el-form-item class="" label="客户姓名" prop="customerName">
          <el-input
            v-model="baseInfoObj.customerName"
            class="wd200"
            type="text"
            readonly
          />
        </el-form-item>
      </el-form>
      <div class="text_title">循环账户信息表</div>
      <el-table
        v-loading="config.loading"
        :data="tableData"
        class="mbtm20"
        fit
        highlight-current-row
        style="width: 100%"
        border
        row-key="id"
        lazy
        :load="loadTable"
        :tree-props="{ children: 'children', hasChildren: 'haveChild' }"
      >
        <el-table-column
          prop="accountId"
          label="账户代码"
          align="center"
          width="230"
        />
        <el-table-column prop="currencyDesc" label="币种" align="center" />
        <el-table-column
          prop=""
          label="业务项目/子账户类型"
          align="center"
          width="220"
        >
          <template slot-scope="{ row }">
            <span v-if="row.haveChild">
              {{ row.businessProgramNo }}
              {{ row.programDesc }}
            </span>
            <span v-else>
              {{ row.subAccIdentifyDesc }}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop=""
          label="业务类型/类型代码及描述"
          align="center"
          width="220"
        >
          <template slot-scope="{ row }">
            <span v-if="row.haveChild">
              <span v-if="row.businessTypeCode || row.businessDesc">
                {{ row.businessTypeCode }}
                {{ row.businessDesc }}
              </span>
              <span v-else> '' </span>
            </span>
            <span v-else>
              <span v-if="row.subAccIdentify == 'Q'">
                {{ row.transIdentifiNo }}
              </span>
              <span v-else-if="row.subAccIdentify == 'L'">
                <span v-if="row.fundNum">
                  {{ row.fundNum }}
                </span>
                <span v-else>''</span>
              </span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="productObjectCode"
          label="产品对象代码"
          align="center"
          width="200"
        >
          <template slot-scope="{ row }">
            {{ row.productObjectCode }}
            {{ row.productDesc }}
          </template>
        </el-table-column>
        <el-table-column
          prop="accountOrganFormDesc"
          label="账户组织形式"
          align="center"
        />
        <el-table-column
          prop="businessDebitCreditCodeDesc"
          label="账户性质"
          align="center"
        />
        <el-table-column prop="statusCodeDesc" label="状态码" align="center" />
        <el-table-column
          prop="totalBalance"
          label="当前总余额"
          align="center"
        />
        <el-table-column label="操作" align="center" width="150">
          <template slot-scope="{ row }">
            <el-button size="mini" type="primary" @click="accFunInfoBtn(row)"
              >账户金融信息</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="config.total > 0"
        :total="config.total"
        :page.sync="config.pageNum"
        :limit.sync="config.pageSize"
        @pagination="getList"
      />

      <div class="text_title">溢缴款账户信息表</div>
      <v-table
        :tableData="tableData2"
        :tableLabel="tableLabel2"
        :config="config2"
        :btns="btns2"
        :btnWidth="200"
        @event1="handleDetail2"
        @event2="transferOut"
        @changePage="getList2"
      ></v-table>

      <div class="text_title">交易账户信息表</div>
      <el-table
        v-loading="config3.loading"
        :data="tableData3"
        class="mbtm20"
        fit
        highlight-current-row
        style="width: 100%"
        border
        row-key="id"
        lazy
        :load="loadTable3"
        :tree-props="{ children: 'children', hasChildren: 'haveChild' }"
      >
        <el-table-column
          prop="loanTypeDesc"
          label="信贷交易类型"
          align="center"
          width="100"
        />
        <el-table-column
          prop="accountId"
          label="账户代码"
          align="center"
          width="230"
        />
        <el-table-column prop="loanAmount" label="信贷金额" align="center" />
        <el-table-column
          prop="remainPrincipalAmount"
          label="未抛金额"
          align="center"
        />
        <el-table-column prop="currencyCode" label="币种" align="center" />
        <el-table-column prop="loanTerm" label="贷款期数" align="center" />
        <el-table-column prop="startIntDate" label="起始日" align="center" />
        <el-table-column prop="statusDesc" label="贷款状态" align="center" />
        <el-table-column label="操作" align="center" width="220">
          <template slot-scope="{ row }">
            <el-button size="mini" type="primary" @click="handleDetail3(row)"
              >查询</el-button
            >
            <el-button size="mini" type="primary" @click="accFunInfoBtn(row)"
              >账户金融信息</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="config3.total > 0"
        :total="config3.total"
        :page.sync="config3.pageNum"
        :limit.sync="config3.pageSize"
        @pagination="getList3"
      />

      <div class="text_title">争议账户信息表</div>
      <v-table
        :tableData="tableData4"
        :tableLabel="tableLabel4"
        :config="config4"
        :btns="btns4"
        :btnWidth="100"
        @event1="handleDetail4"
        @changePage="getList4"
      ></v-table>
    </div>

    <!-- 账户金融信息 弹窗 -->
    <el-dialog
      title="账户金融信息"
      :visible.sync="accFunInfo_dialog"
      width="85%"
    >
      <acc-fin-info :formObj="accFunInfoObj"></acc-fin-info>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="accFunInfo_dialog = false">
          关闭
        </el-button>
      </div>
    </el-dialog>

    <!-- 溢缴款账户信息 弹窗 -->
    <el-dialog
      title="溢缴款账户信息"
      :visible.sync="overPayAccInfo_dialog"
      width="65%"
    >
      <overpay-acc-info :formObj="overPayAccInfoObj"></overpay-acc-info>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="overPayAccInfo_dialog = false">
          关闭
        </el-button>
      </div>
    </el-dialog>

    <!-- 溢缴款账户信息 转出 弹窗 -->
    <el-dialog
      title="溢缴款账户信息"
      :visible.sync="transferOut_dialog"
      width="65%"
    >
      <el-form
        ref="transferOutRef"
        :model="transferOutObj"
        :rules="transferOutRules"
      >
        <el-form-item
          class="cl_td"
          label="转出金额"
          prop="transAmount"
          :rules="[
            { required: true, message: '转出金额不能为空', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="transferOutObj.transAmount"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td"
          label="转出卡号"
          prop="externalIdentificationNoT"
          :rules="[
            { required: true, message: '转出卡号不能为空', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="transferOutObj.externalIdentificationNoT"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td"
          label="姓名"
          prop="mediaUserName"
          :rules="[
            { required: true, message: '姓名不能为空', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="transferOutObj.mediaUserName"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td"
          label="交易日期"
          prop="transDate"
          :rules="[
            { required: true, message: '交易日期不能为空', trigger: 'blur' },
          ]"
        >
          <el-date-picker
            v-model="transferOutObj.transDate"
            class="wd200"
            type="date"
            placeholder="选择交易日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            :clearable="true"
          />
        </el-form-item>
        <el-form-item class="cl_td" label="银行" prop="bank">
          <el-input v-model="transferOutObj.bank" class="wd200" type="text" />
        </el-form-item>
        <el-form-item class="cl_td" label="转出说明" prop="rollOutInstruction">
          <el-input
            v-model="transferOutObj.rollOutInstruction"
            class="wd200"
            type="text"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sureTransferOut"> 确定 </el-button>
        <el-button @click="transferOut_dialog = false"> 取消 </el-button>
      </div>
    </el-dialog>

    <!-- 交易账户信息表 详情 弹窗 -->
    <el-dialog
      title="信贷交易账户明细"
      :visible.sync="creditTransAccInfo_dialog"
      width="75%"
    >
      <credit-trans-acc-info
        :formObj="creditTransAccInfoObj"
      ></credit-trans-acc-info>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="creditTransAccInfo_dialog = false">
          关闭
        </el-button>
      </div>
    </el-dialog>

    <!-- 争议账户信息表 详情 弹窗 -->
    <el-dialog
      title="争议账户明细"
      :visible.sync="disputeAccInfo_dialog"
      width="75%"
    >
      <dispute-acc-info :formObj="disputeAccInfoObj"></dispute-acc-info>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sureOrigTransInfo">
          原交易信息
        </el-button>
        <el-button type="primary" @click="sureDisReleaseCst">
          争议释放有利于客户
        </el-button>
        <el-button type="primary" @click="sureDisReleaseBank">
          争议释放有利于银行
        </el-button>
        <el-button type="primary" @click="sureTransApplyOrRefusManage">
          调单申请/拒付管理
        </el-button>
        <el-button @click="disputeAccInfo_dialog = false"> 关闭 </el-button>
      </div>
    </el-dialog>

    <!-- 争议账户信息  原交易信息详情 弹窗 -->
    <el-dialog
      title="原交易信息详情"
      :visible.sync="origTransInfo_dialog"
      width="75%"
    >
      <trans-info
        :formObj="origTransInfoObj"
        :showBtn="origTransInfo_showBtn"
        ></trans-info>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="origTransInfo_dialog = false"> 关闭 </el-button>
      </div>
    </el-dialog>


    <!-- //争议账户 AppVISA弹窗 -->
    <el-dialog
      title="visa信息"
      :visible.sync="appVisa_dialog"
      width="75%"
    >
      <visa-info
        :formObj="appVisaFormInf"
        ></visa-info>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="appVisa_dialog = false"> 关闭 </el-button>
      </div>
    </el-dialog>

    <!-- //争议账户 AppMCC 弹窗 -->
    <el-dialog
      title="MCC信息"
      :visible.sync="appMcc_dialog"
      width="75%"
    >
      <mcc-info
        :formObj="appMCFormInf"
        ></mcc-info>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="appMcc_dialog = false"> 关闭 </el-button>
      </div>
    </el-dialog>


  </div>
</template>
  
  <script>
import Pagination from "@/components/Pagination";
import VTable from "@/components-ider/VTable";
import AccFinInfo from "@/components-ider/cstSvc/AccFinInfo";
import OverpayAccInfo from "@/components-ider/cstSvc/OverpayAccInfo";
import CreditTransAccInfo from "@/components-ider/cstSvc/CreditTransAccInfo";
import DisputeAccInfo from "@/components-ider/cstSvc/DisputeAccInfo";
import TransInfo from '@/components-ider/cstSvc/TransInfo'
import VisaInfo from '@/components-ider/cstSvc/VisaInfo'
import MccInfo from '@/components-ider/cstSvc/MccInfo'



export default {
  name: "CstAccountList",
  components: {
    Pagination,
    VTable,
    AccFinInfo, // 账户金融信息组件
    OverpayAccInfo, // 溢缴款账户信息信息组件
    CreditTransAccInfo, // 信贷交易巡航护信息 = 交易账户信息表
    DisputeAccInfo, // 争议账户信息
    TransInfo, // 交易信息组件
    VisaInfo, // VisaInfo
    MccInfo, // mcc
  },
  data() {
    return {
      systemUnitNo: "",
      operationMode: "",
      cutInfoLoading: false,
      queryForm: {
        idType: "",
        idNumber: "",
        externalIdentificationNo: "",
      },
      showTable: false,
      config: {
        loading: false,
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      tableData: [],
      curRowRadio: "",
      curRow: {},
      // 溢缴款账户信息表
      config2: {
        loading: false,
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      tableData2: [],
      tableLabel2: [
        {
          label: "账户代码",
          prop: "accountId",
          width: "220",
        },
        {
          label: "币种",
          prop: "currencyCode_concat",
        },
        {
          label: "当前余额",
          prop: "currBalance",
        },
        {
          label: "存款利率",
          prop: "depositInterestRate",
        },
        {
          label: "上一结息金额",
          prop: "interestBillingAmt",
        },
        {
          label: "冻结余额",
          prop: "frozenBalance",
        },
      ],
      btns2: ["详情","转出"],
      curRowRadio2: "",
      curRow2: {},
      //交易账户信息表
      config3: {
        loading: false,
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      tableData3: [],
      curRowRadio3: "",
      curRow3: {},
      // 争议账户信息表
      config4: {
        loading: false,
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      tableData4: [],
      tableLabel4: [
        {
          label: "账户代码",
          prop: "accountId",
          width: "220",
        },
        {
          label: "币种",
          prop: "currencyCode_concat",
        },
        {
          label: "业务项目",
          prop: "businessProgramNo_concat",
          width: "200",
        },
        {
          label: "业务类型",
          prop: "businessTypeCode_concat",
          width: "200",
        },
        {
          label: "产品对象代码",
          prop: "productObjectCode_concat",
          width: "200",
        },
        {
          label: "账户组织形式",
          prop: "accountOrganFormDesc",
        },
        {
          label: "账户性质",
          prop: "businessDebitCreditCodeDesc",
        },
        {
          label: "状态码",
          prop: "statusCodeDesc",
        },
        {
          label: "当前总余额",
          prop: "frozenBalance",
        },
      ],
      btns4: ["详情"],
      curRowRadio4: "",
      curRow4: {},

      // 下拉框
      idTypeList: [],
      mainSupplyIndicatorOptions: [],
      // 客户基本信息
      baseInfoObj: {},
      //账户金融信息 弹窗
      accFunInfo_dialog: false,
      accFunInfoObj: {},
      // 溢缴款账户信息表 详情 弹窗
      overPayAccInfo_dialog: false,
      overPayAccInfoObj: {},
      // 溢缴款账户信息表 转出 弹窗
      transferOut_dialog: false,
      transferOutRef: {},
      transferOutObj: {},
      transferOutRules: {},
      nextProcessDate: "",
      corporationEntityNo: "",
      // 交易账户信息表 详情 弹窗
      creditTransAccInfo_dialog: false,
      creditTransAccInfoObj: {},
      // 争议账户信息表 详情 弹窗
      disputeAccInfo_dialog: false,
      disputeAccInfoObj: {},
      // 原交易信息 弹窗
        origTransInfo_dialog : false,
        origTransInfoObj: {},
        origTransInfo_showBtn: false,
        // 调单申请、 拒付管理 弹窗
        visaObj: {},
        mccObj: {},
        appVisaFormInf: {},
        appMCFormInf: {},
        appVisa_dialog: false,
        appMcc_dialog: false,
    };
  },
  created() {
    let logininfo = JSON.parse(window.sessionStorage.getItem("logininfo"));
    this.operationMode = logininfo.operationMode;
    this.systemUnitNo = logininfo.systemUnitNo;
    this.corporationEntityNo = logininfo.corporationEntityNo;
  },
  mounted() {
    this.getSelectDict("dic_certificateType").then((res) => {
      this.idTypeList = res;
    });
    // 主附标识
    this.getSelectDict("dic_mainAttachedFlag").then((res) => {
      this.mainSupplyIndicatorOptions = res;
    });

    this.queryDate(); // 查询转出日期 默认为系统时间
  },
  methods: {
    init() {
      this.queryForm = {
        idType: "",
        idNumber: "",
        externalIdentificationNo: "",
      };
      this.showTable = false;
      this.tableData = [];
    },
    // 重置
    reset() {
      this.init();
    },
    // 点击查询按钮
    handleSearch() {
      if (
        !this.queryForm.externalIdentificationNo &&
        !this.queryForm.idType &&
        !this.queryForm.idNumber
      ) {
        this.$message({
            message: "请输入查询信息",
            type: "warning",
        });
        this.init();
      } else {
        if (this.queryForm.idType) {
          if (!this.queryForm.idNumber) {
            this.$message({
                message: "请输入证件号码",
                type: "warning",
            });
          } else {
            this.getCustBaseInfo();
          }
        } else if (this.queryForm.idNumber) {
          if (!this.queryForm.idType) {
            this.$message({
                message: "请输入证件类型",
                type: "warning",
            });
          } else {
            this.getCustBaseInfo();
          }
        } else {
          this.getCustBaseInfo();
        }
      }
    },
    // 查询当前运营日期
    queryDate() {
      let params = {
        systemUnitNo: this.systemUnitNo,
      };
      this.post("/beta/betaService/COS.IQ.02.0038", this.queryForm, (res) => {
        if (res.returnCode == "000000") {
          this.nextProcessDate = res.returnData.rows[0].nextProcessDate;
        }
      });
    },

    // 获取客户基本信息
    getCustBaseInfo() {
      this.cutInfoLoading = true;
      this.post(
        "/nonfi/nonfinanceService/BSS.IQ.01.0001",
        this.queryForm,
        (res) => {
          if (res.returnCode == "000000") {
            this.cutInfoLoading = false;
            this.baseInfoObj.idNumber = res.returnData.rows[0].idNumber;
            this.baseInfoObj.idType = res.returnData.rows[0].idType;
            this.baseInfoObj.customerName = res.returnData.rows[0].customerName;
            this.getList(); // 循环账户信息表
            this.getList2(); // 溢缴款账户信息表
            this.getList3(); // 交易账户信息表
            this.getList4(); // 争议账户信息表
          }
        }
      );
    },
    // 循环账户信息表
    getList() {
      this.config.loading = true;
      let params = {
        accountOrganForm: "R", //循环账户
        flag: "Y", //输入该客户下任意卡号应都可以查询到该客户的所有账户，但目前不可以
        pageFlag: "mainPage",
        isTrans: true, //是否需要翻译数据字典
        transParams: [
          "dic_accountOrganForm",
          "dic_businessDebitCreditCode",
          "dic_accStatusCode",
        ], //查找数据字典所需参数
        transDict: [
          "accountOrganForm",
          "businessDebitCreditCode",
          "statusCode",
        ], //翻译前后key
      };
      params = Object.assign(params, this.config, this.queryForm);
      this.getTableList(
        "/nonfi/nonfinanceService/BSS.IQ.01.0118",
        params,
        (res) => {
          if (res.returnCode == "000000") {
            this.showTable = true;
            this.config.loading = false;
            if (
              res.returnData &&
              res.returnData.rows &&
              res.returnData.rows.length > 0
            ) {
              let rows = res.returnData.rows;
              rows.forEach((element) => {
                element.haveChild = true;
              });
              this.tableData = rows;
              this.config.total = res.returnData.totalCount;
            } else {
              this.tableData = [];
            }
          }
        }
      );
    },
    // 账户金融信息 按钮
    accFunInfoBtn(row) {
      // console.log(row)
      this.accFunInfoObj = Object.assign(row, this.queryForm);
      this.accFunInfo_dialog = true;
    },
    // 溢缴款账户信息表
    getList2() {
      this.config2.loading = true;
      let params = {
        operationMode: this.operationMode,
      };
      params = Object.assign(params, this.config2, this.queryForm);
      this.getTableList(
        "/nonfi/nonfinanceService/BSS.IQ.01.0070",
        params,
        (res) => {
          if (res.returnCode == "000000") {
            this.config2.loading = false;
            if (
              res.returnData &&
              res.returnData.rows &&
              res.returnData.rows.length > 0
            ) {
              let rows = res.returnData.rows;
              rows.forEach((ele) => {
                ele.currencyCode_concat =
                  ele.currencyCode + " " + ele.currencyDesc;
              });
              this.tableData2 = rows;
              this.config2.total = res.returnData.totalCount;
            } else {
              this.tableData2 = [];
            }
          }
        }
      );
    },

    // 交易账户信息表
    getList3() {
      this.config3.loading = true;
      let params = {
        accountOrganForm: "R", //循环账户
        flag: "N",
        pageFlag: "mainPage",
        isTrans: true, //是否需要翻译数据字典
        transParams: ["dic_loanStatus"], //查找数据字典所需参数
        transDict: ["status"], //翻译前后key
      };
      params = Object.assign(params, this.config3, this.queryForm);
      this.getTableList(
        "/nonfi/nonfinanceService/ILS.IQ.01.0020",
        params,
        (res) => {
          if (res.returnCode == "000000") {
            this.config3.loading = false;
            if (
              res.returnData &&
              res.returnData.rows &&
              res.returnData.rows.length > 0
            ) {
              let rows = res.returnData.rows;
              rows.forEach((element) => {
                element.haveChild = true;
              });
              this.tableData3 = rows;
              this.config3.total = res.returnData.totalCount;
            } else {
              this.tableData3 = [];
            }
          }
        }
      );
    },
    // 争议账户信息表
    getList4() {
      this.config4.loading = true;
      let params = {
        isTrans: true,
        transParams: [
          "dic_accountOrganForm",
          "dic_businessDebitCreditCode",
          "dic_accStatusCode",
        ],
        transDict: [
          "accountOrganForm",
          "businessDebitCreditCode",
          "statusCode",
        ],
      };
      params = Object.assign(params, this.config4, this.queryForm);
      this.getTableList(
        "/nonfi/nonfinanceService/ISS.IQ.01.0008",
        params,
        (res) => {
          if (res.returnCode == "000000") {
            this.config4.loading = false;
            if (
              res.returnData &&
              res.returnData.rows &&
              res.returnData.rows.length > 0
            ) {
              let rows = res.returnData.rows;
              rows.forEach((ele) => {
                ele.businessProgramNo_concat =
                  ele.businessProgramNo + ele.programDesc;
                ele.businessTypeCode_concat =
                  ele.businessTypeCode + ele.businessDesc;
                ele.productObjectCode_concat =
                  ele.productObjectCode + ele.productDesc;
                ele.currencyCode_concat =
                  ele.currencyCode + " " + ele.currencyDesc;
              });
              this.tableData4 = rows;
              this.config4.total = res.returnData.totalCount;
            } else {
              this.tableData4 = [];
            }
          }
        }
      );
    },

    // 循环账户信息表子账户 查询
    loadTable(tree, treeNode, resolve) {
      setTimeout(() => {
        let params1 = {
          accFlag: "mainAcc",
          flag: "N",
          accountOrganForm: tree.accountOrganForm,
          globalTransSerialNo: tree.globalTransSerialNo,
          productObjectCode: tree.productObjectCode,
          businessProgramNo: tree.businessProgramNo,
          businessTypeCode: tree.businessTypeCode,
          customerNo: tree.customerNo,
          currencyCode: tree.currencyCode,
        };
        params1 = Object.assign(params1, this.queryForm);
        let childList = [];
        this.getTableList(
          "/nonfi/nonfinanceService/BSS.IQ.01.0118",
          params1,
          (res) => {
            if (res.returnCode == "000000") {
              if (
                res.returnData &&
                res.returnData.rows &&
                res.returnData.rows.length > 0
              ) {
                childList = res.returnData.rows;
              } else {
                childList = [];
              }
              resolve(childList);
            }
          }
        );
      }, 1000);
    },
    // 交易账户信息 子账户 查询
    loadTable3(tree, treeNode, resolve) {
      setTimeout(() => {
        let params1 = {
          accFlag: "mainAcc",
          flag: "N",
          accountOrganForm: tree.accountOrganForm,
          globalTransSerialNo: tree.globalTransSerialNo,
          productObjectCode: tree.productObjectCode,
          businessProgramNo: tree.businessProgramCode,
          businessTypeCode: tree.businessTypeCode,
          customerNo: tree.customerNo,
          currencyCode: tree.currencyCode,
        };
        params1 = Object.assign(params1, this.queryForm);
        let childList = [];
        this.getTableList(
          "/nonfi/nonfinanceService/ILS.IQ.01.0025",
          params1,
          (res) => {
            if (res.returnCode == "000000") {
              if (
                res.returnData &&
                res.returnData.rows &&
                res.returnData.rows.length > 0
              ) {
                childList = res.returnData.rows;
              } else {
                childList = [];
              }
              resolve(childList);
            }
          }
        );
      }, 1000);
    },

    // 溢缴款账户信息表
    // 溢缴款账户信息表 查询 按钮
    handleDetail2(row) {
      console.log(row);
      this.overPayAccInfo_dialog = true;
      this.overPayAccInfoObj = row;
    },
    // 转出
    transferOut(row) {
      // console.log(row)
      this.transferOut_dialog = true;
      this.transferOutObj = Object.assign(row, this.queryForm);
      this.transferOutObj.transDate = this.nextProcessDate;
    },
    // 确定转出
    sureTransferOut() {
      this.$refs["transferOutRef"].validate((valid) => {
        if (valid) {
          if (
            this.transferOutObj.transAmount > this.transferOutObj.currBalance
          ) {
            this.$message({
              title: "提示",
              message: "转出金额超过当前溢缴款金额",
              type: "warning",
              duration: 2000,
            });
            return;
          }
          let params = {
            corporation: this.corporationEntityNo,
            ecommPostingAcctNmbr: this.transferOutObj.accountId,
            ecommCurrencyCode: this.transferOutObj.currencyCode,
            ecommTransDate: this.transferOutObj.transDate,
            ecommTransAmount: this.transferOutObj.transAmount,
            ecommTransCurr: this.transferOutObj.currencyCode,
            ecommClearCurr: this.transferOutObj.currencyCode,
            ecommClearAmount: this.transferOutObj.transAmount,
            ecommTransPostingCurr: this.transferOutObj.currencyCode,
            ecommTransPostingAmount: this.transferOutObj.transAmount,
            ecommEntryId: this.transferOutObj.externalIdentificationNoT,
            idType: this.transferOutObj.idType,
            idNumber: this.transferOutObj.idNumber,
            ecommEventId: "ISS.RT.80.0001",
          };
          this.post("/card/cardService/ISS.RT.80.0001", params, (res) => {
            if (res.returnCode == "000000") {
              this.$notify({
                title: "Success",
                message: "转出成功",
                type: "success",
                duration: 2000,
              });
              this.transferOut_dialog = false;
              this.getList2();
            }
          });
        }
      });
    },

    //交易账户信息表 查询 按钮
    handleDetail3(row) {
      console.log(row);
      this.creditTransAccInfo_dialog = true;
      this.creditTransAccInfoObj = Object.assign(row, this.queryForm);
    },
    // 争议账户信息表  查询 按钮
    handleDetail4(row) {
      console.log(row);
      this.disputeAccInfo_dialog = true;
      this.disputeAccInfoObj = Object.assign(row, this.queryForm);

      // this.disputeAccObj = res.returnData.rows[0]
      // 业务项目
      this.disputeAccInfoObj.businessProgramNoTrans =
        this.disputeAccInfoObj.businessProgramNo +
        " " +
        this.disputeAccInfoObj.programDesc;
      // 所属业务类型
      this.disputeAccInfoObj.businessTypeCodeTrans =
        this.disputeAccInfoObj.businessTypeCode +
        " " +
        this.disputeAccInfoObj.businessDesc;
      // 所属机构
      this.disputeAccInfoObj.organNoTrans =
        this.disputeAccInfoObj.organNo + " " + this.disputeAccInfoObj.organName;
    },

    //原交易信息
    sureOrigTransInfo() {
      this.origTransInfo_dialog = true;
      let params = {
            externalIdentificationNo: this.disputeAccInfoObj.externalIdentificationNo,
            globalSerialNumbr : this.disputeAccInfoObj.oldGlobalSerialNumbr,
            eventNo : 'PT.40',//、、目前定位不到事件编号
            logLevel : "A",
            activityNo : "X8010",
            queryType : "5"
      }
      this.post("/nonfi/nonfinanceService/ISS.IQ.03.0010", params, (res) => {
        if (res.returnCode == "000000") {
           if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
            this.origTransInfoObj = res.returnData.rows[0];
           }
        }
      });

    },
    // 争议释放有利于客户
    sureDisReleaseCst() {
        let params = {
            ecommEntryId : this.disputeAccInfoObj.externalIdentificationNo,
			ecommOrigGlobalSerialNumbr : this.disputeAccInfoObj.oldGlobalSerialNumbr,
        }
        this.post("/card/cardService/ISS.RT.05.0001", params, (res) => {
            if (res.returnCode == "000000") {
            this.$notify({
                    title: "Success",
                    message: "争议释放有利于客户成功",
                    type: "success",
                    duration: 2000,
                });
                this.disputeAccInfo_dialog = false;
                this.getList4();
            }
        });

    },
    // 争议释放有利于银行
    sureDisReleaseBank() {
        let params = {
            ecommEntryId : this.disputeAccInfoObj.externalIdentificationNo,
			ecommOrigGlobalSerialNumbr : this.disputeAccInfoObj.oldGlobalSerialNumbr,
        }
        this.post("/card/cardService/ISS.RT.06.0001", params, (res) => {
            if (res.returnCode == "000000") {
            this.$notify({
                    title: "Success",
                    message: "争议释放有利于银行成功",
                    type: "success",
                    duration: 2000,
                });
                this.disputeAccInfo_dialog = false;
                this.getList4();
            }
        });
    },
    // 调单申请/ 拒付管理
    sureTransApplyOrRefusManage() {
        if(this.disputeAccInfoObj.statusCode != "D" && this.disputeAccInfoObj.statusCode != "C"){
            this.$message({
                title: "提示",
                message: "当前争议账户状态不允许此操作",
                type: "warning",
                duration: 2000,
            });
            return
        } else {
            let cardBin = this.disputeAccInfoObj.externalIdentificationNo.substring(3,9);
            let params = {
                binNo : cardBin
            }
            params = Object.assign(params, this.queryForm);

            if (this.disputeAccInfoObj.statusCode == "D") {
                
                this.post("/beta/betaService/COS.IQ.02.0011", params, (res) => {
                    if (res.returnCode == "000000") {
                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                            let cardScheme = res.returnData.rows[0].cardScheme;
                            let params1 = {
                                globalSerialNumber : this.disputeAccInfoObj.oldGlobalSerialNumbr,
                            }
                            params1 = Object.assign(params1 , this.queryForm)
                            if (cardScheme == 'V') {
                                this.post("/nonfi/nonfinanceService/ISS.IQ.01.0180", params, (res1) => {
                                    if (res1.returnCode == "000000") {
                                        if (res1.returnData && res1.returnData.rows && res1.returnData.rows.length > 0 ) {
                                            // $scope.data = data.returnData[0];
											// $scope.appVisaFormInf = data.returnData[0];
											// $scope.appMCFormInf = data.returnData[0];
											// $scope.safeApply();
											// result.cancel();
                                            this.visaObj = res1.returnData[0]
                                            this.appVisaFormInf = res1.returnData[0]
                                            this.appMCFormInf = res1.returnData[0]
                                            this.disputeAccInfo_dialog = false
                                        }
                                    }
                                });
                            } else if (cardScheme == 'M') {
                                this.post("/nonfi/nonfinanceService/ISS.IQ.01.0185", params, (res2) => {
                                    if (res2.returnCode == "000000") {
                                        if (res2.returnData && res2.returnData.rows && res2.returnData.rows.length > 0 ) {
                                            // $scope.data = data.returnData[0];
											// $scope.data2 = data.returnData[1][0];
											// $scope.appVisaFormInf = data.returnData[0];
											// $scope.appMCFormInf = data.returnData[0];
											// $scope.safeApply();
											// result.cancel();
                                            this.visaObj = res2.returnData[0]
                                            this.mccObj =  res2.returnData[1][0]
                                            this.appVisaFormInf = res2.returnData[0]
                                            this.appMCFormInf = res2.returnData[0]
                                            this.disputeAccInfo_dialog = false
                                        }
                                    }
                                });
                            }
                            let params2 = {
                                globalTransSerialNoAuth : this.disputeAccInfoObj.oldGlobalSerialNumbr,
                            }
                            params2 = Object.assign(params2 , this.queryForm)
                            let _this = this
                            setTimeout(() =>{
                                this.post("/nonfi/nonfinanceService/ISS.IQ.01.0190", params, (res3) => {
                                    if (res3.returnCode == "000000") {
                                        if (res3.returnData) {
                                            let data1 = res3.returnData[0];
                                            if (cardScheme == 'V') {
                                                _this.appVisaFormInf = res3.returnData[0]
                                                _this.appVisaFormInf.acquirerBusinessId = _this.visaObj.acquirerBusinessId
                                                _this.appVisaFormInf.nationalReimburseFee = _this.visaObj.nationalReimburseFee
                                                _this.appVisaFormInf.accountSelection = _this.visaObj.accountSelection
                                                _this.appVisaFormInf.reimburseAttribute = _this.visaObj.reimburseAttribute
                                                _this.appVisaFormInf.transIdentifier = _this.visaObj.transIdentifier
                                                _this.appVisaFormInf.settlementFlag = _this.visaObj.settlementFlag
                                                _this.appVisaFormInf.oldGlobalSerialNumbr = _this.visaObj.oldGlobalSerialNumbr
                                                _this.appVisaFormInf.transactionCode = '52'
                                                _this.appVisaFormInf.retrievalRequestId = '0'
                                                _this.appVisaFormInf.acquirerBusinessId = _this.visaObj.acquirerBusinessId
                                                _this.appVisaFormInf.acquirerBusinessId = _this.visaObj.acquirerBusinessId
                                                _this.disputeAccInfo_dialog = false
                                                // AppVisa 弹窗
                                                _this.appVisa_dialog = true
                                            } else if (cardScheme == 'M') {
												_this.appMCFormInf = res3.returnData[0];
												_this.appMCFormInf.processingCode = _this.mccObj.processingCode
												_this.appMCFormInf.posEntryMode = _this.mccObj.posEntryMode
												_this.appMCFormInf.forwdInstitIdCode = _this.mccObj.forwdInstitIdCode
												_this.appMCFormInf.retrievalReferNum = _this.mccObj.retrievalReferNum
												_this.appMCFormInf.cardAcceptorName = _this.mccObj.cardAcceptorName
												_this.appMCFormInf.settlementIndicator = _this.mccObj.settlementIndicator
												_this.appMCFormInf.transLifeCycleId = _this.mccObj.transLifeCycleId
												_this.appMCFormInf.messageNumber = _this.mccObj.messageNumber
												_this.appMCFormInf.transOriginInstit = _this.mccObj.transOriginInstit
												_this.appMCFormInf.oldGlobalSerialNumbr = _this.mccObj.oldGlobalSerialNumbr
												_this.appMCFormInf.terminalType = _this.visaObj.P0023
												_this.appMCFormInf.messageReversalIndicator = _this.visaObj.P0025
												_this.appMCFormInf.electronicCommerceSecurityLevelIndicator = _this.visaObj.P0052
												_this.appMCFormInf.currencyExponents = _this.visaObj.P0148
												_this.appMCFormInf.currencyCodesAmountsOriginal = _this.visaObj.P0149
												_this.appMCFormInf.businessActivity = _this.visaObj.P0158
												_this.appMCFormInf.settlementIndicator = _this.visaObj.P0165
												_this.appMCFormInf.masterCardAssignedId = _this.visaObj.P0176
												_this.appMCFormInf.retrievalDocumentCode = _this.visaObj.P0228
												_this.appMCFormInf.exclusionRequestCode = _this.visaObj.P0260
												_this.appMCFormInf.documentationIndicator = _this.visaObj.P0262
												_this.appMCFormInf.functionCode = '603'
												_this.appMCFormInf.mti = '1644'
                                                _this.disputeAccInfo_dialog = false
                                                // AppMCC 弹窗
                                                _this.appMcc_dialog = true
                                                
                                            }
                                        }
                                        
                                    }
                                });
                            },300);
                        } else {
                            this.$message({
                                title: "提示",
                                message: "未查询到有效数据",
                                type: "warning",
                                duration: 2000,
                            });
                        }
                        
                    }
                });
            } else if (this.disputeAccInfoObj.statusCode == "C") {
                this.post("/beta/betaService/COS.IQ.02.0011", params, (res) => {
                    if (res.returnCode == "000000") {
                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                            let cardScheme = res.returnData.rows[0].cardScheme
                            let params1 = {
                                globalSerialNumber : this.disputeAccInfoObj.oldGlobalSerialNumbr,
                            }
                            params1 = Object.assign(params1 , this.queryForm)
                            if (cardScheme == 'V') {
                                this.post("/nonfi/nonfinanceService/ISS.IQ.01.0180", params, (res1) => {
                                    if (res1.returnCode == "000000") {
                                        if (res1.returnData && res1.returnData.rows && res1.returnData.rows.length > 0 ) {
                                            this.visaObj = res1.returnData[0]
                                            this.appVisaFormInf = res1.returnData[0]
                                            this.appMCFormInf = res1.returnData[0]
                                            this.disputeAccInfo_dialog = false
                                        }
                                    }
                                });
                            } else if (cardScheme == 'M') {
                                this.post("/nonfi/nonfinanceService/ISS.IQ.01.0185", params, (res2) => {
                                    if (res2.returnCode == "000000") {
                                        if (res2.returnData && res2.returnData.rows && res2.returnData.rows.length > 0 ) {
                                            this.visaObj = res2.returnData[0]
                                            this.mccObj =  res2.returnData[1][0]
                                            this.appVisaFormInf = res2.returnData[0]
                                            this.appMCFormInf = res2.returnData[0]
                                            this.disputeAccInfo_dialog = false
                                        }
                                    }
                                });
                            }
                            let params2 = {
                                globalTransSerialNoAuth : this.disputeAccInfoObj.oldGlobalSerialNumbr,
                            }
                            params2 = Object.assign(params2 , this.queryForm)
                            let _this = this
                            setTimeout(() =>{
                                this.post("/nonfi/nonfinanceService/ISS.IQ.01.0190", params, (res3) => {
                                    if (res3.returnCode == "000000") {
                                        if (res3.returnData) {

                                            let data1 = res3.returnData[0];
                                            if (cardScheme == 'V') {
                                                _this.appVisaFormInf = res3.returnData[0]
                                                _this.appVisaFormInf.acquirerBusinessId = _this.visaObj.acquirerBusinessId
                                                _this.appVisaFormInf.nationalReimburseFee = _this.visaObj.nationalReimburseFee
                                                _this.appVisaFormInf.reimburseAttribute = _this.visaObj.reimburseAttribute
                                                _this.appVisaFormInf.transIdentifier = _this.visaObj.transIdentifier
                                                _this.appVisaFormInf.oldGlobalSerialNumbr = _this.visaObj.oldGlobalSerialNumbr
                                                _this.appVisaFormInf.settlementFlag = _this.visaObj.settlementFlag
                                                _this.appVisaFormInf.requestedPaymentService =  _this.visaObj.requestedPaymentService
                                                _this.appVisaFormInf.authorizationCharacteristicsIndicator =  _this.visaObj.authorizationCharacteristicsIndicator
                                                _this.appVisaFormInf.internationalFeeIndicator =  _this.visaObj.internationalFeeIndicator
                                                _this.appVisaFormInf.feeProgramIndicator =  _this.visaObj.feeProgramIndicator
                                                _this.appVisaFormInf.mailPhoneElectronicCommerceAndPaymentIndicator =  _this.visaObj.mailPhoneElectronicCommerceAndPaymentIndicator
                                                _this.appVisaFormInf.prepaidCardIndicator =  _this.visaObj.prepaidCardIndicator
                                                _this.appVisaFormInf.authorizedAmount =  _this.visaObj.authorizedAmount
                                                _this.appVisaFormInf.authorizationCurrencyCode =  _this.visaObj.authorizationCurrencyCode
                                                _this.appVisaFormInf.authorizationResponseCode =  _this.visaObj.authorizationResponseCode
                                                _this.appVisaFormInf.multipleClearingSequenceNumber =  _this.visaObj.multipleClearingSequenceNumber
                                                _this.appVisaFormInf.multipleClearingSequenceCount =  _this.visaObj.multipleClearingSequenceCount
                                                _this.appVisaFormInf.dynamicCurrencyConversionIndicator =  _this.visaObj.dynamicCurrencyConversionIndicator
                                                _this.appVisaFormInf.transCodeQualifer =  _this.visaObj.transCodeQualifer
                                                _this.disputeAccInfo_dialog = false
                                                // AppVisa 弹窗
                                                _this.appVisa_dialog = true
                                            } else if (cardScheme == 'M') {

                                                _this.appMCFormInf = res3.returnData[0];
												_this.appMCFormInf.processingCode = _this.mccObj.processingCode
												_this.appMCFormInf.dateAndTime = _this.mccObj.dateAndTime
												_this.appMCFormInf.posEntryMode = _this.mccObj.posEntryMode
												_this.appMCFormInf.dateExpiration = _this.mccObj.dateExpiration
												_this.appMCFormInf.forwdInstitIdCode = _this.mccObj.forwdInstitIdCode
												_this.appMCFormInf.retrievalReferNum = _this.mccObj.retrievalReferNum
												_this.appMCFormInf.serviceCode = _this.mccObj.serviceCode
												_this.appMCFormInf.cardAcceptorName = _this.mccObj.cardAcceptorName
												_this.appMCFormInf.transLifeCycleId = _this.mccObj.transLifeCycleId
												_this.appMCFormInf.transOriginInstit = _this.mccObj.transOriginInstit
												_this.appMCFormInf.oldGlobalSerialNumbr = _this.disputeAccInfoObj.oldGlobalSerialNumbr
                                                _this.appMCFormInf.terminalType = _this.visaObj.P0023
                                                _this.appMCFormInf.messageReversalIndicator = _this.visaObj.P0025
                                                _this.appMCFormInf.electronicCommerceSecurityLevelIndicator = _this.visaObj.P0052
                                                _this.appMCFormInf.currencyExponents = _this.visaObj.P0148
                                                _this.appMCFormInf.currencyCodesAmountsOriginal = _this.visaObj.P0149
                                                _this.appMCFormInf.businessActivity = _this.visaObj.P0158
                                                _this.appMCFormInf.settlementIndicator = _this.visaObj.P0165
                                                _this.appMCFormInf.masterCardAssignedId  = _this.visaObj.P0176
                                                _this.appMCFormInf.exclusionRequestCode = _this.visaObj.P0260
                                                _this.appMCFormInf.documentationIndicator = _this.visaObj.P0262
                                                _this.appMCFormInf.mti = "1442"
                                                _this.disputeAccInfo_dialog = false
                                                // AppMCC 弹窗
                                                _this.appMcc_dialog = true
                                            }
                                            
                                        }
                                    }
                                })
                            })
                        }
                    }
                })
            }
        }
    },



  },
};
</script>
  
  <style>
</style>
  
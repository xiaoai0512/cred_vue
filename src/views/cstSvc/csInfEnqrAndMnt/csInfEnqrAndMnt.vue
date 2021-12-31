<!-- 客户信息查询维护 -->
<template>
  <div class="allContent">
    <el-form :model="queryForm">
      <el-form-item class="cl_td" label="证件类型" prop="idType">
        <el-select v-model="queryForm.idType" class="wd200">
          <el-option
            v-for="(item, index) in idTypeOptions"
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

    <div v-show="showTable">
      <div class="text_title">客户基本信息</div>
      <el-form :model="cstBaseInfoForm">
        <el-form-item
          class="cl_td"
          label="机构号"
          prop="institutionId"
          :rules="[
            { required: true, message: '请输入机构号', trigger: 'change' },
          ]"
        >
          <el-select
            clearable
            v-model="cstBaseInfoForm.institutionId"
            class="wd200"
            disabled
          >
            <el-option
              v-for="(item, index) in institutionIdOptions"
              :key="index"
              :label="item.organName"
              :value="item.organNo"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          class="cl_td"
          label="客户名称"
          prop="customerName"
          :rules="[
            { required: true, message: '请输入客户名称', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="cstBaseInfoForm.customerName"
            class="wd200"
            type="text"
            readonly
          />
        </el-form-item>
        <el-form-item
          class="cl_td"
          label="证件类型"
          prop="idType"
          :rules="[
            { required: true, message: '请输入证件类型', trigger: 'blur' },
          ]"
        >
          <el-select
            clearable
            v-model="cstBaseInfoForm.idType"
            class="wd200"
            disabled
          >
            <el-option
              v-for="(item, index) in idTypeOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          class="cl_td"
          label="证件号码"
          prop="idNumber"
          :rules="[
            { required: true, message: '请输入证件号码', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="cstBaseInfoForm.idNumber"
            class="wd200"
            type="text"
            readonly
          />
        </el-form-item>
        <el-form-item
          class="cl_td"
          label="客户类型"
          prop="customerType"
          :rules="[
            { required: true, message: '请输入客户类型', trigger: 'change' },
          ]"
        >
          <el-select
            clearable
            v-model="cstBaseInfoForm.customerType"
            class="wd200"
            disabled
          >
            <el-option
              v-for="(item, index) in customerTypeOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          class="cl_td"
          label="账单日"
          prop="billDay"
          :rules="[
            { required: true, message: '请输入账单日', trigger: 'change' },
          ]"
        >
          <el-select
            clearable
            v-model="cstBaseInfoForm.billDay"
            class="wd200"
            disabled
          >
            <el-option
              v-for="(item, index) in billDayOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          class="cl_td"
          label="还款选项"
          prop="paymentMark"
          :rules="[
            { required: true, message: '请输入还款选项', trigger: 'change' },
          ]"
        >
          <el-select
            clearable
            v-model="cstBaseInfoForm.paymentMark"
            class="wd200"
            disabled
          >
            <el-option
              v-for="(item, index) in paymentMarkOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="cl_td" label="城市" prop="city">
          <el-input
            v-model="cstBaseInfoForm.city"
            class="wd200"
            type="text"
            readonly
          />
        </el-form-item>
        <el-form-item
          class="red cl_td"
          label="港澳台居民居住证"
          prop="idNumberHmt"
        >
          <el-input
            v-model="cstBaseInfoForm.idNumberHmt"
            class="wd200"
            type="text"
            readonly
          />
        </el-form-item>
        <div class="text_title">客户个人信息</div>
        <el-form-item class="cl_td" label="分行号 " prop="branchNumber">
          <el-input
            v-model="cstBaseInfoForm.branchNumber"
            class="wd200"
            type="text"
            readonly
          />
        </el-form-item>
        <el-form-item class="cl_td" label="生日 " prop="dateOfBirth">
          <el-input
            v-model="cstBaseInfoForm.dateOfBirth"
            class="wd200"
            type="text"
            readonly
          />
        </el-form-item>

        <el-form-item class="cl_td" label="性别 " prop="sexCode">
          <el-select
            clearable
            v-model="cstBaseInfoForm.sexCode"
            class="wd200"
            disabled
          >
            <el-option
              v-for="(item, index) in sexCodeOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="cl_td" label="手机号码 " prop="mobilePhone">
          <el-input
            v-model="cstBaseInfoForm.mobilePhone"
            class="wd200"
            type="text"
            readonly
          />
        </el-form-item>
        <el-form-item class="cl_td" label="家庭电话 " prop="homePhone">
          <el-input
            v-model="cstBaseInfoForm.homePhone"
            class="wd200"
            type="text"
            readonly
          />
        </el-form-item>
        <el-form-item class="cl_td" label="公司电话 " prop="companyPhone">
          <el-input
            v-model="cstBaseInfoForm.companyPhone"
            class="wd200"
            type="text"
            readonly
          />
        </el-form-item>
        <el-form-item class="cl_td" label="邮编 " prop="zipCode">
          <el-input
            v-model="cstBaseInfoForm.zipCode"
            class="wd200"
            type="text"
            readonly
          />
        </el-form-item>
        <el-form-item class="cl_td" label="联络人姓名 " prop="contactName">
          <el-input
            v-model="cstBaseInfoForm.contactName"
            class="wd200"
            type="text"
            readonly
          />
        </el-form-item>
        <el-form-item class="cl_td" label="联络人电话 " prop="contactPhone">
          <el-input
            v-model="cstBaseInfoForm.contactPhone"
            class="wd200"
            type="text"
            readonly
          />
        </el-form-item>
        <el-form-item class="cl_td" label="成为会员年份 " prop="memberSince">
          <el-input
            v-model="cstBaseInfoForm.memberSince"
            class="wd200"
            type="text"
            readonly
          />
        </el-form-item>
        <el-form-item class="cl_td" label="客户来源码" prop="customerSource">
          <el-input
            v-model="cstBaseInfoForm.customerSource"
            class="wd200"
            type="text"
            readonly
          />
        </el-form-item>
        <el-form-item class="cl_td" label="行为得分" prop="behaviorScore">
          <el-input
            v-model="cstBaseInfoForm.behaviorScore"
            class="wd200"
            type="text"
            readonly
          />
        </el-form-item>
        <el-form-item class="cl_td" label="客户等级" prop="customerLevel">
          <el-input
            v-model="cstBaseInfoForm.customerLevel"
            class="wd200"
            type="text"
            readonly
          />
        </el-form-item>
        <el-form-item class="cl_td" label="年收入 " prop="annualIncome">
          <el-input
            v-model="cstBaseInfoForm.annualIncome"
            class="wd200"
            type="text"
            readonly
          />
        </el-form-item>
        <el-form-item class="cl_td" label="住宅性质 " prop="residencyStatus">
          <el-select
            clearable
            v-model="cstBaseInfoForm.residencyStatus"
            class="wd200"
            disabled
          >
            <el-option
              v-for="(item, index) in residencyStatusOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="cl_td" label="婚姻状况 " prop="maritalStatus">
          <el-select
            clearable
            v-model="cstBaseInfoForm.maritalStatus"
            class="wd200"
            disabled
          >
            <el-option
              v-for="(item, index) in maritalStatusOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="cl_td" label="工作行业代码" prop="occupationCode">
          <el-input
            v-model="cstBaseInfoForm.occupationCode"
            class="wd200"
            type="text"
            readonly
          />
        </el-form-item>
        <el-form-item class="cl_td" label="职务级别代码" prop="postRankCode">
          <el-select
            clearable
            v-model="cstBaseInfoForm.postRankCode"
            class="wd200"
            disabled
          >
            <el-option
              v-for="(item, index) in postRankCodeOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="cl_td" label="职称代码" prop="titleCode">
          <el-input
            v-model="cstBaseInfoForm.titleCode"
            class="wd200"
            type="text"
            readonly
          />
        </el-form-item>
        <el-form-item class="cl_td" label="工作年限" prop="periodOfOccupation">
          <el-input
            v-model="cstBaseInfoForm.periodOfOccupation"
            class="wd200"
            type="text"
            readonly
          />
        </el-form-item>
        <el-form-item class="cl_td" label="兴趣爱好" prop="hobby">
          <el-input v-model="cstBaseInfoForm.hobby" class="wd200" type="text" />
        </el-form-item>
        <el-form-item class="cl_td" label="担保人标识" prop="guarantorFlag">
          <el-select
            clearable
            v-model="cstBaseInfoForm.guarantorFlag"
            class="wd200"
            disabled
          >
            <el-option
              v-for="(item, index) in guarantorFlagOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="cl_td" label="营销员代码" prop="marketerCode">
          <el-input
            v-model="cstBaseInfoForm.marketerCode"
            class="wd200"
            type="text"
            readonly
          />
        </el-form-item>
        <el-form-item
          class="cl_td"
          label="持卡人的社会保障号类型"
          prop="socialSecurityId"
        >
          <el-input
            v-model="cstBaseInfoForm.socialSecurityId"
            class="wd200"
            type="text"
            readonly
          />
        </el-form-item>
        <el-form-item
          class="cl_td"
          label="社保账号"
          prop="socialSecurityNumber"
        >
          <el-input
            v-model="cstBaseInfoForm.socialSecurityNumber"
            class="wd200"
            type="text"
            readonly
          />
        </el-form-item>
        <div class="text_title">系统使用信息</div>
        <el-form-item
          class="cl_td"
          label="追账完成日期"
          prop="afterHoursCompleteDate"
        >
          <el-input
            v-model="cstBaseInfoForm.afterHoursCompleteDate"
            class="wd200"
            type="text"
            readonly
          />
        </el-form-item>
        <el-form-item class="cl_td" label="系统单元编号" prop="systemUnitNo">
          <el-input
            v-model="cstBaseInfoForm.systemUnitNo"
            class="wd200"
            type="text"
            readonly
          />
        </el-form-item>
      </el-form>
      <div class="text_title">客户地址信息</div>
      <el-table
        :data="tableData"
        class="mbtm20"
        fit
        highlight-current-row
        style="width: 100%"
        border
      >
        <el-table-column prop="type" label="地址类型" align="center">
          <template slot-scope="{ row }">
            <span v-if="row.type == '1'">邮寄地址</span>
            <span v-if="row.type == '2'">家庭地址</span>
            <span v-if="row.type == '3'">单位地址</span>
            <span v-if="row.type == '4'">担保地址</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="contactAddress"
          label="联系地址"
          align="center"
        />
        <el-table-column
          prop="contactPostCode"
          label="联系邮编"
          align="center"
        />
        <el-table-column prop="contactMobilePhone" label="指定电话"
        align="center" / >
        <el-table-column prop="city" label="所在城市" align="center" />
      </el-table>
      <div class="text_title">客户备注信息</div>
      <div class="cl_tr text_left">
        <el-button
          size="small"
          icon="el-icon-plus"
          type="primary"
          @click="addRemark()"
          >新增</el-button
        >
      </div>
      <el-table
        :data="cstRemarksTable"
        class="mbtm20"
        fit
        highlight-current-row
        style="width: 100%"
        border
      >
        <el-table-column prop="remarkInfo" label="备注信息" align="center" />
        <el-table-column
          prop="lastUpdateUserid"
          label="新增备注人员"
          align="center"
        />
      </el-table>
      <div v-show="remarkFormDiv">
        <el-form ref="remarkForm" :rule="remarkForm" :model="remarkForm">
          <el-form-item class="cl_td" label="备注信息" prop="remarkInfo">
            <el-input
              v-model="remarkForm.remarkInfo"
              class="wd200"
              type="text"
            />
          </el-form-item>
          <el-form-item
            class="cl_td"
            label="新增备注人员"
            prop="lastUpdateUserid"
          >
            <el-input
              v-model="remarkForm.lastUpdateUserid"
              class="wd200"
              type="text"
            />
          </el-form-item>
          <div class="cl_tr text_center">
            <el-button
              size="small"
              icon="el-icon-circle-check"
              type="primary"
              @click="saveRemark()"
              >保存</el-button
            >
            <el-button
              size="small"
              icon="el-icon-circle-close"
              type="primary"
              @click="closeRemark()"
              >关闭</el-button
            >
          </div>
        </el-form>
      </div>

      <!-- 提交 -->
      <div class="cl_tr text_center">
        <el-button
          size="medium"
          icon="el-icon-check"
          type="primary"
          @click="handleSubmit()"
          >提交</el-button
        >
      </div>
    </div>
    <!--showTable -->
  </div>
</template>
  
  <script>
import Pagination from "@/components/Pagination";
export default {
  name: "csInfEnqrAndMnt",
  components: {
    Pagination,
  },
  data() {
    return {
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
      // 备注信息
      cstRemarksTable: [],
      remarkFormDiv: false,
      remarkForm: {}, // 客户备注obj

      // 下拉框
      idTypeOptions: [], // 身份证类型
      institutionIdOptions: [], // 机构号
      customerTypeOptions: [], // 客户类型
      billDayOptions: [], // 账单日
      paymentMarkOptions: [], // 还款选项
      sexCodeOptions: [], // 性别
      residencyStatusOptions: [], // 住宅性质
      maritalStatusOptions: [], // 婚姻状况
      postRankCodeOptions: [], // 职务级别代码
      guarantorFlagOptions: [], // 担保人标识
      addressTypeOptions: [], // 地址类型

      cstBaseInfoForm: {},
    };
  },
  created() {},
  mounted() {
    //
    this.getSelectDict("dic_certificateType").then((res) => {
      this.idTypeOptions = res;
    });
    // 客户类型
    this.getSelectDict("dic_personalCompanyType").then((res) => {
      this.customerTypeOptions = res;
    });
    // 账单日
    this.getSelectDict("dic_billDay").then((res) => {
      this.billDayOptions = res;
    });
    // 还款选项
    this.getSelectDict("dic_paymentMark").then((res) => {
      this.paymentMarkOptions = res;
    });
    // 机构号
    this.getSelectDict("/beta/betaService/COS.IQ.02.0005", {}).then((res) => {
      this.institutionIdOptions = res;
    });
    // 性别
    this.getSelectDict("dic_gender").then((res) => {
      this.sexCodeOptions = res;
    });
    // 住宅性质
    this.getSelectDict("dic_residencyStatus").then((res) => {
      this.residencyStatusOptions = res;
    });
    // 婚姻状况
    this.getSelectDict("dic_maritalStatus").then((res) => {
      this.maritalStatusOptions = res;
    });
    // 职务级别代码
    this.getSelectDict("dic_postRankCode").then((res) => {
      this.postRankCodeOptions = res;
    });
    // 担保人标识
    this.getSelectDict("dic_guarantorFlag").then((res) => {
      this.guarantorFlagOptions = res;
    });
    // 地址类型
    this.getSelectDict("dic_addressType").then((res) => {
      this.addressTypeOptions = res;
    });
  },
  methods: {
    init() {
      this.queryForm = {
        idType: "",
        idNumber: "",
        externalIdentificationNo: "",
      };
      this.showTable = false;
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
    // 查询列表
    getList() {
      this.config.loading = true;
      let params = {
        isTrans: true, //是否需要翻译数据字典
        transParams: [
          "dic_cycleModel",
          "dic_directDebitStatus",
          "dic_directDebitMode",
        ], //查找数据字典所需参数
        transDict: ["cycleModel", "directDebitStatus", "directDebitMode"], //翻译前后key
      };
      params = Object.assign(params, this.config, this.queryForm);
      this.getTableList(
        "/nonfi/nonfinanceService/BSS.IQ.01.0020",
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
              this.tableData = res.returnData.rows;
              this.config.total = res.returnData.totalCount;
            } else {
              this.tableData = [];
              this.config.total = 0;
            }
          }
        }, (err) => {
          if(err) {
            this.tableData = [];
            this.config.total = 0;
            this.config.loading = false;
          }
      })
    },
    // 获取客户基本信息
    getCustBaseInfo() {
      this.post(
        "/nonfi/nonfinanceService/BSS.IQ.01.0001",
        this.queryForm,
        (res) => {
          if (res.returnCode == "000000") {
            this.showTable = true;
            if (
              res.returnData &&
              res.returnData.rows &&
              res.returnData.rows.length > 0
            ) {
              this.cstBaseInfoForm = res.returnData.rows[0];
              // 客户地址信息
              if (res.returnData.rows[0].coreCustomerAddrs) {
                this.tableData = res.returnData.rows[0].coreCustomerAddrs;
              } else {
                this.tableData = [];
              }
              //
              if (res.returnData.rows[0].listcoreCustomerRemarks) {
                this.cstRemarksTable =
                  res.returnData.rows[0].listcoreCustomerRemarks;
              } else {
                this.cstRemarksTable = [];
              }
            }
          } else {
            this.showTable = false;
          }
        }
      );
    },
    // 日期明细
    handleDetail(row) {
      this.getDetailList(row);
    },
    getDetailList(row) {
      this.detail_config.loading = true;
      let params = {
        businessProgramNo: row.businessProgramNo,
      };
      params = Object.assign(params, this.detail_config, this.queryForm);
      this.getTableList(
        "/nonfi/nonfinanceService/BSS.IQ.01.0015",
        params,
        (res) => {
          if (res.returnCode == "000000") {
            this.showDetailDiv = true;
            this.detail_config.loading = false;
            if (
              res.returnData &&
              res.returnData.rows &&
              res.returnData.rows.length > 0
            ) {
              this.detail_tableData = res.returnData.rows;
              this.detail_config.total = res.returnData.totalCount;
            } else {
              this.detail_tableData = [];
              this.detail_config.total = 0;
            }
          } else {
            this.showDetailDiv = false;
          }
        }, (err) => {
            if(err) {
              this.detail_tableData = [];
              this.detail_config.total = 0;
              this.detail_config.loading = false;
              this.showDetailDiv = false;
            }
        })
    },
    // 新增备注信息
    saveRemark() {
      if (!this.remarkForm.remarkInfo && !this.remarkForm.lastUpdateUserid) {
        this.$message({
          message: "请输入备注信息",
          type: "warning",
        });
      } else {
        this.cstRemarksTable.push(this.remarkForm);
        this.remarkFormDiv = false;
      }
    },
    // 关闭客户备注信息
    closeRemark() {
      this.remarkFormDiv = false; // 客户地址信息
    },
    // 新增客户备注按钮
    addRemark() {
      this.remarkFormDiv = true;
    },
    // 提交
    handleSubmit() {
      // 去除对象中的coreCustomerAddrs 属性
      for (var key in this.cstBaseInfoForm) {
        if ((key = "coreCustomerAddrs")) {
          delete this.cstBaseInfoForm["coreCustomerAddrs"];
        }
      }
      for (var key in this.cstBaseInfoForm) {
        if ((key = "coreCustomerUnifyInfos")) {
          delete this.cstBaseInfoForm["coreCustomerUnifyInfos"];
        }
      }
      let params = {};
      // 备注信息list
      if (this.cstRemarksTable.length > 0) {
        params.coreCustomerRemarkss = this.cstRemarksTable;
      } else {
        params.coreCustomerRemarkss = [];
      }
      params = Object.assign(params, this.cstBaseInfoForm);
      this.post("/nonfi/nonfinanceService/BSS.UP.01.0001", params, (res) => {
        if (res.returnCode == "000000") {
          this.$notify({
            title: "Success",
            message: "提交成功",
            type: "success",
            duration: 2000,
          });
          this.showTable = false;
          this.queryForm = {};
          this.cstBaseInfoForm = {};
        }
      });
    },
  },
};
</script>
  
  <style>
</style>
  
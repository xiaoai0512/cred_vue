<!-- 地址信息查询维护 -->
<template>
  <div class="allContent">
    <!-- 表单验证demo: -->
    <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
      <el-form-item class="cl_td" label="证件类型" prop="idType">
        <el-select clearable v-model="queryFormObj.idType" class="wd200">
          <el-option
            v-for="item in idTypeOptions"
            :key="item.codes"
            :label="item.detailDesc"
            :value="item.codes"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="cl_td" label="证件号码" prop="idNumber">
        <el-input v-model="queryFormObj.idNumber" class="wd200" type="text" />
      </el-form-item>
      <el-form-item
        class="cl_td"
        label="外部识别号"
        prop="externalIdentificationNo"
      >
        <el-input
          v-model="queryFormObj.externalIdentificationNo"
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
          icon="el-icon-plus"
          type="primary"
          @click="handleCreate"
          >新增</el-button
        >
      </div>
    </el-form>
    <div v-show="showTable">
      <div class="text_title">客户地址信息</div>

      <el-table
        v-loading="config.loading"
        :data="tableData"
        class="mbtm20"
        fit
        highlight-current-row
        style="width: 100%"
        border
      >
        <el-table-column prop="typeDesc" label="地址类型" align="center" />
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
        <el-table-column prop="" label="操作" align="center">
          <template slot-scope="{ row }">
            <el-button
              size="mini"
              icon="el-icon-edit"
              type="primary"
              @click="handleUpdate(row)"
              >修改</el-button
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
    </div>

    <!-- 新增 -->
    <el-dialog title="新增" :visible.sync="dialogFormVisibleAdd" width="85%">
      <el-form ref="refAdd" :model="tempAdd" :rules="rulesAdd">
        <el-form-item
          class="cl_td"
          label="地址类型"
          prop="type"
          :rules="[{ required: true, message: '地址类型不能为空' }]"
        >
          <el-select
            v-model="tempAdd.type"
            class="wd200"
            clearable
            @change="getType"
          >
            <el-option
              v-for="(item, index) in typeOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          class="cl_td"
          label="城市"
          prop="city"
          :rules="[{ required: true, message: '不能为空' }]"
        >
          <el-input v-model="tempAdd.city" class="wd200" type="text" />
        </el-form-item>
        <el-form-item
          class="cl_td"
          label="联系邮编"
          prop="contactPostCode"
          :rules="[{ required: true, message: '不能为空' }]"
        >
          <el-input
            v-model="tempAdd.contactPostCode"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td"
          label="指定电话"
          prop="contactMobilePhone"
          :rules="[{ required: true, message: '不能为空' }]"
        >
          <el-input
            v-model="tempAdd.contactMobilePhone"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_tr"
          label="联系地址"
          prop="contactAddress"
          :rules="[{ required: true, message: '不能为空' }]"
        >
          <el-input
            class="wd330"
            v-model="tempAdd.contactAddress"
            type="textarea"
          ></el-input>
        </el-form-item>
        <div v-show="showGuarantDiv">
          <el-form-item
            class="cl_td"
            label="担保人证件类型"
            prop="guarantorCertType"
          >
            <el-select
              v-model="tempAdd.guarantorCertType"
              class="wd200"
              clearable
              @change="getType"
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
            label="担保人证件号码 "
            prop="guarantorCertNo"
          >
            <el-input
              v-model="tempAdd.guarantorCertNo"
              class="wd200"
              type="text"
            />
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="createData()"> 确定 </el-button>
        <el-button @click="addClose"> 关闭 </el-button>
      </div>
    </el-dialog>

    <!-- 修改 -->
    <el-dialog title="修改" :visible.sync="dialogFormVisibleUp" width="85%">
      <el-form ref="refUp" :model="tempUp" :rules="rulesUp">
        <el-form-item
          class="cl_td"
          label="地址类型"
          prop="type"
          :rules="[{ required: true, message: '地址类型不能为空' }]"
        >
          <el-select v-model="tempUp.type" class="wd200" clearable disabled>
            <el-option
              v-for="(item, index) in typeOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="cl_td red" label="城市" prop="city">
          <el-input v-model="tempUp.city" class="wd200" type="text" />
        </el-form-item>
        <el-form-item class="cl_td" label="联系邮编" prop="contactPostCode">
          <el-input
            v-model="tempUp.contactPostCode"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <el-form-item class="cl_td" label="指定电话" prop="contactMobilePhone">
          <el-input
            v-model="tempUp.contactMobilePhone"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <el-form-item class="cl_tr" label="联系地址" prop="contactAddress">
          <el-input
            class="wd330"
            v-model="tempUp.contactAddress"
            type="textarea"
          ></el-input>
        </el-form-item>
        <div v-show="showGuarantDiv">
          <el-form-item
            class="cl_td"
            label="担保人证件类型"
            prop="guarantorCertType"
          >
            <el-select
              v-model="tempUp.guarantorCertType"
              class="wd200"
              clearable
              @change="getType"
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
            label="担保人证件号码 "
            prop="guarantorCertNo"
          >
            <el-input
              v-model="tempUp.guarantorCertNo"
              class="wd200"
              type="text"
            />
          </el-form-item>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="updateData()"> 确定 </el-button>
        <el-button @click="dialogFormVisibleUp = false"> 关闭 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";

export default {
  name: "accProcesseList",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Pagination,
  },
  data() {
    return {
      baseInfoObj: {}, // 客户基本信息
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
        total: 0,
      },

      // 下拉框
      idTypeOptions: [], // 证件类型
      typeOptions: [], // 地址类型

      // 新增
      dialogFormVisibleAdd: false,
      showGuarantDiv: false,
      refAdd: {},
      tempAdd: {},
      rulesAdd: {},

      // 修改
      dialogFormVisibleUp: false,
      rulesUp: {},
      refUp: {},
      tempUp: {},
    };
  },
  created() {},
  mounted() {
    // 证件类型
    this.getSelectDict("dic_certificateType").then((res) => {
      this.idTypeOptions = res;
    });
    // 地址类型
    this.getSelectDict("dic_addressType").then((res) => {
      this.typeOptions = res;
    });

    // this.init()
  },
  methods: {
    init() {
      this.queryFormObj.idType = "";
      this.queryFormObj.idNumber = "";
      this.queryFormObj.externalIdentificationNo = "";
      this.showTable = false;
    },
    // 获取客户基本信息
    getCustBaseInfo() {
      this.post(
        "/nonfi/nonfinanceService/BSS.IQ.01.0001",
        this.queryFormObj,
        (res) => {
          if (res.returnCode == "000000") {
            this.baseInfoObj.idNumber = res.returnData.rows[0].idNumber;
            this.baseInfoObj.idType = res.returnData.rows[0].idType;
            this.baseInfoObj.customerName = res.returnData.rows[0].customerName;
            this.baseInfoObj.customerNo = res.returnData.rows[0].customerNo;
            this.getList();
          }
        }
      );
    },
    // 列表
    getList() {
      this.config.loading = true;
      let params = {
        isTrans: true, //是否需要翻译数据字典
        transParams: ["dic_addressType"], //查找数据字典所需参数
        transDict: ["type"], //翻译前后key
      };
      params = Object.assign(params, this.config, this.queryFormObj);
      this.getTableList(
        "/nonfi/nonfinanceService/BSS.IQ.01.0002",
        params,
        (res) => {
          if (res.returnCode == "000000") {
            this.config.loading = false;
            this.showTable = true;
            if (
              res.returnData &&
              res.returnData.rows &&
              res.returnData.rows.length > 0
            ) {
              let rows = res.returnData.rows;
              this.tableData = rows;
              this.config.total = res.returnData.totalCount;
            } else {
              this.tableData = [];
              this.config.total = 0;
            }
          } else {
            this.showTable = false;
          }
        }, (err) => {
            if(err) {
                this.tableData = [];
                this.config.total = 0;
                this.config.loading = false;
            }
        })
    },
    handleSearch() {
      if (
        !this.queryFormObj.externalIdentificationNo &&
        !this.queryFormObj.idType &&
        !this.queryFormObj.idNumber
      ) {
        this.$message({
          message: "请输入查询信息",
          type: "warning",
        });
        this.init();
      } else {
        this.config.pageNum = 1;
        if (this.queryFormObj.idType) {
          if (!this.queryFormObj.idNumber) {
            this.$message({
              message: "请输入证件号码",
              type: "warning",
            });
          } else {
            this.getCustBaseInfo();
          }
        } else if (this.queryFormObj.idNumber) {
          if (!this.queryFormObj.idType) {
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

    // 详情 按钮
    handleDetail(row) {
      this.accTreatDetail_dialog = true;
      this.accTreatDetailObj = Object.assign({}, row);
    },

    handleCreate() {
      this.dialogFormVisibleAdd = true;
      this.$nextTick(() => {
        this.$refs["refAdd"].clearValidate();
        // this.$refs['refAdd'].resetFields()
      });
    },
    // 地址类型 联动
    getType(val) {
      if (val == "4") {
        this.showGuarantDiv = true;
      } else {
        this.showGuarantDiv = false;
      }
    },
    createData() {
      this.$refs["refAdd"].validate((valid) => {
        if (valid) {
          if (this.tempAdd.type == "4") {
            // 担保人
            if (!this.tempAdd.guarantorCertType) {
              this.$message({
                title: "提示",
                message: "请输入担保人证件类型",
                type: "warning",
                duration: 2000,
              });
              return;
            }
            if (!this.tempAdd.guarantorCertNo) {
              this.$message({
                title: "提示",
                message: "请输入担保人证件号码",
                type: "warning",
                duration: 2000,
              });
              return;
            }
          }

          let adrObj = {
            type: this.tempAdd.type,
            contactAddress: this.tempAdd.contactAddress,
            contactPostCode: this.tempAdd.contactPostCode,
            contactMobilePhone: this.tempAdd.contactMobilePhone,
            city: this.tempAdd.city,
            guarantorCertType: this.tempAdd.guarantorCertType,
            guarantorCertNo: this.tempAdd.guarantorCertNo,
          };
          let adrArr = [];
          adrArr.push(adrObj);
          let params = {
            coreCoreCustomerAddrs: adrArr,
          };
          params = Object.assign(params, this.baseInfoObj);
          this.post(
            "/nonfi/nonfinanceService/BSS.AD.01.0004",
            params,
            (res) => {
              if (res.returnCode == "000000") {
                this.dialogFormVisibleAdd = false;
                this.$notify({
                  title: "Success",
                  message: "新增成功",
                  type: "success",
                  duration: 2000,
                });
                this.getList();
              }
            }
          );
        }
      });
    },
    addClose() {
      this.dialogFormVisibleAdd = false;
      this.$nextTick(() => {
        this.$refs["refAdd"].clearValidate();
      });
      this.$refs["refAdd"].resetFields();
    },
    // 修改 按钮
    handleUpdate(row) {
      this.tempUp = Object.assign({}, row);
      this.dialogFormVisibleUp = true;
      this.$nextTick(() => {
        this.$refs["refUp"].clearValidate();
      });
    },
    // 确定 修改
    updateData() {
      this.$refs["refUp"].validate((valid) => {
        if (valid) {
          if (this.tempUp.type == "4") {
            // 担保人
            if (!this.tempUp.guarantorCertType) {
              this.$message({
                title: "提示",
                message: "请输入担保人证件类型",
                type: "warning",
                duration: 2000,
              });
              return;
            }
            if (!this.tempUp.guarantorCertNo) {
              this.$message({
                title: "提示",
                message: "请输入担保人证件号码",
                type: "warning",
                duration: 2000,
              });
              return;
            }
          }
          this.tempUp = Object.assign(this.tempUp, this.baseInfoObj);
          this.post(
            "/nonfi/nonfinanceService/BSS.UP.01.0002",
            this.tempUp,
            (res) => {
              if (res.returnCode == "000000") {
                this.dialogFormVisibleUp = false;
                this.$notify({
                  title: "Success",
                  message: "修改成功",
                  type: "success",
                  duration: 2000,
                });
                this.getList();
              }
            }
          );
        }
      });
    },
  },
};
</script>

<style>
.tdDivL {
  width: 65%;
}
.tdDivR {
  width: 30%;
}
.cl_tr label.el-form-item__label {
  width: 20%;
}
</style>

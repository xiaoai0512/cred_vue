<!-- 媒介信息绑定 -->
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
      <div class="text_title">客户媒介信息</div>
      <el-table
        v-loading="config.loading"
        :data="tableData"
        class="mbtm20"
        fit
        highlight-current-row
        style="width: 100%;"
        border
      >
        <el-table-column
          prop="externalIdentificationNo"
          label="外部识别号"
          align="center"
        />
        <el-table-column
          prop="mediaUnitCode"
          label="媒介单元代码"
          align="center"
          width="200"
        />
        <el-table-column
          prop="mediaObjectCode"
          label="媒介对象代码"
          align="center"
        />
        <el-table-column prop="expirationDate" label="有效期" align="center" />
        <el-table-column
          prop="mainSupplyIndicatorDesc"
          label="主附标识"
          align="center"
        />
        <el-table-column
          prop="invalidFlagDesc"
          label="有效标识"
          align="center"
        />
        <el-table-column prop="" label="操作" align="center">
          <template slot-scope="{ row }">
            <el-button size="mini" type="primary" @click="handleDetail(row)"
              >详情</el-button
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

    <div v-show="showInfo">
      <div class="text_title">客户媒介基本信息</div>
      <el-form :model="detailObj" ref="dataFormRef" :rules="dataFormRules">
        <el-form-item
          class="cl_td"
          label="外部识别号"
          prop="externalIdentificationNo"
        >
          <el-input
            v-model="detailObj.externalIdentificationNo"
            class="wd200"
            type="text"
            readonly
          />
        </el-form-item>
        <el-form-item class="cl_td" label="媒介单元代码" prop="mediaUnitCode">
          <el-input
            v-model="detailObj.mediaUnitCode"
            class="wd200"
            type="text"
            readonly
          />
        </el-form-item>
        <el-form-item class="cl_td" label="媒介对象代码" prop="mediaObjectCode">
          <el-input
            v-model="detailObj.mediaObjectCode"
            class="wd200"
            type="text"
            readonly
          />
        </el-form-item>
        <el-form-item class="cl_td" label="有效期" prop="expirationDate">
          <el-input
            v-model="detailObj.expirationDate"
            class="wd200"
            type="text"
            readonly
          />
        </el-form-item>
        <el-form-item class="cl_td" label="主附标识" prop="mainSupplyIndicator">
          <el-select
            v-model="detailObj.mainSupplyIndicator"
            class="wd200"
            disabled
          >
            <el-option
              v-for="(item, index) in mainSupplyIndicatorOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>

        <div class="text_title">媒介绑定</div>
        <el-form-item class="cl_td" label="绑定识别号" prop="bindId">
          <el-input v-model="detailObj.bindId" class="wd200" type="text" />
        </el-form-item>

        <div class="cl_tr text_center">
          <el-button
            size="medium"
            icon="el-icon-plus"
            type="primary"
            @click="suerBind()"
            >确定绑定</el-button
          >
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import Pagination from "@/components/Pagination";
export default {
  name: "MediaBind",
  components: {
    Pagination
  },
  data() {
    return {
      queryForm: {
        idType: "",
        idNumber: "",
        externalIdentificationNo: ""
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
      mainSupplyIndicatorOptions: [],

      showInfo: false,
      dataFormRef: {},
      dataFormRules: {},
      detailObj: {}
    };
  },
  created() {},
  mounted() {
    this.getSelectDict("dic_certificateType").then(res => {
      this.idTypeList = res;
    });
    // 主附标识
    this.getSelectDict("dic_mainAttachedFlag").then(res => {
      this.mainSupplyIndicatorOptions = res;
    });
  },
  methods: {
    init() {
      this.queryForm = {
        idType: "",
        idNumber: "",
        externalIdentificationNo: ""
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
          type: "warning"
        });
        this.init();
      } else {
        if (this.queryForm.idType) {
          if (!this.queryForm.idNumber) {
            this.$message({
              message: "请输入证件号码",
              type: "warning"
            });
          } else {
            this.getList();
          }
        } else if (this.queryForm.idNumber) {
          if (!this.queryForm.idType) {
            this.$message({
              message: "请输入证件类型",
              type: "warning"
            });
          } else {
            this.getList();
          }
        } else {
          this.getList();
        }
      }
    },
    // 查询列表 结息交易
    getList() {
      this.config.loading = true;
      let params = {
        externalIdentificationNo: this.queryForm.externalIdentificationNo,
        idType: this.queryForm.idType,
        idNumber: this.queryForm.idNumber,
        isTrans: true,
        transParams: ["dic_mainCharacterCardTable", "dic_invalidFlagYN"], //查找数据字典所需参数
        transDict: ["mainSupplyIndicator", "invalidFlag"] //翻译前
      };
      this.config = Object.assign(this.config, this.queryForm, params);
      this.getTableList(
        "/nonfi/nonfinanceService/BSS.IQ.01.0007",
        this.config,
        res => {
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
            }
          }
        }
      );
    },
    // 详情
    handleDetail(row) {
      this.detailObj = row;
      this.showInfo = true;
    },
    // 确定绑定
    suerBind() {
      let params = {
        mediaObjectCode: this.detailObj.mediaObjectCode,
        mediaUnitCode: this.detailObj.mediaUnitCode,
        externalIdentificationNo: this.detailObj.externalIdentificationNo,
        externalIdentificationNoOri: this.detailObj.externalIdentificationNo_ori
      };
      this.config = Object.assign(this.config, this.detailObj )
      this.post("/nonfi/nonfinanceService/BSS.AD.01.0005", this.config, res => {
        if (res.returnCode == "000000") {
          this.$notify({
            title: "Success",
            message: "绑定成功",
            type: "success",
            duration: 2000
          });
          // this.init()
        }
      });
    }
  }
};
</script>

<style></style>

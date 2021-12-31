<!-- 媒介毁损补发 -->
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
                <el-table-column prop="mediaObjectCode" label="媒介对象" align="center" width="180">
                    <template slot-scope="{row}">
                        {{row.mediaObjectCode}}
                        {{row.mediaObjectDesc}}
                    </template>
                </el-table-column>
                <el-table-column prop="productObjectCode" label="产品对象" align="center" width="190">
                    <template slot-scope="{row}">
                        {{row.productObjectCode}}
                        {{row.productDesc}}
                    </template>
                </el-table-column>
                <el-table-column prop="externalIdentificationNo" label="外部识别号" align="center" width="180"/>
                <el-table-column prop="mainSupplyIndicatorDesc" label="主附标识" align="center" />
                <el-table-column prop="mediaUserName" label="使用者姓名" align="center" />
                <el-table-column prop="invalidFlagDesc" label="有效标识" align="center" />
                <el-table-column prop="invalidReasonDesc" label="无效原因" align="center" />
            </el-table>
            <pagination v-show="config.total>0" :total="config.total" :page.sync="config.pageNum" :limit.sync="config.pageSize" @pagination="getList" />
        </div>
        <div v-show="showInfo">
            <media-info
                :formObj="mediaObj"
                :text_title ="text_title"
            ></media-info>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-check" type="primary" @click="suerHandle()">确定毁损补发</el-button>
            </div>
        </div>
    </div>
  </template>
  
  <script>
  import Pagination from "@/components/Pagination";
  import MediaInfo from '@/components-ider/cstSvc/MediaInfo'

  export default {
    name: "MediaDmgRsu",
    components: {
      Pagination,
      MediaInfo
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

        // 媒介信息
        baseInfoObj: {},
        curRow: {},
        curRowRadio: '',
        mediaObj: {},
        text_title: '媒介信息详情',
        showInfo: false,
        dataFormRef: {},
        dataFormRules: {},
        detailObj: {},

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
              this.getCustBaseInfo();
            }
          } else if (this.queryForm.idNumber) {
            if (!this.queryForm.idType) {
              this.$message({
                message: "请输入证件类型",
                type: "warning"
              });
            } else {
              this.getCustBaseInfo();
            }
          } else {
            this.getCustBaseInfo();
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
          transParams: ["dic_mainAttachedFlag", "dic_invalidFlagYN",'dic_invalidReason'], //查找数据字典所需参数
          transDict: ['mainSupplyIndicator', 'invalidFlag','invalidReason'] //翻译前
        };
        this.config = Object.assign(this.config, this.queryForm, params);
        this.getTableList( "/nonfi/nonfinanceService/BSS.IQ.01.0007", this.config, res => {
            if (res.returnCode == "000000") {
              this.showTable = true;
              this.config.loading = false;
              if ( res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                this.tableData = res.returnData.rows;
                this.config.total = res.returnData.totalCount;
              } else {
                this.tableData = [];
              }
            }
          }
        );
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
      handleCurrRowChange(row) {
        let _this = this
        this.curRow = row
        this.showInfo = true
        let params = {
            idType:	this.queryForm.idType,	
            idNumber:this.queryForm.idNumber,
            externalIdentificationNo: this.queryForm.externalIdentificationNo,
            mediaUnitCode: row.mediaUnitCode
        }
        this.post('/nonfi/nonfinanceService/BSS.IQ.01.0217', params, (res) => {
            if (res.returnCode == '000000') {
                if (res.returnData.rows && res.returnData.rows.length > 0) {
                    
                    let row = res.returnData.rows[0]
                    _this.mediaObj = Object.assign(_this.curRow, row)
                    _this.mediaObj.mediaObjectCodeTrans = _this.mediaObj.mediaObjectCode + _this.mediaObj.mediaObjectDesc
                    _this.mediaObj.productObjectCodeTrans = _this.mediaObj.productObjectCode + _this.mediaObj.productDesc
                    _this.mediaObj.productionCode = '3' //毁损补发制卡
                    _this.showInfo = true
                    
                } else {
                    _this.showInfo = false

                }
            }
        })

      },
      chooseCurrRow(row) {
        //   console.log(row)
          this.curRowRadio = row.mediaUnitCode
      },
      // 确定
      suerHandle() {
        if(this.mediaObj.invalidFlag== 'N' ){
            if(this.mediaObj.invalidReason == "DPAN") {
                this.$message({
                    message: "电子绑定卡",
                    type: "warning"
                });
            }else if(this.mediaObj.invalidReason == "TRF") {
                this.$message({
                    message: "该卡已经转卡",
                    type: "warning"
                });
            }else if(this.mediaObj.invalidReason == "EXP") {
                this.$message({
                    message: "该卡已经到期",
                    type: "warning"
                });
            }else if(this.mediaObj.invalidReason == "BRK") {
                this.$message({
                    message: "该卡已经毁损",
                    type: "warning"
                });
            }else if( this.mediaObj.invalidReason == "RNA") {
                this.$message({
                    message: "续卡未激活",
                    type: "warning"
                });
            }else if ( this.mediaObj.invalidReason == "CLS") {
                this.$message({
                    message: "该卡已经关闭",
                    type: "warning"
                });
            }else if( this.mediaObj.invalidReason == "PNA") {
                this.$message({
                    message: "提前续卡未激活",
                    type: "warning"
                });
            }else if( this.mediaObj.invalidReason == "CHP") {
                this.$message({
                    message: "产品升降级",
                    type: "warning"
                })
            }
            return;
        }
        this.mediaObj.invalidReason = 'BRK'
        this.mediaObj.operatorId = this.curRow.operatorId
        this.post("/nonfi/nonfinanceService/ISS.OP.01.0014", this.mediaObj, res => {
          if (res.returnCode == "000000") {
            this.$notify({
              title: "Success",
              message: "毁损补发成功",
              type: "success",
              duration: 2000
            });
            this.mediaObj = {}
          }
        });
      }
    }
  };
  </script>
  
  <style></style>
  
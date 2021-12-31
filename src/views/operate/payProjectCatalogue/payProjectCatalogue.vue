<!-- 收费目录 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="收费项目" prop="feeItemNo">
                <el-input v-model="queryFormObj.feeItemNo" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="费用类别" prop="feeType">
                <el-select v-model="queryFormObj.feeType" class="wd200" clearable>
                <el-option
                    v-for="(item, index ) in feeTypeOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.codes"
                />
                </el-select>
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" v-show="selBtnFlag">查询</el-button>
                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="reset" >重置</el-button>
            </div>
        </el-form>
        <el-table
            v-loading = "listLoading1"
            :data="tableList"
            class="mbtm20"
            fit
            highlight-current-row
            style="width: 100%;"
            border
        >
            <el-table-column prop="feeItemNo" label="收费项目" align="center" />
            <el-table-column prop="feeTypeDesc" label="费用类别" align="center" />
            <el-table-column prop="feeDesc" label="费用描述" align="center" />
            <el-table-column prop="instanCode1Desc" label="实例维度1" align="center" />
            <el-table-column prop="instanCode2Desc" label="实例维度2" align="center" />
            <el-table-column prop="" label="操作" align="center" width = "450">
                <template slot-scope="{row}">
                    <el-button size="mini" icon="el-icon-more" type="primary" @click="handleDetail(row)" v-show="selBtnFlag">详情</el-button>
                <el-button size="mini" icon="el-icon-search"   type="primary" @click="handleEVDetail(row)" v-show="selBtnFlag">查询事件</el-button>
                <el-button size="mini" icon="el-icon-search"   type="primary" @click="handleInDetail(row)" v-show="selBtnFlag">查询实例</el-button>
                <el-button size="mini" icon="el-icon-plus"   type="primary" @click="handleAddIntance(row)" v-show="addBtnFlag">新增实例</el-button>
                </template> 
            </el-table-column>
        </el-table>
        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
    
        
        <!-- 新增实例 -->
        <el-dialog title="新增实例" :visible.sync="dialogFormVisibleAdd" width="75%" :close-on-click-modal="false" >
            <pay-item-base-info ref="refAdd" 
                :formObj="tempAdd"
            ></pay-item-base-info>
            <cost-matrix-info 
                :formObj="tempAdd"
                :showMethod = "showMethod"
            ></cost-matrix-info>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleAdd = false">
                    取消
                </el-button>
                <el-button type="primary" @click="createData()">
                    确定
                </el-button>
            </div>
        </el-dialog>


        <!-- 详情 -->
        <el-dialog title="详情" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail" :rules="rulesDetail" :model="tempDetail" >
                <el-form-item class="cl_td" label="收费项目" prop="feeItemNo"
                :rules="[ { required: true, message: '收费项目代码不能为空'}]">
                    <el-input v-model="tempDetail.feeItemNo" class="wd200" type="text" />
                </el-form-item>

                <el-form-item class="cl_td" label="实例代码1" prop="instanCode1">
                    <el-select v-model="tempDetail.instanCode1" class="wd200" clearable  disabled>
                        <el-option
                        v-for="(item, index ) in instanceDimenOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="实例代码2" prop="instanCode2">
                    <el-select v-model="tempDetail.instanCode2" class="wd200" clearable  disabled>
                        <el-option
                        v-for="(item, index ) in instanceDimenOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="实例代码3" prop="instanCode3">
                    <el-select v-model="tempDetail.instanCode3" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in instanceDimenOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="实例代码4" prop="instanCode4">
                    <el-select v-model="tempDetail.instanCode4" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in instanceDimenOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="实例代码5" prop="instanCode5">
                    <el-select v-model="tempDetail.instanCode5" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in instanceDimenOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="项目用途" prop="itemUse">
                    <el-select v-model="tempDetail.itemUse" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in itemUseOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="费用事件编号" prop="feeEventNo">
                    <el-input v-model="tempDetail.feeEventNo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="费用描述" prop="feeDesc">
                    <el-input v-model="tempDetail.feeDesc" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="费用类别" prop="feeType">
                    <el-select v-model="tempDetail.feeType" class="wd200" clearable disabled>
                        <el-option
                            v-for="(item, index ) in feeTypeOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="生效日期" prop="effectiveDate">
                    <el-date-picker disabled
                        v-model="tempDetail.effectiveDate"
                        class="wd200"
                        type="date"
                        placeholder="选择日期"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyyMMdd"
                    />
                </el-form-item>
                <el-form-item class="cl_td" label="失效日期" prop="expirationDate">
                    <el-date-picker disabled
                        v-model="tempDetail.expirationDate"
                        class="wd200"
                        type="date"
                        placeholder="选择日期"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyyMMdd"
                    />
                </el-form-item>
                <el-form-item class="cl_td" label="周期类费用标识" prop="periodicFeeIdentifier">
                    <el-select v-model="tempDetail.periodicFeeIdentifier" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in periodicFeeIdentifierOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisibleDetail = false">
                关闭
            </el-button>
            </div>
        </el-dialog>

        <!-- 查询事件 -->
        <el-dialog title="查询事件" :visible.sync="dialogEvDetail" width="65%">
            <common-table 
                :tableData="ev_tableData" 
                :config="ev_config" 
                :tableLabel="ev_tableLabel" 
                @changePage="getEvList(evDetailObj)"
            ></common-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogEvDetail = false">
                    关闭
                </el-button>
            </div>
        </el-dialog>



        <!-- 查询实例 中 查询 -->
        <el-dialog title="查询实例详情" :visible.sync="in_dialogDetail" width="75%" :close-on-click-modal="false" >
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


        <!-- 查询实例 中 修改 -->
        <el-dialog title="查询实例修改" :visible.sync="in_dialogUpdate" width="85%" :close-on-click-modal="false" >
            <pay-item-base-info ref="refAdd" 
                :formObj="in_tempUpdate"
                :showChoseBtn="showChoseBtn"
                :showInstanDimen="showInstanDimen"
            ></pay-item-base-info>
            <cost-matrix-info 
                :formObj="in_tempUpdate"
                :showMethod = "showMethod"
            ></cost-matrix-info>
            <div slot="footer" class="dialog-footer">
                <el-button @click="in_dialogUpdate = false">
                    取消
                </el-button>
                <el-button type="primary" @click="in_sureUpdateData()">
                    确定
                </el-button>
            </div>
        </el-dialog>
        

        <!-- 查询实例 -->
        <el-dialog title="查询实例" :visible.sync="dialogInDetail" width="85%">
            <el-table
                v-loading = "in_config.loading"
                :data="in_tableData"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
            >
                <el-table-column prop="operationMode" label="运营模式" align="center" />
                <el-table-column prop="feeItemNo" label="收费项目" align="center" />
                <el-table-column prop="" label="费用收取维度1及描述" align="center" width = "280">
                    <template slot-scope="{row}">
                        <span class="tdDivL">{{row.instanCode1}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <span class="tdDivR">{{row.instanDesc1}}</span>
                    </template> 
                </el-table-column>
                <el-table-column prop="" label="费用收取维度2及描述" align="center" width = "280">
                    <template slot-scope="{row}">
                        <span class="tdDivL">{{row.instanCode2}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <span class="tdDivR">{{row.instanDesc2}}</span>
                    </template> 
                </el-table-column>
                <el-table-column prop="baseFee" label="基本费用" align="center" />
                <el-table-column prop="" label="操作" align="center" width = "220">
                    <template slot-scope="{row , $index}">
                        <el-button size="mini" type="primary" @click="intan_handleDetail(row)">查询</el-button>
                        <el-button size="mini" type="primary" @click="intan_handleUp(row, $index)">修改</el-button>
                        <el-button size="mini" type="primary" @click="intan_handleDele(row, $index)">删除</el-button>
                    </template> 
                </el-table-column>
            </el-table>
            <pagination v-show="in_config.total>0" :total="in_config.total" :page.sync="in_config.pageNum" :limit.sync="in_config.pageSize" @pagination="getInList(inDetailObj)" />
            
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogInDetail = false">
                    关闭
                </el-button>
            </div>
        </el-dialog>



        <!-- 修改 -->
        <el-dialog title="收费项目修改" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesAdd" :model="tempUp" >
                
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleUp = false">
                    取消
                </el-button>
                <el-button type="primary" @click="updateData()">
                    确定
                </el-button>
            </div>
        </el-dialog>

    
    
    </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import PayItemBaseInfo from "@/components-ider/operate/PayItemBaseInfo";
import CostMatrixInfo from "@/components-ider/operate/CostMatrixInfo";
import CommonTable from "@/components-ider/CommonTable";



export default {
  name: 'tableList',
  components: {
    Pagination,
    PayItemBaseInfo,
    CostMatrixInfo,
    CommonTable
  },
  data() {
    return {
      // 权限
      selBtnFlag: true,
      addBtnFlag: true,
      updBtnFlag: true,
      btnAuthStr: '',

      // 列表
      queryFormObj: {
          pageNum: 1,
          pageSize:10,
      },
      listLoading1: false,
      queryFormRef: {},
      queryFormRules: {},      
      tableList: [],
      tableTotal: 0,


      // 下拉框
      operationModeOptions: [],
      feeTypeOptions: [], 
      itemUseOptions: [],
      periodicFeeIdentifierOptions: [],
      instanceDimenOptions: [],
      
      
      // 增删改查
      tempAdd: {}, // 新增
      tempUp: {}, // 修改
      tempDetail: {}, // 详情
      dialogFormVisibleAdd: false,
      dialogFormVisibleUp: false,
      dialogFormVisibleDetail: false,
      refAdd: {},
      rulesAdd: {},
      rulesDetail: {},
      rulesUp: {},


      // 查询事件
        dialogEvDetail: false,
        evDetailObj: {},
        ev_tableData: [],
        ev_config: {
            pageNum: 1,
            pageSize: 10,
            loading: false,
            total: 0
        },
        ev_tableLabel: [
            {
            label: "事件编号",
            prop: "eventNo"
            },
            {
            label: "事件描述",
            prop: "eventDesc"
            },
            {
            label: "事件记账方向",
            prop: "eventBookKeepingDirec"
            }
        ],
    //   查询实例
        dialogInDetail: false,
        inDetailObj: {},
        in_tableData: [],
        in_config: {
            pageNum: 1,
            pageSize: 10,
            loading: false,
            total: 0
        },
        showChoseBtn: false,
        showInstanDimen:true,
       
        in_dialogDetail: false,
        in_dialogUpdate: false,
        in_tempDetail: {},
        in_tempUpdate: {},
        in_tempIndex: '',
        showMethod: true,

      //费用矩阵信息
      tempAdd1: {},

    }
  },
  created() {
    // this.getBtnAuth()
  },
  mounted() {
    this.getList()

    // 运营模式 
    this.getSelectDict( "/beta/betaService/COS.IQ.02.0006").then(res => {
        this.operationModeOptions = res
    })
    // 费用类别
    this.getSelectDict('dic_costCategory').then((res) => {
        this.feeTypeOptions = res
    })
    // 项目用途
    this.getSelectDict('dic_projectUse').then((res) => {
        this.itemUseOptions = res
    })
    // 周期类费用标识
    this.getSelectDict('dic_periodArray').then((res) => {
        this.periodicFeeIdentifierOptions = res
    }) 
    // 维度取值
    this.getSelectDict('dic_instanceDimension').then((res) => {
        this.instanceDimenOptions = res
    }) 	
  },
  methods: {
    // 查询按钮权限
    getBtnAuth() {
        console.log(window.sessionStorage.getItem('menuNo'))
        let params= {
            menuNo : window.sessionStorage.getItem('menuNo')
        }
        this.getTableList('/beta/betaService/COS.CS.01.0030', params ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.length > 0 ) {
                    res.returnData.forEach(item => {
                        this.btnAuthStr += item.eventNo+','
                    })
                    if (this.btnAuthStr.includes('COS.IQ.02.0031')) { // 查询
                        this.selBtnFlag = true
                    } else {
                        this.selBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.AD.02.0018')) { // 新增
                        this.addBtnFlag = true
                    } else {
                        this.addBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.UP.02.0018')) { // 维护
                        this.updBtnFlag = true
                    } else {
                        this.updBtnFlag = false
                    }
                }
            }
        })
    },
    // 重置
    reset() {
        this.queryFormObj.feeType = ''
        this.queryFormObj.feeItemNo = ''
    },
    // 列表
    getList() {
        this.listLoading1 = true
        let obj = {
            isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_costCategory','dic_instanceDimension','dic_instanceDimension'],//查找数据字典所需参数
			transDict : ['feeType','instanCode1','instanCode2'],//翻译前后key
        }
        this.queryFormObj = Object.assign(obj, this.queryFormObj)
        this.getTableList('/beta/betaService/COS.IQ.02.0031', this.queryFormObj ,(res) => {
            if (res.returnCode == '000000') {
                this.listLoading1 = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.tableList = res.returnData.rows
                    this.tableTotal = res.returnData.totalCount
                } else {
                    this.tableList = []
                    this.tableTotal = 0
                }
            }
        }, (err) => {
      		this.tableList = []
            this.tableTotal = 0
       		this.listLoading1 = false
        })

    },
    handleSearch() {
        this.queryFormObj.pageNum = 1
        this.getList()
    },

    handleCreate() {
        this.dialogFormVisibleAdd = true
      this.$nextTick(() => {
        this.$refs['dataFormAdd'].clearValidate()
      })
    }, 
    createData() {
        this.$refs.refAdd.submitForm().then((valid) => {
        // this.$refs['dataFormAdd'].validate((valid) => {
        if (valid) {
            if (
                this.tempAdd.feeItemNo == "LCHG025" &&
                (this.tempAdd.feeMatrixApplicationDimension == "" ||
                this.tempAdd.feeMatrixApplicationDimension == undefined ||
                this.tempAdd.feeMatrixApplicationDimension == "undefined")
            ) {
                this.$message({
                message: "请选择费用矩阵应用维度",
                type: "warning",
                duration: 2000
                });
                return;
            }
            if (
                this.tempAdd.feeMatrixApplicationDimension &&
                this.tempAdd.matrixAppMode
            ) {
                if (
                this.tempAdd.feeMatrixApplicationDimension == "2" &&
                this.tempAdd.matrixAppMode == "P"
                ) {
                this.$message({
                    message: "费用矩阵维度为天数时矩阵应用方式不允许设置超额累进",
                    type: "warning",
                    duration: 2000
                });
                return;
                }
            }
            if (this.tempAdd.instanDimen1) {
                if (!this.tempAdd.instanCode1) {
                this.$message({
                    message: "请选择实例代码1",
                    type: "warning",
                    duration: 2000
                });
                return;
                }
            }
            if (this.tempAdd.instanDimen2) {
                if (!this.tempAdd.instanCode2) {
                this.$message({
                    message: "请选择实例代码2",
                    type: "warning",
                    duration: 2000
                });
                return;
                }
            }
            if (this.tempAdd.instanDimen3) {
                if (!this.tempAdd.instanCode3) {
                this.$message({
                    message: "请选择实例代码3",
                    type: "warning",
                    duration: 2000
                });
                return;
                }
            }
            if (this.tempAdd.instanDimen4) {
                if (!this.tempAdd.instanCode4) {
                this.$message({
                    message: "请选择实例代码4",
                    type: "warning",
                    duration: 2000
                });
                return;
                }
            }
            if (this.tempAdd.instanDimen5) {
                if (!this.tempAdd.instanCode5) {
                this.$message({
                    message: "请选择实例代码5",
                    type: "warning",
                    duration: 2000
                });
                return;
                }
            }

            if (
                this.tempAdd.instanDimen1 == "FTYP" ||
                this.tempAdd.instanDimen2 == "FTYP" ||
                this.tempAdd.instanDimen4 == "FTYP" ||
                this.tempAdd.instanDimen4 == "FTYP" ||
                this.tempAdd.instanDimen5 == "FTYP"
            ) {
                if (!this.tempAdd.feeCollectType) {
                this.$message({
                    message: "请选择费用收取方式",
                    type: "warning",
                    duration: 2000
                });
                return;
                }
            } else {
                if (this.tempAdd.instanDimen1 == "FTYP") {
                if (this.tempAdd.instanCode1 != this.tempAdd.feeCollectType) {
                    this.$message({
                    message: "收取方式实例代码应与费用收取方式保持一致",
                    type: "warning",
                    duration: 2000
                    });
                    return;
                }
                }
                if (this.tempAdd.instanDimen2 == "FTYP") {
                if (this.tempAdd.instanCode2 != this.tempAdd.feeCollectType) {
                    this.$message({
                    message: "收取方式实例代码应与费用收取方式保持一致",
                    type: "warning",
                    duration: 2000
                    });
                    return;
                }
                }
                if (this.tempAdd.instanDimen3 == "FTYP") {
                if (this.tempAdd.instanCode3 != this.tempAdd.feeCollectType) {
                    this.$message({
                    message: "收取方式实例代码应与费用收取方式保持一致",
                    type: "warning",
                    duration: 2000
                    });
                    return;
                }
                }
                if (this.tempAdd.instanDimen4 == "FTYP") {
                if (this.tempAdd.instanCode4 != this.tempAdd.feeCollectType) {
                    this.$message({
                    message: "收取方式实例代码应与费用收取方式保持一致",
                    type: "warning",
                    duration: 2000
                    });
                    return;
                }
                }
                if (this.tempAdd.instanDimen5 == "FTYP") {
                if (this.tempAdd.instanCode5 != this.tempAdd.feeCollectType) {
                    this.$message({
                    message: "收取方式实例代码应与费用收取方式保持一致",
                    type: "warning",
                    duration: 2000
                    });
                    return;
                }
                }
            }

            if (this.tempAdd.feeFlag == "P") {
                if (this.tempAdd.feeRate1) {
                let pattern = /^[0-1](\.\d{1,9})?$/;
                if (!pattern.test(this.tempAdd.feeRate1)) {
                    this.$message({
                    message:
                        "请输入正确的费率(大于0小于1的数值及最多保留9位小数格式)",
                    type: "warning",
                    duration: 2000
                    });
                    return;
                }
                }
                if (this.tempAdd.feeRate2) {
                let pattern = /^[0-1](\.\d{1,9})?$/;
                if (!pattern.test(this.tempAdd.feeRate2)) {
                    this.$message({
                    message:
                        "请输入正确的费率(大于0小于1的数值及最多保留9位小数格式)",
                    type: "warning",
                    duration: 2000
                    });
                    return;
                }
                }
                if (this.tempAdd.feeRate3) {
                let pattern = /^[0-1](\.\d{1,9})?$/;
                if (!pattern.test(this.tempAdd.feeRate3)) {
                    this.$message({
                    message:
                        "请输入正确的费率(大于0小于1的数值及最多保留9位小数格式)",
                    type: "warning",
                    duration: 2000
                    });
                    return;
                }
                }
                if (this.tempAdd.feeRate4) {
                let pattern = /^[0-1](\.\d{1,9})?$/;
                if (!pattern.test(this.tempAdd.feeRate4)) {
                    this.$message({
                    message:
                        "请输入正确的费率(大于0小于1的数值及最多保留9位小数格式)",
                    type: "warning",
                    duration: 2000
                    });
                    return;
                }
                }
                if (this.tempAdd.feeRate5) {
                let pattern = /^[0-1](\.\d{1,9})?$/;
                if (!pattern.test(this.tempAdd.feeRate5)) {
                    this.$message({
                    message:
                        "请输入正确的费率(大于0小于1的数值及最多保留9位小数格式)",
                    type: "warning",
                    duration: 2000
                    });
                    return;
                }
                }
            }
          this.tempAdd.instanDimen1 = this.tempAdd.instanCode1
          this.tempAdd.instanDimen2 = this.tempAdd.instanCode2
          this.tempAdd.instanDimen3 = this.tempAdd.instanCode3
          this.tempAdd.instanDimen4 = this.tempAdd.instanCode4
          this.tempAdd.instanDimen5 = this.tempAdd.instanCode5
          this.tempAdd.instanCode1 = this.tempAdd.inCode1
          this.tempAdd.instanCode2 = this.tempAdd.inCode2
          this.tempAdd.instanCode3 = this.tempAdd.inCode3
          this.tempAdd.instanCode4 = this.tempAdd.inCode4
          this.tempAdd.instanCode5 = this.tempAdd.inCode5
        //   console.log(this.tempAdd)
        //   return
          this.post('/beta/betaService/COS.AD.02.0027', this.tempAdd, (res) => {
        
            if (res.returnCode == '000000') {
                this.dialogFormVisibleAdd = false
                this.$notify({
                title: 'Success',
                message: '新增成功',	
                type: 'success',
                duration: 2000
                })
                this.getList()
				this.tempAdd = {}
            }
            
          })
        }
      })
    },  
    handleDetail(row) {
        this.dialogFormVisibleDetail = true
      this.tempDetail = Object.assign({}, row) // 
      this.$nextTick(() => {
        this.$refs['dataFormDetail'].clearValidate()
      })
    },
    // 查询事件
    handleEVDetail(row) {
        this.dialogEvDetail = true
        this.evDetailObj = row
        this.getEvList(row)
    },
    // 查询实例
    handleInDetail(row) {
        this.dialogInDetail = true
        this.inDetailObj = row
        this.getInList(row)
    },
    // 事件list
    getEvList(row) {
        this.ev_config.loading = true
        let params = {
            feeItemNo: row.feeItemNo
        }
        this.ev_config = Object.assign(this.ev_config, params)
        this.getTableList('/beta/betaService/COS.IQ.02.0001', this.ev_config ,(res) => {
            if (res.returnCode == '000000') {
                this.ev_config.loading = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.ev_tableData = res.returnData.rows
                    this.ev_config.total = res.returnData.totalCount
                } else {
                    this.ev_tableData = []
                    this.ev_config.total = 0
                }
            }
        }, (err) => {
      		this.ev_tableData = []
            this.ev_config.total = 0
       		this.listLoading = false
        })
    },
    // 实例list
    getInList(row) {
        this.in_config.loading = true
        let params ={
            feeItemNo: row.feeItemNo
        }
        this.in_config =  Object.assign(this.in_config, params)
        this.getTableList('/beta/betaService/COS.IQ.02.0032', this.in_config ,(res) => {
            if (res.returnCode == '000000') {
                this.in_config.loading = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.in_tableData = res.returnData.rows
                    this.in_config.total = res.returnData.totalCount
                } else {
                    this.in_tableData = []
                    this.in_config.total = 0
                }
            }
        }, (err) => {
      		this.in_tableData = []
            this.in_config.total = 0
       		this.listLoading = false
        })
    },
    intan_handleDetail(row) {
        this.in_dialogDetail = true
        this.in_tempDetail = row
    },
    intan_handleUp(row, index) {
        this.in_dialogUpdate = true
        this.in_tempUpdate = row
        this.in_tempIndex = index
    },
    intan_handleDele(row) {
        this.$confirm('确定删除?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            let params = row
            params.feeItemInstanId = row.id
            this.post('/beta/betaService/COS.UP.02.0031', params ,(res) => {
                if (res.returnCode == '000000') {
                    this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.getInList(row)
                }
            })
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    },
    in_sureUpdateData() {
        this.in_dialogUpdate = false;
        this.$set(
            this.in_tableData,
            this.in_tempIndex,
            this.in_tempUpdate
        );
    },

    handleUpdate(row) {
        this.tempUp = Object.assign({}, row)
      this.dialogFormVisibleUp = true
      this.$nextTick(() => {
        this.$refs['dataFormUp'].clearValidate()
      })
    }, 
    updateData() {
        this.$refs['dataFormUp'].validate((valid) => {
            if (valid) {
              
                this.post('/beta/betaService/COS.UP.02.0037', this.tempUp, (res) => {
                     if (res.returnCode == '000000') {
                         this.dialogFormVisibleUp = false
                        this.$notify({
                        title: 'Success',
                        message: '修改成功',
                        type: 'success',
                        duration: 2000
                        })
                        this.getList()
                        this.tempUp = {}
                    }
                })
            }
        })
    },

    // 新增实例
    handleAddIntance(row){
        this.tempAdd = row
        this.dialogFormVisibleAdd = true
    },
    
    
  }
}
</script>

<style>
</style>

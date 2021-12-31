<!-- ：客户账户视图 -->
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
		<!-- 余额单元详情 -->
        <div v-show="showDetail">
            <div class="text_title">账户余额单元信息</div>
            <el-form :model="unitObj">
                <el-form-item class="cl_td bnone" label="账号" prop="accountId">
                    <el-input v-model="unitObj.accountId" class="wd300" type="text" />
                </el-form-item>
                <el-form-item class="cl_td bnone" label="余额单元代码" prop="balanceUnitCode">
                    <el-input v-model="unitObj.balanceUnitCode" class="wd300" type="text" />
                </el-form-item>
                <el-form-item class="cl_td bnone" label="余额" prop="balance">
                    <el-input v-model="unitObj.balance" class="wd300" type="text" />
                </el-form-item>
                <el-form-item class="cl_td bnone" label="币种" prop="currencyCode">
                    <el-input v-model="unitObj.currencyCode" class="wd300" type="text" />
                </el-form-item>
            </el-form>
            <div class="text_title">交易单元信息</div>
            <v-table
                :tableData="unit_tableData"
                :tableLabel="unit_tableLabel"
                :config="unit_config"
                :btns="unit_btns"
                @changePage="getUnitList(unitObj)">
            </v-table>
            <div class="text_title">交易单元计息信息</div>
            <v-table
                :tableData="interest_tableData"
                :tableLabel="interest_tableLabel"
                :config="interest_config"
                :btns="interest_btns"
                @changePage="getInterestList(unitObj)" >
            </v-table>
        </div>
		<!-- 账户列表 弹窗 -->
        <el-dialog title="账户列表" :visible.sync="accList_dialog"  width="85%">
            <div class="text_title">选择账户</div>
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
                :tree-props="{ children: 'children', hasChildren: 'haveChild' }">
                <el-table-column prop="accountId" label="账户代码" align="center" width="230" />
                <el-table-column prop="currencyDescp" label="币种" align="center" />
                <el-table-column prop="businessTypeDescp" label="所属业务类型" align="center" width="220" />
                <el-table-column prop="productObjectCode" label="产品对象代码" align="center" width="220" />
                <el-table-column prop="accountOrganFormDesc" label="账户组织形式" align="center" />
                <el-table-column prop="businessDebitCreditCodeDesc" label="账户性质" align="center" />
                <el-table-column prop="statusCodeDesc" label="状态码" align="center" />
                <el-table-column prop="" label="操作" align="center">
                    <template slot-scope="scope">
                        <el-button size="mini" type="primary"
                            @click="handleUint(scope.row)">查询余额单元</el-button>
                    </template> 
                </el-table-column>
            </el-table>
            <pagination
                v-show="config.total > 0"
                :total="config.total"
                :page.sync="config.pageNum"
                :limit.sync="config.pageSize"
                @pagination="getAccList"/>
            <div class="text_title">选择余额单元</div>
            <el-table
                v-loading="config2.loading"
                :data="tableData2"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%"
                border
                @current-change="handleList2Change"
                @row-click="chooseList2">   
                <el-table-column width="55" label="选择" align="center">
                    <template slot-scope="scope">
                    	 <el-radio v-model="curRowRadio2" :label="scope.row.balanceUnitCode">
                    	 	<span class="el-radio__label"> </span>
                    	 </el-radio>
	                </template>
                </el-table-column>
                <el-table-column prop="balanceUnitCode" label="余额单元代码" align="center" />
                <el-table-column prop="" label="币种" align="center" >
                    <template slot-scope="{row}">
                        {{row.currencyCode}}
                        {{row.currencyDesc}}
                    </template>
                </el-table-column>
               	<el-table-column prop="cycleNumber" label="周期号" align="center" />
                <el-table-column prop="balanceObjectCode" label="余额对象" align="center"  />
                <el-table-column prop="balanceTypeDesc" label="余额类型" align="center" />
                <el-table-column prop="balance" label="余额" align="center"/>
                <el-table-column prop="annualInterestRate" label="计息年利率" align="center" />
                <el-table-column prop="accumulatedInterest" label="累计利息" align="center" />
                <el-table-column prop="currentMinPayment" label="当期最低还款" align="center"  />
            </el-table>
            <pagination v-show="config2.total > 0" :total="config2.total" :page.sync="config2.pageNum" :limit.sync="config2.pageSize" @pagination="getList2" />
			<div slot="footer" class="dialog-footer">
                <el-button @click="accList_dialog = false">关闭 </el-button>
                <el-button type="primary" @click="sureAccBtn">确认 </el-button>
            </div>
        </el-dialog>
    </div>
  </template>
  <script>
import Pagination from '@/components/Pagination'
import VTable from "@/components-ider/VTable";
	export default {
    name: 'OccurrAmtTransQuery',
    components: {
      	Pagination,
      	VTable,
    },
    data() {
      return {
        queryForm: {
            externalIdentificationNo: '',
        },
        customerName: '',
        // 下拉框
        idTypeList: [],
       	// 账户列表
        accList_dialog: false,
        accFlag: '', // 记录选择的账户类型
        showDetail: false,
        // 账户表
        config: {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0,
        },
        tableData: [],
        curRowRadio: "",
        curRow: {},
        // 余额单元
        dataList: {},
        config2: {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0,
        },
        tableData2: [],
        curRowRadio2: "",
        curRow2: {},
        // 账户余额单元信息
        unitObj: {},
        // 交易单元计息信息
        unit_config: {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0,
        },
        unit_tableData: [],
        unit_tableLabel:[
            {
                label: "余额单元代码",
                prop: "balanceUnitCode",
            },{
                label: "节点类别",
                prop: "nodeTypDesc",
            },{
                label: "起息日期",
                prop: "interestStartDate",
            },{
                label: "入账日期",
                prop: "createDate",
            },{
                label: "发生金额",
                prop: "occurrAmount",
            }
        ],
        unit_btns: [],
        // 交易单元计息信息
        interest_config: {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0,
        },
        interest_tableData: [],
        interest_tableLabel:[
            {
                label: "余额单元代码",
                prop: "balanceUnitCode",
            },{
                label: "节点类别",
                prop: "nodeTypDesc",
            },{
                label: "节点状态",
                prop: "nodeStatusDesc",
            },{
                label: "结息日期",
                prop: "occurrDate",
            },{
                label: "金额",
                prop: "currInterestAmount",
            }
        ],
        interest_btns: [],
        
      	}
    },
    created() {
        this.init()
    },
    mounted() {
      	this.getSelectDict('dic_certificateType').then((res) => {
        	this.idTypeList = res
      	})
    	// 核算状态
      	this.getSelectDict('/beta/betaService/COS.IQ.02.0051').then((res) => {
	        res.forEach(item => {
	            item.labelDesc = item.accountingStatus+ ' '+ item.accountingDesc
          	})
	        this.accountingStatusCodeOptions = res
      	})
      	// 信贷交易类型
      	this.getSelectDict('dic_loanType').then((res) => {
        	this.loanTypeOptions = res
      	})
      	// 币种
      	this.getSelectDict('/beta/betaService/COS.IQ.02.0012').then((res) => {
        	this.currencyCodeOptions = res
      	})
      	// 还款方式
      	this.getSelectDict('dic_repaymentMethod').then((res) => {
        	this.repayModeOptions = res
      	})
	},
    methods: {
        init() {
            this.queryForm = {
                idType : '',
                idNumber: '',
                externalIdentificationNo: '',
            }
            this.showDetail = false;
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
              		this.getAccList()
              	}
          	} else if (this.queryForm.idNumber) {
	            if (!this.queryForm.idType) {
		              	this.$message({
			                message: '请输入证件类型',
			                type: 'warning'
		              	})
		            } else {
		              	this.getAccList()
		            }
          	} else {
           	 	this.getAccList()
           	}
    	}
 	},
	// 获取账户列表
    getAccList () {
        this.accList_dialog = true
        this.config.loading = true;
        this.tableData2 = []
        this.curRowRadio2 = ''
        let params = {
            idType : this.queryForm.idType,
            idNumber : this.queryForm.idNumber,
            externalIdentificationNo: this.queryForm.externalIdentificationNo,
            pageFlag : 'mainPage',
            isTrans: true, //是否需要翻译数据字典
            transParams: [  "dic_accountOrganForm", "dic_businessDebitCreditCode", "dic_accStatusCode"], //查找数据字典所需参数
            transDict: [ "accountOrganForm", "businessDebitCreditCode", "statusCode"], //翻译前后key
        };
        params = Object.assign(params, this.config);
        this.getTableList( "/nonfi/nonfinanceService/BSS.IQ.01.0118", params, (res) => {
            if (res.returnCode == "000000") {
                this.config.loading = false;
                if ( res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    let rows = res.returnData.rows;
                    rows.forEach((element) => {
                        element.haveChild = true;
                        element.currencyDescp = element.currencyCode + element.currencyDesc
                        element.businessTypeDescp = element.businessTypeCode + element.businessDesc

                    });
                    this.tableData = rows;
                    this.config.total = res.returnData.totalCount;
                } else {
                    this.tableData = [];
                    this.config.total  = 0 
                }
            }
        });
    },
    // 账户表子账户 查询
    loadTable (tree, treeNode, resolve) {
      setTimeout(() => {
        let params1 = {
            accFlag : 'mainAcc',
            accountOrganForm: tree.accountOrganForm,
            globalTransSerialNo: tree.globalTransSerialNo,	
            productObjectCode:  tree.productObjectCode,	
            businessProgramCode:  tree.businessProgramCode,	
            businessTypeCode: tree.businessTypeCode,		
            customerNo: tree.customerNo,         		
            currencyCode: tree.currencyCode,
        };
        params1 = Object.assign(params1, this.queryForm);
        let childList = [];
        this.getTableList( "/nonfi/nonfinanceService/BSS.IQ.01.0118", params1,  (res) => {
            if (res.returnCode == "000000") {
              if ( res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
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
    // 查询余额单元 按钮
    handleUint(row) {
    	this.dataList.accountId = row.accountId,
        this.dataList.currencyCode = row.currencyCode,
    	this.dataList.operationMode = row.operationMode
    	this.getList2()
    },
    // 余额单元列表
   getList2() {
      	this.config2.loading = true;
        let params = {
            idType : this.queryForm.idType,
            idNumber : this.queryForm.idNumber,
            externalIdentificationNo: this.queryForm.externalIdentificationNo,
            operationMode: this.dataList.operationMode,
            accountId: this.dataList.accountId,
            currencyCode: this.dataList.currencyCode,
            isTrans: true,
            transParams: ['dic_balanceType'],
            transDict: ['balanceType'],
        };
        params = Object.assign(params, this.config2);
        this.getTableList( "/nonfi/nonfinanceService/BSS.IQ.01.0030", params, (res) => {
            if (res.returnCode == "000000") {
                this.config2.loading = false;
                if ( res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.tableData2 = res.returnData.rows;
                   // this.tableData2 = rows;
                    this.config2.total = res.returnData.totalCount;
                } else {
                    this.tableData2 = [];
                    this.config2.total  = 0 
                }
            }
        });
    },
	// 余额单元 选中
    handleList2Change(val) {
        this.curRow2 = val
        this.curRowRadio2 = val.balanceUnitCode
    },
    chooseList2(val) {
        this.curRow2 = val
        this.curRowRadio2 = val.balanceUnitCode
    },
	// 确定账户
    sureAccBtn() {
        if (!this.curRow2) { // 没有选择余额单元
            this.$message({
                message: '是否查看余额单元',
                type: 'warning'
            })
        }
        this.unitObj = Object.assign({}, this.curRow2)
        this.showDetail = true
        this.accList_dialog = false
        this.getUnitList(this.curRow2)
        this.getInterestList(this.curRow2)

    },
    // 交易单元信息
    getUnitList(obj) {
        this.unit_config.loading = true;
        let params = {
            idType: this.queryForm.idType,
            idNumber: this.queryForm.idNumber,
            externalIdentificationNo: this.queryForm.externalIdentificationNo,
            balanceUnitCode: obj.balanceUnitCode,
        }
        this.getTableList( "/nonfi/nonfinanceService/BSS.IQ.01.0050", params, (res) => {
            if (res.returnCode == "000000") {
                this.unit_config.loading = false;
                if ( res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    let rows = res.returnData.rows;
                    rows.forEach(item => {
                        // 节点类别
                        if (item.nodeTyp == 'DR') {
                            item.nodeTypDesc = '借方节点'
                        } else if (item.nodeTyp == 'CR') {
                            item.nodeTypDesc = '贷方节点'
                        } else if (item.nodeTyp == 'PY') {
                            item.nodeTypDesc = '还款节点'
                        } else if (item.nodeTyp == 'NI') {
                            item.nodeTypDesc = 'NETIN节点'
                        } else if (item.nodeTyp == 'RV') {
                            item.nodeTypDesc = '还款还原节点'
                        } else if (item.nodeTyp == 'NO') {
                            item.nodeTypDesc = 'NETOUT节点'
                        } else if (item.nodeTyp == 'CB') {
                            item.nodeTypDesc = '回算节点'
                        }
                    })
                    this.unit_tableData = rows;
                    this.unit_config.total = res.returnData.totalCount;
                } else {
                    this.unit_tableData = [];
                    this.unit_config.total = 0

                }
            }
        });
    },
    // 交易单元计息信息
    getInterestList(obj) {
        this.interest_config.loading = true;
        let params = {
            idType: this.queryForm.idType,
            idNumber: this.queryForm.idNumber,
            externalIdentificationNo: this.queryForm.externalIdentificationNo,
            balanceUnitCode: obj.balanceUnitCode,
            currencyCode: obj.currencyCode,
            accountId: obj.accountId
        }
        this.getTableList( "/nonfi/nonfinanceService/BSS.IQ.01.0060", params, (res) => {
            if (res.returnCode == "000000") {
                this.interest_config.loading = false;
                if ( res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    let rows = res.returnData.rows;
                    rows.forEach(item => {
                        // 节点类别
                        if (item.nodeTyp == 'WI') {
                            item.nodeTypDesc = '免息'
                        } else if (item.nodeTyp == 'BI') {
                            item.nodeTypDesc = '结息'
                        } else if (item.nodeTyp == 'DI') {
                            item.nodeTypDesc = '动态结息'
                        } else if (item.nodeTyp == 'VI') {
                            item.nodeTypDesc = '差额计息'
                        } 
                        // 节点状态
                        if (item.nodeStatus == 'W0') {
                            item.nodeStatusDesc = '有效'
                        } else if (item.nodeStatus == 'W1') {
                            item.nodeStatusDesc = '无效'
                        } else if (item.nodeStatus == 'B0') {
                            item.nodeStatusDesc = '正常结息'
                        } else if (item.nodeStatus == 'B1') {
                            item.nodeStatusDesc = '零余额结息'
                        }  else if (item.nodeStatus == 'B9') {
                            item.nodeStatusDesc = '需重计利息'
                        } 
                    })
                    this.interest_tableData = rows;
                    this.interest_config.total = res.returnData.totalCount;
                } else {
                    this.interest_tableData = [];
                    this.interest_config.total = 0

                }
            }
        });

    },


     
   
    }
  }
  </script>
  
  <style>
  </style>
  
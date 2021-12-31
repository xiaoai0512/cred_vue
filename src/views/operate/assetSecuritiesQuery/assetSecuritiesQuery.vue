<!-- 资产证券化查询 -->
<template>
    <div class="allContent">
        <el-form :model="queryForm">
             <el-form-item class="cl_td" label="运营模式" prop="operationMode">
                <el-select v-model="queryForm.operationMode" class="wd200">
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.operationMode"/>
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="证件类型" prop="idType">
                <el-select v-model="queryForm.idType" class="wd200">
                <el-option v-for="(item, index) in idTypeList" :key="index" :label="item.detailDesc" :value="item.codes" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                <el-input v-model="queryForm.externalIdentificationNo" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="证件号码" prop="idNumber">
                <el-input v-model="queryForm.idNumber" class="wd200" type="text" />
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()">查询</el-button>
                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="reset()">重置</el-button>
            </div>
        </el-form>
        <!-- 循环账户信息表-->
        <div v-if="showLoop">
            <div class="text_title">循环账户信息表</div>
            <el-table v-loading="config1.loading" :data="tableData1" class="mbtm20" fit highlight-current-row style="width: 100%" border row-key="id" 
                lazy :load="loadTable1" :tree-props="{ children: 'children', hasChildren: 'haveChild' }" >
                <el-table-column prop="accountId"  label="账户代码"  align="center" width="230" />
                <el-table-column prop="currencyDesc" label="币种" align="center" />
                <el-table-column prop="" label="业务项目 /子账户类型" align="center" width="220" >
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
                <el-table-column  prop="" label="业务类型 / 类型代码及描述"  align="center"  width="220" >
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
                <el-table-column prop="productObjectCode" label="产品对象代码" align="center"width="200">
                    <template slot-scope="{ row }"> {{ row.productObjectCode }} {{ row.productDesc }}</template>
                </el-table-column>
                <el-table-column  prop="accountOrganFormDesc" label="账户组织形式" align="center" />
                <el-table-column prop="businessDebitCreditCodeDesc" label="账户性质"  align="center"  />
                <!--<el-table-column prop="statusCodeDesc" label="状态码" align="center" />-->
                <el-table-column prop="accountingStatusCode" label="核算状态" align="center" />
                <el-table-column prop="fundNum" label="资金法人ID" align="center" />
                <el-table-column prop="capitalOrganizationName" label="资金法人名称" align="center" />
                <el-table-column prop="absPlanId" label="ABS计划号" align="center" />
                <el-table-column prop="capitalStage" label="ABS计划阶段" align="center" />
                <el-table-column prop="accountTypeDesc" label="ABS资产类型" align="center" />
			</el-table>
            <pagination  v-show="total1 > 0" :total="total1" :page.sync="config1.pageNum"  :limit.sync="config1.pageSize" @pagination="getList1" />
        </div>
        <div v-if="showTrade">
           <div class="text_title">交易账户信息表</div>
            <el-table v-loading="config2.loading" :data="tableData2" class="mbtm20" fit  highlight-current-row style="width: 100%"
                border  row-key="id"  lazy  :load="loadTable2" :tree-props="{ children: 'children', hasChildren: 'haveChild' }">   
                <el-table-column prop="businessTypeCode" label="业务类型" align="center" width="200"/>
                <el-table-column prop="accountId" label="账户代码" align="center"  width="230" />
                <el-table-column prop="loanAmount" label="信贷金额" align="center" />
                <el-table-column prop="remainPrincipalAmount" label="未抛金额" align="center" />
                <el-table-column prop="currentTotalBalance" label="当前总余额" align="center" />
                <el-table-column prop="currencyCode" label="币种" align="center" />
                <el-table-column prop="loanTerm" label="贷款期数" align="center" />
                <el-table-column prop="startIntDate" label="起始日" align="center" width='100'/>
                <el-table-column prop="accountingStatusCode" label="核算状态" align="center" />
                <el-table-column prop="fundNum" label="资金法人ID" align="center" />
                <el-table-column prop="capitalOrganizationName" label="资金法人名称" align="center" />
                <el-table-column prop="absPlanId" label="ABS计划号" align="center" />
                <el-table-column prop="capitalStage" label="ABS计划阶段" align="center" />
                <el-table-column prop="accountTypeDesc" label="资产类型" align="center" />
            </el-table>
            <pagination v-show="total2 > 0" :total="total2" :page.sync="config2.pageNum" :limit.sync="config2.pageSize" @pagination="getList2" />
        </div>
    </div>
</template>
  
  <script>
import Pagination from '@/components/Pagination'
import VTable from "@/components-ider/VTable";
import BalanceUnitlDetail from "@/components-ider/cstSvc/BalanceUnitlDetail";
import AccCycleFinDetail from "@/components-ider/cstSvc/AccCycleFinDetail";
import DisputeAccInfo from "@/components-ider/cstSvc/DisputeAccInfo";
import TransInfo from '@/components-ider/cstSvc/TransInfo'
import VisaInfo from '@/components-ider/cstSvc/VisaInfo'
import MccInfo from '@/components-ider/cstSvc/MccInfo'
    export default {
        name: 'AccFinancialInfThree',
        components: {
          Pagination,
          VTable,
          BalanceUnitlDetail, // 余额单元明细
          AccCycleFinDetail, // 账户周期金融明细
          DisputeAccInfo, // 争议账户 
          TransInfo, // 账户详细信息
          VisaInfo, // VisaInfo
          MccInfo, // mcc
    },
    data() {
        return {
            queryForm: {
                externalIdentificationNo: '',
                idType: '',
                idNumber: '',
                planId: '',
                type: '',
            },
            newAccountType: '',
            planIdList: [],
            customerName: '',
            // 下拉框
            idTypeList: [],//证件类型
            operationModeOptions: [],//运营模式
            // 账户列表
            showLoop: false,//显示隐藏循环账户表
            accList_dialog: false,
            // 循环账户信息表
            config1: {
                loading: false,
                pageNum: 1,
                pageSize: 10,
            },
            total1: 0,
            tableData1: [],
            //交易账户信息表
            showTrade: false,   //显示隐藏交易账户信息表
            transferOut_dialog: false,
            tableData2: [],
            config2: {
                loading: false,
                pageNum: 1,
                pageSize: 10,
                
            },
            total2: 0,
            
        }
    },
    created() {
        this.init()
    },
    mounted() {
        //证件类型
        this.getSelectDict('dic_certificateType').then((res) => {
            this.idTypeList = res
        })
        //运营模式
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0006").then(res => {
            this.operationModeOptions = res
        })
        
    },
    methods: {
        init() {
            this.queryForm = {
                externalIdentificationNo: '',
                idType: '',
                idNumber: '',
                planId: '',
                type: '',
            }
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
            this.config1.pageNum = 1
            this.config2.pageNum = 1
            if (this.queryForm.idType) {
                if (!this.queryForm.idNumber) {
                    this.$message({
                        message: '请输入证件号码',
                        type: 'warning'
                    })
                } else {
                    this.getList1()
                    this.getList2()
                }
            } else if (this.queryForm.idNumber) {
                if (!this.queryForm.idType) {
                    this.$message({
                        message: '请输入证件类型',
                        type: 'warning'
                    })
                } else {
                  this.getList1()
                  this.getList2()
                }
            } else {
                this.getList1()
                this.getList2()
            }
        }
      },
    //循环账户信息表
    getList1() {
        this.showLoop = true
        this.config1.loading = true;
        let params = {
            accountOrganForm: "R", //循环账户
            accountType: this.newAccountType,
            flag: "N", //输入该客户下任意卡号应都可以查询到该客户的所有账户，但目前不可以
            pageFlag: "mainPage",
            planId: this.queryForm.planId,
            type: this.queryForm.type,
            externalIdentificationNo: this.queryForm.externalIdentificationNo,
            isTrans: true, //是否需要翻译数据字典
            transParams: ["dic_accountOrganForm", "dic_businessDebitCreditCode", "dic_accStatusCode", 'dic_assetAccType'], //查找数据字典所需参数
            transDict: [ "accountOrganForm","businessDebitCreditCode","statusCode",'accountType',] //翻译前后key
        };
        params = Object.assign(params, this.config, this.queryForm);
        this.getTableList("/nonfi/nonfinanceService/BSS.IQ.01.0350",params,(res) => {
            this.config1.loading = false;
            if (res.returnCode == "000000") {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                  let rows = res.returnData.rows;
                    rows.forEach((element) => {
                        element.haveChild = true;
                    });
                    this.tableData1 = rows;
                    if(this.tableData1.accountType=='B'){
                        this.tableData1.accountType = '不良资产'
                    }
                    this.total1 = res.returnData.totalCount;
                } else {
                    this.tableData = [];
                    this.total1 = 0
                }
              }
            }, (err) => {
                this.tableData = [];
                this.total1 = 0
                this.config1.loading = false;
            })
    },
    //交易账户信息表
    getList2() {
        this.showTrade = true
        this.config2.loading = true;
        let params = {
            accountOrganForm: "R", //循环账户
            accountType: this.newAccountType,
            flag: "N", //输入该客户下任意卡号应都可以查询到该客户的所有账户，但目前不可以
            pageFlag: "mainPage",
            planId: this.queryForm.planId,
            type: this.queryForm.type,
            externalIdentificationNo: this.queryForm.externalIdentificationNo,
            isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_assetAccType'],//查找数据字典所需参数
			transDict : ['accountType'],//翻译前后key
        };
        params = Object.assign(params, this.config2, this.queryForm);
        this.getTableList("/nonfi/nonfinanceService/BSS.IQ.01.0355", params,(res) => {
            this.config2.loading = false;
            if (res.returnCode == "000000") {
                if ( res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                    let rows = res.returnData.rows;
                    rows.forEach((element) => {
                        element.haveChild = true; 
                        
                    });
                    this.tableData2 = rows;
                    this.total2 = res.returnData.totalCount;
                } else {
                    this.tableData2 = [];
                    this.total2 = 0
                }
            }
        }, (err) => {
      		this.tableData2 = [];
            this.total2 = 0
       		this.config2.loading = false;
        })
    },
    // 循环账户信息表子账户 查询
    loadTable1(tree, treeNode, resolve) {
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
        this.getTableList("/nonfi/nonfinanceService/BSS.IQ.01.0350", params1,(res) => {
            if (res.returnCode == "000000") {
              	if ( res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                	childList = res.returnData.rows;
              	} else {
                	childList = [];
              	}
              	resolve(childList);
            }
      	});
      }, 1000);
    },
    // 交易账户信息 子账户 查询
    loadTable2(tree, treeNode, resolve) {
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
	        this.getTableList("/nonfi/nonfinanceService/BSS.IQ.01.0355",params1,(res) => {
	            if (res.returnCode == "000000") {
	              	if ( res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
	                	childList = res.returnData.rows;
	              	} else {
	                	childList = [];
	              	}
	              	resolve(childList);
	            }
          	});
      	}, 1000);
    },
    // 循环账户信息表
      	handleList1Change(row) {
          this.curRow = row
      	},
      	chooseList1(row) {
        	this.accFlag = 'revoleAcc'
          	this.curRowRadio = row.accountId
      	},
      	// 交易账户信息表
      	handleList2Change(row) {
          	this.curRow3 = row
      	},
      	chooseList2(row) {
        	this.accFlag = 'transAcc'
          	this.curRowRadio2 = row.accountId
      	},
    }
 }
  </script>
  
  <style>
  </style>
  
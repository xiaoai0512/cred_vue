<!-- 金融交易查询 -->
<template>
    <div class="allContent">
        <el-form :model="queryForm">
            <el-form-item class="cl_td" label="预算单位编码" prop="idNumber">
                 <el-input v-model="queryForm.idNumber" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                <el-input v-model="queryForm.externalIdentificationNo" class="wd200" type="text" />
            </el-form-item>
           	<el-form-item class="cl_td" label="起始时间" prop="startDate">
                <el-date-picker
                    v-model="queryForm.startDate"
                    class="wd200"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy 年 MM 月 dd 日"
                    :picker-options="pickerOptionsStart"
                    :clearable="true"
                    @change="changeStart"/>
            </el-form-item>
            <el-form-item class="cl_td" label="结束时间" prop="endDate">
                <el-date-picker
                    v-model="queryForm.endDate"
                    class="wd200"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyyMMdd"
             	 	:picker-options="pickerOptionsEnd"
                    :clearable="true"
                    @change="changeEnd"/>
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()">查询</el-button>
                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="reset()">重置</el-button>
            </div>
        </el-form>
        <!-- 公务卡交易信息根据外部识别号查询的表-->
        <div v-if="showLoop">
            <div class="text_title">公务卡交易信息44</div>
            <el-table v-loading="config1.loading" :data="tableData1" class="mbtm20" fit highlight-current-row style="width: 100%" border row-key="id" 
                lazy :load="loadTable1" :tree-props="{ children: 'children', hasChildren: 'haveChild' }" >
               	<el-table-column prop="externalIdentificationNo"  label="外部识别号"  align="center" width="230" />
                <el-table-column prop="transDate" label="交易日期" align="center" />
                <el-table-column prop="transAmount" label="交易金额" align="center" />
                <el-table-column prop="transCurrCde" label="交易币种" align="center" />
               	<el-table-column prop="transDesc" label="交易描述" align="center" width="200"/>
                <el-table-column prop="reimburseStatus" label="报销" align="center" />
                <el-table-column prop="merchantCde" label="商户代码"  align="center"  />
                <el-table-column prop="" label="操作" align="center" width="200px">
	                <template slot-scope="{row}">
		                <el-button size="mini" icon="el-icon-more" type="primary" @click="handleInfo(row)">查询</el-button>
		                <el-button size="mini" icon="el-icon-more" type="primary" @click="reimburse(row)">报销</el-button>
		                
		            </template >   
	            </el-table-column>
            </el-table>
            <pagination  v-show="total1 > 0" :total="total1" :page.sync="config1.pageNum"  :limit.sync="config1.pageSize" @pagination="getList1" />
        </div>
        <!--公务卡列表预算单位查询-->
        <div v-if="showTrade">
           	<div class="text_title">公务卡列表</div>
            <el-table v-loading="configBudget.loading" :data="tableList" class="mbtm20" fit  highlight-current-row style="width: 100%"
                border  row-key="id"  lazy  :load="loadTable2" >   
                <el-table-column prop="customerName" label="持卡人姓名" align="center" width="100" />
                <el-table-column prop="externalIdentificationNo" label="外部识别号" align="center"  width="230" />
                <el-table-column prop="idTypeDesc" label="证件类型" align="center" />
                <el-table-column prop="idNumber" label="证件号码" align="center" />
                <el-table-column prop="officialCardType" label="公务卡类型" align="center" />
                <el-table-column prop="invalidFlagDesc" label="有效标识" align="center" />
                <el-table-column prop="" label="操作" align="center" width="200px">
	                <template slot-scope="{row}">
		                <el-button size="mini" icon="el-icon-more" type="primary" @click="getList2(row)">查询</el-button>
		            </template >   
	            </el-table-column>
            </el-table>
            <pagination v-show="configBudget.total > 0" :total="configBudget.total" :page.sync="configBudget.pageNum" :limit.sync="configBudget.pageSize" @pagination="getBudgetList" />
        </div>
        <!-- 公务卡交易信息根据点击预算单位表查询按钮查询的表-->
        <div v-if="showBudget">
            <div class="text_title">公务卡交易信息333</div>
            <el-table v-loading="config2.loading" :data="tableData2" class="mbtm20" fit highlight-current-row style="width: 100%" border row-key="id" 
                lazy :load="loadTable2" :tree-props="{ children: 'children', hasChildren: 'haveChild' }" >
               	<el-table-column prop="externalIdentificationNo"  label="外部识别号"  align="center" width="230" />
                <el-table-column prop="transDate" label="交易日期" align="center" />
                <el-table-column prop="transAmount" label="交易金额" align="center" />
                <el-table-column prop="transCurrCde" label="交易币种" align="center" />
               	<el-table-column prop="transDesc" label="交易描述" align="center" width="200"/>
                <el-table-column prop="reimburseStatus" label="报销" align="center" />
                <el-table-column prop="merchantCde" label="商户代码"  align="center"  />
                <el-table-column prop="" label="操作" align="center" width="200px">
	                <template slot-scope="{row}">
		                <el-button size="mini" icon="el-icon-more" type="primary" @click="handleInfo(row)">查询</el-button>
		                <el-button size="mini" icon="el-icon-more" type="primary" @click="reimburse(row)">报销</el-button>
		            </template >   
	            </el-table-column>
            </el-table>
            <pagination  v-show="total2 > 0" :total="total2" :page.sync="config2.pageNum"  :limit.sync="config2.pageSize" @pagination="getList2" />
        </div>
        <!--查询详情&&公务卡交易信息表-->
        <el-dialog title="公务卡交易信息表" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail" :rules="rulesDetail" :model="tempDetail" >
                <el-form-item class="cl_td" label="事件编号 " prop="eventNo">
                    <el-input v-model="tempDetail.eventNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="活动编号 " prop="activityNo">
                    <el-input v-model="tempDetail.activityNo" class="wd200" type="text" readonly/>
                </el-form-item>
				<el-form-item class="cl_td" label="外部识别号 " prop="externalIdentificationNo">
                    <el-input v-model="tempDetail.externalIdentificationNo" class="wd200" type="text" readonly/>
                </el-form-item>
	            <el-form-item class="cl_td" label="账户号/余额单元号" prop="entityKey">
                    <el-input v-model="tempDetail.entityKey" class="wd200" type="text" readonly/>
                </el-form-item>
	            <el-form-item class="cl_td" label="交易日期 " prop="transDate">
                    <el-input v-model="tempDetail.transDate" class="wd200" type="text" readonly/>
                </el-form-item>
	            <el-form-item class="cl_td" label="入账时间  " prop="occurrDate">
                    <el-input v-model="tempDetail.occurrDate" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易币种 " prop="transCurrCde">
                    <el-input v-model="tempDetail.transCurrCde" class="wd200" type="text" readonly/>
                </el-form-item>
	            <el-form-item class="cl_td" label="交易金额 " prop="transAmount">
                    <el-input v-model="tempDetail.transAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="入账币种 " prop="postingCurrencyCode">
                    <el-input v-model="tempDetail.postingCurrencyCode" class="wd200" type="text" readonly/>
                </el-form-item>
	            <el-form-item class="cl_td" label="入账金额 " prop="postingAmount">
                    <el-input v-model="tempDetail.postingAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="清算币种  " prop="settlementCurrencyCode">
                    <el-input v-model="tempDetail.settlementCurrencyCode" class="wd200" type="text" readonly/>
                </el-form-item>
	            <el-form-item class="cl_td" label="清算金额 " prop="settlementAmount">
                    <el-input v-model="tempDetail.settlementAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="入账转换汇率 " prop="postingConvertRate">
                    <el-input v-model="tempDetail.postingConvertRate" class="wd200" type="text" readonly/>
                </el-form-item>
	            <el-form-item class="cl_td" label="交易描述 " prop="transDesc">
                    <el-input v-model="tempDetail.transDesc" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="余额类型  " prop="balanceType">
                    <el-input v-model="tempDetail.balanceType" class="wd200" type="text" readonly/>
                </el-form-item>
	            <el-form-item class="cl_td" label="客户号 " prop="customerNo">
                    <el-input v-model="tempDetail.customerNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="账户代码" prop="accountId">
                    <el-input v-model="tempDetail.accountId" class="wd200" type="text" readonly/>
                </el-form-item>
	            <el-form-item class="cl_td" label="交易状态  " prop="transState">
                    <el-input v-model="tempDetail.transState" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="业务类型代码" prop="businessTypeCode">
                    <el-input v-model="tempDetail.businessTypeCode" class="wd200" type="text" readonly/>
                </el-form-item>
	            <el-form-item class="cl_td" label="余额对象代码  " prop="balanceObjectCode">
                    <el-input v-model="tempDetail.balanceObjectCode" class="wd200" type="text" readonly/>
                </el-form-item>
                 <el-form-item class="cl_td" label="授权码  " prop="authCde">
                    <el-input v-model="tempDetail.authCde" class="wd200" type="text" readonly/>
                </el-form-item>
                 <el-form-item class="cl_td" label="来源码  " prop="sourceCde">
                    <el-input v-model="tempDetail.sourceCde" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易国家代码  " prop="transCountryCde">
                    <el-input v-model="tempDetail.transCountryCde" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易城市代码   " prop="transCityCde">
                    <el-input v-model="tempDetail.transCityCde" class="wd200" type="text" readonly/>
                </el-form-item>
            	<el-form-item class="cl_td" label="收单参考号  " prop="acquireReferenceNumbr">
                    <el-input v-model="tempDetail.acquireReferenceNumbr" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="渠道代码 " prop="channelCde">
                    <el-input v-model="tempDetail.channelCde" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="商户类别码" prop="mcc">
                    <el-input v-model="tempDetail.mcc" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="商户代码" prop="merchantCde">
                    <el-input v-model="tempDetail.merchantCde" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="全局流水号" prop="globalSerialNumbr">
                    <el-input v-model="tempDetail.globalSerialNumbr" class="wd200" type="text" readonly/>
                </el-form-item>
                <div class="clearboth"></div>
             	<div  class="cl_tr text_center">
	                <el-button type="primary" v-if="(tempDetail.eventNo=='ISS.PT.40.0001' || tempDetail.eventNo=='ISS.PT.40.0002'   || tempDetail.eventNo=='ISS.XT.00.0006' 
					 || tempDetail.eventNo=='ILS.XT.00.0001'  || tempDetail.eventNo=='ILS.XT.00.0003'  || tempDetail.eventNo=='ILS.XT.00.0004'  
					 || tempDetail.eventNo=='ILS.XT.00.0005') && tempDetail.transState == 'NOR'"
	                @click="allReturns(tempDetail)">全部退货</el-button>
	                <el-button type="primary" v-if="(tempDetail.eventNo=='ISS.PT.40.0001' || tempDetail.eventNo=='ISS.PT.40.0002'   || tempDetail.eventNo=='ISS.XT.00.0006' 
					 || tempDetail.eventNo=='ILS.XT.00.0001'  || tempDetail.eventNo=='ILS.XT.00.0003'  || tempDetail.eventNo=='ILS.XT.00.0004'  || tempDetail.eventNo=='ILS.XT.00.0005')
					 && (tempDetail.transState == 'NOR' || tempDetail.transState == 'PRT') "
	                	@click="partReturns(tempDetail)">部分退货</el-button>
	            </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleDetail = false">取消</el-button>
                <!-- <el-button type="primary" @click="getAddData()">确定</el-button> -->
            </div>
        </el-dialog>
        <!--部分退货弹框-->
        <!--查询详情&&公务卡交易信息表-->
        <el-dialog title="部分退货信息表" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp" >
                <el-form-item class="cl_td" label="原交易金额 " prop="transAmount">
                    <el-input v-model="tempUp.transAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="已退货金额 " prop="rejectedAmount">
                    <el-input v-model="tempUp.rejectedAmount" class="wd200" type="text" readonly/>
                </el-form-item>
				<el-form-item class="cl_td" label="退货金额 " prop="ecommTransPostingAmount">
                    <el-input v-model="tempUp.ecommTransPostingAmount" class="wd200" type="text"/>
                </el-form-item>
	        </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleUp = false">取消</el-button>
                <el-button type="primary" @click="getUpData()">部分退货</el-button>
            </div>
        </el-dialog>
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
            },
            newAccountType: '',
            planIdList: [],
            customerName: '',
            pickerOptionsStart: {}, //起始时间
       		pickerOptionsEnd:{}, // 结束时间
            // 下拉框
            idTypeList: [],//证件类型
            operationModeOptions: [],//运营模式
            // 公务卡列表&&外部识别号查询的表
        	curRowRadio: "",
        	showLoop: false,//显示隐藏公务卡列表
            newMediaUnitCode1: '',
            config1: {
                loading: false,
                pageNum: 1,
                pageSize: 10,
            },
            total1: 0,
            tableData1: [],
            //公务卡列表&&预算单位查询的表
            showTrade: false,   //显示隐藏公务卡列表
            transferOut_dialog: false,
            tableList: [],
            configBudget : {
                loading: false,
                pageNum: 1,
                pageSize: 10,
            	total: 0,
            },
            showBudget: false,
			config2: {
                loading: false,
                pageNum: 1,
                pageSize: 10,
            },
            total2: 0,
            tableData2: [],
            //部分退货
            dialogFormVisibleUp: false,
            tempUp: {},
            dataFormUp: {},
            rulesUp: {},
            //查询
            tempDetail: {},
            dataFormDetail: {},
            rulesDetail: {},
            dialogFormVisibleDetail: false,
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
    	// 失效日期
        changeStart() {
            this.pickerOptionsEnd = Object.assign({}, this.pickerOptionsEnd, {
                disabledDate: (time) => {
                    return time.getTime() < new Date(this.queryForm.startDate).getTime()
                }
            })
        },
        // 生效日期
        changeEnd() {
            this.pickerOptionsStart = Object.assign({}, this.pickerOptionsStart, {
                disabledDate: (time) => {
                    return time.getTime() > new Date(this.queryForm.endDate).getTime()
                }
            })
        },
        init() {
            this.queryForm = {
                externalIdentificationNo: '',
                idType: '',
                idNumber: '',
               
            }
         },
        // 重置
        reset() {
			this.queryForm={}
			this.showLoop = false
			this.showTrade = false
			this.showBudget = false
			this.tableData1 = []
			this.tableList = []
			this.tableData2 = []
        },
        // 点击查询按钮
        handleSearch() {
            if (!this.queryForm.externalIdentificationNo && !this.queryForm.idType && !this.queryForm.idNumber) {
                this.$message('请输入查询信息')
                return;
			}else {
            	if(this.queryForm.externalIdentificationNo){
            		this.getList1()
            	}else if(this.queryForm.idNumber && (this.queryForm.externalIdentificationNo == '' || this.queryForm.externalIdentificationNo == undefined
            		|| this.queryForm.externalIdentificationNo == null)){
            			this.getBudgetList();
            		}
        	}
      	},
	    //公务卡信息主表--查询条件是外部识别号的
	    getList1() {
	        this.showLoop = true
	        this.config1.loading = true;
	        let params1 = {
	        	activityNo: "X8010",
	        	logLevel: 'A',
	        	transProperty: 'O',
	            //accountOrganForm: "R", //循环账户
	            //accountType: this.newAccountType,
	            //flag: "N", //输入该客户下任意卡号应都可以查询到该客户的所有账户，但目前不可以
	            pageFlag: "mainPage",
	           	type: this.queryForm.type,
	            externalIdentificationNo: this.queryForm.externalIdentificationNo,
	            isTrans: true,
				transParams: ['dic_documentTypeTable','dic_invalidFlagYN'],
				transDict: ['idType','invalidFlag'],
	        };
	        params1 = Object.assign(params1, this.config, this.queryForm);
	        this.getTableList("/nonfi/nonfinanceService/OCS.IQ.01.0007",params1,(res) => {
	            this.config1.loading = false;
	            if (res.returnCode == "000000") {
	                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
	                  	let rows = res.returnData.rows;
	                  	this.newMediaUnitCode1 = res.returnData.mediaUnitCode
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
	                }
	              }
	            }
	        );
	    },
	    //公务卡信息表--查询条件是预算单位编码的
	    getBudgetList(){
	    	this.showTrade = true
	        this.configBudget.loading = true;
	        let params2 = {
	        	idType: '7',
	        	"activityNo": "X8010",
				"logLevel": "A",
				"transProperty": "O",
	        	isTrans: true,
				transParams: ['dic_documentTypeTable','dic_invalidFlagYN'],
				transDict: ['idType','invalidFlag'],
			};
	        params2 = Object.assign(params2, this.configBudget, this.queryForm);
	        this.getTableList("/nonfi/nonfinanceService/OCS.IQ.01.0011", params2,(res) => {
	            this.configBudget.loading = false;
	            if (res.returnCode == "000000") {
	                if ( res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
	                    this.tableList = res.returnData.rows;
	                    this.configBudget.total = res.returnData.totalCount;
	                } else {
	                   this.tableData2 = []
	                }
	            }
	        });
	    },
   		//点击预算单位表查询公务卡信息主表
   		getList2(row) {
	        this.showBudget = true
	        this.config2.loading = true;
	        let params3 = {
	        	activityNo: 'X8010',
	            logLevel: "A", //循环账户
	            transProperty: "O", //输入该客户下任意卡号应都可以查询到该客户的所有账户，但目前不可以
	            mediaUnitCode: row.mediaUnitCode,
				externalIdentificationNo: row.externalIdentificationNo,
				isTrans: true,
				transParams: ['dic_documentTypeTable','dic_invalidFlagYN'],
				transDict: ['idType','invalidFlag'],
	       	};
	        params3 = Object.assign(params3, this.config2);
	        this.getTableList("/nonfi/nonfinanceService/ISS.IQ.03.0010", params3,(res) => {
	            this.config2.loading = false;
	            if (res.returnCode == "000000") {
	                if ( res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
	                    let rows = res.returnData.rows;
	                    this.newMediaUnitCode1 = res.returnData.mediaUnitCode
	                    rows.forEach((element) => {
	                        element.haveChild = true; 
	                        
	                    });
	                    this.tableData2 = rows;
	                    this.total2 = res.returnData.totalCount;
	                } else {
	                    this.tableData2 = [];
	                }
	            }
	        });
	    },
    // 循环账户信息表子账户 查询
    loadTable1(tree, treeNode, resolve) {
      setTimeout(() => {
        let data1 = {
        	accFlag: "mainAcc",
			activityNo: "X8010",
        	currencyCode: tree.currencyCode,
			customerNo: tree.customerNo,
			eventNo: tree.eventNo,
			externalIdentificationNo: tree.externalIdentificationNo,
			globalSerialNumbr: tree.globalSerialNumbr,
			logLevel: tree.logLevel,
        	queryType: tree.queryType,
        	transProperty: tree.transProperty,
        };
        let childList = [];
        this.getTableList("/nonfi/nonfinanceService/BSS.IQ.03.0013", data1,(res) => {
            if (res.returnCode == "000000") {
              	if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
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
		        let data2 = {
		          	accFlag: "mainAcc",
					activityNo: "X8010",
		          	corporation: tree.corporation,
					currencyCode: tree.currencyCode,
					customerNo: tree.customerNo,
					eventNo: tree.eventNo,
					externalIdentificationNo: tree.externalIdentificationNo,
					globalSerialNumbr: tree.globalSerialNumbr,
					logLevel: tree.logLevel,
					mediaUnitCode: tree.mediaUnitCode,
					queryType: "2",
					transProperty: "O",
	        	};
		       	let childList = [];
		        this.getTableList("/nonfi/nonfinanceService/BSS.IQ.03.0013",data2,(res) => {
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
	    //查询
    	handleInfo(row){
    		this.dialogFormVisibleDetail = true
	      	this.tempDetail = Object.assign({}, row) 
	      	this.$nextTick(() => {
		        this.$refs['dataFormDetail'].clearValidate()
	      	})
    	},
      	//全部退货
      	allReturns(e){
      		let url='';
			if (e.eventNo == 'ISS.PT.40.0001') {
				url = 'returnedPurchase';
			} else if (e.eventNo == 'ISS.PT.40.0002') {
				url = 'returnedPurchase2';
			} else if (e.eventNo == 'ILS.XT.00.0001' || e.eventNo == 'ILS.XT.00.0003' || e.eventNo == 'ILS.XT.00.0004' || e
				.eventNo == 'ILS.XT.00.0005' ||
				e.eventNo == 'ILS.XT.00.0006') {
				url = 'returnedPurchase3';
            }
			let obj1 = {
				idType: e.idType,
				idNumber: e.idNumber,
				externalIdentificationNo: e.externalIdentificationNo,
				ecommOrigGlobalSerialNumbr: e.globalSerialNumbr,
				ecommEntryId: e.externalIdentificationNo,
				ecommOrigEventId: e.eventNo,
				ecommTransCurr: e.transCurrCde,
				ecommTransAmount: e.transAmount,
				ecommTransDate: e.transDate,
				ecommTransPostingCurr: e.postingCurrencyCode,
				ecommTransPostingAmount: e.postingAmount,
				ecommTransStatus: e.transState,
				ecommOriTransDate: e.transDate,
				ecommClearAmount: e.settlementAmount,
				ecommPostingAcctNmbr: e.accountId,
				ecommBalType: e.balanceType,
				ecommCustId: e.customerNo,
				ecommRejectStatus: 'FRT',//FRT-全部退货，PRT-部分退货
				ecommPostingExchangeRate:e.postingConvertRate,
				ecommClearAmount : e.settlementAmount,//清算金额
				ecommClearCurr : e.settlementCurrencyCode,//清算币种
			}
			this.post( "/card/cardService/OCS.RT.41.0001", obj1, res => {
	            if (res.returnCode == '000000') {
	                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
	                	this.dialogFormVisibleDetail = false
	                	this.getBudgetList()
	                    this.$message('退货成功')
	                } 
	            }
           	})
      	},
      	//显示部分退货弹框
      	partReturns(row){
      		this.dialogFormVisibleUp = true
	      	this.tempUp = Object.assign({}, row) 
	      	this.$nextTick(() => {
		        this.$refs['dataFormUp'].clearValidate()
	      	})
      	},
      	getUpData(){
      		let url='';
			if (this.tempUp.eventNo == 'ISS.PT.40.0001') {
				url = 'returnedPurchase';
			} else if (this.tempUp.eventNo == 'ISS.PT.40.0002') {
				url = 'returnedPurchase2';
			} else if (this.tempUp.eventNo == 'ILS.XT.00.0001' || this.tempUp.eventNo == 'ILS.XT.00.0003' || this.tempUp.eventNo == 'ILS.XT.00.0004' || this.tempUp
				.eventNo == 'ILS.XT.00.0005' ||
				this.tempUp.eventNo == 'ILS.XT.00.0006') {
				url = 'returnedPurchase3';
            }
      		let dataUp = {
      			idType : this.tempUp.idType,
				idNumber: this.tempUp.idNumber,
				externalIdentificationNo: this.tempUp.externalIdentificationNo,
				ecommOrigGlobalSerialNumbr: this.tempUp.globalSerialNumbr,
				ecommEntryId: this.tempUp.externalIdentificationNo,
				ecommOrigEventId: this.tempUp.eventNo,
				ecommTransCurr: this.tempUp.transCurrCde,
				ecommTransAmount: this.tempUp.ecommTransPostingAmount,
				ecommTransDate: this.tempUp.ecommTransDate,
				ecommTransPostingCurr: this.tempUp.postingCurrencyCode,
				ecommTransPostingAmount: this.tempUp.postingAmount,
				ecommTransStatus:  this.tempUp.transState,
				ecommOriTransDate: this.tempUp.transDate,
				ecommClearAmount: this.tempUp.settlementAmount,
				ecommPostingAcctNmbr: this.tempUp.accountId,
				ecommBalType: this.tempUp.balanceType,
				ecommCustId : this.tempUp.customerNo,
				ecommTransPostingAmount: this.tempUp.ecommTransPostingAmount,
				ecommRejectStatus: 'PRT',//FRT-全部退货，PRT-部分退货
				ecommPostingExchangeRate: this.tempUp.postingConvertRate,
				ecommClearAmount : this.tempUp.settlementAmount,//清算金额
				ecommClearCurr : this.tempUp.settlementCurrencyCode,//清算币种

      		}
      		this.post( "/card/cardService/ISS.RT.41.0001", dataUp, res => {
	            if (res.returnCode == '000000') {
	                	this.dialogFormVisibleUp = false
	                	this.getBudgetList()
	                    this.$message('退货成功')
	              
	            }
           	})
      	},
   		//报销
   		reimburse(items){
   			/*if (items.reimburseStatus == null || items.reimburseStatus == undefined || items.reimburseStatus == "") {
				items.reimburseStatus = 'N';
            }*/
   			items.mediaUnitCode = this.newMediaUnitCode1
   			this.post( "/nonfi/nonfinanceService/OCS.UP.01.0002", items, res => {
	            if (res.returnCode == '000000') {
	                	this.getBudgetList()
	                	this.showBudget = false
	                	this.showLoop = false
	                    this.$message('报销成功')
	              
	            }
           	})
   		},
    }
  }
  </script>
  
  <style>
  </style>
  
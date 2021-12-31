<!-- 资产选择 -->
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
            <el-form-item class="cl_td" label="ABS计划代码" prop="planId">
                <el-select v-model="queryForm.planId" class="wd200" @change="planIdChange($event)">
                <el-option v-for="(item, index) in planIdOptions" 
                	:key="index" 
                	:label="item.planIdDesc" 
                	:value="item.planId" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="转让方式" prop="type">
                <el-select v-model="queryForm.type" class="wd200">
                <el-option v-for="(item, index) in typeOptions" 
                	:key="index" 
                	:label="item.detailDesc" 
                	:value="item.codes" />
                </el-select>
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()">查询</el-button>
                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="reset()">重置</el-button>
            </div>
        </el-form>
		<!-- 不良资产账户列表：循环账户信息表&&交易账户信息表 弹窗 -->
        <el-dialog title="账户列表" :visible.sync="accList_dialog"  width="85%">
            <div v-if="newAccountType=='B' || newAccountType=='R'">
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
	                @current-change="handleList1Change"
	                @row-click="chooseList1">
	               	<el-table-column type="selection" width="55"> </el-table-column>
					<el-table-column prop="accountId"  label="账户代码"  align="center" width="230" />
	                <el-table-column prop="currencyDesc" label="币种" align="center" />
	                <el-table-column prop="" label="业务项目" align="center" width="220" >
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
	                <el-table-column  prop="" label="业务类型"  align="center"  width="220" >
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
	                <el-table-column prop="statusCodeDesc" label="状态码" align="center" />
	                <el-table-column prop="accountingStatusCode" label="核算状态" align="center" />
	                <el-table-column prop="fundNum" label="资金法人ID" align="center" />
	                <el-table-column prop="planId" label="ABS计划号" align="center" />
	            </el-table>
	            <pagination  v-show="config.total > 0" :total="config.total" :page.sync="config.pageNum"  :limit.sync="config.pageSize" @pagination="getList" />
	           </div>
	           <div v-if="newAccountType=='B' || newAccountType=='T'">
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
	                @current-change="handleList3Change"
	                @row-click="chooseList3">   
	                <el-table-column type="selection" width="55"> </el-table-column>
	                <el-table-column
	                prop="businessTypeCode"
	                label="业务类型"
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
	                <el-table-column prop="accountingStatusCode" label="核算状态" align="center" />
	                <el-table-column prop="fundNum" label="资金法人ID" align="center" />
	                <el-table-column prop="planId" label="ABS计划号" align="center" />
	            </el-table>
	            <pagination v-show="total3 > 0" :total="total3" :page.sync="config3.pageNum" :limit.sync="config3.pageSize" @pagination="getList3" />
			 	</div>
			 	<div slot="footer" class="dialog-footer">
	                <el-button type="primary" @click="sureAccBtn()">确认</el-button>
	                <el-button @click="accList_dialog = false">关闭 </el-button>
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
	            planId: '',
	            type: '',
	        },
	        newAccountType: '',
	        planIdList: [],
	        customerName: '',
	        // 下拉框
	        idTypeList: [],
	        planIdOptions: [],//abs计划代码
	        typeOptions: [],//转让方式
	        organNoOptions: [],
	        statusCodeOptions: [],
	        accountingStatusCodeOptions: [],
	        loanTypeOptions: [],
	        currencyCodeOptions: [],
	        repayModeOptions: [],
	        loanStatusOptions: [],
    		// 账户列表
	        accList_dialog: false,
	        accFlag: '', // 记录选择的账户类型
	        // 循环账户信息表
	        config: {
	            loading: false,
	            pageNum: 1,
	            pageSize: 10,
	            total: 0,
	        },
	        tableData: [],
	        curRowRadio: "",
	        curRow: {},
	       	//交易账户信息表
	        transferOut_dialog: false,
	        tableData3: [],
	        config3: {
	            loading: false,
	            pageNum: 1,
	            pageSize: 10,
	            
	        },
	        total3: 0,
	        
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
      	//abs计划代码
//    	let objItem={
//    		capitalStage: "PACK",
//    	}
      	this.getSelectDict('/beta/betaService/COS.IQ.02.0180').then((res) => {
      		res.forEach(item=>{
      			item.planIdDesc = item.planId+''+item.planDesc
			})
      		this.planIdList=res
        	this.planIdOptions = res
        	
      	})
      	//转让方式
      	this.getSelectDict('dic_type').then((res) => {
        	this.typeOptions = res
      	})
      	// 所属机构
      	this.getSelectDict('/beta/betaService/COS.IQ.02.0005').then((res) => {
        	this.organNoOptions = res
      	})
      	// 账户状态
      	this.getSelectDict('dic_accStatusCode').then((res) => {
        	this.statusCodeOptions = res
      	})
        // 贷款状态
      	this.getSelectDict('dic_loanStatus').then((res) => {
        	this.loanStatusOptions = res
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
				this.queryForm.pageNum = 1
                if (this.queryForm.idType) {
                    if (!this.queryForm.idNumber) {
                        this.$message({
                            message: '请输入证件号码',
                            type: 'warning'
                        })
                    } else if(!this.queryForm.planId){
                        this.$message({
                            message: '请输入ABS计划代码',
                            type: 'warning'
                        })
                    }else if(!this.queryForm.type){
                        this.$message({
                            message: '请输入转让方式',
                            type: 'warning'
                        })
                    }else {
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
                }else if(this.queryForm.externalIdentificationNo){  
                    if(!this.queryForm.planId){
                        this.$message({
                            message: '请输入ABS计划代码',
                            type: 'warning'
                        })
                    }else if(!this.queryForm.type){
                        this.$message({
                            message: '请输入转让方式',
                            type: 'warning'
                        })
                    }else {
                        this.getAccList()
                    }
                }else {
                    this.getAccList()
                }
            }
        },
      //监听ABS计划代码
      	planIdChange(val){
	      	this.planIdList.forEach(item =>{
	      		if(item.planId == val){
	      			this.newAccountType=item.accountType
	      		}
	      	})
		},
      	// 获取账户列表
	  	getAccList () {
		  	if(this.newAccountType=='B'){
		  		this.accList_dialog = true
		  		this.getList()
		  		this.getList3()
		  	}else if(this.newAccountType=='R'){
		  		this.accList_dialog = true//循环账户列表
		  		this.getList()
		  	}else if(this.newAccountType=='T'){//交易账户信息表
		  	    this.accList_dialog = true
		  		this.getList3()
		  		//
		  		this.getList()
		  	}
	   	},
	  
   	//不良资产& 循环账户信息表
    getList() {
    	this.config.loading = true;
      	let params = {
	        accountOrganForm: "R", //循环账户
	        accountType: this.newAccountType,
	        flag: "N", //输入该客户下任意卡号应都可以查询到该客户的所有账户，但目前不可以
	        pageFlag: "mainPage",
	        planId: this.queryForm.planId,
			type: this.queryForm.type,
			externalIdentificationNo: this.queryForm.externalIdentificationNo,
			isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_accountOrganForm','dic_businessDebitCreditCode'],//查找数据字典所需参数
			transDict : ['accountOrganForm','businessDebitCreditCode'],//翻译前后key
	    };
      	params = Object.assign(params, this.config, this.queryForm);
      	this.getTableList("/nonfi/nonfinanceService/BSS.IQ.01.0330",params).then((res) => {
      		//console.log(res)
      		if (res.returnCode == "000000") {
	           	this.config.loading = false;
	            if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
	              	let rows = res.returnData.rows;
	              	rows.forEach((element) => {
	                	element.haveChild = true;
	              	});
	              	this.tableData = rows;
	              	this.tableData.forEach(item =>{
	              		item.planId=this.queryForm.planId
	              	})
	             	this.config.total = res.returnData.totalCount;
	            } else {
	              	this.tableData = [];
	             	this.config.total = 0
	              	
	            }
	        }else{
	        	this.config.loading = false;
	        }
    	}, (err) => {
      		this.tableData = [];
	        this.config.total = 0
	        this.config.loading = false;
       		
      	})
    },
    //不良资产的交易账户信息表
    getList3() {
      	this.config3.loading = true;
      	let params = {
        	accountOrganForm: "R", //循环账户
	        accountType: this.newAccountType,
	        flag: "N", //输入该客户下任意卡号应都可以查询到该客户的所有账户，但目前不可以
	        pageFlag: "mainPage",
	        planId: this.queryForm.planId,
			type: this.queryForm.type,
			externalIdentificationNo: this.queryForm.externalIdentificationNo,
        };
      	params = Object.assign(params, this.config3, this.queryForm);
       	// delete params.total
      	this.getTableList("/nonfi/nonfinanceService/BSS.IQ.01.0335", params,(res) => {
           	this.config3.loading = false;
          	if (res.returnCode == "000000") {
	           if (res.returnData && res.returnData.rows &&res.returnData.rows.length > 0) {
	              let rows = res.returnData.rows;
	              rows.forEach((element) => {
	                element.haveChild = true;
	              });
	              this.tableData3 = rows;
	              this.total3 = res.returnData.totalCount;
	            } else {
	              	this.tableData3 = [];
	              	this.total3 = 0
	            }
          	}
        }, (err) => {
      		this.tableData3 = [];
	        this.total3 = 0
	        this.config3.loading = false;
       		
      	})
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
	        this.getTableList("/nonfi/nonfinanceService/BSS.IQ.01.0330", params1,(res) => {
	            if (res.returnCode == "000000") {
              		if ( res.returnData && res.returnData.rows &&  res.returnData.rows.length > 0) {
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
	        this.getTableList("/nonfi/nonfinanceService/BSS.IQ.01.0335",params1,(res) => {
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
		// 转出
	    transferOut(row) {
	      this.transferOut_dialog = true;
	      	this.transferOutObj = Object.assign(row, this.queryForm);
	      	this.transferOutObj.transDate = this.nextProcessDate;
	    },
	    // 确定转出
	    sureTransferOut() {
	      	this.$refs["transferOutRef"].validate((valid) => {
	        if (valid) {
	          	if (this.transferOutObj.transAmount > this.transferOutObj.currBalance) {
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
	    // 交易账户 分期计划列表
	    geTransDetailList(obj) {
	        this.transDetail_config.loading = true
	        let params = {
	            accountId: obj.accountId,
				externalIdentificationNo: obj.externalIdentificationNo,
				currencyCode: obj.currencyCode,
	        }
	        params = Object.assign(params, this.transDetail_config)
	        this.getTableList( "/nonfi/nonfinanceService/ILS.IQ.01.0015", params, (res) => {
	            if (res.returnCode == "000000") {
	                this.transDetail_config.loading = false;
	                if ( res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
	                    this.transDetail_tableData = res.returnData.rows;
	                    this.transDetail_config.total = res.returnData.totalCount;
	                    if (res.returnData.obj) {
	                        this.transAccObj.tossedAmount = res.returnData.obj.totalBalance;
	                    }
	                } else {
	                    this.transDetail_tableData = [];
	                    this.transDetail_config.total = 0
	                }
	            }
	        }, (err) => {
				this.transDetail_tableData = [];
	            this.transDetail_config.total = 0
	            this.transDetail_config.loading = false;
      		})
	    },
		// 确定账户
	    sureAccBtn() {
			let accSure = {};
			accSure.accountList = [];
	        let accountRevoleList = []
	        let accountTransList =[]
	        let resultList = []
	      	accSure.idNumber = this.queryForm.idNumber
	      	accSure.idType = this.queryForm.idType
	      	accSure.type = this.queryForm.type
	      	accSure.externalIdentificationNo = this.queryForm.externalIdentificationNo
	      	accSure.planId=this.queryForm.planId
	        if (this.accFlag == 'revoleAcc') { // 循环账户信息表
	            this.curRow.customerName = this.customerName
	            this.curRowObj = this.curRow
	            this.revoleAccObj = this.curRow
	           	accountRevoleList = this.revoleAccObj;
	        }  else if (this.accFlag == 'transAcc') { // 交易账户信息表
	            this.curRow3.customerName = this.customerName
	  			accountTransList = this.transAccList;
	            this.curRowObj = this.curRow3
	            this.transAccObj = this.curRow3
	        } 
	        if(accountRevoleList.length > 0){
				for(var i=0;i<accountRevoleList.length;i++){
					resultList.push(accountRevoleList[i]);
				}
			}
			if(accountTransList.length > 0){
				for(var i=0;i<accountTransList.length;i++){
					resultList.push(accountTransList[i]);
				}
			}
			if(resultList.length > 0){
				for(var i=0;i<resultList.length;i++){
				 	if(resultList[i].LAY_CHECKED == true){
				 		accountSureList.push(resultList[i]);
				 	}
				}
			}
			this.post("/nonfi/nonfinanceService/BSS.RT.02.0050", accSure, (res) => {
	            if (res.returnCode == "000000") {
	              	this.$notify({
		                title: "Success",
		                message: "操作成功",
		                type: "success",
		                duration: 2000,
	              	});
	              	this.accList_dialog = false;
					  accSure = {}
	           	}
	      	});
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
	  	handleList3Change(row) {
	      	this.curRow3 = row
	  	},
	  	chooseList3(row) {
		    this.accFlag = 'transAcc'
	      	this.curRowRadio3 = row.accountId
	  	},
	
      
   
    }
  }
  </script>
  
  <style>
  </style>
  
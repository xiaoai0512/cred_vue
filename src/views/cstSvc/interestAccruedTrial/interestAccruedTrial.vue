<!-- 利息累计 -->
<template>
    <div class="allContent">
        <!-- 表单验证demo: -->
        <el-form ref="transForm" :model="queryForm">
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
            <!-- <div class="cl_td clearboth"></div> -->
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()">查询</el-button>
                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="reset()">重置</el-button>
            </div>
        </el-form>
        <!--账户信息-->
        <div v-if='isShow'>
            <el-form ref="accountRef" :model="accountForm">
                <div class="text_title">账户信息</div>
                <el-form-item class="cl_td" label="账户代码" prop="accountId">
                    <el-input v-model="accountForm.accountId" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="币种" prop="currencyCode">
                    <el-input v-model="accountForm.currencyCode" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="利息累计日期" prop="externalIdentificationNo">
                    <el-input v-model="accountForm.interestStartDate" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="利息累计金额" prop="balanceTotal">
                    <el-input v-model="accountForm.balanceTotal" class="wd200" type="text" />
                </el-form-item>
            </el-form>
            <!--利息累计信息-->
            <div class="text_title">利息累计信息</div>
            <el-table v-loading="listLoading1" :data="interestInfoList" class="mbtm20 " border fit highlight-current-row style="width: 100%;" row-key="id" lazy :load="loadTable" :tree-props="{children: 'children', hasChildren: 'haveChild'}" @current-change="handleList1Change" @row-click="chooseList1">
                <el-table-column prop="balanceUnitCode" label="余额单元代码" lign="center" width="210"/>
                <el-table-column prop="transCurrDesc" label="币种" align="center" width="100">
                    <template slot-scope="{ row }">
                         <span >
                            <span>
                                {{ row.currencyCode }}
                                {{ row.currencyDesc }}
                            </span>
                           
                       </span>
                    </template>
                </el-table-column>
                <el-table-column prop="cycleNumber" label="周期" align="center" width="230"/>
                <el-table-column prop="balanceObjectCode" label="余额对象" align="center"  width='120'/>
                <el-table-column prop="balance" label="余额" align="center" width="150" />
                <el-table-column prop="prevInterestBillingDate" label="累计开始日期" align="center" width="120"/>
                <el-table-column prop="interest" label="累计金额" align="center" />
            </el-table>
          </div>
        <!--基本账户信息-->
        <el-dialog title="基本账户信息" :visible.sync="dialogFormVisibleInterest" width='80%'>
            <el-table v-loading="listLoading2" :data="tablesList" class="mbtm20 " border fit highlight-current-row style="width: 100%;" row-key="id" lazy :load="loadTable" :tree-props="{children: 'children', hasChildren: 'haveChild'}" @current-change="handleList1Change" @row-click="chooseList1">
                <el-table-column width="80">
                    <template slot-scope="scope">
                        <el-radio v-model="curRowRadio" :label="scope.row.accountId">
                            <span class="el-radio__label"></span>
                        </el-radio>
                    </template>
                </el-table-column>
                <el-table-column prop="accountId" label="账户号" width="210"/>
                <el-table-column  label="币种" align="center" width="100">
                    <template slot-scope="{ row }">
                         <span >
                            <span v-if="row.currencyCode || row.currencyDesc">
                                {{ row.currencyCode }}
                                {{ row.currencyDesc }}
                            </span>
                            <span v-else> '' </span>
                       </span>
                    </template>
                </el-table-column>
                <el-table-column prop="transAmount" label="业务类型" align="center" width="230">
                    <template slot-scope="{ row }">
                         <span >
                            <span v-if="row.businessTypeCode || row.businessDesc">
                                {{ row.businessTypeCode }}
                                {{ row.businessDesc }}
                            </span>
                            <span v-else> '' </span>
                       </span>
                    </template>
                </el-table-column>
                <el-table-column prop="productObjectCode" label="产品对象" align="center"  width='120'/>
                <el-table-column prop="productDesc" label="产品描述" align="center" width="150" />
                <el-table-column prop="accountOrganFormDesc" label="   账户组织形式" align="center" width="120"/>
                <el-table-column prop="businessDebitCreditCodeDesc" label="账户性质" align="center" />
                <el-table-column prop="statusCodeDesc" label="状态码" align="center"/>
            </el-table>
            <pagination v-show="tableTotal > 0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
            <div slot="footer" class="dialog-footer" >
                <el-button type="primary" @click="getInterestTrial()"> 利息试算 </el-button>
                <el-button type="primary" @click="dialogFormVisibleInterest = false"> 关闭 </el-button>
            </div>
        </el-dialog>
        
    </div>
</template>
<script>
    import Pagination from "@/components/Pagination";
    export default {
        name: 'tableList',
        components: {
            Pagination,
        },
        data() {
            return {
                radio: '1',
                btnAuthStr: '',
                queryForm: {},
                accountForm: {},//账户基本信息form
                interestInfoList: [],//利息累计列表
                accountRef: {},
                listLoading1: false,
                isShow: false,
                // 弹框主账户&&子账户列表
                tablesList: [],//主账户列表
                multipleSelection: [],
                queryFormObj: {
                    pageNum: 1,
                    pageSize: 10,
                },
                listLoading2: false,
                tableTotal: 0,
                dialogFormVisibleInterest: false,
                curRowRadio: "",
                curRow: {},
                //下拉
                idTypeList: [],
            }
        },
        created() {},
        mounted() {
            //证件类型
            this.getSelectDict('dic_certificateType').then((res) => {
                    this.idTypeList = res
                })
        },
        methods: {
            init() {
                this.queryForm = {
                    idType: '',
                    idNumber: '',
                    externalIdentificationNo: '',
                    //      pageNum: 1,
                    //      pageSize: 10
                }
                this.isShow = false // 结息交易列表
                this.showDetail = false // 结息明细
                this.showTransUint = false // 交易单元计息明细 三级表格
            },
            // 重置
            reset() {
                this.init()
            },
            // 点击查询按钮
            handleSearch() {
                if(!this.queryForm.externalIdentificationNo && !this.queryForm.idType && !this.queryForm.idNumber) {
                    this.$message({
                        message: '请输入查询信息',
                        type: 'warning'
                    })
                    this.init()
                } else {
                    if(this.queryForm.idType) {
                        if(!this.queryForm.idNumber) {
                            this.$message({
                                message: '请输入证件号码',
                                type: 'warning'
                            })
                        } else {
                            this.getList()
                        }
                    } else if(this.queryForm.idNumber) {
                        if(!this.queryForm.idType) {
                            this.$message({
                                message: '请输入证件类型',
                                type: 'warning'
                            })
                        } else {
                            this.getList()
                        }
                    } else {
                        this.getList()
                    }
                }
            },
            // 循环账户信息表子账户 查询
            loadTable(tree, treeNode, resolve) {
               setTimeout(() => {
                    let params1 = {
                        externalIdentificationNo: tree.accountId,
                        accFlag: "mainAcc",
                        businessProgramNo: tree.transCurrDesc,
                        businessTypeCode: tree.businessTypeCode,
                        currencyCode: tree.currencyCode,
                        customerNo: tree.customerNo,
                    };
                    params1 = Object.assign(params1,this.queryForm, this.queryFormObj );
                     let childList = []
                    this.getTableList("/nonfi/nonfinanceService/BSS.IQ.01.0118", params1, (res) => {
                        if(res.returnCode == "000000") {
                            if(res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                                childList = res.returnData.rows;
                            } else {
                                childList = [];
                            }
                            resolve(childList);
                        }
                    });
                }, 1000);
            },
            // 主账户查询列表
            getList() {
                this.listLoading2 = true
                this.dialogFormVisibleInterest = true
                let obj = {
                    pageFlag: "mainPage",
                    isTrans: true,//是否需要翻译数据字典
                    transParams : ['dic_accountOrganForm','dic_businessDebitCreditCode','dic_accStatusCode'],//查找数据字典所需参数
                    transDict : ['accountOrganForm','businessDebitCreditCode','statusCode'],//翻译前后key
                }
                this.queryForm = Object.assign(this.queryForm, this.queryFormObj, obj);
                this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0118', this.queryForm, (res) => {
                    if(res.returnCode == '000000') {
                        this.listLoading2 = false
                        if(res.returnData != null) {
                            if(res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                                this.tablesList = res.returnData.rows
                                this.tableTotal = res.returnData.totalCount
                                this.tablesList.forEach((item, index) => {
                                    item.haveChild = true
                                })

                            } else {
                                this.tablesList = []
                            }
                        }
                    }
                })
            },
            //利息试算
            getInterestTrial() {
               this.isShow = true
               this.dialogFormVisibleInterest = false
                let obj = {
                    accountCurrency: this.curRow.currencyCode,
                    accountId: this.curRow.accountId,
                    externalIdentificationNo: this.queryForm.externalIdentificationNo,
                    idType: this.queryForm.idType,
                    idNumber: this.queryForm.idNumber,
                }
                this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0105', obj, (res) => {
                    if(res.returnCode == '000000') {
                       // this.listLoading2 = false
                       
                        if(res.returnData && res.returnData  !=null) {
                            this.accountForm = res.returnData.coreAccountBean//form
                            this.interestInfoList = res.returnData.listCoreBalanceBean//list
                        } 
                        
                    }
                })
            },
            // 循环账户信息表
            handleList1Change(row) {
                this.curRow = row
               
            },
            chooseList1(row) {
                //this.accFlag = 'revoleAcc'
                this.curRowRadio = row.accountId
               
            },
        }
    }
</script>

<style>

</style>
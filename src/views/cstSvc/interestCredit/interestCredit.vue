<!-- 利息贷调 -->
<template>
    <div class="allContent">
        <!-- 表单验证demo: -->
        <el-form ref="queryRef" :model="queryForm">
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
        <!--基本账户信息-->
        <div v-if="isShow">
            <el-table v-loading="listLoading1" :data="tablesList" class="mbtm20 " border fit highlight-current-row style="width: 100%;" row-key="id">
               <el-table-column  label="外部识别号/账户号" align="center" width="200">
                    <template slot-scope="{ row }">
                         <span v-if="row.externalIdentificationNo == null ">{{row.accountId}}</span>
                        <span v-if="row.externalIdentificationNo != '' ">{{row.externalIdentificationNo}}</span>
                        <span v-if="row.externalIdentificationNo == '0000000000000000000' ">{{row.accountId}}</span>
                    </template>
                </el-table-column>
                <el-table-column  label="交易币种" align="center" width="100">
                    <template slot-scope="{ row }">
                         <span>
                            <span v-if="row.currencyCode || row.currencyDesc">
                                {{ row.currencyCode }}
                                {{ row.currencyDesc }}
                            </span>
                            <span v-else> '' </span>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="transAmount" label="交易金额" align="center" width="100"/>
                <el-table-column prop="transDate" label="交易日期" align="center"  width='120'/>
                <el-table-column prop="postingAmount" label="入账金额" align="center" width="100" />
                <el-table-column prop="occurrDate" label="入账日期" align="center" width="120"/>
                <el-table-column prop="eventNo" label="事件编号" align="center" />
                <el-table-column prop="transDesc" label="交易描述" align="center"/>
                <el-table-column prop="transStateDesc" label="交易状态" align="center"/>
                <el-table-column prop="" label="操作" align="center" >
                    <template slot-scope="{row}">
                        <el-button size="mini" icon="el-icon-info" type="primary" @click="handleAdjustAmtBtn(row)">调整金额</el-button>
                    </template> 
                </el-table-column>
            </el-table>
            <pagination v-show="tableTotal > 0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
        </div>
        <el-dialog title="基本账户信息" :visible.sync="dialogFormVisibleAmount" width='60%'>
            <el-form ref="amountForm" :model="amountUp">
                <el-form-item class="cl_td" label="入账金额 " prop="transAmount">
                    <el-input v-model="amountUp.transAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="已调整金额" prop="adjustedAmount">
                    <el-input v-model="amountUp.adjustedAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="贷记调整金额 " prop="adjustAmount">
                    <el-input v-model="amountUp.adjustAmount" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="调整说明" prop="ecommAdjustedDesc">
                    <el-input v-model="amountUp.ecommAdjustedDesc" class="wd200" type="text" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="medium"  type="primary" @click="confirmAdjustAmtBtn()">确认</el-button>
                <el-button type="primary" @click="dialogFormVisibleAmount = false">关闭</el-button>
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
                queryRef: {},
                listLoading1: false,
                isShow: false,
                // 弹框主账户&&子账户列表
                tablesList: [],//主账户列表
                multipleSelection: [],
                queryFormObj: {
                    pageNum: 1,
                    pageSize: 10,
                },
                //listLoading2: false,
                tableTotal: 0,
                dialogFormVisibleAmount: false,
                curRowRadio: "",
                curRow: {},
                //待机调整金额
                amountUp: {},
                amountForm: {},
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
                }
                this.isShow = false // 结息交易列表
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
            getList() {
                 this.isShow = true
                this.listLoading1 = true
                this.dialogFormVisibleInterest = true
                let obj = {
                    logLevel: 'A',
                    activityNo: 'x8010',
                    flag:'Y',
                    eventNoList:['ISS.PT.12.0001','ISS.PT.12.0002','ISS.PT.12.1001','ISS.PT.12.1002'],
                    isTrans: true,
                    transParams: ['dic_ecommTransStatus'],
                    transDict: ['transState'],
                }
                this.queryForm = Object.assign(this.queryForm, this.queryFormObj, obj);
                this.getTableList('/nonfi/nonfinanceService/ISS.IQ.03.0010', this.queryForm, (res) => {
                    if(res.returnCode == '000000') {
                        this.listLoading1 = false
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
            handleAdjustAmtBtn(row) {
                this.dialogFormVisibleAmount = true
                this.amountUp = Object.assign({}, row)
                if(this.amountUp.adjustedAmount == null || this.amountUp.adjustedAmount == undefined){
                   this.amountUp.adjustedAmount = 0;
                }
                this.$nextTick(() => {
                    this.$refs['amountForm'].clearValidate()
                })
            },
            //贷记调整金额
            confirmAdjustAmtBtn() {
               if(this.amountUp.adjustAmount > this.amountUp.transAmount){
                    this.$message({
                        message: '总贷记调整金额不能大于原入账金额',
                        type: 'warning'
                    })
                    return
                }
                if(this.amountUp.adjustAmount == null || this.amountUp.adjustAmount == undefined) {
                 
                    this.amountUp.adjustedAmount = 0;
                }
               if(this.amountUp.adjustAmount == 0 || this.amountUp.adjustAmount == null || this.amountUp.adjustAmount == undefined 
                   || this.amountUp.adjustAmount == ""){
                    this.$message({
                        message: '请输入调整金额',
                        type: 'warning'
                    })
                    return
                }
                this.amountUp.adjustAmtSum = this.amountUp.adjustedAmount + Number(this.amountUp.adjustAmount);
                if(this.amountUp.adjustAmtSum > this.amountUp.transAmount){
                    this.$message({
                        message: '总贷记调整金额不能大于原入账金额',
                        type: 'warning'
                    })
                    return
                }     
                let obj = {
                    idType : this.amountUp.idType,
                    idNumber : this.amountUp.idNumber,
                    externalIdentificationNo : this.amountUp.externalIdentificationNo,
                    ecommCoreTransHistId: this.amountUp.id,//交易历史id
                    ecommAdjustedAmount: this.amountUp.adjustAmtSum,//调整金额
                    ecommEventId:   this.amountUp.eventNo,
                    ecommTransAmount:  this.amountUp.adjustAmount,  
                    ecommTransCurr: this.amountUp.transCurrCde, 
                    ecommOriTransDate:  this.amountUp.transDate,
                    ecommOrigGlobalSerialNumbr: this.amountUp.globalSerialNumbr,
                    ecommTransPostingAmount: this.amountUp.adjustAmount,  
                    ecommTransPostingCurr:  this.amountUp.postingCurrencyCode,
                    ecommAdjustedDesc : this.amountUp.ecommAdjustedDesc,
                    ecommSubAccIdentify: "P",
                }
                if(this.amountUp.idNumber && (this.amountUp.externalIdentificationNo == '' ||
                    this.amountUp.externalIdentificationNo == null || this.amountUp.externalIdentificationNo == undefined
                    )){
                        obj.ecommPostingAcctNmbr = this.amountUp.accountId;
                    }else if(this.amountUp.externalIdentificationNo && (this.amountUp.idNumber == '' ||
                            this.amountUp.idNumber == null || this.amountUp.idNumber == undefined   
                    )){
                        //$scope.adjustParams.ecommEntryId = $scope.item.externalIdentificationNo;
                        //直接取查询条件的外部识别号，有问题时说一声
                        obj.ecommEntryId = this.amountUp.externalIdentificationNo;
                }
                 this.post('/card/cardService/ISS.RT.13.1002',  obj, (res) => {
                    if (res.returnCode == '000000') {
                        this.$notify({
                            title: 'Success',
                            message: '调整成功',
                            type: 'success',
                            duration: 2000
                        })
                        this.dialogFormVisibleAmount = false
                        this.getList()
                    }
                }) 
            },
        }
    }
</script>

<style>

</style>
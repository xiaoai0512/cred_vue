<!-- 费用贷调 -->
<template>
    <div class="allContent">
        <!-- 表单验证demo: -->
        <el-form ref="costRef" :model="queryForm">
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
            <el-table v-loading="listLoading1" :data="list" class="mbtm20 " border fit highlight-current-row style="width: 100%;" row-key="id">
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
                <el-table-column prop="transAmount" label="交易金额" align="center" width="100">
                	<template slot-scope="scope">
				       {{ fun(scope.row.transAmount) }}
				    </template>
                </el-table-column>
                <el-table-column prop="transDate" label="交易日期" align="center"  width='120'/>
                <el-table-column prop="postingAmount" label="入账金额" align="center" width="100">
                	<template slot-scope="scope">
				       {{ fun(scope.row.postingAmount) }}
				    </template>
                </el-table-column>
                <el-table-column prop="occurrDate" label="入账日期" align="center" width="120"/>
                <el-table-column prop="eventNo" label="事件编号" align="center" />
                <el-table-column prop="transDesc" label="交易描述" align="center"/>
                <el-table-column prop="transStateDesc" label="交易状态" align="center"/>
                <el-table-column prop="" label="操作" align="center" >
                    <template slot-scope="{row}">
                        <el-button size="mini" icon="el-icon-info" type="primary" @click="handleCostBtn(row)">调整金额</el-button>
                    </template> 
                </el-table-column>
            </el-table>
            <pagination v-show="tableTotal > 0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
        </div>
        <el-dialog title="贷记调整金额" :visible.sync="dialogFormVisibleCost" width='60%'>
            <el-form ref="costForm" :model="costUp">
                <el-form-item class="cl_td" label="入账金额 " prop="transAmount">
                	<span>{{fun(costUp.transAmount)}}</span>
                </el-form-item>
                <el-form-item class="cl_td" label="已调整金额" prop="adjustedAmount">
                	<span>{{fun(costUp.adjustedAmount)}}</span>
                </el-form-item>
                <el-form-item class="cl_td" label="贷记调整金额 " prop="adjustAmount">
                    <el-input v-model="costUp.adjustAmount" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="调整说明" prop="ecommAdjustedDesc">
                    <el-input v-model="costUp.ecommAdjustedDesc" class="wd200" type="text" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button size="medium"  type="primary" @click="confirmCostBtn()">确认</el-button>
                <el-button type="primary" @click="dialogFormVisibleCost = false">关闭</el-button>
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
                costRef: {},
                listLoading1: false,
                isShow: false,
                // 弹框主账户&&子账户列表
                list: [],//主账户列表
                //multipleSelection: [],
                queryFormObj: {
                    pageNum: 1,
                    pageSize: 10,
                },
                tableTotal: 0,
                dialogFormVisibleCost: false,
                //贷记调整金额
                costUp: {},
                costForm: {},
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
        	//文本过滤器
        	fun(val){
		　　　　return Number(val).toFixed(2);
		　　},
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
                    queryType: '1',
                    eventNoLikeStr: 'PT.60',
                    eventNo: 'ISS.PT.60.9999',
                    logLevel: 'A',
                    activityNo: 'x8010',
                    flag:'Y',
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
                                this.list = res.returnData.rows
                                this.tableTotal = res.returnData.totalCount
                                this.list.forEach((item, index) => {
                                    item.haveChild = true
                                })

                            } else {
                                this.list = []
                            }
                        }
                    }
                })
            },
            handleCostBtn(row) {
                this.dialogFormVisibleCost = true
                this.costUp = Object.assign({}, row)
                if(this.costUp.adjustedAmount == null || this.costUp.adjustedAmount == undefined){
                   this.costUp.adjustedAmount = 0;
                }
                this.$nextTick(() => {
                    this.$refs['costForm'].clearValidate()
                })
            },
            //贷记调整金额
            confirmCostBtn() {
                if(this.costUp.adjustAmount == null || this.costUp.adjustAmount == undefined) {
                 
                    this.costUp.adjustedAmount = 0;
                }
               if(this.costUp.adjustAmount == 0 || this.costUp.adjustAmount == null || this.costUp.adjustAmount == undefined 
                   || this.costUp.adjustAmount == ""){
                    this.$message({
                        message: '请输入调整金额',
                        type: 'warning'
                    })
                    return
                }
                this.costUp.adjustAmtSum = this.costUp.adjustedAmount + Number(this.costUp.adjustAmount);
                if(this.costUp.adjustAmtSum > this.costUp.transAmount){
                    this.$message({
                        message: '总贷记调整金额不能大于原入账金额',
                        type: 'warning'
                    })
                    return
                }   
                let obj = {
                    idType : this.costUp.idType,
                    idNumber : this.costUp.idNumber,
                    externalIdentificationNo : this.costUp.externalIdentificationNo,
                    ecommCoreTransHistId: this.costUp.id,//交易历史id
                    ecommAdjustedAmount: this.costUp.adjustAmtSum,//调整金额
                    ecommEventId:   this.costUp.eventNo,
                    ecommTransAmount:  this.costUp.adjustAmount,  
                    ecommTransCurr: this.costUp.transCurrCde, 
                    ecommOriTransDate:  this.costUp.transDate,
                    ecommOrigGlobalSerialNumbr: this.costUp.globalSerialNumbr,
                    ecommTransPostingAmount: this.costUp.adjustAmount,  
                    ecommTransPostingCurr:  this.costUp.postingCurrencyCode,
                    ecommCoreTransHistId : this.costUp.id,
                    ecommAdjustedDesc : this.costUp.ecommAdjustedDesc,
                    ecommSubAccIdentify: "P",
                }
                if(this.costUp.idNumber && (this.costUp.externalIdentificationNo == '' ||
                    this.costUp.externalIdentificationNo == null || this.costUp.externalIdentificationNo == undefined
                    )){
                        obj.ecommPostingAcctNmbr = this.costUp.accountId;
                    }else if(this.costUp.externalIdentificationNo && (this.costUp.idNumber == '' ||
                            this.costUp.idNumber == null || this.costUp.idNumber == undefined   
                    )){
                        //$scope.adjustParams.ecommEntryId = $scope.item.externalIdentificationNo;
                        //直接取查询条件的外部识别号，有问题时说一声
                        obj.ecommEntryId = this.costUp.externalIdentificationNo;
                }
                this.post('/card/cardService/ISS.RT.61.1001',  obj, (res) => {
                    if (res.returnCode == '000000') {
                          this.$notify({
                            title: 'Success',
                            message: '调整成功',
                            type: 'success',
                            duration: 2000
                        })
                        this.dialogFormVisibleCost = false
                        this.getList()
                    }
                }) 
            },
        }
    }
</script>

<style>

</style>
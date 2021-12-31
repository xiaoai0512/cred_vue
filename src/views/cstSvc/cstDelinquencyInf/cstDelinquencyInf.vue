<!-- 客户延滞状况查询 -->
<template>
    <div class="allContent">
        <el-form ref="queryFormRef" :model="queryForm">
            <el-form-item class="cl_td" label="证件类型" prop="idType">
                <el-select clearable  v-model="queryForm.idType" class="wd200">
                    <el-option v-for="item in idTypeList" :key="item.codes" :label="item.detailDesc" :value="item.codes" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="证件号码" prop="idNumber">
                <el-input v-model="queryForm.idNumber" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                <el-input v-model="queryForm.externalIdentificationNo" class="wd200" type="text" />
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="hadleSearch()">查询</el-button>
                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="reset()">重置</el-button>
            </div>
        </el-form>

        <div v-show="showTable">
            <div class="text_title">客户延滞状况</div>
            <el-table
                v-loading = "config.loading"
                :data="tableData"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
            >
                <el-table-column prop="delinquencyLevelDesc" label="延滞层级" align="center" width = "100" />
                <el-table-column prop="levelCode" label="层级代码" align="center" width = "220">
                    <template slot-scope="{row}">
                        <span>
                            {{row.levelCode}}
                            {{row.productLevelCodeDesc}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="productObjectNo" label="产品对象代码" align="center" width = "220">
                    <template slot-scope="{row}">
                        <span>
                            {{row.productObjectNo}}
                            {{row.productDesc}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="transAmount" label="币种" align="center" >
                    <template slot-scope="{row}">
                        <span>
                            {{row.currencyCode}}
                            {{row.currencyDesc}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="cycleNoDesc" label="周期号" align="center"  />
                <el-table-column prop="currCyclePaymentMin" label="当前最低应缴" align="center" />
                <el-table-column prop="cycleDueDayNum" label="逾期天数" align="center"  />
                <el-table-column prop="cycleDueNum" label="逾期期数" align="center" />
                <el-table-column prop="" label="操作" align="center" width = "240">
                    <template slot-scope="{row}">
                        <el-button size="mini" type="primary" @click="handle1(row)">明细</el-button>
                        <el-button size="mini" type="primary" @click="handle2(row)">详情</el-button>
                        <el-button size="mini" type="primary" @click="handle3(row)">调整</el-button>
                    </template> 
                </el-table-column>
            </el-table>
            <pagination v-show="config.total>0" :total="config.total" :page.sync="config.pageNum" :limit.sync="config.pageSize" @pagination="getList" />
            
        </div>

        <!-- 明细信息 -->
        <div v-show="showTable2" >
            <div class="text_title">明细信息</div>
            <el-table
                v-loading = "config2.loading"
                :data="tableData2"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
            >
                <el-table-column prop="delinquencyLevelDesc" label="延滞层级" align="center" width = "100"/>
                <el-table-column prop="levelCode" label="层级代码" align="center" width = "220">
                    <template slot-scope="{row}">
                        <span>
                            {{row.levelCode}}
                            {{row.productLevelCodeDesc}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="productObjectNo" label="产品对象代码" align="center" width = "220">
                    <template slot-scope="{row}">
                        <span>
                            {{row.productObjectNo}}
                            {{row.productDesc}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="transAmount" label="币种" align="center" >
                    <template slot-scope="{row}">
                        <span>
                            {{row.currencyCode}}
                            {{row.currencyDesc}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="cycleNoDesc" label="周期号" align="center"  />
                <el-table-column prop="currCyclePaymentMin" label="当前最低应缴" align="center" />
                <el-table-column prop="cycleDueDayNum" label="逾期天数" align="center"  />
                <el-table-column prop="cycleDueNum" label="逾期期数" align="center" />
                <el-table-column prop="" label="操作" align="center">
                    <template slot-scope="{row}">
                        <el-button size="mini" type="primary" @click="handle2(row)">详情</el-button>
                    </template> 
                </el-table-column>
            </el-table>
            <pagination v-show="config2.total>0" :total="config2.total" :page.sync="config2.pageNum" :limit.sync="config2.pageSize" @pagination="getList2" />  
        </div>
        <!-- 延滞信息弹窗 -->
        <el-dialog title="延滞信息" :visible.sync="delayLevelInfo_dialog"  width="65%">
            <delay-level-info
                :formObj="delayLevelObj"
            ></delay-level-info>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="delayLevelInfo_dialog = false">
                    关闭
                </el-button>
            </div>
        </el-dialog>

        <!-- 调整 弹窗 -->
        <el-dialog title="调整延滞状况金额" :visible.sync="adjust_dialog"  width="65%">
            <el-form ref="adjustRef" :model="adjustObj" :rules="adjustRules">
                <el-form-item class="cl_td" label="调整方式" prop="adjustType">
                    <el-select v-model="adjustObj.adjustType" class="wd200"  @change="getAdjustType" clearable>
                        <el-option 
                            v-for="item in adjustTypeOptions" 
                            :key="item.codes" 
                            :label="item.detailDesc" 
                            :value="item.codes" 
                        />
                    </el-select>
                </el-form-item>
                <el-form-item v-show="amountSumDiv" class="cl_td" label="调整金额" prop="adjustedAmoun">
                    <el-input v-model="adjustObj.adjustedAmoun" class="wd200" type="text" />
                </el-form-item>
                <el-form-item v-show="ratioDiv" class="cl_td" label="调整比例" prop="proportion">
                    <el-input v-model="adjustObj.proportion" class="wd200" type="text" />
                </el-form-item>
                <div v-show="amountDiv">
                    <div class="text_title">调整金额信息</div>
                    <el-table
                        :data="adjust_tableData"
                        class="mbtm20"
                        fit
                        highlight-current-row
                        style="width: 100%;"
                        border
                    >
                        <el-table-column prop="cycleNo" label="周期号" align="center"  />
                        <el-table-column prop="currCyclePaymentMin" label="当前最低应缴" align="center" />
                        <el-table-column prop="currCyclePaymentMin" label="当前最低应缴" align="center" />
                        <el-table-column prop="adjustedAmoun" label="调整金额" align="center" >
                            <template slot-scope="{row, $index}">
                                <el-input v-model="row.adjustedAmoun" @blur="checkAdjust(row, $index)"/>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="adjust_dialog = false">
                    关闭
                </el-button>
                <el-button type="primary" @click="sureAdjust">
                    确定
                </el-button>
            </div>
        </el-dialog>
        


    </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import DelayLevelInfo from '@/components-ider/cstSvc/DelayLevelInfo'

export default {
    name: 'TransQuery',
    components: {
        // eslint-disable-next-line vue/no-unused-components
        Pagination,
        DelayLevelInfo
    },
    
    data() {
        return {
            logininfo: {},
            // 列表
            showTable: false,
            queryFormRef: {},
            queryForm: {
                idType: '',
                idNumber: '',
                externalIdentificationNo: '',
            },
            config: {
                loading: false,
                pageNum: 1,
                pageSize: 10,
                total: 0
            },
            tableData: [],
            //明细信息
            showTable2: false,
            config2: {
                loading: false,
                pageNum: 1,
                pageSize: 10,
                total: 0
            },
            tableData2: [],
            row2: {},
            
            // 下拉框
            idTypeList: [],
            delinquencyLevelOpitons: [],
            adjustTypeOptions: [],
            // 交易信息弹窗
            delayLevelInfo_dialog: false,
            delayLevelObj: {},
            // 调整
            adjust_dialog: false,
            adjustObj : {},
            adjustRef : {},
            adjustRules : {},
            amountDiv: false,
            ratioDiv:false,
            amountSumDiv:false,
            delinCurRow: {},
            adjust_tableData: [],
            

        }
    },
    created() {}, 
    mounted() {
        this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))

        this.getSelectDict('dic_certificateType').then((res) => {
            this.idTypeList = res
        })
        // 延滞层级
        this.getSelectDict('dic_delinquencyLevel').then((res) => {
            this.delinquencyLevelOpitons = res
        })

        // 调整方式
        this.getSelectDict('dic_adjustType').then((res) => {
            this.adjustTypeOptions = res
        })
        
        
        this.init()
    },
    methods: {
        // 查询按钮权限
        getBtnAuth() {
            let params= {
                menuNo : window.sessionStorage.getItem('menuNo')
            }
            this.getTableList('/beta/betaService/COS.CS.01.0030', params ,(res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.length > 0 ) {
                        res.returnData.forEach(item => {
                            this.btnAuthStr += item.eventNo+','
                        })
                        // if (this.btnAuthStr.includes('COS.IQ.02.0021')) { // 查询
                        //     this.selBtnFlag = true
                        // } else {
                        //     this.selBtnFlag = false
                        // }
                        // if (this.btnAuthStr.includes('COS.AD.02.0021')) { // 新增
                        //     this.addBtnFlag = true
                        // } else {
                        //     this.addBtnFlag = false
                        // }
                        // if (this.btnAuthStr.includes('COS.UP.02.0021')) { // 维护
                        //     this.updBtnFlag = true
                        // } else {
                        //     this.updBtnFlag = false
                        // }
                    }
                }
            })
        },
        init() {
            this.showTable = false
            this.showTable2 = false
            this.queryForm = {
                idType: '',
                idNumber: '',
                externalIdentificationNo: '',
            }
        },
        // 重置
        reset() {
            this.init()
        },
        
        // 查询
        hadleSearch() {
            this.getList()
            this.showTable = true
            this.showTable2 = false
        },
        // 获取列表
        getList() {
            this.config.loading = true
            let params = {
                type : '1',
                pageFlag : 'mainPage',
                isTrans: true, //是否需要翻译数据字典
                transParams: [ "dic_delinquencyLevel"], //查找数据字典所需参数
                transDict: ["delinquencyLevel"], //翻译前后key
            }
            params = Object.assign(params, this.config, this.queryForm)
            this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0041', params ,(res) => {
                if (res.returnCode == '000000') {
                    this.showTable = true
                    this.showTable2 = false
                    this.config.loading = false
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        let rows = res.returnData.rows
                        rows.forEach(item => {
                            if(item.cycleNo == '9999'){
                                item.cycleNoDesc = '汇总'
                            }else{
                                item.cycleNoDesc = item.cycleNo; 
                            }
                        })
                        this.tableData = rows
                        this.config.total = res.returnData.totalCount
                    } else {
                        this.tableData = []
                        this.config.total = 0

                    }
                } else {
                    this.showTable = false
                    this.showTable2 = false
                }
            })
        },
        // 明细
        getList2(row) {
            this.config2.loading = true
            let params = {
                type: 0,//明细
                isTrans: true, //是否需要翻译数据字典
                transParams: [ "dic_delinquencyLevel"], //查找数据字典所需参数
                transDict: ["delinquencyLevel"], //翻译前后key
            }
            params = Object.assign(params, this.config2, this.queryForm )
            params = Object.assign(params, row )
            this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0040', params ,(res) => {
                if (res.returnCode == '000000') {
                    this.showTable2 = true
                    this.config2.loading = false
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        let rows = res.returnData.rows
                        rows.forEach(item => {
                            if(item.cycleNo == '9999'){
                                item.cycleNoDesc = '汇总'
                            }else{
                                item.cycleNoDesc = item.cycleNo; 
                            }
                        })
                        this.tableData2 = rows
                        this.config2.total = res.returnData.totalCount
                    } else {
                        this.tableData2 = []
                    }
                } else {
                    this.showTable2 = false
                }
            })
        },

        // 明细按钮
        handle1(row) {
            this.row2 = row
            this.getList2(row)
        },
        // 详情 按钮
        handle2(row) {
            this.delayLevelInfo_dialog = true
            this.delayLevelObj = Object.assign({}, row)
            if (this.delayLevelObj.productLevelCodeDesc) {
                this.delayLevelObj.levelCodeTrans = this.delayLevelObj.levelCode+ this.delayLevelObj.productLevelCodeDesc
            } else {
                this.delayLevelObj.levelCodeTrans = this.delayLevelObj.levelCode
            }
            if (this.delayLevelObj.productDesc) {
                this.delayLevelObj.productObjectNoTrans = this.delayLevelObj.productObjectNo+ this.delayLevelObj.productDesc
            } else {
                this.delayLevelObj.productObjectNoTrans = this.delayLevelObj.productObjectNo
            }
            if (this.delayLevelObj.status == 'N') {
                this.delayLevelObj.statusInfo = '欠款'
            } else if (this.delayLevelObj.status == 'Y') {
                this.delayLevelObj.statusInfo = '还清'
            }
            if(this.delayLevelObj.cycleNo == '9999'){
                this.delayLevelObj.cycleNoDesc =  '汇总'
            }else{
                this.delayLevelObj.cycleNoDesc = this.delayLevelObj.cycleNo; 
            }
        },

        // 调整
        handle3(row) {
            console.log(row)
            this.adjust_dialog = true
            this.delinCurRow = Object.assign({}, row)
            this.adjustObj = {}
        },
        //调整方式（现在后台只能支持总金额的方式调整：2）
        getAdjustType(val) {
            if (val == '0'){ // 按比例
                this.adjust_tableData = []
                this.adjustObj.adjustedAmoun = ''
                this.ratioDiv = true
                this.amountDiv = false
                this.amountSumDiv = false
            } else if (val == '1') { // 按金额
                this.adjustObj.proportion = ''
                this.adjustObj.adjustedAmoun = ''
                this.ratioDiv = false
                this.amountDiv = true
                this.amountSumDiv = false
            } else if (val == '2'){ // 按总金额
                this.adjust_tableData = []
                this.adjustObj.proportion = ''
                this.ratioDiv = false
                this.amountDiv = false
                this.amountSumDiv = true
            }
        },

        // 调整金额 判断输入的调整金额不大于最低应缴金额
        checkAdjust(row, index) {
            if (row.adjustedAmount > this.delinCurRow.currCyclePaymentMin) {
                this.$message({
                    message: "调整金额不能大于最低应缴金额",
                    type: "warning",
                })
                row.adjustedAmount = ''
                return;
            }
        },
        // 调整
        sureAdjust() {
            if (this.adjustObj.adjustedAmoun > this.delinCurRow.currCyclePaymentMin) {
                this.$message({
                    message: "调整金额不能大于最低应缴金额",
                    type: "warning",
                })
                return
            }
            let params = {
                adjustType: this.adjustObj.adjustType,
                ecommTransAmount: this.adjustObj.adjustedAmoun,
                ecommCustId: this.delinCurRow.customerNo,
                ecommProdObjId: this.delinCurRow.productObjectNo,
                ecommLevelCode: this.delinCurRow.levelCode,
                ecommCurrentCycle: this.delinCurRow.cycleNo,
                ecommOperMode: this.logininfo.operationMode,
                institutionId: this.logininfo.corporation,
            }
            this.post('/card/cardService/ISS.RT.42.0001', params, (res) => {
                if (res.returnCode == '000000') {
                    this.$notify({
                        title: "Success",
                        message: "调整成功",
                        type: "success",
                        duration: 2000,
                    });
                    this.getList()
                }
            })


        },


    },
    
}

</script>

<style>
</style>
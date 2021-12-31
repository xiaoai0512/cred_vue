<!-- 客户还款历史查询 -->
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
            <el-form-item class="cl_td" label="交易类型" prop="businessType">
                <el-select clearable  v-model="queryForm.businessType" class="wd200">
                    <el-option v-for="item in businessTypeList" :key="item.codes" :label="item.detailDesc" :value="item.codes" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="起始时间" prop="startDate">
                <el-date-picker
                    v-model="queryForm.startDate"
                    class="wd200"
                    type="date"
                    placeholder="选择起始时间"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptionsStart"
                    :clearable="true"
                    @change="changeStart"
                />
            </el-form-item>
            <el-form-item class="cl_td" label="结束时间" prop="endDate">
                <el-date-picker
                    v-model="queryForm.endDate"
                    class="wd200"
                    type="date"
                    placeholder="选择结束时间"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptionsEnd"
                    :clearable="true"
                    @change="changeEnd"
                />
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="hadleSearch()">查询</el-button>
                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="reset()">重置</el-button>
            </div>
        </el-form>

        <div v-show="showTable">
            <div class="text_title">还款历史列表</div>
            <el-table
                v-loading = "config.loading"
                :data="tableData"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
            >
                <el-table-column prop="externalIdentificationNo" label="外部识别号/账户号" align="center" width = "180">
                    <template slot-scope="{row}">
                        <span v-if="!row.externalIdentificationNo">
                            {{row.accountId}}
                        </span>
                        <span v-else-if="row.externalIdentificationNo !='' ">
                            {{row.externalIdentificationNo}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="transDate" label="交易日期" align="center"  width = "150" />
                <el-table-column prop="transCurrDesc" label="交易币种" align="center" />
                <el-table-column prop="transAmount" label="交易金额" align="center" />
                <el-table-column prop="occurrDate" label="入账日期" align="center"  width = "150" />
                <el-table-column prop="transStateDesc" label="交易状态" align="center" />
                <el-table-column prop="transDesc" label="交易描述" align="center" width = "150" />
                <el-table-column prop="" label="操作" align="center" width = "350">
                    <template slot-scope="{row}">
                        <el-button size="mini" type="primary" @click="handle1(row)">明细</el-button>
                        <el-button size="mini" type="primary" @click="handle2(row)">详情</el-button>
                        <el-button size="mini" type="primary" @click="handle3(row)">撤销</el-button>
                        <el-button size="mini" type="primary" @click="handle4(row)">分配顺序</el-button>
                    </template> 
                </el-table-column>
            </el-table>
            <pagination v-show="config.total>0" :total="config.total" :page.sync="config.pageNum" :limit.sync="config.pageSize" @pagination="getList" />
            
        </div>

        <!-- 明细 还款分配列表 -->
        <div v-show="showTable2" >
            <div class="text_title">还款分配列表</div>
            <el-table
                v-loading = "config2.loading"
                :data="tableData2"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
                row-key="id"
                lazy
                :load="loadTable2"
                :tree-props="{children: 'children', hasChildren: 'haveChild'}"
            >
                <el-table-column prop="accountId" label="账户号" align="center" width = "250" />
                <el-table-column prop="transDate" label="业务类型" align="center"  width = "180" >
                    <template slot-scope="{row}">
                        {{row.businessTypeCode}}
                        {{row.businessDesc}}
                    </template>
                </el-table-column>
                <el-table-column prop="transCurrDesc" label="交易币种" align="center" width = "100" >
                    <template slot-scope="{row}">
                        {{row.transCurrCde}}
                        {{row.transCurrDesc}}
                    </template>
                </el-table-column>
                <el-table-column prop="transAmount" label="交易金额" align="center" />
                <el-table-column prop="transDate" label="交易日期" align="center"  width = "100" />
                <el-table-column prop="currencyCode" label="分配币种" align="center" />
                <el-table-column prop="postingAmount" label="账户分配金额" align="center" />
                <el-table-column prop="transDesc" label="交易描述" align="center" width = "150" />
                <el-table-column prop="" label="操作" align="center" width = "250">
                    <template slot-scope="{row}">
                        <el-button size="mini" type="primary" @click="handle21(row)">余额类型入账情况查询</el-button>
                        <el-button size="mini" type="primary" @click="handle2(row)">详情</el-button>
                    </template> 
                </el-table-column>
            </el-table>
            <pagination v-show="config2.total>0" :total="config2.total" :page.sync="config2.pageNum" :limit.sync="config2.pageSize" @pagination="getList2" />  
        </div>

        <!-- 余额类型入账情况列表 -->
        <div v-show="showTable3" >
            <div class="text_title">余额类型入账情况</div>
            <el-table
                v-loading = "config3.loading"
                :data="tableData3"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
                row-key="id"
                lazy
                :load="loadTable2"
                :tree-props="{children: 'children', hasChildren: 'haveChild'}"
            >
                <el-table-column prop="accountId" label="账户号" align="center" width = "250" />
                <el-table-column prop="transDate" label="业务类型" align="center"  width = "180" >
                    <template slot-scope="{row}">
                        {{row.businessTypeCode}}
                        {{row.businessDesc}}
                    </template>
                </el-table-column>
                <el-table-column prop="balanceTypeDesc" label="余额类型" align="center" width = "100" />
                <el-table-column prop="currencyCode" label="分配币种" align="center" />
                <el-table-column prop="postingAmount" label="账户分配金额" align="center"  width = "100" />
                <el-table-column prop="actualPostingAmount" label="余额类型分配金额" align="center" />
                <el-table-column prop="" label="操作" align="center" width = "250">
                    <template slot-scope="{row}">
                        <el-button size="mini" type="primary" @click="handle31(row)">查询余额单元分配情况</el-button>
                        <el-button size="mini" type="primary" @click="handle2(row)">详情</el-button>
                    </template> 
                </el-table-column>
            </el-table>
            <pagination v-show="config3.total>0" :total="config3.total" :page.sync="config3.pageNum" :limit.sync="config3.pageSize" @pagination="getList3" />  
        </div>

        <!-- 余额单元分配情况 -->
        <div v-show="showTable4" >
            <div class="text_title">余额单元分配情况</div>
            <el-table
                v-loading = "config4.loading"
                :data="tableData4"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
            >
                <el-table-column prop="cycleNumber" label="周期号" align="center"  />
                <el-table-column prop="entityKey" label="余额单元代码" align="center"  /> 
                <el-table-column prop="balanceObjectCodeDesc" label="余额对象" align="center"  />
                <el-table-column prop="balanceTypeDesc" label="余额类型" align="center" />
                <el-table-column prop="actualPostingAmount" label="余额单元分配金额" align="center"  />
               	<el-table-column prop="" label="操作" align="center" width = "200">
                    <template slot-scope="{row}">
                        <el-button size="mini" type="primary" @click="handle41(row)">交易级分配</el-button>
                        <el-button size="mini" type="primary" @click="handle2(row)">详情</el-button>
                    </template> 
                </el-table-column>
            </el-table>
            <pagination v-show="config4.total>0" :total="config4.total" :page.sync="config4.pageNum" :limit.sync="config4.pageSize" @pagination="getList4" />  
        </div>

        <!-- 交易级分配情况 -->
        <div v-show="showTable5" >
            <div class="text_title">交易级分配情况</div>
            <el-table
                v-loading = "config5.loading"
                :data="tableData5"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
            >
                <el-table-column prop="accountId" label="外部识别号/账户号" align="center" width = "250">
                    <template slot-scope="{row}">
                        <span v-if="!row.externalIdentificationNo">
                            {{row.accountId}}
                        </span>
                        <span else="row.externalIdentificationNo !='' ">
                            {{row.externalIdentificationNo}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="transCurrCde" label="交易币种" align="center" >
                    <template slot-scope="{row}">
                        {{row.transCurrCde}}
                        {{row.transCurrDesc}}
                    </template>
                </el-table-column>
                <el-table-column prop="transAmount" label="交易金额" align="center" />
                <el-table-column prop="transDate" label="交易日期" align="center" />
            	<el-table-column prop="postingAmount" label="入账金额" align="center"/>
            	<el-table-column prop="occurrDate" label="入账时间" align="center" />
                <el-table-column prop="eventNo" label="事件编号" align="center" />
                <el-table-column prop="transDesc" label="交易描述" align="center" />
                <el-table-column prop="" label="操作" align="center">
                    <template slot-scope="{row}">
                        <el-button size="mini" type="primary" @click="handle2(row)">详情</el-button>
                    </template> 
                </el-table-column>
            </el-table>
            <pagination v-show="config5.total>0" :total="config5.total" :page.sync="config5.pageNum" :limit.sync="config5.pageSize" @pagination="getList5" />  
        </div>

        <!-- 账户间分配顺序表 -->
        <div v-show="showTable41" >
            <div class="text_title">账户间分配顺序表</div>
            <el-table
                v-loading = "config41.loading"
                :data="tableData41"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
            >
                <el-table-column type="index" label="分配顺序" align="center" width = "100" />
                <el-table-column prop="transDate" label="业务类型" align="center" width = "180" >
                    <template slot-scope="{row}">
                        {{row.businessTypeCode}}
                        {{row.businessDesc}}
                    </template>
                </el-table-column>
                <el-table-column prop="transIdentifiNo" label="交易识别码" align="center" />
                <el-table-column prop="currencyCode" label="币种" align="center" />
                <el-table-column prop="currBillFlagDesc" label="当期往期标志" align="center" width = "150"  />
                <el-table-column prop="businessDesc" label="业务类型" align="center" />
                <el-table-column prop="balanceTypeDesc" label="余额类型" align="center" />
                <el-table-column prop="balanceAmt" label="分配金额" align="center" />
                <el-table-column prop="" label="操作" align="center">
                    <template slot-scope="{row}">
                        <el-button size="mini" type="primary" @click="handle42(row)">余额单元分配顺序</el-button>
                    </template> 
                </el-table-column>
            </el-table>
            <pagination v-show="config41.total>0" :total="config41.total" :page.sync="config41.pageNum" :limit.sync="config41.pageSize" @pagination="getList41" />  
        </div>


        <!-- 余额单元分配顺序表 -->
        <div v-show="showTable42" >
            <div class="text_title">余额单元分配顺序表</div>
            <el-table
                v-loading = "config42.loading"
                :data="tableData42"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
            >
                <el-table-column prop="distributionOrder" label="分配顺序" align="center" />
                <el-table-column prop="cycleNumber" label="周期号" align="center" />
                <el-table-column prop="balanceUnitCode" label="余额单元代码" align="center" />
                <el-table-column prop="transDate" label="余额对象" align="center"  width = "180" >
                    <template slot-scope="{row}">
                        {{row.balanceObjectCode}}
                        {{row.balanceObjectDesc}}
                    </template>
                </el-table-column>
                <el-table-column prop="balanceTypeDesc" label="余额类型" align="center" />
                <el-table-column prop="distributionAmount" label="分配金额" align="center" />
            </el-table>
            <pagination v-show="config42.total>0" :total="config42.total" :page.sync="config42.pageNum" :limit.sync="config42.pageSize" @pagination="getList42" />  
        </div>
        

            
        <!-- 交易信息弹窗 -->
        <el-dialog title="交易信息" :visible.sync="transInfo_dialog"  width="65%">
            <trans-info
                :formObj="transInfoObj"
                :showBtn="showBtn"
            ></trans-info>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="transInfo_dialog = false">
                    关闭
                </el-button>
            </div>
        </el-dialog>


        <!-- <div v-if="showTable2" class="text_title">还款分配列表</div> -->


    </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import TransInfo from '@/components-ider/cstSvc/TransInfo'

export default {
    name: 'TransQuery',
    components: {
        // eslint-disable-next-line vue/no-unused-components
        Pagination,
        TransInfo
    },
    
    data() {
        return {
            // 列表
            showTable: false,
            queryFormRef: {},
            queryForm: {
                idType: '',
                idNumber: '',
                externalIdentificationNo: '',
                businessType: '',
                startDate: '',
                endDate: '',
            },
            pickerOptionsStart: {}, //  起始时间
            pickerOptionsEnd:{}, // 结束时间
            config: {
                loading: false,
                pageNum: 1,
                pageSize: 10,
                total: 0
            },
            tableData: [],
            //还款分配列表
            showTable2: false,
            config2: {
                loading: false,
                pageNum: 1,
                pageSize: 10,
                total: 0
            },
            tableData2: [],
            row2: {},
            //余额类型入账情况
            showTable3: false,
            config3: {
                loading: false,
                pageNum: 1,
                pageSize: 10,
                total: 0
            },
            tableData3: [],
            row3: {},
            //余额单元分配情况
            showTable4: false,
            config4: {
                loading: false,
                pageNum: 1,
                pageSize: 10,
                total: 0
            },
            tableData4: [],
            row4: {},
            //交易级分配情况
            showTable5: false,
            config5: {
                loading: false,
                pageNum: 1,
                pageSize: 10,
                total: 0
            },
            tableData5: [],
            row5: {},
            //账户间分配顺序表
            showTable41: false,
            config41: {
                loading: false,
                pageNum: 1,
                pageSize: 10,
                total: 0
            },
            tableData41: [],
            row41: {},
            //账户间分配顺序表
            showTable42: false,
            config42: {
                loading: false,
                pageNum: 1,
                pageSize: 10,
                total: 0
            },
            tableData42: [],
            row42: {},


            // 下拉框
            idTypeList: [],
            businessTypeList: [],
            ecommTransStatusOptions: [],
            // 交易信息弹窗
            transInfo_dialog: false,
            transInfoObj: {},
            showBtn: false, //不显示退货等按钮
            // transInfoList: [
            //     {
            //         label: '事件编号',
            //         prop: 'eventNo'
            //     },{
            //         label: '活动编号',
            //         prop: 'activityNo'
            //     },
            // ],

        }
    },
    created() {}, 
    mounted() {
        this.getSelectDict('dic_certificateType').then((res) => {
            this.idTypeList = res
        })
        this.getSelectDict('dic_financialTransactions').then((res) => {
            this.businessTypeList = res
        })
        // 交易状态
        this.getSelectDict('dic_ecommTransStatus').then((res) => {
            this.ecommTransStatusOptions = res
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
            this.queryForm = {
                idType: '',
                idNumber: '',
                externalIdentificationNo: '',
                businessType: '',
                startDate: '',
                endDate: '',
            }
        },
        // 重置
        reset() {
            this.init()
        },
        // 开始时间改变事件
        changeStart() {
            this.pickerOptionsEnd = Object.assign({}, this.pickerOptionsEnd, {
                disabledDate: (time) => {
                    return time.getTime() < new Date(this.queryForm.startDate).getTime()
                }
            })
        },
        // 结束时间改变事件
        changeEnd() {
            this.pickerOptionsStart = Object.assign({}, this.pickerOptionsStart, {
                disabledDate: (time) => {
                    return time.getTime() > new Date(this.queryForm.endDate).getTime()
                }
            })
        },
        // 查询
        hadleSearch() {
            this.getList()
            this.showTable = true
            this.showTable2 = false
            this.showTable3 = false
            this.showTable4 = false
            this.showTable5 = false
            this.showTable41 = false
            this.showTable42 = false
        },
        // 获取列表
        getList() {
            this.config.loading = true
            let params = {
                eventNo: "PT.20.9999",
				queryType: "3",
                isTrans: true,
                transParams:['dic_ecommTransStatus'],
                transDict : ['transState']
            }
            params = Object.assign(params, this.config, this.queryForm)
            this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0055', params ,(res) => {
                if (res.returnCode == '000000') {
                    this.showTable = true
                    this.config.loading = false
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.tableData = res.returnData.rows
                        this.config.total = res.returnData.totalCount
                    } else {
                        this.tableData = []
                    }
                }
            })
        },
        // 还款分配列表
        getList2() {
            this.config2.loading = true
            let params = {
                activityNo : "X8010",
                logLevel : "A",
                customerNo: this.row2.customerNo,
                globalSerialNumbr:  this.row2.globalSerialNumbr,
                eventNo:  this.row2.eventNo,
                queryType : '1',
                pageFlag: "mainPage",
            }
            params = Object.assign(params, this.config2, this.queryForm )
            this.getTableList('/nonfi/nonfinanceService/BSS.IQ.03.0013', params ,(res) => {
                if (res.returnCode == '000000') {
                    this.showTable2 = true
                    this.config2.loading = false
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.tableData2 = res.returnData.rows
                        this.config2.total = res.returnData.totalCount
                    } else {
                        this.tableData2 = []
                    }
                }
            })
        },
        // 还款分配列表 查询子账户
        loadTable2(tree, treeNode, resolve) {
            // console.log(tree)
            // console.log(treeNode)
            // console.log(resolve)
            setTimeout(() => {
                let params1 = {
                    activityNo : "X8010",
                    logLevel : "A",
                    customerNo: this.row2.customerNo,
                    globalSerialNumbr: this.row2.globalSerialNumbr,
                    eventNo: this.row2.eventNo,
                    queryType : '1',
                    accFlag : "mainAcc"
                }
                params1 = Object.assign(params1,this.config , this.queryForm, )
                let childList = []
                this.getTableList('/nonfi/nonfinanceService/BSS.IQ.03.0013', params1 ,(res) => {
                    if (res.returnCode == '000000') {
                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                            childList = res.returnData.rows
                        } else {
                            childList = []
                        }
                        resolve(childList)
                    }
                })
            }, 1000)
        },

        // 余额类型入账情况
        getList3(row) {
            this.config3.loading = true
            let params = {
                globalSerialNumbr : row.globalSerialNumbr,
                accountId : row.accountId,
                currencyCode : row.currencyCode,
                logLevel : "T",
                subLogLevel :  row.subLogLevel,
                isTrans: true,//是否需要翻译数据字典
                transParams : ['dic_balanceType'],//查找数据字典所需参数
                transDict : ['balanceType'],//翻译key
            }
            params = Object.assign(params, this.config3, this.queryForm )
            this.getTableList('/nonfi/nonfinanceService/ISS.IQ.03.0010', params ,(res) => {
                if (res.returnCode == '000000') {
                    this.showTable3 = true
                    this.config3.loading = false
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.tableData3 = res.returnData.rows
                        this.config3.total = res.returnData.totalCount
                    } else {
                        this.tableData3 = []
                    }
                }
            })
        },
        // 余额单元分配情况
        getList4(row) {
            this.config4.loading = true
            let params = {
                globalSerialNumbr : row.globalSerialNumbr,
                accountId : row.accountId,
                currencyCode : row.currencyCode,
                logLevel : "B",
                queryType : "4",
                changeCycleNumberMark : true,
                balanceType: row.balanceType,
                subLogLevel : row.subLogLevel,
                isTrans: true,
                transParams:['dic_balanceType'],
                transDict : ['balanceType']
            }
            params = Object.assign(params, this.config4, this.queryForm)
            this.getTableList('/nonfi/nonfinanceService/ISS.IQ.03.0010', params ,(res) => {
                if (res.returnCode == '000000') {
                    this.showTable4 = true
                    this.config4.loading = false
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.tableData4 = res.returnData.rows
                      	this.tableData4.forEach(item=>{
                      		item.balanceObjectCodeDesc = item.balanceObjectCode+''+item.objectDesc
                      	})
                        this.config4.total = res.returnData.totalCount
                    } else {
                        this.tableData4 = []
                    }
                }
            })
        },
        // 交易级分配情况
        getList5(row) {
            this.config5.loading = true
            let params = {
                balanceUnitCode: row.entityKey,
                globalTransSerialNo: row.globalSerialNumbr,

            }
            params = Object.assign(params, this.config5, this.queryForm)
            this.getTableList('/nonfi/nonfinanceService/ISS.IQ.03.0012', params ,(res) => {
                if (res.returnCode == '000000') {
                    this.showTable5 = true
                    this.config5.loading = false
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.tableData5 = res.returnData.rows
                        this.config5.total = res.returnData.totalCount
                    } else {
                        this.tableData5 = []
                    }
                }
            })
        },
        // 账户间分配顺序表
        getList41(row) {
            this.config41.loading = true
            let params = {
                customerNo: row.customerNo,
                ecommOriGlobalTransSerialNo: row.globalSerialNumbr,
                operationMode: row.operationMode,
                authDataSynFlag: '1',
                isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_ctdStmtFlag','dic_balanceType'],//查找数据字典所需参数
				transDict : ['currBillFlag','balanceType'],//翻译前后key
            }
            params = Object.assign(params, this.config41, this.queryForm)
            this.getTableList('/auth/authService/AUS.IQ.01.0003', params ,(res) => {
                if (res.returnCode == '000000') {
                    this.showTable41 = true
                    this.config41.loading = false
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.tableData41 = res.returnData.rows
                        this.config41.total = res.returnData.totalCount
                    } else {
                        this.tableData41 = []
                    }
                }
            })
        },

        // 余额单元分配顺序表
        getList42(row) {
            this.config42.loading = true
            let params = {
                customerNo: row.customerNo,
                globalSerialNumbr: row.ecommOriGlobalTransSerialNo,
                accountId : row.accountId,
                currencyCode : row.currencyCode,
                balanceType : row.balanceType,
                operationMode : row.operationMode,
                ctdStmtFlag : row.currBillFlag,
                transIdentifiNo : row.transIdentifiNo,
                accountId : row.accountId,
                isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_balanceType'],//查找数据字典所需参数
				transDict : ['balanceType'],//翻译前后key
            }
            params = Object.assign(params, this.config42, this.queryForm)
            this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0021', params ,(res) => {
                if (res.returnCode == '000000') {
                    this.showTable42 = true
                    this.config42.loading = false
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.tableData42 = res.returnData.rows
                        this.config42.total = res.returnData.totalCount
                    } else {
                        this.tableData42 = []
                    }
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
            this.transInfo_dialog = true
            this.transInfoObj = Object.assign({}, row)
            if ( this.transInfoObj.transState) {
                this.ecommTransStatusOptions.forEach(item => {
                    if (this.transInfoObj.transState == item.codes) {
                        this.transInfoObj.transStateDesc = item.detailDesc
                    }
                })
            }
            if (this.transInfoObj.businessTypeCode) {
                this.transInfoObj.businessTypeCodeConcat = this.transInfoObj.businessTypeCode+ this.transInfoObj.businessDesc
            }
            if (this.transInfoObj.balanceObjectCode) {
                this.transInfoObj.balanceObjectCodeConcat = this.transInfoObj.balanceObjectCode+ this.transInfoObj.objectDesc
            }
        },
        // 撤销 按钮
        handle3(row) {
            let params = {
				ecommEntryId:  row.externalIdentificationNo,
				ecommTransCurr:  row.transCurrCde,
				ecommTransAmount: row.transAmount,
				ecommTransPostingCurr:  row.postingCurrencyCode,
				ecommTransPostingAmount:  row.postingAmount,
				ecommOrigGlobalSerialNumbr:  row.globalSerialNumbr,
				ecommTransStatus: row.transState,
				ecommOrigEventId: row.eventNo,
				ecommTransProperty: row.transProperty,
				ecommOriTransDate: row.transDate,
				ecommCustId : row.customerNo,
				ecommClearAmount : row.settlementAmount,//清算金额
				ecommClearCurr : row.settlementCurrencyCode,//清算币种
				ecommOriOccurrDate : row.occurrDate,//入账日期
            }
            params = Object.assign(params, this.queryForm)
            this.getTableList('/card/cardService/ISS.RT.27.0001', params ,(res) => {
                if (res.returnCode == '000000') {
                    this.$notify({
                        title: 'Success',
                        message: '撤销成功',
                        type: 'success',
                        duration: 2000
                    })
                    this.hadleSearch()
                }
            })
        },
        // 分配顺序 按钮
        handle4(row) {
            this.showTable41 = true
            this.showTable2 = false
            this.showTable3 = false
            this.showTable4 = false
            this.showTable5 = false
            this.getList41(row)
            this.row41 = row
        },
        // 余额类型入账情况查询 按钮
        handle21(row) {
            this.showTable3 = true
            this.row3 = row
            this.getList3(row)
        },
        // 查询余额单元分配情况 按钮
        handle31(row) {
            this.showTable4 = true
            this.row4 = row
            this.getList4(row)
        },
        // 交易级分配 按钮
        handle41(row) {
            this.showTable5 = true
            this.row5 = row
            this.getList5(row)
        },
        // 余额单元分配顺序 按钮
        handle42(row) {
            this.showTable42 = true
            this.row42 = row
            this.getList42(row)
        },




    },
}

</script>

<style>
</style>
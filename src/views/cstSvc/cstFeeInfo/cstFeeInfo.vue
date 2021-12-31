<!-- 客户费用信息查询 -->
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
            <el-form-item class="cl_td" label="查询类型" prop="codes">
                <el-select v-model="queryForm.codes" class="wd200">
                    <el-option v-for="(item, index) in periodicFeeIdentifierOptions" 
                        :key="index" 
                        :label="item.concat" 
                        :value="item.codes"/>
                </el-select>
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()">查询</el-button>
                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="reset()">重置</el-button>
            </div>
        </el-form>
        <!--客户费用信息查询表-->
        <div v-if="isShow">
            <el-table v-loading="listLoading1" :data="tablesList" class="mbtm20 " border fit highlight-current-row style="width: 100%;" row-key="id">
                <el-table-column prop="customerNo" label="客户号" align="center" width='150'/>
                <el-table-column prop="feeItemNo" label="收费项目编号 " align="center"  width="100"/>
                <el-table-column prop="instanDesc1" label="收费维度1" align="center"  />
                <el-table-column prop="instanDesc2" label="收费维度2" align="center" />
                <el-table-column prop="instanDesc3" label="收费维度3" align="center" />
                <el-table-column prop="instanDesc4" label="收费维度4" align="center"/>
                <el-table-column prop="instanDesc5" label="收费维度5" align="center" />
                <el-table-column prop="executedNum" label="已执行次数" align="center" width="100"/>
                <el-table-column prop="currencyCode" label="币种" align="center" width='50'/>
                <el-table-column prop="waiveCycleNo" label="免除周期" align="center"/>
                
                <el-table-column prop="executedNum" label="已执行次数" align="center" width='80'/>
                <el-table-column prop="waivedNum" label="已免除次数" align="center" width='80'/>
                <el-table-column prop="accumulatedCollectionAmount" label="累计收取金额" align="center"/>
                <el-table-column prop="accumultWaiveAmt" label="累计免除金额" align="center"/>
                <el-table-column prop="" label="操作" align="center" >
                    <template slot-scope="{row}">
                        <el-button size="mini" icon="el-icon-info" type="primary" @click="handleAdjustAmtBtn(row)">查询</el-button>
                    </template> 
                </el-table-column>
            </el-table>
            <pagination v-show="tableTotal > 0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
        </div>
        <el-dialog title="客户费用收取信息" :visible.sync="dialogFormVisibleDetailView" width='60%'>
            <el-form ref="detailViewForm" :model="detailView">
                <el-form-item class="cl_td" label="客户号 " prop="customerNo">
                    <el-input v-model="detailView.customerNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="收费项目编号" prop="feeItemNo">
                    <el-input v-model="detailView.feeItemNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="收费维度1" prop="instanDesc1">
                    <el-input v-model="detailView.instanDesc1" class="wd200" type="text"readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="收费维度2" prop="instanDesc2">
                    <el-input v-model="detailView.instanDesc2" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="收费维度3" prop="instanDesc3">
                    <el-input v-model="detailView.instanDesc3" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="收费维度4" prop="instanDesc4">
                    <el-input v-model="detailView.instanDesc4" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="收费维度5" prop="instanDesc5">
                    <el-input v-model="detailView.instanDesc5" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="货币代码" prop="currencyCode">
                    <el-input v-model="detailView.currencyCode" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="免除周期" prop="waiveCycleNo">
                    <el-input v-model="detailView.waiveCycleNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="已执行次数" prop="executedNum">
                    <el-input v-model="detailView.executedNum" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="已免除次数" prop="waivedNum">
                    <el-input v-model="detailView.waivedNum" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="首次免除日期" prop="firstWaiveDate">
                    <el-input v-model="detailView.firstWaiveDate" class="wd200" type="text" readonly/>
                </el-form-item>
                
                 <el-form-item class="cl_td" label="上次免除日期" prop="lastWaiveDate">
                    <el-input v-model="detailView.lastWaiveDate" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="上次免除金额" prop="lastWaiveAmt">
                    <el-input v-model="detailView.lastWaiveAmt" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="累计免除金额" prop="accumultWaiveAmt">
                    <el-input v-model="detailView.accumultWaiveAmt" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="首次收取日期" prop="dateOfInitialCollection">
                    <el-input v-model="detailView.dateOfInitialCollection" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="上次收取日期" prop="dateOfLastCollection">
                    <el-input v-model="detailView.dateOfLastCollection" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="累计收取金额" prop="accumulatedCollectionAmount">
                    <el-input v-model="detailView.accumulatedCollectionAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                <div v-if="showDiv">
                    <el-form-item class="cl_td" label="周期类费用标识" prop="concat">
                        <el-select v-model="queryForm.concat" class="wd200" clearable disabled>
                            <el-option v-for="(item, index) in periodicFeeIdentifierOptions" 
                                :key="index" 
                                :label="item.concat" 
                                :value="item.codes"/>
                        </el-select>
                    </el-form-item>
                
                    <el-form-item class="cl_td" label="收取频率" prop="chargingFrequency">
                        <el-select v-model="queryForm.chargingFrequency" class="wd200" clearable disabled>
                            <el-option v-for="(item, index) in chargingFrequencyOptions" 
                                :key="index" 
                                :label="item.concat" 
                                :value="item.codes"/>
                        </el-select>
                    </el-form-item>
                    <el-form-item class="cl_td" label="下一执行日期" prop="nextExecutionDate">
                        <el-input v-model="detailView.nextExecutionDate" class="wd200" type="text" readonly/>
                    </el-form-item>
                    <el-form-item class="cl_td" label="失效日期" prop="expirationDate">
                        <el-input v-model="detailView.expirationDate" class="wd200" type="text" readonly/>
                    </el-form-item>   
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleDetailView = false">关闭</el-button>
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
                queryForm: {},
                queryRef: {},
                tablesList: [],//列表
                listLoading1: false,
                queryFormObj: {
                    pageNum: 1,
                    pageSize: 10,
                },
                tableTotal: 0,
                isShow: false,
                dialogFormVisibleDetailView: false,
                //客户费用收取信息
                detailView: {},
                showDiv:false,
                detailViewForm: {},
                //下拉
                periodicFeeIdentifierOptions: [],
                chargingFrequencyOptions: [],
                idTypeList: [],
                
                
            }
        },
        created() {},
        mounted() {
            //证件类型
            this.getSelectDict('dic_certificateType').then((res) => {
                this.idTypeList = res
            })
            //查询类型
            let obj={
                groupsCode: "dic_periodArray",
                queryFlag: "1",
                type: "DROPDOWNBOX",
            }
            this.getSelectDict('dic_periodArray',obj).then((res) => {
                res.forEach(item => {
                    item.concat = item.codes + ' ' + item.detailDesc
                });
                this.periodicFeeIdentifierOptions = res
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
                    } else if(!this.queryForm.externalIdentificationNo) {
                        if(!this.queryForm.codes || this.queryForm.codes==undefined) {
                            this.$message({
                                message: '请输入查询类型',
                                type: 'warning'
                            })
                        } else {
                            this.getList()
                        }
                    }else if(this.queryForm.idType !='' && this.queryForm.idNumber !='') {
                       if(!this.queryForm.codes || this.queryForm.codes==undefined) {
                            this.$message({
                                message: '请输入查询类型',
                                type: 'warning'
                            })
                        } else {
                            this.getList()
                        }
                    }else {
                        this.getList()
                    }
                }
            },
            getList() {
                 this.isShow = true
                this.listLoading1 = true
                this.dialogFormVisibleInterest = true
                this.queryForm.periodicFeeIdentifier =  this.queryForm.codes
                this.queryForm = Object.assign(this.queryForm, this.queryFormObj);
                delete this.queryForm.codes
                this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0065', this.queryForm, (res) => {
                    if(res.returnCode == '000000') {
                        this.listLoading1 = false
                        if(res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                                this.tablesList = res.returnData.rows
                                this.tableTotal = res.returnData.totalCount
                            } else {
                                this.tablesList = []
                        }
                    }
                })
            },
            handleAdjustAmtBtn(row) {
                this.dialogFormVisibleDetailView = true
                this.detailView = Object.assign({}, row)
                this.detailView = row
                if(this.detailView.periodicFeeIdentifier=='C'){
                    this.showDiv = true
                }else{
                    this.showDiv = false
                }
                this.cycleOptions(row)
                this.$nextTick(() => {
                    this.$refs['detailViewForm'].clearValidate()
                })
            },
            cycleOptions(row) {
                let obj={
                    periodicFeeIdentifier: row.periodicFeeIdentifier,
                }
                this.getSelectDict('dic_periodArray',obj).then((res) => {
                    res.forEach(item => {
                        item.concat = item.codes + ' ' + item.detailDesc
                });
                this.periodicFeeIdentifierOptions = res
                    
                }) 
            },
        }
    }
</script>

<style>

</style>
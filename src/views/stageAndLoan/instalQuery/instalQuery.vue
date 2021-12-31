<!-- 交易账户信息 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="transForm" :model="queryFormObj">
            <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                <el-input v-model="queryFormObj.externalIdentificationNo" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="起始时间" prop="beginDate">
                <el-date-picker
                    v-model="queryFormObj.beginDate"
                    class="wd200"
                    type="date"
                    placeholder="选择起始时间"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptionsStart"
                    :clearable="true"
                    @change="startTimeStatus" />
            </el-form-item>
            <el-form-item class="cl_td" label="结束时间" prop="endDate">
                <el-date-picker
                    v-model="queryFormObj.endDate"
                    class="wd200"
                    type="date"
                    placeholder="选择结束时间"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyy-MM-dd"
                    :picker-options="pickerOptionsEnd"
                    :clearable="true"
                    @change="endTimeStatus"/>
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()">查询</el-button>
                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="reset()">重置</el-button>
            </div>
        </el-form>
        <!--输入交易详细信息-->
        <div v-if="showInfo">
            <el-table v-loading="listLoading1" :data="tablesList" class="mbtm20 " fit highlight-current-row style="width: 100%"  
                border row-key="id" lazy
                :load="loadTable"
                :tree-props="{ children: 'children', hasChildren: 'haveChild' }"
                 ref="multipleTable"
                @selection-change="handleSelectionChange" >
                <el-table-column type="selection" width="55"> </el-table-column>
                <el-table-column prop="loanTypeDesc" label="分期类型" align="center"  width="160"/>
                <el-table-column prop="subAccIdentify" label="账户类型" align="center" width="100"/>
                <el-table-column prop="accountId" label="账户代码" align="center"  width="230"/>
                <el-table-column prop=""  label="交易识别ID/资金法人ID" align="center"  width="150" >
                    <template slot-scope="{ row }">
                        <span v-if="row.haveChild">
                            <span v-if="row.businessTypeCode || row.businessDesc" >
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
                <el-table-column prop=""  label="交易识别描述/资金法人名称"  align="center" width="160">
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
                                {{ row.transIdentifiDesc }}
                            </span>
                            <span v-else-if="row.subAccIdentify == 'L'">
                                <span v-if="row.fundName">
                                {{ row.fundName }}
                                </span>
                                <span v-else>''</span>
                            </span>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="loanAmount" label="交易金额" align="center" width="70"/>
                <el-table-column prop="remainPrincipalAmount" label="未抛金额" align="center" width="70"/>
                <el-table-column prop="currencyCode" label="币种" align="center" width="70"/>
                <el-table-column prop="loanTerm" label="期数" align="center" width="70" />
                <el-table-column prop="loanStartDate" label="起始日" align="center" width="100"/>
                <el-table-column prop="statusDesc" label="账户状态" align="center" width="70"/>
                <el-table-column prop="" label="操作" align="center" width="650">
                    <template slot-scope="{row}">
                        <!--交易分期-->
                        <span v-if="row.stageType=='0'">
                            <span v-if="row.haveChild">
                                <el-button size="mini" type="primary" @click="handleDetail(row)" >详情</el-button>
                                <el-button size="mini" type="primary" @click="handleReturnedPurchase(row)" >退货</el-button>
                                <el-button size="mini" type="primary" @click="handleRevokePurchase(row)">撤销</el-button>
                                <el-button size="mini" type="primary" @click="handlePreHandler(row)">结清</el-button>
                                <el-button size="mini" type="primary" @click="orginTransInfBtn(row)">原交易</el-button>
                                <el-button size="mini" type="primary" @click="handleDeferredStage(row)" >延期</el-button>
                                <el-button size="mini" type="primary" @click="handlePauseStage(row)" >暂停</el-button>
                                <el-button size="mini" type="primary" @click="handleRelationInfo(row)">关联交易</el-button>
                            </span>
                            <span v-else>
                                <el-button size="mini" type="primary" @click="handleSonDetail(row)" >详情</el-button>
                            </span>  
                        </span>
                        <!--//余额分期-->
                        <span v-else-if="row.stageType=='1'">
                            <span v-if="row.haveChild">
                                <el-button size="mini" type="primary" @click="handleDetail(row)" >详情</el-button>
                                <el-button size="mini" type="primary" @click="handleRevokePurchase(row)">撤销</el-button>
                                <el-button size="mini" type="primary" @click="handlePreHandler(row)">结清</el-button>
                                <el-button size="mini" type="primary" @click="handleDeferredStage(row)" >延期</el-button>
                                <el-button size="mini" type="primary" @click="handlePauseStage(row)" >暂停</el-button>
                                <el-button size="mini" type="primary" @click="handleRelationInfo(row)">关联交易</el-button>
                            </span>
                            <span v-else>
                                <el-button size="mini" type="primary" @click="handleSonDetail(row)" >详情</el-button>
                            </span>  
                        </span>
                        <!--非现金实物分期-->
                        <span v-else-if="row.stageType=='2'">
                            <span v-if="row.haveChild">
                                <el-button size="mini" type="primary" @click="handleDetail(row)" >详情</el-button>
                                <el-button size="mini" type="primary" @click="handleReturnedPurchase(row)" >退货</el-button>
                                <el-button size="mini" type="primary" @click="handleRevokePurchase(row)">撤销</el-button>
                                <el-button size="mini" type="primary" @click="handlePreHandler(row)">结清</el-button>
                                <el-button size="mini" type="primary" @click="handleDeferredStage(row)" >延期</el-button>
                                <el-button size="mini" type="primary" @click="handlePauseStage(row)" >暂停</el-button>
                                <el-button size="mini" type="primary" @click="handleRelationInfo(row)">关联交易</el-button>
                            </span>
                            <span v-else>
                                <el-button size="mini" type="primary" @click="handleSonDetail(row)" >详情</el-button>
                            </span>  
                        </span>
                        <!--现金分期-->
                        <span v-else-if="row.stageType=='3'">
                            <span v-if="row.haveChild">
                                <el-button size="mini" type="primary" @click="handleDetail(row)" >详情</el-button>
                                <el-button size="mini" type="primary" @click="handleRevokePurchase(row)">撤销</el-button>
                                <el-button size="mini" type="primary" @click="handlePreHandler(row)">结清</el-button>
                                <el-button size="mini" type="primary" @click="handleDeferredStage(row)" >延期</el-button>
                                <el-button size="mini" type="primary" @click="handlePauseStage(row)" >暂停</el-button>
                                <el-button size="mini" type="primary" @click="handleRelationInfo(row)">关联交易</el-button>
                            </span>
                            <span v-else>
                                <el-button size="mini" type="primary" @click="handleSonDetail(row)" >详情</el-button>
                            </span>  
                        </span>
                        <!--消费分期-->
                        <span v-else-if="row.stageType=='4'">
                            <span v-if="row.haveChild">
                                <el-button size="mini" type="primary" @click="handleDetail(row)" >详情</el-button>
                                <el-button size="mini" type="primary" @click="handleRevokePurchase(row)">撤销</el-button>
                                <el-button size="mini" type="primary" @click="handleLoanChange(row)">贷款变更</el-button>
                                <el-button size="mini" type="primary" @click="handlePrepayment(row)" >提前部分还款</el-button>
                                <el-button size="mini" type="primary" @click="handleRelationInfo(row)">关联交易</el-button>
                            </span>
                            <span v-else>
                                <el-button size="mini" type="primary" @click="handleSonDetail(row)" >详情</el-button>
                            </span>  
                        </span>
                        <span v-else-if="row.stageType=='5'">
                            <span v-if="row.haveChild">
                                <el-button size="mini" type="primary" @click="handleDetail(row)" >详情</el-button>
                                <el-button size="mini" type="primary" @click="handleRevokePurchase(row)">撤销</el-button>
                                <el-button size="mini" type="primary" @click="handleCreditS2Payment(row)">贷款还款</el-button>
                                <el-button size="mini" type="primary" @click="handleRelationInfo(row)">关联交易</el-button>
                            </span>
                            <span v-else>
                                <el-button size="mini" type="primary" @click="handleSonDetail(row)" >详情</el-button>
                            </span>  
                        </span>
                    </template> 
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer text_center">
                <el-button type="primary" @click="handleBatchRepayment()" :disabled="isAble">信贷提前还款</el-button>
                <el-button type="primary" @click="handleOverdueRepayment()" :disabled="isAble">信贷逾期还款</el-button>
                <el-button type="primary" @click="handleNormalRepayment()" :disabled="isAble">信贷正常还款</el-button>
            </div>
            <pagination v-show="tableTotal > 0"  :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
        </div> 
        <!--详情主表弹框-->
        <el-dialog title="信贷交易账户明细" :visible.sync="dialogFormVisibleDetail" width="80%">
            <el-form ref="dataFormDetail" :model="instalDetail" :rules="rulesDetail" label-position="right" label-width="160px" style="display: inline-block;">
                <el-form-item class="cl_td" label="账户代码：" prop="accountId">
                    <el-input v-model="instalDetail.accountId" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="信贷交易类型：" prop="loanTypeDesc" >
                    <el-input v-model="itemInfo.loanTypeDesc" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="贷款金额：" prop="loanAmount">
                    <el-input v-model="instalDetail.loanAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="币种：" prop="currencyCodeInfo">
                    <el-input v-model="instalDetail.currencyCodeInfo" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item label="利率 %：" prop="loanRate" class="cl_td">
                    <el-input v-model="instalDetail.loanRate" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="费率：" prop="feeRate" >
                    <el-input v-model="instalDetail.feeRate" class="wd200" type="text" readonly/>
                 </el-form-item>
                 
                <el-form-item label="总费用：" prop="feeAmount" class="cl_td" >
                    <el-input v-model="instalDetail.feeAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                
               <el-form-item label="首次费用收取期次：" prop="feeStartPeriod" class="cl_td" >
                    <el-input v-model="instalDetail.feeStartPeriod" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item label="费用收取方式：" prop="feeCollectType" class="cl_td" >
                    <el-input v-model="instalDetail.feeCollectType" class="wd200" type="text" readonly/>
               </el-form-item>
               
                <el-form-item label="总期数：" prop="loanTerm" class="cl_td" >
                    <el-input v-model="instalDetail.loanTerm" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item label="未抛账费用：" prop="remainFeeAmount" class="cl_td" >
                    <el-input v-model="instalDetail.remainFeeAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item label="未抛账期数：" prop="remainPeriod" class="cl_td" >
                    <el-input v-model="instalDetail.remainPeriod" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item label="未抛账本金：" prop="remainPrincipalAmount" class="cl_td" >
                    <el-input v-model="instalDetail.remainPrincipalAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item label="已抛账欠款金额：" prop="totalBalance" class="cl_td" >
                    <el-input v-model="instalDetail.totalBalance" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item label="下次抛账日：" prop="nextThrowDate" class="cl_td" >
                    <el-input v-model="instalDetail.nextThrowDate" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item label="合同编号：" prop="loanNum" class="cl_td" >
                    <el-input v-model="instalDetail.loanNum" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item label="还款方式：" prop="repayModeInfo" class="cl_td" >
                    <el-input v-model="instalDetail.repayModeInfo" class="wd200" type="text" readonly/>
                 </el-form-item>
                 
                <el-form-item label="贷款开始日期：" prop="loanStartDate" class="cl_td" >
                    <el-input v-model="instalDetail.loanStartDate" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item label="贷款结束日期：" prop="loanEndDate" class="cl_td" >
                    <el-input v-model="instalDetail.loanEndDate" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item label="起息日期：" prop="startIntDate" class="cl_td" >
                    <el-input v-model="instalDetail.startIntDate" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item label="免息天数：" prop="freeDays" class="cl_td" >
                    <el-input v-model="instalDetail.freeDays" class="wd200" type="text" readonly/>
                </el-form-item>
                 
                <el-form-item label="还款周期：" prop="repayPrincipalCycle" class="cl_td" >
                    <el-input v-model="instalDetail.repayPrincipalCycle" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item label="执行利率%：" prop="loanRate" class="cl_td" >
                    <el-input v-model="instalDetail.loanRate" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item label="罚息上浮百分比：" prop="penaltyUp" class="cl_td" >
                    <el-input v-model="instalDetail.penaltyUp" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item label="利息合计：" prop="interAmount" class="cl_td" >
                    <el-input v-model="instalDetail.interAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                 
                <el-form-item label="未抛账利息：" prop="remainInterAmount" class="cl_td" >
                    <el-input v-model="instalDetail.remainInterAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item label="收款账户：" prop="directDebitAccountNo" class="cl_td" >
                    <el-input v-model="instalDetail.directDebitAccountNo" class="wd200" type="text" readonly/>
                </el-form-item>
                 
                <el-form-item label="收款账户所属行号：" prop="directDebitBankNo" class="cl_td" >
                    <el-input v-model="instalDetail.directDebitBankNo" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item label="状态" prop="statusInfo" class="cl_td">
                    <el-input v-model="instalDetail.statusInfo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="账户类型" prop="subAccIdentify" >
                    <el-select v-model="instalDetail.subAccIdentify" class="wd200" disabled>
                        <el-option
                            v-for="(item, index ) in vwsubAccIdentifyOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"  />
                    </el-select>
                </el-form-item>
            </el-form>
            <el-table v-loading = "detailLoading" :data="tableData"  class="mbtm20" fit highlight-current-row style="width: 100%;" border>
                <el-table-column prop="termNo" label="期次" align="center" />
                <el-table-column prop="throwDate" label="当期抛账日" align="center" />
                <el-table-column prop="principalAmount" label="应还本金" align="center" />
                <el-table-column prop="interestAmount" label="应还利息" align="center" />
                <el-table-column prop="feeAmount" label="应还费用" align="center" />
            </el-table>
            <pagination v-show="totalDetail>0" :total="totalDetail" :page.sync="instalDetailPage.pageNum" :limit.sync="instalDetailPage.pageSize" @pagination="detailInstalData" />

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleDetail = false">关闭</el-button>
            </div>
        </el-dialog>
        <!--结清-->
        <el-dialog title="信贷交易账户明细" :visible.sync="dialogFormVisibleSettle" width="80%">
            <el-form ref="dataFormSettle" :model="settleInfo" :rules="rulesSettle" label-position="right" label-width="160px" style="display: inline-block;">
                <el-form-item class="cl_td" label="交易账户" prop="accountId">
                    <el-input v-model="settleInfo.accountId" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="分期交易类型" prop="loanTypeDesc" >
                    <el-input v-model="settleInfo.loanTypeDesc" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="分期金额" prop="loanAmount">
                    <el-input v-model="settleInfo.loanAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="分期币种" prop="currencyCode">
                    <el-input v-model="settleInfo.currencyCode" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item label="未抛本金" prop="remainPrincipalAmount" class="cl_td">
                    <el-input v-model="settleInfo.remainPrincipalAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="未抛费用" prop="remainFeeAmount" >
                    <el-input v-model="settleInfo.remainFeeAmount" class="wd200" type="text" readonly/>
                 </el-form-item>
                 
                <el-form-item label="总期数" prop="loanTerm" class="cl_td" >
                    <el-input v-model="settleInfo.loanTerm" class="wd200" type="text" readonly/>
                </el-form-item>
                
               <el-form-item label="未抛期数" prop="remainPeriod" class="cl_td" >
                    <el-input v-model="settleInfo.remainPeriod" class="wd200" type="text" readonly/>
                </el-form-item>
            </el-form>
            <div class=" col_tr text_center">
                <el-button type="primary" @click="handleSettleTrail()" style="margin-bottom: 10px;">提前结清试算</el-button>
            </div>
            <div v-if="showTrail">
                <div class="mainname titleInfo " icon="el-icon-document" style="margin-bottom: 10px;">提前结清试算</div>
                <el-form ref="dataFormstagesTrial" :model="settleTrial" :rules="rulesstagesTrial" label-position="right" label-width="160px" style="display: inline-block;">
                    <el-form-item class="cl_td" label="结清本金" prop="earlyRepaymentPriAmt">
                        <el-input v-model="settleTrial.earlyRepaymentPriAmt" class="wd200" type="text" readonly/>
                    </el-form-item>
                    
                    <el-form-item class="cl_td" label="分期手续费" prop="earlyRepaymentStagesFeeAmt">
                        <el-input v-model="settleTrial.earlyRepaymentStagesFeeAmt" class="wd200" type="text" readonly/>
                    </el-form-item>
                    
                    <el-form-item class="cl_td" label="结清费用" prop="earlyRepaymentServiceFeeAmt" >
                        <el-input v-model="settleTrial.earlyRepaymentServiceFeeAmt" class="wd200" type="text" readonly/>
                    </el-form-item>
                </el-form>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="createSettleTrail()">提前结清</el-button>
                <el-button type="primary" @click="dialogFormVisibleSettle = false">关闭</el-button>
            </div>
        </el-dialog>
        <!--延期-->
        <el-dialog title="期次调横详情" :visible.sync="dialogFormVisibleDelay" width="80%">
            <el-form ref="dataFormDelay" :model="delayInfo" :rules="rulesDelay" label-position="right" label-width="160px" style="display: inline-block;">
                <el-form-item class="cl_td" label="交易账户" prop="accountId">
                    <el-input v-model="delayInfo.accountId" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="分期交易类型" prop="loanTypeDesc" >
                    <el-input v-model="delayInfo.loanTypeDesc" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="分期金额" prop="loanAmount">
                    <el-input v-model="delayInfo.loanAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="分期币种" prop="currencyCode">
                    <el-input v-model="delayInfo.currencyCode" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item label="未抛本金" prop="remainPrincipalAmount" class="cl_td">
                    <el-input v-model="delayInfo.remainPrincipalAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="未抛费用" prop="remainFeeAmount" >
                    <el-input v-model="delayInfo.remainFeeAmount" class="wd200" type="text" readonly/>
                 </el-form-item>
                 
                <el-form-item label="总期数" prop="loanTerm" class="cl_td" >
                    <el-input v-model="delayInfo.loanTerm" class="wd200" type="text" readonly/>
                </el-form-item>
                
               <el-form-item label="未抛期数" prop="remainPeriod" class="cl_td" >
                    <el-input v-model="delayInfo.remainPeriod" class="wd200" type="text" readonly/>
                </el-form-item>
            </el-form>
            <div class="col_tr  text_left " icon="el-icon-document" style="margin-bottom: 10px;">分期调整试算</div>
            <div class=" col_tr text_center">
                <el-button type="primary" @click="handleDeferredTrial()" style="margin-bottom: 10px;">分期调整试算</el-button>
            </div>
            <el-form ref="dataFormSettleTrial" :model="stagesAdjust" :rules="rulesSettleTrial" label-position="right" label-width="160px" style="display: inline-block;">
                <el-form-item label="分期调整期数" prop="changePeriod" class="cl_td" >
                    <el-select v-model="stagesAdjust.changePeriod" class="filter-item wd200" placeholder="请选择" >
                        <el-option 
                            v-for="(item, index ) in ecommInstallmentPeriodOptions" 
                            :key="index" 
                            :label="item.detailDesc"
                            :value="item.codes"  /> 
                        </el-select>
                </el-form-item>
                <div v-if="showDelayInfo">
                    <el-form-item class="cl_td" label="分期调整后总期数 " prop="term" >
                        <el-input v-model="stagesAdjust.term" class="wd200" type="text" readonly/>
                     </el-form-item>
                     
                    <el-form-item label="分期调整后未抛期数" prop="noThrowTerm" class="cl_td" >
                        <el-input v-model="stagesAdjust.noThrowTerm" class="wd200" type="text" readonly/>
                    </el-form-item>
                    
                   <el-form-item label="分期调整费用" prop="delayFee" class="cl_td" >
                        <el-input v-model="stagesAdjust.delayFee" class="wd200" type="text" readonly/>
                    </el-form-item>
                </div>
            </el-form>
            <div v-if="showDelayInfo">
                <div class="col_tr  text_left">分期还款计划明细</div>
                <el-table  v-loading = "loadingDelayList" :data="delayList"  class="mbtm20" fit highlight-current-row style="width: 100%;" border >
                    <el-table-column prop="termNo" label="期次" align="center" />
                    <el-table-column prop="throwDate" label="当期抛账日" align="center" />
                    <el-table-column prop="principalAmount" label="应还本金" align="center" />
                    <el-table-column prop="interestAmount" label="应还利息" align="center" />
                    <el-table-column prop="feeAmount" label="应还费用" align="center" />
                </el-table>
                <pagination v-show="stagesAdjustTotal>0" :total="stagesAdjustTotal" :page.sync="stagesAdjustPage.pageNum" :limit.sync="stagesAdjustPage.pageSize" @pagination="periodAdjust" />
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="periodAdjust()">期次调整</el-button>
                <el-button type="primary" @click="dialogFormVisibleDelay = false">关闭</el-button>
            </div>
        </el-dialog>
        <!--暂停-->
        <el-dialog title="暂停分期详情" :visible.sync="dialogFormVisibleSuspend" width="80%">
            <el-form ref="dataFormSuspend" :model="suspendStages" :rules="rulesSuspend" label-position="right" label-width="160px" style="display: inline-block;">
                <el-form-item class="cl_td" label="交易账户" prop="accountId">
                    <el-input v-model="suspendStages.accountId" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="分期交易类型" prop="loanTypeDesc" >
                    <el-input v-model="suspendStages.loanTypeDesc" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="分期金额" prop="loanAmount">
                    <el-input v-model="suspendStages.loanAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="分期币种" prop="currencyCode">
                    <el-input v-model="suspendStages.currencyCode" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item label="未抛本金" prop="remainPrincipalAmount" class="cl_td">
                    <el-input v-model="suspendStages.remainPrincipalAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="未抛费用" prop="remainFeeAmount" >
                    <el-input v-model="suspendStages.remainFeeAmount" class="wd200" type="text" readonly/>
                </el-form-item>
            </el-form>
            
            <div class=" col_tr text_center">
                <el-button type="primary" @click="handleSuspendStages()" style="margin-bottom: 10px;">暂停分期试算</el-button>
            </div>
            <!--<div class="mainname titleInfo " icon="el-icon-document" style="margin-bottom: 10px;">暂停分期试算</div>-->
            <el-form ref="dataFormSuspendTrial" :model="suspendTrial" :rules="rulesSuspendTrial" label-position="right" label-width="160px" style="display: inline-block;">
                <el-form-item label="暂停期限（月）" prop="suspendCycle" class="cl_td" >
                    <el-select v-model="suspendTrial.suspendCycle" class="filter-item wd200" placeholder="请选择" >
                        <el-option 
                            v-for="(item, index ) in suspendCycleOptions" 
                            :key="index" 
                            :label="item.detailDesc"
                            :value="item.codes"  /> 
                        </el-select>
                </el-form-item>
                <div v-if="showSuspendInfo">
                    <el-form-item class="cl_td" label="暂停开始 时间" prop="suspendStartDate" >
                        <el-input v-model="suspendTrial.suspendStartDate" class="wd200" type="text" readonly/>
                     </el-form-item>
                     
                    <el-form-item label="暂停结束时间" prop="suspendEndDate" class="cl_td" >
                        <el-input v-model="suspendTrial.suspendEndDate" class="wd200" type="text" readonly/>
                    </el-form-item>
                    
                   <el-form-item label="暂停费用" prop="suspendFee" class="cl_td" >
                        <el-input v-model="suspendTrial.suspendFee" class="wd200" type="text" readonly/>
                    </el-form-item>
                </div>
            </el-form>
            <div v-if="showSuspendInfo">
                <div class="col_tr  text_left ">分期还款计划明细</div>
                <el-table  v-loading = "loadingSuspendList" :data="suspendList"  class="mbtm20" fit highlight-current-row style="width: 100%;" border >
                    <el-table-column prop="termNo" label="期次" align="center" />
                    <el-table-column prop="throwDate" label="当期抛账日" align="center" />
                    <el-table-column prop="principalAmount" label="应还本金" align="center" />
                    <el-table-column prop="interestAmount" label="应还利息" align="center" />
                    <el-table-column prop="feeAmount" label="应还费用" align="center" />
                </el-table>
                <pagination v-show="suspendTrialTotal>0" :total="suspendTrialTotal" :page.sync="suspendTrialPage.pageNum" :limit.sync="suspendTrialPage.pageSize" @pagination="suspendSuspendDefine" />
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="suspendSuspendDefine()">暂停分期</el-button>
                <el-button type="primary" @click="dialogFormVisibleSuspend = false">关闭</el-button>
            </div>
        </el-dialog>
        <!--关联交易-->
       <el-dialog title="关联交易信息" :visible.sync="dialogFormVisibleRelation" width="80%">
            <el-table  v-loading = "loadingRelationList" :data="relationList"  class="mbtm20" fit highlight-current-row style="width: 100%;" border >
                <el-table-column prop="externalIdentificationNo" label="外部识别号/账户号" align="center" />
                <el-table-column prop="transCurrDesc" label="交易币种" align="center" />
                <el-table-column prop="transAmount" label="交易金额" align="center" />
                <el-table-column prop="transDate" label="交易日期" align="center" />
                <el-table-column prop="postingAmount" label="入账金额" align="center" />
                <el-table-column prop="occurrDate" label="入账日期" align="center" />
                <el-table-column prop="occurrTime" label="入账时间" align="center" />
                <el-table-column prop="eventNo" label="事件编号" align="center" />
                <el-table-column prop="transStateDesc" label="交易状态" align="center" />
                <el-table-column prop="transDesc" label="交易描述" align="center" />
                <el-table-column prop="" label="操作" align="center">
                    <template slot-scope="{row}">
                        <el-button size="mini" type="primary" @click="handleRelationDetail(row)" >查看</el-button>
                    </template> 
                </el-table-column>
            </el-table>
            <pagination v-show="relationTotal>0" :total="relationTotal" :page.sync="relationPage.pageNum" :limit.sync="relationPage.pageSize" @pagination="getRelation" />
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleRelation = false">关闭</el-button>
            </div>
        </el-dialog>
        <!--查看关联交易信息-->
        <el-dialog title="交易详细信息" :visible.sync="dialogFormVisibleRelationInfo" width="85%;">
            <el-form ref="dataFormSuspend" :model="rulesDetailInfo" :rules="rulesSuspend" label-position="right" label-width="160px" style="display: inline-block;">
                <el-form-item class="cl_td" label="事件编号" prop="eventNo">
                    <el-input v-model="rulesDetailInfo.eventNo" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="活动编号" prop="activityNo" >
                    <el-input v-model="rulesDetailInfo.activityNo" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo" >
                    <el-input v-model="rulesDetailInfo.externalIdentificationNo" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="账户号/余额单元号" prop="entityKey" >
                    <el-input v-model="rulesDetailInfo.entityKey" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="交易日期" prop="transDate" >
                    <el-input v-model="rulesDetailInfo.transDate" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="入账时间" prop="occurrDate" >
                    <el-input v-model="rulesDetailInfo.occurrDate" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="交易币种" prop="transCurrCde" >
                    <el-input v-model="rulesDetailInfo.transCurrCde" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="交易金额" prop="transAmount" >
                    <el-input v-model="rulesDetailInfo.transAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                
                 <el-form-item class="cl_td" label="入账币种" prop="postingCurrencyCode" >
                    <el-input v-model="rulesDetailInfo.postingCurrencyCode" class="wd200" type="text" readonly/>
                </el-form-item>
                
                 <el-form-item class="cl_td" label="入账金额" prop="postingAmount" >
                    <el-input v-model="rulesDetailInfo.postingAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="清算币种" prop="settlementCurrencyCode" >
                    <el-input v-model="rulesDetailInfo.settlementCurrencyCode" class="wd200" type="text" readonly/>
                </el-form-item>
                
                 <el-form-item class="cl_td" label="清算金额" prop="settlementAmount" >
                    <el-input v-model="rulesDetailInfo.settlementAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="入账转换汇率 " prop="postingConvertRate" >
                    <el-input v-model="rulesDetailInfo.postingConvertRate" class="wd200" type="text" readonly/>
                </el-form-item>
                
                 <el-form-item class="cl_td" label="交易描述" prop="transDesc" >
                    <el-input v-model="rulesDetailInfo.transDesc" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="余额类型 " prop="postingConvertRate" >
                    <el-input v-model="rulesDetailInfo.postingConvertRate" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="客户号" prop="customerNo" >
                    <el-input v-model="rulesDetailInfo.customerNo" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="账户代码" prop="accountId" >
                    <el-input v-model="rulesDetailInfo.accountId" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="交易状态" prop="transState" >
                    <el-input v-model="rulesDetailInfo.transState" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="业务类型代码" prop="businessTypeCode" >
                    <el-input v-model="rulesDetailInfo.businessTypeCode" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="余额对象代码" prop="balanceObjectCode" >
                    <el-input v-model="rulesDetailInfo.balanceObjectCode" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="授权码" prop="authCde" >
                    <el-input v-model="rulesDetailInfo.authCde" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="来源码" prop="sourceCde" >
                    <el-input v-model="rulesDetailInfo.sourceCde" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="交易国家代码" prop="transCountryCde" >
                    <el-input v-model="rulesDetailInfo.transCountryCde" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="交易城市代码" prop="transCityCde" >
                    <el-input v-model="rulesDetailInfo.transCityCde" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="收单参考号" prop="acquireReferenceNumbr" >
                    <el-input v-model="rulesDetailInfo.acquireReferenceNumbr" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="渠道代码" prop="channelCde" >
                    <el-input v-model="rulesDetailInfo.channelCde" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="商户类别码" prop="mcc" >
                    <el-input v-model="rulesDetailInfo.mcc" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="商户代码" prop="merchantCde" >
                    <el-input v-model="rulesDetailInfo.merchantCde" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="全局流水号" prop="globalSerialNumbr" >
                    <el-input v-model="rulesDetailInfo.globalSerialNumbr" class="wd200" type="text" readonly/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleRelationInfo = false">关闭</el-button>
            </div>
        </el-dialog>
        <!--信贷提前还款-->
        <el-dialog title="还款明细" :visible.sync="dialogFormVisibleRepayment" width="1000px;">
            <el-form ref="dataFormRepayment" :model="creditInfo" :rules="rulesRepayment" label-position="right" label-width="160px" style="display: inline-block;">
                <el-form-item class="cl_td" label="外部识别号" prop="ecommEntryId">
                    <el-input v-model="creditInfo.ecommEntryId" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="客户号" prop="customerNo" >
                    <el-input v-model="creditInfo.customerNo" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="应还总额" prop="allAmt">
                    <el-input v-model="creditInfo.allAmt" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="未还本金" prop="throwpri">
                    <el-input v-model="creditInfo.throwpri" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item label="未还利息" prop="throwInterest" class="cl_td">
                    <el-input v-model="creditInfo.throwInterest" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="未还费用" prop="throwFee" >
                    <el-input v-model="creditInfo.throwFee" class="wd200" type="text" readonly/>
                </el-form-item>
                
                 <el-form-item class="cl_td" label="未还罚息" prop="penaltyInterest" >
                    <el-input v-model="creditInfo.penaltyInterest" class="wd200" type="text" readonly/>
                </el-form-item>
                
                 <el-form-item class="cl_td" label="提前还款利息" prop="preInter" >
                    <el-input v-model="creditInfo.preInter" class="wd200" type="text" readonly/>
                </el-form-item>
                
                 <el-form-item class="cl_td" label="提前还款本金" prop="prepri" >
                    <el-input v-model="creditInfo.prepri" class="wd200" type="text" readonly/>
                </el-form-item>
                
                 <el-form-item class="cl_td" label="提前还款费用" prop="preFee" >
                    <el-input v-model="creditInfo.preFee" class="wd200" type="text" readonly/>
                </el-form-item>
            </el-form>
            <div class="col_tr  text_left ">欠款明细</div>
            <el-table  v-loading = "loadingArrearsList" :data="arrearsList"  class="mbtm20" fit highlight-current-row style="width: 100%;" border >
                <el-table-column prop="ecommPostingAcctNmbr" label="账号" align="center" />
                <el-table-column prop="allAmt " label="应还总额" align="center" />
                <el-table-column prop="throwpri" label="应还本金" align="center" />
                <el-table-column prop="throwInterest" label="应还利息" align="center" />
                <el-table-column prop="penaltyInterest" label="应还罚息" align="center" />
                <el-table-column prop="prepri" label="提前还款本金" align="center" />
                <el-table-column prop="preInter" label="提前还款利息" align="center" />
                <el-table-column prop="preFee" label="提前还款费用" align="center" />
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="getCreditRepayment()">还款</el-button>
                <el-button type="primary" @click="dialogFormVisibleRepayment = false">关闭</el-button>
            </div>
        </el-dialog>
        <!--信贷逾期还款-->
        <el-dialog title="还款明细" :visible.sync="dialogFormVisibleNormal" width="1000px;">
            <el-form ref="dataFormNormal" :model="normalRepayment" :rules="rulesNormal" label-position="right" label-width="160px" style="display: inline-block;">
                <el-form-item class="cl_td" label="外部识别号" prop="ecommEntryId">
                    <el-input v-model="normalRepayment.ecommEntryId" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="客户号" prop="customerNo" >
                    <el-input v-model="normalRepayment.customerNo" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="应还总额" prop="allAmt">
                    <el-input v-model="normalRepayment.allAmt" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="未还本金" prop="throwpri">
                    <el-input v-model="normalRepayment.throwpri" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item label="未还利息" prop="throwInterest" class="cl_td">
                    <el-input v-model="normalRepayment.throwInterest" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="未还费用" prop="throwFee" >
                    <el-input v-model="normalRepayment.throwFee" class="wd200" type="text" readonly/>
                </el-form-item>
                
                 <el-form-item class="cl_td" label="未还罚息" prop="penaltyInterest" >
                    <el-input v-model="normalRepayment.penaltyInterest" class="wd200" type="text" readonly/>
                </el-form-item>
                
            </el-form>
            <div class="col_tr  text_left ">欠款明细</div>
            <el-table  v-loading = "loadingNormalNormal" :data="normalRepaymentList"  class="mbtm20" fit highlight-current-row style="width: 100%;" border >
                <el-table-column prop="ecommPostingAcctNmbr" label="账号" align="center" />
                <el-table-column prop="allAmt" label="应还总额" align="center" />
                <el-table-column prop="throwpri" label="应还本金" align="center" />
                <el-table-column prop="throwInterest" label="应还利息" align="center" />
                <el-table-column prop="penaltyInterest" label="应还罚息" align="center" />
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="getCreditRepayment()">还款</el-button>
                <el-button type="primary" @click="dialogFormVisibleNormal = false">关闭</el-button>
            </div>
        </el-dialog>
        <!--信贷正常还款-->
        <el-dialog title="还款明细" :visible.sync="dialogFormVisibleNormal" width="1000px;">
            <el-form ref="dataFormNormal" :model="normalRepayment" :rules="rulesNormal" label-position="right" label-width="160px" style="display: inline-block;">
                <el-form-item class="cl_td" label="外部识别号" prop="ecommEntryId">
                    <el-input v-model="normalRepayment.ecommEntryId" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="客户号" prop="customerNo" >
                    <el-input v-model="normalRepayment.customerNo" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="应还总额" prop="allAmt">
                    <el-input v-model="normalRepayment.allAmt" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="未还本金" prop="throwpri">
                    <el-input v-model="normalRepayment.throwpri" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item label="未还利息" prop="throwInterest" class="cl_td">
                    <el-input v-model="normalRepayment.throwInterest" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="未还费用" prop="throwFee" >
                    <el-input v-model="normalRepayment.throwFee" class="wd200" type="text" readonly/>
                </el-form-item>
                
                 <el-form-item class="cl_td" label="未还罚息" prop="penaltyInterest" >
                    <el-input v-model="normalRepayment.penaltyInterest" class="wd200" type="text" readonly/>
                </el-form-item>
                
            </el-form>
            <div class="col_tr  text_left ">欠款明细</div>
            <el-table  v-loading = "loadingNormalNormal" :data="normalRepaymentList"  class="mbtm20" fit highlight-current-row style="width: 100%;" border >
                <el-table-column prop="ecommPostingAcctNmbr" label="账号" align="center" />
                <el-table-column prop="termNo " label="期次" align="center" />
                <el-table-column prop="throwpri" label="应还日期" align="center" />
                <el-table-column prop="throwInterest" label="应还本金" align="center" />
                <el-table-column prop="penaltyInterest" label="应还利息" align="center" />
                <el-table-column prop="prepri" label="应还罚息" align="center" />
                <el-table-column label="提前部分还款" align="center" >
                   <el-input v-model="normalRepaymentList.preInter" class="wd200" type="text"/>
                </el-table-column >
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="getCreditRepayment()">还款</el-button>
                <el-button type="primary" @click="dialogFormVisibleNormal = false">关闭</el-button>
            </div>
        </el-dialog>
        <!--详情子表-->
        <el-dialog title="信贷交易账户明细" :visible.sync="dialogFormVisibleSonDetail">
            <el-form ref="dataFormSonDetail" :model="sonDetail" :rules="rulesSonDetail" label-position="right" label-width="160px" style="display: inline-block;">
                <el-form-item class="cl_td" label="账户代码：" prop="accountId">
                    <el-input v-model="sonDetail.accountId" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="信贷交易类型：" prop="loanTypeDesc" >
                    <el-input v-model="sonInfo.loanTypeDesc" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="贷款金额：" prop="loanAmount">
                    <el-input v-model="sonDetail.loanAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="币种：" prop="currencyCodeInfo">
                    <el-input v-model="sonDetail.currencyCodeInfo" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item label="利率 %：" prop="loanRate" class="cl_td">
                    <el-input v-model="sonDetail.loanRate" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item class="cl_td" label="费率：" prop="feeRate" >
                    <el-input v-model="sonDetail.feeRate" class="wd200" type="text" readonly/>
                 </el-form-item>
                 
                <el-form-item label="总费用：" prop="feeAmount" class="cl_td" >
                    <el-input v-model="sonDetail.feeAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                
               <el-form-item label="首次费用收取期次：" prop="feeStartPeriod" class="cl_td" >
                    <el-input v-model="sonDetail.feeStartPeriod" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item label="费用收取方式：" prop="feeCollectType" class="cl_td" >
                    <el-input v-model="sonDetail.feeCollectType" class="wd200" type="text" readonly/>
               </el-form-item>
               
                <el-form-item label="总期数：" prop="loanTerm" class="cl_td" >
                    <el-input v-model="sonDetail.loanTerm" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item label="未抛账费用：" prop="remainFeeAmount" class="cl_td" >
                    <el-input v-model="sonDetail.remainFeeAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item label="未抛账期数：" prop="remainPeriod" class="cl_td" >
                    <el-input v-model="sonDetail.remainPeriod" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item label="未抛账本金：" prop="remainPrincipalAmount" class="cl_td" >
                    <el-input v-model="sonDetail.remainPrincipalAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item label="已抛账欠款金额：" prop="totalBalance" class="cl_td" >
                    <el-input v-model="sonDetail.totalBalance" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item label="下次抛账日：" prop="nextThrowDate" class="cl_td" >
                    <el-input v-model="sonDetail.nextThrowDate" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item label="合同编号：" prop="loanNum" class="cl_td" >
                    <el-input v-model="sonDetail.loanNum" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item label="还款方式：" prop="repayModeInfo" class="cl_td" >
                    <el-input v-model="sonDetail.repayModeInfo" class="wd200" type="text" readonly/>
                 </el-form-item>
                 
                <el-form-item label="贷款开始日期：" prop="loanStartDate" class="cl_td" >
                    <el-input v-model="sonDetail.loanStartDate" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item label="贷款结束日期：" prop="loanEndDate" class="cl_td" >
                    <el-input v-model="sonDetail.loanEndDate" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item label="起息日期：" prop="startIntDate" class="cl_td" >
                    <el-input v-model="sonDetail.startIntDate" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item label="免息天数：" prop="freeDays" class="cl_td" >
                    <el-input v-model="sonDetail.freeDays" class="wd200" type="text" readonly/>
                </el-form-item>
                 
                <el-form-item label="还款周期：" prop="repayPrincipalCycle" class="cl_td" >
                    <el-input v-model="sonDetail.repayPrincipalCycle" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item label="执行利率%：" prop="loanRate" class="cl_td" >
                    <el-input v-model="sonDetail.loanRate" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item label="罚息上浮百分比：" prop="penaltyUp" class="cl_td" >
                    <el-input v-model="sonDetail.penaltyUp" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item label="利息合计：" prop="interAmount" class="cl_td" >
                    <el-input v-model="sonDetail.interAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                 
                <el-form-item label="未抛账利息：" prop="remainInterAmount" class="cl_td" >
                    <el-input v-model="sonDetail.remainInterAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                
                <el-form-item label="收款账户：" prop="directDebitAccountNo" class="cl_td" >
                    <el-input v-model="sonDetail.directDebitAccountNo" class="wd200" type="text" readonly/>
                </el-form-item>
                 
                <el-form-item label="收款账户所属行号：" prop="directDebitBankNo" class="cl_td" >
                    <el-input v-model="sonDetail.directDebitBankNo" class="wd200" type="text" readonly/>
                </el-form-item>
                
                 <el-form-item label="状态" prop="statusInfo" class="cl_td" >
                    <el-input v-model="sonDetail.statusInfo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="账户类型" prop="operationMode" >
                    <el-select v-model="sonDetail.operationMode" class="wd200" >
                        <el-option
                            v-for="(item, index ) in vwsubAccIdentifyOptions"
                            :key="index"
                            :label="item.modeName"
                        :value="item.operationMode"  />
                    </el-select>
                </el-form-item>
            </el-form>
            <el-table v-loading = "detailSonLoading" :data="sonTableData"  class="mbtm20" fit highlight-current-row style="width: 100%;" border>
                <el-table-column prop="termNo" label="期次" align="center" />
                <el-table-column prop="throwDate" label="当期抛账日" align="center" />
                <el-table-column prop="principalAmount" label="应还本金" align="center" />
                <el-table-column prop="interestAmount" label="应还利息" align="center" />
                <el-table-column prop="feeAmount" label="应还费用" align="center" />
            </el-table>
            <pagination v-show="sonTotal>0" :total="sonTotal" :page.sync="sonDetailPage.pageNum" :limit.sync="sonDetailPage.pageSize" @pagination="detailInstalData" />
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleSonDetail = false">关闭</el-button>
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
            // 权限
            selBtnFlag: false,
            addBtnFlag: false,
            updBtnFlag: false,
            btnAuthStr: '',
            // 列表
            tablesList: [],
            multipleSelection: [],
            queryFormObj: {
                pageNum: 1,
                pageSize:10,
            },
            isAble: false,
            showBtn: false,
            curRowRadio: '',
            listLoading1: false,
            pickerOptionsStart: {}, //  起始时间
            pickerOptionsEnd:{}, // 结束时间
            tableTotal: 0,
            rulesAdd:{},
            showInfo: false,
            createDate: '',
            overDate:'',
            isdisabled: false,
            pickerOptionsStart: {
                disabledDate: time => {
                    let endDateVal = this.overDate;
                    if (endDateVal) {
                        return time.getTime() > new Date(endDateVal).getTime();
                    }
                }
            },
            pickerOptionsEnd: {
                disabledDate: time => {
                    let beginDateVal = this.createDate;
                    if (beginDateVal) {
                        return (
                            time.getTime() <
                            new Date(beginDateVal).getTime()
                        );
                    }
                },
            },
            //下拉
            vwsubAccIdentifyOptions :[],
            ecommInstallmentPeriodOptions: [],//分期期数
            suspendCycleOptions: [],//暂停期数日期
            /*----详情----*/
            instalDetail: {},
            tableData: [],
            instalDetailPage: {
                pageNum: 1,
                pageSize:10,
            },
            dataFormDetail: {},
            rulesDetail: {},
            dialogFormVisibleDetail: false,
            detailLoading: false,
            totalDetail: 0,//列表
            itemInfo: {},
            /*/----结清---*/
            settleInfo: {},//结清data
            dialogFormVisibleSettle: false,
            dataFormSettle: {},
            rulesSettle: {},
            settleTrial: {},//结清试算data
            rulesSettleTrial: {},
            dataFormSettleTrial: {}, 
            showTrail: false,
            /*----延期----*/
            delayInfo: {},//延期
            rulesDelay: {},
            dataFormDelay: {},
            stagesAdjust: {},
            stagesAdjustPage: {
                pageNum: 1,
                pageSize:10,
            },
            //分期试算
            delayList: [],//data
            dataFormSettleTrial: {},
            dataFormstagesTrial: {},
            rulesstagesTrial: {},
            dialogFormVisibleDelay: false,
            showDelayInfo: false,
            loadingDelayList: false,
            stagesAdjustTotal: 0,
            /*----暂停----*/
           dialogFormVisibleSuspend: false,
           suspendStages: {},
           dataFormSuspend: {},
           rulesSuspend: {},
           //暂停分期试算
           suspendTrial: {},
           rulesSuspendTrial: {},
           dataFormSuspendTrial: {},
           //列表
           suspendList: [],//data
           loadingSuspendList: false,
           suspendTrialTotal: 0,
           showSuspendInfo: false,
           suspendTrialPage: {
                pageNum: 1,
                pageSize:10,
           },
           /*----关联交易----*/
            dialogFormVisibleRelation: false,
            loadingRelationList: {},
            relationList: [],
            itemObj: {},
            relationTotal: 0,
            relationPage: {
                pageNum: 1,
                pageSize:10,
            },
            //查看关联交易
            dialogFormVisibleRelationInfo: false,
            rulesDetailInfo: {},
            /*----提前还款----*/
            creditInfo: {},//提前还款form
            dataFormRepayment: {},
            rulesRepayment: {},
            dialogFormVisibleRepayment: false,
            arrearsList: [],//欠款列表
            loadingArrearsList: false,
            arrearsTotal: 0,
           /*----正常还款----*/
            dialogFormVisibleNormal: false,
            normalRepayment: {},//form
            rulesNormal: {},
            dataFormNormal: {},
            loadingNormalNormal: false,
            normalRepaymentList: [],//列表
          /*----子表详情----*/
            dialogFormVisibleSonDetail: false,
            sonDetail: {},//form
            sonTableData: [],//列表
            rulesSonDetail: {},
            detailSonLoading: false,
            sonInfo: {},
            sonTotal:0,
            sonDetailPage: {
                pageNum: 1,
                pageSize:10,
            },
        }
    },
    created() {
        this.getBtnAuth()
    },
    mounted() {
        //账户类型 
        this.getSelectDict( "dic_accType").then(res => {
            this.vwsubAccIdentifyOptions = res
        })
        // 运营模式 
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0006").then(res => {
            this.operationModeOptions = res
        })
        //币种
        this.getSelectDict( "dic_curreny").then(res => {
            this.ecommTransPostingCurrOptions = res
        })
        //分期期数
        this.getSelectDict( "dic_stageTerm").then(res => {
            this.ecommInstallmentPeriodOptions = res
        })
         //交易来源
        this.getSelectDict( "dic_transactionApproval").then(res => {
            this.ecommSourceCdeOptions = res
        })
        //费用收取方式
        this.getSelectDict( "dic_ecommFeeCollectType").then(res => {
            this.ecommFeeCollectTypeOptions = res
        })
        //利率类型
        this.getSelectDict( "dic_interestRateType").then(res => {
            this.rateIndOptions = res
        })
        //还款方式
        this.getSelectDict( "dic_repaymentMethod").then(res => {
            this.repayModeOptions = res
        })
        //还款日类型
        this.getSelectDict( "dic_repaymentDateType").then(res => {
            this.repaymentDateTypeOptions = res
        })
        //支付方式
         this.getSelectDict( "dic_paymentMethod").then(res => {
            this.paymentPlanOptions = res
        })
        //暂停期限
        this.getSelectDict( "dic_suspensionPeriod").then(res => {
            this.suspendCycleOptions = res
        })
    },
  methods: {
    // 查询按钮权限
    getBtnAuth() {
        //console.log(window.sessionStorage.getItem('menuNo'))
        let params= {
            menuNo : window.sessionStorage.getItem('menuNo')
        }
        this.getTableList('/beta/betaService/COS.CS.01.0030', params ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.length > 0 ) {
                    res.returnData.forEach(item => {
                        this.btnAuthStr += item.eventNo+','
                    })
                    if (this.btnAuthStr.includes('COS.IQ.02.0018')) { // 查询
                        this.selBtnFlag = true
                    } else {
                        this.selBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.AD.02.0018')) { // 新增
                        this.addBtnFlag = true
                    } else {
                        this.addBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.UP.02.0018')) { // 维护
                        this.updBtnFlag = true
                    } else {
                        this.updBtnFlag = false
                    }
                }
            }
        })
    },
    init() {
        this.showTable = false
        this.queryFormObj = {
            externalIdentificationNo: '',
            beginDate: '',
            endDate: '',
        }
    },
     // 重置
    reset() {
      this.init()
    },
    // 时间开始选择器
    startTimeStatus:function(value){
        this.createDate = value
    },
    // 时间结束选择器
    endTimeStatus:function(value){
        this.overDate = value
    },
    // 点击查询按钮
    handleSearch() {
        if (!this.queryFormObj.externalIdentificationNo ) {
            this.$message({
              message: '请输入查询信息',
              type: 'warning'
            }) 
            this.init()
        }
        this.showInfo=true
        this.getList()
    },
     // 循环账户信息表子账户 查询
    loadTable(tree, treeNode, resolve) {
      	setTimeout(() => { 
      		let params1 = {
             	externalIdentificationNo: tree.externalIdentificationNo,
            	globalTransSerialNo: tree.globalTransSerialNo,
        	};
        	params1 = Object.assign(params1, this.queryFormObj);
        	let childList = [];
        	this.getTableList("/nonfi/nonfinanceService/ILS.IQ.01.0025",params1,(res) => {
	            if (res.returnCode == "000000") {
	                if (res.returnData && res.returnData.rows &&res.returnData.rows.length > 0 ) {
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
        this.listLoading1 = true
        this.getTableList('/nonfi/nonfinanceService/ILS.IQ.01.0020', this.queryFormObj ,(res) => {
            if (res.returnCode == '000000') {
                this.listLoading1 = false
                if (res.returnData !=null ) {
                    if ( res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        this.tablesList = res.returnData.rows
                        this.tablesList.forEach(item=>{
                        	 if(item.status == '0'){
		                        item.statusDesc =  '撤銷';   //'撤銷';
		                    }else if(item.status == '1'){
		                        item.statusDesc = '正常'   //'正常';
		                    }else if(item.status == '2'){
		                        item.statusDesc = '逾期';   //'逾期';
		                    }else if(item.status == '3'){
		                        item.statusDesc = '结清';   //'结清';
		                    }else if(item.status == '4'){
		                        item.statusDesc = '全额退货';   //'全额退货';
		                    }
                       	})	
                        this.tableTotal = res.returnData.totalCount
                        this.tablesList.forEach((item, index) => {
                            if(item.loanTypeDesc != '普通信贷'){
                                return this.isAble=true;
                            }else{
                                return this.isAble=false;
                            }
                        })
                        
                    } else {
                       this.tablesList = []
                       this.tableTotal = 0
                        this.listLoading1 = false
                    }
                }
            }
        }, (err) => {
            if (err) {
                this.tablesList = []
                this.tableTotal = 0
                this.listLoading1 = false
            }
        })
    },
    //显示详情弹框
    handleDetail(row) {
        this.dialogFormVisibleDetail = true
        this.itemInfo = Object.assign({}, row)
        this.itemInfo.loanTypeDesc = row.loanTypeDesc
        this.detailInstalData()  
        this.$nextTick(() => {
            this.$refs['dataFormDetail'].clearValidate()
      })
    }, 
    //详情数据
    detailInstalData() {
        this.detailLoading = true
        let obj = {
            accountId: this.itemInfo.accountId,
            currencyCode: this.itemInfo.currencyCode,
            externalIdentificationNo: this.itemInfo.externalIdentificationNo,
            
        }
        obj= Object.assign(obj, this.instalDetailPage)
        this.getTableList('/nonfi/nonfinanceService/ILS.IQ.01.0015', obj ,(res) => {
            if (res.returnCode == '000000') {
                if ((res.returnData && res.returnData.rows && res.returnData.rows.length > 0) || (res.returnData && res.returnData.obj && res.returnData.obj !=null)) {
                    this.instalDetail = res.returnData.obj
                    this.instalDetail.subAccIdentify = this.itemInfo.subAccIdentify
                    console.log(this.instalDetail)
                    //账户类型 
                    this.getSelectDict( "dic_accType",this.itemInfo.subAccIdentify).then(res => {
                        this.vwsubAccIdentifyOptions = res
                        console.log(res)
                    })
                    if( this.instalDetail.currencyCode=='156'){
                         this.instalDetail.currencyCodeInfo='人民币'
                    }else if(this.instalDetail.currencyCode=='840'){
                         this.instalDetail.currencyCodeInfo='美元'
                    }
                    if(res.returnData.obj.status == '0'){
                        this.instalDetail.statusInfo =  '撤銷';   //'撤銷';
                    }else if(res.returnData.obj.status == '1'){
                        this.instalDetail.statusInfo = '正常'   //'正常';
                    }else if(res.returnData.obj.status == '2'){
                        this.instalDetail.statusInfo = '逾期';   //'逾期';
                    }else if(res.returnData.obj.status == '3'){
                    	this.instalDetail.statusInfo = '结清';   //'结清'; 
                    }else if(res.returnData.obj.status == '4'){
                    	this.instalDetail.statusInfo = '退货';   //'结清'; 
                    }
                   if(this.itemInfo.feeCollectType == '0'){
                        this.instalDetail.feeCollectType = '一次性收取';//一次性收取
                    }else if(this.itemInfo.feeCollectType == '1'){
                        this.instalDetail.feeCollectType = '分期收取';//分期收取
                    }
                    if(this.instalDetail.repayMode == '0'){
                        this.instalDetail.repayModeInfo = '期末本息一次付清';   //'期末本息一次付清';
                    }else if(this.instalDetail.repayMode == '2'){
                        this.instalDetail.repayModeInfo = '按固定周期付息、到期还本';   //'按固定周期付息、到期还本';
                    }else if(this.instalDetail.repayMode == '3'){
                        this.instalDetail.repayModeInfo = '等额本息';   //'等额本息';
                    }else if(this.instalDetail.repayMode == '4'){
                        this.instalDetail.repayModeInfo = '等额本金';   //'等额本金';
                    }else if(this.instalDetail.repayMode == '5'){
                        this.instalDetail.repayModeInfo = '等本等息';   //'等本等息';
                    }else if(this.instalDetail.repayMode == '13'){
                        this.instalDetail.repayModeInfo = '首期一次性付息分期还本';   //'首期一次性付息分期还本';
                    }else if(this.instalDetail.repayMode == '14'){
                        this.instalDetail.repayModeInfo = '气球贷(等额本息)';   //"气球贷(等额本息)",
                    }else if(this.instalDetail.repayMode == '15'){
                        this.instalDetail.repayModeInfo = '气球贷(等额本金)';   //"气球贷(等额本金)",
                    }
                    this.tableData =  res.returnData.rows
                    this.totalDetail = res.returnData.rowsCount
                    this.detailLoading = false
                }else{
                    this.instalDetail = {}
                     this.totalDetail = 0
                    this.tableData = []
                }
            }
        }, (err) => {
            if (err) {
                this.instalDetail = {}
                this.totalDetail = 0
                this.tableData = []
            }
        })
    }, 
    /*----退货----*/
    handleReturnedPurchase (row){
        this.$confirm('确定要做退货处理嘛?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => { // 是
                let params = {
                    externalIdentificationNo : row.externalIdentificationNo,
                    ecommTransPostingCurr : row.currencyCode,
                    ecommPostingAcctNmbr: row.accountId,
                    ecommCustId : row.customerNo,
                }
                this.post('/card/cardService/ILS.RT.41.0001', params ,(res) => {
                    if (res.returnCode == '000000') {
                        this.$message('退货成功');
                        this.getList()
                    }else{
                        this.$message(res.returnMsg);
                    }
                })
            }).catch(() => { // 否   

            });
    },
    /*----撤销----*/
    handleRevokePurchase (row){
        this.$confirm('确定要做撤销处理嘛?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => { // 是
                let params = {
                    externalIdentificationNo : row.externalIdentificationNo,
                    ecommTransPostingCurr : row.currencyCode,
                    ecommPostingAcctNmbr: row.accountId,
                    ecommCustId : row.customerNo,
                }
                this.post('/card/cardService/ILS.RT.41.0004', params ,(res) => {
                    if (res.returnCode == '000000') {
                        this.$message('撤销成功');
                        this.getList()
                    }else{
                        this.$message(res.returnMsg);
                    }
                })
            }).catch(() => { // 否   

            });
    },
    //结清
    handlePreHandler(row) {
        this.dialogFormVisibleSettle = true
        this.settleInfo = Object.assign({}, row)
        this.$nextTick(() => {
            this.$refs['dataFormSettle'].clearValidate()
      })
     },
    //显示结清试算form
    handleSettleTrail(){
        this.showTrail=true
        this.settleTrail()
    },
    //结清试算
    settleTrail(){
        let trailParams={}
        trailParams.ecommPostingAcctNmbr = this.settleInfo.accountId;
        trailParams.ecommTransPostingCurr = this.settleInfo.currencyCode;
        trailParams.ecommInstallmentBusinessType = this.settleInfo.loanType;
        trailParams.ecommTriggerFlag = "pageTrigger";
        trailParams.externalIdentificationNo = this.settleInfo.externalIdentificationNo;
         this.post('/card/cardService/ILS.IQ.01.0017', trailParams ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnMsg == 'OK') {
                     this.settleTrial=res.returnData
                }
            }else{
                this.showTrail = false
            }          
        }, (err) => {
            if (err) {
                this.showTrail = false
            }
        })
    },
    //确认提前结清
    createSettleTrail(){
        let obj={}
        obj.ecommPostingAcctNmbr = this.settleInfo.accountId;
        obj.ecommTransPostingCurr = this.settleInfo.currencyCode;
        obj.ecommCustId = this.settleInfo.customerNo;
        obj.ecommTriggerFlag = "pageTrigger";
        obj.externalIdentificationNo = this.settleInfo.externalIdentificationNo;
        this.post('/card/cardService/ILS.RT.40.8001', obj, (res) => {
            if (res.returnCode == '000000') {
                 this.dialogFormVisibleAdd = false
                this.$notify({
                    title: 'Success',
                    message: '提前结清成功',
                    type: 'success',
                    duration: 2000
                })
                this.getList()
                this.dialogFormVisibleSettle = false
                this.showTrail=false
            }
        })
    },
    //延期显示弹框
    handleDeferredStage(row){
        this.dialogFormVisibleDelay = true
        this.delayInfo = Object.assign({}, row)
        this.$nextTick(() => {
            this.$refs['dataFormDelay'].clearValidate()
        })
    },
    //分期调整试算
    handleDeferredTrial(){
        if(this.stagesAdjust.changePeriod=='' || this.stagesAdjust.changePeriod == undefined){
            this.$message({
                title: '提示',
                message: '分期期数不能为空',
                type: 'warning',
                duration: 2000
            })
            return;
        }
        this.showDelayInfo = true
        this.loadingDelayList = true
        let obj={
             ecommPostingAcctNmbr : this.delayInfo.accountId,
            ecommCustId: this.delayInfo.customerNo,
            ecommTransPostingCurr: this.delayInfo.currencyCode,
            changePeriod: this.stagesAdjust.changePeriod,
            externalIdentificationNo: this.delayInfo.externalIdentificationNo,
            pageNum: this.stagesAdjustPage.pageNum,
            pageSize: this.stagesAdjustPage.pageSize,
        }
        this.getTableList('/card/cardService/ILS.IQ.01.0002', obj ,(res) => {
            if (res.returnCode == '000000') {
                if((res.returnData && res.returnData.rows && res.returnData.rows.length > 0) || 
                    (res.returnData && res.returnData.obj && res.returnData.obj.length > 0) ){
                        this.showDelayInfo = true;
                        this.loadingDelayList = false
                        this.stagesAdjust.term = res.returnData.obj.term;//延期总期数
                        this.stagesAdjust.noThrowTerm = res.returnData.obj.noThrowTerm;//延期后未抛期次
                        this.stagesAdjust.delayFee = res.returnData.obj.delayFee;//延期费用
                        this.delayList = res.returnData.rows;//列表
                        this.stagesAdjustTotal = res.returnData.totalCount
                        
                }else {
                    this.$message('暂无数据');
                }
            }else {
                this.showDelayInfo = false;
            }
        }, (err) => {
            if (err) {
                this.showDelayInfo = false;
            }
        })
    },
    //期次调整BTn
    periodAdjust(){
        let item={
            externalIdentificationNo:this.delayInfo.externalIdentificationNo,
            ecommPostingAcctNmbr : this.delayInfo.accountId,
            ecommCustId : this.delayInfo.customerNo,
            ecommTransPostingCurr : this.delayInfo.currencyCode,
            changePeriod : this.stagesAdjust.changePeriod,
        }
        item = Object.assign(this.stagesAdjustPage, item)
        this.getTableList('/card/cardService/ILS.RT.41.0005', item ,(res) => {
            if (res.returnCode == '000000') {
                //this.dialogFormVisibleAdd = false
                this.$notify({
                    title: 'Success',
                    message: '期次调整成功',
                    type: 'success',
                    duration: 2000
                })
                this.getList()
                this.dialogFormVisibleDelay = false
                this.showDelayInfo = false
                
            }
        }, (err) => {
            if (err) {
                console.log(err)
            }
        })
    },
    /*----暂停----*/
   //暂停显示弹框
   handlePauseStage(row){
       this.dialogFormVisibleSuspend = true
        this.suspendStages = Object.assign({}, row)
        this.$nextTick(() => {
            this.$refs['dataFormSuspend'].clearValidate()
        })
   },
   //暂停分期试算
   handleSuspendStages(){
        if(this.suspendTrial.suspendCycle=='' || this.suspendTrial.suspendCycle == undefined){
            this.$message({
                title: '提示',
                message: '暂停期限不能为空',
                type: 'warning',
                duration: 2000
            })
            return;
        }
        this.showSuspendInfo = true
        this.loadingSuspendList = true
        let obj={
            ecommPostingAcctNmbr : this.suspendStages.accountId,
            ecommCustId: this.suspendStages.customerNo,
            ecommTransPostingCurr: this.suspendStages.currencyCode,
            externalIdentificationNo: this.suspendStages.externalIdentificationNo,
            suspendCycle: this.suspendTrial.suspendCycle,
            pageNum: this.suspendTrialPage.pageNum,
            pageSize: this.suspendTrialPage.pageSize,
        }
        this.getTableList('/card/cardService/ILS.IQ.01.0003', obj ,(res) => {
            if (res.returnCode == '000000') {
                if((res.returnData && res.returnData.rows && res.returnData.rows.length > 0) || 
                    (res.returnData && res.returnData.obj && res.returnData.obj.length > 0) ){
                        this.showSuspendInfo = true;
                        this.loadingSuspendList = false
                        this.suspendTrial.suspendStartDate = res.returnData.obj.suspendStartDate;//暂停后开始时间
                        this.suspendTrial.suspendEndDate = res.returnData.obj.suspendEndDate;//暂停后开始时间
                        this.suspendTrial.suspendFee = res.returnData.obj.suspendFee;//暂停后开始时间
                        this.suspendList = res.returnData.rows;//列表
                        this.suspendTrialTotal = res.returnData.totalCount
                        
                }else {
                    this.$message('暂无数据');
                }
            }else {
                this.showSuspendInfo = false;
            }
        }, (err) => {
            if (err) {
                this.showSuspendInfo = false;
            }
        })
    },
   //暂停分期BTn
    suspendSuspendDefine(){
        let item={
            externalIdentificationNo:this.suspendStages.externalIdentificationNo,
            ecommPostingAcctNmbr : this.suspendStages.accountId,
            ecommCustId : this.suspendStages.customerNo,
            ecommTransPostingCurr : this.suspendStages.currencyCode,
            changePeriod : this.suspendTrial.changePeriod,
            suspendCycle:this.suspendTrial.suspendCycle
        }
        item = Object.assign(this.suspendTrialPage, item)
        delete item.pageNum
        delete item.pageSize
        this.getTableList('/card/cardService/ILS.RT.41.0006', item ,(res) => {
            if (res.returnCode == '000000') {
				this.$notify({
                    title: 'Success',
                    message: '暂停分期成功',
                    type: 'success',
                    duration: 2000
                })
                this.getList()
                this.dialogFormVisibleSuspend = false
                this.showSuspendInfo = false
            }
        })
    },
    /*----关联交易----*/
    handleRelationInfo(row){
        this.dialogFormVisibleRelation = true
        this.repaymentInfo = row
        console.log(row)
        this.getRelation()
    },
    //关联交易列表
    getRelation(){
        console.log(this.itemObj)
        this.dialogFormVisibleRelation = true
        this.loadingRelationList = false
        let item={
            accountId: this.repaymentInfo.accountId,
            externalIdentificationNo: this.repaymentInfo.externalIdentificationNo,
            logLevel: "A",
            activityNo: "X8010",
            transProperty: "O",
            isTrans: true,
            transParams: ['dic_ecommTransStatus'],
            transDict: ['transState'],
        }
        item = Object.assign(this.relationPage, item)
        this.getTableList('/nonfi/nonfinanceService/ISS.IQ.03.0010', item ,(res) => {
            if (res.returnCode == '000000') {
                this.loadingRelationList = false
                if(res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                    
                    this.relationList = res.returnData.rows;//列表
                    this.relationList.forEach(item => {   //循环  列表字段拼接
                        item.currencyCodeDesc = item.currencyCode+ ' '+ item.currencyDesc
                    })
                    this.relationTotal = res.returnData.totalCount
                    
                } else {
                    this.relationList = []
                    this.relationTotal = 0
                }
            }
        }, (err) => {
            if (err) {
                this.relationList = []
                this.relationTotal = 0
            }
        }) 
    },
    //关联交易查看显示弹框
    handleRelationDetail(row){
        this.dialogFormVisibleRelationInfo = true
        this.rulesDetailInfo=row
    },
    //原交易
    orginTransInfBtn(row){
        let objQuery = {
            "globalSerialNumbr" : row.oldGlobalSerialNumbr,
            //"eventNo" : 'PT.40',//、、目前定位不到事件编号
            "logLevel" : "A",
            "activityNo" : "X8010",
            //"queryType" : "5"
            "transProperty":"O",
        }
        this.post('/nonfi/nonfinanceService/ISS.IQ.03.0010',objQuery,(res) => {
            if (res.returnCode == '000000') {
                let orginTransInfo = res.returnData.rows[0];
                this.handleRelationDetail(orginTransInfo)
			} 
        })
    },
    /*----信贷提前还款----*/    
    //多选框获取选中状态数据
    handleSelectionChange(val) {
        this.multipleSelection  = val
        this.multipleSelection.forEach((item, index) => {
            if(item.loanTypeDesc != '普通信贷'){
                return this.isAble=true;
            }else{
                return this.isAble=false;
            }
        })
    },
    //显示信贷提前还款弹框
    handleBatchRepayment() {
        this.dialogFormVisibleRepayment = true
        this.getArrears()
    },
    //信贷欠款明细列表
    getArrears(){
        //console.log(12)
        this.dialogFormVisibleRepayment = true
        this.loadingArrearsList = false
        let ecommPostingAcctNmbrs=[]
        let  allAccountId=[]
        this.multipleSelection.forEach((item, index) => {
            allAccountId.push(item.accountId)
        })
        let item={
            ecommEntryId: this.multipleSelection[0].externalIdentificationNo,
            ecommPostingAcctNmbrs: allAccountId
        }
        this.getTableList('/card/cardService/ILS.IQ.01.0008', item ,(res) => {
            if (res.returnCode == '000000') {
                this.loadingRelationList = false
                if(res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                    this.creditInfo = res.returnData;
                    this.arrearsList = res.returnData.interPriBeanByaccount;//列表
                }
            }
        }) 
    },
    //确认提前信贷还款
    getCreditRepayment(){
        let  ecommPostingAcctNmbrs=[]
        let  creditAccountId=[]
        this.arrearsList.forEach((item, index) => {
            creditAccountId.push(item.accountId)
        })
        let obj={
            ecommEntryId: this.creditInfo.ecommEntryId,//外部识别号
            ecommPostingAcctNmbrs: creditAccountId,
        }
        this.getTableList('/card/cardService/ILS.RT.20.0012', obj ,(res) => {
            if (res.returnCode == '000000') {
                this.dialogFormVisibleRepayment = false
                this.$notify({
                    title: 'Success',
                    message: '还款成功',
                    type: 'success',
                    duration: 2000
                })
                this.getList()
                this.dialogFormVisibleRepayment = false
            }
        })
    },
   //显示信贷正常还款弹框
    handleNormalRepayment() {
        //console.log(this.multipleSelection)
        this.dialogFormVisibleNormal = true
        this.getNormalData()
    },
    getNormalData(){
        this.dialogFormVisibleNormal = true
        this.loadingNormalRepayment = false
        let ecommPostingAcctNmbrs=[]
        let  newAccountId=[]
        this.multipleSelection.forEach((item, index) => {
            newAccountId.push(item.accountId)
        })
        let obj={
            ecommEntryId: this.multipleSelection[0].externalIdentificationNo,
            ecommPostingAcctNmbrs: newAccountId
        }
        this.getTableList('/card/cardService/ILS.IQ.01.0012', obj ,(res) => {
            if (res.returnCode == '000000') {
                this.loadingNormalNormal = false
                if(res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                    this.normalRepayment = res.returnData.obj;
                    this.normalRepaymentList = res.returnData.rows;//列表
                } else{
                    this.normalRepayment = {}
                    this.normalRepaymentList = []
                }
            }
        }, (err) => {
            if (err) {
                this.normalRepayment = {}
                this.normalRepaymentList = []
            }
        }) 
    },
    //确认正常信贷还款
    getNormalRepayment(){
        let  ecommPostingAcctNmbrs=[]
        let  normalAccountId=[]
        let  partAccountId={}
        this.normalRepaymentList.forEach((item, index) => {
            normalAccountId.push(item.accountId)
            if(item.partRepayAmt == '' || item.partRepayAmt ==undefined){
                this.$message('正常提前部分还款金额不能为空!');
                return;
            }
        })
        let obj={
            ecommEntryId: this.normalRepayment.ecommEntryId,//外部识别号
            ecommPostingAcctNmbrs: normalAccountId,
            partRepayAmtmap: normalAccountId,
        }
        this.getTableList('/card/cardService/ILS.RT.20.0011', obj ,(res) => {
            if (res.returnCode == '000000') {
                this.dialogFormVisibleRepayment = false
                this.$notify({
                    title: 'Success',
                    message: '还款成功',
                    type: 'success',
                    duration: 2000
                })
                this.getList()
                 this.dialogFormVisibleNormal = false
            }else{
                this.$message(res.returnMsg);
            }
        })
    },
    /*----子表详情弹框----*/
    handleSonDetail(row){
        this.dialogFormVisibleSonDetail = true
        this.sonInfo = Object.assign({}, row)
        this.sonInfo.loanTypeDesc = row.loanTypeDesc
        this.getSonListInfo()
        this.$nextTick(() => {
            this.$refs['dataFormSonDetail'].clearValidate()
      })
    },
    getSonListInfo(){
        this.loadingNormalRepayment = false
        let obj = {
            accountId: this.sonInfo.accountId,
            currencyCode: this.sonInfo.currencyCode,
            externalIdentificationNo: this.sonInfo.externalIdentificationNo,      
        }
        obj= Object.assign(obj, this.instalDetailPage)
        this.getTableList('/nonfi/nonfinanceService/ILS.IQ.01.0015', obj ,(res) => {
            if (res.returnCode == '000000') {
                if ((res.returnData && res.returnData.rows && res.returnData.rows.length > 0) || (res.returnData && res.returnData.obj && res.returnData.obj !=null)) {
                    this.sonDetail = res.returnData.obj
                    //账户类型 
                    this.getSelectDict( "dic_accType",this.sonInfo.subAccIdentify).then(res => {
                        this.vwsubAccIdentifyOptions = res
                    })
                    if( this.sonDetail.currencyCode=='156'){
                         this.sonDetail.currencyCodeInfo='人民币'
                    }else if(this.sonDetail.currencyCode=='840'){
                         this.sonDetail.currencyCodeInfo='美元'
                    }
                    if(this.sonDetail.status == '0'){
                        this.sonDetail.statusInfo =  '撤銷';   //'撤銷';
                    }else if(this.sonDetail.status == '1'){
                        this.sonDetail.statusInfo = '正常'   //'正常';
                    }else if(this.sonDetail.status == '2'){
                        this.sonDetail.statusInfo = '逾期';   //'逾期';
                    }else if(this.sonDetail.status == '3'){
                        this.sonDetail.statusInfo = '结清';   //'结清';
                    }else if(this.sonDetail.status == '4'){
                        this.sonDetail.statusInfo = '退货';   //'结清';
                    }
                   if(this.itemInfo.feeCollectType == '0'){
                        this.sonDetail.feeCollectType = '一次性收取';//一次性收取
                    }else if(this.itemInfo.feeCollectType == '1'){
                        this.sonDetail.feeCollectType = '分期收取';//分期收取
                    }
                    if(this.instalDetail.repayMode == '0'){
                        this.sonDetail.repayModeInfo = '期末本息一次付清';   //'期末本息一次付清';
                    }else if(this.sonDetail.repayMode == '2'){
                        this.sonDetail.repayModeInfo = '按固定周期付息、到期还本';   //'按固定周期付息、到期还本';
                    }else if(this.sonDetail.repayMode == '3'){
                        this.sonDetail.repayModeInfo = '等额本息';   //'等额本息';
                    }else if(this.sonDetail.repayMode == '4'){
                        this.sonDetail.repayModeInfo = '等额本金';   //'等额本金';
                    }else if(this.sonDetail.repayMode == '5'){
                        this.sonDetail.repayModeInfo = '等本等息';   //'等本等息';
                    }else if(this.instalDetail.repayMode == '13'){
                        this.sonDetail.repayModeInfo = '首期一次性付息分期还本';   //'首期一次性付息分期还本';
                    }else if(this.sonDetail.repayMode == '14'){
                        this.sonDetail.repayModeInfo = '气球贷(等额本息)';   //"气球贷(等额本息)",
                    }else if(this.sonDetail.repayMode == '15'){
                        this.sonDetail.repayModeInfo = '气球贷(等额本金)';   //"气球贷(等额本金)",
                    }
                    this.sonTableData =  res.returnData.rows
                   // console.log(this.tablesList)
                    this.sonTotal = res.returnData.totalCount
                    this.detailSonLoading = false
                }else{
                    this.detailSonLoading = false
                    this.sonDetail = {}
                    this.sonTableData = []
                }
            }
        }, (err) => {
            if (err) {
                this.detailSonLoading = false
                this.sonDetail = {}
                this.sonTableData = []
            }
        })
    
    },
    /*信贷逾期还款未写没数据*/
   //公共弹框
    msgDialog(msgTip) {
        const msg = this.$createElement;
        this.$msgbox({
          title: '提示',
          message: msg('p', null, [
            msg('span', {
              style: 'text-align:center;display: block'}, msgTip),
          ]),
          confirmButtonText: '确定',
        }).catch(() => {

        });
    },
    //暂停分期试算
   handleSuspendStages(){
        if(this.suspendTrial.suspendCycle=='' || this.suspendTrial.suspendCycle == undefined){
            this.$message({
                title: '提示',
                message: '暂停期限不能为空',
                type: 'warning',
                duration: 2000
            })
            return;
        }
        this.showSuspendInfo = true
        this.loadingSuspendList = true
        let obj={
            ecommPostingAcctNmbr : this.suspendStages.accountId,
            ecommCustId: this.suspendStages.customerNo,
            ecommTransPostingCurr: this.suspendStages.currencyCode,
            externalIdentificationNo: this.suspendStages.externalIdentificationNo,
            suspendCycle: this.suspendTrial.suspendCycle,
            pageNum: this.suspendTrialPage.pageNum,
            pageSize: this.suspendTrialPage.pageSize,
        }
        this.getTableList('/card/cardService/ILS.IQ.01.0003', obj ,(res) => {
            if (res.returnCode == '000000') {
                if((res.returnData && res.returnData.rows && res.returnData.rows.length > 0) || 
                    (res.returnData && res.returnData.obj && res.returnData.obj.length > 0) ){
                        this.showSuspendInfo = true;
                        this.loadingSuspendList = false
                        this.suspendTrial.suspendStartDate = res.returnData.obj.suspendStartDate;//暂停后开始时间
                        this.suspendTrial.suspendEndDate = res.returnData.obj.suspendEndDate;//暂停后开始时间
                        this.suspendTrial.suspendFee = res.returnData.obj.suspendFee;//暂停后开始时间
                        this.suspendList = res.returnData.rows;//列表
                        this.suspendTrialTotal = res.returnData.totalCount
                        
                }else {
                    this.$message('暂无数据');
                }
            }else {
                this.showSuspendInfo = false;
            }
        }, (err) => {
            if (err) {
                this.showSuspendInfo = false;
            }
        })
    },
    
  }
}
</script>

<style>
</style>

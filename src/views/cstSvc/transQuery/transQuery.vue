<!-- 金融交易查询 -->
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
        <el-table
            v-loading = "config.loading"
            v-show="showTable"
            :data="tableData"
            class="mbtm20"
            fit
            highlight-current-row
            style="width: 100%;"
            border
            row-key="id"
            lazy
            :load="loadTable"
            :tree-props="{children: 'children', hasChildren: 'haveChild'}"
        >
            <el-table-column prop="externalIdentificationNo" label="外部识别号/账户号" align="center" width = "180">
                <template slot-scope="{row}">
                    <span v-if="!row.externalIdentificationNo">
                        {{row.accountId}}
                    </span>
                    <span else="row.externalIdentificationNo !='' ">
                        {{row.externalIdentificationNo}}
					</span>
                </template>
            </el-table-column>
            <el-table-column prop="transCurrDesc" label="交易币种" align="center" />
            <el-table-column prop="transAmount" label="交易金额" align="center" />
            <el-table-column prop="transDate" label="交易日期" align="center"  width = "150" />
            <el-table-column prop="postingAmount" label="入账金额" align="center" />
            <el-table-column prop="occurrDate" label="入账日期" align="center"  width = "150" />
            <el-table-column prop="occurrTime" label="入账时间" align="center"  width = "150" />
            <el-table-column prop="eventNo" label="事件编号" align="center"  width = "150" />
            <el-table-column prop="transStateDesc" label="交易状态" align="center" />
            <el-table-column prop="transDesc" label="交易描述" align="center" width = "150" />
            <el-table-column prop="" label="操作" align="center" width = "450">
                <template slot-scope="{row}">
                    <el-button size="mini" type="primary"
                        v-if=" row.haveChild == true"
                        @click="handle1(row)">关联交易</el-button>
                    <el-button size="mini" type="primary" 
                        v-if=" row.haveChild == true"
                        @click="handle2(row)">同源交易</el-button>
                    <el-button size="mini" type="primary" @click="handle3(row)">入账情况</el-button>
                    <el-button size="mini" type="primary" @click="handle4(row)">核算处理</el-button>
                    <el-button size="mini" type="primary" 
                        v-if=" row.haveChild == true && (row.eventNo.search('PT.20') > 0 || row.eventNo.search('PT.13') > 0 || row.eventNo.search('PT.41') > 0 || row.eventNo.search('PT.43') > 0 || row.eventNo.search('PT.61') > 0 )" 
                        @click="handle6(row)">延滞冲减</el-button>
                    <el-button size="mini" type="primary" @click="handle5(row)">详情</el-button>
                </template> 
            </el-table-column>
        </el-table>
        <pagination v-show="config.total>0" :total="config.total" :page.sync="config.pageNum" :limit.sync="config.pageSize" @pagination="getList" />
        
        <!-- 关联交易 -->
        <div v-if="showTable1" >
            <div class="text_title">关联交易列表</div>
            <el-table
                v-loading = "config1.loading"
                v-show="showTable1"
                :data="tableData1"
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
                        <span else="row.externalIdentificationNo !='' ">
                            {{row.externalIdentificationNo}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="transCurrDesc" label="交易币种" align="center" />
                <el-table-column prop="transAmount" label="交易金额" align="center" />
                <el-table-column prop="transDate" label="交易日期" align="center"  width = "150" />
                <el-table-column prop="postingAmount" label="入账金额" align="center" />
                <el-table-column prop="occurrDate" label="入账日期" align="center"  width = "150" />
                <el-table-column prop="transDesc" label="交易描述" align="center" width = "150" />
                <el-table-column prop="" label="操作" align="center" width = "450">
                    <template slot-scope="{row}">
                        <el-button size="mini" type="primary" @click="handle11(row)">同源交易</el-button>
                        <el-button size="mini" type="primary" @click="handle12(row)">入账情况</el-button>
                        <el-button size="mini" type="primary" @click="handle5(row)">详情</el-button>
                    </template> 
                </el-table-column>
            </el-table>
            <pagination v-show="config1.total>0" :total="config1.total" :page.sync="config1.pageNum" :limit.sync="config1.pageSize" @pagination="getList1(this.row1)" />
            
        </div>
        
        
        <!-- 同源交易列表 -->
        <div v-if="showTable2">
            <div class="text_title">同源交易列表</div>
            <el-table
                v-loading = "config2.loading"
                v-show="showTable2"
                :data="tableData2"
             	:key="tableList2"
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
                        <span else="row.externalIdentificationNo !='' ">
                            {{row.externalIdentificationNo}}
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="transCurrDesc" label="交易币种" align="center" width = "150">
                    <template slot-scope="{row}">
                            {{row.transCurrCde}}
                            {{row.transCurrDesc}}
                    </template>
                </el-table-column>
                <el-table-column prop="transAmount" label="交易金额" align="center" />
                <el-table-column prop="transDate" label="交易日期" align="center"  width = "150" />
                <el-table-column prop="postingAmount" label="入账金额" align="center" />
                <el-table-column prop="occurrDate" label="入账日期" align="center"  width = "150" />
                <!-- <el-table-column prop="occurrDate" label="入账时间" align="center"  width = "150" /> -->
                <el-table-column prop="eventNo" label="事件编号" align="center"  width = "150" />
                <!-- <el-table-column prop="transStateDesc" label="交易状态" align="center" /> -->
                <el-table-column prop="transDesc" label="交易描述" align="center" width = "150" />
                <el-table-column prop="" label="操作" align="center">
                    <template slot-scope="{row}">
                        <el-button size="mini" type="primary" @click="handle5(row)">详情</el-button>
                    </template> 
                </el-table-column>
            </el-table>
            <pagination v-show="config2.total>0" :total="config2.total" :page.sync="config2.pageNum" :limit.sync="config2.pageSize" @pagination="getList2(this.row2)" />

        </div>
        
        <!-- 入账情况 -->
        <div v-if="showTable3">
            <div  class="text_title">入账情况</div>
            <el-table
                v-loading = "config3.loading"
                v-show="showTable3"
                :data="tableData3"
                key="tableList3"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
            >
                <el-table-column prop="accountId" label="账户号" align="center" width = "220" />
                <el-table-column prop="balanceTypeDesc" label="余额类型" align="center" />
                <el-table-column prop="" label="交易币种" align="center" width = "100">
                    <template slot-scope="{row}">
                        {{row.transCurrCde}}
                        {{row.transCurrDesc}}
                    </template>
                </el-table-column>
                <el-table-column prop="transAmount" label="交易金额" align="center" />
                <el-table-column prop="transDate" label="交易日期" align="center" width = "100" />
                <el-table-column prop="postingAmount" label="入账金额" align="center" />
                <el-table-column prop="occurrDate" label="入账日期" align="center"  width = "100" />
                <el-table-column prop="actualPostingAmount" label="实际入账金额" align="center"  width = "100" />
                <el-table-column prop="" label="操作" align="center" width = "250" >
                    <template slot-scope="{row}">
                        <el-button size="mini" type="primary" @click="handle31(row)">查询余额单元分配情况</el-button>
                        <el-button size="mini" type="primary" @click="handle5(row)">详情</el-button>
                    </template> 
                </el-table-column>
            </el-table>
            <pagination v-show="config3.total>0" :total="config3.total" :page.sync="config3.pageNum" :limit.sync="config3.pageSize" @pagination="getList3(this.row3)" />
        </div>
        
        <!-- 交易信息弹窗 -->
        <el-dialog title="交易信息" :visible.sync="transInfo_dialog"  width="65%">
            <trans-info
                :formObj="transInfoObj"
                @returnedPurchaseBtn="returnedPurchaseBtn(transInfoObj)"
                @partReturnedPurchaseBtn="partReturnedPurchaseBtn(transInfoObj)"
                @transStageDetailBtn="transStageDetailBtn"
                @disputeRegistBtn="disputeRegistBtn"
                @disputeReleaseCstBtn="disputeReleaseCstBtn"
                @disputeReleaseBankBtn="disputeReleaseBankBtn"
                @disputeAccQueryBtn="disputeAccQueryBtn(transInfoObj)"
                @stagingAccInfoBtn="stagingAccInfoBtn"
            ></trans-info>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="transInfo_dialog = false">
                    关闭
                </el-button>
            </div>
        </el-dialog>

        <!-- 部分退货 弹窗 -->
        <el-dialog title="交易信息" :visible.sync="partReturn_dialog"  width="65%">
            <el-form ref="partReturnRef" :model="partReturnObj" :rules="partReturnRules">
                <el-form-item class="cl_td bnone" label="原交易金额" prop="transAmount" >
                    <el-input v-model="partReturnObj.transAmount" class="wd200" type="text" readonly />
               </el-form-item>
               <el-form-item class="cl_td bnone" label="已退货金额" prop="rejectedAmount" >
                     <el-input v-model="partReturnObj.rejectedAmount" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="退货金额" prop="ecommTransPostingAmount">
                    <el-input v-model="partReturnObj.ecommTransPostingAmount" class="wd200" type="text"  />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="surePartReturn">
                    部分退货
                </el-button>
                <el-button @click="partReturn_dialog = false">
                    关闭
                </el-button>
            </div>
        </el-dialog>
        
        <!-- 交易分期 弹窗 -->
        <el-dialog title="交易分期详情" :visible.sync="transStage_dialog"  width="65%">
            <div  class="text_title">选择交易事件类型</div>
            <el-table
                v-loading = "transStage_config.loading"
                :data="transStage_tableData"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
                @current-change="transStage_handleCurrChange"
                @row-click="transStage_chooseCurrRow"
            >
                <el-table-column width="55">
                    <template slot-scope="scope">
                    <el-radio v-model="transStage_curRadio" :label="scope.row.eventNo">
                        <span class="el-radio__label"></span>
                    </el-radio>
                    </template>
                </el-table-column>
                <el-table-column prop="eventNo" label="事件编号" align="center" />
                <el-table-column prop="eventDesc" label="事件描述" align="center"  />
            </el-table>
            <div  class="text_title">输入交易详细信息</div>
            <el-form ref="transStageRef" :model="transStageObj" :rules="transStageRules">
                <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo" 
                :rules="[ { required: true, message: '外部识别号不能为空'} ]">
                    <el-input v-model="transStageObj.externalIdentificationNo" class="wd200" type="text"  />
               </el-form-item>
               <el-form-item class="cl_td" label="分期期数" prop="ecommInstallmentPeriod" 
                :rules="[ { required: true, message: '分期期数不能为空'} ]">
                    <el-select v-model="transStageObj.ecommInstallmentPeriod" class="wd200" clearable>
                        <el-option
                        v-for="(item, index ) in ecommInstallmentPeriodOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="分期金额" prop="transAmount">
                    <el-input v-model="transStageObj.transAmount" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="入账币种" prop="postingCurrencyCode">
                    <el-select v-model="transStageObj.postingCurrencyCode" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in currencyCodeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>

                <el-form-item class="cl_td" label="费用收取方式" prop="ecommFeeCollectType">
                    <el-select v-model="transStageObj.postingCurrencyCode" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in ecommFeeCollectTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <div class="cl_tr text_center">
                    <el-button size="medium" type="primary" @click="stageTrialBtn()">分期试算</el-button>
                    <el-button size="medium" type="primary" @click="stageApplyBtn">分期申请</el-button>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="transStage_dialog = false">
                    关闭
                </el-button>
            </div>
        </el-dialog>

        <!-- 分期试算 弹窗 -->
        <el-dialog title="分期试算详情" :visible.sync="trailStage_dialog"  width="65%">
            <el-form ref="trailStageRef" :model="trailStageObj" :rules="trailStageRules">
                <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo" 
                :rules="[ { required: true, message: '外部识别号不能为空'} ]">
                    <el-input v-model="trailStageObj.externalIdentificationNo" class="wd200" type="text"  />
               </el-form-item>
               <el-form-item class="cl_td" label="业务类型" prop="ecommBusineseType">
                    <el-input v-model="trailStageObj.ecommBusineseType" class="wd200" type="text"  readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="金额" prop="loanAmt">
                    <el-input v-model="trailStageObj.loanAmt" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="币种" prop="currencyCode">
                    <el-input v-model="trailStageObj.currencyCode" class="wd200" type="text" readonly />
                </el-form-item>

                <el-form-item class="cl_td" label="利率 %" prop="loanRate">
                    <el-input v-model="trailStageObj.loanRate" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="费率" prop="feeRate">
                    <el-input v-model="trailStageObj.feeRate" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="总费用" prop="allFeeAmt">
                    <el-input v-model="trailStageObj.allFeeAmt" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="总期数" prop="term">
                    <el-input v-model="trailStageObj.term" class="wd200" type="text" readonly />
                </el-form-item>
                <div  class="text_title">分期试算结果</div>
                <el-table
                    v-loading = "trailStage_config.loading"
                    :data="trailStage_tableData"
                    class="mbtm20"
                    fit
                    highlight-current-row
                    style="width: 100%;"
                    border
                >
                    <el-table-column prop="termNo" label="期次" align="center" />
                    <el-table-column prop="throwDate" label="当期抛账日" align="center"  />
                    <el-table-column prop="principalAmount" label="应还本金" align="center" />
                    <el-table-column prop="interestAmount" label="应还利息" align="center"  />
                    <el-table-column prop="feeAmount" label="应还费用" align="center" />
                </el-table>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="trailStage_dialog = false">
                    关闭
                </el-button>
            </div>
        </el-dialog>

        <!-- 争议账户查询 弹窗 -->
        <el-dialog title="争议账户详情" :visible.sync="disputeAcc_dialog"  width="65%">
            <dispute-acc-info
                :formObj="disputeAccObj"
            ></dispute-acc-info>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="disputeAcc_dialog = false">
                    关闭
                </el-button>
            </div>
        </el-dialog>

        <!-- 分期账户信息查询 弹窗 -->
        <el-dialog title="分期账户信息查询" :visible.sync="stageAcc_dialog"  width="65%">
            <stage-acc-info
                :config= "stageAcc_config"
                :tableData= "stageAcc_tableData"
                :rowClick="stageAcc_handleDetail"
                :refreshList="getStageAccList"
            ></stage-acc-info>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="stageAcc_dialog = false">
                    关闭
                </el-button>
            </div>
        </el-dialog>

        <!-- 分期账户 详情 弹窗 -->
        <el-dialog title="分期账户详情" :visible.sync="stageAccDetai_dialog"  width="65%">
            <stage-acc-detail
                :config= "stageAccDetai_tableData"
                :tableData= "stageAcc_tableData"
                :formObj= "stageAccDetaiObj"
            ></stage-acc-detail>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="stageAccDetai_dialog = false">
                    关闭
                </el-button>
            </div>
        
        </el-dialog>


         <!-- 余额单元入账情况 弹窗 queryBalUnitInfo-->
         <el-dialog title="余额单元入账情况" :visible.sync="balUnit_dialog"  width="85%">
            <el-table
                v-loading = "balUnit_config.loading"
                :data="balUnit_tableData"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
            >
                <el-table-column prop="entityKey" label="余额单元代码" align="center" width = "100" />
                <el-table-column prop="balanceTypeDesc" label="余额类型" align="center" />
                <el-table-column prop="" label="交易币种" align="center" width = "100">
                    <template slot-scope="{row}">
                        {{row.transCurrCde}}
                        {{row.transCurrDesc}}
                    </template>
                </el-table-column>
                <el-table-column prop="transAmount" label="交易金额" align="center" />
                <el-table-column prop="transDate" label="交易日期" align="center"  />
                <el-table-column prop="postingAmount" label="入账金额" align="center" />
                <el-table-column prop="occurrDate" label="入账日期" align="center"  width = "100" />
                <el-table-column prop="transDesc" label="交易描述" align="center" />
                <el-table-column prop="actualPostingAmount" label="实际入账金额" align="center"  width = "100" />
                <el-table-column prop="" label="操作" align="center" >
                    <template slot-scope="{row}">
                        <el-button size="mini" type="primary" @click="handle5(row)">详情</el-button>
                    </template> 
                </el-table-column>
            </el-table>
            <pagination v-show="balUnit_config.total>0" :total="balUnit_config.total" :page.sync="balUnit_config.pageNum" :limit.sync="balUnit_config.pageSize" @pagination="balUnit_getList(this.balUnit_row)" />
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="balUnit_dialog = false">
                    关闭
                </el-button>
            </div>
        </el-dialog>

       

        <!-- 核算处理 弹窗 -->
        <el-dialog title="核算处理" :visible.sync="accTreat_dialog"  width="85%">
            <acc-treate
                :formObj="accTreatObj"
                :config="accTreatObj"
                :tableData = "accTreat_tableData"
                @handleDetail="accTreat_handleDetail"
            ></acc-treate>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="accTreat_dialog = false">
                    关闭
                </el-button>
            </div>
        </el-dialog>


        <!-- 核算处理详情 弹窗 -->
        <el-dialog title="核算处理详情" :visible.sync="accTreatDetail_dialog"  width="85%">
            <acc-treate-detail
                :formObj="accTreatDetailObj"
            ></acc-treate-detail>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="accTreatDetail_dialog = false">
                    关闭
                </el-button>
            </div>
        </el-dialog>

        <!-- 延滞冲减 弹窗 -->
        <el-dialog title="延滞冲减详情" :visible.sync="delayedDown_dialog"  width="85%">
            <delayed-down
                :config="delayedDown_config"
                :tableData="delayedDown_tableData"
            ></delayed-down>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="delayedDown_dialog = false">
                    关闭
                </el-button>
            </div>
        </el-dialog>




    </div>
</template>
<script>
import Pagination from '@/components/Pagination'
import TransInfo from '@/components-ider/cstSvc/TransInfo'
import DisputeAccInfo from '@/components-ider/cstSvc/DisputeAccInfo'
import StageAccInfo from '@/components-ider/cstSvc/StageAccInfo'
import StageAccDetail from '@/components-ider/cstSvc/StageAccDetail'
import AccTreate from '@/components-ider/cstSvc/AccTreate'
import AccTreateDetail from '@/components-ider/cstSvc/AccTreateDetail'
import DelayedDown from '@/components-ider/cstSvc/DelayedDown'









export default {
    name: 'TransQuery',
    components: {
        // eslint-disable-next-line vue/no-unused-components
        Pagination,
        TransInfo, // 交易信息
        DisputeAccInfo, // 争议账户查询
        StageAccInfo, // 分期账户查询
        StageAccDetail, // 分期账户明细
        AccTreate, // 核算处理
        AccTreateDetail, // 核算处理详情
        DelayedDown, // 延滞冲减
    },
    
    data() {
        return {
            // 列表
            queryFormRef: {},
            queryForm: {
                idType: '',
                idNumber: '',
                externalIdentificationNo: '',
                
                businessType: '',
                startDate: '',
                endDate: '',
            },
            showTable: false,
            config: {
                loading: false,
                pageNum: 1,
                pageSize: 10,
                total: 0
            },
            tableData: [],
            // 关联交易
            showTable1: false,
            config1: {
                loading: false,
                pageNum: 1,
                pageSize: 10,
                total: 0
            },
            tableData1: [],
            // 同源交易列表
            showTable2: false,
            config2: {
                loading: false,
                pageNum: 1,
                pageSize: 10,
                total: 0
            },
            tableData2: [],
            tableList2: '',
            row2: {},

            // 入账情况
            showTable3: false,
            config3: {
                loading: false,
                pageNum: 1,
                pageSize: 10,
                total: 0
            },
            tableData3: [],
            tableList3: "",
            row3: {},


            // 下拉框
            idTypeList: [],
            businessTypeList: [],
            ecommTransStatusOptions: [],
            pickerOptionsStart: {}, //  起始时间
            pickerOptionsEnd:{}, // 结束时间
            ecommInstallmentPeriodOptions: [],
            currencyCodeOptions: [],
            ecommFeeCollectTypeOptions: [], // 费用收取方式

            // 交易信息弹窗
            transInfo_dialog: false,
            transInfoObj: {},
            //余额单元分配情况 弹窗
            balUnit_dialog: false,
            balUnit_config: {
                loading: false,
                pageNum: 1,
                pageSize: 10,
                total: 0
            },
            balUnit_tableData: [],
            balUnit_row: {},
            ecommTransDate: '',// 运营日期即交易日期
            custSystemUnitNo: '', // 户的系统单元
            // 部分退货
            partReturn_dialog: false,
            partReturnRef : {},
            partReturnObj : {},
            partReturnRules : {},
            // 交易分期弹窗
            transStage_dialog: false,
            transStage_config: {
                loading: false,
                pageNum: 1,
                pageSize: 10,
                total: 0
            },
            transStage_tableData: [],
            transStageRef: {},
            transStageObj: {},
            transStageRules: {},
            transStage_curRadio: '',
            transStage_curRow: {},
            // 分期试算 弹窗
            trailStage_dialog : false,
            trailStageObj: {},
            trailStageRef: {},
            trailStageRules: {},
            trailStage_config: {
                loading: false,
                pageNum: 1,
                pageSize: 10,
                total: 0
            },
            trailStage_tableData: [],
            // 争议账户
            disputeAcc_dialog: false,
            disputeAccObj: {},
            // 分期账户
            stageAcc_dialog: false,
            stageAccObj: {},
            stageAcc_config:{
                loading: false,
                pageNum: 1,
                pageSize: 10,
                total: 0
            },
            stageAcc_tableData: [],
            //分期账户 详情
            stageAccDetai_dialog: false,
            stageAccDetaiObj: {},
            stageAccDetai_config:{
                loading: false,
                pageNum: 1,
                pageSize: 10,
                total: 0
            },
            stageAccDetai_tableData: [],
            // 核算处理 弹窗
            accTreat_dialog: false,
            accTreatObj: {},
            accTreat_config:{
                loading: false,
                pageNum: 1,
                pageSize: 10,
                total: 0
            },
            accTreat_tableData: [],
            // 核算处理 详情 弹窗
            accTreatDetail_dialog: false,
            accTreatDetailObj: {},
            // 延滞冲减
            delayedDown_dialog:  false,
            delayedDown_config:{
                loading: false,
                pageNum: 1,
                pageSize: 10,
                total: 0
            },
            delayedDown_tableData: [],


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
         // 分期期数
         this.getSelectDict('dic_stageTerm').then((res) => {
            this.ecommInstallmentPeriodOptions = res
        })
         // 币种
         this.getSelectDict('dic_curreny').then((res) => {
            this.currencyCodeOptions = res
        })
         // 费用收取方式
         this.getSelectDict('dic_ecommFeeCollectType').then((res) => {
            this.ecommFeeCollectTypeOptions = res
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
            this.getCustSystemUnitNo() // 获得查询客户的系统单元，非登录用户
        },
        // 获取列表
        getList() {
            this.config.loading = true
            let params = {
                activityNo : "X8010",
                logLevel : "A",
                transProperty : "O",
                pageFlag : "mainPage",
                isTrans: true,
                transParams:['dic_ecommTransStatus'],
                transDict : ['transState']
            }
            params = Object.assign(params, this.config, this.queryForm )
            this.getTableList('/nonfi/nonfinanceService/BSS.IQ.03.0013', params ,(res) => {
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
        // 关联交易
        getList1(row) {
            // this.showTable2 = false
            // this.showTable3 = false
            // this.showTable1 = true
            this.config1.loading = true
            let params = {
                globalSerialNumbr : row.globalSerialNumbr,
                globalSerialNumbrRelative: row.globalSerialNumbrRelative,
				idType: this.queryForm.idType,
				idNumber: this.queryForm.idNumber,
				externalIdentificationNo : this.queryForm.externalIdentificationNo,
				businessType: this.queryForm.businessType,
				eventNo:"ISS.PT.60.0002",
				queryType: "6"
            }
            params = Object.assign(params, this.config1 )
            this.getTableList('/nonfi/nonfinanceService/ISS.IQ.03.0110', params ,(res) => {
                if (res.returnCode == '000000') {
                    this.config1.loading = false
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.tableData1 = res.returnData.rows
                        this.config1.total = res.returnData.totalCount
                    } else {
                        this.tableData1 = []
                    }
                }
            })
        },
        // 同源交易列表
        getList2(row) {
            // this.showTable1 = false
            // this.showTable3 = false
            // this.showTable2 = true
            this.config2.loading = true
            let params = {
                "globalSerialNumbr" : row.globalSerialNumbr,
				"eventNo" : row.eventNo,
				"logLevel" : "A",
				"activityNo" : "X8010|X8011",
				"queryType" : "1"
            }
            params = Object.assign(params, this.config2,  this.queryForm)
            this.getTableList('/nonfi/nonfinanceService/ISS.IQ.03.0010', params ,(res) => {
                if (res.returnCode == '000000') {
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
        // 入账情况
        getList3(row) {
            // this.showTable1 = false
            // this.showTable2 = false
            // this.showTable3 = true
            this.config3.loading = true
            let params = {
                "globalSerialNumbr" : row.globalSerialNumbr,
                "accountId" : row.accountId,
                "currencyCode" : row.currencyCode,
                "logLevel" : "T",
                pageFlag: 'mainPage',
                isTrans: true,
                transParams:['dic_balanceType'],
                transDict : ['balanceType']
            }
            params = Object.assign( params, this.config3, this.queryForm)
            this.getTableList('/nonfi/nonfinanceService/BSS.IQ.03.0013', params ,(res) => {
                if (res.returnCode == '000000') {
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
        // 查询子账户 懒加载
        loadTable(tree, treeNode, resolve) {
            // console.log(tree)
            // console.log(treeNode)
            // console.log(resolve)
            setTimeout(() => {
                // delete this.config.transProperty
                let params1 = {
                    activityNo : "X8010",
                    logLevel : "A",
                    accFlag : "mainAcc",
                    queryType : '2',
                    globalSerialNumbr : tree.globalSerialNumbr,
                    customerNo : tree.customerNo,
                    currencyCode : tree.currencyCode,
                    eventNo: tree.eventNo
                }
                params1 = Object.assign(params1, this.queryForm)
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
        
        // 关联交易按钮
        handle1(row) {
            this.showTable2 = false
            this.showTable3 = false
            this.showTable1 = true
            this.row1 = row
            this.getList1(this.row1)
        },
        // 同源交易按钮
        handle2(row) {
            this.showTable1 = false
            this.showTable2 = true
            this.showTable3 = false
            
            this.row2 = row
            this.getList2(row)
        },
        // 入账情况按钮
        handle3(row) {
            this.showTable1 = false
            this.showTable2 = false
            this.showTable3 = true
            this.row3 = row
            this.getList3(row)
        },
        // 核算处理按钮
        handle4(row) {
            this.accTreat_dialog = true
            this.accTreatObj = row
            this.getAccTreatList(row)
        },
        // 获取核算处理 list
        getAccTreatList(row) {
            this.accTreat_config.loading = true
            let params = {
                modifyType: 'ALL',
                accountId : row.accountId,
                globalSerialNumber : row.globalSerialNumbr
            }
            params = Object.assign( params, this.accTreat_config,  this.queryForm)
            this.getTableList('/nonfi/nonfinanceService/COS.IQ.01.0014', params,(res) => {
                if (res.returnCode == '000000') {
                    this.accTreat_config.loading = false
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.accTreat_tableData = res.returnData.rows
                        this.accTreat_config.total = res.returnData.totalCount
                    } else {
                        this.accTreat_tableData = []
                    }
                }
            })
        },
        // 核算处理中 详情按钮
        accTreat_handleDetail(row) {
            this.accTreatDetail_dialog = true
            this.accTreatDetailObj = Object.assign({}, row)
        },
        // 详情按钮
        handle5(row) {
            this.transInfo_dialog = true
            if ( row.transState) {
                this.ecommTransStatusOptions.forEach(item => {
                    if (row.transState == item.codes) {
                        row.transStateDesc = item.detailDesc
                    }
                })
            }
            if (row.businessTypeCode) {
                row.businessTypeCodeConcat = row.businessTypeCode+ row.businessDesc
            }
            if (row.balanceObjectCode) {
                row.balanceObjectCodeConcat = row.balanceObjectCode+ row.objectDesc
            }
            let obj = {
                eventId: row.eventNo,
                requestType:'1'
            }
            // 查询 是否可做争议登记
            this.post('/beta/betaService/COS.IQ.02.0001', obj ,(res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData) {
                        //判断是否可做争议登记，disputeFlag==‘Y’ 时可争议
                        // this.transInfoObj.disputeFlag =  res.returnData.disputeFlag
                        row.disputeFlag =  res.returnData.disputeFlag
                        this.transInfoObj = row
                    }
                }
            })
        },
        // 延滞冲减按钮
        handle6(row) {
            console.log('延滞冲减按钮')
            this.delayedDown_dialog = true
            this.getDelayedDownList(row)
        },
        //获取 延滞冲减 list
        getDelayedDownList(row) {
            this.delayedDown_config.loading = true
            let params = {
                globalSerialNumbr : row.globalSerialNumbr,
				customerNo : row.customerNo
            }
            params = Object.assign(params,this.delayedDown_config,  this.queryForm)
            this.getTableList('/nonfi/nonfinanceService/ISS.IQ.03.0015', params, (res) => {
                if (res.returnCode == '000000') {
                    this.delayedDown_config.loading = false
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.delayedDown_tableData = res.returnData.rows
                        this.delayedDown_config.total = res.returnData.totalCount
                    } else {
                        this.delayedDown_tableData = []
                    }
                }
            })
        },

        // 关联交易列表中 按钮
        handle11(row) { // 同源交易
            this.showTable1 = true // 关联交易
            this.showTable2 = true // 同源交易
            this.showTable3 = false // 入账情况
            this.row2 = row
            this.getList2(row)
        },
        handle12(row) { // 入账情况
            this.showTable1 = true // 关联交易
            this.showTable2 = false // 同源交易
            this.showTable3 = true // 入账情况
            this.row3 = row
            this.getList3(row)
        },

        // 入账情况列表中 按钮
        handle31(row) {
            this.balUnit_dialog= true
            this.balUnit_row = row
            this.balUnit_getList(row)
        },
        //余额单元分配情况
        balUnit_getList (row) {
            this.balUnit_config.loading = true
            let params = {
				globalSerialNumbr : row.globalSerialNumbr,
				accountId : row.accountId,
				currencyCode : row.currencyCode,
				logLevel : "B",
				queryType : "4",
				balanceType: 'F',
                isTrans: true,
                transParams:['dic_balanceType'],
                transDict : ['balanceType']
            }
            params = Object.assign(params , this.balUnit_config, this.queryForm  )
            this.getTableList('/nonfi/nonfinanceService/ISS.IQ.03.0010', params ,(res) => {
                if (res.returnCode == '000000') {
                    this.balUnit_config.loading = false
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.balUnit_tableData = res.returnData.rows
                        this.balUnit_config.total = res.returnData.totalCount
                    } else {
                        this.balUnit_tableData = []
                    }
                }
            })
        },


        // 获得查询客户的系统单元，非登录用户
        getCustSystemUnitNo() {
            let params = {
                idType: this.queryForm.idType,
				idNumber : this.queryForm.idNumber,
				externalIdentificationNo : this.queryForm.externalIdentificationNo,
            }
            this.post('/nonfi/nonfinanceService/BSS.IQ.01.0001', params ,(res) => {
                if (res.returnCode == '000000') {
					this.custSystemUnitNo = res.returnData.systemUnitNo;
					this.queryTransDate(this.custSystemUnitNo);//将下一处理时间赋值交易时间
				}
                
            })
        }, 
        // 查询运营日期即交易日期，因poc环境日期与自然日期相差太远
        queryTransDate(systemUnitNo) {
            this.post('/beta/betaService/COS.IQ.02.0038',{ systemUnitNo: systemUnitNo } ,(res) => {
                if (res.returnCode == '000000') {
                    this.ecommTransDate = res.returnData.rows[0].nextProcessDate;
				}
            })
        },



    // 全部退货
    returnedPurchaseBtn (e) {
        console.log(e)
        console.log('全部退货')
        // this.$emit('returnedPurchaseBtn', this.transInfoObj)
        let url 
        if (e.eventNo == 'ISS.PT.40.0001') {
            url= 'ISS.RT.41.0001'
        } else if (e.eventNo == 'ISS.PT.40.0002') {
            url = 'ISS.RT.41.0002'
        } else if (e.eventNo == 'ILS.XT.00.0001' || e.eventNo == 'ILS.XT.00.0003' || e.eventNo == 'ILS.XT.00.0004' || e.eventNo == 'ILS.XT.00.0005'
				|| e.eventNo == 'ILS.XT.00.0006' ) {
            url = 'ILS.RT.41.0001'
        }
        let params = {
                idType : this.queryForm.idType,
				idNumber :  this.queryForm.idNumber,
				externalIdentificationNo :  this.queryForm.externalIdentificationNo,
				ecommOrigGlobalSerialNumbr : e.globalSerialNumbr,
				ecommEntryId : e.externalIdentificationNo,
				ecommOrigEventId : e.eventNo,
				ecommTransCurr : e.transCurrCde,
				ecommTransAmount : e.transAmount,
				ecommTransDate : this.ecommTransDate,
				ecommTransPostingCurr : e.postingCurrencyCode,
				ecommTransPostingAmount : e.postingAmount,
				ecommTransStatus : e.transState,
				ecommOriTransDate : e.transDate,
				ecommClearAmount : e.settlementAmount,
				ecommPostingAcctNmbr: e.accountId,
				ecommBalType: e.balanceType,
				ecommCustId : e.customerNo,
				ecommRejectStatus: 'FRT',//FRT-全部退货，PRT-部分退货
				ecommPostingExchangeRate:e.postingConvertRate,
				ecommClearAmount : e.settlementAmount,//清算金额
				ecommClearCurr : e.settlementCurrencyCode,//清算币种
        }
        this.post('/card/cardService/'+url, this.balUnit_config ,(res) => {
            if (res.returnCode == '000000') {
                this.$notify({
                    title: 'Success',
                    message: '全部退货成功',
                    type: 'success',
                    duration: 2000
                })
                this.transInfo_dialog = false
                this.getList()
            }
        })
    },
    // 部分退货
    partReturnedPurchaseBtn(e) {
        console.log('部分退货')
        this.partReturn_dialog = true
        this.partReturnObj = e
        if (this.partReturnObj.rejectedAmount) {
            this.partReturnObj.rejectedAmount = this.partReturnObj.rejectedAmount
        } else {
            this.partReturnObj.rejectedAmount = 0
        }
    },
    surePartReturn() {
        //输入退货金额+已退货金额 小于等于 退货金额
        let flag = Number(this.partReturnObj.ecommTransPostingAmount) + 
                    Number(this.partReturnObj.rejectedAmount) <= e.actualPostingAmount ? true : false
        if(!flag){
            this.$message({
                title: '提示',
                message: '退货金额不能大于实际入账金额',
                type: 'warning',
                duration: 2000
            })
            return
        }

        let url 
        if (this.partReturnObj.eventNo == 'ISS.PT.40.0001') {
            url= 'ISS.RT.41.0001'
        } else if (this.partReturnObj.eventNo == 'ISS.PT.40.0002') {
            url = 'ISS.RT.41.0002'
        } else if (this.partReturnObj.eventNo == 'ILS.XT.00.0001' || this.partReturnObj.eventNo == 'ILS.XT.00.0003' || this.partReturnObj.eventNo == 'ILS.XT.00.0004' || this.partReturnObj.eventNo == 'ILS.XT.00.0005'
				|| this.partReturnObj.eventNo == 'ILS.XT.00.0006' ) {
            url = 'ILS.RT.41.0001'
        }
        let params = {
                idType : this.queryForm.idType,
				idNumber :  this.queryForm.idNumber,
				externalIdentificationNo :  this.queryForm.externalIdentificationNo,
				ecommOrigGlobalSerialNumbr : this.partReturnObj.globalSerialNumbr,
				ecommEntryId : this.partReturnObj.externalIdentificationNo,
				ecommOrigEventId : this.partReturnObj.eventNo,
				ecommTransCurr : this.partReturnObj.transCurrCde,
				ecommTransAmount : this.partReturnObj.transAmount,
				ecommTransDate : this.ecommTransDate,
				ecommTransPostingCurr : this.partReturnObj.postingCurrencyCode,
				ecommTransPostingAmount : this.partReturnObj.postingAmount,
				ecommTransStatus : this.partReturnObj.transState,
				ecommOriTransDate : this.partReturnObj.transDate,
				ecommClearAmount : this.partReturnObj.settlementAmount,
				ecommPostingAcctNmbr: this.partReturnObj.accountId,
				ecommBalType: this.partReturnObj.balanceType,
				ecommCustId : this.partReturnObj.customerNo,
				ecommRejectStatus: 'PRT',//FRT-全部退货，PRT-部分退货
				ecommPostingExchangeRate: this.partReturnObj.postingConvertRate,
				ecommClearAmount : this.partReturnObj.settlementAmount,//清算金额
				ecommClearCurr : this.partReturnObj.settlementCurrencyCode,//清算币种
        }
        
        this.post('/card/cardService/'+url, params,(res) => {
            if (res.returnCode == '000000') {
                this.$notify({
                    title: 'Success',
                    message: '部分退货成功',
                    type: 'success',
                    duration: 2000
                })
                this.partReturn_dialog = false
                this.transInfo_dialog = false
                this.getList()
            }
        })
    },
    // 争议登记
    disputeRegistBtn(e) {
       let params = {
                idType : this.queryForm.idType,
				idNumber : this.queryForm.idNumber,
				externalIdentificationNo : this.queryForm.externalIdentificationNo,
				ecommOrigGlobalSerialNumbr : e.globalSerialNumbr,
				ecommEntryId : e.externalIdentificationNo,
				ecommOrigEventId : e.eventNo,
				ecommTransCurr : e.transCurrCde,
				ecommTransAmount : e.transAmount,
				ecommTransDate : e.transDate,
				ecommTransPostingCurr : e.postingCurrencyCode,
				ecommTransPostingAmount : e.postingAmount,
				ecommOrigTransStatus : e.transState,
				ecommOriTransDate : e.transDate,
				ecommClearAmount : e.settlementAmount,
				ecommPostingAcctNmbr: e.accountId,
				ecommBalType: e.balanceType,
				ecommCustId : e.customerNo
        }
        this.post('/card/cardService/ISS.RT.07.0001', params ,(res) => {
            if (res.returnCode == '000000') {
                this.$notify({
                    title: 'Success',
                    message: '争议登记成功',
                    type: 'success',
                    duration: 2000
                })
                this.transInfo_dialog = false
                this.getList()
            }
        })
    },

    // 交易分期
    transStageDetailBtn() {
    	let params = {
           	queryType: "stage",
			stageType: 0
        }
        this.post('/beta/betaService/COS.IQ.02.0001', params ,(res) => {
        	if (res.returnCode == '000000') {
            	this.transStage_dialog = true
                // 交易分期弹窗
                this.transStage_tableData = res.returnData.rows
                this.transStageObj = this.transInfoObj
            }
        })
    },
    // 分期试算
    stageTrialBtn() {
        if (!this.transStage_curRow) {
            this.$message({
                title: '提示',
                message: '请至少选择一行',
                type: 'warning',
                duration: 2000
            })
            return
        }
        if(this.transStageObj.transAmount <=0){
            this.$message({
                title: '提示',
                message: '分期金额必须大于0',
                type: 'warning',
                duration: 2000
            })
            return
		}
        this.transStageObj.eventNo = this.transStage_curRow.eventNo
        this.transStageObj.ecommInstallmentBusinessType = this.transStage_curRow.installType
        this.transStageObj.ecommEntryId = this.transStageObj.externalIdentificationNo
        this.transStageObj.ecommTransAmount = this.transStageObj.transAmount
        this.transStageObj.ecommTransPostingCurr = this.transStageObj.currencyCode
        this.getTrailStageList()
        this.trailStage_dialog = true
    },
    // 分期试算 list
    getTrailStageList() {
        this.trailStage_config.loading = true
        let params = {
            eventNo: this.transStageObj.eventNo,//事件号
			ecommEntryId: this.transStageObj.ecommEntryId,//外部识别号
			ecommFeeCollectType: this.transStageObj.ecommFeeCollectType,//费用收取方式
			ecommBusineseType: this.transStageObj.ecommBusineseType,//业务类型
			ecommInstallmentPeriod: this.transStageObj.ecommInstallmentPeriod,//分期期数
			ecommPostingAcctNmbr: this.transStageObj.ecommPostingAcctNmbr,
			ecommProdObjId: this.transStageObj.ecommProdObjId,
			ecommTransAmount: this.transStageObj.ecommTransAmount,//分期金额
			ecommTransPostingCurr: this.transStageObj.ecommTransPostingCurr,
			ecommInstallmentBusinessType: this.transStageObj.ecommInstallmentBusinessType,//分期业务类型
			ecommBusinessProgramCode: this.transStageObj.ecommBusinessProgramCode,//业务项目
			receiveAccount:  this.transStageObj.receiveAccount,
			ecommSourceCde : this.transStageObj.ecommSourceCde,
			accountBankNo: this.transStageObj.accountBankNo,
			freeFlag: this.transStageObj.freeFlag,
        }
        params = Object.assign(params , this.trailStage_config )
        this.getTableList('/card/cardService/ILS.IQ.01.0005', params ,(res) => {
            if (res.returnCode == '000000') {
                this.trailStage_config.loading = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    $scope.trailStageObj = res.returnData.obj
                    this.trailStage_tableData = res.returnData.rows
                    this.trailStage_config.total = res.returnData.totalCount
                } else {
                    this.trailStage_tableData = []
                }
            }
        })
    },
    // 分期申请
    stageApplyBtn() {
        if (!this.transStage_curRow) {
            this.$message({
                title: '提示',
                message: '请至少选择一行',
                type: 'warning',
                duration: 2000
            })
            return
        }
        let url = this.transStage_curRow.eventNo
        let params = {
            eventNo: this.transStage_curRow.eventNo,//事件号
		    ecommTransPostingAmount: this.transStageObj.transAmount,//分期金额
		    ecommEntryId : this.transStageObj.externalIdentificationNo,//页面输入的外部识别号
            currBillFlag : '1',
            ecommSourceCde : 'L',
            postingAmount : this.transStageObj.postingAmount,//入账金额
            ecommTransPostingCurr : this.transStageObj.transCurrCde,
            ecommProdObjId : this.transStageObj.productObjectCode,//产品对象代码
            ecommCustId : this.transStageObj.customerNo,//客户号码
            ecommPostingAcctNmbr : this.transStageObj.accountId,////账户号
            ecommBusineseType : this.transStageObj.businessTypeCode,//业务类型
            installmentAmount : this.transStageObj.installmentAmount,//已分期金额
            transState : this.transStageObj.transState,
            ecommOrigGlobalSerialNumbr : this.transStageObj.globalSerialNumbr,
            ecommInstallmentPeriod : this.transStageObj.ecommInstallmentPeriod,//分期期数
            ecommFeeCollectType: this.transStageObj.ecommFeeCollectType,//费用收取方式
            ecommInstallmentBusinessType : this.transStageObj.ecommInstallmentBusinessType,//分期业务类型
        }
        this.post('/card/cardService/'+url, params ,(res) => {
            if (res.returnCode == '000000') {
                this.$notify({
                    title: 'Success',
                    message: '分期申请成功',
                    type: 'success',
                    duration: 2000
                })

            }
        })
    },
    transStage_handleCurrChange(row) {
        this.transStage_curRow = row
    },
    transStage_chooseCurrRow(row) {
        this.transStage_curRadio = row.eventNo
    },
    // 争议释放（有利于客户）
    disputeReleaseCstBtn(e) {
        console.log('争议释放（有利于客户）')
        let params = {
                idType : this.queryForm.idType,
				idNumber : this.queryForm.idNumber,
				externalIdentificationNo : this.queryForm.externalIdentificationNo,
				ecommOrigGlobalSerialNumbr : e.globalSerialNumbr,
				ecommEntryId: e.externalIdentificationNo
        }
        this.post('/card/cardService/ISS.RT.05.0001', params ,(res) => {
            if (res.returnCode == '000000') {
                this.$notify({
                    title: 'Success',
                    message: '争议释放（有利于客户）成功',
                    type: 'success',
                    duration: 2000
                })
                this.transInfo_dialog = false
                this.getList()
            }
        })
    },
    // 争议释放（有利于银行）
    disputeReleaseBankBtn(e) {
        console.log('争议释放（有利于银行）')
        let params = {
                idType : this.queryForm.idType,
				idNumber : this.queryForm.idNumber,
				externalIdentificationNo : this.queryForm.externalIdentificationNo,
				ecommOrigGlobalSerialNumbr : e.globalSerialNumbr,
				ecommEntryId: e.externalIdentificationNo
        }
        this.post('/card/cardService/ISS.RT.06.0001', params ,(res) => {
            if (res.returnCode == '000000') {
                this.$notify({
                    title: 'Success',
                    message: '争议释放（有利于银行）成功',
                    type: 'success',
                    duration: 2000
                })
                this.transInfo_dialog = false
                this.getList()
            }
        })
    },
    // 争议账户查询
    disputeAccQueryBtn(e) {
        console.log('争议账户查询')
        console.log(e)
        this.disputeAcc_dialog = true
        let params = {
            customerNo : e.customerNo,
            currencyCode: e.postingCurrencyCode,//入账币种
            externalIdentificationNo : e.externalIdentificationNo,
            oldGlobalSerialNumbr: e.globalSerialNumbr,
        }
        this.post('/nonfi/nonfinanceService/ISS.IQ.01.0008', params ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows) {
                    this.disputeAccObj = res.returnData.rows[0]
                    // 业务项目
                    this.disputeAccObj.businessProgramNoTrans = this.disputeAccObj.businessProgramNo+' '+this.disputeAccObj.programDesc
                    // 所属业务类型
                    this.disputeAccObj.businessTypeCodeTrans = this.disputeAccObj.businessTypeCode+' '+this.disputeAccObj.businessDesc
                    // 所属机构 
                    this.disputeAccObj.organNoTrans = this.disputeAccObj.organNo+' '+this.disputeAccObj.organName
                    
                }
            }
        })
    },
    // 分期账户信息查询
    stagingAccInfoBtn(e) {
        let params = {
                idType : this.queryForm.idType,
				idNumber : this.queryForm.idNumber,
				externalIdentificationNo : this.queryForm.externalIdentificationNo,
                oldGlobalSerialNumbr: e.globalSerialNumbr,
        }
        this.post('/nonfi/nonfinanceService/ILS.IQ.01.0020', params ,(res) => {
            if (res.returnCode == '000000') {
                this.stageAcc_dialog = true
                this.stageAccObj = e
                this.getStageAccList(e)
            }
        })
    },
    // 分期账户 list
    getStageAccList(e) {
        this.stageAcc_config.loading = true
        let params = {
                idType : this.queryForm.idType,
				idNumber : this.queryForm.idNumber,
				externalIdentificationNo : this.queryForm.externalIdentificationNo,
                oldGlobalSerialNumbr: e.globalSerialNumbr,
        }
        params = Object.assign( params, this.stageAcc_config)
        this.getTableList('/nonfi/nonfinanceService/ILS.IQ.01.0020', params ,(res) => {
            if (res.returnCode == '000000') {
                this.stageAcc_config.loading = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.stageAcc_tableData =  res.returnData.rows
                    this.stageAcc_config.total = res.returnData.totalCount
                } else {
                    this.stageAcc_tableData =  []
                }
            }
        })
    },
    // 分期账户 详情
    stageAcc_handleDetail(row) {
        console.log(row)
        this.stageAccDetai_dialog = transStageRules
        this.getStageAccDetailList(row)
        let  obj = {
            accountId: row.accountId,
            externalIdentificationNo: row.externalIdentificationNo
        }
        this.post('/nonfi/nonfinanceService/ILS.IQ.01.0015', obj ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData.obj) {
                    this.stageAccDetaiObj.totalBalance = res.returnData.obj.totalBalance
					this.stageAccDetaiObj = res.returnData.obj
                }
            }
        })

    },
    // 分期交易账户明细
    getStageAccDetailList(row) {
        this.stageAccDetai_config.loading = true
        let params = {
            accountId: row.accountId,
            externalIdentificationNo : row.externalIdentificationNo,
            currencyCode: row.currencyCode
        }
        params = Object.assign( params , this.stageAccDetai_config)
        this.getTableList('/nonfi/nonfinanceService/ILS.IQ.01.0015', params ,(res) => {
            if (res.returnCode == '000000') {
                this.stageAccDetai_config.loading = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.stageAccDetai_tableData =  res.returnData.rows
                    this.stageAcc_config.total = res.returnData.totalCount
                } else {
                    this.stageAccDetai_config =  []
                }
            }
        })
    },

    },
}

</script>

<style>
</style>
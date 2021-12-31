<!-- 已出账单查询 -->
<template>
    <div class="allContent">
        <el-form ref="queryFormRef" :model="queryForm">
        	<el-form-item class="cl_td" label="预算单位编码" prop="idNumber">
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
        <!--预算编码查询公务卡列表列表-->
        <div v-if="showBusines">
            <div class="text_title">公务卡列表</div>
            <el-table v-loading="businessLoading" :data="businessList" class="mbtm20" fit highlight-current-row style="width: 100%" border row-key="id" 
                lazy  >
               	<el-table-column prop="customerName"  label="持卡人姓名"  align="center" width="230" />
                <el-table-column prop="externalIdentificationNo" label="外部识别号" align="center" />
                <el-table-column prop="idTypeDesc" label="证件类型" align="center" />
                <el-table-column prop="idNumber" label="证件号码" align="center" />
               	<el-table-column prop="officialCardType" label="公务卡类型" align="center" width="200"/>
                <el-table-column  prop="invalidFlagDesc" label="有效标识" align="center" />
                <el-table-column prop="" label="操作" align="center" width="200px">
	                <template slot-scope="{row}">
		                <el-button size="mini" icon="el-icon-more" type="primary" @click="getBillIssued(row)">查询</el-button>
		            </template >   
	            </el-table-column>
            </el-table>
            <pagination  v-show="businessTotal > 0" :total="businessTotal" :page.sync="businessPage.pageNum"  :limit.sync="businessPage.pageSize" @pagination="getBusCardBillTableNum" />
        </div>
        <!--公务卡已出账单列表-->
        <div v-if="showBillIssued">
            <div class="text_title">公务卡列表</div>
            <el-table v-loading="billIssuedLoading" :data="billIssuedList" class="mbtm20" fit highlight-current-row style="width: 100%" border row-key="id" 
                lazy  >
               	<el-table-column prop="customerNo"  label="客户号码"  align="center" width="230" />
                <el-table-column prop="businessProgramNo" label="业务项目" align="center" />
                <el-table-column prop="productObjectCode" label="产品对象代码" align="center" />
                <el-table-column prop="productDesc" label="对象描述" align="center" />
               	<el-table-column prop="billDate" label="账单日期" align="center" width="200"/>
                <el-table-column prop="currencyCode" label="币种" align="center" />
                <el-table-column prop="currentCycleNumber" label="当前周期号" align="center" />
                <el-table-column prop="postingAmount" label="账单金额" align="center" />
                <el-table-column prop="" label="操作" align="center" width="200px">
	                <template slot-scope="{row}">
		                <el-button size="mini" icon="el-icon-more" type="primary" @click="handleInfo(row)">查询</el-button>
		            </template >   
	            </el-table-column>
            </el-table>
        </div>
        <!--外部识别号查询列表-->
        <div v-if="showBill">
            <div class="text_title">账单周期信息</div>
            <el-table v-loading="billLoading" :data="billList   " class="mbtm20" fit highlight-current-row style="width: 100%" border row-key="id" 
                lazy  >
               	<el-table-column prop="customerNo"  label="客户号码"  align="center" width="230" />
                <el-table-column prop="businessProgramNo" label="业务项目" align="center" />
                <el-table-column prop="productObjectCode" label="产品对象代码" align="center" />
                <el-table-column prop="productDesc" label="对象描述" align="center" />
               	<el-table-column prop="billDate" label="账单日期" align="center" width="200"/>
                <el-table-column prop="currencyCode" label="币种" align="center" />
                <el-table-column prop="currentCycleNumber" label="当前周期号" align="center" width="200"/>
                <el-table-column prop="postingAmount" label="账单金额" align="center" />
                <el-table-column prop="" label="操作" align="center" width="200px">
	                <template slot-scope="{row}">
		                <el-button size="mini" icon="el-icon-more" type="primary" @click="handleInfo(row)">查询</el-button>
		            </template >   
	            </el-table-column>
            </el-table>
            <pagination  v-show="billTotal> 0" :total="billTotal" :page.sync="billPage.pageNum"  :limit.sync="billPage.pageSize" @pagination="getBusCardBillTable" />
        </div>
      	<!--查询账单摘要-->
		  <el-dialog title="账单摘要（产品级）" :visible.sync="dialogFormVisibleInfo" width="65%">
	        <el-form ref="refInfoData" :model="tempInfo" :rules="rulesInfo">
	        	<el-form-item class="cl_td" label="客户代码" prop="customerNo">
	            	<el-input v-model="tempInfo.customerNo" class="wd200" type="text" readonly />
	        	</el-form-item>
				<el-form-item class="cl_td" label="宽限余额" prop="allGraceBalance">
	            	<el-input v-model="tempInfo.allGraceBalance" class="wd200" type="text" readonly />
	        	</el-form-item>
				<el-form-item class="cl_td" label="本期贷方发生笔数" prop="creditNum">
	            	<el-input v-model="tempInfo.creditNum" class="wd200" type="text" readonly />
	        	</el-form-item>
				<el-form-item class="cl_td" label="本期贷方发生额" prop="creditAmount">
	            	<el-input v-model="tempInfo.creditAmount" class="wd200" type="text" readonly  />
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="借方笔数" prop="debitNum">
	            	<el-input v-model="tempInfo.debitNum" class="wd200" type="text" readonly />
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="借方发生额" prop="debitAmount">
	            	<el-input v-model="tempInfo.debitAmount" class="wd200" type="text" readonly />
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="本期还款金额" prop="currentRepayAmount">
	            	<el-input v-model="tempInfo.currentRepayAmount" class="wd200" type="text" readonly />
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="账单金额" prop="postingAmount">
	            	<el-input v-model="tempInfo.postingAmount" class="wd200" type="text"  readonly/>
	        	</el-form-item> 
	        	<el-form-item class="cl_td" label="本金金额" prop="principalAmount">
	            	<el-input v-model="tempInfo.principalAmount" class="wd200" type="text" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="费用金额" prop="feeAmount">
	            	<el-input v-model="tempInfo.feeAmount" class="wd200" type="text" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="利息金额" prop="interestAmount">
	            	<el-input v-model="tempInfo.interestAmount" class="wd200" type="text" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="当期需还欠款" prop="currentAccountBalance">
	            	<el-input v-model="tempInfo.currentAccountBalance" class="wd200" type="text" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="期初余额" prop="beginBalance">
	            	<el-input v-model="tempInfo.beginBalance" class="wd200" type="text" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="最低还款额汇总" prop="minRepayAmt">
	            	<el-input v-model="tempInfo.minRepayAmt" class="wd200" type="text" readonly />
	        	</el-form-item>
	        </el-form>
	        <!--延滞信息-->
	        <div class="clearboth"></div>
	        <div>延滞信息</div>
	        <el-table v-loading="delayLoading" :data="delayList" class="mbtm20" fit highlight-current-row style="width: 100%" border row-key="id" 
                lazy  >
               <el-table-column prop="delinquencyLevel"  label="延滞层级"  align="center" width="230" />
                <el-table-column prop="businessProgramNo" label="业务项目" align="center" />
                <el-table-column prop="productObjectCode" label="产品对象" align="center" />
                <el-table-column prop="cycleNo" label="周期号" align="center" />
               	<el-table-column prop="currCyclePaymentMin" label="最低还款额" align="center" width="200"/>
                <el-table-column  prop="cycleDueNum" label="逾期期数" align="center" />
             	<el-table-column  prop="cycleDueDayNum" label="逾期天数" align="center" />
            </el-table>
           <!-- <pagination  v-show="delayTotal > 0" :total="delayTotal" :page.sync="delayPage.pageNum"  :limit.sync="delayPage.pageSize" @pagination="getDelayList" />-->
            <!--账单摘要（业务类型级）-->
            <div class="clearboth"></div>
            <div>账单摘要明细(业务类型级)</div>
             <el-table v-loading="billDatailLoading" :data="billDatailList" class="mbtm20" fit highlight-current-row style="width: 100%" border row-key="id" 
                lazy  >
               	<el-table-column prop="businessTypeCodeDesc"  label="业务类型"  align="center"/>
                <el-table-column prop="productObjectCodeDeac" label="业务项目" align="center" />
                <el-table-column prop="productObjectCode" label="产品对象" align="center" />
                <el-table-column prop="billDate" label="账单日期" align="center" />
               	<el-table-column prop="currencyCode" label="币种" align="center"/>
                <el-table-column  prop="currentCycleNumber" label="账单周期号" align="center" />
             	<el-table-column  prop="postingAmount" label="账单金额" align="center" />
             	<el-table-column prop="" label="操作" align="center" width="250px">
	                <template slot-scope="{row}">
		                <el-button size="medium" type="primary" @click="checkItem(row)">查询</el-button>
	            		<el-button size="medium" type="primary" @click="billStageTwo(row)">账单分期</el-button>
		            </template >   
	            </el-table-column>
            </el-table>
            <pagination  v-show="billDatailTotal > 0" :total="billDatailTotal" :page.sync="billDatailPage.pageNum"  :limit.sync="billDatailPage.pageSize" @pagination="getBillDatailList" />
			<div slot="footer" class="dialog-footer">
            	<el-button size="medium" icon="el-icon-search" type="primary" @click="dialogFormVisibleInfo=false">关闭</el-button>
            </div>        
	  	</el-dialog>
        <!--账单分期-->
        <el-dialog title="账单分期信息" :visible.sync="dialogFormVisibleStage" width="65%">
	        <el-form ref="refStage" :model="tempStage" :rules="rulesStage">
	        	<el-form-item class="cl_td" label="客户代码" prop="customerNo">
	            	<el-input v-model="tempStage.customerNo" class="wd200" type="text" readonly />
	        	</el-form-item>
				<el-form-item class="cl_td" label="产品对象代码" prop="productObjectCode">
	            	<el-input v-model="tempStage.productObjectCode" class="wd200" type="text" readonly />
	        	</el-form-item>
				<el-form-item class="cl_td" label="币种" prop="currencyCodeTrans">
	            	<el-input v-model="tempStage.currencyCodeTrans" class="wd200" type="text" readonly />
	        	</el-form-item>
				<el-form-item class="cl_td" label="可分期最大金额 " prop="billAmt">
	            	<el-input v-model="tempStage.billAmt" class="wd200" type="text"readonly  />
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="分期金额" prop="loanAmt">
	            	<el-input v-model="tempStage.loanAmt" class="wd200" type="text"  />
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="分期期数" prop="term">
        		  	<el-select v-model="tempStage.term" class="wd200">
                    <el-option v-for="(item, index) in termOptions" 
                    	:key="index" 
                    	:label="item.label" 
                    	:value="item.value"/>
                	</el-select>
	            </el-form-item>
	        	<el-form-item class="cl_td" label="费用收取方式" prop="ecommFeeCollectType">
	            	<el-select v-model="tempStage.ecommFeeCollectType" class="wd200">
                    <el-option v-for="(item, index) in ecommFeeCollectTypeOptions" 
                    	:key="index" 
                    	:label="item.label" 
                    	:value="item.value"/>
                	</el-select>
	        	</el-form-item>
	        	<div class="cl_tr text_center">
                	<el-button size="medium" icon="el-icon-s-order" type="primary" @click="getStageTrial()">分期试算</el-button>
                </div>
                <div v-if="showInfo">
	                <el-form-item class="cl_td" label="账户代码 " prop="accountId">
		            	<el-input v-model="tempStage.accountId" class="wd200" type="text" readonly />
		        	</el-form-item>
					<el-form-item class="cl_td" label="信贷交易类型" prop="ecommBusineseType">
		            	<el-input v-model="tempStage.ecommBusineseType" class="wd200" type="text" readonly />
		        	</el-form-item>
					<el-form-item class="cl_td" label="金额" prop="loanAmt">
		            	<el-input v-model="tempStage.loanAmt" class="wd200" type="text" readonly />
		        	</el-form-item>
					<el-form-item class="cl_td" label="币种 " prop="currencyCode">
		            	<el-input v-model="tempStage.currencyCode" class="wd200" type="text"readonly  />
		        	</el-form-item>
		        	<el-form-item class="cl_td" label="利率 " prop="loanRate">
		            	<el-input v-model="tempStage.loanRate" class="wd200" type="text"  />
		        	</el-form-item>
		        	<el-form-item class="cl_td" label="费率 " prop="feeRate">
		            	<el-input v-model="tempStage.feeRate" class="wd200" type="text" readonly />
		        	</el-form-item>
					<el-form-item class="cl_td" label="总费用 " prop="allFeeAmt">
		            	<el-input v-model="tempStage.allFeeAmt" class="wd200" type="text" readonly />
		        	</el-form-item>
					<el-form-item class="cl_td" label="总期数" prop="term">
		            	<el-input v-model="tempStage.term" class="wd200" type="text" readonly />
		        	</el-form-item>
    			</div>
			</el-form>
	        <!--延滞信息-->
	        <div v-if="showInfo">
		        <div class="clearboth"></div>
		        <div>分期试算结果</div>
		        <el-table v-loading="trialLoading" :data="trialList" class="mbtm20" fit highlight-current-row style="width: 100%" border row-key="id" 
	                lazy  >
	               <el-table-column prop="customerName"  label="期次"  align="center" width="230" />
	                <el-table-column prop="externalIdentificationNo" label="当期抛账日" align="center" />
	                <el-table-column prop="idTypeDesc" label="应还本金" align="center" />
	                <el-table-column prop="idNumber" label="应还费用" align="center" />
	            </el-table>
	         	<pagination  v-show="trialTotal > 0" :total="trialTotal" :page.sync="trialPage.pageNum"  :limit.sync="trialPage.pageSize" @pagination="getStageTrial" />
        	</div>
        	<div slot="footer" class="dialog-footer">
            	<el-button size="medium"  type="primary" @click="subBillData()">账单分期</el-button>
            	<el-button size="medium"  type="primary" @click="dialogFormVisibleStage = false">关闭</el-button>
            </div>	
       </el-dialog>
       <!--查看分期详情-->
       <el-dialog title="账单摘要详情（业务类型级）" :visible.sync="dialogFormVisibleDetail" width="65%">
	        <el-form ref="refDetail" :model="tempDetail" :rules="rulesDetail">
	        	<el-form-item class="cl_td" label="客户代码" prop="customerNo">
	            	<el-input v-model="tempDetail.customerNo" class="wd200" type="text" readonly />
	        	</el-form-item>
				<el-form-item class="cl_td" label="业务项目" prop="businessProgramNo">
	            	<el-input v-model="tempDetail.businessProgramNo" class="wd200" type="text" readonly />
	        	</el-form-item>
				<el-form-item class="cl_td" label="产品对象代码" prop="productObjectCode">
	            	<el-input v-model="tempDetail.productObjectCode" class="wd200" type="text" readonly />
	        	</el-form-item>
				<el-form-item class="cl_td" label="业务类型 " prop="businessTypeCode">
	            	<el-input v-model="tempDetail.businessTypeCode" class="wd200" type="text" readonly  />
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="账户组织形式" prop="accountOrganFormTrans">
	            	<el-input v-model="tempDetail.accountOrganFormTrans" class="wd200" type="text"  />
	        	</el-form-item>
				<el-form-item class="cl_td" label="账单日期" prop="billDate">
	            	<el-input v-model="tempDetail.billDate" class="wd200" type="text"  />
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="宽限余额 " prop="graceBalance">
	            	<el-input v-model="tempDetail.graceBalance" class="wd200" type="text" readonly />
	        	</el-form-item>
				<el-form-item class="cl_td" label="贷方发生额" prop="creditAmount">
	            	<el-input v-model="tempDetail.creditAmount" class="wd200" type="text" readonly />
	        	</el-form-item>
				<el-form-item class="cl_td" label="贷方发生笔数" prop="creditNum">
	            	<el-input v-model="tempDetail.creditNum" class="wd200" type="text" readonly />
	        	</el-form-item>
				<el-form-item class="cl_td" label="借方发生额 " prop="debitAmount">
	            	<el-input v-model="tempDetail.debitAmount" class="wd200" type="text" readonly  />
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="借方笔数" prop="debitNum">
	            	<el-input v-model="tempDetail.debitNum" class="wd200" type="text"  />
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="账单金额" prop="postingAmount">
	            	<el-input v-model="tempDetail.postingAmount" class="wd200" type="text" readonly />
	        	</el-form-item>
				<el-form-item class="cl_td" label="本金金额" prop="principalAmount">
	            	<el-input v-model="tempDetail.principalAmount" class="wd200" type="text" readonly />
	        	</el-form-item>
				<el-form-item class="cl_td" label="费用金额" prop="feeAmount">
	            	<el-input v-model="tempDetail.feeAmount" class="wd200" type="text" readonly />
	        	</el-form-item>
				<el-form-item class="cl_td" label="利息金额" prop="interestAmount">
	            	<el-input v-model="tempDetail.interestAmount" class="wd200" type="text" readonly />
	        	</el-form-item>
				<el-form-item class="cl_td" label="当期需还欠款" prop="currentAccountBalance">
	            	<el-input v-model="tempDetail.currentAccountBalance" class="wd200" type="text" readonly />
	        	</el-form-item>
				<el-form-item class="cl_td" label="期初余额" prop="beginBalance">
	            	<el-input v-model="tempDetail.beginBalance" class="wd200" type="text" readonly />
	        	</el-form-item>
				<el-form-item class="cl_td" label="本期还款金额" prop="currentRepayAmount">
	            	<el-input v-model="tempDetail.currentRepayAmount" class="wd200" type="text" readonly />
	        	</el-form-item>
				<el-form-item class="cl_td" label="状态码" prop="statusCode">
	            	<el-input v-model="tempDetail.statusCode" class="wd200" type="text" readonly />
	        	</el-form-item>
				<el-form-item class="cl_td" label="最低还款额汇总" prop="minRepayAmt">
	            	<el-input v-model="tempDetail.minRepayAmt" class="wd200" type="text" readonly />
	        	</el-form-item>
    			
			</el-form>
	        <!--延滞信息-->
         	<div class="clearboth"></div>
	         <div>延滞信息</div>				
	        <el-table v-loading="detailLoading" :data="delayDetail" class="mbtm20" fit highlight-current-row style="width: 100%" border row-key="id" 
                lazy  >
               <el-table-column prop="delinquencyLevel"  label="延滞层级"  align="center" width="120" />
                <el-table-column prop="levelCode" label="账户代码" align="center" />
                <el-table-column prop="cycleNo" label="周期号" align="center" />
                <el-table-column prop="currCyclePaymentMin" label="最低还款额" align="center" />
                <el-table-column prop="cycleDueNum" label="逾期期数" align="center" />
                <el-table-column prop="cycleDueDayNum" label="逾期天数" align="center" />
            </el-table>
         	<!--交易明细-->
        	<div class="clearboth"></div>
	        <div>交易明细</div>
	        <el-table v-loading="tradeLoading" :data="tradeList" class="mbtm20" fit highlight-current-row style="width: 100%" border row-key="id" 
                lazy  >
               <el-table-column prop="occurrDate"  label="发生日期"  align="center" width="110" />
                <el-table-column prop="occurrTime" label="发生时间" align="center" width="110"/>
                <el-table-column prop="transDate" label="交易日期" align="center" width="110"/>
                <el-table-column prop="externalIdentificationNo" label="外部识别号" align="center" width="150"/>
                <el-table-column prop="transIdentifiNo" label="交易识别码" align="center" width="120"/>
                <el-table-column prop="transDesc" label="交易描述" align="center" width="170"/>
                <el-table-column prop="transAmount" label="交易金额" align="center" />
                <el-table-column prop="transState" label="交易状态" align="center" />
                <el-table-column prop="postingCurrencyCode" label="入账币种" align="center" />
                <el-table-column prop="postingAmount" label="入账金额" align="center" />
                <el-table-column prop="acquireReferenceNumbr" label="收单参考号	" align="center" width="120"/>
                <el-table-column prop="sourceCde" label="来源码" align="center" />
				<el-table-column prop="merchantCde" label="商户编号" align="center" />
            </el-table>
         	<pagination  v-show="tradeTotal > 0" :total="tradeTotal" :page.sync="tradePage.pageNum"  :limit.sync="tradePage.pageSize" @pagination="getStageTrial" />
        	<div slot="footer" class="dialog-footer">
            	<el-button size="medium"  type="primary" @click="dialogFormVisibleDetail = false">关闭</el-button>
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

export default {
    name: 'AccMoneySearch',
    components: {
        // eslint-disable-next-line vue/no-unused-components
        Pagination,
        TransInfo, // 交易信息
        DisputeAccInfo, // 争议账户查询
        StageAccInfo, // 分期账户查询
        StageAccDetail, // 分期账户明细
    },
    
    data() {
        return {
            showBusItem: false,  // 选择业务项目
            showNObill: false, // 未出账单信息
            // 选择业务项目
            busItemRef: {},
            busItemObj: {},
            busItemRules: {},
            //预算预算单位编码
            showBusines: false,
            businessLoading: false,
            businessList: [],
            businessTotal: 0,
            businessPage: {
            	pageNum: 1,
                pageSize: 10,
            },
            //已出账单
            showBillIssued: false,
            billIssuedList: [],
            billIssuedLoading: false,
            billIssuedTotal: 0,
            billIssuedPage:{
            	pageSize: 10,
            	pageNum: 1,
            },
            //外部识别号
            showBill: false,
            billLoading: false,
            billList: [],
            billTotal: 0,
            billPage: {
                pageSize: 10,
            	pageNum: 1,
            },
           
            // 列表
            queryFormRef: {},
            queryForm: {
                externalIdentificationNo: '',
            },
           	// 下拉框、
            businessTypeList: [],
          	ecommFeeCollectTypeOptions: [], // 费用收取方式
            termOptions: [],
			
			//账单摘要（产品级）
			allInfo: {},
			dialogFormVisibleInfo: false,
			rulesInfo: {},
			refInfoData: {},
			tempInfo: {},
			//延滞信息表
			delayList: [],
			delayLoading: false,
			delayTotal: 0,
			delayPage: {
				pageSize: 10,
            	pageNum: 1,
			},
            //账单摘要明细（业务类型级）
            billDatailLoading: false,
            billDatailTotal: 0,
            billDatailPage:{
            	pageSize: 10,
            	pageNum: 1,
            },
            billDatailList: [],
            //账单分期
            dialogFormVisibleStage: false,
            tempStage: {},
            rulesStage: {},
            refStage: {},
            trialList: [],
            trialLoading: false,    
            showInfo: false,
            trialPage: {
            	pageNum: 1,
            	pageSize: 10,
            },
            trialTotal: 0,
            //查询详情
            detailItem: {},
            dialogFormVisibleDetail:false,
            tempDetail: {},
            refDetail: {},
            rulesDetail: {},
            tradePage:{
            	pageNum: 1,
            	pageSize: 10,
            },
            detailLoading: false,
            delayDetail: [],
            tradeLoading: false,
            tradeList: [],
            tradeTotal: 0,
        }
    },
    created() {}, 
    mounted() {
        this.getSelectDict('dic_financialTransactions').then((res) => {
            this.businessTypeList = res
        })
        // 分期期数
     	this.getSelectDict('dic_stageTerm').then((res) => {
            this.termOptions = res
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
            this.queryForm = {
            	idNumber: '',
                externalIdentificationNo: '',
            }
        },
        // 重置
        reset() {
            this.init()
            this.showBusines = false
			this.showBusItem = false
			this.showBillIssued = false
			this.showBill = false
			this.billList = []
			this.businessList = []
			this.billIssuedList = []
        },
        // 查询
        hadleSearch() {
            if (!this.queryForm.externalIdentificationNo && !this.queryForm.idNumber) {
                this.$message('请输入查询信息')
              return;
            } else if(this.queryForm.idNumber){
                this.showBusines = true
                this.getBusCardBillTableNum()
            }else if(this.queryForm.externalIdentificationNo){
            	  this.getBusCardBillTable()
            }
            
      	},  
        //外部识别号查询列表
        getBusCardBillTable(){
        	this.billLoading = true
        	this.showBill = true
        	 let objData = {
        	 	pageNum: this.businessPage.pageNum,
                pageSize: this.businessPage.pageSize,
                externalIdentificationNo: this.queryForm.externalIdentificationNo,
            }
        	this.post('/nonfi/nonfinanceService/OCS.IQ.01.0008', objData,(res) => {
        		this.billLoading = false
                if (res.returnCode == '000000') {
                  //  if (res.returnData && res.returnData.rows &&  res.returnData.rows.length == 1) {
                        this.billList = res.returnData.rows
                        this.billTotal = res.returnData.totalCount
                 //   }
               	} else {
                    this.billList = []
                }
            })
        }, 	
       //输入预算单位编码查询列表
        getBusCardBillTableNum(){
        	this.businessLoading = true
        	this.showBusines = true
        	 let objData = {
        	 	pageNum: this.businessPage.pageNum,
                pageSize: this.businessPage.pageSize,
                idNumber: this.queryForm.idNumber,
                isTrans: true,
				transParams: ['dic_documentTypeTable','dic_invalidFlagYN'],
				transDict: ['idType','invalidFlag'],
        	}
        	this.getTableList('/nonfi/nonfinanceService/OCS.IQ.01.0011', objData,(res) => {
        		this.businessLoading = false
                if (res.returnCode == '000000') {
                   // if (res.returnData && res.returnData.rows &&  res.returnData.rows.length == 1) {
                        this.businessList = res.returnData.rows
                        this.businessTotal = res.returnData.totalCount  
                   // }
               	} else {
                    this.businessList = []
                }
            })
        },
        //已出账单
        getBillIssued(row){
        	this.billIssuedLoading = true
        	this.showBillIssued = true
        	 let objBillIssued = {
        	 	externalIdentificationNo: row.externalIdentificationNo,
				logLevel: row.logLevel,
				transProperty: 'O',
                isTrans: true,
				transParams: ['dic_documentTypeTable','dic_invalidFlagYN'],
				transDict: ['idType','invalidFlag'],
        	}
        	this.getTableList('/nonfi/nonfinanceService/BSS.IQ.03.0003', objBillIssued,(res) => {
        		this.billIssuedLoading = false
                if (res.returnCode == '000000') {
                  //  if (res.returnData && res.returnData.rows &&  res.returnData.rows.length == 1) {
						this.billIssuedList = res.returnData.rows
                        this.billIssuedTotal = res.returnData.totalCount
                 //   }
               	} else {
                    this.billIssuedList = []
					this.billIssuedTotal = 0
                }
            })
        },
		//预算单位编码查询公务卡里的查询按钮
        handleInfo(row){
			this.delayList = row.page.rows;
        	this.dialogFormVisibleInfo = true
        	this.allInfo = Object.assign({}, row) 
        	this.tempInfo = Object.assign({}, row)
        	this.getBillDatailList()

		},
		// 账单摘要列表
        getBillDatailList() {
        	this.billDatailLoading = true
        	this.allInfo=  Object.assign ( this.allInfo, this.billDatailPage )
            this.getTableList('/nonfi/nonfinanceService/BSS.IQ.03.0004', this.allInfo ,(res) => {
            	this.billDatailLoading = false
                if (res.returnCode == '000000') {
                   // if (res.returnData && res.returnData.rows &&  res.returnData.rows.length == 1) {
                        this.billDatailList = res.returnData.rows
                        this.billDatailTotal = res.returnData.totalCount
                         this.billDatailList.forEach(item =>{
                         	  item.businessTypeCodeDesc = item.businessTypeCode + ' ' + item.businessDesc
                         	  item.productObjectCodeDeac = item.productObjectCode + ' ' + item.programDesc
                         })
                  //  }
                }else {
						this.billDatailList = []
					}
           	})
        },
        //账单分期
        billStageTwo(row){
        	let paramss = {
				customerNo:row.customerNo,
				businessProgramNo: row.businessProgramNo,
				businessTypeCode: row.businessTypeCode,
				currentCycleNumber: row.currentCycleNumber,
				postingCurrencyCode: row.currencyCode,
				externalIdentificationNo: row.externalIdentificationNo,
			};
        	this.post('/nonfi/nonfinanceService/ILS.IQ.01.0001', paramss ,(res) => {
            	this.billDatailLoading = false
                if (res.returnCode == '000000') {
                   // if (res.returnData && res.returnData.rows &&  res.returnData.rows.length == 1) {
                        this.dialogFormVisibleStage= true
        				this.tempStage = res.returnData.rows
        				this.tempStage = row
        				this.tempStage.currencyCodeTrans = row.currencyDesc
                  //  }
                } else {
						this.dialogFormVisibleStage= false
					}
           	})
        },
        //分期试算
        getStageTrial(){
        	if(this.tempStage.billAmt <  Number(this.tempStage.loanAmt) ){
				this.$message('分期金额不能大于可分期最大额度');//"分期金额不能大于可分期最大额度！"
				return;
            }
            if(this.tempStage.term  == undefined || this.tempStage.term  == null || this.tempStage.term  == ''){
				this.$message('分期期数不能为空');//"分期期数不能为空！"
				return;
            }
        	this.trialLoading = false
        	this.showInfo = true
        	let trialParams= {
				externalIdentificationNo: this.tempStage.externalIdentificationNo,
				ecommEntryId:this.tempStage.externalIdentificationNo,
				ecommFeeCollectType: this.tempStage.ecommFeeCollectType,
				ecommBusinessProgramCode: this.tempStage.businessProgramNo,// 业务项目
				ecommBusineseType: this.tempStage.businessTypeCode,
				ecommProdObjId:  this.tempStage.productObjectCode,
				ecommCustId: this.tempStage.customerNo,
				ecommTransPostingCurr: this.tempStage.currencyCode,//币种
				ecommInstallmentPeriod: this.tempStage.term,
				ecommTransAmount :this.tempStage.loanAmt,
				ecommInstallmentBusinessType: 'STMT',
				pageNum: this.trialPage.pageNum,
				pageSize: this.trialPage.pageSize
			};
        	this.post('/card/cardService/ILS.IQ.01.0005', trialParams ,(res) => {
            	this.trialLoading = false
                if (res.returnCode == '000000') {
                   // if (res.returnData && res.returnData.rows &&  res.returnData.rows.length == 1) {
                        this.tempStage.accountId =  res.returnData.obj.accountId;
						this.tempStage.customerNo =  res.returnData.obj.ecommCustId;
						this.tempStage.ecommBusineseType = res.returnData.obj.ecommBusineseType;
						this.tempStage.loanAmt = res.returnData.obj.loanAmt;
						this.tempStage.feeRate = res.returnData.obj.feeRate;
						this.tempStage.allFeeAmt = res.returnData.obj.allFeeAmt;
						this.tempStage.ecommCustId =  res.returnData.obj.ecommCustId;
						this.tempStage.loanRate = res.returnData.obj.loanRate;
						this.trialList = res.returnData.obj.trialList
						this.trialTotal = res.returnData.totalCount
                   // }
                }else {
						this.trialList= []
					} 
           	})
		},
      	//确认账单分期
      	subBillData(){
      		let stageParams= {
				externalIdentificationNo: this.tempStage.externalIdentificationNo,
				ecommEntryId:this.tempStage.externalIdentificationNo,
				ecommFeeCollectType: this.tempStage.ecommFeeCollectType,
				ecommBusinessProgramCode: this.tempStage.businessProgramNo,// 业务项目
				ecommBusineseType: this.tempStage.businessTypeCode,
				ecommProdObjId:  this.tempStage.productObjectCode,
				ecommCustId: this.tempStage.customerNo,
				ecommTransPostingCurr: this.tempStage.currencyCode,//币种
				ecommInstallmentPeriod: this.tempStage.term,
				ecommTransAmount :this.tempStage.loanAmt,
				ecommInstallmentBusinessType: 'STMT',
				pageNum: this.trialPage.pageNum,
				pageSize: this.trialPage.pageSize,
				idType: this.tempStage.idType,
				idNumber: this.tempStage.idNumber,
				externalIdentificationNo: this.tempStage.externalIdentificationNo
			};
        	this.post('/card/cardService/ILS.IQ.01.0005', stageParams ,(res) => {
            	this.trialLoading = false
                if (res.returnCode == '000000') {
                	this.$notify({
                      title: 'Success',
                      message: '分期成功',
                      type: 'success',
                      duration: 2000
                    })
                    this.dialogFormVisibleStage= false
                    this.dialogFormVisibleInfo = false
                } 
           	})
      	},
        //查询详情
        checkItem(row){
        	this.dialogFormVisibleDetail = true
			this.tempDetail = row
			if(this.tempDetail.accountOrganForm == 'R'){
				this.tempDetail.accountOrganFormTrans = '循环';//"循环";
			}else if(this.tempDetail.accountOrganForm == 'T'){
				this.tempDetail.accountOrganFormTrans = '交易';//"交易";
			}
			this.delayDetail = row.page.rows
    		this.detailItem = row
    		this.getDetail()
            this.$nextTick(() => {
                this.$refs['refDetail'].clearValidate()
          })
        },
        getDetail(){
        	this.tradeLoading = true
      		let detailParams= {
				pageSize: this.tradePage.pageSize,
				pageNum: this.tradePage.pageNum,
				idType: '7',
				idNumber: this.detailItem.idNumber,
				externalIdentificationNo: this.detailItem.externalIdentificationNo,
				currencyCode: this.detailItem.currencyCode ,
				billDate: this.detailItem.billDate ,
				businessProgramNo: this.detailItem.businessProgramNo ,
				businessTypeCode: this.detailItem.businessTypeCode ,
				customerNo: this.detailItem.customerNo ,
				currentCycleNumber: this.detailItem.currentCycleNumber
			};
        	this.getTableList('/nonfi/nonfinanceService/BSS.IQ.03.0005', detailParams ,(res) => {
            	this.tradeLoading = false
                if (res.returnCode == '000000') {
                	this.tradeList = res.returnData.rows
                    this.tradeTotal = res.returnData.totalCount
                } else {
                	this.tradeList = []
                }
           	})
      	},
       
        

      

    
  }          
   
}

</script>

<style>
</style>
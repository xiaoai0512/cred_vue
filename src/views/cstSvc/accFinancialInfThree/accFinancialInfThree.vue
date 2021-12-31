<!-- ：账户金融信息查询 -->
<template>
  <div class="allContent">
    <el-form :model="queryForm">
      <el-form-item
        class="cl_td"
        label="外部识别号"
        prop="externalIdentificationNo"
      >
        <el-input
          v-model="queryForm.externalIdentificationNo"
          class="wd200"
          type="text"
        />
      </el-form-item>
      <div class="cl_tr text_center">
        <el-button
          size="medium"
          icon="el-icon-search"
          type="primary"
          @click="handleSearch()"
          >查询</el-button
        >
        <el-button
          size="medium"
          icon="el-icon-refresh"
          type="primary"
          @click="reset()"
          >重置</el-button
        >
      </div>
    </el-form>

    <!-- 循环账户详情 -->
    <div v-show="isShowRevoleAccDetail">
      <div class="text_title">账户基本信息</div>
      <el-form :model="revoleAccObj">
        <el-form-item class="cl_td bnone" label="账户代码" prop="accountId">
          <el-input
            v-model="revoleAccObj.accountId"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item class="cl_td bnone" label="客户名称" prop="customerName">
          <el-input
            v-model="revoleAccObj.customerName"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="业务类型"
          prop="businessTypeCodeTrans"
        >
          <el-input
            v-model="revoleAccObj.businessTypeCodeTrans"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="产品代码"
          prop="productObjectCodeTrans"
        >
          <el-input
            v-model="revoleAccObj.productObjectCodeTrans"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item class="cl_td bnone" label="所属机构" prop="organNo">
          <el-select v-model="revoleAccObj.organNo" class="wd300">
            <el-option
              v-for="(item, index) in organNoOptions"
              :key="index"
              :label="item.organName"
              :value="item.organNo"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="cl_td bnone" label="账户状态" prop="statusCode">
          <el-select v-model="revoleAccObj.statusCode" class="wd300">
            <el-option
              v-for="(item, index) in statusCodeOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="业务项目"
          prop="businessProgramNoTrans"
        >
          <el-input
            v-model="revoleAccObj.businessProgramNoTrans"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="当前周期号"
          prop="currentCycleNumber"
        >
          <el-input
            v-model="revoleAccObj.currentCycleNumber"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="下一账单日"
          prop="nextBillDate"
        >
          <el-input
            v-model="revoleAccObj.nextBillDate"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="上一核算状态"
          prop="prevAccountingStatusCode"
        >
          <el-select
            v-model="revoleAccObj.prevAccountingStatusCode"
            class="wd300"
          >
            <el-option
              v-for="(item, index) in accountingStatusCodeOptions"
              :key="index"
              :label="item.labelDesc"
              :value="item.accountingStatus"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="核算状态"
          prop="accountingStatusCode"
        >
          <el-select v-model="revoleAccObj.accountingStatusCode" class="wd300">
            <el-option
              v-for="(item, index) in accountingStatusCodeOptions"
              :key="index"
              :label="item.labelDesc"
              :value="item.accountingStatus"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="cl_td bnone" label="ABS计划码" prop="absPlanId">
          <el-input
            v-model="revoleAccObj.absPlanId"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <div class="text_title">账户余额汇总信息</div>
        <el-form-item class="cl_td bnone" label="账户代码" prop="accountId">
          <el-input
            v-model="revoleAccObj.accountId"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="当前总余额"
          prop="totalBalance"
        >
          <el-input
            v-model="revoleAccObj.totalBalance"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="当期本金余额"
          prop="currPrincipalBalance"
        >
          <el-input
            v-model="revoleAccObj.currPrincipalBalance"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="账单本金余额"
          prop="billPrincipalBalance"
        >
          <el-input
            v-model="revoleAccObj.billPrincipalBalance"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="当期利息余额"
          prop="currInterestBalance"
        >
          <el-input
            v-model="revoleAccObj.currInterestBalance"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="账单利息余额"
          prop="billInterestBalance"
        >
          <el-input
            v-model="revoleAccObj.billInterestBalance"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="当期费用余额"
          prop="currCostBalance"
        >
          <el-input
            v-model="revoleAccObj.currCostBalance"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="账单费用余额"
          prop="billCostBalance"
        >
          <el-input
            v-model="revoleAccObj.billCostBalance"
            class="wd300"
            type="text"
          />
        </el-form-item>
      </el-form>
      <div class="text_title">账户余额利率信息</div>
      <v-table
        :tableData="accBalRate_tableData"
        :tableLabel="accBalRate_tableLabel"
        :config="accBalRate_config"
        :btns="accBalRate_btns"
        @changePage="getAccBalRateList(revoleAccObj)"
      ></v-table>
      <div class="text_title">账户余额明细信息</div>
      <v-table
        :tableData="accBalDetail_tableData"
        :tableLabel="accBalDetail_tableLabel"
        :config="accBalDetail_config"
        :btns="accBalDetail_btns"
        :btnWidth="100"
        @event1="accBalDetail_handleDetail"
        @changePage="getAccBalDetailList(revoleAccObj)"
      ></v-table>
      <div class="text_title">账户周期账务信息</div>
      <v-table
        :tableData="accIncurredAmount_tableData"
        :tableLabel="accIncurredAmount_tableLabel"
        :config="accIncurredAmount_config"
        :btns="accIncurredAmount_btns"
        :btnWidth="100"
        @event1="accIncurredAmount_handleDetail"
        @changePage="getAccIncurredAmountList(revoleAccObj)"
      ></v-table>
    </div>

    <!-- 溢缴款账户详情 -->
    <div v-show="isShowOverdueAccDetail">
      <div class="text_title">存款账户详情</div>
      <el-form :model="surplusAccObj">
        <el-form-item class="cl_td bnone" label="账户代码" prop="accountId">
          <el-input
            v-model="surplusAccObj.accountId"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item class="cl_td bnone" label="币种" prop="currencyCode">
          <el-input
            v-model="surplusAccObj.currencyCode"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item class="cl_td bnone" label="当前余额" prop="currBalance">
          <el-input
            v-model="surplusAccObj.currBalance"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="存款利率"
          prop="depositInterestRate"
        >
          <el-input
            v-model="surplusAccObj.depositInterestRate"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="上一结息金额"
          prop="interestBillingAmt"
        >
          <el-input
            v-model="surplusAccObj.interestBillingAmt"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item class="cl_td bnone" label="冻结余额" prop="frozenBalance">
          <el-input
            v-model="surplusAccObj.frozenBalance"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="当前累积积数"
          prop="currAccumultBalance"
        >
          <el-input
            v-model="surplusAccObj.currAccumultBalance"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="未入账利息"
          prop="unPostingInterest"
        >
          <el-input
            v-model="surplusAccObj.unPostingInterest"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="上一累积日期"
          prop="prevAccumultDate"
        >
          <el-input
            v-model="surplusAccObj.prevAccumultDate"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="利率生效日期"
          prop="interestRateEffectiveDate"
        >
          <el-input
            v-model="surplusAccObj.interestRateEffectiveDate"
            class="wd300"
            type="text"
          />
        </el-form-item>
      </el-form>
    </div>

    <!-- 交易账户详情 -->
    <div v-show="isShowTransAccDetail">
      <div class="text_title">信贷交易账户明细</div>
      <el-form :model="surplusAccObj">
        <el-form-item class="cl_td bnone" label="账户代码" prop="accountId">
          <el-input v-model="transAccObj.accountId" class="wd300" type="text" />
        </el-form-item>
        <el-form-item class="cl_td bnone" label="信贷交易类型" prop="loanType">
          <el-select v-model="transAccObj.loanType" class="wd200" clearable>
            <el-option
              v-for="(item, index) in loanTypeOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="cl_td bnone" label="贷款金额" prop="loanAmount">
          <el-input
            v-model="transAccObj.loanAmount"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item class="cl_td bnone" label="币种" prop="currencyCode">
          <el-select v-model="transAccObj.currencyCode" class="wd200" clearable>
            <el-option
              v-for="(item, index) in currencyCodeOptions"
              :key="index"
              :label="item.currencyDesc"
              :value="item.currencyCode"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="cl_td bnone" label="利率 %" prop="loanRate">
          <el-input v-model="transAccObj.loanRate" class="wd300" type="text" />
        </el-form-item>
        <el-form-item class="cl_td bnone" label="费率" prop="feeRate">
          <el-input v-model="transAccObj.feeRate" class="wd300" type="text" />
        </el-form-item>
        <el-form-item class="cl_td bnone" label="总费用" prop="feeAmount">
          <el-input v-model="transAccObj.feeAmount" class="wd300" type="text" />
        </el-form-item>
        <el-form-item class="cl_td bnone" label="总期数" prop="loanTerm">
          <el-input v-model="transAccObj.loanTerm" class="wd300" type="text" />
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="未抛账费用"
          prop="remainFeeAmount"
        >
          <el-input
            v-model="transAccObj.remainFeeAmount"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="未抛账期数"
          prop="remainPeriod"
        >
          <el-input
            v-model="transAccObj.remainPeriod"
            class="wd300"
            type="text"
          />
        </el-form-item>

        <el-form-item
          class="cl_td bnone"
          label="未抛账本金"
          prop="remainPrincipalAmount"
        >
          <el-input
            v-model="transAccObj.remainPrincipalAmount"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="已抛账欠款金额"
          prop="tossedAmount"
        >
          <el-input
            v-model="transAccObj.tossedAmount"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="下次抛账日"
          prop="nextThrowDate"
        >
          <el-input
            v-model="transAccObj.nextThrowDate"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item class="cl_td bnone" label="合同编号" prop="loanNum">
          <el-input v-model="transAccObj.loanNum" class="wd300" type="text" />
        </el-form-item>
        <el-form-item class="cl_td bnone" label="还款方式" prop="repayMode">
          <el-select v-model="transAccObj.repayMode" class="wd200" clearable>
            <el-option
              v-for="(item, index) in repayModeOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="贷款开始日期"
          prop="loanStartDate"
        >
          <el-input
            v-model="transAccObj.loanStartDate"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="贷款结束日期"
          prop="loanEndDate"
        >
          <el-input
            v-model="transAccObj.loanEndDate"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item class="cl_td bnone" label="起息日期" prop="startIntDate">
          <el-input
            v-model="transAccObj.startIntDate"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item class="cl_td bnone" label="免息天数" prop="freeDays">
          <el-input v-model="transAccObj.freeDays" class="wd300" type="text" />
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="还款周期"
          prop="repayPrincipalCycle"
        >
          <el-input
            v-model="transAccObj.repayPrincipalCycle"
            class="wd300"
            type="text"
          />
        </el-form-item>

        <el-form-item class="cl_td bnone" label="执行利率 %" prop="loanRate">
          <el-input v-model="transAccObj.loanRate" class="wd300" type="text" />
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="罚息上浮百分比"
          prop="penaltyUp"
        >
          <el-input v-model="transAccObj.penaltyUp" class="wd300" type="text" />
        </el-form-item>
        <el-form-item class="cl_td bnone" label="利息合计" prop="interAmount">
          <el-input
            v-model="transAccObj.interAmount"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="未抛账利息"
          prop="remainInterAmount"
        >
          <el-input
            v-model="transAccObj.remainInterAmount"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="收款账户"
          prop="directDebitAccountNo"
        >
          <el-input
            v-model="transAccObj.directDebitAccountNo"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="收款账户所属行号"
          prop="directDebitBankNo"
        >
          <el-input
            v-model="transAccObj.directDebitBankNo"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item class="cl_td bnone" label="状态" prop="statusCode">
          <el-select v-model="transAccObj.statusCode" class="wd300">
            <el-option
              v-for="(item, index) in loanStatusOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <v-table
          :tableData="transDetail_tableData"
          :tableLabel="transDetail_tableLabel"
          :config="transDetail_config"
          :btns="transDetail_btns"
          @changePage="geTransDetailList(transAccObj)"
        ></v-table>

        <div class="text_title">账户基本信息</div>
        <el-form-item class="cl_td bnone" label="账户代码" prop="accountId">
          <el-input v-model="transAccObj.accountId" class="wd300" type="text" />
        </el-form-item>
        <el-form-item class="cl_td bnone" label="客户名称" prop="customerName">
          <el-input
            v-model="transAccObj.customerName"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="业务类型"
          prop="businessTypeCodeTrans"
        >
          <el-input
            v-model="transAccObj.businessTypeCodeTrans"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="产品代码"
          prop="productObjectCodeTrans"
        >
          <el-input
            v-model="transAccObj.productObjectCodeTrans"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item class="cl_td bnone" label="所属机构" prop="organNo">
          <el-select v-model="transAccObj.organNo" class="wd300">
            <el-option
              v-for="(item, index) in organNoOptions"
              :key="index"
              :label="item.organName"
              :value="item.organNo"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="cl_td bnone" label="账户状态" prop="statusCode">
          <el-select v-model="transAccObj.statusCode" class="wd300">
            <el-option
              v-for="(item, index) in statusCodeOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="业务项目"
          prop="businessProgramNoTrans"
        >
          <el-input
            v-model="transAccObj.businessProgramNoTrans"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="当前周期号"
          prop="currentCycleNumber"
        >
          <el-input
            v-model="transAccObj.currentCycleNumber"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="下一账单日"
          prop="nextBillDate"
        >
          <el-input
            v-model="transAccObj.nextBillDate"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item class="cl_td bnone" label="ABS计划码" prop="absPlanId">
          <el-input v-model="transAccObj.absPlanId" class="wd300" type="text" />
        </el-form-item>
        <div class="text_title">账户余额汇总信息</div>
        <el-form-item class="cl_td bnone" label="账户代码" prop="accountId">
          <el-input v-model="transAccObj.accountId" class="wd300" type="text" />
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="当前总余额"
          prop="totalBalance"
        >
          <el-input
            v-model="transAccObj.totalBalance"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="当期本金余额"
          prop="currPrincipalBalance"
        >
          <el-input
            v-model="transAccObj.currPrincipalBalance"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="账单本金余额"
          prop="billPrincipalBalance"
        >
          <el-input
            v-model="transAccObj.billPrincipalBalance"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="当期利息余额"
          prop="currInterestBalance"
        >
          <el-input
            v-model="transAccObj.currInterestBalance"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="账单利息余额"
          prop="billInterestBalance"
        >
          <el-input
            v-model="transAccObj.billInterestBalance"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="当期费用余额"
          prop="currCostBalance"
        >
          <el-input
            v-model="transAccObj.currCostBalance"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td bnone"
          label="账单费用余额"
          prop="billCostBalance"
        >
          <el-input
            v-model="transAccObj.billCostBalance"
            class="wd300"
            type="text"
          />
        </el-form-item>
        <div class="text_title">账户余额利率信息</div>
        <v-table
          :tableData="accBalRate_tableData"
          :tableLabel="accBalRate_tableLabel"
          :config="accBalRate_config"
          :btns="accBalRate_btns"
          @changePage="getAccBalRateList(revoleAccObj)"
        ></v-table>
        <div class="text_title">账户余额明细信息</div>
        <v-table
          :tableData="accBalDetail_tableData"
          :tableLabel="accBalDetail_tableLabel"
          :config="accBalDetail_config"
          :btns="accBalDetail_btns"
          :btnWidth="100"
          @event1="accBalDetail_handleDetail"
          @changePage="getAccBalDetailList(revoleAccObj)"
        ></v-table>
        <div class="text_title">账户周期账务信息</div>
        <v-table
          :tableData="accIncurredAmount_tableData"
          :tableLabel="accIncurredAmount_tableLabel"
          :config="accIncurredAmount_config"
          :btns="accIncurredAmount_btns"
          :btnWidth="100"
          @event1="accIncurredAmount_handleDetail"
          @changePage="getAccIncurredAmountList(revoleAccObj)"
        ></v-table>
      </el-form>
    </div>

    <!-- 争议账户详情 -->
    <div v-show="isShowDisputeAccDetail">
      <dispute-acc-info :formObj="disputeAccObj"> </dispute-acc-info>
      <div class="cl_tr text_center">
        <el-button
          size="small"
          icon="el-icon-check"
          type="primary"
          @click="sureOrigTransInfo()"
          >原交易信息</el-button
        >
        <el-button
          size="small"
          icon="el-icon-check"
          type="primary"
          @click="sureDisReleaseCst()"
          >争议释放有利于客户</el-button
        >
        <el-button
          size="small"
          icon="el-icon-check"
          type="primary"
          @click="sureDisReleaseBank()"
          >争议释放有利于银行</el-button
        >
        <el-button
          size="small"
          icon="el-icon-check"
          type="primary"
          @click="sureTransApplyOrRefusManage()"
          >调单申请/拒付管理</el-button
        >
      </div>
    </div>

    <!-- 原交易信息 -->
    <div v-show="isShowOrginTransDetail"></div>

    <!-- 账户列表 弹窗 -->
    <el-dialog title="账户列表" :visible.sync="accList_dialog" width="85%">
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
        @row-click="chooseList1"
      >
        <el-table-column width="80">
          <template slot-scope="scope">
            <el-radio v-model="curRowRadio" :label="scope.row.accountId">
              <span class="el-radio__label"></span>
            </el-radio>
          </template>
        </el-table-column>

        <el-table-column
          prop="accountId"
          label="账户代码"
          align="center"
          width="230"
        />
        <el-table-column prop="currencyDesc" label="币种" align="center" />
        <el-table-column
          prop=""
          label="业务项目/子账户类型"
          align="center"
          width="220"
        >
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
        <el-table-column
          prop=""
          label="业务类型/类型代码及描述"
          align="center"
          width="220"
        >
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
        <el-table-column
          prop="productObjectCode"
          label="产品对象代码"
          align="center"
          width="200"
        >
          <template slot-scope="{ row }">
            {{ row.productObjectCode }}
            {{ row.productDesc }}
          </template>
        </el-table-column>
        <el-table-column
          prop="accountOrganFormDesc"
          label="账户组织形式"
          align="center"
        />
        <el-table-column
          prop="businessDebitCreditCodeDesc"
          label="账户性质"
          align="center"
        />
        <el-table-column prop="statusCodeDesc" label="状态码" align="center" />
        <el-table-column
          prop="totalBalance"
          label="当前总余额"
          align="center"
        />
      </el-table>
      <pagination
        v-show="config.total > 0"
        :total="config.total"
        :page.sync="config.pageNum"
        :limit.sync="config.pageSize"
        @pagination="getList"
      />

      <div class="text_title">溢缴款账户信息表</div>
      <v-table
        :tableData="tableData2"
        :tableLabel="tableLabel2"
        :config="config2"
        :btns="btns2"
        @event1="transferOut"
        :btnWidth="200"
        @changePage="getList2"
        :radioObj="radioObj2"
        :radio="curRowRadio2"
        @currentChange="currentChange2"
        @rowClick="rowClick2"
      ></v-table>
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
        @row-click="chooseList3"
      >
        <el-table-column width="150">
          <template slot-scope="scope">
            <el-radio v-model="curRowRadio3" :label="scope.row.accountId">
              <span class="el-radio__label"></span>
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column
          prop="loanTypeDesc"
          label="信贷交易类型"
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
        <el-table-column prop="statusDesc" label="贷款状态" align="center" />
      </el-table>
      <pagination
        v-show="config3.total > 0"
        :total="config3.total"
        :page.sync="config3.pageNum"
        :limit.sync="config3.pageSize"
        @pagination="getList3"
      />

      <div class="text_title">争议账户信息表</div>
      <v-table
        :tableData="tableData4"
        :tableLabel="tableLabel4"
        :config="config4"
        :btns="btns4"
        :btnWidth="100"
        @changePage="getList4"
        :radioObj="radioObj4"
        :radio="curRowRadio4"
        @currentChange="currentChange4"
        @rowClick="rowClick4"
      ></v-table>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sureAccBtn"> 确认 </el-button>
        <el-button @click="accList_dialog = false"> 关闭 </el-button>
      </div>
    </el-dialog>

    <!-- 溢缴款账户信息 转出 弹窗 -->
    <el-dialog
      title="溢缴款账户信息"
      :visible.sync="transferOut_dialog"
      width="65%"
    >
      <el-form
        ref="transferOutRef"
        :model="transferOutObj"
        :rules="transferOutRules"
      >
        <el-form-item
          class="cl_td"
          label="转出金额"
          prop="transAmount"
          :rules="[
            { required: true, message: '转出金额不能为空', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="transferOutObj.transAmount"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td"
          label="转出卡号"
          prop="externalIdentificationNoT"
          :rules="[
            { required: true, message: '转出卡号不能为空', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="transferOutObj.externalIdentificationNoT"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td"
          label="姓名"
          prop="mediaUserName"
          :rules="[
            { required: true, message: '姓名不能为空', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="transferOutObj.mediaUserName"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td"
          label="交易日期"
          prop="transDate"
          :rules="[
            { required: true, message: '交易日期不能为空', trigger: 'blur' },
          ]"
        >
          <el-date-picker
            v-model="transferOutObj.transDate"
            class="wd200"
            type="date"
            placeholder="选择交易日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            :clearable="true"
          />
        </el-form-item>
        <el-form-item class="cl_td" label="银行" prop="bank">
          <el-input v-model="transferOutObj.bank" class="wd200" type="text" />
        </el-form-item>
        <el-form-item class="cl_td" label="转出说明" prop="rollOutInstruction">
          <el-input
            v-model="transferOutObj.rollOutInstruction"
            class="wd200"
            type="text"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sureTransferOut"> 确定 </el-button>
        <el-button @click="transferOut_dialog = false"> 取消 </el-button>
      </div>
    </el-dialog>

    <!-- 余额单元明细 弹窗 -->
    <el-dialog
      title="余额单元明细"
      :visible.sync="balanceUnitl_dialog"
      width="65%"
    >
      <balance-unitl-detail :formObj="balanceUnitlObj"></balance-unitl-detail>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="balanceUnitl_dialog = false">
          关闭
        </el-button>
      </div>
    </el-dialog>

    <!-- 账户周期金融明细 弹窗 -->
    <el-dialog
      title="账户周期金融明细"
      :visible.sync="accCycleFin_dialog"
      width="65%"
    >
      <acc-cycle-fin-detail :formObj="accCycleFinObj"></acc-cycle-fin-detail>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="accCycleFin_dialog = false">
          关闭
        </el-button>
      </div>
    </el-dialog>

    <!-- 争议账户信息  原交易信息详情 弹窗 -->
    <el-dialog
      title="原交易信息详情"
      :visible.sync="origTransInfo_dialog"
      width="75%"
    >
      <trans-info
        :formObj="origTransInfoObj"
        :showBtn="origTransInfo_showBtn"
      ></trans-info>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="origTransInfo_dialog = false">
          关闭
        </el-button>
      </div>
    </el-dialog>

    <!-- //争议账户 AppVISA弹窗 -->
    <el-dialog title="visa信息" :visible.sync="appVisa_dialog" width="75%">
      <visa-info :formObj="appVisaFormInf"></visa-info>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="appVisa_dialog = false">
          关闭
        </el-button>
      </div>
    </el-dialog>

    <!-- //争议账户 AppMCC 弹窗 -->
    <el-dialog title="MCC信息" :visible.sync="appMcc_dialog" width="75%">
      <mcc-info :formObj="appMCFormInf"></mcc-info>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="appMcc_dialog = false">
          关闭
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>
  
<script>
import Pagination from "@/components/Pagination";
import VTable from "@/components-ider/VTable";
import BalanceUnitlDetail from "@/components-ider/cstSvc/BalanceUnitlDetail";
import AccCycleFinDetail from "@/components-ider/cstSvc/AccCycleFinDetail";
import DisputeAccInfo from "@/components-ider/cstSvc/DisputeAccInfo";
import TransInfo from "@/components-ider/cstSvc/TransInfo";
import VisaInfo from "@/components-ider/cstSvc/VisaInfo";
import MccInfo from "@/components-ider/cstSvc/MccInfo";

export default {
  name: "AccFinancialInfThree",
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
        externalIdentificationNo: "",
      },
      customerName: "",
      // 下拉框
      idTypeList: [],
      organNoOptions: [],
      statusCodeOptions: [],
      accountingStatusCodeOptions: [],
      loanTypeOptions: [],
      currencyCodeOptions: [],
      repayModeOptions: [],
      loanStatusOptions: [],

      // 账户列表
      accList_dialog: false,
      accFlag: "", // 记录选择的账户类型

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
      // 溢缴款账户信息表
      config2: {
        loading: false,
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      tableData2: [],
      radioObj2: {
        radio: "accountId",
      },
      tableLabel2: [
        {
          label: "账户代码",
          prop: "accountId",
          width: "220",
        },
        {
          label: "币种",
          prop: "currencyCode_concat",
        },
        {
          label: "当前余额",
          prop: "currBalance",
        },
        {
          label: "存款利率",
          prop: "depositInterestRate",
        },
        {
          label: "上一结息金额",
          prop: "interestBillingAmt",
        },
        {
          label: "冻结余额",
          prop: "frozenBalance",
        },
      ],
      btns2: ["转出"],
      curRowRadio2: "",
      curRow2: {},
      //交易账户信息表
      config3: {
        loading: false,
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      tableData3: [],
      curRowRadio3: "",
      curRow3: {},
      // 争议账户信息表
      config4: {
        loading: false,
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      tableData4: [],
      tableLabel4: [
        {
          label: "账户代码",
          prop: "accountId",
          width: "220",
        },
        {
          label: "币种",
          prop: "currencyCode_concat",
        },
        {
          label: "业务项目",
          prop: "businessProgramNo_concat",
          width: "200",
        },
        {
          label: "业务类型",
          prop: "businessTypeCode_concat",
          width: "200",
        },
        {
          label: "产品对象代码",
          prop: "productObjectCode_concat",
          width: "200",
        },
        {
          label: "账户组织形式",
          prop: "accountOrganFormDesc",
        },
        {
          label: "账户性质",
          prop: "businessDebitCreditCodeDesc",
        },
        {
          label: "状态码",
          prop: "statusCodeDesc",
        },
        {
          label: "当前总余额",
          prop: "frozenBalance",
        },
      ],
      btns4: [],
      curRowRadio4: "",
      curRow4: {},
      radioObj4: {
        radio: "accountId",
      },
      // 详情 显示
      isShowRevoleAccDetail: false, // 循环账户详情
      isShowOverdueAccDetail: false, // 溢缴款账户详情
      isShowTransAccDetail: false, // 交易账户详情
      isShowDisputeAccDetail: false, // 争议账户详情
      isShowOrginTransDetail: false, // 原交易信息
      revoleAccObj: {},
      surplusAccObj: {},
      transAccObj: {},
      disputeAccObj: {},
      orginTransObj: {},

      // 账户余额列表
      // 账户余额利率信息
      accBalRate_config: {
        loading: false,
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      accBalRate_btns: [],
      accBalRate_tableData: [],
      accBalRate_tableLabel: [
        {
          label: "余额对象",
          prop: "balanceObjectCode_concat",
          width: "220",
        },
        {
          label: "币种",
          prop: "currencyCode_concat",
        },
        {
          label: "生效利率",
          prop: "interestRate",
        },
        {
          label: "利率变更标志",
          prop: "rateChangeFlagDesc",
          width: 200,
        },
        {
          label: "pending生效利率",
          prop: "pendingInterestRate",
          width: "220",
        },
        {
          label: "溢缴款利率变动标志",
          prop: "overpayRateChangeFlagDesc",
        },
      ],
      accBalRate_btns: [],
      // 账户余额明细信息
      accBalDetail_config: {
        loading: false,
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      accBalDetail_tableData: [],
      accBalDetail_tableLabel: [
        {
          label: "周期号",
          prop: "cycleNumber",
        },
        {
          label: "余额对象",
          prop: "balanceObjectCode_concat",
          width: "220",
        },
        {
          label: "余额单元代码",
          prop: "balanceUnitCode",
          width: 180,
        },
        {
          label: "币种",
          prop: "currencyCode_concat",
        },
        {
          label: "余额类型",
          prop: "balanceTypeDesc",
        },
        {
          label: "余额",
          prop: "balance",
        },
        {
          label: "年利率",
          prop: "annualInterestRate",
        },
        {
          label: "核算状态",
          prop: "accountingStatusCode_concat",
        },
      ],
      accBalDetail_btns: ["详情"],

      // 账户周期账务信息
      accIncurredAmount_config: {
        loading: false,
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      accIncurredAmount_tableData: [],
      accIncurredAmount_tableLabel: [
        {
          label: "周期号",
          prop: "currentCycleNumber",
        },
        {
          label: "币种",
          prop: "currencyCode_concat",
        },
        {
          label: "期初宽限余额",
          prop: "beginGraceBalance",
        },
        {
          label: "当前宽限余额",
          prop: "graceBalance",
        },
        {
          label: "宽限日前还款金额",
          prop: "paymentWithinGrace",
        },
        {
          label: "宽限日后还款金额",
          prop: "paymentAfterGrace",
        },
        {
          label: "贷方调整金额",
          prop: "creditAdjustAmount",
        },
        {
          label: "往期贷方调整金额",
          prop: "billCreditAdjustAmount",
        },
        {
          label: "还款还原宽限日前还款",
          prop: "paymentRevWithinGrace",
        },
        {
          label: "还款还原宽限日后还款",
          prop: "paymentRevAfterGrace",
        },
      ],
      accIncurredAmount_btns: ["详情"],
      // 账户余额明细信息 详情
      // 余额单元明细
      balanceUnitlObj: {},
      accCycleFinObj: {},
      balanceUnitl_dialog: false,
      accCycleFin_dialog: false,

      // 溢缴款账户信息表 转出 弹窗
      transferOut_dialog: false,
      transferOutRef: {},
      transferOutObj: {},
      transferOutRules: {},
      nextProcessDate: "",
      corporationEntityNo: "",

      // 交易账户详细 分期计划列表
      transDetail_tableData: [],
      transDetail_tableLabel: [
        {
          label: "期次",
          prop: "termNo",
        },
        {
          label: "当期抛账日",
          prop: "throwDate",
        },
        {
          label: "应还本金",
          prop: "principalAmount",
        },
        {
          label: "应还利息",
          prop: "interestAmount",
        },
        {
          label: "应还费用",
          prop: "feeAmount",
        },
      ],
      transDetail_config: {
        loading: false,
        pageNum: 1,
        pageSize: 10,
        total: 0,
      },
      transDetail_btns: [],

      // 争议账户 详细
      origTransInfo_dialog: false,
      origTransInfoObj: {},
      origTransInfo_showBtn: false,
      // 调单申请、 拒付管理 弹窗
      visaObj: {},
      mccObj: {},
      appVisaFormInf: {},
      appMCFormInf: {},
      appVisa_dialog: false,
      appMcc_dialog: false,
    };
  },
  created() {
    this.init();
  },
  mounted() {
    this.getSelectDict("dic_certificateType").then((res) => {
      this.idTypeList = res;
    });
    // 所属机构
    this.getSelectDict("/beta/betaService/COS.IQ.02.0005").then((res) => {
      this.organNoOptions = res;
    });
    // 账户状态
    this.getSelectDict("dic_accStatusCode").then((res) => {
      this.statusCodeOptions = res;
    });
    // 贷款状态
    this.getSelectDict("dic_loanStatus").then((res) => {
      this.loanStatusOptions = res;
    });

    // 核算状态
    this.getSelectDict("/beta/betaService/COS.IQ.02.0051").then((res) => {
      //   console.log(res)
      res.forEach((item) => {
        item.labelDesc = item.accountingStatus + " " + item.accountingDesc;
      });
      this.accountingStatusCodeOptions = res;
    });
    // 信贷交易类型
    this.getSelectDict("dic_loanType").then((res) => {
      this.loanTypeOptions = res;
    });
    // 币种
    this.getSelectDict("/beta/betaService/COS.IQ.02.0012").then((res) => {
      this.currencyCodeOptions = res;
    });
    // 还款方式
    this.getSelectDict("dic_repaymentMethod").then((res) => {
      this.repayModeOptions = res;
    });
  },
  methods: {
    init() {
      this.queryForm = {
        externalIdentificationNo: "",
      };
      this.isShowRevoleAccDetail = false; //循环账户详情
      this.isShowOverdueAccDetail = false; //溢缴款账户详情
      this.isShowTransAccDetail = false; //交易账户详情
      this.isShowDisputeAccDetail = false; //争议账户详情
      this.isShowOrginTransDetail = false; //原交易信息
    },
    // 重置
    reset() {
      this.init();
    },
    // 点击查询按钮
    handleSearch() {
      if (
        !this.queryForm.externalIdentificationNo &&
        !this.queryForm.idType &&
        !this.queryForm.idNumber
      ) {
        this.$message({
          message: "请输入查询信息",
          type: "warning",
        });
        this.init();
      } else {
        this.config.pageNum = 1;
        if (this.queryForm.idType) {
          if (!this.queryForm.idNumber) {
            this.$message({
              message: "请输入证件号码",
              type: "warning",
            });
          } else {
            this.getAccList();
          }
        } else if (this.queryForm.idNumber) {
          if (!this.queryForm.idType) {
            this.$message({
              message: "请输入证件类型",
              type: "warning",
            });
          } else {
            this.getAccList();
          }
        } else {
          this.getAccList();
        }
      }
    },

    // 获取账户列表
    getAccList() {
      // 查询客户是否存在
      this.post(
        "/nonfi/nonfinanceService/BSS.IQ.01.0001",
        this.queryForm,
        (res) => {
          if (res.returnCode == "000000") {
            this.accList_dialog = true;
            this.customerName = res.returnData.rows[0].customerName;
            this.getList();
            this.getList2();
            this.getList3();
            this.getList4();
          } else {
            this.isShowRevoleAccDetail = false; //循环账户详情
            this.isShowOverdueAccDetail = false; //溢缴款账户详情
            this.isShowTransAccDetail = false; //交易账户详情
            this.isShowDisputeAccDetail = false; //争议账户详情
            this.isShowOrginTransDetail = false; //原交易信息
          }
        }
      );
    },
    // 循环账户信息表
    getList() {
      this.config.loading = true;
      let params = {
        accountOrganForm: "R", //循环账户
        flag: "Y", //输入该客户下任意卡号应都可以查询到该客户的所有账户，但目前不可以
        pageFlag: "mainPage",
        isTrans: true, //是否需要翻译数据字典
        transParams: [
          "dic_accountOrganForm",
          "dic_businessDebitCreditCode",
          "dic_accStatusCode",
        ], //查找数据字典所需参数
        transDict: [
          "accountOrganForm",
          "businessDebitCreditCode",
          "statusCode",
        ], //翻译前后key
      };
      params = Object.assign(params, this.config, this.queryForm);
      this.getTableList(
        "/nonfi/nonfinanceService/BSS.IQ.01.0118",
        params,
        (res) => {
          if (res.returnCode == "000000") {
            this.showTable = true;
            this.config.loading = false;
            if (
              res.returnData &&
              res.returnData.rows &&
              res.returnData.rows.length > 0
            ) {
              let rows = res.returnData.rows;
              rows.forEach((element) => {
                element.haveChild = true;
              });
              this.tableData = rows;
              this.config.total = res.returnData.totalCount;
            } else {
              this.tableData = [];
            }
          }
        },
        (err) => {
          if (err) {
            this.tableData = [];
            this.config.total = 0;
            this.showTable = false;
            this.config.loading = false;
          }
        }
      );
    },
    // 溢缴款账户信息表
    getList2() {
      this.config2.loading = true;
      let params = {
        operationMode: this.operationMode,
      };
      params = Object.assign(params, this.config2, this.queryForm);
      this.getTableList(
        "/nonfi/nonfinanceService/BSS.IQ.01.0070",
        params,
        (res) => {
          if (res.returnCode == "000000") {
            this.config2.loading = false;
            if (
              res.returnData &&
              res.returnData.rows &&
              res.returnData.rows.length > 0
            ) {
              let rows = res.returnData.rows;
              rows.forEach((ele) => {
                ele.currencyCode_concat =
                  ele.currencyCode + " " + ele.currencyDesc;
              });
              this.tableData2 = rows;
              this.config2.total = res.returnData.totalCount;
            } else {
              this.tableData2 = [];
            }
          }
        },
        (err) => {
          if (err) {
            this.tableData2 = [];
            this.config2.total = 0;
          }
        }
      );
    },
    getList3() {
      this.config3.loading = true;
      let params = {
        accountOrganForm: "R", //循环账户
        flag: "N",
        pageFlag: "mainPage",
        isTrans: true, //是否需要翻译数据字典
        transParams: ["dic_loanStatus"], //查找数据字典所需参数
        transDict: ["status"], //翻译前后key
      };
      params = Object.assign(params, this.config3, this.queryForm);
      this.getTableList(
        "/nonfi/nonfinanceService/ILS.IQ.01.0020",
        params,
        (res) => {
          if (res.returnCode == "000000") {
            this.config3.loading = false;
            if (
              res.returnData &&
              res.returnData.rows &&
              res.returnData.rows.length > 0
            ) {
              let rows = res.returnData.rows;
              rows.forEach((element) => {
                element.haveChild = true;
              });
              this.tableData3 = rows;
              this.config3.total = res.returnData.totalCount;
            } else {
              this.tableData3 = [];
            }
          }
        },
        (err) => {
          if (err) {
            this.tableData3 = [];
            this.config3.total = 0;
          }
        }
      );
    },
    // 争议账户信息表
    getList4() {
      this.config4.loading = true;
      let params = {
        isTrans: true,
        transParams: [
          "dic_accountOrganForm",
          "dic_businessDebitCreditCode",
          "dic_accStatusCode",
        ],
        transDict: [
          "accountOrganForm",
          "businessDebitCreditCode",
          "statusCode",
        ],
      };
      params = Object.assign(params, this.config4, this.queryForm);
      this.getTableList(
        "/nonfi/nonfinanceService/ISS.IQ.01.0008",
        params,
        (res) => {
          if (res.returnCode == "000000") {
            this.config4.loading = false;
            if (
              res.returnData &&
              res.returnData.rows &&
              res.returnData.rows.length > 0
            ) {
              let rows = res.returnData.rows;
              rows.forEach((ele) => {
                ele.businessProgramNo_concat =
                  ele.businessProgramNo + ele.programDesc;
                ele.businessTypeCode_concat =
                  ele.businessTypeCode + ele.businessDesc;
                ele.productObjectCode_concat =
                  ele.productObjectCode + ele.productDesc;
                ele.currencyCode_concat =
                  ele.currencyCode + " " + ele.currencyDesc;
              });
              this.tableData4 = rows;
              this.config4.total = res.returnData.totalCount;
            } else {
              this.tableData4 = [];
            }
          }
        },
        (err) => {
          if (err) {
            this.tableData4 = [];
            this.config4.total = 0;
          }
        }
      );
    },

    // 账户余额利率信息 列表
    getAccBalRateList(obj) {
      let params = {
        idType: obj.idType,
        idNumber: obj.idNumber,
        externalIdentificationNo: obj.externalIdentificationNo,
        accountId: obj.accountId,
        currencyCode: obj.currencyCode,
        operationMode: obj.operationMode,
        isTrans: true, //是否需要翻译数据字典
        transParams: ["dic_rateChangeFlag", "dic_overpayRateChangeFlag"], //查找数据字典所需参数
        transDict: ["rateChangeFlag", "overpayRateChangeFlag"], //翻译前后key
      };
      this.getTableList(
        "/nonfi/nonfinanceService/BSS.IQ.01.0025",
        params,
        (res) => {
          if (res.returnCode == "000000") {
            this.accBalRate_config.loading = false;
            if (
              res.returnData &&
              res.returnData.rows &&
              res.returnData.rows.length > 0
            ) {
              let rows = res.returnData.rows;
              rows.forEach((item) => {
                item.balanceObjectCode_concat =
                  item.balanceObjectCode + " " + item.balanceObjectDesc;
                item.currencyCode_concat =
                  item.currencyCode + " " + item.currencyDesc;
              });
              this.accBalRate_tableData = rows;
              this.accBalRate_config.total = res.returnData.totalCount;
            } else {
              this.accBalRate_tableData = [];
            }
          }
        },
        (err) => {
          if (err) {
            this.accBalRate_tableData = [];
            this.accBalRate_config.total = 0;
          }
        }
      );
    },

    // 账户余额明细信息 列表
    getAccBalDetailList(obj) {
      let params = {
        idType: obj.idType,
        idNumber: obj.idNumber,
        externalIdentificationNo: obj.externalIdentificationNo,
        accountId: obj.accountId,
        currencyCode: obj.currencyCode,
        operationMode: obj.operationMode,
        isTrans: true, //是否需要翻译数据字典
        transParams: ["dic_balanceType", "dic_assetSubTable"], //查找数据字典所需参数
        transDict: ["balanceType", "assetProperties"], //翻译前后key
      };
      this.getTableList(
        "/nonfi/nonfinanceService/BSS.IQ.01.0030",
        params,
        (res) => {
          if (res.returnCode == "000000") {
            this.accBalDetail_config.loading = false;
            if (
              res.returnData &&
              res.returnData.rows &&
              res.returnData.rows.length > 0
            ) {
              let rows = res.returnData.rows;
              rows.forEach((item) => {
                item.balanceObjectCode_concat =
                  item.balanceObjectCode + " " + item.balanceObjectDesc;
                item.currencyCode_concat =
                  item.currencyCode + " " + item.currencyDesc;
                if (item.accountingStatusCode) {
                  item.accountingStatusCode_concat =
                    item.accountingStatusCode +
                    " " +
                    item.accountingStatusCodeDesc;
                } else {
                  item.accountingStatusCode_concat =
                    item.accountingStatusCodeDesc;
                }
              });
              this.accBalDetail_tableData = rows;
              this.accBalDetail_config.total = res.returnData.totalCount;
            } else {
              this.accBalDetail_tableData = [];
            }
          }
        },
        (err) => {
          if (err) {
            this.accBalDetail_tableData = [];
            this.accBalDetail_config.total = 0;
          }
        }
      );
    },

    // 账户发生额明细信息 列表
    getAccIncurredAmountList(obj) {
      let params = {
        idType: obj.idType,
        idNumber: obj.idNumber,
        externalIdentificationNo: obj.externalIdentificationNo,
        accountId: obj.accountId,
        currencyCode: obj.currencyCode,
        operationMode: obj.operationMode,
      };
      this.getTableList(
        "/nonfi/nonfinanceService/BSS.IQ.01.0045",
        params,
        (res) => {
          if (res.returnCode == "000000") {
            this.accIncurredAmount_config.loading = false;
            if (
              res.returnData &&
              res.returnData.rows &&
              res.returnData.rows.length > 0
            ) {
              let rows = res.returnData.rows;
              rows.forEach((item) => {
                item.currencyCode_concat =
                  item.currencyCode + " " + item.currencyDesc;
              });
              this.accIncurredAmount_tableData = rows;
              this.accIncurredAmount_config.total = res.returnData.totalCount;
            } else {
              this.accIncurredAmount_tableData = [];
            }
          }
        },
        (err) => {
          if (err) {
            this.accIncurredAmount_tableData = [];
            this.accIncurredAmount_config.total = 0;
          }
        }
      );
    },

    // 查询实时余额
    queryTimeBalance(obj) {
      let params = {
        authDataSynFlag: "1",
        requestType: "1",
        externalIdentificationNo: this.queryForm.externalIdentificationNo,
      };
      params = Object.assign(params, obj);
      this.post("/nonfi/nonfinanceService/ISS.IQ.01.0050", params, (res) => {
        if (res.returnCode == "000000") {
          //循环账户余额汇总信息
          this.revoleAccObj.accountId = res.returnData.rows[0].accountId; //交易账户 账号
          this.revoleAccObj.totalBalance = res.returnData.rows[0].totalBalance; //交易账户
          this.revoleAccObj.billCostBalance = res.returnData.rows[0].feeForBill;
          this.revoleAccObj.billPrincipalBalance =
            res.returnData.rows[0].principalForBill;
          this.revoleAccObj.billInterestBalance =
            res.returnData.rows[0].interestForBill;
          this.revoleAccObj.currCostBalance =
            res.returnData.rows[0].feeForCurrent;
          this.revoleAccObj.currPrincipalBalance =
            res.returnData.rows[0].principalForCurrent;
          this.revoleAccObj.currInterestBalance =
            res.returnData.rows[0].interestForCurrent;

          //交易账户 余额汇总信息
          this.transAccObj.accountId = res.returnData.rows[0].accountId; //交易账户 账号
          this.transAccObj.totalBalance = res.returnData.rows[0].totalBalance; //交易账户
          this.transAccObj.billCostBalance = res.returnData.rows[0].feeForBill;
          this.transAccObj.billPrincipalBalance =
            res.returnData.rows[0].principalForBill;
          this.transAccObj.billInterestBalance =
            res.returnData.rows[0].interestForBill;
          this.transAccObj.currCostBalance =
            res.returnData.rows[0].feeForCurrent;
          this.transAccObj.currPrincipalBalance =
            res.returnData.rows[0].principalForCurrent;
          this.transAccObj.currInterestBalance =
            res.returnData.rows[0].interestForCurrent;
        }
      });
    },
    // 查询3个列表 账户余额利率信息列表 账户余额明细信息列表 账户发生额明细信息列表
    queryAllAccDetail(obj) {
      this.queryTimeBalance(obj);
      this.getAccBalRateList(obj); // 账户余额利率信息 列表
      this.getAccBalDetailList(obj); // 账户余额明细信息 列表
      this.getAccIncurredAmountList(obj); // 账户发生额明细信息 列表
    },

    //账户余额明细信息 详情 按钮
    accBalDetail_handleDetail(row) {
      this.balanceUnitl_dialog = true;
      this.balanceUnitlObj = Object.assign({}, row);
    },
    //账户周期账务信息 详情 按钮
    accIncurredAmount_handleDetail(row) {
      this.accCycleFin_dialog = true;
      this.accCycleFinObj = Object.assign({}, row);
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
        this.getTableList(
          "/nonfi/nonfinanceService/BSS.IQ.01.0118",
          params1,
          (res) => {
            if (res.returnCode == "000000") {
              if (
                res.returnData &&
                res.returnData.rows &&
                res.returnData.rows.length > 0
              ) {
                childList = res.returnData.rows;
              } else {
                childList = [];
              }
              resolve(childList);
            }
          }
        );
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
        this.getTableList(
          "/nonfi/nonfinanceService/ILS.IQ.01.0025",
          params1,
          (res) => {
            if (res.returnCode == "000000") {
              if (
                res.returnData &&
                res.returnData.rows &&
                res.returnData.rows.length > 0
              ) {
                childList = res.returnData.rows;
              } else {
                childList = [];
              }
              resolve(childList);
            }
          }
        );
      }, 1000);
    },

    // 转出
    transferOut(row) {
      // console.log(row)
      this.transferOut_dialog = true;
      this.transferOutObj = Object.assign(row, this.queryForm);
      this.transferOutObj.transDate = this.nextProcessDate;
    },
    // 确定转出
    sureTransferOut() {
      this.$refs["transferOutRef"].validate((valid) => {
        if (valid) {
          if (
            this.transferOutObj.transAmount > this.transferOutObj.currBalance
          ) {
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
      this.transDetail_config.loading = true;
      let params = {
        accountId: obj.accountId,
        externalIdentificationNo: obj.externalIdentificationNo,
        currencyCode: obj.currencyCode,
      };
      params = Object.assign(params, this.transDetail_config);
      this.getTableList(
        "/nonfi/nonfinanceService/ILS.IQ.01.0015",
        params,
        (res) => {
          if (res.returnCode == "000000") {
            this.transDetail_config.loading = false;
            if (
              res.returnData &&
              res.returnData.rows &&
              res.returnData.rows.length > 0
            ) {
              this.transDetail_tableData = res.returnData.rows;
              this.transDetail_config.total = res.returnData.totalCount;
              if (res.returnData.obj) {
                this.transAccObj.tossedAmount = res.returnData.obj.totalBalance;
              }
            } else {
              this.transDetail_tableData = [];
            }
          }
        }
      );
    },

    // 争议账户
    //原交易信息
    sureOrigTransInfo() {
      this.origTransInfo_dialog = true;
      let params = {
        externalIdentificationNo: this.disputeAccObj.externalIdentificationNo,
        globalSerialNumbr: this.disputeAccObj.oldGlobalSerialNumbr,
        eventNo: "PT.40", //、、目前定位不到事件编号
        logLevel: "A",
        activityNo: "X8010",
        queryType: "5",
      };
      this.post("/nonfi/nonfinanceService/ISS.IQ.03.0010", params, (res) => {
        if (res.returnCode == "000000") {
          if (
            res.returnData &&
            res.returnData.rows &&
            res.returnData.rows.length > 0
          ) {
            this.origTransInfoObj = res.returnData.rows[0];
          }
        }
      });
    },
    // 争议释放有利于客户
    sureDisReleaseCst() {
      let params = {
        ecommEntryId: this.disputeAccObj.externalIdentificationNo,
        ecommOrigGlobalSerialNumbr: this.disputeAccObj.oldGlobalSerialNumbr,
      };
      this.post("/card/cardService/ISS.RT.05.0001", params, (res) => {
        if (res.returnCode == "000000") {
          this.$notify({
            title: "Success",
            message: "争议释放有利于客户成功",
            type: "success",
            duration: 2000,
          });
        }
      });
    },
    // 争议释放有利于银行
    sureDisReleaseBank() {
      let params = {
        ecommEntryId: this.disputeAccObj.externalIdentificationNo,
        ecommOrigGlobalSerialNumbr: this.disputeAccObj.oldGlobalSerialNumbr,
      };
      this.post("/card/cardService/ISS.RT.06.0001", params, (res) => {
        if (res.returnCode == "000000") {
          this.$notify({
            title: "Success",
            message: "争议释放有利于银行成功",
            type: "success",
            duration: 2000,
          });
        }
      });
    },
    // 调单申请/拒付管理
    sureTransApplyOrRefusManage() {
      if (
        this.disputeAccObj.statusCode != "D" &&
        this.disputeAccObj.statusCode != "C"
      ) {
        this.$message({
          title: "提示",
          message: "当前争议账户状态不允许此操作",
          type: "warning",
          duration: 2000,
        });
        return;
      } else {
        let cardBin = this.disputeAccObj.externalIdentificationNo.substring(
          3,
          9
        );
        let params = {
          binNo: cardBin,
        };
        params = Object.assign(params, this.queryForm);

        if (this.disputeAccObj.statusCode == "D") {
          this.post("/beta/betaService/COS.IQ.02.0011", params, (res) => {
            if (res.returnCode == "000000") {
              if (
                res.returnData &&
                res.returnData.rows &&
                res.returnData.rows.length > 0
              ) {
                let cardScheme = res.returnData.rows[0].cardScheme;
                let params1 = {
                  globalSerialNumber: this.disputeAccObj.oldGlobalSerialNumbr,
                };
                params1 = Object.assign(params1, this.queryForm);
                if (cardScheme == "V") {
                  this.post(
                    "/nonfi/nonfinanceService/ISS.IQ.01.0180",
                    params,
                    (res1) => {
                      if (res1.returnCode == "000000") {
                        if (
                          res1.returnData &&
                          res1.returnData.rows &&
                          res1.returnData.rows.length > 0
                        ) {
                          // $scope.data = data.returnData[0];
                          // $scope.appVisaFormInf = data.returnData[0];
                          // $scope.appMCFormInf = data.returnData[0];
                          // $scope.safeApply();
                          // result.cancel();
                          this.visaObj = res1.returnData[0];
                          this.appVisaFormInf = res1.returnData[0];
                          this.appMCFormInf = res1.returnData[0];
                          this.disputeAccInfo_dialog = false;
                        }
                      }
                    }
                  );
                } else if (cardScheme == "M") {
                  this.post(
                    "/nonfi/nonfinanceService/ISS.IQ.01.0185",
                    params,
                    (res2) => {
                      if (res2.returnCode == "000000") {
                        if (
                          res2.returnData &&
                          res2.returnData.rows &&
                          res2.returnData.rows.length > 0
                        ) {
                          // $scope.data = data.returnData[0];
                          // $scope.data2 = data.returnData[1][0];
                          // $scope.appVisaFormInf = data.returnData[0];
                          // $scope.appMCFormInf = data.returnData[0];
                          // $scope.safeApply();
                          // result.cancel();
                          this.visaObj = res2.returnData[0];
                          this.mccObj = res2.returnData[1][0];
                          this.appVisaFormInf = res2.returnData[0];
                          this.appMCFormInf = res2.returnData[0];
                          this.disputeAccInfo_dialog = false;
                        }
                      }
                    }
                  );
                }
                let params2 = {
                  globalTransSerialNoAuth:
                    this.disputeAccObj.oldGlobalSerialNumbr,
                };
                params2 = Object.assign(params2, this.queryForm);
                let _this = this;
                setTimeout(() => {
                  this.post(
                    "/nonfi/nonfinanceService/ISS.IQ.01.0190",
                    params,
                    (res3) => {
                      if (res3.returnCode == "000000") {
                        if (res3.returnData) {
                          let data1 = res3.returnData[0];
                          if (cardScheme == "V") {
                            _this.appVisaFormInf = res3.returnData[0];
                            _this.appVisaFormInf.acquirerBusinessId =
                              _this.visaObj.acquirerBusinessId;
                            _this.appVisaFormInf.nationalReimburseFee =
                              _this.visaObj.nationalReimburseFee;
                            _this.appVisaFormInf.accountSelection =
                              _this.visaObj.accountSelection;
                            _this.appVisaFormInf.reimburseAttribute =
                              _this.visaObj.reimburseAttribute;
                            _this.appVisaFormInf.transIdentifier =
                              _this.visaObj.transIdentifier;
                            _this.appVisaFormInf.settlementFlag =
                              _this.visaObj.settlementFlag;
                            _this.appVisaFormInf.oldGlobalSerialNumbr =
                              _this.visaObj.oldGlobalSerialNumbr;
                            _this.appVisaFormInf.transactionCode = "52";
                            _this.appVisaFormInf.retrievalRequestId = "0";
                            _this.appVisaFormInf.acquirerBusinessId =
                              _this.visaObj.acquirerBusinessId;
                            _this.appVisaFormInf.acquirerBusinessId =
                              _this.visaObj.acquirerBusinessId;
                            _this.disputeAccInfo_dialog = false;
                            // AppVisa 弹窗
                            _this.appVisa_dialog = true;
                          } else if (cardScheme == "M") {
                            _this.appMCFormInf = res3.returnData[0];
                            _this.appMCFormInf.processingCode =
                              _this.mccObj.processingCode;
                            _this.appMCFormInf.posEntryMode =
                              _this.mccObj.posEntryMode;
                            _this.appMCFormInf.forwdInstitIdCode =
                              _this.mccObj.forwdInstitIdCode;
                            _this.appMCFormInf.retrievalReferNum =
                              _this.mccObj.retrievalReferNum;
                            _this.appMCFormInf.cardAcceptorName =
                              _this.mccObj.cardAcceptorName;
                            _this.appMCFormInf.settlementIndicator =
                              _this.mccObj.settlementIndicator;
                            _this.appMCFormInf.transLifeCycleId =
                              _this.mccObj.transLifeCycleId;
                            _this.appMCFormInf.messageNumber =
                              _this.mccObj.messageNumber;
                            _this.appMCFormInf.transOriginInstit =
                              _this.mccObj.transOriginInstit;
                            _this.appMCFormInf.oldGlobalSerialNumbr =
                              _this.mccObj.oldGlobalSerialNumbr;
                            _this.appMCFormInf.terminalType =
                              _this.visaObj.P0023;
                            _this.appMCFormInf.messageReversalIndicator =
                              _this.visaObj.P0025;
                            _this.appMCFormInf.electronicCommerceSecurityLevelIndicator =
                              _this.visaObj.P0052;
                            _this.appMCFormInf.currencyExponents =
                              _this.visaObj.P0148;
                            _this.appMCFormInf.currencyCodesAmountsOriginal =
                              _this.visaObj.P0149;
                            _this.appMCFormInf.businessActivity =
                              _this.visaObj.P0158;
                            _this.appMCFormInf.settlementIndicator =
                              _this.visaObj.P0165;
                            _this.appMCFormInf.masterCardAssignedId =
                              _this.visaObj.P0176;
                            _this.appMCFormInf.retrievalDocumentCode =
                              _this.visaObj.P0228;
                            _this.appMCFormInf.exclusionRequestCode =
                              _this.visaObj.P0260;
                            _this.appMCFormInf.documentationIndicator =
                              _this.visaObj.P0262;
                            _this.appMCFormInf.functionCode = "603";
                            _this.appMCFormInf.mti = "1644";
                            _this.disputeAccInfo_dialog = false;
                            // AppMCC 弹窗
                            _this.appMcc_dialog = true;
                          }
                        }
                      }
                    }
                  );
                }, 300);
              } else {
                this.$message({
                  title: "提示",
                  message: "未查询到有效数据",
                  type: "warning",
                  duration: 2000,
                });
              }
            }
          });
        } else if (this.disputeAccInfoObj.statusCode == "C") {
          this.post("/beta/betaService/COS.IQ.02.0011", params, (res) => {
            if (res.returnCode == "000000") {
              if (
                res.returnData &&
                res.returnData.rows &&
                res.returnData.rows.length > 0
              ) {
                let cardScheme = res.returnData.rows[0].cardScheme;
                let params1 = {
                  globalSerialNumber: this.disputeAccObj.oldGlobalSerialNumbr,
                };
                params1 = Object.assign(params1, this.queryForm);
                if (cardScheme == "V") {
                  this.post(
                    "/nonfi/nonfinanceService/ISS.IQ.01.0180",
                    params,
                    (res1) => {
                      if (res1.returnCode == "000000") {
                        if (
                          res1.returnData &&
                          res1.returnData.rows &&
                          res1.returnData.rows.length > 0
                        ) {
                          this.visaObj = res1.returnData[0];
                          this.appVisaFormInf = res1.returnData[0];
                          this.appMCFormInf = res1.returnData[0];
                          this.disputeAccInfo_dialog = false;
                        }
                      }
                    }
                  );
                } else if (cardScheme == "M") {
                  this.post(
                    "/nonfi/nonfinanceService/ISS.IQ.01.0185",
                    params,
                    (res2) => {
                      if (res2.returnCode == "000000") {
                        if (
                          res2.returnData &&
                          res2.returnData.rows &&
                          res2.returnData.rows.length > 0
                        ) {
                          this.visaObj = res2.returnData[0];
                          this.mccObj = res2.returnData[1][0];
                          this.appVisaFormInf = res2.returnData[0];
                          this.appMCFormInf = res2.returnData[0];
                          this.disputeAccInfo_dialog = false;
                        }
                      }
                    }
                  );
                }
                let params2 = {
                  globalTransSerialNoAuth:
                    this.disputeAccObj.oldGlobalSerialNumbr,
                };
                params2 = Object.assign(params2, this.queryForm);
                let _this = this;
                setTimeout(() => {
                  this.post(
                    "/nonfi/nonfinanceService/ISS.IQ.01.0190",
                    params,
                    (res3) => {
                      if (res3.returnCode == "000000") {
                        if (res3.returnData) {
                          let data1 = res3.returnData[0];
                          if (cardScheme == "V") {
                            _this.appVisaFormInf = res3.returnData[0];
                            _this.appVisaFormInf.acquirerBusinessId =
                              _this.visaObj.acquirerBusinessId;
                            _this.appVisaFormInf.nationalReimburseFee =
                              _this.visaObj.nationalReimburseFee;
                            _this.appVisaFormInf.reimburseAttribute =
                              _this.visaObj.reimburseAttribute;
                            _this.appVisaFormInf.transIdentifier =
                              _this.visaObj.transIdentifier;
                            _this.appVisaFormInf.oldGlobalSerialNumbr =
                              _this.visaObj.oldGlobalSerialNumbr;
                            _this.appVisaFormInf.settlementFlag =
                              _this.visaObj.settlementFlag;
                            _this.appVisaFormInf.requestedPaymentService =
                              _this.visaObj.requestedPaymentService;
                            _this.appVisaFormInf.authorizationCharacteristicsIndicator =
                              _this.visaObj.authorizationCharacteristicsIndicator;
                            _this.appVisaFormInf.internationalFeeIndicator =
                              _this.visaObj.internationalFeeIndicator;
                            _this.appVisaFormInf.feeProgramIndicator =
                              _this.visaObj.feeProgramIndicator;
                            _this.appVisaFormInf.mailPhoneElectronicCommerceAndPaymentIndicator =
                              _this.visaObj.mailPhoneElectronicCommerceAndPaymentIndicator;
                            _this.appVisaFormInf.prepaidCardIndicator =
                              _this.visaObj.prepaidCardIndicator;
                            _this.appVisaFormInf.authorizedAmount =
                              _this.visaObj.authorizedAmount;
                            _this.appVisaFormInf.authorizationCurrencyCode =
                              _this.visaObj.authorizationCurrencyCode;
                            _this.appVisaFormInf.authorizationResponseCode =
                              _this.visaObj.authorizationResponseCode;
                            _this.appVisaFormInf.multipleClearingSequenceNumber =
                              _this.visaObj.multipleClearingSequenceNumber;
                            _this.appVisaFormInf.multipleClearingSequenceCount =
                              _this.visaObj.multipleClearingSequenceCount;
                            _this.appVisaFormInf.dynamicCurrencyConversionIndicator =
                              _this.visaObj.dynamicCurrencyConversionIndicator;
                            _this.appVisaFormInf.transCodeQualifer =
                              _this.visaObj.transCodeQualifer;
                            _this.disputeAccInfo_dialog = false;
                            // AppVisa 弹窗
                            _this.appVisa_dialog = true;
                          } else if (cardScheme == "M") {
                            _this.appMCFormInf = res3.returnData[0];
                            _this.appMCFormInf.processingCode = _this.mccObj.processingCode;
                            _this.appMCFormInf.dateAndTime =  _this.mccObj.dateAndTime;
                            _this.appMCFormInf.posEntryMode =
                              _this.mccObj.posEntryMode;
                            _this.appMCFormInf.dateExpiration =
                              _this.mccObj.dateExpiration;
                            _this.appMCFormInf.forwdInstitIdCode =
                              _this.mccObj.forwdInstitIdCode;
                            _this.appMCFormInf.retrievalReferNum =
                              _this.mccObj.retrievalReferNum;
                            _this.appMCFormInf.serviceCode =
                              _this.mccObj.serviceCode;
                            _this.appMCFormInf.cardAcceptorName =
                              _this.mccObj.cardAcceptorName;
                            _this.appMCFormInf.transLifeCycleId =
                              _this.mccObj.transLifeCycleId;
                            _this.appMCFormInf.transOriginInstit =
                              _this.mccObj.transOriginInstit;
                            _this.appMCFormInf.oldGlobalSerialNumbr =
                              _this.disputeAccObj.oldGlobalSerialNumbr;
                            _this.appMCFormInf.terminalType =
                              _this.visaObj.P0023;
                            _this.appMCFormInf.messageReversalIndicator =
                              _this.visaObj.P0025;
                            _this.appMCFormInf.electronicCommerceSecurityLevelIndicator =
                              _this.visaObj.P0052;
                            _this.appMCFormInf.currencyExponents =
                              _this.visaObj.P0148;
                            _this.appMCFormInf.currencyCodesAmountsOriginal =
                              _this.visaObj.P0149;
                            _this.appMCFormInf.businessActivity =
                              _this.visaObj.P0158;
                            _this.appMCFormInf.settlementIndicator =
                              _this.visaObj.P0165;
                            _this.appMCFormInf.masterCardAssignedId =
                              _this.visaObj.P0176;
                            _this.appMCFormInf.exclusionRequestCode =
                              _this.visaObj.P0260;
                            _this.appMCFormInf.documentationIndicator =
                              _this.visaObj.P0262;
                            _this.appMCFormInf.mti = "1442";
                            _this.disputeAccInfo_dialog = false;
                            // AppMCC 弹窗
                            _this.appMcc_dialog = true;
                          }
                        }
                      }
                    }
                  );
                });
              }
            }
          });
        }
      }
    },

    // 确定账户
    sureAccBtn() {
      if (
        !this.curRowRadio &&
        !this.curRowRadio2 &&
        !this.curRowRadio3 &&
        !this.curRowRadio4
      ) {
        this.$message({
          message: "请至少选择1行",
          type: "warning",
        });
        return;
      }
      this.accList_dialog = false;
      let curRowObj;
      if (this.accFlag == "revoleAcc") {
        // 循环账户信息表
        this.curRow.customerName = this.customerName;
        this.curRowObj = this.curRow;
        this.revoleAccObj = this.curRow;
        // 翻译 拼接数据
        if (this.revoleAccObj.businessDesc) {
          // 业务类型
          this.revoleAccObj.businessTypeCodeTrans =
            this.revoleAccObj.businessTypeCode + this.revoleAccObj.businessDesc;
        } else {
          this.revoleAccObj.businessTypeCodeTrans =
            this.revoleAccObj.businessTypeCode;
        }
        if (this.revoleAccObj.productDesc) {
          // 产品代码
          this.revoleAccObj.productObjectCodeTrans =
            this.revoleAccObj.productObjectCode + this.revoleAccObj.productDesc;
        } else {
          this.revoleAccObj.productObjectCodeTrans =
            this.revoleAccObj.productObjectCode;
        }
        if (this.revoleAccObj.programDesc) {
          // 业务项目
          this.revoleAccObj.businessProgramNoTrans =
            this.revoleAccObj.businessProgramNo + this.revoleAccObj.programDesc;
        } else {
          this.revoleAccObj.businessTypeCodeTrans =
            this.revoleAccObj.businessProgramNo;
        }

        this.queryAllAccDetail(this.revoleAccObj);

        this.isShowRevoleAccDetail = true; //循环账户详情
        this.isShowOverdueAccDetail = false; //溢缴款账户详情
        this.isShowTransAccDetail = false; //交易账户详情
        this.isShowDisputeAccDetail = false; //争议账户详情
        this.isShowOrginTransDetail = false; //原交易信息
      } else if (this.accFlag == "surplusAcc") {
        // 溢缴款账户信息表
        this.curRow2.customerName = this.customerName;

        this.curRowObj = this.curRow2;
        this.surplusAccObj = this.curRow2;

        //拼接数据
        if (this.surplusAccObj.currencyDesc) {
          this.isurplusAccObjemInfo.currencyCodeTrans =
            this.surplusAccObj.currencyCode + this.surplusAccObj.currencyDesc;
        } else {
          this.surplusAccObj.currencyCodeTrans =
            this.surplusAccObj.currencyCode;
        }

        this.isShowRevoleAccDetail = false; //循环账户详情
        this.isShowOverdueAccDetail = true; //溢缴款账户详情
        this.isShowTransAccDetail = false; //交易账户详情
        this.isShowDisputeAccDetail = false; //争议账户详情
        this.isShowOrginTransDetail = false; //原交易信息
      } else if (this.accFlag == "transAcc") {
        // 交易账户信息表
        this.curRow3.customerName = this.customerName;

        this.curRowObj = this.curRow3;
        this.transAccObj = this.curRow3;
        // 翻译 拼接数据
        if (this.transAccObj.businessDesc) {
          // 业务类型
          this.transAccObj.businessTypeCodeTrans =
            this.transAccObj.businessTypeCode + this.transAccObj.businessDesc;
        } else {
          this.transAccObj.businessTypeCodeTrans =
            this.transAccObj.businessTypeCode;
        }
        if (this.transAccObj.productDesc) {
          // 产品代码
          this.transAccObj.productObjectCodeTrans =
            this.transAccObj.productObjectCode + this.transAccObj.productDesc;
        } else {
          this.transAccObj.productObjectCodeTrans =
            this.transAccObj.productObjectCode;
        }
        if (this.transAccObj.programDesc) {
          // 业务项目
          this.transAccObj.businessProgramNoTrans =
            this.transAccObj.businessProgramNo + this.transAccObj.programDesc;
        } else {
          this.transAccObj.businessProgramNoTrans =
            this.transAccObj.businessProgramNo;
        }
        this.queryAllAccDetail(this.transAccObj); //
        this.geTransDetailList(this.transAccObj); // 分期计划列表

        this.isShowRevoleAccDetail = false; //循环账户详情
        this.isShowOverdueAccDetail = false; //溢缴款账户详情
        this.isShowTransAccDetail = true; //交易账户详情
        this.isShowDisputeAccDetail = false; //争议账户详情
        this.isShowOrginTransDetail = false; //原交易信息
      } else if (this.accFlag == "disputeAcc") {
        // 争议账户信息表
        this.curRow4.customerName = this.customerName;

        this.curRowObj = this.curRow4;
        this.disputeAccObj = this.curRow4;
        // 翻译 拼接数据
        if (this.disputeAccObj.programDesc) {
          //业务项目
          this.disputeAccObj.businessProgramNoTrans =
            this.disputeAccObj.businessProgramNo +
            this.disputeAccObj.programDesc;
        } else {
          this.disputeAccObj.businessProgramNoTrans =
            this.disputeAccObj.businessProgramNo;
        }
        if (this.disputeAccObj.businessDesc) {
          //业务类型
          this.disputeAccObj.businessTypeCodeTrans =
            this.disputeAccObj.businessTypeCode +
            this.disputeAccObj.businessDesc;
        } else {
          this.disputeAccObj.businessTypeCodeTrans =
            this.disputeAccObj.businessTypeCode;
        }
        if (this.disputeAccObj.organName) {
          this.disputeAccObj.organNoTrans =
            this.disputeAccObj.organNo + this.disputeAccObj.organName;
        } else {
          this.disputeAccObj.organNoTrans = this.disputeAccObj.organNo;
        }

        this.isShowRevoleAccDetail = false; //循环账户详情
        this.isShowOverdueAccDetail = false; //溢缴款账户详情
        this.isShowTransAccDetail = false; //交易账户详情
        this.isShowDisputeAccDetail = true; //争议账户详情
        this.isShowOrginTransDetail = false; //原交易信息
      }
    },

    // 循环账户信息表
    handleList1Change(row) {
      this.curRow = row;
    },
    chooseList1(row) {
      this.accFlag = "revoleAcc";
      this.curRowRadio = row.accountId;
    },
    // 交易账户信息表
    handleList3Change(row) {
      this.curRow3 = row;
    },
    chooseList3(row) {
      this.accFlag = "transAcc";
      this.curRowRadio3 = row.accountId;
    },

    // 溢缴款账户信息表
    currentChange2(val) {
      this.curRow2 = val;
    },
    rowClick2(val) {
      this.accFlag = "surplusAcc";
      this.curRowRadio2 = val.accountId;
    },

    // 争议账户信息表
    currentChange4(val) {
      console.log(val);
      this.curRow4 = val;
    },
    rowClick4(val) {
      this.accFlag = "disputeAcc";
      this.curRowRadio4 = val.accountId;
    },
  },
};
</script>
  
  <style>
</style>
  
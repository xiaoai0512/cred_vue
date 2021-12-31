<!-- 历史交易查询 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="证件类型" prop="idType">
                <el-select v-model="queryFormObj.idType" class="wd200" clearable >
                    <el-option v-for="(item, index) in idTypeList" 
                    	:key="index" 
                    	:label="item.detailDesc" 
                    	:value="item.codes" />
                </el-select>
            </el-form-item>
           	<el-form-item class="cl_td" label="证件号码" prop="idNumber">
                <el-input v-model="queryFormObj.idNumber" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                <el-input v-model="queryFormObj.externalIdentificationNo" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="授权场景代码" prop="authSceneCode">
                <el-select v-model="queryFormObj.authSceneCode" class="wd200" clearable >
                    <el-option v-for="(item, index) in authSceneCodeOptions" 
                    	:key="index" 
                    	:label="item.authSceneCodeDesc" 
                    	:value="item.authSceneCode" />
                </el-select>
            </el-form-item>
            <div class="" style="display: inline-block;width: 74%;">
	            <el-form-item class="cl_td" label="交易处理日期" prop="startDate" style="width: 34%;margin-left: 13.5%;">
	                <el-date-picker 
	                    v-model="queryFormObj.startDate"
	                    class="wd200"
	                    type="date"
	                    placeholder="选择日期"
	                    format="yyyy 年 MM 月 dd 日"
	                    value-format="yyyyMMdd"/>
	            </el-form-item>
	           	<span >~</span>
	            <el-form-item class="" prop="endDate" style="width: 30%;display: inline-block;margin-left: 5px;">
	                <el-date-picker
	                    v-model="queryFormObj.endDate"
	                    class="wd200"
	                    type="date"
	                    placeholder="选择日期"
	                    format="yyyy 年 MM 月 dd 日"
	                    value-format="yyyyMMdd"
	                 	/>
	            </el-form-item>
			</div>
            <div class="cl_tr text_center" >
               <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" >查询</el-button>
         	</div>
        </el-form>
        <div v-if="showList">
            <el-table v-loading = "listLoading" :data="tableList" border stripe style="width: 100%">
               	<el-table-column prop="temTransNo" label="交易账号" align="center"/>
                <el-table-column prop="processingDate" label="交易处理日期" align="center"/>
                <el-table-column prop="processingTime" label="交易处理时间" align="center"/>
                <el-table-column prop="temCurrencyCode" label="交易币种" align="center"/>
                <el-table-column prop="temTransAmount" label="	交易金额" align="center"/>
                <el-table-column prop="authSceneCodeDesc" label="授权场景" align="center"/>
                <el-table-column prop="authTransMessage.ecommField38" label="授权成功码" align="center"/>
                <el-table-column prop="authTransMessage.ecommField39" label="授权响应码" align="center"/>
                <el-table-column prop="transTypeDesc" label="交易类型" align="center"/>
                <el-table-column align="center" label="操作" width="200">
                    <template slot-scope="scope">
                    	<el-button size="medium" icon="el-icon-info" type="primary" @click="handleDetail(scope.row)" >详情</el-button>
         				<span v-if="scope.row.limitHisFlag == '1'">
         					<el-button size="medium"  icon="el-icon-search" type="primary" @click="selectHistory(scope.row)" >额度历史</el-button>
                		</span>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="tableTotal>0" class="page-name" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getCreditNodeList" />
        </div>
        <!--详情-->
        <el-dialog title="历史交易详细信息" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail" :rules="rulesDetail" :model="tempDetail" >
            	<el-form-item class="cl_td" label="客户代码" prop="customerNo">
                    <el-input v-model="tempDetail.customerNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                    <el-input v-model="tempDetail.externalIdentificationNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="账户代码" prop="accountNo" >
                    <el-input v-model="tempDetail.accountNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="全局流水号" prop="globalTransSerialNo">
                    <el-input v-model="tempDetail.globalTransSerialNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <div class=" clearboth"></div>
                <div class="mainname titleInfo">基本信息</div>
                <el-form-item class="cl_td" label="交易日期" prop="temDate">
                    <el-input v-model="tempDetail.temDate" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易时间" prop="temTime">
                    <el-input v-model="tempDetail.temTime" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易传输时间" prop="ecommField7">
                    <el-input v-model="tempDetail.ecommField7" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="系统跟踪号" prop="sysAudtTrace">
                    <el-input v-model="tempDetail.sysAudtTrace" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="受理机构识别码" prop="acqId">
                    <el-input v-model="tempDetail.acqId" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="检索参考号" prop="retrvlRefNbr">
                    <el-input v-model="tempDetail.retrvlRefNbr" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="入账标志" prop="transPostingInfo">
                    <el-input v-model="tempDetail.transPostingInfo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易类型" prop="transTypeInfo">
                    <el-input v-model="tempDetail.transTypeInfo" class="wd200" type="text" readonly/>
                </el-form-item>
                 <el-form-item class="cl_td" label="交易处理状态" prop="transProcessStatusInfo">
                    <el-input v-model="tempDetail.transProcessStatusInfo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="输入来源" prop="inputSourceInfo">
                    <el-input v-model="tempDetail.inputSourceInfo" class="wd200" type="text" readonly/>
                </el-form-item>
                <div class=" clearboth"></div>
                <div class="mainname titleInfo">关联交易信息</div>
          		<el-form-item class="cl_td" label="原交易全局流水号" prop="globalTransSerialNoOri">
                	<el-input v-model="tempDetail.globalTransSerialNoOri" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="冲正交易全局流水号" prop="globalTransSerialNoRev">
                    <el-input v-model="tempDetail.globalTransSerialNoRev" class="wd200" type="text" readonly/>
                </el-form-item>
           	
           		<el-form-item class="cl_td" label="授权交易全局流水号" prop="globalTransSerialNoOri">
        	    	<el-input v-model="tempDetail.globalTransSerialNoAuth" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="入账交易全局流水号" prop="globalTransSerialNoRev">
                    <el-input v-model="tempDetail.globalTransSerialNoPost" class="wd200" type="text" readonly/>
                </el-form-item>
               	<div class=" clearboth"></div>
                <div class="mainname titleInfo">授权检查结果</div>
      		 	<el-form-item class="cl_td" label="CVV/ICVV检查" prop="ecommVerifnRsltCvvInfo">
                	<el-input v-model="tempDetail.ecommVerifnRsltCvvInfo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="CVV2卡片有效期检查" prop="ecommVerifnRsltCvv2Info">
                    <el-input v-model="tempDetail.ecommVerifnRsltCvv2Info" class="wd200" type="text" readonly/>
                </el-form-item>
           		<el-form-item class="cl_td" label="CAVV检查" prop="ecommVerifnRsltCavvInfo">
        	    	<el-input v-model="tempDetail.ecommVerifnRsltCavvInfo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="PIN检查" prop="ecommVerifnRsltPinInfo">
                    <el-input v-model="tempDetail.ecommVerifnRsltPinInfo" class="wd200" type="text" readonly/>
                </el-form-item>
           		<el-form-item class="cl_td" label="ARQC检查" prop="ecommVerifnRsltArqcInfo">
        	    	<el-input v-model="tempDetail.ecommVerifnRsltArqcInfo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易有效期检查" prop="ecommVerifnRsltTransExpDteInfo">
                    <el-input v-model="tempDetail.ecommVerifnRsltTransExpDteInfo" class="wd200" type="text" readonly/>
                </el-form-item>
       			<el-form-item class="cl_td" label="卡片有效期检查" prop="ecommVerifnRsltMediaExpDteInfo">
        	    	<el-input v-model="tempDetail.ecommVerifnRsltMediaExpDteInfo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="发卡例外检查" prop="ecommVerifnRsltExcpInfo">
                    <el-input v-model="tempDetail.ecommVerifnRsltExcpInfo" class="wd200" type="text" readonly/>
                </el-form-item>
           		<el-form-item class="cl_td" label="卡片激活检查" prop="ecommVerifnRsltSpclInfo">
                    <el-input v-model="tempDetail.ecommVerifnRsltSpclInfo" class="wd200" type="text" readonly/>
                </el-form-item>
       			<el-form-item class="cl_td" label="欺诈检查" prop="ecommVerifnRsltFraudInfo">
        	    	<el-input v-model="tempDetail.ecommVerifnRsltFraudInfo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易限制检查" prop="ecommVerifnRsltVeloInfo">
                    <el-input v-model="tempDetail.ecommVerifnRsltVeloInfo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="正负面清单检查" prop="ecommVerifnRsltBwlistInfo">
                    <el-input v-model="tempDetail.ecommVerifnRsltBwlistInfo" class="wd200" type="text" readonly/>
                </el-form-item>
           		<el-form-item class="cl_td" label="额度检查" prop="ecommVerifnRsltLimitInfo">
                    <el-input v-model="tempDetail.ecommVerifnRsltLimitInfo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="原交易检查结果" prop="ecommVerifnRsltOriTransInfo">
                    <el-input v-model="tempDetail.ecommVerifnRsltOriTransInfo" class="wd200" type="text" readonly/>
                </el-form-item>
           		<el-form-item class="cl_td" label="授权匹配检查结果" prop="ecommVerifnRsltAuthMatchInfo">
                    <el-input v-model="tempDetail.ecommVerifnRsltAuthMatchInfo" class="wd200" type="text" readonly/>
                </el-form-item>
           		<el-form-item class="cl_td" label="交易验证最终检查结果" prop="ecommVerifnRsltFinalCheckInfo">
                    <el-input v-model="tempDetail.ecommVerifnRsltFinalCheckInfo" class="wd200" type="text" readonly/>
                </el-form-item>
           		<el-form-item class="cl_td" label="账户验证结果" prop="ecommVerifnRsltAccountCheckInfo">
                    <el-input v-model="tempDetail.ecommVerifnRsltAccountCheckInfo" class="wd200" type="text" readonly/>
                </el-form-item>
                <div class=" clearboth"></div>
							<div class="mainname titleInfo">交易管控信息</div>
           		<el-form-item class="cl_td" label="授权场景代码" prop="authSceneCode">
                    <el-input v-model="tempDetail.authSceneCode" class="wd200" type="text" readonly/>
                </el-form-item>
       					<el-form-item class="cl_td" label="管控场景代码" prop="contrlSceneCode">
                    <el-input v-model="tempDetail.contrlSceneCode" class="wd200" type="text" readonly/>
                </el-form-item>
           			<el-form-item class="cl_td" label="溢缴款使用金额" prop="overpayOccupyAmt">
                    <el-input v-model="tempDetail.overpayOccupyAmt" class="wd200" type="text" readonly/>
                </el-form-item>
           			<div class=" clearboth"></div>
								<div class="mainname titleInfo">详细信息</div>	
           			<el-form-item class="cl_td" label="交易币种" prop="temCurrencyCode">
                    <el-input v-model="tempDetail.temCurrencyCode" class="wd200" type="text" readonly/>
                </el-form-item>
           			<el-form-item class="cl_td" label="交易金额" prop="temTransAmount">
                    <el-input v-model="tempDetail.temTransAmount" class="wd200" type="text" readonly/>
                </el-form-item>
               	<el-form-item class="cl_td" label="清算币种" prop="ecommClearCurr">
                    <el-input v-model="tempDetail.ecommClearCurr" class="wd200" type="text" readonly/>
                </el-form-item>
           			<el-form-item class="cl_td" label="清算金额" prop="ecommClearAmt">
                    <el-input v-model="tempDetail.ecommClearAmt" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="入账币种" prop="billingCurrCode">
                    <el-input v-model="tempDetail.billingCurrCode" class="wd200" type="text" readonly/>
                </el-form-item>
           			<el-form-item class="cl_td" label="入账金额" prop="billingAmt">
                    <el-input v-model="tempDetail.billingAmt" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="营销场景代码" prop="marketingSceneCode">
                    <el-input v-model="tempDetail.marketingSceneCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="营销币种" prop="marketingCurrencyCode">
                    <el-input v-model="tempDetail.marketingCurrencyCode" class="wd200" type="text" readonly/>
                </el-form-item>
           			<el-form-item class="cl_td" label="营销减免金额" prop="marketingDiscountAmt">
                    <el-input v-model="tempDetail.marketingDiscountAmt" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="入账金额" prop="ecommField6">
                    <el-input v-model="tempDetail.authTransMessage.ecommField6" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="有效期" prop="ecommField14">
                    <el-input v-model="tempDetail.authTransMessage.ecommField14" class="wd200" type="text" readonly/>
                </el-form-item>
           			<el-form-item class="cl_td" label="商户代码" prop="ecommField18">
                    <el-input v-model="tempDetail.authTransMessage.ecommField18" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="国家码" prop="ecommField19">
                    <el-input v-model="tempDetail.authTransMessage.ecommField19" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="POS ENTRY MODE" prop="ecommField22">
                    <el-input v-model="tempDetail.authTransMessage.ecommField22" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="POS CONDITION CODE" prop="ecommField25">
                    <el-input v-model="tempDetail.authTransMessage.ecommField25" class="wd200" type="text" readonly/>
                </el-form-item>
               	<el-form-item class="cl_td" label="受卡机终端标识码" prop="ecommField41">
                    <el-input v-model="tempDetail.authTransMessage.ecommField41" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="受卡方标识码" prop="ecommField42">
                    <el-input v-model="tempDetail.authTransMessage.ecommField42" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="商户名称地址" prop="ecommField43">
                    <el-input v-model="tempDetail.authTransMessage.ecommField43" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="授权成功码" prop="ecommField38">
                    <el-input v-model="tempDetail.authTransMessage.ecommField38" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="授权响应码" prop="ecommField39">
                    <el-input v-model="tempDetail.authTransMessage.ecommField39" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="拒绝信息" prop="responseDesc">
                    <el-input v-model="tempDetail.responseDesc" class="wd200" type="text" readonly/>
                </el-form-item>
                <div class=" clearboth"></div>
								<div class="mainname titleInfo">额度信息</div>	
                <el-form-item class="cl_td" label="溢缴款使用币种" prop="overpayOccupyCurrCode">
                    <el-input v-model="tempDetail.overpayOccupyCurrCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="溢缴款使用金额" prop="overpayOccupyAmt">
                    <el-input v-model="tempDetail.overpayOccupyAmt" class="wd200" type="text" readonly/>
                </el-form-item>
                <div v-if="histDiv">
            	<div class="col_td">
									<div class="col4 text_right">额度节点：</div>
									<div class="wd190 float_left" style="padding-left: 10px;">
											<span>{{authCreditUseHistorys.creditNodeNo}}{{authCreditUseHistorys.creditDesc}}</span>
									</div>
							</div>
							<div class="col_td" >
									<div class="col4 text_right">交易金额：</div>
									<div class="wd190 float_left" style="padding-left: 10px;">
										<span>{{authCreditUseHistorys.totalAmt}}</span>
									</div>
							</div>
			        </div>        	
	                <div v-if="histDiv2">
	                	<div class="col_td">
							<div class="col4 text_right">额度节点：</div>
							<div class="wd190 float_left" style="padding-left: 10px;">
								<span>{{tempDetail.creditNodeNo}}{{tempDetail.creditDesc}}</span>
							</div>
					</div>
							<div class="col_td" >
								<div class="col4 text_right">交易金额：</div>
								<div class="wd190 float_left" style="padding-left: 10px;">
									<span>{{tempDetail.creditOccupyAmt}}</span>
								</div>
							</div>
        	</div>
         	</el-form>  
	            <div  slot="footer" class="dialog-footer"> 
		            	<el-button type="primary"  v-if="tempDetail.transStatus == ''" @click="subData()">冲正</el-button>
		        			<el-button type="primary"  @click="dialogFormVisibleDetail = false">关闭</el-button>
	            </div>
         	</el-dialog> 
         	<!--额度历史-->
         	<el-dialog title="额度历史详细信息" :visible.sync="dialogFormVisibleQuota" width="65%">
	            <div class="mainname titleInfo">基本信息</div>	
	            <el-form ref="dataFormQuotaInfo" :rules="rulesQuotaInfo" :model="tempQuotaInfo" >
	               	<el-form-item class="cl_td" label="客户代码" prop="customerNo" >
	                    <el-input v-model="tempQuotaInfo.customerNo" class="wd200" type="text"  readonly/>
	                </el-form-item>
	         		</el-form>
            <div>详情</div>
            <div v-if="tempQuotaInfo.nodeTypeL=='L'">
                <el-table :data="quotaListL"  border stripe 
                    v-loading = "quotaListLoadingL"
                    class="mbtm20"
                    fit
                    highlight-current-row
                    style="width: 100%;">
                    <el-table-column prop="creditNodeNo" label="业务节点" align="center" />
                    <el-table-column prop="debitCreditFlag" label="借贷记方向" align="center" >
	                    	<span v-if="quotaListL.debitCreditFlag == 'C'">贷记</span>
				  							<span v-if="quotaListL.debitCreditFlag == 'D'">借记</span>
                    </el-table-column>
                    <el-table-column prop="creditOccupyCurrCode" label="币种" align="center" />
                    <el-table-column prop="totalAmt" label="金额" align="center" />
                </el-table>
                <pagination v-show="quotaTableTotalL>0" :total="quotaTableTotalL" :page.sync="quotaPageL.pageNum" :limit.sync="quotaPageL.pageSize" @pagination="getDetailList" />
            </div>
            <div v-if="tempQuotaInfo.nodeTypeL=='B'">
                <el-table :data="quotaListB"  border stripe 
                    v-loading = "quotaListLoadingB"
                    class="mbtm20"
                    fit
                    highlight-current-row
                    style="width: 100%;" >
                    <el-table-column prop="creditNodeNo" label="应用节点" align="center" />
                    <el-table-column prop="appObjectCode" label="应用节点产品对象" align="center" />
                   	<el-table-column prop="debitCreditFlag" label="借贷记方向" align="center" >
	                    	<span v-if="quotaListB.debitCreditFlag == 'C'">贷记</span>
				  							<span v-if="quotaListB.debitCreditFlag == 'D'">借记</span>
                    </el-table-column>
                    <el-table-column prop="creditOccupyCurrCode" label="币种" align="center" />
                    <el-table-column prop="totalAmt" label="金额" align="center" />
                </el-table>
                <pagination v-show="quotaTableTotalB>0" :total="quotaTableTotalB" :page.sync="quotaPageB.pageNum" :limit.sync="quotaPageB.pageSize" @pagination="getDetailList" />
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleQuota = false">取消</el-button>
            </div>
        </el-dialog> 
    </div>
</template>

<script>
import Pagination from "@/components/Pagination";
export default {
  name: 'tableList',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Pagination,
  },
    data() {
        return {
            // 列表
            eyer:true,
            showList: false,
            showCode: false,
            newOperationMode: '',
            queryFormObj: {
                pageNum: 1,
                pageSize:10,
            },
            tableList: [],
            listLoading: false,
            queryFormRef: {},
            queryFormRules: {},      
            tableTotal: 0,
            corporationEntityNo: '',
            // 下拉框
            operationModeOptions: [],
            idTypeList: [],
           	contrlSceneTypeOptions: [],//管控场景码
           	authSceneCodeOptions: [],//授权场景代码
            //查询详情
            isAble: true,
            histDiv: false,
            histDiv2: false,
            detailListLoading: false,
            detailTableList: [],
           	dialogFormVisibleDetail: false,
            tempDetail: {
            	authTransMessage: {},
            },
            rulesDetail: {},
            dataFormDetail: {},
            //额度历史
            dialogFormVisibleQuota: false,
            taFormQuotaInfo: {},
            rulesQuotaInfo: {},
            tempQuotaInfo: {},
            quotaListL: [],
            quotaListLoadingL: false,
            quotaTableTotalL: 0,
            quotaPageL: {
            	pageNum: 1,
                pageSize:10,
            },
            quotaListB: [],
            quotaListLoadingB: false,
            quotaTableTotalB: 0,
            quotaPageB: {
            	pageNum: 1,
                pageSize:10,
            },
        }
    },
    created() {
       	let logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))
        this.operationMode = logininfo.operationMode
        this.corporationEntityNo = logininfo.corporationEntityNo
       
    },
    mounted() {
       //运营模式
        let objis={
            requestType: '1',
            resultType: '1',
            corporationEntityNo: this.corporationEntityNo,
            adminFlagLogin: '1',
				}
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0037",objis).then(res => {
            this.operationModeOptions = res
        })
        //证件类型
        this.getSelectDict('dic_certificateType').then((res) => {
            this.idTypeList = res
        })
        //授权场景代码
        this.getSelectDict('/beta/betaService/AUS.PM.01.0002').then((res) => {
        		res.forEach(item=>{
        				item.authSceneCodeDesc = item.authSceneCode +''+item.sceneDesc
        		})
            this.authSceneCodeOptions = res
        })
    },
   	methods: {
    	//授权场景码
        getCreditNodeList(){
         		this.listLoading = true
            this.eyer=!this.eyer
            this.showCode=!this.showCode
           	let obj2 = {
            	authDataSynFlag:"1",
            	isTrans: true,//是否需要翻译数据字典
							transParams : ['dic_authType'],//查找数据字典所需参数
							transDict : ['transType'],//翻译前后key
						}
		   			obj2 = Object.assign (obj2, this.queryFormObj )
						this.post('/auth/authService/AUS.IQ.01.0001', obj2, (res) => {
								if (res.returnMsg == 'OK') {
		        				this.newOperationMode = res.returnData.operationMode;
			       				let obj1 = {
			               		authDataSynFlag: '1',
				    						operationMode: this.newOperationMode,
							        	differentType: "0"
			           		}
				            this.post('/beta/betaService/AUS.PM.02.0102', obj1, (res) => {
						            	if (res.returnCode == '000000') {
								            	if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
								            			let arr = []
					                        let rows = res.returnData.rows
					                        rows.forEach((item, index) => {
					                           	arr[index] = {
					                                label: item.contrlSceneDesc,
					                                value: item.contrlSceneCode
					                            }
					                        })
					                        this.contrlSceneTypeOptions = arr
								            	}else{
								            			this.contrlSceneTypeOptions = []
								            	}
						          		}
				    					})
			           	}else{
			           			this.listLoading = false
			           	}
	    				})
        	},
       		//查询
        	handleSearch() {
            if(!this.queryFormObj.externalIdentificationNo && !this.queryFormObj.idType && !this.queryFormObj.idNumber) {
                    this.$message({
                        message: '请输入查询信息',
                        type: 'warning'
                    })
                    //this.init()
                } else {
                    if(this.queryFormObj.idType) {
                        if(!this.queryFormObj.idNumber) {
                            this.$message({
                                message: '请输入证件号码',
                                type: 'warning'
                            })
                        } else {
                        	this.getList()
                           // this.getCreditNodeList()
                        }
                    } else if(this.queryFormObj.idNumber) {
                        if(!this.queryFormObj.idType) {
                            this.$message({
                                message: '请输入证件类型',
                                type: 'warning'
                            })
                        } else {
                           // this.getCreditNodeList()
                           this.getList()
                        }
                    } 
                }
	            this.showList=true
	            this.getList()
        	},
        // 列表
	        getList() {
	            this.listLoading = true
	            let obj2 = {
			            authDataSynFlag:"1",
			        		isTrans: true,//是否需要翻译数据字典
									transParams : ['dic_authType'],//查找数据字典所需参数
									transDict : ['transType'],//翻译前后key
							}
	            obj2 = Object.assign (obj2, this.queryFormObj )
	            this.getTableList('/auth/authService/AUS.IQ.02.0002', obj2,(res) => {
	            		this.listLoading = false
	                if (res.returnCode == '000000') {
	                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
	                        this.tableList = res.returnData.rows
	                        this.tableTotal = res.returnData.totalCount
	                       	this.tableList.forEach(item=>{
	                        		item.authSceneCodeDesc=item.authSceneCode+''+item.sceneDesc
	                       	})
	                   	}else{
	                   			this.tableList = []
	                        this.tableTotal = 0
	                   	}
	                }
	            }, (err) => {
	            		this.listLoading = false
	            		this.tableList = []
                	this.tableTotal = 0
	            })
	        },
	        handleDetail(row){
	        		this.dialogFormVisibleDetail = true
	        		this.tempDetail = Object.assign({}, row)
	            this.transMessage = row.transMessage
	            this.verifnArea = JSON.parse(row.verifnArea);
	          	this.$nextTick(() => {
	                this.$refs['dataFormDetail'].clearValidate()
	            })
	        	//cvv
							if(this.verifnArea.ecommVerifnRsltCvv == 'A'){
								this.tempDetail.ecommVerifnRsltCvvInfo = '通过';
							}else if(this.verifnArea.ecommVerifnRsltCvv == 'B'){
								this.tempDetail.ecommVerifnRsltCvvInfo = '未检查';
							}else if(this.verifnArea.ecommVerifnRsltCvv == 'D'){
								this.tempDetail.ecommVerifnRsltCvvInfo = '失败';
							}
	        	//cvv2
						if(this.verifnArea.ecommVerifnRsltCvv2 == 'A'){
							this.tempDetail.ecommVerifnRsltCvv2Info = '通过';
						}else if(this.verifnArea.ecommVerifnRsltCvv2 == 'B'){
							this.tempDetail.ecommVerifnRsltCvv2Info = '未检查';
						}else if(this.verifnArea.ecommVerifnRsltCvv2 == 'D'){
							this.tempDetail.ecommVerifnRsltCvv2Info = '失败';
						}
			        	//cavv
						if(this.verifnArea.ecommVerifnRsltCavv == 'A'){
							this.tempDetail.ecommVerifnRsltCavvInfo = '通过';
						}else if(this.verifnArea.ecommVerifnRsltCavv == 'B'){
							this.tempDetail.ecommVerifnRsltCavvInfo = '未检查';
						}else if(this.verifnArea.ecommVerifnRsltCavv == 'D'){
							this.tempDetail.ecommVerifnRsltCavvInfo = '失败';
						}
			        	//pin
						if(this.verifnArea.ecommVerifnRsltPin == 'A'){
							this.tempDetail.ecommVerifnRsltPinInfo = '通过';
						}else if(this.verifnArea.ecommVerifnRsltPin == 'B'){
							this.tempDetail.ecommVerifnRsltPinInfo = '未检查';
						}else if(this.verifnArea.ecommVerifnRsltPin == 'D'){
							this.tempDetail.ecommVerifnRsltPinInfo = '失败';
						}
			        	//ARQC
						if(this.verifnArea.ecommVerifnRsltArqc == 'A'){
							this.tempDetail.ecommVerifnRsltArqcInfo = '通过';
						}else if(this.verifnArea.ecommVerifnRsltArqc == 'B'){
							this.tempDetail.ecommVerifnRsltArqcInfo = '未检查';
						}else if(this.verifnArea.ecommVerifnRsltArqc == 'D'){
							this.tempDetail.ecommVerifnRsltArqcInfo = '失败';
						}
			        	//交易有效期
						if(this.verifnArea.ecommVerifnRsltTransExpDte == 'A'){
							this.tempDetail.ecommVerifnRsltTransExpDteInfo = '通过';
						}else if(this.verifnArea.ecommVerifnRsltTransExpDte == 'B'){
							this.tempDetail.ecommVerifnRsltTransExpDteInfo = '未检查';
						}else if(this.verifnArea.ecommVerifnRsltTransExpDte == 'D'){
							this.tempDetail.ecommVerifnRsltTransExpDteInfo = '失败';
						}
			        	//卡片有效期
						if(this.verifnArea.ecommVerifnRsltMediaExpDte == 'A'){
							this.tempDetail.ecommVerifnRsltMediaExpDteInfo = '通过';
						}else if(this.verifnArea.ecommVerifnRsltMediaExpDte == 'B'){
							this.tempDetail.ecommVerifnRsltMediaExpDteInfo = '未检查';
						}else if(this.verifnArea.ecommVerifnRsltMediaExpDte == 'D'){
							this.tempDetail.ecommVerifnRsltMediaExpDteInfo = '失败';
						}
			        	//卡片制数
						if(this.verifnArea.ecommVerifnRsltPltNbrs == 'A'){
							this.tempDetail.ecommVerifnRsltPltNbrsInfo = '通过';
						}else if(this.verifnArea.ecommVerifnRsltPltNbrs == 'B'){
							this.tempDetail.ecommVerifnRsltPltNbrsInfo = '未检查';
						}else if(this.verifnArea.ecommVerifnRsltPltNbrs == 'D'){
							this.tempDetail.ecommVerifnRsltPltNbrsInfo = '失败';
						}
			        	//发卡例外
						if(this.verifnArea.ecommVerifnRsltExcp == 'A'){
							this.tempDetail.ecommVerifnRsltExcpInfo = '通过';
						}else if(this.verifnArea.ecommVerifnRsltExcp == 'B'){
							this.tempDetail.ecommVerifnRsltExcpInfo = '未检查';
						}else if(this.verifnArea.ecommVerifnRsltExcp == 'D'){
							this.tempDetail.ecommVerifnRsltExcpInfo = '失败';
						}
						//卡片激活
						if(this.verifnArea.ecommVerifnRsltActv == 'A'){
							this.tempDetail.ecommVerifnRsltActvInfo = '通过';
						}else if(this.verifnArea.ecommVerifnRsltActv == 'B'){
							this.tempDetail.ecommVerifnRsltActvInfo = '未检查';
						}else if(this.verifnArea.ecommVerifnRsltActv == 'D'){
							this.tempDetail.ecommVerifnRsltActvInfo = '失败';
						}
						//国际组织例外
						if(this.verifnArea.ecommVerifnRsltSpcl == 'A'){
							this.tempDetail.ecommVerifnRsltSpclInfo = '通过';
						}else if(this.verifnArea.ecommVerifnRsltSpcl == 'B'){
							this.tempDetail.ecommVerifnRsltSpclInfo = '未检查';
						}else if(this.verifnArea.ecommVerifnRsltSpcl == 'D'){
							this.tempDetail.ecommVerifnRsltSpclInfo = '失败';
						}
						//欺诈检查
						if(this.verifnArea.ecommVerifnRsltFraud == 'A'){
							this.tempDetail.ecommVerifnRsltFraudInfo = '通过';
						}else if(this.verifnArea.ecommVerifnRsltFraud == 'B'){
							this.tempDetail.ecommVerifnRsltFraudInfo = '未检查';
						}else if(this.verifnArea.ecommVerifnRsltFraud == 'D'){
							this.tempDetail.ecommVerifnRsltFraudInfo = '失败';
						}
						//交易限制
						if(this.verifnArea.ecommVerifnRsltVelo == 'A'){
							this.tempDetail.ecommVerifnRsltVeloInfo = '通过';
						}else if(this.verifnArea.ecommVerifnRsltVelo == 'B'){
							this.tempDetail.ecommVerifnRsltVeloInfo = '未检查';
						}else if(this.verifnArea.ecommVerifnRsltVelo == 'D'){
							this.tempDetail.ecommVerifnRsltVeloInfo = '失败';
						}
						//正负面清单
						if(this.verifnArea.ecommVerifnRsltBwlist == 'A'){
							this.tempDetail.ecommVerifnRsltBwlistInfo = '通过';
						}else if(this.verifnArea.ecommVerifnRsltBwlist == 'B'){
							this.tempDetail.ecommVerifnRsltBwlistInfo = '未检查';
						}else if(this.verifnArea.ecommVerifnRsltBwlist == 'D'){
							this.tempDetail.ecommVerifnRsltBwlistInfo = '失败';
						}
						//额度检查
						if(this.verifnArea.ecommVerifnRsltLimit == 'A'){
							this.tempDetail.ecommVerifnRsltLimitInfo = '通过';
						}else if(this.verifnArea.ecommVerifnRsltLimit == 'B'){
							this.tempDetail.ecommVerifnRsltLimitInfo = '未检查';
						}else if(this.verifnArea.ecommVerifnRsltLimit == 'D'){
							this.tempDetail.ecommVerifnRsltLimitInfo = '失败';
						}
						//原交易检查
						if(this.verifnArea.ecommVerifnRsltOriTrans == 'A'){
							this.tempDetail.ecommVerifnRsltOriTransInfo = '通过';
						}else if(this.verifnArea.ecommVerifnRsltOriTrans == 'B'){
							this.tempDetail.ecommVerifnRsltOriTransInfo = '未检查';
						}else if(this.verifnArea.ecommVerifnRsltOriTrans == 'D'){
							this.tempDetail.ecommVerifnRsltOriTransInfo = '失败';
						}
						//授权匹配检查
						if(this.verifnArea.ecommVerifnRsltAuthMatch == 'A'){
							this.tempDetail.ecommVerifnRsltAuthMatchInfo = '通过';
						}else if(this.verifnArea.ecommVerifnRsltAuthMatch == 'B'){
							this.tempDetail.ecommVerifnRsltAuthMatchInfo = '未检查';
						}else if(this.verifnArea.ecommVerifnRsltAuthMatch == 'D'){
							this.tempDetail.ecommVerifnRsltAuthMatchInfo = '失败';
						}
						//交易验证最终结果
						if(this.verifnArea.ecommVerifnRsltFinalCheck == 'A'){
							this.tempDetail.ecommVerifnRsltFinalCheckInfo = '通过';
						}else if(this.verifnArea.ecommVerifnRsltFinalCheck == 'B'){
							this.tempDetail.ecommVerifnRsltFinalCheckInfo = '未检查';
						}else if(this.verifnArea.ecommVerifnRsltFinalCheck == 'D'){
							this.tempDetail.ecommVerifnRsltFinalCheckInfo = '失败';
						}
						//账户验证结果
						if(this.verifnArea.ecommVerifnRsltAccountCheck == 'A'){
							this.tempDetail.ecommVerifnRsltAccountCheckInfo = '通过';
						}else if(this.verifnArea.ecommVerifnRsltAccountCheck == 'B'){
							this.tempDetail.ecommVerifnRsltAccountCheckInfo = '未检查';
						}else if(this.verifnArea.ecommVerifnRsltAccountCheck == 'D'){
							this.tempDetail.ecommVerifnRsltAccountCheckInfo = '失败';
						}
						//交易处理状态
						if(row.transProcessStatus == '0'){
							this.tempDetail.transProcessStatusInfo = '未处理';
						}else if(row.transProcessStatus == '1'){
							this.tempDetail.transProcessStatusInfo = '授权更新失败';
						}else if(row.transProcessStatus == '2'){
							this.tempDetail.transProcessStatusInfo = '已完成';
						}else if(row.transProcessStatus == '3'){
							this.tempDetail.transProcessStatusInfo = '交易登记失败';
						}
						//入账标志
						if(row.transPostingFlag == 'S'){
							this.tempDetail.transPostingInfo = '实时入账';
						}else if(row.transPostingFlag == 'D'){
							this.tempDetail.transPostingInfo = '非实时入账';
						}
						//授权交易类型
						if(row.transType == 'NM'){
							this.tempDetail.transTypeInfo = '正交易';
						}else if(row.transType == 'FR'){
							this.tempDetail.transTypeInfo = '冲正';
						}else if(row.transType == 'FV'){
							this.tempDetail.transTypeInfo = '撤销';
						}else if(row.transType == 'VR'){
							this.tempDetail.transTypeInfo = '撤销冲正';
						}else if(row.transType == 'PA'){
							this.tempDetail.transTypeInfo ='预授权';
						}else if(row.transType == 'PR'){
							this.tempDetail.transTypeInfo = '预授权冲正';
						}else if(row.transType == 'PV'){
							this.tempDetail.transTypeInfo = '预授权撤销';
						}else if(row.transType == 'PW'){
							this.tempDetail.transTypeInfo = '预授权撤销冲正';
						}else if(row.transType == 'PC'){
							this.tempDetail.transTypeInfo = '预授权完成';
						}else if(row.transType == 'CR'){
							this.tempDetail.transTypeInfo = '预授权完成冲正';
						}else if(row.transType == 'CV'){
							this.tempDetail.transTypeInfo = '预授权完成撤销';
						}else if(row.transType == 'CW'){
							this.tempDetail.transTypeInfo = '预授权完成撤销冲正';
						}
						//输入来源：
						if(row.inputSource == 'V'){
							this.tempDetail.inputSourceInfo = "VISA";
						}else if(row.inputSource == 'M'){
							this.tempDetaile.inputSourceInfo = "MC";
						}else if(row.inputSource == 'C'){
							this.tempDetail.inputSourceInfo = "CUP";
						}else if(row.inputSource == 'L'){
							this.tempDetail.inputSourceInfo = '本地';
						}
						if(row.authCreditUseHistorys && row.authCreditUseHistorys.length > 0){
							this.histDiv = true;
							this.histDiv2 = false;
							this.authCreditUseHistorys = row.authCreditUseHistorys;
						}else {
							this.histDiv = false;
							this.histDiv2 = true;
						}
				},
	    	subData(){
	        	let obj3 = {
		        		"authDataSynFlag": '1',
								"transMessage": this.transMessage
	        	}
	        	this.post('/auth/authService/AUS.OP.02.0003', obj3,(res) => {
		            if (res.returnCode == '000000') {
		               	this.$notify({
							title: 'Success',
							message: '冲正成功',
							type: 'success',
							duration: 2000
			            })
		            }
	       		})
	    	},
	    	selectHistory(row){
	        	this.dialogFormVisibleQuota = true
	        	this.quotaListLoadingB = true
	        	this.quotaListLoadingL = true
	        	let obj4= {
		        		customerNo: row.customerNo,
		        		globalTransSerialNo: row.globalTransSerialNo,
		        		authDataSynFlag: '1',
	        	}
	        	this.post('/auth/authService/AUS.IQ.02.0005', obj4,(res) => {
		        		this.quotaListLoadingB = false
		        		this.quotaListLoadingL = false
		            if (res.returnCode == '000000') {
			            let listData = []
	               		listData = res.returnData.rows
	               		this.tempQuotaInfo = Object.assign({}, listData) 
	               		this.quotaListL = listData.x7604LList
	               		this.quotaListB = listData.x7604BList
	               		this.$nextTick(() => {
					       	this.$refs['dataFormQuotaInfo'].clearValidate()
			        	})
		            }
	       		})
	        	
	   		},
       	
    }
}   
</script>
<style>
.w-input{
    width: 70px !important;
    display: inline-block;
    padding-right: 5px;
}
</style>

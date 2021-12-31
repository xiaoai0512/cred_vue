<!-- 当日交易查询 -->
<template>
	<div class="allContent">
		<!-- 表单验证demo: -->
		<el-form ref="queryRef" :model=" queryFormObj">
			<el-form-item class="cl_td" label="证件类型" prop="idType">
				<el-select v-model=" queryFormObj.idType" class="wd200" clearable>
					<el-option v-for="(item, index) in idTypeList" :key="index" :label="item.detailDesc" :value="item.codes" />
				</el-select>
			</el-form-item>
			<el-form-item class="cl_td" label="证件号码" prop="idNumber">
				<el-input v-model=" queryFormObj.idNumber" class="wd200" type="text" />
			</el-form-item>
			<el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
				<el-input v-model=" queryFormObj.externalIdentificationNo" class="wd200" type="text" />
			</el-form-item>
			<el-form-item class="cl_td" label="授权场景代码" prop="authSceneCode">
				<el-select v-model=" queryFormObj.authSceneCode" class="wd200" clearable>
					<el-option v-for="(item, index) in authSceneCodeOptions" :key="index" :label="item.concat" :value="item.authSceneCode" />
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
				<el-table-column prop="temTransNo" label="交易账号" align="center" width='150' />
				<el-table-column prop="processingDate" label="交易处理日期 " align="center" width="120" />
				<el-table-column prop="processingTime" label="交易处理时间" align="center" width="120" />
				<el-table-column prop="temCurrencyCode" label="交易币种" align="center" width="80" />
				<el-table-column prop="temTransAmount" label="交易金额" align="center" width="80" />
				<el-table-column prop="authSceneCodeDesc" label="授权场景" align="center" />
				<el-table-column prop="ecommField38" label="授权成功码" align="center" />
				<el-table-column prop="ecommField39" label="授权响应码" align="center" width="100" />
				<el-table-column prop="transTypeDesc" label="交易类型" align="center" width="80" />
				<el-table-column prop="" label="操作" align="center">
					<template slot-scope="{row}">
						<el-button size="mini" icon="el-icon-info" type="primary" @click="selectInfo(row)">详情</el-button>
					</template>
				</el-table-column>
			</el-table>
			<pagination v-show="tableTotal > 0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
		</div>
		<!--详情-->
		<el-dialog title="查询详细信息" :visible.sync="dialogFormVisibleDetailView" width='60%'>
			<el-form ref="detailViewForm" :model="detailView">
				<el-form-item class="cl_td" label="客户代码" prop="customerNo">
					<el-input v-model="detailView.customerNo" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
					<el-input v-model="detailView.externalIdentificationNo" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="账户代码" prop="accountNo">
					<el-input v-model="detailView.accountNo" class="wd200" type="text" readonly />
				</el-form-item>
				<el-form-item class="cl_td" label="全局流水号" prop="globalTransSerialNo">
					<el-input v-model="detailView.globalTransSerialNo" class="wd200" type="text" readonly/>
				</el-form-item>
				<div class=" clearboth"></div>
				<div class="mainname titleInfo ">基本信息</div>
				<el-form-item class="cl_td" label="交易日期 " prop="temDate">
					<el-input v-model="detailView.temDate" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="交易时间" prop="temTime">
					<el-input v-model="detailView.temTime" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="交易传输时间" prop="ecommField7">
					<el-input v-model="detailView.ecommField7" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="系统跟踪单号" prop="ecommField11">
					<el-input v-model="detailView.ecommField11" class="wd200" type="text" readonly/>
				</el-form-item>

				<el-form-item class="cl_td" label="受理机构识别码" prop="ecommField32">
					<el-input v-model="detailView.ecommField32" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="检索参考号：" prop="ecommField37">
					<el-input v-model="detailView.ecommField37" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="入账标志" prop="transPostingInfo">
					<el-input v-model="detailView.transPostingInfo" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="交易类型" prop="transTypeInfo">
					<el-input v-model="detailView.transTypeInfo" class="wd200" type="text" readonly/>
				</el-form-item>

				<el-form-item class="cl_td" label="交易处理状态" prop="transProcessStatusInfo">
					<el-input v-model="detailView.transProcessStatusInfo" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="输入来源" prop="inputSourceInfo">
					<el-input v-model="detailView.inputSourceInfo" class="wd200" type="text" readonly/>
				</el-form-item>
				<div class=" clearboth"></div>
				<div class="mainname titleInfo ">关联交易信息</div>
				<el-form-item class="cl_td" label="原交易全局流水号" prop="accumultWaiveAmt">
					<el-input v-model="detailView.accumultWaiveAmt" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="冲正交易全局流水号" prop="dateOfInitialCollection">
					<el-input v-model="detailView.dateOfInitialCollection" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="授权交易全局流水号" prop="dateOfLastCollection">
					<el-input v-model="detailView.dateOfLastCollection" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="入账交易全局流水号" prop="accumulatedCollectionAmount">
					<el-input v-model="detailView.accumulatedCollectionAmount" class="wd200" type="text" readonly/>
				</el-form-item>
				<div class=" clearboth"></div>
				<div class="mainname titleInfo ">授权检查结果</div>
				<el-form-item class="cl_td" label="CVV/ICVV检查" prop="ecommVerifnRsltCvvInfo">
					<el-input v-model="detailView.ecommVerifnRsltCvvInfo" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="CVV2检查" prop="ecommVerifnRsltCvv2Info">
					<el-input v-model="detailView.ecommVerifnRsltCvv2Info" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="CAVV检查" prop="ecommVerifnRsltCavvInfo">
					<el-input v-model="detailView.ecommVerifnRsltCavvInfo" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="PIN检查" prop="ecommVerifnRsltPinInfo">
					<el-input v-model="detailView.ecommVerifnRsltPinInfo" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="ARQC检查" prop="ecommVerifnRsltCvvInfo">
					<el-input v-model="detailView.ecommVerifnRsltCvvInfo" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="交易有效期检查" prop="ecommVerifnRsltTransExpDteInfo">
					<el-input v-model="detailView.ecommVerifnRsltTransExpDteInfo" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="卡片有效期检查" prop="ecommVerifnRsltMediaExpDteInfo">
					<el-input v-model="detailView.ecommVerifnRsltMediaExpDteInfo" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="发卡例外检查" prop="ecommVerifnRsltExcpInfo">
					<el-input v-model="detailView.ecommVerifnRsltExcpInfo" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="卡片激活检查" prop="ecommVerifnRsltPinInfo">
					<el-input v-model="detailView.ecommVerifnRsltActvInfo" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="国际组织例外检查" prop="ecommVerifnRsltSpclInfo">
					<el-input v-model="detailView.ecommVerifnRsltSpclInfo" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="欺诈检查" prop="ecommVerifnRsltFraudInfo">
					<el-input v-model="detailView.ecommVerifnRsltFraudInfo" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="交易限制检查" prop="ecommVerifnRsltVeloInfos   ">
					<el-input v-model="detailView.ecommVerifnRsltVeloInfo" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="正负面清单检查" prop="ecommVerifnRsltBwlistInfo">
					<el-input v-model="detailView.ecommVerifnRsltBwlistInfo" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="额度检查" prop="ecommVerifnRsltLimitInfo">
					<el-input v-model="detailView.ecommVerifnRsltLimitInfo" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="原交易检查结果" prop="ecommVerifnRsltOriTransInfo">
					<el-input v-model="detailView.ecommVerifnRsltOriTransInfo" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="授权匹配检查结果" prop="ecommVerifnRsltAuthMatchInfo">
					<el-input v-model="detailView.ecommVerifnRsltAuthMatchInfo" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="交易验证最终检查结果" prop="ecommVerifnRsltFinalCheckInfo">
					<el-input v-model="detailView.ecommVerifnRsltFinalCheckInfo" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="账户验证结果" prop="ecommVerifnRsltAccountCheckInfo">
					<el-input v-model="detailView.ecommVerifnRsltAccountCheckInfo" class="wd200" type="text" readonly/>
				</el-form-item>
				<div class=" clearboth"></div>
				<div class="mainname titleInfo ">交易管控信息</div>
				<el-form-item class="cl_td" label="授权场景代码" prop="authSceneCode">
					<el-input v-model="detailView.authSceneCode" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="管控场景代码" prop="contrlSceneCode">
					<el-input v-model="detailView.contrlSceneCode" class="wd200" type="text" readonly/>
				</el-form-item>
				<div class=" clearboth"></div>
				<div class="mainname titleInfo ">详细信息</div>
				<el-form-item class="cl_td" label="交易币种" prop="temCurrencyCode">
					<el-input v-model="detailView.temCurrencyCode" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="交易金额" prop="temTransAmount">
					<el-input v-model="detailView.temTransAmount" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="清算币种" prop="ecommClearCurr">
					<el-input v-model="detailView.ecommClearCurr" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="清算金额" prop="ecommClearAmt">
					<el-input v-model="detailView.ecommClearAmt" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="入账币种" prop="billingCurrCode">
					<el-input v-model="detailView.billingCurrCode" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="入账金额" prop="billingAmt">
					<el-input v-model="detailView.billingAmt" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="营销场景代码" prop="marketingSceneCode">
					<el-input v-model="detailView.marketingSceneCode" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="营销币种" prop="marketingCurrencyCode">
					<el-input v-model="detailView.marketingCurrencyCode" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="营销减免金额" prop="marketingDiscountAmt">
					<el-input v-model="detailView.marketingDiscountAmt" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="有效期" prop="ecommField14">
					<el-input v-model="detailView.authTransMessage.ecommField14" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="商户代码" prop="ecommField18">
					<el-input v-model="detailView.authTransMessage.ecommField18" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="国家码" prop="ecommField19">
					<el-input v-model="detailView.authTransMessage.ecommField19" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="POS ENTRY MODE" prop="ecommField22">
					<el-input v-model="detailView.authTransMessage.ecommField22" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="POS CONDITION CODE" prop="ecommField25">
					<el-input v-model="detailView.authTransMessage.ecommField25" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="受卡机终端标识码" prop="ecommField41">
					<el-input v-model="detailView.authTransMessage.ecommField41" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="受卡方标识码" prop="ecommField42">
					<el-input v-model="detailView.authTransMessage.ecommField42" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="商户名称地址" prop="ecommField43">
					<el-input v-model="detailView.authTransMessage.ecommField43" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="授权成功码" prop="ecommField38">
					<el-input v-model="detailView.authTransMessage.ecommField38" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="授权响应码" prop="ecommField43">
					<el-input v-model="detailView.authTransMessage.ecommField39" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="拒绝信息" prop="responseDesc">
					<el-input v-model="detailView.responseDesc" class="wd200" type="text" readonly/>
				</el-form-item>
				<div class=" clearboth"></div>
				<div class="mainname titleInfo ">详细信息</div>
				<el-form-item class="cl_td" label=" 溢缴款使用币种" prop="overpayOccupyCurrCode">
					<el-input v-model="detailView.overpayOccupyCurrCode" class="wd200" type="text" readonly/>
				</el-form-item>
				<el-form-item class="cl_td" label="溢缴款使用金额" prop="overpayOccupyAmt">
					<el-input v-model="detailView.overpayOccupyAmt" class="wd200" type="text" readonly/>
				</el-form-item>
				<!--<el-form-item class="cl_td" label="额度节点" prop="creditNodeNoDesc">
                    <el-input v-model="detailView.creditNodeNoDesc" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易金额" prop="creditOccupyAmt">
                    <el-input v-model="detailView.creditOccupyAmt" class="wd200" type="text" readonly/>
                </el-form-item>-->
				<div v-if="histDiv">
					<div class="col_td">
						<div class="col4 text_right">额度节点：</div>
						<div class="wd190 float_left" style="padding-left: 10px;">
							<span>{{authCreditUseHistorys.creditNodeNo}}{{authCreditUseHistorys.creditDesc}}</span>
						</div>
					</div>
					<div class="col_td">
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
							<span>{{detailView.creditNodeNo}}{{detailView.creditDesc}}</span>
						</div>
					</div>
					<div class="col_td">
						<div class="col4 text_right">交易金额：</div>
						<div class="wd190 float_left" style="padding-left: 10px;">
							<span>{{detailView.creditOccupyAmt}}</span>
						</div>
					</div>
				</div>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button type="primary" @click="forceInfo()" v-if="detailView.forceAuthFlag == 'Y' && detailView.authTransMessage.ecommField39 != '00'">强制授权</el-button>
				<el-button type="primary" @click="rvInfo()" v-if="detailView.rvTransFlag == 'Y' && detailView.authTransMessage.ecommField39 == '00'">冲正</el-button>
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
				queryRef: {},
				tablesList: [], //列表
				listLoading1: false,
				queryFormObj: {
					pageNum: 1,
					pageSize: 10,
				},
				tableTotal: 0,
				isShow: false,
				dialogFormVisibleDetailView: false,
				//客户费用收取信息
				detailView: {
					authTransMessage: {},
				},
				histDiv: false,
				histDiv2: false,
				showDiv: false,
				detailViewForm: {},
				//下拉
				authSceneCodeOptions: [],
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
				//授权
			let obj = {
				groupsCode: "dic_periodArray",
				queryFlag: "1",
				type: "DROPDOWNBOX",
			}
			this.getSelectDict('/beta/betaService/AUS.PM.01.0002', obj).then((res) => {
				res.forEach(item => {
					item.concat = item.authSceneCode + ' ' + item.sceneDesc
				});
				this.authSceneCodeOptions = res
			})
		},
		methods: {
			init() {
				this.queryFormObj = {
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
				if(!this.queryFormObj.externalIdentificationNo && !this.queryFormObj.idType && !this.queryFormObj.idNumber) {
					this.$message({
						message: '请输入查询信息',
						type: 'warning'
					})
					this.init()
				} else {
					if(this.queryFormObj.idType) {
						if(!this.queryFormObj.idNumber) {
							this.$message({
								message: '请输入证件号码',
								type: 'warning'
							})
						} else {
							this.getList()
						}
					} else if(this.queryFormObj.idNumber) {
						if(!this.queryFormObj.idType) {
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
				this.queryFormObj.periodicFeeIdentifier = this.queryFormObj.codes
				let params = {
					idType: this.queryFormObj.idType,
					idNumber: this.queryFormObj.idNumber,
					externalIdentificationNo: this.queryFormObj.externalIdentificationNo,
					authSceneCode: this.queryFormObj.authSceneCode,
					isTrans: true, //是否需要翻译数据字典
					transParams: ['dic_authType'], //查找数据字典所需参数
					transDict: ['transType'], //翻译前后key
					authDataSynFlag: '1',

				}
				params = Object.assign(params, this.queryFormObj);
				this.getTableList('/auth/authService/AUS.IQ.02.0001', params, (res) => {
					this.listLoading1 = false
					if(res.returnCode == '000000') {
						if(res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
							this.tablesList = res.returnData.rows
							this.tablesList.authTransMessage = res.returnData.rows.authTransMessage
							this.tableTotal = res.returnData.totalCount
							this.tablesList.forEach(item => {
								item.authSceneCodeDesc = item.authSceneCode + '' + item.sceneDesc

							})
						} else {
							this.tablesList = []
							this.tableTotal = 0
						}
					}
				}, (err) => {
					this.tablesList = []
					this.tableTotal = 0
					this.listLoading1 = false
				})
			},
			selectInfo(row) {
				this.dialogFormVisibleDetailView = true
				this.detailView = Object.assign({}, row)
				this.detailView = row
				this.detailView.verifnArea = JSON.parse(row.verifnArea);
				this.$nextTick(() => {
					this.$refs['detailViewForm'].clearValidate()
				})

				//交易处理状态
				if(row.transProcessStatus == '0') {
					this.detailView.transProcessStatusInfo = '强制授权';
				} else if(row.transProcessStatus == '1') {
					this.detailView.transProcessStatusInfo = '授权更新失败';
				} else if(row.transProcessStatus == '2') {
					this.detailView.transProcessStatusInfo = '已完成';
				} else if(row.transProcessStatus == '3') {
					this.detailView.transProcessStatusInfo = '交易登记失败';
				}
				//入账标志
				if(row.transPostingFlag == 'S') {
					this.detailView.transPostingInfo = '实时入账';
				} else if(row.transPostingFlag == 'D') {
					this.detailView.transPostingInfo = '非实时入账';
				}
				//授权交易类型
				if(row.transType == 'NM') {
					this.detailView.transTypeInfo = '正交易';
				} else if(row.transType == 'FR') {
					this.detailView.transTypeInfo = '冲正';
				} else if(row.transType == 'FV') {
					this.detailView.transTypeInfo = '撤销';
				} else if(row.transType == 'VR') {
					this.detailView.transTypeInfo = T.T('撤销');
				} else if(row.transType == 'PA') {
					this.detailView.transTypeInfo = '预授权';
				} else if(row.transType == 'PR') {
					this.detailView.transTypeInfo = '预授权冲正';
				} else if(row.transType == 'PV') {
					this.detailView.transTypeInfo = '预授权撤销';
				} else if(row.transType == 'PW') {
					this.detailView.transTypeInfo = '预授权撤销冲正';
				} else if(row.transType == 'PC') {
					this.detailView.transTypeInfo = '预授权完成';
				} else if(row.transType == 'CR') {
					this.detailView.transTypeInfo = T.T('SQH27000120');
				} else if(row.transType == 'CV') {
					this.detailView.transTypeInfo = '预授权完成撤销';
				} else if(row.transType == 'CW') {
					this.detailView.transTypeInfo = '预授权完成撤销';
				}
				//输入来源：
				if(row.inputSource == 'V') {
					this.detailView.inputSourceInfo = "VISA";
				} else if(row.inputSource == 'M') {
					this.detailView.inputSourceInfo = "MC";
				} else if(row.inputSource == 'C') {
					this.detailView.inputSourceInfo = "CUP";
				} else if(row.inputSource == 'L') {
					this.detailView.inputSourceInfo = '本地';
				}
				this.detailView.forceFlag = false;
				this.detailView.rvFlag = false;
				if(row.forceAuthFlag == 'Y') {
					this.detailView.forceFlag = true;
				} else {
					this.detailView.forceFlag = false;
				}
				if(row.rvTransFlag == 'Y') {
					this.detailView.rvFlag = true;
				} else {
					this.detailView.rvFlag = false;
				}
				//授权检查结果
				//cvv
				if(this.detailView.verifnArea.ecommVerifnRsltCvv == 'A') {
					this.detailView.ecommVerifnRsltCvvInfo = '通过';
				} else if(this.detailView.verifnArea.ecommVerifnRsltCvv == 'B') {
					this.detailView.ecommVerifnRsltCvvInfo = '未检查';
				} else if(this.detailView.verifnArea.ecommVerifnRsltCvv == 'D') {
					this.detailView.ecommVerifnRsltCvvInfo = '失败';
				}
				//cvv2
				if(this.detailView.verifnArea.ecommVerifnRsltCvv2 == 'A') {
					this.detailView.ecommVerifnRsltCvv2Info = '通过';
				} else if(this.detailView.verifnArea.ecommVerifnRsltCvv2 == 'B') {
					this.detailView.ecommVerifnRsltCvv2Info = '未检查';
				} else if(this.detailView.verifnArea.ecommVerifnRsltCvv2 == 'D') {
					this.detailView.ecommVerifnRsltCvv2Info = '失败';
				}
				//cavv
				if(this.detailView.verifnArea.ecommVerifnRsltCavv == 'A') {
					this.detailView.ecommVerifnRsltCavvInfo = '通过';
				} else if(this.detailView.verifnArea.ecommVerifnRsltCavv == 'B') {
					this.detailView.ecommVerifnRsltCavvInfo = '未检查';
				} else if(this.detailView.verifnArea.ecommVerifnRsltCavv == 'D') {
					this.detailView.ecommVerifnRsltCavvInfo = '失败';
				}
				//pin
				if(this.detailView.verifnArea.ecommVerifnRsltPin == 'A') {
					this.detailView.ecommVerifnRsltPinInfo = '通过';
				} else if(this.detailView.verifnArea.ecommVerifnRsltPin == 'B') {
					this.detailView.ecommVerifnRsltPinInfo = '未检查';
				} else if(this.detailView.verifnArea.ecommVerifnRsltPin == 'D') {
					this.detailView.ecommVerifnRsltPinInfo = '失败';
				}
				//ARQC
				if(this.detailView.verifnArea.ecommVerifnRsltArqc == 'A') {
					this.detailView.ecommVerifnRsltArqcInfo = '通过';
				} else if(this.detailView.verifnArea.ecommVerifnRsltArqc == 'B') {
					this.detailView.ecommVerifnRsltArqcInfo = '未检查';
				} else if(this.detailView.verifnArea.ecommVerifnRsltArqc == 'D') {
					this.detailView.ecommVerifnRsltArqcInfo = '失败';
				}
				//交易有效期
				if(this.detailView.verifnArea.ecommVerifnRsltTransExpDte == 'A') {
					this.detailView.ecommVerifnRsltTransExpDteInfo = '通过';
				} else if(this.detailView.verifnArea.ecommVerifnRsltTransExpDte == 'B') {
					this.detailView.ecommVerifnRsltTransExpDteInfo = '未检查';
				} else if(this.detailView.verifnArea.ecommVerifnRsltTransExpDte == 'D') {
					this.detailView.ecommVerifnRsltTransExpDteInfo = '失败';
				}
				//卡片有效期
				if(this.detailView.verifnArea.ecommVerifnRsltMediaExpDte == 'A') {
					this.detailView.ecommVerifnRsltMediaExpDteInfo = '通过';
				} else if(this.detailView.verifnArea.ecommVerifnRsltMediaExpDte == 'B') {
					this.detailView.ecommVerifnRsltMediaExpDteInfo = '未检查';
				} else if(this.detailView.verifnArea.ecommVerifnRsltMediaExpDte == 'D') {
					this.detailView.ecommVerifnRsltMediaExpDteInfo = '失败';
				}
				//卡片制数
				if(this.detailView.verifnArea.ecommVerifnRsltPltNbrs == 'A') {
					this.detailView.ecommVerifnRsltPltNbrsInfo = '通过';
				} else if(this.detailView.verifnArea.ecommVerifnRsltPltNbrs == 'B') {
					this.detailView.ecommVerifnRsltPltNbrsInfo = '未检查';
				} else if(this.detailView.verifnArea.ecommVerifnRsltPltNbrs == 'D') {
					this.detailView.ecommVerifnRsltPltNbrsInfo = '失败';
				}
				//发卡例外
				if(this.detailView.verifnArea.ecommVerifnRsltExcp == 'A') {
					this.detailView.ecommVerifnRsltExcpInfo = '通过';
				} else if(this.detailView.verifnArea.ecommVerifnRsltExcp == 'B') {
					this.detailView.ecommVerifnRsltExcpInfo = '未检查';
				} else if(this.detailView.verifnArea.ecommVerifnRsltExcp == 'D') {
					this.detailView.ecommVerifnRsltExcpInfo = '失败';
				}
				//卡片激活
				if(this.detailView.verifnArea.ecommVerifnRsltActv == 'A') {
					this.detailView.ecommVerifnRsltActvInfo = '通过';
				} else if(this.detailView.verifnArea.ecommVerifnRsltActv == 'B') {
					this.detailView.ecommVerifnRsltActvInfo = '未检查';
				} else if(this.detailView.verifnArea.ecommVerifnRsltActv == 'D') {
					this.detailView.ecommVerifnRsltActvInfo = '失败';
				}
				//国际组织例外
				if(this.detailView.verifnArea.ecommVerifnRsltSpcl == 'A') {
					this.detailView.ecommVerifnRsltSpclInfo = '通过';
				} else if(this.detailView.verifnArea.ecommVerifnRsltSpcl == 'B') {
					this.detailView.ecommVerifnRsltSpclInfo = '未检查';
				} else if(this.detailView.verifnArea.ecommVerifnRsltSpcl == 'D') {
					this.detailView.ecommVerifnRsltSpclInfo = '失败';
				}
				//欺诈检查
				if(this.detailView.verifnArea.ecommVerifnRsltFraud == 'A') {
					this.detailView.ecommVerifnRsltFraudInfo = '通过';
				} else if(this.detailView.verifnArea.ecommVerifnRsltFraud == 'B') {
					this.detailView.ecommVerifnRsltFraudInfo = '未检查';
				} else if(this.detailView.verifnArea.ecommVerifnRsltFraud == 'D') {
					this.detailView.ecommVerifnRsltFraudInfo = '失败';
				}
				//交易限制
				if(this.detailView.verifnArea.ecommVerifnRsltVelo == 'A') {
					this.detailView.ecommVerifnRsltVeloInfo = '通过';
				} else if(this.detailView.verifnArea.ecommVerifnRsltVelo == 'B') {
					this.detailView.ecommVerifnRsltVeloInfo = '未检查';
				} else if(this.detailView.verifnArea.ecommVerifnRsltVelo == 'D') {
					this.detailView.ecommVerifnRsltVeloInfo = '失败';
				}
				//正负面清单
				if(this.detailView.verifnArea.ecommVerifnRsltBwlist == 'A') {
					this.detailView.ecommVerifnRsltBwlistInfo = '通过';
				} else if(this.detailView.verifnArea.ecommVerifnRsltBwlist == 'B') {
					this.detailView.ecommVerifnRsltBwlistInfo = '未检查';
				} else if(this.detailView.verifnArea.ecommVerifnRsltBwlist == 'D') {
					this.detailView.ecommVerifnRsltBwlistInfo = '失败';
				}
				//额度检查
				if(this.detailView.verifnArea.ecommVerifnRsltLimit == 'A') {
					this.detailView.ecommVerifnRsltLimitInfo = '通过';
				} else if(this.detailView.verifnArea.ecommVerifnRsltLimit == 'B') {
					this.detailView.ecommVerifnRsltLimitInfo = '未检查';
				} else if(this.detailView.verifnArea.ecommVerifnRsltLimit == 'D') {
					this.detailView.ecommVerifnRsltLimitInfo = '失败';
				}
				//原交易检查
				if(this.detailView.verifnArea.ecommVerifnRsltOriTrans == 'A') {
					this.detailView.ecommVerifnRsltOriTransInfo = '通过';
				} else if(this.detailView.verifnArea.ecommVerifnRsltOriTrans == 'B') {
					this.detailView.ecommVerifnRsltOriTransInfo = '未检查';
				} else if(this.detailView.verifnArea.ecommVerifnRsltOriTrans == 'D') {
					this.detailView.ecommVerifnRsltOriTransInfo = '失败';
				}
				//授权匹配检查
				if(this.detailView.verifnArea.ecommVerifnRsltAuthMatch == 'A') {
					this.detailView.ecommVerifnRsltAuthMatchInfo = '通过';
				} else if(this.detailView.verifnArea.ecommVerifnRsltAuthMatch == 'B') {
					this.detailView.ecommVerifnRsltAuthMatchInfo = '未检查';
				} else if(this.detailView.verifnArea.ecommVerifnRsltAuthMatch == 'D') {
					this.detailView.ecommVerifnRsltAuthMatchInfo = '失败';
				}
				//交易验证最终结果
				if(this.detailView.verifnArea.ecommVerifnRsltFinalCheck == 'A') {
					this.detailView.ecommVerifnRsltFinalCheckInfo = '通过';
				} else if(this.detailView.verifnArea.ecommVerifnRsltFinalCheck == 'B') {
					this.detailView.ecommVerifnRsltFinalCheckInfo = '未检查';
				} else if(this.detailView.verifnArea.ecommVerifnRsltFinalCheck == 'D') {
					this.detailView.ecommVerifnRsltFinalCheckInfo = '失败';
				}
				//账户验证结果
				if(this.detailView.verifnArea.ecommVerifnRsltAccountCheck == 'A') {
					this.detailView.ecommVerifnRsltAccountCheckInfo = '通过';
				} else if(this.detailView.verifnArea.ecommVerifnRsltAccountCheck == 'B') {
					this.detailView.ecommVerifnRsltAccountCheckInfo = '未检查';
				} else if(this.detailView.verifnArea.ecommVerifnRsltAccountCheck == 'D') {
					this.detailView.ecommVerifnRsltAccountCheckInfo = '失败';
				}
				if(row.authCreditUseHistorys && row.authCreditUseHistorys.length > 0) {
					this.histDiv = true;
					this.histDiv2 = false;
					this.authCreditUseHistorys = row.authCreditUseHistorys;
				} else {
					this.histDiv = false;
					this.histDiv2 = true;
				}
			},
			//强制授权
			forceInfo() {
				let cusParams = {
					authDataSynFlag: '1',
					transMessage: this.detailView.transMessage,
					inputSource: this.detailView.inputSource,
					externalIdentificationNo: this.detailView.externalIdentificationNo,
				};
				this.post('/auth/authService/AUS.OP.02.0002', cusParams, (res) => {
					if(res.returnCode == '000000') {
						this.$notify({
							title: 'Success',
							message: '强制授权成功',
							type: 'success',
							duration: 2000
						})
					}
				})
			},
			//冲正
			rvInfo() {
				let rvParams = {
					authDataSynFlag: '1',
					transMessage: this.detailView.transMessage,
					inputSource: this.detailView.inputSource,
					externalIdentificationNo: this.detailView.externalIdentificationNo,
				};
				this.post('/auth/authService/AUS.OP.02.0003', rvParams, (res) => {
					if(res.returnCode == '000000') {
						this.$notify({
							title: 'Success',
							message: '冲正成功',
							type: 'success',
							duration: 2000
						})
					}
				})
			},
		}
	}
</script>

<style>

</style>
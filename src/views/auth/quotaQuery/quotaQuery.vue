<template>
	<div class="allContent">
		<el-form ref="transForm" :model="interestList">
			<el-form-item class="cl_td" label="证件类型" prop="idType">
				<el-select v-model="interestList.idType" class="wd200">
					<el-option v-for="(item, index) in idTypeList" :key="index" :label="item.detailDesc" :value="item.codes" />
				</el-select>
			</el-form-item>
			<el-form-item class="cl_td" label="证件号码" prop="idNumber">
				<el-input v-model="interestList.idNumber" class="wd200" type="text" />
			</el-form-item>
			<el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
				<el-input v-model="interestList.externalIdentificationNo" class="wd200" type="text" />
			</el-form-item>
			<!-- <div class="cl_td clearboth"></div> -->
			<div class="cl_tr text_center">
				<el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()">查询</el-button>
				<el-button size="medium" icon="el-icon-refresh" type="primary" @click="reset()">重置</el-button>
			</div>
		</el-form>
		<div v-if="isShow" class="text_title">汇总节点</div>
		<!-- 结息交易列表 -->
		<el-table v-if="isShow" v-loading="listLoading" :data="list" border fit highlight-current-row style="width: 100%;">
			<el-table-column width="220" align="left" label="账户号" prop="accountId" />
			<el-table-column width="200" align="left" label="产品对象" prop="productObjectCode" />
			<el-table-column width="200" align="left" label="业务类型" prop="businessTypeCode" />
			<el-table-column width="100" align="left" label="入账币种" prop="transDate" />
			<el-table-column width="100" align="left" label="入账金额" prop="postingAmount" />
			<el-table-column width="100" align="left" label="入账日期" prop="occurrDate" />
			<el-table-column width="200" align="left" label="交易描述" prop="transDesc" />
			<el-table-column width="200" align="center" label="操作" class-name="small-padding fixed-width">
				<template slot-scope="{row,$index}">
					<a href="javascript:" ng-click="getBusAvaQuotaInfo(list)"><span>  </span></a>
					<a href="javascript:" ng-click="getBusAvaQuotaInfo(list)"><span>  </span></a>
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<pagination v-if="isShow" v-show="total>0" :total="total" :page.sync="interestObj.pageNum" :limit.sync="interestObj.pageSize" @pagination="getList" />
		<div class="text_title">业务节点</div>
		<!-- 结息明细 -->
		<el-table v-if="showDetail" :data="detailList" border fit highlight-current-row style="width: 100%;">
			<el-table-column align="left" label="周期号" prop="cycleNumber" />
			<el-table-column width="150" align="left" label="计息余额" prop="balanceObjectDesc" />
			<el-table-column width="100" align="left" label="利率" prop="annualInterestRate" />
			<el-table-column width="100" align="left" label="资产属性" prop="assetPropertiesDesc" />
			<el-table-column width="100" align="left" label="核算状态" prop="accountingStatusCodeDesc" />
			<el-table-column width="200" align="left" label="本结息周期利息累计金额" prop="currInterestAmount" />
			<el-table-column width="200" align="left" label="原结息金额" prop="oriInterestAmount" />
			<el-table-column width="200" align="left" label="上一周期利息累计转入金额" prop="lastInterestAmount" />
			<el-table-column width="200" align="left" label="结息开始日期" prop="billingStartDate" />
			<el-table-column width="200" align="left" label="结息结束日期   " prop="billingEndDate" />
			<el-table-column width="200" label="操作" align="center" class-name="small-padding fixed-width">
				<template slot-scope="{row,$index}">
					<el-button icon="" type="primary" size="mini" @click="getTransUnitDetail(row)">
						结息过程
					</el-button>
					<el-button icon="el-icon-more" type="primary" size="mini" @click="handleDelete(row,$index)">
						详情
					</el-button>
				</template>
			</el-table-column>
		</el-table>
		<pagination v-if="showDetail" v-show="detailTotal>0" :total="detailTotal" :page.sync="detailObj.pageNum" :limit.sync="detailObj.pageSize" @pagination="getDetailList" />

		<div v-if="showTransUint" class="text_title">交易单元计息明细</div>
		<!-- 交易单元计息明细 -->
		<el-table v-if="showTransUint" v-loading="listLoading" class="mtop20" :data="transUnitList" border fit highlight-current-row style="width: 100%;" @expand-change="rowExpand">
			<!-- 二级表格 -->
			<el-table-column type="expand" prop="" width="100">
				<template slot-scope="scope">
					<el-table :data="scope.row.occureAmountList" border @expand-change="22">
						<!-- 三级表格 -->
						<el-table-column type="expand" prop="" width="100">
							<template slot-scope="scope">
								<el-table :data="scope.row.list" border>
									<el-table-column label="本金金额" prop="pricipal" />
									<el-table-column label="利率" prop="rate" />
									<el-table-column label="DAY-FACTOR" prop="dayFactory" />
									<el-table-column label="计息开始日期" prop="startDate" />
									<el-table-column label="计息结束日期" prop="endDate" />
									<el-table-column label="计息天数" prop="interestDays" />
									<el-table-column label="利息金额" prop="interest" />
								</el-table>
							</template>
						</el-table-column>
						<el-table-column label="计息节点金额" prop="pricipal" />
						<el-table-column label="节点类型" prop="nodeTyp" />
						<el-table-column label="利息金额" prop="interest" />
						<el-table-column label="余额单元代码" prop="balanceUnitCode" />
						<el-table-column label="操作" prop="venderSku" width="300">
							<el-button type="primary" size="mini" @click="1">发生额详情</el-button>
							<el-button type="primary" size="mini" @click="2">关联交易</el-button>
						</el-table-column>
					</el-table>
				</template>
			</el-table-column>

			<el-table-column prop="pricipal" label="交易单元起始金额" align="left" width="190" />
			<el-table-column prop="startDate" label="计息开始日期" />
			<el-table-column prop="endDate" label="计息结束日期" min-width="150" />
			<el-table-column prop="interestDays" label="计息天数" width="200" />
			<el-table-column prop="interest" label="利息金额" width="150" />
			<!-- <el-table-column label="操作" align="center" width="500">
	        <template slot-scope="scope">
	          <el-button type="primary" size="mini" @click="">关联交易</el-button>
	          <el-button type="primary" size="mini" @click="">同源交易</el-button>
	          <el-button type="primary" size="mini" @click="">入账情况</el-button>
	          <el-button type="primary" size="mini" @click="">核算处理</el-button>
	          <el-button type="primary" size="mini" @click="">详情</el-button>
	        </template>
	      </el-table-column> -->
		</el-table>
		<!-- <pagination v-if="showTransUint" v-show="uintTotal>0" :total="uintTotal" :page.sync="transUintObj.pageNum" :limit.sync="transUintObj.pageSize"
     	 @pagination="getTransUnitDetail" /> -->
	</div>
</template>

<script>
	import ApiService from '@/api/api-service'
	import Pagination from '@/components/Pagination'
	export default {
		name: 'InterestQueryNew',
		components: {
			Pagination
		},
		data() {
			return {
				listLoading: true,
				list: null, // 结息交易
				detailList: null, // 结息明细
				transUnitList: null, // 交易单元计息明细
				total: 0,
				detailTotal: 0,
				uintTotal: 0,
				interestList: {
					idType: '',
					idNumber: '',
					externalIdentificationNo: ''

				},
				idTypeList: [],

				isShow: false, // 结息交易列表
				showDetail: false, // 结息明细
				showTransUint: false, // 交易单元计息明细 三级表格
				interestObj: { // 结息交易表对象
					pageNum: 1,
					pageSize: 10
				},
				detailObj: { // 结息交易表对象
					pageNum: 1,
					pageSize: 10
				},
				transUintObj: { // 结息交易表对象
					pageNum: 1,
					pageSize: 10
				}
			}
		},
		created() {

		},
		mounted() {
			this.getSelectDict('dic_certificateType').then((res) => {
				this.idTypeList = res
			})
		},
		methods: {
			init() {
				this.interestList = {
					idType: '',
					idNumber: '',
					externalIdentificationNo: '',
					pageNum: 1,
					pageSize: 10
				}
				this.isShow = false // 结息交易列表
				this.showDetail = false // 结息明细
				this.showTransUint = false // 交易单元计息明细 三级表格
			},
			// 重置
			reset() {
				this.init()
			},
			// 点击查询按钮
			handleSearch() {
				if(!this.interestList.externalIdentificationNo && !this.interestList.idType && !this.interestList.idNumber) {
					this.$message({
						message: '请输入查询信息',
						type: 'warning'
					})
					this.init()
				} else {
					if(this.interestList.idType) {
						if(!this.interestList.idNumber) {
							this.$message({
								message: '请输入证件号码',
								type: 'warning'
							})
						} else {
							this.getList()
						}
					} else if(this.interestList.idNumber) {
						if(!this.interestList.idType) {
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
			// 查询列表 结息交易
			getList() {
				this.listLoading = true
				const obj = {
					externalIdentificationNo: this.interestList.externalIdentificationNo,
					idType: this.interestList.idType,
					idNumber: this.interestList.idNumber
				}
				this.interestList = Object.assign(this.interestList, obj)
				this.getTableList('/auth/authService/LMS.IQ.01.0001', this.interestList, (res) => {
					this.list = res.returnData.rows
					this.total = res.returnData.totalCount
					this.listLoading = false
					this.isShow = true // 结息交易列表
					this.showDetail = false // 结息明细
					this.showTransUint = false // 交易单元计息明细 三级表格
				})
			},
			// 查询列表 结息明细表
			getDetailList(row) {
				const params = {
					externalIdentificationNo: this.interestList.externalIdentificationNo,
					idType: this.interestList.idType,
					idNumber: this.interestList.idNumber,
					flag: 1,
					accountId: row.accountId,
					balanceObjectCode: row.balanceObjectCode,
					currencyCode: row.currencyCode,
					balanceUnitCode: row.entityKey,
					cycleNumber: row.cycleNumber,
					pageNum: 1,
					pageSize: 10
				}
				this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0060', params, (res) => {
					this.detailList = res.returnData.rows
					this.detailTotal = res.returnData.totalCount
						// this.listLoading = false
					this.isShow = true // 结息交易列表
					this.showDetail = true // 结息明细
					this.showTransUint = false // 交易单元计息明细 三级表格
				})
			},
			// 查询列表 交易单元计息明细
			getTransUnitDetail(row) {
				let params = {
					externalIdentificationNo: this.interestList.externalIdentificationNo,
					idType: this.interestList.idType,
					idNumber: this.interestList.idNumber,
					interestStartDate: row.billingStartDate
				}
				params = Object.assign(params, row)
				this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0080', params, (res) => {
					this.transUnitList = res.returnData.rows
					this.uintTotal = res.returnData.totalCount
						// this.listLoading = false
					this.isShow = true // 结息交易列表
					this.showDetail = true // 结息明细
					this.showTransUint = true // 交易单元计息明细 三级表格
				})
			}
		}
	}
</script>

<style>

</style>
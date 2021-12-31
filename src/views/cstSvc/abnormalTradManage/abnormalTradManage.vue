<!-- 异常交易管理 -->
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
           
            <el-form-item class="cl_td" label="交易起始日期" prop="startDate">
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
            <el-form-item class="cl_td" label="交易结束日期" prop="endDate">
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
            <el-form-item class="cl_td" label="交易状态" prop="transBillingState">
           		<el-select v-model="queryForm.transBillingState" class="wd200">
                    <el-option 
                        v-for="(item, index) in transBillingStateOptions" 
                        :key="index" 
                        :label="item.detailDesc" 
                    	:value="item.codes" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="失败原因" prop="businessType">
               	<el-input v-model="queryForm.businessType" class="wd200" type="text" />
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="hadleSearch()">查询</el-button>
                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="reset()">重置</el-button>
            </div>
        </el-form>
	  	<el-table v-loading = "listLoading" :data="tableList" class="mbtm20" @current-change="handleCurrRowChange" @row-click="chooseCurrRow"
	  		fit highlight-current-row style="width: 100%;" border >
	        <el-table-column label="选择" width="80">
                <template slot-scope="scope">
                <el-radio v-model="curRowRadio" :label="scope.row.transDate">
                    <span class="el-radio__label"></span>
                </el-radio>
                </template>
        	</el-table-column>
	        <el-table-column  label="外部识别号/账户号" align="center">
        		<span v-if="tableList.externalIdentificationNo == null ">{{tableList.accountId}}</span>
				<span v-if="tableList.externalIdentificationNo != '' ">{{tableList.externalIdentificationNo}}</span>
				<span v-if="tableList.externalIdentificationNo == '0000000000000000000' ">{{tableList.accountId}}</span>
	        </el-table-column>
	        <el-table-column prop="transDate" label="交易日期 客户名称" align="center" />
	        <el-table-column prop="transCurrCode" label="交易币种" align="center" />
	        <el-table-column prop="transAmount" label="交易金额" align="center" />
	        <el-table-column prop="postingDate" label="入账处理日期" align="center" />
	        <el-table-column prop="postingCurrCode" label="入账币种" align="center" />
	        <el-table-column prop="postingAmt" label="入账金额" align="center" />
	        <el-table-column prop="eventNo" label="	事件编号" align="center" />
	        <el-table-column prop="transDesc" label="交易描述" align="center" />
	        <el-table-column prop="transBillingStateDesc" label="交易状态" align="center" />
	        <el-table-column prop="failureReason" label="失败原因" align="center" />
	        <el-table-column prop="transDate" label="客户名称" align="center" />
	        <el-table-column prop="" label="操作" align="center" >
	            <template slot-scope="{row,$index}">
	                <el-button size="mini" icon="el-icon-more" type="primary" @click="handleForceEntry(row)" >强制入账</el-button>
	                <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleReEntry(row)" >重入账</el-button>
	                <el-button size="mini" icon="el-icon-more" type="primary" @click="deleteItem(row)" >删除</el-button>
	                <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleDetail(row)" >查看</el-button>
	            </template>
	        </el-table-column>
      	</el-table>
      	<pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="getList" />
        <!--重入账-->
        <el-dialog title="重入账详情" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp" >
                <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                    <el-input v-model="tempUp.externalIdentificationNo" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="交易日期" prop="transDate">
                    <el-input v-model="tempUp.transDate" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="新外部识别号" prop="newExternalIdentificationNo">
                    <el-input v-model="tempUp.newExternalIdentificationNo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="新交易日期" prop="newTransDate">
                    <el-input v-model="tempUp.newTransDate" class="wd200" type="text" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleUp=false">取消</el-button>
                <el-button type="primary" @click="subUpData()">确定</el-button>
            </div>
        </el-dialog>
        <!--查看详情-->
        <el-dialog title="异常交易详情" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail" :rules="rulesDetail" :model="tempDetail" >
                <el-form-item class="cl_td" label="客户号" prop="customerNo">
                    <el-input v-model="tempDetail.customerNo" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="交易处理日期" prop="transDate">
                    <el-input v-model="tempDetail.processingDate" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易处理时间" prop="processingTime">
                    <el-input v-model="tempDetail.processingTime" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="实时余额账户代码" prop="accountId">
                    <el-input v-model="tempDetail.accountId" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="实时余额币种" prop="currencyCode">
                    <el-input v-model="tempDetail.currencyCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="事件编号" prop="eventNo">
                    <el-input v-model="tempDetail.eventNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                    <el-input v-model="tempDetail.externalIdentificationNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易日期" prop="transDate">
                    <el-input v-model="tempDetail.transDate" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易时间" prop="transTime">
                    <el-input v-model="tempDetail.transTime" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易货币小数位" prop="transCurrDecimal">
                    <el-input v-model="tempDetail.transCurrDecimal" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易币种" prop="transCurrCode">
                    <el-input v-model="tempDetail.transCurrCode" class="wd200" type="text" readonly/>
                </el-form-item>
             	<el-form-item class="cl_td" label="交易金额" prop="transAmount">
                    <el-input v-model="tempDetail.transAmount" class="wd200" type="text" readonly/>
                </el-form-item>
               	<el-form-item class="cl_td" label="交易描述" prop="transDesc">
                    <el-input v-model="tempDetail.transDesc" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="业务类型" prop="businessTypeCode">
                    <el-input v-model="tempDetail.businessTypeCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="运营模式" prop="operationMode">
                    <el-input v-model="tempDetail.operationMode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="实时余额货币小数位" prop="currDeciaml">
                    <el-input v-model="tempDetail.currDeciaml" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="实时余额当期本金入账金额" prop="currPrincipalBalance">
                    <el-input v-model="tempDetail.currPrincipalBalance" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="实时余额账单本金入账金额" prop="billPrincipalBalance">
                    <el-input v-model="tempDetail.billPrincipalBalance" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="实时余额当期利息入账金额" prop="currInterestBalance">
                    <el-input v-model="tempDetail.currInterestBalance" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="实时余额账单利息入账金额" prop="billInterestBalance">
                    <el-input v-model="tempDetail.billInterestBalance" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="实时余额当期费用入账金额" prop="currCostBalance">
                    <el-input v-model="tempDetail.currCostBalance" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="实时余额账单费用入账金额" prop="billCostBalance">
                    <el-input v-model="tempDetail.billCostBalance" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="入账币种小数位" prop="postingCurrDecimal">
                    <el-input v-model="tempDetail.postingCurrDecimal" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="入账币种" prop="postingCurrCode">
                    <el-input v-model="tempDetail.postingCurrCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="入账金额" prop="postingAmt">
                    <el-input v-model="tempDetail.postingAmt" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="入账转换汇率" prop="postingExchangeRate">
                    <el-input v-model="tempDetail.postingExchangeRate" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="清算币种小数位" prop="clearCurrDecimal">
                    <el-input v-model="tempDetail.clearCurrDecimal" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="清算币种" prop="clearCurrCode">
                    <el-input v-model="tempDetail.clearCurrCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="清算金额" prop="clearAmount">
                    <el-input v-model="tempDetail.clearAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="授权码" prop="authCode">
                    <el-input v-model="tempDetail.authCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="MCC" prop="mcc">
                    <el-input v-model="tempDetail.mcc" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易国家代码" prop="transCountryCde">
                    <el-input v-model="tempDetail.transCountryCde" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易城市代码" prop="transCityCde">
                    <el-input v-model="tempDetail.transCityCde" class="wd200" type="text" readonly/>
                </el-form-item>
                 <el-form-item class="cl_td" label="来源码" prop="sourceCde">
                    <el-input v-model="tempDetail.sourceCde" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="收单参考号" prop="acquireReferenceNumbr">
                    <el-input v-model="tempDetail.acquireReferenceNumbr" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="渠道代码" prop="channelCde">
                    <el-input v-model="tempDetail.channelCde" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="商户代码" prop="merchantCde">
                    <el-input v-model="tempDetail.merchantCde" class="wd200" type="text" readonly/>
                </el-form-item>
                 <el-form-item class="cl_td" label="交易对手姓名" prop="transOpponentName">
                    <el-input v-model="tempDetail.transOpponentName" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易对手银行联行号" prop="transOpponentBankNo">
                    <el-input v-model="tempDetail.transOpponentBankNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="全局交易流水号" prop="globalTransSerialNo">
                    <el-input v-model="tempDetail.globalTransSerialNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="原交易全局流水号" prop="oriGlobalTransSerialNo">
                    <el-input v-model="tempDetail.oriGlobalTransSerialNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易状态" prop="viewtransBillingState">
                    <el-select v-model="tempDetail.viewtransBillingState" class="wd200">
                    <el-option 
                        v-for="(item, index) in viewtransBillingStateOptions" 
                        :key="index" 
                        :label="item.label" 
                        :value="item.value"/>
                	</el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="拒绝来源" prop="viewrefuseSource">
                    <el-select v-model="tempDetail.viewrefuseSource" class="wd200">
                    <el-option 
                        v-for="(item, index) in viewrefuseSourceOptions" 
                        :key="index" 
                        :label="item.label" 
                        :value="item.value"/>
                	</el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="溢缴款金额" prop="overpayAmount">
                    <el-input v-model="tempDetail.overpayAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="溢缴款币种" prop="overpayCurrCode">
                    <el-input v-model="tempDetail.overpayCurrCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="原交易入账账户" prop="oriTransPostingAccountId">
                    <el-input v-model="tempDetail.oriTransPostingAccountId" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="原交易入账币种" prop="oriTransPostingCurrCode">
                    <el-input v-model="tempDetail.oriTransPostingCurrCode" class="wd200" type="text" readonly/>
                </el-form-item>
               	<el-form-item class="cl_td" label="失败原因" prop="failureReason">
                    <el-input v-model="tempDetail.failureReason" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="入账处理日期" prop="postingDate">
                    <el-input v-model="tempDetail.postingDate" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="入账处理时间" prop="postingTime">
                    <el-input v-model="tempDetail.postingTime" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="报文入账金额" prop="failureReason">
                    <el-input v-model="tempDetail.failureReason" class="wd200" type="text" readonly/>
                </el-form-item>
                
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleDetail=false">取消</el-button>
            </div>
        </el-dialog>
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
                pageNum: 1,
                pageSize: 10,
            },
            pickerOptionsStart: {}, //  起始时间
            pickerOptionsEnd:{}, // 结束时间
            listLoading: false,
           	tableList: [],
           	tableTotal: 0,
           	curRowRadio: {},
           	curRow: '',
           	//重入账
           	dialogFormVisibleUp: false,
           	tempUp: {},
           	dataFormUp: {},
           	rulesUp: {},
           	//详情
           	dialogFormVisibleDetail: false,
           	tempDetail: {},
           	dataFormDetail: {},
           	rulesDetail: {},
			// 下拉框
            idTypeList: [],
            transBillingStateOptions: [],//交易状态
            viewtransBillingStateOptions: [],//交易状态
            viewrefuseSourceOptions: [],//拒绝来源
        }
    },
    created() {}, 
    mounted() {
    	//证件类型
        this.getSelectDict('dic_certificateType').then((res) => {
            this.idTypeList = res
        })
        // 交易状态
        this.getSelectDict('dic_transBillingState').then((res) => {
            this.transBillingStateOptions = res
        })
        //查看详情交易状态
        this.getSelectDict('dic_transBillingState').then((res) => {
            this.viewtransBillingStateOptions = res
        })
        //拒绝来源
         this.getSelectDict('dic_transBillingState').then((res) => {
            this.viewrefuseSourceOptions = res
        })
        
        
    },
    methods: {
        // 重置
        reset() {
            this.queryForm = {}
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
        	if((this.queryForm.idNumber == "" || this.queryForm.idNumber == null || this.queryForm.idNumber == undefined) 
					&& (this.queryForm.idType == "" || this.queryForm.idType == null || this.queryForm.idType == undefined) && 
					(this.queryForm.externalIdentificationNo == "" || this.queryForm.externalIdentificationNo == null || this.queryForm.externalIdentificationNo == undefined)){
				 	  this.$message('请输入查询条件！');
				 	  return;
			}else{
				if(this.queryForm.idType){
					if(this.queryForm.idNumber == "" || this.queryForm.idNumber == null || this.queryForm.idNumber == undefined){
					  	this.$message('请核对证件号码！');
						return;
					}
					else{
						this.getList();
					}
				}else if(this.queryForm.idNumber){
					if(!this.queryForm.idType){
						this.$message('请核对证件类型！');
						return;
					}
					else{
						this.getList();
					}
				}
				else{
					this.getList();
				}
			}
        	this.getList()
        },
        // 获取列表
        getList() {
            this.listLoading = true
            let params = {
                _CART: "A",
                isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_transBillingState'],//查找数据字典所需参数
				transDict : ['transBillingState'],//翻译前后key
            }
            params = Object.assign(params,this.queryForm)
            this.getTableList('/nonfi/nonfinanceService/BSS.IQ.03.0020', params ,(res) => {
            	this.listLoading = false
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.tableList = res.returnData.rows
                        this.tableTotal = res.returnData.totalCount
                    } else {
                        this.tableList = []
                    }
                }
            })
        },
        // 单选 当前行
        handleCurrRowChange(row) {
            this.curRow = row
            this.curRowRadio = row.transDate
        },
        chooseCurrRow(row) {
            this.curRow = row
            this.curRowRadio = row.transDate
        },
        //强制入账
        handleForceEntry(row){
        	this.tempDel = Object.assign({}, row)
	        this.$confirm('确定强制入账?', '提示', {
	            confirmButtonText: '确定',
	            cancelButtonText: '取消',
	            type: 'warning'
	        }).then(() => { // 是
	            this.post('/nonfi/nonfinanceService/BSS.UP.03.0020', this.tempDel, (res) => {
                    if (res.returnCode == '000000') {
                          this.$notify({
                            title: 'Success',
                            message: '交易成功',
                            type: 'success',
                            duration: 2000
                        })
                        this.getList()
                    }
	            })
	        }).catch(() => { // 否   
				
	        });
        },
        //弹框显示重入账
        handleReEntry(row){
        	this.dialogFormVisibleUp = true
        	this.tempUp = Object.assign({}, row)
    	 	this.$nextTick(() => {
                this.$refs['dataFormUp'].clearValidate()
            })
        },
        //确定重入账
        subUpData(){
        	let upParams = {
				transId: this.tempUp.id,
				newExternalIdentificationNo: this.tempUp.newExternalIdentificationNo,
				externalIdentificationNo: this.tempUp.externalIdentificationNo,
				transDate: this.tempUp.newTransDate,
				type: "Y",
				transFlag:'R',
				idType: this.queryForm.idType,
				idNumber: this.queryForm.idNumber
			}
        	this.post('/nonfi/nonfinanceService/BSS.UP.03.0020', upParams, (res) => {
                if (res.returnCode == '000000') {
                    this.$notify({
                        title: 'Success',
                        message: '修改成功',
                        type: 'success',
                        duration: 2000
                    })
                    this.dialogFormVisibleUp = false
                    this.getList()
                }
            })
        },
        //删除
        deleteItem(row){
        	let deleParams = {
        		transId : row.id,
				externalIdentificationNo: row.externalIdentificationNo,
				externalIdentificationNoOri: row.externalIdentificationNo_ori,
				type: "P",
				idType: this.queryForm.idType,
				idNumber: this.queryForm.idNumber
			}
        	this.$confirm('确定删除?', '提示', {
	            confirmButtonText: '确定',
	            cancelButtonText: '取消',
	            type: 'warning'
	        }).then(() => { // 是
	        	this.post('/nonfi/nonfinanceService/BSS.UP.03.0020', deleParams, (res) => {
                    if (res.returnCode == '000000') {
                         this.$notify({
                            title: 'Success',
                            message: '删除成功',
                            type: 'success',
                            duration: 2000
                        })
                        this.getList()
                    }
                })
	        }).catch(() => { // 否   
				
	        });
        },
        //弹框显示查看详情
        handleDetail(row){
        	this.dialogFormVisibleDetail = true
        	this.tempDetail = Object.assign({}, row)
    	 	this.$nextTick(() => {
                this.$refs['dataFormDetail'].clearValidate()
            })
        },
    }   
}

</script>

<style>
</style>
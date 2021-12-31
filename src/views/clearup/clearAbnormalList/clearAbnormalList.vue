<!-- 拒绝交易管理 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                <el-input v-model="queryFormObj.externalIdentificationNo" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="文件名" prop="fileName">
                <el-input v-model="queryFormObj.fileName" class="wd200" type="text"/>
            </el-form-item>
            <div class="" style="display: inline-block;width: 74%;">
	            <el-form-item class="cl_td" label="开始日期" prop="startDate" style="display: inline-block;width: 36%;
    					margin-left: 13%;">
	                <el-date-picker 
	                    v-model="queryFormObj.startDate"
	                    class="wd200"
	                    type="date"
	                    placeholder="选择日期"
	                    format="yyyy 年 MM 月 dd 日"
	                    value-format="yyyyMMdd"/>
	            </el-form-item>
	           	<span >~</span>
	            <el-form-item class="" prop="endDate" style="width: 30%;display: inline-block;margin-left: 12px;">
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
	        <div class="cl_tr text_center">
	            <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" >查询</el-button>
	           <!-- <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate" >新增</el-button>-->
	        </div>
        </el-form>
        <div v-if="showDiv">
            <el-table v-loading = "listLoading1" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
                <el-table-column prop="externalIdentificationNo" label="外部识别号" align="center" />
                <el-table-column prop="fileName" label="文件名" align="center" />
                <el-table-column prop="purchaseDate" label="交易日期" align="center" />
                <el-table-column prop="sourceAmount" label="交易金额" align="center" />
                <el-table-column prop="rejectionReasonCode" label="拒绝原因" align="center" />
                <el-table-column prop="rejectionReasonDesc" label="拒绝原因描述" align="center" />
                <el-table-column prop="" label="操作" align="center" width = "350">
                    <template slot-scope="{row}">
                        <el-button size="mini" icon="el-icon-more" type="primary" @click="handleDetail(row)">查询详情</el-button>
          				<el-button size="mini" icon="el-icon-more" type="primary" @click="handleUpData(row)" 
      					v-if ="(tableList.repostingInd == '0') && (tableList.rejectionReasonCode =='002' || tableList.rejectionReasonCode =='004' || tableList.rejectionReasonCode =='006')">重入账</el-button>          
                    </template> 
                </el-table-column>
            </el-table>
            <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
        </div>
        <!--查询-->
        <el-dialog title="查看处理明细" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail" :model="tempDetail" :rules="rulesDetail">
	            <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
	                <el-input v-model="tempDetail.externalIdentificationNo" class="wd200" type="text" />
	            </el-form-item>
	            <el-form-item class="cl_td" label="交易金额" prop="sourceAmount">
	                <el-input v-model="tempDetail.sourceAmount" class="wd200" type="text"/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="交易日期" prop="purchaseDate">
	                <el-input v-model="tempDetail.purchaseDate" class="wd200" type="text" />
	            </el-form-item>
	            <el-form-item class="cl_td" label="交易时间" prop="purchaseTime">
	                <el-input v-model="tempDetail.purchaseTime" class="wd200" type="text"/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="顺序号" prop="sequenceNumber">
	                <el-input v-model="tempDetail.sequenceNumber" class="wd200" type="text" />
	            </el-form-item>
	            <el-form-item class="cl_td" label="渠道ID" prop="channelId">
	                <el-input v-model="tempDetail.channelId" class="wd200" type="text"/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="交易代码" prop="transactionProcessingCodeInfo">
	                <el-input v-model="tempDetail.transactionProcessingCodeInfo" class="wd200" type="text" />
	            </el-form-item>
	            <el-form-item class="cl_td" label="交易时间" prop="purchaseTime">
	                <el-input v-model="tempDetail.purchaseTime" class="wd200" type="text"/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="交易顺序号" prop="purchaseNumber">
	                <el-input v-model="tempDetail.purchaseNumber" class="wd200" type="text" />
	            </el-form-item>
	            <el-form-item class="cl_td" label="交易币种" prop="sourceCurrencyCode">
	                <el-input v-model="tempDetail.sourceCurrencyCode" class="wd200" type="text"/>
	            </el-form-item>
             	<el-form-item class="cl_td" label="收单机构参考号" prop="acquirerReferenceNumber">
	                <el-input v-model="tempDetail.acquirerReferenceNumber" class="wd200" type="text" />
	            </el-form-item>
	            <el-form-item class="cl_td" label="MCC" prop="merchantCategoryCode">
	                <el-input v-model="tempDetail.merchantCategoryCode" class="wd200" type="text"/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="国家代码" prop="merchantCountryCode">
	                <el-input v-model="tempDetail.merchantCountryCode" class="wd200" type="text" />
	            </el-form-item>
	            <el-form-item class="cl_td" label="服务点输入方式码" prop="posEntryMode">
	                <el-input v-model="tempDetail.posEntryMode" class="wd200" type="text"/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="终端读取能力取值" prop="posTerminalCapability">
	                <el-input v-model="tempDetail.posTerminalCapability" class="wd200" type="text" />
	            </el-form-item>
	            <el-form-item class="cl_td" label="卡序列号" prop="cardSequenceNumber">
	                <el-input v-model="tempDetail.cardSequenceNumber" class="wd200" type="text"/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="受理机构标识码" prop="acquirersBusinessId">
	                <el-input v-model="tempDetail.acquirersBusinessId" class="wd200" type="text"/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="授权成功代码" prop="authorizationCode">
	                <el-input v-model="tempDetail.authorizationCode" class="wd200" type="text" />
	            </el-form-item>
	            <el-form-item class="cl_td" label="受卡机终端标识码" prop="terminalId">
	                <el-input v-model="tempDetail.terminalId" class="wd200" type="text"/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="商户代码" prop="cardAcceptorId">
	                <el-input v-model="tempDetail.cardAcceptorId" class="wd200" type="text"/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="州代码" prop="merchantState">
	                <el-input v-model="tempDetail.merchantState" class="wd200" type="text" />
	            </el-form-item>
	            <el-form-item class="cl_td" label="城市代码" prop="merchantCity">
	                <el-input v-model="tempDetail.merchantCity" class="wd200" type="text"/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="商户名称" prop="merchantName">
	                <el-input v-model="tempDetail.merchantName" class="wd200" type="text"/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="商户ZIP码" prop="merchantZipCode">
	                <el-input v-model="tempDetail.merchantZipCode" class="wd200" type="text" />
	            </el-form-item>
	            <el-form-item class="cl_td" label="交易描述" prop="transactionDesc">
	                <el-input v-model="tempDetail.transactionDesc" class="wd200" type="text"/>
	            </el-form-item>
	           	<el-form-item class="cl_td" label="文件名" prop="merchantName">
	                <el-input v-model="tempDetail.fileName" class="wd200" type="text"/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="拒绝原因码" prop="rejectionReasonCode">
	                <el-input v-model="tempDetail.rejectionReasonCode" class="wd200" type="text" />
	            </el-form-item>
	            <el-form-item class="cl_td" label="拒绝原因描述" prop="rejectionReasonDesc">
	                <el-input v-model="tempDetail.rejectionReasonDesc" class="wd200" type="text"/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="交易保留日期" prop="transRetentionDate">
	                <el-input v-model="tempDetail.transRetentionDate" class="wd200" type="text"/>
	            </el-form-item>
	        </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleDetail = false">取消</el-button>
            </div>
        </el-dialog>
        <!--修改-->
        <el-dialog title="维护清算场景" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :model="tempUp" :rules="dataRulesUp">
	            <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
	                <el-input v-model="tempUp.externalIdentificationNo" class="wd200" type="text" />
	            </el-form-item>
	            <el-form-item class="cl_td" label="交易金额" prop="sourceAmount">
	                <el-input v-model="tempUp.sourceAmount" class="wd200" type="text"/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="交易日期" prop="purchaseDate">
	                <el-input v-model="tempUp.purchaseDate" class="wd200" type="text" />
	            </el-form-item>
	            <el-form-item class="cl_td" label="交易时间" prop="purchaseTime">
	                <el-input v-model="tempUp.purchaseTime" class="wd200" type="text"/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="顺序号" prop="sequenceNumber">
	                <el-input v-model="tempUp.sequenceNumber" class="wd200" type="text" />
	            </el-form-item>
	            <el-form-item class="cl_td" label="渠道ID" prop="channelId">
	                <el-input v-model="tempUp.channelId" class="wd200" type="text"/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="交易代码" prop="transactionProcessingCodeInfo">
	                <el-input v-model="tempUp.transactionProcessingCodeInfo" class="wd200" type="text" />
	            </el-form-item>
	            <el-form-item class="cl_td" label="交易时间" prop="purchaseTime">
	                <el-input v-model="tempUp.purchaseTime" class="wd200" type="text"/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="交易顺序号" prop="purchaseNumber">
	                <el-input v-model="tempUp.purchaseNumber" class="wd200" type="text" />
	            </el-form-item>
	            <el-form-item class="cl_td" label="交易币种" prop="sourceCurrencyCode">
	                <el-input v-model="tempUp.sourceCurrencyCode" class="wd200" type="text"/>
	            </el-form-item>
             	<el-form-item class="cl_td" label="收单机构参考号" prop="acquirerReferenceNumber">
	                <el-input v-model="tempUp.acquirerReferenceNumber" class="wd200" type="text" />
	            </el-form-item>
	            <el-form-item class="cl_td" label="MCC" prop="merchantCategoryCode">
	                <el-input v-model="tempUp.merchantCategoryCode" class="wd200" type="text"/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="国家代码" prop="merchantCountryCode">
	                <el-input v-model="tempUp.merchantCountryCode" class="wd200" type="text" />
	            </el-form-item>
	            <el-form-item class="cl_td" label="服务点输入方式码" prop="posEntryMode">
	                <el-input v-model="tempUp.posEntryMode" class="wd200" type="text"/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="终端读取能力取值" prop="posTerminalCapability">
	                <el-input v-model="tempUp.posTerminalCapability" class="wd200" type="text" />
	            </el-form-item>
	            <el-form-item class="cl_td" label="卡序列号" prop="cardSequenceNumber">
	                <el-input v-model="tempUp.cardSequenceNumber" class="wd200" type="text"/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="受理机构标识码" prop="acquirersBusinessId">
	                <el-input v-model="tempUp.acquirersBusinessId" class="wd200" type="text"/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="授权成功代码" prop="authorizationCode">
	                <el-input v-model="tempUp.authorizationCode" class="wd200" type="text" />
	            </el-form-item>
	            <el-form-item class="cl_td" label="受卡机终端标识码" prop="terminalId">
	                <el-input v-model="tempUp.terminalId" class="wd200" type="text"/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="商户代码" prop="cardAcceptorId">
	                <el-input v-model="tempUp.cardAcceptorId" class="wd200" type="text"/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="州代码" prop="merchantState">
	                <el-input v-model="tempUp.merchantState" class="wd200" type="text" />
	            </el-form-item>
	            <el-form-item class="cl_td" label="城市代码" prop="merchantCity">
	                <el-input v-model="tempUp.merchantCity" class="wd200" type="text"/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="商户名称" prop="merchantName">
	                <el-input v-model="tempUp.merchantName" class="wd200" type="text"/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="商户ZIP码" prop="merchantZipCode">
	                <el-input v-model="tempUp.merchantZipCode" class="wd200" type="text" />
	            </el-form-item>
	            <el-form-item class="cl_td" label="交易描述" prop="transactionDesc">
	                <el-input v-model="tempUp.transactionDesc" class="wd200" type="text"/>
	            </el-form-item>
	           	<el-form-item class="cl_td" label="文件名" prop="merchantName">
	                <el-input v-model="tempUp.fileName" class="wd200" type="text"/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="拒绝原因码" prop="rejectionReasonCode">
	                <el-input v-model="tempUp.rejectionReasonCode" class="wd200" type="text" />
	            </el-form-item>
	            <el-form-item class="cl_td" label="拒绝原因描述" prop="rejectionReasonDesc">
	                <el-input v-model="tempUp.rejectionReasonDesc" class="wd200" type="text"/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="交易保留日期" prop="transRetentionDate">
	                <el-input v-model="tempUp.transRetentionDate" class="wd200" type="text"/>
	            </el-form-item>
	        </el-form>
            <div slot="footer" class="dialog-footer">
            	 <el-button type="primary" @click="subUpData()">确认</el-button>
                <el-button type="primary" @click="dialogFormVisibleDetail = false">取消</el-button>
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
                btnAuthStr: '',
                templateRadio: false,
                logininfo: '',
                // 列表
                showDiv: false,
                queryFormObj: {
                    pageNum: 1,
                    pageSize:10,
                },
                listLoading1: false,
                queryFormRef: {},
                queryFormRules: {},      
                tableList: [],
                tableTotal: 0,
                // 下拉框
                channelIdOptions: [],//渠道
                //详情
                dialogFormVisibleDetail: false,
                dataFormDetail: {},
                tempDetail: [],
                rulesDetail: {},
                detailPage: {
                    pageNum: 1,
                    pageSize:10,
                },
                
                tableListDetail:[],
                detailTotal: 0,
                detailListLoading: false,
                //修改
                dialogFormVisibleUp: false,
                dataFormUp: {},
                tempUp: {},
                dataRulesUp: {},
            }
        },
        created() {
            
        },
        mounted() {
            this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))  //获取用户登录权限
           	//渠道
            this.getSelectDict( "/beta/betaService/MIS.IQ.01.0001").then(res => {
                this.channelIdOptions = res
            })
        },
      methods: {
        // 列表
        getList() {
            this.listLoading1 = true
            this.showDiv = true
            let params = {
                pageNum: this.queryFormObj.pageNum,
                pageSize: this.queryFormObj.pageSize,
            }  
            this.getTableList('/nonfi/nonfinanceService/MIS.IQ.02.0002', params,(res) => {
                 this.listLoading1 = false
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.tableList = res.returnData.rows
                        this.tableTotal = res.returnData.totalCount
                    }
                }
            })
        },
        handleSearch() {
            this.getList()
        },
        //显示修改弹框
        handleUpData(row) {
        	this.dialogFormVisibleUp = true
        	this.tempUp = row
        	if(row.transactionProcessingCode == '40') {
				//40消费QFJ400001
				this.tempUp.transactionProcessingCodeInfo = '消费';
			}else if(row.transactionProcessingCode == '43') {
				//43消费贷调QFJ400002
				this.tempUp.transactionProcessingCodeInfo = '消费贷调';
			}else if(row.transactionProcessingCode == '30') {
				//30取现QFJ400003
				this.tempUp.transactionProcessingCodeInfo = '取现';
			}else if(row.transactionProcessingCode == '33') {
				//33取现贷调QFJ400004
				this.tempUp.transactionProcessingCodeInfo = '取现贷调';
			}else if(row.transactionProcessingCode == '20') {
				//20还款QFJ400005
				this.tempUp.transactionProcessingCodeInfo = '还款';
			}else if(row.transactionProcessingCode == '27') {
				//27还款还原QFJ400006,
				this.tempUp.transactionProcessingCodeInfo = '还款还原';
			}else if(row.transactionProcessingCode == '41') {
				//41退货QFJ400007,
				this.tempUp.transactionProcessingCodeInfo = '退货';
			}
            
            this.$nextTick(() => {
                this.$refs['dataFormUp'].clearValidate()
            })
        }, 
        subUpData(){
        	this.tempUp.repostingInd = '1';
            this.post('/nonfi/nonfinanceService/MIS.IQ.02.0002', this.tempUp, (response) => {
                this.dialogFormVisibleAdd = false
                this.$notify({
                    title: 'Success',
                    message: '修改成功',
                    type: 'success',
                    duration: 2000
                }) 
                this.getList()
                this.dialogFormVisibleUp = false
            })
        },
        //显示详情弹框
        handleDetail(row) {
            this.dialogFormVisibleDetail = true
            this.tempDateil = row
            if(row.transactionProcessingCode == '40') {
				//40消费QFJ400001
				this.tempDateil.transactionProcessingCodeInfo = '消费';
			}else if(row.transactionProcessingCode == '43') {
				//43消费贷调QFJ400002
				this.tempDateil.transactionProcessingCodeInfo = '消费贷调';
			}else if(row.transactionProcessingCode == '30') {
				//30取现QFJ400003
				this.tempDateil.transactionProcessingCodeInfo = '取现';
			}else if(row.transactionProcessingCode == '33') {
				//33取现贷调QFJ400004
				this.tempDateil.transactionProcessingCodeInfo = '取现贷调';
			}else if(row.transactionProcessingCode == '20') {
				//20还款QFJ400005
				this.tempDateil.transactionProcessingCodeInfo = '还款';
			}else if(row.transactionProcessingCode == '27') {
				//27还款还原QFJ400006,
				this.tempDateil.transactionProcessingCodeInfo = '还款还原';
			}else if(row.transactionProcessingCode == '41') {
				//41退货QFJ400007,
				this.tempDateil.transactionProcessingCodeInfo = '退货';
			}
            this.$nextTick(() => {
                this.$refs['dataFormDetail'].clearValidate()
            })
        }, 
        
    }
}
</script>
<style>
</style>

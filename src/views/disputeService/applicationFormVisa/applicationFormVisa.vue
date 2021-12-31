<!-- VISA调单申请查询及维护 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
           <el-form-item class="cl_td" label="证件类型" prop="idType">
                <el-select v-model="queryFormObj.idType" class="wd200" @change="idTypeListChange($event)">
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
	 	</el-form>
        <div class="cl_tr text_center">
            <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" >查询</el-button>
            <el-button size="medium" icon="el-icon-search" type="primary" @click="rest()" >重置</el-button>
        </div>
       	<div v-if="showList">
   		 	<el-table v-loading = "listLoading" :data="tableList" class="mbtm20" fit highlight-current-row style="width: 100%;" border>
                <el-table-column prop="customerNo" label="客户号" align="center" width="200"/>
                <el-table-column prop="transactionCode" label="交易代码"  align="center" width="200"/>
                <el-table-column prop="externalIdentificationNo" label="外部识别号" align="center" width="200"/>
                <el-table-column prop="acquireReferenceNumbr" label="收单参考编号"  align="center" width="200"/>
                <el-table-column prop="acquirerBusinessId" label="收单业务编号"  align="center" width="200"/>
            	<el-table-column prop="gmtDate" label="购买日期"  align="center" width="200"/>
                <el-table-column prop="transAmt" label="交易金额"  align="center" width="200"/>
                <el-table-column prop="transCurrCode" label="交易货币代码"  align="center" width="200"/>
                <el-table-column prop="" label="操作" align="center" >
                    <template slot-scope="{row}">
                        <el-button size="mini" icon="el-icon-info" type="primary" @click="handleDetail(row)">查询</el-button>
                        <el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleUpdate(row)">修改</el-button><!--v-show="updBtnFlag"-->
                    </template> 
                </el-table-column>
            </el-table>
            <pagination v-show="tableTotal1>0" :total="tableTotal1" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getListTable" />
       	</div>
       	<!--修改-->
        <el-dialog title="MC调单申请维护页面" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp" >
                <el-form-item class="cl_td" label="交易代码" prop="transactionCode">
                    <el-input v-model="tempUp.transactionCode" class="wd200" type="text" readonly/>
                </el-form-item>
               	<el-form-item class="cl_td" label="客户号" prop="customerNo">
                    <el-input v-model="tempUp.customerNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                    <el-input v-model="tempUp.externalIdentificationNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="收单参考编号" prop="acquireReferenceNumbr">
                    <el-input v-model="tempUp.acquireReferenceNumbr" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="收单业务编号" prop="acquirerBusinessId">
                    <el-input v-model="tempUp.acquirerBusinessId" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="购买日期" prop="gmtDate">
                    <el-input v-model="tempUp.gmtDate" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易金额" prop="transAmt">
                    <el-input v-model="tempUp.transAmt" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易货币代码" prop="acquirerBusinessId">
                    <el-input v-model="tempUp.transCurrCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="商家名称" prop="merchantName">
                    <el-input v-model="tempUp.merchantName" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="城市" prop="city">
                    <el-input v-model="tempUp.city" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="国家代码" prop="countryCode">
                    <el-input v-model="tempUp.countryCode" class="wd200" type="text" readonly/>
                </el-form-item>
               	<el-form-item class="cl_td" label="MCC" prop="mcc">
                    <el-input v-model="tempUp.mcc" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="邮政编码" prop="merchantZip">
                    <el-input v-model="tempUp.merchantZip" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="商户国家╱省代码" prop="stateCode">
                    <el-input v-model="tempUpail.stateCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="发卡机构控制号" prop="issuerControlNumber">
                    <el-input v-model="tempUp.issuerControlNumber" class="wd200" type="text" maxlength="9"/>
                </el-form-item>
                <el-form-item class="cl_td" label="请求原因代码" prop="requestReasonCode">
                    <el-input v-model="tempUp.requestReasonCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="结算标志" prop="forwdInstitIdCode">
                    <el-input v-model="tempUp.forwdInstitIdCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="检索参考号" prop="settlementFlag">
                    <el-input v-model="tempUp.settlementFlag" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="国家偿还费" prop="nationalReimburseFee">
                    <el-input v-model="tempUp.nationalReimburseFee" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="账户种类" prop="accountSelection">
                    <el-input v-model="tempUp.accountSelection" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="调单请求ID" prop="retrievalRequestId">
                    <el-input v-model="tempUp.retrievalRequestId" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="中央处理日期" prop="settlementDate">
                    <el-input v-model="tempUp.settlementDate" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="偿还属性" prop="reimburseAttribute">
                    <el-input v-model="tempUp.reimburseAttribute" class="wd200" type="text" readonly/>
                </el-form-item>
               	<el-form-item class="cl_td" label="传真号码" prop="faxNumber">
                    <el-input v-model="tempUp.faxNumber" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="请求完成方式" prop="requestedFulfllmentMethod">
                	<el-select v-model="tempUp.requestedFulfllmentMethod" class="wd200">
                        <el-option
                            v-for="(item, index ) in requestedFulfllmentMethodOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"/>
                    </el-select>
                </el-form-item>
               	<el-form-item class="cl_td" label="已建立的完成方式" prop="establishedFulfllmentMethod">
                    <el-select v-model="tempUp.establishedFulfllmentMethod" class="wd200">
                        <el-option
                            v-for="(item, index ) in establishedFulfllmentMethodOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"/>
                    </el-select>
               	</el-form-item>
                <el-form-item class="cl_td" label="发卡机构清算币种" prop="clearCurrCode">
                    <el-input v-model="tempUp.clearCurrCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="发卡机构清算金额" prop="clearAmount">
                    <el-input v-model="tempUp.clearAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易ID" prop="transIdentifier">
                    <el-input v-model="tempUp.transIdentifier" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="原交易全局流水号" prop="oldGlobalSerialNumbrntIndicator">
                    <el-input v-model="tempUp.oldGlobalSerialNumbr" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="调单状态" prop="retrievalStatus">
                	<el-select v-model="tempUp.retrievalStatus" class="wd200">
                        <el-option
                            v-for="(item, index ) in retrievalStatusOptions"
                            :key="index"
                           	:label="item.detailDesc"
                            :value="item.codes"/>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleUp = false">取消</el-button>
                <el-button type="primary" @click="subUpData()">确定</el-button>
            </div>
        </el-dialog>
        <!--查询-->
        <el-dialog title="查询MC调单申请页面" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail" :rules="rulesDetail" :model="tempDetail" >
                <el-form-item class="cl_td" label="交易代码" prop="transactionCode">
                    <el-input v-model="tempDetail.transactionCode" class="wd200" type="text" readonly/>
                </el-form-item>
               	<el-form-item class="cl_td" label="客户号" prop="customerNo">
                    <el-input v-model="tempDetail.customerNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                    <el-input v-model="tempDetail.externalIdentificationNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="收单参考编号" prop="acquireReferenceNumbr">
                    <el-input v-model="tempDetail.acquireReferenceNumbr" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="收单业务编号" prop="acquirerBusinessId">
                    <el-input v-model="tempDetail.acquirerBusinessId" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="购买日期" prop="gmtDate">
                    <el-input v-model="tempDetail.gmtDate" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易金额" prop="transAmt">
                    <el-input v-model="tempDetail.transAmt" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易货币代码" prop="acquirerBusinessId">
                    <el-input v-model="tempDetail.transCurrCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="商家名称" prop="merchantName">
                    <el-input v-model="tempDetail.merchantName" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="城市" prop="city">
                    <el-input v-model="tempDetail.city" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="国家代码" prop="countryCode">
                    <el-input v-model="tempDetail.countryCode" class="wd200" type="text" readonly/>
                </el-form-item>
               	<el-form-item class="cl_td" label="MCC" prop="mcc">
                    <el-input v-model="tempDetail.mcc" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="邮政编码" prop="merchantZip">
                    <el-input v-model="tempDetail.merchantZip" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="商户国家╱省代码" prop="stateCode">
                    <el-input v-model="tempDetail.stateCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="发卡机构控制号" prop="issuerControlNumber">
                    <el-input v-model="tempDetail.issuerControlNumber" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="请求原因代码" prop="requestReasonCode">
                    <el-input v-model="tempDetail.requestReasonCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="结算标志" prop="forwdInstitIdCode">
                    <el-input v-model="tempDetail.forwdInstitIdCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="检索参考号" prop="settlementFlag">
                    <el-input v-model="tempDetail.settlementFlag" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="国家偿还费" prop="nationalReimburseFee">
                    <el-input v-model="tempDetail.nationalReimburseFee" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="账户种类" prop="accountSelection">
                    <el-input v-model="tempDetail.accountSelection" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="调单请求ID" prop="retrievalRequestId">
                    <el-input v-model="tempDetail.retrievalRequestId" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="中央处理日期" prop="settlementDate">
                    <el-input v-model="tempDetail.settlementDate" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="偿还属性" prop="reimburseAttribute">
                    <el-input v-model="tempDetail.reimburseAttribute" class="wd200" type="text" readonly/>
                </el-form-item>
               	<el-form-item class="cl_td" label="传真号码" prop="faxNumber">
                    <el-input v-model="tempDetail.faxNumber" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="请求完成方式" prop="requestedFulfllmentMethod">
                	<el-select v-model="tempDetail.requestedFulfllmentMethod" class="wd200">
                        <el-option
                            v-for="(item, index ) in requestedFulfllmentMethodOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"/>
                    </el-select>
                </el-form-item>
               	<el-form-item class="cl_td" label="已建立的完成方式" prop="establishedFulfllmentMethod">
                    <el-select v-model="tempDetail.establishedFulfllmentMethod" class="wd200">
                        <el-option
                            v-for="(item, index ) in establishedFulfllmentMethodOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"/>
                    </el-select>
               	</el-form-item>
                <el-form-item class="cl_td" label="发卡机构清算币种" prop="clearCurrCode">
                    <el-input v-model="tempDetail.clearCurrCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="发卡机构清算金额" prop="clearAmount">
                    <el-input v-model="tempDetail.clearAmount" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易ID" prop="transIdentifier">
                    <el-input v-model="tempDetail.transIdentifier" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="原交易全局流水号" prop="oldGlobalSerialNumbrntIndicator">
                    <el-input v-model="tempDetail.oldGlobalSerialNumbr" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="调单状态" prop="retrievalStatus">
                	<el-select v-model="tempDetail.retrievalStatus" class="wd200">
                        <el-option
                            v-for="(item, index ) in retrievalStatusOptions"
                            :key="index"
                           	:label="item.detailDesc"
                            :value="item.codes"/>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleDetail = false">取消</el-button>
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
                queryFormObj: {
                    pageNum: 1,
                    pageSize:10,
                },
                queryFormRef: {},
                queryFormRules: {},
                showList: false,
                listLoading: false,
                tableList: [],
                tableTotal: 0,
                //修改
                dialogFormVisibleUp: false,
                dataFormUp: {},
                rulesUp: {},
                tempUp: [],
                //查询详情
                dialogFormVisibleDetail: false,
                dataFormDetail: {},
                rulesDetail: {},
                tempDetail: [],
                // 下拉框
                idTypeList: [],//证件类型
                messageReasonCodeOptions: [],//消息原因代码
                requestedFulfllmentMethodOptions: [],//请求完成方式
       			establishedFulfllmentMethodOptions: [],//已建立的完成方式
            }
        },
        created() {
            
        },
        mounted() {
            this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))  //获取用户登录权限
           	//证件类型
            this.getSelectDict( "dic_busiCardCertificateType").then(res => {
                this.idTypeList = res
            })
            //请求完成方式
           	this.getSelectDict( "dic_request").then(res => {
                this.requestedFulfllmentMethodOptions = res
            })
           	//已建立的完成方式
           	this.getSelectDict( "dic_request").then(res => {
                this.establishedFulfllmentMethodOptions = res
            })
       		//调但状态
           	this.getSelectDict( "dic_protestStatus").then(res => {
                this.retrievalStatusOptions = res
            })
		},
      	methods: {
	      	idTypeListChange(row){
	      		this.idTypeListData = row
	      		this.getCustomerType()
	      	},
      	 //客户类型
      	 getCustomerType(){
            this.getSelectDict( "dic_busiCardCustomerType").then(res => {
            	if(this.idTypeListData == '7'){
            		this.queryFormObj.customerType = '3'
            		this.customerTypeOptions = res
            		
            	}
                
            })
      	},
      	//查询
      	handleSearch(){
            if((this.queryFormObj.idNumber != "" && this.queryFormObj.idNumber != null && this.queryFormObj.idNumber != undefined) && 
                (this.queryFormObj.idType == "" || this.queryFormObj.idType == null || this.queryFormObj.idType == undefined) ){
                this.$message('证件类型不能为空！');
                return;
            }
            if((this.queryFormObj.idType != "" && this.queryFormObj.idType != null && this.queryFormObj.idType != undefined)){
                this.queryFormObj.idTyp = this.idType;
                if(this.queryFormObj.idNumber != "" && this.queryFormObj.idNumber != null && this.queryFormObj.idNumber != undefined){   
                    this.queryFormObj.idNo = this.queryFormObj.idNumber;
                }else{
                    this.$message('证件号码不能为空！');
                    return;
                }
            }
            if ((this.queryFormObj.idNumber == "" || this.queryFormObj.idNumber == null || this.queryFormObj.idNumber == undefined) && 
                (this.queryFormObj.idType == "" || this.queryFormObj.idType == null || this.queryFormObj.idType == undefined) &&
                (this.queryFormObj.externalIdentificationNo == "" || this.queryFormObj.externalIdentificationNo == null || 
                this.queryFormObj.externalIdentificationNo == undefined)){
                this.$message('请输入条件进行查询');
                return;
            }else if((this.queryFormObj.idNumber) && (this.queryFormObj.externalIdentificationNo)){
                this.$message('证件号和外部识别号只能选择输入一种！');
                return;
            }
            this.getList()
        },
        getList() {
            this.showList = true
            this.listLoading = true
            this.getTableList('/nonfi/nonfinanceService/ISS.IQ.01.0160', this.queryFormObj ,(res) => {
                this.listLoading = false
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.tableList = res.returnData.rows
                        this.tableTotal = res.returnData.totalCount
                    }
                }
            })
        },
        //修改显示弹框
        handleUpdate(row){
        	if(row.retrievalStatus == "C" || row.retrievalStatus == "O"){
				this.$message("改调单申请不允许修改");
				return;
			}
        	this.dialogFormVisibleUp = true
            this.tempUp = Object.assign({}, row)
			this.$nextTick(() => {
                this.$refs['dataFormUp'].clearValidate()
            })
        },
      	//修改保存
       	subUpData(){
       		if(this.tempUp.retrievalStatus == null || this.tempUp.retrievalStatus == "" ){
		 		this.$message('请输入请求原因代码')
				return;
			}else if(this.tempUp.retrievalStatus == null || this.tempUp.retrievalStatus == "" ||
				this.tempUp.retrievalStatus == 'N'){
       			this.$message('请选择调单状态')
       		
       		}else{
	       		this.post('/nonfi/nonfinanceService/ISS.IQ.01.0170', this.tempUp, (response) => {
	                this.$notify({
	                    title: 'Success',
	                    message: '保存成功',
	                    type: 'success',
	                    duration: 2000
	                }) 
	                this.getList()
	                this.dialogFormVisibleUp = false
	            })
       		}
	    },
	   	//查询显示弹框
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

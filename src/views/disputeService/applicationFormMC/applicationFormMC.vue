<!-- MC调单申请查询及维护 -->
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
                <el-table-column prop="mti" label="MTI"  align="center" width="200"/>
                <el-table-column prop="externalIdentificationNo" label="外部识别号" align="center" width="200"/>
                <el-table-column prop="processingCode" label="处理码"  align="center" width="200"/>
                <el-table-column prop="dateAndTime" label="处理日期时间"  align="center" width="200"/>
                <el-table-column prop="" label="操作" align="center" >
                    <template slot-scope="{row}">
                        <el-button size="mini" icon="el-icon-info" type="primary" @click="handleDetail(row)" >查询</el-button>
                        <el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleUpdate(row)">修改</el-button><!--v-show="updBtnFlag"-->
                    </template> 
                </el-table-column>
            </el-table>
            <pagination v-show="tableTotal1>0" :total="tableTotal1" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getListTable" />
       	</div>
       	<!--修改-->
        <el-dialog title="MC调单申请维护页面" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp" >
                <el-form-item class="cl_td" label="MTI" prop="mti">
                    <el-input v-model="tempUp.mti" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                    <el-input v-model="tempUp.externalIdentificationNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="客户号" prop="customerNo">
                    <el-input v-model="tempUp.customerNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="处理码" prop="processingCode">
                    <el-input v-model="tempUp.processingCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="日期时间" prop="dateAndTime">
                    <el-input v-model="tempUp.dateAndTime" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="POS进入模式" prop="posEntryMode">
                    <el-input v-model="tempUp.posEntryMode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="功能码" prop="functionCode">
                    <el-input v-model="tempUp.functionCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="消息原因代码" prop="messageReasonCode">
                	 <el-select v-model="tempUp.messageReasonCode" class="wd200">
                        <el-option
                            v-for="(item, index ) in messageReasonCodeOptions"
                            :key="index"
                            :label="item.modeName"
                            :value="item.operationMode"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="MCC" prop="mcc">
                    <el-input v-model="tempUp.mcc" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易金额" prop="transAmt">
                    <el-input v-model="tempUp.transAmt" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="原始金额" prop="originalAmountReconciliation">
                    <el-input v-model="tempUp.originalAmountReconciliation" class="wd200" type="text" maxlength="12"/>
                </el-form-item>
                <el-form-item class="cl_td" label="收单机构参考号" prop="acquireReferenceNumbr">
                    <el-input v-model="tempUp.acquireReferenceNumbr" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="受理机构标识码" prop="acqId">
                    <el-input v-model="tempUp.acqId" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="转发机构id代码" prop="forwdInstitIdCode">
                    <el-input v-model="tempUp.forwdInstitIdCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="检索参考号" prop="retrievalReferNum">
                    <el-input v-model="tempUp.retrievalReferNum" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="授权成功码" prop="authApprovalCde">
                    <el-input v-model="tempUp.authApprovalCde" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="受卡机终端标识码" prop="terminateIdentNo">
                    <el-input v-model="tempUp.terminateIdentNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="商户代码" prop="merchantCde">
                    <el-input v-model="tempUp.merchantCde" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="持卡人姓名/地址" prop="cardAcceptorName">
                    <el-input v-model="tempUp.cardAcceptorName" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="附加数据" prop="additionalData">
                    <el-input v-model="tempUp.additionalData" class="wd200" type="text"/>
                </el-form-item>
               	<el-form-item class="cl_td" label="终端类型" prop="terminalType">
                    <el-input v-model="tempUp.terminalType" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="撤销标志" prop="messageReversalIndicator">
                    <el-input v-model="tempUp.messageReversalIndicator" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="电子商务安全等级指标" prop="electronicCommerceSecurityLevelIndicator">
                    <el-input v-model="tempUp.electronicCommerceSecurityLevelIndicator" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="币种小数位" prop="currencyExponents">
                    <el-input v-model="tempUp.currencyExponents" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易币种" prop="currencyCodesAmountsOriginal">
                    <el-input v-model="tempUp.currencyCodesAmountsOriginal" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="业务活动" prop="businessActivity">
                    <el-input v-model="tempUp.businessActivity" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="结算指标" prop="settlementIndicator">
                    <el-input v-model="tempUp.settlementIndicator" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="主卡id" prop="mastercardAssignedId">
                    <el-input v-model="tempUp.mastercardAssignedId" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="检索文档码" prop="retrievalDocumentCode">
                    <el-input v-model="tempUp.retrievalDocumentCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="S1排除请求代码" prop="exclusionRequestCode">
                    <el-input v-model="tempUp.exclusionRequestCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="文件标识" prop="documentationIndicator">
                    <el-input v-model="tempUp.documentationIndicator" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="额外金额" prop="amountsAdditional">
                    <el-input v-model="tempUp.amountsAdditional" class="wd200" type="text"  maxlength="120"/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易生命周期id" prop="transLifeCycleId">
                    <el-input v-model="tempUp.transLifeCycleId" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="报文编号" prop="messageNumber">
                    <el-input v-model="tempUp.messageNumber" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易发起机构" prop="transOriginInstit">
                    <el-input v-model="tempUp.transOriginInstit" class="wd200" type="text" readonly/>
                </el-form-item>
               	<el-form-item class="cl_td" label="发卡机构参考数据" prop="cardIssuerReferenceData">
                    <el-input v-model="tempUp.cardIssuerReferenceData" class="wd200" type="text" maxlength="10"/>
                </el-form-item>
                <el-form-item class="cl_td" label="原交易全局流水号" prop="oldGlobalSerialNumbr">
                    <el-input v-model="tempUp.oldGlobalSerialNumbr" class="wd200" type="text" readonly/>
                </el-form-item>
               	<el-form-item class="cl_td" label="调单状态" prop="retrievalStatus" >
                    <el-select v-model="tempUp.retrievalStatus" class="wd200">
                        <el-option
                            v-for="(item, index ) in retrievalStatusOptions"
                            :key="index"
                            :label="item.modeName"
                            :value="item.operationMode"/>
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
                <el-form-item class="cl_td" label="MTI" prop="mti">
                    <el-input v-model="tempDetail.mti" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                    <el-input v-model="tempDetail.externalIdentificationNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="客户号" prop="customerNo">
                    <el-input v-model="tempDetail.customerNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="处理码" prop="processingCode">
                    <el-input v-model="tempDetail.processingCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="日期时间" prop="dateAndTime">
                    <el-input v-model="tempDetail.dateAndTime" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="POS进入模式" prop="posEntryMode">
                    <el-input v-model="tempDetail.posEntryMode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="功能码" prop="functionCode">
                    <el-input v-model="tempDetail.functionCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="消息原因代码" prop="messageReasonCode">
                	 <el-select v-model="tempDetail.messageReasonCode" class="wd200" readonly disabled>
                        <el-option
                            v-for="(item, index ) in messageReasonCodeOptions"
                            :key="index"
                            :label="item.modeName"
                            :value="item.operationMode"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="MCC" prop="mcc">
                    <el-input v-model="tempDetail.mcc" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易金额" prop="transAmt">
                    <el-input v-model="tempDetail.transAmt" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="原始金额" prop="originalAmountReconciliation">
                    <el-input v-model="tempDetail.originalAmountReconciliation" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="收单机构参考号" prop="acquireReferenceNumbr">
                    <el-input v-model="tempDetail.acquireReferenceNumbr" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="受理机构标识码" prop="acqId">
                    <el-input v-model="tempDetail.acqId" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="转发机构id代码" prop="forwdInstitIdCode">
                    <el-input v-model="tempDetail.forwdInstitIdCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="检索参考号" prop="retrievalReferNum">
                    <el-input v-model="tempDetail.retrievalReferNum" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="授权成功码" prop="authApprovalCde">
                    <el-input v-model="tempDetail.authApprovalCde" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="受卡机终端标识码" prop="terminateIdentNo">
                    <el-input v-model="tempDetail.terminateIdentNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="商户代码" prop="merchantCde">
                    <el-input v-model="tempDetail.merchantCde" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="持卡人姓名/地址" prop="cardAcceptorName">
                    <el-input v-model="tempDetail.cardAcceptorName" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="附加数据" prop="additionalData">
                    <el-input v-model="tempDetail.additionalData" class="wd200" type="text" readonly/>
                </el-form-item>
               	<el-form-item class="cl_td" label="终端类型" prop="terminalType">
                    <el-input v-model="tempDetail.terminalType" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="撤销标志" prop="messageReversalIndicator">
                    <el-input v-model="tempDetail.messageReversalIndicator" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="电子商务安全等级指标" prop="electronicCommerceSecurityLevelIndicator">
                    <el-input v-model="tempDetail.electronicCommerceSecurityLevelIndicator" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="币种小数位" prop="currencyExponents">
                    <el-input v-model="tempDetail.currencyExponents" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易币种" prop="currencyCodesAmountsOriginal">
                    <el-input v-model="tempDetail.currencyCodesAmountsOriginal" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="业务活动" prop="businessActivity">
                    <el-input v-model="tempDetail.businessActivity" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="结算指标" prop="settlementIndicator">
                    <el-input v-model="tempDetail.settlementIndicator" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="主卡id" prop="mastercardAssignedId">
                    <el-input v-model="tempDetail.mastercardAssignedId" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="检索文档码" prop="retrievalDocumentCode">
                    <el-input v-model="tempDetail.retrievalDocumentCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="S1排除请求代码" prop="exclusionRequestCode">
                    <el-input v-model="tempDetail.exclusionRequestCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="文件标识" prop="documentationIndicator">
                    <el-input v-model="tempDetail.documentationIndicator" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="额外金额" prop="amountsAdditional">
                    <el-input v-model="tempDetail.amountsAdditional" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易生命周期id" prop="transLifeCycleId">
                    <el-input v-model="tempDetail.transLifeCycleId" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="报文编号" prop="messageNumber">
                    <el-input v-model="tempDetail.messageNumber" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="交易发起机构" prop="transOriginInstit">
                    <el-input v-model="tempDetail.transOriginInstit" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="发卡机构参考数据" prop="cardIssuerReferenceData">
                    <el-input v-model="tempDetail.cardIssuerReferenceData" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="原交易全局流水号" prop="oldGlobalSerialNumbr">
                    <el-input v-model="tempDetail.oldGlobalSerialNumbr" class="wd200" type="text" readonly/>
                </el-form-item>
               	<el-form-item class="cl_td" label="调单状态" prop="retrievalStatus" >
                    <el-select v-model="tempDetail.retrievalStatus" class="wd200" readonly disabled>
                        <el-option
                            v-for="(item, index ) in retrievalStatusOptions"
                            :key="index"
                            :label="item.modeName"
                            :value="item.operationMode"/>
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
               	retrievalStatusOptions: [],//调单状态
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
            //消息原因代码
           	this.getSelectDict( "dic_messageReasonCode").then(res => {
                this.messageReasonCodeOptions = res
            })
           	//消息原因代码
           	this.getSelectDict( "dic_protestStatus").then(res => {
                this.retrievalStatusOptions = res.returnData.rows[0]
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
            this.getTableList('/nonfi/nonfinanceService/ISS.IQ.01.0130', this.queryFormObj ,(res) => {
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
        	this.dialogFormVisibleUp = true
            this.tempUp = Object.assign({}, row)
			this.$nextTick(() => {
                this.$refs['dataFormUp'].clearValidate()
            })
        },
      	//修改保存
       	subUpData(){
       		if(this.tempUp.retrievalStatus == null || this.tempUp.retrievalStatus == "" ||  
       			this.tempUp.retrievalStatus == "N"){
		 		this.$message('请选择调单状态')
				return;
			}else{
	       		this.post('/nonfi/nonfinanceService/ISS.IQ.01.0140', this.tempUp, (response) => {
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

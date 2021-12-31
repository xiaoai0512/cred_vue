<!--客户额度调整-->
<template>
    <div class="allContent">
        <el-form ref="dataFormCustomer" :rules="formRules" :model="queryForm">
            <el-form-item class="cl_td" label="调整种类" prop="adjusClass"
                :rules="[ { required: true, message: '调整种类不能为空'} ]">
                <el-select v-model="queryForm.adjusClass" class="wd200" @change="adjusClassChange($event)">
                    <el-option v-for="(item, index) in adjusClassOptions" 
                    	:key="index" 
                    	:label="item.detailDesc"
                        :value="item.codes" />
                </el-select>
            </el-form-item>
            <div class="clearboth"></div>
            <div v-if="showNumber">
	            <el-form-item class="cl_td" label="证件类型" prop="idType" >
	                <el-select v-model="queryForm.idType" class="wd200" @change="idTypeChange($event)">
	                    <el-option v-for="(item, index) in idTypeList" :key="index" :label="item.detailDesc"
	                        :value="item.codes" />
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="证件号码" prop="idNumber">
	                <el-input v-model="queryForm.idNumber" class="wd200" type="text" @input="forceInput($event)"/>
	            </el-form-item>
            </div>
            <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo" v-if="showExternal">
                <el-input v-model="queryForm.externalIdentificationNo" class="wd200" type="text" @input="forceInput($event)"/>
            </el-form-item>
            <div class="cl_tr text_center">
                <div class="search_button">
                    <el-button size="medium" icon="el-icon-arrow-down" type="primary" v-if="isshow"
                        @click="showControlBtn()">额度节点</el-button>
                    <el-button size="medium" icon="el-icon-arrow-up" type="primary" v-else @click="elseBtn()">额度节点
                    </el-button>
                </div>
            </div>
            <div v-if="showDiv">
                <el-form-item class="cl_td" label="额度节点" prop="creditNodeNo">
                    <el-select v-model="queryForm.creditNodeNo" class="wd200" @change="refsh($event)">
                        <el-option v-for="(item, index) in creditNodeNoOptions" :key="index" :label="item.label"
                            :value="item.value" />
                    </el-select>&nbsp;&nbsp;
                </el-form-item>
                <el-button size="medium" type="primary" @click="getBusinessNode()">确定</el-button>
            </div>
        </el-form>
        <!--业务节点列表-->
        <div class="clearboth"></div>
        <div class="allcontent" style="margin-top: 20px;" v-if="showInfo">
            <div class="text_title ">业务节点</div>
            <el-table v-if="showInfo" v-loading="listLoading1" :data="list1" border fit highlight-current-row>
                <el-table-column align="center" label="额度节点" prop="creditDesc" />
                <el-table-column align="center" label="币种" prop="currencyCode" />
                <el-table-column align="center" label="固定额度" prop="permLimit" />
                <el-table-column align="center" label="容差额度" prop="toleranceAmt" />
                <el-table-column align="center" label="临时额度" prop="tempLimit" />
                <el-table-column align="center" label="临时额度生效日" prop="tempLimitEffectvDate" />
                <el-table-column align="center" label="临时额度失效日" prop="tempLimitExpireDate" />
                <el-table-column align="center" label="未入账授权金额" prop="outstandingAmt" />
                <el-table-column align="center" label="已入账授权金额" prop="balance" />
                <el-table-column align="center" label="还款未入账金额" prop="paymentOutstandingAmt" />
                <el-table-column align="center" label="可用额度" prop="usableAmt" />
                <el-table-column width="200" label="操作" align="center">
                    <template slot-scope="{row,$index}">
                        <a icon="el-icon-more" type="primary" @click="checkApplication(row)">[应用节点]</a>
                    </template>
                </el-table-column>
            </el-table>
            <!------应用节点------>
            <div v-if="showList2">
                <div class="text_title " style="margin-top: 20px;">应用节点： {{creditDescName}}</div>
                <el-table v-loading="listLoading2" :data="list2" border fit highlight-current-row>
                    <el-table-column align="center" label="币种" prop="currencyCode" />
                    <el-table-column align="center" label="应用对象" prop="productObjectCode" />
                    <el-table-column align="center" label="固定额度" prop="permLimit" />
                    <el-table-column align="center" label="容差额度" prop="toleranceAmt" />
                    <el-table-column align="center" label="临时额度" prop="tempLimit" />
                    <el-table-column align="center" label="临时额度生效日" prop="tempLimitEffectvDate" />
                    <el-table-column align="center" label="临时额度失效日" prop="tempLimitExpireDate" />
                    <el-table-column align="center" label="未入账授权金额" prop="outstandingAmt" />
                    <el-table-column align="center" label="已入账授权金额" prop="balance" />
                    <el-table-column align="center" label="还款未入账金额" prop="paymentOutstandingAmt" />
                    <el-table-column align="center" label="可用额度" prop="usableAmt" />
                </el-table>
            </div>
            <div style="margin-top: 20px;">
                <el-form ref="dataFormCredit" :rules="formItem" :model="businessNode">
                    <el-form-item class="cl_td" label="调额类型" prop="adjustType"
                        :rules="[ { required: true, message: '调额类型不能为空'} ]">
                        <el-select v-model="businessNode.adjustType" class="wd200" @change='getValue'>
                            <el-option v-for="(item, index) in adjustTypeOptions" :key="index" :label="item.detailDesc"
                                :value="item.codes" />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="cl_td" label="币种" prop="creditTwocurrency"
                        :rules="[ { required: true, message: '授信币种不能为空'} ]">
                        <el-select v-model="businessNode.creditTwocurrency" class="wd200">
                            <el-option v-for="(item, index) in creditTwocurrencyOptions" :key="index"
                                :label="item.currencyDesc" :value="item.currencyCode" />
                        </el-select>
                    </el-form-item>
                    <div v-if="(businessNode.adjustType == '1') || (businessNode.adjustType == '2') ">
                        <el-form-item class="cl_td" label="授信额度" prop="creditLimit">
                            <el-input v-model="businessNode.creditLimit" class="wd200" type="text" @input="onInput($event)"/>
                        </el-form-item>
                    </div>
                    <div v-if="(businessNode.adjustType == '3') || (businessNode.adjustType == '5')">
                        <el-form-item class="cl_td" label="授信额度" prop="creditLimit">
                            <el-input v-model="businessNode.creditLimit" class="wd200" type="text" @input="onInput($event)"/>
                        </el-form-item>
                        <template>
                            <el-form-item :rules="[ { required: true, message: '临时额度生效日期不能为空'} ]" class="cl_td"
                                label="临时额度生效日" prop="limitEffectvDate">
                                <el-date-picker v-model="businessNode.limitEffectvDate" type="date" placeholder="选择日期"
                                    value-format="yyyy-MM-dd" style="width: 200px;">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item :rules="[ { required: true, message: '临时额度失效日期不能为空'} ]" class="cl_td"
                                label="临时额度失效日期" prop="limitExpireDate">
                                <el-date-picker v-model="businessNode.limitExpireDate" align="right" type="date"
                                    placeholder="选择日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions"
                                    style="width: 200px;">
                                </el-date-picker>
                            </el-form-item>
                        </template>
                    </div>
                    <div class="cl_tr text_center">
                        <el-button size="medium" round icon="el-icon-plus" type="primary" @click="confirmInfo()">确定
                        </el-button>
                        <el-button size="medium" round icon="el-icon-plus" type="primary" @click="closeInfo()">关闭
                        </el-button>
                    </div>
                </el-form>
            </div>
        </div>
        <!--授信结果信息-->
        <el-dialog title="调整结果信息" :visible.sync="dialogFormVisibleInfo" width="65%">
            <el-form :data="viewCreditInfo" class="mbtm20" fit highlight-current-row style="width: 100%;" border>
                <el-form-item class="cl_td" label="客户号" prop="customerNo">
                    <el-input v-model="viewCreditInfo.customerNo" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                    <el-input v-model="viewCreditInfo.externalIdentificationNo" class="wd200" type="text" readonly />
                </el-form-item>

                <el-form-item class="cl_td" label="额度节点" prop="creditDesc">
                    <el-input v-model="viewCreditInfo.creditDesc" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="调额类型" prop="adjustTypeInfo">
                    <el-input v-model="viewCreditInfo.adjustTypeInfo" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" v-if="showCreditInfo" label="临时额度生效日" prop="startDateInfo">
                    <el-input v-model="viewCreditInfo.startDateInfo" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item v-if="showCreditInfo" class="cl_td" label="临时额度失效日期" prop="endDataInfo">
                    <el-input v-model="viewCreditInfo.endDataInfo" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="币种 " prop="currencyCodeInfo">
                    <el-input v-model="viewCreditInfo.currencyCodeInfo" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="调整额度" prop="tempLimitInfo">
                    <el-input v-model="viewCreditInfo.tempLimitInfo" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="调整结果" prop="returnCodeInfo">
                    <el-input v-model="viewCreditInfo.returnCodeInfo" class="wd200" type="text" readonly />
                </el-form-item>
            </el-form>
            <!--业务节点-->
            <div class="text_title " style="margin-top: 20px;">业务节点</div>
            <el-table v-loading="listLoadingA" :data="creditInfoListA" border fit highlight-current-row>
                <el-table-column align="center" label="额度节点" prop="creditDesc" />
                <el-table-column align="center" label="币种" prop="currencyCode" />
                <el-table-column align="center" label="固定额度" prop="permLimit" />
                <el-table-column align="center" label="容差额度" prop="toleranceAmt" />
                <el-table-column align="center" label="临时额度" prop="tempLimit" />
                <el-table-column align="center" label="临时额度生效日" prop="tempLimitEffectvDate" />
                <el-table-column align="center" label="临时额度失效日" prop="tempLimitExpireDate" />
                <el-table-column align="center" label="未入账授权金额" prop="outstandingAmt" />
                <el-table-column align="center" label="已入账授权金额" prop="balance" />
                <el-table-column align="center" label="可用额度" prop="usableAmt" />
                <el-table-column width="200" label="操作" align="center">
                    <template slot-scope="{row,$index}">
                        <a icon="el-icon-more" type="primary" @click="getApplicationNode(row)">[应用节点]</a>
                    </template>
                </el-table-column>

            </el-table>
            <!--应用节点-->
            <div v-if="showApplication" style="margin-top: 20px;">
                <div class="text_title " style="margin-top: 20px;">应用节点： {{creditDescNames}}</div>
                <el-table v-loading="listLoadingB" :data="applicationListB" border fit highlight-current-row>
                    <el-table-column align="center" label="额度节点" prop="currencyCode" />
                    <el-table-column align="center" label="币种" prop="productObjectCode" />
                    <el-table-column align="center" label="固定额度" prop="permLimit" />
                    <el-table-column align="center" label="容差额度" prop="toleranceAmt" />
                    <el-table-column align="center" label="临时额度" prop="tempLimit" />
                    <el-table-column align="center" label="临时额度生效日" prop="tempLimitEffectvDate" />
                    <el-table-column align="center" label="临时额度失效日" prop="tempLimitExpireDate" />
                    <el-table-column align="center" label="未入账授权金额" prop="outstandingAmt" />
                    <el-table-column align="center" label="已入账授权金额" prop="balance" />
                    <el-table-column align="center" label="可用额度" prop="usableAmt" />
                </el-table>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="closeResult()"> 关闭</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: 'businessNode',
        components: {},
        data() {
            return {
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < Date.now();
                    },
                },
                value1: '',
                value2: '',
                queryForm: {},
                idTypeList: [],
                baseInfoObj: {},
                showInfo: false,//客户号
                showDiv: false,//额度节点下拉
                isshow: true,//额度节点按钮小三角
               	showNumber: false,
            	showExternal: false,
                creditNodeNoAll: [],
                viewCreditInfo: {},
                formRules: {},
                formItem: {},
                creditNodeNoOptions: [],//额度节点
                creditTwocurrencyOptions: [],//授信币种
                adjusClassOptions: [],
                showDate: false,//基本信息生效日期与失效日期显示隐藏
                showDateInfo: false,//授信結果信息日期显示隐藏
                loginInfo: {},
                //业务节点
                listLoading1: false,
                list1: [],//业务节点列表
                businessNode: {},//业务节点form
                //弹框外应用节点
                listLoading2: false,
                list2: [],
                showList2: false,
                creditDescName: '',//额度节点
                //授权结果信息
                isNO: false,
                showCreditInfo: false,
                creditInfoListA: [],//业务节点列表
                listLoadingA: false,
                dialogFormVisibleInfo: false,
                //应用节点
                applicationListB: [],
                listLoadingB: false,
                showApplication: false,
                creditDescNames: '',
            }
        },
        created() {
            this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))
        },
        mounted() {
            //證件类型
            this.getSelectDict('dic_certificateType').then((res) => {
                this.idTypeList = res
            })
            //调整种类
            this.getSelectDict('dic_adjusType').then((res) => {
                this.adjusClassOptions = res
            })
            //调额类型
            this.getSelectDict('dic_adjustQuoteType').then((res) => {
                this.adjustTypeOptions = res

            })

        },
        methods: {
            //刷新下拉
            refsh(e) {
            	this.$forceUpdate()
            },
            idTypeChange(y) {
            	this.$forceUpdate()
            },
            forceInput(t){
            	this.$forceUpdate()
            },
            getValue: function () {//监听下拉框
                if (this.businessNode.adjustType == '4') {
                    this.businessNode.creditLimit = 0
                }
            },
            //额度节点箭头向上
            showControlBtn() {
                this.$refs['dataFormCustomer'].validate((valid) => {
                    if (valid) {
                        this.isshow = true
                        this.getCreditNode()
                    } else {
                        this.showDiv = false
                    }
                })
            },
            //箭头向下
            elseBtn() {
                this.isshow = !this.isshow
                this.showDiv = !this.showDiv
            },
            //监听调整种类
            adjusClassChange(e){
            	if(e == 'B'){
            		this.showNumber = true
            		this.showExternal =true
            		this.queryForm.externalIdentificationNo = ''
            		this.$forceUpdate()
            	}else {
            		this.showNumber = false
            		this.showExternal =true
            		 this.queryForm.idNumber = ''
            		 this.queryForm.idType = ''
            		 this.$forceUpdate()
            	}
            },
            //验证输入条件
            getCreditNode() {
                if ((this.queryForm.idNumber != "" && this.queryForm.idNumber != null && this.queryForm.idNumber != undefined) &&
                    (this.queryForm.idType == "" || this.queryForm.idType == null || this.queryForm.idType == undefined)) {
                    this.$message('证件类型不能为空！');
                    return;
                }
                if ((this.queryForm.idType != "" && this.queryForm.idType != null && this.queryForm.idType != undefined)) {
                   	if (this.queryForm.idNumber == "" && this.queryForm.idNumber == null && this.queryForm.idNumber == undefined) {
                        this.$message('证件号码不能为空！');
                        return;
                    } 
                }
                if ((this.queryForm.idNumber == "" || this.queryForm.idNumber == null || this.queryForm.idNumber == undefined) &&
                    (this.queryForm.idType == "" || this.queryForm.idType == null || this.queryForm.idType == undefined) &&
                    (this.queryForm.externalIdentificationNo == "" || this.queryForm.externalIdentificationNo == null ||
                    this.queryForm.externalIdentificationNo == undefined)) {
                	this.$message('请输入条件进行查询');
               		return;
                } 
                this.getBalanceObjectCodeOptions()
			},
			//额度节点查询接口
            getBalanceObjectCodeOptions() {
                let obj = {
                    creditFlag: "Y",
                    operationMode: this.logininfo.operationMode,
                    authDataSynFlag: '1',
                }
                obj = Object.assign(obj, this.queryForm)
                this.post('/auth/authService/LMS.IQ.01.0021', obj, (res) => {
                    if (res.returnCode == '000000') {
                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                            let arr = []
                            let rows = res.returnData.rows
                            rows.forEach((item, index) => {
                                arr[index] = {
                                    label: item.creditNodeDesc,
                                    value: item.creditNodeNo
                                }
                            })
                            this.creditNodeNoOptions = arr
                            this.showDiv = true
                        } else {
                            this.creditNodeNoOptions = []
                            this.showDiv = false
                        }
                    }
                })
            },
            //额度节点确认
            getBusinessNode() {
                if (this.queryForm.creditNodeNo) {
                    this.listLoading = true
                    let obj01 = {
                        operationMode: "A01",
                        grantAdjustFlag: 'G',
                    }
                    obj01 = Object.assign(obj01, this.queryForm)
                    this.getTableList('/auth/authService/LMS.IQ.01.0020', obj01, (res) => {
                        if (res.returnMsg == 'OK') {
                        	this.creditTwocurrencyOptions = res.returnData.rows;
	                        let obj = {
		                        adjustFlag: 'Y',
		                        authDataSynFlag: '1',
		                        operationMode: this.logininfo.operationMode,
		                        grantAdjustFlag: 'A',
		                        adjusClass: this.queryForm.adjusClass,
		                        creditNodeNo: this.queryForm.creditNodeNo,
		                    }
		                    obj = Object.assign(obj, this.queryForm)
		                    this.getTableList('/auth/authService/LMS.IQ.01.0001', obj, (res) => {
		                        if (res.returnCode == '000000') {
		                            this.listLoading1 = false
		                            this.showInfo = true
		                            if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
		                                this.list1 = res.returnData.rows
		                                this.creditDescName = res.returnData.rows[0].creditDesc
		                            }
		                        } else if (res.returnData == 'null') {
		                            this.showInfo = false
		                        }
		                	}, (err) => {
			                    if (err) {
			                        this.showInfo = false
			                        this.list1 = []
			                    }
		                	})
	                   	}else if(res.returnData.rows.length == 0){
	                   		this.$message('该账户不存在授信币种，请核实客户信息！')
	                   	}
                	})
                } else {
                    this.$message('请输入额度节点!');
                }
            },
            //关闭业务节点信息
            closeInfo() {
                this.showInfo = false
                this.businessNode = {}
                this.list2 = false
                this.showList2 = false
            },
            //弹框外应用节点
            checkApplication(isRow) {
                this.listLoading2 = true
                this.showList2 = true
                let itemRow = {
                    authDataSynFlag: "1",
                    creditNodeNo: isRow.creditNodeNo,
                    creditNodeNoInfo: isRow.creditDesc,
                    customerNo: isRow.customerNo,
                }
                this.getTableList('/auth/authService/LMS.IQ.01.0001', itemRow).then((res) => {
                    if (res.returnCode == "000000") {
                        this.listLoading2 = false
                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                            this.list2 = res.returnData.rows
                        } else {
                            this.list2 = []
                        }
                    }
                }, (err) => {
                    if (err) {
                        this.listLoading2 = false
                        this.list2 = []
                    }
                })
            },
          	//授信信息弹框事件编号
            confirmInfo() {
                this.$refs['dataFormCredit'].validate((valid) => {
                    if (valid) {
                        if (this.businessNode.adjustType) {
                            if (this.businessNode.adjustType != 4 && !this.businessNode.creditLimit) {
                            	this.$message('请输入授信额度！');
                            	return;
                            }else{
                                let obj = {
                                    adjusClass: this.queryForm.adjusClass,
                                    adjustType: this.businessNode.adjustType,
                                    adminFlagUser: "1",
                                    authDataSynFlag: "1",
                                    creditLimit: this.businessNode.creditLimit,
                                    limitEffectvDate: this.businessNode.limitEffectvDate,
                                    limitExpireDate: this.businessNode.limitExpireDate,
                                    creditNodeNo: this.queryForm.creditNodeNo,
                                    currencyCode: this.businessNode.creditTwocurrency,
                                    externalIdentificationNo: this.queryForm.externalIdentificationNo,
                                    operationMode: this.logininfo.operationMode,
                                    idType: this.queryForm.idType,
                                    idNumber: this.queryForm.idNumber,
                                }
                                this.getTableList('/auth/authService/LMS.OP.01.0002', obj).then((res) => {
                                    if (res.returnMsg == "OK") {
                                        this.viewCreditInfo = this.businessNode
                                        this.viewCreditInfo.operationMode = this.queryForm.operationMode;
                                        this.viewCreditInfo.operationModesInfo = this.queryForm.operationModeInfo;
                                        this.viewCreditInfo.externalIdentificationNo = this.queryForm.externalIdentificationNo;
                                        this.viewCreditInfo.creditNodeNo = this.queryForm.creditNodeNo.creditNodeNo;
                                        this.viewCreditInfo.creditNodeNosInfo = this.businessNode.creditNodeNoInfo;
                                        this.viewCreditInfo.tempLimitInfo = this.businessNode.creditLimit;
                                        this.viewCreditInfo.creditDesc = this.list1[0].creditDesc;
                                        this.viewCreditInfo.customerNo = this.list1[0].customerNo;
                                        this.viewCreditInfo.startDateInfo = this.businessNode.limitEffectvDate;
                                        this.viewCreditInfo.endDataInfo = this.businessNode.limitExpireDate;
                                        this.viewCreditInfo.adjustTypeNum = this.businessNode.adjustType;//调额类型
                                        this.viewCreditInfo.adjusClass = this.businessNode.adjusClass;//调整种类
                                        this.viewCreditInfo.returnCodeInfo = "成功"
                                        if (this.viewCreditInfo.creditTwocurrency == '156') {
                                            this.viewCreditInfo.currencyCodeInfo = '人民币'
                                        } else {
                                            this.viewCreditInfo.currencyCodeInfo = '美元'
                                        }
                                        if (this.businessNode.adjustType == '1') {

                                            this.viewCreditInfo.adjustTypeInfo = '固定额度调升';
                                        } else if (this.businessNode.adjustType == '2') {
                                            this.viewCreditInfo.adjustTypeInfo = '固定额度调降';
                                        } else if (this.businessNode.adjustType == '3') {
                                            this.viewCreditInfo.adjustTypeInfo = '临时额度调升';
                                        } else if (this.businessNode.adjustType == '4') {
                                            this.viewCreditInfo.adjustTypeInfo = '临时额度取消';
                                        } else if (this.businessNode.adjustType == '5') {
                                            this.viewCreditInfo.adjustTypeInfo = '临时额度调降';
                                        }
                                        this.dialogFormVisibleInfo = true
                                        this.getCreditInfo()
                                   	} else {
                                        this.viewCreditInfo.returnCodeInfo = "失败"
                                        this.dialogFormVisibleInfo = false
                                     
                                    }
                                })
                            }
 						}
                    }
                })
            },
            onInput(){
			    this.$forceUpdate();
			},
            /*----业务节点----*/
            getCreditInfo() {
                this.showCreditInfo = true
                if (this.viewCreditInfo.returnCodeInfo == '失败') {
                    this.isNO = true;

                } else {
                    this.isNO = false;

                }
                if (this.businessNode.adjustType == '1' || this.businessNode.adjustType == '2' || this.businessNode.adjustTypeNum == '4') {
                    this.showCreditInfo = false;

                }
                else if (this.businessNode.adjustTypeNum == '3' || this.businessNode.adjustTypeNum == '5') {
                    this.showCreditInfo = true;
                }
                let objInfo = {
                    adjustFlag: "Y",
                    authDataSynFlag: "1",
                    creditNodeNo: this.queryForm.creditNodeNo,
                    operationMode: this.viewCreditInfo.operationMode,
                    idType: this.queryForm.idType,
                    idNumber: this.queryForm.idNumber,
                    externalIdentificationNo: this.viewCreditInfo.externalIdentificationNo,
                }
                this.getTableList('/auth/authService/LMS.IQ.01.0001', objInfo).then((res) => {
                    if (res.returnMsg == "OK") {
                        this.showCreditInfo = false
                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                            this.creditInfoListA = res.returnData.rows
                            this.creditDescNames = res.returnData.rows[0].creditDesc
                            //console.log(res.returnData.rows.creditDesc)
                        } else {
                            this.creditInfoListA = []
                            this.creditDescNames = ''
                        }
                    }
                }, (err) => {
                    if (err) {
                        this.creditInfoListA = []
                        this.creditDescNames = ''
                    }
                })
            },
            /*----应用节点----*/
            getApplicationNode(row) {
                this.showApplication = true
                this.listLoadingB = true
                let itemNode = {
                    authDataSynFlag: "1",
                    creditNodeNo: row.creditNodeNo,
                    creditNodeNoInfo: row.creditDesc,
                    customerNo: row.customerNo,
                }
                this.getTableList('/auth/authService/LMS.IQ.01.0001', itemNode).then((res) => {
                    if (res.returnCode == "000000") {
                        this.listLoadingB = false
                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                            this.applicationListB = res.returnData.rows
                        } else {
                            this.applicationListB = []
                        }
                    }
                }, (err) => {
                    if (err) {
                        this.listLoadingB = false
                        this.applicationListB = []
                    }
                })
            },
            //关闭
            closeResult() {
                this.dialogFormVisibleInfo = false
                this.showInfo = false
                this.businessNode = {}
                this.list2 = false
                this.showList2 = false
                this.showDiv = false
                this.queryForm = {}
            }
        }
    }
</script>

<style>
    .cl-span {
        width: 40%;
        float: left;
        text-align: right;
        font-size: 14px;
        padding: 0 12px 0 0;
        line-height: 36px;
        color: #606266;
        font-weight: 500;
    }
</style>
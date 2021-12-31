<!-- 公务卡额度管理 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
    	<el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
	       	<el-form-item class="cl_td" label="预算单位编码" prop="idNumber">
            	<el-input v-model="queryFormObj.idNumber" class="wd200" type="text"/>
        	</el-form-item>
    		<div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()">查询</el-button>
                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="reset(topParams)">重置</el-button>
            </div>
    	</el-form>  
    	<div v-if="showList1">
	        <el-form ref="detailRef" :model="detailInfo" :rules="detailRules">
	            <el-form-item class="cl_td" label="单位公务卡总授信额度" prop="orgAllQuota">
	            	<el-input v-model="detailInfo.orgAllQuota" class="wd200" type="text" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="单位公务卡可用授信额度" prop="orgRestQuota">
	            	<el-input v-model="detailInfo.orgRestQuota" class="wd200" type="text" readonly/>
	        	</el-form-item>
	        </el-form>
	        <div class="clearboth"></div>
	        <div class='text_title'>单位公务卡额度信息</div>
        	<el-table v-loading = "listLoading1" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
	            <el-table-column prop="customerName" label="持卡人姓名" align="center" />
	            <el-table-column prop="externalIdentificationNo" label="外部识别号" align="center" />
	            <el-table-column prop="idTypeDesc" label="证件类型" align="center" />
	            <el-table-column prop="idNumber" label="证件号码" align="center" />
	            <el-table-column prop="officialCardType" label="公务卡类型" align="center" />
	            <el-table-column prop="invalidFlagDesc" label="有效标识" align="center" />
	            <el-table-column prop="" label="操作" align="center" width="300px">
	                <template slot-scope="{row}">
		                <el-button size="mini" icon="el-icon-info" type="primary" @click="checkElmInfo(row)" >查询</el-button>
		                <el-button size="mini" icon="el-icon-more" type="primary" @click="creditList(row)" >授信</el-button>
		                <el-button size="mini" icon="el-icon-more" type="primary" @click="adjustQuota(row)" >调额</el-button>
		            </template >   
	            </el-table-column>
        	</el-table>
        	<pagination v-show="tableTotal1>0" :total="tableTotal1" :page.sync="listPage1.pageNum" :limit.sync="listPage1.pageSize" @pagination="getList" />
    	</div>	
		<div v-if="showList2">
    		<div class='text_title'>查询额度信息</div>
        	<el-table v-loading = "listLoading2" :data="quotaTableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
	            <el-table-column prop="creditDesc" label="额度节点" align="center" />
	            <el-table-column prop="productObjectCode" label="应用对象" align="center" />
					<span v-if="quotaTableList.productObjectCode == '999999999'"></span>
	            	<span v-if="quotaTableList.productObjectCode != '999999999'">{{quotaTableList.productObjectCode}}</span>
	            </el-table-column>
	            <el-table-column prop="currencyCode" label="币种" align="center" />
				<el-table-column prop="permLimit" label="固定额度" align="center" />
	            <el-table-column prop="toleranceAmt" label="容差额度" align="center" />
	            <el-table-column prop="tempLimit" label="临时额度" align="center" />
	            <el-table-column prop="tempLimitEffectvDate" label="临时额度生效日" align="center" />
	            <el-table-column prop="tempLimitExpireDate" label="临时失效额度日" align="center" />
	            <el-table-column prop="outstandingAmt" label="未入账授权金额" align="center" />
	            <el-table-column prop="balance" label="已入账授权金额" align="center" />
	            <el-table-column prop="usableAmt" label="可用额度" align="center" />
	        </el-table>
        	<pagination v-show="tableTotal2>0" :total="tableTotal2" :page.sync="listPage2.pageNum" :limit.sync="listPage2.pageSize" @pagination="getList" />
    	</div>
    	<!--授信-->
    	<el-dialog title="授信" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd" >
                <el-form-item class="cl_td" label="客户代码" prop="customerNo">
                    <el-input v-model="tempAdd.customerNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                    <el-input v-model="tempAdd.externalIdentificationNo" class="wd200" type="text" readonly/>
                </el-form-item>
				<el-form-item class="cl_td" label="运营模式" prop="operationMode" 
		            :rules="[ { required: true, message: '运营模式不能为空'} ]">
	                <el-select v-model="tempAdd.operationMode" class="wd200" @change="getOperationModeChange($event)" >
		                <el-option
		                    v-for="(item, index ) in operationModeOptions"
		                    :key="index"
		                    :label="item.modeName"
		                    :value="item.operationMode"/>
	                </el-select>
	            </el-form-item>	
	            <el-form-item class="cl_td" label="额度节点" prop="creditNodeNo"
	            	:rules="[ { required: true, message: '额度节点不能为空'} ]">
	                <el-select v-model="tempAdd.creditNodeNo" class="wd200" @change='creditNodeNoChange($event)'>
	                    <el-option v-for="(item, index) in creditNodeNoOptions" 
	                    	:key="index" 
	                    	:label="item.label" 
	                    	:value="item.value" />
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="授信币种" prop="currencyCode"
	            	:rules="[ { required: true, message: '授信币种不能为空'} ]">
	                <el-select v-model="tempAdd.currencyCode" class="wd200">
	                    <el-option v-for="(item, index) in creditTwocurrencyOptions" 
	                    	:key="index" 
	                    	:label="item.label" 
	                    	:value="item.value" />
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="授信额度" prop="creditTwoquotaN"
	            	:rules="[ { required: true, message: '授信额度不能为空'} ]">
                    <el-input v-model="tempAdd.creditTwoquotaN" class="wd200" type="text"/>
                </el-form-item>
                <el-form-item v-if="isT" class="cl_td" label="生效日期" prop="startDate">
	                <el-date-picker
	                    v-model="tempAdd.startDate"
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
	            <el-form-item v-if="isT" class="cl_td" label="失效日期" prop="endDate">
	                <el-date-picker
	                    v-model="tempAdd.endDate"
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
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleAdd = false">取消</el-button>
                <el-button type="primary" @click="getAddData()">确定</el-button>
            </div>
        </el-dialog>
        <!--调额-->
        <el-dialog title="调额" :visible.sync="dialogFormVisibleQuota" width="65%">
            <el-form ref="dataFormQuota" :rules="rulesQuota" :model="tempQuota" >
                <el-form-item class="cl_td" label="客户代码" prop="customerNo">
                    <el-input v-model="tempQuota.customerNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                    <el-input v-model="tempQuota.externalIdentificationNo" class="wd200" type="text" readonly/>
                </el-form-item>
				<el-form-item class="cl_td" label="运营模式" prop="operationMode" 
		            :rules="[ { required: true, message: '运营模式不能为空'} ]">
	                <el-select v-model="tempQuota.operationMode" class="wd200" @change="quota_getOperationModeChange($event)" >
		                <el-option
		                    v-for="(item, index ) in operationModeOptions"
		                    :key="index"
		                    :label="item.modeName"
		                    :value="item.operationMode"/>
	                </el-select>
	            </el-form-item>	
	            <el-form-item class="cl_td" label="额度节点" prop="creditNodeNo"
	            	:rules="[ { required: true, message: '额度节点不能为空'} ]">
	                <el-select v-model="tempQuota.creditNodeNo" class="wd200" @change='quota_creditNodeNoChange($event)'>
	                    <el-option v-for="(item, index) in creditNodeNoOptions" 
	                    	:key="index" 
	                    	:label="item.label" 
	                    	:value="item.value" />
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="调整种类" prop="adjusClass"
	            	:rules="[ { required: true, message: '授信币种不能为空'} ]">
	                <el-select v-model="tempQuota.adjusClass" class="wd200">
	                    <el-option v-for="(item, index) in adjusClassOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="调额类型" prop="adjustType"
	            	:rules="[ { required: true, message: '调额类型不能为空'} ]">
	                <el-select v-model="tempQuota.adjustType" class="wd200" @change="adjustTypeChange($event)">
	                    <el-option v-for="(item, index) in adjustTypeOptions" 
	                    	:key="index" 
	                    	:label="item.detailDesc" 
	                    	:value="item.codes" />
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="币种" prop="currencyCode"
	            	:rules="[ { required: true, message: '币种不能为空'} ]">
	                <el-select v-model="tempQuota.currencyCode" class="wd200">
	                    <el-option v-for="(item, index) in creditTwocurrencyOptions" 
	                    	:key="index" 
	                    	:label="item.label" 
	                    	:value="item.value" />
	                </el-select>
	            </el-form-item>
	            <el-form-item v-if="permInfo" class="cl_td" label="授信额度" prop="creditLimit"
	            	:rules="[ { required: true, message: '授信额度不能为空'} ]">
                    <el-input v-model="tempQuota.creditLimit" class="wd200" type="text"/>
                </el-form-item>
	           	<el-form-item v-if="dateInfo" class="cl_td" label="临时额度生效日期" prop="limitEffectvDate"
	           		:rules="[ { required: true, message: '临时额度生效日期不能为空'} ]">
	                <el-date-picker
	                    v-model="tempQuota.limitEffectvDate"
	                    class="wd200"
	                    type="date"
	                    placeholder="选择起始时间"
	                    format="yyyy 年 MM 月 dd 日"
	                    value-format="yyyy-MM-dd"
	                    :picker-options="pickerOptionsStart2"
	                    :clearable="true"
	                    @change="changeStart2"
	                />
	            </el-form-item>
	            <el-form-item v-if="dateInfo" class="cl_td" label="临时额度失效日期" prop="limitExpireDate"
	            	:rules="[ { required: true, message: '临时额度失效日期不能为空'} ]">
	                <el-date-picker
	                    v-model="tempQuota.limitExpireDate"
	                    class="wd200"
	                    type="date"
	                    placeholder="选择结束时间"
	                    format="yyyy 年 MM 月 dd 日"
	                    value-format="yyyy-MM-dd"
	                    :picker-options="pickerOptionsEnd2"
	                    :clearable="true"
	                    @change="changeEnd2"
	                />
	            </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleQuota = false">取消</el-button>
                <el-button type="primary" @click="subQuotaData()">确定</el-button>
            </div>
        </el-dialog>
        <!--授信结果信息-->
        <el-dialog title="调额" :visible.sync="dialogFormVisibleInfo" width="65%">
            <el-form ref="dataFormInfo" :rules="rulesInfo" :model="tempInfo" >
                <el-form-item class="cl_td" label="客户代码" prop="customerNo">
                    <el-input v-model="tempInfo.customerNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                    <el-input v-model="tempInfo.externalIdentificationNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="额度节点" prop="creditNodeNosInfo">
                    <el-input v-model="tempInfo.creditNodeNosInfo" class="wd200" type="text" readonly/>
                </el-form-item>
                 <el-form-item class="cl_td" label="调额类型" prop="adjustTypeInfo">
                    <el-input v-model="tempInfo.adjustTypeInfo" class="wd200" type="text" readonly/>
                </el-form-item>
                 <el-form-item class="cl_td" label="币种" prop="currencyCodeInfo">
                    <el-input v-model="tempInfo.currencyCodeInfo" class="wd200" type="text" readonly/>
                </el-form-item>
                 <el-form-item class="cl_td" label="调整额度" prop="tempLimitInfo">
                    <el-input v-model="tempInfo.tempLimitInfo" class="wd200" type="text" readonly/>
                </el-form-item>
                 <el-form-item class="cl_td" label="临时额度生效日期" prop="startDateInfo">
                    <el-input v-model="tempInfo.startDateInfo" class="wd200" type="text" readonly/>
                </el-form-item>
                 <el-form-item class="cl_td" label="临时额度失效日期" prop="endDataInfo">
                    <el-input v-model="tempInfo.endDataInfo" class="wd200" type="text" readonly/>
                </el-form-item>
               <el-form-item class="cl_td" label="调额结果" prop="returnCodeInfo">
                    <el-input v-model="tempInfo.returnCodeInfo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="失败原因" prop="returnMsgInfo">
                   <textarea class="layui-input bnone" name="loginNameN" style="height:60px" v-model="tempInfo.returnMsgInfo" readonly></textarea>
                </el-form-item>
                
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleInfo = false">取消</el-button>
              
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
                logininfo: '',
                // form
                cancelBtnFlag: false,
                queryFormObj: {
                	pageNum: 1,
                	pageSize:10,
                },
                queryFormRules: {},
                queryFormRef: {}, 
                //基本信息
               	detailRef: {},
               	detailInfo: {},
               	detailRules: {},
               	//列表
               	showList1: false,
               	tableTotal1: 0,
               	listLoading1: false,
               	tableList: [],
               	listPage1: {
               		pageNum: 1,
                	pageSize:10,
               	},
				//查询额度信息列表
				showList2: false,
               	listPage2: {
               		pageNum: 1,
                	pageSize:10,
               	},
               	quotaTableList: [],
               	listLoading2: false, 
               	tableTotal2: 0,
               	//授信
               	pickerOptionsStart: {}, //生效日期
           		pickerOptionsEnd:{}, // 失效日期
               	dialogFormVisibleAdd: false,
               	tempAdd: {},
               	dataFormAdd: {},
               	rulesAdd: {},
               	operationModeInfo: '',
               	creditNodeNoInfo: '',
               	isT: false,
               	//额度
           		pickerOptionsStart2: {}, //生效日期
           		pickerOptionsEnd2:{}, // 失效日期
               	dialogFormVisibleQuota: false,
               	permInfo: false,
               	dateInfo: false,
               	tempQuota: {},
               	rulesQuota: {},
               	dataFormQuota: {},
               	//授信结果信息
               	dialogFormVisibleInfo: false,
               	tempInfo: {},
               	rulesInfo: {},
               	dataFormInfo: {},
               	// 下拉框
                operationModeOptions: [],//运营模式
                creditNodeNoOptions: [],//额度节点
               	creditTwocurrencyOptions: [],//授信币种
               	adjusClassOptions: [],//调整种类
				adjustTypeOptions: [],//调额类型
            }
        },
        created() {
            
        },
        mounted() {
            this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))  //获取用户登录权限
           	// 运营模式 
		    this.getSelectDict("/beta/betaService/COS.IQ.02.0006").then((res) => {
		        this.operationModeOptions = res
		    })		
           	//激活标识
           	this.getSelectDict('dic_activationMode').then((res) => {
        		this.activationModeOptions = res
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
      	/*授信*/
      	// 失效日期
        changeStart() {
            this.pickerOptionsEnd = Object.assign({}, this.pickerOptionsEnd, {
                disabledDate: (time) => {
                    return time.getTime() < new Date(this.tempAdd.startDate).getTime()
                }
            })
        },
        // 生效日期
        changeEnd() {
            this.pickerOptionsStart = Object.assign({}, this.pickerOptionsStart, {
                disabledDate: (time) => {
                    return time.getTime() > new Date(this.tempAdd.endDate).getTime()
                }
            })
        },
        /*额度*/
       //失效日期
       changeStart2() {
            this.pickerOptionsEnd2 = Object.assign({}, this.pickerOptionsEnd2, {
                disabledDate: (time) => {
                    return time.getTime() < new Date(this.tempQuota.startDate).getTime()
                }
            })
        },
        // 生效日期
        changeEnd2() {
            this.pickerOptionsStart2 = Object.assign({}, this.pickerOptionsStart2, {
                disabledDate: (time) => {
                    return time.getTime() > new Date(this.tempQuota.endDate).getTime()
                }
            })
        },
      	
      	reset(){
      		this.queryFormObj = {}
      	},
      	handleSearch(){
      		if(this.queryFormObj.idNumber == '' ||this.queryFormObj.idNumber == undefined || 
      			this.queryFormObj.idNumber == null || this.queryFormObj.idNumber == 'null'){
					this.$message('请输入查询条件！')
			 		return;
			}
			this.getList()
        },
      	//单位公务卡额度信息
      	getList(){
      		this.listLoading1 = true  
      		this.showList1 = true
      		let params ={
	   			pageNum:  this.listPage1.pageNum,
	        	pageSize:  this.listPage1.pageSize,
	        	idType: '7',
	        	isTrans: true,
				transParams: ['dic_documentTypeTable','dic_invalidFlagYN'],
				transDict: ['idType','invalidFlag'],
   			}
			  params = Object.assign(this.queryFormObj, params)   //合并
			this.getTableList("/nonfi/nonfinanceService/OCS.IQ.01.0002",params,(res) => {
   			//this.post('/nonfi/nonfinanceService/OCS.IQ.01.0002', params, (res) => {
   				this.listLoading1 = false
       			if(res.returnCode == '000000') {
	       			this.tableList = res.returnData.rows
	       			this.detailInfo = res.returnData.obj
	       			this.tableTotal1 = res.returnData.totalCount
	                if (!res.returnData.rows || res.returnData.rows.length == 0) {
						res.returnData.rows = [];
						this.detailInfo = {}
	       				this.tableTotal1 = 0
					}
	            }else{
	            	this.showList1 = false
	            }
        	})
      	},
      	//查询额度信息列表
      	checkElmInfo(row){
      		this.listLoading2 = true  
      		this.showList2 = true
      		let paramsData ={
      			authDataSynFlag: '1',
      			externalIdentificationNo: row.externalIdentificationNo,
	   			pageNum:  this.listPage2.pageNum,
	        	pageSize:  this.listPage2.pageSize,
	        	
   			}
      		this.post('/auth/authService/LMS.IQ.01.0003', paramsData, (res) => {
   				this.listLoading2 = false
       			if(res.returnCode == '000000') {
	       			this.quotaTableList = res.returnData.rows
	       			if(this.quotaTableList.currencyCode=='156'){
	       				this.quotaTableList.currencyCode='人民币'
	       			}else if(this.quotaTableList.currencyCode=='840'){
	       				this.quotaTableList.currencyCode='美元'
	       			}else if(this.quotaTableList.currencyCode=='CNY'){
	       				this.quotaTableList.currencyCode='人民币'
	       			}else if(this.quotaTableList.currencyCode=='USD'){
	       				this.quotaTableList.currencyCode='美元'
	       			}else if(this.quotaTableList.currencyCode==''){
	       				this.quotaTableList.currencyCode=''
	       			}
	       			this.tableTotal2 = res.returnData.totalCount
	                if (!res.returnData.rows || res.returnData.rows.length == 0) {
						res.returnData.rows = [];
					}
	            }else{
	            	this.showList2 = false
	            }
        	})
      	},
      	//授信显示弹框
      	creditList(row){
			  this.tempAdd = {}
  		 	this.dialogFormVisibleAdd = true
	      	this.tempAdd = Object.assign({}, row) 
	      	this.tempAdd.customerNo=this.detailInfo.customerNo
     	 	this.$nextTick(() => {
		        this.$refs['dataFormAdd'].clearValidate()
	      	})
      	},
      	//坚听运营模式
      	getOperationModeChange(row){
      		this.operationModeInfo = row
      		this.getCreditNodeNo()
      	},
      	//额度节点
      	getCreditNodeNo() {
            let params = {
            	authDataSynFlag: '1',
            	creditFlag: 'Y',
                operationMode: this.operationModeInfo,
            }
            this.post('/beta/betaService/LMS.PM.01.0002', params, (res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        let arr = []
                        let rows = res.returnData.rows
                        rows.forEach((item, index) => {
                            arr[index] = {
                                label: item.creditDesc,
                                value: item.creditNodeNo
                            }
                        })
                        this.creditNodeNoOptions = arr
                       
                    } else {
                        this.creditNodeNoOptions = []
                    }
                }
            })
        },
        //监听额度节点
        creditNodeNoChange(row){
        	this.creditNodeNoInfo = row
        	this.getCreditTwocurrency()
        },
        //授信币种
        getCreditTwocurrency() {
            let params = {
            	authDataSynFlag: '1',
            	operationMode: this.tempAdd.operationMode,
                grantAdjustFlag: "G",
                externalIdentificationNo: this.tempAdd.externalIdentificationNo,
                creditNodeNo: this.creditNodeNoInfo
			}
            this.post('/auth/authService/LMS.IQ.01.0020', params, (res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        let arr = []
                        let rows = res.returnData.rows
                        if (rows[0].creditType == "P") {
							this.isT = false;
							this.tempAdd.startDate = "";
							this.tempAdd.endDate = "";
							this.tempAdd.creditTwoType = 'P';
						} else if (rows[0].creditType == "T") {
							this.tempAdd.creditTwoType = 'T';
							this.isT = true;
						}
                        rows.forEach((item, index) => {
                            arr[index] = {
                                label: item.currencyDesc,
                                value: item.currencyCode
                            }
                        })
                    	this.creditTwocurrencyOptions = arr
                    } else {
                        this.creditTwocurrencyOptions = []
                    }
                }
            })
        },
      	//确认提交授信信息
      	getAddData(){
      		let resTwoInfo = {}
      		if(this.tempAdd.creditTwoType == 'P'){
	      		let cusParams = {
					operationMode: this.tempAdd.operationMode, //运营模式
					externalIdentificationNo: this.tempAdd.externalIdentificationNo, //外部识别号
					customerNo:  this.tempAdd.customerNo, //客户号
					creditType:  this.tempAdd.creditTwoType, //授信类型
					currencyCode:  this.tempAdd.currencyCode, //币种
					creditNodeNo:  this.tempAdd.creditNodeNo, //授信节点
					creditLimit:  this.tempAdd.creditTwoquotaN, //授信钱
					budgetOrgCode:  this.queryFormObj.idNumber //预算单位编码
				};	
				this.$refs['dataFormAdd'].validate((valid) => {
	            	if (valid) {
		        		this.post('/nonfi/nonfinanceService/OCS.RT.01.0001', cusParams, (res) => {
			                if (res.returnCode == '000000') {
								resTwoInfo.codeKey = '0';
								resTwoInfo.returnCodeInfo = '成功'; //'成功';
							} else {
								resTwoInfo.codeKey = '1';
								resTwoInfo.returnCodeInfo = '失败'; //'失败';
								resTwoInfo.returnMsgInfo = response.returnMsg;
							}
							this.dialogFormVisibleAdd = false //关闭弹框
		            	})
	      			}
	        	})  
    		}else if(this.tempAdd.creditTwoType == 'T'){//临时
    			if (this.tempAdd.startDate && this.tempAdd.endDate) {
					$scope.cusParams = {
						operationMode: this.tempAdd.operationMode, //运营模式
						externalIdentificationNo: this.tempAdd.externalIdentificationNo, //外部识别号
						customerNo:  this.tempAdd.customerNo, //客户号
						creditType:  this.tempAdd.creditTwoType, //授信类型
						currencyCode:  this.tempAdd.currencyCode, //币种
						creditNodeNo:  this.tempAdd.creditNodeNo, //授信节点
						creditLimit:  this.tempAdd.creditTwoquotaN, //授信钱
						budgetOrgCode:  this.queryFormObj.idNumber, //预算单位编码
						limitEffectvDate: this.tempAdd.startDate,
						limitExpireDate: this.tempAdd.endDate
						
					};
					this.$refs['dataFormAdd'].validate((valid) => {
		            	if (valid) {
			        		this.post('/nonfi/nonfinanceService/OCS.RT.01.0001', cusParams, (res) => {
				                if (res.returnMsg == 'OK') {
									resTwoInfo.codeKey = '0';
									resTwoInfo.returnCodeInfo = '成功'; //'成功';
								} else {
									resTwoInfo.codeKey = '1';
									resTwoInfo.returnCodeInfo = '失败'; //'失败';
									resTwoInfo.returnMsgInfo = res.returnMsg;
								}
								this.dialogFormVisibleAdd = false //关闭弹框
			            	})
		      			}else{
		      				this.$message('请输入生效日期和失效日期！')
		      			}
	        		})  
    			}
			}
      	},
      	//额度显示弹框
      	adjustQuota(row){
  		 	this.dialogFormVisibleQuota = true
			this.tempQuota = {}
	      	this.tempQuota = Object.assign({}, row) 
	      	this.tempQuota.customerNo=this.detailInfo.customerNo
     	 	this.$nextTick(() => {
		        this.$refs['dataFormQuota'].clearValidate()
	      	})
      	},
      	//坚听运营模式
      	quota_getOperationModeChange(row){
      		this.operationModeInfo = row
      		this.quota_getCreditNodeNo()
      	},
      	//额度节点
      	quota_getCreditNodeNo() {
            let params = {
            	authDataSynFlag: '1',
            	creditFlag: 'Y',
                operationMode: this.operationModeInfo,
            }
            this.post('/beta/betaService/LMS.PM.01.0002', params, (res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        let arr = []
                        let rows = res.returnData.rows
                        rows.forEach((item, index) => {
                            arr[index] = {
                                label: item.creditDesc,
                                value: item.creditNodeNo
                            }
                        })
                        this.creditNodeNoOptions = arr
                       
                    } else {
                        this.creditNodeNoOptions = []
                    }
                }
            })
        },
        //监听额度节点
        quota_creditNodeNoChange(row){
        	this.creditNodeNoInfo = row
        	this.quota_getCreditTwocurrency()
        },
        //授信币种
        quota_getCreditTwocurrency() {
            let params = {
            	authDataSynFlag: '1',
            	operationMode: this.tempQuota.operationMode,
                grantAdjustFlag: "G",
                externalIdentificationNo: this.tempQuota.externalIdentificationNo,
                creditNodeNo: this.creditNodeNoInfo
			}
            this.post('/auth/authService/LMS.IQ.01.0020', params, (res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        let arr = []
                        let rows = res.returnData.rows
                        if (rows[0].creditType == "P") {
							this.dateInfo = false;
							this.tempAdd.startDate = "";
							this.tempAdd.endDate = "";
							this.tempAdd.creditTwoType = 'P';
						} else if (rows[0].creditType == "T") {
							this.tempAdd.creditTwoType = 'T';
							this.dateInfo = true;
						}
                        rows.forEach((item, index) => {
                            arr[index] = {
                                label: item.currencyDesc,
                                value: item.currencyCode
                            }
                        })
                    	this.creditTwocurrencyOptions = arr
                    } else {
                        this.creditTwocurrencyOptions = []
                    }
                }
            })
        },
      	adjustTypeChange(row){
      		if (row == '1' ||row == '2') {
				this.dateInfo = false;
				this.permInfo = true;
			} else if (row == '3' ||row == '5') {
				this.dateInfo = true;
				this.permInfo = true;
			} else if (row == '4') {
				this.dateInfo = false;
				this.permInfo = false;
				this.tempQuota.creditLimit = 0;
				this.tempQuota.limitEffectvDate = "";
				this.tempQuota.limitExpireDate = "";
			}
      	},
       //确认调额
      	subQuotaData(){ 
      		if(this.tempQuota.adjustType == '1' || this.tempQuota.adjustType == '2') {
				if (this.tempQuota.creditLimit) {
					let resInfo = {};
					resInfo.operationModesInfo = this.tempQuota.operationModeInfo;
					resInfo.externalIdentificationNo = this.tempQuota.externalIdentificationNo; //外部识别号
					resInfo.customerNo = this.tempQuota.customerNoInfo; //客户号
					resInfo.creditNodeNo = this.tempQuota.creditNodeNo;
					resInfo.tempLimitInfo = this.tempQuota.creditLimit;
					resInfo.startDateInfo = this.tempQuota.limitEffectvDate;
					resInfo.endDataInfo = this.tempQuota.limitExpireDate;
					if (this.tempQuota.currencyCode == '156') {
						resInfo.currencyCodeInfo = '人民币'; //'人民币';
					} else if (this.tempQuota.currencyCode == '840') {
						resInfo.currencyCodeInfo = '美元'; //'美元';
					}
					if (this.tempQuota.adjustType == '1') {
						resInfo.adjustTypeInfo = '永额调升'; //'永额调升';
					} else if (this.tempQuota.adjustType == '2') {
						resInfo.adjustTypeInfo = '永额调降'; //'永额调降';
					} else if (this.tempQuota.adjustType == '3') {
						resInfo.adjustTypeInfo = '临额调升'; //'临额调升';
					} else if (this.tempQuota.adjustType == '4') {
						resInfo.adjustTypeInfo = '临额取消'; //'临额取消';
					} else if (this.tempQuota.adjustType == '5') {
						resInfo.adjustTypeInfo = '临额调降'; //'临额调降';
					}
		  			let adjustParams = {
						operationMode: this.tempQuota.operationMode, //运营模式
						externalIdentificationNo: this.tempQuota.externalIdentificationNo, //外部识别号
						customerNo: this.tempQuota.customerNo, //客户号
						creditNodeNo: this.tempQuota.creditNodeNo, //调额节点
						adjustType: this.tempQuota.adjustType, //调额类型
						currencyCode: this.tempQuota.currencyCode, //币种
						creditLimit: this.tempQuota.creditLimit, //授信额度
						limitEffectvDate: this.tempQuota.limitEffectvDate, //生效日期
						limitExpireDate: this.tempQuota.limitExpireDate, //失效日期
						budgetOrgCode: this.queryFormObj.idNumber 
					};
		       		this.post('/nonfi/nonfinanceService/OCS.RT.01.0002', adjustParams, (res) => {
		                if(res.Data == 'OK'){
		                	resInfo.returnCodeInfo = '成功'; //'成功';
		                	this.dialogFormVisibleQuota = false
		                	this.getInfo(resInfo)
		                }else{
		                	resInfo.returnCodeInfo = '失败'; 
							resInfo.returnMsgInfo = res.returnMsg;
							this.dialogFormVisibleQuota = false
		                	this.getInfo(resInfo)
		                }
		            })
	       		}else{
	       			this.$message('请输入授信额度')
	       		}
	      	}else if(this.tempQuota.adjustType == '3' || this.tempQuota.adjustType == '5'){
	      		if (!this.tempQuota.creditLimit) {
					this.$message('请输入授信额度！') //"请输入授信额度！");
				} else if (!this.tempQuota.limitEffectvDate) {
					this.$message('请输入临时额度生效日期！')//"请输入临时额度生效日期！");
				} else if (!this.tempQuota.limitExpireDate) {
					this.$message('请输入临时额度失效日期!')//"请输入临时额度失效日期！");
				}else {
					let resInfo = {};
					resInfo.operationModesInfo = this.tempQuota.operationModeInfo;
					resInfo.externalIdentificationNo = this.tempQuota.externalIdentificationNo; //外部识别号
					resInfo.customerNo = this.tempQuota.customerNoInfo; //客户号
					resInfo.creditNodeNo = this.tempQuota.creditNodeNo;
					resInfo.tempLimitInfo = this.tempQuota.creditLimit;
					resInfo.startDateInfo = this.tempQuota.limitEffectvDate;
					resInfo.endDataInfo = this.tempQuota.limitExpireDate;
					if (this.tempQuota.currencyCode == '156') {
						$scope.resInfo.currencyCodeInfo = T.T('F00088'); //'人民币';
					} else if (this.tempQuota.currencyCode == '840') {
						$scope.resInfo.currencyCodeInfo = T.T('F00095'); //'美元';
					}
					if (this.tempQuota.adjustType == '1') {
						resInfo.adjustTypeInfo = '永额调升'; //'永额调升';
					} else if (this.tempQuota.adjustType == '2') {
						resInfo.adjustTypeInfo = '永额调降'; //'永额调降';
					} else if (this.tempQuota.adjustType == '3') {
						resInfo.this = '临额调升'; //'临额调升';
					} else if (this.tempQuota.adjustType == '4') {
						resInfo.adjustTypeInfo = '临额取消'; //'临额取消';
					} else if (this.tempQuota.adjustType == '5') {
						resInfo.adjustTypeInfo = '临额调降'; //'临额调降';
					}
					let  adjustParams = {
						operationMode: this.tempQuota.operationMode, //运营模式
						externalIdentificationNo: $scope.this.tempQuota.externalIdentificationNo, //外部识别号
						customerNo: this.tempQuota.customerNo, //客户号
						creditNodeNo: this.tempQuota.creditNodeNo, //调额节点
						adjustType: this.tempQuota.adjustType, //调额类型
						currencyCode: this.tempQuota.currencyCode, //币种
						creditLimit: this.tempQuota.creditLimit, //授信额度
						limitEffectvDate: this.tempQuota.limitEffectvDate, //生效日期
						limitExpireDate: this.tempQuota.limitExpireDate, //失效日期
						budgetOrgCode: this.queryFormObj.idNumber 
					};
					this.post('/nonfi/nonfinanceService/OCS.RT.01.0002', adjustParams, (res) => {
		                if(res.Data == 'OK'){
		                	resInfo.returnCodeInfo = '成功'; //'成功';
		                	this.dialogFormVisibleQuota = false
		                	this.getInfo(adjustParams)
		                }else{
		                	resInfo.returnCodeInfo = '失败'; 
							resInfo.returnMsgInfo = res.returnMsg;
							this.dialogFormVisibleQuota = false
		                	this.getInfo(adjustParams)
		                }
		            })
				}
	      	}else{
	      		let resInfo = {};
				resInfo.operationModesInfo = this.tempQuota.operationModeInfo;
				resInfo.externalIdentificationNo = $scope.adjustInfo.externalIdentificationNo; //外部识别号
				resInfo.customerNo = $scope.adjustInfo.customerNoInfo; //客户号
				resInfo.creditNodeNo = this.tempQuota.creditNodeNo;
				resInfo.tempLimitInfo = this.tempQuota.creditLimit;
				resInfo.startDateInfo = this.tempQuota.limitEffectvDate;
				resInfo.endDataInfo = this.tempQuota.limitExpireDate;
				if (this.tempQuota.currencyCode == '156') {
					resInfo.currencyCodeInfo = T.T('F00088'); //'人民币';
				} else if (this.tempQuota.currencyCode == '840') {
					resInfo.currencyCodeInfo = T.T('F00095'); //'美元';
				}
				if (this.tempQuota.adjustType == '1') {
					resInfo.adjustTypeInfo = '永额调升'; //'永额调升';
				} else if (this.tempQuota.adjustType == '2') {
					resInfo.adjustTypeInfo = '永额调降'; //'永额调降';
				} else if (this.tempQuota.adjustType == '3') {
					resInfo.adjustTypeInfo ='临额调升'; //'临额调升';
				} else if (this.tempQuota.adjustType == '4') {
					resInfo.adjustTypeInfo = '临额取消'; //'临额取消';
				} else if (this.tempQuota.adjustType == '5') {
					resInfo.adjustTypeInfo = '临额调降'; //'临额调降';
				}
				$scope.adjustParams = {
					operationMode: this.tempQuota.operationMode, //运营模式
					externalIdentificationNo: this.tempQuota.externalIdentificationNo, //外部识别号
					customerNo: this.tempQuota.adjustInfo.customerNo, //客户号
					creditNodeNo: this.tempQuota.creditNodeNo, //调额节点
					adjustType: this.tempQuota.adjustType, //调额类型
					currencyCode: this.tempQuota.currencyCode, //币种
					creditLimit: this.tempQuota.creditLimit, //授信额度
					limitEffectvDate: this.tempQuota.limitEffectvDate, //生效日期
					limitExpireDate: this.tempQuota.limitExpireDate, //失效日期
					budgetOrgCode: this.tempQuota.budgetOrgCode
				};
	      	}
     	},
   		//授信结果信息显示弹框
   		getInfo(row){
   			this.dialogFormVisibleInfo = true
			this.tempInfo = {}
	      	this.tempInfo = Object.assign({}, resInfo) 
	      	this.$nextTick(() => {
		        this.$refs['dataFormInfo'].clearValidate()
	      	})
   		},
  	}
   
}
</script>
<style>
</style>

<!-- 实时余额平衡查询 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryForm" :rules="queryFormRules">
        	<el-form-item class="cl_td" label="证件类型" prop="idType" >
                <el-select v-model="queryForm.idType" class="wd200">
                <el-option v-for="(item, index) in idTypeList" 
                	:key="index" 
                	:label="item.detailDesc" 
                	:value="item.codes" />
                </el-select>
            </el-form-item>
           	<el-form-item class="cl_td" label="证件号码" prop="idNumber">
                <el-input v-model="queryForm.idNumber" class="wd200" type="text"/>
            </el-form-item>
            <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                <el-input v-model="queryForm.externalIdentificationNo" class="wd200" type="text"/>
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" >查询</el-button>
                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="reset()" >重置</el-button>
            </div>
        </el-form>
        <div v-show='showDiv'>	
        	<div class="clearboth"></div>
        	<div clas="mainname">客户基本信息</div>
        	<el-form ref="infoRef" :model="tempInfo" :rules="queryFormInfo">
	        	<el-form-item class="cl_td" label="证件类型" prop="idType" >
	                <el-select v-model="tempInfo.idType" class="wd200">
	                <el-option v-for="(item, index) in idTypeList" 
	                	:key="index" 
	                	:label="item.detailDesc" 
	                	:value="item.codes" />
	                </el-select>
	            </el-form-item>
	           	<el-form-item class="cl_td" label="证件号码" prop="idNumber">
	                <el-input v-model="tempInfo.idNumber" class="wd200" type="text"/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="客户名称" prop="customerName">
	                <el-input v-model="tempInfo.customerName" class="wd200" type="text"/>
	            </el-form-item>
	        </el-form>
		</div>
		<div class="clearboth"></div>
		<div class="text_title" v-if="showDiv==true">2.实时余额平衡信息</div>
		<div v-if="showDiv==false" class="text_title">实时余额平衡信息</div>
        <el-table v-loading = "listLoading1" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
            <el-table-column prop="customerNo" label="客户号" align="center" width="150px"/>
            <el-table-column prop="currencyCode" label="币种" align="center" />
            <el-table-column prop="businessProgramNoDesc" label="业务项目" align="center" />
            <el-table-column prop="productObjectCodeDesc" label="产品对象" align="center" />
            <el-table-column prop="businessTypeCodeDesc" label="业务类型" align="center" />
            <el-table-column prop="transIdentifiNo" label="交易识别	" align="center" />
            <el-table-column prop="rejTrasnRetainDays" label="金额信息" align="center" />
            	<span class="text_color">账单本金金额(余额单元)： {{tableList.billPrincipalBalCard}}<br></span>
                <span class="text_color">账单本金金额 (实时余额)： {{tableList.billPrincipalBalAuth}}<br></span>
                <span class="text_color">账单费用金额(余额单元)： {{tableList.billCostBalCard}}<br></span>
                <span class="text_color">账单费用金额 (实时余额)： {{tableList.billCostBalAuth}}<br></span>
                <span class="text_color">账单利息金额 (余额单元)： {{tableList.billInterestBalCard}}<br></span>
                <span class="text_color">账单利息金额(实时余额)： {{tableList.billInterestBalAuth}}<br></span>
            </el-table-column>
            <el-table-column prop="" label="操作" align="center" width="200px">
                <template slot-scope="{row}">
                	<el-button size="mini" icon="el-icon-more" type="primary" @click="handleDetail(row)" >查询</el-button>
                	<el-button size="mini" icon="el-icon-edit" type="primary" @click="handleUpData(row)" >修改</el-button>
                </template> 
            </el-table-column>
        </el-table>
        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="getList" />
  		<!--查询详情-->
		<el-dialog title="实时余额详细信息" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail" :rules="rulesDetail" :model="tempDetail" >
	            <el-form-item class="cl_td" label="账户代码" prop="accountId">
                   <el-input v-model="tempDetail.accountId" class="wd200" type="text" maxlength="5"/>
                </el-form-item>
                <el-form-item class="cl_td" label="客户号" prop="customerNo">
                   <el-input v-model="tempDetail.customerNo" class="wd200" type="text" maxlength="50" />
                </el-form-item>
                <el-form-item class="cl_td" label="币种" prop="currencyCode">
                   <el-input v-model="tempDetail.currencyCode" class="wd200" type="text"  maxlength="8"/>
                </el-form-item>
                <el-form-item class="cl_td" label="业务项目" prop="">
                   <span>{{tempDetail.businessProgramNo}} {{tempDetail.programDesc}}</span>
                </el-form-item>
                <el-form-item class="cl_td" label="重复检查天数" prop="">
                  <span>{{tempDetail.productObjectCode}} {{tempDetail.productDesc}}</span>
                </el-form-item>
                <el-form-item class="cl_td" label="拒绝交易保留天数" prop="">
                   <span>{{tempDetail.businessTypeCode}} {{tempDetail.businessDesc}}</span>
                </el-form-item>
                <el-form-item class="cl_td" label="币种" prop="transIdentifiNo">
                   <el-input v-model="tempDetail.transIdentifiNo" class="wd200" type="text" readonly />
                </el-form-item>
                <div class="col_td"></div>
                <el-form-item class="cl_td" label="账单本金金额(余额单元)" prop="billPrincipalBalCard">
                   <el-input v-model="tempDetail.billPrincipalBalCard" class="wd200" type="text"  readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="账单本金金额 (实时余额)" prop="billPrincipalBalAuth">
                   <el-input v-model="tempDetail.billPrincipalBalAuth" class="wd200" type="text"  readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="账单费用金额(余额单元)" prop="billCostBalCard">
                   <el-input v-model="tempDetail.billCostBalCard" class="wd200" type="text"  readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="账单费用金额 (实时余额)" prop="billCostBalAuth">
                   <el-input v-model="tempDetail.billCostBalAuth" class="wd200" type="text"  readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="账单利息金额 (余额单元)" prop="billInterestBalAuth">
                   <el-input v-model="tempDetail.billInterestBalAuth" class="wd200" type="text"  readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="当期本金金额(余额单元)" prop="currPrincipalBalCard">
                   <el-input v-model="tempDetail.currPrincipalBalCard" class="wd200" type="text"  readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="当期本金金额 (实时余额)" prop="currPrincipalBalAuth">
                   <el-input v-model="tempDetail.currPrincipalBalAuth" class="wd200" type="text"  readonly />
                </el-form-item>
                 <el-form-item class="cl_td" label="当期费用金额 (余额单元)" prop="currCostBalCard">
                   <el-input v-model="tempDetail.currCostBalCard" class="wd200" type="text"  readonly />
                </el-form-item>
                 <el-form-item class="cl_td" label="当期费用金额 (实时余额)" prop="currCostBalAuth">
                   <el-input v-model="tempDetail.currCostBalAuth" class="wd200" type="text"  readonly />
                </el-form-item>
                 <el-form-item class="cl_td" label="当期利息金额(余额单元)" prop="currInterestBalCard">
                   <el-input v-model="tempDetail.currInterestBalCard" class="wd200" type="text"  readonly />
                </el-form-item>
                 <el-form-item class="cl_td" label="当期利息金额 (实时余额)" prop="currInterestBalAuth">
                   <el-input v-model="tempDetail.currInterestBalAuth" class="wd200" type="text" readonly />
                </el-form-item>
            </el-form>
	    	<div slot="footer" class="dialog-footer">
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
        	//权限
        	selBtnFlag: false,
            addBtnFlag: false,
            updBtnFlag: false,
           	logininfo: '',
            // 列表
            queryForm: {
                pageNum: 1,
                pageSize:10,
            },
            listLoading1: false,
            queryFormRef: {},
            queryFormRules: {},      
            tableList: [],
            tableTotal: 0,
          	//下拉
            idTypeList: [],
            operationModeOptions: [],//运营模式
            dataReceivingModeOptions: [],//数据接收模式
            transBillingStateOptions: [],
            
            //客户基本信息
            infoRef: {},
            tempInfo: {},
            queryFormInfo: {},
           //详情
            dialogFormVisibleDetail: false,
            dataFormDetail: {},
            tempDetail: {},
            rulesDetail: {},
            showDiv: false,
        }
    },
    created() {
       
    },
    mounted() {
        this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))  //获取用户登录权限
        this.getList()
		//证件类型
		this.getSelectDict('dic_certificateType').then((res) => {
            this.idTypeList = res
        })
		//交易入账状态
		this.getSelectDict( "dic_transactionEntryStatus").then(res => {
            this.transBillingStateOptions = res
        })
		//运营模式
		this.getSelectDict( "/beta/betaService/COS.IQ.02.0006").then(res => {
            this.operationModeOptions = res
        })
		//数据接收模式
		this.getSelectDict( "dic_dataReceivingMode").then(res => {
            this.dataReceivingModeOptions = res
        })
		
   	},
    methods: {
    	//重置
        reset(){
        	this.queryForm = {}
        },
        //基本信息
        getInfo() {
        	this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0001', this.queryForm,(res) => {
                if (res.returnCode == '000000') {
                	this.showDiv = true
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.tempInfo = res.returnData.rows[0]
                        
                    }else{
                    	this.showDiv = false
                    }
                }
            })
        },
       	// 列表
        getList() {
            this.listLoading1 = true
            let params = {
            	operationMode : this.logininfo.operationMode,
				_CART: "A",
            }
            params = Object.assign ( params, this.queryForm )
           	this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0119', this.queryForm,(res) => {
                if (res.returnCode == '000000') {
                	this.listLoading1 = false
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.tableList = res.returnData.rows
                        
                        this.tableList.forEach(item =>{
                        	item.businessProgramNoDesc=item.businessProgramNo +''+item.programDesc
                        	item.productObjectCodeDesc=item.productObjectCode +''+item.productDesc
                        	item.businessTypeCodeDesc=item.businessTypeCode +''+item.businessDesc
                        })
                        if((this.queryForm.idType && this.queryForm.idNumber) || this.queryForm.externalIdentificationNo){
							this.showDiv = true;
							this.getInfo($scope.basicInf);
						}else {
							this.showDiv = false
						}
                        this.tableTotal = res.returnData.totalCount
                    }else{
                        this.tableList = []
                        this.tableTotal = 0
                    }
                }
            })
        },
        //搜索
        handleSearch() {
        	if((this.queryForm.idNumber != "" && this.queryForm.idNumber != null && this.queryForm.idNumber != undefined) && 
                (this.queryForm.idType == "" || this.queryForm.idType == null || this.queryForm.idType == undefined) ){
                this.$message('证件类型不能为空！');
                return;
            }
            if((this.queryForm.idType != "" && this.queryForm.idType != null && this.queryForm.idType != undefined)){
                this.queryForm.idTyp = this.idType;
                if(this.queryForm.idNumber != "" && this.queryForm.idNumber != null && this.queryForm.idNumber != undefined){   
                    this.queryForm.idNo = this.queryForm.idNumber;
                }else{
                    this.$message('证件号码不能为空！');
                    return;
                }
            }
            if ((this.queryForm.idNumber == "" || this.queryForm.idNumber == null || this.queryForm.idNumber == undefined) && 
                (this.queryForm.idType == "" || this.queryForm.idType == null || this.queryForm.idType == undefined) &&
                (this.queryForm.externalIdentificationNo == "" || this.queryForm.externalIdentificationNo == null || 
                this.queryForm.externalIdentificationNo == undefined)){
                this.$message('请输入条件进行查询');
                return;
            }else if((this.queryForm.idNumber) && (this.queryForm.externalIdentificationNo)){
                this.$message('证件号和外部识别号只能选择输入一种！');
                return;
            }
            this.getList()
        },
        //详情展示的弹框
        handleDetail(row) {
            this.tempDetail = {}
            this.tempDetail = Object.assign({}, row)
            this.dialogFormVisibleDetail = true
            this.$nextTick(() => {
                this.$refs['dataFormDetail'].clearValidate()
            })
        }, 
    }
}
</script>

<style>
</style>

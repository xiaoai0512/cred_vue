<!-- 核算状态维护 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form :model="queryForm">
           	 <el-form-item class="cl_td" label="证件类型" prop="idType">
                <el-select v-model="queryForm.idType" class="wd200">
                <el-option v-for="(item, index) in idTypeList" :key="index" :label="item.detailDesc" :value="item.codes" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="证件号码" prop="idNumber">
                <el-input v-model="queryForm.idNumber" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
                <el-input v-model="queryForm.externalIdentificationNo" class="wd200" type="text" />
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()">查询</el-button>
                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="reset()">重置</el-button>
            </div>
        </el-form>
        <div v-if="showDiv">
        	<div class="text_title">1.客户基本信息</div>
        	<el-form :model="relationInfo">
	            <el-form-item class="cl_td" label="证件类型" prop="idType">
	                <el-select v-model="relationInfo.idType" class="wd200" disabled readonly>
	                <el-option v-for="(item, index) in idTypeList" :key="index" :label="item.detailDesc" :value="item.codes" />
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="证件号码" prop="idNumber">
	                <el-input v-model="relationInfo.idNumber" class="wd200" type="text" readonly/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="客户名称" prop="customerName">
	                <el-input v-model="relationInfo.customerName" class="wd200" type="text" readonly/>
	            </el-form-item>
	        </el-form>
	        <div class="clearboth"></div>
	        <div class="text_title">2.核算状态维护 </div>   
        	<el-table v-loading = "listLoading" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
	          	<el-table-column prop="delinquencyLevelDesc" label="延滞层级" align="center" />
                <el-table-column prop="levelCode" label="层级代码" align="center" />
	            <el-table-column prop="productObjectNoDesc" label="产品对象代码" align="center" />
	            <el-table-column prop="cycleNo" label="最大周期号" align="center" />
	            <el-table-column prop="accountingStatusCode" label="核算状态码" align="center"/>
	            <el-table-column prop="currencyDesc" label="币种" align="center"/>
	            <el-table-column prop="cycleDueNum" label="逾期期数" align="center"/>
	            <el-table-column prop="" label="操作" align="center" >
	                <template slot-scope="{row}">
	                	<el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleProductInfo(row)">核算状态维护</el-button><!--v-show="updBtnFlag"-->
                 	</template> 
	            </el-table-column>
        	</el-table>
	        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="getList" />
    		<el-dialog title="核算状态维护" :visible.sync="dialogFormVisibleDetail" width="65%">
	    		<el-form ref="detailRef" :model="tempDetail" :rules="detailRules">
	               	<el-form-item class="cl_td" label="本金" prop="prinAmount" >
	                    <el-input v-model="tempDetail.prinAmount" class="wd200" type="text"  readonly />
	               	</el-form-item>
	               	<div class="clearboth"></div>
	               	<el-form-item class="cl_td" label="利息" prop="intAmount" >
	                    <el-input v-model="tempDetail.intAmount" class="wd200" type="text"  readonly/>
	               	</el-form-item>
	               	<el-form-item class="cl_td" label="费用" prop="feeAmount" >
	                    <el-input v-model="tempDetail.feeAmount" class="wd200" type="text"  readonly/>
	               	</el-form-item>
	               	<el-form-item class="cl_td" label="原核算状态" prop="accountingStatusCode">
	               		<el-select v-model="tempDetail.accountingStatusCode" class="wd200" disabled readonly>
	                        <el-option 
	                            v-for="(item, index) in oldAccountingStatusOptions" 
	                            :key="index" 
	                            :label="item.label" 
	                            :value="item.value"/>
	                    </el-select>
	                </el-form-item>
	                <!--<el-form-item v-if="newStatusDiv1" class="cl_td" label="新核算状态1" prop="newAccountingStatus2">
	                    <el-select v-model="tempDetail.newAccountingStatus2" class="wd200" >
	                        <el-option 
	                        	ref="newAccountingStatus1"
	                            v-for="(item, index) in newAccountingStatus2Options1" 
	                            :key="index" 
	                            :label="item.modeName" 
	                            :value="item.operationMode"/>
	                    </el-select>
	                </el-form-item>
	                <el-form-item v-if="newStatusDiv2" class="cl_td" label="新核算状态2" prop="newAccountingStatus2">
	                    <el-select v-model="
	                    	
	                    	
	                    	.newAccountingStatus2" class="wd200" >
	                        <el-option 
	                        	ref="newAccountingStatus2"
	                            v-for="(item, index) in newAccountingStatus2Options2" 
	                            :key="index" 
	                            :label="item.modeName" 
	                            :value="item.operationMode"/>
	                    </el-select>
	                </el-form-item>-->
	    		</el-form>
		    	<div slot="footer" class="dialog-footer">
		            <el-button  type="primary" @click="dialogFormVisibleDetail = false"> 关闭</el-button>
		            <el-button type="primary" @click="subDetailData()"> 确定</el-button>
		        </div>  
	        </el-dialog>
    	</div>
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
	           	showDiv: false,
	           	showMedium: false,
	            logininfo: '',
	            templateRadio: false,
	            // 列表
	            queryForm: {
	                pageNum: 1,
	                pageSize:10,
	            },
	            relationInfo: {},
	            mediaInfo: {},
	            listLoading: false,
	            queryFormRef: {},
	            queryFormRules: {},      
	            tableList: [],
	            tableTotal: 0,
	            list_formatCode: '',
	            newCard: '',
	            // 下拉框
	            idTypeList: [],//证件类型
	            institutionIdOptions: [],//所属机构
	            operationModeOptions: [],//运营模式
	            oldAccountingStatusOptions: [],//原核算状态
				newAccountingStatus2Options1: [],//新核算状态
				newAccountingStatus2Options2: [],
	           	//产品升降级详情
	            tempDetail: {},
	            detailRules: {},
	            detailRef: {},
	            dialogFormVisibleDetail: false,
	            newStatusDiv1: false,
	            newStatusDiv2: false,
	            allAccountingStatusCode: '',
    		}
        },
        created() {
        	
        },
        mounted() {
        	this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))  //获取用户登录权限
            this.getSelectDict('dic_certificateType').then((res) => {
		        this.idTypeList = res
	      	})
             
            // 运营模式
            this.getSelectDict( "/beta/betaService/COS.IQ.02.0006").then(res => {
                this.operationModeOptions = res
            })
		},
      methods: {
        init() {
            this.queryForm = {
                idType: '',
                idNumber: '',
                externalIdentificationNo: '',
            }
            this.showDiv  = false
        },
      // 重置
      reset() {
        this.init()
      },
      // 点击查询按钮
      handleSearch() {
        if (!this.queryForm.externalIdentificationNo && !this.queryForm.idType && !this.queryForm.idNumber) {
          this.$message({
            message: '请输入查询信息',
            type: 'warning'
          })
          this.init()
        } else {
          if (this.queryForm.idType) {
            if (!this.queryForm.idNumber) {
              this.$message({
                message: '请输入证件号码',
                type: 'warning'
              })
            } else {
              this.getList()
              this.getInfo()
            }
          } else if (this.queryForm.idNumber) {
            if (!this.queryForm.idType) {
              this.$message({
                message: '请输入证件类型',
                type: 'warning'
              })
            } else {
              this.getList()
              this.getInfo()
            }
          } else {
            this.getList()
         	this.getInfo() 
		}
        }
      },
        // 列表
        getList() {
            this.listLoading = true
            this.showDiv = true
            let params = {
            	flag: "2",
            	idType: this.queryForm.idType,
            	idNumber: this.queryForm.idNumber,
            	externalIdentificationNo: this.queryForm.externalIdentificationNo,
            	isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_delinquencyLevel'],//查找数据字典所需参数
				transDict : ['delinquencyLevel'],//翻译前后key
            }
            
            this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0160', params,(res) => {
           		this.listLoading = false
           		if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                		this.tableList = res.returnData.rows;
                		this.tableTotal = res.returnData.totalCount;
                		this.tableList.forEach(item=>{
                			item.productObjectNoDesc = item.productObjectNo+ ''+item.productDesc
                			if(item.currencyDesc==null){
                				item.currencyDesc = item.currencyCode
                			}else{
                				item.currencyDesc = item.currencyCode+ ''+item.currencyDesc
                			}
                		})
						
                    }
                }
            })
        },
        getInfo() {
            this.showDiv = true
            let obj1 = {
            	evnetId:'ISS.OP.01.0012',
            	externalIdentificationNo: this.queryForm.externalIdentificationNo,
            }
           	this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0001',obj1,(res) => {
           		this.listLoading = false
           		if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                		this.relationInfo = res.returnData.rows[0];
         			}
                }
            })
        },
//      //点击单选获取数据
//      getTemplateRow(row){
//	        this.newCard = row
//	        if(this.newCard.invalidFlag== 'N' ){
//				if (this.newCard.invalidReason == "TRF") {
//					 this.$message("该卡已经转卡")//"该卡已经转卡!"
//					return;
//				}else if (this.newCard.invalidReason == "EXP") {
//					 this.$message("该卡已经到期")//"该卡已经到期!"
//					return;
//				}else if (this.newCard.invalidReason == "BRK") {
//					 this.$message("该卡已经毁损")//"该卡已经毁损!"
//					return;
//				}else if (this.newCard.invalidReason == "CLS") {
//					 this.$message("该卡已经关闭")//"该卡已经关闭!"
//					return;
//				}else if (this.newCard.invalidReason == "PNA") {
//					 this.$message("该卡已经提前续卡")//"该卡已经提前续卡!"
//					return;
//				}
//	       	}else{
//		        	this.showMedium = true
//		        	this.getmediaInfo()
//		        }
//	    },
	    //查看核算状态太维护
	    handleProductInfo(row){
	    	this.tempDetail = Object.assign({}, row)
//	    	/this.getNewProductObjectCodeNewOptions()
	    	//this.getProductObjectCodeNewOptions()
	    	this.dialogFormVisibleDetail = true
	        this.$nextTick(() => {
	            this.$refs['detailRef'].clearValidate()
	        })
	    },
	    //监听核算状态下拉
	    getNewProductObjectCodeNewOptions(){
	    	let obj2={
            	Flag: "Y",
            }
            this.post("/beta/betaService/COS.IQ.02.0051",obj2,(res)=> {
			 	if (res.returnCode == '000000') {
					if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
						let arr = []
	                        let rows = res.returnData.rows
	                        rows.forEach((item, index) => {
	                            item.oldAccountingStatusDesc = item.accountingStatus+ ' '+ item.accountingDesc
	                            let arr2 = []
	                            if(item.nextAccountingStatus=='001' || item.nextAccountingStatus=='003'){
	                          		this.tempDetail.arr2 = item.nextAccountingStatus+''+'关注 M1-M3'
	                          		this.tempDetail.arr2 = item.nextAccountingStatus+''+'可以 M5-M6'
	                          		console.log(this.tempDetail.arr2)
	                          	}
	                            arr[index] = {
	                                label: item.oldAccountingStatusDesc,
	                                value: item.accountingStatus
	                            }
	                        })
	                        this.oldAccountingStatusOptions2.push(arr2)
	                        this.oldAccountingStatusOptions = arr
	                } else {
	                    this.oldAccountingStatusOptions = []
	                }
	           }
      	 	})
        },
		//确认修改产品升降级数据
        subDetailData() {
        	let obj2= {
            	idNumber:this.relationInfo.idNumber,
            	idType: this.relationInfo.idType,
            	customerNo: this.tempDetail.customerNo,
            	invalidDateOldCard:  this.tempDetail.invalidDateOldCard,
            	operationMode: this.tempDetail.operationMode,
            	productObjectCode: this.tempDetail.productObjectCode,
            	productObjectCodeNew: this.tempDetail.value,
            	externalIdentificationNo: this.queryForm.externalIdentificationNo
            }
        	obj2 = Object.assign(this.tempDetail, obj2)
        	this.post('/card/cardService/BSS.RT.01.0001',obj2,(res) => {
           		if (res.returnCode == '000000') {
                 	this.dialogFormVisibleDetail = false
                    this.$notify({
                        title: 'Success',
                        message: '修改成功',
                        type: 'success',
                        duration: 2000
                    })
                    this.getList()
	            }
            })
        },
    }
}
</script>

<style>
</style>

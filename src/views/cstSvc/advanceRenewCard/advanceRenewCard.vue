<!-- 提前续卡 -->
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
        	<el-form :model="customerInfo">
	            <el-form-item class="cl_td" label="证件类型" prop="idType">
	                <el-select v-model="customerInfo.idType" class="wd200" disabled readonly>
	                <el-option v-for="(item, index) in idTypeList" :key="index" :label="item.detailDesc" :value="item.codes" />
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="证件号码" prop="idNumber">
	                <el-input v-model="customerInfo.idNumber" class="wd200" type="text" readonly/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="客户姓名" prop="customerName">
	                <el-input v-model="customerInfo.customerName" class="wd200" type="text" readonly/>
	            </el-form-item>
	        </el-form>
	        <div class="clearboth"></div>
	        <div class="text_title">2.客户制卡信息</div>   
        	<el-table v-loading = "listLoading" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
	            <el-table-column width="80" align="center" label="选择">
                    <template scope="scope">
                        <el-radio v-model="templateRadio" :label="scope.$index" @change.native="getTemplateRow(scope.row)">{{""}}</el-radio>
                    </template>
                </el-table-column>
	            <el-table-column prop="mediaObjectCodeDesc" label="媒介对象" align="center" />
	            <el-table-column prop="productObjectCodeDesc" label="产品对象" align="center" />
	            <el-table-column prop="externalIdentificationNo" label="外部识别号" align="center" />
	            <el-table-column prop="expirationDate" label="有效期" align="center"/>
	            <el-table-column prop="mainSupplyIndicatorDesc" label="主附卡标识" align="center" />
	            <el-table-column prop="mediaUserName" label="媒介使用者姓名" align="center"/>
             	<el-table-column prop="invalidFlagDesc" label="是否有效标识" align="center"/>
              	<el-table-column prop="invalidReasonDesc" label="无效原因" align="center"/>
         	</el-table>
	        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="getList" />
    		<div v-if="showMedium">
	    		<div class="text_title">3.媒介信息详情</div>
	    		<el-form :model="mediumInfo">
		            <el-form-item class="cl_td" label="媒介单元代码" prop="mediaUnitCode">
		                <el-input v-model="mediumInfo.mediaUnitCode" class="wd200" type="text" readonly/>
		            </el-form-item>
		            <el-form-item class="cl_td" label="媒介对象代码" prop="mediaObjectCodeTrans">
		                <el-input v-model="mediumInfo.mediaObjectCodeDesc" class="wd200" type="text"readonly />
		            </el-form-item>
		            <el-form-item class="cl_td" label="产品对象代码" prop="productObjectCodeDesc">
		                <el-input v-model="mediumInfo.productObjectCodeDesc" class="wd200" type="text" readonly/>
		            </el-form-item>
		            <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
		                <el-input v-model="mediumInfo.externalIdentificationNo" class="wd200" type="text"readonly />
		            </el-form-item>
		            <el-form-item class="cl_td" label="主副卡标识" prop="mainSupplyIndicatorStr">
		                <el-input v-model="mediumInfo.mainSupplyIndicatorStr" class="wd200" type="text" readonly/>
		            </el-form-item>
		            <el-form-item class="cl_td" label="使用者姓名" prop="mediaUserName">
		                <el-input v-model="mediumInfo.mediaUserName" class="wd200" type="text" readonly/>
		            </el-form-item>
		            <el-form-item class="cl_td" label="主客户代码" prop="mainCustomerNo">
		                <el-input v-model="mediumInfo.mainCustomerNo" class="wd200" type="text" readonly/>
		            </el-form-item>
		            <el-form-item class="cl_td" label="副客户代码 " prop="mediaHolderNo">
		                <el-input v-model="mediumInfo.mediaHolderNo" class="wd200" type="text" readonly/>
		            </el-form-item>
		            <el-form-item class="cl_td" label="所属机构" prop="organNo">
		                <el-select v-model="mediumInfo.organNo" class="wd200" disabled>
		                <el-option v-for="(item, index) in institutionIdOptions" 
		                	:key="index" 
		                	:label="item.organName" 
		                	:value="item.organNo" />
		                </el-select>
		            </el-form-item>
		            <el-form-item class="cl_td" label="运营模式" prop="operationMode">
		                <el-select v-model="mediumInfo.operationMode" class="wd200" disabled>
		                <el-option v-for="(item, index) in operationModeOptions" 
		                	:key="index" 
		                	:label="item.modeName" 
		                	:value="item.operationMode" />
		                </el-select>
		            </el-form-item>
		            <el-form-item class="cl_td" label="有效期 " prop="expirationDate">
		                <el-input v-model="mediumInfo.expirationDate" class="wd200" type="text" readonly/>
		            </el-form-item>
		            <el-form-item class="cl_td" label="上一有效期 " prop="previousExpirationDate">
		                <el-input v-model="mediumInfo.previousExpirationDate" class="wd200" type="text" readonly/>
		            </el-form-item>
		            <el-form-item class="cl_td" label="新建日期" prop="createDate">
		                <el-input v-model="mediumInfo.createDate" class="wd200" type="text" readonly/>
		            </el-form-item>
		            <el-form-item class="cl_td" label="刻印名 " prop="embosserName1">
		                <el-input v-model="mediumInfo.embosserName1" class="wd200" type="text" readonly/>
		            </el-form-item>
		            <el-form-item class="cl_td" label="进件人员编号 " prop="applicationStaffNo">
		                <el-input v-model="mediumInfo.applicationStaffNo" class="wd200" type="text" readonly/>
		            </el-form-item>
		            <el-form-item class="cl_td" label="分行号" prop="branchNumber">
		                <el-input v-model="mediumInfo.branchNumber" class="wd200" type="text"readonly />
		            </el-form-item>
		            <el-form-item class="cl_td" label="申请书编号 " prop="applicationNumber">
		                <el-input v-model="mediumInfo.applicationNumber" class="wd200" type="text" readonly/>
		            </el-form-item>
		            <el-form-item class="cl_td" label="营销人员编号 " prop="marketerCode">
		                <el-input v-model="mediumInfo.marketerCode" class="wd200" type="text" readonly/>
		            </el-form-item>
		            <el-form-item class="cl_td" label="密码函领取标志 " prop="pinDispatchMethod">
		                 <el-select v-model="mediumInfo.pinDispatchMethod" class="wd200" disabled>
		                	<el-option v-for="(item, index) in pinDispatchMethodOptions" 
		                		:key="index" 
		                		:label="item.detailDesc" 
		                		:value="item.codes" />
		                </el-select>
		            </el-form-item>
		            <el-form-item class="cl_td" label="媒介领取标志  " prop="mediaDispatchMethod">
		                <el-select v-model="mediumInfo.mediaDispatchMethod" class="wd200" disabled>
		                	<el-option v-for="(item, index) in mediaDispatchMethodOptions" 
		                		:key="index" 
		                		:label="item.detailDesc" 
		                		:value="item.codes" />
		                </el-select>
		            </el-form-item>
		            <el-form-item class="cl_td" label="激活标识  " prop="activationFlag">
		                <el-select v-model="mediumInfo.activationFlag" class="wd200" disabled>
		                	<el-option v-for="(item, index) in activationFlagOptions" 
		                		:key="index" 
		                		:label="item.detailDesc" 
		                		:value="item.codes" />
		                </el-select>
		            </el-form-item>
		            <el-form-item class="cl_td" label="激活方式  " prop="activationMode">
		                <el-select v-model="mediumInfo.activationMode" class="wd200" disabled>
		                	<el-option v-for="(item, index) in activationModeOptions" 
		                		:key="index" 
		                		:label="item.detailDesc" 
		                		:value="item.codes" />
		                </el-select>
		            </el-form-item>
		           <el-form-item class="cl_td" label="激活日期" prop="activationDate">
	                    <el-date-picker class="wd200" disabled
	                        v-model="mediumInfo.activationDate"
	                        type="date"
	                        value-format="yyyy-MM-dd"
	                        placeholder="选择日期">
	                    </el-date-picker>
					</el-form-item>
		            <el-form-item class="cl_td" label="年费日期" prop="annualFeeDate">
	                    <el-date-picker class="wd200" disabled
	                        v-model="mediumInfo.annualFeeDate"
	                        type="date"
	                        value-format="yyyy-MM-dd"
	                        placeholder="选择日期">
	                    </el-date-picker>
					</el-form-item>
		           	<el-form-item class="cl_td" label="免首年年费日期" prop="waiveFirstAnnualFeeDate">
	                    <el-date-picker class="wd200" disabled
	                        v-model="mediumInfo.waiveFirstAnnualFeeDate"
	                        type="date"
	                        value-format="yyyy-MM-dd"
	                        placeholder="选择日期">
	                    </el-date-picker>
					</el-form-item>
		            <el-form-item class="cl_td" label="上一年费收取周期号 " prop="lastAnnualFeeCycleNo">
		                <el-input v-model="mediumInfo.lastAnnualFeeCycleNo" class="wd200" type="text" readonly />
		            </el-form-item>
		            <el-form-item class="cl_td" label="是否有效标识 " prop="invalidFlagStr">
		                <el-input v-model="mediumInfo.invalidFlagStr" class="wd200" type="text" readonly/>
		            </el-form-item>
		            <el-form-item class="cl_td" label="失效原因 " prop="invalidReasonStr">
		                <el-input v-model="mediumInfo.invalidReasonStr" class="wd200" type="text" readonly/>
		            </el-form-item>
		        </el-form>
	        </div>
	        <div class="clearboth"></div>
    		<div slot="footer" class="cl_tr text_center">
	            <el-button type="primary" icon="el-icon-plus" @click="subData()"> 确定提前续卡</el-button>
	        </div>  
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
	            customerInfo: {},
	            mediumInfo: {},
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
	            pinDispatchMethodOptions: [],//密码函领取标志
	            mediaDispatchMethodOptions: [],//媒介领取标志
	            activationFlagOptions: [],//激活标识
	            activationModeOptions: [],//激活方式
	            //修改
	            tempUp: {},
	            upRef: {},
	            upRules: {},
	            dialogFormVisibleUp: false,
	            newInfo: '',
    		}
        },
        created() {
            //this.getBtnAuth()
        },
        mounted() {
            this.getSelectDict('dic_certificateType').then((res) => {
		        this.idTypeList = res
	      	})
            
            this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))  //获取用户登录权限
            //所属机构
            this.getSelectDict( "/beta/betaService/COS.IQ.02.0005").then(res => {
                this.institutionIdOptions = res
            })
            // 运营模式
            this.getSelectDict( "/beta/betaService/COS.IQ.02.0006").then(res => {
                this.operationModeOptions = res
            })
            //密码函领取标志
            this.getSelectDict( "dic_isYorN").then(res => {
                this.pinDispatchMethodOptions = res
            })
            //媒介领取标志
            this.getSelectDict( "dic_isYorN").then(res => {
                this.mediaDispatchMethodOptions = res
            })
            //激活标识 
            this.getSelectDict( "dic_activationFlag").then(res => {
                this.activationFlagOptions = res
            })
            //激活方式
             this.getSelectDict( "dic_activationMode").then(res => {
                this.activationModeOptions = res
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
            delete this.queryForm.evnetId  
            this.queryForm.flag= '1'
           	this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0007', this.queryForm,(res) => {
           		this.listLoading = false
           		if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                		this.tableList = res.returnData.rows;
                		this.tableTotal = res.returnData.totalCount;
                		this.tableList.forEach(item=>{
                			item.mediaObjectCodeDesc = item.mediaObjectCode+ ''+item.mediaObjectDesc
                			item.productObjectCodeDesc = item.productObjectCode+ ''+item.productDesc
                			
                		})
						
                    }
                }
            })
        },
        getInfo() {
            this.showDiv = true
            let obj1 = {
            	evnetId:'ISS.OP.01.0012',
            }
            obj1 = Object.assign(this.queryForm, obj1)
           	this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0001',obj1,(res) => {
           		this.listLoading = false
           		if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                		this.customerInfo = res.returnData.rows[0];
         			}
                }
            })
        },
        //点击单选获取数据
        getTemplateRow(row){
	        this.newCard = row
	        if(this.newCard.invalidFlag== 'N' ){
				if (this.newCard.invalidReason == "TRF") {
					 this.$message("该卡已经转卡")//"该卡已经转卡!"
					return;
				}else if (this.newCard.invalidReason == "EXP") {
					 this.$message("该卡已经到期")//"该卡已经到期!"
					return;
				}else if (this.newCard.invalidReason == "BRK") {
					 this.$message("该卡已经毁损")//"该卡已经毁损!"
					return;
				}else if (this.newCard.invalidReason == "CLS") {
					 this.$message("该卡已经关闭")//"该卡已经关闭!"
					return;
				}else if (this.newCard.invalidReason == "PNA") {
					 this.$message("该卡已经提前续卡")//"该卡已经提前续卡!"
					return;
				}
	       	}else{
		        	this.showMedium = true
		        	this.getMediumInfo()
		        }
	    },
	    //3.媒介基本信息
        getMediumInfo() {
            let obj2= {
            	idNumber: this.customerInfo.idNumber,
            	idType: this.customerInfo.idType,
            	mediaUnitCode: this.newCard.mediaUnitCode,
            	externalIdentificationNo: this.newCard.externalIdentificationNo
            }
            this.post('/nonfi/nonfinanceService/BSS.IQ.01.0217',obj2,(res) => {
           		if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                		this.mediumInfo = res.returnData.rows[0];
                		this.mediumInfo.organNo = res.returnData.rows[0].institutionId
                		this.mediumInfo.mediaObjectCodeDesc = this.mediumInfo.mediaObjectCode+ ''+this.mediumInfo.mediaObjectDesc
            			this.mediumInfo.productObjectCodeDesc = this.mediumInfo.productObjectCode+ ''+this.mediumInfo.productDesc
                		if(this.mediumInfo.mainSupplyIndicator == '1'){
						this.mediumInfo.mainSupplyIndicatorStr = '主卡'
						}else if(this.mediumInfo.mainSupplyIndicator == '2'){
							this.mediumInfo.mainSupplyIndicatorStr = '附属卡';
	                    }	
                	}
                }
            })
        },
        //提前续卡
	    subData(){
	    	let  obj3={
	    		externalIdentificationNo: this.newCard.externalIdentificationNo
	    	}
        	this.post('/nonfi/nonfinanceService/ISS.OP.01.0004', obj3,(res) => {
	            if (res.returnCode == '000000') {
                 	this.dialogFormVisibleUp = false
                    this.$notify({
                        title: 'Success',
                        message: '续卡成功',
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

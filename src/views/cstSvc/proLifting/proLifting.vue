<!-- 产品升降级 -->
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
        	<el-form :model="productInfo">
	            <el-form-item class="cl_td" label="证件类型" prop="idType">
	                <el-select v-model="productInfo.idType" class="wd200" disabled readonly>
	                <el-option v-for="(item, index) in idTypeList" :key="index" :label="item.detailDesc" :value="item.codes" />
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="证件号码" prop="idNumber">
	                <el-input v-model="productInfo.idNumber" class="wd200" type="text" readonly/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="客户名称" prop="customerName">
	                <el-input v-model="productInfo.customerName" class="wd200" type="text" readonly/>
	            </el-form-item>
	        </el-form>
	        <div class="clearboth"></div>
	        <div class="text_title">2.套卡信息</div>   
        	<el-table v-loading = "listLoading" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
	            <el-table-column width="80" align="center" label="选择">
                    <template scope="scope">
                        <el-radio v-model="templateRadio" :label="scope.$index" @change.native="getTemplateRow(scope.row)">{{""}}</el-radio>
                    </template>
                </el-table-column>
		        <el-table-column prop="productObjectCode" label="产品对象代码" align="center" />
                <el-table-column prop="productDesc" label="产品描述" align="center" />
	            <el-table-column prop="productTypeDesc" label="产品类型" align="center" />
	            <el-table-column prop="coBrandedNo" label="联名代码" align="center" />
	            <el-table-column prop="budgetOrgCode" label="公务卡预算单位编码	" align="center"/>
	            <el-table-column prop="statusCodeDesc" label="状态" align="center" />
	            <el-table-column prop="createDate" label="申请日期	" align="center"/>
	            <el-table-column prop="productCancelDate" label="注销日期" align="center" />
	        	<el-table-column prop="" label="操作" align="center" >
	                <template slot-scope="{row}">
	                	<el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleProductInfo(row)">产品升降级</el-button><!--v-show="updBtnFlag"-->
                 	</template> 
	            </el-table-column>
        	</el-table>
	        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="getList" />
    		<el-dialog title="产品升降级详情" :visible.sync="dialogFormVisibleDetail" width="65%">
	    		<el-form ref="detailRef" :model="tempDetail" :rules="detailRules">
	                <el-form-item class="cl_td" label="运营模式" prop="operationMode">
	                    <el-select v-model="tempDetail.operationMode" class="wd200" disabled readonly>
	                        <el-option 
	                            v-for="(item, index) in operationModeOptions" 
	                            :key="index" 
	                            :label="item.modeName" 
	                            :value="item.operationMode"/>
	                    </el-select>
	                </el-form-item>
	                <div class="clearboth"></div>
	               	<el-form-item class="cl_td" label="原产品对象代码" prop="ProductObjectCodeDesc" >
	                    <el-input v-model="tempDetail.ProductObjectCodeDesc" class="wd200" type="text"  readonly />
	               	</el-form-item>
	               	<el-form-item class="cl_td" label="原发行卡BIN" prop="binNo" >
	                    <el-input v-model="tempDetail.binNo" class="wd200" type="text"  readonly/>
	               	</el-form-item>
	               	<el-form-item class="cl_td" label="新产品对象代码" prop="value">
	                    <el-select v-model="tempDetail.value" class="wd200" @change="getNewProductObjectCodeNewOptions($event)">
	                        <el-option 
	                            v-for="(item, index) in newProductObjectCodeNewOptions" 
	                            :key="index" 
	                            :label="item.label" 
	                            :value="item.value"/>
	                    </el-select>
	                </el-form-item>
	                <el-form-item class="cl_td" label="新发行卡BIN" prop="binNoNew" >
	                    <el-input v-model="tempDetail.binNoNew" class="wd200" type="text"  readonly/>
	               	</el-form-item>
	               	<el-form-item class="cl_td" label="旧卡失效日期" prop="invalidDateOldCard" >
	                     <el-date-picker class="wd200" 
	                        v-model="tempDetail.invalidDateOldCard"
	                        type="date"
	                        value-format="yyyy-MM-dd"
	                        placeholder="选择日期">
	                    </el-date-picker>
	               	</el-form-item>
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
	            productInfo: {},
	            productMedia: {},
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
	            productObjectCodeNewOptions: [],//产品对象
				newProductObjectCodeNewOptions: [],//产品升降级详情的产品对象
	           	//产品升降级详情
	            tempDetail: {},
	            detailRules: {},
	            detailRef: {},
	            dialogFormVisibleDetail: false,
	            
    		}
        },
        created() {
        	
        },
        mounted() {
        	this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))  //获取用户登录权限
            this.getSelectDict('dic_certificateType').then((res) => {
		        this.idTypeList = res
	      	})
            //所属机构
            let obj = {
            	operationMode: this.logininfo.operationMode,
            }
            this.getSelectDict( "/beta/betaService/COS.IQ.02.0013",obj).then(res => {
            	res.forEach(item => {   //循环  列表字段拼接
                    item.productObjectCodeDesc = item.productObjectCode+ ' '+ item.productDesc
                })
                this.productObjectCodeNewOptions = res
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
            let params = {
            	flag: "2",
            	idType: this.queryForm.idType,
            	idNumber: this.queryForm.idNumber,
            	externalIdentificationNo: this.queryForm.externalIdentificationNo,
            	isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_productType','dic_proState'],//查找数据字典所需参数
				transDict : ['productType','statusCode'],//翻译前后key
            }
            this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0004', params,(res) => {
           		this.listLoading = false
           		if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                		this.tableList = res.returnData.rows;
                		this.tableTotal = res.returnData.totalCount;
                		this.tableList.forEach(item=>{
                			item.mediaObjectCodeDesc = item.mediaObjectCode+ ''+item.mediaObjectDesc
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
                		this.productInfo = res.returnData.rows[0];
         			}
                }
            })
        },
        //点击单选获取数据
        getTemplateRow(row){
	        this.newCard = row
	        console.log(this.newCard)
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
		        	this.getproductMedia()
		        }
	    },
	    //查看产品升降级
	    handleProductInfo(row){
	    	this.tempDetail = Object.assign({}, row)
	    	this.tempDetail.ProductObjectCodeDesc=row.productObjectCode+''+row.productDesc
	    	this.getNewProductObjectCodeNewOptions()
	    	this.dialogFormVisibleDetail = true
	        this.$nextTick(() => {
	            this.$refs['detailRef'].clearValidate()
	        })
	    },
	    //监听新产品对象代码下拉
	    getNewProductObjectCodeNewOptions(event){
	    	let items ={
	    		operationMode: this.logininfo.operationMode,
	    	}
	       	this.getSelectDict( "/beta/betaService/COS.IQ.02.0013",items,).then(res => {
	       		res.forEach(item=>{
       			 	item.label = item.productObjectCode+ ' '+ item.productDesc
       			 	item.value = item.productObjectCode
       			 	if(event==item.productObjectCode){
       			 	   this.tempDetail.binNoNew = item.binNo//新发行卡BIN
       			 	}
       			})
	            this.newProductObjectCodeNewOptions = res
        	})
      	},
      	//确认修改产品升降级数据
        subDetailData() {
        	let obj2= {
            	idNumber:this.productInfo.idNumber,
            	idType: this.productInfo.idType,
            	customerNo: this.tempDetail.customerNo,
            	invalidDateOldCard:  this.tempDetail.invalidDateOldCard,
            	operationMode: this.tempDetail.operationMode,
            	productObjectCode: this.tempDetail.productObjectCode,
            	productObjectCodeNew: this.tempDetail.value,
            	externalIdentificationNo: this.queryForm.externalIdentificationNo
            }
            this.post('/nonfi/nonfinanceService/ISS.OP.01.0006',obj2,(res) => {
           		if (res.returnCode == '000000') {
                 	this.dialogFormVisibleDetail = false
                    this.$notify({
                        title: 'Success',
                        message: '产品升降级成功',
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

<!-- 媒介激活 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
    	<el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
	       	<el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo">
            	<el-input v-model="queryFormObj.externalIdentificationNo" class="wd200" type="text"/>
        	</el-form-item>
        	 <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()">查询</el-button>
                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="reset(topParams)">重置</el-button>
            </div>
    	</el-form>  
    	<div v-if="showDiv">
	        <el-form ref="topParamsRef" :model="topParams" :rules="topParamsRules">
	           	<el-form-item class="cl_td" label="客户代码" prop="mainCustomerCode">
	            	<el-input v-model="topParams.mainCustomerCode" class="wd200" type="text" readonly/>
	        	</el-form-item>
	        	<el-form-item class="cl_td" label="客户名称" prop="customerName">
	                <el-input v-model="topParams.customerName" class="wd200" type="text" readonly/>
	            </el-form-item>
	            <el-form-item class="cl_td" label="证件号码" prop="idNumber">
	                <el-input v-model="topParams.idNumber" class="wd200" type="text" readonly/>
	            </el-form-item>
	            <div class="mainname" style="display: inline-block;">2.公务卡信息</div>
	            <el-table v-loading = "listLoading1" :data="tableList" class="mbtm20" fit highlight-current-row  
	            	 @current-change="handleCurrRowChange" @row-click="chooseCurrRow" style="width: 100%;" border>
		            <el-table-column width="80">
	                    <template slot-scope="scope">
	                    <el-radio v-model="curRowRadio" :label="scope.row.mediaUnitCode">
	                        <span class="el-radio__label"></span>
	                    </el-radio>
	                    </template>
                	</el-table-column>
		            <el-table-column prop="externalIdentificationNo" label="外部识别号" align="center" />
		            <el-table-column prop="productObjectCode" label="产品对象代码" align="center" />
		            <el-table-column prop="mainSupplyIndicatorDesc" label="主附卡标识" align="center" />
		            <el-table-column prop="mediaObjectDesc" label="媒介对象描述" align="center" />
		            <el-table-column prop="activationFlagDesc" label="激活状态" align="center" />
		            <el-table-column prop="activationDate" label="激活日期" align="center" />
		            <el-table-column prop="invalidFlagDesc" label="是否有效标识" align="center" />
		            <el-table-column prop="invalidReasonDesc" label="无效原因" align="center" />
		            <!-- <el-table-column prop="" label="操作" align="center" width = "350">
		                <template slot-scope="{row}">
			                <el-button size="mini" type="primary" @click="handleDetail(row)" >激活</el-button>
			            </template> 
		            </el-table-column> -->
	      		</el-table>
				<div class="cl_tr text_center">
					<el-button size="medium" type="primary" @click="getActivationMdm()">激活</el-button>
				</div>
	        	<pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
			</el-form>
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
                logininfo: '',
                // 列表
                queryFormRules: {},
               	queryFormObj: {
                	pageNum: 1,
                    pageSize:10,
                },
                topParams: {},
                topParamsRules: {},
                topParamsRef: {},
                showDiv: false,
                listLoading1: {},
                tableList: [],
                tableTotal: 0,
                businessList: [],
                curRowRadio: '',
        		curRow: {},
            }
        },
        created() {
            
        },
        mounted() {
            this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))  //获取用户登录权限
        },
      methods: {
      	reset(){
			  this.queryFormObj = {}
			  this.topParams = {}
			  this.showDiv = false
			  this.tableList = []
      	},
      	//查询检查是否为公务卡激活，然后在执行搜索函数
      	handleSearch(){
      		if(this.queryFormObj.externalIdentificationNo && this.queryFormObj.idNumber){
            	this.$message('请输入查询条件')
				return;
           	}
           	this.queryFormObj.flag = '2'
           	this.post('/nonfi/nonfinanceService/OCS.IQ.01.0014', this.queryFormObj, (res) => {
           		if(res.returnCode == '000000') {
           			this.post('/nonfi/nonfinanceService/BSS.IQ.01.0001', this.queryFormObj, (res) => {
		           		if(res.returnCode == '000000') {
		                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
		                        this.topParams.mainCustomerCode  = res.returnData.rows[0].customerNo;
								this.topParams.customerName  = res.returnData.rows[0].customerName;
								this.topParams.idNumber  = res.returnData.rows[0].idNumber;
								this.businessList.customerCode = res.returnData.rows[0].customerNo;
								this.businessList.idNumber = res.returnData.rows[0].idNumber;
								this.businessList.idType = res.returnData.rows[0].idType;
								this.businessList.externalIdentificationNo = this.queryFormObj.externalIdentificationNo;
								this.businessList.flag = "2";
								this.showDiv = true
								this.getList();
							}else{
		                    	this.$message('抱歉，不存在此客户！')
		                    	this.showDiv = false
								return;
		                    }
		                }else{
		                	this.$message( res.returnCode+':'+res.returnMsg);
		                }
		            },(err) => {
						this.showDiv = false
					})
                }
            })
      	},
      	// 单选 当前行
        handleCurrRowChange(row) {
            this.curRow = row
            this.curRowRadio = row.mediaUnitCode
        },
        chooseCurrRow(row) {
            this.curRow = row
            this.curRowRadio = row.mediaUnitCode
        },
      	//媒介列表
      	getList(){
      		this.listLoading1 = true
            let params={
      			isTrans: true,
				transParams: ['dic_mainCharacterCardTable','dic_activationStateTable','dic_invalidFlagYN','dic_invalidReason'],
				transDict: ['mainSupplyIndicator','activationFlag','invalidFlag','invalidReason'],
			    pageNum: this.queryFormObj.pageNum,     
                pageSize: this.queryFormObj.pageSize,        
      		}
      		params = Object.assign ( params, this.businessList )
      		this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0007', params,(res) => {
            	this.listLoading1 = false
                if (res.returnCode == '000000') {
					console.log(res)
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.tableList = res.returnData.rows
                        this.tableTotal = res.returnData.totalCount
                    }else{
						this.tableList = []
                        this.tableTotal = 0
					}
                }
            },(err) => {
				this.listLoading1 = false
			})
      	},
      	//激活
       	getActivationMdm(){
       		if(!this.curRow){
		 		this.$message('请选择媒介信息!')
				return;
			}
       		if(this.curRow.activationFlag=="1"){
				this.$message('该媒介已激活!')
				return;
            }
       		let obj = {
       			externalIdentificationNo:  this.curRow.externalIdentificationNo,
       			externalIdentificationNoOri: this.curRow.externalIdentificationNo_ori,
       			mediaUnitCode: this.curRow.mediaUnitCode,
       			userName: this.logininfo.userName,
       		}
       		obj =  Object.assign(this.curRow,obj)
       		this.post('/nonfi/nonfinanceService/OCS.OP.01.0001', obj, (res) => {
				if (res.returnCode == '000000') {
					this.$notify({
						message: '激活成功',
						type: 'success',
					}) 
					this.showDiv = false
					this.getList();
				}
            })
	    },
    }
}
</script>
<style>
</style>

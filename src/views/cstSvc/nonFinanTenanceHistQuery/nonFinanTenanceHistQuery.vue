<!-- 非金融维护历史查询 -->
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
            <el-form-item class="cl_td" label="维护历史类型" prop="logLevel">
                <el-select v-model="queryForm.logLevel" class="wd200">
                <el-option v-for="(item, index) in logLevelOptions" 
                	:key="index" 
                	:label="item.detailDesc" 
                	:value="item.codes" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="开始日期" prop="startDate">
                <el-date-picker
                    v-model="queryForm.startDate"
                    class="wd200"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyyMMdd"/>
            </el-form-item>
            <el-form-item class="cl_td" label="结束日期" prop="endDate">
                <el-date-picker
                    v-model="queryForm.endDate"
                    class="wd200"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyyMMdd"
                 	:picker-options="pickerOptions"	/>
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()">查询</el-button>
                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="reset()">重置</el-button>
            </div>
        </el-form>
        <!--账户级-->
         <!--客户级-->
        <div v-if="showDivA">
	        <el-table v-loading = "listLoading" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
	            <el-table-column prop="customerNo" label="客户号" align="center" />
	            <el-table-column prop="entityKey" label="地址类型" align="center" />
	            <el-table-column prop="modifyType" label="修改类型" align="center" />
	            <el-table-column prop="modifyFieldName" label="修改字段名" align="center"/>
	            <el-table-column prop="modifyBefore" label="修改前内容" align="center"/>
	            <el-table-column prop="modifyAfter" label="修改后内容" align="center"/>
	            <el-table-column prop="operatorId" label="维护人员" align="center" />
	            <el-table-column prop="occurrDate" label="发生日期" align="center"/>
	            <el-table-column prop="occurrTime" label="发生时间" align="center"/>
	            <el-table-column prop="" label="操作" align="center">
	                <template slot-scope="{row}">
	                <el-button size="mini" icon="el-icon-info"   type="primary" @click="handleDetaildate(row)">明细</el-button><!--v-show="updBtnFlag"-->
	                </template> 
	            </el-table-column>
	        </el-table>
	        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="getList" />
    	</div>
        <!--客户级-->
        <div v-if="showDivC">
	        <el-table v-loading = "listLoading" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
	            <el-table-column prop="customerNo" label="客户号" align="center" />
	            <el-table-column prop="entityKey" label="地址类型" align="center" />
	            <el-table-column prop="modifyType" label="修改类型" align="center" />
	            <el-table-column prop="modifyFieldName" label="修改字段名" align="center"/>
	            <el-table-column prop="modifyBefore" label="修改前内容" align="center"/>
	            <el-table-column prop="modifyAfter" label="修改后内容" align="center"/>
	            <el-table-column prop="operatorId" label="维护人员" align="center" />
	            <el-table-column prop="occurrDate" label="发生日期" align="center"/>
	            <el-table-column prop="occurrTime" label="发生时间" align="center"/>
	            <el-table-column prop="" label="操作" align="center">
	                <template slot-scope="{row}">
	                <el-button size="mini" icon="el-icon-info"   type="primary" @click="handleDetaildate(row)">明细</el-button><!--v-show="updBtnFlag"-->
	                </template> 
	            </el-table-column>
	        </el-table>
	        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="getList" />
    	</div>
    	<!--客户业务项目级-->
    	<div v-if="showDivD">
	        <el-table v-loading = "listLoading" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
	            <el-table-column prop="customerNo" label="客户号" align="center" />
	            <el-table-column prop="entityKey" label="业务项目代码" align="center" />
	            <el-table-column prop="modifyType" label="修改类型" align="center" />
	            <el-table-column prop="modifyFieldName" label="修改字段名" align="center"/>
	            <el-table-column prop="modifyBefore" label="修改前内容" align="center"/>
	            <el-table-column prop="modifyAfter" label="修改后内容" align="center"/>
	            <el-table-column prop="operatorId" label="维护人员" align="center" />
	            <el-table-column prop="occurrDate" label="发生日期" align="center"/>
	            <el-table-column prop="occurrTime" label="发生时间" align="center"/>
	            <el-table-column prop="" label="操作" align="center">
	                <template slot-scope="{row}">
	                <el-button size="mini" icon="el-icon-info"   type="primary" @click="handleDetaildate(row)">明细</el-button><!--v-show="updBtnFlag"-->
	                </template> 
	            </el-table-column>
	        </el-table>
	        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="getList" />
    	</div>
    	<!--媒介级-->
    	<div v-if="showDivM">
	        <el-table v-loading = "listLoading" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
	            <el-table-column prop="customerNo" label="客户号" align="center" />
	            <el-table-column prop="entityKey" label="媒介单元代码" align="center" />
	            <el-table-column prop="modifyType" label="修改类型" align="center" />
	            <el-table-column prop="modifyFieldName" label="修改字段名" align="center"/>
	            <el-table-column prop="modifyBefore" label="修改前内容" align="center"/>
	            <el-table-column prop="modifyAfter" label="修改后内容" align="center"/>
	            <el-table-column prop="operatorId" label="维护人员" align="center" />
	            <el-table-column prop="occurrDate" label="发生日期" align="center"/>
	            <el-table-column prop="occurrTime" label="发生时间" align="center"/>
	            <el-table-column prop="" label="操作" align="center">
	                <template slot-scope="{row}">
	                <el-button size="mini" icon="el-icon-info"   type="primary" @click="handleDetaildate(row)">明细</el-button><!--v-show="updBtnFlag"-->
	                </template> 
	            </el-table-column>
	        </el-table>
	        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="getList" />
    	</div>
    	<!--产品级-->
        <div v-if="showDivP">
	        <el-table v-loading = "listLoading" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
	            <el-table-column prop="customerNo" label="客户号" align="center" />
	            <el-table-column prop="entityKey" label="产品代码" align="center" />
	            <el-table-column prop="modifyType" label="修改类型" align="center" />
	            <el-table-column prop="modifyFieldName" label="修改字段名" align="center"/>
	            <el-table-column prop="modifyBefore" label="修改前内容" align="center"/>
	            <el-table-column prop="modifyAfter" label="修改后内容" align="center"/>
	            <el-table-column prop="operatorId" label="维护人员" align="center" />
	            <el-table-column prop="occurrDate" label="发生日期" align="center"/>
	            <el-table-column prop="occurrTime" label="发生时间" align="center"/>
	            <el-table-column prop="" label="操作" align="center">
	                <template slot-scope="{row}">
	                <el-button size="mini" icon="el-icon-info"   type="primary" @click="handleDetaildate(row)">明细</el-button><!--v-show="updBtnFlag"-->
	                </template> 
	            </el-table-column>
	        </el-table>
	        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="getList" />
    	</div>
    	<!--详情-->
    	<el-dialog title="非金融维护历史详情" :visible.sync="dialogFormVisibleDetail" width="65%">
    		<div class="mainname titleInfo ng-binding">详情信息</div>
    		<el-form ref="detailRef" :model="tempDetail" :rules="detaiRules">
    			<el-form-item class="cl_td" label="事件编号" prop="eventNo" >
                    <el-input v-model="tempDetail.eventNo" class="wd200" type="text" readonly />
               	</el-form-item>
               	<el-form-item class="cl_td" label="活动编号" prop="activityNo" >
                    <el-input v-model="tempDetail.activityNo" class="wd200" type="text" readonly />
               	</el-form-item>
               	<el-form-item class="cl_td" label="发生日期 " prop="occurrDate" >
                    <el-input v-model="tempDetail.occurrDate" class="wd200" type="text" readonly />
               	</el-form-item>
               	<el-form-item class="cl_td" label="发生时间" prop="occurrTime" >
                    <el-input v-model="tempDetail.occurrTime" class="wd200" type="text" readonly />
               	</el-form-item>
               	<el-form-item class="cl_td" label="关联表名" prop="relativeTableName" >
                    <el-input v-model="tempDetail.relativeTableName" class="wd200" type="text" readonly />
               	</el-form-item>
               	<el-form-item class="cl_td" label="日志层级" prop="logLevel" >
                    <el-input v-model="tempDetail.logLevel" class="wd200" type="text" readonly />
               	</el-form-item>
               	<el-form-item class="cl_td" label="修改类型" prop="modifyType" >
                    <el-input v-model="tempDetail.modifyType" class="wd200" type="text" readonly />
               	</el-form-item>
               	<el-form-item class="cl_td" label="客户号" prop="customerNo" >
                    <el-input v-model="tempDetail.customerNo" class="wd200" type="text" readonly />
               	</el-form-item>
               	<el-form-item class="cl_td" v-if="showDetailA" label="产品代码" prop="entityKey" >
                    <el-input v-model="tempDetail.entityKey" class="wd200" type="text" readonly />
               	</el-form-item>
               	<el-form-item class="cl_td" v-if="showDetailC" label="地址类型" prop="entityKey" >
                    <el-input v-model="tempDetail.entityKey" class="wd200" type="text" readonly />
               	</el-form-item>
               	<el-form-item class="cl_td" v-if="showDetailD" label="业务项目代码" prop="entityKey" >
                    <el-input v-model="tempDetail.entityKey" class="wd200" type="text" readonly />
               	</el-form-item>
    			<el-form-item class="cl_td" v-if="showDetailM" label="媒介单元代码" prop="entityKey" >
                    <el-input v-model="tempDetail.entityKey" class="wd200" type="text" readonly />
               	</el-form-item>
               	<el-form-item class="cl_td" v-if="showDetailP" label="产品代码" prop="entityKey" >
                    <el-input v-model="tempDetail.entityKey" class="wd200" type="text" readonly />
               	</el-form-item>
               	<el-form-item class="cl_td" label="货币代码" prop="currencyCode" >
                    <el-input v-model="tempDetail.currencyCode" class="wd200" type="text" readonly />
               	</el-form-item>
               	<el-form-item class="cl_td" label="修改字段名" prop="modifyFieldName" >
                    <el-input v-model="tempDetail.modifyFieldName" class="wd200" type="text" readonly />
               	</el-form-item>
               	<el-form-item class="cl_td" label="修改前内容" prop="modifyBefore" >
                    <el-input v-model="tempDetail.modifyBefore" class="wd200" type="text" readonly />
               	</el-form-item>
               	<el-form-item class="cl_td" label="修改后内容" prop="modifyAfter" >
                    <el-input v-model="tempDetail.modifyAfter" class="wd200" type="text" readonly />
               	</el-form-item>
               	<el-form-item class="cl_td" label="维护人员" prop="operatorId" >
                    <el-input v-model="tempDetail.operatorId" class="wd200" type="text" readonly />
               	</el-form-item>
    		</el-form>
	    	<div slot="footer" class="dialog-footer">
	            <el-button  type="primary" @click="dialogFormVisibleDetail = false"> 关闭</el-button>
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
	            queryForm: {},
	            // 列表
	            showDivA: false,//账户级
	           	showDivC: false,//客户级
	           	showDivD: false,//客户业务项目级
	           	showDivM: false,//媒介级
	            showDivP: false, //p-产品级
	            queryForm: {
	                pageNum: 1,
	                pageSize:10,
	            },
	            listLoading: false,
	           	tableList: [],
	            tableTotal: 0,
	            // 下拉框
	            idTypeList: [],//证件类型
	            logLevelOptions: [],
	            //详情
	            tempDetail: {},
	            detailRef: {},
	            detaiRules: {},
	            dialogFormVisibleDetail: false,
	            showDetailA: false,
	            showDetailC: false,
	            showDetailD: false,
	            showDetailM: false,
	            showDetailP: false,
	            pickerOptions: {
		          	disabledDate(time) {
			            return time.getTime() < Date.now();
		          	},
	         	}	
        	}
        },
        created() {
        	this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))  //获取用户登录权限
        },
        mounted() {
            this.getSelectDict('dic_certificateType').then((res) => {
		        this.idTypeList = res
	      	})
            this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))  //获取用户登录权限
            // 运营模式 
            this.getSelectDict( "/beta/betaService/COS.IQ.02.0072").then(res => {
                this.originListOptions = res
            })
           	// 维护历史类型 
            this.getSelectDict( "dic_logLevel").then(res => {
                this.logLevelOptions = res
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
			            }else if (!this.queryForm.logLevel) {
			              	this.$message({
				                message: '请选择维护历史类型',
				                type: 'warning'
			              	})
			            }else {
			              	this.getList()
            			}
		          	} else if (this.queryForm.idNumber ) {
			            if (!this.queryForm.idType) {
			              	this.$message({
				                message: '请输入证件类型',
				                type: 'warning'
			              	})
			            }else if (!this.queryForm.logLevel) {
			              	this.$message({
				                message: '请选择维护历史类型',
				                type: 'warning'
			              	})
			            }else {
			              	this.getList()
		            	}
		          	}else if (this.queryForm.externalIdentificationNo ) {
			            if (!this.queryForm.logLevel) {
			              	this.$message({
				                message: '请选择维护历史类型',
				                type: 'warning'
			              	})
			            }else {
			              	this.getList()
		            	}
		          	}
		          	else {
		            	this.getList()
		          	}
		        }
      		},
        // 列表
        getList() {
            this.listLoading = true
            this.showDivP = true
            let obj={
            	isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_specialEventState'],//查找数据字典所需参数
				transDict : ['state'],//翻译前后key
            }
            obj = Object.assign(this.queryForm, obj)  
           	this.getTableList('/nonfi/nonfinanceService/BSS.IQ.01.0009', obj,(res) => {
           		this.listLoading = false
           		if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                		this.tableList = res.returnData.rows;
                		this.tableTotal = res.returnData.totalCount;
                		if(res.returnData.rows[0].logLevel =='A'){
                			this.showDivA = true  
                			this.showDivC = false
                			this.showDivD = false   
                			this.showDivM = false   
                			this.showDivP = false
                		}
                		if(res.returnData.rows[0].logLevel =='C'){
                			this.showDivA = false  
                			this.showDivC = true
                			this.showDivD = false   
                			this.showDivM = false   
                			this.showDivP = false
                		}
                		if(res.returnData.rows[0].logLevel =='D'){
                			this.showDivA = false  
                			this.showDivC = false
                			this.showDivD = true   
                			this.showDivM = false   
                			this.showDivP = false
                		}
                		if(res.returnData.rows[0].logLevel =='M'){
                			this.showDivA = false  
                			this.showDivC = false
                			this.showDivD = false   
                			this.showDivM = true   
                			this.showDivP = false
                		}
                		if(res.returnData.rows[0].logLevel =='P'){
                			this.showDivA = false  
                			this.showDivC = false
                			this.showDivD = false   
                			this.showDivM = false   
                			this.showDivP = true
                		}
                	}
                }
            })
        },
        //查看详情显示的弹框
        handleDetaildate(row) {
	        this.tempDetail = Object.assign({}, row)
	        if(row.logLevel =='A'){
    			this.showDetailA = true  
    			this.showDetailC = false
    			this.showDetailD = false   
    			this.showDetailM = false   
    			this.showDetailP = false
    		}
    		if(row.logLevel =='C'){
    			this.showDetailA = false  
    			this.showDetailC = true
    			this.showDetailD = false   
    			this.showDetailM = false   
    			this.showDetailP = false
    		}
    		if(row.logLevel =='D'){
    			this.showDetailA = false  
    			this.showDetailC = false
    			this.showDetailD = true   
    			this.showDetailM = false   
    			this.showDetailP = false
    		}
    		if(row.logLevel =='M'){
    			this.showDetailA = false  
    			this.showDetailC = false
    			this.showDetailD = false   
    			this.showDetailM = true   
    			this.showDetailP = false
    		}
    		if(row.logLevel =='P'){
    			this.showDetailA = false  
    			this.showDetailC = false
    			this.showDetailD = false   
    			this.showDetailM = false   
    			this.showDetailP = true
    		}
	        this.dialogFormVisibleDetail = true
	        this.$nextTick(() => {
	            this.$refs['detailRef'].clearValidate()
	        })
		}, 
    }
}
</script>

<style>
</style>

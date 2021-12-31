<!-- 特别状况历史 -->
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
        <div v-if="showDiv">
	        <el-table v-loading = "listLoading" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
	            <el-table-column prop="eventNoDesc" label="状况编号及描述" align="center" />
	            <el-table-column prop="settingUpUserid" label="设置人员" align="center" />
	            <el-table-column prop="settingDate" label="设置日期" align="center" />
	            <el-table-column prop="removalUserid" label="解除人员" align="center"/>
	            <el-table-column prop="removeDate" label="解除日期" align="center"/>
	            <el-table-column prop="stateDesc" label="状态" align="center"/>
	            <el-table-column prop="" label="操作" align="center">
	                <template slot-scope="{row}">
	                <el-button size="mini" icon="el-icon-info"   type="primary" @click="handleDetaildate(row)">查询</el-button><!--v-show="updBtnFlag"-->
	                </template> 
	            </el-table-column>
	        </el-table>
	        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="getList" />
    	</div>
    	<!--详情-->
    	<el-dialog title="特别状况历史信息" :visible.sync="dialogFormVisibleDetail" width="65%">
    		<div class="mainname titleInfo ng-binding">详情信息</div>
    		<el-form ref="detailRef" :model="tempDetail" :rules="detaiRules">
    			<el-form-item class="cl_td" label="事件编号" prop="eventNo" >
                    <el-input v-model="tempDetail.eventNo" class="wd200" type="text" readonly />
               	</el-form-item>
               	<el-form-item class="cl_td" label="事件描述" prop="eventDesc" >
                    <el-input v-model="tempDetail.eventDesc" class="wd200" type="text" readonly />
               	</el-form-item>
               	<el-form-item class="cl_td" label="管控码类别" prop="effectivenessCodeType" >
                    <el-input v-model="tempDetail.effectivenessCodeType" class="wd200" type="text" readonly />
               	</el-form-item>
               	<el-form-item class="cl_td" label="序号" prop="effectivenessCodeScene" >
                    <el-input v-model="tempDetail.effectivenessCodeScene" class="wd200" type="text" readonly />
               	</el-form-item>
               	<el-form-item class="cl_td" label="描述" prop="effectivenessCodeDesc" >
                    <el-input v-model="tempDetail.effectivenessCodeDesc" class="wd200" type="text" readonly />
               	</el-form-item>
               	<el-form-item class="cl_td" label="管控层级" prop="sceneTriggerObjectLevelTrans" >
                    <el-input v-model="tempDetail.sceneTriggerObjectLevelTrans" class="wd200" type="text" readonly />
               	</el-form-item>
               	<el-form-item class="cl_td" label="层级代码" prop="sceneTriggerObjectCode" >
                    <el-input v-model="tempDetail.sceneTriggerObjectCode" class="wd200" type="text" readonly />
               	</el-form-item>
               	<el-form-item class="cl_td" label="状态" prop="stateTrans" >
                    <el-input v-model="tempDetail.stateTrans" class="wd200" type="text" readonly />
               	</el-form-item>
    			<el-form-item class="cl_td" label="设置日期" prop="settingDate" >
                    <el-input v-model="tempDetail.settingDate" class="wd200" type="text" readonly />
               	</el-form-item>
               	<el-form-item class="cl_td" label="设置时间" prop="settingTime" >
                    <el-input v-model="tempDetail.settingTime" class="wd200" type="text" readonly />
               	</el-form-item>
               	<el-form-item class="cl_td" label="设置人员代码" prop="settingUpUserid" >
                    <el-input v-model="tempDetail.settingUpUserid" class="wd200" type="text" readonly />
               	</el-form-item>
               	<el-form-item class="cl_td" label="解除日期" prop="removeDate" >
                    <el-input v-model="tempDetail.removeDate" class="wd200" type="text" readonly />
               	</el-form-item>
               	<el-form-item class="cl_td" label="解除人员代码" prop="removalUserid" >
                    <el-input v-model="tempDetail.removalUserid" class="wd200" type="text" readonly />
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
	           	showDiv: false,
	            logininfo: '',
	            // 列表
	            queryForm: {
	                pageNum: 1,
	                pageSize:10,
	            },
	            listLoading: false,
	           	tableList: [],
	            tableTotal: 0,
	            // 下拉框
	            idTypeList: [],//证件类型
	            billDayMonthOptions: [],//账单日
	            //详情
	            tempDetail: {},
	            detailRef: {},
	            detaiRules: {},
	            dialogFormVisibleDetail: false,
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
            //账单日
            this.getSelectDict( "dic_billDay").then(res => {
                this.billDayMonthOptions = res
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
            			}
		          	} else if (this.queryForm.idNumber) {
			            if (!this.queryForm.idType) {
			              	this.$message({
				                message: '请输入证件类型',
				                type: 'warning'
			              	})
			            } else {
			              	this.getList()
		            	}
		          	} else {
		            	this.getList()
		          	}
		        }
      		},
        // 列表
        getList() {
            this.listLoading = true
            this.showDiv = true
            let obj={
            	isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_specialEventState'],//查找数据字典所需参数
				transDict : ['state'],//翻译前后key
            }
            obj = Object.assign(this.queryForm, obj)  
           	this.getTableList('/nonfi/nonfinanceService/BSS.IQ.03.0002', obj,(res) => {
           		this.listLoading = false
           		if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                		this.tableList = res.returnData.rows;
                		this.tableTotal = res.returnData.totalCount;
                		this.tableList.forEach(item => {
                			item.eventNoss=item.eventNo.substr(10);
                			item.eventNoDesc=item.eventNoss+''+item.eventDesc
                		})
                		
                    }
                }
            })
        },
        //查看详情显示的弹框
        handleDetaildate(row) {
	        this.tempDetail = Object.assign({}, row)
	        if(row.sceneTriggerObjectLevel == 'C'){
				this.tempDetail.sceneTriggerObjectLevelTrans = '客户级';
			}else if(row.sceneTriggerObjectLevel == 'G'){
				this.tempDetail.sceneTriggerObjectLevelTrans = '业务项目级';
			}else if(row.sceneTriggerObjectLevel == 'A'){
				this.tempDetail.sceneTriggerObjectLevelTrans = '业务类型级';
			}else if(row.sceneTriggerObjectLevel == 'P'){
				this.tempDetail.sceneTriggerObjectLevelTrans = '产品级';
			}else if(row.sceneTriggerObjectLevel == 'M'){
				this.tempDetail.sceneTriggerObjectLevelTrans = '媒介级';
	        }
	        if(row.state=='Y'){
	        	this.tempDetail.stateTrans='有效'
	        }else if(row.state=='D'){
	        	this.tempDetail.stateTrans='已解除'
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

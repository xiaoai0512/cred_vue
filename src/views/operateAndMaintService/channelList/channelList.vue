<!-- 渠道管理 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryForm" :rules="queryFormRules">
        	<el-form-item class="cl_td" label="运营模式" prop="operationMode" >
                <el-select v-model="queryForm.operationMode" class="wd200">
                <el-option v-for="(item, index) in operationModeOptions" 
                	:key="index" 
                	:label="item.modeName" 
                	:value="item.operationMode" />
                </el-select>
            </el-form-item>
           	<el-form-item class="cl_td" label="渠道ID" prop="channelId">
                <el-input v-model="queryForm.channelId" class="wd200" type="text"/>
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" v-if="selBtnFlag">查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleAdd()" v-if="addBtnFlag">新增</el-button>
                
            </div>
        </el-form>
        <el-table v-loading = "listLoading1" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
            <el-table-column prop="channelId" label="渠道ID" align="center" width="150px"/>
            <el-table-column prop="channelDescription" label="渠道描述" align="center" />
            <el-table-column prop="channelFileRecognition" label="渠道文件识别" align="center" />
            <el-table-column prop="dataReceivingMode" label="数据接收模式" align="center" />
            <el-table-column prop="transRetainDays" label="交易保留天数" align="center" />
            <el-table-column prop="recheckDays" label="重复检查天数	" align="center" />
            <el-table-column prop="rejTrasnRetainDays" label="拒绝交易保留天数" align="center" />
            <el-table-column prop="" label="操作" align="center" width="200px">
                <template slot-scope="{row}">
                	<el-button size="mini" icon="el-icon-more" type="primary" @click="handleDetail(row)" v-if="selBtnFlag">查询</el-button>
                	<el-button size="mini" icon="el-icon-edit" type="primary" @click="handleUpData(row)" v-show="updBtnFlag">修改</el-button>
                </template> 
            </el-table-column>
        </el-table>
        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="getList" />
  		<!--新增-->
		<el-dialog title="新增渠道信息" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd" >
	             <el-form-item class="cl_td" label="运营模式" prop="operationMode" >
	                <el-select v-model="tempAdd.operationMode" class="wd200">
		                <el-option v-for="(item, index) in operationModeOptions" 
		                	:key="index" 
	                		:label="item.modeName" 
	                		:value="item.operationMode" />
	                </el-select>
            	</el-form-item>
                <el-form-item class="cl_td" label="渠道" prop="channelId">
                   <el-input v-model="tempAdd.channelId" class="wd200" type="text" maxlength="5"/>
                </el-form-item>
                <el-form-item class="cl_td" label="渠道描述" prop="channelDescription">
                   <el-input v-model="tempAdd.channelDescription" class="wd200" type="text" maxlength="50" />
                </el-form-item>
                <el-form-item class="cl_td" label="渠道文件识别" prop="channelFileRecognition">
                   <el-input v-model="tempAdd.channelFileRecognition" class="wd200" type="text"  maxlength="8"/>
                </el-form-item>
                <el-form-item class="cl_td" label="数据接收模式" prop="dataReceivingMode" >
	                <el-select v-model="tempAdd.dataReceivingMode" class="wd200">
	                	<el-option v-for="(item, index) in dataReceivingModeOptions" 
		                	:key="index" 
		                	:label="item.detailDesc" 
		                	:value="item.codes" />
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="交易保留天数" prop="transRetainDays">
                   <el-input v-model="tempAdd.transRetainDays" class="wd200" type="text" maxlength="3"/>
                </el-form-item>
                <el-form-item class="cl_td" label="重复检查天数" prop="recheckDays">
                   <el-input v-model="tempAdd.recheckDays" class="wd200" type="text" maxlength="3"/>
                </el-form-item>
                <el-form-item class="cl_td" label="拒绝交易保留天数" prop="rejTrasnRetainDays">
                   <el-input v-model="tempAdd.rejTrasnRetainDays" class="wd200" type="text" maxlength="3"/>
                </el-form-item>
            </el-form>
	    	<div slot="footer" class="dialog-footer">
	    		<el-button type="primary" @click="subAddData()">确认</el-button>
	            <el-button type="primary" @click="dialogFormVisibleAdd = false">取消</el-button>
	        </div>
        </el-dialog>
  		<!--详情-->
  		<el-dialog title="查看渠道信息" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail" :rules="rulesDetail" :model="tempDetail" >
	            <el-form-item class="cl_td" label="运营模式" prop="operationMode" >
	                <el-select v-model="tempDetail.operationMode" class="wd200">
		                <el-option v-for="(item, index) in operationModeOptions" 
		                	:key="index" 
	                		:label="item.modeName" 
	                		:value="item.operationMode" />
	                </el-select>
            	</el-form-item>
                <el-form-item class="cl_td" label="渠道" prop="channelId">
                   <el-input v-model="tempDetail.channelId" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="渠道描述" prop="channelDescription">
                   <el-input v-model="tempDetail.channelDescription" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="渠道文件识别" prop="channelFileRecognition">
                   <el-input v-model="tempDetail.channelFileRecognition" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="数据接收模式" prop="dataReceivingMode" >
	                <el-select v-model="tempDetail.dataReceivingMode" class="wd200">
	                	<el-option v-for="(item, index) in dataReceivingModeOptions" 
		                	:key="index" 
		                	:label="item.detailDesc" 
		                	:value="item.codes" />
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="交易保留天数" prop="transRetainDays">
                   <el-input v-model="tempDetail.transRetainDays" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="重复检查天数" prop="recheckDays">
                   <el-input v-model="tempDetail.recheckDays" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="拒绝交易保留天数" prop="rejTrasnRetainDays">
                   <el-input v-model="tempDetail.rejTrasnRetainDays" class="wd200" type="text" readonly/>
                </el-form-item>
            </el-form>
	    	<div slot="footer" class="dialog-footer">
	    		<el-button type="primary" @click="dialogFormVisibleDetail = false">取消</el-button>
	        </div>
        </el-dialog>
        <!--修改-->
		<el-dialog title="修改渠道信息" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp" >
	             <el-form-item class="cl_td" label="运营模式" prop="operationMode" >
	                <el-select v-model="tempUp.operationMode" class="wd200">
		                <el-option v-for="(item, index) in operationModeOptions" 
		                	:key="index" 
	                		:label="item.modeName" 
	                		:value="item.operationMode" />
	                </el-select>
            	</el-form-item>
                <el-form-item class="cl_td" label="渠道" prop="channelId">
                   <el-input v-model="tempUp.channelId" class="wd200" type="text" maxlength="5" readony/>
                </el-form-item>
                <el-form-item class="cl_td" label="渠道描述" prop="channelDescription">
                   <el-input v-model="tempUp.channelDescription" class="wd200" type="text" maxlength="50" />
                </el-form-item>
                <el-form-item class="cl_td" label="渠道文件识别" prop="channelFileRecognition">
                   <el-input v-model="tempUp.channelFileRecognition" class="wd200" type="text"  maxlength="8"/>
                </el-form-item>
                <el-form-item class="cl_td" label="数据接收模式" prop="dataReceivingMode" >
	                <el-select v-model="tempUp.dataReceivingMode" class="wd200">
	                	<el-option v-for="(item, index) in dataReceivingModeOptions" 
		                	:key="index" 
		                	:label="item.detailDesc" 
		                	:value="item.codes" />
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="交易保留天数" prop="transRetainDays">
                   <el-input v-model="tempUp.transRetainDays" class="wd200" type="text" maxlength="3"/>
                </el-form-item>
                <el-form-item class="cl_td" label="重复检查天数" prop="recheckDays">
                   <el-input v-model="tempUp.recheckDays" class="wd200" type="text" maxlength="3"/>
                </el-form-item>
                <el-form-item class="cl_td" label="拒绝交易保留天数" prop="rejTrasnRetainDays">
                   <el-input v-model="tempUp.rejTrasnRetainDays" class="wd200" type="text" maxlength="3"/>
                </el-form-item>
            </el-form>
	    	<div slot="footer" class="dialog-footer">
	    		<el-button type="primary" @click="subUpData()">确认</el-button>
	            <el-button type="primary" @click="dialogFormVisibleUp = false">取消</el-button>
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
            eventList:'',
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
            pickerOptionsEnd: '',
            pickerOptionsStart: '',
            //下拉
            idTypeList: [],
            operationModeOptions: [],//运营模式
            dataReceivingModeOptions: [],//数据接收模式
            transBillingStateOptions: [],
            
            //新增
            dialogFormVisibleAdd: false,
            dataFormAdd: {},
            tempAdd: {},
            rulesAdd: {},
			//修改
			dialogFormVisibleUp: false,
            dataFormUp: {},
            tempUp: {},
            rulesUp: {},
            //详情
            dialogFormVisibleDetail: false,
            dataFormDetail: {},
            tempDetail: {},
            rulesDetail: {},
            
        }
    },
    created() {
        this.getBtnAuth()
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
    	changeStart() {
            this.pickerOptionsEnd = Object.assign({}, this.pickerOptionsEnd, {
                disabledDate: (time) => {
                    return time.getTime() < new Date(this.queryForm.startDate).getTime()
                }
            })
        },
        // 生效日期
        changeEnd() {
            this.pickerOptionsStart = Object.assign({}, this.pickerOptionsStart, {
                disabledDate: (time) => {
                    return time.getTime() > new Date(this.queryForm.endDate).getTime()
                }
            })
        },
        // 查询按钮权限
        getBtnAuth() {
            //console.log(window.sessionStorage.getItem('menuNo'))
            let params= {
                menuNo : window.sessionStorage.getItem('menuNo')
            }
            this.getTableList('/beta/betaService/COS.CS.01.0030', params ,(res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.length > 0 ) {
                        res.returnData.forEach(item => {
                        	this.eventList += item.eventNo+','
                        })
                        if (this.eventList.includes('MIS.IQ.01.0001')) { // 查询
                            this.selBtnFlag = true
                        } else {
                            this.selBtnFlag = false
                        }
                        if (this.eventList.includes('MIS.AD.01.0001')) { // 新增
                            this.addBtnFlag = true
                        } else {
                            this.addBtnFlag = false
                        }
                        if (this.eventList.includes('MIS.UP.01.0001')) { // 修改
                            this.updBtnFlag = true
                        } else {
                            this.updBtnFlag = false
                        }
                    }
                }
            })
        },
        //重置
        resetChose(){
        	this.queryForm = {}
        },
       	// 列表
        getList() {
            this.listLoading1 = true
            let params = {
            	isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_dataReceivingMode'],//查找数据字典所需参数
				transDict : ['dataReceivingMode'],//翻译前后key
			}
            params = Object.assign(this.queryForm, params)   //合并
           	this.getTableList('/beta/betaService/MIS.IQ.01.0001', params,(res) => {
                   this.listLoading1 = false
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.tableList = res.returnData.rows
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
        //新增
        handleAdd() {
            this.tempAdd = {}
            this.dialogFormVisibleAdd = true
            this.$nextTick(() => {
                this.$refs['dataFormAdd'].clearValidate()
            })
        },
        subAddData(){
        	this.tempAdd.dataReceivingMode=this.tempAdd.dataReceivingMode;
        	this.post('/beta//betaService/MIS.AD.01.0001', this.tempAdd, (res) => {
                if (res.returnCode == '000000') {
                    this.dialogFormVisibleAdd= false
                    this.$notify({
                    message: '新增成功',
                    type: 'success',
                    })
                    this.getList()
                    this.tempAdd = {}
                }
            })
        },
        //详情展示的弹框
        handleDetail(row) {
            this.tempDetail = {}
            this.tempDetail = Object.assign({}, row)
            this.tempDetail.viewTransStatus= row.transBillingState 
           	this.dialogFormVisibleDetail = true
            this.$nextTick(() => {
                this.$refs['dataFormDetail'].clearValidate()
            })
        }, 
        //修改展示的弹框
        handleUpData(row) {
            this.tempUp = {}
            this.tempUp = Object.assign({}, row)
            this.tempUp.viewTransStatus= row.transBillingState 
           	this.dialogFormVisibleUp= true
            this.$nextTick(() => {
                this.$refs['dataFormUp'].clearValidate()
            })
        }, 
        subUpData(){
        	this.tempUp.dataReceivingMode=this.tempUp.dataReceivingMode
        	this.post('/beta/betaService/MIS.UP.01.0001', this.tempUp, (res) => {
                if (res.returnCode == '000000') {
                    this.dialogFormVisibleUp= false
                    this.$notify({
                    message: '修改成功',
                    type: 'success',
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

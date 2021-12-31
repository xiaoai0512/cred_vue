<!-- 清算场景管理 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
          	<el-form-item class="cl_td" label="运营模式" prop="operationMode" >
                <el-select v-model="queryFormObj.operationMode" class="wd200">
                <el-option
                    v-for="(item, index ) in operationModeOptions"
                    :key="index"
                    :label="item.modeName"
                    :value="item.operationMode"/>
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="交易代码" prop="numberType">
                <el-input v-model="queryFormObj.numberType" class="wd200" type="text"/>
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" v-show="selBtnFlag">查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate" v-show="addBtnFlag">新增</el-button>
            </div>
        </el-form>
        <div v-if="showDiv">
	        <el-table v-loading = "listLoading1" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
	            <el-table-column prop="operationMode" label="运营模式" align="center" />
	            <el-table-column prop="clearingTransactionCode" label="交易代码" align="center" />
	            <el-table-column prop="origClearingTxnCode" label="关联交易代码" align="center" />
	            <el-table-column prop="triggerNo" label="触发事件编号" align="center" />
	            <el-table-column prop="sceneDesc" label="清算场景描述" align="center" />
	           	<el-table-column prop="" label="操作" align="center" width = "350">
	                <template slot-scope="{row}">
	                <el-button size="mini" icon="el-icon-more" type="primary" @click="handleDetail(row)" v-show="selBtnFlag">详情</el-button>
	                <el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleUpdate(row)" v-show="updBtnFlag">修改</el-button><!--v-show="updBtnFlag"-->
	                <!--<el-button size="mini" icon="el-icon-document-copy"   type="primary" @click="handleCopy(row)">复制</el-button>-->
	                </template> 
	            </el-table-column>
	        </el-table>
	        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
        </div>
        <!-- 新增 -->
        <el-dialog title="清算场景建立" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd" >
               	<el-form-item class="cl_td" label="运营模式" prop="operationMode" >
                	<el-select v-model="tempAdd.operationMode" class="wd200">
	                <el-option
	                    v-for="(item, index ) in operationModeOptions"
	                    :key="index"
	                    :label="item.modeName"
	                    :value="item.operationMode"/>
	                </el-select>
	            </el-form-item>
                <el-form-item class="cl_td" label="交易代码" prop="clearingTransactionCode" >
                	<el-select v-model="tempAdd.clearingTransactionCode" class="wd200">
	                <el-option
	                    v-for="(item, index ) in clearingTransactionCodeOptions"
	                    :key="index"
	                    :label="item.detailDesc"
                        :value="item.codes"/>
	                </el-select>
	            </el-form-item>
               	<el-form-item class="cl_td" label="原交易代码" prop="origClearingTxnCode" >
                	<el-select v-model="tempAdd.origClearingTxnCode" class="wd200">
	                <el-option
	                    v-for="(item, index ) in origClearingTxnCodeOptions"
	                    :key="index"
	                    :label="item.detailDesc"
                        :value="item.codes"/>
	                </el-select>
	            </el-form-item>
                 <el-form-item class="cl_td" label="触发事件编号" prop="triggerNo"
                    :rules="[ { required: true, message: '触发事件编号不能为空'}]">
                   	<el-input v-model="tempAdd.triggerNo" class="wd200" type="text" />
                   	<div class="dialog-footer search_button">
		                <el-button type="primary" @click="searchEvent()">查询</el-button>
		            </div>
                </el-form-item>
              	<el-form-item class="cl_td" label="清算场景描述" prop="sceneDesc"
                    :rules="[ { required: true, message: '清算场景描述不能为空'}]">
                   <el-input v-model="tempAdd.sceneDesc" class="wd200" type="text" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="createData()"> 确定</el-button>
                <el-button type="primary" @click="dialogFormVisibleAdd=false"> 关闭</el-button>
            </div>
        </el-dialog> 
        <!--查询选择触发时间编号-->
        <el-dialog title="选择出发时间编号" :visible.sync="dialogFormVisibleEventList" width="65%">
        	<el-form ref="dataFormEvent" :rules="rulesEvent" :model="eventForm" >
                <el-form-item class="cl_td" label="事件编号" prop="eventId">
                    <el-input v-model="eventForm.eventId" class="wd200" type="text"/>
                </el-form-item>
                <el-form-item class="cl_td" label="事件描述" prop="eventDesc">
                   <el-input v-model="eventForm.eventDesc" class="wd200" type="text"/>
                </el-form-item>
                 <el-form-item class="cl_td" label="已关联触发事件编号" prop="channelFileRecognition">
                   <el-input v-model="eventForm.sceneEventNo" class="wd200" type="text"/>
                </el-form-item>
                <div class="cl_tr text_center">
	                <el-button size="medium" icon="el-icon-search" type="primary" @click="searchListBtn()" >查询</el-button>
	                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="intEvent()" >重置</el-button>
            	</div>
            </el-form>
            <el-table v-loading = "listLoading2" :data="addEventList" class="mbtm20" fit highlight-current-row 
            	@current-change="handleCurrRowChange1" @row-click="chooseCurrRow1" style="width: 100%;" border>
	            <el-table-column width="55">
	                <template slot-scope="scope">
	                    <el-radio v-model="templateRadio1" :label="scope.row.eventNo">
	                        <span class="el-radio__label"></span>
	                    </el-radio>
	                </template>
	            </el-table-column>
	            <el-table-column prop="eventNo" label="事件编号" align="center" />
	            <el-table-column prop="eventDesc" label="事件描述" align="center" />
	        </el-table>
	        <pagination v-show="tableTotal2>0" :total="tableTotal2" :page.sync="eventPage.pageNum" :limit.sync="eventPage.pageSize" @pagination="getEventList" />
	        <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="subEventList()"> 确定</el-button>
                <el-button type="primary" @click="dialogFormVisibleEventList=false"> 关闭</el-button>
            </div>
        </el-dialog> 
       <!-- 修改 -->
        <el-dialog title="清算场景维护" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp" >
                <el-form-item class="cl_td" label="运营模式" prop="operationMode" >
                	<el-select v-model="tempUp.operationMode" class="wd200"  readonly disabled>
	                <el-option
	                    v-for="(item, index ) in operationModeOptions"
	                    :key="index"
	                    :label="item.modeName"
	                    :value="item.operationMode"/>
	                </el-select>
	            </el-form-item>
                <el-form-item class="cl_td" label="交易代码" prop="clearingTransactionCode" >
                	<el-select v-model="tempUp.clearingTransactionCode" class="wd200"  readonly disabled>
	                <el-option
	                    v-for="(item, index ) in clearingTransactionCodeOptions"
	                    :key="index"
	                    :label="item.detailDesc"
                        :value="item.codes"/>
	                </el-select>
	            </el-form-item>
               	<el-form-item class="cl_td" label="原交易代码" prop="origClearingTxnCode" >
                	<el-select v-model="tempUp.origClearingTxnCode" class="wd200" readonly disabled>
	                <el-option
	                    v-for="(item, index ) in origClearingTxnCodeOptions"
	                    :key="index"
	                    :label="item.detailDesc"
                        :value="item.codes"/>
	                </el-select>
	            </el-form-item>
                 <el-form-item class="cl_td" label="触发事件编号" prop="triggerNo"
                    :rules="[ { required: true, message: '触发事件编号不能为空'}]">
                   	<el-input v-model="tempUp.triggerNo" class="wd200" type="text" />
                   	<div class="dialog-footer search_button">
		                <el-button type="primary" @click="searchUpEvent()">查询</el-button>
		            </div>
                </el-form-item>
              	<el-form-item class="cl_td" label="清算场景描述" prop="sceneDesc"
                    :rules="[ { required: true, message: '清算场景描述不能为空'}]">
                   <el-input v-model="tempUp.sceneDesc" class="wd200" type="text" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateData()">确定</el-button>
                <el-button type="primary" @click="dialogFormVisibleUp = false">取消</el-button>
            </div>
        </el-dialog>
        <!--修改选择触发事件编号-->
        <el-dialog title="选择出发时间编号" :visible.sync="dialogFormVisibleEventListUp" width="65%">
        	<el-form ref="dataUpFormEvent" :rules="rulesUpEvent" :model="eventFormUp" >
                <el-form-item class="cl_td" label="事件编号" prop="eventId">
                    <el-input v-model="eventFormUp.eventId" class="wd200" type="text"/>
                </el-form-item>
                <el-form-item class="cl_td" label="事件描述" prop="eventDesc">
                   <el-input v-model="eventFormUp.eventDesc" class="wd200" type="text"/>
                </el-form-item>
                 <el-form-item class="cl_td" label="已关联触发事件编号" prop="channelFileRecognition">
                   <el-input v-model="eventFormUp.sceneEventNo" class="wd200" type="text"/>
                </el-form-item>
                <div class="cl_tr text_center">
	                <el-button size="medium" icon="el-icon-search" type="primary" @click="searchUpListBtn()" >查询</el-button>
	                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="intUpEvent()">重置</el-button>
            	</div>
            </el-form>
            <el-table v-loading = "listLoading3" :data="upEventList" class="mbtm20" fit highlight-current-row 
            	@current-change="handleCurrRowChange2" @row-click="chooseCurrRow2" style="width: 100%;" border>
	            <el-table-column width="55">
	                <template slot-scope="scope">
	                    <el-radio v-model="templateRadio2" :label="scope.row.eventNo">
	                        <span class="el-radio__label"></span>
	                    </el-radio>
	                </template>
	            </el-table-column>
	            <el-table-column prop="eventNo" label="事件编号" align="center" />
	            <el-table-column prop="eventDesc" label="事件描述" align="center" />
	        </el-table>
	        <pagination v-show="tableTotal3>0" :total="tableTotal3" :page.sync="eventPage2.pageNum" :limit.sync="eventPage2.pageSize" @pagination="getUpEventList" />
	        <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="subEventListUp()"> 确定</el-button>
                <el-button type="primary" @click="dialogFormVisibleEventListUp=false">取消</el-button>
            </div>
        </el-dialog> 
        <!--查询-->
         <el-dialog title="修改预留号码信息" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail" :rules="rulesDetail" :model="tempDetail" >
                <el-form-item class="cl_td" label="运营模式" prop="operationMode" >
                	<el-select v-model="tempDetail.operationMode" class="wd200"  readonly disabled>
	                <el-option
	                    v-for="(item, index ) in operationModeOptions"
	                    :key="index"
	                    :label="item.modeName"
	                    :value="item.operationMode"/>
	                </el-select>
	            </el-form-item>
                <el-form-item class="cl_td" label="交易代码" prop="clearingTransactionCode" >
                	<el-select v-model="tempDetail.clearingTransactionCode" class="wd200"  readonly disabled>
	                <el-option
	                    v-for="(item, index ) in clearingTransactionCodeOptions"
	                    :key="index"
	                    :label="item.detailDesc"
                        :value="item.codes"/>
	                </el-select>
	            </el-form-item>
               	<el-form-item class="cl_td" label="原交易代码" prop="origClearingTxnCode" >
                	<el-select v-model="tempDetail.origClearingTxnCode" class="wd200" readonly disabled>
	                <el-option
	                    v-for="(item, index ) in origClearingTxnCodeOptions"
	                    :key="index"
	                    :label="item.detailDesc"
                        :value="item.codes"/>
	                </el-select>
	            </el-form-item>
                 <el-form-item class="cl_td" label="触发事件编号" prop="triggerNo"
                    :rules="[ { required: true, message: '触发事件编号不能为空'}]">
                   	<el-input v-model="tempDetail.triggerNo" class="wd200" type="text" readonly/>
                </el-form-item>
              	<el-form-item class="cl_td" label="清算场景描述" prop="sceneDesc"
                    :rules="[ { required: true, message: '清算场景描述不能为空'}]">
                   <el-input v-model="tempDetail.sceneDesc" class="wd200" type="text" readonly/>
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
	            // 权限
	            selBtnFlag: false,
	            addBtnFlag: false,
	            updBtnFlag: false,
	            btnAuthStr: '',
	            templateRadio: false,
	            logininfo: '',
	            // 列表
	            showDiv: false,
	            queryFormObj: {
	                pageNum: 1,
	                pageSize:10,
	            },
	            listLoading1: false,
	            queryFormRef: {},
	            queryFormRules: {},      
	            tableList: [],
	            tableTotal: 0,
	           	// 下拉框
	            operationModeOptions:[],// 运营模式 
	            dataReceivingModeOptions: [],//
	           	clearingTransactionCodeOptions: [],//交易代码
	           	origClearingTxnCodeOptions: [],//原交易代码
	            /*----新增----*/
	            tempAdd: {}, // 新增
	            dataFormAdd: {},
	            newLegal: '',
	           	tempDetail: {}, // 详情
	            dialogFormVisibleAdd: false,
	            rulesAdd: {},
	            //选择出发时间编号
	            dialogFormVisibleEventList: false,
	            listLoading2: false,
	            eventForm: {},
	            rulesEvent: {},
	            addEventList: [],
	            eventPage: {
	            	pageNum: 1,
	                pageSize:10,
	            },
	            templateRadio1: '',
	            tableTotal2: 0,
	            curRow1: {},
	            //修改
	            dialogFormVisibleUp: false,
	            tempUp: {}, 
	            dataFormUp: {},
	            rulesUp: {},
	            //选择事件编号
	            dialogFormVisibleEventListUp: false,
	            dataUpFormEvent: {},   
	            rulesUpEvent: {},   
	            eventFormUp: {},
	            templateRadio2: '',
	            upEventList: [],
	            listLoading3: false,
	            curRow2: {},
	            eventPage2: {
	            	pageNum: 1,
	                pageSize:10,
	            },
	            tableTotal3: 0,
	           	//详情
	    		dialogFormVisibleDetail: false,
	    		dataFormDetail: {},
	    		tempDetail: [],
	    		rulesDetail: {},
            }
        },
        created() {
            this.getBtnAuth()
        },
        mounted() {
            this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))  //获取用户登录权限
            this.getList()
           	this.getSelectDict( "/beta/betaService/COS.IQ.02.0006",).then(res => {
	            this.operationModeOptions = res
	        })
            //数据接收模式
            this.getSelectDict( "dic_dataReceivingMode").then(res => {
                this.dataReceivingModeOptions = res
            })
            //交易代码
            this.getSelectDict( "dic_clearCodeArr").then(res => {
                this.clearingTransactionCodeOptions = res
            })
            //原交易代码
            this.getSelectDict( "dic_clearCodeArr").then(res => {
                this.origClearingTxnCodeOptions = res
            })
        },
      methods: {
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
                            this.btnAuthStr += item.eventNo+','
                        })
                        if (this.btnAuthStr.includes('MIS.IQ.01.0001') != -1){ // 查询
                            this.selBtnFlag = true
                        } else {
                            this.selBtnFlag = false
                        }
                        if (this.btnAuthStr.includes('MIS.AD.01.0001') != -1) { // 新增
                            this.addBtnFlag = true
                        } else {
                            this.addBtnFlag = false
                        }
                        if (this.btnAuthStr.includes('MIS.UP.01.0001') != -1){ // 维护
                            this.updBtnFlag = true
                        } else {
                            this.updBtnFlag = false
                        }
                    }
                }
            })
        },
       	// 列表
        getList() {
            this.listLoading1 = true
            this.showDiv = true
            let params = {
                corporationEntityNo: this.logininfo.corporationEntityNo,
                isTrans: true,//是否需要翻译数据字典
                transParams : ['dic_dataReceivingMode'],//查找数据字典所需参数
                transDict : ['dataReceivingMode'],//翻译前后key
            }
            params = Object.assign(this.queryFormObj, params)   //合并
            this.getTableList('/beta/betaService/MIS.IQ.01.0005', params,(res) => {
            	this.listLoading1 = false
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.tableList = res.returnData.rows
                        this.tableTotal = res.returnData.totalCount
                    }
                }
            })
        },
        handleSearch() {
            this.getList()
        },
        //显示新增弹框
        handleCreate() {
            this.dialogFormVisibleAdd = true
            this.$nextTick(() => {
                this.$refs['dataFormAdd'].clearValidate()
            })
        }, 
        //查询触发事件编号现实的弹框
        searchEvent(){
        	this.dialogFormVisibleEventList = true
        	this.getEventList()
        	this.$nextTick(() => {
                this.$refs['dataFormEvent'].clearValidate()
            })
        },
        getEventList() {
            this.listLoading2= true
            let params = {
            	sceneEventNo: this.eventForm.sceneEventNo,
            	eventDesc: this.eventForm.eventDesc,
            	eventId: this.eventForm.eventId,   
            	pageNum: this.eventPage.pageNum,
            	pageSize: this.eventPage.pageSize,
                isTrans: true,//是否需要翻译数据字典
                transParams : ['dic_dataReceivingMode'],//查找数据字典所需参数
                transDict : ['dataReceivingMode'],//翻译前后key
            }
            this.getTableList('/beta/betaService/COS.IQ.02.0001', params,(res) => {
            	this.listLoading2 = false
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.addEventList = res.returnData.rows
                        this.tableTotal2 = res.returnData.totalCount
                       
                    }
                }
            })
        },
        //查询
        searchListBtn(){
        	this.getEventList()
        },
        //重置
        intEvent(){
        	this.eventForm = {}
        },
        
        //单选一行
        handleCurrRowChange1(row) {
          	this.curRow1 = row
        },
       	chooseCurrRow1(row) {
       		this.templateRadio1 = row.eventNo
		},
		//选择事件编号确认
		subEventList(){
        	this.tempAdd.triggerNo =this.curRow1.eventNo
        	this.dialogFormVisibleEventList = false
        },
        //确认新增数据 
        createData() {
        	this.$refs['dataFormAdd'].validate((valid) => {
                if (valid) {
                    this.post('/beta/betaService/MIS.AD.01.0005',this.tempAdd, (response) => {
                        this.dialogFormVisibleAdd = false
                        this.$notify({
                            title: 'Success',
                            message: '新增成功',
                            type: 'success',
                            duration: 2000
                        })
                        this.getList()
                    })
                }
            })
        },  
        /*----修改----*/
       	//显示修改弹框
        handleUpdate(row) {
            this.tempUp = Object.assign({}, row)
            this.dialogFormVisibleUp = true
            this.$nextTick(() => {
                this.$refs['dataFormUp'].clearValidate()
            })
        }, 
        //查询触发事件编号现实的弹框
        searchUpEvent(){
        	this.dialogFormVisibleEventListUp = true
        	this.getUpEventList()
        	this.$nextTick(() => {
                this.$refs['dataUpFormEvent'].clearValidate()
            })
        },
        getUpEventList() {
            this.listLoading3= true
            let params = {
            	sceneEventNo: this.eventFormUp.sceneEventNo,
            	eventDesc: this.eventFormUp.eventDesc,
            	eventId: this.eventFormUp.eventId,   
            	pageNum: this.eventPage2.pageNum,
            	pageSize: this.eventPage2.pageSize,
                isTrans: true,//是否需要翻译数据字典
                transParams : ['dic_dataReceivingMode'],//查找数据字典所需参数
                transDict : ['dataReceivingMode'],//翻译前后key
            }
            this.getTableList('/beta/betaService/COS.IQ.02.0001', params,(res) => {
            	this.listLoading3 = false
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.upEventList = res.returnData.rows
                        this.tableTotal3 = res.returnData.totalCount
                       
                    }
                }
            })
        },
        //查询
        searchUpListBtn(){
        	this.getUpEventList()
        },
        //重置
        intUpEvent(){
        	this.eventFormUp = {}
        },
        //单选一行
        handleCurrRowChange2(row) {
          	this.curRow2 = row
        },
       	chooseCurrRow2(row) {
       		this.templateRadio2 = row.eventNo
		},
		//选择事件编号确认
		subEventListUp(){
			this.tempUp.triggerNo =this.curRow2.eventNo
        	this.dialogFormVisibleEventListUp = false
        },
        //确认修改数据
        updateData() {
           this.$refs['dataFormUp'].validate((valid) => {
                if (valid) {
                    this.post('/beta/betaService/MIS.UP.01.0005', this.tempUp, (response) => {
                        this.dialogFormVisibleUp = false
                        this.$notify({
                          title: 'Success',
                          message: '修改成功',
                          type: 'success',
                          duration: 2000
                        })
                        this.getList()
                    })
                }
            })
        },
        //显示详情弹框
        handleDetail(row) {
            this.tempDetail= Object.assign({}, row)
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

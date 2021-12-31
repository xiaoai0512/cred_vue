<!-- 网络连接状态 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <div class="cl_tr text_center" >
            <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" >查询</el-button>
            <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate()" v-if="addBtnFlag">新增</el-button>
        </div>
		<el-table v-loading = "listLoading" :data="tableList" border stripe style="width: 100%">
            <el-table-column prop="organNo" label="序号" align="center"
                type="index">
            </el-table-column>
            <el-table-column prop="remoteSystemInd" label="远程系统标识" align="center"/>
             <el-table-column prop="serverClientIndDesc" label="角色" align="center"/>
            <el-table-column prop="connModelDesc" label="连接模式" align="center"/>
            <el-table-column prop="localIp" label="本地IP" align="center"/>
            <el-table-column prop="localPort" label="本地端口" align="center"/>
            <el-table-column prop="remoteIp" label="远程IP" align="center"/>
            <el-table-column prop="remotePort" label="远程端口" align="center"/>
            <el-table-column prop="connStatusDesc" label="连接状态" align="center"/>
            <el-table-column align="center" label="操作" width="420px">
                <template slot-scope="scope">
                    <el-button size="mini" icon="el-icon-info" type="primary" @click="handleDetail(scope.row)" v-if="selBtnFlag">详情</el-button>
                    <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleUpdate(scope.row)" v-if="updBtnFlag">修改</el-button>
                   	<el-button size="mini" icon="el-icon-delete" type="primary" @click="delData(scope.row)" v-if="delBtnFlag">删除</el-button>
                   	<span v-if="scope.row.connStatus =='0' " style="margin-left: 10px;">
                   		<el-button size="mini" icon="el-icon-arrow-right"  type="primary" @click="handleStart(scope.row)">启动</el-button>
               		</span>
               		<span v-if="scope.row.connStatus !='0' " style="margin-left: 10px;">
               			<el-button size="mini" icon="el-icon-arrow-right"  type="primary" @click="handleStop(scope.row)" >中止</el-button>
					</span>
                </template>
            </el-table-column>
        </el-table>
<!--        <pagination v-show="tableTotal>0" class="page-name" :total="tableTotal" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="getList" />
-->       	<!-- 新增 -->
        <el-dialog title="网络状态新增" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd" >
            	<div class="mainname titleInfo ">基本信息</div>
                <el-form-item class="cl_td" label="远程系统标识" prop="remoteSystemInd" 
                   :rules="[ { required: true, message: '远程系统标识不能为空'}]">
                    <el-select v-model="tempAdd.remoteSystemInd" class="wd200" @change="remoteSystemIndChange($event)">
                    <el-option
                        v-for="(item, index ) in remoteSystemIndOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="连接模式" prop="connModel" 
                    :rules="[ { required: true, message: '连接模式不能为空'}]">
                    <el-select v-model="tempAdd.connModel" class="wd200">
                    <el-option
                        v-for="(item, index ) in connModelOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
				<el-form-item class="cl_td" label="编码" prop="independentFlag" 
                    :rules="[ { required: true, message: '编码不能为空'}]">
                    <el-select v-model="tempAdd.independentFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in independentFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>               
                <el-form-item class="cl_td" label="消息头" prop="includeHeaderInd" 
                    :rules="[ { required: true, message: '消息头不能为空'}]">
                    <el-select v-model="tempAdd.includeHeaderInd" class="wd200" @change="getIncludeHeaderIndChange($event)">
                    <el-option
                        v-for="(item, index ) in includeHeaderIndOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>  
                <el-form-item class="cl_td" label="消息头长度" prop="headerLength" 
                    :rules="[ { required: true, message: '消息头长度不能为空'}]">
                    <el-input v-model="tempAdd.headerLength" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="授权事件号" prop="eventNo"
                	:rules="[ { required: true, message: '授权事件号不能为空'}]"> 
                   <el-input v-model="tempAdd.eventNo" class="wd200" type="text"/>
                </el-form-item>
                 <el-form-item class="cl_td" label="读超时(ms)" prop="readTimeout" 
                    :rules="[ { required: true, message: '读超时(ms)不能为空'}]">
                    <el-input v-model="tempAdd.readTimeout" class="wd200" type="text" />
                </el-form-item>
                <div v-if="tempAdd.connModel=='DI' || tempAdd.connModel=='SA' || tempAdd.connModel=='SI'">
	                <div class="clearboth"></div>
	                <div class="mainname titleInfo ">本地IP</div>
	                <el-form-item class="cl_td" label="本地IP" prop="localIp" 
	                    :rules="[ { required: true, message: '本地IP不能为空'}]">
	                    <el-input v-model="tempAdd.localIp" class="wd200" type="text" />
	                </el-form-item>
	                <el-form-item class="cl_td" label="本地端口 " prop="localPort" 
	                    :rules="[ { required: true, message: '本地端口 不能为空'}]">
	                    <el-input v-model="tempAdd.localPort" class="wd200" type="text" />
	                </el-form-item>
		        </div>
		        <div v-if="tempAdd.connModel=='DA' || tempAdd.connModel=='SA' || tempAdd.connModel=='SI'">
	                <div class="clearboth"></div>
	                <div class="mainname titleInfo ng-binding">远程IP</div>
	             	<el-form-item class="cl_td" label="远程IP" prop="remoteIp" 
	                    :rules="[ { required: true, message: '远程IP不能为空'}]">
	                    <el-input v-model="tempAdd.remoteIp" class="wd200" type="text" />
	                </el-form-item>
	                <el-form-item class="cl_td" label="远程端口 " prop="remotePort" 
	                    :rules="[ { required: true, message: '远程端口 不能为空'}]">
	                    <el-input v-model="tempAdd.remotePort" class="wd200" type="text" />
	                </el-form-item>
                 </div>
                <div v-if="tempAdd.connModel=='DA' || tempAdd.connModel=='SA' || tempAdd.connModel=='SI'">
	              	<div class="clearboth"></div>
	                <div class="mainname titleInfo ng-binding">重连间隔时间(ms)</div>
	               	<el-form-item class="cl_td" label="重连间隔时间(ms)" prop="reconnInterval" 
	                    :rules="[ { required: true, message: '重连间隔时间(ms)不能为空'}]">
	                    <el-input v-model="tempAdd.reconnInterval" class="wd200" type="text" />
	                </el-form-item>
	               	<el-form-item class="cl_td" label="重连次数" prop="maxCount" 
	                    :rules="[ { required: true, message: '重连次数不能为空'}]">
	                    <el-input v-model="tempAdd.maxCount" class="wd200" type="text" />
	                </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleAdd = false">取消</el-button>
                <el-button type="primary" @click="createData()"> 确定</el-button>
            </div>
        </el-dialog> 
       	<!-- 详情 -->
        <el-dialog title="查询详细信息" :visible.sync="dialogFormVisibleDetail" width="65%">
           <el-form ref="dataFormDetail" :rules="rulesDetail" :model="tempDetail" >
               <div class="mainname titleInfo ">基本信息</div>
                <el-form-item class="cl_td" label="远程系统标识" prop="remoteSystemInd">
                    <el-select v-model="tempDetail.remoteSystemInd" class="wd200" 
                    	@change="remoteSystemIndChangeUp($event)" readonly disabled>
                    <el-option
                        v-for="(item, index ) in remoteSystemIndOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="连接模式" prop="connModel">
                    <el-select v-model="tempDetail.connModel" class="wd200" readonly disabled>
                    <el-option
                        v-for="(item, index ) in connModelOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
				<el-form-item class="cl_td" label="编码" prop="independentFlag">
                    <el-select v-model="tempDetail.independentFlag" class="wd200" readonly disabled>
                    <el-option
                        v-for="(item, index ) in independentFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>               
                <el-form-item class="cl_td" label="消息头" prop="includeHeaderInd">
                    <el-select v-model="tempDetail.includeHeaderInd" class="wd200" readonly disabled>
                    <el-option
                        v-for="(item, index ) in includeHeaderIndOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>  
                <el-form-item class="cl_td" label="消息头长度" prop="headerLength">
                    <el-input v-model="tempDetail.headerLength" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="授权事件号" prop="eventNo"> 
                   <el-input v-model="tempDetail.eventNo" class="wd200" type="text"readonly/>
                </el-form-item>
                 <el-form-item class="cl_td" label="读超时(ms)" prop="readTimeout">
                    <el-input v-model="tempDetail.readTimeout" class="wd200" type="text" readonly/>
                </el-form-item>
                <div v-if="tempDetail.connModel=='DI' || tempDetail.connModel=='SA' || tempDetail.connModel=='SI'">
	                <div class="clearboth"></div>
	                <div class="mainname titleInfo ">本地IP</div>
	                <el-form-item class="cl_td" label="本地IP" prop="localIp">
	                    <el-input v-model="tempDetail.localIp" class="wd200" type="text" readonly/>
	                </el-form-item>
	                <el-form-item class="cl_td" label="本地端口 " prop="localPort">
	                    <el-input v-model="tempDetail.localPort" class="wd200" type="text" readonly/>
	                </el-form-item>
	        	</div>
		        <div v-if="tempDetail.connModel=='DA' || tempDetail.connModel=='SA' || tempDetail.connModel=='SI'">
	                <div class="clearboth"></div>
	                <div class="mainname titleInfo ng-binding">远程IP</div>
	             	<el-form-item class="cl_td" label="远程IP" prop="remoteIp">
	                    <el-input v-model="tempDetail.remoteIp" class="wd200" type="text" readonly/>
	                </el-form-item>
	                <el-form-item class="cl_td" label="远程端口 " prop="remotePort">
	                    <el-input v-model="tempDetail.remotePort" class="wd200" type="text" readonly/>
	                </el-form-item>
                 </div>
                <div v-if="tempDetail.connModel=='DA' || tempDetail.connModel=='SA' || tempDetail.connModel=='SI'">
	              	<div class="clearboth"></div>
	                <div class="mainname titleInfo ng-binding">重连间隔时间(ms)</div>
	               	<el-form-item class="cl_td" label="重连间隔时间(ms)" prop="reconnInterval">
	                    <el-input v-model="tempDetail.reconnInterval" class="wd200" type="text" readonly/>
	                </el-form-item>
	               	<el-form-item class="cl_td" label="重连次数" prop="maxCount" >
	                    <el-input v-model="tempDetail.maxCount" class="wd200" type="text" readonly/>
	                </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleDetail = false">取消</el-button>
            </div>
        </el-dialog> 
        <!-- 修改 -->
        <el-dialog title="维护信息" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp" >
               <div class="mainname titleInfo ">基本信息</div>
                <el-form-item class="cl_td" label="远程系统标识" prop="remoteSystemInd" 
                   :rules="[ { required: true, message: '远程系统标识不能为空'}]">
                    <el-select v-model="tempUp.remoteSystemInd" class="wd200" 
                    	@change="remoteSystemIndChangeUp($event)" readonly disabled>
                    <el-option
                        v-for="(item, index ) in remoteSystemIndOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="连接模式" prop="connModel" 
                    :rules="[ { required: true, message: '连接模式不能为空'}]">
                    <el-select v-model="tempUp.connModel" class="wd200" readonly disabled>
                    <el-option
                        v-for="(item, index ) in connModelOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
				<el-form-item class="cl_td" label="编码" prop="independentFlag" 
                    :rules="[ { required: true, message: '编码不能为空'}]">
                    <el-select v-model="tempUp.independentFlag" class="wd200" readonly disabled>
                    <el-option
                        v-for="(item, index ) in independentFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>               
                <el-form-item class="cl_td" label="消息头" prop="includeHeaderInd" 
                    :rules="[ { required: true, message: '消息头不能为空'}]" >
                    <el-select v-model="tempUp.includeHeaderInd" class="wd200" readonly disabled>
                    <el-option
                        v-for="(item, index ) in includeHeaderIndOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>  
                <el-form-item class="cl_td" label="消息头长度" prop="headerLength" 
                    :rules="[ { required: true, message: '消息头长度不能为空'}]">
                    <el-input v-model="tempUp.headerLength" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="授权事件号" prop="eventNo"
                	:rules="[ { required: true, message: '授权事件号不能为空'}]"> 
                   <el-input v-model="tempUp.eventNo" class="wd200" type="text"/>
                </el-form-item>
                 <el-form-item class="cl_td" label="读超时(ms)" prop="readTimeout" 
                    :rules="[ { required: true, message: '读超时(ms)不能为空'}]">
                    <el-input v-model="tempUp.readTimeout" class="wd200" type="text" />
                </el-form-item>
                <div v-if="tempUp.connModel=='DI' || tempUp.connModel=='SA' || tempUp.connModel=='SI'">
	                <div class="clearboth"></div>
	                <div class="mainname titleInfo ">本地IP</div>
	                <el-form-item class="cl_td" label="本地IP" prop="localIp" 
	                    :rules="[ { required: true, message: '本地IP不能为空'}]">
	                    <el-input v-model="tempUp.localIp" class="wd200" type="text" />
	                </el-form-item>
	                <el-form-item class="cl_td" label="本地端口 " prop="localPort" 
	                    :rules="[ { required: true, message: '本地端口 不能为空'}]">
	                    <el-input v-model="tempUp.localPort" class="wd200" type="text" />
	                </el-form-item>
	        	</div>
		        <div v-if="tempUp.connModel=='DA' || tempUp.connModel=='SA' || tempUp.connModel=='SI'">
	                <div class="clearboth"></div>
	                <div class="mainname titleInfo ng-binding">远程IP</div>
	             	<el-form-item class="cl_td" label="远程IP" prop="remoteIp" 
	                    :rules="[ { required: true, message: '远程IP不能为空'}]">
	                    <el-input v-model="tempUp.remoteIp" class="wd200" type="text" />
	                </el-form-item>
	                <el-form-item class="cl_td" label="远程端口 " prop="remotePort" 
	                    :rules="[ { required: true, message: '远程端口 不能为空'}]">
	                    <el-input v-model="tempUp.remotePort" class="wd200" type="text" />
	                </el-form-item>
                 </div>
                <div v-if="tempUp.connModel=='DA' || tempUp.connModel=='SA' || tempUp.connModel=='SI'">
	              	<div class="clearboth"></div>
	                <div class="mainname titleInfo ng-binding">重连间隔时间(ms)</div>
	               	<el-form-item class="cl_td" label="重连间隔时间(ms)" prop="reconnInterval" 
	                    :rules="[ { required: true, message: '重连间隔时间(ms)不能为空'}]">
	                    <el-input v-model="tempUp.reconnInterval" class="wd200" type="text" />
	                </el-form-item>
	               	<el-form-item class="cl_td" label="重连次数" prop="maxCount" 
	                    :rules="[ { required: true, message: '重连次数不能为空'}]">
	                    <el-input v-model="tempUp.maxCount" class="wd200" type="text" />
	                </el-form-item>
                </div>
            </el-form>
           	<div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleUp = false">取消</el-button>
                <el-button type="primary" @click="submitUpInfo()">确认</el-button>
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
        const cityOptions = ['上海', '北京', '广州', '深圳'];
        return {
            // 权限
            selBtnFlag: false,
            addBtnFlag: false,
            updBtnFlag: false,
            selTwoBtnFlag: false,
            delBtnFlag: false,
            btnAuthStr: '',
            // 列表
            showCode: false,
            eyer:true,
            queryForm: {
                pageNum: 1,
                pageSize:10,
            },
            listLoading: false,
            queryFormRef: {},
            queryFormRules: {},      
            tableList: [],
            tableTotal: null,
           	list_operationMode: '',
            // 下拉框
            operationModeOptions: [], //运营模式
            controlSceneCodeRelOptions: [],//授权响应码
            remoteSystemIndOptions: [],//远程系统标识
            connModelOptions: [],//连接模式
            includeHeaderIndOptions: [],//消息头
            independentFlagOptions: [],//编码
            /*----新增----*/
            tempAdd: {}, // 新增
            rulesAdd: {}, 
            dataFormAdd: {},
            dialogFormVisibleAdd: false,
            addTableList: [],//列表
            addObj: [],
            cities: cityOptions,
            remoteSystemIndItem: '',
            
            /*----修改----*/
            dialogFormVisibleUp: false,
            tempUp: {}, // 修改
            tempUpList1: [],
            rulesUp: {},
            dataFormUp:{},
            remoteSystemIndItemUp: '',
            /*----详情----*/
            dialogFormVisibleDetail: false,
            tempDetail: {}, // 修改
            rulesDetail: {},
            /*----删除----*/
            dialogFormVisibleDel: false,
            tempDel: {},
            rulesDel: {},
            dataFormDel:{},
        }
    },
    created() {
        
        let logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))
        this.operationMode = logininfo.operationMode
        this.corporationIdNew=logininfo.corporationEntityNo
        this.getBtnAuth()
    },
    mounted() {
        this.getSelectDict('dic_certificateType').then((res) => {
            this.idTypeList = res
        })
       //运营模式
        let objis={
            requestType: '1',
            resultType: '1',
            adminFlagLogin: '1',
        }
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0037",objis).then(res => {
            this.operationModeOptions = res
        })
        //远程系统标识
        this.getSelectDict( "dic_recordType").then(res => {
       		res.splice(2,1)
       		this.remoteSystemIndOptions = res
        })
        //连接模式
       	this.getSelectDict( "dic_connctModel").then(res => {
       		this.connModelOptions = res
        })
       
		this.getList()
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
                            this.eventList += item.eventNo+','
                        })
                        if (this.eventList.includes('AUS.PM.30.0002')) { // 查询
                            this.selBtnFlag = true
                        } else {
                            this.selBtnFlag = false
                        }
                        if (this.eventList.includes('AUS.PM.30.0001')) { // 新增
                            this.addBtnFlag = true
                        } else {
                            this.addBtnFlag = false
                        }
                        if (this.eventList.includes('AUS.PM.30.0003')) { // 维护
                            this.updBtnFlag = true
                        } else {
                            this.updBtnFlag = false
                        }
                        if(this.eventList.includes('AUS.PM.30.0003')){    //删除
	   						this.delBtnFlag = true;
		   				}
		   				else{
		   					this.delBtnFlag = false;
		   				}
                    }
                }
            })
        },
        //终止网络链接
		handleStop(row){
			
		   let authAdd = {};
		   authAdd = JSON.parse(JSON.stringify(row))
		  	authAdd.connStatus = "0";
		   	this.$confirm('确定要中止网络连接吗?', '提示', {
			            confirmButtonText: '确定',
			            cancelButtonText: '取消',
			            type: 'warning'
			        }).then(() => {
			   if(authAdd.remoteSystemInd == 'V') {
			   		/*this.$confirm('确定要中止网络连接吗?', '提示', {
			            confirmButtonText: '确定',
			            cancelButtonText: '取消',
			            type: 'warning'
			        }).then(() => { */// 是
			            this.post('/gwVisa/gw.vi.00.0000',  authAdd, (res) => {
			                if (res.returnMsg == 'OK') {
			           				this.$notify({
				                    title: 'Success',
				                    message: '中止成功',
				                    type: 'success',
				                    duration: 2000
				                }) 
				                this.getList()
			                }
		            	}); 
			      /*  })*/
			   	}else if(authAdd.remoteSystemInd == 'C') {
			   		/*this.$confirm('是否确认删除?', '提示', {
			            confirmButtonText: '确定',
			            cancelButtonText: '取消',
			            type: 'warning'
			        }).then(() => { */// 是
			        	
			            this.post('/gwCups/gw.cu.00.0000',  authAdd, (res) => {
			                if (res.returnMsg == 'OK') {
			           				this.$notify({
				                    title: 'Success',
				                    message: '中止成功',
				                    type: 'success',
				                    duration: 2000
				                }) 
				                this.getList()
			                }
		            	}); 
			        /*})*/
			   	}else if(authAdd.remoteSystemInd == 'M') {
			   		/*this.$confirm('是否确认删除?', '提示', {
			            confirmButtonText: '确定',
			            cancelButtonText: '取消',
			            type: 'warning'
			        }).then(() => {*/ // 是
			            this.post('/gwMc/gw.mc.00.0000',  authAdd, (res) => {
			                if (res.returnMsg == 'OK') {
			           				this.$notify({
				                    title: 'Success',
				                    message: '中止成功',
				                    type: 'success',
				                    duration: 2000
				                }) 
				                this.getList()
			                }
		            	}); 
			      //  })
			   	}else if(authAdd.remoteSystemInd == 'J') {
			   		/*this.$confirm('是否确认删除?', '提示', {
			            confirmButtonText: '确定',
			            cancelButtonText: '取消',
			            type: 'warning'
			        }).then(() => {*/ // 是
			            this.post('/gwJcb/gw.jc.00.0000',  authAdd, (res) => {
			                if (res.returnMsg == 'OK') {
			           				this.$notify({
				                    title: 'Success',
				                    message: '中止成功',
				                    type: 'success',
				                    duration: 2000
				                }) 
				                this.getList()
			                }
		            	}); 
			       // })
			   	}
	 		})
		},
		//运营模式监听
        operationModeChange(val) {
            this.controlSceneCodeRelOptions = []
            this.list_operationMode = val
        },
       	//查询
        handleSearch() {
            this.getList()
        },
        // 列表
        getList() {
        	this.listLoading = true
            let obj={
                authDataSynFlag: '1',
                authFlag: "0",
                isTrans: true,//是否需要翻译数据字典
		     	transParams : ['dic_connctModel','dic_serverClientInd','dic_connStatus'],//查找数据字典所需参数
			 	transDict : ['connModel','serverClientInd','connStatus'],//翻译前后key
		   	}
            obj = Object.assign ( obj, this.queryForm )
           	this.getTableList('/beta/betaService/AUS.PM.30.0002', obj ,(res) => {
                if (res.returnCode == '000000') {
                    this.listLoading = false
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.tableList = res.returnData.rows
                        //this.tableTotal = res.returnData.totalCount
                       
                    }
                }
            })
        },
        //删除
        delData(row){
        	this.tempDel = Object.assign({}, row)
	        this.$confirm('是否确认删除?', '提示', {
	            confirmButtonText: '确定',
	            cancelButtonText: '取消',
	            type: 'warning'
	        }).then(() => { // 是
	            this.post('/beta/betaService/AUS.PM.30.0003', this.tempDel, (res) => {
                    if (res.returnCode == '000000') {
                        this.$notify({
                            title: 'Success',
                            message: '删除成功',
                            type: 'success',
                            duration: 2000
                        })
                        this.getList()
                    }
	            })
	        })
        },
       //显示新增弹框
        handleCreate() {
            this.dialogFormVisibleAdd = true
              this.tempAdd.differentType='无'
            this.$nextTick(() => {
                this.$refs['dataFormAdd'].clearValidate()
          })
        }, 
        //监听远程系统标识
        remoteSystemIndChange(value) {
            this.remoteSystemIndItem = value;
            this.getIndependentFlag()
           	this.getIncludeHeaderInd()
           	this.getIncludeHeaderIndChange()
        },
        //编码下拉
        getIndependentFlag() {
        	let params = {
                queryFlag: "children",
				type: "DROPDOWNBOX",
            }
            if(this.remoteSystemIndItem == 'C'){
        	 	this.getSelectDict( "dic_charCodeType",params).then(res => {
            		res.splice(1,1)
	            	this.independentFlagOptions = res
	            })
			}     
			if(this.remoteSystemIndItem == 'J' || this.remoteSystemIndItem == 'M' || this.remoteSystemIndItem == 'V'){
	           this.getSelectDict( "dic_charCodeType",params).then(res => {
	               	res.splice(0,1)
	            	this.independentFlagOptions = res
            
	            })
			} 
		},
		//消息头
		getIncludeHeaderInd() {
            let params = {
                queryFlag: "children",
				type: "DROPDOWNBOX",
            }
         	if(this.remoteSystemIndItem == 'C' || this.remoteSystemIndItem == 'V'){
	            this.getSelectDict( "dic_headYN",params).then(res => {
	           		res.splice(0,1)
                    this.includeHeaderIndOptions = res
	           	})
            }
         	if(this.remoteSystemIndItem == 'J' || this.remoteSystemIndItem == 'M'){
	            this.getSelectDict( "dic_headYN",params).then(res => {
	           		res.splice(1,1)
                    this.includeHeaderIndOptions = res
	            })
            }
        },
        getIncludeHeaderIndChange(){
        	this.getIncludeHeaderInd()
        	if(this.tempAdd.includeHeaderInd == 'Y'){
            	if(this.remoteSystemIndItem == 'C'){
            		this.tempAdd.headerLength = '22'
            	}else if(this.remoteSystemIndItem == 'V'){
            		this.tempAdd.headerLength = '46'
            	}
            }else if(this.tempAdd.includeHeaderInd == 'N'){
            	this.tempAdd.headerLength = ''
            }
        },
        //确认提交新增数据
        createData() {
        	this.tempAdd.charCode = this.tempAdd.independentFlag
            this.post('/beta/betaService/AUS.PM.30.0001', this.tempAdd, (res) => {
                if (res.returnCode == '000000') {
                        this.dialogFormVisibleAdd = false
                    this.$notify({
                        title: 'Success',
                        message: '新增成功',
                        type: 'success',
                        duration: 2000
                    }) 
                    this.getList()
                    this.tempAdd = {}
                }
            })
        },
       	//显示详情弹框
        handleDetail(row) {
        	this.tempDetail = Object.assign({}, row)
        	this.dialogFormVisibleDetail = true
            if(this.tempDetail.includeHeaderInd == 'N'){
            	this.tempDetail.includeHeaderInd = '无'
            }else if(this.tempDetail.includeHeaderInd == 'Y'){
            	this.tempDetail.includeHeaderInd = '有'
            }
			if(this.tempDetail.charCode == 'A'){
				this.tempDetail.independentFlag = 'ASCII'
			}else if(this.tempDetail.charCode == 'E'){
				this.tempDetail.independentFlag = 'EBCDIC'
			}
        },
        
        /*----显示修改弹框----*/
        handleUpdate(row) {
            this.tempUp = Object.assign({}, row)
            this.dialogFormVisibleUp= true
            this.$nextTick(() => {
                this.$refs['dataFormUp'].clearValidate()
            })
        }, 
        //监听远程系统标识
        remoteSystemIndChangeUp(value) {
            this.remoteSystemIndItemUp = value;
            this.getIndependentFlagUp()
           	this.getIncludeHeaderIndUp()
           	this.getIncludeHeaderIndChangeUp()
        },
        //编码下拉
        getIndependentFlagUp() {
        	let params = {
                queryFlag: "children",
				type: "DROPDOWNBOX",
            }
            if(this.remoteSystemIndItemUp == 'C'){
        	 	this.getSelectDict( "dic_charCodeType",params).then(res => {
            		res.splice(1,1)
	            	this.independentFlagOptions = res
	            })
			}     
			if(this.remoteSystemIndItemUp == 'J' || this.remoteSystemIndItemUp == 'M' || this.remoteSystemIndItemUp == 'V'){
	           this.getSelectDict( "dic_charCodeType",params).then(res => {
	               	res.splice(0,1)
	            	this.independentFlagOptions = res
            
	            })
			} 
		},
		//消息头
		getIncludeHeaderIndUp() {
            let params = {
                queryFlag: "children",
				type: "DROPDOWNBOX",
            }
         	if(this.remoteSystemIndItemUp == 'C' || this.remoteSystemIndItemUp == 'V'){
	            this.getSelectDict( "dic_headYN",params).then(res => {
	           		res.splice(0,1)
                    this.includeHeaderIndOptions = res
	           	})
            }
         	if(this.remoteSystemIndItemUp == 'J' || this.remoteSystemIndItemUp == 'M'){
	            this.getSelectDict( "dic_headYN",params).then(res => {
	           		res.splice(1,1)
                    this.includeHeaderIndOptions = res
	            })
            }
        },
        getIncludeHeaderIndChangeUp(){
        	this.getIncludeHeaderIndUp()
        	/*if(this.tempUp.includeHeaderInd == 'N'){
            	this.tempUp.includeHeaderInd = '无'
            }else if(this.tempUp.includeHeaderInd == 'Y'){
            	this.tempUp.includeHeaderInd = '有'
            }*/
        	/*if(this.tempUp.includeHeaderInd == 'Y'){
            	if(this.remoteSystemIndItemUp == 'C'){
            		this.tempUp.headerLength = '22'
            	}else if(this.remoteSystemIndItemUp == 'V'){
            		this.tempUp.headerLength = '46'
            	}
            }else if(this.tempUp.includeHeaderInd == 'Y'){
            	this.tempUp.headerLength = ''
            }*/
        },
       	//确认提交修改数据
        submitUpInfo() {
        	this.$refs['dataFormUp'].validate((valid) => {
            	if (valid) {
		          	this.post('/beta/betaService/AUS.PM.30.0003', this.tempUp, (res) => {
                        if (res.returnCode == '000000') {
                            this.dialogFormVisibleUp = false
                            this.$notify({
                                title: 'Success',
                                message: '修改成功',
                                type: 'success',
                                duration: 2000
                            }) 
                            this.getList()
                            this.tempUp = {}
                        }
		            })
	          	}
          	})
        },
    }
}   
</script>

<style>
.w-input{
    width: 70px !important;
    display: inline-block;
    padding-right: 5px;
}
</style>

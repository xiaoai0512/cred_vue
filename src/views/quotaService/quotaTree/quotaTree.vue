<!-- 额度网 -->
<template>
	<div class="allContent">
		<el-form ref="quoteTreeForm" :model="quoteTreeList">
			<el-form-item class="cl_td" label="运营模式" prop="operationMode">
				<el-select v-model="quoteTreeList.operationMode" class="wd200" clearable>
					<el-option v-for="(item, index ) in operationModeOptions" :key="index" :label="item.modeName" :value="item.operationMode" />
				</el-select>
			</el-form-item>
			<el-form-item class="cl_td" label="额度网编号" prop="creditTreeId">
				<el-input v-model="quoteTreeList.creditTreeId" class="wd200" type="text" />
			</el-form-item>
			<div class="cl_tr text_center">
				<el-button type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
				<el-button type="primary" icon="el-icon-plus" @click="handleAddQuotaTree" v-show="addBtnFlag">新增</el-button>
			</div>
		</el-form>
		<el-table v-loading="listLoading" :data="list" :key="listKey" border fit highlight-current-row style="width: 100%;">
			<el-table-column prop="operationMode" label="运营模式" align="center" />
			<el-table-column prop="creditTreeId" label="额度网编号" align="center" />
			<el-table-column prop="creditTreeDesc" label="额度网描述" align="center" />
			<el-table-column prop="creditTreeVersion" label="额度网版本" align="center" />
			<el-table-column prop="creditTreeActiveStatusDesc" label="生效状态" align="center" />
			<el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="480px">
				<template slot-scope="{row,$index}">
					<el-button icon="el-icon-info" type="primary" size="mini" @click="handleCredit(row,$index)">授信网详情 </el-button>
					<el-button icon="el-icon-info" type="primary" size="mini" @click="handleUseLetter(row,$index)">用信网详情 </el-button>
					<el-button  type="primary" size="mini" icon="el-icon-edit" @click="handleUpQuota(row)" v-show="row.creditTreeActiveStatus=='N'">修改</el-button>
					<el-button  type="primary" size="mini" @click="handleDefault(row)"  v-show="row.creditDefault=='A'">设置默认</el-button>
					<el-button  type="primary" size="mini" @click="handleDefault(row)"  v-show="row.creditDefault=='Y'">取消默认</el-button>
					<el-button  type="primary" size="mini" @click="handleStatus(row)">生效状态</el-button>
					<el-button  type="primary" size="mini" @click="handleUpgrade(row)"  v-show="row.upLevel=='Y'">版本升级 </el-button>
				</template>
			</el-table-column>
		</el-table>
		<pagination v-show="total>0" :total="total" :page.sync="quoteTreeList.pageNum" :limit.sync="quoteTreeList.pageSize" @pagination="getList" />
		<!--新增-->
		<el-dialog title="新增额度网" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd">
                <el-form-item class="cl_td" label="运营模式" prop="operationMode"
                	:rules="[ { required: true, message: '运营模式不能为空'}]">
                    <el-select v-model="tempAdd.operationMode" class="wd200" clearable >
                        <el-option v-for="(item, index ) in operationModeOptions" :key="index" :label="item.modeName"
                            :value="item.operationMode" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="额度网编号" prop="creditTreeId"
                	:rules="[ { required: true, message: '额度网编号不能为空'}]">
                	<el-input v-model="tempAdd.creditTreeId" class="wd200" type="text" />
				</el-form-item>
                </el-form-item>
                <el-form-item class="cl_td" label="额度网描述" prop="creditTreeDesc"
                	:rules="[ { required: true, message: '额度网描述不能为空'}]">
                    <el-input v-model="tempAdd.creditTreeDesc" class="wd200" type="text"  />
                </el-form-item>
                
            </el-form>
           	<div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="createDataTree()">确认</el-button>
                <el-button type="primary" @click="closeAddForm()"> 关闭</el-button>
            </div>
        </el-dialog>
        <!--修改-->
       	<el-dialog title="修改额度网" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp">
                <el-form-item class="cl_td" label="运营模式" prop="operationMode">
                    <el-select v-model="tempUp.operationMode" class="wd200" clearable disabled>
                        <el-option v-for="(item, index ) in operationModeOptions" :key="index" :label="item.modeName"
                            :value="item.operationMode" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="额度网编号" prop="creditTreeId">
                    <el-select v-model="tempUp.creditTreeId" class="wd200" clearable disabled>
                        <el-option v-for="(item, index ) in creditTreeIdOptions" 
                        	:key="index" 
                        	:label="item.creditTreeDesc"
                            :value="item.creditTreeId" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="额度网描述" prop="creditTreeDesc">
                    <el-input v-model="tempUp.creditTreeDesc" class="wd200" type="text" @input="inputChange($event)"/>
                </el-form-item>
                <el-form-item class="cl_td" label="额度网版本号" prop="creditTreeVersion">
                    <el-select v-model="tempUp.creditTreeVersion" class="wd200" clearable disabled>
                        <el-option v-for="(item, index ) in creditTreeVersionOptions" 
                        	:key="index" 
                        	:label="item.creditTreeDesc"
                            :value="item.creditTreeVersion" />
                    </el-select>
                </el-form-item>
            </el-form>
           	<div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="upDataTree()">确认</el-button>
                <el-button type="primary" @click="dialogFormVisibleUp = false"> 关闭</el-button>
            </div>
        </el-dialog>
		<el-dialog :title="tieleName" :visible.sync="dialogFormVisibleTree" width="95%" style="height:95%">
			<div><!--quoteTree.actionType==L为授信，==U为用信-->
				<div style="width: calc(100% - 2px);height:calc(100vh - 50px);">
					<div style="position: absolute;left: 5%;top: 3%;">
						<div style="display: flex;width: 200px;">
							<hr style="background-color: #ff0000;display: inline-block;width: 50%;height:2px;margin-right: 10%;" v-if="quoteTree.actionType=='L'">
							<!--<span style="color:red;font-size: 16px;" v-if="quoteTree.actionType=='U'">检查</span>-->
							<span style="color:red;font-size: 16px;"  v-if="quoteTree.actionType=='L'">检查授信 </span>
						</div>
						<div style="display: flex;width: 200px;">
							<hr style="background-color: #00db00;display: inline-block;width: 50%;height:2px;margin-right: 10%;" v-if="quoteTree.actionType=='U'">
							<span style="color:#00db00;font-size: 16px;" v-if="quoteTree.actionType=='U'">占用</span>
							<hr style="background-color: #00db00;display: inline-block;width: 49%;height:2px;margin-right: 3%;" v-if="quoteTree.actionType=='L'">
							<span style="color:#00db00;font-size: 16px;" v-if="quoteTree.actionType=='L'">百分比授信</span>
						</div>
						<div style="display: flex;width: 200px;" v-if="quoteTree.actionType=='U'">
							<hr style="background-color: #ec8e00;display: inline-block;width: 50%;height:2px;margin-right: 10%;">
							<span style="color:#ec8e00;font-size: 16px;" >共享</span>
						</div>
						<div style="display: flex;width: 200px;"  v-if="quoteTree.actionType=='U'">
							<hr style="background-color: #666666;display: inline-block;width: 50%;height:2px;margin-right: 10%;">
							<span style="color:#666;font-size: 16px;">汇总</span>
						</div>
					</div>
					<!--授信网关系筛选-->
					<div style="color:#555555;font-size:12px;position: absolute;left: 25%;top: 5%;" v-if="quoteTree.actionType=='U'">
						<span style="font-size:14px">关系筛选：</span>
						<el-checkbox-group style="padding-left:45px" :options="all_rel_type_U" v-model="rel_checkList_U" @change="doFilter">
							<el-checkbox v-for="all in all_rel_type_U" :label="all" :key="all">{{all}}</el-checkbox>
						</el-checkbox-group>
					</div>
					<!--用信网关系筛选-->
					<div style="color:#555555;font-size:12px;position: absolute;left: 25%;top: 5%;" v-if="quoteTree.actionType=='L'">
						<span style="font-size:14px">关系筛选：</span>
						<el-checkbox-group style="padding-left:45px" :options="all_rel_type_L" v-model="rel_checkList_L" @change="doFilter">
							<el-checkbox v-for="all in all_rel_type_L" :label="all" :key="all">{{all}}</el-checkbox>
						</el-checkbox-group>
					</div>
					<SeeksRelationGraph ref="seeksRelationGraph" :options="graphOptions" :on-node-click="onNodeClick" :on-line-click="onLineClick">
						<div slot="node" slot-scope="{ node }" @mouseover="showNodeTips(node,$event)" @mouseout="hideNodeTips(node,$event)">
							<div style="height:64px; line-height:64px; border-radius:32px; cursor:pointer" :title="node.text">
								{{ node.text }}
							</div>
						</div>
					</SeeksRelationGraph>
				</div>
			</div>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisibleTree = false">关闭</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import SeeksRelationGraph from 'relation-graph'
	import Pagination from '@/components/Pagination' // secondary package based on el-pagination
	import ApiService from '@/api/api-service'
	import {
		isPassword
	} from '@/utils/validate'
	let linkList = []; //取额度节点之间的关系===links
	let nodeList = [];
	export default {
		name: 'quotaTree',
		components: {
			Pagination,
			SeeksRelationGraph
		},
		data() {
			return {
				//权限
				selBtnFlag: false,
	            addBtnFlag: false,
	            updBtnFlag: false,
	            btnAuthStr: "",
				list: null,
				listKey: '',
				total: 0,
				listLoading: true,
				quoteTreeList: {
					pageNum: 1,
					pageSize: 10,
				},
				quoteTree: {},
				freeExchangeFlagOptions: [], // 下拉框
				operationModeOptions: [],
				treeEffectiveTypList: [],
				creditTreeIdOptions: [],//额度网编号
				creditTreeVersionOptions: [],//额度网版本号
				dialogFormVisibleTree: false,
				pvData: [],
				downloadLoading: false,
				showDefault: false,
				//新增
				dialogFormVisibleAdd: false,
				tempAdd: {},  
				dataFormAdd: {},
				rulesAdd: {},
				//修改
				dialogFormVisibleUp: false,
				tempUp: {},  
				dataFormUp: {},
				rulesUp: {},
				// 额度网参数
				tieleName: '',
				showReviewer: false,
				temp: {
					currencyCode: '',
					currencyDesc: '',
					decimalPosition: '',
					referred: '',
					freeExchangeFlag: '',
					countryCode: ''
				},
				isShowCodePanel: false,
				isShowNodeTipsPanel: false,
				focusNodeAadjacency: true,
				hoverAnimation: true,
				nodeMenuPanelPosition: {
					x: 0,
					y: 0
				},
				currentNode: {},
				isHideThisLine: true,
				rel_checkList_U: ['汇总', '占用', '共享'],
				rel_checkList_L: ['检查授信 ', '百分比授信'],
				all_rel_type_U: ['汇总', '占用', '共享'],
				all_rel_type_L: ['检查授信 ', '百分比授信'],
				graphOptions: {
					hoverAnimation: true,
					focusNodeAadjacency: true,
					defaultNodeBorderWidth: 0,
					defaultLineWidth: 1.5,
					defaultNodeColor: 'rgb(25,107,158)',
					allowShowMiniToolBar: false,
					allowSwitchLineShape: true,
					allowSwitchJunctionPoint: true,
					layouts: [{
						'label': '手工',
						'layoutName': 'fixed',
						'layoutClassName': 'seeks-layout-fixed',
						'defaultJunctionPoint': 'border',
						'defaultNodeShape': 0,
						'defaultLineShape': 1
						// "label": "中心",
						// "layoutName": "tree",
						// "layoutClassName": "seeks-layout-center",
						// "defaultJunctionPoint": "border",
						// "defaultNodeShape": 0,
						// "defaultLineShape": 1,
						// "from": "bottom"
					}, ],
					// 这里可以参考"Graph 图谱"中的参数进行设置
				},
				links: [],
				nodes: [],
			};
		},
		created() {
			
		},
		mounted() {
			this.getList() // 查询列表
				// 运营模式 
			this.getSelectDict("/beta/betaService/COS.IQ.02.0006").then(res => {
				this.operationModeOptions = res
			})
			this.getSelectDict('dic_treeEffectiveTyp').then((res) => {
				this.treeEffectiveTypList = res
			})
			//额度网编号
			this.getSelectDict("/beta/betaService/LMS.PM.01.0025").then(res => {
				this.creditTreeIdOptions = res
			})
			this.getBtnAuth();
		},
		methods: {
			 // 查询按钮权限
	        getBtnAuth() {
	            //console.log(window.sessionStorage.getItem("menuNo"));
	            let params = {
	                menuNo: window.sessionStorage.getItem("menuNo"),
	            };
	            this.getTableList("/beta/betaService/COS.CS.01.0030",params,(res) => {
                    if (res.returnCode == "000000") {
                        if (res.returnData && res.returnData.length > 0) {
                            res.returnData.forEach((item) => {
                                this.btnAuthStr += item.eventNo + ",";
                            });
                            if (this.btnAuthStr.includes("AUS.PM.03.0104")) {
                                // 查询
                                this.selBtnFlag = true;
                            } else {
                                this.selBtnFlag = false;
                            }
                            if (this.btnAuthStr.includes("AUS.PM.03.0101")) {
                                // 新增
                                this.addBtnFlag = true;
                            } else {
                                this.addBtnFlag = false;
                            }
                            if (this.btnAuthStr.includes("AUS.PM.03.0103")) {
                                // 维护
                                this.updBtnFlag = true;
                            } else {
                                this.updBtnFlag = false;
                            }
                        }
                    }
	            });
	        },
			// 查询列表
			getList() {
				this.listLoading = true
				const obj = {
					isTrans: true,
					transParams: ['dic_invalidFlagYN', 'dic_invalidFlagYN'],
					transDict: ['creditTreeVersion', 'creditTreeActiveStatus']
				}
				this.quoteTreeList = Object.assign(this.quoteTreeList, obj)
				this.getTableList('/beta/betaService/LMS.PM.01.0024', this.quoteTreeList, (res) => {
					this.listLoading = false
					if(res.returnData.rows && res.returnData.rows.length > 0) {
						this.list = res.returnData.rows
						this.total = res.returnData.totalCount
					} else {
						this.list = []
						this.total = 0
					}
				}, (err) => {
					if(err) {
						this.list = []
						this.total = 0
					}
				})
			},
			//设置默认
			handleDefault(row){
				let defaultObj= {
					authDataSynFlag: '1',
					sign: 'defaultS'
				}
				defaultObj = Object.assign (defaultObj, row)
				if(defaultObj.creditDefault=="A"){
					defaultObj.creditDefault = 'Y'
				}else if(defaultObj.creditDefault=="Y"){
					defaultObj.creditDefault = 'N'
				}
				this.handleAllStatusBtn(defaultObj)
			},
			//生效状态
			handleStatus(row){
				let creditStatus= {
					changeActiveStatus: 'Y',
					authDataSynFlag: '1',
					sign: 'creditS'
				}
				if(row.creditTreeActiveStatus=="Y"){
					row.creditTreeActiveStatus = "N"
				}else{
					row.creditTreeActiveStatus = "Y"
				}
				creditStatus = Object.assign ( creditStatus, row)
				this.handleAllStatusBtn(creditStatus)
			},
			//版本升级
			handleUpgrade(row){
				let gradeStatus= {
					authDataSynFlag: '1',
				}
				gradeStatus = Object.assign (gradeStatus, row)
				this.post('/beta/betaService/LMS.PM.01.0027', gradeStatus,(res) => {
	                if (res.returnCode == '000000') {
                		this.$notify({
	                        title: 'Success',
	                        message: '版本升级成功',
	                        type: 'success',
	                        duration: 2000
	                    })
	                    this.getList()
                	}
	            })
			},
			handleAllStatusBtn(datas){
				let parames = {}
				if(datas.sign=='defaultS'){
					parames.creditDefault=datas.creditDefault
				}
				parames = Object.assign ( parames, datas)
				this.post('/beta/betaService/LMS.PM.01.0023', parames,(res) => {
	                if (res.returnCode == '000000') {
	                	if(datas.sign=='creditS'){
	                		this.$notify({
		                        title: 'Success',
		                        message: '状态更新成功',
		                        type: 'success',
		                        duration: 2000
		                    })
		                    this.getList()
	                	}else if(datas.sign=='defaultS'){
	                		this.$notify({
		                        title: 'Success',
		                        message: '设置成功',
		                        type: 'success',
		                        duration: 2000
		                    })
		                    this.getList()
	                	}
	                }
	            })
			},
			// 查询
			handleFilter() {
				this.quoteTreeList.page = 1
				this.getList()
			},
			resetTemp() {
				this.temp = {
					currencyCode: '',
					currencyDesc: '',
					decimalPosition: '',
					referred: '',
					freeExchangeFlag: '',
					countryCode: '',
				}
			},
			//新增显示的弹框
			handleAddQuotaTree(){
				this.dialogFormVisibleAdd = true
				this.$nextTick(() => {
                    this.$refs['dataFormAdd'].clearValidate()
                })
			},
			//监听额度网编号
			creditTreeIdChange(row){
				this.tempAdd.creditTreeId =row
				this.getCreditTreeVersion()
			},
			//下拉获取额度网版本号
			getCreditTreeVersion(){
				let params  = {
					authDataSynFlag:  '1',
					adminFlagUser: '1',
					operationMode:  this.tempAdd.operationMode,
					creditTreeId: this.tempAdd.creditTreeId
				}
				this.post('/beta/betaService/LMS.PM.01.0025', params , (res) => {
			 	   if (res.returnCode == '000000') {
                    	if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
							let arr = []
							let rows =res.returnData.rows
							let creditTreeVersionDescNew = {}
							rows.forEach((item, index) => {
								item.creditTreeVersionNew =item.creditTreeVersionList
								this.creditTreeVersionListPublice=item.creditTreeVersionList
								item.creditTreeVersionNew.forEach((item, index) => {
									arr[index] = {
		                                label: item.creditTreeVersion,
		                                value: item.creditTreeVersion
		                            }
								})
							})
							this.creditTreeVersionOptions = arr
						}else{
							  this.creditTreeVersionOptions = []
						}
                   	}
				})
			},
			creditTreeVersionChange(row){
				this.creditTreeVersionListPublice.forEach(item => {
					if(row==item.creditTreeVersion){
						this.addCreditTreeActiveStatus=item.creditTreeActiveStatus
					}
				})
			},
			//关闭新增探框
			closeAddForm(){
				this.dialogFormVisibleAdd = false
				this.$refs['dataFormAdd'].resetFields()
			},
			//新增确认提交数据
			createDataTree() {
				this.$refs['dataFormAdd'].validate((valid) => {
	                if (valid) {
		                this.post('/beta/betaService/LMS.PM.01.0021', this.tempAdd, (res) => {
		                    if (res.returnCode == '000000') {
		                        this.dialogFormVisibleAdd = false
		                        this.$notify({
		                            title: 'Success',
		                            message: '新增成功',
		                            type: 'success',
		                            duration: 2000
		                        })
		                        this.getList()
		                    }
		                })
	                }
                })
            },
            //修改显示弹框
            handleUpQuota(row){
            	this.tempUp = Object.assign({}, row)
            	this.$nextTick(() => {
                    this.$refs['dataFormUp'].clearValidate()
                })
				this.dialogFormVisibleUp = true
            },
            //监听额度网描述
            inputChange (e) {
			    this.$forceUpdate()
			},
           	//确认修改
            upDataTree() {
				this.post('/beta/betaService/LMS.PM.01.0023', this.tempUp, (res) => {
	                if (res.returnCode == '000000') {
	                    this.dialogFormVisibleUp = false
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
			//授信网详情
			handleCredit(credit){
				let creditDetail=credit
				creditDetail.actionType = "L"
				this.tieleName = "授信网"
				this.handleDetail(creditDetail)
			},
			//用信网详情
			handleUseLetter(useLetter){
				let useLetterDetail=useLetter
				useLetterDetail.actionType = "U"
				this.tieleName = "用信网"
				this.handleDetail(useLetterDetail)
			},
			handleDetail(data) {
				this.dialogFormVisibleTree = true
				this.$nextTick(() => {
					if(data.actionType=='L'){
						this.quoteTree.actionType = "L"
					}else if(data.actionType=='U'){
						this.quoteTree.actionType = "U"
					}
					this.$forceUpdate()
					this.quoteTree.creditTreeId = data.creditTreeId
					this.quoteTree.operationMode = data.operationMode
					this.quoteTree.effectiveDate = data.effectiveDate
					this.quoteTree.creditTreeVersion = data.creditTreeVersion
					this.quoteTree.authDataSynFlag = '1'
					ApiService.post("/beta/betaService/LMS.PM.01.0022", this.quoteTree, (data) => {
						linkList = [];
						nodeList = [];
						//   debugger
						var linkStr = {}; //取额度节点之间的关系===links
						//取额度节点之间的关系===links  ,x:100+i*100,y:200+i*100
						if(data.returnData.rows[0].authCreditMeshDtoList.length > 0){
							//this.dialogFormVisibleTree = true
							for(var i = 0; i < data.returnData.rows[0].authCreditMeshDtoList.length; i++) {
								///组合关系
								if(this.quoteTree.actionType =='U'){
									if(data.returnData.rows[0].authCreditMeshDtoList[i].relativeNodeTyp == 'R') { //汇总
										linkStr = {
											from: data.returnData.rows[0].authCreditMeshDtoList[i].creditNodeNo,
											to: data.returnData.rows[0].authCreditMeshDtoList[i].relativeNodeNo,
											color: '#666',
											data: {
												type: '汇总'
											},
											text: ''
												// lineStyle:{width:2,curveness:0}
										};
										linkList.push(linkStr);
									} else if(data.returnData.rows[0].authCreditMeshDtoList[i].relativeNodeTyp == 'O') { //占用
										linkStr = {
											from: data.returnData.rows[0].authCreditMeshDtoList[i].creditNodeNo,
											to: data.returnData.rows[0].authCreditMeshDtoList[i].relativeNodeNo,
											color: '#00db00',
											data: {
												type: '占用'
											},
											text: ''
												// lineStyle:{width:2,curveness:0}
										};
										linkList.push(linkStr);
									} else if(data.returnData.rows[0].authCreditMeshDtoList[i].relativeNodeTyp == 'S') { //共享
										linkStr = {
											from: data.returnData.rows[0].authCreditMeshDtoList[i].creditNodeNo,
											to: data.returnData.rows[0].authCreditMeshDtoList[i].relativeNodeNo,
											color: '#ec8e00',
											data: {
												type: '共享'
											},
											text: ''
												//lineStyle:{curveness: -0.3}
										};
										linkList.push(linkStr);
									} 
									/*else if(data.returnData.rows[0].authCreditMeshDtoList[i].relativeNodeTyp == 'C') { //检查
										linkStr = {
											from: data.returnData.rows[0].authCreditMeshDtoList[i].creditNodeNo,
											to: data.returnData.rows[0].authCreditMeshDtoList[i].relativeNodeNo,
											color: '#ff0000',
											data: {
												type: '检查'
											},
											text: ''
												//lineStyle:{width:2,curveness:0}
										};
										linkList.push(linkStr);
									}*/
								}else if(this.quoteTree.actionType =='L'){
									if(data.returnData.rows[0].authCreditMeshDtoList[i].relativeNodeTyp == 'C') { //检查授信 
										linkStr = {
											from: data.returnData.rows[0].authCreditMeshDtoList[i].creditNodeNo,
											to: data.returnData.rows[0].authCreditMeshDtoList[i].relativeNodeNo,
											color: 'red',
											data: {
												type: '检查授信'
											},
											text: ''
												// lineStyle:{width:2,curveness:0}
										};
										linkList.push(linkStr);
									} else if(data.returnData.rows[0].authCreditMeshDtoList[i].relativeNodeTyp == 'P') { //百分比授信
										linkStr = {
											from: data.returnData.rows[0].authCreditMeshDtoList[i].creditNodeNo,
											to: data.returnData.rows[0].authCreditMeshDtoList[i].relativeNodeNo,
											color: '#00db00',
											data: {
												type: '百分比授信 '
											},
											text: ''
												// lineStyle:{width:2,curveness:0}
										};
										linkList.push(linkStr);
									} 
								}
							}
						}else{
							linkList = []
						}

						// 开始组装数据
						var creditListStr = {};
						if(data.returnData.rows[0].authCreditNodeDtoList.length > 0) {
							let obj01 = {};
							var nodeLevel = [];
							for(var m = 0; m < data.returnData.rows[0].authCreditNodeDtoList.length; m++) {
								nodeLevel.push(data.returnData.rows[0].authCreditNodeDtoList[m].creditNodeNoLevel);
							}
							console.log(nodeLevel)
							for(let i = 0; i < nodeLevel.length; i++) {
								let key = nodeLevel[i];
								if(obj01[key]) {
									obj01[key]++;
								} else {
									obj01[key] = 1;
								}
							}
							//得到最多的一层有几个节点
							let maxCount = 0;
							for(let key in obj01) {
								if(obj01[key] > maxCount) {
									maxCount = obj01[key];
								}
							}
							console.log(maxCount)
							var arrList = data.returnData.rows[0].authCreditNodeDtoList;
							
							for(var j = 0; j < arrList.length; j++) {
								// debugger
								if(nodeList.length > 0) {
									for(var k = j - 1; k < nodeList.length; k++) {
										//判断是否同一层，相等则为同一层
										if(nodeList[k].nodeLevel === arrList[j].creditNodeNoLevel) {
											creditListStr = {
												id: arrList[j].creditNodeNo,
												name: arrList[j].creditDesc,
												nodeLevel: arrList[j].creditNodeNoLevel,
												nodNodLyeY: nodeList[k].nodNodLyeY,
												nodNodLye: arrList[j].creditNodeNoLevel,
												x: parseInt(nodeList[k].x + (150 * maxCount) / (obj01[arrList[j].creditNodeNoLevel] + 1) + arrList[j].creditNodeNoLevel),
												y: parseInt(nodeList[k].nodNodLyeY),
											}
											nodeList.push(creditListStr)
										} else {
											// 不相等，则为新的一层
											creditListStr = {
												id: arrList[j].creditNodeNo,
												name: arrList[j].creditDesc,
												nodeLevel: arrList[j].creditNodeNoLevel,
												nodNodLyeY: nodeList[k].nodNodLyeY + 150,
												nodNodLye: arrList[j].creditNodeNoLevel,
												x: parseInt((150 * maxCount) / (obj01[arrList[j].creditNodeNoLevel] + 1) + arrList[j].creditNodeNoLevel),
												y: parseInt(nodeList[k].nodNodLyeY + 150),
											}
											nodeList.push(creditListStr)
										}
										break;
									}
								} else {
									//第一层节点
									creditListStr = {
										id: arrList[j].creditNodeNo,
										name: arrList[j].creditDesc,
										nodeLevel: arrList[j].creditNodeNoLevel,
										nodNodLyeY: arrList[j].creditNodeNoLevel + 10,
										nodNodLye: arrList[j].creditNodeNoLevel,
										x: parseInt((150 * maxCount) / (obj01[arrList[j].creditNodeNoLevel] + 1) + arrList[j].creditNodeNoLevel),
										y: parseInt(arrList[j].creditNodeNoLevel + 10),
									}
									nodeList.push(creditListStr)
								}
							}
							var jsondata = {
									rootId: 'a',
									nodes: nodeList,
									links: linkList
								}
							// 以上数据中的node和link可以参考"Node节点"和"Link关系"中的参数进行配置
							this.$refs.seeksRelationGraph.setJsonData(jsondata, (seeksRGGraph) => {
								// 这些写上当图谱初始化完成后需要执行的代码
								console.log(seeksRGGraph)
							})
						}else{
							var jsondata = {
								rootId: 'a',
								nodes: [],
								links: []
							}
							// 以上数据中的node和link可以参考"Node节点"和"Link关系"中的参数进行配置
							this.$refs.seeksRelationGraph.setJsonData(jsondata, (seeksRGGraph) => {
								// 这些写上当图谱初始化完成后需要执行的代码
								console.log(seeksRGGraph)
							})
						}
					})
				})
			},
			showNodeTips(nodeObject) {
				const allNodes = this.$refs.seeksRelationGraph.getNodes();
				const linksArys = [];
				const fromList = [];
				linkList.filter(item => {
					if(item.to === nodeObject.id) {
						if(item.data.type != '共享') {
							linksArys.push(item);
							fromList.push(item);
						}
					}
				});
				for(var m = 0; m < fromList.length; m++) {
					for(var n = 0; n < linkList.length; n++) {
						if(linkList[n].to === fromList[m].from) {
							if(fromList[m].data.type === '占用') {
								if(linkList[n].data.type != '共享') {
									linksArys.push(linkList[n]);
									fromList.push(linkList[n]);
								}
							}
						}
					}
				}
				const linksAry = [];
				for(const k in linksArys) {
					if(linksAry.indexOf(linksArys[k].from) === -1) {
						linksAry.push(linksArys[k].from);
					}
				}
				const otherLinksAry = [];
				for(const j in allNodes) {
					if(linksAry.indexOf(allNodes[j].id) === -1) {
						otherLinksAry.push(allNodes[j]);
					}
				}
				for(const f in otherLinksAry) {
					otherLinksAry[f].color = 'rgb(25,107,158,0.3)';
				}
				this.currentNode = nodeObject;
			},
			hideNodeTips() {
				const allNodes = this.$refs.seeksRelationGraph.getNodes();
				this.isShowNodeTipsPanel = false;
				this.$nextTick(() => {
					for(const node in allNodes) {
						allNodes[node].borderColor = undefined;
						allNodes[node].borderWdith = undefined;
						allNodes[node].color = undefined;
						allNodes[node].backgroundColor = undefined;
					}
				});
			},
			//筛选
			doFilter() {
				var _all_Lines = this.$refs.seeksRelationGraph.getLines();
				_all_Lines.forEach(thisLine => {
					this.isHideThisLine = true;
					thisLine.relations.forEach(thisLink => {
						if(this.tieleName =='授信网'){
							if(this.rel_checkList_L.indexOf(thisLink.data['type']) === -1) {
								thisLink.isHide = true;
							} else {
								this.isHideThisLine = false;
								thisLink.isHide = false;
							}
						}else if(this.tieleName =='用信网'){
							if(this.rel_checkList_U.indexOf(thisLink.data['type']) === -1) {
								thisLink.isHide = true;
							}else {
								this.isHideThisLine = false;
								thisLink.isHide = false;
							}
						}
						
					})
				});
			},
			onNodeClick(nodeObject, $event) {
				console.log('onNodeClick:', nodeObject)
			},
			onLineClick(lineObject, $event) {
				console.log('onLineClick:', lineObject)
			},
		}
	}
</script>
<style lang="scss" scoped>
	.c-node-menu-item {
		line-height: 30px;
		padding-left: 10px;
		cursor: pointer;
		color: #444444;
	}
</style>
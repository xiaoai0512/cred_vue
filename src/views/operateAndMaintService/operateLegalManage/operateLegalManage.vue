<!-- 运营模式法人管理 -->
<template>
	<div class="allContent">
		<!-- 表单验证demo: -->
		<el-form ref="queryFormRef" :model="queryForm" :rules="queryFormRules">
			<el-form-item class="cl_td" label="运营模式" prop="operationMode">
				<el-select v-model="queryForm.operationMode" class="wd200">
					<el-option v-for="(item, index) in operationModeOptions" 
						:key="index" 
						:label="item.modeName" 
						:value="item.operationMode" />
				</el-select>
			</el-form-item>
			<el-form-item class="cl_td" label="法人" prop="corporationEntityNo">
				<el-select v-model="queryForm.corporationEntityNo" class="wd200">
					<el-option v-for="(item, index) in corporationEntityNoOptions" :key="index" :label="item.corporationEntityName" :value="item.corporationEntityNo" />
				</el-select>
			</el-form-item>
			<div class="cl_tr text_center">
				<el-button size="medium" icon="el-icon-search" v-if="selBtnFlag" type="primary" @click="handleSearch()">查询</el-button>
				<el-button size="medium" icon="el-icon-plus" v-if="addBtnFlag" type="primary" @click="handleAdd()">新增</el-button>
			</div>
		</el-form>
		<el-table v-loading="listLoading1" :data="tableList" class="mbtm20" fit highlight-current-row style="width: 100%;" border>
			<el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
			<el-table-column prop="operationMode" label="运营模式" align="center" />
			<el-table-column prop="corporationEntityNo" label="法人实体编号" align="center" />
			<el-table-column prop="" label="操作" align="center" width="250px">
				<template slot-scope="{row}">
					<el-button size="mini" icon="el-icon-info" type="primary" @click="handleDetail(row)" v-if="selBtnFlag">查询详情</el-button>
					<el-button size="mini" icon="el-icon-edit" type="primary" @click="handleUp(row)" v-if="updBtnFlag">修改</el-button>
				</template>
			</el-table-column>
		</el-table>
		<pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="getList" />
		<!--新增-->
		<el-dialog title="新增法人" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd" >
	           <el-form-item class="cl_td" label="运营模式" prop="operationMode"
	           	:rules="[ { required: true, message: '运营模式不能为空'}]">
					<el-select v-model="tempAdd.operationMode" class="wd200">
						<el-option v-for="(item, index) in operationModeOptions" 
							:key="index" 
							:label="item.modeName" 
							:value="item.operationMode" />
					</el-select>
				</el-form-item>
				<el-form-item class="cl_td" label="法人" prop="corporationEntityNo"
					:rules="[ { required: true, message: '法人不能为空'}]">
					<el-select v-model="tempAdd.corporationEntityNo" class="wd200">
						<el-option v-for="(item, index) in corporationEntityNoOptions" :key="index" :label="item.corporationEntityName" :value="item.corporationEntityNo" />
					</el-select>
				</el-form-item>
            </el-form>
	    	<div slot="footer" class="dialog-footer">
	    		<el-button type="primary" @click="subAddData()">确认</el-button>
	            <el-button type="primary" @click="closeAddBtn()">取消</el-button>
	        </div>
        </el-dialog>
		<!--详情-->
		<el-dialog title="用户详细信息" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail" :rules="rulesDetail" :model="tempDetail" >
	           <el-form-item class="cl_td" label="运营模式" prop="operationMode">
					<el-select v-model="tempDetail.operationMode" class="wd200">
						<el-option v-for="(item, index) in operationModeOptions" 
							:key="index" 
							:label="item.modeName" 
							:value="item.operationMode" />
					</el-select>
				</el-form-item>
				<el-form-item class="cl_td" label="法人" prop="corporationEntityNo">
					<el-select v-model="tempDetail.corporationEntityNo" class="wd200">
						<el-option v-for="(item, index) in corporationEntityNoOptions" 
							:key="index" 
							:label="item.corporationEntityName" 
							:value="item.corporationEntityNo" />
					</el-select>
				</el-form-item>
            </el-form>
	    	<div slot="footer" class="dialog-footer">
	            <el-button type="primary" @click="dialogFormVisibleDetail = false">取消</el-button>
	        </div>
        </el-dialog>
        <!--修改-->
        <el-dialog title="修改法人信息" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp" >
	           <el-form-item class="cl_td" label="运营模式" prop="operationMode"
	           	:rules="[ { required: true, message: '运营模式不能为空'}]">
					<el-select v-model="tempUp.operationMode" class="wd200">
						<el-option v-for="(item, index) in operationModeOptions" 
							:key="index" 
							:label="item.modeName" 
							:value="item.operationMode" />
					</el-select>
				</el-form-item>
				<el-form-item class="cl_td" label="法人" prop="corporationEntityNo"
					:rules="[ { required: true, message: '法人不能为空'}]">
					<el-select v-model="tempUp.corporationEntityNo" class="wd200">
						<el-option v-for="(item, index) in corporationEntityNoOptions" 
							:key="index" 
							:label="item.corporationEntityName" 
							:value="item.corporationEntityNo" />
					</el-select>
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
				addBtnFlag: false,
				selBtnFlag: false,
				updBtnFlag: false,
				eventList:"",
				logininfo: '',
				// 列表
				queryForm: {
					pageNum: 1,
					pageSize: 10,
				},
				listLoading1: false,
				queryFormRef: {},
				queryFormRules: {},
				tableList: [],
				tableTotal: 0,
				showList: false,
				//下拉
				operationModeOptions: [],//运营模式
				corporationEntityNoOptions: [], //法人
				//新增
				dialogFormVisibleAdd: false,
				dataFormAdd: {},
				rulesAdd: {},
				tempAdd: {},
				//修改
				dialogFormVisibleUp: false,
				dataFormUp: {},
				rulesUp: {},
				tempUp: {},
				//详情
				dialogFormVisibleDetail: false,
				dataFormDetail: {},
				rulesDetail: {},
				tempDetail: {},
			}
		},
		created() {
			this.getBtnAuth()
			this.getList()
		},
		mounted() {
			this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo')) //获取用户登录权限
			//运营模式
			this.getSelectDict("/beta/betaService/COS.IQ.02.0006").then(res => {
				this.operationModeOptions = res
			})
				//法人
			this.getSelectDict("/beta/betaService/COS.IQ.02.0037").then(res => {
				this.corporationEntityNoOptions = res
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
                            	this.eventList += item.eventNo+','
                            })
                            if (this.eventList.includes('COS.IQ.02.0130')) { // 查询
                                this.selBtnFlag = true
                            } else {
                                this.selBtnFlag = false
                            }
                            if (this.eventList.includes('COS.AD.02.0130')) { // 新增
                                this.addBtnFlag = true
                            } else {
                                this.addBtnFlag = false
                            }
                            if (this.eventList.includes('COS.UP.02.0120')) { // 修改
                                this.updBtnFlag = true
                            } else {
                                this.updBtnFlag = false
                            }
                        }
                    }
                })
            },
			//重置
			reset() {
				this.queryForm = {}
			},
			//搜索
			handleSearch() {
				if((this.queryForm.operationMode == "" && this.queryForm.operationMode == null && this.queryForm.operationMode == undefined) &&
					(this.queryForm.corporationEntityNo == "" || this.queryForm.corporationEntityNo == null || this.queryForm.corporationEntityNo == undefined)) {
					this.$message('请输入查询条件！');
					return;
				}

				this.getList()
			},
			// 列表
			getList() {
				this.listLoading1 = true
				let params = {
					authDataSynFlag: '1',
				}
				params = Object.assign(params, this.queryForm)
				this.getTableList('/beta/betaService/COS.IQ.02.0130', this.queryForm, (res) => {
					this.listLoading1 = false
					if(res.returnCode == '000000') {
						if(res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
							this.tableList = res.returnData.rows
							this.tableTotal = res.returnData.totalCount
						}else{
							this.tableList = []
							this.tableTotal = 0
						}
					}
				})
			},
			//新增显示的弹框
			handleAdd() {
	            this.tempAdd = {}
	           	this.dialogFormVisibleAdd= true
	            this.$nextTick(() => {
	                this.$refs['dataFormAdd'].clearValidate()
	            })
	       	}, 	
	       	closeAddBtn(){
	       		this.dialogFormVisibleAdd = false
        	 	this.$nextTick(() => {
                    this.$refs['dataFormAdd'].resetFields()
                    
                })
	       	},
			subAddData(){
				this.$refs['dataFormAdd'].validate((valid) => {
	                if (valid) {
	                	this.post('/beta/betaService/COS.AD.02.0130', this.tempAdd, (res) => {
							if (res.returnCode == '000000') {
								this.dialogFormVisibleAdd = false
								this.$notify({
								message: '新增成功',
								type: 'success',
								})
								this.getList()
							}
	                    })
	                }
            	})
			},
			//详情显示的弹框
			handleDetail(row) {
				this.tempDetail = {}
	            this.tempDetail = Object.assign({}, row)
	           	this.dialogFormVisibleDetail= true
	            this.$nextTick(() => {
	                this.$refs['dataFormDetail'].clearValidate()
	            })
	       	}, 
	       	//修改显示的弹框
	       	//详情显示的弹框
			handleUp(row) {
				 this.tempUp = {}
	            this.tempUp = Object.assign({}, row)
	           	this.dialogFormVisibleUp= true
	            this.$nextTick(() => {
	                this.$refs['dataFormUp'].clearValidate()
	            })
	       	},
	       	subUpData(){
	       		this.$refs['dataFormUp'].validate((valid) => {
	                if (valid) {
	                	this.post('/beta/betaService/COS.AD.02.0130', this.tempUp, (res) => {
							if (res.returnCode == '000000') {
								this.dialogFormVisibleUp = false
								this.$notify({
								message: '修改成功',
								type: 'success',
								})
								this.getList()
							}
	                    })
	                }
            	})
	       	},
		}
	}
</script>

<style>

</style>
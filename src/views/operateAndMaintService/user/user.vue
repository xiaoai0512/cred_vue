<!-- 用户管理 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="运营机构" prop="organNo">
                <el-select v-model="queryFormObj.organNo" class="wd200">
                    <el-option
                        v-for="(item, index ) in operationOrganOptions"
                        :key="index"
                        :label="item.organName"
                        :value="item.organNo"/>
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="登录名" prop="loginName">
                <el-input v-model="queryFormObj.loginName" class="wd200" type="text"/>
            </el-form-item>
             <el-form-item class="cl_td" label="姓名" prop="name">
                <el-input v-model="queryFormObj.name" class="wd200" type="text"/>
            </el-form-item>
            <el-form-item class="cl_td" label="用户状态" prop="status">
                <el-select v-model="queryFormObj.status" class="wd200">
                    <el-option
                        v-for="(item, index ) in statusOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                </el-select>
            </el-form-item><!-- v-show="selBtnFlag"  v-show="addBtnFlag"  -->
            <div class="cl_tr text_center"> 
                <el-button size="medium" icon="el-icon-search" type="primary" @click="getList()" v-show="selBtnFlag">查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate"  v-show="addBtnFlag">新增</el-button>
            </div>
        </el-form>
        <el-table v-loading = "listLoading1" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
            <el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
            <el-table-column prop="organization" label="运营机构" align="center" />
            <el-table-column prop="jobNumber" label="用户工号" align="center" />
            <el-table-column prop="loginName" label="登录名" align="center" />
            <el-table-column prop="name" label="姓名" align="center" />
            <el-table-column prop="statusDesc" label="状态" align="center" />
            <el-table-column prop="" label="操作" align="center" width="450px">
                <template slot-scope="{row}">
                	<el-button size="mini" icon="el-icon-info"   type="primary" @click="handleDetail(row)" v-show="selBtnFlag">详情</el-button><!--v-show="updBtnFlag"-->
                	<el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleUpdate(row)" v-show="updBtnFlag">修改</el-button><!--v-show="updBtnFlag"-->
                	<el-button size="mini" icon="el-icon-arrow-right"   type="primary" @click="handleEaitDate(row)" v-show="setBtnFlag">设置特别状况事件</el-button><!--v-show="setBtnFlag"-->
               		<el-button size="mini" icon="el-icon-refresh-right"   type="primary" @click="resetPassword(row)" v-show="resBtnFlag">重置密码</el-button><!--v-show="resBtnFlag"-->
             	</template> 
            </el-table-column>
        </el-table>
        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
        <!-- 新增 -->
        <el-dialog title="新增用户" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd" >
	            <el-form-item class="cl_td" label="运营机构" prop="organNo"
	            	:rules="[ { required: true, message: '运营机构 不能为空'}]">
	                <el-select v-model="tempAdd.organNo" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in operationOrganOptions"
	                        :key="index"
	                        :label="item.organName"
	                        :value="item.organNo"/>
	                </el-select>
	            </el-form-item>
                <el-form-item class="cl_td" label="姓名" prop="name"
                    :rules="[ { required: true, message: '姓名岗位编号 不能为空'}]">
                   <el-input v-model="tempAdd.name" class="wd200" type="text"/>
                </el-form-item>
                <el-form-item class="cl_td" label="身份证号码" prop="idNumber"
                    :rules="[ { required: true, message: '身份证号码不能为空'}]">
                   <el-input v-model="tempAdd.idNumber" class="wd200" type="text"/>
                </el-form-item>
                <el-form-item class="cl_td" label="登录名" prop="loginName"
                    :rules="[ { required: true, message: '登录名不能为空'}]">
                   <el-input v-model="tempAdd.loginName" class="wd200" type="text"/>
                </el-form-item>
                 <el-form-item class="cl_td" label="登录密码" prop="password"
                    :rules="[ { required: true, message: '登录密码不能为空'}]">
                   <el-input type="password" v-model="tempAdd.password" class="wd200" autocomplete="off"/>
                </el-form-item>
                <el-form-item class="cl_td" label="确认登录密码" prop="equalspassword"
                    :rules="[ { required: true, message: '确认登录密码不能为空'}]">
                   <el-input v-model="tempAdd.equalspassword" class="wd200" type="password" autocomplete="off"/>
                </el-form-item>
                <el-form-item class="cl_td" label="关联部门 " prop="departmentNo"
	            	:rules="[ { required: true, message: '关联部门不能为空'}]">
	                <el-select v-model="tempAdd.departmentNo" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in departmentOptions"
	                        :key="index"
	                        :label="item.departmentName"
                        	:value="item.departmentNo"/>
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="关联岗位" prop="post"
	            	:rules="[ { required: true, message: '关联岗位不能为空'}]">
	                <el-select v-model="tempAdd.post" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in postOptions"
	                        :key="index"
	                        :label="item.postName"
                        	:value="item.postNo"/>
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="语言版本" prop="userLanguage"
	            	:rules="[ { required: true, message: '语言版本不能为空'}]">
	                <el-select v-model="tempAdd.userLanguage" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in userLanguageOptions"
	                        :key="index"
	                        :label="item.detailDesc"
                        	:value="item.codes"/>
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="用户状态" prop="status"
	            	:rules="[ { required: true, message: '用户状态不能为空'}]">
	                <el-select v-model="tempAdd.status" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in statusOptions"
	                        :key="index"
	                        :label="item.detailDesc"
                        	:value="item.codes"/>
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="用户管理标识" prop="adminFlag"
	            	:rules="[ { required: true, message: '用户管理标识不能为空'}]">
	                <el-select v-model="tempAdd.adminFlag" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in adminFlagOptions"
	                        :key="index"
	                        :label="item.detailDesc"
                        	:value="item.codes"/>
	                </el-select>
	            </el-form-item>
            </el-form>
	    	<div slot="footer" class="dialog-footer">
	            <el-button type="primary" @click="addDateData()">确定</el-button>
	            <el-button type="primary" @click="dialogFormVisibleAdd = false">取消</el-button>
	        </div>
        </el-dialog>
        <!--修改-->
       	<el-dialog title="修改用户信息" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp" >
	           <el-form-item class="cl_td" label="运营机构" prop="organNo"
	            	:rules="[ { required: true, message: '运营机构 不能为空'}]">
	                <el-select v-model="tempUp.organNo" class="wd200" disabled readonly>
	                    <el-option
	                        v-for="(item, index ) in operationOrganOptions"
	                        :key="index"
	                        :label="item.organName"
	                        :value="item.organNo"/>
	                </el-select>
	            </el-form-item>
                <el-form-item class="cl_td" label="姓名" prop="name"
                    :rules="[ { required: true, message: '姓名岗位编号 不能为空'}]">
                   <el-input v-model="tempUp.name" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="登录名" prop="loginName"
                    :rules="[ { required: true, message: '登录名不能为空'}]" >
                   <el-input v-model="tempUp.loginName" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="关联部门 " prop="departmentNo"
	            	:rules="[ { required: true, message: '关联部门不能为空'}]">
	                <el-select v-model="tempUp.departmentNo" filterable  class="wd200" @change="getSelectValue">
	                    <el-option
	                        v-for="(item, index ) in departmentOptions"
	                        :key="index"
	                        :label="item.departmentName"
                        	:value="item.departmentNo"/>
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="关联岗位" prop="post"
	            	:rules="[ { required: true, message: '关联岗位不能为空'}]">
	                <el-select v-model="tempUp.post" filterable class="wd200"  @change="getSelectValue">
	                    <el-option
	                        v-for="(item, index ) in postOptions"
	                        :key="index"
	                        :label="item.postName"
                        	:value="item.postNo"/>
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="语言版本" prop="userLanguage"
	            	:rules="[ { required: true, message: '语言版本不能为空'}]">
	                <el-select v-model="tempUp.userLanguage" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in userLanguageOptions"
	                        :key="index"
	                        :label="item.detailDesc"
                        	:value="item.codes"/>
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="用户状态" prop="status"
	            	:rules="[ { required: true, message: '用户状态不能为空'}]">
	                <el-select v-model="tempUp.status" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in statusOptions"
	                        :key="index"
	                        :label="item.detailDesc"
                        	:value="item.codes"/>
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="用户管理标识" prop="adminFlag"
	            	:rules="[ { required: true, message: '用户管理标识不能为空'}]">
	                <el-select v-model="tempUp.adminFlag" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in adminFlagOptions"
	                        :key="index"
	                        :label="item.detailDesc"
                        	:value="item.codes"/>
	                </el-select>
	            </el-form-item>
            </el-form>
	    	<div slot="footer" class="dialog-footer">
	            <el-button type="primary" @click="upDateData()">确定</el-button>
	            <el-button type="primary" @click="dialogFormVisibleUp = false">取消</el-button>
	        </div>
        </el-dialog>
        <!--详情-->
        <el-dialog title="用户详细信息" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail" :rules="rulesDetail" :model="tempDetail" >
	           <el-form-item class="cl_td" label="运营机构" prop="organNo">
	                <el-select v-model="tempDetail.organNo" class="wd200" disabled readonly>
	                    <el-option
	                        v-for="(item, index ) in operationOrganOptions"
	                        :key="index"
	                        :label="item.organName"
	                        :value="item.organNo"/>
	                </el-select>
	            </el-form-item>
                <el-form-item class="cl_td" label="用户编号" prop="name">
                   <el-input v-model="tempDetail.name" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="工号" prop="loginName">
                   <el-input v-model="tempDetail.loginName" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="姓名" prop="loginName">
                   <el-input v-model="tempDetail.loginName" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="登录名" prop="loginName">
                   <el-input v-model="tempDetail.loginName" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="关联部门 " prop="departmentNo">
	                <el-select v-model="tempDetail.departmentNo" class="wd200" disabled readonly>
	                    <el-option
	                        v-for="(item, index ) in departmentOptions"
	                        :key="index"
	                        :label="item.departmentName"
                        	:value="item.departmentNo"/>
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="关联岗位" prop="post">
	                <el-select v-model="tempDetail.post" class="wd200" disabled readonly>
	                    <el-option
	                        v-for="(item, index ) in postOptions"
	                        :key="index"
	                        :label="item.postName"
                        	:value="item.postNo"/>
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="语言版本" prop="userLanguage">
	                <el-select v-model="tempDetail.userLanguage" class="wd200" disabled readonly>
	                    <el-option
	                        v-for="(item, index ) in userLanguageOptions"
	                        :key="index"
	                        :label="item.detailDesc"
                        	:value="item.codes"/>
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="用户状态" prop="status">
	                <el-select v-model="tempDetail.status" class="wd200" disabled readonly>
	                    <el-option
	                        v-for="(item, index ) in statusOptions"
	                        :key="index"
	                        :label="item.detailDesc"
                        	:value="item.codes"/>
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="用户管理标识" prop="adminFlag">
	                <el-select v-model="tempDetail.adminFlag" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in adminFlagOptions"
	                        :key="index"
	                        :label="item.detailDesc"
                        	:value="item.codes"/>
	                </el-select>
	            </el-form-item>
	        </el-form>
	    	<div slot="footer" class="dialog-footer">
	          	<el-button type="primary" @click="dialogFormVisibleDetail = false">取消</el-button>
	        </div>
        </el-dialog>
        <!--设置特别状况事件-->
        <el-dialog title="设置特别状况事件" :visible.sync="dialogFormVisibleEdit" width="80%">
			<div class="text_title">选择事件</div>
			<div style="margin-left: 10%;">
				<el-transfer 
					filterable
					:filter-method="filterMethod"
					:titles="['可选择事件', '已选择事件']"
					filter-placeholder="请输入事件编号"
					v-model="havedComponentValues"
					@change="handleChangeComponent"
					:data="edit_allComponentData">
				</el-transfer>
			</div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="eait_cancel">取消</el-button>
                <el-button type="primary" @click="editdateData()"> 确定</el-button>
            </div>
        </el-dialog>
	</div>
</template>

<script>
import Pagination from "@/components/Pagination";
export default {
  	name: 'tableList',
  	components: {
    	Pagination,
  	},
	data() {
      	const generateData = _ => {
	        const componentData = [] // 相当于data
	        const componentNoList = [] // 
	        const componentList = []
	        let paramsEdit = {
	        	queryFlag: 'all',
	        	spFlag: '1',
	        	queryType: 'E',
	        }
	        this.post('/beta/betaService/COS.IQ.02.0085', paramsEdit,(res) => {
	            res.returnData.rows.forEach((item, i) => {
	                componentList.push(item.eventNo+' '+item.eventDesc)
	                componentNoList.push(item.eventNo)
	            })
	            componentList.forEach((component, index) => {
	                componentData.push({
	                    label: component,
	                    // key: index,
	                    key: component.split(' ')[0],
	                    eventNo: componentNoList[index]
	                });
	            });
	        })
	        return componentData;  
	    };
      	return {
			// 权限
			btnAuthStr:'',
            selBtnFlag: false,
            addBtnFlag: false,
			updBtnFlag: false,
			resBtnFlag: false,
			setBtnFlag: false,
            logininfo: '',
            // 列表
            queryFormObj: {
                pageNum: 1,
                pageSize:10,
            },
            listLoading1: false,
            queryFormRef: {},
            queryFormRules: {},      
            tableList: [],
            tableTotal: 0,
            list_formatCode: '',
            // 下拉框
            operationModeOptions: [],
           	operationOrganOptions: [],//运营机构		
           	statusOptions: [],//用户状态
           	departmentOptions: [],//关联部门
           	postOptions: [],//关联岗位
           	userLanguageOptions: [],//语言版本
           	adminFlagOptions: [],//用户管理标识
           /*----新增----*/
            tempAdd: {}, // 新增
            dataFormAdd: {},
            dialogFormVisibleAdd: false,
            rulesAdd: {},
           	//修改
            dataFormUp:{},
            rulesUp: {},
            tempUp: {}, // 修改
			dialogFormVisibleUp: false,
            //查询
            tempDetail: {}, // 详情
            dialogFormVisibleDetail: false,
            dataFormDetail: {},
            rulesDetail: {},
            //特别状况设置
            dialogFormVisibleEdit: false,
            tempEdit: {},
			rulesEdit: {},
            filterMethod(query, item) {
		        return item.eventNo.indexOf(query) > -1;
		    },
            edit_allComponentData: generateData(),
            havedComponentValues: [], // 选中事件
        }
    },
    created() {
        this.getBtnAuth()
    },
    mounted() {
        this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))  //获取用户登录权限
        this.getList()
        // 运营模式 
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0006").then(res => {
            this.operationModeOptions = res
        })
        //运营机构
   		this.getSelectDict( "/beta/betaService/COS.IQ.02.0005").then(res => {
            this.operationOrganOptions = res
        })
   		//用户状态
   		this.getSelectDict( "dic_userState").then(res => {
            this.statusOptions = res
        })
   		//关联部门
   		this.getSelectDict( "/beta/betaService/COS.CS.01.0004").then(res => {
			this.departmentOptions = res
        })
   		//关联岗位
   		this.getSelectDict( "/beta/betaService/COS.CS.01.0007").then(res => {
			this.postOptions = res
        })
   		//语言版本
   		this.getSelectDict( "dic_userLanageType").then(res => {
            this.userLanguageOptions = res
        })
   		//用户管理标识 
   		this.getSelectDict( "dic_adminFlag").then(res => {
            this.adminFlagOptions = res
        })
   	},
    methods: {
        // 查询按钮权限
        getBtnAuth() {
			console.log(window.sessionStorage.getItem('menuNo'))
            let params= {
                menuNo : window.sessionStorage.getItem('menuNo')
            }
            this.getTableList('/beta/betaService/COS.CS.01.0030', params ,(res) => {
				console.log(res)
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.length > 0 ) {
                        res.returnData.forEach(item => {
                        	this.btnAuthStr += item.eventNo+','
						})
						console.log(this.btnAuthStr)
						if (this.btnAuthStr.includes('COS.CS.01.0019')) { // 重置密码
                            this.resBtnFlag = true
                        } else {
                            this.resBtnFlag = false
                        }
                        if (this.btnAuthStr.includes('COS.CS.01.0010')) { // 查询
                            this.selBtnFlag = true
                        } else {
                            this.selBtnFlag = false
                        }
                        if (this.btnAuthStr.includes('COS.CS.01.0011')) { // 新增
                            this.addBtnFlag = true
                        } else {
                            this.addBtnFlag = false
                        }
                        if (this.btnAuthStr.includes('COS.CS.01.0012')) { // 修改  
                            this.updBtnFlag = true
                        } else {
                            this.updBtnFlag = false
						}
						if (this.btnAuthStr.includes('COS.AD.02.0101')) { // 设置特别状况事件 
                            this.setBtnFlag = true
                        } else {
                            this.setBtnFlag = false
                        }
                    }
                }
            })
        },
        // 列表
        getList() {
            this.listLoading1 = true
			this.tableList = []
			this.tableTotal = 0
            let params = {
            	authDataSynFlag: '1',
               	isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_userState'],//查找数据字典所需参数
				transDict : ['status'],//翻译前后key
            }
            params = Object.assign(this.queryFormObj, params)   //合并
            this.getTableList('/beta/betaService/COS.CS.01.0010', params,(res) => {
                if (res.returnCode == '000000') {
					this.tableList = res.returnData.rows
					this.tableTotal = res.returnData.totalCount
					this.listLoading1 = false
                }
            })
        },
        //显示新增弹框
        handleCreate() {
            this.dialogFormVisibleAdd = true
			this.tempAdd = {}
            this.$nextTick(() => {
                this.$refs['dataFormAdd'].clearValidate()
            })
        }, 
        //关闭新增弹框清空数据
        closeAddBtn(){
        	 this.dialogFormVisibleAdd = false
        	 this.$nextTick(() => {
                this.$refs['dataFormAdd'].resetFields()
                
            })
        },
		//新增确认
        addDateData(){
        	let paramsAdd ={
        		adminFlag: this.tempAdd.adminFlag,
        		flag: '1',
        		name: this.tempAdd.name,
        		organization: this.tempAdd.organNo,
        		idNumber: this.tempAdd.idNumber,
        		department: this.tempAdd.departmentNo,
        		loginName: this.tempAdd.loginName,
        		password: this.tempAdd.password,
				post: this.tempAdd.post,
				userLanguage: this.tempAdd.userLanguage,
				status: this.tempAdd.status,
			}
        	this.$refs['dataFormAdd'].validate((valid) => {
                if (valid) {
                	this.post('/beta/betaService/COS.CS.01.0011', paramsAdd, (res) => {
						if (res.returnCode == '000000') {
							this.dialogFormVisibleAdd = false
							this.$notify({
							message: '新增成功',
							type: 'success',
							})
							this.getList()
							this.tempAdd = {}
						}
                    })
                }
            })
        },
        //显示修改弹框
        handleUpdate(row) {
			this.tempUp = {}
            this.tempUp = Object.assign({}, row)
            this.tempUp.organNo = row.organization
         	this.tempUp.post = row.post
          	this.tempUp.departmentNo = row.department
            this.dialogFormVisibleUp = true
            this.$nextTick(() => {
                this.$refs['dataFormUp'].clearValidate()
			})
        }, 
        getSelectValue(){
			 this.$forceUpdate()
		},
        //确认修改数据
        upDateData() {
        	let paramsUp ={
        		flag: '1',
        		organization: this.tempUp.organNo,
        		department: this.tempUp.departmentNo,
        		post: this.tempUp.post,
			}
        	paramsUp = Object.assign ( paramsUp, this.tempUp ) 
        	delete paramsUp.departmentNo;
        	delete paramsUp.organNo;
        	this.$refs['dataFormUp'].validate((valid) => {
                if (valid) {
                    this.post('/beta/betaService/COS.CS.01.0012', paramsUp, (res) => {
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
       	//详情
       	handleDetail(row){
			this.tempDetail = {}
       		this.tempDetail = Object.assign({}, row)
            this.tempDetail.organNo = row.organization
         	this.tempDetail.post = row.post
          	this.tempDetail.departmentNo = row.department
            this.dialogFormVisibleDetail = true
            this.$nextTick(() => {
                this.$refs['dataFormDetail'].clearValidate()
            })
       	},
       	//特别状况设置
       	handleEaitDate(row) {
			this.tempEdit.userNo = row.userNo
			this.havedComponentValues = []
	        // 查询已有事件
	        this.post('/beta/betaService/COS.IQ.02.0185', {userNo: row.userNo}, (res) => {
	            if( res.returnData && res.returnData.rows) {
	                res.returnData.rows.forEach((item , k) => {
	                    this.havedComponentValues.push(item.eventNo)
	                })
	                this.dialogFormVisibleEdit = true
	            } else {
	                this.havedComponentValues = []
	                this.tempEdit.coreUserSpeventList  = []
	                this.dialogFormVisibleEdit = true
	            }
		    })
	    }, 
	    eait_cancel() {
	        this.dialogFormVisibleEdit = false
	        this.havedComponentValues = []
	    },	
       	handleChangeComponent(value, direction, movedKeys) {
			this.havedComponentValues = value;
	    },
	    //提交
	    editdateData() {
			this.tempEdit.coreUserSpeventList = [];
			this.havedComponentValues.forEach((item , k) => {
				this.tempEdit.coreUserSpeventList.push({"eventNo":item})
			})
			this.post('/beta/betaService/COS.AD.02.0101', this.tempEdit, (res) => {
				if (res.returnCode == '000000') {
					this.dialogFormVisibleEdit= false
						this.$notify({
						message: '修改成功',
						type: 'success',
					})
					this.getList()
				}
			})
	    },
	   //重置密码
		resetPassword (row){
		  	let resetInfo = row
			this.post('/beta/betaService/COS.CS.01.0019', resetInfo, (res) => {
				if (res.returnMsg == 'OK') {
					this.$message('重置密码成功')
					this.getList()
				}
			})
		},
	}
}
</script>

<style>
	/* 穿梭框样式 */
    .el-transfer-panel {
        width: 37%;
    }
</style>

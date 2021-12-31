<!-- 岗位管理 -->
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
            <el-form-item class="cl_td" label="岗位名称" prop="postName">
                <el-input v-model="queryFormObj.postName" class="wd200" type="text"/>
            </el-form-item>
            <el-form-item class="cl_td" label="岗位状态" prop="postStatus">
                <el-select v-model="queryFormObj.postStatus" class="wd200">
                    <el-option
                        v-for="(item, index ) in postStatusOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                </el-select>
            </el-form-item>
            <div class="cl_tr text_center"> 
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" v-show="selBtnFlag">查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate" v-show="addBtnFlag">新增</el-button>
            </div>
        </el-form>
        <el-table v-loading = "listLoading1" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
            <el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
            <el-table-column prop="operationOrgan" label="运营机构" align="center" />
            <el-table-column prop="postName" label="岗位名称" align="center" />
            <el-table-column prop="postStatusDesc" label="岗位状态" align="center" />
            <el-table-column prop="" label="操作" align="center" width="200px">
                <template slot-scope="{row}"><!---->
                	<el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleUpdate(row)" v-show="updBtnFlag">修改</el-button><!--v-show="updBtnFlag"-->
             	</template> 
            </el-table-column>
        </el-table>
        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
        <!-- 新增 -->
        <el-dialog title="卡号池请求建立" :visible.sync="dialogFormVisibleAdd" width="65%">
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
                <el-form-item class="cl_td" label="岗位编号 " prop="postNo"
                    :rules="[ { required: true, message: '岗位编号 不能为空'}]">
                   <el-input v-model="tempAdd.postNo" class="wd200" type="text"/>
                </el-form-item>
                <el-form-item class="cl_td" label="岗位名称" prop="postName"
                    :rules="[ { required: true, message: '岗位名称不能为空'}]">
                   <el-input v-model="tempAdd.postName" class="wd200" type="text"/>
                </el-form-item>
                <el-form-item class="cl_td" label="岗位描述" prop="postDesc"
                    :rules="[ { required: true, message: '岗位描述不能为空'}]">
                   <el-input v-model="tempAdd.postDesc" class="wd200" type="text"/>
                </el-form-item>
                <el-form-item class="cl_td" label="岗位类别" prop="postType"
	            	:rules="[ { required: true, message: '岗位类别不能为空'}]">
	                <el-select v-model="tempAdd.postType" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in postTypeOptions"
	                        :key="index"
	                        :label="item.detailDesc"
                        	:value="item.codes"/>
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="岗位状态" prop="postStatus"
	            	:rules="[ { required: true, message: '岗位状态 不能为空'}]">
	                <el-select v-model="tempAdd.postStatus" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in postStatusOptions"
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
       	<el-dialog title="修改岗位信息" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp" >
	            <el-form-item class="cl_td" label="运营机构" prop="operationOrgan"
	            	:rules="[ { required: true, message: '运营机构 不能为空'}]">
	                <el-select v-model="tempUp.operationOrgan" class="wd200" disabled readonly>
	                    <el-option
	                        v-for="(item, index ) in operationOrganOptions"
	                        :key="index"
	                        :label="item.organName"
	                        :value="item.organNo"/>
	                </el-select>
	            </el-form-item>
                <el-form-item class="cl_td" label="岗位编号 " prop="postNo"
                    :rules="[ { required: true, message: '岗位编号 不能为空'}]">
                   <el-input v-model="tempUp.postNo" class="wd200" type="text"/>
                </el-form-item>
                <el-form-item class="cl_td" label="岗位名称" prop="postName"
                    :rules="[ { required: true, message: '岗位名称不能为空'}]">
                   <el-input v-model="tempUp.postName" class="wd200" type="text"/>
                </el-form-item>
                <el-form-item class="cl_td" label="岗位描述" prop="postDesc"
                    :rules="[ { required: true, message: '岗位描述不能为空'}]">
                   <el-input v-model="tempUp.postDesc" class="wd200" type="text"/>
                </el-form-item>
                <el-form-item class="cl_td" label="岗位类别" prop="postType"
	            	:rules="[ { required: true, message: '岗位类别不能为空'}]">
	                <el-select v-model="tempUp.postType" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in postTypeOptions"
	                        :key="index"
	                        :label="item.detailDesc"
                        	:value="item.codes"/>
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td" label="岗位状态" prop="postStatus"
	            	:rules="[ { required: true, message: '岗位状态 不能为空'}]">
	                <el-select v-model="tempUp.postStatus" class="wd200">
	                    <el-option
	                        v-for="(item, index ) in postStatusOptions"
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
            originListOptions:[],// 运营模式 
           	operationOrganOptions: [],//运营机构		
           	postStatusOptions: [],//岗位名称启用标识
           	postTypeOptions: [],//岗位类别
            /*----新增----*/
            tempAdd: {}, // 新增
            newLegal: '',
            dialogFormVisibleAdd: false,
            rulesAdd: {},
            rulesUp: {},
            newCapitalOrganizationCode: '',
            newPlanType: '',
            pickerOptions: {
	          	disabledDate(time) {
		            return time.getTime() < Date.now();
	          	},
         	},
            //修改
            dataFormUp:{},
            tempUp: {}, // 修改
            up_segmentNumber: '',
            dialogFormVisibleUp: false,
            //查询
            tempDetail: {}, // 详情
            dialogFormVisibleDetail: false,
            dataFormDetail: {},
            rulesDetail: {},
            detail_segmentNumber: '',
        }
        },
        created() {
            this.getBtnAuth()
        },
        mounted() {
            this.logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))  //获取用户登录权限
//          /console.log(this.logininfo)
            this.getList()
            // 运营模式 
            this.getSelectDict( "/beta/betaService/COS.IQ.02.0006").then(res => {
                this.operationModeOptions = res
            })
            //运营机构
       		this.getSelectDict( "/beta/betaService/COS.IQ.02.0005").then(res => {
                this.operationOrganOptions = res
            })
       		//岗位名称启用标识
       		this.getSelectDict( "dic_jobStatus").then(res => {
                this.postStatusOptions = res
            })
       		//岗位类别
       		this.getSelectDict( "dic_jobType").then(res => {
                this.postTypeOptions = res
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
                            if (this.btnAuthStr.includes('COS.CS.01.0007')) { // 查询
                                this.selBtnFlag = true
                            } else {
                                this.selBtnFlag = false
                            }
                            if (this.btnAuthStr.includes('COS.CS.01.0008')) { // 新增
                                this.addBtnFlag = true
                            } else {
                                this.addBtnFlag = false
                            }
                            if (this.btnAuthStr.includes('COS.CS.01.0009')) { // 修改
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
                let params = {
                    isTrans: true,//是否需要翻译数据字典
					transParams : ['dic_jobStatus'],//查找数据字典所需参数
					transDict : ['postStatus'],//翻译前后key
                }
                params = Object.assign(this.queryFormObj, params)   //合并
                this.getTableList('/beta/betaService/COS.CS.01.0007', params,(res) => {
                    if (res.returnCode == '000000') {
                        this.listLoading1 = false
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
            handleSearch() {
                this.getList()
            },
            //显示新增弹框
            handleCreate() {
                this.dialogFormVisibleAdd = true
                this.tempAdd={}
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
            	this.tempAdd.operationOrgan = this.tempAdd.operationOrgan
            	this.$refs['dataFormAdd'].validate((valid) => {
                    if (valid) {
                    	this.post('/beta/betaService/COS.CS.01.0008', this.tempAdd, (res) => {
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
                this.dialogFormVisibleUp = true
                this.tempUp.capitalOrganizationCode = row.capitalOrganizationCode
                this.$nextTick(() => {
                    this.$refs['dataFormUp'].clearValidate()
                })
            }, 
            
            //确认修改数据
            upDateData() {
            	this.$refs['dataFormUp'].validate((valid) => {
                    if (valid) {
                        this.post('/beta/betaService/COS.CS.01.0009', this.tempUp, (res) => {
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

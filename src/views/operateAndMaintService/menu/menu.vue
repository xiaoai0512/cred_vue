<!-- 菜单管理 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
        	<el-form-item class="cl_td" label="菜单名称" prop="menuName">
                <el-input v-model="queryFormObj.menuName" class="wd200" type="text"/>
            </el-form-item>
            <el-form-item class="cl_td" label="所属级别" prop="menuLevel">
                <el-select v-model="queryFormObj.menuLevel" class="wd200">
                    <el-option
                        v-for="(item, index ) in menuLevelOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="菜单状态" prop="displayFlag">
                <el-select v-model="queryFormObj.displayFlag" class="wd200">
                    <el-option
                        v-for="(item, index ) in displayFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                </el-select>
            </el-form-item>
            <div class="cl_tr text_center"> 
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" >查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate" >新增</el-button>
            </div>
        </el-form>
        <el-table v-loading = "listLoading1" :data="tableList" class="mbtm20" fit highlight-current-row  style="width: 100%;" border>
            <el-table-column type="index" width="50" align="center" label="序号"></el-table-column>
            <el-table-column prop="menuName" label="菜单名称" align="center" />
            <el-table-column prop="menuLevelDesc" label="所属级别" align="center" />
            <el-table-column prop="link" label="菜单URL" align="center" />
             <el-table-column prop="displayFlagDesc" label="菜单状态" align="center" />
            <el-table-column prop="" label="操作" align="center" width="250px">
                <template slot-scope="{row}">
                	<el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleUpdate(row)" >修改</el-button><!--v-show="updBtnFlag"-->
             		<el-button size="mini" icon="el-icon-arrow-right"   type="primary" @click="handleEventdate(row)" >事件配置</el-button>
                </template> 
            </el-table-column>
        </el-table>
        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
        <!-- 新增 -->
        <el-dialog title="新增菜单" :visible.sync="dialogFormVisibleAdd" width="75%">
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd" >
	           	<el-form-item class="cl_td w80" label="菜单名称 " prop="menuName">
                   <el-input v-model="tempAdd.menuName" class="w60 " type="text"/>
                </el-form-item>
                <el-form-item class="cl_td w80" label="所属级别" prop="menuLevel">
	                <el-select v-model="tempAdd.menuLevel" class="w60 " @change="menuLevelChange($event)">
	                    <el-option
	                        v-for="(item, index ) in menuLevelOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                </el-select>
            	</el-form-item>
            	 <el-form-item class="cl_td w80" label="父级菜单" prop="upperMenuNo" v-if="(tempAdd.menuLevel =='2') || (tempAdd.menuLevel =='3')">
	                <el-select v-model="tempAdd.upperMenuNo" class="w60 ">
	                    <el-option
	                        v-for="(item, index ) in upperMenuNoOptions"
	                        :key="index"
	                        :label="item.label"
                        	:value="item.value"/>
	                </el-select>
	            </el-form-item>
				<el-form-item class="cl_td w80" label="菜单URL" prop="link">
                   <el-input v-model="tempAdd.link" class="w60 " type="text"/>
                </el-form-item>
                <el-form-item class="cl_td w80" label="是否有下级菜单标识" prop="lowerMenuFlag">
	                <el-select v-model="tempAdd.lowerMenuFlag" class="w60 ">
	                    <el-option
	                        v-for="(item, index ) in lowerMenuFlagOptions"
	                        :key="index"
	                        :label="item.detailDesc"
                        	:value="item.codes"/>
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td w80" label="菜单描述" prop="menuDesc" v-if="tempAdd.menuLevel =='1'">
                   <el-input v-model="tempAdd.menuDesc" class="w60 " type="text"/>
                </el-form-item>

	            <el-form-item class="cl_td w80" label="菜单状态" prop="displayFlag">
	                <el-select v-model="tempAdd.displayFlag" class="w60">
	                    <el-option
	                        v-for="(item, index ) in displayFlagOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                </el-select>
            	</el-form-item>
            	<div v-if="tempAdd.menuLevel == '1'">
	            	<el-form-item class="cl_td w80" label="页面排序层级" prop="baseFlag">
		                <el-select v-model="tempAdd.baseFlag" class="w60">
		                    <el-option
		                        v-for="(item, index ) in baseFlagOptions"
		                        :key="index"
		                        :label="item.detailDesc"
		                        :value="item.codes"/>
		                </el-select>
	            	</el-form-item>
	            	<el-form-item class="cl_td w80" label="图标icon" prop="icon">
		                <el-select v-model="tempAdd.icon" class="w60">
		                    <el-option
		                        v-for="(item, index ) in iconOptions"
		                        :key="index"
		                        :label="item.detailDesc"
		                        :value="item.codes"/>
		                </el-select>
	            	</el-form-item>
	        		<el-form-item class="cl_td w80" label="排序  " prop="sort">
	                   <el-input v-model="tempAdd.sort" class="w60 " type="text"/>
	                </el-form-item>
                </div>
				<el-form-item class="cl_td w80" label="图标icon" prop="icon" v-if="tempAdd.menuLevel =='2'">
		            <el-input v-model="tempAdd.icon" class="w60 " type="text"/>
	            </el-form-item>
            </el-form>
	    	<div slot="footer" class="dialog-footer">
	            <el-button type="primary" @click="addDateData()">确定</el-button>
	            <el-button type="primary" @click="dialogFormVisibleAdd = false">取消</el-button>
	        </div>
        </el-dialog>
        <!--修改-->
       	<el-dialog title="修改菜单信息" :visible.sync="dialogFormVisibleUp" width="75%">
            <el-form ref="dataFormEdit" :rules="rulesEdit" :model="tempEdit" >
	            	<el-form-item class="cl_td w80" label="菜单名称 " prop="menuName">
                   <el-input v-model="tempEdit.menuName" class="w60 " type="text"/>
                </el-form-item>
                <el-form-item class="cl_td w80" label="所属级别" prop="menuLevel">
	                <el-select v-model="tempEdit.menuLevel" class="w60 " @change="upMenuLevelChange($event)">
	                    <el-option
	                        v-for="(item, index ) in menuLevelOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                </el-select>
            	</el-form-item>
            	 <el-form-item class="cl_td w80" label="父级菜单" prop="upperMenuNo" v-if="(tempEdit.menuLevel =='2') || (tempEdit.menuLevel =='3')">
	                <el-select v-model="tempEdit.upperMenuNo" class="w60 ">
	                    <el-option
	                        v-for="(item, index ) in upperMenuNoOptions"
	                        :key="index"
	                        :label="item.label"
                        	:value="item.value"/>
	                </el-select>
	            </el-form-item>
				<el-form-item class="cl_td w80" label="菜单URL" prop="link">
                   <el-input v-model="tempEdit.link" class="w60 " type="text"/>
                </el-form-item>
                <el-form-item class="cl_td w80" label="是否有下级菜单标识" prop="lowerMenuFlag">
	                <el-select v-model="tempEdit.lowerMenuFlag" class="w60 ">
	                    <el-option
	                        v-for="(item, index ) in lowerMenuFlagOptions"
	                        :key="index"
	                        :label="item.detailDesc"
                        	:value="item.codes"/>
	                </el-select>
	            </el-form-item>
	            <el-form-item class="cl_td w80" label="菜单描述" prop="menuDesc" v-if="tempEdit.menuLevel =='1'">
                   <el-input v-model="tempEdit.menuDesc" class="w60 " type="text"/>
                </el-form-item>

	            <el-form-item class="cl_td w80" label="菜单状态" prop="displayFlag">
	                <el-select v-model="tempEdit.displayFlag" class="w60">
	                    <el-option
	                        v-for="(item, index ) in displayFlagOptions"
	                        :key="index"
	                        :label="item.detailDesc"
	                        :value="item.codes"/>
	                </el-select>
            	</el-form-item>
            	<div v-if="tempEdit.menuLevel == '1'">
	            	<el-form-item class="cl_td w80" label="页面排序层级" prop="baseFlag">
		                <el-select v-model="tempEdit.baseFlag" class="w60">
		                    <el-option
		                        v-for="(item, index ) in baseFlagOptions"
		                        :key="index"
		                        :label="item.detailDesc"
		                        :value="item.codes"/>
		                </el-select>
	            	</el-form-item>
	        		<el-form-item class="cl_td w80" label="排序  " prop="sort">
	                   <el-input v-model="tempEdit.sort" class="w60 " type="text"/>
	                </el-form-item>
                </div>
                <el-form-item v-if="tempEdit.menuLevel != 3" class="cl_td w80" label="图标icon" prop="icon">
                    <el-select v-model="tempEdit.icon" class="w60">
                        <el-option
                            v-for="(item, index ) in iconOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"/>
                    </el-select>
                </el-form-item>
				<el-form-item class="cl_td w80" label="图标icon" prop="icon" v-if="tempAdd.menuLevel =='2'">
		            <el-input v-model="tempEdit.icon" class="w60 " type="text"/>
	            </el-form-item>
            </el-form>
	    	<div slot="footer" class="dialog-footer">
	            <el-button type="primary" @click="updateData()">确定</el-button>
	            <el-button type="primary" @click="dialogFormVisibleUp = false">取消</el-button>
	        </div>
        </el-dialog>
        <!--事件配置-->
        <el-dialog title="配置事件信息" :visible.sync="dialogFormVisibleEvUp" width="75%">
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp" >
               <div class="text_title">选择关联事件</div>
                <el-form-item class="cl_td" label="事件编号" prop="elementNo">
                    <el-input v-model="tempUp.elementNo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="事件描述" prop="elementDesc">
                    <el-input v-model="tempUp.elementDesc" class="wd200" type="text" />
                </el-form-item>
                <div class="cl_tr text_center">
                    <el-button size="medium" icon="el-icon-search" type="primary" @click="tempUpSearch()">搜索</el-button>
                    <el-button size="medium" icon="el-icon-refresh" type="primary" @click="tempUprelatedHandle()">关联</el-button>
                </div>
                <el-table :data="elementList_up"  class="mbtm20" fit highlight-current-row  style="width: 100%;"  @selection-change="up_elementSelectChange" border>
	                <el-table-column type="selection" width="55"></el-table-column>
	                <el-table-column prop="eventNo" label="事件编号" align="center" />
	                <el-table-column prop="eventDesc" label="事件描述" align="center" />
	            </el-table>
                <pagination v-show="elementTotal_up>0" :total="elementTotal_up" :page.sync="tempUp.pageNum" :limit.sync="tempUp.pageSize" @pagination="getElementList_up(tempUp)" />

              	<div class="text_title">已关联事件</div>
                <el-table :data="relatedElementList_up" class="mbtm20" fit highlight-current-row style="width: 100%;" border>
                    <el-table-column type="index" label="序号" align="center" />
                    <el-table-column prop="eventNo" label="事件编号" align="center" />
                    <el-table-column prop="eventDesc" label="事件描述" align="center" />
                    <el-table-column prop="" label="操作" align="center" > 
                    	 <el-button size="medium" icon="el-icon-delete-solid" type="primary" @click="delData()">删除</el-button>
                    </el-table-column>
				</el-table>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleEvUp = false">取消</el-button>
                <el-button type="primary" @click="updateEvData()">确定 </el-button>
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
	           	menuLevelOptions: [],//所属级别
	           	upperMenuNoOptions: [],//父级菜单
	           	displayFlagOptions: [],//菜单状态
	           	lowerMenuFlagOptions: [],//是否有下级菜单标识
	           	iconOptions: [],//图片icon
	           	baseFlagOptions: [],//页面排序层级
	            /*----新增----*/
	            tempAdd: {}, // 新增
                dataFormAdd:{},
	            newLegal: '',
	            dialogFormVisibleAdd: false,
	            rulesAdd: {},
	            rulesUp: {},
	            fatherinfut:false,
				menuDescShow: false,
	            //修改
	            dataFormEdit:{},
	            tempEdit: {}, // 修改
				rulesEdit: {},
	            dialogFormVisibleUp: false,
				
	            //查询
	            tempDetail: {}, // 详情
	            dialogFormVisibleDetail: false,
	            dataFormDetail: {},
	            rulesDetail: {},
	            detail_segmentNumber: '',
	            //事件配置
	            dataFormUp:{},
	            tempUp: {
	            	pageNum: 1, 
	        		pageSize: 10, 
	            },
				rulesUp: {},
	            dialogFormVisibleEvUp: false,
	            tempUpElementSearchForm: {}, // 搜索条件
		      	elementTotal_up : 0 ,
		      	elementList_up: [] , // 选择元件
		      	relatedElementContainer: [] , // 选择的元件容器
		      	relatedElementList_up: [] , // 已关联元件

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
       		//所属级别
       		this.getSelectDict( "dic_subordinateLevel").then(res => {
                this.menuLevelOptions = res
            })
       		//菜单状态
       		this.getSelectDict( "dic_menuStatus").then(res => {
                this.displayFlagOptions = res
            })
       		//是否有下级菜单标识
       		this.getSelectDict( "dic_ZorO").then(res => {
                this.lowerMenuFlagOptions = res
            })
       		//图片icon
       		this.getSelectDict( "dic_Icon").then(res => {
                this.iconOptions = res
            })
       		//页面排序层级
       		this.getSelectDict( "dic_basicParameters").then(res => {
                this.baseFlagOptions = res
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
                            if (this.eventList.includes('COS.CS.01.0007')) { // 查询
                                this.selBtnFlag = true
                            } else {
                                this.selBtnFlag = false
                            }
                            if (this.eventList.includes('COS.CS.01.0008')) { // 新增
                                this.addBtnFlag = true
                            } else {
                                this.addBtnFlag = false
                            }
                            if (this.eventList.includes('COS.CS.01.0009')) { // 修改
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
				this.tableList = []
				this.tableTotal = 0
                let params = {
                    isTrans: true,//是否需要翻译数据字典
					transParams : ['dic_subordinateLevel','dic_menuStatus'],//查找数据字典所需参数
					transDict : ['menuLevel','displayFlag'],//翻译前后key
                }
                params = Object.assign(this.queryFormObj, params)   //合并
                this.getTableList('/beta/betaService/COS.CS.01.0002', params,(res) => {
					if (res.returnCode == '000000') {
						this.listLoading1 = false
						this.tableList = res.returnData.rows
						this.tableTotal = res.returnData.totalCount
                    }
                })
            },
            handleSearch() {
                this.getList()
            },
            //显示新增弹框
            handleCreate() {
				this.tempAdd = {}
                this.dialogFormVisibleAdd = true
                this.$nextTick(() => {
                    this.$refs['dataFormAdd'].clearValidate()
                })
            }, 
            menuLevelChange(row){
            	this.getSelect(row)
            },
            getSelect(row){
            	if(row !='1'){
            		let LevelData = {
            			nowLevel: row
            		}
	            	this.post('/beta/betaService/COS.CS.01.0015',LevelData, (res) => {
	                     if (res.returnCode == '000000') {
		                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
		                        let arr = []
		                        let rows = res.returnData.rows
		                        rows.forEach((item, index) => {
		                           	arr[index] = {
		                                label: item.menuName,
		                                value: item.menuNo
		                            }
		                        })
		                        this.upperMenuNoOptions = arr
		                    } else {
		                        this.upperMenuNoOptions = []
		                    }
		                }
	               	})
            	}
			},
            //关闭新增弹框清空数据
            closeAddBtn(){
            	 this.dialogFormVisibleAdd = false
            	 this.$nextTick(() => {
                    this.$refs['dataFormAdd'].clearValidate()
                })
            },
			//新增确认
            addDateData(){
            	this.post('/beta/betaService/COS.CS.01.0001', this.tempAdd, (res) => {
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
            },
            //显示修改弹框
            handleUpdate(row) {
				this.tempEdit = {}
                this.tempEdit = Object.assign({}, row)
               	this.dialogFormVisibleUp = true
                this.tempEdit.capitalOrganizationCode = row.capitalOrganizationCode
                this.$nextTick(() => {
                    this.$refs['dataFormEdit'].clearValidate()
                })
            }, 
            upMenuLevelChange(row){
            	this.up_getSelect(row)
            },
            up_getSelect(row){
            	if(row !='1'){
            		let LevelData = {
            			nowLevel: row
            		}
	            	this.post('/beta/betaService/COS.CS.01.0015',LevelData, (res) => {
	                     if (res.returnCode == '000000') {
		                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
		                        let arr = []
		                        let rows = res.returnData.rows
		                        rows.forEach((item, index) => {
		                           	arr[index] = {
		                                label: item.menuName,
		                                value: item.menuNo
		                            }
		                        })
		                        this.upperMenuNoOptions = arr
		                    } else {
		                        this.upperMenuNoOptions = []
		                    }
		                }
	               	})
            	}
			},
            //确认修改数据
            updateData() {
            	this.post('/beta/betaService/COS.CS.01.0003', this.tempEdit, (res) => {
                    if (res.returnCode == '000000') {
						  this.dialogFormVisibleUp = false
						this.$notify({
						message: '修改成功',
						type: 'success',
						})
						this.getList()
                    }
                })
         	},
	         // 配置事件
	    handleEventdate(row) {
	    	this.dialogFormVisibleEvUp = true
            this.$nextTick(() => {
                this.$refs['dataFormUp'].clearValidate()
            })
	        this.tempUp = Object.assign(this.tempUp, row)
	        let obj1 = {
	            pageNum: this.tempUp.pageNum, 
	            pageSize: this.tempUp.pageSize, 
	            menuNo: this.tempUp.menuNo
	        }
	        let obj2 = {
	            pageNum: 1, 
	            pageSize: this.tempUp.pageSize, 
	            menuNo: this.tempUp.menuNo
	        }
	        this.getElementList_up(obj1)
	        this.getRelatedElementList_up(obj2)
	    }, 
	    // 搜索
	    tempUpSearch() {
	        this.tempUpElementSearchForm = {
	        	eventId: this.tempUp.elementNo,
	        	eventDesc: this.tempUp.elementDesc,
	        	pageNum: 1, 
	            pageSize: this.tempUp.pageSize, 
	        }
	        this.getElementList_up(this.tempUpElementSearchForm)
	    },
	    // 关联
	    tempUprelatedHandle() {
	
	        this.relatedElementList_up
	        this.relatedElementContainer
	
	
	        let isTip = false;//是否提示
	        let tipStr = "";
	        if (this.relatedElementContainer.length == 0) {
	            this.$message({
	                message: '请选择关联事件',
	                type: 'warning'
	            });
	        }
	        let items = this.relatedElementContainer;
	        for (var i = 0; i < items.length; i++) {
	            var isExist = false;						//是否存在
	            for (var k = 0; k < this.relatedElementList_up.length; k++) {
	                if (items[i].eventNo == this.relatedElementList_up[k].eventNo) {    //判断是否存在
	                    tipStr = tipStr + items[i].eventNo + ",";
	                    isTip = true;
	                    isExist = true;
	                    break;
	                }
	            }
	            if(!isExist){
	                this.relatedElementList_up.push(items[i]);	
	            }
	        }
	        if(isTip){
	            this.$message({
	                message: '事件编号' + tipStr.substring(0,tipStr.length-1) + '已存在，不在添加！',
	                type: 'warning'
	            })
	        }
	    },
	    // 点击选择事件 行
	    up_elementSelectChange(val) {
	        this.relatedElementContainer = val
	    },
	    // 查询事件
	    getElementList_up(obj) {
	    	this.post('/beta/betaService/COS.IQ.02.0001', obj, (res) => {
	            if(res.returnCode == '000000') {
	                if(res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
	                    this.elementList_up = res.returnData.rows
	                    this.elementTotal_up = res.returnData.totalCount
	                }
	            } 
	        })
	    },
		// 查询已关联事件
	    getRelatedElementList_up(obj) {
	    	delete obj.pageNum
	    	delete obj.pageSize
	    	this.post('/beta/betaService/COS.CS.01.0026', obj, (res) => {
	            if(res.returnCode == '000000') {
	                if(res.returnData && res.returnData && res.returnData.length > 0) {
	                    this.relatedElementList_up = res.returnData
	                    console.log(this.relatedElementList_up)
	                }
	            }
	        })
	    },
	    //删除
	    delData(row){
	    	this.relatedElementList_up.splice(row,1)
	    },
	    // 确定修改
	    updateEvData() {
	     	for(var i=0;i<this.relatedElementList_up.length;i++){
				this.relatedElementList_up[i].menuNo = this.relatedElementList_up[i].eventNo+this.tempUp.menuNo;
				this.relatedElementList_up[i].menuName= this.relatedElementList_up[i].eventNo + "(" + this.relatedElementList_up[i].eventDesc + ")";
				this.relatedElementList_up[i]._checked = 'true'
            }
            let eventDta = {
            	flag: 'add',
            	upperMenuNo: this.tempUp.menuNo,
            }
           	eventDta.menulevel = parseInt(this.tempUp.menuLevel) + 1
            eventDta.coreEventMeList = this.relatedElementList_up
            
            this.post('/beta/betaService/COS.CS.01.0025', eventDta, (res) => {
				if (res.returnCode == '000000') {
					this.dialogFormVisibleEvUp = false
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
.w80{
	width: 80%;
}
.w80 label.el-form-item__label {
    width: 20%;
    float: left;
   
}
.w60{
	width: 60%;
}
</style>

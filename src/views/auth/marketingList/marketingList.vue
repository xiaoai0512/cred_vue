<!-- 营销清单管理 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="运营模式" prop="operationMode" >
                <el-select v-model="queryFormObj.operationMode" class="wd200" clearable placeholder="请选择">
                <el-option
                    v-for="(item, index ) in operationModeOptions"
                    :key="index"
                    :label="item.modeName"
                    :value="item.operationMode"/>
                </el-select>
            </el-form-item>
           	<el-form-item class="cl_td" label="清单代码" prop="listCode">
                <el-input v-model="queryFormObj.listCode" class="wd200" type="text"/>
            </el-form-item>
             <el-form-item class="cl_td" label="清单类型" prop="listTyp" >
                <el-select v-model="queryFormObj.listTyp" class="wd200" clearable placeholder="请选择">
                <el-option
                    v-for="(item, index ) in listTypOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.codes"/>
                </el-select>
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" >查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate" v-if="addBtnFlag">新增</el-button>
            </div>
        </el-form>
        <div v-if="showList">
            <el-table v-loading = "listLoading" :data="tableList" border stripe style="width: 100%">
                <el-table-column prop="organNo" label="序号" align="center"
                    type="index">
                </el-table-column>
                <el-table-column prop="operationMode" label="运营模式" align="center"/>
                 <el-table-column prop="listCode" label="清单代码" align="center"/>
                <el-table-column prop="listTypDesc" label="清单类型" align="center"/>
                <el-table-column prop="listDesc" label="描述" align="center"/>
                <el-table-column align="center" label="操作" >
                    <template slot-scope="scope">
                        <el-button size="mini" icon="el-icon-info" type="primary" @click="handleDetail(scope.row)" v-if="selBtnFlag">详情</el-button>
                        <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleUpdate(scope.row)" v-if="updBtnFlag">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="tableTotal>0" class="page-name" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
        </div>
        <!-- 新增 -->
        <el-dialog title="营销清单新增" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd" >
               <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
                   :rules="[ { required: true, message: '运营模式不能为空'}]">
                    <el-select v-model="tempAdd.operationMode" class="wd200" >
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="清单代码" prop="listCode" 
                    :rules="[ { required: true, message: '清单代码不能为空'}]">
                    <el-input v-model="tempAdd.listCode" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="清单类型" prop="listTyp" 
                	:rules="[ { required: true, message: '清单类型不能为空'}]">
	                <el-select v-model="tempAdd.listTyp" class="wd200">
	                <el-option
	                    v-for="(item, index ) in listTypOptions"
	                    :key="index"
	                    :label="item.detailDesc"
	                    :value="item.codes"/>
	                </el-select>
            	</el-form-item>
                <el-form-item class="cl_td" label="描述" prop="listDesc" 
                    :rules="[ { required: true, message: '描述不能为空'}]">
                    <el-input v-model="tempAdd.listDesc" class="wd200" type="text" />
                </el-form-item>
            </el-form>
            <!--特店Id信息-->
        	<div class="text_title">清单项目信息</div>
        	<div class="text_right">
                <el-button type="primary" @click="addInfo()">新增</el-button>
            </div>
            <el-table v-loading = "addListLoading" :data="addTableList" border stripe style="width: 100%">
                <el-table-column prop="organNo" label="序号" align="center"
                    type="index">
                </el-table-column>
                <el-table-column prop="operationMode" label="清单项目" align="center">
                	<template slot-scope="scope" >    
                      	<el-input v-model="scope.row.listProject1"  class="w-input"/>
                      	<el-input v-model="scope.row.listProject2"  class="w-input"/>
                      	<el-input v-model="scope.row.listProject3"   class="w-input"/>
                      	<el-input v-model="scope.row.listProject4"  class="w-input"/>
                      	<el-input v-model="scope.row.listProject5"  class="w-input"/>
                      	<el-input v-model="scope.row.listProject6"  class="w-input"/>
                      	<el-input v-model="scope.row.listProject7" class="w-input"/>
                      	<el-input v-model="scope.row.listProject8"  class="w-input"/>
                      	<el-input v-model="scope.row.listProject9"  class="w-input"/>
                      	<el-input v-model="scope.row.listProject10" class="w-input"/>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width='180px'>
                    <template slot-scope="scope">
                        <el-button size="mini" icon="el-icon-delete" type="primary" @click="delAddInfo(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleAdd = false">取消</el-button>
                <el-button type="primary" @click="createData()"> 确定</el-button>
            </div>
        </el-dialog> 
        <!-- 详情 -->
        <el-dialog title="营销清单详情查询" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail" :rules="rulesDetail" :model="tempDetail">
                <el-form-item class="cl_td" label="运营模式" prop="operationMode">
                    <el-select v-model="tempDetail.operationMode" class="wd200" readonly disabled>
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="清单代码" prop="listCode" >
                    <el-input v-model="tempDetail.listCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="清单类型" prop="listTyp" >
	                <el-select v-model="tempDetail.listTyp" class="wd200" readonly disabled>
	                <el-option
	                    v-for="(item, index ) in listTypOptions"
	                    :key="index"
	                    :label="item.detailDesc"
	                    :value="item.codes"/>
	                </el-select>
            	</el-form-item>
                <el-form-item class="cl_td" label="描述" prop="listDesc">
                    <el-input v-model="tempDetail.listDesc" class="wd200" type="text" readonly/>
                </el-form-item>
            </el-form>
           <el-table v-loading = "detailListLoading" :data="detailTableList" border stripe style="width: 100%">
                <el-table-column prop="organNo" label="序号" align="center"
                    type="index">
                </el-table-column>
                <el-table-column prop="operationMode" label="清单项目" align="center">
                	<template slot-scope="scope" >    
                      	<el-input v-model="scope.row.listProject1"  class="w-input"/>
                      	<el-input v-model="scope.row.listProject2"  class="w-input"/>
                      	<el-input v-model="scope.row.listProject3"  class="w-input"/>
                      	<el-input v-model="scope.row.listProject4"  class="w-input"/>
                      	<el-input v-model="scope.row.listProject5"  class="w-input"/>
                      	<el-input v-model="scope.row.listProject6"  class="w-input"/>
                      	<el-input v-model="scope.row.listProject7" 	class="w-input"/>
                      	<el-input v-model="scope.row.listProject8"  class="w-input"/>
                      	<el-input v-model="scope.row.listProject9"  class="w-input"/>
                      	<el-input v-model="scope.row.listProject10" class="w-input"/>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleDetail = false">取消</el-button>
            </div>
        </el-dialog> 
        <!-- 修改 -->
        <el-dialog title="营销清单修改" :visible.sync="dialogFormVisibleUp" width="65%">
        	<div class="mainname titleInfo ">营销清单修改</div>
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp" >
                <el-form-item class="cl_td" label="运营模式" prop="operationMode">
                    <el-select v-model="tempUp.operationMode" class="wd200" readonly disabled>
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="清单代码" prop="listCode" >
                    <el-input v-model="tempUp.listCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="清单类型" prop="listTyp" >
	                <el-select v-model="tempUp.listTyp" class="wd200" readonly disabled>
	                <el-option
	                    v-for="(item, index ) in listTypOptions"
	                    :key="index"
	                    :label="item.detailDesc"
	                    :value="item.codes"/>
	                </el-select>
            	</el-form-item>
                <el-form-item class="cl_td" label="描述" prop="listDesc">
                    <el-input v-model="tempUp.listDesc" class="wd200" type="text" :rules="[ { required: true, message: '描述不能为空'}]"/>
                </el-form-item>
            </el-form>
            <!--修改特店Id信息-->
            <div class="clearboth"></div>
        	<div class="mainname titleInfo ">清单项目</div>
        	<div class="text_right">
                <el-button type="primary" @click="addUpInfo()">新增</el-button>
            </div>
            <el-table v-loading = "upListLoading" :data="upTableList" border stripe style="width: 100%">
                <el-table-column prop="organNo" label="序号" align="center"
                    type="index">
                </el-table-column>
                <el-table-column prop="operationMode" label="特店ID" align="center">
                	<template slot-scope="scope" >    
                      	<el-input v-model="scope.row.listProject1"  class="w-input"/>
                      	<el-input v-model="scope.row.listProject2"  class="w-input"/>
                      	<el-input v-model="scope.row.listProject3"   class="w-input"/>
                      	<el-input v-model="scope.row.listProject4"  class="w-input"/>
                      	<el-input v-model="scope.row.listProject5"  class="w-input"/>
                      	<el-input v-model="scope.row.listProject6"  class="w-input"/>
                      	<el-input v-model="scope.row.listProject7" class="w-input"/>
                      	<el-input v-model="scope.row.listProject8"  class="w-input"/>
                      	<el-input v-model="scope.row.listProject9"  class="w-input"/>
                      	<el-input v-model="scope.row.listProject10" class="w-input"/>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width='180px'>
                    <template slot-scope="scope">
                        <el-button size="mini" icon="el-icon-delete" type="primary" @click="delUpInfo(scope.row,scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleUp = false">取消</el-button>
                <el-button type="primary" @click="updateData()">确认</el-button>
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
            // 列表
            showList: false,
            queryFormObj: {
                pageNum: 1,
                pageSize:10,
            },
            tableList: [],
            listLoading: false,
            queryFormRef: {},
            queryFormRules: {},      
            tableTotal: 0,
            corporationEntityNo: '',
            // 下拉框
            operationModeOptions: [], //运营模式
            applicationRangeOptions: [],//应用范围
            cardAssociationsOptions: [],//卡组标识
            listTypOptions: [],//清单类型
            /*----新增----*/
            tempAdd: {}, // 新增
            rulesAdd: {}, 
            dialogFormVisibleAdd: false,
            addTableList: [],
            addListLoading: false,
            /*----修改----*/
            dialogFormVisibleUp: false,
            tempUp: {}, // 修改
            rulesUp: {},
            dataFormUp:{},
            listProjectDel:[],
            //列表
            upTableList: [],
            upListLoading: false,
            /*----详情----*/
            dialogFormVisibleDetail: false,
            tempDetail: {}, // 修改
            rulesDetail: {},
            detailListLoading: false,
            detailTableList: [],
            /*----删除----*/
            dialogFormVisibleDel: false,
            tempDel: {},
            rulesDel: {},
            dataFormDel:{},
        }
    },
    created() {
       let logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))
        this.operationMode = logininfo.operationMode
        this.corporationEntityNo = logininfo.corporationEntityNo
        this.getBtnAuth()
    },
    mounted() {
       //运营模式
        let objis={
            requestType: '1',
            resultType: '1',
            corporationEntityNo: this.corporationEntityNo,
            adminFlagLogin: '1',
		}
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0037",objis).then(res => {
            this.operationModeOptions = res
        })
        //清单类型
        this.getSelectDict( "dic_listTypeFive").then(res => {
           // this.listTypOptions = res
            res.forEach(item => {'TM','MN','MC','CN'
                if(item.codes != 'TM' && item.codes != 'MN' && item.codes != 'MC' && item.codes != 'CN'){
                    this.listTypOptions.push(item)
                }
            })
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
                        if (this.eventList.includes('AUS.PM.04.0202')) { // 查询
                            this.selBtnFlag = true
                        } else {
                            this.selBtnFlag = false
                        }
                        if (this.eventList.includes('AUS.PM.04.0201')) { // 新增
                            this.addBtnFlag = true
                        } else {
                            this.addBtnFlag = false
                        }
                        if (this.eventList.includes('AUS.PM.04.0203')) { // 维护
                            this.updBtnFlag = true
                        } else {
                            this.updBtnFlag = false
                        }
                    }
                }
            })
        },
         //查询
        handleSearch() {
            if((this.queryFormObj.operationMode=='' || this.queryFormObj.operationMode==null || this.queryFormObj.operationMode==undefined) 
            && (this.queryFormObj.cardAssociations=='' || this.queryFormObj.cardAssociations==null || this.queryFormObj.cardAssociations==undefined) 
            && (this.queryFormObj.externalResponseCode=='' || this.queryFormObj.externalResponseCode==null || this.queryFormObj.externalResponseCode==undefined) ){
                this.$message('请输入查询条件');
                return;
            }else if(this.queryFormObj.cardAssociations){
                if(this.queryFormObj.operationMode=='' || this.queryFormObj.operationMode==null 
                    || this.queryFormObj.operationMode==undefined){
                        this.$message('请选择运营模式');
                        return;
                    }
            }
            this.showList=true
            this.getList()
        },
        // 列表
        getList() {
            this.listLoading = true
            let obj = {
            	isTrans: true,//是否需要翻译数据字典
				transParams : ['dic_listTypeFive'],//查找数据字典所需参数
				transDict : ['listTyp'],//翻译前后key
            }
            obj = Object.assign (obj, this.queryFormObj )
            this.getTableList('/beta/betaService/AUS.PM.04.0202', obj,(res) => {
                if (res.returnCode == '000000') {
                	this.listLoading = false
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.tableList = res.returnData.rows
                        this.tableTotal = res.returnData.totalCount
                    }else{
                    	this.tableList = []
                        this.tableTotal = 0
                    }
                }
            }, (err) => {
            	this.tableList = []
                this.tableTotal = 0
                this.listLoading = false
            })
        },
       //显示新增弹框
        handleCreate() {
        	// if(this.queryFormObj.operationMode=='' || this.queryFormObj.operationMode==null 
        	// || this.queryFormObj.operationMode==undefined){
        	// 	this.$message('请选择运营模式');
            //     return;
        	// }
            this.dialogFormVisibleAdd = true
            this.$nextTick(() => {
            this.$refs['dataFormAdd'].clearValidate()
          })
        },
        //新增特店ID信息
        addInfo(){
        	let newList={};
        	this.addTableList.push(newList)
        },
        //新增删除单条数据
        delAddInfo(val){
            this.addTableList.splice(val,1);
        },
       	//确认提交新增数据
        createData() {
        	let listProject = []
        	this.tempAdd.listProject = this.addTableList
        	this.$refs['dataFormAdd'].validate((valid) => {
	            if (valid) {
	                this.post('/beta/betaService/AUS.PM.04.0201', this.tempAdd, (res) => {
                        if (res.returnCode == '000000') {
                            this.$notify({
                                title: 'Success',
                                message: '新增成功',
                                type: 'success',
                                duration: 2000
                            })
                            this.dialogFormVisibleAdd = false
                            this.tempAdd = {}
                            this.addTableList = []
                            this.handleSearch()
                        }
	              	})
	            }
          	})
        },  
    	//显示详情弹框
        handleDetail(row) {
            this.dialogFormVisibleDetail = true
            this.tempDetail = Object.assign({}, row) // 
            this.getDetailList()
            this.$nextTick(() => {
            this.$refs['dataFormDetail'].clearValidate()
          })
        },
        //详情
        getDetailList(){
        	let obj = {
        		listCode: this.tempDetail.listCode,
				listSerialNumbr: this.tempDetail.listSerialNumbr,
				listTyp: this.tempDetail.listTyp,
				operationMode: this.tempDetail.operationMode,
				authDataSynFlag: '1',
        	}
        	this.getTableList('/beta/betaService/AUS.PM.04.0202', obj, (res) => {
               if (res.returnCode == '000000') {
               		 this.detailListLoading = false
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.detailTableList = res.returnData.rows
                    }else{
                    	this.detailTableList = []
                    }
                }
            }, (err) => {
            	this.detailTableList = []
            	this.detailListLoading = false
            })
        },
         //显示修改弹框
        handleUpdate(row) {
            this.tempUp = Object.assign({}, row)
            this.dialogFormVisibleUp= true
            this.getUpList()
            this.$nextTick(() => {
                this.$refs['dataFormUp'].clearValidate()
            })
        }, 
        getUpList(){
        	let obj = {
        		listCode: this.tempUp.listCode,
				listSerialNumbr: this.tempUp.listSerialNumbr,
				listTyp: this.tempUp.listTyp,
				operationMode: this.tempUp.operationMode,
				authDataSynFlag: '1',
        	}
        	this.getTableList('/beta/betaService/AUS.PM.04.0202', obj, (res) => {
               if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.upTableList = res.returnData.rows
                        this.upListLoading = false
                    }else{
                    	this.upTableList = []
                        this.upListLoading = false
                    }
                }
            }, (err) => {
            	this.upTableList = []
                this.upListLoading = false
            })
        },
        addUpInfo(){
        	 let upList={
                listProject1: "",
                listProject2: "",
                listProject3: "",
                listProject4: "",
                listProject5: "",
                listProject6: "",
                listProject7: "",
                listProject8: "",
                listProject9: "",
                listProject10: "",
            };
        	this.upTableList.push(upList)
        },
        //提交修改数据
        updateData() {
        	let listProject = [];
            this.tempUp.listProject = this.upTableList;
            this.tempUp.authDataSynFlag = '1';
            this.post('/beta/betaService/AUS.PM.04.0203', this.tempUp, (res) => {
                if (res.returnCode == '000000') {
                     this.dialogFormVisibleUp = false
                    this.$notify({
                    title: 'Success',
                    message: '修改成功',
                    type: 'success',
                    duration: 2000
                    })
                    this.handleSearch()
                    this.tempUp = {}
                }
            })
        },
        //删除
        delUpInfo(val,index){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
     		    this.listProjectDel = [];
                const delnegNew ={
                    id:val.id,
                    invalidFlag:"1",
                    listSerialNumbr:val.listSerialNumbr,
                    listProject1:val.listProject1,
                    listProject2:val.listProject2,
                    listProject3:val.listProject3,
                    listProject4:val.listProject4,
                    listProject5:val.listProject5,
                    listProject6:val.listProject6,
                    listProject7:val.listProject7,
                    listProject8:val.listProject8,
                    listProject9:val.listProject9,
                    listProject10:val.listProject10
                };
                this.listProjectDel.push(delnegNew);
                let delObj = {
                    listProject: this.listProjectDel,
                    id:val.id,
                    operationMode:this.tempUp.operationMode,
                    listCode:this.tempUp.listCode,
                    listDesc:this.tempUp.listDesc,
                    listTyp:this.tempUp.listTyp
                }
                this.post('/beta/betaService/AUS.PM.04.0203', delObj, (res) => {
                    
                    if (res.returnCode == '000000') {
                        this.dialogFormVisibleDel = false
                        this.$notify({
                        message: '删除成功',
                        type: 'success'
                        })
                        this.upTableList.splice(index,1);
                        this.getUpList()
                    }
                    
                })
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

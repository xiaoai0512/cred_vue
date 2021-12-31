<!-- 管控清单 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryForm" :rules="queryFormRules">
            <el-form-item class="cl_td" label="运营模式" prop="operationMode" @change="operationModeChange($event)">
                <el-select v-model="queryForm.operationMode" class="wd200" 
                    @change="operationModeChange($event)" clearable placeholder="请选择">
                <el-option
                    v-for="(item, index ) in operationModeOptions"
                    :key="index"
                    :label="item.modeName"
                    :value="item.operationMode"/>
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="管控场景代码" prop="listCode">
                <el-select v-model="queryForm.listCode" class="wd200" clearable placeholder="请选择">
                <el-option
                    v-for="(item, index ) in listCodeOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"/>
                </el-select>
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" v-show="selBtnFlag">查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate" v-show="addBtnFlag">新增</el-button>
            </div>
        </el-form>
        <div v-if="showList">
            <el-table v-loading = "listLoadingA" :data="tableListA" border stripe style="width: 100%">
                <el-table-column prop="organNo" label="序号" align="center"
                    type="index">
                </el-table-column>
                <el-table-column prop="operationMode" label="运营模式" align="center"/>
                 <el-table-column prop="listCode" label="管控场景代码" align="center"/>
                <el-table-column prop="listTypDesc" label="清单类型" align="center"/>
                <el-table-column prop="listDesc" label="描述" align="center"/>
                <el-table-column align="center" label="操作" width="280">
                    <template slot-scope="scope">
                        <el-button size="mini" icon="el-icon-info" type="primary" @click="handleDetail(scope.row)" v-show="selBtnFlag">详情</el-button>
                        <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleUpdate(scope.row)" v-show="updBtnFlag">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="tableTotalA>0" class="page-name" :total="tableTotalA" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="getList" />
        </div>
       <!-- 新增 -->
        <el-dialog title="管控清单建立" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd" >
               <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
                   :rules="[ { required: true, message: '运营模式不能为空'}]">
                    <el-select v-model="tempAdd.operationMode" class="wd200" @change="addOperationModeChange($event)" clearable placeholder="请选择">
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="管控场景代码" prop="listCode" 
                    :rules="[ { required: true, message: '管控场景代码不能为空'}]">
                    <el-select v-model="tempAdd.listCode" class="wd200" clearable placeholder="请选择">
                    <el-option
                        v-for="(item, index ) in addListCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="清单类型" prop="listTyp" 
                    :rules="[ { required: true, message: '清单类型不能为空'}]">
                    <el-select v-model="tempAdd.listTyp" class="wd200" clearable placeholder="请选择">
                    <el-option
                        v-for="(item, index ) in listTypInfoOptions"
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
            <!--清单信息-->
            <div class="clearboth"></div>
            <div class="mainname" style="display: inline;">清单信息</div>
            <div  class="layui-inline text_right" style="position: relative; float: right;">
                <el-button type="primary" @click="addInfo()">新增</el-button>
            </div>
            <el-table  :data="addTableList"  border stripe style="width: 100%">
                <el-table-column prop="organNo" label="序号" align="center"
                    type="index">
                </el-table-column>
                <el-table-column label="清单项目"  align="center" >
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
                <el-table-column align="center" label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button size="mini" icon="el-icon-delete" type="primary" @click="handleAddDeldate(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleAdd = false">取消</el-button>
                <el-button type="primary" @click="createData()"> 确定</el-button>
            </div>
        </el-dialog> 
        <!-- 详情 -->
        <el-dialog title="管控清单详情" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormInfo" :model="tempInfo" >
                <el-form-item class="cl_td" label="运营模式" prop="operationMode">
                    <el-select v-model="tempInfo.operationMode" class="wd200" disabled>
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="管控场景代码" prop="listCode">
                    <el-select v-model="tempInfo.listCode" class="wd200" disabled>
                    <el-option
                        v-for="(item, index ) in addListCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="清单类型" prop="listTyp">
                    <el-select v-model="tempInfo.listTyp" class="wd200" disabled>
                    <el-option
                        v-for="(item, index ) in listTypInfoOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="listDesc">
                    <el-input v-model="tempInfo.listDesc" class="wd200" type="text" readonly/>
                </el-form-item>
            </el-form>
            <div class="mainname" style="display: inline;">清单信息</div>
            <el-table  :data="tempDetailList2"  border stripe style="width: 100%">
                <el-table-column prop="organNo" label="序号" align="center"
                    type="index">
                </el-table-column>
                <el-table-column label="清单项目"  align="center" >
                    <template slot-scope="scope" >
                        <el-input v-model="scope.row.listProject1"  class="w-input" readonly/>
                        <el-input v-model="scope.row.listProject2"  class="w-input" readonly/>
                        <el-input v-model="scope.row.listProject3"   class="w-input" readonly/>
                        <el-input v-model="scope.row.listProject4"  class="w-input" readonly/>
                        <el-input v-model="scope.row.listProject5"  class="w-input" readonly/>
                        <el-input v-model="scope.row.listProject6"  class="w-input" readonly/>
                        <el-input v-model="scope.row.listProject7"  class="w-input" readonly/>
                        <el-input v-model="scope.row.listProject8"  class="w-input" readonly/>
                        <el-input v-model="scope.row.listProject9"  class="w-input" readonly/>
                        <el-input v-model="scope.row.listProject10" class="w-input" readonly/>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleDetail = false">取消</el-button>
            </div>
        </el-dialog> 
        <!-- 修改 -->
        <el-dialog title="管控清单维护" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp" >
                <el-form-item class="cl_td" label="运营模式" prop="operationMode">
                    <el-input v-model="tempUp.operationMode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="管控场景代码" prop="listCode">
                    <el-input v-model="tempUp.listCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="清单类型" prop="listTypDesc">
                    <el-input v-model="tempUp.listTypDesc" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="listDesc" 
                    :rules="[ { required: true, message: '描述不能为空'}]">
                    <el-input v-model="tempUp.listDesc" class="wd200" type="text" />
                </el-form-item>
            </el-form>
            <!--清单信息-->
            <div class="clearboth"></div>
            <div class="mainname" style="display: inline;">清单信息</div>
            <div  class="layui-inline text_right" style="position: relative; float: right;">
                <el-button type="primary" @click="upInfo()">新增</el-button>
                <el-button type="primary" @click="allUpDeldate()">全部删除</el-button>
            </div>
            <el-table  :data="tempUpList1"  border stripe style="width: 100%">
                <el-table-column prop="organNo" label="序号" align="center"
                    type="index">
                </el-table-column>
                <el-table-column label="清单项目"  align="center" >
                    <template slot-scope="scope">
                        
                        <el-input v-model="scope.row.listProject1"  class="w-input"/>
                        <el-input v-model="scope.row.listProject2"  class="w-input"/>
                        <el-input v-model="scope.row.listProject3"   class="w-input"/>
                        <el-input v-model="scope.row.listProject4"  class="w-input"/>
                        <el-input v-model="scope.row.listProject5"  class="w-input"/>
                        <el-input v-model="scope.row.listProject6"  class="w-input"/>
                        <el-input v-model="scope.row.listProject7"  class="w-input"/>
                        <el-input v-model="scope.row.listProject8"  class="w-input"/>
                        <el-input v-model="scope.row.listProject9"  class="w-input"/>
                        <el-input v-model="scope.row.listProject10" class="w-input"/>
                        
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="120">
                    <template slot-scope="scope">
                        <el-button size="mini" icon="el-icon-delete" type="primary" @click="handleUpDeldate(scope.row,scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleUp = false">取消</el-button>
                <el-button type="primary" @click="submitUpInfo()">确认</el-button>
            </div>
        </el-dialog> 
    </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import * as _ from 'lodash'
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
            eventList: '',
            // 列表
            showList: false,
            queryForm: {
                pageNum: 1,
                pageSize:10,
            },
            listLoadingA: false,
            queryFormRef: {},
            queryFormRules: {},      
            tableListA: [],
            tableTotalA: 0,
            list_operationMode: '',
            // 下拉框
            operationModeOptions: [], //运营模式
            listCodeOptions: [],//授权响应码
            addListCodeOptions: [],
            differentTypeOptions:[],
            listTypInfoOptions: [],
            idTypeList: [],//证件类型
            /*----新增----*/
            tempAdd: {}, // 新增
            rulesAdd: {}, 
            dialogFormVisibleAdd: false,
            addTableList: [],//列表
            addObj: [],
            /*----修改----*/
            dialogFormVisibleUp: false,
            tempUp: {}, // 修改
            tempUpList1: [],
            rulesUp: {},
            dataFormUp:{},
            authContrlExcplistDel: [],
            /*----详情----*/
            tempInfo:{},
            detailLoading1: false,
            dialogFormVisibleDetail: false,
           // tempDetailList1: [], // 
            tempDetailList2: [], // 修改
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
        //应用范围
        this.getSelectDict( "dic_applictionrange").then(res => {
            this.applicationRangeOptions = res
        })
        //差异化类型
        this.getSelectDict( "dic_differentType").then(res => {
            this.differentTypeOptions = res
        })
        //清单类型
        this.getSelectDict( "dic_listTypeFive").then(res => {
            res.forEach(item => {
                if(item.codes != 'PD' && item.codes != 'CH'){
                    this.listTypInfoOptions.push(item)
                }
            })
        })
    },
    methods: {
       
        // 查询按钮权限
        getBtnAuth() {
            let params= {
                menuNo : window.sessionStorage.getItem('menuNo')
            }
            this.getTableList('/beta/betaService/COS.CS.01.0030', params ,(res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.length > 0 ) {
                        res.returnData.forEach(item => {
                            this.eventList += item.eventNo+','
                        })
                        if (this.eventList.includes('AUS.PM.02.0222')) { // 查询
                            this.selBtnFlag = true
                        } else {
                            this.selBtnFlag = false
                        }
                        if (this.eventList.includes('AUS.PM.02.0221')) { // 新增
                            this.addBtnFlag = true
                        } else {
                            this.addBtnFlag = false
                        }
                        if (this.eventList.includes('AUS.PM.02.0223')) { // 维护
                            this.updBtnFlag = true
                        } else {
                            this.updBtnFlag = false
                        }
                    }
                }
            })
        },
        //运营模式监听
        operationModeChange(val) {
            this.listCodeOptions = []
            this.list_operationMode = val
            this.getListCodeOptions()
        },
        //管控场景代码
        getListCodeOptions() {
            let params = {
                differentType:'0',
                operationMode: this.list_operationMode,
            }
            this.post('/beta/betaService/AUS.PM.02.0102', params, (res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        let arr = []
                        let rows = res.returnData.rows
                        rows.forEach((item, index) => {
                            item.listCodeDesc = item.listCode + ' ' + item.contrlSceneDesc
                            arr[index] = {
                                label: item.listCodeDesc,
                                value: item.listCode
                            }
                        })
                        this.listCodeOptions = arr
                    } else {
                        this.listCodeOptions = []
                    }
                }
            })
        },
         //查询
        handleSearch() {
            if(this.queryForm.operationMode=='' || this.queryForm.operationMode==null || 
                
                this.queryForm.operationMode==undefined){
                
                this.$message('请输入查询条件');
                return;
            }else if(this.queryForm.listCode){
                if(this.queryForm.operationMode=='' || this.queryForm.operationMode==null 
                    
                    || this.queryForm.operationMode==undefined){
                       
                    this.$message('请选择运营模式');
                    return;
                }
            }
            this.showList=true
            this.getList()
        },
        // 列表
        getList() {
        	this.listLoadingA = true
            let obj={
                isTrans: true,//是否需要翻译数据字典
                transParams : ['dic_listTypeFive'],//查找数据字典所需参数
                transDict : ['listTyp'],//翻译前后key
            }
            obj = Object.assign ( obj, this.queryForm )
            this.getTableList('/beta/betaService/AUS.PM.02.0222', obj ,(res) => {
            	this.listLoadingA = false
                if (res.returnCode == '000000') {
                	if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.tableListA = res.returnData.rows
                    	this.tableTotalA = res.returnData.totalCount
                    }else{
	                	this.tableListA = []
	                    this.tableTotalA = 0
               		 }
               	}
            }, (err) =>{
            	this.tableListA = []
                this.tableTotalA = 0
                this.listLoadingA = false
            })
        },
       //显示新增弹框
        handleCreate() {
            this.dialogFormVisibleAdd = true
            this.$nextTick(() => {
            this.$refs['dataFormAdd'].clearValidate()
          })
        }, 
        addInfo(){
            let newList={
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
            this.addTableList.push(newList);
        },
        //确认提交新增数据
        createData() {
            let  authContrlContList = []
           // this.tempAdd.listTyp = this.tempAdd.listTypInfo;
            this.tempAdd.differentType = 0;
            this.tempAdd.authContrlContList=this.addTableList
            this.tempAdd = Object.assign (this.tempAdd, this.queryForm)
            this.post('/beta/betaService/AUS.PM.02.0221', this.tempAdd, (res) => {
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
                    this.addTableList = []
                }
            })
        },
        //新增删除单条数据
        handleAddDeldate(val){
            this.addTableList.splice(val,1);
        },
        //运营模式监听
        addOperationModeChange(val) {
            this.listCodeOptions = []
            this.add_operationMode = val
            this.getAddListCodeOptions()
        },
        //授权响应码下拉关联卡组织标识
        getAddListCodeOptions() {
            let params = {
                operationMode : this.add_operationMode,
            }
            this.post('/beta/betaService/AUS.PM.02.0102', params, (res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        let arr = []
                        let rows = res.returnData.rows
                        rows.forEach((item, index) => {
                            item.listCodeDesc = item.listCode + ' ' + item.contrlSceneDesc
                            arr[index] = {
                                label: item.listCodeDesc,
                                value: item.listCode
                            }
                        })
                        this.addListCodeOptions = arr
                    } else {
                        this.addListCodeOptions = []
                    }
                }
            })
        },
        //显示详情弹框
        handleDetail(row) {
            this.dialogFormVisibleDetail = true
            this.tempInfo = Object.assign({}, row)
            this.getDetailList(row)
        },
        getDetailList(row) {
            this.detailLoading1 = true
            let itemList = {
                differentCode: null,
                authDataSynFlag: "1",
                differentType: row.differentType,
                flag: 'F',
                listCode: row.listCode,
                listTyp: row.listTyp,
                isTrans: true,//是否需要翻译数据字典
                transParams : ['dic_differentType','dic_listTypeFive'],//查找数据字典所需参数
                transDict : ['differentType','listTyp'],//翻译前后key
            }
            itemList = Object.assign ( itemList, this.queryForm )
            this.getTableList('/beta/betaService/AUS.PM.02.0222', itemList ,(res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                      //  this.tempDetailList1 = res.returnData.rows
                        this.tempDetailList2 = res.returnData.rows
                        this.detailLoading1 = false
                    }else{
                    	this.tempDetailList2 = []
                        this.detailLoading1 = false
                    }
                }
            },(err) => {
            	this.tempDetailList2 = []
                this.detailLoading1 = false
            })
        },
        /*----显示修改弹框----*/
        handleUpdate(row) {
            this.tempUp = Object.assign({}, row)
            this.dialogFormVisibleUp= true
            this.getUpInfo()
            this.$nextTick(() => {
                this.$refs['dataFormUp'].clearValidate()
            })
        }, 
         //修改列表数据
        getUpInfo() {
            let itemUpList = {
                differentType: this.tempUp.differentType,
                flag: 'F',
                listCode: this.tempUp.listCode,
                listTyp: this.tempUp.listTyp,
                listProperties: this.tempUp.listProperties,
                operationMode:  this.tempUp.operationMode,
            }
            itemUpList = Object.assign (itemUpList, this.queryForm)
            this.getTableList('/beta/betaService/AUS.PM.02.0222', itemUpList ,(res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.tempUpList1 = res.returnData.rows
                    }else{
                    	this.tempUpList1 = []
                    }
                }
            })
        },
        upInfo(){
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
            this.tempUpList1.push(upList);
        },
        
        //确认提交修改数据
        submitUpInfo() {
            let  authContrlContList = []
            this.tempUpList1.forEach(item => {   //循环  列表字段拼接
                item.updateExcNew = {id:item.id, listProject1:item.listProject1, listProject2:item.listProject2, listProject3:item.listProject3,
                listProject4:item.listProject4, listProject5:item.listProject5, listProject6:item.listProject6, listProject7:item.listProject7,
                listProject8:item.listProject8,listProject9:item.listProject9,listProject10:item.listProject10,listSerialNumbr: item.listSerialNumbr}
                authContrlContList.push(item.updateExcNew);
            })
            let subData = {
                operationMode: this.tempUp.operationMode,
                listCode:this.tempUp.listCode ,  
                listTyp: this.tempUp.listTyp,   
                listDesc: this.tempUp.listDesc,
                authDataSynFlag: '1',
                authContrlContList: authContrlContList,
            }
            subData = Object.assign (subData, this.queryForm)
            this.post('/beta/betaService/AUS.PM.02.0223', subData, (res) => {
                if (res.returnCode == '000000') {
                    this.dialogFormVisibleUp = false
                this.$notify({
                    message: '修改成功',
                    type: 'success',
                }) 
                this.getList()
                this.tempUp = {}
                }
            })
        },
        //修改删除单条数据
        handleUpDeldate(val,index){
            this.authContrlExcplistDel = [];
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
            this.authContrlExcplistDel.push(delnegNew);
            let subDelData = {
                operationMode: this.tempUp.operationMode,
                listCode:this.tempUp.listCode ,  
                listTyp: this.tempUp.listTyp,   
                listDesc: this.tempUp.listDesc,
                authDataSynFlag: '1',
                authContrlContList: this.authContrlExcplistDel,
            }
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.post('/beta/betaService/AUS.PM.02.0223', subDelData, (res) => {
                    if (res.returnCode == '000000') {
                          this.$notify({
                            message: '删除成功',
                            type: 'success',
                        }) 
                        this.getUpInfo();
                    }
                  
                })
            })
        },
        //删除全部数据
        allUpDeldate(){
            this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.tempUpList1=[]
                this.tempUp.invalidFlag = '1'
                this.post('/beta/betaService/AUS.PM.02.0223', this.tempUp, (res) => {
                    if (res.returnCode == '000000') {
                        this.$notify({
                            message: '删除成功',
                            type: 'success',
                        }) 
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

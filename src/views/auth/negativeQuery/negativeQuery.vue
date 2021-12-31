<!-- 正负面清单 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryForm" :rules="queryFormRules">
            <el-form-item class="cl_td" label="运营模式" prop="operationMode" @change="operationModeChange($event)">
                <el-select v-model="queryForm.operationMode" class="wd200" 
                    @change="operationModeChange($event)">
                <el-option
                    v-for="(item, index ) in operationModeOptions"
                    :key="index"
                    :label="item.modeName"
                    :value="item.operationMode"/>
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="管控场景代码" prop="listCode">
                <el-select v-model="queryForm.listCode" class="wd200">
                <el-option
                    v-for="(item, index ) in listCodeOptions"
                    :key="index"
                    :label="item.label"
                    :value="item.value"/>
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="差异化类型" prop="differentType" >
                    <el-select v-model="queryForm.differentType" class="wd200">
                    <el-option
                        v-for="(item, index ) in differentTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="风险等级" prop="riskLevel" v-if='queryForm.differentType=="1"'>
                    <el-input v-model="queryForm.riskLevel" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="证件类型" prop="idType" v-if="queryForm.differentType=='2'">
                    <el-select v-model="queryForm.idType" class="wd200">
                        <el-option v-for="(item, index) in idTypeList" :key="index" :label="item.detailDesc" :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="证件号码" prop="idNumber" v-if="queryForm.differentType=='2'"> 
                    <el-input v-model="queryForm.idNumber" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNo" v-if="queryForm.differentType=='3'">
                    <el-input v-model="queryForm.externalIdentificationNo" class="wd200" type="text" />
                </el-form-item>
                 <el-form-item class="cl_td" label="产品维度" prop="productDimensionAdd" v-if="queryForm.differentType=='4'">
                    <el-input v-model="queryForm.productDimensionAdd" class="wd200" type="text" />
                </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" >查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate" v-if="addBtnFlag">新增</el-button>
            </div>
        </el-form>
        <div v-if="showListA">
            <el-table v-loading = "listLoadingA" :data="tableListA" border stripe style="width: 100%">
                <el-table-column prop="organNo" label="序号" align="center"
                    type="index">
                </el-table-column>
                <el-table-column prop="operationMode" label="运营模式" align="center"/>
                 <el-table-column prop="differentTypeDesc" label="差异化类型" align="center"/>
                <el-table-column prop="differentCode" label="差异化代码" align="center"/>
                <el-table-column prop="listCode" label="管控场景代码" align="center"/>
                <el-table-column prop="listTypDesc" label="清单类型" align="center"/>
                <el-table-column prop="listDesc" label="描述" align="center"/>
                <el-table-column align="center" label="操作" width="280">
                    <template slot-scope="scope">
                        <el-button size="mini" icon="el-icon-search" type="primary" @click="handleDetail(scope.row)" v-if="selBtnFlag">详情</el-button>
                        <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleUpdate(scope.row)" v-if="updBtnFlag">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="tableTotalA>0" class="page-name" :total="tableTotalA" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="getList" />
        </div>
        <div v-if="showListB">
            <el-table v-loading = "listLoadingB" :data="tableListB" border stripe style="width: 100%">
                <el-table-column prop="organNo" label="序号" align="center"
                    type="index">
                </el-table-column>
                <el-table-column prop="operationMode" label="运营模式" align="center"/>
                 <el-table-column prop="differentTypeDesc" label="差异化类型" align="center"/>
                <el-table-column prop="differentCode" label="差异化代码" align="center"/>
                <el-table-column prop="listCode" label="管控场景代码" align="center"/>
                <el-table-column prop="listTypDesc" label="清单类型" align="center"/>
                <el-table-column prop="listDesc" label="描述" align="center"/>
                <el-table-column align="center" label="操作" width="280">
                    <template slot-scope="scope">
                        <el-button size="mini" icon="el-icon-search" type="primary" @click="handleDetail(scope.row)" v-if="selBtnFlag">详情</el-button>
                        <el-button size="mini" icon="el-icon-search" type="primary" @click="handleUpdate(scope.row)" v-if="updBtnFlag">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="tableTotalB>0" class="page-name" :total="tableTotalB" :page.sync="queryForm.pageNum" :limit.sync="queryForm.pageSize" @pagination="getList" />
        </div>
        <!-- 新增 -->
        <el-dialog title="授权响应码新增" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd" >
               <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
                   :rules="[ { required: true, message: '运营模式不能为空'}]">
                    <el-select v-model="tempAdd.operationMode" class="wd200" @change="addOperationModeChange($event)" >
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="管控场景代码" prop="listCode" 
                    :rules="[ { required: true, message: '管控场景代码不能为空'}]">
                    <el-select v-model="tempAdd.listCode" class="wd200">
                    <el-option
                        v-for="(item, index ) in addListCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="差异化类型" prop="differentType" 
                    :rules="[ { required: true, message: '差异化类型不能为空'}]">
                    <el-select v-model="tempAdd.differentType" class="wd200">
                    <el-option
                        v-for="(item, index ) in differentTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="风险等级" prop="riskLevelAdd" v-if='tempAdd.differentType=="1"'>
                    <el-input v-model="tempAdd.riskLevelAdd" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="证件类型" prop="idType" v-if="tempAdd.differentType=='2'">
                    <el-select v-model="tempAdd.idType" class="wd200">
                        <el-option v-for="(item, index) in idTypeList" :key="index" :label="item.detailDesc" :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="证件号码" prop="idNumber" v-if="tempAdd.differentType=='2'"> 
                    <el-input v-model="tempAdd.idNumber" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNoAdd" v-if="tempAdd.differentType=='3'">
                    <el-input v-model="tempAdd.externalIdentificationNoAdd" class="wd200" type="text" />
                </el-form-item>
                 <el-form-item class="cl_td" label="产品维度" prop="productDimensionAdd" v-if="tempAdd.differentType=='4'">
                    <el-input v-model="tempAdd.productDimensionAdd" class="wd200" type="text" />
                </el-form-item>
                
                <el-form-item class="cl_td" label="清单类型" prop="listTypInfo" 
                    :rules="[ { required: true, message: '清单类型不能为空'}]">
                    <el-select v-model="tempAdd.listTypInfo" class="wd200">
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
            <div class="text_title" style="display: inline;">清单信息</div>
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
                        <el-button size="mini" icon="el-icon-search" type="primary" @click="handleAddDeldate(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleAdd = false">取消</el-button>
                <el-button type="primary" @click="createData()"> 确定</el-button>
            </div>
        </el-dialog> 
        <!-- 详情 -->
        <el-dialog title="查询详细信息" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-table :data="tempDetailList1"  border stripe style="width: 100%">
                <el-table-column prop="operationMode" label="运营模式" align="center"/>
               	<el-table-column prop="differentTypeDesc" label="差异化类型"  align="center" />
                <el-table-column prop="differentCode" label="差异化代码"  align="center" />
                <el-table-column prop="listCode" label="管控场景代码"  align="center" />
                <el-table-column prop="listTypDesc" label="清单类型"  align="center" />
                <el-table-column prop="listDesc" label="描述"  align="center" />
            </el-table>
            <div class="mainname" style="display: inline;">清单信息</div>
            <el-table v-loading="detailLoading2" :data="tempDetailList2"  border stripe style="width: 100%">
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
        <el-dialog title="维护信息" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp" >
                <el-form-item class="cl_td" label="运营模式" prop="operationMode" readonly disabled>
                    <el-select v-model="tempUp.operationMode" class="wd200" >
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="管控场景代码" prop="listCode" readonly disabled>
                    <el-select v-model="tempUp.listCode" class="wd200">
                    <el-option
                        v-for="(item, index ) in addListCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="差异化类型" prop="differentType" readonly disabled>
                    <el-select v-model="tempUp.differentType" class="wd200">
                    <el-option
                        v-for="(item, index ) in differentTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="风险等级" prop="riskLevelAdd" v-if='tempAdd.differentType=="1"'>
                    <el-input v-model="tempUp.riskLevelAdd" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="证件类型" prop="idType" v-if="tempAdd.differentType=='2'">
                    <el-select v-model="tempUp.idType" class="wd200">
                        <el-option v-for="(item, index) in idTypeList" :key="index" :label="item.detailDesc" :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="证件号码" prop="idNumber" v-if="tempAdd.differentType=='2'"> 
                    <el-input v-model="tempUp.idNumber" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="外部识别号" prop="externalIdentificationNoAdd" v-if="tempAdd.differentType=='3'">
                    <el-input v-model="tempUp.externalIdentificationNoAdd" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="产品维度" prop="productDimensionAdd" v-if="tempAdd.differentType=='4'">
                    <el-input v-model="tempUp.productDimensionAdd" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="清单类型" prop="listTypDesc" readonly disabled>
                    <el-select v-model="tempUp.listTypDesc" class="wd200">
                        <el-option
                            v-for="(item, index ) in listTypInfoOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="listDesc" >
                    <el-input v-model="tempUp.listDesc" class="wd200" type="text" />
                </el-form-item>
            </el-form>
            <!--清单信息-->
            <div class="clearboth"></div>
            <div class="mainname" style="display: inline;">清单信息</div>
            <div  class="layui-inline text_right" style="position: relative; float: right;">
                <el-button type="primary" @click="upInfo()">新增</el-button>
                <el-button type="primary" @click="allUpDeldate()">删除</el-button>
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
                        <el-button size="mini" icon="el-icon-search" type="primary" @click="handleUpDeldate(scope.row)">删除</el-button>
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
            showListA: false,
            showListB: false,
            queryForm: {
                pageNum: 1,
                pageSize:10,
            },
            listLoadingA: false,
            listLoadingB: false,
            queryFormRef: {},
            queryFormRules: {},      
            tableListA: [],
            tableTotalA: 0,
            tableListB: [],
            tableTotalB: 0,
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
            /*addlistLoading: true,*/
            /*----修改----*/
            tempUp: {},
            dialogFormVisibleUp: false,
            tempUpList1: [],
            rulesUp: {},
            dataFormUp:{},
            /*----详情----*/
            detailLoading2: false,
            dialogFormVisibleDetail: false,
            tempDetailList1: [], // 
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
            this.listTypInfoOptions = res
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
                        if (this.btnAuthStr.includes('AUS.PM.02.0202')) { // 查询
                            this.selBtnFlag = true
                        } else {
                            this.selBtnFlag = false
                        }
                        if (this.btnAuthStr.includes('AUS.PM.02.0201')) { // 新增
                            this.addBtnFlag = true
                        } else {
                            this.addBtnFlag = false
                        }
                        if (this.btnAuthStr.includes('AUS.PM.02.0203')) { // 维护
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
        //授权响应码下拉关联卡组织标识
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
            if((this.queryForm.operationMode=='' || this.queryForm.operationMode==null || this.queryForm.operationMode==undefined) 
            && (this.queryForm.cardAssociations=='' || this.queryForm.cardAssociations==null || this.queryForm.cardAssociations==undefined) 
            && (this.queryForm.externalResponseCode=='' || this.queryForm.externalResponseCode==null || this.queryForm.externalResponseCode==undefined) ){
                this.$message('请输入查询条件');
                return;
            }else if(this.queryForm.cardAssociations){
                if(this.queryForm.operationMode=='' || this.queryForm.operationMode==null 
                    || this.queryForm.operationMode==undefined){
                        this.$message('请选择运营模式');
                        return;
                    }
            }else if(this.queryForm.differentType=='1'){
                if(this.queryForm.riskLevel=='' || this.queryForm.riskLevel==null 
                    || this.queryForm.riskLevelAdd==undefined){
                        this.$message('请输入正确的差异化风险等级,应为两位数字');
                        return;
                    }
            }else if(this.queryForm.differentType=='2'){
                if((this.queryForm.idType=='' || this.queryForm.idType==null 
                    || this.queryForm.idType==undefined) || (this.queryForm.idNumber=='' || this.queryForm.idNumber==null 
                    || this.queryForm.idNumber==undefined)){
                        this.$message('请输入证件类型与证件号码');
                        return;
                    }
            }else if(this.queryForm.differentType=='3'){
                if(this.queryForm.externalIdentificationNo=='' || this.queryForm.externalIdentificationNo==null 
                    || this.queryForm.externalIdentificationNo==undefined){
                        this.$message('请输入外部识别号');
                        return;
                    }
            }
            this.showListA=true
            this.getList()
        },
        // 列表
        getList() {
            
            let obj={
                isTrans: true,//是否需要翻译数据字典
                transParams : ['dic_differentType','dic_listTypeFive'],//查找数据字典所需参数
                transDict : ['differentType','listTyp'],//翻译前后key
            }
            obj = Object.assign ( obj, this.queryForm )
           	if(this.queryForm.hasOwnProperty('differentType')){
                this.queryForm.differentType='0'
                delete  obj.idNumber
                delete  obj.idType
                delete  obj.externalIdentificationNo
                delete  obj.riskLevel
                delete  obj.productDimensionAdd
                this.listLoadingA = false
                this.listLoadingB = true
            }else if(this.queryForm.differentType=='1'){
                delete  obj.idNumber
                delete  obj.idType
                delete  obj.externalIdentificationNo
                delete  obj.riskLevel
                delete  obj.productDimensionAdd
                this.listLoadingA = false
                this.listLoadingB = true
            }else if(this.queryForm.differentType=='2'){
                delete obj.externalIdentificationNo
                delete obj.riskLevel
                delete obj.productDimensionAdd
                this.listLoadingA = true
                this.listLoadingB = false
            }else if(this.queryForm.differentType=='3'){
                 delete obj.idNumber
                 delete obj.idType
                 delete obj.riskLevel
                 delete obj.productDimensionAdd
                  this.listLoadingA = true
                this.listLoadingB = false
            }else if(this.queryForm.differentType=='4'){
               delete obj.idNumber
               delete obj.idType
               delete obj.externalIdentificationNo
               delete obj.riskLevel
                this.listLoadingA = false
                this.listLoadingB = true
            }
            obj.flag = true
            this.getTableList('/beta/betaService/AUS.PM.02.0202', obj ,(res) => {
                if (res.returnCode == '000000') {
                    this.listLoadingA = false
                    this.listLoadingB = false
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.tableListA = res.returnData.rows
                        this.tableListB = res.returnData.rows
                        this.tableTotalA = res.returnData.totalCount
                        this.tableTotalB = res.returnData.totalCount
                    }else{
                    	this.tableListA = []
                        this.tableListB = []
                        this.tableTotalA = 0
                        this.tableTotalB = 0
                    }
                }
            }, (err) => {
            	this.tableListA = []
                this.tableListB = []
                this.tableTotalA = 0
                this.tableTotalB = 0
                this.listLoadingA = false
                this.listLoadingB = false
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
            let  authPositivNegativListDtos = []
            this.tempAdd.authPositivNegativListDtos=this.addTableList
            this.tempAdd.authDataSynFlag='1'
            this.tempAdd.listTyp = this.tempAdd.listTypInfo;
            this.tempAdd = Object.assign (this.tempAdd, this.queryForm)
            if(this.tempAdd.differentType=='4' || this.tempAdd.differentType=='0' || this.tempAdd.differentType=='1'){
                delete this.tempAdd.authDataSynFlag
                this.post('/beta/betaService/AUS.PM.02.0201', this.tempAdd, (res) => {
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
            }else if(this.tempAdd.differentType=='2' || this.tempAdd.differentType=='3'){
                this.post('/auth/authService/AUS.PM.02.0207', this.tempAdd, (res) => {
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
            this.tempDetailList1 =[]
            this.tempDetailList1.push(row) 
           	this.getDetailList(row)
        },
        getDetailList(row) {
            this.detailLoading2 = true
            let itemList = {
                authDataSynFlag: "1",
                differentType: row.differentType,
                flag: false,
                listCode: row.listCode,
                listTyp: row.listTyp,
                isTrans: true,//是否需要翻译数据字典
                transParams : ['dic_differentType','dic_listTypeFive'],//查找数据字典所需参数
                transDict : ['differentType','listTyp'],//翻译前后key
            }
            itemList = Object.assign ( itemList, this.queryForm )
            if(itemList.differentType=='4' || itemList.differentType=='0' || itemList.differentType=='1'){
                this.getTableList('/beta/betaService/AUS.PM.02.0202', itemList ,(res) => {
                    if (res.returnCode == '000000') {
                    	 this.detailLoading2 = false
                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                          	this.tempDetailList2 = res.returnData.rows
                        }else{
                        	this.tempDetailList2 = []
                        }
                    }
                })
            }else if(itemList.differentType=='2' || itemList.differentType=='3'){
            	this.getTableList('/authService/AUS.PM.02.0207', itemList ,(res) => {
                    if (res.returnCode == '000000') {
                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                            this.tempDetailList2 = res.returnData.rows
                            this.detailLoading2 = false
                        }else {
                        	this.tempDetailList2 = []
                            this.detailLoading2 = false
                        }
                    }
                })
            }
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
        //修改删除单条数据
        handleUpDeldate(val){
            this.tempUpList1.splice(val,1);
            let authPositivNegativListDtos={
                invalidFlag:'1',
                listProject1: val.listProject1,
                listProject2: val.listProject2,
                listProject3: val.listProject3,
                listProject4: val.listProject4,
                listProject5: val.listProject5,
                listProject6: val.listProject6,
                listProject7: val.listProject7,
                listProject8: val.listProject8,
                listProject9: val.listProject9,
                listProject10: val.listProject10,
                listSerialNumbr: val.listSerialNumbr,
                id: val.id,
            }
            delete val.invalidFlag,
            delete val.listProject1,
            delete val.listProject2,
            delete val.listProject3,
            delete val.listProject4,
            delete val.listProject5,
            delete val.listProject6,
            delete val.listProject7,
            delete val.listProject8,
            delete val.listProject9,
            delete val.listProject10,
            delete val.listSerialNumbr,
            val.authPositivNegativListDtos = authPositivNegativListDtos
            if(val.differentType =='0' || val.differentType=='1' || val.differentType=='4'){
                this.post('/beta/betaService/AUS.PM.02.0203', val, (res) => {
                    if (res.returnCode == '000000') {
                         this.dialogFormVisibleUp = false
                        this.$notify({
                            title: 'Success',
                            message: '删除成功',
                            type: 'success',
                            duration: 2000
                        }) 
                        this.getList()
                        this.tempUp = {}
                    }
                })
            }else if(val.differentType =='2'){
                val.authDataSynFlag ='1';
                val.externalIdentificationNo = '';
                this.post('/beta/betaService/AUS.PM.02.0203', val, (res) => {
                    if (res.returnCode == '000000') {
                         this.dialogFormVisibleUp = false
                        this.$notify({
                            title: 'Success',
                            message: '删除成功',
                            type: 'success',
                            duration: 2000
                        }) 
                        this.getList()
                        this.tempUp = {}
                    }
                })
            }else if( val.differentType=='3' ){
                val.authDataSynFlag ='1';
                val.idType = "";
                val.idNumber = "";
                this.post('/beta/betaService/AUS.PM.02.0203', val, (res) => {
                    if (res.returnCode == '000000') {
                        this.dialogFormVisibleUp = false
                        this.$notify({
                            title: 'Success',
                            message: '删除成功',
                            type: 'success',
                            duration: 2000
                        }) 
                        this.getList()
                        this.tempUp = {}
                    }
                })
            }
            
        },
        //删除全部数据
        allUpDeldate(){
            delete  this.tempUp.invalidFlag,
            delete  this.tempUp.listProject1,
            delete  this.tempUp.listProject2,
            delete  this.tempUp.listProject3,
            delete  this.tempUp.listProject4,
            delete  this.tempUp.listProject5,
            delete  this.tempUp.listProject6,
            delete  this.tempUp.listProject7,
            delete  this.tempUp.listProject8,
            delete  this.tempUp.listProject9,
            delete  this.tempUp.listProject10,
            delete  this.tempUp.listSerialNumbr,
            this.tempUp.invalidFlag = "1";
           
            if(this.tempUp.differentType =='0' || this.tempUp.differentType=='1' || this.tempUp.differentType=='4'){
                this.post('/beta/betaService/AUS.PM.02.0203', this.tempUp, (res) => {
                    if (res.returnCode == '000000') {
                         this.dialogFormVisibleUp = false
                        this.$notify({
                            title: 'Success',
                            message: '删除成功',
                            type: 'success',
                            duration: 2000
                        }) 
                        this.getList()
                        this.tempUp = {}
                    }
                })
            }else if(this.tempUp.differentType =='2'){
                this.tempUp.authDataSynFlag ='1';
                this.tempUp.externalIdentificationNo = '';
                this.post('/beta/betaService/AUS.PM.02.0203', this.tempUp, (res) => {
                    if (res.returnCode == '000000') {
                        this.dialogFormVisibleUp = false
                        this.$notify({
                            title: 'Success',
                            message: '删除成功',
                            type: 'success',
                            duration: 2000
                        }) 
                        this.getList()
                        this.tempUp = {}
                    }
                })
            }else if(this.tempUp.differentType=='3' ){
                this.tempUp.authDataSynFlag ='1';
                this.tempUp.idType = "";
                this.tempUp.idNumber = "";
                this.post('/beta/betaService/AUS.PM.02.0203', this.tempUp, (res) => {
                    if (res.returnCode == '000000') {
                        this.dialogFormVisibleUp = false
                        this.$notify({
                            title: 'Success',
                            message: '删除成功',
                            type: 'success',
                            duration: 2000
                        }) 
                        this.getList()
                        this.tempUp = {}
                    }
                })
            }
        },
        //修改列表数据
        getUpInfo() {
            let itemUpList = {
                authDataSynFlag: "1",
                differentType: this.tempUp.differentType,
                flag: false,
                listCode: this.tempUp.listCode,
                listTyp: this.tempUp.listTyp,
                isTrans: true,//是否需要翻译数据字典
                transParams : ['dic_differentType','dic_listTypeFive'],//查找数据字典所需参数
                transDict : ['differentType','listTyp'],//翻译前后key
            }
            itemUpList = Object.assign (itemUpList, this.queryForm)
            if(itemUpList.differentType=='4' || itemUpList.differentType=='0' || itemUpList.differentType=='1'){
                this.getTableList('/beta/betaService/AUS.PM.02.0202', itemUpList ,(res) => {
                    if (res.returnCode == '000000') {
                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
//                          this.tempUp = res.returnData.rows[0]
                            //console.log(this.tempUp)
                            this.tempUpList1 = res.returnData.rows
                            
                        }else{ 
                        	this.tempUpList1 = []
                        }
                    }
                })
            }else if(itemUpList.differentType=='2' || itemUpList.differentType=='3'){
                this.getTableList('/authService/AUS.PM.02.0207', itemUpList ,(res) => {
                        if (res.returnCode == '000000') {
                            if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                                this.tempUpList1 = res.returnData.rows
                            }else{
                            	this.tempUpList1 = []
                            }
                        }
                })
            }
        },
        //确认提交修改数据
        submitUpInfo() {
            let  authPositivNegativListDtos = []
            if(!this.itemUpList){
                this.tempUp.authPositivNegativListDtos = []
            }else{
                this.tempUp.authPositivNegativListDtos=this.itemUpList
            }
            this.tempUp.authDataSynFlag='1'
            this.tempUp.listTyp = this.tempUp.listTypDesc;
            this.tempUp = Object.assign (this.tempUp, this.queryForm)
            if(this.tempUp.differentType=='4' || this.tempUp.differentType=='0' || this.tempUp.differentType=='1'){
                delete this.tempUp.authDataSynFlag
                this.post('/beta/betaService/AUS.PM.02.0203', this.tempUp, (rrs) => {
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
            }else if(this.tempUp.differentType=='2' || this.tempUp.differentType=='3'){
                this.post('/auth/authService/AUS.PM.02.0208', this.tempUp, (res) => {
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

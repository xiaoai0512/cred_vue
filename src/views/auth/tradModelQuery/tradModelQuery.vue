<!-- 交易场景 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="运营模式" prop="operationMode" >
                <el-select v-model="queryFormObj.operationMode" class="wd200" @change="getOrganNoChange" clearable>
                <el-option
                    v-for="(item, index ) in operationModeOptions"
                    :key="index"
                    :label="item.modeName"
                    :value="item.operationMode"/>
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="交易场景" prop="transSceneCode">
                <el-input v-model="queryFormObj.transSceneCode" class="wd200" type="text" />
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" v-show="selBtnFlag">查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate" v-show="addBtnFlag">新增</el-button>
            </div>
        </el-form>
        <div v-if="showList">
            <el-table v-loading = "listLoading1" :data="tableList1" border stripe style="width: 100%">
                <el-table-column prop="organNo" label="序号" width="180" align="center"
                    type="index">
                </el-table-column>
                <el-table-column prop="organName" label="运营模式" width="180" align="center">
                    <template slot-scope="scope">
                        <span class="">{{scope.row.modeName}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="upperOrganNo" label="交易场景" align="center">
                    <template slot-scope="scope">
                        <span class="">{{scope.row.transSceneCode}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="transSceneDesc" label="描述" align="center">
                    <template slot-scope="scope">
                        <span class="">{{scope.row.transSceneDesc}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="applicationRangeDesc" label="应用范围" align="center">
                    <template slot-scope="scope">
                        <span class="">{{scope.row.applicationRangeDesc}}</span>
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作">
                    <template slot-scope="scope">
                        <el-button size="mini" icon="el-icon-more" type="primary" @click="handleDetail(scope.row)" v-show="scope.row.transSceneCode != 'NORM' && selBtnFlag">详情</el-button>
                        <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleUpdate(scope.row)" v-show="scope.row.transSceneCode != 'NORM' &&  updBtnFlag">修改</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="tableTotal1>0" class="page-name" :total="tableTotal1" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
        </div>
        <!-- 新增 -->
        <el-dialog title="交易场景新增" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd" >
               <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
                   :rules="[ { required: true, message: '运营模式不能为空'}]">
                    <el-select v-model="tempAdd.operationMode" class="wd200" clearable placeholder="请选择">
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="交易场景" prop="transSceneCode"
                     :rules="[ { required: true, message: '交易场景不能为空'}]" >
                    <el-input v-model="tempAdd.transSceneCode" class="wd200" type="text" max-length="4" />
                </el-form-item>
                <el-form-item class="cl_td" label="应用范围" prop="applicationRange" 
                    :rules="[ { required: true, message: '应用规范不能为空'}]">
                    <el-select v-model="tempAdd.applicationRange" class="wd200" clearable placeholder="请选择">
                    <el-option
                        v-for="(item, index ) in applicationRangeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="transSceneDesc" :rules="[ { required: true, message: '描述不能为空'}]">
                    <el-input v-model="tempAdd.transSceneDesc" class="wd200" type="text" />
                </el-form-item>
            </el-form>
            <div>详细信息</div>
            <div class="cl_tr text_center" >
                <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleAddDetails" style="float: right;">新增</el-button>
            </div>
            <el-table :data=" dateAmount"  border stripe style="width: 100%"
                :row-class-name="rowClassName">
                <el-table-column label="序号" align="center" type="index" prop="xh" width="50"></el-table-column>
                <el-table-column label="卡组标识" align="center">
                    <template slot-scope="scope">
                        <el-select clearable 
                            @change="changezdts(scope.row)"
                            v-model="dateAmount[scope.row.xh-1].cardAssociations">
                            <el-option
                                v-for="(item, index ) in cardAssociationsOptions"
                                :key="index"
                                :label="item.detailDesc" 
                                :value="item.codes"/>
                        </el-select>
                    </template>
                </el-table-column> 
                <el-table-column label="识别进度1" align="center">
                    <template slot-scope="scope">
                        <el-select clearable
                            @change="changezdts(scope.row)"
                            v-model="dateAmount[scope.row.xh-1].field1"
                            >
                            <el-option
                                v-for="(item, index ) in field1Options"
                                :key="index"
                                :label="item.detailDesc" 
                                :value="item.codes"/>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="关系" align="center">
                    <template slot-scope="scope">
                        <el-select clearable 
                            @change="changezdts(scope.row)"
                            v-model="dateAmount[scope.row.xh-1].relative1"
                            >
                            <el-option
                                v-for="(item, index ) in relative1Options"
                                :key="index"
                                :label="item.detailDesc" 
                                :value="item.codes"/>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="取值1" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="dateAmount[scope.row.xh-1].field1Value"  type="text" />
                    </template>
                </el-table-column>
                <el-table-column label="识别维度2" align="center">
                     <template slot-scope="scope">
                        <el-select clearable @change="changezdts(scope.row)"
                            v-model="dateAmount[scope.row.xh-1].field2">
                            <el-option
                                v-for="(item, index ) in field2Options"
                                :key="index"
                                :label="item.detailDesc" 
                                :value="item.codes"/>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="关系" align="center">
                     <template slot-scope="scope">
                        <el-select clearable @change="changezdts(scope.row)"
                            v-model="dateAmount[scope.row.xh-1].relative2">
                            <el-option
                                v-for="(item, index ) in relative2Options"
                                :key="index"
                                :label="item.detailDesc" 
                                :value="item.codes"/>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="取值2" align="center">
                    <template slot-scope="scope">
                    
                        <el-input v-model="dateAmount[scope.row.xh-1].field2Value" type="text" />
                    
                    </template>
                    
                </el-table-column>
                <el-table-column label="操作" align="center">
                     <template slot-scope="scope">
                        <el-button size="mini" icon="el-icon-delete" type="primary" @click="handleDeleteDetails(scope.row,scope.$index)">删除</el-button>
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
            <el-form ref="dataFormDetail" :rules="rulesDetail" :model="tempDetail" >
               <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
                   :rules="[ { required: true, message: '运营模式不能为空'}]">
                    <el-select v-model="tempDetail.operationMode" class="wd200" readonly disabled>
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="交易场景" prop="transSceneCode"
                     :rules="[ { required: true, message: '交易场景不能为空'}]" >
                    <el-input v-model="tempDetail.transSceneCode" class="wd200" type="text"  readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="应用范围" prop="applicationRange" 
                    :rules="[ { required: true, message: '应用规范不能为空'}]">
                    <el-select v-model="tempDetail.applicationRange" class="wd200" readonly disabled>
                    <el-option
                        v-for="(item, index ) in applicationRangeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="transSceneDesc" :rules="[ { required: true, message: '描述不能为空'}]">
                    <el-input v-model="tempDetail.transSceneDesc" class="wd200" type="text" readonly/>
                </el-form-item>
            </el-form>
            <div>详细信息</div>
                <el-table :data="dateAmountDetail"  border stripe 
                    v-loading = "listLoading2"
                    class="mbtm20"
                    fit
                    highlight-current-row
                    style="width: 100%;">
                    <el-table-column label="序号" align="center" type="index" prop="xh" width="50"></el-table-column>
                    <el-table-column prop="cardAssociationsDesc" label="卡组标识" align="center" />
                    <el-table-column prop="field1Desc" label="识别维度1" align="center" />
                     <el-table-column prop="relative1Desc" label="关系" align="center" />
                    <el-table-column prop="field1Value" label="取值1" align="center" />
                    <el-table-column prop="field2Desc" label="识别维度2" align="center" />
                    <el-table-column prop="relative2Desc" label="关系" align="center" />
                    <el-table-column prop="field2Value" label="取值2" align="center" />
                </el-table>
                <pagination v-show="tableTotal2>0" :total="tableTotal2" :page.sync="tempDetailPage.pageNum" :limit.sync="tempDetailPage.pageSize" @pagination="getDetailList" />
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleDetail = false">取消</el-button>
            </div>
        </el-dialog> 
        <!-- 修改 -->
        <el-dialog title="交易场景维护" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp" >
               <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
                   :rules="[ { required: true, message: '运营模式不能为空'}]">
                    <el-select v-model="tempUp.operationMode" class="wd200" readonly disabled>
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="交易场景" prop="transSceneCode"
                     :rules="[ { required: true, message: '交易场景不能为空'}]" >
                    <el-input v-model="tempUp.transSceneCode" class="wd200" type="text"  readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="应用范围" prop="applicationRange" 
                    :rules="[ { required: true, message: '应用范围不能为空'}]">
                    <el-select v-model="tempUp.applicationRange" class="wd200" >
                    <el-option
                        v-for="(item, index ) in applicationRangeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="transSceneDesc" :rules="[ { required: true, message: '描述不能为空'}]">
                    <el-input v-model="tempUp.transSceneDesc" class="wd200" type="text" />
                </el-form-item>
            </el-form>
            <div>详细信息</div>
            <div class="cl_tr text_center" >
                <el-button type="primary" icon="el-icon-delete" size="mini" @click="handleDelAll" style="float: right;">全部删除</el-button>
                <el-button type="primary" icon="el-icon-plus" size="mini" @click="handleUpDetails" style="float: right;margin-right:5px">新增</el-button>
            </div>
            <el-table :data="dateAmountUp"  border stripe style="width: 100%"
                :row-class-name="upRowClassName">
                <el-table-column label="序号" align="center" type="index" prop="xh" width="50"></el-table-column>
                <el-table-column label="卡组标识" align="center">
                    <template slot-scope="scope">
                        <el-select clearable 
                            @change="up_changezdts(scope.row)"
                            v-model="dateAmountUp[scope.row.xh-1].cardAssociations">
                            <el-option
                                v-for="(item, index ) in cardAssociationsOptions"
                                :key="index"
                                :label="item.detailDesc" 
                                :value="item.codes"/>
                        </el-select>
                    </template>
                </el-table-column> 
                <el-table-column label="识别进度1" align="center">
                    <template slot-scope="scope">
                        <el-select clearable
                            @change="up_changezdts(scope.row)"
                            v-model="dateAmountUp[scope.row.xh-1].field1"
                            >
                            <el-option
                                v-for="(item, index ) in field1Options"
                                :key="index"
                                :label="item.detailDesc" 
                                :value="item.codes"/>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="关系" align="center">
                    <template slot-scope="scope">
                        <el-select clearable 
                            @change="up_changezdts(scope.row)"
                            v-model="dateAmountUp[scope.row.xh-1].relative1"
                            >
                            <el-option
                                v-for="(item, index ) in relative1Options"
                                :key="index"
                                :label="item.detailDesc" 
                                :value="item.codes"/>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="取值1" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="dateAmountUp[scope.row.xh-1].field1Value"  type="text" />
                    </template>
                </el-table-column>
                <el-table-column label="识别维度2" align="center">
                     <template slot-scope="scope">
                        <el-select clearable @change="up_changezdts(scope.row)"
                            v-model="dateAmountUp[scope.row.xh-1].field2">
                            <el-option
                                v-for="(item, index ) in field2Options"
                                :key="index"
                                :label="item.detailDesc" 
                                :value="item.codes"/>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="关系" align="center">
                     <template slot-scope="scope">
                        <el-select clearable @change="up_changezdts(scope.row)"
                            v-model="dateAmountUp[scope.row.xh-1].relative2">
                            <el-option
                                v-for="(item, index ) in relative2Options"
                                :key="index"
                                :label="item.detailDesc" 
                                :value="item.codes"/>
                        </el-select>
                    </template>
                </el-table-column>
                <el-table-column label="取值2" align="center">
                    <template slot-scope="scope">
                        <el-input v-model="dateAmountUp[scope.row.xh-1].field2Value" type="text" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" align="center">
                     <template slot-scope="scope">
                        <el-button size="mini" icon="el-icon-delete" type="primary" @click="handleDeleteUp(scope.row,scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleUp = false">取消</el-button>
                <el-button type="primary" @click="updateData()"> 确定</el-button>
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
        listLoading1: false,
        queryFormRef: {},
        queryFormRules: {},      
        tableList1: [],
        tableTotal1: 0,
        // 下拉框
        operationModeOptions: [], //运营模式
        applicationRangeOptions: [],//应用范围
        cardAssociationsOptions: [],//卡组标识
        field1Options:[],//识别维度1
        relative1Options:[],//关系1
        field2Options:[],//识别维度2
        relative3Options:[],//关系2
        /*----新增----*/
        tempAdd: {}, // 新增
        rulesAdd: {}, 
        listLoading2: false,
        tableList2: [],
        dateAmount:[],//新增一行
        dialogFormVisibleAdd: false,
        objItem:{},
        /*----修改----*/
        dialogFormVisibleUp: false,
        tempUp: {}, // 修改
        dateAmountUp: [],//修改详细信息
        rulesUp: {},
        dataFormUp:{},
        /*----详情----*/
        dialogFormVisibleDetail: false,
        tempDetail: {}, // 修改
        dateAmountDetail: [],//修改详细信息
        tableTotal2:0,
        listLoading2: false,
        rulesDetail: {},
        tempDetailPage: {
            pageNum: 1,
            pageSize:10,
        },
        
        }
    },
   
    created() {
        let logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))
        this.operationMode = logininfo.operationMode
        this.getBtnAuth()
    },
    mounted() {
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
        //卡组标识
        this.getSelectDict( "dic_recordType").then(res => {
            this.cardAssociationsOptions = res
        })
        //识别维度1
        this.getSelectDict( "dic_dimensionalType").then(res => {
            this.field1Options = res
        })
        //关系1
        this.getSelectDict( "dic_relative").then(res => {
            this.relative1Options = res
        })
        //识别维度2
        this.getSelectDict( "dic_dimensionalType").then(res => {
            this.field2Options = res
        })
        //关系2
        this.getSelectDict( "dic_relative").then(res => {
            this.relative2Options = res
        })
         
    },
    methods: {
       //机构层级关联上层机构号
        getOrganNoChange() {
            // this.queryFormObj.productObjectCode = ''
           /* this.businessQuery()*/
            this.upperOrganNoQuery()
        },
        //上层机构号
        upperOrganNoQuery(){
            let obj = {
                organLevel: this.tempAdd.organLevel 
            }
            this.post( "/beta/betaService/COS.IQ.02.0005", obj ,(res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        let rowss = res.returnData.rows
                        this.upperOrganNoAdd=rowss[0].organNo
                        this.corporationEntityNoAdd=rowss[0].corporationEntityNo
                        rowss.forEach(item => {
                            item.label = item.upperOrganNo+ ' '+ item.organName
                        })
                        this.upperOrganNoOptions = rowss
                    } else {
                        this.upperOrganNoOptions = []
                    }
                }
            })
        },
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
                    if (this.btnAuthStr.includes('AUS.PM.01.0202')) { // 查询
                        this.selBtnFlag = true
                    } else {
                        this.selBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('AUS.PM.01.0201')) { // 新增
                        this.addBtnFlag = true
                    } else {
                        this.addBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('AUS.PM.01.0203')) { // 维护
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
        this.showList=true
        this.getList()
    },
    // 列表
    getList() {
        this.listLoading1 = true
        this.queryFormObj.operationMode = this.operationMode
        this.queryFormObj.authDataSynFlag = '1'
        this.queryFormObj.isTrans = true
        this.queryFormObj.transParams = ['dic_applictionrange']
        this.queryFormObj.transDict = ['applicationRange']
        this.getTableList('/beta/betaService/AUS.PM.01.0202', this.queryFormObj ,(res) => {
            if (res.returnCode == '000000') {
            	this.listLoading1 = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.tableList1 = res.returnData.rows
                    this.tableTotal1 = res.returnData.totalCount
                    
               	}else{
               		this.tableList1 = []
                    this.tableTotal1 = 0
               	}
            }
        }, (err) => {
        	this.tableList1 = []
            this.tableTotal1 = 0
            this.listLoading1 = false
        })

    },
   //显示新增弹框
    handleCreate() {
        this.dialogFormVisibleAdd = true
        this.$nextTick(() => {
        this.$refs['dataFormAdd'].clearValidate()
      })
    }, 
    //新增交易模式信息
    rowClassName({ row, rowIndex }) {
        row.xh = rowIndex + 1;
    },
    changezdts(row) {
        this.$forceUpdate()
        //console.log(row)
    },
    handleAddDetails() {
        let obj = {
            cardAssociations: '',
            field1: '',
            relative1: '',
            field1Value : '',
            field2: '',
            relative2: '',
            field2Value : '',
        };
        this.dateAmount.push(obj);
    },
    // 交易模式信息删除
    handleDeleteDetails(row,index) {
        this.$confirm('是否继续删除该条记录?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            this.dateAmount.splice(index, 1);
            this.$message({
                type: 'success',
                message: '删除成功!'
            });
        }).catch(() => {});
    },
    //确认提交新增数据
    createData() {
        let objItem={}
        let x7220list=[]
        for(let item of this.dateAmount){
            delete  item.xh
            if(item.field2 == "null"){
                item.field2 ="";
            }
            if(item.field1 == ''|| item.field1 == null || item.field1 == undefined) {
                this.$message({
                    title: '提示',
                    message: '识别维度一必须选择',
                    type: 'warning',
                    duration: 2000
                })
                return
            }
            if(item.field1Value == ''|| item.field1Value == null) {
                this.$message({
                    title: '提示',
                    message: '维度一取值必须有',
                    type: 'warning',
                    duration: 2000
                })
                return;
            }
            if(item.field1 == item.field2) {
                this.$message({
                    title: '提示',
                    message: '识别维度一和识别维度二不能一致',
                    type: 'warning',
                    duration: 2000
                })
                return;
            }
            if(item.field2) {
                if (item.field2Value == '' || item.field2Value == null || item.field2Value == undefined) {
                    this.$message({
                        title: '提示',
                        message: '识别维度二有值,识别维度二必须有值',
                        type: 'warning',
                        duration: 2000
                    })
                    return;
                }	
            }
        }
        this.tempAdd.authDataSynFlag='1'
        objItem =this.tempAdd
        objItem.x7220list = this.dateAmount
        this.$refs['dataFormAdd'].validate((valid) => {
        if (valid) {
            this.post('/beta/betaService/AUS.PM.01.0201', objItem, (res) => {
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
    //显示详情弹框
    handleDetail(row) {
        this.dialogFormVisibleDetail = true
        this.tempDetail = Object.assign({}, row) // 
        this.getDetailList()
        this.$nextTick(() => {
        this.$refs['dataFormDetail'].clearValidate()
      })
    },
    getDetailList() {
        this.listLoading2 = true
        this.dialogFormVisibleDetail= true
        //let objDetail = {}
        let objDetail={
            isTrans: true,
            transParams:['dic_recordType','dic_dimensionalType','dic_relative','dic_dimensionalType','dic_relative'],
            transDict : ['cardAssociations','field1','relative1','field2','relative2'],
        }
        objDetail.transSceneCode = this.tempDetail.transSceneCode
        objDetail.operationMode = this.tempDetail.operationMode
        objDetail.transSceneDesc = this.tempDetail.transSceneDesc
        objDetail.authDataSynFlag = '1'
        objDetail.pageNum = this.queryFormObj.pageNum
        objDetail.pageSize = this.queryFormObj.pageSize
        this.getTableList('/beta/betaService/AUS.PM.01.0202', objDetail ,(res) => {
            if (res.returnCode == '000000') {
                this.listLoading2 = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                   // this.tempDetail = res.returnData.rows
                    this.dateAmountDetail = res.returnData.rows
                    this.tableTotal2 = res.returnData.totalCount
                }else {
                	this.dateAmountDetail = []
                    this.tableTotal2 = 0
                }
            }
        }, (err) => {
        	this.dateAmountDetail = []
            this.tableTotal2 = 0
            this.listLoading2 = false
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
    handleUpDetails() {
        let obj = {
            cardAssociations: '',
            field1: '',
            relative1: '',
            field1Value : '',
            field2: '',
            relative2: '',
            field2Value : '',
        };
        this.dateAmountUp.push(obj);
    },
    //修改交易模式信息
    upRowClassName({ row, rowIndex }) {
        row.xh = rowIndex + 1;
    },
    up_changezdts(row) {
        //console.log(row)
    },
    
    //修改详细信息列表
    getUpList() {
        this.dialogFormVisibleUp= true
        let obj = {}
        obj.transSceneCode = this.tempUp.transSceneCode
        obj.operationMode = this.tempUp.operationMode
        this.getTableList('/beta/betaService/AUS.PM.01.0202', obj ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    //this.tempUp = res.returnData.rows
                    this.dateAmountUp = res.returnData.rows
                    
                }else {
                	this.dateAmountUp = []
                }
            }
        })
    },
     // 交易模式信息删除
    handleDeleteUp(row,index) {
        this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            let delRow = row
        let deleteObjUp={
            authDataSynFlag:  1,
            operationMode: row.operationMode,
            transSceneCode: row.transSceneCode,
            transSceneDesc: row.transSceneCode,
            id: row.id,
        }
        deleteObjUp.x7220list = []
       
        let obj={
            cardAssociations: delRow.cardAssociations,
            field1: delRow.field1,
            field1Value: delRow.field1Value,
            field2: delRow.field2,
            field2Value: delRow.field2Value,
            id: delRow.id,
            invalidFlag: "1",
            relative1: delRow.relative1,
            relative2: delRow.relative2,
        }
        deleteObjUp.x7220list.push(obj)
        this.post('/beta/betaService/AUS.PM.01.0203', deleteObjUp, (res) => {
            if (res.returnCode == '000000') {
                this.dateAmountUp.splice(index,1)
                this.$notify({
                  message: '删除成功',
                  type: 'success',
                })
            }
        })
        }).catch(() => {});
    },
    //提交修改数据
    updateData() {
        let objItemUp={}
        let x7220list=[]
        for(let item of this.dateAmountUp){
            delete  item.xh
            if(item.field2 == "null"){
                item.field2 ="";
            }
            if(item.field1 == ''|| item.field1 == null || item.field1 == undefined) {
                this.$message({
                    title: '提示',
                    message: '识别维度一必须选择',
                    type: 'warning',
                    duration: 2000
                })
                return
            }
            if(item.field1Value == ''|| item.field1Value == null) {
                this.$message({
                    title: '提示',
                    message: '维度一取值必须有',
                    type: 'warning',
                    duration: 2000
                })
                return;
            }
            if(item.field1 == item.field2) {
                this.$message({
                    title: '提示',
                    message: '识别维度一和识别维度二不能一致',
                    type: 'warning',
                    duration: 2000
                })
                return;
            }
            if(item.field2) {
                if (item.field2Value == '' || item.field2Value == null || item.field2Value == undefined) {
                    this.$message({
                        title: '提示',
                        message: '识别维度二有值,识别维度二必须有值',
                        type: 'warning',
                        duration: 2000
                    })
                    return;
                }	
            }
        }
        this.$refs['dataFormUp'].validate((valid) => {
            if (valid) {
                let params ={
                    authDataSynFlag:  1,
                    x7220list:  this.dateAmountUp
                }
                params = Object.assign ( params, this.tempUp )
                this.post('/beta/betaService/AUS.PM.01.0203', params, (res) => {
                    if (res.returnCode == '000000') {
                        this.$notify({
                            title: 'Success',
                        message: '修改成功',
                        type: 'success',
                        duration: 2000
                        })
                        this.dialogFormVisibleUp = false
                        this.getList()
                        this.tempUp  = {}
                    }
                })
            }
        })
    },
    // 全部删除
    handleDelAll(){
        this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
            console.log();
            const delAllParam = {};
            delAllParam.operationMode = this.tempUp.operationMode;
            delAllParam.transSceneCode = this.tempUp.transSceneCode;
            delAllParam.transSceneDesc = this.tempUp.transSceneDesc;
            delAllParam.invalidFlag = "1";
            delAllParam.authDataSynFlag = "1";
            this.post('/beta/betaService/AUS.PM.01.0203', delAllParam, (res) => {
                if (res.returnCode == '000000') {
                      this.$message({
                        type: 'success',
                        message: '删除成功!'
                    });
                    this.dialogFormVisibleUp = false
                    this.getList()
                }
            })
        }).catch(() => {});
    },
    
  }
}
</script>

<style>
</style>

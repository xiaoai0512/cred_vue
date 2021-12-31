<!-- 外部响应码 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="运营模式" prop="operationMode" >
                <el-select v-model="queryFormObj.operationMode" class="wd200" placeholder="请选择" clearable>
                <el-option
                    v-for="(item, index ) in operationModeOptions"
                    :key="index"
                    :label="item.modeName"
                    :value="item.operationMode"/>
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="卡组织标识" prop="cardAssociations">
                <el-select v-model="queryFormObj.cardAssociations" class="wd200" placeholder="请选择" clearable>
                <el-option
                    v-for="(item, index ) in cardAssociationsOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.codes"/>
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="授权响应码" prop="externalResponseCode">
                <el-input v-model="queryFormObj.externalResponseCode" class="wd200" type="text"/>
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" >查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate" v-if="addBtnFlag">新增</el-button>
            </div>
        </el-form>
        <div v-if="showList">
            <el-table v-loading = "listLoading1" :data="tableList1" border stripe style="width: 100%">
                <el-table-column prop="organNo" label="序号" align="center"
                    type="index">
                </el-table-column>
                <el-table-column prop="operationMode" label="运营模式" align="center"/>
                 <el-table-column prop="cardAssociations" label="卡组织标识" align="center"/>
                <el-table-column prop="externalResponseCode" label="授权响应码" align="center"/>
                <el-table-column prop="priority" label="优先级" align="center"/>
                 <el-table-column prop="responseDesc" label="描述" align="center"/>
                <el-table-column align="center" label="操作" width="280">
                    <template slot-scope="scope">
                        <el-button size="mini" icon="el-icon-info" type="primary" @click="handleDetail(scope.row)" v-if="selBtnFlag">详情</el-button>
                        <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleUpdate(scope.row)" v-if="updBtnFlag">修改</el-button>
                        <el-button size="mini" icon="el-icon-delete" type="primary" @click="handleDeldate(scope.row)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="tableTotal1>0" class="page-name" :total="tableTotal1" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
        </div>
        <!-- 新增 -->
        <el-dialog title="授权响应码新增" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd" >
               <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
                   :rules="[ { required: true, message: '运营模式不能为空'}]">
                    <el-select v-model="tempAdd.operationMode" class="wd200" placeholder="请选择">
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="卡组织标识" prop="cardAssociations" 
                    :rules="[ { required: true, message: '卡组织标识不能为空'}]">
                    <el-select v-model="tempAdd.cardAssociations" class="wd200" placeholder="请选择">
                    <el-option
                        v-for="(item, index ) in cardAssociationsOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="授权响应码" prop="externalResponseCode"
                     :rules="[ { required: true, message: '授权响应码不能为空'}]" >
                    <el-input v-model="tempAdd.externalResponseCode" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="优先级" prop="priority" 
                    :rules="[ { required: true, message: '优先级不能为空'}]">
                    <el-input v-model="tempAdd.priority" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="responseDesc" 
                    :rules="[ { required: true, message: '描述不能为空'}]">
                    <el-input v-model="tempAdd.responseDesc" class="wd200" type="text" />
                </el-form-item>
            </el-form>
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
                    <el-select v-model="tempDetail.operationMode" class="wd200" placeholder="请选择" clearable disabled>
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="卡组织标识" prop="cardAssociations" 
                    :rules="[ { required: true, message: '卡组织标识不能为空'}]">
                    <el-select v-model="tempDetail.cardAssociations" class="wd200" placeholder="请选择" clearable disabled>
                    <el-option
                        v-for="(item, index ) in cardAssociationsOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="授权响应码" prop="externalResponseCode"
                     :rules="[ { required: true, message: '授权响应码不能为空'}]" >
                    <el-input v-model="tempDetail.externalResponseCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="优先级" prop="priority" 
                    :rules="[ { required: true, message: '优先级不能为空'}]">
                    <el-input v-model="tempDetail.priority" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="responseDesc" 
                    :rules="[ { required: true, message: '描述不能为空'}]">
                    <el-input v-model="tempDetail.responseDesc" class="wd200" type="text" readonly/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleDetail = false">取消</el-button>
            </div>
        </el-dialog> 
        <!-- 修改 -->
        <el-dialog title="维护信息" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp" >
                <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
                   :rules="[ { required: true, message: '运营模式不能为空'}]">
                    <el-select v-model="tempUp.operationMode" class="wd200" placeholder="请选择" clearable disabled>
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="卡组织标识" prop="cardAssociations" 
                    :rules="[ { required: true, message: '卡组织标识不能为空'}]">
                    <el-select v-model="tempUp.cardAssociations" class="wd200" placeholder="请选择" clearable disabled>
                    <el-option
                        v-for="(item, index ) in cardAssociationsOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="授权响应码" prop="externalResponseCode"
                     :rules="[ { required: true, message: '授权响应码不能为空'}]" >
                    <el-input v-model="tempUp.externalResponseCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="优先级" prop="priority" 
                    :rules="[ { required: true, message: '优先级不能为空'}]">
                    <el-input v-model="tempUp.priority" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="responseDesc" 
                    :rules="[ { required: true, message: '描述不能为空'}]">
                    <el-input v-model="tempUp.responseDesc" class="wd200" type="text" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateData()">确认</el-button>
                <el-button type="primary" @click="dialogFormVisibleUp = false">取消</el-button>
            </div>
        </el-dialog> 
        <!--删除-->
        <el-dialog title="删除确认信息" :visible.sync="dialogFormVisibleDel" width="65%">
            <el-form ref="dataFormDel" :rules="rulesDel" :model="tempDel" >
                <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
                   :rules="[ { required: true, message: '运营模式不能为空'}]">
                    <el-select v-model="tempDel.operationMode" class="wd200" placeholder="请选择" clearable disabled>
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="卡组织标识" prop="cardAssociations" 
                    :rules="[ { required: true, message: '卡组织标识不能为空'}]">
                    <el-select v-model="tempDel.cardAssociations" class="wd200" placeholder="请选择" clearable disabled>
                    <el-option
                        v-for="(item, index ) in cardAssociationsOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="授权响应码" prop="externalResponseCode"
                     :rules="[ { required: true, message: '授权响应码不能为空'}]" >
                    <el-input v-model="tempDel.externalResponseCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="优先级" prop="priority" 
                    :rules="[ { required: true, message: '优先级不能为空'}]">
                    <el-input v-model="tempDel.priority" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="responseDesc" 
                    :rules="[ { required: true, message: '描述不能为空'}]">
                    <el-input v-model="tempDel.responseDesc" class="wd200" type="text" readonly/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleDel = false">取消</el-button>
                <el-button type="primary" @click="delDateData()">确认删除信息</el-button>
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
            /*----新增----*/
            tempAdd: {}, // 新增
            rulesAdd: {}, 
            dialogFormVisibleAdd: false,
            /*----修改----*/
            dialogFormVisibleUp: false,
            tempUp: {}, // 修改
            rulesUp: {},
            dataFormUp:{},
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
                        if (this.eventList.includes('AUS.PM.01.0011') != -1) { // 查询
                            this.selBtnFlag = true
                        } else {
                            this.selBtnFlag = false
                        }
                        if (this.eventList.includes('AUS.PM.01.0012') != -1) { // 新增
                            this.addBtnFlag = true
                        } else {
                            this.addBtnFlag = false
                        }
                        if (this.eventList.includes('AUS.PM.01.0013') != -1) { // 维护
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
            this.listLoading1 = true
            this.queryFormObj.operationMode = this.operationMode
            this.queryFormObj.authDataSynFlag = '1'
            this.getTableList('/beta/betaService/AUS.PM.01.0011', this.queryFormObj ,(res) => {
                if (res.returnCode == '000000') {
                    this.listLoading1 = false
                	if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.tableList1 = res.returnData.rows
                        this.tableTotal1 = res.returnData.totalCount
					}else {
                    	this.tableList1 =[]
                        this.tableTotal1 = 0
                    }
                }
            }, (err) => {
            	this.tableList1 =[]
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
        //确认提交新增数据
        createData() {
            this.tempAdd.authDataSynFlag='1'
            this.$refs['dataFormAdd'].validate((valid) => {
            if (valid) {
                this.post('/beta/betaService/AUS.PM.01.0014', this.tempAdd, (res) => {
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
            }
          })
        },  
    //  //新增交易模式信息
    //  rowClassName({ row, rowIndex }) {
    //      row.xh = rowIndex + 1;
    //  },
    //  changezdts(row) {
    //      //console.log(row)
    //  },
    //  // 交易模式信息删除
    //  handleDeleteDetails(row,index) {
    //      this.dateAmount.splice(index, 1);
    //  },
        //显示详情弹框
        handleDetail(row) {
            this.dialogFormVisibleDetail = true
            this.tempDetail = Object.assign({}, row) // 
            this.$nextTick(() => {
            this.$refs['dataFormDetail'].clearValidate()
          })
        },
         //显示修改弹框
        handleUpdate(row) {
            this.tempUp = Object.assign({}, row)
            this.dialogFormVisibleUp= true
            this.$nextTick(() => {
                this.$refs['dataFormUp'].clearValidate()
            })
        }, 
        //提交修改数据
        updateData() {
            this.tempUp.authDataSynFlag='1'
            delete this.tempUp.invalidFlag;
            this.$refs['dataFormUp'].validate((valid) => {
                if (valid) {
                    this.post('/beta/betaService/AUS.PM.01.0013', this.tempUp, (res) => {
                        if (res.returnCode == '000000') {
                            this.dialogFormVisibleUp = false
                            this.$notify({
                            message: '修改成功',
                            type: 'success',
                            })
                            this.handleSearch()
                             this.tempUp = {}
                        }
                    })
                }
            })
        },
        //删除
        handleDeldate(row){
            this.tempDel= Object.assign({}, row)
            this.dialogFormVisibleDel= true
            this.$nextTick(() => {
                this.$refs['dataFormDel'].clearValidate()
            })
        },
        //确认删除数据
        delDateData() {
            this.$confirm('确定要删除该信息?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => { // 是
                this.tempDel.authDataSynFlag = "1";
                this.tempDel.invalidFlag = "1";
                this.$refs['dataFormDel'].validate((valid) => {
                    if (valid) {
                        this.post('/beta/betaService/AUS.PM.01.0013', this.tempDel, (res) => {
                            if (res.returnCode == '000000') {
                                this.dialogFormVisibleDel = false
                                this.$notify({
                                message: '删除成功',
                                type: 'success',
                                })
                                this.getList()
                            }
                        })
                    }
                })
            }).catch(() => { // 否   

            });
        },
    }
}   
</script>

<style>
</style>

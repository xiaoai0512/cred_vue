<!-- 未入账交易查询 -->
<template>
    <div class="allContent">
        <!-- 表单验证demo: -->
        <el-form ref="queryRef" :model="queryForm">
            <el-form-item class="cl_td" label="运营模式" prop="operationMode">
                <el-select v-model="queryForm.operationMode" class="wd200" clearable>
                <el-option
                    v-for="(item, index ) in operationModeOptions"
                    :key="index"
                    :label="item.modeName"
                    :value="item.operationMode"/>
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="描述" prop="responseDesc">
                <el-input v-model="queryForm.responseDesc" class="wd200" type="text" />
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="getList()">查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate()">新增</el-button>
            </div>
        </el-form>
        <!--客户费用信息查询表-->
        <el-table v-loading="listLoading1" :data="tablesList" class="mbtm20 " border fit highlight-current-row style="width: 100%;" row-key="id">
            <el-table-column type="index" width="50" label="序号 " align="center"> </el-table-column>
            <el-table-column prop="operationMode" label="运营模式 " align="center"  />
            <el-table-column prop="internalResponseCode" label="授权错误码" align="center" />
            <el-table-column prop="responseDesc" label="描述" align="center"  />
            <el-table-column prop="" label="操作" align="center" >
                <template slot-scope="{row}">
                    <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleUpdate(row)">修改</el-button>
                    <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleResponse(row)">响应码</el-button>
                </template> 
            </el-table-column>
        </el-table>
        <pagination v-show="tableTotal > 0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
        <!-- 新增 -->
        <el-dialog title="授权错误码新增" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd" 
               >
                 <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
                    :rules="[ { required: true, message: '运营模式不能为空'} ]">
                    <el-select v-model="tempAdd.operationMode" class="wd200" clearable>
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="授权错误码" prop="internalResponseCode"  
                    :rules="[ { required: true, message: '授权错误码不能为空'},
                     { min: 3, max: 20, message: '长度在 3 到20 个字符', trigger: 'blur' } ]">
                    <el-input v-model="tempAdd.internalResponseCode" class="wd200" type="text"/>
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="responseDesc" 
                    :rules="[ { required: true, message: '描述不能为空'} ]">
                    <el-input v-model="tempAdd.responseDesc" class="wd200" type="text"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleAdd = false">取消 </el-button>
                <el-button type="primary" @click="createData()">确定 </el-button>
            </div>
        </el-dialog>
        <!--修改-->
        <el-dialog title="授权错误码修改" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp" 
               >
                 <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
                    :rules="[ { required: true, message: '运营模式不能为空'} ]">
                    <el-select v-model="tempUp.operationMode" class="wd200" clearable disabled>
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index+'aa'"
                        :label="item.modeName"
                        :value="item.operationMode"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="授权错误码" prop="internalResponseCode"  
                    :rules="[ { required: true, message: '授权错误码不能为空'},
                     { min: 3, max: 20, message: '长度在 3 到20 个字符', trigger: 'blur' } ]">
                    <el-input v-model="tempUp.internalResponseCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="responseDesc" 
                    :rules="[ { required: true, message: '描述不能为空'} ]">
                    <el-input v-model="tempUp.responseDesc" class="wd200" type="text"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleUp = false">取消 </el-button>
                <el-button type="primary" @click="upDateData()">确定 </el-button>
            </div>
        </el-dialog>
        <!--响应码-->
        <el-dialog title="内外部授权码响应" :visible.sync="dialogFormVisibleResponse" width="65%">
            <el-form ref="dataFormResponse" :rules="rulesResponse" :model="responseEdit">
                 <el-form-item class="cl_td" label="运营模式" prop="operationMode">
                    <el-select v-model="responseEdit.operationMode" class="wd200" clearable disabled>
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode"/>
                    </el-select>
                </el-form-item>
                <div class="clearboth"></div>
                <el-form-item class="cl_td" label="授权错误码" prop="internalResponseCode">
                    <el-input v-model="responseEdit.internalResponseCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <div class="clearboth"></div>
                <el-form-item class="cl_td" label="描述" prop="responseDesc">
                    <el-input v-model="responseEdit.responseDesc" class="wd200" type="text" readonly/>
                </el-form-item>
            </el-form>
            <div class="cl_tr text_right" >
                <el-button type="primary" @click="addIdentifyBtn(responseEdit)">新增 </el-button>
            </div>
            <el-table v-loading="listLoadingRes" :data="responseList" class="mbtm20 " border fit highlight-current-row style="width: 100%;" row-key="id">
                <el-table-column type="index" width="50" label="序号 " align="center"> </el-table-column>
                <el-table-column prop="cardAssociationsDesc" label="卡组织标识 " align="center"/>
                <el-table-column prop="labelis" label="授权响应码" align="center" />
                <el-table-column prop="" label="操作" align="center" >
                    <template slot-scope="{row}">
                        <el-button size="mini" icon="el-icon-edit" type="primary" @click="updateIdentify(row)">修改</el-button>
                        <el-button size="mini" icon="el-icon-edit" type="primary" @click="delIdentify(row)">删除</el-button>
                    </template> 
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleResponse = false">取消 </el-button>
                <!--<el-button type="primary" @click="upDateData()">确定 </el-button>-->
            </div>
        </el-dialog>
        <!--新增内外部授权响应码-->
        <el-dialog title="内外部授权码响应" :visible.sync="dialogFormVisibleAddIdentify" width="65%">
            <el-form ref="dataFormAddIdentify" :rules="rulesAddIdentify" :model="addIdentify">
                 <el-form-item class="cl_td" label="运营模式" prop="operationMode">
                    <el-select v-model="addIdentify.operationMode" class="wd200" clearable disabled>
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="授权错误码" prop="internalResponseCode">
                    <el-input v-model="addIdentify.internalResponseCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="卡组织标识" prop="cardAssociations">
                    <el-select clearable v-model="addIdentify.cardAssociations" class="wd200" @change="cardAssociationsChange($event)">
                    <el-option
                        v-for="(item, index ) in cardAssociationsOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="授权响应码" prop="externalResponseCode">
                    <el-select clearable v-model="addIdentify.externalResponseCode" class="wd200">
                    <el-option
                        v-for="(item, index ) in externalResponseCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"/>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleAddIdentify = false">取消 </el-button>
                <el-button type="primary" @click="submitAddIdentify()">确定 </el-button>
            </div>
        </el-dialog>
        <!--修改内外部授权响应-->
        <el-dialog title="内外部授权码响应" :visible.sync="dialogFormVisibleUpIdentify" width="65%">
            <el-form ref="dataFormUpIdentify" :rules="rulesUpIdentify" :model="upIdentify">
                 <el-form-item class="cl_td" label="运营模式" prop="operationMode">
                    <el-select v-model="upIdentify.operationMode" class="wd200" clearable disabled>
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="授权错误码" prop="internalResponseCode">
                    <el-input v-model="upIdentify.internalResponseCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="卡组织标识" prop="cardAssociations"  :rules="[ { required: true, message: '卡组织标识不能为空'} ]">
                    <el-select clearable v-model="upIdentify.cardAssociations" class="wd200" @change="up_cardAssociationsChange($event)">
                    <el-option
                        v-for="(item, index ) in cardAssociationsOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="授权响应码" prop="externalResponseCode">
                    <el-select clearable v-model="upIdentify.externalResponseCode" class="wd200">
                    <el-option
                        v-for="(item, index ) in externalResponseCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"/>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleUpIdentify = false">取消 </el-button>
                <el-button type="primary" @click="submitUpIdentify()">确定 </el-button>
            </div>
        </el-dialog>
    </div>
</template>
<script>
    import Pagination from "@/components/Pagination";
import data from '../../pdf/content';
    export default {
        name: 'tableList',
        components: {
            Pagination,
        },
        data() {
            return {
                queryForm: {},
                queryRef: {},
                tablesList: [],//列表
                listLoading1: false,
                queryFormObj: {
                    pageNum: 1,
                    pageSize: 10,
                },
                tableTotal: 0,
                /*----新增----*/
                tempAdd: {},//forem
                dataFormAdd: {},//ref
                rulesAdd: {},//rules
                dialogFormVisibleAdd: false,//弹框显示隐藏
                /*----修改----*/
                dialogFormVisibleUp: false,
                tempUp: {},//forem
                dataFormUp: {},//ref
                rulesUp: {},//rules
                /*----响应码----*/
                responseEdit: {},
                dataFormResponse: {},
                rulesResponse: {},
                dialogFormVisibleResponse: false,
                responseList: [],
                tableTotalRes: 0,
                listLoadingRes: false,
                //新增
                rulesAddIdentify: {},
                dataFormAddIdentify: {},
                addIdentify: {},//form
                dialogFormVisibleAddIdentify: false,
                add_cardAssociations: '',
                //修改
                dialogFormVisibleUpIdentify: false,
                upIdentify: {},//form
                dataFormUpIdentify: {},
                rulesUpIdentify: {},
                up_cardAssociations:'',
                //下拉
                operationModeOptions: [],//运营模式
                cardAssociationsOptions: [],//卡组织标识
                externalResponseCodeOptions: [],//授权响应码
            }
        },
        created() {},
        mounted() {
             // 运营模式 
             let obj={
                requestType: '1',
                resultType: '1',
                adminFlagLogin: '1',
             }
            this.getSelectDict( "/beta/betaService/COS.IQ.02.0006", obj).then(res => {
                this.operationModeOptions = res
            })
            //卡组织标识
            this.getSelectDict( "dic_recordType", obj).then(res => {
                this.cardAssociationsOptions = res
            })
            
            
            this.getList()
        },
        methods: {
            //列表
            getList() {
                this.listLoading1 = true
                let params = {
                   operationMode: this.queryForm.operationMode,
                   responseDesc: this.queryForm.responseDesc,
                }
                params = Object.assign(params, this.queryFormObj);
                this.getTableList('/beta/betaService/AUS.PM.01.0021', params).then(data =>{
                    this.tablesList = data.returnData.rows
                    this.tablesList.authTransMessage = data.returnData.rows.authTransMessage
                    this.tableTotal = data.returnData.totalCount
                    this.listLoading1 = false
                }).catch(err =>{
                    this.$message(2)
                }).finally(() =>{
                    this.listLoading1 = false
                })
                // this.getTableList('/beta/betaService/AUS.PM.01.0021', params, (res) => {
                //     this.listLoading1 = false
                //     if(res.returnCode == '000000') {
                //         if(res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                //             this.tablesList = res.returnData.rows
                //             this.tablesList.authTransMessage = res.returnData.rows.authTransMessage
                //             this.tableTotal = res.returnData.totalCount
                //         }else {
                //             this.tablesList = []
                //         }
                //     }
                // })
            },
            /*----新增----*/
           //显示新增弹框
            handleCreate() {
                this.dialogFormVisibleAdd = true
                    this.$nextTick(() => {
                    this.$refs['dataFormAdd'].clearValidate()
                })
            }, 
            //新增确认
            createData() {
                this.$refs['dataFormAdd'].validate((valid) => {
                    if (valid) {
                        this.post('/beta/betaService/AUS.PM.01.0023', this.tempAdd, (res) => {
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
            /*----修改----*/
           //修改显示弹框
            handleUpdate(row) {
                this.tempUp = Object.assign({}, row)
               // console.log(row)
                this.dialogFormVisibleUp = true
                this.$nextTick(() => {
                    this.$refs['dataFormUp'].clearValidate()
                })
            }, 
            upDateData() {
                this.$refs['dataFormUp'].validate((valid) => {
                    if (valid) {
                        this.post('/beta/betaService/AUS.PM.01.0022', this.tempUp, (res) => {
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
                })
            },
            /*----响应码----*/
            //响应码显示弹框
            handleResponse(row) {
                this.responseEdit = Object.assign({}, row)
                this.dialogFormVisibleResponse = true
                this.getResponse()
                this.$nextTick(() => {
                    this.$refs['dataFormResponse'].clearValidate()
                })
            },
            //授权内外部响应码查询表
            getResponse(){
                this.dialogFormVisibleResponse = true
                this.listLoadingRes = true
                let params = {
                    operationMode: this.queryForm.operationMode,
                    internalResponseCode: this.responseEdit.internalResponseCode,
                    authFlag: "0",
                    isTrans: true,
                    transParams: ['dic_recordType'],
                    transDict: ['recordType']
                }
                this.getTableList('/beta/betaService/AUS.PM.01.0024', params, (res) => {
                    if(res.returnCode == '000000') {
                        this.listLoadingRes = false
                        if(res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                            this.responseList = res.returnData.rows
                            this.tableTotalRes = res.returnData.totalCount
                            this.responseList.forEach(item =>{
                                item.labelis = item.externalResponseCode+ ' '+ item.externalResponseDesc//授权响应码
                                 if(item.cardAssociations=='J'){
                                    item.cardAssociationsDesc='J JCB'
                                 }else if(item.cardAssociations=='M'){
                                    item.cardAssociationsDesc='M  MC'
                                 }else if(item.cardAssociations=='C'){
                                    item.cardAssociationsDesc='C  CUP'
                                 }else if(item.cardAssociations=='L'){
                                    item.cardAssociationsDesc='L  LOCAL'
                                 }else if(item.cardAssociations=='V'){
                                    item.cardAssociationsDesc='V  VISA'
                                 }
                            })
                        }else {
                            this.responseList = []
                            this.tableTotalRes = 0
                        }
                    }
                },(err) => {
                	this.responseList = []
                    this.tableTotalRes = 0
                    this.listLoadingRes = false
                })
            },
            //显示新增内外部响应码弹框
            addIdentifyBtn(row){
                this.dialogFormVisibleAddIdentify = true
                this.addIdentify = Object.assign({}, row)
                this.$nextTick(() => {
                    this.$refs['dataFormAddIdentify'].clearValidate()
                })
            },
            //卡组织标识
            cardAssociationsChange(val) {
                this.externalResponseCodeOptions = []
                this.add_cardAssociations = val
                this.getExternalResponseCodeOptions()
            },
            //授权响应码下拉关联卡组织标识
            getExternalResponseCodeOptions() {
                let params = {
                    authFlag: "0",
                    cardAssociations: this.add_cardAssociations,
                    operationMode : this.addIdentify.operationMode,
                }
                this.post('/beta/betaService/AUS.PM.01.0011', params, (res) => {
                    if (res.returnCode == '000000') {
                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                            let arr = []
                            let rows = res.returnData.rows
                            rows.forEach((item, index) => {
                                item.externalResponseCodeDesc = item.externalResponseCode + ' ' + item.responseDesc
                                arr[index] = {
                                    label: item.externalResponseCodeDesc,
                                    value: item.externalResponseCode
                                }
                            })
                            this.externalResponseCodeOptions = arr
                        } else {
                            this.externalResponseCodeOptions = []
                        }
                    }
                })
            },
            //新增内外部授权响应码
            submitAddIdentify(){
                this.addIdentify.flag =  '0'
                this.$refs['dataFormAddIdentify'].validate((valid) => {
                    if (valid) {
                        this.post('/beta/betaService/AUS.PM.01.0025', this.addIdentify, (res) => {
                        this.dialogFormVisibleAddIdentify = false
                        this.$notify({
                            title: 'Success',
                            message: '新增成功',
                            type: 'success',
                            duration: 2000
                        })
                        this.getResponse()
                      })
                    }
                })
            },
            //修改
            updateIdentify(row){
                this.dialogFormVisibleUpIdentify = true
                this.upIdentify = Object.assign({}, row)
                this.up_getExternalResponseCodeOptions()
                this.$nextTick(() => {
                    this.$refs['dataFormUpIdentify'].clearValidate()
                })
            },
            //删除
            delIdentify(row){
                this.$confirm('此操作将永久删除该条记录, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    const delParam = row;
                    delParam.flag = '1';
                    delParam.invalidFlag = '1';
                    this.post('/beta/betaService/AUS.PM.01.0025', delParam, (res) => {
                        
                        if (res.returnCode == '000000') {
                            this.$message({
                                type: 'success',
                                message: '删除成功!'
                            });
                            this.getResponse()
                        }
                        
                    })
                }).catch(() => {});
            },
            submitUpIdentify(){
                this.upIdentify.flag =  '2'
                this.$refs['dataFormUpIdentify'].validate((valid) => {
                    if (valid) {
                        this.post('/beta/betaService/AUS.PM.01.0025', this.upIdentify, (res) => {
                            if (res.returnCode == '000000') {
                                this.dialogFormVisibleUpIdentify = false
                                this.$notify({
                                    message: '修改成功!',
                                    type: 'success'
                                })
                                this.getResponse()
                                this.upIdentify = {}
                            }
                        })
                    }
                })
            },
            //卡组织标识
            up_cardAssociationsChange(val) {
                this.externalResponseCodeOptions = []
                this.up_cardAssociations = val
                this.up_getExternalResponseCodeOptions()
            },
            //授权响应码下拉关联卡组织标识
            up_getExternalResponseCodeOptions() {
                let params = {
                    authFlag: "0",
                    cardAssociations: this.up_cardAssociations,
                    operationMode : this.upIdentify.operationMode,
                }
                this.post('/beta/betaService/AUS.PM.01.0011', params, (res) => {
                    if (res.returnCode == '000000') {
                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                            let arr = []
                            let rows = res.returnData.rows
                            rows.forEach((item, index) => {
                                item.externalResponseCodeDesc = item.externalResponseCode + ' ' + item.responseDesc
                                arr[index] = {
                                    label: item.externalResponseCodeDesc,
                                    value: item.externalResponseCode
                                }
                            })
                            this.externalResponseCodeOptions = arr
                        } else {
                            this.externalResponseCodeOptions = []
                        }
                    }
                })
            },
        }
    }
</script>

<style>

</style>    
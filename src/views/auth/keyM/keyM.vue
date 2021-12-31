<!-- 密钥索引管理 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="运营模式" prop="operationMode" >
                <el-select v-model="queryFormObj.operationMode" class="wd200" clearable>
                <el-option
                    v-for="(item, index ) in operationModeOptions"
                    :key="index"
                    :label="item.modeName"
                    :value="item.operationMode"/>
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="密钥类型" prop="keyType" >
                <el-select v-model="queryFormObj.keyType" class="wd200" clearable>
                <el-option
                    v-for="(item, index ) in keyTypeOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.codes"/>
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="密钥ID" prop="keyId" >
                <el-input v-model="queryFormObj.keyId" class="wd200" type="text"/>
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" v-if="selBtnFlag">查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate()" v-if='addBtnFlag'>新增</el-button>
            </div>
        </el-form>
        <div v-if="showList">
            <el-table
                v-loading = "listLoading1"
                :data="tableList"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border>
                <el-table-column label="序号" type="index" width="50" align="center"> </el-table-column>
                <el-table-column prop="operationMode" label="运营模式" align="center" />
                <el-table-column prop="keyType" label="密钥类型" align="center" />
                <el-table-column prop="keyId" label="密钥索引" align="center" />
                <el-table-column prop="keyDesc" label="描述" align="center" />
                <el-table-column prop="" label="操作" align="center" width = "350">
                    <template slot-scope="{row,$index}">
                        <el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleSelInfo(row)" v-if="selBtnFlag">详情</el-button>
                        <el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleUpdate(row)"  v-if="updBtnFlag">修改</el-button>
                        <el-button size="mini" icon="el-icon-delete-solid"   type="primary" @click="handleDel(row)" v-if="updBtnFlag">删除</el-button>
                    </template> 
                </el-table-column>
            </el-table>
            <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
        </div>
        <!--新增交易识别-->
        <el-dialog title="密钥参数新增" :visible.sync="dialogFormVisibleAdd" width='70%'>
            <el-form ref="dataFormAdd" :model="keyAdd" :rules="rulesAdd" label-position="right" label-width="160px" style="display: inline-block;">
                <el-form-item label="运营模式 " prop="operationMode" class="cl_td" :rules="[ { required: true, message: '运营模式不能为空'} ]">
                    <el-select v-model="keyAdd.operationMode" class="filter-item" placeholder="请选择" clearable>
                        <el-option 
                            v-for="(item, index ) in operationModeOptions" 
                            :key="index" 
                            :label="item.modeName"
                            :value="item.operationMode"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="密钥类型" prop="keyType" :rules="[ { required: true, message: '密钥类型不能为空'} ]">
                    <el-select v-model="keyAdd.keyType" class="wd200" @change="addKeyTypeChange($event)" clearable>
                    <el-option
                        v-for="(item, index ) in keyTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="密钥索引ID" prop="keyId" :rules="[ { required: true, message: '密钥索引不能为空'} ]">
                    <el-input v-model="keyAdd.keyId" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="keyDesc" :rules="[ { required: true, message: '描述不能为空'} ]">
                    <el-input v-model="keyAdd.keyDesc" class="wd200" type="text"/>
                </el-form-item>
                 <div class=" clearboth"></div>
                <div class="mainname titleInfo ng-binding">KEY值</div>
                <el-form-item label="长度类型 " prop="logIsoMsgInd" class="cl_td" :rules="[ { required: true, message: '长度类型不能为空'} ]">
                    <el-select v-model="keyAdd.logIsoMsgInd" class="filter-item" placeholder="请选择" clearable>
                        <el-option 
                            v-for="(item, index ) in logIsoMsgIndOptions" 
                            :key="index" 
                            :label="item.detailDesc"
                            :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <div class=" clearboth"></div>
                <el-form-item class="cl_td" label="算法类型" prop="algorithmType" :rules="[ { required: true, message: '算法类型不能为空'} ]">
                    <el-select v-model="keyAdd.algorithmType" class="wd200" clearable>
                    <el-option
                        v-for="(item, index ) in algorithmTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <div class=" clearboth"></div>
                <el-form-item class="cl_td" label="密钥校验值" prop="checkValue" :rules="[ { required: true, message: '密钥校验值不能为空'} ]">
                    <el-input v-model="keyAdd.checkValue" class="wd200" type="text" />
                </el-form-item>
                <div class=" clearboth"></div>
                <el-form-item class="cl_td" label="密钥值1" prop="keySingle" :rules="[ { required: true, message: '密钥值1不能为空'} ]">
                    <el-input v-model="keyAdd.keySingle" class="wd200" type="text"/>
                </el-form-item>
                <div class=" clearboth"></div>
                <el-form-item class="cl_td" label="密钥值2" prop="keyDouble" v-if="keyAdd.logIsoMsgInd=='X' || keyAdd.logIsoMsgInd=='Y'"
                    :rules="[ { required: true, message: '密钥值2不能为空'} ]">
                    <el-input v-model="keyAdd.keyDouble" class="wd200" type="text"/>
                </el-form-item>
                <div class=" clearboth"></div>
                <el-form-item class="cl_td" label="密钥值3" prop="keyTriple"  v-if="keyAdd.logIsoMsgInd=='Y'"
                    :rules="[ { required: true, message: '密钥值3不能为空'} ]">
                    <el-input v-model="keyAdd.keyTriple" class="wd200" type="text"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addData()">确定</el-button>
                <el-button type="primary" @click="addClose()">关闭</el-button>
            </div>
        </el-dialog>
        <!--修改交易识别-->
        <el-dialog title="修改交易识别" :visible.sync="dialogFormVisibleUp" width="70%">
            <el-form ref="dataFormUp" :model="keyUp" :rules="rulesUp" label-position="right" label-width="160px" style="display: inline-block;">
                <el-form-item label="运营模式 " prop="operationMode" class="cl_td" :rules="[ { required: true, message: '运营模式不能为空'} ]">
                    <el-select v-model="keyUp.operationMode" class="filter-item" placeholder="请选择" clearable disabled>
                        <el-option 
                            v-for="(item, index ) in operationModeOptions" 
                            :key="index" 
                            :label="item.modeName"
                            :value="item.operationMode"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="密钥类型" prop="keyType" :rules="[ { required: true, message: '密钥类型不能为空'} ]">
                    <el-select v-model="keyUp.keyType" class="wd200" @change="addKeyTypeChange($event)" clearable disabled>
                    <el-option
                        v-for="(item, index ) in keyTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="密钥索引ID" prop="keyId" :rules="[ { required: true, message: '密钥索引不能为空'} ]">
                    <el-input v-model="keyUp.keyId" class="wd200" type="text" clearable disabled/>
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="keyDesc" :rules="[ { required: true, message: '描述不能为空'} ]">
                    <el-input v-model="keyUp.keyDesc" class="wd200" type="text"/>
                </el-form-item>
                 <div class=" clearboth"></div>
                <div class="mainname titleInfo ng-binding">KEY值</div>
                <el-form-item label="长度类型 " prop="logIsoMsgInd" class="cl_td" :rules="[ { required: true, message: '长度类型不能为空'} ]">
                    <el-select v-model="keyUp.logIsoMsgInd" class="filter-item" placeholder="请选择">
                        <el-option 
                            v-for="(item, index ) in logIsoMsgIndOptions" 
                            :key="index" 
                            :label="item.detailDesc"
                            :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <div class=" clearboth"></div>
                <el-form-item class="cl_td" label="算法类型" prop="algorithmType" :rules="[ { required: true, message: '算法类型不能为空'} ]">
                    <el-select v-model="keyUp.algorithmType" class="wd200">
                    <el-option
                        v-for="(item, index ) in algorithmTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <div class=" clearboth"></div>
                <el-form-item class="cl_td" label="密钥校验值" prop="checkValue" :rules="[ { required: true, message: '密钥校验值不能为空'} ]">
                    <el-input v-model="keyUp.checkValue" class="wd200" type="text" />
                </el-form-item>
                <div class=" clearboth"></div>
                <el-form-item class="cl_td" label="密钥值1" prop="keySingle" :rules="[ { required: true, message: '密钥值1不能为空'} ]">
                    <el-input v-model="keyUp.keySingle" class="wd200" type="text"/>
                </el-form-item>
                <div class=" clearboth"></div>
                <el-form-item class="cl_td" label="密钥值2" prop="keyDouble" v-if="keyAdd.logIsoMsgInd=='X' || keyAdd.logIsoMsgInd=='Y'"
                    :rules="[ { required: true, message: '密钥值2不能为空'} ]">
                    <el-input v-model="keyUp.keyDouble" class="wd200" type="text"/>
                </el-form-item>
                <div class=" clearboth"></div>
                <el-form-item class="cl_td" label="密钥值3" prop="keyTriple"  v-if="keyAdd.logIsoMsgInd=='Y'"
                    :rules="[ { required: true, message: '密钥值3不能为空'} ]">
                    <el-input v-model="keyUp.keyTriple" class="wd200" type="text"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleUp = false">关闭</el-button>
                <el-button type="primary" @click="upData()">确定</el-button>
            </div>
        </el-dialog>
        <!--删除秘钥索引信息-->
        <el-dialog title="删除确认信息" :visible.sync="dialogFormVisibleDel">
            <el-form ref="dataFormDel" :model="encryDel" :rules="rulesDel" label-position="right" label-width="160px" style="display: inline-block;">
                <el-form-item label="运营模式 " prop="operationMode" class="cl_td" >
                    <el-select v-model="encryDel.operationMode" class="filter-item" placeholder="请选择" readonly disabled>
                        <el-option 
                            v-for="(item, index ) in operationModeOptions" 
                            :key="index" 
                            :label="item.modeName"
                            :value="item.operationMode"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="密钥类型" prop="keyType">
                    <el-select v-model="encryDel.keyType" class="wd200" readonly disabled>
                    <el-option
                        v-for="(item, index ) in keyTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="密钥索引ID" prop="keyId" >
                    <el-input v-model="encryDel.keyId" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="keyDesc" >
                    <el-input v-model="encryDel.keyDesc" class="wd200" type="text" readonly />
                </el-form-item>
                <div class="clearboth"></div>
                <div class="mainname titleInfo ng-binding">KEY值</div>
                <el-form-item class="cl_td" label="长度类型" prop="logIsoMsgIndInfo">
                    <el-select v-model="encryDel.logIsoMsgIndInfo" class="wd200" readonly disabled>
                    <el-option
                        v-for="(item, index ) in logIsoMsgIndInfoOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="算法类型" prop="algorithmType">
                    <el-select v-model="encryDel.algorithmType" class="wd200" readonly disabled>
                    <el-option
                        v-for="(item, index ) in algorithmTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="秘钥校验值" prop="checkValue" >
                    <el-input v-model="encryDel.checkValue" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="秘钥值1" prop="keySingle" v-if="encryDel.keySingle!=null">
                    <el-input v-model="encryDel.keySingle" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="秘钥值2" prop="keyDouble" v-if="encryDel.keyDouble!=null">
                    <el-input v-model="encryDel.keyDouble" class="wd200" type="text" readonly />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="encryDelData()">确认删除</el-button>
            </div>
        </el-dialog>
        <!--详情-->
        <el-dialog title="查询详细信息" :visible.sync="dialogFormVisibleDetail"  width="70%">
        	<el-form ref="dataFormDetail" :model="keyDetail" :rules="rulesDetail" label-position="right" label-width="160px" style="display: inline-block;">
                <el-form-item label="运营模式 " prop="operationMode" class="cl_td" :rules="[ { required: true, message: '运营模式不能为空'} ]">
                    <el-select v-model="keyDetail.operationMode" class="filter-item" placeholder="请选择" clearable disabled>
                        <el-option 
                            v-for="(item, index ) in operationModeOptions" 
                            :key="index" 
                            :label="item.modeName"
                            :value="item.operationMode"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="密钥类型" prop="keyType" :rules="[ { required: true, message: '密钥类型不能为空'} ]">
                    <el-select v-model="keyDetail.keyType" class="wd200" @change="addKeyTypeChange($event)" clearable disabled>
                    <el-option
                        v-for="(item, index ) in keyTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="密钥索引ID" prop="keyId" :rules="[ { required: true, message: '密钥索引不能为空'} ]">
                    <el-input v-model="keyDetail.keyId" class="wd200" type="text" clearable disabled/>
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="keyDesc" :rules="[ { required: true, message: '描述不能为空'} ]">
                    <el-input v-model="keyDetail.keyDesc" class="wd200" type="text" readonly disabled/>
                </el-form-item>
                 <div class=" clearboth"></div>
                <div class="mainname titleInfo ng-binding">KEY值</div>
                <el-form-item label="长度类型 " prop="logIsoMsgInd" class="cl_td" :rules="[ { required: true, message: '长度类型不能为空'} ]">
                    <el-select v-model="keyDetail.logIsoMsgInd" class="filter-item" placeholder="请选择" readonly disabled>
                        <el-option 
                            v-for="(item, index ) in logIsoMsgIndOptions" 
                            :key="index" 
                            :label="item.detailDesc"
                            :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <div class=" clearboth"></div>
                <el-form-item class="cl_td" label="算法类型" prop="algorithmType" :rules="[ { required: true, message: '算法类型不能为空'} ]">
                    <el-select v-model="keyDetail.algorithmType" class="wd200" readonly disabled>
                    <el-option
                        v-for="(item, index ) in algorithmTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <div class=" clearboth"></div>
                <el-form-item class="cl_td" label="密钥校验值" prop="checkValue" :rules="[ { required: true, message: '密钥校验值不能为空'} ]">
                    <el-input v-model="keyDetail.checkValue" class="wd200" type="text" readonly disabled/>
                </el-form-item>
                <div class=" clearboth"></div>
                <el-form-item class="cl_td" label="密钥值1" prop="keySingle" :rules="[ { required: true, message: '密钥值1不能为空'} ]">
                    <el-input v-model="keyDetail.keySingle" class="wd200" type="text" readonly disabled/>
                </el-form-item>
                <div class=" clearboth"></div>
                <el-form-item class="cl_td" label="密钥值2" prop="keyDouble" v-if="keyDetail.logIsoMsgInd=='X' || keyDetail.logIsoMsgInd=='Y'"
                    :rules="[ { required: true, message: '密钥值2不能为空'} ]">
                    <el-input v-model="keyDetail.keyDouble" class="wd200" type="text" readonly disabled/>
                </el-form-item>
                <div class=" clearboth"></div>
                <el-form-item class="cl_td" label="密钥值3" prop="keyTriple"  v-if="keyDetail.logIsoMsgInd=='Y'"
                    :rules="[ { required: true, message: '密钥值3不能为空'} ]">
                    <el-input v-model="keyDetail.keyTriple" class="wd200" type="text" readonly disabled/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleDetail = false">关闭</el-button>
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
        tableList: [],
        tableTotal: 0,
        // 下拉框
        operationModeOptions: [], //运营模式
        keyTypeOptions: [],//密钥类型
        algorithmTypeOptions: [],//算法类型
        logIsoMsgIndOptions: [],//长度类型
        logIsoMsgIndInfoOptions: [],//删除长度类型
         // 增删改查
        keyAdd: {}, // 新增
        keyUp: {}, // 修改
        encryDel: {}, // 删除
        dialogFormVisibleAdd: false,
        dialogFormVisibleUp: false,
        dialogFormVisibleDel: false,
        dataFormAdd: {},    
        dataFormUp: {},
        rulesAdd: {},
        rulesDel: {},
        rulesUp: {},
        //详情
        dialogFormVisibleDetail: false,
        keyDetail: {},
		rulesDetail: {},
		dataFormDetail: {},
    }
  },
  created() {
    this.getBtnAuth()
  },
    mounted() {
        // 运营模式 
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0006").then(res => {
            this.operationModeOptions = res
        })
        //密钥类型
        let obj={
            type:"DROPDOWNBOX",
            groupsCode:"dic_cipherType",
            queryFlag: "children"
        }
        this.getSelectDict( "dic_cipherType",'obj').then(res => {
            this.keyTypeOptions = res
        })
        //算法类型
        this.getSelectDict( "dic_algorithmType").then(res => {
            this.algorithmTypeOptions = res
        })
//      //长度类型
//      this.getSelectDict( "dic_lengthType").then(res => {
//          this.logIsoMsgIndOptions = res
//      })
        
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
                        if (this.btnAuthStr.includes('AUS.PM.20.0101')) { // 新增
                            this.addBtnFlag = true;
                        } else {
                           this.addBtnFlag = false;
                        }
                        if (this.btnAuthStr.includes('AUS.PM.20.0102')) { // 查询
                            this.selBtnFlag = true;
                        } else {
                            this.selBtnFlag = false
                        }
                        if (this.btnAuthStr.includes('AUS.PM.20.0103')) { // 维护
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
            if(this.queryFormObj.keyId !='' && this.queryFormObj.operationMode ==undefined){
                this.$message('请输入运营模式');
                return;
            }
            this.listLoading1 = true
            this.showList = true
            let obj={
                authDataSynFlag: "1",
            }
            obj = Object.assign(obj,this.queryFormObj)
            this.getTableList('/beta/betaService/AUS.PM.20.0102', obj ,(res) => {
                if (res.returnCode == '000000') {
                    this.listLoading1 = false
                    if(res.returnData !='null'){
                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                            this.tableList = res.returnData.rows
                            this.tableTotal = res.returnData.totalCount
                        }else{
                            this.tableList = []
                            this.tableTotal = res.returnData.totalCount
                        }
                    }
                }else{
                    this.listLoading1 = false
                    this.$message(res.returnData.returnMsg);
                }
            })
        },
        handleSearch() {
            this.getList()
        },
        //显示新增弹框
        handleCreate() {
            this.dialogFormVisibleAdd = true
            this.$nextTick(() => {
                this.$refs['dataFormAdd'].clearValidate()
           })
        }, 
        //关闭弹框清空数据
        addClose() {
            this.dialogFormVisibleAdd = false
            this.$nextTick(() => {
                this.$refs['dataFormAdd'].clearValidate()
            })
            this.$refs["dataFormAdd"].resetFields()
        },
        //密钥类型监听长度类型 
        addKeyTypeChange(val) {
            this.listCodeOptions = []
            this.add_KeyType = val
            this.getKeyTypeOptions()
        },
         //长度类型 
        getKeyTypeOptions() {
            if(this.add_KeyType == "CVK"){
                this.getSelectDict( "dic_lengthTypeY",).then(res => {
                   this.logIsoMsgIndOptions=res
                })
            }else if(this.add_KeyType == "IMK" || this.add_KeyType == "MAC"){
                this.getSelectDict( "dic_lengthTypeKY",).then(res => {
                   this.logIsoMsgIndOptions=res
                })
            }else {
                this.getSelectDict( "dic_lengthType",).then(res => {
                   this.logIsoMsgIndOptions=res
                })
            }
        },
    //提交新增数据
    addData() {
        if(this.keyAdd.operationMode){
            if(this.keyAdd.logIsoMsgInd){
                if(this.keyAdd.logIsoMsgInd == "X"){
                    if(this.keyAdd.keyDouble){
                        this.post('/beta/betaService/AUS.PM.20.0101', this.keyAdd, (res) => {
                            if (res.returnMsg == 'OK') {
                                this.$message('建立成功');
                                this.keyAdd = {};
                                this.getList();
                            }
                        });
                    }else{
                        this.$message('请输入密钥值2 的值');    //"请输入密钥值2 的值");
                    }
                }else if(this.keyAdd.logIsoMsgInd == "Y"){
                    if(this.keyAdd.keyDouble && this.keyAdd.keyTriple){
                       this.post('/beta/betaService/AUS.PM.20.0101', this.keyAdd, (res) => {
                            if (res.returnMsg == 'OK') {
                                this.$message('建立成功');
                                this.keyAdd = {};
                                this.getList();
                            }
                        });
                    }else{
                        this.$message('请输入密钥值2和密钥值3 的值');  //"请输入密钥值2和密钥值3 的值");
                    }
                }else{
                    this.post('/beta/betaService/AUS.PM.20.0101', this.keyAdd, (res) => {
                        if (res.returnMsg == 'OK') {
                           this.$message('建立成功');
                            this.keyAdd = {};
                            this.getList();
                        }
                    });
                }
            }else{
                jfLayer.alert(T.T('SQJ3000003'));
            }
        }
    },  
    //显示删除弹框
    handleDel(row) {
    	this.dialogFormVisibleDel = true
        this.encryDel = Object.assign({}, row) // 
        this.getLogIsoMsgIndInfo()
        this.$nextTick(() => {
        this.$refs['dataFormDel'].clearValidate()
      })
    },
    getLogIsoMsgIndInfo(){
    	
    	if(this.add_KeyType == "CVK"){
            this.getSelectDict( "dic_lengthTypeY",).then(res => {
               this.logIsoMsgIndOptions=res
            })
        }else if(this.add_KeyType == "IMK" || this.add_KeyType == "MAC"){
            this.getSelectDict( "dic_lengthTypeKY",).then(res => {
               this.logIsoMsgIndOptions=res
            })
        }else {
            this.getSelectDict( "dic_lengthType",).then(res => {
               this.logIsoMsgIndOptions=res
            })
        }
    },
    
    //提交删除数据
    encryDelData() {
        let delObj={
            authDataSynFlag: "1",
            invalidFlag: '1',
        }
        delObj = Object.assign(delObj,this.encryDel)
        this.$confirm('确定是否删除?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => {
	        this.post('/beta/betaService/AUS.PM.20.0103', delObj, (res) => {
                if (res.returnCode == '000000') {
                    this.$notify({
                        title: 'Success',
                        message: '删除成功',
                        type: 'success',
                        duration: 2000
                    })
                    this.dialogFormVisibleDel = false
                    this.getList()
                }
	        })
        })
    },  
    //显示详情弹框
    handleSelInfo(row) {
        this.keyDetail = Object.assign({}, row)
       	this.dialogFormVisibleDetail = true
        this.$nextTick(() => {
            this.$refs['dataFormDetail'].clearValidate()
      })
    }, 
    //显示修改弹框
    handleUpdate(row) {
        this.keyUp = Object.assign({}, row)
        this.getKeyTypeOptions()
        this.dialogFormVisibleUp = true
        this.$nextTick(() => {
            this.$refs['dataFormUp'].clearValidate()
      })
    }, 
    getKeyTypeOptions() {
        this.getSelectDict( "dic_lengthType",).then(res => {
           this.logIsoMsgIndOptions=res
        })
    },
    //确认提交修改数据
    upData() {
        this.keyUp.authDataSynFlag = "1";
        if(this.keyUp.operationMode){
                if(this.keyUp.logIsoMsgInd){
                    if(this.keyUp.logIsoMsgInd == "X"){
                        if(this.keyUp.keyDouble){
                            this.post('/beta/betaService/AUS.PM.20.0103', this.keyUp, (res) => {
                                if (res.returnMsg == 'OK') {
                                    this.$message('建立成功');
                                    this.keyUp = {};
                                    this.getList();
                                }
                            });
                        }else{
                            this.$message('请输入密钥值2 的值');    //"请输入密钥值2 的值");
                        }
                    }
                    else if(this.keyUp.logIsoMsgInd == "Y"){
                        if(this.keyUp.keyDouble && this.keyUp.keyTriple){
                           this.post('/beta/betaService/AUS.PM.20.0103', this.keyUp, (res) => {
                                if (res.returnMsg == 'OK') {
                                    this.$message('建立成功');
                                    this.keyAdd = {};
                                    this.getList();
                                }
                            });
                        }else{
                            this.$message('请输入密钥值2和密钥值3 的值');  //"请输入密钥值2和密钥值3 的值");
                        }
                    }else{
                        this.post('/beta/betaService/AUS.PM.20.0103', this.keyUp, (res) => {
                            if (res.returnMsg == 'OK') {
                                this.$message('建立成功');
                                this.keyUp = {};
                                this.getList();
                            }
                        });
                    }
                }else{
                    this.$message('请选择长度类型');    
                }
            }
        },
    }
}
</script>

<style>
</style>

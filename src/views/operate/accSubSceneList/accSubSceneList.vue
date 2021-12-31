<!-- 核算子场景 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
            :rules="[ { required: true, message: '运营模式不能为空'} ]">
                <el-select v-model="queryFormObj.operationMode" class="wd200" clearable>
                <el-option
                    v-for="(item, index ) in operationModeOptions"
                    :key="index"
                    :label="item.modeName"
                    :value="item.operationMode"
                />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="子场景编号" prop="subTableSequence">
                <el-input v-model="queryFormObj.subTableSequence" class="wd200" type="text" />
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" v-show="selBtnFlag">查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate" v-show="addBtnFlag">新增</el-button>
            </div>
        </el-form>
        <el-table
            v-loading = "config.loading"
            :data="tableData"
            class="mbtm20"
            fit
            highlight-current-row
            style="width: 100%;"
            border
        >
            <el-table-column prop="operationMode" label="运营模式" align="center" />
            <el-table-column prop="subTableSequence" label="子场景序号" align="center" />
            <el-table-column prop="subTableSequenceDesc" label="子场景描述" align="center" />
            <el-table-column prop="" label="操作" align="center" width = "350">
                <template slot-scope="{row}">
                    <el-button size="mini" icon="el-icon-more" type="primary" @click="handleDetail(row)" v-show="selBtnFlag">详情</el-button>
                    <el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleUpdate(row)" v-show="updBtnFlag">修改</el-button>
                    <el-button size="mini" icon="el-icon-delete"  type="primary" @click="handleDelete(row)" v-show="delBtnFlag">删除</el-button>
                </template> 
            </el-table-column>
        </el-table>
        <pagination v-show="config.total>0" :total="config.total" :page.sync="config.pageNum" :limit.sync="config.pageSize" @pagination="getList" />

        
        <!-- 新增 -->
        <el-dialog title="新增" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="refAdd" :model="tempAdd" :rules="rulesAdd">
                <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
                :rules="[ { required: true, message: '运营模式不能为空'} ]">
                    <el-select v-model="tempAdd.operationMode" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode"
                        />
                    </el-select>
               </el-form-item>
               <el-form-item class="cl_td" label="子场景序号" prop="subTableSequence"
               :rules="[ { required: true, message: '子场景序号不能为空'},
               {  max: 3, message: '长度为3个字符', trigger: 'blur' } ]">
                    <el-input v-model="tempAdd.subTableSequence" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="子场景描述 " prop="subTableSequenceDesc">
                    <el-input v-model="tempAdd.subTableSequenceDesc" class="wd200" type="text"  />
                </el-form-item>
                <el-form-item class="cl_td" />
                
                <el-form-item class="cl_tr" label="子场景识别" prop="enableLogo">
                    <el-radio-group v-model="tempAdd.enableLogo"  @change="getEnableLogo" >
                        <el-radio label="S" >启用核算状态</el-radio>
                        <el-radio label="A" >启用资产转变阶段</el-radio>
                        <el-radio label="C" >启用币种</el-radio>
                    </el-radio-group>
                </el-form-item>
                <div v-show="up_showStateDiv">
                    <el-form-item class="cl_td" label="原核算状态" prop="lastSettleState">
                        <el-select v-model="tempAdd.lastSettleState" class="wd200" clearable >
                            <el-option
                            v-for="(item, index ) in lastSettleStateOptions"
                            :key="index"
                            :label="item.accountingStatus"
                            :value="item.accountingStatus"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="cl_td" label="目标核算状态" prop="settleState">
                        <el-select v-model="tempAdd.settleState" class="wd200" clearable >
                            <el-option
                            v-for="(item, index ) in settleStateOptions"
                            :key="index"
                            :label="item.accountingStatus"
                            :value="item.accountingStatus"
                            />
                        </el-select>
                    </el-form-item>
                </div>
                <div v-show="up_showAssetDiv">
                    <el-form-item class="cl_td" label="原资产转变阶段" prop="startAssetTransitionPhase">
                        <el-select v-model="tempAdd.startAssetTransitionPhase" class="wd200" clearable  >
                            <el-option
                            v-for="(item, index ) in startAssetTransitionPhaseOptions"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="cl_td" label="目标资产转变阶段" prop="targetAssetTransitionPhase">
                        <el-select v-model="tempAdd.targetAssetTransitionPhase" class="wd200" clearable >
                            <el-option
                            v-for="(item, index ) in targetAssetTransitionPhaseOptions"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                </div>
                <div v-show="up_showCurrencyDiv">
                    <el-form-item class="cl_tr" label="清算与入账币种状态" prop="sameCurrency">
                        <el-radio-group v-model="tempAdd.sameCurrency" >
                            <el-radio label="Y" >清算与入账币种相同</el-radio>
                            <el-radio label="N" >清算与入账币种不相同</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </div>
            </el-form>
            
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="createData()">
                    确定
                </el-button>
                <el-button @click="addClose">
                    关闭
                </el-button>
            </div>
        </el-dialog>

        <!-- 详情 -->
        <el-dialog title="详情" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="refDetail" :model="tempDetail" :rules="rulesDetail">
                <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
                :rules="[ { required: true, message: '运营模式不能为空'} ]">
                    <el-select v-model="tempDetail.operationMode" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode"
                        />
                    </el-select>
               </el-form-item>
               <el-form-item class="cl_td" label="子场景序号" prop="subTableSequence">
                    <el-input v-model="tempDetail.subTableSequence" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="子场景描述 " prop="subTableSequenceDesc">
                    <el-input v-model="tempDetail.subTableSequenceDesc" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" />
                
                <el-form-item class="cl_tr" label="子场景识别" prop="enableLogo">
                    <el-radio-group v-model="tempDetail.enableLogo"  @change="getEnableLogo" >
                        <el-radio disabled label="S" >启用核算状态</el-radio>
                        <el-radio disabled label="A" >启用资产转变阶段</el-radio>
                        <el-radio disabled label="C" >启用币种</el-radio>
                    </el-radio-group>
                </el-form-item>
                <div v-show="up_showStateDiv">
                    <el-form-item class="cl_td" label="原核算状态" prop="lastSettleState">
                        <el-select v-model="tempDetail.lastSettleState" class="wd200" clearable disabled>
                            <el-option
                            v-for="(item, index ) in lastSettleStateOptions"
                            :key="index"
                            :label="item.accountingStatus"
                            :value="item.accountingStatus"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="cl_td" label="目标核算状态" prop="settleState">
                        <el-select v-model="tempDetail.settleState" class="wd200" clearable disabled>
                            <el-option
                            v-for="(item, index ) in settleStateOptions"
                            :key="index"
                            :label="item.accountingStatus"
                            :value="item.accountingStatus"
                            />
                        </el-select>
                    </el-form-item>
                </div>
                <div v-show="up_showAssetDiv">
                    <el-form-item class="cl_td" label="原资产转变阶段" prop="startAssetTransitionPhase">
                        <el-select v-model="tempDetail.startAssetTransitionPhase" class="wd200" clearable disabled >
                            <el-option
                            v-for="(item, index ) in startAssetTransitionPhaseOptions"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="cl_td" label="目标资产转变阶段" prop="targetAssetTransitionPhase">
                        <el-select v-model="tempDetail.targetAssetTransitionPhase" class="wd200" clearable disabled>
                            <el-option
                            v-for="(item, index ) in targetAssetTransitionPhaseOptions"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                </div>
                <div v-show="up_showCurrencyDiv">
                    <el-form-item class="cl_tr" label="清算与入账币种状态" prop="sameCurrency">
                        <el-radio-group v-model="tempUp.sameCurrency" >
                            <el-radio disabled label="Y" >清算与入账币种相同</el-radio>
                            <el-radio disabled label="N" >清算与入账币种不相同</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleDetail = false">
                    关闭
                </el-button>
            </div>
        </el-dialog>

        <!-- 修改 -->
        <el-dialog title="修改" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="refUp" :model="tempUp" :rules="rulesUp">
                <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
                :rules="[ { required: true, message: '运营模式不能为空'} ]">
                    <el-select v-model="tempUp.operationMode" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode"
                        />
                    </el-select>
               </el-form-item>
               <el-form-item class="cl_td" label="子场景序号" prop="subTableSequence">
                    <el-input v-model="tempUp.subTableSequence" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="子场景描述 " prop="subTableSequenceDesc">
                    <el-input v-model="tempUp.subTableSequenceDesc" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" />
                
                <el-form-item class="cl_tr" label="子场景识别" prop="enableLogo">
                    <el-radio-group v-model="tempUp.enableLogo"  @change="getEnableLogo">
                        <el-radio label="S" >启用核算状态</el-radio>
                        <el-radio label="A" >启用资产转变阶段</el-radio>
                        <el-radio label="C" >启用币种</el-radio>
                    </el-radio-group>
                </el-form-item>
                <div v-show="up_showStateDiv">
                    <el-form-item class="cl_td" label="原核算状态" prop="lastSettleState">
                        <el-select v-model="tempUp.lastSettleState" class="wd200" clearable >
                            <el-option
                            v-for="(item, index ) in lastSettleStateOptions"
                            :key="index"
                            :label="item.accountingStatus"
                            :value="item.accountingStatus"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="cl_td" label="目标核算状态" prop="settleState">
                        <el-select v-model="tempUp.settleState" class="wd200" clearable >
                            <el-option
                            v-for="(item, index ) in settleStateOptions"
                            :key="index"
                            :label="item.accountingStatus"
                            :value="item.accountingStatus"
                            />
                        </el-select>
                    </el-form-item>
                </div>
                <div v-show="up_showAssetDiv">
                    <el-form-item class="cl_td" label="原资产转变阶段" prop="startAssetTransitionPhase">
                        <el-select v-model="tempUp.startAssetTransitionPhase" class="wd200" clearable >
                            <el-option
                            v-for="(item, index ) in startAssetTransitionPhaseOptions"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="cl_td" label="目标资产转变阶段" prop="targetAssetTransitionPhase">
                        <el-select v-model="tempUp.targetAssetTransitionPhase" class="wd200" clearable >
                            <el-option
                            v-for="(item, index ) in targetAssetTransitionPhaseOptions"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                            />
                        </el-select>
                    </el-form-item>
                </div>
                <div v-show="up_showCurrencyDiv">
                    <el-form-item class="cl_tr" label="清算与入账币种状态" prop="sameCurrency">
                        <el-radio-group v-model="tempUp.sameCurrency" >
                            <el-radio label="Y" >清算与入账币种相同</el-radio>
                            <el-radio label="N" >清算与入账币种不相同</el-radio>
                        </el-radio-group>
                    </el-form-item>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateData()">
                    确定
                </el-button>
                <el-button @click="dialogFormVisibleUp = false">
                    关闭
                </el-button>
                
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Pagination from "@/components/Pagination";

export default {
  name: 'accSubSceneList',
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
        delBtnFlag: false,
        btnAuthStr: '',

        // 列表
        queryFormObj: {},
        loading: false,
        queryFormRef: {},
        queryFormRules: {},      
        tableData: [],
        config: {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0
        },


        // 下拉框
        operationModeOptions: [], 
        lastSettleStateOptions: [],
        settleStateOptions: [],
        startAssetTransitionPhaseOptions: [],
        targetAssetTransitionPhaseOptions: [],
        subTableSequenceOptions: [],
        
        // 增删改查
        tempAdd: {}, // 新增
        rulesAdd: {},
        refAdd: {},
        tempUp: {
            // enableLogo: '',
            // sameCurrency: '',
        }, // 修改
        rulesUp: {},
        refUp: {},
        tempDetail: {}, // 详情
        rulesDetail: {},
        refDetail: {},
        tempDel: {}, // 删除
        dialogFormVisibleAdd: false,
        dialogFormVisibleUp: false,
        dialogFormVisibleDetail: false,

        // 详情


        // 修改
        up_showStateDiv: false, // 启用核算状态
        up_showAssetDiv: false, // 启用资产转变阶段
        up_showCurrencyDiv: false, // 启用币种
        

    }
  },
  created() {
    this.getBtnAuth()
  },
  mounted() {
    this.getList()

    // 运营模式 
    this.getSelectDict( "/beta/betaService/COS.IQ.02.0006").then(res => {
        this.operationModeOptions = res
    })
    // 原核算状态 目标核算状态
    this.getSelectDict( "/beta/betaService/COS.IQ.02.0051").then(res => {
        this.lastSettleStateOptions = res
        this.settleStateOptions = res

    })
    // 原资产转变阶段 目标资产转变阶段
    this.getSelectDict( "dic_capitalStage").then(res => {
        res.forEach(item => {
            item.label = item.codes+' '+ item.detailDesc
            item.value = item.codes

        })
        this.startAssetTransitionPhaseOptions = res
        this.targetAssetTransitionPhaseOptions = res

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
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.length > 0 ) {
                    res.returnData.forEach(item => {
                        this.btnAuthStr += item.eventNo+','
                    })
                    if (this.btnAuthStr.includes('COS.IQ.02.0095')) { // 查询
                        this.selBtnFlag = true
                    } else {
                        this.selBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.AD.02.0100')) { // 新增
                        this.addBtnFlag = true
                    } else {
                        this.addBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.UP.02.0095')) { // 维护
                        this.updBtnFlag = true
                    } else {
                        this.updBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.UP.02.0065')) { // 删除
                        this.delBtnFlag = true
                    } else {
                        this.delBtnFlag = false
                    }

                    
                }
            }
        })
    },
    // 列表
    getList() {
        this.config.loading = true
        let params =  Object.assign({}, this.queryFormObj, this.config,)
        this.getTableList('/beta/betaService/COS.IQ.02.0095', params ,(res) => {
            if (res.returnCode == '000000') {
                this.config.loading = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    let rows = res.returnData.rows
                    this.tableData = rows
                    this.config.total = res.returnData.totalCount
                    
                } else {
                    this.tableData = []
                    this.config.total = 0
                }
            }
        }, (err) => {
      		this.tableData = []
            this.config.total = 0
            this.config.loading = false
       		
        })

    },
    handleSearch() {
        this.queryFormObj.pageNum = 1
        this.getList()
    },

    // 新增 按钮
    handleCreate() {
        this.dialogFormVisibleAdd = true
      this.$nextTick(() => {
        this.$refs['refAdd'].clearValidate()
      })
    }, 
    addClose() {
        this.dialogFormVisibleAdd = false
        this.$nextTick(() => {
            this.$refs['refAdd'].clearValidate()
        })
        this.$refs["refAdd"].resetFields()
    },
    createData() {
        this.$refs['refAdd'].validate((valid) => {
        if (valid) {
            if(this.tempAdd.enableLogo=="S"){
				delete this.tempAdd.startAssetTransitionPhase;
				delete this.tempAdd.targetAssetTransitionPhase;
				delete this.tempAdd.sameCurrency;
			}else if(this.tempAdd.enableLogo=="A"){
				delete this.tempAdd.lastSettleState;
				delete this.tempAdd.settleState;
				delete this.tempAdd.sameCurrency;
			}else if(this.tempAdd.enableLogo=="C"){
				delete this.tempAdd.lastSettleState;//原核算状态
				delete this.tempAdd.settleState;//目标核算状态
				delete this.tempAdd.startAssetTransitionPhase;//原资产转变阶段
				delete this.tempAdd.targetAssetTransitionPhase;//目标资产转变阶段
			}
            console.log(this.tempAdd)
            this.post('/beta/betaService/COS.AD.02.0100', this.tempAdd, (res) => {
                if (res.returnCode == '000000') {
                    this.dialogFormVisibleAdd = false
                        this.$notify({
                        title: 'Success',
                        message: '新增成功',
                        type: 'success',
                        duration: 2000
                    })
                    this.$refs['refAdd'].clearValidate()
                    this.$refs["refAdd"].resetFields()
                    this.getList()
                    this.tempAdd = {}
                }
            })
        }
      })
    }, 
    // 详情 按钮
    handleDetail(row) {
        this.dialogFormVisibleDetail = true
        this.tempDetail = Object.assign({}, row) // 
        this.$nextTick(() => {
            this.$refs['refDetail'].clearValidate()
        })
        if(this.tempDetail.enableLogo == 'C') {
			this.up_showStateDiv = false;
			this.up_showAssetDiv = false;
			this.up_showCurrencyDiv = true;
		}else if(this.tempDetail.enableLogo == 'S') {
			this.up_showStateDiv = true;
			this.up_showAssetDiv = false;
			this.up_showCurrencyDiv = false;
		}else if(this.tempDetail.enableLogo == 'A') {
			this.up_showAssetDiv = true;
			up_showStateDiv = false;
			this.up_showCurrencyDiv = false;
		}
    },
    // 修改 按钮
    handleUpdate(row) {
        this.tempUp = Object.assign({}, row)
        this.dialogFormVisibleUp = true
        this.$nextTick(() => {
            this.$refs['refUp'].clearValidate()
        })
        if(this.tempUp.enableLogo == 'C') {
			this.up_showStateDiv = false;
			this.up_showAssetDiv = false;
			this.up_showCurrencyDiv = true;
		}else if(this.tempUp.enableLogo == 'S') {
			this.up_showStateDiv = true;
			this.up_showAssetDiv = false;
			this.up_showCurrencyDiv = false;
		}else if(this.tempUp.enableLogo == 'A') {
			this.up_showAssetDiv = true;
			up_showStateDiv = false;
			this.up_showCurrencyDiv = false;
		}
    }, 
    // 确定 修改
    updateData() {
        this.$refs['refUp'].validate((valid) => {
            if (valid) {
                if(this.tempUp.enableLogo=="S"){
				    delete this.tempUp.startAssetTransitionPhase;
                    delete this.tempUp.targetAssetTransitionPhase;
                    delete this.tempUp.sameCurrency;
                }else if(this.tempUp.enableLogo=="A"){
                    delete this.tempUp.lastSettleState;
                    delete this.tempUp.settleState;
                    delete this.tempUp.sameCurrency;
                }else if(this.tempUp.enableLogo=="C"){
                    delete this.tempUp.lastSettleState;//原核算状态
                    delete this.tempUp.settleState;//目标核算状态
                    delete this.tempUp.startAssetTransitionPhase;//原资产转变阶段
                    delete this.tempUp.targetAssetTransitionPhase;//目标资产转变阶段
                }
                console.log(this.tempUp)
                this.post('/beta/betaService/COS.UP.02.0095', this.tempUp, (res) => {
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
    getEnableLogo(val) {
        if (val == 'C') { // 启用币种
            this.up_showStateDiv = false
            this.up_showAssetDiv = false
            this.up_showCurrencyDiv = true
            this.tempUp.lastSettleState = ''
            this.tempUp.startAssetTransitionPhase = ''
            this.tempUp.targetAssetTransitionPhase = ''

        } else if (val == 'S') { // 启用核算状态
            this.up_showStateDiv = true
            this.up_showAssetDiv = false
            this.up_showCurrencyDiv = false
            this.tempUp.sameCurrency = ''
            this.tempUp.startAssetTransitionPhase = ''
            this.tempUp.targetAssetTransitionPhase = ''
        } else if (val == 'A') { // 启用资产转变阶段
            this.up_showStateDiv = false
            this.up_showAssetDiv = true
            this.up_showCurrencyDiv = false
            this.tempUp.settleState = ''
            this.tempUp.lastSettleState = ''
            this.tempUp.sameCurrency = ''
        }

    },
    // 删除 按钮
    handleDelete(row) {
        console.log(row)
        this.tempDel = row
        this.$confirm('是否删除该核算子场景?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => { // 是
            this.post('/beta/betaService/COS.UP.02.0065', this.tempDel, (res) => {
                if (res.returnCode == '000000') {
                    this.$notify({
                        title: 'Success',
                        message: '删除成功',
                        type: 'success',
                        duration: 2000
                    })
                    this.getList()
                }
            })
        }).catch(() => { // 否   

        });
    },
    
    
  }
}
</script>

<style>
    .cl_tr.el-form-item--medium .el-form-item__label {
        width: 20%;
    }
</style>

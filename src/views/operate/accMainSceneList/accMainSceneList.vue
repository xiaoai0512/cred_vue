<!-- 核算主场景 -->
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
            <el-form-item class="cl_td" label="主场景编号" prop="masterSceneSequence">
                <el-input v-model="queryFormObj.masterSceneSequence" class="wd200" type="text" />
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
            <el-table-column prop="masterSceneSequence" label="主场景编号" align="center"width="200">
                <template slot-scope="{row}">
                    <div v-if="row.subTableSequence">
                        <span class="tdDivL">
                            {{row.masterSceneSequence}}
                        </span>
                        <span class="tdDivR">
                            {{row.subTableSequence}}
                        </span>
                    </div>
                    <div v-else>
                        <span>{{row.masterSceneSequence}}</span>
                    </div>
                    
                </template>
            </el-table-column>
            <el-table-column prop="masterSceneDesc" label="场景描述" align="center" >
                <template slot-scope="{row}">
                    {{row.masterSceneDesc}}
                    {{row.subTableSequenceDesc}}
                </template>
            </el-table-column>
            <el-table-column prop="redAccountingFlag" label="红字标识" align="center" >
                <template slot-scope="{row}">
                    <span v-if="row.redAccountingFlag == 'R' ">红字</span>
					<span v-if="row.redAccountingFlag == 'N' "></span>
                </template>
            </el-table-column>
            <el-table-column prop="accountingRuleCode1" label="记账规则代码" align="center" >
                <template slot-scope="{row}">
                    <span v-if="row.accountingRuleCode1">{{row.accountingRuleCode1}}{{row.accountingRuleCode1Desc}}</span>
                    <span v-if="row.accountingRuleCode2">/ {{row.accountingRuleCode2}}{{row.accountingRuleCode2Desc}}</span>
                    <span v-if="row.accountingRuleCode3">/ {{row.accountingRuleCode3}}{{row.accountingRuleCode3Desc}}</span>
                    <span v-if="row.accountingRuleCode4">/ {{row.accountingRuleCode4}}{{row.accountingRuleCode4Desc}}</span>
                    <span v-if="row.accountingRuleCode5">/ {{row.accountingRuleCode5}}{{row.accountingRuleCode5Desc}}</span>
                </template>
            </el-table-column>

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
        <el-dialog title="新增" :visible.sync="dialogFormVisibleAdd" width="85%">
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
               <el-form-item class="cl_td red" label="事件编号" prop="masterSceneSequence">
                    <el-input v-model="tempAdd.masterSceneSequence" class="wd200" type="text" readonly @focus="queryEv()" />
                    <div class="search_button">
                        <el-button size="small" icon="el-icon-search" type="primary"  @click="queryEv()" >
                            查询
                        </el-button>
                    </div>
                </el-form-item>
                <el-form-item class="cl_td" label="核算主场景描述" prop="masterSceneDesc">
                    <el-input v-model="tempAdd.masterSceneDesc" class="wd200" type="text" readoly/>
                </el-form-item>
                <el-form-item class="cl_td" label="子场景序号" prop="subTableSequence">
                    <el-select v-model="tempAdd.subTableSequence" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in subTableSequenceOptions"
                        :key="index"
                        :label="item.subTableSequenceDesc"
                        :value="item.subTableSequence"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="红字标识" prop="redAccountingFlag">
                    <el-select v-model="tempAdd.redAccountingFlag" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in redAccountingFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td"
                    v-for="(ruleCode, index) in tempAdd.ruleCodes"
                    :label="'记账规则代码' + (Number(index)+1)"
                    :key="ruleCode.key"
                    :prop="'ruleCodes.' + index + '.value'"
                >
                    <!-- <el-input class="wd200" v-model="ruleCode.value"></el-input> -->
                    <el-select v-model="ruleCode.value" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in ruleCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>

                    <div class="search_button">
                        <el-button size="small"  @click.prevent="removeRuleCode(ruleCode)" >
                            删除
                        </el-button>
                    </div>
                </el-form-item> 
                <el-form-item class="cl_td" label="记账规则代码" >
                    <el-button class="el-icon-plus" type="primary" @click="addAcctRuleCode()">
                        新增记账规则代码
                    </el-button>
                </el-form-item>
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
                    <el-select v-model="tempDetail.operationMode" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode"
                        />
                    </el-select>
               </el-form-item>
               <el-form-item class="cl_td red" label="事件编号" prop="masterSceneSequence">
                    <el-input v-model="tempDetail.masterSceneSequence" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="核算主场景描述" prop="masterSceneDesc">
                    <el-input v-model="tempDetail.masterSceneDesc" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="子场景序号" prop="subTableSequence">
                    <el-input v-model="tempDetail.subTableSequence" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="红字标识" prop="redAccountingFlag">
                    <el-select v-model="tempDetail.redAccountingFlag" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in redAccountingFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="记账规则代码1" prop="'accountingRuleCode1"
                    v-if="tempDetail.accountingRuleCode1">
                    <el-select v-model="tempDetail.accountingRuleCode1" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in ruleCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item> 
                <el-form-item class="cl_td" label="记账规则代码2" prop="'accountingRuleCode2"
                    v-if="tempDetail.accountingRuleCode2">
                    <el-select v-model="tempDetail.accountingRuleCode2" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in ruleCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item> 
                <el-form-item class="cl_td" label="记账规则代码3" prop="'accountingRuleCode3"
                    v-if="tempDetail.accountingRuleCode3">
                    <el-select v-model="tempDetail.accountingRuleCode3" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in ruleCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item> 
                <el-form-item class="cl_td" label="记账规则代码4" prop="'accountingRuleCode4"
                    v-if="tempDetail.accountingRuleCode4">
                    <el-select v-model="tempDetail.accountingRuleCode4" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in ruleCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item> 
                <el-form-item class="cl_td" label="记账规则代码5" prop="'accountingRuleCode5"
                    v-if="tempDetail.accountingRuleCode5">
                    <el-select v-model="tempDetail.accountingRuleCode5" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in ruleCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item> 
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleDetail = false">
                    关闭
                </el-button>
            </div>
        </el-dialog>

        <!-- 修改 -->
        <el-dialog title="修改" :visible.sync="dialogFormVisibleUp" width="85%">
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
               <el-form-item class="cl_td red" label="事件编号" prop="masterSceneSequence">
                    <el-input v-model="tempUp.masterSceneSequence" class="wd200" type="text" readonly @focus="queryEv()" />
                    <div class="search_button">
                        <el-button size="small" icon="el-icon-search" type="primary"  @click="queryEv()" >
                            查询
                        </el-button>
                    </div>
                </el-form-item>
                <el-form-item class="cl_td" label="核算主场景描述" prop="masterSceneDesc">
                    <el-input v-model="tempUp.masterSceneDesc" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="子场景序号" prop="subTableSequence">
                    <el-select v-model="tempUp.subTableSequence" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in subTableSequenceOptions"
                        :key="index"
                        :label="item.subTableSequenceDesc"
                        :value="item.subTableSequence"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="红字标识" prop="redAccountingFlag">
                    <el-select v-model="tempUp.redAccountingFlag" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in redAccountingFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <!-- <el-form-item class="cl_td" label="记账规则代码1" prop="'accountingRuleCode1"
                    v-if="tempUp.accountingRuleCode1">
                    <el-select v-model="tempUp.accountingRuleCode1" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in ruleCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item> 
                <el-form-item class="cl_td" label="记账规则代码2" prop="'accountingRuleCode2"
                    v-if="tempUp.accountingRuleCode2">
                    <el-select v-model="tempUp.accountingRuleCode2" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in ruleCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item> 
                <el-form-item class="cl_td" label="记账规则代码3" prop="'accountingRuleCode3"
                    v-if="tempUp.accountingRuleCode3">
                    <el-select v-model="tempUp.accountingRuleCode3" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in ruleCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item> 
                <el-form-item class="cl_td" label="记账规则代码4" prop="'accountingRuleCode4"
                    v-if="tempUp.accountingRuleCode4">
                    <el-select v-model="tempUp.accountingRuleCode4" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in ruleCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item> 
                <el-form-item class="cl_td" label="记账规则代码5" prop="'accountingRuleCode5"
                    v-if="tempUp.accountingRuleCode5">
                    <el-select v-model="tempUp.accountingRuleCode5" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in ruleCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item>  -->
                <el-form-item class="cl_td"
                    v-for="(ruleCode, index) in tempUp.ruleCodes"
                    :label="'记账规则代码' + (Number(index)+1)"
                    :key="ruleCode.key"
                    :prop="'ruleCodes.' + index + '.value'"
                >
                    <el-select v-model="ruleCode.value" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in ruleCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                    <div class="search_button">
                        <el-button size="small"  @click.prevent="up_removeRuleCode(ruleCode)" >
                            删除
                        </el-button>
                    </div>
                </el-form-item> 
                <el-form-item class="cl_td" label="记账规则代码" >
                    <el-button class="el-icon-plus" type="primary" @click="up_addAcctRuleCode()">
                        新增记账规则代码
                    </el-button>
                </el-form-item>
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

        <!-- 查询事件 -->
        <el-dialog title="查询事件" :visible.sync="ev_dialog" width="65%">
            <el-form :model="ev_queryFormObj" >
                <el-form-item class="cl_td" label="事件编号" prop="eventId">
                    <el-input v-model="ev_queryFormObj.eventId" class="wd200" type="text" />

                </el-form-item>
                <el-form-item class="cl_td" label="事件描述" prop="eventDesc">
                    <el-input v-model="ev_queryFormObj.eventDesc" class="wd200" type="text" />
                </el-form-item>
                <div class="cl_tr text_center">
                    <el-button size="medium" icon="el-icon-search" type="primary" @click="ev_handleSearch()">查询</el-button>
                    <el-button size="medium" icon="el-icon-refresh" type="primary" @click="ev_reset">重置</el-button>
                </div>
            </el-form>
            <el-table
                v-loading = "ev_config.loading"
                :data="ev_tableData"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
                @current-change="ev_handleCurrChange"
                @row-click="ev_choosedCurr"
            >  
                <el-table-column width="55">
                    <template slot-scope="scope">
                    <el-radio v-model="ev_curRadio" :label="scope.row.eventNo">
                        <span class="el-radio__label"></span>
                    </el-radio>
                    </template>
                </el-table-column>
                <el-table-column prop="eventNo" label="事件编号" align="center" />
                <el-table-column prop="eventDesc" label="事件描述" align="center" />
            </el-table>
            <pagination v-show="ev_config.total>0" :total="ev_config.total" :page.sync="ev_config.pageNum" :limit.sync="ev_config.pageSize" @pagination="getEvList" />



            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="sureEv()">
                    确定
                </el-button>
                <el-button @click="ev_dialog = false">
                    关闭
                </el-button>
            </div>
        </el-dialog>
        
    </div>
</template>

<script>
import Pagination from "@/components/Pagination";

export default {
  name: 'accMainSceneList',
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
        subTableSequenceOptions: [], // 子场景序号
        redAccountingFlagOptions: [], // 红字标识
        ruleCodeOptions: [], // 记账规则代码
        
        // 增删改查
        tempAdd: {
            ruleCodes: [],
        }, // 新增
        rulesAdd: {},
        refAdd: {},
        tempUp: {
            ruleCodes: [],
        }, // 修改
        rulesUp: {},
        refUp: {},
        tempDetail: {
            ruleCodes: [],
        }, // 详情
        rulesDetail: {},
        refDetail: {},
        tempDel: {}, // 删除
        dialogFormVisibleAdd: false,
        dialogFormVisibleUp: false,
        dialogFormVisibleDetail: false,

        // 新增
        ev_dialog: false,
        ev_config: {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0
        },
        ev_tableData: [],
        ev_curRadio: '',
        ev_curObj: {},
        ev_queryFormObj: {},

       
        

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
    // 子场景序号
    this.getSelectDict( "/beta/betaService/COS.IQ.02.0095").then(res => {
        this.subTableSequenceOptions = res
    })
    // 红字标识
    this.getSelectDict( "dic_redAccountingFlag").then(res => {
        this.redAccountingFlagOptions = res
    })
    // 记账规则代码
    this.getSelectDict( "/beta/betaService/COS.IQ.02.0115").then(res => {
        res.forEach(item => {
            item.label = item.accountingRuleCode+ ' ' +item.accountingRuleDesc
            item.value = item.accountingRuleCode
        })
        this.ruleCodeOptions = res
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
                    if (this.btnAuthStr.includes('COS.IQ.02.0063')) { // 查询
                        this.selBtnFlag = true
                    } else {
                        this.selBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.AD.02.0066')) { // 新增
                        this.addBtnFlag = true
                    } else {
                        this.addBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.UP.02.0055')) { // 维护
                        this.updBtnFlag = true
                    } else {
                        this.updBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.UP.02.0064')) { // 删除
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
        let params = Object.assign({}, this.config, this.queryFormObj)
        this.getTableList('/beta/betaService/COS.IQ.02.0063',params ,(res) => {
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
        let arr = []
        for(let i = 0 ; i < this.tempAdd.ruleCodes.length ; i++) {
            arr.push(this.tempAdd.ruleCodes[i].value)
        }
        if (this.isRepeat(arr)) {
            this.$message({
                title: '提示',
                message: '记账规则代码不能重复',
                type: 'warning',
                duration: 2000
            })
            return
        }
        if (!this.tempAdd.masterSceneSequence) {
            this.$message({
                title: '提示',
                message: '事件编号不能为空',
                type: 'warning',
                duration: 2000
            })
            return
        }
        this.$refs['refAdd'].validate((valid) => {
        if (valid) {
            if(this.tempAdd.ruleCodes[0]) {
                this.tempAdd.accountingRuleCode1 = this.tempAdd.ruleCodes[0].value
            }
            if(this.tempAdd.ruleCodes[1]) {
                this.tempAdd.accountingRuleCode2 = this.tempAdd.ruleCodes[1].value
            }
            if(this.tempAdd.ruleCodes[2]) {
                this.tempAdd.accountingRuleCode3 = this.tempAdd.ruleCodes[2].value
            }
            if(this.tempAdd.ruleCodes[3]) {
                this.tempAdd.accountingRuleCode4 = this.tempAdd.ruleCodes[3].value
            }
            if(this.tempAdd.ruleCodes[4]) {
                this.tempAdd.accountingRuleCode5 = this.tempAdd.ruleCodes[4].value
            }
            console.log(this.tempAdd)
            this.post('/beta/betaService/COS.AD.02.0066', this.tempAdd, (res) => {
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
    isRepeat(arr) {
      var hash = {};
      for(var i in arr) {
        if(hash[arr[i]]) {
          return true;
        }
        // 不存在该元素，则赋值为true，可以赋任意值，相应的修改if判断条件即可
        hash[arr[i]] = true;
      }
      return false;
    },
    // 查询事件
    queryEv() {
        this.ev_dialog = true
        this.getEvList()
    },
    getEvList() {
        this.ev_config.loading = true
        let params = Object.assign({}, this.ev_config, this.ev_queryFormObj )
        this.getTableList('/beta/betaService/COS.IQ.02.0001', params ,(res) => {
            if (res.returnCode == '000000') {
                this.ev_config.loading = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    let rows = res.returnData.rows
                    this.ev_tableData = rows
                    this.ev_config.total = res.returnData.totalCount
                    
                } else {
                    this.ev_tableData = []

                }
            }
        })
    },
    ev_handleCurrChange(val) {
        this.ev_curObj = val
    },
    ev_choosedCurr(val) {
        this.ev_curRadio = val.eventNo
        this.ev_curObj = val
    },
    sureEv() {
        this.ev_dialog = false
        this.tempAdd.masterSceneSequence = this.ev_curObj.eventNo
        this.tempAdd.masterSceneDesc = this.ev_curObj.eventDesc
    },
    ev_handleSearch() {
        this.getEvList()
    },
    ev_reset() {
        this.ev_queryFormObj.eventId = ''
        this.ev_queryFormObj.eventDesc = ''

    },

    // 新增记账规则代码 按钮
    addAcctRuleCode() {
        if (this.tempAdd.ruleCodes.length >= 5 ) {
            this.$message({
                title: '提示',
                message: '最多添加5个记账规则代码',
                type: 'warning',
                duration: 2000
            })
            return
        }
        this.tempAdd.ruleCodes.push({
            value: '',
            key: Date.now()
        });
    },
    // 删除
    removeRuleCode(item) {
        var index = this.tempAdd.ruleCodes.indexOf(item)
        if (index !== -1) {
        this.tempAdd.ruleCodes.splice(index, 1)
        }
    },
    // 详情 按钮
    handleDetail(row) {
        this.dialogFormVisibleDetail = true
        this.tempDetail = Object.assign({}, row) // 
        this.$nextTick(() => {
            this.$refs['refDetail'].clearValidate()
        })
    },
    // 修改 按钮
    handleUpdate(row) {
        this.tempUp = Object.assign(this.tempUp, row)
        this.dialogFormVisibleUp = true
        this.$nextTick(() => {
            this.$refs['refUp'].clearValidate()
        })
        if (row.accountingRuleCode1) {
            this.tempUp.ruleCodes.push({
                value: row.accountingRuleCode1,
                key:Date.now()
            })
        }
        if (row.accountingRuleCode2) {
            this.tempUp.ruleCodes.push({
                value: row.accountingRuleCode2,
                key:Date.now()
            })
        }
        if (row.accountingRuleCode3) {
            this.tempUp.ruleCodes.push({
                value: row.accountingRuleCode3,
                key:Date.now()
            })
        }
        if (row.accountingRuleCode4) {
            this.tempUp.ruleCodes.push({
                value: row.accountingRuleCode4,
                key:Date.now()
            })
        }
        if (row.accountingRuleCode5) {
            this.tempUp.ruleCodes.push({
                value: row.accountingRuleCode5,
                key:Date.now()
            })
        }
        
    }, 

    // 修改 记账规则代码 按钮
    up_addAcctRuleCode() {
        if (this.tempUp.ruleCodes.length >= 5 ) {
            this.$message({
                title: '提示',
                message: '最多添加5个记账规则代码',
                type: 'warning',
                duration: 2000
            })
            return
        } else {
            this.tempUp.ruleCodes.push({
                value: '',
                key: Date.now()
            });
        }
        
    },
    // 删除
    up_removeRuleCode(item) {
        var index = this.tempUp.ruleCodes.indexOf(item)
        if (index !== -1) {
            this.tempUp.ruleCodes.splice(index, 1)
        }
    },
    // 确定 修改
    updateData() {
        let arr = []
        for(let i = 0 ; i < this.tempUp.ruleCodes.length ; i++) {
            arr.push(this.tempUp.ruleCodes[i].value)
        }
        if (this.isRepeat(arr)) {
            this.$message({
                title: '提示',
                message: '记账规则代码不能重复',
                type: 'warning',
                duration: 2000
            })
            return
        }
        if (!this.tempUp.masterSceneSequence) {
            this.$message({
                title: '提示',
                message: '事件编号不能为空',
                type: 'warning',
                duration: 2000
            })
            return
        }
        this.$refs['refUp'].validate((valid) => {
            if (valid) {
                if(this.tempUp.ruleCodes[0]) {
                    this.tempUp.accountingRuleCode1 = this.tempUp.ruleCodes[0].value
                }
                if(this.tempUp.ruleCodes[1]) {
                    this.tempUp.accountingRuleCode2 = this.tempUp.ruleCodes[1].value
                }
                if(this.tempUp.ruleCodes[2]) {
                    this.tempUp.accountingRuleCode3 = this.tempUp.ruleCodes[2].value
                }
                if(this.tempUp.ruleCodes[3]) {
                    this.tempUp.accountingRuleCode4 = this.tempUp.ruleCodes[3].value
                }
                if(this.tempUp.ruleCodes[4]) {
                    this.tempUp.accountingRuleCode5 = this.tempUp.ruleCodes[4].value
                }
                this.post('/beta/betaService/COS.UP.02.0055', this.tempUp, (res) => {
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
    // 删除 按钮
    handleDelete(row) {
        console.log(row)
        this.tempDel = row
        this.$confirm('是是否删除该核算主场景?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => { // 是
            this.post('/beta/betaService/COS.UP.02.0064', this.tempDel, (res) => {
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
    .tdDivL {
        width: 65%;
    }
    .tdDivR {
        width: 30%;
    }
</style>

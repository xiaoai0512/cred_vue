<!-- 核算状态码 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
            :rules="[ { required: true, message: '运营模式不能为空'} ]">
                <el-select v-model="queryFormObj.operationMode" class="wd200" >
                <el-option
                    v-for="(item, index ) in operationModeOptions"
                    :key="index"
                    :label="item.modeName"
                    :value="item.operationMode"
                />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="核算状态码" prop="accountingStatus">
                <el-input v-model="queryFormObj.accountingStatus" class="wd200" type="text" />
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" v-show="selBtnFlag">查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate" v-show="addBtnFlag">新增</el-button>
            </div>
        </el-form>
        <el-table v-loading = "listLoading1" :data="tablesList" border stripe style="width: 100%">
            <el-table-column prop="operationMode" label="运营模式" width="180" align="center">
                <template slot-scope="scope">
                    <span >{{scope.row.operationMode}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="nodeDesc" label="核算状态码" width="180" align="center">
                <template slot-scope="scope" >
                    <span class="tdDivL ">{{scope.row.accountingStatus}}&nbsp;&nbsp;</span>
                    <span class="tdDivR ">{{scope.row.accountingDesc}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="prevAccountingStatus" label="前核算状态" align="center">
               <template slot-scope="scope">
                    <span class="">{{scope.row.prevAccountingStatus}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="nextAccountingStatus" label="后核算状态" align="center">
                <template slot-scope="scope">
                    <span class="">{{scope.row.nextAccountingStatus}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="blockCodeType" label="功能管控码" align="center">
                <template slot-scope="scope">
                    <span class="">{{scope.row.blockCodeType}}</span>
                    <span class="">{{scope.row.blockCodeScene}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="rollBackDesc" label="是否可回滚" align="center">   
                <template slot-scope="scope">
                    <span class="">{{scope.row.rollBackDesc}}</span>
                </template>
            </el-table-column><!--feeIncomeRecognitionStageDesc-->
            <el-table-column prop="feeIncomeRecognitionStageDesc" label="费用收入确认阶段" align="center">
                <template slot-scope="scope">
                    <span class="">{{scope.row.feeIncomeRecognitionStageDesc}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="intIncomeRecognitionStageDesc" label="利息收入确认阶段" align="center">
                <template slot-scope="scope">
                    <span class="">{{scope.row.intIncomeRecognitionStageDesc}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="subjectStatusDesc" label="科目属性" align="center">
                <template slot-scope="scope">
                    <span class="">{{scope.row.subjectStatusDesc}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="nonPerformingAssetsDesc" label="不良资产" align="center">
                <template slot-scope="scope">
                    <span class="">{{scope.row.nonPerformingAssetsDesc}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="" label="操作" align="center" width = "350">
                <template slot-scope="{row}">
                    <el-button size="mini" icon="el-icon-more" type="primary" @click="handleDetail(row)" v-show="selBtnFlag">详情</el-button>
                    <el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleUpdate(row)" v-show="updBtnFlag">修改</el-button>
<!--                    <el-button size="mini" icon="el-icon-document-copy" v-show="selBtnFlag" type="primary" @click="handleCopy(row)">复制</el-button>
-->                </template> 
            </el-table-column>
        </el-table>
        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
        <!-- 新增 -->
        <el-dialog title="核算状态建立" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="dataFormAdd" :model="accountingAdd" label-position="right" label-width="160px" style="display: inline-block;">
                <el-form-item label="运营模式 " prop="operationMode" class="cl_td" :rules="[ { required: true, message: '运营模式不能为空'} ]">
                    <el-select v-model="accountingAdd.operationMode" class="filter-item" placeholder="请选择">
                        <el-option 
                            v-for="(item, index ) in operationModeOptions" 
                            :key="index" 
                            :label="item.modeName"
                            :value="item.operationMode"/>
                    </el-select>
                </el-form-item>
                <el-form-item  prop="operationMode" class="cl_td" >
                    <div></div>
                </el-form-item>
                <el-form-item class="cl_td" label="核算状态码" prop="accountingStatus" :rules="[ { required: true, message: '核算状态码不能为空'} ]">
                    <el-input v-model="accountingAdd.accountingStatus" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="accountingDesc" :rules="[ { required: true, message: '描述不能为空'} ]">
                    <el-input v-model="accountingAdd.accountingDesc" class="wd200" type="text"/>
                </el-form-item>
                <el-form-item class="cl_td" label="前核算状态" prop="prevAccountingStatus">
                    <el-input v-model="accountingAdd.prevAccountingStatus" class="wd200" type="text"/>
                </el-form-item>
                
                </el-form-item><el-form-item class="cl_td" label="后核算状态" prop="nextAccountingStatus">
                    <el-input v-model="accountingAdd.nextAccountingStatus" class="wd200" type="text"/>
                </el-form-item>
                <el-form-item label="管控码类别 " prop="blockCodeType" class="cl_td">
                    <el-select v-model="accountingAdd.blockCodeType" class="filter-item" placeholder="请选择" @change="getControlChange(accountingAdd.blockCodeType)">
                        <el-option 
                            v-for="(item, index ) in blockCodeTypeOptions" 
                            :key="index" 
                            :label="item.detailDesc"
                            :value="item.codes" readonly />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="管控码场景" prop="effectivenessCodeScene" >
                    <el-select v-model="accountingAdd.effectivenessCodeScene" class="wd200" clearable  readonly>
                        <el-option
                            v-for="(item, index ) in blockCodeSceneOptions"
                            :key="index"
                            :label="item.label"
                            :value="item.effectivenessCodeScene" readonly />
                    </el-select>
                </el-form-item>
                <el-form-item label="是否可回滚" prop="rollBack" class="cl_td" 
                    :rules="[ { required: true, message: '是否可回滚不能为空'} ]">
                    <el-select v-model="accountingAdd.rollBack" class="filter-item" placeholder="请选择">
                        <el-option 
                            v-for="(item, index ) in rollBackOptions" 
                            :key="index" 
                            :label="item.detailDesc"
                            :value="item.codes" readonly />
                    </el-select>
                </el-form-item>
                </el-form-item><el-form-item label="费用收入确认阶段" prop="feeIncomeRecognitionStage" class="cl_td" >
                    <el-select v-model="accountingAdd.feeIncomeRecognitionStage" class="filter-item" placeholder="请选择">
                        <el-option 
                            v-for="(item, index ) in feeIncomeRecognitionStageOptions" 
                            :key="index" 
                            :label="item.detailDesc"
                            :value="item.codes"  />
                    </el-select>
                </el-form-item>
                </el-form-item><el-form-item label="利息收入确认阶段" prop="intIncomeRecognitionStage" class="cl_td">
                    <el-select v-model="accountingAdd.intIncomeRecognitionStage" class="filter-item" placeholder="请选择">
                        <el-option 
                            v-for="(item, index ) in intIncomeRecognitionStageOptions" 
                            :key="index" 
                            :label="item.detailDesc"
                            :value="item.codes"  /> 
                    </el-select>
                </el-form-item>
                </el-form-item><el-form-item label="科目属性" prop="subjectStatus" class="cl_td" >
                    <el-select v-model="accountingAdd.subjectStatus" class="filter-item" placeholder="请选择">
                        <el-option 
                            v-for="(item, index ) in subjectStatusOptions" 
                            :key="index" 
                            :label="item.detailDesc"
                            :value="item.codes" /> 
                    </el-select>
                </el-form-item>
                </el-form-item><el-form-item label="不良资产" prop="nonPerformingAssets" class="cl_td" >
                    <el-select v-model="accountingAdd.nonPerformingAssets" class="filter-item" placeholder="请选择">
                        <el-option 
                            v-for="(item, index ) in nonPerformingAssetsOptions" 
                            :key="index" 
                            :label="item.detailDesc"
                            :value="item.codes"  /> 
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleAdd = false">关闭</el-button>
                <el-button type="primary" @click="addAccountingData()">确定</el-button>
            </div>
        </el-dialog>
        <!--修改-->
        <el-dialog title="核算状态修改" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :model="accountingUp" label-position="right" label-width="160px" style="display: inline-block;">
                <el-form-item label="运营模式 " prop="operationMode" class="cl_td" :rules="[ { required: true, message: '运营模式不能为空'} ]">
                    <el-select v-model="accountingUp.operationMode" class="filter-item" placeholder="请选择" disabled>
                        <el-option 
                            v-for="(item, index ) in operationModeOptions" 
                            :key="index" 
                            :label="item.modeName"
                            :value="item.operationMode"/>
                    </el-select>
                </el-form-item>
                <el-form-item  prop="operationMode" class="cl_td" >
                    <div></div>
                </el-form-item>
                <el-form-item class="cl_td"  label="核算状态码" prop="accountingStatus" :rules="[ { required: true, message: '核算状态码不能为空'} ]">
                    <el-input v-model="accountingUp.accountingStatus" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="accountingDesc" :rules="[ { required: true, message: '描述不能为空'} ]">
                    <el-input v-model="accountingUp.accountingDesc" class="wd200" type="text"/>
                </el-form-item>
                <el-form-item class="cl_td" label="前核算状态" prop="prevAccountingStatus">
                    <el-input v-model="accountingUp.prevAccountingStatus" class="wd200" type="text"/>
                </el-form-item>
                
                </el-form-item><el-form-item class="cl_td" label="后核算状态" prop="nextAccountingStatus">
                    <el-input v-model="accountingUp.nextAccountingStatus" class="wd200" type="text"/>
                </el-form-item>
                <el-form-item label="管控码类别 " prop="blockCodeType" class="cl_td">
                    <el-select v-model="accountingUp.blockCodeType" class="filter-item" placeholder="请选择" @change="getControlChange(accountingUp.blockCodeType)">
                        <el-option 
                            v-for="(item, index ) in blockCodeTypeOptions" 
                            :key="index" 
                            :label="item.detailDesc"
                            :value="item.codes" readonly />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="管控码场景" prop="blockCodeScene" >
                    <el-select v-model="accountingUp.blockCodeScene" class="wd200" clearable  readonly>
                        <el-option
                            v-for="(item, index ) in blockCodeSceneOptions"
                            :key="index"
                            :label="item.label"
                            :value="item.effectivenessCodeScene" readonly />
                    </el-select>
                </el-form-item>
                <el-form-item label="是否可回滚" prop="rollBack" class="cl_td" 
                    :rules="[ { required: true, message: '是否可回滚不能为空'} ]">
                    <el-select v-model="accountingUp.rollBack" class="filter-item" placeholder="请选择">
                        <el-option 
                            v-for="(item, index ) in rollBackOptions" 
                            :key="index" 
                            :label="item.detailDesc"
                            :value="item.codes" readonly />
                    </el-select>
                </el-form-item>
                </el-form-item><el-form-item label="费用收入确认阶段" prop="feeIncomeRecognitionStage" class="cl_td" >
                    <el-select v-model="accountingUp.feeIncomeRecognitionStage" class="filter-item" placeholder="请选择">
                        <el-option 
                            v-for="(item, index ) in feeIncomeRecognitionStageOptions" 
                            :key="index" 
                            :label="item.detailDesc"
                            :value="item.codes"  />
                    </el-select>
                </el-form-item>
                </el-form-item><el-form-item label="利息收入确认阶段" prop="intIncomeRecognitionStage" class="cl_td">
                    <el-select v-model="accountingUp.intIncomeRecognitionStage" class="filter-item" placeholder="请选择">
                        <el-option 
                            v-for="(item, index ) in intIncomeRecognitionStageOptions" 
                            :key="index" 
                            :label="item.detailDesc"
                            :value="item.codes"  /> 
                    </el-select>
                </el-form-item>
                </el-form-item><el-form-item label="科目属性" prop="subjectStatus" class="cl_td" >
                    <el-select v-model="accountingUp.subjectStatus" class="filter-item" placeholder="请选择">
                        <el-option 
                            v-for="(item, index ) in subjectStatusOptions" 
                            :key="index" 
                            :label="item.detailDesc"
                            :value="item.codes"  /> 
                    </el-select>
                </el-form-item>
                </el-form-item><el-form-item label="不良资产" prop="nonPerformingAssets" class="cl_td" >
                    <el-select v-model="accountingUp.nonPerformingAssets" class="filter-item" placeholder="请选择">
                        <el-option 
                            v-for="(item, index ) in nonPerformingAssetsOptions" 
                            :key="index" 
                            :label="item.detailDesc"
                            :value="item.codes"  /> 
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleUp = false">关闭</el-button>
                <el-button type="primary" @click="upAccountingData()">确定</el-button>
            </div>
        </el-dialog>
        <!--详情-->
        <el-dialog title="核算状态详细信息" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail" :model="accountingDetail" :rules="rulesDetail" label-position="right" label-width="160px" style="display: inline-block;">
                <el-form-item label="运营模式 " prop="operationMode" class="cl_td" >
                    <el-select v-model="accountingDetail.operationMode" class="filter-item" readonly disabled placeholder="请选择">
                        <el-option 
                            v-for="(item, index ) in operationModeOptions" 
                            :key="index" 
                            :label="item.modeName"
                            :value="item.operationMode" readonly/>
                    </el-select>
                </el-form-item>
                <el-form-item  prop="operationMode" class="cl_td" >
                    <div></div>
                </el-form-item>
                <el-form-item class="cl_td" label="核算状态码" prop="accountingStatus">
                    <el-input v-model="accountingDetail.accountingStatus" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="accountingDesc" >
                    <el-input v-model="accountingDetail.accountingDesc" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="前核算状态" prop="prevAccountingStatus">
                    <el-input v-model="accountingDetail.prevAccountingStatus" class="wd200" type="text" readonly/>
                </el-form-item>
                </el-form-item><el-form-item class="cl_td" label="后核算状态" prop="nextAccountingStatus">
                    <el-input v-model="accountingDetail.nextAccountingStatus" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item label="管控码类别 " prop="blockCodeType" class="cl_td">
                    <el-select v-model="accountingDetail.blockCodeType"  readonly disabled class="filter-item" placeholder="请选择" @change="getControlChange(accountingDetail.blockCodeType)">
                        <el-option 
                            v-for="(item, index ) in blockCodeTypeOptions" 
                            :key="index" 
                            :label="item.detailDesc"
                            :value="item.codes" readonly disabled />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="管控码场景" prop="blockCodeScene">
                    <el-select v-model="accountingDetail.blockCodeScene" class="wd200" disabled>
                        <el-option
                            v-for="(item, index ) in blockCodeSceneOptions"
                            :key="index"
                            :label="item.label"
                            :value="item.effectivenessCodeScene" disabled />
                    </el-select>
                </el-form-item>
                <el-form-item label="是否可回滚" prop="rollBack" class="cl_td" >
                    <el-select v-model="accountingDetail.rollBack" class="filter-item" readonly disabled placeholder="请选择">
                        <el-option 
                            v-for="(item, index ) in rollBackOptions" 
                            :key="index" 
                            :label="item.detailDesc"
                            :value="item.codes" readonly />
                    </el-select>
                </el-form-item>
               <el-form-item label="费用收入确认阶段" prop="feeIncomeRecognitionStage" class="cl_td" >
                    <el-select v-model="accountingDetail.feeIncomeRecognitionStage" class="filter-item" readonly disabled placeholder="请选择">
                        <el-option 
                            v-for="(item, index ) in feeIncomeRecognitionStageOptions" 
                            :key="index" 
                            :label="item.detailDesc"
                            :value="item.codes"  readonly/>
                    </el-select>
                </el-form-item>
                </el-form-item><el-form-item label="利息收入确认阶段" prop="intIncomeRecognitionStage" class="cl_td">
                    <el-select v-model="accountingDetail.intIncomeRecognitionStage" readonly disabled class="filter-item" placeholder="请选择">
                        <el-option 
                            v-for="(item, index ) in intIncomeRecognitionStageOptions" 
                            :key="index" 
                            :label="item.detailDesc"
                            :value="item.codes"  readonly/> 
                    </el-select>
                </el-form-item>
                </el-form-item><el-form-item label="科目属性" prop="subjectStatus" class="cl_td" >
                    <el-select v-model="accountingDetail.subjectStatus" class="filter-item" placeholder="请选择" disabled >
                        <el-option 
                            v-for="(item, index ) in subjectStatusOptions" 
                            :key="index" 
                            :label="item.detailDesc"
                            :value="item.codes" /> 
                    </el-select>
                </el-form-item>
                </el-form-item><el-form-item label="不良资产" prop="nonPerformingAssets" class="cl_td" >
                    <el-select v-model="accountingDetail.nonPerformingAssets" class="filter-item" placeholder="请选择" disabled>
                        <el-option 
                            v-for="(item, index ) in nonPerformingAssetsOptions" 
                            :key="index" 
                            :label="item.detailDesc"
                            :value="item.codes" /> 
                    </el-select>
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
  name: 'tablesList',
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
      queryFormObj: {
          pageNum: 1,
          pageSize:10,
      },
      listLoading1: false,
      queryFormRef: {},
      queryFormRules: {},      
      tablesList: [],
      tableTotal: 0,


      // 下拉框
        operationModeOptions: [], //运营模式
        blockCodeSceneOptions: [],//管控码场景
        blockCodeTypeOptions: [],//管控码类别
        rollBackOptions: [],//是否可回滚
        feeIncomeRecognitionStageOptions:[],//费用收入确认阶段
        intIncomeRecognitionStageOptions: [],//利息收入确认阶段
        nonPerformingAssetsOptions:[],//不良资产
        subjectStatusOptions:[],//科目属性
        
      // 增删改查
      accountingAdd: {}, // 新增
      accountingUp: {}, // 修改
      accountingDetail: {}, // 详情
      dataFormDetail: {},
      dialogFormVisibleAdd: false,
      dialogFormVisibleUp: false,
      dialogFormVisibleDetail: false,
      rulesAdd: {},
      rulesDetail: {},
      rulesUp: {},

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
    //管控码类别
    this.getSelectDict( "dic_effectiveCodeType").then(res => {
        this.blockCodeTypeOptions = res
    })
    //是否可回滚
    this.getSelectDict( "dic_rollBACK").then(res => {
        this.rollBackOptions = res
    })
    //费用收入确认阶段
    this.getSelectDict( "dic_revenueRecognitionStage").then(res => {
        this.feeIncomeRecognitionStageOptions = res
    })
    //利息收入确认阶段
    this.getSelectDict( "dic_revenueRecognitionStage").then(res => {
        this.intIncomeRecognitionStageOptions = res
    })
    //科目属性
     this.getSelectDict( "dic_absStatus").then(res => {
        this.subjectStatusOptions = res

    })
     //不良资产
     this.getSelectDict( "dic_isYorN").then(res => {
        this.nonPerformingAssetsOptions = res
    })
     //管控码场景
    this.getSelectDict( "/beta/betaService/COS.IQ.02.0023").then(res => {
        res.forEach(item => {
            item.label = item.effectivenessCodeScene + ' ' + item.effectivenessCodeDesc
        });
        this.blockCodeSceneOptions = res
    })
    
  },
    methods: {
        //管控码类别关联管控码场景
        getControlChange(val) {
           this.controlQuery(val)
        },
        //管控码场景
        controlQuery(val){
            let obj = {
                effectivenessCodeType: val
            }
            this.post( "/beta/betaService/COS.IQ.02.0023", obj ,(res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        let rowss = res.returnData.rows
                        rowss.forEach(item => {
                            item.label = item.effectivenessCodeScene+ ' '+ item.effectivenessCodeDesc
                        })
                        this.blockCodeSceneOptions = rowss
                    } else {
                        this.blockCodeSceneOptions = []
                    }
                }
            })
        },
      // 查询按钮权限
    getBtnAuth() {
        let params= {
            menuNo : window.sessionStorage.getItem('menuNo')
        }
        this.getTableList('/beta/betaService/COS.CS.01.0030', params ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.length > 0 ) {
                    res.returnData.forEach(item => {
                        this.btnAuthStr += item.eventNo+','
                    })
                    if (this.btnAuthStr.includes('COS.IQ.02.0051')) { // 查询
                        this.selBtnFlag = true
                    } else {
                        this.selBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.AD.02.0043')) { // 新增
                        this.addBtnFlag = true
                    } else {
                        this.addBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.UP.02.0046')) { // 维护
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
        let params = {
            isTrans: true,
            transParams:['dis_nonPerformingAssets', 'dic_accountAttribute','dic_revenueRecognitionStage','dic_revenueRecognitionStage','dic_rollBACK'],
            transDict : ['nonPerformingAssets','subjectStatus','feeIncomeRecognitionStage','intIncomeRecognitionStage','rollBack']
        }
        this.queryFormObj = Object.assign(this.queryFormObj, params)
        this.getTableList('/beta/betaService/COS.IQ.02.0051', this.queryFormObj ,(res) => {
            if (res.returnCode == '000000') {
                this.listLoading1 = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.tablesList = res.returnData.rows
                    this.tableTotal = res.returnData.totalCount
                } else {
                    this.tablesList = []
                    this.tableTotal = 0
                }   
            }
        }, (err) => {
      		this.tablesList = []
       		this.tableTotal = 0
       		this.listLoading1 = false
        })
    },
    //查询
    handleSearch() {
        this.queryFormObj.pageNum = 1
        this.getList()
    },
    //显示新增弹框
    handleCreate() {
        this.dialogFormVisibleAdd = true
        this.$nextTick(() => {
            this.$refs['dataFormAdd'].clearValidate()
      })
    }, 
    //提交新增数据
    addAccountingData() {
        this.$refs['dataFormAdd'].validate((valid) => {
        if (valid) {
            this.post('/beta/betaService/COS.AD.02.0043', this.accountingAdd, (res) => {
                 if (res.returnCode == '000000') {
                  
                    this.dialogFormVisibleAdd = false
                    this.$notify({
                    title: 'Success',
                    message: '新增成功',
                    type: 'success',
                    duration: 2000
                    })
                    this.getList()
                    this.accountingAdd = {}
                }
            
          })
        }
      })
    },  
    //显示详情弹框
    handleDetail(row) {
        this.accountingDetail = Object.assign({}, row) // 
        // 根据管控码类别查询管控码场景
        this.controlQuery(this.accountingDetail.blockCodeType)
        this.dialogFormVisibleDetail = true
        this.$nextTick(() => {
            this.$refs['dataFormDetail'].clearValidate()
        })
    },
    //显示修改弹框
    handleUpdate(row) {
        this.accountingUp = Object.assign({}, row)
        this.dialogFormVisibleUp = true
        this.$nextTick(() => {
            this.$refs['dataFormUp'].clearValidate()
        })
    }, 
    //提交修改数据
    upAccountingData() {
        this.$refs['dataFormUp'].validate((valid) => {
            if (valid) {
              
                this.post('/beta/betaService/COS.UP.02.0046', this.accountingUp, (res) => {
                     if (res.returnCode == '000000') {
                         this.dialogFormVisibleUp = false
                        this.$notify({
                        title: 'Success',
                        message: '修改成功',
                        type: 'success',
                        duration: 2000
                        })
                        this.getList() 
                        this.accountingUp = {}
                    }
                })
            }
        })
    },
   }
}
</script>

<style>
</style>

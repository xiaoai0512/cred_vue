<!-- 产品参数维护 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormObjRules">
            <el-form-item class="cl_td" label="运营模式" prop="systemUnitNo">
                <el-select v-model="queryFormObj.operationMode" class="wd200" clearable >
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode"
                    />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="产品代码" prop="productObjectCode">
                <el-input v-model="queryFormObj.productObjectCode" class="wd200" type="text" />
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="getList" v-show="selBtnFlag">查询</el-button>
                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="reset">重置</el-button>
            </div>
        </el-form>
        <el-table
            v-loading = "tableLoading"
            :data="tableList"
            class="mbtm20"
            fit
            highlight-current-row
            style="width: 100%;"
            border
        >
            <el-table-column prop="operationMode" label="运营模式" align="center" />
            <el-table-column prop="productObjectCode" label="产品代码" align="center" />
            <el-table-column prop="productDesc" label="产品描述" align="center" />
            <el-table-column prop="binNo" label="发行卡BIN" align="center" />
            <el-table-column prop="paymentPriority" label="还款优先级" align="center" />
            <el-table-column prop="segmentNumber" label="特殊号码段" align="center" />
            <el-table-column prop="" label="操作" align="center" width = "350">
                <template slot-scope="{row}">
                    <el-button size="mini" icon="el-icon-more" type="primary" @click="handleDetail(row)" v-show="selBtnFlag">详情</el-button>
                    <el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleUpdate(row)" v-show="updBtnFlag">修改</el-button>
                </template> 
            </el-table-column>
        </el-table>
        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
    


        <!-- 详情 弹窗-->
        <el-dialog title="产品详细信息" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail" :rules="rulesDetail" :model="tempDetail" >
                <el-form-item class="cl_td" label="运营模式" prop="operationMode"
                :rules="[ { required: true, message: '运营模式不能为空'}]" >
                    <el-input v-model="tempDetail.operationMode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="产品代码" prop="productObjectCode"
                :rules="[ { required: true, message: '产品代码不能为空'} ]" >
                    <el-input v-model="tempDetail.productObjectCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="产品描述" prop="productDesc">
                    <el-input v-model="tempDetail.productDesc" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="发行卡BIN" prop="binNo">
                    <el-input v-model="tempDetail.binNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="还款优先级" prop="paymentPriority">
                    <el-input v-model="tempDetail.paymentPriority" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="产品期限(月)" prop="productTimeLimit">
                    <el-input v-model="tempDetail.productTimeLimit" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="特殊号码段号" prop="segmentNumber">
                    <el-select v-model="tempDetail.segmentNumber" class="wd200" clearable disabled>
                      <el-option
                        v-for="(item, index ) in segmentNumberOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                 <el-form-item class="cl_td" label="套卡对方产品对象代码" prop="productCodeSet" >
                    <el-select v-model="tempDetail.productCodeSet" class="wd200" clearable disabled>
                      <el-option
                        v-for="(item, index ) in productCodeSetOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="默认业务类型" prop="defaultBusinessItem">
                    <el-input v-model="tempDetail.defaultBusinessItem" class="wd200" type="text" readonly/>
                </el-form-item>
            </el-form>
            <div class="text_title padLf10">已选业务项目</div>
            <el-table
                v-loading = "detail_loading1"
                :data="detail_list"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
            >
                <el-table-column prop="operationMode" label="运营模式" align="center" />
                <el-table-column prop="businessProgramNo" label="业务项目代码" align="center" />
                <el-table-column prop="businessDesc" label="业务项目代码" align="center" />
                </el-table>
            <pagination v-show="detail_tableTotal>0" :total="detail_tableTotal" :page.sync="detail_tableObj.pageNum" :limit.sync="detail_tableObj.pageSize" @pagination="detail_getList(tempDetail)" />
           <div class="text_title padLf10">已选择卡版面</div>
            <el-table
                v-loading = "detail_loading2"
                :data="detail_list2"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
            >
                <el-table-column prop="operationMode" label="运营模式" align="center" />
                <el-table-column prop="formatCode" label="卡版面代码" align="center" />
                <el-table-column prop="formatDescribe" label="卡版面描述" align="center" />
                </el-table>
            <pagination v-show="detail_tableTotal2>0" :total="detail_tableTotal2" :page.sync="detail_tableObj2.pageNum" :limit.sync="detail_tableObj2.pageSize" @pagination="detail_getList2(tempDetail)" />
            <div class="text_title padLf10">产品收费项目</div>
            <el-table
                v-loading = "detail_loading3"
                :data="detail_list3"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
            >
                <el-table-column prop="feeItemNo" label="收费项目编号" align="center" />
                <el-table-column prop="feeTypeDesc" label="费用类别" align="center" />
                <el-table-column prop="feeDesc" label="费用描述" align="center" />
                <el-table-column prop="instanCode1Desc" label="实例维度1" align="center" />
                <el-table-column prop="instanCode2Desc" label="实例维度2" align="center" />
            </el-table>
            <pagination v-show="detail_tableTotal3>0" :total="detail_tableTotal3" :page.sync="detail_tableObj3.pageNum" :limit.sync="detail_tableObj3.pageSize" @pagination="detail_getList3(tempDetail)" />
           <div class="text_title padLf10">产品构件实例</div>
            <el-table
                v-loading = "detail_loading4"
                :data="detail_list4"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
            >
                <el-table-column prop="" label="参数选项编号及描述" align="center" >
                    <template slot-scope="{row}">
                        <span class="tdDivL">{{row.artifactDesc}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <span class="tdDivR">{{row.elementNo}}&nbsp;&nbsp;&nbsp;&nbsp;{{row.elementDesc}}</span>
                    </template> 
                </el-table-column>
                <el-table-column prop="" label="PCD及PCD描述" align="center" >
                    <template slot-scope="{row}">
                        <span class="tdDivL">{{row.pcdNo}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <span class="tdDivR">{{row.pcdDesc}}</span>
                    </template> 
                </el-table-column>
                <el-table-column prop="" label="操作" align="center" width="180px">
                    <template slot-scope="{row}">
                        <el-button size="mini" type="primary" @click="queryArtifactBP(row)" 
                        v-show="row.pcdNo!=null && row.supportPcd == 'Y'" > 查看参数值</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="detail_tableTotal4>0" :total="detail_tableTotal4" :page.sync="detail_tableObj4.pageNum" :limit.sync="detail_tableObj4.pageSize" @pagination="detail_getList4(tempDetail)" />  
            <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogFormVisibleDetail = false">
                关闭
            </el-button>
            </div>
        </el-dialog>


        <!-- 查看pcd 参数 弹窗-->
        <el-dialog :title="viewPcdTitle" :visible.sync="viewPcd_dialog" width="65%">
            <view-pcd :viewPcdFormObj="viewPcdFormObj"></view-pcd>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary"  @click="viewPcd_dialog = false">
                    关闭
                </el-button>
            </div>
        </el-dialog>
        
        <!-- 详情弹窗结束 -->



        <!-- 修改 弹窗 -->
        <el-dialog title="修改产品信息" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp">
                <el-form-item class="cl_td" label="运营模式" prop="operationMode"
                :rules="[ { required: true, message: '运营模式不能为空'} ]">
                    <el-select v-model="tempUp.operationMode" class="wd200"  clearable disabled>
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode"
                    />
                    </el-select>
                </el-form-item> 
                <el-form-item class="cl_td" label="产品代码" prop="productObjectCode"
                :rules="[ { required: true, message: '产品代码不能为空'}]">
                    <el-input v-model="tempUp.productObjectCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="产品描述" prop="productDesc">
                    <el-input v-model="tempUp.productDesc" class="wd200" type="text"/>
                </el-form-item>
                <el-form-item class="cl_td" label="发行卡BIN" prop="binNo">
                    <el-select v-model="tempUp.binNo" class="wd200" clearable @change="binNoChangeHandle">
                        <el-option
                        v-for="(item, index ) in binNoOptions"
                        :key="index"
                        :label="item.binNo"
                        :value="item.binNo"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="特殊号码段号" prop="segmentNumber">
                    <el-select v-model="tempUp.segmentNumber" class="wd200" clearable>
                        <el-option
                        v-for="(item, index ) in segmentNumberOptions"
                        :key="index"
                        :label="item.segmentNumber"
                        :value="item.segmentNumber"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item  class="cl_td" label="还款优先级" prop="paymentPriority">
                    <el-input v-model="tempUp.paymentPriority" class="wd120" type="text" />
                    <div class="search_button">
                        <el-button size="small" icon="el-icon-search" type="primary" @click="chosePriorityBtn()" >
                            查询
                        </el-button>
                    </div>
                </el-form-item>
                <el-form-item class="cl_td" label="产品期限(月)" prop="productTimeLimit">
                    <el-input v-model="tempUp.productTimeLimit" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="套卡对方产品对象代码" prop="productCodeSet" >
                    <el-select v-model="tempUp.productCodeSet" class="wd200" clearable >
                    <el-option
                        v-for="(item, index ) in productCodeSetOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.productObjectCode"
                    />
                    </el-select>
                </el-form-item> 
                <el-form-item class="cl_td" label="默认业务项目" prop="defaultBusinessItem">
                    <el-input v-model="tempUp.defaultBusinessItem" class="wd200" type="text"/>
                </el-form-item>
            </el-form>

            <div class="text_title padLf10">选择业务项目</div>
            <div style="margin-left: 12%;">
                <el-transfer 
                    filterable
                    :filter-method="filterMethod"
                    :titles="['可选择业务项目', '已选择业务项目']"
                    filter-placeholder="请输入业务项目编号"
                    v-model="busItemList"
                    @change="handleBusComponent"
                    @right-check-change="rightCheckedChange"
                    :data="leftBusData">
                </el-transfer>
            </div>

            <div class="text_title padLf10">选择卡版面</div>
            <div style="margin-left: 12%;">
                <el-transfer 
                    filterable
                    :filter-method="filterMethodFormat"
                    :titles="['可选择业务项目', '已选择业务项目']"
                    filter-placeholder="请输入业务项目编号"
                    v-model="formatList"
                    @change="handleFormatComponent"
                    @right-check-change="rightCheckedFormatChange"
                    :data="leftFormatData">
                </el-transfer>
            </div>

            <div class="text_title padLf10">选择收费项目</div>
            <div style="margin-left: 12%;">
                <el-transfer 
                    filterable
                    :filter-method="filterMethodFeeItem"
                    :titles="['可选择收费项目', '已选择收费项目']"
                    filter-placeholder="请输入应用维度"
                    v-model="feeItemList"
                    @change="handleFeeComponent"
                    @right-check-change="rightCheckedFeeItemChange"
                    :data="leftFeeItemData">
                </el-transfer>
            </div>
            <div class="text_title padLf10">产品参数设置</div>
             <el-table
            v-loading = "up_listLoading1"
            :data="up_proParamsList"
            class="mbtm20"
            fit
            highlight-current-row
            style="width: 100%;"
            border
            > 
                <el-table-column prop="" label="参数选项编号及描述" align="center" >
                    <template slot-scope="{row}">
                        <span class="tdDivL">{{row.artifactDesc}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <span class="tdDivR">{{row.elementNo}}&nbsp;&nbsp;&nbsp;&nbsp;{{row.elementDesc}}</span>
                    </template> 
                </el-table-column>
                <el-table-column prop="" label="PCD及PCD描述" align="center" >
                    <template slot-scope="{row}">
                        <span class="tdDivL">{{row.pcdNo}}&nbsp;&nbsp;&nbsp;&nbsp;</span>
                        <span class="tdDivR">{{row.pcdDesc}}</span>
                    </template> 
                </el-table-column>
                <el-table-column prop="" label="操作" align="center">
                    <template slot-scope="{row, $index}">
                        <el-button size="mini" type="primary" @click="up_handleReplaceParams(row,$index)">替换参数</el-button>
                        <el-button size="mini" type="primary" @click="up_handleSetParams(row,$index)" 
                        v-show="row.pcdNo != null && row.pcdDesc == '' && row.supportPcd == 'Y'" >设置参数值</el-button>
                        <el-button size="mini" icon="el-icon-edit" type="primary" @click="up_handleSetParams(row,$index)" 
                        v-show="row.pcdNo != null && row.pcdDesc != '' && row.supportPcd == 'Y'" >设置{{row.pcdDesc}}</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleUp = false">
                    关闭
                </el-button>
                <el-button type="primary" @click="updateData()">
                    确定
                </el-button>
            </div>
        </el-dialog>
         <!-- // 查询优先级弹窗 -->
        <el-dialog class="abow_dialog" title="查看产品还款优先级" :visible.sync="priority_dialogForm" width="65%">
            <el-form  :model="priority_formObj" >
                <el-form-item class="cl_td" label="产品代码" prop="productObjectCode">
                    <el-input v-model="priority_formObj.productObjectCode" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="产品描述" prop="productDesc">
                    <el-input v-model="priority_formObj.productDesc" class="wd200" type="text" />
                </el-form-item>
            </el-form>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="priority_getProduvtList()">查询</el-button>
                <el-button size="medium" icon="el-icon-refresh" type="primary" @click="priority_reset()">重置</el-button>
            </div>
            <el-table
            v-loading = "listLoading1"
            :data="priority_productList"
            class="mbtm20"
            fit
            highlight-current-row
            style="width: 100%;"
            border
            > 
                <el-table-column prop="productObjectCode" label="产品代码" align="center" />
                <el-table-column prop="productDesc" label="产品描述" align="center" />
                <el-table-column prop="paymentPriority" label="还款优先级" align="center" />
            </el-table>
            <pagination v-show="priority_formObjtTotal>0" :total="priority_formObjtTotal" :page.sync="priority_formObj.pageNum" :limit.sync="priority_formObj.pageSize" @pagination="priority_getProduvtList" />
            
            <div slot="footer" class="dialog-footer">
                <el-button @click="priority_dialogForm = false">
                    关闭
                </el-button>
                </div>
        </el-dialog>


        <!-- 替换参数 弹窗 -->
        <el-dialog title="选择参数选项"  :visible.sync="replcaeParam_dialog" width="65%">
            <replace-param :replaceObj="replaceParamObj" :replaceIndex="replaceIndex" :defalutVal="defalutChoseVal" @childByElementVal="childByElementVal"></replace-param>
             <div slot="footer" class="dialog-footer">
                <el-button @click="replcaeParam_dialog = false">
                    关闭
                </el-button>
                <el-button type="primary" @click="sureReplaceData()">
                    确定
                </el-button>
            </div>
        </el-dialog>

        <!-- 设置参数 弹窗 -->
        <el-dialog :title="setPcdTitle" :visible.sync="setParam_dialog" width="65%">
            <set-pcd :setPcdObj="setParamObj" :setIndex="replaceIndex" @childBySetVal="childBySetVal" @childByDeletPcd="childByDeletPcd"></set-pcd>
             <div slot="footer" class="dialog-footer">
                <el-button @click="setParam_dialog = false">
                    关闭
                </el-button>
                <el-button type="primary" @click="sureSetData()">
                    确定
                </el-button>
            </div>
        </el-dialog>

    
    </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import ViewPcd from "@/components-ider/ViewPcd";
import ReplaceParam from "@/components-ider/ReplaceParam";
import SetPcd from "@/components-ider/SetPcd";



export default {
  name: 'ProObjectQuery',
  components: {
    Pagination,
    ViewPcd,
    ReplaceParam,
    SetPcd
  },
  data() {
    return {
        // 按钮权限
        selBtnFlag: false,
        addBtnFlag: false,
        updBtnFlag: false,
        btnAuthStr: '',
         // 列表
        tableLoading: false,
        tableList: [],
        tableTotal: 0,
        queryFormObj: {
            pageNum: 1,
            pageSize:10,
        },
        queryFormRef: {},
        queryFormObjRules: {},
        // 初始化下拉框
        operationModeOptions: [],
        segmentNumberOptions: [],
        productCodeSetOptions: [],
        binNoOptions: [],
        // 增删改查
        tempDetail: {}, // 详情
        tempUp: {}, // 修改
        dialogFormVisibleUp: false,
        dialogFormVisibleDetail: false,
        rulesDetail: {},
        rulesUp: {},
        dataFormUp : {},
        dataFormDetil: {},

        // 详情 弹窗
        detail_loading1: false,
        detail_list: [],
        detail_tableTotal: 0,
        detail_tableObj : {
            pageNum : 1,
            pageSize: 10
        },

        detail_loading2: false,
        detail_list2: [],
        detail_tableTotal2: 0,
        detail_tableObj2: {
            pageNum : 1,
            pageSize: 10
        },

        detail_loading3: false,
        detail_tableObj3: {
            pageNum : 1,
            pageSize: 10
        },
        detail_list3: [],
        detail_tableTotal3: 0,

        detail_loading4: false,
        detail_list4: [],
        detail_tableObj4: {
            pageNum : 1,
            pageSize: 10
        },
        detail_tableTotal4: 0,
        // 查看p参数
        viewPcd_dialog: false,
        viewPcdFormObj: {},
        viewPcdTitle: '',

        // 查询优先级弹窗
        priority_dialogForm: false,
        listLoading1: false,
        priority_productList: [],
        priority_formObj: {
            pageNum: 1,
            pageSize: 10
        },
        priority_formObjtTotal: 0,
        // 修改
        up_listLoading1:false,
        up_proParamsList: [],
        busItemList: [],
        rightCheckedBusList:[],
        busProInitData: [],
        leftBusData: [],

        formatList: [],
        rightCheckedFormatList: [],
        formatInitData: [],
        leftFormatData: [],

        feeItemList: [],
        rightCheckedFeeItemtList: [],
        feeItemInitData: [],
        leftFeeItemData: [],

        // 替换参数
        replcaeParam_dialog: false,
        replaceParamObj: {},
        istLoading1: false,
        replaceIndex: '',
        defalutChoseVal: '',
        choosedVal: '',

        // 设置参数
        setParam_dialog: false,
        setParamObj: {},
        setPcdTitle: '',
        pcdList: [],
        delePcdList: []
    }
  },
  created() {
    // this.init()
    this.getBtnAuth()
  },
  watch: {
      
  },
  mounted() {
    this.getList()

     // 运营模式 
    this.getSelectDict( "/beta/betaService/COS.IQ.02.0006").then(res => {
        this.operationModeOptions = res
    })
    // 套卡对方产品对象代码 
    this.getSelectDict( "/beta/betaService/COS.IQ.02.0013").then(res => {
        this.productCodeSetOptions = res
    })
    // 发行卡BIN
    this.getSelectDict( "/beta/betaService/COS.IQ.02.0011 ").then(res => {
        this.binNoOptions = res
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
                    if (this.btnAuthStr.includes('COS.IQ.02.0013')) { // 查询
                        this.selBtnFlag = true
                    } else {
                        this.selBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.UP.02.0013')) { // 维护
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
        this.tableLoading = true
        this.getTableList('/beta/betaService/COS.IQ.02.0013', this.queryFormObj ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.tableList = res.returnData.rows
                    this.tableTotal = res.returnData.totalCount
                    this.tableLoading = false
                } else {
                    this.tableList = []
                    this.tableTotal = 0
                    this.tableLoading = false
                }
            } 
        }, (err) => {
      		this.tableList = []
       		this.tableTotal = 0
       		this.tableLoading = false
        })

    },
    handleSearch() {
        this.queryFormObj.pageNum = 1
        this.queryFormObj.pageSize = 10
        this.getList()
    },
    reset() {
        this.queryFormObj.operationMode = ''
        this.queryFormObj.productObjectCode = ''
    },

     // 查询 还款优先级
        chosePriorityBtn() { 
            this.priority_getProduvtList()
        },
        // 查询还款优先级 产品list
        priority_getProduvtList() {
            this.listLoading1 = true
            this.priority_dialogForm = true
            this.getTableList('/beta/betaService/COS.IQ.02.0013', this.priority_formObj,(res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        this.priority_productList = res.returnData.rows
                        this.priority_formObjtTotal = res.returnData.totalCount
                        this.listLoading1 = false
                    }
                } else {
                    this.priority_productList = []
                    this.priority_formObjtTotal = 0
                    this.listLoading1 = false
                }
            }, (err) => {
                    this.priority_productList = []
                    this.priority_formObjtTotal = 0
                    this.listLoading1 = false
            })
        },
        // 查询还款优先级 重置
        priority_reset() {
            this.priority_formObj.productObjectCode = ''
            this.priority_formObj.productDesc = ''
        },
     // 卡bin 联动 查询特殊号码段号
    binNoChangeHandle(obj) { 
        this.post('/beta/betaService/COS.IQ.02.0045', obj,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                    this.segmentNumberOptions = res.returnData.rows
                } else {
                    this.segmentNumberOptions = []
                }
            }
        })
    },

    handleDetail(row) {
        this.detail_list1 = []
        this.detail_list2 = []
        this.detail_list3 = []
        this.detail_list4 = []
        this.detail_tableObj= {
            pageNum : 1,
            pageSize: 10
        },
        this.detail_tableObj2= {
            pageNum : 1,
            pageSize: 10
        },
        this.detail_tableObj3= {
            pageNum : 1,
            pageSize: 10
        },
        this.detail_tableObj4= {
            pageNum : 1,
            pageSize: 10
        },
        this.tempDetail = {}
        this.dialogFormVisibleDetail = true
      this.tempDetail = Object.assign({}, row) // 
      console.log(this.tempDetail)
      let obj = {
        cardBin : row.binNo,
		corporationEntityNo : row.corporationEntityNo
      }
      this.binNoChangeHandle(obj)
      this.$nextTick(() => {
        this.$refs['dataFormDetail'].clearValidate()
      })
      this.detail_getList(row)
      this.detail_getList2(row)
      this.detail_getList3(row)
      this.detail_getList4(row)
    },
    detail_getList(row) {
        this.detail_loading1 = true
        this.detail_tableObj.productObjectCode = row.productObjectCode
        this.detail_tableObj.operationMode = row.operationMode
        this.getTableList('/beta/betaService/COS.IQ.02.0014', this.detail_tableObj ,(res) => {
            if (res.returnCode == '000000') {
                 this.detail_loading1 = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.detail_list = res.returnData.rows
                    this.detail_tableTotal = res.returnData.totalCount
                }else{
                    this.detail_list = []
                    this.detail_tableTotal = 0
                }
            }
        }, (err) => {
      		this.detail_list = []
       		this.detail_tableTotal = 0
       		this.detail_loading1 = false
        })
    },
    detail_getList2(row) {
        this.detail_loading2 = true
        this.detail_tableObj2.productObjectCode = row.productObjectCode
        this.detail_tableObj2.operationMode = row.operationMode
        this.getTableList('/beta/betaService/COS.IQ.02.0055', this.detail_tableObj2 ,(res) => {
            if (res.returnCode == '000000') {
                this.detail_loading2 = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.detail_list2 = res.returnData.rows
                    this.detail_tableTotal2 = res.returnData.totalCount
                }else{
                    this.detail_list2 = []
                    this.detail_tableTotal2 = 0
                }
            }
        }, (err) => {
      		this.detail_list2 = []
       		this.detail_tableTotal2 = 0
       		this.detail_loading2 = false
        })
    },
    detail_getList3(row) {
        this.detail_loading3 = true
        this.detail_tableObj3.productObjectCode = row.productObjectCode
        this.detail_tableObj3.operationMode = row.operationMode
        this.getTableList('/beta/betaService/COS.IQ.02.0151', this.detail_tableObj3 ,(res) => {
            if (res.returnCode == '000000') {
                this.detail_loading3 = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.detail_list3 = res.returnData.rows
                    this.detail_tableTotal3 = res.returnData.totalCount
                }else{
                    this.detail_list3 = []
                    this.detail_tableTotal3 = 0
                }
            }
        }, (err) => {
      		this.detail_list3 = []
       		this.detail_tableTotal3 = 0
       		this.detail_loading3 = false
        })
    },
    detail_getList4(row) {
        this.detail_loading4 = true
        this.detail_tableObj4.instanCode = row.productObjectCode
        this.detail_tableObj4.operationMode = row.operationMode
        this.getTableList('/beta/betaService/COS.IQ.02.0015', this.detail_tableObj4 ,(res) => {
            if (res.returnCode == '000000') {
                this.detail_loading4 = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.detail_list4 = res.returnData.rows
                    this.detail_tableTotal4 = res.returnData.totalCount
                    
                }else{
                    this.detail_list4 = []
                    this.detail_tableTotal4 = 0
                }
            }
        }, (err) => {
      		this.detail_list4 = []
       		this.detail_tableTotal4 = 0
       		this.detail_loading4 = false
        })
    },
    // 查看参数按钮
    queryArtifactBP(row) {
        this.viewPcdTitle = '查看'+row.pcdNo+': '+row.pcdDesc+'参数信息'
        this.viewPcd_dialog = true
        this.viewPcdFormObj = row
    },
    // 修改部分
    handleUpdate(row) {
        this.up_listLoading1 = true
        this.tempUp = {}
        this.tempUp = Object.assign({}, row)
        this.up_proParamsList = []
        let obj1 = {
            cardBin : row.binNo,
            corporationEntityNo : row.corporationEntityNo
        }
        this.binNoChangeHandle(obj1)
        this.$nextTick(() => {
            this.$refs['dataFormUp'].clearValidate()
        })
        let obj ={
            instanCode: row.productObjectCode,
			operationMode : row.operationMode
        }
        this.post('/beta/betaService/COS.IQ.02.0015', obj, (res) => {
            this.up_listLoading1 = false
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.up_proParamsList = res.returnData.rows
                }else{
                    this.up_proParamsList = []
                }
            }
        })
        // 业务项目
        this.busItemList = this.getRightBusData(row)
        this.leftBusData = this.getLeftBusData(row, this.busItemList)
        // 卡版面
        this.formatList = this.getRightFormatData(row)
        this.leftFormatData = this.getLeftFormatData(row, this.formatList)
        // 收费项目
        this.feeItemList = this.getRightFeeItemData(row)
        this.leftFeeItemData = this.getLeftFeeItemData(row, this.feeItemList)

        this.dialogFormVisibleUp = true
    }, 
    updateData() {
        this.$refs['dataFormUp'].validate((valid) => {
            if (valid) {
                let obj = Object.assign({}, this.tempUp)
                obj.busProList = []
                obj.list = []
                obj.feeItemlist = []
                obj.deletePcdInstanIdList = this.delePcdList
                obj.artifactInstanList = this.up_proParamsList
                this.busItemList.forEach(rightItem => {
                    this.busProInitData.forEach(item => {
                        if (rightItem == item.businessProgramNo){
                            obj.busProList.push(item)
                        }
                    })
                })
                this.formatList.forEach(rightItem => {
                    this.formatInitData.forEach(item => {
                        if (rightItem == item.formatCode){
                            obj.list.push(item)
                        }
                    })
                })
                this.feeItemList.forEach(rightItem => {
                    obj.feeItemlist.push({feeItemNo: rightItem})
                })
                obj.operationMode = this.tempUp.operationMode
                this.post('/beta/betaService/COS.UP.02.0013', obj, (res) => {
                    if (res.returnCode == '000000') {
                        this.dialogFormVisibleUp = false
                        this.$notify({
                            message: '修改成功',
                            type: 'success',
                        })
                        this.getList()
                    }
                })
            }
        })
    },



    // 业务项目
    handleBusComponent(value, direction, movedKeys) {
        // this.busItemList = value
        console.log(value)
        console.log(this.busItemList)
    },
    rightCheckedChange(val) {
        this.rightCheckedBusList = val
    },
    // 获取所有业务项目数据
    generateData() {
        const componentData = [] // 相当于data
        this.post('/beta/betaService/COS.IQ.02.0018', {} ,(res) => {
            this.busProInitData = res.returnData.rows
            res.returnData.rows.forEach(item => {
                item.label = item.businessProgramNo+' '+item.businessDesc
                item.key = item.businessProgramNo
                componentData.push(item)
            })
        })
        return componentData;  
    },
    filterMethod(query, item) {
        // console.log(item)
        return item.businessProgramNo.indexOf(query) > -1;
    },
    getRightBusData(row){
        const rightData = []
        let obj = {
            operationMode: row.operationMode,
            productObjectCode: row.productObjectCode
        }
        this.post('/beta/betaService/COS.IQ.02.0014', obj ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData &&  res.returnData.rows &&  res.returnData.rows.length > 0) {
                     res.returnData.rows.forEach(rightItem => {
                        rightItem.label = rightItem.businessProgramNo+' '+rightItem.businessDesc
                        rightItem.key = rightItem.businessProgramNo
                        rightData.push(rightItem.businessProgramNo)
                    })
                }
               
            }
        })
        return rightData
    },
    // 左侧数据 arr: 右侧数据，需要过滤掉
    getLeftBusData(row, arr) {
        let componentData = [] // 相当于data
        let leftBusData = []
        this.post('/beta/betaService/COS.IQ.02.0018', {} ,(res) => {
            this.busProInitData = res.returnData.rows
            res.returnData.rows.forEach(item => {
                item.label = item.businessProgramNo+' '+item.programDesc
                item.key = item.businessProgramNo
                componentData.push(item)
            })
            let isrep
            for ( let m = 0 ; m < componentData.length; m++) {
                isrep = false
                for (let n = 0 ; n < this.busItemList.length; n++) {
                    if (arr[n] == componentData[m].businessProgramNo) {
                        isrep = true
                        break
                    }
                    if(!isrep) {
                        leftBusData.push(componentData[m])
                    }
                } 
            }
        })
        return componentData
    },

    // 卡版面
    handleFormatComponent(value, direction, movedKeys){
        this.formatList = value
    },
    rightCheckedFormatChange(val) {
        this.rightCheckedFormatList = val
    },
    // 获取卡版面穿梭框所有数据
    generateFormatData (row) {
        const componentData = [] // 相当于data
        const componentNoList = [] // 
        const componentList = []
        this.post('/beta/betaService/COS.IQ.02.0054', {operationMode: row.operationMode} ,(res) => {
            this.formatInitList = res.returnData.rows
            res.returnData.rows.forEach((item, i) => {
                componentList.push(item.formatCode+' '+item.formatDescribe)
                componentNoList.push(item.formatCode)
            })
            componentList.forEach((component, index) => {
                componentData.push({
                    label: component,
                    // key: index,
                    key: component.split(' ')[0],
                    formatCode: componentNoList[index]
                });
            });
        })
        return componentData;  
    },
    filterMethodFormat(query, item) {
        return item.formatCode.indexOf(query) > -1;
    },
    getRightFormatData(row) {
        const rightData = []
        let obj = {
            operationMode: row.operationMode,
            productObjectCode: row.productObjectCode
        }
        this.post('/beta/betaService/COS.IQ.02.0055', obj ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData &&  res.returnData.rows &&  res.returnData.rows.length > 0) {
                    res.returnData.rows.forEach(rightItem => {
                        rightItem.label = rightItem.formatCode+' '+rightItem.formatDescribe
                        rightItem.key = rightItem.formatCode
                        rightData.push(rightItem.formatCode)
                    })
                }
            }
        })
        return rightData
    },
    getLeftFormatData(row, arr) {
        let componentData = [] // 相当于data
        let leftBusData = []
        this.post('/beta/betaService/COS.IQ.02.0054', {} ,(res) => {
            this.formatInitData = res.returnData.rows
            res.returnData.rows.forEach(item => {
                item.label = item.formatCode+' '+item.formatDescribe
                item.key = item.formatCode
                componentData.push(item)
            })
            let isrep
            for ( let m = 0 ; m < componentData.length; m++) {
                isrep = false
                for (let n = 0 ; n < this.busItemList.length; n++) {
                    if (arr[n] == componentData[m].formatCode) {
                        isrep = true
                        break
                    }
                    if(!isrep) {
                        leftBusData.push(componentData[m])
                    }
                } 
            }
        })
        return componentData

    },


    // 收费项目
    handleFeeComponent(value, direction, movedKeys) {
        this.feeItemList = value
    },
    rightCheckedFeeItemChange(val) {
        this.rightCheckedFeeItemtList =val
    },
    // 获取收费项目穿梭框左侧数据
    generateFeeItemData (row) {
        const componentData = [] // 相当于data
        const componentNoList = [] // 
        const componentList = []
        this.post('/beta/betaService/COS.IQ.02.0031', {periodicFeeIdentifier: 'P', operationMode: row.operationMode} ,(res) => {
            this.feeItemInitList = res.returnData.rows
            res.returnData.rows.forEach((item, i) => {
                componentList.push(item.feeItemNo+' '+item.feeDesc)
                componentNoList.push(item.feeItemNo)
            })
            componentList.forEach((component, index) => {
                componentData.push({
                    label: component,
                    // key: index,
                    key: component.split(' ')[0],
                    feeItemNo: componentNoList[index]
                });
            });
        })
        return componentData;  
    },
    filterMethodFeeItem(query, item) {
        return item.feeItemNo.indexOf(query) > -1;
    },
    getRightFeeItemData(row) {
        const rightData = []
        let obj = {
            operationMode: row.operationMode,
            productObjectCode: row.productObjectCode
        }
        this.post('/beta/betaService/COS.IQ.02.0151', obj ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData &&  res.returnData.rows &&  res.returnData.rows.length > 0) {
                    res.returnData.rows.forEach(rightItem => {
                        rightItem.label = rightItem.feeItemNo+' '+rightItem.feeDesc
                        rightItem.key = rightItem.feeItemNo
                        rightData.push(rightItem.feeItemNo)
                    })
                }
                
            }
        })
        return rightData
    },
    getLeftFeeItemData(row, arr) {
        let componentData = [] // 相当于data
        let leftBusData = []
        this.post('/beta/betaService/COS.IQ.02.0031', {periodicFeeIdentifier: 'P', operationMode: row.operationMode} ,(res) => {
            this.feeItemInitData = res.returnData.rows
            res.returnData.rows.forEach(item => {
                item.label = item.feeItemNo+' '+item.feeDesc
                item.key = item.feeItemNo
                componentData.push(item)
            })
            let isrep
            for ( let m = 0 ; m < componentData.length; m++) {
                isrep = false
                for (let n = 0 ; n < this.busItemList.length; n++) {
                    if (arr[n] == componentData[m].feeItemNo) {
                        isrep = true
                        break
                    }
                    if(!isrep) {
                        leftBusData.push(componentData[m])
                    }
                } 
            }
        })
        return componentData
    },

    // 修改 替换参数
    up_handleReplaceParams(row, index){
        this.replcaeParam_dialog = true
        this.replaceParamObj = row
        this.replaceIndex = index
        this.defalutChoseVal = row.elementNo
    },
    // 获取 替换参数自组价val
    childByElementVal(val){
        this.choosedVal = val
    },
    // 修改  确定替换参数
    sureReplaceData() {
        this.$set(this.up_proParamsList[this.replaceIndex], 'elementNo', this.choosedVal.split("_")[0])
        this.$set(this.up_proParamsList[this.replaceIndex], 'elementDesc', this.choosedVal.split("_")[1])
        this.replcaeParam_dialog = false
    },
    // 修改 设置参数
    up_handleSetParams(row, index){
        this.replaceIndex = index
        this.setParam_dialog = true
        this.setParamObj = row
        this.setPcdTitle = '维护'+row.pcdNo+': '+row.pcdDesc+'参数信息'

    },
    childBySetVal(val){
        this.pcdList = val
    },
    childByDeletPcd(val) {
        // this.$confirm('此操作将永久删除PCD, 是否继续?', '提示', {
        //     confirmButtonText: '确定',
        //     cancelButtonText: '取消',
        //     type: 'warning'
        // }).then(() => {
        //     if(this.delePcdList.length==1){
        //         this.$message({
        //             message: '必须有一条PCD取值！',
        //             type: 'warning'
        //         })
        //         return;
        //     }
        //     
        // })
        this.delePcdList = val
    },
    // 修改  确定设置参数
    sureSetData(){
      //  this.$set(this.up_proParamsList[this.replaceIndex], 'pcdInitList', this.pcdList)
        this.$set(this.up_proParamsList, this.replaceIndex , this.setParamObj)
        this.setParam_dialog = false
    },

    


  }
}
</script>

<style>
.cl-tr label.el-form-item__label {
    width:20% !important;
    float: left;
}
.el-radio__label{
    padding-left: 8px;
}

/* 穿梭框 文字显示完全 */
    .el-transfer-panel__item.el-checkbox .el-checkbox__label {
        overflow: visible;
        white-space: nowrap;
    }
        /* 穿梭框样式 */
    .el-transfer-panel {
        width: 37%;
    }
</style>

<!-- 运营模式 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="运营模式" prop="operationMode">
                <el-select v-model="queryFormObj.operationMode" class="wd200" clearable >
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode"
                    />
                </el-select>
            </el-form-item>
             <el-form-item class="cl_td" label="模式名称" prop="modeName">
                <el-input v-model="queryFormObj.modeName" class="wd200" type="text" />
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" v-show="selBtnFlag">查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate" v-show="addBtnFlag">新增</el-button>
            </div>
        </el-form>
        <el-table
            v-loading = "listLoading1"
            :data="tableList"
            class="mbtm20"
            fit
            highlight-current-row
            style="width: 100%;"
            border>
            <el-table-column prop="operationMode" label="运营模式" align="center" />
            <el-table-column prop="itemCorporationEntityNo" label="法人实体编号" align="center" />
            <el-table-column prop="modeName" label="模式名称" align="center" />
            <el-table-column prop="accountCurrency" label="运营核算币种" align="center" />
            <el-table-column prop="creditTreeId" label="额度网编号" align="center" />
            <el-table-column prop="dateTypeDesc" label="日期格式" align="center" />
            <el-table-column prop="defaultFlagDesc" label="法人缺省运营模式标识" align="center" />
            <el-table-column prop="batchDateProcessTypeDesc" label="批量日期处理方式" align="center" />   
            <el-table-column prop="" label="操作" align="center" width = "350">
                <template slot-scope="{row}">
                    <el-button size="mini" icon="el-icon-more" type="primary" @click="handleDetail(row)" v-show="selBtnFlag">详情</el-button>
                    <el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleUpdate(row)" v-show="updBtnFlag">修改</el-button>
                    <!--<el-button size="mini" icon="el-icon-document-copy"   type="primary" @click="handleCopy(row)" v-show="selBtnFlag">复制</el-button>-->
                </template> 
            </el-table-column>
        </el-table>
        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
        <!-- 新增 -->
        <el-dialog title="新增" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd" >
                <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
                    :rules="[ { required: true, message: '运营模式不能为空'} ]">
                    <el-input v-model="tempAdd.operationMode" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="法人实体编号" prop="corporationEntityName"
                    :rules="[ { required: true, message: '法人实体编号不能为空'} ]" >
                    <el-select v-model="tempAdd.corporationEntityName" class="wd200" clearable>
                      <el-option
                        v-for="(item, index ) in corporationEntityNoOptions"
                        :key="index"
                        :label="item.concat"
                        :value="item.corporationEntityName"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="模式名称" prop="modeName" 
                    :rules="[ { required: true, message: '模式名称不能为空'} ]">
                    <el-input v-model="tempAdd.modeName" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="运营核算币种" prop="currencyDesc"
                    :rules="[ { required: true, message: '运营核算币种不能为空'} ]" >
                    <el-select v-model="tempAdd.currencyDesc" class="wd200" clearable>
                      <el-option
                        v-for="(item, index ) in accountCurrencyOptions"
                        :key="index"
                        :label="item.concat"
                        :value="item.currencyDesc"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="额度网编号" prop="creditTreeId">
                    <el-input v-model="tempAdd.creditTreeId" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="日期格式" prop="dateType">
                    <el-select v-model="tempAdd.dateType" class="wd200" clearable>
                      <el-option
                        v-for="(item, index ) in dateTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="法人缺省运营模式标识" prop="defaultFlag"
                    :rules="[ { required: true, message: '批量日期处理方式不能为空'} ]">
                    <el-select v-model="tempAdd.defaultFlag" class="wd200" clearable >
                      <el-option
                        v-for="(item, index ) in defaultFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="批量日期处理方式" prop="batchDateProcessType"
                    :rules="[ { required: true, message: '批量日期处理方式不能为空'} ]">
                    <el-select v-model="tempAdd.batchDateProcessType" class="wd200" clearable>
                      <el-option
                        v-for="(item, index ) in batchDateProcessTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="溢缴款业务类型" prop="overpayBusinessType"
                :rules="[ { required: true, message: '溢缴款业务类型不能为空'} ]">
                    <el-select v-model="tempAdd.overpayBusinessType" class="wd200">
                      <el-option
                        v-for="(item, index ) in overpayBusinessTypeUpdateOptions"
                        :key="index"
                        :label="item.businessDesc"
                        :value="item.businessTypeCode"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="" ></el-form-item>
                <div  class="dialog-footer" style="text-align: center;" v-if="addBtn1">
                    <el-button type="primary" @click="nextStepBtn()">下一步</el-button>
                </div>
                </el-form>
                <!--选择管控项目-->
                <div v-show="addBusPro_part2">
                    <div class="text_title padLf10">选择入账币种</div>
                    <!-- <el-form ref="dataFormAdd2" :rules="rulesAdd2" :model="tempAdd2">
                         <el-form-item class="cl_td" label="入账币种" prop="currencyCode" >
                            <el-input class="wd200 "  v-model="tempAdd2.currencyCode"/>
                        </el-form-item>
                        <el-form-item class="cl_td" label="入账币种描述" prop="currencyDesc" >
                            <el-input class="wd200 "  v-model="tempAdd2.currencyDesc"/>
                        </el-form-item>
                    </el-form> 
                    <div  class="dialog-footer cl_tr text_center">
                        <el-button type="primary" @click="addBusPro_nextToPart5Btn()">查询</el-button>
                    </div> -->
                    <div style="margin-left: 12%;">
                        <el-transfer
                            filterable
                            :filter-method="add_filterMethod"
                            :titles="['可选择入账币种', '已选择入账币种']"
                            filter-placeholder="请输入入账币种"
                            v-model="add_busTypeList"
                            @change="add_handleAddComponent"
                            @right-check-change="add_rightCheckedChange"
                            :data="add_allBusTypeData" >
                        </el-transfer>
                    </div>
                    <div class="cl_tr text_center mtop20" v-show="addBusPro_part2Btn">
                        
                        <el-button  size="small" icon="el-icon-arrow-up" type="primary" 
                            @click="addBusPro_backPar1Btn()">上一步</el-button>
                        
                    </div>
                </div>
            
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addClose()">取消</el-button>
                <el-button type="primary" @click="createData()">确定</el-button>
            </div>
        </el-dialog>
        <!--新增还款优先级-->
        <el-dialog title="还款优先级" :visible.sync="dialogFormVisiblePriority" width="65%">
            <el-form ref="dataFormPriority" :rules="rulesPriority" :model="tempAdd3" >
                <el-form-item class="cl_td" label="还款优先级" prop="paymentPriority" 
                    :rules="[ { required: true, message: '还款优先级不能为空'} ]">
                    <el-input class="wd200 "  v-model="tempAdd3.paymentPriority"/>
                </el-form-item>
                <el-form-item class="cl_td" label="运营币种授信比例" prop="creditProportion" 
                    :rules="[ { required: true, message: '运营币种授信比例不能为空'} ]">
                    <el-input class="wd200"  v-model="tempAdd3.creditProportion"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisiblePriority = false">关闭</el-button>
                <el-button type="primary" @click="addCreateData()">确定</el-button>
            </div>
        </el-dialog>
        <!-- 详情 -->
        <el-dialog title="详情" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail" :rules="rulesDetail" :model="tempDetail" >
               <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
                    :rules="[ { required: true, message: '运营模式不能为空'} ]">
                    <el-input v-model="tempDetail.operationMode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="法人实体编号" prop="corporationEntityName"
                    :rules="[ { required: true, message: '法人实体编号不能为空'} ]" >
                    <el-select v-model="tempDetail.corporationEntityName" class="wd200" disabled readonly>
                      <el-option
                        v-for="(item, index ) in corporationEntityNoOptions"
                        :key="index"
                        :label="item.concat"
                        :value="item.corporationEntityName"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="模式名称" prop="modeName" 
                    :rules="[ { required: true, message: '模式名称不能为空'} ]" >
                    <el-input v-model="tempDetail.modeName" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="运营核算币种" prop="accountCurrency"
                    :rules="[ { required: true, message: '运营核算币种不能为空'} ]" >
                    <el-select v-model="tempDetail.accountCurrency" class="wd200" readonly disabled>
                      <el-option
                        v-for="(item, index ) in accountCurrencyOptions"
                        :key="index"
                        :label="item.concat"
                        :value="item.currencyDesc"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="额度网编号" prop="creditTreeId">
                    <el-input v-model="tempDetail.creditTreeId" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="溢缴款业务类型" prop="overpayBusinessType">
                    <el-select v-model="tempDetail.overpayBusinessType" class="wd200" disabled >
                      <el-option
                        v-for="(item, index ) in overpayBusinessTypeUpdateOptions"
                        :key="index"
                        :label="item.businessDesc"
                        :value="item.businessTypeCode"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="日期格式" prop="dateType">
                    <el-select v-model="tempDetail.dateType" class="wd200" disabled>
                      <el-option
                        v-for="(item, index ) in dateTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="法人缺省运营模式标识" prop="defaultFlag">
                    <el-select v-model="tempDetail.defaultFlag" class="wd200" disabled >
                      <el-option
                        v-for="(item, index ) in defaultFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="批量日期处理方式" prop="batchDateProcessType"
                    :rules="[ { required: true, message: '批量日期处理方式不能为空'} ]">
                    <el-select v-model="tempDetail.batchDateProcessType" class="wd200" readonly disabled>
                      <el-option
                        v-for="(item, index ) in batchDateProcessTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
            </el-form>
            <!--入账币种信息-->
            <div class="clearboth"></div>
            <div class="mainname">入账币种信息</div>
            <el-table
                v-loading = "listLoading2"
                :data="tableDetailList"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border>
                <el-table-column prop="currencyCode" label="货币代码" align="center" />
                <el-table-column prop="creditProportion" label="运营币种授信比例" align="center" />
                <el-table-column prop="paymentPriority" label="还款优先级" align="center" />
            </el-table>
             <pagination v-show="tableTotalDetail>0" :total="tableTotalDetail" :page.sync="tempDetail.pageNum" :limit.sync="tempDetail.pageSize" @pagination="getDetailList" />
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleDetail = false"> 关闭</el-button>
            </div>
        </el-dialog>
        <!-- 修改 -->
        <el-dialog title="修改" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp" >
                <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
                    :rules="[ { required: true, message: '运营模式不能为空'} ]">
                    <el-input v-model="tempUp.operationMode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="法人实体编号" prop="corporationEntityName">
                    <el-select v-model="tempUp.corporationEntityName" class="wd200" clearable>
                      <el-option
                        v-for="(item, index ) in corporationEntityNoOptions"
                        :key="index"
                        :label="item.concat"
                        :value="item.corporationEntityName"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="模式名称" prop="modeName" >
                    <el-input v-model="tempUp.modeName" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="运营核算币种" prop="accountCurrency">
                    <el-select v-model="tempUp.accountCurrency" class="wd200" clearable>
                      <el-option
                        v-for="(item, index ) in accountCurrencyOptions"
                        :key="index"
                        :label="item.concat"
                        :value="item.currencyDesc"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="额度网编号" prop="creditTreeId">
                    <el-input v-model="tempUp.creditTreeId" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="溢缴款业务类型" prop="overpayBusinessType">
                    <el-select v-model="tempUp.overpayBusinessType" class="wd200" readonly disabled >
                      <el-option
                        v-for="(item, index ) in overpayBusinessTypeUpdateOptions"
                        :key="index"
                        :label="item.businessDesc"
                        :value="item.businessTypeCode"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="日期格式" prop="dateType">
                    <el-select v-model="tempUp.dateType" class="wd200" clearable>
                      <el-option
                        v-for="(item, index ) in dateTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="法人缺省运营模式标识" prop="defaultFlag" >
                    <el-select v-model="tempUp.defaultFlag" class="wd200" readonly disabled >
                      <el-option
                        v-for="(item, index ) in defaultFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="批量日期处理方式" prop="batchDateProcessType">
                    <el-select v-model="tempUp.batchDateProcessType" class="wd200" clearable>
                      <el-option
                        v-for="(item, index ) in batchDateProcessTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
            </el-form>
            <!--选择管控项目-->
            <div class="text_title padLf10">选择入账币种</div>
            <!-- <el-form ref="dataFormUp2" :rules="rulesUp2" :model="tempUp2">
                 <el-form-item class="cl_td" label="入账币种" prop="currencyCode" >
                    <el-input class="wd200 "  v-model="tempUp2.currencyCode"/>
                </el-form-item>
                <el-form-item class="cl_td" label="入账币种描述" prop="currencyDesc" >
                    <el-input class="wd200 "  v-model="tempUp2.currencyDesc"/>
                </el-form-item>
            </el-form>
            <div  class="dialog-footer cl_tr text_center">
                <el-button type="primary" @click="upBusPro_nextToPart5Btn()">查询</el-button>
            </div> -->
            <div style="margin-left: 12%;">
                <el-transfer
                    filterable
                    :filter-method="up_filterMethod"
                    :titles="['可选择入账币种', '已选择入账币种']"
                    filter-placeholder="请输入入账币种"
                    v-model="up_busTypeList"
                    @change="up_handleAddComponent"
                    @right-check-change="up_rightCheckedChange"
                    :data="up_allBusTypeData"
                    :right-default-checked="rightCheckedBusType"
                    ref="up_transfer">
                </el-transfer>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleUp = false">取消</el-button>
                <el-button type="primary" @click="updateData()"> 确定</el-button>
            </div>
        </el-dialog>
        <!--修改 还款优先级-->
        <el-dialog title="还款优先级" :visible.sync="dialogFormVisiblePriorityUp" width="65%">
            <el-form ref="dataFormPriorityUp" :rules="rulesPriorityUp" :model="tempUp3">
                <el-form-item class="cl_td" label="还款优先级" prop="paymentPriority" 
                    :rules="[ { required: true, message: '还款优先级不能为空'} ]">
                    <el-input class="wd200 "  v-model="tempUp3.paymentPriority"/>
                </el-form-item>
                <el-form-item class="cl_td" label="运营币种授信比例" prop="creditProportion" 
                    :rules="[ { required: true, message: '运营币种授信比例不能为空'} ]">
                    <el-input class="wd200 "  v-model="tempUp3.creditProportion"/>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisiblePriorityUp = false">关闭</el-button>
                <el-button type="primary" @click="upCreateData()">确定</el-button>
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
        operationModeOptions: [], 
        corporationEntityNoOptions: [],
        accountCurrencyOptions: [],
        dateTypeOptions: [],
        defaultFlagOptions: [],
        batchDateProcessTypeOptions: [],
        // 增删改查
        tempAdd: {}, // 新增
        tempAdd2: {},//新增下一步
        rulesAdd2: {},
        dataFormAdd: {},
        dataFormAdd2: {},
        tempAdd3: {},//新增还款优先级
        tempPriority: {},//新增还款优先级
        tempUp: {}, // 修改
        tempDetail: {
            pageNum: 1,
            pageSize:10,
        }, // --详情
        dialogFormVisibleAdd: false,
        dialogFormVisiblePriority:false,
        dialogFormVisibleUp: false,
        dialogFormVisiblePriorityUp: false,
        dialogFormVisibleDetail: false,
        rulesAdd: {},
        rulesPriority: {},
        rulesDetail: {},
        rulesUp: {},
        rulesPriorityUp: {},
        
    /*----新增----*/
        isReadonly1: false,
        isDisabled1: false,
        addBtn1:true,
        addBusPro_part1: true,
        addBusPro_part2: false,
        addBusPro_part2Btn: false,
        addBusPro_part3: false,
        addBusPro_part3Btn: false,
        isAble: false,
        currencyList:[],
//      /tempAddInfo:{},
       // 新增管控项目
        add_busTypeList: [],
        add_allBusTypeData: [],
        rightCheckedBusType: [],
        businessTypeCodeInitData: [],
        overpayBusinessTypeUpdateOptions: [],
        //详情
        listLoading2: false,
        tableTotalDetail: 0,
        tableDetailList: [],//--列表
        /*-----修改-----*/
        tempUp2: {},
        rulesUp2: {},
        dataFormUp2: {},
        tempUp3: {},
        dataFormPriorityUp: {},
        isReadonly2: false,
        isDisabled2: false,
        upBtn1:true,
        upBusPro_part1: true,
        upBusPro_part1Btn: true,
        upBusPro_part2: false,
        upBusPro_part2Btn: false,
        upBusPro_part3: false,
        upBusPro_part3Btn: false,
        isAble: false,
        upRightCuurList:[],
        // 新增管控项目
        up_busTypeList: [],
        up_allBusTypeData: [],
        up_rightCheckedBusType: [],
        up_businessTypeCodeInitData: [],
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
    
    //运营核算币种
    this.getSelectDict( "/beta/betaService/COS.IQ.02.0012").then(res => {
        //this.accountCurrencyOptions = res
        let rows = res
        rows.forEach(item => {
            item.concat = item.currencyCode+'-'+item.currencyDesc;
        })
        this.accountCurrencyOptions = rows
    })
    //日期格式
    this.getSelectDict( "dic_dateFormat").then(res => {
        this.dateTypeOptions = res
    })
    //法人缺省运营模式标识
    this.getSelectDict( "dic_isYorN").then(res => {
        this.defaultFlagOptions = res
    })
    //批量日期处理方式	
    this.getSelectDict( "dic_dateProcessingMethod").then(res => {
        this.batchDateProcessTypeOptions = res
    })
    //溢缴款业务类型
    this.getSelectDict( "/beta/betaService/COS.IQ.02.0020").then(res => {
        this.overpayBusinessTypeUpdateOptions = res
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
                    if (this.btnAuthStr.includes('COS.IQ.02.0006')) { // 查询
                        this.selBtnFlag = true
                    } else {
                        this.selBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.AD.02.0006')) { // 新增
                        this.addBtnFlag = true
                    } else {
                        this.addBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.UP.02.0006')) { // 维护
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
        let obj={
            isTrans: true,
            transParams:['dic_dateProcessingMethod','dic_isYorN','dic_dateFormat'],
            transDict : ['batchDateProcessType','defaultFlag','dateType']
            
        }
        this.queryFormObj = Object.assign(this.queryFormObj, obj)
        this.getTableList('/beta/betaService/COS.IQ.02.0006', this.queryFormObj ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.tableList = res.returnData.rows
                    this.tableTotal = res.returnData.totalCount
                    this.listLoading1 = false
                    res.returnData.rows.forEach((item, i) => {
                      item.itemCorporationEntityNo=item.corporationEntityNo + " " + item.corporationEntityName;
                    });
                } else {
                    this.tableList = []
                    this.tableTotal = 0
                }
            }
        }, (err) => {
      		this.tableList = []
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
        this.getCorporationEntityNo()
        
    }, 
    //法人实体编号 
    getCorporationEntityNo(){
	    this.getSelectDict( "/beta/betaService/COS.IQ.02.0037").then(res => {
	        this.corporationEntityNoOptions = res
	    })	
    },
    //关闭弹框
    addClose(){
        this.dialogFormVisibleAdd = false
        this.$nextTick(() => {
            this.$refs["dataFormAdd"].resetFields()
        })
    },
    //下一步
    nextStepBtn(){
        this.$refs["dataFormAdd"].validate(valid => {
            if (valid) {
                this.addBtn1 = false;
                this.isReadonly1 = true;
                this.isDisabled1 = true;
                this.addBusPro_part2 = true;
                this.addBusPro_part2Btn = true;
                this.add_allBusTypeData = this.generateAllBusTypeData();
            }
        });
    },
    addBusPro_nextToPart3Btn() {
      // 判断是否设置默认业务类型
        if (this.rightCheckedBusType=='' || this.rightCheckedBusType==undefined) {
            console.log('235')
            this.$message({
                message: "请设置默认业务类型",
                type: "warning"
            });
            return;
        }
        this.addBusPro_part2Btn = false;
        this.addBusPro_part3 = true;
        this.addBusPro_part3Btn = true;
        this.add_allBalanceData = this.generateAllBalanceData();
    },
    addBusPro_nextToPart5Btn() {
//      this.addBusPro_part1 = false;
//      this.addBusPro_part2 = false;
//      this.addBusPro_part3 = false;
        // 查询
        this.generateAllBusTypeData();
    },

    // 上一步
    addBusPro_backPar1Btn() {
      this.addBusPro_part2 = false;
      this.addBtn1 = true;

    },
    addBusPro_backPar2Btn() {
         //console.log('123')
        
        this.addBusPro_part3 = false;
        this.addBusPro_part2Btn = true;
    },
    addBusPro_backPar3Btn() {
         //console.log('235')
        
        this.addBusPro_part3Btn = true;
    },
    addBusPro_backPar4Btn() {
        //console.log('89')
        this.addBusPro_part1 = true;
        this.addBusPro_part2 = true;
        this.addBusPro_part3 = true;
        this.addBtn1 = false;
        this.addBusPro_part2Btn = false;
        this.addBusPro_part3Btn = false;
      
    },
    // 2选择管控项目
    add_filterMethod(query, item) {
        return item.currencyCode.indexOf(query) > -1;
    },
    // 左侧被选中管控项目
    add_handleAddComponent(value, direction, movedKeys) {
        this.add_busTypeList = value;
        console.log(value)
        this.dialogFormVisiblePriority=true;
       
    },
    // 右侧被选中管控项目
    add_rightCheckedChange(val,direction,movedKeys) {
        this.rightCheckedBusType = val;
    },
    addCreateData(){
        this.dialogFormVisiblePriority=false
    },
    // 获取管控项目穿梭框左侧数据
    generateAllBusTypeData() {
        const componentData = []; // 相当于data
        const componentNoList = []; //
        const componentList = [];
        var field = {};
        field.operationMode=this.tempAdd.operationMode
        //field.controlProjectNo=this.tempControl.controlProjectNo
        this.post("/beta/betaService/COS.IQ.02.0012", field, res => {
        this.businessTypeCodeInitData = res.returnData.rows;
        res.returnData.rows.forEach((item, i) => {
          componentList.push(item.currencyCode + " " + item.currencyDesc);
          componentNoList.push(item.currencyCode);
        });
        componentList.forEach((component, index) => {
          componentData.push({
            label: component,
            // key: index,
            key: component.split(" ")[0],
            currencyCode: componentNoList[index]
          });
        });
      });
        return componentData;
    },
    createData() {
       let tempAddInfo={
            batchDateProcessType: this.tempAdd.batchDateProcessType,
            corporationEntityName: this.tempAdd.corporationEntityName,
            currencyDesc: this.tempAdd.currencyDesc,
            dateType: this.tempAdd.dateType,
            defaultFlag: this.tempAdd.defaultFlag,
            modeName: this.tempAdd.modeName,
            operationMode: this.tempAddoperationMode,
        }
        let currencyList=[]
        currencyList.push(this.tempAdd3)
        //console.log(this.tempAdd)
        tempAddInfo.currencyList=currencyList;
        this.$refs['dataFormAdd'].validate((valid) => {
            if (valid) {
                this.post('/beta/betaService/COS.AD.02.0006', tempAddInfo, (res) => {
                    this.dialogFormVisibleAdd = false
                    this.$notify({
                      message: '新增成功',
                      type: 'success',
                    })
                    this.getList()
                    this.tempAdd = {}
                })
            }
        })
    }, 
    //详情显示弹框
    handleDetail(row) {
        this.dialogFormVisibleDetail = true
        this.tempDetail = Object.assign({}, row) // 
        this.getDetailList();
        this.$nextTick(() => {
            this.$refs['dataFormDetail'].clearValidate()
        })
    },
    getDetailList() {
        let itemOperationMode = {
            operationMode: this.tempDetail.operationMode,
            pageNum: this.tempDetail.pageNum,
            pageSize:this.tempDetail.pageSize,
        }
        this.listLoading2 = true;
        this.getTableList('/beta/betaService/COS.IQ.02.0034', itemOperationMode,(res) => {
            if (res.returnCode == '000000') {
                this.listLoading2= false;
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.tableDetailList = res.returnData.rows
                    this.tableTotalDetail = res.returnData.totalCount
                } else {
                    this.tableDetailList = []
                    this.tableTotalDetail = 0
                }
            }
        }, (err) => {
      		this.tableDetailList = []
            this.tableTotalDetail = 0
       		this.listLoading2 = false
        })
    },
    //修改显示弹框
    handleUpdate(row) {
        this.tempUp = Object.assign({}, row)
        this.dialogFormVisibleUp = true
        this.$nextTick(() => {
            this.$refs['dataFormUp'].clearValidate()
        })
         // 获取入账币种穿梭框左侧数据
        this.up_allBusTypeData = this.up_generateAllBusTypeData();
        // 获取入账币种穿梭框右侧数据
        this.up_busTypeList = this.up_generateRightData(row)
    }, 
     //下一步
//  nextStepBtn(){
//      this.$refs["dataFormAdd"].validate(valid => {
//          if (valid) {
//              this.upBusPro_part1Btn = false;
//              this.isReadonly2 = true;
//              this.isDisabled3 = true;
//              this.upBusPro_part2 = true;
//              this.upBusPro_part2Btn = true;
//              this.up_allBusTypeData = this.generateAllBusTypeData();
//          }
//      });
//  },
    upBusPro_nextToPart3Btn() {
      // 判断是否设置默认入账币种
        if (this.up_rightCheckedBusType=='' || this.up_rightCheckedBusType==undefined) {
           this.$message({
                message: "请设置默认入账币种",
                type: "warning"
            });
            return;
        }
        this.upBusPro_part2Btn = false;
        this.upBusPro_part3 = true;
        this.upBusPro_part3Btn = true;
        this.up_allBalanceData = this.generateAllBalanceData();
    },
//     upBusPro_nextToPart5Btn() {
// //      this.addBusPro_part1 = false;
// //      this.addBusPro_part2 = false;
// //      this.addBusPro_part3 = false;
//         // 查询
//         this.generateAllBusTypeData();
//     },

    // 上一步
    upBusPro_backPar1Btn() {
      this.upBusPro_part2 = false;
      this.upBusPro_part1Btn = true;
    },
    upBusPro_backPar2Btn() {
        this.upBusPro_part3 = false;
        this.upBusPro_part2Btn = true;
    },
    upBusPro_backPar3Btn() {
        this.upBusPro_part3Btn = true;
    },
    upBusPro_backPar4Btn() {
        this.upBusPro_part1 = true;
        this.upBusPro_part2 = true;
        this.upBusPro_part3 = true;
        this.upBusPro_part1Btn = false;
        this.upBusPro_part2Btn = false;
        this.upBusPro_part3Btn = false;
    },
    // 2选择入账币种
    up_filterMethod(query, item) {
        return item.currencyCode.indexOf(query) > -1;
        
    },
    // 左侧被选中入账币种
    up_handleAddComponent(value, direction, movedKeys) {
        this.$refs['dataFormUp'].validate((valid) => {
            if (valid) {
                // businessTypeCodeInitData  原始数据
                this.up_busTypeList = value; // 选择的+右侧的数据 数组
                // this.upRightCuurList = value  // 选择的+右侧的数据 数组
                value.forEach((item, index) => {
                    this.businessTypeCodeInitData.forEach((item2, ii) => {
                        if (item == item2.currencyCode) {
                            this.upRightCuurList.push({
                                operationMode: this.tempUp.operationMode,
                                currencyCode: item
                            })
                        }
                    })
                })
                this.dialogFormVisiblePriorityUp=true;
            }
        })
    },
    // 右侧被选入账币种
    up_rightCheckedChange(val,direction,movedKeys) {
        this.rightCheckedBusType = val; // 右侧别选中的数据数组
    },
    // 修改 确定还款优先级
    upCreateData(){
       this.dialogFormVisiblePriorityUp = false;
       this.upRightCuurList[this.upRightCuurList.length-1].creditProportion = this.tempUp3.creditProportion
       this.upRightCuurList[this.upRightCuurList.length-1].paymentPriority = this.tempUp3.paymentPriority

    },
    // 获取入账币种穿梭框左侧数据
    up_generateAllBusTypeData() {
        const componentData = []; // 相当于data
        const componentNoList = []; //
        const componentList = [];
        var field = {};
        field.operationMode=this.tempUp.operationMode
        //field.controlProjectNo=this.tempControl.controlProjectNo
        this.post("/beta/betaService/COS.IQ.02.0012", field, res => {
        this.businessTypeCodeInitData = res.returnData.rows;
        console.log(res.returnData.rows)
        res.returnData.rows.forEach((item, i) => {
          componentList.push(item.currencyCode + " " + item.currencyDesc);
          componentNoList.push(item.currencyCode);
        });
        componentList.forEach((component, index) => {
          componentData.push({
            label: component,
            // key: index,
            key: component.split(" ")[0],
            currencyCode: componentNoList[index]
          });
        });
      });
        return componentData;
    },
    // 修改 获取右侧数据
    up_generateRightData(row) {
        const rightData = []
        let obj = {
            currencyCode: row.accountCurrency
        }
        this.post('/beta/betaService/COS.IQ.02.0012', obj ,(res) => {
            if (res.returnCode == '000000') {
                let rows = []
                if (res.returnData &&  res.returnData.rows &&  res.returnData.rows.length > 0) {
                    rows = res.returnData.rows
                    rows.forEach(rightItem => {
                        rightItem.label = rightItem.currencyCode+' '+rightItem.currencyDesc
                        rightItem.key = rightItem.currencyCode
                        rightData.push(rightItem.currencyCode)
                    })
                } else {
                    rows = []
                }
            }
        })
        return rightData
    },
    updateData() {
        let tempUpInfo = Object.assign({}, this.tempUp)
        tempUpInfo.currencyList = this.upRightCuurList
        this.$refs['dataFormUp'].validate((valid) => {
            if (valid) {
                this.post('/beta/betaService/COS.AD.02.0006', tempUpInfo, (res) => {
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
            }
        })
    }, 
  }
}
</script>

<style>
/* 穿梭框样式 */
.el-transfer-panel {
    width: 37%;
}
</style>

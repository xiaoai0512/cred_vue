<!-- 记账规则主表 -->
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
                    :value="item.operationMode"
                />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="记账规则代码" prop="accountingRuleCode">
                <el-input v-model="queryFormObj.accountingRuleCode" class="wd200" type="text" />
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
            <el-table-column prop="accountingRuleCode" label="记账规则" align="left" width = "200" >
                <template slot-scope="{row}">
                    {{row.accountingRuleCode}}
                    {{row.accountingRuleDesc}}
                </template>
                <!-- <template slot-scope="{row}">
                    <span class="tdDivL">
                    {{row.accountingRuleCode}}
                    </span>
                    <span class="tdDivR">
                    {{row.accountingRuleDesc}}
                    </span>
                </template> -->
            </el-table-column>
            <el-table-column prop="accountingObjectDesc" label="记账对象" align="center" />
            <el-table-column prop="accountingSubtableTypeDesc" label="记账子表类型" align="center" />
            <el-table-column prop="balancePropertyDesc" label="记账余额性质" align="center" />
            <el-table-column prop="balanceTypeDesc" label="记账余额类型" align="center" />
            <!-- <el-table-column prop="balanceObjectCode" label="余额对象代码" align="center" /> -->
            <el-table-column prop="accountingDirectionDesc" label="记账发生方向" align="center" />
            <el-table-column prop="sendAcctnoFlag" label="发送账号标志" align="center" />
            <el-table-column prop="" label="操作" align="center" width = "300">
                <template slot-scope="{row}">
                    <el-button size="mini" icon="el-icon-more" type="primary" @click="handleDetail(row)" v-show="selBtnFlag">详情</el-button>
                    <el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleUpdate(row)" v-show="updBtnFlag">修改</el-button>
                    <el-button size="mini" icon="el-icon-delete"  type="primary" @click="handleDelete(row)" v-show="delBtnFlag">删除</el-button>
                </template> 
            </el-table-column>
        </el-table>
        <pagination v-show="config.total>0" :total="config.total" :page.sync="config.pageNum" :limit.sync="config.pageSize" @pagination="getList" />

        
        <!-- 新增 -->
        <el-dialog title="新增" :visible.sync="dialogFormVisibleAdd" width="75%">
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
               <el-form-item class="cl_td" label="记账规则代码" prop="accountingRuleCode" 
               :rules="[ { required: true, message: '记账规则代码不能为空'} ]">
                     <el-input v-model="tempAdd.accountingRuleCode" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="记账规则描述" prop="accountingRuleDesc">
                    <el-input v-model="tempAdd.accountingRuleDesc" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="记账对象" prop="accountingObject" >
                    <el-select v-model="tempAdd.accountingObject" class="wd200" clearable @change="objChange($event)">
                        <el-option
                        v-for="(item, index ) in accountingObjectOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="记账子表类型" prop="accountingSubtableType">
                    <el-select v-model="tempAdd.accountingSubtableType" class="wd200" clearable :disabled="accountingSubtable_disabled">
                        <el-option
                        v-for="(item, index ) in accountingSubtableTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="余额变动标识" prop="balanceChangeFlag" >
                    <el-select v-model="tempAdd.balanceChangeFlag" class="wd200" clearable>
                        <el-option
                        v-for="(item, index ) in balanceChangeFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="币种指示" prop="currencyType" >
                    <el-select v-model="tempAdd.currencyType" class="wd200" clearable>
                        <el-option
                        v-for="(item, index ) in currencyTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <div class="text_title">信息匹配项</div>
                <el-form-item class="cl_td" label="记账余额性质" prop="balanceProperty">
                    <el-select v-model="tempAdd.balanceProperty" class="wd200" clearable :disabled="isDisabled1">
                        <el-option
                        v-for="(item, index ) in balancePropertyOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="记账余额类型" prop="balanceType" >
                    <el-select v-model="tempAdd.balanceType" class="wd200" clearable :disabled="isDisabled1" @change="balTypeChange($event)">
                        <el-option
                        v-for="(item, index ) in balanceTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="记账余额对象编号" prop="balanceObjectCode" >
                    <el-select v-model="tempAdd.balanceObjectCode" class="wd200" clearable  :disabled="isDisabled1">
                        <el-option
                        v-for="(item, index ) in balanceObjectCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="记账发生方向" prop="accountingDirection">
                    <el-select v-model="tempAdd.accountingDirection" class="wd200" clearable  :disabled="isDisabled1">
                        <el-option
                        v-for="(item, index ) in accountingDirectionOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="发送账号标志" prop="sendAcctnoFlag" >
                    <el-select v-model="tempAdd.sendAcctnoFlag" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in sendAcctnoFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <div class="cl_tr text_center" v-show="add_part1Btn">
                    <el-button size="medium" icon="el-icon-arrow-down" type="primary" @click="add_nextTo2Btn">下一步</el-button>
                </div>
                <div v-show="add_part2">
                    <div class="text_title">绑定核算场景</div>
                    <div style="margin-left: 10%;">
                        <el-transfer 
                            filterable
                            :filter-method="filterMethod"
                            :titles="['可选核算场景', '已选核算场景']"
                            filter-placeholder="请输入核算场景"
                            v-model="add_sceneSequenceList"
                            @change="add_handleAddComponent"
                            @right-check-change="add_rightCheckedChange"
                            :data="add_leftData">
                        </el-transfer>
                    </div>

                    <div class="cl_tr text_center" v-show="add_part2Btn">
                        <el-button size="medium" icon="el-icon-arrow-up" type="primary" @click="add_backTo1Btn()">上一步</el-button>
                    </div>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
            <el-button  type="primary" @click="createData()">
                确定
            </el-button>
            <el-button @click="addClose()">
                关闭
            </el-button>
            </div>
        </el-dialog>

        <!-- 详情 -->
        <el-dialog title="详情" :visible.sync="dialogFormVisibleDetail" width="75%">
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
               <el-form-item class="cl_td" label="记账规则代码" prop="accountingRuleCode" >
                     <el-input v-model="tempDetail.accountingRuleCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="记账规则描述" prop="accountingRuleDesc">
                    <el-input v-model="tempDetail.accountingRuleDesc" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="记账对象" prop="accountingObject" >
                    <el-select v-model="tempDetail.accountingObject" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in accountingObjectOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="记账子表类型" prop="accountingSubtableType">
                    <el-select v-model="tempDetail.accountingSubtableType" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in accountingSubtableTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="余额变动标识" prop="balanceChangeFlag" >
                    <el-select v-model="tempDetail.balanceChangeFlag" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in balanceChangeFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="币种指示" prop="currencyType" >
                    <el-select v-model="tempDetail.currencyType" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in currencyTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <div class="text_title">信息匹配项</div>
                <el-form-item class="cl_td" label="记账余额性质" prop="balanceProperty">
                    <el-select v-model="tempDetail.balanceProperty" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in balancePropertyOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="记账余额类型" prop="balanceType" >
                    <el-select v-model="tempDetail.balanceType" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in balanceTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="记账余额对象编号" prop="balanceObjectCode" >
                    <el-input v-model="tempDetail.balanceObjectCode" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="记账发生方向" prop="accountingDirection">
                    <el-select v-model="tempDetail.accountingDirection" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in accountingDirectionOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="发送账号标志" prop="sendAcctnoFlag" >
                    <el-select v-model="tempDetail.sendAcctnoFlag" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in sendAcctnoFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="text_title">绑定核算场景</div>
            <el-table
                v-loading = "detail_config.loading"
                :data="detail_tableData"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
            >
                <el-table-column prop="operationMode" label="运营模式" align="center" />
                <el-table-column prop="sceneSequence" label="核算场景编号" align="center"/>
                <el-table-column prop="sceneSequenceDesc" label="核算场景描述" align="center" />
            </el-table>
            <pagination v-show="detail_config.total>0" :total="detail_config.total" :page.sync="detail_config.pageNum" :limit.sync="detail_config.pageSize" @pagination="detail_getList" />

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleDetail = false">
                    关闭
                </el-button>
            </div>
        </el-dialog>

        <!-- 修改 -->
        <el-dialog title="修改" :visible.sync="dialogFormVisibleUp" width="75%">
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
               <el-form-item class="cl_td" label="记账规则代码" prop="accountingRuleCode" >
                     <el-input v-model="tempUp.accountingRuleCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="记账规则描述" prop="accountingRuleDesc">
                    <el-input v-model="tempUp.accountingRuleDesc" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="记账对象" prop="accountingObject" >
                    <el-select v-model="tempUp.accountingObject" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in accountingObjectOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="记账子表类型" prop="accountingSubtableType">
                    <el-select v-model="tempUp.accountingSubtableType" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in accountingSubtableTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="余额变动标识" prop="balanceChangeFlag" >
                    <el-select v-model="tempUp.balanceChangeFlag" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in balanceChangeFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="币种指示" prop="currencyType" >
                    <el-select v-model="tempUp.currencyType" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in currencyTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <div class="text_title">信息匹配项</div>
                <el-form-item class="cl_td" label="记账余额性质" prop="balanceProperty">
                    <el-select v-model="tempUp.balanceProperty" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in balancePropertyOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="记账余额类型" prop="balanceType" >
                    <el-select v-model="tempUp.balanceType" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in balanceTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="记账余额对象编号" prop="balanceObjectCode" >
                    <el-input v-model="tempUp.balanceObjectCode" class="wd200" type="text"  />
                </el-form-item>
                <el-form-item class="cl_td" label="记账发生方向" prop="accountingDirection">
                    <el-select v-model="tempUp.accountingDirection" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in accountingDirectionOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="发送账号标志" prop="sendAcctnoFlag" >
                    <el-select v-model="tempUp.sendAcctnoFlag" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in sendAcctnoFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                
                <div class="text_title">绑定核算场景</div>
                <div style="margin-left: 10%;">
                    <el-transfer 
                        filterable
                        :filter-method="filterMethod"
                        :titles="['可选核算场景', '已选核算场景']"
                        filter-placeholder="请输入核算场景"
                        v-model="up_sceneSequenceList"
                        @change="up_handleAddComponent"
                        @right-check-change="up_rightCheckedChange"
                        :data="up_leftData">
                    </el-transfer>
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
  name: 'accountingRuleMaster',
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
        mediaObjectTypeOptions: [],
        mediaFormOptions: [],

        accountingObjectOptions: [], // 记账对象
        accountingSubtableTypeOptions: [], // 记账子表类型
        balanceChangeFlagOptions: [], // 余额变动标识
        currencyTypeOptions: [], // 币种指示
        balancePropertyOptions: [], // 记账余额性质
        balanceTypeOptions: [], // 记账余额类型
        accountingDirectionOptions: [], // 记账发生方向
        sendAcctnoFlagOptions: [], // 发送账号标志
        balanceObjectCodeOptions: [], // 记账余额对象编号
        // 增删改查
        tempAdd: {}, // 新增
        rulesAdd: {},
        refAdd: {},
        tempUp: {}, // 修改
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
        detail_config: {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0
        },
        detail_tableData: [],
    
        // 修改
        up_leftData: [], // 左侧数据
        up_sceneSequenceList: [], // 右侧数据
        up_rightCheckedId: [], // 右侧选中
        up_initData: [], // 初始化所以数据
        
        // 新增
        add_part1Btn: true,
        add_part2: false,
        add_sceneSequenceList: [],
        add_leftData: [],
        add_initData: [], // 初始化所以数据
        add_rightCheckedId: [], // 右侧选中
        add_part2Btn: false,
        isDisabled1: false, // 信息匹配项
        add_objectType: '' , // 记账余额类型
        accountingSubtable_disabled: false,
        
        

    }
  },
  created() {
    this.getBtnAuth()
  },
  watch: {},
  mounted() {
    this.getList()

    // 运营模式 
    this.getSelectDict( "/beta/betaService/COS.IQ.02.0006").then(res => {
        this.operationModeOptions = res
    })
    // 记账对象 
    this.getSelectDict( "dic_accountingObject").then(res => {
        this.accountingObjectOptions = res
    })
    // 记账子表类型 
    this.getSelectDict( "dic_accountingSubtableType").then(res => {
        this.accountingSubtableTypeOptions = res
    })
    // 余额变动标识 
    this.getSelectDict( "dic_balanceChangeFlag").then(res => {
        this.balanceChangeFlagOptions = res
    })
    // 币种指示 
    this.getSelectDict( "dic_currencyType").then(res => {
        this.currencyTypeOptions = res
    })
    // 记账余额性质 
    this.getSelectDict( "dic_accountingBalanceProperty").then(res => {
        this.balancePropertyOptions = res
    })
    // 记账余额类型 
    this.getSelectDict( "dic_accountingBalanceType").then(res => {
        this.balanceTypeOptions = res
            
    })
    // 记账发生方向 
    this.getSelectDict( "dic_accountingDirection").then(res => {
        this.accountingDirectionOptions = res
    })
    // 发送账号标志 
    this.getSelectDict( "dic_sendAcctnoFlag").then(res => {
        this.sendAcctnoFlagOptions = res
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
                    if (this.btnAuthStr.includes('COS.IQ.02.0115')) { // 查询
                        this.selBtnFlag = true
                    } else {
                        this.selBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.AD.02.0062')) { // 新增
                        this.addBtnFlag = true
                    } else {
                        this.addBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.UP.02.0100')) { // 维护
                        this.updBtnFlag = true
                    } else {
                        this.updBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.UP.02.0061')) { // 删除
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
        let params = {
            isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_accountingObject','dic_accountingSubtableType','dic_accountingBalanceProperty','dic_accountingBalanceType','dic_accountingDirection','dic_isYorN'],//查找数据字典所需参数
			transDict : ['accountingObject','accountingSubtableType','balanceProperty','balanceType','accountingDirection','capitalFlag'],
        }
        params = Object.assign(params, this.queryFormObj, this.config)
        this.getTableList('/beta/betaService/COS.IQ.02.0115', params,(res) => {
            if (res.returnCode == '000000') {
                this.config.loading = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.tableData = res.returnData.rows
                    this.config.total = res.returnData.totalCount
                } else {
                    this.tableData = []
                    this.config.total = 0
                }
            }
        }, (err) => {
      		this.tableData = []
            this.config.total = 0
       		this.listLoading = false
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
    // 下一步
    add_nextTo2Btn() {
        this.$refs['refAdd'].validate((valid) => {
            if (valid) {
                this.add_part2 = true
                this.add_part1Btn = false
                this.add_part2Btn = true
                this.add_leftData = this.getLeftAllData()
            }
        })
    } ,
    // 上一步
    add_backTo1Btn() {
        this.add_part2 = false
        this.add_part1Btn = true
        this.add_part2Btn = false
        this.add_leftData = []
    },
    // 左侧被选中
    add_handleAddComponent(value, direction, movedKeys) {
        this.add_sceneSequenceList = value
    },
    // 右侧选中
    add_rightCheckedChange(val) {
        this.add_rightCheckedId = val
    },
    // 新增 左侧所有数据
    getLeftAllData() {
        let componentData = [] // 相当于data
        let leftBusData = []
        let params = {
            operationMode: this.tempAdd.operationMode,
            requestType : 'M'
        }
        this.post('/beta/betaService/COS.IQ.02.0063', params ,(res) => {
            this.add_initData = res.returnData.rows
            res.returnData.rows.forEach((item,index)  => {
                item.label = item.masterSceneSequence+' '+item.masterSceneDesc
                item.key = item.masterSceneSequence
                componentData.push(item)
            })
        })
        return componentData
    },

    //联动验证
		/*1、记账对象为余额类时，记账子表类型必须为科目
		2、记账对象为非余额类时，记账子表类型可选，其他匹配项均为灰色，不可输入
		3、记账类型为余额类时，记账子表类型、记账余额性质、记账余额类型、
		   记账发生方向为必输项。记账余额对象编号可输入“无”
		 */
    // 记账对象 联动 记账子表类型
    objChange(val) {
        if (val == 'B') { // 余额类
            this.tempAdd.accountingSubtableType = 'L'
            this.accountingSubtable_disabled = true
            this.isDisabled1 = false
            // if (!this.tempAdd.balanceProperty) {
            //     this.$message({
            //         title: '提示',
            //         message: '记账余额性质不能为空',
            //         type: 'warning',
            //         duration: 2000
            //     })
            //     return
            // }
            // if (!this.tempAdd.balanceType) {
            //     this.$message({
            //         title: '提示',
            //         message: '记账余额类型不能为空',
            //         type: 'warning',
            //         duration: 2000
            //     })
            //     return
            // }
            // if (!this.tempAdd.accountingDirection) {
            //     this.$message({
            //         title: '提示',
            //         message: '账发生方向不能为空',
            //         type: 'warning',
            //         duration: 2000
            //     })
            //     return
            // }
        } else if (val == 'A') { // 非余额类
             // 记账对象为非余额类时，其他匹配项均为灰色，不可输入
            this.tempAdd.balanceProperty = '' // 记账余额性质
            this.tempAdd.balanceType = '' // 记账余额类型
            this.tempAdd.balanceObjectCode = '' // 记账余额对象编号
            this.tempAdd.accountingDirection = '' // 记账发生方向
            this.isDisabled1 = true
            this.accountingSubtable_disabled = false

        } else {
            // 记账对象为非余额类时，其他匹配项均为灰色，不可输入
            this.tempAdd.balanceProperty = '' // 记账余额性质
            this.tempAdd.balanceType = '' // 记账余额类型
            this.tempAdd.balanceObjectCode = '' // 记账余额对象编号
            this.tempAdd.accountingDirection = '' // 记账发生方向
            // this.tempAdd.sendAcctnoFlag = '' // 发送账号标志
            this.isDisabled1 = false
            this.accountingSubtable_disabled = false
        }
    },
    // 
    balTypeChange(val) {
        this.balanceObjectCodeOptions = []
        if (val == 'FEE') {
            this.add_objectType = 'F'
        } else if (val == 'INT') {
            this.add_objectType = 'I'
        } else if (val == 'PRI') {
            this.add_objectType = 'P'
        } else  {
            this.add_objectType = ''
        } 
        if (this.tempAdd.balanceObjectCode) {
            this.tempAdd.balanceObjectCode = ''
        }
        this.getBalanceObjectCodeOptions()
    },
    // 获取记账余额对象编号
    getBalanceObjectCodeOptions() {
        let params = {
            objectType: this.add_objectType,
			operationMode : this.tempAdd.operationMode,
        }
        this.post('/beta/betaService/COS.IQ.02.0021', params, (res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                    let arr = []
                    let rows = res.returnData.rows
                    rows.forEach((item, index) => {
                        arr[index] = {
                            label: item.objectDesc,
                            value: item.balanceObjectCode
                        }
                    })
                    this.balanceObjectCodeOptions = arr
                } else {
                    this.balanceObjectCodeOptions = []
                }
            }
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
        /*1、记账对象为余额类时，记账子表类型必须为科目
        2、记账对象为非余额类时，其他匹配项均为灰色，不可输入
        3、记账类型为余额类时，记账子表类型、记账余额性质、记账余额类型、
            记账发生方向为必输项。记账余额对象编号可输入“无”
        */
        if (this.tempAdd.accountingObject == 'B') { // 余额类
            this.tempAdd.accountingSubtableType = 'L'
            this.isDisabled1 = false
            // if (!this.tempAdd.accountingSubtableType) {
            //     this.$message({
            //         title: '提示',
            //         message: '记账子表类型不能为空',
            //         type: 'warning',
            //         duration: 2000
            //     })
            //     return
            // }
            if (!this.tempAdd.balanceProperty) {
                this.$message({
                    title: '提示',
                    message: '记账余额性质不能为空',
                    type: 'warning',
                    duration: 2000
                })
                return
            }
            if (!this.tempAdd.balanceType) {
                this.$message({
                    title: '提示',
                    message: '记账余额类型不能为空',
                    type: 'warning',
                    duration: 2000
                })
                return
            }
            if (!this.tempAdd.accountingDirection) {
                this.$message({
                    title: '提示',
                    message: '账发生方向不能为空',
                    type: 'warning',
                    duration: 2000
                })
                return
            }
            
        } else if (this.tempAdd.accountingObject == 'A') { // 非余额类
            // 记账对象为非余额类时，其他匹配项均为灰色，不可输入
            this.tempAdd.balanceProperty = '' // 记账余额性质
            this.tempAdd.balanceType = '' // 记账余额类型
            this.tempAdd.balanceObjectCode = '' // 记账余额对象编号
            this.tempAdd.accountingDirection = '' // 记账发生方向
            // this.tempAdd.sendAcctnoFlag = '' // 发送账号标志
            this.isDisabled1 = true
        } else {
            this.tempAdd.balanceProperty = '' // 记账余额性质
            this.tempAdd.balanceType = '' // 记账余额类型
            this.tempAdd.balanceObjectCode = '' // 记账余额对象编号
            this.tempAdd.accountingDirection = '' // 记账发生方向
            // this.tempAdd.sendAcctnoFlag = '' // 发送账号标志
            this.isDisabled1 = false
        }
        let sceneSequenceList = []
        this.add_initData.forEach(item => {
            this.add_sceneSequenceList.forEach(rightItem => {
                if (rightItem == item.masterSceneSequence) {
                    sceneSequenceList.push(item.masterSceneSequence)
                }
            })
        })
        this.tempAdd.sceneSequence = sceneSequenceList
        this.post('/beta/betaService/COS.AD.02.0062', this.tempAdd, (res) => {
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
    }, 
    // 详情 按钮
    handleDetail(row) {
        this.dialogFormVisibleDetail = true
        this.tempDetail = Object.assign({}, row) // 
        this.$nextTick(() => {
            this.$refs['refDetail'].clearValidate()
        })
        this.detail_getList()
    },
    detail_getList() {
        this.detail_config.loading = true
        let params = {
            operationMode : this.tempDetail.operationMode,
            requestType : 'M',
            accountingRuleCode : this.tempDetail.accountingRuleCode,
        }
        params = Object.assign(this.detail_config, params)
        this.getTableList('/beta/betaService/COS.IQ.02.0170', params ,(res) => {
            if (res.returnCode == '000000') {
                this.detail_config.loading = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.detail_tableData = res.returnData.rows
                    this.detail_config.total = res.returnData.totalCount 
                } else {
                    this.detail_tableData = []
                    this.detail_config.total = 0

                }
            }
        })
    },
    // 修改 按钮
    handleUpdate(row) {
        this.tempUp = Object.assign({}, row)
        this.dialogFormVisibleUp = true
        this.$nextTick(() => {
            this.$refs['refUp'].clearValidate()
        })

        this.up_sceneSequenceList = this.getRightData(row)
        this.up_leftData = this.getLeftData(row, this.up_sceneSequenceList)

    }, 
    // 过滤
    filterMethod(query, item) {
        return item.masterSceneSequence.indexOf(query) > -1;
    },
    // 左侧被选中
    up_handleAddComponent(value, direction, movedKeys) {
        this.up_sceneSequenceList = value
    },
    // 右侧选中
    up_rightCheckedChange(val) {
        this.up_rightCheckedId = val
    },
    // 右侧数据
    getRightData(row){
        const rightData = []
        let obj = {
            operationMode : row.operationMode,
            requestType : 'M',
            accountingRuleCode : row.accountingRuleCode,
        }
        this.post('/beta/betaService/COS.IQ.02.0170', obj ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData &&  res.returnData.rows &&  res.returnData.rows.length > 0) {
                        res.returnData.rows.forEach( (rightItem, index) => {
                        rightItem.label = rightItem.sceneSequence+' '+rightItem.sceneSequenceDesc
                        rightItem.key = rightItem.sceneSequence
                        rightData.push(rightItem.sceneSequence)
                    })
                }
                
            }
        })
        return rightData
    },
    // 左侧数据 arr: 右侧数据，需要过滤掉
    getLeftData(row, arr) {
        let componentData = [] // 相当于data
        let leftBusData = []
        let obj = {
            operationMode: row.operationMode,
            requestType: 'M'
        }
        this.post('/beta/betaService/COS.IQ.02.0063', obj ,(res) => {
            this.up_initData = res.returnData.rows
            res.returnData.rows.forEach((item,index) => {
                item.label = item.masterSceneSequence+' '+item.masterSceneDesc
                item.key = item.masterSceneSequence
                componentData.push(item)
            })
            let isrep
            for ( let m = 0 ; m < componentData.length; m++) {
                isrep = false
                for (let n = 0 ; n < this.up_sceneSequenceList.length; n++) {
                    if (arr[n] == componentData[m].masterSceneSequence) {
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
    
    // 确定 修改
    updateData() {
        this.$refs['refUp'].validate((valid) => {
            if (valid) {
                let sceneSequenceList =[]
                this.up_initData.forEach(item => {
                    this.up_sceneSequenceList.forEach(rightItem => {
                        if (rightItem == item.masterSceneSequence) {
                            sceneSequenceList.push(item.masterSceneSequence)
                        }
                    })
                })
                this.tempUp.sceneSequence = sceneSequenceList
                this.post('/beta/betaService/COS.UP.02.0100', this.tempUp, (res) => {
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
        this.tempDel = Object.assign({}, row)
        this.$confirm('是否删除该记账规则?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => { // 是
            this.post('/beta/betaService/COS.UP.02.0061', this.tempDel, (res) => {
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
    /* 穿梭框样式 */
    .el-transfer-panel {
        width: 300px;
    }
</style>

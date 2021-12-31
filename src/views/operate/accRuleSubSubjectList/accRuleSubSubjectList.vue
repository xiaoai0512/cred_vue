<!-- 记账规则子表-科目类 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="运营模式" prop="operationMode">
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
            <el-table-column prop="accountingRuleCode" label="记账规则" align="center" />
            <el-table-column prop="subTableSequence" label="子表序号" align="center" />
            <el-table-column prop="engineElement1" label="会计引擎要素1" align="center" width = "180" >
                <template slot-scope="{row}">
                    <span class="tdDivL">
                    {{row.engineElement1}}
                    </span>
                    <span class="tdDivR">
                    {{row.engineElement1Desc}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="engineElement2" label="会计引擎要素2" align="center" width = "150" >
                <template slot-scope="{row}">
                    <span class="tdDivL">
                    {{row.engineElement2}}
                    </span>
                    <span class="tdDivR">
                    {{row.engineElement2Desc}}
                    </span>
                </template>
            </el-table-column>  
            <el-table-column prop="accountingStatus" label="账户核算状态" align="center" width = "150" >
                <template slot-scope="{row}">
                    <span class="tdDivL">
                    {{row.accountingStatus}}
                    </span>
                    <span class="tdDivR">
                    {{row.accountingDesc}}
                    </span>
                </template>
            </el-table-column>
            <el-table-column prop="balanceStatus" label="余额单元核算状态" align="center" width = "150">
                <template slot-scope="{row}">
                    <div v-if="row.balanceStatusDesc">
                        <span  class="tdDivL">
                            {{row.balanceStatus}}&nbsp;&nbsp;
                        </span>
                        <span class="tdDivR">
                            {{row.balanceStatusDesc}}
                        </span>
                    </div>
                    <div v-else>
                        <span  class="tdDivL">
                            {{row.balanceStatus}}
                        </span>
                    </div>
                    
                </template>
            </el-table-column>
            <el-table-column prop="assetPropertyDesc" label="资产属性" align="center" />
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
        <el-dialog title="新增" :visible.sync="dialogFormVisibleAdd" width="85%">
            <el-form ref="refAdd" :model="tempAdd" :rules="rulesAdd">
                <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
                :rules="[ { required: true, message: '运营模式不能为空'} ]">
                    <el-select v-model="tempAdd.operationMode" class="wd200" filterable clearable @change="getOperationMode(tempAdd)">
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
                    <el-select v-model="tempAdd.accountingRuleCode" class="wd200" clearable>
                        <el-option
                        v-for="(item, index ) in accountingRuleCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="子表序号" prop="subTableSequence"
                :rules="[ { max: 3, message: '长度最多3个字符', trigger: 'blur'} ]">
                    <el-input v-model="tempAdd.subTableSequence" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="子表描述" prop="subDesc">
                    <el-input v-model="tempAdd.subDesc" class="wd200" type="text" />
                </el-form-item>
                <div class="text_title">详细信息</div>
                <el-form-item class="cl_td" label="会计引擎要素1" prop="engineElement1">
                    <el-input v-model="tempAdd.engineElement1" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="会计引擎要素描述1" prop="engineElement1Desc">
                    <el-input v-model="tempAdd.engineElement1Desc" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="会计引擎要素2" prop="engineElement2">
                    <el-input v-model="tempAdd.engineElement2" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="会计引擎要素描述2" prop="engineElement2Desc">
                    <el-input v-model="tempAdd.engineElement2Desc" class="wd200" type="text" />
                </el-form-item>

                <el-form-item class="cl_td" label="账户核算状态" prop="accountingStatus" >
                    <el-select v-model="tempAdd.accountingStatus" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in accountingStatusOptions"
                        :key="index"
                        :label="item.accountingDesc"
                        :value="item.accountingStatus"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="余额单元核算状态" prop="balanceStatus">
                    <el-select v-model="tempAdd.balanceStatus" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in balanceStatusOptions"
                        :key="index"
                        :label="item.accountingDesc"
                        :value="item.accountingStatus"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="资产属性" prop="assetProperty" >
                    <el-select v-model="tempAdd.assetProperty" class="wd200" clearable>
                        <el-option
                        v-for="(item, index ) in assetPropertyOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" />
                <el-form-item class="cl_td" label="联动收入类记账规则码" prop="linkedRevenueRuleCode" >
                    <el-select v-model="tempAdd.linkedRevenueRuleCode" class="wd200" clearable @change="getRule01" >
                        <el-option
                        v-for="(item, index ) in linkedRevenueRuleCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="联动收入类记账规则码子表" prop="linkedRevenueSubCode" >
                    <el-select v-model="tempAdd.linkedRevenueSubCode" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in linkedRevenueSubCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="联动税金类记账规则码" prop="linkedTaxRuleCode" >
                    <el-select v-model="tempAdd.linkedTaxRuleCode" class="wd200" clearable @change="getRule02" >
                        <el-option
                        v-for="(item, index ) in linkedTaxRuleCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="联动税金类记账规则码子表" prop="linkedTaxSubCode" >
                    <el-select v-model="tempAdd.linkedTaxSubCode" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in linkedTaxSubCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <!-- <el-form-item class="cl_td" label="绑定核算场景联动收入类记账规则码" prop="bindingLinkedRevenueRuleCode">
                    <el-select v-model="tempAdd.bindingLinkedRevenueRuleCode" class="wd200" clearable  @change="getRule03" >
                        <el-option
                        v-for="(item, index ) in bindingLinkedRevenueRuleCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="绑定核算场景联动收入类记账规则码子表" prop="bindingLinkedRevenueSubCode" >
                    <el-select v-model="tempAdd.bindingLinkedRevenueSubCode" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in bindingLinkedRevenueSubCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="绑定核算场景联动税金记账规则码" prop="bindingLinkedTaxRuleCode">
                    <el-select v-model="tempAdd.bindingLinkedTaxRuleCode" class="wd200" clearable  @change="getRule04" >
                        <el-option
                        v-for="(item, index ) in bindingLinkedTaxRuleCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="绑定核算场景联动税金记账规则码子表" prop="bindingLinkedTaxSubCode"  >
                    <el-select v-model="tempAdd.bindingLinkedTaxSubCode" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in bindingLinkedTaxSubCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item> -->
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
        <el-dialog title="详情" :visible.sync="dialogFormVisibleDetail" width="85%">
            <el-form ref="refDetail" :model="tempDetail" :rules="rulesDetail">
                <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
                :rules="[ { required: true, message: '运营模式不能为空'} ]">
                    <el-select v-model="tempDetail.operationMode" class="wd200" filterable clearable @change="getOperationMode(tempDetail)" disabled>
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
                    <el-select v-model="tempDetail.accountingRuleCode" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in accountingRuleCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="子表序号" prop="subTableSequence">
                    <el-input v-model="tempDetail.subTableSequence" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="子表描述" prop="subDesc">
                    <el-input v-model="tempDetail.subDesc" class="wd200" type="text" readonly />
                </el-form-item>
                <div class="text_title">详细信息</div>
                <el-form-item class="cl_td" label="会计引擎要素1" prop="engineElement1">
                    <el-input v-model="tempDetail.engineElement1" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="会计引擎要素描述1" prop="engineElement1Desc">
                    <el-input v-model="tempDetail.engineElement1Desc" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="会计引擎要素2" prop="engineElement2">
                    <el-input v-model="tempDetail.engineElement2" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="会计引擎要素描述2" prop="engineElement2Desc">
                    <el-input v-model="tempDetail.engineElement2Desc" class="wd200" type="text" readonly/>
                </el-form-item>

                <el-form-item class="cl_td" label="账户核算状态" prop="accountingStatus" >
                    <el-select v-model="tempDetail.accountingStatus" class="wd200" clearable  disabled>
                        <el-option
                        v-for="(item, index ) in accountingStatusOptions"
                        :key="index"
                        :label="item.accountingDesc"
                        :value="item.accountingStatus"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="余额单元核算状态" prop="balanceStatus">
                    <el-select v-model="tempDetail.balanceStatus" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in balanceStatusOptions"
                        :key="index"
                        :label="item.accountingDesc"
                        :value="item.accountingStatus"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="资产属性" prop="assetProperty" >
                    <el-select v-model="tempDetail.assetProperty" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in assetPropertyOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" />
                <el-form-item class="cl_td" label="联动收入类记账规则码" prop="linkedRevenueRuleCode" >
                    <el-select v-model="tempDetail.linkedRevenueRuleCode" class="wd200" clearable @change="getRule01" disabled>
                        <el-option
                        v-for="(item, index ) in linkedRevenueRuleCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="联动收入类记账规则码子表" prop="linkedRevenueSubCode" >
                    <el-select v-model="tempDetail.linkedRevenueSubCode" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in linkedRevenueSubCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="联动税金类记账规则码" prop="linkedTaxRuleCode" >
                    <el-select v-model="tempDetail.linkedTaxRuleCode" class="wd200" clearable @change="getRule02" disabled>
                        <el-option
                        v-for="(item, index ) in linkedTaxRuleCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="联动税金类记账规则码子表" prop="linkedTaxSubCode" >
                    <el-select v-model="tempDetail.linkedTaxSubCode" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in linkedTaxSubCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <!-- <el-form-item class="cl_td" label="绑定核算场景联动收入类记账规则码" prop="bindingLinkedRevenueRuleCode">
                    <el-select v-model="tempDetail.bindingLinkedRevenueRuleCode" class="wd200" clearable  @change="getRule03" disabled>
                        <el-option
                        v-for="(item, index ) in bindingLinkedRevenueRuleCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="绑定核算场景联动收入类记账规则码子表" prop="bindingLinkedRevenueSubCode" >
                    <el-select v-model="tempDetail.bindingLinkedRevenueSubCode" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in bindingLinkedRevenueSubCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="绑定核算场景联动税金记账规则码" prop="bindingLinkedTaxRuleCode">
                    <el-select v-model="tempDetail.bindingLinkedTaxRuleCode" class="wd200" clearable  @change="getRule04" disabled>
                        <el-option
                        v-for="(item, index ) in bindingLinkedTaxRuleCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="绑定核算场景联动税金记账规则码子表" prop="bindingLinkedTaxSubCode"  >
                    <el-select v-model="tempDetail.bindingLinkedTaxSubCode" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in bindingLinkedTaxSubCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item> -->
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
                    <el-select v-model="tempUp.operationMode" class="wd200" clearable @change="getOperationMode(row)" disabled>
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
                    <el-select v-model="tempUp.accountingRuleCode" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in accountingRuleCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="子表序号" prop="subTableSequence" >
                    <el-input v-model="tempUp.subTableSequence" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="子表描述" prop="subDesc">
                    <el-input v-model="tempUp.subDesc" class="wd200" type="text" />
                </el-form-item>
                <div class="text_title">详细信息</div>
                <el-form-item class="cl_td" label="会计引擎要素1" prop="engineElement1">
                    <el-input v-model="tempUp.engineElement1" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="会计引擎要素描述1" prop="engineElement1Desc">
                    <el-input v-model="tempUp.engineElement1Desc" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="会计引擎要素2" prop="engineElement2">
                    <el-input v-model="tempUp.engineElement2" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="会计引擎要素描述2" prop="engineElement2Desc">
                    <el-input v-model="tempUp.engineElement2Desc" class="wd200" type="text" />
                </el-form-item>

                <el-form-item class="cl_td" label="账户核算状态" prop="accountingStatus" >
                    <el-select v-model="tempUp.accountingStatus" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in accountingStatusOptions"
                        :key="index"
                        :label="item.accountingDesc"
                        :value="item.accountingStatus"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="余额单元核算状态" prop="balanceStatus">
                    <el-select v-model="tempUp.balanceStatus" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in balanceStatusOptions"
                        :key="index"
                        :label="item.accountingDesc"
                        :value="item.accountingStatus"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="资产属性" prop="assetProperty" >
                    <el-select v-model="tempUp.assetProperty" class="wd200" clearable>
                        <el-option
                        v-for="(item, index ) in assetPropertyOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" />
                <el-form-item class="cl_td" label="联动收入类记账规则码" prop="linkedRevenueRuleCode" >
                    <el-select v-model="tempUp.linkedRevenueRuleCode" class="wd200" clearable @change="getRule01" >
                        <el-option
                        v-for="(item, index ) in linkedRevenueRuleCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="联动收入类记账规则码子表" prop="linkedRevenueSubCode" >
                    <el-select v-model="tempUp.linkedRevenueSubCode" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in linkedRevenueSubCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="联动税金类记账规则码" prop="linkedTaxRuleCode" >
                    <el-select v-model="tempUp.linkedTaxRuleCode" class="wd200" clearable @change="getRule02" >
                        <el-option
                        v-for="(item, index ) in linkedTaxRuleCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="联动税金类记账规则码子表" prop="linkedTaxSubCode" >
                    <el-select v-model="tempUp.linkedTaxSubCode" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in linkedTaxSubCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <!-- <el-form-item class="cl_td" label="绑定核算场景联动收入类记账规则码" prop="bindingLinkedRevenueRuleCode">
                    <el-select v-model="tempUp.bindingLinkedRevenueRuleCode" class="wd200" clearable  @change="getRule03" >
                        <el-option
                        v-for="(item, index ) in bindingLinkedRevenueRuleCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="绑定核算场景联动收入类记账规则码子表" prop="bindingLinkedRevenueSubCode" >
                    <el-select v-model="tempUp.bindingLinkedRevenueSubCode" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in bindingLinkedRevenueSubCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="绑定核算场景联动税金记账规则码" prop="bindingLinkedTaxRuleCode">
                    <el-select v-model="tempUp.bindingLinkedTaxRuleCode" class="wd200" clearable  @change="getRule04" >
                        <el-option
                        v-for="(item, index ) in bindingLinkedTaxRuleCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="绑定核算场景联动税金记账规则码子表" prop="bindingLinkedTaxSubCode"  >
                    <el-select v-model="tempUp.bindingLinkedTaxSubCode" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in bindingLinkedTaxSubCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.value"
                        />
                    </el-select>
                </el-form-item> -->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateData()">
                    确定
                </el-button>
                <el-button  @click="dialogFormVisibleUp = false">
                    关闭
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Pagination from "@/components/Pagination";

export default {
  name: 'accRuleSubSubjectList',
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
        accountingRuleCodeOptions: [], // 记账规则代码 
        accountingStatusOptions: [], // 账户核算状态
        balanceStatusOptions: [], // 余额单元核算状态
        assetPropertyOptions: [], // 资产属性
        linkedRevenueRuleCodeOptions: [], // 联动收入类记账规则码
        linkedRevenueSubCodeOptions: [], // 联动收入类记账规则码子表
        linkedTaxRuleCodeOptions: [], // 联动税金类记账规则码
        linkedTaxSubCodeOptions: [], // 联动税金类记账规则码子表
        bindingLinkedRevenueRuleCodeOptions: [], // 绑定核算场景联动收入类记账规则码
        bindingLinkedRevenueSubCodeOptions: [], // 绑定核算场景联动收入类记账规则码子表
        bindingLinkedTaxRuleCodeOptions: [], // 绑定核算场景联动税金记账规则码
        bindingLinkedTaxSubCodeOptions: [], // 绑定核算场景联动税金记账规则码子表


        
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
        // 业务类型参数选项
        textTitle9: '媒介参数选项',
        table9Loading: false,
        table9List: [],
        table9Total: 0,
        table9FormObj: {
            pageSize: 10,
            pageNum: 1
        },
        

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
    // 账户核算状态 余额单元核算状态
    this.getSelectDict( "/beta/betaService/COS.IQ.02.0051",{Flag:'Y'}).then(res => {
        this.accountingStatusOptions = res
        this.balanceStatusOptions = res
    })
    // 资产属性
    this.getSelectDict( "dic_assetSubTable").then(res => {
        this.assetPropertyOptions = res
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
                    if (this.btnAuthStr.includes('COS.IQ.02.0120')) { // 查询
                        this.selBtnFlag = true
                    } else {
                        this.selBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.AD.02.0105')) { // 新增
                        this.addBtnFlag = true
                    } else {
                        this.addBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.UP.02.0105')) { // 维护
                        this.updBtnFlag = true
                    } else {
                        this.updBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.UP.02.0063')) { // 删除
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
			transParams : ['dic_assetSubTable'],//查找数据字典所需参数
			transDict : ['assetProperty'],//翻译前后key
        }
        this.config = Object.assign(this.config, this.queryFormObj, params)
        this.getTableList('/beta/betaService/COS.IQ.02.0120', this.config ,(res) => {
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
            this.post('/beta/betaService/COS.AD.02.0105', this.tempAdd, (res) => {
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
    // 运营模式联动
    getOperationMode(obj) {
        this.accountingRuleCodeOptions = []
        this.accountingRuleCodeOptions = [] // 记账规则代码
        this.linkedRevenueRuleCodeOptions = [] // 联动收入类记账规则码
        this.bindingLinkedRevenueRuleCodeOptions = [] // 绑定核算场景联动收入类记账规则码
        this.bindingLinkedTaxRuleCodeOptions = [] // 绑定核算场景联动税金记账规则码 
        this.getAccountingRuleOptions(obj) // 获取记账规则代码 
        this.getOtherAccountingRuleOptions(obj) // 其他记账规则码
    },
    // 获取记账规则代码 
    getAccountingRuleOptions(obj) {
        // 记账规则代码 
        let params= {
            operationMode : obj.operationMode
        }
        this.post('/beta/betaService/COS.IQ.02.0115', params ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    let arr = []
                    let rows = res.returnData.rows
                    rows.forEach((item,index)=> {
                        arr[index] = {
                            label: item.accountingRuleCode+' '+ item.accountingRuleDesc,
                            value: item.accountingRuleCode
                        }
                    })
                    this.accountingRuleCodeOptions = arr
                } else {
                    this.accountingRuleCodeOptions = []
                }
            }
        })
    },
    // 其他记账规则码
    getOtherAccountingRuleOptions(obj) {
        let params1 ={
            operationMode :  obj.operationMode,
            accountingObject : 'A'
        }
        this.post('/beta/betaService/COS.IQ.02.0115', params1 ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    let arr = []
                    let rows = res.returnData.rows
                    rows.forEach( (item, index)  => {
                        let obj = {}
                        obj.label = item.accountingRuleCode+' '+ item.accountingRuleDesc;
                        obj.value = item.accountingRuleCode
                        // arr[index] = {
                        //     label: item.accountingRuleCode+' '+ item.accountingRuleDesc,
                        //     value: item.accountingRuleCode
                        // }
                        arr.push(obj)
                    })
                    this.linkedRevenueRuleCodeOptions = arr // 联动收入类记账规则码
                    this.linkedTaxRuleCodeOptions = arr // 联动税金类记账规则码
                    this.bindingLinkedRevenueRuleCodeOptions = arr // 绑定核算场景联动收入类记账规则码
                    this.bindingLinkedTaxRuleCodeOptions = arr // 绑定核算场景联动税金记账规则码
                }
            } else {
                this.accountingRuleCodeOptions = [] // 记账规则代码
                this.linkedRevenueRuleCodeOptions = [] // 联动收入类记账规则码
                this.bindingLinkedRevenueRuleCodeOptions = [] // 绑定核算场景联动收入类记账规则码
                this.bindingLinkedTaxRuleCodeOptions = [] // 绑定核算场景联动税金记账规则码 
            }
        })

    },
    
    // 联动收入类记账规则码子表
    getLinkedRevenueSubCodeOptions(obj) {
        let params1 ={
            operationMode : obj.operationMode,
			accountingRuleCode : obj.linkedRevenueRuleCode,
        }
        this.post('/beta/betaService/COS.IQ.02.0120', params1 ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    let arr = []
                    let rows = res.returnData.rows
                    rows.forEach( (item, index)  => {
                        let obj = {}
                        obj.label = item.subTableSequence+' '+ item.subDesc;
                        obj.value = item.subTableSequence
                        arr.push(obj)
                    })
                    this.linkedRevenueSubCodeOptions = arr // 联动收入类记账规则码子表
                }
            } else {
                this.linkedRevenueSubCodeOptions = [] // 联动收入类记账规则码子表
            }
        })
    },

    // 联动税金类记账规则码子表
    getLinkedTaxSubCodeOptions(obj) {
        let params1 ={
            operationMode : obj.operationMode,
			accountingRuleCode : obj.linkedTaxRuleCode,
        }
        this.post('/beta/betaService/COS.IQ.02.0120', params1 ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    let arr = []
                    let rows = res.returnData.rows
                    rows.forEach( (item, index)  => {
                        let obj = {}
                        obj.label = item.subTableSequence+' '+ item.subDesc;
                        obj.value = item.subTableSequence
                        arr.push(obj)
                    })
                    this.linkedTaxSubCodeOptions = arr // 联动税金类记账规则码子表
                }
            } else {
                this.linkedTaxSubCodeOptions = [] // 联动税金类记账规则码子表
            }
        })
    },
    
    
    
    
    // 联动收入类记账规则码 联动 联动收入类记账规则码子表
    getRule01(val) {
        this.linkedRevenueSubCodeOptions = [] // 联动收入类记账规则码子表
        if (this.tempAdd.linkedRevenueSubCode) { // 清空联动收入类记账规则码子表
            this.tempAdd.linkedRevenueSubCode = ''
        }
        if (val) {
            let params= {
                operationMode : this.tempAdd.operationMode,
				accountingRuleCode : val
            }
            this.post('/beta/betaService/COS.IQ.02.0120', params ,(res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        let arr = []
                        let rows = res.returnData.rows
                        rows.forEach((item,index) => {
                            arr[index] = {
                                label:  item.subTableSequence+' '+ item.subDesc,
                                value:  item.subTableSequence
                            }
                        })
                        this.linkedRevenueSubCodeOptions = arr
                        this.tempAdd.linkedRevenueSubCode = arr[0].value
                    }
                }
            })
        } else {
            this.linkedRevenueSubCodeOptions = [] // 联动收入类记账规则码子表
        }
    },
    
    // 联动税金类记账规则码 联动 联动税金类记账规则码子表
    getRule02(val) {
        this.linkedTaxSubCodeOptions = [] // 联动税金类记账规则码子表
        if (this.tempAdd.linkedTaxSubCode) { // 清空 联动税金类记账规则码子表
            this.tempAdd.linkedTaxSubCode = ''
        }
        if (val) {
            let params= {
                operationMode : this.tempAdd.operationMode,
				accountingRuleCode : val
            }
            this.post('/beta/betaService/COS.IQ.02.0120', params ,(res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        let arr = []
                        let rows = res.returnData.rows
                        rows.forEach((item,index) => {
                            arr[index] = {
                                label:  item.subTableSequence+' '+ item.subDesc,
                                value:  item.subTableSequence
                            }
                        })
                        this.linkedTaxSubCodeOptions = arr
                        this.tempAdd.linkedTaxSubCode = arr[0].value
                    }
                }
            })
        } else {
            this.linkedTaxSubCodeOptions = [] // 联动税金类记账规则码子表
        }
    },
    

    // 绑定核算场景联动收入类记账规则码 联动 绑定核算场景联动收入类记账规则码子表
    getRule03(val) {
        this.bindingLinkedRevenueSubCodeOptions = [] // 绑定核算场景联动收入类记账规则码子表
        if (this.tempAdd.bindingLinkedRevenueSubCode) { // 清空 绑定核算场景联动收入类记账规则码子表
            this.tempAdd.bindingLinkedRevenueSubCode = ''
        }
        if (val) {
            let params= {
                operationMode : this.tempAdd.operationMode,
				accountingRuleCode : val
            }
            this.post('/beta/betaService/COS.IQ.02.0120', params ,(res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        let arr = []
                        let rows = res.returnData.rows
                        rows.forEach((item,index) => {
                            arr[index] = {
                                label:  item.subTableSequence+' '+ item.subDesc,
                                value:  item.subTableSequence
                            }
                        })
                        this.bindingLinkedRevenueSubCodeOptions = arr
                        this.tempAdd.bindingLinkedRevenueSubCode = arr[0].value
                    }
                }
            })
        } else {
            this.bindingLinkedRevenueSubCodeOptions = [] // 绑定核算场景联动收入类记账规则码子表
        }
    },

    // 绑定核算场景联动税金记账规则码 联动 绑定核算场景联动税金记账规则码子表
    getRule04(val) {
        this.bindingLinkedTaxSubCodeOptions = [] // 绑定核算场景联动税金记账规则码子表
        if (this.tempAdd.bindingLinkedTaxSubCode) { // 清空 绑定核算场景联动税金记账规则码子表
            this.tempAdd.bindingLinkedTaxSubCode = ''
        }
        if (val) {
            let params= {
                operationMode : this.tempAdd.operationMode,
				accountingRuleCode : val
            }
            this.post('/beta/betaService/COS.IQ.02.0120', params ,(res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        let arr = []
                        let rows = res.returnData.rows
                        rows.forEach((item,index) => {
                            arr[index] = {
                                label:  item.subTableSequence+' '+ item.subDesc,
                                value:  item.subTableSequence
                            }
                        })
                        this.bindingLinkedTaxSubCodeOptions = arr
                        this.tempAdd.bindingLinkedTaxSubCode = arr[0].value
                    }
                }
            })
        } else {
            this.bindingLinkedTaxSubCodeOptions = [] // 绑定核算场景联动税金记账规则码子表
        }
    },
  

    // 详情 按钮
    handleDetail(row) {
        this.dialogFormVisibleDetail = true
        this.tempDetail = Object.assign({}, row) // 
        this.$nextTick(() => {
            this.$refs['refDetail'].clearValidate()
        })
        this.getOtherAccountingRuleOptions(row) // 联动收入类记账规则码 联动收入类记账规则码
        this.getLinkedRevenueSubCodeOptions(row) // 联动收入类记账规则码子表
        this.getLinkedTaxSubCodeOptions(row) // 联动税金类记账规则码子表


    },
    // 修改 按钮
    handleUpdate(row) {
        this.tempUp = Object.assign({}, row)
        this.dialogFormVisibleUp = true
        this.$nextTick(() => {
            this.$refs['refUp'].clearValidate()
        })
        this.getOtherAccountingRuleOptions(row) // 联动收入类记账规则码 联动收入类记账规则码
        this.getLinkedRevenueSubCodeOptions(row) // 联动收入类记账规则码子表
        this.getLinkedTaxSubCodeOptions(row) // 联动税金类记账规则码子表
    }, 
    // 确定 修改
    updateData() {
        this.$refs['refUp'].validate((valid) => {
            if (valid) {
               this.tempUp.artifactInstanList = this.up_mediaInList
               this.tempUp.deletePcdInstanIdList = this.delePcdList
                this.post('/beta/betaService/COS.UP.02.0105', this.tempUp, (res) => {
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
        this.$confirm('是否删除该科目类记账规则子表?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(() => { // 是
            this.post('/beta/betaService/COS.UP.02.0063', this.tempDel, (res) => {
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
.cl_td label.el-form-item__label {
    width: 50%;
}
.tdDivL {
    width: 25%
}
.tdDivR {
    width: 70%
}
</style>

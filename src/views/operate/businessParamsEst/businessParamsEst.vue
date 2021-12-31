<!-- 新产品发布 -->
<template>
    <div class="allContent">
        <div v-show="part1">
            <el-form ref="addFormRef" :rules="addFormRules" :model="addFormObj">

                <div class="text_title padLf10">产品基本信息</div>
                <el-form-item class="cl_td" label="运营模式" prop="operationMode"
                :rules="[ { required: true, message: '运营模式不能为空'} ]">
                    <el-select v-model="addFormObj.operationMode" class="wd200" @change="getProductCodeSet" clearable  :disabled="isAble1">
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode"
                    />
                    </el-select>
                </el-form-item> 
                <el-form-item class="cl_td" label="产品代码" prop="productObjectCodeHalf"
                :rules="[ { required: true, message: '产品代码不能为空'},
                    { min: 5, max: 5, message: '长度为 5 个数字'},
                    { validator: this.validNumber}
                ]">
                    MODP <el-input v-model="addFormObj.productObjectCodeHalf" class="wd150" type="text" :readonly="isReadonly1"/>
                </el-form-item>
                <el-form-item class="cl_td" label="产品描述" prop="productDesc"
                :rules="[ { required: true, message: '产品描述不能为空'}]" >
                    <el-input v-model="addFormObj.productDesc" class="wd200" type="text" :readonly="isReadonly1"/>
                </el-form-item>
                <el-form-item  class="cl_td" label="还款优先级" prop="paymentPriority">
                    <el-input v-model="addFormObj.paymentPriority" class="wd120" type="text" :readonly="isReadonly1"/>
                    <div class="search_button">
                        <el-button size="small" icon="el-icon-search" type="primary" @click="chosePriorityBtn()" >
                            查询
                        </el-button>
                    </div>
                </el-form-item>
                <el-form-item class="cl_td" label="产品期限(月)" prop="productTimeLimit">
                    <el-input v-model="addFormObj.productTimeLimit" class="wd200" type="text" :readonly="isReadonly1"/>
                </el-form-item>
                <el-form-item class="cl_td" label="套卡对方产品对象代码" prop="productCodeSet" >
                    <el-select v-model="addFormObj.productCodeSet" class="wd200" clearable :disabled="isAble1">
                    <el-option
                        v-for="(item, index ) in productCodeSetOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.productObjectCode"
                    />
                    </el-select>
                </el-form-item> 
                <el-form-item class="cl_td" label="默认业务项目" prop="defaultBusinessItem">
                    <el-input v-model="addFormObj.defaultBusinessItem" class="wd200" type="text"/>
                </el-form-item>
                <div class="cl_tr text_center" v-show="part1Btn">
                    <el-button size="small" icon="el-icon-plus" type="primary" @click="busItemAddBtn()">
                        选择业务项目
                    </el-button>
                </div>
            </el-form>
        </div>
            

        <div v-show="part2">
            <div class="text_title padLf10">选择业务项目</div>
            <div style="margin-left: 12%;">
                <el-transfer 
                    filterable
                    :filter-method="filterMethod"
                    :titles="['可选择业务项目', '已选择业务项目']"
                    filter-placeholder="请输入业务项目编号"
                    v-model="busItemList"
                    @change="handleAddComponent"
                    @right-check-change="rightCheckedChange"
                    :data="add_allBusData">
                </el-transfer>
            </div>
            <div class="cl_tr text_center mtop20" v-show="part2Btn">
                <el-button size="small" icon="el-icon-arrow-up" type="primary" @click="backPar1Btn()">
                    上一步
                </el-button>
                <el-button size="small" icon="el-icon-plus" type="primary" @click="addBusProBtn()">
                    新增业务项目
                </el-button>
                <el-button size="small" icon="el-icon-search" type="primary" @click="viewBusProBtn()">
                    查看业务项目详情
                </el-button>
                <el-button size="small" icon="el-icon-setting" type="primary" @click="setBusProBtn()">
                    设置默认业务项目
                </el-button>
                <el-button size="small" icon="el-icon-arrow-down" type="primary" @click="nextToPart3Btn()">
                    下一步选择卡版面
                </el-button>
            </div>
        </div>

        <!-- part3 选择卡版面 -->
        <div v-show="part3">
            <div class="text_title padLf10">选择卡版面</div>
            <div style="margin-left: 12%;">
                <el-transfer 
                    filterable
                    :filter-method="filterMethodFormat"
                    :titles="['可选择卡版面', '已选择卡版面']"
                    filter-placeholder="请输入卡版面编号"
                    v-model="formatList"
                    @change="handleAddFormatComponent"
                    @right-check-change="rightCheckedFormatChange"
                    :data="add_allFormatData">
                </el-transfer>
            </div>
            <div class="cl_tr text_center mtop20" v-show="part3Btn">

                <el-button size="small" icon="el-icon-arrow-up" type="primary" @click="backPar2Btn()">
                    上一步
                </el-button>
                <el-button size="small" icon="el-icon-arrow-down" type="primary" @click="nextToPart4Btn()">
                    下一步选择收费项目
                </el-button>
            </div>
        </div>

        <!--part4 选择收费项目 -->
        <div v-show="part4">
            <div class="text_title padLf10">选择收费项目</div>
            <div style="margin-left: 12%;">
                <el-transfer 
                    filterable
                    :filter-method="filterMethodFeeItem"
                    :titles="['可选择收费项目', '已选择收费项目']"
                    filter-placeholder="请输入应用维度"
                    v-model="feeItemList"
                    @change="handleAddFeeComponent"
                    @right-check-change="rightCheckedFeeItemChange"
                    :data="add_allFeeItemData">
                </el-transfer>
            </div>
            <div class="cl_tr text_center mtop20" v-show="part4Btn">

                <el-button size="small" icon="el-icon-arrow-up" type="primary" @click="backPar3Btn()">
                    上一步
                </el-button>
                <el-button size="small" icon="el-icon-arrow-down" type="primary" @click="nextToPart5Btn()">
                    下一步
                </el-button>
            </div>
        </div>

        <!--part5 产品参数设置 -->
        <div v-show="part5">
            <div class="text_title padLf10">产品参数设置</div>
                <el-form ref="addProParamFormRef" :rules="addProParamFormRules" :model="addProParamFormObj">
                    <el-form-item class="cl_td" label="产品代码" prop="productObjectCode">
                        <el-input v-model="addProParamFormObj.productObjectCode" class="wd200" type="text" />
                    </el-form-item>
                    <el-form-item class="cl_td" label="产品描述" prop="productDesc">
                        <el-input v-model="addProParamFormObj.productDesc" class="wd200" type="text" />
                    </el-form-item>
                    <el-form-item class="cl_td" label="发行卡BIN" prop="binNo">
                        <el-select v-model="addProParamFormObj.binNo" class="wd200" clearable @change="binNoChangeHandle">
                        <el-option
                        v-for="(item, index ) in binNoOptions"
                        :key="index"
                        :label="item.binNo"
                        :value="item.binNo"
                        />
                    </el-select>
                    </el-form-item>
                    <el-form-item class="cl_td" label="特殊号码段号" prop="segmentNumber" v-if="segmentNumberDiv">
                        <el-select v-model="addProParamFormObj.segmentNumber" class="wd200" clearable>
                        <el-option
                        v-for="(item, index ) in segmentNumberOptions"
                        :key="index"
                        :label="item.segmentNumber"
                        :value="item.segmentNumber"
                        />
                    </el-select>
                    </el-form-item>
                </el-form>
                <el-table
            v-loading = "listLoading1"
            :data="addProParamsList"
            class="mbtm20"
            fit
            highlight-current-row
            style="width: 100%;"
            border
            > 
                <el-table-column prop="" label="参数选项编号及描述" align="center" >
                    <template slot-scope="{row}">
                        <span class="tdDivL">{{row.artifactDesc}}&nbsp;&nbsp;:&nbsp;&nbsp;</span>
                        <span class="tdDivR">{{row.elementNo}}&nbsp;&nbsp;&nbsp;&nbsp;{{row.elementDesc}}</span>
                    </template> 
                </el-table-column>
                <el-table-column prop="" label="操作" align="center">
                    <template slot-scope="{row, $index}">
                        <el-button size="mini" type="primary" @click="addProParams_handleUpdateParams(row,$index)">替换参数</el-button>
                        <el-button size="mini" type="primary" @click="addProParams_handleSetParams(row,$index)" 
                        v-show="row.pcdNo != null && row.pcdDesc == '' && row.supportPcd == 'Y'" >设置参数值</el-button>
                        <el-button size="mini" icon="el-icon-edit" type="primary" @click="addProParams_handleSetParams(row,$index)" 
                        v-show="row.pcdNo != null && row.pcdDesc != '' && row.supportPcd == 'Y'" >设置{{row.pcdDesc}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="cl_tr text_center mtop20" v-show="part5Btn">

                <el-button size="small" icon="el-icon-arrow-up" type="primary" @click="backPar4Btn()">
                    上一步
                </el-button>
                <el-button size="small" icon="el-icon-arrow-down" type="primary" @click="nextToPart6Btn()">
                    下一步
                </el-button>
            </div>
        </div>

        <!-- 产品参数设置 替换参数弹窗 -->
        <el-dialog class="abow_dialog" title="替换参数" :visible.sync="addProParam_upParam_dialogForm" width="65%">
            <el-table
            :data="addProParam_paramsList"
            class="mtop20"
            fit
            highlight-current-row
            style="width: 100%;"
            border
            @current-change="addProParam_handleCurrParamsChange"
            @row-click="addProParam_chooseCurrParams"
            > 
                <el-table-column width="55">
                    <template slot-scope="scope">
                    <el-radio v-model="addProParam_elementNoRadio" :label="scope.row.elementNo">
                        <span class="el-radio__label"></span>
                    </el-radio>
                    </template>
                </el-table-column>
                <el-table-column prop="elementNo" label="参数选项" align="center" />
                <el-table-column prop="elementDesc" label="参数选项" align="center" />
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addProParam_upParam_dialogForm = false">
                    关闭
                </el-button>
                <el-button type="primary" @click="addProParam_sureUpParamsData()">
                    确定
                </el-button>
            </div>
        </el-dialog>

        <!-- 产品参数设置 设置参数弹窗 -->
        <el-dialog class="abow_dialog" :title="addProParam_setParamTitle" :visible.sync="addProParam_setParam_dialogForm" width="65%">
            <el-form ref="addProParam_setParam_dataForm" :rules="addProParam_setParam_rules" :model="addProParam_setParam_TempObj">
                <el-form-item class="cl_td" label="PCD编号" prop="pcdNo" 
                :rules="[ { required: true, message: 'PCD编号不能为空'}]">
                    <el-input v-model="addProParam_setParam_TempObj.pcdNo" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="分段类型" prop="segmentType">
                    <el-select v-model="addProParam_setParam_TempObj.segmentType" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in segmentTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="基础实例维度" prop="baseInstanDimen">
                    <el-select v-model="addProParam_setParam_TempObj.baseInstanDimen" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in baseInstanDimenOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="基础实例代码" prop="baseInstanCode">
                    <el-input v-model="addProParam_setParam_TempObj.baseInstanCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="可选实例维度" prop="optionInstanDimen">
                    <el-select v-model="addProParam_setParam_TempObj.optionInstanDimen" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in optionInstanDimenOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="可选实例代码" prop="optionInstanCode">
                    <el-input v-model="addProParam_setParam_TempObj.optionInstanCode" class="wd200" type="text" readonly/>
                </el-form-item>
            </el-form>
            <div class="text_title" style="margin: 20px 0" v-if="addProParam_setParam_TempObj.segmentType != null">
                <el-button size="small" icon="el-icon-plus" type="primary" @click="addPcdBtn()">
                    新增
                </el-button>
            </div>
            <el-table
            :data="addProParam_setParamsList"
            class="mtop20"
            fit
            highlight-current-row
            style="width: 100%;"
            border
            > 
                <el-table-column prop="segmentSerialNum" label="分段序号" align="center" />
                <el-table-column prop="pcdType" label="取值类型" align="center" />
                <el-table-column prop="segmentValue" label="分段取值" align="center" />
                <el-table-column prop="pcdValue" label="取值" align="center" />
                <el-table-column prop="pcdPoint" label="取值小数位" align="center" />
                <el-table-column prop="" label="操作" align="center">
                    <template slot-scope="{row, $index}">
                        <el-button size="mini" type="primary" @click="addProParam_handleUpPcd(row, $index)">修改
                        </el-button>
                        <el-button size="mini" type="primary" @click="addProParam_handleDeletePcd(row, $index)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-form class="mtop20" ref="addProParam_upPcd_dataForm" :rules="addProParam_pcd_rules" :model="addProParam_upPcd_TempObj" v-show="addProParam_pcdPart">
                <el-form-item class="cl_td" label="分段序号 " prop="segmentSerialNum">
                    <el-input v-model="addProParam_upPcd_TempObj.segmentSerialNum" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="取值类型" prop="pcdType">
                    <el-select v-model="addProParam_upPcd_TempObj.pcdType" class="wd200" clearable>
                        <el-option
                        v-for="(item, index ) in pcdTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="分段取值" prop="segmentValue">
                    <el-input v-model="addProParam_upPcd_TempObj.segmentValue" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="取值" prop="pcdValue">
                    <el-input v-model="addProParam_upPcd_TempObj.pcdValue" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="取值小数位" prop="pcdPoint">
                    <el-input v-model="addProParam_upPcd_TempObj.pcdPoint" class="wd200" type="text" />
                </el-form-item>
                <div class="cl_tr text_center">
                    <el-button size="medium" icon="el-icon-circle-check" type="primary" @click="addProParam_up_pcdSave()">保存</el-button>
                    <el-button size="medium" icon="el-icon-circle-close" type="primary" @click="addProParam_up_pcdClose()">关闭</el-button>
                </div>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="addProParam_setParam_dialogForm = false">
                    关闭
                </el-button>
                <el-button type="primary" @click="addProParam_sureSetParamsData()">
                    确定
                </el-button>
                </div>
        </el-dialog>


        <!--part6 产品差异化参数列表 -->
        <div v-show="part6">
            <el-form ref="addProPart6FormRef" :rules="addProPart6FormRules" :model="addProPart6FormObj">
                <el-form-item class="cl_td" label="产品代码" prop="productObjectCode">
                    <el-input v-model="addProPart6FormObj.productObjectCode" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="产品描述" prop="productDesc">
                    <el-input v-model="addProPart6FormObj.productDesc" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="发行卡BIN" prop="binNo">
                    <el-select v-model="addProPart6FormObj.binNo" class="wd200" @change="binNoChangeHandle" clearable>
                    <el-option
                    v-for="(item, index ) in binNoOptions"
                    :key="index"
                    :label="item.binNo"
                    :value="item.binNo"
                    
                    />
                </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="特殊号码段号" prop="segmentNumber" v-if="segmentNumberDiv">
                    <el-select v-model="addProPart6FormObj.segmentNumber" class="wd200" clearable>
                    <el-option
                    v-for="(item, index ) in segmentNumberOptions"
                    :key="index"
                    :label="item.segmentNumber"
                    :value="item.segmentNumber"
                    />
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="text_title padLf10">产品差异化参数列表</div>
            <el-form ref="addProPart6TableRef" :rules="addProPart6TableRules" :model="addProPart6TableObj">
                <el-form-item class="cl_td" label="PCD编号：" prop="pcdNo">
                    <el-input v-model="addProPart6TableObj.pcdNo" class="wd200" type="text" />
                </el-form-item>
                <div class="cl_tr text_center mtop20">
                    <el-button size="small" icon="el-icon-search" type="primary" @click="getPcdDifferentList()">
                        查询
                    </el-button>
                </div>
            </el-form>
            <el-table
            :data="pcdDifferentList"
            class="mbtm20"
            fit
            highlight-current-row
            style="width: 100%;"
            border
            > 
                <el-table-column prop="" label="PCD编号及描述" align="center" >
                    <template slot-scope="{row}">
                        <span>{{row.pcdNo}} {{row.pcdDesc}}</span>
                    </template> 
                </el-table-column>
                <el-table-column prop="" label="应用维度1" align="center" >
                    <template slot-scope="{row}">
                        <span>{{row.instanCode1}} {{row.instanDesc1}}</span>
                    </template> 
                </el-table-column>
                <el-table-column prop="" label="应用维度2" align="center" >
                    <template slot-scope="{row}">
                        <span>{{row.instanCode2}} {{row.instanDesc2}}</span>
                    </template> 
                </el-table-column>
                <el-table-column prop="pcdType" label="取值类型" align="center" />
                <el-table-column prop="pcdValue" label="取值" align="center" />
                <el-table-column prop="pcdPoint" label="取值小位数" align="center" />
                <el-table-column prop="" label="操作" align="center">
                    <template slot-scope="{row, $index}">
                        <el-button size="mini" type="primary" @click="pcdDifferent_setParams(row,$index)" 
                        v-show="row.pcdNo != null && row.pcdDesc == '' && row.supportPcd == 'Y'" >设置参数值</el-button>
                        <el-button size="mini" icon="el-icon-edit" type="primary" @click="pcdDifferent_setParams(row,$index)" 
                        v-show="row.pcdNo != null && row.pcdDesc != '' && row.supportPcd == 'Y'" >设置{{row.pcdDesc}}</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="pcdDifferentTotal>0" :total="pcdDifferentTotal" :page.sync="addProPart6TableObj.pageNum" :limit.sync="addProPart6TableObj.pageSize" @pagination="getPcdDifferentList" />


            <div class="text_title padLf10">已设置产品差异化参数列表</div>
            <el-table
            :data="setedPcdDifferentList"
            class="mbtm20"
            fit
            highlight-current-row
            style="width: 100%;"
            border
            > 
                <el-table-column prop="" label="PCD编号及描述" align="center" >
                    <template slot-scope="{row}">
                        <span>{{row.pcdNo}} {{row.pcdDesc}}</span>
                    </template> 
                </el-table-column>
                <el-table-column prop="" label="应用维度1" align="center" >
                    <template slot-scope="{row}">
                        <span>{{row.instanCode1}} {{row.instanDesc1}}</span>
                    </template> 
                </el-table-column>
                <el-table-column prop="" label="应用维度2" align="center" >
                    <template slot-scope="{row}">
                        <span>{{row.instanCode2}} {{row.instanDesc2}}</span>
                    </template> 
                </el-table-column>
                <el-table-column prop="baseInstanCode" label="差异维度1" align="center" />
                <el-table-column prop="optionInstanCode" label="差异维度2" align="center" />
                <el-table-column prop="pcdType" label="取值类型" align="center" />
                <el-table-column prop="pcdValue" label="取值" align="center" />
                <el-table-column prop="pcdPoint" label="取值小位数" align="center" />
                <el-table-column prop="" label="操作" align="center">
                    <template slot-scope="{$index}">
                        <el-button size="mini" type="primary" @click="deletePcdDiffInstan($index)" >删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div class="cl_tr text_center mtop20" v-show="part6Btn">
                <el-button size="small" icon="el-icon-arrow-up" type="primary" @click="backPar5Btn()">
                    上一步
                </el-button>
                <el-button size="small" icon="el-icon-arrow-down" type="primary" @click="nextToPart7Btn()">
                    下一步设置收费项目
                </el-button>
            </div>
        </div>

        <!--part7 产品差异化参数列表 -->
        <div v-show="part7">

            <el-form ref="addProPart7FormRef" :rules="addProPart7FormRules" :model="addProPart7FormObj">
                <el-form-item class="cl_td" label="产品代码" prop="productObjectCode">
                    <el-input v-model="addProPart7FormObj.productObjectCode" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="产品描述" prop="productDesc">
                    <el-input v-model="addProPart7FormObj.productDesc" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="发行卡BIN" prop="binNo">
                    <el-select v-model="addProPart7FormObj.binNo" class="wd200" @change="binNoChangeHandle" clearable>
                    <el-option
                    v-for="(item, index ) in binNoOptions"
                    :key="index"
                    :label="item.binNo"
                    :value="item.binNo"
                    
                    />
                </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="特殊号码段号" prop="segmentNumber" v-if="segmentNumberDiv">
                    <el-select v-model="addProPart7FormObj.segmentNumber" class="wd200" clearable>
                    <el-option
                    v-for="(item, index ) in segmentNumberOptions"
                    :key="index"
                    :label="item.segmentNumber"
                    :value="item.segmentNumber"
                    />
                </el-select>
                </el-form-item>
            </el-form>
            
            <div class="text_title padLf10">产品收费项目参数列表</div>
            <el-table
            :data="payProList"
            class="mbtm20"
            fit
            highlight-current-row
            style="width: 100%;"
            border
            > 
                <el-table-column prop="feeItemNo" label="应用维度" align="center" />
                <el-table-column prop="feeTypeDesc" label="费用类别" align="center" />
                <el-table-column prop="feeDesc" label="费用描述" align="center" />
                <el-table-column prop="" label="操作" align="center">
                    <template slot-scope="{row, $index}">
                        <el-button size="mini" type="primary" @click="checkProCatalogue(row,$index)" >设置收费参数</el-button>
                    </template>
                </el-table-column>
            </el-table>
             <div class="cl_tr text_center mtop20" v-show="part7Btn">
                <el-button size="small" icon="el-icon-arrow-up" type="primary" @click="backPar6Btn()">
                    上一步
                </el-button>
                <el-button size="small" icon="el-icon-plus" type="primary" @click="saveProBtn()">
                    保存
                </el-button>
            </div>
        </div>



        




        <!-- 设置收费参数 弹窗 -->
        <el-dialog class="abow_dialog" title="收费项目详情及实例" :visible.sync="setFeeParam_dialogForm" width="65%">
            <div class="text_title padLf10">收费项目基本信息</div>

            <el-form  ref="setFeeParam_dataForm" :rules="setFeeParam_rules"  :model="setFeeParam_formObj" >
                <el-form-item class="cl_td" label="收费项目" prop="feeItemNo">
                    <el-input v-model="setFeeParam_formObj.feeItemNo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="收费维度1" prop="instanDimen1">
                    <el-input v-model="setFeeParam_formObj.instanDimen1" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="收费维度2" prop="instanDimen2">
                    <el-input v-model="setFeeParam_formObj.instanDimen2" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="收费维度3" prop="instanDimen3">
                    <el-input v-model="setFeeParam_formObj.instanDimen3" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="收费维度4" prop="instanDimen4">
                    <el-input v-model="setFeeParam_formObj.instanDimen4" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="收费维度5" prop="instanDimen5">
                    <el-input v-model="setFeeParam_formObj.instanDimen5" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="项目用途" prop="defaultBusinessItem">
                    <el-input v-model="setFeeParam_formObj.defaultBusinessItem" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="费用事件编号" prop="feeEventNo">
                    <el-input v-model="setFeeParam_formObj.feeEventNo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="费用描述" prop="feeDesc">
                    <el-input v-model="setFeeParam_formObj.feeDesc" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="费用类别" prop="feeType">
                    <el-select v-model="setFeeParam_formObj.feeType" class="wd200" clearable :disabled="isAble1">
                        <el-option
                        v-for="(item, index ) in feeTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="生效日期" prop="effectiveDate">
                    <el-date-picker
                    v-model="setFeeParam_formObj.effectiveDate"
                    class="wd200"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyyMMdd"
                    />
                    <!-- <el-input v-model="setFeeParam_formObj.productDesc" class="wd200" type="text" /> -->
                </el-form-item>
                <el-form-item class="cl_td" label="失效日期" prop="expirationDate">
                    <el-date-picker
                    v-model="setFeeParam_formObj.expirationDate"
                    class="wd200"
                    type="date"
                    placeholder="选择日期"
                    format="yyyy 年 MM 月 dd 日"
                    value-format="yyyyMMdd"
                    />
                </el-form-item>  
            </el-form>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="setChildFee()">设置收费子项</el-button>
            </div>
            
            <div class="text_title padLf10">已设置收费子项列表</div>

            <el-table
            :data="childFeeList"
            class="mbtm20"
            fit
            highlight-current-row
            style="width: 100%;"
            border
            > 
                <el-table-column prop="operationMode" label="运营模式" align="center" />
                <el-table-column prop="feeItemNo" label="收费项目编号" align="center" />
                <el-table-column prop="instanCode1" label="收费维度1" align="center" />
                <el-table-column prop="instanCode2" label="收费维度2" align="center" />
                <el-table-column prop="instanCode3" label="收费维度3" align="center" />
                <el-table-column prop="instanCode4" label="收费维度4" align="center" />
                <el-table-column prop="instanCode5" label="收费维度5" align="center" />
                <el-table-column prop="" label="操作" align="center">
                    <template slot-scope="{$index}">
                        <el-button size="mini" type="primary" @click="handleDeleteChildFee($index)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            
            <div slot="footer" class="dialog-footer">
                <el-button @click="setFeeParam_dialogForm = false">
                    取消
                </el-button>
                 <el-button type="primary" @click="sureSetFeeParamData()">
                确定
                </el-button>
            </div>
        </el-dialog>
        <!-- 设置收费项目实例  -->
            <el-dialog title="设置收费项目实例" :visible.sync="set_dialogDetail" width="75%" :close-on-click-modal="false" >
                <pay-item-base-info ref="" 
                    :formObj="in_tempDetail"
                    :showChoseBtn="showChoseBtn"
                    :showInstanDimen="showInstanDimen"
                    :choseBtnFlag1='choseBtnFlag1'
                    :choseBtnFlag2='choseBtnFlag2'
                    :choseBtnFlag3='choseBtnFlag3'
                    :choseBtnFlag4='choseBtnFlag4'
                    :choseBtnFlag5='choseBtnFlag5'
                ></pay-item-base-info>
                <cost-matrix-info 
                    :formObj="in_tempDetail"
                    v-if="showMethod"
                ></cost-matrix-info>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="set_dialogDetail = false">
                        关闭
                    </el-button>
                    <el-button type="primary" @click="sureAddBusProFeeData()">
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


        <!-- 查看业务项目详情弹窗 -->
        <el-dialog class="abow_dialog" :title="busProTitle" :visible.sync="viewBusPro_dialogForm" width="65%">
            <el-form ref="viewBusPro_dataForm" :rules="viewBusPro_rules" :model="viewBusProTempObj">
                <el-form-item class="cl_td" label="业务项目代码" prop="businessProgramNo" 
                :rules="[ { required: true, message: '业务项目代码不能为空'}]">
                    <el-input v-model="viewBusProTempObj.businessProgramNo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="业务项目描述" prop="programDesc">
                    <el-input v-model="viewBusProTempObj.programDesc" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="争议业务类型" prop="disputeBusinessType">
                    <el-select v-model="viewBusProTempObj.disputeBusinessType" class="wd200" clearable>
                        <el-option
                        v-for="(item, index ) in disputeBusinessTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="默认业务类型" prop="feeBusinessType">
                    <el-select v-model="viewBusProTempObj.feeBusinessType" class="wd200" clearable>
                        <el-option
                        v-for="(item, index ) in feeBusinessTypeOptions"
                        :key="index"
                        :label="item.labelDesc"
                        :value="item.businessTypeCode"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="还款优先级" prop="paymentPriority">
                    <el-input v-model="viewBusProTempObj.paymentPriority" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="承责属性" prop="responseType">
                    <el-select v-model="viewBusProTempObj.responseType" class="wd200" clearable>
                        <el-option
                        v-for="(item, index ) in responseTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
            <div class="text_title">已选业务类型</div>
            <el-table
            :data="checkedBusList"
            class="mbtm20"
            fit
            highlight-current-row
            style="width: 100%;"
            border
            > 
                <el-table-column prop="businessTypeCode" label="业务类型代码" align="center" />
                <el-table-column prop="businessDesc" label="业务类型描述" align="center" />
            </el-table>
            <pagination v-show="checkedBusTotal>0" :total="checkedBusTotal" :page.sync="checkedBusObj.pageNum" :limit.sync="checkedBusObj.pageSize" @pagination="viewBusPro_getCheckedBusList" />
        
            <div class="text_title">业务项目构件实例信息</div>
            <el-table
            :data="busIntanceList"
            class="mbtm20"
            fit
            highlight-current-row
            style="width: 100%;"
            border
            > 
                <el-table-column prop="elementNo" label="媒介类型" align="center" >
                    <template slot-scope="{row}">
                        <span class="tdDivL">{{row.artifactDesc}}&nbsp;&nbsp;:&nbsp;&nbsp;</span>
                        <span class="tdDivR">{{row.elementNo}}&nbsp;&nbsp;&nbsp;&nbsp;{{row.elementDesc}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="pcdDesc" label="媒介对象代码" align="center">
                    <template slot-scope="{row}">
                        {{row.pcdNo}}&nbsp;&nbsp;&nbsp;&nbsp;{{row.pcdDesc}}
                    </template>
                    
                </el-table-column>
                <el-table-column prop="" label="操作" align="center">
                    <template slot-scope="{row}">
                        <el-button size="mini" v-show="row.pcdNo!=null && row.supportPcd == 'Y'" type="primary" @click="handleviewParam(row)">查看参数
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="busIntanceTotal>0" :total="busIntanceTotal" :page.sync="busIntanceObj.pageNum" :limit.sync="busIntanceObj.pageSize" @pagination="viewBusPro_getBbusIntanceList" />
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="viewBusPro_dialogForm = false">
                    关闭
                </el-button>
                </div>
        </el-dialog>

        <!-- 查看业务项目 查看参数弹窗 -->
        <el-dialog class="abow_dialog" title="查看参数值" :visible.sync="viewBusPro_viewParam_dialogForm" width="65%">
            <el-form ref="viewBusPro_viewParam_dataForm" :rules="viewBusPro_viewParam_rules" :model="viewBusPro_viewParam_TempObj">
                <el-form-item class="cl_td" label="PCD编号" prop="pcdNo" 
                :rules="[ { required: true, message: 'PCD编号不能为空'}]">
                    <el-input v-model="viewBusPro_viewParam_TempObj.pcdNo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="分段类型" prop="segmentType">
                    <el-select v-model="viewBusPro_viewParam_TempObj.segmentType" class="wd200" clearable>
                        <el-option
                        v-for="(item, index ) in segmentTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="基础实例代码" prop="baseInstanCode">
                    <el-input v-model="viewBusPro_viewParam_TempObj.baseInstanCode" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="可选实例代码" prop="optionInstanCode">
                    <el-input v-model="viewBusPro_viewParam_TempObj.optionInstanCode" class="wd200" type="text" />
                </el-form-item>
            </el-form>
            <el-table
            :data="viewBusPro_pcdList"
            class="mtop20"
            fit
            highlight-current-row
            style="width: 100%;"
            border
            > 
                <el-table-column prop="segmentSerialNum" label="分段序号" align="center" />
                <el-table-column prop="pcdType" label="取值类型" align="center" />
                <el-table-column prop="segmentValue" label="分段取值" align="center" />
                <el-table-column prop="pcdValue" label="取值" align="center" />
                <el-table-column prop="pcdPoint" label="取值小数位" align="center" />
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="viewBusPro_viewParam_dialogForm = false">
                    关闭
                </el-button>
                </div>
        </el-dialog>


        <!-- 新增业务项目弹窗 -->
        <el-dialog class="abow_dialog" title="新增业务项目" :visible.sync="addBusPro_dialogForm" width="65%">
            
            <div v-show="addBusPro_part1">
                <el-form ref="addusPro_dataForm" :rules="addBusPro_rules" :model="addBusPro_TempObj">
                    <el-form-item class="cl_td" label="业务项目代码" prop="businessProgramNoHalf" 
                    :rules="[ { required: true, message: '业务项目代码不能为空'},
                    {max: 5, min: 5 , message: '长度为 5 个字符'},
                    { validator: this.validNumber}
                    ]">
                        MODG <el-input v-model="addBusPro_TempObj.businessProgramNoHalf" class="wd150" type="text" :readonly="addBusPro_isReadonly1"/>
                    </el-form-item>
                    <el-form-item class="cl_td" label="业务项目描述" prop="programDesc" 
                    :rules="[ { required: true, message: '业务项目描述不能为空'} ]">
                        <el-input v-model="addBusPro_TempObj.programDesc" class="wd200" type="text" :readonly="addBusPro_isReadonly1"/>
                    </el-form-item>
                <el-form-item class="cl_td" label="争议业务类型" prop="disputeBusinessType">
                        <el-select v-model="addBusPro_TempObj.disputeBusinessType" class="wd200" clearable :disabled="addBusPro_isAble1">
                            <el-option
                            v-for="(item, index ) in disputeBusinessTypeOptions"
                            :key="index"
                            :label="item.labelDesc"
                            :value="item.businessTypeCode"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="cl_td" label="默认业务类型" prop="defaultBusinessType">
                        <el-input v-model="addBusPro_TempObj.defaultBusinessType" class="wd200" type="text" />
                    </el-form-item>
                    <el-form-item class="cl_td" label="还款优先级" prop="paymentPriority">
                        <el-input v-model="addBusPro_TempObj.paymentPriority" class="wd200" type="text" :readonly="addBusPro_isReadonly1"/>
                    </el-form-item>
                    <el-form-item class="cl_td" label="承责属性" prop="responseType">
                        <el-select v-model="addBusPro_TempObj.responseType" class="wd200" clearable :disabled="addBusPro_isAble1">
                            <el-option
                            v-for="(item, index ) in responseTypeOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="cl_td" label="项目类型" prop="programType"
                    :rules="[ { required: true, message: '项目类型不能为空'} ]">
                        <el-select v-model="addBusPro_TempObj.programType" class="wd200" clearable :disabled="addBusPro_isAble1">
                            <el-option
                            v-for="(item, index ) in programTypeOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                            />
                        </el-select>
                    </el-form-item>
                </el-form>
                <div class="cl_tr text_center mtop20" v-show="addBusPro_part1Btn">
                    <el-button size="small" icon="el-icon-plus" type="primary" @click="chooseBusTypeBtn()">
                        选择业务类型
                    </el-button>
                </div>


            </div>

            <div v-show="addBusPro_part2">
                <div class="text_title padLf10">选择业务类型</div>
                <div style="margin-left: 12%;">
                    <el-transfer 
                        filterable
                        :filter-method="addBusPro_filterMethod"
                        :titles="['可选择业务类型', '已选择业务类型']"
                        filter-placeholder="请输入业务项目"
                        v-model="addBusPro_TempObj2.busTypeList"
                        @change="addBusPro_handleAddComponent"
                        @right-check-change="addBusPro_rightCheckedChange"
                        :data="addBusPro_allBusTypeData">
                    </el-transfer>
                </div>
                <div class="cl_tr text_center mtop20" v-show="addBusPro_part2Btn" >

                    <el-button size="small" icon="el-icon-arrow-up" type="primary" @click="addBusPro_backPar1Btn()">
                        上一步
                    </el-button>
                    <el-button size="small" icon="el-icon-plus" type="primary" @click="addBusPro_addBusTyeBtn()">
                        新增业务类型
                    </el-button>
                    <el-button size="small" icon="el-icon-search" type="primary" @click="addBusPro_viewTransIdentyBtn()">
                        查看交易识别码
                    </el-button>
                    <el-button size="small" icon="el-icon-setting" type="primary" @click="addBusPro_setBusTypeBtn()">
                        设置默认业务类型
                    </el-button>
                    <el-button size="small" icon="el-icon-arrow-down" type="primary" @click="addBusPro_nextToPart3Btn()">
                        下一步排除构件
                    </el-button>
                </div>
            </div>

            <!-- 排除构件列表 -->
            <div v-show="addBusPro_part3">
                <el-table
                :data="addBusPro_artifactList"
                class="mtop20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
                > 
                    <el-table-column prop="artifactNo" label="构件编号" align="center" />
                    <el-table-column prop="artifactDesc" label="构件描述" align="center" />
                </el-table>
                <div class="cl_tr text_center mtop20" v-show="addBusPro_part3Btn">

                    <el-button size="small" icon="el-icon-arrow-up" type="primary" @click="addBusPro_backPar2Btn()">
                        上一步
                    </el-button>
                    <el-button size="small" icon="el-icon-arrow-down" type="primary" @click="addBusPro_nextToPart4Btn()">
                        下一步
                    </el-button>
                </div>
            </div>

            <!-- 第4步 业务项目实例 -->
            <div v-show="addBusPro_part4">
                <el-form ref="addusPro_dataForm4" :rules="addBusPro_rules4" :model="addBusPro_TempObj4">
                    <el-form-item class="cl_td" label="业务项目代码" prop="businessProgramNo">
                       <el-input v-model="addBusPro_TempObj4.businessProgramNo" class="wd200" type="text" readonly/>
                    </el-form-item>
                    <el-form-item class="cl_td" label="业务项目描述" prop="programDesc">
                        <el-input v-model="addBusPro_TempObj4.programDesc" class="wd200" type="text" readonly/>
                    </el-form-item>
                </el-form>
                <el-table
                :data="addBusPro_intanceList"
                class="mtop20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
                > 
                    <el-table-column prop="artifactNo" label="业务项目描述" align="center" >
                        <template slot-scope="{row}">
                            <span class="tdDivL">{{row.artifactDesc}}&nbsp;&nbsp;:&nbsp;&nbsp;</span>
                            <span class="tdDivR">{{row.elementNo}}&nbsp;&nbsp;&nbsp;&nbsp;{{row.elementDesc}}</span>
                        </template> 
                    </el-table-column>

                    <el-table-column prop="" label="操作" align="center">
                        <template slot-scope="{row, $index}">
                            <el-button size="mini" type="primary" @click="addBusPro_handleUpdateParams(row,$index)">替换参数</el-button>
                            <el-button size="mini" type="primary" @click="addBusPro_handleSetParams(row,$index)" 
                            v-show="row.pcdNo != null && row.pcdDesc == '' && row.supportPcd == 'Y'" >设置参数值</el-button>
                            <el-button size="mini" icon="el-icon-edit" type="primary" @click="addBusPro_handleSetParams(row,$index)" 
                            v-show="row.pcdNo != null && row.pcdDesc != '' && row.supportPcd == 'Y'" >设置{{row.pcdDesc}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="cl_tr text_center mtop20" v-show="addBusPro_part4Btn">

                    <el-button size="small" icon="el-icon-arrow-up" type="primary" @click="addBusPro_backPar3Btn()">
                        上一步
                    </el-button>
                </div>


            </div>

            
            <div slot="footer" class="dialog-footer">
                <el-button @click="addBusPro_dialogForm = false">
                    关闭
                </el-button>
                <el-button type="primary" @click="sureAddBusProData()">
                    确定
                </el-button>
                </div>
        </el-dialog>

        <!-- 新增业务项目弹窗 替换参数弹窗 -->
         <el-dialog class="abow_dialog" title="选择替换参数" :visible.sync="busProIntance_upParam_dialogForm" width="65%">
            <el-table
            :data="busPro_up_paramsList"
            class="mtop20"
            fit
            highlight-current-row
            style="width: 100%;"
            border
            @current-change="handleBusProIntanceParamsChange"
            @row-click="chooseBusProIntanceParams"
            > 
                <el-table-column width="55">
                    <template slot-scope="scope">
                    <el-radio v-model="busTypeIntance_elementNoRadio" :label="scope.row.elementNo">
                        <span class="el-radio__label"></span>
                    </el-radio>
                    </template>
                </el-table-column>
                <el-table-column prop="elementNo" label="参数选项" align="center" />
                <el-table-column prop="elementDesc" label="参数选项" align="center" />
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="busProIntance_upParam_dialogForm = false">
                    关闭
                </el-button>
                <el-button type="primary" @click="sureBusProIntanceParamsData()">
                    确定
                </el-button>
            </div>
        </el-dialog>


        <!-- 新增业务项目弹窗 实例化 设置参数pcd -->
        <el-dialog class="abow_dialog" :title="busProIntance_setParamTitle" :visible.sync="busProIntance_setParam_dialogForm" width="65%">
            <el-form ref="busProIntance_setParam_dataForm" :rules="busProIntance_setParam_rules" :model="busProIntance_setParam_TempObj">
                <el-form-item class="cl_td" label="PCD编号" prop="pcdNo" 
                :rules="[ { required: true, message: 'PCD编号不能为空'}]">
                    <el-input v-model="busProIntance_setParam_TempObj.pcdNo" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="分段类型" prop="segmentType">
                    <el-select v-model="busProIntance_setParam_TempObj.segmentType" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in segmentTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="基础实例维度" prop="baseInstanDimen">
                    <el-select v-model="busProIntance_setParam_TempObj.baseInstanDimen" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in baseInstanDimenOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="基础实例代码" prop="baseInstanCode">
                    <el-input v-model="busProIntance_setParam_TempObj.baseInstanCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="可选实例维度" prop="optionInstanDimen">
                    <el-select v-model="busProIntance_setParam_TempObj.optionInstanDimen" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in optionInstanDimenOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="可选实例代码" prop="optionInstanCode">
                    <el-input v-model="busProIntance_setParam_TempObj.optionInstanCode" class="wd200" type="text" readonly/>
                </el-form-item>
            </el-form>
            <el-table
            :data="busPro_set_paramsList"
            class="mtop20"
            fit
            highlight-current-row
            style="width: 100%;"
            border
            > 
                <el-table-column prop="segmentSerialNum" label="分段序号" align="center" />
                <el-table-column prop="pcdType" label="取值类型" align="center" />
                <el-table-column prop="segmentValue" label="分段取值" align="center" />
                <el-table-column prop="pcdValue" label="取值" align="center" />
                <el-table-column prop="pcdPoint" label="取值小数位" align="center" />
                <el-table-column prop="" label="操作" align="center">
                    <template slot-scope="{row, $index}">
                        <el-button size="mini" type="primary" @click="busProIntance_handleUpPcd(row, $index)">修改
                        </el-button>
                        <el-button size="mini" type="primary" @click="busProIntance_handleDeletePcd(row, $index)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-form class="mtop20" ref="busProIntance_upPcd_dataForm" :rules="busProIntance_upPcd_rules" :model="busProIntance_upPcd_TempObj" v-show="busProIntance_pcdPart">
                <el-form-item class="cl_td" label="分段序号 " prop="segmentSerialNum">
                    <el-input v-model="busProIntance_upPcd_TempObj.segmentSerialNum" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="取值类型" prop="pcdType">
                    <el-select v-model="busProIntance_upPcd_TempObj.pcdType" class="wd200" clearable>
                        <el-option
                        v-for="(item, index ) in pcdTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="分段取值" prop="segmentValue">
                    <el-input v-model="busProIntance_upPcd_TempObj.segmentValue" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="取值" prop="pcdValue">
                    <el-input v-model="busProIntance_upPcd_TempObj.pcdValue" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="取值小数位" prop="pcdPoint">
                    <el-input v-model="busProIntance_upPcd_TempObj.pcdPoint" class="wd200" type="text" />
                </el-form-item>
                <div class="cl_tr text_center">
                    <el-button size="medium" icon="el-icon-circle-check" type="primary" @click="busProIntance_up_pcdSave()">保存</el-button>
                    <el-button size="medium" icon="el-icon-circle-close" type="primary" @click="busProIntance_up_pcdClose()">关闭</el-button>
                </div>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="busProIntance_setParam_dialogForm = false">
                    关闭
                </el-button>
                <el-button type="primary" @click="sureBusProIntanceSetParamsData()">
                    确定
                </el-button>
                </div>
        </el-dialog>





        <!-- 新增业务项目弹窗 查看交易识别码 -->
        <el-dialog class="abow_dialog" title="交易识别码表" :visible.sync="addBusPro_viewTransIdenty_dialogForm" width="65%">
            <el-table
            :data="addBusPro_transIdentyList"
            class="mtop20"
            fit
            highlight-current-row
            style="width: 100%;"
            border
            > 
                <el-table-column prop="transIdentifiNo" label="交易识别代码" align="center" />
                <el-table-column prop="transIdentifiDesc" label="交易识别描述" align="center" />
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addBusPro_viewTransIdenty_dialogForm = false">
                    关闭
                </el-button>
                </div>
        </el-dialog>


        <!-- 新增业务类型弹窗 -->
         <el-dialog class="abow_dialog" title="新增业务类型" :visible.sync="addBusType_dialogForm" width="65%">
             <div v-show="addBusType_part1">
                 <el-form ref="addusType_dataForm" :rules="addBusType_rules" :model="addBusType_TempObj">
                    <el-form-item class="cl_td" label="业务类型代码" prop="businessTypeCodeHalf" 
                    :rules="[ { required: true, message: '新增业务项目不能为空'},
                    {max: 5, min: 5 , message: '长度为 5 个字符'},
                    { validator: this.validNumber}
                    ]">
                        MODT <el-input v-model="addBusType_TempObj.businessTypeCodeHalf" class="wd150" type="text" :readonly="addBusType_isReadonly1"/>
                    </el-form-item>
                    <el-form-item class="cl_td" label="业务类型描述" prop="businessDesc" 
                    :rules="[ { required: true, message: '业务类型描述不能为空'} ]">
                        <el-input v-model="addBusType_TempObj.businessDesc" class="wd200" type="text" :readonly="addBusType_isReadonly1"/>
                    </el-form-item>
                <el-form-item class="cl_td" label="交易识别代码" prop="transIdentificationCode"
                :rules="[ { required: true, message: '交易识别代码不能为空'}]">
                        <el-select v-model="addBusType_TempObj.transIdentificationCode" class="wd200" clearable :disabled="addBusType_isAble1">
                            <el-option
                            v-for="(item, index ) in  transIdentificationCodeOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="cl_td" label="业务形态" prop="businessForm">
                        <el-select v-model="addBusType_TempObj.businessForm" class="wd200" clearable :disabled="addBusType_isAble1">
                            <el-option
                            v-for="(item, index ) in  businessFormOptions"
                            :key="index"
                            :label="item.patternDesc"
                            :value="item.businessPattern"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="cl_td" label="业务性质" prop="businessDebitCreditCode">
                        <el-select v-model="addBusType_TempObj.businessDebitCreditCode" class="wd200" clearable :disabled="addBusType_isAble1">
                            <el-option
                            v-for="(item, index ) in  businessDebitCreditCodeOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="cl_td" label="对应额度节点" prop="creditTreeNode">
                        <el-input v-model="addBusType_TempObj.creditTreeNode" class="wd200" type="text" :readonly="addBusType_isReadonly1"/>
                    </el-form-item>
                    <el-form-item class="cl_td" label="还款优先级" prop="paymentPriority">
                        <el-input v-model="addBusType_TempObj.paymentPriority" class="wd200" type="text" :readonly="addBusType_isReadonly1"/>
                    </el-form-item>
                    <el-form-item class="cl_td" label="本金余额对象" prop="defaultPrincipalBalanceObj"
                    :rules="[ {required: true, message: '本金余额对象不能为空'}]">
                        <el-select v-model="addBusType_TempObj.defaultPrincipalBalanceObj" class="wd200" clearable :disabled="addBusType_isAble1">
                            <el-option
                            v-for="(item, index ) in defaultPrincipalBalanceObjOptions"
                            :key="index"
                            :label="item.labelDesc"
                            :value="item.balanceObjectCode"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="cl_td" label="利息余额对象" prop="defaultInterestBalanceObj"
                    :rules="[ { required: true, message: '利息余额对象不能为空'}]">
                        <el-select v-model="addBusType_TempObj.defaultInterestBalanceObj" class="wd200" clearable :disabled="addBusType_isAble1">
                            <el-option
                            v-for="(item, index ) in  defaultInterestBalanceObjOptions"
                            :key="index"
                            :label="item.labelDesc"
                            :value="item.balanceObjectCode"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="cl_td" label="费用余额对象" prop="defaultFeeBalanceObj"
                    :rules="[ { required: true, message: '费用余额对象不能为空'}]">
                        <el-select v-model="addBusType_TempObj.defaultFeeBalanceObj" class="wd200" clearable :disabled="addBusType_isAble1">
                            <el-option
                            v-for="(item, index ) in  defaultFeeBalanceObjOptions"
                            :key="index"
                            :label="item.labelDesc"
                            :value="item.balanceObjectCode"
                            />
                        </el-select>
                    </el-form-item>
                </el-form>
                <div class="cl_tr text_center mtop20" v-show="addBusType_part1Btn">
                    <el-button size="small" icon="el-icon-arrow-down" type="primary" @click="addBusType_nextBtn()">
                        下一步
                    </el-button>
                </div>
             </div>
            

            <div v-show="addBusType_part2">
                <div class="text_title padLf10" style="margin:20px;">
                    已有余额对象列表
                    <el-button size="small" icon="el-icon-plus" type="primary" @click="addBusType_addBalanceObj()">
                        新建余额对象
                    </el-button>
                </div>
                <el-table
                v-loading = "listLoading1"
                :data="addBusType_balanceObjectList"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
                > 
                    <el-table-column prop="balanceObjectCode" label="余额对象代码" align="center" />
                    <el-table-column prop="objectTypeDesc" label="余额类型" align="center" />
                    <el-table-column prop="objectDesc" label="描述" align="center" />
                    <el-table-column prop="" label="操作" align="center">
                        <template slot-scope="{row, $index}">
                            <el-button size="mini" icon="el-icon-setting" type="primary" @click="addBusType_handleSetParams(row, $index)">配置参数</el-button>
                        </template>
                    </el-table-column>
                </el-table>

                <div class="cl_tr text_center mtop20" v-show="addBusType_part2Btn">
                    <el-button size="small" icon="el-icon-arrow-up" type="primary" @click="addBusType_backPart1Btn()">
                        上一步
                    </el-button>
                    <el-button size="small" icon="el-icon-arrow-down" type="primary" @click="addBusType_nextPart3Btn()">
                        下一步
                    </el-button>
                </div>
            </div>

            <div v-show="addBusType_part3">
                <el-form ref="addBusType_dataForm3" :rules="addBusType_rules3" :model="addBusType_TempObj3">
                    <div class="text_title padLf10" style="margin:20px;">
                        业务类型实例化
                    </div>
                    <el-form-item class="cl_td" label="业务类型代码" prop="businessTypeCode" >
                        <el-input v-model="addBusType_TempObj3.businessTypeCode" class="wd200" type="text" readonly/>
                    </el-form-item>
                    <el-form-item class="cl_td" label="业务类型描述" prop="businessDesc">
                        <el-input v-model="addBusType_TempObj3.businessDesc" class="wd200" type="text" readonly />
                    </el-form-item>
                </el-form>
                <el-table
                v-loading = "listLoading1"
                :data="addBusType_intanceList"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
                > 
                    <el-table-column prop="" label="参数选项编号及描述" align="center" >
                        <template slot-scope="{row}">
                            <span class="tdDivL">{{row.artifactDesc}}&nbsp;&nbsp;:&nbsp;&nbsp;</span>
                            <span class="tdDivR">{{row.elementNo}}&nbsp;&nbsp;&nbsp;&nbsp;{{row.elementDesc}}</span>
                        </template> 
                    </el-table-column>
                    <el-table-column prop="" label="操作" align="center">
                        <template slot-scope="{row, $index}">
                            <el-button size="mini" type="primary" @click="addBalanceTypeIntance_handleUpdateParams(row,$index)">替换参数</el-button>
                            <el-button size="mini" type="primary" @click="addBalanceTypeIntance_handleSetParams(row,$index)" 
                            v-show="row.pcdNo != null && row.pcdDesc == '' && row.supportPcd == 'Y'" >设置参数值</el-button>
                            <el-button size="mini" icon="el-icon-edit" type="primary" @click="addBalanceTypeIntance_handleSetParams(row,$index)" 
                            v-show="row.pcdNo != null && row.pcdDesc != '' && row.supportPcd == 'Y'" >设置{{row.pcdDesc}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="cl_tr text_center mtop20" v-show="addBusType_part3Btn">
                    <el-button size="small" icon="el-icon-arrow-up" type="primary" @click="addBusType_backPart2Btn()">
                        上一步
                    </el-button>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addBusType_dialogForm = false">
                    关闭
                </el-button>
                <el-button type="primary" @click="sureAddBusTypeData()">
                    确定
                </el-button>
                </div>
        </el-dialog>


        <!-- 新增业务类型弹窗 业务类型实例化 替换参数 -->
        <el-dialog class="abow_dialog" title="选择替换参数" :visible.sync="busTypeIntance_upParam_dialogForm" width="65%">
            <el-table
            :data="busType_up_paramsList"
            class="mtop20"
            fit
            highlight-current-row
            style="width: 100%;"
            border
            @current-change="handleBusTypeIntanceParamsChange"
            @row-click="chooseBusTypeIntanceParams"
            > 
                <el-table-column width="55">
                    <template slot-scope="scope">
                    <el-radio v-model="busTypeIntance_elementNoRadio" :label="scope.row.elementNo">
                        <span class="el-radio__label"></span>
                    </el-radio>
                    </template>
                </el-table-column>
                <el-table-column prop="elementNo" label="参数选项" align="center" />
                <el-table-column prop="elementDesc" label="参数选项" align="center" />
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="busTypeIntance_upParam_dialogForm = false">
                    关闭
                </el-button>
                <el-button type="primary" @click="sureBusTypeIntanceParamsData()">
                    确定
                </el-button>
                </div>
        </el-dialog>

        <!-- 新增业务类型弹窗 业务类型实例化 设置参数值 -->
        <el-dialog class="abow_dialog" :title="busTypeIntance_setParamTitle" :visible.sync="busTypeIntance_setParam_dialogForm" width="65%">
            <el-form ref="busTypeIntance_setParam_dataForm" :rules="busTypeIntance_setParam_rules" :model="busTypeIntance_setParam_TempObj">
                <el-form-item class="cl_td" label="PCD编号" prop="pcdNo" 
                :rules="[ { required: true, message: 'PCD编号不能为空'}]">
                    <el-input v-model="busTypeIntance_setParam_TempObj.pcdNo" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="分段类型" prop="segmentType">
                    <el-select v-model="busTypeIntance_setParam_TempObj.segmentType" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in segmentTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="基础实例维度" prop="baseInstanDimen">
                    <el-select v-model="busTypeIntance_setParam_TempObj.baseInstanDimen" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in baseInstanDimenOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="基础实例代码" prop="baseInstanCode">
                    <el-input v-model="busTypeIntance_setParam_TempObj.baseInstanCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="可选实例维度" prop="optionInstanDimen">
                    <el-select v-model="busTypeIntance_setParam_TempObj.optionInstanDimen" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in optionInstanDimenOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="可选实例代码" prop="optionInstanCode">
                    <el-input v-model="busTypeIntance_setParam_TempObj.optionInstanCode" class="wd200" type="text" readonly/>
                </el-form-item>
            </el-form>
            <el-table
            :data="busType_set_paramsList"
            class="mtop20"
            fit
            highlight-current-row
            style="width: 100%;"
            border
            > 
                <el-table-column prop="segmentSerialNum" label="分段序号" align="center" />
                <el-table-column prop="pcdType" label="取值类型" align="center" />
                <el-table-column prop="segmentValue" label="分段取值" align="center" />
                <el-table-column prop="pcdValue" label="取值" align="center" />
                <el-table-column prop="pcdPoint" label="取值小数位" align="center" />
                <el-table-column prop="" label="操作" align="center">
                    <template slot-scope="{row, $index}">
                        <el-button size="mini" type="primary" @click="busTypeIntance_handleUpPcd(row, $index)">修改
                        </el-button>
                        <el-button size="mini" type="primary" @click="busTypeIntance_handleDeletePcd(row, $index)">删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-form ref="busTypeIntance_upPcd_dataForm" :rules="busTypeIntance_upPcd_rules" :model="busTypeIntance_upPcd_TempObj" v-show="busTypeIntance_pcdPart">
                <el-form-item class="cl_td" label="分段序号 " prop="pcdNo">
                    <el-input v-model="busTypeIntance_upPcd_TempObj.segmentSerialNum" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="取值类型" prop="pcdType">
                    <el-select v-model="busTypeIntance_upPcd_TempObj.pcdType" class="wd200" clearable>
                        <el-option
                        v-for="(item, index ) in pcdTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="分段取值" prop="segmentValue">
                    <el-input v-model="busTypeIntance_upPcd_TempObj.segmentValue" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="取值" prop="pcdValue">
                    <el-input v-model="busTypeIntance_upPcd_TempObj.pcdValue" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="取值小数位" prop="pcdPoint">
                    <el-input v-model="busTypeIntance_upPcd_TempObj.pcdPoint" class="wd200" type="text" />
                </el-form-item>
                <div class="cl_tr text_center">
                    <el-button size="medium" icon="el-icon-circle-check" type="primary" @click="busTypeIntance_up_pcdSave()">保存</el-button>
                    <el-button size="medium" icon="el-icon-circle-close" type="primary" @click="busTypeIntance_up_pcdClose()">关闭</el-button>
                </div>
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button @click="busTypeIntance_setParam_dialogForm = false">
                    关闭
                </el-button>
                <el-button type="primary" @click="sureBusTypeIntanceSetParamsData()">
                    确定
                </el-button>
                </div>
        </el-dialog>



        <!-- 新增业务类型弹窗 新建余额对象 -->
        <el-dialog class="abow_dialog" title="新建余额对象" :visible.sync="addBusPro_addBalanceObj_dialogForm" width="65%">
            
            <el-form ref="addBusPro_addBalanceObj_dataForm" :rules="addBusPro_addBalanceObj_rules" :model="addBusPro_addBalanceObj_TmpObj">
                <el-form-item class="cl_td" label="余额对象" prop="balanceObjectCodeHalf" 
                :rules="[ { required: true, message: '余额对象不能为空'},
                {max: 5, min: 5 , message: '长度为 5 个字符'},
                { validator: this.validNumber}
                ]">
                    MODB <el-input v-model="addBusPro_addBalanceObj_TmpObj.balanceObjectCodeHalf" class="wd150" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="objectDesc" 
                :rules="[ { required: true, message: '描述不能为空'} ]">
                    <el-input v-model="addBusPro_addBalanceObj_TmpObj.objectDesc" class="wd200" type="text" />
                </el-form-item>
               <el-form-item class="cl_td" label="余额类型" prop="objectType" :rules="[ { required: true, message: '不能为空'} ]">
                    <el-select v-model="addBusPro_addBalanceObj_TmpObj.objectType" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in  objectTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="利息入账余额对象" prop="interestPostingBalanceObject" :rules="[ { required: true, message: '不能为空'} ]">
                    <el-select v-model="addBusPro_addBalanceObj_TmpObj.interestPostingBalanceObject" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in  defaultInterestBalanceObjOptions"
                        :key="index"
                        :label="item.labelDesc"
                        :value="item.balanceObjectCode"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="还款优先级" prop="paymentPriority">
                    <el-input v-model="addBusPro_addBalanceObj_TmpObj.paymentPriority" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="开始日期" prop="beginDate">
                    <el-date-picker
                        v-model="addBusPro_addBalanceObj_TmpObj.beginDate"
                        class="wd200"
                        type="date"
                        placeholder="选择日期"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyyMMdd"
                    />
                </el-form-item>
                <el-form-item class="cl_td" label="结束日期" prop="endDate">
                    <el-date-picker
                        v-model="addBusPro_addBalanceObj_TmpObj.endDate"
                        class="wd200"
                        type="date"
                        placeholder="选择日期"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyyMMdd"
                    />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addBusProAddBalanceObjClose()">
                    关闭
                </el-button>
                <el-button type="primary" @click="sureAddBalanceData()">
                确定
                </el-button>
            </div>
        </el-dialog>

        <!-- 配置参数 余额对象实例弹窗 -->
        <el-dialog class="abow_dialog" title="余额对象实例化" :visible.sync="addBalanceObjIntance_dialogForm" width="85%">
            
            <el-form ref="addBalanceObjIntance_dataForm" :rules="addBalanceObjIntance_rules" :model="addBalanceObjIntance_TmpObj">
                <div class="text_title padLf10">余额对象实例化</div>
                <el-form-item class="cl_td" label="余额对象代码" prop="balanceObjectCode" 
                :rules="[ { required: true, message: '余额对象不能为空'},
                {max: 5, min: 5 , message: '长度为 5 个字符'},
                { validator: this.validNumber}
                ]">
                    <el-input v-model="addBalanceObjIntance_TmpObj.balanceObjectCode" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="余额对象描述" prop="objectDesc" 
                :rules="[ { required: true, message: '余额对象描述不能为空'} ]">
                    <el-input v-model="addBalanceObjIntance_TmpObj.objectDesc" class="wd200" type="text" />
                </el-form-item>
                <el-table
                :data="addBalanceObj_intanceList"
                class="mtop20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
                > 
                    <el-table-column prop="" label="参数选项编号及描述" align="center" >
                        <template slot-scope="{row}">
                            <span class="tdDivL">{{row.artifactDesc}}&nbsp;&nbsp;:&nbsp;&nbsp;</span>
                            <span class="tdDivR">{{row.elementNo}}&nbsp;&nbsp;&nbsp;&nbsp;{{row.elementDesc}}</span>
                        </template>
                        
                    </el-table-column>
                    <el-table-column prop="" label="操作" align="center">
                        <template slot-scope="{row, $index}">
                            <el-button size="mini" type="primary" @click="addBalanceObjIntance_handleUpdateParams(row,$index)">替换参数</el-button>
                            <el-button size="mini" type="primary" @click="addBalanceObjIntance_handleSetParams(row)" 
                            v-show="row.pcdNo != null && row.pcdDesc == '' && row.supportPcd == 'Y'" >设置参数值</el-button>
                            <el-button size="mini" icon="el-icon-edit" type="primary" @click="addBalanceObjIntance_handleSetParams(row)" 
                            v-show="row.pcdNo != null && row.pcdDesc != '' && row.supportPcd == 'Y'" >设置{{row.pcdDesc}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addBalanceObjIntance_dialogForm = false">
                    关闭
                </el-button>
                <el-button type="primary" @click="sureAddBalanceIntanceData()">
                    确定
                </el-button>
                </div>
        </el-dialog>

        <!-- 替换参数 -->
        <el-dialog class="abow_dialog" title="选择替换参数" :visible.sync="addBalanceObjIntance_upParam_dialogForm" width="65%">
            <el-table
            :data="addBalanceObj_up_paramsList"
            class="mtop20"
            fit
            highlight-current-row
            style="width: 100%;"
            border
            @current-change="handleBalanceParamsChange"
            @row-click="chooseBalanceParams"
            > 
                <el-table-column width="55">
                    <template slot-scope="scope">
                    <el-radio v-model="elementNoRadio" :label="scope.row.elementNo">
                        <span class="el-radio__label"></span>
                    </el-radio>
                    </template>
                </el-table-column>
                <el-table-column prop="elementNo" label="参数选项" align="center" />
                <el-table-column prop="elementDesc" label="参数选项" align="center" />
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="addBalanceObjIntance_upParam_dialogForm = false">
                    关闭
                </el-button>
                <el-button type="primary" @click="sureAddBalanceIntanceParamsData()">
                    确定
                </el-button>
                </div>
        </el-dialog>



    </div>
    

</template>

<script>
import Pagination from "@/components/Pagination"
import { isNumber } from '@/utils/validate'
import PayItemBaseInfo from "@/components-ider/operate/PayItemBaseInfo"; // 收费项目实例信息
import CostMatrixInfo from "@/components-ider/operate/CostMatrixInfo"; // 费用矩阵信息
import TransactionTableVue from '../../dashboard/admin/components/TransactionTable.vue';
import { Row } from 'element-ui';

export default {
    name: 'BusinessParamsEst',
    components: {
        // eslint-disable-next-line vue/no-unused-components
        Pagination,
        PayItemBaseInfo, // 收费项目实例信息
        CostMatrixInfo // 费用矩阵信息
    },
    data() {
        return {
            // 表单验证
            addFormRules: {
                // productObjectCodeHalf: [{ pattern : /^[0-9]*$/, message: '只能输入数字'}]
            },


            part1: true, // 第一部分 产品基本信息 
            part1Btn: true,
            part2: false, // 第二部分 选择业务项目
            // part2: true, // 第二部分 选择业务项目
            part2Btn: false,

            // 第一部分 产品基本信息
            addFormRef: {},
            addFormRules: {},
            addFormObj: {},
            busItemList: [],
            operationModeOptions: [], // 运营模式  
            productCodeSetOptions: [], // 套卡对方产品对象代码 COS.IQ.02.0013
            isAble1: false,
            isReadonly1: false,

            // 查询优先级弹窗
            priority_dialogForm: false,
            listLoading1: false,
            priority_productList: [],
            priority_formObj: {
                pageNum: 1,
                pageSize: 10
            },
            priority_formObjtTotal: 0,

            // 第二部分 选择业务项目
            add_allBusData: [],
            busProInitData: [], // 业务项目穿梭框初始化数据
            rightBusProInitList: [],

            filterMethod(query, item) {
                return item.businessProgramNo.indexOf(query) > -1;
            },
            rightCheckedBusPro: '',
            rightCheckedBusDesc: '',

            // 第3部分 选择卡版面
            formatList: [],
            add_allFormatData: [],
            rightCheckedFormatList: [],
            formatInitList : [],
            rightFormatInitList: [], // 右侧卡版面原始数据
            part3: false,
            part3Btn: false,
            // 4部分 选择收费项目
            part4: false,
            part4Btn: false,
            feeItemList: [],
            add_allFeeItemData: [],
            rightCheckedFeeItemList: [],
            feeItemInitList: [],
            rightFeeItemInitList: [],
            // 5部分 产品参数设置
            part5: false,
            part5Btn: false,
            addProParamFormRef: {},
            addProParamFormRules: {},
            addProParamFormObj: {},
            binNoOptions: [],
            segmentNumberOptions: [],
            addProParamsList: [],
            segmentNumberDiv: false,
            // 产品参数 替换参数
            addProParam_paramsList: [],
            addProParam_elementNoRadio: '',
            addProParam_elementDescRadio: '',
            addProParam_upParam_dialogForm: false,
            addProParam_ParamIndex: '',
            addProParam_choseElementObj: {},


            // 产品参数 设置参数
            addProParam_setParamTitle: '',
            addProParam_setParam_dialogForm: false,
            addProParam_setParam_dataForm: {},
            addProParam_setParam_rules: {},
            addProParam_setParam_TempObj : {}, // busProIntance_setParam_TempObj
            addProParam_setParamsList: [], 
            addProParam_pcdPart: false, //  busProIntance_pcdPart
            addProParam_upPcdIndex: '',
            addProParam_upPcd_TempObj: {},
            addProParam_upPcd_dataForm: {},
            addProParam_pcd_rules: {},



            // 6部分 产品差异化参数
            part6Btn: false,
            part6: false,
            addProPart6FormRef: {},
            addProPart6FormRules: {},
            addProPart6FormObj: {},
            pcdDifferentList: [], // 产品差异化参数列表
            setedPcdDifferentList: [], // 已设置产品差异化参数列
            addProPart6TableObj: {
                pageSize: 10,
                pageNum : 1
            },
            pcdDifferentTotal: 0,
            addProPart6TableRef: {},
            addProPart6TableRules: {},
            

            // 7 部分 产品收费项目参数列表
            part7: false,
            part7Btn: false,
            addProPart7FormRef : {},
            addProPart7FormRules: {},
            addProPart7FormObj: {},
            payProList: [],
            // 设置收费参数 弹窗
            setFeeParam_dialogForm: false,
            setFeeParam_dataForm: {},
            setFeeParam_rules: {},
            setFeeParam_formObj: {},
            feeTypeOptions: [],
            childFeeList: [],
            setFeeParamIndex: '',


            // 查看业务项目详情弹窗
            viewBusproObj: {},
            busProTitle: '',
            viewBusPro_dialogForm: false,
            viewBusPro_dataForm: {},
            viewBusPro_rules: {},
            viewBusProTempObj: {},
            disputeBusinessTypeOptions: [],
            feeBusinessTypeOptions: [],
            responseTypeOptions: [],

            checkedBusList: [],
            checkedBusTotal: 0,
            checkedBusObj : {
                pageNum: 1,
                pageSize: 10
            },
            busIntanceList: [],
            busIntanceObj : {
                pageNum: 1,
                pageSize: 10
            },
            busIntanceTotal: 0,

            // 查看业务项目详情 查看参数弹窗
            viewBusPro_viewParam_dialogForm: false,
            viewBusPro_viewParam_dataForm: {},
            viewBusPro_viewParam_rules: {},
            viewBusPro_viewParam_TempObj: {},
            segmentTypeOptions: [],
            viewBusPro_pcdList: [],

            // 新增业务项目 弹窗
            addBusPro_part1: true,
            addBusPro_dialogForm: false,
            addusPro_dataForm: {},
            addBusPro_rules: {},
            addBusPro_TempObj: {},
            programTypeOptions: [],
            addBusPro_isAble1: false,
            addBusPro_isReadonly1: false,
            addBusPro_part1Btn: true,
            addBusPro_part2: false,
            addBusPro_part2Btn: false,
            addBusPro_TempObj2: {
                busTypeList: []
            },
            addBusPro_allBusTypeData: [],
            rightCheckedBusType: [],
            businessTypeCodeSelectList: [], //业务类型穿梭框原始数据
            // 新增业务项目第3步 排除构件
            addBusPro_artifactList : [], // 排除构件list
            addBusPro_part3: false, 
            addBusPro_part3Btn: false,
            // 第4步 业务项目实例
            addBusPro_part4: false,
            addBusPro_part4Btn: false,
            addusPro_dataForm4: {},
            addBusPro_rules4: {},
            addBusPro_TempObj4: {},
            addBusPro_intanceList: [],
            // 业务项目实例化 替换参数
            busProIntance_upParam_dialogForm: false,
            busPro_up_paramsList: [],
            busProIntanceParamIndex: '',
            busProIntance_choseElementObj: {},
            busProIntance_elementNoRadio: '',
            busProIntance_elementDescRadio: '',
            // 业务项目实例化 设置参数
            busProIntance_setParamTitle: '',
            busProIntance_setParam_dialogForm: false,
            busProIntance_setParam_dataForm: {},
            busProIntance_setParam_rules: {},
            busProIntance_setParam_TempObj: {},
            busPro_set_paramsList: [],
            // 业务项目 设置参数 pcd修改
            busProIntance_upPcd_dataForm: {},
            busProIntance_upPcd_rules: {},
            busProIntance_upPcd_TempObj: {},
            busProIntance_pcdPart: false,
            busProIntance_upPcdIndex: '',



            // 选择业务类型穿梭框
            addBusPro_allBusTypeData: [],
            addBusPro_filterMethod(query, item) {
                return item.businessTypeCode.indexOf(query) > -1;
            },
            // 查看交易识别码 弹窗
            addBusPro_viewTransIdenty_dialogForm: false,
            addBusPro_transIdentyList: [],

            // 新增业务类型 弹窗
            addBusType_part1:true,
            addBusType_dialogForm: false,
            addusType_dataForm : {},
            addBusType_rules : {},
            addBusType_TempObj : {},
            transIdentificationCodeOptions: [],
            businessFormOptions: [], //
            businessDebitCreditCodeOptions: [],
            addBusType_isReadonly1: false,
            addBusType_isAble1: false,
            defaultPrincipalBalanceObjOptions: [], //
            defaultInterestBalanceObjOptions: [],
            defaultFeeBalanceObjOptions: [],
            // 已有余额对象列表
            addBusType_part1Btn: true,
            addBusType_part2: false,
            addBusType_part2Btn: false,
            addBusType_balanceObjectList: [],
            balanceIntanceIndex: '',

            // 第3步 业务类型实例化
            addBusType_part2: false,
            addBusType_intanceList: [],
            addBusType_part3: false,
            addBusType_part3Btn: false,
            addBusType_dataForm3: {},
            addBusType_rules3: {},
            addBusType_TempObj3: {},
            // 业务类型实例化 替换参数
            busTypeIntance_upParam_dialogForm: false,
            busType_up_paramsList: [],
            busTypeIntanceParamIndex: '',
            busTypeIntance_elementNoRadio: '',
            busTypeIntance_elementDescRadio: '',
            busTypeIntance_choseElementObj: {},
            // 业务类型实例化 设置参数pcd
            busTypeIntance_setParam_dialogForm: false,
            busType_set_paramsList: [],
            busTypeIntance_setParam_dataForm: {},
            busTypeIntance_setParam_rules: {}, 
            busTypeIntance_setParam_TempObj: {},
            baseInstanDimenOptions: [],
            optionInstanDimenOptions: [],
            busTypeIntance_setParamIndex: '',
            busTypeIntance_pcdPart: false,
            busTypeIntance_upPcd_TempObj: {},
            busTypeIntance_upPcd_dataForm: {},
            busTypeIntance_upPcd_rules: {},
            busTypeIntance_setParamTitle: '',
            pcdTypeOptions: [],
            // 新建余额对象
            addBusPro_addBalanceObj_dialogForm: false,
          //  addBusPro_addBalanceObj_dataForm: {},
            addBusPro_addBalanceObj_rules: {},
            addBusPro_addBalanceObj_TmpObj: {},
            objectTypeOptions: [],
            // 配置参数
            addBalanceObjIntance_dialogForm: false,
            addBalanceObjIntance_dataForm: {},
            addBalanceObjIntance_rules: {},
            addBalanceObjIntance_TmpObj: {},
            addBalanceObj_intanceList: [],
            // 替换参数 弹窗
            addBalanceObjIntance_upParam_dialogForm: false,
            addBalanceObj_up_paramsList: [],
            elementNoRadio: '',
            elementNoRadioDesc: '',
            intanceParamIndex: '',
            chooseParamObj: {},
            isSerialNum:'',
            updateSaveFlag:false,
            set_dialogDetail:false,
            showMethod:true,
            in_tempDetail : {},
            showChoseBtn: true,
            showInstanDimen: true,
            choseBtnFlag1: true,
            choseBtnFlag2: true,
            choseBtnFlag3: true,
            choseBtnFlag4: true,
            choseBtnFlag5: true
            
        }
    },
    created() {

    },
    mounted() {
        // 登录信息
        let loginInfo = JSON.parse(window.sessionStorage.getItem('logininfo'))
        // 运营模式 
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0006").then(res => {
            this.operationModeOptions = res
        })
        // 业务类型 
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0020").then(res => {
            if (res.length > 0) {
                res.forEach( item => {
                    item.labelDesc = item.businessTypeCode + ' ' + item.businessDesc
                })
                this.disputeBusinessTypeOptions = res
                this.feeBusinessTypeOptions = res
            }
            
        })
        // 承责属性
        this.getSelectDict('dic_responseType').then((res) => {
            this.responseTypeOptions = res
        })
        // 分段类型
        this.getSelectDict('dic_segmentationType').then((res) => {
            this.segmentTypeOptions = res
        })
        // 项目类型
        this.getSelectDict('dic_productType').then((res) => {
            this.programTypeOptions = res
        })

        // 交易识别代码  
        this.getSelectDict('dic_transIden').then((res) => {
            this.transIdentificationCodeOptions = res
        })

        // 业务形态 
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0035").then(res => {
            this.businessFormOptions = res
        }) 

    // 业务性质  
        this.getSelectDict('dic_businessNature').then((res) => {
            this.businessDebitCreditCodeOptions = res
        })
    // 本金余额对象  
        this.post("/beta/betaService/COS.IQ.02.0021", {objectType: 'P', operationMode:loginInfo.operationMode},(res) => {
            if (res.returnData.rows.length > 0) {
                res.returnData.rows.forEach(item => {
                    item.labelDesc = item.balanceObjectCode+ ' ' + item.objectDesc
                })
                this.defaultPrincipalBalanceObjOptions = res.returnData.rows
            }
        })
        // 利息余额对象  objectType:'P',operationMode:$rootScope.operationMods
        this.post("/beta/betaService/COS.IQ.02.0021", {objectType: 'I', operationMode:loginInfo.operationMode},(res) => {
            if (res.returnData.rows.length > 0) {
                res.returnData.rows.forEach(item => {
                    item.labelDesc = item.balanceObjectCode+ ' ' + item.objectDesc
                })
                this.defaultInterestBalanceObjOptions = res.returnData.rows
            }
        })
        // 费用余额对象 
        this.post("/beta/betaService/COS.IQ.02.0021", {objectType: 'F', operationMode:loginInfo.operationMode},(res) => { 
            if (res.returnData.rows.length > 0) {
                res.returnData.rows.forEach(item => {
                    item.labelDesc = item.balanceObjectCode+ ' ' + item.objectDesc
                })
                this.defaultFeeBalanceObjOptions = res.returnData.rows
            }
        })

        // 余额类型
        this.getSelectDict('dic_balanceType').then((res) => {
            this.objectTypeOptions = res
        })

        // 实例维度
        this.getSelectDict('dic_dimensionalValue').then((res) => {
        this.baseInstanDimenOptions = res
        this.optionInstanDimenOptions = res
        })

        // 分段类型下拉框
        this.getSelectDict('dic_valueType').then((res) => {
            this.pcdTypeOptions = res
        })

        // 发行卡BIN
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0011 ").then(res => {
            this.binNoOptions = res
        })
        // 费用类别
        this.getSelectDict('dic_costCategory').then((res) => {
            this.feeTypeOptions = res
        })

        this.getProParamsList() // 产品参数设置
        
    },
    methods: {
        // 表单验证数字
        validNumber: (rule, value, callback) => {
            if (!isNumber(value)) {
            callback(new Error('请输入数字'))
            } else {
                callback()
            }
        },
        // 运营模式 联动套卡对方产品对象代码 
        getProductCodeSet(){
            // 套卡对方产品对象代码 
            this.post("/beta/betaService/COS.IQ.02.0013 ", {operationMode: this.addFormObj.operationMode}, (res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        let rows = res.returnData.rows
                        rows.forEach(element => {
                            element.label = element.productObjectCode+element.productDesc
                        })
                        this.productCodeSetOptions = rows
                    } else {
                        this.productCodeSetOptions = []
                    }
                }  else {
                    this.productCodeSetOptions = []
                }
            })
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
                    this.listLoading1 = false

                }
            })
        },
        // 查询还款优先级 重置
        priority_reset() {
            this.priority_formObj.productObjectCode = ''
            this.priority_formObj.productDesc = ''
        },
        // 选择业务项目
        busItemAddBtn() {
            this.$refs['addFormRef'].validate((valid) => {
                if (valid) {
                    this.part1Btn = false
                    this.part2 = true
                    this.part2Btn = true
                    this.isAble1 = true
                    this.isReadonly1 = true
                    this.add_allBusData = this.generateData()
                }
            }) 
            
        },

        // 左侧被选中
        handleAddComponent(value, direction, movedKeys) {
            this.busItemList = value
        },
        // 右侧呗选中
        rightCheckedChange(val) {
            this.rightCheckedBusPro = val
        },
        //  新增业务项目
        addBusProBtn() {
            this.addBusPro_dialogForm = true
            this.add_allBusData = this.generateData()
        },
        generateData() {
            const componentData = [] // 相当于data
            const componentNoList = [] // 
            const componentList = []
            this.post('/beta/betaService/COS.IQ.02.0018', {} ,(res) => {
                this.busProInitData = res.returnData.rows
                res.returnData.rows.forEach((item, i) => {
                    componentList.push(item.businessProgramNo+' '+item.programDesc)
                    componentNoList.push(item.businessProgramNo)
                })
                componentList.forEach((component, index) => {
                    componentData.push({
                        label: component,
                        // key: index,
                        key: component.split(' ')[0],
                        businessProgramNo: componentNoList[index]
                    });
                });
            })
            return componentData;  
        },
        // 查看业务项目详情
        viewBusProBtn() {
            if (this.rightCheckedBusPro.length != 1) {
                this.$message({
                    message: '请选择1个业务项目查看详情',
                    type: 'warning'
                })
                return
            } 
            let obj ={
                businessProgramNo: this.rightCheckedBusPro[0],
                operationMode: this.addFormObj.operationMode
            }
            this.post('/beta/betaService/COS.IQ.02.0018', obj, (res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        this.viewBusproObj = res.returnData.rows[0]
                        this.busProTitle = '业务项目'+this.viewBusproObj.businessProgramNo+this.viewBusproObj.programDesc+'详细信息'
                        this.viewBusPro_dialogForm = true
                        this.viewBusPro_getCheckedBusList()
                        this.viewBusPro_getBbusIntanceList()
                        this.viewBusProTempObj = this.viewBusproObj
                    }
                }
            })
        },

        // 已选择业务项目
        viewBusPro_getCheckedBusList() {
            this.checkedBusObj.businessProgramNo = this.viewBusproObj.businessProgramNo
            this.checkedBusObj.operationMode = this.viewBusproObj.operationMode
            this.post('/beta/betaService/COS.IQ.02.0033', this.checkedBusObj, (res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        this.checkedBusList = res.returnData.rows
                        this.checkedBusTotal = res.returnData.totalCount
                    }
                }
            })
        },

        
        // 业务项目构件实例信息
        viewBusPro_getBbusIntanceList() {
            this.busIntanceObj.instanCode = this.viewBusproObj.businessProgramNo
            this.busIntanceObj.operationMode = this.viewBusproObj.operationMode
            this.post('/beta/betaService/COS.IQ.02.0015', this.busIntanceObj, (res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        this.busIntanceList = res.returnData.rows
                        this.busIntanceTotal = res.returnData.totalCount
                    }
                }
            })
        },
        //查看业务项目详情 查看参数
        handleviewParam(row) {
            this.viewBusPro_viewParam_dialogForm = true
            this.viewBusPro_viewParam_TempObj.pcdNo = row.elementNo.substring(0,8)
            // pcd信息
            let obj1 = {
                elementNo: row.elementNo
            }
            this.post('/beta/betaService/COS.IQ.02.0010', obj1, (res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        this.viewBusPro_viewParam_TempObj = res.returnData.rows[0]
                    }
                }
            })

            // pcd实例list
            let obj2 = {
                
                operationMode: this.addFormObj.operationMode,
                pcdNo: row.elementNo.substring(0,8),
                instanCode1: row.instanCode1,
                instanCode2: row.instanCode2,
                instanCode3: row.instanCode3,
                instanCode4: row.instanCode4,
                instanCode5: row.instanCode5,
                instanCode1: row.instanCode1,
            }
            this.post('/beta/betaService/COS.IQ.02.0016', obj2, (res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        this.viewBusPro_pcdList = res.returnData.rows
                    }
                }
            })
        },

        // 设置默认业务项目
        setBusProBtn() {
            if (this.rightCheckedBusPro.length != 1) {
                this.$message({
                    message: '请选择1个业务项目查看详情',
                    type: 'warning'
                })
                return
            } 
            let str = this.rightCheckedBusPro[0]
            this.$set(this.addFormObj, 'defaultBusinessItem',str)
            // this.$forceUpdate()
        },  
        // 新增业务项目 弹窗
        //确定 新增业务项目
        sureAddBusProData(){
            // if (this.addBusPro_part2 == false) {
            //     this.$message({
            //         message: '请选择业务类型',
            //         type: 'warning'
            //     })
            //     return
            // }
            if (this.addBusPro_part4 == false) {
                this.$message({
                    message: '请点击下一步',
                    type: 'warning'
                })
                return
            }
            this.addBusPro_intanceList.forEach(item => {
                if (item.pcdList == null && item.pcdInitList != null) {
                    item.addPcdFlag = 	"1"
					item.pcdList = item.pcdInitList
                }
            })
            
            let obj = Object.assign({}, this.addBusPro_TempObj)
            obj.list = []
            obj.businessProgramNo = this.addBusPro_TempObj4.businessProgramNo
            obj.operationMode = this.addFormObj.operationMode
            obj.instanlist = this.addBusPro_intanceList
            obj.instanCode = this.addBusPro_TempObj4.businessProgramNo
            this.rightCheckedBusType.forEach( rightItem => {
                this.businessTypeCodeSelectList.forEach( item => {
                    if (rightItem == item.businessTypeCode) {
                        obj.list.push(item)
                    }
                })
            })
            if (this.addBusPro_TempObj.defaultBusinessType) {
                this.post('/beta/betaService/COS.AD.02.0018', obj ,(res) => {
                    if (res.returnCode == '000000') {
                        this.$notify({
                            message: '新建业务项目成功',
                            type: 'success',
                        })
                        this.add_allBusData = this.generateData()
                        this.addBusPro_dialogForm = false
                    }
                })
            } else {
                this.$message({
                    message: '返回上一步，设置默认业务类型',
                    type: 'warning'
                })
                return
            }

        },



        // 选择业务类型
        chooseBusTypeBtn() {
            this.$refs['addusPro_dataForm'].validate((valid) => {
                if (valid) {
                    this.addBusPro_part1Btn = false
                    this.addBusPro_part2 = true
                    this.addBusPro_part2Btn = true
                    this.addBusPro_isAble1 = true
                    this.addBusPro_isReadonly1 = true
                    this.addBusPro_allBusTypeData = this.generateAllBusTypeData()
                }
            }) 
            
        },
        // 获取业务类型穿梭框左侧数据
        generateAllBusTypeData () {
            const componentData = [] // 相当于data
            const componentNoList = [] // 
            const componentList = []
            this.post('/beta/betaService/COS.IQ.02.0020', {} ,(res) => {
                this.businessTypeCodeSelectList = res.returnData.rows
                res.returnData.rows.forEach((item, i) => {
                    componentList.push(item.businessTypeCode+' '+item.businessDesc)
                    componentNoList.push(item.businessTypeCode)
                })
                componentList.forEach((component, index) => {
                    componentData.push({
                        label: component,
                        // key: index,
                        key: component.split(' ')[0],
                        businessTypeCode: componentNoList[index]
                    });
                });
            })
            return componentData;  
        },
        // 左侧被选中业务类型
        addBusPro_handleAddComponent(value, direction, movedKeys) {
            this.addBusPro_TempObj2.busTypeList = value
        },
        // 右侧呗选中业务类型
        addBusPro_rightCheckedChange(val) {
            this.rightCheckedBusType = val
        },

        // 上一步
        addBusPro_backPar1Btn() {
            this.addBusPro_part1Btn = true
            this.addBusPro_part2 = false
            this.addBusPro_isAble1 = false
            this.addBusPro_isReadonly1 = false

        },
        // 新增业务类型
        addBusPro_addBusTyeBtn() {
            this.addBusType_dialogForm = true 
            this.addBusType_part1 = true
            this.addBusType_part1Btn = true
            this.addBusType_part2 = false
            this.addBusType_part2Btn = false
            this.addBusType_part3 = false
            this.addBusType_part3Btn = false

        },
        //新增业务类型 上一步
        addBusType_backPart1Btn() {
            this.addBusType_part2 = false
            this.addBusType_part1Btn = true
            this.addBusType_isReadonly1 = false
            this.addBusType_isAble1 = false
        },
        //新增业务类型 下一步
        addBusType_nextPart3Btn() {
            this.addBusType_TempObj3.businessTypeCode = 'MODT'+this.addBusType_TempObj.businessTypeCodeHalf
            this.addBusType_TempObj3.businessDesc = this.addBusType_TempObj.businessDesc
            this.addBusType_part1 = false
            this.addBusType_part2 = false
            this.addBusType_part3 = true
            this.addBusType_part3Btn = true

            // this.$refs['addBusType_dataForm3'].validate((valid) => {
                // if (valid) {
                    let obj = {
                        instanDimen1: 'MODT',
                        instanCode: this.addBusType_TempObj3.businessTypeCode
                    }
                    this.post('/beta/betaService/COS.IQ.02.0042', obj ,(res) => {
                        if (res.returnCode == '000000') {
                            if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                                this.addBusType_intanceList = res.returnData.rows
                            }           
                        }
                    })
                // }
            // }) 

            
        },
        // 返回第二步 
        addBusType_backPart2Btn() {
            this.addBusType_part1 = true
            this.addBusType_part1Btn = false
            this.addBusType_part2 = true
            this.addBusType_part3 = false
        },
        // 确定新增业务类型
        sureAddBusTypeData() {
            let obj = Object.assign({}, this.addBusType_TempObj)
            obj.instanlist = []
            if (this.addBusType_balanceObjectList.length > 0) {
                this.addBusType_balanceObjectList.forEach( balanceObj => {
                    if (balanceObj.instanlist) {
                        balanceObj.instanlist.forEach( intanObj => {
                            intanObj.businessTypeCode = 'MODT'+this.addBusType_TempObj.businessTypeCodeHalf
                            intanObj.instanCode2 = 'MODT'+this.addBusType_TempObj.businessTypeCodeHalf
                            obj.instanlist.push(intanObj)
                        })
                    } else {
                        balanceObj.balanceInstanList.forEach( balanceIntanObj => {
                            balanceIntanObj.businessTypeCode = 'MODT'+this.addBusType_TempObj.businessTypeCodeHalf
                            balanceIntanObj.instanCode2 = 'MODT'+this.addBusType_TempObj.businessTypeCodeHalf
                            obj.instanlist.push(balanceIntanObj)
                        })
                    }
                })
            }
            obj.instanlist.forEach(intaObj => {
                if(intaObj.pcdList == null && intaObj.pcdInitList!=null) {
                    intaObj.addPcdFlag = "1";
					intaObj.pcdList = intaObj.pcdInitList;
                }
            })
            if (this.addBusType_intanceList.length > 0){
                this.addBusType_intanceList.forEach(intanceObj => {
                    if (intanceObj.pcdList==null && intanceObj.pcdInitList!=null) {
                        intanceObj.addPcdFlag = "1";
					    intanceObj.pcdList = intanceObj.pcdInitList;
                    }
				    obj.instanlist.push(intanceObj)

                })
            }
            obj.operationMode = this.addFormObj.operationMode
            obj.businessTypeCode = 'MODT'+this.addBusType_TempObj.businessTypeCodeHalf
            this.post('/beta/betaService/COS.AD.02.0020', obj ,(res) => {
                if (res.returnCode == '000000') {
                    this.$notify({
                        message: '新建业务类型成功',
                        type: 'success',
                    })
                    this.addBusType_dialogForm = false
                    this.addBusPro_allBusTypeData = this.generateAllBusTypeData()
                }
            })
        },

        // 查看交易识别码
        addBusPro_viewTransIdentyBtn() {
            if (this.rightCheckedBusType.length != 1) {
                this.$message({
                    message: '请选择1个业务类型',
                    type: 'warning'
                })
                return
            } 
            this.addBusPro_viewTransIdenty_dialogForm = true
            this.post('/beta/betaService/COS.IQ.02.0052', {businessTypeCode: this.rightCheckedBusType[0], operationMode: this.addFormObj.operationMode } ,(res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        this.addBusPro_transIdentyList = res.returnData.rows
                    }           
                }
            })
        },
        // 设置默认业务类型
        addBusPro_setBusTypeBtn() {
            if (this.rightCheckedBusType.length != 1) {
                this.$message({
                    message: '请选择1个业务类型',
                    type: 'warning'
                })
                return
            } 
            let str = this.rightCheckedBusType[0]
            this.$set(this.addBusPro_TempObj, 'defaultBusinessType',str)
        },
        // 排除构件
        addBusPro_nextToPart3Btn() {
            if (this.rightCheckedBusType.length == 0) {
                 this.$message({
                    message: '请选择1个业务类型',
                    type: 'warning'
                })
                return
            }
            let queryArtiParam = []
            this.post('/beta/betaService/COS.IQ.02.0020', {} ,(res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        this.rightCheckedBusType.forEach(rightObj => {
                            res.returnData.rows.forEach(row => {
                                if (rightObj == row.businessTypeCode) {
                                    queryArtiParam.push(row.businessForm)
                                }
                            })
                        })
                        let obj = {
                            businessPatternList: queryArtiParam
                        }
                        this.addBusPro_part2Btn = false
                        this.addBusPro_part3 = true
                        this.addBusPro_part3Btn = true

                        this.getArtifactList(obj)
                        
                    }           
                }
            })
        },

        // 查询排除构件列表
        getArtifactList(obj) {

            this.getTableList('/beta/betaService/COS.IQ.02.0036', obj ,(res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        this.addBusPro_artifactList = res.returnData.rows
                    }           
                }
            })
        },
        // 返回第2步 隐藏排除构件
        addBusPro_backPar2Btn() {
            this.addBusPro_part2Btn = true
            this.addBusPro_part3 = false
            this.addBusPro_part2 = true
        },
        // 排除构件下一步 第4步  到业务项目实例
        addBusPro_nextToPart4Btn() {
            this.addBusPro_part1 = false
            this.addBusPro_part2 = false
            this.addBusPro_part3 = false
            this.addBusPro_part4 = true
            this.addBusPro_part4Btn = true
            this.addBusPro_TempObj4.businessProgramNo = 'MODG'+this.addBusPro_TempObj.businessProgramNoHalf
            this.addBusPro_TempObj4.programDesc = 'MODG'+this.addBusPro_TempObj.programDesc
            let obj = {
                instanDimen1: 'MODG',
                instanCode: this.addBusPro_TempObj4.businessProgramNo,
                excptArtifactList: this.addBusPro_artifactList
            }
             this.getTableList('/beta/betaService/COS.IQ.02.0042', obj ,(res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        this.addBusPro_intanceList = res.returnData.rows
                    }           
                }
            })
        },  
        // 业务项目实例化 替换参数
        addBusPro_handleUpdateParams(row, index) {
            this.busProIntanceParamIndex = index
            this.busTypeIntance_elementNoRadio = row.elementNo
            this.busProIntance_upParam_dialogForm = true 
            let obj ={
                artifactNo : row.artifactNo,
                pcdNo : row.elementNo.substring(0,8),
            }
            this.post('/beta/betaService/COS.IQ.02.0009', obj ,(res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        this.busType_up_paramsList = res.returnData.rows
                        this.busPro_up_paramsList = res.returnData.rows

                    }           
                }
            })
        },
        // 业务项目实例化 替换参数 选中改变
        handleBusProIntanceParamsChange(val) {
           this.busProIntance_choseElementObj = val 

        },

        // 业务项目实例化 替换参数 选中
        chooseBusProIntanceParams(val) {
            this.busProIntance_elementNoRadio = val.elementNo
            this.busProIntance_elementDescRadio =val.elementDesc
        },
        //  业务项目实例化 确定替换参数
        sureBusProIntanceParamsData(){
            this.$set(this.addBusPro_intanceList[this.busProIntanceParamIndex], 'elementNo', this.busProIntance_elementNoRadio)
            this.$set(this.addBusPro_intanceList[this.busProIntanceParamIndex], 'elementDesc', this.busProIntance_elementDescRadio)
            this.busProIntance_upParam_dialogForm = false
        },

        // 业务项目实例化 设置参数
        addBusPro_handleSetParams(row, index) {
            this.busProIntance_setParamTitle = '设置'+row.pcdNo +':'+row.pcdDesc +'的参数值'
            this.busProIntance_setParam_dialogForm = true
            this.busProIntanceParamIndex = index
            this.busProIntance_setParam_TempObj = row
            this.busPro_set_paramsList = row.pcdInitList
        },
        //业务项目实例化 设置参数 修改pcd函数
        busProIntance_handleUpPcd(row, index) {
            this.busProIntance_upPcdIndex = index
            this.busProIntance_upPcd_TempObj = row
            this.busProIntance_pcdPart = true
        },
        // 业务项目实例化 修改pcd保存
        busProIntance_up_pcdSave() {
            this.$set(this.busPro_set_paramsList, this.busProIntance_upPcdIndex, this.busProIntance_upPcd_TempObj)
            this.busProIntance_pcdPart = false
        },
        // 业务项目实例化 修改pcd关闭
        busProIntance_up_pcdClose() {
            this.busProIntance_pcdPart = false
        },
        // 业务项目 确定设置参数
        sureBusProIntanceSetParamsData() { 
            this.$set(this.addBusPro_intanceList[this.busProIntanceParamIndex],'pcdInitList', this.busPro_set_paramsList)
            this.$set(this.addBusPro_intanceList, this.busProIntanceParamIndex, this.busProIntance_setParam_TempObj)
            this.busProIntance_setParam_dialogForm = false
        },
    

        //业务项目实例化 设置参数 删除pcd函数
        busProIntance_handleDeletePcd(row, $index) {
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if(this.busPro_set_paramsList.length==1){
                    this.$message({
                        message: '必须有一条PCD取值！',
                        type: 'warning'
                    })
                    return;
                }
                this.busPro_set_paramsList.splice(index, 1)
            })

        },
        // 返回第3步
        addBusPro_backPar3Btn() {
            this.addBusPro_part1 = true
            this.addBusPro_part1Btn = false
            this.addBusPro_part2 = true
            this.addBusPro_part2Btn = false
            this.addBusPro_part3 = true
            this.addBusPro_part3Btn = true
            this.addBusPro_part4 = false
        },

        // 新增业务类型弹窗 下一步
        addBusType_nextBtn() {
            this.$refs['addusType_dataForm'].validate((valid) => {
                if (valid) {
                    this.addBusType_part1Btn = false
                    this.addBusType_part2 = true
                    this.addBusType_part2Btn = true
                    this.addBusType_isAble1 = true
                    this.addBusType_isReadonly1 = true
                    this.addBusType_getBalanceObjList()
                }
            }) 
        },
        // 已有余额对象列表
        addBusType_getBalanceObjList() {
            let obj = {
                instanFlag:1,
                operationMode:this.addFormObj.operationMod,
                isTrans: true,
                transParams:['dic_balanceType' ],
                transDict : ['objectType']
            }
            this.getTableList('/beta/betaService/COS.IQ.02.0021', obj ,(res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        this.addBusType_balanceObjectList = res.returnData.rows
                    }           
                }
            })
        },
        // 新建余额对象
        addBusType_addBalanceObj(){
            this.addBusPro_addBalanceObj_dialogForm = true
        },
        // 确定新建余额对象
        sureAddBalanceData() {
            this.$refs['addBusPro_addBalanceObj_dataForm'].validate((valid) => {
                if (valid) {
                    this.addBusPro_addBalanceObj_TmpObj.balanceObjectCode = 'MODB'+this.addBusPro_addBalanceObj_TmpObj.balanceObjectCodeHalf
                    this.addBusPro_addBalanceObj_TmpObj.operationMode = this.addFormObj.operationMode
                   // return
                    this.post('/beta/betaService/COS.AD.02.0021', this.addBusPro_addBalanceObj_TmpObj ,(res) => {
                        if (res.returnCode == '000000') {
                            this.$notify({
                                message: '新建余额对象成功',
                                type: 'success',
                            })
                            this.addBusPro_addBalanceObj_dialogForm = false
                            this.addBusType_getBalanceObjList()  
                        }
                    })
                }
            }) 
        },
        //关闭
        addBusProAddBalanceObjClose() {
            this.addBusPro_addBalanceObj_dialogForm = false
             this.addBusPro_addBalanceObj_TmpObj = {}
        },
        // 配置参数
        addBusType_handleSetParams(row, index) {
            this.balanceIntanceIndex = index
            this.addBalanceObjIntance_dialogForm = true
            this.addBalanceObjIntance_TmpObj.balanceObjectCode = row.balanceObjectCode
            this.addBalanceObjIntance_TmpObj.objectDesc = row.objectDesc
            this.addBalanceObj_intanceList = row.balanceInstanList
        },
        //余额对象实例化 替换参数
        addBalanceObjIntance_handleUpdateParams(row, index) {
            this.elementNoRadio = row.elementNo
            this.intanceParamIndex = index
            this.addBalanceObjIntance_upParam_dialogForm = true
            let obj ={
                artifactNo : row.artifactNo,
				pcdNo : row.elementNo.substring(0,8),
            }
            this.post('/beta/betaService/COS.IQ.02.0009', obj ,(res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        this.addBalanceObj_up_paramsList = res.returnData.rows
                    }           
                }
            })
        },
        handleBalanceParamsChange(val) {
            this.chooseParamObj = val
        },
        //余额对象实例化 选择替换参数
        chooseBalanceParams(val) {
            this.elementNoRadio = val.elementNo
            this.elementNoRadioDesc = val.elementDesc
        },
        //余额对象实例化 确定替换参数
        sureAddBalanceIntanceParamsData() {
            this.$set(this.addBalanceObj_intanceList[this.intanceParamIndex], 'elementNo', this.elementNoRadio)
            this.$set(this.addBalanceObj_intanceList[this.intanceParamIndex], 'elementDesc', this.elementNoRadioDesc)
            this.addBalanceObjIntance_upParam_dialogForm = false
        },
        //余额对象实例化 设置参数值
        addBalanceObjIntance_handleSetParams(row) {

        },
        
        // 确定 新建余额对象实例
        sureAddBalanceIntanceData() {
            this.addBalanceObj_intanceList.forEach(item => {
                if (item.pcdList==null && item.pcdInitList != null) {
                    item.addPcdFlag = "1"
					item.pcdList = item.pcdInitList
                }
            })
            this.addBusType_balanceObjectList[this.balanceIntanceIndex].instanlist = this.addBalanceObj_intanceList
            this.addBalanceObjIntance_dialogForm = false
        },


        // 业务类型实例化 替换参数
        addBalanceTypeIntance_handleUpdateParams(row, index) {
            this.busTypeIntance_elementNoRadio = row.elementNo
            this.busTypeIntanceParamIndex = index
            this.busTypeIntance_upParam_dialogForm = true 
            let obj ={
                artifactNo : row.artifactNo,
                pcdNo : row.elementNo.substring(0,8),
            }
            this.post('/beta/betaService/COS.IQ.02.0009', obj ,(res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        this.busType_up_paramsList = res.returnData.rows
                    }           
                }
            })
        },
        // 业务类型实例化 替换参数 当选择改变时触发
        handleBusTypeIntanceParamsChange(val) {
           this.busTypeIntance_choseElementObj = val 
        },
        // 业务类型实例化 选择参数
        chooseBusTypeIntanceParams(val) {
            this.busTypeIntance_elementNoRadio = val.elementNo
            this.busTypeIntance_elementDescRadio =val.elementDesc
        },
        // 业务类型实例化 确定替换参数
        sureBusTypeIntanceParamsData() {
            this.$set(this.addBusType_intanceList[this.busTypeIntanceParamIndex], 'elementNo', this.busTypeIntance_elementNoRadio)
            this.$set(this.addBusType_intanceList[this.busTypeIntanceParamIndex], 'elementDesc', this.busTypeIntance_elementDescRadio)
            this.busTypeIntance_upParam_dialogForm = false
        },



        // 业务类型实例化 设置参数
        addBalanceTypeIntance_handleSetParams(row, index) {
            this.busTypeIntance_setParamTitle = '设置'+row.pcdNo +':'+row.pcdDesc +'的参数值'
            this.busTypeIntance_setParam_dialogForm = true
            this.busTypeIntance_setParamIndex = index
            this.busTypeIntance_setParam_TempObj = row
            this.busType_set_paramsList = row.pcdInitList
        },
        
        //业务类型实例化 修改pcd
        busTypeIntance_handleUpPcd(row, index) {
            this.busTypeIntance_upPcdIndex = index
            this.busTypeIntance_upPcd_TempObj = row
            this.busTypeIntance_pcdPart = true
        },
        // 业务类型实例化 修改pcd保存
        busTypeIntance_up_pcdSave() {
            this.$set(this.busType_set_paramsList, this.busTypeIntance_upPcdIndex, this.busTypeIntance_upPcd_TempObj)
            this.busTypeIntance_pcdPart = false
        },
        // 业务类型实例化 修改pcd关闭
        busTypeIntance_up_pcdClose() {
            this.busTypeIntance_pcdPart = false
        },
        // 业务类型实例化 删除pcd
        busTypeIntance_handleDeletePcd(row, index) {
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if(this.busType_set_paramsList.length==1){
                    this.$message({
                        message: '必须有一条PCD取值！',
                        type: 'warning'
                    })
                    return;
                }
                this.busType_set_paramsList.splice(index, 1)
            })
        },
        // 业务类型实例化 确定设置参数
        sureBusTypeIntanceSetParamsData() {
            this.$set(this.addBusType_intanceList[this.busTypeIntance_setParamIndex],'pcdInitList', this.busType_set_paramsList)
            this.$set(this.addBusType_intanceList, this.busTypeIntance_setParamIndex, this.busTypeIntance_setParam_TempObj)
            this.busTypeIntance_setParam_dialogForm = false
        },

        // 上一步
        backPar1Btn() {
            this.part1 = true
            this.part1Btn = true
            this.part2 = false
            this.isAble1 = false
            this.isReadonly1 = false
        },

        // 下一步选择卡版面
        nextToPart3Btn() {
            this.add_allFormatData = this.generateFormatData()
            this.part3 = true
            this.part3Btn = true
            this.part2Btn = false

        },
        // 获取卡版面穿梭框左侧数据
        generateFormatData () {
            const componentData = [] // 相当于data
            const componentNoList = [] // 
            const componentList = []
            this.post('/beta/betaService/COS.IQ.02.0054', {operationMode: this.addFormObj.operationMode} ,(res) => {
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
        // 卡版面 左侧选中
        handleAddFormatComponent(val) {
            this.formatList = val
        },
        // 卡版面 右侧选中
        rightCheckedFormatChange(val) {
            this.rightCheckedFormatList = val
        },
        // 返回第2步 选择业务项目
        backPar2Btn() {
            this.part3 = false
            this.part3Btn = false
            this.part2Btn = true

        },
        // 下一步 到选择收费项目
        nextToPart4Btn() {
            this.add_allFeeItemData = this.generateFeeItemData()
            this.part4 = true
            this.part4Btn = true
            this.part3Btn = false
        },
        // 获取收费项目穿梭框左侧数据
        generateFeeItemData () {
            const componentData = [] // 相当于data
            const componentNoList = [] // 
            const componentList = []
            this.post('/beta/betaService/COS.IQ.02.0031', {periodicFeeIdentifier: 'P', operationMode: this.addFormObj.operationMode} ,(res) => {
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
        handleAddFeeComponent(val) {
            this.feeItemList = val
        },
        rightCheckedFeeItemChange() {
            this.rightCheckedFeeItemList = val
        },
        filterMethodFeeItem(query, item) {
            return item.feeItemNo.indexOf(query) > -1;
        },
        // 返回第3步 选择卡版面
        backPar3Btn() {
            this.part4 = false
            this.part4Btn = false
            this.part3Btn = true
        },

        //第5步 产品参数设置
        nextToPart5Btn() {
             if (this.busItemList.length == 0) {
                this.$message({
                    message: '请至少选择1个业务项目',
                    type: 'warning'
                })
                return
            }  
            this.part1 = false
            this.part2 = false
            this.part3 = false
            this.part4 = false
            this.part5 = true
            this.part5Btn = true
            this.addProParamFormObj.productObjectCode = 'MODP'+ this.addFormObj.productObjectCodeHalf
            this.addProParamFormObj.productDesc = this.addFormObj.productDesc
            // this.getProParamsList()
            let programTypeList = []
            this.busItemList.forEach(rightItem => {
                this.busProInitData.forEach(item => {
                    if (rightItem == item.businessProgramNo) {
                        programTypeList.push(item.programType)
                    }
                })
            })
            if (programTypeList.length > 1) {
                let count = 0
                programTypeList.forEach(item => {
                    count++
                })

                if (count == 0) {
                    let obj = {
                        businessPattern: programTypeList[0]
                    }
                    this.post('/beta/betaService/COS.IQ.02.0036', obj ,(res) => {
                        if (res.returnCode == '000000') {
                            if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                                let rows = res.returnData.rows
                                let excptArtifactList = []
                                rows.forEach( row => {
                                    excptArtifactList.push(row.artifactNo)
                                })
                                let obj2 = {
                                    instanCode: this.addFormObj.productObjectCode,
                                    excptArtifactList: excptArtifactList,
                                    instanDimen1 : "MODP"
                                }
                                this.getProParamsList(obj2)

                                // this.post('/beta/betaService/COS.IQ.02.0042 ', obj2 ,(res2) => {
                                //     if (res2.returnCode == '000000') {
                                //         if (res2.returnData && res2.returnData.rows && res2.returnData.rows.length > 0) {
                                //             this.addProParamsList = res2.returnData.rows
                                //         }
                                //     }
                                // })
                            }
                        }
                    })
                } else {
                    let obj2 ={
                        instanCode: this.addFormObj.productObjectCode,
                        instanDimen1 : "MODP"
                    }
                    this.getProParamsList(obj2)

                    // this.post('/beta/betaService/COS.IQ.02.0042 ', obj2 ,(res2) => {
                    //     if (res2.returnCode == '000000') {
                    //         if (res2.returnData && res2.returnData.rows && res2.returnData.rows.length > 0) {
                    //             this.addProParamsList = res2.returnData.rows
                    //         }
                    //     }
                    // })
                }

            } else {
                let obj = {
                    businessPattern: programTypeList[0]
                }
                this.post('/beta/betaService/COS.IQ.02.0036', obj ,(res) => {
                    if (res.returnCode == '000000') {
                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                            let rows = res.returnData.rows
                            let excptArtifactList = []
                            rows.forEach( row => {
                                excptArtifactList.push(row.artifactNo)
                            })
                            let obj2 = {
                                instanCode: this.addFormObj.productObjectCode,
                                excptArtifactList: excptArtifactList,
                                instanDimen1 : "MODP"
                            }
                            this.getProParamsList(obj2)
                            // this.post('/beta/betaService/COS.IQ.02.0042 ', obj2 ,(res2) => {
                            //     if (res2.returnCode == '000000') {
                            //         if (res2.returnData && res2.returnData.rows && res2.returnData.rows.length > 0) {
                            //             this.addProParamsList = res2.returnData.rows
                            //         }
                            //     }
                            // })
                        }
                    }
                })
            }

        },
        // 产品参数设置list
        getProParamsList(obj) {
            let objj
            if(obj) {
                objj = Object.assign({instanDimen1 : "MODP"}, obj)
            } else {
                objj = {
                    instanDimen1 : "MODP"
                }
            }
            this.post('/beta/betaService/COS.IQ.02.0042', objj ,(res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        this.addProParamsList = res.returnData.rows
                    }
                }
            })
        },
        // 卡bin 联动 查询特殊号码段号
        binNoChangeHandle(val) { 
            this.post('/beta/betaService/COS.IQ.02.0045', {cardBin: val} ,(res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        this.segmentNumberOptions = res.returnData.rows
                        this.segmentNumberDiv = true
                    } else {
                        this.segmentNumberDiv = false
                    }
                }
            })
        },
        // 产品参数设置 替换参数
        addProParams_handleUpdateParams(row, index) {
            this.addProParam_elementNoRadio = row.elementNo
            this.addProParam_ParamIndex = index
            this.addProParam_upParam_dialogForm = true
            let obj ={
                artifactNo : row.artifactNo,
				pcdNo : row.elementNo.substring(0,8),
            }
            this.post('/beta/betaService/COS.IQ.02.0009', obj ,(res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        this.addProParam_paramsList = res.returnData.rows
                    }           
                }
            })
        },
        // 产品参数设置 替换参数 改变选中
        addProParam_handleCurrParamsChange(val) {
           this.addProParam_choseElementObj = val 
        },
        // 产品参数设置 替换参数 选中
        addProParam_chooseCurrParams(val) {
            this.addProParam_elementNoRadio = val.elementNo
            this.addProParam_elementDescRadio =val.elementDesc
        },
        // 产品参数设置 确定替换参数
        addProParam_sureUpParamsData() {
            this.$set(this.addProParamsList[this.addProParam_ParamIndex], 'elementNo', this.addProParam_elementNoRadio)
            this.$set(this.addProParamsList[this.addProParam_ParamIndex], 'elementDesc', this.addProParam_elementDescRadio)
            this.addProParam_upParam_dialogForm = false
        },
        // 产品参数设置 设置参数
        addProParams_handleSetParams(row, index) {
            this.addProParam_setParamTitle = '设置'+row.pcdNo +':'+row.pcdDesc +'的参数值'
            this.addProParam_ParamIndex = index
            this.addProParam_setParam_TempObj = row
            this.addProParam_setParamsList = row.pcdInitList
            this.addProParam_setParam_dialogForm = true
        },
        addPcdBtn() {
            this.addProParam_pcdPart = true
            this.isSerialNum = this.addProParam_setParamsList.length
            this.updateSaveFlag = false
            this.addProParam_upPcd_TempObj.segmentSerialNum = this.isSerialNum++
        },
        // 产品参数设置 设置参数 修改
        addProParam_handleUpPcd(row, index) { 
            this.addProParam_upPcdIndex = index
            this.addProParam_upPcd_TempObj = row
            this.addProParam_pcdPart = true
            this.updateSaveFlag = true
        },
        // 产品参数设置 设置参数 删除 busProIntance_handleDeletePcd
        addProParam_handleDeletePcd(row, index) { 
            this.$confirm('此操作将永久删除PCD, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                if(this.addProParam_setParamsList.length==1){
                    this.$message({
                        message: '必须有一条PCD取值！',
                        type: 'warning'
                    })
                    return;
                }
                this.addProParam_setParamsList.splice(index, 1)
            })
        },
        // 产品参数设置 设置参数 保存 busProIntance_up_pcdSave
        addProParam_up_pcdSave() {
            if(this.updateSaveFlag){
                this.$set(this.addProParam_setParamsList, this.addProParam_upPcdIndex, this.addProParam_upPcd_TempObj)
            }else{
                this.addProParam_setParamsList.push(this.addProParam_upPcd_TempObj)
            }
            this.addProParam_pcdPart = false
        },
        // 产品参数设置 设置参数 关闭 busProIntance_up_pcdClose
        addProParam_up_pcdClose() {
            this.addProParam_pcdPart = false
        },
        // 产品参数设置 确定设置参数  sureBusProIntanceSetParamsData
        addProParam_sureSetParamsData() {
            this.$set(this.addProParamsList[this.addProParam_ParamIndex],'pcdInitList', this.addProParam_setParamsList)
            this.$set(this.addProParamsList, this.addProParam_ParamIndex, this.addProParam_setParam_TempObj)
            this.addProParam_setParam_dialogForm = false
        },
        // 返回第4步 
        backPar4Btn() {
            this.part5 = false 
            this.part5Btn = false 
            this.part1 = true
            this.part2 = true
            this.part3 = true
            this.part4 = true
            this.part1Btn = false
            this.part2Btn = false
            this.part3Btn = false
            this.part4Btn = true
        },

        // 产品参数设置 下一步到第6步
        nextToPart6Btn() {
            for (let i = 0 ; i<this.addProParamsList.length; i++ ) {
                if (this.addProParamsList[i] && this.addProParamsList[i].elementNo  && this.addProParamsList[i].elementNo == '424AAA0100') {
                    if(!this.addProParamFormObj.binNo) {
                        this.$message({
                            message: '元件编号为424AAA0100必须输入发行卡BIN',
                            type: 'warning'
                        })
                        return
                    }
                } else if (this.addProParamsList[i] && this.addProParamsList[i].elementNo && this.addProParamsList[i].elementNo == '424AAA0200') {
                    if(!this.addProParamFormObj.segmentNumber) {
                        this.$message({
                            message: '元件编号为424AAA0200必须输入特殊号码段号',
                            type: 'warning'
                        })
                        return
                    }
                }
            }
            this.addProPart6FormObj.productObjectCode = this.addProParamFormObj.productObjectCode
            this.addProPart6FormObj.productDesc = this.addProParamFormObj.productDesc
            this.addProPart6FormObj.binNo = this.addProParamFormObj.binNo
            this.addProPart6FormObj.segmentNumber = this.addProParamFormObj.segmentNumber
            this.getPcdDifferentList()

        },
        // 获取产品差异化参数列表
        getPcdDifferentList() {
            this.part6 = true
            this.part6Btn = true
            this.part5 = false
            this.partBtn = false
            this.getTableList('/beta/betaService/COS.IQ.02.0065', this.addProPart6TableObj ,(res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        this.pcdDifferentList = res.returnData.rows
                        this.pcdDifferentTotal = res.returnData.totalCount
                    }
                }
            })
        },
        
        // 产品差异化参数列表 设置参数
        pcdDifferent_setParams(row, index) {

        },


        // 返回 产品参数列表
        backPar5Btn() {
            this.part6 = false
            this.part6Btn = false
            this.part5 =true
            this.part5Btn =true
        },
        // 到7步 设置收费项目
        nextToPart7Btn() {
            this.part7 = true
            this.part7Btn = true
            this.part6 = false
            this.part6Btn = false

            this.addProPart7FormObj.productObjectCode = this.addProParamFormObj.productObjectCode
            this.addProPart7FormObj.productDesc = this.addProParamFormObj.productDesc
            this.addProPart7FormObj.binNo = this.addProParamFormObj.binNo
            this.addProPart7FormObj.segmentNumber = this.addProParamFormObj.segmentNumber

            let obj = {
                InstanCode1:'MODP',
                isTrans: true,
                transParams:['dic_costCategory' ],
                transDict : ['feeType']
            }
            this.getTableList('/beta/betaService/COS.IQ.02.0031', obj ,(res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        this.payProList = res.returnData.rows
                    }           
                }
            })
        },
        // 删除 已设置产品差异化参数列表
        deletePcdDiffInstan(index ) {
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.setedPcdDifferentList.splice(index, 1)
            })
        },


        // 7部分
        // 设置收费参数
        checkProCatalogue(row, index) {
             this.setFeeParam_formObj = {}
            this.setFeeParam_formObj = JSON.parse(JSON.stringify(row));
            this.setFeeParam_formObj.instanDimen1 = this.setFeeParam_formObj.instanCode1;
            this.setFeeParam_formObj.instanDimen2 = this.setFeeParam_formObj.instanCode2;
            this.setFeeParam_formObj.instanDimen3 = this.setFeeParam_formObj.instanCode3;
            this.setFeeParam_formObj.instanDimen4 = this.setFeeParam_formObj.instanCode4;
            this.setFeeParam_formObj.instanDimen5 = this.setFeeParam_formObj.instanCode5;
            this.setFeeParam_formObj.instanCode1="";
            this.setFeeParam_formObj.instanCode2="";
            this.setFeeParam_formObj.instanCode3="";
            this.setFeeParam_formObj.instanCode4="";
            this.setFeeParam_formObj.instanCode5="";
            this.setFeeParamIndex = index 
            this.setFeeParam_dialogForm = true
        },
        // 删除 收费子项
        handleDeleteChildFee(index){
            this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                this.childFeeList.splice(index, 1)
            })
        },
        // 设置收费子项
        setChildFee() {
            this.in_tempDetail = {}
            this.in_tempDetail =  JSON.parse(JSON.stringify(this.setFeeParam_formObj));
            this.in_tempDetail.operationMode = this.addFormObj.operationMode
            let params = {
                feeItemNo: this.in_tempDetail.feeItemNo
            }
            this.post('/beta/betaService/COS.IQ.02.0031', params, (res) => {
                if (res.returnCode == '000000') {
                    this.in_tempDetail.feeType = res.returnData.rows[0].feeType;
                    this.in_tempDetail.assessmentMethod = res.returnData.rows[0].assessmentMethod;
                    if(this.in_tempDetail.feeMatrixApplicationDimension){
                        this.in_tempDetail.feeMatrixApplicationDimension = this.in_tempDetail.feeMatrixApplicationDimension.toString()
                    }
                    if(this.in_tempDetail.assessmentMethod =="M" || this.in_tempDetail.feeType =="ANNF"){
                        this.showMethod = true;
                    }else{
                        this.showMethod = false;
                    }
                    if(this.in_tempDetail.instanDimen1){
                        this.choseBtnFlag1 = false;
                    }else{
                        this.choseBtnFlag1 = true;
                    }
                    if(this.in_tempDetail.instanDimen2){
                        this.choseBtnFlag2 = false;
                    }else{
                        this.choseBtnFlag2 = true;
                    }
                    if(this.in_tempDetail.instanDimen3){
                        this.choseBtnFlag3 = false;
                    }else{
                        this.choseBtnFlag3 = true;
                    }
                    if(this.in_tempDetail.instanDimen4){
                        this.choseBtnFlag4 = false;
                    }else{
                        this.choseBtnFlag4 = true;
                    }
                    if(this.in_tempDetail.instanDimen5){
                        this.choseBtnFlag5 = false;
                    }else{
                        this.choseBtnFlag5 = true;
                    }
                    this.set_dialogDetail  = true
                }
            })

        },
        sureAddBusProFeeData(){
            this.childFeeList.push(this.in_tempDetail)
            this.in_tempDetail = {}
            this.set_dialogDetail = false
        },
        // 确定设置收费参数
        sureSetFeeParamData() {
          //  this.$set(this.payProList[this.setFeeParamIndex], 'feeInstanList', this.childFeeList)
        //  this.payProList[this.setFeeParamIndex].feeInstanList = {}
        //  this.payProList[this.setFeeParamIndex].feeInstanList = this.childFeeList
            this.setFeeParam_dialogForm = false
        },
        //返回6步
        backPar6Btn() {
            this.part6 = true
            this.part6Btn = true
            this.part7 =false
            this.part7Btn =false
        },
        saveProBtn() {
            let obj = {}
            obj = Object.assign(obj, this.addProParamFormObj)
            obj = Object.assign(obj, this.addFormObj)
            obj.busProList = []
            obj.formatList = []
            obj.feeItemList = []

            this.busItemList.forEach(rightItem => {
                this.busProInitData.forEach( item => {
                    if (rightItem == item.businessProgramNo) {
                        obj.busProList.push(item)
                    }
                })
            })
            this.formatList.forEach(rightItem => {
                this.formatInitList.forEach( item => {
                    if (rightItem == item.formatCode) {
                        obj.formatList.push(item)
                    }
                })
            })
            this.feeItemList.forEach(rightItem => {
                this.feeItemInitList.forEach( item => {
                    if (rightItem == item.feeItemNo) {
                        obj.feeItemList.push(item)
                    }
                })
            })
            obj.productObjectCode = this.addProParamFormObj.productObjectCode

            // 产品参数设置
            this.addProParamsList.forEach(item => {
                if (item.pcdList==null && item.pcdInitList!=null) {
                    item.addPcdFlag = "1"
					item.pcdList = item.pcdInitList
                }

                item.instanCode1 = this.addProParamFormObj.productObjectCode
            })
            obj.instanlist = this.addProParamsList
            obj.instanCode =  this.addProParamFormObj.productObjectCode
            obj.pcdList = []
            if (this.setedPcdDifferentList.length != 0) {
                obj.pcdList = this.setedPcdDifferentList
				obj.addPcdFlag ="1"
            }
            obj.feeInstanList = []
            obj.feeInstanList = this.childFeeList
            // if (this.payProList.length != 0) {
            //   //  this.payProList.forEach(item => {
            //     for(var m=0 ;m<this.payProList.length;m++){
            //         if (this.payProList[m].feeInstanList != null) {
            //             for(var n=0 ;n<this.payProList[m].feeInstanList.length;n++){
            //            // item.feeInstanList.forEach(feeInstanItem => {
            //                 obj.feeInstanList.push(this.payProList[m].feeInstanList[n])
            //             }
            //         }
            //     }
            // }
            this.post('/beta/betaService/COS.AD.02.0013', obj ,(res) => {
                if (res.returnCode == '000000') {
                    // if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                    //     this.payProList = res.returnData.rows
                    // }else{
                    //     this.payProList = []
                    // }
                     this.$notify({
                      message: '产品发布成功',
                      type: 'success',
                    })
                    obj = {}
                    this.addFormObj = {}
                    this.addProParamFormObj = {}
                    this.rightCheckedBusPro = {}
                    this.addProPart6FormObj = {}
                    this.rightCheckedFormatList = {}
                    this.addProPart7FormObj = {}
                    this.rightCheckedFeeItemList = {}
                    this.part1 = true
                    this.part2 = false
                    this.part3 = false
                    this.part4 = false
                    this.part5 = false
                    this.part6 = false
                    this.part7 = false
                    this.part1Btn = true
                    this.isAble1 = false
                    this.isReadonly1 = false
                    this.$nextTick(() => {
                        this.$refs['addFormRef'].clearValidate()
                    })          
                }
            })
        },
    }
}
</script>
<style>
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
<!-- 业务类型 -->
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
            <el-form-item class="cl_td" label="业务类型代码" prop="businessTypeCode">
                <el-input v-model="queryFormObj.businessTypeCode" class="wd200" type="text" />
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" v-show="selBtnFlag">查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate" v-show="addBtnFlag">新增</el-button>
            </div>
        </el-form>
        <el-table
            v-loading = "loading"
            :data="tableData"
            class="mbtm20"
            fit
            highlight-current-row
            style="width: 100%;"
            border
        >
            <el-table-column prop="operationMode" label="运营模式" align="center" />
            <el-table-column prop="businessTypeCode" label="业务类型代码" align="center" />
            <el-table-column prop="businessDesc" label="描述" align="center" />
            <el-table-column prop="businessFormConcat" label="业务形态" align="center" />
            <el-table-column prop="businessDebitCreditCodeDesc" label="业务性质" align="center" />
            <el-table-column prop="" label="操作" align="center" width = "350">
                <template slot-scope="{row}">
                    <el-button size="mini" icon="el-icon-more" type="primary" @click="handleDetail(row)" v-show="selBtnFlag">详情</el-button>
                    <el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleUpdate(row)" v-show="updBtnFlag">修改</el-button>
                </template> 
            </el-table-column>
        </el-table>
        <pagination v-show="config.total>0" :total="config.total" :page.sync="config.pageNum" :limit.sync="config.pageSize" @pagination="getList" />
        
        <!-- 新增 -->
        <el-dialog title="新增" :visible.sync="dialogFormVisibleAdd" width="85%">
            <div v-show="add_part1">
                <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd" >
                    <el-form-item class="cl_td" label="运营模式" prop="operationMode" 
                    :rules="[ { required: true, message: '运营模式不能为空'} ]">
                        <el-select v-model="tempAdd.operationMode" class="wd200" clearable :disabled="isDisabled1">
                            <el-option
                            v-for="(item, index ) in operationModeOptions"
                            :key="index"
                            :label="item.modeName"
                            :value="item.operationMode"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="cl_td" label="业务类型代码" prop="businessTypeCodeHalf"
                    :rules="[ { required: true, message: '业务类型代码不能为空' },
                    { max: 5, min: 5, message: '长度为 5 个字符' },
                    { validator: this.validNumber }]">
                    MODT 
                    <el-input v-model="tempAdd.businessTypeCodeHalf" class="wd150" type="text" :readonly="isReadonly1"/>
                    </el-form-item>
                    <el-form-item class="cl_td" label="描述" prop="businessDesc"
                    :rules="[ { required: true, message: '描述不能为空'}]">
                    <el-input v-model="tempAdd.businessDesc" class="wd200" type="text" :readonly="isReadonly1"/>
                    </el-form-item>
                    <el-form-item class="cl_td" label="业务形态" prop="businessForm">
                        <el-select v-model="tempAdd.businessForm" class="wd200" clearable :disabled="isDisabled1">
                            <el-option
                            v-for="(item, index ) in businessFormOptions"
                            :key="index"
                            :label="item.patternDesc"
                            :value="item.businessPattern"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="cl_td" label="业务性质" prop="businessDebitCreditCode">
                        <el-select v-model="tempAdd.businessDebitCreditCode" class="wd200" clearable :disabled="isDisabled1">
                            <el-option
                            v-for="(item, index ) in businessDebitCreditCodeOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="cl_td" label="还款优先级" prop="paymentPriority">
                        <el-input v-model="tempAdd.paymentPriority" class="wd120" type="text" :readonly="isReadonly1" />
                        <div class="search_button">
                            <el-button size="small" icon="el-icon-search" type="primary" @click="chosePriorityBtn()">
                                查询
                            </el-button>
                        </div>
                    </el-form-item>
                    <el-form-item class="cl_td" label="本金余额对象" prop="defaultPrincipalBalanceObj"
                    :rules="[ { required: true, message: '本金余额对象不能为空'}]">
                        <el-select v-model="tempAdd.defaultPrincipalBalanceObj" class="wd200" clearable :disabled="isDisabled1">
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
                        <el-select v-model="tempAdd.defaultInterestBalanceObj" class="wd200" clearable :disabled="isDisabled1">
                            <el-option
                            v-for="(item, index ) in defaultInterestBalanceObjOptions"
                            :key="index"
                            :label="item.labelDesc"
                            :value="item.balanceObjectCode"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="cl_td" label="费用余额对象" prop="defaultFeeBalanceObj"
                    :rules="[ { required: true, message: '费用余额对象不能为空'}]">
                        <el-select v-model="tempAdd.defaultFeeBalanceObj" class="wd200" clearable :disabled="isDisabled1">
                            <el-option
                            v-for="(item, index ) in defaultFeeBalanceObjOptions"
                            :key="index"
                            :label="item.labelDesc"
                            :value="item.balanceObjectCode"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="cl_td" label="业务用途" prop="businessPurpose">
                        <el-select v-model="tempAdd.businessPurpose" class="wd200" clearable :disabled="isDisabled1">
                            <el-option
                            v-for="(item, index ) in businessPurposeOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                            />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="cl_td" label="默认交易识别" prop="defaultTransIdentifiNo">
                        <el-input v-model="tempAdd.defaultTransIdentifiNo" class="wd200" type="text" :readonly="isReadonly1" />
                    </el-form-item>
                </el-form>
                <div class="cl_tr text_center" v-show="add_part1Btn">
                    <el-button size="medium" icon="el-icon-arrow-down" type="primary" @click="add_nextToPart2Btn">下一步</el-button>
                </div>
            </div>


            <div v-show="add_part2">
                <div class="text_title padLf10">选择交易识别代码</div>
                <div style="margin-left: 20%;">
                    <el-transfer 
                        filterable
                        :filter-method="filterMethod"
                        :titles="['可选交易代码', '已选交易代码']"
                        filter-placeholder="请输入交易代码"
                        v-model="add_transIdList"
                        @change="up_handleAddComponent"
                        @right-check-change="add_rightCheckedChange"
                        :data="add_leftData">
                    </el-transfer>
                </div>

                <div class="cl_tr text_center mtop20" v-show="add_part2Btn">
                    <el-button size="medium" icon="el-icon-arrow-up" type="primary" @click="add_backToPart1Btn">上一步</el-button>
                    <el-button size="medium" icon="el-icon-setting" type="primary" @click="add_setDefaultTransIdBtn">设置默认交易识别码</el-button>
                    <el-button size="medium" icon="el-icon-arrow-down" type="primary" @click="add_nextToPart3Btn">下一步</el-button>
                    
                </div>
            </div>

            <div v-show="add_part3">
                <el-form :model="tempAdd2" >
                    <el-form-item class="cl_td red" label="业务类型代码" prop="businessTypeCode">
                        <el-input v-model="tempAdd2.businessTypeCode" class="wd200" type="text" />
                    </el-form-item>
                    <el-form-item class="cl_td" label="业务类型描述" prop="businessDesc">
                        <el-input v-model="tempAdd2.businessDesc" class="wd200" type="text" />
                    </el-form-item>
                </el-form>
                <!-- 业务类型参数选项 -->
                <set-param-option
                    :colunm3="add_colunm32"
                    :textTitle="add_textTitle2"
                    :list="add_busTypeInList"
                    @replaceParamClick="add_replaceParamClick(arguments)"
                    @setParamClick="add_setParamClick(arguments)"
                ></set-param-option>
                
                <div class="cl_tr text_center mtop20" v-show="add_part3Btn">
                    <el-button size="medium" icon="el-icon-arrow-up" type="primary" @click="add_backToPart2Btn">上一步</el-button>
                    
                </div>
            </div>

            
            



            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleAdd = false">
                    取消
                </el-button>
                <el-button type="primary" @click="createData()">
                    确定
                </el-button>
            </div>
        </el-dialog>


        <!-- 详情 查看pcd参数 弹窗-->
        <el-dialog :title="viewPcdTitle" :visible.sync="viewPcd_dialog" width="65%">
            <view-pcd :viewPcdFormObj="viewPcdFormObj"></view-pcd>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="viewPcd_dialog = false">
                关闭
                </el-button>
            </div>
        </el-dialog>
        <!-- 详情 -->
        <el-dialog title="业务类型详情" :visible.sync="dialogFormVisibleDetail" width="85%">
            <el-form ref="dataFormDetail" :rules="rulesDetail" :model="tempDetail" >
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
                <el-form-item class="cl_td" label="业务类型代码" prop="businessTypeCode"
                :rules="[ { required: true, message: '业务类型代码不能为空'}]">
                    <el-input v-model="tempDetail.businessTypeCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="businessDesc"
                :rules="[ { required: true, message: '描述不能为空'}]">
                <el-input v-model="tempDetail.businessDesc" class="wd200" type="text"  readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="业务形态" prop="businessForm">
                    <el-select v-model="tempDetail.businessForm" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in businessFormOptions"
                        :key="index"
                        :label="item.patternDesc"
                        :value="item.businessPattern"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="业务性质" prop="businessDebitCreditCode">
                    <el-select v-model="tempDetail.businessDebitCreditCode" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in businessDebitCreditCodeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="还款优先级" prop="paymentPriority">
                    <el-input v-model="tempDetail.paymentPriority" class="wd200" type="text" readonly />

                </el-form-item>
                <el-form-item class="cl_td" label="本金余额对象" prop="defaultPrincipalBalanceObj"
                :rules="[ { required: true, message: '本金余额对象不能为空'}]">
                    <el-select v-model="tempDetail.defaultPrincipalBalanceObj" class="wd200" clearable disabled>
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
                    <el-select v-model="tempDetail.defaultInterestBalanceObj" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in defaultInterestBalanceObjOptions"
                        :key="index"
                        :label="item.labelDesc"
                        :value="item.balanceObjectCode"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="费用余额对象" prop="defaultFeeBalanceObj"
                :rules="[ { required: true, message: '费用余额对象不能为空'}]">
                    <el-select v-model="tempDetail.defaultFeeBalanceObj" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in defaultFeeBalanceObjOptions"
                        :key="index"
                        :label="item.labelDesc"
                        :value="item.balanceObjectCode"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="业务用途" prop="businessPurpose">
                    <el-select v-model="tempDetail.businessPurpose" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in businessPurposeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="默认交易识别" prop="defaultTransIdentifiNo">
                    <el-input v-model="tempDetail.defaultTransIdentifiNo" class="wd200" type="text" readonly />
                </el-form-item>
            </el-form>
            <div class="text_title">已选交易识别代码</div>
            <common-table
                :tableData="tableData1"
                :config="config1"
                :tableLabel="tableLabel1"
                @changePage="getTransIdList(tempDetail)"
            ></common-table>
            <!-- <div class="text_title">余额对象参数选项</div> -->
            <some-param-option v-if="table8List" 
                :colunm1="colunm1"
                :labelStr="labelStr" 
                :textTitle="textTitle8"
                :list="table8List"
                @viewParamClick="hadleViewParam">
            </some-param-option>
            <pagination v-show="table8Total>0" :total="table8Total" :page.sync="table8FormObj.pageNum" :limit.sync="table8FormObj.pageSize" @pagination="getList8(tempDetail)" /> 
            <!-- 业务类型参数选项 -->
            <some-param-option v-if="table9List"
                :textTitle="textTitle9"
                :list="table9List"
                @viewParamClick="hadleViewParam">
            </some-param-option>
            <pagination v-show="table9Total>0" :total="table9Total" :page.sync="table9FormObj.pageNum" :limit.sync="table9FormObj.pageSize" @pagination="getList9(tempDetail)" />  
            <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogFormVisibleDetail = false">
                关闭
            </el-button>
            </div>
        </el-dialog>


        <!-- 查询还款优先级 -->
        <el-dialog
            title="查询业务类型还款优先级"
            :visible.sync="businessTypePriorityDialog"
            width="65%"
        >
            <business-type-priority></business-type-priority>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="businessTypePriorityDialog = false">
                关闭
                </el-button>
            </div>
        </el-dialog>

        <!-- 替换参数 弹窗 -->
        <el-dialog
        title="选择参数选项"
        :visible.sync="replcaeParam_dialog"
        width="65%"
        >
        <replace-param
            :replaceObj="replaceParamObj"
            :replaceIndex="replaceIndex"
            :defalutVal="defalutChoseVal"
            @childByElementVal="childByElementVal"
        ></replace-param>
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
        <set-pcd
            :setPcdObj="setPcdObj"
            :setIndex="replaceIndex"
            @childBySetVal="childBySetVal"
            @childByDeletPcd="childByDeletPcd"
        ></set-pcd>
        <div slot="footer" class="dialog-footer">
            <el-button @click="setParam_dialog = false">
            关闭
            </el-button>
            <el-button type="primary" @click="sureSetData()">
            确定
            </el-button>
        </div>
        </el-dialog>
        <!-- 修改 -->
        <el-dialog title="修改" :visible.sync="dialogFormVisibleUp" width="85%" :close-on-click-modal="false">
            <el-form ref="dataFormUp" :rules="rulesAdd" :model="tempUp" >
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
                <el-form-item class="cl_td" label="业务类型代码" prop="businessTypeCode"
                :rules="[ { required: true, message: '业务类型代码不能为空'}]">
                    <el-input v-model="tempUp.businessTypeCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="businessDesc"
                :rules="[ { required: true, message: '描述不能为空'}]">
                <el-input v-model="tempUp.businessDesc" class="wd200" type="text"  />
                </el-form-item>
                <el-form-item class="cl_td" label="业务形态" prop="businessForm">
                    <el-select v-model="tempUp.businessForm" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in businessFormOptions"
                        :key="index"
                        :label="item.patternDesc"
                        :value="item.businessPattern"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="业务性质" prop="businessDebitCreditCode">
                    <el-select v-model="tempUp.businessDebitCreditCode" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in businessDebitCreditCodeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="还款优先级" prop="paymentPriority">
                    <el-input v-model="tempUp.paymentPriority" class="wd120" type="text" />
                    <div class="search_button">
                        <el-button size="small" icon="el-icon-search" type="primary" @click="chosePriorityBtn()">
                            查询
                        </el-button>
                    </div>
                </el-form-item>
                <el-form-item class="cl_td" label="本金余额对象" prop="defaultPrincipalBalanceObj"
                :rules="[ { required: true, message: '本金余额对象不能为空'}]">
                    <el-select v-model="tempUp.defaultPrincipalBalanceObj" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in defaultPrincipalBalanceObjOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="利息余额对象" prop="defaultInterestBalanceObj"
                :rules="[ { required: true, message: '利息余额对象不能为空'}]">
                    <el-select v-model="tempUp.defaultInterestBalanceObj" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in defaultInterestBalanceObjOptions"
                        :key="index"
                        :label="item.labelDesc"
                        :value="item.balanceObjectCode"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="费用余额对象" prop="defaultFeeBalanceObj"
                :rules="[ { required: true, message: '费用余额对象不能为空'}]">
                    <el-select v-model="tempUp.defaultFeeBalanceObj" class="wd200" clearable >
                        <el-option
                        v-for="(item, index ) in defaultFeeBalanceObjOptions"
                        :key="index"
                        :label="item.labelDesc"
                        :value="item.balanceObjectCode"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="业务用途" prop="businessPurpose">
                    <el-select v-model="tempUp.businessPurpose" class="wd200" clearable>
                        <el-option
                        v-for="(item, index ) in businessPurposeOptions"
                        :key="index"
                        :label="item.labelDesc"
                        :value="item.balanceObjectCode"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="默认交易识别" prop="defaultTransIdentifiNo">
                    <el-input v-model="tempUp.defaultTransIdentifiNo" class="wd200" type="text" readonly />
                </el-form-item>
            </el-form>
            
            <div class="text_title">选择交易识别代码</div>
            <div style="margin-left: 20%;">
                <el-transfer 
                    filterable
                    :filter-method="filterMethod"
                    :titles="['可选交易代码', '已选交易代码']"
                    filter-placeholder="请输入交易代码"
                    v-model="up_transIdList"
                    @change="up_handleAddComponent"
                    @right-check-change="up_rightCheckedChange"
                    :data="up_leftData">
                </el-transfer>
            </div>
            <!-- 余额对象参数选项 -->
            <set-param-option
                :labelStr="labelStr"
                :colunm1="up_colunm1"
                :colunm3="up_colunm3"
                :textTitle="up_textTitle"
                :list="up_balanceInList"
                @replaceParamClick="replaceParamClick1(arguments)"
                @setParamClick="setParamClick1(arguments)"
            ></set-param-option>
            <pagination v-show="paramsTotal>0" :total="paramsTotal" :page.sync="setParamsObj.pageNum" :limit.sync="setParamsObj.pageSize" @pagination="getSetOptionList(tempUp)" />
            
            <!-- 余额对象参数修改列表 -->
            <div v-if="up_upBalanceList.length > 0">
                <set-param-option
                    :labelStr="labelStr"
                    :colunm1="up_colunm1"
                    :colunm3="up_colunm3"
                    :textTitle="up_uptextTitle"
                    :deleteBtn="deleteBtn"
                    :list="up_upBalanceList"
                    @replaceParamClick="up_replaceParamClick1(arguments)"
                    @setParamClick="up_setParamClick1(arguments)"
                    @handleDel = "handleDel1"
                ></set-param-option>
            </div>
            

            
            <!-- 业务类型参数选项 -->
            <set-param-option
                :colunm3="up_colunm32"
                :textTitle="up_textTitle2"
                :list="up_busTypeInList"
                @replaceParamClick="replaceParamClick2(arguments)"
                @setParamClick="setParamClick2(arguments)"
            ></set-param-option>
            <pagination v-show="paramsTotal2>0" :total="paramsTotal2" :page.sync="setParamsObj2.pageNum" :limit.sync="setParamsObj2.pageSize" @pagination="getSetOptionList2(tempUp)" />
            
            <!-- 业务类型参数修改列表 -->
            <div v-if="up_upBusTypeList.length > 0">
                <set-param-option
                    :colunm3="up_colunm3"
                    :textTitle="up_uptextTitle2"
                    :deleteBtn="deleteBtn"
                    :list="up_upBusTypeList"
                    @replaceParamClick="up_replaceParamClick2(arguments)"
                    @setParamClick="up_setParamClick2(arguments)"
                    @handleDel = "handleDel2"
                ></set-param-option>
            </div>


            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="updateData()">
                    确定
                </el-button>
                <el-button @click="dialogFormVisibleUp = false">
                    取消
                </el-button>
            </div>
        </el-dialog>

    
    
    </div>
</template>

<script>
import { isNumber } from "@/utils/validate";
import Pagination from "@/components/Pagination";
// import VTable from "@/components-ider/VTable";
import SomeParamOption from "@/components-ider/SomeParamOption"; // 查看参数
import ViewPcd from "@/components-ider/ViewPcd";
import CommonTable from "@/components-ider/CommonTable";
import BusinessTypePriority from "@/components-ider/businessTypePriority";
import SetParamOption from "@/components-ider/SetParamOption";
import ReplaceParam from "@/components-ider/ReplaceParam";
import SetPcd from "@/components-ider/SetPcd";



export default {
  name: 'tableList',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Pagination,
    // VTable,
    SomeParamOption,
    ViewPcd,
    CommonTable,
    BusinessTypePriority,
    SetParamOption,
    ReplaceParam,
    SetPcd
  },
  data() {
    return {
      // 权限
      selBtnFlag: false,
      addBtnFlag: false,
      updBtnFlag: false,
      btnAuthStr: '',

      // 列表
      queryFormObj: {},
      loading: false,
      queryFormRef: {},
      queryFormRules: {},      
      tableData: [],
      config: {
        pageNum: 1,
        pageSize: 10,
        total: 0
      },


      // 下拉框
      operationModeOptions: [], 
    //  businessFormOptions: [],
      businessFormOptions: [], // 业务形态
    businessDebitCreditCodeOptions: [],
    defaultPrincipalBalanceObjOptions: [], //
    defaultInterestBalanceObjOptions: [],
    defaultFeeBalanceObjOptions: [],
    businessPurposeOptions: [],
      
      // 增删改查
      tempAdd: {}, // 新增
      tempUp: {}, // 修改
      tempDetail: {}, // 详情
      dialogFormVisibleAdd: false,
      dialogFormVisibleUp: false,
      dialogFormVisibleDetail: false,
      rulesAdd: {},
      rulesDetail: {},
      rulesUp: {},


      // 详情 弹出

      // 余额对象参数选项
        banlance_viewParam_dialog:false,
        textTitle8: '余额对象参数选项',
        table8Loading: false,
        table8List: [],
        table8Total: 0,
        table8FormObj: {
            pageSize: 10,
            pageNum: 1
        },
        labelStr: '余额对象',
        colunm1: true,
         // 查看参数组价
        textTitle2: '业务项目参数设置',
        viewPcdTitle: '',
        viewPcd_dialog: false,
        viewPcdFormObj: {},
        // 业务类型参数选项
        textTitle9: '业务类型参数选项',
        table9Loading: false,
        table9List: [],
        table9Total: 0,
        table9FormObj: {
            pageSize: 10,
            pageNum: 1
        },
        // 已选交易识别代码
        tableData1: [],
      config1: {
        pageNum: 1,
        pageSize: 10,
        loading: false,
        total: 0
      },
      tableLabel1: [
        {
          label: "交易识别代码",
          prop: "transIdentifiNo"
        },
        {
          label: "交易识别描述",
          prop: "transIdentifiDesc"
        }
      ],



      // 修改
      up_transIdList: [],
        rightCheckedTransId: [],
        up_transIInitData: [], //穿梭框初始化数据
        up_leftData: [],
      businessTypePriorityDialog: false,// 查看还款优先级
      up_intanceFlag: '', // 用于标记，是余额对象实例还是业务类型实例

        // 余额对象参数选项
       up_hidden1: true,
        up_balanceInList: [], // 余额对象参数选项
        up_textTitle: "余额对象参数选项",
        up_colunm1: true,
        up_colunm3: false,
        paramsTotal: 0,
        setParamsObj: {
            pageNum: 1, 
            pageSize: 10
        },
        up_upBalanceList: [],
        up_uptextTitle: '余额对象参数修改列表',
        deleteBtn: true,
        //业务类型参数选项
      up_busTypeInList: [],
        up_textTitle2: "业务类型参数选项",
        up_colunm32: false,
        paramsTotal2: 0,
        setParamsObj2: {
            pageNum: 1, 
            pageSize: 10
        },
        up_upBusTypeList: [],
        up_uptextTitle2: '业务类型参数修改列表',
        // 替换参数
        replcaeParam_dialog: false,
        replaceParamObj: {},
        istLoading1: false,
        replaceIndex: "",
        defalutChoseVal: "",
        choosedVal: "",
        // 设置参数
        setParam_dialog: false,
        setPcdObj: {},
        setPcdTitle: "",
        pcdList: [],
        delePcdList: [],


        // 新增
        add_part1: true,
        add_part1Btn: true,
        add_part2: false,
        add_part2Btn: false,
        add_part3: false,
        add_part3Btn: false,
        isReadonly1: false,
        isDisabled1: false,
        add_leftData: [],
        add_transIdList: [],
        rightCheckedItems:[],
        tempAdd2: {},
        add_busTypeInList: [],
        instanlistCreate:[],
        add_textTitle2: "业务类型实例化",
        add_colunm32: false,
        selTransIdNoList: [], // 新增 选在右侧数据
        add_transIdInitData: [], // 新增初始化数据

    }
  },
  created() {
    this.getBtnAuth()
  },
  mounted() {
    this.getList()
    // 登录信息
    let loginInfo = JSON.parse(window.sessionStorage.getItem('logininfo')) 

    // 运营模式 
    this.getSelectDict( "/beta/betaService/COS.IQ.02.0006").then(res => {
        this.operationModeOptions = res
    })
    // 业务形态 
    this.getSelectDict( "/beta/betaService/COS.IQ.02.0035").then(res => {
        this.businessFormOptions = res
        console.log(res)
    }) 

    // 业务性质  
    this.getSelectDict('dic_businessNature').then((res) => {
        this.businessDebitCreditCodeOptions = res
    })
    // 业务用途
    this.getSelectDict('dic_businessNature').then((res) => {
        this.businessPurposeOptions = res
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

    	
  },
  methods: {
    // 表单验证数字
    validNumber: (rule, value, callback) => {
      if (!isNumber(value)) {
        callback(new Error("请输入数字"));
      } else {
        callback();
      }
    },
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
                    if (this.btnAuthStr.includes('COS.IQ.02.0020')) { // 查询
                        this.selBtnFlag = true
                    } else {
                        this.selBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.AD.02.0020')) { // 新增
                        this.addBtnFlag = true
                    } else {
                        this.addBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.UP.02.0020')) { // 维护
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
        this.loading = true
        this.queryFormObj.isTrans = true
        this.queryFormObj.transParams = ['dic_businessNature' ]
        this.queryFormObj.transDict = ['businessDebitCreditCode']
        this.config = Object.assign(this.config, this.queryFormObj)
        this.getTableList('/beta/betaService/COS.IQ.02.0020', this.config ,(res) => {
            if (res.returnCode == '000000') {
                this.loading = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    let rows = res.returnData.rows
                    rows.forEach(row => {
                        row.businessFormConcat = row.businessForm+ ' ' +row.patternDesc
                    })
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
       		this.loading = false
      })

    },
    handleSearch() {
        this.config.pageNum = 1
        this.config.pageSize = 10
        this.getList()
    },

    handleCreate() {
        this.dialogFormVisibleAdd = true
      this.$nextTick(() => {
        this.$refs['dataFormAdd'].clearValidate()
      })
    }, 
    createData() {
        this.$refs['dataFormAdd'].validate((valid) => {
        if (valid) {
            this.instanlistCreate = []
            this.add_busTypeInList.forEach(item => {
                if (item.pcdList == null && item.pcdInitList != null) {
                    item.addPcdFlag = '1'
                    item.pcdList = item.pcdInitList
                }
                this.instanlistCreate.push(item)
            })
            this.tempAdd.instanlist = this.instanlistCreate
            this.tempAdd.businessTypeCode = this.tempAdd2.businessTypeCode
            this.tempAdd.transIdNoList = this.selTransIdNoList 
            this.post('/beta/betaService/COS.AD.02.0020', this.tempAdd, (res) => {
                if(res.returnCode == '000000') {
                    this.dialogFormVisibleAdd = false
                    this.$notify({
                        message: '新增成功',
                        type: 'success',
                    })
                    this.tempAdd = {}
                    this.isReadonly1 = false
                    this.isDisabled1 = false
                    this.add_part1 = true
                    this.add_part1Btn = true
                    this.add_part2 = false
                    this.add_part2Btn = false
                    this.add_part3 = false
                    this.add_part3Btn = false
                    this.add_transIdList = []
                    this.add_busTypeInList = []
                    this.selTransIdNoList = []
                    this.getList()
                }
            })
        }
      })
    },  
    handleDetail(row) {
        this.dialogFormVisibleDetail = true
      this.tempDetail = Object.assign({}, row) // 
      this.$nextTick(() => {
        this.$refs['dataFormDetail'].clearValidate()
      })
      this.getTransIdList(row)
      this.getList8(row)
      this.getList9(row)

    },
    handleUpdate(row) {
        this.tempUp = Object.assign({}, row)
        this.dialogFormVisibleUp = true
        this.$nextTick(() => {
            this.$refs['dataFormUp'].clearValidate()
        })
        // 选择交易识别代码
        this.up_transIdList = this.getRightBusData(row)
        this.up_leftData = this.getLeftBusData(row, this.up_transIdList)
        this.getSetOptionList(row)
        this.getSetOptionList2(row)
    }, 
    updateData() {
        this.$refs['dataFormUp'].validate((valid) => {
            if (valid) {
                this.tempUp.artifactInstanList = []
                this.tempUp.transIdNoList = this.up_transIdList
                this.tempUp.artifactInstanList = this.up_upBalanceList.concat(this.up_upBusTypeList)
                // console.log(this.tempUp)
                // return
                this.post('/beta/betaService/COS.UP.02.0020', this.tempUp, (res) => {
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


    // 详情
    //已选交易识别代码
    getTransIdList(row) {
      this.config1.loading = true;
      this.config1.businessTypeCode = row.businessTypeCode;
      this.config1.operationMode = row.operationMode;
      this.getTableList("/beta/betaService/COS.IQ.02.0052", this.config1, res => {
          if (res.returnCode == "000000") {
            this.config1.loading = false;
            if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
              this.tableData1 = res.returnData.rows;
              this.config1.total = res.returnData.totalCount;
            } else {
              this.tableData1 = [];
              this.config1.total  = 0
            }
          }
        }, (err) => {
      		this.tableData1 = [];
            this.config1.total  = 0
       		this.config1.loading = false;

        })
    },
    // 余额对象参数选项
    getList8(row) {
        let obj = {
            artifactNo : 8,
            businessProgramNo: row.businessProgramNo,
            instanCode: row.businessTypeCode,
            operationMode: row.operationMode
        }
        this.table8FormObj = Object.assign(this.table8FormObj, obj)
        this.getTableList('/beta/betaService/COS.IQ.02.0015', this.table8FormObj ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    let rows = res.returnData.rows
                    rows.forEach(item => {
                        item.concat = item.instanCode1 + ' ' +item.instanDesc1
                    })
                     this.table8List = rows
                     this.table8Total = res.returnData.totalCount
                } else {
                    this.table8List = []
                    this.table8Total = 0
                }
            } 
        }, (err) => {
      		this.table8List = []
            this.table8Total = 0
       		
      })
    },
    // 查看参数
    hadleViewParam(row) {
        this.viewPcdTitle = '查看'+row.pcdNo+': '+row.pcdDesc+'参数信息'
        this.viewPcd_dialog = true
        this.viewPcdFormObj = row
    },
    
     // 业务类型参数选项
    getList9(row) {
        let obj = {
            artifactNo : 9,
            instanCode: row.businessTypeCode,
            operationMode: row.operationMode,
        }
        this.table9Loading = true
        this.table9FormObj = Object.assign(this.table9FormObj, obj)
        this.getTableList('/beta/betaService/COS.IQ.02.0015', this.table9FormObj ,(res) => {
            if (res.returnCode == '000000') {
                this.table9Loading = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                     this.table9List =  res.returnData.rows
                     this.table9Total = res.returnData.totalCount
                } else {
                    this.table9List = []
                    this.table9Total = 0
                }
            } 
        }, (err) => {
      		this.table9List = []
            this.table9Total = 0
       		this.table9Loading = false
        })
    },


    // 修改
    // 余额对象参数选项
    getSetOptionList(row) {
        let obj = {
            artifactNo: 8,
            instanCode: row.businessTypeCode,
            operationMode: row.operationMode
        }
        this.setParamsObj = Object.assign( this.setParamsObj, obj)
        this.getTableList( "/beta/betaService/COS.IQ.02.0015", this.setParamsObj, res => {
            if (res.returnCode == "000000") {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                    let rows = res.returnData.rows
                    rows.forEach(item => {
                        item.concat = item.instanCode1 + ' ' + item.instanDesc1
                    })
                    this.up_balanceInList = rows
                    this.paramsTotal = res.returnData.totalCount
                } else {
                    this.up_balanceInList = []
                    this.paramsTotal = 0
                }
            }
        }, (err) => {
      		this.up_balanceInList = []
            this.paramsTotal = 0
        })
    },
    // 业务类型参数选项
    getSetOptionList2(row) {
        let obj = {
            artifactNo: 9,
            instanCode: row.businessTypeCode,
            operationMode: row.operationMode
        }
        this.setParamsObj2 = Object.assign( this.setParamsObj2, obj)
        this.getTableList( "/beta/betaService/COS.IQ.02.0015", this.setParamsObj2, res => {
            if (res.returnCode == "000000") {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                    this.up_busTypeInList = res.returnData.rows
                    this.paramsTotal2 = res.returnData.totalCount
                } else {
                    this.up_busTypeInList = []
                    this.paramsTotal2 = 0
                }
            }
        }, (err) => {
      		this.up_busTypeInList = []
            this.paramsTotal2 = 0
      })
    },
    // 查询还款优先级
    chosePriorityBtn() {
      this.businessTypePriorityDialog = true;
    },
    // 替换参数
    replaceParamClick1(e) {
      this.up_intanceFlag = 'balance'
      this.replcaeParam_dialog = true;
      this.replaceParamObj = e[0];
      this.replaceIndex = e[1];
      this.defalutChoseVal = e[0].elementNo;
    //   this.up_replacedList1.push(replaceParamObj)
    },
    // 设置参数
    setParamClick1(e) {
      this.up_intanceFlag = 'balance'
      this.replaceIndex = e[1];
      this.setParam_dialog = true;
      this.setPcdObj = e[0];
      this.setPcdTitle = "查看" + e[0].pcdNo + ": " + e[0].pcdDesc + "参数信息";
    },
      // 替换参数
    replaceParamClick2(e) {
      this.up_intanceFlag = 'busType'
      this.replcaeParam_dialog = true;
      this.replaceParamObj = e[0];
      this.replaceIndex = e[1];
      this.defalutChoseVal = e[0].elementNo;
    //   this.up_replacedList1.push(replaceParamObj)
    },
    // 设置参数
    setParamClick2(e) {
      this.up_intanceFlag = 'busType'
      this.replaceIndex = e[1];
      this.setParam_dialog = true;
      this.setPcdObj = e[0];
      this.setPcdTitle = "查看" + e[0].pcdNo + ": " + e[0].pcdDesc + "参数信息";
    },
    // 参数修改列表 替换参数 设置参数
    up_replaceParamClick1(e) { // 余额对象参数修改列表 替换参数
        this.up_intanceFlag = 'up_balance'
        this.replcaeParam_dialog = true;
        this.replaceParamObj = e[0];
        this.replaceIndex = e[1];
        this.defalutChoseVal = e[0].elementNo;
        console.log(this.replaceParamObj)
    },
    up_setParamClick1(e) { // 余额对象参数修改列表 设置参数
        this.up_intanceFlag = 'up_balance'
        this.replaceIndex = e[1];
        this.setParam_dialog = true;
        this.setPcdObj = e[0];
        this.setPcdTitle = "查看" + e[0].pcdNo + ": " + e[0].pcdDesc + "参数信息"
        console.log(this.setPcdObj)

    },
    handleDel1(e) {
        this.up_upBalanceList.splice(e[1], 1)
    },
    handleDel2(e) {
        this.up_upBusTypeList.splice(e[1], 1)
    },
    up_replaceParamClick2(e) { // 业务类型参数修改列表 替换参数
        this.up_intanceFlag = 'up_busType'
        this.replcaeParam_dialog = true;
        this.replaceParamObj = e[0];
        this.replaceIndex = e[1];
        this.defalutChoseVal = e[0].elementNo;
    },
    up_setParamClick2(e) { // 业务类型参数修改列表 设置参数
        this.up_intanceFlag = 'up_busType'
        this.replaceIndex = e[1];
        this.setParam_dialog = true;
        this.setPcdObj = e[0];
        this.setPcdTitle = "查看" + e[0].pcdNo + ": " + e[0].pcdDesc + "参数信息"
    },
    //  确定替换参数
    sureReplaceData() {
      //  修改 实例化
        if (this.up_intanceFlag == 'balance') {
            this.$set( this.up_balanceInList[this.replaceIndex],  "elementNo",this.choosedVal.split("_")[0]);
            this.$set( this.up_balanceInList[this.replaceIndex], "elementDesc", this.choosedVal.split("_")[1]);  
            if(this.up_upBalanceList.length > 0) {
                let isExist = false
                for(let p = 0; p < this.up_upBalanceList.length; p++) {
                    if ( this.up_upBalanceList[p].artifactNo == this.up_balanceInList[this.replaceIndex].artifactNo && 
                    this.up_upBalanceList[p].elementNo == this.up_balanceInList[this.replaceIndex].elementNo && 
                    this.up_upBalanceList[p].instanCode1 == this.up_balanceInList[this.replaceIndex].instanCode1 && 
                    this.up_upBalanceList[p].instanCode2 == this.up_balanceInList[this.replaceIndex].instanCode2 && 
                    this.up_upBalanceList[p].instanCode3 == this.up_balanceInList[this.replaceIndex].instanCode3 && 
                    this.up_upBalanceList[p].instanCode4 == this.up_balanceInList[this.replaceIndex].instanCode4 && 
                    this.up_upBalanceList[p].instanCode5 == this.up_balanceInList[this.replaceIndex].instanCode5 ) {
                        this.up_upBalanceList.splice(p ,1)
                        this.up_upBalanceList.push(this.up_balanceInList[this.replaceIndex])
                        isExist = true
                    }else {
                        isExist = false						//是否存在
                    }
                }
                if(!isExist) {
                    this.up_upBalanceList.push(this.up_balanceInList[this.replaceIndex])
                }
            } else {
                this.up_upBalanceList.push(this.up_balanceInList[this.replaceIndex])
            }
            console.log(this.up_upBalanceList)
            this.up_upBalanceList.forEach(item => {
                item.concat = item.instanCode1 + ' ' +item.instanDesc1
            })
            // this.up_upBalanceList.push(this.up_balanceInList[this.replaceIndex])
        } else if (this.up_intanceFlag == 'busType') {
            this.$set( this.up_busTypeInList[this.replaceIndex],  "elementNo",this.choosedVal.split("_")[0]);
            this.$set( this.up_busTypeInList[this.replaceIndex], "elementDesc", this.choosedVal.split("_")[1]);  
            
            if(this.up_upBusTypeList.length > 0) {
                let isExist = false
                for(let p = 0; p < this.up_upBusTypeList.length; p++) {
                    if ( this.up_upBusTypeList[p].artifactNo == this.up_busTypeInList[this.replaceIndex].artifactNo && 
                    this.up_upBusTypeList[p].elementNo == this.up_busTypeInList[this.replaceIndex].elementNo && 
                    this.up_upBusTypeList[p].instanCode1 == this.up_busTypeInList[this.replaceIndex].instanCode1 && 
                    this.up_upBusTypeList[p].instanCode2 == this.up_busTypeInList[this.replaceIndex].instanCode2 && 
                    this.up_upBusTypeList[p].instanCode3 == this.up_busTypeInList[this.replaceIndex].instanCode3 && 
                    this.up_upBusTypeList[p].instanCode4 == this.up_busTypeInList[this.replaceIndex].instanCode4 && 
                    this.up_upBusTypeList[p].instanCode5 == this.up_busTypeInList[this.replaceIndex].instanCode5 ) {
                        this.up_upBusTypeList.splice(p ,1)
                        this.up_upBusTypeList.push(this.up_busTypeInList[this.replaceIndex])
                        isExist = true
                    }else {
                        isExist = false						//是否存在
                    }
                }
                if(!isExist) {
                    this.up_upBusTypeList.push(this.up_busTypeInList[this.replaceIndex])
                }
            } else {
                this.up_upBusTypeList.push(this.up_busTypeInList[this.replaceIndex])
            }
            // this.up_upBusTypeList.push(this.up_busTypeInList[this.replaceIndex])
        } else if (this.up_intanceFlag == 'up_balance') { // 余额对象参数修改列表
            this.$set( this.up_upBalanceList[this.replaceIndex],  "elementNo",this.choosedVal.split("_")[0]);
            this.$set( this.up_upBalanceList[this.replaceIndex], "elementDesc", this.choosedVal.split("_")[1]); 
        } else if (this.up_intanceFlag == 'up_busType') { // 业务类型参数修改列表
            // this.$set( this.up_upBusTypeList[this.replaceIndex], "elementDesc", this.replaceParamObj.elementDesc);  
            this.$set( this.up_upBusTypeList[this.replaceIndex],  "elementNo",this.choosedVal.split("_")[0]);
            this.$set( this.up_upBusTypeList[this.replaceIndex], "elementDesc", this.choosedVal.split("_")[1]); 
        } else if(this.up_intanceFlag == 'add_reBusType') {
            // 新增
            this.$set( this.add_busTypeInList[this.replaceIndex],  "elementNo",this.choosedVal.split("_")[0]);
            this.$set( this.add_busTypeInList[this.replaceIndex], "elementDesc", this.choosedVal.split("_")[1]);  
        }
        this.replcaeParam_dialog = false;
    },
    //  确定设置参
    sureSetData() {
        if (this.up_intanceFlag == 'balance') {
            this.$set( this.up_balanceInList[this.replaceIndex], "pcdInstanList", this.pcdList );
            this.$set(this.up_balanceInList[this.replaceIndex], 'addPcdFlag', '1')
            this.$set(this.up_balanceInList, this.replaceIndex, this.setPcdObj)
            if(this.up_upBalanceList.length > 0) {
                let isExist = false
                for(let p = 0; p < this.up_upBalanceList.length; p++) {
                    if ( this.up_upBalanceList[p].artifactNo == this.up_balanceInList[this.replaceIndex].artifactNo && 
                    this.up_upBalanceList[p].elementNo == this.up_balanceInList[this.replaceIndex].elementNo && 
                    this.up_upBalanceList[p].instanCode1 == this.up_balanceInList[this.replaceIndex].instanCode1 && 
                    this.up_upBalanceList[p].instanCode2 == this.up_balanceInList[this.replaceIndex].instanCode2 && 
                    this.up_upBalanceList[p].instanCode3 == this.up_balanceInList[this.replaceIndex].instanCode3 && 
                    this.up_upBalanceList[p].instanCode4 == this.up_balanceInList[this.replaceIndex].instanCode4 && 
                    this.up_upBalanceList[p].instanCode5 == this.up_balanceInList[this.replaceIndex].instanCode5 ) {
                        this.up_upBalanceList.splice(p ,1)
                        this.up_upBalanceList.push(this.up_balanceInList[this.replaceIndex])
                        isExist = true
                    }else {
                        isExist = false						//是否存在
                    }
                }
                if(!isExist) {
                    this.up_upBalanceList.push(this.up_balanceInList[this.replaceIndex])
                }
            } else {
                this.up_upBalanceList.push(this.up_balanceInList[this.replaceIndex])
            }
            console.log(this.up_upBalanceList)
            this.up_upBalanceList.forEach(item => {
                item.concat = item.instanCode1 + ' ' +item.instanDesc1
            })
        } else if (this.up_intanceFlag == 'busType') {
            this.$set( this.up_busTypeInList[this.replaceIndex], "pcdInstanList", this.pcdList );
            this.$set(this.up_busTypeInList[this.replaceIndex], 'addPcdFlag', '1')
            this.$set(this.up_busTypeInList, this.replaceIndex, this.setPcdObj)
            if(this.up_upBusTypeList.length > 0) {
                let isExist = false
                for(let p = 0; p < this.up_upBusTypeList.length; p++) {
                    if ( this.up_upBusTypeList[p].artifactNo == this.up_busTypeInList[this.replaceIndex].artifactNo && 
                    this.up_upBusTypeList[p].elementNo == this.up_busTypeInList[this.replaceIndex].elementNo && 
                    this.up_upBusTypeList[p].instanCode1 == this.up_busTypeInList[this.replaceIndex].instanCode1 && 
                    this.up_upBusTypeList[p].instanCode2 == this.up_busTypeInList[this.replaceIndex].instanCode2 && 
                    this.up_upBusTypeList[p].instanCode3 == this.up_busTypeInList[this.replaceIndex].instanCode3 && 
                    this.up_upBusTypeList[p].instanCode4 == this.up_busTypeInList[this.replaceIndex].instanCode4 && 
                    this.up_upBusTypeList[p].instanCode5 == this.up_busTypeInList[this.replaceIndex].instanCode5 ) {
                        this.up_upBusTypeList.splice(p ,1)
                        this.up_upBusTypeList.push(this.up_busTypeInList[this.replaceIndex])
                        isExist = true
                    }else {
                        isExist = false						//是否存在
                    }
                }
                if(!isExist) {
                    this.up_upBusTypeList.push(this.up_busTypeInList[this.replaceIndex])
                }
            } else {
                this.up_upBusTypeList.push(this.up_busTypeInList[this.replaceIndex])
            }
        } else if (this.up_intanceFlag == 'up_balance') { // 余额对象参数修改列表
            this.$set( this.up_upBalanceList[this.replaceIndex], "pcdInstanList", this.pcdList );
            this.$set( this.up_upBalanceList[this.replaceIndex], "addPcdFlag", '1' );
            this.$set(this.up_upBalanceList, this.replaceIndex, this.setPcdObj);
        } else if (this.up_intanceFlag == 'up_busType') { // 业务类型参数修改列表
            console.log(this.setPcdObj)
            this.$set( this.up_upBusTypeList[this.replaceIndex], "pcdInstanList", this.pcdList );
            this.$set( this.up_upBusTypeList[this.replaceIndex], "addPcdFlag", '1' );
            this.$set(this.up_upBusTypeList, this.replaceIndex, this.setPcdObj);
        } else if (this.up_intanceFlag == 'add_setBusType') { // 
            // 新增 中 业务类型实例化 设置参数
            this.$set( this.add_busTypeInList[this.replaceIndex], "pcdList", this.pcdList );
            this.$set( this.add_busTypeInList[this.replaceIndex], "addPcdFlag", '1' );
            this.$set(this.add_busTypeInList, this.replaceIndex, this.setPcdObj);
        }
        this.setParam_dialog = false;
    },
    childBySetVal(val) {
      this.pcdList = val;
    },                          
    childByDeletPcd(val) {
      this.delePcdList = val;
    },
    childByElementVal(val) {
      this.choosedVal = val;
    },
    childByDeletPcd(val) {
      this.delePcdList = val;
    },
    
    // 左侧被选中
    up_handleAddComponent(value, direction, movedKeys) {
        // console.log(value, direction, movedKeys)
        this.up_transIdList = value
    },
    // 右侧呗选中
    up_rightCheckedChange(val) {
        this.rightCheckedTransId = val
    },

    // 过滤
    filterMethod(query, item) {
        // console.log(item)
        return item.transIdentifiNo.indexOf(query) > -1;
    },
    // 右侧数据
    getRightBusData(row){
        const rightData = []
        let obj = {
            operationMode: row.operationMode,
            businessTypeCode: row.businessTypeCode
        }
        this.post('/beta/betaService/COS.IQ.02.0052', obj ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData &&  res.returnData.rows &&  res.returnData.rows.length > 0) {
                        res.returnData.rows.forEach(rightItem => {
                        rightItem.label = rightItem.transIdentifiNo+' '+rightItem.transIdentifiDesc
                        rightItem.key = rightItem.transIdentifiNo
                        rightData.push(rightItem.transIdentifiNo)
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
        this.post('/beta/betaService/COS.IQ.02.0044', {operationMode: row.operationMode} ,(res) => {
            this.up_transIInitData = res.returnData.rows
            res.returnData.rows.forEach(item => {
                item.label = item.transIdentifiNo+' '+item.transIdentifiDesc
                item.key = item.transIdentifiNo
                componentData.push(item)
            })
            let isrep
            for ( let m = 0 ; m < componentData.length; m++) {
                isrep = false
                for (let n = 0 ; n < this.up_transIdList.length; n++) {
                    if (arr[n] == componentData[m].transIdentifiNo) {
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
    // 新增 左侧所有数据
    getLeftAllData(params) {
        let componentData = [] // 相当于data
        let leftBusData = []
        this.post('/beta/betaService/COS.IQ.02.0044', params ,(res) => {
            this.up_transIInitData = res.returnData.rows
            this.add_transIdInitData = res.returnData.rows
            res.returnData.rows.forEach(item => {
                item.label = item.transIdentifiNo+' '+item.transIdentifiDesc
                item.key = item.transIdentifiNo
                componentData.push(item)
            })
        })
        return componentData
    },

    //新增 下一步
    add_nextToPart2Btn() {
        this.$refs["dataFormAdd"].validate(valid => {
            if (valid) {
                this.isReadonly1 = true
                this.isDisabled1 = true
                this.add_part1 = true
                this.add_part1Btn = false
                this.add_part2 = true
                this.add_part2Btn = true
                this.add_part3 = false
                this.add_part3Btn = false
                // 选择交易识别代码
                let obj = {
                    operationMode: this.tempAdd.operationMode
                }
                this.add_leftData = this.getLeftAllData(obj)
            }
        })
        
    },
    // 新增 返回第一步
    add_backToPart1Btn() {
        this.isReadonly1 = false
        this.isDisabled1 = false
        this.add_part1 = true
        this.add_part1Btn = true
        this.add_part2 = false
        this.add_part2Btn = false
        this.add_part3 = false
        this.add_part3Btn = false
    },
    add_nextToPart3Btn() {
        if (!this.tempAdd.defaultTransIdentifiNo) {
            this.$message({
                message: '请关联交易识别代码',
                type: 'warning'
            })
            return
        }
        this.add_part1 = false
        this.add_part1Btn = false
        this.add_part2 = false
        this.add_part2Btn = false
        this.add_part3 = true
        this.add_part3Btn = true
        this.tempAdd2.businessTypeCode = 'MODT'+ this.tempAdd.businessTypeCodeHalf
        this.tempAdd2.businessDesc = this.tempAdd.businessDesc
        this.getBusTypeIntanList()
        this.add_transIdList.forEach(item => {
            this.add_transIdInitData.forEach(inititem => {
                if(item == item1.transIdentifiNo) {
                    this.selTransIdNoList.push(inititem)
                }
            })
        })
    },
    add_backToPart2Btn() {
        this.isReadonly1 = true
        this.isDisabled1 = true
        this.add_part1 = true
        this.add_part1Btn = false
        this.add_part2 = true
        this.add_part2Btn = true
        this.add_part3 = false
        this.add_part3Btn = false
    },
    // 右侧呗选中
    add_rightCheckedChange(val) {
        this.rightCheckedItems = val
    },
    // 设置默认识别代码
    add_setDefaultTransIdBtn() {
        console.log(this.rightCheckedItems)
        if (this.rightCheckedItems.length != 1) {
            this.$message({
                message: '请关联交易识别代码',
                type: 'warning'
            })
            return
        } 
        let str = this.rightCheckedItems[0]
        this.$set(this.tempAdd, 'defaultTransIdentifiNo',str)
    },

    getBusTypeIntanList() {
        let params = {
            instanDimen1: 'MODT',
            instanCode: this.tempAdd2.businessTypeCode
        }
        this.post('/beta/betaService/COS.IQ.02.0042', params ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows &&  res.returnData.rows.length > 0) {
                    this.add_busTypeInList = res.returnData.rows
                }
            }
        })
    },
    
    // 替换参数
    add_replaceParamClick(e) {
        this.up_intanceFlag = 'add_reBusType'
        this.replcaeParam_dialog = true;
        this.replaceParamObj = e[0];
        this.replaceIndex = e[1];
        this.defalutChoseVal = e[0].elementNo;
    },
    // 设置参数
    add_setParamClick(e) {
        this.up_intanceFlag= 'add_setBusType'
        this.replaceIndex = e[1];
        this.setParam_dialog = true;
        this.setPcdObj = e[0];
        this.setPcdTitle = "设置" + e[0].pcdNo + ": " + e[0].pcdDesc + "参数信息";
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
</style>

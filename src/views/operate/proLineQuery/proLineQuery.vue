<!-- 业务项目 -->
<template>
    <div class="allContent">
        <!-- 表单验证demo: -->
        <el-form
            ref="queryFormRef"
            :model="queryFormObj"
            :rules="queryFormRules"
        >
            <el-form-item class="cl_td" label="运营模式" prop="operationMode">
                <el-select
                    v-model="queryFormObj.operationMode"
                    class="wd200"
                    clearable
                >
                    <el-option
                        v-for="(item, index) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode"
                    />
                </el-select>
            </el-form-item>
            <el-form-item
                class="cl_td"
                label="业务项目代码"
                prop="businessProgramNo"
            >
                <el-input
                    v-model="queryFormObj.businessProgramNo"
                    class="wd200"
                    type="text"
                />
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button
                    size="medium"
                    icon="el-icon-search"
                    type="primary"
                    @click="handleSearch"
                    v-show="selBtnFlag"
                    >查询</el-button
                >
                <el-button
                    size="medium"
                    icon="el-icon-plus"
                    type="primary"
                    @click="handleCreate"
                    v-show="addBtnFlag"
                    >新增</el-button
                >
            </div>
        </el-form>
        <el-table
            v-loading="listLoading1"
            :data="tableList"
            class="mbtm20"
            fit
            highlight-current-row
            style="width: 100%"
            border
        >
            <el-table-column
                prop="operationMode"
                label="运营模式"
                align="center"
            />
            <el-table-column
                prop="businessProgramNo"
                label="业务项目代码"
                align="center"
            />
            <el-table-column
                prop="programDesc"
                label="业务项目描述"
                align="center"
            />
            <el-table-column
                prop="defaultBusinessType"
                label="默认业务类型"
                align="center"
            />
            <el-table-column
                prop="paymentPriority"
                label="还款优先级"
                align="center"
            />
            <el-table-column prop="" label="操作" align="center" width="350">
                <template slot-scope="{ row }">
                    <el-button
                        size="mini"
                        icon="el-icon-more"
                        type="primary"
                        @click="handleDetail(row)"
                        v-show="selBtnFlag"
                        >详情</el-button
                    >
                    <el-button
                        size="mini"
                        icon="el-icon-edit"
                        type="primary"
                        @click="handleUpGetList(row)"
                        v-show="updBtnFlag"
                        >修改</el-button
                    >
                </template>
            </el-table-column>
        </el-table>
        <pagination
            v-show="tableTotal > 0"
            :total="tableTotal"
            :page.sync="queryFormObj.pageNum"
            :limit.sync="queryFormObj.pageSize"
            @pagination="getList"
        />

        <!-- 查询还款优先级 -->
        <el-dialog
            title="查询业务项目还款优先级"
            :visible.sync="viewPayPriorityDialog"
            width="65%"
        >
            <view-pay-priority></view-pay-priority>

            <!-- <common-table :tableData="tableData" :config="config" :tableLabel="tableLabel" @changePage="getPayPriority"></common-table> -->

            <div slot="footer" class="dialog-footer">
                <el-button
                    type="primary"
                    @click="viewPayPriorityDialog = false"
                >
                    关闭
                </el-button>
            </div>
        </el-dialog>

        <!-- 查询交易识别码 -->
        <el-dialog
            title="查询交易识别码"
            :visible.sync="viewTranIdDialog"
            width="65%"
        >
            <common-table
                :tableData="tableData"
                :config="config"
                :tableLabel="tableLabel"
                @changePage="getTransIdList"
            ></common-table>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="viewTranIdDialog = false">
                    关闭
                </el-button>
            </div>
        </el-dialog>

        <!-- 查询余额对象实例化 -->
        <el-dialog
            title="查询余额对象实例化"
            :visible.sync="viewBalIntDialog"
            width="65%"
        >
            <div v-show="balaInt_part1">
                <el-table
                    :data="balanctInList"
                    class="mbtm20"
                    fit
                    highlight-current-row
                    style="width: 100%"
                    border
                >
                    <el-table-column
                        prop="operationMode"
                        label="运营模式"
                        align="center"
                    />
                    <el-table-column
                        prop="businessTypeCode"
                        label="业务类型代码"
                        align="center"
                    />
                    <el-table-column
                        prop="businessDesc"
                        label="描述"
                        align="center"
                    />
                    <el-table-column
                        prop="businessForm"
                        label="业务形态"
                        align="center"
                    />
                    <el-table-column
                        prop="businessDebitCreditCodeDesc"
                        label="业务性质"
                        align="center"
                    />
                    <el-table-column
                        prop=""
                        label="操作"
                        align="center"
                        width="350"
                    >
                        <template slot-scope="{ row }">
                            <el-button
                                size="mini"
                                icon="el-icon-set"
                                type="primary"
                                @click="banlIn_handleSetParam(row)"
                                >配置参数</el-button
                            >
                        </template>
                    </el-table-column>
                </el-table>
                <!-- <pagination
          v-show="balanctInTotal > 0"
          :total="balanctInTotal"
          :page.sync="queryBalanceInFormObj.pageNum"
          :limit.sync="queryBalanceInFormObj.pageSize"
          @pagination="getBalanceInList"
        /> -->
            </div>
            <!-- 余额对象配置参数 -->
            <div v-show="balaInt_part2">
                <el-form :model="balanceInsObj">
                    <el-form-item
                        class="cl_td"
                        label="余额对象代码"
                        prop="balanceObjectCode"
                    >
                        <el-input
                            v-model="balanceInsObj.balanceObjectCode"
                            class="wd200"
                            type="text"
                        />
                    </el-form-item>
                    <el-form-item
                        class="cl_td"
                        label="余额对象描述"
                        prop="objectDesc"
                    >
                        <el-input
                            v-model="balanceInsObj.objectDesc"
                            class="wd200"
                            type="text"
                        />
                    </el-form-item>
                </el-form>
                <set-param-option
                    :colunm3="balanceIns__colunm3"
                    :textTitle="textTitle2"
                    :list="add_balanInList"
                    @replaceParamClick="replaceParamClick(arguments)"
                    @setParamClick="setParamClick(arguments)"
                ></set-param-option>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="viewBalIntDialog = false"> 关闭 </el-button>
                <el-button type="primary" @click="surePZPatam">
                    确定
                </el-button>
            </div>
        </el-dialog>

        <!-- 查看收费项目实例 -->
        <el-dialog
            title="收费项目实例"
            :visible.sync="viewFeeItemDialog"
            width="85%"
        >
            <pay-item-base-info
                :formObj="feeItemIntan_obj1"
                :choseBtnFlag1="choseBtnFlag1"
                :choseBtnFlag2="choseBtnFlag2"
                :choseBtnFlag3="choseBtnFlag3"
                :choseBtnFlag4="choseBtnFlag4"
                :choseBtnFlag5="choseBtnFlag5"
            ></pay-item-base-info>
            <cost-matrix-info :formObj="feeItemIntan_obj2"></cost-matrix-info>
            <div slot="footer" class="dialog-footer">
                <el-button @click="viewFeeItemDialog = false"> 关闭 </el-button>
                <el-button type="primary" @click="sureFeeItemIntanData()">
                    确定
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
        <el-dialog
            :title="setPcdTitle"
            :visible.sync="setParam_dialog"
            width="65%"
        >
            <set-pcd
                :setPcdObj="setPcdObj"
                :setIndex="replaceIndex"
                @childBySetVal="childBySetVal"
                @childByDeletPcd="childByDeletPcd"
            ></set-pcd>
            <div slot="footer" class="dialog-footer">
                <el-button @click="setParam_dialog = false"> 关闭 </el-button>
                <el-button type="primary" @click="sureSetData()">
                    确定
                </el-button>
            </div>
        </el-dialog>

        <!-- 详情 查看pcd参数 弹窗-->
        <el-dialog
            :title="viewPcdTitle"
            :visible.sync="viewPcd_dialog"
            width="65%"
        >
            <view-pcd :viewPcdFormObj="viewPcdFormObj"></view-pcd>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="viewPcd_dialog = false">
                    关闭
                </el-button>
            </div>
        </el-dialog>

        <!-- 详情 余额对象参数选项 -->
        <el-dialog
            title="余额对象实例化"
            :visible.sync="banlance_viewParam_dialog"
            width="65%"
        >
            <some-param-option
                v-if="table8List"
                :colunm1="colunm1"
                :labelStr="labelStr"
                :textTitle="textTitle8"
                :list="table8List"
                @viewParamClick="hadleViewParam"
            >
            </some-param-option>
            <pagination
                v-show="table8Total > 0"
                :total="table8Total"
                :page.sync="table8FormObj.pageNum"
                :limit.sync="table8FormObj.pageSize"
                @pagination="getList8(banlanceInsRow)"
            />
            <div slot="footer" class="dialog-footer">
                <el-button
                    type="primary"
                    @click="banlance_viewParam_dialog = false"
                >
                    关闭
                </el-button>
            </div>
        </el-dialog>

        <!-- 新增 -->
        <el-dialog
            title="业务项目新增"
            :visible.sync="dialogFormVisibleAdd"
            width="65%"
        >
            <el-form
                ref="refAdd"
                :rules="rulesAdd"
                :model="tempAdd"
                v-show="addBusPro_part1"
            >
                <el-form-item
                    class="cl_td"
                    label="运营模式"
                    prop="operationMode"
                    :rules="[{ required: true, message: '运营模式不能为空' }]"
                >
                    <el-select
                        v-model="tempAdd.operationMode"
                        class="wd200"
                        clearable
                        :disabled="isDisabled1"
                    >
                        <el-option
                            v-for="(item, index) in operationModeOptions"
                            :key="index"
                            :label="item.modeName"
                            :value="item.operationMode"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="业务项目代码"
                    prop="businessProgramNoHalf"
                    :rules="[
                        { required: true, message: '业务项目代码不能为空' },
                        { max: 5, min: 5, message: '长度为 5 个字符' },
                        { validator: this.validNumber },
                    ]"
                >
                    MODG
                    <el-input
                        v-model="tempAdd.businessProgramNoHalf"
                        class="wd150"
                        type="text"
                        :readonly="isReadonly1"
                    />
                </el-form-item>

                <el-form-item
                    class="cl_td"
                    label="业务项目描述"
                    prop="programDesc"
                    :rules="[
                        { required: true, message: '业务项目描述不能为空' },
                    ]"
                >
                    <el-input
                        v-model="tempAdd.programDesc"
                        class="wd200"
                        type="text"
                        :readonly="isReadonly1"
                    />
                </el-form-item>

                <el-form-item
                    class="cl_td"
                    label="默认业务类型"
                    prop="defaultBusinessType"
                >
                    <el-input
                        v-model="tempAdd.defaultBusinessType"
                        class="wd200"
                        type="text"
                        :readonly="isReadonly1"
                    />
                </el-form-item>

                <el-form-item
                    class="cl_td"
                    label="还款优先级"
                    prop="paymentPriority"
                >
                    <el-input
                        v-model="tempAdd.paymentPriority"
                        class="wd120"
                        type="text"
                        :readonly="isReadonly1"
                    />
                    <div class="search_button">
                        <el-button
                            size="small"
                            icon="el-icon-search"
                            type="primary"
                            @click="chosePriorityBtn()"
                        >
                            查询
                        </el-button>
                    </div>
                </el-form-item>

                <el-form-item
                    class="cl_td"
                    label="承责属性"
                    prop="responseType"
                >
                    <el-select
                        v-model="tempAdd.responseType"
                        class="wd200"
                        clearable
                        :disabled="isDisabled1"
                    >
                        <el-option
                            v-for="(item, index) in responseTypeOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>

                <el-form-item
                    class="cl_td"
                    label="项目类型"
                    prop="programType"
                    :rules="[{ required: true, message: '项目类型不能为空' }]"
                >
                    <el-select
                        v-model="tempAdd.programType"
                        class="wd200"
                        clearable
                        :disabled="isDisabled1"
                    >
                        <el-option
                            v-for="(item, index) in programTypeOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>

                <div
                    class="cl_tr text_center mtop20"
                    v-show="addBusPro_part1Btn"
                >
                    <el-button
                        size="small"
                        icon="el-icon-arrow-down"
                        type="primary"
                        @click="addBusPro_nextToPart2BTn()"
                    >
                        下一步
                    </el-button>
                </div>
            </el-form>

            <div v-show="addBusPro_part2">
                <div class="text_title padLf10">选择业务类型</div>
                <div style="margin-left: 12%">
                    <el-transfer
                        filterable
                        :filter-method="add_filterMethod"
                        :titles="['可选择业务类型', '已选择业务类型']"
                        filter-placeholder="请输入业务项目"
                        v-model="add_busTypeList"
                        @change="add_handleAddComponent"
                        @right-check-change="add_rightCheckedChange"
                        :data="add_allBusTypeData"
                    >
                    </el-transfer>
                </div>
                <div
                    class="cl_tr text_center mtop20"
                    v-show="addBusPro_part2Btn"
                >
                    <el-button
                        size="small"
                        icon="el-icon-arrow-up"
                        type="primary"
                        @click="addBusPro_backPar1Btn()"
                    >
                        上一步
                    </el-button>
                    <el-button
                        size="small"
                        icon="el-icon-search"
                        type="primary"
                        @click="viewTransIdBtn()"
                    >
                        查看交易识别码
                    </el-button>
                    <el-button
                        size="small"
                        icon="el-icon-setting"
                        type="primary"
                        @click="setBusTypeBtn()"
                    >
                        设置默认业务类型
                    </el-button>
                    <el-button
                        size="small"
                        icon="el-icon-arrow-down"
                        type="primary"
                        @click="addBusPro_nextToPart3Btn()"
                    >
                        下一步
                    </el-button>
                </div>
            </div>

            <div v-show="addBusPro_part3">
                <div class="text_title padLf10">选择余额对象</div>
                <div style="margin-left: 12%">
                    <el-transfer
                        filterable
                        :filter-method="add_filterMethodBalance"
                        :titles="['可选择余额对象', '已选择余额对象']"
                        filter-placeholder="请输入余额对象"
                        v-model="add_balanceList"
                        @change="add_balanceHandleComponent"
                        @right-check-change="add_balanceRightCheckedChange"
                        @left-check-change="add_balanceLeftCheckedChange"
                        :data="add_allBalanceData"
                    >
                    </el-transfer>
                </div>
                <div
                    class="cl_tr text_center mtop20"
                    v-show="addBusPro_part3Btn"
                >
                    <el-button
                        size="small"
                        icon="el-icon-arrow-up"
                        type="primary"
                        @click="addBusPro_backPar2Btn()"
                    >
                        上一步
                    </el-button>
                    <el-button
                        size="small"
                        icon="el-icon-arrow-down"
                        type="primary"
                        @click="add_viewBalIntaBtn()"
                    >
                        查看余额对象实例化
                    </el-button>
                    <el-button
                        size="small"
                        icon="el-icon-arrow-down"
                        type="primary"
                        @click="addBusPro_nextToPart4Btn()"
                    >
                        下一步
                    </el-button>
                </div>
            </div>

            <div v-show="addBusPro_part4">
                <div class="text_title padLf10">选择收费项目</div>
                <div style="margin-left: 12%">
                    <el-transfer
                        filterable
                        :filter-method="add_feeItemFilterMethod"
                        :titles="['可选择收费项目', '已选择收费项目']"
                        filter-placeholder="请输入收费项目"
                        v-model="add_feeItemList"
                        @change="add_feeItemHandleAddComponent"
                        @right-check-change="add_feeItemRightCheckedChange"
                        :data="add_allFeeItemData"
                    >
                    </el-transfer>
                </div>
                <div
                    class="cl_tr text_center mtop20"
                    v-show="addBusPro_part4Btn"
                >
                    <el-button
                        size="small"
                        icon="el-icon-arrow-up"
                        type="primary"
                        @click="addBusPro_backPar3Btn()"
                    >
                        上一步
                    </el-button>
                    <el-button
                        size="small"
                        icon="el-icon-arrow-down"
                        type="primary"
                        @click="addBusPro_viewFeeItemBtn()"
                    >
                        查看收费项目实例
                    </el-button>
                    <el-button
                        size="small"
                        icon="el-icon-arrow-down"
                        type="primary"
                        @click="addBusPro_nextToPart5Btn()"
                    >
                        下一步
                    </el-button>
                </div>
            </div>

            <div v-show="addBusPro_part5">
                <div class="text_title">业务项目实例化</div>
                <el-form v-model="add_busItemIncObj">
                    <el-form-item
                        class="cl_td"
                        label="业务项目代码"
                        prop="businessProgramNo"
                    >
                        <el-input
                            v-model="add_busItemIncObj.businessProgramNo"
                            class="wd200"
                            type="text"
                            :readonly="isReadonly1"
                        />
                    </el-form-item>
                    <el-form-item
                        class="cl_td"
                        label="业务项目描述"
                        prop="programDesc"
                    >
                        <el-input
                            v-model="add_busItemIncObj.programDesc"
                            class="wd200"
                            type="text"
                            :readonly="isReadonly1"
                        />
                    </el-form-item>
                </el-form>
                <set-param-option
                    :colunm3="colunm3"
                    :textTitle="textTitle1"
                    :list="add_busItemInList"
                    @replaceParamClick="replaceParamClick(arguments)"
                    @setParamClick="setParamClick(arguments)"
                ></set-param-option>

                <div
                    class="cl_tr text_center mtop20"
                    v-show="addBusPro_part5Btn"
                >
                    <el-button
                        size="small"
                        icon="el-icon-arrow-up"
                        type="primary"
                        @click="addBusPro_backPar4Btn()"
                    >
                        上一步
                    </el-button>
                    <el-button
                        size="small"
                        icon="el-icon-plus"
                        type="primary"
                        @click="addBusPro_saveBtn()"
                    >
                        保存
                    </el-button>
                </div>
            </div>

            <div v-show="addBusPro_part6">
                <div class="text_title">业务项目额度映射</div>
                <el-table
                :data="detail_quota1"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%"
                border

            >
                <el-table-column
                    prop="operationMode"
                    label="运营模式"
                    align="center"
                />
                <el-table-column
                    prop="businessProgramNo"
                    label="业务项目代码"
                    align="center"
                />
                <el-table-column
                    prop="transIdentifiNo"
                    label="交易识别代码"
                    align="center"
                />
                <el-table-column
                    prop="creditNodeNo"
                    label="额度节点"
                    align="center"
                />
                <el-table-column prop="" label="操作" align="center" width="350">
                <template slot-scope="{ row }">
                    <el-button
                        size="mini"
                        icon="el-icon-edit"
                        type="primary"
                        @click="handleUpdateQuota(row)"
                        >修改</el-button
                    >
                </template>
            </el-table-column>
            </el-table>
            <pagination
                v-show="quota_tableTotal1 > 0"
                :total="quota_tableTotal1"
                :page.sync="quota_query1.pageNum"
                :limit.sync="quota_query1.pageSize"
                @pagination="detail_getQquota1"
            />
            </div>

            <div slot="footer" class="dialog-footer">
                <el-button @click="createData()">
                    取消
                </el-button>
                <el-button type="primary" @click="createData()">
                    确定
                </el-button>
            </div>
        </el-dialog>

        <!-- 详情 -->
        <el-dialog
            title="业务项目详情"
            :visible.sync="dialogFormVisibleDetail"
            width="65%"
        >
            <el-form ref="refDetail" :rules="rulesDetail" :model="tempDetail">
                <el-form-item
                    class="cl_td"
                    label="运营模式"
                    prop="operationMode"
                >
                    <el-select
                        v-model="tempDetail.operationMode"
                        class="wd200"
                        clearable
                        :disabled="isDisabled1"
                    >
                        <el-option
                            v-for="(item, index) in operationModeOptions"
                            :key="index"
                            :label="item.modeName"
                            :value="item.operationMode"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="业务项目代码"
                    prop="businessProgramNo"
                >
                    <el-input
                        v-model="tempDetail.businessProgramNo"
                        class="wd200"
                        type="text"
                        :readonly="isReadonly1"
                    />
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="业务项目描述"
                    prop="programDesc"
                >
                    <el-input
                        v-model="tempDetail.programDesc"
                        class="wd200"
                        type="text"
                        :readonly="isReadonly1"
                    />
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="默认业务类型"
                    prop="defaultBusinessType"
                >
                    <el-input
                        v-model="tempDetail.defaultBusinessType"
                        class="wd200"
                        type="text"
                        :readonly="isReadonly1"
                    />
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="还款优先级"
                    prop="paymentPriority"
                >
                    <el-input
                        v-model="tempDetail.paymentPriority"
                        class="wd200"
                        type="text"
                        :readonly="isReadonly1"
                    />
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="承责属性"
                    prop="responseType"
                >
                    <el-select
                        v-model="tempDetail.responseType"
                        class="wd200"
                        clearable
                        :disabled="isDisabled1"
                    >
                        <el-option
                            v-for="(item, index) in responseTypeOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="项目类型" prop="programType">
                    <el-select
                        v-model="tempDetail.programType"
                        class="wd200"
                        clearable
                        :disabled="isDisabled1"
                    >
                        <el-option
                            v-for="(item, index) in programTypeOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
            </el-form>

            <div class="text_title padLf10">已选业务类型</div>
            <el-table
                :data="detail_tableList1"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%"
                border
            >
                <el-table-column
                    prop="operationMode"
                    label="运营模式"
                    align="center"
                />
                <el-table-column
                    prop="businessTypeCode"
                    label="业务类型代码"
                    align="center"
                />
                <el-table-column
                    prop="businessDesc"
                    label="业务类型描述"
                    align="center"
                />
            </el-table>
            <pagination
                v-show="detail_tableTotal1 > 0"
                :total="detail_tableTotal1"
                :page.sync="detail_queryFormObj1.pageNum"
                :limit.sync="detail_queryFormObj1.pageSize"
                @pagination="detail_getList1"
            />

            <div class="text_title">已选余额对象</div>
            <el-table
                :data="detail_tableList2"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%"
                border
            >
                <el-table-column
                    prop="operationMode"
                    label="运营模式"
                    align="center"
                />
                <el-table-column
                    prop="balanceObjectCode"
                    label="余额对象代码"
                    align="center"
                />
                <el-table-column
                    prop="objectDesc"
                    label="余额对象描述"
                    align="center"
                />
                <el-table-column
                    prop=""
                    label="操作"
                    align="center"
                    width="350"
                >
                    <template slot-scope="{ row }">
                        <el-button
                            size="mini"
                            type="primary"
                            @click="detail_balanceViewParam(row)"
                            >查看参数</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
            <pagination
                v-show="detail_tableTotal2 > 0"
                :total="detail_tableTotal2"
                :page.sync="detail_queryFormObj2.pageNum"
                :limit.sync="detail_queryFormObj2.pageSize"
                @pagination="detail_getList2"
            />

            <div class="text_title">业务项目收费项目</div>
            <el-table
                :data="detail_tableList3"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%"
                border
            >
                <el-table-column
                    prop="feeItemNo"
                    label="收费项目编号"
                    align="center"
                />
                <el-table-column
                    prop="feeDesc"
                    label="费用描述"
                    align="center"
                />
            </el-table>
            <pagination
                v-show="detail_tableTotal3 > 0"
                :total="detail_tableTotal3"
                :page.sync="detail_queryFormObj3.pageNum"
                :limit.sync="detail_queryFormObj3.pageSize"
                @pagination="detail_getList3"
            />

            <some-param-option
                v-if="detail_tableList4"
                :textTitle="textTitle2"
                :list="detail_tableList4"
                @viewParamClick="hadleViewParam"
            ></some-param-option>
            <pagination
                v-show="detail_tableTotal4 > 0"
                :total="detail_tableTotal4"
                :page.sync="detail_queryFormObj4.pageNum"
                :limit.sync="detail_queryFormObj4.pageSize"
                @pagination="detail_getList4"
            />

            <div slot="footer" class="dialog-footer">
                <el-button
                    type="primary"
                    @click="dialogFormVisibleDetail = false"
                >
                    关闭
                </el-button>
            </div>
        </el-dialog>

        <!-- 修改 受影响产品列表 -->
        <el-dialog
            title="受影响产品列表"
            :visible.sync="dialogFormVisibleUpList"
            width="65%"
        >
            <common-table
                :tableData="up_tableData"
                :config="up_config"
                :tableLabel="up_tableLabel"
                @changePage="up_getList"
            ></common-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleUpList = false">
                    取消
                </el-button>
                <el-button type="primary" @click="handleUpdate()">
                    确定
                </el-button>
            </div>
        </el-dialog>

        <!-- 真修改 -->
        <el-dialog
            title="业务项目列表"
            :visible.sync="dialogFormVisibleUp"
            width="65%"
        >
            <el-form ref="refUpdate" :rules="rulesUp" :model="tempUp">
                <el-form-item
                    class="cl_td"
                    label="运营模式"
                    prop="operationMode"
                    :rules="[{ required: true, message: '运营模式不能为空' }]"
                >
                    <el-select
                        v-model="tempUp.operationMode"
                        class="wd200"
                        clearable
                        disabled
                    >
                        <el-option
                            v-for="(item, index) in operationModeOptions"
                            :key="index"
                            :label="item.modeName"
                            :value="item.operationMode"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    class="cl_td red"
                    label="业务项目代码"
                    prop="businessProgramNo"
                >
                    <el-input
                        v-model="tempUp.businessProgramNo"
                        class="wd200"
                        type="text"
                        readonly
                    />
                </el-form-item>

                <el-form-item
                    class="cl_td"
                    label="业务项目描述"
                    prop="programDesc"
                    :rules="[
                        { required: true, message: '业务项目描述不能为空' },
                    ]"
                >
                    <el-input
                        v-model="tempUp.programDesc"
                        class="wd200"
                        type="text"
                    />
                </el-form-item>

                <el-form-item
                    class="cl_td"
                    label="默认业务类型"
                    prop="defaultBusinessType"
                >
                    <el-input
                        v-model="tempUp.defaultBusinessType"
                        class="wd200"
                        type="text"
                        readonly
                    />
                </el-form-item>

                <el-form-item
                    class="cl_td"
                    label="还款优先级"
                    prop="paymentPriority"
                >
                    <el-input
                        v-model="tempUp.paymentPriority"
                        class="wd120"
                        type="text"
                    />
                    <div class="search_button">
                        <el-button
                            size="small"
                            icon="el-icon-search"
                            type="primary"
                            @click="chosePriorityBtn()"
                        >
                            查询
                        </el-button>
                    </div>
                </el-form-item>

                <el-form-item
                    class="cl_td"
                    label="承责属性"
                    prop="responseType"
                >
                    <el-select
                        v-model="tempUp.responseType"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in responseTypeOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>

                <el-form-item
                    class="cl_td"
                    label="项目类型"
                    prop="programType"
                    :rules="[{ required: true, message: '项目类型不能为空' }]"
                >
                    <el-select
                        v-model="tempUp.programType"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in programTypeOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
            </el-form>

            <div class="text_title padLf10">选择业务类型</div>
            <div style="margin-left: 12%">
                <el-transfer
                    filterable
                    :filter-method="up_filterMethod"
                    :titles="['可选择业务类型', '已选择业务类型']"
                    filter-placeholder="请输入业务类型"
                    v-model="up_busTypeList"
                    @change="up_handleAddComponent"
                    @right-check-change="up_rightCheckedChange"
                    :data="up_allBusTypeData"
                >
                </el-transfer>
            </div>
            <div class="cl_tr text_center mtop20">
                <el-button
                    size="small"
                    icon="el-icon-setting"
                    type="primary"
                    @click="setBusTypeBtn_UP()"
                    >设置默认业务类型</el-button
                >
                <el-button size="small" icon="el-icon-plus" type="primary"
                    >新建业务类型</el-button
                >
            </div>

            <div class="text_title padLf10">选择余额对象</div>
            <div style="margin-left: 12%">
                <el-transfer
                    filterable
                    :filter-method="up_filterMethod2"
                    :titles="['可选择余额对象', '已选择余额对象']"
                    filter-placeholder="请输入余额对象"
                    v-model="up_balanceList"
                    @change="up_handleAddComponent2"
                    @right-check-change="up_rightCheckedChange2"
                    @left-check-change="up_balanceLeftCheckedChange"
                    :data="up_allBalanceData"
                >
                </el-transfer>
            </div>
            <div class="cl_tr text_center mtop20">
                <el-button
                    size="small"
                    icon="el-icon-setting"
                    type="primary"
                    @click="up_handleBalaIn()"
                    >查看余额对象实例化</el-button
                >
                <el-button size="small" icon="el-icon-plus" type="primary"
                    >新建余额对象</el-button
                >
            </div>

            <!-- 业务项目参数设置 -->
            <set-param-option
                :colunm3="up_colunm3"
                :textTitle="up_textTitle"
                :list="up_busItemInList"
                @replaceParamClick="replaceParamClick(arguments)"
                @setParamClick="setParamClick(arguments)"
            >
            </set-param-option>

            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleUp = false">
                    取消
                </el-button>
                <el-button type="primary" @click="updateData()">
                    确定
                </el-button>
            </div>
        </el-dialog>
        <!-- 业务项目额度映射 -->
        <el-dialog
            title="业务项目额度映射"
            :visible.sync="proQuotaDialog"
            width="65%"
        >
            <el-table
                :data="detail_quota1"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%"
                border

            >
                <el-table-column
                    prop="operationMode"
                    label="运营模式"
                    align="center"
                />
                <el-table-column
                    prop="businessProgramNo"
                    label="业务项目代码"
                    align="center"
                />
                <el-table-column
                    prop="transIdentifiNo"
                    label="交易识别代码"
                    align="center"
                />
                <el-table-column
                    prop="creditNodeNo"
                    label="额度节点"
                    align="center"
                />
                <el-table-column prop="" label="操作" align="center" width="350">
                <template slot-scope="{ row }">
                    <el-button
                        size="mini"
                        icon="el-icon-edit"
                        type="primary"
                        @click="handleUpdateQuota(row)"
                        >修改</el-button
                    >
                </template>
            </el-table-column>
            </el-table>
            <pagination
                v-show="quota_tableTotal1 > 0"
                :total="quota_tableTotal1"
                :page.sync="quota_query1.pageNum"
                :limit.sync="quota_query1.pageSize"
                @pagination="detail_getQquota1"
            />

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="proQuotaDialog = false">
                    关闭
                </el-button>
            </div>
        </el-dialog>
        <!-- 修改 -->
    <el-dialog title="维护信息" :visible.sync="quotaUp" width="65%">
        <el-form ref="dataFormUp" :rules="rulesQuotaUpTempUp" :model="quotaUpTempUp" >
          <el-form-item class="cl_td" label="运营模式" prop="operationMode" >
              <el-input v-model="quotaUpTempUp.operationMode" class="wd200" type="text" readonly/>
          </el-form-item>
          <el-form-item class="cl_td" label="业务项目" prop="businessProgramNo">
              <el-input v-model="quotaUpTempUp.businessProgramNo" class="wd200" type="text" readonly/>
          </el-form-item>
          <el-form-item class="cl_td" label="交易识别" prop="transIdentifiNo">
              <el-input v-model="quotaUpTempUp.transIdentifiNo" class="wd200" type="text" readonly/>
          </el-form-item>
          <el-form-item class="cl_td" label="额度网编号" prop="creditTreeId" :rules="[ { required: true, message: '额度网编号不能为空'}]">
              <el-select v-model="quotaUpTempUp.creditTreeId" class="wd200" clearable @change="getCreditTree($event)" >
                <el-option
                  v-for="(item, index ) in creditTreeIdList"
                  :key="index"
                  :label="item.creditTreeDesc"
                  :value="item.creditTreeId"
                />
              </el-select>
          </el-form-item>
          <el-form-item class="cl_td" label="额度节点" prop="creditNodeNo" :rules="[ { required: true, message: '额度节点不能为空'}]">
              <el-select v-model="quotaUpTempUp.creditNodeNo" class="wd200" clearable @change="refresh()">
                <el-option
                  v-for="(item, index ) in creditNodeNoList"
                  :key="index"
                  :label="item.creditDesc"
                  :value="item.creditNodeNo"
                />
              </el-select>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="quotaUp = false">
            取消
          </el-button>
          <el-button type="primary" @click="updateCreditNo()">
            确定
          </el-button>
        </div>
      </el-dialog>
    </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import ViewPayPriority from "@/components-ider/ViewPayPriority";
import CommonTable from "@/components-ider/CommonTable";
import SetParamOption from "@/components-ider/SetParamOption";
import ReplaceParam from "@/components-ider/ReplaceParam";
import SetPcd from "@/components-ider/SetPcd";
import PayItemBaseInfo from "@/components-ider/operate/PayItemBaseInfo";
import CostMatrixInfo from "@/components-ider/operate/CostMatrixInfo"; // 费用矩阵信息
import SomeParamOption from "@/components-ider/SomeParamOption"; // 查看参数
import ViewPcd from "@/components-ider/ViewPcd";

import { isNumber } from "@/utils/validate";

export default {
    name: "tableList",
    components: {
        Pagination,
        ViewPayPriority,
        CommonTable,
        SetParamOption,
        ReplaceParam,
        SetPcd,
        PayItemBaseInfo,
        CostMatrixInfo,
        SomeParamOption,
        ViewPcd,
    },
    data() {
        return {
            // 权限
            selBtnFlag: false,
            addBtnFlag: false,
            updBtnFlag: false,
            btnAuthStr: "",

            // 列表
            queryFormObj: {
                pageNum: 1,
                pageSize: 10,
            },
            quota_query1:{
                pageNum: 1,
                pageSize: 10,
            },
            quota_tableTotal1:0,
            listLoading1: false,
            queryFormRef: {},
            queryFormRules: {},
            tableList: [],
            tableTotal: 0,
            businessProgramNoSel: "",
            operationModeSel: "",
            businessProgramNoUP: "",
            operationModeUP: "",
            // 下拉框
            operationModeOptions: [],
            feeBusinessTypeOptions: [],
            responseTypeOptions: [],
            programTypeOptions: [],
            // 增删改查
            tempAdd: {}, // 新增
            tempUp: {}, // 修改
            tempDetail: {}, // 详情
            dialogFormVisibleAdd: false,
            dialogFormVisibleUp: false,
            dialogFormVisibleUpList: false,
            dialogFormVisibleDetail: false,
            rulesAdd: {},
            rulesDetail: {},
            rulesUp: {},
            refAdd: {},
            refDetail: {},
            refUpdate: {},

            // 还款优先级
            viewPayPriorityDialog: false,

            // 新增
            isReadonly1: false,
            isDisabled1: false,
            addBusPro_part1: true,
            addBusPro_part1Btn: true,
            addBusPro_part2: false,
            addBusPro_part2Btn: false,
            addBusPro_part3: false,
            addBusPro_part3Btn: false,
            addBusPro_part4: false,
            addBusPro_part4Btn: false,
            addBusPro_part5: false,
            addBusPro_part5Btn: false,
            // 查看交易识别码
            viewTranIdDialog: false,
            tableData: [],
            config: {
                pageNum: 1,
                pageSize: 10,
                loading: false,
                total: 0,
            },
            tableLabel: [
                {
                    label: "交易识别代码",
                    prop: "transIdentifiNo",
                },
                {
                    label: "交易识别描述",
                    prop: "transIdentifiDesc",
                },
            ],
            // 查看余额对象实例化
            viewBalIntDialog: false,
            balanctInList: [],
            balanctInlistLoading: false,
            balanctInTotal: 0,
            queryBalanceInFormObj: {
                pageNum: 1,
                pageSize: 10,
            },
            balanceIns_replaceParamClick(e) {
                console.log(e);
            },
            balanceIns_setParamClick(e) {
                console.log(e);
            },
            // 新增  业务类型
            add_busTypeList: [],
            add_allBusTypeData: [],
            rightCheckedBusType: [],
            businessTypeCodeInitData: [],
            // 余额对象
            add_balanceList: [],
            add_allBalanceData: [],
            rightCheckedBalance: [],
            leftCheckedBalance: [],
            balanceObjectCodeInitData: [],
            add_chosedBalanceInList: [], // 选中的余额对象下的实例list
            // 配置参数
            balaInt_part1: true,
            balaInt_part2: false,
            add_balanInList: [], // 余额对象实例化
            textTitle2: "余额对象实例化",
            balanceIns__colunm3: false,
            balanceInsObj: {},
            objParamFlag: "", // 标记业务项目参数实例化 还是余额对象参数实例化 替换参数和设置参数时需要
            // 收费项目
            add_feeItemList: [],
            add_allFeeItemData: [],
            rightCheckedFeeItem: [],
            feeItemInitData: [],
            // 收费项目实例化
            viewFeeItemDialog: false,
            feeItemIntan_obj1: {},
            feeItemIntan_obj2: {},
            choseBtnFlag1: true,
            choseBtnFlag2: true,
            choseBtnFlag3: true,
            choseBtnFlag4: true,
            choseBtnFlag5: true,
            feeProExampleList: [],
            // 业务项目实例化
            add_busItemIncObj: {},
            textTitle1: "",
            colunm3: false,
            add_busItemInList: [],
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
            // 新增 保存
            save_balanceObjectCodeList: [],
            save_proBPInstanObj: {},
            // 详情
            detail_tableList1: [],
            detail_tableTotal1: 0,
            detail_queryFormObj1: {
                pageNum: 1,
                pageSize: 10,
            },

            detail_tableList2: [],
            detail_tableTotal2: 0,
            detail_queryFormObj2: {
                pageNum: 1,
                pageSize: 10,
            },

            detail_tableList3: [],
            detail_tableTotal3: 0,
            detail_queryFormObj3: {
                pageNum: 1,
                pageSize: 10,
            },

            detail_tableList4: [],
            detail_tableTotal4: 0,
            detail_queryFormObj4: {
                pageNum: 1,
                pageSize: 10,
            },
            // 查看参数组价
            textTitle2: "业务项目参数设置",
            viewPcdTitle: "",
            viewPcd_dialog: false,
            viewPcdFormObj: {},
            // 余额对象参数选项
            banlance_viewParam_dialog: false,
            textTitle8: "余额对象参数选项",
            table8Loading: false,
            table8List: [],
            table8Total: 0,
            table8FormObj: {
                pageSize: 10,
                pageNum: 1,
            },
            labelStr: "余额对象",
            colunm1: true,

            // 修改
            up_tableData: [],
            up_config: {
                pageNum: 1,
                pageSize: 10,
                total: 0,
                loading: false,
            },
            up_tableLabel: [
                {
                    label: "业务项目代码",
                    prop: "businessProgramNo",
                },
                {
                    label: "业务项目描述",
                    prop: "businessDesc",
                },
                {
                    label: "产品对象代码",
                    prop: "businessDesc",
                },
                {
                    label: "产品对象描述",
                    prop: "productObjectDesc",
                },
            ],

            // 选择业务类型穿梭框
            up_allBusTypeData: [],
            up_busTypeInitData: [],
            up_busTypeList: [],
            up_rightCheckedBusType: [],

            up_filterMethod(query, item) {
                return item.businessTypeCode.indexOf(query) > -1;
            },
            // 选择余额对象穿梭框
            up_balanceList: [],
            up_allBalanceData: [],
            up_balanceInitData: [],
            up_rightCheckedBalance: [],
            up_filterMethod2(query, item) {
                return item.balanceObjectCode.indexOf(query) > -1;
            },
            // 业务项目参数设置
            up_busItemInList: [],
            up_colunm3: false,
            up_textTitle: "业务项目参数设置",

            //修改时初始余额实例信息
            up_balanceListInitial: {},
            //详情时存储关联的业务类型
            detail_busTypeAarr: [],
            banlanceInsRow: {},
            setBalanceList: {},
            setFlag: "",
            seBalance: [],
            up_seBalance: [],
            proQuotaDialog: false,
            detail_quota1: [],
            creditTreeIdList: [],
            creditNodeNoList:[],
            quotaUpTempUp:{},
            quotaUp:false,
            rulesQuotaUpTempUp:{},
            addBusPro_part6:false


        };
    },
    created() {
        this.getBtnAuth();
    },
    mounted() {
        this.getList();

        // 运营模式
        this.getSelectDict("/beta/betaService/COS.IQ.02.0006").then((res) => {
            this.operationModeOptions = res;
        });
        // 业务类型
        this.getSelectDict("/beta/betaService/COS.IQ.02.0020").then((res) => {
            if (res.length > 0) {
                res.forEach((item) => {
                    item.labelDesc =
                        item.businessTypeCode + " " + item.businessDesc;
                });
                this.feeBusinessTypeOptions = res;
            }
        });
        // 承责属性
        this.getSelectDict("dic_responseType").then((res) => {
            this.responseTypeOptions = res;
        });
        // 项目类型
        this.getSelectDict("dic_productType").then((res) => {
            this.programTypeOptions = res;
        });
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
            console.log(window.sessionStorage.getItem("menuNo"));
            let params = {
                menuNo: window.sessionStorage.getItem("menuNo"),
            };
            this.getTableList(
                "/beta/betaService/COS.CS.01.0030",
                params,
                (res) => {
                    if (res.returnCode == "000000") {
                        if (res.returnData && res.returnData.length > 0) {
                            res.returnData.forEach((item) => {
                                this.btnAuthStr += item.eventNo + ",";
                            });
                            if (this.btnAuthStr.includes("COS.IQ.02.0018")) {
                                // 查询
                                this.selBtnFlag = true;
                            } else {
                                this.selBtnFlag = false;
                            }
                            if (this.btnAuthStr.includes("COS.AD.02.0018")) {
                                // 新增
                                this.addBtnFlag = true;
                            } else {
                                this.addBtnFlag = false;
                            }
                            if (this.btnAuthStr.includes("COS.UP.02.0018")) {
                                // 维护
                                this.updBtnFlag = true;
                            } else {
                                this.updBtnFlag = false;
                            }
                        }
                    }
                }
            );
        },
        // 列表
        getList() {
            this.listLoading1 = true;
            this.getTableList(
                "/beta/betaService/COS.IQ.02.0018",
                this.queryFormObj,
                (res) => {
                    if (res.returnCode == "000000") {
                        this.listLoading1 = false;
                        if (
                            res.returnData &&
                            res.returnData.rows &&
                            res.returnData.rows.length > 0
                        ) {
                            this.tableList = res.returnData.rows;
                            this.tableTotal = res.returnData.totalCount;
                        } else {
                            this.tableList = [];
                            this.tableTotal = 0;
                        }
                    }
                }
            );
        },
        handleSearch() {
            this.queryFormObj.pageNum = 1;
            this.queryFormObj.pageSize = 10;
            this.getList();
        },

        handleCreate() {     
            this.dialogFormVisibleAdd = true;
            this.$nextTick(() => {
                this.$refs["refAdd"].clearValidate();
            });
            this.$forceUpdate();
        },
        handleDetail(row) {
            console.log(row);
            this.businessProgramNoSel = row.businessProgramNo;
            this.operationModeSel = row.operationMode;
            this.detail_tableList1 = [];
            this.detail_tableList2 = [];
            this.detail_tableList3 = [];
            this.detail_tableList4 = [];
            this.detail_queryFormObj4.pageNum = 1;
            this.detail_queryFormObj4.pageSize = 10;
            this.detail_queryFormObj1.pageNum = 1;
            this.detail_queryFormObj1.pageSize = 10;
            this.detail_queryFormObj2.pageNum = 1;
            this.detail_queryFormObj2.pageSize = 10;
            this.detail_queryFormObj3.pageNum = 1;
            this.detail_queryFormObj3.pageSize = 10;
            this.dialogFormVisibleDetail = true;
            this.isReadonly1 = true;
            this.isDisabled1 = true;
            this.tempDetail = Object.assign({}, row); //
            this.$nextTick(() => {
                this.$refs["refDetail"].clearValidate();
            });
            this.detail_getList1(row);
            this.detail_getList2(row);
            this.detail_getList3(row);
            this.detail_getList4(row);
        },
        // 点击修改 受影响列表
        handleUpGetList(row) {
            this.dialogFormVisibleUpList = true;
            this.objParamFlag = "up_busItem";
            this.operationModeUP = row.operationMode;
            this.businessProgramNoUP = row.businessProgramNo;
            this.tempUp = JSON.parse(JSON.stringify(row));
            this.up_getList(this.tempUp);
        },
        handleUpdate() {
            // this.tempUp = Object.assign({}, row);
            this.dialogFormVisibleUpList = false;

            let row = this.tempUp;
            this.up_busTypeList = this.up_getRightBusData(row);
            console.log(this.up_busTypeList);
            this.up_allBusTypeData = this.up_getLeftBusData(
                row,
                this.up_busTypeList
            );

            this.up_balanceList = this.up_getRightBusData2(row);
            console.log(this.up_balanceList);
            this.up_allBalanceData = this.up_getLeftBusData2(
                row,
                this.up_balanceList
            );
            this.up_getBusItemIntList(row);
            this.dialogFormVisibleUp = true;
            this.$nextTick(() => {
                this.$refs["refUpdate"].clearValidate();
            });
        },
        updateData() {
            this.$refs["refUpdate"].validate((valid) => {
                if (valid) {
                    this.tempUp.list = [];
                    this.up_busTypeList.forEach((item) => {
                        this.up_busTypeInitData.forEach((obj) => {
                            if (item == obj.businessTypeCode) {
                                this.tempUp.list.push(obj);
                            }
                        });
                    });

                    this.tempUp.balanceObjectCodeList = this.up_balanceList;
                    this.tempUp.instanList = [];

                    if (this.up_balanceListInitial.length > 0) {
                        this.up_balanceListInitial.forEach((item) => {
                            item.instanList.forEach((in_item) => {
                                in_item.busTypeInstanList.forEach(
                                    (in_busItem) => {
                                        this.tempUp.instanList.push(in_busItem);
                                    }
                                );
                            });
                        });
                    }
                    if (this.up_busItemInList.length > 0) {
                        this.up_busItemInList.forEach((item) => {
                            this.tempUp.instanList.push(item);
                        });
                    }
                    console.log(this.tempUp);
                    if (this.tempUp.defaultBusinessType) {
                        this.post(
                            "/beta/betaService/COS.UP.02.0018",
                            this.tempUp,
                            (res) => {
                                if (res.returnCode == "000000") {
                                    this.dialogFormVisibleUp = false;
                                    this.$notify({
                                        message: "修改成功",
                                        type: "success",
                                    });
                                    this.handleSearch();
                                }
                            }
                        );
                    } else {
                        this.$notify({
                            message: "请选择默认业务类型",
                            type: "warnning",
                        });
                    }
                }
            });
        },

        // 新增
        // 查询还款优先级
        chosePriorityBtn() {
            this.viewPayPriorityDialog = true;
        },

        getTransIdList() {
            this.config.loading = true;
            this.config.businessTypeCode = this.rightCheckedBusType.join();
            this.config.operationMode = this.tempAdd.operationMode;

            this.getTableList(
                "/beta/betaService/COS.IQ.02.0052",
                this.config,
                (res) => {
                    if (res.returnCode == "000000") {
                        this.config.loading = false;

                        if (
                            res.returnData &&
                            res.returnData.rows &&
                            res.returnData.rows.length > 0
                        ) {
                            this.tableData = res.returnData.rows;
                            this.config.total = res.returnData.totalCount;
                        } else {
                            this.tableData = [];
                        }
                    }
                }
            );
        },

        // 新增

        // 下一步
        addBusPro_nextToPart2BTn() {
            this.$refs["refAdd"].validate((valid) => {
                if (valid) {
                    this.addBusPro_part1Btn = false;
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
            if (!this.tempAdd.defaultBusinessType) {
                this.$message({
                    message: "请设置默认业务类型",
                    type: "warning",
                });
                return;
            }
            this.addBusPro_part2Btn = false;
            this.addBusPro_part3 = true;
            this.addBusPro_part3Btn = true;
            this.add_allBalanceData = this.generateAllBalanceData();
        },
        addBusPro_nextToPart4Btn() {
            this.addBusPro_part3Btn = false;
            this.addBusPro_part4 = true;
            this.addBusPro_part4Btn = true;
            this.add_allFeeItemData = this.generateAllFeeItemData();
        },
        addBusPro_nextToPart5Btn() {
            this.addBusPro_part1 = false;
            this.addBusPro_part2 = false;
            this.addBusPro_part3 = false;
            this.addBusPro_part4 = false;
            this.addBusPro_part4Btn = false;
            this.addBusPro_part5 = true;
            this.addBusPro_part5Btn = true;
            // 查询
            this.getBusItemIntaList();
        },

        // 上一步
        addBusPro_backPar1Btn() {
            this.addBusPro_part2 = false;
            this.addBusPro_part1Btn = true;
            this.isReadonly1 = false;
            this.isDisabled1 = false;
        },
        addBusPro_backPar2Btn() {
            this.addBusPro_part3 = false;
            this.addBusPro_part2Btn = true;
        },
        addBusPro_backPar3Btn() {
            this.addBusPro_part4 = false;
            this.addBusPro_part3Btn = true;
        },
        addBusPro_backPar4Btn() {
            this.addBusPro_part1 = true;
            this.addBusPro_part2 = true;
            this.addBusPro_part3 = true;
            this.addBusPro_part4 = true;
            this.addBusPro_part5 = false;

            this.addBusPro_part1Btn = false;
            this.addBusPro_part2Btn = false;
            this.addBusPro_part3Btn = false;
            this.addBusPro_part4Btn = true;
            this.addBusPro_part5Btn = false;
        },
        setBusTypeBtn() {
            if (this.rightCheckedBusType.length != 1) {
                this.$message({
                    message: "请选择1个业务类型",
                    type: "warning",
                });
                return;
            }
            this.$set(
                this.tempAdd,
                "defaultBusinessType",
                this.rightCheckedBusType.join()
            );
        },
        // 查看交易识别码
        viewTransIdBtn() {
            if (this.rightCheckedBusType.length != 1) {
                this.$message({
                    message: "请选择1个业务类型",
                    type: "warning",
                });
                return;
            }
            this.viewTranIdDialog = true;
            this.getTransIdList();
        },

        // 2选择业务类型
        add_filterMethod(query, item) {
            return item.businessTypeCode.indexOf(query) > -1;
        },
        // 左侧被选中业务类型
        add_handleAddComponent(value, direction, movedKeys) {
            this.add_busTypeList = value;
        },
        // 右侧呗选中业务类型
        add_rightCheckedChange(val) {
            this.rightCheckedBusType = val;
        },
        // 获取业务类型穿梭框左侧数据
        generateAllBusTypeData() {
            const componentData = []; // 相当于data
            const componentNoList = []; //
            const componentList = [];
            this.post("/beta/betaService/COS.IQ.02.0020", {}, (res) => {
                this.businessTypeCodeInitData = res.returnData.rows;
                res.returnData.rows.forEach((item, i) => {
                    componentList.push(
                        item.businessTypeCode + " " + item.businessDesc
                    );
                    componentNoList.push(item.businessTypeCode);
                });
                componentList.forEach((component, index) => {
                    componentData.push({
                        label: component,
                        // key: index,
                        key: component.split(" ")[0],
                        businessTypeCode: componentNoList[index],
                    });
                });
            });
            console.log(componentData);
            return componentData;
        },

        // 3选择余额对象
        add_filterMethodBalance(query, item) {
            return item.balanceObjectCode.indexOf(query) > -1;
        },
        // 右侧余额对象数据发生变化时触发
        add_balanceHandleComponent(value, direction, movedKeys) {
            if (direction == "right") {
                this.getQueryChosedBalanceInt(movedKeys);
                this.add_balanceList = value;
                this.add_allBalanceData.forEach((item) => {
                    item.disabled = false;
                });
            } else if (direction == "left") {
                this.save_balanceObjectCodeList.forEach((item, index) => {
                    if (item.balanceObjectCode == movedKeys[0]) {
                        this.save_balanceObjectCodeList.split(index, 1);
                    }
                });
                this.add_allBalanceData.forEach((item) => {
                    item.disabled = false;
                });
            }
        },
        add_balanceRightCheckedChange(val) {
            if (val.length == "1") {
                this.add_allBalanceData.forEach((item) => {
                    if (item.balanceObjectCode == val[0]) {
                        item.disabled = false;
                    } else {
                        item.disabled = true;
                    }
                });
            } else {
                this.add_allBalanceData.forEach((item) => {
                    item.disabled = false;
                });
            }
            this.setFlag = "balaADD";
            this.rightCheckedBalance = val;
        },
        add_balanceLeftCheckedChange(val) {
            if (val.length == "1") {
                this.add_allBalanceData.forEach((item) => {
                    if (item.balanceObjectCode == val[0]) {
                        item.disabled = false;
                    } else {
                        item.disabled = true;
                    }
                });
            } else {
                this.add_allBalanceData.forEach((item) => {
                    item.disabled = false;
                });
            }
            this.setFlag = "balaADD";
            this.leftCheckedBalance = val;
        },
        // 查询选中余额对象的实例 list: 左侧选中的余额对象list
        getQueryChosedBalanceInt(list) {
            if (list.length == 1) {
                let params = {
                    instanFlag: 1,
                    balanceObjectCodelist: list,
                    businessProgramNo:
                        "MODG" + this.tempAdd.businessProgramNoHalf,
                    businessTypeCodeList: this.add_busTypeList,
                    operationMode: this.tempAdd.operationMode,
                };
                this.post("/beta/betaService/COS.IQ.02.0020", params, (res) => {
                    if (res.returnCode == "000000") {
                        if (
                            res.returnData &&
                            res.returnData.rows &&
                            res.returnData.rows.length > 0
                        ) {
                            let obj = {};
                            obj.balanceObjectInstan = res.returnData.rows;
                            obj.balanceObjectCode = list.join();
                            this.balanctInList = res.returnData.rows;
                            this.balanctInTotal = res.returnData.totalCount;
                            this.balanceObjectCodeInitData.forEach((item) => {
                                if (item.balanceObjectCode == list.join()) {
                                    obj.objectDesc = item.objectDesc;
                                }
                            });
                            this.save_balanceObjectCodeList.push(obj);
                            console.log(this.save_balanceObjectCodeList);
                        }
                    }
                });
            } else {
                this.$message({
                    message: "请选择1个余额对象",
                    type: "warning",
                });
                return;
            }
        },

        // 查询选中余额对象的实例 list: 左侧选中的余额对象list
        getQueryChosedBalanceIntUP(list) {
            if (list.length == 1) {
                let params = {
                    instanFlag: 1,
                    balanceObjectCodelist: list,
                    businessProgramNo: this.tempUp.businessProgramNo,
                    businessTypeCodeList: this.UP_busTypeList,
                    operationMode: this.tempUp.operationMode,
                };
                this.post("/beta/betaService/COS.IQ.02.0020", params, (res) => {
                    if (res.returnCode == "000000") {
                        if (
                            res.returnData &&
                            res.returnData.rows &&
                            res.returnData.rows.length > 0
                        ) {
                            let obj = {};
                            obj.balanceObjectInstan = res.returnData.rows;
                            obj.balanceObjectCode = list.join();
                            this.balanctInList = res.returnData.rows;
                            this.balanctInTotal = res.returnData.totalCount;
                            this.balanceObjectCodeInitData.forEach((item) => {
                                if (item.balanceObjectCode == list.join()) {
                                    obj.objectDesc = item.objectDesc;
                                }
                            });
                            obj.instanList = obj.balanceObjectInstan;
                            this.up_balanceListInitial.push(obj);
                            console.log(this.up_balanceListInitial);
                        }
                    }
                });
            } else {
                this.$message({
                    message: "请选择1个余额对象",
                    type: "warning",
                });
                return;
            }
        },

        generateAllBalanceData() {
            const componentData = []; // 相当于data
            const componentNoList = []; //
            const componentList = [];
            this.post("/beta/betaService/COS.IQ.02.0021", {}, (res) => {
                this.balanceObjectCodeInitData = res.returnData.rows;
                res.returnData.rows.forEach((item, i) => {
                    componentList.push(
                        item.balanceObjectCode + " " + item.objectDesc
                    );
                    componentNoList.push(item.balanceObjectCode);
                });
                componentList.forEach((component, index) => {
                    componentData.push({
                        label: component,
                        // key: index,
                        key: component.split(" ")[0],
                        balanceObjectCode: componentNoList[index],
                    });
                });
            });
            return componentData;
        },
        // 查看余额对象实例化按钮
        add_viewBalIntaBtn() {
            this.balaInt_part1 = true;
            this.balaInt_part2 = false;
            this.getBalanceInList();
        },
        getBalanceInList() {
            this.seBalance = this.rightCheckedBalance;
            if (this.rightCheckedBalance.length != 1) {
                this.$message({
                    message: "请选择1个余额对象",
                    type: "warning",
                });
                return;
            }
            this.viewBalIntDialog = true;
            this.setFlag = "balaADD";
            console.log(this.save_balanceObjectCodeList);
        },
        // 配置参数
        banlIn_handleSetParam(row) {
            this.balaInt_part1 = false;
            this.balaInt_part2 = true;
            this.objParamFlag = "balanceIns";
            this.setBalanceList = JSON.parse(JSON.stringify(row));
            if (this.setFlag == "balaADD") {
                this.save_balanceObjectCodeList.forEach((item) => {
                    if (item.balanceObjectCode == this.seBalance) {
                        this.balanceInsObj.balanceObjectCode =
                            item.balanceObjectCode;
                        this.balanceInsObj.objectDesc = item.objectDesc;
                        item.balanceObjectInstan.forEach((item1) => {
                            if (
                                item1.businessTypeCode ==
                                this.setBalanceList.businessTypeCode
                            ) {
                                this.add_balanInList = item1.busTypeInstanList;
                            }
                        });
                    }
                });
            } else if (this.setFlag == "balaUP") {
                this.up_balanceListInitial.forEach((item) => {
                    if (item.balanceObjectCode == this.up_seBalance) {
                        this.balanceInsObj.balanceObjectCode =
                            item.balanceObjectCode;
                        this.balanceInsObj.objectDesc = item.objectDesc;
                        item.instanList.forEach((item1) => {
                            if (
                                item1.businessTypeCode ==
                                this.setBalanceList.businessTypeCode
                            ) {
                                this.add_balanInList = item1.busTypeInstanList;
                            }
                        });
                    }
                });
            }
        },
        // 确定配置参数
        surePZPatam() {
            this.viewBalIntDialog = false;
            this.objParamFlag = "up_busItem";
        },

        // 4选择收费项目

        add_feeItemFilterMethod(query, item) {
            return item.feeItemNo.indexOf(query) > -1;
        },

        add_feeItemHandleAddComponent(value, direction, movedKeys) {
            this.add_feeItemList = value;
        },
        add_feeItemRightCheckedChange(val) {
            this.rightCheckedFeeItem = val;
        },
        generateAllFeeItemData() {
            const componentData = []; // 相当于data
            const componentNoList = []; //
            const componentList = [];
            this.post(
                "/beta/betaService/COS.IQ.02.0031",
                { instanCode: "MODG" },
                (res) => {
                    this.feeItemInitData = res.returnData.rows;
                    res.returnData.rows.forEach((item, i) => {
                        componentList.push(item.feeItemNo + " " + item.feeDesc);
                        componentNoList.push(item.feeItemNo);
                    });
                    componentList.forEach((component, index) => {
                        componentData.push({
                            label: component,
                            // key: index,
                            key: component.split(" ")[0],
                            feeItemNo: componentNoList[index],
                        });
                    });
                }
            );
            return componentData;
        },

        // 收费项目实例
        addBusPro_viewFeeItemBtn() {
            if (this.rightCheckedFeeItem.length != 1) {
                this.$message({
                    message: "请选择1个收费项目",
                    type: "warning",
                    duration: 2000,
                });
                return;
            }
            this.viewFeeItemDialog = true;
            let choseFeeItem = {};
            this.feeItemInitData.forEach((ele) => {
                if (ele.feeItemNo == this.rightCheckedFeeItem[0]) {
                    choseFeeItem = ele;
                }
            });
            choseFeeItem.instanDimen1 = choseFeeItem.instanCode1;
            choseFeeItem.instanCode1 = "";
            choseFeeItem.instanDimen2 = choseFeeItem.instanCode2;
            choseFeeItem.instanCode2 = "";
            choseFeeItem.instanDimen3 = choseFeeItem.instanCode3;
            choseFeeItem.instanCode3 = "";
            choseFeeItem.instanDimen4 = choseFeeItem.instanCode4;
            choseFeeItem.instanCode4 = "";
            choseFeeItem.instanDimen5 = choseFeeItem.instanCode5;
            choseFeeItem.instanCode5 = "";
            this.feeItemIntan_obj1 = choseFeeItem;
            if(this.feeItemIntan_obj1.instanDimen1) {
                this.choseBtnFlag1 = false
            } else {
                this.choseBtnFlag1 = true
            }
            if(this.feeItemIntan_obj1.instanDimen2) {
                this.choseBtnFlag2 = false
            } else {
                this.choseBtnFlag2 = true
            }
            if(this.feeItemIntan_obj1.instanDimen3) {
                this.choseBtnFlag3 = false
            } else {
                this.choseBtnFlag3 = true
            }
            if(this.feeItemIntan_obj1.instanDimen4) {
                this.choseBtnFlag4 = false
            } else {
                this.choseBtnFlag4 = true
            }
            if(this.feeItemIntan_obj1.instanDimen5) {
                this.choseBtnFlag5 = false
            } else {
                this.choseBtnFlag5 = true
            }

        },
        sureFeeItemIntanData() {
            let feeItemIntanObj = Object.assign(
                this.feeItemIntan_obj1,
                this.feeItemIntan_obj2
            );
            if (
                feeItemIntanObj.feeItemNo == "LCHG025" &&
                (feeItemIntanObj.feeMatrixApplicationDimension == "" ||
                    feeItemIntanObj.feeMatrixApplicationDimension ==
                        undefined ||
                    feeItemIntanObj.feeMatrixApplicationDimension ==
                        "undefined")
            ) {
                this.$message({
                    message: "请选择费用矩阵应用维度",
                    type: "warning",
                    duration: 2000,
                });
                return;
            }
            if (
                feeItemIntanObj.feeMatrixApplicationDimension &&
                feeItemIntanObj.matrixAppMode
            ) {
                if (
                    feeItemIntanObj.feeMatrixApplicationDimension == "2" &&
                    feeItemIntanObj.matrixAppMode == "P"
                ) {
                    this.$message({
                        message:
                            "费用矩阵维度为天数时矩阵应用方式不允许设置超额累进",
                        type: "warning",
                        duration: 2000,
                    });
                    return;
                }
            }
            if (feeItemIntanObj.instanDimen1) {
                if (!feeItemIntanObj.instanCode1) {
                    this.$message({
                        message: "请选择实例代码1",
                        type: "warning",
                        duration: 2000,
                    });
                    return;
                }
            }
            if (feeItemIntanObj.instanDimen2) {
                if (!feeItemIntanObj.instanCode2) {
                    this.$message({
                        message: "请选择实例代码2",
                        type: "warning",
                        duration: 2000,
                    });
                    return;
                }
            }
            if (feeItemIntanObj.instanDimen3) {
                if (!feeItemIntanObj.instanCode3) {
                    this.$message({
                        message: "请选择实例代码3",
                        type: "warning",
                        duration: 2000,
                    });
                    return;
                }
            }
            if (feeItemIntanObj.instanDimen4) {
                if (!feeItemIntanObj.instanCode4) {
                    this.$message({
                        message: "请选择实例代码4",
                        type: "warning",
                        duration: 2000,
                    });
                    return;
                }
            }
            if (feeItemIntanObj.instanDimen5) {
                if (!feeItemIntanObj.instanCode5) {
                    this.$message({
                        message: "请选择实例代码5",
                        type: "warning",
                        duration: 2000,
                    });
                    return;
                }
            }

            if (
                feeItemIntanObj.instanDimen1 == "FTYP" ||
                feeItemIntanObj.instanDimen2 == "FTYP" ||
                feeItemIntanObj.instanDimen4 == "FTYP" ||
                feeItemIntanObj.instanDimen4 == "FTYP" ||
                feeItemIntanObj.instanDimen5 == "FTYP"
            ) {
                if (!feeItemIntanObj.feeCollectType) {
                    this.$message({
                        message: "请选择费用收取方式",
                        type: "warning",
                        duration: 2000,
                    });
                    return;
                }
            } else {
                if (feeItemIntanObj.instanDimen1 == "FTYP") {
                    if (
                        feeItemIntanObj.instanCode1 !=
                        feeItemIntanObj.feeCollectType
                    ) {
                        this.$message({
                            message: "收取方式实例代码应与费用收取方式保持一致",
                            type: "warning",
                            duration: 2000,
                        });
                        return;
                    }
                }
                if (feeItemIntanObj.instanDimen2 == "FTYP") {
                    if (
                        feeItemIntanObj.instanCode2 !=
                        feeItemIntanObj.feeCollectType
                    ) {
                        this.$message({
                            message: "收取方式实例代码应与费用收取方式保持一致",
                            type: "warning",
                            duration: 2000,
                        });
                        return;
                    }
                }
                if (feeItemIntanObj.instanDimen3 == "FTYP") {
                    if (
                        feeItemIntanObj.instanCode3 !=
                        feeItemIntanObj.feeCollectType
                    ) {
                        this.$message({
                            message: "收取方式实例代码应与费用收取方式保持一致",
                            type: "warning",
                            duration: 2000,
                        });
                        return;
                    }
                }
                if (feeItemIntanObj.instanDimen4 == "FTYP") {
                    if (
                        feeItemIntanObj.instanCode4 !=
                        feeItemIntanObj.feeCollectType
                    ) {
                        this.$message({
                            message: "收取方式实例代码应与费用收取方式保持一致",
                            type: "warning",
                            duration: 2000,
                        });
                        return;
                    }
                }
                if (feeItemIntanObj.instanDimen5 == "FTYP") {
                    if (
                        feeItemIntanObj.instanCode5 !=
                        feeItemIntanObj.feeCollectType
                    ) {
                        this.$message({
                            message: "收取方式实例代码应与费用收取方式保持一致",
                            type: "warning",
                            duration: 2000,
                        });
                        return;
                    }
                }
            }

            if (feeItemIntanObj.feeFlag == "P") {
                if (feeItemIntanObj.feeRate1) {
                    let pattern = /^[0-1](\.\d{1,9})?$/;
                    if (!pattern.test(feeItemIntanObj.feeRate1)) {
                        this.$message({
                            message:
                                "请输入正确的费率(大于0小于1的数值及最多保留9位小数格式)",
                            type: "warning",
                            duration: 2000,
                        });
                        return;
                    }
                }
                if (feeItemIntanObj.feeRate2) {
                    let pattern = /^[0-1](\.\d{1,9})?$/;
                    if (!pattern.test(feeItemIntanObj.feeRate2)) {
                        this.$message({
                            message:
                                "请输入正确的费率(大于0小于1的数值及最多保留9位小数格式)",
                            type: "warning",
                            duration: 2000,
                        });
                        return;
                    }
                }
                if (feeItemIntanObj.feeRate3) {
                    let pattern = /^[0-1](\.\d{1,9})?$/;
                    if (!pattern.test(feeItemIntanObj.feeRate3)) {
                        this.$message({
                            message:
                                "请输入正确的费率(大于0小于1的数值及最多保留9位小数格式)",
                            type: "warning",
                            duration: 2000,
                        });
                        return;
                    }
                }
                if (feeItemIntanObj.feeRate4) {
                    let pattern = /^[0-1](\.\d{1,9})?$/;
                    if (!pattern.test(feeItemIntanObj.feeRate4)) {
                        this.$message({
                            message:
                                "请输入正确的费率(大于0小于1的数值及最多保留9位小数格式)",
                            type: "warning",
                            duration: 2000,
                        });
                        return;
                    }
                }
                if (feeItemIntanObj.feeRate5) {
                    let pattern = /^[0-1](\.\d{1,9})?$/;
                    if (!pattern.test(feeItemIntanObj.feeRate5)) {
                        this.$message({
                            message:
                                "请输入正确的费率(大于0小于1的数值及最多保留9位小数格式)",
                            type: "warning",
                            duration: 2000,
                        });
                        return;
                    }
                }
            }
            this.feeProExampleList.push(feeItemIntanObj);
            this.viewFeeItemDialog = false;
        },

        // 5 业务项目实例化
        getBusItemIntaList() {
            this.add_busItemIncObj.businessProgramNo =
                "MODG" + this.tempAdd.businessProgramNoHalf;
            this.add_busItemIncObj.programDesc = this.tempAdd.programDesc;
            this.textTitle1 = "业务项目实例化";

            this.post(
                "/beta/betaService/COS.IQ.02.0042",
                {
                    instanDimen1: "MODG",
                    instanCode: this.add_busItemIncObj.businessProgramNo,
                },
                (res) => {
                    if (res.returnCode == "000000") {
                        if (
                            res.returnData &&
                            res.returnData.rows &&
                            res.returnData.rows.length > 0
                        ) {
                            this.add_busItemInList = res.returnData.rows;

                            this.objParamFlag = "busProIns";
                        }
                    }
                }
            );
        },
        // 替换参数
        replaceParamClick(e) {
            this.replcaeParam_dialog = true;
            this.replaceParamObj = e[0];
            this.replaceIndex = e[1];
            this.defalutChoseVal = e[0].elementNo;
        },
        // 设置参数
        setParamClick(e) {
            this.replaceIndex = e[1];
            this.setParam_dialog = true;
            this.setPcdObj = e[0];
            this.setPcdTitle =
                "设置" + e[0].pcdNo + ": " + e[0].pcdDesc + "参数信息";
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
        //  确定替换参数
        sureReplaceData() {
            if (this.objParamFlag == "busProIns") {
                // 业务项目实例化
                this.$set(
                    this.add_busItemInList[this.replaceIndex],
                    "elementNo",
                    this.choosedVal.split("_")[0]
                );
                this.$set(
                    this.add_busItemInList[this.replaceIndex],
                    "elementDesc",
                    this.choosedVal.split("_")[1]
                );
                this.replcaeParam_dialog = false;
            } else if (this.objParamFlag == "balanceIns") {
                // 余额对象实例化
                this.$set(
                    this.add_balanInList[this.replaceIndex],
                    "elementNo",
                    this.choosedVal.split("_")[0]
                );
                this.$set(
                    this.add_balanInList[this.replaceIndex],
                    "elementDesc",
                    this.choosedVal.split("_")[1]
                );
                this.replcaeParam_dialog = false;
            } else if (this.objParamFlag == "up_busItem") {
                // 修改中 业务项目参数
                this.$set(
                    this.up_busItemInList[this.replaceIndex],
                    "elementNo",
                    this.choosedVal.split("_")[0]
                );
                this.$set(
                    this.up_busItemInList[this.replaceIndex],
                    "elementDesc",
                    this.choosedVal.split("_")[1]
                );
                this.replcaeParam_dialog = false;
            }
        },
        //  确定设置参数
        sureSetData() {
            if (this.objParamFlag == "busProIns") {
                // 业务项目实例化
                this.$set(
                    this.add_busItemInList[this.replaceIndex],
                    "pcdInitList",
                    this.pcdList
                );
                this.$set(
                    this.add_busItemInList,
                    this.replaceIndex,
                    this.setPcdObj
                );
                this.setParam_dialog = false;
            } else if (this.objParamFlag == "balanceIns") {
                // 余额对象实例化
                this.$set(
                    this.add_balanInList[this.replaceIndex],
                    "pcdInitList",
                    this.pcdList
                );
                this.$set(
                    this.add_balanInList,
                    this.replaceIndex,
                    this.setPcdObj
                );
                this.setParam_dialog = false;
            } else if (this.objParamFlag == "up_busItem") {
                // 修改中 业务项目参数
                this.$set(
                    this.up_busItemInList,
                    this.replaceIndex,
                    this.setPcdObj
                );
                this.$set(
                    this.up_busItemInList[this.replaceIndex],
                    "performOrder",
                    this.setPcdObj.performOrder
                );
                // this.$set( this.up_busItemInList[this.replaceIndex], "pcdInstanList", this.pcdList);
                // this.$set( this.up_busItemInList[this.replaceIndex], "pcdInitList", this.pcdList);
                this.$set(
                    this.up_busItemInList[this.replaceIndex],
                    "pcdList",
                    this.pcdList
                );
                this.$set(
                    this.up_busItemInList[this.replaceIndex],
                    "addPcdFlag",
                    "1"
                );
                this.setParam_dialog = false;
            }
        },

        // 保存业务项目
        addBusPro_saveBtn() {
            let addObj = {};
            addObj.balanceObjectCodeList = [];

            // 业务项目实例
            this.add_busItemInList.forEach((item) => {
                if (item.pcdList == null && item.pcdInitList != null) {
                    item.addPcdFlag = "1";
                    item.pcdList = item.pcdInitList;
                }
            });
            // 余额对象实例
            let balanceObjectPcd = [];
            console.log(this.save_balanceObjectCodeList);
            this.save_balanceObjectCodeList.forEach((item1) => {
                // item1 == proBPInstanListPage[k]
                addObj.balanceObjectCodeList.push(item1.balanceObjectCode);
                item1.balanceObjectInstan.forEach((item2) => {
                    // item2 = proBPInstanListPage[k]balanceObjectInstan[n]
                    item2.busTypeInstanList.forEach((item3) => {
                        //item3 == proBPInstanListPage[k].balanceObjectInstan[n].busTypeInstanList[m]
                        balanceObjectPcd.push(item3);
                    });
                });
            });

            this.add_busItemInList.forEach((item) => {
                balanceObjectPcd.push(item);
            });

            if (balanceObjectPcd.length > 0) {
                balanceObjectPcd.forEach((item) => {
                    if (item.pcdList != null || item.pcdInitList != null) {
                        item.addPcdFlag = "1";
                    }
                    if (item.pcdList == null && item.pcdInitList != null) {
                        item.pcdList = item.pcdInitList;
                    }
                });
            }
            this.balanctInList.forEach((item) => {
                item.busTypeInstanList = null;
            });
            addObj.instanlist = balanceObjectPcd;
            addObj.instanCode = this.add_busItemIncObj.businessProgramNo;
            addObj.businessProgramNo = this.add_busItemIncObj.businessProgramNo;
            // obj.list =  $scope.proObjInstan.list; // 余额对象实例化 1条list  balanctInList
            addObj.list = this.balanctInList; // 余额对象实例化 1条list  balanctInList
            addObj.businessProgramNoHalf = this.tempAdd.businessProgramNoHalf;
            addObj.defaultBusinessType = this.tempAdd.defaultBusinessType;
           // addObj.deletePcdInstanIdList = this.delePcdList;
            addObj.operationMode = this.tempAdd.operationMode;
            addObj.programDesc = this.tempAdd.programDesc;
            addObj.programType = this.tempAdd.programType;
            addObj.responseType = this.tempAdd.responseType;
            addObj.paymentPriority = this.tempAdd.paymentPriority;
            addObj.feeInstanList = this.feeProExampleList; //收费项目实例
            this.post("/beta/betaService/COS.AD.02.0018", addObj, (res) => {
                if (res.returnCode == "000000") {
                  //  this.dialogFormVisibleAdd = false;
                    this.$notify({
                        message: "新增成功",
                        type: "success",
                    });
                    this.addBusPro_part5 = false;
                    this.addBusPro_part6 = true;
                    this.quota_query1.businessProgramNo = addObj.businessProgramNo
                    this.quota_query1.operationMode = addObj.operationMode
                    this.quota_query1.authFlag = 0
                    this.detail_getQquota1()
                   // this.proQuotaDialog = true;
                    
                    
                    
                }
            });
        },

        detail_getQquota1() {
            this.quota_query1.pageNum = 1;
            this.quota_query1.pageSize = 10;
            this.detail_quota1 = []
            this.quota_tableTotal1 = 0;
            this.getTableList("/beta/betaService/LMS.PM.01.0012",this.quota_query1,(res) => {
                if (res.returnCode == "000000") {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        this.detail_quota1 = res.returnData.rows;
                        this.quota_tableTotal1 = res.returnData.totalCount;
                    } else {
                        this.detail_quota1 = [];
                        this.quota_tableTotal1 = 0;
                    }
                }
            });
        },
        //修改额度节点
        handleUpdateQuota(row) {
            this.quotaUp = true
            this.quotaUpTempUp = {}
            this.quotaUpTempUp = JSON.parse(JSON.stringify(row));
            this.creditTreeIdList = []
            // 额度网
           this.getSelectDict("/beta/betaService/LMS.PM.01.0024").then((res) => {
               this.creditTreeIdList = []
                this.creditTreeIdList = res;
            });
            
        },
        refresh(){
            this.$forceUpdate()
        },
        //选择额度网后选择相应的额度节点
        getCreditTree(data){
            this.refresh()
            this.creditNodeNoList = []
            this.quotaUpTempUp.creditNodeNo = ''
            console.log(data)
            let creditTreeIdSel = ''
            let creditQuery = {}
            creditTreeIdSel = data
            creditQuery.operationMode = this.tempAdd.operationMode
            creditQuery.creditTreeId = creditTreeIdSel
            creditQuery.authDataSynFlag = '1'
            creditQuery.relativeNodeType = 'B'
            // 额度网
           this.post("/beta/betaService/LMS.PM.01.0002",creditQuery,(res) => {
                this.creditNodeNoList = res.returnData.rows;
                this.$forceUpdate()
            });
        },
        //修改额度节点弹窗确定
        updateCreditNo(){
            this.$refs["dataFormUp"].validate((valid) => {
                if (valid) {
                    console.log(this.quotaUpTempUp);
                    this.quotaUpTempUp.authFlag = '2'
                    this.post("/beta/betaService/LMS.PM.01.0013",this.quotaUpTempUp,(res) => {
                        if (res.returnCode == "000000") {
                            this.quotaUp = false;
                            this.quota_query1.businessProgramNo = this.quotaUpTempUp.businessProgramNo
                            this.quota_query1.operationMode = this.quotaUpTempUp.operationMode
                            this.quota_query1.authFlag = 0
                            this.detail_getQquota1()
                            this.$notify({
                                message: "修改成功",
                                type: "success",
                            });
                        }
                    });
                }
            });
        },
        // 修改 弹窗
        detail_getList1(row) {
            let obj = {
                businessProgramNo: this.businessProgramNoSel,
                operationMode: this.operationModeSel,
            };
            obj = Object.assign(obj, this.detail_queryFormObj1);
            this.getTableList(
                "/beta/betaService/COS.IQ.02.0033",
                obj,
                (res) => {
                    if (res.returnCode == "000000") {
                        if (
                            res.returnData &&
                            res.returnData.rows &&
                            res.returnData.rows.length > 0
                        ) {
                            this.detail_tableList1 = res.returnData.rows;
                            this.detail_tableTotal1 = res.returnData.totalCount;
                            this.detail_tableList1.forEach((item) => {
                                this.detail_busTypeAarr.push(
                                    item.businessTypeCode
                                );
                            });
                        } else {
                            this.detail_tableList1 = [];
                            this.detail_tableTotal1 = 0;
                            this.detail_detail_busTypeAarr = [];
                        }
                    }
                }
            );
        },
        createData(){
            this.tempAdd = {};
            this.addBusPro_part2 = false;
            this.addBusPro_part1Btn = true;
            this.addBusPro_part1 = true;
            this.isReadonly1 = false;
            this.isDisabled1 = false;
            this.add_busTypeList = [];
            this.addBusPro_part3 = false;
            this.addBusPro_part4 = false;
            this.addBusPro_part5 = false;
            this.dialogFormVisibleAdd = false;
            this.add_balanceList = [];
            this.add_busItemIncObj = {};
            this.add_busItemInList = {};
            this.save_balanceObjectCodeList = [];
            this.handleSearch();
        },
        detail_getList2(row) {
            let obj = {
                businessProgramNo: this.businessProgramNoSel,
                operationMode: this.operationModeSel,
            };
            obj = Object.assign(obj, this.detail_queryFormObj2);
            this.getTableList(
                "/beta/betaService/COS.IQ.02.0136",
                obj,
                (res) => {
                    if (res.returnCode == "000000") {
                        if (
                            res.returnData &&
                            res.returnData.rows &&
                            res.returnData.rows.length > 0
                        ) {
                            this.detail_tableList2 = res.returnData.rows;
                            this.detail_tableTotal2 = res.returnData.totalCount;
                        } else {
                            this.detail_tableList2 = [];
                            this.detail_tableTotal2 = 0;
                        }
                    }
                }
            );
        },
        detail_getList3(row) {
            let obj = {
                instanCode: this.businessProgramNoSel,
                operationMode: this.operationModeSel,
            };
            obj = Object.assign(obj, this.detail_queryFormObj3);
            this.getTableList(
                "/beta/betaService/COS.IQ.02.0032",
                obj,
                (res) => {
                    if (res.returnCode == "000000") {
                        if (
                            res.returnData &&
                            res.returnData.rows &&
                            res.returnData.rows.length > 0
                        ) {
                            this.detail_tableList3 = res.returnData.rows;
                            this.detail_tableTotal3 = res.returnData.totalCount;
                        } else {
                            this.detail_tableList3 = [];
                            this.detail_tableTotal3 = 0;
                        }
                    }
                }
            );
        },
        detail_getList4(row) {
            let obj = {
                instanCode: this.businessProgramNoSel,
                operationMode: this.operationModeSel,
            };
            obj = Object.assign(obj, this.detail_queryFormObj4);
            this.getTableList(
                "/beta/betaService/COS.IQ.02.0015",
                obj,
                (res) => {
                    if (res.returnCode == "000000") {
                        if (
                            res.returnData &&
                            res.returnData.rows &&
                            res.returnData.rows.length > 0
                        ) {
                            this.detail_tableList4 = res.returnData.rows;
                            this.detail_tableTotal4 = res.returnData.totalCount;
                        } else {
                            this.detail_tableList4 = [];
                            this.detail_tableTotal4 = 0;
                        }
                    }
                }
            );
        },
        // 查看参数
        hadleViewParam(row) {
            this.viewPcdTitle =
                "查看" + row.pcdNo + ": " + row.pcdDesc + "参数信息";
            this.viewPcd_dialog = true;
            this.viewPcdFormObj = row;
        },
        // 余额对象查看参数按钮
        detail_balanceViewParam(row) {
            this.banlance_viewParam_dialog = true;
            this.banlanceInsRow = JSON.parse(JSON.stringify(row));
            let obj = {
                instanCodeList: this.detail_busTypeAarr,
                instanCode: this.banlanceInsRow.balanceObjectCode,
                operationMode: this.banlanceInsRow.operationMode,
            };
            this.getList8(obj);
        },
        // 余额对象参数选项
        getList8(row) {
            this.table8FormObj = Object.assign(this.table8FormObj, row);
            this.getTableList(
                "/beta/betaService/COS.IQ.02.0015",
                this.table8FormObj,
                (res) => {
                    this.table8List = [];
                    this.table8Total = 0;
                    if (res.returnCode == "000000") {
                        if (
                            res.returnData &&
                            res.returnData.rows &&
                            res.returnData.rows.length > 0
                        ) {
                            let rows = res.returnData.rows;
                            rows.forEach((item) => {
                                item.concat =
                                    item.instanCode1 + " " + item.instanDesc1;
                            });
                            this.table8List = rows;
                            console.log(this.table8List);
                            this.table8Total = res.returnData.totalCount;
                        }
                    } else {
                        this.table8List = [];
                        this.table8Total = 0;
                    }
                }
            );
        },

        // 修改
        // 受影响产品列表
        up_getList(row) {
            this.up_config.loading = true;
            let params = {
                businessProgramNo: this.businessProgramNoUP,
                operationMode: this.operationModeUP,
            };
            // COS.IQ.02.0014
            this.up_config = Object.assign(this.up_config, params);
            this.getTableList(
                "/beta/betaService/COS.IQ.02.0014",
                this.up_config,
                (res) => {
                    if (res.returnCode == "000000") {
                        this.up_config.loading = false;
                        if (
                            res.returnData &&
                            res.returnData.rows &&
                            res.returnData.rows.length > 0
                        ) {
                            this.up_tableData = res.returnData.rows;
                            this.up_config.total = res.returnData.totalCount;
                        } else {
                            this.up_tableData = [];
                            this.up_config.total = 0;
                        }
                    }
                }
            );
        },

        //修改 业务类型穿梭框 左侧被选中业务类型
        up_handleAddComponent(value, direction, movedKeys) {
            this.up_busTypeList = value;
            if (direction == "right") {
                this.up_balanceList.forEach((item, index) => {
                    let params = {
                        instanFlag: 1,
                        balanceObjectCodelist: item,
                        businessProgramNo: this.tempUp.businessProgramNo,
                        businessTypeCodeList: movedKeys,
                        operationMode: this.tempUp.operationMode,
                    };
                    this.post(
                        "/beta/betaService/COS.IQ.02.0020",
                        params,
                        (res) => {
                            if (res.returnCode == "000000") {
                                if (
                                    res.returnData &&
                                    res.returnData.rows &&
                                    res.returnData.rows.length > 0
                                ) {
                                    let obj = {};
                                    this.up_balanceListInitial.forEach(
                                        (item1, index1) => {
                                            if (
                                                item1.balanceObjectCode == item
                                            ) {
                                                item1.instanList.push(
                                                    res.returnData.rows[0]
                                                );
                                            }
                                        }
                                    );
                                }
                            }
                        }
                    );
                });
            } else if (direction == "left") {
                this.up_balanceListInitial.forEach((item2, index2) => {
                    item2.instanList.forEach((item3, index3) => {
                        if (item3.businessTypeCode == movedKeys[0]) {
                            item2.instanList.splice(index3, 1);
                        }
                    });
                });
            }
        },
        // 右侧呗选中业务类型
        up_rightCheckedChange(val) {
            this.up_rightCheckedBusType = val;
        },
        // 右侧数据
        up_getRightBusData(row) {
            const rightData = [];
            let obj = {
                operationMode: row.operationMode,
                businessProgramNo: row.businessProgramNo,
            };
            this.post("/beta/betaService/COS.IQ.02.0033", obj, (res) => {
                if (res.returnCode == "000000") {
                    if (
                        res.returnData &&
                        res.returnData.rows &&
                        res.returnData.rows.length > 0
                    ) {
                        res.returnData.rows.forEach((rightItem) => {
                            rightItem.label =
                                rightItem.businessTypeCode +
                                " " +
                                rightItem.businessDesc;
                            rightItem.key = rightItem.businessTypeCode;
                            rightData.push(rightItem.businessTypeCode);
                        });
                    }
                }
            });
            return rightData;
        },
        // 左侧数据 arr: 右侧数据，需要过滤掉
        up_getLeftBusData(row, arr) {
            let componentData = []; // 相当于data
            let leftBusData = [];
            this.post("/beta/betaService/COS.IQ.02.0020", {}, (res) => {
                this.up_busTypeInitData = res.returnData.rows;
                res.returnData.rows.forEach((item) => {
                    item.label =
                        item.businessTypeCode + " " + item.businessDesc;
                    item.key = item.businessTypeCode;
                    componentData.push(item);
                });
                let isrep;
                for (let m = 0; m < componentData.length; m++) {
                    isrep = false;
                    for (let n = 0; n < this.up_busTypeList.length; n++) {
                        if (arr[n] == componentData[m].businessTypeCode) {
                            isrep = true;
                            break;
                        }
                        if (!isrep) {
                            leftBusData.push(componentData[m]);
                        }
                    }
                }
            });
            return componentData;
        },

        //修改 选择余额对象穿梭框 左侧被选中业务类型
        up_handleAddComponent2(value, direction, movedKeys) {
            if (direction == "right") {
                this.getQueryChosedBalanceIntUP(movedKeys);
                this.up_balanceList = value;
                this.up_allBalanceData.forEach((item) => {
                    item.disabled = false;
                });
            } else if (direction == "left") {
                this.up_balanceListInitial.forEach((item, index) => {
                    if (item.balanceObjectCode == movedKeys[0]) {
                        this.up_balanceListInitial.splice(index, 1);
                    }
                });
                this.up_allBalanceData.forEach((item) => {
                    item.disabled = false;
                });
            }
        },
        // 右侧被选中余额对象
        up_rightCheckedChange2(val) {
            if (val.length == "1") {
                this.up_allBalanceData.forEach((item) => {
                    if (item.balanceObjectCode == val[0]) {
                        item.disabled = false;
                    } else {
                        item.disabled = true;
                    }
                });
            } else {
                this.up_allBalanceData.forEach((item) => {
                    item.disabled = false;
                });
            }
            this.setFlag = "balaUP";
            this.up_rightCheckedBalance = val;
        },
        up_balanceLeftCheckedChange(val) {
            if (val.length == "1") {
                this.up_allBalanceData.forEach((item) => {
                    if (item.balanceObjectCode == val[0]) {
                        item.disabled = false;
                    } else {
                        item.disabled = true;
                    }
                });
            } else {
                this.up_allBalanceData.forEach((item) => {
                    item.disabled = false;
                });
            }
            this.setFlag = "balaUP";
            this.up_leftCheckedBalance = val;
        },
        // 右侧数据
        up_getRightBusData2(row) {
            const rightData = [];
            let obj = {
                operationMode: row.operationMode,
                businessProgramNo: row.businessProgramNo,
            };
            this.post("/beta/betaService/COS.IQ.02.0136", obj, (res) => {
                if (res.returnCode == "000000") {
                    if (
                        res.returnData &&
                        res.returnData.rows &&
                        res.returnData.rows.length > 0
                    ) {
                        this.up_balanceListInitial = res.returnData.rows;
                        res.returnData.rows.forEach((rightItem) => {
                            rightItem.label =
                                rightItem.balanceObjectCode +
                                " " +
                                rightItem.objectDesc;
                            rightItem.key = rightItem.balanceObjectCode;
                            rightData.push(rightItem.balanceObjectCode);
                        });
                    } else {
                        this.up_balanceListInitial = {};
                    }
                }
            });
            return rightData;
        },
        // 左侧数据 arr: 右侧数据，需要过滤掉
        up_getLeftBusData2(row, arr) {
            let componentData = []; // 相当于data
            let leftBusData = [];
            this.post(
                "/beta/betaService/COS.IQ.02.0021",
                { operationMode: row.operationMode },
                (res) => {
                    this.up_balanceInitData = res.returnData.rows;
                    res.returnData.rows.forEach((item) => {
                        item.label =
                            item.balanceObjectCode + " " + item.objectDesc;
                        item.key = item.balanceObjectCode;
                        componentData.push(item);
                    });
                    let isrep;
                    for (let m = 0; m < componentData.length; m++) {
                        isrep = false;
                        for (let n = 0; n < this.up_balanceList.length; n++) {
                            if (arr[n] == componentData[m].balanceObjectCode) {
                                isrep = true;
                                break;
                            }
                            if (!isrep) {
                                leftBusData.push(componentData[m]);
                            }
                        }
                    }
                }
            );
            return componentData;
        },
        // 查询余额对象实例化
        up_handleBalaIn() {
            if (this.up_rightCheckedBalance.length != 1) {
                this.$message({
                    message: "请选择右侧一个余额对象",
                    type: "warning",
                });
                return;
            }
            this.viewBalIntDialog = true;
            this.balaInt_part1 = true;
            this.balaInt_part2 = false;
            this.up_seBalance = this.up_rightCheckedBalance;
            this.setFlag = "balaUP";
            this.up_balanceListInitial.forEach((item) => {
                if (item.balanceObjectCode == this.up_rightCheckedBalance[0]) {
                    this.balanctInList = item.instanList;
                }
            });
        },

        // 获取业务项目参数设置
        up_getBusItemIntList(row) {
            let params = {
                instanCode: row.businessProgramNo,
                operationMode: row.operationMode,
            };
            this.post("/beta/betaService/COS.IQ.02.0015", params, (res) => {
                if (res.returnCode == "000000") {
                    if (
                        res.returnData &&
                        res.returnData.rows &&
                        res.returnData.rows.length > 0
                    ) {
                        this.up_busItemInList = res.returnData.rows;
                        this.objParamFlag = "up_busItem";
                    }
                }
            });
        },
        setBusTypeBtn_UP() {
            if (this.up_rightCheckedChange.length != 1) {
                this.$message({
                    message: "请选择右侧一个业务类型",
                    type: "warning",
                });
                return;
            }
            this.$set(
                this.tempUp,
                "defaultBusinessType",
                this.up_rightCheckedBusType.join()
            );
        },
    },
};
</script>

<style>
/* 穿梭框样式 */
.el-transfer-panel {
    width: 37%;
}
</style>

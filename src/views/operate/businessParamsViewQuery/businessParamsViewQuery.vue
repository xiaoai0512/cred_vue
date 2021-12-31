<!-- 产品参数一览 -->
<template>
    <div class="allContent">
        <el-form
            ref="queryFormRef"
            :model="queryFormObj"
            :rules="queryFormObjRules"
        >
            <el-form-item
                class="cl_td"
                label="运营模式"
                prop="operationMode"
                :rules="[{ required: true, message: '运营模式不能为空' }]"
            >
                <el-select
                    v-model="queryFormObj.operationMode"
                    class="wd200"
                    clearable
                    @change="getProChange"
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
                label="产品代码"
                prop="productObjectCode"
                :rules="[{ required: true, message: '产品代码不能为空' }]"
            >
                <el-select
                    v-model="queryFormObj.productObjectCode"
                    class="wd200"
                    clearable
                >
                    <el-option
                        v-for="(item, index) in productObjectCodeOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.productObjectCode"
                    />
                </el-select>
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button
                    size="medium"
                    icon="el-icon-search"
                    type="primary"
                    @click="queryHandle"
                    >查询</el-button
                >
            </div>
        </el-form>

        <div :hidden="isHidden">
            <div class="text_title padLf10">产品基本信息</div>
            <el-form
                ref="baseInfFormRef"
                :model="baseInfyFormObj"
                :rules="baseInfFormObjRules"
            >
                <el-form-item
                    class="cl_td"
                    label="运营模式"
                    prop="systemUnitNo"
                >
                    <el-select
                        v-model="baseInfyFormObj.operationMode"
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
                    class="cl_td"
                    label="产品代码"
                    prop="productObjectCode"
                >
                    <el-input
                        v-model="baseInfyFormObj.productObjectCode"
                        class="wd200"
                        type="text"
                        readonly
                    />
                </el-form-item>
                <el-form-item class="cl_td" label="产品描述" prop="productDesc">
                    <el-input
                        v-model="baseInfyFormObj.productDesc"
                        class="wd200"
                        type="text"
                        readonly
                    />
                </el-form-item>
                <el-form-item class="cl_td" label="发行卡BIN" prop="binNo">
                    <el-input
                        v-model="baseInfyFormObj.binNo"
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
                        v-model="baseInfyFormObj.paymentPriority"
                        class="wd200"
                        type="text"
                        readonly
                    />
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="产品期限(月)"
                    prop="productTimeLimit"
                >
                    <el-input
                        v-model="baseInfyFormObj.productTimeLimit"
                        class="wd200"
                        type="text"
                        readonly
                    />
                </el-form-item>
            </el-form>

            <div class="text_title padLf10">产品业务项目</div>
            <el-table
                v-loading="table1Loading"
                :data="table1List"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%"
                border
            >
                <el-table-column
                    prop="businessProgramNo"
                    label="业务项目代码"
                    align="center"
                />
                <el-table-column
                    prop="businessDesc"
                    label="业务项目描述"
                    align="center"
                />
                <el-table-column
                    prop=""
                    label="争议业务类型及描述"
                    align="center"
                >
                    <template slot-scope="{ row }">
                        {{ row.disputeBusinessType }}
                        {{ row.disputeBusinessTypeDesc }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop=""
                    label="费用业务类型及描述"
                    align="center"
                >
                    <template slot-scope="{ row }">
                        {{ row.feeBusinessType }} {{ row.feeBusinessTypeDesc }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="paymentPriority"
                    label="还款优先级"
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
                            icon="el-icon-arrow-down"
                            type="primary"
                            v-show="isShowBtn"
                            @click="handleBusParamView(row)"
                            >业务项目参数一览</el-button
                        >
                        <el-button
                            size="mini"
                            icon="el-icon-arrow-up"
                            type="primary"
                            v-show="!isShowBtn"
                            @click="handleDraw(row)"
                            >收起</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
            <pagination
                v-show="table1Total > 0"
                :total="table1Total"
                :page.sync="table1FormObj.pageNum"
                :limit.sync="table1FormObj.pageSize"
                @pagination="getList1"
            />

            <!-- 已选业务类型 -->
            <div v-show="isShowPart">
                <div class="text_title padLf10">已选业务类型</div>
                <el-table
                    v-loading="table6Loading"
                    :data="table6List"
                    class="mbtm20"
                    fit
                    highlight-current-row
                    style="width: 100%"
                    border
                >
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
                                @click="handleBusTypeParam(row)"
                                >业务类型参数详情</el-button
                            >
                        </template>
                    </el-table-column>
                </el-table>
                <pagination
                    v-show="table6Total > 0"
                    :total="table6Total"
                    :page.sync="table6FormObj.pageNum"
                    :limit.sync="table6FormObj.pageSize"
                    @pagination="getList6(getList6Obj)"
                />

                <!-- 业务项目选项 -->
                <some-param-option
                    v-if="table7List"
                    :textTitle="textTitle7"
                    :list="table7List"
                    @viewParamClick="hadleViewParam"
                ></some-param-option>
                <pagination
                    v-show="table7Total > 0"
                    :total="table7Total"
                    :page.sync="table7FormObj.pageNum"
                    :limit.sync="table7FormObj.pageSize"
                    @pagination="getList7()"
                />
            </div>

            <!-- 产品参数选项 . -->
            <some-param-option
                v-if="table2List"
                :textTitle="textTitle2"
                :list="table2List"
                @viewParamClick="hadleViewParam"
            ></some-param-option>
            <pagination
                v-show="table2Total > 0"
                :total="table2Total"
                :page.sync="table2FormObj.pageNum"
                :limit.sync="table2FormObj.pageSize"
                @pagination="getList2"
            />

            <!-- 产品差异化PCD信息 -->
            <some-param-option
                v-if="table3List"
                :textTitle="textTitle3"
                :list="table3List"
                @viewParamClick="hadleViewParam"
            ></some-param-option>
            <pagination
                v-show="table3Total > 0"
                :total="table3Total"
                :page.sync="table3FormObj.pageNum"
                :limit.sync="table3FormObj.pageSize"
                @pagination="getList3"
            />

            <div class="text_title padLf10">产品基础收费项目</div>
            <el-table
                v-loading="table4Loading"
                :data="table4List"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%"
                border
            >
                <el-table-column
                    prop="feeItemNo"
                    label="收费项目"
                    align="center"
                />
                <el-table-column
                    prop="feeDesc"
                    label="费用描述"
                    align="center"
                />
                <el-table-column
                    prop=""
                    label="费用收取维度1及描述"
                    align="center"
                >
                    <template slot-scope="{ row }">
                        {{ row.instanCode1 }} {{ row.instanDesc1 }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop=""
                    label="费用收取维度2及描述"
                    align="center"
                >
                    <template slot-scope="{ row }">
                        {{ row.instanCode2 }} {{ row.instanDesc2 }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="baseFee"
                    label="基本费用"
                    align="center"
                />
                <el-table-column
                    prop=""
                    label="操作"
                    align="center"
                    width="150"
                >
                    <template slot-scope="{ row }">
                        <el-button
                            size="mini"
                            icon="el-icon-more"
                            type="primary"
                            @click="feeHandleDetail(row)"
                            >详情</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
            <pagination
                v-show="table4Total > 0"
                :total="table4Total"
                :page.sync="table4FormObj.pageNum"
                :limit.sync="table4FormObj.pageSize"
                @pagination="getList4"
            />

            <div class="text_title padLf10">产品增值服务费</div>
            <el-table
                v-loading="table5Loading"
                :data="table5List"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%"
                border
            >
                <el-table-column
                    prop="feeItemNo"
                    label="收费项目"
                    align="center"
                />
                <el-table-column
                    prop="feeDesc"
                    label="费用描述"
                    align="center"
                />
                <el-table-column
                    prop=""
                    label="费用收取维度1及描述"
                    align="center"
                >
                    <template slot-scope="{ row }">
                        {{ row.instanCode1 }} {{ row.instanDesc1 }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop=""
                    label="费用收取维度2及描述"
                    align="center"
                >
                    <template slot-scope="{ row }">
                        {{ row.instanCode2 }} {{ row.instanDesc2 }}
                    </template>
                </el-table-column>
                <el-table-column
                    prop="baseFee"
                    label="基本费用"
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
                            icon="el-icon-more"
                            type="primary"
                            @click="feeHandleDetail(row)"
                            >查询详情</el-button
                        >
                    </template>
                </el-table-column>
            </el-table>
            <pagination
                v-show="table5Total > 0"
                :total="table5Total"
                :page.sync="table5FormObj.pageNum"
                :limit.sync="table5FormObj.pageSize"
                @pagination="getList5"
            />
        </div>

        <!-- 收费项目实例详情  -->
        <el-dialog
            title="收费项目实例详情"
            :visible.sync="in_dialogDetail"
            width="75%"
            :close-on-click-modal="false"
        >
            <pay-item-base-info
                ref=""
                :formObj="in_tempDetail"
                :showChoseBtn="showChoseBtn"
                :showInstanDimen="showInstanDimen"
            ></pay-item-base-info>
            <cost-matrix-info
                :formObj="in_tempDetail"
                v-if="showMethod"
            ></cost-matrix-info>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="in_dialogDetail = false">
                    关闭
                </el-button>
            </div>
        </el-dialog>

        <!-- 查看pcd 参数 弹窗-->
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

        <!-- 业务类型参数详情 -->
        <el-dialog
            title="业务类型信息"
            :visible.sync="viewParam_dialog"
            width="85%"
        >
            <el-form
                ref="busTypeParamFormRef"
                :model="busTypeParamFormObj"
                :rules="busTypeParamFormObjRules"
            >
                <el-form-item
                    class="cl_td"
                    label="业务类型代码"
                    prop="businessTypeCode"
                >
                    <el-input
                        v-model="busTypeParamFormObj.businessTypeCode"
                        class="wd200"
                        type="text"
                        readonly
                    />
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="businessDesc">
                    <el-input
                        v-model="busTypeParamFormObj.businessDesc"
                        class="wd200"
                        type="text"
                        readonly
                    />
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="对应额度节点"
                    prop="creditTreeNode"
                >
                    <el-input
                        v-model="busTypeParamFormObj.creditTreeNode"
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
                        v-model="busTypeParamFormObj.paymentPriority"
                        class="wd200"
                        type="text"
                        readonly
                    />
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="交易识别代码"
                    prop="transIdentificationCode"
                >
                    <el-select
                        v-model="busTypeParamFormObj.transIdentificationCode"
                        class="wd200"
                        clearable
                        disabled
                    >
                        <el-option
                            v-for="(
                                item, index
                            ) in transIdentificationCodeOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="业务形态"
                    prop="businessForm"
                >
                    <el-select
                        v-model="busTypeParamFormObj.businessForm"
                        class="wd200"
                        clearable
                        disabled
                    >
                        <el-option
                            v-for="(item, index) in businessFormOptions"
                            :key="index"
                            :label="item.patternDesc"
                            :value="item.businessPattern"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="业务性质"
                    prop="businessDebitCreditCode"
                >
                    <el-select
                        v-model="busTypeParamFormObj.businessDebitCreditCode"
                        class="wd200"
                        clearable
                        disabled
                    >
                        <el-option
                            v-for="(
                                item, index
                            ) in businessDebitCreditCodeOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="本金余额对象"
                    prop="defaultPrincipalBalanceObj"
                    :rules="[
                        { required: true, message: '本金余额对象不能为空' },
                    ]"
                >
                    <el-select
                        v-model="busTypeParamFormObj.defaultPrincipalBalanceObj"
                        class="wd200"
                        clearable
                        disabled
                    >
                        <el-option
                            v-for="(
                                item, index
                            ) in defaultPrincipalBalanceObjOptions"
                            :key="index"
                            :label="item.labelDesc"
                            :value="item.balanceObjectCode"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="利息余额对象"
                    prop="defaultInterestBalanceObj"
                    :rules="[
                        { required: true, message: '利息余额对象不能为空' },
                    ]"
                >
                    <el-select
                        v-model="busTypeParamFormObj.defaultInterestBalanceObj"
                        class="wd200"
                        clearable
                        disabled
                    >
                        <el-option
                            v-for="(
                                item, index
                            ) in defaultInterestBalanceObjOptions"
                            :key="index"
                            :label="item.labelDesc"
                            :value="item.balanceObjectCode"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="费用余额对象"
                    prop="defaultFeeBalanceObj"
                    :rules="[
                        { required: true, message: '费用余额对象不能为空' },
                    ]"
                >
                    <el-select
                        v-model="busTypeParamFormObj.defaultFeeBalanceObj"
                        class="wd200"
                        clearable
                        disabled
                    >
                        <el-option
                            v-for="(item, index) in defaultFeeBalanceObjOptions"
                            :key="index"
                            :label="item.labelDesc"
                            :value="item.balanceObjectCode"
                        />
                    </el-select>
                </el-form-item>
            </el-form>

            <!-- <div class="text_title padLf10">已选交易识别代码</div> -->

            <!-- 余额对象参数选项 -->
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
                @pagination="getList8(busTypeParamFormObj)"
            />

            <!-- 业务类型参数选项 -->
            <some-param-option
                v-if="table9List"
                :labelStr="labelStr"
                :textTitle="textTitle9"
                :list="table9List"
                @viewParamClick="hadleViewParam"
            >
            </some-param-option>
            <pagination
                v-show="table9Total > 0"
                :total="table9Total"
                :page.sync="table9FormObj.pageNum"
                :limit.sync="table9FormObj.pageSize"
                @pagination="getList9(busTypeParamFormObj)"
            />

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="viewParam_dialog = false">
                    关闭
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Pagination from "@/components/Pagination";
import SomeParamOption from "@/components-ider/SomeParamOption";
import ViewPcd from "@/components-ider/ViewPcd";
import PayItemBaseInfo from "@/components-ider/operate/PayItemBaseInfo"; // 收费项目实例信息
import CostMatrixInfo from "@/components-ider/operate/CostMatrixInfo"; // 费用矩阵信息

export default {
    name: "BusinessParamsViewQuery",
    components: {
        Pagination,
        SomeParamOption,
        ViewPcd,
        PayItemBaseInfo, // 收费项目实例信息
        CostMatrixInfo, // 费用矩阵信息
    },
    data() {
        return {
            // 基本信息
            queryFormRef: {},
            queryFormObjRules: {},
            queryFormObj: {},
            isHidden: true,
            baseInfFormRef: {},
            baseInfyFormObj: {},
            baseInfFormObjRules: {},
            // 产品业务项目
            table1Loading: false,
            table1List: [],
            table1Total: 0,
            table1FormObj: {
                pageSize: 10,
                pageNum: 1,
            },
            businessProgramNoSel: "",
            operationModeSel: "",
            // 产品参数选项
            table2Loading: false,
            table2List: [],
            table2Total: 0,
            table2FormObj: {
                pageSize: 10,
                pageNum: 1,
            },
            // 产品差异化PCD信息
            table3Loading: false,
            table3List: [],
            table3Total: 0,
            table3FormObj: {
                pageSize: 10,
                pageNum: 1,
            },
            // 产品基础收费项目
            table4Loading: false,
            table4List: [],
            table4Total: 0,
            table4FormObj: {
                pageSize: 10,
                pageNum: 1,
            },
            // 产品增值服务费
            table5Loading: false,
            table5List: [],
            table5Total: 0,
            table5FormObj: {
                pageSize: 10,
                pageNum: 1,
            },
            // 已选业务类型
            isShowPart: false,
            isShowBtn: true,
            table6Loading: false,
            table6List: [],
            table6Total: 0,
            table6FormObj: {
                pageSize: 10,
                pageNum: 1,
            },
            // 业务项目选项
            table7Loading: false,
            table7List: [],
            table7Total: 0,
            table7FormObj: {
                pageSize: 10,
                pageNum: 1,
            },

            // 业务类型参数详情 弹窗
            busTypeParamFormRef: {},
            busTypeParamFormObj: {},
            busTypeParamFormObjRules: {},
            // 余额对象参数选项
            table8Loading: false,
            table8List: [],
            table8Total: 0,
            table8FormObj: {
                pageSize: 10,
                pageNum: 1,
            },
            // 业务类型参数选项
            textTitle9: "业务类型参数选项",
            table9Loading: false,
            table9List: [],
            table9Total: 0,
            table9FormObj: {
                pageSize: 10,
                pageNum: 1,
            },
            // 初始化下拉框
            operationModeOptions: [],
            productObjectCodeOptions: [],
            transIdentificationCodeOptions: [],
            businessFormOptions: [],
            businessDebitCreditCodeOptions: [],
            defaultPrincipalBalanceObjOptions: [],
            defaultInterestBalanceObjOptions: [],
            defaultFeeBalanceObjOptions: [],
            // 组件值
            textTitle2: "产品参数选项",
            textTitle3: "产品差异化PCD信息",
            textTitle7: "业务项目选项",
            textTitle8: "余额对象参数选项",
            textTitle9: "业务类型参数选项",
            labelStr: "余额对象",
            colunm1: true,

            // 查看参数
            viewPcd_dialog: false,
            viewPcdTitle: "",
            viewPcdFormObj: {},

            // 业务项目参数详情
            viewParam_dialog: false,
            showMethod: true,

            // 增删改查
            tempDetail: {}, // 详情
            tempUp: {}, // 修改
            dialogFormVisibleUp: false,
            dialogFormVisibleDetail: false,
            rulesDetail: {},
            rulesUp: {},
            dataFormUp: {},
            dataFormDetil: {},

            // 收费项目实例详情
            in_dialogDetail: false,
            in_tempDetail: {},
            showChoseBtn: false,
            showInstanDimen: false,
            getList6Obj: {},
        };
    },
    created() {},
    watch: {},
    mounted() {
        // 登录信息
        let loginInfo = JSON.parse(window.sessionStorage.getItem("logininfo"));
        // 运营模式
        this.getSelectDict("/beta/betaService/COS.IQ.02.0006").then((res) => {
            this.operationModeOptions = res;
        });

        // 交易识别代码
        this.getSelectDict("dic_transIden").then((res) => {
            this.transIdentificationCodeOptions = res;
        });

        // 业务形态
        this.getSelectDict("/beta/betaService/COS.IQ.02.0035").then((res) => {
            this.businessFormOptions = res;
        });

        // 业务性质
        this.getSelectDict("dic_businessNature").then((res) => {
            this.businessDebitCreditCodeOptions = res;
        });
        // 本金余额对象
        this.post(
            "/beta/betaService/COS.IQ.02.0021",
            { objectType: "P", operationMode: loginInfo.operationMode },
            (res) => {
                if (res.returnData.rows.length > 0) {
                    res.returnData.rows.forEach((item) => {
                        item.labelDesc =
                            item.balanceObjectCode + " " + item.objectDesc;
                    });
                    this.defaultPrincipalBalanceObjOptions =
                        res.returnData.rows;
                }
            }
        );
        // 利息余额对象  objectType:'P',operationMode:$rootScope.operationMods
        this.post(
            "/beta/betaService/COS.IQ.02.0021",
            { objectType: "I", operationMode: loginInfo.operationMode },
            (res) => {
                if (res.returnData.rows.length > 0) {
                    res.returnData.rows.forEach((item) => {
                        item.labelDesc =
                            item.balanceObjectCode + " " + item.objectDesc;
                    });
                    this.defaultInterestBalanceObjOptions = res.returnData.rows;
                }
            }
        );
        // 费用余额对象
        this.post(
            "/beta/betaService/COS.IQ.02.0021",
            { objectType: "F", operationMode: loginInfo.operationMode },
            (res) => {
                if (res.returnData.rows.length > 0) {
                    res.returnData.rows.forEach((item) => {
                        item.labelDesc =
                            item.balanceObjectCode + " " + item.objectDesc;
                    });
                    this.defaultFeeBalanceObjOptions = res.returnData.rows;
                }
            }
        );
    },
    methods: {
        // 运营模式联动
        getProChange() {
            // this.queryFormObj.productObjectCode = ''
            let obj = {
                operationMode: this.queryFormObj.operationMode,
            };
            this.post("/beta/betaService/COS.IQ.02.0013 ", obj, (res) => {
                if (res.returnCode == "000000") {
                    if (
                        res.returnData &&
                        res.returnData.rows &&
                        res.returnData.rows.length > 0
                    ) {
                        let rowss = res.returnData.rows;
                        rowss.forEach((item) => {
                            item.label =
                                item.productObjectCode + " " + item.productDesc;
                        });
                        this.productObjectCodeOptions = rowss;
                    } else {
                        this.productObjectCodeOptions = [];
                    }
                }
            });
        },
        // 查询按钮
        queryHandle() {
            this.$refs["queryFormRef"].validate((valid) => {
                if (valid) {
                    this.isHidden = false;
                    this.baseInfyFormObj = {};
                    this.table1List = [];
                    this.table2List = [];
                    this.table3List = [];
                    this.table4List = [];
                    this.table5List = [];
                    (this.table1FormObj = {
                        pageSize: 10,
                        pageNum: 1,
                    }),
                        (this.table2FormObj = {
                            pageSize: 10,
                            pageNum: 1,
                        }),
                        (this.table3FormObj = {
                            pageSize: 10,
                            pageNum: 1,
                        }),
                        (this.table4FormObj = {
                            pageSize: 10,
                            pageNum: 1,
                        }),
                        (this.table5FormObj = {
                            pageSize: 10,
                            pageNum: 1,
                        }),
                        this.getBaseInf();
                    this.getList1();
                    this.getList2();
                    this.getList3();
                    this.getList4();
                    this.getList5();
                }
            });
        },

        getBaseInf() {
            //COS.IQ.02.0013
            let obj = {
                productObjectCode: this.queryFormObj.productObjectCode,
                operationMode: this.queryFormObj.operationMode,
            };
            this.getTableList(
                "/beta/betaService/COS.IQ.02.0013",
                obj,
                (res) => {
                    if (res.returnCode == "000000") {
                        if (
                            res.returnData &&
                            res.returnData.rows &&
                            res.returnData.rows.length > 0
                        ) {
                            this.baseInfyFormObj = res.returnData.rows[0];
                        } else {
                            this.baseInfyFormObj = {};
                        }
                    }
                },
                (err) => {
                    this.baseInfyFormObj = {};
                }
            );
        },
        getList1() {
            // COS.IQ.02.0014
            this.table1Loading = true;
            let obj = {
                productObjectCode: this.queryFormObj.productObjectCode,
                operationMode: this.queryFormObj.operationMode,
            };
            this.table1FormObj = Object.assign(this.table1FormObj, obj);

            this.getTableList(
                "/beta/betaService/COS.IQ.02.0014",
                this.table1FormObj,
                (res) => {
                    this.table1Loading = false;
                    if (res.returnCode == "000000") {
                        if (
                            res.returnData &&
                            res.returnData.rows &&
                            res.returnData.rows.length > 0
                        ) {
                            this.table1List = res.returnData.rows;
                            this.table1Total = res.returnData.totalCount;
                        } else {
                            this.table1List = [];
                            this.table1Total = 0;
                        }
                    }
                },
                (err) => {
                    this.table1List = [];
                    this.table1Total = 0;
                    this.table1Loading = false;
                }
            );
        },
        getList2() {
            // COS.IQ.02.0015
            this.table2Loading = true;
            let obj = {
                instanCode: this.queryFormObj.productObjectCode,
                operationMode: this.queryFormObj.operationMode,
            };
            this.table2FormObj = Object.assign(this.table2FormObj, obj);

            this.getTableList(
                "/beta/betaService/COS.IQ.02.0015",
                this.table2FormObj,
                (res) => {
                    this.table2Loading = false;
                    if (res.returnCode == "000000") {
                        if (
                            res.returnData &&
                            res.returnData.rows &&
                            res.returnData.rows.length > 0
                        ) {
                            this.table2List = res.returnData.rows;
                            this.table2Total = res.returnData.totalCount;
                        } else {
                            this.table2List = [];
                            this.table2Total = 0;
                        }
                    }
                },
                (err) => {
                    this.table2List = [];
                    this.table2Total = 0;
                    this.table2Loading = false;
                }
            );
        },
        getList3() {
            // COS.IQ.02.0068
            this.table3Loading = true;
            let obj = {
                instanCode: this.queryFormObj.productObjectCode,
                operationMode: this.queryFormObj.operationMode,
            };
            this.table3FormObj = Object.assign(this.table3FormObj, obj);

            this.getTableList(
                "/beta/betaService/COS.IQ.02.0068",
                this.table3FormObj,
                (res) => {
                    this.table3Loading = false;
                    if (res.returnCode == "000000") {
                        if (
                            res.returnData &&
                            res.returnData.rows &&
                            res.returnData.rows.length > 0
                        ) {
                            this.table3List = res.returnData.rows;
                            this.table3Total = res.returnData.totalCount;
                        } else {
                            this.table3List = [];
                            this.table3Total = 0;
                        }
                    }
                },
                (err) => {
                    this.table3List = [];
                    this.table3Total = 0;
                    this.table3Loading = false;
                }
            );
        },
        getList4() {
            // COS.IQ.02.0032
            this.table4Loading = true;
            let obj = {
                instanCode: this.queryFormObj.productObjectCode,
                operationMode: this.queryFormObj.operationMode,
                flag: 1,
                itemType: 0,
            };
            this.table4FormObj = Object.assign(this.table4FormObj, obj);
            this.getTableList(
                "/beta/betaService/COS.IQ.02.0032",
                this.table4FormObj,
                (res) => {
                    this.table4Loading = false;
                    if (res.returnCode == "000000") {
                        if (
                            res.returnData &&
                            res.returnData.rows &&
                            res.returnData.rows.length > 0
                        ) {
                            this.table4List = res.returnData.rows;
                            this.table4Total = res.returnData.totalCount;
                        } else {
                            this.table4List = [];
                            this.table4Total = 0;
                        }
                    }
                },
                (err) => {
                    this.table4List = [];
                    this.table4Total = 0;
                    this.table4Loading = false;
                }
            );
        },
        // 收费项目实例列表 详情 按钮
        feeHandleDetail(row) {
            this.in_tempDetail = {};
            this.in_tempDetail = Object.assign({}, row);
            let params = {
                feeItemNo: row.feeItemNo,
            };
            this.post("/beta/betaService/COS.IQ.02.0031", params, (res) => {
                if (res.returnCode == "000000") {
                    this.in_tempDetail.feeType = res.returnData.rows[0].feeType;
                    this.in_tempDetail.assessmentMethod =
                        res.returnData.rows[0].assessmentMethod;
                    if (this.in_tempDetail.feeMatrixApplicationDimension) {
                        this.in_tempDetail.feeMatrixApplicationDimension =
                            this.in_tempDetail.feeMatrixApplicationDimension.toString();
                    }
                    if (
                        this.in_tempDetail.assessmentMethod == "M" ||
                        this.in_tempDetail.feeType == "ANNF"
                    ) {
                        this.showMethod = true;
                    } else {
                        this.showMethod = false;
                    }
                    this.in_dialogDetail = true;
                }
            });
        },
        getList5() {
            // COS.IQ.02.0151
            this.table5Loading = true;
            let obj = {
                productObjectCode: this.queryFormObj.productObjectCode,
                operationMode: this.queryFormObj.operationMode,
                flag: 1,
                itemType: 0,
            };
            this.table5FormObj = Object.assign(this.table5FormObj, obj);

            this.getTableList(
                "/beta/betaService/COS.IQ.02.0151",
                this.table5FormObj,
                (res) => {
                    this.table5Loading = false;
                    if (res.returnCode == "000000") {
                        if (
                            res.returnData &&
                            res.returnData.rows &&
                            res.returnData.rows.length > 0
                        ) {
                            this.table5List = res.returnData.rows;
                            this.table5Total = res.returnData.totalCount;
                        } else {
                            this.table5List = [];
                            this.table5Total = 0;
                        }
                    }
                },
                (err) => {
                    this.table5List = [];
                    this.table5Total = 0;
                    this.table5Loading = false;
                }
            );
        },
        // 已选业务类型
        getList6(row) {
            this.table6Loading = true;
            let obj = {
                operationMode: row.operationMode,
                businessProgramNo: row.businessProgramNo,
            };
            this.table6FormObj = Object.assign(this.table6FormObj, obj);

            this.getTableList(
                "/beta/betaService/COS.IQ.02.0033",
                this.table6FormObj,
                (res) => {
                    this.table6Loading = false;
                    if (res.returnCode == "000000") {
                        if (
                            res.returnData &&
                            res.returnData.rows &&
                            res.returnData.rows.length > 0
                        ) {
                            this.table6List = res.returnData.rows;
                            this.table6Total = res.returnData.totalCount;
                        } else {
                            this.table6List = [];
                            this.table6Total = 0;
                        }
                    }
                },
                (err) => {
                    this.table6List = [];
                    this.table6Total = 0;
                    this.table6Loading = false;
                }
            );
        },
        // 业务项目选项
        getList7(row) {
            this.table7Loading = true;
            let obj = {
                operationMode: this.operationModeSel,
                instanCode: this.businessProgramNoSel,
            };
            this.table7FormObj = Object.assign(this.table7FormObj, obj);
            this.getTableList(
                "/beta/betaService/COS.IQ.02.0015",
                this.table7FormObj,
                (res) => {
                    this.table7Loading = false;
                    if (res.returnCode == "000000") {
                        if (
                            res.returnData &&
                            res.returnData.rows &&
                            res.returnData.rows.length > 0
                        ) {
                            this.table7List = res.returnData.rows;
                            this.table7Total = res.returnData.totalCount;
                        } else {
                            this.table7List = [];
                            this.table7Total = 0;
                        }
                    }
                },
                (err) => {
                    this.table7List = [];
                    this.table7Total = 0;
                    this.table7Loading = false;
                }
            );
        },
        // 余额对象参数选项
        getList8(row) {
            let obj = {
                artifactNo: 8,
                businessProgramNo: this.businessProgramNoSel,
                // businessProgramNo: row.businessProgramNo,
                instanCode2: row.businessTypeCode,
                operationMode: row.operationMode,
            };
            this.table8FormObj = Object.assign(this.table8FormObj, obj);
            this.getTableList(
                "/beta/betaService/COS.IQ.02.0015",
                this.table8FormObj,
                (res) => {
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
                            this.table8Total = res.returnData.totalCount;
                        } else {
                            this.table8List = [];
                            this.table8Total = 0;
                        }
                    }
                },
                (err) => {
                    this.table8List = [];
                    this.table8Total = 0;
                }
            );
        },
        // 业务类型参数选项
        getList9(row) {
            let obj = {
                artifactNo: 9,
                instanCode: row.businessTypeCode,
                operationMode: row.operationMode,
            };
            this.table9FormObj = Object.assign(this.table9FormObj, obj);
            this.getTableList(
                "/beta/betaService/COS.IQ.02.0015",
                this.table9FormObj,
                (res) => {
                    if (res.returnCode == "000000") {
                        if (
                            res.returnData &&
                            res.returnData.rows &&
                            res.returnData.rows.length > 0
                        ) {
                            this.table9List = res.returnData.rows;
                            this.table9Total = res.returnData.totalCount;
                        } else {
                            this.table9List = [];
                            this.table9Total = 0;
                        }
                    }
                },
                (err) => {
                    this.table9List = [];
                    this.table9Total = 0;
                }
            );
        },
        getBusTypeInf(row) {
            let obj = {
                businessTypeCode: row.businessTypeCode,
                operationMode: row.operationMode,
            };
            this.post("/beta/betaService/COS.IQ.02.0020", obj, (res) => {
                if (res.returnCode == "000000") {
                    if (
                        res.returnData &&
                        res.returnData.rows &&
                        res.returnData.rows.length > 0
                    ) {
                        this.busTypeParamFormObj = res.returnData.rows[0];
                    }
                }
            });
        },
        // 业务项目参数一览
        handleBusParamView(row) {
            this.businessProgramNoSel = row.businessProgramNo;
            this.operationModeSel = row.operationMode;
            this.getList6Obj.operationMode = row.operationMode;
            this.getList6Obj.businessProgramNo = row.businessProgramNo;
            this.isShowPart = true;
            this.isShowBtn = false;
            this.table6List = [];
            (this.table6FormObj = {
                pageSize: 10,
                pageNum: 1,
            }),
                (this.table7List = []);
            (this.table7FormObj = {
                pageSize: 10,
                pageNum: 1,
            }),
                this.getList6(row);
            this.getList7(row);
        },
        // 收起
        handleDraw() {
            this.isShowPart = false;
            this.isShowBtn = true;
        },
        // 查看参数
        hadleViewParam(row) {
            this.viewPcdTitle =
                "查看" + row.pcdNo + ": " + row.pcdDesc + "参数信息";
            this.viewPcd_dialog = true;
            this.viewPcdFormObj = row;
        },
        // 业务类型参数详情
        handleBusTypeParam(row) {
            (this.table8FormObj = {
                pageSize: 10,
                pageNum: 1,
            }),
                (this.table9FormObj = {
                    pageSize: 10,
                    pageNum: 1,
                }),
                (this.busTypeParamFormObj = {});
            this.table8List = [];
            this.table9List = [];
            this.getBusTypeInf(row);
            this.getList8(row);
            this.getList9(row);
            this.viewParam_dialog = true;
        },
    },
};
</script>

<style>
.cl-tr label.el-form-item__label {
    width: 20% !important;
    float: left;
}
.el-radio__label {
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

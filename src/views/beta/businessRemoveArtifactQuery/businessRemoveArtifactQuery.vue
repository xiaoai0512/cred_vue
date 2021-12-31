<!-- 业务形态 -->
<template>
    <div class="allContent">
        <!-- 表单验证demo: -->
        <el-form
            ref="businessPatternSearchForm"
            :model="businessPatternSearchForm"
            :rules="businessPatternSearchFormRules"
        >
            <el-form-item
                class="cl_td"
                :label="业务形态 "
                prop="businessPattern"
            >
                <el-input
                    v-model="businessPatternSearchForm.businessPattern"
                    class="wd200"
                    type="text"
                />
            </el-form-item>
            <el-form-item class="cl_td" :label="描述" prop="patternDesc">
                <el-input
                    v-model="businessPatternSearchForm.patternDesc"
                    class="wd200"
                    type="text"
                />
            </el-form-item>

            <div class="cl_tr text_center">
                <el-button
                    size="medium"
                    icon="el-icon-search"
                    type="primary"
                    @click="handleSearch()"
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
            :data="businessPatternList"
            class="mbtm20"
            fit
            highlight-current-row
            style="width: 100%"
            border
        >
            <el-table-column
                prop="businessPattern"
                :label="业务形态"
                align="center"
            />
            <el-table-column prop="patternDesc" :label="描述" align="center" />
            <el-table-column prop="" :label="操作" align="center">
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
                        @click="handleUpdate(row)"
                        v-show="updBtnFlag"
                        >修改</el-button
                    >
                </template>
            </el-table-column>
        </el-table>
        <pagination
            v-show="businessPatternTotal > 0"
            :total="businessPatternTotal"
            :page.sync="businessPatternSearchForm.pageNum"
            :limit.sync="businessPatternSearchForm.pageSize"
            @pagination="getBusinessPatternList"
        />

        <!-- 新增 -->
        <el-dialog
            :title="$t('businessRemoveArtifactQuery.add_business')"
            :visible.sync="dialogFormVisibleAdd"
            width="65%"
        >
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd">
                <el-form-item
                    class="cl_td"
                    :label="$t('businessRemoveArtifactQuery.businessPattern')"
                    prop="businessPattern"
                    :rules="[{ required: true, message: $t('businessRemoveArtifactQuery.validate_businessPattern')}]"
                >
                    <!-- <el-input v-model="tempAdd.businessPattern" class="wd200" type="text" /> -->
                    <el-select
                        v-model="tempAdd.businessPattern"
                        class="wd200"
                        clearable
                        :placeholder="$t('table.select')"
                    >
                        <el-option
                            v-for="(item, index) in businessPatternOption"
                            :key="index"
                            :label="item.label"
                            :value="item.value"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    :label="$t('businessRemoveArtifactQuery.patternDesc')"
                    prop="patternDesc"
                    :rules="[{ required: true, message:  $t('businessRemoveArtifactQuery.validate_patternDesc')}]"
                >
                    <el-input
                        v-model="tempAdd.patternDesc"
                        class="wd200"
                        type="text"
                    />
                </el-form-item>
                <div class="text_title">{{$t('avyList.choose_artifact')}}</div>
                <div style="margin-left: 12%">
                    <el-transfer
                        filterable
                        :filter-method="filterMethod"
                        :titles="[$t('businessRemoveArtifactQuery.select_need_exclude_component'), $t('businessRemoveArtifactQuery.select_excluded_component')]"
                        :filter-placeholder="$t('businessRemoveArtifactQuery.input_component')"
                        v-model="tempAdd.artifactListAddPage"
                        :data="add_allComponentData"
                    >
                    </el-transfer>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleAdd = false">
                    {{$t('table.cancel')}}
                </el-button>
                <el-button type="primary" @click="createData()">
                    {{$t('table.sure')}}
                </el-button>
            </div>
        </el-dialog>

        <!-- 修改 -->
        <el-dialog
            title="业务形态修改"
            :visible.sync="dialogFormVisibleUp"
            width="65%"
        >
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp">
                <el-form-item
                    class="cl_td"
                    :label="业务形态"
                    prop="businessPattern"
                    :rules="[{ required: true, message: '业务形态不能为空' }]"
                >
                    <el-input
                        v-model="tempUp.businessPattern"
                        class="wd200"
                        type="text"
                        readonly
                    />
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    :label="描述"
                    prop="patternDesc"
                    :rules="[{ required: true, message: '描述不能为空' }]"
                >
                    <el-input
                        v-model="tempUp.patternDesc"
                        class="wd200"
                        type="text"
                    />
                </el-form-item>
                <div class="text_title">选择构件</div>
                <!-- v-model="tempUp.havedComponent" -->
                <div style="margin-left: 12%">
                    <el-transfer
                        filterable
                        :filter-method="filterMethod"
                        :titles="['选择需排除构件', '已排除构件']"
                        filter-placeholder="请输入构件编号"
                        v-model="havedComponentValues"
                        @change="handleChangeComponent"
                        :format="{
                            noChecked: '${total}',
                            hasChecked: '${checked}/${total}',
                        }"
                        :data="up_allComponentData"
                    >
                        <span slot-scope="{ option }">{{ option.label }}</span>
                    </el-transfer>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="up_cancel"> {{$t('table.cancel')}} </el-button>
                <el-button type="primary" @click="updateData()">
                    {{$t('table.sure')}}
                </el-button>
            </div>
        </el-dialog>

        <!-- 详情 -->
        <el-dialog
            :title="$t('businessRemoveArtifactQuery.view_business')"
            :visible.sync="dialogFormVisibleDetail"
            width="65%"
        >
            <el-form
                ref="dataFormDetail"
                :rules="rulesDetail"
                :model="tempDetail"
            >
                <el-form-item
                    class="cl_td"
                    :label="$t('businessRemoveArtifactQuery.businessPattern')"
                    prop="businessPattern"
                    :rules="[{ required: true, message: $t('businessRemoveArtifactQuery.validate_businessPattern')}]"
                >
                    <el-input
                        v-model="tempDetail.businessPattern"
                        class="wd200"
                        type="text"
                        readonly
                    />
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    :label="$t('businessRemoveArtifactQuery.patternDesc')"
                    prop="patternDesc"
                    :rules="[{ required: true, message: $t('businessRemoveArtifactQuery.validate_patternDesc')}]"
                >
                    <el-input
                        v-model="tempDetail.patternDesc"
                        class="wd200"
                        type="text"
                        readonly
                    />
                </el-form-item>
                <div class="text_title">{{$t('businessRemoveArtifactQuery.business_excluded_component')}}</div>
                <el-table
                    :data="detai_componentList"
                    class="mbtm20"
                    fit
                    highlight-current-row
                    style="width: 100%"
                    border
                >
                    <el-table-column
                        prop="artifactNo"
                        :label="$t('elmList.artifactNo')"
                        align="center"
                    />
                    <el-table-column
                        prop="artifactDesc"
                        :label="$t('elmList.artifactDesc')"
                        align="center"
                    />
                </el-table>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleDetail = false">
                    {{$t('table.close')}}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Pagination from "@/components/Pagination";
export default {
    name: "BusinessPattern",
    components: {
        // eslint-disable-next-line vue/no-unused-components
        Pagination,
    },
    data() {
        const generateData = (_) => {
            const componentData = []; // 相当于data
            const componentNoList = []; //
            const componentList = [];
            this.post("/beta/betaService/COS.IQ.02.0007", {}, (res) => {
                res.returnData.rows.forEach((item, i) => {
                    componentList.push(
                        item.artifactNo + " " + item.artifactDesc
                    );
                    componentNoList.push(item.artifactNo);
                });
                componentList.forEach((component, index) => {
                    componentData.push({
                        label: component,
                        // key: index,
                        key: component.split(" ")[0],
                        artifactNo: componentNoList[index],
                    });
                });
            });
            return componentData;
        };

        return {
            businessPatternSearchForm: {
                pageNum: 1,
                pageSize: 10,
            },
            feeItemNoList: [], // 收费目录下拉框
            businessPatternSearchFormRules: {},
            businessPatternList: [],
            businessPatternTotal: 0,

            listLoading1: false,
            selBtnFlag: false,
            addBtnFlag: false,
            updBtnFlag: false,
            btnAuthStr: "",

            tempAdd: {}, // 新增
            tempUp: {}, // 修改
            tempDetail: {}, // 详情
            dialogFormVisibleAdd: false,
            dialogFormVisibleUp: false,
            dialogFormVisibleDetail: false,
            detai_componentList: [],
            businessPatternOption: [
                { value: "R1", label: this.$t('businessRemoveArtifactQuery.businessPattern_R1')},
                { value: "R2", label: this.$t('businessRemoveArtifactQuery.businessPattern_R2') },
                { value: "S1", label: this.$t('businessRemoveArtifactQuery.businessPattern_R3') },
                { value: "S2", label: this.$t('businessRemoveArtifactQuery.businessPattern_R4') },
            ],
            rulesAdd: {},
            rulesDetail: {},
            rulesUp: {},

            add_allComponentData: generateData(),
            filterMethod(query, item) {
                return item.artifactNo.indexOf(query) > -1;
            },

            up_allComponentData: generateData(),
            havedComponentValues: [], // 选中构件

            detail_allComponentData: generateData(),
            detail_havedComponentValues: [],
        };
    },
    created() {
        // this.init()
        this.getBtnAuth();
    },
    mounted() {
        this.getBusinessPatternList();
    },
    methods: {
        // 查询按钮权限
        getBtnAuth() {
            console.log(window.sessionStorage.getItem("menuNo"));
            let params = {
                menuNo: window.sessionStorage.getItem("menuNo"),
            };
            this.businessPatternSearchForm = Object.assign(
                this.businessPatternSearchForm,
                params
            );
            this.getTableList(
                "/beta/betaService/COS.CS.01.0030",
                this.businessPatternSearchForm,
                (res) => {
                    if (res.returnCode == "000000") {
                        if (res.returnData && res.returnData.length > 0) {
                            res.returnData.forEach((item) => {
                                this.btnAuthStr += item.eventNo + ",";
                            });
                            if (this.btnAuthStr.includes("COS.IQ.02.0035")) {
                                // 查询
                                this.selBtnFlag = true;
                            } else {
                                this.selBtnFlag = false;
                            }
                            if (this.btnAuthStr.includes("COS.AD.02.0030")) {
                                // 新增
                                this.addBtnFlag = true;
                            } else {
                                this.addBtnFlag = false;
                            }
                            if (this.btnAuthStr.includes("COS.UP.02.0034")) {
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
        // 事件清单列表
        getBusinessPatternList() {
            this.listLoading1 = true;
            this.getTableList(
                "/beta/betaService/COS.IQ.02.0035",
                this.businessPatternSearchForm,
                (res) => {
                    this.listLoading1 = false;
                    if (res.returnCode == "000000") {
                        if (
                            res.returnData &&
                            res.returnData.rows &&
                            res.returnData.rows.length > 0
                        ) {
                            this.businessPatternList = res.returnData.rows;
                            this.businessPatternTotal =
                                res.returnData.totalCount;
                        } else {
                            this.businessPatternList = [];
                            this.businessPatternTotal = 0;
                        }
                    }
                },
                (err) => {
                    this.businessPatternList = [];
                    this.businessPatternTotal = 0;
                    this.listLoading1 = false;
                }
            );
        },
        handleSearch() {
            this.businessPatternSearchForm.pageNum = 1
            this.businessPatternSearchForm.pageSize = 10
            this.getBusinessPatternList();
        },

        handleCreate() {
            this.dialogFormVisibleAdd = true;
            this.$nextTick(() => {
                this.$refs["dataFormAdd"].clearValidate();
            });
        },
        createData() {
            this.$refs["dataFormAdd"].validate((valid) => {
                if (valid) {
                    this.tempAdd.artifactList = [];
                    this.tempAdd.artifactListAddPage.forEach((item, k) => {
                        this.tempAdd.artifactList.push({ artifactNo: item });
                    });
                    delete this.tempAdd.artifactListAddPage;
                    this.post(
                        "/beta/betaService/COS.AD.02.0030",
                        this.tempAdd,
                        (res) => {
                            if (res.returnCode == "000000") {
                                this.dialogFormVisibleAdd = false;
                                this.$notify({
                                    message: this.$t('table.add_success'),
                                    type: "success",
                                });
                                this.getBusinessPatternList();
                                this.tempAdd = {};
                            }
                        }
                    );
                }
            });
        },

        handleUpdate(row) {
            this.tempUp = Object.assign({}, row);
            // 查询已有构件
            this.post(
                "/beta/betaService/COS.IQ.02.0036",
                { businessPattern: row.businessPattern },
                (res) => {
                    if (res.returnData && res.returnData.rows) {
                        res.returnData.rows.forEach((item, k) => {
                            this.havedComponentValues.push(item.artifactNo);
                        });
                        this.tempUp.artifactListUpPage =
                            this.havedComponentValues;
                        this.dialogFormVisibleUp = true;
                        this.$nextTick(() => {
                            this.$refs["dataFormUp"].clearValidate();
                        });
                    } else {
                        this.havedComponentValues = [];
                        this.tempUp.artifactListUpPage = [];
                        this.dialogFormVisibleUp = true;
                        this.$nextTick(() => {
                            this.$refs["dataFormUp"].clearValidate();
                        });
                    }
                }
            );
        },
        updateData() {
            this.$refs["dataFormUp"].validate((valid) => {
                if (valid) {
                    this.tempUp.artifactList = [];
                    this.tempUp.artifactListUpPage.forEach((item, k) => {
                        this.tempUp.artifactList.push({ artifactNo: item });
                    });
                    delete this.tempUp.artifactListUpPage;
                    this.post(
                        "/beta/betaService/COS.UP.02.0034",
                        this.tempUp,
                        (res) => {
                            if (res.returnCode == '000000') {
                                 this.dialogFormVisibleUp = false;
                                this.$notify({
                                    message:  this.$t('table.up_success'),
                                    type: "success",
                                });
                                this.getBusinessPatternList();
                                this.tempUp = {}
                            }
                        }
                    );
                }
            });
        },
        up_cancel() {
            this.dialogFormVisibleUp = false;
            this.havedComponentValues = [];
        },
        handleChangeComponent(value, direction, movedKeys) {
            // console.log(value, direction, movedKeys)
            this.tempUp.artifactListUpPage = value;
        },

        handleDetail(row) {
            this.tempDetail = Object.assign({}, row);
            // 查询已有构件
            this.post(
                "/beta/betaService/COS.IQ.02.0036",
                { businessPattern: row.businessPattern },
                (res) => {
                    if (res.returnData && res.returnData.rows) {
                        this.detai_componentList = res.returnData.rows;
                        this.dialogFormVisibleDetail = true;
                        this.$nextTick(() => {
                            this.$refs["dataFormDetail"].clearValidate();
                        });
                    } else {
                        this.detai_componentList = [];
                        this.dialogFormVisibleDetail = true;
                        this.$nextTick(() => {
                            this.$refs["dataFormDetail"].clearValidate();
                        });
                    }
                }
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

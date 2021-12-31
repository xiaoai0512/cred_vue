<!-- 法人实体 -->
<template>
    <div class="allContent">
        <!-- 表单验证demo: -->
        <el-form
            ref="legalEntitySearchForm"
            :model="legalEntitySearchForm"
            :rules="legalEntitySearchFormRules"
        >
            <el-form-item
                class="cl_td"
                :label="$t('legalEntityQuery.corporationEntityNo')"
                prop="corporationEntityNo"
            >
                <el-input
                    v-model="legalEntitySearchForm.corporationEntityNo"
                    class="wd200"
                    type="text"
                />
            </el-form-item>
            <el-form-item
                class="cl_td"
                :label="$t('legalEntityQuery.corporationEntityName')"
                prop="corporationEntityName"
            >
                <el-input
                    v-model="legalEntitySearchForm.corporationEntityName"
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
                    >{{$t('search.query')}}</el-button
                >
                <el-button
                    size="medium"
                    icon="el-icon-plus"
                    type="primary"
                    @click="handleCreate()"
                    v-show="addBtnFlag"
                    >{{$t('search.add')}}</el-button
                >
            </div>
        </el-form>
        <el-table
            v-loading="listLoading1"
            :data="legalEntityList"
            class="mbtm20"
            fit
            highlight-current-row
            style="width: 100%"
            border
        >
            <el-table-column
                prop="corporationEntityNo"
                :label="$t('legalEntityQuery.corporationEntityNo')"
                align="center"
            />
            <el-table-column
                prop="corporationEntityName"
                :label="$t('legalEntityQuery.corporationEntityName')"
                align="center"
            />
            <el-table-column
                prop="systemUnitNo"
                :label="$t('legalEntityQuery.systemUnitNo')"
                align="center"
            />
            <el-table-column
                prop="operationMode"
                :label="$t('legalEntityQuery.operationMode')"
                align="center"
            />
            <el-table-column prop="" :label="$t('table.action')" align="center" width="350">
                <template slot-scope="{ row }">
                    <el-button
                        size="mini"
                        icon="el-icon-more"
                        type="primary"
                        @click="handleDetail(row)"
                        v-show="selBtnFlag"
                        >{{$t('table.detail')}}</el-button
                    >
                    <el-button
                        size="mini"
                        icon="el-icon-edit"
                        type="primary"
                        @click="handleUpdate(row)"
                        v-show="updBtnFlag"
                        >{{$t('table.edit')}}</el-button
                    >
                    <el-button
                        size="mini"
                        icon="el-icon-document-copy"
                        type="primary"
                        @click="handleCopy(row)"
                        v-show="addBtnFlag"
                        >{{$t('table.copy')}}</el-button
                    >
                </template>
            </el-table-column>
        </el-table>
        <pagination
            v-show="legalEntityTotal > 0"
            :total="legalEntityTotal"
            :page.sync="legalEntitySearchForm.pageNum"
            :limit.sync="legalEntitySearchForm.pageSize"
            @pagination="getLegalEntityList"
        />

        <!-- 新增 -->
        <el-dialog
            :title="$t('legalEntityQuery.add_corporation')"
            :visible.sync="dialogFormVisibleAdd"
            width="65%"
        >
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd">
                <el-form-item
                    class="cl_td"
                    :label="$t('legalEntityQuery.corporationEntityNo')"
                    prop="corporationEntityNo"
                    :rules="[
                        { required: true, message:  $t('legalEntityQuery.validate_corporationEntityNo')},
                    ]"
                >
                    <el-input
                        v-model="tempAdd.corporationEntityNo"
                        class="wd200"
                        type="text"
                        maxlength="10"
                    />
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    :label="$t('legalEntityQuery.corporationEntityName')"
                    prop="corporationEntityName"
                    :rules="[
                        { required: true, message: $t('legalEntityQuery.validate_corporationEntityName')},
                    ]"
                >
                    <el-input
                        v-model="tempAdd.corporationEntityName"
                        class="wd200"
                        type="text"
                    />
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    :label="$t('legalEntityQuery.systemUnitNo')"
                    prop="systemUnitNo"
                    :rules="[
                        { required: true, message: $t('legalEntityQuery.validate_systemUnitNo')},
                    ]"
                >
                    <el-select
                        v-model="tempAdd.systemUnitNo"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in systemUnitNoOptions"
                            :key="index"
                            :label="item.systemUnitName"
                            :value="item.systemUnitNo"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    :label="$t('legalEntityQuery.operationMode')"
                    prop="operationMode"
                    :rules="[
                        { required: true, message: $t('legalEntityQuery.validate_operationMode') },
                    ]"
                >
                    <el-select
                        v-model="tempAdd.operationMode"
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

        <!-- 详情 -->
        <el-dialog
            :title="$t('legalEntityQuery.view_corporation')"
            :visible.sync="dialogFormVisibleDetail"
            width="65%"
        >
            <el-form ref="dataFormDetail" :model="tempDetail">
                <el-form-item
                    class="cl_td"
                    :label="$t('legalEntityQuery.corporationEntityNo')"
                    prop="corporationEntityNo"
                    :rules="[
                        { required: true, message: $t('legalEntityQuery.validate_corporationEntityNo')},
                    ]"
                >
                    <el-input
                        v-model="tempDetail.corporationEntityNo"
                        class="wd200"
                        type="text"
                        disabled
                    />
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    :label="$t('legalEntityQuery.corporationEntityName')"
                    prop="corporationEntityName"
                >
                    <el-input
                        v-model="tempDetail.corporationEntityName"
                        class="wd200"
                        type="text"
                        disabled
                    />
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    :label="$t('legalEntityQuery.systemUnitNo')"
                    prop="systemUnitNo"
                >
                    <el-select
                        v-model="tempDetail.systemUnitNo"
                        class="wd200"
                        clearable
                        disabled
                    >
                        <el-option
                            v-for="(item, index) in systemUnitNoOptions"
                            :key="index"
                            :label="item.systemUnitName"
                            :value="item.systemUnitNo"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    :label="$t('legalEntityQuery.operationMode')"
                    prop="operationMode"
                >
                    <el-select
                        v-model="tempDetail.operationMode"
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
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleDetail = false">
                    {{$t('table.close')}}
                </el-button>

                <!-- <el-button type="primary" @click="createData()">
                {{$t('table.sure')}}
            </el-button> -->
            </div>
        </el-dialog>

        <!-- 修改 -->
        <el-dialog
            :title="$t('legalEntityQuery.update_corporation')"
            :visible.sync="dialogFormVisibleUp"
            width="65%"
        >
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp">
                <el-form-item
                    class="cl_td"
                    :label="$t('legalEntityQuery.corporationEntityNo')"
                    prop="corporationEntityNo"
                    :rules="[
                        { required: true, message: $t('legalEntityQuery.validate_corporationEntityNo')},
                    ]"
                >
                    <el-input
                        v-model="tempUp.corporationEntityNo"
                        class="wd200"
                        type="text"
                        disabled
                    />
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    :label="$t('legalEntityQuery.corporationEntityName')"
                    prop="corporationEntityName"
                    :rules="[
                        { required: true, message: $t('legalEntityQuery.validate_corporationEntityName')},
                    ]"
                >
                    <el-input
                        v-model="tempUp.corporationEntityName"
                        class="wd200"
                        type="text"
                    />
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    :label="$t('legalEntityQuery.systemUnitNo')"
                    prop="systemUnitNo"
                    :rules="[
                        { required: true, message: $t('legalEntityQuery.validate_systemUnitNo')},
                    ]"
                >
                    <el-select
                        v-model="tempUp.systemUnitNo"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in systemUnitNoOptions"
                            :key="index"
                            :label="item.systemUnitName"
                            :value="item.systemUnitNo"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    :label="$t('legalEntityQuery.operationMode')"
                    prop="operationMode"
                    :rules="[
                        { required: true, message:  $t('legalEntityQuery.validate_operationMode')},
                    ]"
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
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleUp = false">
                    {{$t('table.cancel')}}
                </el-button>
                <el-button type="primary" @click="updateData()">
                    {{$t('table.sure')}}
                </el-button>
            </div>
        </el-dialog>

        <!-- 复制 -->
        <el-dialog
            :title="$t('legalEntityQuery.copy_corporation')"
            :visible.sync="dialogFormVisibleCopy"
            width="65%"
        >
            <el-form ref="dataFormCopy" :rules="rulesCopy" :model="tempCopy">
                <el-form-item
                    class="cl_td"
                    :label="$t('legalEntityQuery.corporationEntityNo')"
                    prop="corporationEntityNo"
                    :rules="[
                        { required: true, message: $t('legalEntityQuery.validate_corporationEntityNo')},
                    ]"
                >
                    <el-input
                        v-model="tempCopy.corporationEntityNo"
                        class="wd200"
                        type="text"
                        maxlength="10"
                    />
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    :label="$t('legalEntityQuery.corporationEntityName')"
                    prop="corporationEntityName"
                    :rules="[
                        { required: true, message: $t('legalEntityQuery.validate_corporationEntityName')},
                    ]"
                >
                    <el-input
                        v-model="tempCopy.corporationEntityName"
                        class="wd200"
                        type="text"
                    />
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    :label="$t('legalEntityQuery.systemUnitNo')"
                    prop="systemUnitNo"
                    :rules="[
                        { required: true, message:  $t('legalEntityQuery.validate_systemUnitNo')},
                    ]"
                >
                    <el-select
                        v-model="tempCopy.systemUnitNo"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in systemUnitNoOptions"
                            :key="index"
                            :label="item.systemUnitName"
                            :value="item.systemUnitNo"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    :label="$t('legalEntityQuery.operationMode')"
                    prop="operationMode"
                    :rules="[
                        { required: true, message: $t('legalEntityQuery.validate_operationMode')},
                    ]"
                >
                    <el-select
                        v-model="tempCopy.operationMode"
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
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleCopy = false">
                    {{$t('table.cancel')}}
                </el-button>
                <el-button type="primary" @click="copyData()"> {{$t('table.sure')}} </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Pagination from "@/components/Pagination";
export default {
    name: "LegalEntityList",
    components: {
        // eslint-disable-next-line vue/no-unused-components
        Pagination,
    },
    data() {
        return {
            legalEntitySearchForm: {
                pageNum: 1,
                pageSize: 10,
            },
            feeItemNoList: [], // 收费目录下拉框
            legalEntitySearchFormRules: {},
            legalEntityList: [],
            legalEntityTotal: 0,

            listLoading1: false,
            selBtnFlag: false,
            addBtnFlag: false,
            updBtnFlag: false,
            btnAuthStr: "",
            systemUnitNoOptions: [], // 系统单元编号
            operationModeOptions: [], // 缺省运营模式

            tempAdd: {}, // 新增
            tempUp: {}, // 修改
            rulesUp: {},
            tempDetail: {}, // 详情
            tempCopy: {}, // 复制
            dialogFormVisibleAdd: false,
            dialogFormVisibleUp: false,
            dialogFormVisibleDetail: false,
            dialogFormVisibleCopy: false,
            rulesAdd: {},
            rulesCopy: {},
        };
    },
    created() {
        // this.init()
        this.getBtnAuth();
    },
    mounted() {
        this.getLegalEntityList();

        // 系统单元编号
        this.post("/beta/betaService/COS.IQ.02.0038", {}, (res) => {
            this.systemUnitNoOptions = res.returnData.rows;
        });
        // 系统单元编号
        this.post("/beta/betaService/COS.IQ.02.0006", {}, (res) => {
            this.operationModeOptions = res.returnData.rows;
        });
    },
    methods: {
        validatorNo(rule, value, callback) {
            if (!/^[0-9]+$/.test(value)) {
                callback("必须为数字");
            } else {
                callback();
            }
        },
        // 查询按钮权限
        getBtnAuth() {
            // console.log(window.sessionStorage.getItem('menuNo'))
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
                            if (this.btnAuthStr.includes("COS.IQ.02.0037")) {
                                // 查询
                                this.selBtnFlag = true;
                            } else {
                                this.selBtnFlag = false;
                            }
                            if (this.btnAuthStr.includes("COS.AD.02.0032")) {
                                // 新增
                                this.addBtnFlag = true;
                            } else {
                                this.addBtnFlag = false;
                            }
                            if (this.btnAuthStr.includes("COS.UP.02.0036")) {
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
        // 清单列表
        getLegalEntityList() {
            this.listLoading1 = true;
            this.getTableList(
                "/beta/betaService/COS.IQ.02.0037",
                this.legalEntitySearchForm,
                (res) => {
                    this.listLoading1 = false;
                    if (res.returnCode == "000000") {
                        if (
                            res.returnData &&
                            res.returnData.rows &&
                            res.returnData.rows.length > 0
                        ) {
                            this.legalEntityList = res.returnData.rows;
                            this.legalEntityTotal = res.returnData.totalCount;
                        } else {
                            this.legalEntityList = [];
                            this.legalEntityTotal = 0;
                        }
                    }
                },
                (err) => {
                    this.legalEntityList = [];
                    this.legalEntityTotal = 0;
                    this.listLoading1 = false;
                }
            );
        },
        handleSearch() {
            this.legalEntitySearchForm.pageNum = 1
            this.legalEntitySearchForm.pageSize = 10
            this.getLegalEntityList();
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
                    this.post(
                        "/beta/betaService/COS.AD.02.0032",
                        this.tempAdd,
                        (res) => {
                          if(res.returnCode == "000000") {
                            this.dialogFormVisibleAdd = false;
                            this.$notify({
                                title: "Success",
                                message: this.$t('table.add_success'),
                                type: "success",
                                duration: 2000,
                            });
                            this.getLegalEntityList();
                            this.tempAdd = {}
                          }
                        }
                    );
                }
            });
        },
        handleDetail(row) {
            this.dialogFormVisibleDetail = true;
            this.tempDetail = Object.assign({}, row); //
            this.$nextTick(() => {
                this.$refs["dataFormDetail"].clearValidate();
            });
        },
        handleUpdate(row) {
            this.tempUp = Object.assign({}, row);
            this.dialogFormVisibleUp = true;
            this.$nextTick(() => {
                this.$refs["dataFormUp"].clearValidate();
            });
        },
        updateData() {
            this.$refs["dataFormUp"].validate((valid) => {
                if (valid) {
                    this.post(
                        "/beta/betaService/COS.UP.02.0036",
                        this.tempUp,
                        (res) => {
                            if (res.returnCode == "000000") {
                                this.dialogFormVisibleUp = false;
                                this.$notify({
                                    title: "Success",
                                    message:  this.$t('table.up_success'),
                                    type: "success",
                                    duration: 2000,
                                });
                                this.getLegalEntityList();
                            }
                        }
                    );
                }
            });
        },
        handleCopy(row) {
            this.tempCopy = Object.assign({}, row);
            this.dialogFormVisibleCopy = true;
            this.$nextTick(() => {
                this.$refs["dataFormCopy"].clearValidate();
            });
        },
        copyData() {
            this.$refs["dataFormCopy"].validate((valid) => {
                if (valid) {
                    this.post(
                        "/beta/betaService/COS.AD.02.0032",
                        this.tempCopy,
                        (res) => {
                            
                            if (res.returnCode == '000000') {
                                  this.dialogFormVisibleCopy = false;
                                this.$notify({
                                    title: "Success",
                                    message: this.$t('table.copy_success'),
                                    type: "success",
                                    duration: 2000,
                                });
                                this.getLegalEntityList();
                                this.tempCopy = {}
                            }
                          
                        }
                    );
                }
            });
        },
    },
};
</script>

<style>
</style>

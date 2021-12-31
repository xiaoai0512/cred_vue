<!-- 生命周期节点 -->
<template>
    <div class="allContent">
        <el-form :model="lifeCycleList" ref="lifeCycleForm" >
            <el-form-item class="cl_td" :label="$t('lifeCycleNodeQuery.nodeTyp')" prop="corporationEntityNo" >
                <el-select v-model="lifeCycleList.nodeTyp" class="wd200" :placeholder="$t('table.select')" clearable >
                    <el-option v-for="(item, index) in nodeTypOptions" :key="index" :label="item.detailDesc" :value="item.codes" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" :label="$t('lifeCycleNodeQuery.nodeSerialNumbr')" prop="nodeSerialNumbr" >
                <el-input  class="wd200" type="text" v-model="lifeCycleList.nodeSerialNumbr" />
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary"  @click="searchInfo()" >{{$t('search.query')}}</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="addInfo" >{{$t('search.add')}}</el-button>
            </div>
        </el-form>
        <el-table :data="list" border stripe style="width: 100%">
            <el-table-column prop="nodeTypDesc" :label="$t('lifeCycleNodeQuery.nodeTyp')" align="center" />
            <el-table-column prop="nodeSerialNumbr" :label="$t('lifeCycleNodeQuery.nodeSerialNumbr')" align="center">
                <template slot-scope="scope">
                    <span class="">{{ scope.row.nodeSerialNumbr }}</span>
                </template>
            </el-table-column>
            <el-table-column prop="address" :label="$t('lifeCycleNodeQuery.nodeDesc')" align="center">
                <template slot-scope="scope">
                    <span class="">{{ scope.row.nodeDesc }}</span>
                </template>
            </el-table-column>
            <el-table-column align="center" :label="$t('table.action')">
                <template slot-scope="scope">
                    <el-button
                        size="mini"
                        icon="el-icon-more"
                        type="primary"
                        @click="seeDetails(scope.row)"
                        >{{$t('table.detail')}}</el-button
                    >
                    <el-button
                        size="mini"
                        icon="el-icon-edit"
                        type="primary"
                        @click="handleUpdate(scope.row)"
                        >{{$t('table.edit')}}</el-button
                    >
                </template>
            </el-table-column>
        </el-table>
        <pagination
            v-show="total > 0"
            class="page-name"
            :total="total"
            :page.sync="lifeCycleList.pageNum"
            :limit.sync="lifeCycleList.pageSize"
            @pagination="getList"
        />
        <!--新增生命周期节点弹框-->
        <el-dialog :title="$t('lifeCycleNodeQuery.add_lifeCycleNode')" :visible.sync="dialogFormVisible" width="65%" >
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd" >
                <el-form-item :label="$t('lifeCycleNodeQuery.nodeTyp')" prop="nodeTyp" class="cl_td"
                :rules="[{ required: true, message: $t('lifeCycleNodeQuery.validate_nodeTyp')}]">
                    <el-select v-model="tempAdd.nodeTyp" class="wd200" :placeholder="$t('table.select')" clearable >
                        <el-option
                            v-for="(item, index) in nodeTypOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    :label="$t('lifeCycleNodeQuery.nodeSerialNumbr')"
                    prop="nodeSerialNumbr"
                    class="cl_td"
                    :rules="[{ required: true, message: $t('lifeCycleNodeQuery.validate_nodeSerialNumbr')}]"
                >
                    <el-input
                        class="wd200"
                        v-model="tempAdd.nodeSerialNumbr"
                    />
                </el-form-item>
                <el-form-item :label="$t('lifeCycleNodeQuery.nodeDesc')" prop="nodeDesc" class="cl_td">
                    <el-input class="wd200" v-model="tempAdd.nodeDesc" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">{{$t('table.cancel')}}</el-button>
                <el-button type="primary" @click="confirmAdd()">{{$t('table.sure')}}</el-button>
            </div>
        </el-dialog>
        <!--生命周期节点弹框详情-->
        <el-dialog :title="$t('lifeCycleNodeQuery.view_lifeCycleNode')" :visible.sync="dialogFormDetails" width="65%">
            <el-form :model="nodeDetails">
                <el-form-item :label="$t('lifeCycleNodeQuery.nodeTyp')" prop="nodeTyp" class="cl_td">
                    <el-select
                        clearable
                        v-model="nodeDetails.nodeTyp"
                        class="wd200"
                        :placeholder="$t('table.select')"
                        disabled
                    >
                        <el-option
                            v-for="(item, index) in nodeTypOptions"
                            disabled
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    :label="$t('lifeCycleNodeQuery.nodeSerialNumbr')"
                    prop="nodeSerialNumbr"
                    class="cl_td"
                >
                    <el-input class="wd200" v-model="nodeDetails.nodeSerialNumbr" disabled/>
                </el-form-item>
                <el-form-item :label="$t('lifeCycleNodeQuery.nodeDesc')" prop="nodeDesc" class="cl_td">
                    <el-input
                        class="wd200"
                        v-model="nodeDetails.nodeDesc"
                        disabled
                    />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormDetails = false">{{$t('table.cancel')}}</el-button>
            </div>
        </el-dialog>
        <!--生命周期节点弹框维护-->
        <el-dialog :title="$t('lifeCycleNodeQuery.update_lifeCycleNode')" :visible.sync="dialogFormUp" width="65%">
            <el-form ref="dataFormUpdate" :rules="rulesUp" :model="nodeUpdate">
                <el-form-item :label="$t('lifeCycleNodeQuery.nodeTyp')" prop="nodeTyp" class="cl_td"
                :rules="[{ required: true, message: $t('lifeCycleNodeQuery.validate_nodeTyp') }]">
                    <el-select
                        clearable
                        v-model="nodeUpdate.nodeTyp"
                        class="wd200"
                        :placeholder="$t('table.select')"
                        disabled
                    >
                        <el-option
                            v-for="(item, index) in nodeTypOptions"
                            disabled
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    :label="$t('lifeCycleNodeQuery.nodeSerialNumbr')"
                    prop="nodeSerialNumbr"
                    class="cl_td"
                    :rules="[{ required: true, message: $t('lifeCycleNodeQuery.validate_nodeSerialNumbr') }]"
                >
                    <el-input
                        class="wd200"
                        v-model="nodeUpdate.nodeSerialNumbr"
                        :disabled="true"
                    />
                </el-form-item>
                <el-form-item :label="$t('lifeCycleNodeQuery.nodeDesc')" prop="nodeDesc" class="cl_td">
                    <el-input class="wd200" v-model="nodeUpdate.nodeDesc" />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormUp = false">{{$t('table.cancel')}}</el-button>
                <el-button type="primary" @click="confirmUpdate()"
                    >{{$t('table.sure')}}</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>
<script>
import Pagination from "@/components/Pagination";
export default {
    components: { Pagination },
    data() {
        return {
            list: null,
            total: 0,
            lifeCycleList: {
                pageNum: 1,
                pageSize: 10,
            },
            tempAdd: {},
            dialogFormVisible: false, //新增弹框配置参数
            nodeDetails: {},
            nodeUpdate: {},
            dialogFormDetails: false, //查询弹框配置参数
            dialogFormUp: false,
            rulesAdd: {},
            rulesUp: {},
            nodeTypOptions: [],
        };
    },
    created() {
        this.getList();
    },
    mounted() {
        this.getSelectDict("dic_nodeTyp").then((res) => {
            this.nodeTypOptions = res;
        });
    },
    methods: {
        getList() {
            this.listLoading = true;
            let obj = {
                isTrans: true,
                transParams: ["dic_nodeTyp"],
                transDict: ["nodeTyp"],
            }
            obj = Object.assign(this.lifeCycleList, obj)
            this.getTableList(
                "/beta/betaService/COS.IQ.02.0024",
                obj,
                (res) => {
                    this.listLoading = false;
                    if (res.returnCode == "000000") {
                        if (
                            res.returnData &&
                            res.returnData.rows &&
                            res.returnData.rows.length > 0
                        ) {
                            this.list = res.returnData.rows;
                            this.total = res.returnData.totalCount;
                        } else {
                            this.list = [];
                            this.total = 0;
                        }
                    }
                },
                (err) => {
                    this.list = [];
                    this.total = 0;
                    this.listLoading = false;
                }
            );
        },
        //新增
        addInfo() {
            this.dialogFormVisible = true;
            this.$nextTick(() => {
                this.$refs["dataForm"].clearValidate();
            });
        },
        //新增确定按钮
        confirmAdd() {
            this.$refs["dataForm"].validate((valid) => {
                if (valid) {
                    this.post(
                        "/beta/betaService/COS.AD.02.0024",
                        this.tempAdd,
                        (res) => {
                            if (res.returnCode == "000000") {
                                this.list.unshift(this.tempAdd);
                                this.dialogFormVisible = false;
                                this.$message({
                                    message: this.$t('table.add_success'),
                                    type: "success",
                                });
                                this.tempAdd = {};
                                this.getList();
                            }
                        }
                    );
                }
            });
        },
        //列表查看详情的查询
        seeDetails(item) {
            this.dialogFormDetails = true;
            this.nodeDetails = item;
            this.$nextTick(() => {
                this.$refs["dataForm"].clearValidate();
            });
        },
        //修改
        handleUpdate(item) {
            this.dialogFormUp = true;
            this.nodeUpdate = item;
            this.$nextTick(() => {
                this.$refs["dataFormUpdate"].clearValidate();
            });
        },
        confirmUpdate() {
            this.$refs["dataFormUpdate"].validate((valid) => {
                if (valid) {
                    this.post(
                        "/beta/betaService/COS.UP.02.0024",
                        this.nodeUpdate,
                        (res) => {
                            if (res.returnCode == '000000') {
                                  this.dialogFormUp = false;
                                this.$notify({
                                    message: this.$t('table.up_success'),
                                    type: "success",
                                });
                                this.getList();
                                this.nodeUpdate = {};
                            }
                        }
                    );
                }
            });
        },
        //筛选查询
        searchInfo() {
            this.lifeCycleList.pageNum = 1;
            this.lifeCycleList.pageSize = 10;
            this.getList();
        },
    },
};
</script>

<style scoped>
</style>
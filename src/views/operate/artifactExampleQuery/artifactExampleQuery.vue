<!-- 元件应用范围 -->
<template>
    <div class="allContent">
        <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="运营模式" prop="operationMode"
                :rules="[ { required: true, message: '运营模式不能为空'} ]">
                <el-select v-model="queryFormObj.operationMode" class="wd200" clearable>
                    <el-option v-for="(item, index ) in operationModeOptions" :key="index" :label="item.modeName"
                        :value="item.operationMode" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="构件编号" prop="artifactNo">
                <el-input v-model="queryFormObj.artifactNo" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="元件编号" prop="elementNo">
                <el-input v-model="queryFormObj.elementNo" class="wd200" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="应用维度" prop="instanCode">
                <el-input v-model="queryFormObj.instanCode" class="wd200" type="text" />
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()"
                    v-show="selBtnFlag">查询</el-button>
                <!-- <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate" v-show="addBtnFlag">新增</el-button> -->
            </div>
        </el-form>
        <el-table v-loading="loading" :data="tableData" class="mbtm20" fit highlight-current-row style="width: 100%;"
            border>
            <el-table-column prop="operationMode" label="运营模式" align="center" />
            <el-table-column prop="" label="元件编号及描述" align="center" width="350">
                <template slot-scope="{row}">
                    <span class="tdDivL">{{row.elementNo}}&nbsp;&nbsp;:&nbsp;&nbsp;</span>
                    <span class="tdDivR">{{row.elementDesc}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="" label="应用维度1" align="center">
                <template slot-scope="{row}">
                    {{row.instanCode1}}{{row.instanDesc1}}
                </template>
            </el-table-column>
            <el-table-column prop="" label="应用维度2" align="center">
                <template slot-scope="{row}">
                    {{row.instanCode2}}{{row.instanDesc2}}
                </template>
            </el-table-column>
            <el-table-column prop="" label="操作" align="center">
                <template slot-scope="{row}">
                    <el-button size="mini" icon="el-icon-more" type="primary" @click="handleDetail(row)"
                        v-show="selBtnFlag">详情</el-button>
                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="config.total>0" :total="config.total" :page.sync="config.pageNum"
            :limit.sync="config.pageSize" @pagination="getList" />
        <!-- 详情 -->
        <el-dialog title="构件实例信息详情" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail" :rules="rulesDetail" :model="tempDetail">
                <el-form-item class="cl_td" label="运营模式" prop="operationMode">
                    <el-select v-model="tempDetail.operationMode" class="wd200" clearable disabled>
                        <el-option v-for="(item, index ) in operationModeOptions" :key="index" :label="item.modeName"
                            :value="item.operationMode" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="参数构件编号" prop="artifactNo">
                    <el-input v-model="tempDetail.artifactNo" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="元件编号及描述" prop="elementInfo">
                    <el-input v-model="tempDetail.elementInfo" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="应用维度1" prop="instanCodeInfo1">
                    <el-input v-model="tempDetail.instanCodeInfo1" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="应用维度2" prop="instanCodeInfo2">
                    <el-input v-model="tempDetail.instanCodeInfo2" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="应用维度3" prop="instanCodeInfo3">
                    <el-input v-model="tempDetail.instanCodeInfo3" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="应用维度4" prop="instanCodeInfo4">
                    <el-input v-model="tempDetail.instanCodeInfo4" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="应用维度5" prop="instanCodeInfo5">
                    <el-input v-model="tempDetail.instanCodeInfo5" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="执行顺序" prop="performOrder">
                    <el-input v-model="tempDetail.performOrder" class="wd200" type="text" readonly />
                </el-form-item>
            </el-form>
           
            <el-form  :model="pcdIntanceObj" v-if="showPcdDiv">
                <div class="text_title padLf10">PCD实例</div>
                <el-form-item class="cl_td red" label="PCD编号" prop="pcdNo">
                    <el-input v-model="pcdIntanceObj.pcdNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="分段类型" prop="segmentType">
                    <el-select v-model="pcdIntanceObj.segmentType" class="wd200" clearable disabled>
                        <el-option
                            v-for="(item, index ) in segmentTypeOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="基础实例维度" prop="baseInstanDimen">
                    <el-input v-model="pcdIntanceObj.baseInstanDimen" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="基础实例代码" prop="baseInstanCode">
                    <el-input v-model="pcdIntanceObj.baseInstanCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="可选实例维度" prop="optionInstanDimen">
                    <el-input v-model="pcdIntanceObj.optionInstanDimen" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" label="可选实例代码" prop="optionInstanCode">
                    <el-input v-model="pcdIntanceObj.optionInstanCode" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-table
                    :data="pcdList"
                    class="mbtm20"
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
            </el-form>

            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleDetail = false">
                    关闭
                </el-button>
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
            Pagination
        },
        data() {
            return {
                // 权限
                selBtnFlag: false,
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
                tempDetail: {}, // 详情
                dialogFormVisibleDetail: false,
                rulesDetail: {},
                // pcd实例
                showPcdDiv: false,
                pcdIntanceObj: {},
                segmentTypeOptions: [],
                pcdList: [],
            }
        },
        created() {
            this.getBtnAuth()
        },
        mounted() {
            this.getList()
            // 运营模式 
            this.getSelectDict("/beta/betaService/COS.IQ.02.0006").then(res => {
                this.operationModeOptions = res
            })
             // 分段类型
            this.getSelectDict('dic_segmentationType').then((res) => {
                this.segmentTypeOptions = res
            })
        },
        methods: {
            // 查询按钮权限
            getBtnAuth() {
                let params = {
                    menuNo: window.sessionStorage.getItem('menuNo')
                }
                this.getTableList('/beta/betaService/COS.CS.01.0030', params, (res) => {
                    if (res.returnCode == '000000') {
                        if (res.returnData && res.returnData.length > 0) {
                            res.returnData.forEach(item => {
                                this.btnAuthStr += item.eventNo + ','
                            })
                            if (this.btnAuthStr.includes('COS.IQ.02.0015')) { // 查询
                                this.selBtnFlag = true
                            } else {
                                this.selBtnFlag = false
                            }
                        }
                    }
                })
            },
            // 列表
            getList() {
                this.loading = true
                this.config = Object.assign(this.config, this.queryFormObj)
                this.getTableList('/beta/betaService/COS.IQ.02.0015', this.config, (res) => {
                    if (res.returnCode == '000000') {
                        this.loading = false
                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
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
                        this.loading = false
                })
            },
            handleSearch() {
                this.config.pageNum = 1
                this.config.pageSize = 10
                this.getList()
            },
            handleDetail(row) {
                this.tempDetail = Object.assign({}, row) // 
                this.tempDetail.elementInfo = this.tempDetail.elementNo + this.tempDetail.elementDesc
                if (this.tempDetail.instanCode1) {
                    this.tempDetail.instanCodeInfo1 = this.tempDetail.instanCode1 + this.tempDetail.instanDesc1
                }
                if (this.tempDetail.instanCode2) {
                    this.tempDetail.instanCodeInfo2 = this.tempDetail.instanCode2 + this.tempDetail.instanDesc2
                }
                if (this.tempDetail.instanCode3) {
                    this.tempDetail.instanCodeInfo3 = this.tempDetail.instanCode3 + this.tempDetail.instanDesc3
                }
                if (this.tempDetail.instanCode4) {
                    this.tempDetail.instanCodeInfo4 = this.tempDetail.instanCode4 + this.tempDetail.instanDesc4
                }
                if (this.tempDetail.instanCode5) {
                    this.tempDetail.instanCodeInfo5 = this.tempDetail.instanCode5 + this.tempDetail.instanDesc5
                }
                this.dialogFormVisibleDetail = true
                this.$nextTick(() => {
                    this.$refs['dataFormDetail'].clearValidate()
                })
                this.queryHasPcd(this.tempDetail)
            },
            // 查询是否有pcd
            queryHasPcd(row) {
                let obj ={
                    elementNo: row.elementNo
                }
                this.post('/beta/betaService/COS.IQ.02.0010', obj, (res) => {
                    if (res.returnCode == '000000') {
                        if(res.returnData.rows && res.returnData.rows.length > 0) {
                            this.pcdIntanceObj = res.returnData.rows[0]
                            this.pcdIntanceObj.segmentType = res.returnData.rows[0].segmentType
                            this.showPcdDiv = true
                            this.getPcdList(row)
                        } else {
                            this.showPcdDiv = false
                        }
                    }
                })
            },
            getPcdList(obj) {
                let params = {
                    operationMode: obj.operationMode,
                    pcdNo:  obj.elementNo.substring(0,8),
                    instanCode1:  obj.instanCode1,
                    instanCode2: obj.instanCode2,
                    instanCode3: obj.instanCode3,
                    instanCode4: obj.instanCode4,
                    instanCode5: obj.instanCode5,
                }
                this.getTableList('/beta/betaService/COS.IQ.02.0016', params, (res) => {
                    if (res.returnCode == '000000') {
                        this.loading = false
                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                            this.pcdList = res.returnData.rows 
                        } else {
                            this.pcdList = []
                        }
                    }
                })
            }
        }
    }
</script>

<style>
</style>
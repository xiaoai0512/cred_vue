<!-- 元件通用实例化 -->
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
            <el-form-item class="cl_td" label="参数构件编号" prop="artifactNo">
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
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate" v-show="addBtnFlag">新增
                </el-button>
            </div>
        </el-form>
        <el-table v-loading="loading" :data="tableData" class="mbtm20" fit highlight-current-row style="width: 100%;"
            border>
            <el-table-column prop="operationMode" label="运营模式" align="center" />
            <el-table-column prop="" label="参数构件编号" align="center">
                <template slot-scope="{row}">
                    <span class="tdDivL">{{row.artifactNo}}&nbsp;&nbsp;:&nbsp;&nbsp;</span>
                    <span class="tdDivR">{{row.artifactDesc}}</span>
                </template>
            </el-table-column>
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
            <el-table-column prop="" label="操作" align="center" width="350">
                <template slot-scope="{row}">
                    <el-button size="mini" icon="el-icon-more" type="primary" @click="handleDetail(row)"
                        v-show="selBtnFlag">详情</el-button>
                    <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleUpdate(row)"
                        v-show="updBtnFlag">修改</el-button>
                    <el-button size="mini" icon="el-icon-delete" type="primary" @click="handleDelete(row)"
                        v-show="delBtnFlag">删除</el-button>

                </template>
            </el-table-column>
        </el-table>
        <pagination v-show="config.total>0" :total="config.total" :page.sync="config.pageNum"
            :limit.sync="config.pageSize" @pagination="getList" />



        <!-- 维度实例弹窗 -->
        <el-dialog title="选择实例" :visible.sync="instanDimen_dialogFormVisibl" width="75%" append-to-body
            :close-on-click-modal="false">
            <search-table ref="serchTable" :tableLabel="tableLabel" :queryObj="queryObj" :url="url" :params="params"
                @choseCuurRow="handleCuurRow"></search-table>

            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelInstanDimenBtn">
                    取消
                </el-button>
                <el-button type="primary" @click="sureIntanData()">
                    确定
                </el-button>
            </div>
        </el-dialog>
        <!-- 选择构件弹窗 -->
        <el-dialog title="选择实例" :visible.sync="artif_dialogFormVisibl" width="75%" append-to-body
            :close-on-click-modal="false">
            <search-table ref="serchTable" :tableLabel="artif_tableLabel" :queryObj="artif_queryObj" :url="artif_url"
                :params="artif_params" @choseCuurRow="artif_handleCuurRow"></search-table>

            <div slot="footer" class="dialog-footer">
                <el-button @click="artif_dialogFormVisibl = false">
                    取消
                </el-button>
                <el-button type="primary" @click="sureArtifData()">
                    确定
                </el-button>
            </div>
        </el-dialog>
        <!-- 新增 -->
        <el-dialog title="新增" :visible.sync="dialogFormVisibleAdd" width="85%" :close-on-click-modal="false">
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd">
                <el-form-item class="cl_td" label="运营模式" prop="operationMode"
                    :rules="[ { required: true, message: '运营模式不能为空'} ]">
                    <el-select v-model="tempAdd.operationMode" class="wd200" clearable>
                        <el-option v-for="(item, index ) in operationModeOptions" :key="index" :label="item.modeName"
                            :value="item.operationMode" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td red" label="参数构件编号" prop="artifactNoInfo">
                    <el-input v-model="tempAdd.artifactNoInfo" class="wd200" type="text" :readonly="isReadonly"
                        @focus="choseArtifCodeBtn()" />
                    <div class="search_button">
                        <el-button size="small" icon="el-icon-search" type="primary" @click="choseArtifCodeBtn()">
                            选择
                        </el-button>
                    </div>
                </el-form-item>
                <el-form-item class="cl_td" label="元件编号及描述" prop="elementNo">
                    <el-select v-model="tempAdd.elementNo" class="wd200" clearable @change="getChangeElementNo">
                        <el-option v-for="(item, index ) in elementNoOptions" :key="index" 
                        :label="item.label"
                        :value="item.value" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" />

                <el-form-item class="cl_td red" label="维度取值1" prop="instanDimen1">
                    <el-select v-model="tempAdd.instanDimen1" class="wd200" clearable disabled>
                        <el-option v-for="(item, index ) in instanceDimenOptions" :key="index" :label="item.detailDesc"
                            :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="实例代码1" prop="instanCode1">
                    <el-input v-model="tempAdd.instanCode1" class="wd200" type="text" :readonly="isReadonly"
                        @focus="choseInstanCodeBtn(1)" />
                    <div class="search_button">
                        <el-button size="small" icon="el-icon-search" type="primary" @click="choseInstanCodeBtn(1)">
                            选择
                        </el-button>
                    </div>
                </el-form-item>

                <el-form-item class="cl_td red" label="维度取值2" prop="instanDimen2">
                    <el-select v-model="tempAdd.instanDimen2" class="wd200" clearable disabled>
                        <el-option v-for="(item, index ) in instanceDimenOptions" :key="index" :label="item.detailDesc"
                            :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="实例代码2" prop="instanCode2">
                    <el-input v-model="tempAdd.instanCode2" class="wd200" type="text" :readonly="isReadonly"
                        @focus="choseInstanCodeBtn(2)" />
                    <div class="search_button">
                        <el-button size="small" icon="el-icon-search" type="primary" @click="choseInstanCodeBtn(2)">
                            选择
                        </el-button>
                    </div>
                </el-form-item>

                <el-form-item class="cl_td red" label="维度取值3" prop="instanDimen3">
                    <el-select v-model="tempAdd.instanDimen3" class="wd200" clearable disabled>
                        <el-option v-for="(item, index ) in instanceDimenOptions" :key="index" :label="item.detailDesc"
                            :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="实例代码3" prop="instanCode3">
                    <el-input v-model="tempAdd.instanCode3" class="wd200" type="text" :readonly="isReadonly"
                        @focus="choseInstanCodeBtn(3)" />
                    <div class="search_button">
                        <el-button size="small" icon="el-icon-search" type="primary" @click="choseInstanCodeBtn(3)">
                            选择
                        </el-button>
                    </div>
                </el-form-item>

                <el-form-item class="cl_td red" label="维度取值4" prop="instanDimen4">
                    <el-select v-model="tempAdd.instanDimen4" class="wd200" clearable disabled>
                        <el-option v-for="(item, index ) in instanceDimenOptions" :key="index" :label="item.detailDesc"
                            :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="实例代码4" prop="instanCode4">
                    <el-input v-model="tempAdd.instanCode4" class="wd200" type="text" :readonly="isReadonly"
                        @focus="choseInstanCodeBtn(4)" />
                    <div class="search_button">
                        <el-button size="small" icon="el-icon-search" type="primary" @click="choseInstanCodeBtn(4)">
                            选择
                        </el-button>
                    </div>
                </el-form-item>

                <el-form-item class="cl_td red" label="维度取值5" prop="instanDimen5">
                    <el-select v-model="tempAdd.instanDimen5" class="wd200" clearable disabled>
                        <el-option v-for="(item, index ) in instanceDimenOptions" :key="index" :label="item.detailDesc"
                            :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="实例代码5" prop="inCode5">
                    <el-input v-model="tempAdd.instanCode5" class="wd200" type="text" :readonly="isReadonly"
                        @focus="choseInstanCodeBtn(5)" />
                    <div class="search_button">
                        <el-button size="small" icon="el-icon-search" type="primary" @click="choseInstanCodeBtn(5)">
                            选择
                        </el-button>
                    </div>
                </el-form-item>
                <el-form-item class="cl_td" label="执行顺序" prop="performOrder">
                    <el-input v-model="tempAdd.performOrder" class="wd200" type="text" />
                </el-form-item>
            </el-form>


            <div v-if="showAddPart">
                <div class="text_title padLf10">PCD实例</div>
                <set-pcd
                    :setPcdObj="tempadd_setPcdObj"
                ></set-pcd>
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


        <!-- 详情 -->
        <el-dialog title="构件实例信息" :visible.sync="dialogFormVisibleDetail" width="65%" :close-on-click-modal="false">
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
                <el-form-item class="cl_td" label="应用维度1" prop="instanCode1">
                    <el-input v-model="tempDetail.instanCode1" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="应用维度2" prop="instanCode2">
                    <el-input v-model="tempDetail.instanCode2" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="应用维度3" prop="instanCode3">
                    <el-input v-model="tempDetail.instanCode3" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="应用维度4" prop="instanCode4">
                    <el-input v-model="tempDetail.instanCode4" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="应用维度5" prop="instanCode5">
                    <el-input v-model="tempDetail.instanCode5" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="执行顺序" prop="performOrder">
                    <el-input v-model="tempDetail.performOrder" class="wd200" type="text" readonly />
                </el-form-item>

                <div v-show="part2">
                    <div class="text_title">PCD实例</div>
                    <el-form-item class="cl_td" label="PCD编号" prop="pcdNo">
                        <el-input v-model="tempDetail.pcdNo" class="wd200" type="text" readonly />
                    </el-form-item>
                    <el-form-item class="cl_td" label="分段类型" prop="segmentType">
                        <el-select v-model="tempDetail.segmentType" class="wd200" clearable disabled>
                            <el-option v-for="(item, index ) in segmentTypeOptions" :key="index"
                                :label="item.detailDesc" :value="item.codes" />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="cl_td" label="基础实例代码" prop="baseInstanCode">
                        <el-input v-model="tempDetail.baseInstanCode" class="wd200" type="text" readonly />
                    </el-form-item>
                    <el-form-item class="cl_td" label="可选实例代码" prop="optionInstanCode">
                        <el-input v-model="tempDetail.optionInstanCode" class="wd200" type="text" readonly />
                    </el-form-item>

                    <el-table :data="pcdList" class="mbtm20" fit highlight-current-row style="width: 100%;" border>
                        <el-table-column prop="segmentSerialNum" label="分段序号" align="center" />
                        <el-table-column prop="pcdType" label="取值类型" align="center" />
                        <el-table-column prop="segmentValue" label="分段取值" align="center" />
                        <el-table-column prop="pcdValue" label="取值" align="center" />
                        <el-table-column prop="pcdPoint" label="取值小数值" align="center" />
                    </el-table>

                </div>

            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleDetail = false">
                    关闭
                </el-button>
            </div>
        </el-dialog>

        <!-- 修改 -->
        <el-dialog title="构件实例信息修改" :visible.sync="dialogFormVisibleUp" width="65%" :close-on-click-modal="false">
            <el-form ref="dataFormUp" :rules="rulesAdd" :model="tempUp">
                <el-form-item class="cl_td" label="运营模式" prop="operationMode">
                    <el-select v-model="tempUp.operationMode" class="wd200" clearable disabled>
                        <el-option v-for="(item, index ) in operationModeOptions" :key="index" :label="item.modeName"
                            :value="item.operationMode" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="参数构件编号" prop="artifactNo">
                    <el-input v-model="tempUp.artifactNo" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="元件编号及描述" prop="elementInfo">
                    <el-input v-model="tempUp.elementInfo" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="应用维度1" prop="instanCode1">
                    <el-input v-model="tempUp.instanCode1" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="应用维度2" prop="instanCode2">
                    <el-input v-model="tempUp.instanCode2" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="应用维度3" prop="instanCode3">
                    <el-input v-model="tempUp.instanCode3" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="应用维度4" prop="instanCode4">
                    <el-input v-model="tempUp.instanCode4" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="应用维度5" prop="instanCode5">
                    <el-input v-model="tempUp.instanCode5" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="执行顺序" prop="performOrder">
                    <el-input v-model="tempUp.performOrder" class="wd200" type="text" readonly />
                </el-form-item>

                <div v-show="up_part2">
                    <div class="text_title">PCD实例</div>
                    <el-form-item class="cl_td" label="PCD编号" prop="pcdNo">
                        <el-input v-model="tempUp.pcdNo" class="wd200" type="text" readonly />
                    </el-form-item>
                    <el-form-item class="cl_td" label="分段类型" prop="segmentType">
                        <el-select v-model="tempUp.segmentType" class="wd200" clearable disabled>
                            <el-option v-for="(item, index ) in segmentTypeOptions" :key="index"
                                :label="item.detailDesc" :value="item.codes" />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="cl_td" label="基础实例代码" prop="baseInstanCode">
                        <el-input v-model="tempUp.baseInstanCode" class="wd200" type="text" readonly />
                    </el-form-item>
                    <el-form-item class="cl_td" label="可选实例代码" prop="optionInstanCode">
                        <el-input v-model="tempUp.optionInstanCode" class="wd200" type="text" readonly />
                    </el-form-item>

                    <el-table :data="up_pcdList" class="mbtm20" fit highlight-current-row style="width: 100%;" border>
                        <el-table-column prop="segmentSerialNum" label="分段序号" align="center" />
                        <el-table-column prop="pcdType" label="取值类型" align="center" />
                        <el-table-column prop="segmentValue" label="分段取值" align="center" />
                        <el-table-column prop="pcdValue" label="取值" align="center" />
                        <el-table-column prop="pcdPoint" label="取值小数值" align="center" />
                        <el-table-column prop="" label="操作" align="center">
                            <template slot-scope="{row, $index}">
                                <el-button size="mini" type="primary" @click="up_handleUpPcd(row, $index)">修改
                                </el-button>
                                <el-button size="mini" type="primary" @click="up_handleDeletePcd(row, $index)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-form class="mtop20" ref="up_pcdForm" :rules="up_pcdRules" :model="up_pcdTempObj"
                        v-show="up_pcdPart">
                        <el-form-item class="cl_td" label="分段序号 " prop="segmentSerialNum">
                            <el-input v-model="up_pcdTempObj.segmentSerialNum" class="wd200" type="text" />
                        </el-form-item>
                        <el-form-item class="cl_td" label="取值类型" prop="pcdType">
                            <el-select v-model="up_pcdTempObj.pcdType" class="wd200" clearable>
                                <el-option v-for="(item, index ) in pcdTypeOptions" :key="index"
                                    :label="item.detailDesc" :value="item.codes" />
                            </el-select>
                        </el-form-item>
                        <el-form-item class="cl_td" label="分段取值" prop="segmentValue">
                            <el-input v-model="up_pcdTempObj.segmentValue" class="wd200" type="text" />
                        </el-form-item>
                        <el-form-item class="cl_td" label="取值" prop="pcdValue">
                            <el-input v-model="up_pcdTempObj.pcdValue" class="wd200" type="text" />
                        </el-form-item>
                        <el-form-item class="cl_td" label="取值小数位" prop="pcdPoint">
                            <el-input v-model="up_pcdTempObj.pcdPoint" class="wd200" type="text" />
                        </el-form-item>
                        <div class="cl_tr text_center">
                            <el-button size="medium" icon="el-icon-circle-check" type="primary" @click="up_pcdSave()">保存
                            </el-button>
                            <el-button size="medium" icon="el-icon-circle-close" type="primary" @click="up_pcdClose()">
                                关闭</el-button>
                        </div>
                    </el-form>

                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleUp = false">
                    取消
                </el-button>
                <el-button type="primary" @click="updateData()">
                    确定
                </el-button>
            </div>
        </el-dialog>





    </div>
</template>

<script>
    import Pagination from "@/components/Pagination";
    import SearchTable from "@/components-ider/SearchTable";
    import SetPcd from "@/components-ider/SetPcd";

    export default {
        name: 'tableList',
        components: {
            // eslint-disable-next-line vue/no-unused-components
            Pagination,
            SearchTable,
            SetPcd
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
                    pageNum: 1,
                    pageSize: 10,
                    total: 0
                },


                // 下拉框
                operationModeOptions: [],
                segmentTypeOptions: [],
                pcdTypeOptions: [],
                instanceDimenOptions: [],
                elementNoOptions: [],

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

                // 详情
                part2: false,
                pcdList: [],

                // 修改
                up_pcdList: [],
                up_part2: false,
                up_pcdForm: {},
                up_pcdRules: {},
                up_pcdTempObj: {},
                up_pcdPart: false,
                upPcdIndex: '',

                // 新增
                isReadonly: true,
                artifactNoInfo: '',
                showAddPart: {},
                tempadd_setPcdObj: {},
                tempadd_replaceIndex: '',        

                // 构件组件
                artif_dialogFormVisibl: false,
                artif_url: '',
                artif_params: {},
                artif_tableLabel: [],
                artif_queryObj: {},
                // 维度组件 
                instanDimen_dialogFormVisibl: false,
                url: '',
                params: {},
                tableLabel: [],
                queryObj: {},

                // 选择的当前实例
                instan_currRow: {},
                intan_flag: '',
                intan_type: '',
                

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
            // 下拉框
            this.getSelectDict('dic_valueType').then((res) => {
                this.pcdTypeOptions = res
            })
            // 维度取值
            this.getSelectDict('dic_dimensionalValue').then((res) => {
                this.instanceDimenOptions = res
            })
        },
        methods: {
            // 查询按钮权限
            getBtnAuth() {
                console.log(window.sessionStorage.getItem('menuNo'))
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
                            if (this.btnAuthStr.includes('COS.AD.02.0015')) { // 新增
                                this.addBtnFlag = true
                            } else {
                                this.addBtnFlag = false
                            }
                            if (this.btnAuthStr.includes('COS.UP.02.0015')) { // 维护
                                this.updBtnFlag = true
                            } else {
                                this.updBtnFlag = false
                            }
                            if (this.btnAuthStr.includes('COS.UP.02.0026') != -1) {    //删除
                                this.delBtnFlag = true;
                            } else {
                                this.delBtnFlag = false;
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
                            rows.forEach(row => {
                                row.businessFormConcat = row.businessForm + ' ' + row.patternDesc
                            })
                            this.tableData = rows
                            this.config.total = res.returnData.totalCount
                        } else {
                            this.tableData = []
                            this.config.total = res.returnData.totalCount
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
                this.tempAdd = {}
                this.showAddPart = false
                this.getTemporaryElementNoOptions()
                this.$nextTick(() => {
                    this.$refs['dataFormAdd'].clearValidate()
                })
            },
            getTemporaryElementNoOptions() {
                let artifactNONew = ''
                this.getElementNoOptions(artifactNONew)
            },
            getChangeElementNo(val) {
                let elementObj  = {
                    elementNo: val
                }
                this.getAddPcd(elementObj)
            },
            getAddPcd(obj) {
                let pcdObj = {
                    elementNo: obj.elementNo
                }
                this.post('/beta/betaService/COS.IQ.02.0010', pcdObj, (res) => {
                    if (res.returnCode == '000000') {
                        if(res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                            this.showAddPart = true
                            this.tempadd_setPcdObj.pcdNo = obj.elementNo.substring(0,8)
                            this.tempadd_setPcdObj.baseInstanDimen = res.returnData.rows[0].baseInstanDimen;
                            if(res.returnData.rows[0].segmentType){//分段类型不为空
                                this.tempadd_setPcdObj.segmentType =  res.returnData.rows[0].segmentType
                            }
                            if(res.returnData.rows[0].pcdInitList != null){
                                this.tempadd_setPcdObj.pcdInitList = res.returnData.rows[0].pcdInitList
                            }
                        } else {
                            this.showAddPart = false
                            this.tempadd_setPcdObj = {}
                        }
                    } 
                })
                
            },
            createData() {
                if (this.tempAdd.instanDimen1) {
                    if (!this.tempAdd.instanCode1) {
                        this.$message('应用维度1不能为空')
                    }
                    return
                }
                if (this.tempAdd.instanDimen2) {
                    if (!this.tempAdd.instanCode2) {
                        this.$message('应用维度2不能为空')
                    }
                    return
                }
                if (this.tempAdd.instanDimen3) {
                    if (!this.tempAdd.instanCode3) {
                        this.$message('应用维度3不能为空')
                    }
                    return
                }
                if (this.tempAdd.instanDimen4) {
                    if (!this.tempAdd.instanCode4) {
                        this.$message('应用维度4不能为空')
                    }
                    return
                }
                if (this.tempAdd.instanDimen5) {
                    if (!this.tempAdd.instanCode5) {
                        this.$message('应用维度5不能为空')
                    }
                    return
                }
                if( this.showAddPart && this.tempadd_setPcdObj.baseInstanDimen ) {
                    if (!this.tempadd_setPcdObj.baseInstanCode) {
                        this.$message('基础实例代码不能为空')
                    }
                    return
                }
                 if( this.showAddPart && this.tempadd_setPcdObj.optionInstanDimen ) {
                    if (!this.tempadd_setPcdObj.optionInstanCode) {
                        this.$message('可选实例代码不能为空')
                    }
                    return
                }
                this.$refs['dataFormAdd'].validate((valid) => {
                    if (valid) {
                        if (this.tempadd_setPcdObj.pcdInitList.length > 0) {
                            this.tempAdd.addPcdFlag ="1";
                            this.tempAdd.pcdList = this.tempadd_setPcdObj.pcdInitList
                            this.tempAdd.pcdNo =  this.tempAdd.elementNo.substring(0,8)
                        }
                        if(this.tempadd_setPcdObj.baseInstanCode) {
                            this.tempAdd.baseInstanCode = this.tempadd_setPcdObj.baseInstanCode
                        }
                         if(this.tempadd_setPcdObj.optionInstanCode) {
                            this.tempAdd.optionInstanCode = this.tempadd_setPcdObj.optionInstanCode
                        }
                        this.post('/beta/betaService/COS.AD.02.0015', this.tempAdd, (res) => {
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
            handleDetail(row) {
                this.dialogFormVisibleDetail = true
                this.tempDetail = Object.assign({}, row) // 
                this.$nextTick(() => {
                    this.$refs['dataFormDetail'].clearValidate()
                })
                this.tempDetail.elementInfo = this.tempDetail.elementNo + this.tempDetail.elementDesc
                this.getIsPcd(row)
            },
            getIsPcd(row) {
                let obj = {
                    elementNo: row.elementNo
                }
                this.post('/beta/betaService/COS.IQ.02.0010', obj, (res) => {
                    if (res.returnCode == '000000') {
                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                            this.part2 = true
                            this.up_part2 = true
                            this.getPcsIntance(row)
                        } else {
                            this.part2 = false
                            this.up_part2 = false
                        }
                    }
                })
            },
            getPcsIntance(row) {
                let obj = {
                    operationMode: row.operationMode,
                    pcdNo: row.elementNo.substring(0, 8),
                    instanCode1: row.instanCode1,
                    instanCode2: row.instanCode2,
                    instanCode3: row.instanCode3,
                    instanCode4: row.instanCode4,
                    instanCode5: row.instanCode5,
                    addPcdFlag: '2'
                }
                this.post('/beta/betaService/COS.IQ.02.0016', obj, (res) => {
                    if (res.returnCode == '000000') {
                        if (res.returnData.rows && res.returnData.rows.length > 0) {
                            this.pcdList = res.returnData.rows
                            this.up_pcdList = res.returnData.rows
                        } else {
                            this.pcdList = []
                            this.up_pcdList = []
                        }
                    }
                }, (err) => {
                    this.pcdList = []
                    this.up_pcdList = []
                })
            },
            handleUpdate(row) {
                this.tempUp = Object.assign({}, row)
                this.dialogFormVisibleUp = true
                this.tempUp.elementInfo = this.tempUp.elementNo + this.tempUp.elementDesc
                this.$nextTick(() => {
                    this.$refs['dataFormUp'].clearValidate()
                })
                this.getIsPcd(row)
            },
            updateData() {
                this.$refs['dataFormUp'].validate((valid) => {
                    if (valid) {
                        this.tempUp.addPcdFlag = '1'
                        this.tempUp.pcdList = this.up_pcdList
                        this.post('/beta/betaService/COS.UP.02.0015', this.tempUp, (res) => {
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
            handleDelete(row) {
                this.$confirm('此操作将删除当前信息, 是否继续?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.sureDelete(row)
                }).catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    });
                });
            },
            sureDelete(row) {
                let obj = {
                    artifactInstanId: row.id
                }
                this.post('/beta/betaService/COS.UP.02.0026', obj, (res) => {
                    if (res.returnCode == '000000') {
                        this.$message({
                            type: 'success',
                            message: '删除成功!'
                        });
                        this.getList()
                    }
                })
            },

            //修改中 修改pcd函数
            up_handleUpPcd(row, index) {
                this.upPcdIndex = index
                this.up_pcdTempObj = row
                this.up_pcdPart = true
            },
            //业务项目实例化 设置参数 删除pcd函数
            up_handleDeletePcd(index) {
                this.up_pcdList.splice(index, 1)
            },
            // 业务项目实例化 修改pcd关闭
            up_pcdClose() {
                this.up_pcdPart = false
            },
            // 修改中 修改pcd保存
            up_pcdSave() {
                this.$set(this.up_pcdList, this.upPcdIndex, this.up_pcdTempObj)
                this.up_pcdPart = false
            },

            // 新增中
            // 选择构件
            choseArtifCodeBtn() {
                this.artif_dialogFormVisibl = true
                this.artif_queryObj = {
                    label1: '构件编号',
                    prop1: 'artifactNo',
                    label2: '构件描述',
                    prop2: 'artifactDesc',
                    radioKey: 'artifactNo'
                }
                this.artif_url = "/beta/betaService/COS.IQ.02.0007"
                this.artif_params = {
                    isTrans: true,
                    transParams: ['dic_dimensionalValue', 'dic_dimensionalValue', 'dic_dimensionalValue', 'dic_dimensionalValue', 'dic_dimensionalValue'],
                    transDict: ['instanDimen1', 'instanDimen2', 'instanDimen3', 'instanDimen4', 'instanDimen5']
                }
                this.artif_tableLabel = [{
                    label: '构件编号',
                    prop: 'artifactNo'
                }, {
                    label: '构件描述',
                    prop: 'artifactDesc'
                }, {
                    label: '描述',
                    prop: 'businessDesc'
                }, {
                    label: '维度个数',
                    prop: 'instanDimenCount'
                }, {
                    label: '维度取值1',
                    prop: 'instanDimen1Desc'
                }, {
                    label: '维度取值2',
                    prop: 'instanDimen2Desc'
                }, {
                    label: '维度取值3',
                    prop: 'instanDimen3Desc'
                }, {
                    label: '维度取值4',
                    prop: 'instanDimen4Desc'
                }, {
                    label: '维度取值5',
                    prop: 'instanDimen5Desc'
                }]
            },
            choseInstanCodeBtn(index) {
                this.intan_flag = index
                let str = 'instanDimen' + index
                this.intan_type = this.tempAdd[str]
                this.codeStr = this.intan_type
                this.chosedInstanCode(this.intan_type)

            },
            chosedInstanCode(code) {
                if (code == 'ACST') { // 核算状态
                    this.queryObj = {
                        radioKey: 'accountingStatus'
                    }
                    this.url = "/beta/betaService/COS.IQ.02.0051"
                    this.params = {}
                    this.tableLabel = [{
                        label: '核算状态',
                        prop: 'accountingStatus'
                    }, {
                        label: '描述',
                        prop: 'accountingDesc'
                    }]
                } else if (code == 'AUTX') { // 授权场景
                    // AUS.PM.01.0002
                    this.queryObj = {
                        label1: '授权场景代码',
                        prop1: 'authSceneCode',
                        radioKey: 'authSceneCode'
                    }
                    this.url = "/beta/betaService/AUS.PM.01.0002"
                    this.params = {}
                    this.tableLabel = [
                        {
                            label: '序号',
                            prop: '$index+1'
                        }, {
                            label: '授权场景代码',
                            prop: 'authSceneCode'
                        }, {
                            label: '描述',
                            prop: 'sceneDesc'
                        }]

                } else if (code == 'BLCK') { // 生效码
                    this.queryObj = {
                        label1: '管控码序号',
                        prop1: 'effectivenessCodeScene',
                        label2: '描述',
                        prop2: 'effectivenessCodeDesc',
                        radioKey: 'effectivenessCodeType'
                    }
                    this.url = "/beta/betaService/COS.IQ.02.0023"
                    this.params = {}
                    this.tableLabel = [{
                        label: '运营模式',
                        prop: 'operationMode'
                    }, {
                        label: '管控码类别',
                        prop: 'effectivenessCodeType'
                    }, {
                        label: '管控码序号',
                        prop: 'effectivenessCodeScene'
                    }, {
                        label: '描述',
                        prop: 'effectivenessCodeDesc'
                    }
                ]
                } else if (code == 'DELQ') { // 延滞层级

                } else if (code == 'EVEN') { // 事件
                    this.queryObj = {
                        label1: '事件编号',
                        prop1: 'eventNo',
                        label2: '事件描述',
                        prop2: 'eventDesc',
                        radioKey: 'eventNo'
                    }
                    this.url = "/beta/betaService/COS.IQ.02.0001"
                    this.params = {}
                    this.tableLabel = [{
                        label: '事件编号',
                        prop: 'eventNo'
                    }, {
                        label: '事件描述',
                        prop: 'eventDesc'
                    }]

                } else if (code == 'LMND') { // 额度节点
                    //LMS.PM.01.0002
                    this.queryObj = {
                        label1: '额度节点',
                        prop1: 'creditNodeNo',
                        radioKey: 'creditNodeNo'
                    }
                    this.url = "/beta/betaService/LMS.PM.01.0002"
                    this.params = {
                        "operationMode": this.tempAdd.operationMode,
                        "authDataSynFlag": "1",
                    }
                    this.tableLabel = [{
                        label: '额度节点',
                        prop: 'creditNodeNo'
                    }, {
                        label: '描述',
                        prop: 'creditDesc'
                    }]
                } else if (code == 'LMNR') { // 关联额度节点
                } else if (code == 'LMRT') { // 额度网关系类型

                } else if (code == 'INST') { // 分期类型
                    this.queryObj = {
                        label1: '分期类型码',
                        prop1: 'stageTypeCode',
                        radioKey: 'stageTypeCode'
                    }
                    this.label1 = '分期类型码'
                    this.prop1 = 'stageTypeCode'
                    this.url = "/beta/betaService/COS.IQ.02.0175"
                    this.params = {
                        isTrans: true,
                        transParams: ['dic_businessNature'],
                        transDict: ['businessDebitCreditCode']
                    }
                    this.tableLabel = [{
                        label: '运营模式',
                        prop: 'operationMode'
                    }, {
                        label: '分期类型码',
                        prop: 'stageTypeCode'
                    }, {
                        label: '交易识别码',
                        prop: 'transIdentificationCode'
                    }, {
                        label: '分期类型描述',
                        prop: 'stageTypeDesc'
                    }]

                } else if (code == 'MODB') { // 余额对象
                    this.queryObj = {
                        label1: '余额对象',
                        prop1: 'balanceObjectCode',
                        radioKey: 'balanceObjectCode'
                    }
                    this.url = "/beta/betaService/COS.IQ.02.0021"
                    this.params = {
                        operationMode: this.tempAdd.operationMode,
                        isTrans: true,
                        transParams: ['dic_balanceType'],
                        transDict: ['objectType']
                    }
                    this.tableLabel = [{
                        label: '运营模式',
                        prop: 'operationMode'
                    }, {
                        label: '余额对象',
                        prop: 'balanceObjectConcat',
                        concat:'balanceObjectCode_objectDesc'
                    }, {
                        label: '对象类型',
                        prop: 'objectTypeDesc'
                    }, {
                        label: '优先级',
                        prop: 'paymentPriority'
                    }, {
                        label: '开始时间',
                        prop: 'beginDate'
                    }, {
                        label: '结束时间',
                        prop: 'endDate'
                    }]

                } else if (code == 'MODG') { // 业务项目
                    this.queryObj = {
                        label1: '业务项目代码',
                        prop1: 'businessProgramNo',
                        label2: '业务项目描述',
                        prop2: 'programDesc',
                        radioKey: 'businessProgramNo'
                    }
                    this.url = "/beta/betaService/COS.IQ.02.0018"
                    this.params = {
                        isTrans: true,
                        transParams: ['dic_businessNature'],
                        transDict: ['businessDebitCreditCode']
                    }
                    this.tableLabel = [{
                        label: '运营模式',
                        prop: 'operationMode'
                    }, {
                        label: '业务项目代码',
                        prop: 'businessProgramNo'
                    }, {
                        label: '描述',
                        prop: 'programDesc'
                    }, {
                        label: '争议业务类型',
                        prop: 'disputeBusinessType'
                    }, {
                        label: '费用业务类型',
                        prop: 'feeBusinessType'
                    }, {
                        label: '还款优先级',
                        prop: 'paymentPriority'
                    }]

                } else if (code == 'MODM') { //媒介对象 
                    this.queryObj = {
                        label1: '媒介对象代码',
                        prop1: 'mediaObjectCode',
                        radioKey: 'mediaObjectCode'
                    }
                    this.url = "/beta/betaService/COS.IQ.02.0017"
                    this.params = {
                        isTrans: true,
                        transParams: ['dic_mediaType'],
                        transDict: ['mediaObjectType']
                    }
                    this.tableLabel = [{
                        label: '运营模式',
                        prop: 'operationMode'
                    }, {
                        label: '媒介对象代码',
                        prop: 'mediaObjectCode'
                    }, {
                        label: '描述',
                        prop: 'mediaObjectDesc'
                    }, {
                        label: '媒介类型',
                        prop: 'mediaObjectTypeDesc'
                    }]
                } else if (code == 'MODP') { // 产品对象
                    this.queryObj = {
                        label1: '产品对象代码',
                        prop1: 'productObjectCode',
                        radioKey: 'productObjectCode'
                    }
                    this.url = "/beta/betaService/COS.IQ.02.0013"
                    this.tableLabel = [{
                        label: '运营模式',
                        prop: 'operationMode'
                    }, {
                        label: '产品对象代码',
                        prop: 'productObjectCode'
                    }, {
                        label: '描述',
                        prop: 'productDesc'
                    }, {
                        label: '所属产品线',
                        prop: 'productLineCode'
                    }, {
                        label: '发行卡BIN',
                        prop: 'binNo'
                    }, {
                        label: '还款优先级',
                        prop: 'paymentPriority'
                    }]

                } else if (code == 'MODT') { // 业务类型
                    this.queryObj = {
                        label1: '业务类型代码',
                        prop1: 'businessTypeCode',
                        radioKey: 'businessTypeCode'
                    }
                    this.url = "/beta/betaService/COS.IQ.02.0020"
                    this.params = {
                        isTrans: true,
                        transParams: ['dic_businessNature'],
                        transDict: ['businessDebitCreditCode']
                    }
                    this.tableLabel = [{
                        label: '运营模式',
                        prop: 'operationMode'
                    }, {
                        label: '业务类型代码',
                        prop: 'businessTypeCode'
                    }, {
                        label: '描述',
                        prop: 'businessDesc'
                    }, {
                        label: '账户组织形式',
                        prop: 'businessForm'
                    }, {
                        label: '业务性质',
                        prop: 'businessDebitCreditCodeDesc'
                    }]
                } else if (code == 'CURR') { // 币种
                    //    COS.IQ.02.0012
                    this.queryObj = {
                        label1: '货币代码',
                        prop1: 'currencyCode',
                        radioKey: 'currencyCode'
                    }
                    this.url = "/beta/betaService/COS.IQ.02.0012"
                    this.params = {
                        isTrans: true,
                        transParams: ['dic_businessNature'],
                        transDict: ['businessDebitCreditCode']
                    }
                    this.tableLabel = [{
                        label: '货币代码',
                        prop: 'currencyCode'
                    }, {
                        label: '描述',
                        prop: 'currencyDesc'
                    }, {
                        label: '小数位位数',
                        prop: 'decimalPosition'
                    }, {
                        label: '货币简称',
                        prop: 'referred'
                    }]
                }
                this.queryObj.code = code
                this.instanDimen_dialogFormVisibl = true
            },
            cancelInstanDimenBtn() {
                this.instanDimen_dialogFormVisibl = false
                this.queryObj = {}
            },
            handleCuurRow(val) {
                this.instan_currRow = val
            },
            artif_handleCuurRow(val) {
                this.artif_currRow = val
            },
            // 构件弹窗确定
            sureArtifData() {
                if(this.artif_currRow.artifactNo) {
                    this.tempAdd.artifactNo = this.artif_currRow.artifactNo 
                    this.tempAdd.artifactNoInfo = this.artif_currRow.artifactNo + this.artif_currRow.artifactDesc
                    this.getElementNoOptions(this.artif_currRow.artifactNo)
                }
                this.tempAdd.instanDimen1 = this.artif_currRow.instanDimen1
                this.tempAdd.instanDimen2 = this.artif_currRow.instanDimen2
                this.tempAdd.instanDimen3 = this.artif_currRow.instanDimen3
                this.tempAdd.instanDimen4 = this.artif_currRow.instanDimen4
                this.tempAdd.instanDimen5 = this.artif_currRow.instanDimen5
                this.artif_dialogFormVisibl = false
            },
            getElementNoOptions(artifactNoValue) {
                let params = {
                    artifactNo: artifactNoValue
                }
                this.post('/beta/betaService/COS.IQ.02.0009', params ,(res) => {
                    if (res.returnCode == '000000') {
                        if(res.returnData && res.returnData.rows && res.returnData.rows.length >0) {
                            let arr = []
                            let rows = res.returnData.rows
                            rows.forEach((item, index) => {
                                arr[index] = {
                                    label: item.elementNo+' '+ item.elementDesc,
                                    value: item.elementNo
                                }
                            })
                            this.elementNoOptions = arr
                        } else {
                            this.elementNoOptions = []
                        }
                        
                    }
                })
            },

            // 实例弹窗确定
            sureIntanData() {
                this.instanDimen_dialogFormVisibl = false
                this.queryObj = {}

                let intanStr
                let key = ''
                if (this.intan_flag != 0) { // 
                    intanStr = 'instanCode' + this.intan_flag
                }
                if (this.intan_type == 'ACST') { // 核算状态
                    key = 'accountingStatus'
                } else if (this.intan_type == 'AUTX') { // 授权场景
                    key = 'authSceneCode'
                } else if (this.intan_type == 'BLCK') { // 生效码
                    key = 'effectivenessCodeScene'
                } else if (this.intan_type == 'DELQ') { // 延滞层级
                    key = ''
                } else if (this.intan_type == 'EVEN') { // 事件
                    key = 'eventNo'
                } else if (this.intan_type == 'LMND') { // 额度节点
                    key = 'creditNodeNo'
                } else if (this.intan_type == 'MODB') { // 余额对象
                    key = 'balanceObjectCode'
                } else if (this.intan_type == 'INST') { // 分期类型
                    key = 'stageTypeCode'
                } else if (this.intan_type == 'MODG') { // 业务项目
                    key = 'businessProgramNo'
                } else if (this.intan_type == 'MODM') { // 媒介对象
                    key = 'mediaObjectCode'
                } else if (this.intan_type == 'MODP') { // 产品对象
                    key = 'productObjectCode'
                } else if (this.intan_type == 'MODT') { // 业务类型
                    key = 'businessTypeCode'
                } else if (this.intan_type == 'CURR') { // 币种
                    key = 'currencyCode'
                }

                this.tempAdd[intanStr] = this.instan_currRow[key]
                this.instanDimen_dialogFormVisibl = false
                this.params = {}
                this.tableLabel = []
                this.queryObj = {}
                this.codeStr = ''
            }
        }
    }
</script>

<style>
</style>
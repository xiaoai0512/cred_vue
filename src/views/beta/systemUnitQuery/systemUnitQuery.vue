<!-- 系统单元 -->
<template>
    <div class="allContent">
        <!-- 表单验证demo: -->
        <el-form
            ref="systemUnitSearchForm"
            :model="systemUnitSearchForm"
            :rules="systemUnitSearchFormRules"
        >
            <el-form-item
                class="cl_td"
                label="系统单元编号"
                prop="systemUnitNo"
            >
                <el-input
                    v-model="systemUnitSearchForm.systemUnitNo"
                    class="wd200"
                    type="text"
                />
            </el-form-item>
            <el-form-item
                class="cl_td"
                label="系统单元名称"
                prop="systemUnitName"
            >
                <el-input
                    v-model="systemUnitSearchForm.systemUnitName"
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
            :data="systemUnitList"
            class="mbtm20"
            fit
            highlight-current-row
            style="width: 100%"
            border
        >
            <el-table-column
                prop="systemUnitNo"
                label="系统单元编号"
                align="center"
            />
            <el-table-column
                prop="systemUnitName"
                label="系统单元名称"
                align="center"
            />
            <el-table-column
                prop="lastProcessDate"
                label="上一处理日期"
                align="center"
            />
            <el-table-column
                prop="currProcessDate"
                label="当前处理日期"
                align="center"
            />
            <el-table-column
                prop="nextProcessDate"
                label="下一处理日期"
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
                        @click="handleUpdate(row)"
                        v-show="updBtnFlag"
                        >修改</el-button
                    >
                    <el-button
                        size="mini"
                        icon="el-icon-document-copy"
                        type="primary"
                        @click="handleCopy(row)"
                        v-show="addBtnFlag"
                        >复制</el-button
                    >
                </template>
            </el-table-column>
        </el-table>
        <pagination
            v-show="systemUnitTotal > 0"
            :total="systemUnitTotal"
            :page.sync="systemUnitSearchForm.pageNum"
            :limit.sync="systemUnitSearchForm.pageSize"
            @pagination="getSystemUnitList"
        />

        <!-- 新增 -->
        <el-dialog
            title="系统单元新增"
            :visible.sync="dialogFormVisibleAdd"
            width="65%"
        >
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd">
                <el-form-item
                    class="cl_td"
                    label="系统单元编号"
                    prop="systemUnitNo"
                    :rules="[
                        { required: true, message: '系统单元编号不能为空' },
                        { max: 3, message: '系统单元编号长度不能超过3个字符' },
                    ]"
                >
                    <el-input
                        v-model="tempAdd.systemUnitNo"
                        class="wd200"
                        type="text"
                    />
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="系统单元名称"
                    prop="systemUnitName"
                    :rules="[
                        { required: true, message: '系统单元名称不能为空' },
                    ]"
                >
                    <el-input
                        v-model="tempAdd.systemUnitName"
                        class="wd200"
                        type="text"
                    />
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="上一处理日期"
                    prop="lastProcessDate"
                    :rules="[{ required: true, message: '请选择时间' }]"
                >
                    <el-date-picker
                        class="wd200"
                        type="date"
                        placeholder="选择日期"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd"
                        v-model="tempAdd.lastProcessDate"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="当前处理日期"
                    prop="currProcessDate"
                    :rules="[{ required: true, message: '请选择时间' }]"
                >
                    <el-date-picker
                        class="wd200"
                        type="date"
                        placeholder="选择日期"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd"
                        v-model="tempAdd.currProcessDate"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="下一处理日期"
                    prop="nextProcessDate"
                    :rules="[{ required: true, message: '请选择时间' }]"
                >
                    <el-date-picker
                        class="wd200"
                        type="date"
                        placeholder="选择日期"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd"
                        v-model="tempAdd.nextProcessDate"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="系统运行状态"
                    prop="systemOperateState"
                    :rules="[
                        { required: true, message: '系统运行状态不能为空' },
                    ]"
                >
                    <el-select
                        v-model="tempAdd.systemOperateState"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in systemOperateStateOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="当前日志标志"
                    prop="currLogFlag"
                    :rules="[
                        { required: true, message: '当前日志标志不能为空' },
                    ]"
                >
                    <el-select
                        v-model="tempAdd.currLogFlag"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in currLogFlagOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="下一日志标志"
                    prop="nextLogFlag"
                    :rules="[
                        { required: true, message: '下一日志标志不能为空' },
                    ]"
                >
                    <el-select
                        v-model="tempAdd.nextLogFlag"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in currLogFlagOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="假日表编号" prop="holidayNo">
                    <el-select
                        v-model="tempAdd.holidayNo"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in holidayNoOptions"
                            :key="index"
                            :label="item.holidayNo"
                            :value="item.holidayNo"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="系统环境标识"
                    prop="systemEnvironmentFlag"
                >
                    <el-select
                        v-model="tempAdd.systemEnvironmentFlag"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(
                                item, index
                            ) in systemEnvironmentFlagOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="非营业日批次标识"
                    prop="nonProDayBatchFlag"
                    :rules="[
                        { required: true, message: '非营业日批次标识不能为空' },
                    ]"
                >
                    <el-select
                        v-model="tempAdd.nonProDayBatchFlag"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in nonProDayBatchFlagOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="PAN是否加密标志"
                    prop="panEncryptFlag"
                >
                    <el-select
                        v-model="tempAdd.panEncryptFlag"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in YorNOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    class="cl_tr"
                    label="系统营业日标识"
                    prop="systemProcessDayFlag">
                    <div class="col_td_ten">
                        <div class="wdper90" style="padding-left: 12%">
                            周一
                        </div>
                        <div class="wdper90 float_left">
                            <el-radio-group v-model="tempAdd.radio1">
                                <el-radio
                                    style="line-height: 26px"
                                    v-for="(item, index) in radioOptions"
                                    :key="index"
                                    :label="item.id"
                                    >{{ item.name }}</el-radio
                                >
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="col_td_ten">
                        <div class="wdper90" style="padding-left: 12%">
                            周二
                        </div>
                        <div class="wdper90 float_left">
                            <el-radio-group v-model="tempAdd.radio2">
                                <el-radio
                                    style="line-height: 26px"
                                    v-for="(item, index) in radioOptions"
                                    :key="index"
                                    :label="item.id"
                                    >{{ item.name }}</el-radio
                                >
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="col_td_ten">
                        <div class="wdper90" style="padding-left: 12%">
                            周三
                        </div>
                        <div class="wdper90 float_left">
                            <el-radio-group v-model="tempAdd.radio3">
                                <el-radio
                                    style="line-height: 26px"
                                    v-for="(item, index) in radioOptions"
                                    :key="index"
                                    :label="item.id"
                                    >{{ item.name }}</el-radio
                                >
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="col_td_ten">
                        <div class="wdper90" style="padding-left: 12%">
                            周四
                        </div>
                        <div class="wdper90 float_left">
                            <el-radio-group v-model="tempAdd.radio4">
                                <el-radio
                                    style="line-height: 26px"
                                    v-for="(item, index) in radioOptions"
                                    :key="index"
                                    :label="item.id"
                                    >{{ item.name }}</el-radio
                                >
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="col_td_ten">
                        <div class="wdper90" style="padding-left: 12%">
                            周五
                        </div>
                        <div class="wdper90 float_left">
                            <el-radio-group v-model="tempAdd.radio5">
                                <el-radio
                                    style="line-height: 26px"
                                    v-for="(item, index) in radioOptions"
                                    :key="index"
                                    :label="item.id"
                                    >{{ item.name }}</el-radio
                                >
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="col_td_ten">
                        <div class="wdper90" style="padding-left: 12%">
                            周六
                        </div>
                        <div class="wdper90 float_left">
                            <el-radio-group v-model="tempAdd.radio6">
                                <el-radio
                                    style="line-height: 26px"
                                    v-for="(item, index) in radioOptions"
                                    :key="index"
                                    :label="item.id"
                                    >{{ item.name }}</el-radio
                                >
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="col_td_ten">
                        <div class="wdper90" style="padding-left: 12%">
                            周日
                        </div>
                        <div class="wdper90 float_left">
                            <el-radio-group v-model="tempAdd.radio7">
                                <el-radio
                                    style="line-height: 26px"
                                    v-for="(item, index) in radioOptions"
                                    :key="index"
                                    :label="item.id"
                                    >{{ item.name }}</el-radio
                                >
                            </el-radio-group>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
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
        <el-dialog
            title="系统单元详情"
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
                    label="系统单元编号"
                    prop="systemUnitNo"
                    :rules="[
                        { required: true, message: '系统单元编号不能为空' },
                        { max: 3, message: '系统单元编号长度不能超过3个字符' },
                    ]"
                >
                    <el-input
                        v-model="tempDetail.systemUnitNo"
                        class="wd200"
                        type="text"
                        readonly
                    />
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="系统单元名称"
                    prop="systemUnitName"
                    :rules="[
                        { required: true, message: '系统单元名称不能为空' },
                    ]"
                >
                    <el-input
                        v-model="tempDetail.systemUnitName"
                        class="wd200"
                        type="text"
                        readonly
                    />
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="上一处理日期"
                    prop="lastProcessDate"
                    :rules="[{ required: true, message: '请选择时间' }]"
                >
                    <el-input
                        v-model="tempDetail.lastProcessDate"
                        class="wd200"
                        type="text"
                        readonly
                    />

                    <!-- <el-date-picker class="wd200" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" v-model="tempDetail.lastProcessDate" aria-disabled="true"></el-date-picker> -->
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="当前处理日期"
                    prop="currProcessDate"
                    :rules="[{ required: true, message: '请选择时间' }]"
                >
                    <el-input
                        v-model="tempDetail.currProcessDate"
                        class="wd200"
                        type="text"
                        readonly
                    />
                    <!-- <el-date-picker class="wd200" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" v-model="tempDetail.currProcessDate"></el-date-picker> -->
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="下一处理日期"
                    prop="nextProcessDate"
                    :rules="[{ required: true, message: '请选择时间' }]"
                >
                    <el-input
                        v-model="tempDetail.nextProcessDate"
                        class="wd200"
                        type="text"
                        readonly
                    />
                    <!-- <el-date-picker class="wd200" type="date" placeholder="选择日期" format="yyyy 年 MM 月 dd 日" value-format="yyyy-MM-dd" v-model="tempDetail.nextProcessDate"></el-date-picker> -->
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="系统运行状态"
                    prop="systemOperateState"
                    :rules="[
                        { required: true, message: '系统运行状态不能为空' },
                    ]"
                >
                    <el-select
                        v-model="tempDetail.systemOperateState"
                        class="wd200"
                        clearable
                        disabled
                    >
                        <el-option
                            v-for="(item, index) in systemOperateStateOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="当前日志标志"
                    prop="currLogFlag"
                    :rules="[
                        { required: true, message: '当前日志标志不能为空' },
                    ]"
                >
                    <el-select
                        v-model="tempDetail.currLogFlag"
                        class="wd200"
                        clearable
                        disabled
                    >
                        <el-option
                            v-for="(item, index) in currLogFlagOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="下一日志标志"
                    prop="nextLogFlag"
                    :rules="[
                        { required: true, message: '下一日志标志不能为空' },
                    ]"
                >
                    <el-select
                        v-model="tempDetail.nextLogFlag"
                        class="wd200"
                        clearable
                        disabled
                    >
                        <el-option
                            v-for="(item, index) in currLogFlagOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="假日表编号" prop="holidayNo">
                    <el-select
                        v-model="tempDetail.holidayNo"
                        class="wd200"
                        clearable
                        disabled
                    >
                        <el-option
                            v-for="(item, index) in holidayNoOptions"
                            :key="index"
                            :label="item.holidayNo"
                            :value="item.holidayNo"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="系统环境标识"
                    prop="systemEnvironmentFlag"
                >
                    <el-select
                        v-model="tempDetail.systemEnvironmentFlag"
                        class="wd200"
                        clearable
                        disabled
                    >
                        <el-option
                            v-for="(
                                item, index
                            ) in systemEnvironmentFlagOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="非营业日批次标识"
                    prop="nonProDayBatchFlag"
                    :rules="[
                        { required: true, message: '非营业日批次标识不能为空' },
                    ]"
                >
                    <el-select
                        v-model="tempDetail.nonProDayBatchFlag"
                        class="wd200"
                        clearable
                        disabled
                    >
                        <el-option
                            v-for="(item, index) in nonProDayBatchFlagOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="PAN是否加密标志"
                    prop="panEncryptFlag"
                >
                    <el-select
                        v-model="tempDetail.panEncryptFlag"
                        class="wd200"
                        clearable
                        disabled
                    >
                        <el-option
                            v-for="(item, index) in YorNOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    class="cl_tr"
                    label="系统营业日标识"
                    prop="systemProcessDayFlag">
                    <div class="col_td_ten">
                        <div class="wdper90" style="padding-left: 12%">
                            周一
                        </div>
                        <div class="wdper90 float_left">
                            <el-radio-group v-model="tempDetail.radio1">
                                <el-radio
                                    style="line-height: 26px"
                                    disabled
                                    v-for="(item, index) in radioOptions"
                                    :key="index"
                                    :label="item.id"
                                    >{{ item.name }}</el-radio
                                >
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="col_td_ten">
                        <div class="wdper90" style="padding-left: 12%">
                            周二
                        </div>
                        <div class="wdper90 float_left">
                            <el-radio-group v-model="tempDetail.radio2">
                                <el-radio
                                    style="line-height: 26px"
                                    disabled
                                    v-for="(item, index) in radioOptions"
                                    :key="index"
                                    :label="item.id"
                                    >{{ item.name }}</el-radio
                                >
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="col_td_ten">
                        <div class="wdper90" style="padding-left: 12%">
                            周三
                        </div>
                        <div class="wdper90 float_left">
                            <el-radio-group v-model="tempDetail.radio3">
                                <el-radio
                                    style="line-height: 26px"
                                    disabled
                                    v-for="(item, index) in radioOptions"
                                    :key="index"
                                    :label="item.id"
                                    >{{ item.name }}</el-radio
                                >
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="col_td_ten">
                        <div class="wdper90" style="padding-left: 12%">
                            周四
                        </div>
                        <div class="wdper90 float_left">
                            <el-radio-group v-model="tempDetail.radio4">
                                <el-radio
                                    style="line-height: 26px"
                                    disabled
                                    v-for="(item, index) in radioOptions"
                                    :key="index"
                                    :label="item.id"
                                    >{{ item.name }}</el-radio
                                >
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="col_td_ten">
                        <div class="wdper90" style="padding-left: 12%">
                            周五
                        </div>
                        <div class="wdper90 float_left">
                            <el-radio-group v-model="tempDetail.radio5">
                                <el-radio
                                    style="line-height: 26px"
                                    disabled
                                    v-for="(item, index) in radioOptions"
                                    :key="index"
                                    :label="item.id"
                                    >{{ item.name }}</el-radio
                                >
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="col_td_ten">
                        <div class="wdper90" style="padding-left: 12%">
                            周六
                        </div>
                        <div class="wdper90 float_left">
                            <el-radio-group v-model="tempDetail.radio6">
                                <el-radio
                                    style="line-height: 26px"
                                    disabled
                                    v-for="(item, index) in radioOptions"
                                    :key="index"
                                    :label="item.id"
                                    >{{ item.name }}</el-radio
                                >
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="col_td_ten">
                        <div class="wdper90" style="padding-left: 12%">
                            周日
                        </div>
                        <div class="wdper90 float_left">
                            <el-radio-group v-model="tempDetail.radio7">
                                <el-radio
                                    style="line-height: 26px"
                                    disabled
                                    v-for="(item, index) in radioOptions"
                                    :key="index"
                                    :label="item.id"
                                    >{{ item.name }}</el-radio
                                >
                            </el-radio-group>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleDetail = false">
                    关闭
                </el-button>
            </div>
        </el-dialog>

        <!-- 修改 -->
        <el-dialog
            title="系统单元修改"
            :visible.sync="dialogFormVisibleUp"
            width="65%"
        >
            <el-form ref="dataFormUp" :rules="rulesAdd" :model="tempUp">
                <el-form-item
                    class="cl_td"
                    label="系统单元编号"
                    prop="systemUnitNo"
                    :rules="[
                        { required: true, message: '系统单元编号不能为空' },
                        { max: 3, message: '系统单元编号长度不能超过3个字符' },
                    ]"
                >
                    <el-input
                        v-model="tempUp.systemUnitNo"
                        class="wd200"
                        type="text"
                        readonly
                    />
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="系统单元名称"
                    prop="systemUnitName"
                    :rules="[
                        { required: true, message: '系统单元名称不能为空' },
                    ]"
                >
                    <el-input
                        v-model="tempUp.systemUnitName"
                        class="wd200"
                        type="text"
                    />
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="上一处理日期"
                    prop="lastProcessDate"
                    :rules="[{ required: true, message: '请选择时间' }]"
                >
                    <el-date-picker
                        class="wd200"
                        type="date"
                        placeholder="选择日期"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd"
                        v-model="tempUp.lastProcessDate"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="当前处理日期"
                    prop="currProcessDate"
                    :rules="[{ required: true, message: '请选择时间' }]"
                >
                    <el-date-picker
                        class="wd200"
                        type="date"
                        placeholder="选择日期"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd"
                        v-model="tempUp.currProcessDate"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="下一处理日期"
                    prop="nextProcessDate"
                    :rules="[{ required: true, message: '请选择时间' }]"
                >
                    <el-date-picker
                        class="wd200"
                        type="date"
                        placeholder="选择日期"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd"
                        v-model="tempUp.nextProcessDate"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="系统运行状态"
                    prop="systemOperateState"
                    :rules="[
                        { required: true, message: '系统运行状态不能为空' },
                    ]"
                >
                    <el-select
                        v-model="tempUp.systemOperateState"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in systemOperateStateOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="当前日志标志"
                    prop="currLogFlag"
                    :rules="[
                        { required: true, message: '当前日志标志不能为空' },
                    ]"
                >
                    <el-select
                        v-model="tempUp.currLogFlag"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in currLogFlagOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="下一日志标志"
                    prop="nextLogFlag"
                    :rules="[
                        { required: true, message: '下一日志标志不能为空' },
                    ]"
                >
                    <el-select
                        v-model="tempUp.nextLogFlag"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in currLogFlagOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="假日表编号" prop="holidayNo">
                    <el-select
                        v-model="tempUp.holidayNo"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in holidayNoOptions"
                            :key="index"
                            :label="item.holidayNo"
                            :value="item.holidayNo"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="系统环境标识"
                    prop="systemEnvironmentFlag"
                >
                    <el-select
                        v-model="tempUp.systemEnvironmentFlag"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(
                                item, index
                            ) in systemEnvironmentFlagOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="非营业日批次标识"
                    prop="nonProDayBatchFlag"
                    :rules="[
                        { required: true, message: '非营业日批次标识不能为空' },
                    ]"
                >
                    <el-select
                        v-model="tempUp.nonProDayBatchFlag"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in nonProDayBatchFlagOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="PAN是否加密标志"
                    prop="panEncryptFlag"
                >
                    <el-select
                        v-model="tempUp.panEncryptFlag"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in YorNOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                 <el-form-item
                    class="cl_tr"
                    label="系统营业日标识"
                    prop="systemProcessDayFlag">
                    <div class="col_td_ten">
                        <div class="wdper90" style="padding-left: 12%">
                            周一
                        </div>
                        <div class="wdper90 float_left">
                            <el-radio-group
                                v-model="tempUp.radio1"
                                @change="refsh"
                            >
                                <el-radio
                                    style="line-height: 26px"
                                    v-for="(item, index) in radioOptions"
                                    :key="index"
                                    :label="item.id"
                                    >{{ item.name }}</el-radio
                                >
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="col_td_ten">
                        <div class="wdper90" style="padding-left: 12%">
                            周二
                        </div>
                        <div class="wdper90 float_left">
                            <el-radio-group
                                v-model="tempUp.radio2"
                                @change="refsh"
                            >
                                <el-radio
                                    style="line-height: 26px"
                                    v-for="(item, index) in radioOptions"
                                    :key="index"
                                    :label="item.id"
                                    >{{ item.name }}</el-radio
                                >
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="col_td_ten">
                        <div class="wdper90" style="padding-left: 12%">
                            周三
                        </div>
                        <div class="wdper90 float_left">
                            <el-radio-group
                                v-model="tempUp.radio3"
                                @change="refsh"
                            >
                                <el-radio
                                    style="line-height: 26px"
                                    v-for="(item, index) in radioOptions"
                                    :key="index"
                                    :label="item.id"
                                    >{{ item.name }}</el-radio
                                >
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="col_td_ten">
                        <div class="wdper90" style="padding-left: 12%">
                            周四
                        </div>
                        <div class="wdper90 float_left">
                            <el-radio-group
                                v-model="tempUp.radio4"
                                @change="refsh"
                            >
                                <el-radio
                                    style="line-height: 26px"
                                    v-for="(item, index) in radioOptions"
                                    :key="index"
                                    :label="item.id"
                                    >{{ item.name }}</el-radio
                                >
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="col_td_ten">
                        <div class="wdper90" style="padding-left: 12%">
                            周五
                        </div>
                        <div class="wdper90 float_left">
                            <el-radio-group
                                v-model="tempUp.radio5"
                                @change="refsh"
                            >
                                <el-radio
                                    style="line-height: 26px"
                                    v-for="(item, index) in radioOptions"
                                    :key="index"
                                    :label="item.id"
                                    >{{ item.name }}</el-radio
                                >
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="col_td_ten">
                        <div class="wdper90" style="padding-left: 12%">
                            周六
                        </div>
                        <div class="wdper90 float_left">
                            <el-radio-group
                                v-model="tempUp.radio6"
                                @change="refsh"
                            >
                                <el-radio
                                    style="line-height: 26px"
                                    v-for="(item, index) in radioOptions"
                                    :key="index"
                                    :label="item.id"
                                    >{{ item.name }}</el-radio
                                >
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="col_td_ten">
                        <div class="wdper90" style="padding-left: 12%">
                            周日
                        </div>
                        <div class="wdper90 float_left">
                            <el-radio-group
                                v-model="tempUp.radio7"
                                @change="refsh"
                            >
                                <el-radio
                                    style="line-height: 26px"
                                    v-for="(item, index) in radioOptions"
                                    :key="index"
                                    :label="item.id"
                                    >{{ item.name }}</el-radio
                                >
                            </el-radio-group>
                        </div>
                    </div>
                 </el-form-item>
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

        <!-- 复制 -->
        <el-dialog
            title="系统单元复制"
            :visible.sync="dialogFormVisibleCopy"
            width="65%"
        >
            <el-form ref="dataFormCopy" :rules="rulesCopy" :model="tempCopy">
                <el-form-item
                    class="cl_td"
                    label="系统单元编号"
                    prop="systemUnitNo"
                    :rules="[
                        { required: true, message: '系统单元编号不能为空' },
                        { max: 3, message: '系统单元编号长度不能超过3个字符' },
                    ]"
                >
                    <el-input
                        v-model="tempCopy.systemUnitNo"
                        class="wd200"
                        type="text"
                    />
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="系统单元名称"
                    prop="systemUnitName"
                    :rules="[
                        { required: true, message: '系统单元名称不能为空' },
                    ]"
                >
                    <el-input
                        v-model="tempCopy.systemUnitName"
                        class="wd200"
                        type="text"
                    />
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="上一处理日期"
                    prop="lastProcessDate"
                    :rules="[{ required: true, message: '请选择时间' }]"
                >
                    <el-date-picker
                        class="wd200"
                        type="date"
                        placeholder="选择日期"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd"
                        v-model="tempCopy.lastProcessDate"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="当前处理日期"
                    prop="currProcessDate"
                    :rules="[{ required: true, message: '请选择时间' }]"
                >
                    <el-date-picker
                        class="wd200"
                        type="date"
                        placeholder="选择日期"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd"
                        v-model="tempCopy.currProcessDate"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="下一处理日期"
                    prop="nextProcessDate"
                    :rules="[{ required: true, message: '请选择时间' }]"
                >
                    <el-date-picker
                        class="wd200"
                        type="date"
                        placeholder="选择日期"
                        format="yyyy 年 MM 月 dd 日"
                        value-format="yyyy-MM-dd"
                        v-model="tempCopy.nextProcessDate"
                    ></el-date-picker>
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="系统运行状态"
                    prop="systemOperateState"
                    :rules="[
                        { required: true, message: '系统运行状态不能为空' },
                    ]"
                >
                    <el-select
                        v-model="tempCopy.systemOperateState"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in systemOperateStateOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="当前日志标志"
                    prop="currLogFlag"
                    :rules="[
                        { required: true, message: '当前日志标志不能为空' },
                    ]"
                >
                    <el-select
                        v-model="tempCopy.currLogFlag"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in currLogFlagOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="下一日志标志"
                    prop="nextLogFlag"
                    :rules="[
                        { required: true, message: '下一日志标志不能为空' },
                    ]"
                >
                    <el-select
                        v-model="tempCopy.nextLogFlag"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in currLogFlagOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="假日表编号" prop="holidayNo">
                    <el-select
                        v-model="tempCopy.holidayNo"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in holidayNoOptions"
                            :key="index"
                            :label="item.holidayNo"
                            :value="item.holidayNo"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="系统环境标识"
                    prop="systemEnvironmentFlag"
                >
                    <el-select
                        v-model="tempCopy.systemEnvironmentFlag"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(
                                item, index
                            ) in systemEnvironmentFlagOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="非营业日批次标识"
                    prop="nonProDayBatchFlag"
                    :rules="[
                        { required: true, message: '非营业日批次标识不能为空' },
                    ]"
                >
                    <el-select
                        v-model="tempCopy.nonProDayBatchFlag"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in nonProDayBatchFlagOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    label="PAN是否加密标志"
                    prop="panEncryptFlag"
                >
                    <el-select
                        v-model="tempCopy.panEncryptFlag"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in YorNOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                 <el-form-item
                    class="cl_tr"
                    label="系统营业日标识"
                    prop="systemProcessDayFlag">
                    <div class="col_td_ten">
                        <div class="wdper90" style="padding-left: 12%">
                            周一
                        </div>
                        <div class="wdper90 float_left">
                            <el-radio-group
                                v-model="tempCopy.radio1"
                                @change="refsh"
                            >
                                <el-radio
                                    style="line-height: 26px"
                                    v-for="(item, index) in radioOptions"
                                    :key="index"
                                    :label="item.id"
                                    >{{ item.name }}</el-radio
                                >
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="col_td_ten">
                        <div class="wdper90" style="padding-left: 12%">
                            周二
                        </div>
                        <div class="wdper90 float_left">
                            <el-radio-group
                                v-model="tempCopy.radio2"
                                @change="refsh"
                            >
                                <el-radio
                                    style="line-height: 26px"
                                    v-for="(item, index) in radioOptions"
                                    :key="index"
                                    :label="item.id"
                                    >{{ item.name }}</el-radio
                                >
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="col_td_ten">
                        <div class="wdper90" style="padding-left: 12%">
                            周三
                        </div>
                        <div class="wdper90 float_left">
                            <el-radio-group
                                v-model="tempCopy.radio3"
                                @change="refsh"
                            >
                                <el-radio
                                    style="line-height: 26px"
                                    v-for="(item, index) in radioOptions"
                                    :key="index"
                                    :label="item.id"
                                    >{{ item.name }}</el-radio
                                >
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="col_td_ten">
                        <div class="wdper90" style="padding-left: 12%">
                            周四
                        </div>
                        <div class="wdper90 float_left">
                            <el-radio-group
                                v-model="tempCopy.radio4"
                                @change="refsh"
                            >
                                <el-radio
                                    style="line-height: 26px"
                                    v-for="(item, index) in radioOptions"
                                    :key="index"
                                    :label="item.id"
                                    >{{ item.name }}</el-radio
                                >
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="col_td_ten">
                        <div class="wdper90" style="padding-left: 12%">
                            周五
                        </div>
                        <div class="wdper90 float_left">
                            <el-radio-group
                                v-model="tempCopy.radio5"
                                @change="refsh"
                            >
                                <el-radio
                                    style="line-height: 26px"
                                    v-for="(item, index) in radioOptions"
                                    :key="index"
                                    :label="item.id"
                                    >{{ item.name }}</el-radio
                                >
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="col_td_ten">
                        <div class="wdper90" style="padding-left: 12%">
                            周六
                        </div>
                        <div class="wdper90 float_left">
                            <el-radio-group
                                v-model="tempCopy.radio6"
                                @change="refsh"
                            >
                                <el-radio
                                    style="line-height: 26px"
                                    v-for="(item, index) in radioOptions"
                                    :key="index"
                                    :label="item.id"
                                    >{{ item.name }}</el-radio
                                >
                            </el-radio-group>
                        </div>
                    </div>
                    <div class="col_td_ten">
                        <div class="wdper90" style="padding-left: 12%">
                            周日
                        </div>
                        <div class="wdper90 float_left">
                            <el-radio-group
                                v-model="tempCopy.radio7"
                                @change="refsh"
                            >
                                <el-radio
                                    style="line-height: 26px"
                                    v-for="(item, index) in radioOptions"
                                    :key="index"
                                    :label="item.id"
                                    >{{ item.name }}</el-radio
                                >
                            </el-radio-group>
                        </div>
                    </div>
                 </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleCopy = false">
                    取消
                </el-button>
                <el-button type="primary" @click="copyData()"> 确定 </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Pagination from "@/components/Pagination";
export default {
    name: "systemUnitList",
    components: {
        // eslint-disable-next-line vue/no-unused-components
        Pagination,
    },
    data() {
        return {
            systemUnitSearchForm: {
                pageNum: 1,
                pageSize: 10,
            },
            feeItemNoList: [], // 收费目录下拉框
            systemUnitSearchFormRules: {},
            systemUnitList: [],
            systemUnitTotal: 0,

            listLoading1: false,
            selBtnFlag: false,
            addBtnFlag: false,
            updBtnFlag: false,
            btnAuthStr: "",
            systemOperateStateOptions: [], // 系统运行状态
            currLogFlagOptions: [], // 当前日志标志
            holidayNoOptions: [], // 假日表编号
            systemEnvironmentFlagOptions: [], // 系统环境标识
            nonProDayBatchFlagOptions: [], // 非营业日批次标识
            YorNOptions: [], // 是否 PAN是否加密标志
            radioOptions: [
                { name: "营业日", id: "O" },
                { name: "非营业日", id: "C" },
            ], // 系统营业日标识

            tempAdd: {}, // 新增
            tempUp: {}, // 修改
            tempDetail: {}, // 详情
            tempCopy: {}, // 复制
            dialogFormVisibleAdd: false,
            dialogFormVisibleUp: false,
            dialogFormVisibleDetail: false,
            dialogFormVisibleCopy: false,

            rulesAdd: {},
            rulesDetail: {},
            rulesUp: {},
            rulesCopy: {},
        };
    },
    created() {
        // this.init()
        this.getBtnAuth();
    },
    mounted() {
        this.getSystemUnitList();

        // 系统运行状态
        this.getSelectDict("dic_systemOperation").then((res) => {
            this.systemOperateStateOptions = res;
        });
        // 当前日志标志
        this.getSelectDict("dic_logIdentifier").then((res) => {
            this.currLogFlagOptions = res;
        });

        // 假日表编号
        this.post(
            "/beta/betaService/COS.IQ.02.0041",
            { holidayNoFlag: 1 },
            (res) => {
                this.holidayNoOptions = res.returnData.rows;
            }
        );

        // 系统环境标识
        this.getSelectDict("dic_systemIdentification").then((res) => {
            this.systemEnvironmentFlagOptions = res;
        });

        // 非营业日批次标识
        this.getSelectDict("dic_batchIdentification").then((res) => {
            this.nonProDayBatchFlagOptions = res;
        });

        // PAN是否加密标志
        this.getSelectDict("dic_isYorN").then((res) => {
            this.YorNOptions = res;
        });
    },
    methods: {
        refsh() {
            this.$forceUpdate();
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
                            if (this.btnAuthStr.includes("COS.IQ.02.0038")) {
                                // 查询
                                this.selBtnFlag = true;
                            } else {
                                this.selBtnFlag = false;
                            }
                            if (this.btnAuthStr.includes("COS.AD.02.0033")) {
                                // 新增
                                this.addBtnFlag = true;
                            } else {
                                this.addBtnFlag = false;
                            }
                            if (this.btnAuthStr.includes("COS.UP.02.0037")) {
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
        getSystemUnitList() {
            this.listLoading1 = true;
            this.getTableList(
                "/beta/betaService/COS.IQ.02.0038",
                this.systemUnitSearchForm,
                (res) => {
                    this.listLoading1 = false;
                    if (res.returnCode == "000000") {
                        if (
                            res.returnData &&
                            res.returnData.rows &&
                            res.returnData.rows.length > 0
                        ) {
                            this.systemUnitList = res.returnData.rows;
                            this.systemUnitTotal = res.returnData.totalCount;
                        } else {
                            this.systemUnitList = [];
                            this.systemUnitTotal = 0;
                        }
                    }
                },
                (err) => {
                    this.systemUnitList = res.returnData.rows;
                    this.systemUnitTotal = res.returnData.totalCount;
                    his.listLoading1 = false;
                }
            );
        },
        handleSearch() {
            this.systemUnitSearchForm.pageNum = 1
            this.systemUnitSearchForm.pageSize = 10
            this.getSystemUnitList();
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
                    this.tempAdd.systemProcessDayFlag =
                        this.tempAdd.radio1.concat(
                            this.tempAdd.radio2,
                            this.tempAdd.radio3,
                            this.tempAdd.radio4,
                            this.tempAdd.radio5,
                            this.tempAdd.radio6,
                            this.tempAdd.radio7
                        );
                    this.post(
                        "/beta/betaService/COS.AD.02.0033",
                        this.tempAdd,
                        (res) => {
                            if (res.returnCode == "000000") {
                                this.dialogFormVisibleAdd = false;
                                this.$notify({
                                    message: "新增成功",
                                    type: "success",
                                });
                                this.getSystemUnitList();
                                this.tempAdd = {};
                            }
                        }
                    );
                }
            });
        },
        handleDetail(row) {
            this.dialogFormVisibleDetail = true;
            this.tempDetail = Object.assign({}, row); //
            this.tempDetail.radio1 =
                this.tempDetail.systemProcessDayFlag.substring(0, 1);
            this.tempDetail.radio2 =
                this.tempDetail.systemProcessDayFlag.substring(1, 2);
            this.tempDetail.radio3 =
                this.tempDetail.systemProcessDayFlag.substring(2, 3);
            this.tempDetail.radio4 =
                this.tempDetail.systemProcessDayFlag.substring(3, 4);
            this.tempDetail.radio5 =
                this.tempDetail.systemProcessDayFlag.substring(4, 5);
            this.tempDetail.radio6 =
                this.tempDetail.systemProcessDayFlag.substring(5, 6);
            this.tempDetail.radio7 =
                this.tempDetail.systemProcessDayFlag.substring(6, 7);
            this.$nextTick(() => {
                this.$refs["dataFormDetail"].clearValidate();
            });
        },
        handleUpdate(row) {
            this.tempUp = Object.assign({}, row);
            this.tempUp.radio1 = this.tempUp.systemProcessDayFlag.substring(
                0,
                1
            );
            this.tempUp.radio2 = this.tempUp.systemProcessDayFlag.substring(
                1,
                2
            );
            this.tempUp.radio3 = this.tempUp.systemProcessDayFlag.substring(
                2,
                3
            );
            this.tempUp.radio4 = this.tempUp.systemProcessDayFlag.substring(
                3,
                4
            );
            this.tempUp.radio5 = this.tempUp.systemProcessDayFlag.substring(
                4,
                5
            );
            this.tempUp.radio6 = this.tempUp.systemProcessDayFlag.substring(
                5,
                6
            );
            this.tempUp.radio7 = this.tempUp.systemProcessDayFlag.substring(
                6,
                7
            );
            this.dialogFormVisibleUp = true;
            this.$nextTick(() => {
                this.$refs["dataFormUp"].clearValidate();
            });
        },
        updateData() {
            this.$refs["dataFormUp"].validate((valid) => {
                if (valid) {
                    this.tempUp.systemProcessDayFlag =
                        this.tempUp.radio1.concat(
                            this.tempUp.radio2,
                            this.tempUp.radio3,
                            this.tempUp.radio4,
                            this.tempUp.radio5,
                            this.tempUp.radio6,
                            this.tempUp.radio7
                        );
                    this.post(
                        "/beta/betaService/COS.UP.02.0037",
                        this.tempUp,
                        (res) => {
                            if (res.returnCode == "000000") {
                                this.dialogFormVisibleUp = false;
                                this.$notify({
                                    message: "修改成功",
                                    type: "success",
                                });
                                this.getSystemUnitList();
                            }
                        }
                    );
                }
            });
        },

        handleCopy(row) {
            this.tempCopy = Object.assign({}, row);
            this.tempCopy.radio1 = this.tempCopy.systemProcessDayFlag.substring(
                0,
                1
            );
            this.tempCopy.radio2 = this.tempCopy.systemProcessDayFlag.substring(
                1,
                2
            );
            this.tempCopy.radio3 = this.tempCopy.systemProcessDayFlag.substring(
                2,
                3
            );
            this.tempCopy.radio4 = this.tempCopy.systemProcessDayFlag.substring(
                3,
                4
            );
            this.tempCopy.radio5 = this.tempCopy.systemProcessDayFlag.substring(
                4,
                5
            );
            this.tempCopy.radio6 = this.tempCopy.systemProcessDayFlag.substring(
                5,
                6
            );
            this.tempCopy.radio7 = this.tempCopy.systemProcessDayFlag.substring(
                6,
                7
            );
            this.dialogFormVisibleCopy = true;
            this.$nextTick(() => {
                this.$refs["dataFormCopy"].clearValidate();
            });
        },
        copyData() {
            this.$refs["dataFormCopy"].validate((valid) => {
                if (valid) {
                    this.tempCopy.systemProcessDayFlag =
                        this.tempCopy.radio1.concat(
                            this.tempCopy.radio2,
                            this.tempCopy.radio3,
                            this.tempCopy.radio4,
                            this.tempCopy.radio5,
                            this.tempCopy.radio6,
                            this.tempCopy.radio7
                        );
                    this.post(
                        "/beta/betaService/COS.AD.02.0033",
                        this.tempCopy,
                        (res) => {
                            if (res.returnCode == "000000") {
                                this.dialogFormVisibleCopy = false;
                                this.$notify({
                                    message: "复制成功",
                                    type: "success",
                                });
                                this.getSystemUnitList();
                                this.tempCopy = {};
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
.cl_tr label.el-form-item__label {
    width: 20% !important;
    float: left;
}
.el-radio__label {
    padding-left: 8px;
}
</style>

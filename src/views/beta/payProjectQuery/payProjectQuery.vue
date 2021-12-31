<!-- 收费项目 -->
<template>
    <div class="allContent">
        <el-form :model="feeItemList">
            <el-form-item class="cl_td" :label="$t('payProjectQuery.feeItemNo')" prop="feeItemNo">
                <el-input
                    type="text"
                    v-model="feeItemList.feeItemNo"
                    class="wd200"
                ></el-input>
            </el-form-item>
            <el-form-item class="cl_td" :label="$t('payProjectQuery.feeType')" prop="feeType">
                <el-select
                    clearable
                    v-model="feeItemList.feeType"
                    placeholder="请选择"
                    class="wd200"
                >
                    <el-option
                        v-for="(item, index) in feeTypeList"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                    ></el-option>
                </el-select>
            </el-form-item>
            <div class="cl_tr text_center">
                <el-button
                    type="primary"
                    icon="el-icon-search"
                    @click="handleFilter"
                    >{{$t('search.query')}}</el-button
                >
                <el-button
                    type="primary"
                    icon="el-icon-plus"
                    @click="handleCreate"
                    >{{$t('search.add')}}</el-button
                >
            </div>
        </el-form>

        <el-table
            v-loading="listLoading"
            :data="list"
            border
            fit
            highlight-current-row
            style="width: 100%"
        >
            <el-table-column
                prop="feeItemNo"
                :label="$t('payProjectQuery.feeItemNo')"
                align="center"
            ></el-table-column>
            <el-table-column prop="feeTypeDesc" :label="$t('payProjectQuery.feeType')" align="center">
            </el-table-column>
            <el-table-column prop="feeDesc" :label="$t('payProjectQuery.feeDesc')"></el-table-column>
            <el-table-column
                prop="feeEventNo"
                :label="$t('payProjectQuery.feeEventNo')"
                align="center"
            ></el-table-column>
            <el-table-column
                prop="effectiveDate"
                :label="$t('payProjectQuery.effectiveDate')"
                align="center"
            ></el-table-column>
            <el-table-column
                prop="expirationDate"
                :label="$t('payProjectQuery.expirationDate')"
            ></el-table-column>
            <el-table-column
                :label="$t('table.action')"
                align="center"
                width="250"
                class-name="small-padding fixed-width"
            >
                <template slot-scope="{ row }">
                    <el-button
                        icon="el-icon-more"
                        type="primary"
                        size="mini"
                        @click="handleDetail(row)"
                    >
                        {{$t('table.detail')}}
                    </el-button>
                    <el-button
                        icon="el-icon-edit"
                        type="primary"
                        size="mini"
                        @click="handleUpdate(row)"
                    >
                        {{$t('table.edit')}}
                    </el-button>
                    <!-- {{ $t('table.copy') }} -->
                    <!-- <el-button icon="el-icon-copy" type="primary" size="mini" @click="handleDelete(row,$index)">
            复制
          </el-button> -->
                </template>
            </el-table-column>
        </el-table>

        <pagination
            v-show="total > 0"
            :total="total"
            :page.sync="config.pageNum"
            :limit.sync="config.pageSize"
            @pagination="getList"
        />
        <!-- 新增 -->
        <el-dialog
            :title="$t('payProjectQuery.add_FeeItem')"
            :visible.sync="dialogFormVisible"
            width="75%"
        >
            <el-form
                ref="dataForm"
                :rules="rules"
                :model="tempAdd"
            >
                <el-form-item
                    class="cl_td"
                    :label="$t('payProjectQuery.feeType')"
                    prop="feeType"
                    :rules="[{ required: true, message: $t('payProjectQuery.validate_feeType') }]"
                >
                    <el-select
                        v-model="tempAdd.feeType"
                        class="wd200"
                        clearable
                        @change="getFeeType($event)"
                    >
                        <el-option
                            v-for="(item, index) in feeTypeList"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    :label="$t('payProjectQuery.feeItemNo')"
                    prop="feeItemNoHalf"
                    :rules="[
                        { required: true, message: $t('payProjectQuery.validate_feeItemNo') },
                    ]"
                >
                    <!-- style="display: inline-block; width: 15%" -->
                    <span style="display: inline-block; width:50px;">{{
                        feeItem
                    }}</span>
                    <!-- style="display: inline-block; width: 56%" -->
                    <el-input
                        class="wd150"
                        v-model="tempAdd.feeItemNoHalf"
                        type="text"
                        minlength="4"
                        maxlength="4"
                    />
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    :label="$t('payProjectQuery.feeDesc')"
                    prop="feeDesc"
                    :rules="[{ required: true, message: $t('payProjectQuery.validate_feeDesc')}]"
                >
                    <el-input
                        v-model="tempAdd.feeDesc"
                        class="wd200"
                        type="text"
                    />
                </el-form-item>
                <el-form-item
                    :label="$t('payProjectQuery.feeEventNo')"
                    prop="feeEventNo"
                    class="cl_td"
                >
                    <el-input
                        class="wd200"
                        v-model="tempAdd.feeEventNo"
                        @focus="queryEventList"
                    />
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    :label="$t('payProjectQuery.triggerEventInteractMode')"
                    prop="triggerEventInteractMode"
                >
                    <el-select
                        v-model="tempAdd.triggerEventInteractMode"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(
                                item, index
                            ) in triggerEventInteractModeList"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    :rules="[{ required: true, message: $t('payProjectQuery.validate_effectiveDate')}]"
                    class="cl_td"
                    :label="$t('payProjectQuery.effectiveDate')"
                    prop="effectiveDate"
                >
                    <el-date-picker
                        v-model="tempAdd.effectiveDate"
                        type="date"
                        :placeholder="$t('table.selectDate')"
                        value-format="yyyy-MM-dd"
                        class="wd200"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item
                    :rules="[{ required: true, message: $t('payProjectQuery.validate_expirationDate')}]"
                    class="cl_td"
                    :label="$t('payProjectQuery.expirationDate')"
                    prop="expirationDate"
                >
                    <el-date-picker
                        v-model="tempAdd.expirationDate"
                        align="right"
                        type="date"
                        :placeholder="$t('table.selectDate')"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions"
                        class="wd200"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item
                    :label="$t('payProjectQuery.instanCode1')"
                    prop="instanCode1"
                    class="cl_td"
                >
                    <el-select
                        v-model="tempAdd.instanCode1"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in instanList"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    :label="$t('payProjectQuery.instanCode2')"
                    prop="instanCode2"
                    class="cl_td"
                >
                    <el-select
                        v-model="tempAdd.instanCode2"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in instanList"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    :label="$t('payProjectQuery.instanCode3')"
                    prop="instanCode3"
                    class="cl_td"
                >
                    <el-select
                        v-model="tempAdd.instanCode3"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in instanList"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    :label="$t('payProjectQuery.instanCode4')"
                    prop="instanCode4"
                    class="cl_td"
                >
                    <el-select
                        v-model="tempAdd.instanCode4"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in instanList"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    :label="$t('payProjectQuery.instanCode5')"
                    prop="instanCode5"
                    class="cl_td"
                >
                    <el-select
                        v-model="tempAdd.instanCode5"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in instanList"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('payProjectQuery.itemUse')" prop="itemUse" class="cl_td">
                    <el-select
                        v-model="tempAdd.itemUse"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in itemUseList"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    :label="$t('payProjectQuery.assessmentMethod')"
                    prop="assessmentMethod"
                    class="cl_td"
                    :rules="[{ required: true, message: $t('payProjectQuery.validate_assessmentMethod')}]"
                >
                    <el-select
                        v-model="tempAdd.assessmentMethod"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in assessmentMethodList"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    :label="$t('payProjectQuery.periodicFeeIdentifier')"
                    prop="periodicFeeIdentifier"
                    class="cl_td"
                >
                    <el-select
                        v-model="tempAdd.periodicFeeIdentifier"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in periodicFeeIdentifierList"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    :label="$t('payProjectQuery.chargingFrequency')"
                    prop="chargingFrequency"
                    class="cl_td"
                    v-if="
                        tempAdd.periodicFeeIdentifier == 'C' ||
                        tempAdd.periodicFeeIdentifier == 'P'
                    "
                    :rules="[
                        {
                            required:
                                tempAdd.periodicFeeIdentifier == 'C' ||
                                tempAdd.periodicFeeIdentifier == 'P',
                            message: $t('payProjectQuery.validate_chargingFrequency'),
                        },
                    ]"
                >
                    <el-select
                        v-model="tempAdd.chargingFrequency"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in chargingFrequencyList"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false"> {{$t('table.cancel')}} </el-button>
                <el-button type="primary" @click="createData()">
                    {{$t('table.sure')}}
                </el-button>
            </div>
        </el-dialog>
        <!-- 修改 -->
        <el-dialog
            :title="$t('payProjectQuery.maintain_feeItem')"
            :visible.sync="dialogFormUPVisible"
            width="75%"
        >
            <el-form
                ref="dataUPForm"
                :rules="rules"
                :model="tempUp"
            >
                <el-form-item class="cl_td" :label="$t('payProjectQuery.feeType')" prop="feeType">
                    <el-select v-model="tempUp.feeType" class="wd200" disabled>
                        <el-option
                            v-for="(item, index) in feeTypeList"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('payProjectQuery.feeItemNo')" prop="feeItemNo">
                    <el-input
                        class="wd200"
                        v-model="tempUp.feeItemNo"
                        type="text"
                        minlength="4"
                        maxlength="4"
                        readonly
                    />
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    :label="$t('payProjectQuery.feeDesc')"
                    prop="feeDesc"
                    :rules="[{ required: true, message: $t('payProjectQuery.validate_feeDesc') }]"
                >
                    <el-input
                        v-model="tempUp.feeDesc"
                        class="wd200"
                        type="text"
                    />
                </el-form-item>
                <el-form-item
                    :label="$t('payProjectQuery.feeItemNo')"
                    prop="feeEventNo"
                    class="cl_td"
                >
                    <el-input
                        class="wd200"
                        v-model="tempUp.feeEventNo"
                        @focus="queryEventList"
                    />
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    :label="$t('payProjectQuery.triggerEventInteractMode')"
                    prop="triggerEventInteractMode"
                >
                    <el-select
                        v-model="tempUp.triggerEventInteractMode"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(
                                item, index
                            ) in triggerEventInteractModeList"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    :rules="[{ required: true, message: $t('payProjectQuery.validate_effectiveDate')}]"
                    class="cl_td"
                    :label="$t('payProjectQuery.effectiveDate')"
                    prop="effectiveDate"
                >
                    <el-date-picker
                        v-model="tempUp.effectiveDate"
                        type="date"
                        :placeholder="$t('table.selectDate')"
                        value-format="yyyy-MM-dd"
                        class="wd200"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item
                    :rules="[{ required: true, message: $t('payProjectQuery.validate_expirationDate') }]"
                    class="cl_td"
                    :label="$t('payProjectQuery.expirationDate')"
                    prop="expirationDate"
                >
                    <el-date-picker
                        v-model="tempUp.expirationDate"
                        align="right"
                        type="date"
                        :placeholder="$t('table.selectDate')"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions"
                        class="wd200"
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item
                    :label="$t('payProjectQuery.instanCode1')"
                    prop="instanCode1"
                    class="cl_td"
                >
                    <el-select
                        v-model="tempUp.instanCode1"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in instanList"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    :label="$t('payProjectQuery.instanCode2')"
                    prop="instanCode2"
                    class="cl_td"
                >
                    <el-select
                        v-model="tempUp.instanCode2"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in instanList"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    :label="$t('payProjectQuery.instanCode3')"
                    prop="instanCode3"
                    class="cl_td"
                >
                    <el-select
                        v-model="tempUp.instanCode3"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in instanList"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    :label="$t('payProjectQuery.instanCode4')"
                    prop="instanCode4"
                    class="cl_td"
                >
                    <el-select
                        v-model="tempUp.instanCode4"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in instanList"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    :label="$t('payProjectQuery.instanCode5')"
                    prop="instanCode5"
                    class="cl_td"
                >
                    <el-select
                        v-model="tempUp.instanCode5"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in instanList"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('payProjectQuery.itemUse')" prop="itemUse" class="cl_td">
                    <el-select v-model="tempUp.itemUse" class="wd200" clearable>
                        <el-option
                            v-for="(item, index) in itemUseList"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    :label="$t('payProjectQuery.assessmentMethod')"
                    prop="assessmentMethod"
                    class="cl_td"
                    :rules="[{ required: true, message: $t('payProjectQuery.validate_assessmentMethod')}]"
                >
                    <el-select
                        v-model="tempUp.assessmentMethod"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in assessmentMethodList"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    :label="$t('payProjectQuery.periodicFeeIdentifier')"
                    prop="periodicFeeIdentifier"
                    class="cl_td"
                >
                    <el-select
                        v-model="tempUp.periodicFeeIdentifier"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in periodicFeeIdentifierList"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    :label="$t('payProjectQuery.chargingFrequency')"
                    prop="chargingFrequency"
                    class="cl_td"
                    v-if="
                        tempUp.periodicFeeIdentifier == 'C' ||
                        tempUp.periodicFeeIdentifier == 'P'
                    "
                    :rules="[
                        {
                            required:
                                tempUp.periodicFeeIdentifier == 'C' ||
                                tempUp.periodicFeeIdentifier == 'P',
                            message: $t('payProjectQuery.validate_chargingFrequency'),
                        },
                    ]"
                >
                    <el-select
                        v-model="tempUp.chargingFrequency"
                        class="wd200"
                        clearable
                    >
                        <el-option
                            v-for="(item, index) in chargingFrequencyList"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormUPVisible = false">
                    {{$t('table.cancel')}}
                </el-button>
                <el-button type="primary" @click="updateData()">
                    {{$t('table.sure')}}
                </el-button>
            </div>
        </el-dialog>
        <!-- 详情 -->
        <el-dialog
            :title="$t('payProjectQuery.feeItem_detail')"
            :visible.sync="dialogFormViewVisible"
            width="75%"
        >
            <el-form
                ref="dataViewForm"
                :rules="rules"
                :model="tempView"
            >
                <el-form-item class="cl_td" :label="$t('payProjectQuery.feeType')" prop="feeType">
                    <el-select
                        v-model="tempView.feeType"
                        class="wd200"
                        disabled
                    >
                        <el-option
                            v-for="(item, index) in feeTypeList"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('payProjectQuery.feeItemNo')" prop="feeItemNo">
                    <el-input
                        class="wd200"
                        v-model="tempView.feeItemNo"
                        type="text"
                        minlength="4"
                        maxlength="4"
                        readonly
                    />
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    :label="$t('payProjectQuery.feeDesc')"
                    prop="feeDesc"
                    :rules="[{ required: true, message: $t('payProjectQuery.validate_feeDesc') }]"
                >
                    <el-input
                        v-model="tempView.feeDesc"
                        class="wd200"
                        type="text"
                        readonly
                    />
                </el-form-item>
                <el-form-item
                    :label="$t('payProjectQuery.feeEventNo')"
                    prop="feeEventNo"
                    class="cl_td"
                >
                    <el-input
                        class="wd200"
                        v-model="tempView.feeEventNo"
                        readonly
                    />
                </el-form-item>
                <el-form-item
                    class="cl_td"
                    :label="$t('payProjectQuery.triggerEventInteractMode')"
                    prop="triggerEventInteractMode"
                >
                    <el-select
                        v-model="tempView.triggerEventInteractMode"
                        class="wd200"
                        disabled
                    >
                        <el-option
                            v-for="(
                                item, index
                            ) in triggerEventInteractModeList"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    :rules="[{ required: true, message: $t('payProjectQuery.validate_effectiveDate') }]"
                    class="cl_td"
                    :label="$t('payProjectQuery.effectiveDate')"
                    prop="effectiveDate"
                >
                    <el-date-picker
                        v-model="tempView.effectiveDate"
                        type="date"
                        :placeholder="$t('table.selectDate')"
                        value-format="yyyy-MM-dd"
                        class="wd200"
                        disabled
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item
                    :rules="[{ required: true, message: $t('payProjectQuery.validate_expirationDate')}]"
                    class="cl_td"
                    :label="$t('payProjectQuery.expirationDate')"
                    prop="expirationDate"
                >
                    <el-date-picker
                        v-model="tempView.expirationDate"
                        align="right"
                        type="date"
                        :placeholder="$t('table.selectDate')"
                        value-format="yyyy-MM-dd"
                        :picker-options="pickerOptions"
                        class="wd200"
                        disabled
                    >
                    </el-date-picker>
                </el-form-item>
                <el-form-item
                    :label="$t('payProjectQuery.instanCode1')"
                    prop="instanCode1"
                    class="cl_td"
                >
                    <el-select
                        v-model="tempView.instanCode1"
                        class="wd200"
                        disabled
                    >
                        <el-option
                            v-for="(item, index) in instanList"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    :label="$t('payProjectQuery.instanCode2')"
                    prop="instanCode2"
                    class="cl_td"
                >
                    <el-select
                        v-model="tempView.instanCode2"
                        class="wd200"
                        disabled
                    >
                        <el-option
                            v-for="(item, index) in instanList"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    :label="$t('payProjectQuery.instanCode3')"
                    prop="instanCode3"
                    class="cl_td"
                >
                    <el-select
                        v-model="tempView.instanCode3"
                        class="wd200"
                        disabled
                    >
                        <el-option
                            v-for="(item, index) in instanList"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    :label="$t('payProjectQuery.instanCode4')"
                    prop="instanCode4"
                    class="cl_td"
                >
                    <el-select
                        v-model="tempView.instanCode4"
                        class="wd200"
                        disabled
                    >
                        <el-option
                            v-for="(item, index) in instanList"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    :label="$t('payProjectQuery.instanCode5')"
                    prop="instanCode5"
                    class="cl_td"
                >
                    <el-select
                        v-model="tempView.instanCode5"
                        class="wd200"
                        disabled
                    >
                        <el-option
                            v-for="(item, index) in instanList"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item :label="$t('payProjectQuery.itemUse')" prop="itemUse" class="cl_td">
                    <el-select
                        v-model="tempView.itemUse"
                        class="wd200"
                        disabled
                    >
                        <el-option
                            v-for="(item, index) in itemUseList"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    :label="$t('payProjectQuery.assessmentMethod')"
                    prop="assessmentMethod"
                    class="cl_td"
                    :rules="[{ required: true, message: $t('payProjectQuery.validate_assessmentMethod')}]"
                >
                    <el-select
                        v-model="tempView.assessmentMethod"
                        class="wd200"
                        disabled
                    >
                        <el-option
                            v-for="(item, index) in assessmentMethodList"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    :label="$t('payProjectQuery.periodicFeeIdentifier')"
                    prop="periodicFeeIdentifier"
                    class="cl_td"
                >
                    <el-select
                        v-model="tempView.periodicFeeIdentifier"
                        class="wd200"
                        disabled
                    >
                        <el-option
                            v-for="(item, index) in periodicFeeIdentifierList"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item
                    :label="$t('payProjectQuery.chargingFrequency')"
                    prop="chargingFrequency"
                    class="cl_td"
                    v-if="
                        tempView.periodicFeeIdentifier == 'C' ||
                        tempView.periodicFeeIdentifier == 'P'
                    "
                    :rules="[
                        {
                            required:
                                tempView.periodicFeeIdentifier == 'C' ||
                                tempView.periodicFeeIdentifier == 'P',
                            message: $t('payProjectQuery.validate_chargingFrequency'),
                        },
                    ]"
                >
                    <el-select
                        v-model="tempView.chargingFrequency"
                        class="wd200"
                        disabled
                    >
                        <el-option
                            v-for="(item, index) in chargingFrequencyList"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormViewVisible = false">
                    {{$t('table.close')}}
                </el-button>
            </div>
        </el-dialog>
        <!--事件编号信息-->
        <el-dialog :title="$t('payProjectQuery.eventid_detail')" :visible.sync="dialogForEventSearch">
            <el-form
                ref="dataFormEvent"
                :model="eventTableList"
                style="display: inline-block"
            >
                <el-form-item class="cl_td" :label="$t('evLstList.eventId')" prop="eventId">
                    <el-input
                        v-model="eventTableList.eventId"
                        class="wd200"
                        type="text"
                    />
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.eventDesc')" prop="eventDesc">
                    <el-input
                        v-model="eventTableList.eventDesc"
                        class="wd200"
                        type="text"
                    />
                </el-form-item>

                <div class="col_tr text_center">
                    <el-button
                        size="medium"
                        icon="el-icon-search"
                        type="primary"
                        @click="queryEventDataSearch()"
                        >{{$t('search.query')}}</el-button
                    >
                    <el-button
                        size="medium"
                        icon="el-icon-refresh"
                        type="primary"
                        @click="eventReset()"
                        >{{$t('search.reset')}}</el-button
                    >
                </div>
            </el-form>
            <el-table
                :data="eventDataAdd"
                class="mbtm20"
                fit
                type="selection"
                highlight-current-row
                style="width: 100%"
                border
            >
                <el-table-column width="55">
                    <template slot-scope="scope">
                        <el-radio
                            v-model="choosedEventRadio"
                            :label="scope.row.eventNo"
                        >
                            <span class="el-radio__:label"></span>
                        </el-radio>
                    </template>
                </el-table-column>
                <el-table-column
                    prop="name"
                    :label="$t('evLstList.eventId')"
                    width="180"
                    align="center"
                >
                    <template slot-scope="scope">
                        <span class="">{{ scope.row.eventNo }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="address" :label="$t('evLstList.eventDesc')" align="center">
                    <template slot-scope="scope">
                        <span class="">{{ scope.row.eventDesc }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <pagination
                v-show="tablesTotal02 > 0"
                :total="tablesTotal02"
                :page.sync="eventTableList.pageNum"
                :limit.sync="eventTableList.pageSize"
                @pagination="queryEventDataSearch"
            />
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="sureEvent(choosedEventRadio)"
                    >{{$t('table.sure')}}</el-button
                >
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import ApiService from "@/api/api-service";

export default {
    name: "PayProjectQuery",
    components: { Pagination },
    data() {
        return {
            pickerOptions: {
                disabledDate(time) {
                    return time.getTime() < Date.now();
                },
            },
            list: null,
            total: 0,
            listLoading: true,
            feeItemList: {
                feeItemNo: '',
                feeType: '',
            },
            config: {
                pageSize: 10,
                pageNum: 1,
            },
            feeTypeList: [],
            feeItem: "",
            freeExchangeFlagOptions: [], //下拉框
            showReviewer: false,
            tempAdd: {},
            tempUp: {},
            tempView: {},
            dialogFormVisible: false,
            dialogFormUPVisible: false,
            dialogFormViewVisible: false,
            dialogForEventSearch: false,
            dialogStatus: "",
            pvData: [],
            rules: {
                currencyCode: [
                    {
                        required: true,
                        message: "currencyCode is required",
                        trigger: "blur",
                    },
                ],
                timestamp: [
                    {
                        type: "date",
                        required: true,
                        message: "timestamp is required",
                        trigger: "blur",
                    },
                ],
                countryCode: [{ max: 3 }],
            },
            downloadLoading: false,
            eventDataAdd: [],
            choosedEventRadio: "", // 选择事件
            tablesTotal02: 0,
            eventTableList: {
                pageNum: 1,
                pageSize: 10,
            },
            triggerEventInteractModeList: [],
            instanList: [],
            itemUseList: [],
            assessmentMethodList: [],
            periodicFeeIdentifierList: [],
            chargingFrequencyList: [],
        };
    },
    created() {
        this.getList(); //查询列表
    },
    mounted() {
        //查询下拉框
        this.getSelectDict("dic_costCategory").then((res) => {
            this.feeTypeList = res;
        });
        //查询下拉框
        this.getSelectDict("dic_ interactionType").then((res) => {
            this.triggerEventInteractModeList = res;
        });
        //查询下拉框
        this.getSelectDict("dic_instanceDimension").then((res) => {
            this.instanList = res;
        });
        //查询下拉框
        this.getSelectDict("dic_projectUse").then((res) => {
            this.itemUseList = res;
        });
        //查询下拉框
        this.getSelectDict("dic_billingMethod").then((res) => {
            this.assessmentMethodList = res;
        });
        //查询下拉框
        this.getSelectDict("dic_periodArray").then((res) => {
            this.periodicFeeIdentifierList = res;
        });
        //查询下拉框
        this.getSelectDict("dic_chargingFrequency").then((res) => {
            this.chargingFrequencyList = res;
        });
    },
    methods: {
        //查询列表
        getList() {
            this.listLoading = true;
            let obj = {
                feeItemNo: this.feeItemList.feeItemNo,
                feeType: this.feeItemList.feeType,
                isTrans: true,
                transParams: ["dic_costCategory"],
                transDict: ["feeType"],
            };
            obj = Object.assign(this.config, obj);
            this.getTableList(
                "/beta/betaService/COS.IQ.02.0031",
                obj,
                (res1) => {
                    this.listLoading = false;
                    if (res1.returnCode == "000000") {
                        if (
                            res1.returnData &&
                            res1.returnData.rows &&
                            res1.returnData.rows.length > 0
                        ) {
                            this.list = res1.returnData.rows;
                            this.total = res1.returnData.totalCount;
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
        //查询
        handleFilter() {
            this.config.page = 1;
            this.getList();
        },
        // 获取收费项目前缀
        getFeeType(val) {
            this.feeItem = val;
        },
        //事件编号显示弹框
        queryEventList() {
            this.dialogForEventSearch = true;
            this.queryEventDataSearch();
        },
        //事件编号列表
        queryEventDataSearch() {
            let obj = {
                isTrans: false, //是否需要翻译数据字典
            };
            obj = Object.assign(this.eventTableList, obj);
            this.getTableList(
                "/beta/betaService/COS.IQ.02.0001",
                obj,
                (res) => {
                    if (res.returnCode == "000000") {
                        if (
                            res.returnData &&
                            res.returnData.rows &&
                            res.returnData.rows.length > 0
                        ) {
                            this.eventDataAdd = res.returnData.rows;
                            this.tablesTotal02 = res.returnData.totalCount;
                            this.dialogForEventSearch = true;
                        } else {
                            this.eventDataAdd = [];
                            this.tablesTotal02 = 0;
                        }
                    }
                },
                (err) => {
                    this.eventDataAdd = [];
                    this.tablesTotal02 = 0;
                }
            );
        },
        sureEvent(data) {
            this.tempAdd.feeEventNo = data;
            this.tempUp.feeEventNo = data;
            this.dialogForEventSearch = false;
        },
        // 重置
        eventReset() {
            this.eventTableList = {};
        },
        //新增按钮
        handleCreate() {
            this.dialogFormVisible = true;
            this.$nextTick(() => {
                this.$refs["dataForm"].clearValidate();
            });
        },
        createData() {
            this.$refs["dataForm"].validate((valid) => {
                if (valid) {
                    this.tempAdd.feeItemNo =
                        this.feeItem + this.tempAdd.feeItemNoHalf;
                    delete this.tempAdd.feeItemNoHalf;
                    this.post(
                        "/beta/betaService/COS.AD.02.0026",
                        this.tempAdd,
                        (res) => {
                            if (res.returnCode == "000000") {
                                this.list.unshift(this.tempAdd);
                                this.dialogFormVisible = false;
                                this.$notify({
                                    message: this.$t('table.add_success'),
                                    type: "success",
                                });
                                this.getList();
                                this.tempAdd = {};
                            }
                        }
                    );
                }
            });
        },
        handleUpdate(row) {
            this.tempUp = row; // copy obj
            this.dialogFormUPVisible = true;
            this.$nextTick(() => {
                this.$refs["dataUPForm"].clearValidate();
            });
        },
        updateData() {
            this.$refs["dataUPForm"].validate((valid) => {
                if (valid) {
                    const tempData = Object.assign({}, this.tempUp);
                    if (
                        tempData.periodicFeeIdentifier == "N" ||
                        tempData.periodicFeeIdentifier == "" ||
                        tempData.periodicFeeIdentifier == undefined
                    ) {
                        tempData.chargingFrequency = "";
                    }
                    this.post(
                        "/beta/betaService/COS.UP.02.0029",
                        tempData,
                        (res) => {
                            if (res.returnCode == '000000') {
                                 this.dialogFormUPVisible = false;
                                this.$notify({
                                    message: this.$t('table.up_success'),
                                    type: "success",
                                });
                                this.getList();
                                this.tempUp = {}
                            }
                        }
                    );
                }
            });
        },
        handleDetail(row) {
            this.tempView = row; // copy obj
            this.dialogFormViewVisible = true;
            this.$nextTick(() => {
                this.$refs["dataViewForm"].clearValidate();
            });
        },
    },
};
</script>
<style>
</style>

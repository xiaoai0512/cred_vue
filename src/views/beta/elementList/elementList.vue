<!-- 元件清单 -->
<template>
  <div class="allContent">
    <!-- 表单验证demo: -->
    <el-form ref="elementSearchForm" :model="elementSearchForm" :rules="elementSearchFormRules">
      <el-form-item class="cl_td" :label="$t('elementList.elementNo')" prop="elementNo">
        <el-input v-model="elementSearchForm.elementNo"  class="wd200" type="text" />
      </el-form-item>
      <el-form-item class="cl_td" :label="$t('elementList.elementDesc')" prop="elementDesc">
        <el-input v-model="elementSearchForm.elementDesc" class="wd200" type="text" />
      </el-form-item>
      <div class="cl_tr text_center">
        <el-button v-show="selBtnFlag" size="medium" icon="el-icon-search" type="primary" @click="handleSearch()">{{$t('search.query')}}</el-button>
        <el-button v-show="addBtnFlag" size="medium" icon="el-icon-plus" type="primary" @click="handleAdd()">{{$t('search.add')}}</el-button>
      </div>
    </el-form>
    <el-table
      v-loading="listLoading1"
      :data="ElementList"
      class="mbtm20"
      fit
      highlight-current-row
      style="width: 100%;"
      border
    >
      <el-table-column prop="elementNo" :label="$t('elementList.elementNo')" align="center" />
      <el-table-column prop="elementDesc" :label="$t('elementList.elementDesc')" align="center" />
      <el-table-column prop="" :label="$t('table.action')" align="center">
        <template slot-scope="{row}">
          <el-button v-show="updBtnFlag" size="mini" icon="el-icon-edit" type="primary" @click="handleUpdate(row)">{{$t('elementList.edit_element')}}</el-button>
          <el-button
            v-if="row.pcdFlag == 'false' && addPCDBtnFlag"
            size="mini"
            icon="el-icon-plus"
            type="primary"
            @click="handlePcdAdd(row)"
          >
            {{$t('elementList.pcd_add')}}
          </el-button>
          <el-button
            v-if="row.pcdFlag == 'true' && updPCDBtnFlag"
            size="mini"
            icon="el-icon-edit"
            type="primary"
            @click="handlePcdUp(row)"
          >
            {{$t('elementList.pcd_edit')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="elementTotal>0" :total="elementTotal" :page.sync="elementSearchForm.pageNum" :limit.sync="elementSearchForm.pageSize" @pagination="getElementList" />

    <!-- 新增 弹窗 -->
    <el-dialog :title="$t('elementList.table_add')" :visible.sync="add_dialogForm" width="65%">
      <el-form v-show="part1" ref="add_dataForm1" :rules="add_rules1" :model="addTempObj1">
        <el-form-item
          class="cl_td"
          :label="$t('elementList.elementNo')"
          prop="elementNo"
          :rules="[ { required: true, message: $t('elementList.validate_elementNo1') },
                    { min: 10, max: 10, message: $t('elementList.validate_elementNo2')}
          ]"
        >
          <el-input v-model="addTempObj1.elementNo" class="wd200" type="text" :readonly="isReadonly1" />
        </el-form-item>
        <el-form-item
          class="cl_td"
          :label="$t('elementList.elementDesc')"
          prop="elementDesc"
          :rules="[ { required: true, message: $t('elementList.validate_elementDesc')}]"
        >
          <el-input v-model="addTempObj1.elementDesc" class="wd200" type="text" :readonly="isReadonly1" />
        </el-form-item>
        <el-form-item
          class="cl_td"
          :label="$t('elementList.supportPersonal')"
          prop="supportPersonal"
          :rules="[ { required: true, message: $t('validate.require')}]"
        >
          <el-select v-model="addTempObj1.supportPersonal" class="wd200" clearable :disabled="isAble1">
            <el-option
              v-for="(item, index ) in supportOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          class="cl_td"
          :label="$t('elementList.supportPcd')"
          prop="supportPcd"
          :rules="[ { required: true, message: $t('validate.require')}]"
        >
          <el-select v-model="addTempObj1.supportPcd" class="wd200" clearable :disabled="isAble1">
            <el-option
              v-for="(item, index ) in supportOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <div v-show="part1Btn" class="cl_tr text_center">
          <el-button size="small" icon="el-icon-arrow-down" type="primary" @click="add_sureBtn()">
            {{$t('elementList.add_element')}}
          </el-button>
        </div>

      </el-form>
      <!--  part1 end -->

      <el-form v-show="part2" ref="add_dataForm2" :rules="add_rules2" :model="addTempObj2">
        <div class="text_title">{{ pcdTitle }}</div>
        <el-form-item
          class="cl_td"
          :label="$t('pcd.pcdNo')"
          prop="pcdNo"
        >
          <el-input v-model="addTempObj2.pcdNo" class="wd200" type="text"  :readonly="true"/>
        </el-form-item>
        <el-form-item
          class="cl_td"
          :label="$t('pcd.pcdDesc')"
          prop="pcdDesc"
          :rules="[ { required: true, message:$t('pcd.validate_pcdDesc')}]"
        >
          <el-input v-model="addTempObj2.pcdDesc" class="wd200" type="text" :readonly="isReadonly2"  />
        </el-form-item>
        <el-form-item class="cl_td" :label="$t('pcd.baseInstanDimen')" prop="baseInstanDimen">
          <el-input v-model="addTempObj2.baseInstanDimen" class="wd200" type="text" :readonly="isReadonly2" />

        </el-form-item>
        <el-form-item class="cl_td" :label="$t('pcd.optionInstanDimen')" prop="optionInstanDimen">
          <el-input v-model="addTempObj2.optionInstanDimen" class="wd200" type="text" :readonly="isReadonly2" />

        </el-form-item>
        <el-form-item class="cl_td" :label="$t('pcd.activityTagValidFlag')" prop="activityTagValidFlag">
          <el-select v-model="addTempObj2.activityTagValidFlag" class="wd200" clearable :disabled="isAble2">
            <el-option
              v-for="(item, index ) in activityTagValidFlagOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="cl_td" :label="$t('pcd.segmentType')" prop="segmentType">
          <el-select v-model="addTempObj2.segmentType" class="wd200" clearable :disabled="isAble2">
            <el-option
              v-for="(item, index ) in segmentTypeOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <div v-show="part2Btn" class="cl_tr text_center">
          <el-button size="small" icon="el-icon-arrow-up" type="primary" @click="backP1Btn()">
            {{$t('table.pre_step')}}
          </el-button>
          <el-button size="small" icon="el-icon-arrow-down" type="primary" @click="nextP3Btn()">
            {{ pcdInitTitle }}
          </el-button>
        </div>
      </el-form>
      <!--  part2 end -->
      <el-form v-show="part3" ref="add_dataForm3" :rules="add_rules3" :model="addTempObj3">
        <div class="text_title">{{ pcdInitTitle }}</div>
        <el-form-item
          class="cl_td"
          :label="$t('pcd.pcd_init_add')"
          prop="pcdNo"
        >
          <el-input v-model="addTempObj3.pcdNo" class="wd200" type="text" :readonly="true" />
        </el-form-item>
        <el-form-item class="cl_td" :label="$t('pcd.segmentSerialNum')" prop="segmentSerialNum">
          <el-input v-model="addTempObj3.segmentSerialNum" class="wd200" type="text" :readonly="true" />
        </el-form-item>
        <el-form-item class="cl_td" :label="$t('pcd.pcdType')" prop="pcdType">
          <el-select v-model="addTempObj2.pcdType" class="wd200" clearable :disabled="isAble3">
            <el-option
              v-for="(item, index ) in pcdTypeOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="cl_td" :label="$t('pcd.pcdPoint')" prop="pcdPoint">
          <el-input v-model="addTempObj3.pcdPoint" class="wd200" type="text" :readonly="isReadonly3" />
        </el-form-item>
        <el-form-item class="cl_td" :label="$t('pcd.segmentValue')" prop="segmentValue">
          <el-input v-model="addTempObj3.segmentValue" class="wd200" type="text" :readonly="isReadonly3" />
        </el-form-item>
        <el-form-item class="cl_td" :label="$t('pcd.pcdValue')" prop="pcdValue">
          <el-input v-model="addTempObj3.pcdValue" class="wd200" type="text" />
        </el-form-item>
        <div v-show="part3Btn" class="cl_tr text_center">
          <el-button size="small" icon="el-icon-arrow-up" type="primary" @click="backP2Btn()">
            {{$t('table.pre_step')}}
          </el-button>
        </div>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addClose()">  
          {{$t('table.close')}}
        </el-button>
        <el-button v-show="part3" type="primary" @click="sureAddData()">
          {{$t('table.sure')}}
        </el-button>
      </div>
    </el-dialog>

    <!-- 元件维护 -->
    <el-dialog :title="$t('elementList.edit_element')" :visible.sync="up_dialogForm" width="65%">
      <el-form ref="up_dataForm" :rules="up_rules" :model="upTempObj">
        <el-form-item
          class="cl_td"
          :label="$t('elementList.elementNo')"
          prop="elementNo"
          :rules="[ { required: true, message: $t('elementList.validate_elementNo1')},
                    { min: 10, max: 10, message: $t('elementList.validate_elementNo2')}
          ]"
        >
          <el-input v-model="upTempObj.elementNo" class="wd200" type="text" readonly />
        </el-form-item>
        <el-form-item
          class="cl_td"
          :label="$t('elementList.elementDesc')"
          prop="elementDesc"
          :rules="[ { required: true, message: $t('elementList.validate_elementDesc')}]"
        >
          <el-input v-model="upTempObj.elementDesc" class="wd200" type="text" />
        </el-form-item>
        <el-form-item
          class="cl_td"
          :label="$t('elementList.supportPersonal')"
          prop="supportPersonal"
          :rules="[ { required: true, message: $t('validate.require')}]"
        >
          <el-select v-model="upTempObj.supportPersonal" class="wd200" clearable>
            <el-option
              v-for="(item, index ) in supportOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          class="cl_td"
          :label="$t('elementList.supportPcd')"
          prop="supportPcd"
          :rules="[ { required: true, message: $t('validate.require')}]"
        >
          <el-select v-model="upTempObj.supportPcd" class="wd200" clearable>
            <el-option
              v-for="(item, index ) in supportOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="up_dialogForm = false">
          {{$t('table.cancel')}}
        </el-button>
        <el-button type="primary" @click="updateData()">
          {{$t('table.sure')}}
        </el-button>
      </div>
    </el-dialog>
    <!-- 元件维护结束 -->

    <!-- pcd新增 -->
    <el-dialog :title="$t('pcd.table_add')" :visible.sync="addPcd_dialogForm" width="65%">
      <el-form ref="addPcd_dataForm" :rules="addPcd_rules" :model="addPcdTempObj">
        <el-form-item
          class="cl_td"
          :label="$t('pcd.pcdNo')"
          prop="pcdNo"
          :rules="[ { required: true, message: $t('pcd.validate_pcdNo1')},
                    { min: 8, max: 8, message: $t('pcd.validate_pcdNo2')}
          ]"
        >
          <el-input v-model="addPcdTempObj.pcdNo" class="wd200" type="text" :readonly="true" />
        </el-form-item>
        <el-form-item
          class="cl_td"
          :label="$t('pcd.pcdDesc')"
          prop="pcdDesc"
          :rules="[ { required: true, message: $t('pcd.validate_pcdDesc')}]"
        >
          <el-input v-model="addPcdTempObj.pcdDesc" class="wd200" type="text" :readonly="isReadonly2Add" />
        </el-form-item>
        <el-form-item class="cl_td" :label="$t('pcd.baseInstanDimen')" prop="baseInstanDimen">
          <el-input v-model="addPcdTempObj.baseInstanDimen" class="wd200" type="text" :readonly="isReadonly2Add" />
        </el-form-item>
        <el-form-item class="cl_td" :label="$t('pcd.optionInstanDimen')" prop="optionInstanDimen">
          <el-input v-model="addPcdTempObj.optionInstanDimen" class="wd200" type="text" :readonly="isReadonly2Add" />
        </el-form-item>
        <el-form-item class="cl_td" :label="$t('pcd.activityTagValidFlag')" prop="activityTagValidFlag">
          <el-select v-model="addPcdTempObj.activityTagValidFlag" class="wd200" clearable :disabled="isAble2Add">
            <el-option
              v-for="(item, index ) in activityTagValidFlagOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="cl_td" :label="$t('pcd.segmentType')" prop="segmentType">
          <el-select v-model="addPcdTempObj.segmentType" class="wd200" clearable :disabled="isAble2Add">
            <el-option
              v-for="(item, index ) in segmentTypeOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <div v-show="part2BtnAdd" class="cl_tr text_center">
          <el-button size="small" icon="el-icon-arrow-down" type="primary" @click="addPcd_addPcdInitBtn()">
            {{$t('pcd.pcd_init_add')}}
          </el-button>
        </div>
      </el-form>
      <el-form v-show="part3Add" ref="addPcd_dataForm2" :rules="addPcd_rules2" :model="addPcdTempObj2">
        <div class="text_title">{{$t('pcd.pcd_init_add')}}</div>
        <el-form-item
          class="cl_td"
          :label="$t('pcd.pcd_init_add')"
          prop="pcdNo"
          :rules="[ { required: true, message: $t('pcd.validate_pcdNo1')},
                    { min: 8, max: 8, message: $t('pcd.validate_pcdNo2')}
          ]"
        >
          <el-input v-model="addPcdTempObj2.pcdNo" class="wd200" type="text" :readonly="true" />
        </el-form-item>
        <el-form-item class="cl_td" :label="$t('pcd.segmentSerialNum')" prop="segmentSerialNum">
          <el-input v-model="addPcdTempObj2.segmentSerialNum" class="wd200" type="text" :readonly="true" />
        </el-form-item>
        <el-form-item class="cl_td" :label="$t('pcd.pcdType')" prop="pcdType">
          <el-select v-model="addPcdTempObj2.pcdType" class="wd200" clearable :disabled="isAble3Add">
            <el-option
              v-for="(item, index ) in pcdTypeOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="cl_td" :label="$t('pcd.pcdPoint')" prop="pcdPoint">
          <el-input v-model="addPcdTempObj2.pcdPoint" class="wd200" type="text" :readonly="isReadonly3Add" />
        </el-form-item>
        <el-form-item class="cl_td" :label="$t('pcd.segmentValue')" prop="segmentValue">
          <el-input v-model="addPcdTempObj2.segmentValue" class="wd200" type="text" :readonly="isReadonly3Add" />
        </el-form-item>
        <el-form-item class="cl_td" :label="$t('pcd.pcdValue')" prop="pcdValue">
          <el-input v-model="addPcdTempObj2.pcdValue" class="wd200" type="text" :readonly="isReadonly3Add"/>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="addPcd_dialogForm = false">
          {{$t('table.cancel')}}
        </el-button>
        <el-button type="primary" @click="addPcd_CreateData()">
          {{$t('table.sure')}}
        </el-button>
      </div>
    </el-dialog>

    <!-- pcd维护 -->
    <el-dialog :title="$t('pcd.table_edit')" :visible.sync="upPcd_dialogForm" width="65%">
      <el-form ref="upPcd_dataForm" :rules="upPcd_rules" :model="upPcdTempObj">
        <div class="text_title">{{$t('pcd.table_edit')}}</div>
        <el-form-item
          class="cl_td"
          :label="$t('pcd.pcdNo')"
          prop="pcdNo"
          :rules="[ { required: true, message:$t('pcd.validate_pcdNo1')},
                    { min: 8, max: 8, message: $t('pcd.validate_pcdNo2')} ]"
        >
          <el-input v-model="upPcdTempObj.pcdNo" class="wd200" type="text" :readonly="true" />
        </el-form-item>
        <el-form-item
          class="cl_td"
          :label="$t('pcd.pcdDesc')"
          prop="pcdDesc"
          :rules="[ { required: true, message: $t('pcd.validate_pcdDesc')}]"
        >
          <el-input v-model="upPcdTempObj.pcdDesc" class="wd200" type="text"  />
        </el-form-item>
        <el-form-item class="cl_td" :label="$t('pcd.baseInstanDimen')" prop="baseInstanDimen">
          <el-input v-model="upPcdTempObj.baseInstanDimen" class="wd200" type="text"  />
        </el-form-item>
        <el-form-item class="cl_td" :label="$t('pcd.optionInstanDimen')" prop="optionInstanDimen">
          <el-input v-model="upPcdTempObj.optionInstanDimen" class="wd200" type="text"  />
        </el-form-item>
        <el-form-item class="cl_td" :label="$t('pcd.activityTagValidFlagOptions')" prop="activityTagValidFlag">
          <el-select v-model="upPcdTempObj.activityTagValidFlag" class="wd200" clearable >
            <el-option
              v-for="(item, index ) in activityTagValidFlagOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="cl_td" :label="$t('pcd.segmentType')" prop="segmentType">
          <el-select v-model="upPcdTempObj.segmentType" class="wd200" clearable >
            <el-option
              v-for="(item, index ) in segmentTypeOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <el-form ref="upPcd_dataForm2" :rules="upPcd_rules2" :model="upPcdTempObj2">
        <div class="text_title">$t('pcd.pcd_init_edit')</div>
        <el-form-item
          class="cl_td"
          :label="$t('pcd.pcd_init_add')"
          prop="pcdNo"
          :rules="[ { required: true, message: $t('pcd.validate_pcdNo1')},
                    { min: 8, max: 8, message: $t('pcd.validate_pcdNo2')}]"
        >
          <el-input v-model="upPcdTempObj2.pcdNo" class="wd200" type="text" :readonly="true" />
        </el-form-item>
        <el-form-item class="cl_td" :label="$t('pcd.segmentSerialNum')" prop="segmentSerialNum">
          <el-input v-model="upPcdTempObj2.segmentSerialNum" class="wd200" type="text" :readonly="true" />
        </el-form-item>
        <el-form-item class="cl_td" :label="$t('pcd.pcdType')" prop="pcdType">
          <el-select v-model="upPcdTempObj2.pcdType" class="wd200" clearable >
            <el-option
              v-for="(item, index ) in pcdTypeOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="cl_td" :label="$t('pcd.pcdPoint')" prop="pcdPoint">
          <el-input v-model="upPcdTempObj2.pcdPoint" class="wd200" type="text"  />
        </el-form-item>
        <el-form-item class="cl_td" :label="$t('pcd.segmentValue')" prop="segmentValue">
          <el-input v-model="upPcdTempObj2.segmentValue" class="wd200" type="text" />
        </el-form-item>
        <el-form-item class="cl_td" :label="$t('pcd.pcdValue')" prop="pcdValue">
          <el-input v-model="upPcdTempObj2.pcdValue" class="wd200" type="text" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="upPcd_dialogForm = false">
          {{$t('table.cancel')}}
        </el-button>
        <el-button type="primary" @click="upPcd_CreateData()">
          {{$t('table.sure')}}
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination'
export default {
  name: 'ElementList',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Pagination
  },
  data() {
    return {
      elementSearchForm: {
        pageNum: 1,
        pageSize: 10
      },
      elementSearchFormRules: {},
      ElementList: [],
      elementTotal: 0,

      listLoading1: false,
      selBtnFlag: false,
      addBtnFlag: false,
      updBtnFlag: false,
      updPCDBtnFlag: false,
      addPCDBtnFlag: false,
      btnAuthStr: '',

      // 新增
      part1: true,
      part1Btn: true,
      part2: false,
      part2Btn: false,
      pcdTitle: '',
      pcdInitTitle: '',
      part3: false,
      part3Btn: false,

      // 元件新增部分
      add_dialogForm: false,
      add_dataForm1: {},
      add_dataForm2: {},
      add_dataForm3: {},
      add_rules1: {},
      add_rules2: {},
      add_rules3: {},
      addTempObj1: {},
      supportOptions: [],
      isAble1: false,
      isReadonly1: false,
      // pcd部分
      addTempObj2: {},
      activityTagValidFlagOptions: [],
      segmentTypeOptions: [],
      isAble2: false,
      isReadonly2: false,
      // pcd初始值部分
      addTempObj3: {},
      pcdTypeOptions: [],
      isAble3: false,
      isReadonly3: false,

      // 元件维护
      up_dataForm: {},
      up_rules: {},
      upTempObj: {},
      up_dialogForm: false,

      // pcd 新增
      addPcd_dialogForm: false,
      addPcd_dataForm: {},
      addPcd_rules: {},
      addPcdTempObj: {},
      addPcd_dialogForm2: false,
      addPcd_dataForm2: {},
      addPcd_rules2: {},
      addPcdTempObj2: {},

      // pcd维护
      upPcd_dialogForm: false,
      upPcd_dataForm: {},
      upPcd_rules: {},
      upPcdTempObj: {},
      upPcd_dataForm2: {},
      upPcd_rules2: {},
      upPcdTempObj2: {},

      isReadonly2Add: false,
      isAble2Add:false,
      part2BtnAdd:false,
      part3Add:false,
      isAble3Add:false,
      isReadonly3Add:false

    }
  },
  created() {
    // this.init()
    this.getBtnAuth()
  },
  mounted() {
    this.getElementList()

    // 是否支持
    this.getSelectDict('dic_standByType').then((res) => {
      this.supportOptions = res
    })
    // 活动标签生效下拉框
    this.getSelectDict('dic_activityTagTakesEffect').then((res) => {
      this.activityTagValidFlagOptions = res
    })
    // 分段类型下拉框
    this.getSelectDict('dic_segmentationType').then((res) => {
      this.segmentTypeOptions = res
    })
    // 分段类型下拉框
    this.getSelectDict('dic_valueType').then((res) => {
      this.pcdTypeOptions = res
    })
  },
  methods: {
    // 查询按钮权限
    getBtnAuth() {
      // console.log(window.sessionStorage.getItem('menuNo'))
      const params = {
        menuNo: window.sessionStorage.getItem('menuNo')
      }
      this.elementSearchForm = Object.assign(this.elementSearchForm, params)
      this.getTableList('/beta/betaService/COS.CS.01.0030', params, (res) => {
        if (res.returnCode == '000000') {
          if (res.returnData && res.returnData.length > 0) {
            res.returnData.forEach(item => {
              this.btnAuthStr += item.eventNo + ','
            })
            // console.log(this.btnAuthStr)
            if (this.btnAuthStr.includes('COS.IQ.02.0009')) { // 查询
              this.selBtnFlag = true
            } else {
              this.selBtnFlag = false
            }
            if (this.btnAuthStr.includes('COS.AD.02.0051')) { // 新增
              this.addBtnFlag = true
            } else {
              this.addBtnFlag = false
            }
            if (this.btnAuthStr.includes('COS.UP.02.0009')) { // 元件维护
              this.updBtnFlag = true
            } else {
              this.updBtnFlag = false
            }
            if (this.btnAuthStr.includes('COS.UP.02.0052')) { // 维护PCD
	   					this.updPCDBtnFlag = true
	   				} else {
	   					this.updPCDBtnFlag = false
	   				}
            if (this.btnAuthStr.includes('COS.AD.02.0051')) { // 新增PCD
	   					this.addPCDBtnFlag = true
	   				} else {
	   					this.addPCDBtnFlag = false
	   				}
          }
        }
      })
    },
    // 活动清单
    getElementList() {
      this.listLoading1 = true
      const obj = {
        isTrans: true,
        transParams: ['dic_logHierarchy', 'dic_logType'],
        transDict: ['logLevel', 'logType']
      }
      this.elementSearchForm = Object.assign(this.elementSearchForm, obj)
      this.getTableList('/beta/betaService/COS.IQ.02.0009', this.elementSearchForm, (res) => {
        if (res.returnCode == '000000') {
        	 this.listLoading1 = false
          if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
            this.ElementList = res.returnData.rows
            this.elementTotal = res.returnData.totalCount
          }else {
          	this.ElementList = []
            this.elementTotal = 0
          }
        }
      }, (err) => {
      		this.ElementList = []
          this.elementTotal = 0
          this.listLoading1 = false
      })
    },
    handleSearch() {
      this.elementSearchForm.pageNum = 1
      this.elementSearchForm.pageSize = 10
      this.getElementList()
    },
    handleUpdate(row) {
      this.up_dialogForm = true
      this.upTempObj = row
    },
    // 确定 元件维护
    updateData() {
      this.$refs['up_dataForm'].validate((valid) => {
        if (valid) {
          this.post('/beta/betaService/COS.UP.02.0009', this.upTempObj, (res) => {
            if (res.returnCode == '000000') {
              this.$notify({
                title: 'Success',
                message: this.$t('table.up_success'),
                type: 'success',
                duration: 2000
              })
              this.up_dialogForm = false
              this.getElementList()
            }
          })
        }
      })
    },
    handleAdd() {
      this.add_dialogForm = true
      this.isAble1 = false
      this.part1Btn = true
      this.isReadonly1 = false
      this.$nextTick(() => {
          this.$refs['add_dataForm1'].clearValidate()
      })
    },
    addClose(){
      this.add_dialogForm = false
      this.getElementList()
      this.addTempObj1 = {}
      this.part2 = false
      this.part3 = false
      this.addTempObj2 = {}
      this.addTempObj3 = {}
      this.add_dialogForm = false
      this.isReadonly1 = false
      this.$forceUpdate()
    },
    // 确定新增元件
    sureAddData() {
      this.$refs['add_dataForm3'].validate((valid) => {
        if (valid) {
          const paramObj = Object.assign(this.addTempObj2, this.addTempObj3)
          if (this.addTempObj1.isExist != 'true') {
            this.post('/beta/betaService/COS.AD.02.0051', paramObj, (res) => {
              if (res.returnCode == '000000') {
                this.$notify({
                  message: this.$t('table.add_success'),
                  type: 'success',
                })
              }
            })
          } else {
            this.post('/beta/betaService/COS.UP.02.0052', paramObj, (res) => {
              if (res.returnCode == '000000') {
                this.$notify({
                  message:  this.$t('table.add_success'),
                  type: 'success',
                })
              }
            })
          }
          this.add_dialogForm = false
          this.getElementList()
          this.part2 = false
          this.part3 = false
          this.addTempObj1 = {}
          this.addTempObj2 = {}
          this.addTempObj3 = {}
        }
      })
    },
    // 确定新增元件
    add_sureBtn() {
      this.$refs['add_dataForm1'].validate((valid) => {
        if (valid) {
          this.addTempObj2.pcdNo = this.addTempObj1.elementNo.substring(0, 8)
          this.addTempObj1.pcdDesc = this.addTempObj2.pcdDesc
          this.post('/beta/betaService/COS.AD.02.0009', this.addTempObj1, (ress) => {
            if (ress.returnCode == '000000') {
              this.part2 = true
              this.part2Btn = true
              if (this.addTempObj1.supportPcd == 'N') { // 不支持pcd
                this.add_dialogForm = false
                this.part1Btn = true
                this.isReadonly1 = false
                this.isAble1 = false
                this.$notify({
                  message: this.$t('table.add_success'),
                  type: 'success',
                })
                this.getElementList()
              } else if (this.addTempObj1.supportPcd == 'Y') {
                this.isReadonly1 = true
                this.isAble1 = true
                this.part1Btn = false
                this.addTempObj1.pcdNo = this.addTempObj1.elementNo.substring(0, 8)
                this.post('/beta/betaService/COS.IQ.02.0010', this.addTempObj1, (res) => {
                  if (res.returnCode == '000000') {
                    if (res.returnData.totalCount != 0) {
                      this.addTempObj2 = res.returnData.rows[0]
                      this.pcdTitle = this.$t('pcd.pcd_edit')
                      this.pcdInitTitle = this.$t('pcd.pcd_init_edit')
                      this.addTempObj1.isExist = 'true'
                      this.$notify({
                        message:  this.$t('pcd.js_add_success1'),
                        type: 'success',
                      })
                    } else {
                      this.pcdTitle = this.$t('pcd.table_add')
                      this.pcdInitTitle = this.$t('pcd.pcd_init_add')
                      this.$notify({
                        message: this.$t('pcd.js_add_success2'),
                        type: 'success',
                      })
                    }
                  }
                })
              }
            }
          })
        }
      })
    },

    // {{$t('table.pre_step')}}
    backP1Btn() {
      this.part2 = false
      this.part1Btn = true
      this.isAble1 = false
      this.isReadonly1 = false
    },
    // pcd初始值
    nextP3Btn() {
      this.$refs['add_dataForm2'].validate((valid) => {
        if (valid) {
          this.part2Btn = false
          this.part3 = true
          this.part3Btn = true
          this.isAble2 = true
          this.isReadonly2 = true
          this.addTempObj3.pcdNo = this.addTempObj2.pcdNo
          this.addTempObj3.segmentSerialNum = 0
          this.post('/beta/betaService/COS.IQ.02.0046', this.addTempObj1, (res) => {
            if (res.returnCode == '000000') {
              if (res.returnData.totalCount != 0) {
                this.addTempObj3 = res.returnData.rows[0]
              }
            }
          })
        }
      })
    },

    // {{$t('table.pre_step')}}
    backP2Btn() {
      this.part3 = false
      this.part2Btn = true
      this.isAble2 = false
      this.isReadonly2 = false
    },

    // pcd新增按钮
    handlePcdAdd(row) {
      this.addPcdTempObj.pcdNo = row.elementNo.substring(0, 8)
      this.addPcd_dialogForm = true
      this.isAble2Add = false
      this.part2BtnAdd = true
      this.isReadonly2Add = false
      this.$nextTick(() => {
          this.$refs['addPcd_dataForm'].clearValidate()
      })
    },
    // pcd新增 pcd初始化新增
    addPcd_addPcdInitBtn() {
      this.$refs['addPcd_dataForm'].validate((valid) => {
        if (valid) {
          this.isAble2Add = true
          this.part2BtnAdd = true
          this.isReadonly2Add = true
          this.isReadonly3Add = false
          this.isAble3Add = false
          this.post('/beta/betaService/COS.IQ.02.0046', this.addPcdTempObj, (res) => {
            if (res.returnCode == '000000') {
              if (res.returnData.totalCount != 0) {
                this.addPcdTempObj2 = res.returnData.rows[0]
              }
            }
          })
        }
      })
    },
    // 确定 pcd 新增
    addPcd_CreateData() {
      const paramObj = Object.assign(this.addPcdTempObj, this.addPcdTempObj2)
      this.post('/beta/betaService/COS.AD.02.0051', paramObj, (res) => {
        if (res.returnCode == '000000') {
          this.$notify({
            message: this.$t('pcd.js_add_success3'),
            type: 'success',
          })
          this.addPcd_dialogForm = false
          this.getElementList()
        }
      })
    },

    // pcd维护按钮
    handlePcdUp(row) {
      this.upPcdTempObj.pcdNo = row.elementNo.substring(0, 8)
      this.upPcd_dialogForm = true
      const paramObj = {
        pcdNo: this.upPcdTempObj.pcdNo
      }
      this.post('/beta/betaService/COS.IQ.02.0010', paramObj, (res) => {
        if (res.returnCode == '000000') {
          if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
            this.upPcdTempObj = {}
            this.upPcdTempObj2 = {}
            this.upPcdTempObj = res.returnData.rows[0]
            this.upPcdTempObj2 = res.returnData.rows[0].pcdInitList[0]
          }
        }
      })
      //COS.IQ.02.0046查询pcd初始值，但是需要参数分段序号，此处为空（构件262为例），所以直接从COS.IQ.02.0010获取
      // this.post('/beta/betaService/COS.IQ.02.0046', paramObj, (res) => {
      //   if (res.returnCode == '000000') {
      //     if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
      //       this.upPcdTempObj2 = res.returnData.rows[0]
      //     }
      //   }
      // })
    },
    // 确定 pcd维护
    upPcd_CreateData() {
      const paramUpdate = {
        pcdDesc:this.upPcdTempObj.pcdDesc,
        baseInstanDimen:this.upPcdTempObj.baseInstanDimen,
        optionInstanDimen:this.upPcdTempObj.optionInstanDimen,
        activityTagValidFlag:this.upPcdTempObj.activityTagValidFlag,
        segmentType:this.upPcdTempObj.segmentType
      }
      const paramObj = Object.assign(this.upPcdTempObj, this.upPcdTempObj2, paramUpdate)
      this.post('/beta/betaService/COS.UP.02.0052', paramObj, (res) => {
        if (res.returnCode == '000000') {
          this.$notify({
            message: this.$t('pcd.js_add_success4'),
            type: 'success',
          })
          this.upPcd_dialogForm = false
          this.getElementList()
        }
      })
    }

  }
}
</script>

<style>
</style>

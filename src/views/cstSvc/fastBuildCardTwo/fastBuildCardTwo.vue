<template>
  <div class="allContent">
    <el-form
      ref="cstSearchForm"
      :model="cstSearchForm"
      :rules="cstSearchFormRules"
      v-show="showSearchDiv"
    >
      <el-form-item class="cl_td" label="证件类型" prop="idType">
        <el-select
          clearable
          v-model="cstSearchForm.idType"
          class="wd200"
          @change="idTypeHandleChange"
        >
          <el-option
            v-for="(item, index) in idTypeOptions"
            :key="index"
            :label="item.detailDesc"
            :value="item.codes"
          />
        </el-select>
      </el-form-item>
      <el-form-item class="cl_td" label="证件号码" prop="idNumber">
        <el-tooltip
          class="item"
          effect="dark"
          :content="tooltipText"
          placement="top"
        >
          <el-input
            v-model="cstSearchForm.idNumber"
            class="wd200"
            type="text"
            @focus="idNoChange"
          />
        </el-tooltip>
      </el-form-item>
      <div class="cl_tr text_center">
        <el-button
          size="medium"
          icon="el-icon-search"
          type="primary"
          @click="hadleSearch()"
          >查询</el-button
        >
        <el-button
          size="medium"
          icon="el-icon-refresh"
          type="primary"
          @click="reset()"
          >重置</el-button
        >
      </div>
    </el-form>
    <!-- 1客户基本资料 start -->
    <div v-show="cstBaseEstDiv" class="step step1">
      <div class="module_title">客户资料建立</div>
      <div class="text_title">1.客户基本信息建立</div>
      <el-form
        ref="cstBaseInfoRef"
        :rules="cstBaseRules"
        :model="cstBaseInfoForm"
      >
        <el-form-item
          class="cl_td"
          label="机构号"
          prop="institutionId"
          :rules="[
            { required: true, message: '请输入机构号', trigger: 'change' },
          ]"
        >
          <el-select
            clearable
            v-model="cstBaseInfoForm.institutionId"
            class="wd200"
          >
            <el-option
              v-for="(item, index) in institutionIdOptions"
              :key="index"
              :label="item.organName"
              :value="item.organNo"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          class="cl_td"
          label="客户名称"
          prop="customerName"
          :rules="[
            { required: true, message: '请输入客户名称', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="cstBaseInfoForm.customerName"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td"
          label="证件类型"
          prop="idType"
          :rules="[
            { required: true, message: '请输入证件类型', trigger: 'blur' },
          ]"
        >
          <el-select
            clearable
            v-model="cstBaseInfoForm.idType"
            class="wd200"
            :disabled="idType_isDisabled"
            @change="idTypeHandleChange2"
          >
            <el-option
              v-for="(item, index) in idTypeOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          class="cl_td"
          label="证件号码"
          prop="idNumber"
          :rules="[
            { required: true, message: '请输入证件号码', trigger: 'blur' },
          ]"
        >
          <el-input
            v-model="cstBaseInfoForm.idNumber"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td"
          label="客户类型"
          prop="customerType"
          :rules="[
            { required: true, message: '请输入客户类型', trigger: 'change' },
          ]"
        >
          <el-select
            clearable
            v-model="cstBaseInfoForm.customerType"
            class="wd200"
          >
            <el-option
              v-for="(item, index) in customerTypeOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          class="cl_td"
          label="账单日"
          prop="billDay"
          :rules="[
            { required: true, message: '请输入账单日', trigger: 'change' },
          ]"
        >
          <el-select clearable v-model="cstBaseInfoForm.billDay" class="wd200">
            <el-option
              v-for="(item, index) in billDayOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          class="cl_td"
          label="还款选项"
          prop="paymentMark"
          :rules="[
            { required: true, message: '请输入还款选项', trigger: 'change' },
          ]"
        >
          <el-select
            clearable
            v-model="cstBaseInfoForm.paymentMark"
            class="wd200"
          >
            <el-option
              v-for="(item, index) in paymentMarkOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="cl_td" label="城市" prop="city">
          <el-input v-model="cstBaseInfoForm.city" class="wd200" type="text" />
        </el-form-item>
        <el-form-item
          v-show="showHKno"
          class="red cl_td"
          label="港澳台居民居住证"
          prop="idNumberHmt"
        >
          <el-input
            v-model="cstBaseInfoForm.idNumberHmt"
            class="wd200"
            type="text"
          />
        </el-form-item>

        <div class="text_title">2.客户个人信息</div>
        <el-form-item class="cl_td" label="分行号 " prop="branchNumber">
          <el-input
            v-model="cstBaseInfoForm.branchNumber"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <el-form-item class="cl_td" label="生日 " prop="dateOfBirth">
          <el-date-picker
            v-model="cstBaseInfoForm.dateOfBirth"
            class="wd200"
            type="date"
            placeholder="选择日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyyMMdd"
          />
        </el-form-item>

        <el-form-item class="cl_td" label="性别 " prop="sexCode">
          <el-select clearable v-model="cstBaseInfoForm.sexCode" class="wd200">
            <el-option
              v-for="(item, index) in sexCodeOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="cl_td" label="手机号码 " prop="mobilePhone">
          <el-input
            v-model="cstBaseInfoForm.mobilePhone"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <el-form-item class="cl_td" label="家庭电话 " prop="homePhone">
          <el-input
            v-model="cstBaseInfoForm.homePhone"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <el-form-item class="cl_td" label="公司电话 " prop="companyPhone">
          <el-input
            v-model="cstBaseInfoForm.companyPhone"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <el-form-item class="cl_td" label="邮编 " prop="zipCode">
          <el-input
            v-model="cstBaseInfoForm.zipCode"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <el-form-item class="cl_td" label="联络人姓名 " prop="contactName">
          <el-input
            v-model="cstBaseInfoForm.contactName"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <el-form-item class="cl_td" label="联络人电话 " prop="contactPhone">
          <el-input
            v-model="cstBaseInfoForm.contactPhone"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <el-form-item class="cl_td" label="成为会员年份 " prop="branchNumber">
          <el-date-picker
            v-model="cstBaseInfoForm.memberSince"
            class="wd200"
            type="date"
            placeholder="选择会员年份"
            format="yyyy 年 MM 月"
            value-format="yyyyMM"
          />
        </el-form-item>
        <el-form-item class="cl_td" label="客户来源码" prop="customerSource">
          <el-input
            v-model="cstBaseInfoForm.customerSource"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <el-form-item class="cl_td" label="行为得分" prop="behaviorScore">
          <el-input
            v-model="cstBaseInfoForm.behaviorScore"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <el-form-item class="cl_td" label="客户等级" prop="customerLevel">
          <el-input
            v-model="cstBaseInfoForm.customerLevel"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <el-form-item class="cl_td" label="年收入 " prop="annualIncome">
          <el-input
            v-model="cstBaseInfoForm.annualIncome"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <el-form-item class="cl_td" label="住宅性质 " prop="residencyStatus">
          <el-select
            clearable
            v-model="cstBaseInfoForm.residencyStatus"
            class="wd200"
          >
            <el-option
              v-for="(item, index) in residencyStatusOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="cl_td" label="婚姻状况 " prop="maritalStatus">
          <el-select
            clearable
            v-model="cstBaseInfoForm.maritalStatus"
            class="wd200"
          >
            <el-option
              v-for="(item, index) in maritalStatusOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="cl_td" label="工作行业代码" prop="occupationCode">
          <el-input
            v-model="cstBaseInfoForm.occupationCode"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <el-form-item class="cl_td" label="职务级别代码" prop="postRankCode">
          <el-select
            clearable
            v-model="cstBaseInfoForm.postRankCode"
            class="wd200"
          >
            <el-option
              v-for="(item, index) in postRankCodeOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="cl_td" label="职称代码" prop="titleCode">
          <el-input
            v-model="cstBaseInfoForm.titleCode"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <el-form-item class="cl_td" label="工作年限" prop="periodOfOccupation">
          <el-input
            v-model="cstBaseInfoForm.periodOfOccupation"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <el-form-item class="cl_td" label="兴趣爱好" prop="hobby">
          <el-input v-model="cstBaseInfoForm.hobby" class="wd200" type="text" />
        </el-form-item>
        <el-form-item class="cl_td" label="担保人标识" prop="guarantorFlag">
          <el-select
            clearable
            v-model="cstBaseInfoForm.guarantorFlag"
            class="wd200"
          >
            <el-option
              v-for="(item, index) in guarantorFlagOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="cl_td" label="营销员代码" prop="marketerCode">
          <el-input
            v-model="cstBaseInfoForm.marketerCode"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td"
          label="持卡人的社会保障号类型"
          prop="socialSecurityId"
        >
          <el-input
            v-model="cstBaseInfoForm.socialSecurityId"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td"
          label="社保账号"
          prop="socialSecurityNumber"
        >
          <el-input
            v-model="cstBaseInfoForm.socialSecurityNumber"
            class="wd200"
            type="text"
          />
        </el-form-item>
      </el-form>

      <div class="text_title">3.客户地址信息</div>
      <div class="cl_tr text_left">
        <el-button
          size="small"
          icon="el-icon-plus"
          type="primary"
          @click="addAdress()"
          >新增</el-button
        >
      </div>
      <el-table
        :data="addressObjList"
        class="mbtm20"
        fit
        highlight-current-row
        style="width: 100%"
        border
      >
        <el-table-column prop="typeDesc" label="地址类型" align="center" />
        <el-table-column
          prop="contactAddress"
          label="联系地址"
          align="center"
        />
        <el-table-column
          prop="contactPostCode"
          label="联系邮编"
          align="center"
        />
        <el-table-column
          prop="contactMobilePhone"
          label="指定电话"
          align="center"
        />
        <el-table-column prop="city" label="所在城市" align="center" />
      </el-table>
      <el-form ref="addressForm" :rule="addressForm" :model="addressForm">
        <div v-show="addressFormDiv">
          <el-form-item
            class="cl_td"
            label="地址类型"
            prop="type"
            :rules="[
              { required: true, message: '请输入地址类型', trigger: 'change' },
            ]"
          >
            <el-select clearable v-model="addressForm.type" class="wd200">
              <el-option
                v-for="(item, index) in addressTypeOptions"
                :key="index"
                :label="item.detailDesc"
                :value="item.codes"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            class="cl_td"
            label="联系地址"
            prop="contactAddress"
            :rules="[
              { required: true, message: '请输入联系地址', trigger: 'blur' },
            ]"
          >
            <el-input
              v-model="addressForm.contactAddress"
              class="wd200"
              type="text"
            />
          </el-form-item>
          <el-form-item
            class="cl_td"
            label="联系邮编"
            prop="contactPostCode"
            :rules="[
              { required: true, message: '请输入联系邮编', trigger: 'blur' },
            ]"
          >
            <el-input
              v-model="addressForm.contactPostCode"
              class="wd200"
              type="text"
            />
          </el-form-item>
          <el-form-item
            class="cl_td"
            label="指定电话"
            prop="contactMobilePhone"
            :rules="[
              { required: true, message: '请输入指定电话', trigger: 'blur' },
            ]"
          >
            <el-input
              v-model="addressForm.contactMobilePhone"
              class="wd200"
              type="text"
            />
          </el-form-item>
          <el-form-item
            class="cl_td"
            label="所在城市"
            prop="city"
            :rules="[
              { required: true, message: '请输入所在城市', trigger: 'blur' },
            ]"
          >
            <el-input v-model="addressForm.city" class="wd200" type="text" />
          </el-form-item>
          <div class="cl_tr text_center">
            <el-button
              size="small"
              icon="el-icon-circle-check"
              type="primary"
              @click="saveAddress('addressForm')"
              >保存</el-button
            >
            <el-button
              size="small"
              icon="el-icon-circle-close"
              type="primary"
              @click="closeAddress()"
              >关闭</el-button
            >
          </div>
        </div>
      </el-form>
      <div class="text_title">4.客户备注信息</div>
      <div class="cl_tr text_left">
        <el-button
          size="small"
          icon="el-icon-plus"
          type="primary"
          @click="addRemark()"
          >新增</el-button
        >
      </div>
      <el-table
        :data="remarkObjList"
        class="mbtm20"
        fit
        highlight-current-row
        style="width: 100%"
        border
      >
        <el-table-column prop="remarkInfo" label="备注信息" align="center" />
        <el-table-column
          prop="lastUpdateUserid"
          label="新增备注人员"
          align="center"
        />
      </el-table>
      <el-form ref="remarkForm" :rule="remarkForm" :model="remarkForm">
        <div v-show="remarkFormDiv">
          <el-form-item class="cl_td" label="备注信息" prop="remarkInfo">
            <el-input
              v-model="remarkForm.remarkInfo"
              class="wd200"
              type="text"
            />
          </el-form-item>
          <el-form-item
            class="cl_td"
            label="新增备注人员"
            prop="lastUpdateUserid"
          >
            <el-input
              v-model="remarkForm.lastUpdateUserid"
              class="wd200"
              type="text"
            />
          </el-form-item>
          <div class="cl_tr text_center">
            <el-button
              size="small"
              icon="el-icon-circle-check"
              type="primary"
              @click="saveRemark()"
              >保存</el-button
            >
            <el-button
              size="small"
              icon="el-icon-circle-close"
              type="primary"
              @click="closeRemark()"
              >关闭</el-button
            >
          </div>
        </div>
      </el-form>
      <div class="cl_tr text_center">
        <el-button
          size="medium"
          type="primary"
          @click="nextTo2('cstBaseInfoRef')"
        >
          下一步
          <i class="el-icon-d-arrow-right" />
        </el-button>
      </div>
    </div>
    <!-- 1客户基本资料 end -->

    <!-- 2费用项目模块 start -->
    <div v-show="feeItemDiv" class="step step2">
      <div class="module_title">增值服务费</div>
      <div class="text_title">1.客户基本信息</div>
      <el-form ref="cstInfoRef" :model="cstInfoObj">
        <el-form-item class="cl_td" label="客户代码" prop="customerNo">
          <el-input
            v-model="cstInfoObj.customerNo"
            class="wd200"
            type="text"
            :readonly="readonly"
          />
        </el-form-item>
        <el-form-item class="cl_td" label="客户名称" prop="customerName">
          <el-input
            v-model="cstInfoObj.customerName"
            class="wd200"
            type="text"
            :readonly="readonly"
          />
        </el-form-item>
        <el-form-item class="cl_td" label="证件号码" prop="idNumber">
          <el-input
            v-model="cstInfoObj.idNumber"
            class="wd200"
            type="text"
            :readonly="readonly"
          />
        </el-form-item>
      </el-form>
      <div class="text_title">2.选择费用项目</div>
      <el-form ref="feeItemSeachForm" :model="feeItemSeachForm">
        <el-form-item class="cl_td" label="收费项目" prop="feeItemNo">
          <el-input
            v-model="feeItemSeachForm.feeItemNo"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <el-form-item class="cl_td" label="收费项目描述" prop="feeDesc">
          <el-input
            v-model="feeItemSeachForm.feeDesc"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <div class="cl_tr text_center">
          <el-button
            size="medium"
            icon="el-icon-search"
            type="primary"
            @click="feeItemFilter"
            >查询</el-button
          >
          <!-- <el-button size="medium" icon="el-icon-refresh" type="primary" @click="relatedFeeItem()">关联</el-button> -->
        </div>
      </el-form>
      <el-table
        ref="multipleFeeItemTable"
        v-loading="feeItem_config.loading"
        :data="feeItemList"
        class="mbtm20"
        fit
        highlight-current-row
        style="width: 100%"
        border
        @selection-change="handleSelectFeeItem"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column align="center" prop="feeItemNo" label="收费项目编号" />
        <el-table-column align="center" prop="feeTypeDesc" label="费用类别" />
        <el-table-column align="center" prop="feeDesc" label="费用描述" />
        <el-table-column
          align="center"
          prop="instanCode1Desc"
          label="实例维度1"
        />
        <el-table-column
          align="center"
          prop="instanCode2Desc"
          label="实例维度2"
        />
      </el-table>
      <pagination
        v-show="feeItem_config.total0"
        :total="feeItem_config.total"
        :page.sync="feeItem_config.pageNum"
        :limit.sync="feeItem_config.pageSize"
        @pagination="getFeeItemList"
      />

      <div class="text_title">3.已选择的收费项目</div>
      <el-table
        :data="multipleSelectFeeItem"
        class="mbtm20"
        fit
        highlight-current-row
        style="width: 100%"
        border
      >
        <el-table-column align="center" prop="feeItemNo" label="收费项目编号" />
        <el-table-column align="center" prop="feeTypeDesc" label="费用类别" />
        <el-table-column align="center" prop="feeDesc" label="费用描述" />
        <el-table-column
          align="center"
          prop="instanCode1Desc"
          label="实例维度1"
        />
        <el-table-column
          align="center"
          prop="instanCode2Desc"
          label="实例维度2"
        />
        <el-table-column
          label="操作"
          align="center"
          class-name="small-padding fixed-width"
        >
          <template slot-scope="{ row, $index }">
            <el-button
              icon="el-icon-delete"
              type="danger"
              size="mini"
              @click="handleFeeItemDelete(row, $index)"
            >
              {{ $t("table.delete") }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="cl_tr text_center mtop20">
        <el-button size="medium" type="primary" @click="preTo1">
          <i class="el-icon-d-arrow-left" />
          上一步
        </el-button>
        <el-button size="medium" type="primary" @click="nextTo3">
          下一步
          <i class="el-icon-d-arrow-right" />
        </el-button>
      </div>
    </div>
    <!-- 2费用项目模块 end -->

    <!-- 3产品信息建立 start -->
    <div v-show="proEstDiv" class="step step3">
      <div class="module_title">产品信息建立</div>
      <div class="text_title">1.客户基本信息</div>
      <el-form ref="cstInfoRef" :model="cstInfoForm">
        <el-form-item class="cl_td" label="客户代码" prop="customerNo">
          <el-input
            v-model="cstInfoObj.customerNo"
            class="wd200"
            type="text"
            :readonly="readonly"
          />
        </el-form-item>
        <el-form-item class="cl_td" label="客户名称" prop="customerName">
          <el-input
            v-model="cstInfoObj.customerName"
            class="wd200"
            type="text"
            :readonly="readonly"
          />
        </el-form-item>
        <el-form-item class="cl_td" label="手机号码" prop="mobilePhone">
          <el-input
            v-model="cstInfoObj.mobilePhone"
            class="wd200"
            type="text"
            :readonly="readonly"
          />
        </el-form-item>
      </el-form>

      <div class="text_title">2.客户已有产品</div>
      <el-table
        ref="havedProTable"
        v-loading="listLoading2"
        :data="havedProList"
        class="mbtm20"
        fit
        highlight-current-row
        style="width: 100%"
        border
        @row-click="chooseHavedPro"
        @current-change="handleCurrentHavedProChange"
      >
        <el-table-column width="55">
          <template slot-scope="scope">
            <el-radio
              v-model="curChoosedHavedPro"
              :label="scope.row.productObjectCode"
            >
              <span class="el-radio__label"></span>
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="productObjectCode"
          label="产品对象代码"
        />
        <el-table-column align="center" prop="productDesc" label="描述" />
      </el-table>
      <pagination
        v-show="havedProTotal > 0"
        :total="havedProTotal"
        :page.sync="cstInfoObj.pageNum"
        :limit.sync="cstInfoObj.pageSize"
        @pagination="getHavedProList"
      />

      <div class="text_title">3.选择产品对象</div>
      <el-table
        ref="havedProTable"
        v-loading="listLoading2"
        :data="allProList"
        class="mbtm20"
        fit
        highlight-current-row
        style="width: 100%"
        border
        @row-click="choosePro"
        @current-change="handleChooseProChange"
      >
        <el-table-column width="55">
          <template slot-scope="scope">
            <el-radio
              v-model="curChoosedProRadio"
              :label="scope.row.productObjectCode"
            >
              <span class="el-radio__label"></span>
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="productObjectCode"
          label="产品对象代码"
        />
        <el-table-column align="center" prop="productDesc" label="描述" />
      </el-table>
      <pagination
        v-show="allProTotal > 0"
        :total="allProTotal"
        :page.sync="allProObj.pageNum"
        :limit.sync="allProObj.pageSize"
        @pagination="getAllProList"
      />

      <div class="text_title">4.填写还款信息</div>
      <el-form
        ref="step3_proInfoRef"
        :rules="step3_proInfoRules"
        :model="step3_proInfoObj"
      >
        <el-form-item
          class="cl_td"
          label="约定还款状态"
          prop="directDebitStatus"
        >
          <el-select v-model="step3_proInfoObj.directDebitStatus" class="wd200">
            <el-option
              v-for="(item, index) in directDebitStatusOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="cl_td" label="约定还款方式" prop="directDebitMode">
          <el-select v-model="step3_proInfoObj.directDebitMode" class="wd200">
            <el-option
              v-for="(item, index) in directDebitModeOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          class="cl_td"
          label="约定还款银行号"
          prop="directDebitBankNo"
        >
          <el-input
            v-model="step3_proInfoObj.directDebitBankNo"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td"
          label="约定还款账户号"
          prop="directDebitAccountNo"
        >
          <el-input
            v-model="step3_proInfoObj.directDebitAccountNo"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td"
          label="购汇还款标志"
          prop="exchangePaymentFlag"
        >
          <el-select
            v-model="step3_proInfoObj.exchangePaymentFlag"
            class="wd200"
          >
            <el-option
              v-for="(item, index) in exchangePaymentFlagOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>

        <div class="text_title">5.产品附加信息</div>
        <el-form-item class="cl_td" label="联名代码" prop="coBrandedNo">
          <el-input
            v-model="step3_proInfoObj.coBrandedNo"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <el-form-item class="cl_td" />
        <div v-show="showBusCardDiv">
          <div class="text_title">公务卡预算单位编码</div>
          <el-form-item class="cl_tr" label="预算单位编码" prop="budgetOrgCode">
            <el-input
              v-model="step3_proInfoObj.budgetOrgCode"
              class="wd200"
              type="text"
            />
            <div class="search_button">
              <el-button
                size="small"
                icon="el-icon-search"
                type="primary"
                @click="queryBusCardBtn()"
              >
                查询
              </el-button>
              <el-button
                size="small"
                icon="el-icon-refresh"
                type="primary"
                @click="resetBusCardBtn()"
              >
                重置
              </el-button>
            </div>
          </el-form-item>
        </div>
        <div v-show="showBusCardOInfoDiv">
          <el-form-item class="cl_td" label="预算单位名称" prop="budgetOrgName">
            <el-input
              v-model="step3_proInfoObj.budgetOrgName"
              class="wd200"
              type="text"
            />
          </el-form-item>
          <el-form-item class="cl_td" label="账单日" prop="billDay">
            <el-input
              v-model="step3_proInfoObj.billDay"
              class="wd200"
              type="text"
            />
          </el-form-item>
        </div>
        <div class="text_title">6. 定价标签设置</div>
        <el-form-item
          class="cl_td red"
          label="定价标签设置"
          prop="isSetPrice"
          :rules="[{ required: true, message: '定价标签设置不能为空' }]"
        >
          <el-select v-model="step3_proInfoObj.isSetPrice" class="wd200">
            <el-option
              v-for="(item, index) in isSetPriceOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
      </el-form>

      <div class="cl_tr text_center">
        <el-button size="medium" type="primary" @click="nextTo4()">
          下一步
          <i class="el-icon-d-arrow-right" />
        </el-button>
      </div>
    </div>
    <!-- 3产品信息建立 end -->

    <!-- 4定价标签设置 start -->
    <div v-show="priceLabelSetDiv" class="step step4">
      <div class="text_title">1.客户基本信息</div>
      <el-form ref="cstInfoRef" :model="cstInfoForm">
        <el-form-item class="cl_td" label="客户代码" prop="customerNo">
          <el-input
            v-model="cstInfoObj.customerNo"
            class="wd200"
            type="text"
            :readonly="readonly"
          />
        </el-form-item>
        <el-form-item class="cl_td" label="客户名称" prop="customerName">
          <el-input
            v-model="cstInfoObj.customerName"
            class="wd200"
            type="text"
            :readonly="readonly"
          />
        </el-form-item>
        <el-form-item class="cl_td" label="手机号码" prop="mobilePhone">
          <el-input
            v-model="cstInfoObj.mobilePhone"
            class="wd200"
            type="text"
            :readonly="readonly"
          />
        </el-form-item>
      </el-form>
      <div class="text_title">2.客户已有定价标签</div>
      <el-table
        v-loading="havedPrice_config.loading"
        :data="havedPriceData"
        class="mbtm20"
        fit
        highlight-current-row
        style="width: 100%"
        border
      >
        <el-table-column prop="operationMode" label="运营模式" align="center" />
        <el-table-column prop="pricingObject" label="定价类型" align="center" />
        <el-table-column
          prop="pricingObjectCode"
          label="定价对象"
          align="center"
        />
        <el-table-column prop="pricingTag" label="定价标签" align="center" />
        <el-table-column
          prop="pricingTypeDesc"
          label="定价区域"
          align="center"
        />
        <el-table-column prop="performOrder" label="优先级" align="center" />
        <el-table-column
          prop="pricingMethodDesc"
          label="定价方式"
          align="center"
        />
        <el-table-column prop="pricingDesc" label="描述" align="center" />
      </el-table>
      <pagination
        v-show="havedPrice_config.total > 0"
        :total="havedPrice_config.total"
        :page.sync="havedPrice_config.pageNum"
        :limit.sync="havedPrice_config.pageSize"
        @pagination="getHavedPriceList"
      />

      <div class="text_title">3. 定价对象信息</div>
      <el-form :model="priceLabelForm">
        <el-form-item class="cl_td" label="定价类型" prop="pricingObject">
          <el-select
            clearable
            v-model="priceLabelForm.pricingObject"
            class="wd200"
            @change="idTypeHandleChange"
          >
            <el-option
              v-for="(item, index) in pricingObjectOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="cl_td" label="定价对象" prop="pricingObjectCode">
          <el-input
            v-model="priceLabelForm.pricingObjectCode"
            class="wd200"
            type="text"
          />
        </el-form-item>
      </el-form>

      <div class="cl_tr text_center">
        <el-button
          size="medium"
          icon="el-icon-search"
          type="primary"
          @click="handleSearchPrice()"
          >搜索</el-button
        >
        <el-button
          size="medium"
          icon="el-icon-refresh"
          type="primary"
          @click="relatedPrice()"
          >关联</el-button
        >
      </div>
      <el-table
        v-loading="price_config.loading"
        :data="priceData"
        class="mbtm20"
        fit
        highlight-current-row
        style="width: 100%"
        border
        @selection-change="price_handleSelectionChange"
      >
        <el-table-column type="selection" width="55"></el-table-column>
        <el-table-column prop="operationMode" label="运营模式" align="center" />
        <el-table-column prop="pricingObject" label="定价类型" align="center" />
        <el-table-column
          prop="pricingObjectCode"
          label="定价对象"
          align="center"
        />
        <el-table-column prop="pricingTag" label="定价标签" align="center" />
        <el-table-column
          prop="pricingTypeDesc"
          label="定价区域"
          align="center"
        />
        <el-table-column prop="performOrder" label="优先级" align="center" />
        <el-table-column
          prop="pricingMethodDesc"
          label="定价方式"
          align="center"
        />
        <el-table-column prop="pricingDesc" label="描述" align="center" />
        <el-table-column label="操作" align="center" width="220">
          <template slot-scope="{ row }">
            <el-button size="mini" type="primary" @click="hadlePriceDetail(row)"
              >查询</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <pagination
        v-show="price_config.total > 0"
        :total="price_config.total"
        :page.sync="price_config.pageNum"
        :limit.sync="price_config.pageSize"
        @pagination="getPriceList"
      />

      <div class="text_title">4.已关联定价标签</div>
      <el-table
        v-loading="relatedPrice_config.loading"
        :data="relatedPriceData"
        class="mbtm20"
        fit
        highlight-current-row
        style="width: 100%"
        border
      >
        <el-table-column prop="operationMode" label="运营模式" align="center" />
        <el-table-column prop="pricingObject" label="定价类型" align="center" />
        <el-table-column
          prop="pricingObjectCode"
          label="定价对象"
          align="center"
        />
        <el-table-column prop="pricingTag" label="定价标签" align="center" />
        <el-table-column
          prop="pricingTypeDesc"
          label="定价区域"
          align="center"
        />
        <el-table-column prop="performOrder" label="优先级" align="center" />
        <el-table-column
          prop="pricingMethodDesc"
          label="定价方式"
          align="center"
        />
        <el-table-column prop="pricingDesc" label="描述" align="center" />
        <el-table-column
          prop="custTagEffectiveDate"
          label="标签生效日期"
          align="center"
        />
        <el-table-column
          prop="custTagExpirationDate"
          label="标签失效日期"
          align="center"
        />
        <el-table-column
          prop="pricingLevelDesc"
          label="定价层级"
          align="center"
        />
        <el-table-column
          prop="pricingLevelCode"
          label="	定价层级代码"
          align="center"
        />

        <el-table-column label="操作" align="center" width="220">
          <template slot-scope="{ row, $index }">
            <el-button
              size="mini"
              type="primary"
              @click="hadlePriceSet(row, $index)"
              >设置</el-button
            >
            <el-button
              size="mini"
              type="primary"
              @click="hadlePriceDelete(row, $index)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>

      <div class="cl_tr text_center">
        <el-button size="medium" type="primary" @click="backTo3()">
          <i class="el-icon-d-arrow-left" />
          上一步
        </el-button>
        <el-button
          size="medium"
          icon="el-icon-circle-check"
          type="primary"
          @click="nextTo5()"
        >
          保存
        </el-button>
      </div>
    </div>
    <!-- 4定价标签设置 end -->

    <!-- 5媒介信息建立 start -->
    <div v-show="mediaInfoEstDiv" class="step step5">
      <div class="module_title">媒介信息建立</div>
      <div class="text_title">1.客户基本信息</div>
      <el-form ref="cstInfoRef" :model="cstInfoForm">
        <el-form-item class="cl_td" label="客户代码" prop="customerNo">
          <el-input
            v-model="cstInfoObj.customerNo"
            class="wd200"
            type="text"
            :readonly="readonly"
          />
        </el-form-item>
        <el-form-item class="cl_td" label="客户名称" prop="customerName">
          <el-input
            v-model="cstInfoObj.customerName"
            class="wd200"
            type="text"
            :readonly="readonly"
          />
        </el-form-item>
        <el-form-item class="cl_td" label="手机号码" prop="mobilePhone">
          <el-input
            v-model="cstInfoObj.mobilePhone"
            class="wd200"
            type="text"
            :readonly="readonly"
          />
        </el-form-item>
      </el-form>
      <div class="text_title">2.客户已有产品</div>
      <el-table
        ref="havedProTable"
        v-loading="mediaHavedPro_config.loading"
        :data="media_havedProData"
        class="mbtm20"
        fit
        highlight-current-row
        style="width: 100%"
        border
        @row-click="media_chooseHavedPro"
        @current-change="media_handleCurrentHavedProChange"
      >
        <el-table-column width="55">
          <template slot-scope="scope">
            <el-radio
              v-model="media_curChoosedProRadio"
              :label="scope.row.productObjectCode"
            >
              <span class="el-radio__label"></span>
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="productObjectCode"
          label="产品对象代码"
        />
        <el-table-column align="center" prop="productDesc" label="描述" />
      </el-table>
      <pagination
        v-show="mediaHavedPro_config.total > 0"
        :total="mediaHavedPro_config.total"
        :page.sync="mediaHavedPro_config.pageNum"
        :limit.sync="mediaHavedPro_config.pageSize"
        @pagination="media_havedProList"
      />

      <el-form
        ref="step5_mediaInfoRef"
        :rules="step5_mediaInfoRules"
        :model="step5_mediaInfoObj"
      >
        <!-- 是否支持自动配号 start-->
        <el-form-item
          v-show="isSupportDiv"
          class="cl_td"
          label="选择卡号"
          prop="isSupport"
        >
          <el-radio-group
            v-model="step5_mediaInfoObj.isSupport"
            @change="isSupportChange"
          >
            <el-radio :label="1">配置靓号</el-radio>
            <el-radio :label="2">随机生成</el-radio>
            <el-radio :label="3">手工输入</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 是否支持自动配号 end-->
        <div class="text_title">3.媒介基本信息</div>
        <!-- 手工输入靓号 -->
        <el-form-item
          v-show="inputDiv"
          class="cl_td"
          label="外部识别号"
          prop="externalIdentificationNoIn"
        >
          <el-input
            v-model="step5_mediaInfoObj.externalIdentificationNoIn"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <!-- 客户靓号 -->
        <el-form-item
          v-show="custNicknameDiv"
          class="cl_td"
          label="外部识别号"
          prop="externalIdentificationNoIn"
        >
          <el-input
            v-model="step5_mediaInfoObj.externalIdentificationNoIn"
            class="wd200"
            type="text"
          />
        </el-form-item>

        <el-form-item
          class="cl_td"
          label="主附标识"
          prop="mainSupplyIndicator"
          :rules="[{ required: true, message: '主附标识不能为空' }]"
        >
          <el-select
            v-model="step5_mediaInfoObj.mainSupplyIndicator"
            class="wd200"
            @change="mainAndSubChange"
            clearbale
          >
            <el-option
              v-for="(item, index) in mainSupplyIndicatorOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          class="cl_td"
          label="使用者姓名"
          prop="mediaUserName"
          :rules="[{ required: true, message: '使用者姓名不能为空' }]"
        >
          <el-input
            v-model="step5_mediaInfoObj.mediaUserName"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <el-form-item class="cl_td" label="主客户代码" prop="mainCustomerNo">
          <el-input
            v-model="step5_mediaInfoObj.mainCustomerNo"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td"
          label="刻印名"
          prop="embosserName1"
          :rules="[{ required: true, message: '刻印名不能为空' }]"
        >
          <el-input
            v-model="step5_mediaInfoObj.embosserName1"
            class="wd200"
            type="text"
            @input="changeUpWord"
          />
        </el-form-item>
        <div v-show="showSubCustomerNo">
          <el-form-item class="cl_td" label="副客户代码" prop="subCustomerNo">
            <el-input
              v-model="step5_mediaInfoObj.subCustomerNo"
              class="wd200"
              type="text"
            />
          </el-form-item>
        </div>
        <el-form-item
          class="cl_td"
          label="所属机构"
          prop="institutionId"
          :rules="[{ required: true, message: '所属机构不能为空' }]"
        >
          <el-select v-model="step5_mediaInfoObj.institutionId" class="wd200">
            <el-option
              v-for="(item, index) in institutionIdOptions"
              :key="index"
              :label="item.organName"
              :value="item.organNo"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="cl_td" label="分行号" prop="branchNumber">
          <el-input
            v-model="step5_mediaInfoObj.branchNumber"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td"
          label="进件人员编号"
          prop="applicationStaffNo"
        >
          <el-input
            v-model="step5_mediaInfoObj.applicationStaffNo"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <el-form-item class="cl_td" label="申请书编号" prop="applicationNumber">
          <el-input
            v-model="step5_mediaInfoObj.applicationNumber"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <el-form-item class="cl_td" label="营销人员编号" prop="marketerCode">
          <el-input
            v-model="step5_mediaInfoObj.marketerCode"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td"
          label="媒介对象代码"
          prop="mediaObjectCode"
          :rules="[{ required: true, message: '媒介对象代码不能为空' }]"
        >
          <el-select
            v-model="step5_mediaInfoObj.mediaObjectCode"
            class="wd200"
            @change="getRiskLimits"
          >
            <el-option
              v-for="(item, index) in mediaObjectCodeOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          class="cl_td"
          label="媒介领取标志"
          prop="mediaDispatchMethod"
        >
          <el-select
            v-model="step5_mediaInfoObj.mediaDispatchMethod"
            class="wd200"
          >
            <el-option
              v-for="(item, index) in mediaDispatchMethodOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          class="cl_td"
          label="密码函领取标志"
          prop="pinDispatchMethod"
        >
          <el-select
            v-model="step5_mediaInfoObj.pinDispatchMethod"
            class="wd200"
          >
            <el-option
              v-for="(item, index) in pinDispatchMethodOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <div v-show="isShowFormatCode">
          <div class="text_title">4.制卡信息</div>
          <el-form-item
            class="cl_td red"
            label="制卡请求"
            prop="requestCardMaking"
          >
            <el-select
              v-model="step5_mediaInfoObj.requestCardMaking"
              class="wd200"
              disabled
            >
              <el-option
                v-for="(item, index) in requestCardMakingOptions"
                :key="index"
                :label="item.detailDesc"
                :value="item.codes"
              />
            </el-select>
          </el-form-item>
          <!-- :rules="[ { required: true, message: '卡版代码不能为空'} ]" -->
          <el-form-item class="cl_td red" label="卡版代码" prop="formatCode">
            <el-select v-model="step5_mediaInfoObj.formatCode" class="wd200">
              <el-option
                v-for="(item, index) in formatCodeOptions"
                :key="index"
                :label="item.formatDescribe"
                :value="item.formatCode"
              />
            </el-select>
          </el-form-item>
        </div>
      </el-form>
      <div class="cl_tr text_center">
        <el-button
          size="medium"
          icon="el-icon-circle-check"
          type="primary"
          @click="saveMediaInfo()"
          >保存</el-button
        >
      </div>
    </div>
    <!-- 5媒介信息建立 end -->

    <!-- 6已有媒介申请DPAN start -->
    <div v-show="mediaDPANDiv" class="step step6">
      <div class="module_title">已有媒介申请DPAN</div>
      <div class="text_title">1.客户基本信息</div>
      <el-form ref="cstInfoRef" :model="cstInfoObj">
        <el-form-item class="cl_td" label="客户代码" prop="customerNo">
          <el-input
            v-model="cstInfoObj.customerNo"
            class="wd200"
            type="text"
            :readonly="readonly"
          />
        </el-form-item>
        <el-form-item class="cl_td" label="客户名称" prop="customerName">
          <el-input
            v-model="cstInfoObj.customerName"
            class="wd200"
            type="text"
            :readonly="readonly"
          />
        </el-form-item>
        <el-form-item class="cl_td" label="证件号码" prop="idNumber">
          <el-input
            v-model="cstInfoObj.idNumber"
            class="wd200"
            type="text"
            :readonly="readonly"
          />
        </el-form-item>
      </el-form>
      <div class="text_title">2.客户已有媒介</div>
      <el-table
        v-loading="dpan_havedMediaConfig.loading"
        :data="dpan_havedMediaData"
        class="mbtm20"
        fit
        highlight-current-row
        style="width: 100%"
        border
        @row-click="dpan_chooseHavedMedia"
        @current-change="dpan_handleCurrentHavedMediaChange"
      >
        <el-table-column width="55">
          <template slot-scope="scope">
            <el-radio
              v-model="dpan_choosedMediaRadio"
              :label="scope.row.mediaUnitCode"
            >
              <span class="el-radio__label"></span>
            </el-radio>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="externalIdentificationNo"
          label="外部识别号"
        />
        <el-table-column
          align="center"
          prop="mediaUnitCode"
          label="媒介单元代码"
          width="200"
        />
        <el-table-column
          align="center"
          prop="productObjectCode"
          label="产品代码及描述"
          width="220"
        >
          <template slot-scope="{ row }">
            {{ row.productObjectCode }}
            {{ row.productDesc }}
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          prop="mainSupplyIndicatorDesc"
          label="主附卡标识"
        />
        <el-table-column
          align="center"
          prop="mediaUserName"
          label="媒介使用者姓名"
        />
        <el-table-column
          align="center"
          prop="invalidFlagDesc"
          label="有效标识"
        />
      </el-table>
      <pagination
        v-show="mediaHavedPro_config.total > 0"
        :total="mediaHavedPro_config.total"
        :page.sync="mediaHavedPro_config.pageNum"
        :limit.sync="mediaHavedPro_config.pageSize"
        @pagination="media_havedProList"
      />

      <div v-show="dpan_mediaInfoDiv">
        <div class="text_title">3.媒介基本信息</div>
        <el-form
          ref="dpan_mediaInfoRef"
          :rules="dpan_mediaInfoRules"
          :model="dpan_mediaInfoObj"
        >
          <el-form-item
            class="cl_td"
            label="主附标识"
            prop="mainSupplyIndicator"
            :rules="[{ required: true, message: '主附标识不能为空' }]"
          >
            <el-select
              v-model="dpan_mediaInfoObj.mainSupplyIndicator"
              class="wd200"
            >
              <el-option
                v-for="(item, index) in mainSupplyIndicatorOptions"
                :key="index"
                :label="item.detailDesc"
                :value="item.codes"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            class="cl_td"
            label="使用者姓名"
            prop="mediaUserName"
            :rules="[{ required: true, message: '使用者姓名不能为空' }]"
          >
            <el-input
              v-model="dpan_mediaInfoObj.mediaUserName"
              class="wd200"
              type="text"
            />
          </el-form-item>
          <el-form-item class="cl_td" label="主客户代码" prop="mainCustomerNo">
            <el-input
              v-model="dpan_mediaInfoObj.mainCustomerNo"
              class="wd200"
              type="text"
            />
          </el-form-item>
          <el-form-item
            class="cl_td"
            label="刻印名"
            prop="embosserName1"
            :rules="[{ required: true, message: '刻印名不能为空' }]"
          >
            <el-input
              v-model="dpan_mediaInfoObj.embosserName1"
              class="wd200"
              type="text"
              @input="changeUpWord"
            />
          </el-form-item>
          <el-form-item
            class="cl_td"
            label="所属机构"
            prop="institutionId"
            :rules="[{ required: true, message: '所属机构不能为空' }]"
          >
            <el-select v-model="dpan_mediaInfoObj.institutionId" class="wd200">
              <el-option
                v-for="(item, index) in institutionIdOptions"
                :key="index"
                :label="item.organName"
                :value="item.organNo"
              />
            </el-select>
          </el-form-item>
          <el-form-item class="cl_td" label="分行号" prop="branchNumber">
            <el-input
              v-model="dpan_mediaInfoObj.branchNumber"
              class="wd200"
              type="text"
            />
          </el-form-item>
          <el-form-item
            class="cl_td"
            label="进件人员编号"
            prop="applicationStaffNo"
          >
            <el-input
              v-model="dpan_mediaInfoObj.applicationStaffNo"
              class="wd200"
              type="text"
            />
          </el-form-item>
          <el-form-item
            class="cl_td"
            label="申请书编号"
            prop="applicationNumber"
          >
            <el-input
              v-model="dpan_mediaInfoObj.applicationNumber"
              class="wd200"
              type="text"
            />
          </el-form-item>
          <el-form-item class="cl_td" label="营销人员编号" prop="marketerCode">
            <el-input
              v-model="dpan_mediaInfoObj.marketerCode"
              class="wd200"
              type="text"
            />
          </el-form-item>
          <el-form-item
            class="cl_td"
            label="媒介对象代码"
            prop="mediaObjectCode"
            :rules="[{ required: true, message: '媒介对象代码不能为空' }]"
          >
            <el-select
              v-model="dpan_mediaInfoObj.mediaObjectCode"
              class="wd200"
              @change="getRiskLimits"
            >
              <el-option
                v-for="(item, index) in mediaObjectCodeOptions"
                :key="index"
                :label="item.detailDesc"
                :value="item.codes"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            class="cl_td"
            label="媒介领取标志"
            prop="mediaDispatchMethod"
          >
            <el-select
              v-model="dpan_mediaInfoObj.mediaDispatchMethod"
              class="wd200"
            >
              <el-option
                v-for="(item, index) in mediaDispatchMethodOptions"
                :key="index"
                :label="item.detailDesc"
                :value="item.codes"
              />
            </el-select>
          </el-form-item>
          <el-form-item
            class="cl_td"
            label="密码函领取标志"
            prop="pinDispatchMethod"
          >
            <el-select
              v-model="dpan_mediaInfoObj.pinDispatchMethod"
              class="wd200"
            >
              <el-option
                v-for="(item, index) in pinDispatchMethodOptions"
                :key="index"
                :label="item.detailDesc"
                :value="item.codes"
              />
            </el-select>
          </el-form-item>
          <div class="text_title">4.设备编号</div>
          <el-form-item class="cl_td" label="设备编号" prop="deviceNumber">
            <el-input
              v-model="dpan_mediaInfoObj.deviceNumber"
              class="wd200"
              type="text"
            />
          </el-form-item>
        </el-form>

        <div class="cl_tr text_center">
          <el-button
            size="medium"
            icon="el-icon-check"
            type="primary"
            @click="dpan_hadleSave()"
            >保存</el-button
          >
        </div>
      </div>
    </div>
    <!-- 6已有媒介申请DPAN end -->

    <!-- 7最终客户信息 start -->
    <div v-show="resultInfoDiv" class="step step7">
      <div class="text_title">客户基本信息</div>
      <el-form ref="resultInfoRef" :model="resultInfoObj">
        <el-form-item class="cl_td" label="客户代码" prop="customerNo">
          <el-input
            v-model="resultInfoObj.customerNo"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <el-form-item class="cl_td" label="客户名称" prop="customerName">
          <el-input
            v-model="resultInfoObj.customerName"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <el-form-item class="cl_td" label="证件号码" prop="idNumber">
          <el-input
            v-model="resultInfoObj.idNumber"
            class="wd200"
            type="text"
          />
        </el-form-item>
        <el-form-item
          class="cl_td"
          label="外部识别号"
          prop="externalIdentificationNo"
        >
          <el-input
            v-model="resultInfoObj.externalIdentificationNo"
            class="wd200"
            type="text"
          />
        </el-form-item>
      </el-form>

      <!-- 7最终客户信息 -->
    </div>
    <!-- 7最终客户信息 end -->

    <!-- 弹窗部分 -->

    <!-- 业务选择 : 
    客户下无产品，则只新建产品，-->
    <el-dialog :visible.sync="dialogChoseBusiness1" title="业务选择">
      <el-table
        :data="businessData1"
        class="mbtm20"
        fit
        highlight-current-row
        style="width: 100%"
        border
        @current-change="handleCurrentChange"
        @row-click="chooseBusiness"
      >
        <el-table-column width="55">
          <template slot-scope="scope">
            <el-radio v-model="askFlagRadio" :label="scope.row.askFlag">
              <span class="el-radio__label"></span>
            </el-radio>
          </template>
        </el-table-column>
        <!-- <el-table-column label="序号" align="center"  prop="askFlag" /> -->
        <el-table-column label="申请信息" align="center" prop="askName" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sureBusiness()">确定</el-button>
        <el-button @click="dialogChoseBusiness1 = false">取消</el-button>
      </span>
    </el-dialog>
    <!-- 业务选择 : 
        客户有产品，则新建产品和媒介 -->
    <el-dialog :visible.sync="dialogChoseBusiness2" title="业务选择">
      <el-table
        :data="businessData2"
        class="mbtm20"
        fit
        highlight-current-row
        style="width: 100%"
        border
        @current-change="handleCurrentChange"
        @row-click="chooseBusiness"
      >
        <el-table-column width="55">
          <template slot-scope="scope">
            <el-radio v-model="askFlagRadio" :label="scope.row.askFlag">
              <span class="el-radio__label"></span>
            </el-radio>
          </template>
        </el-table-column>
        <!-- <el-table-column label="序号" align="center"  prop="askFlag" /> -->
        <el-table-column label="申请信息" align="center" prop="askName" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sureBusiness()">确 定</el-button>
        <el-button @click="dialogChoseBusiness2 = false">取消</el-button>
      </span>
    </el-dialog>

    <!-- 配置账单日 弹窗 -->
    <el-dialog title="配置账单日" :visible.sync="billDay_dialog" width="65%">
      <el-table
        :data="billDayData"
        class="mbtm20"
        fit
        highlight-current-row
        style="width: 100%"
        border
      >
        <el-table-column label="运营模式" align="center" prop="operationMode" />
        <el-table-column
          label="业务项目"
          align="center"
          prop="businessProgramNo"
        />
        <el-table-column
          label="业务项目描述"
          align="center"
          prop="programDesc"
        />
        <el-table-column
          label="产品对象代码"
          align="center"
          prop="productObjectCode"
        />
        <el-table-column label="账单日" align="center" prop="cycleFrequencyDay">
          <template slot-scope="{ row }">
            <el-select
              v-model="row.cycleFrequencyDay"
              placeholder="请选择张单日"
              clearable
            >
              <el-option
                v-for="(item, index) in billDayOptions"
                :key="index"
                :label="item.detailDesc"
                :value="item.codes"
              />
            </el-select>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sureBillDay()">确 定</el-button>
        <el-button @click="billDay_dialog = false">取消</el-button>
      </span>
    </el-dialog>

    <!-- 定价标签 查询 -->
    <el-dialog
      title="定价标签详细信息"
      :visible.sync="priceLabelDetail_dialog"
      width="65%"
    >
      <price-label-info :formObj="priceLabelObj"></price-label-info>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="priceLabelDetail_dialog = false"
          >关闭</el-button
        >
      </div>
    </el-dialog>

    <!-- 定价标签 设置 -->
    <el-dialog
      title="设置定价标签信息"
      :visible.sync="priceSet_dialog"
      width="65%"
    >
      <el-form ref="priceSetRef" :model="priceSetObj" :rules="priceSetRules">
        <el-form-item
          class="cl_td bnone"
          label="标签生效日期"
          prop="custTagEffectiveDate"
          :rules="[{ required: true, message: '标签生效日期不能为空' }]"
        >
          <el-input
            v-model="priceSetObj.custTagEffectiveDate"
            class="wd200"
            type="text"
            readonly
          />
        </el-form-item>
        <el-form-item
          class="cl_td"
          label="标签生效日期"
          prop="custTagEffectiveDate"
          :rules="[{ required: true, message: '标签生效日期不能为空' }]"
        >
          <el-date-picker
            v-model="priceSetObj.custTagEffectiveDate"
            class="wd200"
            type="date"
            placeholder="选择标签生效日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptionsStart"
            :clearable="true"
            @change="changeStart"
          />
        </el-form-item>
        <el-form-item
          class="cl_td"
          label="标签失效日期"
          prop="custTagExpirationDate"
          :rules="[{ required: true, message: '标签生效日期不能为空' }]"
        >
          <el-date-picker
            v-model="priceSetObj.custTagExpirationDate"
            class="wd200"
            type="date"
            placeholder="选择标签失效日期"
            format="yyyy 年 MM 月 dd 日"
            value-format="yyyy-MM-dd"
            :picker-options="pickerOptionsEnd"
            :clearable="true"
            @change="changeEnd"
          />
        </el-form-item>
        <el-form-item class="cl_td" label="定价层级" prop="pricingLevel">
          <el-select
            clearable
            v-model="priceSetObj.pricingLevel"
            class="wd200"
            @change="pricingLevelChange"
          >
            <el-option
              v-for="(item, index) in pricingLevelOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          class="cl_td"
          label="定价层级代码"
          prop="pricingLevelCode"
        >
          <el-select
            clearable
            v-model="priceSetObj.pricingLevelCode"
            class="wd200"
          >
            <el-option
              v-for="(item, index) in pricingLevelCodeOptions"
              :key="index"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sureSetPrice">确定</el-button>
        <el-button @click="priceSet_dialog = false">关闭</el-button>
      </div>
    </el-dialog>

    <!-- 自动配置靓号弹窗 -->
    <el-dialog
      title="配置靓号详情"
      :visible.sync="setNum_dialogForm"
      width="65%"
    >
      <div class="text_title">特殊号段信息表</div>
      <el-form ref="setNumRef" :rules="setNumRules" :model="setNumObj">
        <el-form-item class="cl_td" label="发卡BIN" prop="cardBin">
          <el-input v-model="setNumObj.cardBin" class="wd200" type="text" />
        </el-form-item>
        <el-form-item
          class="cl_td"
          label="特殊号码段号"
          prop="segmentNumber"
          :rules="[{ required: true, message: '特殊号码段号不能为空' }]"
        >
          <el-select v-model="setNumObj.segmentNumber" class="wd200" clearable>
            <el-option
              v-for="(item, index) in segmentNumberOptions"
              :key="index"
              :label="item.segmentNumber"
              :value="item.segmentNumber"
            />
          </el-select>
        </el-form-item>
      </el-form>
      <div class="cl_tr text_center">
        <el-button
          size="medium"
          icon="el-icon-search"
          type="primary"
          @click="setNumSearch()"
          >查询</el-button
        >
        <el-button
          size="medium"
          icon="el-icon-refresh"
          type="primary"
          @click="setNumReset()"
          >重置</el-button
        >
      </div>
      <!-- 特殊号段信息表 -->
      <div v-show="showSpcialNumTable">
        <el-table
          v-loading="setNum_config.loading"
          :data="spcailNum_tableData"
          class="mbtm20"
          fit
          highlight-current-row
          style="width: 100%"
          border
          @current-change="spcailNumSection_handleCurrRowChange"
          @row-click="spcailNumSection_chooseCurrRow"
        >
          <el-table-column width="55">
            <template slot-scope="scope">
              <el-radio
                v-model="spcailNum_curRowRadio"
                :label="scope.row.segmentNumber"
              >
                <span class="el-radio__label"></span>
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column
            prop="segmentNumber"
            label="特殊号码段号"
            align="center"
          />
          <el-table-column prop="" label="操作" align="center">
            <template slot-scope="{ row }">
              <el-button size="mini" type="primary" @click="querySpcialNum(row)"
                >查询特殊号</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="setNum_config.total > 0"
          :total="setNum_config.total"
          :page.sync="setNum_config.pageNum"
          :limit.sync="setNum_config.pageSize"
          @pagination="setNum_getSpecialNumlist"
        />
      </div>
      <!-- 特殊号信息 -->
      <div v-show="showSpcialNumTable2">
        <div class="text_title">特殊号信息表</div>
        <el-table
          v-loading="setNum_config2.loading"
          :data="spcailNum_tableData2"
          class="mbtm20"
          fit
          highlight-current-row
          style="width: 100%"
          border
          @current-change="spcailNum_handleCurrRowChang"
          @row-click="spcailNum_chooseCurrRow"
        >
          <el-table-column width="55">
            <template slot-scope="scope">
              <el-radio
                v-model="spcailNum_curRowRadio2"
                :label="scope.row.cardNumber"
              >
                <span class="el-radio__label"></span>
              </el-radio>
            </template>
          </el-table-column>
          <el-table-column prop="cardNumberStr" label="特殊号" align="center" />
        </el-table>
        <pagination
          v-show="setNum_config2.total > 0"
          :total="setNum_config2.total"
          :page.sync="setNum_config2.pageNum"
          :limit.sync="setNum_config2.pageSize"
          @pagination="setNum_getSpecialNumInfolist"
        />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sureMatcheNum()"> 确定 </el-button>
        <el-button @click="setNum_close()"> 关闭 </el-button>
      </div>
    </el-dialog>
    <!-- 自动配置靓号弹窗end -->

    <!-- 附属卡 弹窗 -->
    <el-dialog title="主卡信息" :visible.sync="subCard_dialog" width="75%">
      <el-form :model="subCardSearch" :inline="true">
        <el-form-item class="" label="证件类型" prop="idType">
          <el-select v-model="subCardSearch.idType" class="wd200" clearable>
            <el-option
              v-for="(item, index) in idTypeOptions"
              :key="index"
              :label="item.detailDesc"
              :value="item.codes"
            />
          </el-select>
        </el-form-item>
        <el-form-item class="" label="证件号码" prop="idNumber">
          <el-input
            v-model="subCardSearch.idNumber"
            class="wd200"
            type="text"
          />
        </el-form-item>

        <!-- <div class="cl_tr text_center"> -->
        <el-form-item class="">
          <el-button
            size="medium"
            icon="el-icon-search"
            type="primary"
            @click="subCard_searchBtn()"
            >查询</el-button
          >
          <el-button
            size="medium"
            icon="el-icon-refresh"
            type="primary"
            @click="subCard_resetBtn()"
            >重置</el-button
          >
        </el-form-item>
      </el-form>
      <!-- </div> -->

      <div v-show="showSubCardCstInfo">
        <div class="text_title">客户基本信息</div>
        <el-form :model="subCard_cstInfoObj">
          <el-form-item class="cl_td" label="证件类型" prop="idType">
            <el-select
              clearable
              v-model="subCard_cstInfoObj.idType"
              class="wd200"
            >
              <el-option
                v-for="item in idTypeOptions"
                :key="item.codes"
                :label="item.detailDesc"
                :value="item.codes"
                diabled
              />
            </el-select>
          </el-form-item>
          <el-form-item class="cl_td" label="证件号码" prop="idNumber">
            <el-input
              v-model="subCard_cstInfoObj.idNumber"
              class="wd200"
              type="text"
              readonly
            />
          </el-form-item>
          <el-form-item class="cl_td" label="客户名称" prop="customerName">
            <el-input
              v-model="subCard_cstInfoObj.customerName"
              class="wd200"
              type="text"
              readonly
            />
          </el-form-item>
          <el-form-item class="cl_td" label="客户代码" prop="customerNo">
            <el-input
              v-model="subCard_cstInfoObj.customerNo"
              class="wd200"
              type="text"
              readonly
            />
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="sureSubCard()"> 确定 </el-button>
        <el-button @click="subCard_dialog = false"> 关闭 </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// test-git-push
import Pagination from "@/components/Pagination";
import PriceLabelInfo from "@/components-ider/cstSvc/PriceLabelInfo";

import { validPhone, isIdentityId, isIdentityIdTest, isHKCard, isTWCard, passport, isPermanentReside } from "@/utils/validate";
import { uppercaseAllWord } from '@/filters/index'
import * as _ from 'lodash'


export default {
  name: "FastBuildCardTwo",
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Pagination,
    PriceLabelInfo, // 定价标签查询
  },
  data() {
    // 验证手机号
    const checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error("手机号不能为空"))
      } else if (!validPhone(value)) {
        return callback(new Error("请输入正确格式"))
      } else {
        callback()
      }
    }
    // 验证证件号
    const checkIdNumber = (rule, value, callback) => {
        if (!value) {
            return callback(new Error("证件号不能为空"))
        } else if ( this.cstSearchForm.idType == '1'  ) {
            // 验证身份证
            if (this.systemEnvironmentFlag === 'TEST') { // 测试环境 非严格身份验证
                var errorMsg = isIdentityIdTest(value);
                if (errorMsg != "") {
                    callback(new Error(errorMsg));
                }
            } else if (this.systemEnvironmentFlag === 'PROD') { // 生产环境 严格身份验证
                var errorMsg = isIdentityId(value);
                if (errorMsg != "") {
                    callback(new Error(errorMsg));
                }
            }
        } else if ( this.cstSearchForm.idType == '2'  ) {
            // 验证港澳居民来往内地通行证
            var errorMsg = isHKCard(value);
            if (errorMsg != "") {
                callback(new Error(errorMsg));
            }
        } else if ( this.cstSearchForm.idType == '3'  ) {
            // 验证台湾居民来往内地通行证
            var errorMsg = isTWCard(value);
            if (errorMsg != "") {
                callback(new Error(errorMsg));
            }
        } else if ( this.cstSearchForm.idType == '4' ||  this.cstSearchForm.idType == '5') {
            // 验证护照
            var errorMsg = passport(value);
            if (errorMsg != "") {
                callback(new Error(errorMsg));
            }
        } else if ( this.cstSearchForm.idType == '6'  ) {
            // 验证外国人永久居留证
            var errorMsg = isPermanentReside(value);
            if (errorMsg != "") {
                callback(new Error(errorMsg));
            }
        } else if ( this.cstSearchForm.idType == '0'  ) {
           
        }


    }


    return {
        longinInfoObj : {},
        systemEnvironmentFlag: '', // 当前环境 TEST / PROD
        tooltipText: '请输入证件号码', // 证件号码提示语
      idTypeOptions: [], // 身份证类型
      institutionIdOptions: [], // 机构号
      customerTypeOptions: [], // 客户类型
      billDayOptions: [], // 账单日
      paymentMarkOptions: [], // 还款选项
      sexCodeOptions: [], // 性别
      residencyStatusOptions: [], // 住宅性质
      maritalStatusOptions: [], // 婚姻状况
      postRankCodeOptions: [], // 职务级别代码
      guarantorFlagOptions: [], // 担保人标识
      addressTypeOptions: [], // 地址类型
        directDebitStatusOptions: [],
        directDebitModeOptions: [],
        exchangePaymentFlagOptions: [],
        isSetPriceOptions: [],
        pricingObjectOptions: [],
        segmentNumberOptions: [],

        mainSupplyIndicatorOptions: [],
        mediaObjectCodeOptions: [],
        mediaDispatchMethodOptions: [],
        pinDispatchMethodOptions: [],
        requestCardMakingOptions: [],
        formatCodeOptions: [], //
      
      showSearchDiv: true, // 搜索模块
      cstBaseEstDiv: false, // 1客户基本资料模块
      feeItemDiv: false, // 2 增值服务模块
      proEstDiv: false, // 3产品建立模块
      priceLabelSetDiv: false, // 4定价标签设置模块
      mediaInfoEstDiv: false, // 5媒介信息建立模块
      mediaDPANDiv: false, // 6已有媒介申请DPAN模块
      resultInfoDiv: false, // 7最终客户信息模块
      addressFormDiv: true, // 客户地址信息
      remarkFormDiv: false, // 客户备注信息
      showHKno: false, // 港澳台居民居住证
      readonly: true,

      cstSearchFormRules: {
        idNumber: [
            { validator: checkIdNumber, trigger: 'blur' }
        ]
      },
      
      total: 0,
      cstSearchForm: {
        // 查询表单
        idType: "",
        idNumber: "",
      },
      cstInfoForm: {}, // 客户基本信息 
      cstBaseInfoForm: {
        mobilePhone: "",
      }, // 客户基本资料
      cstBaseInfoRef : {},
      idType_isDisabled: false, // 资料建立 证件类型
      addressForm: {}, // 客户地址obj
      addressObjList: [], // 客户地址List
      remarkForm: {}, // 客户备注obj
      remarkObjList: [], // 客户备注List
      cstBaseRules: {
        mobilePhone: [
          { required: true, validator: checkPhone, trigger: "blur" },
        ]
      },
      isHavePro: false, // 判断客户是否建产品
      dialogChoseBusiness1: false, // 业务选择， 只新建产品弹窗
      dialogChoseBusiness2: false, // 业务选择， 新建产品或媒介弹窗
      // 无产品，只新建产品
      askFlagRadio: '',
      businessData1: [{
        id: "d7ca83c2a9324ad7842b663bcfc79873",
        askName: "申请新产品新卡片",
        askFlag: 1
      }],
      // 有产品，新建产品或者媒介
        businessData2: [{
            id: "d7ca83c2a9324ad7842b663bcfc79873",
            askName: "申请新产品新卡片",
            askFlag: 1
        },
        {
            id: "5ccf83544bc7499e955432091971297369",
            askName: "申请已有产品新卡片",
            askFlag: 2
        },
        {
            id: "5ccf83544bc7499r2344091971297369",
            askName: "申请已有媒介DPAN",
            askFlag: 3
        }],
        choseBusinessCurrentRow: null,
        cstInfoRef: {},
        cstInfoObj: {
            pageNum: 1,
            pageSize: 10
        }, // 客户信息对象 存储客户信息

        //收费项目
        feeItemSeachForm:{},
        feeItemList: [],
        feeItem_config: {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0
        },
        feeItemTotal: 0, // 收费项目列表
        multipleSelectFeeItem: [], // 已选的收费项目

        // 产品信息建立
        listLoading2: false,
        havedProTotal: 0,
        havedProList: [],
        currentSelectedHavedPro:  null, // 当前选中的已有产品
        curChoosedHavedPro: "",
        currentSelectedPro: null, // 当前选中产品
        step3_proInfoObj: {}, //产品信息建立  4.填写还款信息
        step3_proInfoRef: {},
        step3_proInfoRules: {},
        showBusCardDiv: false, // 产品建立 公务卡显示模块
        showBusCardOInfoDiv: false , // 公务卡信息
        newProObj: {}, // 新建产品成功后 新产品信息
        allProList: [],
        allProObj: {
            pageNum: 1,
            pageSize: 10
        },
        allProTotal: 0,
        curChoosedProRadio:'',// 选择产品
        curChoosedPro: {},
        // 设置账单日 弹窗
        billDayData: [],
        billDay_dialog: false, // 账单日   
        

        // 标签设置
        priceLabelForm: {},
        price_config : {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0,
        },
        priceData: [],
        price_multipleSelection: [], // 定价标签 多选
        priceLabelDetail_dialog: false,
        priceLabelObj: {},
        // 已有标签
        havedPriceData: [],
        havedPrice_config: {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0,
        },
        // 已关联定价标签
        relatedPrice_config: {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0,
        },
        relatedPriceData : [],
        priceSet_dialog: false,
        // 定价标签 设置
        priceSetObj: {},
        priceSetRef: {},
        priceSetRules: {},
        setPrice_index: '', // 已关联标签 设置下标
        pickerOptionsStart: {}, //  *标签生效日期
        pickerOptionsEnd:{}, // 标签失效日期
        pricingLevelOptions: [], // 定价层级
        pricingLevelCodeOptions: [], // 定价层级代码
        priceDateFlag: '', // 关联定价标签 日期必输
        

        // 媒介模块
        step5_mediaInfoRef: {},
        step5_mediaInfoRules: {},
        step5_mediaInfoObj: {},
        media_curChoosedProRadio : '',
        media_curChoosedPro: {},
        mediaHavedPro_config : {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0,
        },
        media_havedProData: [],
        defalutChoosedProObj: {}, // 媒介中 默认选中的产品
        isSupportDiv: false, // 是否支持配置靓号模块
        custNicknameDiv: false, // 客户靓号
        inputDiv: false, // 手动输入
        matcheFlag: '', // 是否支持配置靓号标志
        isShowFormatCode: true, //  是否显示制卡信息
        budgetOrgCodeStr: '', // 预算单位
        showSubCardCstInfo: false, // 附属卡
        // 附属卡 弹窗
        showSubCustomerNo: false, // 付客户代码
        subCard_dialog: false, // 附属卡 弹窗
        subCardSearch: {}, // 附属搜索
        subCard_cstInfoObj: {}, // 附属卡 客户信息
        isHaveSubFlag: '', // 是否有附属卡标识
        // 配置靓号 弹窗
        setNum_dialogForm: false,
        showNickNum: true, // 靓号
        setNumRef: {},
        setNumRules: {},
        setNumObj: {},
        // newMediaObj: {}, // 新媒介
        showCustNicknameDiv: false,
        // 号段信息表
        showSpcialNumTable: false,
        setNum_config: {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0
        },
        spcailNum_tableData: [],
        spcailNum_curRowRadio: '',
        spcailNum_curRow: {},
        // 特殊号信息表
        showSpcialNumTable2: false,
        setNum_config2: {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0
        },
        spcailNum_tableData2: [],
        spcailNum_curRowRadio2: '',
        spcailNum_curRow2: {},


        // dpan 模块
        dpan_mediaInfoDiv : false,
        dpan_mediaInfoObj : {},
        dpan_mediaInfoRules : {},
        dpan_mediaInfoRef : {},
        dpan_choosedMediaObj : {},
        dpan_choosedMediaRadio: '',

        dpan_havedMediaData: [],
        dpan_havedMediaConfig : {
            loading: false,
            pageNum: 1,
            pageSize: 10,
            total: 0
        },

        // 7终客户信息模块
        resultInfoRef : {},
        resultInfoObj : {},
        
    };
  },
  created() {
    this.init()
    this.subCardInit() // 附属卡跳转过来
  },
  mounted() {
    // 证件类型
    this.getSelectDict("dic_certificateType").then((res) => {
      this.idTypeOptions = res
    })
    // 客户类型
    this.getSelectDict("dic_personalCompanyType").then((res) => {
      this.customerTypeOptions = res
    })
    // 账单日
    this.getSelectDict("dic_billDay").then((res) => {
      this.billDayOptions = res
    })
    // 还款选项
    this.getSelectDict("dic_paymentMark").then((res) => {
      this.paymentMarkOptions = res
    })
    // 机构号
    this.getSelectDict("/beta/betaService/COS.IQ.02.0005", {}).then((res) => {
        this.institutionIdOptions = res
    })
    // 性别
    this.getSelectDict("dic_gender").then((res) => {
      this.sexCodeOptions = res
    })
    // 住宅性质
    this.getSelectDict("dic_residencyStatus").then((res) => {
      this.residencyStatusOptions = res
    })
    // 婚姻状况
    this.getSelectDict("dic_maritalStatus").then((res) => {
      this.maritalStatusOptions = res
    })
    // 职务级别代码
    this.getSelectDict("dic_postRankCode").then((res) => {
      this.postRankCodeOptions = res
    })
    // 担保人标识
    this.getSelectDict("dic_guarantorFlag").then((res) => {
      this.guarantorFlagOptions = res
    })
    // 地址类型
    this.getSelectDict("dic_addressType").then((res) => {
      this.addressTypeOptions = res
    })

    // 约定还款状态
    this.getSelectDict("dic_directDebitStatus").then((res) => {
      this.directDebitStatusOptions = res
    })
    // 约定还款方式
    this.getSelectDict("dic_directDebitMode").then((res) => {
      this.directDebitModeOptions = res
    })
    // 购汇还款标志
    this.getSelectDict("dic_exchangePaymentFlag").then((res) => {
      this.exchangePaymentFlagOptions = res
    })
     // *定价标签设置
     this.getSelectDict("dic_ZorO").then((res) => {
      this.isSetPriceOptions = res
    })
    //定价类型
    this.getSelectDict('dic_pricingType').then((res) => {
        this.pricingObjectOptions = res
    })
    // 定价层级初始化
    this.pricingLevelOptions.push({
        detailDesc : '客户级',
        codes : 'C'
    })

    // 主附标识
    this.getSelectDict("dic_mainAttachedFlag").then((res) => {
      this.mainSupplyIndicatorOptions = res
    })
    // 媒介对象代码
    this.getSelectDict("dic_mediaObjectCode").then((res) => {
      this.mediaObjectCodeOptions = res
    })
    // 媒介领取标志
    this.getSelectDict("dic_isYorN").then((res) => {
      this.mediaDispatchMethodOptions = res
    })
    // 密码函领取标志
    this.getSelectDict("dic_isYorN").then((res) => {
      this.pinDispatchMethodOptions = res
    })
    // 制卡请求
    this.getSelectDict("dic_requestCardMaking").then((res) => {
      this.requestCardMakingOptions = res
    })
    // 卡版代码
    this.getSelectDict("/beta/betaService/COS.IQ.02.0054").then((res) => {
      this.formatCodeOptions = res
    })
    this.getCorEntityNo() // 查询法人实体
  },
  methods: {
      // 查询法人实体
      getCorEntityNo () {
        let logininfo = JSON.parse(window.sessionStorage.getItem('logininfo'))
        this.systemEnvironmentFlag = logininfo.systemEnvironmentFlag
        let params = {
            organNo : logininfo.organization
        }
        this.post('/beta/betaService/COS.IQ.02.0005', params, (res) => {
            if (res.returnCode == '000000') {
                this.longinInfoObj.corporationEntityNo = res.returnData.rows[0].corporationEntityNo
            }
        })
      },
    init() {
      this.cstSearchForm = {
        idType: "",
        idNumber: "",
        pageNum: 1,
        pageSize: 10,
      } 
      this.showSearchDiv = true // 搜索模块
      this.cstBaseEstDiv = false // 1客户基本资料模块
      this.feeItemDiv = false // 2 收费项目模块
      this.proEstDiv = false // 2产品建立模块
      this.priceLabelSetDiv = false // 3定价标签设置模块
      this.mediaInfoEstDiv = false // 4媒介信息建立模块
      this.mediaDPANDiv = false // 5已有媒介申请DPAN模块
      this.resultInfoDiv = false // 6最终客户信息模块
    },
    initData() {
        this.currentSelectedHavedPro = null  // 当前选中的已有产品
        this.choosedPro = '' // 当前选中的已有产品
    },
    // 证件类型 联动 新建客户保持一致
    idTypeHandleChange(value) {
        this.cstBaseInfoForm.idType = value
        this.cstSearchForm.idNumber = ''
        this.cstBaseInfoForm.idNumber = ''
        this.idType_isDisabled = true // 
        if (value == 2 || value == 3) {
            this.showHKno = true
        } else {
            this.showHKno = false
        }
    },
    idTypeHandleChange2(value) {
        this.cstSearchForm.idType = value
        this.cstSearchForm.idNumber = ''
        this.cstBaseInfoForm.idNumber = ''
        if (value == 2 || value == 3) {
            this.showHKno = true
        } else {
            this.showHKno = false
        }
    },
    // 证件号码 focus
    idNoChange(val) {
        if (this.cstSearchForm.idType == '1') { // 身份证
            if (this.systemEnvironmentFlag === 'TEST') { // 测试环境
                this.tooltipText = '测试环境：身份证，18位数字，如：110101199003078195'
            } else if (this.systemEnvironmentFlag === 'PROD') { // 生产环境
                this.tooltipText = '身份证，18位或15位有效身份证，如：110101199003078195'
            }
        } else if (this.cstSearchForm.idType == '2') { // 港澳居民来往内地通行证
            this.tooltipText = '港澳居民来往内地通行证，H/M开头+9数字，如：H123456789'
        } else if (this.cstSearchForm.idType == '3') { // 台湾居民来往内地通行证
            this.tooltipText = '台湾居民来往内地通行证，字母/数字开头+7位数字，如：a1234567'
        } else if (this.cstSearchForm.idType == '4') { // 中国护照
            this.tooltipText = '中国护照，字母开头+8位数字，如：a12345678'
        } else if (this.cstSearchForm.idType == '5') { // 外国护照
            this.tooltipText = '外国护照，字母开头+8位数字，如：a12345678'
        } else if (this.cstSearchForm.idType == '6') { // 外国人永久居留证
            this.tooltipText = '外国人永久居留证，前3位字母+12位数字，如：aaa123456789000'
        } else { // 其他
            this.tooltipText = '请输入证件号码'
        }
    },
    // 重置
    reset() {
      this.init()
    },
    resetForm() {
      this.$refs["cstBaseInfoForm"].resetFields()
    },
    // 查询
    hadleSearch() {
        this.initData()
        let _this = this
        // 判断客户是否存在 
        // 不存在： 新建
        // 存在： 判断是否有产品：无：只新建产品，有：新建产品或者卡片
        sessionStorage.setItem('newCstBuildFlag',1)
        this.post('/nonfi/nonfinanceService/BSS.IQ.01.0001', this.cstSearchForm, (res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                    let data = res.returnData.rows[0]
                    _this.cstInfoObj.customerName = data.customerName // 客户名称
                    _this.cstInfoObj.customerNo = data.customerNo // 客户号
                    _this.cstInfoObj.idNumber = data.idNumber // 客户id 号码
                    _this.cstInfoObj.idType = data.idType // 客户id Type
                    _this.cstInfoObj.mobilePhone = data.mobilePhone // 客户手机号
                }
                //判断是否有产品：无：只新建产品，有：新建产品或者卡片
                this.post('/nonfi/nonfinanceService/BSS.IQ.01.0004', this.cstSearchForm, (res1) => {
                    if (res1.returnCode == '000000') { // 有产品 新建产品或者卡片
                        if (res1.returnData && res1.returnData.rows && res1.returnData.rows.length > 0) {
                            _this.dialogChoseBusiness1 = false
                            _this.dialogChoseBusiness2 = true
                        } else { // 无产品，只新建产品弹窗
                            this.dialogChoseBusiness1 = true
                            _this.dialogChoseBusiness2 = false
                        }
                        sessionStorage.removeItem('newCstBuildFlag') // 删除客户新建标记
                        
                    } else if (res1.returnCode == 'CUS-00014') { // 新建客户
                        _this.dialogChoseBusiness1 = false
                        _this.dialogChoseBusiness2 = false
                    } else { // 报错
                        _this.dialogChoseBusiness1 = false
                        _this.dialogChoseBusiness2 = false
                        sessionStorage.removeItem('newCstBuildFlag') // 删除客户新建标记

                    }
                })
            } else if (res.returnCode == 'CUS-00014' ) { // 新建客户
                // 赋值客户证件号码 类型
                _this.cstBaseInfoForm.idNumber = this.cstSearchForm.idNumber
                _this.cstBaseInfoForm.idType = this.cstSearchForm.idType
                _this.showSearchDiv = true // 搜索模块
                _this.cstBaseEstDiv = true // 1客户基本资料模块
                this.feeItemDiv = false // 2 收费项目模块
                _this.proEstDiv = false // 2产品建立模块
                _this.priceLabelSetDiv = false // 3定价标签设置模块
                _this.mediaInfoEstDiv = false // 4媒介信息建立模块
                _this.mediaDPANDiv = false // 5已有媒介申请DPAN模块
                _this.resultInfoDiv = false // 6最终客户信息模块
                sessionStorage.removeItem('newCstBuildFlag') // 删除客户新建标记
            } else {
                _this.showSearchDiv = true // 搜索模块
                _this.cstBaseEstDiv = false // 1客户基本资料模块
                this.feeItemDiv = false // 2 收费项目模块
                _this.proEstDiv = false // 2产品建立模块
                _this.priceLabelSetDiv = false // 3定价标签设置模块
                _this.mediaInfoEstDiv = false // 4媒介信息建立模块
                _this.mediaDPANDiv = false // 5已有媒介申请DPAN模块
                _this.resultInfoDiv = false // 6最终客户信息模块
                // 赋值客户证件号码 类型
                _this.cstBaseInfoForm.idNumber = this.cstSearchForm.idNumber
                _this.cstBaseInfoForm.idType = this.cstSearchForm.idType
                sessionStorage.removeItem('newCstBuildFlag') // 删除客户新建标记
            }
        })
    },
    handleCurrentChange(val) {
        this.choseBusinessCurrentRow = val
    },
    chooseBusiness(row) {
        this.askFlagRadio = row.askFlag
    },
    // 确定业务选择
    sureBusiness() {
        // console.log(this.choseBusinessCurrentRow.askFlag)
        this.askFlagRadio = ''
        this.dialogChoseBusiness1 = false
        this.dialogChoseBusiness2 = false
        if (this.choseBusinessCurrentRow.askFlag == 1) { // 申请产品
            this.showSearchDiv = true // 搜索模块
            this.cstBaseEstDiv = false // 1客户基本资料模块
            this.feeItemDiv = false // 2 收费项目模块
            this.proEstDiv = true // 3产品建立模块
            this.priceLabelSetDiv = false // 4定价标签设置模块
            this.mediaInfoEstDiv = false // 4媒介信息建立模块
            this.mediaDPANDiv = false // 5已有媒介申请DPAN模块
            this.resultInfoDiv = false // 7最终客户信息模块
            this.getHavedProList() // 查询已有产品
            this.getAllProList() // 查询所有产品

        } else if (this.choseBusinessCurrentRow.askFlag == 2) { // 申请卡片
            this.showSearchDiv = true // 搜索模块
            this.cstBaseEstDiv = false // 1客户基本资料模块
            this.feeItemDiv = false // 2 收费项目模块
            this.proEstDiv = false // 3产品建立模块
            this.priceLabelSetDiv = false // 4定价标签设置模块
            this.mediaInfoEstDiv = true // 5媒介信息建立模块
            this.mediaDPANDiv = false // 6已有媒介申请DPAN模块
            this.resultInfoDiv = false // 7最终客户信息模块
            this.media_havedProList() // 媒介中 查询已有产品
            this.step5_mediaInfoObj.mainCustomerNo = this.cstInfoObj.customerNo // 主客户代码
        } else if (this.choseBusinessCurrentRow.askFlag == 3) { // 申请已有媒介DPAN
            this.showSearchDiv = true // 搜索模块
            this.cstBaseEstDiv = false // 1客户基本资料模块
            this.feeItemDiv = false // 2 收费项目模块
            this.proEstDiv = false // 3产品建立模块
            this.priceLabelSetDiv = false // 4定价标签设置模块
            this.mediaInfoEstDiv = false // 5媒介信息建立模块
            this.mediaDPANDiv = true // 6已有媒介申请DPAN模块
            this.resultInfoDiv = false // 7最终客户信息模块
            this.dpan_havedMediaList() // DPAN模块 查询已有媒介
        }
    },
    // 客户基本信息建立 下一步
    nextTo2(formName) {
      this.$refs[formName].validate((valid) => {
        if (!valid) {
          return false
        }
        // 判断是否有地址信息
        if (this.addressObjList.lengh == 0) {
          this.$message({
            message: "请填写地址信息",
            type: "warning",
          })
          return
        }
        // 验证港澳通行证信息
        if (this.cstBaseInfoForm.idType == 2 || this.cstBaseInfoForm.idType == 3) {
            if (!this.cstBaseInfoForm.idNumberHmt) {
                this.$message({
                    message: "请填写港澳台居民居住证",
                    type: "warning",
                })
                return
            }
        }
        let params = {
            coreCoreCustomerAddrs: this.addressObjList,
            coreCustomerRemarkss: this.remarkObjList,
        }
        params = Object.assign(params, this.cstBaseInfoForm)
        // 下一步
        this.post('/nonfi/nonfinanceService/BSS.AD.01.0001', params, (res) => {
            if (res.returnCode == '000000') { // 有产品 新建产品或者卡片
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                    // 用户基本信息 
                    this.cstInfoObj = res.returnData.rows[0]
                    this.cstInfoObj.customerNo = res.returnData.rows[0].customerNo
                    this.cstInfoObj.customerName = res.returnData.rows[0].customerName
                    this.cstInfoObj.idNumber = res.returnData.rows[0].idNumber
                    this.cstInfoObj.mobilePhone = res.returnData.rows[0].mobilePhone
                    // 初始化
                    this.cstBaseInfoForm = {}
                    this.addressObjList = [] // 地址信息
                    this.remarkObjList = [] // 标签新
                    //费用项目查询
                    this.feeItemDiv = true
                    this.cstBaseEstDiv = false
                    // 已选择的收费项目
                    this.getFeeItemList()
                }
            } else {
                //费用项目查询
                this.feeItemDiv = false
            }
        })
      })
    },
    // 保存客户地址信息
    saveAddress(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.addressTypeOptions.forEach((item, i) => {
            if (this.addressForm.type == item.codes) {
              this.addressForm.typeDesc = item.detailDesc
            }
          })
          this.addressObjList.push(this.addressForm);
          this.addressFormDiv = false; // 客户地址信息
          this.addressForm = {}
          // this.$refs[ formName ].resetFields()
        } else {
          return false;
        }
      });
    },
    // 关闭客户地址信息
    closeAddress() {
      this.addressFormDiv = false // 客户地址信息
    },
    // 新增客户地址按钮
    addAdress() {
      this.addressFormDiv = true
    },
    // 新增备注信息
    saveRemark() {
      if (!this.remarkForm.remarkInfo && !this.remarkForm.lastUpdateUserid) {
        this.$message({
          message: "请输入备注信息",
          type: "warning",
        });
      } else {
        this.remarkObjList.push(this.remarkForm)
        this.remarkFormDiv = false; // 客户地址信息
        this.remarkForm = {}
      }
    },
    // 关闭客户备注信息
    closeRemark() {
      this.remarkFormDiv = false // 客户地址信息
    },
    // 新增客户备注按钮
    addRemark() {
      this.remarkFormDiv = true
    },
    // 收费项目
    //收费项目查询按钮
    feeItemFilter() {
        this.getFeeItemList()
    },
    // 收费项目列表
    getFeeItemList() {
        this.feeItem_config.loading = true
        let params = {
            periodicFeeIdentifier: 'C',
            isTrans: true,
            transParams: ['dic_costCategory'],
            transDict: ['feeType']
        }
        params = Object.assign(params, this.feeItemSeachForm, this.feeItem_config)
        this.getTableList('/beta/betaService/COS.IQ.02.0031', params ,(res) => {
            if (res.returnCode == '000000') {
                this.feeItem_config.loading = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.feeItemList = res.returnData.rows
                    this.feeItem_config.total = res.returnData.totalCount
                } else {
                    this.feeItemList = []
                    this.feeItem_config.total = 0
                }
            }
            
        } , (err) => {
            if(err) {
                this.feeItemList = []
                this.feeItem_config.total = 0
                this.feeItem_config.loading = false
            }
        })

    },
    // 关联收费项目
    relatedFeeItem() {
        this.multipleSelectFeeItem = this.multipleSelectFeeItem
    },
    // 删除已经选择的收费项目
    handleFeeItemDelete(row, index) {
        this.$message({
        title: '删除',
        message: '删除成功',
        type: 'success',
        duration: 2000
      })
        this.multipleSelectFeeItem.splice(index, 1)
        if (row) {
            this.feeItemList.forEach(item => {
                if (row.feeItemNo == item.feeItemNo){
                    this.$refs.multipleFeeItemTable.toggleRowSelection(item);
                }
            });
        }
    },
    // 选择收费项目事件
    handleSelectFeeItem(value) {
        this.multipleSelectFeeItem = value
    },

    // 下一步 到产品信息建立
    nextTo3() {
        console.log(this.multipleSelectFeeItem.length)
      //  if(this.multipleSelectFeeItem.length > 0){
            const params = {
                coreFeeItemList: this.multipleSelectFeeItem,
                customerNo: this.cstInfoObj.customerNo,
                idNumber: this.cstInfoObj.idNumber,
                idType: this.cstInfoObj.idType
            }
            //保存新增收费项目
            this.post('/nonfi/nonfinanceService/BSS.AD.01.0006' , params, (res) => {
                if(res.returnCode == '000000') {
                    this.showSearchDiv = true // 搜索模块
                    this.cstBaseEstDiv = false // 1客户基本资料模块
                    this.feeItemDiv = false // 2 收费项目模块
                    this.proEstDiv = true // 2产品建立模块
                    this.priceLabelSetDiv = false // 3定价标签设置模块
                    this.mediaInfoEstDiv = false // 4媒介信息建立模块
                    this.mediaDPANDiv = false // 5已有媒介申请DPAN模块
                    this.resultInfoDiv = false // 6最终客户信息模块
                    this.getHavedProList() // 查询已有产品
                    this.getAllProList() // 查询所有产品
                }
            })
       // }
        
    },
    // 上一步 到客户基本资料建立
    preTo1() {
        this.showSearchDiv = true // 搜索模块
        this.cstBaseEstDiv = true // 1客户基本资料模块
        this.feeItemDiv = false // 2 收费项目模块
        this.proEstDiv = false // 2产品建立模块
        this.priceLabelSetDiv = false // 3定价标签设置模块
        this.mediaInfoEstDiv = false // 4媒介信息建立模块
        this.mediaDPANDiv = false // 5已有媒介申请DPAN模块
        this.resultInfoDiv = false // 6最终客户信息模块
    },
    // 产品建立中 下一步 to  定价标签
    nextTo4() {
        console.log('产品建立中 下一步')
        this.$refs['step3_proInfoRef'].validate((valid) => {
            if (valid) {
                // 判断客户下是否有产品 ， 
                // 无：初次建立产品未选择产品提示必须选择一条， 
                // 有产品：没有选产品，默认选中已有第一条产品；
	            // 选择了产品，默认选中所选产品
                this.isHaveProFun(); 
            }
        })
    },

    // 查询已有产品 
    getHavedProList() {
        let params = {
            idNumber: this.cstInfoObj.idNumber,
            idType:  this.cstInfoObj.idType,
            pageNum: 1,
            pageSize: 10
        }
        this.post('/nonfi/nonfinanceService/BSS.IQ.01.0004', params, (res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.havedProTotal = res.returnData.totalCount
                    this.havedProList = res.returnData.rows
                }
            }
        })
    },
    // 查询所有产品 
    getAllProList() {
        const params = {
            idNumber: this.cstInfoObj.idNumber,
            idType:  this.cstInfoObj.idType,
            pageNum: this.allProObj.pageNum,
            pageSize: this.allProObj.pageSize
        }
        this.post('/beta/betaService/COS.IQ.02.0013', params, (res) => {
            if (res.returnCode == '000000') {
                if(res.returnData && res.returnData.rows && res.returnData.rows.length >0 ) {
                    this.allProList = res.returnData.rows
                    this.allProTotal = res.returnData.totalCount
                }
            }
        })
    },
    // 产品信息建立
    // 已有产品列表 当前选中
    handleCurrentHavedProChange(row) { //获取选中数据
        this.currentSelectedHavedPro = row
    },
    // 产品模块中 选择已有产品
    chooseHavedPro(row) {
        this.curChoosedHavedPro = row.productObjectCode
    },
    handleChooseProChange(row) {
        this.curChoosedProRadio = row.productObjectCode
        this.curChoosedPro = row
    },
    // 所有产品 点击当前行 
    choosePro(row){
        this.curChoosedProRadio = row.productObjectCode
        this.curChoosedPro = row
        this.isInputBillDay(row) // 判断是否设置账单日
        // 判断是否为公务卡 显示公务卡信息
        if (row.productObjectCode.substr(0, 6) == 'MODP40') { // 公务卡
            this.showBusCardDiv = true
        } else { // 非公务卡
            this.showBusCardDiv = false
        }
    },
    // 预算单位查询 按钮
    queryBusCardBtn() {
        if (!this.step3_proInfoObj.budgetOrgCode) {
            this.$message({
                title: "提示",
                message: "请选择一条产品",
                type: "warning",
                duration: 2000
            })
            return
        } else {
            this.budgetOrgCodeStr = this.step3_proInfoObj.budgetOrgCode
        }
        let params = {
            idType : '7',
			idNumber : this.step3_proInfoObj.budgetOrgCode
        }
        this.post('/nonfi/nonfinanceService/OCS.IQ.01.0001', params, (res) => {
            if (res.returnCode == '000000') {
               this.showBusCardOInfoDiv = true
                this.step3_proInfoObj.budgetOrgName = res.returnData.rows[0].customerName;
				this.step3_proInfoObj.billDay = res.returnData.rows[0].billDay;
            } else {
               this.showBusCardOInfoDiv = false
            }
        })
    },
    // 预算单位查询 重置
    resetBusCardBtn() {
        this.step3_proInfoObj.budgetOrgCode =''
    },
    // 判断客户下是否有产品 ， 无：初次建立产品未选择产品提示必须选择一条， 有产品：没有选产品，默认选中已有第一条产品；
	//  选择了产品，默认选中所选产品
    isHaveProFun() {
        if (this.havedProList.length > 0 ) { // 有产品
            if (this.curChoosedPro.productObjectCode) { // 选择了产品
                this.curChoosedPro = this.curChoosedPro
                this.saveProInfo() // 保存产品
            } else { // 没有选择产品
                this.curChoosedPro = this.havedProList[0]
                this.saveProInfo() // 保存产品
            }
        } else { // 无产品
            if (this.curChoosedPro.productObjectCode) { // 选择了产品
                this.curChoosedPro = this.curChoosedPro
                this.saveProInfo() // 保存产
            } else { // 没有选择产品
                this.$message({
                    title: "提示",
                    message: "请选择一条产品",
                    type: "warning",
                    duration: 2000
                })
                return
            }
        }
    },
    // 判断选择产品对应的业务项目是否需要输入账单日
    isInputBillDay(row) {
        let params = {
            operationMode : row.operationMode,
            productObjectCode : row.productObjectCode,
            idType : this.cstInfoObj.idType,
            idNumber : this.cstInfoObj.idNumber
        }
        this.post("/nonfi/nonfinanceService/BSS.IQ.01.0016", params, (res) => {
            if (res.returnCode == "000000") {
                if (res.returnData.rows.length > 0 ) {
                    this.billDay_dialog = true
                    this.billDayData = res.returnData.rows
                } else {
                    return
                }
            }
        });
    },
    // 设置账单日 确定
    sureBillDay() {
        let isStop;
        for (let i = 0 ; i < this.billDayData.length; i++ ) {
            if (!this.billDayData[i].cycleFrequencyDay) {
                isStop = false
                break
            } else { 
                isStop = true
            }
        }
        if (isStop) {
            this.billDay_dialog = false
        } else {
            this.$notify({
                title: "提示",
                message: "请核对账单日是否正确！",
                type: "warning",
                duration: 2000
            });
            return
            this.billDay_dialog = true
        }
    },

    // 保存 产品
    saveProInfo () {
        if (this.step3_proInfoObj.directDebitStatus == '1') {
            if (!this.step3_proInfoObj.directDebitMode 
            || !this.step3_proInfoObj.directDebitBankNo
            || !this.step3_proInfoObj.directDebitAccountNo
            || !this.step3_proInfoObj.exchangePaymentFlag ) {
                this.$message({
                    title: "提示",
                    message: "请填写还款信息",
                    type: "warning",
                    duration: 2000
                });
                return
            }
        }
        if (this.step3_proInfoObj.budgetOrgCode) {
            this.budgetOrgCodeStr = this.step3_proInfoObj.budgetOrgCode
        } else {
            this.budgetOrgCodeStr = ''
        }
        let params = {
            businessProgramNoCycleDaysList : this.billDayData
        }
        params = Object.assign(params, this.step3_proInfoObj, this.curChoosedPro, this.cstInfoObj)
        this.post("/nonfi/nonfinanceService/BSS.AD.01.0002", params, (res) => {
            if (res.returnCode == "000000") {
                this.$notify({
                    title: "Success",
                    message: "保存产品成功",
                    type: "success",
                    duration: 2000,
                });
                this.defalutChoosedProObj = res.returnData.rows[0]
                this.media_havedProList() // 媒介中 已有产品列表
                this.isSetPrcieFun() // 进入标签模块或者进入媒介模块
                this.newProObj = res.returnData.rows[0];
                this.step5_mediaInfoObj.mainCustomerNo = this.cstInfoObj.customerNo
            }
        });
    },
    // 是否设置标签
    isSetPrcieFun() {
        if (this.step3_proInfoObj.isSetPrice == '1') { // 设定标签
            // 进入标签模块
            this.proEstDiv = false // 2产品建立模块
            this.priceLabelSetDiv = true // 3定价标签设置模块
            this.getHavedPriceList() // 查询已有标签
            this.getPriceList() // 查询标签列表
        } else if (this.step3_proInfoObj.isSetPrice == '0') { // 不设定标签
            // 进入媒介信息模块
            this.proEstDiv = false // 2产品建立模块
            this.priceLabelSetDiv = false // 3定价标签设置模块
            this.mediaInfoEstDiv = true // 4媒介信息建立模块
            this.media_havedProList()// 刷新已有产品列表
        }
    },
    // 查询已有标签
    getHavedPriceList() {
        this.havedPrice_config.loading = true;
        let params = {
            idType : this.cstInfoObj.idType,
			idNumber : this.cstInfoObj.idNumber,
            flag : "3",
            isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_priceArea','dic_priceModel'],//查找数据字典所需参数
			transDict : ['pricingType','pricingMethod'],
        }
        params = Object.assign(params, this.havedPrice_config )
        this.post("/nonfi/nonfinanceService/BSS.IQ.01.0095", params, (res) => {
            if (res.returnCode == "000000") {
                this.havedPrice_config.loading = false;
                if (res.returnData && res.returnData.rows && res.returnData.rows.lengh > 0 ) {
                    this.havedPriceData = res.returnData.rows;
                    this.havedPrice_config.total = res.returnData.totalCount;
                } else {
                    this.havedPriceData = [];
                    this.havedPrice_config.total = 0

                }
            } 
        }, (err) => {
            if(err) {
                this.havedPriceData = []
                this.havedPrice_config.total = 0
                this.havedPrice_config.loading = false;
            }
        })
    },
    // 查询标签列表
    getPriceList() {
        this.price_config.loading = true;
        let params = {
            pcdNo : "8%,9%",
            idType : this.cstInfoObj.idType,
			idNumber : this.cstInfoObj.idNumber,
            isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_priceArea','dic_priceModel'],//查找数据字典所需参数
			transDict : ['pricingType','pricingMethod'],
        }
        params = Object.assign(params, this.priceLabelForm, this.price_config )
        this.post("/beta/betaService/COS.IQ.02.0019", params, (res) => {
            if (res.returnCode == "000000") {
                this.price_config.loading = false;
                if (res.returnData && res.returnData.rows && res.returnData.rows.lengh > 0) {
                    this.priceData = res.returnData.rows;
                    this.price_config.total = res.returnData.totalCount;
                } else {
                    this.priceData = [];
                    this.price_config.total = 0
                }  
            }
        }, (err) => {
            if(err) {
                this.priceData = []
                this.price_config.total = 0
                this.price_config.loading = false;
            }
        })
    },
    
    // 定价标签 搜索按钮
    handleSearchPrice() {
        this.getPriceList();
    },
    // 定价标签 关联按钮
    relatedPrice() {
        this.relatedPriceData = this.price_multipleSelection
    },
    // 已关联标签
    // getRelatedPriceList() {
    //     this.relatedPrice_config.loading = true;
    //     let params = {
    //         pcdNo : "8%,9%",
    //         idType : this.cstInfoObj.idType,
	// 		idNumber : this.cstInfoObj.idNumber,
    //         isTrans: true,//是否需要翻译数据字典
	// 		transParams : ['dic_priceArea','dic_priceModel'],//查找数据字典所需参数
	// 		transDict : ['pricingType','pricingMethod'],
    //     }
    //     params = Object.assign(params, this.price_config )
    //     this.post("/beta/betaService/COS.IQ.02.0019", params, (res) => {
    //         if (res.returnCode == "000000") {
    //             this.relatedPriceData = rows;
    //             this.relatedPrice_config.total = res.returnData.totalCount;
    //         }else {
    //             this.relatedPriceData = [];
    //         }
    //     });
    // },
    // 定价标签 查询按钮
    hadlePriceDetail(row) {
        this.priceLabelDetail_dialog = true
        this.priceLabelObj = Object.assign({}, row)
    },
    // 已关联定价标签 设置按钮
    hadlePriceSet(row , index) {
        this.setPrice_index = index
        this.priceSetObj = Object.assign({}, row)
        if (this.priceSetObj.instanDimen1 == 'MODG' ||
            this.priceSetObj.instanDimen2 == 'MODG' ||
            this.priceSetObj.instanDimen3 == 'MODG' ||
            this.priceSetObj.instanDimen4 == 'MODG' ||
            this.priceSetObj.instanDimen5 == 'MODG' ) {
            this.pricingLevelOptions = []
            this.pricingLevelOptions.push({
                detailDesc: '业务项目级',
                codes: 'G'
            })
        } else if (this.priceSetObj.instanDimen1 == 'MODT' ||
            this.priceSetObj.instanDimen2 == 'MODT' ||
            this.priceSetObj.instanDimen3 == 'MODT' ||
            this.priceSetObj.instanDimen4 == 'MODT' ||
            this.priceSetObj.instanDimen5 == 'MODT' ) {
            this.pricingLevelOptions = []
            this.pricingLevelOptions.push({
                detailDesc: '业务类型级',
                codes: 'T'
            })
        } else if (this.priceSetObj.instanDimen1 == 'MODP' ||
            this.priceSetObj.instanDimen2 == 'MODP' ||
            this.priceSetObj.instanDimen3 == 'MODP' ||
            this.priceSetObj.instanDimen4 == 'MODP' ||
            this.priceSetObj.instanDimen5 == 'MODP' ) {
            this.pricingLevelOptions = []
            this.pricingLevelOptions.push({
                detailDesc: '产品对象级',
                codes: 'P'
            })
        } else if (this.priceSetObj.instanDimen1 == 'MODM' ||
            this.priceSetObj.instanDimen2 == 'MODM' ||
            this.priceSetObj.instanDimen3 == 'MODM' ||
            this.priceSetObj.instanDimen4 == 'MODM' ||
            this.priceSetObj.instanDimen5 == 'MODM' ) {
            this.pricingLevelOptions = []
            this.pricingLevelOptions.push({
                detailDesc: '媒介级',
                codes: 'M'
            })
        } 
        this.priceSet_dialog = true
    },
    // 确定 设置标签
    sureSetPrice() {
        this.$set(this.price_multipleSelection[this.setPrice_index], 'custTagEffectiveDate', this.priceSetObj.custTagEffectiveDate)
        this.$set(this.price_multipleSelection[this.setPrice_index], 'custTagExpirationDate', this.priceSetObj.custTagExpirationDate)
        this.$set(this.price_multipleSelection[this.setPrice_index], 'pricingLevel', this.priceSetObj.pricingLevel)
        this.$set(this.price_multipleSelection[this.setPrice_index], 'pricingLevelCode', this.priceSetObj.pricingLevelCode)
        this.priceSet_dialog = false
    },

    // 联动 定价层级
    pricingLevelChange(val) {
        console.log(val)
        let params = {
            idType: this.cstInfoObj.idType,
            idNumber : this.cstInfoObj.idNumber,
        }
        if (val == 'C') {
            this.getSelectDict('/nonfi/nonfinanceService/BSS.IQ.01.0005', params ).then((res) => {
                res.forEach(item => {
                    item.label = item.customerNo+' '+item.customerName
                    item.value = item.customerNo
                })
                this.pricingLevelCodeOptions = res
            })
        } else if (val == 'G') {
            this.getSelectDict('/nonfi/nonfinanceService/BSS.IQ.01.0020', params ).then((res) => {
                res.forEach(item => {
                    item.label = item.businessProgramNo+' '+item.programDesc
                    item.value = item.businessProgramNo
                })
                this.pricingLevelCodeOptions = res
            })

        } else if (val == 'P') {
            this.getSelectDict('/nonfi/nonfinanceService/BSS.IQ.01.0114', params ).then((res) => {
                res.forEach(item => {
                    item.label = item.productObjectCode+' '+item.productDesc
                    item.value = item.productObjectCode
                })
                this.pricingLevelCodeOptions = res
            })

        } else if (val == 'T') {
            this.post('/nonfi/nonfinanceService/BSS.IQ.01.0020', params, (res) =>{
                if (res.returnCode == '000000') {
                    let operationMode , busArray = []
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        let rows = res.returnData.rows
                        rows.forEach(item => {
                            operationMode = item.operationMode
                            busArray.push(item.businessProgramNo)
                        })
                        this.getSelectDict('/beta/betaService/COS.IQ.02.0033', {operationMode:operationMode, busList:busArray } ).then((res) => {
                            res.forEach(item => {
                                item.label = item.businessTypeCode+' '+item.businessDesc
                                item.value = item.businessTypeCode
                            })
                            this.pricingLevelCodeOptions = res
                        })
                    }
                }
            })
        } else if (val == 'M') {
            this.getSelectDict('/nonfi/nonfinanceService/BSS.IQ.01.0017', params ).then((res) => {
                res.forEach(item => {
                    item.label =item.mediaUnitCode+' '+item.externalIdentificationNo
                    item.value = item.mediaUnitCode
                })
                this.pricingLevelCodeOptions = res
            })

        }
    },
    // 已关联定价标签 删除按钮
    hadlePriceDelete(row, index) {
        this.relatedPriceData.splice(index,1)
    },
    
    // 定价标签 多选
    price_handleSelectionChange(val){
        console.log(val)
        this.price_multipleSelection  = val
    },
    // 开始时间改变事件
    changeStart() {
        this.pickerOptionsEnd = Object.assign({}, this.pickerOptionsEnd, {
            disabledDate: (time) => {
                return time.getTime() < new Date(this.priceSetObj.custTagEffectiveDate).getTime()
            }
        })
    },
    // 结束时间改变事件
    changeEnd() {
        this.pickerOptionsStart = Object.assign({}, this.pickerOptionsStart, {
            disabledDate: (time) => {
                return time.getTime() > new Date(this.priceSetObj.custTagExpirationDate).getTime()
            }
        })
    },
    // 定价标签 上一步 返回产品
    backTo3() {
        this.proEstDiv = true
        this.priceLabelSetDiv = false
        this.cstInfoObj.idType = this.cstInfoObj.idType
        this.cstInfoObj.idNumber = this.cstInfoObj.idNumber
        this.getHavedPriceList()
        this.getPriceList()
    },
    // 定价标签 下一步 进入媒介模块
    nextTo5() {
        this.priceLabelSetDiv = false
        this.mediaInfoEstDiv = true
        this.priceDateFlag = true // 关联的定价标签 日期必输
        for (let i= 0 ; i < this.relatedPriceData.length; i++) {
            if ( !this.relatedPriceData[i].custTagEffectiveDate || 
                !this.relatedPriceData[i].custTagExpirationDate) {
                this.$message({
                    title: '提示',
                    message: '请检查定价标签日期，不能为空!',
                    type: 'warning',
                    duration: 2000
                })
                this.priceDateFlag = false;
				break;
            }
        }
        if (!this.priceDateFlag) {
            return
        }
        let params = {
            customerNo: this.cstInfoObj.customerNo,
            pcdNo: '8%,9%',
            coreCustomerBusinessTypeList: this.relatedPriceData,
            addFlag: '2',
            idNumber: this.cstInfoObj.idNumber ,
            idType: this.cstInfoObj.idType,
        }
        this.post('/nonfi/nonfinanceService/BSS.AD.01.0010', params ).then((res) => {
            if (res.returnCode == '000000') {
                this.$notify({
                    title: 'Success',
                    message: '保存成功',
                    type: 'success',
                    duration: 2000
                })
                this.priceLabelSetDiv = false
                this.mediaInfoEstDiv = true
                this.relatedPriceData = []
            }
        })
    },


    // 媒介模块 start 
    // 媒介中 查询已有产品
     // 选择已有产品 选中产品 调用函数
    media_chooseHavedPro(row) {
        this.media_curChoosedPro = row
         // 根据产品 查询卡版面
        //  this.getSelectDict('/beta/betaService/COS.IQ.02.0055', {
        //     productObjectCode : row.productObjectCode,
        //     operationMode : row.operationMode,
        // }).then((res) => {
        //     this.formatCodeOptions = res
        // })
        let params = {
            productObjectCode : row.productObjectCode,
            operationMode : row.operationMode,
        }
        this.post('/beta/betaService/COS.IQ.02.0055', params, (res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.formatCodeOptions = res.returnData.rows
                } else {
                    this.formatCodeOptions = []

                }
            }
        })
        // 查询是否支持自动配号
        let params1 = {
            productObjectCode : row.productObjectCode,
            operationMode : row.operationMode,
            idNumber : this.cstInfoObj.idNumber,
            idType : this.cstInfoObj.idType
        }
        this.isSupportDiv = false;
        this.custNicknameDiv = false
		this.inputDiv = false
        // 查询是否支持自动配号
        this.post('/nonfi/nonfinanceService/BSS.IQ.01.0014', params1, (res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    if (res.returnData.rows[0].flagl) {
                        this.isSupportDiv = true;
                        this.matcheFlag = res.returnData.rows[0].flagl;
                        if (res.returnData.rows[0].flagl == '1') {
                            this.isSupportDiv = true;
                            this.step5_mediaInfoObj.isSupport = '1';
                        } else if (res.returnData.rows[0].flagl == '2') {
                            this.isSupportDiv = false;
                            this.step5_mediaInfoObj.isSupport = '2';
                        } else if (res.returnData.rows[0].flagl == '3') {
                            this.step5_mediaInfoObj.isSupport = '';
                            this.isSupportDiv = true;
                        }
                    } else {
                        this.isSupportDiv = false;
                    }
                    // $rootScope.productObj = item;
                } else {
                    this.isSupportDiv = false // 是否支持自动配号
                    this.custNicknameDiv = false // 客户靓号
		            this.inputDiv = false  // 手动输入
                }
            }
        })

    },
    media_handleCurrentHavedProChange(row) {
        this.media_curChoosedProRadio = row.productObjectCode
        this.media_curChoosedPro = row
    },
    // 媒介模块 查询已有产品
    media_havedProList() {
        this.mediaHavedPro_config.loading = true
        let params = {
            idNumber: this.cstInfoObj.idNumber,
            idType:  this.cstInfoObj.idType,
        }
        params = Object.assign(params, this.mediaHavedPro_config)
        this.post('/nonfi/nonfinanceService/BSS.IQ.01.0004', params, (res) => {
            if (res.returnCode == '000000') {
                this.mediaHavedPro_config.loading = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.mediaHavedPro_config.total = res.returnData.totalCount
                    this.media_havedProData = res.returnData.rows
                    // 进入媒介后， 默认选中产品
                    console.log(this.defalutChoosedProObj)
                    if (this.defalutChoosedProObj) {

                        console.log(this.media_havedProData)
                        this.media_havedProData.forEach(item => {
                            if (item.productObjectCode == this.defalutChoosedProObj.productObjectCode) {
                                this.media_curChoosedProRadio = item.productObjectCode // 默认选中产品
                            }
                            // 根据产品 查询卡版面
                            this.getSelectDict('/beta/betaService/COS.IQ.02.0055', {
                                productObjectCode : item.productObjectCode,
                                operationMode : item.operationMode,
                            }).then((res) => {
                                this.formatCodeOptions = res
                            })
                        })
                    }
                } else {
                    this.media_havedProData = []
                }
            }
        })
    },
    // 刻印名 大写
    changeUpWord(val) {
        this.step5_mediaInfoObj.embosserName1 = uppercaseAllWord (val)
        this.dpan_mediaInfoObj.embosserName1 = uppercaseAllWord (val)
    } ,
    // 主附标识 联动
    mainAndSubChange(val){
        if (val === '1') { // 主卡
            this.showSubCustomerNo = false
            this.step5_mediaInfoObj.subCustomerNo = ''
            this.showSubCardCstInfo = false
            this.subCardSearch = {}
        } else if (val === '2') { // 附属卡
            this.subCard_dialog = true // 附属卡弹窗
            this.showSubCustomerNo = true
        }
    },
    // 附属卡 搜索按钮
    subCard_searchBtn() {
        let _this = this
        sessionStorage.setItem('newCstBuildFlag',1)
        this.post('/nonfi/nonfinanceService/BSS.IQ.01.0001', this.subCardSearch, (res) => {
            if (res.returnCode == '000000') {
                this.showSubCardCstInfo = true
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                    let data = res.returnData.rows[0]
                    _this.subCard_cstInfoObj.customerName = data.customerName // 客户名称
                    _this.subCard_cstInfoObj.customerNo = data.customerNo // 客户号
                    _this.subCard_cstInfoObj.idNumber = data.idNumber // 客户id 号码
                    _this.subCard_cstInfoObj.idType = data.idType // 客户id Type
                    _this.subCard_cstInfoObj.mobilePhone = data.mobilePhone // 客户手机号
                    _this.isHaveSubFlag = 1
                    sessionStorage.removeItem('newCstBuildFlag') // 删除客户新建标记

                }
            } else if(res.returnCode == 'CUS-00014'){
                _this.isHaveSubFlag = 0
                this.showSubCardCstInfo = false
                sessionStorage.removeItem('newCstBuildFlag') // 删除客户新建标记
                this.$message({
                    title: '提示',
                    message: '客户不存在，点击确定建立新客户！',
                    type: 'warning',
                    duration: 2000
                })
            } else { // 报错
                _this.isHaveSubFlag = 0
                this.showSubCardCstInfo = false
                sessionStorage.removeItem('newCstBuildFlag') // 删除客户新建标记
            }
        })
    },
    // 附属卡 重置按钮
    subCard_resetBtn() {
        this.subCardObj.idNumber = ''
        this.subCardObj.idType = ''
        this.showSubCardCstInfo = false
    },
    // 附属卡 确定按钮
    sureSubCard() {
        if (!this.media_curChoosedPro) { // 客户已有产品是否选择
            this.$message({
                title: '提示',
                message: '请选择已有产品',
                type: 'warning',
                duration: 2000
            })
            return
        }
        if (!this.isHaveSubFlag) { // 无附属卡
            let subCardObj = {
                idType: this.subCardSearch.idType,
                idNumber: this.subCardSearch.idNumber
            }
            let json = JSON.stringify(subCardObj)
            // 附属卡建立 缓存附属卡证件信息
            window.sessionStorage.setItem('SUBCARDID', json)
            // 附属卡建立 缓存媒介信息
            this.step5_mediaInfoObj.idType = this.cstInfoObj.idType
            this.step5_mediaInfoObj.idNumber = this.cstInfoObj.idNumber
            this.step5_mediaInfoObj.customerName = this.cstInfoObj.customerName
            this.step5_mediaInfoObj.mobilePhone = this.cstInfoObj.mobilePhone
            window.sessionStorage.setItem('mediaBaseInfo', JSON.stringify(this.step5_mediaInfoObj)) 
            this.subCard_dialog = false
            this.$router.push({ path: '/cstSvc/setSubCard' })

        } else { // 有附属卡
            this.step5_mediaInfoObj.mainCustomerNo = this.subCard_cstInfoObj.customerNo
            this.step5_mediaInfoObj.subCustomerNo = this.cstInfoObj.customerNo
            this.subCard_dialog = false
        }


    },

    // 附属卡跳转过来 信息
    subCardInit() {
        let _this = this
        let subCardFlag = window.sessionStorage.getItem('subCardFlag')
        let subCustomerNo = window.sessionStorage.getItem('subCustomerNo')

        let mediaBaseInfo = JSON.parse(window.sessionStorage.getItem('mediaBaseInfo'))  // 原媒介信息
        if (subCardFlag) { // 附属卡跳转过来
            let params = {
                idType: mediaBaseInfo.idType,
                idNumber: mediaBaseInfo.idNumber,
            }
            this.post('/nonfi/nonfinanceService/BSS.IQ.01.0001', params, (res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                        let data = res.returnData.rows[0]
                        _this.cstInfoObj.customerName = data.customerName // 客户名称
                        _this.cstInfoObj.customerNo = data.customerNo // 客户号
                        _this.cstInfoObj.idNumber = data.idNumber // 客户id 号码
                        _this.cstInfoObj.idType = data.idType // 客户id Type
                        _this.cstInfoObj.mobilePhone = data.mobilePhone // 客户手机号
                        this.step5_mediaInfoObj = mediaBaseInfo

                        this.showSearchDiv = true // 搜索模块
                        this.cstBaseEstDiv = false // 1客户基本资料模块
                        this.feeItemDiv = false // 2 收费项目模块
                        this.proEstDiv = false // 2产品建立模块
                        this.priceLabelSetDiv = false // 3定价标签设置模块
                        this.mediaInfoEstDiv = true // 4媒介信息建立模块
                        this.mediaDPANDiv = false // 5已有媒介申请DPAN模块
                        this.resultInfoDiv = false // 6最终客户信息模块

                        this.showSubCardCstInfo = true
                        this.step5_mediaInfoObj.subCustomerNo = subCustomerNo
                    }

                } else {
                    _this.cstInfoObj = {}
                }
            })
            this.step5_mediaInfoObj.subCustomerNo = subCustomerNo
            window.sessionStorage.removeItem('subCardFlag') // 清除附属卡跳转标识
        }
    },

    // 媒介对象代码 联动制卡信息
    getRiskLimits(val) {
        if (val == 'MODM00001') {
            this.step5_mediaInfoObj.requestCardMaking = '1'
            this.isShowFormatCode = true
        } else if (val == 'MODM00002') {
            this.step5_mediaInfoObj.requestCardMaking = '1'
            this.isShowFormatCode = true
        } else if (val == 'MODM00003') {
            this.step5_mediaInfoObj.requestCardMaking = '1'
            this.isShowFormatCode = true
        } else if (val == 'MODM00010') {
            this.step5_mediaInfoObj.requestCardMaking = ''
            this.step5_mediaInfoObj.formatCode = ''
            this.isShowFormatCode = false
        } else {
            this.step5_mediaInfoObj.requestCardMaking = ''
            this.step5_mediaInfoObj.formatCode = ''
            this.isShowFormatCode = false
        }
    },
    // 是否配置靓号 单选联动
    isSupportChange(val) {
        console.log(val)
        this.step5_mediaInfoObj.externalIdentificationNoIn = '';
        if (this.matcheFlag == '1') {// 支持配置靓号
            if (this.step5_mediaInfoObj.isSupport == '1') {// 必须选择支持配置靓号
                this.atuoMatcheFun(this.media_curChoosedPro);
            } else {
                this.$message({
                    title: '提示',
                    message: '请选择支持配置靓号',
                    type: 'warning',
                    duration: 2000
                })
                return
            }
        } else if (this.matcheFlag == '2') {// 不显示弹窗,自动配号
            this.custNicknameDiv = false;
            this.inputDiv = false;
            if (this.step5_mediaInfoObj.isSupport == '1') {
                this.$message({
                    title: '提示',
                    message: '抱歉，不支持配置靓号！',
                    type: 'warning',
                    duration: 2000
                })
                this.step5_mediaInfoObj.isSupport = '2';
            }
        } else if (this.matcheFlag == '3') {// 可以选择
            if (this.step5_mediaInfoObj.isSupport == '1') {// 配置靓号
                this.atuoMatcheFun(this.media_curChoosedPro);
                this.inputDiv = false;
            } else if (this.step5_mediaInfoObj.isSupport == '2') {// 随机生成
                this.custNicknameDiv = false;// 客户靓号div
                this.inputDiv = false;
                return;
            } else if (this.step5_mediaInfoObj.isSupport == '3') {// 手工输入
                this.custNicknameDiv = false;// 客户靓号div
                this.inputDiv = true;
            }
        }
    },
    // 配置靓号弹窗
    atuoMatcheFun(params) {
        this.setNum_dialogForm = true
        this.setNumObj.cardBin = params.binNo
        // 特殊号码段号
        this.post('/beta/betaService/COS.IQ.02.0045', {
            cardBin: params.binNo,
            criticalFlag : 'N'
        }, (res) => {
            if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                this.segmentNumberOptions = res.returnData.rows
            } else {
                this.segmentNumberOptions = []
            }
        })
    },
    // 配置靓号中 查询按钮
    setNumSearch() {
        this.$refs['setNumRef'].validate((valid) => {
            if (valid) {
                this.showSpcialNumTable2 = false
                this.setNum_getSpecialNumlist() // 特殊号段信息表
            }
        })
    },
    // 特殊号段信息表
    setNum_getSpecialNumlist() {
        this.setNum_config.loading = true
        let params = {
            cardBin: this.setNumObj.cardBin,
            corporationEntityNo: this.longinInfoObj.corporationEntityNo,
            segmentNumber: this.setNumObj.segmentNumber
        }
        this.setNum_config = Object.assign(this.setNum_config , params)
        this.getTableList("/beta/betaService/COS.IQ.02.0059", this.setNum_config, res => {
            if (res.returnCode == "000000") {
                this.setNum_config.loading = false;
                this.showSpcialNumTable = true
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.spcailNum_tableData = res.returnData.rows;
                    this.setNum_config.total = res.returnData.totalCount;
                } else {
                    this.spcailNum_tableData = [];
                     this.setNum_config.total = 0
                }
            }
        }, (err) => {
            if(err) {
                this.spcailNum_tableData = []
                this.setNum_config.total = 0
                this.setNum_config.loading = false
            }
        })
    },
    // 查询特殊号
    querySpcialNum(row) {
        this.showSpcialNumTable2 = true
        this.spcailNum_tableData2 = []
        this.setNum_getSpecialNumInfolist(row)
    },
    // 特殊号信息表
    setNum_getSpecialNumInfolist(row) {
        this.setNum_config2.loading = true
        let params = {
            cardBin: this.setNumObj.cardBin,
            corporationEntityNo: this.longinInfoObj.corporationEntityNo,
            segmentNumber: row.segmentNumber
        }
        this.setNum_config2 = Object.assign(this.setNum_config2, params)
        this.getTableList("/beta/betaService/COS.IQ.02.0060", this.setNum_config2, res => {
            if (res.returnCode == "000000") {
                this.setNum_config2.loading = false;
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    let rows = res.returnData.rows
                    rows.forEach(element => {
                        element.cardNumberStr =  '*********'+element.cardNumber.substr( 9, element.cardNumber.split('').length)
                    })
                    this.spcailNum_tableData2 = rows
                    this.setNum_config2.total = res.returnData.totalCount
                } else {
                    this.spcailNum_tableData2 = [];
                    this.setNum_config2.total = 0
                }
            }
        }, (err) => {
            if(err) {
                this.spcailNum_tableData2 = [];
                this.setNum_config2.total = 0
                this.setNum_config2.loading = false;
            }
        })
    },
    // 配置靓号中 重置按钮
    setNumReset() {
        this.setNumObj.segmentNumber = ''
        this.showSpcialNumTable = false
        this.showSpcialNumTable2 = false
    },
    // 关闭 配置靓号弹窗
    setNum_close() {
        this.setNum_dialogForm = false
        this.setNumObj = {}
        this.setNumObj.segmentNumber = ''
        this.showSpcialNumTable = false
        this.showSpcialNumTable2 = false
    },
    // 特殊号段信息表
    spcailNumSection_handleCurrRowChange(row) {
        this.spcailNum_curRow = row
    },
    // 特殊号段信息表
    spcailNumSection_chooseCurrRow(row){
        this.spcailNum_curRowRadio = row.segmentNumber
    },
    //特殊号信息
    spcailNum_handleCurrRowChang(row) {
        this.spcailNum_curRow2 = row
    },
    //特殊号信息
    spcailNum_chooseCurrRow(row) {
        this.spcailNum_curRowRadio2 = row.cardNumber
    },
    // 确定配置靓号
    sureMatcheNum() {
        if(!this.spcailNum_curRow){
            this.$message({
                title: '提示',
                message: '请选中一条记录',
                type: 'warning',
                duration: 2000
            })
            return;
        }
        if(!this.spcailNum_curRow2){
            this.$message({
                title: '提示',
                message: '请选中一条记录',
                type: 'warning',
                duration: 2000
            })
            return;
        }
        // 初始化 弹窗
        this.setNum_dialogForm = false
        this.showCustNicknameDiv = true
        this.setNumObj = {}
        this.showSpcialNumTable = false
        this.showSpcialNumTable2 = false
        // 客户靓号
        this.custNicknameDiv = true
        this.step5_mediaInfoObj.externalIdentificationNoIn = this.spcailNum_curRow2.cardNumber
    },
    //  保存媒介
    saveMediaInfo() {
         // 是否支持自动配号
        if (this.matcheFlag == '1') {// 支持配置靓号
            if (this.step5_mediaInfoObj.isSupport == '2') {
                this.$message({
                    title: '提示',
                    message: '请选择配置靓号！',
                    type: 'warning',
                    duration: 2000
                })
                return;
            }
        } 
        if (this.matcheFlag == '2') {// 自动配号
            if (this.step5_mediaInfoObj.isSupport == '1') {
                this.$message({
                    title: '提示',
                    message: '抱歉，不支持配置靓号！',
                    type: 'warning',
                    duration: 2000
                })
                return;
            }
        } 
        if (this.matcheFlag == '3') {// 自己选
        }
        // 卡板代码不能为空
        if (this.step5_mediaInfoObj.mediaObjectCode == "MODM00001" || 
        this.step5_mediaInfoObj.mediaObjectCode == "MODM00002") {
            if (!this.step5_mediaInfoObj.formatCode) {
                this.$message({
                    title: '提示',
                    message: '卡板代码不能为空',
                    type: 'warning',
                    duration: 2000
                })
                return;
            }
        }
        // 请填写副客户代码！
        if (this.step5_mediaInfoObj.mainAttachment == 2) {
            if (!this.step5_mediaInfoObj.subCustomerNo) {
                this.$message({
                    title: '提示',
                    message: '请填写副客户代码！',
                    type: 'warning',
                    duration: 2000
                })
                return;
            }
        }
        // 媒介模块 没有选择产品
        if (!this.media_curChoosedPro) {
            this.$message({
                title: '提示',
                message: '请至少选中一条记录',
                type: 'warning',
                duration: 2000
            })
            return;
        }
        this.$refs['step5_mediaInfoRef'].validate((valid) => {
            if (valid) {
                let params = {
                        mainCustomerCode: this.step5_mediaInfoObj.mainCustomerNo,
                        idType: this.cstInfoObj.idType,
                        idNumber: this.cstInfoObj.idNumber
                    }
                if (this.budgetOrgCodeStr) {
                    params.budgetOrgCode = this.budgetOrgCodeStr
                }
                params = Object.assign(params, this.media_curChoosedPro, this.step5_mediaInfoObj,this.curChoosedPro)
                this.post("/nonfi/nonfinanceService/BSS.AD.01.0003", params, res => {
                    if (res.returnCode == "000000") {
                        if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                            this.$notify({
                                message: '媒介信息建立成功！',
                                type: 'success',
                            })
                            // 制卡成功，显示客户基本信息
                            this.cstBaseEstDiv = false // 1客户基本资料模块
                            this.feeItemDiv = false // 2 收费项目模块
                            this.proEstDiv = false // 3产品建立模块
                            this.priceLabelSetDiv = false // 4定价标签设置模块
                            this.mediaInfoEstDiv = false // 5媒介信息建立模块
                            this.mediaDPANDiv = false // 6已有媒介申请DPAN模块
                            this.resultInfoDiv = true // 7最终客户信息模块 
                            this.resultInfoObj = res.returnData.rows[0]
                            this.resultInfoObj.customerName = this.cstInfoObj.customerName
                            // 初始化
                            this.cstInfoObj = {} // 客户基本信息
                            this.cstBaseInfoForm = {} // 客户信息建立对象
                            this.addressObjList = []; // 地址信息列表
                            this.step3_proInfoObj = {} // 产品建立对象
                            this.step5_mediaInfoObj = {} // 媒介建立对象
                        } 
                    }
                });
            }
        })
    },


    // dpan模块
    // 查询媒介列表
    dpan_havedMediaList() {
        this.dpan_havedMediaConfig.loading = true
        let params = {
            idType : this.cstInfoObj.idType,
            idNumber : this.cstInfoObj.idNumber,
            flag : '3',
            isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_mainCharacterCardTable','dic_invalidFlagYN'],//查找数据字典所需参数
			transDict : ['mainSupplyIndicator','invalidFlag'],//翻译前后key
        }
        params = Object.assign(params, this.dpan_havedMediaConfig )
        this.getTableList("/nonfi/nonfinanceService/BSS.IQ.01.0017", params, res => {
            if (res.returnCode == "000000") {
                this.dpan_havedMediaConfig.loading = false;
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.dpan_havedMediaData = res.returnData.rows
                    this.dpan_havedMediaConfig.total = res.returnData.totalCount
                } else {
                    this.dpan_havedMediaData = [];
                    this.dpan_havedMediaConfig.total = 0
                }
            }
        }, (err) => {
            if(err) {
                this.dpan_havedMediaData = [];
                this.dpan_havedMediaConfig.total = 0
                this.dpan_havedMediaConfig.loading = false;
            }
        })
    },
    // 查询媒介列表 选中事件
    dpan_chooseHavedMedia(val) {
        this.dpan_choosedMediaObj = val
        this.dpan_choosedMediaRadio = val.mediaUnitCode
        media_curChoosedProRadio
        // 选中媒介 渲染媒介信息
        this.dpan_mediaInfoObj = val
        this.dpan_mediaInfoDiv = true
    },
    // 查询媒介列表 改变选中事件
    dpan_handleCurrentHavedMediaChange(val) {
        this.dpan_choosedMediaObj = val
        // 选中媒介 渲染媒介信息
        this.dpan_mediaInfoObj = val
        this.dpan_mediaInfoDiv = true
    },
    // dpan 保存按钮
    dpan_hadleSave () {
        if (!this.dpan_choosedMediaObj) {
            this.$message({
                title: '提示',
                message: '请选中一条记录',
                type: 'warning',
                duration: 2000
            })
            return
        }
        let params = {
            idType: this.cstInfoObj.idType,
            idNumber: this.cstInfoObj.idNumber,
            deviceNumber: this.dpan_mediaInfoObj.deviceNumber,
            invalidReason: 'DPAN',
        }
        params = Object.assign(params , this.dpan_mediaInfoObj,this.curChoosedPro )
        this.post('/nonfi/nonfinanceService/BSS.AD.01.0003', params,(res) => {
            if (res.returnCode == '000000') {
                this.$notify({
                    message: '媒介信息建立成功',
                    type: 'success',
                })

                this.mediaDPANDiv = false
                this.resultInfoDiv = true
                if (res.returnData && res.returnData.rows &&  res.returnData.rows.length > 0) {
                    this.resultInfoObj =  res.returnData.rows[0]
                } else {
                    this.resultInfoObj = {}
                }
                // 初始化
                this.cstInfoObj = {} // 客户基本信息
                this.cstBaseInfoForm = {} // 客户信息建立对象
                this.addressObjList = []; // 地址信息列表
                this.step3_proInfoObj = {} // 产品建立对象
                this.step5_mediaInfoObj = {} // 媒介建立对象
                this.dpan_mediaInfoObj = {} // dpan媒介信息
            }
        })
    },
  },

}
</script>

<style>
</style>

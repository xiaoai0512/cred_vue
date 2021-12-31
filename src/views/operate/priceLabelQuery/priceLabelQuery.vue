<!-- 定价标签 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="运营模式" prop="operationMode" >
                <el-select v-model="queryFormObj.operationMode" class="wd300" >
                <el-option
                    v-for="(item, index ) in operationModeOptions"
                    :key="index"
                    :label="item.modeName"
                    :value="item.operationMode"/>
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="定价标签" prop="pricingTag">
                <el-input v-model="queryFormObj.pricingTag" class="wd300" type="text" />
            </el-form-item>
            <el-form-item class="cl_td" label="定价类型" prop="pricingObject">
                <el-select  v-model="queryFormObj.pricingObject" class="wd300" @change="getProChange($event)" clearable placeholder="请选择">
                <el-option
                    v-for="(item, index ) in pricingObjectOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.codes" readonly />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="定价对象" prop="pricingObjectCode" >
                <el-select v-model="queryFormObj.pricingObjectCode" class="wd300" @change="getRefresh()" clearable placeholder="请选择">
                    <el-option
                        v-for="(item, index ) in pricingObjectShowOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.val" />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="定价区域" prop="pricingType" >
                <el-select v-model="queryFormObj.pricingType" class="wd300" clearable placeholder="请选择">
                    <el-option
                        v-for="(item, index ) in pricingTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes" />
                </el-select>
            </el-form-item>
            <!-- <el-form-item class="cl_td" label="币种" prop="pricingCurrencyCode">
                <el-select v-model="queryFormObj.pricingCurrencyCode" class="wd300" clearable placeholder="请选择">
                    <el-option
                        v-for="(item, index ) in priceLabelItemOptions"
                        :key="index"
                        :label="item.currencyDesc"
                        :value="item.currencyCode" />
                </el-select>
            </el-form-item> -->
            <!--<el-form-item class="cl_td" label="业务项目代码" prop="businessProgramNo">
                <el-input v-model="queryFormObj.businessProgramNo" class="wd300" type="text" />
            </el-form-item>-->
            <div class="cl_tr text_center">
                <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" >查询</el-button>
                <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate" >新增</el-button>
            </div>
        </el-form>
        
        <!--列表-->
        <el-table v-loading = "listLoading1" :data="tableList" border stripe style="width: 100%">
            <el-table-column prop="operationMode" label="运营模式" width="180" align="center">
                <template slot-scope="scope">
                    <!--<span v-if="scope.row.nodeTyp=='AP'">账户生命周期</span>-->
                    <span class="">{{scope.row.operationMode}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="pricingTag" label="定价标签" width="180" align="center">
                <template slot-scope="scope">
                    <span class="">{{scope.row.pricingTag}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="pricingDesc" label="描述" align="center">
                <template slot-scope="scope">
                    <span class="">{{scope.row.pricingDesc}}</span>
                </template>
            </el-table-column>
            <el-table-column prop="pricingType" label="定价区域" width="180" align="center">
                <template slot-scope="scope">
                    <span class="" v-if='scope.row.pricingType=="A"'>A-活动</span>
                    <span class="" v-if='scope.row.pricingType=="D"'>D-差异化</span>
                    <span class="" v-if='scope.row.pricingType=="P"'>P-个性化</span>
                    <span class="" v-if='scope.row.pricingType=="V"'>V-动态定价</span> 
                </template>
            </el-table-column>
            <el-table-column prop="pricingMethod" label="定价方式" align="center">
                <template slot-scope="scope">
                    <span class="" v-if='scope.row.pricingMethod=="A"'>A-调整</span>
                    <span class="" v-if='scope.row.pricingMethod=="C"'>C-取优</span>
                    <span class="" v-if='scope.row.pricingMethod=="I"'>I-继承</span>
                    <span class="" v-if='scope.row.pricingMethod=="O"'>O-覆盖</span>
                </template>
            </el-table-column>
            <el-table-column align="center" label="查询" >
                <template slot-scope="scope">
                <el-button size="mini" icon="el-icon-more" type="primary" @click="handleDetail(scope.row)">详情</el-button>
                <el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleUpdate(scope.row)">修改</el-button>
                <!-- <el-button size="mini" icon="el-icon-document-copy"   type="primary" @click="handleCopy(scope.row)" v-show="updBtnFlag" >复制</el-button> -->
                </template> 
            </el-table-column>
        </el-table>
        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
        <!-- 查询 定价标签详细信息-->
        <el-dialog title="定价标签详细信息" :visible.sync="dialogFormVisibleDetail" width="80%">
            <el-form ref="dataFormDetail"  :model="tempDetail" label-position="right" label-width="160px" style="display: inline-block;">
                <el-form-item label="运营模式 " prop="operationMode" class="cl_td">
                    <el-select v-model="tempDetail.operationMode" class="filter-item wd300" placeholder="请选择" clearable disabled>
                        <el-option v-for="(item, index ) in operationModeOptions" :key="index" :label="item.modeName" :value="item.operationMode"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="定价标签" prop="pricingTag">
                    <el-input v-model="tempDetail.pricingTag" class="wd300" type="text" readonly disabled/>
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="pricingDesc">
                    <el-input v-model="tempDetail.pricingDesc" class="wd300" type="text" readonly disabled/>
                </el-form-item>
                <el-form-item label="定价区域" prop="pricingType" class=" cl_td">
                    <el-select v-model="tempDetail.pricingType" class="wd300" disabled>
                      <el-option
                        v-for="(item, index ) in pricingTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="定价类型" prop="pricingObject" class="cl_td">
                    <el-select v-model="tempDetail.pricingObject" class="filter-item wd300" placeholder="请选择" clearable disabled >
                        <el-option v-for="(item, index) in pricingObjectOptions" :key="index" :label="item.detailDesc" :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item label="定价对象" prop="pricingObjectCode" class="cl_td">
                    <el-select v-model="tempDetail.pricingObjectCode" class="filter-item wd300" placeholder="请选择" clearable disabled>
                        <el-option v-for="(item, index) in pricingObjectShowOptions" :key="index" :label="item.label" :value="item.val" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="优先级" prop="performOrder">
                    <el-input v-model="tempDetail.performOrder" class="wd300" type="text" readonly disabled/>
                </el-form-item>
                <el-form-item label="定价方式" prop="pricingMethod" class="cl_td">
                    <el-select v-model="tempDetail.pricingMethod" class="filter-item wd300" placeholder="请选择" clearable disabled>
                        <el-option v-for="(item, index) in pricingMethodOptions" :key="index" :label="item.detailDesc" :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item label="取值类型" prop="pcdType" class="cl_td">
                    <el-select v-model="tempDetail.pcdType" class="filter-item wd300" placeholder="请选择" clearable disabled>
                        <el-option v-for="(item, index) in pcdTypeOptions" :key="index" :label="item.detailDesc" :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="取值" prop="pcdValue">
                    <el-input v-model="tempDetail.pcdValue" class="wd300" type="text" readonly disabled/>
                </el-form-item>
                <el-form-item class="cl_td" label="取值小数位" prop="pcdPoint">
                    <el-input v-model="tempDetail.pcdPoint" class="wd300" type="text" readonly disabled/>
                </el-form-item>
                <el-form-item class="cl_td" label="附卡基准年费" prop="supplementBaseFee" v-if="tempDetail.pricingObject == 'FIT'">
                    <el-input v-model="tempDetail.supplementBaseFee" class="wd300" type="text" readonly disabled/>
                </el-form-item>
                <!-- <el-form-item label="币种" prop="pricingCurrencyCode" class="cl_td">
                    <el-select v-model="tempDetail.pricingCurrencyCode" class="filter-item wd300" placeholder="请选择" clearable disabled>
                        <el-option v-for="(item, index) in priceLabelItemOptions" :key="index" :label="item.currencyDesc" :value="item.currencyCode" />
                    </el-select>
                </el-form-item> -->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleDetail = false">关闭</el-button>
               <!-- <el-button type="primary" @click="confirmAdd()">确定</el-button>-->
            </div>
        </el-dialog>
        <!--修改定价标签信息-->
        <el-dialog title="修改定价标签信息" :visible.sync="dialogFormVisibleUp" width="85%">
            <el-form ref="dataFormUp" :model="tempUp" label-position="right" label-width="160px" style="display: inline-block;">
                <el-form-item label="运营模式 " prop="operationMode" class="cl_td">
                    <el-select v-model="tempUp.operationMode" class="filter-item wd300" placeholder="请选择" clearable disabled>
                        <el-option v-for="(item, index ) in operationModeOptions" :key="index" :label="item.modeName" :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="定价标签" prop="pricingTag">
                    <el-input v-model="tempUp.pricingTag" class="wd300" type="text" readonly disabled/>
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="pricingDesc">
                    <el-input v-model="tempUp.pricingDesc" class="wd300" type="text"/>
                </el-form-item>
                <el-form-item label="定价区域" prop="pricingType" class=" cl_td">
                    <el-select v-model="tempUp.pricingType" class="wd300">
                        <el-option
                            v-for="(item, index ) in pricingTypeOptions"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="定价类型" prop="pricingObject">
                <el-select  v-model="tempUp.pricingObject" class="wd300" @change="getProChange($event)" disabled>
                <el-option
                    v-for="(item, index ) in pricingObjectOptions"
                    :key="index"
                    :label="item.detailDesc"
                    :value="item.codes" readonly />
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="定价对象" prop="pricingObjectCode" >
                <el-select v-model="tempUp.pricingObjectCode" class="wd300" clearable  disabled>
                    <el-option
                        v-for="(item, index ) in pricingObjectShowOptions"
                        :key="index"
                        :label="item.label"
                        :value="item.val" readonly />
                </el-select>
            </el-form-item>
                <el-form-item class="cl_td" label="优先级" prop="performOrder" >
                    <el-input v-model="tempUp.performOrder" class="wd300" type="text" style="width:110px !important;"/>
                    <el-button size="medium" icon="el-icon-search" type="primary" @click="prioritySearch()" >查询</el-button>
                </el-form-item>
                <el-form-item label="定价方式" prop="pricingMethod" class="cl_td">
                    <el-select v-model="tempUp.pricingMethod" class="filter-item wd300" placeholder="请选择" clearable>
                        <el-option v-for="(item, index) in pricingMethodOptions" :key="index" :label="item.detailDesc" :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item label="取值类型" prop="pcdType" class="cl_td">
                    <el-select v-model="tempUp.pcdType" class="filter-item wd300" placeholder="请选择" clearable >
                        <el-option v-for="(item, index) in pcdTypeOptions" :key="index" :label="item.detailDesc" :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="取值" prop="pcdValue">
                    <el-input v-model="tempUp.pcdValue" class="wd300" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="取值小数位" prop="pcdPoint">
                    <el-input v-model="tempUp.pcdPoint" class="wd300" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="附卡基准年费" prop="supplementBaseFee">
                    <el-input v-model="tempUp.supplementBaseFee" class="wd300" type="text" />
                </el-form-item>
                <!-- <el-form-item label="币种" prop="currencyDesc" class="cl_td">
                    <el-select v-model="tempUp.currencyDesc" class="filter-item wd300" placeholder="请选择" clearable>
                        <el-option v-for="(item, index) in priceLabelItemOptions" :key="index" :label="item.currencyDesc" :value="item.currencyCode" />
                    </el-select>
                </el-form-item> -->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleUp = false">关闭</el-button>
                <el-button type="primary" @click="updateData()">确定</el-button>
            </div>
        </el-dialog>
       <el-dialog title="定价标签详细信息" :visible.sync="dialogFormVisibleUpSearch">
            <el-form ref="dataForm"  :model="pricingItem" label-position="right" label-width="160px" style="display: inline-block;">
                <el-form-item class="cl_td" label="定价标签" prop="pricingObjectCode">
                    <el-input v-model="pricingItem.pricingObjectCode" class="wd300" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="pricingDesc">
                    <el-input v-model="pricingItem.pricingDesc" class="wd300" type="text"  />
                </el-form-item>
                <div  class="col_tr text_center">
                    <el-button size="medium" icon="el-icon-search" type="primary" @click="searchInfo()">查询</el-button>
                    <el-button size="medium" icon="el-icon-refresh" type="primary" @click="priority_reset()">重置</el-button>
                </div>
            </el-form>
            <el-table :data="pricingListSearch" border stripe style="width: 100%">
                <el-table-column prop="pricingObjectCode" label="定价标签" width="180" align="center">
                    <template slot-scope="scope">
                        <span class="">{{scope.row.pricingObjectCode}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="pricingObjectCode" label="定价对象+描述" align="center">
                    <template slot-scope="scope">
                        <span class="">{{scope.row.pricingObjectCode}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="pricingDesc" label="描述" align="center">
                    <template slot-scope="scope">
                        <span class="">{{scope.row.pricingDesc}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="performOrder" label="优先级" align="center">
                    <template slot-scope="scope">
                        <span class="">{{scope.row.performOrder}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="tablesTotal>0" :total="tablesTotal" :page.sync="pricingItem.pageNum" :limit.sync="pricingItem.pageSize" @pagination="prioritySearch" />
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleUpSearch = false">关闭</el-button>
            </div>
        </el-dialog>
        <!--新增定价标签信息-->
        <el-dialog title="定价标签详细信息" :visible.sync="dialogFormVisibleAdd" width="80%">
            <el-form ref="dataFormAdd" :model="tempAdd" label-position="right" label-width="160px" style="display: inline-block;">
                <el-form-item label="运营模式 " prop="operationMode" class="cl_td" :rules="[ { required: true, message: '运营模式不能为空'} ]">
                    <el-select v-model="tempAdd.operationMode" class="filter-item wd300" placeholder="请选择">
                        <el-option v-for="(item, index ) in operationModeOptions" 
                            :key="index" :label="item.modeName" :value="item.operationMode"/>
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="定价标签" prop="pricingTag" :rules="[ { required: true, message: '定价标签不能为空'} ]" >
                    <el-input v-model="tempAdd.pricingTag" class="wd300" type="text"/>
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="pricingDesc" :rules="[ { required: true, message: '描述不能为空'} ]">
                    <el-input v-model="tempAdd.pricingDesc" class="wd300" type="text"/>
                </el-form-item>
                <el-form-item label="定价区域" prop="pricingType" class=" cl_td" :rules="[ { required: true, message: '定价区域不能为空'} ]">
                    <el-select v-model="tempAdd.pricingType" class="wd300">
                      <el-option
                        v-for="(item, index ) in pricingTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="定价类型" prop="pricingObject" class="cl_td" :rules="[ { required: true, message: '定价类型不能为空'} ]">
                    <el-select v-model="tempAdd.pricingObject" class="filter-item wd300" placeholder="请选择" @change="getProChange($event)">
                        <el-option v-for="(item, index) in pricingObjectOptions" 
                            :key="index" :label="item.detailDesc" :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item label="定价对象" prop="pricingObjectCode" class="cl_td" :rules="[ { required: true, message: '定价对象不能为空'} ]">
                    <el-select v-model="tempAdd.pricingObjectCode" class="filter-item wd300" placeholder="请选择" @change="getRefresh()">
                        <el-option v-for="(item, index) in pricingObjectShowOptions" :key="index" :label="item.label" :value="item.val" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="优先级" prop="performOrder" :rules="[ { required: true, message: '优先级不能为空'} ]">
                    <el-input v-model="tempAdd.performOrder" class="wd300" type="text" style="width:110px !important;"/>
                    <el-button size="medium" icon="el-icon-search" type="primary" @click="prioritySearch()" >查询</el-button>
                </el-form-item>
                <el-form-item label="定价方式" prop="pricingMethod" class="cl_td" :rules="[ { required: true, message: '定价方式不能为空'} ]">
                    <el-select v-model="tempAdd.pricingMethod" class="filter-item wd300" placeholder="请选择" clearable>
                        <el-option v-for="(item, index) in pricingMethodOptions" :key="index" :label="item.detailDesc" :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item label="取值类型" prop="pcdType" class="cl_td" :rules="[ { required: true, message: '取值类型不能为空'} ]">
                    <el-select v-model="tempAdd.pcdType" class="filter-item wd300" placeholder="请选择" clearable >
                        <el-option v-for="(item, index) in pcdTypeOptions" :key="index" :label="item.detailDesc" :value="item.codes" />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" label="取值" prop="pcdValue">
                    <el-input v-model="tempAdd.pcdValue" class="wd300" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="取值小数位" prop="pcdPoint">
                    <el-input v-model="tempAdd.pcdPoint" class="wd300" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" v-if="tempAdd.pricingObject=='FIT'" label="附卡基准年费" prop="supplementBaseFee">
                    <el-input v-model="tempAdd.supplementBaseFee" class="wd300" type="text" />
                </el-form-item>
                <!-- <el-form-item label="币种" prop="currencyCode" class="cl_td">
                    <el-select v-model="tempAdd.currencyCode" class="filter-item wd300" placeholder="请选择" clearable>
                        <el-option v-for="(item, index) in priceLabelItemOptions" :key="index" :label="item.currencyDesc" :value="item.currencyCode" />
                    </el-select>
                </el-form-item> -->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleAdd = false">关闭</el-button>
                <el-button type="primary" @click="createData()">确定</el-button>
            </div>
        </el-dialog>
        <el-dialog title="定价标签优先级信息" :visible.sync="dialogFormVisibleUpSearch">
            <el-form ref="dataForm"  :model="pricingItem" label-position="right" label-width="160px" style="display: inline-block;">
                <el-form-item class="cl_td" label="定价标签" prop="pricingObjectCode">
                    <el-input v-model="pricingItem.pricingObjectCode" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="pricingDesc">
                    <el-input v-model="pricingItem.pricingDesc" class="wd200" type="text"  />
                </el-form-item>
            
                <div  class="col_tr text_center">
                    <el-button size="medium" icon="el-icon-search" type="primary" @click="searchInfo()">查询</el-button>
                    <el-button size="medium" icon="el-icon-refresh" type="primary" @click="priority_reset()">重置</el-button>
                </div>
            </el-form>
            <el-table :data="pricingListSearch" border stripe>
            
                <el-table-column prop="pricingObjectCode" label="定价标签" width="180" align="center">
                    <template slot-scope="scope">
                        <span class="">{{scope.row.pricingObjectCode}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="pricingObjectCode" label="定价对象+描述" align="center">
                    <template slot-scope="scope">
                        <span class="">{{scope.row.pricingObjectCode}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="pricingDesc" label="描述" align="center">
                    <template slot-scope="scope">
                        <span class="">{{scope.row.pricingDesc}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="performOrder" label="优先级" align="center">
                    <template slot-scope="scope">
                        <span class="">{{scope.row.performOrder}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="tablesTotal>0" :total="tablesTotal" :page.sync="pricingItem.pageNum" :limit.sync="pricingItem.pageSize" @pagination="prioritySearch" />
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleUpSearch = false">关闭</el-button>
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
    Pagination,
  },
  data() {
    return {
      // 权限
      selBtnFlag: false,
      addBtnFlag: false,
      updBtnFlag: false,
      btnAuthStr: '',

      // 列表
      queryFormObj: {
          pageNum: 1,
          pageSize:10,
      },
      tableTotal: 0,
      listLoading1: false,
      queryFormRef: {},
      queryFormRules: {},      
      tableList: [],
      // 增删改查
      tempAdd: {}, // 新增
      tempUp: {}, // 修改
      tempDetail: {}, // 详情
      
      dialogFormVisibleAdd: false,
      dialogFormVisibleUp: false,
      dialogFormVisibleDetail: false,
      dialogFormVisibleUpSearch: false,
      rulesAdd: {},
      rulesDetail: {},
      rulesUp: {},
        //查询下拉
        operationModeOptions: [], //运营模式
        pricingTypeOptions: [], // 定价区域
        pricingObjectOptions: [],//定价类型
        pricingObjectShowOptions: [],//定价对象
        pricingMethodOptions: [],//定价方式
        pcdTypeOptions: [],//取值类型
       // priceLabelItemOptions: [],//币种
        //查询优先级
        pricingListSearch: [],
        tablesTotal: 0,
        pricingItem: {//定价标签优先级
            pageNum: 1,
            pageSize: 10
        },
        priorityFormObjtTotal: 0,
    }
  },
    created() {
        this.getBtnAuth()
        this.getList()
        this.getSelectDict('dic_costCategory').then( (res) => {
          this.pricingObjectList = res
        })
    },
    mounted() {
        // 运营模式 
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0006").then(res => {
            this.operationModeOptions = res
        })
        //定价区域
        this.getSelectDict('dic_priceArea').then((res) => {
          this.pricingTypeOptions = res
        })
        //定价类型
        this.getSelectDict('dic_pricingType').then((res) => {
          this.pricingObjectOptions = res
        })
        /*//定价对象
        this.getSelectDict('dic_pricingType').then((res) => {
          this.pricingObjectShowOptions = res
        })*/
        //定价方式
        this.getSelectDict('dic_priceModel').then((res) => {
          this.pricingMethodOptions = res
        })
        //取值类型
        this.getSelectDict('dic_valueType').then((res) => {
          this.pcdTypeOptions = res
        })
        //币种
        // this.getSelectDict('/beta/betaService/COS.IQ.02.0012').then((res) => {
        //   this.priceLabelItemOptions = res
        //   console.log(res)
        // })
        
    },
    methods: {
        getProChange(val) {
            console.log(val)
            this.pricingObjectShowOptions = []
            // this.queryFormObj.productObjectCode = ''
           /* this.businessQuery()*/
           if(val == 'FIT'){
               this.FITQuery()
           }else if(val == 'PCD'){
                this.productQuery()
           } 
        },
        //定价对象 PCD
        productQuery(){
            this.post( "/beta/betaService/COS.IQ.02.0010", {} ,(res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        let rowss = res.returnData.rows
                        rowss.forEach(item => {
                            item.label = item.pcdNo + ' ' + item.pcdDesc
                            item.desc = item.pcdDesc
                            item.val = item.pcdNo
                        })
                        this.pricingObjectShowOptions = rowss
                    } else {
                        this.pricingObjectShowOptions = []
                    }
                }
            })
        },
         //定价对象 FIT
        FITQuery(){
            this.post( "/beta/betaService/COS.IQ.02.0031", {} ,(res) => {
                if (res.returnCode == '000000') {
                    if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                        let rowss = res.returnData.rows
                        rowss.forEach(item => {
                            item.label = item.feeItemNo + ' ' + item.feeDesc
                            item.val = item.feeItemNo
                            item.desc = item.feeDesc
                        })
                        this.pricingObjectShowOptions = rowss
                    } else {
                        this.pricingObjectShowOptions = []
                    }
                }
            })
        },
    // 查询按钮权限
    getBtnAuth() {
        console.log(window.sessionStorage.getItem('menuNo'))
        let params= {
            menuNo : window.sessionStorage.getItem('menuNo')
        }
        this.getTableList('/beta/betaService/COS.CS.01.0030', params ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.length > 0 ) {
                    res.returnData.forEach(item => {
                        this.btnAuthStr += item.eventNo+','
                    })
                    if (this.btnAuthStr.includes('COS.IQ.02.0018')) { // 查询
                        this.selBtnFlag = true
                    } else {
                        this.selBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.AD.02.0018')) { // 新增
                        this.addBtnFlag = true
                    } else {
                        this.addBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.UP.02.0018')) { // 维护
                        this.updBtnFlag = true
                    } else {
                        this.updBtnFlag = false
                    }
                }
            }
        })
    },
    // 列表
    getList() {
         // 运营模式 
        this.getSelectDict( "/beta/betaService/COS.IQ.02.0006").then(res => {
            this.operationModeOptions = res
        })
        //定价区域列表翻译
        let obj = {
            isTrans: true,
            transParams:['dic_costCategory'],
            transDict : ['pricingType']
        }
        this.listLoading1 = true
        this.getTableList('/beta/betaService/COS.IQ.02.0019', this.queryFormObj ,(res) => {
            if (res.returnCode == '000000') {
                    this.listLoading1 = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.tableList = res.returnData.rows
                    this.tableTotal = res.returnData.totalCount
                } else {
                    this.tableList = []
                    this.tableTotal = 0
                }
            }
        }, (err) => {
      		this.tableList = []
            this.tableTotal = 0
       		this.listLoading1 = false
        })
    },
    handleSearch() {
        this.queryFormObj.pageNum = 1
        this.queryFormObj.pageSize = 10
        this.getList()
    },
    getRefresh() {
        this.$forceUpdate()
    },
    //显示新增弹框
    handleCreate() {
        this.dialogFormVisibleAdd = true
        this.$nextTick(() => {
            this.$refs['dataFormAdd'].clearValidate()
        })
    }, 
    //提交新增数据
    createData() {
        this.$refs['dataFormAdd'].validate((valid) => {
        if (valid) {
            this.post('/beta/betaService/COS.AD.02.0019', this.tempAdd, (res) => {
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
    //显示详情弹框
    handleDetail(row) {
        console.log(row)
        this.dialogFormVisibleDetail = true
        this.tempDetail = Object.assign({}, row)
        this.getProChange(this.tempDetail.pricingObject)
        this.$nextTick(() => {
            this.$refs['dataFormDetail'].clearValidate()
        })
    },
    //显示修改弹框
    handleUpdate(row) {
        this.tempUp = Object.assign({}, row)
        this.dialogFormVisibleUp = true
        this.getProChange(this.tempUp.pricingObject)
        this.$nextTick(() => {
            this.$refs['dataFormUp'].clearValidate()
          })
    }, 
    //修改提交确定
    updateData() {
        this.$refs['dataFormUp'].validate((valid) => {
            if (valid) {
                this.post('/beta/betaService/COS.UP.02.0019', this.tempUp, (res) => {
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
    //查詢定价标签优先级
    prioritySearch(){
        this.dialogFormVisibleUpSearch=true;
        this.getTableList('/beta/betaService/COS.IQ.02.0019', this.pricingItem ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.pricingListSearch = res.returnData.rows
                    this.tablesTotal = res.returnData.totalCount
                    setTimeout(() => {
                        this.listLoading = false
                    }, 1.5 * 1000)
                }
            }
        })
    },
    //筛选查询定价标
    searchInfo() {
        this.pricingItem.pageNum = 1
        this.pricingItem.pageSize = 10
        this.prioritySearch()
    },
    // 查询定价标签优先级 重置
    priority_reset() {
        this.pricingItem.pricingDesc = ''
        this.pricingItem.pricingObjectCode = ''
    },
    
    }
}
</script>

<style>
</style>

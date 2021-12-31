<!-- 交易定价 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
        <el-form ref="queryFormRef" :model="queryFormObj" :rules="queryFormRules">
            <el-form-item class="cl_td" label="运营模式" prop="operationMode" >
                <el-select v-model="queryFormObj.operationMode" class="wd200" >
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode"/>
                </el-select>
            </el-form-item>
            <el-form-item class="cl_td" label="事件编号" prop="eventNo">
                <el-input v-model="queryFormObj.eventNo" class="wd200" type="text" />
            </el-form-item>
            <div class="cl_tr text_center"><!--v-show="selBtnFlag"-->
                <el-button size="medium" icon="el-icon-search" v-if="selBtnFlag" type="primary" @click="handleSearch()" >查询</el-button>
                <el-button size="medium" icon="el-icon-plus" v-if="addBtnFlag" type="primary" @click="handleCreate" >新增</el-button>
            </div>
        </el-form>
        <el-table v-loading = "listLoading1" :data="tableList" border stripe style="width: 100%">
            <el-table-column prop="operationMode" label="运营模式" width="80" align="center"/>
            <el-table-column prop="eventDesc" label="事件编号及描述" width="180" align="center"/>
           	<el-table-column prop="recogTypeDesc" label="识别类别" align="center"/>
            <el-table-column prop="targetBalanceObject" label="目标余额对象" align="center"/>
            <el-table-column prop="activityTagNo" label="PCD活动标签号" align="center"/>
            <el-table-column prop="priority" label="优先级" align="center"/>
            <el-table-column prop="statusDesc" label="状态" align="center"/>
            <el-table-column prop="startDate" label="起始时间" align="center"/>
            <el-table-column prop="endDate" label="终止时间" align="center"/>
            <el-table-column align="center" label="操作" width="200">
                <template slot-scope="{row,$index}">
                    <el-button size="mini" icon="el-icon-more" type="primary" @click="handleDetail(row,$index)" >详情</el-button>
                    <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleUpdate(row,$index)" >修改</el-button>
                    <!-- <el-button size="mini" icon="el-icon-document-copy"   type="primary" @click="handleCopy(row)" v-show="selBtnFlag">复制</el-button> -->
                </template> 
            </el-table-column>
        </el-table>
        <pagination v-show="tableTotal>0" :total="tableTotal" :page.sync="queryFormObj.pageNum" :limit.sync="queryFormObj.pageSize" @pagination="getList" />
        <!--新增-->
         <el-dialog title="交易定价新增" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="dataFormAdd"  :model="transactionAdd" >
                <el-form-item label="运营模式 " prop="operationMode" class="cl_td" :rules="[ { required: true, message: '运营模式不能为空'} ]">
                    <el-select v-model="transactionAdd.operationMode" class="wd200" >
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="事件编号"  prop="eventNo" class="cl_td" :rules="[ { required: true, message: '事件编号不能为空'} ]">
                    <el-input class="wd200 " v-model="transactionAdd.eventNo"  @focus="queryEventList" />
                </el-form-item>
                <el-form-item label="识别类别" prop="recogType" class="cl_td" :rules="[ { required: true, message: '识别类别不能为空'} ]">
                    <el-select v-model="transactionAdd.recogType" class="wd200"  >
                    <el-option
                        v-for="(item, index ) in recogTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="优先级" prop="priority" class="cl_td" :rules="[ { required: true, message: '优先级不能为空'} ]">
                    <el-input class="wd200 " v-model="transactionAdd.priority"  />
                    <el-button size="medium" icon="el-icon-search" type="primary" @click="prioritySearch()" >查询</el-button>
                </el-form-item>
                <el-form-item label="状态" prop="status" class="cl_td">
                    <el-select v-model="transactionAdd.status" class="wd200" clearable  readonly>
                    <el-option
                        v-for="(item, index ) in statusOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes" readonly />
                    </el-select>
                </el-form-item>
                <div label="" class="cl_td"></div>
                <el-form-item label="起始时间" prop="startDate" class="cl_td">
                    <div class="block " >
                        <el-date-picker class="wd200"
                          v-model="transactionAdd.startDate"
                          type="date"
                          placeholder="选择日期" value-format="yyyy-MM-dd"  >
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="终止时间" prop="endDate" class="cl_td">
                    <div class="block " >
                        <el-date-picker class="wd200"
                          v-model="transactionAdd.endDate"
                          type="date"
                          placeholder="选择日期" value-format="yyyy-MM-dd"  >
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="目标事件" prop="targetActivity" class="cl_td" >
                    <el-input class="wd200 " v-model="transactionAdd.targetActivity" />
                </el-form-item>
                 <el-form-item label="目标业务类型" prop="targetBussType" class="cl_td">
                    <el-input class="wd200 " v-model="transactionAdd.targetBussType"  />
                </el-form-item>
                <!--<div class="mainname">PCD实例</div>-->
                <el-form-item label="目标余额对象" prop="targetBalanceObject" class="cl_td" >
                    <el-input class="wd200 " v-model="transactionAdd.targetBalanceObject"  />
                </el-form-item>
                 <el-form-item label="PCD活动标签号" prop="activityTagNo" class="cl_td">
                    <el-input class="wd200 " v-model="transactionAdd.activityTagNo"  />
                </el-form-item>
                 <el-form-item label="日期条件" prop="dateCondition" class="cl_td">
                    <el-select v-model="transactionAdd.dateCondition" class="wd200" clearable  readonly>
                    <el-option
                        v-for="(item, index ) in dateConditionOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes" readonly />
                    </el-select>
                </el-form-item>
                <div  class="cl_td"></div>
                <el-form-item label="日期段1起始" prop="dateStartSegment1" class="cl_td">
                    <div class="block " >
                        <el-date-picker class="wd200"
                          v-model="transactionAdd.dateStartSegment1"
                          type="date"  value-format="yyyy-MM-dd" placeholder="选择日期"  >
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="日期段1结束" prop="dateEndSegment1" class="cl_td">
                    <div class="block " >
                        <el-date-picker class="wd200"
                          v-model="transactionAdd.dateEndSegment1"
                          type="date"  value-format="yyyy-MM-dd"
                          placeholder="选择日期"  >
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="日期段2起始" prop="dateStartSegment2" class="cl_td">
                    <div class="block " >
                        <el-date-picker class="wd200"
                          v-model="transactionAdd.dateStartSegment2"
                          type="date" value-format="yyyy-MM-dd"
                          placeholder="选择日期"  >
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="日期段2结束" prop="dateEndSegment2" class="cl_td">
                    <div class="block " >
                        <el-date-picker class="wd200"
                          v-model="transactionAdd.dateEndSegment2"
                          type="date" value-format="yyyy-MM-dd"
                          placeholder="选择日期" >
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="日期段3起始" prop="dateStartSegment3" class="cl_td">
                    <div class="block " >
                        <el-date-picker class="wd200"
                          v-model="transactionAdd.dateStartSegment3"
                          type="date" value-format="yyyy-MM-dd"
                          placeholder="选择日期" >
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="日期段3结束" prop="dateEndSegment3" class="cl_td">
                    <div class="block " >
                        <el-date-picker class="wd200"
                          v-model="transactionAdd.dateEndSegment3"
                          type="date" value-format="yyyy-MM-dd"
                          placeholder="选择日期" >
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="日期段4起始" prop="dateStartSegment4" class="cl_td">
                    <div class="block " >
                        <el-date-picker class="wd200"
                          v-model="transactionAdd.dateStartSegment4"
                          type="date" value-format="yyyy-MM-dd"
                          placeholder="选择日期" >
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="日期段4结束" prop="dateEndSegment4" class="cl_td">
                    <div class="block " >
                        <el-date-picker class="wd200"
                          v-model="transactionAdd.dateEndSegment4"
                          type="date" value-format="yyyy-MM-dd"
                          placeholder="选择日期" >
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="日期段5起始" prop="dateStartSegment5" class="cl_td">
                    <div class="block " >
                        <el-date-picker class="wd200"
                          v-model="transactionAdd.dateStartSegment5"
                          type="date" value-format="yyyy-MM-dd"
                          placeholder="选择日期">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="日期段5结束" prop="dateEndSegment5" class="cl_td">
                    <div class="block " >
                        <el-date-picker class="wd200"
                          v-model="transactionAdd.dateEndSegment5"
                          type="date" value-format="yyyy-MM-dd"
                          placeholder="选择日期"  >
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item class="cl_td" label="Mcc条件" prop="mccCondition">
                    <el-select v-model="transactionAdd.mccCondition" class="wd200" clearable  readonly>
                    <el-option
                        v-for="(item, index ) in dateConditionOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes" readonly />
                    </el-select>
                </el-form-item>
                <div  class="cl_td"></div>
                <el-form-item label="MCC段1开始" prop="mccStartSegment1" class="cl_td">
                    <el-input class="wd200 " v-model="transactionAdd.mccStartSegment1"  />
                </el-form-item>
                <el-form-item label="MCC段1结束" prop="mccEndSegment1" class="cl_td">
                    <el-input class="wd200 " v-model="transactionAdd.mccEndSegment1"  />
                </el-form-item>
                <el-form-item label="MCC段2开始" prop="mccStartSegment2" class="cl_td">
                    <el-input class="wd200 " v-model="transactionAdd.mccStartSegment2"  />
                </el-form-item>
                <el-form-item label="MCC段2结束" prop="mccEndSegment2" class="cl_td">
                    <el-input class="wd200 " v-model="transactionAdd.mccEndSegment2"  />
                </el-form-item>
                <el-form-item label="MCC段3开始" prop="mccStartSegment3" class="cl_td">
                    <el-input class="wd200 " v-model="transactionAdd.mccStartSegment3"  />
                </el-form-item>
                <el-form-item label="MCC段3结束" prop="mccEndSegment3" class="cl_td">
                    <el-input class="wd200 " v-model="transactionAdd.mccEndSegment3"  />
                </el-form-item>
                <el-form-item label="MCC段4开始" prop="mccStartSegment4" class="cl_td">
                    <el-input class="wd200 " v-model="transactionAdd.mccStartSegment4"  />
                </el-form-item>
                <el-form-item label="MCC段4结束" prop="mccEndSegment4" class="cl_td">
                    <el-input class="wd200 " v-model="transactionAdd.mccEndSegment4"  />
                </el-form-item>
                <el-form-item label="MCC段5开始" prop="mccStartSegment5" class="cl_td">
                    <el-input class="wd200 " v-model="transactionAdd.mccStartSegment5"  />
                </el-form-item>
                <el-form-item label="MCC段5结束" prop="mccEndSegmen5" class="cl_td">
                    <el-input class="wd200 " v-model="transactionAdd.mccEndSegment5"  />
                </el-form-item>
                <el-form-item class="cl_td" label="交易币种条件" prop="transCurrCodeCondition">
                     <el-select v-model="transactionAdd.transCurrCodeCondition" class="wd200" clearable  readonly>
                    <el-option
                        v-for="(item, index ) in dateConditionOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes" readonly />
                    </el-select>
                </el-form-item>
                <div  class="cl_td"></div>
                <el-form-item label="交易币种1" prop="transCurrCode1" class="cl_td">
                    <el-input class="wd200 " v-model="transactionAdd.transCurrCode1"  />
                </el-form-item>
                <el-form-item label="交易币种2" prop="transCurrCode2" class="cl_td">
                    <el-input class="wd200 " v-model="transactionAdd.transCurrCode3"  />
                </el-form-item>
                <el-form-item label="交易币种3" prop="transCurrCode3" class="cl_td">
                    <el-input class="wd200 " v-model="transactionAdd.transCurrCode3"  />
                </el-form-item>
                <el-form-item label="交易币种4" prop="transCurrCode4" class="cl_td">
                    <el-input class="wd200 " v-model="transactionAdd.transCurrCode4"  />
                </el-form-item>
                <el-form-item label="交易币种5" prop="transCurrCode5" class="cl_td">
                    <el-input class="wd200 " v-model="transactionAdd.transCurrCode5"  />
                </el-form-item>
                <div  class="cl_td"></div>
                <el-form-item class="cl_td" label="交易国家条件" prop="transCountryCondition">
                    <el-select v-model="transactionAdd.transCountryCondition" class="wd200" clearable  readonly>
                    <el-option
                        v-for="(item, index ) in dateConditionOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes" readonly />
                    </el-select>
                </el-form-item>
                <div  class="cl_td"></div>
                <el-form-item label="交易国家1" prop="transCountry1" class="cl_td">
                    <el-input class="wd200 " v-model="transactionAdd.transCountry1"  />
                </el-form-item>
                <el-form-item label="交易国家2" prop="transCountry2" class="cl_td">
                    <el-input class="wd200 " v-model="transactionAdd.transCountry2"  />
                </el-form-item>
                <el-form-item label="交易国家3" prop="transCountry3" class="cl_td">
                    <el-input class="wd200 " v-model="transactionAdd.transCountry3"  />
                </el-form-item>
                <el-form-item label="交易国家4" prop="transCountry4" class="cl_td">
                    <el-input class="wd200 " v-model="transactionAdd.transCountry4"  />
                </el-form-item>
                <el-form-item label="交易国家5" prop="transCountry5" class="cl_td">
                    <el-input class="wd200 " v-model="transactionAdd.transCountry5"  />
                </el-form-item>
                <div  class="cl_td"></div>
                <el-form-item class="cl_td" label="交易来源条件" prop="transSourceCondition">
                     <el-select v-model="transactionAdd.transSourceCondition" class="wd200" clearable  readonly>
                    <el-option
                        v-for="(item, index ) in dateConditionOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes" readonly />
                    </el-select>
                </el-form-item>
                </el-form-item>
                <div  class="cl_td"></div>
                <el-form-item label="交易来源1" prop="transSource1" class="cl_td">
                    <el-input class="wd200 " v-model="transactionAdd.transSource1"  />
                </el-form-item>
                <el-form-item label="交易来源2" prop="transSource2" class="cl_td">
                    <el-input class="wd200 " v-model="transactionAdd.transSource2"  />
                </el-form-item>
                <el-form-item label="交易来源3" prop="transSource3" class="cl_td">
                    <el-input class="wd200 " v-model="transactionAdd.transSource3"  />
                </el-form-item>
                <el-form-item label="交易来源4" prop="transSource4" class="cl_td">
                    <el-input class="wd200 " v-model="transactionAdd.transSource4"  />
                </el-form-item>
                <el-form-item label="交易来源5" prop="transSource5" class="cl_td">
                    <el-input class="wd200 " v-model="transactionAdd.transSource5"  />
                </el-form-item>
                <div  class="cl_td"></div>
                <el-form-item class="cl_td" label="商户代码条件" prop="merchantCdeCondition">
                    <el-select v-model="transactionAdd.merchantCdeCondition" class="wd200" clearable  readonly>
                    <el-option
                        v-for="(item, index ) in dateConditionOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes" readonly />
                    </el-select>
                </el-form-item>
                <div  class="cl_td"></div>
                <el-form-item label="商户代码1" prop="merchantCde1" class="cl_td">
                    <el-input class="wd200 " v-model="transactionAdd.merchantCde1" />
                </el-form-item>
                <el-form-item label="商户代码2" prop="merchantCde2" class="cl_td">
                    <el-input class="wd200 " v-model="transactionAdd.merchantCde2"  />
                </el-form-item>
                <el-form-item label="商户代码3" prop="merchantCde3" class="cl_td">
                    <el-input class="wd200 " v-model="transactionAdd.merchantCde3"  />
                </el-form-item>
                <el-form-item label="商户代码4" prop="merchantCde4" class="cl_td">
                    <el-input class="wd200 " v-model="transactionAdd.merchantCde4"  />
                </el-form-item>
                <el-form-item label="商户代码5" prop="merchantCde5" class="cl_td">
                    <el-input class="wd200 " v-model="transactionAdd.merchantCde5"  />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleAdd = false">取消</el-button>
                <el-button type="primary" @click="addData()">确定</el-button>
            </div>
        </el-dialog>   
        <!--事件编号信息-->
        <el-dialog title="事件编号详情" :visible.sync="dialogForEventSearch">
            <el-form ref="dataForm"  :model="eventTableList" label-position="right" label-width="160px" style="display: inline-block;">
                <el-form-item class="cl_td" label="事件编号" prop="pricingObjectCode">
                    <el-input v-model="eventTableList.pricingObjectCode" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" label="描述" prop="pricingDesc">
                    <el-input v-model="eventTableList.pricingDesc" class="wd200" type="text"  />
                </el-form-item>
            
                <div  class="col_tr text_center">
                    <el-button size="medium" icon="el-icon-search" type="primary" @click="eventSearchInfo()">查询</el-button>
                    <el-button size="medium" icon="el-icon-refresh" type="primary" @click="eventReset()">重置</el-button>
                </div>
            </el-form>
            <!--<el-table :data="eventDataAdd" border stripe style="width: 100%" fit highlight-current-row 
                @row-click="up_chooseTrigerEvent" @current-change="up_handleTrigerEventChange">-->
             <!--    @row-click="up_chooseTrigerEvent" 
            @current-change="up_handleTrigerEventChange"-->
            <el-table :data="eventDataAdd" class="mbtm20" fit type="selection" highlight-current-row style="width: 100%;" border>     
                <el-table-column prop="name" label="事件编号" width="180" align="center">
                    <template slot-scope="scope">
                        <span class="">{{scope.row.eventNo}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="事件描述" align="center">
                    <template slot-scope="scope">
                        <span class="">{{scope.row.eventDesc}}</span>
                    </template>
                </el-table-column>
            </el-table>
            <pagination v-show="tablesTotal02>0" :total="tablesTotal02" :page.sync="eventTableList.pageNum" :limit.sync="eventTableList.pageSize" @pagination="queryEventDataSearch" />
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogForEventSearch = false">确认</el-button>
            </div>
        </el-dialog>
        <!--详情-->
        <el-dialog title="交易定价参数详情" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail"  :model="transactionDetail" >
                <el-form-item label="运营模式 " prop="operationMode" class="cl_td" :rules="[ { required: true, message: '运营模式不能为空'} ]">
                    <el-select v-model="transactionDetail.operationMode" class="wd200"  clearable  readonly disabled>
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="事件编号" prop="eventNo" class="cl_td" :rules="[ { required: true, message: '事件编号不能为空'} ]">
                    <el-input class="wd200 " v-model="transactionDetail.eventNo" readonly/>
                </el-form-item>
                <el-form-item label="识别类别" prop="recogType" class="cl_td" :rules="[ { required: true, message: '识别类别不能为空'} ]">
                    <el-select v-model="transactionDetail.recogType" class="wd200"  clearable  readonly disabled>
                    <el-option
                        v-for="(item, index ) in recogTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="优先级" prop="priority" class="cl_td" :rules="[ { required: true, message: '优先级不能为空'} ]">
                    <el-input class="wd200 " v-model="transactionDetail.priority"  readonly/>
                </el-form-item>
                <el-form-item label="状态" prop="status" class="cl_td">
                    <el-select v-model="transactionDetail.status" class="wd200" clearable  readonly disabled>
                    <el-option
                        v-for="(item, index ) in statusOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <div label="" class="cl_td"></div>
                <el-form-item label="起始时间" prop="startDate" class="cl_td">
                    <div class="block " >
                        <el-date-picker class="wd200"
                          v-model="transactionDetail.startDate"
                          type="date"
                          placeholder="选择日期" value-format="yyyy-MM-dd HH:mm:ss" readonly>
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="终止时间" prop="endDate" class="cl_td">
                    <div class="block " >
                        <el-date-picker class="wd200"
                          v-model="transactionDetail.endDate"
                          type="date"
                          placeholder="选择日期" value-format="yyyy-MM-dd" readonly>
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="目标事件" prop="targetActivity" class="cl_td" >
                    <el-input class="wd200 " v-model="transactionDetail.targetActivity" readonly />
                </el-form-item> 
                 <el-form-item label="目标业务类型" prop="targetBussType" class="cl_td">
                    <el-input class="wd200 " v-model="transactionDetail.targetBussType"  readonly />
                </el-form-item>
                <el-form-item label="目标余额对象" prop="targetBalanceObject" class="cl_td" >
                    <el-input class="wd200 " v-model="transactionDetail.targetBalanceObject" readonly />
                </el-form-item>
                 <el-form-item label="PCD活动标签号" prop="activityTagNo" class="cl_td">
                    <el-input class="wd200 " v-model="transactionDetail.activityTagNo"  readonly />
                </el-form-item>
                 <el-form-item label="日期条件" prop="dateCondition" class="cl_td">
                    <el-select v-model="transactionDetail.dateCondition" class="wd200" clearable  readonly disabled>
                    <el-option
                        v-for="(item, index ) in dateConditionOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes" readonly disabled/>
                    </el-select>
                </el-form-item>
                <div  class="cl_td"></div>
                <el-form-item label="日期段1起始" prop="dateStartSegment1" class="cl_td">
                    <div class="block " >
                        <el-date-picker class="wd200"
                          v-model="transactionDetail.dateStartSegment1"
                          type="date"  value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择日期" readonly>
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="日期段1结束" prop="dateEndSegment1" class="cl_td">
                    <div class="block " >
                        <el-date-picker class="wd200"
                          v-model="transactionDetail.dateEndSegment1"
                          type="date"  value-format="yyyy-MM-dd HH:mm:ss"
                          placeholder="选择日期" readonly >
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="日期段2起始" prop="dateStartSegment2" class="cl_td">
                    <div class="block " >
                        <el-date-picker class="wd200"
                          v-model="transactionDetail.dateStartSegment2"
                          type="date"
                          placeholder="选择日期" readonly >
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="日期段2结束" prop="dateEndSegment2" class="cl_td">
                    <div class="block " >
                        <el-date-picker class="wd200"
                          v-model="transactionDetail.dateEndSegment2"
                          type="date"
                          placeholder="选择日期" readonly >
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="日期段3起始" prop="dateStartSegment3" class="cl_td">
                    <div class="block " >
                        <el-date-picker class="wd200"
                          v-model="transactionDetail.dateStartSegment3"
                          type="date"
                          placeholder="选择日期" readonly >
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="日期段3结束" prop="dateEndSegment3" class="cl_td">
                    <div class="block " >
                        <el-date-picker class="wd200"
                          v-model="transactionDetail.dateEndSegment3"
                          type="date"
                          placeholder="选择日期" readonly >
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="日期段4起始" prop="dateStartSegment4" class="cl_td">
                    <div class="block " >
                        <el-date-picker class="wd200"
                          v-model="transactionDetail.dateStartSegment4"
                          type="date"
                          placeholder="选择日期" readonly >
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="日期段4结束" prop="dateEndSegment4" class="cl_td">
                    <div class="block " >
                        <el-date-picker class="wd200"
                          v-model="transactionDetail.dateEndSegment4"
                          type="date"
                          placeholder="选择日期" readonly >
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="日期段5起始" prop="dateStartSegment5" class="cl_td">
                    <div class="block " >
                        <el-date-picker class="wd200"
                          v-model="transactionDetail.dateStartSegment5"
                          type="date"
                          placeholder="选择日期" readonly >
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="日期段5结束" prop="dateEndSegment5" class="cl_td">
                    <div class="block " >
                        <el-date-picker class="wd200"
                          v-model="transactionDetail.dateEndSegment5"
                          type="date"
                          placeholder="选择日期" readonly >
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item class="cl_td" label="Mcc条件" prop="mccCondition">
                    <el-select v-model="transactionDetail.mccCondition" class="wd200"  clearable  readonly disabled>
                    <el-option
                        v-for="(item, index ) in dateConditionOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes" />
                    </el-select>
                </el-form-item>
                <div  class="cl_td"></div>
                <el-form-item label="MCC段1开始" prop="mccStartSegment1" class="cl_td">
                    <el-input class="wd200 " v-model="transactionDetail.mccStartSegment1"  readonly />
                </el-form-item>
                <el-form-item label="MCC段1结束" prop="mccEndSegment1" class="cl_td">
                    <el-input class="wd200 " v-model="transactionDetail.mccEndSegment1"  readonly />
                </el-form-item>
                <el-form-item label="MCC段2开始" prop="mccStartSegment2" class="cl_td">
                    <el-input class="wd200 " v-model="transactionDetail.mccStartSegment2" readonly />
                </el-form-item>
                <el-form-item label="MCC段2结束" prop="mccEndSegment2" class="cl_td">
                    <el-input class="wd200 " v-model="transactionDetail.mccEndSegment2"  readonly />
                </el-form-item>
                <el-form-item label="MCC段3开始" prop="mccStartSegment3" class="cl_td">
                    <el-input class="wd200 " v-model="transactionDetail.mccStartSegment3"  readonly />
                </el-form-item>
                <el-form-item label="MCC段3结束" prop="mccEndSegment3" class="cl_td">
                    <el-input class="wd200 " v-model="transactionDetail.mccEndSegment3"  readonly />
                </el-form-item>
                <el-form-item label="MCC段4开始" prop="mccStartSegment4" class="cl_td">
                    <el-input class="wd200 " v-model="transactionDetail.mccStartSegment4"  readonly />
                </el-form-item>
                <el-form-item label="MCC段4结束" prop="mccEndSegment4" class="cl_td">
                    <el-input class="wd200 " v-model="transactionDetail.mccEndSegment4"  readonly />
                </el-form-item>
                <el-form-item label="MCC段5开始" prop="mccStartSegment5" class="cl_td">
                    <el-input class="wd200 " v-model="transactionDetail.mccStartSegment5"  readonly />
                </el-form-item> 
                <el-form-item label="MCC段5结束" prop="mccEndSegmen5" class="cl_td">
                    <el-input class="wd200 " v-model="transactionDetail.mccEndSegment5"  readonly />
                </el-form-item>
                <el-form-item class="cl_td" label="交易币种条件" prop="transCurrCodeCondition">
                    <el-select v-model="transactionDetail.transCurrCodeCondition" class="wd200"  clearable  readonly disabled >
                    <el-option
                        v-for="(item, index ) in dateConditionOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <div  class="cl_td"></div>
                <el-form-item label="交易币种1" prop="transCurrCode1" class="cl_td">
                    <el-input class="wd200 " v-model="transactionDetail.transCurrCode1"  readonly />
                </el-form-item>
                <el-form-item label="交易币种2" prop="transCurrCode2" class="cl_td">
                    <el-input class="wd200 " v-model="transactionDetail.transCurrCode3"  readonly />
                </el-form-item>
                <el-form-item label="交易币种3" prop="transCurrCode3" class="cl_td">
                    <el-input class="wd200 " v-model="transactionDetail.transCurrCode3" readonly />
                </el-form-item>
                <el-form-item label="交易币种4" prop="transCurrCode4" class="cl_td">
                    <el-input class="wd200 " v-model="transactionDetail.transCurrCode4"  readonly />
                </el-form-item>
                <el-form-item label="交易币种5" prop="transCurrCode5" class="cl_td">
                    <el-input class="wd200 " v-model="transactionDetail.transCurrCode5" readonly />
                </el-form-item>
                <div  class="cl_td"></div>
                <el-form-item class="cl_td" label="交易国家条件" prop="transCountryCondition">
                    <el-select v-model="transactionDetail.transCountryCondition" class="wd200"  clearable  readonly disabled>
                    <el-option
                        v-for="(item, index ) in dateConditionOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <div  class="cl_td"></div>
                <el-form-item label="交易国家1" prop="transCountry1" class="cl_td">
                    <el-input class="wd200 " v-model="transactionDetail.transCountry1"  readonly />
                </el-form-item>
                <el-form-item label="交易国家2" prop="transCountry2" class="cl_td">
                    <el-input class="wd200 " v-model="transactionDetail.transCountry2" readonly />
                </el-form-item>
                <el-form-item label="交易国家3" prop="transCountry3" class="cl_td">
                    <el-input class="wd200 " v-model="transactionDetail.transCountry3" readonly />
                </el-form-item>
                <el-form-item label="交易国家4" prop="transCountry4" class="cl_td">
                    <el-input class="wd200 " v-model="transactionDetail.transCountry4"  readonly />
                </el-form-item>
                <el-form-item label="交易国家5" prop="transCountry5" class="cl_td">
                    <el-input class="wd200 " v-model="transactionDetail.transCountry5" readonly />
                </el-form-item>
                <div  class="cl_td"></div>
                <el-form-item class="cl_td" label="交易来源条件" prop="transSourceCondition">
                    <el-select v-model="transactionDetail.transSourceCondition" class="wd200" clearable  readonly disabled>
                    <el-option
                        v-for="(item, index ) in dateConditionOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes" />
                    </el-select>
                </el-form-item>
                <div  class="cl_td"></div>
                <el-form-item label="交易来源1" prop="transSource1" class="cl_td">
                    <el-input class="wd200 " v-model="transactionDetail.transSource1" readonly />
                </el-form-item>
                <el-form-item label="交易来源2" prop="transSource2" class="cl_td">
                    <el-input class="wd200 " v-model="transactionDetail.transSource2"  readonly />
                </el-form-item>
                <el-form-item label="交易来源3" prop="transSource3" class="cl_td">
                    <el-input class="wd200 " v-model="transactionDetail.transSource3"  readonly />
                </el-form-item>
                <el-form-item label="交易来源4" prop="transSource4" class="cl_td">
                    <el-input class="wd200 " v-model="transactionDetail.transSource4"  readonly />
                </el-form-item>
                <el-form-item label="交易来源5" prop="transSource5" class="cl_td">
                    <el-input class="wd200 " v-model="transactionDetail.transSource5" readonly />
                </el-form-item>
                <div  class="cl_td"></div>
                <el-form-item class="cl_td" label="商户代码条件" prop="merchantCdeCondition">
                    <el-select v-model="transactionDetail.merchantCdeCondition" class="wd200" clearable  readonly>
                    <el-option
                        v-for="(item, index ) in dateConditionOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes" readonly />
                    </el-select>
                </el-form-item>
                <div  class="cl_td"></div>
                <el-form-item label="商户代码1" prop="merchantCde1" class="cl_td">
                    <el-input class="wd200 " v-model="transactionDetail.merchantCde1" readonly />
                </el-form-item>
                <el-form-item label="商户代码2" prop="merchantCde2" class="cl_td">
                    <el-input class="wd200 " v-model="transactionDetail.merchantCde2" readonly />
                </el-form-item>
                <el-form-item label="商户代码3" prop="merchantCde3" class="cl_td">
                    <el-input class="wd200 " v-model="transactionDetail.merchantCde3"  readonly />
                </el-form-item>
                <el-form-item label="商户代码4" prop="merchantCde4" class="cl_td">
                    <el-input class="wd200 " v-model="transactionDetail.merchantCde4"  readonly />
                </el-form-item> 
                <el-form-item label="商户代码5" prop="merchantCde5" class="cl_td">
                    <el-input class="wd200 " v-model="transactionDetail.merchantCde5" readonly />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleDetail = false">关闭</el-button>
            </div>
        </el-dialog>
        <!-- 修改 -->
        <el-dialog title="修改交易定价参数信息" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp"  :model="transactionUp" >
                <el-form-item label="运营模式 " prop="operationMode" class="cl_td" :rules="[ { required: true, message: '运营模式不能为空'} ]">
                    <el-select v-model="transactionUp.operationMode" class="wd200"  clearable  readonly disabled>
                    <el-option
                        v-for="(item, index ) in operationModeOptions"
                        :key="index"
                        :label="item.modeName"
                        :value="item.operationMode"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="事件编号" prop="eventNo" class="cl_td" :rules="[ { required: true, message: '事件编号不能为空'} ]">
                    <el-input class="wd200 " v-model="transactionUp.eventNo"  readonly/>
                </el-form-item>
                <el-form-item label="识别类别" prop="recogType" class="cl_td" :rules="[ { required: true, message: '识别类别不能为空'} ]">
                    <el-select v-model="transactionUp.recogType" class="wd200"  clearable  readonly disabled>
                    <el-option
                        v-for="(item, index ) in recogTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="优先级" prop="priority" class="cl_td" :rules="[ { required: true, message: '优先级不能为空'} ]">
                    <el-input class="wd200 " v-model="transactionUp.priority"  />
                     <el-button size="medium" icon="el-icon-search" type="primary" @click="prioritySearch()" >查询</el-button>
                </el-form-item>
                <el-form-item label="状态" prop="status" class="cl_td">
                    <el-select v-model="transactionUp.status" class="wd200" clearable  readonly>
                    <el-option
                        v-for="(item, index ) in statusOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes" readonly />
                    </el-select>
                </el-form-item>
                <div label="" class="cl_td"></div>
                <el-form-item label="起始时间" prop="startDate" class="cl_td">
                    <div class="block " >
                        <el-date-picker class="wd200"
                          v-model="transactionUp.startDate"
                          type="date"
                          placeholder="选择日期" value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="终止时间" prop="endDate" class="cl_td">
                    <div class="block " >
                        <el-date-picker class="wd200"
                          v-model="transactionUp.endDate"
                          type="date"
                          placeholder="选择日期" value-format="yyyy-MM-dd">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="目标事件" prop="targetActivity" class="cl_td" >
                    <el-input class="wd200 " v-model="transactionUp.targetActivity"  />
                </el-form-item>
                 <el-form-item label="目标业务类型" prop="targetBussType" class="cl_td">
                    <el-input class="wd200 " v-model="transactionUp.targetBussType"  />
                </el-form-item>
                <el-form-item label="目标余额对象" prop="targetBalanceObject" class="cl_td" >
                    <el-input class="wd200 " v-model="transactionUp.targetBalanceObject"  />
                </el-form-item>
                 <el-form-item label="PCD活动标签号" prop="activityTagNo" class="cl_td">
                    <el-input class="wd200 " v-model="transactionUp.activityTagNo"  />
                </el-form-item>
                 <el-form-item label="日期条件" prop="dateCondition" class="cl_td">
                   <el-select v-model="transactionUp.dateCondition" class="wd200" clearable  readonly>
                    <el-option
                        v-for="(item, index ) in dateConditionOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes" readonly />
                    </el-select>
                </el-form-item>
                <div  class="cl_td"></div>
                <el-form-item label="日期段1起始" prop="dateStartSegment1" class="cl_td">
                    <div class="block " >
                        <el-date-picker class="wd200"
                          v-model="transactionUp.dateStartSegment1"
                          type="date"  value-format="yyyy-MM-dd" placeholder="选择日期">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="日期段1结束" prop="dateEndSegment1" class="cl_td">
                    <div class="block " >
                        <el-date-picker class="wd200"
                          v-model="transactionUp.dateEndSegment1"
                          type="date"  value-format="yyyy-MM-dd"
                          placeholder="选择日期">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="日期段2起始" prop="dateStartSegment2" class="cl_td">
                    <div class="block " >
                        <el-date-picker class="wd200"
                          v-model="transactionUp.dateStartSegment2"
                          type="date" value-format="yyyy-MM-dd"
                          placeholder="选择日期">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="日期段2结束" prop="dateEndSegment2" class="cl_td">
                    <div class="block " >
                        <el-date-picker class="wd200"
                          v-model="transactionUp.dateEndSegment2"
                          type="date" value-format="yyyy-MM-dd"
                          placeholder="选择日期">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="日期段3起始" prop="dateStartSegment3" class="cl_td">
                    <div class="block " >
                        <el-date-picker class="wd200"
                          v-model="transactionUp.dateStartSegment3"
                          type="date" value-format="yyyy-MM-dd"
                          placeholder="选择日期">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="日期段3结束" prop="dateEndSegment3" class="cl_td">
                    <div class="block " >
                        <el-date-picker class="wd200"
                          v-model="transactionUp.dateEndSegment3"
                          type="date" value-format="yyyy-MM-dd"
                          placeholder="选择日期">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="日期段4起始" prop="dateStartSegment4" class="cl_td">
                    <div class="block " >
                        <el-date-picker class="wd200"
                          v-model="transactionUp.dateStartSegment4"
                          type="date" value-format="yyyy-MM-dd"
                          placeholder="选择日期">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="日期段4结束" prop="dateEndSegment4" class="cl_td">
                    <div class="block " >
                        <el-date-picker class="wd200"
                          v-model="transactionUp.dateEndSegment4"
                          type="date" value-format="yyyy-MM-dd"
                          placeholder="选择日期">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="日期段5起始" prop="dateStartSegment5" class="cl_td">
                    <div class="block " >
                        <el-date-picker class="wd200"
                          v-model="transactionUp.dateStartSegment5"
                          type="date" value-format="yyyy-MM-dd"
                          placeholder="选择日期">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item label="日期段5结束" prop="dateEndSegment5" class="cl_td">
                    <div class="block " >
                        <el-date-picker class="wd200"
                          v-model="transactionUp.dateEndSegment5"
                          type="date" value-format="yyyy-MM-dd"
                          placeholder="选择日期">
                        </el-date-picker>
                    </div>
                </el-form-item>
                <el-form-item class="cl_td" label="Mcc条件" prop="mccCondition">
                   <el-select v-model="transactionUp.mccCondition" class="wd200" clearable  readonly>
                    <el-option
                        v-for="(item, index ) in dateConditionOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes" readonly />
                    </el-select>
                </el-form-item>
                <div  class="cl_td"></div>
                <el-form-item label="MCC段1开始" prop="mccStartSegment1" class="cl_td">
                    <el-input class="wd200 " v-model="transactionUp.mccStartSegment1"  />
                </el-form-item>
                <el-form-item label="MCC段1结束" prop="mccEndSegment1" class="cl_td">
                    <el-input class="wd200 " v-model="transactionUp.mccEndSegment1"  />
                </el-form-item>
                <el-form-item label="MCC段2开始" prop="mccStartSegment2" class="cl_td">
                    <el-input class="wd200 " v-model="transactionUp.mccStartSegment2"  />
                </el-form-item>
                <el-form-item label="MCC段2结束" prop="mccEndSegment2" class="cl_td">
                    <el-input class="wd200 " v-model="transactionUp.mccEndSegment2"  />
                </el-form-item>
                <el-form-item label="MCC段3开始" prop="mccStartSegment3" class="cl_td">
                    <el-input class="wd200 " v-model="transactionUp.mccStartSegment3"  />
                </el-form-item>
                <el-form-item label="MCC段3结束" prop="mccEndSegment3" class="cl_td">
                    <el-input class="wd200 " v-model="transactionUp.mccEndSegment3"  />
                </el-form-item>
                <el-form-item label="MCC段4开始" prop="mccStartSegment4" class="cl_td">
                    <el-input class="wd200 " v-model="transactionUp.mccStartSegment4"  />
                </el-form-item>
                <el-form-item label="MCC段4结束" prop="mccEndSegment4" class="cl_td">
                    <el-input class="wd200 " v-model="transactionUp.mccEndSegment4"  />
                </el-form-item>
                <el-form-item label="MCC段5开始" prop="mccStartSegment5" class="cl_td">
                    <el-input class="wd200 " v-model="transactionUp.mccStartSegment5"  />
                </el-form-item>
                <el-form-item label="MCC段5结束" prop="mccEndSegmen5" class="cl_td">
                    <el-input class="wd200 " v-model="transactionUp.mccEndSegment5"  />
                </el-form-item>
                <el-form-item class="cl_td" label="交易币种条件" prop="transCurrCodeCondition">
                    <el-select v-model="transactionUp.transCurrCodeCondition" class="wd200" clearable  readonly>
                    <el-option
                        v-for="(item, index ) in dateConditionOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes" readonly />
                    </el-select>
                </el-form-item>
                <div  class="cl_td"></div>
                <el-form-item label="交易币种1" prop="transCurrCode1" class="cl_td">
                    <el-input class="wd200 " v-model="transactionUp.transCurrCode1"  />
                </el-form-item>
                <el-form-item label="交易币种2" prop="transCurrCode2" class="cl_td">
                    <el-input class="wd200 " v-model="transactionUp.transCurrCode3"  />
                </el-form-item>
                <el-form-item label="交易币种3" prop="transCurrCode3" class="cl_td">
                    <el-input class="wd200 " v-model="transactionUp.transCurrCode3"  />
                </el-form-item>
                <el-form-item label="交易币种4" prop="transCurrCode4" class="cl_td">
                    <el-input class="wd200 " v-model="transactionUp.transCurrCode4"  />
                </el-form-item>
                <el-form-item label="交易币种5" prop="transCurrCode5" class="cl_td">
                    <el-input class="wd200 " v-model="transactionUp.transCurrCode5"  />
                </el-form-item>
                <div  class="cl_td"></div>
                <el-form-item class="cl_td" label="交易国家条件" prop="transCountryCondition">
                    <el-select v-model="transactionUp.transCountryCondition" class="wd200" clearable  readonly>
                    <el-option
                        v-for="(item, index ) in dateConditionOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes" readonly />
                    </el-select>
                </el-form-item>
                <div  class="cl_td"></div>
                <el-form-item label="交易国家1" prop="transCountry1" class="cl_td">
                    <el-input class="wd200 " v-model="transactionUp.transCountry1"  />
                </el-form-item>
                <el-form-item label="交易国家2" prop="transCountry2" class="cl_td">
                    <el-input class="wd200 " v-model="transactionUp.transCountry2"  />
                </el-form-item>
                <el-form-item label="交易国家3" prop="transCountry3" class="cl_td">
                    <el-input class="wd200 " v-model="transactionUp.transCountry3"  />
                </el-form-item>
                <el-form-item label="交易国家4" prop="transCountry4" class="cl_td">
                    <el-input class="wd200 " v-model="transactionUp.transCountry4"  />
                </el-form-item>
                <el-form-item label="交易国家5" prop="transCountry5" class="cl_td">
                    <el-input class="wd200 " v-model="transactionUp.transCountry5"  />
                </el-form-item>
                <div  class="cl_td"></div>
                <el-form-item class="cl_td" label="交易来源条件" prop="transSourceCondition">
                    <el-select v-model="transactionUp.transSourceCondition" class="wd200" clearable  readonly>
                    <el-option
                        v-for="(item, index ) in dateConditionOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes" readonly />
                    </el-select>
                </el-form-item>
                <div  class="cl_td"></div>
                <el-form-item label="交易来源1" prop="transSource1" class="cl_td">
                    <el-input class="wd200 " v-model="transactionUp.transSource1"  />
                </el-form-item>
                <el-form-item label="交易来源2" prop="transSource2" class="cl_td">
                    <el-input class="wd200 " v-model="transactionUp.transSource2"  />
                </el-form-item>
                <el-form-item label="交易来源3" prop="transSource3" class="cl_td">
                    <el-input class="wd200 " v-model="transactionUp.transSource3"  />
                </el-form-item>
                <el-form-item label="交易来源4" prop="transSource4" class="cl_td">
                    <el-input class="wd200 " v-model="transactionUp.transSource4"  />
                </el-form-item>
                <el-form-item label="交易来源5" prop="transSource5" class="cl_td">
                    <el-input class="wd200 " v-model="transactionUp.transSource5"  />
                </el-form-item>
                <div  class="cl_td"></div>
                <el-form-item class="cl_td" label="商户代码条件" prop="merchantCdeCondition">
                    <el-select v-model="transactionUp.merchantCdeCondition" class="wd200" clearable  readonly>
                    <el-option
                        v-for="(item, index ) in dateConditionOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes" readonly />
                    </el-select>
                </el-form-item>
                <div  class="cl_td"></div>
                <el-form-item label="商户代码1" prop="merchantCde1" class="cl_td">
                    <el-input class="wd200 " v-model="transactionUp.merchantCde1"  />
                </el-form-item>
                <el-form-item label="商户代码2" prop="merchantCde2" class="cl_td">
                    <el-input class="wd200 " v-model="transactionUp.merchantCde2"  />
                </el-form-item>
                <el-form-item label="商户代码3" prop="merchantCde3" class="cl_td">
                    <el-input class="wd200 " v-model="transactionUp.merchantCde3"  />
                </el-form-item>
                <el-form-item label="商户代码4" prop="merchantCde4" class="cl_td">
                    <el-input class="wd200 " v-model="transactionUp.merchantCde4"  />
                </el-form-item>
                <el-form-item label="商户代码5" prop="merchantCde5" class="cl_td">
                    <el-input class="wd200 " v-model="transactionUp.merchantCde5"  />
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="dialogFormVisibleUp = false">取消</el-button>
                <el-button type="primary" @click="updateData()"> 确定</el-button>
            </div>
        </el-dialog>
        <!--新增&&修改查询二次参数优先级共用一个-->
        <el-dialog title="定价标签详细信息" :visible.sync="dialogFormVisibleUpSearch">
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
            <el-table :data="pricingListSearch" border stripe style="width: 100%">
                <el-table-column prop="name" label="定价标签" width="180" align="center">
                    <template slot-scope="scope">
                        <span class="">{{scope.row.pricingObjectCode}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="定价对象+描述" align="center">
                    <template slot-scope="scope">
                        <span class="">{{scope.row.pricingObjectCode}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="描述" align="center">
                    <template slot-scope="scope">
                        <span class="">{{scope.row.pricingDesc}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="address" label="优先级" align="center">
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
	      	listLoading1: false,
	      	queryFormRef: {},
	      	queryFormRules: {},      
	      	tableList: [],
	      	tableTotal: 0,
	      	// 下拉框初始化
	      	operationModeOptions: [], 
	      	statusOptions: [],
	      	dateConditionOptions: [],//日期条件
	     	// mccConditionOptions:[],//MCC
	      //	transCurrCodeConditionOptions: [],//交易币种
	      //	transCountryConditionOptions: [],//交易国家条件
	      //	transSourceConditionOptions: [],//交易来源条件
	      //	merchantCdeConditionOptions: [],//商户代码条件
	      	recogTypeOptions: [],//识别类别
	      	//新增
	      	transactionAdd: {}, 
	      	dataFormAdd: {},
	      	dialogFormVisibleAdd: false,
	      	eventDataAdd:[],
	      	//详情
	        transactionDetail: {}, // 详情
	       	dialogFormVisibleDetail: false,
	       	//修改
	        dialogFormVisibleUpSearch: false,
	        dialogFormVisibleUp: false,
	        transactionUp: {
	          	startDate: null,
	          	endDate: null,
	      	},
	        //查询优先级
	        pricingListSearch: [],
	        tablesTotal: 0,
	        pricingItem: {//定价标签优先级
	            pageNum: 1,
	            pageSize: 10
	        },
	        //查询事件编号
	        dialogForEventSearch:false,//事件编号
	       	tablesTotal02: 0,
	        eventTableList:{
	            pageNum: 1,
	            pageSize:10,
	      	},
    	}
  	},
  	created() {
  		this.getBtnAuth()
    	this.getSelectDict()
  	},
  	mounted() {
  		this.getList()
    	// 运营模式 
	    this.getSelectDict("/beta/betaService/COS.IQ.02.0006").then(res => {
	        this.operationModeOptions = res
	    })
	    //识别类别
	    this.getSelectDict("dic_recognitionCategory").then(res => {
	        this.recogTypeOptions = res
	    })
	    //状态
	    this.getSelectDict("dic_state").then(res => {
	        this.statusOptions = res
	    })
	    //日期条件
	    this.getSelectDict("dic_dateConditions").then(res => {
	        this.dateConditionOptions = res
	    })
	    //MCC
	    // this.getSelectDict("dic_dateConditions").then(res => {
	    //     this.mccConditionOptions = res
	    // })  
	    // //交易币种条件
	    // this.getSelectDict("dic_dateConditions").then(res => {
	    //     this.transCurrCodeConditionOptions = res
	    // })  
	    // //交易国家条件
	    // this.getSelectDict("dic_dateConditions").then(res => {
	    //     this.transCountryConditionOptions = res
	    // })  
	    // //交易来源条件
	    // this.getSelectDict("dic_dateConditions").then(res => {
	    //     this.transSourceConditionOptions = res
	    // })   
	    // //商户代码条件
	    // this.getSelectDict("dic_dateConditions").then(res => {
	    //     this.merchantCdeConditionOptions = res
	    // }) 
  	},
  methods: {
    // 查询按钮权限
    getBtnAuth() {
        let params= {
            menuNo : window.sessionStorage.getItem('menuNo')
        }
        this.getTableList('/beta/betaService/COS.CS.01.0030', params ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.length > 0 ) {
                    res.returnData.forEach(item => {
                        this.btnAuthStr += item.eventNo+','
                    })
                    if (this.btnAuthStr.includes('COS.IQ.02.0043')) { // 查询
                        this.selBtnFlag = true
                    } else {
                        this.selBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.AD.02.0037')) { // 新增
                        this.addBtnFlag = true
                    } else {
                        this.addBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.UP.02.0040')) { // 维护
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
        this.listLoading1 = true
        let obj = {
           	isTrans: true,//是否需要翻译数据字典
			transParams : ['dic_recognitionCategory','dic_state'],//查找数据字典所需参数
			transDict : ['recogType','status'],//翻译前后key
        }
        obj = Object.assign(this.queryFormObj, obj)
        this.getTableList('/beta/betaService/COS.IQ.02.0043', obj ,(res) => {
            if (res.returnCode == '000000') {
                this.listLoading1 = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.tableList = res.returnData.rows
                    this.tableList.forEach(item=>{
                    	item.eventDesc=item.eventNo + '' + item.eventDesc
                    })
                    this.tableTotal = res.returnData.totalCount
                }else{
                    this.tableList = []
                    this.tableTotal = 0
                }
            }
        })
    },
    handleSearch() {
        this.queryFormObj.pageNum = 1
        this.queryFormObj.pageSize = 10
        this.getList()
    },
    //新增
    handleCreate() {
        this.dialogFormVisibleAdd = true
        this.$nextTick(() => {
        this.$refs['dataFormAdd'].clearValidate()
        })
    }, 
   // 新增提交
    addData() {
         if((this.transactionAdd.startDate>this.transactionAdd.endDate) || (this.transactionAdd.dateStartSegment1>this.transactionAdd.dateEndSegment1)
        || (this.transactionAdd.dateStartSegment2>this.transactionAdd.dateEndSegment3) || (this.transactionAdd.dateStartSegment3>this.transactionAdd.dateEndSegment3)
        || (this.transactionAdd.dateStartSegment4>this.transactionAdd.dateEndSegment4) || (this.transactionAdd.dateStartSegment5>this.transactionAdd.dateEndSegment5)){
            this.msgDialog('起始时间应小于终止时间')
            return;
        }
        this.$refs['dataFormAdd'].validate((valid) => {
        if (valid) {
            this.post('/beta/betaService/COS.AD.02.0037', this.transactionAdd, (res) => {
                if (res.returnCode == '000000') {
                    this.dialogFormVisibleAdd = false
                    this.$notify({
                    message: '新增成功',
                    type: 'success',
                    })
                    this.getList()
                }
            })
        }
      })
    },  
    //事件编号显示弹框
    queryEventList() {
       this.dialogForEventSearch = true
        this.queryEventDataSearch()
    },
    //事件编号列表
    queryEventDataSearch() {
        //this.dialogForEventSearch = true
        this.getTableList('/beta/betaService/COS.IQ.02.0001', this.queryFormObj ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.eventDataAdd = res.returnData.rows
                    this.tablesTotal02 = res.returnData.totalCount
                    this.dialogForEventSearch = true
                }   
            }
        })
    },
    //详情
    handleDetail(row) {
        this.dialogFormVisibleDetail = true
        this.transactionDetail = Object.assign({}, row)
        this.$nextTick(() => {
        this.$refs['dataFormDetail'].clearValidate()
      })
    },
    //修改显示弹框
    handleUpdate(row) {
        this.transactionUp = Object.assign({}, row)
        this.dialogFormVisibleUp = true
        this.$nextTick(() => {
        this.$refs['dataFormUp'].clearValidate()
      })
    }, 
    //提交修改信息
    updateData() {
        if((this.transactionUp.startDate>this.transactionUp.endDate) || (this.transactionUp.dateStartSegment1>this.transactionUp.dateEndSegment1)
        || (this.transactionUp.dateStartSegment2>this.transactionUp.dateEndSegment3) || (this.transactionUp.dateStartSegment3>this.transactionUp.dateEndSegment3)
        || (this.transactionUp.dateStartSegment4>this.transactionUp.dateEndSegment4) || (this.transactionUp.dateStartSegment5>this.transactionUp.dateEndSegment5)){
            this.msgDialog('起始时间应小于终止时间')
            return;
        }
        this.$refs['dataFormUp'].validate((valid) => {
            if (valid) {
                this.post('/beta/betaService/COS.UP.02.0040', this.transactionUp, (res) => {
                    if (res.returnCode == '000000') {
                         this.dialogFormVisibleUp = false
                        this.$notify({
                        message: '修改成功',
                        type: 'success',
                        })
                        this.getList()
                    }
                })
            }
        })
    },
    
    //修改查詢二次参数优先级
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
        this.pricingItem.page = 1
        this.prioritySearch()
    },
    // 查询定价标签优先级 重置
    priority_reset() {
        this.pricingItem.pricingDesc = ''
        this.pricingItem.pricingObjectCode = ''
    },
    //公共弹框
    msgDialog(msgTip) {
        const msg = this.$createElement;
        this.$msgbox({
          title: '提示',
          message: msg('p', null, [
            msg('span', {
              style: 'text-align:center;display: block'}, msgTip),
          ]),
          confirmButtonText: '确定',
        }).catch(() => {

        });
    },
  }
}
</script>

<style>
</style>

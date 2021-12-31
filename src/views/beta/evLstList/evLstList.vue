<!-- 事件清单 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
    <el-form ref="eventSearchForm" :model="eventSearchForm" :rules="eventSearchFormRules">
        <el-form-item class="cl_td" :label="$t('evLstList.eventId')" prop="eventId" >
            <el-input v-model="eventSearchForm.eventId"  class="wd200" type="text" />
        </el-form-item>
        <el-form-item class="cl_td" :label="$t('evLstList.eventDesc')" prop="eventDesc" >
            <el-input v-model="eventSearchForm.eventDesc" class="wd200" type="text" />
        </el-form-item>
        <el-form-item class="cl_td" :label="$t('evLstList.feeItemNo')" prop="idType">
            <el-select v-model="eventSearchForm.feeItemNo" class="wd200" clearable >
              <el-option
                v-for="(item, index ) in feeItemNoList"
                :key="index"
                :label="item.itemNoDesc"
                :value="item.feeItemNo"
              />
            </el-select>
        </el-form-item>
        <div class="cl_tr text_center">
            <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" v-show="selBtnFlag">{{$t('search.query')}}</el-button>
            <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleAdd()" v-show="addBtnFlag">{{$t('search.add')}}</el-button>
        </div>
    </el-form>
    <el-table
        v-loading = "listLoading1"
        :data="eventList"
        class="mbtm20"
        fit
        highlight-current-row
        style="width: 100%;"
        border
      >
        <el-table-column prop="eventNo" :label="$t('evLstList.eventId')" align="center" />
        <el-table-column prop="eventDesc" :label="$t('evLstList.eventDesc')" align="center" />
        <el-table-column prop="" :label="$t('table.action')" align="center" >
            <template slot-scope="{row}">
                <el-button size="mini" icon="el-icon-edit" type="primary" @click="handleUpdate(row)" v-show="updBtnFlag">{{$t('table.edit')}}</el-button>
                <el-button size="mini" icon="el-icon-more" type="primary" @click="handleDetail(row)" v-show="selBtnFlag">{{$t('table.detail')}}</el-button>
            </template>
        </el-table-column>
      </el-table>
      <pagination v-show="eventTotal>0" :total="eventTotal" :page.sync="eventSearchForm.pageNum" :limit.sync="eventSearchForm.pageSize" @pagination="getEventList" />
        
        <!-- 新增 -->
        <el-dialog :title="$t('evLstList.table_add')" :visible.sync="dialogFormAdd" width="85%">
            <el-form ref="addEventForm" :rules="addEventRules" :model="addEventObj" >
                <el-form-item class="cl-tr" :label="$t('evLstList.eventId')" prop="eventId">
                    <el-select v-model="addEventObj.eventNo1" class="wd80" @change="eventNo1HandleChange" clearable>
                        <el-option
                          v-for="(item, index ) in eventNo1List"
                          :key="index"
                          :label="item.detailDesc"
                          :value="item.codes"
                        />
                    </el-select> .
                    <el-select v-model="addEventObj.eventNo2" class="wd100" clearable @change="eventNo1HandleChange2">
                        <el-option
                          v-for="(item, index ) in eventNo2List"
                          :key="index"
                          :label="item.detailDesc"
                          :value="item.codes"
                        />
                    </el-select> .
                    <el-input v-model="addEventObj.eventNo3" class="wd100" type="text" /> .
                    <el-input v-model="addEventObj.eventNo4" class="wd100" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.eventDesc')" prop="eventDesc">
                    <el-input v-model="addEventObj.eventDesc" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.eventType')" prop="eventType">
                    <el-select v-model="addEventObj.eventType" class="wd200" clearable>
                      <el-option
                        v-for="(item, index ) in eventTypeList"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.eventBookKeepingDirec')" prop="eventBookKeepingDirec" clearable >
                    <el-select v-model="addEventObj.eventBookKeepingDirec" class="wd200">
                      <el-option
                        v-for="(item, index ) in eventBookKeepingDirecList"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.installType')" prop="installType">
                    <el-select v-model="addEventObj.installType" class="wd200" clearable>
                      <el-option
                        v-for="(item, index ) in installTypeList"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.feeItemNo')" prop="feeItemNo">
                    <el-select v-model="addEventObj.feeItemNo" class="wd200" clearable>
                      <el-option
                        v-for="(item, index ) in feeItemNoList"
                        :key="index"
                        :label="item.itemNoDesc"
                        :value="item.feeItemNo"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.ongoingProcessFlag')" prop="ongoingProcessFlag">
                    <el-select v-model="addEventObj.ongoingProcessFlag" class="wd200" clearable>
                      <el-option
                        v-for="(item, index ) in ongoingProcessFlagList"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.authSceneCode')" prop="authSceneCode">
                    <el-select v-model="addEventObj.authSceneCode" class="wd200" clearable>
                      <el-option
                        v-for="(item, index ) in authSceneCodeList"
                        :key="index"
                        :label="item.sceneDesc"
                        :value="item.authSceneCode"
                      />
                    </el-select>
                </el-form-item> 
                <el-form-item class="cl_td" :label="$t('evLstList.cycleType')" prop="cycleType">
                    <el-select v-model="addEventObj.cycleType" class="wd200" clearable :disabled="isType">
                      <el-option
                        v-for="(item, index ) in cycleTypeList"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>  
                <el-form-item class="cl_td" :label="$t('evLstList.fundCheckCode')" prop="fundCheckCode">
                    <el-input v-model="addEventObj.fundCheckCode" class="wd200" type="text" />
                </el-form-item>
                <div v-show="isAuthShow">
                    <el-form-item class="cl_td" :label="$t('evLstList.eventBalanceObject')" prop="eventBalanceObject">
                        <el-select v-model="addEventObj.eventBalanceObject" class="wd200" clearable>
                          <el-option
                            v-for="(item, index ) in eventBalanceObjectList"
                            :key="index"
                            :label="item.objectDesc"
                            :value="item.balanceObjectCode"
                          />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="cl_td" :label="$t('evLstList.disputeFlag')" prop="disputeFlag">
                        <el-select v-model="addEventObj.disputeFlag" class="wd200" clearable>
                          <el-option
                            v-for="(item, index ) in YorN_list"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                          />
                        </el-select>
                    </el-form-item> 
                    <el-form-item class="cl_td" :label="$t('evLstList.transStastisticGroup')" prop="transStastisticGroup">
                        <el-select v-model="addEventObj.transStastisticGroup" class="wd200" clearable>
                          <el-option
                            v-for="(item, index ) in transStastisticGroupOptions"
                            :key="index"
                            :label="item.name"
                            :value="item.id"
                          />
                        </el-select>
                    </el-form-item> 
                    <el-form-item class="cl_td" :label="$t('evLstList.effectivenessCodeType')" prop="effectivenessCodeType">
                        <el-select v-model="addEventObj.effectivenessCodeType" class="wd200" clearable >
                          <el-option
                            v-for="(item, index ) in effectivenessCodeTypeList"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                          />
                        </el-select>
                    </el-form-item> 
                    <el-form-item class="cl_td" :label="$t('evLstList.sceneTriggerObject')" prop="sceneTriggerObject">
                        <el-select v-model="addEventObj.sceneTriggerObject" class="wd200" clearable >
                          <el-option
                            v-for="(item, index ) in sceneTriggerObjectList"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                          />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="cl_td" :label="$t('evLstList.effectivenessCodeScene')" prop="effectivenessCodeScene">
                        <el-select v-model="addEventObj.effectivenessCodeScene" class="wd200" clearable >
                          <el-option
                            v-for="(item, index ) in effectivenessCodeSceneList"
                            :key="index"
                            :label="item.effectivenessCodeDesc"
                            :value="item.effectivenessCodeScene"
                          />
                        </el-select>
                    </el-form-item> 
                    <el-form-item class="cl_td" :label="$t('evLstList.manualSupplementFlag')" prop="manualSupplementFlag">
                        <el-select v-model="addEventObj.manualSupplementFlag" class="wd200" clearable>
                          <el-option
                            v-for="(item, index ) in manualSupplementFlagList"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                          />
                        </el-select>
                    </el-form-item>  
                </div>
                
                <div class="text_title">{{$t('evLstList.choose_activity')}}</div>
                <el-form-item class="cl_td" :label="$t('evLstList.activityNo')" prop="activityNo">
                    <el-input v-model="eventAddActivitySearchForm.activityNo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.activityDesc')" prop="activityDesc">
                    <el-input v-model="eventAddActivitySearchForm.activityDesc" class="wd200" type="text" />
                </el-form-item>
                <div class="cl_tr text_center">
                    <el-button size="medium" icon="el-icon-search" type="primary" @click="add_activitySearch()">{{$t('search.query')}}</el-button>
                    <el-button size="medium" icon="el-icon-refresh" type="primary" @click="add_relatedHandle()">{{$t('search.related')}}</el-button>
                </div>
                <el-table
                    v-loading = "listLoading2"
                    :data="add_ActivityList"
                    class="mbtm20"
                    fit
                    highlight-current-row
                    style="width: 100%;"
                    border
                    @selection-change="add_activitySelectChange"
                >
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="activityNo" :label="$t('evLstList.activityNo')" align="center" />
                    <el-table-column prop="activityDesc" :label="$t('evLstList.activityDesc')" align="center" />
                </el-table>
                <pagination v-show="add_activityTotal>0" :total="add_activityTotal" :page.sync="eventAddActivitySearchForm.pageNum" :limit.sync="eventAddActivitySearchForm.pageSize" @pagination="getEventAddActivityList" />
                <div class="text_title">{{$t('evLstList.related_activity')}}</div>
                <el-table
                v-loading = "listLoading3"
                :data="add_activityMultipleSelection"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
                >
                    <el-table-column type="index" :label="$t('table.index')" align="center" />
                    <el-table-column prop="activityNo" :label="$t('evLstList.activityNo')" align="center" />
                    <el-table-column prop="activityDesc" :label="('evLstList.activityDesc')" align="center" />
                    <el-table-column prop="triggerNo" :label="('evLstList.triggerNo')" align="center" />
                    <el-table-column prop="triggerTypDesc" :label="('evLstList.triggerTypDesc')" align="center" />
                    <el-table-column prop="triggerEventRecogDimenDesc" :label="('avyList.triggerEventRecogDimenDesc')" align="center" />
                    <el-table-column prop="triggerEventInteractModeDesc" :label="('avyList.triggerEventInteractModeDesc')" align="center" />
                    <el-table-column :label="$t('table.up_down')" align="center">
                        <template slot-scope="{row,$index}">
                            <div class="table_arrow">
                                <a class="arrow_up" @click="exchangeSeqNoUp($index,row)"></a> <a
                                    class="arrow_down" @click="exchangeSeqNoDown($index,row)"></a>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="" :label="$t('table.action')" align="center" width="200">
                        <template slot-scope="{row,$index}">
                            <el-button size="mini" type="primary" @click="updateActivty(row,$index)" v-show="updBtnFlag">{{$t('table.edit')}}</el-button>
                            <el-button size="mini" type="primary" @click="deleteActivty(row,$index)" v-show="selBtnFlag">{{$t('table.delete')}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            
            <div slot="footer" class="dialog-footer">
              <el-button @click="addInit">
                {{$t('table.cancel')}}
              </el-button>
              <el-button type="primary" @click="createData()">
                {{$t('table.sure')}}
              </el-button>
            </div>
        </el-dialog>

        <!-- 新增事件 修改事件活动 弹窗-->
        <el-dialog class="abow_dialog" :title="$t('evLstList.eidt_event_activity')" :visible.sync="dialogFormAdd_upActivity" width="85%">
            <el-form ref="addEventForm_upActivity" :rules="addEventRules_upActivity" :model="addEventObj_upActivity" >
                <el-form-item class="cl_td" :label="$t('evLstList.activityNo')" prop="activityNo"
                :rules="[ { required: true, message: $t('evLstList.validate_activityNo')} ]">
                    <el-input v-model="addEventObj_upActivity.activityNo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.activityDesc')" prop="activityDesc">
                    <el-input v-model="addEventObj_upActivity.activityDesc" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.triggerNo')" prop="triggerNo" clearable >
                    <el-input v-model="addEventObj_upActivity.triggerNo" class="wd200" type="text" @focus="choseEventAdd" />
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.triggerTyp')" prop="triggerTyp">
                    <el-select v-model="addEventObj_upActivity.triggerTyp" class="wd200" clearable>
                      <el-option
                        v-for="(item, index ) in triggerTypOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.triggerEventRecogDimen')" prop="triggerEventRecogDimen">
                    <el-select v-model="addEventObj_upActivity.triggerEventRecogDimen" class="wd200" clearable>
                      <el-option
                        v-for="(item, index ) in triggerEventRecogDimenOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.triggerEventInteractMode')" prop="triggerEventInteractMode">
                    <el-select v-model="addEventObj_upActivity.triggerEventInteractMode" class="wd200" clearable>
                      <el-option
                        v-for="(item, index ) in triggerEventInteractModeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.accountingUseFlag')" prop="accountingUseFlag">
                    <el-select v-model="addEventObj_upActivity.accountingUseFlag" class="wd200" clearable>
                      <el-option
                        v-for="(item, index ) in accountingUseFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item> 
            </el-form>
            
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormAdd_upActivity = false">
                {{$t('table.cancel')}}
              </el-button>
              <el-button type="primary" @click="up_eventActivity()">
                {{$t('table.sure')}}
              </el-button>
            </div>
        </el-dialog>

        <!-- 新增事件 选择触发事件 弹窗 -->
        <el-dialog class="abow_dialog" :title="$t('evLstList.choose_trigger_event')" :visible.sync="dialogFormAdd_choseEventAdd" width="85%">
            <el-form ref="addEventForm_choseEventAdd" :rules="addEventRules_choseEventAdd" :model="addEventObj_choseEventAdd" >
                <el-form-item class="cl_td" :label="$t('evLstList.eventId')" prop="eventId">
                    <el-input v-model="addEventObj_choseEventAdd.eventId" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.eventDesc')" prop="eventDesc">
                    <el-input v-model="addEventObj_choseEventAdd.eventDesc" class="wd200" type="text" />
                </el-form-item>
                <div class="cl_tr text_center">
                    <el-button size="medium" icon="el-icon-search" type="primary" @click="add_hadleQueryEvent()">查询</el-button>
                    <el-button size="medium" icon="el-icon-refresh" type="primary" @click="add_resetEvent()">{{$t('search.reset')}}</el-button>
                </div>
            </el-form>
            <!-- @row-click="chooseTrigerEvent" -->
            <el-table
            v-loading = "listLoading3"
            :data="addEventObj_choseEventAddList"
            class="mbtm20"
            fit
            highlight-current-row
            style="width: 100%;"
            @row-click="chooseTrigerEvent" 
            @current-change="handleTrigerEventChange"
            border
            >   
                <el-table-column width="55">
                    <template slot-scope="scope">
                    <el-radio v-model="trigerEventNo" :label="scope.row.eventNo">
                        <span class="el-radio__:label"></span>
                    </el-radio>
                    </template>
                </el-table-column>
                <el-table-column prop="eventNo" :label="$t('evLstList.eventNo')" align="center" />
                <el-table-column prop="eventDesc" :label="$t('evLstList.eventDesc')" align="center" />
            </el-table>
            <pagination v-show="addEventObj_choseEventTotal>0" :total="addEventObj_choseEventTotal" :page.sync="addEventObj_choseEventAdd.pageNum" :limit.sync="addEventObj_choseEventAdd.pageSize" @pagination="getTrigerEventList" />
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormAdd_choseEventAdd = false">
                {{$t('table.cancel')}}
              </el-button>
              <el-button type="primary" @click="eventAdd_sureChoseEvent()">
                {{$t('table.sure')}}
              </el-button>
            </div>
        </el-dialog>
    
        <!-- 事件新增结束 -->

        <!-- 事件详情 -->
        <el-dialog class="abow_dialog" :title="$t('evLstList.event_detail')" :visible.sync="dialogFormDetail" width="85%">
            <div class="text_title">{{$t('evLstList.base_info')}}</div>
            <el-form ref="detailEventForm" :rules="detailEventRules" :model="detailEventObj" >
                <el-form-item class="cl_td" :label="$t('evLstList.eventNo')" prop="eventNo">
                    <el-input v-model="detailEventObj.eventNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.eventDesc')" prop="eventDesc">
                    <el-input v-model="detailEventObj.eventDesc" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.eventType')" prop="eventType">
                    <el-select v-model="detailEventObj.eventType" class="wd200" clearable disabled>
                      <el-option
                        v-for="(item, index ) in eventTypeList"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.eventBookKeepingDirec')" prop="eventBookKeepingDirec"  >
                    <el-select v-model="detailEventObj.eventBookKeepingDirec" class="wd200" clearable disabled>
                      <el-option
                        v-for="(item, index ) in eventBookKeepingDirecList"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.transIdentificationCode')" prop="transIdentificationCode">
                    <el-select v-model="detailEventObj.transIdentificationCode" class="wd200" clearable disabled>
                      <el-option
                        v-for="(item, index ) in transIdentificationCodeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.eventBalanceType')" prop="eventBalanceType">
                    <el-select v-model="detailEventObj.eventBalanceType" class="wd200" clearable disabled>
                      <el-option
                        v-for="(item, index ) in eventBalanceTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.transType')" prop="transType">
                    <el-select v-model="detailEventObj.transType" class="wd200" clearable disabled>
                      <el-option
                        v-for="(item, index ) in transTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.installType')" prop="installType">
                    <el-select v-model="detailEventObj.installType" class="wd200" clearable disabled>
                      <el-option
                        v-for="(item, index ) in installTypeList"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.paymentType')" prop="paymentType">
                    <el-select v-model="detailEventObj.paymentType" class="wd200" clearable disabled>
                      <el-option
                        v-for="(item, index ) in paymentTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.feeItemNo')" prop="feeItemNo">
                    <el-select v-model="detailEventObj.feeItemNo" class="wd200" clearable disabled>
                      <el-option
                        v-for="(item, index ) in feeItemNoList"
                        :key="index"
                        :label="item.itemNoDesc"
                        :value="item.feeItemNo"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.ongoingProcessFlag')" prop="ongoingProcessFlag">
                    <el-select v-model="detailEventObj.ongoingProcessFlag" class="wd200" clearable disabled>
                      <el-option
                        v-for="(item, index ) in ongoingProcessFlagList"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.authSceneCode')" prop="authSceneCode"> 
                    <el-input v-model="detailEventObj.authSceneCode" class="wd200" type="text"/>
                </el-form-item> 
                <el-form-item class="cl_td" :label="$t('evLstList.cycleType')" prop="cycleType">
                    <el-select v-model="detailEventObj.cycleType" class="wd200" clearable disabled>
                      <el-option
                        v-for="(item, index ) in cycleTypeList"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>  
                <el-form-item class="cl_td" :label="$t('evLstList.fundCheckCode')" prop="fundCheckCode">
                    <el-input v-model="detailEventObj.fundCheckCode" class="wd200" type="text" disabled/>
                </el-form-item>

                <div v-show="isAuthShow">
                    <el-form-item class="cl_td" :label="$t('evLstList.eventBalanceObject')" prop="eventBalanceObject">
                        <el-select v-model="detailEventObj.eventBalanceObject" class="wd200" clearable disabled>
                          <el-option
                            v-for="(item, index ) in eventBalanceObjectList"
                            :key="index"
                            :label="item.objectDesc"
                            :value="item.balanceObjectCode"
                          />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="cl_td" :label="$t('evLstList.disputeFlag')" prop="disputeFlag">
                        <el-select v-model="detailEventObj.disputeFlag" class="wd200" clearable disabled>
                          <el-option
                            v-for="(item, index ) in YorN_list"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                          />
                        </el-select>
                    </el-form-item> 
                    <el-form-item class="cl_td" :label="$t('evLstList.transStastisticGroup')" prop="transStastisticGroup">
                        <el-select v-model="detailEventObj.transStastisticGroup" class="wd200" clearable disabled>
                          <el-option
                            v-for="(item, index ) in transStastisticGroupOptions"
                            :key="index"
                            :label="item.name"
                            :value="item.id"
                          />
                        </el-select>
                    </el-form-item> 
                </div> <!-- 授权不显示 -->
                <el-form-item class="cl_td" :label="$t('evLstList.effectivenessCodeType')" prop="effectivenessCodeType">
                    <el-select v-model="detailEventObj.effectivenessCodeType" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in effectivenessCodeTypeList"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item> 
                <el-form-item class="cl_td" :label="$t('evLstList.sceneTriggerObject')" prop="sceneTriggerObject">
                    <el-select v-model="detailEventObj.sceneTriggerObject" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in sceneTriggerObjectList"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.effectivenessCodeScene')" prop="effectivenessCodeScene">
                    <el-select v-model="detailEventObj.effectivenessCodeScene" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in effectivenessCodeSceneList"
                        :key="index"
                        :label="item.effectivenessCodeDesc"
                        :value="item.effectivenessCodeScene"
                        />
                    </el-select>
                </el-form-item> 
                <el-form-item class="cl_td" :label="$t('evLstList.manualSupplementFlag')" prop="manualSupplementFlag">
                    <el-select v-model="detailEventObj.manualSupplementFlag" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in manualSupplementFlagList"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>  
                
                <div class="text_title">{{$t('evLstList.event_related_activity')}}</div>
                <el-table
                v-loading = "detail_listLoading2"
                :data="detail_evnetRelatedActivityList"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
                >
                    <el-table-column prop="activityNo" :label="$t('evLstList.activityNo')" align="center" />
                    <el-table-column prop="activityDesc" :label="$t('evLstList.activityDesc')" align="center" />
                    <el-table-column prop="triggerNo" :label="$t('evLstList.triggerNo')" align="center" />
                    <el-table-column prop="triggerTypDesc" :label="$t('evLstList.triggerTypDesc')" align="center" />
                    <el-table-column prop="triggerEventRecogDimenDesc" :label="$t('evLstList.triggerEventRecogDimenDesc')" align="center" />
                    <el-table-column prop="triggerEventInteractModeDesc" :label="$t('evLstList.triggerEventInteractModeDesc')" align="center" />
                    <el-table-column prop="performOrder" :label="$t('evLstList.performOrder')" align="center" />
                    <el-table-column prop="" :label="$t('table.action')" align="center" width="200">
                        <template slot-scope="{row}">
                            <el-button size="mini" type="primary" @click="detail_queryActivity(row)">{{$t('table.detail')}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <pagination v-show="detail_evnetRelatedActivityTotal>0" 
                    :total="detail_evnetRelatedActivityTotal"
                    :page.sync="detail_evnetRelatedActivityObj.pageNum" 
                    :limit.sync="detail_evnetRelatedActivityObj.pageSize" 
                    @pagination="getRelatedActivityList" />

                <div class="text_title">{{$t('evLstList.artifact_instance_info')}}</div>
                <el-table
                v-loading = "detail_listLoading3"
                :data="detail_evnetComIntanceList"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
                >
                    <el-table-column :label="$t('evLstList.params_option_no_desc')" align="center">
                        <template slot-scope="{row}">
                            {{row.artifactDesc}}{{row.elementNo}}
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('evLstList.pcdno_desc')" align="center" >
                        <template slot-scope="{row}">
                            {{row.pcdNo}}{{row.pcdDesc}}
                        </template>
                    </el-table-column>
                    <el-table-column :label="$t('evLstList.app_dimension2')" align="center">
                        <template slot-scope="{row}">
                            {{row.instanCode2}}{{row.instanDesc2}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="performOrder" :label="$t('evLstList.performOrder')" align="center" />
                    <el-table-column prop="" :label="$t('table.action')" align="center" width="200">
                        <template slot-scope="{row}">
                            <el-button size="mini" type="primary" 
                            @click="detail_queryIntance(row)" v-show="row.pcdNo!=null && row.supportPcd == 'Y' "
                            >{{$t('evLstList.view_params')}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="dialogFormDetail = false">
                {{$t('table.close')}}
              </el-button>
            </div>
        </el-dialog>


        <!-- 详情 事件详细信息 -->
        <el-dialog class="abow_dialog" :title="$t('evLstList.activity_detail')" :visible.sync="detail_dialogFormDetail" width="85%">
            <el-form ref="detail_detailEventForm" :rules="detail_detailEventRules" :model="detail_detailEventObj" >
                <el-form-item class="cl_td" :label="$t('evLstList.activityNo')" prop="activityNo"
                :rules="[ { required: true, message: $t('evLstList.validate_activityNo')} ]">
                    <el-input v-model="detail_detailEventObj.activityNo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.activityDesc')" prop="activityDesc">
                    <el-input v-model="detail_detailEventObj.activityDesc" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.triggerNo')" prop="triggerNo">
                    <el-input v-model="detail_detailEventObj.triggerNo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.triggerTyp')" prop="triggerTyp" clearable >
                    <el-select v-model="detail_detailEventObj.triggerTyp" class="wd200">
                      <el-option
                        v-for="(item, index ) in triggerTypOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.triggerEventRecogDimen')" prop="triggerEventRecogDimen">
                    <el-select v-model="detail_detailEventObj.triggerEventRecogDimen" class="wd200" clearable>
                      <el-option
                        v-for="(item, index ) in triggerEventRecogDimenOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.triggerEventInteractMode')" prop="triggerEventInteractMode">
                    <el-select v-model="detail_detailEventObj.triggerEventInteractMode" class="wd200" clearable>
                      <el-option
                        v-for="(item, index ) in triggerEventInteractModeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.accountingUseFlag')" prop="accountingUseFlag">
                    <el-select v-model="detail_detailEventObj.accountingUseFlag" class="wd200" clearable>
                      <el-option
                        v-for="(item, index ) in accountingUseFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="detail_dialogFormDetail = false">
                {{$t('table.close')}}
              </el-button>
            </div>
        </el-dialog>

        <!-- 详情 构件实例信息 -->
        <el-dialog class="abow_dialog" :title="$t('evLstList.artifact_instance_info')" :visible.sync="intance_dialogFormDetail" width="85%">
            <el-form ref="intance_detailEventForm" :rules="intance_detailEventRules" :model="intance_detailEventObj" >
                <el-form-item class="cl_td" :label="$t('pcd.pcdNo')" prop="pcdNo"
                :rules="[ { required: true, message: $t('pcd.validate_pcdNo1')} ]">
                    <el-input v-model="intance_detailEventObj.pcdNo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('pcd.segmentType')" prop="segmentType">
                    <el-select v-model="intance_detailEventObj.segmentType" class="wd200">
                        <el-option
                          v-for="(item, index ) in segmentTypeOptions"
                          :key="index"
                          :label="item.detailDesc"
                          :value="item.codes"
                        />
                      </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('pcd.baseInstanDimen')" prop="baseInstanDimen"
                :rules="[ { required: true, message: $t('pcd.validate_baseInstanDimen')} ]">
                    <el-select v-model="intance_detailEventObj.baseInstanDimen" class="wd200">
                        <el-option
                          v-for="(item, index ) in baseInstanDimenOptions"
                          :key="index"
                          :label="item.detailDesc"
                          :value="item.codes"
                        />
                      </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('pcd.baseInstanCode')" prop="baseInstanCode" clearable >
                    <el-input v-model="intance_detailEventObj.baseInstanCode" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('pcd.optionInstanDimen')" prop="optionInstanDimen"
                :rules="[ { required: true, message: $t('pcd.validate_optionInstanDimen')} ]">
                    <el-select v-model="intance_dialogFormDetail.optionInstanDimen" class="wd200" clearable>
                      <el-option
                        v-for="(item, index ) in optionInstanDimenOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('pcd.optionInstanCode')" prop="optionInstanCode" clearable >
                    <el-input v-model="intance_detailEventObj.optionInstanCode" class="wd200" type="text" />
                </el-form-item>
            </el-form>
            <el-table
                :data="pcdIntanceList"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
            >
                <el-table-column prop="segmentSerialNum" :label="$t('pcd.segmentSerialNum')" align="center" />
                <el-table-column prop="pcdType" :label="$t('pcd.pcdType')" align="center" />
                <el-table-column prop="segmentValue" :label="$t('pcd.segmentValue')" align="center" />
                <el-table-column prop="pcdValue" :label="$t('pcd.pcdValue')" align="center" />
                <el-table-column prop="pcdPoint" :label="$t('pcd.pcdPoint')" align="center" />
            </el-table>
            <div slot="footer" class="dialog-footer">
              <el-button type="primary" @click="intance_dialogFormDetail = false">
                {{$t('table.close')}}
              </el-button>
            </div>
        </el-dialog>
        <!-- 详情 结束 -->

        <!-- 修改  -->
        <el-dialog class="abow_dialog" :title="$t('evLstList.table_edit')" :visible.sync="dialogFormUp" width="85%">
            <div class="text_title">{{$t('evLstList.base_info')}}</div>
            <el-form ref="upEventForm" :rules="upEventRules" :model="upEventObj" >
                <el-form-item class="cl_td" :label="$t('evLstList.eventNo')" prop="eventNo">
                    <el-input v-model="upEventObj.eventNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.eventDesc')" prop="eventDesc">
                    <el-input v-model="upEventObj.eventDesc" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.eventType')" prop="eventType">
                    <el-select v-model="upEventObj.eventType" class="wd200" clearable disabled>
                      <el-option
                        v-for="(item, index ) in eventTypeList"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.eventBookKeepingDirec')" prop="eventBookKeepingDirec" clearable disabled>
                    <el-select v-model="upEventObj.eventBookKeepingDirec" class="wd200">
                      <el-option
                        v-for="(item, index ) in eventBookKeepingDirecList"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.transIdentificationCode')" prop="transIdentificationCode">
                    <el-select v-model="upEventObj.transIdentificationCode" class="wd200" clearable disabled>
                      <el-option
                        v-for="(item, index ) in transIdentificationCodeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.eventBalanceType')" prop="eventBalanceType">
                    <el-select v-model="upEventObj.eventBalanceType" class="wd200" clearable disabled>
                      <el-option
                        v-for="(item, index ) in eventBalanceTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.transType')" prop="transType">
                    <el-select v-model="upEventObj.transType" class="wd200" clearable disabled>
                      <el-option
                        v-for="(item, index ) in transTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.installType')" prop="installType">
                    <el-select v-model="upEventObj.installType" class="wd200" clearable>
                      <el-option
                        v-for="(item, index ) in installTypeList"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.paymentType')" prop="paymentType">
                    <el-select v-model="upEventObj.paymentType" class="wd200" clearable disabled>
                      <el-option
                        v-for="(item, index ) in paymentTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.feeItemNo')" prop="feeItemNo">
                    <el-select v-model="upEventObj.feeItemNo" class="wd200" clearable>
                      <el-option
                        v-for="(item, index ) in feeItemNoList"
                        :key="index"
                        :label="item.itemNoDesc"
                        :value="item.feeItemNo"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.ongoingProcessFlag')" prop="ongoingProcessFlag">
                    <el-select v-model="upEventObj.ongoingProcessFlag" class="wd200" clearable>
                      <el-option
                        v-for="(item, index ) in ongoingProcessFlagList"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.authSceneCode')" prop="authSceneCode">
                    <!-- <el-input v-model="upEventObj.authSceneCode" class="wd200" type="text" disabled/> -->
                    <el-select v-model="upEventObj.authSceneCode" class="wd200" clearable>
                        <el-option
                        v-for="(item, index ) in authSceneCodeList"
                        :key="index"
                        :label="item.sceneDesc"
                        :value="item.authSceneCode"
                        />
                      </el-select>
                </el-form-item> 
                 
                <el-form-item class="cl_td" :label="$t('evLstList.fundCheckCode')" prop="fundCheckCode">
                    <el-input v-model="upEventObj.fundCheckCode" class="wd200" type="text"/>
                </el-form-item>

                <div v-show="isAuthShow">

                    <el-form-item class="cl_td" :label="$t('evLstList.cycleType')" prop="cycleType">
                        <el-select v-model="detailEventObj.cycleType" class="wd200" clearable >
                          <el-option
                            v-for="(item, index ) in cycleTypeList"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                          />
                        </el-select>
                    </el-form-item> 

                    <el-form-item class="cl_td" :label="$t('evLstList.eventBalanceObject')" prop="eventBalanceObject">
                        <el-select v-model="upEventObj.eventBalanceObject" class="wd200" clearable>
                          <el-option
                            v-for="(item, index ) in eventBalanceObjectList"
                            :key="index"
                            :label="item.objectDesc"
                            :value="item.balanceObjectCode"
                          />
                        </el-select>
                    </el-form-item>
                    <el-form-item class="cl_td" :label="$t('evLstList.disputeFlag')" prop="disputeFlag">
                        <el-select v-model="upEventObj.disputeFlag" class="wd200" clearable>
                          <el-option
                            v-for="(item, index ) in YorN_list"
                            :key="index"
                            :label="item.detailDesc"
                            :value="item.codes"
                          />
                        </el-select>
                    </el-form-item> 
                    <el-form-item class="cl_td" :label="$t('evLstList.transStastisticGroup')" prop="transStastisticGroup">
                        <el-select v-model="upEventObj.transStastisticGroup" class="wd200" clearable>
                          <el-option
                            v-for="(item, index ) in transStastisticGroupOptions"
                            :key="index"
                            :label="item.name"
                            :value="item.id"
                          />
                        </el-select>
                    </el-form-item> 
                </div> <!-- 授权不显示 -->
                <el-form-item class="cl_td" :label="$t('evLstList.effectivenessCodeType')" prop="effectivenessCodeType">
                    <el-select v-model="upEventObj.effectivenessCodeType" class="wd200" clearable>
                        <el-option
                        v-for="(item, index ) in effectivenessCodeTypeList"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item> 
                <el-form-item class="cl_td" :label="$t('evLstList.sceneTriggerObject')" prop="sceneTriggerObject">
                    <el-select v-model="upEventObj.sceneTriggerObject" class="wd200" clearable>
                        <el-option
                        v-for="(item, index ) in sceneTriggerObjectList"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.effectivenessCodeScene')" prop="effectivenessCodeScene">
                    <el-select v-model="upEventObj.effectivenessCodeScene" class="wd200" clearable>
                        <el-option
                        v-for="(item, index ) in effectivenessCodeSceneList"
                        :key="index"
                        :label="item.effectivenessCodeDesc"
                        :value="item.effectivenessCodeScene"
                        />
                    </el-select>
                </el-form-item> 
                <el-form-item class="cl_td" :label="$t('evLstList.accountSceneIdentify')" prop="accountSceneIdentify">
                    <el-select v-model="upEventObj.accountSceneIdentify" class="wd200" clearable disabled>
                        <el-option
                        v-for="(item, index ) in accountSceneIdentifyOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.manualSupplementFlag')" prop="manualSupplementFlag">
                    <el-select v-model="upEventObj.manualSupplementFlag" class="wd200" clearable>
                        <el-option
                        v-for="(item, index ) in manualSupplementFlagList"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                        />
                    </el-select>
                </el-form-item>  
                
                <div class="text_title">{{$t('evLstList.choose_activity')}}</div>
                <el-form-item class="cl_td" :label="$t('evLstList.activityNo')" prop="activityNo">
                    <el-input v-model="up_eventAddActivitySearchForm.activityNo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.activityDesc')" prop="activityDesc">
                    <el-input v-model="up_eventAddActivitySearchForm.activityDesc" class="wd200" type="text" />
                </el-form-item>
                <div class="cl_tr text_center">
                    <el-button size="medium" icon="el-icon-search" type="primary" @click="up_activitySearch()">{{$t('search.query')}}</el-button>
                    <el-button size="medium" icon="el-icon-refresh" type="primary" @click="up_relatedHandle()">{{$t('search.related')}}</el-button>
                </div>
                <el-table
                    v-loading = "up_listLoading2"
                    :data="up_activityList"
                    class="mbtm20"
                    fit
                    highlight-current-row
                    style="width: 100%;"
                    border
                    @selection-change="up_activitySelectChange"
                >
                    <el-table-column type="selection" width="55"></el-table-column>
                    <el-table-column prop="activityNo" :label="$t('evLstList.activityNo')" align="center" />
                    <el-table-column prop="activityDesc" :label="$t('evLstList.activityDesc')" align="center" />
                </el-table>
                <pagination v-show="up_activityTotal>0" :total="up_activityTotal" :page.sync="up_eventAddActivitySearchForm.pageNum" :limit.sync="up_eventAddActivitySearchForm.pageSize" @pagination="up_getActivityList" />
                <div class="text_title">{{$t('evLstList.related_activity')}}</div>
                <el-table
                v-loading = "up_listLoading3"
                :data="up_relatedActivitylist"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
                >
                    <el-table-column type="index" :label="$t('evLstList.order')" align="center" />
                    <el-table-column prop="activityNo" :label="$t('evLstList.activityNo')" align="center" />
                    <el-table-column prop="activityDesc" :label="$t('evLstList.activityDesc')" align="center" />
                    <el-table-column prop="triggerNo" :label="$t('evLstList.triggerNo')" align="center" />
                    <el-table-column prop="triggerTypDesc" :label="$t('evLstList.triggerTypDesc')" align="center" />
                    <el-table-column prop="triggerEventRecogDimenDesc" :label="$t('evLstList.triggerEventRecogDimenDesc')" align="center" />
                    <el-table-column prop="triggerEventInteractModeDesc" :label="$t('evLstList.triggerEventInteractModeDesc')" align="center" />
                    <el-table-column :label="$t('table.up_down')" align="center">
                        <template slot-scope="{row,$index}">
                            <div class="table_arrow">
                                <a class="arrow_up" @click="up_exchangeSeqNoUp($index,row)"></a> <a
                                    class="arrow_down" @click="up_exchangeSeqNoDown($index,row)"></a>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="" :label="$t('table.action')" align="center" width="200">
                        <template slot-scope="{row,$index}">
                            <el-button size="mini" type="primary" @click="up_updateActivty(row,$index)" v-show="updBtnFlag">{{$t('table.edit')}}</el-button>
                            <el-button size="mini" type="primary" @click="up_deleteActivty(row,$index)" v-show="selBtnFlag">{{$t('table.delete')}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="text_title">{{$t('evLstList.params_set')}}</div>
                <el-table
                v-loading = "up_listLoading4"
                :data="up_intanceList"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
                >
                    <el-table-column :label="$t('evLstList.params_option_no_desc')" align="center" width="550">
                        <template slot-scope="{row}">
                            <span class="tdDivL">{{row.artifactDesc}}&nbsp;&nbsp;:&nbsp;&nbsp;</span>
                            <span class="tdDivR">{{row.elementNo}}&nbsp;&nbsp;&nbsp;&nbsp;{{row.elementDesc}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column prop="activityNo" :label="$t('evLstList.app_dimension2')" align="center">
                        <template slot-scope="{row}">
                            {{row.instanCode2}}{{row.instanDesc2}}
                        </template>
                    </el-table-column>
                    <el-table-column prop="performOrder" :label="$t('evLstList.performOrder')" align="center" />
                    <el-table-column prop="" :label="$t('table.action')" align="center" width="300">
                        <template slot-scope="{row,$index}">
                            <el-button size="mini" type="primary" @click="up_insteadParam(row,$index)">
                                {{$t('evLstList.replace_params')}}
                            </el-button>
                            <el-button size="mini" type="primary" @click="up_setParam(row,$index)"
                            v-show="row.pcdNo != null && row.pcdDesc == '' && row.supportPcd == 'Y'" >
                                {{$t('evLstList.set_params_value')}}
                            </el-button>
                            <el-button size="mini" type="primary" @click="up_setParam(row,$index)"
                            v-show="row.pcdNo != null && row.pcdDesc != '' && row.supportPcd == 'Y'" >
                                {{$t('table.set')}}{{row.pcdDesc}}
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>

            </el-form>
            <div slot="footer" class="dialog-footer">
              <el-button @click="dialogFormUp = false">
                {{$t('table.close')}}
              </el-button>
              <el-button type="primary" @click="updateData()">
                {{$t('table.sure')}}
              </el-button>
            </div>
        </el-dialog>
        
        <!-- 修改中 修改关联活动 -->
        <el-dialog :title="$t('avyList.edit_activity')" :visible.sync="up_upEventActDialog" width="65%">
            <el-form ref="upEventForm_upActivity" :rules="upEventRules_upActivity" :model="upEventObj_upActivity" >
                <el-form-item class="cl_td" :label="$t('evLstList.activityNo')" prop="activityNo"
                :rules="[ { required: true, message: $t('evLstList.validate_activityNo')} ]">
                    <el-input v-model="upEventObj_upActivity.activityNo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.activityDesc')" prop="activityDesc">
                    <el-input v-model="upEventObj_upActivity.activityDesc" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.triggerNo')" prop="triggerNo" clearable >
                    <el-input v-model="upEventObj_upActivity.triggerNo" class="wd200" type="text" @focus="upEvent_choseEvent" />
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.triggerTyp')" prop="triggerTyp">
                    <el-select v-model="upEventObj_upActivity.triggerTyp" class="wd200" clearable>
                      <el-option
                        v-for="(item, index ) in triggerTypOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.triggerEventRecogDimen')" prop="triggerEventRecogDimen">
                    <el-select v-model="upEventObj_upActivity.triggerEventRecogDimen" class="wd200" clearable>
                      <el-option
                        v-for="(item, index ) in triggerEventRecogDimenOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.triggerEventInteractMode')" prop="triggerEventInteractMode">
                    <el-select v-model="upEventObj_upActivity.triggerEventInteractMode" class="wd200" clearable>
                      <el-option
                        v-for="(item, index ) in triggerEventInteractModeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.accountingUseFlag')" prop="accountingUseFlag">
                    <el-select v-model="upEventObj_upActivity.accountingUseFlag" class="wd200" clearable>
                      <el-option
                        v-for="(item, index ) in accountingUseFlagOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item> 
            </el-form>
            
            <div slot="footer" class="dialog-footer">
              <el-button @click="up_upEventActDialog = false">
                {{$t('table.cancel')}}
              </el-button>
              <el-button type="primary" @click="up_sureUpEventActivity()">
                {{$t('table.sure')}}
              </el-button>
            </div>
        </el-dialog>

        <!-- 修改 选择触发事件弹窗 -->
        <el-dialog class="abow_dialog" :title="$t('evLstList.choose_trigger_event')" :visible.sync="up_dialogForm_choseEvent" width="65%">
            <el-form ref="upEventForm_choseEvent" :rules="upEventRules_choseEvent" :model="upEventObj_choseEvent" >
                <el-form-item class="cl_td" :label="$t('evLstList.eventId')" prop="eventId">
                    <el-input v-model="upEventObj_choseEvent.eventId" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('evLstList.eventDesc')" prop="eventDesc">
                    <el-input v-model="upEventObj_choseEvent.eventDesc" class="wd200" type="text" />
                </el-form-item>
                <div class="cl_tr text_center">
                    <el-button size="medium" icon="el-icon-search" type="primary" @click="up_hadleQueryChooseRelatedEven()">{{$t('search.query')}}</el-button>
                    <el-button size="medium" icon="el-icon-refresh" type="primary" @click="up_resetChooseRelatedEvent()">{{$t('search.reset')}}</el-button>
                </div>
            </el-form>
            <!-- @row-click="chooseTrigerEvent" -->
            <el-table
            v-loading = "listLoading3"
            :data="upEventObj_choseEventAddList"
            class="mbtm20"
            fit
            highlight-current-row
            style="width: 100%;"
            @row-click="up_chooseTrigerEvent" 
            @current-change="up_handleTrigerEventChange"
            border
            >   
                <el-table-column width="55">
                    <template slot-scope="scope">
                    <el-radio v-model="up_trigerEventNo" :label="scope.row.eventNo">
                        <span class="el-radio__:label"></span>
                    </el-radio>
                    </template>
                </el-table-column>
                <el-table-column prop="eventNo" :label="$t('evLstList.eventNo')" align="center" />
                <el-table-column prop="eventDesc" :label="$t('evLstList.eventDesc')" align="center" />
            </el-table>
            <pagination v-show="upEventObj_choseEventTotal>0" :total="upEventObj_choseEventTotal" :page.sync="upEventObj_choseEvent.pageNum" :limit.sync="upEventObj_choseEvent.pageSize" @pagination="up_getTrigerEventList" />
            <div slot="footer" class="dialog-footer">
              <el-button @click="up_dialogForm_choseEvent = false">
                {{$t('table.cancel')}}
              </el-button>
              <el-button type="primary" @click="eventUp_sureChoseEvent()">
                {{$t('table.sure')}}
              </el-button>
            </div>
        </el-dialog>

        <!-- 替换参数 -->
        <el-dialog :title="$t('avyList.edit_activity')" :visible.sync="up_elementDialog" width="65%">
            <el-table
            v-loading = "up_elementlistLoading1"
            :data="up_elementList"
            class="mbtm20"
            fit
            highlight-current-row
            style="width: 100%;"
            border
            @current-change="handleCurrentEleChange"
            @row-click="chooseInsteadEle"
            >   
                <el-table-column width="55">
                    <template slot-scope="scope">
                    <el-radio v-model="up_elementNoRadio" :label="scope.row.elementNo">
                        <span class="el-radio__:label"></span>
                    </el-radio>
                    </template>
                </el-table-column>
                <el-table-column prop="elementNo" :label="$t('avyList.params_option')" align="center" />
                <el-table-column prop="elementDesc" :label="$t('avyList.desc')" align="center" />
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="up_elementDialog = false">
                  {{$t('table.close')}}
                </el-button>
                <el-button type="primary" @click="up_sureInsteadParam()">
                  {{$t('table.sure')}}
                </el-button>
              </div>
        </el-dialog>

        <!-- 设置参数 -->
        <el-dialog :title="setParamTitle" :visible.sync="up_dialogSetParam" width="65%">
            <el-form ref="up_setParamDataForm" :rules="up_setParamDataRules" :model="up_setParamObj" >
                <div class="text_title">{{$t('pcd.pcd_instance')}}</div>
                <el-form-item class="cl_td" :label="$t('pcd.pcdNo')" prop="pcdNo"
                :rules="[ { required: true, message: $t('pcd.validate_pcdNo1')} ]" >
                    <el-input v-model="up_setParamObj.pcdNo" class="wd200" type="text" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('pcd.segmentType')" prop="segmentType">
                    <el-select v-model="up_setParamObj.segmentType" class="wd200" clearable disabled>
                      <el-option
                        v-for="(item, index ) in segmentTypeOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('pcd.baseInstanCode')" prop="baseInstanCode">
                    <el-input v-model="up_setParamObj.baseInstanCode" class="wd200" type="text" @click="choseBaseInstanCodeBtn" readonly/>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('pcd.optionInstanCode')" prop="optionInstanCode">
                    <el-input v-model="up_setParamObj.optionInstanCode" class="wd200" type="text" @click="choseOptionInstanCodeBtn" readonly/>
                </el-form-item>

                <el-table
                :data="up_pcdInstanList"
                class="mbtm20"
                fit
                highlight-current-row
                style="width: 100%;"
                border
                >   
                    <el-table-column prop="segmentSerialNum" :label="$t('pcd.segmentSerialNum')" align="center" />
                    <el-table-column prop="pcdType" :label="$t('pcd.pcdType')" align="center" />
                    <el-table-column prop="segmentValue" :label="$t('pcd.segmentValue')" align="center" />
                    <el-table-column prop="pcdValue" :label="$t('pcd.pcdValue')" align="center" />
                    <el-table-column prop="pcdPoint" :label="$t('pcd.pcdPoint')" align="center" />
                    <el-table-column prop="" :label="$t('table.action')" align="center" width="400">
                        <template slot-scope="{row,$index}">
                            <el-button size="mini" icon="el-icon-edit"  type="primary" @click="handleUpdatePcd(row,$index)">{{$t('table.edit')}}</el-button>
                            <el-button size="mini" icon="el-icon-delete" type="primary" @click="handleDeletePcd(row,$index)">{{$t('table.delete')}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <div v-show="isPcdShow">
                    <el-form-item class="cl_td" :label="$t('pcd.segmentSerialNum')" prop="segmentSerialNum">
                        <el-input v-model="up_setPcdObj.segmentSerialNum" class="wd200" type="text" @click="choseOptionInstanCodeBtn"/>
                    </el-form-item>
                    <el-form-item class="cl_td" :label="$t('pcd.pcdType')" prop="pcdType">
                        <el-select v-model="up_setPcdObj.pcdType" class="wd200" clearable >
                            <el-option
                              v-for="(item, index ) in pcdTypeOptions"
                              :key="index"
                              :label="item.detailDesc"
                              :value="item.codes"
                            />
                          </el-select>
                    </el-form-item>
                    <el-form-item class="cl_td" :label="$t('pcd.segmentValue')" prop="segmentValue">
                        <el-input v-model="up_setPcdObj.segmentValue" class="wd200" type="text" @click="choseOptionInstanCodeBtn"/>
                    </el-form-item>
                    <el-form-item class="cl_td" :label="$t('pcd.pcdValue')" prop="pcdValue">
                        <el-input v-model="up_setPcdObj.pcdValue" class="wd200" type="text" @click="choseOptionInstanCodeBtn"/>
                    </el-form-item>
                    <el-form-item class="cl_td" :label="$t('pcd.pcdPoint')" prop="pcdPoint">
                        <el-input v-model="up_setPcdObj.pcdPoint" class="wd200" type="text" @click="choseOptionInstanCodeBtn"/>
                    </el-form-item>
                    <div class="cl_tr text_center">
                        <el-button size="medium" icon="el-icon-circle-check" type="primary" @click="up_pcdSave()">{{$t('table.save')}}</el-button>
                        <el-button size="medium" icon="el-icon-circle-close" type="primary" @click="up_pcdClose()">{{$t('table.close')}}</el-button>
                    </div>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="up_dialogSetParam = false">
                    {{$t('table.cancel')}}
                </el-button>
                <el-button type="primary" @click="up_sureSetParam()">
                    {{$t('table.sure')}}
                </el-button>
            </div>
        </el-dialog>
        <!-- 修改结束 -->
    </div>
</template>

<script>
import Pagination from "@/components/Pagination";
export default {
  name: 'EvLstList',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Pagination,
  },
  data() {
    return {
        loacl: '',
        eventSearchForm: {
            pageNum: 1,
            pageSize:10,
        },
      feeItemNoList: [], // 收费目录下拉框
      eventSearchFormRules: {},
      eventList: [],
      eventTotal: 0,
      
      listLoading1: false,
      selBtnFlag: false,
      addBtnFlag: false,
      updBtnFlag: false,
      btnAuthStr: '',

    //   新增
      dialogFormAdd: false,
      addEventForm: {},
      addEventObj: {
        eventNo1: '',
        eventNo2: '',
        eventNo3: '',
        eventNo4: '',
        eventDesc: '',
        eventType: '',
      },
      addEventRules: {},
      // 详情
      detailEventForm : {}, 
      dialogFormDetail: false,
      detailEventObj : {},
      detailEventRules: {},
      // 修改
      dialogFormUp: false,
        upEventForm: {},
        upEventRules: {},
        upEventObj: {}, 



      // 新增 弹窗
      isAuthShow: true, // 授权控制是否显示
      eventTypeList: [], // 事件类别
      eventNo1List: [], // 事件编号1
      eventNo2List: [], // 事件编号2
      eventBookKeepingDirecList: [], //事件记账方向 
      installTypeList: [], // 分期类型
      sceneTriggerObjectList: [], // 场景触发对象
      cycleTypeList: [] , // 批量处理循环类型
      isType:false, //批量处理循环类型编辑状态
      YorN_list: [],// 允许争议标识
      transStastisticGroupOptions: [{name: 'MEMB' , id: 'MEMB'}] , // 交易组别代码
      effectivenessCodeSceneList: [] , // 管控码场景序号
      authSceneCodeList : [], // 授权场景码
      manualSupplementFlagList: [], // 手工补录标识
      effectivenessCodeTypeList: [] , // 管控码类别
      ongoingProcessFlagList: [], // 7*24小时标识 
      transIdentificationCodeOptions: [], // 交易识别代码
      eventBalanceTypeOptions: [], // 对应余额类型
      transTypeOptions: [],// 交易类型
      paymentTypeOptions: [], // 还款类型
      accountSceneIdentifyOptions: [], // 核算场景标识
      eventBalanceObjectList: [], //余额对象
      eventAddActivitySearchForm: {
        pageNum: 1,
        pageSize:10
      }, // 新增中 活动搜索
        add_ActivityList: [], // 新增中 活动列表 
        add_activityTotal: 0 ,
      listLoading2: false, // 选择活动
      listLoading3: false , // 已关联活动
      add_activityMultipleSelection:[], // 关联的活动list
      addEventRules: {},
      // 新增事件 修改事件活动
      dialogFormAdd_upActivity: false ,
      addEventForm_upActivity: {},
      addEventRules_upActivity: {},
      addEventObj_upActivity: {
        triggerNo: ''
      },
      relatedActivityIndex: '', // 已关联项目 下标  用于修改和删除
      // 选择触发事件
      dialogFormAdd_choseEventAdd: false,
        addEventForm_choseEventAdd: {},
        addEventRules_choseEventAdd: {},
        addEventObj_choseEventAdd: {
            pageNum: 1, 
            pageSize: 10,
        },
        addEventObj_choseEventAddList: [],
        addEventObj_choseEventTotal: 0 , 
        triggerTypOptions: [] ,
        triggerEventRecogDimenOptions: [], 
        triggerEventInteractModeOptions: [],
        accountingUseFlagOptions: [],
        selectedEvent: {},
        trigerEventNo: '',


        // 详情
        detail_listLoading2: false,
        detail_listLoading3: false,
        detail_evnetRelatedActivityList: [] ,
        detail_evnetRelatedActivityObj: {
            pageNum: 1,
            pageSize:10
        }, 
        detail_evnetRelatedActivityTotal: 0 ,
        detail_evnetComIntanceList: [],
        //详情中  事件详细信息弹窗
        detail_dialogFormDetail: false,
        detail_detailEventForm: {},
        detail_detailEventRules: {},
        detail_detailEventObj: {},  
        // 详情 构件实例信息
        intance_dialogFormDetail: false,
        intance_detailEventForm: {},
        intance_detailEventRules: {},
        intance_detailEventObj: {},  
        segmentTypeOptions: [],
        baseInstanDimenOptions: [],
        optionInstanDimenOptions: [],
        pcdIntanceList: [],

        // 修改 弹窗
        up_activityTotal:0,
        up_activityList: [],
        up_listLoading2: false,
        up_activityMultipleSelection:[], // 点击多选框
        up_relatedActivitylist: [],
        up_listLoading3: false,
        up_intanceList: [],
        up_listLoading4 : false, 
        // 修改 选择活动list
        up_eventAddActivitySearchForm: {
            pageNum: 1,
            pageSize: 10
        },
        up_activityTotal: 0, 
        // 修改 关联活动修改
        up_upEventActDialog: false ,
        upEventForm_upActivity: {},
        upEventRules_upActivity: {},
        upEventObj_upActivity: {},
        up_updateActivtyIndex: '',
        // 替换参数
        up_elementNoRadio: '',
        up_elementDescRadio: '',
        up_elementList: [],
        up_elementlistLoading1: false,
        up_elementDialog: false,

        // 设置参数
        up_dialogSetParam : false,
        setParamTitle: '',
        up_setParamObj: {},
        up_setParamDataRules: {},
        up_setParamDataForm: {},
        up_setPcdObj: {},
        pcdTypeOptions: [],
        up_pcdInstanList: [],
        isPcdShow: false,
        up_pcdIndex: '',
        up_setParamIndex: '',
        
        // 修改 选择触发事件弹窗
        up_dialogForm_choseEvent: false,
        upEventForm_choseEvent: {},
        upEventRules_choseEvent: {},
        upEventObj_choseEvent: {
            pageNum: 1, 
            pageSize: 10
        },
        upEventObj_choseEventTotal: 0,
        upEventObj_choseEventAddList: [],
        up_selectedEvent: {}, // 修改中 选择的触发事件 当前行
        up_trigerEventNo: ''

    }
  },
  	created() {
    	// this.init()
    	this.getBtnAuth()
	},
  	mounted() {
	  	// 事件清单列表
	    this.getEventList()
	    // 收费项目
	    this.post("/beta/betaService/COS.IQ.02.0031", {}, (res) => {
	      this.feeItemNoList = res.returnData.rows
	    })
	    // 事件类别
	    this.getSelectDict('dic_eventCategory').then((res) => {
	      this.eventTypeList = res
	    })
	    // 事件编号1 
	    this.getSelectDict('dic_eventType').then((res) => {
	      this.eventNo1List = res
	    })
	    // 事件记账方向
	    this.getSelectDict('dic_bookkeepingType').then((res) => {
	      this.eventBookKeepingDirecList = res
	    })
	    // 分期类型 
	    this.getSelectDict('dic_typesOfStages').then((res) => {
	      this.installTypeList = res
	    })
	    // 7*24小时标识 
	    this.getSelectDict('dic_timeIdentification').then((res) => {
	      this.ongoingProcessFlagList = res
	    })
	    // 授权场景码
	    this.post("/beta/betaService/AUS.PM.01.0002", {}, (res) => {
	      this.authSceneCodeList = res.returnData.rows
	    })
	    // 批量处理循环类型
	    this.getSelectDict('dic_cycleType').then((res) => {
	      this.cycleTypeList = res
	    })
	    // 对应余额对象 
	    this.post("/beta/betaService/COS.IQ.02.0021", {}, (res) => {
	      this.eventBalanceObjectList = res.returnData.rows
	    })
	    // 允许争议标识
	    this.getSelectDict('dic_YorNy').then((res) => {
	      this.YorN_list = res
	    })
	    // 交易识别代码  
	    this.getSelectDict('dic_bookkeepingType').then((res) => {
	      this.transIdentificationCodeOptions = res
	    })
	
	    // 管控码类别
	    this.getSelectDict('dic_effectiveCodeType').then((res) => {
	      this.effectivenessCodeTypeList = res
	    })
	    // 场景触发对象 	
	    this.getSelectDict('dic_scenarioTriggerType').then((res) => {
	      this.sceneTriggerObjectList = res
	    })
	    // 管控码场景序号 
	    this.post("/beta/betaService/COS.IQ.02.0023", {}, (res) => {
	      this.effectivenessCodeSceneList = res.returnData.rows
	    })
	    // 核算场景标识
	    this.getSelectDict('dic_accountSceneIdentify').then((res) => {
	      this.accountSceneIdentifyOptions = res
	    })
	    // 手工补录标识 
	    this.getSelectDict('dic_manualSupplement').then((res) => {
	      this.manualSupplementFlagList = res
	    })
	
	    // 触发方式
	    this.getSelectDict('dic_typeTriggerMode').then((res) => {
	      this.triggerTypOptions = res
	    })
	
	    // 触发事件识别维度顺序号
	    this.getSelectDict('dic_dimensionalOrder').then((res) => {
	      this.triggerEventRecogDimenOptions = res
	    })
	
	    // 触发事件交互方式
	    this.getSelectDict('dic_ interactionType').then((res) => {
	      this.triggerEventInteractModeOptions = res
	    })
	
	    // 会计用途标识
	    this.getSelectDict('dic_isYorN').then((res) => {
	      this.accountingUseFlagOptions = res
	    })
	    // 对应余额类型
	    this.getSelectDict('dic_balanceType').then((res) => {
	      this.eventBalanceTypeOptions = res
	    })
	    // 交易类型
	    this.getSelectDict('dic_transactionType').then((res) => {
	      this.transTypeOptions = res
	      this.paymentTypeOptions = res // 还款类型
	    })
	    // 分段类型
	    this.getSelectDict('dic_segmentationType').then((res) => {
	      this.segmentTypeOptions = res
	    })
	    // 实例维度
	    this.getSelectDict('dic_dimensionalValue').then((res) => {
	      this.baseInstanDimenOptions = res
	      this.optionInstanDimenOptions = res
	    })
	    // 取值类型
	    this.getSelectDict('dic_valueType').then((res) => {
	      this.pcdTypeOptions = res
	    })
    
  	},
  methods: {
    // 查询按钮权限
    getBtnAuth() {
        // console.log(window.sessionStorage.getItem('menuNo'))
        let paramsEvent= {
            menuNo : window.sessionStorage.getItem('menuNo')
        }
       // this.eventSearchForm = Object.assign(this.eventSearchForm,params)
        this.getTableList('/beta/betaService/COS.CS.01.0030', paramsEvent ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.length > 0 ) {
                    res.returnData.forEach(item => {
                        this.btnAuthStr += item.eventNo+','
                    })
                    if (this.btnAuthStr.includes('COS.IQ.02.0001')) { // 查询
                        this.selBtnFlag = true
                    } else {
                        this.selBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.AD.02.0001')) { // 新增
                        this.addBtnFlag = true
                    } else {
                        this.addBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.UP.02.0001')) { // 维护
                        this.updBtnFlag = true
                    } else {
                        this.updBtnFlag = false
                    }
                }
            }
        })
    },
    // 事件清单列表
    getEventList() {
        this.listLoading1 = true
        this.getTableList('/beta/betaService/COS.IQ.02.0001', this.eventSearchForm ,(res) => {
            if (res.returnCode == '000000') {
            	this.listLoading1 = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.eventList = res.returnData.rows
                    this.eventTotal = res.returnData.totalCount
                }else{
                	this.eventList = []
                	this.eventTotal = 0
                }
            }
        }, (err) => {
        	if(err) {
        		this.eventList = []
            	this.eventTotal = 0
            	this.listLoading1 = false
        	}
        })
	},
    handleSearch() {
        this.eventSearchForm.pageNum = 1
        this.eventSearchForm.pageSize = 10
        this.getEventList()
    },
    // 详情
    handleDetail(row) {
        this.dialogFormDetail = true
        this.detailEventObj = Object.assign({}, row)
        // 授权 部分不显示
        if (this.detailEventObj.eventType == 'AUS') {
            this.isAuthShow = false
        } else {
            this.isAuthShow = true
        }
        this.getRelatedActivityList(row) //事件关联活动
        this.getComInstanceList(row) // 构件实例信息
    },
    handleUpdate(row) {
        this.dialogFormUp = true
        this.upEventObj = Object.assign({}, row)
        this.up_getActivityList() // 活动list
        this.up_getRelatedActivityList(row) // 已关联活动
        this.up_getComInstanceList(row) // 参数设置
        
    }, 


    // 新增
    handleAdd() {
      this.dialogFormAdd = true
      this.$nextTick(() => {
        this.$refs['addEventForm'].clearValidate()
      })
    }, 
    addInit() {
        this.dialogFormAdd = false
        this.add_activityTotal = 0 
        this.eventAddActivitySearchForm = {
            pageNum: 1,
            pageSize:10
        }
        this.addEventObj = {}
        this.addEventObj_upActivity = {}
        this.add_activityMultipleSelection = []
        this.add_ActivityList = []
    },
    // 确定新增
    createData(){
        this.$refs['addEventForm'].validate((valid) => {
            if (valid) {
                this.addEventObj.eventNo = this.addEventObj.eventNo1 + '.'+ this.addEventObj.eventNo2 +'.'+ this.addEventObj.eventNo3 +'.'+ this.addEventObj.eventNo4
                this.addEventObj.List = this.add_activityMultipleSelection
                this.getTableList('/beta/betaService//COS.AD.02.0001',  this.addEventObj,(res) => {
                    if (res.returnCode == '000000') {
                        this.dialogFormAdd = false
                        this.$notify({
                        title: 'Success',
                        message: this.$t('table.add_success'),
                        type: 'success',
                        duration: 2000
                        })
                        this.getEventList()
                    }
                })
            }
        }) 
    },

    //
    updateData() {
        this.$refs['upEventForm'].validate((valid) => {
            if (valid) {
                this.upEventObj.list = this.up_relatedActivitylist
                this.upEventObj.artifactInstanList = this.up_intanceList
                // console.log(this.upEventObj)
                // return
                this.getTableList('/beta/betaService/COS.UP.02.0001',  this.upEventObj,(res) => {
                    if (res.returnCode == '000000') {
                        this.dialogFormUp = false
                        this.$notify({
                        title: 'Success',
                        message: this.$t('table.up_success'),
                        type: 'success',
                        duration: 2000
                        })
                        this.getEventList()
                    }
                })
            }
        }) 
    },


    // 选定事件编号1 查询事件编号2
    eventNo1HandleChange(value) {
        this.addEventObj.eventNo2 = '' 
        if(value == 'ISS') {
            // 事件编号2 
            this.getSelectDict('dic_eventNO2_ISS').then((res) => {
                this.eventNo2List = res
            })
        } else if(value == 'COS') {
            // 事件编号2 
            this.getSelectDict('dic_eventNO2_COS').then((res) => {
                this.eventNo2List = res
            })    
        } else if(value == 'BSS') {
            // 事件编号2 
            this.getSelectDict('dic_eventNO2_BSS').then((res) => {
                this.eventNo2List = res
            })    
        } else if(value == 'MIS') {
            // 事件编号2 
            this.getSelectDict('dic_eventNO2_MIS').then((res) => {
                this.eventNo2List = res
            })    
        } else if(value == 'ILS') {
            // 事件编号2 
            this.getSelectDict('dic_eventNO2_ILS').then((res) => {
                this.eventNo2List = res
            })    
        } else if(value == 'AUS') {
            // 事件编号2 
            this.getSelectDict('dic_eventNO2_AUS').then((res) => {
                this.eventNo2List = res
                console.log(res)
            })
        } else if(value == 'LMS') {
            // 事件编号2 
            this.getSelectDict('dic_eventNO2_LMS').then((res) => {
                this.eventNo2List = res
            })    
        } else if(value == 'OCS' || value == 'FMS') {
            // 事件编号2 
            this.getSelectDict('dic_eventNO2_OCS').then((res) => {
                this.eventNo2List = res
            })    
        }

        if (value == 'AUS') { // 授权
           this.isAuthShow = false
        } else {
            this.isAuthShow = true
        }
        
    },

    // 在事件编号第二段为'BH','BN’,'RT'时才允许设置批量处理循环类型
    // 第二段为XT时，分期类型，分期起分金额，分期最大金额才可以输入
    
	// 金融类----  RT，PT, XT, 
    // 非金融类--- IQ，AD，OP，UP，CS, PM, SP
    // 批量类---  BH,BN
    // 授权类---  CU,VI,MC,AU,IS,IL， MI,JC
    // 其他类---  其他
    eventNo1HandleChange2(val) {
        if (val == 'RT' || val == 'PT' || val == 'XT') {
           this.addEventObj.eventType = 'MONY'
           this.isType = true;
          this.addEventObj.cycleType = "";
        } else if (val == "IQ" || val == "AD"|| val == "OP"|| val == "UP"|| val == "CS"
      || val == "PM" || val == "SP") {
              this.addEventObj.eventType = 'NMNY'   
              this.isType = true;
          this.addEventObj.cycleType = "";    
          } else if (val == "BH" || val == "BN") {
              this.addEventObj.eventType = 'BTCH'
              this.isType = false;
          } else if (val == "CU"|| val == "VI"
          || val == "MC"|| val == "AU"
          || val == "IS"|| val == "IL"
          || val == "MI"|| val == "JC") {
        this.addEventObj.eventType = 'AUTH'
        this.isType = true;
          this.addEventObj.cycleType = "";
      } else {
        this.addEventObj.eventType = 'OTHR'
        this.isType = true;
          this.addEventObj.cycleType = "";
      }
       // 在事件编号第二段为'BH','BN’,'RT'时才允许设置批量处理循环类型
      //  if (val == "BH" || val == "BN" || val == "RT") {
      //     this.isType = false;
      //   } else {
      //     this.isType = true;
      //     this.addEventObj.cycleType = "";
      //   }
        // mis.op显示交易识别码
		// if (val == "OP"
		// 		&& this.addEventObj.eventNo1 == "LMS") {
		// 	$scope.tranIdenShow = true
		// 	this.addEventObj.transIdentificationCode = "";
		// } else {
		// 	$scope.tranIdenShow = false
		// 	this.addEventObj.transIdentificationCode = "";
		// }
    },
    // 新增中 活动列表
    getEventAddActivityList() {
        this.listLoading2 = true
        
        // this.eventSearchForm
        this.getTableList('/beta/betaService/COS.IQ.02.0003',  this.eventAddActivitySearchForm,(res) => {
            if (res.returnCode == '000000') {
                this.listLoading2 = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.add_ActivityList = res.returnData.rows
                    this.add_activityTotal = res.returnData.totalCount
                } else {
                    this.add_ActivityList = []
                    this.add_activityTotal = 0
                }
            }
        })
    },

    // 搜索活动
    add_activitySearch() {
        // this.getEventAddActivityList()
        this.listLoading2 = true
        
        this.eventAddActivitySearchForm.pageNum =1
        this.getTableList('/beta/betaService/COS.IQ.02.0003',  this.eventAddActivitySearchForm,(res) => {
            if (res.returnCode == '000000') {
                this.listLoading2 = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.add_ActivityList = res.returnData.rows
                    this.add_activityTotal = res.returnData.totalCount
                } else {
                    this.add_ActivityList = []
                    this.add_activityTotal = 0
                }
            }
        },(err) => {
            if (err) {
               	this.add_ActivityList = []
                this.add_activityTotal = 0
                this.listLoading2 = false
            }
        })
    },
    // 新增 关联
    add_relatedHandle() {
        this.add_activityMultipleSelection = this.add_activityMultipleSelection
    },
    // 新增弹窗中 选择活动
    add_activitySelectChange(val) {
        this.add_activityMultipleSelection = val;
    },
    // 上移
    exchangeSeqNoUp(index, row){
        if (index === 0) {
            this.$message({
            message: '已是第一条记录！',
            type: 'warning'
            })
        } else {
            let dataMap = this.add_activityMultipleSelection[index - 1]
            this.$set(this.add_activityMultipleSelection, index - 1, this.add_activityMultipleSelection[index])
            this.$set(this.add_activityMultipleSelection, index, dataMap)
        }
    },
    // 下移
    exchangeSeqNoDown(index,row){
        
        if (index === (this.add_activityMultipleSelection.length - 1)) {
            this.$message({
            message: '已是最后一条记录！',
            type: 'warning'
            })
        } else {
            let i = this.add_activityMultipleSelection[index + 1]
            this.$set(this.add_activityMultipleSelection, index + 1, this.add_activityMultipleSelection[index])
            this.$set(this.add_activityMultipleSelection, index, i)
        }
    },
    // 新增事件 已关联活动 修改
    updateActivty(row,index) {
        this.relatedActivityIndex = index
        this.dialogFormAdd_upActivity = true

        this.addEventObj_upActivity = Object.assign({}, row)

        this.$nextTick(() => {
            this.$refs['addEventForm_upActivity'].clearValidate()
        })
    },
    // 新增事件 已关联活动 删除
    deleteActivty(row,index) {
        this.add_activityMultipleSelection.splice(index, 1)
    },
    // 触发事件编号
    choseEventAdd() {
        this.getTrigerEventList()
    },
    // 新增 触发事件弹窗 选择事件
    getTrigerEventList() {
        this.getTableList('/beta/betaService/COS.IQ.02.0001', this.addEventObj_choseEventAdd ,(res) => {
            if (res.returnCode == '000000') {
                this.dialogFormAdd_choseEventAdd = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.addEventObj_choseEventAddList = res.returnData.rows
                    this.addEventObj_choseEventTotal = res.returnData.totalCount
                }else{
                	this.addEventObj_choseEventAddList = []
                    this.addEventObj_choseEventTotal = 0
                }
            }
        }, (err) => {
        	if(err) {
        		this.addEventObj_choseEventAddList = []
            	this.addEventObj_choseEventTotal = 0
            	this.dialogFormAdd_choseEventAdd = false
        	}
        })
    },
    // 查询
    add_hadleQueryEvent(){
        this.getTrigerEventList()
    },
    // 重置
    add_resetEvent(){
        this.addEventObj_choseEventAdd.eventNo = ''
        this.addEventObj_choseEventAdd.eventDesc = ''
    },
    // 触发事件list 单击一行
    chooseTrigerEvent(row) {
        this.selectedEvent = row
    },
    handleTrigerEventChange(val) {
        this.selectedEvent = val
    },
    // 事件新增 选择触发事件
    eventAdd_sureChoseEvent() {
        this.dialogFormAdd_choseEventAdd = false 
        this.addEventObj_upActivity.triggerNo = this.selectedEvent.eventNo
    },

    // 修改事件活动 确定
    up_eventActivity() {
        this.$refs['addEventForm_upActivity'].validate((valid) => {
            this.dialogFormAdd_upActivity = false

            this.add_activityMultipleSelection[relatedActivityIndex] = this.addEventObj_upActivity
            

        })
        
    },

    
    // 详情 查询已关联活动
    getRelatedActivityList(row) {
        this.detail_listLoading2 = true
        this.detail_evnetRelatedActivityObj.eventNo = row.eventNo
        this.getTableList('/beta/betaService/COS.IQ.02.0002', this.detail_evnetRelatedActivityObj ,(res) => {
            if (res.returnCode == '000000') {
                this.detail_listLoading2 = false 
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.detail_evnetRelatedActivityList = res.returnData.rows
                    this.detail_evnetRelatedActivityTotal = res.returnData.totalCount
                } else{
                	this.detail_evnetRelatedActivityList = []
                    this.detail_evnetRelatedActivityTotal = 0
                }
            }else {
                this.dialogFormDetail = false
            }
        }, (err) => {
        	if(err) {
        		this.detail_evnetRelatedActivityList = []
                this.detail_evnetRelatedActivityTotal = 0
                this.detail_listLoading2 = false 
        	}
        })
    },
    // 详情 中 查询活动
    detail_queryActivity(row) {
        this.detail_dialogFormDetail = true
        this.detail_detailEventObj = Object.assign({}, row)
    },
    // 详情 构件实例信息
    getComInstanceList(row) {
        this.detail_listLoading3 = true
        this.detail_evnetRelatedActivityObj.instanCode = row.eventNo
        this.getTableList('/beta/betaService/COS.IQ.02.0015', this.detail_evnetRelatedActivityObj ,(res) => {
            if (res.returnCode == '000000') {
                this.detail_listLoading3 = false 
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.detail_evnetComIntanceList = res.returnData.rows
                }else{
                	this.detail_evnetComIntanceList = []
                }
            } else {
                this.dialogFormDetail = false
            }
        }, (err) => {
        	if(err) {
        		this.detail_evnetComIntanceList = []
        		this.detail_listLoading3 = false 
        	}
        })
    },
    // 详情弹窗 查询实例
    detail_queryIntance(row) {
        this.intance_dialogFormDetail = true
        this.intance_detailEventObj = Object.assign({},row)
        this.pcdIntanceList = row.pcdInstanList
    },

    // 详情弹窗结束


    // 修改弹窗
    // 修改 活动list
    up_getActivityList() {
        this.up_listLoading2 = true
        this.getTableList('/beta/betaService/COS.IQ.02.0003',  this.up_eventAddActivitySearchForm,(res) => {
            if (res.returnCode == '000000') {
                this.up_listLoading2 = false
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.up_activityList = res.returnData.rows
                    this.up_activityTotal = res.returnData.totalCount
                } else {
                    this.up_activityList = []
                    this.up_activityTotal = 0
                }
            } else {
                this.up_listLoading2 = true
                this.dialogFormUp = false
            }
        }, (err) => {
        	if(err) {
        		this.up_activityList = []
                this.up_activityTotal = 0
                this.up_listLoading2 = false
        	}
        })
    },
    // 修改 选择活动 搜索
    up_activitySearch() {
        this.up_getActivityList()
    },
    // 修改 选择活动 关联
    up_relatedHandle() {

    },
    // 选择活动 点击多选框函数
    up_activitySelectChange(val) {
        this.add_activityMultipleSelection = val
        this.up_relatedActivitylist = this.up_relatedActivitylist.concat(this.add_activityMultipleSelection)
       
    },
    // 修改 已关联活动
    up_getRelatedActivityList(row) {
        this.detail_listup_listLoading3Loading2 = true
        this.upEventObj.eventNo = row.eventNo
        this.getTableList('/beta/betaService/COS.IQ.02.0002', this.upEventObj ,(res) => {
            if (res.returnCode == '000000') {
                this.up_listLoading3 = false 
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.up_relatedActivitylist = res.returnData.rows
                } else {
                	this.up_relatedActivitylist = []
                }
            } else {
                this.dialogFormUp = false
            }
        }, (err) => {
        	this.up_relatedActivitylist = []
        	this.up_listLoading3 = false 
        })
    },
    // 上移
    up_exchangeSeqNoUp(index, row){
        if (index === 0) {
            this.$message({
            message: '已是第一条记录！',
            type: 'warning'
            })
        } else {
            let dataMap = this.up_relatedActivitylist[index - 1]
            this.$set(this.up_relatedActivitylist, index - 1, this.up_relatedActivitylist[index])
            this.$set(this.up_relatedActivitylist, index, dataMap)
        }
    },
    // 下移
    up_exchangeSeqNoDown(index,row){    
        if (index === (this.up_relatedActivitylist.length - 1)) {
            this.$message({
            message: '已是最后一条记录！',
            type: 'warning'
            })
        } else {
            let i = this.up_relatedActivitylist[index + 1]
            this.$set(this.up_relatedActivitylist, index + 1, this.up_relatedActivitylist[index])
            this.$set(this.up_relatedActivitylist, index, i)
        }
    },
    // 修改 确定修改关联活动
    up_sureUpEventActivity() {
        this.up_upEventActDialog = false
        this.$set(this.up_relatedActivitylist, this.up_updateActivtyIndex, this.upEventObj_upActivity)
    },
    // 修改 参数设置
    up_getComInstanceList(row ) {
        this.up_listLoading4 = true
        this.upEventObj.instanCode = row.eventNo
        this.getTableList('/beta/betaService/COS.IQ.02.0015', this.upEventObj ,(res) => {
            if (res.returnCode == '000000') {
                this.up_listLoading4 = false 
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.up_intanceList = res.returnData.rows
                }else{
                	his.up_intanceList = []
                }
            } else {
            	this.up_intanceList = []
                this.dialogFormUp = false
            }
        }, (err) => {
        	this.up_intanceList = []
        	this.up_listLoading4 = false
        })
    },

    // 修改弹窗  已关联活动 修改
    up_updateActivty(row,index){
        this.up_updateActivtyIndex = index
        this.upEventObj_upActivity = Object.assign({},row)
        this.up_upEventActDialog = true // 修改关联活动弹窗
    },
    // 修改弹窗  已关联活动 删除
    up_deleteActivty(row,index){
        this.up_relatedActivitylist.splice(index,1)
    },

    // 修改弹窗  参数设置 替换参数
    up_insteadParam(row, index) {
        this.insteadParamIndex = index
        this.up_elementlistLoading1 = true
        this.up_elementDialog = true
        let obj = {
            pcdNo: row.elementNo.substring(0, 8),
            artifactNo: row.artifactNo
        }
        this.getTableList('/beta/betaService/COS.IQ.02.0009', obj ,(res) => {
            if (res.returnCode == '000000') {
                this.up_elementlistLoading1 = false 
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.up_elementList = res.returnData.rows
                }else{
                 	this.up_elementList  = []
                }
            } else {
                this.up_elementDialog = false
			}
        }, (err) => {
        	this.up_elementList = []
        	this.up_elementlistLoading1 = false 
        })
    },
    // 
    handleCurrentEleChange(val) {
        this.choseBusinessCurrentRow = val
    },
    // 
    chooseInsteadEle(row) {
        this.up_elementNoRadio = row.elementNo
        this.up_elementDescRadio = row.elementDesc
    },
    // 确定 替换参数
    up_sureInsteadParam() {
       this.up_intanceList[this.insteadParamIndex].elementNo = this.up_elementNoRadio
       this.up_intanceList[this.insteadParamIndex].elementDesc = this.up_elementDescRadio
       this.up_elementDialog = false 
    },
    // 修改弹窗  参数设置 设置参数
    up_setParam(row, index) {
        this.up_setParamIndex = index
        this.up_setParamObj = Object.assign({},row)
        this.up_pcdInstanList = this.up_setParamObj.pcdInstanList
        this.up_dialogSetParam = true
        this.setParamTitle = '设置'+row.pcdNo+row.pcdDesc+'的参数值'

    },
    // 确定 设置参数
    up_sureSetParam(){
        this.$set(this.up_intanceList, this.up_setParamIndex, this.up_setParamObj)
        this.up_dialogSetParam = false
    },
    // 基础实例代码
    choseBaseInstanCodeBtn() {

    },
    // 可选实例代码
    choseOptionInstanCodeBtn() {

    },
    // 修改 pcd
    handleUpdatePcd(row,index) {
        this.isPcdShow = true
        this.up_setPcdObj = Object.assign({},row)
        this.up_pcdIndex = index
    },
    // 删除 pcd
    handleDeletePcd(row,index) {
        
        if (this.up_pcdInstanList.length == 1) {
            this.$message({
                showClose: true,
                message: '必须有一条pcd取值',
                type: 'error'
            });
            return
        }
        this.up_pcdInstanList.splice(index, 1)
    },
    // 保存 pcd
    up_pcdSave() {
        // up_pcdInstanList
        // this.up_setPcdObj = this.up_setPcdObj
        // this.up_pcdInstanList[this.up_pcdIndex] = this.up_setPcdObj
        this.$set(this.up_pcdInstanList, this.up_pcdIndex, this.up_setPcdObj)
        this.isPcdShow = false
    },
    // 关闭pcd
    up_pcdClose() {
        this.up_setPcdObj = {}
        this.isPcdShow = false
    },

    // 修改 选择触发事件 弹窗
    upEvent_choseEvent() {
        this.up_getTrigerEventList()
    },
    // 修改 查询触发事件
    up_getTrigerEventList(){
        this.getTableList('/beta/betaService/COS.IQ.02.0001', this.upEventObj_choseEvent ,(res) => {
            if (res.returnCode == '000000') {
                this.up_dialogForm_choseEvent = true
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.upEventObj_choseEventAddList = res.returnData.rows
                    this.upEventObj_choseEventTotal = res.returnData.totalCount
                }else {
                	this.upEventObj_choseEventAddList = []
                	this.upEventObj_choseEventTotal = 0
                }
            } else {
                this.up_dialogForm_choseEvent = false
            }
        })
    },
    // 修改 确定选择触发事件
    eventUp_sureChoseEvent() {
        this.upEventObj_upActivity.triggerNo = this.up_selectedEvent.eventNo
        this.up_dialogForm_choseEvent = false
        console.log(this.upEventObj_upActivity)
    },
    // 修改 触发事件选中当前行
    up_handleTrigerEventChange(val){
        this.up_selectedEvent = val
    },
    up_chooseTrigerEvent(row) {
        this.up_selectedEvent = row
        this.up_trigerEventNo = row.eventNo
    },
    //修改 选择触发事件按错 查询事件
    up_hadleQueryChooseRelatedEven() {
        this.up_getTrigerEventList()
    },
    //修改 选择触发事件按错 重置
    up_resetChooseRelatedEvent(){
        this.upEventObj_choseEvent.eventId = ''
        this.upEventObj_choseEvent.eventDesc = ''
    },
    


    



  },
}
</script>

<style>
.cl-tr .el-form-item__label {
    width:20% !important;
    float: left;
}

.tdDivL {
	display: inline-block;
    width: 35%;
    text-align: right;
}
.tdDivR {
	display: inline-block;
    width: 65%;
    text-align: left;
}
</style>

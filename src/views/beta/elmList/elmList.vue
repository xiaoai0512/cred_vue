<!-- 构件清单 -->
<template>
    <div class="allContent">
    <!-- 表单验证demo: -->
    <el-form ref="artifactSearchForm" :model="artifactSearchForm" :rules="artifactSearchFormRules">
        <el-form-item class="cl_td" :label="$t('elmList.artifactNo')" prop="artifactNo">
            <el-input v-model="artifactSearchForm.artifactNo" class="wd200" type="text" />
        </el-form-item>
        <el-form-item class="cl_td" :label="$t('elmList.artifactDesc')" prop="artifactDesc">
            <el-input v-model="artifactSearchForm.artifactDesc" class="wd200" type="text" />
        </el-form-item>
        <div class="cl_tr text_center">
            <el-button size="medium" icon="el-icon-search" type="primary" @click="handleSearch()" v-show="selBtnFlag">{{$t('search.query')}}</el-button>
            <el-button size="medium" icon="el-icon-plus" type="primary" @click="handleCreate" v-show="addBtnFlag">{{$t('search.add')}}</el-button>
        </div>
    </el-form>
    <el-table
        v-loading = "listLoading1"
        :data="artifactList"
        class="mbtm20"
        fit
        highlight-current-row
        style="width: 100%;"
        border
      >
        <el-table-column prop="artifactNo" :label="$t('elmList.artifactNo')" align="center" />
        <el-table-column prop="artifactDesc" :label="$t('elmList.artifactDesc')" align="center"  width = "200"/>
        <el-table-column prop="instanDimenCount" :label="$t('elmList.instanDimenCount')" align="center" />
        <el-table-column prop="instanDimen1Desc" :label="$t('elmList.instanDimen1')" align="center" />
        <el-table-column prop="instanDimen2Desc" :label="$t('elmList.instanDimen2')" align="center" />
        <el-table-column prop="instanDimen3Desc" :label="$t('elmList.instanDimen3')" align="center" />
        <el-table-column prop="instanDimen4Desc" :label="$t('elmList.instanDimen4')" align="center" />
        <el-table-column prop="instanDimen5Desc" :label="$t('elmList.instanDimen5')" align="center" />
        <el-table-column prop="" :label="$t('table.action')" align="center"  width = "450">
            <template slot-scope="{row}">
                <el-button size="mini" icon="el-icon-arrow-right" type="primary" @click="handleQueryActivity(row)">{{$t('elmList.query_activity')}}</el-button>
                <el-button size="mini" icon="el-icon-arrow-right"   type="primary" @click="handleQueryEvent(row)">{{$t('elmList.query_event')}}</el-button>
                <el-button size="mini" icon="el-icon-more" type="primary" @click="handleDetail(row)" v-show="selBtnFlag">{{$t('table.detail')}}</el-button>
                <el-button size="mini" icon="el-icon-edit"   type="primary" @click="handleUpdate(row)" v-show="updBtnFlag">{{$t('table.edit')}}</el-button>
            </template>
        </el-table-column>
      </el-table>
      <pagination v-show="artifactTotal>0" :total="artifactTotal" :page.sync="artifactSearchForm.pageNum" :limit.sync="artifactSearchForm.pageSize" @pagination="getArtifactList" />
  
        
        <!-- 新增 -->
        <el-dialog :title="$t('elmList.add_artifact')" :visible.sync="dialogFormVisibleAdd" width="65%">
            <el-form ref="dataFormAdd" :rules="rulesAdd" :model="tempAdd" >
                <el-form-item class="cl_td" :label="$t('elmList.artifactNo')" prop="artifactNo"
                :rules="[ { required: true, message: $t('elmList.validate_artifactNo')} ]" >
                    <el-input v-model="tempAdd.artifactNo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('elmList.artifactDesc')" prop="artifactDesc" >
                    <el-input v-model="tempAdd.artifactDesc" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('elmList.instanDimen1')" prop="instanDimen1">
                    <el-select v-model="tempAdd.instanDimen1" class="wd200" clearable >
                      <el-option
                        v-for="(item, index ) in instanDimenOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('elmList.instanDimen2')" prop="instanDimen2">
                    <el-select v-model="tempAdd.instanDimen2" class="wd200" clearable >
                      <el-option
                        v-for="(item, index ) in instanDimenOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('elmList.instanDimen3')" prop="instanDimen3">
                    <el-select v-model="tempAdd.instanDimen3" class="wd200" clearable >
                      <el-option
                        v-for="(item, index ) in instanDimenOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('elmList.instanDimen4')" prop="instanDimen4">
                    <el-select v-model="tempAdd.instanDimen4" class="wd200" clearable >
                      <el-option
                        v-for="(item, index ) in instanDimenOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('elmList.instanDimen5')" prop="instanDimen5">
                    <el-select v-model="tempAdd.instanDimen5" class="wd200" clearable >
                      <el-option
                        v-for="(item, index ) in instanDimenOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('elmList.delayEffectiveSign')" prop="delayEffectiveSign">
                    <el-select v-model="tempAdd.delayEffectiveSign" class="wd200" clearable >
                      <el-option
                        v-for="(item, index ) in delayEffectiveSignOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <div class="text_title">{{$t('elmList.choose_element')}}</div>
                <div style="margin-left: 12%;" >
                    <el-transfer 
                        filterable
                        :filter-method="filterMethod"
                        :titles="[$t('elmList.can_choose_element'), $t('elmList.choosed_element')]"
                        :filter-placeholder="$t('elmList.input_element')"
                        v-model="tempAdd.elementlistAddPage"
                        :data="add_allComponentData">
                    </el-transfer>
                </div>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleAdd = false">
                    {{$t('table.cancel')}}
                </el-button>
                <el-button type="primary" @click="createData()">
                    {{$t('table.sure')}}
                </el-button>
            </div>
        </el-dialog>



        <!-- 查询活动 -->
        <el-dialog :title="$t('elmList.activity_detail')" :visible.sync="dialogFormVisibleDetail_activity" width="65%">
            <el-form ref="dataFormDetail_activity" :rules="rulesDetail_activity" :model="tempDetail_activity" >
                <el-form-item class="cl_td" :label="$t('elmList.artifactNo')" prop="artifactNo" >
                    <el-input v-model="tempDetail_activity.artifactNo" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('elmList.artifactDesc')" prop="artifactDesc" >
                    <el-input v-model="tempDetail_activity.artifactDesc" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('elmList.instanDimen1')" prop="instanDimen1">
                    <el-select v-model="tempDetail_activity.instanDimen1" class="wd200" clearable disabled>
                      <el-option
                        v-for="(item, index ) in instanDimenOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('elmList.instanDimen2')" prop="instanDimen2">
                    <el-select v-model="tempDetail_activity.instanDimen2" class="wd200" clearable disabled>
                      <el-option
                        v-for="(item, index ) in instanDimenOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('elmList.instanDimen3')" prop="instanDimen3">
                    <el-select v-model="tempDetail_activity.instanDimen3" class="wd200" clearable disabled>
                      <el-option
                        v-for="(item, index ) in instanDimenOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('elmList.instanDimen4')" prop="instanDimen4">
                    <el-select v-model="tempDetail_activity.instanDimen4" class="wd200" clearable disabled>
                      <el-option
                        v-for="(item, index ) in instanDimenOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('elmList.instanDimen5')" prop="instanDimen5">
                    <el-select v-model="tempDetail_activity.instanDimen5" class="wd200" clearable disabled>
                      <el-option
                        v-for="(item, index ) in instanDimenOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('elmList.delayEffectiveSign')" prop="delayEffectiveSign">
                    <el-select v-model="tempDetail_activity.delayEffectiveSign" class="wd200" clearable disabled>
                      <el-option
                        v-for="(item, index ) in delayEffectiveSignOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                
                <div class="text_title">{{$t('elmList.artifact_related_activity')}}</div>
                <el-table
                    :data="detaiList_activity"
                    class="mbtm20"
                    fit
                    highlight-current-row
                    style="width: 100%;"
                    border
                >
                <el-table-column prop="activityNo" :label="$t('avyList.activityNo')" align="center" />
                <el-table-column prop="activityDesc" :label="$t('avyList.activityDesc')" align="center" />
              </el-table>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleDetail_activity = false">
                    {{$t('table.close')}}
                </el-button>
            </div>
        </el-dialog>


        <!-- 查询事件 -->
        <el-dialog :title="$t('elmList.event_detail')" :visible.sync="dialogFormVisibleDetail_event" width="65%">
            <el-form ref="dataFormDetail_event" :rules="rulesDetail_event" :model="tempDetail_event" >
                <el-form-item class="cl_td" :label="$t('elmList.artifactNo')" prop="artifactNo" >
                    <el-input v-model="tempDetail_event.artifactNo" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('elmList.artifactDesc')" prop="artifactDesc" >
                    <el-input v-model="tempDetail_event.artifactDesc" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('elmList.instanDimen1')" prop="instanDimen1">
                    <el-select v-model="tempDetail_event.instanDimen1" class="wd200" clearable disabled>
                      <el-option
                        v-for="(item, index ) in instanDimenOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('elmList.instanDimen2')" prop="instanDimen2">
                    <el-select v-model="tempDetail_event.instanDimen2" class="wd200" clearable disabled>
                      <el-option
                        v-for="(item, index ) in instanDimenOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('elmList.instanDimen3')" prop="instanDimen3">
                    <el-select v-model="tempDetail_event.instanDimen3" class="wd200" clearable disabled>
                      <el-option
                        v-for="(item, index ) in instanDimenOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('elmList.instanDimen4')" prop="instanDimen4">
                    <el-select v-model="tempDetail_event.instanDimen4" class="wd200" clearable disabled>
                      <el-option
                        v-for="(item, index ) in instanDimenOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('elmList.instanDimen5')" prop="instanDimen5">
                    <el-select v-model="tempDetail_event.instanDimen5" class="wd200" clearable disabled>
                      <el-option
                        v-for="(item, index ) in instanDimenOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('elmList.delayEffectiveSign')" prop="delayEffectiveSign">
                    <el-select v-model="tempDetail_event.delayEffectiveSign" class="wd200" clearable disabled>
                      <el-option
                        v-for="(item, index ) in delayEffectiveSignOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                
                <div class="text_title">{{$t('elmList.artifact_related_event')}}</div>
                <el-table
                    :data="detaiList_event"
                    class="mbtm20"
                    fit
                    highlight-current-row
                    style="width: 100%;"
                    border
                >
                <el-table-column prop="eventNo" :label="$t('evLstList.eventId')" align="center" />
                <el-table-column prop="eventDesc" :label="$t('evLstList.eventDesc')" align="center" />
              </el-table>
              <pagination v-show="eventTotal>0" class="page-name" :total="eventTotal" :page.sync="eventList.pageNum" :limit.sync="eventList.pageSize" @pagination="handleQueryEvent(tempDetail_event)" />
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleDetail_event = false">
                    {{$t('table.close')}}
                </el-button>
            </div>
        </el-dialog>


        <!-- 详情 -->
        <el-dialog :title="$t('elmList.artifact_detail')" :visible.sync="dialogFormVisibleDetail" width="65%">
            <el-form ref="dataFormDetail" :rules="rulesDetail_event" :model="tempDetail" >
                <el-form-item class="cl_td" :label="$t('elmList.artifactNo')" prop="artifactNo" >
                    <el-input v-model="tempDetail.artifactNo" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('elmList.artifactDesc')" prop="artifactDesc" >
                    <el-input v-model="tempDetail.artifactDesc" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('elmList.instanDimen1')" prop="instanDimen1">
                    <el-select v-model="tempDetail.instanDimen1" class="wd200" clearable disabled>
                      <el-option
                        v-for="(item, index ) in instanDimenOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('elmList.instanDimen2')" prop="instanDimen2">
                    <el-select v-model="tempDetail.instanDimen2" class="wd200" clearable disabled>
                      <el-option
                        v-for="(item, index ) in instanDimenOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('elmList.instanDimen3')" prop="instanDimen3">
                    <el-select v-model="tempDetail.instanDimen3" class="wd200" clearable disabled>
                      <el-option
                        v-for="(item, index ) in instanDimenOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('elmList.instanDimen4')" prop="instanDimen4">
                    <el-select v-model="tempDetail.instanDimen4" class="wd200" clearable disabled>
                      <el-option
                        v-for="(item, index ) in instanDimenOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('elmList.instanDimen5')" prop="instanDimen5">
                    <el-select v-model="tempDetail.instanDimen5" class="wd200" clearable disabled>
                      <el-option
                        v-for="(item, index ) in instanDimenOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('elmList.delayEffectiveSign')" prop="delayEffectiveSign">
                    <el-select v-model="tempDetail.delayEffectiveSign" class="wd200" clearable disabled>
                      <el-option
                        v-for="(item, index ) in delayEffectiveSignOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <div class="text_title">{{$t('elmList.base_related_element')}}</div>
                <el-table
                    :data="elementList_detail"
                    class="mbtm20"
                    fit
                    highlight-current-row
                    style="width: 100%;"
                    @row-click="queryPcdList_detail"
                    border
                >
                <el-table-column prop="elementNo" :label="$t('elementList.elementNo')" align="center" />
                <el-table-column prop="elementDesc" :label="$t('elementList.elementDesc')" align="center" />
                <el-table-column prop="performOrder" :label="$t('elementList.performOrder')" align="center" />
              </el-table>
              <div class="text_title">{{$t('elmList.can_choose_related_element')}}</div>
                <el-table
                    :data="choseElementList_detail"
                    class="mbtm20"
                    fit
                    highlight-current-row
                    style="width: 100%;"
                    @row-click="queryPcdList_detail"
                    border
                >
                <el-table-column prop="elementNo" :label="$t('elementList.elementNo')" align="center" />
                <el-table-column prop="elementDesc" :label="$t('elementList.elementDesc')" align="center" />
              </el-table>
              <div class="text_title">PCD</div>
                <el-table
                    :data="pcdList_detail"
                    class="mbtm20"
                    fit
                    highlight-current-row
                    style="width: 100%;"
                    border
                >
                <el-table-column prop="pcdNo" :label="$t('pcd.pcdNo')" align="center" />
                <el-table-column prop="pcdDesc" :label="$t('pcd.pcdDesc')" align="center" />
                <el-table-column prop="baseInstanDimen" :label="$t('pcd.baseInstanDimen')" align="center" />
                <el-table-column prop="optionInstanDimen" :label="$t('pcd.optionInstanDimen')" align="center" />
              </el-table>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleDetail = false">
                    {{$t('table.close')}}
                </el-button>
            </div>
        </el-dialog>



        <!-- 修改 -->
        <el-dialog :title="$t('elmList.edit_artifact_ele')" :visible.sync="dialogFormVisibleUp" width="65%">
            <el-form ref="dataFormUp" :rules="rulesUp" :model="tempUp" >
                <el-form-item class="cl_td" :label="$t('elmList.artifactNo')" prop="artifactNo" >
                    <el-input v-model="tempUp.artifactNo" class="wd200" type="text" readonly />
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('elmList.artifactNo')" prop="artifactDesc" >
                    <el-input v-model="tempUp.artifactDesc" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('elmList.instanDimen1')" prop="instanDimen1">
                    <el-select v-model="tempUp.instanDimen1" class="wd200" clearable>
                      <el-option
                        v-for="(item, index ) in instanDimenOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('elmList.instanDimen2')" prop="instanDimen2">
                    <el-select v-model="tempUp.instanDimen2" class="wd200" clearable>
                      <el-option
                        v-for="(item, index ) in instanDimenOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('elmList.instanDimen3')" prop="instanDimen3">
                    <el-select v-model="tempUp.instanDimen3" class="wd200" clearable>
                      <el-option
                        v-for="(item, index ) in instanDimenOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('elmList.instanDimen4')" prop="instanDimen4">
                    <el-select v-model="tempUp.instanDimen4" class="wd200" clearable>
                      <el-option
                        v-for="(item, index ) in instanDimenOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('elmList.instanDimen5')" prop="instanDimen5">
                    <el-select v-model="tempUp.instanDimen5" class="wd200" clearable>
                      <el-option
                        v-for="(item, index ) in instanDimenOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('elmList.delayEffectiveSign')" prop="delayEffectiveSign">
                    <el-select v-model="tempUp.delayEffectiveSign" class="wd200" clearable>
                      <el-option
                        v-for="(item, index ) in delayEffectiveSignOptions"
                        :key="index"
                        :label="item.detailDesc"
                        :value="item.codes"
                      />
                    </el-select>
                </el-form-item>
                <div class="text_title">{{$t('elmList.choose_element')}}</div>
                <el-form-item class="cl_td" :label="$t('elementList.elementNo')" prop="elementNo">
                    <el-input v-model="tempUpElementSearchForm.elementNo" class="wd200" type="text" />
                </el-form-item>
                <el-form-item class="cl_td" :label="$t('elementList.elementDesc')" prop="elementDesc">
                    <el-input v-model="tempUpElementSearchForm.elementDesc" class="wd200" type="text" />
                </el-form-item>
                <div class="cl_tr text_center">
                    <el-button size="medium" icon="el-icon-search" type="primary" @click="tempUpSearch()">{{$t('search.search')}}</el-button>
                    <el-button size="medium" icon="el-icon-refresh" type="primary" @click="tempUprelatedHandle()">{{$t('search.related')}}</el-button>
                </div>
                <el-table
                    :data="elementList_up"
                    class="mbtm20"
                    fit
                    highlight-current-row
                    style="width: 100%;"
                    @selection-change="up_elementSelectChange"
                    border
                >
                <el-table-column type="selection" width="55"></el-table-column>
                <el-table-column prop="elementNo" :label="$t('elementList.elementNo')" align="center" />
                <el-table-column prop="elementDesc" :label="$t('elementList.elementDesc')" align="center" />
                <el-table-column prop="pcdNo" :label="$t('pcd.pcdNo')" align="center" />
                <el-table-column prop="pcdDesc" :label="$t('pcd.pcdDesc')" align="center" />
              </el-table>
                <pagination v-show="elementTotal_up>0" :total="elementTotal_up" :page.sync="tempUp.pageNum" :limit.sync="tempUp.pageSize" @pagination="getElementList_up(tempUp)" />

              <div class="text_title">{{$t('elmList.related_element')}}</div>
                <el-table
                    :data="relatedElementList_up"
                    class="mbtm20"
                    fit
                    highlight-current-row
                    style="width: 100%;"
                    border
                >
                    <el-table-column type="index" :label="$t('table.index')" align="center" />
                    <el-table-column prop="elementNo" :label="$t('elementList.elementNo')" align="center" />
                    <el-table-column prop="elementDesc" :label="$t('elementList.elementDesc')" align="center" />
                    <el-table-column prop="pcdNo" :label="$t('pcd.pcdNo')" align="center" />
                    <el-table-column prop="pcdDesc" :label="$t('pcd.pcdDesc')" align="center" />
                    <el-table-column prop="eventNo" :label="$t('table.up_down')" align="center" />
                    <el-table-column prop="" :label="$t('table.action')" align="center" >
                        <template slot-scope="{$index}">
                            <el-button size="mini" icon="el-icon-delete"   type="primary" @click="handleDelete($index)">{{$t('table.delete')}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisibleUp = false">
                    {{$t('table.cancel')}}
                </el-button>
                <el-button type="primary" @click="updateData()">
                    {{$t('table.sure')}}
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import Pagination from "@/components/Pagination";
export default {
  name: 'avyList',
  components: {
    // eslint-disable-next-line vue/no-unused-components
    Pagination,
  },
  data() {
    const generateData = _ => {
        const componentData = [] // 相当于data
        const componentNoList = [] // 
        const componentList = []
        this.post('/beta/betaService/COS.IQ.02.0009', {} ,(res) => {
            res.returnData.rows.forEach((item, i) => {
                componentList.push(item.elementNo+' '+item.elementDesc)
                componentNoList.push(item.elementNo)
            })
            componentList.forEach((component, index) => {
                componentData.push({
                    label: component,
                    // key: index,
                    key: component.split(' ')[0],
                    artifactNo: componentNoList[index]
                });
            });
        })
        return componentData;  
    };
    return {
        artifactSearchForm: {
            pageNum: 1,
            pageSize:10,
        },
        eventList:{
            pageNum: 1,
            pageSize:10,
        },
        eventTotal: 0,
      artifactSearchFormRules: {},
      artifactList: [],
      artifactTotal: 0,
      
      listLoading1: false,
      selBtnFlag: false,
      addBtnFlag: false,
      updBtnFlag: false,
      btnAuthStr: '',

      tempAdd: {}, // 新增
      tempUp: {
        pageNum: 1, 
        pageSize: 10, 
      }, // 修改
      tempDetail: {}, // 详情
      tempDetail_activity: {}, //
      tempDetail_event: {}, //
      dialogFormVisibleAdd: false,
      dialogFormVisibleUp: false,
      dialogFormVisibleDetail: false,
      dialogFormVisibleDetail_activity: false,//查询活动
      dialogFormVisibleDetail_event: false,//查询活动
      rulesAdd: {},
      rulesDetail: {},
      rulesUp: {},
      rulesDetail_activity: {},
      rulesDetail_event: {},
      instanDimenOptions: [], // 维度取值
      delayEffectiveSignOptions: [],
      add_allComponentData: generateData(),
      filterMethod(query, item) {
        return item.artifactNo.indexOf(query) > -1;
      },
      detaiList_activity: [] ,// 查询活动列表
      detaiList_event: [] ,// 查询事件列表
      // 详情
      elementList_detail: [], //
      choseElementList_detail: [], //
      pcdList_detail: [], //
      // 修改
      tempUpElementSearchForm: {}, // 搜索条件
      elementTotal_up : 0 ,
      elementList_up: [] , // 选择元件
      relatedElementContainer: [] , // 选择的元件容器
      relatedElementList_up: [] , // 已关联元件
    }
  },
  created() {
    // this.init()
    this.getBtnAuth()
  },
  mounted() {
    this.getArtifactList()
    // 构件维度取值
    this.getSelectDict('dic_dimensionalValue').then((res) => {
        // console.log(res)
      this.instanDimenOptions = res
    })
    // 延迟生效标识
    this.getSelectDict('dic_delayIdentification').then((res) => {
        // console.log(res)
      this.delayEffectiveSignOptions = res
    })
  },
  methods: {
    // 查询按钮权限
    getBtnAuth() {
        // console.log(window.sessionStorage.getItem('menuNo'))
        let params= {
            menuNo : window.sessionStorage.getItem('menuNo')
        }
        this.artifactSearchForm = Object.assign(this.artifactSearchForm,params)
        this.getTableList('/beta/betaService/COS.CS.01.0030', params ,(res) => {
            if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.length > 0 ) {
                    res.returnData.forEach(item => {
                        this.btnAuthStr += item.eventNo+','
                    })
                    // console.log(this.btnAuthStr)
                    if (this.btnAuthStr.includes('COS.IQ.02.0007')) { // 查询
                        this.selBtnFlag = true
                    } else {
                        this.selBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.AD.02.0007')) { // 新增
                        this.addBtnFlag = true
                    } else {
                        this.addBtnFlag = false
                    }
                    if (this.btnAuthStr.includes('COS.UP.02.0007')) { // 维护
                        this.updBtnFlag = true
                    } else {
                        this.updBtnFlag = false
                    }
                }
            }
        })
    },
    // 活动清单
    getArtifactList() {
        this.listLoading1 = true
        let obj = {
            isTrans: true,
            transParams:['dic_dimensionalValue','dic_dimensionalValue','dic_dimensionalValue','dic_dimensionalValue','dic_dimensionalValue'],
            transDict : ['instanDimen1','instanDimen2','instanDimen3','instanDimen4','instanDimen5']
        }
        this.artifactSearchForm = Object.assign(this.artifactSearchForm, obj)
        this.getTableList('/beta/betaService/COS.IQ.02.0007', this.artifactSearchForm ,(res) => {
            this.listLoading1 = false
        	if (res.returnCode == '000000') {
                if (res.returnData && res.returnData.rows && res.returnData.rows.length > 0 ) {
                    this.artifactList = res.returnData.rows
                    this.artifactTotal = res.returnData.totalCount
				}else{
                	this.artifactList = []
                	this.artifactTotal = 0
                }
            }
        }, (err) => {
        	this.artifactList = []
        	this.artifactTotal = 0
        	this.listLoading1 = false
        })

    },
    handleSearch() {
        this.artifactSearchForm.pageNum = 1
        this.artifactSearchForm.pageSize = 10
        this.getArtifactList()
    },
    handleCreate() {
        this.dialogFormVisibleAdd = true
      this.$nextTick(() => {
        this.$refs['dataFormAdd'].clearValidate()
      })
    }, 
    createData() {
        this.$refs['dataFormAdd'].validate((valid) => {
            if (valid) {
                var i = 0;
				for ( var key in this.tempAdd){
					if(key.indexOf('instanDimen') > -1 && key.indexOf('Count') == -1){
						if(this.tempAdd[key] != null && this.tempAdd[key] != ""){
							i++;
						}
                    }
                }
				this.tempAdd.instanDimenCount = i;
                this.tempAdd.elementlist = []
                this.tempAdd.elementlistAddPage.forEach((item , k) => {
                    this.tempAdd.elementlist.push({"elementNo":item})
                })
                delete this.tempAdd.elementlistAddPage
	            this.post('/beta/betaService/COS.AD.02.0007', this.tempAdd, (res) => {
                    if (res.returnCode == '000000') {
                        this.dialogFormVisibleAdd = false
                        this.$notify({
                        message: this.$t('table.add_success'),
                        type: 'success',
                        })
                        this.getArtifactList()
                        this.tempAdd = {}
                    }
	            })
            }
        })
    },
    handleDetail(row) {
        this.tempDetail = Object.assign({}, row)
        // 基础关联元件
        this.post('/beta/betaService/COS.IQ.02.0008', {artifactNo: row.artifactNo}, (res) => {
            if( res.returnData && res.returnData.rows) {
                this.elementList_detail = res.returnData.rows
                let rows = res.returnData.rows
                for(var i=0;i< rows.length;i++){
                    for(var j=i+1;j< rows.length;j++){
                        if( rows[i].performOrder > rows[j].performOrder){
                            let elemt = rows[j];
                            rows[j] = rows[i];
                            rows[i] = elemt;
                        }
                    }
                }

                // 可选择关联元件
                this.post('/beta/betaService/COS.IQ.02.0009', {artifactNo: row.artifactNo, elementList : this.elementList_detail}, (res1) => {
                    if( res1.returnData && res1.returnData.rows) {
                        this.choseElementList_detail = res1.returnData.rows
                    } else {
                        this.choseElementList_detail = []
                    }
                })

                this.dialogFormVisibleDetail = true
                this.$nextTick(() => {
                    this.$refs['dataFormDetail'].clearValidate()
                })
            } else {
                this.elementList_detail = []
                this.dialogFormVisibleDetail = true
                this.$nextTick(() => {
                    this.$refs['dataFormDetail'].clearValidate()
                })
            }
        })
        
    },
    queryPcdList_detail( row ) {
        // pcd 
        this.post('/beta/betaService/COS.IQ.02.0010', {elementNo: row.elementNo}, (res) => {
            if( res.returnData && res.returnData.rows) {
                this.pcdList_detail = res.returnData.rows
                this.dialogFormVisibleDetail = true
                this.$nextTick(() => {
                    this.$refs['dataFormDetail'].clearValidate()
                })
            } else {
                this.pcdList_detail = []
                this.dialogFormVisibleDetail = true
                this.$nextTick(() => {
                    this.$refs['dataFormDetail'].clearValidate()
                })
            }
        })
    },
    // 查询活动
    handleQueryActivity(row) {
        this.tempDetail_activity = Object.assign({}, row)
        // 查询已有构件
        this.post('/beta/betaService/COS.IQ.02.0070', {artifactNo: row.artifactNo}, (res) => {
            if( res.returnData && res.returnData.rows) {
                this.detaiList_activity = res.returnData.rows
                this.dialogFormVisibleDetail_activity = true
                this.$nextTick(() => {
                    this.$refs['dataFormDetail_activity'].clearValidate()
                })
            } else {
                this.detaiList_activity = []
                this.dialogFormVisibleDetail_activity = true
                this.$nextTick(() => {
                    this.$refs['dataFormDetail_activity'].clearValidate()
                })
            }
        })
    },
    // 查询事件
    handleQueryEvent(row) {
        this.tempDetail_event = Object.assign({}, row)
        // 查询已有构件
        this.post('/beta/betaService/COS.IQ.02.0075', {artifactNo: row.artifactNo,pageNum:this.eventList.pageNum,pageSize:this.eventList.pageSize}, (res) => {
            if( res.returnData && res.returnData.rows) {
                this.detaiList_event = res.returnData.rows
                this.eventTotal = res.returnData.totalCount
                this.dialogFormVisibleDetail_event = true
                this.$nextTick(() => {
                    this.$refs['dataFormDetail_event'].clearValidate()
                })
            } else {
                this.detaiList_event = []
                this.eventTotal = 0
                this.dialogFormVisibleDetail_event = true
                this.$nextTick(() => {
                    this.$refs['dataFormDetail_event'].clearValidate()
                })
            }
        })
    },

    // 修改
    handleUpdate(row) {
        this.tempUp = row
        let obj1 = {
            pageNum: this.tempUp.pageNum, 
            pageSize: this.tempUp.pageSize, 
            artifactNo: this.tempUp.artifactNo
        }
        let obj2 = {
            pageNum: 1, 
            pageSize: this.tempUp.pageSize, 
            artifactNo: this.tempUp.artifactNo
        }
        this.getElementList_up(obj1)
        this.getRelatedElementList_up(obj2)
    }, 
    // 搜索
    tempUpSearch() {
        this.tempUpElementSearchForm.artifactNo = this.tempUp.artifactNo
        this.getElementList_up(this.tempUpElementSearchForm)
    },
    // 关联
    tempUprelatedHandle() {

        this.relatedElementList_up
        this.relatedElementContainer


        let isTip = false;//是否提示
        let tipStr = "";
        if (this.relatedElementContainer.length == 0) {
            this.$message({
                message: this.$t('elmList.js_chooseRelateEle'),
                type: 'warning'
            });
        }
        let items = this.relatedElementContainer;
        for (var i = 0; i < items.length; i++) {
            var isExist = false;						//是否存在
            for (var k = 0; k < this.relatedElementList_up.length; k++) {
                if (items[i].elementNo == this.relatedElementList_up[k].elementNo) {    //判断是否存在
                    tipStr = tipStr + items[i].elementNo + ",";
                    isTip = true;
                    isExist = true;
                    break;
                }
            }
            if(!isExist){
                this.relatedElementList_up.push(items[i]);	
            }
        }
        if(isTip){
            this.$message({
                message:  this.$t('elementList.elementNo') + tipStr.substring(0,tipStr.length-1) + this.$t('elmList.js_existednoadd'),
                type: 'warning'
            })
        }
    },
    // 点击选择元件 行
    up_elementSelectChange(val) {
        this.relatedElementContainer = val
    },
    // 查询元件
    getElementList_up(obj) {
        // this.tempUp.artifactNo = artifactNo
        this.post('/beta/betaService/COS.IQ.02.0009', obj, (res) => {
            if(res.returnCode == '000000') {
                this.dialogFormVisibleUp = true
                this.$nextTick(() => {
                    this.$refs['dataFormUp'].clearValidate()
                })
                this.$forceUpdate()
                if(res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                    this.elementList_up = res.returnData.rows
                    this.elementTotal_up = res.returnData.totalCount
                }else{
                	this.elementList_up = []
                	this.elementTotal_up  = 0
                }
            } else {
                this.dialogFormVisibleUp = false
            }
        })
    },

    // 查询已关联元件
    getRelatedElementList_up(obj) {
        // this.tempUp.artifactNo = artifactNo
        this.post('/beta/betaService/COS.IQ.02.0008', obj, (res) => {
            if(res.returnCode == '000000') {
                this.dialogFormVisibleUp = true
                this.$nextTick(() => {
                    this.$refs['dataFormUp'].clearValidate()
                })
                this.$forceUpdate()
                if(res.returnData && res.returnData.rows && res.returnData.rows.length > 0) {
                    this.relatedElementList_up = res.returnData.rows
                }else{
                	 this.relatedElementList_up =[]
                }
            } else {
                this.dialogFormVisibleUp = false
            }
        })
    },
    // 确定修改
    updateData(row) {
        this.$refs['dataFormUp'].validate((valid) => {
            if (valid) {
                let key 
                let i = 0
                for (key in this.tempUp){
                    if(key.indexOf('instanDimen') > -1 && key.indexOf('Count') == -1){
                        if(this.tempUp[key] != null && this.tempUp[key] != ""){
                            i++
                        }
                    }
                }
                this.tempUp.instanDimenCount = i / 2;
                this.tempUp.elementlist = this.relatedElementList_up
                this.post('/beta/betaService/COS.UP.02.0007', this.tempUp, (res) => {
                    if (res.returnCode == '000000') {
                        this.dialogFormVisibleUp = false
                        this.$notify({
                        message: this.$t('table.up_success'),
                        type: 'success',
                        })
                        this.getArtifactList()
                        this.tempUp = {}
                    }
                })
            }
        })
    },
    // 删除关联元件
    handleDelete (data) {
        this.$confirm( this.$t('table.confirm_text'), this.$t('table.tips'), {
            confirmButtonText: this.$t('table.sure'),
            cancelButtonText: this.$t('table.cancel'),
            type: 'warning'
        }).then(() => {
            this.relatedElementList_up.splice(data, 1);
        })
       
    },

  },
}
</script>

<style>
     /* 穿梭框 文字显示完全 */
    .el-transfer-panel__item.el-checkbox .el-checkbox__:label {
        overflow: visible;
        white-space: nowrap;
    }
    /* 穿梭框样式 */
    .el-transfer-panel {
        width: 37%;
    }
</style>
